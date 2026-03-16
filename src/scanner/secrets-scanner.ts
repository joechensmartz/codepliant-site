import * as fs from "fs";
import * as path from "path";
import { walkDirectory, ALL_EXTENSIONS, type WalkedFile } from "./file-walker.js";
import type { SecurityRisk, RiskSeverity } from "./env-audit.js";

// ── Types ──────────────────────────────────────────────────────────────────

export interface SecretFinding {
  severity: RiskSeverity;
  pattern: string;
  file: string;
  line: number;
  /** Redacted snippet showing context but not the actual secret */
  snippet: string;
}

export interface SecretsAuditResult {
  findings: SecretFinding[];
  risks: SecurityRisk[];
}

// ── Secret patterns ────────────────────────────────────────────────────────

interface SecretPattern {
  name: string;
  /** Regex to match the secret. Should have at least one capture group. */
  regex: RegExp;
  severity: RiskSeverity;
}

const SECRET_PATTERNS: SecretPattern[] = [
  // OpenAI API keys
  {
    name: "OpenAI API Key",
    regex: /(?:^|["'`\s=])(?:sk-[a-zA-Z0-9]{20,})/,
    severity: "high",
  },
  // GitHub personal access tokens
  {
    name: "GitHub Personal Access Token",
    regex: /(?:^|["'`\s=])(ghp_[a-zA-Z0-9]{36})/,
    severity: "high",
  },
  // GitHub OAuth access tokens
  {
    name: "GitHub OAuth Access Token",
    regex: /(?:^|["'`\s=])(gho_[a-zA-Z0-9]{36})/,
    severity: "high",
  },
  // GitHub fine-grained tokens
  {
    name: "GitHub Fine-Grained Token",
    regex: /(?:^|["'`\s=])(github_pat_[a-zA-Z0-9_]{22,})/,
    severity: "high",
  },
  // AWS Access Key IDs
  {
    name: "AWS Access Key ID",
    regex: /(?:^|["'`\s=])(AKIA[0-9A-Z]{16})/,
    severity: "high",
  },
  // Stripe secret keys
  {
    name: "Stripe Secret Key",
    regex: /(?:^|["'`\s=])(sk_live_[a-zA-Z0-9]{24,})/,
    severity: "high",
  },
  // Stripe restricted keys
  {
    name: "Stripe Restricted Key",
    regex: /(?:^|["'`\s=])(rk_live_[a-zA-Z0-9]{24,})/,
    severity: "high",
  },
  // Bearer tokens in code
  {
    name: "Hardcoded Bearer Token",
    regex: /["'`]Bearer\s+[a-zA-Z0-9._\-]{20,}["'`]/,
    severity: "high",
  },
  // Slack tokens
  {
    name: "Slack Token",
    regex: /(?:^|["'`\s=])(xox[bpors]-[a-zA-Z0-9\-]{10,})/,
    severity: "high",
  },
  // Twilio Account SID
  {
    name: "Twilio Account SID",
    regex: /(?:^|["'`\s=])(AC[a-f0-9]{32})/,
    severity: "medium",
  },
  // SendGrid API Key
  {
    name: "SendGrid API Key",
    regex: /(?:^|["'`\s=])(SG\.[a-zA-Z0-9_\-]{22}\.[a-zA-Z0-9_\-]{43})/,
    severity: "high",
  },
  // Hardcoded password assignments
  {
    name: "Hardcoded Password",
    regex: /(?:password|passwd|pwd)\s*[:=]\s*["'`](?![\s<{$])[^"'`]{8,}["'`]/i,
    severity: "high",
  },
  // Hardcoded secret assignments
  {
    name: "Hardcoded Secret",
    regex: /(?:secret|api_key|apikey|api_secret|access_token)\s*[:=]\s*["'`](?![\s<{$])[^"'`]{8,}["'`]/i,
    severity: "high",
  },
  // Private keys (PEM)
  {
    name: "Private Key (PEM)",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
    severity: "high",
  },
  // Anthropic API Key
  {
    name: "Anthropic API Key",
    regex: /(?:^|["'`\s=])(sk-ant-[a-zA-Z0-9\-]{20,})/,
    severity: "high",
  },
  // Google API Key
  {
    name: "Google API Key",
    regex: /(?:^|["'`\s=])(AIza[0-9A-Za-z_\-]{35})/,
    severity: "high",
  },
  // Mailgun API Key
  {
    name: "Mailgun API Key",
    regex: /(?:^|["'`\s=])(key-[a-f0-9]{32})/,
    severity: "high",
  },
];

// ── Files to skip ──────────────────────────────────────────────────────────

const SKIP_FILE_PATTERNS = [
  /\.env\.example$/,
  /\.env\.sample$/,
  /\.env\.template$/,
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\.min\.js$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /node_modules/,
  /dist\//,
  /\.git\//,
  /CHANGELOG/i,
];

const SOURCE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".rb", ".go", ".java", ".cs", ".php",
  ".rs", ".ex", ".exs", ".yaml", ".yml", ".json",
  ".toml", ".cfg", ".conf", ".ini", ".xml",
  ".sh", ".bash", ".zsh", ".env",
]);

// ── Scanner ────────────────────────────────────────────────────────────────

function shouldSkipFile(relativePath: string): boolean {
  return SKIP_FILE_PATTERNS.some((p) => p.test(relativePath));
}

function redactSecret(line: string): string {
  // Replace any string that looks like a secret value with [REDACTED]
  return line.replace(/["'`][a-zA-Z0-9._\-/+=]{12,}["'`]/g, '"[REDACTED]"');
}

export function scanSecrets(projectPath: string): SecretsAuditResult {
  const absPath = path.resolve(projectPath);
  const findings: SecretFinding[] = [];

  // Walk source files
  const files = walkDirectory(absPath, { extensions: ALL_EXTENSIONS, skipTests: false });

  for (const file of files) {
    if (shouldSkipFile(file.relativePath)) continue;

    const ext = path.extname(file.relativePath).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(ext)) continue;

    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("*")) continue;

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(line)) {
          findings.push({
            severity: pattern.severity,
            pattern: pattern.name,
            file: file.relativePath,
            line: lineIdx + 1,
            snippet: redactSecret(trimmed.length > 120 ? trimmed.slice(0, 120) + "..." : trimmed),
          });
          break; // One finding per line is enough
        }
      }
    }
  }

  // Derive risks from findings
  const risks: SecurityRisk[] = [];

  const highFindings = findings.filter((f) => f.severity === "high");
  if (highFindings.length > 0) {
    const uniquePatterns = [...new Set(highFindings.map((f) => f.pattern))];
    risks.push({
      severity: "high",
      message: `${highFindings.length} hardcoded secret(s) detected in source code: ${uniquePatterns.join(", ")}. Move these to environment variables immediately.`,
    });
  }

  const mediumFindings = findings.filter((f) => f.severity === "medium");
  if (mediumFindings.length > 0) {
    risks.push({
      severity: "medium",
      message: `${mediumFindings.length} potentially sensitive value(s) found in source code. Review and consider moving to environment variables.`,
    });
  }

  if (findings.length > 0) {
    risks.push({
      severity: "high",
      message: "Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.",
    });
  }

  return { findings, risks };
}

// ── ENV_AUDIT.md integration ───────────────────────────────────────────────

const SEVERITY_ICONS: Record<RiskSeverity, string> = {
  high: "CRITICAL",
  medium: "WARNING",
  low: "INFO",
};

export function generateSecretsAuditSection(projectPath: string): string {
  const { findings, risks } = scanSecrets(projectPath);

  if (findings.length === 0) {
    return "";
  }

  const lines: string[] = [];

  lines.push("## Hardcoded Secrets Detected");
  lines.push("");
  lines.push(
    `> **${findings.length} potential secret(s)** found in source code. These should be moved to environment variables.`
  );
  lines.push("");

  if (risks.length > 0) {
    for (const risk of risks) {
      lines.push(`- **[${SEVERITY_ICONS[risk.severity]}]** ${risk.message}`);
    }
    lines.push("");
  }

  lines.push("| Severity | Type | File | Line | Snippet |");
  lines.push("|----------|------|------|------|---------|");
  for (const finding of findings) {
    const severity = finding.severity.toUpperCase();
    const snippet = finding.snippet.replace(/\|/g, "\\|");
    lines.push(
      `| ${severity} | ${finding.pattern} | \`${finding.file}\` | ${finding.line} | \`${snippet}\` |`
    );
  }
  lines.push("");

  lines.push("### Remediation Steps");
  lines.push("");
  lines.push("1. Move all secrets to environment variables (`.env.local` or your secrets manager)");
  lines.push("2. Rotate any credentials that have been committed to version control");
  lines.push("3. Add `.env` and `.env.local` to `.gitignore`");
  lines.push("4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)");
  lines.push("5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history");
  lines.push("");

  return lines.join("\n");
}
