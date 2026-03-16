import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { scanSecrets, generateSecretsAuditSection } from "./secrets-scanner.js";

describe("secrets-scanner", () => {
  it("returns empty results for a project with no secrets", () => {
    const result = scanSecrets("/tmp/nonexistent-project-codepliant-test");
    assert.deepStrictEqual(result.findings, []);
    assert.deepStrictEqual(result.risks, []);
  });

  it("generateSecretsAuditSection returns empty for no findings", () => {
    const result = generateSecretsAuditSection("/tmp/nonexistent-project-codepliant-test");
    assert.strictEqual(result, "");
  });
});
