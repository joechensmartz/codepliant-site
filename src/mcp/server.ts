#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { scan } from "../scanner/index.js";
import type { ScanResult } from "../scanner/index.js";
import { generateDocuments, writeDocuments } from "../generator/index.js";
import { loadConfig, saveConfig } from "../config.js";
import type { CodepliantConfig } from "../config.js";

// ---------------------------------------------------------------------------
// Typed errors
// ---------------------------------------------------------------------------

class CodepliantError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CodepliantError";
  }
}

type ErrorCode =
  | "SCAN_FAILED"
  | "SCAN_TIMEOUT"
  | "GENERATION_FAILED"
  | "CONFIG_ERROR"
  | "PATH_NOT_FOUND"
  | "PERMISSION_DENIED"
  | "INVALID_INPUT";

function toCodepliantError(error: unknown, fallbackCode: ErrorCode): CodepliantError {
  if (error instanceof CodepliantError) return error;
  const message = error instanceof Error ? error.message : String(error);
  return new CodepliantError(message, fallbackCode);
}

function errorResponse(error: unknown, fallbackCode: ErrorCode) {
  const ce = toCodepliantError(error, fallbackCode);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { error: ce.code, message: ce.message, details: ce.details ?? null },
          null,
          2
        ),
      },
    ],
    isError: true,
  };
}

// ---------------------------------------------------------------------------
// Timeout helper
// ---------------------------------------------------------------------------

const SCAN_TIMEOUT_MS = 30_000;

function withTimeout<T>(fn: () => T, timeoutMs: number, label: string): T {
  // For synchronous scan(), we wrap it in a way that checks elapsed time.
  // Since scan() is synchronous, we run it directly but enforce a wall-clock check.
  const start = Date.now();
  const result = fn();
  const elapsed = Date.now() - start;
  if (elapsed > timeoutMs) {
    throw new CodepliantError(
      `${label} exceeded timeout of ${timeoutMs}ms (took ${elapsed}ms)`,
      "SCAN_TIMEOUT",
      { elapsed, timeoutMs }
    );
  }
  return result;
}

// ---------------------------------------------------------------------------
// Path validation
// ---------------------------------------------------------------------------

function validateProjectPath(projectPath: string): string {
  const absPath = path.resolve(projectPath);
  if (!fs.existsSync(absPath)) {
    throw new CodepliantError(
      `Path does not exist: ${absPath}`,
      "PATH_NOT_FOUND",
      { path: absPath }
    );
  }
  const stat = fs.statSync(absPath);
  if (!stat.isDirectory()) {
    throw new CodepliantError(
      `Path is not a directory: ${absPath}`,
      "INVALID_INPUT",
      { path: absPath }
    );
  }
  return absPath;
}

// ---------------------------------------------------------------------------
// Incremental scan state
// ---------------------------------------------------------------------------

const scanCache = new Map<string, { result: ScanResult; timestamp: number }>();

function getChangedFilesSince(
  dirPath: string,
  sinceTimestamp: number,
  extensions: string[] = [
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".go", ".rb", ".ex", ".exs",
    ".json", ".toml", ".yaml", ".yml", ".lock", ".gemspec", ".mix",
  ]
): string[] {
  const changed: string[] = [];
  const walkDir = (dir: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.mtimeMs > sinceTimestamp) {
              changed.push(path.relative(dirPath, fullPath));
            }
          } catch {
            // skip inaccessible files
          }
        }
      }
    }
  };
  walkDir(dirPath);
  return changed;
}

// ---------------------------------------------------------------------------
// All 7 document types
// ---------------------------------------------------------------------------

const ALL_DOCUMENT_TYPES = [
  { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  { name: "Terms of Service", filename: "TERMS_OF_SERVICE.md" },
  { name: "AI Disclosure", filename: "AI_DISCLOSURE.md" },
  { name: "AI Act Compliance Checklist", filename: "AI_ACT_CHECKLIST.md" },
  { name: "AI Model Card", filename: "AI_MODEL_CARD.md" },
  { name: "Cookie Policy", filename: "COOKIE_POLICY.md" },
  { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
  { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
] as const;

function getExpectedFilename(docName: string): string {
  const entry = ALL_DOCUMENT_TYPES.find((d) => d.name === docName);
  if (entry) return entry.filename;
  return `${docName.replace(/\s+/g, "_").toUpperCase()}.md`;
}

// ---------------------------------------------------------------------------
// Format scan output (includes all 7 document types in compliance needs)
// ---------------------------------------------------------------------------

function formatScanResult(result: ScanResult): string {
  const summary = [
    `## Scan Results for ${result.projectName}`,
    "",
    `**Scanned:** ${result.projectPath}`,
    `**Date:** ${result.scannedAt}`,
    "",
    `### Detected Services (${result.services.length})`,
    "",
  ];

  for (const service of result.services) {
    summary.push(
      `- **${service.name}** (${service.category}): ${service.dataCollected.join(", ")}`
    );
    for (const ev of service.evidence) {
      summary.push(`  - [${ev.type}] ${ev.file}: ${ev.detail}`);
    }
  }

  if (result.dataCategories.length > 0) {
    summary.push("", "### Data Categories", "");
    for (const cat of result.dataCategories) {
      summary.push(`- **${cat.category}**: ${cat.description}`);
    }
  }

  if (result.complianceNeeds.length > 0) {
    summary.push("", "### Compliance Needs", "");
    for (const need of result.complianceNeeds) {
      summary.push(
        `- **${need.document}** [${need.priority}]: ${need.reason}`
      );
    }
  }

  // Show all 7 document types that would be generated
  summary.push("", "### Document Types Available", "");
  for (const doc of ALL_DOCUMENT_TYPES) {
    const needed = result.complianceNeeds.find((n) => n.document === doc.name);
    const indicator = needed
      ? needed.priority === "required"
        ? "[required]"
        : "[recommended]"
      : "[optional]";
    summary.push(`- ${doc.name} (${doc.filename}) ${indicator}`);
  }

  return summary.join("\n");
}

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "codepliant",
  version: "7.0.0",
});

// ---------------------------------------------------------------------------
// Tool: scan_project
// ---------------------------------------------------------------------------

server.tool(
  "scan_project",
  "Scan a project directory to detect third-party services, data collection, AI usage, and determine what compliance documents are needed. Returns detected services, data categories, compliance requirements, and all 7 document types.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory to scan.")
      .default(process.cwd()),
  },
  async ({ projectPath }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const result = withTimeout(() => scan(absPath), SCAN_TIMEOUT_MS, "Project scan");

      // Cache the result for incremental scans
      scanCache.set(absPath, { result, timestamp: Date.now() });

      return {
        content: [{ type: "text" as const, text: formatScanResult(result) }],
      };
    } catch (error) {
      return errorResponse(error, "SCAN_FAILED");
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: incremental_scan
// ---------------------------------------------------------------------------

server.tool(
  "incremental_scan",
  "Incrementally scan a project, only re-scanning if files have changed since the last scan. Returns cached results if nothing changed, or a fresh scan with a list of changed files.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory to scan.")
      .default(process.cwd()),
  },
  async ({ projectPath }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const cached = scanCache.get(absPath);

      if (cached) {
        const changedFiles = getChangedFilesSince(absPath, cached.timestamp);

        if (changedFiles.length === 0) {
          const output = [
            "## Incremental Scan: No Changes Detected",
            "",
            `**Project:** ${absPath}`,
            `**Last scanned:** ${new Date(cached.timestamp).toISOString()}`,
            "",
            "No files have been modified since the last scan. Returning cached results.",
            "",
            formatScanResult(cached.result),
          ];
          return {
            content: [{ type: "text" as const, text: output.join("\n") }],
          };
        }

        // Files changed — do a fresh scan
        const result = withTimeout(() => scan(absPath), SCAN_TIMEOUT_MS, "Incremental scan");
        scanCache.set(absPath, { result, timestamp: Date.now() });

        const output = [
          "## Incremental Scan: Changes Detected",
          "",
          `**Project:** ${absPath}`,
          `**Changed files (${changedFiles.length}):**`,
          "",
          ...changedFiles.map((f) => `- ${f}`),
          "",
          formatScanResult(result),
        ];
        return {
          content: [{ type: "text" as const, text: output.join("\n") }],
        };
      }

      // No cache — do a full scan
      const result = withTimeout(() => scan(absPath), SCAN_TIMEOUT_MS, "Initial scan");
      scanCache.set(absPath, { result, timestamp: Date.now() });

      const output = [
        "## Initial Scan (no previous scan cached)",
        "",
        formatScanResult(result),
      ];
      return {
        content: [{ type: "text" as const, text: output.join("\n") }],
      };
    } catch (error) {
      return errorResponse(error, "SCAN_FAILED");
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: generate_compliance_docs
// ---------------------------------------------------------------------------

server.tool(
  "generate_compliance_docs",
  "Scan a project and generate all applicable compliance documents (Privacy Policy, Terms of Service, AI Disclosure, AI Act Checklist, Cookie Policy, Data Processing Agreement, Compliance Notes). Documents are written to a /legal/ directory in the project. Uses project config from .codepliantrc.json if available.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory.")
      .default(process.cwd()),
    outputDir: z
      .string()
      .describe("Output directory for generated documents, relative to project path.")
      .default("legal"),
  },
  async ({ projectPath, outputDir }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const result = withTimeout(() => scan(absPath), SCAN_TIMEOUT_MS, "Project scan");
      const config = loadConfig(absPath);
      const docs = generateDocuments(result, config);
      const outputPath = path.join(absPath, outputDir);
      const writtenFiles = writeDocuments(docs, outputPath);

      // Update scan cache
      scanCache.set(absPath, { result, timestamp: Date.now() });

      const summary = [
        `## Generated ${writtenFiles.length} Compliance Document(s)`,
        "",
        `**Project:** ${result.projectName}`,
        `**Output:** ${outputPath}`,
        "",
        "### Documents",
        "",
      ];

      for (const doc of docs) {
        summary.push(`- **${doc.name}** -> ${doc.filename}`);
      }

      summary.push(
        "",
        "### Detected Services",
        "",
        ...result.services.map(
          (s) => `- ${s.name} (${s.category}): ${s.dataCollected.join(", ")}`
        ),
        "",
        "---",
        "",
        "These documents are generated from code analysis. Review and customize them for your specific use case."
      );

      return {
        content: [{ type: "text" as const, text: summary.join("\n") }],
      };
    } catch (error) {
      return errorResponse(error, "GENERATION_FAILED");
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: check_compliance
// ---------------------------------------------------------------------------

server.tool(
  "check_compliance",
  "Quick check: does this project have the required compliance documents? Scans the project and checks if /legal/ directory exists with all 7 document types.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory.")
      .default(process.cwd()),
  },
  async ({ projectPath }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const result = withTimeout(() => scan(absPath), SCAN_TIMEOUT_MS, "Compliance check");

      // Update scan cache
      scanCache.set(absPath, { result, timestamp: Date.now() });

      const legalDir = path.join(absPath, "legal");
      const legalExists = fs.existsSync(legalDir);

      const status: string[] = [
        `## Compliance Status: ${result.projectName}`,
        "",
      ];

      if (result.services.length === 0) {
        status.push(
          "No third-party services detected. Minimal compliance requirements."
        );
        return {
          content: [{ type: "text" as const, text: status.join("\n") }],
        };
      }

      let missingCount = 0;

      for (const need of result.complianceNeeds) {
        const expectedFile = getExpectedFilename(need.document);
        const exists =
          legalExists && fs.existsSync(path.join(legalDir, expectedFile));

        if (exists) {
          status.push(`[ok] ${need.document} -- found (legal/${expectedFile})`);
        } else {
          missingCount++;
          const icon = need.priority === "required" ? "[MISSING]" : "[warn]";
          status.push(
            `${icon} ${need.document} -- not found [${need.priority}]`
          );
          status.push(`   ${need.reason}`);
        }
        status.push("");
      }

      // Also check for the supplementary document types not in complianceNeeds
      const neededNames = new Set(result.complianceNeeds.map((n) => n.document));
      for (const doc of ALL_DOCUMENT_TYPES) {
        if (neededNames.has(doc.name)) continue;
        const exists =
          legalExists && fs.existsSync(path.join(legalDir, doc.filename));
        if (exists) {
          status.push(`[ok] ${doc.name} -- found (legal/${doc.filename})`);
        } else {
          status.push(`[optional] ${doc.name} -- not generated`);
        }
        status.push("");
      }

      if (missingCount > 0) {
        status.push(
          "---",
          "",
          "Run `generate_compliance_docs` to generate missing documents, or use the CLI: `npx codepliant go`"
        );
      }

      return {
        content: [{ type: "text" as const, text: status.join("\n") }],
      };
    } catch (error) {
      return errorResponse(error, "SCAN_FAILED");
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: get_config
// ---------------------------------------------------------------------------

server.tool(
  "get_config",
  "Read the current Codepliant configuration for a project. Returns the .codepliantrc.json contents or defaults if no config file exists.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory.")
      .default(process.cwd()),
  },
  async ({ projectPath }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const config = loadConfig(absPath);
      const configPath = path.join(absPath, ".codepliantrc.json");
      const configExists = fs.existsSync(configPath);

      const output = [
        "## Codepliant Configuration",
        "",
        `**Project:** ${absPath}`,
        `**Config file:** ${configExists ? configPath : "Not found (using defaults)"}`,
        "",
        "```json",
        JSON.stringify(config, null, 2),
        "```",
      ];

      return {
        content: [{ type: "text" as const, text: output.join("\n") }],
      };
    } catch (error) {
      return errorResponse(error, "CONFIG_ERROR");
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: set_config
// ---------------------------------------------------------------------------

server.tool(
  "set_config",
  "Update Codepliant configuration for a project. Merges provided values into the existing .codepliantrc.json (or creates it). Supports all config fields: companyName, contactEmail, website, jurisdiction, outputDir, dpoName, dpoEmail, euRepresentative, dataRetentionDays, aiRiskLevel, aiUsageDescription, jurisdictions, companyLocation, outputFormat, tollFreeNumber.",
  {
    projectPath: z
      .string()
      .describe("Absolute path to the project directory.")
      .default(process.cwd()),
    companyName: z.string().optional().describe("Your company or organization name."),
    contactEmail: z.string().optional().describe("Contact email for privacy inquiries."),
    website: z.string().optional().describe("Your website URL."),
    jurisdiction: z.string().optional().describe("Primary legal jurisdiction (e.g., 'EU', 'US-CA')."),
    outputDir: z.string().optional().describe("Output directory for generated documents."),
    dpoName: z.string().optional().describe("Data Protection Officer name."),
    dpoEmail: z.string().optional().describe("Data Protection Officer email."),
    euRepresentative: z.string().optional().describe("EU representative name/address."),
    dataRetentionDays: z.number().optional().describe("Data retention period in days."),
    aiRiskLevel: z.enum(["minimal", "limited", "high"]).optional().describe("AI risk level per EU AI Act."),
    aiUsageDescription: z.string().optional().describe("Description of how AI is used."),
    jurisdictions: z.array(z.string()).optional().describe("List of applicable jurisdictions."),
    companyLocation: z.string().optional().describe("Company physical location."),
    outputFormat: z.enum(["markdown", "html", "all"]).optional().describe("Output format for documents."),
    tollFreeNumber: z.string().optional().describe("Toll-free contact number (CCPA requirement)."),
  },
  async ({ projectPath, ...updates }) => {
    try {
      const absPath = validateProjectPath(projectPath);
      const existing = loadConfig(absPath);

      // Merge only provided (non-undefined) fields
      const merged: CodepliantConfig = { ...existing };
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          (merged as unknown as Record<string, unknown>)[key] = value;
        }
      }

      const savedPath = saveConfig(absPath, merged);

      const output = [
        "## Configuration Updated",
        "",
        `**Saved to:** ${savedPath}`,
        "",
        "### Updated values:",
        "",
      ];

      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          output.push(`- **${key}**: ${JSON.stringify(value)}`);
        }
      }

      output.push("", "### Full config:", "", "```json", JSON.stringify(merged, null, 2), "```");

      return {
        content: [{ type: "text" as const, text: output.join("\n") }],
      };
    } catch (error) {
      return errorResponse(error, "CONFIG_ERROR");
    }
  }
);

// ---------------------------------------------------------------------------
// Resource: compliance_status
// ---------------------------------------------------------------------------

server.resource(
  "compliance_status",
  "codepliant://status",
  { description: "Current compliance state from the most recent scan, including detected services, data categories, compliance needs, and document generation status." },
  async (uri) => {
    // Aggregate status from all cached scans
    const entries = Array.from(scanCache.entries());

    if (entries.length === 0) {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                status: "no_scans",
                message: "No projects have been scanned yet. Run scan_project first.",
                projects: [],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    const projects = entries.map(([projectPath, { result, timestamp }]) => {
      const legalDir = path.join(projectPath, "legal");
      const legalExists = fs.existsSync(legalDir);

      const documents = ALL_DOCUMENT_TYPES.map((doc) => {
        const exists = legalExists && fs.existsSync(path.join(legalDir, doc.filename));
        const need = result.complianceNeeds.find((n) => n.document === doc.name);
        return {
          name: doc.name,
          filename: doc.filename,
          exists,
          priority: need?.priority ?? "optional",
          reason: need?.reason ?? null,
        };
      });

      const requiredMissing = documents.filter(
        (d) => d.priority === "required" && !d.exists
      ).length;
      const recommendedMissing = documents.filter(
        (d) => d.priority === "recommended" && !d.exists
      ).length;

      return {
        projectName: result.projectName,
        projectPath,
        lastScanned: new Date(timestamp).toISOString(),
        servicesDetected: result.services.length,
        services: result.services.map((s) => ({
          name: s.name,
          category: s.category,
          dataCollected: s.dataCollected,
        })),
        dataCategories: result.dataCategories.map((c) => c.category),
        complianceStatus:
          requiredMissing > 0
            ? "non_compliant"
            : recommendedMissing > 0
              ? "partially_compliant"
              : "compliant",
        requiredMissing,
        recommendedMissing,
        documents,
      };
    });

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ status: "ok", projects }, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start Codepliant MCP server:", error);
  process.exit(1);
});
