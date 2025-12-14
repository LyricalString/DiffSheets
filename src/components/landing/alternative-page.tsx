"use client";

import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type AlternativeType = "spreadsheet-compare" | "excel-compare";

interface AlternativePageProps {
  competitor: AlternativeType;
}

export function AlternativePage({ competitor }: AlternativePageProps) {
  const t = useTranslations(`alternative.${competitor}`);
  const tCommon = useTranslations("alternative");
  const tBenefits = useTranslations("alternative.benefits");
  const tFaq = useTranslations("alternative.faq");

  // Get feature keys based on competitor type
  const featureKeys =
    competitor === "spreadsheet-compare"
      ? (["price", "installation", "privacy", "availability"] as const)
      : (["price", "setup", "privacy", "formats"] as const);

  // Detect locale
  const isSpanish =
    tCommon("h1Prefix").includes("Alternativa") ||
    tCommon("h1Prefix").includes("alternativa");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
            style={{
              background:
                "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 rounded-full bg-green-500/10 border border-green-500/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-400">
                {tCommon("h1Prefix")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                {t("name")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t("intro")}
            </p>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href="/compare">
                {tCommon("tryFree")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-24 px-4" aria-labelledby="comparison-heading">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="font-display text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest mb-4 block">
                {isSpanish ? "Comparativa" : "Comparison"}
              </span>
              <h2
                id="comparison-heading"
                className="font-display font-bold text-3xl md:text-4xl"
              >
                {tCommon("comparison")}
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-5 text-left font-display font-semibold">
                        {tCommon("feature")}
                      </th>
                      <th className="px-6 py-5 text-center font-display font-semibold text-muted-foreground">
                        {t("name")}
                      </th>
                      <th className="px-6 py-5 text-center font-display font-semibold text-green-500">
                        {tCommon("us")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureKeys.map((key, index) => (
                      <tr
                        key={key}
                        className={`${index % 2 === 0 ? "bg-muted/20" : ""} border-b border-border/50 last:border-0`}
                      >
                        <td className="px-6 py-5 font-medium">
                          {t(`features.${key}.label`)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm">
                              {t(`features.${key}.them`)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-semibold text-sm">
                              {t(`features.${key}.us`)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Why Switch Section */}
        <section className="py-24 px-4" aria-labelledby="benefits-heading">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="font-display text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest mb-4 block">
                {isSpanish ? "Ventajas" : "Benefits"}
              </span>
              <h2
                id="benefits-heading"
                className="font-display font-bold text-3xl md:text-4xl"
              >
                {tCommon("whySwitch")}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {(["free", "noInstall", "privacy", "crossPlatform"] as const).map(
                (key) => (
                  <div
                    key={key}
                    className="group p-8 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                      <CheckCircle className="h-7 w-7 text-green-500" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-3">
                      {tBenefits(`${key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {tBenefits(`${key}.description`)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <span className="font-display text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest mb-4 block">
                FAQ
              </span>
              <h2
                id="faq-heading"
                className="font-display font-bold text-3xl md:text-4xl"
              >
                {tFaq("title")}
              </h2>
            </div>

            <div className="space-y-4">
              <details className="group rounded-xl border border-border bg-card overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-display font-medium text-lg hover:bg-accent/50 transition-colors">
                  {tFaq("free.question")}
                  <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-5 py-4 text-muted-foreground leading-relaxed">
                  {tFaq("free.answer")}
                </div>
              </details>

              <details className="group rounded-xl border border-border bg-card overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-display font-medium text-lg hover:bg-accent/50 transition-colors">
                  {tFaq("migration.question", { competitor: t("name") })}
                  <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-5 py-4 text-muted-foreground leading-relaxed">
                  {tFaq("migration.answer")}
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              {isSpanish ? "¿Listo para cambiar?" : "Ready to switch?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {tCommon("ctaSubtitle")}
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href="/compare">
                {tCommon("tryFree")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
