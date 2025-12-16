import type { Row, SheetData } from "@/types/spreadsheet";
import type {
  MergeFileState,
  MergeOptions,
  MergePreview,
  MergeResult,
  MergeSheetPreview,
} from "@/types/merge";
import { getSheetName } from "@/types/merge";

// Lazy load xlsx library
let XLSX: typeof import("xlsx") | null = null;

export async function getXLSX() {
  if (!XLSX) {
    XLSX = await import("xlsx");
  }
  return XLSX;
}

/**
 * Convert SheetData rows to xlsx-compatible array of arrays
 */
function sheetDataToAoA(data: SheetData): unknown[][] {
  return data.rows.map((row) => row.map((cell) => cell.value));
}

/**
 * Get SheetData from a MergeFileState
 */
function getSheetData(file: MergeFileState): SheetData | null {
  if (!file.parsed || !file.selectedSheet) return null;
  return file.parsed.data.get(file.selectedSheet) || null;
}

/**
 * Combine multiple files into a single workbook with each file as a separate sheet
 */
async function combineWorkbooks(
  files: MergeFileState[],
  options: MergeOptions,
): Promise<import("xlsx").WorkBook> {
  const xlsx = await getXLSX();
  const workbook = xlsx.utils.book_new();
  const usedNames = new Set<string>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sheetData = getSheetData(file);

    if (!sheetData) continue;

    const sheetName = getSheetName(file, i, options.sheetNamingStrategy, usedNames);
    usedNames.add(sheetName);

    const aoa = sheetDataToAoA(sheetData);
    const worksheet = xlsx.utils.aoa_to_sheet(aoa);

    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return workbook;
}

/**
 * Append rows from all files vertically into a single sheet
 */
async function appendRows(
  files: MergeFileState[],
  options: MergeOptions,
): Promise<import("xlsx").WorkBook> {
  const xlsx = await getXLSX();
  const workbook = xlsx.utils.book_new();
  const combinedRows: unknown[][] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sheetData = getSheetData(file);

    if (!sheetData) continue;

    const aoa = sheetDataToAoA(sheetData);

    if (i === 0) {
      // First file: include all rows
      combinedRows.push(...aoa);
    } else {
      // Subsequent files: optionally skip header row
      const startRow = options.includeHeaders ? 0 : 1;
      combinedRows.push(...aoa.slice(startRow));
    }
  }

  const worksheet = xlsx.utils.aoa_to_sheet(combinedRows);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Merged");

  return workbook;
}

/**
 * Append columns from all files horizontally into a single sheet
 */
async function appendColumns(
  files: MergeFileState[],
  _options: MergeOptions,
): Promise<import("xlsx").WorkBook> {
  const xlsx = await getXLSX();
  const workbook = xlsx.utils.book_new();

  // Find the maximum number of rows across all files
  let maxRows = 0;
  const allFileData: unknown[][][] = [];

  for (const file of files) {
    const sheetData = getSheetData(file);
    if (!sheetData) continue;

    const aoa = sheetDataToAoA(sheetData);
    allFileData.push(aoa);
    maxRows = Math.max(maxRows, aoa.length);
  }

  // Combine columns horizontally
  const combinedRows: unknown[][] = [];

  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const combinedRow: unknown[] = [];

    for (const fileData of allFileData) {
      const row = fileData[rowIndex] || [];
      combinedRow.push(...row);
    }

    combinedRows.push(combinedRow);
  }

  const worksheet = xlsx.utils.aoa_to_sheet(combinedRows);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Merged");

  return workbook;
}

/**
 * Generate a preview of the merge result
 */
async function generatePreview(workbook: import("xlsx").WorkBook): Promise<MergePreview> {
  const xlsx = await getXLSX();
  const sheets: MergeSheetPreview[] = [];
  let totalRows = 0;
  let totalColumns = 0;

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const range = xlsx.utils.decode_range(worksheet["!ref"] || "A1");
    const rowCount = range.e.r - range.s.r + 1;
    const columnCount = range.e.c - range.s.c + 1;

    // Get sample rows (first 10)
    const sampleRows: Row[] = [];
    const maxSampleRows = Math.min(10, rowCount);

    for (let r = 0; r < maxSampleRows; r++) {
      const row: Row = [];
      for (let c = 0; c <= range.e.c; c++) {
        const cellAddress = xlsx.utils.encode_cell({ r, c });
        const cell = worksheet[cellAddress];
        if (cell) {
          row.push({
            value: cell.v,
            type: getCellType(cell.v),
            formula: cell.f,
          });
        } else {
          row.push({ value: null, type: "empty" });
        }
      }
      sampleRows.push(row);
    }

    sheets.push({
      name: sheetName,
      rowCount,
      columnCount,
      sampleRows,
    });

    totalRows += rowCount;
    totalColumns = Math.max(totalColumns, columnCount);
  }

  return {
    sheets,
    totalSheets: sheets.length,
    totalRows,
    totalColumns,
  };
}

/**
 * Determine cell type from value
 */
function getCellType(value: unknown): "string" | "number" | "boolean" | "date" | "empty" {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "date";
  return "string";
}

/**
 * Main merge function
 */
export async function mergeSpreadsheets(
  files: MergeFileState[],
  options: MergeOptions,
): Promise<MergeResult> {
  // Filter out files without valid data
  const validFiles = files
    .filter((f) => f.parsed && f.selectedSheet)
    .sort((a, b) => a.order - b.order);

  if (validFiles.length < 2) {
    throw new Error("At least 2 files with valid data are required");
  }

  let workbook: import("xlsx").WorkBook;

  switch (options.mode) {
    case "combine-workbooks":
      workbook = await combineWorkbooks(validFiles, options);
      break;
    case "append-rows":
      workbook = await appendRows(validFiles, options);
      break;
    case "append-columns":
      workbook = await appendColumns(validFiles, options);
      break;
    default:
      throw new Error(`Unknown merge mode: ${options.mode}`);
  }

  const preview = await generatePreview(workbook);

  return { workbook, preview };
}
