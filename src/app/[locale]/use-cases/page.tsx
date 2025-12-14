import type { Metadata } from "next";
import { ArrowRight, BarChart, Database, GitBranch, TestTube } from "lucide-react";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Footer, Header } from "@/components/layout";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "es" ? "Casos de Uso - DiffSheets" : "Use Cases - DiffSheets";
  const description =
    locale === "es"
      ? "Descubre cómo DiffSheets ayuda en auditoría financiera, migración de datos, control de versiones y testing QA."
      : "Discover how DiffSheets helps with financial auditing, data migration, version control, and QA testing.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/use-cases`,
      languages: {
        en: `${BASE_URL}/en/use-cases`,
        es: `${BASE_URL}/es/use-cases`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/use-cases`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

const useCases = [
  {
    id: "financial-auditing",
    icon: BarChart,
  },
  {
    id: "data-migration",
    icon: Database,
  },
  {
    id: "version-control",
    icon: GitBranch,
  },
  {
    id: "quality-assurance",
    icon: TestTube,
  },
] as const;

export default async function UseCasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "useCases" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const isSpanish = locale === "es";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
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
                {isSpanish ? "Soluciones para Equipos" : "Solutions for Teams"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                {isSpanish ? "Casos de Uso" : "Use Cases"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {isSpanish
                ? "Descubre cómo equipos de diferentes industrias usan DiffSheets para comparar hojas de cálculo de forma eficiente."
                : "Discover how teams across industries use DiffSheets to compare spreadsheets efficiently."}
            </p>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-24 px-4">
          <div className="mx-auto max-w-6xl space-y-20">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={useCase.id}
                  className={`flex flex-col gap-10 lg:flex-row lg:items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Icon Card */}
                  <div className="flex-shrink-0 lg:w-1/3">
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-green-500/10 border border-green-500/20 lg:mx-0">
                      <Icon className="h-20 w-20 text-green-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                      {t(`${useCase.id}.h1`)}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t(`${useCase.id}.subtitle`)}
                    </p>

                    {/* Challenge & Solution */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-card p-6 hover:border-slate-700 transition-colors">
                        <h3 className="font-display font-semibold text-sm text-green-600 dark:text-green-500 uppercase tracking-widest mb-3">
                          {t(`${useCase.id}.challenge.title`)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(`${useCase.id}.challenge.description`)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-6 hover:border-slate-700 transition-colors">
                        <h3 className="font-display font-semibold text-sm text-green-600 dark:text-green-500 uppercase tracking-widest mb-3">
                          {t(`${useCase.id}.solution.title`)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(`${useCase.id}.solution.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              {isSpanish ? "¿Listo para empezar?" : "Ready to get started?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {isSpanish
                ? "Compara tus hojas de cálculo en segundos. Gratis, privado, sin registro."
                : "Compare your spreadsheets in seconds. Free, private, no sign-up required."}
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href={`/${locale}/compare`}>
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
