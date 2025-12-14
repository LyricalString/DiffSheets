"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { ComparisonOptions } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { filterDiffColumns, filterDiffRows } from "@/lib/diff";
import { useSpreadsheetStore } from "@/store";
import type { DiffCell } from "@/types";
import { CellInspector } from "./cell-inspector";
import { ChangeNavigation } from "./change-navigation";
import { DiffGrid } from "./diff-grid";
import { DiffSummary } from "./diff-summary";
import { SideBySideGrid } from "./side-by-side-grid";
import { type ViewMode, ViewModeSelector } from "./view-mode-selector";

export function DiffView() {
  const t = useTranslations("diff");
  const { diffResult, options, setDiffResult } = useSpreadsheetStore();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{
    cell: DiffCell;
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  const visibleRows = useMemo(() => {
    if (!diffResult) return [];
    return filterDiffRows(diffResult, options);
  }, [diffResult, options]);

  const visibleColumns = useMemo(() => {
    if (!diffResult) return [];
    return filterDiffColumns(diffResult, options);
  }, [diffResult, options]);

  // Count total changes for navigation
  const totalChanges = useMemo(() => {
    return visibleRows.filter((row) => row.changeType !== "unchanged").length;
  }, [visibleRows]);

  const handleCellClick = useCallback((cell: DiffCell, rowIndex: number, colIndex: number) => {
    setSelectedCell({ cell, rowIndex, colIndex });
  }, []);

  const handleCloseInspector = useCallback(() => {
    setSelectedCell(null);
  }, []);

  if (!diffResult) {
    return null;
  }

  const handleBack = () => {
    setDiffResult(null);
  };

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="shrink-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="font-semibold text-xl">{t("title")}</h2>
        </div>

        {/* View controls */}
        <div className="flex flex-wrap items-center gap-3">
          <ViewModeSelector mode={viewMode} onChange={setViewMode} />
          {totalChanges > 0 && (
            <ChangeNavigation
              currentIndex={currentChangeIndex}
              totalChanges={totalChanges}
              onNavigate={setCurrentChangeIndex}
            />
          )}
        </div>
      </div>

      {/* Summary */}
      <DiffSummary summary={diffResult.summary} />

      {/* Main content */}
      <div className="relative grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Diff Grid - switches based on view mode */}
        <div className="relative min-w-0">
          {viewMode === "side-by-side" ? (
            <SideBySideGrid
              diffResult={diffResult}
              visibleRows={visibleRows}
              visibleColumns={visibleColumns}
              currentChangeIndex={currentChangeIndex}
              onCellClick={handleCellClick}
            />
          ) : (
            <DiffGrid
              diffResult={diffResult}
              visibleRows={visibleRows}
              visibleColumns={visibleColumns}
            />
          )}

          {/* Cell Inspector - floating panel */}
          {selectedCell && (
            <CellInspector
              cell={selectedCell.cell}
              rowIndex={selectedCell.rowIndex}
              colIndex={selectedCell.colIndex}
              onClose={handleCloseInspector}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ComparisonOptions />

          {/* Keyboard shortcuts help */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="mb-3 text-sm font-semibold">Keyboard Shortcuts</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Next change</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">n</kbd>
              </div>
              <div className="flex justify-between">
                <span>Previous change</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">p</kbd>
              </div>
              <div className="flex justify-between">
                <span>Navigate</span>
                <span className="flex gap-1">
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl</kbd>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
