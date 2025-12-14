const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://diffsheets.com";

interface JsonLdProps {
  type?: "WebApplication" | "WebPage";
  name?: string;
  description?: string;
  url?: string;
}

export function JsonLd({
  type = "WebApplication",
  name = "DiffSheets",
  description = "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
  url = BASE_URL,
}: JsonLdProps) {
  const structuredData =
    type === "WebApplication"
      ? {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name,
          description,
          url,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Compare Excel files (xlsx, xls)",
            "Compare CSV files",
            "Compare ODS files",
            "100% client-side processing",
            "No data upload to servers",
            "Side-by-side diff view",
            "Support for large files",
          ],
          browserRequirements: "Requires JavaScript. Works in modern browsers.",
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name,
          description,
          url,
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
