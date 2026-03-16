import * as fs from "fs";
import * as path from "path";
import { scan } from "./scanner/index.js";
import { generateDocuments, type GeneratedDocument } from "./generator/index.js";
import { loadConfig } from "./config.js";

export interface LintIssue {
  document: string;
  severity: "error" | "warning";
  message: string;
}

export interface LintResult {
  issues: LintIssue[];
  passed: boolean;
  documentsChecked: number;
  documentsExpected: number;
}

/**
 * Extract markdown sections (## headings) from a document.
 */
function extractSections(content: string): Set<string> {
  const sections = new Set<string>();
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      sections.add(match[1].trim());
    }
  }
  return sections;
}

/**
 * Check if a document contains placeholder values that should have been customized.
 */
function findPlaceholders(content: string): string[] {
  const patterns = [
    /\[Your Company Name\]/g,
    /\[your-email@example\.com\]/g,
    /\[https:\/\/yoursite\.com\]/g,
    /\[security@example\.com\]/g,
    /\[Compliance Officer Name\]/g,
    /\[Your DPO Name\]/g,
    /\[INSERT[^\]]*\]/gi,
    /\[TODO[^\]]*\]/gi,
    /\[CHANGEME[^\]]*\]/gi,
  ];

  const found: string[] = [];
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const m of matches) {
        if (!found.includes(m)) {
          found.push(m);
        }
      }
    }
  }
  return found;
}

/**
 * Lint existing compliance documents against what codepliant would generate.
 *
 * Checks:
 * 1. Missing documents that should exist based on the scan
 * 2. Missing sections within existing documents
 * 3. Placeholder values that haven't been customized
 * 4. Outdated documents (older than configured threshold)
 */
export function lintDocuments(
  projectPath: string,
  outputDir: string
): LintResult {
  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const issues: LintIssue[] = [];

  // Scan the project
  const scanResult = scan(absProjectPath);
  const config = loadConfig(absProjectPath);

  // Generate what codepliant would produce
  const expectedDocs = generateDocuments(scanResult, config);

  let documentsChecked = 0;

  for (const expected of expectedDocs) {
    const filePath = path.join(absOutputDir, expected.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      issues.push({
        document: expected.name,
        severity: "error",
        message: `Missing document: ${expected.filename}. Run 'codepliant go' to generate it.`,
      });
      continue;
    }

    documentsChecked++;

    // Read existing content
    let existingContent: string;
    try {
      existingContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      issues.push({
        document: expected.name,
        severity: "error",
        message: `Could not read ${expected.filename}.`,
      });
      continue;
    }

    // Check for empty files
    if (existingContent.trim().length === 0) {
      issues.push({
        document: expected.name,
        severity: "error",
        message: `${expected.filename} is empty.`,
      });
      continue;
    }

    // Check for missing sections
    const expectedSections = extractSections(expected.content);
    const existingSections = extractSections(existingContent);

    for (const section of expectedSections) {
      if (!existingSections.has(section)) {
        issues.push({
          document: expected.name,
          severity: "warning",
          message: `Missing section "${section}" in ${expected.filename}.`,
        });
      }
    }

    // Check for placeholders
    const placeholders = findPlaceholders(existingContent);
    if (placeholders.length > 0) {
      issues.push({
        document: expected.name,
        severity: "warning",
        message: `${expected.filename} contains placeholder(s): ${placeholders.join(", ")}. Replace them with actual values.`,
      });
    }

    // Check if the document has a "Last updated" date
    const dateMatch = existingContent.match(/\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const docDate = new Date(dateMatch[1]);
      const now = new Date();
      const daysSinceUpdate = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate > 180) {
        issues.push({
          document: expected.name,
          severity: "warning",
          message: `${expected.filename} was last updated ${daysSinceUpdate} days ago. Consider regenerating.`,
        });
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    issues,
    passed: !hasErrors,
    documentsChecked,
    documentsExpected: expectedDocs.length,
  };
}
