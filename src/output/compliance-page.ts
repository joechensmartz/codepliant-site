import * as fs from "fs";
import * as path from "path";
import type { GeneratedDocument } from "../generator/index.js";

/**
 * Converts basic Markdown to HTML. Reuses the same logic as html.ts but
 * is self-contained here to avoid coupling internal helpers.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string): string {
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
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
    if (inList) { result.push(`</${listType}>`); inList = false; }
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
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        result.push(`<pre><code>${escapeHtml(codeBlockContent.join("\n"))}</code></pre>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        closeList(); closeBlockquote(); closeTable();
        inCodeBlock = true;
      }
      i++; continue;
    }
    if (inCodeBlock) { codeBlockContent.push(line); i++; continue; }

    const trimmed = line.trim();
    if (trimmed === "") { closeList(); closeBlockquote(); closeTable(); i++; continue; }

    if (trimmed.includes("|")) {
      const cells = parseTableRow(trimmed);
      if (cells) {
        if (!inTable && i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          if (isTableSeparator(nextTrimmed)) {
            closeList(); closeBlockquote();
            inTable = true;
            tableRows = [cells];
            tableAlignments = parseTableAlignments(nextTrimmed);
            i += 2; continue;
          }
        }
        if (inTable) { tableRows.push(cells); i++; continue; }
      }
    } else if (inTable) { closeTable(); }

    if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
      closeList(); closeBlockquote(); closeTable();
      result.push("<hr>"); i++; continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList(); closeBlockquote(); closeTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text);
      result.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      i++; continue;
    }

    if (trimmed.startsWith("> ")) {
      closeList(); closeTable();
      if (!inBlockquote) { inBlockquote = true; blockquoteContent = []; }
      blockquoteContent.push(trimmed.slice(2));
      i++; continue;
    } else if (inBlockquote) { closeBlockquote(); }

    const checkboxMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (checkboxMatch) {
      closeBlockquote(); closeTable();
      if (!inList || listType !== "ul") { closeList(); listType = "ul"; inList = true; result.push('<ul class="checklist">'); }
      const checked = checkboxMatch[1] !== " " ? " checked" : "";
      result.push(`<li><input type="checkbox" disabled${checked}> ${formatInline(checkboxMatch[2])}</li>`);
      i++; continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      closeBlockquote(); closeTable();
      if (!inList || listType !== "ul") { closeList(); listType = "ul"; inList = true; result.push("<ul>"); }
      result.push(`<li>${formatInline(trimmed.replace(/^[-*+]\s+/, ""))}</li>`);
      i++; continue;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      closeBlockquote(); closeTable();
      if (!inList || listType !== "ol") { closeList(); listType = "ol"; inList = true; result.push("<ol>"); }
      result.push(`<li>${formatInline(olMatch[2])}</li>`);
      i++; continue;
    }

    closeList(); closeBlockquote(); closeTable();
    result.push(`<p>${formatInline(trimmed)}</p>`);
    i++;
  }

  closeList(); closeBlockquote(); closeTable();
  return result.join("\n");
}

/** Extract headings from markdown for table of contents. */
function extractHeadings(md: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  for (const line of md.split("\n")) {
    const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2],
        id: slugify(match[2]),
      });
    }
  }
  return headings;
}

/**
 * Generates a single self-contained compliance page with tab navigation,
 * client-side search, and table of contents per document.
 *
 * Design: Apple-inspired, 680px max-width, SF Pro, dark mode support.
 * No external requests. Keyboard accessible (arrow keys switch tabs).
 */
export function generateCompliancePage(
  docs: GeneratedDocument[],
  options: {
    companyName?: string;
    lastUpdated?: string;
  } = {}
): string {
  const companyName = options.companyName || "Your Company";
  const lastUpdated = options.lastUpdated || new Date().toISOString().split("T")[0];

  // Build tab buttons
  const tabButtons = docs
    .map((doc, idx) => {
      const id = slugify(doc.name);
      const active = idx === 0 ? ' class="active"' : "";
      return `<button role="tab" aria-selected="${idx === 0}" aria-controls="panel-${id}" id="tab-${id}" tabindex="${idx === 0 ? 0 : -1}"${active}>${escapeHtml(doc.name)}</button>`;
    })
    .join("\n        ");

  // Build tab panels with TOC and content
  const tabPanels = docs
    .map((doc, idx) => {
      const id = slugify(doc.name);
      const htmlContent = markdownToHtml(doc.content);
      const headings = extractHeadings(doc.content);
      const hidden = idx === 0 ? "" : " hidden";

      // Build TOC from h2/h3 headings
      const tocItems = headings
        .filter((h) => h.level === 2 || h.level === 3)
        .map((h) => {
          const indent = h.level === 3 ? ' class="toc-indent"' : "";
          return `<li${indent}><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`;
        })
        .join("\n            ");

      const tocHtml =
        tocItems.length > 0
          ? `\n          <nav class="toc" aria-label="Table of contents"><ol>${tocItems}</ol></nav>`
          : "";

      return `      <div role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}"${hidden}>
          <p class="doc-updated">Last updated ${escapeHtml(lastUpdated)}</p>${tocHtml}
          <div class="doc-content">
            ${htmlContent}
          </div>
        </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(companyName)} — Compliance</title>
  <style>
    :root {
      --text: #1d1d1f;
      --text-secondary: #6e6e73;
      --bg: #fff;
      --bg-alt: #f5f5f7;
      --accent: #0066cc;
      --border: #d2d2d7;
      --highlight: #fff3aa;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f5f5f7;
        --text-secondary: #a1a1a6;
        --bg: #000;
        --bg-alt: #1d1d1f;
        --accent: #2997ff;
        --border: #424245;
        --highlight: #4a4000;
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
      margin-bottom: 40px;
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

    /* Search */
    .search-bar {
      margin-bottom: 24px;
    }

    .search-bar input {
      width: 100%;
      padding: 10px 16px;
      font-size: 15px;
      font-family: inherit;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-alt);
      color: var(--text);
      outline: none;
      transition: border-color 0.15s;
    }

    .search-bar input:focus {
      border-color: var(--accent);
    }

    .search-bar .search-info {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 6px;
      min-height: 18px;
    }

    /* Tabs */
    [role="tablist"] {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 40px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0;
    }

    [role="tab"] {
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      background: none;
      border: none;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: color 0.15s, border-color 0.15s;
    }

    [role="tab"]:hover {
      color: var(--text);
    }

    [role="tab"].active,
    [role="tab"][aria-selected="true"] {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }

    [role="tab"]:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: -2px;
      border-radius: 4px;
    }

    /* Panels */
    [role="tabpanel"][hidden] {
      display: none;
    }

    .doc-updated {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    /* Table of contents */
    .toc {
      margin-bottom: 40px;
      padding: 20px 24px;
      background: var(--bg-alt);
      border-radius: 8px;
    }

    .toc ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .toc li {
      margin-bottom: 6px;
    }

    .toc li.toc-indent {
      padding-left: 20px;
    }

    .toc a {
      font-size: 14px;
      color: var(--accent);
      text-decoration: none;
    }

    .toc a:hover {
      text-decoration: underline;
    }

    /* Document content */
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

    mark {
      background: var(--highlight);
      color: inherit;
      padding: 1px 2px;
      border-radius: 2px;
    }

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
      [role="tab"] { font-size: 13px; padding: 8px 12px; }
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
      .search-bar, .footer { display: none; }
      [role="tablist"] { display: none; }
      [role="tabpanel"][hidden] { display: block !important; }
      .toc { background: none; border: 1px solid #ccc; }
      h1 { font-size: 18pt; }
      h2 { font-size: 14pt; }
      a { color: #000; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="page-header">
      <h1>${escapeHtml(companyName)}</h1>
      <p class="meta">Compliance Documents</p>
    </header>

    <div class="search-bar">
      <input type="search" id="search" placeholder="Search across all documents..." aria-label="Search documents">
      <div class="search-info" id="search-info"></div>
    </div>

    <div role="tablist" aria-label="Documents" id="tablist">
        ${tabButtons}
    </div>

${tabPanels}

    <footer class="footer">
      Generated by Codepliant
    </footer>
  </div>

  <script>
    (function() {
      var tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      var panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
      var searchInput = document.getElementById('search');
      var searchInfo = document.getElementById('search-info');

      function activate(tab) {
        tabs.forEach(function(t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); t.tabIndex = -1; });
        panels.forEach(function(p) { p.hidden = true; });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.tabIndex = 0;
        tab.focus();
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() { activate(tab); });
      });

      document.getElementById('tablist').addEventListener('keydown', function(e) {
        var idx = tabs.indexOf(document.activeElement);
        if (idx < 0) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          activate(tabs[(idx + 1) % tabs.length]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          activate(tabs[(idx - 1 + tabs.length) % tabs.length]);
        } else if (e.key === 'Home') {
          e.preventDefault();
          activate(tabs[0]);
        } else if (e.key === 'End') {
          e.preventDefault();
          activate(tabs[tabs.length - 1]);
        }
      });

      /* Search: highlight matches across all panels */
      var originals = panels.map(function(p) { return p.querySelector('.doc-content').innerHTML; });

      function clearHighlights() {
        panels.forEach(function(p, i) { p.querySelector('.doc-content').innerHTML = originals[i]; });
        searchInfo.textContent = '';
      }

      function highlightText(html, query) {
        if (!query) return { html: html, count: 0 };
        var escaped = query.replace(/[.*+?^$|()\\[\\]{}]/g, '\\$&');
        var re = new RegExp('(?![^<]*>)(' + escaped + ')', 'gi');
        var count = 0;
        var result = html.replace(re, function(m) { count++; return '<mark>' + m + '</mark>'; });
        return { html: result, count: count };
      }

      searchInput.addEventListener('input', function() {
        var q = searchInput.value.trim();
        if (!q) { clearHighlights(); return; }
        var total = 0;
        var matchedTabs = [];
        panels.forEach(function(p, i) {
          var r = highlightText(originals[i], q);
          p.querySelector('.doc-content').innerHTML = r.html;
          total += r.count;
          if (r.count > 0) matchedTabs.push(tabs[i].textContent + ' (' + r.count + ')');
        });
        searchInfo.textContent = total > 0 ? total + ' match' + (total === 1 ? '' : 'es') + ': ' + matchedTabs.join(', ') : 'No matches found';
      });

      /* Smooth scroll for TOC links */
      document.addEventListener('click', function(e) {
        var a = e.target.closest('.toc a');
        if (!a) return;
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Writes the compliance page HTML to the output directory.
 */
export function writeCompliancePage(
  docs: GeneratedDocument[],
  outputDir: string,
  options: {
    companyName?: string;
    lastUpdated?: string;
  } = {}
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const html = generateCompliancePage(docs, options);
  const filePath = path.join(outputDir, "compliance.html");
  fs.writeFileSync(filePath, html, "utf-8");
  return [filePath];
}
