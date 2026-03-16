import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateExecutiveSummary, writeExecutiveSummary } from "./compliance-report.js";
import type { ComplianceReportOptions } from "./compliance-report.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-exec-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function mockScanResult(): ScanResult {
  return {
    projectPath: "/tmp/test-project",
    projectName: "test-project",
    scannedAt: "2026-01-15T10:00:00.000Z",
    services: [
      {
        name: "OpenAI",
        category: "ai",
        dataCollected: ["prompts", "user data"],
        evidence: [{ type: "dependency", file: "package.json", detail: "openai" }],
        isDataProcessor: true,
      },
      {
        name: "Stripe",
        category: "payment",
        dataCollected: ["payment data"],
        evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }],
        isDataProcessor: true,
      },
    ],
    complianceNeeds: [
      { document: "Privacy Policy", reason: "Services detected", priority: "required" },
      { document: "AI Disclosure", reason: "AI detected", priority: "required" },
      { document: "Security Policy", reason: "Payment detected", priority: "recommended" },
    ],
    dataCategories: [
      { category: "Financial", description: "Payment information.", sources: ["Stripe"] },
      { category: "AI Input", description: "User prompts.", sources: ["OpenAI"] },
    ],
    warnings: [],
  } as unknown as ScanResult;
}

function mockDocs(): GeneratedDocument[] {
  return [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# Privacy Policy\n\n## Section 1\n\nContent." },
  ];
}

describe("generateExecutiveSummary", () => {
  it("generates markdown executive summary", () => {
    const tmpDir = createTempDir();
    try {
      const options: ComplianceReportOptions = {
        scanResult: mockScanResult(),
        docs: mockDocs(),
        outputDir: tmpDir,
        timestamp: "2026-01-15T10:00:00.000Z",
        version: "50.0.0",
      };

      const summary = generateExecutiveSummary(options);

      assert.ok(summary.includes("Executive Summary"));
      assert.ok(summary.includes("test-project"));
      assert.ok(summary.includes("Compliance Score"));
      assert.ok(summary.includes("Risk Level"));
      assert.ok(summary.includes("Top Risks"));
      assert.ok(summary.includes("Recommended Actions"));
    } finally {
      cleanup(tmpDir);
    }
  });

  it("identifies AI and payment risks", () => {
    const tmpDir = createTempDir();
    try {
      const summary = generateExecutiveSummary({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        outputDir: tmpDir,
        timestamp: "2026-01-15T10:00:00.000Z",
        version: "50.0.0",
      });

      assert.ok(summary.includes("AI"));
      assert.ok(summary.includes("PCI DSS") || summary.includes("Payment"));
    } finally {
      cleanup(tmpDir);
    }
  });

  it("includes missing required documents in risks", () => {
    const tmpDir = createTempDir();
    try {
      const summary = generateExecutiveSummary({
        scanResult: mockScanResult(),
        docs: mockDocs(),  // Only Privacy Policy, missing AI Disclosure
        outputDir: tmpDir,
        timestamp: "2026-01-15T10:00:00.000Z",
        version: "50.0.0",
      });

      assert.ok(summary.includes("AI Disclosure") || summary.includes("required document"));
    } finally {
      cleanup(tmpDir);
    }
  });
});

describe("writeExecutiveSummary", () => {
  it("writes EXECUTIVE_SUMMARY.md file", () => {
    const tmpDir = createTempDir();
    try {
      const filePath = writeExecutiveSummary({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        outputDir: tmpDir,
        timestamp: "2026-01-15T10:00:00.000Z",
        version: "50.0.0",
      });

      assert.ok(fs.existsSync(filePath));
      assert.ok(filePath.endsWith("EXECUTIVE_SUMMARY.md"));

      const content = fs.readFileSync(filePath, "utf-8");
      assert.ok(content.includes("Executive Summary"));
      assert.ok(content.includes("test-project"));
    } finally {
      cleanup(tmpDir);
    }
  });

  it("creates output directory if missing", () => {
    const tmpDir = createTempDir();
    const subDir = path.join(tmpDir, "nested", "output");
    try {
      const filePath = writeExecutiveSummary({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        outputDir: subDir,
        timestamp: "2026-01-15T10:00:00.000Z",
        version: "50.0.0",
      });

      assert.ok(fs.existsSync(filePath));
    } finally {
      cleanup(tmpDir);
    }
  });
});
