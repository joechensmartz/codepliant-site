import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a TRANSPARENCY_REPORT.md template for companies that need
 * annual public transparency reporting on government/authority data requests,
 * compliance metrics, and data handling practices.
 *
 * Relevant for companies subject to GDPR, DSA, CCPA, or operating platforms
 * that may receive government/law enforcement data requests.
 */
export function generateTransparencyReport(
  scan: ScanResult,
  ctx: GeneratorContext
): string {
  const year = new Date().getFullYear();
  const companyName = ctx.companyName;
  const lines: string[] = [];

  lines.push(`# Transparency Report — ${year}`);
  lines.push("");
  lines.push(`**${companyName}**`);
  lines.push(`**Reporting Period:** January 1, ${year} – December 31, ${year}`);
  lines.push(`**Published:** [Publication Date]`);
  lines.push("");
  lines.push(
    "> This transparency report provides information about government and authority requests for user data, content removal requests, and our compliance metrics. We publish this report annually to maintain accountability and build trust with our users."
  );
  lines.push("");

  // --- Executive Summary ---
  lines.push("## Executive Summary");
  lines.push("");
  lines.push(
    `${companyName} is committed to transparency about how we handle data requests from governments and authorities. This report covers the period from January 1 to December 31, ${year}.`
  );
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("|--------|-------|");
  lines.push("| Total government data requests | [NUMBER] |");
  lines.push("| Requests fully complied with | [NUMBER] |");
  lines.push("| Requests partially complied with | [NUMBER] |");
  lines.push("| Requests challenged or denied | [NUMBER] |");
  lines.push("| Content removal requests | [NUMBER] |");
  lines.push("| User accounts affected | [NUMBER] |");
  lines.push("");

  // --- Government / Authority Data Requests ---
  lines.push("## Government & Authority Data Requests");
  lines.push("");
  lines.push("### Overview");
  lines.push("");
  lines.push(
    "We receive requests for user data from law enforcement agencies, regulatory bodies, and other government authorities. We review each request for legal validity before responding."
  );
  lines.push("");
  lines.push("### Requests by Type");
  lines.push("");
  lines.push("| Request Type | Received | Complied | Partial | Challenged |");
  lines.push("|-------------|----------|----------|---------|------------|");
  lines.push("| Subpoena | [N] | [N] | [N] | [N] |");
  lines.push("| Court Order | [N] | [N] | [N] | [N] |");
  lines.push("| Search Warrant | [N] | [N] | [N] | [N] |");
  lines.push("| National Security Letter | [N] | [N] | [N] | [N] |");
  lines.push("| Emergency Disclosure | [N] | [N] | [N] | [N] |");
  lines.push("| International (MLAT) | [N] | [N] | [N] | [N] |");
  lines.push("| Regulatory Inquiry | [N] | [N] | [N] | [N] |");
  lines.push("| Other | [N] | [N] | [N] | [N] |");
  lines.push("");

  lines.push("### Requests by Jurisdiction");
  lines.push("");
  lines.push("| Jurisdiction | Requests Received |");
  lines.push("|-------------|------------------|");

  const jurisdictions = ctx.jurisdictions || [];
  if (jurisdictions.includes("GDPR")) {
    lines.push("| European Union (GDPR) | [N] |");
  }
  if (jurisdictions.includes("UK GDPR")) {
    lines.push("| United Kingdom | [N] |");
  }
  if (jurisdictions.includes("CCPA")) {
    lines.push("| United States (Federal) | [N] |");
    lines.push("| United States (California/CCPA) | [N] |");
  }
  lines.push("| Other | [N] |");
  lines.push("");

  lines.push("### How We Process Requests");
  lines.push("");
  lines.push("1. **Receipt & logging** — All requests are logged and assigned a tracking number.");
  lines.push("2. **Legal review** — Our legal team reviews each request for validity and scope.");
  lines.push("3. **Narrowing** — We challenge overly broad requests and seek to narrow their scope.");
  lines.push("4. **User notification** — Where legally permitted, we notify affected users before disclosing data.");
  lines.push("5. **Compliance** — We produce only the data strictly required by the valid legal process.");
  lines.push("6. **Documentation** — All responses are documented for audit purposes.");
  lines.push("");

  // --- Content Removal Requests ---
  lines.push("## Content Removal Requests");
  lines.push("");
  lines.push("| Source | Requests | Content Removed | Declined |");
  lines.push("|--------|----------|----------------|----------|");
  lines.push("| Government / Court Order | [N] | [N] | [N] |");
  lines.push("| DMCA / Copyright | [N] | [N] | [N] |");
  lines.push("| Community Reports | [N] | [N] | [N] |");
  lines.push("| Other | [N] | [N] | [N] |");
  lines.push("");

  // --- Data Subject Requests (DSAR) ---
  lines.push("## Data Subject Requests (DSAR)");
  lines.push("");
  lines.push("| Request Type | Received | Completed | Average Response Time |");
  lines.push("|-------------|----------|-----------|----------------------|");
  lines.push("| Access (Right to Know) | [N] | [N] | [N] days |");
  lines.push("| Deletion (Right to Erasure) | [N] | [N] | [N] days |");
  lines.push("| Portability | [N] | [N] | [N] days |");
  lines.push("| Rectification | [N] | [N] | [N] days |");
  lines.push("| Opt-Out of Sale | [N] | [N] | [N] days |");
  lines.push("");

  // --- Compliance Metrics ---
  lines.push("## Compliance Metrics");
  lines.push("");

  // Include detected services count
  const serviceCount = scan.services.length;
  const categories = [...new Set(scan.services.map((s) => s.category))];

  lines.push("### Third-Party Service Oversight");
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Third-party services in use | ${serviceCount} |`);
  lines.push(`| Service categories | ${categories.join(", ") || "none"} |`);
  lines.push(`| DPA agreements in place | [N] / ${serviceCount} |`);
  lines.push(`| Vendor security reviews completed | [N] / ${serviceCount} |`);
  lines.push("");

  lines.push("### Security & Incidents");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push("| Data breaches reported | [N] |");
  lines.push("| Security incidents (total) | [N] |");
  lines.push("| Mean time to detect (MTTD) | [N] hours |");
  lines.push("| Mean time to respond (MTTR) | [N] hours |");
  lines.push("| Breach notification compliance rate | [N]% |");
  lines.push("");

  lines.push("### Privacy Program");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push("| Privacy impact assessments conducted | [N] |");
  lines.push("| Employee privacy training completion | [N]% |");
  lines.push("| Policy reviews completed | [N] |");
  lines.push("| Consent collection compliance rate | [N]% |");
  lines.push("");

  // --- Warrant Canary ---
  lines.push("## Warrant Canary");
  lines.push("");
  lines.push(
    `As of the date of this report, ${companyName} has not received:`
  );
  lines.push("");
  lines.push("- Any National Security Letters with gag orders");
  lines.push("- Any orders under the Foreign Intelligence Surveillance Act (FISA)");
  lines.push("- Any requests to install backdoors in our products");
  lines.push("");
  lines.push(
    "_If this section is removed in a future report, users should draw their own conclusions._"
  );
  lines.push("");

  // --- Methodology ---
  lines.push("## Methodology");
  lines.push("");
  lines.push(
    "This report covers the calendar year stated above. All figures are aggregated and do not identify individual users. Our legal team reviews all data for accuracy before publication."
  );
  lines.push("");
  lines.push(
    "Request counts include only formal legal process requests, not informal inquiries or public record requests."
  );
  lines.push("");

  // --- Contact ---
  lines.push("## Contact");
  lines.push("");
  lines.push(
    `For questions about this transparency report, contact: ${ctx.contactEmail}`
  );
  if (ctx.dpoEmail) {
    lines.push(`Data Protection Officer: ${ctx.dpoEmail}`);
  }
  lines.push("");

  // --- Disclaimer ---
  lines.push("---");
  lines.push("");
  lines.push(
    `*This transparency report was generated by Codepliant on ${new Date().toISOString().split("T")[0]}. The template includes placeholder values marked with [N] or [NUMBER] that must be filled in with actual data before publication. This document should be reviewed by legal counsel before publication.*`
  );

  return lines.join("\n");
}
