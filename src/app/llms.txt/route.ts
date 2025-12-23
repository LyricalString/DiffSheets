const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.diffsheets.com";

const LLMS_TXT_CONTENT = `# DiffSheets

> Compare spreadsheets instantly in your browser. Free, private, no uploads to servers.

DiffSheets is a client-side spreadsheet comparison tool that helps users find differences between two Excel, CSV, or ODS files. All processing happens entirely in the browser - user data never leaves their device, ensuring complete privacy.

## Core Features

- **File Format Support**: XLSX, XLS, CSV, ODS (LibreOffice)
- **Row Matching Algorithms**: Position-based, Key-column matching, LCS (Myers' diff)
- **Cell-level Diff**: Highlights changes with inline text differences
- **Privacy-first**: 100% client-side processing, no server uploads
- **Multi-language**: Available in English and Spanish

## Use Cases

1. **Data Validation**: Compare exported reports to verify data integrity
2. **Version Control**: Track changes between spreadsheet versions
3. **Audit & Compliance**: Document differences for regulatory requirements
4. **Migration Testing**: Verify data consistency after system migrations
5. **Collaboration Review**: Compare team members' spreadsheet edits

## Main Pages

- [Home](${BASE_URL}): Landing page with product overview
- [Compare Tool](${BASE_URL}/compare): The main comparison application
- [MCP Server](${BASE_URL}/mcp): CLI tool for Claude Code and Claude Desktop
- [Excel Comparison](${BASE_URL}/compare-excel-files): Guide for comparing Excel files
- [CSV Diff](${BASE_URL}/csv-diff): Guide for comparing CSV files
- [XLS Diff](${BASE_URL}/xls-diff): Guide for legacy Excel format
- [ODS Compare](${BASE_URL}/ods-compare): Guide for LibreOffice files
- [Complete Guide](${BASE_URL}/guide/spreadsheet-comparison): Comprehensive comparison guide
- [Use Cases](${BASE_URL}/use-cases): Detailed use case scenarios

## Spanish Version

- [Inicio](${BASE_URL}/es): Página principal en español
- [Comparar](${BASE_URL}/es/compare): Herramienta de comparación
- [Comparar Excel](${BASE_URL}/es/compare-excel-files): Guía para archivos Excel

## Technical Details

- Built with Next.js 15 and React 19
- Uses the xlsx library for file parsing
- Virtual scrolling for large spreadsheets
- Three diff algorithms: position, key-column, LCS (Myers)

## How It Works

1. User uploads two spreadsheet files (drag & drop or file picker)
2. Files are parsed client-side using the xlsx library
3. User selects matching strategy (position, key-column, or LCS)
4. Diff algorithm compares rows and cells
5. Results displayed with color-coded changes (green=added, red=removed, amber=modified)

## MCP Server (CLI)

DiffSheets has an official MCP (Model Context Protocol) server for use with Claude Code and Claude Desktop.

- **Install**: \`npx diffsheets-mcp\`
- **npm**: https://www.npmjs.com/package/diffsheets-mcp
- **Tools available**:
  - \`compare_spreadsheets\`: Compare two spreadsheet files
  - \`get_spreadsheet_info\`: Get metadata about a spreadsheet
  - \`get_sheet_data\`: Read contents of a specific sheet

## API

DiffSheets does not have a public REST API. All web functionality runs client-side in the browser. For programmatic access, use the MCP server.

## Pricing

DiffSheets is completely free to use. No registration required.

## Contact

- Website: ${BASE_URL}
- GitHub: https://github.com/diffsheets

## Optional

For more detailed content, see: ${BASE_URL}/llms-full.txt
`;

export async function GET() {
  return new Response(LLMS_TXT_CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
