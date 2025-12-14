import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.ods" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/ods-compare`,
      languages: {
        en: "/en/ods-compare",
        es: "/es/ods-compare",
      },
    },
  };
}

export default async function OdsComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage type="ods" />;
}
