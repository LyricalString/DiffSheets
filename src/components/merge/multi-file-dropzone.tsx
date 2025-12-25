"use client";

import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { isFileSupported, SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES } from "@/lib/parser";
import { cn } from "@/lib/utils";

interface MultiFileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  fileCount: number;
  disabled?: boolean;
  compact?: boolean;
}

export function MultiFileDropzone({
  onFilesSelect,
  fileCount,
  disabled = false,
  compact = false,
}: MultiFileDropzoneProps) {
  const t = useTranslations("merge");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const supportedFiles = acceptedFiles.filter(isFileSupported);
      if (supportedFiles.length > 0) {
        onFilesSelect(supportedFiles);
      }
    },
    [onFilesSelect],
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
    disabled,
    multiple: true,
  });

  const inputId = "merge-file-input";

  // Compact mode - single line with icon and text
  if (compact) {
    return (
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-3 rounded-xl py-3 transition-all duration-200",
          isDragActive && !isDragReject && "bg-green-500/10",
          isDragReject && "bg-destructive/5",
          !isDragActive && "hover:bg-green-500/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} id={inputId} />
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            isDragActive ? "bg-green-500/20" : "bg-green-500/10",
          )}
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors",
              isDragActive ? "text-green-500" : "text-green-600 dark:text-green-400",
            )}
          />
        </div>
        <div>
          <p className="font-medium text-sm">{t("actions.addMore")}</p>
          <p className="text-muted-foreground text-xs">XLSX, XLS, CSV, ODS</p>
        </div>
      </div>
    );
  }

  // Full mode - centered large dropzone
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
        isDragActive && !isDragReject && "border-green-500 bg-green-500/10 scale-[1.01]",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive &&
          "hover:border-green-500/40 hover:bg-green-500/5 hover:shadow-md hover:shadow-green-500/5",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        {t("dropzone.title")}
      </label>
      <input {...getInputProps()} id={inputId} aria-describedby={`${inputId}-formats`} />

      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
          isDragActive ? "bg-green-500/20" : "bg-green-500/10",
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8 transition-colors",
            isDragActive ? "text-green-500" : "text-green-600 dark:text-green-400",
          )}
        />
      </div>

      <div className="mt-5 text-center">
        <p className="font-display font-semibold text-lg">{t("dropzone.title")}</p>
        <p className="mt-1.5 text-muted-foreground">{t("dropzone.subtitle")}</p>
      </div>

      <p
        id={`${inputId}-formats`}
        className="mt-5 rounded-full bg-muted/50 px-4 py-1.5 text-muted-foreground text-sm"
      >
        XLSX, XLS, CSV, ODS
      </p>
    </Card>
  );
}
