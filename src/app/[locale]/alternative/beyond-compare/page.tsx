import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlternativePage } from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alternative.beyond-compare" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/alternative/beyond-compare`,
      languages: {
        en: "/en/alternative/beyond-compare",
        es: "/es/alternative/beyond-compare",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/alternative/beyond-compare`,
      type: "website",
    },
  };
}

export default async function BeyondComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AlternativePage competitor="beyond-compare" />;
}
