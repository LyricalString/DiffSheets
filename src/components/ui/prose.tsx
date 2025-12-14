import type { ReactNode } from "react";

/**
 * Server-side prose content renderer
 * Parses markdown-like syntax and renders as React elements
 * SEO-friendly: no "use client" directive
 */

interface ProseProps {
  content: string;
  className?: string;
}

// Parse inline formatting (bold, italic, code, links)
function parseInline(text: string): ReactNode[] {
  const result: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      result.push(
        <strong key={key++} className="font-semibold text-foreground">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      result.push(
        <em key={key++} className="italic">
          {italicMatch[1]}
        </em>,
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      result.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm text-green-500"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith("http");
      result.push(
        <a
          key={key++}
          href={linkMatch[2]}
          className="text-green-500 hover:text-green-400 underline underline-offset-2 transition-colors"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {linkMatch[1]}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text - find next special character or end
    const nextSpecial = remaining.search(/[*`[]/);
    if (nextSpecial === -1) {
      result.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Special char that didn't match a pattern, treat as text
      result.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      result.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return result;
}

// Parse a single line and return appropriate element
function parseLine(line: string, index: number): ReactNode {
  const trimmed = line.trim();

  // Empty line
  if (!trimmed) {
    return null;
  }

  // Unordered list item
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
    return (
      <li key={index} className="leading-relaxed">
        {parseInline(trimmed.slice(2))}
      </li>
    );
  }

  // Ordered list item
  const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
  if (orderedMatch) {
    return (
      <li key={index} className="leading-relaxed">
        {parseInline(orderedMatch[2])}
      </li>
    );
  }

  // Regular paragraph line
  return parseInline(trimmed);
}

// Parse code blocks
function extractCodeBlocks(
  content: string,
): { type: "text" | "code"; content: string; language?: string }[] {
  const blocks: { type: "text" | "code"; content: string; language?: string }[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }

    // Add code block
    blocks.push({
      type: "code",
      content: match[2].trim(),
      language: match[1] || undefined,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    blocks.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return blocks;
}

// Parse tables
function parseTable(lines: string[]): ReactNode {
  const headerLine = lines[0];
  const dataLines = lines.slice(2); // Skip header and separator

  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);
  const rows = dataLines.map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean),
  );

  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-border rounded-lg text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground border-r border-border last:border-r-0"
              >
                {parseInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-muted-foreground border-r border-border last:border-r-0"
                >
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main content parser
function parseContent(content: string): ReactNode[] {
  const blocks = extractCodeBlocks(content);
  const result: ReactNode[] = [];
  let blockKey = 0;

  for (const block of blocks) {
    if (block.type === "code") {
      result.push(
        <pre
          key={blockKey++}
          className="rounded-xl bg-slate-900 dark:bg-slate-950 border border-border p-4 mb-6 overflow-x-auto"
        >
          <code className="block font-mono text-sm text-slate-300">{block.content}</code>
        </pre>,
      );
      continue;
    }

    // Parse text content
    const lines = block.content.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // Check for table (starts with |)
      if (trimmed.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
        const tableLines: string[] = [trimmed];
        i++;
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }
        result.push(<div key={blockKey++}>{parseTable(tableLines)}</div>);
        continue;
      }

      // Check for list (collect all consecutive list items)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
        const isOrdered = /^\d+\.\s/.test(trimmed);
        const listItems: ReactNode[] = [];
        let listKey = 0;

        while (i < lines.length) {
          const listLine = lines[i].trim();
          if (!listLine) {
            i++;
            continue;
          }
          if (listLine.startsWith("- ") || listLine.startsWith("* ") || /^\d+\.\s/.test(listLine)) {
            listItems.push(parseLine(listLine, listKey++));
            i++;
          } else {
            break;
          }
        }

        if (isOrdered) {
          result.push(
            <ol
              key={blockKey++}
              className="list-decimal list-outside ml-6 mb-6 space-y-2 text-muted-foreground"
            >
              {listItems}
            </ol>,
          );
        } else {
          result.push(
            <ul
              key={blockKey++}
              className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted-foreground"
            >
              {listItems}
            </ul>,
          );
        }
        continue;
      }

      // Regular paragraph - collect lines until empty line or special element
      const paragraphLines: string[] = [];
      while (i < lines.length) {
        const pLine = lines[i].trim();
        if (
          !pLine ||
          pLine.startsWith("- ") ||
          pLine.startsWith("* ") ||
          pLine.startsWith("|") ||
          /^\d+\.\s/.test(pLine)
        ) {
          break;
        }
        paragraphLines.push(pLine);
        i++;
      }

      if (paragraphLines.length > 0) {
        result.push(
          <p key={blockKey++} className="text-muted-foreground leading-relaxed mb-4">
            {parseInline(paragraphLines.join(" "))}
          </p>,
        );
      }
    }
  }

  return result;
}

export function Prose({ content, className = "" }: ProseProps) {
  return <div className={className}>{parseContent(content)}</div>;
}
