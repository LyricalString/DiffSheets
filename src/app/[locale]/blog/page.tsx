import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer, Header } from "@/components/layout";
import { Link } from "@/i18n/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        en: `${BASE_URL}/en/blog`,
        es: `${BASE_URL}/es/blog`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `${BASE_URL}/${locale}/blog`,
      type: "website",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

const blogPosts = [
  {
    slug: "how-to-compare-excel",
    image: "/og-image.png",
  },
  {
    slug: "excel-diff-formula",
    image: "/og-image.png",
  },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const isSpanish = locale === "es";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
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
              <span className="text-sm font-medium text-green-400">
                {isSpanish ? "Guías y Tutoriales" : "Guides & Tutorials"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-slate-700 hover:-translate-y-1"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video bg-gradient-to-br from-green-500/10 to-green-500/5 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="font-display font-semibold text-xl transition-colors group-hover:text-green-500">
                        {t(`posts.${post.slug}.title`)}
                      </h2>
                      <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">
                        {t(`posts.${post.slug}.excerpt`)}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-muted-foreground text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {t(`posts.${post.slug}.date`)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {t(`posts.${post.slug}.readTime`)}
                        </span>
                      </div>
                      <div className="mt-5 flex items-center gap-1.5 font-semibold text-green-500 text-sm">
                        {isSpanish ? "Leer más" : "Read more"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
