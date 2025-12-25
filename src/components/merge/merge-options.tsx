"use client";

import { FileStack, Rows3, Columns3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { MergeMode, MergeOptions as MergeOptionsType, SheetNamingStrategy } from "@/types/merge";

interface MergeOptionsProps {
  options: MergeOptionsType;
  onOptionsChange: (options: Partial<MergeOptionsType>) => void;
}

const modes: { value: MergeMode; icon: typeof FileStack }[] = [
  { value: "combine-workbooks", icon: FileStack },
  { value: "append-rows", icon: Rows3 },
  { value: "append-columns", icon: Columns3 },
];

export function MergeOptions({ options, onOptionsChange }: MergeOptionsProps) {
  const t = useTranslations("merge");

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="space-y-3">
        <Label className="font-display font-semibold">{t("options.mode.label")}</Label>
        <RadioGroup
          value={options.mode}
          onValueChange={(value) => onOptionsChange({ mode: value as MergeMode })}
          className="grid gap-3 sm:grid-cols-3"
        >
          {modes.map(({ value, icon: Icon }) => (
            <Label
              key={value}
              htmlFor={value}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-green-500/40",
                options.mode === value
                  ? "border-green-500 bg-green-500/10"
                  : "border-border",
              )}
            >
              <RadioGroupItem value={value} id={value} className="sr-only" />
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  options.mode === value ? "bg-green-500/20" : "bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    options.mode === value
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{t(`options.mode.${value}.label`)}</p>
                <p className="text-muted-foreground text-xs">
                  {t(`options.mode.${value}.description`)}
                </p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Mode-specific options */}
      {options.mode === "combine-workbooks" && (
        <div className="space-y-3">
          <Label htmlFor="sheet-naming">{t("options.sheetNaming.label")}</Label>
          <Select
            value={options.sheetNamingStrategy}
            onValueChange={(value) =>
              onOptionsChange({ sheetNamingStrategy: value as SheetNamingStrategy })
            }
          >
            <SelectTrigger id="sheet-naming">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="filename">{t("options.sheetNaming.filename")}</SelectItem>
              <SelectItem value="original">{t("options.sheetNaming.original")}</SelectItem>
              <SelectItem value="numbered">{t("options.sheetNaming.numbered")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {options.mode === "append-rows" && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="include-headers" className="font-medium">
              {t("options.includeHeaders.label")}
            </Label>
            <p className="text-muted-foreground text-xs">
              {t("options.includeHeaders.description")}
            </p>
          </div>
          <Switch
            id="include-headers"
            checked={options.includeHeaders}
            onCheckedChange={(checked) => onOptionsChange({ includeHeaders: checked })}
          />
        </div>
      )}

      {/* Output filename */}
      <div className="space-y-3">
        <Label htmlFor="output-filename">{t("options.filename.label")}</Label>
        <div className="flex items-center gap-2">
          <Input
            id="output-filename"
            value={options.outputFilename}
            onChange={(e) => onOptionsChange({ outputFilename: e.target.value })}
            placeholder="merged"
            className="flex-1"
          />
          <span className="text-muted-foreground text-sm">.xlsx</span>
        </div>
      </div>
    </div>
  );
}
