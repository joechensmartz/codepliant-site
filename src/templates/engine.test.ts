import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  renderTemplate,
  buildVariables,
  initTemplates,
  hasCustomTemplate,
  renderCustomTemplate,
  getTemplatesDir,
  type TemplateVariables,
} from "./engine.js";
import type { ScanResult, DetectedService, DataCategory } from "../scanner/types.js";
import type { GeneratorContext } from "../generator/index.js";

// --- Helpers ---

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

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "TestCorp",
    contactEmail: "test@testcorp.com",
    ...overrides,
  };
}

// --- Test: renderTemplate variable substitution and conditionals ---

describe("renderTemplate", () => {
  it("substitutes {{variable}} placeholders with values", () => {
    const template = "Welcome to {{company}}. Contact us at {{email}}.";
    const variables: TemplateVariables = {
      company: "Acme Inc",
      email: "hello@acme.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-03-15",
      dpo: "",
      hasAI: false,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "Welcome to Acme Inc. Contact us at hello@acme.com.");
  });

  it("preserves unknown variables as-is", () => {
    const template = "Hello {{unknownVar}}.";
    const variables: TemplateVariables = {
      company: "X",
      email: "x@x.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-01-01",
      dpo: "",
      hasAI: false,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "Hello {{unknownVar}}.");
  });

  it("renders {{#if hasAI}}...{{/if}} block when condition is true", () => {
    const template = "Start.{{#if hasAI}} AI is enabled.{{/if}} End.";
    const variables: TemplateVariables = {
      company: "X",
      email: "x@x.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-01-01",
      dpo: "",
      hasAI: true,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "Start. AI is enabled. End.");
  });

  it("removes {{#if hasAI}}...{{/if}} block when condition is false", () => {
    const template = "Start.{{#if hasAI}} AI is enabled.{{/if}} End.";
    const variables: TemplateVariables = {
      company: "X",
      email: "x@x.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-01-01",
      dpo: "",
      hasAI: false,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "Start. End.");
  });

  it("handles {{#if}} with truthy string variable", () => {
    const template = "{{#if dpo}}DPO: {{dpo}}{{/if}}";
    const variables: TemplateVariables = {
      company: "X",
      email: "x@x.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-01-01",
      dpo: "Jane Smith (jane@x.com)",
      hasAI: false,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "DPO: Jane Smith (jane@x.com)");
  });

  it("handles {{#if}} with falsy string variable (Not designated)", () => {
    const template = "Before.{{#if dpo}}DPO: {{dpo}}{{/if}}After.";
    const variables: TemplateVariables = {
      company: "X",
      email: "x@x.com",
      services: "",
      dataCategories: "",
      jurisdiction: "",
      date: "2026-01-01",
      dpo: "Not designated",
      hasAI: false,
    };

    const result = renderTemplate(template, variables);
    assert.equal(result, "Before.After.");
  });

  it("substitutes all variables in a multiline template", () => {
    const template = `# Policy for {{company}}
Date: {{date}}
Services: {{services}}
Jurisdiction: {{jurisdiction}}`;

    const variables: TemplateVariables = {
      company: "BigCo",
      email: "legal@bigco.com",
      services: "Stripe, OpenAI",
      dataCategories: "Payment, AI",
      jurisdiction: "GDPR",
      date: "2026-03-15",
      dpo: "",
      hasAI: true,
    };

    const result = renderTemplate(template, variables);
    assert.ok(result.includes("# Policy for BigCo"));
    assert.ok(result.includes("Date: 2026-03-15"));
    assert.ok(result.includes("Services: Stripe, OpenAI"));
    assert.ok(result.includes("Jurisdiction: GDPR"));
  });
});

// --- Test: initTemplates creates template files ---

describe("initTemplates", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-template-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates templates directory and default template files", () => {
    const created = initTemplates(tmpDir);

    assert.ok(created.length > 0, "Should create at least one template");
    assert.ok(fs.existsSync(path.join(tmpDir, "templates")), "templates/ directory should exist");

    // Check that privacy-policy.md was created
    const ppPath = path.join(tmpDir, "templates", "privacy-policy.md");
    assert.ok(fs.existsSync(ppPath), "privacy-policy.md template should exist");

    const content = fs.readFileSync(ppPath, "utf-8");
    assert.ok(content.includes("{{company}}"), "Template should contain {{company}} variable");
    assert.ok(content.includes("{{#if hasAI}}"), "Template should contain conditional block");
  });

  it("does not overwrite existing templates", () => {
    // Create first
    initTemplates(tmpDir);

    // Modify a template
    const ppPath = path.join(tmpDir, "templates", "privacy-policy.md");
    fs.writeFileSync(ppPath, "Custom content", "utf-8");

    // Init again
    const created = initTemplates(tmpDir);
    assert.equal(created.length, 0, "Should not create any new files when all exist");

    // Verify content was not overwritten
    const content = fs.readFileSync(ppPath, "utf-8");
    assert.equal(content, "Custom content", "Existing template should not be overwritten");
  });
});

// --- Test: hasCustomTemplate and renderCustomTemplate integration ---

describe("custom template integration", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-template-int-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("hasCustomTemplate returns false when no templates exist", () => {
    assert.equal(hasCustomTemplate(tmpDir, "PRIVACY_POLICY.md"), false);
  });

  it("hasCustomTemplate returns true when template file exists", () => {
    const templatesDir = path.join(tmpDir, "templates");
    fs.mkdirSync(templatesDir, { recursive: true });
    fs.writeFileSync(path.join(templatesDir, "privacy-policy.md"), "template", "utf-8");

    assert.equal(hasCustomTemplate(tmpDir, "PRIVACY_POLICY.md"), true);
  });

  it("renderCustomTemplate renders with scan data and context", () => {
    const templatesDir = path.join(tmpDir, "templates");
    fs.mkdirSync(templatesDir, { recursive: true });
    fs.writeFileSync(
      path.join(templatesDir, "privacy-policy.md"),
      "Policy for {{company}}. Services: {{services}}.{{#if hasAI}} Uses AI.{{/if}}",
      "utf-8",
    );

    const scanResult = makeScan({
      projectPath: tmpDir,
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });

    const ctx = makeCtx({
      companyName: "MyCorp",
      contactEmail: "legal@mycorp.com",
    });

    const result = renderCustomTemplate(tmpDir, "PRIVACY_POLICY.md", scanResult, ctx);
    assert.ok(result !== null, "Should return rendered content");
    assert.ok(result!.includes("Policy for MyCorp"), "Should substitute company name");
    assert.ok(result!.includes("openai"), "Should include detected services");
    assert.ok(result!.includes("Uses AI"), "Should include AI conditional block");
  });

  it("renderCustomTemplate returns null when no template exists", () => {
    const scanResult = makeScan({ projectPath: tmpDir });
    const ctx = makeCtx();

    const result = renderCustomTemplate(tmpDir, "PRIVACY_POLICY.md", scanResult, ctx);
    assert.equal(result, null);
  });

  it("renderCustomTemplate omits AI block when no AI services detected", () => {
    const templatesDir = path.join(tmpDir, "templates");
    fs.mkdirSync(templatesDir, { recursive: true });
    fs.writeFileSync(
      path.join(templatesDir, "privacy-policy.md"),
      "Start.{{#if hasAI}} AI section.{{/if}} End.",
      "utf-8",
    );

    const scanResult = makeScan({
      projectPath: tmpDir,
      services: [makeService("stripe", "payment")],
    });

    const ctx = makeCtx();

    const result = renderCustomTemplate(tmpDir, "PRIVACY_POLICY.md", scanResult, ctx);
    assert.ok(result !== null);
    assert.equal(result, "Start. End.");
  });
});
