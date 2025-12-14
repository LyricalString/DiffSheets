"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, ArrowRight, MapPin, Hash, Type, Binary } from "lucide-react";
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
          matrix[i - 1][j] + 1
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
              (1 - levenshteinDistance(original, modified) / Math.max(original.length, modified.length, 1)) * 100
            )
          : cell.changeType === "unchanged"
            ? 100
            : 0,
    };
  }, [cell]);

  if (!cell || rowIndex === null || colIndex === null) return null;

  const changeTypeConfig = {
    added: { label: "Added", color: "bg-green-500", textColor: "text-green-700 dark:text-green-400" },
    removed: { label: "Removed", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400" },
    modified: { label: "Modified", color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-400" },
    unchanged: { label: "Unchanged", color: "bg-gray-400", textColor: "text-muted-foreground" },
  };

  const config = changeTypeConfig[cell.changeType];

  return (
    <Card
      className={cn(
        "absolute right-4 top-4 z-50 w-80 overflow-hidden border shadow-xl",
        "animate-in slide-in-from-right-4 fade-in duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">
            Cell {getColumnLetter(colIndex)}
            {rowIndex + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Change Type Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("gap-1", config.textColor)}>
            <span className={cn("h-2 w-2 rounded-full", config.color)} />
            {config.label}
          </Badge>
          {cell.changeType === "modified" && analysis && (
            <Badge variant="secondary" className="text-xs">
              {analysis.similarity}% similar
            </Badge>
          )}
        </div>

        {/* Values */}
        <div className="space-y-3">
          {(cell.changeType === "removed" || cell.changeType === "modified" || cell.changeType === "unchanged") && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Original</label>
              <div
                className={cn(
                  "rounded-md border p-2 text-sm font-mono break-all",
                  cell.changeType === "removed" || cell.changeType === "modified"
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50"
                    : "border-border bg-muted/30"
                )}
              >
                {analysis?.original || <span className="text-muted-foreground italic">empty</span>}
              </div>
            </div>
          )}

          {cell.changeType === "modified" && (
            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {(cell.changeType === "added" || cell.changeType === "modified" || cell.changeType === "unchanged") && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {cell.changeType === "unchanged" ? "Value" : "Modified"}
              </label>
              <div
                className={cn(
                  "rounded-md border p-2 text-sm font-mono break-all",
                  cell.changeType === "added" || cell.changeType === "modified"
                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50"
                    : "border-border bg-muted/30"
                )}
              >
                {analysis?.modified || <span className="text-muted-foreground italic">empty</span>}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {cell.changeType === "modified" && analysis && (
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                Chars
              </div>
              <div className="text-sm font-semibold">
                {analysis.originalLength} → {analysis.modifiedLength}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Type className="h-3 w-3" />
                Edit dist.
              </div>
              <div className="text-sm font-semibold">{analysis.levenshtein}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Binary className="h-3 w-3" />
                Similar
              </div>
              <div className="text-sm font-semibold">{analysis.similarity}%</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
