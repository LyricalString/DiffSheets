"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSpreadsheetStore } from "@/store";

export function ComparisonOptions() {
  const t = useTranslations("diff.options");
  const { options, setOptions } = useSpreadsheetStore();

  return (
    <Card className="p-4">
      <h3 className="mb-4 font-semibold text-sm">{t("title")}</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="hideUnchangedRows" className="text-sm">
            {t("hideUnchangedRows")}
          </label>
          <Switch
            id="hideUnchangedRows"
            checked={options.hideUnchangedRows}
            onCheckedChange={(checked) => setOptions({ hideUnchangedRows: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="hideUnchangedCols" className="text-sm">
            {t("hideUnchangedCols")}
          </label>
          <Switch
            id="hideUnchangedCols"
            checked={options.hideUnchangedColumns}
            onCheckedChange={(checked) => setOptions({ hideUnchangedColumns: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <label htmlFor="ignoreWhitespace" className="text-sm">
            {t("ignoreWhitespace")}
          </label>
          <Switch
            id="ignoreWhitespace"
            checked={options.ignoreWhitespace}
            onCheckedChange={(checked) => setOptions({ ignoreWhitespace: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="ignoreCase" className="text-sm">
            {t("ignoreCase")}
          </label>
          <Switch
            id="ignoreCase"
            checked={options.ignoreCase}
            onCheckedChange={(checked) => setOptions({ ignoreCase: checked })}
          />
        </div>
      </div>
    </Card>
  );
}
