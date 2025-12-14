import type { Cell, Column, ParsedSpreadsheet, Row, SheetData, SheetInfo } from "@/types";

// Lazy load xlsx library - only when needed (saves ~165KB from initial bundle)
let XLSX: typeof import("xlsx") | null = null;

async function getXLSX() {
  if (!XLSX) {
    XLSX = await import("xlsx");
  }
  return XLSX;
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
 * Determine cell type from value
 */
function getCellType(value: unknown): Cell["type"] {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "date";
  return "string";
}

/**
 * Convert raw cell value to Cell object
 */
function createCell(value: unknown, formula?: string): Cell {
  const type = getCellType(value);
  return {
    value: value as Cell["value"],
    type,
    formula,
  };
}

/**
 * Parse a worksheet into SheetData
 */
function parseWorksheet(
  xlsx: typeof import("xlsx"),
  worksheet: import("xlsx").WorkSheet,
  name: string,
): SheetData {
  const range = xlsx.utils.decode_range(worksheet["!ref"] || "A1");
  const rowCount = range.e.r - range.s.r + 1;
  const colCount = range.e.c - range.s.c + 1;

  // Generate columns
  const columns: Column[] = [];
  for (let c = 0; c < colCount; c++) {
    columns.push({
      index: c,
      letter: getColumnLetter(c),
      width: worksheet["!cols"]?.[c]?.wch,
    });
  }

  // Parse rows
  const rows: Row[] = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: Row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = xlsx.utils.encode_cell({ r, c });
      const cell = worksheet[cellAddress];

      if (cell) {
        row.push(createCell(cell.v, cell.f));
      } else {
        row.push(createCell(null));
      }
    }
    rows.push(row);
  }

  return {
    name,
    rows,
    columns,
    headerRow: 1,
  };
}

/**
 * Parse a spreadsheet file (xlsx, xls, csv, ods)
 */
export async function parseSpreadsheet(file: File): Promise<ParsedSpreadsheet> {
  const xlsx = await getXLSX();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          throw new Error("Failed to read file");
        }

        const workbook = xlsx.read(data, {
          type: "array",
          cellDates: true,
          cellFormula: true,
          cellStyles: false,
        });

        const sheets: SheetInfo[] = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          const range = xlsx.utils.decode_range(worksheet["!ref"] || "A1");
          return {
            name,
            rowCount: range.e.r - range.s.r + 1,
            columnCount: range.e.c - range.s.c + 1,
          };
        });

        const sheetDataMap = new Map<string, SheetData>();
        for (const name of workbook.SheetNames) {
          const worksheet = workbook.Sheets[name];
          sheetDataMap.set(name, parseWorksheet(xlsx, worksheet, name));
        }

        resolve({
          filename: file.name,
          fileSize: file.size,
          sheets,
          activeSheet: workbook.SheetNames[0] || "",
          data: sheetDataMap,
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to parse file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get supported file extensions
 */
export const SUPPORTED_EXTENSIONS = [".xlsx", ".xls", ".csv", ".ods", ".tsv"] as const;

/**
 * Get supported MIME types
 */
export const SUPPORTED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "text/csv", // csv
  "application/vnd.oasis.opendocument.spreadsheet", // ods
  "text/tab-separated-values", // tsv
] as const;

/**
 * Check if file is supported
 */
export function isFileSupported(file: File): boolean {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  return SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number]);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}
