"use client";

import { ArrowRight, Binary, Hash, MapPin, Type, X } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiffCell } from "@/types";

interface CellInspectorProps {
  cell: DiffCell | null;
  rowIndex: number | null;
  colIndex: number | null;
  onClose: () => void;
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

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function CellInspector({
  cell,
  rowIndex,
  colIndex,
  onClose,
  className,
}: CellInspectorProps) {
  const analysis = useMemo(() => {
    if (!cell) return null;

    const original = String(cell.original?.value ?? "");
    const modified = String(cell.modified?.value ?? "");

    return {
      original,
      modified,
      originalLength: original.length,
      modifiedLength: modified.length,
      levenshtein: cell.changeType === "modified" ? levenshteinDistance(original, modified) : 0,
      similarity:
        cell.changeType === "modified"
          ? Math.round(
              (1 -
                levenshteinDistance(original, modified) /
                  Math.max(original.length, modified.length, 1)) *
                100,
            )
          : cell.changeType === "unchanged"
            ? 100
            : 0,
    };
  }, [cell]);

  if (!cell || rowIndex === null || colIndex === null) return null;

  const changeTypeConfig = {
    added: {
      label: "Added",
      color: "bg-green-500",
      textColor: "text-green-700 dark:text-green-400",
    },
    removed: { label: "Removed", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400" },
    modified: {
      label: "Modified",
      color: "bg-yellow-500",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    unchanged: { label: "Unchanged", color: "bg-gray-400", textColor: "text-muted-foreground" },
  };

  const config = changeTypeConfig[cell.changeType];

  return (
    <Card
      className={cn(
        "absolute right-4 top-4 z-50 w-72 overflow-hidden rounded-2xl border shadow-2xl shadow-black/20",
        "animate-in slide-in-from-right-4 fade-in duration-200",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-display font-semibold text-sm">
            Cell {getColumnLetter(colIndex)}
            {rowIndex + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 p-3">
        {/* Change Type Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("gap-1 h-6 px-2 text-xs rounded-full", config.textColor)}
          >
            <span className={cn("h-2 w-2 rounded-full", config.color)} />
            {config.label}
          </Badge>
          {cell.changeType === "modified" && analysis && (
            <Badge variant="secondary" className="text-xs h-6 px-2 rounded-full">
              {analysis.similarity}% similar
            </Badge>
          )}
        </div>

        {/* Values */}
        <div className="space-y-2">
          {(cell.changeType === "removed" ||
            cell.changeType === "modified" ||
            cell.changeType === "unchanged") && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Original
              </label>
              <div
                className={cn(
                  "rounded-lg border p-2 text-xs font-mono break-all max-h-20 overflow-auto",
                  cell.changeType === "removed" || cell.changeType === "modified"
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-border bg-muted/30",
                )}
              >
                {analysis?.original || <span className="text-muted-foreground italic">empty</span>}
              </div>
            </div>
          )}

          {cell.changeType === "modified" && (
            <div className="flex justify-center">
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}

          {(cell.changeType === "added" ||
            cell.changeType === "modified" ||
            cell.changeType === "unchanged") && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {cell.changeType === "unchanged" ? "Value" : "Modified"}
              </label>
              <div
                className={cn(
                  "rounded-lg border p-2 text-xs font-mono break-all max-h-20 overflow-auto",
                  cell.changeType === "added" || cell.changeType === "modified"
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-border bg-muted/30",
                )}
              >
                {analysis?.modified || <span className="text-muted-foreground italic">empty</span>}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {cell.changeType === "modified" && analysis && (
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/50 p-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 text-[10px] text-muted-foreground">
                <Hash className="h-2.5 w-2.5" />
                Chars
              </div>
              <div className="text-xs font-semibold">
                {analysis.originalLength}→{analysis.modifiedLength}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 text-[10px] text-muted-foreground">
                <Type className="h-2.5 w-2.5" />
                Edit
              </div>
              <div className="text-xs font-semibold">{analysis.levenshtein}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 text-[10px] text-muted-foreground">
                <Binary className="h-2.5 w-2.5" />
                Match
              </div>
              <div className="text-xs font-semibold">{analysis.similarity}%</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
