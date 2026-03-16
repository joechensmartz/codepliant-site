import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPhpDependencies } from "./php.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-php-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanPhpDependencies", () => {
  it("returns empty for project without composer.json", () => {
    const dir = createTempProject({});
    try {
      const result = scanPhpDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects stripe/stripe-php from require", () => {
    const dir = createTempProject({
      "composer.json": JSON.stringify({
        require: {
          "php": "^8.1",
          "stripe/stripe-php": "^13.0",
          "laravel/framework": "^10.0",
        },
      }),
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
      assert.strictEqual(result[0].category, "payment");
    } finally {
      cleanup(dir);
    }
  });

  it("detects services from both require and require-dev", () => {
    const dir = createTempProject({
      "composer.json": JSON.stringify({
        require: {
          "stripe/stripe-php": "^13.0",
          "twilio/sdk": "^7.0",
          "firebase/php-jwt": "^6.0",
        },
        "require-dev": {
          "sentry/sentry-laravel": "^4.0",
        },
      }),
    });
    try {
      const result = scanPhpDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("stripe"), "should detect stripe");
      assert.ok(names.includes("twilio"), "should detect twilio");
      assert.ok(names.includes("firebase-jwt"), "should detect firebase-jwt");
      assert.ok(names.includes("sentry-laravel"), "should detect sentry from require-dev");
    } finally {
      cleanup(dir);
    }
  });

  it("detects full Laravel app stack", () => {
    const dir = createTempProject({
      "composer.json": JSON.stringify({
        require: {
          "php": "^8.2",
          "laravel/framework": "^11.0",
          "stripe/stripe-php": "^13.0",
          "aws/aws-sdk-php": "^3.0",
          "google/cloud-storage": "^1.30",
          "laravel/socialite": "^5.0",
          "spatie/laravel-permission": "^6.0",
          "spatie/laravel-analytics": "^5.0",
          "mailchimp/marketing": "^3.0",
          "league/oauth2-client": "^2.7",
        },
      }),
    });
    try {
      const result = scanPhpDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("stripe"), "should detect stripe");
      assert.ok(names.includes("aws-sdk-php"), "should detect aws");
      assert.ok(names.includes("google-cloud-storage"), "should detect gcs");
      assert.ok(names.includes("laravel-socialite"), "should detect socialite");
      assert.ok(names.includes("laravel-permission"), "should detect permission");
      assert.ok(names.includes("laravel-analytics"), "should detect analytics");
      assert.ok(names.includes("mailchimp"), "should detect mailchimp");
      assert.ok(names.includes("oauth2-client"), "should detect oauth2-client");
      assert.strictEqual(result.length, 8);
    } finally {
      cleanup(dir);
    }
  });

  it("includes correct evidence", () => {
    const dir = createTempProject({
      "composer.json": JSON.stringify({
        require: {
          "stripe/stripe-php": "^13.0",
        },
      }),
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].evidence[0].type, "dependency");
      assert.strictEqual(result[0].evidence[0].file, "composer.json");
      assert.ok(result[0].evidence[0].detail.includes("stripe/stripe-php"));
    } finally {
      cleanup(dir);
    }
  });
});
