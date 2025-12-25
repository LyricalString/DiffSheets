import type { ParsedSpreadsheet, Row, SheetData } from "./spreadsheet";

/**
 * Available merge modes
 */
export type MergeMode =
  | "combine-workbooks" // Each file becomes a separate sheet in the output
  | "append-rows" // Stack rows vertically from all files
  | "append-columns"; // Place columns side by side

/**
 * Strategy for naming sheets in combine-workbooks mode
 */
export type SheetNamingStrategy = "original" | "numbered" | "filename";

/**
 * State of a single file in the merge queue
 */
export interface MergeFileState {
  id: string;
  file: File | null;
  parsed: ParsedSpreadsheet | null;
  selectedSheet: string;
  isLoading: boolean;
  error: string | null;
  order: number;
}

/**
 * Options for the merge operation
 */
export interface MergeOptions {
  mode: MergeMode;
  /** For append-rows: whether to include headers from files 2+ */
  includeHeaders: boolean;
  /** For combine-workbooks: how to name the output sheets */
  sheetNamingStrategy: SheetNamingStrategy;
  /** Name of the output file (without extension) */
  outputFilename: string;
}

/**
 * Preview information for a single sheet in the merge result
 */
export interface MergeSheetPreview {
  name: string;
  rowCount: number;
  columnCount: number;
  sampleRows: Row[];
}

/**
 * Preview of the merge result
 */
export interface MergePreview {
  sheets: MergeSheetPreview[];
  totalSheets: number;
  totalRows: number;
  totalColumns: number;
}

/**
 * Result of a merge operation
 */
export interface MergeResult {
  workbook: import("xlsx").WorkBook;
  preview: MergePreview;
}

/**
 * Default merge options
 */
export const defaultMergeOptions: MergeOptions = {
  mode: "combine-workbooks",
  includeHeaders: false,
  sheetNamingStrategy: "filename",
  outputFilename: "merged",
};

/**
 * Helper to generate a unique sheet name avoiding duplicates
 */
export function generateUniqueSheetName(
  baseName: string,
  existingNames: Set<string>,
  maxLength = 31, // Excel sheet name limit
): string {
  // Truncate to max length
  let name = baseName.slice(0, maxLength);

  if (!existingNames.has(name)) {
    return name;
  }

  // Try adding a number suffix
  let counter = 1;
  const baseForSuffix = name.slice(0, maxLength - 4); // Leave room for "_999"

  while (existingNames.has(name)) {
    name = `${baseForSuffix}_${counter}`;
    counter++;
    if (counter > 999) {
      throw new Error(`Too many sheets with name "${baseName}"`);
    }
  }

  return name;
}

/**
 * Get the sheet name based on naming strategy
 */
export function getSheetName(
  file: MergeFileState,
  index: number,
  strategy: SheetNamingStrategy,
  existingNames: Set<string>,
): string {
  let baseName: string;

  switch (strategy) {
    case "original":
      baseName = file.selectedSheet || `Sheet${index + 1}`;
      break;
    case "numbered":
      baseName = `Sheet${index + 1}`;
      break;
    case "filename":
      // Remove extension from filename
      baseName = file.file?.name.replace(/\.[^.]+$/, "") || `Sheet${index + 1}`;
      break;
    default:
      baseName = `Sheet${index + 1}`;
  }

  return generateUniqueSheetName(baseName, existingNames);
}
