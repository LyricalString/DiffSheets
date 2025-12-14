# DiffSheets SEO Roadmap

> Plan estratégico para posicionar DiffSheets como el #1 en búsquedas de comparación de Excel/CSV.

## Estado Actual

### Implementado ✅

| Elemento | Estado | URL |
|----------|--------|-----|
| SEO Técnico | ✅ Completo | - |
| Meta tags localizados (EN/ES) | ✅ | Todas las páginas |
| Hreflang tags | ✅ | Todas las páginas |
| JSON-LD (5 schemas) | ✅ | WebApp, Org, FAQ, HowTo, Breadcrumb |
| Sitemap dinámico | ✅ | /sitemap.xml |
| OG Image dinámico | ✅ | /og?locale=en |
| Landing: Compare Excel | ✅ | /[locale]/compare-excel-files |
| Landing: CSV Diff | ✅ | /[locale]/csv-diff |
| Blog con 2 artículos | ✅ | /[locale]/blog |
| FAQ visible en home | ✅ | /[locale] |

### Métricas Base (Diciembre 2025)

- **Páginas indexadas:** 13
- **Keywords rankeando:** Por medir (esperar 2-4 semanas)
- **Backlinks:** 0 (nuevo dominio)

---

## Fase 1: Quick Wins (Semana 1-2)

### 1.1 Landing Pages por Formato de Archivo

**Objetivo:** Capturar búsquedas específicas por tipo de archivo con baja competencia.

#### Páginas a crear:

```
/[locale]/xlsx-compare
/[locale]/xls-diff
/[locale]/ods-compare
```

#### Especificaciones:

| Página | Title (EN) | Title (ES) | H1 |
|--------|-----------|------------|-----|
| xlsx-compare | Compare XLSX Files Online Free | Comparar Archivos XLSX Online Gratis | Compare XLSX Files Online |
| xls-diff | XLS File Comparison Tool | Herramienta Comparar XLS | Compare XLS Files Online |
| ods-compare | Compare ODS Spreadsheets | Comparar Hojas ODS | Compare ODS Files Online |

#### Keywords Target:

| Página | Primary Keyword | Secondary Keywords |
|--------|----------------|-------------------|
| xlsx-compare | compare xlsx files | xlsx diff, xlsx compare online, compare two xlsx |
| xls-diff | compare xls files | xls diff tool, xls file comparison |
| ods-compare | compare ods files | libreoffice compare, ods diff |

#### Contenido mínimo por página:
- Hero section con H1 y CTA
- 4 benefits cards
- 4 use cases
- CTA final
- ~500-800 palabras

#### Implementación:

```typescript
// Reutilizar componente LandingPage existente
// Añadir tipo "xlsx" | "xls" | "ods" al LandingPage component
// Crear traducciones en messages/en.json y messages/es.json
```

---

### 1.2 Artículos de Blog Adicionales

**Objetivo:** Capturar tráfico informacional y establecer autoridad.

#### Artículo 1: "Free Excel Diff Tools 2025"

```
Slug: /blog/free-excel-diff-tools-2025
Target: "free excel diff tool", "excel compare tool free"
Intención: Comparativa (muy transaccional)
Palabras: 1500-2000
```

**Estructura:**
1. Introducción - Por qué necesitas una herramienta de diff
2. Criterios de evaluación
3. Top 5 herramientas gratuitas:
   - DiffSheets (destacado)
   - Beyond Compare (trial)
   - WinMerge
   - Excel built-in (Inquire)
   - Google Sheets version history
4. Tabla comparativa
5. Conclusión con CTA a DiffSheets

#### Artículo 2: "Compare Excel Without Opening Excel"

```
Slug: /blog/compare-excel-without-excel
Target: "compare excel files without excel"
Intención: Solución a problema específico
Palabras: 1000-1500
```

**Estructura:**
1. El problema: No tienes Excel instalado
2. Soluciones online (DiffSheets destacado)
3. Soluciones de línea de comandos
4. Conclusión

#### Artículo 3: "Find Duplicates Between Two Excel Files"

```
Slug: /blog/find-duplicates-two-excel-files
Target: "find duplicates between two excel files"
Intención: Tutorial práctico
Palabras: 1200-1500
```

---

## Fase 2: Autoridad y Backlinks (Semana 3-4)

### 2.1 Páginas "Alternativa a"

**Objetivo:** Capturar usuarios buscando alternativas a herramientas de pago.

#### Páginas a crear:

```
/[locale]/alternative/beyond-compare
/[locale]/alternative/spreadsheet-compare
/[locale]/alternative/excel-compare-tool
```

#### Contenido:
- Análisis honesto de la herramienta original
- Por qué DiffSheets es mejor alternativa
- Tabla comparativa de features
- FAQ específico

#### Keywords:
- "beyond compare alternative free"
- "spreadsheet compare alternative"
- "free alternative to [tool]"

---

### 2.2 Link Building Inicial

#### Directorios (hacer en semana 2-3):

| Directorio | URL | Prioridad |
|------------|-----|-----------|
| AlternativeTo | alternativeto.net | Alta |
| Product Hunt | producthunt.com | Alta |
| Hacker News (Show HN) | news.ycombinator.com | Alta |
| GitHub Awesome Lists | github.com/topics | Media |
| SaaSHub | saashub.com | Media |
| dev.to | dev.to | Media |
| Indie Hackers | indiehackers.com | Media |

#### Contenido para compartir:
- Artículo de lanzamiento en dev.to
- Post en Reddit r/excel, r/spreadsheets
- Respuestas en Stack Overflow (donde sea relevante)

---

## Fase 3: Contenido Pillar (Mes 2)

### 3.1 Guía Completa (Pillar Page)

```
URL: /[locale]/guide/spreadsheet-comparison
Palabras: 3000-5000
```

**Estructura:**
1. ¿Qué es la comparación de hojas de cálculo?
2. Métodos de comparación (manual, fórmulas, herramientas)
3. Tipos de diferencias (valores, formato, estructura)
4. Mejores prácticas
5. Herramientas recomendadas
6. FAQ extenso
7. Glosario de términos

**Internal Linking:**
- Link desde esta página a todas las landing pages
- Link desde blog posts a esta guía

---

### 3.2 Páginas por Caso de Uso

```
/[locale]/use-cases/financial-auditing
/[locale]/use-cases/data-migration
/[locale]/use-cases/version-control
/[locale]/use-cases/quality-assurance
```

**Contenido por página:**
- Problema específico del sector
- Cómo DiffSheets lo resuelve
- Ejemplo práctico
- Testimonial (cuando los tengamos)

---

## Fase 4: Expansión (Mes 3+)

### 4.1 Nuevas Features para SEO

| Feature | Nueva URL | Keywords |
|---------|-----------|----------|
| Excel Merge Tool | /merge-excel | merge excel files, combine xlsx |
| Excel to CSV Converter | /convert/excel-to-csv | excel to csv online |
| CSV Validator | /validate-csv | csv validator online |

### 4.2 Contenido Video

- Tutorial en YouTube: "How to Compare Excel Files in 30 Seconds"
- Embed en páginas relevantes
- VideoObject schema

### 4.3 Internacionalización Adicional

Considerar añadir locales:
- Portugués (Brasil) - Mercado grande
- Francés - Europa
- Alemán - Alto poder adquisitivo

---

## Tracking y KPIs

### Herramientas de Monitoreo

| Herramienta | Propósito | Frecuencia |
|-------------|-----------|------------|
| Google Search Console | Rankings, CTR, errores | Diario |
| Google Analytics 4 | Tráfico, conversiones | Diario |
| Ahrefs Webmaster Tools | Backlinks, keywords | Semanal |
| PageSpeed Insights | Core Web Vitals | Mensual |

### KPIs Objetivo (6 meses)

| Métrica | Actual | Objetivo 3m | Objetivo 6m |
|---------|--------|-------------|-------------|
| Páginas indexadas | 13 | 30 | 50 |
| Keywords top 10 | 0 | 10 | 30 |
| Keywords top 100 | 0 | 50 | 150 |
| Tráfico orgánico/mes | 0 | 500 | 2,000 |
| Backlinks | 0 | 20 | 50 |

### Keywords Prioritarios a Trackear

**Inglés:**
- compare excel files
- excel diff
- compare two excel files
- csv compare
- xlsx compare online
- spreadsheet comparison tool

**Español:**
- comparar archivos excel
- comparar excel online
- diferencias entre excel
- comparar csv
- comparar hojas de cálculo

---

## Checklist de Implementación

### Semana 1
- [ ] Crear 3 landing pages de formato (xlsx, xls, ods)
- [ ] Escribir artículo "Free Excel Diff Tools 2025"
- [ ] Registrar en Google Search Console
- [ ] Enviar sitemap a Google

### Semana 2
- [ ] Escribir artículo "Compare Excel Without Excel"
- [ ] Registrar en AlternativeTo
- [ ] Publicar en dev.to
- [ ] Preparar launch de Product Hunt

### Semana 3
- [ ] Crear páginas "Alternativa a"
- [ ] Escribir artículo "Find Duplicates"
- [ ] Lanzar en Product Hunt
- [ ] Compartir en Reddit

### Semana 4
- [ ] Analizar primeros datos de Search Console
- [ ] Optimizar páginas con bajo CTR
- [ ] Responder preguntas en Stack Overflow
- [ ] Planificar contenido del mes 2

---

## Recursos Útiles

### Herramientas Gratuitas
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com)
- [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org)

### Keyword Research
- [Ubersuggest](https://neilpatel.com/ubersuggest/)
- [AnswerThePublic](https://answerthepublic.com)
- [AlsoAsked](https://alsoasked.com)
- [Google Trends](https://trends.google.com)

### Competidores a Monitorear
- Beyond Compare
- WinMerge
- Spreadsheet Compare (Microsoft)
- Diffchecker

---

## Notas Finales

### Principios SEO para DiffSheets

1. **Privacidad como USP** - Siempre destacar que los datos no salen del navegador
2. **Gratis sin trucos** - No hay planes de pago ocultos
3. **Velocidad** - Demostrar que es más rápido que alternativas
4. **Simplicidad** - No requiere instalación ni registro

### Errores a Evitar

- ❌ No crear contenido thin/duplicado
- ❌ No usar técnicas black hat (keyword stuffing, links comprados)
- ❌ No ignorar la versión española (mercado menos competido)
- ❌ No olvidar actualizar el sitemap al añadir páginas

---

*Última actualización: Diciembre 2025*
*Próxima revisión: Enero 2025*
