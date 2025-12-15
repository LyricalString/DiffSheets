/**
 * Re-export row alignment functions from the shared diff-core package
 * The sync version is used for MCP since blocking is acceptable
 */

import {
  alignRowsSync,
  type RowAlignment,
  type ComparisonOptions,
  type Row,
} from "@diffsheets/diff-core";

/**
 * Main function to align rows based on strategy (sync version for MCP)
 */
export function alignRows(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): RowAlignment[] {
  return alignRowsSync(originalRows, modifiedRows, options);
}

export type { RowAlignment };
