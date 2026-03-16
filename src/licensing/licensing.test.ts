import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  checkLicense,
  hasFeatureAccess,
  getUpgradeHint,
  trackFeatureUsage,
  loadUsage,
  saveUsage,
  resetUsage,
  getFeatureUsageCount,
  checkAndTrackFeature,
  requiredTier,
  isProFeature,
  isTeamFeature,
  type LicenseInfo,
  type LicensedFeature,
} from "./index.js";

const USAGE_DIR = path.join(os.homedir(), ".codepliant");
const USAGE_FILE = path.join(USAGE_DIR, "usage.json");

// Save and restore usage between tests
let savedUsage: string | null = null;

function backupUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      savedUsage = fs.readFileSync(USAGE_FILE, "utf-8");
    }
  } catch { /* ignore */ }
}

function restoreUsage() {
  try {
    if (savedUsage !== null) {
      fs.writeFileSync(USAGE_FILE, savedUsage, "utf-8");
    } else if (fs.existsSync(USAGE_FILE)) {
      fs.unlinkSync(USAGE_FILE);
    }
  } catch { /* ignore */ }
}

describe("licensing", () => {
  it("free tier when no key", () => {
    const license = checkLicense(undefined);
    assert.equal(license.tier, "free");
    assert.equal(license.valid, true);
    assert.equal(license.key, null);
  });

  it("pro tier with pro key", () => {
    const license = checkLicense("pro_testkey123");
    assert.equal(license.tier, "pro");
  });

  it("team tier with team key", () => {
    const license = checkLicense("team_orgkey456");
    assert.equal(license.tier, "team");
  });

  it("hasFeatureAccess returns false for free user on pro feature", () => {
    const license: LicenseInfo = { tier: "free", valid: true, key: null };
    assert.equal(hasFeatureAccess(license, "compliance-api"), false);
  });

  it("hasFeatureAccess returns true for pro user on pro feature", () => {
    const license: LicenseInfo = { tier: "pro", valid: true, key: "pro_x" };
    assert.equal(hasFeatureAccess(license, "compliance-api"), true);
  });

  it("hasFeatureAccess returns true for team user on pro feature", () => {
    const license: LicenseInfo = { tier: "team", valid: true, key: "team_x" };
    assert.equal(hasFeatureAccess(license, "executive-summary"), true);
  });

  it("requiredTier returns correct values for new features", () => {
    assert.equal(requiredTier("compliance-api"), "pro");
    assert.equal(requiredTier("executive-summary"), "pro");
    assert.equal(requiredTier("scheduled-scans"), "pro");
    assert.equal(requiredTier("scan-all"), "team");
  });

  it("isProFeature and isTeamFeature work for new features", () => {
    assert.equal(isProFeature("compliance-api"), true);
    assert.equal(isProFeature("executive-summary"), true);
    assert.equal(isProFeature("scheduled-scans"), true);
    assert.equal(isTeamFeature("scan-all"), true);
    assert.equal(isTeamFeature("compliance-api"), false);
  });
});

describe("feature usage tracking", () => {
  beforeEach(() => {
    backupUsage();
    resetUsage();
  });

  it("trackFeatureUsage increments count", () => {
    const count1 = trackFeatureUsage("compliance-api");
    assert.equal(count1, 1);

    const count2 = trackFeatureUsage("compliance-api");
    assert.equal(count2, 2);

    const count3 = trackFeatureUsage("compliance-api");
    assert.equal(count3, 3);

    restoreUsage();
  });

  it("loadUsage returns saved data", () => {
    trackFeatureUsage("executive-summary");
    trackFeatureUsage("executive-summary");

    const usage = loadUsage();
    assert.equal(usage["executive-summary"], 2);

    restoreUsage();
  });

  it("getFeatureUsageCount returns 0 for unused features", () => {
    const count = getFeatureUsageCount("compliance-api");
    assert.equal(count, 0);

    restoreUsage();
  });

  it("resetUsage clears all counts", () => {
    trackFeatureUsage("compliance-api");
    trackFeatureUsage("executive-summary");
    resetUsage();

    const usage = loadUsage();
    assert.equal(Object.keys(usage).length, 0);

    restoreUsage();
  });

  it("getUpgradeHint returns null when user has access", () => {
    const license: LicenseInfo = { tier: "pro", valid: true, key: "pro_x" };
    const hint = getUpgradeHint(license, "compliance-api");
    assert.equal(hint, null);

    restoreUsage();
  });

  it("getUpgradeHint returns basic hint below threshold", () => {
    const license: LicenseInfo = { tier: "free", valid: true, key: null };
    const hint = getUpgradeHint(license, "compliance-api");
    assert.ok(hint);
    assert.ok(hint.includes("Pro feature"));

    restoreUsage();
  });

  it("getUpgradeHint includes usage count at threshold", () => {
    const license: LicenseInfo = { tier: "free", valid: true, key: null };

    // Track 3 times to reach threshold
    trackFeatureUsage("all-output-formats");
    trackFeatureUsage("all-output-formats");
    trackFeatureUsage("all-output-formats");

    const hint = getUpgradeHint(license, "all-output-formats");
    assert.ok(hint);
    assert.ok(hint.includes("3 times"));
    assert.ok(hint.includes("HTML export"));

    restoreUsage();
  });

  it("checkAndTrackFeature returns null for pro user", () => {
    const license: LicenseInfo = { tier: "pro", valid: true, key: "pro_x" };
    const hint = checkAndTrackFeature(license, "compliance-api");
    assert.equal(hint, null);

    restoreUsage();
  });

  it("checkAndTrackFeature tracks and returns hint for free user", () => {
    const license: LicenseInfo = { tier: "free", valid: true, key: null };
    const hint = checkAndTrackFeature(license, "compliance-api");
    assert.ok(hint);

    const count = getFeatureUsageCount("compliance-api");
    assert.equal(count, 1);

    restoreUsage();
  });
});
