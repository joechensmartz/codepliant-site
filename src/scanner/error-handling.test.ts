import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scan } from "./index.js";
import { scanEnvFiles } from "./env.js";
import { walkDirectory, ALL_EXTENSIONS } from "./file-walker.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-error-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ============================================================
// Empty package.json
// ============================================================

describe("edge case: empty package.json", () => {
  it("handles empty package.json gracefully", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "package.json"), "", "utf-8");

      const result = scan(dir);
      assert.ok(result.warnings);
      assert.ok(result.warnings!.some(w => w.includes("empty")));
      // Should still produce a valid result
      assert.ok(Array.isArray(result.services));
      assert.ok(Array.isArray(result.dataCategories));
    } finally {
      cleanup(dir);
    }
  });

  it("handles package.json with invalid JSON", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "package.json"), "{ broken json !!!", "utf-8");

      const result = scan(dir);
      assert.ok(result.warnings);
      assert.ok(result.warnings!.some(w => w.includes("invalid JSON")));
      assert.ok(Array.isArray(result.services));
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Binary .env file
// ============================================================

describe("edge case: binary .env file", () => {
  it("skips binary .env files without crashing", () => {
    const dir = createTempDir();
    try {
      // Write a binary file (contains null bytes)
      const binaryContent = Buffer.from([
        0x4f, 0x50, 0x45, 0x4e, 0x41, 0x49, 0x00, 0x00,
        0xff, 0xfe, 0x00, 0x01, 0x41, 0x50, 0x49,
      ]);
      fs.writeFileSync(path.join(dir, ".env"), binaryContent);

      const result = scanEnvFiles(dir);
      // Should return empty (skipped binary), not crash
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("still scans text .env files alongside binary ones", () => {
    const dir = createTempDir();
    try {
      // Binary .env
      const binaryContent = Buffer.from([0x00, 0x01, 0x02]);
      fs.writeFileSync(path.join(dir, ".env"), binaryContent);

      // Text .env.example
      fs.writeFileSync(
        path.join(dir, ".env.example"),
        "OPENAI_API_KEY=sk-xxx\n",
        "utf-8"
      );

      const result = scanEnvFiles(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Circular symlinks
// ============================================================

describe("edge case: circular symlinks", () => {
  it("handles circular directory symlinks without infinite loop", () => {
    const dir = createTempDir();
    try {
      const subdir = path.join(dir, "src");
      fs.mkdirSync(subdir);
      fs.writeFileSync(path.join(subdir, "test.ts"), "const x = 1;", "utf-8");

      // Create a circular symlink: src/loop -> src
      try {
        fs.symlinkSync(subdir, path.join(subdir, "loop"), "dir");
      } catch {
        // Symlinks may not be supported on all platforms; skip if so
        return;
      }

      // Should complete without hanging or crashing
      const files = walkDirectory(dir, { extensions: ALL_EXTENSIONS, skipTests: false });
      assert.ok(Array.isArray(files));
      // Should find the real file but not infinite copies
      const tsFiles = files.filter(f => f.relativePath.endsWith("test.ts"));
      assert.ok(tsFiles.length >= 1);
      // Should not have duplicated the file infinitely
      assert.ok(tsFiles.length < 10);
    } finally {
      cleanup(dir);
    }
  });

  it("handles broken symlinks without crashing", () => {
    const dir = createTempDir();
    try {
      // Create a symlink to a non-existent target
      try {
        fs.symlinkSync("/nonexistent/path/nowhere", path.join(dir, "broken-link"), "dir");
      } catch {
        return; // Symlinks not supported
      }

      const files = walkDirectory(dir, { extensions: ALL_EXTENSIONS, skipTests: false });
      assert.ok(Array.isArray(files));
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Scanner graceful degradation
// ============================================================

describe("scanner graceful degradation", () => {
  it("returns partial results when project has no package.json", () => {
    const dir = createTempDir();
    try {
      // No package.json at all — scanners should not crash
      const result = scan(dir);
      assert.ok(Array.isArray(result.services));
      assert.strictEqual(result.services.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("includes warnings array only when there are warnings", () => {
    const dir = createTempDir();
    try {
      // Clean project — no warnings expected
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({ name: "clean-project", dependencies: {} }),
        "utf-8"
      );

      const result = scan(dir);
      // No warnings for a clean project
      assert.ok(!result.warnings || result.warnings.length === 0);
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// Project path doesn't exist (scan-level)
// ============================================================

describe("edge case: nonexistent project path at scan level", () => {
  it("scan handles nonexistent path without crashing", () => {
    // The scan function itself should handle this gracefully
    const result = scan("/tmp/nonexistent-codepliant-path-" + Date.now());
    assert.ok(Array.isArray(result.services));
    assert.strictEqual(result.services.length, 0);
  });
});
