"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SheetInfo } from "@/types";

interface SheetSelectorProps {
  sheets: SheetInfo[];
  selectedSheet: string;
  onSheetChange: (sheet: string) => void;
  disabled?: boolean;
}

export function SheetSelector({
  sheets,
  selectedSheet,
  onSheetChange,
  disabled = false,
}: SheetSelectorProps) {
  const t = useTranslations("upload");

  if (sheets.length === 0) {
    return null;
  }

  // If only one sheet, show it as text
  if (sheets.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("selectSheet")}:</span>
        <span className="font-medium">{sheets[0].name}</span>
        <span className="text-muted-foreground text-xs">
          ({t("fileInfo", { rows: sheets[0].rowCount, cols: sheets[0].columnCount })})
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">{t("selectSheet")}:</span>
      <Select value={selectedSheet} onValueChange={onSheetChange} disabled={disabled}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("selectSheet")} />
        </SelectTrigger>
        <SelectContent>
          {sheets.map((sheet) => (
            <SelectItem key={sheet.name} value={sheet.name}>
              {sheet.name}
              <span className="ml-2 text-muted-foreground text-xs">
                ({sheet.rowCount} x {sheet.columnCount})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
