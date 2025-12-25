"use client";

import { ArrowRight, CheckCircle, FileSpreadsheet, Lock, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type LandingType = "excel" | "csv" | "xlsx" | "xls" | "ods" | "merge";

interface LandingPageProps {
  format: LandingType;
  locale?: string;
}

const icons = {
  visual: FileSpreadsheet,
  privacy: Lock,
  formats: FileSpreadsheet,
  free: CheckCircle,
  instant: Zap,
  large: FileSpreadsheet,
  delimiters: FileSpreadsheet,
  export: FileSpreadsheet,
  legacy: FileSpreadsheet,
  compatibility: CheckCircle,
  results: Zap,
  opensource: FileSpreadsheet,
  crossplatform: FileSpreadsheet,
  multiple: FileSpreadsheet,
  modes: FileSpreadsheet,
};

const useCaseIcons = {
  audit: Shield,
  version: FileSpreadsheet,
  migration: FileSpreadsheet,
  qa: CheckCircle,
  database: FileSpreadsheet,
  api: Zap,
  logs: FileSpreadsheet,
  etl: FileSpreadsheet,
  legacyMigration: FileSpreadsheet,
  historicalComparison: FileSpreadsheet,
  complianceAuditing: Shield,
  archiveVerification: CheckCircle,
  opensourceWorkflows: FileSpreadsheet,
  governmentCompliance: Shield,
  crossplatformTeams: FileSpreadsheet,
  conversionVerification: CheckCircle,
  reports: FileSpreadsheet,
  departments: FileSpreadsheet,
  surveys: FileSpreadsheet,
  imports: FileSpreadsheet,
};

// Badge text based on type
const badgeText = {
  excel: { en: "XLSX & XLS Supported", es: "Compatible con XLSX y XLS" },
  csv: { en: "CSV & TSV Supported", es: "Compatible con CSV y TSV" },
  xlsx: { en: "XLSX & XLS Supported", es: "Compatible con XLSX y XLS" },
  xls: { en: "Legacy Excel Format", es: "Formato Excel Legado" },
  ods: { en: "LibreOffice & OpenOffice", es: "LibreOffice y OpenOffice" },
  merge: { en: "Merge Multiple Files", es: "Combinar Múltiples Archivos" },
};

export function LandingPage({ format, locale }: LandingPageProps) {
  const t = useTranslations(`landing.${format}`);
  const tCommon = useTranslations("common");

  const benefitKeys =
    format === "excel"
      ? (["visual", "privacy", "formats", "free"] as const)
      : format === "csv"
        ? (["instant", "large", "delimiters", "export"] as const)
        : format === "xlsx"
          ? (["visual", "privacy", "formats", "free"] as const)
          : format === "xls"
            ? (["legacy", "compatibility", "privacy", "results"] as const)
            : format === "merge"
              ? (["multiple", "modes", "privacy", "free"] as const)
              : (["opensource", "formats", "privacy", "crossplatform"] as const); // ods

  const useCaseKeys =
    format === "excel"
      ? (["audit", "version", "migration", "qa"] as const)
      : format === "csv"
        ? (["database", "api", "logs", "etl"] as const)
        : format === "xlsx"
          ? (["audit", "version", "migration", "qa"] as const)
          : format === "xls"
            ? ([
                "legacyMigration",
                "historicalComparison",
                "complianceAuditing",
                "archiveVerification",
              ] as const)
            : format === "merge"
              ? (["reports", "departments", "surveys", "imports"] as const)
              : ([
                  "opensourceWorkflows",
                  "governmentCompliance",
                  "crossplatformTeams",
                  "conversionVerification",
                ] as const); // ods

  // Detect locale from translation or prop
  const isSpanish = locale === "es" || t("h1").includes("Compara") || t("h1").includes("Combina");
  const badge = isSpanish ? badgeText[format].es : badgeText[format].en;

  // Determine CTA link based on format
  const ctaLink = format === "merge" ? "/merge" : "/compare";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
            style={{
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 rounded-full bg-green-500/10 border border-green-500/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-300">{badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                {t("h1")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {t("subtitle")}
            </p>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href={ctaLink}>
                {t("cta")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4" aria-labelledby="benefits-heading">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="font-display text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-widest mb-4 block">
                {isSpanish ? "Beneficios" : "Benefits"}
              </span>
              <h2 id="benefits-heading" className="font-display font-bold text-3xl md:text-4xl">
                {t("benefits.title")}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefitKeys.map((key) => {
                const Icon = icons[key];
                return (
                  <div
                    key={key}
                    className="group p-8 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                      <Icon className="h-7 w-7 text-green-500" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-3">
                      {t(`benefits.items.${key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`benefits.items.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 px-4" aria-labelledby="usecases-heading">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="font-display text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-widest mb-4 block">
                {isSpanish ? "Casos de Uso" : "Use Cases"}
              </span>
              <h2 id="usecases-heading" className="font-display font-bold text-3xl md:text-4xl">
                {t("useCases.title")}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {useCaseKeys.map((key) => {
                const Icon = useCaseIcons[key];
                return (
                  <div
                    key={key}
                    className="group flex gap-5 p-6 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                      <Icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-2">
                        {t(`useCases.items.${key}.title`)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(`useCases.items.${key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              {format === "merge"
                ? isSpanish
                  ? "¿Listo para combinar?"
                  : "Ready to merge?"
                : isSpanish
                  ? "¿Listo para comparar?"
                  : "Ready to compare?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">{t("subtitle")}</p>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href={ctaLink}>
                {tCommon("tryNow")}
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
