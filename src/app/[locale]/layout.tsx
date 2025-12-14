import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { type Locale, routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const isSpanish = locale === "es";

  const metadataBase = new URL(BASE_URL);

  const title = isSpanish
    ? "DiffSheets - Comparar Archivos Excel y CSV Online"
    : "DiffSheets - Compare Excel & CSV Files Online";

  const description = isSpanish
    ? "Herramienta gratuita online para comparar archivos Excel, hojas de cálculo CSV y más. 100% del lado del cliente, tus datos nunca salen de tu navegador."
    : "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.";

  const keywords = isSpanish
    ? [
        "diffsheets",
        "comparar csv",
        "comparar excel",
        "diferencias excel",
        "comparar hojas de cálculo",
        "comparar xlsx",
        "comparar dos archivos excel",
        "diferencias csv",
        "herramienta comparar hojas",
        "comparar archivos excel online",
      ]
    : [
        "diffsheets",
        "csv compare",
        "excel compare",
        "excel diff",
        "spreadsheet comparison",
        "xlsx compare",
        "compare two excel files",
        "csv file diff",
        "spreadsheet diff tool",
        "excel file comparison online",
      ];

  const ogTitle = isSpanish
    ? "DiffSheets - Comparar Archivos Excel y CSV Online"
    : "DiffSheets - Compare Excel & CSV Files Online";

  const ogDescription = isSpanish
    ? "Herramienta gratuita para comparar archivos Excel y CSV. 100% privado, tus datos nunca salen de tu navegador."
    : "Free online tool to compare Excel files and CSV spreadsheets. 100% private, your data never leaves your browser.";

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | DiffSheets`,
    },
    description,
    keywords,
    authors: [{ name: "DiffSheets" }],
    creator: "DiffSheets",
    openGraph: {
      type: "website",
      locale: isSpanish ? "es_ES" : "en_US",
      alternateLocale: isSpanish ? "en_US" : "es_ES",
      url: `${BASE_URL}/${locale}`,
      siteName: "DiffSheets",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: `/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: isSpanish
            ? "DiffSheets - Comparar Archivos Excel y CSV"
            : "DiffSheets - Compare Excel & CSV Files",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [`/og?locale=${locale}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        "x-default": `${BASE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider messages={messages}>
        <JsonLd locale={locale as Locale} />
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
