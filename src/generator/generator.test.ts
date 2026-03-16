import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService, DataCategory, ComplianceNeed } from "../scanner/types.js";
import { generateDocuments } from "./index.js";
import { generatePrivacyPolicy } from "./privacy-policy.js";
import { generateTermsOfService } from "./terms-of-service.js";
import { generateAIDisclosure } from "./ai-disclosure.js";
import { generateCookiePolicy } from "./cookie-policy.js";
import { generateSubprocessorList } from "./subprocessor-list.js";
import { generateSecurityPolicy } from "./security-policy.js";
import { generateIncidentResponsePlan } from "./incident-response.js";
import { generateDSARGuide } from "./dsar-guide.js";
import { generateConsentGuide } from "./consent-guide.js";
import { generateThirdPartyRiskAssessment } from "./third-party-risk.js";
import { generateAIModelCard } from "./ai-model-card.js";
import type { GeneratorContext } from "./index.js";

// --- Mock data helpers ---

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"]
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

const emptyScan = makeScan();

const scanWithAI = makeScan({
  services: [
    makeService("openai", "ai", ["user prompts", "conversation history", "generated content"]),
  ],
  dataCategories: [
    { category: "AI Data", description: "Data sent to AI services", sources: ["openai"] },
  ],
  complianceNeeds: [
    { document: "AI Disclosure", reason: "AI services detected", priority: "required" },
  ],
});

const scanWithPayment = makeScan({
  services: [
    makeService("stripe", "payment", ["payment information", "billing address", "email"]),
  ],
  dataCategories: [
    { category: "Payment Data", description: "Payment processing data", sources: ["stripe"] },
  ],
});

const scanWithAnalytics = makeScan({
  services: [
    makeService("posthog", "analytics", ["user behavior", "session recordings"]),
  ],
});

const scanWithAuth = makeScan({
  services: [
    makeService("next-auth", "auth", ["email", "name", "session data"]),
  ],
});

const scanWithAll = makeScan({
  services: [
    makeService("openai", "ai", ["user prompts", "conversation history"]),
    makeService("stripe", "payment", ["payment information", "email"]),
    makeService("posthog", "analytics", ["user behavior", "session recordings"]),
    makeService("next-auth", "auth", ["email", "name", "session data"]),
  ],
  dataCategories: [
    { category: "AI Data", description: "Data sent to AI services", sources: ["openai"] },
    { category: "Payment Data", description: "Payment processing data", sources: ["stripe"] },
  ],
  complianceNeeds: [
    { document: "AI Disclosure", reason: "AI services detected", priority: "required" },
    { document: "Cookie Policy", reason: "Analytics detected", priority: "recommended" },
  ],
});

const ctx: GeneratorContext = {
  companyName: "Acme Corp",
  contactEmail: "privacy@acme.com",
  website: "https://acme.com",
  jurisdiction: "State of Delaware, USA",
};

// ============================================================
// generatePrivacyPolicy
// ============================================================

describe("generatePrivacyPolicy", () => {
  it("returns valid markdown with heading", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.startsWith("# Privacy Policy"));
    assert.ok(result.toLowerCase().includes("last updated"));
  });

  it("includes detected services", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("openai"), "should mention openai");
    assert.ok(result.includes("Third-Party Services") || result.includes("AI Service"));
  });

  it("includes data categories", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("AI Data"));
    assert.ok(result.includes("Data sent to AI services"));
  });

  it("handles AI services section", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("Artificial Intelligence"));
    assert.ok(result.includes("user prompts"));
  });

  it("does not include AI section when no AI services", () => {
    const result = generatePrivacyPolicy(scanWithPayment, ctx);
    assert.ok(!result.includes("Artificial Intelligence"));
  });

  it("handles empty scan with no data categories", () => {
    const result = generatePrivacyPolicy(emptyScan, ctx);
    assert.ok(result.includes("We do not currently collect personal information"));
  });

  it("uses config companyName", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses config contactEmail", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generatePrivacyPolicy(scanWithAI);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes project name", () => {
    const result = generatePrivacyPolicy(scanWithAI, ctx);
    assert.ok(result.includes("test-project"));
  });
});

// ============================================================
// generateTermsOfService
// ============================================================

describe("generateTermsOfService", () => {
  it("returns valid markdown with heading", () => {
    const result = generateTermsOfService(emptyScan, ctx);
    assert.ok(result.startsWith("# Terms of Service"));
    assert.ok(result.toLowerCase().includes("effective date"));
    assert.ok(result.toLowerCase().includes("last modified"));
  });

  it("includes AI section when AI detected", () => {
    const result = generateTermsOfService(scanWithAI, ctx);
    assert.ok(result.includes("AI-Generated Content"));
    assert.ok(result.includes("No guarantee of accuracy"));
  });

  it("does not include AI section when no AI", () => {
    const result = generateTermsOfService(scanWithPayment, ctx);
    assert.ok(!result.includes("AI-Generated Content"));
  });

  it("includes payment section when payment detected", () => {
    const result = generateTermsOfService(scanWithPayment, ctx);
    assert.ok(result.includes("Payments and Billing"));
  });

  it("does not include payment section when no payment", () => {
    const result = generateTermsOfService(scanWithAI, ctx);
    assert.ok(!result.includes("Payments and Billing"));
  });

  it("uses jurisdiction from config", () => {
    const result = generateTermsOfService(scanWithAI, ctx);
    assert.ok(result.includes("State of Delaware, USA"));
  });

  it("uses placeholder jurisdiction when not configured", () => {
    const result = generateTermsOfService(scanWithAI);
    assert.ok(result.includes("[Your Jurisdiction]"));
  });

  it("uses config companyName", () => {
    const result = generateTermsOfService(emptyScan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses config contactEmail", () => {
    const result = generateTermsOfService(emptyScan, ctx);
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("includes all conditional sections when all types present", () => {
    const scanWithAIPaymentStorage = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("@uploadthing/react", "storage"),
      ],
    });
    const result = generateTermsOfService(scanWithAIPaymentStorage, ctx);
    assert.ok(result.includes("AI-Generated Content"));
    assert.ok(result.includes("Payments and Billing"));
    assert.ok(result.includes("User Content"));
  });
});

// ============================================================
// generateAIDisclosure
// ============================================================

describe("generateAIDisclosure", () => {
  it("returns null when no AI services", () => {
    const result = generateAIDisclosure(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-AI services present", () => {
    const result = generateAIDisclosure(scanWithPayment, ctx);
    assert.strictEqual(result, null);
  });

  it("returns valid disclosure when AI detected", () => {
    const result = generateAIDisclosure(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# AI Disclosure Statement"));
    assert.ok(result!.includes("EU AI Act"));
  });

  it("lists correct AI providers", () => {
    const result = generateAIDisclosure(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("OpenAI")); // provider name
  });

  it("includes data processed for each provider", () => {
    const result = generateAIDisclosure(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("user prompts"));
    assert.ok(result!.includes("conversation history"));
  });

  it("lists multiple AI services correctly", () => {
    const multiAI = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["user prompts", "generated content"]),
      ],
    });
    const result = generateAIDisclosure(multiAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("OpenAI"));
    assert.ok(result!.includes("Anthropic"));
  });

  it("uses contactEmail from context", () => {
    const result = generateAIDisclosure(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("privacy@acme.com"));
  });

  it("includes project name", () => {
    const result = generateAIDisclosure(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("test-project"));
  });
});

// ============================================================
// generateCookiePolicy
// ============================================================

describe("generateCookiePolicy", () => {
  it("returns null when no analytics or auth services", () => {
    const result = generateCookiePolicy(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when only AI/payment services", () => {
    const result = generateCookiePolicy(scanWithAI, ctx);
    assert.strictEqual(result, null);
  });

  it("returns valid cookie policy when analytics detected", () => {
    const result = generateCookiePolicy(scanWithAnalytics, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# Cookie Policy"));
  });

  it("includes cookie details for analytics services", () => {
    const result = generateCookiePolicy(scanWithAnalytics, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("Analytics") || result!.includes("Optional Cookies"));
    assert.ok(result!.includes("posthog"));
  });

  it("includes auth cookie details when auth detected", () => {
    const result = generateCookiePolicy(scanWithAuth, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("Session cookie"));
    assert.ok(result!.includes("Auth token"));
  });

  it("includes both analytics and auth sections when both present", () => {
    const result = generateCookiePolicy(scanWithAll, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("Analytics") || result!.includes("Optional Cookies"));
    assert.ok(result!.includes("Session cookie"));
  });

  it("uses contactEmail from context", () => {
    const result = generateCookiePolicy(scanWithAnalytics, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("privacy@acme.com"));
  });

  it("includes project name", () => {
    const result = generateCookiePolicy(scanWithAnalytics, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("test-project"));
  });
});

// ============================================================
// generateSubprocessorList
// ============================================================

describe("generateSubprocessorList", () => {
  it("returns null when fewer than 3 third-party services", () => {
    const result = generateSubprocessorList(scanWithPayment, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null for empty scan", () => {
    const result = generateSubprocessorList(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when services are all self-hosted", () => {
    const selfHostedScan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("next-auth", "auth"),
        makeService("passport", "auth"),
      ],
    });
    const result = generateSubprocessorList(selfHostedScan, ctx);
    assert.strictEqual(result, null);
  });

  it("generates list when 3+ third-party services detected", () => {
    const result = generateSubprocessorList(scanWithAll, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# Sub-Processor List"));
  });

  it("includes table with required columns", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("| Sub-Processor |"));
    assert.ok(result.includes("| Purpose |"));
    assert.ok(result.includes("| Data Processed |"));
    assert.ok(result.includes("| Location |"));
    assert.ok(result.includes("| Privacy Policy |"));
  });

  it("includes detected providers in the table", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("PostHog"));
  });

  it("excludes self-hosted services from table", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(!result.includes("| NextAuth.js |"));
  });

  it("shows US location for US-based providers", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("| US |"));
  });

  it("includes privacy policy links", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("https://openai.com/policies/privacy-policy"));
    assert.ok(result.includes("https://stripe.com/privacy"));
  });

  it("includes last updated date", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.toLowerCase().includes("last updated"));
  });

  it("uses company name from context", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contact email from context", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateSubprocessorList(scanWithAll)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("deduplicates providers with multiple packages", () => {
    const multiSentryScan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error data", "stack traces"]),
        makeService("@sentry/nextjs", "monitoring", ["error data", "stack traces"]),
        makeService("stripe", "payment", ["payment information"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateSubprocessorList(multiSentryScan, ctx)!;
    const sentryMatches = result.match(/\| Sentry \|/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches!.length, 1);
  });

  it("includes project name", () => {
    const result = generateSubprocessorList(scanWithAll, ctx)!;
    assert.ok(result.includes("test-project"));
  });
});

// ============================================================
// generateSecurityPolicy
// ============================================================

describe("generateSecurityPolicy", () => {
  it("returns valid markdown with heading", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.startsWith("# Security Policy"));
    assert.ok(result.toLowerCase().includes("last updated"));
  });

  it("always generates (even for empty scan)", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.length > 0);
    assert.ok(result.includes("Reporting a Vulnerability"));
  });

  it("includes supported versions table", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("## Supported Versions"));
    assert.ok(result.includes("| Version |"));
    assert.ok(result.includes("| latest  |"));
  });

  it("includes reporting vulnerabilities section", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("## Reporting a Vulnerability"));
    assert.ok(result.includes("do NOT report security vulnerabilities through public GitHub issues"));
  });

  it("uses securityEmail from context when provided", () => {
    const ctxWithSecurity: GeneratorContext = {
      ...ctx,
      securityEmail: "security@acme.com",
    };
    const result = generateSecurityPolicy(emptyScan, ctxWithSecurity);
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("includes scope section", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("## Scope"));
    assert.ok(result.includes("### In Scope"));
    assert.ok(result.includes("### Out of Scope"));
  });

  it("includes auth security section when auth detected", () => {
    const result = generateSecurityPolicy(scanWithAuth, ctx);
    assert.ok(result.includes("## Authentication Security"));
    assert.ok(result.includes("Session management and token handling"));
  });

  it("does not include auth section when no auth", () => {
    const result = generateSecurityPolicy(scanWithPayment, ctx);
    assert.ok(!result.includes("## Authentication Security"));
  });

  it("includes PCI section when payment detected", () => {
    const result = generateSecurityPolicy(scanWithPayment, ctx);
    assert.ok(result.includes("## Payment & PCI Considerations"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("does not include PCI section when no payment", () => {
    const result = generateSecurityPolicy(scanWithAuth, ctx);
    assert.ok(!result.includes("## Payment & PCI Considerations"));
  });

  it("includes AI safety section when AI detected", () => {
    const result = generateSecurityPolicy(scanWithAI, ctx);
    assert.ok(result.includes("## AI Safety & Security"));
    assert.ok(result.includes("Prompt injection"));
  });

  it("does not include AI section when no AI", () => {
    const result = generateSecurityPolicy(scanWithPayment, ctx);
    assert.ok(!result.includes("## AI Safety & Security"));
  });

  it("includes response timeline", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("## Response Timeline"));
    assert.ok(result.includes("Within 48 hours"));
    assert.ok(result.includes("Within 30 days"));
  });

  it("includes bug bounty section when bugBountyUrl provided", () => {
    const ctxWithBounty: GeneratorContext = {
      ...ctx,
      bugBountyUrl: "https://acme.com/bug-bounty",
    };
    const result = generateSecurityPolicy(emptyScan, ctxWithBounty);
    assert.ok(result.includes("## Bug Bounty Program"));
    assert.ok(result.includes("https://acme.com/bug-bounty"));
  });

  it("does not include bug bounty section when no bugBountyUrl", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(!result.includes("## Bug Bounty Program"));
  });

  it("includes all conditional sections when all service types present", () => {
    const result = generateSecurityPolicy(scanWithAll, ctx);
    assert.ok(result.includes("## Authentication Security"));
    assert.ok(result.includes("## Payment & PCI Considerations"));
    assert.ok(result.includes("## AI Safety & Security"));
  });

  it("uses company name from context", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateSecurityPolicy(emptyScan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[security@example.com]"));
  });

  it("includes project name in disclaimer", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("test-project"));
  });

  it("includes disclosure policy", () => {
    const result = generateSecurityPolicy(emptyScan, ctx);
    assert.ok(result.includes("## Disclosure Policy"));
    assert.ok(result.includes("coordinated disclosure"));
  });
});

// ============================================================
// generateConsentGuide
// ============================================================

describe("generateConsentGuide", () => {
  it("returns null when no analytics or advertising services", () => {
    const result = generateConsentGuide(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when only AI/payment services", () => {
    const result = generateConsentGuide(scanWithAI, ctx);
    assert.strictEqual(result, null);
  });

  it("returns valid guide when analytics detected", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# Consent Management Implementation Guide"));
  });

  it("includes legal basis classification", () => {
    const result = generateConsentGuide(scanWithAll, ctx)!;
    assert.ok(result.includes("Legal Basis Classification"));
    assert.ok(result.includes("Consent Required"));
    assert.ok(result.includes("Legitimate Interest"));
    assert.ok(result.includes("Contractual Necessity"));
  });

  it("classifies analytics as consent required", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Must not load until user consents"));
  });

  it("includes cookie consent banner requirements", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Cookie Consent Banner Requirements"));
    assert.ok(result.includes("Block non-essential cookies"));
    assert.ok(result.includes("Reject All"));
  });

  it("includes GPC signal implementation", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Global Privacy Control"));
    assert.ok(result.includes("navigator.globalPrivacyControl"));
  });

  it("includes consent storage recommendations", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Consent Storage Recommendations"));
    assert.ok(result.includes("localStorage"));
    assert.ok(result.includes("Server-side database"));
  });

  it("includes consent withdrawal process", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Consent Withdrawal Process"));
    assert.ok(result.includes("GDPR Article 7(3)"));
  });

  it("includes technical implementation checklist", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Technical Implementation Checklist"));
    assert.ok(result.includes("- [ ] Cookie consent banner loads before any non-essential scripts"));
    assert.ok(result.includes("- [ ] GPC signal"));
  });

  it("includes PostHog code snippet when PostHog detected", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("PostHog"));
    assert.ok(result.includes("opt_out_capturing_by_default"));
    assert.ok(result.includes("opt_in_capturing"));
  });

  it("includes Google Analytics snippet when GA detected", () => {
    const scanWithGA = makeScan({
      services: [
        makeService("@google-analytics/data", "analytics", ["page views", "user behavior"]),
      ],
    });
    const result = generateConsentGuide(scanWithGA, ctx)!;
    assert.ok(result.includes("Google Analytics"));
    assert.ok(result.includes("consent mode") || result.includes("Consent Mode"));
    assert.ok(result.includes("analytics_storage"));
  });

  it("includes cookie banner HTML example", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("cookie-consent"));
    assert.ok(result.includes("acceptAll"));
    assert.ok(result.includes("rejectAll"));
  });

  it("uses company name from context", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contact email from context", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateConsentGuide(scanWithAnalytics)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes project name", () => {
    const result = generateConsentGuide(scanWithAnalytics, ctx)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes per-service checklist items", () => {
    const result = generateConsentGuide(scanWithAll, ctx)!;
    assert.ok(result.includes("Per-Service Checklist"));
    assert.ok(result.includes("- [ ] Script/SDK does not load before consent"));
  });

  it("generates Consent Management Guide when analytics detected via orchestrator", () => {
    const docs = generateDocuments(scanWithAnalytics);
    const names = docs.map((d) => d.name);
    assert.ok(names.includes("Consent Management Guide"));
  });

  it("does not generate Consent Management Guide when no analytics/advertising", () => {
    const docs = generateDocuments(scanWithAI);
    const names = docs.map((d) => d.name);
    assert.ok(!names.includes("Consent Management Guide"));
  });
});

// ============================================================
// generateDSARGuide
// ============================================================

describe("generateDSARGuide", () => {
  it("returns null when no services detected", () => {
    const result = generateDSARGuide(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns valid markdown with heading when services present", () => {
    const result = generateDSARGuide(scanWithPayment, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# DSAR Handling Guide"));
    assert.ok(result!.toLowerCase().includes("last updated"));
  });

  it("includes What is a DSAR section with GDPR articles", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("## 1. What is a DSAR?"));
    assert.ok(result.includes("GDPR Articles 15-22"));
    assert.ok(result.includes("Art. 15"));
    assert.ok(result.includes("Art. 17"));
  });

  it("includes all six request types", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Access Request"));
    assert.ok(result.includes("Rectification Request"));
    assert.ok(result.includes("Erasure Request"));
    assert.ok(result.includes("Data Portability Request"));
    assert.ok(result.includes("Restriction of Processing"));
    assert.ok(result.includes("Right to Object"));
  });

  it("includes response timelines for GDPR and CCPA", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("30 calendar days"));
    assert.ok(result.includes("45 calendar days"));
    assert.ok(result.includes("GDPR Timeline"));
    assert.ok(result.includes("CCPA/CPRA Timeline"));
  });

  it("includes identity verification requirements", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Identity Verification"));
    assert.ok(result.includes("Existing Account Holders"));
    assert.ok(result.includes("Authorized Agents"));
  });

  it("includes service-specific data location map", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("## 5. Service-Specific Data Location Map"));
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("**Data collected:**"));
    assert.ok(result.includes("**How to export:**"));
    assert.ok(result.includes("**How to delete:**"));
  });

  it("includes third-party notification section for third-party services", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Third-Party Sub-Processor Notification"));
    assert.ok(result.includes("Stripe"));
  });

  it("includes template responses for each request type", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Template Responses"));
    assert.ok(result.includes("Acknowledgment of Receipt"));
    assert.ok(result.includes("Access Request Response"));
    assert.ok(result.includes("Rectification Confirmation"));
    assert.ok(result.includes("Erasure Confirmation"));
    assert.ok(result.includes("Portability Response"));
    assert.ok(result.includes("Restriction Confirmation"));
    assert.ok(result.includes("Objection Acknowledgment"));
  });

  it("includes record-keeping requirements", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Record-Keeping Requirements"));
    assert.ok(result.includes("DSAR Log Fields"));
    assert.ok(result.includes("24 months"));
  });

  it("generates data location entries for multiple services", () => {
    const result = generateDSARGuide(scanWithAll, ctx)!;
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("### PostHog"));
    assert.ok(result.includes("### NextAuth.js"));
  });

  it("marks self-hosted services as not requiring third-party notification", () => {
    const result = generateDSARGuide(scanWithAuth, ctx)!;
    assert.ok(result.includes("No (self-hosted)"));
  });

  it("uses company name from context", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contact email from context", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateDSARGuide(scanWithPayment)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses DPO name and email from context", () => {
    const ctxWithDpo: GeneratorContext = {
      ...ctx,
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDSARGuide(scanWithPayment, ctxWithDpo)!;
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("includes project name", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("test-project"));
  });

  it("deduplicates providers with multiple packages", () => {
    const multiSentryScan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error data", "stack traces"]),
        makeService("@sentry/nextjs", "monitoring", ["error data", "stack traces"]),
      ],
    });
    const result = generateDSARGuide(multiSentryScan, ctx)!;
    const sentryMatches = result.match(/### Sentry/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches!.length, 1);
  });

  it("includes Codepliant disclaimer", () => {
    const result = generateDSARGuide(scanWithPayment, ctx)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("generates DSAR Handling Guide via orchestrator when services detected", () => {
    const docs = generateDocuments(scanWithPayment);
    const names = docs.map((d) => d.name);
    assert.ok(names.includes("DSAR Handling Guide"));
  });

  it("does not generate DSAR Handling Guide when no services", () => {
    const docs = generateDocuments(emptyScan);
    const names = docs.map((d) => d.name);
    assert.ok(!names.includes("DSAR Handling Guide"));
  });
});

// ============================================================
// generateIncidentResponsePlan
// ============================================================

describe("generateIncidentResponsePlan", () => {
  it("returns valid markdown with heading", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.startsWith("# Incident Response Plan"));
    assert.ok(result.toLowerCase().includes("last updated"));
  });

  it("always generates (even for empty scan)", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.length > 0);
    assert.ok(result.includes("## 1. Incident Classification"));
  });

  it("includes incident classification with severity levels", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("Critical (P1)"));
    assert.ok(result.includes("High (P2)"));
    assert.ok(result.includes("Medium (P3)"));
    assert.ok(result.includes("Low (P4)"));
  });

  it("includes detection and reporting procedures", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 2. Detection and Reporting Procedures"));
    assert.ok(result.includes("How to Report an Incident"));
  });

  it("includes 72-hour GDPR notification requirement", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 3. GDPR 72-Hour Notification Requirement"));
    assert.ok(result.includes("within 72 hours"));
    assert.ok(result.includes("Article 33"));
  });

  it("includes authority notification template", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 4. Authority Notification Template"));
    assert.ok(result.includes("PERSONAL DATA BREACH NOTIFICATION"));
  });

  it("includes user notification template", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 5. User Notification Template"));
    assert.ok(result.includes("Important Security Notice"));
  });

  it("includes investigation procedures", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 6. Investigation Procedures"));
    assert.ok(result.includes("Containment"));
    assert.ok(result.includes("Root cause"));
  });

  it("includes remediation steps", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 7. Remediation Steps"));
    assert.ok(result.includes("Rotate all potentially compromised secrets"));
  });

  it("includes post-incident review", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 8. Post-Incident Review"));
    assert.ok(result.includes("blameless post-mortem"));
  });

  it("includes contact list from config", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("## 9. Contact List"));
    assert.ok(result.includes("Incident Response Lead"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("uses company name from context", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contactEmail from context", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateIncidentResponsePlan(emptyScan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes AI incident handling section when AI detected", () => {
    const result = generateIncidentResponsePlan(scanWithAI, ctx);
    assert.ok(result.includes("AI Incident Handling"));
    assert.ok(result.includes("Data leak via AI"));
    assert.ok(result.includes("Prompt injection"));
    assert.ok(result.includes("Bias incident"));
    assert.ok(result.includes("Hallucination impact"));
  });

  it("does not include AI section when no AI", () => {
    const result = generateIncidentResponsePlan(scanWithPayment, ctx);
    assert.ok(!result.includes("AI Incident Handling"));
  });

  it("includes PCI incident procedures when payment detected", () => {
    const result = generateIncidentResponsePlan(scanWithPayment, ctx);
    assert.ok(result.includes("PCI DSS Incident Procedures"));
    assert.ok(result.includes("PCI Forensic Investigator"));
  });

  it("does not include PCI section when no payment", () => {
    const result = generateIncidentResponsePlan(scanWithAuth, ctx);
    assert.ok(!result.includes("PCI DSS Incident Procedures"));
  });

  it("includes HIPAA breach notification when health data detected", () => {
    const scanWithHealth = makeScan({
      services: [makeService("fhirpath", "other", ["patient data"])],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data detected", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scanWithHealth, ctx);
    assert.ok(result.includes("HIPAA Breach Notification"));
    assert.ok(result.includes("60 days"));
    assert.ok(result.includes("Protected Health Information"));
  });

  it("does not include HIPAA section when no health data", () => {
    const result = generateIncidentResponsePlan(scanWithPayment, ctx);
    assert.ok(!result.includes("HIPAA Breach Notification"));
  });

  it("includes all conditional sections when AI, payment, and health present", () => {
    const scanWithAllIncident = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment information"]),
      ],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data detected", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scanWithAllIncident, ctx);
    assert.ok(result.includes("AI Incident Handling"));
    assert.ok(result.includes("PCI DSS Incident Procedures"));
    assert.ok(result.includes("HIPAA Breach Notification"));
  });

  it("includes project name in disclaimer", () => {
    const result = generateIncidentResponsePlan(emptyScan, ctx);
    assert.ok(result.includes("test-project"));
  });

  it("uses securityEmail from context when provided", () => {
    const ctxWithSecurity: GeneratorContext = {
      ...ctx,
      securityEmail: "security@acme.com",
    };
    const result = generateIncidentResponsePlan(emptyScan, ctxWithSecurity);
    assert.ok(result.includes("security@acme.com"));
  });

  it("uses DPO details from context", () => {
    const ctxWithDPO: GeneratorContext = {
      ...ctx,
      dpoName: "Jane Doe",
      dpoEmail: "jane@acme.com",
    };
    const result = generateIncidentResponsePlan(emptyScan, ctxWithDPO);
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("jane@acme.com"));
  });
});

// ============================================================
// generateThirdPartyRiskAssessment
// ============================================================

describe("generateThirdPartyRiskAssessment", () => {
  it("returns null when fewer than 3 third-party services", () => {
    const result = generateThirdPartyRiskAssessment(scanWithPayment, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null for empty scan", () => {
    const result = generateThirdPartyRiskAssessment(emptyScan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when services are all self-hosted", () => {
    const selfHostedScan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("next-auth", "auth"),
        makeService("passport", "auth"),
      ],
    });
    const result = generateThirdPartyRiskAssessment(selfHostedScan, ctx);
    assert.strictEqual(result, null);
  });

  it("generates assessment when 3+ third-party services detected", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx);
    assert.ok(result !== null);
    assert.ok(result!.startsWith("# Third-Party Risk Assessment"));
  });

  it("includes risk matrix table", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("## Risk Matrix"));
    assert.ok(result.includes("| Vendor |"));
    assert.ok(result.includes("| Data Sensitivity |"));
    assert.ok(result.includes("| Geographic Risk |"));
    assert.ok(result.includes("| Overall Risk |"));
  });

  it("includes detailed vendor assessments", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("## Detailed Vendor Assessments"));
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("### PostHog"));
  });

  it("excludes self-hosted services", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(!result.includes("### NextAuth.js"));
  });

  it("includes data sensitivity levels", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("| high |") || result.includes("**Data Sensitivity** | high"));
    assert.ok(result.includes("| medium |") || result.includes("**Data Sensitivity** | medium"));
  });

  it("includes geographic risk information", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("| US |"));
    assert.ok(result.includes("Geographic Risk"));
  });

  it("includes compliance certifications", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("SOC 2 Type II"));
    assert.ok(result.includes("GDPR"));
  });

  it("includes data processing scope", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("**Processing Scope**"));
  });

  it("includes risk mitigation measures", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("Risk Mitigation Measures"));
  });

  it("includes vendor due diligence checklist", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("## Vendor Due Diligence Checklist"));
    assert.ok(result.includes("Security Assessment"));
    assert.ok(result.includes("Privacy Policy Review"));
    assert.ok(result.includes("Data Processing Agreement"));
    assert.ok(result.includes("Data Residency"));
    assert.ok(result.includes("Breach Notification"));
  });

  it("includes contract review requirements", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("## Contract Review Requirements"));
    assert.ok(result.includes("DPA (Data Processing Agreement)"));
    assert.ok(result.includes("Standard Contractual Clauses"));
    assert.ok(result.includes("BAA (Business Associate Agreement)"));
  });

  it("includes DPA minimum requirements", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("### DPA Minimum Requirements"));
    assert.ok(result.includes("Subject matter and duration"));
    assert.ok(result.includes("Audit rights"));
  });

  it("uses company name from context", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contact email from context", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes last updated date", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.toLowerCase().includes("last updated"));
  });

  it("includes project name", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("test-project"));
  });

  it("deduplicates providers with multiple packages", () => {
    const multiSentryScan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error data", "stack traces"]),
        makeService("@sentry/nextjs", "monitoring", ["error data", "stack traces"]),
        makeService("stripe", "payment", ["payment information"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(multiSentryScan, ctx)!;
    const sentryMatches = result.match(/### Sentry/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches!.length, 1);
  });

  it("includes review schedule", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("## Review Schedule"));
  });

  it("shows total vendor count", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    assert.ok(result.includes("Total third-party vendors assessed:"));
  });

  it("includes overall risk levels in matrix", () => {
    const result = generateThirdPartyRiskAssessment(scanWithAll, ctx)!;
    // Should contain at least one of the risk levels
    const hasRiskLevel =
      result.includes("| Critical |") ||
      result.includes("| High |") ||
      result.includes("| Medium |") ||
      result.includes("| Low |");
    assert.ok(hasRiskLevel, "Risk matrix should contain overall risk levels");
  });
});

// ============================================================
// generateDocuments (orchestrator)
// ============================================================

describe("generateDocuments", () => {
  it("generates Terms of Service, Security Policy, and Incident Response Plan for empty scan", () => {
    const docs = generateDocuments(emptyScan);
    assert.strictEqual(docs.length, 4);
    const names = docs.map((d) => d.name).sort();
    assert.deepStrictEqual(names, ["Dependency Vulnerability Scan", "Incident Response Plan", "Security Policy", "Terms of Service"]);
  });

  it("generates Privacy Policy and Terms when services present", () => {
    const docs = generateDocuments(scanWithPayment);
    const names = docs.map((d) => d.name);
    assert.ok(names.includes("Privacy Policy"));
    assert.ok(names.includes("Terms of Service"));
  });

  it("generates AI Disclosure when AI detected", () => {
    const docs = generateDocuments(scanWithAI);
    const names = docs.map((d) => d.name);
    assert.ok(names.includes("AI Disclosure"));
  });

  it("does not generate AI Disclosure when no AI", () => {
    const docs = generateDocuments(scanWithPayment);
    const names = docs.map((d) => d.name);
    assert.ok(!names.includes("AI Disclosure"));
  });

  it("generates Cookie Policy when analytics detected", () => {
    const docs = generateDocuments(scanWithAnalytics);
    const names = docs.map((d) => d.name);
    assert.ok(names.includes("Cookie Policy"));
  });

  it("does not generate Cookie Policy when no analytics/auth", () => {
    const docs = generateDocuments(scanWithAI);
    const names = docs.map((d) => d.name);
    assert.ok(!names.includes("Cookie Policy"));
  });

  it("generates all documents when all service types present", () => {
    const docs = generateDocuments(scanWithAll);
    const names = docs.map((d) => d.name).sort();
    assert.deepStrictEqual(names, [
      "AI Act Compliance Checklist",
      "AI Disclosure",
      "AI Model Card",
      "Compliance Notes",
      "Compliance Timeline",
      "Consent Management Guide",
      "Cookie Policy",
      "DSAR Handling Guide",
      "Data Classification Report",
      "Data Flow Map",
      "Data Processing Agreement",
      "Data Retention Policy",
      "Dependency Vulnerability Scan",
      "Incident Response Plan",
      "Privacy Impact Assessment",
      "Privacy Policy",
      "Regulatory Updates",
      "Security Policy",
      "Sub-Processor List",
      "Terms of Service",
      "Third-Party Risk Assessment",
      "Vendor Contacts Directory",
    ]);
  });

  it("applies config values to generated documents", () => {
    const config = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      outputDir: "legal",
      jurisdiction: "State of Delaware, USA",
    };
    const docs = generateDocuments(scanWithAll, config);
    // Some documents (env audit, vulnerability scan) are path-based and don't use config values
    const pathBasedDocs = new Set(["Environment Variable Audit", "Dependency Vulnerability Scan"]);
    for (const doc of docs) {
      if (pathBasedDocs.has(doc.name)) continue;
      assert.ok(doc.content.includes("Acme Corp") || doc.content.includes("privacy@acme.com"),
        `${doc.name} should use config values`);
    }
  });

  it("sets correct filenames", () => {
    const docs = generateDocuments(scanWithAll);
    const filenames = docs.map((d) => d.filename).sort();
    assert.deepStrictEqual(filenames, [
      "AI_ACT_CHECKLIST.md",
      "AI_DISCLOSURE.md",
      "AI_MODEL_CARD.md",
      "COMPLIANCE_NOTES.md",
      "COMPLIANCE_TIMELINE.md",
      "CONSENT_MANAGEMENT_GUIDE.md",
      "COOKIE_POLICY.md",
      "DATA_CLASSIFICATION.md",
      "DATA_FLOW_MAP.md",
      "DATA_PROCESSING_AGREEMENT.md",
      "DATA_RETENTION_POLICY.md",
      "DSAR_HANDLING_GUIDE.md",
      "INCIDENT_RESPONSE_PLAN.md",
      "PRIVACY_IMPACT_ASSESSMENT.md",
      "PRIVACY_POLICY.md",
      "REGULATORY_UPDATES.md",
      "SECURITY.md",
      "SUBPROCESSOR_LIST.md",
      "TERMS_OF_SERVICE.md",
      "THIRD_PARTY_RISK_ASSESSMENT.md",
      "VENDOR_CONTACTS.md",
      "VULNERABILITY_SCAN.md",
    ]);
  });
});

// ── AI Model Card ──────────────────────────────────────────────────────

describe("generateAIModelCard", () => {
  it("returns null when no AI services detected", () => {
    const result = generateAIModelCard(emptyScan);
    assert.strictEqual(result, null);
  });

  it("returns null for non-AI services only", () => {
    const result = generateAIModelCard(scanWithPayment);
    assert.strictEqual(result, null);
  });

  it("generates model card when AI services detected", () => {
    const result = generateAIModelCard(scanWithAI, ctx);
    assert.ok(result !== null);
    assert.ok(result!.includes("# AI Model Card"));
  });

  it("includes Article 53 compliance section", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Article 53 Compliance Summary"));
    assert.ok(result.includes("53(1)"));
  });

  it("includes model name for known providers", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("OpenAI GPT-4"));
  });

  it("includes provider name", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("OpenAI"));
  });

  it("includes data inputs from scan", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("user prompts"));
    assert.ok(result.includes("conversation history"));
    assert.ok(result.includes("generated content"));
  });

  it("includes known limitations", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Known Limitations"));
    assert.ok(result.includes("hallucination") || result.includes("factually incorrect"));
  });

  it("includes bias considerations", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Bias Considerations"));
    assert.ok(result.includes("bias"));
  });

  it("includes performance metrics placeholder", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Performance Metrics"));
    assert.ok(result.includes("_To be measured_"));
  });

  it("includes training data transparency link", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Training Data Transparency"));
    assert.ok(result.includes("openai.com/research"));
  });

  it("includes risk classification", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Risk Classification"));
  });

  it("uses company name from context", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("includes data flow summary", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Data Flow Summary"));
  });

  it("generates cards for multiple AI services", () => {
    const multiAIScan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts", "generated content"]),
        makeService("@anthropic-ai/sdk", "ai", ["user prompts", "conversation history"]),
      ],
    });
    const result = generateAIModelCard(multiAIScan, ctx)!;
    assert.ok(result.includes("OpenAI GPT-4"));
    assert.ok(result.includes("Anthropic Claude"));
  });

  it("handles unknown AI services with fallback", () => {
    const unknownAIScan = makeScan({
      services: [
        makeService("some-unknown-ai-service", "ai", ["user data"]),
      ],
    });
    const result = generateAIModelCard(unknownAIScan, ctx)!;
    assert.ok(result !== null);
    assert.ok(result.includes("some-unknown-ai-service"));
    assert.ok(result.includes("consult provider documentation") || result.includes("Consult provider"));
  });

  it("includes Codepliant disclaimer", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed"));
  });

  it("includes DPO email when provided", () => {
    const ctxWithDpo = { ...ctx, dpoEmail: "dpo@acme.com" };
    const result = generateAIModelCard(scanWithAI, ctxWithDpo)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("includes contact email", () => {
    const result = generateAIModelCard(scanWithAI, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });
});
