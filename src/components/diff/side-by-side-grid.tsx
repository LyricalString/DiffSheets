"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiffResult, DiffRow, DiffCell } from "@/types";

interface SideBySideGridProps {
  diffResult: DiffResult;
  visibleRows: DiffRow[];
  visibleColumns: number[];
  currentChangeIndex: number;
  onCellClick?: (cell: DiffCell, rowIndex: number, colIndex: number) => void;
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

function calculateColumnWidths(
  rows: DiffRow[],
  columns: number[]
): Map<number, number> {
  const CHAR_WIDTH = 8;
  const MIN_WIDTH = 60;
  const MAX_WIDTH = 250;
  const PADDING = 16;
  const SAMPLE_SIZE = 100;

  const maxChars = new Map<number, number>();
  for (const colIndex of columns) {
    maxChars.set(colIndex, 2);
  }

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

  const widths = new Map<number, number>();
  for (const [col, chars] of maxChars) {
    const calculatedWidth = chars * CHAR_WIDTH + PADDING;
    widths.set(col, Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, calculatedWidth)));
  }
  return widths;
}

export function SideBySideGrid({
  diffResult,
  visibleRows,
  visibleColumns,
  currentChangeIndex,
  onCellClick,
  className,
}: SideBySideGridProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const columnWidths = useMemo(
    () => calculateColumnWidths(visibleRows, visibleColumns),
    [visibleRows, visibleColumns]
  );

  const totalWidth = useMemo(() => {
    let width = 50; // row number column
    for (const colIndex of visibleColumns) {
      width += columnWidths.get(colIndex) ?? 80;
    }
    return width;
  }, [visibleColumns, columnWidths]);

  // Find changed rows for navigation
  const changedRowIndices = useMemo(() => {
    return visibleRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row.changeType !== "unchanged")
      .map(({ index }) => index);
  }, [visibleRows]);

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => leftRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  // Synchronized scrolling
  const handleScroll = useCallback((source: "left" | "right") => {
    if (isScrolling) return;
    setIsScrolling(true);

    const sourceEl = source === "left" ? leftRef.current : rightRef.current;
    const targetEl = source === "left" ? rightRef.current : leftRef.current;

    if (sourceEl && targetEl) {
      targetEl.scrollTop = sourceEl.scrollTop;
      targetEl.scrollLeft = sourceEl.scrollLeft;
    }

    requestAnimationFrame(() => setIsScrolling(false));
  }, [isScrolling]);

  // Scroll to current change
  useEffect(() => {
    if (currentChangeIndex >= 0 && currentChangeIndex < changedRowIndices.length) {
      const rowIndex = changedRowIndices[currentChangeIndex];
      rowVirtualizer.scrollToIndex(rowIndex, { align: "center", behavior: "smooth" });
    }
  }, [currentChangeIndex, changedRowIndices, rowVirtualizer]);

  const renderCell = (
    row: DiffRow,
    colIndex: number,
    side: "original" | "modified",
    rowIdx: number
  ) => {
    const cell = row.cells[colIndex];
    const width = columnWidths.get(colIndex) ?? 80;
    const value = side === "original"
      ? cell?.original?.value
      : cell?.modified?.value;
    const displayValue = value !== null && value !== undefined ? String(value) : "";

    const isChanged = cell?.changeType === "modified" ||
      (side === "original" && cell?.changeType === "removed") ||
      (side === "modified" && cell?.changeType === "added");

    const isEmpty = (side === "original" && cell?.changeType === "added") ||
      (side === "modified" && cell?.changeType === "removed");

    return (
      <td
        key={colIndex}
        className={cn(
          "border-r px-2 py-1.5 truncate transition-colors cursor-pointer",
          "hover:bg-muted/50",
          isChanged && side === "original" && "bg-red-100/80 dark:bg-red-900/30",
          isChanged && side === "modified" && "bg-green-100/80 dark:bg-green-900/30",
          isEmpty && "bg-muted/30"
        )}
        style={{ width, minWidth: width, maxWidth: width }}
        onClick={() => cell && onCellClick?.(cell, rowIdx, colIndex)}
        title={displayValue}
      >
        <span className={cn(
          isChanged && side === "original" && "text-red-700 dark:text-red-400",
          isChanged && side === "modified" && "text-green-700 dark:text-green-400",
          isEmpty && "text-muted-foreground/50"
        )}>
          {isEmpty ? "—" : displayValue || <span className="text-muted-foreground">-</span>}
        </span>
      </td>
    );
  };

  const renderTable = (side: "original" | "modified", ref: React.RefObject<HTMLDivElement | null>) => (
    <div className="flex-1 min-w-0">
      <div className={cn(
        "sticky top-0 z-20 flex items-center justify-center gap-2 border-b py-2 font-semibold",
        side === "original"
          ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
          : "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
      )}>
        <span className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white",
          side === "original" ? "bg-red-500" : "bg-green-500"
        )}>
          {side === "original" ? "A" : "B"}
        </span>
        {side === "original" ? "Original" : "Modified"}
      </div>
      <div
        ref={ref}
        className="max-h-[60vh] overflow-auto"
        onScroll={() => handleScroll(side === "original" ? "left" : "right")}
      >
        <table className="border-collapse text-sm" style={{ tableLayout: "fixed", width: totalWidth }}>
          <thead className="sticky top-0 z-10">
            <tr className="border-b bg-muted">
              <th className="border-r bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground" style={{ width: 50 }}>
                #
              </th>
              {visibleColumns.map((colIndex) => (
                <th
                  key={colIndex}
                  className="border-r bg-muted px-2 py-2 text-center text-xs font-semibold"
                  style={{ width: columnWidths.get(colIndex) ?? 80 }}
                >
                  {getColumnLetter(colIndex)}
                </th>
              ))}
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
              const rowNumber = side === "original" ? row.originalIndex : row.modifiedIndex;
              const isCurrentChange = changedRowIndices[currentChangeIndex] === virtualRow.index;

              return (
                <tr
                  key={virtualRow.key}
                  className={cn(
                    "border-b transition-colors",
                    row.changeType === "added" && "bg-green-50/50 dark:bg-green-900/10",
                    row.changeType === "removed" && "bg-red-50/50 dark:bg-red-900/10",
                    row.changeType === "modified" && "bg-yellow-50/30 dark:bg-yellow-900/5",
                    isCurrentChange && "ring-2 ring-inset ring-primary"
                  )}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <td
                    className="border-r bg-muted/50 px-2 py-1.5 text-center text-xs text-muted-foreground tabular-nums"
                    style={{ width: 50 }}
                  >
                    {rowNumber !== null ? rowNumber + 1 : ""}
                  </td>
                  {visibleColumns.map((colIndex) => renderCell(row, colIndex, side, virtualRow.index))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (visibleRows.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center p-12", className)}>
        <p className="text-muted-foreground">No differences found</p>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex divide-x">
        {renderTable("original", leftRef)}
        {renderTable("modified", rightRef)}
      </div>
    </Card>
  );
}
