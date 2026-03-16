import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate REGULATORY_READINESS_SCORECARD.md — per-regulation readiness
 * score with visual progress bars and action items to reach 100%.
 */

interface RegulationCheck {
  name: string;
  weight: number;
  met: boolean;
  action: string;
}

interface RegulationAssessment {
  regulation: string;
  description: string;
  checks: RegulationCheck[];
}

function bar(pct: number): string {
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}

function assessGDPR(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
  serviceCount: number,
  hasAuth: boolean,
  hasAnalytics: boolean,
  hasAI: boolean,
  hasDatabase: boolean,
  hasDPO: boolean,
): RegulationAssessment {
  const checks: RegulationCheck[] = [];

  // Art. 13/14 — Privacy notice
  checks.push({
    name: "Privacy Notice (Art. 13/14)",
    weight: 15,
    met: serviceCount > 0, // generated if services exist
    action: "Generate and publish privacy notice covering all processing activities",
  });

  // Art. 30 — Record of Processing
  checks.push({
    name: "Record of Processing Activities (Art. 30)",
    weight: 10,
    met: serviceCount > 0,
    action: "Review auto-generated ROPA; add any manual processing activities",
  });

  // Art. 35 — DPIA
  const dpiaRequired = hasAI || serviceCount >= 5;
  checks.push({
    name: "Data Protection Impact Assessment (Art. 35)",
    weight: dpiaRequired ? 15 : 5,
    met: !dpiaRequired, // met if not required; else action needed
    action: dpiaRequired
      ? "Conduct formal DPIA for high-risk processing activities"
      : "Monitor for processing that triggers DPIA requirement",
  });

  // Art. 37 — DPO
  checks.push({
    name: "Data Protection Officer (Art. 37)",
    weight: 10,
    met: hasDPO,
    action: "Appoint a DPO or document exemption rationale in config",
  });

  // Art. 6/7 — Consent management
  checks.push({
    name: "Consent Management (Art. 6/7)",
    weight: hasAnalytics ? 15 : 5,
    met: !hasAnalytics, // if no analytics, consent management is simpler
    action: "Deploy a Consent Management Platform; block trackers until consent is obtained",
  });

  // Art. 28 — Processor agreements
  checks.push({
    name: "Processor Agreements (Art. 28)",
    weight: 10,
    met: serviceCount < 2,
    action: `Obtain signed DPAs from all ${serviceCount} detected sub-processors`,
  });

  // Art. 33/34 — Breach notification
  checks.push({
    name: "Breach Notification Procedure (Art. 33/34)",
    weight: 10,
    met: false, // always needs manual validation
    action: "Establish 72-hour breach notification procedure and conduct tabletop exercise",
  });

  // Art. 17 — Right to erasure
  checks.push({
    name: "Right to Erasure (Art. 17)",
    weight: hasDatabase || hasAuth ? 10 : 5,
    met: false, // always needs manual validation
    action: "Implement automated data deletion workflows across all services",
  });

  // Art. 25 — Privacy by design
  checks.push({
    name: "Privacy by Design (Art. 25)",
    weight: 10,
    met: !!(ctx?.companyName && ctx.companyName !== "[Your Company Name]"),
    action: "Document privacy-by-design practices in development workflow",
  });

  // Jurisdictions configured
  checks.push({
    name: "Jurisdictional Scope Defined",
    weight: 5,
    met: !!(ctx?.jurisdictions && ctx.jurisdictions.length > 0),
    action: "Define applicable jurisdictions in .codepliantrc.json",
  });

  return {
    regulation: "GDPR",
    description: "EU General Data Protection Regulation",
    checks,
  };
}

function assessCCPA(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
  serviceCount: number,
  hasAnalytics: boolean,
): RegulationAssessment {
  const checks: RegulationCheck[] = [];

  checks.push({
    name: "Privacy Policy with CCPA Disclosures",
    weight: 20,
    met: serviceCount > 0,
    action: "Ensure privacy policy includes categories of PI collected, sold, and disclosed",
  });

  checks.push({
    name: "Do Not Sell My Personal Information Link",
    weight: 20,
    met: !hasAnalytics,
    action: "Add \"Do Not Sell\" link to homepage; implement opt-out mechanism",
  });

  checks.push({
    name: "Consumer Request Handling (45-day SLA)",
    weight: 20,
    met: false,
    action: "Implement self-service data request portal with 45-day SLA tracking",
  });

  checks.push({
    name: "Right to Know / Access",
    weight: 15,
    met: false,
    action: "Build data export functionality covering all personal information categories",
  });

  checks.push({
    name: "Right to Delete",
    weight: 15,
    met: false,
    action: "Implement deletion across all data stores with verification",
  });

  checks.push({
    name: "Non-Discrimination Clause",
    weight: 10,
    met: serviceCount > 0, // included in generated privacy policy
    action: "Document non-discrimination commitment in privacy notice",
  });

  return {
    regulation: "CCPA/CPRA",
    description: "California Consumer Privacy Act / California Privacy Rights Act",
    checks,
  };
}

function assessEUAIAct(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): RegulationAssessment {
  const checks: RegulationCheck[] = [];

  checks.push({
    name: "AI System Transparency (Art. 50)",
    weight: 20,
    met: true, // AI disclosure generated
    action: "Add in-product AI disclosure; link to model card from UI",
  });

  checks.push({
    name: "AI Risk Classification",
    weight: 20,
    met: !!ctx?.aiRiskLevel,
    action: "Classify AI systems by risk level in .codepliantrc.json (aiRiskLevel)",
  });

  checks.push({
    name: "Human Oversight (Art. 14)",
    weight: 20,
    met: false,
    action: "Implement human review workflow for AI decisions; document override procedures",
  });

  checks.push({
    name: "AI Model Documentation",
    weight: 15,
    met: true, // AI model card generated
    action: "Maintain AI model card with training data, performance metrics, limitations",
  });

  checks.push({
    name: "AI Governance Framework",
    weight: 15,
    met: !!ctx?.aiUsageDescription,
    action: "Document AI usage purpose and establish governance committee",
  });

  checks.push({
    name: "Bias Monitoring & Testing",
    weight: 10,
    met: false,
    action: "Implement bias testing and fairness metrics for AI outputs",
  });

  return {
    regulation: "EU AI Act",
    description: "European Union Artificial Intelligence Act",
    checks,
  };
}

function assessPCIDSS(): RegulationAssessment {
  const checks: RegulationCheck[] = [];

  checks.push({
    name: "Tokenization / No Raw Card Storage",
    weight: 25,
    met: true, // using a payment processor implies tokenization
    action: "Verify that no raw card data is stored; use processor tokenization",
  });

  checks.push({
    name: "PCI DSS Self-Assessment Questionnaire",
    weight: 25,
    met: false,
    action: "Complete the appropriate PCI DSS SAQ for your merchant level",
  });

  checks.push({
    name: "Network Security Controls",
    weight: 20,
    met: false,
    action: "Implement firewall rules, encryption in transit, and access controls",
  });

  checks.push({
    name: "Vulnerability Management",
    weight: 15,
    met: false,
    action: "Conduct quarterly vulnerability scans and annual penetration tests",
  });

  checks.push({
    name: "Access Control & Monitoring",
    weight: 15,
    met: false,
    action: "Implement least-privilege access and audit logging for payment systems",
  });

  return {
    regulation: "PCI DSS",
    description: "Payment Card Industry Data Security Standard",
    checks,
  };
}

function assessSOC2(serviceCount: number): RegulationAssessment {
  const checks: RegulationCheck[] = [];

  checks.push({
    name: "Security Policy Documentation",
    weight: 20,
    met: true, // security policy generated
    action: "Review and publish security policies; assign document owners",
  });

  checks.push({
    name: "Access Control Policy",
    weight: 20,
    met: serviceCount >= 3,
    action: "Implement role-based access control with periodic access reviews",
  });

  checks.push({
    name: "Change Management Process",
    weight: 15,
    met: false,
    action: "Document change management procedures with approval workflows",
  });

  checks.push({
    name: "Incident Response Plan",
    weight: 15,
    met: true, // incident response plan generated
    action: "Test incident response plan with tabletop exercises",
  });

  checks.push({
    name: "Vendor Risk Management",
    weight: 15,
    met: serviceCount >= 3,
    action: "Conduct vendor risk assessments for all critical third-party services",
  });

  checks.push({
    name: "Evidence Collection & Audit Trail",
    weight: 15,
    met: false,
    action: "Begin 6-month evidence collection period; automate evidence gathering",
  });

  return {
    regulation: "SOC 2",
    description: "Service Organization Control Type 2",
    checks,
  };
}

function computeScore(checks: RegulationCheck[]): number {
  const totalWeight = checks.reduce((sum, ch) => sum + ch.weight, 0);
  if (totalWeight === 0) return 0;
  const earned = checks.filter((ch) => ch.met).reduce((sum, ch) => sum + ch.weight, 0);
  return Math.round((earned / totalWeight) * 100);
}

export function generateRegulatoryReadinessScorecard(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const services = scan.services;
  const serviceCount = services.length;

  const hasAI = services.some((s) => s.category === "ai");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = services.some((s) => s.category === "auth");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasDPO = !!(ctx?.dpoName || ctx?.dpoEmail);
  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || jurisdictions.length === 0;
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  // Build assessments
  const assessments: RegulationAssessment[] = [];

  if (hasGDPR) {
    assessments.push(assessGDPR(scan, ctx, serviceCount, hasAuth, hasAnalytics, hasAI, hasDatabase, hasDPO));
  }
  if (hasCCPA) {
    assessments.push(assessCCPA(scan, ctx, serviceCount, hasAnalytics));
  }
  if (hasAI) {
    assessments.push(assessEUAIAct(scan, ctx));
  }
  if (hasPayment) {
    assessments.push(assessPCIDSS());
  }
  if (serviceCount >= 3) {
    assessments.push(assessSOC2(serviceCount));
  }

  // If no assessments apply (unlikely with services), bail
  if (assessments.length === 0) {
    return null;
  }

  const lines: string[] = [];

  lines.push(`# Regulatory Readiness Scorecard — ${company}`);
  lines.push("");
  lines.push(`> Auto-generated by Codepliant on ${date}.`);
  lines.push(`> Per-regulation readiness scores with visual progress indicators.`);
  lines.push(`> This scorecard should be reviewed by qualified legal and compliance professionals.`);
  lines.push("");

  // Overall summary
  const scores = assessments.map((a) => ({ reg: a.regulation, score: computeScore(a.checks) }));
  const overallScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  lines.push("## Overall Readiness");
  lines.push("");
  lines.push(`**Overall Score: ${overallScore}%** ${bar(overallScore)}`);
  lines.push("");

  // Quick summary table
  lines.push("| Regulation | Score | Progress |");
  lines.push("|------------|-------|----------|");
  for (const s of scores) {
    lines.push(`| ${s.reg} | **${s.score}%** | ${bar(s.score)} |`);
  }
  lines.push("");

  // Per-regulation details
  lines.push("## Per-Regulation Assessment");
  lines.push("");

  for (const assessment of assessments) {
    const score = computeScore(assessment.checks);
    lines.push(`### ${assessment.regulation} — ${score}% ${bar(score)}`);
    lines.push("");
    lines.push(`*${assessment.description}*`);
    lines.push("");

    // Checks table
    lines.push("| Requirement | Status | Weight |");
    lines.push("|-------------|--------|--------|");
    for (const check of assessment.checks) {
      const status = check.met ? "Ready" : "Action Needed";
      const icon = check.met ? "+" : "-";
      lines.push(`| ${check.name} | ${icon} ${status} | ${check.weight}% |`);
    }
    lines.push("");

    // Action items for unmet checks
    const unmet = assessment.checks.filter((ch) => !ch.met);
    if (unmet.length > 0) {
      lines.push(`**Action items to reach 100%:**`);
      lines.push("");
      for (const check of unmet) {
        lines.push(`- [ ] **${check.name}** (${check.weight}%): ${check.action}`);
      }
      lines.push("");
    } else {
      lines.push("All requirements met for this regulation.");
      lines.push("");
    }
  }

  // Priority action plan
  lines.push("## Priority Action Plan");
  lines.push("");

  // Collect all unmet checks across regulations, sorted by weight
  const allUnmet: { regulation: string; check: RegulationCheck }[] = [];
  for (const assessment of assessments) {
    for (const check of assessment.checks) {
      if (!check.met) {
        allUnmet.push({ regulation: assessment.regulation, check });
      }
    }
  }
  allUnmet.sort((a, b) => b.check.weight - a.check.weight);

  if (allUnmet.length > 0) {
    lines.push("### High-Impact Actions (sorted by regulatory weight)");
    lines.push("");
    const top = allUnmet.slice(0, 10);
    for (let i = 0; i < top.length; i++) {
      const item = top[i];
      lines.push(`${i + 1}. **[${item.regulation}] ${item.check.name}** (${item.check.weight}%): ${item.check.action}`);
    }
    lines.push("");

    if (allUnmet.length > 10) {
      lines.push(`*... and ${allUnmet.length - 10} more action items across all regulations.*`);
      lines.push("");
    }
  } else {
    lines.push("Congratulations — all assessed regulatory requirements are met!");
    lines.push("");
  }

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    "*This regulatory readiness scorecard is generated from automated code analysis. Scores reflect documentation and configuration readiness, not full legal compliance. This does not constitute legal advice. Have this assessment reviewed by qualified compliance professionals.*",
  );
  lines.push("");

  return lines.join("\n");
}
