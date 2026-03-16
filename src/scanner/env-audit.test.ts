import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { auditEnvVars, categorizeEnvVar, generateEnvAudit } from "./env-audit.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-env-audit-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("categorizeEnvVar", () => {
  it("classifies secrets correctly", () => {
    assert.strictEqual(categorizeEnvVar("OPENAI_API_KEY"), "secret");
    assert.strictEqual(categorizeEnvVar("STRIPE_SECRET_KEY"), "secret");
    assert.strictEqual(categorizeEnvVar("AUTH_TOKEN"), "secret");
    assert.strictEqual(categorizeEnvVar("DB_PASSWORD"), "secret");
  });

  it("classifies database vars correctly", () => {
    assert.strictEqual(categorizeEnvVar("DATABASE_URL"), "database");
    assert.strictEqual(categorizeEnvVar("MONGODB_URI"), "database");
    assert.strictEqual(categorizeEnvVar("REDIS_HOST"), "database");
  });

  it("classifies service config correctly", () => {
    assert.strictEqual(categorizeEnvVar("API_URL"), "service-config");
    assert.strictEqual(categorizeEnvVar("SMTP_HOST"), "service-config");
    assert.strictEqual(categorizeEnvVar("SERVER_PORT"), "service-config");
  });

  it("classifies public vars correctly", () => {
    assert.strictEqual(categorizeEnvVar("NEXT_PUBLIC_GA_ID"), "public");
    assert.strictEqual(categorizeEnvVar("VITE_APP_TITLE"), "public");
    assert.strictEqual(categorizeEnvVar("REACT_APP_NAME"), "public");
  });

  it("public prefix takes priority over secret pattern", () => {
    assert.strictEqual(categorizeEnvVar("NEXT_PUBLIC_API_KEY"), "public");
  });
});

describe("auditEnvVars", () => {
  it("detects vars from .env files and categorizes them", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, ".env"),
        "OPENAI_API_KEY=sk-xxx\nDATABASE_URL=postgres://localhost\nAPP_PORT=3000\n"
      );
      const result = auditEnvVars(dir);
      assert.ok(result.vars.length >= 3);

      const apiKey = result.vars.find((v) => v.name === "OPENAI_API_KEY");
      assert.ok(apiKey);
      assert.strictEqual(apiKey.category, "secret");
      assert.ok(apiKey.hasValue);

      const dbUrl = result.vars.find((v) => v.name === "DATABASE_URL");
      assert.ok(dbUrl);
      assert.strictEqual(dbUrl.category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("flags secrets in .env as high risk", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, ".env"),
        "STRIPE_SECRET_KEY=sk_live_real_value\n"
      );
      const result = auditEnvVars(dir);
      const secretRisk = result.risks.find((r) =>
        r.message.includes("Secret values found in .env")
      );
      assert.ok(secretRisk, "Should flag secrets in .env");
      assert.strictEqual(secretRisk.severity, "high");
    } finally {
      cleanup(dir);
    }
  });

  it("flags missing .env.example and .gitignore issues", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, ".env"), "NODE_ENV=production\n");
      // No .env.example, no .gitignore
      const result = auditEnvVars(dir);

      const missingExample = result.risks.find((r) =>
        r.message.includes(".env.example")
      );
      assert.ok(missingExample, "Should warn about missing .env.example");

      const gitignoreRisk = result.risks.find((r) =>
        r.message.includes(".gitignore")
      );
      assert.ok(gitignoreRisk, "Should warn about .env not in .gitignore");
    } finally {
      cleanup(dir);
    }
  });
});

describe("generateEnvAudit", () => {
  it("produces markdown document with tables and recommendations", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, ".env"),
        "OPENAI_API_KEY=sk-xxx\nDATABASE_URL=postgres://localhost\nNEXT_PUBLIC_APP_NAME=MyApp\n"
      );
      const md = generateEnvAudit(dir);
      assert.ok(md.includes("# Environment Variable Audit"));
      assert.ok(md.includes("## Security Recommendations"));
      assert.ok(md.includes("## Environment Variables"));
      assert.ok(md.includes("OPENAI_API_KEY"));
      assert.ok(md.includes("API Key / Secret"));
      assert.ok(md.includes("Public / Client-side"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty string when no env vars found", () => {
    const dir = createTempDir();
    try {
      const md = generateEnvAudit(dir);
      assert.strictEqual(md, "");
    } finally {
      cleanup(dir);
    }
  });

  it("detects env var usage in code files", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(
        path.join(dir, "app.ts"),
        'const key = process.env.MY_SECRET_TOKEN;\nconst url = process.env.API_ENDPOINT;\n'
      );
      const result = auditEnvVars(dir);
      const secret = result.vars.find((v) => v.name === "MY_SECRET_TOKEN");
      assert.ok(secret, "Should find MY_SECRET_TOKEN from code");
      assert.strictEqual(secret.category, "secret");
      assert.ok(secret.foundIn.some((f) => f.includes("app.ts")));

      const endpoint = result.vars.find((v) => v.name === "API_ENDPOINT");
      assert.ok(endpoint, "Should find API_ENDPOINT from code");
      assert.strictEqual(endpoint.category, "service-config");
    } finally {
      cleanup(dir);
    }
  });
});
