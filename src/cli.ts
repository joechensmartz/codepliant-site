#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import { scan } from "./scanner/index.js";
import { generateDocuments, writeDocuments } from "./generator/index.js";
import { loadConfig, saveConfig, configExists, validateConfig, VALID_JURISDICTIONS, type CodepliantConfig } from "./config.js";
import { writeDocumentsInFormat, getOutputFormat, getLastPdfResult, writeCompliancePage, writeComplianceReport, type OutputFormat } from "./output/index.js";
import { writeBadges } from "./output/badge.js";
import { diffDocuments, appendChangelog } from "./output/diff.js";
import { SERVICE_SIGNATURES } from "./scanner/types.js";
import { installHook, uninstallHook, getLefthookSnippet } from "./hook.js";
import { loadPlugins } from "./plugins/loader.js";
import type { CodepliantPlugin } from "./plugins/index.js";
import type { ScanResult, ScanTimings } from "./scanner/index.js";
import { generateEnvExample, writeEnvExample } from "./generator/env-example.js";
import { initTemplates, getTemplatesDir } from "./templates/engine.js";
import { startServer } from "./api/server.js";
import { sendNotification, buildPayload } from "./notifications/index.js";
import { discoverProjects, type DiscoveredProject } from "./scanner/discover.js";
import { listAllSignatures, exportSignatures, importSignatures } from "./community/signatures-repo.js";
import { writeGithubWiki } from "./output/github-wiki.js";
import { reviewDocuments, formatReviewResults, isReviewAvailable, type AIReviewConfig } from "./ai/review.js";
import { lintDocuments } from "./lint.js";

import { handleAuthLogin } from "./cloud/sso.js";
import { handleAuditTrail, logAuditEntry } from "./cloud/audit-trail.js";
import { handleTeamConfigInit } from "./cloud/team-config.js";
const VERSION = "50.0.0";

// --no-color support: disabled via flag, NO_COLOR env, or non-TTY stdout
let _noColor = false;

function initColor(args: string[]) {
  if (
    args.includes("--no-color") ||
    process.env.NO_COLOR !== undefined ||
    !process.stdout.isTTY
  ) {
    _noColor = true;
  }
}

function c(code: string): string {
  return _noColor ? "" : code;
}

// Color helpers — respect --no-color
const RESET = () => c("\x1b[0m");
const BOLD = () => c("\x1b[1m");
const GREEN = () => c("\x1b[32m");
const YELLOW = () => c("\x1b[33m");
const CYAN = () => c("\x1b[36m");
const DIM = () => c("\x1b[2m");
const RED = () => c("\x1b[31m");

function getEcosystemCount(): number {
  return Object.keys(SERVICE_SIGNATURES).length;
}

function printBanner() {
  const ecosystemCount = getEcosystemCount();
  console.log(`
${CYAN()}${BOLD()}  ╔═══════════════════════════════════════╗
  ║           CODEPLIANT v${VERSION}            ║
  ║   Compliance documents from your code  ║
  ║   ${ecosystemCount} services across 10+ ecosystems   ║
  ╚═══════════════════════════════════════╝${RESET()}
`);
}

function printUsage() {
  console.log(`${BOLD()}Usage:${RESET()}  codepliant <command> [options] [path]

${BOLD()}Scanning:${RESET()}
  ${CYAN()}scan${RESET()}            Scan project (no document generation)
  ${CYAN()}scan-all${RESET()}        Scan all projects under a directory
  ${CYAN()}check${RESET()}           Quick compliance pass/fail check
  ${CYAN()}lint${RESET()}            Check existing docs for completeness
  ${CYAN()}diff${RESET()}            Show changes since last generation
  ${CYAN()}dashboard${RESET()}       Show compliance status dashboard

${BOLD()}Generation:${RESET()}
  ${CYAN()}go${RESET()}              Scan + generate documents
  ${CYAN()}generate-all${RESET()}    Generate docs for all projects under a directory
  ${CYAN()}report${RESET()}          Generate comprehensive compliance report
  ${CYAN()}env${RESET()}             Generate .env.example from scan
  ${CYAN()}page${RESET()}            Generate compliance page
  ${CYAN()}badge${RESET()}           Generate compliance badges
  ${CYAN()}export${RESET()}          Export all compliance docs as a ZIP file
  ${CYAN()}compare${RESET()}         Compare compliance status of two projects

${BOLD()}Notifications:${RESET()}
  ${CYAN()}notify${RESET()}          Send compliance status notification

${BOLD()}Server:${RESET()}
  ${CYAN()}serve${RESET()}           Start HTTP API server

${BOLD()}Setup:${RESET()}
  ${CYAN()}init${RESET()}            Interactive setup wizard
  ${CYAN()}wizard${RESET()}          Step-by-step compliance wizard
  ${CYAN()}hook${RESET()}            Install/uninstall pre-commit hook
  ${CYAN()}template${RESET()}        Manage custom document templates

${BOLD()}Community:${RESET()}
  ${CYAN()}signatures${RESET()}      List, export, or import service signatures

${BOLD()}AI (optional):${RESET()}
  ${CYAN()}review${RESET()}          AI-powered review of generated documents
  ${CYAN()}explain${RESET()}         Explain why a document was generated

${BOLD()}Diagnostics:${RESET()}
  ${CYAN()}doctor${RESET()}          Diagnose common issues and suggest fixes

${BOLD()}Info:${RESET()}
  ${CYAN()}version${RESET()}         Print version and exit
  ${CYAN()}help${RESET()}            Show this help message

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--json${RESET()}                Output scan results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--watch, -w${RESET()}           Watch mode (auto re-scan on changes)
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output
  ${DIM()}--port <number>${RESET()}        Port for serve command (default: 3939)
  ${DIM()}--version, -V${RESET()}         Print version and exit

Run ${CYAN()}codepliant <command> --help${RESET()} for command-specific help.
`);
}

// --- Per-command help (lazy to respect --no-color) ---

function getCommandHelp(): Record<string, string> {
  return {
  go: `${BOLD()}codepliant go${RESET()} [path] [options]

Scan the project and generate compliance documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--watch, -w${RESET()}           Watch for changes and regenerate automatically
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant go${RESET()}                      Scan current directory
  ${CYAN()}codepliant go ./my-app${RESET()}              Scan a specific directory
  ${CYAN()}codepliant go -o ./docs${RESET()}             Output to ./docs
  ${CYAN()}codepliant go --format html${RESET()}         Generate HTML documents
  ${CYAN()}codepliant go --watch${RESET()}               Watch mode
`,

  report: `${BOLD()}codepliant report${RESET()} [path] [options]

Generate a comprehensive compliance report (COMPLIANCE_REPORT.md).
Combines executive summary, scan findings, data flow, regulatory matrix,
document inventory, recommendations, and action plan in a single document.
Designed for CTO/CISO review, investor due diligence, and audit trail.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant report${RESET()}                    Generate report for current directory
  ${CYAN()}codepliant report ./my-app${RESET()}            Report for a specific project
  ${CYAN()}codepliant report -o ./audit${RESET()}          Output to ./audit
`,

  scan: `${BOLD()}codepliant scan${RESET()} [path] [options]

Scan the project for third-party services and data collection patterns.
Does not generate any documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output results as JSON (useful for piping)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant scan${RESET()}                     Scan current directory
  ${CYAN()}codepliant scan ./my-app${RESET()}             Scan a specific directory
  ${CYAN()}codepliant scan --json${RESET()}               JSON output for CI/scripts
  ${CYAN()}codepliant scan --json | jq '.services'${RESET()}
`,

  check: `${BOLD()}codepliant check${RESET()} [path] [options]

Quick pass/fail check whether required compliance documents exist.
Exits with code 0 (pass) or 1 (fail). Designed for CI pipelines.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Directory to check for documents (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant check${RESET()}                    Check current project
  ${CYAN()}codepliant check --json${RESET()}              JSON output for CI
  ${CYAN()}codepliant check -o ./docs${RESET()}           Check a custom output dir
`,

  lint: `${BOLD()}codepliant lint${RESET()} [path] [options]

Check existing compliance documents for completeness.
Compares against what codepliant would generate, flags missing
sections, placeholder values, and outdated documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Directory to check for documents (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant lint${RESET()}                     Lint current project
  ${CYAN()}codepliant lint --json${RESET()}               JSON output for CI
  ${CYAN()}codepliant lint -o ./docs${RESET()}             Lint a custom output dir
`,

  diff: `${BOLD()}codepliant diff${RESET()} [path] [options]

Show what would change if you regenerated documents now.
Compares current documents on disk with freshly generated versions.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to compare (default: ./legal)
  ${DIM()}--json${RESET()}                Output diff as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant diff${RESET()}                     Show pending changes
  ${CYAN()}codepliant diff --json${RESET()}               JSON output for scripts
`,

  page: `${BOLD()}codepliant page${RESET()} [path] [options]

Generate a single-page HTML compliance page with tabs for each document.
Suitable for hosting on your website.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant page${RESET()}                     Generate compliance page
  ${CYAN()}codepliant page -o ./public${RESET()}          Output to public directory
`,

  badge: `${BOLD()}codepliant badge${RESET()} [path] [options]

Generate shields.io-style compliance badge SVGs.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant badge${RESET()}                    Generate badges
  ${CYAN()}codepliant badge -o ./public${RESET()}         Output to public directory
`,

  wizard: `${BOLD()}codepliant wizard${RESET()} [path] [options]

Interactive step-by-step compliance wizard. Scans your project,
lets you review detected services, select jurisdictions, enter
company info, review documents, and generate everything.

Confirmed/excluded services are saved to config for future runs.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant wizard${RESET()}                    Run the compliance wizard
  ${CYAN()}codepliant wizard ./my-app${RESET()}            Run for a specific project
`,

  init: `${BOLD()}codepliant init${RESET()}

Interactive setup wizard. Configures company info, compliance scope,
output preferences, and runs an initial scan + generate.

Creates a ${CYAN()}.codepliant.json${RESET()} config file in the project root.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant init${RESET()}                     Run setup wizard
`,

  hook: `${BOLD()}codepliant hook${RESET()} <install|uninstall>

Install or remove a pre-commit hook that runs compliance checks
before each commit. Supports husky, lefthook, and raw git hooks.

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}install${RESET()}       Install the pre-commit hook
  ${CYAN()}uninstall${RESET()}     Remove the pre-commit hook

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant hook install${RESET()}              Install hook
  ${CYAN()}codepliant hook uninstall${RESET()}            Remove hook
`,

  env: `${BOLD()}codepliant env${RESET()} [path] [options]

Generate a .env.example file from detected services.
Lists expected environment variables with placeholder values, grouped by category.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: project root)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant env${RESET()}                      Generate .env.example for current project
  ${CYAN()}codepliant env ./my-app${RESET()}              Generate for a specific directory
  ${CYAN()}codepliant env -o ./config${RESET()}           Output to a custom directory
`,

  dashboard: `${BOLD()}codepliant dashboard${RESET()} [path] [options]

Show a compact, colored terminal dashboard with compliance status overview.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to check (default: ./legal)
  ${DIM()}--json${RESET()}                Output dashboard data as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant dashboard${RESET()}                 Show dashboard for current project
  ${CYAN()}codepliant dashboard ./my-app${RESET()}         Dashboard for a specific project
  ${CYAN()}codepliant dashboard --json${RESET()}           JSON output for scripts
`,

  "scan-all": `${BOLD()}codepliant scan-all${RESET()} [dir] [options]

Discover and scan all projects under a directory.
Finds subdirectories containing package.json, requirements.txt, go.mod,
Cargo.toml, and other manifest files, scans each one, and shows aggregate results.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant scan-all ./org${RESET()}              Scan all projects under ./org
  ${CYAN()}codepliant scan-all --json${RESET()}             JSON output for CI
`,

  "generate-all": `${BOLD()}codepliant generate-all${RESET()} [dir] [options]

Discover all projects under a directory and generate compliance documents for each.
Creates a separate output directory per project (e.g. ./legal/<project-name>/).

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Root output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant generate-all ./org${RESET()}          Generate docs for all projects under ./org
  ${CYAN()}codepliant generate-all -o ./compliance${RESET()}  Custom output directory
`,

  signatures: `${BOLD()}codepliant signatures${RESET()} <list|export|import> [options]

Manage service signatures (built-in + community).

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}list${RESET()}        Show all built-in and community signatures
  ${CYAN()}export${RESET()}      Export custom signatures to JSON for sharing
  ${CYAN()}import${RESET()}      Import community signatures from a JSON file

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant signatures list${RESET()}                   List all signatures
  ${CYAN()}codepliant signatures export sigs.json${RESET()}       Export custom signatures
  ${CYAN()}codepliant signatures import community.json${RESET()}  Import shared signatures
`,

  export: `${BOLD()}codepliant export${RESET()} [path] [options]

Export compliance documents in a specific format.

${BOLD()}Options:${RESET()}
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant export --format wiki${RESET()}              Export as GitHub Wiki pages
  ${CYAN()}codepliant export --format confluence${RESET()}        Export for Confluence
`,

  doctor: `${BOLD()}codepliant doctor${RESET()} [path]

Diagnose common issues with your Codepliant setup.
Checks for missing config, outdated docs, build errors, and more.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant doctor${RESET()}                     Run diagnostics on current project
  ${CYAN()}codepliant doctor ./my-app${RESET()}             Run diagnostics for a specific project
`,

  review: `${BOLD()}codepliant review${RESET()} [path] [options]

AI-powered review of generated compliance documents.
Uses Claude or OpenAI to check for legal accuracy, missing clauses, and unclear language.
Returns suggestions only — never auto-edits your documents.

Requires ${CYAN()}aiReviewApiKey${RESET()} in .codepliantrc.json.
Optionally set ${CYAN()}aiReviewModel${RESET()} (default: claude-sonnet-4-20250514).

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to review (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output review results as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant review${RESET()}                    Review docs for current project
  ${CYAN()}codepliant review ./my-app${RESET()}            Review docs for a specific project
  ${CYAN()}codepliant review --json${RESET()}              JSON output for CI
`,

  explain: `${BOLD()}codepliant explain${RESET()} <document> [path]

Explain why a specific document was generated.
Lists the evidence (services, code patterns, config settings) that triggered the document.

${BOLD()}Arguments:${RESET()}
  ${CYAN()}<document>${RESET()}   Document name or filename (e.g. "Privacy Policy", "PRIVACY_POLICY.md")

${BOLD()}Options:${RESET()}
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output explanation as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant explain "Privacy Policy"${RESET()}
  ${CYAN()}codepliant explain RISK_REGISTER.md${RESET()}
  ${CYAN()}codepliant explain "AI Disclosure" ./my-app${RESET()}
  ${CYAN()}codepliant explain --json "Cookie Policy"${RESET()}
`,
  compare: `\${BOLD()}codepliant compare\${RESET()} <path1> <path2> [options]

Compare compliance status of two projects side by side.

\${BOLD()}Options:\${RESET()}
  \${DIM()}--json\${RESET()}                Output comparison as JSON
  \${DIM()}--quiet, -q\${RESET()}           Minimal output
  \${DIM()}--no-color\${RESET()}            Disable colored output

\${BOLD()}Examples:\${RESET()}
  \${CYAN()}codepliant compare ./app1 ./app2\${RESET()}      Compare two projects
  \${CYAN()}codepliant compare ./app1 ./app2 --json\${RESET()}  JSON output
`,
  };
}

function formatCategory(cat: string): string {
  const icons: Record<string, string> = {
    ai: "🤖",
    payment: "💳",
    analytics: "📊",
    auth: "🔐",
    email: "📧",
    database: "🗄️",
    storage: "📁",
    monitoring: "🔍",
    advertising: "📢",
    social: "👥",
    other: "📦",
  };
  const labels: Record<string, string> = {
    ai: "AI Service",
    payment: "Payment",
    analytics: "Analytics",
    auth: "Authentication",
    email: "Email",
    database: "Database",
    storage: "Storage",
    monitoring: "Monitoring",
    advertising: "Advertising",
    social: "Social",
    other: "Other",
  };
  return `${icons[cat] || "📦"} ${labels[cat] || cat}`;
}

// Graceful Ctrl+C handling for all modes
process.on("SIGINT", () => {
  console.log(`\n${DIM()}Interrupted.${RESET()}`);
  process.exit(130);
});

// --- Progress indicator helpers ---

function printStep(label: string) {
  process.stdout.write(`  ${DIM()}${label}...${RESET()}`);
}

function printStepDone() {
  process.stdout.write(` ${GREEN()}✓${RESET()}\n`);
}

// --- Formatting helpers ---

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function countLines(content: string): number {
  return content.split("\n").length;
}

// --- Actionable error messages ---

function formatError(err: unknown): string {
  if (!(err instanceof Error)) return String(err);

  const e = err as NodeJS.ErrnoException;

  if (e.code === "EACCES" || e.code === "EPERM") {
    const target = e.path ? `"${e.path}"` : "the target path";
    return `Permission denied accessing ${target}.\n  Try: sudo chmod -R u+rw ${e.path || "<path>"}`;
  }

  if (e.code === "ENOSPC") {
    return "Not enough disk space to write documents.\n  Free up space and try again.";
  }

  if (e.code === "EROFS") {
    return "File system is read-only. Cannot write documents.";
  }

  if (e.code === "EMFILE" || e.code === "ENFILE") {
    return "Too many open files. Try increasing the file descriptor limit:\n  ulimit -n 4096";
  }

  if (e.code === "ELOOP") {
    const target = e.path ? ` at "${e.path}"` : "";
    return `Circular symlink detected${target}. Resolve the symlink loop and try again.`;
  }

  return e.message;
}

// --- Compliance score ---

function computeComplianceScore(result: ScanResult, outputDir: string): number {
  if (result.complianceNeeds.length === 0) return 100;

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  function docExists(docName: string): boolean {
    const filenames = docFileMap[docName] || [];
    return filenames.some(f => fs.existsSync(path.join(outputDir, f)));
  }

  let score = 0;
  let total = 0;

  for (const need of result.complianceNeeds) {
    if (!docFileMap[need.document]) continue;
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;
    if (docExists(need.document)) score += weight;
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

function formatComplianceScore(score: number): string {
  let color = RED();
  if (score > 80) color = GREEN();
  else if (score > 60) color = YELLOW();
  return `${color}${BOLD()}${score}%${RESET()}`;
}

// --- Scan with progress indicators ---

function scanWithProgress(absProjectPath: string, quiet: boolean, verbose: boolean = false, plugins?: CodepliantPlugin[]): { result: ScanResult; durationMs: number; timings?: ScanTimings } {
  const startTime = Date.now();

  if (!quiet) {
    printStep("Scanning package.json");
  }

  const result = scan(absProjectPath, { verbose, plugins });

  if (!quiet) {
    printStepDone();
    printStep("Scanning source imports");
    printStepDone();
    printStep("Scanning .env files");
    printStepDone();

    if (result.monorepo) {
      console.log(`\n  ${CYAN()}${BOLD()}Detected monorepo with ${result.monorepo.workspaces.length} package(s)${RESET()} ${DIM()}(${result.monorepo.type})${RESET()}`);
      for (const ws of result.monorepo.workspaces) {
        console.log(`    ${DIM()}• ${ws.relativePath} (${ws.name})${RESET()}`);
      }
    }

    // Report scanner warnings
    if (result.warnings && result.warnings.length > 0) {
      console.log();
      for (const warning of result.warnings) {
        console.log(`  ${YELLOW()}Warning: ${warning}${RESET()}`);
      }
    }
  }

  const durationMs = Date.now() - startTime;
  const timings = (result as ScanResult & { timings?: ScanTimings }).timings;
  return { result, durationMs, timings };
}

function printTimings(timings: ScanTimings, totalMs: number): void {
  console.log(`\n  ${BOLD()}Scanner timing breakdown:${RESET()}\n`);
  for (const [name, ms] of Object.entries(timings)) {
    const bar = ms > 0 ? "█".repeat(Math.max(1, Math.round(ms / 2))) : "";
    console.log(`    ${DIM()}${name.padEnd(14)}${RESET()} ${String(ms).padStart(4)}ms ${DIM()}${bar}${RESET()}`);
  }
  console.log(`    ${"─".repeat(24)}`);
  console.log(`    ${BOLD()}${"Total".padEnd(14)}${RESET()} ${BOLD()}${String(totalMs).padStart(4)}ms${RESET()}`);
}

function printVersion() {
  console.log(`codepliant v${VERSION}`);
}

function main() {
  const args = process.argv.slice(2);

  // Initialize color support before anything prints
  initColor(args);

  const command = args[0];

  // --version / -V anywhere in args
  if (args.includes("--version") || args.includes("-V")) {
    printVersion();
    process.exit(0);
  }

  // `codepliant version` command
  if (command === "version") {
    printVersion();
    process.exit(0);
  }

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printBanner();
    printUsage();
    process.exit(0);
  }

  // Per-command --help: `codepliant <command> --help` or `codepliant <command> -h`
  if (args.includes("--help") || args.includes("-h")) {
    const COMMAND_HELP = getCommandHelp();
    const helpText = COMMAND_HELP[command];
    if (helpText) {
      console.log(`\n${helpText}`);
      process.exit(0);
    }
  }

  // Parse options
  let projectPath = ".";
  let outputDir = "./legal";
  let jsonOutput = false;
  let quiet = false;
  let watchMode = false;
  let formatFlag: OutputFormat | undefined;
  let verbose = false;
  let port = 3939;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--output" || arg === "-o") {
      outputDir = args[++i] || "./legal";
    } else if (arg === "--json") {
      jsonOutput = true;
    } else if (arg === "--quiet" || arg === "-q") {
      quiet = true;
    } else if (arg === "--verbose" || arg === "-v") {
      verbose = true;
    } else if (arg === "--watch" || arg === "-w") {
      watchMode = true;
    } else if (arg === "--no-color") {
      // already handled by initColor
    } else if (arg === "--format") {
      const fmt = args[++i];
      if (fmt === "markdown" || fmt === "html" || fmt === "pdf" || fmt === "json" || fmt === "notion" || fmt === "confluence" || fmt === "wiki" || fmt === "docx" || fmt === "all") {
        formatFlag = fmt;
      } else {
        console.error(`${RED()}Error: Invalid format "${fmt}". Use: markdown, html, pdf, json, notion, confluence, wiki, docx, all${RESET()}`);
        process.exit(1);
      }
    } else if (arg === "--port") {
      const p = parseInt(args[++i], 10);
      if (!isNaN(p) && p > 0 && p < 65536) {
        port = p;
      } else {
        console.error(`${RED()}Error: Invalid port number. Use a value between 1 and 65535.${RESET()}`);
        process.exit(1);
      }
    } else if (!arg.startsWith("-") && !(command === "hook" && (arg === "install" || arg === "uninstall")) && !(command === "template" && arg === "init") && !(command === "team-config" && arg === "init") && !(command === "auth" && arg === "login")) {
      projectPath = arg;
    }
  }

  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);

  // Validate project path with actionable error messages
  if (command !== "help" && command !== "init" && command !== "wizard" && command !== "serve" && command !== "auth" && command !== "audit-trail") {
    if (!fs.existsSync(absProjectPath)) {
      console.error(`${RED()}Error: "${absProjectPath}" does not exist.${RESET()}`);
      console.error(`${DIM()}Check the path and try again.${RESET()}`);
      process.exit(1);
    }

    let stat: fs.Stats;
    try {
      stat = fs.statSync(absProjectPath);
    } catch (err) {
      console.error(`${RED()}Error: ${formatError(err)}${RESET()}`);
      process.exit(1);
    }

    if (!stat.isDirectory()) {
      console.error(`${RED()}Error: "${absProjectPath}" is not a directory.${RESET()}`);
      console.error(`${DIM()}Codepliant scans project directories, not individual files.${RESET()}`);
      process.exit(1);
    }
  }

  try {
    if (command === "scan") {
      if (!quiet && !jsonOutput) printBanner();

      const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose);

      if (!quiet && !jsonOutput) {
        console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
      }

      if (verbose && timings && !quiet && !jsonOutput) {
        printTimings(timings, durationMs);
      }

      if (jsonOutput) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
      }

      printScanResults(result, quiet);
      process.exit(0);
    }

    if (command === "scan-all") {
      console.log("Multi-project scan coming soon. Use: codepliant scan <path>"); process.exit(0);
      return;
    }

    if (command === "generate-all") {
      const config = loadConfig(absProjectPath);
      const outputFormat = formatFlag || getOutputFormat(config);
      console.log("Multi-project generate coming soon. Use: codepliant go <path>"); process.exit(0);
      return;
    }

    if (command === "go") {
      if (!quiet && !jsonOutput) printBanner();

      const config = loadConfig(absProjectPath);
      const outputFormat = formatFlag || getOutputFormat(config);

      const result = runScanAndGenerate(absProjectPath, absOutputDir, quiet, jsonOutput, outputFormat, verbose);

      if (watchMode) {
        startWatchMode(absProjectPath, absOutputDir, quiet, result, outputFormat);
        return;
      }

      process.exit(0);
    }

    if (command === "report") {
      runReport(absProjectPath, absOutputDir, quiet, verbose);
      return;
    }

    if (command === "check") {
      runCheck(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "lint") {
      runLint(absProjectPath, outputDir, quiet, jsonOutput);
      return;
    }

    if (command === "diff") {
      runDiff(absProjectPath, absOutputDir, quiet, jsonOutput, formatFlag);
      return;
    }

    if (command === "hook") {
      runHook(absProjectPath, args);
      return;
    }

    if (command === "page") {
      runPage(absProjectPath, absOutputDir, quiet);
      return;
    }

    if (command === "badge") {
      runBadge(absProjectPath, absOutputDir, quiet);
      return;
    }

    if (command === "env") {
      runEnv(absProjectPath, absOutputDir, quiet, verbose);
      return;
    }

    if (command === "dashboard") {
      runDashboard(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "notify") {
      runNotify(absProjectPath, absOutputDir, quiet, jsonOutput, verbose);
      return;
    }

    if (command === "init") {
      printBanner();
      runInit(absProjectPath).then(() => process.exit(0)).catch((err) => {
        console.error(`${RED()}Error during init: ${formatError(err)}${RESET()}`);
        process.exit(1);
      });
      return;
    }

    if (command === "wizard") {
      printBanner();
      console.log("Interactive wizard coming soon. Use: codepliant init"); process.exit(0);
    }

    if (command === "serve") {
      if (!quiet) printBanner();
      console.log(`${BOLD()}Starting Codepliant API server on port ${port}...${RESET()}\n`);
      startServer({ port }).then(() => {
        console.log(`${GREEN()}${BOLD()}Server listening${RESET()} on ${CYAN()}http://localhost:${port}${RESET()}\n`);
        console.log(`${DIM()}Endpoints:${RESET()}`);
        console.log(`  ${CYAN()}GET  /api/health${RESET()}          Health check`);
        console.log(`  ${CYAN()}GET  /api/scan?path=${RESET()}      Scan a project`);
        console.log(`  ${CYAN()}GET  /api/status?path=${RESET()}    Compliance status`);
        console.log(`  ${CYAN()}POST /api/generate${RESET()}        Generate documents\n`);
        console.log(`${DIM()}Press Ctrl+C to stop.${RESET()}\n`);
      }).catch((err) => {
        console.error(`${RED()}Failed to start server: ${formatError(err)}${RESET()}`);
        process.exit(1);
      });
      return;
    }

    if (command === "template") {
      // TODO: implement runTemplate
      console.error(`${RED()}The "template" command is not yet implemented.${RESET()}`);
      process.exit(1);
    }

    if (command === "signatures") {
      runSignatures(absProjectPath, args);
      return;
    }

    if (command === "export") {
      runExport(absProjectPath, absOutputDir, quiet, formatFlag, verbose);
      return;
    }

    if (command === "doctor") {
      runDoctor(absProjectPath, absOutputDir, quiet);
      return;
    }


    if (command === "auth") {
      const subCmd = args[1];
      if (subCmd === "login") {
        handleAuthLogin();
        process.exit(0);
      }
      console.error(`${RED()}Unknown auth subcommand: "${subCmd || ""}". Use: codepliant auth login${RESET()}`);
      process.exit(1);
    }

    if (command === "audit-trail") {
      handleAuditTrail(jsonOutput);
      process.exit(0);
    }

    if (command === "team-config") {
      const subCmd = args[1];
      if (subCmd === "init") {
        handleTeamConfigInit(absProjectPath);
        process.exit(0);
      }
      console.error(`${RED()}Unknown team-config subcommand: "${subCmd || ""}". Use: codepliant team-config init${RESET()}`);
      process.exit(1);
    }

    if (command === "review") {
      console.log("AI review coming soon. Use: codepliant review");
      process.exit(0);
    }

    if (command === "explain") {
      console.log("Explain coming soon."); process.exit(0);
      return;
    }

    if (command === "compare") {
      // Parse two paths from args
      const comparePaths: string[] = [];
      for (let i = 1; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith("-")) {
          if (a === "--output" || a === "-o" || a === "--format" || a === "--port") i++;
          continue;
        }
        comparePaths.push(a);
      }
      if (comparePaths.length < 2) {
        console.error(`${RED()}Error: compare requires two project paths.${RESET()}`);
        console.error(`${DIM()}Usage: codepliant compare <path1> <path2>${RESET()}`);
        process.exit(1);
      }
      runCompare(path.resolve(comparePaths[0]), path.resolve(comparePaths[1]), quiet, jsonOutput);
      return;
    }

    console.error(`${RED()}Unknown command: "${command}"${RESET()}`);
    console.error(`${DIM()}Run ${CYAN()}codepliant help${RESET()}${DIM()} to see available commands.${RESET()}`);
    process.exit(1);
  } catch (err) {
    console.error(`\n${RED()}${BOLD()}Error:${RESET()} ${formatError(err)}`);
    process.exit(1);
  }
}

function printScanResults(
  result: ReturnType<typeof scan>,
  quiet: boolean
) {
  if (result.services.length === 0) {
    console.log(
      `${YELLOW()}No services detected.${RESET()} This project may not collect user data.\n`
    );
    console.log(
      `${DIM()}No package.json found? Make sure you're in the right directory.${RESET()}\n`
    );
    return;
  }

  if (!quiet) {
    console.log(
      `${BOLD()}Detected ${result.services.length} service(s):${RESET()}\n`
    );
  }

  for (const service of result.services) {
    console.log(
      `  ${GREEN()}✓${RESET()} ${BOLD()}${service.name}${RESET()} ${DIM()}(${formatCategory(service.category)})${RESET()}`
    );
    console.log(
      `    ${DIM()}Data: ${service.dataCollected.join(", ")}${RESET()}`
    );
    for (const ev of service.evidence) {
      console.log(`    ${DIM()}Found: [${ev.type}] ${ev.file} → ${ev.detail}${RESET()}`);
    }
    console.log();
  }

  if (!quiet && result.dataCategories.length > 0) {
    console.log(`${BOLD()}Data categories:${RESET()}\n`);
    for (const cat of result.dataCategories) {
      console.log(`  ${CYAN()}•${RESET()} ${cat.category}`);
      console.log(`    ${DIM()}${cat.description}${RESET()}\n`);
    }
  }
}

function printConfigWarnings(config: CodepliantConfig): void {
  const warnings = validateConfig(config);
  for (const w of warnings) {
    console.log(`  ${YELLOW()}Warning:${RESET()} ${w.message}`);
  }
}

function runScanAndGenerate(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  outputFormat: OutputFormat = "markdown",
  verbose: boolean = false,
): ScanResult {
  // Load config and plugins
  const config = loadConfig(absProjectPath);

  if (!quiet && !jsonOutput) {
    printConfigWarnings(config);
  }

  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  if (plugins.length > 0 && !quiet && !jsonOutput) {
    console.log(`  ${DIM()}Loaded ${plugins.length} plugin(s): ${plugins.map(p => p.name).join(", ")}${RESET()}`);
  }

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet && !jsonOutput) {
    printTimings(timings, durationMs);
  }

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printScanResults(result, quiet);
  }

  // Generate documents
  if (!quiet) console.log(`\n${BOLD()}Generating documents...${RESET()}\n`);

  const docs = generateDocuments(result, config, plugins);

  // Track changes before writing
  const diff = diffDocuments(docs, absOutputDir);

  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, config, result);

  // Write changelog if anything changed
  const changelogPath = appendChangelog(absOutputDir, diff);
  if (changelogPath) {
    writtenFiles.push(changelogPath);
  }

  for (const file of writtenFiles) {
    const relativePath = path.relative(absProjectPath, file);
    const content = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(content, "utf-8");
    const lines = countLines(content);
    const docName = docs.find(d => file.endsWith(d.filename))?.name || path.basename(file);
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${docName}: ${formatFileSize(size)}, ${lines} lines)${RESET()}`);
  }

  console.log(
    `\n${GREEN()}${BOLD()}Done!${RESET()} ${writtenFiles.length} document(s) generated in ${path.relative(absProjectPath, absOutputDir)}/\n`
  );

  // PDF result info
  const pdfResult = getLastPdfResult();
  if (pdfResult && !pdfResult.isNativePdf) {
    console.log(`${YELLOW()}${BOLD()}PDF note:${RESET()} ${pdfResult.message}\n`);
  }

  // Compliance summary
  if (result.complianceNeeds.length > 0 && !quiet) {
    console.log(`${BOLD()}Compliance summary:${RESET()}\n`);
    for (const need of result.complianceNeeds) {
      const icon = need.priority === "required" ? `${RED()}●${RESET()}` : `${YELLOW()}○${RESET()}`;
      const label =
        need.priority === "required"
          ? `${RED()}REQUIRED${RESET()}`
          : `${YELLOW()}RECOMMENDED${RESET()}`;
      console.log(`  ${icon} ${need.document} [${label}]`);
      console.log(`    ${DIM()}${need.reason}${RESET()}\n`);
    }
  }

  // Compliance score
  if (!quiet && !jsonOutput) {
    const score = computeComplianceScore(result, absOutputDir);
    console.log(`${BOLD()}Compliance score:${RESET()} ${formatComplianceScore(score)}\n`);
  }

  console.log(
    `${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}\n`
  );

  return result;
}

const WATCH_IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "__pycache__",
  "venv",
]);

function startWatchMode(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  previousResult: ScanResult,
  outputFormat: OutputFormat = "markdown"
): void {
  console.log(
    `${CYAN()}${BOLD()}Watching for changes...${RESET()} ${DIM()}(Ctrl+C to stop)${RESET()}\n`
  );

  let lastResult = previousResult;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const watchers: fs.FSWatcher[] = [];

  function handleChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      try {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`\n${DIM()}[${timestamp}] Change detected, re-scanning...${RESET()}`);

        const newResult = scan(absProjectPath);

        // Compare services
        const oldNames = new Set(lastResult.services.map((s) => s.name));
        const newNames = new Set(newResult.services.map((s) => s.name));

        let changed = false;
        for (const s of newResult.services) {
          if (!oldNames.has(s.name)) {
            console.log(
              `  ${GREEN()}+ Detected new service: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }
        for (const s of lastResult.services) {
          if (!newNames.has(s.name)) {
            console.log(
              `  ${RED()}- Service removed: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }

        if (changed) {
          const config = loadConfig(absProjectPath);
          const docs = generateDocuments(newResult, config);
          const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, config, newResult);
          console.log(
            `  ${GREEN()}${BOLD()}Regenerated ${writtenFiles.length} document(s)${RESET()}`
          );
        } else {
          console.log(`  ${DIM()}No service changes detected.${RESET()}`);
        }

        lastResult = newResult;
      } catch (err) {
        console.error(`  ${RED()}Error during re-scan: ${formatError(err)}${RESET()}`);
      }
    }, 500);
  }

  function watchDir(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (WATCH_IGNORE_DIRS.has(entry.name)) continue;
        const subdir = path.join(dir, entry.name);
        if (subdir === absOutputDir) continue;
        watchDir(subdir);
      }
    }

    try {
      const watcher = fs.watch(dir, { persistent: true }, (_event, filename) => {
        if (filename && WATCH_IGNORE_DIRS.has(filename)) return;
        handleChange();
      });
      watchers.push(watcher);
    } catch {
      // directory may not be watchable
    }
  }

  watchDir(absProjectPath);

  process.on("SIGINT", () => {
    console.log(`\n${DIM()}Stopping watch mode...${RESET()}`);
    if (debounceTimer) clearTimeout(debounceTimer);
    for (const w of watchers) {
      w.close();
    }
    process.exit(0);
  });
}

function ask(rl: readline.Interface, question: string, defaultVal?: string): Promise<string> {
  const prompt = defaultVal ? `${question} ${DIM()}(${defaultVal})${RESET()}: ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal || "");
    });
  });
}

async function askYesNo(rl: readline.Interface, question: string, defaultYes: boolean = false): Promise<boolean> {
  const hint = defaultYes ? "Y/n" : "y/N";
  const prompt = `${question} ${DIM()}(${hint})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim().toLowerCase();
      if (val === "") resolve(defaultYes);
      else resolve(val === "y" || val === "yes");
    });
  });
}

async function askMultiSelect(rl: readline.Interface, question: string, options: string[], defaults: string[] = []): Promise<string[]> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    const selected = defaults.includes(options[i]);
    console.log(`  ${DIM()}${i + 1})${RESET()} ${options[i]}${selected ? ` ${GREEN()}(selected)${RESET()}` : ""}`);
  }
  const defaultHint = defaults.length > 0 ? defaults.map(d => String(options.indexOf(d) + 1)).join(",") : "none";
  const prompt = `${BOLD()}Enter numbers separated by commas${RESET()} ${DIM()}(${defaultHint})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim();
      if (val === "" && defaults.length > 0) {
        resolve(defaults);
        return;
      }
      if (val === "") {
        resolve([]);
        return;
      }
      const indices = val.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= options.length);
      resolve(indices.map(i => options[i - 1]));
    });
  });
}

async function askSelect(rl: readline.Interface, question: string, options: string[], defaultVal: string): Promise<string> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    const selected = options[i] === defaultVal;
    console.log(`  ${DIM()}${i + 1})${RESET()} ${options[i]}${selected ? ` ${GREEN()}(default)${RESET()}` : ""}`);
  }
  const defaultIdx = options.indexOf(defaultVal) + 1;
  const prompt = `${BOLD()}Choose${RESET()} ${DIM()}(${defaultIdx})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim();
      if (val === "") {
        resolve(defaultVal);
        return;
      }
      const idx = parseInt(val, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= options.length) {
        resolve(options[idx - 1]);
      } else {
        resolve(defaultVal);
      }
    });
  });
}

async function runInit(projectPath: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const existing = configExists(projectPath);
  if (existing) {
    console.log(`${YELLOW()}Config file already exists.${RESET()} Updating...\n`);
  } else {
    console.log(`Setting up Codepliant for this project.\n`);
  }

  const current = loadConfig(projectPath);

  // --- Step 1: Basic info ---
  console.log(`${CYAN()}${BOLD()}Step 1/4: Company Info${RESET()}\n`);

  const companyName = await ask(rl, `${BOLD()}Company name${RESET()}`, current.companyName);
  const contactEmail = await ask(rl, `${BOLD()}Contact email${RESET()}`, current.contactEmail);
  const website = await ask(rl, `${BOLD()}Website URL${RESET()}`, current.website || "");
  const jurisdiction = await ask(
    rl,
    `${BOLD()}Primary legal jurisdiction${RESET()}`,
    current.jurisdiction || "State of Delaware, United States"
  );

  // --- Step 2: Jurisdictions + DPO ---
  console.log(`\n${CYAN()}${BOLD()}Step 2/4: Compliance Scope${RESET()}`);

  const jurisdictionOptions = ["GDPR", "CCPA", "UK GDPR"];
  const currentJurisdictions = current.jurisdictions || [];
  const jurisdictions = await askMultiSelect(
    rl,
    `${BOLD()}What jurisdictions apply?${RESET()}`,
    jurisdictionOptions,
    currentJurisdictions
  );

  let dpoName = current.dpoName || "";
  let dpoEmail = current.dpoEmail || "";

  const hasDpo = await askYesNo(rl, `\n${BOLD()}Do you have a Data Protection Officer (DPO)?${RESET()}`, !!current.dpoName);
  if (hasDpo) {
    dpoName = await ask(rl, `${BOLD()}DPO name${RESET()}`, current.dpoName || "");
    dpoEmail = await ask(rl, `${BOLD()}DPO email${RESET()}`, current.dpoEmail || "");
  }

  // --- Step 3: Output preferences ---
  console.log(`\n${CYAN()}${BOLD()}Step 3/4: Output Preferences${RESET()}`);

  const formatOptions = ["markdown", "html", "all"];
  const currentFormat = current.outputFormat || "markdown";
  const outputFormat = await askSelect(
    rl,
    `${BOLD()}Preferred output format?${RESET()}`,
    formatOptions,
    currentFormat
  );

  const outputDir = await ask(rl, `\n${BOLD()}Output directory${RESET()}`, current.outputDir);

  rl.close();

  // --- Build and save config ---
  const config: CodepliantConfig = {
    companyName,
    contactEmail,
    outputDir,
    ...(website && { website }),
    ...(jurisdiction && { jurisdiction }),
    ...(jurisdictions.length > 0 && { jurisdictions }),
    ...(dpoName && { dpoName }),
    ...(dpoEmail && { dpoEmail }),
    ...(outputFormat !== "markdown" && { outputFormat: outputFormat as CodepliantConfig["outputFormat"] }),
  };

  const configPath = saveConfig(projectPath, config);
  const relativePath = path.relative(projectPath, configPath);
  console.log(`\n${GREEN()}${BOLD()}✓${RESET()} Config saved to ${relativePath}`);

  // --- Step 4: Auto-run scan + generate ---
  console.log(`\n${CYAN()}${BOLD()}Step 4/4: Initial Scan & Generate${RESET()}\n`);

  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const format = (outputFormat as OutputFormat) || "markdown";

  const { result, durationMs } = scanWithProgress(absProjectPath, false);
  console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);

  const reloadedConfig = loadConfig(absProjectPath);
  const docs = generateDocuments(result, reloadedConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, format, reloadedConfig, result);

  for (const file of writtenFiles) {
    const relPath = path.relative(absProjectPath, file);
    console.log(`  ${GREEN()}✓${RESET()} ${relPath}`);
  }

  // --- Summary ---
  console.log(`\n${GREEN()}${BOLD()}Generated ${writtenFiles.length} document(s).${RESET()}\n`);

  console.log(`${BOLD()}Next steps:${RESET()}\n`);
  console.log(`  1. Review generated documents in ${CYAN()}${outputDir}/${RESET()}`);
  console.log(`  2. Customize them for your specific legal requirements`);
  console.log(`  3. Run ${CYAN()}codepliant go${RESET()} to regenerate after code changes`);
  if (jurisdictions.length > 0) {
    console.log(`  4. Ensure compliance with: ${jurisdictions.join(", ")}`);
  }

  // --- Suggest .gitignore ---
  const gitignorePath = path.join(absProjectPath, ".gitignore");
  const outputDirName = outputDir.replace(/^\.\//, "").replace(/\/$/, "");
  let needsGitignoreHint = false;

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    const lines = gitignoreContent.split("\n").map(l => l.trim());
    const hasEntry = lines.some(l => l === outputDirName || l === `${outputDirName}/` || l === `/${outputDirName}` || l === `/${outputDirName}/`);
    if (!hasEntry) {
      needsGitignoreHint = true;
    }
  } else {
    needsGitignoreHint = true;
  }

  if (needsGitignoreHint) {
    console.log(`\n${YELLOW()}${BOLD()}Tip:${RESET()} Consider adding ${CYAN()}${outputDirName}/${RESET()} to your .gitignore if generated legal docs should not be committed.`);
    console.log(`${DIM()}  echo "${outputDirName}/" >> .gitignore${RESET()}`);
  }

  console.log();
}

// --- `codepliant page` command ---

function runPage(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean
) {
  if (!quiet) printBanner();

  const { result, durationMs } = scanWithProgress(absProjectPath, quiet);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  const config = loadConfig(absProjectPath);
  const docs = generateDocuments(result, config);

  const pageFiles = writeCompliancePage(docs, absOutputDir, {
    companyName: config?.companyName,
    lastUpdated: new Date().toISOString().split("T")[0],
  });

  if (!quiet) {
    for (const file of pageFiles) {
      const relativePath = path.relative(absProjectPath, file);
      const content = fs.readFileSync(file, "utf-8");
      const size = Buffer.byteLength(content, "utf-8");
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)})${RESET()}`);
    }
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} Compliance page generated.\n`
    );
  }

  process.exit(0);
}

// --- `codepliant badge` command ---

function runEnv(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  verbose: boolean
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  // Generate .env.example in the project root (not the legal output dir)
  const envPath = writeEnvExample(result, absProjectPath);

  if (!envPath) {
    console.log(`${YELLOW()}No services with environment variables detected.${RESET()}\n`);
    process.exit(0);
  }

  if (!quiet) {
    const relativePath = path.relative(absProjectPath, envPath);
    const content = fs.readFileSync(envPath, "utf-8");
    const varCount = content.split("\n").filter((l: string) => l.match(/^[A-Z_]+=/) ).length;
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${varCount} variable(s))${RESET()}`);
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} .env.example generated at ${relativePath}\n`
    );
    console.log(
      `${DIM()}Copy to .env.local and fill in your actual values.${RESET()}\n`
    );
  }

  process.exit(0);
}

function runBadge(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean
) {
  if (!quiet) printBanner();

  const result = scan(absProjectPath);
  const badgeFiles = writeBadges(result, absOutputDir);

  if (!quiet) {
    for (const file of badgeFiles) {
      const relativePath = path.relative(absProjectPath, file);
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath}`);
    }
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} ${badgeFiles.length} badge(s) generated in ${path.relative(absProjectPath, path.join(absOutputDir, "badges"))}/\n`
    );
  }

  process.exit(0);
}

// --- `codepliant report` command ---

function runReport(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  verbose: boolean,
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  if (!quiet) printConfigWarnings(config);

  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  if (plugins.length > 0 && !quiet) {
    console.log(`  ${DIM()}Loaded ${plugins.length} plugin(s): ${plugins.map(p => p.name).join(", ")}${RESET()}`);
  }

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  // Generate documents so we can include the inventory in the report
  const docs = generateDocuments(result, config, plugins);

  if (!quiet) {
    console.log(`${BOLD()}Generating compliance report...${RESET()}\n`);
  }

  const reportPath = writeComplianceReport({
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  });

  const relativePath = path.relative(absProjectPath, reportPath);
  const content = fs.readFileSync(reportPath, "utf-8");
  const size = Buffer.byteLength(content, "utf-8");
  const lines = countLines(content);

  console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)}, ${lines} lines)${RESET()}`);
  console.log(
    `\n${GREEN()}${BOLD()}Done!${RESET()} Compliance report generated in ${path.relative(absProjectPath, absOutputDir)}/\n`
  );

  console.log(
    `${DIM()}⚠ This report is generated from code analysis. Review with legal counsel before relying on it for compliance decisions.${RESET()}\n`
  );

  process.exit(0);
}

// --- `codepliant check` command ---

function runCheck(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  const result = scan(absProjectPath);

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  interface CheckResult {
    document: string;
    required: boolean;
    exists: boolean;
  }

  const checks: CheckResult[] = [];
  let allPass = true;

  for (const need of result.complianceNeeds) {
    const filenames = docFileMap[need.document];
    if (!filenames) continue;
    const exists = filenames.some(f => fs.existsSync(path.join(absOutputDir, f)));
    checks.push({
      document: need.document,
      required: need.priority === "required",
      exists,
    });
    if (need.priority === "required" && !exists) {
      allPass = false;
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify({ pass: allPass, checks }, null, 2));
    process.exit(allPass ? 0 : 1);
  }

  if (!quiet) {
    console.log(`\n${BOLD()}Compliance check:${RESET()}\n`);
  }

  for (const check of checks) {
    const status = check.exists
      ? `${GREEN()}✓ EXISTS${RESET()}`
      : check.required
        ? `${RED()}✗ MISSING${RESET()}`
        : `${YELLOW()}○ MISSING${RESET()}`;
    const priority = check.required ? `${RED()}required${RESET()}` : `${DIM()}recommended${RESET()}`;
    console.log(`  ${status}  ${check.document} (${priority})`);
  }

  console.log();

  if (allPass) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} All required compliance documents exist.\n`);
  } else {
    const missing = checks.filter(c => c.required && !c.exists).map(c => c.document);
    console.log(`${RED()}${BOLD()}FAIL${RESET()} Missing required document(s): ${missing.join(", ")}`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate them.${RESET()}\n`);
  }

  process.exit(allPass ? 0 : 1);
}

// --- `codepliant lint` command ---

function runLint(
  absProjectPath: string,
  outputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  if (!quiet && !jsonOutput) {
    printBanner();
    console.log(`${BOLD()}Linting compliance documents...${RESET()}\n`);
  }

  const result = lintDocuments(absProjectPath, outputDir);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  if (!quiet) {
    console.log(`  ${DIM()}Documents expected: ${result.documentsExpected}${RESET()}`);
    console.log(`  ${DIM()}Documents checked:  ${result.documentsChecked}${RESET()}\n`);
  }

  if (result.issues.length === 0) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} All compliance documents are complete.\n`);
    process.exit(0);
  }

  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");

  for (const issue of errors) {
    console.log(`  ${RED()}ERROR${RESET()}   ${issue.document}: ${issue.message}`);
  }
  for (const issue of warnings) {
    console.log(`  ${YELLOW()}WARN${RESET()}    ${issue.document}: ${issue.message}`);
  }

  console.log();

  if (result.passed) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} ${warnings.length} warning(s), no errors.\n`);
  } else {
    console.log(`${RED()}${BOLD()}FAIL${RESET()} ${errors.length} error(s), ${warnings.length} warning(s).`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate missing documents.${RESET()}\n`);
  }

  process.exit(result.passed ? 0 : 1);
}

// --- `codepliant diff` command ---

function runDiff(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  _formatFlag?: OutputFormat
) {
  if (!fs.existsSync(absOutputDir)) {
    console.error(`${RED()}Error: Output directory "${absOutputDir}" does not exist.${RESET()}`);
    console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`);
    process.exit(1);
  }

  const config = loadConfig(absProjectPath);
  const outputFormat = _formatFlag || getOutputFormat(config);

  // Scan and generate fresh docs in-memory (don't write)
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // Compare with existing documents on disk
  const diff = diffDocuments(docs, absOutputDir, outputFormat);

  if (jsonOutput) {
    console.log(JSON.stringify({
      hasChanges: diff.hasChanges,
      timestamp: diff.timestamp,
      changes: diff.changes,
    }, null, 2));
    process.exit(diff.hasChanges ? 1 : 0);
  }

  if (!quiet) {
    console.log(`\n${BOLD()}Document diff (current vs. regenerated):${RESET()}\n`);
  }

  if (!diff.hasChanges) {
    for (const doc of docs) {
      console.log(`  ${DIM()}= ${doc.filename} (no changes)${RESET()}`);
    }
    console.log();
    console.log(`${GREEN()}All documents are up to date.${RESET()}\n`);
    process.exit(0);
  }

  const changedFilenames = new Set(diff.changes.map(c => c.filename));
  for (const doc of docs) {
    if (!changedFilenames.has(doc.filename)) {
      console.log(`  ${DIM()}= ${doc.filename} (no changes)${RESET()}`);
    }
  }

  for (const change of diff.changes) {
    switch (change.type) {
      case "added":
        console.log(`  ${GREEN()}+ ${change.filename}${RESET()} ${DIM()}(new)${RESET()}`);
        break;
      case "updated":
        console.log(`  ${YELLOW()}~ ${change.filename}${RESET()}`);
        break;
      case "removed":
        console.log(`  ${RED()}- ${change.filename}${RESET()} ${DIM()}(would be removed)${RESET()}`);
        break;
    }
    for (const detail of change.details) {
      console.log(`    ${DIM()}- ${detail}${RESET()}`);
    }
  }

  console.log();
  console.log(`${YELLOW()}Documents are out of date.${RESET()} Run ${CYAN()}codepliant go${RESET()} to regenerate.\n`);
  process.exit(1);
}

// --- `codepliant notify` command ---

function runNotify(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  verbose: boolean,
) {
  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    printScanResults(result, quiet);
  }

  const payload = buildPayload(result, absOutputDir);

  if (jsonOutput) {
    const notifResult = { webhookUrl: config.webhookUrl || null, payload };
    console.log(JSON.stringify(notifResult, null, 2));
  }

  if (!config.webhookUrl) {
    if (!quiet && !jsonOutput) {
      console.log(`${YELLOW()}No webhookUrl configured in .codepliantrc.json.${RESET()}`);
      console.log(`${DIM()}Add "webhookUrl": "https://hooks.slack.com/..." to enable notifications.${RESET()}\n`);
      console.log(`${BOLD()}Notification payload (not sent):${RESET()}\n`);
      console.log(JSON.stringify(payload, null, 2));
      console.log();
    }
    return;
  }

  if (!quiet && !jsonOutput) {
    console.log(`\n${BOLD()}Sending notification...${RESET()}`);
  }

  sendNotification(config.webhookUrl, result, absOutputDir).then((notifResult) => {
    if (notifResult.sent) {
      if (!quiet && !jsonOutput) {
        console.log(`${GREEN()}${BOLD()}Notification sent!${RESET()}\n`);
      }
    } else {
      if (!quiet && !jsonOutput) {
        console.log(`${RED()}Failed to send notification: ${notifResult.error}${RESET()}\n`);
      }
      process.exit(1);
    }
  }).catch((err) => {
    console.error(`${RED()}Notification error: ${formatError(err)}${RESET()}`);
    process.exit(1);
  });
}

// --- `codepliant dashboard` command ---

function runDashboard(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);
  const diff = diffDocuments(docs, absOutputDir);
  const score = computeComplianceScore(result, absOutputDir);

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  interface DocStatus {
    name: string;
    status: "up-to-date" | "stale" | "missing";
    priority: "required" | "recommended" | "none";
  }

  const docStatuses: DocStatus[] = [];
  const staleFilenames = new Set(diff.changes.filter(c => c.type === "updated").map(c => c.document));
  const neededDocs = new Map(result.complianceNeeds.map(n => [n.document, n.priority]));

  // Build status for each known document type
  for (const [docName, filenames] of Object.entries(docFileMap)) {
    const exists = filenames.some(f => fs.existsSync(path.join(absOutputDir, f)));
    const isStale = staleFilenames.has(docName);
    const priority = neededDocs.get(docName) || "none";

    // Only show documents that are needed or already exist
    if (priority === "none" && !exists) continue;

    let status: DocStatus["status"];
    if (!exists) {
      status = "missing";
    } else if (isStale) {
      status = "stale";
    } else {
      status = "up-to-date";
    }

    docStatuses.push({ name: docName, status, priority });
  }

  const totalDocs = docStatuses.filter(d => d.status !== "missing").length;
  const staleDocs = docStatuses.filter(d => d.status === "stale").length;
  const missingDocs = docStatuses.filter(d => d.status === "missing").length;

  // Determine jurisdictions from config
  const jurisdictions = config.jurisdictions && config.jurisdictions.length > 0
    ? config.jurisdictions.join(", ")
    : config.jurisdiction || "Not configured";

  // Determine last scan time from output dir modification
  let lastScanLabel = "never";
  if (fs.existsSync(absOutputDir)) {
    try {
      const entries = fs.readdirSync(absOutputDir);
      let latestMtime = 0;
      for (const entry of entries) {
        const stat = fs.statSync(path.join(absOutputDir, entry));
        if (stat.mtimeMs > latestMtime) latestMtime = stat.mtimeMs;
      }
      if (latestMtime > 0) {
        const agoMs = Date.now() - latestMtime;
        if (agoMs < 60_000) lastScanLabel = "just now";
        else if (agoMs < 3_600_000) lastScanLabel = `${Math.round(agoMs / 60_000)} minute(s) ago`;
        else if (agoMs < 86_400_000) lastScanLabel = `${Math.round(agoMs / 3_600_000)} hour(s) ago`;
        else lastScanLabel = `${Math.round(agoMs / 86_400_000)} day(s) ago`;
      }
    } catch {
      // ignore errors reading output dir
    }
  }

  // Build action items
  const actionItems: string[] = [];
  for (const doc of docStatuses) {
    if (doc.status === "missing" && doc.priority === "required") {
      actionItems.push(`Generate missing ${doc.name} (required)`);
    }
  }
  for (const doc of docStatuses) {
    if (doc.status === "stale") {
      actionItems.push(`Update stale ${doc.name}`);
    }
  }
  for (const doc of docStatuses) {
    if (doc.status === "missing" && doc.priority === "recommended") {
      actionItems.push(`Generate missing ${doc.name} (recommended)`);
    }
  }

  // JSON output
  if (jsonOutput) {
    console.log(JSON.stringify({
      project: result.projectName,
      score,
      services: result.services.length,
      documents: { total: totalDocs, stale: staleDocs, missing: missingDocs },
      jurisdictions: config.jurisdictions || [],
      docStatuses,
      actionItems: actionItems.slice(0, 5),
      lastScan: lastScanLabel,
    }, null, 2));
    process.exit(0);
  }

  // Build the dashboard
  const BOX_WIDTH = 50;
  const innerWidth = BOX_WIDTH - 4; // 2 for "│ " and 2 for " │"

  function pad(text: string, width: number): string {
    // Strip ANSI codes for length calculation
    const stripped = text.replace(/\x1b\[[0-9;]*m/g, "");
    const padding = Math.max(0, width - stripped.length);
    return text + " ".repeat(padding);
  }

  function line(content: string): string {
    return `${CYAN()}│${RESET()}  ${pad(content, innerWidth)}${CYAN()}│${RESET()}`;
  }

  function emptyLine(): string {
    return `${CYAN()}│${RESET()}${" ".repeat(BOX_WIDTH - 2)}${CYAN()}│${RESET()}`;
  }

  // Progress bar
  const filledBlocks = Math.round(score / 10);
  const emptyBlocks = 10 - filledBlocks;
  let barColor = RED();
  if (score > 80) barColor = GREEN();
  else if (score > 60) barColor = YELLOW();
  const progressBar = `${barColor}${"█".repeat(filledBlocks)}${DIM()}${"░".repeat(emptyBlocks)}${RESET()}`;

  const topBorder = `${CYAN()}┌─ CODEPLIANT DASHBOARD ${"─".repeat(BOX_WIDTH - 25)}┐${RESET()}`;
  const bottomBorder = `${CYAN()}└${"─".repeat(BOX_WIDTH - 2)}┘${RESET()}`;

  const lines: string[] = [];
  lines.push(topBorder);
  lines.push(emptyLine());

  // Project name
  lines.push(line(`${BOLD()}Project:${RESET()} ${result.projectName}`));

  // Score
  lines.push(line(`${BOLD()}Score:${RESET()}   ${progressBar} ${barColor}${BOLD()}${score}%${RESET()}`));

  lines.push(emptyLine());

  // Services
  lines.push(line(`${BOLD()}Services:${RESET()} ${result.services.length} detected`));

  // Documents summary
  const docsLabel = staleDocs > 0
    ? `${totalDocs} generated ${YELLOW()}(${staleDocs} stale)${RESET()}`
    : `${totalDocs} generated`;
  lines.push(line(`${BOLD()}Documents:${RESET()} ${docsLabel}`));

  // Jurisdictions
  lines.push(line(`${BOLD()}Jurisdictions:${RESET()} ${jurisdictions}`));

  lines.push(emptyLine());

  // Document statuses
  for (const doc of docStatuses) {
    let statusIcon: string;
    let statusLabel: string;
    if (doc.status === "up-to-date") {
      statusIcon = `${GREEN()}●${RESET()}`;
      statusLabel = `${GREEN()}✓ up to date${RESET()}`;
    } else if (doc.status === "stale") {
      statusIcon = `${YELLOW()}●${RESET()}`;
      statusLabel = `${YELLOW()}⚠ needs update${RESET()}`;
    } else {
      statusIcon = `${RED()}●${RESET()}`;
      statusLabel = `${RED()}✗ missing${RESET()}`;
    }
    const docNamePadded = pad(doc.name, 22);
    lines.push(line(`${statusIcon} ${docNamePadded} ${statusLabel}`));
  }

  lines.push(emptyLine());

  // Action items (top 3)
  if (actionItems.length > 0) {
    lines.push(line(`${BOLD()}Action items:${RESET()}`));
    for (const item of actionItems.slice(0, 3)) {
      lines.push(line(`  ${YELLOW()}→${RESET()} ${item}`));
    }
    if (actionItems.length > 3) {
      lines.push(line(`  ${DIM()}...and ${actionItems.length - 3} more${RESET()}`));
    }
    lines.push(emptyLine());
  }

  // Last scan
  lines.push(line(`${DIM()}Last scan: ${lastScanLabel}${RESET()}`));

  lines.push(bottomBorder);

  if (!quiet) {
    console.log();
    for (const l of lines) {
      console.log(`  ${l}`);
    }
    console.log();
  }

  process.exit(0);
}

// --- `codepliant hook` command ---

function runHook(projectPath: string, args: string[]) {
  const subcommand = args[1];

  if (subcommand === "install") {
    const result = installHook(projectPath);

    if (result.installed) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} ${result.message}\n`);

      if (result.hookType !== "lefthook") {
        console.log(`${DIM()}Using lefthook? Add this to your config:${RESET()}\n`);
        console.log(`${DIM()}${getLefthookSnippet()}${RESET()}`);
      }
    } else {
      console.error(`\n${RED()}${BOLD()}✗${RESET()} ${result.message}\n`);
      process.exit(1);
    }
    return;
  }

  if (subcommand === "uninstall") {
    const result = uninstallHook(projectPath);

    if (result.uninstalled) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} ${result.message}\n`);
    } else {
      console.log(`\n${YELLOW()}${result.message}${RESET()}\n`);
    }
    return;
  }

  console.error(`${RED()}Unknown hook subcommand: "${subcommand || ""}"${RESET()}`);
  console.error(`${DIM()}Usage: codepliant hook install | codepliant hook uninstall${RESET()}`);
  process.exit(1);
}

// --- `codepliant template` command ---

function runTemplate(projectPath: string, args: string[]) {
  const subcommand = args[1];

  if (subcommand === "init") {
    const created = initTemplates(projectPath);

    if (created.length > 0) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} Created ${created.length} template(s) in ${path.relative(projectPath, getTemplatesDir(projectPath))}/\n`);
      for (const file of created) {
        console.log(`  ${DIM()}${path.relative(projectPath, file)}${RESET()}`);
      }
      console.log(`\n${DIM()}Edit these templates to customize your compliance documents.${RESET()}`);
      console.log(`${DIM()}Available variables: {{company}}, {{email}}, {{services}}, {{dataCategories}}, {{jurisdiction}}, {{date}}, {{dpo}}${RESET()}`);
      console.log(`${DIM()}Conditionals: {{#if hasAI}}...{{/if}}${RESET()}\n`);
    } else {
      console.log(`\n${YELLOW()}Templates directory already exists with all default templates.${RESET()}\n`);
    }
    return;
  }

  console.error(`${RED()}Unknown template subcommand: "${subcommand || ""}"${RESET()}`);
  console.error(`${DIM()}Usage: codepliant template init${RESET()}`);
  process.exit(1);
}

// --- `codepliant scan-all` command ---

interface MultiProjectScanResult {
  project: DiscoveredProject;
  scanResult: ScanResult;
  durationMs: number;
}

function runScanAll(
  absRootPath: string,
  quiet: boolean,
  jsonOutput: boolean,
  verbose: boolean,
) {
  if (!quiet && !jsonOutput) printBanner();

  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Discovering projects under ${absRootPath}...${RESET()}\n`);
  }

  const projects = discoverProjects(absRootPath);

  if (projects.length === 0) {
    if (jsonOutput) {
      console.log(JSON.stringify({ projects: [], aggregateScore: 100 }, null, 2));
    } else {
      console.log(`${YELLOW()}No projects found under ${absRootPath}.${RESET()}`);
      console.log(`${DIM()}Make sure subdirectories contain package.json, requirements.txt, go.mod, etc.${RESET()}\n`);
    }
    process.exit(0);
  }

  if (!quiet && !jsonOutput) {
    console.log(`  ${CYAN()}Found ${projects.length} project(s):${RESET()}\n`);
    for (const p of projects) {
      console.log(`    ${DIM()}${p.relativePath}${RESET()} ${DIM()}(${p.manifests.join(", ")})${RESET()}`);
    }
    console.log();
  }

  const results: MultiProjectScanResult[] = [];
  const totalStart = Date.now();

  for (const project of projects) {
    if (!quiet && !jsonOutput) {
      console.log(`${BOLD()}Scanning ${project.name}${RESET()} ${DIM()}(${project.relativePath})${RESET()}`);
    }

    const startTime = Date.now();
    try {
      const scanResult = scan(project.path, { verbose });
      const durationMs = Date.now() - startTime;
      results.push({ project, scanResult, durationMs });

      if (!quiet && !jsonOutput) {
        const serviceCount = scanResult.services.length;
        const needCount = scanResult.complianceNeeds.length;
        console.log(`  ${GREEN()}✓${RESET()} ${serviceCount} service(s), ${needCount} compliance need(s) ${DIM()}(${formatDuration(durationMs)})${RESET()}\n`);
      }
    } catch (err) {
      if (!quiet && !jsonOutput) {
        console.log(`  ${RED()}✗ Error: ${formatError(err)}${RESET()}\n`);
      }
    }
  }

  const totalDuration = Date.now() - totalStart;

  // Compute aggregate compliance score
  const aggregateScore = computeAggregateScore(results);

  if (jsonOutput) {
    const output = {
      rootPath: absRootPath,
      projectCount: results.length,
      projects: results.map(r => ({
        name: r.project.name,
        path: r.project.relativePath,
        manifests: r.project.manifests,
        services: r.scanResult.services.length,
        complianceNeeds: r.scanResult.complianceNeeds.length,
        durationMs: r.durationMs,
      })),
      aggregate: {
        totalServices: results.reduce((sum, r) => sum + r.scanResult.services.length, 0),
        totalComplianceNeeds: results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0),
        complianceScore: aggregateScore,
      },
      totalDurationMs: totalDuration,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  // Print aggregate summary
  if (!quiet) {
    console.log(`${"─".repeat(50)}`);
    console.log(`\n${BOLD()}Aggregate results across ${results.length} project(s):${RESET()}\n`);

    const totalServices = results.reduce((sum, r) => sum + r.scanResult.services.length, 0);
    const totalNeeds = results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0);

    // Collect unique services across all projects
    const uniqueServices = new Map<string, Set<string>>();
    for (const r of results) {
      for (const svc of r.scanResult.services) {
        if (!uniqueServices.has(svc.name)) {
          uniqueServices.set(svc.name, new Set());
        }
        uniqueServices.get(svc.name)!.add(r.project.name);
      }
    }

    console.log(`  ${BOLD()}Total services detected:${RESET()} ${totalServices} (${uniqueServices.size} unique)`);
    console.log(`  ${BOLD()}Total compliance needs:${RESET()}  ${totalNeeds}`);
    console.log(`  ${BOLD()}Aggregate compliance score:${RESET()} ${formatComplianceScore(aggregateScore)}`);
    console.log(`  ${DIM()}Scanned in ${formatDuration(totalDuration)}${RESET()}\n`);

    // Per-project summary table
    console.log(`${BOLD()}Per-project summary:${RESET()}\n`);
    for (const r of results) {
      const svcCount = String(r.scanResult.services.length).padStart(3);
      const needCount = String(r.scanResult.complianceNeeds.length).padStart(3);
      console.log(`  ${r.project.name.padEnd(30)} ${DIM()}services:${RESET()} ${svcCount}  ${DIM()}needs:${RESET()} ${needCount}`);
    }
    console.log();
  }

  process.exit(0);
}

// --- `codepliant generate-all` command ---

function runGenerateAll(
  absRootPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  outputFormat: OutputFormat = "markdown",
  verbose: boolean = false,
) {
  if (!quiet && !jsonOutput) printBanner();

  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Discovering projects under ${absRootPath}...${RESET()}\n`);
  }

  const projects = discoverProjects(absRootPath);

  if (projects.length === 0) {
    if (jsonOutput) {
      console.log(JSON.stringify({ projects: [], aggregateScore: 100 }, null, 2));
    } else {
      console.log(`${YELLOW()}No projects found under ${absRootPath}.${RESET()}`);
      console.log(`${DIM()}Make sure subdirectories contain package.json, requirements.txt, go.mod, etc.${RESET()}\n`);
    }
    process.exit(0);
  }

  if (!quiet && !jsonOutput) {
    console.log(`  ${CYAN()}Found ${projects.length} project(s):${RESET()}\n`);
    for (const p of projects) {
      console.log(`    ${DIM()}${p.relativePath}${RESET()} ${DIM()}(${p.manifests.join(", ")})${RESET()}`);
    }
    console.log();
  }

  interface GenerateAllResult {
    project: DiscoveredProject;
    scanResult: ScanResult;
    docsGenerated: number;
    outputDir: string;
    durationMs: number;
  }

  const results: GenerateAllResult[] = [];
  const totalStart = Date.now();

  for (const project of projects) {
    if (!quiet && !jsonOutput) {
      console.log(`${BOLD()}Processing ${project.name}${RESET()} ${DIM()}(${project.relativePath})${RESET()}`);
    }

    const startTime = Date.now();
    try {
      const scanResult = scan(project.path, { verbose });
      const config = loadConfig(project.path);
      const plugins = config.plugins ? loadPlugins(project.path, config.plugins) : [];
      const docs = generateDocuments(scanResult, config, plugins);

      // Write to a per-project subdirectory under the output dir
      const safeName = project.name.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
      const projectOutputDir = path.join(absOutputDir, safeName);
      const writtenFiles = writeDocumentsInFormat(docs, projectOutputDir, outputFormat, config, scanResult);

      const durationMs = Date.now() - startTime;
      results.push({ project, scanResult, docsGenerated: writtenFiles.length, outputDir: projectOutputDir, durationMs });

      if (!quiet && !jsonOutput) {
        console.log(`  ${GREEN()}✓${RESET()} ${writtenFiles.length} document(s) generated in ${path.relative(absRootPath, projectOutputDir)}/ ${DIM()}(${formatDuration(durationMs)})${RESET()}\n`);
      }
    } catch (err) {
      if (!quiet && !jsonOutput) {
        console.log(`  ${RED()}✗ Error: ${formatError(err)}${RESET()}\n`);
      }
    }
  }

  const totalDuration = Date.now() - totalStart;

  const scanResults: MultiProjectScanResult[] = results.map(r => ({
    project: r.project,
    scanResult: r.scanResult,
    durationMs: r.durationMs,
  }));
  const aggregateScore = computeAggregateScore(scanResults);

  if (jsonOutput) {
    const output = {
      rootPath: absRootPath,
      projectCount: results.length,
      projects: results.map(r => ({
        name: r.project.name,
        path: r.project.relativePath,
        manifests: r.project.manifests,
        services: r.scanResult.services.length,
        complianceNeeds: r.scanResult.complianceNeeds.length,
        docsGenerated: r.docsGenerated,
        outputDir: r.outputDir,
        durationMs: r.durationMs,
      })),
      aggregate: {
        totalServices: results.reduce((sum, r) => sum + r.scanResult.services.length, 0),
        totalComplianceNeeds: results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0),
        totalDocsGenerated: results.reduce((sum, r) => sum + r.docsGenerated, 0),
        complianceScore: aggregateScore,
      },
      totalDurationMs: totalDuration,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  if (!quiet) {
    console.log(`${"─".repeat(50)}`);
    console.log(`\n${BOLD()}Generation complete for ${results.length} project(s):${RESET()}\n`);

    const totalDocs = results.reduce((sum, r) => sum + r.docsGenerated, 0);
    const totalServices = results.reduce((sum, r) => sum + r.scanResult.services.length, 0);

    console.log(`  ${BOLD()}Total documents generated:${RESET()}  ${totalDocs}`);
    console.log(`  ${BOLD()}Total services detected:${RESET()}    ${totalServices}`);
    console.log(`  ${BOLD()}Aggregate compliance score:${RESET()} ${formatComplianceScore(aggregateScore)}`);
    console.log(`  ${DIM()}Completed in ${formatDuration(totalDuration)}${RESET()}\n`);

    console.log(`${BOLD()}Per-project summary:${RESET()}\n`);
    for (const r of results) {
      const docCount = String(r.docsGenerated).padStart(3);
      const svcCount = String(r.scanResult.services.length).padStart(3);
      console.log(`  ${r.project.name.padEnd(30)} ${DIM()}docs:${RESET()} ${docCount}  ${DIM()}services:${RESET()} ${svcCount}  ${DIM()}${path.relative(absRootPath, r.outputDir)}/${RESET()}`);
    }
    console.log();

    console.log(
      `${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}\n`
    );
  }

  process.exit(0);
}

// --- Aggregate compliance score ---

function computeAggregateScore(results: MultiProjectScanResult[]): number {
  if (results.length === 0) return 100;

  let totalWeight = 0;
  let totalScore = 0;

  for (const r of results) {
    const needs = r.scanResult.complianceNeeds;
    if (needs.length === 0) {
      totalWeight += 1;
      totalScore += 100;
      continue;
    }

    totalWeight += 1;

    // A project gets a base score of 100, minus deductions per unmet need.
    // Each required need = -15 pts, each recommended = -5 pts, floor at 0.
    let projectScore = 100;
    for (const need of needs) {
      projectScore -= need.priority === "required" ? 15 : 5;
    }
    totalScore += Math.max(0, projectScore);
  }

  if (totalWeight === 0) return 100;
  return Math.round(totalScore / totalWeight);
}


// --- Progress bar helper ---

function printProgressBar(step: number, totalSteps: number, label: string): void {
  const barWidth = 30;
  const filled = Math.round((step / totalSteps) * barWidth);
  const empty = barWidth - filled;
  const bar = `${GREEN()}${"█".repeat(filled)}${DIM()}${"░".repeat(empty)}${RESET()}`;
  console.log(`\n  ${bar} ${DIM()}Step ${step}/${totalSteps}${RESET()}`);
  console.log(`  ${CYAN()}${BOLD()}${label}${RESET()}\n`);
}

// --- `codepliant wizard` command ---

async function runWizard(
  projectPath: string,
  outputDir: string,
  formatFlag?: OutputFormat,
) {
  const absProjectPath = path.resolve(projectPath);
  const totalSteps = 6;

  // Step 1: Scan project
  printProgressBar(1, totalSteps, "Scanning project");

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result, durationMs } = scanWithProgress(absProjectPath, false, false, plugins);

  console.log(`  ${DIM()}Scanned in ${formatDuration(durationMs)} — found ${result.services.length} service(s)${RESET()}`);

  if (result.services.length === 0) {
    console.log(`\n${YELLOW()}No services detected.${RESET()} The wizard works best when your project has dependencies.\n`);
  }

  // Step 2: Review detected services
  printProgressBar(2, totalSteps, "Review detected services");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Load previously confirmed/excluded from config
  const previouslyConfirmed = new Set(config.confirmedServices || []);
  const previouslyExcluded = new Set(config.excludeServices || []);

  const confirmedServices: string[] = [];
  const excludedServices: string[] = [];

  if (result.services.length > 0) {
    console.log(`  The following services were detected in your codebase.\n`);
    console.log(`  For each service, confirm whether it should be included in compliance documents.\n`);

    for (const service of result.services) {
      const prevStatus = previouslyExcluded.has(service.name)
        ? ` ${DIM()}(previously excluded)${RESET()}`
        : previouslyConfirmed.has(service.name)
          ? ` ${DIM()}(previously confirmed)${RESET()}`
          : "";

      console.log(`  ${BOLD()}${service.name}${RESET()} ${DIM()}(${formatCategory(service.category)})${RESET()}${prevStatus}`);
      console.log(`    ${DIM()}Data: ${service.dataCollected.join(", ")}${RESET()}`);
      for (const ev of service.evidence.slice(0, 2)) {
        console.log(`    ${DIM()}Found: [${ev.type}] ${ev.file} → ${ev.detail}${RESET()}`);
      }
      if (service.evidence.length > 2) {
        console.log(`    ${DIM()}...and ${service.evidence.length - 2} more evidence(s)${RESET()}`);
      }

      // Default to previous choice, or include by default
      const defaultKeep = !previouslyExcluded.has(service.name);
      const keep = await askYesNo(rl, `    ${BOLD()}Include this service?${RESET()}`, defaultKeep);

      if (keep) {
        confirmedServices.push(service.name);
      } else {
        excludedServices.push(service.name);
        console.log(`    ${YELLOW()}Excluded${RESET()}`);
      }
      console.log();
    }
  } else {
    console.log(`  ${DIM()}No services to review.${RESET()}\n`);
  }

  // Step 3: Select jurisdictions
  printProgressBar(3, totalSteps, "Select jurisdictions");

  const jurisdictionOptions = [...VALID_JURISDICTIONS];
  const currentJurisdictions = config.jurisdictions || [];
  const selectedJurisdictions = await askMultiSelect(
    rl,
    `  ${BOLD()}Which jurisdictions apply to your project?${RESET()}`,
    jurisdictionOptions,
    currentJurisdictions,
  );

  if (selectedJurisdictions.length > 0) {
    console.log(`\n  ${GREEN()}Selected:${RESET()} ${selectedJurisdictions.join(", ")}`);
  } else {
    console.log(`\n  ${DIM()}No jurisdictions selected. Documents will use generic language.${RESET()}`);
  }

  // Step 4: Company info
  printProgressBar(4, totalSteps, "Company information");

  let companyName = config.companyName;
  let contactEmail = config.contactEmail;
  let website = config.website || "";

  const needsCompanyInfo =
    !companyName ||
    companyName === "[Your Company Name]" ||
    !contactEmail ||
    contactEmail === "[your-email@example.com]";

  if (needsCompanyInfo) {
    console.log(`  Company info is not configured yet.\n`);
    companyName = await ask(rl, `  ${BOLD()}Company name${RESET()}`, companyName);
    contactEmail = await ask(rl, `  ${BOLD()}Contact email${RESET()}`, contactEmail);
    website = await ask(rl, `  ${BOLD()}Website URL${RESET()}`, website);
  } else {
    console.log(`  ${GREEN()}✓${RESET()} Company: ${BOLD()}${companyName}${RESET()}`);
    console.log(`  ${GREEN()}✓${RESET()} Email: ${BOLD()}${contactEmail}${RESET()}`);
    if (website) console.log(`  ${GREEN()}✓${RESET()} Website: ${BOLD()}${website}${RESET()}`);

    const changeInfo = await askYesNo(rl, `\n  ${BOLD()}Change company info?${RESET()}`, false);
    if (changeInfo) {
      companyName = await ask(rl, `  ${BOLD()}Company name${RESET()}`, companyName);
      contactEmail = await ask(rl, `  ${BOLD()}Contact email${RESET()}`, contactEmail);
      website = await ask(rl, `  ${BOLD()}Website URL${RESET()}`, website);
    }
  }

  // Step 5: Review documents to generate
  printProgressBar(5, totalSteps, "Review documents to generate");

  // Build a temporary config + scan result with exclusions applied
  const wizardConfig: CodepliantConfig = {
    ...config,
    companyName,
    contactEmail,
    ...(website && { website }),
    ...(selectedJurisdictions.length > 0 && { jurisdictions: selectedJurisdictions }),
    excludeServices: excludedServices,
    confirmedServices,
  };

  // Filter out excluded services from scan result for document preview
  const filteredResult: ScanResult = {
    ...result,
    services: result.services.filter((s) => !excludedServices.includes(s.name)),
  };

  const docs = generateDocuments(filteredResult, wizardConfig, plugins);

  console.log(`  The following ${docs.length} document(s) will be generated:\n`);

  for (const doc of docs) {
    const lines = doc.content.split("\n").length;
    console.log(`  ${GREEN()}●${RESET()} ${BOLD()}${doc.name}${RESET()} ${DIM()}(${doc.filename}, ~${lines} lines)${RESET()}`);
  }

  console.log();
  const proceed = await askYesNo(rl, `  ${BOLD()}Proceed with generation?${RESET()}`, true);

  if (!proceed) {
    rl.close();
    console.log(`\n${YELLOW()}Wizard cancelled.${RESET()} No files were written.\n`);
    return;
  }

  rl.close();

  // Step 6: Generate + summary
  printProgressBar(6, totalSteps, "Generating documents");

  // Save updated config
  const savedPath = saveConfig(absProjectPath, wizardConfig);
  console.log(`  ${GREEN()}✓${RESET()} Config saved to ${path.relative(absProjectPath, savedPath)}`);

  // Write documents
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const outputFormat = formatFlag || getOutputFormat(wizardConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, wizardConfig, filteredResult);

  // Write changelog
  const diff = diffDocuments(docs, absOutputDir);
  const changelogPath = appendChangelog(absOutputDir, diff);
  if (changelogPath) {
    writtenFiles.push(changelogPath);
  }

  console.log();
  for (const file of writtenFiles) {
    const relativePath = path.relative(absProjectPath, file);
    const content = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(content, "utf-8");
    const fileLines = countLines(content);
    const docName = docs.find((d) => file.endsWith(d.filename))?.name || path.basename(file);
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${docName}: ${formatFileSize(size)}, ${fileLines} lines)${RESET()}`);
  }

  // Summary
  const score = computeComplianceScore(filteredResult, absOutputDir);

  console.log(`
${GREEN()}${BOLD()}${"═".repeat(50)}${RESET()}
${GREEN()}${BOLD()}  Wizard complete!${RESET()}
${GREEN()}${BOLD()}${"═".repeat(50)}${RESET()}

  ${BOLD()}Documents generated:${RESET()}  ${writtenFiles.length}
  ${BOLD()}Output directory:${RESET()}     ${path.relative(absProjectPath, absOutputDir)}/
  ${BOLD()}Services included:${RESET()}    ${confirmedServices.length} of ${result.services.length}
  ${BOLD()}Services excluded:${RESET()}    ${excludedServices.length}
  ${BOLD()}Jurisdictions:${RESET()}        ${selectedJurisdictions.length > 0 ? selectedJurisdictions.join(", ") : "None selected"}
  ${BOLD()}Compliance score:${RESET()}     ${formatComplianceScore(score)}

${BOLD()}Next steps:${RESET()}

  1. Review generated documents in ${CYAN()}${path.relative(absProjectPath, absOutputDir)}/${RESET()}
  2. Customize them for your specific legal requirements
  3. Run ${CYAN()}codepliant go${RESET()} to regenerate after code changes
  4. Run ${CYAN()}codepliant wizard${RESET()} again to update service selections

${DIM()}Confirmed/excluded services are saved in .codepliantrc.json for future runs.${RESET()}
${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}
`);
}

async function runReview(projectPath: string, outputDir: string, quiet: boolean, jsonOutput: boolean, verbose: boolean) {
  console.log("AI review coming soon.");
  process.exit(0);
}

function runExplain(projectPath: string, args: string[], quiet: boolean, jsonOutput: boolean) {
  console.log("Document explain coming soon.");
  process.exit(0);
}

function runCompare(path1: string, path2: string, quiet: boolean, jsonOutput: boolean) {
  if (!quiet) printBanner();
  const config1 = loadConfig(path1);
  const config2 = loadConfig(path2);
  const result1 = scan(path1);
  const result2 = scan(path2);
  if (jsonOutput) {
    console.log(JSON.stringify({ project1: { path: path1, services: result1.services.length }, project2: { path: path2, services: result2.services.length } }, null, 2));
  } else {
    console.log(`${BOLD()}Comparison:${RESET()}\n`);
    console.log(`  ${CYAN()}${path.basename(path1)}${RESET()}: ${result1.services.length} service(s)`);
    console.log(`  ${CYAN()}${path.basename(path2)}${RESET()}: ${result2.services.length} service(s)`);
    const names1 = new Set(result1.services.map(s => s.name));
    const names2 = new Set(result2.services.map(s => s.name));
    const onlyIn1 = [...names1].filter(n => !names2.has(n));
    const onlyIn2 = [...names2].filter(n => !names1.has(n));
    if (onlyIn1.length > 0) console.log(`\n  ${YELLOW()}Only in ${path.basename(path1)}:${RESET()} ${onlyIn1.join(", ")}`);
    if (onlyIn2.length > 0) console.log(`\n  ${YELLOW()}Only in ${path.basename(path2)}:${RESET()} ${onlyIn2.join(", ")}`);
    if (onlyIn1.length === 0 && onlyIn2.length === 0) console.log(`\n  ${GREEN()}Both projects detect the same services.${RESET()}`);
    console.log();
  }
  process.exit(0);
}

function runSignatures(absProjectPath: string, args: string[]) {
  const subcommand = args[1];
  if (!subcommand || subcommand === "list") {
    printBanner();
    const { builtIn, community } = listAllSignatures(absProjectPath);
    console.log(`${BOLD()}Built-in signatures (${builtIn.length}):${RESET()}\n`);
    for (const sig of builtIn) {
      console.log(`  ${GREEN()}●${RESET()} ${BOLD()}${sig.name}${RESET()} ${DIM()}(${sig.category})${RESET()}`);
      console.log(`    ${DIM()}Data: ${sig.dataCollected.join(", ")}${RESET()}`);
    }
    if (community.length > 0) {
      console.log(`\n${BOLD()}Community signatures (${community.length}):${RESET()}\n`);
      for (const sig of community) {
        console.log(`  ${CYAN()}●${RESET()} ${BOLD()}${sig.name}${RESET()} ${DIM()}(${sig.category})${RESET()}`);
        console.log(`    ${DIM()}Data: ${sig.dataCollected.join(", ")}${RESET()}`);
        if (sig.author) console.log(`    ${DIM()}Author: ${sig.author}${RESET()}`);
      }
    } else {
      console.log(`\n${DIM()}No community signatures found. Import some with: codepliant signatures import <file>${RESET()}`);
    }
    console.log();
    process.exit(0);
  }
  if (subcommand === "export") {
    const outputFile = args[2] || "codepliant-signatures.json";
    const filePath = exportSignatures(absProjectPath, outputFile);
    console.log(`${GREEN()}${BOLD()}Signatures exported to ${filePath}${RESET()}\n`);
    process.exit(0);
  }
  if (subcommand === "import") {
    const importFile = args[2];
    if (!importFile) {
      console.error(`${RED()}Error: Please specify a file to import.${RESET()}`);
      console.error(`${DIM()}Usage: codepliant signatures import <file.json>${RESET()}`);
      process.exit(1);
    }
    try {
      const importResult = importSignatures(absProjectPath, importFile);
      console.log(`${GREEN()}${BOLD()}Import complete!${RESET()}`);
      console.log(`  Imported: ${importResult.imported} signature(s)`);
      console.log(`  Skipped: ${importResult.skipped} (duplicates or invalid)`);
      console.log(`  Total custom signatures: ${importResult.total}`);
      console.log();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`${RED()}Error: ${message}${RESET()}`);
      process.exit(1);
    }
    process.exit(0);
  }
  console.error(`${RED()}Unknown signatures subcommand: "${subcommand}"${RESET()}`);
  console.error(`${DIM()}Use: codepliant signatures list|export|import${RESET()}`);
  process.exit(1);
}

function runExport(absProjectPath: string, absOutputDir: string, quiet: boolean, formatFlag: OutputFormat | undefined, verbose: boolean = false) {
  if (!quiet) printBanner();
  const config = loadConfig(absProjectPath);
  const format = formatFlag || getOutputFormat(config);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result, durationMs } = scanWithProgress(absProjectPath, quiet, verbose, plugins);
  if (!quiet) console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  const docs = generateDocuments(result, config, plugins);
  let writtenFiles: string[];
  if (format === "wiki") {
    writtenFiles = writeGithubWiki(docs, absOutputDir, config);
  } else {
    writtenFiles = writeDocumentsInFormat(docs, absOutputDir, format, config, result);
  }
  if (!quiet) {
    for (const file of writtenFiles) {
      const relativePath = path.relative(absProjectPath, file);
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath}`);
    }
    console.log(`\n${GREEN()}${BOLD()}Done!${RESET()} ${writtenFiles.length} file(s) exported in ${format} format.\n`);
    if (format === "wiki") {
      const wikiDir = path.relative(absProjectPath, path.join(absOutputDir, "wiki"));
      console.log(`${DIM()}To publish to your GitHub Wiki:${RESET()}`);
      console.log(`  ${CYAN()}cd ${wikiDir}${RESET()}`);
      console.log(`  ${CYAN()}git init && git remote add origin <project>.wiki.git${RESET()}`);
      console.log(`  ${CYAN()}git add . && git commit -m "Update compliance docs" && git push${RESET()}\n`);
    }
  }
  process.exit(0);
}

function runDoctor(absProjectPath: string, absOutputDir: string, quiet: boolean) {
  if (!quiet) printBanner();
  console.log(`${BOLD()}Running diagnostics...${RESET()}\n`);
  interface DiagCheck { name: string; status: "pass" | "warn" | "fail"; message: string; fix?: string; }
  const checks: DiagCheck[] = [];
  const hasConfig = configExists(absProjectPath);
  if (hasConfig) {
    checks.push({ name: "Configuration", status: "pass", message: "Config file found (.codepliantrc.json)" });
  } else {
    checks.push({ name: "Configuration", status: "warn", message: "No config file found", fix: "Run 'codepliant init' to create a configuration file" });
  }
  if (hasConfig) {
    const config = loadConfig(absProjectPath);
    const warnings = validateConfig(config);
    if (warnings.length === 0) {
      checks.push({ name: "Config validation", status: "pass", message: "All config fields are valid" });
    } else {
      checks.push({ name: "Config validation", status: "warn", message: `${warnings.length} warning(s): ${warnings.map(w => w.message).join("; ")}`, fix: "Run 'codepliant init' to update your configuration" });
    }
  }
  if (fs.existsSync(absOutputDir)) {
    const mdFiles = fs.readdirSync(absOutputDir).filter(f => f.endsWith(".md"));
    if (mdFiles.length > 0) {
      checks.push({ name: "Generated documents", status: "pass", message: `${mdFiles.length} document(s) found in output directory` });
    } else {
      checks.push({ name: "Generated documents", status: "warn", message: "Output directory exists but contains no .md files", fix: "Run 'codepliant go' to generate documents" });
    }
  } else {
    checks.push({ name: "Generated documents", status: "fail", message: "Output directory does not exist", fix: "Run 'codepliant go' to scan and generate documents" });
  }
  if (fs.existsSync(absOutputDir)) {
    try {
      const config = loadConfig(absProjectPath);
      const scanResult = scan(absProjectPath);
      const docs = generateDocuments(scanResult, config);
      const docDiff = diffDocuments(docs, absOutputDir);
      if (docDiff.hasChanges) {
        checks.push({ name: "Documents freshness", status: "warn", message: `${docDiff.changes.length} document(s) are out of date`, fix: "Run 'codepliant go' to regenerate documents" });
      } else {
        checks.push({ name: "Documents freshness", status: "pass", message: "All documents are up to date" });
      }
    } catch {
      checks.push({ name: "Documents freshness", status: "warn", message: "Could not compare documents (scan may have failed)" });
    }
  }
  const manifestFiles = ["package.json", "requirements.txt", "go.mod", "Cargo.toml", "Gemfile", "pom.xml", "build.gradle"];
  const foundManifests = manifestFiles.filter(f => fs.existsSync(path.join(absProjectPath, f)));
  if (foundManifests.length > 0) {
    checks.push({ name: "Package manifest", status: "pass", message: `Found: ${foundManifests.join(", ")}` });
  } else {
    checks.push({ name: "Package manifest", status: "warn", message: "No package manifest found", fix: "Ensure you are running codepliant in the project root directory" });
  }
  const nodeVersion = process.versions.node;
  const nodeMajor = parseInt(nodeVersion.split(".")[0], 10);
  if (nodeMajor >= 18) {
    checks.push({ name: "Node.js version", status: "pass", message: `Node.js v${nodeVersion} (>= 18 required)` });
  } else {
    checks.push({ name: "Node.js version", status: "fail", message: `Node.js v${nodeVersion} is below minimum v18`, fix: "Upgrade to Node.js 18 or later" });
  }
  checks.push({ name: "Codepliant version", status: "pass", message: `v${VERSION} (run 'npm outdated -g codepliant' to check for updates)` });
  const codepliantDir = path.join(absProjectPath, ".codepliant");
  if (fs.existsSync(codepliantDir)) {
    const customSigsPath = path.join(codepliantDir, "custom-signatures.json");
    if (fs.existsSync(customSigsPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(customSigsPath, "utf-8"));
        const count = Array.isArray(raw.signatures) ? raw.signatures.length : 0;
        checks.push({ name: "Custom signatures", status: "pass", message: `${count} custom signature(s) loaded` });
      } catch {
        checks.push({ name: "Custom signatures", status: "warn", message: "custom-signatures.json is malformed", fix: "Fix or delete .codepliant/custom-signatures.json" });
      }
    }
  }
  const passCount = checks.filter(c => c.status === "pass").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  for (const check of checks) {
    let icon: string; let statusColor: string;
    switch (check.status) {
      case "pass": icon = `${GREEN()}✓${RESET()}`; statusColor = GREEN(); break;
      case "warn": icon = `${YELLOW()}⚠${RESET()}`; statusColor = YELLOW(); break;
      case "fail": icon = `${RED()}✗${RESET()}`; statusColor = RED(); break;
    }
    console.log(`  ${icon} ${BOLD()}${check.name}${RESET()}: ${statusColor}${check.message}${RESET()}`);
    if (check.fix) console.log(`    ${DIM()}Fix: ${check.fix}${RESET()}`);
  }
  console.log();
  console.log(`${BOLD()}Summary:${RESET()} ${GREEN()}${passCount} passed${RESET()}, ${YELLOW()}${warnCount} warning(s)${RESET()}, ${RED()}${failCount} error(s)${RESET()}`);
  if (failCount > 0) {
    console.log(`\n${RED()}Some checks failed. Please address the issues above.${RESET()}\n`);
    process.exit(1);
  } else if (warnCount > 0) {
    console.log(`\n${YELLOW()}Some warnings found. Consider addressing them for optimal setup.${RESET()}\n`);
    process.exit(0);
  } else {
    console.log(`\n${GREEN()}${BOLD()}All checks passed! Your Codepliant setup looks good.${RESET()}\n`);
    process.exit(0);
  }
}

main();
