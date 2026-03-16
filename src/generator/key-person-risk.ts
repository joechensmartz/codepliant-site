import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a Key Person Risk Assessment — KEY_PERSON_RISK_ASSESSMENT.md
 * Identifies single points of failure for compliance knowledge.
 * Includes DPO, security lead, incident responder roles.
 * Provides cross-training recommendations.
 */

interface KeyRole {
  role: string;
  description: string;
  singlePointOfFailure: boolean;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  currentAssignment: string;
  backupAssignment: string;
  crossTrainingRecommendations: string[];
  regulatoryImplications: string[];
}

export function generateKeyPersonRiskAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const services = scan.services;
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = services.some((s) => s.category === "ai");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = services.some((s) => s.category === "auth");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasDPO = !!(ctx?.dpoName || ctx?.dpoEmail);
  const hasSecurityEmail = !!ctx?.securityEmail;
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || jurisdictions.length === 0;

  const roles: KeyRole[] = [];

  // DPO
  roles.push({
    role: "Data Protection Officer (DPO)",
    description: "Responsible for GDPR compliance oversight, DSAR handling, DPA review, supervisory authority liaison, and privacy impact assessments.",
    singlePointOfFailure: true,
    riskLevel: "Critical",
    currentAssignment: hasDPO ? `${ctx?.dpoName || "Assigned"} (${ctx?.dpoEmail || "email on file"})` : "**Not assigned** — compliance risk",
    backupAssignment: hasDPO ? "[Assign backup DPO]" : "[Assign primary and backup DPO]",
    crossTrainingRecommendations: [
      "Train at least one backup team member on GDPR Articles 12-23 (data subject rights)",
      "Document all supervisory authority contacts and ongoing correspondence",
      "Create runbook for DSAR handling that any team member can execute",
      "Share DPA templates and vendor review procedures with legal team",
      "Schedule quarterly knowledge-sharing sessions on regulatory updates",
    ],
    regulatoryImplications: [
      "GDPR Art. 37-39: DPO must be accessible to data subjects and supervisory authorities",
      "If DPO is unavailable, DSAR response deadlines (30 days) may be missed",
      "Supervisory authority communications cannot be delayed — fines up to 4% of global revenue",
    ],
  });

  // Security Lead
  roles.push({
    role: "Security Lead / CISO",
    description: "Owns security policy, vulnerability management, penetration testing oversight, and security incident triage.",
    singlePointOfFailure: true,
    riskLevel: "Critical",
    currentAssignment: hasSecurityEmail ? `Contact: ${ctx?.securityEmail}` : "[Not formally assigned]",
    backupAssignment: "[Assign backup security lead]",
    crossTrainingRecommendations: [
      "Document all security tool access credentials in a shared vault",
      "Train backup on vulnerability scanning and patch management procedures",
      "Create incident classification guide that any engineer can use for initial triage",
      "Share penetration test scope and vendor contacts with at least two team members",
      "Maintain a security architecture document accessible to the engineering team",
    ],
    regulatoryImplications: [
      "SOC 2 Trust Service Criteria require documented security leadership",
      "ISO 27001 A.5.1 requires management commitment through security policy ownership",
      "Security incident response cannot wait for a single person to become available",
    ],
  });

  // Incident Responder
  roles.push({
    role: "Incident Response Lead",
    description: "First responder for data breaches and security incidents. Coordinates containment, notification, and remediation.",
    singlePointOfFailure: true,
    riskLevel: "Critical",
    currentAssignment: "[Assign incident response lead]",
    backupAssignment: "[Assign backup — must be available 24/7]",
    crossTrainingRecommendations: [
      "Conduct quarterly tabletop exercises with rotating team members as lead",
      "Document step-by-step breach notification procedures (supervisory authority + data subjects)",
      "Maintain up-to-date contact list for all sub-processors' security teams",
      "Train at least three team members on forensic evidence preservation",
      "Create pre-approved communication templates that any responder can send",
    ],
    regulatoryImplications: [
      hasGDPR ? "GDPR Art. 33: Must notify supervisory authority within 72 hours of becoming aware of a breach" : "Breach notification timelines vary by jurisdiction",
      "Delayed incident response increases breach severity and regulatory exposure",
      "Multiple jurisdictions may require simultaneous notifications — single person cannot manage alone",
    ],
  });

  // Privacy Champion (if analytics/tracking)
  if (hasAnalytics) {
    roles.push({
      role: "Privacy Champion / Consent Manager",
      description: "Manages consent management platform (CMP), cookie compliance, and tracking consent workflows.",
      singlePointOfFailure: true,
      riskLevel: "High",
      currentAssignment: "[Assign privacy champion]",
      backupAssignment: "[Assign backup]",
      crossTrainingRecommendations: [
        "Document CMP configuration and how to update cookie categories",
        "Train marketing team on consent requirements before launching new campaigns",
        "Create checklist for adding new analytics or advertising services",
        "Share CMP admin access with at least two team members",
      ],
      regulatoryImplications: [
        "ePrivacy Directive: Invalid consent can result in immediate enforcement action",
        "GDPR Art. 7: Consent must be demonstrable — records must be maintained",
      ],
    });
  }

  // AI Governance Lead (if AI services)
  if (hasAI) {
    roles.push({
      role: "AI Governance Lead",
      description: "Oversees AI system classification, risk assessment, transparency obligations, and EU AI Act compliance.",
      singlePointOfFailure: true,
      riskLevel: "High",
      currentAssignment: "[Assign AI governance lead]",
      backupAssignment: "[Assign backup]",
      crossTrainingRecommendations: [
        "Document AI system inventory with risk classifications",
        "Train engineering team on AI transparency requirements (Art. 50)",
        "Create checklist for evaluating new AI service integrations",
        "Share AI model documentation procedures with ML and product teams",
        "Conduct workshops on AI bias detection and fairness testing",
      ],
      regulatoryImplications: [
        "EU AI Act: High-risk AI systems require ongoing conformity assessment",
        "Colorado AI Act: Deployers must complete impact assessments",
        "AI governance decisions affect product roadmap — delays are costly",
      ],
    });
  }

  // Vendor Management Lead
  if (services.length >= 3) {
    roles.push({
      role: "Vendor Management Lead",
      description: `Manages relationships with ${services.length} detected third-party services. Owns DPA negotiations, vendor risk assessments, and sub-processor monitoring.`,
      singlePointOfFailure: true,
      riskLevel: "High",
      currentAssignment: "[Assign vendor management lead]",
      backupAssignment: "[Assign backup]",
      crossTrainingRecommendations: [
        "Maintain a shared vendor contact database (see VENDOR_CONTACTS.md)",
        "Document DPA status and renewal dates for all vendors",
        "Train procurement team on security assessment requirements before onboarding new vendors",
        "Create vendor exit plan templates that any team member can execute",
      ],
      regulatoryImplications: [
        "GDPR Art. 28: Controller must ensure processor compliance",
        "Vendor incidents become your incidents — you need someone who can act immediately",
      ],
    });
  }

  // Compliance Training Coordinator
  roles.push({
    role: "Compliance Training Coordinator",
    description: "Schedules and tracks mandatory compliance training for all employees. Maintains training records for audit evidence.",
    singlePointOfFailure: false,
    riskLevel: "Medium",
    currentAssignment: "[Assign training coordinator]",
    backupAssignment: "[Assign backup]",
    crossTrainingRecommendations: [
      "Use a shared calendar with training schedule visible to all",
      "Automate training completion reminders",
      "Maintain training records in a shared, auditable system (see TRAINING_RECORD.md)",
      "Document the training curriculum so anyone can deliver sessions",
    ],
    regulatoryImplications: [
      "GDPR Art. 39(1)(b): DPO must assign awareness-raising and training",
      "SOC 2: Security awareness training must be documented for audits",
    ],
  });

  // Build the document
  const sections: string[] = [];

  sections.push(`# Key Person Risk Assessment — ${company}`);
  sections.push("");
  sections.push(`> Auto-generated by Codepliant on ${date}.`);
  sections.push(`> Identifies single points of failure in compliance knowledge and provides cross-training recommendations.`);
  sections.push(`> Review with leadership and HR to validate role assignments and implement mitigations.`);
  sections.push("");

  // Executive summary
  const criticalRoles = roles.filter((r) => r.riskLevel === "Critical");
  const unassignedRoles = roles.filter((r) => r.currentAssignment.includes("Not assigned") || r.currentAssignment.includes("[Assign"));
  const spofRoles = roles.filter((r) => r.singlePointOfFailure);

  sections.push("## Executive Summary");
  sections.push("");
  sections.push(`| Metric | Value |`);
  sections.push(`|--------|-------|`);
  sections.push(`| Key Compliance Roles | **${roles.length}** |`);
  sections.push(`| Critical Roles | **${criticalRoles.length}** |`);
  sections.push(`| Unassigned / Needs Assignment | **${unassignedRoles.length}** |`);
  sections.push(`| Single Points of Failure | **${spofRoles.length}** |`);
  sections.push("");

  if (unassignedRoles.length > 0) {
    sections.push(`> **Action Required:** ${unassignedRoles.length} role(s) need immediate assignment to avoid compliance gaps.`);
    sections.push("");
  }

  // Risk matrix
  sections.push("## Key Person Risk Matrix");
  sections.push("");
  sections.push("| Role | Risk Level | SPOF | Assigned | Backup |");
  sections.push("|------|-----------|------|----------|--------|");

  for (const role of roles) {
    const rIcon = role.riskLevel === "Critical" ? "🔴" : role.riskLevel === "High" ? "🟠" : role.riskLevel === "Medium" ? "🟡" : "🟢";
    const spof = role.singlePointOfFailure ? "Yes" : "No";
    const assigned = role.currentAssignment.includes("[") ? "No" : "Yes";
    const backup = role.backupAssignment.includes("[") ? "No" : "Yes";
    sections.push(`| ${role.role} | ${rIcon} ${role.riskLevel} | ${spof} | ${assigned} | ${backup} |`);
  }
  sections.push("");

  // Detailed role assessments
  sections.push("## Role Details");
  sections.push("");

  for (const role of roles) {
    const rIcon = role.riskLevel === "Critical" ? "🔴" : role.riskLevel === "High" ? "🟠" : role.riskLevel === "Medium" ? "🟡" : "🟢";

    sections.push(`### ${role.role} ${rIcon}`);
    sections.push("");
    sections.push(`**Description:** ${role.description}`);
    sections.push("");
    sections.push(`**Risk Level:** ${role.riskLevel}  `);
    sections.push(`**Single Point of Failure:** ${role.singlePointOfFailure ? "Yes" : "No"}  `);
    sections.push(`**Current Assignment:** ${role.currentAssignment}  `);
    sections.push(`**Backup Assignment:** ${role.backupAssignment}`);
    sections.push("");

    sections.push("**Cross-Training Recommendations:**");
    sections.push("");
    for (const rec of role.crossTrainingRecommendations) {
      sections.push(`- [ ] ${rec}`);
    }
    sections.push("");

    sections.push("**Regulatory Implications if Unavailable:**");
    sections.push("");
    for (const imp of role.regulatoryImplications) {
      sections.push(`- ${imp}`);
    }
    sections.push("");
  }

  // Bus factor analysis
  sections.push("## Bus Factor Analysis");
  sections.push("");
  sections.push("The \"bus factor\" measures how many team members must be unavailable before a compliance function stops working.");
  sections.push("");
  sections.push("| Function | Current Bus Factor | Target Bus Factor | Gap |");
  sections.push("|----------|-------------------|-------------------|-----|");
  sections.push("| DSAR Handling | 1 | 3 | Train 2 additional team members |");
  sections.push("| Breach Notification | 1 | 3 | Rotate incident response lead role quarterly |");
  sections.push("| Vendor DPA Management | 1 | 2 | Share vendor contacts and DPA templates |");
  sections.push("| Privacy Policy Updates | 1 | 2 | Document update procedure |");
  if (hasAI) {
    sections.push("| AI Compliance | 1 | 2 | Cross-train product and engineering leads |");
  }
  if (hasPayment) {
    sections.push("| PCI DSS Compliance | 1 | 2 | Train backup on PCI requirements |");
  }
  sections.push("");

  // Action plan
  sections.push("## 90-Day Action Plan");
  sections.push("");
  sections.push("### Month 1: Assign and Document");
  sections.push("");
  sections.push("- [ ] Assign all unassigned compliance roles");
  sections.push("- [ ] Assign backup for every critical role");
  sections.push("- [ ] Document all role responsibilities in an accessible location");
  sections.push("- [ ] Create shared credential vault for compliance tools");
  sections.push("");
  sections.push("### Month 2: Cross-Train");
  sections.push("");
  sections.push("- [ ] Conduct first round of cross-training sessions");
  sections.push("- [ ] Run tabletop exercise with backup responders");
  sections.push("- [ ] Create runbooks for all critical compliance procedures");
  sections.push("- [ ] Verify backup team members can access all required tools");
  sections.push("");
  sections.push("### Month 3: Test and Validate");
  sections.push("");
  sections.push("- [ ] Simulate DPO unavailability — can backup handle DSAR?");
  sections.push("- [ ] Simulate security lead unavailability — can backup triage incident?");
  sections.push("- [ ] Review and update all cross-training materials");
  sections.push("- [ ] Schedule recurring cross-training (quarterly recommended)");
  sections.push("");

  // Disclaimer
  sections.push("---");
  sections.push("");
  sections.push(
    "*This assessment is generated from automated code analysis and regulatory requirements. Actual key person risks depend on your organization's structure and team composition. Review with HR and leadership to validate.*",
  );
  sections.push("");

  return sections.join("\n");
}
