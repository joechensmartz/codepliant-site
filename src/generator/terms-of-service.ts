import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { t } from "../i18n/index.js";

export function generateTermsOfService(scan: ScanResult, ctx?: GeneratorContext): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const jurisdiction = ctx?.jurisdiction || "[Your Jurisdiction]";
  const date = new Date().toISOString().split("T")[0];
  const lang = ctx?.language || "en";

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# ${t("tos.title", lang)}

**${t("tos.effectiveDate", lang)}** ${date}
**${t("tos.lastModified", lang)}** ${date}

**${t("privacy.project", lang)}** ${scan.projectName}

---

## ${nextSection()}. ${t("tos.agreementToTerms", lang)}

${t("tos.agreementText", lang, { company })}

## ${nextSection()}. ${t("tos.description", lang)}

${t("tos.descriptionText", lang, { company })}

## ${nextSection()}. ${t("tos.userAccounts", lang)}

${t("tos.userAccountsIntro", lang)}

- ${t("tos.account1", lang)}
- ${t("tos.account2", lang)}
- ${t("tos.account3", lang)}
- ${t("tos.account4", lang)}
- ${t("tos.account5", lang)}

## ${nextSection()}. ${t("tos.acceptableUse", lang)}

${t("tos.acceptableUseIntro", lang)}

- ${t("tos.use1", lang)}
- ${t("tos.use2", lang)}
- ${t("tos.use3", lang)}
- ${t("tos.use4", lang)}
- ${t("tos.use5", lang)}
- ${t("tos.use6", lang)}
- ${t("tos.use7", lang)}`;

  if (hasAI) {
    doc += `

## ${nextSection()}. ${t("tos.aiContent", lang)}

${t("tos.aiContentIntro", lang)}

- ${t("tos.ai1", lang)}
- ${t("tos.ai2", lang)}
- ${t("tos.ai3", lang)}
- ${t("tos.ai4", lang)}
- ${t("tos.ai5", lang)}`;
  }

  if (hasPayment) {
    doc += `

## ${nextSection()}. ${t("tos.payments", lang)}

- ${t("tos.payment1", lang)}
- ${t("tos.payment2", lang)}
- ${t("tos.payment3", lang)}
- ${t("tos.payment4", lang)}
- ${t("tos.payment5", lang)}
- ${t("tos.payment6", lang)}`;
  }

  if (hasStorage) {
    doc += `

## ${nextSection()}. ${t("tos.userContent", lang)}

- ${t("tos.content1", lang)}
- ${t("tos.content2", lang)}
- ${t("tos.content3", lang)}
- ${t("tos.content4", lang)}
- ${t("tos.content5", lang)}`;
  }

  doc += `

## ${nextSection()}. ${t("tos.privacy", lang)}

${t("tos.privacyText", lang)}

## ${nextSection()}. ${t("tos.ip", lang)}

${t("tos.ipText", lang)}

## ${nextSection()}. ${t("tos.disclaimerOfWarranties", lang)}

${t("tos.disclaimerText", lang, { company })}

## ${nextSection()}. ${t("tos.liability", lang)}

${t("tos.liabilityIntro", lang)}

- ${t("tos.liability1", lang, { company })}
- ${t("tos.liability2", lang, { company })}
- ${t("tos.liability3", lang, { company })}
- ${t("tos.liability4", lang, { company })}

## ${nextSection()}. ${t("tos.indemnification", lang)}

${t("tos.indemnificationText", lang, { company })}

## ${nextSection()}. ${t("tos.disputes", lang)}

${t("tos.disputesText", lang, { jurisdiction })}

${t("tos.disputesSmallClaims", lang)}

${t("tos.classAction", lang, { company })}

## ${nextSection()}. ${t("tos.termination", lang)}

- ${t("tos.termination1", lang)}
- ${t("tos.termination2", lang)}
- ${t("tos.termination3", lang)}
- ${t("tos.termination4", lang)}

## ${nextSection()}. ${t("tos.changes", lang)}

${t("tos.changesText", lang)}`;

  if (hasMonitoring) {
    doc += `

## ${nextSection()}. ${t("tos.sla", lang)}

${t("tos.slaText", lang, { company })}

${t("tos.slaCommitment", lang, { company })}`;
  }

  doc += `

## ${nextSection()}. ${t("tos.forceMajeure", lang)}

${t("tos.forceMajeureText", lang)}

## ${nextSection()}. ${t("tos.governingLaw", lang)}

${t("tos.governingLawText", lang, { jurisdiction })}

## ${nextSection()}. ${t("tos.generalProvisions", lang)}

${t("tos.severability", lang)}

${t("tos.entireAgreement", lang, { company })}

${t("tos.assignment", lang)}

## ${nextSection()}. ${t("tos.contact", lang)}

${t("tos.contactText", lang)}

- **${t("common.email", lang)}** ${email}

---

*${t("tos.footer", lang)}*`;

  return doc;
}
