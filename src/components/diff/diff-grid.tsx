"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { DiffRow } from "./diff-row";
import { cn } from "@/lib/utils";
import type { DiffResult, DiffRow as DiffRowType } from "@/types";

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

export function DiffGrid({
  diffResult,
  visibleRows,
  visibleColumns,
  className,
}: DiffGridProps) {
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

  if (visibleRows.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center p-12", className)}>
        <p className="text-muted-foreground">{t("noChanges")}</p>
      </Card>
    );
  }

  // Calculate column width based on number of columns
  const columnWidth = Math.max(150, Math.floor(800 / Math.min(visibleColumns.length, 6)));
  // Calculate total table width: sticky columns (40 + 40 + 32) + data columns
  const totalTableWidth = 40 + 40 + 32 + visibleColumns.length * columnWidth;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div ref={parentRef} className="max-h-[70vh] overflow-auto">
        <table className="border-collapse text-sm" style={{ tableLayout: "fixed", width: `${totalTableWidth}px` }}>
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "32px" }} />
            {visibleColumns.map((colIndex) => (
              <col key={colIndex} style={{ width: `${columnWidth}px` }} />
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
              <th className="sticky left-[80px] z-30 border-r bg-muted px-1 py-2.5 text-center text-muted-foreground text-xs font-medium">

              </th>

              {/* Column headers */}
              {visibleColumns.map((colIndex) => {
                const column = diffResult.columns[colIndex];
                return (
                  <th
                    key={colIndex}
                    className={cn(
                      "border-r bg-muted px-3 py-2.5 text-center text-xs font-semibold overflow-hidden",
                      column?.hasChanges
                        ? "text-foreground"
                        : "text-muted-foreground"
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
                  columnWidth={columnWidth}
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
