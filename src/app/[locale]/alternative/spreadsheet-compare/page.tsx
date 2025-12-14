import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlternativePage } from "@/components/landing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alternative.spreadsheet-compare" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/alternative/spreadsheet-compare`,
      languages: {
        en: `${BASE_URL}/en/alternative/spreadsheet-compare`,
        es: `${BASE_URL}/es/alternative/spreadsheet-compare`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/alternative/spreadsheet-compare`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function SpreadsheetComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AlternativePage competitor="spreadsheet-compare" />;
}
