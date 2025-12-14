import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.xls" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/xls-diff`,
      languages: {
        en: "/en/xls-diff",
        es: "/es/xls-diff",
      },
    },
  };
}

export default async function XlsDiffPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage type="xls" />;
}
