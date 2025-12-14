import { diffChars } from "diff";
import type {
  Cell,
  CellChangeType,
  CellValue,
  ComparisonOptions,
  DiffCell,
  InlineDiff,
} from "@/types";

/**
 * Normalize cell value for comparison based on options
 */
function normalizeValue(value: CellValue, options: ComparisonOptions): string {
  if (value === null || value === undefined) return "";

  let str = String(value);

  if (options.ignoreWhitespace) {
    str = str.replace(/\s+/g, " ").trim();
  }

  if (options.ignoreCase) {
    str = str.toLowerCase();
  }

  return str;
}

/**
 * Compare two cell values and return if they are equal
 */
export function areCellsEqual(
  original: Cell | null,
  modified: Cell | null,
  options: ComparisonOptions,
): boolean {
  const origValue = original?.value ?? null;
  const modValue = modified?.value ?? null;

  // Both empty
  if ((origValue === null || origValue === "") && (modValue === null || modValue === "")) {
    return true;
  }

  // One is empty, other is not
  if ((origValue === null || origValue === "") !== (modValue === null || modValue === "")) {
    return false;
  }

  // Compare formulas if option enabled
  if (options.compareFormulas) {
    const origFormula = original?.formula || "";
    const modFormula = modified?.formula || "";
    if (origFormula !== modFormula) {
      return false;
    }
  }

  // Normalize and compare
  return normalizeValue(origValue, options) === normalizeValue(modValue, options);
}

/**
 * Generate inline diff for text changes
 */
export function generateInlineDiff(
  originalValue: CellValue,
  modifiedValue: CellValue,
): InlineDiff[] {
  const origStr = originalValue === null ? "" : String(originalValue);
  const modStr = modifiedValue === null ? "" : String(modifiedValue);

  const changes = diffChars(origStr, modStr);

  return changes.map((change) => ({
    type: change.added ? "added" : change.removed ? "removed" : "unchanged",
    value: change.value,
  }));
}

/**
 * Determine cell change type
 */
export function getCellChangeType(
  original: Cell | null,
  modified: Cell | null,
  options: ComparisonOptions,
): CellChangeType {
  const origEmpty = !original || original.value === null || original.value === "";
  const modEmpty = !modified || modified.value === null || modified.value === "";

  if (origEmpty && modEmpty) return "unchanged";
  if (origEmpty && !modEmpty) return "added";
  if (!origEmpty && modEmpty) return "removed";

  if (areCellsEqual(original, modified, options)) {
    return "unchanged";
  }

  return "modified";
}

/**
 * Compare two cells and return diff result
 */
export function compareCells(
  columnIndex: number,
  original: Cell | null,
  modified: Cell | null,
  options: ComparisonOptions,
): DiffCell {
  const changeType = getCellChangeType(original, modified, options);

  const result: DiffCell = {
    columnIndex,
    original,
    modified,
    changeType,
  };

  // Generate inline diff for modified text cells
  if (changeType === "modified" && original?.type === "string" && modified?.type === "string") {
    result.inlineDiff = generateInlineDiff(original.value, modified.value);
  }

  return result;
}
