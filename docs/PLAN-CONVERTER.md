# Plan: Convertidor de Formatos

Funcionalidad para convertir archivos Excel/CSV a múltiples formatos de salida.

## Objetivo

Permitir a los usuarios convertir archivos de spreadsheet a diferentes formatos:

**Entrada**: xlsx, xls, csv, ods, tsv
**Salida**: JSON, CSV, HTML Table, Markdown Table, PDF

## Flujo de Usuario

```
1. Usuario navega a /convert
2. Sube un archivo (drag & drop o click)
3. Sistema parsea el archivo
4. Si tiene múltiples hojas → selecciona una
5. Selecciona formato de salida
6. Sistema muestra opciones específicas del formato
7. Ajusta opciones (opcional)
8. Click "Convert"
9. Ve preview del resultado
10. Click "Download" para descargar
```

## Arquitectura

### Tipos (`src/types/converter.ts`)

```typescript
export type InputFormat = 'xlsx' | 'xls' | 'csv' | 'ods' | 'tsv';
export type OutputFormat = 'json' | 'csv' | 'html' | 'markdown' | 'pdf';

export interface JsonOptions {
  useHeaders: boolean;           // Usar primera fila como keys
  arrayOfArrays: boolean;        // false = array de objetos, true = array de arrays
  includeEmptyValues: boolean;   // Incluir celdas vacías como null
  dateFormat: 'iso' | 'timestamp' | 'locale';
}

export interface CsvOptions {
  delimiter: ',' | ';' | '\t' | '|';
  quoteChar: '"' | "'";
  includeHeaders: boolean;
  lineEnding: '\n' | '\r\n';
}

export interface HtmlOptions {
  includeStyles: boolean;        // CSS inline
  tableClass: string;            // Clase CSS para la tabla
  zebraStripes: boolean;         // Filas alternadas
  responsive: boolean;           // wrapper responsive
}

export interface MarkdownOptions {
  alignment: 'left' | 'center' | 'right' | 'auto';
  includeRowNumbers: boolean;
}

export interface PdfOptions {
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  fontSize: number;
  includeHeaders: boolean;
  headerBackgroundColor: string;
  zebraStripes: boolean;
}

export interface ConversionResult {
  format: OutputFormat;
  content: string | Blob;        // string para text, Blob para PDF
  filename: string;
  mimeType: string;
  size: number;
}
```

### Store (`src/store/converter-store.ts`)

```typescript
interface ConverterState {
  // Input
  file: File | null;
  parsedData: ParsedSpreadsheet | null;
  selectedSheet: string;
  isLoading: boolean;
  parseError: string | null;

  // Output
  outputFormat: OutputFormat;
  options: ConversionOptions;
  result: ConversionResult | null;
  isConverting: boolean;
  conversionError: string | null;

  // Actions
  setFile: (file: File | null) => void;
  setParsedData: (data: ParsedSpreadsheet | null) => void;
  setSelectedSheet: (sheet: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setOptions: (options: Partial<ConversionOptions>) => void;
  convert: () => Promise<void>;
  reset: () => void;
}
```

### Funciones de Conversión (`src/lib/converter/`)

```
src/lib/converter/
  ├── index.ts          # Exports
  ├── to-json.ts        # convertToJson()
  ├── to-csv.ts         # convertToCsv()
  ├── to-html.ts        # convertToHtml()
  ├── to-markdown.ts    # convertToMarkdown()
  ├── to-pdf.ts         # convertToPdf() - async, lazy loads jspdf
  └── download.ts       # downloadFile(), getMimeType()
```

## Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `src/types/converter.ts` | Tipos TypeScript |
| `src/lib/converter/index.ts` | Exports |
| `src/lib/converter/to-json.ts` | Conversión a JSON |
| `src/lib/converter/to-csv.ts` | Conversión a CSV |
| `src/lib/converter/to-html.ts` | Conversión a HTML table |
| `src/lib/converter/to-markdown.ts` | Conversión a Markdown |
| `src/lib/converter/to-pdf.ts` | Conversión a PDF |
| `src/lib/converter/download.ts` | Utilidades de descarga |
| `src/store/converter-store.ts` | Store Zustand |
| `src/components/converter/index.ts` | Exports |
| `src/components/converter/converter-tool.tsx` | Componente principal |
| `src/components/converter/format-selector.tsx` | Selector de formato |
| `src/components/converter/conversion-options.tsx` | Opciones por formato |
| `src/components/converter/output-preview.tsx` | Preview resultado |
| `src/app/[locale]/convert/page.tsx` | Página principal |
| `src/app/[locale]/convert-excel-to-json/page.tsx` | Landing SEO |
| `src/app/[locale]/convert-excel-to-csv/page.tsx` | Landing SEO |
| `src/app/[locale]/convert-csv-to-json/page.tsx` | Landing SEO |
| `src/app/[locale]/convert-excel-to-pdf/page.tsx` | Landing SEO |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/types/index.ts` | Agregar export de converter types |
| `src/app/sitemap.ts` | Agregar 5 rutas de convert |
| `src/components/layout/header.tsx` | Agregar link "Convert" |
| `messages/en.json` | Agregar namespace `converter` |
| `messages/es.json` | Agregar namespace `converter` |

## Dependencias

```bash
bun add jspdf jspdf-autotable
bun add -d @types/jspdf
```

**Justificación:**
- `jspdf` (~280KB): Librería madura para PDF client-side
- `jspdf-autotable` (~50KB): Plugin para tablas con paginación automática

## Componentes UI

### 1. ConverterTool
Componente principal que orquesta el flujo:
- FileUploader (reutiliza `FileDropzone`)
- SheetSelector (componente existente)
- FormatSelector
- ConversionOptions
- OutputPreview
- DownloadButton

### 2. FormatSelector
```typescript
const formats = [
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
  { value: 'html', label: 'HTML Table', icon: FileCode },
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'pdf', label: 'PDF', icon: FileImage },
];
```

### 3. ConversionOptions
Panel condicional según formato seleccionado:
- JSON: useHeaders, arrayOfArrays, dateFormat
- CSV: delimiter, quoteChar
- HTML: includeStyles, zebraStripes
- Markdown: alignment, rowNumbers
- PDF: pageSize, orientation, fontSize

### 4. OutputPreview
- JSON/CSV/Markdown: `<pre>` con syntax highlighting
- HTML: `<iframe srcDoc={content}>`
- PDF: Mensaje "Preview no disponible" + tamaño

## SEO

### URLs
| Ruta | Target Keyword |
|------|----------------|
| `/convert` | convert spreadsheet online |
| `/convert-excel-to-json` | excel to json converter |
| `/convert-excel-to-csv` | convert xlsx to csv |
| `/convert-csv-to-json` | csv to json online |
| `/convert-excel-to-pdf` | export excel to pdf |

## Estimación

| Componente | Complejidad |
|------------|-------------|
| Tipos TypeScript | Baja |
| Funciones de conversión (4 text) | Media |
| Conversión PDF | Media-Alta |
| Store Zustand | Baja |
| Componente ConverterTool | Media |
| Componentes UI auxiliares | Media |
| Página /convert | Baja |
| Landing pages SEO (4) | Media |
| Traducciones | Baja |
| **Total** | **~47 horas** |

## Consideraciones Técnicas

1. **Lazy Loading de jsPDF**: Cargar solo cuando se selecciona PDF
2. **Preview Performance**: Limitar a 50 líneas con "... and X more"
3. **Encoding CSV**: UTF-8 BOM para compatibilidad con Excel
4. **MIME Types**:
   - JSON: `application/json`
   - CSV: `text/csv`
   - HTML: `text/html`
   - Markdown: `text/markdown`
   - PDF: `application/pdf`

## Referencias

Archivos existentes a usar como patrón:
- `src/lib/parser/index.ts` - Patrón de lazy-load
- `src/components/upload/file-dropzone.tsx` - Patrón dropzone
- `src/components/landing/landing-page.tsx` - Template landing SEO
