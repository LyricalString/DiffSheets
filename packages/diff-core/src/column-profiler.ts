import type { ComparisonOptions, Row, ColumnProfile } from "./types.js";

/**
 * Normalize a cell value based on options
 */
export function normalizeValue(value: unknown, options: ComparisonOptions): string {
  if (value === null || value === undefined || value === "") return "";
  let str = String(value);
  if (options.ignoreWhitespace) str = str.replace(/\s+/g, " ").trim();
  if (options.ignoreCase) str = str.toLowerCase();
  return str;
}

/**
 * Check if a column should be ignored
 */
export function isColumnIgnored(columnIndex: number, options: ComparisonOptions): boolean {
  return options.ignoredColumns?.includes(columnIndex) ?? false;
}

/**
 * Analyze columns to determine their importance for matching.
 * Columns with more unique values and fewer empty cells are weighted higher.
 * Ignored columns get zero weight.
 */
export function profileColumns(
  rows1: Row[],
  rows2: Row[],
  options: ComparisonOptions
): ColumnProfile[] {
  const allRows = [...rows1, ...rows2];

  if (allRows.length === 0) {
    return [];
  }

  // Find maximum number of columns across all rows
  const numCols = Math.max(...allRows.map((r) => r.length), 0);

  if (numCols === 0) {
    return [];
  }

  const profiles: ColumnProfile[] = [];

  for (let col = 0; col < numCols; col++) {
    // Skip ignored columns - give them zero weight
    if (isColumnIgnored(col, options)) {
      profiles.push({
        index: col,
        uniqueRatio: 0,
        emptyRatio: 1,
        weight: 0,
      });
      continue;
    }

    const values = new Set<string>();
    let emptyCount = 0;
    let totalCount = 0;

    for (const row of allRows) {
      totalCount++;
      const cell = row[col];
      const value = normalizeValue(cell?.value, options);

      if (value === "") {
        emptyCount++;
      } else {
        values.add(value);
      }
    }

    const nonEmptyCount = totalCount - emptyCount;
    const uniqueRatio = nonEmptyCount > 0 ? values.size / nonEmptyCount : 0;
    const emptyRatio = totalCount > 0 ? emptyCount / totalCount : 1;

    // Weight = uniqueness * (1 - empty ratio)
    // Columns with unique values and few empty cells are better for matching
    const rawWeight = uniqueRatio * (1 - emptyRatio);

    profiles.push({
      index: col,
      uniqueRatio,
      emptyRatio,
      weight: rawWeight,
    });
  }

  // Normalize weights to sum to 1 (excluding ignored columns)
  const totalWeight = profiles.reduce((sum, p) => sum + p.weight, 0);

  if (totalWeight > 0) {
    for (const p of profiles) {
      p.weight = p.weight / totalWeight;
    }
  } else {
    // Fallback: equal weights for non-ignored columns
    const nonIgnoredCount = profiles.filter(
      (p) => !isColumnIgnored(p.index, options)
    ).length;
    const equalWeight = nonIgnoredCount > 0 ? 1 / nonIgnoredCount : 0;
    for (const p of profiles) {
      if (!isColumnIgnored(p.index, options)) {
        p.weight = equalWeight;
      }
    }
  }

  return profiles;
}

/**
 * Calculate weighted similarity between two rows.
 * Uses column weights to prioritize columns with unique values.
 * Ignored columns are skipped in comparison.
 */
export function weightedRowSimilarity(
  row1: Row,
  row2: Row,
  columnWeights: number[],
  options: ComparisonOptions
): number {
  const maxCols = Math.max(row1.length, row2.length, columnWeights.length);

  if (maxCols === 0) return 1;

  let score = 0;

  for (let i = 0; i < maxCols; i++) {
    // Skip ignored columns
    if (isColumnIgnored(i, options)) {
      continue;
    }

    const val1 = normalizeValue(row1[i]?.value, options);
    const val2 = normalizeValue(row2[i]?.value, options);
    const weight = columnWeights[i] ?? 0;

    if (val1 === val2) {
      score += weight;
    }
  }

  return score; // Already normalized since weights sum to 1
}

/**
 * Calculate dynamic threshold based on similarity distribution.
 * Uses mean - stddev, clamped to [0.3, 0.7]
 */
export function calculateDynamicThreshold(similarities: number[]): number {
  if (similarities.length === 0) return 0.5;

  // Calculate mean
  const mean = similarities.reduce((a, b) => a + b, 0) / similarities.length;

  // Calculate standard deviation
  const variance =
    similarities.reduce((sum, x) => sum + (x - mean) ** 2, 0) / similarities.length;
  const stddev = Math.sqrt(variance);

  // Threshold = mean - 1 stddev, but clamped to reasonable range
  return Math.max(0.3, Math.min(0.7, mean - stddev));
}
