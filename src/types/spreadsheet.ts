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

export interface FileUploadState {
  file: File | null;
  parsed: ParsedSpreadsheet | null;
  selectedSheet: string;
  headerRow: number;
  isLoading: boolean;
  error: string | null;
}
