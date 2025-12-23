import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MCPPage } from "@/components/mcp";
import { BASE_URL, getAlternates, getLocalizedUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mcp" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "/mcp"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getLocalizedUrl(locale, "/mcp"),
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
