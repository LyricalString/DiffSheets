import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Footer, Header } from "@/components/layout";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide.spreadsheetComparison" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/guide/spreadsheet-comparison`,
      languages: {
        en: "/en/guide/spreadsheet-comparison",
        es: "/es/guide/spreadsheet-comparison",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "article",
    },
  };
}

// Comprehensive guide content
const guideContent = {
  en: {
    sections: [
      {
        id: "what",
        heading: "What is Spreadsheet Comparison?",
        content: `Spreadsheet comparison is the process of identifying differences between two versions of a spreadsheet file. Whether you're working with Excel, CSV, ODS, or other formats, comparison helps you understand what has changed between versions—from simple cell value updates to structural changes like added or removed rows and columns.

**Why Spreadsheet Comparison Matters**

In today's data-driven world, spreadsheets are everywhere. They're used for financial reports, inventory tracking, project management, data analysis, and countless other applications. When multiple people collaborate on spreadsheets, or when data is updated over time, it becomes critical to track what has changed.

Spreadsheet comparison serves several essential purposes:

- **Audit Trail**: Maintain a clear record of who changed what and when
- **Error Detection**: Identify accidental changes or data corruption
- **Data Validation**: Verify that data migrations or transformations completed correctly
- **Version Control**: Track the evolution of your data over time
- **Collaboration**: Understand changes made by team members
- **Compliance**: Meet regulatory requirements for data tracking

**Common Scenarios Requiring Spreadsheet Comparison**

Financial teams compare budget versions to track spending changes. Data analysts verify ETL pipeline outputs. Project managers reconcile schedule updates. Accountants audit expense reports. Quality assurance teams validate test results against expected outputs.

Every time you receive a modified version of a spreadsheet and wonder "what changed?", you need spreadsheet comparison.`,
      },
      {
        id: "methods",
        heading: "Methods of Comparison",
        content: `There are several approaches to comparing spreadsheets, each with distinct advantages and limitations. Understanding these methods helps you choose the right tool for your specific needs.

**1. Manual Side-by-Side Comparison**

The most basic method involves opening both files and visually comparing them. While simple, this approach is:

*Pros:*
- No tools or setup required
- Works with any spreadsheet format
- Complete control over what you examine

*Cons:*
- Extremely time-consuming for files with more than a few dozen rows
- High error rate—easy to miss differences
- No systematic tracking of changes
- Impossible for large datasets

**Best for:** Very small files (under 50 rows) with minimal expected changes.

**2. Excel's Built-in Features**

Microsoft Excel offers several comparison capabilities:

*Spreadsheet Compare (Inquire Add-in):*
Available in Excel 2013+ and Microsoft 365. Provides comprehensive workbook comparison with detailed change reports.

Steps:
1. File → Options → Add-Ins
2. Manage: COM Add-ins → Go
3. Enable Inquire
4. Inquire tab → Compare Files

*Pros:*
- Built into Excel
- Comprehensive comparison including formulas, formatting, and macros
- Generates detailed reports

*Cons:*
- Only available in certain Excel versions (not in Excel for Mac)
- Requires Excel installation
- Can be slow with large files
- Steep learning curve
- Not suitable for CSV or ODS files

**3. Formula-Based Comparison (VLOOKUP, INDEX/MATCH)**

You can use Excel formulas to find differences:

\`\`\`excel
=IF(VLOOKUP(A2,Sheet2!A:B,2,FALSE)=B2,"Match","Different")
\`\`\`

For more complex comparisons:
\`\`\`excel
=IF(COUNTIFS(Sheet2!A:A,A2,Sheet2!B:B,B2)>0,"Match","Different")
\`\`\`

*Pros:*
- No additional tools needed
- Highly customizable
- Can be saved for repeated use
- Useful for specific column comparisons

*Cons:*
- Requires Excel/formula knowledge
- Complex setup for many columns
- Doesn't visually highlight differences
- Manual work to identify exact changes
- Performance issues with large datasets

**Best for:** Specific column comparisons, checking if values exist in both sheets, one-off analyses.

**4. Dedicated Diff Tools**

Tools specifically designed for spreadsheet comparison, like DiffSheets, Beyond Compare, or WinMerge.

*Pros:*
- Visual, color-coded difference highlighting
- Support for multiple file formats
- Handle large files efficiently
- Intelligent row matching algorithms
- No setup or formulas required
- Export difference reports

*Cons:*
- May require installation (except web-based tools)
- Learning curve for advanced features

**Best for:** Most comparison tasks, especially when you need to see all differences quickly.

**5. Command-Line Tools and Scripts**

Developers often use command-line tools or write custom scripts:

\`\`\`python
import pandas as pd

df1 = pd.read_excel('original.xlsx')
df2 = pd.read_excel('modified.xlsx')
comparison = df1.compare(df2)
\`\`\`

\`\`\`bash
csvdiff file1.csv file2.csv --key=id
\`\`\`

*Pros:*
- Fully automatable
- Integration with CI/CD pipelines
- Customizable logic
- Batch processing capabilities

*Cons:*
- Requires programming knowledge
- Setup overhead
- Not visual—output is text-based
- Maintenance burden

**Best for:** Automated testing, CI/CD integration, recurring comparisons.

**6. Version Control Systems (Git)**

While primarily for code, Git can track spreadsheet changes when files are in CSV or other text-based formats.

*Pros:*
- Complete change history
- Branching and merging
- Collaboration features

*Cons:*
- Not designed for binary formats (XLSX)
- Poor diff display for spreadsheets
- Significant learning curve
- Requires converting Excel to CSV

**Best for:** Text-based formats (CSV, TSV) in development workflows.`,
      },
      {
        id: "types",
        heading: "Types of Differences",
        content: `Understanding the different types of changes that can occur in spreadsheets helps you interpret comparison results accurately.

**1. Cell Value Changes**

The most common type of difference—when a cell's value changes from one version to another.

Examples:
- "1000" becomes "1500"
- "Pending" becomes "Approved"
- "John Smith" becomes "John P. Smith"

These changes are usually highlighted in yellow or orange by comparison tools. They represent modifications to existing data.

**Importance:** Critical for tracking data updates, corrections, or revisions.

**2. Row Additions**

When new rows appear in the modified version that don't exist in the original.

Typically shown in green. Represents new records, entries, or data points.

**Common causes:**
- New transactions or entries
- Additional test results
- Expanded datasets
- New inventory items

**Detection challenges:** Tools must determine whether a row is truly new or just moved. This is where key column matching becomes important.

**3. Row Deletions**

When rows present in the original are missing from the modified version.

Usually highlighted in red. Indicates removed records or filtered data.

**Common causes:**
- Deleted records
- Data cleanup
- Filtered views exported as new files
- Archived entries

**Important consideration:** Ensure deletions are intentional, not data loss.

**4. Row Reordering**

When the same rows exist in both files but in different order.

**Detection depends on comparison method:**
- Position-based: Shows all rows as different
- Key column-based: Correctly identifies as same rows, different position
- LCS algorithm: Intelligently handles reordering

This is why choosing the right comparison algorithm matters.

**5. Column Changes**

Structural changes to the spreadsheet itself:

**Column additions:** New columns in the modified version
**Column deletions:** Columns removed from the original
**Column reordering:** Same columns, different sequence
**Column renaming:** Header changes (if you have header rows)

**Impact:** Can make automated comparison challenging if not handled properly.

**6. Format Changes**

Changes in cell formatting rather than content:
- Font changes
- Color changes
- Number formatting (though this can affect values: "1000" vs "1,000")
- Cell borders and alignment

**Note:** Most comparison tools focus on content, not formatting. Excel's Spreadsheet Compare includes formatting differences.

**7. Formula Changes**

When the formula in a cell changes, even if the result remains the same.

Example: \`=A1+B1\` becomes \`=SUM(A1:B1)\`

**Important for:** Understanding calculation logic changes, not just results.

**8. Whitespace and Case Differences**

Subtle differences that may or may not be significant:
- Leading/trailing spaces: "value" vs "value "
- Case changes: "TOTAL" vs "Total"
- Line breaks within cells

**Handling:** Many tools offer options to ignore these differences.

**9. Data Type Changes**

When the same logical value is represented differently:
- "100" (text) vs 100 (number)
- Date formatting: "01/15/2025" vs "2025-01-15"
- Boolean: "TRUE" vs "Yes" vs 1

**Challenge:** These may appear identical visually but are technically different.

**10. Empty vs. Null vs. Zero**

Important distinction in data analysis:
- Empty cell (no value)
- Null or NA
- Zero or empty string

Each has different meaning and may be handled differently by comparison tools.`,
      },
      {
        id: "bestPractices",
        heading: "Best Practices for Spreadsheet Comparison",
        content: `Follow these proven strategies to make spreadsheet comparison more effective and accurate.

**1. Prepare Your Files Before Comparing**

**Consistent formatting:** Ensure both files use the same date format, number format, and encoding
**Remove unnecessary sheets:** Compare only relevant worksheets
**Verify encoding:** UTF-8 is recommended for CSV files
**Check for hidden rows/columns:** Unhide them or exclude them consistently
**Standardize headers:** Ensure column headers match exactly

**2. Choose the Right Key Column**

When using key column matching (the most powerful comparison method), select a column that:

- Contains unique values (like ID, SKU, email)
- Exists in both files
- Has consistent formatting
- Doesn't contain duplicates
- Isn't prone to typos

**Good key columns:** Employee ID, Product SKU, Transaction ID, Email Address
**Poor key columns:** Names (duplicates), Descriptions (typos), Dates (non-unique)

**3. Start with Small Test Comparisons**

Before comparing large files:
- Test with the first 100 rows
- Verify the comparison method produces expected results
- Adjust settings as needed
- Then run the full comparison

This saves time and helps you dial in the right settings.

**4. Use Appropriate Comparison Algorithms**

**Position-based matching** when:
- Files have the same row order
- You're comparing sequential data
- Rows have no unique identifier

**Key column matching** when:
- Rows may be reordered
- Each row has a unique identifier
- You're comparing databases or transactional data

**LCS (Longest Common Subsequence)** when:
- Rows are significantly reordered
- You want the most intelligent matching
- Performance isn't critical (slower for very large files)

**5. Handle Large Files Strategically**

For files with 100,000+ rows:

- Use tools with virtual scrolling (like DiffSheets)
- Consider splitting files into smaller chunks
- Compare column-by-column if needed
- Use command-line tools for automation
- Increase available memory
- Filter to relevant data before comparing

**6. Document Your Comparison Process**

**Record:**
- Which files were compared
- What comparison settings were used
- Date and time of comparison
- Who performed the comparison
- Summary of findings

This creates an audit trail and helps others understand your process.

**7. Validate Results**

Don't blindly trust comparison results:
- Spot-check a sample of differences
- Verify that "no differences" is correct
- Check edge cases (first row, last row)
- Confirm the tool handles your data types correctly

**8. Choose Appropriate Difference Filters**

Many tools let you:
- Ignore whitespace differences
- Ignore case differences
- Hide unchanged rows/columns
- Filter by difference type

Use these filters to focus on meaningful changes.

**9. Export and Share Results**

Create reports that:
- Highlight all differences clearly
- Include context (surrounding data)
- Are shareable with stakeholders
- Can be archived for future reference

**10. Prioritize Privacy and Security**

When comparing sensitive data:
- Use client-side tools (like DiffSheets) where data never leaves your computer
- Avoid uploading files to unknown servers
- Check tool privacy policies
- Use encrypted connections (HTTPS)
- Delete comparison results from shared systems

**11. Automate Recurring Comparisons**

If you compare the same files regularly:
- Write scripts to automate the process
- Set up scheduled comparisons
- Create standardized reports
- Implement alerts for unexpected changes

**12. Test Your Backup and Recovery**

Before making changes based on comparison results:
- Backup original files
- Test changes on copies
- Verify results
- Only then apply to production data

**13. Common Pitfalls to Avoid**

**Don't:**
- Compare different data subsets and expect matching
- Ignore data type differences
- Assume identical file sizes mean identical content
- Skip validation of critical changes
- Use position-based matching on reordered data
- Forget to check all sheets in multi-sheet workbooks

**14. Optimize for Your Use Case**

**Financial auditing:** Focus on numerical precision, track formula changes
**Data migration:** Verify row counts, check for data type changes
**Collaboration:** Track who made what changes, review all modifications
**Quality assurance:** Compare against expected results, automate comparisons

**15. Keep Tools Updated**

Ensure your comparison tools:
- Support the latest file formats
- Have the latest bug fixes
- Include security updates
- Offer improved performance`,
      },
      {
        id: "tools",
        heading: "Spreadsheet Comparison Tools",
        content: `A comprehensive comparison of available tools for spreadsheet comparison.

**DiffSheets (Recommended)**

**Type:** Web-based application
**Price:** Free
**Platform:** Any browser

**Features:**
- 100% client-side processing (data never uploaded)
- Supports XLSX, XLS, CSV, ODS
- Multiple comparison algorithms (position, key column, LCS)
- Visual side-by-side diff view
- Virtual scrolling for large files
- Color-coded differences
- No installation required
- No registration required

**Pros:**
- Complete privacy—files never leave your browser
- Free with no limits
- Easy to use—no learning curve
- Fast performance
- Multi-format support
- Works on any operating system

**Cons:**
- Requires internet access (though no data is uploaded)
- Limited to comparing two files at a time

**Best for:** Most users, especially those prioritizing privacy, ease of use, and speed.

**Try it:** Visit diffsheets.com

---

**Microsoft Excel Spreadsheet Compare**

**Type:** Desktop application (Windows only)
**Price:** Included with Microsoft 365 or Office Professional Plus
**Platform:** Windows

**Features:**
- Comprehensive workbook comparison
- Formula comparison
- Format comparison
- VBA macro comparison
- Detailed reports
- Export to Excel

**Pros:**
- Deep integration with Excel
- Compares formulas and formatting
- Detailed change reports
- No file size limits

**Cons:**
- Windows only (not available on Mac)
- Requires specific Excel versions
- Steep learning curve
- Slow with large files
- Not suitable for CSV or ODS

**Best for:** Windows users with Microsoft 365 who need detailed Excel-specific analysis.

---

**Beyond Compare**

**Type:** Desktop application
**Price:** $60 (one-time purchase)
**Platform:** Windows, macOS, Linux

**Features:**
- Side-by-side comparison
- Three-way merge
- Folder comparison
- Syntax highlighting
- Scripting support
- Multiple file format support

**Pros:**
- Powerful and feature-rich
- Supports many file types beyond spreadsheets
- Excellent for developers
- Scriptable for automation

**Cons:**
- Paid software
- Steeper learning curve
- Not specialized for spreadsheets
- Treats spreadsheets as text (limited structure awareness)

**Best for:** Power users and developers who need a multi-purpose comparison tool.

---

**WinMerge**

**Type:** Desktop application
**Price:** Free (open source)
**Platform:** Windows

**Features:**
- Visual differencing and merging
- Folder comparison
- Syntax highlighting
- Plugin support
- Generate patch files

**Pros:**
- Free and open source
- Lightweight
- Fast
- Supports plugins for Excel comparison

**Cons:**
- Windows only
- Requires plugin for proper Excel support
- Limited spreadsheet-specific features
- Text-based comparison (not structure-aware)

**Best for:** Windows users wanting a free, open-source option for occasional comparisons.

---

**Spreadsheet Compare (XL-Connector)**

**Type:** Excel add-in
**Price:** Free version available, Pro version $49/year
**Platform:** Windows, macOS

**Features:**
- Compare sheets within Excel
- Highlight differences
- Merge changes
- Multiple comparison modes

**Pros:**
- Works within Excel
- Intuitive interface
- Good for Excel power users

**Cons:**
- Requires Excel installation
- Limited free version
- Annual subscription for Pro features

**Best for:** Excel users who want to stay within the Excel environment.

---

**Google Sheets Version History**

**Type:** Web-based (Google Sheets)
**Price:** Free
**Platform:** Any browser

**Features:**
- Track changes over time
- View previous versions
- See who made changes
- Restore old versions

**Pros:**
- Free
- Built into Google Sheets
- Easy to use
- Tracks who made changes

**Cons:**
- Only works with Google Sheets files
- Shows sequential changes, not side-by-side comparison
- Limited to files in Google Drive
- Requires files to be in Google Sheets format

**Best for:** Teams collaborating on Google Sheets who want to track changes over time.

---

**csvdiff (Command-Line)**

**Type:** Command-line tool
**Price:** Free (open source)
**Platform:** Any (requires Python)

**Features:**
- Fast CSV comparison
- Key-based matching
- JSON output
- Scriptable

**Pros:**
- Fast for large CSV files
- Automatable
- Simple and focused
- Good for CI/CD pipelines

**Cons:**
- Command-line only (no GUI)
- CSV only
- Requires programming knowledge
- Text output (not visual)

**Best for:** Developers automating CSV comparisons in scripts or pipelines.

---

**Pandas (Python Library)**

**Type:** Programming library
**Price:** Free (open source)
**Platform:** Any (requires Python)

**Features:**
- Powerful data comparison with \`.compare()\`
- Flexible and customizable
- Can handle any spreadsheet format
- Integration with data analysis workflows

**Pros:**
- Extremely flexible
- Can handle complex comparison logic
- Integration with broader data analysis
- Free and open source

**Cons:**
- Requires Python programming knowledge
- No visual interface
- Setup overhead

**Best for:** Data scientists and analysts who need custom comparison logic.

---

**Tool Comparison Matrix**

| Tool | Price | Platform | Privacy | Ease of Use | Best For |
|------|-------|----------|---------|-------------|----------|
| DiffSheets | Free | Web | Excellent | Very Easy | Most users |
| Excel Compare | Included | Windows | Good | Moderate | Excel power users |
| Beyond Compare | $60 | All | Good | Moderate | Developers |
| WinMerge | Free | Windows | Good | Moderate | Budget-conscious |
| Google Sheets | Free | Web | Fair | Easy | Google Sheets users |
| csvdiff | Free | CLI | Excellent | Hard | Automation |
| Pandas | Free | Python | Excellent | Hard | Data scientists |

**Recommendation:**

For most users, **DiffSheets** offers the best balance of features, ease of use, and privacy. It's free, requires no installation, and keeps your data completely private.

If you're a Windows user with Microsoft 365 and need detailed Excel-specific analysis, **Excel Spreadsheet Compare** is a solid choice.

For developers building automated workflows, **csvdiff** or **Pandas** provide the flexibility needed for scripting and integration.`,
      },
      {
        id: "faq",
        heading: "Frequently Asked Questions",
        content: `**Q: What's the fastest way to compare two Excel files?**

A: Upload both files to DiffSheets (diffsheets.com), select any key column if available, and click "Find Difference". You'll see all changes in seconds, highlighted in color.

**Q: Can I compare Excel files without Excel installed?**

A: Yes. Web-based tools like DiffSheets work in any browser and don't require Excel. They support XLSX, XLS, CSV, and ODS formats natively.

**Q: How do I compare two CSV files?**

A: CSV files can be compared using DiffSheets, csvdiff (command-line), Excel, or any diff tool. For best results, ensure both files use the same delimiter (comma, semicolon, or tab).

**Q: What's the difference between position-based and key-based comparison?**

A: Position-based compares row 1 to row 1, row 2 to row 2, etc. Key-based matches rows by a unique identifier (like ID or email), so row order doesn't matter. Key-based is more accurate when rows might be reordered.

**Q: Can I compare spreadsheets with different column orders?**

A: Yes, but it's more challenging. Some tools can match columns by header name. Otherwise, you may need to reorder columns to match before comparing.

**Q: How do I handle very large spreadsheets (1 million+ rows)?**

A: Use tools with virtual scrolling (DiffSheets), command-line tools (csvdiff), or programming libraries (Pandas). You might also filter data or split files into smaller chunks.

**Q: Are online comparison tools safe for sensitive data?**

A: It depends. DiffSheets processes files 100% client-side in your browser—data never leaves your computer. However, some online tools upload files to servers. Always check the tool's privacy policy.

**Q: Can I compare spreadsheets and export a report of differences?**

A: Yes. Most professional comparison tools offer export features. DiffSheets lets you download results, Excel Spreadsheet Compare generates detailed reports, and command-line tools can output to files.

**Q: What if my files have different numbers of columns?**

A: Comparison tools will typically show missing columns as deletions and new columns as additions. Ensure you're comparing the intended data structures.

**Q: Can I compare formulas, not just values?**

A: Excel Spreadsheet Compare can compare formulas. However, most other tools compare resulting values. If you need formula comparison, use Excel-specific tools.

**Q: How do I compare only specific columns?**

A: Some tools allow column selection. Alternatively, create versions of your files with only the columns you want to compare.

**Q: What's the best way to compare spreadsheets for financial auditing?**

A: Use a tool that provides precise numerical comparison and generates audit reports. Excel Spreadsheet Compare or DiffSheets both work well. Ensure you track who compared what and when.

**Q: Can I automate spreadsheet comparisons?**

A: Yes. Use command-line tools (csvdiff), scripting with Python/Pandas, or tools with API/CLI interfaces. This is ideal for recurring comparisons or CI/CD integration.

**Q: What if I need to compare more than two files?**

A: Most tools compare two files at a time. For multiple files, compare pairwise (File1 vs File2, File2 vs File3) or use programming libraries to build custom logic.

**Q: How accurate are automated comparison tools?**

A: Very accurate when configured correctly. However, always validate results, especially for critical data. Spot-check a sample of differences to ensure the tool is working as expected.

**Q: Can I compare Google Sheets?**

A: Yes. Export Google Sheets to XLSX or CSV format, then use any comparison tool. Or use Google Sheets' built-in version history for tracking changes over time.

**Q: What's the difference between diff and merge?**

A: Diff identifies differences between files. Merge combines changes from multiple files into one. Most spreadsheet tools focus on diff, not merge.

**Q: How do I choose which comparison method to use?**

A: If rows might be reordered, use key column matching. If row order is guaranteed to be the same, position-based is faster. When unsure, try LCS algorithm for intelligent matching.

**Q: Can comparison tools detect duplicates?**

A: Some can, especially when using key column matching. Duplicates in the key column usually trigger warnings. For dedicated duplicate detection, use Excel's built-in features or write custom formulas.

**Q: What if my spreadsheets have different date formats?**

A: This can cause false differences. Standardize date formats before comparing, or use a tool that can recognize different date representations as equivalent.`,
      },
      {
        id: "glossary",
        heading: "Spreadsheet Comparison Glossary",
        content: `**Algorithm:** The method used to match and compare rows. Common algorithms include position-based, key column matching, and LCS (Longest Common Subsequence).

**Cell:** The intersection of a row and column in a spreadsheet where a single value is stored.

**Client-side Processing:** When a web application processes data in your browser rather than uploading it to a server. Ensures privacy.

**CSV (Comma-Separated Values):** A simple text-based spreadsheet format where values are separated by commas. Widely compatible but lacks formatting.

**Delta:** The set of differences between two versions of a file. Also called a "diff."

**Diff:** Short for "difference." A comparison showing what has changed between two files.

**Key Column:** A column containing unique identifiers used to match rows between two spreadsheets, regardless of row order.

**LCS (Longest Common Subsequence):** An algorithm for finding the longest sequence of matching rows between two files. Useful for detecting reordering.

**Merge:** Combining changes from multiple file versions into a single file. More complex than simple comparison.

**ODS (OpenDocument Spreadsheet):** An open-source spreadsheet format used by LibreOffice and OpenOffice.

**Position-based Matching:** Comparing row 1 to row 1, row 2 to row 2, etc., based solely on row position.

**Row:** A horizontal line of cells in a spreadsheet, typically representing a single record or data point.

**Schema:** The structure of a spreadsheet, including column names, order, and data types.

**Side-by-Side View:** A comparison display showing both files next to each other with differences highlighted.

**Three-Way Comparison:** Comparing three versions of a file (base, version 1, version 2) to understand divergent changes.

**Unified View:** A comparison display showing both files merged into a single view with additions and deletions marked.

**Virtual Scrolling:** A technique for displaying large datasets by rendering only visible rows, improving performance.

**XLSX:** The modern Excel file format, introduced in Excel 2007. Uses XML and ZIP compression.

**XLS:** The legacy Excel file format used before 2007. Binary format with limited row capacity (65,536 rows).`,
      },
    ],
  },
  es: {
    sections: [
      {
        id: "what",
        heading: "¿Qué es la Comparación de Hojas de Cálculo?",
        content: `La comparación de hojas de cálculo es el proceso de identificar diferencias entre dos versiones de un archivo de hoja de cálculo. Ya sea que trabajes con Excel, CSV, ODS u otros formatos, la comparación te ayuda a entender qué ha cambiado entre versiones, desde simples actualizaciones de valores de celda hasta cambios estructurales como filas y columnas agregadas o eliminadas.

**Por qué Importa la Comparación de Hojas de Cálculo**

En el mundo actual impulsado por datos, las hojas de cálculo están en todas partes. Se utilizan para informes financieros, seguimiento de inventario, gestión de proyectos, análisis de datos y muchas otras aplicaciones. Cuando múltiples personas colaboran en hojas de cálculo, o cuando los datos se actualizan con el tiempo, se vuelve crítico rastrear qué ha cambiado.

La comparación de hojas de cálculo sirve varios propósitos esenciales:

- **Rastro de Auditoría**: Mantener un registro claro de quién cambió qué y cuándo
- **Detección de Errores**: Identificar cambios accidentales o corrupción de datos
- **Validación de Datos**: Verificar que las migraciones o transformaciones de datos se completaron correctamente
- **Control de Versiones**: Rastrear la evolución de tus datos a lo largo del tiempo
- **Colaboración**: Entender los cambios realizados por miembros del equipo
- **Cumplimiento**: Cumplir con requisitos regulatorios de seguimiento de datos

**Escenarios Comunes que Requieren Comparación de Hojas de Cálculo**

Los equipos financieros comparan versiones de presupuestos para rastrear cambios de gastos. Los analistas de datos verifican salidas de pipelines ETL. Los gerentes de proyecto reconcilian actualizaciones de cronogramas. Los contadores auditan informes de gastos. Los equipos de control de calidad validan resultados de pruebas contra salidas esperadas.

Cada vez que recibes una versión modificada de una hoja de cálculo y te preguntas "¿qué cambió?", necesitas comparación de hojas de cálculo.`,
      },
      {
        id: "methods",
        heading: "Métodos de Comparación",
        content: `Hay varios enfoques para comparar hojas de cálculo, cada uno con ventajas y limitaciones distintas. Entender estos métodos te ayuda a elegir la herramienta correcta para tus necesidades específicas.

**1. Comparación Manual Lado a Lado**

El método más básico implica abrir ambos archivos y compararlos visualmente. Aunque simple, este enfoque es:

*Pros:*
- No requiere herramientas o configuración
- Funciona con cualquier formato de hoja de cálculo
- Control completo sobre lo que examinas

*Contras:*
- Extremadamente lento para archivos con más de unas pocas docenas de filas
- Alta tasa de error—fácil pasar por alto diferencias
- Sin seguimiento sistemático de cambios
- Imposible para conjuntos de datos grandes

**Mejor para:** Archivos muy pequeños (menos de 50 filas) con cambios mínimos esperados.

**2. Funciones Integradas de Excel**

Microsoft Excel ofrece varias capacidades de comparación:

*Comparar Hojas de Cálculo (Complemento Inquire):*
Disponible en Excel 2013+ y Microsoft 365. Proporciona comparación completa de libros con informes detallados de cambios.

Pasos:
1. Archivo → Opciones → Complementos
2. Administrar: Complementos COM → Ir
3. Habilitar Inquire
4. Pestaña Inquire → Comparar Archivos

*Pros:*
- Integrado en Excel
- Comparación completa incluyendo fórmulas, formato y macros
- Genera informes detallados

*Contras:*
- Solo disponible en ciertas versiones de Excel (no en Excel para Mac)
- Requiere instalación de Excel
- Puede ser lento con archivos grandes
- Curva de aprendizaje pronunciada
- No adecuado para archivos CSV u ODS

**3. Comparación Basada en Fórmulas (BUSCARV, INDICE/COINCIDIR)**

Puedes usar fórmulas de Excel para encontrar diferencias:

\`\`\`excel
=SI(BUSCARV(A2,Hoja2!A:B,2,FALSO)=B2,"Coincide","Diferente")
\`\`\`

Para comparaciones más complejas:
\`\`\`excel
=SI(CONTAR.SI.CONJUNTO(Hoja2!A:A,A2,Hoja2!B:B,B2)>0,"Coincide","Diferente")
\`\`\`

*Pros:*
- No se necesitan herramientas adicionales
- Altamente personalizable
- Se puede guardar para uso repetido
- Útil para comparaciones de columnas específicas

*Contras:*
- Requiere conocimiento de Excel/fórmulas
- Configuración compleja para muchas columnas
- No resalta diferencias visualmente
- Trabajo manual para identificar cambios exactos
- Problemas de rendimiento con conjuntos de datos grandes

**Mejor para:** Comparaciones de columnas específicas, verificar si valores existen en ambas hojas, análisis puntuales.

**4. Herramientas Diff Dedicadas**

Herramientas diseñadas específicamente para comparación de hojas de cálculo, como DiffSheets, Beyond Compare o WinMerge.

*Pros:*
- Resaltado visual de diferencias con código de color
- Soporte para múltiples formatos de archivo
- Manejo eficiente de archivos grandes
- Algoritmos inteligentes de coincidencia de filas
- Sin configuración o fórmulas requeridas
- Exportación de informes de diferencias

*Contras:*
- Puede requerir instalación (excepto herramientas basadas en web)
- Curva de aprendizaje para funciones avanzadas

**Mejor para:** La mayoría de tareas de comparación, especialmente cuando necesitas ver todas las diferencias rápidamente.

**5. Herramientas de Línea de Comandos y Scripts**

Los desarrolladores a menudo usan herramientas de línea de comandos o escriben scripts personalizados:

\`\`\`python
import pandas as pd

df1 = pd.read_excel('original.xlsx')
df2 = pd.read_excel('modificado.xlsx')
comparacion = df1.compare(df2)
\`\`\`

\`\`\`bash
csvdiff archivo1.csv archivo2.csv --key=id
\`\`\`

*Pros:*
- Totalmente automatizable
- Integración con pipelines CI/CD
- Lógica personalizable
- Capacidades de procesamiento por lotes

*Contras:*
- Requiere conocimientos de programación
- Overhead de configuración
- No visual—salida basada en texto
- Carga de mantenimiento

**Mejor para:** Pruebas automatizadas, integración CI/CD, comparaciones recurrentes.

**6. Sistemas de Control de Versiones (Git)**

Aunque principalmente para código, Git puede rastrear cambios en hojas de cálculo cuando los archivos están en CSV u otros formatos basados en texto.

*Pros:*
- Historial completo de cambios
- Bifurcación y fusión
- Funciones de colaboración

*Contras:*
- No diseñado para formatos binarios (XLSX)
- Visualización de diff pobre para hojas de cálculo
- Curva de aprendizaje significativa
- Requiere convertir Excel a CSV

**Mejor para:** Formatos basados en texto (CSV, TSV) en flujos de trabajo de desarrollo.`,
      },
      {
        id: "types",
        heading: "Tipos de Diferencias",
        content: `Entender los diferentes tipos de cambios que pueden ocurrir en hojas de cálculo te ayuda a interpretar los resultados de comparación con precisión.

**1. Cambios en Valores de Celda**

El tipo de diferencia más común—cuando el valor de una celda cambia de una versión a otra.

Ejemplos:
- "1000" se convierte en "1500"
- "Pendiente" se convierte en "Aprobado"
- "Juan Pérez" se convierte en "Juan P. Pérez"

Estos cambios generalmente se resaltan en amarillo o naranja por las herramientas de comparación. Representan modificaciones a datos existentes.

**Importancia:** Crítico para rastrear actualizaciones de datos, correcciones o revisiones.

**2. Adiciones de Filas**

Cuando aparecen nuevas filas en la versión modificada que no existen en el original.

Típicamente se muestran en verde. Representa nuevos registros, entradas o puntos de datos.

**Causas comunes:**
- Nuevas transacciones o entradas
- Resultados de pruebas adicionales
- Conjuntos de datos expandidos
- Nuevos artículos de inventario

**Desafíos de detección:** Las herramientas deben determinar si una fila es verdaderamente nueva o solo se movió. Aquí es donde la coincidencia de columna clave se vuelve importante.

**3. Eliminaciones de Filas**

Cuando filas presentes en el original faltan en la versión modificada.

Generalmente resaltadas en rojo. Indica registros eliminados o datos filtrados.

**Causas comunes:**
- Registros eliminados
- Limpieza de datos
- Vistas filtradas exportadas como nuevos archivos
- Entradas archivadas

**Consideración importante:** Asegúrate de que las eliminaciones sean intencionales, no pérdida de datos.

**4. Reordenamiento de Filas**

Cuando las mismas filas existen en ambos archivos pero en diferente orden.

**La detección depende del método de comparación:**
- Basado en posición: Muestra todas las filas como diferentes
- Basado en columna clave: Identifica correctamente como mismas filas, posición diferente
- Algoritmo LCS: Maneja inteligentemente el reordenamiento

Por esto es importante elegir el algoritmo de comparación correcto.

**5. Cambios de Columna**

Cambios estructurales en la hoja de cálculo misma:

**Adiciones de columna:** Nuevas columnas en la versión modificada
**Eliminaciones de columna:** Columnas eliminadas del original
**Reordenamiento de columna:** Mismas columnas, secuencia diferente
**Renombrado de columna:** Cambios de encabezado (si tienes filas de encabezado)

**Impacto:** Puede hacer que la comparación automatizada sea desafiante si no se maneja adecuadamente.

**6. Cambios de Formato**

Cambios en el formato de celda en lugar del contenido:
- Cambios de fuente
- Cambios de color
- Formato de números (aunque esto puede afectar valores: "1000" vs "1,000")
- Bordes de celda y alineación

**Nota:** La mayoría de herramientas de comparación se enfocan en contenido, no en formato. Comparar Hojas de Cálculo de Excel incluye diferencias de formato.

**7. Cambios de Fórmula**

Cuando la fórmula en una celda cambia, incluso si el resultado permanece igual.

Ejemplo: \`=A1+B1\` se convierte en \`=SUMA(A1:B1)\`

**Importante para:** Entender cambios de lógica de cálculo, no solo resultados.

**8. Diferencias de Espacios en Blanco y Mayúsculas**

Diferencias sutiles que pueden o no ser significativas:
- Espacios iniciales/finales: "valor" vs "valor "
- Cambios de mayúsculas: "TOTAL" vs "Total"
- Saltos de línea dentro de celdas

**Manejo:** Muchas herramientas ofrecen opciones para ignorar estas diferencias.

**9. Cambios de Tipo de Datos**

Cuando el mismo valor lógico se representa de manera diferente:
- "100" (texto) vs 100 (número)
- Formato de fecha: "15/01/2025" vs "2025-01-15"
- Booleano: "VERDADERO" vs "Sí" vs 1

**Desafío:** Estos pueden parecer idénticos visualmente pero son técnicamente diferentes.

**10. Vacío vs. Nulo vs. Cero**

Distinción importante en análisis de datos:
- Celda vacía (sin valor)
- Nulo o NA
- Cero o cadena vacía

Cada uno tiene diferente significado y puede ser manejado de manera diferente por las herramientas de comparación.`,
      },
      {
        id: "bestPractices",
        heading: "Mejores Prácticas para Comparación de Hojas de Cálculo",
        content: `Sigue estas estrategias probadas para hacer la comparación de hojas de cálculo más efectiva y precisa.

**1. Prepara tus Archivos Antes de Comparar**

**Formato consistente:** Asegúrate de que ambos archivos usen el mismo formato de fecha, formato de número y codificación
**Elimina hojas innecesarias:** Compara solo hojas de trabajo relevantes
**Verifica la codificación:** UTF-8 es recomendado para archivos CSV
**Verifica filas/columnas ocultas:** Muéstralas o exclúyelas consistentemente
**Estandariza encabezados:** Asegúrate de que los encabezados de columna coincidan exactamente

**2. Elige la Columna Clave Correcta**

Cuando uses coincidencia de columna clave (el método de comparación más poderoso), selecciona una columna que:

- Contenga valores únicos (como ID, SKU, correo electrónico)
- Exista en ambos archivos
- Tenga formato consistente
- No contenga duplicados
- No sea propensa a errores tipográficos

**Buenas columnas clave:** ID de Empleado, SKU de Producto, ID de Transacción, Dirección de Correo
**Malas columnas clave:** Nombres (duplicados), Descripciones (errores), Fechas (no únicas)

**3. Comienza con Comparaciones de Prueba Pequeñas**

Antes de comparar archivos grandes:
- Prueba con las primeras 100 filas
- Verifica que el método de comparación produzca resultados esperados
- Ajusta la configuración según sea necesario
- Luego ejecuta la comparación completa

Esto ahorra tiempo y te ayuda a ajustar la configuración correcta.

**4. Usa Algoritmos de Comparación Apropiados**

**Coincidencia basada en posición** cuando:
- Los archivos tienen el mismo orden de filas
- Estás comparando datos secuenciales
- Las filas no tienen identificador único

**Coincidencia de columna clave** cuando:
- Las filas pueden estar reordenadas
- Cada fila tiene un identificador único
- Estás comparando bases de datos o datos transaccionales

**LCS (Subsecuencia Común Más Larga)** cuando:
- Las filas están significativamente reordenadas
- Quieres la coincidencia más inteligente
- El rendimiento no es crítico (más lento para archivos muy grandes)

**5. Maneja Archivos Grandes Estratégicamente**

Para archivos con 100,000+ filas:

- Usa herramientas con scroll virtual (como DiffSheets)
- Considera dividir archivos en trozos más pequeños
- Compara columna por columna si es necesario
- Usa herramientas de línea de comandos para automatización
- Aumenta la memoria disponible
- Filtra a datos relevantes antes de comparar

**6. Documenta tu Proceso de Comparación**

**Registra:**
- Qué archivos se compararon
- Qué configuración de comparación se usó
- Fecha y hora de comparación
- Quién realizó la comparación
- Resumen de hallazgos

Esto crea un rastro de auditoría y ayuda a otros a entender tu proceso.

**7. Valida los Resultados**

No confíes ciegamente en los resultados de comparación:
- Verifica una muestra de diferencias
- Verifica que "sin diferencias" sea correcto
- Verifica casos extremos (primera fila, última fila)
- Confirma que la herramienta maneje tus tipos de datos correctamente

**8. Elige Filtros de Diferencia Apropiados**

Muchas herramientas te permiten:
- Ignorar diferencias de espacios en blanco
- Ignorar diferencias de mayúsculas
- Ocultar filas/columnas sin cambios
- Filtrar por tipo de diferencia

Usa estos filtros para enfocarte en cambios significativos.

**9. Exporta y Comparte Resultados**

Crea informes que:
- Resalten todas las diferencias claramente
- Incluyan contexto (datos circundantes)
- Sean compartibles con interesados
- Puedan archivarse para referencia futura

**10. Prioriza Privacidad y Seguridad**

Cuando compares datos sensibles:
- Usa herramientas del lado del cliente (como DiffSheets) donde los datos nunca salen de tu computadora
- Evita subir archivos a servidores desconocidos
- Verifica políticas de privacidad de herramientas
- Usa conexiones encriptadas (HTTPS)
- Elimina resultados de comparación de sistemas compartidos

**11. Automatiza Comparaciones Recurrentes**

Si comparas los mismos archivos regularmente:
- Escribe scripts para automatizar el proceso
- Configura comparaciones programadas
- Crea informes estandarizados
- Implementa alertas para cambios inesperados

**12. Prueba tu Respaldo y Recuperación**

Antes de hacer cambios basados en resultados de comparación:
- Respalda archivos originales
- Prueba cambios en copias
- Verifica resultados
- Solo entonces aplica a datos de producción

**13. Errores Comunes a Evitar**

**No:**
- Compares diferentes subconjuntos de datos y esperes coincidencia
- Ignores diferencias de tipo de datos
- Asumas que tamaños de archivo idénticos significan contenido idéntico
- Omitas validación de cambios críticos
- Uses coincidencia basada en posición en datos reordenados
- Olvides verificar todas las hojas en libros multi-hoja

**14. Optimiza para tu Caso de Uso**

**Auditoría financiera:** Enfócate en precisión numérica, rastrea cambios de fórmula
**Migración de datos:** Verifica conteos de filas, verifica cambios de tipo de datos
**Colaboración:** Rastrea quién hizo qué cambios, revisa todas las modificaciones
**Control de calidad:** Compara contra resultados esperados, automatiza comparaciones

**15. Mantén las Herramientas Actualizadas**

Asegúrate de que tus herramientas de comparación:
- Soporten los últimos formatos de archivo
- Tengan las últimas correcciones de errores
- Incluyan actualizaciones de seguridad
- Ofrezcan rendimiento mejorado`,
      },
      {
        id: "tools",
        heading: "Herramientas de Comparación de Hojas de Cálculo",
        content: `Una comparación completa de herramientas disponibles para comparación de hojas de cálculo.

**DiffSheets (Recomendado)**

**Tipo:** Aplicación basada en web
**Precio:** Gratis
**Plataforma:** Cualquier navegador

**Características:**
- Procesamiento 100% del lado del cliente (datos nunca subidos)
- Soporta XLSX, XLS, CSV, ODS
- Múltiples algoritmos de comparación (posición, columna clave, LCS)
- Vista diff visual lado a lado
- Scroll virtual para archivos grandes
- Diferencias codificadas por color
- Sin instalación requerida
- Sin registro requerido

**Pros:**
- Privacidad completa—archivos nunca salen de tu navegador
- Gratis sin límites
- Fácil de usar—sin curva de aprendizaje
- Rendimiento rápido
- Soporte multi-formato
- Funciona en cualquier sistema operativo

**Contras:**
- Requiere acceso a internet (aunque no se suben datos)
- Limitado a comparar dos archivos a la vez

**Mejor para:** La mayoría de usuarios, especialmente aquellos que priorizan privacidad, facilidad de uso y velocidad.

**Pruébalo:** Visita diffsheets.com

---

**Comparar Hojas de Cálculo de Microsoft Excel**

**Tipo:** Aplicación de escritorio (solo Windows)
**Precio:** Incluido con Microsoft 365 u Office Professional Plus
**Plataforma:** Windows

**Características:**
- Comparación completa de libros
- Comparación de fórmulas
- Comparación de formato
- Comparación de macros VBA
- Informes detallados
- Exportar a Excel

**Pros:**
- Integración profunda con Excel
- Compara fórmulas y formato
- Informes detallados de cambios
- Sin límites de tamaño de archivo

**Contras:**
- Solo Windows (no disponible en Mac)
- Requiere versiones específicas de Excel
- Curva de aprendizaje pronunciada
- Lento con archivos grandes
- No adecuado para CSV u ODS

**Mejor para:** Usuarios de Windows con Microsoft 365 que necesitan análisis detallado específico de Excel.

---

**Beyond Compare**

**Tipo:** Aplicación de escritorio
**Precio:** $60 (compra única)
**Plataforma:** Windows, macOS, Linux

**Características:**
- Comparación lado a lado
- Fusión de tres vías
- Comparación de carpetas
- Resaltado de sintaxis
- Soporte de scripting
- Soporte de múltiples formatos de archivo

**Pros:**
- Potente y rico en características
- Soporta muchos tipos de archivo más allá de hojas de cálculo
- Excelente para desarrolladores
- Scriptable para automatización

**Contras:**
- Software de pago
- Curva de aprendizaje más pronunciada
- No especializado para hojas de cálculo
- Trata hojas de cálculo como texto (conciencia de estructura limitada)

**Mejor para:** Usuarios avanzados y desarrolladores que necesitan una herramienta de comparación multipropósito.

---

**WinMerge**

**Tipo:** Aplicación de escritorio
**Precio:** Gratis (código abierto)
**Plataforma:** Windows

**Características:**
- Diferenciación y fusión visual
- Comparación de carpetas
- Resaltado de sintaxis
- Soporte de plugins
- Generar archivos de parche

**Pros:**
- Gratis y de código abierto
- Ligero
- Rápido
- Soporta plugins para comparación de Excel

**Contras:**
- Solo Windows
- Requiere plugin para soporte adecuado de Excel
- Características limitadas específicas de hojas de cálculo
- Comparación basada en texto (no consciente de estructura)

**Mejor para:** Usuarios de Windows que quieren una opción gratuita y de código abierto para comparaciones ocasionales.

---

**Comparar Hojas de Cálculo (XL-Connector)**

**Tipo:** Complemento de Excel
**Precio:** Versión gratuita disponible, versión Pro $49/año
**Plataforma:** Windows, macOS

**Características:**
- Comparar hojas dentro de Excel
- Resaltar diferencias
- Fusionar cambios
- Múltiples modos de comparación

**Pros:**
- Funciona dentro de Excel
- Interfaz intuitiva
- Bueno para usuarios avanzados de Excel

**Contras:**
- Requiere instalación de Excel
- Versión gratuita limitada
- Suscripción anual para características Pro

**Mejor para:** Usuarios de Excel que quieren quedarse dentro del entorno Excel.

---

**Historial de Versiones de Google Sheets**

**Tipo:** Basado en web (Google Sheets)
**Precio:** Gratis
**Plataforma:** Cualquier navegador

**Características:**
- Rastrear cambios a lo largo del tiempo
- Ver versiones anteriores
- Ver quién hizo cambios
- Restaurar versiones antiguas

**Pros:**
- Gratis
- Integrado en Google Sheets
- Fácil de usar
- Rastrea quién hizo cambios

**Contras:**
- Solo funciona con archivos de Google Sheets
- Muestra cambios secuenciales, no comparación lado a lado
- Limitado a archivos en Google Drive
- Requiere que archivos estén en formato Google Sheets

**Mejor para:** Equipos colaborando en Google Sheets que quieren rastrear cambios a lo largo del tiempo.

---

**csvdiff (Línea de Comandos)**

**Tipo:** Herramienta de línea de comandos
**Precio:** Gratis (código abierto)
**Plataforma:** Cualquiera (requiere Python)

**Características:**
- Comparación rápida de CSV
- Coincidencia basada en clave
- Salida JSON
- Scriptable

**Pros:**
- Rápido para archivos CSV grandes
- Automatizable
- Simple y enfocado
- Bueno para pipelines CI/CD

**Contras:**
- Solo línea de comandos (sin GUI)
- Solo CSV
- Requiere conocimientos de programación
- Salida de texto (no visual)

**Mejor para:** Desarrolladores automatizando comparaciones de CSV en scripts o pipelines.

---

**Pandas (Biblioteca Python)**

**Tipo:** Biblioteca de programación
**Precio:** Gratis (código abierto)
**Plataforma:** Cualquiera (requiere Python)

**Características:**
- Comparación de datos potente con \`.compare()\`
- Flexible y personalizable
- Puede manejar cualquier formato de hoja de cálculo
- Integración con flujos de trabajo de análisis de datos

**Pros:**
- Extremadamente flexible
- Puede manejar lógica de comparación compleja
- Integración con análisis de datos más amplio
- Gratis y de código abierto

**Contras:**
- Requiere conocimientos de programación Python
- Sin interfaz visual
- Overhead de configuración

**Mejor para:** Científicos de datos y analistas que necesitan lógica de comparación personalizada.

---

**Matriz de Comparación de Herramientas**

| Herramienta | Precio | Plataforma | Privacidad | Facilidad de Uso | Mejor Para |
|-------------|--------|------------|------------|------------------|------------|
| DiffSheets | Gratis | Web | Excelente | Muy Fácil | Mayoría de usuarios |
| Comparar Excel | Incluido | Windows | Buena | Moderada | Usuarios avanzados Excel |
| Beyond Compare | $60 | Todas | Buena | Moderada | Desarrolladores |
| WinMerge | Gratis | Windows | Buena | Moderada | Con presupuesto |
| Google Sheets | Gratis | Web | Aceptable | Fácil | Usuarios Google Sheets |
| csvdiff | Gratis | CLI | Excelente | Difícil | Automatización |
| Pandas | Gratis | Python | Excelente | Difícil | Científicos de datos |

**Recomendación:**

Para la mayoría de usuarios, **DiffSheets** ofrece el mejor balance de características, facilidad de uso y privacidad. Es gratis, no requiere instalación y mantiene tus datos completamente privados.

Si eres usuario de Windows con Microsoft 365 y necesitas análisis detallado específico de Excel, **Comparar Hojas de Cálculo de Excel** es una opción sólida.

Para desarrolladores construyendo flujos de trabajo automatizados, **csvdiff** o **Pandas** proporcionan la flexibilidad necesaria para scripting e integración.`,
      },
      {
        id: "faq",
        heading: "Preguntas Frecuentes",
        content: `**P: ¿Cuál es la forma más rápida de comparar dos archivos Excel?**

R: Sube ambos archivos a DiffSheets (diffsheets.com), selecciona cualquier columna clave si está disponible, y haz clic en "Encontrar Diferencias". Verás todos los cambios en segundos, resaltados en color.

**P: ¿Puedo comparar archivos Excel sin tener Excel instalado?**

R: Sí. Herramientas basadas en web como DiffSheets funcionan en cualquier navegador y no requieren Excel. Soportan formatos XLSX, XLS, CSV y ODS nativamente.

**P: ¿Cómo comparo dos archivos CSV?**

R: Los archivos CSV se pueden comparar usando DiffSheets, csvdiff (línea de comandos), Excel, o cualquier herramienta diff. Para mejores resultados, asegúrate de que ambos archivos usen el mismo delimitador (coma, punto y coma o tabulador).

**P: ¿Cuál es la diferencia entre comparación basada en posición y basada en clave?**

R: Basada en posición compara fila 1 con fila 1, fila 2 con fila 2, etc. Basada en clave coincide filas por un identificador único (como ID o correo), por lo que el orden de filas no importa. Basada en clave es más precisa cuando las filas pueden estar reordenadas.

**P: ¿Puedo comparar hojas de cálculo con diferentes órdenes de columnas?**

R: Sí, pero es más desafiante. Algunas herramientas pueden coincidir columnas por nombre de encabezado. De lo contrario, puede que necesites reordenar columnas para coincidir antes de comparar.

**P: ¿Cómo manejo hojas de cálculo muy grandes (1 millón+ filas)?**

R: Usa herramientas con scroll virtual (DiffSheets), herramientas de línea de comandos (csvdiff), o bibliotecas de programación (Pandas). También podrías filtrar datos o dividir archivos en trozos más pequeños.

**P: ¿Son seguras las herramientas de comparación online para datos sensibles?**

R: Depende. DiffSheets procesa archivos 100% del lado del cliente en tu navegador—los datos nunca salen de tu computadora. Sin embargo, algunas herramientas online suben archivos a servidores. Siempre verifica la política de privacidad de la herramienta.

**P: ¿Puedo comparar hojas de cálculo y exportar un informe de diferencias?**

R: Sí. La mayoría de herramientas profesionales de comparación ofrecen funciones de exportación. DiffSheets te permite descargar resultados, Comparar Hojas de Cálculo de Excel genera informes detallados, y herramientas de línea de comandos pueden generar salida a archivos.

**P: ¿Qué pasa si mis archivos tienen diferentes números de columnas?**

R: Las herramientas de comparación típicamente mostrarán columnas faltantes como eliminaciones y nuevas columnas como adiciones. Asegúrate de estar comparando las estructuras de datos previstas.

**P: ¿Puedo comparar fórmulas, no solo valores?**

R: Comparar Hojas de Cálculo de Excel puede comparar fórmulas. Sin embargo, la mayoría de otras herramientas comparan valores resultantes. Si necesitas comparación de fórmulas, usa herramientas específicas de Excel.

**P: ¿Cómo comparo solo columnas específicas?**

R: Algunas herramientas permiten selección de columnas. Alternativamente, crea versiones de tus archivos con solo las columnas que quieres comparar.

**P: ¿Cuál es la mejor forma de comparar hojas de cálculo para auditoría financiera?**

R: Usa una herramienta que proporcione comparación numérica precisa y genere informes de auditoría. Comparar Hojas de Cálculo de Excel o DiffSheets funcionan bien. Asegúrate de rastrear quién comparó qué y cuándo.

**P: ¿Puedo automatizar comparaciones de hojas de cálculo?**

R: Sí. Usa herramientas de línea de comandos (csvdiff), scripting con Python/Pandas, o herramientas con interfaces API/CLI. Esto es ideal para comparaciones recurrentes o integración CI/CD.

**P: ¿Qué pasa si necesito comparar más de dos archivos?**

R: La mayoría de herramientas comparan dos archivos a la vez. Para múltiples archivos, compara por pares (Archivo1 vs Archivo2, Archivo2 vs Archivo3) o usa bibliotecas de programación para construir lógica personalizada.

**P: ¿Qué tan precisas son las herramientas de comparación automatizada?**

R: Muy precisas cuando se configuran correctamente. Sin embargo, siempre valida resultados, especialmente para datos críticos. Verifica una muestra de diferencias para asegurar que la herramienta funciona como se espera.

**P: ¿Puedo comparar Google Sheets?**

R: Sí. Exporta Google Sheets a formato XLSX o CSV, luego usa cualquier herramienta de comparación. O usa el historial de versiones integrado de Google Sheets para rastrear cambios a lo largo del tiempo.

**P: ¿Cuál es la diferencia entre diff y merge?**

R: Diff identifica diferencias entre archivos. Merge combina cambios de múltiples archivos en uno. La mayoría de herramientas de hojas de cálculo se enfocan en diff, no en merge.

**P: ¿Cómo elijo qué método de comparación usar?**

R: Si las filas pueden estar reordenadas, usa coincidencia de columna clave. Si se garantiza que el orden de filas es el mismo, basado en posición es más rápido. Cuando no estés seguro, prueba el algoritmo LCS para coincidencia inteligente.

**P: ¿Pueden las herramientas de comparación detectar duplicados?**

R: Algunas pueden, especialmente cuando se usa coincidencia de columna clave. Los duplicados en la columna clave generalmente activan advertencias. Para detección de duplicados dedicada, usa funciones integradas de Excel o escribe fórmulas personalizadas.

**P: ¿Qué pasa si mis hojas de cálculo tienen diferentes formatos de fecha?**

R: Esto puede causar diferencias falsas. Estandariza formatos de fecha antes de comparar, o usa una herramienta que pueda reconocer diferentes representaciones de fecha como equivalentes.`,
      },
      {
        id: "glossary",
        heading: "Glosario de Comparación de Hojas de Cálculo",
        content: `**Algoritmo:** El método usado para coincidir y comparar filas. Algoritmos comunes incluyen basado en posición, coincidencia de columna clave y LCS (Subsecuencia Común Más Larga).

**Celda:** La intersección de una fila y columna en una hoja de cálculo donde se almacena un solo valor.

**Procesamiento del Lado del Cliente:** Cuando una aplicación web procesa datos en tu navegador en lugar de subirlos a un servidor. Asegura privacidad.

**CSV (Valores Separados por Comas):** Un formato simple de hoja de cálculo basado en texto donde los valores están separados por comas. Ampliamente compatible pero carece de formato.

**Delta:** El conjunto de diferencias entre dos versiones de un archivo. También llamado "diff."

**Diff:** Abreviatura de "diferencia." Una comparación que muestra qué ha cambiado entre dos archivos.

**Columna Clave:** Una columna que contiene identificadores únicos usados para coincidir filas entre dos hojas de cálculo, independientemente del orden de filas.

**LCS (Subsecuencia Común Más Larga):** Un algoritmo para encontrar la secuencia más larga de filas coincidentes entre dos archivos. Útil para detectar reordenamiento.

**Merge:** Combinar cambios de múltiples versiones de archivo en un solo archivo. Más complejo que simple comparación.

**ODS (Hoja de Cálculo OpenDocument):** Un formato de hoja de cálculo de código abierto usado por LibreOffice y OpenOffice.

**Coincidencia Basada en Posición:** Comparar fila 1 con fila 1, fila 2 con fila 2, etc., basado únicamente en la posición de fila.

**Fila:** Una línea horizontal de celdas en una hoja de cálculo, típicamente representando un solo registro o punto de datos.

**Esquema:** La estructura de una hoja de cálculo, incluyendo nombres de columnas, orden y tipos de datos.

**Vista Lado a Lado:** Una visualización de comparación que muestra ambos archivos uno al lado del otro con diferencias resaltadas.

**Comparación de Tres Vías:** Comparar tres versiones de un archivo (base, versión 1, versión 2) para entender cambios divergentes.

**Vista Unificada:** Una visualización de comparación que muestra ambos archivos fusionados en una sola vista con adiciones y eliminaciones marcadas.

**Scroll Virtual:** Una técnica para mostrar conjuntos de datos grandes renderizando solo filas visibles, mejorando el rendimiento.

**XLSX:** El formato moderno de archivo Excel, introducido en Excel 2007. Usa compresión XML y ZIP.

**XLS:** El formato legacy de archivo Excel usado antes de 2007. Formato binario con capacidad limitada de filas (65,536 filas).`,
      },
    ],
  },
};

export default async function SpreadsheetComparisonGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "guide.spreadsheetComparison" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const content = guideContent[locale as "en" | "es"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Back Link */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                {tCommon("backToHome")}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-12">
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">{t("h1")}</h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">{t("subtitle")}</p>
            <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("readTime")}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {locale === "es" ? "Guía Completa" : "Complete Guide"}
              </span>
            </div>
          </header>

          {/* Table of Contents */}
          <nav className="mb-12 rounded-xl border bg-card p-6">
            <h2 className="mb-4 font-semibold text-lg">{t("toc")}</h2>
            <ol className="space-y-2 text-sm">
              {content.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {index + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Content Sections */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-16 scroll-mt-20">
                <h2 className="font-bold text-3xl">{section.heading}</h2>
                <div className="mt-6 space-y-4 text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Internal Links Section */}
          <div className="my-16 rounded-xl border bg-muted/50 p-8">
            <h3 className="mb-4 font-semibold text-xl">
              {locale === "es" ? "Recursos Relacionados" : "Related Resources"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/compare-excel-files"
                  className="text-primary transition-colors hover:underline"
                >
                  {locale === "es"
                    ? "Comparar Archivos Excel Online"
                    : "Compare Excel Files Online"}
                </Link>
              </li>
              <li>
                <Link href="/csv-diff" className="text-primary transition-colors hover:underline">
                  {locale === "es" ? "Comparar Archivos CSV" : "CSV Diff Tool"}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/how-to-compare-excel"
                  className="text-primary transition-colors hover:underline"
                >
                  {locale === "es"
                    ? "Cómo Comparar Dos Archivos Excel: 5 Métodos Fáciles"
                    : "How to Compare Two Excel Files: 5 Easy Methods"}
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 text-center">
            <h3 className="font-semibold text-2xl">{t("cta")}</h3>
            <p className="mt-2 text-muted-foreground">
              {locale === "es"
                ? "Compara tus hojas de cálculo en segundos con nuestra herramienta gratuita. Sin instalación, 100% privado."
                : "Compare your spreadsheets in seconds with our free tool. No installation, 100% private."}
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/compare">{t("ctaButton")}</Link>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
