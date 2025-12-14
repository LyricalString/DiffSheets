import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Footer, Header } from "@/components/layout";
import { ArrowRight, Calendar, Clock } from "lucide-react";

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
      canonical: `/${locale}/blog`,
      languages: {
        en: "/en/blog",
        es: "/es/blog",
      },
    },
  };
}

const blogPosts = [
  {
    slug: "how-to-compare-excel",
    image: "/og?locale=en",
  },
  {
    slug: "excel-diff-formula",
    image: "/og?locale=en",
  },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="text-center">
            <h1 className="font-bold text-4xl tracking-tight">{t("title")}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
          </header>

          {/* Posts Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
                  <div className="p-6">
                    <h2 className="font-semibold text-xl transition-colors group-hover:text-primary">
                      {t(`posts.${post.slug}.title`)}
                    </h2>
                    <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
                      {t(`posts.${post.slug}.excerpt`)}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {t(`posts.${post.slug}.date`)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {t(`posts.${post.slug}.readTime`)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 font-medium text-primary text-sm">
                      {t.rich("posts.${post.slug}.title", {}) ? "Read more" : "Read more"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
