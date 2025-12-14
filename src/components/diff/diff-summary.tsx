"use client";

import { useTranslations } from "next-intl";
import { Plus, Minus, RefreshCw, Equal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DiffSummary as DiffSummaryType } from "@/types";

interface DiffSummaryProps {
  summary: DiffSummaryType;
}

export function DiffSummary({ summary }: DiffSummaryProps) {
  const t = useTranslations("diff.summary");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {summary.addedRows > 0 && (
        <Badge variant="outline" className="gap-1 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
          <Plus className="h-3 w-3" />
          {t("additions", { count: summary.addedRows })}
        </Badge>
      )}

      {summary.removedRows > 0 && (
        <Badge variant="outline" className="gap-1 border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400">
          <Minus className="h-3 w-3" />
          {t("removals", { count: summary.removedRows })}
        </Badge>
      )}

      {summary.modifiedRows > 0 && (
        <Badge variant="outline" className="gap-1 border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
          <RefreshCw className="h-3 w-3" />
          {t("modifications", { count: summary.modifiedRows })}
        </Badge>
      )}

      {summary.unchangedRows > 0 && (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Equal className="h-3 w-3" />
          {t("unchanged", { count: summary.unchangedRows })}
        </Badge>
      )}
    </div>
  );
}
