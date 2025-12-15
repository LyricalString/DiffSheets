/**
 * Core types for spreadsheet diffing
 */

export type CellValue = string | number | boolean | Date | null;

export interface Cell {
  value: CellValue;
  formula?: string;
  type?: "string" | "number" | "boolean" | "date" | "empty";
}

export type Row = Cell[];

export type MatchingStrategy = "position" | "key-column" | "lcs";

export interface ComparisonOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  matchingStrategy: MatchingStrategy;
  keyColumnIndex?: number;
  /** Column indices to ignore when comparing (0-based) */
  ignoredColumns?: number[];
}

export interface RowAlignment {
  originalIndex: number | null;
  modifiedIndex: number | null;
  type: "matched" | "added" | "removed";
}

export interface ColumnProfile {
  index: number;
  uniqueRatio: number;
  emptyRatio: number;
  weight: number;
}

export const defaultComparisonOptions: ComparisonOptions = {
  ignoreWhitespace: false,
  ignoreCase: false,
  matchingStrategy: "position",
};
