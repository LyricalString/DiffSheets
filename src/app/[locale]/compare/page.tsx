import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompareHeader } from "@/components/layout/compare-header";
import { DynamicComparisonSection } from "@/components/landing/dynamic-comparison";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/compare`,
      languages: {
        en: `${BASE_URL}/en/compare`,
        es: `${BASE_URL}/es/compare`,
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: `${BASE_URL}/${locale}/compare`,
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CompareHeader locale={locale as Locale} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <DynamicComparisonSection />
      </main>
    </div>
  );
}
