"use client";

import { Github, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogoIcon } from "@/components/brand";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity"
          >
            <LogoIcon size={28} />
            <span className="font-display font-semibold text-lg">
              Diff<span className="text-green-400">Sheets</span>
            </span>
          </Link>

          {/* Privacy notice */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Shield className="h-4 w-4 text-green-400" />
            <span>{t("privacy")}</span>
          </div>

          {/* Links and credits */}
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <span>{t("madeWith")}</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </div>
            <span className="text-border">•</span>
            <a
              href="https://github.com/LyricalString/diffsheets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              {t("opensource")}
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} DiffSheets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
