import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

/**
 * Enhances markdown documents with:
 * - Table of contents per document
 * - Cross-references between documents
 * - "Related documents" section at bottom
 * - Metadata header (generated date, version, project)
 */

// ── Document relationship map ───────────────────────────────────────────

interface RelationshipEntry {
  /** Filename patterns (substring match) */
  patterns: string[];
  /** Human-readable relationship description */
  description: string;
}

/**
 * Maps document categories to related document patterns.
 * Used to auto-generate "Related Documents" sections.
 */
const RELATIONSHIPS: Record<string, RelationshipEntry[]> = {
  PRIVACY_POLICY: [
    { patterns: ["COOKIE_POLICY"], description: "Cookie Policy" },
    { patterns: ["DATA_PROCESSING_AGREEMENT"], description: "Data Processing Agreement" },
    { patterns: ["DSAR_HANDLING_GUIDE"], description: "DSAR Handling Guide" },
    { patterns: ["DATA_RETENTION_POLICY"], description: "Data Retention Policy" },
    { patterns: ["CONSENT_MANAGEMENT"], description: "Consent Management Guide" },
    { patterns: ["SUBPROCESSOR_LIST"], description: "Sub-Processor List" },
    { patterns: ["PRIVACY_IMPACT_ASSESSMENT"], description: "Privacy Impact Assessment" },
    { patterns: ["PRIVACY_BY_DESIGN"], description: "Privacy by Design Checklist" },
    { patterns: ["DATA_CLASSIFICATION"], description: "Data Classification Report" },
  ],
  TERMS_OF_SERVICE: [
    { patterns: ["PRIVACY_POLICY"], description: "Privacy Policy" },
    { patterns: ["ACCEPTABLE_USE_POLICY"], description: "Acceptable Use Policy" },
    { patterns: ["REFUND_POLICY"], description: "Refund Policy" },
    { patterns: ["SERVICE_LEVEL_AGREEMENT"], description: "Service Level Agreement" },
    { patterns: ["COOKIE_POLICY"], description: "Cookie Policy" },
  ],
  SECURITY: [
    { patterns: ["INCIDENT_RESPONSE"], description: "Incident Response Plan" },
    { patterns: ["VULNERABILITY_SCAN"], description: "Vulnerability Scan Report" },
    { patterns: ["SOC2_READINESS"], description: "SOC 2 Readiness Checklist" },
    { patterns: ["ISO_27001"], description: "ISO 27001 Checklist" },
    { patterns: ["PENTEST_SCOPE"], description: "Penetration Test Scope" },
    { patterns: ["AUDIT_LOG_POLICY"], description: "Audit Log Policy" },
    { patterns: ["RISK_REGISTER"], description: "Risk Register" },
  ],
  DATA_PROCESSING_AGREEMENT: [
    { patterns: ["PRIVACY_POLICY"], description: "Privacy Policy" },
    { patterns: ["SUBPROCESSOR_LIST"], description: "Sub-Processor List" },
    { patterns: ["DATA_FLOW_MAP"], description: "Data Flow Map" },
    { patterns: ["SUPPLIER_CODE_OF_CONDUCT"], description: "Supplier Code of Conduct" },
    { patterns: ["THIRD_PARTY_RISK"], description: "Third-Party Risk Assessment" },
  ],
  AI_DISCLOSURE: [
    { patterns: ["AI_ACT_CHECKLIST"], description: "AI Act Compliance Checklist" },
    { patterns: ["AI_MODEL_CARD"], description: "AI Model Card" },
    { patterns: ["ACCEPTABLE_AI_USE"], description: "Acceptable AI Use Policy" },
    { patterns: ["PRIVACY_POLICY"], description: "Privacy Policy" },
    { patterns: ["PRIVACY_BY_DESIGN"], description: "Privacy by Design Checklist" },
  ],
  INCIDENT_RESPONSE: [
    { patterns: ["SECURITY"], description: "Security Policy" },
    { patterns: ["RISK_REGISTER"], description: "Risk Register" },
    { patterns: ["AUDIT_LOG_POLICY"], description: "Audit Log Policy" },
    { patterns: ["COMPLIANCE_NOTES"], description: "Compliance Notes" },
  ],
  COOKIE_POLICY: [
    { patterns: ["PRIVACY_POLICY"], description: "Privacy Policy" },
    { patterns: ["CONSENT_MANAGEMENT"], description: "Consent Management Guide" },
  ],
  SUPPLIER_CODE_OF_CONDUCT: [
    { patterns: ["DATA_PROCESSING_AGREEMENT"], description: "Data Processing Agreement" },
    { patterns: ["SUBPROCESSOR_LIST"], description: "Sub-Processor List" },
    { patterns: ["THIRD_PARTY_RISK"], description: "Third-Party Risk Assessment" },
    { patterns: ["VENDOR_CONTACTS"], description: "Vendor Contacts Directory" },
    { patterns: ["SECURITY"], description: "Security Policy" },
  ],
  PENTEST_SCOPE: [
    { patterns: ["SECURITY"], description: "Security Policy" },
    { patterns: ["VULNERABILITY_SCAN"], description: "Vulnerability Scan Report" },
    { patterns: ["RISK_REGISTER"], description: "Risk Register" },
    { patterns: ["INCIDENT_RESPONSE"], description: "Incident Response Plan" },
  ],
  PRIVACY_BY_DESIGN: [
    { patterns: ["PRIVACY_POLICY"], description: "Privacy Policy" },
    { patterns: ["PRIVACY_IMPACT_ASSESSMENT"], description: "Privacy Impact Assessment" },
    { patterns: ["DATA_CLASSIFICATION"], description: "Data Classification Report" },
    { patterns: ["DATA_RETENTION_POLICY"], description: "Data Retention Policy" },
    { patterns: ["CONSENT_MANAGEMENT"], description: "Consent Management Guide" },
  ],
};

/**
 * Extract headings from markdown content to build a table of contents.
 */
function extractHeadings(content: string): Array<{ level: number; text: string; anchor: string }> {
  const headings: Array<{ level: number; text: string; anchor: string }> = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // Skip the top-level title (the first h1)
      if (level === 1 && headings.length === 0) continue;
      const anchor = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      headings.push({ level, text, anchor });
    }
  }

  return headings;
}

/**
 * Generate a markdown table of contents from headings.
 */
function buildTableOfContents(headings: Array<{ level: number; text: string; anchor: string }>): string {
  if (headings.length === 0) return "";

  const lines: string[] = [];
  lines.push("## Table of Contents");
  lines.push("");

  for (const h of headings) {
    // Only include h2 and h3 in TOC to keep it manageable
    if (h.level > 3) continue;
    const indent = "  ".repeat(h.level - 2);
    lines.push(`${indent}- [${h.text}](#${h.anchor})`);
  }

  return lines.join("\n");
}

/**
 * Find related documents from the generated document set.
 */
function findRelatedDocuments(
  docFilename: string,
  allDocs: GeneratedDocument[]
): Array<{ name: string; filename: string }> {
  // Get the base key from the filename (e.g., PRIVACY_POLICY from PRIVACY_POLICY.md)
  const baseKey = docFilename.replace(/\.md$/, "");
  const relationships = RELATIONSHIPS[baseKey];
  if (!relationships) return [];

  const related: Array<{ name: string; filename: string }> = [];
  const allFilenames = allDocs.map((d) => d.filename);

  for (const rel of relationships) {
    for (const pattern of rel.patterns) {
      const match = allFilenames.find((f) => f.includes(pattern));
      if (match) {
        const matchDoc = allDocs.find((d) => d.filename === match);
        if (matchDoc) {
          related.push({ name: matchDoc.name, filename: matchDoc.filename });
        }
        break;
      }
    }
  }

  return related;
}

/**
 * Build a metadata header for a document.
 */
function buildMetadataHeader(
  doc: GeneratedDocument,
  projectName?: string,
  version?: string
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines: string[] = [];
  lines.push("---");
  lines.push(`document: ${doc.name}`);
  lines.push(`generated: ${date}`);
  if (projectName) {
    lines.push(`project: ${projectName}`);
  }
  if (version) {
    lines.push(`version: ${version}`);
  }
  lines.push(`generator: codepliant`);
  lines.push("---");
  return lines.join("\n");
}

/**
 * Build a "Related Documents" section for a document.
 */
function buildRelatedDocumentsSection(
  related: Array<{ name: string; filename: string }>
): string {
  if (related.length === 0) return "";

  const lines: string[] = [];
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Related Documents");
  lines.push("");
  for (const r of related) {
    lines.push(`- [${r.name}](./${r.filename})`);
  }

  return lines.join("\n");
}

/**
 * Add cross-reference links within document content.
 * Replaces mentions of other document names with markdown links.
 */
function addCrossReferences(
  content: string,
  allDocs: GeneratedDocument[],
  currentFilename: string
): string {
  let result = content;

  for (const doc of allDocs) {
    if (doc.filename === currentFilename) continue;

    // Avoid replacing inside markdown links, headings, or the metadata block
    // Use a simple approach: replace "See the <Doc Name>" or "refer to the <Doc Name>"
    // patterns with linked versions
    const escapedName = doc.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const crossRefPattern = new RegExp(
      `((?:see|refer to|described in|detailed in|outlined in)\\s+(?:the\\s+|our\\s+)?)` +
        `(${escapedName})` +
        `(?![\\]\\(])`,
      "gi"
    );
    result = result.replace(crossRefPattern, `$1[$2](./${doc.filename})`);
  }

  return result;
}

export interface EnhanceOptions {
  /** Add a table of contents to each document */
  tableOfContents?: boolean;
  /** Add cross-references between documents */
  crossReferences?: boolean;
  /** Add "Related Documents" section at bottom */
  relatedDocuments?: boolean;
  /** Add metadata header */
  metadataHeader?: boolean;
  /** Project name for metadata */
  projectName?: string;
  /** Version string for metadata */
  version?: string;
}

/**
 * Enhances an array of generated documents with additional markdown features.
 * Returns new document objects with enhanced content (does not mutate originals).
 */
export function enhanceMarkdownDocuments(
  docs: GeneratedDocument[],
  options?: EnhanceOptions
): GeneratedDocument[] {
  const opts: Required<EnhanceOptions> = {
    tableOfContents: options?.tableOfContents ?? true,
    crossReferences: options?.crossReferences ?? true,
    relatedDocuments: options?.relatedDocuments ?? true,
    metadataHeader: options?.metadataHeader ?? true,
    projectName: options?.projectName ?? "",
    version: options?.version ?? "",
  };

  return docs.map((doc) => {
    let content = doc.content;

    // 1. Add cross-references (before TOC so headings aren't affected)
    if (opts.crossReferences) {
      content = addCrossReferences(content, docs, doc.filename);
    }

    // 2. Build and insert table of contents
    if (opts.tableOfContents) {
      const headings = extractHeadings(content);
      const toc = buildTableOfContents(headings);
      if (toc) {
        // Insert TOC after the first heading and any immediately following lines
        // (like "Last updated:" or description paragraph)
        const lines = content.split("\n");
        let insertIdx = 1; // After the first line (# Title)

        // Skip blank lines and paragraph text after the title until we hit the first ## heading
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].startsWith("## ")) {
            insertIdx = i;
            break;
          }
          // If we're past the initial metadata/description block (empty line after text),
          // insert before the first section
          insertIdx = i;
        }

        // Find the first ## heading to insert before it
        const firstH2Idx = lines.findIndex((l, idx) => idx > 0 && l.startsWith("## "));
        if (firstH2Idx > 0) {
          insertIdx = firstH2Idx;
        }

        lines.splice(insertIdx, 0, "", toc, "");
        content = lines.join("\n");
      }
    }

    // 3. Add metadata header at the top
    if (opts.metadataHeader) {
      const header = buildMetadataHeader(doc, opts.projectName, opts.version);
      content = header + "\n\n" + content;
    }

    // 4. Add related documents at the bottom
    if (opts.relatedDocuments) {
      const related = findRelatedDocuments(doc.filename, docs);
      const relatedSection = buildRelatedDocumentsSection(related);
      if (relatedSection) {
        content = content + "\n" + relatedSection;
      }
    }

    return {
      name: doc.name,
      filename: doc.filename,
      content,
    };
  });
}
