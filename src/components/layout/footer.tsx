"use client";

import { useTranslations } from "next-intl";
import { Shield, Heart } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>{t("privacy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{t("madeWith")}</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="mx-1">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {t("opensource")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
