"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SheetData, Cell } from "@/types";

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
    <Card className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 border-r px-2 py-1.5 text-center text-muted-foreground text-xs font-normal">
                #
              </th>
              {previewData.cols.map((col) => (
                <th
                  key={col.index}
                  className="min-w-[80px] border-r px-2 py-1.5 text-center text-muted-foreground text-xs font-medium"
                >
                  {col.letter}
                </th>
              ))}
              {previewData.hasMoreCols && (
                <th className="px-2 py-1.5 text-center text-muted-foreground text-xs">...</th>
              )}
            </tr>
          </thead>
          <tbody>
            {previewData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="border-r px-2 py-1.5 text-center text-muted-foreground text-xs">
                  {rowIndex + 1}
                </td>
                {row.slice(0, maxCols).map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "max-w-[150px] truncate border-r px-2 py-1.5",
                      cell.type === "number" && "text-right",
                      cell.type === "empty" && "text-muted-foreground"
                    )}
                    title={formatCellValue(cell)}
                  >
                    {formatCellValue(cell) || <span className="text-muted-foreground">-</span>}
                  </td>
                ))}
                {previewData.hasMoreCols && (
                  <td className="px-2 py-1.5 text-center text-muted-foreground">...</td>
                )}
              </tr>
            ))}
            {previewData.hasMoreRows && (
              <tr className="bg-muted/30">
                <td
                  colSpan={previewData.cols.length + 2}
                  className="px-2 py-1.5 text-center text-muted-foreground text-xs"
                >
                  ... {data.rows.length - maxRows} more rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-muted/30 px-3 py-2">
        <p className="text-muted-foreground text-xs">
          {t("fileInfo", { rows: data.rows.length, cols: data.columns.length })}
        </p>
      </div>
    </Card>
  );
}
