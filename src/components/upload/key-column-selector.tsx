"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SheetData } from "@/types";

interface KeyColumnSelectorProps {
  sheet: SheetData;
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

function getColumnLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

interface ColumnOption {
  index: number;
  letter: string;
  header: string | null;
  preview: string[];
  duplicateCount: number;
  emptyCount: number;
}

function analyzeColumn(sheet: SheetData, columnIndex: number): ColumnOption {
  const letter = getColumnLetter(columnIndex);
  const rows = sheet.rows;

  // Get header from first row (if it looks like a header)
  const headerCell = rows[0]?.[columnIndex];
  const headerValue = headerCell?.value;
  const isLikelyHeader =
    headerCell?.type === "string" &&
    typeof headerValue === "string" &&
    headerValue.length > 0 &&
    headerValue.length < 50;
  const header = isLikelyHeader ? String(headerValue) : null;

  // Analyze values (skip header row if detected)
  const startRow = isLikelyHeader ? 1 : 0;
  const values: string[] = [];
  const valueSet = new Set<string>();
  let emptyCount = 0;
  let duplicateCount = 0;

  for (let i = startRow; i < rows.length && i < startRow + 100; i++) {
    const cell = rows[i]?.[columnIndex];
    const value = cell?.value;

    if (value === null || value === undefined || value === "") {
      emptyCount++;
    } else {
      const strValue = String(value);
      if (valueSet.has(strValue)) {
        duplicateCount++;
      } else {
        valueSet.add(strValue);
      }

      // Collect first few unique values for preview
      if (values.length < 3 && !values.includes(strValue)) {
        values.push(strValue.length > 20 ? strValue.slice(0, 20) + "..." : strValue);
      }
    }
  }

  return {
    index: columnIndex,
    letter,
    header,
    preview: values,
    duplicateCount,
    emptyCount,
  };
}

export function KeyColumnSelector({
  sheet,
  selectedIndex,
  onSelect,
  disabled = false,
}: KeyColumnSelectorProps) {
  const t = useTranslations("matching");

  const columnOptions = useMemo(() => {
    return sheet.columns.map((col) => analyzeColumn(sheet, col.index));
  }, [sheet]);

  const selectedColumn = columnOptions.find((c) => c.index === selectedIndex);

  const hasDuplicateWarning = selectedColumn && selectedColumn.duplicateCount > 5;
  const hasEmptyWarning =
    selectedColumn && selectedColumn.emptyCount > sheet.rows.length * 0.2;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("keyColumn.label")}:</span>
        <Select
          value={selectedIndex !== undefined ? String(selectedIndex) : ""}
          onValueChange={(value) => onSelect(Number(value))}
          disabled={disabled}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("keyColumn.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {columnOptions.map((col) => (
              <SelectItem key={col.index} value={String(col.index)}>
                <span className="font-mono font-medium">{col.letter}</span>
                {col.header && (
                  <span className="ml-2 text-muted-foreground">- {col.header}</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedColumn && selectedColumn.preview.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t("keyColumn.preview")}:</span>
          <div className="flex gap-1">
            {selectedColumn.preview.map((value, i) => (
              <Badge key={i} variant="secondary" className="font-mono text-xs">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedColumn && selectedColumn.preview.length === 0 && (
        <p className="text-xs text-muted-foreground">{t("keyColumn.noData")}</p>
      )}

      {hasDuplicateWarning && (
        <div className="flex items-center gap-1.5 text-xs text-amber-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{t("warnings.duplicates")}</span>
        </div>
      )}

      {hasEmptyWarning && (
        <div className="flex items-center gap-1.5 text-xs text-amber-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{t("warnings.empty")}</span>
        </div>
      )}
    </div>
  );
}
