import * as fs from "fs";
import type { DetectedService, Evidence } from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

/**
 * Scans source files for logging practices (console.log, winston, pino,
 * bunyan, morgan) and flags potential PII being logged.
 *
 * Returns findings as DetectedService entries so they integrate into the
 * security assessment pipeline.
 */

// ── Logging library patterns ────────────────────────────────────────────

interface LoggingPattern {
  name: string;
  /** Patterns that indicate usage of this logging library */
  importPatterns: RegExp[];
  /** Patterns that match log call sites */
  callPatterns: RegExp[];
}

const LOGGING_PATTERNS: LoggingPattern[] = [
  {
    name: "console.log",
    importPatterns: [],
    callPatterns: [
      /console\.(log|warn|error|info|debug|trace)\s*\(/g,
    ],
  },
  {
    name: "winston",
    importPatterns: [
      /(?:import|require)\s*.*['"]winston['"]/g,
    ],
    callPatterns: [
      /logger\.(log|info|warn|error|debug|verbose|silly)\s*\(/g,
      /winston\.(log|info|warn|error|debug)\s*\(/g,
    ],
  },
  {
    name: "pino",
    importPatterns: [
      /(?:import|require)\s*.*['"]pino['"]/g,
    ],
    callPatterns: [
      /logger\.(info|warn|error|debug|fatal|trace)\s*\(/g,
      /pino\(\)/g,
    ],
  },
  {
    name: "bunyan",
    importPatterns: [
      /(?:import|require)\s*.*['"]bunyan['"]/g,
    ],
    callPatterns: [
      /log\.(info|warn|error|debug|fatal|trace)\s*\(/g,
      /bunyan\.createLogger/g,
    ],
  },
  {
    name: "morgan",
    importPatterns: [
      /(?:import|require)\s*.*['"]morgan['"]/g,
    ],
    callPatterns: [
      /morgan\s*\(/g,
    ],
  },
];

// ── PII patterns in log arguments ───────────────────────────────────────

interface PiiPattern {
  pattern: RegExp;
  label: string;
}

const PII_LOG_PATTERNS: PiiPattern[] = [
  { pattern: /\buser\.email\b/, label: "email" },
  { pattern: /\buser\.name\b/, label: "name" },
  { pattern: /\buser\.phone\b/, label: "phone" },
  { pattern: /\buser\.password\b/, label: "password" },
  { pattern: /\buser\.ssn\b/, label: "SSN" },
  { pattern: /\buser\.address\b/, label: "address" },
  { pattern: /\buser\.dob\b|\buser\.dateOfBirth\b|\buser\.birthDate\b/, label: "date of birth" },
  { pattern: /\buser\.creditCard\b|\buser\.cardNumber\b/, label: "credit card" },
  { pattern: /\breq\.body\.email\b/, label: "email" },
  { pattern: /\breq\.body\.password\b/, label: "password" },
  { pattern: /\breq\.body\.phone\b/, label: "phone" },
  { pattern: /\breq\.body\.ssn\b/, label: "SSN" },
  { pattern: /\breq\.body\.address\b/, label: "address" },
  { pattern: /\breq\.headers\[['"]authorization['"]\]/, label: "auth token" },
  { pattern: /\btoken\b.*\blog\b|\blog\b.*\btoken\b/, label: "token" },
  { pattern: /\bsecret\b.*\blog\b|\blog\b.*\bsecret\b/, label: "secret" },
  { pattern: /\bpassword\b.*(?:console|log|logger|print)\b|(?:console|log|logger|print)\b.*\bpassword\b/, label: "password" },
  { pattern: /JSON\.stringify\(\s*user\b/, label: "full user object" },
  { pattern: /JSON\.stringify\(\s*req\.body\b/, label: "full request body" },
];

export interface LoggingFinding {
  library: string;
  file: string;
  line: number;
  piiRisk: string | null;
  snippet: string;
}

export interface LoggingScanResult {
  /** All detected logging library usages */
  libraries: string[];
  /** Total number of log call sites found */
  totalLogCalls: number;
  /** Findings where PII may be logged */
  piiFindings: LoggingFinding[];
  /** All log findings (limited to first 100) */
  findings: LoggingFinding[];
}

/**
 * Scans source code files for logging practices and potential PII exposure.
 *
 * @param projectPath Absolute path to the project root
 * @param files Optional pre-walked file list (for reuse from main scanner)
 */
export function scanLogging(projectPath: string, files?: WalkedFile[]): LoggingScanResult {
  const sourceFiles = files ?? walkDirectory(projectPath, { extensions: SOURCE_EXTENSIONS, skipTests: true });

  const detectedLibraries = new Set<string>();
  const findings: LoggingFinding[] = [];
  const piiFindings: LoggingFinding[] = [];
  let totalLogCalls = 0;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file.fullPath, "utf-8");
    const lines = content.split("\n");

    // Check for library imports
    for (const lib of LOGGING_PATTERNS) {
      for (const importPattern of lib.importPatterns) {
        importPattern.lastIndex = 0;
        if (importPattern.test(content)) {
          detectedLibraries.add(lib.name);
        }
      }
    }

    // Check each line for log calls and PII risks
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const lib of LOGGING_PATTERNS) {
        for (const callPattern of lib.callPatterns) {
          callPattern.lastIndex = 0;
          if (callPattern.test(line)) {
            totalLogCalls++;
            detectedLibraries.add(lib.name);

            // Check for PII in the log statement (check current and next line for multi-line)
            const logContext = line + (i + 1 < lines.length ? " " + lines[i + 1] : "");
            let piiRisk: string | null = null;

            for (const pii of PII_LOG_PATTERNS) {
              if (pii.pattern.test(logContext)) {
                piiRisk = pii.label;
                break;
              }
            }

            const finding: LoggingFinding = {
              library: lib.name,
              file: file.relativePath,
              line: i + 1,
              piiRisk,
              snippet: line.trim().substring(0, 120),
            };

            if (findings.length < 100) {
              findings.push(finding);
            }

            if (piiRisk) {
              piiFindings.push(finding);
            }
          }
        }
      }
    }
  }

  return {
    libraries: Array.from(detectedLibraries).sort(),
    totalLogCalls,
    piiFindings,
    findings,
  };
}

/**
 * Generates a markdown section summarizing logging scan findings,
 * suitable for inclusion in the security assessment.
 */
export function generateLoggingAssessment(result: LoggingScanResult): string | null {
  if (result.libraries.length === 0 && result.totalLogCalls === 0) return null;

  const sections: string[] = [];

  sections.push("## Logging Practices Assessment");
  sections.push("");

  // Libraries detected
  if (result.libraries.length > 0) {
    sections.push("### Detected Logging Libraries");
    sections.push("");
    for (const lib of result.libraries) {
      sections.push(`- ${lib}`);
    }
    sections.push("");
  }

  sections.push(`**Total log call sites detected:** ${result.totalLogCalls}`);
  sections.push("");

  // PII risks
  if (result.piiFindings.length > 0) {
    sections.push("### Potential PII Logging Risks");
    sections.push("");
    sections.push(
      "The following log statements may output personally identifiable information (PII). " +
        "Logging PII creates compliance risks under GDPR, CCPA, and similar regulations."
    );
    sections.push("");
    sections.push("| File | Line | Risk | Snippet |");
    sections.push("| --- | --- | --- | --- |");
    for (const finding of result.piiFindings.slice(0, 25)) {
      const snippet = finding.snippet.replace(/\|/g, "\\|");
      sections.push(`| ${finding.file} | ${finding.line} | ${finding.piiRisk} | \`${snippet}\` |`);
    }
    if (result.piiFindings.length > 25) {
      sections.push("");
      sections.push(`*... and ${result.piiFindings.length - 25} more findings.*`);
    }
    sections.push("");

    sections.push("### Recommendations");
    sections.push("");
    sections.push("- Implement a structured logging library with PII redaction filters");
    sections.push("- Use allowlists instead of blocklists for determining what data can be logged");
    sections.push("- Never log passwords, tokens, API keys, or full request bodies");
    sections.push("- Configure log levels appropriately for production (warn/error only)");
    sections.push("- Implement log rotation and retention policies");
    sections.push("- Consider using a centralized logging service with access controls");
  } else if (result.totalLogCalls > 0) {
    sections.push(
      "No potential PII logging risks were detected in the scanned log statements. " +
        "Continue to follow best practices for secure logging."
    );
  }

  return sections.join("\n");
}
