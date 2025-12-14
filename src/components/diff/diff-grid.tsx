"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiffResult, DiffRow as DiffRowType } from "@/types";
import { DiffRow } from "./diff-row";

interface DiffGridProps {
  diffResult: DiffResult;
  visibleRows: DiffRowType[];
  visibleColumns: number[];
  className?: string;
}

function getColumnLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Calculate smart column widths based on content
function calculateColumnWidths(rows: DiffRowType[], columns: number[]): Map<number, number> {
  const CHAR_WIDTH = 8; // Average pixels per character
  const MIN_WIDTH = 80;
  const MAX_WIDTH = 400;
  const PADDING = 24; // px padding in cells
  const SAMPLE_SIZE = 100;

  const maxChars = new Map<number, number>();

  // Initialize with column header length (single letter = ~2 chars min)
  for (const colIndex of columns) {
    maxChars.set(colIndex, 2);
  }

  // Sample first N rows to find max content length per column
  const sampleRows = rows.slice(0, SAMPLE_SIZE);

  for (const row of sampleRows) {
    for (const colIndex of columns) {
      const cell = row.cells[colIndex];
      if (!cell) continue;

      const originalLen = String(cell.original?.value ?? "").length;
      const modifiedLen = String(cell.modified?.value ?? "").length;
      const maxLen = Math.max(originalLen, modifiedLen);

      maxChars.set(colIndex, Math.max(maxChars.get(colIndex) ?? 0, maxLen));
    }
  }

  // Convert character counts to pixel widths with constraints
  const widths = new Map<number, number>();
  for (const [col, chars] of maxChars) {
    const calculatedWidth = chars * CHAR_WIDTH + PADDING;
    widths.set(col, Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, calculatedWidth)));
  }

  return widths;
}

export function DiffGrid({ diffResult, visibleRows, visibleColumns, className }: DiffGridProps) {
  const t = useTranslations("diff");
  const parentRef = useRef<HTMLDivElement>(null);

  // Estimate row height based on whether there are modifications (taller rows)
  const hasModifications = visibleRows.some((row) => row.changeType === "modified");
  const estimatedRowHeight = hasModifications ? 52 : 36;

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  // Calculate smart column widths based on content (memoized)
  const columnWidths = useMemo(
    () => calculateColumnWidths(visibleRows, visibleColumns),
    [visibleRows, visibleColumns],
  );

  // Calculate total table width from individual column widths
  const totalTableWidth = useMemo(() => {
    const stickyWidth = 40 + 40 + 32; // row numbers + indicator
    let dataWidth = 0;
    for (const colIndex of visibleColumns) {
      dataWidth += columnWidths.get(colIndex) ?? 120;
    }
    return stickyWidth + dataWidth;
  }, [visibleColumns, columnWidths]);

  if (visibleRows.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center p-12", className)}>
        <p className="text-muted-foreground">{t("noChanges")}</p>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div ref={parentRef} className="max-h-[70vh] overflow-auto">
        <table
          className="border-collapse text-sm"
          style={{ tableLayout: "fixed", width: `${totalTableWidth}px` }}
        >
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "32px" }} />
            {visibleColumns.map((colIndex) => (
              <col key={colIndex} style={{ width: `${columnWidths.get(colIndex) ?? 120}px` }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-20">
            <tr className="border-b bg-muted">
              {/* Row number headers */}
              <th className="sticky left-0 z-30 border-r bg-muted px-2 py-2.5 text-center text-muted-foreground text-xs font-medium">
                #
              </th>
              <th className="sticky left-[40px] z-30 border-r bg-muted px-2 py-2.5 text-center text-muted-foreground text-xs font-medium">
                #
              </th>
              <th className="sticky left-[80px] z-30 border-r bg-muted px-1 py-2.5 text-center text-muted-foreground text-xs font-medium"></th>

              {/* Column headers */}
              {visibleColumns.map((colIndex) => {
                const column = diffResult.columns[colIndex];
                return (
                  <th
                    key={colIndex}
                    className={cn(
                      "border-r bg-muted px-3 py-2.5 text-center text-xs font-semibold overflow-hidden",
                      column?.hasChanges ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {getColumnLetter(colIndex)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = visibleRows[virtualRow.index];
              return (
                <DiffRow
                  key={virtualRow.key}
                  row={row}
                  visibleColumns={visibleColumns}
                  columnWidths={columnWidths}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
