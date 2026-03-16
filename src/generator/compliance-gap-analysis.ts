import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a Compliance Gap Analysis — COMPLIANCE_GAP_ANALYSIS.md
 * Compares current state vs target state per regulation.
 * Auto-populated from scan results + existing docs.
 */

interface GapItem {
  requirement: string;
  regulation: string;
  currentState: string;
  targetState: string;
  gap: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
}

function priorityOrder(p: GapItem["priority"]): number {
  switch (p) {
    case "Critical": return 0;
    case "High": return 1;
    case "Medium": return 2;
    case "Low": return 3;
  }
}

export function generateComplianceGapAnalysis(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];
  const services = scan.services;
  const serviceCount = services.length;
  const complianceNeeds = scan.complianceNeeds || [];

  const hasAI = services.some((s) => s.category === "ai");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = services.some((s) => s.category === "auth");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasEmail = services.some((s) => s.category === "email");
  const hasDPO = !!(ctx?.dpoName || ctx?.dpoEmail);
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || jurisdictions.length === 0;
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  // Identify required docs
  const requiredDocs = new Set(complianceNeeds.filter((n) => n.priority === "required").map((n) => n.document));

  const gaps: GapItem[] = [];

  // --- GDPR gaps ---
  if (hasGDPR) {
    // Art. 13/14 — Privacy notice
    const hasPrivacy = requiredDocs.has("Privacy Policy") || complianceNeeds.some((n) => n.document === "Privacy Policy");
    gaps.push({
      requirement: "Privacy Notice (Art. 13/14)",
      regulation: "GDPR",
      currentState: hasPrivacy ? "Privacy Policy generated from code scan" : "No privacy notice detected",
      targetState: "Complete privacy notice published on website, covering all data processing activities",
      gap: hasPrivacy ? "Review placeholders and publish to website" : "Generate and publish privacy notice",
      priority: hasPrivacy ? "High" : "Critical",
      effort: hasPrivacy ? "Low" : "Medium",
    });

    // Art. 30 — Record of Processing
    gaps.push({
      requirement: "Record of Processing Activities (Art. 30)",
      regulation: "GDPR",
      currentState: `${serviceCount} services detected via code scan`,
      targetState: "Complete ROPA covering all processing activities with lawful bases",
      gap: "Review auto-generated ROPA; add manual processing activities not captured by code scan",
      priority: "High",
      effort: "Medium",
    });

    // Art. 35 — DPIA
    if (hasAI || serviceCount >= 5) {
      gaps.push({
        requirement: "Data Protection Impact Assessment (Art. 35)",
        regulation: "GDPR",
        currentState: hasAI ? "AI services detected — DPIA likely required" : "Large-scale data processing detected",
        targetState: "Completed DPIA for all high-risk processing activities",
        gap: "Conduct formal DPIA with risk assessment and DPO consultation",
        priority: "Critical",
        effort: "High",
      });
    }

    // Art. 37 — DPO
    if (!hasDPO) {
      gaps.push({
        requirement: "Data Protection Officer (Art. 37)",
        regulation: "GDPR",
        currentState: "No DPO configured",
        targetState: "DPO appointed and registered with supervisory authority",
        gap: "Appoint DPO or document exemption rationale",
        priority: "High",
        effort: "Medium",
      });
    }

    // Art. 33 — Breach notification
    gaps.push({
      requirement: "Breach Notification (Art. 33/34)",
      regulation: "GDPR",
      currentState: "Incident response plan generated",
      targetState: "72-hour breach notification procedure tested and operational",
      gap: "Conduct tabletop exercise; establish supervisory authority contact procedure",
      priority: "Critical",
      effort: "Medium",
    });

    // Art. 17 — Right to erasure
    if (hasDatabase || hasAuth) {
      gaps.push({
        requirement: "Right to Erasure (Art. 17)",
        regulation: "GDPR",
        currentState: "Data deletion procedures documented",
        targetState: "Automated data deletion across all services with verification",
        gap: "Implement automated deletion workflows; verify completeness across sub-processors",
        priority: "High",
        effort: "High",
      });
    }

    // Art. 28 — Processor agreements
    if (serviceCount >= 2) {
      gaps.push({
        requirement: "Processor Agreements (Art. 28)",
        regulation: "GDPR",
        currentState: `${serviceCount} third-party services detected`,
        targetState: "Signed DPAs with all sub-processors; annual review process",
        gap: `Obtain signed DPAs from all ${serviceCount} detected sub-processors`,
        priority: "High",
        effort: "Medium",
      });
    }

    // Consent management
    if (hasAnalytics) {
      gaps.push({
        requirement: "Consent Management (Art. 6/7)",
        regulation: "GDPR",
        currentState: "Analytics/advertising services detected — consent required",
        targetState: "CMP deployed; consent recorded before any tracking; withdrawal mechanism operational",
        gap: "Deploy consent management platform; block trackers until consent obtained",
        priority: "Critical",
        effort: "Medium",
      });
    }
  }

  // --- CCPA gaps ---
  if (hasCCPA) {
    gaps.push({
      requirement: "Do Not Sell My Personal Information",
      regulation: "CCPA/CPRA",
      currentState: hasAnalytics ? "Third-party data sharing detected" : "No sharing detected",
      targetState: "DNS link on homepage; opt-out mechanism operational",
      gap: hasAnalytics ? "Implement opt-out mechanism for data sharing" : "Add DNS link as precautionary measure",
      priority: hasAnalytics ? "Critical" : "Medium",
      effort: "Medium",
    });

    gaps.push({
      requirement: "Consumer Data Request Handling",
      regulation: "CCPA/CPRA",
      currentState: "DSAR guide generated",
      targetState: "Automated consumer request portal; 45-day response process verified",
      gap: "Implement self-service data request portal; establish 45-day SLA tracking",
      priority: "High",
      effort: "High",
    });
  }

  // --- EU AI Act gaps ---
  if (hasAI) {
    gaps.push({
      requirement: "AI System Transparency (Art. 50)",
      regulation: "EU AI Act",
      currentState: "AI disclosure and model card generated",
      targetState: "AI usage disclosed in product UI; users informed before AI interaction",
      gap: "Add in-product AI disclosure; link to model card from UI",
      priority: "Critical",
      effort: "Low",
    });

    gaps.push({
      requirement: "AI Risk Classification",
      regulation: "EU AI Act",
      currentState: ctx?.aiRiskLevel ? `Risk level set to: ${ctx.aiRiskLevel}` : "AI risk level not classified",
      targetState: "All AI systems classified; high-risk systems registered in EU database",
      gap: ctx?.aiRiskLevel ? "Document classification rationale; register if high-risk" : "Classify AI systems by risk level",
      priority: "High",
      effort: "Medium",
    });

    gaps.push({
      requirement: "Human Oversight (Art. 14)",
      regulation: "EU AI Act",
      currentState: "AI governance framework generated",
      targetState: "Human oversight mechanisms implemented; override capabilities documented",
      gap: "Implement human review workflow for AI decisions; document override procedures",
      priority: "High",
      effort: "High",
    });
  }

  // --- PCI DSS gaps ---
  if (hasPayment) {
    gaps.push({
      requirement: "PCI DSS Compliance",
      regulation: "PCI DSS",
      currentState: "Payment processors detected via code scan",
      targetState: "PCI DSS SAQ completed; tokenization verified; no raw card data stored",
      gap: "Complete PCI DSS Self-Assessment Questionnaire; verify tokenization implementation",
      priority: "Critical",
      effort: "High",
    });
  }

  // --- ePrivacy gaps ---
  if (hasAnalytics) {
    gaps.push({
      requirement: "Cookie Consent (ePrivacy Directive)",
      regulation: "ePrivacy",
      currentState: "Cookie inventory generated; analytics services detected",
      targetState: "Cookie banner deployed; consent recorded; non-essential cookies blocked until consent",
      gap: "Deploy CMP with granular cookie categories; implement server-side consent enforcement",
      priority: "High",
      effort: "Medium",
    });
  }

  // --- SOC 2 gaps ---
  if (serviceCount >= 3) {
    gaps.push({
      requirement: "SOC 2 Type II Audit Readiness",
      regulation: "SOC 2",
      currentState: "Security and access control policies generated",
      targetState: "SOC 2 Type II audit completed; evidence collection automated",
      gap: "Map controls to Trust Service Criteria; begin 6-month evidence collection period",
      priority: "Medium",
      effort: "High",
    });
  }

  // Sort by priority
  gaps.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

  // Calculate summary stats
  const criticalCount = gaps.filter((g) => g.priority === "Critical").length;
  const highCount = gaps.filter((g) => g.priority === "High").length;
  const mediumCount = gaps.filter((g) => g.priority === "Medium").length;
  const lowCount = gaps.filter((g) => g.priority === "Low").length;

  const sections: string[] = [];

  sections.push(`# Compliance Gap Analysis — ${company}`);
  sections.push("");
  sections.push(`> Auto-generated by Codepliant on ${date}.`);
  sections.push(`> Compares current compliance state (from code analysis) against regulatory target state.`);
  sections.push(`> This analysis should be validated by qualified legal and compliance professionals.`);
  sections.push("");

  // Executive summary
  sections.push("## Executive Summary");
  sections.push("");
  sections.push(`| Metric | Value |`);
  sections.push(`|--------|-------|`);
  sections.push(`| Total Gaps Identified | **${gaps.length}** |`);
  if (criticalCount > 0) sections.push(`| Critical Gaps | **${criticalCount}** |`);
  if (highCount > 0) sections.push(`| High Priority Gaps | **${highCount}** |`);
  if (mediumCount > 0) sections.push(`| Medium Priority Gaps | **${mediumCount}** |`);
  if (lowCount > 0) sections.push(`| Low Priority Gaps | **${lowCount}** |`);
  sections.push(`| Services Analyzed | ${serviceCount} |`);
  sections.push(`| Regulations Covered | ${[...new Set(gaps.map((g) => g.regulation))].join(", ")} |`);
  sections.push("");

  // Gap table
  sections.push("## Gap Analysis Table");
  sections.push("");
  sections.push("| Requirement | Current State | Target State | Gap | Priority | Effort |");
  sections.push("|-------------|---------------|--------------|-----|----------|--------|");

  for (const gap of gaps) {
    const pIcon = gap.priority === "Critical" ? "🔴" : gap.priority === "High" ? "🟠" : gap.priority === "Medium" ? "🟡" : "🟢";
    sections.push(
      `| ${gap.requirement} | ${gap.currentState} | ${gap.targetState} | ${gap.gap} | ${pIcon} ${gap.priority} | ${gap.effort} |`,
    );
  }
  sections.push("");

  // Per-regulation breakdown
  const regulations = [...new Set(gaps.map((g) => g.regulation))];

  sections.push("## Per-Regulation Breakdown");
  sections.push("");

  for (const reg of regulations) {
    const regGaps = gaps.filter((g) => g.regulation === reg);
    const regCritical = regGaps.filter((g) => g.priority === "Critical").length;
    const regHigh = regGaps.filter((g) => g.priority === "High").length;

    sections.push(`### ${reg}`);
    sections.push("");
    sections.push(`**${regGaps.length} gaps identified** (${regCritical} critical, ${regHigh} high)`);
    sections.push("");

    for (const gap of regGaps) {
      const pIcon = gap.priority === "Critical" ? "🔴" : gap.priority === "High" ? "🟠" : gap.priority === "Medium" ? "🟡" : "🟢";
      sections.push(`- ${pIcon} **${gap.requirement}**: ${gap.gap} *(Effort: ${gap.effort})*`);
    }
    sections.push("");
  }

  // Remediation roadmap
  sections.push("## Remediation Roadmap");
  sections.push("");
  sections.push("### Immediate (Week 1) — Critical Gaps");
  sections.push("");
  const criticalGaps = gaps.filter((g) => g.priority === "Critical");
  if (criticalGaps.length > 0) {
    for (const g of criticalGaps) {
      sections.push(`- [ ] **${g.requirement}** (${g.regulation}): ${g.gap}`);
    }
  } else {
    sections.push("No critical gaps identified.");
  }
  sections.push("");

  sections.push("### Short-term (Weeks 2-4) — High Priority Gaps");
  sections.push("");
  const highGaps = gaps.filter((g) => g.priority === "High");
  if (highGaps.length > 0) {
    for (const g of highGaps) {
      sections.push(`- [ ] **${g.requirement}** (${g.regulation}): ${g.gap}`);
    }
  } else {
    sections.push("No high priority gaps identified.");
  }
  sections.push("");

  sections.push("### Medium-term (Months 2-3) — Medium Priority Gaps");
  sections.push("");
  const medGaps = gaps.filter((g) => g.priority === "Medium");
  if (medGaps.length > 0) {
    for (const g of medGaps) {
      sections.push(`- [ ] **${g.requirement}** (${g.regulation}): ${g.gap}`);
    }
  } else {
    sections.push("No medium priority gaps identified.");
  }
  sections.push("");

  // Disclaimer
  sections.push("---");
  sections.push("");
  sections.push(
    "*This gap analysis is generated from automated code analysis and regulatory checklists. It does not constitute legal advice. Have this document reviewed by a qualified compliance professional before acting on it.*",
  );
  sections.push("");

  return sections.join("\n");
}
