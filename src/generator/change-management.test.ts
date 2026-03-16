import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateChangeManagementPolicy, detectCiCd } from "./change-management.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "change-mgmt-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
  }
  return dir;
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── detectCiCd ───────────────────────────────────────────────────────

describe("detectCiCd", () => {
  it("returns empty array for project with no CI/CD", () => {
    const dir = createTempProject({ "src/index.ts": "console.log('hi');" });
    try {
      const result = detectCiCd(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitHub Actions", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI\non: push\njobs: {}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "GitHub Actions"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitLab CI", () => {
    const dir = createTempProject({
      ".gitlab-ci.yml": "stages:\n  - build\n  - test",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "GitLab CI"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Dockerfile", () => {
    const dir = createTempProject({
      "Dockerfile": "FROM node:18\nCOPY . .",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Docker"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Vercel", () => {
    const dir = createTempProject({
      "vercel.json": '{ "framework": "nextjs" }',
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Vercel"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple platforms", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI",
      "Dockerfile": "FROM node:18",
      "vercel.json": "{}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.length >= 3);
    } finally {
      cleanup(dir);
    }
  });
});

// ── generateChangeManagementPolicy ───────────────────────────────────

describe("generateChangeManagementPolicy", () => {
  it("always generates a policy (never returns null)", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Change Management Policy"));
  });

  it("includes project name", () => {
    const result = generateChangeManagementPolicy(makeScan({ projectName: "my-saas" }));
    assert.ok(result.includes("my-saas"));
  });

  it("includes code review section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Code Review"));
    assert.ok(result.includes("Review Checklist"));
  });

  it("includes deployment process section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Deployment Approval Process"));
    assert.ok(result.includes("Pre-deployment"));
  });

  it("includes rollback procedures section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Rollback Procedures"));
    assert.ok(result.includes("Rollback Triggers"));
  });

  it("includes change log requirements section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Change Log Requirements"));
    assert.ok(result.includes("CHANGELOG.md"));
  });

  it("includes change categories", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Standard"));
    assert.ok(result.includes("Normal"));
    assert.ok(result.includes("Emergency"));
    assert.ok(result.includes("Major"));
  });

  it("includes payment-specific review items when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes AI-specific review items when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("AI model") || result.includes("model card"));
  });

  it("includes auth-specific review items when auth detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("OWASP") || result.includes("Authentication changes"));
  });

  it("shows detected CI/CD platforms", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI",
    });
    try {
      const scan = makeScan({ projectPath: dir });
      const result = generateChangeManagementPolicy(scan);
      assert.ok(result.includes("GitHub Actions"));
    } finally {
      cleanup(dir);
    }
  });

  it("recommends CI/CD when none detected", () => {
    const dir = createTempProject({ "src/index.ts": "console.log('hi');" });
    try {
      const scan = makeScan({ projectPath: dir });
      const result = generateChangeManagementPolicy(scan);
      assert.ok(result.includes("strongly recommended") || result.includes("No CI/CD"));
    } finally {
      cleanup(dir);
    }
  });

  it("includes compliance requirements section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("Separation of Duties"));
  });

  it("uses context company name and email", () => {
    const result = generateChangeManagementPolicy(makeScan(), {
      companyName: "Acme Corp",
      contactEmail: "ops@acme.com",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("ops@acme.com"));
  });

  it("includes codepliant disclaimer", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });
});
