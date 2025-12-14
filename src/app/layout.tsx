import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://diffsheets.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "DiffSheets - Compare Excel & CSV Files Online",
    template: "%s | DiffSheets",
  },
  description:
    "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
  keywords: [
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
  ],
  authors: [{ name: "DiffSheets" }],
  creator: "DiffSheets",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    url: BASE_URL,
    siteName: "DiffSheets",
    title: "DiffSheets - Compare Excel & CSV Files Online",
    description:
      "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiffSheets - Compare Excel & CSV Files",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiffSheets - Compare Excel & CSV Files Online",
    description:
      "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
    images: ["/og-image.png"],
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
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
