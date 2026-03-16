import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateApiSpec, writeApiSpec, type GenerateApiSpecOptions } from "./compliance-api.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { ComplianceScore } from "../scoring/index.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-api-test-"));
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
        name: "Stripe",
        category: "payment",
        dataCollected: ["payment data", "email"],
        evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }],
        isDataProcessor: true,
      },
      {
        name: "Google Analytics",
        category: "analytics",
        dataCollected: ["page views", "user behavior"],
        evidence: [{ type: "import", file: "src/index.ts", detail: "analytics" }],
        isDataProcessor: true,
      },
    ],
    complianceNeeds: [
      { document: "Privacy Policy", reason: "Services detected", priority: "required" },
      { document: "Cookie Policy", reason: "Analytics detected", priority: "required" },
      { document: "Security Policy", reason: "Payment detected", priority: "recommended" },
    ],
    dataCategories: [
      { category: "Financial", description: "Payment information.", sources: ["Stripe"] },
    ],
    warnings: [],
  } as unknown as ScanResult;
}

function mockDocs(): GeneratedDocument[] {
  return [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# Privacy Policy\n\n## Section 1\n\nContent." },
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md", content: "# Cookie Policy\n\nContent." },
  ];
}

function mockScore(): ComplianceScore {
  return {
    total: 78,
    grade: "C",
    components: [
      { name: "Document Completeness", score: 30, maxPoints: 40, details: ["Missing: Security Policy"] },
    ],
    computedAt: "2026-01-15T10:00:00.000Z",
    regulationScores: [
      { regulation: "GDPR", score: 80, maxPoints: 100, grade: "B", details: ["DPO configured"] },
    ],
    recommendations: [
      {
        title: "Generate Security Policy",
        description: "PCI DSS requires a security policy.",
        impact: "high" as const,
        estimatedPointsGain: 5,
        regulations: ["PCI DSS"],
      },
    ],
  };
}

describe("generateApiSpec", () => {
  it("generates valid API spec with correct structure", () => {
    const tmpDir = createTempDir();
    try {
      const options: GenerateApiSpecOptions = {
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: tmpDir,
      };

      const spec = generateApiSpec(options);

      assert.equal(spec.version, "1.0.0");
      assert.equal(spec.project, "test-project");
      assert.ok(spec.generatedAt);
      assert.ok(spec.baseUrl);
      assert.ok(Array.isArray(spec.endpoints));
      assert.ok(spec.endpoints.length >= 4);
      assert.ok(Array.isArray(spec.documents));
      assert.equal(spec.documents.length, 2);
    } finally {
      cleanup(tmpDir);
    }
  });

  it("includes correct status information", () => {
    const tmpDir = createTempDir();
    try {
      const spec = generateApiSpec({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: tmpDir,
      });

      assert.equal(spec.status.project, "test-project");
      assert.equal(spec.status.complianceScore, 78);
      assert.equal(spec.status.grade, "C");
      assert.equal(spec.status.servicesDetected, 2);
      assert.equal(spec.status.documentsGenerated, 2);
      assert.ok(spec.status.missingDocuments.includes("Security Policy"));
    } finally {
      cleanup(tmpDir);
    }
  });

  it("includes endpoint definitions", () => {
    const tmpDir = createTempDir();
    try {
      const spec = generateApiSpec({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: tmpDir,
      });

      const paths = spec.endpoints.map(e => e.path);
      assert.ok(paths.includes("/status"));
      assert.ok(paths.includes("/documents"));
      assert.ok(paths.includes("/score"));
      assert.ok(paths.includes("/services"));
    } finally {
      cleanup(tmpDir);
    }
  });

  it("uses custom baseUrl when provided", () => {
    const tmpDir = createTempDir();
    try {
      const spec = generateApiSpec({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: tmpDir,
        baseUrl: "https://my-api.example.com/v2",
      });

      assert.equal(spec.baseUrl, "https://my-api.example.com/v2");
    } finally {
      cleanup(tmpDir);
    }
  });
});

describe("writeApiSpec", () => {
  it("writes compliance-api.json file", () => {
    const tmpDir = createTempDir();
    try {
      const filePath = writeApiSpec({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: tmpDir,
      });

      assert.ok(fs.existsSync(filePath));
      assert.ok(filePath.endsWith("compliance-api.json"));

      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      assert.equal(content.version, "1.0.0");
      assert.ok(content.endpoints);
      assert.ok(content.status);
      assert.ok(content.documents);
    } finally {
      cleanup(tmpDir);
    }
  });

  it("creates output directory if missing", () => {
    const tmpDir = createTempDir();
    const subDir = path.join(tmpDir, "nested", "output");
    try {
      const filePath = writeApiSpec({
        scanResult: mockScanResult(),
        docs: mockDocs(),
        score: mockScore(),
        outputDir: subDir,
      });

      assert.ok(fs.existsSync(filePath));
    } finally {
      cleanup(tmpDir);
    }
  });
});
