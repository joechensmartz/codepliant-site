import * as fs from "fs";
import * as path from "path";
import type { GeneratedDocument } from "../generator/index.js";
import type { ScanResult } from "../scanner/index.js";
import type { CodepliantConfig } from "../config.js";

const VERSION = "8.0.0";

export interface JsonOutputDocument {
  name: string;
  filename: string;
  content: string;
  sections: string[];
}

export interface JsonOutputResult {
  version: string;
  generatedAt: string;
  project: {
    name: string;
    path: string;
  };
  scan: {
    services: Array<{
      name: string;
      category: string;
      dataCollected: string[];
    }>;
    dataCategories: Array<{
      category: string;
      description: string;
      sources: string[];
    }>;
    complianceNeeds: Array<{
      document: string;
      reason: string;
      priority: string;
    }>;
  };
  documents: JsonOutputDocument[];
  compliance: {
    score: number;
    status: string;
    jurisdictions: string[];
  };
}

/**
 * Extracts markdown section headings (## level) from document content.
 */
function extractSections(content: string): string[] {
  const sections: string[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^#{1,3}\s+(.+)/);
    if (match) {
      sections.push(match[1].trim());
    }
  }
  return sections;
}

/**
 * Computes a compliance score based on which required documents exist in the output.
 */
function computeScore(scanResult: ScanResult, docs: GeneratedDocument[]): number {
  if (scanResult.complianceNeeds.length === 0) return 100;

  const generatedFilenames = new Set(docs.map(d => d.filename));
  let score = 0;
  let total = 0;

  for (const need of scanResult.complianceNeeds) {
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;

    // Map document name to expected filename
    const expectedFilename = need.document
      .toUpperCase()
      .replace(/\s+/g, "_") + ".md";
    if (generatedFilenames.has(expectedFilename)) {
      score += weight;
    }
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

/**
 * Determines compliance status from score.
 */
function getStatus(score: number): string {
  if (score >= 80) return "compliant";
  if (score >= 50) return "partial";
  return "non-compliant";
}

/**
 * Generates a structured JSON output object for API consumption.
 */
export function generateJsonOutput(
  docs: GeneratedDocument[],
  scanResult: ScanResult,
  config?: CodepliantConfig
): JsonOutputResult {
  const score = computeScore(scanResult, docs);

  const jurisdictions: string[] = [];
  if (config?.jurisdiction) {
    jurisdictions.push(config.jurisdiction);
  }
  if (config?.jurisdictions) {
    for (const j of config.jurisdictions) {
      if (!jurisdictions.includes(j)) {
        jurisdictions.push(j);
      }
    }
  }

  return {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    project: {
      name: scanResult.projectName,
      path: scanResult.projectPath,
    },
    scan: {
      services: scanResult.services.map(s => ({
        name: s.name,
        category: s.category,
        dataCollected: s.dataCollected,
      })),
      dataCategories: scanResult.dataCategories.map(dc => ({
        category: dc.category,
        description: dc.description,
        sources: dc.sources,
      })),
      complianceNeeds: scanResult.complianceNeeds.map(cn => ({
        document: cn.document,
        reason: cn.reason,
        priority: cn.priority,
      })),
    },
    documents: docs.map(doc => ({
      name: doc.name,
      filename: doc.filename,
      content: doc.content,
      sections: extractSections(doc.content),
    })),
    compliance: {
      score,
      status: getStatus(score),
      jurisdictions,
    },
  };
}

/**
 * Writes JSON output to a file and returns the file path.
 */
export function writeJsonOutput(
  docs: GeneratedDocument[],
  outputDir: string,
  scanResult: ScanResult,
  config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonData = generateJsonOutput(docs, scanResult, config);
  const filePath = path.join(outputDir, "compliance.json");
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
  return [filePath];
}
