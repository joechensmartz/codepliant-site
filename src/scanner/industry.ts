import * as fs from "fs";
import * as path from "path";
import type { ComplianceNeed, Evidence } from "./types.js";
import { type WalkedFile } from "./file-walker.js";

// ── HIPAA Detection ─────────────────────────────────────────────────

/** npm/pip/gem packages that strongly suggest healthcare data handling */
const HIPAA_PACKAGES = new Set([
  // Node / npm
  "hl7-fhir",
  "fhirpath",
  "redox-engine",
  "@medplum/core",
  "@medplum/fhirtypes",
  "fhir-kit-client",
  "node-hl7-complete",
  "blue-button",
  "cda2fhir",
  "healthcare-js",
  // Python
  "fhirclient",
  "python-hl7",
  "hl7apy",
  "pydicom",
  "fhirpy",
  "hapi-fhir",
  // Ruby
  "fhir_client",
  "health-data-standards",
]);

/** Environment variable prefixes that indicate healthcare integrations */
const HIPAA_ENV_PREFIXES = ["HIPAA_", "HEALTH_", "EHR_", "FHIR_"];

/** Field/identifier names in source code that suggest healthcare data */
const HIPAA_FIELD_PATTERNS = [
  /\bdiagnosis\b/i,
  /\bpatient[_\s]/i,
  /\bmedical[_\s]?record/i,
  /\bprescription\b/i,
  /\bpatientId\b/i,
  /\bmedicalHistory\b/i,
  /\bhealthRecord\b/i,
  /\binsuranceClaim\b/i,
  /\bphi\b/,           // Protected Health Information — case-sensitive to avoid false positives
  /\bePHI\b/,
];

// ── COPPA Detection ─────────────────────────────────────────────────

/** npm/pip packages that suggest the app targets children */
const COPPA_PACKAGES = new Set([
  // Node / npm
  "react-native-kidscreen",
  "kidscreen",
  "parental-controls",
  "age-gate",
  "age-verification",
  // Education-related packages
  "edx-platform",
  "moodle-client",
  "schoology",
  "google-classroom",
  "@google-classroom/api",
  "canvas-lms",
  "edmodo",
  // Child safety / kid-oriented
  "kid-safe",
  "child-filter",
  "coppa-compliance",
]);

/** Environment variable prefixes that indicate COPPA-related configuration */
const COPPA_ENV_PREFIXES = ["COPPA_", "CHILD_", "PARENTAL_", "KIDSCREEN_", "AGE_GATE_", "AGE_VERIFICATION_"];

/** Field/identifier names in source code that suggest child data handling */
const COPPA_FIELD_PATTERNS = [
  /\bparentalConsent\b/i,
  /\bparental_consent\b/i,
  /\bisChild\b/i,
  /\bis_child\b/i,
  /\bisMinor\b/i,
  /\bis_minor\b/i,
  /\bchildAge\b/i,
  /\bchild_age\b/i,
  /\bunderThirteen\b/i,
  /\bunder_thirteen\b/i,
  /\bunder_13\b/i,
  /\bminorUser\b/i,
  /\bminor_user\b/i,
  /\bkidMode\b/i,
  /\bkid_mode\b/i,
  /\bchildProfile\b/i,
  /\bchild_profile\b/i,
  /\bparentEmail\b/i,
  /\bparent_email\b/i,
  /\bguardianConsent\b/i,
  /\bguardian_consent\b/i,
];

/** Patterns that suggest age-gating with child-range logic */
const COPPA_AGE_GATE_PATTERNS = [
  /\bage\s*[<]=?\s*13\b/i,
  /\bage\s*>=?\s*13\b/i,
  /\bdateOfBirth\b/i,
  /\bdate_of_birth\b/i,
  /\bbirth_date\b/i,
  /\bbirthDate\b/i,
];

// ── PCI DSS Detection ───────────────────────────────────────────────

/** npm packages that handle raw card data (beyond Stripe/PayPal which are
 *  already detected as payment services) */
const PCI_PACKAGES = new Set([
  "credit-card",
  "card-validator",
  "creditcards",
  "credit-card-type",
  "braintree",
  "adyen-api",
  "square",
]);

/** Field/identifier names that suggest raw card data handling */
const PCI_FIELD_PATTERNS = [
  /\bcardNumber\b/i,
  /\bcreditCard\b/i,
  /\bcvv\b/i,
  /\bcvc\b/i,
  /\bcardExp/i,
  /\bpan\b/,           // Primary Account Number — case-sensitive
  /\bcard_number\b/i,
  /\bcredit_card\b/i,
  /\bcardholder/i,
];

export interface IndustryResult {
  hipaa: IndustrySignal;
  pciDss: IndustrySignal;
  coppa: IndustrySignal;
}

export interface IndustrySignal {
  detected: boolean;
  evidence: Evidence[];
}

/**
 * Scans a project for indicators of HIPAA and PCI DSS compliance needs.
 * Checks package manifests, environment variable files, and source code.
 */
export function scanIndustryCompliance(
  projectPath: string,
  allFiles: WalkedFile[],
): IndustryResult {
  const hipaaEvidence: Evidence[] = [];
  const pciEvidence: Evidence[] = [];
  const coppaEvidence: Evidence[] = [];

  // 1. Check package manifests
  scanPackagesForIndustry(projectPath, hipaaEvidence, pciEvidence, coppaEvidence);

  // 2. Check env files
  scanEnvForIndustry(projectPath, hipaaEvidence, coppaEvidence);

  // 3. Check source code for field patterns
  scanSourceForIndustry(allFiles, hipaaEvidence, pciEvidence, coppaEvidence);

  return {
    hipaa: { detected: hipaaEvidence.length > 0, evidence: hipaaEvidence },
    pciDss: { detected: pciEvidence.length > 0, evidence: pciEvidence },
    coppa: { detected: coppaEvidence.length > 0, evidence: coppaEvidence },
  };
}

// ── Package manifest scanning ────────────────────────────────────────

function scanPackagesForIndustry(
  projectPath: string,
  hipaaEvidence: Evidence[],
  pciEvidence: Evidence[],
  coppaEvidence: Evidence[],
): void {
  // package.json
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps: Record<string, string> = {
        ...(pkg.dependencies as Record<string, string> | undefined),
        ...(pkg.devDependencies as Record<string, string> | undefined),
      };
      for (const dep of Object.keys(allDeps)) {
        if (HIPAA_PACKAGES.has(dep)) {
          hipaaEvidence.push({
            type: "dependency",
            file: "package.json",
            detail: `Health-related package: ${dep}@${allDeps[dep]}`,
          });
        }
        if (PCI_PACKAGES.has(dep)) {
          pciEvidence.push({
            type: "dependency",
            file: "package.json",
            detail: `Card-handling package: ${dep}@${allDeps[dep]}`,
          });
        }
        if (COPPA_PACKAGES.has(dep)) {
          coppaEvidence.push({
            type: "dependency",
            file: "package.json",
            detail: `Child-oriented package: ${dep}@${allDeps[dep]}`,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // requirements.txt (Python)
  const reqPath = path.join(projectPath, "requirements.txt");
  if (fs.existsSync(reqPath)) {
    try {
      const content = fs.readFileSync(reqPath, "utf-8");
      for (const line of content.split("\n")) {
        const dep = line.trim().split(/[=<>!~]/)[0].trim();
        if (HIPAA_PACKAGES.has(dep)) {
          hipaaEvidence.push({
            type: "dependency",
            file: "requirements.txt",
            detail: `Health-related package: ${line.trim()}`,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // Gemfile (Ruby)
  const gemPath = path.join(projectPath, "Gemfile");
  if (fs.existsSync(gemPath)) {
    try {
      const content = fs.readFileSync(gemPath, "utf-8");
      for (const line of content.split("\n")) {
        const match = line.match(/gem\s+['"]([^'"]+)['"]/);
        if (match && HIPAA_PACKAGES.has(match[1])) {
          hipaaEvidence.push({
            type: "dependency",
            file: "Gemfile",
            detail: `Health-related gem: ${match[1]}`,
          });
        }
      }
    } catch {
      // ignore
    }
  }
}

// ── Environment variable scanning ────────────────────────────────────

const ENV_FILES = [".env", ".env.example", ".env.local", ".env.development"];

function scanEnvForIndustry(
  projectPath: string,
  hipaaEvidence: Evidence[],
  coppaEvidence: Evidence[],
): void {
  for (const envFile of ENV_FILES) {
    const envPath = path.join(projectPath, envFile);
    if (!fs.existsSync(envPath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(envPath, "utf-8");
    } catch {
      continue;
    }

    const envVars = content
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.split("=")[0].trim())
      .filter(Boolean);

    for (const varName of envVars) {
      for (const prefix of HIPAA_ENV_PREFIXES) {
        if (varName.startsWith(prefix)) {
          hipaaEvidence.push({
            type: "env_var",
            file: envFile,
            detail: `Health-related env var: ${varName}=***`,
          });
          break;
        }
      }
      for (const prefix of COPPA_ENV_PREFIXES) {
        if (varName.startsWith(prefix)) {
          coppaEvidence.push({
            type: "env_var",
            file: envFile,
            detail: `Child-related env var: ${varName}=***`,
          });
          break;
        }
      }
    }
  }
}

// ── Source code scanning ─────────────────────────────────────────────

/** Maximum number of files to scan for field patterns (performance guard) */
const MAX_FILES_TO_SCAN = 200;

function scanSourceForIndustry(
  allFiles: WalkedFile[],
  hipaaEvidence: Evidence[],
  pciEvidence: Evidence[],
  coppaEvidence: Evidence[],
): void {
  let scanned = 0;
  for (const file of allFiles) {
    if (scanned >= MAX_FILES_TO_SCAN) break;

    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }
    scanned++;

    for (const pattern of HIPAA_FIELD_PATTERNS) {
      if (pattern.test(content)) {
        hipaaEvidence.push({
          type: "code_pattern",
          file: file.relativePath,
          detail: `Health-related field pattern: ${pattern.source}`,
        });
        break; // one match per file is sufficient
      }
    }

    for (const pattern of PCI_FIELD_PATTERNS) {
      if (pattern.test(content)) {
        pciEvidence.push({
          type: "code_pattern",
          file: file.relativePath,
          detail: `Card-related field pattern: ${pattern.source}`,
        });
        break; // one match per file is sufficient
      }
    }

    for (const pattern of COPPA_FIELD_PATTERNS) {
      if (pattern.test(content)) {
        coppaEvidence.push({
          type: "code_pattern",
          file: file.relativePath,
          detail: `Child-related field pattern: ${pattern.source}`,
        });
        break; // one match per file is sufficient
      }
    }

    // Also check age-gate patterns for COPPA (only if no COPPA evidence found yet for this file)
    if (!coppaEvidence.some((e) => e.file === file.relativePath)) {
      for (const pattern of COPPA_AGE_GATE_PATTERNS) {
        if (pattern.test(content)) {
          coppaEvidence.push({
            type: "code_pattern",
            file: file.relativePath,
            detail: `Age-gating pattern (potential child users): ${pattern.source}`,
          });
          break;
        }
      }
    }
  }
}

// ── Compliance Need generation ───────────────────────────────────────

/**
 * Returns ComplianceNeed entries for HIPAA and/or PCI DSS when detected.
 * Also flags PCI consideration if the project already uses a payment service
 * (Stripe, PayPal, etc.).
 */
export function deriveIndustryComplianceNeeds(
  industryResult: IndustryResult,
  hasPaymentService: boolean,
): ComplianceNeed[] {
  const needs: ComplianceNeed[] = [];

  if (industryResult.hipaa.detected) {
    needs.push({
      document: "HIPAA Compliance",
      reason:
        "Your project appears to handle Protected Health Information (PHI). " +
        "HIPAA requires administrative, physical, and technical safeguards, " +
        "Business Associate Agreements (BAAs) with all vendors handling PHI, " +
        "and breach notification procedures.",
      priority: "required",
    });
  }

  if (industryResult.coppa.detected) {
    needs.push({
      document: "COPPA Compliance",
      reason:
        "Your project appears to target or collect data from children under 13. " +
        "COPPA requires verifiable parental consent before collecting personal information " +
        "from children, limits on data collection, and secure handling of children's data.",
      priority: "required",
    });
  }

  if (industryResult.pciDss.detected || hasPaymentService) {
    needs.push({
      document: "PCI DSS Compliance",
      reason: industryResult.pciDss.detected
        ? "Your project appears to handle raw payment card data (card numbers, CVVs). " +
          "PCI DSS requires strict controls over cardholder data storage, processing, and transmission."
        : "Your project integrates a payment processor. While the processor handles most PCI requirements, " +
          "you should confirm your integration does not inadvertently capture or log raw card data, " +
          "and complete the appropriate PCI Self-Assessment Questionnaire (SAQ).",
      priority: industryResult.pciDss.detected ? "required" : "recommended",
    });
  }

  return needs;
}
