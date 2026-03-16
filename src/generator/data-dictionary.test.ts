import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService, DataCategory } from "../scanner/types.js";
import { generateDataDictionary, buildDataDictionary, classifyDictionaryField } from "./data-dictionary.js";

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

// ── classifyDictionaryField ──────────────────────────────────────────

describe("classifyDictionaryField", () => {
  it("classifies password fields as Critical", () => {
    const result = classifyDictionaryField("passwordHash", "User");
    assert.strictEqual(result.sensitivity, "Critical");
    assert.strictEqual(result.type, "Authentication");
  });

  it("classifies email fields as High", () => {
    const result = classifyDictionaryField("email", "User");
    assert.strictEqual(result.sensitivity, "High");
    assert.strictEqual(result.type, "Contact");
  });

  it("classifies SSN as Critical", () => {
    const result = classifyDictionaryField("ssn", "User");
    assert.strictEqual(result.sensitivity, "Critical");
    assert.strictEqual(result.type, "Government ID");
  });

  it("classifies credit card as Critical", () => {
    const result = classifyDictionaryField("credit card number", "Payment");
    assert.strictEqual(result.sensitivity, "Critical");
  });

  it("classifies session tokens as Medium", () => {
    const result = classifyDictionaryField("session token", "Auth");
    assert.strictEqual(result.sensitivity, "Medium");
    assert.strictEqual(result.type, "Session");
  });

  it("classifies locale as Low", () => {
    const result = classifyDictionaryField("locale", "User");
    assert.strictEqual(result.sensitivity, "Low");
    assert.strictEqual(result.type, "Preference");
  });

  it("classifies unknown fields as Low Application Data", () => {
    const result = classifyDictionaryField("widgetCount", "Dashboard");
    assert.strictEqual(result.sensitivity, "Low");
    assert.strictEqual(result.type, "Application Data");
  });

  it("classifies IP address as Medium", () => {
    const result = classifyDictionaryField("ipAddress", "Request");
    assert.strictEqual(result.sensitivity, "Medium");
    assert.strictEqual(result.type, "Technical");
  });

  it("classifies name fields as High", () => {
    const result = classifyDictionaryField("firstName", "User");
    assert.strictEqual(result.sensitivity, "High");
    assert.strictEqual(result.type, "Personal Identity");
  });

  it("classifies bank account as Critical", () => {
    const result = classifyDictionaryField("bank account number", "Billing");
    assert.strictEqual(result.sensitivity, "Critical");
  });
});

// ── buildDataDictionary ──────────────────────────────────────────────

describe("buildDataDictionary", () => {
  it("returns empty array for empty scan", () => {
    const entries = buildDataDictionary(makeScan());
    assert.strictEqual(entries.length, 0);
  });

  it("creates entries from payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information", "email"])],
    });
    const entries = buildDataDictionary(scan);
    assert.ok(entries.length > 0);
    assert.ok(entries.some(e => e.source === "stripe"));
  });

  it("creates entries from auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "session data"])],
    });
    const entries = buildDataDictionary(scan);
    assert.ok(entries.length > 0);
    assert.ok(entries.some(e => e.source === "next-auth"));
  });

  it("creates entries from data categories", () => {
    const scan = makeScan({
      dataCategories: [
        { category: "email addresses", description: "User emails", sources: ["User.email"] },
      ],
    });
    const entries = buildDataDictionary(scan);
    assert.ok(entries.length > 0);
    assert.ok(entries.some(e => e.source === "User.email"));
  });

  it("creates entries from env var evidence", () => {
    const scan = makeScan({
      services: [{
        name: "prisma",
        category: "database",
        evidence: [{ type: "env_var", file: ".env", detail: "DATABASE_URL" }],
        dataCollected: ["user data"],
      }],
    });
    const entries = buildDataDictionary(scan);
    assert.ok(entries.some(e => e.source.includes("DATABASE_URL")));
  });

  it("sorts entries by sensitivity (Critical first)", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "session data", "password hash"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const entries = buildDataDictionary(scan);
    const sensitivities = entries.map(e => e.sensitivity);
    const criticalIdx = sensitivities.indexOf("Critical");
    const lowIdx = sensitivities.lastIndexOf("Low");
    if (criticalIdx !== -1 && lowIdx !== -1) {
      assert.ok(criticalIdx < lowIdx, "Critical entries should come before Low entries");
    }
  });

  it("deduplicates entries by field+source", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["email"]),
      ],
      dataCategories: [
        { category: "email", description: "email", sources: ["stripe"] },
      ],
    });
    const entries = buildDataDictionary(scan);
    const stripeEmails = entries.filter(e => e.source === "stripe" && e.field === "email");
    assert.ok(stripeEmails.length <= 1, "Should deduplicate same field+source");
  });
});

// ── generateDataDictionary ───────────────────────────────────────────

describe("generateDataDictionary", () => {
  it("returns null when no services or data categories", () => {
    const result = generateDataDictionary(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates markdown with title and table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information", "email"])],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Dictionary"));
    assert.ok(result.includes("| Field | Source | Type | Sensitivity | Retention | Purpose |"));
    assert.ok(result.includes("stripe"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("my-app"));
  });

  it("includes sensitivity summary section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "password hash"])],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Sensitivity Summary"));
    assert.ok(result.includes("Total fields cataloged"));
  });

  it("includes cross-reference section for services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Cross-References"));
  });

  it("includes related documents section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("DATA_RETENTION_POLICY.md"));
  });

  it("uses context company name and email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataDictionary(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("includes codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataDictionary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });
});
