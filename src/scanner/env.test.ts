import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanEnvFiles } from "./env.js";

function createTempProject(envContent: string, filename = ".env.example"): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
  fs.writeFileSync(path.join(dir, filename), envContent);
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanEnvFiles", () => {
  it("detects OpenAI key", () => {
    const dir = createTempProject("OPENAI_API_KEY=sk-xxx");
    try {
      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
      assert.strictEqual(result[0].category, "ai");
      assert.ok(result[0].evidence[0].detail.includes("***"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple keys", () => {
    const dir = createTempProject(
      `OPENAI_API_KEY=sk-xxx\nSTRIPE_SECRET_KEY=rk_test_REPLACE_ME\nSENTRY_DSN=https://xxx`
    );
    try {
      const result = scanEnvFiles(dir);
      assert.ok(result.length >= 3);
    } finally {
      cleanup(dir);
    }
  });

  it("ignores comments", () => {
    const dir = createTempProject(
      `# This is a comment\n# OPENAI_API_KEY=xxx\nSTRIPE_SECRET_KEY=rk_test_REPLACE_ME`
    );
    try {
      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
    } finally {
      cleanup(dir);
    }
  });

  it("scans .env file", () => {
    const dir = createTempProject("OPENAI_API_KEY=sk-xxx", ".env");
    try {
      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("scans .env.local file", () => {
    const dir = createTempProject("STRIPE_SECRET_KEY=rk_test_REPLACE_ME", ".env.local");
    try {
      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no env files exist", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
    try {
      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("masks values in evidence", () => {
    const dir = createTempProject("OPENAI_API_KEY=sk-supersecretkey123");
    try {
      const result = scanEnvFiles(dir);
      assert.ok(!result[0].evidence[0].detail.includes("supersecret"));
      assert.ok(result[0].evidence[0].detail.includes("***"));
    } finally {
      cleanup(dir);
    }
  });
});
