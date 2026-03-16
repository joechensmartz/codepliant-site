/**
 * Scheduled Compliance Scans
 *
 * `codepliant schedule` sets up periodic scans using OS-native
 * scheduling (launchd on macOS, cron on Linux).
 *
 * Supports daily, weekly, and monthly frequencies.
 * Optionally sends webhook notifications when compliance status changes.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { exec } from "child_process";

// ── Types ─────────────────────────────────────────────────────────

export type ScheduleFrequency = "daily" | "weekly" | "monthly";

export interface ScheduleOptions {
  projectPath: string;
  outputDir: string;
  frequency: ScheduleFrequency;
  webhookUrl?: string;
  /** Override the codepliant binary path (for testing) */
  binaryPath?: string;
}

export interface ScheduleResult {
  success: boolean;
  method: "launchd" | "cron";
  frequency: ScheduleFrequency;
  configPath: string;
  message: string;
}

export interface UnscheduleResult {
  success: boolean;
  method: "launchd" | "cron";
  message: string;
}

export interface ScheduleStatus {
  scheduled: boolean;
  method: "launchd" | "cron" | null;
  frequency: ScheduleFrequency | null;
  configPath: string | null;
}

// ── Constants ─────────────────────────────────────────────────────

const LAUNCHD_LABEL = "dev.codepliant.scheduled-scan";
const LAUNCHD_DIR = path.join(os.homedir(), "Library", "LaunchAgents");
const LAUNCHD_PLIST = path.join(LAUNCHD_DIR, `${LAUNCHD_LABEL}.plist`);

const CRON_MARKER = "# codepliant-scheduled-scan";

// ── Helpers ───────────────────────────────────────────────────────

function findBinary(override?: string): string {
  if (override) return override;

  // Try to find the codepliant binary
  const candidates = [
    path.join(process.cwd(), "node_modules", ".bin", "codepliant"),
    "npx codepliant",
  ];

  // If we're running from the project itself, use the dist path
  const distCli = path.join(__dirname, "..", "cli.js");
  if (fs.existsSync(distCli)) {
    return `node ${distCli}`;
  }

  return candidates[0];
}

function cronExpression(frequency: ScheduleFrequency): string {
  switch (frequency) {
    case "daily":
      return "0 8 * * *"; // 8 AM daily
    case "weekly":
      return "0 8 * * 1"; // 8 AM every Monday
    case "monthly":
      return "0 8 1 * *"; // 8 AM first of month
  }
}

function launchdInterval(frequency: ScheduleFrequency): number {
  switch (frequency) {
    case "daily":
      return 86400; // 24 hours
    case "weekly":
      return 604800; // 7 days
    case "monthly":
      return 2592000; // 30 days
  }
}

function buildCommand(options: ScheduleOptions): string {
  const binary = findBinary(options.binaryPath);
  const absProject = path.resolve(options.projectPath);
  const absOutput = path.resolve(options.outputDir);

  let cmd = `${binary} go "${absProject}" -o "${absOutput}" -q`;
  if (options.webhookUrl) {
    cmd += ` && ${binary} notify "${absProject}" -o "${absOutput}" -q`;
  }
  return cmd;
}

// ── Launchd (macOS) ───────────────────────────────────────────────

function generatePlist(options: ScheduleOptions): string {
  const command = buildCommand(options);
  const interval = launchdInterval(options.frequency);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCHD_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>-c</string>
    <string>${escapeXml(command)}</string>
  </array>
  <key>StartInterval</key>
  <integer>${interval}</integer>
  <key>RunAtLoad</key>
  <false/>
  <key>StandardOutPath</key>
  <string>${path.join(os.homedir(), ".codepliant", "schedule.log")}</string>
  <key>StandardErrorPath</key>
  <string>${path.join(os.homedir(), ".codepliant", "schedule-error.log")}</string>
</dict>
</plist>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function installLaunchd(options: ScheduleOptions): ScheduleResult {
  if (!fs.existsSync(LAUNCHD_DIR)) {
    fs.mkdirSync(LAUNCHD_DIR, { recursive: true });
  }

  const plist = generatePlist(options);
  fs.writeFileSync(LAUNCHD_PLIST, plist, "utf-8");

  // Load the launch agent
  exec(`launchctl load "${LAUNCHD_PLIST}"`, () => {
    // Ignore errors — the plist is still installed
  });

  return {
    success: true,
    method: "launchd",
    frequency: options.frequency,
    configPath: LAUNCHD_PLIST,
    message: `Scheduled ${options.frequency} scan via launchd. Config: ${LAUNCHD_PLIST}`,
  };
}

function uninstallLaunchd(): UnscheduleResult {
  if (!fs.existsSync(LAUNCHD_PLIST)) {
    return {
      success: false,
      method: "launchd",
      message: "No scheduled scan found (launchd plist does not exist).",
    };
  }

  exec(`launchctl unload "${LAUNCHD_PLIST}"`, () => {
    // Ignore errors
  });

  fs.unlinkSync(LAUNCHD_PLIST);

  return {
    success: true,
    method: "launchd",
    message: "Scheduled scan removed.",
  };
}

function getLaunchdStatus(): ScheduleStatus {
  if (!fs.existsSync(LAUNCHD_PLIST)) {
    return { scheduled: false, method: null, frequency: null, configPath: null };
  }

  // Try to determine frequency from the plist
  const content = fs.readFileSync(LAUNCHD_PLIST, "utf-8");
  let frequency: ScheduleFrequency = "daily";
  if (content.includes("<integer>604800</integer>")) frequency = "weekly";
  else if (content.includes("<integer>2592000</integer>")) frequency = "monthly";

  return {
    scheduled: true,
    method: "launchd",
    frequency,
    configPath: LAUNCHD_PLIST,
  };
}

// ── Cron (Linux) ──────────────────────────────────────────────────

function installCron(options: ScheduleOptions): ScheduleResult {
  const command = buildCommand(options);
  const cron = cronExpression(options.frequency);
  const cronLine = `${cron} ${command} ${CRON_MARKER}`;

  // Read existing crontab
  let existingCron = "";
  try {
    const { execSync } = require("child_process");
    existingCron = execSync("crontab -l 2>/dev/null", { encoding: "utf-8" });
  } catch {
    // No existing crontab
  }

  // Remove any existing codepliant cron entry
  const lines = existingCron.split("\n").filter(l => !l.includes(CRON_MARKER));
  lines.push(cronLine);

  const newCron = lines.filter(l => l.trim().length > 0).join("\n") + "\n";

  // Write temp file and install
  const tmpFile = path.join(os.tmpdir(), "codepliant-cron-tmp");
  fs.writeFileSync(tmpFile, newCron, "utf-8");

  try {
    const { execSync } = require("child_process");
    execSync(`crontab "${tmpFile}"`, { encoding: "utf-8" });
  } catch {
    return {
      success: false,
      method: "cron",
      frequency: options.frequency,
      configPath: "",
      message: "Failed to install crontab entry. Check cron permissions.",
    };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }

  return {
    success: true,
    method: "cron",
    frequency: options.frequency,
    configPath: "crontab",
    message: `Scheduled ${options.frequency} scan via cron: ${cron}`,
  };
}

function uninstallCron(): UnscheduleResult {
  let existingCron = "";
  try {
    const { execSync } = require("child_process");
    existingCron = execSync("crontab -l 2>/dev/null", { encoding: "utf-8" });
  } catch {
    return {
      success: false,
      method: "cron",
      message: "No crontab entries found.",
    };
  }

  if (!existingCron.includes(CRON_MARKER)) {
    return {
      success: false,
      method: "cron",
      message: "No scheduled scan found in crontab.",
    };
  }

  const lines = existingCron.split("\n").filter(l => !l.includes(CRON_MARKER));
  const newCron = lines.filter(l => l.trim().length > 0).join("\n") + "\n";

  const tmpFile = path.join(os.tmpdir(), "codepliant-cron-tmp");
  fs.writeFileSync(tmpFile, newCron, "utf-8");

  try {
    const { execSync } = require("child_process");
    execSync(`crontab "${tmpFile}"`, { encoding: "utf-8" });
  } catch {
    return {
      success: false,
      method: "cron",
      message: "Failed to update crontab.",
    };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }

  return {
    success: true,
    method: "cron",
    message: "Scheduled scan removed from crontab.",
  };
}

function getCronStatus(): ScheduleStatus {
  let existingCron = "";
  try {
    const { execSync } = require("child_process");
    existingCron = execSync("crontab -l 2>/dev/null", { encoding: "utf-8" });
  } catch {
    return { scheduled: false, method: null, frequency: null, configPath: null };
  }

  const line = existingCron.split("\n").find(l => l.includes(CRON_MARKER));
  if (!line) {
    return { scheduled: false, method: null, frequency: null, configPath: null };
  }

  // Determine frequency from cron expression
  let frequency: ScheduleFrequency = "daily";
  if (line.startsWith("0 8 * * 1")) frequency = "weekly";
  else if (line.startsWith("0 8 1 * *")) frequency = "monthly";

  return {
    scheduled: true,
    method: "cron",
    frequency,
    configPath: "crontab",
  };
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Install a scheduled compliance scan.
 * Uses launchd on macOS and cron on Linux.
 */
export function scheduleScans(options: ScheduleOptions): ScheduleResult {
  const platform = os.platform();
  if (platform === "darwin") {
    return installLaunchd(options);
  }
  return installCron(options);
}

/**
 * Remove the scheduled compliance scan.
 */
export function unscheduleScans(): UnscheduleResult {
  const platform = os.platform();
  if (platform === "darwin") {
    return uninstallLaunchd();
  }
  return uninstallCron();
}

/**
 * Get the current schedule status.
 */
export function getScheduleStatus(): ScheduleStatus {
  const platform = os.platform();
  if (platform === "darwin") {
    return getLaunchdStatus();
  }
  return getCronStatus();
}

/**
 * Get a human-readable description of the schedule frequency.
 */
export function frequencyDescription(frequency: ScheduleFrequency): string {
  switch (frequency) {
    case "daily":
      return "every day at 8:00 AM";
    case "weekly":
      return "every Monday at 8:00 AM";
    case "monthly":
      return "on the 1st of every month at 8:00 AM";
  }
}
