import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";
import { BASE_URL, getAlternates, getLocalizedUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.csv" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "/csv-diff"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getLocalizedUrl(locale, "/csv-diff"),
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function CsvDiffPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage type="csv" />;
}
