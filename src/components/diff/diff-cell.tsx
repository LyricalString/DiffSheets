"use client";

import { cn } from "@/lib/utils";
import type { DiffCell as DiffCellType } from "@/types";

interface DiffCellProps {
  cell: DiffCellType;
  width: number;
  className?: string;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

export function DiffCell({ cell, width, className }: DiffCellProps) {
  const originalValue = formatValue(cell.original?.value);
  const modifiedValue = formatValue(cell.modified?.value);
  const cellStyle = { width, minWidth: width, maxWidth: width };

  // Modified cell - show both values stacked
  if (cell.changeType === "modified") {
    return (
      <td
        className={cn(
          "border-r px-2 py-1 overflow-hidden",
          "bg-yellow-50/50 dark:bg-yellow-900/10",
          className
        )}
        style={cellStyle}
      >
        <div className="flex flex-col gap-0.5">
          <span className="truncate rounded bg-red-100 px-1 text-red-700 line-through dark:bg-red-900/30 dark:text-red-400">
            {originalValue || "-"}
          </span>
          <span className="truncate rounded bg-green-100 px-1 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {modifiedValue || "-"}
          </span>
        </div>
      </td>
    );
  }

  // Added cell
  if (cell.changeType === "added") {
    return (
      <td
        className={cn(
          "truncate border-r px-2 py-1.5 overflow-hidden",
          "bg-green-50 dark:bg-green-900/20",
          className
        )}
        style={cellStyle}
        title={modifiedValue}
      >
        <span className="text-green-700 dark:text-green-400">
          {modifiedValue || "-"}
        </span>
      </td>
    );
  }

  // Removed cell
  if (cell.changeType === "removed") {
    return (
      <td
        className={cn(
          "truncate border-r px-2 py-1.5 overflow-hidden",
          "bg-red-50 dark:bg-red-900/20",
          className
        )}
        style={cellStyle}
        title={originalValue}
      >
        <span className="text-red-700 line-through dark:text-red-400">
          {originalValue || "-"}
        </span>
      </td>
    );
  }

  // Unchanged cell
  return (
    <td
      className={cn(
        "truncate border-r px-2 py-1.5 overflow-hidden",
        className
      )}
      style={cellStyle}
      title={modifiedValue || originalValue}
    >
      {modifiedValue || originalValue || <span className="text-muted-foreground">-</span>}
    </td>
  );
}
