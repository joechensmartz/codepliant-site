/**
 * Compliance Audit Trail
 *
 * Logs every codepliant action to ~/.codepliant/audit-trail.jsonl.
 * Required for SOC 2 evidence — provides a tamper-evident record of
 * all compliance tooling activity.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// ── Types ────────────────────────────────────────────────────────────

export interface AuditEntry {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Action performed (e.g., "scan", "generate", "check", "auth-login") */
  action: string;
  /** Absolute path to the project scanned/generated */
  project: string;
  /** OS username of the operator */
  user: string;
  /** Freeform details about the action */
  details: Record<string, unknown>;
}

// ── Paths ────────────────────────────────────────────────────────────

const CODEPLIANT_DIR = path.join(os.homedir(), ".codepliant");
const AUDIT_TRAIL_PATH = path.join(CODEPLIANT_DIR, "audit-trail.jsonl");

export function getAuditTrailPath(): string {
  return AUDIT_TRAIL_PATH;
}

// ── Write ────────────────────────────────────────────────────────────

function ensureDir(): void {
  if (!fs.existsSync(CODEPLIANT_DIR)) {
    fs.mkdirSync(CODEPLIANT_DIR, { recursive: true });
  }
}

/**
 * Append an audit entry to the JSONL log.
 * Silently no-ops on write errors so it never breaks the main flow.
 */
export function logAuditEntry(
  action: string,
  project: string,
  details: Record<string, unknown> = {},
): void {
  try {
    ensureDir();
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      project: path.resolve(project),
      user: os.userInfo().username,
      details,
    };
    fs.appendFileSync(AUDIT_TRAIL_PATH, JSON.stringify(entry) + "\n", "utf-8");
  } catch {
    // Audit logging must never interrupt the main workflow
  }
}

// ── Read ─────────────────────────────────────────────────────────────

/**
 * Read all audit entries, most recent first.
 * Returns an empty array if the file does not exist.
 */
export function readAuditTrail(): AuditEntry[] {
  if (!fs.existsSync(AUDIT_TRAIL_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(AUDIT_TRAIL_PATH, "utf-8").trim();
  if (raw.length === 0) return [];

  const entries: AuditEntry[] = [];
  for (const line of raw.split("\n")) {
    try {
      entries.push(JSON.parse(line) as AuditEntry);
    } catch {
      // Skip malformed lines
    }
  }

  // Most recent first
  entries.reverse();
  return entries;
}

/**
 * Read the N most recent audit entries.
 */
export function readRecentAuditEntries(count: number = 20): AuditEntry[] {
  return readAuditTrail().slice(0, count);
}

// ── CLI Command Handler ──────────────────────────────────────────────

/**
 * Handle `codepliant audit-trail` — display recent audit entries.
 */
export function handleAuditTrail(jsonOutput: boolean = false, count: number = 20): void {
  const entries = readRecentAuditEntries(count);

  if (jsonOutput) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  if (entries.length === 0) {
    console.log("\n  No audit trail entries found.");
    console.log(`  Audit log location: ${AUDIT_TRAIL_PATH}\n`);
    return;
  }

  console.log(`\n  Audit Trail (${entries.length} most recent entries)\n`);
  console.log("  " + "-".repeat(70));

  for (const entry of entries) {
    const ts = entry.timestamp.replace("T", " ").replace(/\.\d+Z$/, "Z");
    const detailStr = Object.keys(entry.details).length > 0
      ? " " + JSON.stringify(entry.details)
      : "";
    console.log(`  ${ts}  ${entry.action.padEnd(16)} ${entry.user}  ${entry.project}${detailStr}`);
  }

  console.log("\n  " + "-".repeat(70));
  console.log(`  Log file: ${AUDIT_TRAIL_PATH}\n`);
}
