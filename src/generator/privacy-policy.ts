import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { generateDataFlowSection } from "../scanner/data-flow.js";
import { generateClassificationSummaryForPrivacyPolicy } from "../scanner/data-classification.js";
import { t } from "../i18n/index.js";

/** US-based providers that trigger international transfer disclosures. */
const US_BASED_PROVIDERS = new Set([
  "openai",
  "stripe",
  "@anthropic-ai/sdk",
  "replicate",
  "together-ai",
  "cohere",
  "@pinecone-database/pinecone",
  "@paypal/checkout-server-sdk",
  "@google-analytics/data",
  "posthog",
  "mixpanel",
  "@amplitude/analytics-browser",
  "@vercel/analytics",
  "hotjar",
  "@clerk/nextjs",
  "@sendgrid/mail",
  "resend",
  "@sentry/node",
  "@sentry/nextjs",
  "@sentry/react",
  "@aws-sdk/client-s3",
  "@uploadthing/react",
  "cloudinary",
  "twilio",
  "@twilio/voice-sdk",
  "intercom",
  "@intercom/messenger-js-sdk",
  "@hubspot/api-client",
  "launchdarkly-js-client-sdk",
  "@launchdarkly/node-server-sdk",
  "@segment/analytics-next",
  "algoliasearch",
  "@onesignal/node-onesignal",
  "firebase",
  "firebase-admin",
  "@google/generative-ai",
]);

/** Map service categories to their default GDPR legal basis. */
const LEGAL_BASIS_MAP: Record<string, { basis: string; article: string; detail: string }> = {
  auth: {
    basis: "Contract",
    article: "Art. 6(1)(b)",
    detail: "Necessary to fulfill our agreement with you",
  },
  payment: {
    basis: "Contract",
    article: "Art. 6(1)(b)",
    detail: "Necessary to fulfill our agreement with you",
  },
  analytics: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    detail: "Only with your opt-in consent",
  },
  ai: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    detail: "Only with your opt-in consent; or Contract (Art. 6(1)(b)) if integral to the service",
  },
  email: {
    basis: "Legitimate Interest",
    article: "Art. 6(1)(f)",
    detail: "Communicating service-related information to you",
  },
  monitoring: {
    basis: "Legitimate Interest",
    article: "Art. 6(1)(f)",
    detail: "Protecting our service, detecting errors, and ensuring security",
  },
  storage: {
    basis: "Contract",
    article: "Art. 6(1)(b)",
    detail: "Necessary to provide file storage as part of the service",
  },
  database: {
    basis: "Contract",
    article: "Art. 6(1)(b)",
    detail: "Necessary to store and manage your data as part of the service",
  },
  advertising: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    detail: "Only with your opt-in consent",
  },
  social: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    detail: "Only with your opt-in consent",
  },
  other: {
    basis: "Legitimate Interest",
    article: "Art. 6(1)(f)",
    detail: "Supporting our service operations",
  },
};

/** Recommended data retention periods per service category. */
const RETENTION_RECOMMENDATIONS: Record<string, string> = {
  auth: "Account data retained until you delete your account",
  payment: "Transaction records retained for 7 years (tax and legal compliance)",
  analytics: "Analytics data retained for up to 26 months",
  ai: "AI interaction data retained for up to 90 days",
  email: "Email communication records retained for up to 3 years",
  monitoring: "Error and performance data retained for up to 90 days",
  storage: "Uploaded files retained until you delete them or your account",
  database: "User data retained until you delete your account",
  advertising: "Advertising data retained for up to 26 months",
  social: "Social integration data retained for up to 26 months",
  other: "Data retained as long as necessary for the service",
};

/** Map service categories to CCPA categories of sources (Section 1798.110(a)(2)). */
const CCPA_SOURCE_MAP: Record<string, string[]> = {
  auth: ["Directly from you (account registration, login forms)"],
  payment: ["Directly from you (checkout and billing forms)", "From third parties (payment processors)"],
  analytics: ["Automatically (cookies, web beacons, analytics tools)"],
  ai: ["Directly from you (inputs to AI-powered features)", "From third parties (AI service providers)"],
  email: ["Directly from you (email address provided at signup or contact)"],
  monitoring: ["Automatically (error reports, device information, IP address)"],
  storage: ["Directly from you (file uploads)"],
  database: ["Directly from you (account creation, form submissions)"],
  advertising: ["Automatically (tracking pixels, ad interactions)", "From third parties (advertising networks)"],
  social: ["From third parties (social media platforms)", "Automatically (social plugin interactions)"],
};

/** Map service categories to CCPA business/commercial purposes (Section 1798.110(a)(3)). */
const CCPA_PURPOSE_MAP: Record<string, string> = {
  auth: "Performing services: Providing account creation, authentication, and access control",
  payment: "Performing services: Processing transactions, billing, and fulfilling orders",
  analytics: "Auditing: Counting ad impressions, verifying positioning, and auditing compliance; Short-term transient use: Contextualizing and customizing content shown to you",
  ai: "Performing services: Providing AI-powered features and functionality integral to the service",
  email: "Performing services: Sending transactional and service-related communications",
  monitoring: "Debugging: Identifying and repairing errors that impair intended functionality; Security: Detecting security incidents and protecting against malicious or illegal activity",
  storage: "Performing services: Providing file storage and media hosting as part of the service",
  database: "Performing services: Storing and managing user data necessary for core service functionality",
  advertising: "Advertising: Displaying and measuring advertising; Short-term transient use: Contextualizing ads shown to you",
  social: "Performing services: Enabling social features and third-party integrations",
};

/** Map service categories to CCPA personal information categories. */
const CCPA_CATEGORY_MAP: Record<string, string> = {
  auth: "Identifiers (name, email address, account credentials)",
  payment: "Financial information (payment card details, billing address, transaction history)",
  analytics: "Internet or other electronic network activity (browsing history, interactions with website)",
  ai: "Inferences drawn from personal information (AI-generated profiles and predictions)",
  email: "Identifiers (email address, communication records)",
  monitoring: "Internet or other electronic network activity (device info, error reports, IP address)",
  storage: "Audio, electronic, visual, or similar information (uploaded files and media)",
  database: "Identifiers and other personal information stored in databases",
  advertising: "Internet or other electronic network activity (ad interactions, tracking data)",
  social: "Internet or other electronic network activity (social media interactions)",
};

export function generatePrivacyPolicy(scan: ScanResult, ctx?: GeneratorContext): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const lang = ctx?.language || "en";
  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title & Introduction ──────────────────────────────────────────

  const previousVersionUrl = ctx?.website ? `${ctx.website}/legal/privacy-policy/previous` : "[previous-version-url]";

  sections.push(`# ${t("privacy.title", lang)}

**${t("privacy.effectiveDate", lang)}** ${date}
**${t("privacy.lastUpdated", lang)}** ${date}
**${t("privacy.previousVersion", lang)}** ${t("privacy.previousVersionLink", lang, { previousVersionUrl })}

**${t("privacy.project", lang)}** ${scan.projectName}

---

## ${nextSection()}. ${t("privacy.introduction", lang)}

${t("privacy.introText", lang, { company })}

${t("privacy.introCommitment", lang)}

**${t("privacy.dataController", lang)}** ${company}
**${t("privacy.contactEmail", lang)}** ${email}${ctx?.euRepresentative ? `\n**${t("privacy.euRepresentative", lang)}** ${ctx.euRepresentative}` : ""}`);

  // ── DPO Contact (Art. 13(1)(b)) ───────────────────────────────────

  {
    const dpoName = ctx?.dpoName;
    const dpoEmail = ctx?.dpoEmail;

    let dpoSection = `\n## ${nextSection()}. ${t("privacy.dpo", lang)}\n\n`;

    if (dpoName || dpoEmail) {
      dpoSection += `${t("privacy.dpoContact", lang)}\n`;
      if (dpoName) dpoSection += `- **${t("privacy.dpoName", lang)}** ${dpoName}\n`;
      if (dpoEmail) dpoSection += `- **${t("privacy.dpoEmail", lang)}** ${dpoEmail}\n`;
    } else {
      dpoSection += `${t("privacy.dpoPrimary", lang, { email })}\n\n`;
      dpoSection += `> ${t("privacy.dpoNote", lang)}\n`;
    }

    sections.push(dpoSection);
  }

  // ── Data We Collect ───────────────────────────────────────────────

  if (scan.dataCategories.length > 0) {
    let dataSection = `\n## ${nextSection()}. ${t("privacy.infoWeCollect", lang)}\n\n${t("privacy.infoWeCollectIntro", lang)}\n`;

    for (const cat of scan.dataCategories) {
      dataSection += `\n### ${cat.category}\n\n${cat.description}\n`;
      dataSection += `\n**${t("privacy.collectedThrough", lang)}** ${cat.sources.join(", ")}\n`;
    }

    sections.push(dataSection);
  } else {
    sections.push(`\n## ${nextSection()}. ${t("privacy.infoWeCollect", lang)}\n\n${t("privacy.noInfoCollected", lang)}\n`);
  }

  // ── Data Flow Map (after "Information We Collect") ────────────────

  const dataFlowSection = generateDataFlowSection(scan);
  if (dataFlowSection) {
    // Append to the last section (Information We Collect) as a subsection
    sections[sections.length - 1] += "\n" + dataFlowSection;
  }

  // ── Data Sensitivity Classification (after Data Flow) ──────────────

  const classificationSection = generateClassificationSummaryForPrivacyPolicy(scan);
  if (classificationSection) {
    sections[sections.length - 1] += "\n" + classificationSection;
  }

  // ── Third-Party Services / Recipients ─────────────────────────────

  const thirdPartyServices = scan.services.filter(
    (s) => s.category !== "database"
  );
  if (thirdPartyServices.length > 0) {
    let tpSection = `\n## ${nextSection()}. ${t("privacy.thirdPartyServices", lang)}\n\n${t("privacy.thirdPartyIntro", lang)}\n`;

    for (const service of thirdPartyServices) {
      tpSection += `\n- **${service.name}** (${formatCategory(service.category)}): ${t("common.processes", lang)} ${service.dataCollected.join(", ")}`;
    }

    tpSection += `\n\n${t("privacy.thirdPartyNote", lang)}\n`;

    sections.push(tpSection);
  }

  // ── Legal Basis Per Purpose (Art. 13(1)(c)/(d)) ───────────────────

  {
    const detectedCategories = getUniqueCategories(scan.services);

    if (detectedCategories.length > 0) {
      let legalSection = `\n## ${nextSection()}. ${t("privacy.legalBasis", lang)}\n\n`;
      legalSection += `${t("privacy.legalBasisIntro", lang)}\n\n`;
      legalSection += `| ${t("privacy.legalBasisPurpose", lang)} | ${t("privacy.legalBasisBasis", lang)} | ${t("privacy.legalBasisArticle", lang)} | ${t("privacy.legalBasisDetails", lang)} |\n`;
      legalSection += `|---------|------------|--------------|--------|\n`;

      for (const cat of detectedCategories) {
        const info = LEGAL_BASIS_MAP[cat] || LEGAL_BASIS_MAP["other"];
        legalSection += `| ${formatCategory(cat)} | ${info.basis} | ${info.article} | ${info.detail} |\n`;
      }

      // Add legitimate interest detail if applicable
      const hasLegitimateInterest = detectedCategories.some(
        (c) => LEGAL_BASIS_MAP[c]?.basis === "Legitimate Interest"
      );
      if (hasLegitimateInterest) {
        legalSection += `\n### ${t("privacy.legitimateInterests", lang)}\n\n`;
        legalSection += `${t("privacy.legitimateInterestsIntro", lang)}\n\n`;

        for (const cat of detectedCategories) {
          const info = LEGAL_BASIS_MAP[cat];
          if (info?.basis === "Legitimate Interest") {
            legalSection += `- **${formatCategory(cat)}:** ${info.detail}\n`;
          }
        }
      }

      sections.push(legalSection);
    }
  }

  // ── AI-specific section ───────────────────────────────────────────

  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length > 0) {
    let aiSection = `\n## ${nextSection()}. ${t("privacy.ai", lang)}\n\n${t("privacy.aiIntro", lang)}\n`;

    for (const ai of aiServices) {
      aiSection += `\n- **${ai.name}**: ${ai.dataCollected.join(", ")}`;
    }

    aiSection += `\n\n### ${t("privacy.aiHowWeUse", lang)}\n\n- ${t("privacy.aiUsage1", lang)}\n- ${t("privacy.aiUsage2", lang)}\n- ${t("privacy.aiUsage3", lang)}\n- ${t("privacy.aiUsage4", lang)}\n\n> ${t("privacy.aiNote", lang)}\n`;

    sections.push(aiSection);
  }

  // ── International Data Transfers (Art. 13(1)(f)) ──────────────────

  {
    const usBasedServices = scan.services.filter((s) =>
      US_BASED_PROVIDERS.has(s.name)
    );

    if (usBasedServices.length > 0) {
      let transferSection = `\n## ${nextSection()}. ${t("privacy.internationalTransfers", lang)}\n\n`;
      transferSection += `${t("privacy.internationalTransfersIntro", lang)}\n\n`;

      for (const service of usBasedServices) {
        transferSection += `- **${service.name}** (${formatCategory(service.category)})\n`;
      }

      transferSection += `\n${t("privacy.internationalTransfersSafeguards", lang)}\n\n`;
      transferSection += `- ${t("privacy.transferSafeguard1", lang)}\n`;
      transferSection += `- ${t("privacy.transferSafeguard2", lang)}\n`;
      transferSection += `- ${t("privacy.transferSafeguard3", lang)}\n`;
      transferSection += `\n${t("privacy.transferContact", lang, { email })}\n`;

      sections.push(transferSection);
    }
  }

  // ── Data Retention ────────────────────────────────────────────────

  {
    const retentionDays = ctx?.dataRetentionDays;
    const detectedCategories = getUniqueCategories(scan.services);

    let retentionSection = `\n## ${nextSection()}. ${t("privacy.dataRetention", lang)}\n\n`;
    retentionSection += `${t("privacy.dataRetentionIntro", lang)}\n`;

    if (retentionDays) {
      retentionSection += `\n**${t("privacy.defaultRetention", lang)}** ${retentionDays} days\n`;
    }

    if (detectedCategories.length > 0) {
      retentionSection += `\n| ${t("privacy.dataType", lang)} | ${t("privacy.retentionPeriod", lang)} |\n`;
      retentionSection += `|-----------|------------------|\n`;

      for (const cat of detectedCategories) {
        const retention = RETENTION_RECOMMENDATIONS[cat] || RETENTION_RECOMMENDATIONS["other"];
        retentionSection += `| ${formatCategory(cat)} | ${retention} |\n`;
      }
    } else {
      retentionSection += `\n- ${t("privacy.retentionAccount", lang)}\n`;
      retentionSection += `- ${t("privacy.retentionUsage", lang)}\n`;
      retentionSection += `- ${t("privacy.retentionPayment", lang)}\n`;
    }

    sections.push(retentionSection);
  }

  // ── Your Rights ───────────────────────────────────────────────────

  // Determine which jurisdiction sections to show
  const jurisdictions = ctx?.jurisdictions || [];
  const companyLocation = ctx?.companyLocation || "";
  const hasAnalyticsServices = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );

  const showCCPA =
    jurisdictions.includes("ccpa") ||
    companyLocation.toUpperCase() === "US" ||
    hasAnalyticsServices;

  const showUKGDPR = jurisdictions.includes("uk-gdpr");

  {
    let rightsSection = `\n## ${nextSection()}. ${t("privacy.yourRights", lang)}

${t("privacy.yourRightsIntro", lang)}

- ${t("privacy.rightAccess", lang)}
- ${t("privacy.rightRectification", lang)}
- ${t("privacy.rightErasure", lang)}
- ${t("privacy.rightPortability", lang)}
- ${t("privacy.rightObjection", lang)}
- ${t("privacy.rightRestriction", lang)}

### ${t("privacy.gdprRights", lang)}

${t("privacy.gdprComplaint", lang)}`;

    if (showCCPA) {
      const analyticsDetected = scan.services.some(
        (s) => s.category === "analytics" || s.category === "advertising"
      );

      rightsSection += `

### For California Residents (CCPA/CPRA)

Under the California Consumer Privacy Act and California Privacy Rights Act:

#### Categories of Personal Information Collected
`;

      // Map detected service categories to CCPA categories
      const ccpaCategories: string[] = [];
      const detectedCats = getUniqueCategories(scan.services);
      for (const cat of detectedCats) {
        const ccpaCat = CCPA_CATEGORY_MAP[cat];
        if (ccpaCat && !ccpaCategories.includes(ccpaCat)) {
          ccpaCategories.push(ccpaCat);
        }
      }

      if (ccpaCategories.length > 0) {
        for (const c of ccpaCategories) {
          rightsSection += `- ${c}\n`;
        }
      } else {
        rightsSection += `- Identifiers (name, email address, IP address)\n`;
      }

      // Categories of Sources (Section 1798.110(a)(2))
      rightsSection += `\n#### Categories of Sources\n\nWe collect personal information from the following categories of sources:\n\n`;
      const allSources = new Set<string>();
      for (const cat of detectedCats) {
        const sources = CCPA_SOURCE_MAP[cat];
        if (sources) {
          for (const s of sources) {
            allSources.add(s);
          }
        }
      }
      if (allSources.size > 0) {
        for (const s of allSources) {
          rightsSection += `- ${s}\n`;
        }
      } else {
        rightsSection += `- Directly from you (forms, account creation)\n`;
        rightsSection += `- Automatically (cookies, analytics)\n`;
        rightsSection += `- From third parties (payment processors, auth providers)\n`;
      }

      // Business/Commercial Purpose (Section 1798.110(a)(3))
      rightsSection += `\n#### Business or Commercial Purpose for Collection\n\nWe collect and use personal information for the following business or commercial purposes:\n\n`;
      for (const cat of detectedCats) {
        const purpose = CCPA_PURPOSE_MAP[cat];
        if (purpose) {
          rightsSection += `- **${formatCategory(cat)}:** ${purpose}\n`;
        }
      }

      rightsSection += `
#### Your CCPA Rights
- Right to Know
- Right to Correct (CPRA Section 1798.106)
- Right to Delete
- Right to Opt-Out of Sale/Sharing
- Right to Limit Use of Sensitive Personal Information
- Right to Non-Discrimination

#### Do Not Sell or Share My Personal Information
`;

      if (analyticsDetected) {
        rightsSection += `We do not sell your personal information. We share personal information with analytics providers for cross-context behavioral advertising. You may opt out by contacting us at ${email} or using our opt-out mechanism.\n`;
      } else {
        rightsSection += `We do not sell your personal information.\n`;
      }

      // Request submission methods (Section 1798.130)
      const tollFree = ctx?.tollFreeNumber || "[1-800-XXX-XXXX]";
      rightsSection += `
#### How to Submit a Request

You may submit a request to exercise your CCPA rights through the following methods:

- **Email:** ${email}
- **Toll-Free Telephone Number:** ${tollFree}${tollFree === "[1-800-XXX-XXXX]" ? " *(update with your toll-free number)*" : ""}

We will respond to verifiable consumer requests within 45 days.
`;

      rightsSection += `
#### Authorized Agent
You may designate an authorized agent to make requests on your behalf.`;
    }

    if (showUKGDPR) {
      rightsSection += `

### For UK Residents (UK GDPR)
- Supervisory authority: Information Commissioner's Office (ICO)
- International transfers: UK International Data Transfer Agreement (IDTA)`;
    }

    sections.push(rightsSection);
  }

  // ── Right to Withdraw Consent (Art. 13(2)(c)) ────────────────────

  {
    const hasConsentBasis = scan.services.some((s) => {
      const info = LEGAL_BASIS_MAP[s.category];
      return info?.basis === "Consent";
    });

    let consentSection = `\n## ${nextSection()}. ${t("privacy.withdrawConsent", lang)}\n\n`;

    if (hasConsentBasis) {
      consentSection += `${t("privacy.withdrawConsentText", lang)}\n\n`;
      consentSection += `${t("privacy.withdrawConsentMethods", lang)}\n\n`;
      consentSection += `- ${t("privacy.withdrawMethod1", lang)}\n`;
      consentSection += `- ${t("privacy.withdrawMethod2", lang, { email })}\n\n`;
      consentSection += `${t("privacy.withdrawConsentNote", lang)}\n`;
    } else {
      consentSection += `${t("privacy.withdrawConsentSimple", lang, { email })}\n`;
    }

    sections.push(consentSection);
  }

  // ── Automated Decision-Making (Art. 13(2)(f)) ────────────────────

  {
    let admSection = `\n## ${nextSection()}. ${t("privacy.automatedDecisions", lang)}\n\n`;

    if (aiServices.length > 0) {
      admSection += `${t("privacy.automatedAIIntro", lang)}\n\n`;

      const providers = aiServices.map((s) => s.name).join(", ");
      admSection += `### ${t("privacy.automatedLogic", lang)}\n\n`;
      admSection += `${t("privacy.automatedLogicIntro", lang, { providers })}\n\n`;
      admSection += `- ${t("privacy.automatedLogic1", lang)}\n`;
      admSection += `- ${t("privacy.automatedLogic2", lang)}\n`;
      admSection += `- ${t("privacy.automatedLogic3", lang)}\n\n`;

      admSection += `### ${t("privacy.automatedSignificance", lang)}\n\n`;
      admSection += `${t("privacy.automatedSignificanceIntro", lang)}\n\n`;
      admSection += `- ${t("privacy.automatedSignificance1", lang)}\n`;
      admSection += `- ${t("privacy.automatedSignificance2", lang)}\n`;
      admSection += `- ${t("privacy.automatedSignificance3", lang)}\n\n`;

      admSection += `### ${t("privacy.automatedRights", lang)}\n\n`;
      admSection += `${t("privacy.automatedRightsIntro", lang)}\n\n`;
      admSection += `- ${t("privacy.automatedRight1", lang)}\n`;
      admSection += `- ${t("privacy.automatedRight2", lang)}\n`;
      admSection += `- ${t("privacy.automatedRight3", lang)}\n\n`;
      admSection += `${t("privacy.automatedRightsContact", lang, { email })}\n`;
    } else {
      admSection += `${t("privacy.automatedNone", lang)}\n`;
    }

    sections.push(admSection);
  }

  // ── Data Provision Requirements (Art. 13(2)(e)) ───────────────────

  sections.push(`\n## ${nextSection()}. ${t("privacy.dataProvision", lang)}

${t("privacy.dataProvisionText", lang)}

- ${t("privacy.dataProvisionRequired", lang)}
- ${t("privacy.dataProvisionOptional", lang)}`);

  // ── Children's Privacy (COPPA) ───────────────────────────────────

  {
    const hasCOPPA = scan.complianceNeeds.some((n) => n.document === "COPPA Compliance");
    if (hasCOPPA) {
      let coppaSection = `\n## ${nextSection()}. Children's Privacy\n\n`;
      coppaSection += `We are committed to protecting the privacy of children. Our service may be used by or directed at children under the age of 13, and we comply with the Children's Online Privacy Protection Act (COPPA).\n\n`;
      coppaSection += `### Parental Consent\n\n`;
      coppaSection += `We do not knowingly collect personal information from children under 13 without verifiable parental consent. Before collecting, using, or disclosing personal information from a child under 13, we require verifiable consent from a parent or legal guardian.\n\n`;
      coppaSection += `### Information We Collect from Children\n\n`;
      coppaSection += `With parental consent, we may collect the minimum information necessary to provide our service. We do not condition a child's participation on providing more personal information than is reasonably necessary.\n\n`;
      coppaSection += `### Parental Rights\n\n`;
      coppaSection += `Parents and legal guardians have the right to:\n\n`;
      coppaSection += `- Review the personal information we have collected from their child\n`;
      coppaSection += `- Request deletion of their child's personal information\n`;
      coppaSection += `- Refuse to permit further collection or use of their child's information\n\n`;
      coppaSection += `### How to Request Deletion\n\n`;
      coppaSection += `To request the review or deletion of your child's personal information, please contact us at ${email}. We will respond to your request within a reasonable timeframe and verify your identity as the child's parent or legal guardian before processing the request.\n`;

      sections.push(coppaSection);
    }
  }

  // ── Changes to This Policy ───────────────────────────────────────

  sections.push(`\n## ${nextSection()}. ${t("privacy.changesToPolicy", lang)}

${t("privacy.changesToPolicyText", lang)}

${t("privacy.changesToPolicyCommitment", lang)}

${t("privacy.changesToPolicyContinued", lang)}`);

  // ── Contact ───────────────────────────────────────────────────────

  sections.push(`\n## ${nextSection()}. ${t("privacy.contact", lang)}

${t("privacy.contactIntro", lang)}

- **${t("common.email", lang)}** ${email}${ctx?.dpoEmail ? `\n- **${t("privacy.contactDPO", lang)}** ${ctx.dpoEmail}` : ""}

---

*${t("privacy.footer", lang)}*`);

  return sections.join("\n");
}

function formatCategory(cat: string): string {
  const labels: Record<string, string> = {
    ai: "AI Service",
    payment: "Payment Processing",
    analytics: "Analytics",
    auth: "Authentication",
    email: "Email Service",
    database: "Database",
    storage: "File Storage",
    monitoring: "Error Monitoring",
    advertising: "Advertising",
    social: "Social Integration",
    other: "Other",
  };
  return labels[cat] || cat;
}

/** Extract unique service categories from detected services, preserving order of first occurrence. */
function getUniqueCategories(services: DetectedService[]): string[] {
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
