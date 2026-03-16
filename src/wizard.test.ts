import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { loadConfig, saveConfig } from "./config.js";
import type { CodepliantConfig } from "./config.js";
import { scan } from "./scanner/index.js";
import { generateDocuments } from "./generator/index.js";
import type { ScanResult, DetectedService } from "./scanner/index.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-wizard-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ============================================================
// Config: confirmedServices and excludeServices
// ============================================================

describe("wizard config fields", () => {
  it("saves and loads confirmedServices", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        confirmedServices: ["stripe", "openai"],
      };
      saveConfig(dir, config);
      const loaded = loadConfig(dir);
      assert.deepStrictEqual(loaded.confirmedServices, ["stripe", "openai"]);
    } finally {
      cleanup(dir);
    }
  });

  it("saves and loads excludeServices", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        excludeServices: ["posthog", "mixpanel"],
      };
      saveConfig(dir, config);
      const loaded = loadConfig(dir);
      assert.deepStrictEqual(loaded.excludeServices, ["posthog", "mixpanel"]);
    } finally {
      cleanup(dir);
    }
  });

  it("saves both confirmedServices and excludeServices together", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        confirmedServices: ["stripe"],
        excludeServices: ["posthog"],
      };
      saveConfig(dir, config);
      const loaded = loadConfig(dir);
      assert.deepStrictEqual(loaded.confirmedServices, ["stripe"]);
      assert.deepStrictEqual(loaded.excludeServices, ["posthog"]);
    } finally {
      cleanup(dir);
    }
  });

  it("defaults to undefined when not set", () => {
    const dir = createTempDir();
    try {
      const config: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
      };
      saveConfig(dir, config);
      const loaded = loadConfig(dir);
      assert.strictEqual(loaded.confirmedServices, undefined);
      assert.strictEqual(loaded.excludeServices, undefined);
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Wizard service filtering logic
// ============================================================

describe("wizard service filtering", () => {
  function makeScanResult(services: DetectedService[]): ScanResult {
    return {
      projectName: "test-project",
      projectPath: "/tmp/test",
      scannedAt: new Date().toISOString(),
      services,
      dataCategories: [],
      complianceNeeds: [],
    };
  }

  function makeService(name: string, category: string = "analytics"): DetectedService {
    return {
      name,
      category: category as DetectedService["category"],
      evidence: [{ type: "dependency", file: "package.json", detail: name }],
      dataCollected: ["user data"],
    };
  }

  it("filters out excluded services from scan results", () => {
    const services = [
      makeService("stripe", "payment"),
      makeService("posthog", "analytics"),
      makeService("openai", "ai"),
    ];

    const excludedServices = ["posthog"];

    const filteredServices = services.filter(
      (s) => !excludedServices.includes(s.name)
    );

    assert.strictEqual(filteredServices.length, 2);
    assert.ok(filteredServices.some((s) => s.name === "stripe"));
    assert.ok(filteredServices.some((s) => s.name === "openai"));
    assert.ok(!filteredServices.some((s) => s.name === "posthog"));
  });

  it("keeps all services when no exclusions", () => {
    const services = [
      makeService("stripe", "payment"),
      makeService("posthog", "analytics"),
    ];

    const excludedServices: string[] = [];
    const filteredServices = services.filter(
      (s) => !excludedServices.includes(s.name)
    );

    assert.strictEqual(filteredServices.length, 2);
  });

  it("handles excluding all services", () => {
    const services = [
      makeService("stripe", "payment"),
      makeService("posthog", "analytics"),
    ];

    const excludedServices = ["stripe", "posthog"];
    const filteredServices = services.filter(
      (s) => !excludedServices.includes(s.name)
    );

    assert.strictEqual(filteredServices.length, 0);
  });

  it("generates documents with filtered services", () => {
    const dir = createTempDir();
    try {
      const services = [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ];

      const result = makeScanResult(services);
      const filteredResult = {
        ...result,
        services: result.services.filter((s) => s.name !== "posthog"),
      };

      const config: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        excludeServices: ["posthog"],
      };

      const allDocs = generateDocuments(result, config);
      const filteredDocs = generateDocuments(filteredResult, config);

      // Both should generate docs, but filtered should not mention excluded service
      assert.ok(allDocs.length > 0);
      assert.ok(filteredDocs.length > 0);

      // Check that posthog is not mentioned in filtered docs
      for (const doc of filteredDocs) {
        assert.ok(
          !doc.content.includes("posthog"),
          `Document ${doc.name} should not mention excluded service "posthog"`
        );
      }
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Wizard previous selections
// ============================================================

describe("wizard previous selections", () => {
  it("remembers confirmed services across config saves", () => {
    const dir = createTempDir();
    try {
      // Simulate first wizard run
      const config1: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        confirmedServices: ["stripe", "openai"],
        excludeServices: ["posthog"],
      };
      saveConfig(dir, config1);

      // Simulate loading for second wizard run
      const loaded = loadConfig(dir);
      const previouslyConfirmed = new Set(loaded.confirmedServices || []);
      const previouslyExcluded = new Set(loaded.excludeServices || []);

      assert.ok(previouslyConfirmed.has("stripe"));
      assert.ok(previouslyConfirmed.has("openai"));
      assert.ok(previouslyExcluded.has("posthog"));
      assert.ok(!previouslyConfirmed.has("posthog"));
      assert.ok(!previouslyExcluded.has("stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("overwrites previous selections on new wizard run", () => {
    const dir = createTempDir();
    try {
      // First run
      const config1: CodepliantConfig = {
        companyName: "Test Corp",
        contactEmail: "test@example.com",
        outputDir: "legal",
        confirmedServices: ["stripe"],
        excludeServices: ["posthog"],
      };
      saveConfig(dir, config1);

      // Second run with different selections
      const config2: CodepliantConfig = {
        ...loadConfig(dir),
        confirmedServices: ["stripe", "posthog"],
        excludeServices: [],
      };
      saveConfig(dir, config2);

      const loaded = loadConfig(dir);
      assert.deepStrictEqual(loaded.confirmedServices, ["stripe", "posthog"]);
      assert.deepStrictEqual(loaded.excludeServices, []);
    } finally {
      cleanup(dir);
    }
  });
});
