import type {
  ColumnDiff,
  ComparisonOptions,
  DiffCell,
  DiffResult,
  DiffRow,
  DiffSummary,
  RowChangeType,
  SheetData,
} from "../types.js";
import { compareCells } from "./cell-diff.js";
import { alignRows, type RowAlignment } from "./row-matcher.js";

export { areCellsEqual, compareCells } from "./cell-diff.js";
export { alignRows } from "./row-matcher.js";

/**
 * Compare two rows cell by cell
 */
function compareRows(
  alignment: RowAlignment,
  originalData: SheetData,
  modifiedData: SheetData,
  options: ComparisonOptions,
): { cells: DiffCell[]; changeType: RowChangeType; modifiedCellCount: number } {
  const maxCols = Math.max(originalData.columns.length, modifiedData.columns.length);

  let hasChanges = false;
  let modifiedCellCount = 0;

  const origRow =
    alignment.originalIndex !== null ? originalData.rows[alignment.originalIndex] : null;
  const modRow =
    alignment.modifiedIndex !== null ? modifiedData.rows[alignment.modifiedIndex] : null;

  const cells: DiffCell[] = [];
  for (let colIdx = 0; colIdx < maxCols; colIdx++) {
    const origCell = origRow?.[colIdx] ?? null;
    const modCell = modRow?.[colIdx] ?? null;
    const cellDiff = compareCells(colIdx, origCell, modCell, options);
    cells.push(cellDiff);

    if (cellDiff.changeType !== "unchanged") {
      hasChanges = true;
      if (cellDiff.changeType === "modified") {
        modifiedCellCount++;
      }
    }
  }

  let changeType: RowChangeType;
  if (alignment.type === "added") {
    changeType = "added";
  } else if (alignment.type === "removed") {
    changeType = "removed";
  } else if (hasChanges) {
    changeType = "modified";
  } else {
    changeType = "unchanged";
  }

  return { cells, changeType, modifiedCellCount };
}

/**
 * Get column letter from index (0 -> A, 1 -> B, ..., 26 -> AA, etc.)
 */
function getColumnLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Compute column diff information
 */
function computeColumnDiffs(
  diffRows: DiffRow[],
  originalData: SheetData,
  modifiedData: SheetData,
): ColumnDiff[] {
  const maxCols = Math.max(originalData.columns.length, modifiedData.columns.length);

  const columnHasChanges: boolean[] = Array(maxCols).fill(false);

  for (const row of diffRows) {
    for (const cell of row.cells) {
      if (cell.changeType !== "unchanged") {
        columnHasChanges[cell.columnIndex] = true;
      }
    }
  }

  return columnHasChanges.map((hasChanges, index) => ({
    index,
    letter: getColumnLetter(index),
    hasChanges,
  }));
}

/**
 * Compute diff summary statistics
 */
function computeSummary(diffRows: DiffRow[]): DiffSummary {
  let addedRows = 0;
  let removedRows = 0;
  let modifiedRows = 0;
  let unchangedRows = 0;
  let modifiedCells = 0;

  for (const row of diffRows) {
    switch (row.changeType) {
      case "added":
        addedRows++;
        break;
      case "removed":
        removedRows++;
        break;
      case "modified":
        modifiedRows++;
        // Count modified cells
        for (const cell of row.cells) {
          if (cell.changeType === "modified") {
            modifiedCells++;
          }
        }
        break;
      case "unchanged":
        unchangedRows++;
        break;
    }
  }

  return {
    totalRows: diffRows.length,
    addedRows,
    removedRows,
    modifiedRows,
    unchangedRows,
    modifiedCells,
  };
}

/**
 * Main diff function - compares two spreadsheets
 */
export function computeSpreadsheetDiff(
  originalData: SheetData,
  modifiedData: SheetData,
  options: ComparisonOptions,
): DiffResult {
  // Step 1: Align rows based on matching strategy
  const alignments = alignRows(originalData.rows, modifiedData.rows, options);

  // Step 2: Compare each aligned row pair
  const diffRows: DiffRow[] = alignments.map((alignment) => {
    const { cells, changeType } = compareRows(alignment, originalData, modifiedData, options);

    return {
      originalIndex: alignment.originalIndex,
      modifiedIndex: alignment.modifiedIndex,
      changeType,
      cells,
    };
  });

  // Step 3: Compute column diffs
  const columns = computeColumnDiffs(diffRows, originalData, modifiedData);

  // Step 4: Compute summary
  const summary = computeSummary(diffRows);

  return {
    rows: diffRows,
    columns,
    summary,
  };
}

/**
 * Filter diff rows based on options
 */
export function filterDiffRows(diffResult: DiffResult, options: ComparisonOptions): DiffRow[] {
  let rows = diffResult.rows;

  if (options.hideUnchangedRows) {
    rows = rows.filter((row) => row.changeType !== "unchanged");
  }

  return rows;
}

/**
 * Filter columns based on options
 */
export function filterDiffColumns(diffResult: DiffResult, options: ComparisonOptions): number[] {
  if (!options.hideUnchangedColumns) {
    return diffResult.columns.map((col) => col.index);
  }

  return diffResult.columns.filter((col) => col.hasChanges).map((col) => col.index);
}
