import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DynamicMergeSection } from "@/components/landing/dynamic-merge";
import { CompareHeader } from "@/components/layout/compare-header";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "merge" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/merge`,
      languages: {
        en: `${BASE_URL}/en/merge`,
        es: `${BASE_URL}/es/merge`,
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: `${BASE_URL}/${locale}/merge`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function MergePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "merge" });

  return (
    <div className="relative flex min-h-screen flex-col bg-background overflow-x-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
        style={{
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, transparent 70%)",
        }}
      />

      <CompareHeader locale={locale as Locale} />

      <main className="relative flex-1 px-3 py-6 sm:px-4 lg:px-6">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-3">
            {t("subtitle")}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-600 dark:text-green-400">
            <Shield className="h-3 w-3" />
            <span>100% Private</span>
          </div>
        </div>

        {/* Merge tool */}
        <div className="mx-auto max-w-3xl">
          <DynamicMergeSection />
        </div>
      </main>
    </div>
  );
}
