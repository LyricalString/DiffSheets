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

- **upload/**: File dropzone, sheet selector, preview
- **diff/**: Grid views (unified, side-by-side), cell inspector, change navigation
- **layout/**: Header with language/theme controls
- **ui/**: shadcn/ui primitives (button, card, select, etc.)

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

### Content Structure
- Landing page: SSR with H1, features, how-it-works, FAQ
- File uploader: Client component loaded after initial paint
- Landing pages per feature: `/en/compare-excel`, `/en/compare-csv` (planned)

### Technical SEO Checklist
- [ ] metadataBase set in layout
- [ ] Canonical URLs with locale
- [ ] robots.txt allows all crawlers
- [ ] sitemap.xml with hreflang alternates
- [ ] Open Graph + Twitter cards
- [ ] JSON-LD structured data

## Key Constraints

- **Client-side only**: Never send user data to a server
- **Tailwind v4**: Uses CSS variables, not `tailwind.config.js` theme extensions
- **SSR for SEO**: Keep main content server-rendered; only interactive parts as client components
