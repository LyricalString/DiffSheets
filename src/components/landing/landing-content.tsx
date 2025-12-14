import { CheckCircle, Code, Lock, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

export async function LandingContent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "seo.home" });
  const tUpload = await getTranslations({ locale, namespace: "upload" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });

  const features = [
    {
      icon: Lock,
      title: t("features.offline.title"),
      description: t("features.offline.description"),
    },
    {
      icon: CheckCircle,
      title: t("features.formats.title"),
      description: t("features.formats.description"),
    },
    {
      icon: Zap,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
    },
    {
      icon: Code,
      title: t("features.opensource.title"),
      description: t("features.opensource.description"),
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
    <div className="mx-auto max-w-4xl">
      {/* Hero Section - This is the LCP element */}
      <header className="py-8 text-center">
        <h1 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">{t("h1")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {tUpload("subtitle")}
        </p>
      </header>

      {/* Features Grid */}
      <section className="py-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="mb-8 text-center font-semibold text-2xl">
          {t("h2Features")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" className="mb-8 text-center font-semibold text-2xl">
          {t("h2HowItWorks")}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-3 sm:flex-col">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-sm">
                {step}
              </div>
              <p className="text-muted-foreground text-sm sm:text-center">
                {t(`steps.step${step}` as "steps.step1")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-8 text-center font-semibold text-2xl">
          {tFaq("title")}
        </h2>
        <div className="space-y-4">
          {faqItems.map(({ key }) => (
            <details key={key} className="group rounded-lg border bg-card">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
                {tFaq(`items.${key}.question`)}
                <span className="ml-2 shrink-0 transition-transform group-open:rotate-180">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
              <div className="border-t px-4 py-3 text-muted-foreground text-sm">
                {tFaq(`items.${key}.answer`)}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
