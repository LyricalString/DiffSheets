import { UseCasePage } from "@/components/landing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useCases.version-control" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/use-cases/version-control`,
      languages: {
        en: "/en/use-cases/version-control",
        es: "/es/use-cases/version-control",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/use-cases/version-control`,
      type: "website",
    },
  };
}

export default async function VersionControlPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UseCasePage useCase="version-control" />;
}
