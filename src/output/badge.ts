import * as fs from "fs";
import * as path from "path";
import type { ScanResult, ComplianceNeed } from "../scanner/index.js";

/**
 * Badge color thresholds and values.
 */
function scoreColor(score: number): string {
  if (score >= 80) return "#4c1";       // green
  if (score >= 60) return "#dfb317";    // yellow
  return "#e05d44";                     // red
}

/**
 * Status text and color derived from score.
 */
function statusFromScore(score: number): { text: string; color: string } {
  if (score >= 80) return { text: "compliant", color: "#4c1" };
  if (score >= 60) return { text: "needs attention", color: "#dfb317" };
  return { text: "non-compliant", color: "#e05d44" };
}

/**
 * Compute compliance score from scan result and existing docs on disk.
 * Mirrors the logic in cli.ts.
 */
function computeScore(scanResult: ScanResult, outputDir: string): number {
  if (scanResult.complianceNeeds.length === 0) return 100;

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": [
      "DATA_PROCESSING_AGREEMENT.md",
      "DATA_PROCESSING_AGREEMENT.html",
    ],
  };

  function docExists(docName: string): boolean {
    const filenames = docFileMap[docName] || [];
    return filenames.some((f) => fs.existsSync(path.join(outputDir, f)));
  }

  let score = 0;
  let total = 0;

  for (const need of scanResult.complianceNeeds) {
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;
    if (docExists(need.document)) score += weight;
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

/**
 * Measure approximate text width in the badge SVG.
 * Uses a rough heuristic: ~6.5px per character at 11px font.
 */
function textWidth(text: string): number {
  return Math.round(text.length * 6.5 + 10);
}

/**
 * Generate a shields.io-compatible flat-style SVG badge.
 */
function renderBadgeSvg(label: string, value: string, color: string): string {
  const labelW = textWidth(label);
  const valueW = textWidth(value);
  const totalW = labelW + valueW;
  const labelX = Math.round(labelW / 2) * 10;
  const valueX = Math.round(labelW + valueW / 2) * 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalW}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelW}" height="20" fill="#555"/>
    <rect x="${labelW}" width="${valueW}" height="20" fill="${color}"/>
    <rect width="${totalW}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelW - 10) * 10}">${label}</text>
    <text x="${labelX}" y="140" transform="scale(.1)" fill="#fff" textLength="${(labelW - 10) * 10}">${label}</text>
    <text aria-hidden="true" x="${valueX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueW - 10) * 10}">${value}</text>
    <text x="${valueX}" y="140" transform="scale(.1)" fill="#fff" textLength="${(valueW - 10) * 10}">${value}</text>
  </g>
</svg>`;
}

export interface BadgeResult {
  scoreSvg: string;
  statusSvg: string;
}

/**
 * Generate compliance badge SVGs from a scan result.
 *
 * @param scanResult - The result of scanning a project
 * @param outputDir - The output directory where compliance docs live (used to check existence)
 * @returns Object containing SVG strings for score and status badges
 */
export function generateBadge(
  scanResult: ScanResult,
  outputDir: string
): BadgeResult {
  const score = computeScore(scanResult, outputDir);
  const color = scoreColor(score);
  const status = statusFromScore(score);

  return {
    scoreSvg: renderBadgeSvg("compliance", `${score}%`, color),
    statusSvg: renderBadgeSvg("compliance", status.text, status.color),
  };
}

/**
 * Write badge SVGs to the badges subdirectory.
 *
 * @returns List of written file paths
 */
export function writeBadges(
  scanResult: ScanResult,
  outputDir: string
): string[] {
  const badgeDir = path.join(outputDir, "badges");
  if (!fs.existsSync(badgeDir)) {
    fs.mkdirSync(badgeDir, { recursive: true });
  }

  const { scoreSvg, statusSvg } = generateBadge(scanResult, outputDir);

  const scorePath = path.join(badgeDir, "compliance-score.svg");
  const statusPath = path.join(badgeDir, "compliance-status.svg");

  fs.writeFileSync(scorePath, scoreSvg, "utf-8");
  fs.writeFileSync(statusPath, statusSvg, "utf-8");

  return [scorePath, statusPath];
}
