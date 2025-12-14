"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiffSummary } from "./diff-summary";
import { DiffGrid } from "./diff-grid";
import { ComparisonOptions } from "@/components/sidebar";
import { useSpreadsheetStore } from "@/store";
import { filterDiffRows, filterDiffColumns } from "@/lib/diff";

export function DiffView() {
  const t = useTranslations("diff");
  const { diffResult, options, setDiffResult } = useSpreadsheetStore();

  const visibleRows = useMemo(() => {
    if (!diffResult) return [];
    return filterDiffRows(diffResult, options);
  }, [diffResult, options]);

  const visibleColumns = useMemo(() => {
    if (!diffResult) return [];
    return filterDiffColumns(diffResult, options);
  }, [diffResult, options]);

  if (!diffResult) {
    return null;
  }

  const handleBack = () => {
    setDiffResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="font-semibold text-xl">{t("title")}</h2>
        </div>
      </div>

      {/* Summary */}
      <DiffSummary summary={diffResult.summary} />

      {/* Main content with sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
        {/* Diff Grid */}
        <DiffGrid
          diffResult={diffResult}
          visibleRows={visibleRows}
          visibleColumns={visibleColumns}
        />

        {/* Sidebar */}
        <div className="space-y-4">
          <ComparisonOptions />
        </div>
      </div>
    </div>
  );
}
