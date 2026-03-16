import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_SUMMARY_EMAIL.md — an email-ready template
 * summarizing compliance status for stakeholders, board members,
 * and executives. Includes overall score, key risks, and action items.
 *
 * Always generated when services are detected (every organization should
 * provide periodic compliance updates to stakeholders).
 */
export function generateComplianceSummaryEmail(
  scan: ScanResult,
  ctx?: GeneratorContext,
  docs?: GeneratedDocument[],
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const serviceCount = scan.services.length;
  const docCount = docs?.length || 0;

  // Categorize services
  const categories = new Map<string, string[]>();
  for (const svc of scan.services) {
    const cat = svc.category || "other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(svc.name);
  }

  // Determine AI services
  const aiServices = scan.services.filter(
    (s) => s.category === "ai",
  );
  const hasAI = aiServices.length > 0;

  // Determine payment services
  const paymentServices = scan.services.filter(
    (s) => s.category === "payment",
  );
  const hasPayment = paymentServices.length > 0;

  // Determine analytics services
  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "monitoring",
  );

  // Build risk items
  const risks: string[] = [];
  if (hasAI) {
    risks.push(
      `**AI/ML Services Detected** (${aiServices.map((s) => s.name).join(", ")}): EU AI Act Art. 50 transparency obligations apply. AI Disclosure document required.`,
    );
  }
  if (hasPayment) {
    risks.push(
      `**Payment Processing** (${paymentServices.map((s) => s.name).join(", ")}): PCI DSS compliance required. Data Processing Agreement must list payment sub-processors.`,
    );
  }
  if (scan.services.length > 10) {
    risks.push(
      `**High Service Count** (${serviceCount} services): Large attack surface increases data breach risk. Sub-processor management is critical.`,
    );
  }
  if (analyticsServices.length > 0) {
    risks.push(
      `**Analytics/Monitoring** (${analyticsServices.map((s) => s.name).join(", ")}): Cookie consent and tracking disclosure required under GDPR/ePrivacy.`,
    );
  }
  if (risks.length === 0) {
    risks.push("No critical compliance risks identified at this time.");
  }

  // Build action items
  const actions: string[] = [];
  actions.push("Review all generated compliance documents for accuracy");
  actions.push("Have legal counsel approve Privacy Policy and Terms of Service");
  if (hasAI) {
    actions.push(
      "Review AI Disclosure document for EU AI Act Art. 50 compliance before August 2, 2026 deadline",
    );
  }
  if (hasPayment) {
    actions.push("Verify PCI DSS compliance and DPA coverage for payment processors");
  }
  actions.push("Schedule quarterly compliance review cadence");
  actions.push("Distribute this summary to all stakeholders and board members");

  // Jurisdiction section
  const jurisdiction = ctx?.jurisdiction || "";
  const jurisdictions = ctx?.jurisdictions || [];
  const allJurisdictions = new Set<string>();
  if (jurisdiction) allJurisdictions.add(jurisdiction);
  for (const j of jurisdictions) allJurisdictions.add(j);

  const jurisdictionList =
    allJurisdictions.size > 0
      ? [...allJurisdictions].map((j) => j.toUpperCase()).join(", ")
      : "GDPR, CCPA (default)";

  // Compute a simple coverage score
  const expectedCritical = ["PRIVACY_POLICY.md", "TERMS_OF_SERVICE.md", "SECURITY.md"];
  const generatedFilenames = new Set(docs?.map((d) => d.filename) || []);
  const criticalCoverage = expectedCritical.filter((f) =>
    generatedFilenames.has(f),
  ).length;
  const coveragePct = Math.round((criticalCoverage / expectedCritical.length) * 100);

  let scoreGrade = "A";
  let scoreColor = "Green";
  if (coveragePct < 100) {
    scoreGrade = "B";
    scoreColor = "Yellow";
  }
  if (coveragePct < 67) {
    scoreGrade = "C";
    scoreColor = "Orange";
  }
  if (coveragePct < 34) {
    scoreGrade = "D";
    scoreColor = "Red";
  }

  // Service summary table
  const serviceRows = [...categories.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([cat, svcs]) =>
        `| ${cat.charAt(0).toUpperCase() + cat.slice(1)} | ${svcs.length} | ${svcs.join(", ")} |`,
    )
    .join("\n");

  const lines = [
    `# Compliance Summary — ${company}`,
    ``,
    `**Date:** ${date}`,
    `**Prepared by:** ${dpoName} (${dpoEmail})`,
    `**Contact:** ${contactEmail}`,
    `**Report type:** Periodic Compliance Status Update`,
    ``,
    `---`,
    ``,
    `> **This document is formatted as an email-ready compliance summary for distribution to stakeholders, board members, and executive leadership.**`,
    ``,
    `---`,
    ``,
    `## Executive Summary`,
    ``,
    `${company} currently operates **${serviceCount} third-party service(s)** that process user data. A total of **${docCount} compliance document(s)** have been generated covering all applicable regulatory requirements.`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Overall Compliance Grade | **${scoreGrade}** (${scoreColor}) |`,
    `| Critical Document Coverage | ${coveragePct}% |`,
    `| Services Detected | ${serviceCount} |`,
    `| Documents Generated | ${docCount} |`,
    `| Applicable Jurisdictions | ${jurisdictionList} |`,
    ``,
    `---`,
    ``,
    `## Service Inventory`,
    ``,
    `| Category | Count | Services |`,
    `|----------|-------|----------|`,
    serviceRows,
    ``,
    `---`,
    ``,
    `## Key Risks`,
    ``,
    ...risks.map((r, i) => `${i + 1}. ${r}`),
    ``,
    `---`,
    ``,
    `## Action Items`,
    ``,
    ...actions.map((a, i) => `- [ ] ${a}`),
    ``,
    `---`,
    ``,
    `## Regulatory Coverage`,
    ``,
    `| Regulation | Status | Key Documents |`,
    `|-----------|--------|---------------|`,
    `| GDPR (EU) | ${generatedFilenames.has("PRIVACY_POLICY.md") ? "Covered" : "Pending"} | Privacy Policy, DPA, DSAR Guide, Record of Processing |`,
    `| CCPA (California) | ${generatedFilenames.has("PRIVACY_POLICY.md") ? "Covered" : "Pending"} | Privacy Policy (CCPA section), Data Deletion Procedures |`,
    hasAI
      ? `| EU AI Act | ${generatedFilenames.has("AI_DISCLOSURE.md") ? "Covered" : "Pending"} | AI Disclosure, AI Model Card, AI Governance Framework |`
      : `| EU AI Act | N/A | No AI services detected |`,
    `| ePrivacy (Cookies) | ${generatedFilenames.has("COOKIE_POLICY.md") ? "Covered" : "Pending"} | Cookie Policy, Cookie Inventory, Consent Guide |`,
    hasPayment
      ? `| PCI DSS | ${generatedFilenames.has("SECURITY.md") ? "Partial" : "Pending"} | Security Policy, Encryption Policy, Access Control |`
      : `| PCI DSS | N/A | No payment processing detected |`,
    ``,
    `---`,
    ``,
    `## Document Inventory`,
    ``,
    `The following compliance documents have been generated:`,
    ``,
    ...(docs || []).map((d) => `- ${d.name} (\`${d.filename}\`)`),
    ``,
    `---`,
    ``,
    `## Next Steps`,
    ``,
    `1. **Immediate (this week):** Review and approve critical documents (Privacy Policy, Terms of Service, Security Policy)`,
    `2. **Short-term (30 days):** Complete legal review of all generated documents`,
    `3. **Medium-term (90 days):** Implement consent management, DSAR handling procedures, and incident response testing`,
    `4. **Ongoing:** Schedule quarterly compliance reviews and document updates`,
    ``,
    `---`,
    ``,
    `## Distribution List`,
    ``,
    `This summary should be distributed to:`,
    ``,
    `- [ ] CEO / Founder`,
    `- [ ] CTO / VP Engineering`,
    `- [ ] General Counsel / Legal`,
    `- [ ] Data Protection Officer`,
    `- [ ] Board of Directors`,
    `- [ ] CISO / Security Lead`,
    `- [ ] VP Product`,
    ``,
    `---`,
    ``,
    `*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on ${date}. This is an automated compliance summary based on code analysis. It should be reviewed by qualified legal counsel before distribution.*`,
    ``,
    `*Report generated from analysis of ${serviceCount} service(s) across ${categories.size} categor${categories.size === 1 ? "y" : "ies"}.*`,
  ];

  return lines.join("\n");
}
