import type { Cell, CellValue } from "./spreadsheet";

export type RowChangeType = "unchanged" | "added" | "removed" | "modified";
export type CellChangeType = "unchanged" | "added" | "removed" | "modified";

export interface InlineDiff {
  type: "unchanged" | "added" | "removed";
  value: string;
}

export interface DiffCell {
  columnIndex: number;
  original: Cell | null;
  modified: Cell | null;
  changeType: CellChangeType;
  inlineDiff?: InlineDiff[];
}

export interface DiffRow {
  originalIndex: number | null;
  modifiedIndex: number | null;
  changeType: RowChangeType;
  cells: DiffCell[];
}

export interface ColumnDiff {
  index: number;
  letter: string;
  hasChanges: boolean;
}

export interface DiffSummary {
  totalRows: number;
  addedRows: number;
  removedRows: number;
  modifiedRows: number;
  unchangedRows: number;
  modifiedCells: number;
}

export interface DiffResult {
  rows: DiffRow[];
  columns: ColumnDiff[];
  summary: DiffSummary;
}

export type MatchingStrategy = "position" | "key-column" | "lcs";

export interface ComparisonOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  hideUnchangedRows: boolean;
  hideUnchangedColumns: boolean;
  compareFormulas: boolean;
  matchingStrategy: MatchingStrategy;
  keyColumnIndex?: number;
  /** Column indices to ignore when comparing (0-based) */
  ignoredColumns?: number[];
}

export const defaultComparisonOptions: ComparisonOptions = {
  ignoreWhitespace: false,
  ignoreCase: false,
  hideUnchangedRows: false,
  hideUnchangedColumns: false,
  compareFormulas: false,
  matchingStrategy: "lcs",
};
