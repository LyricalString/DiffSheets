import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";
import { BASE_URL, getAlternates, getLocalizedUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.excel" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "/compare-excel-files"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getLocalizedUrl(locale, "/compare-excel-files"),
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
