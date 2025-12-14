import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Footer, Header } from "@/components/layout";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const validSlugs = ["how-to-compare-excel", "excel-diff-formula"];

export async function generateStaticParams() {
  return validSlugs.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "es", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!validSlugs.includes(slug)) {
    return { title: "Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "blog.posts" });

  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.excerpt`),
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        es: `/es/blog/${slug}`,
      },
    },
  };
}

// Blog post content - in a real app, this would come from a CMS or MDX files
const blogContent = {
  "how-to-compare-excel": {
    en: {
      sections: [
        {
          heading: "Introduction",
          content: `Comparing two Excel files is a common task for accountants, analysts, and anyone working with spreadsheets. Whether you're tracking budget changes, auditing financial reports, or verifying data migrations, finding the differences between two Excel files quickly and accurately is essential.

In this guide, we'll explore 5 different methods to compare Excel files, from built-in Excel features to dedicated tools like DiffSheets.`,
        },
        {
          heading: "Method 1: Manual Side-by-Side Comparison",
          content: `The simplest method is opening both files and comparing them visually. While this works for small spreadsheets, it's error-prone and time-consuming for larger files.

**Pros:**
- No additional tools needed
- Works with any Excel version

**Cons:**
- Extremely slow for large files
- Easy to miss differences
- No way to track changes systematically`,
        },
        {
          heading: "Method 2: Excel's Built-in Compare Feature",
          content: `If you have Microsoft 365 or Excel 2013+, you can use the Inquire add-in to compare workbooks.

1. Go to File > Options > Add-Ins
2. Enable the Inquire add-in
3. Go to Inquire > Compare Files
4. Select your two workbooks

**Pros:**
- Built into Excel
- Comprehensive comparison

**Cons:**
- Only available in certain Excel versions
- Can be slow with large files
- Requires Excel installation`,
        },
        {
          heading: "Method 3: Using VLOOKUP or INDEX/MATCH",
          content: `You can use Excel formulas to find differences between two sheets:

\`=IF(VLOOKUP(A2,Sheet2!A:B,2,FALSE)=B2,"Match","Different")\`

This approach lets you identify rows that exist in one sheet but not the other, or where values differ.

**Pros:**
- No additional tools needed
- Flexible and customizable

**Cons:**
- Requires Excel knowledge
- Complex setup for multiple columns
- Doesn't highlight individual cell changes`,
        },
        {
          heading: "Method 4: Using DiffSheets (Recommended)",
          content: `DiffSheets is a free online tool specifically designed for comparing spreadsheets. Simply drag and drop your two Excel files, and instantly see all differences highlighted.

**How to use DiffSheets:**
1. Go to diffsheets.com
2. Upload your original file on the left
3. Upload your modified file on the right
4. Click "Find Difference"

**Pros:**
- Visual side-by-side comparison
- Works with XLSX, XLS, CSV, and ODS
- 100% private - files never leave your browser
- Handles large files efficiently
- Free and no registration required

**Cons:**
- Requires internet access (but no data is uploaded)`,
        },
        {
          heading: "Method 5: Command Line Tools (For Developers)",
          content: `Developers might prefer command-line tools like \`csvdiff\` or writing custom Python scripts using pandas:

\`\`\`python
import pandas as pd

df1 = pd.read_excel('file1.xlsx')
df2 = pd.read_excel('file2.xlsx')
diff = df1.compare(df2)
\`\`\`

**Pros:**
- Automatable
- Can be integrated into CI/CD pipelines

**Cons:**
- Requires programming knowledge
- Setup overhead`,
        },
        {
          heading: "Conclusion",
          content: `For most users, DiffSheets offers the best balance of simplicity, features, and privacy. It's free, requires no installation, and keeps your data completely private.

Try DiffSheets now and compare your Excel files in seconds.`,
        },
      ],
    },
    es: {
      sections: [
        {
          heading: "Introducción",
          content: `Comparar dos archivos Excel es una tarea común para contables, analistas y cualquier persona que trabaje con hojas de cálculo. Ya sea para rastrear cambios en presupuestos, auditar informes financieros o verificar migraciones de datos, encontrar las diferencias entre dos archivos Excel de forma rápida y precisa es esencial.

En esta guía, exploraremos 5 métodos diferentes para comparar archivos Excel, desde las funciones integradas de Excel hasta herramientas dedicadas como DiffSheets.`,
        },
        {
          heading: "Método 1: Comparación Manual Lado a Lado",
          content: `El método más simple es abrir ambos archivos y compararlos visualmente. Aunque funciona para hojas pequeñas, es propenso a errores y consume mucho tiempo para archivos grandes.

**Pros:**
- No se necesitan herramientas adicionales
- Funciona con cualquier versión de Excel

**Contras:**
- Extremadamente lento para archivos grandes
- Fácil pasar por alto diferencias
- Sin forma de rastrear cambios sistemáticamente`,
        },
        {
          heading: "Método 2: Función de Comparar Integrada en Excel",
          content: `Si tienes Microsoft 365 o Excel 2013+, puedes usar el complemento Inquire para comparar libros.

1. Ve a Archivo > Opciones > Complementos
2. Habilita el complemento Inquire
3. Ve a Inquire > Comparar Archivos
4. Selecciona tus dos libros

**Pros:**
- Integrado en Excel
- Comparación completa

**Contras:**
- Solo disponible en ciertas versiones de Excel
- Puede ser lento con archivos grandes
- Requiere instalación de Excel`,
        },
        {
          heading: "Método 3: Usando BUSCARV o INDICE/COINCIDIR",
          content: `Puedes usar fórmulas de Excel para encontrar diferencias entre dos hojas:

\`=SI(BUSCARV(A2,Hoja2!A:B,2,FALSO)=B2,"Coincide","Diferente")\`

Este enfoque te permite identificar filas que existen en una hoja pero no en la otra, o donde los valores difieren.

**Pros:**
- No se necesitan herramientas adicionales
- Flexible y personalizable

**Contras:**
- Requiere conocimiento de Excel
- Configuración compleja para múltiples columnas
- No resalta cambios individuales en celdas`,
        },
        {
          heading: "Método 4: Usando DiffSheets (Recomendado)",
          content: `DiffSheets es una herramienta gratuita online diseñada específicamente para comparar hojas de cálculo. Simplemente arrastra y suelta tus dos archivos Excel, y verás todas las diferencias resaltadas al instante.

**Cómo usar DiffSheets:**
1. Ve a diffsheets.com
2. Sube tu archivo original a la izquierda
3. Sube tu archivo modificado a la derecha
4. Haz clic en "Encontrar Diferencias"

**Pros:**
- Comparación visual lado a lado
- Funciona con XLSX, XLS, CSV y ODS
- 100% privado - los archivos nunca salen de tu navegador
- Maneja archivos grandes eficientemente
- Gratis y sin registro necesario

**Contras:**
- Requiere acceso a internet (pero no se suben datos)`,
        },
        {
          heading: "Método 5: Herramientas de Línea de Comandos (Para Desarrolladores)",
          content: `Los desarrolladores pueden preferir herramientas de línea de comandos como \`csvdiff\` o escribir scripts personalizados en Python usando pandas:

\`\`\`python
import pandas as pd

df1 = pd.read_excel('archivo1.xlsx')
df2 = pd.read_excel('archivo2.xlsx')
diff = df1.compare(df2)
\`\`\`

**Pros:**
- Automatizable
- Se puede integrar en pipelines CI/CD

**Contras:**
- Requiere conocimientos de programación
- Overhead de configuración`,
        },
        {
          heading: "Conclusión",
          content: `Para la mayoría de usuarios, DiffSheets ofrece el mejor equilibrio entre simplicidad, funciones y privacidad. Es gratis, no requiere instalación y mantiene tus datos completamente privados.

Prueba DiffSheets ahora y compara tus archivos Excel en segundos.`,
        },
      ],
    },
  },
  "excel-diff-formula": {
    en: {
      sections: [
        {
          heading: "Introduction",
          content: `When you need to compare data in Excel, you have two main options: use formulas like VLOOKUP, or use a dedicated diff tool. Each approach has its strengths and weaknesses. Let's break down when to use each.`,
        },
        {
          heading: "Using Excel VLOOKUP for Comparison",
          content: `VLOOKUP is Excel's classic lookup function. You can use it to find values from one sheet in another:

\`=VLOOKUP(A2, Sheet2!A:B, 2, FALSE)\`

**When VLOOKUP works well:**
- Small datasets (under 1,000 rows)
- Comparing a single key column
- You need the results in Excel for further analysis
- One-time comparisons

**When VLOOKUP struggles:**
- Large datasets (performance issues)
- Multiple columns to compare
- Detecting modified vs added vs deleted rows
- Non-technical users who find formulas confusing`,
        },
        {
          heading: "Using Dedicated Diff Tools",
          content: `Tools like DiffSheets are purpose-built for spreadsheet comparison. They handle all the complexity for you.

**When diff tools excel:**
- Any size dataset
- Visual, color-coded output
- No formula knowledge required
- Comparing entire spreadsheets, not just specific columns
- When privacy is critical (client-side processing)

**Minor limitations:**
- Requires internet access (for web-based tools)
- Can't be embedded in existing Excel workflows`,
        },
        {
          heading: "Recommendation",
          content: `**Use VLOOKUP when:**
- You're already working in Excel
- You need to compare specific columns only
- The comparison is part of a larger Excel-based workflow

**Use DiffSheets when:**
- You want to see ALL differences at a glance
- Your files are large
- You don't want to write formulas
- Privacy is important (your data stays local)
- You need to compare different file formats (XLSX vs CSV)

For most comparison tasks, DiffSheets is the faster and more intuitive option.`,
        },
      ],
    },
    es: {
      sections: [
        {
          heading: "Introducción",
          content: `Cuando necesitas comparar datos en Excel, tienes dos opciones principales: usar fórmulas como BUSCARV, o usar una herramienta de diff dedicada. Cada enfoque tiene sus fortalezas y debilidades. Veamos cuándo usar cada uno.`,
        },
        {
          heading: "Usando BUSCARV de Excel para Comparación",
          content: `BUSCARV es la función clásica de búsqueda de Excel. Puedes usarla para encontrar valores de una hoja en otra:

\`=BUSCARV(A2, Hoja2!A:B, 2, FALSO)\`

**Cuándo BUSCARV funciona bien:**
- Conjuntos de datos pequeños (menos de 1,000 filas)
- Comparar una sola columna clave
- Necesitas los resultados en Excel para análisis adicional
- Comparaciones puntuales

**Cuándo BUSCARV tiene problemas:**
- Conjuntos de datos grandes (problemas de rendimiento)
- Múltiples columnas para comparar
- Detectar filas modificadas vs añadidas vs eliminadas
- Usuarios no técnicos que encuentran las fórmulas confusas`,
        },
        {
          heading: "Usando Herramientas Diff Dedicadas",
          content: `Herramientas como DiffSheets están diseñadas específicamente para comparación de hojas de cálculo. Manejan toda la complejidad por ti.

**Cuándo las herramientas diff destacan:**
- Cualquier tamaño de conjunto de datos
- Salida visual con códigos de color
- No requiere conocimiento de fórmulas
- Comparar hojas completas, no solo columnas específicas
- Cuando la privacidad es crítica (procesamiento del lado del cliente)

**Limitaciones menores:**
- Requiere acceso a internet (para herramientas web)
- No se puede integrar en flujos de trabajo existentes de Excel`,
        },
        {
          heading: "Recomendación",
          content: `**Usa BUSCARV cuando:**
- Ya estás trabajando en Excel
- Solo necesitas comparar columnas específicas
- La comparación es parte de un flujo de trabajo más grande basado en Excel

**Usa DiffSheets cuando:**
- Quieres ver TODAS las diferencias de un vistazo
- Tus archivos son grandes
- No quieres escribir fórmulas
- La privacidad es importante (tus datos permanecen locales)
- Necesitas comparar diferentes formatos de archivo (XLSX vs CSV)

Para la mayoría de tareas de comparación, DiffSheets es la opción más rápida e intuitiva.`,
        },
      ],
    },
  },
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const content = blogContent[slug as keyof typeof blogContent][locale as "en" | "es"];
  const postMeta = {
    title: t(`posts.${slug}.title`),
    excerpt: t(`posts.${slug}.excerpt`),
    date: t(`posts.${slug}.date`),
    readTime: t(`posts.${slug}.readTime`),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          {/* Back Link */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" />
                {tCommon("allPosts")}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{postMeta.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{postMeta.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {postMeta.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {postMeta.readTime}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content.sections.map((section, index) => (
              <section key={index} className="mb-8">
                <h2 className="font-semibold text-2xl">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 text-center">
            <h3 className="font-semibold text-xl">{tCommon("tryNow")}</h3>
            <p className="mt-2 text-muted-foreground">
              {locale === "es"
                ? "Compara tus archivos Excel o CSV en segundos"
                : "Compare your Excel or CSV files in seconds"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/">DiffSheets</Link>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
