import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_COMMUNICATION_PLAN.md — an internal communication
 * plan for compliance updates. Covers who needs to know what, when, and
 * how, plus ready-to-use announcement templates.
 *
 * Generated when at least 1 service is detected (every organisation
 * processing data needs a compliance communication strategy).
 */

interface Stakeholder {
  role: string;
  needs: string;
  frequency: string;
  channel: string;
  escalation: boolean;
}

const STAKEHOLDERS: Stakeholder[] = [
  {
    role: "CEO / Founder",
    needs: "Executive summary, compliance grade, key risks, regulatory deadlines",
    frequency: "Monthly + ad-hoc for incidents",
    channel: "Email summary, board deck",
    escalation: true,
  },
  {
    role: "CTO / VP Engineering",
    needs: "Technical compliance requirements, scanner results, remediation items",
    frequency: "Weekly during active work, monthly steady-state",
    channel: "Slack/Teams, JIRA tickets, email",
    escalation: true,
  },
  {
    role: "General Counsel / Legal",
    needs: "All generated documents for review, regulatory change alerts, incident reports",
    frequency: "On every generation cycle + monthly review",
    channel: "Email, document repository, meeting",
    escalation: true,
  },
  {
    role: "Data Protection Officer",
    needs: "Full scan results, DSAR tracking, breach notification status, training completion",
    frequency: "Weekly",
    channel: "Email, compliance dashboard, meeting",
    escalation: true,
  },
  {
    role: "Engineering Team",
    needs: "Action items from scans, new service detection alerts, code-level compliance tasks",
    frequency: "Per sprint / bi-weekly",
    channel: "Slack/Teams, JIRA, PR comments",
    escalation: false,
  },
  {
    role: "Product Team",
    needs: "Feature compliance impact, consent requirements, privacy-by-design checklist",
    frequency: "Per feature launch + monthly",
    channel: "Slack/Teams, Confluence, meeting",
    escalation: false,
  },
  {
    role: "Security Team / CISO",
    needs: "Vulnerability reports, incident response plan, security policy updates, access control changes",
    frequency: "Weekly + immediate for incidents",
    channel: "Email, PagerDuty, Slack/Teams",
    escalation: true,
  },
  {
    role: "Customer Support",
    needs: "DSAR handling procedures, privacy FAQ, data deletion process",
    frequency: "On policy update + quarterly refresh",
    channel: "Internal wiki, training session, email",
    escalation: false,
  },
  {
    role: "HR / People Ops",
    needs: "Employee privacy notice, training requirements, onboarding compliance checklist",
    frequency: "On policy update + per new hire",
    channel: "HRIS, email, onboarding docs",
    escalation: false,
  },
  {
    role: "Board of Directors",
    needs: "Compliance scorecard, key risks, regulatory landscape, incident history",
    frequency: "Quarterly board meeting",
    channel: "Board deck, email",
    escalation: true,
  },
];

export function generateComplianceCommunicationPlan(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────
  sections.push(`# Compliance Communication Plan

**Organisation:** ${company}
**Project:** ${scan.projectName}
**Plan Owner:** ${dpoName} (${dpoEmail})
**Generated:** ${date}

---

> This plan defines how ${company} communicates compliance updates internally. It ensures the right people receive the right information at the right time through the right channels.`);

  // ── Communication Objectives ─────────────────────────────────────
  sections.push(`
## 1. Communication Objectives

1. **Awareness** — Ensure all stakeholders understand their compliance obligations
2. **Timeliness** — Deliver updates before deadlines, not after
3. **Accountability** — Document who was informed, when, and through what channel
4. **Escalation** — Define clear paths for urgent compliance matters
5. **Consistency** — Use standard templates and cadences to avoid information gaps`);

  // ── Stakeholder Matrix ───────────────────────────────────────────
  let matrix = `
## 2. Stakeholder Communication Matrix

| Stakeholder | Information Needs | Frequency | Channel | Escalation Path |
|------------|------------------|-----------|---------|----------------|`;

  for (const s of STAKEHOLDERS) {
    matrix += `\n| ${s.role} | ${s.needs} | ${s.frequency} | ${s.channel} | ${s.escalation ? "Yes" : "—"} |`;
  }

  sections.push(matrix);

  // ── Communication Calendar ───────────────────────────────────────
  sections.push(`
## 3. Communication Calendar

### Regular Cadence

| Frequency | Activity | Owner | Audience | Deliverable |
|-----------|----------|-------|----------|-------------|
| **Weekly** | Compliance status update | DPO | Engineering, Security | Slack/Teams message |
| **Bi-weekly** | Sprint compliance items review | DPO + CTO | Engineering leads | Meeting + action items |
| **Monthly** | Compliance summary email | DPO | All stakeholders | Email (use template below) |
| **Monthly** | Scan + regenerate docs | DPO / DevOps | Legal, CTO | Updated legal/ directory |
| **Quarterly** | Compliance review meeting | DPO | Leadership, Legal, Board | Presentation + scorecard |
| **Quarterly** | Training completion check | HR + DPO | All staff | Training report |
| **Annually** | Full compliance audit | DPO + External | Board, Legal | Audit report |
| **Annually** | Policy review & update cycle | DPO + Legal | All stakeholders | Updated policies |

### Event-Driven Communication

| Trigger | Action | Timeline | Owner | Audience |
|---------|--------|----------|-------|----------|
| New service detected in scan | Notify engineering + legal | Within 24 hours | DPO | CTO, Legal |
| Data breach detected | Activate incident response | Immediately | CISO | All escalation contacts |
| Regulatory change announced | Impact assessment | Within 1 week | Legal + DPO | Leadership, Engineering |
| New feature launch | Privacy impact review | Before launch | Product + DPO | Legal, Engineering |
| DSAR received | Acknowledge + process | Within 3 business days | DPO | Support, Engineering |
| Compliance score drops | Root cause analysis | Within 48 hours | DPO | CTO, Engineering |
| Vendor change | Sub-processor notification | 30 days before change | DPO | Affected users, Legal |`);

  // ── Escalation Matrix ────────────────────────────────────────────
  sections.push(`
## 4. Escalation Matrix

\`\`\`
Level 1 — Routine
├── Owner: DPO / Compliance Lead
├── Response: Standard cadence
└── Example: Monthly report, training reminder

Level 2 — Elevated
├── Owner: DPO + CTO
├── Response: Within 48 hours
└── Example: Compliance score decline, new regulatory guidance

Level 3 — Urgent
├── Owner: DPO + CTO + Legal
├── Response: Within 24 hours
└── Example: DSAR deadline approaching, audit finding

Level 4 — Critical
├── Owner: CEO + DPO + Legal + CISO
├── Response: Immediately
└── Example: Data breach, regulatory investigation, enforcement action
\`\`\``);

  // ── Communication Templates ──────────────────────────────────────
  sections.push(`
## 5. Communication Templates

### Template A: Monthly Compliance Update Email

\`\`\`
Subject: [Compliance Update] ${company} — Monthly Report — [Month Year]

Hi team,

Here is your monthly compliance update for ${scan.projectName}:

📊 COMPLIANCE SCORE: [Score] / 100 ([Grade])
📄 DOCUMENTS: [Count] compliance documents current
🔍 SERVICES MONITORED: ${scan.services.length}
⚠️  OPEN ITEMS: [Count]

KEY UPDATES:
• [Update 1]
• [Update 2]
• [Update 3]

ACTION ITEMS:
• [Owner]: [Action] — Due: [Date]
• [Owner]: [Action] — Due: [Date]

UPCOMING DEADLINES:
• [Deadline 1]
• [Deadline 2]

Full compliance docs: [link to legal/ directory or compliance page]

Questions? Reply to this email or contact ${dpoName} at ${dpoEmail}.

Best,
${dpoName}
Data Protection Officer
\`\`\``);

  sections.push(`
### Template B: New Service Detection Alert

\`\`\`
Subject: [Action Required] New Service Detected — [Service Name]

Hi [Engineering Lead],

Codepliant has detected a new third-party service in ${scan.projectName}:

SERVICE: [Service Name]
CATEGORY: [Category]
DATA COLLECTED: [Data types]
COMPLIANCE IMPACT: [Brief description]

REQUIRED ACTIONS:
1. □ Verify the service is intentional and approved
2. □ Review data processing implications
3. □ Update sub-processor list if applicable
4. □ Ensure DPA is in place with the provider
5. □ Regenerate compliance documents (codepliant go)

Please complete these actions within [5 business days / next sprint].

— ${dpoName}
\`\`\``);

  sections.push(`
### Template C: Incident Notification (Internal)

\`\`\`
Subject: [URGENT] Compliance Incident — [Brief Description]

INCIDENT SUMMARY
━━━━━━━━━━━━━━━
Detected:    [Date/Time]
Severity:    [Level 1-4]
Category:    [Data breach / Policy violation / System failure]
Status:      [Investigating / Contained / Resolved]

DESCRIPTION:
[Brief description of what happened]

IMMEDIATE ACTIONS TAKEN:
1. [Action 1]
2. [Action 2]

STAKEHOLDERS NOTIFIED:
• [Name, Role] — [Time notified]
• [Name, Role] — [Time notified]

NEXT STEPS:
1. [Next step] — Owner: [Name] — ETA: [Time]
2. [Next step] — Owner: [Name] — ETA: [Time]

REGULATORY NOTIFICATION REQUIRED: [Yes/No]
• If yes, deadline: [72 hours from detection under GDPR]

This incident is being tracked in [ticket system / incident ID].

— ${dpoName}
\`\`\``);

  if (hasAI) {
    sections.push(`
### Template D: AI Service Compliance Update

\`\`\`
Subject: [AI Compliance] ${company} — AI Service Update

Hi team,

This is an update regarding AI services in ${scan.projectName}:

AI SERVICES IN USE:
${scan.services.filter((s) => s.category === "ai").map((s) => `• ${s.name}`).join("\n")}

EU AI ACT STATUS:
• Risk classification: ${ctx?.aiRiskLevel || "[Pending assessment]"}
• Art. 50 transparency: [Compliant / In progress / Not started]
• AI Disclosure document: [Current / Needs update]

KEY ITEMS:
• [Item 1]
• [Item 2]

DEADLINE REMINDER: EU AI Act Art. 50 transparency obligations
apply from August 2, 2026.

— ${dpoName}
\`\`\``);
  }

  if (hasPayment) {
    sections.push(`
### Template E: Payment Compliance Update

\`\`\`
Subject: [PCI Compliance] ${company} — Payment Processing Update

Hi team,

Payment processing compliance update for ${scan.projectName}:

PAYMENT PROCESSORS:
${scan.services.filter((s) => s.category === "payment").map((s) => `• ${s.name}`).join("\n")}

PCI DSS STATUS: [Compliant / In progress / Assessment needed]
DPA STATUS: [All signed / [Count] pending]

ACTION ITEMS:
• [Item 1]
• [Item 2]

— ${dpoName}
\`\`\``);
  }

  // ── Channels Configuration ───────────────────────────────────────
  sections.push(`
## 6. Recommended Channels

| Channel | Use Case | Setup |
|---------|----------|-------|
| **Email** | Monthly reports, incident alerts, formal notifications | Distribution list: compliance@${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com |
| **Slack / Teams** | Real-time updates, quick questions, sprint items | Channel: #compliance |
| **JIRA / Linear** | Action items, remediation tracking, sprint planning | Project: Compliance |
| **Confluence / Notion** | Policy repository, procedures, training materials | Space: Compliance Docs |
| **Git Repository** | Generated compliance documents, version history | Directory: legal/ |
| **Compliance Dashboard** | Live compliance score, trends, KPIs | URL: [internal dashboard URL] |
| **Board Portal** | Quarterly reports, risk summaries | Board meeting materials |

### Automation with Codepliant

\`\`\`bash
# Automated weekly compliance check (add to CI/CD or cron)
codepliant scan /path/to/project --json > compliance-report.json

# Generate + diff for change detection
codepliant update /path/to/project

# Send notification after scan
codepliant notify /path/to/project --channel slack --webhook $SLACK_WEBHOOK
\`\`\``);

  // ── RACI Matrix ──────────────────────────────────────────────────
  sections.push(`
## 7. RACI Matrix

| Activity | CEO | CTO | Legal | DPO | Engineering | Product | Security | HR |
|----------|-----|-----|-------|-----|-------------|---------|----------|-----|
| Policy creation | I | C | A | R | C | C | C | I |
| Document generation | I | I | C | R | C | I | I | I |
| Incident response | I | C | C | R | C | I | A | I |
| Regulatory monitoring | I | I | A | R | I | I | I | I |
| Training delivery | I | I | C | A | I | I | C | R |
| Vendor assessment | I | C | C | A | R | I | C | I |
| DSAR handling | I | I | C | A | R | I | I | I |
| Audit preparation | C | C | A | R | C | I | C | I |
| Board reporting | A | C | C | R | I | I | I | I |

> **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed`);

  // ── Metrics ──────────────────────────────────────────────────────
  sections.push(`
## 8. Communication Effectiveness Metrics

Track these metrics to ensure your compliance communication plan is working:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Email open rate (compliance updates) | > 80% | Email analytics |
| Action item completion rate | > 90% within deadline | JIRA/Linear tracking |
| Training completion within 30 days | > 95% | LMS / training platform |
| Time to acknowledge incident notification | < 1 hour | Incident log |
| Stakeholder satisfaction (quarterly survey) | > 4/5 | Anonymous survey |
| Policy review completion (annual cycle) | 100% | Document tracker |`);

  // ── Footer ───────────────────────────────────────────────────────
  sections.push(`
## Contact

For questions about this communication plan:

- **Plan Owner:** ${dpoName} (${dpoEmail})
- **General Contact:** ${email}

---

*This Compliance Communication Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of ${scan.services.length} service(s). Adapt the templates and cadences to match your organisation's size, structure, and regulatory environment. Review this plan quarterly.*`);

  return sections.join("\n");
}
