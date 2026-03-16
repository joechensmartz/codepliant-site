/**
 * Codepliant License Checking System
 *
 * Tiers:
 *   FREE  — CLI scanning + markdown output + up to 5 document types
 *   PRO   — All output formats + all document types + watch mode + API server
 *   TEAM  — scan-all + generate-all + webhook notifications
 *
 * License key is read from:
 *   1. CODEPLIANT_LICENSE_KEY env var
 *   2. licenseKey field in .codepliantrc.json (passed via config)
 *
 * Current behavior: graceful degradation — nothing is blocked, upgrade hints only.
 */

export type LicenseTier = "free" | "pro" | "team";

export interface LicenseInfo {
  tier: LicenseTier;
  valid: boolean;
  key: string | null;
}

export type ProFeature =
  | "notion-export"
  | "confluence-export"
  | "cookie-banner"
  | "compliance-report"
  | "api-server"
  | "watch-mode"
  | "all-output-formats"
  | "unlimited-doc-types";

export type TeamFeature =
  | "scan-all"
  | "generate-all"
  | "webhook-notifications";

export type LicensedFeature = ProFeature | TeamFeature;

const PRO_FEATURES = new Set<LicensedFeature>([
  "notion-export",
  "confluence-export",
  "cookie-banner",
  "compliance-report",
  "api-server",
  "watch-mode",
  "all-output-formats",
  "unlimited-doc-types",
]);

const TEAM_FEATURES = new Set<LicensedFeature>([
  "scan-all",
  "generate-all",
  "webhook-notifications",
]);

/** Maximum document types on the free tier. */
export const FREE_DOC_TYPE_LIMIT = 5;

const PRICING_URL = "https://codepliant.dev/pricing";

/**
 * Resolve the license key from environment or config.
 */
function resolveKey(configKey?: string): string | null {
  return process.env.CODEPLIANT_LICENSE_KEY || configKey || null;
}

/**
 * Determine the tier for a given key.
 *
 * For now this is a stub — any key starting with "team_" is Team,
 * any other non-empty key is Pro, and no key is Free.
 * Future: validate against a server or signed token.
 */
function tierFromKey(key: string | null): LicenseTier {
  if (!key) return "free";
  if (key.startsWith("team_")) return "team";
  return "pro";
}

/**
 * Check the current license and return full info.
 */
export function checkLicense(configKey?: string): LicenseInfo {
  const key = resolveKey(configKey);
  const tier = tierFromKey(key);
  return {
    tier,
    valid: true, // graceful degradation — always valid for now
    key,
  };
}

/**
 * Convenience alias for checkLicense.
 */
export function getLicenseInfo(configKey?: string): LicenseInfo {
  return checkLicense(configKey);
}

/**
 * Returns true if the given feature requires at least Pro.
 */
export function isProFeature(feature: LicensedFeature): boolean {
  return PRO_FEATURES.has(feature);
}

/**
 * Returns true if the given feature requires Team.
 */
export function isTeamFeature(feature: LicensedFeature): boolean {
  return TEAM_FEATURES.has(feature);
}

/**
 * Returns the minimum tier required for a feature.
 */
export function requiredTier(feature: LicensedFeature): LicenseTier {
  if (TEAM_FEATURES.has(feature)) return "team";
  if (PRO_FEATURES.has(feature)) return "pro";
  return "free";
}

/**
 * Check whether the current license covers a feature.
 * Tier hierarchy: team > pro > free.
 */
export function hasFeatureAccess(
  license: LicenseInfo,
  feature: LicensedFeature,
): boolean {
  const tierRank: Record<LicenseTier, number> = { free: 0, pro: 1, team: 2 };
  const needed = requiredTier(feature);
  return tierRank[license.tier] >= tierRank[needed];
}

/**
 * Build a human-readable upgrade hint for a feature.
 * Returns null if the user already has access.
 */
export function getUpgradeHint(
  license: LicenseInfo,
  feature: LicensedFeature,
): string | null {
  if (hasFeatureAccess(license, feature)) return null;

  const needed = requiredTier(feature);
  const tierLabel = needed.charAt(0).toUpperCase() + needed.slice(1);
  return `This is a ${tierLabel} feature. Get your key at ${PRICING_URL}`;
}

/**
 * The URL to show for the `codepliant upgrade` command.
 */
export const UPGRADE_URL = PRICING_URL;
