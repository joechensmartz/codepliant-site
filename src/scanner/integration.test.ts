import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scan } from "./index.js";

function createFullProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-int-test-"));

  // package.json
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({
      name: "test-saas",
      dependencies: {
        openai: "^4.0.0",
        stripe: "^14.0.0",
        "next-auth": "^5.0.0",
        resend: "^3.0.0",
      },
    })
  );

  // Source files
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "src", "ai.ts"),
    `import OpenAI from "openai";\nconst ai = new OpenAI();`
  );
  fs.writeFileSync(
    path.join(dir, "src", "billing.ts"),
    `import Stripe from "stripe";\nconst stripe = new Stripe(process.env.STRIPE_KEY!);`
  );

  // .env.example
  fs.writeFileSync(
    path.join(dir, ".env.example"),
    `OPENAI_API_KEY=sk-xxx\nSTRIPE_SECRET_KEY=rk_test_REPLACE_ME\nNEXTAUTH_SECRET=xxx\nRESEND_API_KEY=re_xxx`
  );

  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scan (integration)", () => {
  it("combines all scanner results", () => {
    const dir = createFullProject();
    try {
      const result = scan(dir);

      assert.strictEqual(result.projectName, "test-saas");
      assert.ok(result.services.length >= 4);

      const names = result.services.map((s) => s.name);
      assert.ok(names.includes("openai"));
      assert.ok(names.includes("stripe"));
      assert.ok(names.includes("next-auth"));
      assert.ok(names.includes("resend"));
    } finally {
      cleanup(dir);
    }
  });

  it("deduplicates evidence from multiple scanners", () => {
    const dir = createFullProject();
    try {
      const result = scan(dir);
      const openai = result.services.find((s) => s.name === "openai")!;

      // Should have evidence from dependency + import + env
      const types = openai.evidence.map((e) => e.type);
      assert.ok(types.includes("dependency"));
      assert.ok(types.includes("import"));
      assert.ok(types.includes("env_var"));
    } finally {
      cleanup(dir);
    }
  });

  it("derives correct data categories", () => {
    const dir = createFullProject();
    try {
      const result = scan(dir);
      const catNames = result.dataCategories.map((c) => c.category);

      assert.ok(catNames.includes("AI Interaction Data"));
      assert.ok(catNames.includes("Financial Data"));
      assert.ok(catNames.includes("Personal Identity Data"));
      assert.ok(catNames.includes("Communication Data"));
    } finally {
      cleanup(dir);
    }
  });

  it("generates correct compliance needs", () => {
    const dir = createFullProject();
    try {
      const result = scan(dir);
      const docNames = result.complianceNeeds.map((n) => n.document);

      assert.ok(docNames.includes("Privacy Policy"));
      assert.ok(docNames.includes("Terms of Service"));
      assert.ok(docNames.includes("AI Disclosure"));
      assert.ok(docNames.includes("Cookie Policy"));
    } finally {
      cleanup(dir);
    }
  });

  it("marks AI Disclosure as required when AI detected", () => {
    const dir = createFullProject();
    try {
      const result = scan(dir);
      const aiNeed = result.complianceNeeds.find(
        (n) => n.document === "AI Disclosure"
      );
      assert.ok(aiNeed);
      assert.strictEqual(aiNeed!.priority, "required");
    } finally {
      cleanup(dir);
    }
  });

  it("handles empty project gracefully", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-int-test-"));
    try {
      const result = scan(dir);
      assert.strictEqual(result.services.length, 0);
      assert.strictEqual(result.dataCategories.length, 0);
      // Should still recommend ToS
      assert.ok(result.complianceNeeds.some((n) => n.document === "Terms of Service"));
    } finally {
      cleanup(dir);
    }
  });
});
