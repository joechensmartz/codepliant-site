import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * EU jurisdictions that trigger whistleblower policy generation.
 * The EU Whistleblower Directive (2019/1937) requires organizations with 50+
 * employees in EU member states to implement internal reporting channels.
 */
const EU_JURISDICTIONS = new Set(["GDPR", "UK GDPR"]);

/**
 * Check whether the configured jurisdiction(s) indicate EU compliance is needed.
 */
export function requiresWhistleblowerPolicy(ctx: GeneratorContext): boolean {
  if (ctx.jurisdiction && EU_JURISDICTIONS.has(ctx.jurisdiction)) return true;
  if (ctx.jurisdictions) {
    return ctx.jurisdictions.some((j) => EU_JURISDICTIONS.has(j));
  }
  return false;
}

/**
 * Generate a WHISTLEBLOWER_POLICY.md compliant with the EU Whistleblower
 * Directive (Directive 2019/1937).
 *
 * Returns null if the configured jurisdiction is not EU-related.
 */
export function generateWhistleblowerPolicy(
  _scan: ScanResult,
  ctx: GeneratorContext
): string | null {
  if (!requiresWhistleblowerPolicy(ctx)) return null;

  const company = ctx.companyName || "[Your Company Name]";
  const contactEmail = ctx.contactEmail || "[compliance@example.com]";
  const dpoName = ctx.dpoName || "[Compliance Officer Name]";
  const dpoEmail = ctx.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  sections.push("# Whistleblower Policy");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("> **Disclaimer:** This policy is auto-generated based on the EU Whistleblower Directive (2019/1937). It must be reviewed by legal counsel and adapted to your organization's specific structure and applicable national transposition laws.");
  sections.push("");

  // Purpose
  sections.push("## 1. Purpose");
  sections.push("");
  sections.push(`${company} is committed to maintaining a culture of transparency, integrity, and accountability. This policy establishes internal reporting channels and protections for individuals who report breaches of EU law or internal misconduct, in compliance with the EU Whistleblower Directive (Directive 2019/1937).`);
  sections.push("");

  // Scope
  sections.push("## 2. Scope");
  sections.push("");
  sections.push("This policy applies to:");
  sections.push("");
  sections.push("- Current and former employees");
  sections.push("- Contractors, subcontractors, and suppliers");
  sections.push("- Shareholders and members of administrative bodies");
  sections.push("- Volunteers and trainees (paid or unpaid)");
  sections.push("- Persons assisting the reporting person");
  sections.push("- Persons connected to the reporting person who may face retaliation");
  sections.push("");

  // Reportable breaches
  sections.push("## 3. Reportable Breaches");
  sections.push("");
  sections.push("Reports may be submitted regarding breaches in the following areas:");
  sections.push("");
  sections.push("- Public procurement");
  sections.push("- Financial services, products, and markets; anti-money laundering");
  sections.push("- Product safety and compliance");
  sections.push("- Transport safety");
  sections.push("- Environmental protection");
  sections.push("- Radiation and nuclear safety");
  sections.push("- Food and feed safety, animal health and welfare");
  sections.push("- Public health");
  sections.push("- Consumer protection");
  sections.push("- Data protection and privacy (GDPR)");
  sections.push("- Network and information system security");
  sections.push("- EU competition rules and state aid");
  sections.push("- Corporate tax arrangements");
  sections.push("- Other breaches of EU or national law");
  sections.push("");

  // Reporting channels
  sections.push("## 4. Internal Reporting Channels");
  sections.push("");
  sections.push(`${company} provides the following confidential reporting channels:`);
  sections.push("");
  sections.push("### 4.1 Email");
  sections.push("");
  sections.push(`Reports can be submitted via email to: **${dpoEmail}**`);
  sections.push("");
  sections.push("### 4.2 Written Report");
  sections.push("");
  sections.push(`Written reports can be sent to the attention of **${dpoName}** at the company's registered address, marked "Confidential — Whistleblower Report".`);
  sections.push("");
  sections.push("### 4.3 In-Person Meeting");
  sections.push("");
  sections.push(`A face-to-face or virtual meeting can be arranged by contacting **${dpoName}** at **${dpoEmail}**. Minutes of the meeting will be kept in a secure, access-restricted system.`);
  sections.push("");
  sections.push("### 4.4 Anonymous Reports");
  sections.push("");
  sections.push("Anonymous reports are accepted and will be investigated. However, providing contact information helps us follow up and provide feedback more effectively.");
  sections.push("");

  // Procedure
  sections.push("## 5. Reporting Procedure");
  sections.push("");
  sections.push("1. **Submission** — The reporting person submits a report through one of the channels described in Section 4.");
  sections.push("2. **Acknowledgment** — The designated officer acknowledges receipt within **7 calendar days**.");
  sections.push("3. **Assessment** — The report is assessed for admissibility and substance.");
  sections.push("4. **Investigation** — If warranted, an impartial investigation is conducted with appropriate confidentiality measures.");
  sections.push("5. **Feedback** — The reporting person receives feedback on the outcome within **3 months** of the acknowledgment date.");
  sections.push("6. **Resolution** — Appropriate remedial action is taken, which may include disciplinary proceedings, process improvements, or referral to external authorities.");
  sections.push("");

  // Protection measures
  sections.push("## 6. Protection Against Retaliation");
  sections.push("");
  sections.push(`${company} strictly prohibits any form of retaliation against reporting persons. Protected individuals shall not suffer:`);
  sections.push("");
  sections.push("- Suspension, dismissal, or demotion");
  sections.push("- Reduction in working hours, pay, or benefits");
  sections.push("- Intimidation, harassment, or bullying");
  sections.push("- Discrimination or unfavorable treatment");
  sections.push("- Damage to reputation or financial loss");
  sections.push("- Coercion, blacklisting, or early termination of contracts");
  sections.push("- Psychiatric or medical referrals used as retaliation");
  sections.push("");
  sections.push("Any person who retaliates against a whistleblower will be subject to disciplinary action, up to and including termination of employment or contract.");
  sections.push("");

  // Confidentiality
  sections.push("## 7. Confidentiality");
  sections.push("");
  sections.push("The identity of the reporting person is treated as strictly confidential. It will not be disclosed to any person beyond the authorized staff members competent to receive or follow up on reports, without the explicit consent of the reporting person.");
  sections.push("");
  sections.push("Exceptions apply only where disclosure is a necessary and proportionate obligation imposed by EU or national law, in the context of investigations by national authorities or judicial proceedings.");
  sections.push("");

  // Data protection
  sections.push("## 8. Data Protection");
  sections.push("");
  sections.push("All personal data collected through the reporting process is handled in accordance with the General Data Protection Regulation (GDPR). Data is:");
  sections.push("");
  sections.push("- Processed only for the purpose of investigating the reported breach");
  sections.push("- Stored securely with restricted access");
  sections.push("- Retained only as long as necessary and proportionate");
  sections.push("- Deleted when no longer needed for the investigation or follow-up actions");
  sections.push("");

  // External reporting
  sections.push("## 9. External Reporting");
  sections.push("");
  sections.push("If the reporting person believes that the internal reporting has not been followed up effectively, or if there is an imminent or manifest danger to the public interest, they may report to the competent national authority or EU institution.");
  sections.push("");
  sections.push("Public disclosure is protected under the Directive when internal and/or external reporting has been made without appropriate action being taken.");
  sections.push("");

  // Record keeping
  sections.push("## 10. Record Keeping");
  sections.push("");
  sections.push("All reports are documented in compliance with the Directive. Records are kept for no longer than necessary and proportionate to comply with legal requirements. Records include:");
  sections.push("");
  sections.push("- Date and nature of the report");
  sections.push("- Actions taken in response");
  sections.push("- Outcome of the investigation");
  sections.push("- Communication with the reporting person");
  sections.push("");

  // Contact
  sections.push("## 11. Contact");
  sections.push("");
  sections.push("For questions about this policy or to submit a report:");
  sections.push("");
  sections.push(`- **Designated Officer:** ${dpoName}`);
  sections.push(`- **Email:** ${dpoEmail}`);
  sections.push(`- **Organization:** ${company}`);
  sections.push("");

  return sections.join("\n");
}
