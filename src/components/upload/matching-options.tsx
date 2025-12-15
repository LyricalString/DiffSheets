"use client";

import { ChevronDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ComparisonOptions, MatchingStrategy } from "@/types/diff";
import type { SheetData } from "@/types";
import { KeyColumnSelector } from "./key-column-selector";
import { IgnoredColumnsSelector } from "./ignored-columns-selector";

interface MatchingOptionsProps {
  originalSheet: SheetData | null;
  modifiedSheet: SheetData | null;
  options: ComparisonOptions;
  onOptionsChange: (options: Partial<ComparisonOptions>) => void;
}

export function MatchingOptions({
  originalSheet,
  modifiedSheet,
  options,
  onOptionsChange,
}: MatchingOptionsProps) {
  const t = useTranslations("matching");
  const [isOpen, setIsOpen] = useState(false);

  const hasSheets = originalSheet && modifiedSheet;

  const handleStrategyChange = (value: string) => {
    const strategy = value as MatchingStrategy;
    onOptionsChange({
      matchingStrategy: strategy,
      // Reset key column when switching away from key-column strategy
      ...(strategy !== "key-column" && { keyColumnIndex: undefined }),
    });
  };

  const handleKeyColumnChange = (index: number) => {
    onOptionsChange({ keyColumnIndex: index });
  };

  const handleIgnoredColumnsChange = (indices: number[]) => {
    onOptionsChange({ ignoredColumns: indices });
  };

  if (!hasSheets) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <span>{t("title")}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        <div className="mt-3 rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("description")}</p>

            <RadioGroup
              value={options.matchingStrategy}
              onValueChange={handleStrategyChange}
              className="space-y-2"
            >
              {/* By Position */}
              <div className="flex items-start gap-3">
                <RadioGroupItem value="position" id="position" className="mt-0.5" />
                <Label htmlFor="position" className="cursor-pointer space-y-0.5">
                  <div className="font-medium">{t("strategy.position.label")}</div>
                  <p className="text-xs text-muted-foreground font-normal">
                    {t("strategy.position.description")}
                  </p>
                </Label>
              </div>

              {/* By Key Column */}
              <div className="flex items-start gap-3">
                <RadioGroupItem value="key-column" id="key-column" className="mt-0.5" />
                <Label htmlFor="key-column" className="cursor-pointer space-y-0.5">
                  <div className="font-medium">{t("strategy.keyColumn.label")}</div>
                  <p className="text-xs text-muted-foreground font-normal">
                    {t("strategy.keyColumn.description")}
                  </p>
                </Label>
              </div>

              {/* Smart Matching (LCS) */}
              <div className="flex items-start gap-3">
                <RadioGroupItem value="lcs" id="lcs" className="mt-0.5" />
                <Label htmlFor="lcs" className="cursor-pointer space-y-0.5">
                  <div className="font-medium">{t("strategy.lcs.label")}</div>
                  <p className="text-xs text-muted-foreground font-normal">
                    {t("strategy.lcs.description")}
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Key Column Selector - only shown when key-column strategy is selected */}
          {options.matchingStrategy === "key-column" && (
            <div className="pt-2 border-t border-border">
              <KeyColumnSelector
                sheet={originalSheet}
                selectedIndex={options.keyColumnIndex}
                onSelect={handleKeyColumnChange}
              />
            </div>
          )}

          {/* Ignored Columns Selector */}
          <div className="pt-2 border-t border-border">
            <IgnoredColumnsSelector
              sheet={originalSheet}
              selectedIndices={options.ignoredColumns ?? []}
              onSelect={handleIgnoredColumnsChange}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
