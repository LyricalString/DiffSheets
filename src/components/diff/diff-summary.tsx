"use client";

import { Equal, Minus, Plus, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { DiffSummary as DiffSummaryType } from "@/types";

interface DiffSummaryProps {
  summary: DiffSummaryType;
}

export function DiffSummary({ summary }: DiffSummaryProps) {
  const t = useTranslations("diff.summary");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {summary.addedRows > 0 && (
        <Badge
          variant="outline"
          className="gap-1 h-6 px-2 text-xs rounded-full border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
        >
          <Plus className="h-3 w-3" />
          <span className="font-medium">{summary.addedRows}</span>
        </Badge>
      )}

      {summary.removedRows > 0 && (
        <Badge
          variant="outline"
          className="gap-1 h-6 px-2 text-xs rounded-full border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
        >
          <Minus className="h-3 w-3" />
          <span className="font-medium">{summary.removedRows}</span>
        </Badge>
      )}

      {summary.modifiedRows > 0 && (
        <Badge
          variant="outline"
          className="gap-1 h-6 px-2 text-xs rounded-full border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="font-medium">{summary.modifiedRows}</span>
        </Badge>
      )}

      {summary.unchangedRows > 0 && (
        <Badge
          variant="outline"
          className="gap-1 h-6 px-2 text-xs rounded-full text-muted-foreground"
        >
          <Equal className="h-3 w-3" />
          <span className="font-medium">{summary.unchangedRows}</span>
        </Badge>
      )}
    </div>
  );
}
