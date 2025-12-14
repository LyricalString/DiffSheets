"use client";

import { ArrowLeft, FileSpreadsheet, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useSpreadsheetStore } from "@/store";
import type { Locale } from "@/i18n/routing";

interface CompareHeaderProps {
  locale: Locale;
}

export function CompareHeader({ locale }: CompareHeaderProps) {
  const t = useTranslations("compare");
  const { reset, originalFile, modifiedFile } = useSpreadsheetStore();

  const hasFiles = originalFile.file || modifiedFile.file;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href={`/${locale}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("header.back")}</span>
            </Link>
          </Button>

          <div className="h-5 w-px bg-border" aria-hidden="true" />

          <Link href={`/${locale}`} className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md shadow-emerald-500/20 transition-all duration-200 group-hover:shadow-emerald-500/30 group-hover:scale-105">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">DiffSheets</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {hasFiles && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => reset()}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">{t("header.newComparison")}</span>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
