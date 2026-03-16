import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanAccessibility, deriveAccessibilityComplianceNeeds } from "./accessibility.js";
import type { WalkedFile } from "./file-walker.js";

function createTempProject(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-a11y-test-"));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

function makeWalkedFile(dir: string, relativePath: string, content: string): WalkedFile {
  const fullPath = path.join(dir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  return {
    fullPath,
    relativePath,
    extension: path.extname(relativePath),
  };
}

describe("scanAccessibility", () => {
  it("detects a11y tooling, linting, and ARIA usage in a well-configured project", () => {
    const dir = createTempProject();
    try {
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "accessible-app",
          dependencies: {
            "react": "^18.0.0",
            "@radix-ui/react-dialog": "^1.0.0",
            "@axe-core/react": "^4.0.0",
          },
          devDependencies: {
            "eslint-plugin-jsx-a11y": "^6.0.0",
          },
        }),
      );

      const files: WalkedFile[] = [
        makeWalkedFile(dir, "src/Button.tsx", `
          export function Button({ label }: { label: string }) {
            return <button aria-label={label} role="button">{label}</button>;
          }
        `),
        makeWalkedFile(dir, "src/App.tsx", `
          export default function App() {
            return (
              <html lang="en">
                <body>
                  <img src="/logo.png" alt="Company logo" />
                </body>
              </html>
            );
          }
        `),
      ];

      const result = scanAccessibility(dir, files);

      assert.strictEqual(result.hasA11yTooling, true, "Should detect a11y tooling (@radix-ui, @axe-core/react)");
      assert.strictEqual(result.hasA11yLinting, true, "Should detect a11y linting (eslint-plugin-jsx-a11y)");
      assert.strictEqual(result.usesAria, true, "Should detect ARIA usage");
      assert.ok(result.evidence.length >= 3, "Should have evidence for tooling, linting, and ARIA");

      // Check compliance needs say project is well-configured
      const needs = deriveAccessibilityComplianceNeeds(result);
      assert.strictEqual(needs.length, 1);
      assert.strictEqual(needs[0].document, "Accessibility (WCAG 2.1 / ADA)");
      assert.ok(needs[0].reason.includes("Continue to test"), "Should acknowledge good configuration");
    } finally {
      cleanup(dir);
    }
  });

  it("reports missing a11y tooling and linting for a project with no accessibility setup", () => {
    const dir = createTempProject();
    try {
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "basic-app",
          dependencies: { "react": "^18.0.0" },
        }),
      );

      const files: WalkedFile[] = [
        makeWalkedFile(dir, "src/Page.tsx", `
          export default function Page() {
            return <div><p>Hello world</p></div>;
          }
        `),
      ];

      const result = scanAccessibility(dir, files);

      assert.strictEqual(result.hasA11yTooling, false, "Should not detect a11y tooling");
      assert.strictEqual(result.hasA11yLinting, false, "Should not detect a11y linting");
      assert.strictEqual(result.usesAria, false, "Should not detect ARIA usage");

      const needs = deriveAccessibilityComplianceNeeds(result);
      assert.strictEqual(needs.length, 1);
      assert.strictEqual(needs[0].priority, "recommended");
      assert.ok(needs[0].reason.includes("axe-core"), "Should recommend adding a11y testing tools");
      assert.ok(needs[0].reason.includes("eslint-plugin-jsx-a11y"), "Should recommend adding a11y linting");
      assert.ok(needs[0].reason.includes("ARIA"), "Should recommend using ARIA attributes");
    } finally {
      cleanup(dir);
    }
  });

  it("detects ARIA and alt attributes in HTML files without package.json", () => {
    const dir = createTempProject();
    try {
      const files: WalkedFile[] = [
        makeWalkedFile(dir, "index.html", `
          <html lang="en">
            <body>
              <nav role="navigation" aria-label="Main">
                <a href="/">Home</a>
              </nav>
              <img src="/hero.jpg" alt="Hero image" />
            </body>
          </html>
        `),
      ];

      const result = scanAccessibility(dir, files);

      assert.strictEqual(result.hasA11yTooling, false, "No package.json means no tooling detected");
      assert.strictEqual(result.usesAria, true, "Should detect ARIA in HTML");
      assert.ok(
        result.evidence.some((e) => e.detail.includes("HTML lang attribute")),
        "Should detect lang attribute",
      );
      assert.ok(
        result.evidence.some((e) => e.detail.includes("Image alt attribute")),
        "Should detect alt attribute",
      );
    } finally {
      cleanup(dir);
    }
  });
});
