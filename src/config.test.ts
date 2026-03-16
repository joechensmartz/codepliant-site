import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { loadConfig, saveConfig, configExists, validateConfig } from "./config.js";
import type { CodepliantConfig, ConfigWarning } from "./config.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-config-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ============================================================
// loadConfig
// ============================================================

describe("loadConfig", () => {
  it("returns defaults when no config file exists", () => {
    const dir = createTempDir();
    try {
      const config = loadConfig(dir);
      assert.strictEqual(config.companyName, "[Your Company Name]");
      assert.strictEqual(config.contactEmail, "[your-email@example.com]");
      assert.strictEqual(config.outputDir, "legal");
    } finally {
      cleanup(dir);
    }
  });

  it("reads existing config file", () => {
    const dir = createTempDir();
    try {
      const customConfig = {
        companyName: "Test Corp",
        contactEmail: "test@test.com",
        outputDir: "docs",
        jurisdiction: "UK",
      };
      fs.writeFileSync(
        path.join(dir, ".codepliantrc.json"),
        JSON.stringify(customConfig),
        "utf-8"
      );

      const config = loadConfig(dir);
      assert.strictEqual(config.companyName, "Test Corp");
      assert.strictEqual(config.contactEmail, "test@test.com");
      assert.strictEqual(config.outputDir, "docs");
      assert.strictEqual(config.jurisdiction, "UK");
    } finally {
      cleanup(dir);
    }
  });

  it("merges partial config with defaults", () => {
    const dir = createTempDir();
    try {
      const partial = { companyName: "Partial Corp" };
      fs.writeFileSync(
        path.join(dir, ".codepliantrc.json"),
        JSON.stringify(partial),
        "utf-8"
      );

      const config = loadConfig(dir);
      assert.strictEqual(config.companyName, "Partial Corp");
      assert.strictEqual(config.contactEmail, "[your-email@example.com]");
      assert.strictEqual(config.outputDir, "legal");
    } finally {
      cleanup(dir);
    }
  });

  it("returns defaults for invalid JSON", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, ".codepliantrc.json"),
        "not valid json {{{",
        "utf-8"
      );

      const config = loadConfig(dir);
      assert.strictEqual(config.companyName, "[Your Company Name]");
      assert.strictEqual(config.outputDir, "legal");
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// saveConfig
// ============================================================

describe("saveConfig", () => {
  it("writes valid JSON file", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Save Corp",
        contactEmail: "save@corp.com",
        outputDir: "legal",
      };

      const filePath = saveConfig(dir, config);
      assert.ok(fs.existsSync(filePath));

      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      assert.strictEqual(parsed.companyName, "Save Corp");
      assert.strictEqual(parsed.contactEmail, "save@corp.com");
    } finally {
      cleanup(dir);
    }
  });

  it("can be read back with loadConfig", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Roundtrip Inc",
        contactEmail: "rt@inc.com",
        outputDir: "out",
        jurisdiction: "Germany",
        website: "https://roundtrip.com",
      };

      saveConfig(dir, config);
      const loaded = loadConfig(dir);

      assert.strictEqual(loaded.companyName, "Roundtrip Inc");
      assert.strictEqual(loaded.contactEmail, "rt@inc.com");
      assert.strictEqual(loaded.outputDir, "out");
      assert.strictEqual(loaded.jurisdiction, "Germany");
      assert.strictEqual(loaded.website, "https://roundtrip.com");
    } finally {
      cleanup(dir);
    }
  });

  it("returns the config file path", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Path Corp",
        contactEmail: "path@corp.com",
        outputDir: "legal",
      };

      const filePath = saveConfig(dir, config);
      assert.ok(filePath.endsWith(".codepliantrc.json"));
      assert.ok(filePath.startsWith(dir));
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// configExists
// ============================================================

describe("configExists", () => {
  it("returns false when no config file exists", () => {
    const dir = createTempDir();
    try {
      assert.strictEqual(configExists(dir), false);
    } finally {
      cleanup(dir);
    }
  });

  it("returns true when config file exists", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, ".codepliantrc.json"),
        "{}",
        "utf-8"
      );
      assert.strictEqual(configExists(dir), true);
    } finally {
      cleanup(dir);
    }
  });

  it("returns true after saveConfig", () => {
    const dir = createTempDir();
    try {
      assert.strictEqual(configExists(dir), false);

      saveConfig(dir, {
        companyName: "Exists Corp",
        contactEmail: "exists@corp.com",
        outputDir: "legal",
      });

      assert.strictEqual(configExists(dir), true);
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// validateConfig
// ============================================================

function makeValidConfig(overrides: Partial<CodepliantConfig> = {}): CodepliantConfig {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    outputDir: "legal",
    ...overrides,
  };
}

function warningFields(warnings: ConfigWarning[]): string[] {
  return warnings.map((w) => w.field);
}

describe("validateConfig", () => {
  it("returns no warnings for a fully valid config", () => {
    const warnings = validateConfig(makeValidConfig({
      jurisdictions: ["GDPR", "CCPA"],
      outputFormat: "html",
      language: "de",
      dataRetentionDays: 365,
      aiRiskLevel: "limited",
    }));
    assert.strictEqual(warnings.length, 0);
  });

  it("warns when companyName is a placeholder", () => {
    const warnings = validateConfig(makeValidConfig({ companyName: "[Your Company Name]" }));
    assert.ok(warningFields(warnings).includes("companyName"));
    assert.ok(warnings.find((w) => w.field === "companyName")!.message.includes("placeholder"));
  });

  it("warns when contactEmail is not a valid email", () => {
    const warnings = validateConfig(makeValidConfig({ contactEmail: "not-an-email" }));
    assert.ok(warningFields(warnings).includes("contactEmail"));
    assert.ok(warnings.find((w) => w.field === "contactEmail")!.message.includes("doesn't look like"));
  });

  it("warns on invalid jurisdictions, outputFormat, language, and aiRiskLevel", () => {
    const config = makeValidConfig({
      jurisdictions: ["GDPR", "HIPAA"],
      outputFormat: "docx" as CodepliantConfig["outputFormat"],
      language: "zh",
      aiRiskLevel: "extreme" as CodepliantConfig["aiRiskLevel"],
    });
    const warnings = validateConfig(config);
    const fields = warningFields(warnings);
    assert.ok(fields.includes("jurisdictions"), "should warn about invalid jurisdiction");
    assert.ok(fields.includes("outputFormat"), "should warn about invalid outputFormat");
    assert.ok(fields.includes("language"), "should warn about unsupported language");
    assert.ok(fields.includes("aiRiskLevel"), "should warn about invalid aiRiskLevel");
  });

  it("warns when dataRetentionDays is zero or negative", () => {
    const warningsZero = validateConfig(makeValidConfig({ dataRetentionDays: 0 }));
    assert.ok(warningFields(warningsZero).includes("dataRetentionDays"));

    const warningsNeg = validateConfig(makeValidConfig({ dataRetentionDays: -30 }));
    assert.ok(warningFields(warningsNeg).includes("dataRetentionDays"));
    assert.ok(warningsNeg.find((w) => w.field === "dataRetentionDays")!.message.includes("positive"));
  });
});
