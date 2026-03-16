import type { GeneratedDocument } from "../generator/index.js";

/**
 * Simple Markdown to HTML converter. Supports:
 * headings, paragraphs, lists (ordered/unordered), tables, bold, italic,
 * links, blockquotes, code blocks, inline code, horizontal rules.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let inBlockquote = false;
  let blockquoteContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableAlignments: string[] = [];

  function closeList() {
    if (inList) {
      result.push(`</${listType}>`);
      inList = false;
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      result.push(`<blockquote>${formatInline(blockquoteContent.join(" "))}</blockquote>`);
      inBlockquote = false;
      blockquoteContent = [];
    }
  }

  function closeTable() {
    if (inTable && tableRows.length > 0) {
      let html = "<table>\n<thead>\n<tr>";
      const headerRow = tableRows[0];
      for (let c = 0; c < headerRow.length; c++) {
        const align = tableAlignments[c] ? ` style="text-align:${tableAlignments[c]}"` : "";
        html += `<th${align}>${formatInline(headerRow[c].trim())}</th>`;
      }
      html += "</tr>\n</thead>\n<tbody>\n";
      for (let r = 1; r < tableRows.length; r++) {
        html += "<tr>";
        for (let c = 0; c < tableRows[r].length; c++) {
          const align = tableAlignments[c] ? ` style="text-align:${tableAlignments[c]}"` : "";
          html += `<td${align}>${formatInline(tableRows[r][c].trim())}</td>`;
        }
        html += "</tr>\n";
      }
      html += "</tbody>\n</table>";
      result.push(html);
      inTable = false;
      tableRows = [];
      tableAlignments = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks (fenced)
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        result.push(`<pre><code>${escapeHtml(codeBlockContent.join("\n"))}</code></pre>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        closeList();
        closeBlockquote();
        closeTable();
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      i++;
      continue;
    }

    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") {
      closeList();
      closeBlockquote();
      closeTable();
      i++;
      continue;
    }

    // Table detection
    if (trimmed.includes("|")) {
      const cells = parseTableRow(trimmed);
      if (cells) {
        // Check if next line is a separator
        if (!inTable && i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          if (isTableSeparator(nextTrimmed)) {
            closeList();
            closeBlockquote();
            inTable = true;
            tableRows = [cells];
            tableAlignments = parseTableAlignments(nextTrimmed);
            i += 2; // skip header + separator
            continue;
          }
        }
        if (inTable) {
          tableRows.push(cells);
          i++;
          continue;
        }
      }
    } else if (inTable) {
      closeTable();
    }

    // Horizontal rule
    if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
      closeList();
      closeBlockquote();
      closeTable();
      result.push("<hr>");
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      closeBlockquote();
      closeTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text);
      result.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      closeList();
      closeTable();
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }
      blockquoteContent.push(trimmed.slice(2));
      i++;
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // Checkbox list items (must check before unordered list)
    const checkboxMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (checkboxMatch) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        listType = "ul";
        inList = true;
        result.push('<ul class="checklist">');
      }
      const checked = checkboxMatch[1] !== " " ? " checked" : "";
      result.push(`<li><input type="checkbox" disabled${checked}> ${formatInline(checkboxMatch[2])}</li>`);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        listType = "ul";
        inList = true;
        result.push("<ul>");
      }
      const content = trimmed.replace(/^[-*+]\s+/, "");
      result.push(`<li>${formatInline(content)}</li>`);
      i++;
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ol") {
        closeList();
        listType = "ol";
        inList = true;
        result.push("<ol>");
      }
      result.push(`<li>${formatInline(olMatch[2])}</li>`);
      i++;
      continue;
    }

    // Paragraph
    closeList();
    closeBlockquote();
    closeTable();
    result.push(`<p>${formatInline(trimmed)}</p>`);
    i++;
  }

  closeList();
  closeBlockquote();
  closeTable();

  return result.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string): string {
  // Bold + italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // Inline code
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function parseTableRow(line: string): string[] | null {
  if (!line.includes("|")) return null;
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  const cells = trimmed.split("|");
  if (cells.length < 2) return null;
  return cells;
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*[-:]+[-|\s:]*$/.test(line);
}

function parseTableAlignments(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((cell) => {
    const c = cell.trim();
    if (c.startsWith(":") && c.endsWith(":")) return "center";
    if (c.endsWith(":")) return "right";
    return "left";
  });
}

/**
 * Generates a single self-contained HTML page from an array of generated documents.
 *
 * Design: Apple-inspired single-column layout. Typography-driven hierarchy,
 * no sidebar, no JavaScript, no visual chrome. The content IS the design.
 */
export function generateHtml(
  docs: GeneratedDocument[],
  options: {
    companyName?: string;
    lastUpdated?: string;
  } = {}
): string {
  const companyName = options.companyName || "Your Company";
  const lastUpdated = options.lastUpdated || new Date().toISOString().split("T")[0];

  // Build document navigation (simple text links at the top)
  const navLinks = docs
    .map((doc) => {
      const id = slugify(doc.name);
      return `<a href="#${id}">${escapeHtml(doc.name)}</a>`;
    })
    .join("\n        ");

  // Build document sections
  const documentSections = docs
    .map((doc) => {
      const id = slugify(doc.name);
      const htmlContent = markdownToHtml(doc.content);

      return `
      <section id="${id}">
        ${htmlContent}
      </section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(companyName)} — Compliance Documents</title>
  <style>
    :root {
      --text: #1d1d1f;
      --text-secondary: #6e6e73;
      --bg: #fff;
      --bg-alt: #f5f5f7;
      --accent: #0066cc;
      --border: #d2d2d7;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f5f5f7;
        --text-secondary: #a1a1a6;
        --bg: #000;
        --bg-alt: #1d1d1f;
        --accent: #2997ff;
        --border: #424245;
      }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Helvetica, Arial, sans-serif;
      font-size: 17px;
      line-height: 1.47059;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .page {
      max-width: 680px;
      margin: 0 auto;
      padding: 80px 24px 120px;
    }

    .page-header {
      margin-bottom: 64px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }

    .page-header .meta {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .doc-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      margin-bottom: 64px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .doc-nav a {
      font-size: 14px;
      color: var(--accent);
      text-decoration: none;
    }

    .doc-nav a:hover { text-decoration: underline; }

    section { margin-bottom: 80px; }

    h1 { font-size: 40px; line-height: 1.1; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 16px; }
    h2 { font-size: 28px; line-height: 1.14; font-weight: 700; letter-spacing: -0.01em; margin-top: 56px; margin-bottom: 12px; }
    h3 { font-size: 21px; line-height: 1.19; font-weight: 600; margin-top: 40px; margin-bottom: 8px; }
    h4 { font-size: 17px; line-height: 1.47; font-weight: 600; margin-top: 32px; margin-bottom: 8px; }

    p { margin-bottom: 16px; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { font-weight: 600; }

    ul, ol { margin: 8px 0 16px 24px; }
    li { margin-bottom: 6px; }

    blockquote {
      border-left: 3px solid var(--border);
      padding-left: 20px;
      color: var(--text-secondary);
      margin: 16px 0;
    }

    pre {
      background: var(--bg-alt);
      border-radius: 8px;
      padding: 16px 20px;
      overflow-x: auto;
      margin: 16px 0;
      font-size: 14px;
      line-height: 1.5;
    }

    code {
      font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.88em;
    }

    :not(pre) > code {
      background: var(--bg-alt);
      padding: 2px 6px;
      border-radius: 4px;
    }

    pre code {
      background: none;
      padding: 0;
      border-radius: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
      margin: 16px 0;
    }

    th {
      text-align: left;
      font-weight: 600;
      padding: 10px 12px;
      border-bottom: 2px solid var(--border);
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 48px 0;
    }

    ul.checklist { list-style: none; margin-left: 0; }
    ul.checklist li { padding-left: 4px; }

    .footer {
      margin-top: 80px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-secondary);
    }

    @media (max-width: 600px) {
      .page { padding: 48px 20px 80px; }
      h1 { font-size: 32px; }
      h2 { font-size: 24px; margin-top: 40px; }
      h3 { font-size: 19px; margin-top: 32px; }
    }

    @media print {
      body {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000;
        background: #fff;
      }
      .page { max-width: 100%; padding: 0; }
      .doc-nav, .footer { display: none; }
      h1 { font-size: 18pt; }
      h2 { font-size: 14pt; }
      section { page-break-inside: avoid; }
      a { color: #000; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="page-header">
      <h1>${escapeHtml(companyName)}</h1>
      <p class="meta">Compliance Documents &middot; Last updated ${escapeHtml(lastUpdated)}</p>
    </header>

    <nav class="doc-nav">
      ${navLinks}
    </nav>
${documentSections}

    <footer class="footer">
      Generated by Codepliant
    </footer>
  </div>
</body>
</html>`;
}
