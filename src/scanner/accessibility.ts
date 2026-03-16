import * as fs from "fs";
import * as path from "path";
import type { ComplianceNeed, Evidence } from "./types.js";
import { type WalkedFile } from "./file-walker.js";

// ── Accessibility package detection ─────────────────────────────────

/** npm packages that provide accessibility tooling */
const A11Y_TOOLING_PACKAGES = new Set([
  "@axe-core/react",
  "axe-core",
  "react-aria",
  "@headlessui/react",
  "pa11y",
]);

/** Prefix patterns for scoped packages (e.g. @radix-ui/*) */
const A11Y_TOOLING_PREFIXES = ["@radix-ui/"];

/** npm packages that provide accessibility linting */
const A11Y_LINTING_PACKAGES = new Set([
  "eslint-plugin-jsx-a11y",
]);

// ── ARIA / a11y code patterns ───────────────────────────────────────

const ARIA_PATTERNS: RegExp[] = [
  /aria-label\s*[=:]/,
  /aria-describedby\s*[=:]/,
  /\brole\s*=\s*["']/,
];

const ALT_PATTERN = /\balt\s*=\s*["'{]/;
const LANG_PATTERN = /<html[^>]*\slang\s*=/i;

// ── Result type ─────────────────────────────────────────────────────

export interface AccessibilityResult {
  hasA11yTooling: boolean;
  usesAria: boolean;
  hasA11yLinting: boolean;
  evidence: Evidence[];
}

/** Maximum number of files to scan for a11y patterns (performance guard) */
const MAX_FILES_TO_SCAN = 200;

// ── Scanner ─────────────────────────────────────────────────────────

/**
 * Scans a project for accessibility compliance indicators.
 * Checks package dependencies for a11y tooling and linting,
 * and source files for ARIA attributes, alt text, and lang attributes.
 */
export function scanAccessibility(
  projectPath: string,
  allFiles: WalkedFile[],
): AccessibilityResult {
  const evidence: Evidence[] = [];
  let hasA11yTooling = false;
  let usesAria = false;
  let hasA11yLinting = false;

  // 1. Check package.json for a11y packages
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps: Record<string, string> = {
        ...(pkg.dependencies as Record<string, string> | undefined),
        ...(pkg.devDependencies as Record<string, string> | undefined),
      };

      for (const dep of Object.keys(allDeps)) {
        // Check tooling packages (exact match)
        if (A11Y_TOOLING_PACKAGES.has(dep)) {
          hasA11yTooling = true;
          evidence.push({
            type: "dependency",
            file: "package.json",
            detail: `Accessibility tooling: ${dep}@${allDeps[dep]}`,
          });
        }

        // Check prefix matches (e.g. @radix-ui/*)
        for (const prefix of A11Y_TOOLING_PREFIXES) {
          if (dep.startsWith(prefix)) {
            hasA11yTooling = true;
            evidence.push({
              type: "dependency",
              file: "package.json",
              detail: `Accessibility tooling: ${dep}@${allDeps[dep]}`,
            });
            break;
          }
        }

        // Check linting packages
        if (A11Y_LINTING_PACKAGES.has(dep)) {
          hasA11yLinting = true;
          evidence.push({
            type: "dependency",
            file: "package.json",
            detail: `Accessibility linting: ${dep}@${allDeps[dep]}`,
          });
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  // 2. Check source files for ARIA patterns, alt attributes, and lang attribute
  const jsxExtensions = new Set([".jsx", ".tsx", ".html", ".vue", ".svelte"]);
  const relevantFiles = allFiles.filter((f) => jsxExtensions.has(f.extension));

  let scanned = 0;
  for (const file of relevantFiles) {
    if (scanned >= MAX_FILES_TO_SCAN) break;

    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }
    scanned++;

    // Check ARIA patterns
    for (const pattern of ARIA_PATTERNS) {
      if (pattern.test(content)) {
        usesAria = true;
        evidence.push({
          type: "code_pattern",
          file: file.relativePath,
          detail: `ARIA attribute: ${pattern.source}`,
        });
        break; // one ARIA match per file is sufficient
      }
    }

    // Check alt attributes on images
    if (ALT_PATTERN.test(content)) {
      evidence.push({
        type: "code_pattern",
        file: file.relativePath,
        detail: "Image alt attribute detected",
      });
    }

    // Check lang attribute on html tag
    if (LANG_PATTERN.test(content)) {
      evidence.push({
        type: "code_pattern",
        file: file.relativePath,
        detail: "HTML lang attribute detected",
      });
    }
  }

  return {
    hasA11yTooling,
    usesAria,
    hasA11yLinting,
    evidence,
  };
}

// ── Compliance Need generation ───────────────────────────────────────

/**
 * Returns a ComplianceNeed for Accessibility (WCAG 2.1 / ADA) with
 * tailored recommendations based on what was detected.
 */
export function deriveAccessibilityComplianceNeeds(
  result: AccessibilityResult,
): ComplianceNeed[] {
  const recommendations: string[] = [];

  if (!result.hasA11yTooling) {
    recommendations.push(
      "Add accessibility testing tools (e.g. axe-core, pa11y, or @axe-core/react) to catch violations during development.",
    );
  }

  if (!result.usesAria) {
    recommendations.push(
      "Ensure interactive elements use ARIA attributes (aria-label, aria-describedby, role) for screen reader compatibility.",
    );
  }

  if (!result.hasA11yLinting) {
    recommendations.push(
      "Add eslint-plugin-jsx-a11y to enforce accessibility rules at lint time.",
    );
  }

  // Always include the compliance need — accessibility is recommended for all web projects
  const reason = result.hasA11yTooling && result.usesAria && result.hasA11yLinting
    ? "Your project has accessibility tooling, uses ARIA attributes, and has a11y linting configured. " +
      "Continue to test with assistive technologies and maintain WCAG 2.1 Level AA compliance."
    : "Web applications should conform to WCAG 2.1 Level AA to ensure accessibility for users with disabilities " +
      "and comply with ADA, Section 508, and EU Accessibility Act requirements. " +
      recommendations.join(" ");

  return [
    {
      document: "Accessibility (WCAG 2.1 / ADA)",
      reason,
      priority: "recommended",
    },
  ];
}
