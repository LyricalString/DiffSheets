"use client";

import { CheckCircle2, Download, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MergeOptions } from "@/types/merge";

interface MergeResultProps {
  filename: string;
  options: MergeOptions;
  onDownload: () => void;
  onNewMerge: () => void;
}

export function MergeResult({ filename, options, onDownload, onNewMerge }: MergeResultProps) {
  const t = useTranslations("merge");

  return (
    <Card className="overflow-hidden rounded-2xl border-green-500/30 bg-green-500/5">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>

        <h3 className="mt-4 font-display font-semibold text-xl">{t("result.success")}</h3>
        <p className="mt-1 text-muted-foreground">
          {t("result.filename")}: <span className="font-medium">{filename}.xlsx</span>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={onDownload}
            className="gap-2 bg-green-500 px-6 font-semibold text-slate-950 shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-green-500/40"
          >
            <Download className="h-4 w-4" />
            {t("result.download")}
          </Button>

          <Button variant="outline" onClick={onNewMerge} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("result.newMerge")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
