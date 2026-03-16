import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanFrameworkImplicit } from "./framework-implicit.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-fwimplicit-"));
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

describe("scanFrameworkImplicit", () => {
  it("detects Rails implicit services from Gemfile", () => {
    const dir = createTempProject({
      Gemfile: `source "https://rubygems.org"\ngem "rails", "~> 7.1"\ngem "pg"\n`,
    });
    try {
      const result = scanFrameworkImplicit(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("ActiveRecord"), "should detect ActiveRecord");
      assert.ok(names.includes("ActionMailer"), "should detect ActionMailer");
      assert.ok(names.includes("ActionController::Cookies"), "should detect Cookies");
      assert.ok(names.includes("ActiveStorage"), "should detect ActiveStorage");
      assert.strictEqual(result.length, 4);

      const ar = result.find((r) => r.name === "ActiveRecord")!;
      assert.strictEqual(ar.category, "database");
      assert.ok(ar.evidence[0].detail.includes("rails"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Django implicit services from requirements.txt", () => {
    const dir = createTempProject({
      "requirements.txt": `Django==4.2\ncelery>=5.0\npsycopg2-binary\n`,
    });
    try {
      const result = scanFrameworkImplicit(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("Django ORM"), "should detect Django ORM");
      assert.ok(names.includes("django.core.mail"), "should detect django mail");
      assert.ok(names.includes("django.contrib.sessions"), "should detect sessions");
      assert.ok(names.includes("django.contrib.auth"), "should detect auth");
      assert.strictEqual(result.length, 4);

      const auth = result.find((r) => r.name === "django.contrib.auth")!;
      assert.strictEqual(auth.category, "auth");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Laravel implicit services from composer.json", () => {
    const dir = createTempProject({
      "composer.json": JSON.stringify({
        require: {
          "php": "^8.1",
          "laravel/framework": "^10.0",
        },
      }),
    });
    try {
      const result = scanFrameworkImplicit(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("Eloquent"), "should detect Eloquent");
      assert.ok(names.includes("Laravel Mail"), "should detect Laravel Mail");
      assert.ok(names.includes("Laravel Auth"), "should detect Laravel Auth");
      assert.ok(names.includes("Laravel Sessions"), "should detect Laravel Sessions");
      assert.strictEqual(result.length, 4);

      const eloquent = result.find((r) => r.name === "Eloquent")!;
      assert.strictEqual(eloquent.category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Express conditional services only when present", () => {
    const dir = createTempProject({
      "package.json": JSON.stringify({
        dependencies: {
          express: "^4.18.0",
          "express-session": "^1.17.0",
        },
      }),
    });
    try {
      const result = scanFrameworkImplicit(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("express-session"), "should detect express-session");
      assert.ok(!names.includes("cookie-parser"), "should NOT detect cookie-parser when absent");
      assert.strictEqual(result.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no framework is detected", () => {
    const dir = createTempProject({
      "package.json": JSON.stringify({
        dependencies: {
          react: "^18.0.0",
          "next": "^14.0.0",
        },
      }),
    });
    try {
      const result = scanFrameworkImplicit(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
