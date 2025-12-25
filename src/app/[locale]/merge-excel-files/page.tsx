import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.merge" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/merge-excel-files`,
      languages: {
        en: `${BASE_URL}/en/merge-excel-files`,
        es: `${BASE_URL}/es/merge-excel-files`,
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: `${BASE_URL}/${locale}/merge-excel-files`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function MergeExcelFilesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage format="merge" locale={locale as Locale} />;
}
