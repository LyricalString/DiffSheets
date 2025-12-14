"use client";

import {
  ArrowRight,
  BarChart,
  Bug,
  CheckCircle,
  Database,
  FileSpreadsheet,
  GitBranch,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type UseCaseType =
  | "financial-auditing"
  | "data-migration"
  | "version-control"
  | "quality-assurance";

interface UseCasePageProps {
  useCase: UseCaseType;
}

const featureIcons = {
  accuracy: CheckCircle,
  privacy: Lock,
  speed: Zap,
  export: FileSpreadsheet,
  large: Database,
  formats: FileSpreadsheet,
  key: Shield,
  integrity: CheckCircle,
  visual: BarChart,
  history: GitBranch,
  collaborate: FileSpreadsheet,
  offline: Lock,
  precision: CheckCircle,
  bulk: Database,
  reports: FileSpreadsheet,
  automation: Zap,
};

const scenarioIcons = {
  budget: BarChart,
  expense: FileSpreadsheet,
  reconciliation: CheckCircle,
  database: Database,
  crm: FileSpreadsheet,
  erp: FileSpreadsheet,
  review: FileSpreadsheet,
  approval: CheckCircle,
  backup: Shield,
  regression: Bug,
  etl: Database,
  api: Zap,
};

export function UseCasePage({ useCase }: UseCasePageProps) {
  const t = useTranslations(`useCases.${useCase}`);
  const tCommon = useTranslations("useCases.common");

  // Define feature keys for each use case
  const featureKeys = {
    "financial-auditing": ["accuracy", "privacy", "speed", "export"] as const,
    "data-migration": ["large", "formats", "key", "integrity"] as const,
    "version-control": ["visual", "history", "collaborate", "offline"] as const,
    "quality-assurance": ["precision", "bulk", "reports", "automation"] as const,
  };

  // Define scenario keys for each use case
  const scenarioKeys = {
    "financial-auditing": ["budget", "expense", "reconciliation"] as const,
    "data-migration": ["database", "crm", "erp"] as const,
    "version-control": ["review", "approval", "backup"] as const,
    "quality-assurance": ["regression", "etl", "api"] as const,
  };

  const currentFeatures = featureKeys[useCase];
  const currentScenarios = scenarioKeys[useCase];

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
                <Link href="/compare">
                  {t("cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <h2 className="font-bold text-3xl tracking-tight">{t("challenge.title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("challenge.description")}</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <h2 className="font-bold text-3xl tracking-tight">{t("solution.title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("solution.description")}</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {tCommon("keyFeatures")}
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {currentFeatures.map((key) => {
                const Icon = featureIcons[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-lg">{t(`features.${key}.title`)}</h3>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {t(`features.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Example Scenarios Section */}
        <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-bold text-3xl tracking-tight">
              {tCommon("exampleUseCases")}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentScenarios.map((key) => {
                const Icon = scenarioIcons[key];
                return (
                  <div key={key} className="rounded-xl border bg-card p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 font-semibold">{t(`scenarios.${key}.title`)}</h3>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {t(`scenarios.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-bold text-3xl tracking-tight">{tCommon("readyToStart")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/compare">
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
