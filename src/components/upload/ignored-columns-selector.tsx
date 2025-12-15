"use client";

import { EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { SheetData } from "@/types";

interface IgnoredColumnsSelectorProps {
  sheet: SheetData;
  selectedIndices: number[];
  onSelect: (indices: number[]) => void;
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

interface ColumnInfo {
  index: number;
  letter: string;
  header: string | null;
}

function getColumnInfo(sheet: SheetData, columnIndex: number): ColumnInfo {
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

  return {
    index: columnIndex,
    letter,
    header,
  };
}

export function IgnoredColumnsSelector({
  sheet,
  selectedIndices,
  onSelect,
  disabled = false,
}: IgnoredColumnsSelectorProps) {
  const t = useTranslations("matching");
  const [isOpen, setIsOpen] = useState(false);

  const columnOptions = useMemo(() => {
    return sheet.columns.map((col) => getColumnInfo(sheet, col.index));
  }, [sheet]);

  const toggleColumn = (index: number) => {
    if (disabled) return;

    if (selectedIndices.includes(index)) {
      onSelect(selectedIndices.filter((i) => i !== index));
    } else {
      onSelect([...selectedIndices, index]);
    }
  };

  const clearAll = () => {
    if (!disabled) {
      onSelect([]);
    }
  };

  const ignoredCount = selectedIndices.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-muted-foreground" />
          <span>{t("ignoredColumns.label")}</span>
          {ignoredCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {ignoredCount}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        <div className="mt-2 rounded-md border border-border bg-background p-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            {t("ignoredColumns.description")}
          </p>

          <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto">
            {columnOptions.map((col) => {
              const isSelected = selectedIndices.includes(col.index);
              return (
                <button
                  key={col.index}
                  type="button"
                  onClick={() => toggleColumn(col.index)}
                  disabled={disabled}
                  className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
                    transition-colors cursor-pointer
                    ${
                      isSelected
                        ? "bg-red-500/20 text-red-400 border border-red-500/50"
                        : "bg-muted hover:bg-accent border border-transparent"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  title={col.header || `Column ${col.letter}`}
                >
                  <span className="font-semibold">{col.letter}</span>
                  {col.header && (
                    <span className="text-muted-foreground max-w-[80px] truncate">
                      {col.header}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {ignoredCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {t("ignoredColumns.selected", { count: ignoredCount })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={disabled}
                className="h-7 text-xs"
              >
                {t("ignoredColumns.clearAll")}
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
