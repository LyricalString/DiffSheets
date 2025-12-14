"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Cell, SheetData } from "@/types";

interface SpreadsheetPreviewProps {
  data: SheetData;
  maxRows?: number;
  maxCols?: number;
  className?: string;
}

function formatCellValue(cell: Cell): string {
  if (cell.type === "empty" || cell.value === null) return "";
  if (cell.type === "date" && cell.value instanceof Date) {
    return cell.value.toLocaleDateString();
  }
  return String(cell.value);
}

export function SpreadsheetPreview({
  data,
  maxRows = 10,
  maxCols = 8,
  className,
}: SpreadsheetPreviewProps) {
  const t = useTranslations("upload");

  const previewData = useMemo(() => {
    const rows = data.rows.slice(0, maxRows);
    const cols = data.columns.slice(0, maxCols);
    const hasMoreRows = data.rows.length > maxRows;
    const hasMoreCols = data.columns.length > maxCols;

    return { rows, cols, hasMoreRows, hasMoreCols };
  }, [data, maxRows, maxCols]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg",
        className,
      )}
    >
      {/* macOS-style window header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 font-mono text-xs text-slate-400">
          {t("fileInfo", { rows: data.rows.length, cols: data.columns.length })}
        </span>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="w-8 border-r border-slate-700 px-2 py-1.5 text-center text-slate-400 font-normal">
                #
              </th>
              {previewData.cols.map((col) => (
                <th
                  key={col.index}
                  className="min-w-[60px] border-r border-slate-700 px-2 py-1.5 text-center text-slate-400 font-medium"
                >
                  {col.letter}
                </th>
              ))}
              {previewData.hasMoreCols && (
                <th className="px-2 py-1.5 text-center text-slate-400">...</th>
              )}
            </tr>
          </thead>
          <tbody>
            {previewData.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition-colors",
                  rowIndex % 2 === 1 && "bg-slate-800/20",
                )}
              >
                <td className="border-r border-slate-700 px-2 py-1 text-center text-slate-400">
                  {rowIndex + 1}
                </td>
                {row.slice(0, maxCols).map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "max-w-[120px] truncate border-r border-slate-800 px-2 py-1 text-slate-300",
                      cell.type === "number" && "text-right text-green-400",
                      cell.type === "empty" && "text-slate-600",
                    )}
                    title={formatCellValue(cell)}
                  >
                    {formatCellValue(cell) || <span className="text-slate-600">-</span>}
                  </td>
                ))}
                {previewData.hasMoreCols && (
                  <td className="px-2 py-1 text-center text-slate-400">...</td>
                )}
              </tr>
            ))}
            {previewData.hasMoreRows && (
              <tr className="bg-slate-800/30">
                <td
                  colSpan={previewData.cols.length + 2}
                  className="px-2 py-1.5 text-center text-slate-400 text-xs"
                >
                  ... {data.rows.length - maxRows} more rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
