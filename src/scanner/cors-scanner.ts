import * as fs from "fs";
import * as path from "path";
import type { ComplianceNeed } from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CorsResult {
  detected: boolean;
  findings: CorsFinding[];
  hasWildcardOrigin: boolean;
}

export interface CorsFinding {
  type: CorsType;
  file: string;
  line: number;
  detail: string;
}

export type CorsType =
  | "cors-middleware"
  | "cors-header"
  | "wildcard-origin"
  | "credentials-with-wildcard";

// ── CORS Pattern Detection ────────────────────────────────────────────────

/**
 * Patterns that indicate CORS middleware usage (e.g., cors() from the cors package).
 */
const CORS_MIDDLEWARE_PATTERNS: RegExp[] = [
  /\bcors\s*\(/g,
  /\.use\s*\(\s*cors/g,
  /\.enableCors\s*\(/g,        // NestJS
  /CorsMiddleware/g,            // Custom middleware naming
  /CORS_ALLOW/g,                // Common env var naming
];

/**
 * Patterns that indicate Access-Control-Allow-Origin header being set.
 */
const CORS_HEADER_PATTERNS: RegExp[] = [
  /Access-Control-Allow-Origin/g,
  /access-control-allow-origin/g,
  /AccessControlAllowOrigin/g,
];

/**
 * Patterns that indicate wildcard (*) origin configuration.
 */
const WILDCARD_ORIGIN_PATTERNS: RegExp[] = [
  /['"`]\s*\*\s*['"`]\s*(?:,|\)|\})/g,                          // "*" as string value
  /origin\s*:\s*['"`]\s*\*\s*['"`]/g,                           // origin: "*"
  /origin\s*:\s*true/g,                                          // origin: true (reflects all)
  /Access-Control-Allow-Origin['"`,\s:]*\*/g,                   // Header set to *
  /setHeader\s*\(\s*['"`]Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/g,
  /header\s*\(\s*['"`]Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/g,
  /res\.set\s*\(\s*['"`]Access-Control-Allow-Origin['"`]\s*,\s*['"`]\*['"`]/g,
  /w\.Header\(\)\.Set\(\s*"Access-Control-Allow-Origin"\s*,\s*"\*"/g,  // Go
];

/**
 * Detect credentials: true combined with wildcard — a security misconfiguration.
 */
const CREDENTIALS_PATTERN = /credentials\s*:\s*true/g;

/**
 * Scan source files for CORS configuration patterns.
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanCors(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): CorsResult {
  const absPath = path.resolve(projectPath);

  const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".go", ".py", ".rb", ".rs", ".java", ".cs"]);
  const allFiles = preWalkedFiles
    ? preWalkedFiles.filter((f) => sourceExts.has(f.extension))
    : walkDirectory(absPath, { extensions: sourceExts });

  const findings: CorsFinding[] = [];
  let hasWildcardOrigin = false;

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");

    // Check for CORS middleware
    for (const pattern of CORS_MIDDLEWARE_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        const lineNum = content.substring(0, match.index).split("\n").length;
        const lineText = lines[lineNum - 1]?.trim() || "";

        // Skip comments
        if (lineText.startsWith("//") || lineText.startsWith("#") || lineText.startsWith("*")) continue;

        findings.push({
          type: "cors-middleware",
          file: file.relativePath,
          line: lineNum,
          detail: lineText.substring(0, 120),
        });
        break; // One match per pattern per file
      }
    }

    // Check for Access-Control-Allow-Origin headers
    for (const pattern of CORS_HEADER_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        const lineNum = content.substring(0, match.index).split("\n").length;
        const lineText = lines[lineNum - 1]?.trim() || "";

        if (lineText.startsWith("//") || lineText.startsWith("#") || lineText.startsWith("*")) continue;

        findings.push({
          type: "cors-header",
          file: file.relativePath,
          line: lineNum,
          detail: lineText.substring(0, 120),
        });
        break;
      }
    }

    // Check for wildcard origin
    for (const pattern of WILDCARD_ORIGIN_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        const lineNum = content.substring(0, match.index).split("\n").length;
        const lineText = lines[lineNum - 1]?.trim() || "";

        if (lineText.startsWith("//") || lineText.startsWith("#") || lineText.startsWith("*")) continue;

        hasWildcardOrigin = true;
        findings.push({
          type: "wildcard-origin",
          file: file.relativePath,
          line: lineNum,
          detail: lineText.substring(0, 120),
        });
        break;
      }
    }

    // Check for credentials: true (risky when combined with wildcard)
    if (hasWildcardOrigin) {
      CREDENTIALS_PATTERN.lastIndex = 0;
      const credMatch = CREDENTIALS_PATTERN.exec(content);
      if (credMatch) {
        const lineNum = content.substring(0, credMatch.index).split("\n").length;
        const lineText = lines[lineNum - 1]?.trim() || "";

        if (!lineText.startsWith("//") && !lineText.startsWith("#")) {
          findings.push({
            type: "credentials-with-wildcard",
            file: file.relativePath,
            line: lineNum,
            detail: "credentials: true combined with wildcard origin — browsers will reject this, but it indicates a misconfiguration",
          });
        }
      }
    }
  }

  // Deduplicate findings by file + type
  const seen = new Set<string>();
  const deduped: CorsFinding[] = [];
  for (const f of findings) {
    const key = `${f.file}:${f.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(f);
    }
  }

  return {
    detected: deduped.length > 0,
    findings: deduped,
    hasWildcardOrigin,
  };
}

/**
 * Derive compliance needs from CORS scan results.
 */
export function deriveCorsComplianceNeeds(result: CorsResult): ComplianceNeed[] {
  const needs: ComplianceNeed[] = [];

  if (result.hasWildcardOrigin) {
    needs.push({
      document: "Security Policy",
      reason:
        "Wildcard (*) CORS origin detected. This allows any website to make requests to your API, " +
        "which may expose user data to unauthorized origins. Restrict CORS to trusted domains.",
      priority: "required",
    });
  }

  return needs;
}
