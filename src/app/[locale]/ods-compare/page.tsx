import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing";
import { BASE_URL, getAlternates, getLocalizedUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.ods" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "/ods-compare"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getLocalizedUrl(locale, "/ods-compare"),
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function OdsComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage format="ods" locale={locale} />;
}
