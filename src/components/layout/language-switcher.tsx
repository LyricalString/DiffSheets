"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocaleCookie } from "@/lib/locale";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", short: "EN" },
  { code: "es", name: "Español", flag: "🇪🇸", short: "ES" },
] as const;

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      setLocaleCookie(newLocale);
    });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          aria-label={t("language")}
          className="h-9 gap-1.5 px-2.5 transition-all duration-200 hover:scale-105 hover:bg-accent"
        >
          <span className="text-base leading-none">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium">{currentLanguage?.short}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`gap-2 ${locale === lang.code ? "bg-accent font-medium" : ""}`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
