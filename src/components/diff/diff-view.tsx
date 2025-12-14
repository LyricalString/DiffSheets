"use client";

import { Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const tOptions = useTranslations("diff.options");
  const { diffResult, options, setOptions } = useSpreadsheetStore();

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

  return (
    <div className="flex flex-col h-full animate-slide-up-fade">
      {/* Header - compact toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-semibold text-base">{t("title")}</h2>
          <DiffSummary summary={diffResult.summary} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ViewModeSelector mode={viewMode} onChange={setViewMode} />

          {totalChanges > 0 && (
            <ChangeNavigation
              currentIndex={currentChangeIndex}
              totalChanges={totalChanges}
              onNavigate={setCurrentChangeIndex}
            />
          )}

          {/* Options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tOptions("title")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Display</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={options.hideUnchangedRows}
                onCheckedChange={(checked) => setOptions({ hideUnchangedRows: checked })}
              >
                {tOptions("hideUnchangedRows")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={options.hideUnchangedColumns}
                onCheckedChange={(checked) => setOptions({ hideUnchangedColumns: checked })}
              >
                {tOptions("hideUnchangedCols")}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Comparison</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={options.ignoreWhitespace}
                onCheckedChange={(checked) => setOptions({ ignoreWhitespace: checked })}
              >
                {tOptions("ignoreWhitespace")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={options.ignoreCase}
                onCheckedChange={(checked) => setOptions({ ignoreCase: checked })}
              >
                {tOptions("ignoreCase")}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                <span className="font-medium">Shortcuts:</span>{" "}
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">n</kbd>/
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">p</kbd> navigate
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main grid - FULL WIDTH */}
      <div className="relative flex-1 mt-3 min-h-0">
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
    </div>
  );
}
