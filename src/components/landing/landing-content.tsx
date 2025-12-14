import {
  ArrowRight,
  Code,
  FileSpreadsheet,
  Github,
  Lock,
  MonitorSmartphone,
  Search,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LogoIcon } from "@/components/brand";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

export async function LandingContent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const tUpload = await getTranslations({ locale, namespace: "upload" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const features = [
    {
      icon: Lock,
      title: t("features.offline.title"),
      description: t("features.offline.description"),
    },
    {
      icon: Zap,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
    },
    {
      icon: FileSpreadsheet,
      title: t("features.formats.title"),
      description: t("features.formats.description"),
    },
    {
      icon: Search,
      title: t("features.smart.title"),
      description: t("features.smart.description"),
    },
    {
      icon: Code,
      title: t("features.opensource.title"),
      description: t("features.opensource.description"),
    },
    {
      icon: MonitorSmartphone,
      title: t("features.works.title"),
      description: t("features.works.description"),
    },
  ];

  const faqItems = [
    { key: "free" },
    { key: "safe" },
    { key: "formats" },
    { key: "large" },
    { key: "how" },
  ] as const;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background glow effect */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
          style={{
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-[850px] text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 rounded-full bg-green-500/10 border border-green-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-300">
              {locale === "es"
                ? "100% Offline • Tus datos nunca salen de tu navegador"
                : "100% Offline • Your data never leaves your browser"}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
            {locale === "es" ? (
              <>
                Compara hojas de cálculo.
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  Ve qué cambió.
                </span>
              </>
            ) : (
              <>
                Compare spreadsheets.
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  See what changed.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-[580px] mx-auto mb-12">
            {tUpload("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
            >
              <Link href={`/${locale}/compare`}>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                {tCommon("tryNow")}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-border hover:bg-accent"
              asChild
            >
              <a
                href="https://github.com/LyricalString/diffsheets"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Demo window */}
        <div className="relative z-10 w-full max-w-[960px] mx-auto">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Window header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 font-mono text-xs text-slate-400">
                budget_2024.xlsx vs budget_2024_v2.xlsx
              </span>
            </div>

            {/* Demo content - Side by side panels */}
            <div className="grid md:grid-cols-2 divide-x divide-slate-700">
              {/* Original panel */}
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-4">
                  {locale === "es" ? "Original" : "Original"}
                </div>
                <div className="space-y-px">
                  <DemoRow header cells={["#", "Department", "Budget"]} />
                  <DemoRow cells={["1", "Marketing"]} changedCell="$50,000" />
                  <DemoRow cells={["2", "Engineering", "$120,000"]} />
                  <DemoRow cells={["3"]} removedCells={["Sales", "$80,000"]} />
                </div>
              </div>

              {/* Modified panel */}
              <div className="p-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-4">
                  {locale === "es" ? "Modificado" : "Modified"}
                </div>
                <div className="space-y-px">
                  <DemoRow header cells={["#", "Department", "Budget"]} />
                  <DemoRow cells={["1", "Marketing"]} changedCell="$65,000" />
                  <DemoRow cells={["2", "Engineering", "$120,000"]} />
                  <DemoRow cells={["3"]} addedCells={["Operations", "$45,000"]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-widest mb-4 block">
              {locale === "es" ? "Características" : "Features"}
            </span>
            <h2 id="features-heading" className="font-display font-bold text-3xl md:text-4xl">
              {t("h2Features")}
            </h2>
          </div>

          {/* Feature grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                  <feature.icon className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4" aria-labelledby="how-it-works-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-widest mb-4 block">
              {locale === "es" ? "Cómo funciona" : "How it works"}
            </span>
            <h2 id="how-it-works-heading" className="font-display font-bold text-3xl md:text-4xl">
              {t("h2HowItWorks")}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-8">
            {/* Step 1 */}
            <StepCard
              number={1}
              title={t("steps.step1")}
              description={t("steps.step1Sub")}
              icon={
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              }
            />

            {/* Connector */}
            <div className="hidden md:flex items-center pt-10">
              <div className="w-12 h-0.5 bg-gradient-to-r from-slate-700 to-green-500/50" />
              <ArrowRight className="w-4 h-4 text-green-500" />
            </div>

            {/* Step 2 */}
            <StepCard
              number={2}
              title={t("steps.step2")}
              description={t("steps.step2Sub")}
              icon={
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              }
            />

            {/* Connector */}
            <div className="hidden md:flex items-center pt-10">
              <div className="w-12 h-0.5 bg-gradient-to-r from-slate-700 to-green-500/50" />
              <ArrowRight className="w-4 h-4 text-green-500" />
            </div>

            {/* Step 3 */}
            <StepCard
              number={3}
              title={t("steps.step3")}
              description={t("steps.step3Sub")}
              icon={<LogoIcon size={24} />}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-display text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-widest mb-4 block">
              FAQ
            </span>
            <h2 id="faq-heading" className="font-display font-bold text-3xl md:text-4xl">
              {tFaq("title")}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map(({ key }) => (
              <details
                key={key}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-display font-medium text-lg hover:bg-accent/50 transition-colors">
                  {tFaq(`items.${key}.question`)}
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
                  {tFaq(`items.${key}.answer`)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            {locale === "es" ? "¿Listo para comparar?" : "Ready to compare?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {locale === "es"
              ? "Sube tus archivos y encuentra las diferencias en segundos. Sin registro, sin límites."
              : "Upload your files and find differences in seconds. No signup, no limits."}
          </p>
          <Button
            asChild
            size="lg"
            className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5"
          >
            <Link href={`/${locale}/compare`}>
              {tCommon("tryNow")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Demo row component for the preview window
function DemoRow({
  cells = [],
  header = false,
  changedCell,
  addedCells,
  removedCells,
}: {
  cells?: string[];
  header?: boolean;
  changedCell?: string;
  addedCells?: string[];
  removedCells?: string[];
}) {
  const baseCell = header
    ? "bg-slate-700 text-slate-200 font-medium"
    : "bg-slate-800 text-slate-300";

  return (
    <div className="grid grid-cols-[60px_1fr_90px] gap-px font-mono text-sm">
      {cells.map((cell, i) => (
        <div key={i} className={`px-3 py-2.5 ${baseCell}`}>
          {cell}
        </div>
      ))}
      {changedCell && (
        <div className="px-3 py-2.5 bg-amber-500/15 text-amber-400 border-l-2 border-amber-500">
          {changedCell}
        </div>
      )}
      {addedCells?.map((cell, i) => (
        <div
          key={i}
          className="px-3 py-2.5 bg-green-500/15 text-green-400 border-l-2 border-green-500"
        >
          {cell}
        </div>
      ))}
      {removedCells?.map((cell, i) => (
        <div key={i} className="px-3 py-2.5 bg-red-500/15 text-red-400 border-l-2 border-red-500">
          {cell}
        </div>
      ))}
    </div>
  );
}

// Step card component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div className="relative mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
          {icon}
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 font-display font-bold text-sm text-slate-950">
          {number}
        </div>
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
