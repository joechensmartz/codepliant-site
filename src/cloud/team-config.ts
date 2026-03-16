/**
 * Shared Team Configuration
 *
 * Manages org-level defaults via .codepliant/team-config.json that
 * individual project .codepliantrc.json files can override.
 *
 * Hierarchy: team-config.json < .codepliantrc.json (project wins)
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ────────────────────────────────────────────────────────────

/**
 * Team-level configuration — org-wide defaults.
 * Same shape as CodepliantConfig but all fields are optional.
 */
export interface TeamConfig {
  companyName?: string;
  contactEmail?: string;
  website?: string;
  jurisdiction?: string;
  jurisdictions?: string[];
  outputDir?: string;
  dpoName?: string;
  dpoEmail?: string;
  euRepresentative?: string;
  dataRetentionDays?: number;
  aiRiskLevel?: "minimal" | "limited" | "high";
  companyLocation?: string;
  securityEmail?: string;
  bugBountyUrl?: string;
  language?: string;
  plugins?: string[];
  generateEmployeeNotice?: boolean;
  webhookUrl?: string;
}

// ── Paths ────────────────────────────────────────────────────────────

const TEAM_CONFIG_DIR = ".codepliant";
const TEAM_CONFIG_FILENAME = "team-config.json";

/**
 * Resolve the team config path. Searches upward from startDir
 * looking for a .codepliant/team-config.json directory.
 */
export function findTeamConfigPath(startDir: string): string | null {
  let current = path.resolve(startDir);
  const root = path.parse(current).root;

  while (current !== root) {
    const candidate = path.join(current, TEAM_CONFIG_DIR, TEAM_CONFIG_FILENAME);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    current = path.dirname(current);
  }

  return null;
}

// ── Read ─────────────────────────────────────────────────────────────

/**
 * Load team config from .codepliant/team-config.json.
 * Returns null if not found.
 */
export function loadTeamConfig(startDir: string): TeamConfig | null {
  const configPath = findTeamConfigPath(startDir);
  if (!configPath) return null;

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as TeamConfig;
  } catch {
    return null;
  }
}

// ── Merge ────────────────────────────────────────────────────────────

/**
 * Merge team config with project config.
 * Project config values take precedence (non-undefined fields win).
 */
export function mergeConfigs<T extends Record<string, unknown>>(
  teamConfig: TeamConfig,
  projectConfig: T,
): T {
  const merged = { ...teamConfig } as Record<string, unknown>;

  for (const [key, value] of Object.entries(projectConfig)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }

  return merged as T;
}

// ── Init Command ─────────────────────────────────────────────────────

const DEFAULT_TEAM_CONFIG: TeamConfig = {
  companyName: "[Your Company Name]",
  contactEmail: "[your-email@example.com]",
  jurisdiction: "GDPR",
  outputDir: "legal",
  language: "en",
};

/**
 * Handle `codepliant team-config init` — create a .codepliant/team-config.json
 * in the current directory with sensible defaults.
 */
export function handleTeamConfigInit(targetDir: string): void {
  const dirPath = path.join(targetDir, TEAM_CONFIG_DIR);
  const filePath = path.join(dirPath, TEAM_CONFIG_FILENAME);

  if (fs.existsSync(filePath)) {
    console.log(`\n  Team config already exists: ${filePath}`);
    console.log("  Edit it directly to update org-level defaults.\n");
    return;
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(DEFAULT_TEAM_CONFIG, null, 2) + "\n", "utf-8");

  console.log(`\n  Created team config: ${filePath}`);
  console.log("");
  console.log("  This file defines org-level defaults that apply to all projects");
  console.log("  under this directory. Individual .codepliantrc.json files in each");
  console.log("  project will override these values.");
  console.log("");
  console.log("  Next steps:");
  console.log("    1. Edit the team config with your organization details");
  console.log("    2. Commit .codepliant/team-config.json to your repo");
  console.log("    3. Run codepliant in any sub-project to use the merged config\n");
}
