import { UseCasePage } from "@/components/landing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useCases.financial-auditing" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/use-cases/financial-auditing`,
      languages: {
        en: "/en/use-cases/financial-auditing",
        es: "/es/use-cases/financial-auditing",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/use-cases/financial-auditing`,
      type: "website",
    },
  };
}

export default async function FinancialAuditingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UseCasePage useCase="financial-auditing" />;
}
