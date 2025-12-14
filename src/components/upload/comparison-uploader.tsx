"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "./file-dropzone";
import { SheetSelector } from "./sheet-selector";
import { SpreadsheetPreview } from "./spreadsheet-preview";
import { useSpreadsheetStore } from "@/store";
import { parseSpreadsheet } from "@/lib/parser";
import { computeSpreadsheetDiff } from "@/lib/diff";

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
    [setOriginalFile, setOriginalParsed, setOriginalLoading, setOriginalError]
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
    [setModifiedFile, setModifiedParsed, setModifiedLoading, setModifiedError]
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
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-bold text-3xl tracking-tight md:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* File Upload Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Original File */}
        <div className="space-y-4">
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
        <div className="space-y-4">
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
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          disabled={!canCompare || isComparing}
          onClick={handleCompare}
          className="min-w-[220px]"
        >
          {isComparing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("findDifference")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
