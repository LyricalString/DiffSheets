"use client";

import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type AlternativeType = "beyond-compare" | "spreadsheet-compare" | "excel-compare";

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
    competitor === "beyond-compare"
      ? (["price", "installation", "privacy", "formats"] as const)
      : competitor === "spreadsheet-compare"
        ? (["price", "installation", "privacy", "availability"] as const)
        : (["price", "setup", "privacy", "formats"] as const);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 text-muted-foreground text-sm font-medium uppercase tracking-wide">
              {tCommon("h1Prefix")}
            </div>
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {t("name")}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t("intro")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/">
                  {tCommon("tryFree")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {tCommon("comparison")}
            </h2>
            <div className="mt-12 overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-4 text-left font-semibold text-sm">
                        {tCommon("feature")}
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-sm">{t("name")}</th>
                      <th className="px-6 py-4 text-center font-semibold text-sm">
                        {tCommon("us")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureKeys.map((key, index) => (
                      <tr key={key} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                        <td className="px-6 py-4 font-medium">{t(`features.${key}.label`)}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span>{t(`features.${key}.them`)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">{t(`features.${key}.us`)}</span>
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
        <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {tCommon("whySwitch")}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{tBenefits("free.title")}</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  {tBenefits("free.description")}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{tBenefits("noInstall.title")}</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  {tBenefits("noInstall.description")}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{tBenefits("privacy.title")}</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  {tBenefits("privacy.description")}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{tBenefits("crossPlatform.title")}</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  {tBenefits("crossPlatform.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">{tFaq("title")}</h2>
            <div className="mt-12 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-lg">{tFaq("free.question")}</h3>
                <p className="mt-2 text-muted-foreground">{tFaq("free.answer")}</p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-lg">
                  {tFaq("migration.question", { competitor: t("name") })}
                </h3>
                <p className="mt-2 text-muted-foreground">{tFaq("migration.answer")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-bold text-3xl tracking-tight">{tCommon("tryFree")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{tCommon("ctaSubtitle")}</p>
            <div className="mt-8">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/">
                  {tCommon("tryFree")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
