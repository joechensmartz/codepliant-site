import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDependencies } from "./dependencies.js";

function createTempProject(
  deps: Record<string, string>,
  devDeps?: Record<string, string>
): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
  const pkg: Record<string, unknown> = { name: "test-project" };
  if (Object.keys(deps).length > 0) pkg.dependencies = deps;
  if (devDeps && Object.keys(devDeps).length > 0) pkg.devDependencies = devDeps;
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanDependencies", () => {
  it("detects OpenAI dependency", () => {
    const dir = createTempProject({ openai: "^4.0.0" });
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
      assert.strictEqual(result[0].category, "ai");
      assert.ok(result[0].evidence.length > 0);
      assert.strictEqual(result[0].evidence[0].type, "dependency");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Stripe dependency", () => {
    const dir = createTempProject({ stripe: "^14.0.0" });
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
      assert.strictEqual(result[0].category, "payment");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple services", () => {
    const dir = createTempProject({
      openai: "^4.0.0",
      stripe: "^14.0.0",
      resend: "^3.0.0",
      "next-auth": "^5.0.0",
    });
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 4);
      const categories = result.map((r) => r.category).sort();
      assert.deepStrictEqual(categories, ["ai", "auth", "email", "payment"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects scoped packages with exact match", () => {
    const dir = createTempProject({
      "@anthropic-ai/sdk": "^0.30.0",
      "@sentry/nextjs": "^8.0.0",
      "@clerk/nextjs": "^5.0.0",
    });
    try {
      const result = scanDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("@anthropic-ai/sdk"));
      assert.ok(names.includes("@sentry/nextjs"));
      // Should NOT match @sentry/node when @sentry/nextjs is installed
      assert.ok(!names.includes("@sentry/node"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects devDependencies too", () => {
    const dir = createTempProject({}, { prisma: "^5.0.0" });
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "prisma");
      assert.strictEqual(result[0].category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project with no known services", () => {
    const dir = createTempProject({ lodash: "^4.0.0", express: "^4.0.0" });
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no package.json exists", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
    try {
      const result = scanDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("includes correct data collected info", () => {
    const dir = createTempProject({ stripe: "^14.0.0" });
    try {
      const result = scanDependencies(dir);
      assert.ok(result[0].dataCollected.includes("payment information"));
      assert.ok(result[0].dataCollected.includes("email"));
    } finally {
      cleanup(dir);
    }
  });
});
