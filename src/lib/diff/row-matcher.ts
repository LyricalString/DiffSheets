/**
 * Re-export row alignment functions from the shared diff-core package
 * The async version is used for web UI to keep the UI responsive
 */

import {
  alignRowsAsync,
  type RowAlignment,
  type ComparisonOptions,
  type Row,
} from "@diffsheets/diff-core";

/**
 * Utility to yield to main thread periodically during heavy computation
 */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Main function to align rows based on strategy
 * Returns a Promise to support async alignment algorithms
 */
export async function alignRows(
  originalRows: Row[],
  modifiedRows: Row[],
  options: ComparisonOptions
): Promise<RowAlignment[]> {
  return alignRowsAsync(originalRows, modifiedRows, options, yieldToMain);
}

export type { RowAlignment };
