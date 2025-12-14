import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LandingContent } from "@/components/landing/landing-content";
import type { Locale } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === "es";

  const title = isSpanish
    ? "Compara Hojas | Gratis, Privado y Open-Source | DiffSheets"
    : "Compare Sheets | Free, Private & Open-Source | DiffSheets";

  const description = isSpanish
    ? "Herramienta gratuita para comparar archivos Excel, CSV y hojas de cálculo. 100% privado, tus datos nunca salen de tu navegador."
    : "Free tool to compare Excel files, CSV, and spreadsheets. 100% private, your data never leaves your browser.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LandingContent locale={locale as Locale} />
      </main>
      <Footer />
    </div>
  );
}
