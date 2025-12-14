import { UseCasePage } from "@/components/landing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useCases.quality-assurance" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/use-cases/quality-assurance`,
      languages: {
        en: "/en/use-cases/quality-assurance",
        es: "/es/use-cases/quality-assurance",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/use-cases/quality-assurance`,
      type: "website",
    },
  };
}

export default async function QualityAssurancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UseCasePage useCase="quality-assurance" />;
}
