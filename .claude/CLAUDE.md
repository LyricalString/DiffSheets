# DiffSheets

**Domain:** https://diffsheets.com
**Brand:** DiffSheets
**Tagline:** Compare spreadsheets instantly / Compara hojas de cálculo al instante

## Project Overview

DiffSheets is a free, open-source web application for comparing Excel files, CSV spreadsheets, and other tabular data formats. All processing happens 100% client-side - user data never leaves the browser.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix primitives)
- **State Management:** Zustand
- **Internationalization:** next-intl (EN/ES)
- **Linter/Formatter:** Biome
- **Package Manager:** Bun

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/            # Header, Footer, ThemeToggle, LanguageSwitcher
│   ├── providers/         # ThemeProvider
│   ├── seo/               # JSON-LD structured data
│   ├── ui/                # shadcn/ui components
│   └── upload/            # FileDropzone, SheetSelector, SpreadsheetPreview
├── i18n/                  # Internationalization config
├── lib/
│   ├── diff/              # Diff algorithms (cell-diff, row-matcher)
│   └── parser/            # Spreadsheet parsing (xlsx, csv, ods)
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions
messages/
├── en.json                # English translations
└── es.json                # Spanish translations
```

## Development Commands

```bash
bun dev          # Start dev server on port 3300
bun build        # Production build
bun lint         # Run Biome linter
bun format       # Format code with Biome
```

## SEO Strategy

- **Target:** Global audience (EN primary, ES secondary)
- **Domain:** .com for international reach
- **Structure:** Subdirectories with hreflang (/en/, /es/)
- **Keywords:** excel compare, csv diff, spreadsheet comparison, xlsx compare

## Infrastructure (Planned)

- **Hosting:** Vercel (initial) → Cloudflare Pages (scale)
- **Domain Registrar:** Cloudflare Registrar
- **DNS/CDN:** Cloudflare
- **Email:** Cloudflare Email Routing → personal email

## Key Design Decisions

1. **Client-side only:** No server uploads for privacy/trust
2. **Branding:** "DiffSheets" - neutral, works in EN/ES
3. **Mobile-first:** Responsive design for all devices
4. **Accessibility:** ARIA labels, keyboard navigation
5. **Performance:** Virtual scrolling for large files
