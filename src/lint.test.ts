import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { lintDocuments } from "./lint.js";

function createTempProject(
  deps: Record<string, string> = {},
  existingDocs: Record<string, string> = {}
): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-lint-test-"));
  const pkg: Record<string, unknown> = { name: "lint-test-project" };
  if (Object.keys(deps).length > 0) pkg.dependencies = deps;
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));

  if (Object.keys(existingDocs).length > 0) {
    const legalDir = path.join(dir, "legal");
    fs.mkdirSync(legalDir, { recursive: true });
    for (const [filename, content] of Object.entries(existingDocs)) {
      fs.writeFileSync(path.join(legalDir, filename), content);
    }
  }

  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("lintDocuments", () => {
  it("reports missing documents when legal/ is empty", () => {
    const dir = createTempProject({ stripe: "^14.0.0" });
    try {
      const result = lintDocuments(dir, "legal");
      assert.strictEqual(result.passed, false);
      assert.ok(result.issues.length > 0);
      assert.ok(result.issues.some((i) => i.severity === "error" && i.message.includes("Missing document")));
    } finally {
      cleanup(dir);
    }
  });

  it("counts checked documents and reports structure", () => {
    // Even with no deps, codepliant generates several always-on docs.
    // Just verify that when we provide at least one matching doc, it gets checked.
    const dir = createTempProject({}, {
      "TERMS_OF_SERVICE.md": "# Terms of Service\n\n## Acceptance of Terms\n\nContent here.\n",
    });
    try {
      const result = lintDocuments(dir, "legal");
      assert.ok(result.documentsChecked >= 1, "Should have checked at least one document");
      assert.ok(result.documentsExpected >= 1, "Should expect at least one document");
    } finally {
      cleanup(dir);
    }
  });

  it("detects placeholder values in documents", () => {
    const dir = createTempProject({}, {
      "TERMS_OF_SERVICE.md": "# Terms of Service\n\n[Your Company Name] provides this service.\n",
      "SECURITY.md": "# Security Policy\n\nContent.\n",
      "INCIDENT_RESPONSE_PLAN.md": "# Incident Response Plan\n\nContent.\n",
    });
    try {
      const result = lintDocuments(dir, "legal");
      const placeholderIssues = result.issues.filter((i) => i.message.includes("placeholder"));
      assert.ok(placeholderIssues.length > 0, "Should detect placeholder values");
    } finally {
      cleanup(dir);
    }
  });

  it("returns structured result with counts", () => {
    const dir = createTempProject();
    try {
      const result = lintDocuments(dir, "legal");
      assert.ok(typeof result.documentsChecked === "number");
      assert.ok(typeof result.documentsExpected === "number");
      assert.ok(Array.isArray(result.issues));
      assert.ok(typeof result.passed === "boolean");
    } finally {
      cleanup(dir);
    }
  });
});
