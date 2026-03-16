import * as fs from "fs";
import * as path from "path";

export interface LicenseInfo {
  package: string;
  version: string;
  license: string;
  isCopyleft: boolean;
}

export interface LicenseScanResult {
  projectLicense: string | null;
  dependencies: LicenseInfo[];
  copyleftDependencies: LicenseInfo[];
  warnings: string[];
}

/**
 * Known copyleft license identifiers (SPDX).
 * These require derivative works to be distributed under the same license.
 */
const COPYLEFT_LICENSES = new Set([
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-1.0",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.0",
  "LGPL-2.0-only",
  "LGPL-2.0-or-later",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "MPL-2.0",
  "EUPL-1.1",
  "EUPL-1.2",
  "CPAL-1.0",
  "OSL-3.0",
  "SSPL-1.0",
]);

/**
 * Normalize a license string for copyleft matching.
 * Handles common variations like "GPLv3", "GNU GPL v2", etc.
 */
function normalizeLicense(license: string): string {
  let normalized = license.trim();

  // Handle common non-SPDX formats
  normalized = normalized.replace(/^GNU\s+/i, "");
  normalized = normalized.replace(/\s*v(\d)/i, "-$1.0");
  normalized = normalized.replace(/^GPLv(\d)/i, "GPL-$1.0");
  normalized = normalized.replace(/^AGPLv(\d)/i, "AGPL-$1.0");
  normalized = normalized.replace(/^LGPLv(\d)/i, "LGPL-$1.0");

  return normalized;
}

/**
 * Check if a license identifier is copyleft.
 */
function isCopyleft(license: string): boolean {
  const normalized = normalizeLicense(license);

  // Direct match
  if (COPYLEFT_LICENSES.has(normalized)) return true;

  // Case-insensitive substring check for common copyleft indicators
  const lower = normalized.toLowerCase();
  if (lower.includes("gpl") && !lower.includes("lgpl")) return true;
  if (lower.includes("agpl")) return true;
  if (lower.includes("sspl")) return true;

  return false;
}

/**
 * Read license info for installed npm packages from node_modules.
 */
function readInstalledLicenses(projectPath: string): LicenseInfo[] {
  const nodeModulesPath = path.join(projectPath, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) return [];

  const pkgJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgJsonPath)) return [];

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  } catch {
    return [];
  }

  const allDeps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  const results: LicenseInfo[] = [];

  for (const depName of Object.keys(allDeps)) {
    const depPkgPath = path.join(nodeModulesPath, depName, "package.json");
    if (!fs.existsSync(depPkgPath)) continue;

    try {
      const depPkg = JSON.parse(fs.readFileSync(depPkgPath, "utf-8"));
      const license = typeof depPkg.license === "string"
        ? depPkg.license
        : typeof depPkg.license === "object" && depPkg.license?.type
          ? depPkg.license.type
          : "UNKNOWN";

      results.push({
        package: depName,
        version: depPkg.version || allDeps[depName],
        license,
        isCopyleft: isCopyleft(license),
      });
    } catch {
      results.push({
        package: depName,
        version: allDeps[depName],
        license: "UNKNOWN",
        isCopyleft: false,
      });
    }
  }

  return results;
}

/**
 * Scan a project for open source license compliance.
 * Checks the project's own license field and all dependency licenses.
 */
export function scanLicenses(projectPath: string): LicenseScanResult {
  const absPath = path.resolve(projectPath);
  const warnings: string[] = [];

  // Check project's own license
  let projectLicense: string | null = null;
  const pkgPath = path.join(absPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      if (typeof pkg.license === "string") {
        projectLicense = pkg.license;
      } else if (pkg.license?.type) {
        projectLicense = pkg.license.type;
      } else {
        warnings.push("No license field found in package.json. Consider adding one.");
      }
    } catch {
      warnings.push("Could not parse package.json to read license field.");
    }
  }

  // Read dependency licenses
  const dependencies = readInstalledLicenses(absPath);
  const copyleftDependencies = dependencies.filter((d) => d.isCopyleft);

  if (copyleftDependencies.length > 0) {
    warnings.push(
      `Found ${copyleftDependencies.length} copyleft-licensed dependency(ies): ` +
      copyleftDependencies.map((d) => `${d.package} (${d.license})`).join(", ") +
      ". These may require you to distribute your source code under the same license."
    );
  }

  const unknownLicenses = dependencies.filter((d) => d.license === "UNKNOWN");
  if (unknownLicenses.length > 0) {
    warnings.push(
      `${unknownLicenses.length} dependency(ies) have unknown licenses: ` +
      unknownLicenses.map((d) => d.package).join(", ") +
      ". Review these manually."
    );
  }

  return {
    projectLicense,
    dependencies,
    copyleftDependencies,
    warnings,
  };
}

/**
 * Generate a LICENSE_COMPLIANCE.md document listing all dependency licenses.
 */
export function generateLicenseCompliance(
  scanResult: LicenseScanResult,
  companyName: string
): string {
  const date = new Date().toISOString().split("T")[0];
  const sections: string[] = [];

  sections.push("# License Compliance Report");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Organization:** ${companyName}`);
  sections.push("");

  sections.push("> **Disclaimer:** This report is auto-generated from dependency metadata. It should be reviewed by legal counsel for accuracy and completeness.");
  sections.push("");

  // Project license
  sections.push("## Project License");
  sections.push("");
  if (scanResult.projectLicense) {
    sections.push(`This project is licensed under **${scanResult.projectLicense}**.`);
  } else {
    sections.push("No project license detected. Consider adding a `license` field to your package.json.");
  }
  sections.push("");

  // Summary
  sections.push("## Summary");
  sections.push("");
  sections.push(`| Metric | Count |`);
  sections.push(`|--------|-------|`);
  sections.push(`| Total dependencies scanned | ${scanResult.dependencies.length} |`);
  sections.push(`| Copyleft licenses | ${scanResult.copyleftDependencies.length} |`);
  sections.push(`| Unknown licenses | ${scanResult.dependencies.filter((d) => d.license === "UNKNOWN").length} |`);
  sections.push("");

  // Copyleft alerts
  if (scanResult.copyleftDependencies.length > 0) {
    sections.push("## Copyleft License Alerts");
    sections.push("");
    sections.push("The following dependencies use copyleft licenses. Depending on how your software uses these packages, you may be required to release your source code under the same license.");
    sections.push("");
    sections.push("| Package | Version | License | Risk |");
    sections.push("|---------|---------|---------|------|");
    for (const dep of scanResult.copyleftDependencies) {
      const risk = dep.license.toLowerCase().includes("agpl") ? "High" : dep.license.toLowerCase().includes("gpl") ? "Medium" : "Low";
      sections.push(`| ${dep.package} | ${dep.version} | ${dep.license} | ${risk} |`);
    }
    sections.push("");
    sections.push("### Risk Levels");
    sections.push("");
    sections.push("- **High (AGPL):** Requires source code disclosure even for network-accessible services");
    sections.push("- **Medium (GPL):** Requires source code disclosure when distributing binaries");
    sections.push("- **Low (LGPL, MPL):** Allows dynamic linking without requiring full source disclosure");
    sections.push("");
  }

  // Full dependency list
  sections.push("## All Dependency Licenses");
  sections.push("");
  if (scanResult.dependencies.length === 0) {
    sections.push("No dependencies found (node_modules may not be installed).");
  } else {
    sections.push("| Package | Version | License | Copyleft |");
    sections.push("|---------|---------|---------|----------|");
    const sorted = [...scanResult.dependencies].sort((a, b) => a.package.localeCompare(b.package));
    for (const dep of sorted) {
      const copyleftFlag = dep.isCopyleft ? "Yes" : "No";
      sections.push(`| ${dep.package} | ${dep.version} | ${dep.license} | ${copyleftFlag} |`);
    }
  }
  sections.push("");

  // Warnings
  if (scanResult.warnings.length > 0) {
    sections.push("## Warnings");
    sections.push("");
    for (const warning of scanResult.warnings) {
      sections.push(`- ${warning}`);
    }
    sections.push("");
  }

  // Recommendations
  sections.push("## Recommendations");
  sections.push("");
  sections.push("1. **Review copyleft dependencies** — Ensure your use of copyleft-licensed packages is compatible with your distribution model.");
  sections.push("2. **Investigate unknown licenses** — Manually check packages with unknown licenses to assess compliance obligations.");
  sections.push("3. **Automate license checks** — Add license scanning to your CI pipeline to catch new copyleft introductions early.");
  sections.push("4. **Maintain a license allowlist** — Define approved licenses for your project and reject dependencies that do not conform.");
  sections.push("");

  return sections.join("\n");
}
