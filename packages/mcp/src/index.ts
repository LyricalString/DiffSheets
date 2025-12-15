#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import { computeSpreadsheetDiff, filterDiffRows } from "./diff/index.js";
import {
  formatFileSize,
  isExtensionSupported,
  parseSpreadsheetFromPath,
  SUPPORTED_EXTENSIONS,
} from "./parser.js";
import { defaultComparisonOptions, type ComparisonOptions, type MatchingStrategy } from "./types.js";

const server = new Server(
  {
    name: "diffsheets-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Helper to validate file path
async function validateFilePath(filePath: string): Promise<string> {
  const absolutePath = resolve(filePath);

  // Check file exists
  try {
    await access(absolutePath, constants.R_OK);
  } catch {
    throw new Error(`File not found or not readable: ${absolutePath}`);
  }

  // Check extension
  if (!isExtensionSupported(absolutePath)) {
    throw new Error(
      `Unsupported file format. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
    );
  }

  return absolutePath;
}

// Format diff result for text output
function formatDiffResult(
  originalFile: string,
  modifiedFile: string,
  result: Awaited<ReturnType<typeof computeSpreadsheetDiff>>,
  options: ComparisonOptions,
): string {
  const lines: string[] = [];

  lines.push("# Spreadsheet Comparison Results");
  lines.push("");
  lines.push(`**Original:** ${originalFile}`);
  lines.push(`**Modified:** ${modifiedFile}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push(`- Total rows: ${result.summary.totalRows}`);
  lines.push(`- Added rows: ${result.summary.addedRows}`);
  lines.push(`- Removed rows: ${result.summary.removedRows}`);
  lines.push(`- Modified rows: ${result.summary.modifiedRows}`);
  lines.push(`- Unchanged rows: ${result.summary.unchangedRows}`);
  lines.push(`- Modified cells: ${result.summary.modifiedCells}`);
  lines.push("");

  // Changed rows detail
  const changedRows = filterDiffRows(result, { ...options, hideUnchangedRows: true });

  if (changedRows.length === 0) {
    lines.push("## Changes");
    lines.push("No differences found.");
  } else {
    lines.push("## Changes");
    lines.push("");

    for (const row of changedRows.slice(0, 50)) {
      // Limit to first 50 changes
      const rowNum =
        row.changeType === "added"
          ? `+${(row.modifiedIndex ?? 0) + 1}`
          : row.changeType === "removed"
            ? `-${(row.originalIndex ?? 0) + 1}`
            : `~${(row.originalIndex ?? 0) + 1}`;

      const statusIcon =
        row.changeType === "added"
          ? "[+]"
          : row.changeType === "removed"
            ? "[-]"
            : "[~]";

      lines.push(`### Row ${rowNum} ${statusIcon}`);

      const changedCells = row.cells.filter((c) => c.changeType !== "unchanged");

      for (const cell of changedCells) {
        const colLetter = String.fromCharCode(65 + cell.columnIndex);
        const origVal =
          cell.original?.value !== null && cell.original?.value !== undefined
            ? String(cell.original.value)
            : "(empty)";
        const modVal =
          cell.modified?.value !== null && cell.modified?.value !== undefined
            ? String(cell.modified.value)
            : "(empty)";

        if (cell.changeType === "added") {
          lines.push(`  - **${colLetter}**: Added \`${modVal}\``);
        } else if (cell.changeType === "removed") {
          lines.push(`  - **${colLetter}**: Removed \`${origVal}\``);
        } else {
          lines.push(`  - **${colLetter}**: \`${origVal}\` → \`${modVal}\``);
        }
      }
      lines.push("");
    }

    if (changedRows.length > 50) {
      lines.push(`... and ${changedRows.length - 50} more changes`);
    }
  }

  return lines.join("\n");
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "compare_spreadsheets",
        description:
          "Compare two spreadsheet files (Excel, CSV, ODS) and show the differences. " +
          "Supports various matching strategies: position-based, key-column, or LCS algorithm.",
        inputSchema: {
          type: "object",
          properties: {
            original_file: {
              type: "string",
              description: "Path to the original/baseline spreadsheet file",
            },
            modified_file: {
              type: "string",
              description: "Path to the modified/new spreadsheet file to compare against",
            },
            original_sheet: {
              type: "string",
              description: "Sheet name in original file (uses first sheet if not specified)",
            },
            modified_sheet: {
              type: "string",
              description: "Sheet name in modified file (uses first sheet if not specified)",
            },
            matching_strategy: {
              type: "string",
              enum: ["position", "key-column", "lcs"],
              description:
                "Row matching strategy: 'position' (1:1 by row number), 'key-column' (match by key column value), 'lcs' (longest common subsequence for best alignment)",
              default: "position",
            },
            key_column: {
              type: "number",
              description:
                "Column index (0-based) to use as key when matching_strategy is 'key-column'",
            },
            ignore_case: {
              type: "boolean",
              description: "Ignore case when comparing cell values",
              default: false,
            },
            ignore_whitespace: {
              type: "boolean",
              description: "Ignore whitespace differences when comparing cell values",
              default: false,
            },
            compare_formulas: {
              type: "boolean",
              description: "Compare cell formulas in addition to values",
              default: false,
            },
          },
          required: ["original_file", "modified_file"],
        },
      },
      {
        name: "get_spreadsheet_info",
        description:
          "Get information about a spreadsheet file including sheet names, row counts, and column counts.",
        inputSchema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              description: "Path to the spreadsheet file",
            },
          },
          required: ["file"],
        },
      },
      {
        name: "get_sheet_data",
        description:
          "Get the contents of a specific sheet from a spreadsheet file. Returns rows and cell values.",
        inputSchema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              description: "Path to the spreadsheet file",
            },
            sheet: {
              type: "string",
              description: "Sheet name (uses first sheet if not specified)",
            },
            max_rows: {
              type: "number",
              description: "Maximum number of rows to return (default: 100)",
              default: 100,
            },
          },
          required: ["file"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "compare_spreadsheets": {
        const originalPath = await validateFilePath(args?.original_file as string);
        const modifiedPath = await validateFilePath(args?.modified_file as string);

        const originalParsed = await parseSpreadsheetFromPath(originalPath);
        const modifiedParsed = await parseSpreadsheetFromPath(modifiedPath);

        // Get sheet names
        const originalSheetName =
          (args?.original_sheet as string) || originalParsed.activeSheet;
        const modifiedSheetName =
          (args?.modified_sheet as string) || modifiedParsed.activeSheet;

        // Get sheet data
        const originalSheet = originalParsed.data.get(originalSheetName);
        const modifiedSheet = modifiedParsed.data.get(modifiedSheetName);

        if (!originalSheet) {
          throw new Error(
            `Sheet "${originalSheetName}" not found in original file. Available: ${originalParsed.sheets.map((s) => s.name).join(", ")}`,
          );
        }
        if (!modifiedSheet) {
          throw new Error(
            `Sheet "${modifiedSheetName}" not found in modified file. Available: ${modifiedParsed.sheets.map((s) => s.name).join(", ")}`,
          );
        }

        // Build comparison options
        const options: ComparisonOptions = {
          ...defaultComparisonOptions,
          matchingStrategy: (args?.matching_strategy as MatchingStrategy) || "lcs",
          keyColumnIndex: args?.key_column as number | undefined,
          ignoreCase: (args?.ignore_case as boolean) || false,
          ignoreWhitespace: (args?.ignore_whitespace as boolean) || false,
          compareFormulas: (args?.compare_formulas as boolean) || false,
        };

        // Compute diff
        const diffResult = computeSpreadsheetDiff(originalSheet, modifiedSheet, options);

        // Format output
        const output = formatDiffResult(
          `${originalParsed.filename} [${originalSheetName}]`,
          `${modifiedParsed.filename} [${modifiedSheetName}]`,
          diffResult,
          options,
        );

        return {
          content: [{ type: "text", text: output }],
        };
      }

      case "get_spreadsheet_info": {
        const filePath = await validateFilePath(args?.file as string);
        const parsed = await parseSpreadsheetFromPath(filePath);

        const lines: string[] = [];
        lines.push(`# ${parsed.filename}`);
        lines.push("");
        lines.push(`**Size:** ${formatFileSize(parsed.fileSize)}`);
        lines.push(`**Sheets:** ${parsed.sheets.length}`);
        lines.push("");
        lines.push("## Sheets");
        lines.push("");

        for (const sheet of parsed.sheets) {
          lines.push(`- **${sheet.name}**: ${sheet.rowCount} rows × ${sheet.columnCount} columns`);
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      case "get_sheet_data": {
        const filePath = await validateFilePath(args?.file as string);
        const parsed = await parseSpreadsheetFromPath(filePath);

        const sheetName = (args?.sheet as string) || parsed.activeSheet;
        const maxRows = (args?.max_rows as number) || 100;

        const sheet = parsed.data.get(sheetName);
        if (!sheet) {
          throw new Error(
            `Sheet "${sheetName}" not found. Available: ${parsed.sheets.map((s) => s.name).join(", ")}`,
          );
        }

        const lines: string[] = [];
        lines.push(`# ${parsed.filename} - ${sheetName}`);
        lines.push("");

        // Build markdown table
        const headers = sheet.columns.map((c) => c.letter);
        lines.push(`| Row | ${headers.join(" | ")} |`);
        lines.push(`| --- | ${headers.map(() => "---").join(" | ")} |`);

        const rowsToShow = sheet.rows.slice(0, maxRows);
        for (let i = 0; i < rowsToShow.length; i++) {
          const row = rowsToShow[i];
          const cells = row.map((cell) => {
            if (cell.value === null || cell.value === undefined) return "";
            const str = String(cell.value);
            // Escape pipe characters and limit length
            return str.replace(/\|/g, "\\|").slice(0, 50);
          });
          lines.push(`| ${i + 1} | ${cells.join(" | ")} |`);
        }

        if (sheet.rows.length > maxRows) {
          lines.push("");
          lines.push(`... and ${sheet.rows.length - maxRows} more rows`);
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DiffSheets MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
