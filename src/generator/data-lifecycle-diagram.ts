import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate DATA_LIFECYCLE_DIAGRAM.md — Mermaid diagram showing the full
 * data lifecycle (Collection -> Processing -> Storage -> Sharing -> Deletion)
 * with per-data-type lifecycle details and retention periods.
 */

/** Retention period per service category (in human-readable form). */
const RETENTION_PERIODS: Record<string, string> = {
  auth: "Until account deletion",
  payment: "7 years (tax/legal)",
  analytics: "26 months",
  ai: "90 days",
  email: "3 years",
  monitoring: "90 days",
  storage: "Until account deletion",
  database: "Until account deletion",
  advertising: "26 months",
  social: "26 months",
  other: "1 year",
};

/** Map data categories to lifecycle stages with descriptions. */
interface DataTypeLifecycle {
  dataType: string;
  sources: string[];
  collection: string;
  processing: string;
  storage: string;
  sharing: string;
  retention: string;
  deletion: string;
}

function inferDataTypes(services: DetectedService[]): DataTypeLifecycle[] {
  const types: DataTypeLifecycle[] = [];
  const seen = new Set<string>();

  const hasAuth = services.some((s) => s.category === "auth");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAI = services.some((s) => s.category === "ai");
  const hasEmail = services.some((s) => s.category === "email");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasStorage = services.some((s) => s.category === "storage");
  const hasMonitoring = services.some((s) => s.category === "monitoring");

  if (hasAuth && !seen.has("identity")) {
    seen.add("identity");
    const authServices = services.filter((s) => s.category === "auth").map((s) => s.name);
    types.push({
      dataType: "Identity & Account Data",
      sources: authServices,
      collection: "User registration, OAuth login, profile updates",
      processing: "Authentication, session management, access control",
      storage: "Encrypted at rest in auth provider and local database",
      sharing: "Auth provider only; not shared with third parties",
      retention: RETENTION_PERIODS.auth,
      deletion: "On account deletion request or DSAR; cascades to all linked data",
    });
  }

  if (hasPayment && !seen.has("payment")) {
    seen.add("payment");
    const payServices = services.filter((s) => s.category === "payment").map((s) => s.name);
    types.push({
      dataType: "Payment & Billing Data",
      sources: payServices,
      collection: "Checkout flow, subscription management, invoicing",
      processing: "Payment tokenization, fraud detection, tax calculation",
      storage: "Tokenized by payment processor; no raw card data stored",
      sharing: "Payment processor, tax authority (as required by law)",
      retention: RETENTION_PERIODS.payment,
      deletion: "Transaction records retained per legal obligation; tokens revoked on request",
    });
  }

  if (hasAnalytics && !seen.has("behavioral")) {
    seen.add("behavioral");
    const analyticsServices = services.filter((s) => s.category === "analytics" || s.category === "advertising").map((s) => s.name);
    types.push({
      dataType: "Behavioral & Analytics Data",
      sources: analyticsServices,
      collection: "Page views, clicks, session recordings, feature usage",
      processing: "Aggregation, segmentation, funnel analysis",
      storage: "Analytics provider cloud infrastructure",
      sharing: "Analytics provider; may be shared with advertising partners",
      retention: RETENTION_PERIODS.analytics,
      deletion: "Automatic expiry after retention period; on opt-out via consent preferences",
    });
  }

  if (hasAI && !seen.has("ai")) {
    seen.add("ai");
    const aiServices = services.filter((s) => s.category === "ai").map((s) => s.name);
    types.push({
      dataType: "AI Interaction Data",
      sources: aiServices,
      collection: "User prompts, queries, uploaded content for AI processing",
      processing: "Inference, content generation, classification",
      storage: "Temporarily cached by AI provider during processing",
      sharing: "AI provider API; subject to provider data processing terms",
      retention: RETENTION_PERIODS.ai,
      deletion: "Auto-purged after retention window; immediate on DSAR request",
    });
  }

  if (hasEmail && !seen.has("communication")) {
    seen.add("communication");
    const emailServices = services.filter((s) => s.category === "email").map((s) => s.name);
    types.push({
      dataType: "Communication Data",
      sources: emailServices,
      collection: "Transactional emails, marketing emails, notifications",
      processing: "Template rendering, delivery tracking, bounce handling",
      storage: "Email service provider logs and delivery records",
      sharing: "Email service provider only",
      retention: RETENTION_PERIODS.email,
      deletion: "Unsubscribe removes from marketing lists; logs expire per retention",
    });
  }

  if (hasMonitoring && !seen.has("technical")) {
    seen.add("technical");
    const monServices = services.filter((s) => s.category === "monitoring").map((s) => s.name);
    types.push({
      dataType: "Technical & Error Data",
      sources: monServices,
      collection: "Error reports, stack traces, performance metrics, IP addresses",
      processing: "Error grouping, alerting, performance analysis",
      storage: "Monitoring service cloud infrastructure",
      sharing: "Monitoring provider only; may include anonymized IP",
      retention: RETENTION_PERIODS.monitoring,
      deletion: "Automatic expiry; scrubbed of PII before long-term storage",
    });
  }

  if ((hasDatabase || hasStorage) && !seen.has("user-content")) {
    seen.add("user-content");
    const storageServices = services.filter((s) => s.category === "database" || s.category === "storage").map((s) => s.name);
    types.push({
      dataType: "User-Generated Content",
      sources: storageServices,
      collection: "File uploads, form submissions, user-created content",
      processing: "Validation, transformation, indexing",
      storage: "Database and/or object storage with encryption at rest",
      sharing: "Not shared externally unless user explicitly shares",
      retention: RETENTION_PERIODS.database,
      deletion: "On user request or account deletion; backups purged within 30 days",
    });
  }

  return types;
}

function buildMermaidLifecycleDiagram(dataTypes: DataTypeLifecycle[]): string {
  const lines: string[] = [];
  lines.push("```mermaid");
  lines.push("graph LR");
  lines.push("  subgraph Lifecycle[\"Data Lifecycle\"]");
  lines.push("    C[\"Collection\"] --> P[\"Processing\"]");
  lines.push("    P --> S[\"Storage\"]");
  lines.push("    S --> SH[\"Sharing\"]");
  lines.push("    S --> D[\"Deletion\"]");
  lines.push("  end");
  lines.push("");

  // Add per-data-type sub-flows
  for (let i = 0; i < dataTypes.length; i++) {
    const dt = dataTypes[i];
    const prefix = `DT${i}`;
    const safeName = dt.dataType.replace(/[^a-zA-Z0-9 ]/g, "");
    lines.push(`  subgraph ${prefix}[\"${safeName}\"]`);
    lines.push(`    ${prefix}C[\"Collect\"] --> ${prefix}P[\"Process\"]`);
    lines.push(`    ${prefix}P --> ${prefix}S[\"Store\"]`);
    lines.push(`    ${prefix}S --> ${prefix}D[\"Delete\\n${dt.retention}\"]`);
    lines.push("  end");
    lines.push("");
  }

  // Style
  lines.push("  style Lifecycle fill:#f0f4ff,stroke:#4a6fa5");
  for (let i = 0; i < dataTypes.length; i++) {
    const colors = ["#e8f5e9", "#fff3e0", "#e3f2fd", "#fce4ec", "#f3e5f5", "#e0f7fa", "#fff8e1"];
    const strokes = ["#43a047", "#ef6c00", "#1976d2", "#c62828", "#7b1fa2", "#00838f", "#f9a825"];
    const ci = i % colors.length;
    lines.push(`  style DT${i} fill:${colors[ci]},stroke:${strokes[ci]}`);
  }

  lines.push("```");
  return lines.join("\n");
}

export function generateDataLifecycleDiagram(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const services = scan.services;

  const dataTypes = inferDataTypes(services);
  if (dataTypes.length === 0) {
    return null;
  }

  const lines: string[] = [];

  lines.push(`# Data Lifecycle Diagram — ${company}`);
  lines.push("");
  lines.push(`> Auto-generated by Codepliant on ${date}.`);
  lines.push(`> Shows the full data lifecycle from collection through deletion for each data type.`);
  lines.push("");

  // Overview
  lines.push("## Lifecycle Overview");
  lines.push("");
  lines.push("All personal data processed by this application follows a defined lifecycle:");
  lines.push("");
  lines.push("**Collection** — Data is gathered from users or systems");
  lines.push("**Processing** — Data is used for its intended purpose");
  lines.push("**Storage** — Data is persisted with appropriate safeguards");
  lines.push("**Sharing** — Data may be transferred to authorized third parties");
  lines.push("**Deletion** — Data is removed per retention schedule or on request");
  lines.push("");

  // Mermaid diagram
  lines.push("## Lifecycle Diagram");
  lines.push("");
  lines.push(buildMermaidLifecycleDiagram(dataTypes));
  lines.push("");

  // Retention summary table
  lines.push("## Retention Summary");
  lines.push("");
  lines.push("| Data Type | Retention Period | Deletion Trigger |");
  lines.push("|-----------|-----------------|------------------|");
  for (const dt of dataTypes) {
    lines.push(`| ${dt.dataType} | ${dt.retention} | ${dt.deletion.split(";")[0]} |`);
  }
  lines.push("");

  // Per-data-type detailed lifecycle
  lines.push("## Detailed Lifecycle per Data Type");
  lines.push("");

  for (const dt of dataTypes) {
    lines.push(`### ${dt.dataType}`);
    lines.push("");
    lines.push(`**Sources:** ${dt.sources.join(", ")}`);
    lines.push("");
    lines.push("| Stage | Description |");
    lines.push("|-------|-------------|");
    lines.push(`| Collection | ${dt.collection} |`);
    lines.push(`| Processing | ${dt.processing} |`);
    lines.push(`| Storage | ${dt.storage} |`);
    lines.push(`| Sharing | ${dt.sharing} |`);
    lines.push(`| Retention | ${dt.retention} |`);
    lines.push(`| Deletion | ${dt.deletion} |`);
    lines.push("");
  }

  // Data flow per stage
  lines.push("## Lifecycle Stage Details");
  lines.push("");

  lines.push("### Collection");
  lines.push("");
  lines.push("Data is collected through the following channels:");
  lines.push("");
  for (const dt of dataTypes) {
    lines.push(`- **${dt.dataType}**: ${dt.collection}`);
  }
  lines.push("");

  lines.push("### Processing");
  lines.push("");
  lines.push("Data is processed for the following purposes:");
  lines.push("");
  for (const dt of dataTypes) {
    lines.push(`- **${dt.dataType}**: ${dt.processing}`);
  }
  lines.push("");

  lines.push("### Storage");
  lines.push("");
  lines.push("Data is stored with the following safeguards:");
  lines.push("");
  for (const dt of dataTypes) {
    lines.push(`- **${dt.dataType}**: ${dt.storage}`);
  }
  lines.push("");

  lines.push("### Sharing");
  lines.push("");
  lines.push("Data sharing is limited to:");
  lines.push("");
  for (const dt of dataTypes) {
    lines.push(`- **${dt.dataType}**: ${dt.sharing}`);
  }
  lines.push("");

  lines.push("### Deletion");
  lines.push("");
  lines.push("Data deletion follows these procedures:");
  lines.push("");
  for (const dt of dataTypes) {
    lines.push(`- **${dt.dataType}**: ${dt.deletion}`);
  }
  lines.push("");

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    "*This data lifecycle diagram is generated from automated code analysis. Actual data flows may include additional processing not captured by code scanning. This does not constitute legal advice. Have this document reviewed by qualified compliance professionals.*",
  );
  lines.push("");

  return lines.join("\n");
}
