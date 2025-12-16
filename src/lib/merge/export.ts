import { getXLSX } from "./index";

/**
 * Export a workbook to XLSX file and trigger download
 */
export async function exportWorkbook(
  workbook: import("xlsx").WorkBook,
  filename: string,
): Promise<void> {
  const xlsx = await getXLSX();

  // Ensure filename has .xlsx extension
  const finalFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;

  // Generate the file buffer
  const buffer = xlsx.write(workbook, {
    type: "array",
    bookType: "xlsx",
    compression: true,
  });

  // Create a Blob and trigger download
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Get the size of a workbook in bytes (estimated)
 */
export async function getWorkbookSize(workbook: import("xlsx").WorkBook): Promise<number> {
  const xlsx = await getXLSX();

  const buffer = xlsx.write(workbook, {
    type: "array",
    bookType: "xlsx",
    compression: true,
  });

  return buffer.byteLength;
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
