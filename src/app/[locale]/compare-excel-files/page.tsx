import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.excel" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/compare-excel-files`,
      languages: {
        en: `${BASE_URL}/en/compare-excel-files`,
        es: `${BASE_URL}/es/compare-excel-files`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/compare-excel-files`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function CompareExcelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage type="excel" />;
}
