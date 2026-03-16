import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates DATA_RETENTION_SCHEDULE_VISUAL.md — a Mermaid Gantt chart
 * showing retention timelines per data type. Provides a visual representation
 * of when different categories of data expire.
 *
 * Only generated when 3+ services are detected (same threshold as the
 * textual data retention policy).
 */

const MIN_SERVICES = 3;

/** Retention periods in days per category. -1 means "until account deletion" (mapped to 3650 for charting). */
const RETENTION_DAYS: Record<string, number> = {
  auth: -1,
  payment: 2555,    // 7 years
  analytics: 790,   // ~26 months
  ai: 90,
  email: 1095,      // 3 years
  monitoring: 90,
  storage: -1,
  database: -1,
  advertising: 790,
  social: 790,
  other: 365,
};

/** Human labels per category. */
const CATEGORY_LABELS: Record<string, string> = {
  auth: "Authentication",
  payment: "Payment Processing",
  analytics: "Analytics",
  ai: "AI Service",
  email: "Email Service",
  monitoring: "Error Monitoring",
  storage: "File Storage",
  database: "Database",
  advertising: "Advertising",
  social: "Social Integration",
  other: "Other",
};

/** Short retention label. */
function retentionLabel(days: number): string {
  if (days === -1) return "Until deletion (~10y cap)";
  if (days < 365) return `${days} days`;
  const years = Math.round(days / 365);
  return years === 1 ? "1 year" : `${years} years`;
}

/** Convert days to a Mermaid duration string (e.g. "90d", "365d"). */
function mermaidDuration(days: number): string {
  const effective = days === -1 ? 3650 : days; // chart cap for "until deletion"
  return `${effective}d`;
}

/** Colour class based on retention length. */
function retentionRisk(days: number): "crit" | "active" | "done" {
  const effective = days === -1 ? 3650 : days;
  if (effective >= 2555) return "crit";   // 7+ years — high retention
  if (effective >= 365) return "active";  // 1–7 years — moderate
  return "done";                          // < 1 year — short
}

/** Extract unique categories preserving first-seen order. */
function uniqueCategories(services: DetectedService[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of services) {
    if (!seen.has(s.category)) {
      seen.add(s.category);
      result.push(s.category);
    }
  }
  return result;
}

export function generateDataRetentionScheduleVisual(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length < MIN_SERVICES) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const categories = uniqueCategories(scan.services);

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────
  sections.push(`# Data Retention Schedule — Visual

**Organisation:** ${company}
**Project:** ${scan.projectName}
**Generated:** ${date}

---

> This document provides a visual Gantt-chart representation of data retention timelines for every service category detected in your project. Use it alongside the [Data Retention Policy](DATA_RETENTION_POLICY.md) for a complete picture.`);

  // ── Mermaid Gantt Chart ──────────────────────────────────────────
  let gantt = `
## Retention Timeline

\`\`\`mermaid
gantt
    title Data Retention Timelines
    dateFormat YYYY-MM-DD
    axisFormat %Y
    todayMarker off
    section Legend
    Collection date             :milestone, m1, ${date}, 0d`;

  // Sort categories by retention duration (longest first) for visual clarity
  const sorted = [...categories].sort((a, b) => {
    const dA = RETENTION_DAYS[a] ?? RETENTION_DAYS["other"];
    const dB = RETENTION_DAYS[b] ?? RETENTION_DAYS["other"];
    const effA = dA === -1 ? 3650 : dA;
    const effB = dB === -1 ? 3650 : dB;
    return effB - effA;
  });

  for (const cat of sorted) {
    const days = RETENTION_DAYS[cat] ?? RETENTION_DAYS["other"];
    const label = CATEGORY_LABELS[cat] || cat;
    const risk = retentionRisk(days);
    const dur = mermaidDuration(days);
    const id = cat.replace(/[^a-zA-Z0-9]/g, "");

    gantt += `
    section ${label}
    ${retentionLabel(days)}    :${risk}, ${id}, ${date}, ${dur}`;
  }

  gantt += `
\`\`\``;

  sections.push(gantt);

  // ── Summary Table ────────────────────────────────────────────────
  let table = `
## Retention Summary

| Category | Retention Period | Days | Risk Level |
|----------|-----------------|------|------------|`;

  for (const cat of sorted) {
    const days = RETENTION_DAYS[cat] ?? RETENTION_DAYS["other"];
    const effective = days === -1 ? 3650 : days;
    const label = CATEGORY_LABELS[cat] || cat;
    const risk = effective >= 2555 ? "High" : effective >= 365 ? "Moderate" : "Low";
    table += `\n| ${label} | ${retentionLabel(days)} | ${effective} | ${risk} |`;
  }

  if (ctx?.dataRetentionDays) {
    table += `\n\n**Default retention override:** ${ctx.dataRetentionDays} days (from configuration).`;
  }

  sections.push(table);

  // ── Expiry Timeline ──────────────────────────────────────────────
  sections.push(`
## Expiry Timeline

\`\`\`mermaid
timeline
    title When does data expire?
${sorted.map((cat) => {
  const days = RETENTION_DAYS[cat] ?? RETENTION_DAYS["other"];
  const label = CATEGORY_LABELS[cat] || cat;
  const effective = days === -1 ? 3650 : days;
  const expiryDate = new Date(Date.now() + effective * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  return `    ${expiryDate} : ${label} — ${retentionLabel(days)}`;
}).join("\n")}
\`\`\``);

  // ── Data Lifecycle Phases ────────────────────────────────────────
  sections.push(`
## Data Lifecycle Phases

\`\`\`mermaid
flowchart LR
    A[Collection] --> B[Processing]
    B --> C[Storage]
    C --> D{Retention\\nPeriod\\nExpired?}
    D -->|No| C
    D -->|Yes| E[Anonymise\\nor Delete]
    E --> F[Purge\\nfrom Backups]
    F --> G[Confirm\\nDeletion]
\`\`\`

Each data category follows this lifecycle. The retention period (shown in the Gantt chart above) governs how long data remains in the **Storage** phase before progressing to deletion.`);

  // ── Risk Heat Map ────────────────────────────────────────────────
  const highRisk = sorted.filter((c) => {
    const d = RETENTION_DAYS[c] ?? RETENTION_DAYS["other"];
    return (d === -1 ? 3650 : d) >= 2555;
  });
  const modRisk = sorted.filter((c) => {
    const d = RETENTION_DAYS[c] ?? RETENTION_DAYS["other"];
    const e = d === -1 ? 3650 : d;
    return e >= 365 && e < 2555;
  });
  const lowRisk = sorted.filter((c) => {
    const d = RETENTION_DAYS[c] ?? RETENTION_DAYS["other"];
    return (d === -1 ? 3650 : d) < 365;
  });

  sections.push(`
## Retention Risk Heat Map

| Risk Level | Categories | Recommended Action |
|-----------|------------|-------------------|
| **High** (7+ years) | ${highRisk.length > 0 ? highRisk.map((c) => CATEGORY_LABELS[c] || c).join(", ") : "None"} | Verify legal obligation; minimise where possible |
| **Moderate** (1–7 years) | ${modRisk.length > 0 ? modRisk.map((c) => CATEGORY_LABELS[c] || c).join(", ") : "None"} | Review annually; ensure consent is current |
| **Low** (< 1 year) | ${lowRisk.length > 0 ? lowRisk.map((c) => CATEGORY_LABELS[c] || c).join(", ") : "None"} | Automated purge in place |`);

  // ── Footer ───────────────────────────────────────────────────────
  sections.push(`
## Contact

For questions about data retention schedules:

- **Email:** ${email}${ctx?.dpoEmail ? `\n- **Data Protection Officer:** ${ctx.dpoEmail}` : ""}

---

*This Data Retention Schedule Visual was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Retention periods are based on regulatory best practices and should be reviewed by your legal and compliance teams.*`);

  return sections.join("\n");
}
