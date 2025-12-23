import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultLocale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

/**
 * Get the URL for a specific locale and path.
 * Default locale (en) has no prefix, other locales have prefix.
 *
 * @example
 * getLocalizedUrl("en", "/compare") // "https://www.diffsheets.com/compare"
 * getLocalizedUrl("es", "/compare") // "https://www.diffsheets.com/es/compare"
 * getLocalizedUrl("en") // "https://www.diffsheets.com"
 * getLocalizedUrl("es") // "https://www.diffsheets.com/es"
 */
export function getLocalizedUrl(locale: string, path = ""): string {
  if (locale === defaultLocale) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${locale}${path}`;
}

/**
 * Get alternates object for metadata with proper SEO structure.
 * Uses x-default pointing to default locale URL.
 */
export function getAlternates(locale: string, path = "") {
  return {
    canonical: getLocalizedUrl(locale, path),
    languages: {
      en: getLocalizedUrl("en", path),
      es: getLocalizedUrl("es", path),
      "x-default": getLocalizedUrl(defaultLocale, path),
    },
  };
}
