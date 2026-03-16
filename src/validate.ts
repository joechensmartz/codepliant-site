import * as fs from "fs";
import * as path from "path";

export interface DocumentValidation {
  name: string;
  filename: string;
  totalSections: number;
  completeSections: number;
  emptySections: string[];
}

export interface ValidateResult {
  documents: DocumentValidation[];
  allComplete: boolean;
}

/**
 * Extract H2 (## ) sections from a markdown document and check whether
 * each section has meaningful content beneath it (not just whitespace or
 * another heading).
 */
function validateMarkdownSections(content: string): {
  totalSections: number;
  completeSections: number;
  emptySections: string[];
} {
  const lines = content.split("\n");
  const sections: { heading: string; startLine: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^##\s+(.+)/);
    if (match) {
      sections.push({ heading: match[1].trim(), startLine: i });
    }
  }

  if (sections.length === 0) {
    return { totalSections: 0, completeSections: 0, emptySections: [] };
  }

  const emptySections: string[] = [];
  let completeSections = 0;

  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].startLine + 1;
    const end = i + 1 < sections.length ? sections[i + 1].startLine : lines.length;

    // Collect all lines between this heading and the next
    const sectionLines = lines.slice(start, end);

    // Check if there's meaningful content (not just whitespace, not just ---,
    // not just another heading)
    const hasContent = sectionLines.some((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        trimmed !== "---" &&
        !trimmed.startsWith("#") &&
        trimmed !== ">"
      );
    });

    if (hasContent) {
      completeSections++;
    } else {
      emptySections.push(sections[i].heading);
    }
  }

  return {
    totalSections: sections.length,
    completeSections,
    emptySections,
  };
}

/**
 * Derive a human-readable document name from a filename.
 * e.g., "PRIVACY_POLICY.md" -> "Privacy Policy"
 */
function filenameToName(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Validate ALL generated documents in the output directory for completeness.
 * Checks each section has content (not just headers).
 *
 * Reports per-document: "Privacy Policy: 13/13 sections complete"
 */
export function validateDocuments(outputDir: string): ValidateResult {
  const absDir = path.resolve(outputDir);

  if (!fs.existsSync(absDir)) {
    return { documents: [], allComplete: true };
  }

  const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".md"));
  const documents: DocumentValidation[] = [];

  for (const file of files) {
    const filePath = path.join(absDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { totalSections, completeSections, emptySections } =
      validateMarkdownSections(content);

    // Skip files with no sections (e.g., changelog)
    if (totalSections === 0) continue;

    documents.push({
      name: filenameToName(file),
      filename: file,
      totalSections,
      completeSections,
      emptySections,
    });
  }

  // Sort by name for deterministic output
  documents.sort((a, b) => a.name.localeCompare(b.name));

  const allComplete = documents.every(
    (d) => d.completeSections === d.totalSections,
  );

  return { documents, allComplete };
}
