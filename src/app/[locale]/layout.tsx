import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultLocale, type Locale, routing } from "@/i18n/routing";
import { BASE_URL, getLocalizedUrl } from "@/lib/utils";

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
    ? "Compara Hojas | Gratis, Privado y Open-Source | DiffSheets"
    : "Compare Sheets | Free, Private & Open-Source | DiffSheets";

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
    ? "Compara Hojas | Gratis, Privado y Open-Source | DiffSheets"
    : "Compare Sheets | Free, Private & Open-Source | DiffSheets";

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
      url: getLocalizedUrl(locale),
      siteName: "DiffSheets",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
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
      images: [`${BASE_URL}/og-image.png`],
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
      canonical: getLocalizedUrl(locale),
      languages: {
        en: getLocalizedUrl("en"),
        es: getLocalizedUrl("es"),
        "x-default": getLocalizedUrl(defaultLocale),
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
