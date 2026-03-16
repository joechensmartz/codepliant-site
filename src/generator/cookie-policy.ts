import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { t } from "../i18n/index.js";

export function generateCookiePolicy(scan: ScanResult, ctx?: GeneratorContext): string | null {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const jurisdiction = ctx?.jurisdiction || "[Your Jurisdiction]";
  const lang = ctx?.language || "en";
  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const authServices = scan.services.filter((s) => s.category === "auth");

  if (analyticsServices.length === 0 && authServices.length === 0) {
    return null;
  }

  const date = new Date().toISOString().split("T")[0];
  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# ${t("cookie.title", lang)}

**${t("privacy.lastUpdated", lang)}** ${date}

**${t("privacy.project", lang)}** ${scan.projectName}

---

## ${nextSection()}. ${t("cookie.whatAreCookies", lang)}

${t("cookie.whatAreCookiesText", lang)}

## ${nextSection()}. ${t("cookie.legalBasis", lang)}

${t("cookie.legalBasisText", lang)}

- ${t("cookie.strictlyNecessary", lang)}
- ${t("cookie.nonEssential", lang)}

## ${nextSection()}. ${t("cookie.yourConsent", lang)}

${t("cookie.consentIntro", lang, { company })}

${t("cookie.howWeObtainConsent", lang)}
- ${t("cookie.consent1", lang)}
- ${t("cookie.consent2", lang)}
- ${t("cookie.consent3", lang)}
- ${t("cookie.consent4", lang)}

${t("cookie.consentCategories", lang)}
${analyticsServices.length > 0 ? "- " + t("cookie.analyticsCookies", lang) + "\n" : ""}- ${t("cookie.marketingCookies", lang)}
- ${t("cookie.functionalCookies", lang)}

${t("cookie.consentRecords", lang)}

${t("cookie.withdrawingConsent", lang)}
- ${t("cookie.withdraw1", lang)}
- ${t("cookie.withdraw2", lang)}
- ${t("cookie.withdraw3", lang, { email })}

${t("cookie.withdrawNote", lang)}

## ${nextSection()}. ${t("cookie.howWeUse", lang)}

${t("cookie.howWeUseIntro", lang)}

### ${t("cookie.strictlyNecessaryHeading", lang)}

${t("cookie.strictlyNecessaryText", lang)}

| ${t("cookie.cookieHeader", lang)} | ${t("cookie.purposeHeader", lang)} | ${t("cookie.durationHeader", lang)} |
|--------|---------|----------|`;

  if (authServices.length > 0) {
    doc += `
| ${t("cookie.sessionCookie", lang)} | ${t("cookie.sessionPurpose", lang)} | ${t("cookie.sessionDuration", lang)} |
| ${t("cookie.authToken", lang)} | ${t("cookie.authPurpose", lang)} | ${t("cookie.authDuration", lang)} |`;
  }

  doc += `
| ${t("cookie.csrfToken", lang)} | ${t("cookie.csrfPurpose", lang)} | ${t("cookie.csrfDuration", lang)} |`;

  if (analyticsServices.length > 0) {
    doc += `

### ${t("cookie.optionalAnalytics", lang)}

${t("cookie.optionalAnalyticsText", lang)}

| ${t("cookie.serviceHeader", lang)} | ${t("cookie.cookiesHeader", lang)} | ${t("cookie.purposeHeader", lang)} | ${t("cookie.durationHeader", lang)} |
|---------|---------|---------|----------|`;

    for (const service of analyticsServices) {
      const info = getCookieInfo(service.name);
      doc += `\n| ${service.name} | ${info.cookies} | ${info.purpose} | ${info.duration} |`;
    }

    doc += `

> ${t("cookie.consentRequired", lang)}`;
  }

  doc += `

## ${nextSection()}. ${t("cookie.managingCookies", lang)}

${t("cookie.managingIntro", lang)}

- ${t("cookie.manage1", lang)}
- ${t("cookie.manage2", lang)}
- ${t("cookie.manage3", lang)}
`;

  for (const service of analyticsServices) {
    const optOut = getOptOutUrl(service.name);
    if (optOut) {
      doc += `  - **${service.name}:** [Opt out](${optOut})\n`;
    }
  }

  doc += `
## ${nextSection()}. ${t("cookie.thirdPartyCookies", lang)}

${t("cookie.thirdPartyIntro", lang)}

`;

  for (const service of [...analyticsServices, ...authServices]) {
    doc += `- **${service.name}**: ${t("common.usedFor", lang)} ${service.dataCollected.slice(0, 3).join(", ")}\n`;
  }

  doc += `
${t("cookie.thirdPartyNote", lang)}

## ${nextSection()}. ${t("cookie.gpc", lang)}

${t("cookie.gpcText1", lang)}
- ${t("cookie.gpc1", lang)}
- ${t("cookie.gpc2", lang)}
- ${t("cookie.gpc3", lang)}

${t("cookie.gpcLearnMore", lang)}

## ${nextSection()}. ${t("cookie.updates", lang)}

${t("cookie.updatesText", lang)}

## ${nextSection()}. ${t("cookie.contact", lang)}

${t("cookie.contactText", lang)}

- **${t("common.email", lang)}** ${email}

---

*${t("cookie.footer", lang)}*`;

  return doc;
}

function getCookieInfo(serviceName: string): {
  cookies: string;
  purpose: string;
  duration: string;
} {
  const info: Record<
    string,
    { cookies: string; purpose: string; duration: string }
  > = {
    "@google-analytics/data": {
      cookies: "_ga, _ga_*, _gid",
      purpose: "Page views, user behavior tracking",
      duration: "Up to 2 years",
    },
    posthog: {
      cookies: "ph_*, distinct_id",
      purpose: "Product analytics, session recording",
      duration: "1 year",
    },
    mixpanel: {
      cookies: "mp_*",
      purpose: "User behavior analytics",
      duration: "1 year",
    },
    "@amplitude/analytics-browser": {
      cookies: "amp_*",
      purpose: "Product analytics",
      duration: "10 years",
    },
    "@vercel/analytics": {
      cookies: "va_*",
      purpose: "Page view analytics",
      duration: "Session",
    },
    hotjar: {
      cookies: "_hj*",
      purpose: "Heatmaps, session recordings",
      duration: "1 year",
    },
  };

  return (
    info[serviceName] || {
      cookies: "Various",
      purpose: "Service functionality",
      duration: "Varies",
    }
  );
}

function getOptOutUrl(serviceName: string): string | null {
  const urls: Record<string, string> = {
    "@google-analytics/data": "https://tools.google.com/dlpage/gaoptout",
    mixpanel: "https://mixpanel.com/optout",
    hotjar: "https://www.hotjar.com/privacy/do-not-track/",
  };
  return urls[serviceName] || null;
}
