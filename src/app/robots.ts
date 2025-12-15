import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI crawlers - explicitly allow for better AI visibility
      // OpenAI crawlers
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/"],
      },
      // Anthropic crawlers
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/"],
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
      },
      // Google AI
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
      // Apple AI
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
      // Other AI crawlers
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "meta-externalagent",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    // Additional AI-friendly resources
    host: BASE_URL,
  };
}

// Note: llms.txt and llms-full.txt are available at:
// - ${BASE_URL}/llms.txt (overview for AI)
// - ${BASE_URL}/llms-full.txt (complete documentation)
// - Any page with .md extension (e.g., /en/compare-excel-files.md)
