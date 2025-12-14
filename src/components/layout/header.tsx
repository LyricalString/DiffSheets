"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Github, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all duration-200 group-hover:shadow-emerald-500/30 group-hover:scale-105">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg leading-tight">
              DiffSheets
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block leading-tight">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="transition-all duration-200 hover:scale-105 hover:bg-accent"
            asChild
          >
            <a
              href="https://github.com/thedotmack/diffsheets"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("github")}
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          {/* Separator */}
          <div className="mx-2 h-5 w-px bg-border" aria-hidden="true" />

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
