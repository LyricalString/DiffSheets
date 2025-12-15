"use client";

import { Loader2, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { filterDiffColumns, filterDiffRows } from "@/lib/diff";
import { useSpreadsheetStore } from "@/store";
import type { DiffCell, MatchingStrategy } from "@/types";
import { CellInspector } from "./cell-inspector";
import { ChangeNavigation } from "./change-navigation";
import { DiffGrid } from "./diff-grid";
import { DiffSummary } from "./diff-summary";
import { SideBySideGrid } from "./side-by-side-grid";
import { type ViewMode, ViewModeSelector } from "./view-mode-selector";

export function DiffView() {
  const t = useTranslations("diff");
  const tOptions = useTranslations("diff.options");
  const tMatching = useTranslations("matching");
  const { diffResult, options, setOptions, isComparing, recompare, originalFile } =
    useSpreadsheetStore();

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
    const rows = filterDiffRows(diffResult, options);
    console.log("[DEBUG] visibleRows recalculated:", rows.length, "rows, summary:", diffResult.summary);
    return rows;
  }, [diffResult, options]);

  const visibleColumns = useMemo(() => {
    if (!diffResult) return [];
    return filterDiffColumns(diffResult, options);
  }, [diffResult, options]);

  // Count total changes for navigation
  const totalChanges = useMemo(() => {
    const count = visibleRows.filter((row) => row.changeType !== "unchanged").length;
    console.log("[DEBUG] totalChanges recalculated:", count, "from", visibleRows.length, "visible rows");
    return count;
  }, [visibleRows]);

  // Reset currentChangeIndex when totalChanges changes
  useEffect(() => {
    if (currentChangeIndex >= totalChanges) {
      setCurrentChangeIndex(Math.max(0, totalChanges - 1));
    }
  }, [totalChanges, currentChangeIndex]);

  const handleCellClick = useCallback((cell: DiffCell, rowIndex: number, colIndex: number) => {
    setSelectedCell({ cell, rowIndex, colIndex });
  }, []);

  const handleCloseInspector = useCallback(() => {
    setSelectedCell(null);
  }, []);

  // Debounce timeout ref
  const recompareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced recompare - cancels previous pending recompare
  const debouncedRecompare = useCallback(() => {
    if (recompareTimeoutRef.current) {
      clearTimeout(recompareTimeoutRef.current);
    }
    recompareTimeoutRef.current = setTimeout(() => {
      recompare();
    }, 100); // Small delay to batch rapid changes
  }, [recompare]);

  // Handle matching strategy change - requires recompare
  const handleMatchingStrategyChange = useCallback(
    (strategy: string) => {
      setOptions({ matchingStrategy: strategy as MatchingStrategy });
      debouncedRecompare();
    },
    [setOptions, debouncedRecompare],
  );

  // Handle key column change - requires recompare
  const handleKeyColumnChange = useCallback(
    (columnIndex: number) => {
      setOptions({ keyColumnIndex: columnIndex });
      debouncedRecompare();
    },
    [setOptions, debouncedRecompare],
  );

  // Handle ignored column toggle - requires recompare
  const handleIgnoredColumnToggle = useCallback(
    (columnIndex: number) => {
      const currentIgnored = options.ignoredColumns ?? [];
      const newIgnored = currentIgnored.includes(columnIndex)
        ? currentIgnored.filter((i) => i !== columnIndex)
        : [...currentIgnored, columnIndex];
      console.log("[DEBUG] handleIgnoredColumnToggle:", {
        columnIndex,
        currentIgnored,
        newIgnored,
      });
      setOptions({ ignoredColumns: newIgnored });
      debouncedRecompare();
    },
    [options.ignoredColumns, setOptions, debouncedRecompare],
  );

  // Get available columns for key column selector
  const availableColumns = useMemo(() => {
    const sheetData = originalFile.parsed?.data.get(originalFile.selectedSheet);
    if (!sheetData) return [];
    return sheetData.columns.map((col) => ({
      index: col.index,
      letter: col.letter,
      header: sheetData.rows[0]?.[col.index]?.value,
    }));
  }, [originalFile.parsed, originalFile.selectedSheet]);

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
                {isComparing && (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{tMatching("strategy.label")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={options.matchingStrategy}
                onValueChange={handleMatchingStrategyChange}
              >
                <DropdownMenuRadioItem value="position">
                  {tMatching("strategy.position.label")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="key-column">
                  {tMatching("strategy.keyColumn.label")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lcs">
                  {tMatching("strategy.lcs.label")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              {options.matchingStrategy === "key-column" && availableColumns.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{tMatching("keyColumn.label")}</DropdownMenuLabel>
                  <div className="max-h-[200px] overflow-y-auto">
                    <DropdownMenuRadioGroup
                      value={options.keyColumnIndex?.toString() ?? ""}
                      onValueChange={(v) => handleKeyColumnChange(Number(v))}
                    >
                      {availableColumns.map((col) => (
                        <DropdownMenuRadioItem key={col.index} value={col.index.toString()}>
                          <span className="font-mono">{col.letter}</span>
                          {col.header && (
                            <span className="ml-2 text-muted-foreground truncate max-w-[150px]">
                              - {String(col.header)}
                            </span>
                          )}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </div>
                </>
              )}

              {/* Ignored Columns */}
              {availableColumns.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    {tMatching("ignoredColumns.label")}
                    {(options.ignoredColumns?.length ?? 0) > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({options.ignoredColumns?.length})
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <div className="max-h-[200px] overflow-y-auto">
                    {availableColumns.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.index}
                        checked={options.ignoredColumns?.includes(col.index) ?? false}
                        onCheckedChange={() => handleIgnoredColumnToggle(col.index)}
                      >
                        <span className="font-mono">{col.letter}</span>
                        {col.header && (
                          <span className="ml-2 text-muted-foreground truncate max-w-[150px]">
                            - {String(col.header)}
                          </span>
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </>
              )}

              <DropdownMenuSeparator />

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
                onCheckedChange={(checked) => {
                  setOptions({ ignoreWhitespace: checked });
                  debouncedRecompare();
                }}
              >
                {tOptions("ignoreWhitespace")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={options.ignoreCase}
                onCheckedChange={(checked) => {
                  setOptions({ ignoreCase: checked });
                  debouncedRecompare();
                }}
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

        {/* Loading overlay during reprocessing */}
        {isComparing && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className="text-sm text-muted-foreground font-medium">
                {t("processing")}
              </p>
            </div>
          </div>
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
