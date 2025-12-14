import { UseCasePage } from "@/components/landing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useCases.data-migration" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/use-cases/data-migration`,
      languages: {
        en: "/en/use-cases/data-migration",
        es: "/es/use-cases/data-migration",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/use-cases/data-migration`,
      type: "website",
    },
  };
}

export default async function DataMigrationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UseCasePage useCase="data-migration" />;
}
