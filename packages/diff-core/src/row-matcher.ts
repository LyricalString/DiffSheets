import type { ComparisonOptions, Row, RowAlignment } from "./types.js";
import {
  calculateDynamicThreshold,
  profileColumns,
  weightedRowSimilarity,
} from "./column-profiler.js";
import { hungarian, hungarianAsync } from "./hungarian.js";

/**
 * Check if a row is empty (all cells are null, undefined, or empty string)
 */
function isRowEmpty(row: Row): boolean {
  return row.every((cell) => {
    const value = cell?.value;
    return value === null || value === undefined || value === "";
  });
}

/**
 * Position-based alignment - simple 1:1 mapping
 */
function positionBasedAlignment(originalRows: Row[], modifiedRows: Row[]): RowAlignment[] {
  const maxLength = Math.max(originalRows.length, modifiedRows.length);
  const alignments: RowAlignment[] = [];

  for (let i = 0; i < maxLength; i++) {
    const hasOriginal = i < originalRows.length;
    const hasModified = i < modifiedRows.length;

    if (hasOriginal && hasModified) {
      alignments.push({
        originalIndex: i,
        modifiedIndex: i,
        type: "matched",
      });
    } else if (hasOriginal) {
      alignments.push({
        originalIndex: i,
        modifiedIndex: null,
        type: "removed",
      });
    } else {
      alignments.push({
        originalIndex: null,
        modifiedIndex: i,
        type: "added",
      });
    }
  }

  return alignments;
}

/**
 * Key column-based alignment - match rows by key column value
 */
function keyColumnAlignment(
  originalRows: Row[],
  modifiedRows: Row[],
  keyColumnIndex: number,
  options: ComparisonOptions
): RowAlignment[] {
  const alignments: RowAlignment[] = [];
  const usedModifiedIndices = new Set<number>();

  // Build a map of modified rows by key value
  const modifiedByKey = new Map<string, number[]>();
  modifiedRows.forEach((row, index) => {
    const keyCell = row[keyColumnIndex];
    let keyValue = keyCell?.value === null ? "" : String(keyCell?.value ?? "");
    // Always trim key values - whitespace in keys is almost always a data quality issue
    keyValue = keyValue.trim();
    if (options.ignoreCase) keyValue = keyValue.toLowerCase();
    if (options.ignoreWhitespace) keyValue = keyValue.replace(/\s+/g, " ");

    if (!modifiedByKey.has(keyValue)) {
      modifiedByKey.set(keyValue, []);
    }
    modifiedByKey.get(keyValue)!.push(index);
  });

  // Match original rows to modified rows by key
  for (let i = 0; i < originalRows.length; i++) {
    const keyCell = originalRows[i][keyColumnIndex];
    let keyValue = keyCell?.value === null ? "" : String(keyCell?.value ?? "");
    // Always trim key values - whitespace in keys is almost always a data quality issue
    keyValue = keyValue.trim();
    if (options.ignoreCase) keyValue = keyValue.toLowerCase();
    if (options.ignoreWhitespace) keyValue = keyValue.replace(/\s+/g, " ");

    const matchingIndices = modifiedByKey.get(keyValue) || [];
    const availableIndex = matchingIndices.find((idx) => !usedModifiedIndices.has(idx));

    if (availableIndex !== undefined) {
      usedModifiedIndices.add(availableIndex);
      alignments.push({
        originalIndex: i,
        modifiedIndex: availableIndex,
        type: "matched",
      });
    } else {
      alignments.push({
        originalIndex: i,
        modifiedIndex: null,
        type: "removed",
      });
    }
  }

  // Add remaining modified rows as additions
  for (let i = 0; i < modifiedRows.length; i++) {
    if (!usedModifiedIndices.has(i)) {
      alignments.push({
        originalIndex: null,
        modifiedIndex: i,
        type: "added",
      });
    }
  }

  // Sort by position for display
  alignments.sort((a, b) => {
    const aPos = a.originalIndex ?? a.modifiedIndex ?? 0;
    const bPos = b.originalIndex ?? b.modifiedIndex ?? 0;
    return aPos - bPos;
  });

  return alignments;
}

/**
 * Hungarian Algorithm based matching for optimal global assignment (sync version)
 * Uses column profiling for weighted similarity
 */
function hungarianBasedAlignmentSync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): RowAlignment[] {
  // Phase 1: Profile columns to determine weights
  const columnProfiles = profileColumns(originalRows, modifiedRows, options);
  const weights = columnProfiles.map((p) => p.weight);

  // Phase 2: Filter out empty rows but track original indices
  const nonEmptyOrig = originalRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));
  const nonEmptyMod = modifiedRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));

  // If one side is empty, everything is added/removed
  if (nonEmptyOrig.length === 0) {
    return nonEmptyMod.map(({ idx }) => ({
      originalIndex: null,
      modifiedIndex: idx,
      type: "added" as const,
    }));
  }

  if (nonEmptyMod.length === 0) {
    return nonEmptyOrig.map(({ idx }) => ({
      originalIndex: idx,
      modifiedIndex: null,
      type: "removed" as const,
    }));
  }

  // Phase 3: Build cost matrix
  const n = Math.max(nonEmptyOrig.length, nonEmptyMod.length);
  const costMatrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    costMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i < nonEmptyOrig.length && j < nonEmptyMod.length) {
        const similarity = weightedRowSimilarity(
          nonEmptyOrig[i].row,
          nonEmptyMod[j].row,
          weights,
          options
        );
        costMatrix[i][j] = 1 - similarity; // Convert similarity to cost
      } else {
        costMatrix[i][j] = 1; // Maximum cost for padding (virtual rows)
      }
    }
  }

  // Phase 4: Run Hungarian algorithm
  const assignment = hungarian(costMatrix);

  // Phase 5: Calculate dynamic threshold
  const similarities: number[] = [];
  for (let i = 0; i < nonEmptyOrig.length; i++) {
    const j = assignment[i];
    if (j >= 0 && j < nonEmptyMod.length) {
      similarities.push(1 - costMatrix[i][j]);
    }
  }
  const threshold = calculateDynamicThreshold(similarities);

  // Phase 6: Convert assignment to alignments
  const alignments: RowAlignment[] = [];
  const usedMod = new Set<number>();

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    const j = assignment[i];
    const similarity = j >= 0 && j < nonEmptyMod.length ? 1 - costMatrix[i][j] : 0;

    if (j >= 0 && j < nonEmptyMod.length && similarity >= threshold) {
      alignments.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "matched",
      });
      usedMod.add(j);
    } else {
      alignments.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: null,
        type: "removed",
      });
    }
  }

  // Add unmatched modified rows as "added"
  for (let j = 0; j < nonEmptyMod.length; j++) {
    if (!usedMod.has(j)) {
      alignments.push({
        originalIndex: null,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "added",
      });
    }
  }

  // Sort by position for sensible display order
  alignments.sort((a, b) => {
    const aPos = a.originalIndex ?? a.modifiedIndex ?? 0;
    const bPos = b.originalIndex ?? b.modifiedIndex ?? 0;
    return aPos - bPos;
  });

  return alignments;
}

/**
 * Hungarian Algorithm based matching for optimal global assignment (async version)
 * Uses column profiling for weighted similarity
 */
async function hungarianBasedAlignmentAsync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
  yieldFn: () => Promise<void>
): Promise<RowAlignment[]> {
  // Phase 1: Profile columns to determine weights
  const columnProfiles = profileColumns(originalRows, modifiedRows, options);
  const weights = columnProfiles.map((p) => p.weight);

  // Phase 2: Filter out empty rows but track original indices
  const nonEmptyOrig = originalRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));
  const nonEmptyMod = modifiedRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));

  // If one side is empty, everything is added/removed
  if (nonEmptyOrig.length === 0) {
    return nonEmptyMod.map(({ idx }) => ({
      originalIndex: null,
      modifiedIndex: idx,
      type: "added" as const,
    }));
  }

  if (nonEmptyMod.length === 0) {
    return nonEmptyOrig.map(({ idx }) => ({
      originalIndex: idx,
      modifiedIndex: null,
      type: "removed" as const,
    }));
  }

  // Phase 3: Build cost matrix
  const n = Math.max(nonEmptyOrig.length, nonEmptyMod.length);
  const costMatrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    costMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i < nonEmptyOrig.length && j < nonEmptyMod.length) {
        const similarity = weightedRowSimilarity(
          nonEmptyOrig[i].row,
          nonEmptyMod[j].row,
          weights,
          options
        );
        costMatrix[i][j] = 1 - similarity;
      } else {
        costMatrix[i][j] = 1;
      }
    }

    // Yield periodically to keep UI responsive
    if (i % 50 === 0) {
      await yieldFn();
    }
  }

  // Phase 4: Run Hungarian algorithm
  const assignment = await hungarianAsync(costMatrix, yieldFn, 50);

  // Phase 5: Calculate dynamic threshold
  const similarities: number[] = [];
  for (let i = 0; i < nonEmptyOrig.length; i++) {
    const j = assignment[i];
    if (j >= 0 && j < nonEmptyMod.length) {
      similarities.push(1 - costMatrix[i][j]);
    }
  }
  const threshold = calculateDynamicThreshold(similarities);

  // Phase 6: Convert assignment to alignments
  const alignments: RowAlignment[] = [];
  const usedMod = new Set<number>();

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    const j = assignment[i];
    const similarity = j >= 0 && j < nonEmptyMod.length ? 1 - costMatrix[i][j] : 0;

    if (j >= 0 && j < nonEmptyMod.length && similarity >= threshold) {
      alignments.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "matched",
      });
      usedMod.add(j);
    } else {
      alignments.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: null,
        type: "removed",
      });
    }
  }

  // Add unmatched modified rows as "added"
  for (let j = 0; j < nonEmptyMod.length; j++) {
    if (!usedMod.has(j)) {
      alignments.push({
        originalIndex: null,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "added",
      });
    }
  }

  // Sort by position
  alignments.sort((a, b) => {
    const aPos = a.originalIndex ?? a.modifiedIndex ?? 0;
    const bPos = b.originalIndex ?? b.modifiedIndex ?? 0;
    return aPos - bPos;
  });

  return alignments;
}

/**
 * Greedy fallback for very large datasets (>1000 rows)
 * Uses column profiling but with O(n²) greedy matching instead of O(n³) Hungarian
 */
function greedyWeightedAlignmentSync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): RowAlignment[] {
  // Phase 1: Profile columns
  const columnProfiles = profileColumns(originalRows, modifiedRows, options);
  const weights = columnProfiles.map((p) => p.weight);

  // Phase 2: Filter out empty rows
  const nonEmptyOrig = originalRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));
  const nonEmptyMod = modifiedRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));

  // Phase 3: First pass - find high-confidence matches (anchors)
  const ANCHOR_THRESHOLD = 0.95;
  const anchors: RowAlignment[] = [];
  const usedOrig = new Set<number>();
  const usedMod = new Set<number>();

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    let bestMatch: { j: number; sim: number } | null = null;

    for (let j = 0; j < nonEmptyMod.length; j++) {
      if (usedMod.has(j)) continue;

      const sim = weightedRowSimilarity(
        nonEmptyOrig[i].row,
        nonEmptyMod[j].row,
        weights,
        options
      );

      if (sim >= ANCHOR_THRESHOLD && (!bestMatch || sim > bestMatch.sim)) {
        bestMatch = { j, sim };
      }
    }

    if (bestMatch) {
      anchors.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[bestMatch.j].idx,
        type: "matched",
      });
      usedOrig.add(i);
      usedMod.add(bestMatch.j);
    }
  }

  // Phase 4: Second pass - greedy matching for remaining rows
  const SIMILARITY_THRESHOLD = 0.5;
  const matches: RowAlignment[] = [...anchors];

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    if (usedOrig.has(i)) continue;

    let bestMatch: { j: number; sim: number } | null = null;

    for (let j = 0; j < nonEmptyMod.length; j++) {
      if (usedMod.has(j)) continue;

      const sim = weightedRowSimilarity(
        nonEmptyOrig[i].row,
        nonEmptyMod[j].row,
        weights,
        options
      );

      if (sim >= SIMILARITY_THRESHOLD && (!bestMatch || sim > bestMatch.sim)) {
        bestMatch = { j, sim };
      }
    }

    if (bestMatch) {
      matches.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[bestMatch.j].idx,
        type: "matched",
      });
      usedOrig.add(i);
      usedMod.add(bestMatch.j);
    }
  }

  // Phase 5: Add remaining as removed/added
  for (let i = 0; i < nonEmptyOrig.length; i++) {
    if (!usedOrig.has(i)) {
      matches.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: null,
        type: "removed",
      });
    }
  }

  for (let j = 0; j < nonEmptyMod.length; j++) {
    if (!usedMod.has(j)) {
      matches.push({
        originalIndex: null,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "added",
      });
    }
  }

  // Sort by position
  matches.sort((a, b) => {
    const aPos = a.originalIndex ?? a.modifiedIndex ?? 0;
    const bPos = b.originalIndex ?? b.modifiedIndex ?? 0;
    return aPos - bPos;
  });

  return matches;
}

/**
 * Greedy fallback async version
 */
async function greedyWeightedAlignmentAsync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
  yieldFn: () => Promise<void>
): Promise<RowAlignment[]> {
  const columnProfiles = profileColumns(originalRows, modifiedRows, options);
  const weights = columnProfiles.map((p) => p.weight);

  const nonEmptyOrig = originalRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));
  const nonEmptyMod = modifiedRows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => !isRowEmpty(row));

  const ANCHOR_THRESHOLD = 0.95;
  const anchors: RowAlignment[] = [];
  const usedOrig = new Set<number>();
  const usedMod = new Set<number>();

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    let bestMatch: { j: number; sim: number } | null = null;

    for (let j = 0; j < nonEmptyMod.length; j++) {
      if (usedMod.has(j)) continue;

      const sim = weightedRowSimilarity(
        nonEmptyOrig[i].row,
        nonEmptyMod[j].row,
        weights,
        options
      );

      if (sim >= ANCHOR_THRESHOLD && (!bestMatch || sim > bestMatch.sim)) {
        bestMatch = { j, sim };
      }
    }

    if (bestMatch) {
      anchors.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[bestMatch.j].idx,
        type: "matched",
      });
      usedOrig.add(i);
      usedMod.add(bestMatch.j);
    }

    if (i % 100 === 0) await yieldFn();
  }

  const SIMILARITY_THRESHOLD = 0.5;
  const matches: RowAlignment[] = [...anchors];

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    if (usedOrig.has(i)) continue;

    let bestMatch: { j: number; sim: number } | null = null;

    for (let j = 0; j < nonEmptyMod.length; j++) {
      if (usedMod.has(j)) continue;

      const sim = weightedRowSimilarity(
        nonEmptyOrig[i].row,
        nonEmptyMod[j].row,
        weights,
        options
      );

      if (sim >= SIMILARITY_THRESHOLD && (!bestMatch || sim > bestMatch.sim)) {
        bestMatch = { j, sim };
      }
    }

    if (bestMatch) {
      matches.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: nonEmptyMod[bestMatch.j].idx,
        type: "matched",
      });
      usedOrig.add(i);
      usedMod.add(bestMatch.j);
    }

    if (i % 100 === 0) await yieldFn();
  }

  for (let i = 0; i < nonEmptyOrig.length; i++) {
    if (!usedOrig.has(i)) {
      matches.push({
        originalIndex: nonEmptyOrig[i].idx,
        modifiedIndex: null,
        type: "removed",
      });
    }
  }

  for (let j = 0; j < nonEmptyMod.length; j++) {
    if (!usedMod.has(j)) {
      matches.push({
        originalIndex: null,
        modifiedIndex: nonEmptyMod[j].idx,
        type: "added",
      });
    }
  }

  matches.sort((a, b) => {
    const aPos = a.originalIndex ?? a.modifiedIndex ?? 0;
    const bPos = b.originalIndex ?? b.modifiedIndex ?? 0;
    return aPos - bPos;
  });

  return matches;
}

const HUNGARIAN_THRESHOLD = 1000;

/**
 * Smart alignment using Hungarian algorithm for optimal matching (sync version)
 * Falls back to greedy for very large datasets
 */
function smartAlignmentSync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): RowAlignment[] {
  const maxRows = Math.max(originalRows.length, modifiedRows.length);

  if (maxRows <= HUNGARIAN_THRESHOLD) {
    return hungarianBasedAlignmentSync(originalRows, modifiedRows, options);
  } else {
    return greedyWeightedAlignmentSync(originalRows, modifiedRows, options);
  }
}

/**
 * Smart alignment async version
 */
async function smartAlignmentAsync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
  yieldFn: () => Promise<void>
): Promise<RowAlignment[]> {
  const maxRows = Math.max(originalRows.length, modifiedRows.length);

  if (maxRows <= HUNGARIAN_THRESHOLD) {
    return hungarianBasedAlignmentAsync(originalRows, modifiedRows, options, yieldFn);
  } else {
    return greedyWeightedAlignmentAsync(originalRows, modifiedRows, options, yieldFn);
  }
}

/**
 * Main function to align rows based on strategy (sync version)
 * Use this for CLI/MCP where blocking is acceptable
 */
export function alignRowsSync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): RowAlignment[] {
  const strategy = options.matchingStrategy;

  switch (strategy) {
    case "key-column":
      if (options.keyColumnIndex !== undefined) {
        return keyColumnAlignment(originalRows, modifiedRows, options.keyColumnIndex, options);
      }
      // Fallback to position if no key column specified
      return positionBasedAlignment(originalRows, modifiedRows);

    case "lcs":
      // "lcs" now uses smart alignment with Hungarian algorithm
      return smartAlignmentSync(originalRows, modifiedRows, options);

    case "position":
    default:
      return positionBasedAlignment(originalRows, modifiedRows);
  }
}

/**
 * Main function to align rows based on strategy (async version)
 * Use this for web UI where non-blocking is important
 */
export async function alignRowsAsync(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
  yieldFn: () => Promise<void> = () => Promise.resolve()
): Promise<RowAlignment[]> {
  const strategy = options.matchingStrategy;

  switch (strategy) {
    case "key-column":
      if (options.keyColumnIndex !== undefined) {
        return keyColumnAlignment(originalRows, modifiedRows, options.keyColumnIndex, options);
      }
      return positionBasedAlignment(originalRows, modifiedRows);

    case "lcs":
      return smartAlignmentAsync(originalRows, modifiedRows, options, yieldFn);

    case "position":
    default:
      return positionBasedAlignment(originalRows, modifiedRows);
  }
}

// Legacy export for backwards compatibility
export const alignRows = alignRowsAsync;
