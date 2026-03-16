import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanLicenses, generateLicenseCompliance } from "./license-scanner.js";

function createTempProject(
  pkg: Record<string, unknown>,
  deps?: Record<string, { version: string; license: string }>
): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-license-test-"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));

  if (deps) {
    const nodeModules = path.join(dir, "node_modules");
    fs.mkdirSync(nodeModules, { recursive: true });
    for (const [name, info] of Object.entries(deps)) {
      const depDir = path.join(nodeModules, name);
      fs.mkdirSync(depDir, { recursive: true });
      fs.writeFileSync(
        path.join(depDir, "package.json"),
        JSON.stringify({ name, version: info.version, license: info.license })
      );
    }
  }

  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanLicenses", () => {
  it("detects project license from package.json", () => {
    const dir = createTempProject({ name: "test", license: "MIT" });
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.projectLicense, "MIT");
    } finally {
      cleanup(dir);
    }
  });

  it("warns when no license field exists", () => {
    const dir = createTempProject({ name: "test" });
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.projectLicense, null);
      assert.ok(result.warnings.some((w) => w.includes("No license field")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects copyleft licenses in dependencies", () => {
    const dir = createTempProject(
      { name: "test", license: "MIT", dependencies: { "gpl-pkg": "^1.0.0" } },
      { "gpl-pkg": { version: "1.0.0", license: "GPL-3.0" } }
    );
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.copyleftDependencies.length, 1);
      assert.strictEqual(result.copyleftDependencies[0].package, "gpl-pkg");
      assert.strictEqual(result.copyleftDependencies[0].isCopyleft, true);
    } finally {
      cleanup(dir);
    }
  });

  it("flags AGPL as copyleft", () => {
    const dir = createTempProject(
      { name: "test", license: "MIT", dependencies: { "agpl-pkg": "^2.0.0" } },
      { "agpl-pkg": { version: "2.0.0", license: "AGPL-3.0" } }
    );
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.copyleftDependencies.length, 1);
      assert.strictEqual(result.copyleftDependencies[0].license, "AGPL-3.0");
    } finally {
      cleanup(dir);
    }
  });

  it("does not flag permissive licenses as copyleft", () => {
    const dir = createTempProject(
      { name: "test", license: "MIT", dependencies: { "safe-pkg": "^1.0.0" } },
      { "safe-pkg": { version: "1.0.0", license: "Apache-2.0" } }
    );
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.copyleftDependencies.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("handles missing node_modules gracefully", () => {
    const dir = createTempProject({ name: "test", license: "MIT", dependencies: { "some-pkg": "^1.0.0" } });
    try {
      const result = scanLicenses(dir);
      assert.strictEqual(result.dependencies.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});

describe("generateLicenseCompliance", () => {
  it("generates markdown with copyleft alerts", () => {
    const scanResult = {
      projectLicense: "MIT",
      dependencies: [
        { package: "safe-lib", version: "1.0.0", license: "MIT", isCopyleft: false },
        { package: "gpl-lib", version: "2.0.0", license: "GPL-3.0", isCopyleft: true },
      ],
      copyleftDependencies: [
        { package: "gpl-lib", version: "2.0.0", license: "GPL-3.0", isCopyleft: true },
      ],
      warnings: [],
    };

    const md = generateLicenseCompliance(scanResult, "Acme Corp");
    assert.ok(md.includes("# License Compliance Report"));
    assert.ok(md.includes("Acme Corp"));
    assert.ok(md.includes("Copyleft License Alerts"));
    assert.ok(md.includes("gpl-lib"));
    assert.ok(md.includes("MIT"));
  });

  it("omits copyleft section when no copyleft deps", () => {
    const scanResult = {
      projectLicense: "MIT",
      dependencies: [
        { package: "safe-lib", version: "1.0.0", license: "MIT", isCopyleft: false },
      ],
      copyleftDependencies: [],
      warnings: [],
    };

    const md = generateLicenseCompliance(scanResult, "Acme Corp");
    assert.ok(!md.includes("Copyleft License Alerts"));
  });
});
