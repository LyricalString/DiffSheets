import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

// Content definitions for each page
const pageContent: Record<string, { en: PageContent; es: PageContent }> = {
  "": {
    en: {
      title: "DiffSheets - Compare Spreadsheets Online",
      description:
        "Free online tool to compare Excel files, CSV spreadsheets, and more. 100% client-side, your data never leaves your browser.",
      content: `
## Compare Excel Files Online

DiffSheets is a free, privacy-focused tool for comparing spreadsheets. Upload two files and see every difference highlighted instantly.

### Features

- **100% Offline**: Your data never leaves your browser. All processing happens locally.
- **Multiple Formats**: Support for Excel (xlsx, xls), CSV, and ODS files.
- **Lightning Fast**: Handle spreadsheets with thousands of rows efficiently.
- **Open Source**: Free and open source. No sign-up required.
- **Smart Detection**: Multiple comparison modes: row-by-row, key column, or intelligent LCS algorithm.
- **Works Offline**: No internet needed after first load. Use it anywhere, anytime.

### How It Works

1. Upload your original file (drag & drop or click to browse)
2. Upload the modified file
3. Compare instantly and see all changes highlighted

### Frequently Asked Questions

**Is DiffSheets free to use?**
Yes, DiffSheets is completely free to use. There are no hidden fees, subscriptions, or premium features.

**Is my data safe?**
Absolutely. DiffSheets processes all files 100% client-side in your browser. Your data never leaves your computer.

**What formats are supported?**
Excel files (.xlsx, .xls), CSV files, and OpenDocument Spreadsheets (.ods).

**Can I compare large files?**
Yes, DiffSheets uses virtual scrolling to handle large spreadsheets efficiently.
`,
    },
    es: {
      title: "DiffSheets - Compara Hojas de Cálculo Online",
      description:
        "Herramienta online gratuita para comparar archivos Excel, CSV y más. 100% del lado del cliente, tus datos nunca salen de tu navegador.",
      content: `
## Compara Archivos Excel Online

DiffSheets es una herramienta gratuita y enfocada en la privacidad para comparar hojas de cálculo. Sube dos archivos y ve cada diferencia resaltada al instante.

### Características

- **100% Sin Conexión**: Tus datos nunca salen de tu navegador. Todo el procesamiento es local.
- **Múltiples Formatos**: Soporte para Excel (xlsx, xls), CSV y archivos ODS.
- **Ultra Rápido**: Maneja hojas de cálculo con miles de filas eficientemente.
- **Código Abierto**: Gratis y de código abierto. Sin registro requerido.
- **Detección Inteligente**: Múltiples modos de comparación: fila por fila, columna clave, o algoritmo LCS.

### Cómo Funciona

1. Sube tu archivo original (arrastra y suelta o haz clic para explorar)
2. Sube el archivo modificado
3. Compara al instante y ve todos los cambios resaltados
`,
    },
  },
  compare: {
    en: {
      title: "Compare Spreadsheets - Free Online Excel & CSV Diff Tool",
      description:
        "Upload and compare Excel, CSV, and ODS files instantly. Free, private, and runs entirely in your browser.",
      content: `
## Compare Spreadsheets

Upload two spreadsheet files to see the differences. Your data stays in your browser.

### Supported Formats
- Excel (.xlsx, .xls)
- CSV (comma, semicolon, tab separated)
- ODS (LibreOffice, OpenOffice)

### Comparison Options

**Row Matching Strategies:**
- **By position**: Row 1 matches row 1, row 2 matches row 2, etc.
- **By key column**: Match rows by a unique identifier (ID, SKU, email)
- **Smart matching**: Automatically detect reordered or moved rows

### Results

Changes are color-coded:
- Green: Added rows/cells
- Red: Removed rows/cells
- Amber: Modified cells
`,
    },
    es: {
      title: "Comparar Hojas de Cálculo - Herramienta Gratuita de Diff",
      description:
        "Sube y compara archivos Excel, CSV y ODS al instante. Gratis, privado y funciona en tu navegador.",
      content: `
## Comparar Hojas de Cálculo

Sube dos archivos de hoja de cálculo para ver las diferencias. Tus datos permanecen en tu navegador.

### Formatos Soportados
- Excel (.xlsx, .xls)
- CSV (separado por comas, punto y coma, tabulador)
- ODS (LibreOffice, OpenOffice)

### Opciones de Comparación

**Estrategias de Coincidencia de Filas:**
- **Por posición**: Fila 1 coincide con fila 1, fila 2 con fila 2, etc.
- **Por columna clave**: Coincide filas por un identificador único (ID, SKU, email)
- **Coincidencia inteligente**: Detecta automáticamente filas reordenadas o movidas
`,
    },
  },
  "compare-excel-files": {
    en: {
      title: "Compare Excel Files Online - Free XLSX & XLS Diff Tool",
      description:
        "Compare two Excel files instantly. Find differences between XLSX and XLS spreadsheets with our free online tool. No upload required - 100% private.",
      content: `
## Compare Excel Files Online

Find every difference between two Excel spreadsheets in seconds. Free, private, and works entirely in your browser.

### Why Use DiffSheets for Excel Comparison?

**Visual Side-by-Side Comparison**
See changes highlighted in color. Added rows in green, deleted in red, modified in yellow.

**Complete Privacy**
Your Excel files never leave your computer. All processing happens locally in your browser.

**All Excel Formats**
Works with .xlsx, .xls, and even compare Excel to CSV files.

**100% Free**
No registration, no limits, no watermarks. Use it as much as you need.

### Common Use Cases

**Financial Auditing**
Compare budget versions, track changes in financial reports, audit expense sheets.

**Version Control**
Track changes between document versions when collaborating with teams.

**Data Migration**
Verify data integrity after importing or exporting between systems.

**Quality Assurance**
Validate test results, compare expected vs actual outputs.

[Compare Your Excel Files Now](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "Comparar Archivos Excel Online - Herramienta Gratuita XLSX y XLS",
      description:
        "Compara dos archivos Excel al instante. Encuentra diferencias entre hojas XLSX y XLS con nuestra herramienta gratuita.",
      content: `
## Compara Archivos Excel Online

Encuentra cada diferencia entre dos hojas de cálculo Excel en segundos. Gratis, privado y funciona en tu navegador.

### ¿Por qué usar DiffSheets para comparar Excel?

**Comparación Visual Lado a Lado**
Ve los cambios resaltados en color. Filas añadidas en verde, eliminadas en rojo, modificadas en amarillo.

**Privacidad Total**
Tus archivos Excel nunca salen de tu computadora. Todo el procesamiento es local.

**Todos los Formatos Excel**
Funciona con .xlsx, .xls, e incluso compara Excel con archivos CSV.

[Compara tus Archivos Excel Ahora](${BASE_URL}/es/compare)
`,
    },
  },
  "csv-diff": {
    en: {
      title: "CSV Diff Tool - Compare CSV Files Online Free",
      description:
        "Compare two CSV files online for free. Find differences between CSV spreadsheets instantly. No upload to servers - your data stays private.",
      content: `
## Compare CSV Files Online

The fastest way to find differences between CSV files. Free, secure, and runs entirely in your browser.

### Why Use DiffSheets for CSV Comparison?

**Instant Results**
Compare CSV files in milliseconds. No waiting for server processing.

**Handle Large Files**
Virtual scrolling lets you compare CSV files with hundreds of thousands of rows.

**Smart Parsing**
Automatically detects delimiters. Works with comma, semicolon, tab-separated files.

**Compare Across Formats**
Compare CSV to Excel, or CSV to CSV. Mix and match file types.

### Perfect For

**Database Exports**
Compare database dumps, verify backup integrity, track schema changes.

**API Responses**
Diff API response data, compare test results, validate integrations.

**Log Analysis**
Compare log files, find configuration differences, track changes over time.

**ETL Pipelines**
Validate data transformations, verify ETL output, ensure data quality.

[Compare Your CSV Files Now](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "Herramienta de Diff CSV - Compara Archivos CSV Online Gratis",
      description:
        "Compara dos archivos CSV online gratis. Encuentra diferencias al instante. Tus datos permanecen privados.",
      content: `
## Compara Archivos CSV Online

La forma más rápida de encontrar diferencias entre archivos CSV. Gratis, seguro y funciona en tu navegador.

### ¿Por qué usar DiffSheets para comparar CSV?

**Resultados Instantáneos**
Compara archivos CSV en milisegundos. Sin esperar procesamiento del servidor.

**Maneja Archivos Grandes**
El scroll virtual te permite comparar archivos CSV con cientos de miles de filas.

**Parsing Inteligente**
Detecta delimitadores automáticamente. Funciona con archivos separados por comas, punto y coma, tabuladores.

[Compara tus Archivos CSV Ahora](${BASE_URL}/es/compare)
`,
    },
  },
  "xls-diff": {
    en: {
      title: "XLS File Comparison Tool - Compare Legacy Excel Files",
      description:
        "Compare XLS Excel files online. Find differences between legacy .xls spreadsheets with our free comparison tool.",
      content: `
## Compare XLS Files Online

Need to compare legacy Excel files? Our free tool handles .xls files perfectly. Privacy guaranteed.

### Why Use DiffSheets for XLS Comparison?

**Legacy Format Support**
Full support for older .xls format files from Excel 97-2003.

**Cross-Version Compatibility**
Compare .xls files with modern .xlsx formats seamlessly.

**Complete Privacy**
Your XLS files never leave your computer. All processing happens locally.

**Instant Results**
No waiting for server processing. Compare files in milliseconds.

### Perfect For

**Legacy System Migration**
Verify data integrity when migrating from legacy Excel systems to modern platforms.

**Historical Data Comparison**
Compare old archived files with current data to track long-term changes.

**Compliance Auditing**
Audit historical records and ensure compliance with legacy document requirements.

[Compare Your XLS Files Now](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "Herramienta de Comparación XLS - Compara Archivos Excel Antiguos",
      description:
        "Compara archivos Excel XLS online. Encuentra diferencias entre hojas .xls antiguas con nuestra herramienta gratuita.",
      content: `
## Compara Archivos XLS Online

¿Necesitas comparar archivos Excel antiguos? Nuestra herramienta gratuita maneja archivos .xls perfectamente.

### ¿Por qué usar DiffSheets para comparar XLS?

**Soporte para Formato Antiguo**
Soporte completo para archivos .xls de Excel 97-2003.

**Compatibilidad Entre Versiones**
Compara archivos .xls con formatos modernos .xlsx sin problemas.

[Compara tus Archivos XLS Ahora](${BASE_URL}/es/compare)
`,
    },
  },
  "ods-compare": {
    en: {
      title: "Compare ODS Files - LibreOffice Spreadsheet Diff Tool",
      description:
        "Compare ODS LibreOffice Calc files online for free. Find differences between OpenDocument spreadsheets instantly. 100% private.",
      content: `
## Compare ODS Spreadsheets

Free online tool to compare LibreOffice Calc and OpenOffice spreadsheets. Your data stays private.

### Why Use DiffSheets for ODS Comparison?

**LibreOffice & OpenOffice Support**
Native support for OpenDocument Spreadsheet (.ods) format from LibreOffice and OpenOffice.

**Open Format Standard**
Works with ODS files and compare them against Excel formats for maximum flexibility.

**Complete Privacy**
Your ODS files never leave your computer. All processing happens locally.

**Cross-Platform Compatible**
Works on any device with a modern browser - Windows, Mac, Linux, or mobile.

### Perfect For

**Open Source Workflows**
Perfect for teams using LibreOffice or OpenOffice in open-source environments.

**Government & Compliance**
Many government agencies require ODS format for compliance and archival purposes.

**Cross-Platform Teams**
Compare files across different office suites - LibreOffice, OpenOffice, and Microsoft Excel.

[Compare Your ODS Files Now](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "Compara Archivos ODS - Herramienta Diff para LibreOffice",
      description:
        "Compara archivos ODS de LibreOffice Calc online gratis. Encuentra diferencias al instante. 100% privado.",
      content: `
## Compara Hojas de Cálculo ODS

Herramienta online gratuita para comparar hojas de LibreOffice Calc y OpenOffice. Tus datos permanecen privados.

### ¿Por qué usar DiffSheets para comparar ODS?

**Soporte para LibreOffice y OpenOffice**
Soporte nativo para formato OpenDocument Spreadsheet (.ods).

**Formato Abierto Estándar**
Funciona con archivos ODS y compáralos con formatos Excel para máxima flexibilidad.

[Compara tus Archivos ODS Ahora](${BASE_URL}/es/compare)
`,
    },
  },
  "guide/spreadsheet-comparison": {
    en: {
      title: "The Complete Guide to Spreadsheet Comparison (2025)",
      description:
        "Everything you need to know about comparing spreadsheets. Learn methods, tools, best practices for Excel, CSV, and ODS file comparison.",
      content: `
## The Complete Guide to Spreadsheet Comparison

Master the art of finding differences between spreadsheets with this comprehensive guide.

### What is Spreadsheet Comparison?

Spreadsheet comparison is the process of analyzing two spreadsheet files to identify differences between them. This includes finding:
- Added rows or columns
- Deleted rows or columns
- Modified cell values
- Formatting changes

### Methods of Comparison

**Manual Comparison**
Reviewing cells side-by-side. Time-consuming and error-prone for large files.

**Formula-Based (VLOOKUP, INDEX/MATCH)**
Using Excel formulas to find differences. Requires Excel expertise.

**Conditional Formatting**
Highlighting differences with colors. Limited to simple comparisons.

**Dedicated Comparison Tools**
Software specifically designed for spreadsheet comparison. Most efficient method.

### Types of Differences

1. **Structural Changes**: Added/removed rows or columns
2. **Value Changes**: Modified cell contents
3. **Type Changes**: Number to text, date format changes
4. **Order Changes**: Rows or columns reordered

### Best Practices

1. Always keep backup copies of original files
2. Use consistent file naming conventions
3. Document what changes you're looking for
4. Choose the right matching strategy for your data
5. Verify results on a sample before full comparison

### Tools Comparison

| Tool | Price | Privacy | Formats |
|------|-------|---------|---------|
| DiffSheets | Free | 100% Local | XLSX, XLS, CSV, ODS |
| Spreadsheet Compare | Office 365 Pro+ | Local | XLSX, XLS |
| Beyond Compare | $60 | Local | Multiple |
| Online Tools | Free-Paid | Upload Required | Varies |

[Try DiffSheets Free](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "La Guía Completa para Comparar Hojas de Cálculo (2025)",
      description:
        "Todo lo que necesitas saber sobre comparar hojas de cálculo. Aprende métodos, herramientas y mejores prácticas.",
      content: `
## La Guía Completa para Comparar Hojas de Cálculo

Domina el arte de encontrar diferencias entre hojas de cálculo con esta guía completa.

### ¿Qué es la Comparación de Hojas de Cálculo?

La comparación de hojas de cálculo es el proceso de analizar dos archivos para identificar diferencias entre ellos.

### Métodos de Comparación

**Comparación Manual**
Revisar celdas lado a lado. Consume tiempo y es propenso a errores.

**Basado en Fórmulas (BUSCARV, INDICE/COINCIDIR)**
Usar fórmulas de Excel para encontrar diferencias. Requiere experiencia en Excel.

**Herramientas Dedicadas**
Software diseñado específicamente para comparar hojas. Método más eficiente.

[Prueba DiffSheets Gratis](${BASE_URL}/es/compare)
`,
    },
  },
  "use-cases": {
    en: {
      title: "Spreadsheet Comparison Use Cases | DiffSheets",
      description:
        "Discover how to use spreadsheet comparison for financial auditing, data migration, version control, and quality assurance.",
      content: `
## Spreadsheet Comparison Use Cases

### Financial Auditing

Compare financial spreadsheets with confidence. Track budget changes, audit expense reports, and verify financial data accuracy.

**Example scenarios:**
- Budget Version Comparison: Compare Q1 budget vs Q2 actuals
- Expense Report Auditing: Verify submitted expenses against approved amounts
- Account Reconciliation: Match bank statements with internal records

### Data Migration

Verify data integrity after migration. Compare source and destination spreadsheets to ensure no data was lost or corrupted.

**Example scenarios:**
- Database Migration: Verify data after moving from legacy to new systems
- CRM Data Import: Confirm all contacts imported correctly
- ERP System Upgrade: Validate data integrity after upgrades

### Version Control

Track changes between spreadsheet versions. See exactly what changed when collaborating with teams.

**Example scenarios:**
- Document Review: See what changed after a colleague's edits
- Approval Workflows: Verify only approved changes were made
- Backup Verification: Confirm backups match current files

### Quality Assurance

Compare expected vs actual test results. Validate data outputs and catch discrepancies in QA testing.

**Example scenarios:**
- Regression Testing: Compare before/after data to catch regressions
- ETL Validation: Verify data transformations produce expected output
- API Response Testing: Compare API responses against expected values

[Get Started with DiffSheets](${BASE_URL}/en/compare)
`,
    },
    es: {
      title: "Casos de Uso para Comparar Hojas de Cálculo | DiffSheets",
      description:
        "Descubre cómo usar la comparación de hojas de cálculo para auditoría financiera, migración de datos y más.",
      content: `
## Casos de Uso para Comparar Hojas de Cálculo

### Auditoría Financiera
Compara hojas de cálculo financieras con confianza. Rastrea cambios en presupuestos y audita reportes de gastos.

### Migración de Datos
Verifica la integridad de datos después de una migración. Compara archivos origen y destino.

### Control de Versiones
Rastrea cambios entre versiones de documentos. Ve exactamente qué cambió al colaborar con equipos.

### Aseguramiento de Calidad
Compara resultados esperados vs reales. Valida salidas de datos y detecta discrepancias.

[Comienza con DiffSheets](${BASE_URL}/es/compare)
`,
    },
  },
};

interface PageContent {
  title: string;
  description: string;
  content: string;
}

function generateMarkdown(path: string, locale: string): string | null {
  const content = pageContent[path];
  if (!content) return null;

  const localeContent = locale === "es" ? content.es : content.en;
  if (!localeContent) return null;

  const canonicalUrl = `${BASE_URL}/${locale}/${path}`.replace(/\/+$/, "");

  return `# ${localeContent.title}

> ${localeContent.description}

**URL**: ${canonicalUrl}
**Language**: ${locale === "es" ? "Spanish" : "English"}

---
${localeContent.content}

---

*Generated for AI consumption from [DiffSheets](${BASE_URL})*
`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "";

  // Parse locale and path
  const pathParts = path.split("/").filter(Boolean);
  let locale = "en";
  let pagePath = "";

  if (pathParts[0] === "en" || pathParts[0] === "es") {
    locale = pathParts[0];
    pagePath = pathParts.slice(1).join("/");
  } else {
    pagePath = pathParts.join("/");
  }

  const markdown = generateMarkdown(pagePath, locale);

  if (!markdown) {
    // Return a helpful 404 message
    const availablePages = Object.keys(pageContent)
      .filter((p) => p !== "")
      .map((p) => `- /${locale}/${p}.md`)
      .join("\n");

    return new Response(
      `# Page Not Found

The requested page "${path}" is not available in Markdown format.

## Available Pages

${availablePages}

## Other Resources

- [llms.txt](${BASE_URL}/llms.txt) - Overview for AI
- [llms-full.txt](${BASE_URL}/llms-full.txt) - Complete documentation
`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      }
    );
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
