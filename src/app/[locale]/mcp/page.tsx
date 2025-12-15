import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MCPPage } from "@/components/mcp";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mcp" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/mcp`,
      languages: {
        en: `${BASE_URL}/en/mcp`,
        es: `${BASE_URL}/es/mcp`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/mcp`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function MCPPageRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MCPPage />;
}
