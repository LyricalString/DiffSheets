// Spreadsheet types
export type CellValue = string | number | boolean | Date | null;

export interface Cell {
  value: CellValue;
  formula?: string;
  type: "string" | "number" | "boolean" | "date" | "empty";
}

export type Row = Cell[];

export interface Column {
  index: number;
  letter: string;
  width?: number;
}

export interface SheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface SheetData {
  name: string;
  rows: Row[];
  columns: Column[];
  headerRow: number;
}

export interface ParsedSpreadsheet {
  filename: string;
  fileSize: number;
  sheets: SheetInfo[];
  activeSheet: string;
  data: Map<string, SheetData>;
}

// Diff types
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
