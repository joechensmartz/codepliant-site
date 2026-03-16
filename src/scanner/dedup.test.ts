import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { deduplicateServiceFamilies, scan } from "./index.js";
import type { DetectedService } from "./types.js";

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("deduplicateServiceFamilies", () => {
  it("keeps the family member with the most evidence", () => {
    const serviceMap = new Map<string, DetectedService>();
    serviceMap.set("@sentry/node", {
      name: "@sentry/node",
      category: "monitoring",
      evidence: [
        { type: "env_var", file: ".env", detail: "SENTRY_DSN=***" },
      ],
      dataCollected: ["error data"],
    });
    serviceMap.set("@sentry/nextjs", {
      name: "@sentry/nextjs",
      category: "monitoring",
      evidence: [
        { type: "dependency", file: "package.json", detail: "@sentry/nextjs@8.0.0" },
        { type: "import", file: "src/app.ts", detail: 'import * as Sentry from "@sentry/nextjs"' },
        { type: "env_var", file: ".env", detail: "SENTRY_DSN=***" },
      ],
      dataCollected: ["error data", "stack traces"],
    });
    serviceMap.set("@sentry/react", {
      name: "@sentry/react",
      category: "monitoring",
      evidence: [
        { type: "dependency", file: "package.json", detail: "@sentry/react@8.0.0" },
      ],
      dataCollected: ["error data"],
    });

    deduplicateServiceFamilies(serviceMap);

    // Only the winner (@sentry/nextjs with 3 evidence) should remain
    assert.strictEqual(serviceMap.size, 1);
    assert.ok(serviceMap.has("@sentry/nextjs"));
    assert.ok(!serviceMap.has("@sentry/node"));
    assert.ok(!serviceMap.has("@sentry/react"));
  });

  it("merges evidence and dataCollected from losers into winner", () => {
    const serviceMap = new Map<string, DetectedService>();
    serviceMap.set("@sentry/nextjs", {
      name: "@sentry/nextjs",
      category: "monitoring",
      evidence: [
        { type: "dependency", file: "package.json", detail: "@sentry/nextjs@8.0.0" },
        { type: "import", file: "src/app.ts", detail: 'import "@sentry/nextjs"' },
      ],
      dataCollected: ["error data", "stack traces"],
    });
    serviceMap.set("@sentry/node", {
      name: "@sentry/node",
      category: "monitoring",
      evidence: [
        { type: "env_var", file: ".env", detail: "SENTRY_DSN=***" },
      ],
      dataCollected: ["error data", "IP address"],
    });

    deduplicateServiceFamilies(serviceMap);

    const winner = serviceMap.get("@sentry/nextjs")!;
    // Winner should have all 3 evidence items (2 own + 1 merged)
    assert.strictEqual(winner.evidence.length, 3);
    // Winner should have merged dataCollected (deduplicated)
    assert.ok(winner.dataCollected.includes("IP address"));
    assert.ok(winner.dataCollected.includes("stack traces"));
  });

  it("does not affect services outside any family", () => {
    const serviceMap = new Map<string, DetectedService>();
    serviceMap.set("stripe", {
      name: "stripe",
      category: "payment",
      evidence: [{ type: "dependency", file: "package.json", detail: "stripe@14.0.0" }],
      dataCollected: ["payment information"],
    });
    serviceMap.set("openai", {
      name: "openai",
      category: "ai",
      evidence: [{ type: "dependency", file: "package.json", detail: "openai@4.0.0" }],
      dataCollected: ["user prompts"],
    });

    deduplicateServiceFamilies(serviceMap);

    assert.strictEqual(serviceMap.size, 2);
    assert.ok(serviceMap.has("stripe"));
    assert.ok(serviceMap.has("openai"));
  });

  it("handles a family with only one member present (no-op)", () => {
    const serviceMap = new Map<string, DetectedService>();
    serviceMap.set("@sentry/nextjs", {
      name: "@sentry/nextjs",
      category: "monitoring",
      evidence: [
        { type: "dependency", file: "package.json", detail: "@sentry/nextjs@8.0.0" },
      ],
      dataCollected: ["error data"],
    });

    deduplicateServiceFamilies(serviceMap);

    assert.strictEqual(serviceMap.size, 1);
    assert.ok(serviceMap.has("@sentry/nextjs"));
  });

  it("deduplicates AWS SDK family members", () => {
    const serviceMap = new Map<string, DetectedService>();
    serviceMap.set("@aws-sdk/client-s3", {
      name: "@aws-sdk/client-s3",
      category: "storage",
      evidence: [
        { type: "dependency", file: "package.json", detail: "@aws-sdk/client-s3@3.0.0" },
        { type: "import", file: "src/upload.ts", detail: 'import { S3Client } from "@aws-sdk/client-s3"' },
      ],
      dataCollected: ["uploaded files", "file metadata"],
    });
    serviceMap.set("@aws-sdk/client-ses", {
      name: "@aws-sdk/client-ses",
      category: "email",
      evidence: [
        { type: "env_var", file: ".env", detail: "AWS_ACCESS_KEY_ID=***" },
      ],
      dataCollected: ["email addresses", "email content"],
    });

    deduplicateServiceFamilies(serviceMap);

    // S3 has more evidence so it wins
    assert.strictEqual(serviceMap.size, 1);
    assert.ok(serviceMap.has("@aws-sdk/client-s3"));
    const winner = serviceMap.get("@aws-sdk/client-s3")!;
    // Evidence merged
    assert.strictEqual(winner.evidence.length, 3);
    // Data collected merged
    assert.ok(winner.dataCollected.includes("email addresses"));
  });
});

describe("scan integration: family deduplication", () => {
  it("deduplicates sentry packages in a full scan", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-dedup-test-"));
    try {
      // Create a project with multiple Sentry packages
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "test-sentry-dedup",
          dependencies: {
            "@sentry/nextjs": "^8.0.0",
            "@sentry/react": "^8.0.0",
          },
        })
      );
      fs.writeFileSync(path.join(dir, ".env.example"), "SENTRY_DSN=https://xxx@sentry.io/123\n");

      const result = scan(dir);
      const sentryServices = result.services.filter((s) => s.name.includes("sentry"));

      // Should have exactly 1 sentry service after dedup
      assert.strictEqual(sentryServices.length, 1);
    } finally {
      cleanup(dir);
    }
  });
});
