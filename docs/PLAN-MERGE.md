# Plan: Merge Excel Files

Funcionalidad para combinar múltiples archivos Excel en uno solo.

## Objetivo

Permitir a los usuarios subir múltiples archivos Excel y combinarlos de 3 formas:

1. **Combine Workbooks**: Cada archivo se convierte en una hoja separada en un único workbook
2. **Append Rows**: Combinar filas de múltiples hojas verticalmente (una debajo de otra)
3. **Append Columns**: Combinar columnas horizontalmente (lado a lado)

## Flujo de Usuario

```
1. Usuario navega a /merge
2. Ve dropzone para subir múltiples archivos
3. Arrastra/selecciona 2+ archivos
4. Por cada archivo:
   - Se parsea automáticamente
   - Se muestra card con info del archivo
   - Puede seleccionar hoja específica
   - Puede reordenar archivos (drag & drop)
5. Selecciona modo de merge
6. Configura opciones según modo
7. Click "Merge Files"
8. Ve preview del resultado
9. Click "Download XLSX" para descargar
```

## Arquitectura

### Tipos (`src/types/merge.ts`)

```typescript
export type MergeMode =
  | "combine-workbooks"  // Cada hoja mantiene su nombre en un workbook
  | "append-rows"        // Combinar filas verticalmente
  | "append-columns";    // Combinar columnas horizontalmente

export interface MergeFileState {
  id: string;                        // UUID único
  file: File | null;
  parsed: ParsedSpreadsheet | null;
  selectedSheet: string;             // Hoja seleccionada para merge
  isLoading: boolean;
  error: string | null;
  order: number;                     // Orden en la lista (para drag & drop)
}

export interface MergeOptions {
  mode: MergeMode;
  includeHeaders: boolean;           // Para append-rows: incluir headers de archivos 2+
  sheetNamingStrategy: "original" | "numbered" | "filename";
  outputFilename: string;
}

export interface MergeResult {
  workbook: import("xlsx").WorkBook;
  preview: MergePreview;
}

export interface MergePreview {
  sheets: Array<{
    name: string;
    rowCount: number;
    columnCount: number;
    sampleRows: Row[];  // Primeras 10 filas para preview
  }>;
  totalSheets: number;
  totalRows: number;
}
```

### Store (`src/store/merge-store.ts`)

```typescript
interface MergeStore {
  // Estado de archivos
  files: MergeFileState[];

  // Opciones
  options: MergeOptions;

  // Resultado
  result: MergeResult | null;
  isProcessing: boolean;
  error: string | null;

  // Acciones - Archivos
  addFile: (file: File) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  setFileSheet: (id: string, sheet: string) => void;
  clearAllFiles: () => void;

  // Acciones - Opciones
  setOptions: (options: Partial<MergeOptions>) => void;
  setMode: (mode: MergeMode) => void;

  // Acciones - Merge
  executeMerge: () => Promise<void>;
  downloadResult: () => Promise<void>;
  reset: () => void;
}
```

### Lógica de Merge (`src/lib/merge/`)

```
src/lib/merge/
  ├── index.ts          # mergeSpreadsheets() - función principal
  └── export.ts         # exportWorkbook() - exportar a XLSX
```

La librería `xlsx` ya incluida soporta:
- `XLSX.utils.book_new()` - Crear workbook vacío
- `XLSX.utils.book_append_sheet()` - Añadir hojas
- `XLSX.utils.aoa_to_sheet()` - Convertir array of arrays a sheet
- `XLSX.write()` - Exportar a buffer

## Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `src/types/merge.ts` | Tipos TypeScript |
| `src/lib/merge/index.ts` | Lógica principal de merge |
| `src/lib/merge/export.ts` | Exportación a XLSX |
| `src/store/merge-store.ts` | Store Zustand |
| `src/components/merge/index.ts` | Exports |
| `src/components/merge/merge-uploader.tsx` | Componente principal |
| `src/components/merge/multi-file-dropzone.tsx` | Dropzone multi-archivo |
| `src/components/merge/merge-file-card.tsx` | Card de archivo |
| `src/components/merge/file-list.tsx` | Lista con drag & drop |
| `src/components/merge/merge-options.tsx` | Opciones de merge |
| `src/components/merge/merge-preview.tsx` | Preview del resultado |
| `src/components/merge/merge-result.tsx` | Resultado y download |
| `src/components/landing/dynamic-merge.tsx` | Lazy loader |
| `src/app/[locale]/merge/page.tsx` | Página del tool |
| `src/app/[locale]/merge-excel-files/page.tsx` | Landing page SEO |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/types/index.ts` | Agregar export de merge types |
| `src/app/sitemap.ts` | Agregar rutas /merge y /merge-excel-files |
| `src/components/layout/header.tsx` | Agregar link a Merge en nav |
| `messages/en.json` | Agregar traducciones merge |
| `messages/es.json` | Agregar traducciones merge |

## Dependencias

```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Componentes UI

### 1. MultiFileDropzone
- Basado en `FileDropzone` existente
- Acepta múltiples archivos
- Muestra contador de archivos

### 2. MergeFileCard
- Card individual por archivo
- Selector de hoja
- Handle de drag para reordenar
- Botón eliminar

### 3. FileList
- Lista vertical con drag & drop
- Usa `@dnd-kit/sortable`
- Indicadores visuales del orden

### 4. MergeOptions
- Radio group para modo de merge
- Checkbox "incluir headers" (solo append-rows)
- Selector de estrategia de nombrado
- Input para nombre del archivo

### 5. MergePreview
- Reutiliza `SpreadsheetPreview` existente
- Tabs para navegar entre hojas
- Estadísticas: total filas, columnas, hojas

### 6. MergeResult
- Resumen del merge completado
- Botón "Download XLSX"
- Opción "New Merge"

## SEO

### URLs
- `/merge` - Herramienta principal
- `/merge-excel-files` - Landing page SEO

### Keywords Target
- merge excel files online
- combine excel spreadsheets
- merge xlsx files free
- combinar archivos excel

## Estimación

| Tarea | Complejidad |
|-------|-------------|
| Types e interfaces | Baja |
| Lógica de merge | Media |
| Store Zustand | Media |
| Componentes UI | Alta |
| Drag & drop | Media |
| Landing page | Baja |
| i18n (en/es) | Baja |
| **Total** | **~25 horas** |

## Referencias

Archivos existentes a usar como patrón:
- `src/lib/parser/index.ts` - Lazy-load xlsx, parseSpreadsheet()
- `src/store/index.ts` - Estructura Zustand store
- `src/components/upload/file-dropzone.tsx` - Patrón dropzone
- `src/components/landing/landing-page.tsx` - Template landing SEO
