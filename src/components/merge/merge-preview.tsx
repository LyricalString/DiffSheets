"use client";

import { FileSpreadsheet, Rows3, Columns3, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { MergePreview as MergePreviewType } from "@/types/merge";

interface MergePreviewProps {
  preview: MergePreviewType;
}

export function MergePreview({ preview }: MergePreviewProps) {
  const t = useTranslations("merge");
  const [activeSheet, setActiveSheet] = useState(preview.sheets[0]?.name || "");

  const activeSheetData = preview.sheets.find((s) => s.name === activeSheet);

  return (
    <Card className="overflow-hidden rounded-2xl">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{preview.totalSheets}</span>{" "}
            <span className="text-muted-foreground">{t("preview.sheets")}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Rows3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{preview.totalRows.toLocaleString()}</span>{" "}
            <span className="text-muted-foreground">{t("preview.rows")}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Columns3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{preview.totalColumns}</span>{" "}
            <span className="text-muted-foreground">{t("preview.columns")}</span>
          </span>
        </div>
      </div>

      {/* Sheet tabs */}
      {preview.sheets.length > 1 ? (
        <Tabs value={activeSheet} onValueChange={setActiveSheet}>
          <div className="border-b bg-muted/20 px-4">
            <TabsList className="h-auto bg-transparent p-0">
              {preview.sheets.map((sheet) => (
                <TabsTrigger
                  key={sheet.name}
                  value={sheet.name}
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {sheet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {preview.sheets.map((sheet) => (
            <TabsContent key={sheet.name} value={sheet.name} className="m-0">
              <SheetPreviewTable sheet={sheet} t={t} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        activeSheetData && <SheetPreviewTable sheet={activeSheetData} t={t} />
      )}
    </Card>
  );
}

interface SheetPreviewTableProps {
  sheet: MergePreviewType["sheets"][0];
  t: ReturnType<typeof useTranslations>;
}

function SheetPreviewTable({ sheet, t }: SheetPreviewTableProps) {
  if (sheet.sampleRows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        {t("preview.empty")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="w-12 px-3 py-2 text-left font-medium text-muted-foreground">#</th>
            {sheet.sampleRows[0]?.map((_, colIndex) => (
              <th
                key={colIndex}
                className="min-w-[100px] px-3 py-2 text-left font-medium text-muted-foreground"
              >
                {String.fromCharCode(65 + colIndex)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheet.sampleRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "border-b last:border-0",
                rowIndex === 0 && "bg-green-500/5 font-medium",
              )}
            >
              <td className="px-3 py-2 text-muted-foreground">{rowIndex + 1}</td>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="max-w-[200px] truncate px-3 py-2">
                  {cell.value !== null ? String(cell.value) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sheet.rowCount > 10 && (
        <div className="border-t bg-muted/20 px-4 py-2 text-center text-muted-foreground text-sm">
          {t("preview.moreRows", { count: sheet.rowCount - 10 })}
        </div>
      )}
    </div>
  );
}
