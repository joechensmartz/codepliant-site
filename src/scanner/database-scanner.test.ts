import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { scanDatabases, generateDataStorageSection } from "./database-scanner.js";

describe("database-scanner", () => {
  it("returns empty results for a project with no databases", () => {
    const result = scanDatabases("/tmp/nonexistent-project-codepliant-test");
    assert.deepStrictEqual(result.databases, []);
  });

  it("generateDataStorageSection returns null when no databases", () => {
    const result = generateDataStorageSection({ databases: [] });
    assert.strictEqual(result, null);
  });

  it("generateDataStorageSection generates table for databases", () => {
    const result = generateDataStorageSection({
      databases: [
        {
          type: "postgresql",
          evidence: [{ source: "dependency", file: "package.json", detail: "pg" }],
        },
        {
          type: "redis",
          evidence: [{ source: "docker-compose", file: "docker-compose.yml", detail: "redis" }],
        },
      ],
    });
    assert.ok(result);
    assert.ok(result.includes("PostgreSQL"));
    assert.ok(result.includes("Redis"));
    assert.ok(result.includes("Data Storage Infrastructure"));
  });
});
