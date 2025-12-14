import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

// Define all routes with their priorities
const routes = [
  // Core pages
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/compare", priority: 0.95, changeFrequency: "weekly" as const },

  // Format-specific landing pages
  { path: "/compare-excel-files", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/csv-diff", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/xls-diff", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/ods-compare", priority: 0.9, changeFrequency: "monthly" as const },

  // Pillar guide
  { path: "/guide/spreadsheet-comparison", priority: 0.85, changeFrequency: "monthly" as const },

  // Use cases (consolidated)
  { path: "/use-cases", priority: 0.8, changeFrequency: "monthly" as const },

  // Alternative comparison pages
  { path: "/alternative/spreadsheet-compare", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/alternative/excel-compare", priority: 0.8, changeFrequency: "monthly" as const },

  // Blog
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog/how-to-compare-excel", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog/excel-diff-formula", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog/free-excel-diff-tools-2025", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog/compare-excel-without-excel", priority: 0.7, changeFrequency: "monthly" as const },
  {
    path: "/blog/find-duplicates-two-excel-files",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
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
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${route.path}`])),
      },
    })),
  );

  return [rootEntry, ...localizedRoutes];
}
