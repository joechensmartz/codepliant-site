import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPhpDependencies } from "./php.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
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
  it("detects WordPress DB and auth from wp-config.php", () => {
    const dir = createTempProject({
      "wp-config.php": [
        "<?php",
        "define('DB_NAME', 'wordpress');",
        "define('DB_USER', 'root');",
        "define('DB_PASSWORD', 'secret');",
        "define('DB_HOST', 'localhost');",
        "define('AUTH_KEY', 'some-key');",
      ].join("\n"),
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "wordpress-database"));
      assert.ok(result.some(s => s.name === "wordpress-auth"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Laravel database and mail config in config/*.php", () => {
    const dir = createTempProject({
      "config/database.php": "<?php\nreturn [\n    'default' => 'mysql',\n    'connections' => [\n        'mysql' => [\n            'driver' => 'mysql',\n        ],\n    ],\n];",
      "config/mail.php": "<?php\nreturn [\n    'mailer' => 'smtp',\n    'transport' => 'smtp',\n];",
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "laravel-database"));
      assert.ok(result.some(s => s.name === "laravel-mail"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects WordPress plugins in wp-content/plugins", () => {
    const dir = createTempProject({
      "wp-content/plugins/woocommerce/woocommerce.php": "<?php // WooCommerce",
      "wp-content/plugins/contact-form-7/wp-contact-form-7.php": "<?php // CF7",
      "wp-content/plugins/akismet/akismet.php": "<?php // Akismet",
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "woocommerce"));
      assert.ok(result.some(s => s.name === "contact-form-7"));
      assert.ok(result.some(s => s.name === "akismet"));
    } finally {
      cleanup(dir);
    }
  });
});
