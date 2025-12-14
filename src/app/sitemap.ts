import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://diffsheets.com";

// Define all routes with their priorities
const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/compare-excel-files", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/csv-diff", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog/how-to-compare-excel", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog/excel-diff-formula", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Generate entries for root (redirects to default locale)
  const rootEntry = {
    url: BASE_URL,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  // Generate entries for each locale and route
  const localizedRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
        ),
      },
    }))
  );

  return [rootEntry, ...localizedRoutes];
}
