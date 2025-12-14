"use client";

import { cn } from "@/lib/utils";
import { DiffCell } from "./diff-cell";
import type { DiffRow as DiffRowType } from "@/types";

interface DiffRowProps {
  row: DiffRowType;
  visibleColumns: number[];
  columnWidths: Map<number, number>;
  style?: React.CSSProperties;
}

export function DiffRow({ row, visibleColumns, columnWidths, style }: DiffRowProps) {
  const rowBgClass = cn(
    row.changeType === "added" && "bg-green-50/50 dark:bg-green-900/10",
    row.changeType === "removed" && "bg-red-50/50 dark:bg-red-900/10",
    row.changeType === "modified" && "bg-yellow-50/30 dark:bg-yellow-900/5"
  );

  return (
    <tr className={cn("border-b hover:bg-muted/20", rowBgClass)} style={style}>
      {/* Original row number */}
      <td className="sticky left-0 z-10 border-r bg-muted/80 px-2 py-2 text-center text-muted-foreground text-xs tabular-nums" style={{ width: "40px" }}>
        {row.originalIndex !== null ? row.originalIndex + 1 : ""}
      </td>

      {/* Modified row number */}
      <td className="sticky left-[40px] z-10 border-r bg-muted/80 px-2 py-2 text-center text-muted-foreground text-xs tabular-nums" style={{ width: "40px" }}>
        {row.modifiedIndex !== null ? row.modifiedIndex + 1 : ""}
      </td>

      {/* Change indicator */}
      <td className="sticky left-[80px] z-10 border-r bg-muted/80 px-1 py-2 text-center" style={{ width: "32px" }}>
        {row.changeType === "added" && (
          <span className="font-bold text-green-600 dark:text-green-400">+</span>
        )}
        {row.changeType === "removed" && (
          <span className="font-bold text-red-600 dark:text-red-400">−</span>
        )}
        {row.changeType === "modified" && (
          <span className="font-bold text-yellow-600 dark:text-yellow-400">~</span>
        )}
      </td>

      {/* Cells */}
      {visibleColumns.map((colIndex) => {
        const cell = row.cells[colIndex];
        const width = columnWidths.get(colIndex) ?? 120;
        if (!cell) {
          return (
            <td
              key={colIndex}
              className="border-r px-2 py-2 text-muted-foreground overflow-hidden"
              style={{ width, minWidth: width, maxWidth: width }}
            >
              -
            </td>
          );
        }
        return <DiffCell key={colIndex} cell={cell} width={width} />;
      })}
    </tr>
  );
}
