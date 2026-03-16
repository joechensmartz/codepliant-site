import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

/**
 * Maximum characters per Notion page. Notion has a practical limit of ~1MB
 * per page; we use a conservative character limit to stay well within bounds
 * even after Notion's internal rendering overhead.
 */
const NOTION_PAGE_CHAR_LIMIT = 80_000;

/**
 * Generates Notion-compatible frontmatter for a document.
 * Notion recognizes YAML frontmatter when importing Markdown files.
 */
function notionFrontmatter(opts: {
  title: string;
  companyName?: string;
  lastUpdated: string;
  partNumber?: number;
  totalParts?: number;
}): string {
  const lines = [
    "---",
    `title: "${opts.title}"`,
    `date: "${opts.lastUpdated}"`,
    `type: "compliance"`,
  ];

  if (opts.companyName) {
    lines.push(`company: "${opts.companyName}"`);
  }

  if (opts.partNumber !== undefined && opts.totalParts !== undefined && opts.totalParts > 1) {
    lines.push(`part: ${opts.partNumber}`);
    lines.push(`totalParts: ${opts.totalParts}`);
  }

  lines.push("---", "");
  return lines.join("\n");
}

/**
 * Splits a markdown document at heading boundaries so that each chunk
 * stays within the Notion page character limit.
 *
 * Strategy:
 * 1. Split at top-level headings (## or #).
 * 2. If a single section still exceeds the limit, split at sub-headings (###).
 * 3. As a last resort, split on paragraph boundaries.
 */
export function splitForNotion(content: string, limit: number = NOTION_PAGE_CHAR_LIMIT): string[] {
  if (content.length <= limit) {
    return [content];
  }

  // Split at ## headings (keeping the heading with its section)
  const sections = splitAtHeadings(content, /^## /m);

  const pages: string[] = [];
  let current = "";

  for (const section of sections) {
    if (current.length + section.length > limit && current.length > 0) {
      pages.push(current.trimEnd());
      current = "";
    }

    if (section.length > limit) {
      // Section itself is too large — split at ### headings
      if (current.length > 0) {
        pages.push(current.trimEnd());
        current = "";
      }
      const subSections = splitAtHeadings(section, /^### /m);
      let subCurrent = "";
      for (const sub of subSections) {
        if (subCurrent.length + sub.length > limit && subCurrent.length > 0) {
          pages.push(subCurrent.trimEnd());
          subCurrent = "";
        }
        if (sub.length > limit) {
          // Last resort: split on double newlines (paragraph boundaries)
          if (subCurrent.length > 0) {
            pages.push(subCurrent.trimEnd());
            subCurrent = "";
          }
          const paragraphs = sub.split(/\n\n+/);
          let paraCurrent = "";
          for (const para of paragraphs) {
            if (paraCurrent.length + para.length + 2 > limit && paraCurrent.length > 0) {
              pages.push(paraCurrent.trimEnd());
              paraCurrent = "";
            }
            paraCurrent += (paraCurrent ? "\n\n" : "") + para;
          }
          if (paraCurrent.length > 0) {
            subCurrent = paraCurrent;
          }
        } else {
          subCurrent += sub;
        }
      }
      if (subCurrent.length > 0) {
        current = subCurrent;
      }
    } else {
      current += section;
    }
  }

  if (current.length > 0) {
    pages.push(current.trimEnd());
  }

  return pages;
}

/**
 * Splits markdown content at heading boundaries, keeping each heading
 * with its following content.
 */
function splitAtHeadings(content: string, headingPattern: RegExp): string[] {
  const lines = content.split("\n");
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (headingPattern.test(line) && current.length > 0) {
      sections.push(current.join("\n") + "\n");
      current = [];
    }
    current.push(line);
  }

  if (current.length > 0) {
    sections.push(current.join("\n") + "\n");
  }

  return sections;
}

/**
 * Sanitizes a filename for use inside a ZIP archive.
 * Replaces characters that are problematic across platforms.
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, "_");
}

/**
 * Minimal ZIP file builder using only Node.js built-ins (zlib).
 * Produces a valid ZIP archive with DEFLATE-compressed entries.
 *
 * ZIP format reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
 */
function buildZip(entries: Array<{ name: string; content: string }>): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, "utf-8");
    const contentBuffer = Buffer.from(entry.content, "utf-8");
    const compressed = zlib.deflateRawSync(contentBuffer);

    // CRC-32
    const crc = crc32(contentBuffer);

    // Local file header (30 bytes + name + compressed data)
    const local = Buffer.alloc(30 + nameBuffer.length);
    local.writeUInt32LE(0x04034b50, 0);           // local file header signature
    local.writeUInt16LE(20, 4);                     // version needed to extract
    local.writeUInt16LE(0, 6);                      // general purpose bit flag
    local.writeUInt16LE(8, 8);                      // compression method: DEFLATE
    local.writeUInt16LE(0, 10);                     // last mod file time
    local.writeUInt16LE(0, 12);                     // last mod file date
    local.writeUInt32LE(crc, 14);                   // crc-32
    local.writeUInt32LE(compressed.length, 18);     // compressed size
    local.writeUInt32LE(contentBuffer.length, 22);  // uncompressed size
    local.writeUInt16LE(nameBuffer.length, 26);     // file name length
    local.writeUInt16LE(0, 28);                     // extra field length
    nameBuffer.copy(local, 30);

    localHeaders.push(local);
    localHeaders.push(compressed);

    // Central directory header (46 bytes + name)
    const central = Buffer.alloc(46 + nameBuffer.length);
    central.writeUInt32LE(0x02014b50, 0);           // central directory header signature
    central.writeUInt16LE(20, 4);                    // version made by
    central.writeUInt16LE(20, 6);                    // version needed to extract
    central.writeUInt16LE(0, 8);                     // general purpose bit flag
    central.writeUInt16LE(8, 10);                    // compression method: DEFLATE
    central.writeUInt16LE(0, 12);                    // last mod file time
    central.writeUInt16LE(0, 14);                    // last mod file date
    central.writeUInt32LE(crc, 16);                  // crc-32
    central.writeUInt32LE(compressed.length, 20);    // compressed size
    central.writeUInt32LE(contentBuffer.length, 24); // uncompressed size
    central.writeUInt16LE(nameBuffer.length, 28);    // file name length
    central.writeUInt16LE(0, 30);                    // extra field length
    central.writeUInt16LE(0, 32);                    // file comment length
    central.writeUInt16LE(0, 34);                    // disk number start
    central.writeUInt16LE(0, 36);                    // internal file attributes
    central.writeUInt32LE(0, 38);                    // external file attributes
    central.writeUInt32LE(offset, 42);               // relative offset of local header
    nameBuffer.copy(central, 46);

    centralHeaders.push(central);
    offset += local.length + compressed.length;
  }

  // End of central directory record (22 bytes)
  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((sum, buf) => sum + buf.length, 0);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);              // end of central directory signature
  eocd.writeUInt16LE(0, 4);                        // number of this disk
  eocd.writeUInt16LE(0, 6);                        // disk where central directory starts
  eocd.writeUInt16LE(entries.length, 8);           // number of central directory records on this disk
  eocd.writeUInt16LE(entries.length, 10);          // total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12);          // size of central directory
  eocd.writeUInt32LE(centralDirOffset, 16);        // offset of start of central directory
  eocd.writeUInt16LE(0, 20);                       // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

/**
 * CRC-32 computation (used by ZIP format).
 */
function crc32(buf: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Generates a ZIP file containing all compliance documents formatted for
 * Notion import. Large documents are split into multiple pages.
 *
 * Returns the list of file paths written.
 */
export function writeNotionExport(
  docs: GeneratedDocument[],
  outputDir: string,
  config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const lastUpdated = new Date().toISOString().split("T")[0];
  const companyName = config?.companyName;

  const zipEntries: Array<{ name: string; content: string }> = [];

  for (const doc of docs) {
    const pages = splitForNotion(doc.content);
    const baseName = sanitizeFilename(doc.name);

    if (pages.length === 1) {
      const frontmatter = notionFrontmatter({
        title: doc.name,
        companyName,
        lastUpdated,
      });
      zipEntries.push({
        name: `${baseName}.md`,
        content: frontmatter + pages[0],
      });
    } else {
      // Multiple pages — create numbered files
      for (let i = 0; i < pages.length; i++) {
        const partTitle = `${doc.name} (Part ${i + 1} of ${pages.length})`;
        const frontmatter = notionFrontmatter({
          title: partTitle,
          companyName,
          lastUpdated,
          partNumber: i + 1,
          totalParts: pages.length,
        });
        zipEntries.push({
          name: `${baseName}_part_${i + 1}.md`,
          content: frontmatter + pages[i],
        });
      }
    }
  }

  // Add an index page listing all documents
  const indexLines = [
    notionFrontmatter({
      title: "Compliance Documents Index",
      companyName,
      lastUpdated,
    }),
    "# Compliance Documents",
    "",
    `*Generated on ${lastUpdated}${companyName ? ` for ${companyName}` : ""}*`,
    "",
    "## Documents",
    "",
  ];

  for (const entry of zipEntries) {
    const displayName = entry.name.replace(/_/g, " ").replace(/\.md$/, "");
    indexLines.push(`- [${displayName}](./${entry.name})`);
  }

  indexLines.push("", "---", "", "*Generated by Codepliant*", "");

  zipEntries.unshift({
    name: "index.md",
    content: indexLines.join("\n"),
  });

  const zipBuffer = buildZip(zipEntries);
  const zipPath = path.join(outputDir, "compliance-notion.zip");
  fs.writeFileSync(zipPath, zipBuffer);

  return [zipPath];
}
