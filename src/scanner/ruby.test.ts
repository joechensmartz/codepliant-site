import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanRubyDependencies } from "./ruby.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-ruby-test-"));
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

describe("scanRubyDependencies", () => {
  it("returns empty for project without Gemfile", () => {
    const dir = createTempProject({});
    try {
      const result = scanRubyDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects stripe gem", () => {
    const dir = createTempProject({
      Gemfile: `source "https://rubygems.org"\ngem "stripe"\ngem "rails"\n`,
    });
    try {
      const result = scanRubyDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
      assert.strictEqual(result[0].category, "payment");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple services from a Rails app Gemfile", () => {
    const dir = createTempProject({
      Gemfile: `source "https://rubygems.org"

gem "rails", "~> 7.1"
gem "stripe"
gem "sentry-ruby"
gem "sentry-rails"
gem "devise"
gem "aws-sdk-s3"
gem "sidekiq"
gem "pg"
gem "redis"
`,
    });
    try {
      const result = scanRubyDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("stripe"), "should detect stripe");
      assert.ok(names.includes("sentry-ruby"), "should detect sentry-ruby");
      assert.ok(names.includes("devise"), "should detect devise");
      assert.ok(names.includes("aws-sdk-s3"), "should detect aws-sdk-s3");
      assert.ok(names.includes("sidekiq"), "should detect sidekiq");
      assert.ok(names.includes("pg"), "should detect pg");
      assert.ok(names.includes("redis"), "should detect redis");
      // sentry-rails should merge into sentry-ruby
      assert.ok(!names.includes("sentry-rails"), "sentry-rails should merge into sentry-ruby");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores comments in Gemfile", () => {
    const dir = createTempProject({
      Gemfile: `# gem "stripe"\ngem "devise"\n`,
    });
    try {
      const result = scanRubyDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "devise");
    } finally {
      cleanup(dir);
    }
  });

  it("handles single-quoted gem names", () => {
    const dir = createTempProject({
      Gemfile: `gem 'stripe'\ngem 'plaid'\n`,
    });
    try {
      const result = scanRubyDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("stripe"));
      assert.ok(names.includes("plaid"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects plaid and ruby-openai for finance app", () => {
    const dir = createTempProject({
      Gemfile: `gem "plaid"\ngem "ruby-openai"\ngem "intercom-rails"\n`,
    });
    try {
      const result = scanRubyDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("plaid"), "should detect plaid");
      assert.ok(names.includes("ruby-openai"), "should detect ruby-openai");
      assert.ok(names.includes("intercom-ruby"), "should detect intercom via intercom-rails");
    } finally {
      cleanup(dir);
    }
  });

  it("includes correct evidence", () => {
    const dir = createTempProject({
      Gemfile: `gem "stripe", "~> 10.0"\n`,
    });
    try {
      const result = scanRubyDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].evidence[0].type, "dependency");
      assert.strictEqual(result[0].evidence[0].file, "Gemfile");
      assert.ok(result[0].evidence[0].detail.includes("stripe"));
    } finally {
      cleanup(dir);
    }
  });
});
