import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanIndustryCompliance, deriveIndustryComplianceNeeds } from "./industry.js";
import type { WalkedFile } from "./file-walker.js";

function createTempProject(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-industry-test-"));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

function makeWalkedFile(dir: string, relativePath: string, content: string): WalkedFile {
  const fullPath = path.join(dir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  return {
    fullPath,
    relativePath,
    extension: path.extname(relativePath),
  };
}

describe("scanIndustryCompliance — HIPAA detection", () => {
  it("detects HIPAA need from health-related npm packages", () => {
    const dir = createTempProject();
    try {
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "health-app",
          dependencies: { "fhirpath": "^3.0.0", express: "^4.0.0" },
        }),
      );
      const result = scanIndustryCompliance(dir, []);
      assert.strictEqual(result.hipaa.detected, true);
      assert.ok(result.hipaa.evidence.length > 0);
      assert.ok(result.hipaa.evidence[0].detail.includes("fhirpath"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects HIPAA need from health-related env vars", () => {
    const dir = createTempProject();
    try {
      fs.writeFileSync(path.join(dir, ".env"), "FHIR_SERVER_URL=https://example.com\nDATABASE_URL=postgres://...\n");
      const result = scanIndustryCompliance(dir, []);
      assert.strictEqual(result.hipaa.detected, true);
      assert.ok(result.hipaa.evidence.some((e) => e.type === "env_var"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects HIPAA need from health-related field patterns in source code", () => {
    const dir = createTempProject();
    try {
      const files: WalkedFile[] = [
        makeWalkedFile(dir, "src/models/patient.ts", `
          interface PatientRecord {
            patientId: string;
            diagnosis: string;
            prescription: string[];
          }
        `),
      ];
      const result = scanIndustryCompliance(dir, files);
      assert.strictEqual(result.hipaa.detected, true);
      assert.ok(result.hipaa.evidence.some((e) => e.type === "code_pattern"));
    } finally {
      cleanup(dir);
    }
  });
});

describe("scanIndustryCompliance — PCI DSS detection", () => {
  it("detects PCI DSS need from card-related field patterns in source code", () => {
    const dir = createTempProject();
    try {
      const files: WalkedFile[] = [
        makeWalkedFile(dir, "src/checkout.ts", `
          function processPayment(cardNumber: string, cvv: string) {
            // process card
          }
        `),
      ];
      const result = scanIndustryCompliance(dir, files);
      assert.strictEqual(result.pciDss.detected, true);
      assert.ok(result.pciDss.evidence.some((e) => e.type === "code_pattern"));
    } finally {
      cleanup(dir);
    }
  });
});

describe("deriveIndustryComplianceNeeds", () => {
  it("returns PCI DSS as recommended when only a payment service is present (no raw card fields)", () => {
    const industryResult = {
      hipaa: { detected: false, evidence: [] },
      pciDss: { detected: false, evidence: [] },
      coppa: { detected: false, evidence: [] },
    };
    const needs = deriveIndustryComplianceNeeds(industryResult, true);
    assert.strictEqual(needs.length, 1);
    assert.strictEqual(needs[0].document, "PCI DSS Compliance");
    assert.strictEqual(needs[0].priority, "recommended");
  });
});
