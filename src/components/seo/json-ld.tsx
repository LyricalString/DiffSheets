import type { Locale } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

interface JsonLdProps {
  locale?: Locale;
}

const content = {
  en: {
    name: "DiffSheets",
    description:
      "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
    tagline: "Compare spreadsheets instantly",
    features: [
      "Compare Excel files (xlsx, xls)",
      "Compare CSV files",
      "Compare ODS files",
      "100% client-side processing",
      "No data upload to servers",
      "Side-by-side diff view",
      "Support for large files",
    ],
    faq: [
      {
        question: "Is DiffSheets free to use?",
        answer:
          "Yes, DiffSheets is completely free to use. There are no hidden fees, subscriptions, or premium features locked behind a paywall.",
      },
      {
        question: "Is my data safe when using DiffSheets?",
        answer:
          "Absolutely. DiffSheets processes all files 100% client-side in your browser. Your spreadsheet data never leaves your computer or gets uploaded to any server.",
      },
      {
        question: "What file formats does DiffSheets support?",
        answer:
          "DiffSheets supports Excel files (.xlsx, .xls), CSV files, and OpenDocument Spreadsheets (.ods). You can compare files of the same or different formats.",
      },
      {
        question: "Can I compare large Excel files?",
        answer:
          "Yes, DiffSheets uses virtual scrolling technology to efficiently handle large spreadsheets with thousands of rows without performance issues.",
      },
      {
        question: "How does DiffSheets compare spreadsheets?",
        answer:
          "DiffSheets offers multiple comparison modes: position-based matching (row by row), key column matching (by a unique identifier), and intelligent LCS algorithm for best alignment detection.",
      },
    ],
    howTo: {
      name: "How to Compare Two Excel Files",
      description:
        "Learn how to compare two Excel or CSV files using DiffSheets in just a few steps.",
      steps: [
        {
          name: "Upload the first file",
          text: "Drag and drop or click to upload your first Excel or CSV file to the left panel.",
        },
        {
          name: "Upload the second file",
          text: "Upload your second file to the right panel for comparison.",
        },
        {
          name: "Configure comparison options",
          text: "Select the sheets to compare and choose your preferred row matching strategy (position, key column, or auto-detect).",
        },
        {
          name: "View the differences",
          text: "Click Compare to see all differences highlighted. Use the navigation to jump between changes.",
        },
      ],
    },
  },
  es: {
    name: "DiffSheets",
    description:
      "Herramienta gratuita online para comparar archivos Excel, hojas de cálculo CSV y más. 100% del lado del cliente, tus datos nunca salen de tu navegador.",
    tagline: "Compara hojas de cálculo al instante",
    features: [
      "Comparar archivos Excel (xlsx, xls)",
      "Comparar archivos CSV",
      "Comparar archivos ODS",
      "Procesamiento 100% en el cliente",
      "Sin subida de datos a servidores",
      "Vista de diferencias lado a lado",
      "Soporte para archivos grandes",
    ],
    faq: [
      {
        question: "¿Es DiffSheets gratis?",
        answer:
          "Sí, DiffSheets es completamente gratuito. No hay tarifas ocultas, suscripciones ni funciones premium bloqueadas.",
      },
      {
        question: "¿Están seguros mis datos al usar DiffSheets?",
        answer:
          "Absolutamente. DiffSheets procesa todos los archivos 100% en tu navegador. Tus datos nunca salen de tu ordenador ni se suben a ningún servidor.",
      },
      {
        question: "¿Qué formatos de archivo soporta DiffSheets?",
        answer:
          "DiffSheets soporta archivos Excel (.xlsx, .xls), archivos CSV y hojas de cálculo OpenDocument (.ods). Puedes comparar archivos del mismo o diferente formato.",
      },
      {
        question: "¿Puedo comparar archivos Excel grandes?",
        answer:
          "Sí, DiffSheets usa tecnología de scroll virtual para manejar eficientemente hojas de cálculo grandes con miles de filas sin problemas de rendimiento.",
      },
      {
        question: "¿Cómo compara DiffSheets las hojas de cálculo?",
        answer:
          "DiffSheets ofrece múltiples modos de comparación: coincidencia por posición (fila por fila), coincidencia por columna clave (por identificador único), y algoritmo LCS inteligente para mejor detección de alineación.",
      },
    ],
    howTo: {
      name: "Cómo Comparar Dos Archivos Excel",
      description:
        "Aprende a comparar dos archivos Excel o CSV usando DiffSheets en solo unos pasos.",
      steps: [
        {
          name: "Sube el primer archivo",
          text: "Arrastra y suelta o haz clic para subir tu primer archivo Excel o CSV al panel izquierdo.",
        },
        {
          name: "Sube el segundo archivo",
          text: "Sube tu segundo archivo al panel derecho para comparar.",
        },
        {
          name: "Configura las opciones de comparación",
          text: "Selecciona las hojas a comparar y elige tu estrategia de coincidencia de filas preferida (posición, columna clave, o auto-detectar).",
        },
        {
          name: "Ver las diferencias",
          text: "Haz clic en Comparar para ver todas las diferencias resaltadas. Usa la navegación para saltar entre cambios.",
        },
      ],
    },
  },
};

export function JsonLd({ locale = "en" }: JsonLdProps) {
  const t = content[locale];
  const url = `${BASE_URL}/${locale}`;

  // WebApplication schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.name,
    description: t.description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: t.features,
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    inLanguage: locale === "es" ? "es-ES" : "en-US",
  };

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DiffSheets",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    sameAs: ["https://github.com/LyricalString/diffsheets"],
  };

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // HowTo schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.howTo.name,
    description: t.howTo.description,
    step: t.howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    tool: {
      "@type": "HowToTool",
      name: "Web browser",
    },
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
