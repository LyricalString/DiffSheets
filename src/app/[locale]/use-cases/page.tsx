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
  const t = await getTranslations({ locale, namespace: "useCases" });

  const title = locale === "es"
    ? "Casos de Uso - DiffSheets"
    : "Use Cases - DiffSheets";
  const description = locale === "es"
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
  };
}

const useCases = [
  {
    id: "financial-auditing",
    icon: BarChart,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "data-migration",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "version-control",
    icon: GitBranch,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "quality-assurance",
    icon: TestTube,
    color: "from-orange-500 to-red-500",
  },
] as const;

export default async function UseCasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "useCases" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {locale === "es" ? "Casos de Uso" : "Use Cases"}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {locale === "es"
                ? "Descubre cómo equipos de diferentes industrias usan DiffSheets para comparar hojas de cálculo de forma eficiente."
                : "Discover how teams across industries use DiffSheets to compare spreadsheets efficiently."}
            </p>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-16">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={useCase.id}
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Icon Card */}
                  <div className="flex-shrink-0 lg:w-1/3">
                    <div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br ${useCase.color} shadow-lg lg:mx-0`}>
                      <Icon className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                      {t(`${useCase.id}.h1`)}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {t(`${useCase.id}.subtitle`)}
                    </p>

                    {/* Challenge & Solution */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t(`${useCase.id}.challenge.title`)}
                        </h3>
                        <p className="mt-2 text-sm">
                          {t(`${useCase.id}.challenge.description`)}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t(`${useCase.id}.solution.title`)}
                        </h3>
                        <p className="mt-2 text-sm">
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
        <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-bold text-3xl tracking-tight">
              {locale === "es" ? "¿Listo para empezar?" : "Ready to get started?"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {locale === "es"
                ? "Compara tus hojas de cálculo en segundos. Gratis, privado, sin registro."
                : "Compare your spreadsheets in seconds. Free, private, no sign-up required."}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={`/${locale}/compare`}>
                  {tCommon("tryNow")}
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
