import type { Cell, ComparisonOptions, MatchingStrategy, Row } from "@/types";

interface RowSignature {
  index: number;
  hash: string;
  values: string[];
}

interface RowAlignment {
  originalIndex: number | null;
  modifiedIndex: number | null;
  type: "matched" | "added" | "removed";
}

/**
 * Generate a hash signature for a row
 */
function generateRowHash(row: Row, options: ComparisonOptions): string {
  const values = row.map((cell) => {
    if (cell.value === null || cell.value === "") return "";
    let str = String(cell.value);
    if (options.ignoreWhitespace) str = str.replace(/\s+/g, " ").trim();
    if (options.ignoreCase) str = str.toLowerCase();
    return str;
  });
  return values.join("|");
}

/**
 * Generate signatures for all rows
 */
function generateSignatures(rows: Row[], options: ComparisonOptions): RowSignature[] {
  return rows.map((row, index) => ({
    index,
    hash: generateRowHash(row, options),
    values: row.map((cell) => (cell.value === null ? "" : String(cell.value))),
  }));
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
  options: ComparisonOptions,
): RowAlignment[] {
  const alignments: RowAlignment[] = [];
  const usedModifiedIndices = new Set<number>();

  // Build a map of modified rows by key value
  const modifiedByKey = new Map<string, number[]>();
  modifiedRows.forEach((row, index) => {
    const keyCell = row[keyColumnIndex];
    let keyValue = keyCell?.value === null ? "" : String(keyCell?.value ?? "");
    if (options.ignoreCase) keyValue = keyValue.toLowerCase();
    if (options.ignoreWhitespace) keyValue = keyValue.trim();

    if (!modifiedByKey.has(keyValue)) {
      modifiedByKey.set(keyValue, []);
    }
    modifiedByKey.get(keyValue)!.push(index);
  });

  // Match original rows to modified rows by key
  for (let i = 0; i < originalRows.length; i++) {
    const keyCell = originalRows[i][keyColumnIndex];
    let keyValue = keyCell?.value === null ? "" : String(keyCell?.value ?? "");
    if (options.ignoreCase) keyValue = keyValue.toLowerCase();
    if (options.ignoreWhitespace) keyValue = keyValue.trim();

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
 * LCS-based alignment using Myers' diff algorithm
 * Finds the longest common subsequence and uses it to align rows
 */
function lcsBasedAlignment(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
): RowAlignment[] {
  const origSigs = generateSignatures(originalRows, options);
  const modSigs = generateSignatures(modifiedRows, options);

  // Build LCS table
  const m = origSigs.length;
  const n = modSigs.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origSigs[i - 1].hash === modSigs[j - 1].hash) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find alignment
  const alignments: RowAlignment[] = [];
  let i = m;
  let j = n;

  const tempAlignments: RowAlignment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origSigs[i - 1].hash === modSigs[j - 1].hash) {
      tempAlignments.unshift({
        originalIndex: i - 1,
        modifiedIndex: j - 1,
        type: "matched",
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempAlignments.unshift({
        originalIndex: null,
        modifiedIndex: j - 1,
        type: "added",
      });
      j--;
    } else {
      tempAlignments.unshift({
        originalIndex: i - 1,
        modifiedIndex: null,
        type: "removed",
      });
      i--;
    }
  }

  return tempAlignments;
}

/**
 * Main function to align rows based on strategy
 */
export function alignRows(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions,
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
      return lcsBasedAlignment(originalRows, modifiedRows, options);

    case "position":
    default:
      return positionBasedAlignment(originalRows, modifiedRows);
  }
}

export type { RowAlignment };
