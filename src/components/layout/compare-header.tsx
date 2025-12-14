"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogoIcon } from "@/components/brand";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { useSpreadsheetStore } from "@/store";
import { ThemeToggle } from "./theme-toggle";

interface CompareHeaderProps {
  locale: Locale;
}

export function CompareHeader({ locale }: CompareHeaderProps) {
  const t = useTranslations("compare");
  const { reset, originalFile, modifiedFile } = useSpreadsheetStore();

  const hasFiles = originalFile.file || modifiedFile.file;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-green-500"
            asChild
          >
            <Link href={`/${locale}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("header.back")}</span>
            </Link>
          </Button>

          <div className="h-5 w-px bg-border" aria-hidden="true" />

          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <LogoIcon size={28} />
            <span className="font-display font-bold text-base hidden sm:block">
              Diff<span className="text-green-900 dark:text-green-100">Sheets</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {hasFiles && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => reset()}
              className="gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/50"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">{t("header.newComparison")}</span>
            </Button>
          )}

          <div className="h-5 w-px bg-border mx-1" aria-hidden="true" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
