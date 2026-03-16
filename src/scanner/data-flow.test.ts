import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService, DataCategory } from "./types.js";
import {
  buildDataFlowMap,
  renderDataFlowText,
  generateDataFlowMapDocument,
  generateDataFlowSection,
} from "./data-flow.js";

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
// buildDataFlowMap
// ============================================================

describe("buildDataFlowMap", () => {
  it("returns empty flow map for empty scan", () => {
    const flow = buildDataFlowMap(makeScan());
    assert.strictEqual(flow.collection.length, 0);
    assert.strictEqual(flow.storage.length, 0);
    assert.strictEqual(flow.sharing.length, 0);
  });

  it("maps auth services to collection", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "name", "session data"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.strictEqual(flow.collection.length, 1);
    assert.strictEqual(flow.collection[0].source, "User registration/login");
    assert.ok(flow.collection[0].dataItems.includes("email"));
    assert.ok(flow.collection[0].via.includes("next-auth"));
  });

  it("maps payment services to both collection and sharing", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information", "email"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.collection.length > 0, "should have collection entries");
    assert.ok(flow.sharing.length > 0, "should have sharing entries");
    assert.strictEqual(flow.collection[0].source, "Payment checkout");
    assert.strictEqual(flow.sharing[0].source, "stripe");
  });

  it("maps AI services to both collection and sharing", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "conversation history"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.collection.length > 0);
    assert.ok(flow.sharing.length > 0);
    assert.strictEqual(flow.collection[0].source, "AI-powered feature usage");
    assert.strictEqual(flow.sharing[0].source, "openai");
  });

  it("maps database services to storage", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user data as defined in schema"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.storage.length > 0);
    assert.strictEqual(flow.storage[0].source, "prisma");
  });

  it("maps analytics services to sharing only", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user behavior", "session recordings"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.strictEqual(flow.collection.length, 0);
    assert.ok(flow.sharing.length > 0);
    assert.strictEqual(flow.sharing[0].source, "posthog");
  });

  it("maps monitoring services to sharing", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error data", "IP address"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.sharing.length > 0);
    assert.strictEqual(flow.sharing[0].source, "@sentry/node");
  });

  it("maps storage services to storage section", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["uploaded files", "file metadata"])],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.storage.length > 0);
    assert.strictEqual(flow.storage[0].source, "@aws-sdk/client-s3");
  });

  it("includes API data collection categories in collection", () => {
    const scan = makeScan({
      dataCategories: [
        {
          category: "API Data Collection",
          description: "2 API endpoint(s) accepting user data via POST requests. Data fields collected: email, name.",
          sources: ["app/api/users/route.ts"],
        },
      ],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.collection.length > 0);
    assert.ok(flow.collection[0].source.includes("API endpoint"));
    assert.ok(flow.collection[0].dataItems.includes("email"));
    assert.ok(flow.collection[0].dataItems.includes("name"));
  });

  it("includes schema-derived data in storage", () => {
    const scan = makeScan({
      dataCategories: [
        {
          category: "Personal Identity Data",
          description: "names detected in Prisma schema fields: User.name.",
          sources: ["User.name"],
        },
      ],
    });
    const flow = buildDataFlowMap(scan);
    assert.ok(flow.storage.length > 0);
    assert.strictEqual(flow.storage[0].source, "Database schema");
    assert.ok(flow.storage[0].dataItems.includes("User.name"));
  });

  it("handles complex scan with multiple service types", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts", "conversation history"]),
        makeService("stripe", "payment", ["payment information", "email"]),
        makeService("posthog", "analytics", ["user behavior"]),
        makeService("next-auth", "auth", ["email", "name"]),
        makeService("prisma", "database", ["user data"]),
        makeService("@sentry/node", "monitoring", ["error data"]),
      ],
    });
    const flow = buildDataFlowMap(scan);
    // auth, payment, ai go to collection
    assert.ok(flow.collection.length >= 3);
    // prisma goes to storage
    assert.ok(flow.storage.length >= 1);
    // ai, payment, analytics, monitoring go to sharing
    assert.ok(flow.sharing.length >= 4);
  });
});

// ============================================================
// renderDataFlowText
// ============================================================

describe("renderDataFlowText", () => {
  it("renders empty flow with placeholder messages", () => {
    const text = renderDataFlowText({ collection: [], storage: [], sharing: [] });
    assert.ok(text.includes("Data Flow Summary:"));
    assert.ok(text.includes("COLLECTION:"));
    assert.ok(text.includes("STORAGE:"));
    assert.ok(text.includes("SHARING (Third Parties):"));
    assert.ok(text.includes("No direct data collection points detected"));
    assert.ok(text.includes("No data storage services detected"));
    assert.ok(text.includes("No third-party data sharing detected"));
  });

  it("renders entries with arrows", () => {
    const text = renderDataFlowText({
      collection: [
        { source: "User registration/login", dataItems: ["email", "name"], via: "via next-auth" },
      ],
      storage: [
        { source: "prisma", dataItems: ["user data"], via: "Database" },
      ],
      sharing: [
        { source: "openai", dataItems: ["user prompts"], via: "AI Service" },
      ],
    });
    assert.ok(text.includes("User registration/login → email, name (via next-auth)"));
    assert.ok(text.includes("prisma (Database) → user data"));
    assert.ok(text.includes("openai → user prompts"));
  });
});

// ============================================================
// generateDataFlowMapDocument
// ============================================================

describe("generateDataFlowMapDocument", () => {
  it("generates a valid markdown document", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const doc = generateDataFlowMapDocument(scan, "Acme Corp");
    assert.ok(doc.startsWith("# Data Flow Map"));
    assert.ok(doc.includes("Acme Corp"));
    assert.ok(doc.includes("test-project"));
    assert.ok(doc.includes("Data Collection Points"));
    assert.ok(doc.includes("Data Storage"));
    assert.ok(doc.includes("Third-Party Data Sharing"));
    assert.ok(doc.includes("Codepliant"));
  });

  it("uses placeholder when no company name provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const doc = generateDataFlowMapDocument(scan);
    assert.ok(doc.includes("[Your Company Name]"));
  });

  it("includes summary section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const doc = generateDataFlowMapDocument(scan);
    assert.ok(doc.includes("## Summary"));
    assert.ok(doc.includes("Data Flow Summary:"));
  });
});

// ============================================================
// generateDataFlowSection
// ============================================================

describe("generateDataFlowSection", () => {
  it("returns null for empty scan", () => {
    const result = generateDataFlowSection(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns section content when services are present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("prisma", "database", ["user data"]),
      ],
    });
    const result = generateDataFlowSection(scan);
    assert.ok(result !== null);
    assert.ok(result!.includes("How Your Data Flows Through Our Service"));
    assert.ok(result!.includes("Data Collection:"));
    assert.ok(result!.includes("Data Storage:"));
    assert.ok(result!.includes("Third-Party Data Sharing:"));
  });

  it("includes service names in section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const result = generateDataFlowSection(scan);
    assert.ok(result !== null);
    assert.ok(result!.includes("stripe"));
  });

  it("omits empty subsections", () => {
    // Analytics only goes to sharing, not collection or storage
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user behavior"])],
    });
    const result = generateDataFlowSection(scan);
    assert.ok(result !== null);
    assert.ok(!result!.includes("Data Collection:"));
    assert.ok(!result!.includes("Data Storage:"));
    assert.ok(result!.includes("Third-Party Data Sharing:"));
  });
});
