import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlternativePage } from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alternative.excel-compare" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/alternative/excel-compare`,
      languages: {
        en: "/en/alternative/excel-compare",
        es: "/es/alternative/excel-compare",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/alternative/excel-compare`,
      type: "website",
    },
  };
}

export default async function ExcelComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AlternativePage competitor="excel-compare" />;
}
