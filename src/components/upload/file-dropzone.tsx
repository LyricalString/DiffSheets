"use client";

import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatFileSize,
  isFileSupported,
  SUPPORTED_EXTENSIONS,
  SUPPORTED_MIME_TYPES,
} from "@/lib/parser";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  side: "original" | "modified";
  file: File | null;
  isLoading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}

export function FileDropzone({
  side,
  file,
  isLoading,
  error,
  onFileSelect,
  onFileClear,
}: FileDropzoneProps) {
  const t = useTranslations("upload");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile && isFileSupported(selectedFile)) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: SUPPORTED_MIME_TYPES.reduce(
      (acc, type) => {
        acc[type] = SUPPORTED_EXTENSIONS.map((ext) => ext);
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: 1,
    disabled: isLoading,
  });

  // File is loaded - show file info
  if (file && !isLoading) {
    return (
      <Card className="relative rounded-2xl border-green-500/30 bg-green-500/5 p-4 transition-all duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onFileClear}
          aria-label={t("clear")}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15">
            <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">{file.name}</p>
            <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
          </div>
        </div>

        {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-green-500/30 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
        <p className="mt-3 text-muted-foreground text-sm">{t("processing")}</p>
      </Card>
    );
  }

  // Dropzone
  const inputId = `file-input-${side}`;
  const labelText = side === "original" ? t("original") : t("modified");

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300",
        isDragActive && !isDragReject && "border-green-500 bg-green-500/10 scale-[1.01]",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive &&
          "hover:border-green-500/40 hover:bg-green-500/5 hover:shadow-md hover:shadow-green-500/5",
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        {t("dropzone.title")} - {labelText}
      </label>
      <input {...getInputProps()} id={inputId} aria-describedby={`${inputId}-formats`} />

      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
          isDragActive ? "bg-green-500/20" : "bg-green-500/10",
        )}
      >
        <Upload
          className={cn(
            "h-6 w-6 transition-colors",
            isDragActive ? "text-green-500" : "text-green-600 dark:text-green-400",
          )}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="font-display font-semibold text-sm">
          {side === "original" ? t("original") : t("modified")}
        </p>
        <p className="mt-1 text-muted-foreground text-sm">{t("dropzone.title")}</p>
        <p className="text-muted-foreground text-xs">{t("dropzone.subtitle")}</p>
      </div>

      <p
        id={`${inputId}-formats`}
        className="mt-4 rounded-full bg-muted/50 px-3 py-1 text-muted-foreground text-xs"
      >
        {t("dropzone.formats")}
      </p>

      {error && <p className="mt-3 text-destructive text-sm">{error}</p>}
    </Card>
  );
}
