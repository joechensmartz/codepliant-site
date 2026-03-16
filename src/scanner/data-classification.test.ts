import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService, DataCategory } from "./types.js";
import {
  classifyField,
  classifyAllData,
  generateDataClassification,
  generateClassificationSummaryForPrivacyPolicy,
  sensitivityLabel,
} from "./data-classification.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"]
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

// ============================================================
// classifyField — individual field classification
// ============================================================

describe("classifyField", () => {
  it("classifies health data as special category", () => {
    const result = classifyField("health records", "UserModel");
    assert.strictEqual(result.sensitivity, "special-category");
    assert.ok(result.gdprCategory.includes("Art. 9"));
  });

  it("classifies biometric data as special category", () => {
    const result = classifyField("biometric data", "AuthService");
    assert.strictEqual(result.sensitivity, "special-category");
    assert.ok(result.gdprCategory.includes("Biometric"));
  });

  it("classifies genetic data as special category", () => {
    const result = classifyField("genetic markers", "LabService");
    assert.strictEqual(result.sensitivity, "special-category");
  });

  it("classifies racial data as special category", () => {
    const result = classifyField("racial origin", "ProfileModel");
    assert.strictEqual(result.sensitivity, "special-category");
  });

  it("classifies political opinions as special category", () => {
    const result = classifyField("political opinions", "SurveyModel");
    assert.strictEqual(result.sensitivity, "special-category");
  });

  it("classifies religious beliefs as special category", () => {
    const result = classifyField("religious beliefs", "ProfileModel");
    assert.strictEqual(result.sensitivity, "special-category");
  });

  it("classifies sexual orientation as special category", () => {
    const result = classifyField("sexual orientation", "ProfileModel");
    assert.strictEqual(result.sensitivity, "special-category");
  });

  it("classifies credit card as high sensitivity", () => {
    const result = classifyField("credit card number", "PaymentService");
    assert.strictEqual(result.sensitivity, "high");
    assert.ok(result.gdprCategory.includes("Financial"));
  });

  it("classifies SSN as high sensitivity", () => {
    const result = classifyField("ssn", "IdentityModel");
    assert.strictEqual(result.sensitivity, "high");
    assert.ok(result.gdprCategory.includes("Government"));
  });

  it("classifies passwords as high sensitivity", () => {
    const result = classifyField("password hash", "AuthModel");
    assert.strictEqual(result.sensitivity, "high");
    assert.ok(result.gdprCategory.includes("Authentication"));
  });

  it("classifies bank account as high sensitivity", () => {
    const result = classifyField("bank account data", "FinanceService");
    assert.strictEqual(result.sensitivity, "high");
  });

  it("classifies email as medium sensitivity", () => {
    const result = classifyField("email", "UserModel");
    assert.strictEqual(result.sensitivity, "medium");
    assert.ok(result.gdprCategory.includes("Contact"));
  });

  it("classifies phone as medium sensitivity", () => {
    const result = classifyField("phone number", "UserModel");
    assert.strictEqual(result.sensitivity, "medium");
  });

  it("classifies name as medium sensitivity", () => {
    const result = classifyField("full name", "UserModel");
    assert.strictEqual(result.sensitivity, "medium");
  });

  it("classifies date of birth as medium sensitivity", () => {
    const result = classifyField("date of birth", "UserModel");
    assert.strictEqual(result.sensitivity, "medium");
  });

  it("classifies location as medium sensitivity", () => {
    const result = classifyField("location data", "TrackingService");
    assert.strictEqual(result.sensitivity, "medium");
  });

  it("classifies page views as low sensitivity", () => {
    const result = classifyField("page views", "Analytics");
    assert.strictEqual(result.sensitivity, "low");
    assert.ok(result.gdprCategory.includes("Behavioral"));
  });

  it("classifies IP address as low sensitivity", () => {
    const result = classifyField("IP address", "ServerLog");
    assert.strictEqual(result.sensitivity, "low");
    assert.ok(result.gdprCategory.includes("Technical"));
  });

  it("classifies device info as low sensitivity", () => {
    const result = classifyField("device information", "Analytics");
    assert.strictEqual(result.sensitivity, "low");
  });

  it("classifies error data as low sensitivity", () => {
    const result = classifyField("error reports", "Sentry");
    assert.strictEqual(result.sensitivity, "low");
  });

  it("classifies unknown fields as low with unclassified category", () => {
    const result = classifyField("widget_count", "AppModel");
    assert.strictEqual(result.sensitivity, "low");
    assert.strictEqual(result.gdprCategory, "Unclassified data");
  });
});

// ============================================================
// classifyAllData — full scan classification
// ============================================================

describe("classifyAllData", () => {
  it("returns empty result for empty scan", () => {
    const result = classifyAllData(makeScan());
    assert.strictEqual(result.fields.length, 0);
    assert.strictEqual(result.highCount, 0);
    assert.strictEqual(result.mediumCount, 0);
    assert.strictEqual(result.lowCount, 0);
  });

  it("classifies service data items by sensitivity", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information", "email", "billing address"]),
        makeService("@sentry/node", "monitoring", ["error data", "IP address", "device information"]),
      ],
    });

    const result = classifyAllData(scan);
    assert.ok(result.fields.length > 0);
    assert.ok(result.highCount > 0, "should have high-sensitivity fields from payment");
    assert.ok(result.lowCount > 0, "should have low-sensitivity fields from monitoring");
  });

  it("includes dataCategories in classification", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user data as defined in schema"])],
      dataCategories: [
        {
          category: "Personal Identity Data",
          description: "email addresses, names detected in Prisma schema fields: User.email, User.name",
          sources: ["User.email", "User.name"],
        },
      ],
    });

    const result = classifyAllData(scan);
    assert.ok(result.fields.length >= 2, "should classify both schema fields and service data");
  });

  it("deduplicates fields with same field+source", () => {
    const scan = makeScan({
      services: [
        makeService("auth-a", "auth", ["email", "name"]),
        makeService("auth-b", "auth", ["email", "name"]),
      ],
    });

    const result = classifyAllData(scan);
    // email from auth-a and email from auth-b are different sources, so both should be present
    const emailFields = result.fields.filter((f) => f.field === "email");
    assert.strictEqual(emailFields.length, 2);
  });

  it("sorts by sensitivity: special-category first, then high, medium, low", () => {
    const scan = makeScan({
      services: [
        makeService("analytics", "analytics", ["page views"]),
        makeService("payment", "payment", ["credit card number"]),
        makeService("auth", "auth", ["email", "password"]),
      ],
    });

    const result = classifyAllData(scan);
    const sensitivities = result.fields.map((f) => f.sensitivity);
    // Verify ordering: all high before medium, all medium before low
    let lastOrder = -1;
    for (const s of sensitivities) {
      const order = s === "special-category" ? 0 : s === "high" ? 1 : s === "medium" ? 2 : 3;
      assert.ok(order >= lastOrder, `Expected non-decreasing sensitivity order, got ${s} after order ${lastOrder}`);
      lastOrder = order;
    }
  });

  it("skips non-data-processor services", () => {
    const scan = makeScan({
      services: [
        { ...makeService("zod", "other", ["validated user input"]), isDataProcessor: false },
        makeService("stripe", "payment", ["payment information"]),
      ],
    });

    const result = classifyAllData(scan);
    const zodFields = result.fields.filter((f) => f.source === "zod");
    assert.strictEqual(zodFields.length, 0, "non-data-processor services should be excluded");
  });
});

// ============================================================
// generateDataClassification — document generation
// ============================================================

describe("generateDataClassification", () => {
  it("returns null for empty scan", () => {
    const result = generateDataClassification(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates a full classification document", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information", "email", "billing address"]),
        makeService("next-auth", "auth", ["email", "name", "password hash"]),
        makeService("posthog", "analytics", ["page views", "device information", "IP address"]),
      ],
    });

    const doc = generateDataClassification(scan, { companyName: "TestCo" });
    assert.ok(doc !== null);
    assert.ok(doc!.includes("# Data Classification Report"));
    assert.ok(doc!.includes("TestCo"));
    assert.ok(doc!.includes("test-project"));
    assert.ok(doc!.includes("| Field | Source | Sensitivity | GDPR Category | Retention |"));
    assert.ok(doc!.includes("## Recommendations"));
    assert.ok(doc!.includes("High Sensitivity Data"));
    assert.ok(doc!.includes("Medium Sensitivity Data"));
    assert.ok(doc!.includes("Low Sensitivity Data"));
    assert.ok(doc!.includes("Total classified fields"));
  });

  it("includes special category recommendations when applicable", () => {
    const scan = makeScan({
      services: [
        makeService("health-api", "other", ["health records", "medical diagnosis"]),
      ],
    });

    const doc = generateDataClassification(scan);
    assert.ok(doc !== null);
    assert.ok(doc!.includes("Special Category Data (Art. 9)"));
    assert.ok(doc!.includes("Explicit consent required"));
    assert.ok(doc!.includes("Data Protection Impact Assessment"));
  });

  it("uses default company name when none provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });

    const doc = generateDataClassification(scan);
    assert.ok(doc !== null);
    assert.ok(doc!.includes("[Your Company Name]"));
  });
});

// ============================================================
// generateClassificationSummaryForPrivacyPolicy
// ============================================================

describe("generateClassificationSummaryForPrivacyPolicy", () => {
  it("returns null for empty scan", () => {
    const result = generateClassificationSummaryForPrivacyPolicy(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates privacy policy section with sensitivity breakdown", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information", "email"]),
        makeService("posthog", "analytics", ["page views", "IP address"]),
      ],
    });

    const section = generateClassificationSummaryForPrivacyPolicy(scan);
    assert.ok(section !== null);
    assert.ok(section!.includes("Data Sensitivity Classification"));
    assert.ok(section!.includes("Sensitivity Level"));
    assert.ok(section!.includes("Data Classification Report"));
  });
});

// ============================================================
// sensitivityLabel helper
// ============================================================

describe("sensitivityLabel", () => {
  it("returns correct labels", () => {
    assert.strictEqual(sensitivityLabel("special-category"), "Special Category (Art. 9)");
    assert.strictEqual(sensitivityLabel("high"), "High");
    assert.strictEqual(sensitivityLabel("medium"), "Medium");
    assert.strictEqual(sensitivityLabel("low"), "Low");
  });
});
