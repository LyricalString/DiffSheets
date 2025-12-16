# Plan: Reparación de Archivos Excel

Funcionalidad para recuperar datos de archivos Excel corruptos.

## Objetivo

Permitir a los usuarios subir archivos Excel corruptos e intentar recuperar los datos mediante múltiples estrategias de reparación client-side.

## Investigación: Capacidades de la Librería xlsx

### Hallazgos

**Capacidades actuales de SheetJS (xlsx):**
- Tolerancia a errores incorporada - puede leer archivos parcialmente dañados
- Opción `WTF: true` para modo de depuración
- Soporta lectura de archivos con estructura XML dañada parcialmente
- Detecta automáticamente el formato

**Limitaciones:**
- No tiene API explícita para "reparación"
- Cuando falla, falla completamente - no hay "recuperación parcial"
- Archivos severamente corruptos (ZIP dañado) no pueden procesarse

### Estructura de XLSX

Un archivo XLSX es un ZIP que contiene:
```
[Content_Types].xml     # Tipos de contenido
_rels/.rels             # Relaciones raíz
xl/workbook.xml         # Metadatos del libro
xl/worksheets/sheet*.xml # Datos de hojas
xl/sharedStrings.xml    # Strings compartidos
xl/styles.xml           # Estilos
```

## Estrategias de Reparación

### Estrategia 1: xlsx con opciones permisivas (Bajo Esfuerzo)

```typescript
const repairAttempts = [
  { type: "array", cellDates: true },
  { type: "array", cellDates: false, raw: true },
  { type: "array", sheetStubs: true, defval: "" },
  { type: "binary" }, // Modo legacy
];
```

### Estrategia 2: Extracción ZIP con JSZip (Esfuerzo Medio)

```typescript
async function repairWithJSZip(file: ArrayBuffer) {
  const zip = await JSZip.loadAsync(file);
  const recoveredSheets = [];

  // Intentar cada hoja individualmente
  for (const path of zip.file(/xl\/worksheets\/sheet\d+\.xml/)) {
    try {
      const xml = await path.async("string");
      const data = parseSheetXML(xml);
      recoveredSheets.push(data);
    } catch (e) {
      // Marcar como no recuperable
    }
  }

  return buildRecoveredWorkbook(recoveredSheets);
}
```

### Estrategia 3: Extracción XML Raw (Alto Esfuerzo)

- Parser XML tolerante a errores
- Expresiones regulares para extraer datos de XML malformado
- Reconstrucción desde fragmentos

### Estrategia Recomendada

Combinación progresiva:
1. **Primer intento**: xlsx con opciones permisivas
2. **Segundo intento**: JSZip + xlsx por hoja individual
3. **Tercer intento**: Extracción de texto plano de XMLs

## Flujo de Usuario

```
1. Usuario llega a /repair-excel
   └── Ve landing page con beneficios + CTA

2. Sube archivo corrupto
   └── Dropzone acepta el archivo (validación mínima)

3. Fase de Análisis
   ├── Detectar tipo de corrupción
   ├── Mostrar progreso
   └── Intentar estrategias secuencialmente

4. Preview de Recuperación
   ├── Mostrar datos recuperados en grid
   ├── Indicar nivel de éxito
   └── Mostrar qué se perdió

5. Descarga
   ├── GRATIS: Preview completo + CSV (100 filas)
   └── PAGO: XLSX completo sin límites
```

## Arquitectura

### Tipos (`src/types/repair.ts`)

```typescript
export type RepairStrategy = "xlsx-permissive" | "jszip-partial" | "xml-raw";

export interface RepairAttempt {
  strategy: RepairStrategy;
  success: boolean;
  error?: string;
  recoveredData?: ParsedSpreadsheet;
}

export interface RepairResult {
  success: boolean;
  attempts: RepairAttempt[];
  finalData: ParsedSpreadsheet | null;
  statistics: RepairStatistics;
}

export interface RepairStatistics {
  sheetsFound: number;
  sheetsRecovered: number;
  rowsRecovered: number;
  rowsEstimatedTotal: number;
  cellsRecovered: number;
  cellsLost: number;
  formulasRecovered: number;
  confidenceLevel: "high" | "medium" | "low";
}

export interface RepairState {
  file: File | null;
  stage: "idle" | "analyzing" | "extracting" | "repairing" | "complete" | "failed";
  progress: number;
  currentOperation: string;
  result: RepairResult | null;
  error: string | null;

  // Monetización
  isPaid: boolean;
  rowLimit: number; // 100 para gratis, Infinity para pago
}
```

### Store (`src/store/repair-store.ts`)

```typescript
interface RepairStore extends RepairState {
  setFile: (file: File | null) => void;
  startRepair: () => Promise<void>;
  cancelRepair: () => void;
  downloadResult: (format: "csv" | "xlsx") => Promise<void>;
  reset: () => void;
}
```

## Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `src/types/repair.ts` | Tipos TypeScript |
| `src/lib/repair/index.ts` | Orquestador de reparación |
| `src/lib/repair/strategies.ts` | Implementación de estrategias |
| `src/lib/repair/xml-parser.ts` | Parser XML tolerante |
| `src/store/repair-store.ts` | Store Zustand |
| `src/components/repair/index.ts` | Exports |
| `src/components/repair/repair-dropzone.tsx` | Zona de subida |
| `src/components/repair/repair-progress.tsx` | Indicador de progreso |
| `src/components/repair/repair-preview.tsx` | Preview de datos |
| `src/components/repair/repair-summary.tsx` | Resumen de recuperación |
| `src/components/repair/download-section.tsx` | Sección de descarga |
| `src/app/[locale]/repair-excel/page.tsx` | Página principal |
| `src/app/[locale]/repair-xlsx/page.tsx` | Landing SEO |
| `src/app/[locale]/fix-corrupt-excel/page.tsx` | Landing SEO |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/types/index.ts` | Agregar export de repair types |
| `src/app/sitemap.ts` | Agregar 3 rutas de repair |
| `src/components/layout/header.tsx` | Agregar link "Repair" |
| `messages/en.json` | Agregar namespace `repair` |
| `messages/es.json` | Agregar namespace `repair` |
| `package.json` | Agregar jszip |

## Dependencias

```bash
bun add jszip
```

## Componentes UI

### 1. RepairDropzone
- Similar a `FileDropzone` pero single-file
- Sin validación estricta (aceptar archivos "rotos")
- Icono de reparación

### 2. RepairProgress
```typescript
interface RepairProgressProps {
  stage: "analyzing" | "extracting" | "repairing" | "complete" | "failed";
  progress: number; // 0-100
  currentOperation: string;
  onCancel: () => void;
}
```

### 3. RepairPreview
- Grid virtual con `@tanstack/react-virtual`
- Destacar celdas recuperadas vs perdidas
- Selector de hojas recuperadas

### 4. RepairSummary
Estadísticas de recuperación:
- Hojas encontradas / recuperadas
- Filas recuperadas / total estimado
- Celdas con datos / celdas perdidas
- Nivel de confianza (Alto/Medio/Bajo)

### 5. DownloadSection
- Botón CSV (gratis, limitado)
- Botón XLSX (pago completo)
- Indicador de límite de filas

## Monetización

### Modelo Recomendado: Freemium por Archivo

| Tier | Características | Precio |
|------|-----------------|--------|
| **Gratis** | Preview completo + CSV 100 filas | $0 |
| **Pago** | XLSX completo sin límites | $4.99/archivo |

### Implementación de Pago

Opciones:
- **Stripe Checkout** - Pago one-time
- **Lemon Squeezy** - Alternativa con mejor DX
- **Paddle** - Para mercados internacionales

## SEO

### URLs
| URL | Target Keyword |
|-----|----------------|
| `/repair-excel` | repair excel file online free |
| `/repair-xlsx` | repair xlsx file |
| `/fix-corrupt-excel` | fix corrupted excel file |

### Keywords Target
- repair excel file online free
- fix corrupt xlsx file
- recover data from corrupted excel
- excel file repair tool

## Limitaciones Conocidas

| Limitación | Impacto |
|------------|---------|
| Archivos XLS (binario) | Solo via xlsx library, no extracción directa |
| Archivos con password | No recuperables sin contraseña |
| ZIP severamente dañado | No recuperable |
| Macros/VBA | No recuperables (requiere parsear vbaProject.bin) |
| Archivos >50MB | Posibles problemas de memoria en browser |
| Fórmulas complejas | Se recupera texto, no referencias externas |
| Estilos | Recuperación parcial |

## Estimación

| Componente | Complejidad |
|------------|-------------|
| Lógica de reparación básica | Media |
| JSZip + extracción avanzada | Alta |
| UI componentes | Media |
| Landing pages + SEO | Baja |
| Integración de pago | Media |
| Testing + QA | Media |
| **Total** | **~80 horas** |

## Plan de Implementación por Fases

### Fase 1: MVP (1 semana)
- Reparación básica con xlsx options
- UI simple de upload + preview
- Export CSV gratis
- Una landing page

### Fase 2: Reparación Avanzada (1 semana)
- JSZip integration
- Recuperación por hoja
- Progress indicators
- Summary detallado

### Fase 3: Monetización (3-4 días)
- Stripe/Lemon Squeezy setup
- Download gating
- Límite de filas

### Fase 4: SEO y Growth (1 semana)
- Landing pages adicionales
- Blog posts relacionados
- Schema.org
- i18n completo

## Referencias

Archivos existentes a usar como patrón:
- `src/lib/parser/index.ts` - Patrón de lazy-load xlsx
- `src/components/upload/file-dropzone.tsx` - Patrón dropzone
- `src/store/index.ts` - Estructura Zustand store
- `src/components/landing/landing-page.tsx` - Template landing SEO
