"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqKeys = ["free", "safe", "formats", "large", "how"] as const;

export function FaqSection() {
  const t = useTranslations("faq");
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center font-bold text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
      <div className="mt-8 divide-y rounded-xl border bg-card">
        {faqKeys.map((key) => (
          <div key={key} className="group">
            <button
              type="button"
              onClick={() => setOpenItem(openItem === key ? null : key)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
              aria-expanded={openItem === key}
            >
              <span className="font-medium pr-4">{t(`items.${key}.question`)}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  openItem === key && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                openItem === key ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-4 text-muted-foreground">{t(`items.${key}.answer`)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
