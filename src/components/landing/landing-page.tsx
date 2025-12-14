"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle, Shield, Zap, FileSpreadsheet, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Footer, Header } from "@/components/layout";

type LandingType = "excel" | "csv" | "xlsx" | "xls" | "ods";

interface LandingPageProps {
  type: LandingType;
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
};

export function LandingPage({ type }: LandingPageProps) {
  const t = useTranslations(`landing.${type}`);

  const benefitKeys = type === "excel"
    ? ["visual", "privacy", "formats", "free"] as const
    : type === "csv"
    ? ["instant", "large", "delimiters", "export"] as const
    : type === "xlsx"
    ? ["visual", "privacy", "formats", "free"] as const
    : type === "xls"
    ? ["legacy", "compatibility", "privacy", "results"] as const
    : ["opensource", "formats", "privacy", "crossplatform"] as const; // ods

  const useCaseKeys = type === "excel"
    ? ["audit", "version", "migration", "qa"] as const
    : type === "csv"
    ? ["database", "api", "logs", "etl"] as const
    : type === "xlsx"
    ? ["audit", "version", "migration", "qa"] as const
    : type === "xls"
    ? ["legacyMigration", "historicalComparison", "complianceAuditing", "archiveVerification"] as const
    : ["opensourceWorkflows", "governmentCompliance", "crossplatformTeams", "conversionVerification"] as const; // ods

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {t("h1")}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/">
                  {t("cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {t("benefits.title")}
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {benefitKeys.map((key) => {
                const Icon = icons[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-lg">
                      {t(`benefits.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {t(`benefits.items.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {t("useCases.title")}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {useCaseKeys.map((key) => {
                const Icon = useCaseIcons[key];
                return (
                  <div
                    key={key}
                    className="flex gap-4 rounded-xl border bg-card p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {t(`useCases.items.${key}.title`)}
                      </h3>
                      <p className="mt-1 text-muted-foreground text-sm">
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
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-bold text-3xl tracking-tight">
              {t("cta")}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/">
                  {t("cta")}
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
