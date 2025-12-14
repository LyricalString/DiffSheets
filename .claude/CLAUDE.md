# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start dev server on port 3300
bun build        # Production build
bun lint         # Run Biome linter
bun format       # Format code with Biome
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
- All user-facing strings must use translation keys

## Key Constraints

- **Client-side only**: Never send user data to a server
- **Tailwind v4**: Uses CSS variables, not `tailwind.config.js` theme extensions
- **Biome**: Use `bun lint` and `bun format`, not ESLint/Prettier
