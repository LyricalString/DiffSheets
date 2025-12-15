# diffsheets-mcp

MCP (Model Context Protocol) server for comparing spreadsheets locally with Claude Code.

Compare Excel, CSV, and ODS files directly from your terminal using Claude Code - all processing happens locally on your machine.

## Features

- **Compare spreadsheets** - Diff two Excel/CSV/ODS files with detailed change reports
- **Multiple matching strategies** - Position-based, key-column, or LCS algorithm
- **Inline diffs** - See exactly what changed within each cell
- **100% local** - Your files never leave your computer
- **Same engine as [DiffSheets.com](https://www.diffsheets.com)** - Production-tested comparison logic

## Supported Formats

- Excel (.xlsx, .xls)
- CSV (.csv)
- Tab-separated values (.tsv)
- OpenDocument Spreadsheet (.ods)

## Installation

### Using npx (recommended)

```bash
npx diffsheets-mcp
```

### Global installation

```bash
npm install -g diffsheets-mcp
```

### Using Bun

```bash
bunx diffsheets-mcp
```

## Configuration

### Claude Code

Add to your Claude Code MCP settings (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "diffsheets": {
      "command": "npx",
      "args": ["diffsheets-mcp"]
    }
  }
}
```

Or with Bun:

```json
{
  "mcpServers": {
    "diffsheets": {
      "command": "bunx",
      "args": ["diffsheets-mcp"]
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "diffsheets": {
      "command": "npx",
      "args": ["diffsheets-mcp"]
    }
  }
}
```

## Available Tools

### `compare_spreadsheets`

Compare two spreadsheet files and get a detailed diff report.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `original_file` | string | Yes | Path to the original/baseline file |
| `modified_file` | string | Yes | Path to the modified file |
| `original_sheet` | string | No | Sheet name in original file |
| `modified_sheet` | string | No | Sheet name in modified file |
| `matching_strategy` | string | No | `"position"`, `"key-column"`, or `"lcs"` |
| `key_column` | number | No | Column index (0-based) for key-column matching |
| `ignore_case` | boolean | No | Ignore case differences |
| `ignore_whitespace` | boolean | No | Ignore whitespace differences |
| `compare_formulas` | boolean | No | Compare formulas instead of just values |

**Example usage in Claude:**
```
Compare /path/to/original.xlsx with /path/to/modified.xlsx using the lcs matching strategy
```

### `get_spreadsheet_info`

Get metadata about a spreadsheet file.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | string | Yes | Path to the spreadsheet file |

**Example:**
```
What sheets are in /path/to/file.xlsx?
```

### `get_sheet_data`

Read the contents of a sheet.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | string | Yes | Path to the spreadsheet file |
| `sheet` | string | No | Sheet name (defaults to first sheet) |
| `max_rows` | number | No | Maximum rows to return (default: 100) |

**Example:**
```
Show me the first 20 rows of Sheet1 in /path/to/file.xlsx
```

## Matching Strategies

### Position (`position`)
Simple 1:1 row mapping by index. Row 1 in file A is compared to row 1 in file B.

Best for: Files with the same structure where rows haven't been reordered.

### Key Column (`key-column`)
Match rows by a unique identifier column (like ID, SKU, email).

Best for: Database exports, inventory lists, or any data with unique identifiers.

**Example:** Compare files by product SKU (column A = index 0):
```
Compare /path/to/old-inventory.xlsx with /path/to/new-inventory.xlsx using key-column matching on column 0
```

**Tip:** Use `get_sheet_data` first to identify which column contains your unique identifier.

### LCS (`lcs`)
Uses the Longest Common Subsequence algorithm to find the optimal row alignment.

Best for: Files where rows may have been inserted, deleted, or reordered.

## Example Output

```markdown
# Spreadsheet Comparison Results

**Original:** inventory_jan.xlsx [Sheet1]
**Modified:** inventory_feb.xlsx [Sheet1]

## Summary
- Total rows: 156
- Added rows: 12
- Removed rows: 3
- Modified rows: 28
- Unchanged rows: 113
- Modified cells: 45

## Changes

### Row ~5 [~]
  - **C**: `150` → `142`
  - **D**: `In Stock` → `Low Stock`

### Row +157 [+]
  - **A**: Added `SKU-2024-NEW`
  - **B**: Added `New Product`
  - **C**: Added `500`
```

## Privacy

All file processing happens locally on your machine. Your spreadsheet data is:
- Never uploaded to any server
- Never sent to any API
- Never stored anywhere except your local filesystem

This MCP server uses the same comparison engine as [DiffSheets.com](https://www.diffsheets.com), which is also entirely client-side.

## Development

```bash
# Clone the repository
git clone https://github.com/diffsheets/diffsheets
cd diffsheets/packages/mcp

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build
```

## License

MIT - See [LICENSE](LICENSE) for details.

## Links

- [DiffSheets.com](https://www.diffsheets.com) - Web-based spreadsheet comparison tool
- [GitHub Repository](https://github.com/diffsheets/diffsheets)
- [Report Issues](https://github.com/diffsheets/diffsheets/issues)
