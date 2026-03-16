import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  computeComplianceScore,
  gradeFromScore,
  formatScoreBreakdown,
  formatScoreMarkdown,
  scoreColor,
  scoreStatus,
} from "./index.js";
import type { ScoreInput, ComplianceScore } from "./index.js";
import type { ScanResult, ComplianceNeed, DetectedService } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-scoring-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function makeService(overrides: Partial<DetectedService> = {}): DetectedService {
  return {
    name: overrides.name ?? "stripe",
    category: overrides.category ?? "payment",
    evidence: overrides.evidence ?? [{ type: "dependency", file: "package.json", detail: "stripe" }],
    dataCollected: overrides.dataCollected ?? ["payment information"],
    isDataProcessor: overrides.isDataProcessor,
  };
}

function makeDoc(name: string, filename: string): GeneratedDocument {
  return { name, filename, content: `# ${name}\n\nGenerated content.` };
}

function makeScanResult(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: new Date().toISOString(),
    services: overrides.services ?? [],
    dataCategories: overrides.dataCategories ?? [],
    complianceNeeds: overrides.complianceNeeds ?? [],
  };
}

// ============================================================
// Test 1: Perfect score with full config and all docs
// ============================================================

describe("computeComplianceScore", () => {
  it("returns 100/A when all documents are present and config is complete", () => {
    const dir = createTempDir();
    try {
      // Write docs to disk so freshness can be checked
      const docs = [
        makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
        makeDoc("Terms of Service", "TERMS_OF_SERVICE.md"),
        makeDoc("Security Policy", "SECURITY.md"),
        makeDoc("Incident Response Plan", "INCIDENT_RESPONSE_PLAN.md"),
        makeDoc("Data Processing Agreement", "DATA_PROCESSING_AGREEMENT.md"),
      ];

      for (const doc of docs) {
        fs.writeFileSync(path.join(dir, doc.filename), doc.content, "utf-8");
      }

      const services = [makeService({ name: "stripe", category: "payment" })];

      const needs: ComplianceNeed[] = [
        { document: "Privacy Policy", reason: "Required", priority: "required" },
        { document: "Terms of Service", reason: "Recommended", priority: "recommended" },
        { document: "Data Processing Agreement", reason: "Recommended", priority: "recommended" },
      ];

      const config: CodepliantConfig = {
        companyName: "Acme Inc",
        contactEmail: "privacy@acme.com",
        outputDir: dir,
        dpoName: "Jane Smith",
        dpoEmail: "dpo@acme.com",
        jurisdictions: ["GDPR", "CCPA"],
      };

      const input: ScoreInput = {
        scanResult: makeScanResult({ services, complianceNeeds: needs }),
        docs,
        config,
        outputDir: dir,
        now: new Date(),
      };

      const score = computeComplianceScore(input);

      assert.strictEqual(score.grade, "A");
      assert.ok(score.total >= 90, `Expected >= 90 but got ${score.total}`);
      assert.strictEqual(score.components.length, 5);
      assert.ok(score.computedAt.length > 0);
    } finally {
      cleanup(dir);
    }
  });

  // ============================================================
  // Test 2: Low score with missing docs and placeholder config
  // ============================================================

  it("returns low score (F) when no docs generated and config is placeholder", () => {
    const dir = createTempDir();
    try {
      const services = [
        makeService({ name: "openai", category: "ai" }),
        makeService({ name: "posthog", category: "analytics" }),
        makeService({ name: "stripe", category: "payment" }),
      ];

      const needs: ComplianceNeed[] = [
        { document: "Privacy Policy", reason: "Required", priority: "required" },
        { document: "AI Disclosure", reason: "Required", priority: "required" },
        { document: "Cookie Policy", reason: "Required", priority: "required" },
        { document: "Data Processing Agreement", reason: "Recommended", priority: "recommended" },
      ];

      const config: CodepliantConfig = {
        companyName: "[Your Company Name]",
        contactEmail: "[your-email@example.com]",
        outputDir: dir,
      };

      const input: ScoreInput = {
        scanResult: makeScanResult({ services, complianceNeeds: needs }),
        docs: [], // No docs generated
        config,
        outputDir: dir,
        now: new Date(),
      };

      const score = computeComplianceScore(input);

      assert.strictEqual(score.grade, "F");
      assert.ok(score.total < 60, `Expected < 60 but got ${score.total}`);

      // Check that config quality is 0
      const configComp = score.components.find(
        (c) => c.name === "Configuration Quality"
      );
      assert.ok(configComp);
      assert.strictEqual(configComp.score, 0);
    } finally {
      cleanup(dir);
    }
  });

  // ============================================================
  // Test 3: Stale documents reduce freshness score
  // ============================================================

  it("penalizes stale documents older than 30 days", () => {
    const dir = createTempDir();
    try {
      const docs = [
        makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
        makeDoc("Terms of Service", "TERMS_OF_SERVICE.md"),
      ];

      for (const doc of docs) {
        const filePath = path.join(dir, doc.filename);
        fs.writeFileSync(filePath, doc.content, "utf-8");
        // Make file look 60 days old
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        fs.utimesSync(filePath, sixtyDaysAgo, sixtyDaysAgo);
      }

      const needs: ComplianceNeed[] = [
        { document: "Privacy Policy", reason: "Required", priority: "required" },
        { document: "Terms of Service", reason: "Recommended", priority: "recommended" },
      ];

      const config: CodepliantConfig = {
        companyName: "Acme Inc",
        contactEmail: "hello@acme.com",
        outputDir: dir,
        dpoName: "Jane",
        dpoEmail: "dpo@acme.com",
        jurisdictions: ["GDPR"],
      };

      const input: ScoreInput = {
        scanResult: makeScanResult({
          services: [makeService()],
          complianceNeeds: needs,
        }),
        docs,
        config,
        outputDir: dir,
        now: new Date(),
      };

      const score = computeComplianceScore(input);

      const freshnessComp = score.components.find(
        (c) => c.name === "Document Freshness"
      );
      assert.ok(freshnessComp);
      assert.strictEqual(
        freshnessComp.score,
        0,
        "All docs are stale, freshness should be 0"
      );
      assert.ok(
        freshnessComp.details.some((d) => d.includes("Stale")),
        "Should mention stale documents"
      );
    } finally {
      cleanup(dir);
    }
  });

  // ============================================================
  // Test 4: Empty project gets perfect score
  // ============================================================

  it("gives 100/A for a project with no services detected", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Acme Inc",
        contactEmail: "hello@acme.com",
        outputDir: dir,
        dpoName: "Jane",
        dpoEmail: "dpo@acme.com",
        jurisdictions: ["GDPR"],
      };

      const input: ScoreInput = {
        scanResult: makeScanResult({
          services: [],
          complianceNeeds: [],
        }),
        docs: [makeDoc("Terms of Service", "TERMS_OF_SERVICE.md")],
        config,
        outputDir: dir,
        now: new Date(),
      };

      const score = computeComplianceScore(input);

      assert.strictEqual(score.total, 100);
      assert.strictEqual(score.grade, "A");
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Test 5: gradeFromScore and formatting helpers
// ============================================================

describe("gradeFromScore", () => {
  it("maps score ranges to correct letter grades", () => {
    assert.strictEqual(gradeFromScore(100), "A");
    assert.strictEqual(gradeFromScore(95), "A");
    assert.strictEqual(gradeFromScore(90), "A");
    assert.strictEqual(gradeFromScore(89), "B");
    assert.strictEqual(gradeFromScore(80), "B");
    assert.strictEqual(gradeFromScore(79), "C");
    assert.strictEqual(gradeFromScore(70), "C");
    assert.strictEqual(gradeFromScore(69), "D");
    assert.strictEqual(gradeFromScore(60), "D");
    assert.strictEqual(gradeFromScore(59), "F");
    assert.strictEqual(gradeFromScore(0), "F");
  });
});

describe("formatScoreBreakdown", () => {
  it("produces readable text output", () => {
    const score: ComplianceScore = {
      total: 85,
      grade: "B",
      components: [
        { name: "Document Completeness", score: 40, maxPoints: 40, details: ["All docs present"] },
        { name: "Document Freshness", score: 20, maxPoints: 20, details: ["All fresh"] },
        { name: "Detection Coverage", score: 15, maxPoints: 15, details: ["Full coverage"] },
        { name: "Configuration Quality", score: 5, maxPoints: 10, details: ["No DPO set"] },
        { name: "Regulatory Coverage", score: 5, maxPoints: 15, details: ["Missing AI Disclosure"] },
      ],
      computedAt: "2026-01-01T00:00:00.000Z",
    };

    const text = formatScoreBreakdown(score);
    assert.ok(text.includes("85/100 (B)"));
    assert.ok(text.includes("Document Completeness: 40/40"));
    assert.ok(text.includes("No DPO set"));
  });
});

describe("formatScoreMarkdown", () => {
  it("produces a markdown table", () => {
    const score: ComplianceScore = {
      total: 72,
      grade: "C",
      components: [
        { name: "Document Completeness", score: 30, maxPoints: 40, details: ["Missing 1 doc"] },
      ],
      computedAt: "2026-01-01T00:00:00.000Z",
    };

    const md = formatScoreMarkdown(score);
    assert.ok(md.includes("## Compliance Score"));
    assert.ok(md.includes("**72/100**"));
    assert.ok(md.includes("Grade: **C**"));
    assert.ok(md.includes("| Document Completeness | 30 | 40 |"));
  });
});

describe("scoreColor and scoreStatus", () => {
  it("returns appropriate colors and labels", () => {
    assert.strictEqual(scoreColor(95), "#4c1");
    assert.strictEqual(scoreColor(85), "#97ca00");
    assert.strictEqual(scoreColor(75), "#dfb317");
    assert.strictEqual(scoreColor(65), "#fe7d37");
    assert.strictEqual(scoreColor(40), "#e05d44");

    assert.strictEqual(scoreStatus(95).text, "excellent");
    assert.strictEqual(scoreStatus(85).text, "good");
    assert.strictEqual(scoreStatus(75).text, "fair");
    assert.strictEqual(scoreStatus(65).text, "needs work");
    assert.strictEqual(scoreStatus(40).text, "non-compliant");
  });
});
