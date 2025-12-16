import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.csv" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/csv-diff`,
      languages: {
        en: `${BASE_URL}/en/csv-diff`,
        es: `${BASE_URL}/es/csv-diff`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/csv-diff`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function CsvDiffPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage format="csv" locale={locale} />;
}
