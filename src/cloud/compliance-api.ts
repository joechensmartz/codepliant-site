/**
 * Compliance API Spec Generator
 *
 * `codepliant publish --api` generates a JSON API endpoint specification
 * that describes the compliance status of a project. This can be consumed
 * by dashboards, CI/CD pipelines, or other tools.
 */

import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { ComplianceScore } from "../scoring/index.js";

export interface GenerateApiSpecOptions {
  scanResult: ScanResult;
  docs: GeneratedDocument[];
  score: ComplianceScore;
  outputDir: string;
  baseUrl?: string;
}

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  response: string;
}

interface ApiSpec {
  version: string;
  project: string;
  generatedAt: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  documents: { name: string; filename: string }[];
  status: {
    project: string;
    complianceScore: number;
    grade: string;
    servicesDetected: number;
    documentsGenerated: number;
    missingDocuments: string[];
  };
}

/**
 * Generate an API spec describing compliance endpoints.
 */
export function generateApiSpec(options: GenerateApiSpecOptions): ApiSpec {
  const { scanResult, docs, score, baseUrl } = options;

  const endpoints: ApiEndpoint[] = [
    {
      path: "/status",
      method: "GET",
      description: "Get compliance status overview",
      response: "ComplianceStatus",
    },
    {
      path: "/documents",
      method: "GET",
      description: "List all generated compliance documents",
      response: "DocumentList",
    },
    {
      path: "/score",
      method: "GET",
      description: "Get detailed compliance score breakdown",
      response: "ComplianceScore",
    },
    {
      path: "/services",
      method: "GET",
      description: "List detected services and data flows",
      response: "ServiceList",
    },
  ];

  // Extract missing documents from recommendations
  const missingDocuments: string[] = [];
  if (score.recommendations) {
    for (const rec of score.recommendations) {
      if (rec.title.startsWith("Generate ")) {
        missingDocuments.push(rec.title.replace("Generate ", ""));
      }
    }
  }
  // Also check component details for missing docs
  if (score.components) {
    for (const comp of score.components) {
      if (comp.details) {
        for (const detail of comp.details) {
          if (detail.startsWith("Missing: ")) {
            const docName = detail.replace("Missing: ", "");
            if (!missingDocuments.includes(docName)) {
              missingDocuments.push(docName);
            }
          }
        }
      }
    }
  }

  return {
    version: "1.0.0",
    project: scanResult.projectName,
    generatedAt: new Date().toISOString(),
    baseUrl: baseUrl || "/api/compliance",
    endpoints,
    documents: docs.map((d) => ({ name: d.name, filename: d.filename })),
    status: {
      project: scanResult.projectName,
      complianceScore: score.total,
      grade: score.grade,
      servicesDetected: scanResult.services.length,
      documentsGenerated: docs.length,
      missingDocuments,
    },
  };
}

/**
 * Write the API spec to a JSON file in the output directory.
 */
export function writeApiSpec(options: GenerateApiSpecOptions): string {
  const spec = generateApiSpec(options);
  const outputDir = options.outputDir;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, "compliance-api.json");
  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2), "utf-8");
  return filePath;
}
