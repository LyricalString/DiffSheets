import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlternativePage } from "@/components/landing";
import { BASE_URL, getAlternates, getLocalizedUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alternative.spreadsheet-compare" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "/alternative/spreadsheet-compare"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getLocalizedUrl(locale, "/alternative/spreadsheet-compare"),
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
