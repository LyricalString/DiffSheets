"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { computeSpreadsheetDiff } from "@/lib/diff";
import { parseSpreadsheet } from "@/lib/parser";
import { useSpreadsheetStore } from "@/store";
import { FileDropzone } from "./file-dropzone";
import { SheetSelector } from "./sheet-selector";
import { SpreadsheetPreview } from "./spreadsheet-preview";

export function ComparisonUploader() {
  const t = useTranslations("upload");

  const {
    originalFile,
    modifiedFile,
    isComparing,
    options,
    setOriginalFile,
    setOriginalParsed,
    setOriginalSheet,
    setOriginalLoading,
    setOriginalError,
    setModifiedFile,
    setModifiedParsed,
    setModifiedSheet,
    setModifiedLoading,
    setModifiedError,
    setDiffResult,
    setIsComparing,
    setComparisonError,
    resetOriginal,
    resetModified,
  } = useSpreadsheetStore();

  const handleOriginalFileSelect = useCallback(
    async (file: File) => {
      setOriginalFile(file);
      setOriginalLoading(true);
      setOriginalError(null);

      try {
        const parsed = await parseSpreadsheet(file);
        setOriginalParsed(parsed);
      } catch (error) {
        setOriginalError(error instanceof Error ? error.message : "Failed to parse file");
      } finally {
        setOriginalLoading(false);
      }
    },
    [setOriginalFile, setOriginalParsed, setOriginalLoading, setOriginalError],
  );

  const handleModifiedFileSelect = useCallback(
    async (file: File) => {
      setModifiedFile(file);
      setModifiedLoading(true);
      setModifiedError(null);

      try {
        const parsed = await parseSpreadsheet(file);
        setModifiedParsed(parsed);
      } catch (error) {
        setModifiedError(error instanceof Error ? error.message : "Failed to parse file");
      } finally {
        setModifiedLoading(false);
      }
    },
    [setModifiedFile, setModifiedParsed, setModifiedLoading, setModifiedError],
  );

  const canCompare =
    originalFile.parsed &&
    modifiedFile.parsed &&
    originalFile.selectedSheet &&
    modifiedFile.selectedSheet &&
    !originalFile.isLoading &&
    !modifiedFile.isLoading;

  const handleCompare = useCallback(() => {
    const origData = originalFile.parsed?.data.get(originalFile.selectedSheet);
    const modData = modifiedFile.parsed?.data.get(modifiedFile.selectedSheet);

    if (!origData || !modData) {
      setComparisonError("Missing sheet data");
      return;
    }

    setIsComparing(true);
    setComparisonError(null);

    try {
      const result = computeSpreadsheetDiff(origData, modData, options);
      setDiffResult(result);
    } catch (error) {
      setComparisonError(error instanceof Error ? error.message : "Comparison failed");
    } finally {
      setIsComparing(false);
    }
  }, [
    originalFile.parsed,
    originalFile.selectedSheet,
    modifiedFile.parsed,
    modifiedFile.selectedSheet,
    options,
    setDiffResult,
    setIsComparing,
    setComparisonError,
  ]);

  const originalSheetData = originalFile.parsed?.data.get(originalFile.selectedSheet);
  const modifiedSheetData = modifiedFile.parsed?.data.get(modifiedFile.selectedSheet);

  return (
    <div className="space-y-6">
      {/* File Upload Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original File */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/10 font-mono text-xs font-semibold text-red-600 dark:text-red-400">
              A
            </span>
            <span className="font-display text-sm font-medium text-muted-foreground">
              {t("original")}
            </span>
          </div>
          <FileDropzone
            side="original"
            file={originalFile.file}
            isLoading={originalFile.isLoading}
            error={originalFile.error}
            onFileSelect={handleOriginalFileSelect}
            onFileClear={resetOriginal}
          />

          {originalFile.parsed && (
            <SheetSelector
              sheets={originalFile.parsed.sheets}
              selectedSheet={originalFile.selectedSheet}
              onSheetChange={setOriginalSheet}
            />
          )}

          {originalSheetData && <SpreadsheetPreview data={originalSheetData} />}
        </div>

        {/* Modified File */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 font-mono text-xs font-semibold text-green-600 dark:text-green-400">
              B
            </span>
            <span className="font-display text-sm font-medium text-muted-foreground">
              {t("modified")}
            </span>
          </div>
          <FileDropzone
            side="modified"
            file={modifiedFile.file}
            isLoading={modifiedFile.isLoading}
            error={modifiedFile.error}
            onFileSelect={handleModifiedFileSelect}
            onFileClear={resetModified}
          />

          {modifiedFile.parsed && (
            <SheetSelector
              sheets={modifiedFile.parsed.sheets}
              selectedSheet={modifiedFile.selectedSheet}
              onSheetChange={setModifiedSheet}
            />
          )}

          {modifiedSheetData && <SpreadsheetPreview data={modifiedSheetData} />}
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center pt-2">
        <Button
          size="lg"
          disabled={!canCompare || isComparing}
          onClick={handleCompare}
          className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {isComparing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("findDifference")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
