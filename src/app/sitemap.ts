import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://diffsheets.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Generate entries for each locale
  const localizedRoutes = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          es: `${BASE_URL}/es`,
        },
      },
    },
  ]);

  return [
    // Root redirect (will redirect to default locale)
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    // Localized routes
    ...localizedRoutes,
  ];
}
