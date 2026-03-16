import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanRustDependencies } from "./rust.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-rust-test-"));
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

describe("scanRustDependencies", () => {
  it("returns empty for project without Cargo.toml", () => {
    const dir = createTempProject({});
    try {
      const result = scanRustDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects simple version dependencies", () => {
    const dir = createTempProject({
      "Cargo.toml": `[package]
name = "myapp"
version = "0.1.0"

[dependencies]
reqwest = "0.12"
sentry = "0.34"
tokio = { version = "1", features = ["full"] }
`,
    });
    try {
      const result = scanRustDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("sentry"), "should detect sentry");
      assert.ok(result.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects dependencies with inline table syntax", () => {
    const dir = createTempProject({
      "Cargo.toml": `[package]
name = "myapp"
version = "0.1.0"

[dependencies]
sqlx = { version = "0.7", features = ["postgres", "runtime-tokio"] }
redis = { version = "0.25", features = ["tokio-comp"] }
jsonwebtoken = "9.3"
argon2 = "0.5"
`,
    });
    try {
      const result = scanRustDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("sqlx"), "should detect sqlx");
      assert.ok(names.includes("redis"), "should detect redis");
      assert.ok(names.includes("jsonwebtoken"), "should detect jsonwebtoken");
      assert.ok(names.includes("argon2"), "should detect argon2");
      assert.strictEqual(result.length, 4);
    } finally {
      cleanup(dir);
    }
  });

  it("detects full web service Cargo.toml", () => {
    const dir = createTempProject({
      "Cargo.toml": `[package]
name = "web-service"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
reqwest = { version = "0.12", features = ["json"] }
sentry = "0.34"
stripe-rust = "0.30"
lettre = "0.11"
jsonwebtoken = "9"
argon2 = "0.5"
aws-sdk-s3 = "1.0"
diesel = { version = "2.1", features = ["postgres"] }
sea-orm = { version = "0.12", features = ["sqlx-postgres"] }

[dev-dependencies]
rusoto_s3 = "0.48"
`,
    });
    try {
      const result = scanRustDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("sentry"), "should detect sentry");
      assert.ok(names.includes("stripe"), "should detect stripe");
      assert.ok(names.includes("lettre"), "should detect lettre");
      assert.ok(names.includes("jsonwebtoken"), "should detect jsonwebtoken");
      assert.ok(names.includes("argon2"), "should detect argon2");
      assert.ok(names.includes("aws-sdk-s3"), "should detect aws-sdk-s3");
      assert.ok(names.includes("diesel"), "should detect diesel");
      assert.ok(names.includes("sea-orm"), "should detect sea-orm");
      assert.ok(names.includes("aws-s3-rusoto"), "should detect rusoto_s3 from dev-dependencies");
    } finally {
      cleanup(dir);
    }
  });

  it("includes correct evidence and ignores non-dependency sections", () => {
    const dir = createTempProject({
      "Cargo.toml": `[package]
name = "myapp"
version = "0.1.0"

[features]
default = ["full"]
sentry = []

[dependencies]
sentry = "0.34"

[profile.release]
opt-level = 3
`,
    });
    try {
      const result = scanRustDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "sentry");
      assert.strictEqual(result[0].evidence[0].type, "dependency");
      assert.strictEqual(result[0].evidence[0].file, "Cargo.toml");
      assert.ok(result[0].evidence[0].detail.includes("sentry"));
    } finally {
      cleanup(dir);
    }
  });
});
