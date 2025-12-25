"use client";

import { AlertCircle, FileSpreadsheet, GripVertical, Loader2, Rows3, Columns3, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatFileSize } from "@/lib/parser";
import { cn } from "@/lib/utils";
import type { MergeFileState } from "@/types/merge";

interface MergeFileCardProps {
  file: MergeFileState;
  index: number;
  onRemove: () => void;
  onSheetChange: (sheet: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

export function MergeFileCard({
  file,
  index,
  onRemove,
  onSheetChange,
  dragHandleProps,
  isDragging = false,
}: MergeFileCardProps) {
  const t = useTranslations("merge");

  // Get selected sheet info
  const selectedSheetInfo = file.parsed?.sheets.find((s) => s.name === file.selectedSheet);
  const rowCount = selectedSheetInfo?.rowCount ?? 0;
  const colCount = selectedSheetInfo?.columnCount ?? 0;

  // Loading state
  if (file.isLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border bg-card p-4 transition-all",
          isDragging && "shadow-lg scale-[1.02]",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{file.file?.name}</p>
          <p className="text-muted-foreground text-sm">{t("fileCard.loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (file.error) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{file.file?.name}</p>
          <p className="truncate text-destructive text-sm">{file.error}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onRemove}
          aria-label={t("fileCard.remove")}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // Successfully loaded file
  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-green-500/30",
        isDragging && "shadow-lg scale-[1.02] border-green-500/50 bg-green-500/5",
      )}
    >
      {/* Drag handle + Order number */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <div
          {...dragHandleProps}
          className="flex cursor-grab items-center justify-center text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/15 font-semibold text-green-600 text-sm dark:text-green-400">
          {index + 1}
        </div>
      </div>

      {/* File info - main content */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* File name and icon */}
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          <p className="truncate font-medium">{file.file?.name}</p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
          <span className="flex items-center gap-1.5">
            <Rows3 className="h-3.5 w-3.5" />
            {rowCount} {t("fileCard.rows")}
          </span>
          <span className="flex items-center gap-1.5">
            <Columns3 className="h-3.5 w-3.5" />
            {colCount} {t("fileCard.cols")}
          </span>
          <span>{formatFileSize(file.file?.size ?? 0)}</span>
        </div>

        {/* Sheet selector - if multiple sheets */}
        {file.parsed && file.parsed.sheets.length > 1 && (
          <div className="pt-1">
            <Select value={file.selectedSheet} onValueChange={onSheetChange}>
              <SelectTrigger className="h-8 w-full max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {file.parsed.sheets.map((sheet) => (
                  <SelectItem key={sheet.name} value={sheet.name}>
                    {sheet.name} ({sheet.rowCount} {t("fileCard.rows")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        onClick={onRemove}
        aria-label={t("fileCard.remove")}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
