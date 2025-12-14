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
      <Card className="relative p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onFileClear}
          aria-label={t("clear")}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
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
      <Card className="flex min-h-[200px] flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-muted-foreground text-sm">{t("processing")}</p>
      </Card>
    );
  }

  // Dropzone
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition-all duration-200",
        isDragActive && !isDragReject && "border-primary bg-primary/5 scale-[1.02]",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive && "hover:border-primary/50 hover:bg-muted/30",
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          isDragActive ? "bg-primary/20" : "bg-muted",
        )}
      >
        <Upload
          className={cn("h-7 w-7", isDragActive ? "text-primary" : "text-muted-foreground")}
        />
      </div>

      <div className="mt-5 text-center">
        <p className="font-semibold">{side === "original" ? t("original") : t("modified")}</p>
        <p className="mt-1.5 text-muted-foreground text-sm">{t("dropzone.title")}</p>
        <p className="text-muted-foreground/80 text-xs">{t("dropzone.subtitle")}</p>
      </div>

      <p className="mt-5 rounded-full bg-muted/50 px-3 py-1 text-muted-foreground text-xs">
        {t("dropzone.formats")}
      </p>

      {error && <p className="mt-3 text-destructive text-sm">{error}</p>}
    </Card>
  );
}
