import * as fs from "fs";
import * as path from "path";
import type { ScanResult, ComplianceNeed } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface ScoreComponent {
  name: string;
  score: number;
  maxPoints: number;
  details: string[];
}

export interface ComplianceScore {
  /** Total score 0-100 */
  total: number;
  /** Letter grade */
  grade: Grade;
  /** Individual component breakdowns */
  components: ScoreComponent[];
  /** ISO timestamp of when the score was computed */
  computedAt: string;
}

export interface ScoreInput {
  scanResult: ScanResult;
  docs: GeneratedDocument[];
  config?: CodepliantConfig;
  outputDir: string;
  /** Override "now" for deterministic testing */
  now?: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Required document names that feed into completeness scoring. */
const REQUIRED_DOCS: Record<string, string[]> = {
  "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
  "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
  "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
  "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
  "Data Processing Agreement": [
    "DATA_PROCESSING_AGREEMENT.md",
    "DATA_PROCESSING_AGREEMENT.html",
  ],
  "Security Policy": ["SECURITY.md"],
  "Incident Response Plan": ["INCIDENT_RESPONSE_PLAN.md"],
};

const PLACEHOLDER_PATTERNS = [
  /^\[.*\]$/,
  /^your[- ]/i,
  /example\.com$/i,
  /^TODO/i,
  /^CHANGEME/i,
  /^PLACEHOLDER/i,
];

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

/** 30 days in milliseconds */
const FRESHNESS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Component scorers
// ---------------------------------------------------------------------------

/**
 * Document Completeness (40 points).
 * Ratio of generated/existing required docs to total required docs
 * (based on compliance needs from the scan).
 */
function scoreDocumentCompleteness(input: ScoreInput): ScoreComponent {
  const maxPoints = 40;
  const { scanResult, docs, outputDir } = input;

  const generatedNames = new Set(docs.map((d) => d.name));

  // Determine which documents are required for this project
  const neededDocs = scanResult.complianceNeeds.map((n) => n.document);
  // Deduplicate
  const uniqueNeeded = [...new Set(neededDocs)];

  if (uniqueNeeded.length === 0) {
    return {
      name: "Document Completeness",
      score: maxPoints,
      maxPoints,
      details: ["No compliance documents required"],
    };
  }

  let found = 0;
  const details: string[] = [];

  for (const docName of uniqueNeeded) {
    const filenames = REQUIRED_DOCS[docName];
    const inGenerated = generatedNames.has(docName);
    const onDisk =
      filenames?.some((f) => fs.existsSync(path.join(outputDir, f))) ?? false;

    if (inGenerated || onDisk) {
      found++;
    } else {
      details.push(`Missing: ${docName}`);
    }
  }

  const ratio = found / uniqueNeeded.length;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(`All ${uniqueNeeded.length} required documents present`);
  }

  return { name: "Document Completeness", score, maxPoints, details };
}

/**
 * Document Freshness (20 points).
 * Checks whether generated documents on disk were created/modified within the
 * last 30 days.
 */
function scoreDocumentFreshness(input: ScoreInput): ScoreComponent {
  const maxPoints = 20;
  const { outputDir, docs } = input;
  const now = input.now ?? new Date();

  if (docs.length === 0) {
    return {
      name: "Document Freshness",
      score: maxPoints,
      maxPoints,
      details: ["No documents to check"],
    };
  }

  let freshCount = 0;
  let checkedCount = 0;
  const details: string[] = [];

  for (const doc of docs) {
    const filePath = path.join(outputDir, doc.filename);
    if (!fs.existsSync(filePath)) continue;

    checkedCount++;
    try {
      const stat = fs.statSync(filePath);
      const ageMs = now.getTime() - stat.mtimeMs;
      if (ageMs <= FRESHNESS_WINDOW_MS) {
        freshCount++;
      } else {
        const ageDays = Math.round(ageMs / (24 * 60 * 60 * 1000));
        details.push(`Stale: ${doc.filename} (${ageDays} days old)`);
      }
    } catch {
      // If stat fails, skip
    }
  }

  if (checkedCount === 0) {
    // No docs on disk yet -- they were just generated, count as fresh
    return {
      name: "Document Freshness",
      score: maxPoints,
      maxPoints,
      details: ["Documents freshly generated"],
    };
  }

  const ratio = freshCount / checkedCount;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(`All ${checkedCount} documents generated within 30 days`);
  }

  return { name: "Document Freshness", score, maxPoints, details };
}

/**
 * Detection Coverage (15 points).
 * Ratio of detected services to total known services in the project.
 * A project with zero services gets full marks (nothing to detect).
 */
function scoreDetectionCoverage(input: ScoreInput): ScoreComponent {
  const maxPoints = 15;
  const { scanResult } = input;

  const totalServices = scanResult.services.length;

  if (totalServices === 0) {
    return {
      name: "Detection Coverage",
      score: maxPoints,
      maxPoints,
      details: ["No third-party services in project"],
    };
  }

  // Services with isDataProcessor !== false are meaningful detections
  const dataProcessors = scanResult.services.filter(
    (s) => s.isDataProcessor !== false
  );

  if (dataProcessors.length === 0) {
    return {
      name: "Detection Coverage",
      score: maxPoints,
      maxPoints,
      details: [
        `${totalServices} utility service(s) detected, no data processors`,
      ],
    };
  }

  // Score based on how many detected services have compliance docs addressing them.
  // Every data-processor service should be covered by at least one compliance doc.
  const coveredCategories = new Set<string>();
  const needDocs = new Set(scanResult.complianceNeeds.map((n) => n.document));

  // Map: if we have a Privacy Policy need and it exists, auth/analytics/ai/etc. categories are covered
  if (needDocs.has("Privacy Policy")) coveredCategories.add("all");
  if (needDocs.has("AI Disclosure")) coveredCategories.add("ai");
  if (needDocs.has("Cookie Policy")) {
    coveredCategories.add("analytics");
    coveredCategories.add("advertising");
  }

  // If compliance needs cover the project's service categories, full marks
  const uncoveredServices = dataProcessors.filter((s) => {
    if (coveredCategories.has("all")) return false;
    return !coveredCategories.has(s.category);
  });

  const coveredRatio =
    (dataProcessors.length - uncoveredServices.length) / dataProcessors.length;
  const score = Math.round(coveredRatio * maxPoints);

  const details: string[] = [
    `${dataProcessors.length} data processor(s) detected out of ${totalServices} total service(s)`,
  ];

  if (uncoveredServices.length > 0) {
    details.push(
      `${uncoveredServices.length} service(s) not covered by compliance docs`
    );
  }

  return { name: "Detection Coverage", score, maxPoints, details };
}

/**
 * Configuration Quality (10 points).
 * Checks that company info is real (not placeholder), DPO is set, and
 * jurisdictions are configured.
 */
function scoreConfigurationQuality(input: ScoreInput): ScoreComponent {
  const maxPoints = 10;
  const config = input.config;
  const details: string[] = [];
  let earned = 0;

  // Company name: 3 points
  if (
    config?.companyName &&
    config.companyName.trim().length > 0 &&
    !isPlaceholder(config.companyName)
  ) {
    earned += 3;
  } else {
    details.push("Company name is missing or placeholder");
  }

  // Contact email: 2 points
  if (
    config?.contactEmail &&
    config.contactEmail.trim().length > 0 &&
    !isPlaceholder(config.contactEmail)
  ) {
    earned += 2;
  } else {
    details.push("Contact email is missing or placeholder");
  }

  // DPO set: 3 points
  if (config?.dpoName && config?.dpoEmail) {
    earned += 3;
  } else {
    details.push("Data Protection Officer (DPO) not configured");
  }

  // Jurisdictions configured: 2 points
  if (config?.jurisdictions && config.jurisdictions.length > 0) {
    earned += 2;
  } else {
    details.push("No jurisdictions configured");
  }

  if (details.length === 0) {
    details.push("Configuration fully populated");
  }

  return {
    name: "Configuration Quality",
    score: earned,
    maxPoints,
    details,
  };
}

/**
 * Regulatory Coverage (15 points).
 * All applicable regulations (based on services + jurisdictions) are
 * addressed by generated documents.
 */
function scoreRegulatoryCoverage(input: ScoreInput): ScoreComponent {
  const maxPoints = 15;
  const { scanResult, docs } = input;

  const generatedNames = new Set(docs.map((d) => d.name));
  const hasAI = scanResult.services.some((s) => s.category === "ai");
  const hasAnalytics = scanResult.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasPayment = scanResult.services.some(
    (s) => s.category === "payment"
  );
  const hasServices = scanResult.services.length > 0;

  interface RegCheck {
    regulation: string;
    applies: boolean;
    requiredDocs: string[];
  }

  const checks: RegCheck[] = [
    {
      regulation: "GDPR",
      applies: hasServices,
      requiredDocs: ["Privacy Policy", "Data Processing Agreement"],
    },
    {
      regulation: "CCPA/CPRA",
      applies: hasServices,
      requiredDocs: ["Privacy Policy"],
    },
    {
      regulation: "EU AI Act",
      applies: hasAI,
      requiredDocs: ["AI Disclosure"],
    },
    {
      regulation: "ePrivacy Directive",
      applies: hasAnalytics,
      requiredDocs: ["Cookie Policy"],
    },
    {
      regulation: "PCI DSS",
      applies: hasPayment,
      requiredDocs: ["Security Policy"],
    },
  ];

  const applicableChecks = checks.filter((c) => c.applies);

  if (applicableChecks.length === 0) {
    return {
      name: "Regulatory Coverage",
      score: maxPoints,
      maxPoints,
      details: ["No specific regulations applicable"],
    };
  }

  let addressed = 0;
  const details: string[] = [];

  for (const check of applicableChecks) {
    const allPresent = check.requiredDocs.every((d) => generatedNames.has(d));
    if (allPresent) {
      addressed++;
    } else {
      const missing = check.requiredDocs.filter(
        (d) => !generatedNames.has(d)
      );
      details.push(`${check.regulation}: missing ${missing.join(", ")}`);
    }
  }

  const ratio = addressed / applicableChecks.length;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(
      `All ${applicableChecks.length} applicable regulation(s) addressed`
    );
  }

  return { name: "Regulatory Coverage", score, maxPoints, details };
}

// ---------------------------------------------------------------------------
// Grade computation
// ---------------------------------------------------------------------------

export function gradeFromScore(total: number): Grade {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

/**
 * Compute a comprehensive compliance score from scan results, generated
 * documents, and project configuration.
 *
 * The score is composed of 5 weighted components totaling 100 points:
 * - Document Completeness (40 pts)
 * - Document Freshness (20 pts)
 * - Detection Coverage (15 pts)
 * - Configuration Quality (10 pts)
 * - Regulatory Coverage (15 pts)
 */
export function computeComplianceScore(input: ScoreInput): ComplianceScore {
  const components: ScoreComponent[] = [
    scoreDocumentCompleteness(input),
    scoreDocumentFreshness(input),
    scoreDetectionCoverage(input),
    scoreConfigurationQuality(input),
    scoreRegulatoryCoverage(input),
  ];

  const total = components.reduce((sum, c) => sum + c.score, 0);
  const grade = gradeFromScore(total);

  return {
    total,
    grade,
    components,
    computedAt: (input.now ?? new Date()).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Formatting helpers for CLI / dashboard / badge
// ---------------------------------------------------------------------------

/**
 * Render a plain-text score breakdown suitable for CLI output.
 */
export function formatScoreBreakdown(score: ComplianceScore): string {
  const lines: string[] = [];
  lines.push(`Compliance Score: ${score.total}/100 (${score.grade})`);
  lines.push("");

  for (const comp of score.components) {
    lines.push(`  ${comp.name}: ${comp.score}/${comp.maxPoints}`);
    for (const detail of comp.details) {
      lines.push(`    - ${detail}`);
    }
  }

  return lines.join("\n");
}

/**
 * Render score as a Markdown section suitable for the compliance report.
 */
export function formatScoreMarkdown(score: ComplianceScore): string {
  let md = `## Compliance Score\n\n`;
  md += `**${score.total}/100** (Grade: **${score.grade}**)\n\n`;
  md += `| Component | Score | Max | Details |\n`;
  md += `|-----------|-------|-----|----------|\n`;

  for (const comp of score.components) {
    const details = comp.details.join("; ");
    md += `| ${comp.name} | ${comp.score} | ${comp.maxPoints} | ${details} |\n`;
  }

  md += "\n";
  return md;
}

/**
 * Return a badge-friendly color hex string based on the score.
 */
export function scoreColor(total: number): string {
  if (total >= 90) return "#4c1"; // green
  if (total >= 80) return "#97ca00"; // light green
  if (total >= 70) return "#dfb317"; // yellow
  if (total >= 60) return "#fe7d37"; // orange
  return "#e05d44"; // red
}

/**
 * Return a short status label for a score.
 */
export function scoreStatus(
  total: number
): { text: string; color: string } {
  const grade = gradeFromScore(total);
  const color = scoreColor(total);
  const textMap: Record<Grade, string> = {
    A: "excellent",
    B: "good",
    C: "fair",
    D: "needs work",
    F: "non-compliant",
  };
  return { text: textMap[grade], color };
}
