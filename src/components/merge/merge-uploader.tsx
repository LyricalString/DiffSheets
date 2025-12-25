"use client";

import { AlertCircle, Loader2, Merge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMergeStore } from "@/store/merge-store";
import { FileList } from "./file-list";
import { MergeOptions } from "./merge-options";
import { MergePreview } from "./merge-preview";
import { MergeResult } from "./merge-result";
import { MultiFileDropzone } from "./multi-file-dropzone";

export function MergeUploader() {
  const t = useTranslations("merge");

  const {
    files,
    options,
    result,
    isProcessing,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    setFileSheet,
    setOptions,
    executeMerge,
    downloadResult,
    reset,
  } = useMergeStore();

  const validFileCount = files.filter((f) => f.parsed && f.selectedSheet && !f.error).length;
  const canMerge = validFileCount >= 2 && !isProcessing;

  // Show result if merge was successful
  if (result) {
    return (
      <div className="space-y-6">
        <MergeResult
          filename={options.outputFilename}
          options={options}
          onDownload={downloadResult}
          onNewMerge={reset}
        />
        <MergePreview preview={result.preview} />
      </div>
    );
  }

  // No files yet - show centered dropzone
  if (files.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <MultiFileDropzone
          onFilesSelect={addFiles}
          fileCount={files.length}
          disabled={isProcessing}
        />
      </div>
    );
  }

  // Has files - show two-column layout on large screens
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Left column: Files (wider) */}
      <div className="space-y-4 lg:col-span-3">
        {/* Compact dropzone for adding more files */}
        <Card className="rounded-2xl border-dashed border-2 border-border bg-muted/30 p-4">
          <MultiFileDropzone
            onFilesSelect={addFiles}
            fileCount={files.length}
            disabled={isProcessing}
            compact
          />
        </Card>

        {/* File list */}
        <Card className="rounded-2xl p-5">
          <FileList
            files={files}
            onRemove={removeFile}
            onSheetChange={setFileSheet}
            onReorder={reorderFiles}
          />
        </Card>

        {/* Minimum files hint */}
        {files.length === 1 && (
          <p className="text-center text-muted-foreground text-sm">{t("hints.addMore")}</p>
        )}
      </div>

      {/* Right column: Options + Actions (narrower) */}
      <div className="space-y-4 lg:col-span-2">
        {/* Options */}
        <Card className="rounded-2xl p-5">
          <h3 className="mb-4 font-display font-semibold text-lg">{t("options.title")}</h3>
          <MergeOptions options={options} onOptionsChange={setOptions} />
        </Card>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Merge button */}
        <Button
          onClick={executeMerge}
          disabled={!canMerge}
          size="lg"
          className="w-full gap-2 bg-green-500 font-semibold text-slate-950 shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-green-500/40 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t("actions.merging")}
            </>
          ) : (
            <>
              <Merge className="h-5 w-5" />
              {t("actions.merge")} ({validFileCount} {t("fileCard.files")})
            </>
          )}
        </Button>

        {/* Privacy hint */}
        <p className="text-center text-muted-foreground text-xs">{t("hints.privacy")}</p>
      </div>
    </div>
  );
}
