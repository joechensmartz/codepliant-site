import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates EXECUTIVE_DASHBOARD.md — a one-page compliance overview for C-suite.
 * Includes traffic light status per regulation, top risks with dollar impact
 * estimates, and a timeline of upcoming deadlines.
 *
 * Returns null when no services are detected.
 */

interface RegulationStatus {
  name: string;
  fullName: string;
  status: "green" | "yellow" | "red";
  label: string;
  summary: string;
}

interface RiskItem {
  title: string;
  dollarImpact: string;
  description: string;
}

interface Deadline {
  date: string;
  regulation: string;
  action: string;
}

function trafficLight(status: "green" | "yellow" | "red"): string {
  switch (status) {
    case "green":
      return "🟢";
    case "yellow":
      return "🟡";
    case "red":
      return "🔴";
  }
}

function assessGDPR(scan: ScanResult, ctx?: GeneratorContext): RegulationStatus {
  const hasEU =
    ctx?.jurisdictions?.some((j) => j === "GDPR" || j === "UK GDPR") ||
    ctx?.jurisdiction === "GDPR" ||
    ctx?.jurisdiction === "UK GDPR";
  const hasDataProcessors = scan.services.filter((s) => s.isDataProcessor !== false).length > 0;

  if (!hasEU && !hasDataProcessors) {
    return {
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      status: "green",
      label: "Low Exposure",
      summary: "No EU jurisdiction configured and minimal data processing detected.",
    };
  }

  if (hasEU) {
    const hasAuth = scan.services.some((s) => s.category === "auth");
    const hasAnalytics = scan.services.some((s) => s.category === "analytics");
    const serviceCount = scan.services.filter((s) => s.isDataProcessor !== false).length;

    if (serviceCount >= 5 && (hasAuth || hasAnalytics)) {
      return {
        name: "GDPR",
        fullName: "General Data Protection Regulation",
        status: "yellow",
        label: "Action Required",
        summary: `${serviceCount} data processors detected with auth/analytics. DPA and consent mechanisms needed.`,
      };
    }

    return {
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      status: "yellow",
      label: "In Progress",
      summary: "EU jurisdiction configured. Ensure all documentation is reviewed by legal counsel.",
    };
  }

  return {
    name: "GDPR",
    fullName: "General Data Protection Regulation",
    status: "yellow",
    label: "Review Needed",
    summary: "Data processors detected. Assess whether GDPR applies to your user base.",
  };
}

function assessCCPA(scan: ScanResult, ctx?: GeneratorContext): RegulationStatus {
  const hasUS = ctx?.jurisdictions?.some((j) => j === "CCPA");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics" || s.category === "advertising");

  if (!hasUS && !hasAnalytics) {
    return {
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      status: "green",
      label: "Low Exposure",
      summary: "No California jurisdiction and no advertising/analytics tracking detected.",
    };
  }

  if (hasAnalytics) {
    return {
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      status: "yellow",
      label: "Action Required",
      summary: "Analytics/advertising services detected. \"Do Not Sell\" opt-out mechanism required for CA users.",
    };
  }

  return {
    name: "CCPA",
    fullName: "California Consumer Privacy Act",
    status: "yellow",
    label: "Review Needed",
    summary: "CCPA jurisdiction configured. Verify consumer rights mechanisms are in place.",
  };
}

function assessAIAct(scan: ScanResult, ctx?: GeneratorContext): RegulationStatus {
  const hasAI = scan.services.some((s) => s.category === "ai");

  if (!hasAI) {
    return {
      name: "EU AI Act",
      fullName: "EU Artificial Intelligence Act",
      status: "green",
      label: "Not Applicable",
      summary: "No AI services detected in the codebase.",
    };
  }

  const aiServices = scan.services.filter((s) => s.category === "ai");
  const riskLevel = ctx?.aiRiskLevel || "limited";

  if (riskLevel === "high") {
    return {
      name: "EU AI Act",
      fullName: "EU Artificial Intelligence Act",
      status: "red",
      label: "High Risk",
      summary: `${aiServices.length} AI service(s) classified as high-risk. Conformity assessment and registration required.`,
    };
  }

  return {
    name: "EU AI Act",
    fullName: "EU Artificial Intelligence Act",
    status: "yellow",
    label: "Transparency Required",
    summary: `${aiServices.length} AI service(s) detected. Transparency obligations apply under Art. 52.`,
  };
}

function assessPCIDSS(scan: ScanResult): RegulationStatus {
  const hasPayment = scan.services.some((s) => s.category === "payment");

  if (!hasPayment) {
    return {
      name: "PCI DSS",
      fullName: "Payment Card Industry Data Security Standard",
      status: "green",
      label: "Not Applicable",
      summary: "No payment processing services detected.",
    };
  }

  const paymentServices = scan.services.filter((s) => s.category === "payment");

  return {
    name: "PCI DSS",
    fullName: "Payment Card Industry Data Security Standard",
    status: "yellow",
    label: "Compliance Required",
    summary: `${paymentServices.length} payment service(s) detected (${paymentServices.map((s) => s.name).join(", ")}). SAQ completion required.`,
  };
}

function assessHIPAA(scan: ScanResult): RegulationStatus {
  const hasHealthData = scan.complianceNeeds.some(
    (n) => n.document === "HIPAA Compliance" || n.reason.toLowerCase().includes("hipaa"),
  );

  if (!hasHealthData) {
    return {
      name: "HIPAA",
      fullName: "Health Insurance Portability and Accountability Act",
      status: "green",
      label: "Not Applicable",
      summary: "No health data processing indicators detected.",
    };
  }

  return {
    name: "HIPAA",
    fullName: "Health Insurance Portability and Accountability Act",
    status: "red",
    label: "Action Required",
    summary: "Health data processing patterns detected. BAA agreements and security controls required.",
  };
}

function deriveTopRisks(scan: ScanResult, ctx?: GeneratorContext): RiskItem[] {
  const risks: RiskItem[] = [];

  // Risk 1: Data breach from multiple data processors
  const dataProcessors = scan.services.filter((s) => s.isDataProcessor !== false);
  if (dataProcessors.length >= 3) {
    const maxFine = ctx?.jurisdictions?.includes("GDPR")
      ? "Up to 4% of annual global turnover or EUR 20M"
      : "Up to $7,500 per violation (CCPA)";
    risks.push({
      title: "Data Breach Across Multiple Processors",
      dollarImpact: maxFine,
      description: `${dataProcessors.length} third-party data processors increase attack surface. Each processor represents a potential breach vector.`,
    });
  }

  // Risk 2: Non-compliant AI usage
  const hasAI = scan.services.some((s) => s.category === "ai");
  if (hasAI) {
    risks.push({
      title: "Non-Compliant AI Deployment",
      dollarImpact: "Up to EUR 35M or 7% of global turnover (EU AI Act)",
      description: "AI services without proper transparency disclosures and risk assessments.",
    });
  }

  // Risk 3: Missing consent for analytics/advertising
  const hasTracking = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising",
  );
  if (hasTracking) {
    risks.push({
      title: "Inadequate Cookie/Tracking Consent",
      dollarImpact: "Up to EUR 20M or 4% of turnover (GDPR ePrivacy)",
      description: "Analytics and advertising trackers detected without verified consent mechanisms.",
    });
  }

  // Risk 4: Third-party vendor risk
  if (dataProcessors.length >= 5) {
    risks.push({
      title: "Third-Party Vendor Concentration Risk",
      dollarImpact: "$500K-$5M average cost of vendor-related breach",
      description: `${dataProcessors.length} vendors create supply chain risk. One vendor breach can cascade.`,
    });
  }

  // Risk 5: Payment data exposure
  const hasPayment = scan.services.some((s) => s.category === "payment");
  if (hasPayment) {
    risks.push({
      title: "Payment Data Exposure",
      dollarImpact: "$50K-$500K per PCI DSS non-compliance incident",
      description: "Payment processing services detected. PCI DSS compliance validation required.",
    });
  }

  // Return top 3
  return risks.slice(0, 3);
}

function deriveDeadlines(scan: ScanResult, ctx?: GeneratorContext): Deadline[] {
  const deadlines: Deadline[] = [];
  const now = new Date();
  const year = now.getFullYear();

  // Annual review
  const nextAnnualReview = new Date(year + 1, 0, 31);
  deadlines.push({
    date: nextAnnualReview.toISOString().split("T")[0],
    regulation: "All",
    action: "Annual compliance review and document refresh",
  });

  // GDPR DPA review
  if (ctx?.jurisdictions?.some((j) => j === "GDPR" || j === "UK GDPR")) {
    const dpaReview = new Date(year, now.getMonth() + 6, 1);
    if (dpaReview <= now) dpaReview.setFullYear(year + 1);
    deadlines.push({
      date: dpaReview.toISOString().split("T")[0],
      regulation: "GDPR",
      action: "Review and update Data Processing Agreements with all processors",
    });
  }

  // EU AI Act deadlines
  const hasAI = scan.services.some((s) => s.category === "ai");
  if (hasAI) {
    if (now < new Date("2026-08-02")) {
      deadlines.push({
        date: "2026-08-02",
        regulation: "EU AI Act",
        action: "Full EU AI Act enforcement begins. Ensure AI transparency and risk classification.",
      });
    }
  }

  // PCI DSS
  const hasPayment = scan.services.some((s) => s.category === "payment");
  if (hasPayment) {
    const pciReview = new Date(year, 11, 31);
    if (pciReview <= now) pciReview.setFullYear(year + 1);
    deadlines.push({
      date: pciReview.toISOString().split("T")[0],
      regulation: "PCI DSS",
      action: "Complete annual Self-Assessment Questionnaire (SAQ)",
    });
  }

  // Privacy policy review
  if (scan.services.length > 0) {
    const policyReview = new Date(year, now.getMonth() + 3, 1);
    if (policyReview <= now) policyReview.setFullYear(year + 1);
    deadlines.push({
      date: policyReview.toISOString().split("T")[0],
      regulation: "General",
      action: "Quarterly privacy policy and terms of service review",
    });
  }

  // Sort by date
  deadlines.sort((a, b) => a.date.localeCompare(b.date));

  return deadlines;
}

export function generateExecutiveDashboard(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const regulations: RegulationStatus[] = [
    assessGDPR(scan, ctx),
    assessCCPA(scan, ctx),
    assessAIAct(scan, ctx),
    assessPCIDSS(scan),
    assessHIPAA(scan),
  ];

  const topRisks = deriveTopRisks(scan, ctx);
  const deadlines = deriveDeadlines(scan, ctx);

  const lines: string[] = [];

  // Header
  lines.push("# Executive Compliance Dashboard");
  lines.push("");
  lines.push(`**${company}** | Assessment Date: ${date} | Project: ${scan.projectName}`);
  lines.push("");
  lines.push("> One-page compliance overview for executive leadership. This dashboard provides a high-level view of regulatory compliance status, key risks, and upcoming deadlines.");
  lines.push("");

  // Regulation Status
  lines.push("## Regulatory Status");
  lines.push("");
  lines.push("| Status | Regulation | Assessment | Summary |");
  lines.push("|--------|-----------|------------|---------|");
  for (const reg of regulations) {
    lines.push(
      `| ${trafficLight(reg.status)} | **${reg.name}** | ${reg.label} | ${reg.summary} |`,
    );
  }
  lines.push("");

  // Quick Stats
  const dataProcessors = scan.services.filter((s) => s.isDataProcessor !== false).length;
  const redCount = regulations.filter((r) => r.status === "red").length;
  const yellowCount = regulations.filter((r) => r.status === "yellow").length;
  const greenCount = regulations.filter((r) => r.status === "green").length;

  lines.push("## Quick Stats");
  lines.push("");
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Third-Party Data Processors | ${dataProcessors} |`);
  lines.push(`| Data Categories Collected | ${scan.dataCategories.length} |`);
  lines.push(`| Regulations: Action Required | ${redCount + yellowCount} |`);
  lines.push(`| Regulations: Compliant | ${greenCount} |`);
  lines.push("");

  // Top Risks
  if (topRisks.length > 0) {
    lines.push("## Top Risks");
    lines.push("");
    lines.push("| # | Risk | Potential Impact | Description |");
    lines.push("|---|------|-----------------|-------------|");
    for (let i = 0; i < topRisks.length; i++) {
      lines.push(
        `| ${i + 1} | **${topRisks[i].title}** | ${topRisks[i].dollarImpact} | ${topRisks[i].description} |`,
      );
    }
    lines.push("");
  }

  // Deadlines
  if (deadlines.length > 0) {
    lines.push("## Upcoming Deadlines");
    lines.push("");
    lines.push("| Date | Regulation | Action Required |");
    lines.push("|------|-----------|-----------------|");
    for (const dl of deadlines) {
      lines.push(`| ${dl.date} | ${dl.regulation} | ${dl.action} |`);
    }
    lines.push("");
  }

  // Recommendations
  lines.push("## Recommended Actions");
  lines.push("");
  const actions: string[] = [];
  if (redCount > 0) {
    actions.push("1. **Immediate:** Address all red-status regulations within 30 days");
  }
  if (yellowCount > 0) {
    actions.push(`${actions.length + 1}. **Short-term:** Review ${yellowCount} regulation(s) requiring action within 90 days`);
  }
  actions.push(`${actions.length + 1}. **Ongoing:** Schedule quarterly compliance reviews with legal counsel`);
  actions.push(`${actions.length + 1}. **Ongoing:** Maintain all generated compliance documents as services change`);

  for (const action of actions) {
    lines.push(action);
  }
  lines.push("");

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(
    `*Generated by Codepliant v180.0.0 on ${date}. ` +
    "This document should be reviewed by a qualified professional. " +
    "See also: [Compliance Notes](COMPLIANCE_NOTES.md), [Risk Register](RISK_REGISTER.md), [Compliance Timeline](COMPLIANCE_TIMELINE.md).*",
  );
  lines.push("");

  return lines.join("\n");
}
