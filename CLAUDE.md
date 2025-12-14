# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start dev server on port 3300
bun build        # Production build
```

## Architecture Overview

DiffSheets is a client-side spreadsheet comparison tool. All file processing happens in the browser - no server uploads.

### Data Flow

1. **File Upload** → `src/lib/parser/index.ts` parses xlsx/csv/ods using the `xlsx` library
2. **State Management** → `src/store/index.ts` (Zustand) holds parsed spreadsheets and diff results
3. **Diff Computation** → `src/lib/diff/` compares sheets when both files are loaded
4. **Rendering** → `src/components/diff/` displays results with virtual scrolling

### Diff Algorithm (`src/lib/diff/`)

- **row-matcher.ts**: Three row alignment strategies:
  - `position`: Simple 1:1 index mapping
  - `key-column`: Match rows by a key column value
  - `lcs`: Myers' diff algorithm for best alignment
- **cell-diff.ts**: Cell-level comparison with inline text diffs
- **index.ts**: Main `computeSpreadsheetDiff()` orchestrates the pipeline

### Type System (`src/types/`)

- **spreadsheet.ts**: `Cell`, `Row`, `SheetData`, `ParsedSpreadsheet`
- **diff.ts**: `DiffCell`, `DiffRow`, `DiffResult`, `ComparisonOptions`

### Component Structure

- **brand/**: Logo component with icon and full wordmark variants
- **upload/**: File dropzone, sheet selector, preview
- **diff/**: Grid views (unified, side-by-side), cell inspector, change navigation
- **layout/**: Header with language/theme controls
- **ui/**: shadcn/ui primitives (button, card, select, etc.)

## Brand System

### Logo

The DiffSheets logo represents the core action of comparing two spreadsheets: two overlapping document sheets with a highlighted intersection zone.

**Usage:**
```tsx
import { Logo, LogoIcon } from "@/components/brand";

// Full logo with wordmark
<Logo iconSize={36} showTagline tagline="Compare spreadsheets" />

// Icon only
<LogoIcon size={48} variant="dark" />  // dark, light, or green
```

**Logo Construction:**
- Back sheet (gray): Original document
- Front sheet (green): Comparison document
- Intersection zone: Where sheets overlap (darker green with opacity)
- Data lines: White bars representing spreadsheet content

### Typography

Three fonts configured in `layout.tsx`:

| Font | Variable | Usage |
|------|----------|-------|
| **Space Grotesk** | `--font-space-grotesk` | Display, headlines, logo text |
| **Inter** | `--font-inter` | Body text, UI elements (default sans) |
| **JetBrains Mono** | `--font-jetbrains-mono` | Code, data, technical content |

**CSS Classes:**
- `font-sans` → Inter (default body)
- `font-mono` → JetBrains Mono
- `font-display` → Space Grotesk (headlines)

### Color Palette

All colors defined as CSS variables in `globals.css`:

**Primary Green (Brand)**
| Token | Hex | Usage |
|-------|-----|-------|
| `--green-400` | `#4ade80` | Hover states, highlights |
| `--green-500` | `#22c55e` | Primary brand color, CTAs |
| `--green-600` | `#16a34a` | Pressed states, darker accents |
| `--green-700` | `#15803d` | Logo intersection |

**Semantic Diff Colors**
| State | Color | Background |
|-------|-------|------------|
| Added | `#22c55e` | `rgba(34, 197, 94, 0.15)` |
| Removed | `#ef4444` | `rgba(239, 68, 68, 0.15)` |
| Changed | `#f59e0b` | `rgba(245, 158, 11, 0.15)` |

**Neutrals (Slate scale)**
- Light mode: White backgrounds with slate-900 text
- Dark mode: slate-950 (#020617) background with slate-50 text
- Cards: slate-800 (#1e293b) in dark mode
- Borders: slate-700 (#334155)

### Brand Variables

```css
/* Use these in components */
--brand-green: var(--green-500);
--brand-green-light: var(--green-400);
--brand-green-dark: var(--green-600);
--brand-glow: rgba(34, 197, 94, 0.25);
--brand-glow-hover: rgba(34, 197, 94, 0.40);

/* Diff states */
--diff-added: #22c55e;
--diff-added-bg: rgba(34, 197, 94, 0.15);
--diff-removed: #ef4444;
--diff-removed-bg: rgba(239, 68, 68, 0.15);
--diff-changed: #f59e0b;
--diff-changed-bg: rgba(245, 158, 11, 0.15);
```

### Usage Guidelines

**Do:**
- Use the logo with proper clear space (1x icon width on all sides)
- Use semantic colors consistently for diff states
- Use Space Grotesk for headlines, Inter for body text

**Don't:**
- Distort, recolor, or apply effects to the logo
- Use arbitrary colors for diff states (stick to green/red/amber)
- Mix fonts inconsistently

## Design System

### Page Layout Patterns

All pages follow a consistent visual language with these core patterns:

#### Hero Sections
```tsx
// Background glow effect (always present in hero)
<div
  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
  style={{ background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)" }}
/>

// Badge with animated dot
<div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/25">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
  </span>
  <span className="text-sm font-medium text-green-400">Badge text</span>
</div>

// Headline with gradient
<h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
  Regular text
  <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
    Highlighted text
  </span>
</h1>
```

#### Section Headers
```tsx
// Consistent pattern for all sections
<div className="text-center mb-16">
  <span className="font-display text-sm font-semibold text-green-500 uppercase tracking-widest mb-4 block">
    Section Label
  </span>
  <h2 className="font-display font-bold text-3xl md:text-4xl">
    Section Title
  </h2>
</div>
```

#### Primary CTA Button
```tsx
<Button className="gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold px-8 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all hover:-translate-y-0.5">
  Button Text
</Button>
```

#### Feature Cards
```tsx
<div className="group p-8 rounded-2xl border border-border bg-card hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
    <Icon className="h-7 w-7 text-green-500" />
  </div>
  <h3 className="font-display font-semibold text-xl mb-3">Title</h3>
  <p className="text-muted-foreground leading-relaxed">Description</p>
</div>
```

#### Demo Window (macOS style)
```tsx
<div className="rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
  {/* Window header */}
  <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-amber-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
    <span className="ml-3 font-mono text-xs text-slate-500">filename.xlsx</span>
  </div>
  {/* Content */}
  <div className="p-5">...</div>
</div>
```

#### Diff Cell Styling
```tsx
// Added row/cell
className="bg-green-500/15 text-green-400 border-l-2 border-green-500"

// Removed row/cell
className="bg-red-500/15 text-red-400 border-l-2 border-red-500"

// Changed/modified
className="bg-amber-500/15 text-amber-400 border-l-2 border-amber-500"
```

#### FAQ Accordion
```tsx
<details className="group rounded-xl border border-border bg-card overflow-hidden">
  <summary className="flex cursor-pointer items-center justify-between p-5 font-display font-medium text-lg hover:bg-accent/50 transition-colors">
    Question text
    <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180">
      <ChevronDown />
    </span>
  </summary>
  <div className="border-t border-border px-5 py-4 text-muted-foreground leading-relaxed">
    Answer text
  </div>
</details>
```

### Spacing Guidelines

| Element | Padding/Margin |
|---------|---------------|
| Section | `py-24 px-4` |
| Section header bottom | `mb-16` |
| Feature card | `p-8` |
| FAQ item | `p-5` |
| Demo window content | `p-5` |
| Between sections | Use `py-24` on each section |

### Key Design Principles

1. **Green as accent**: Never use green for large backgrounds. Use it for:
   - Text highlights (gradient)
   - Icons and badges
   - CTAs and interactive elements
   - Borders on diff cells

2. **Subtle animations**:
   - `hover:-translate-y-0.5` or `hover:-translate-y-1` for lift effects
   - `transition-all duration-300` for smooth state changes
   - `animate-ping` only for important status indicators

3. **Typography hierarchy**:
   - `font-display` (Space Grotesk) for all headings
   - Regular weight for body, semibold/bold for headings
   - `tracking-tight` on large headlines
   - `leading-relaxed` on body paragraphs

4. **Card patterns**:
   - Always `rounded-2xl` for cards
   - `border border-border` with `hover:border-slate-700`
   - Demo windows use `bg-slate-900` regardless of theme

## Internationalization

- Uses `next-intl` with messages in `messages/en.json` and `messages/es.json`
- URL-based locale routing: `/en`, `/es` (not cookie-based)
- All user-facing strings must use translation keys

## SEO Strategy

**Goal**: Rank #1 for "compare two excels" and related keywords.

### Core Web Vitals Priority
- **LCP < 2.5s**: Landing page content must be SSR/static, not client-rendered
- Keep interactive components (`"use client"`) separate from SEO content
- Use `dynamic(() => import(...))` for heavy client components

### Architecture Decisions
- **Hreflang**: Implemented via `alternates.languages` in metadata + sitemap
- **Structured Data**: JSON-LD with WebApplication, FAQPage, HowTo schemas
- **Dynamic OG Images**: Generated at `/og?locale=en|es`
- **Sitemap**: Auto-generated with all locale variants

### Site Structure (12 pages × 2 locales)

```
/                              → Home (marketing only, no tool)
/compare                       → Comparison tool
/compare-excel-files           → Landing: Excel/XLSX
/csv-diff                      → Landing: CSV
/xls-diff                      → Landing: XLS (legacy format)
/ods-compare                   → Landing: ODS (LibreOffice)
/guide/spreadsheet-comparison  → Pillar guide (3000+ words)
/use-cases                     → Consolidated use cases page
/alternative/spreadsheet-compare → vs Microsoft Spreadsheet Compare
/alternative/excel-compare     → vs paid Excel tools
/blog                          → Blog index
/blog/[slug]                   → Blog articles
```

### Landing Page Components

- `LandingPage` - Format-specific pages (excel, csv, xls, ods)
- `AlternativePage` - Competitor comparison pages
- `LandingContent` - Home page marketing content

### Technical SEO Checklist
- [x] metadataBase set in layout
- [x] Canonical URLs with locale (www.diffsheets.com)
- [x] robots.txt allows all crawlers
- [x] sitemap.xml with hreflang alternates
- [x] Open Graph + Twitter cards
- [x] JSON-LD structured data

## Key Constraints

- **Client-side only**: Never send user data to a server
- **Tailwind v4**: Uses CSS variables, not `tailwind.config.js` theme extensions
- **SSR for SEO**: Keep main content server-rendered; only interactive parts as client components

## Git Commands

- Use `git` directly, not `git -C /path` (we're already in the project directory)
