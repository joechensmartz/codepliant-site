import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates API_TERMS_OF_USE.md — rate limits, authentication, usage restrictions,
 * and SLA for API consumers. Generated when API routes are detected in the project.
 */
export function generateApiTermsOfUse(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  // Check for API routes via data categories or common API framework indicators
  const apiCategory = scan.dataCategories.find((c) => c.category === "API Data Collection");
  const hasApiFramework = scan.services.some((s) =>
    ["express", "fastify", "hono", "nestjs", "koa", "fastapi", "django-rest-framework", "rails"].includes(
      s.name.toLowerCase(),
    ),
  );
  const hasApiEvidence = scan.services.some((s) =>
    s.evidence.some(
      (e) =>
        e.detail.toLowerCase().includes("api") ||
        e.detail.toLowerCase().includes("router") ||
        e.detail.toLowerCase().includes("endpoint"),
    ),
  );

  // Also check for API route directories
  const hasApiDir = [
    "src/api",
    "src/routes",
    "app/api",
    "pages/api",
    "api",
    "routes",
  ].some((dir) => {
    try {
      return fs.statSync(path.join(scan.projectPath, dir)).isDirectory();
    } catch {
      return false;
    }
  });

  if (!apiCategory && !hasApiFramework && !hasApiEvidence && !hasApiDir) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const jurisdiction = ctx?.jurisdiction || "[Your Jurisdiction]";
  const date = new Date().toISOString().split("T")[0];

  const authServices = scan.services.filter((s) => s.category === "auth");
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  const sections: string[] = [];

  sections.push(`# API Terms of Use`);
  sections.push(``);
  sections.push(`**Effective Date:** ${date}`);
  sections.push(`**Last Updated:** ${date}`);
  sections.push(``);
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(``);
  sections.push(`---`);
  sections.push(``);

  // 1. Acceptance
  sections.push(`## ${nextSection()}. Acceptance of Terms`);
  sections.push(``);
  sections.push(
    `By accessing or using the ${company} API ("API"), you agree to be bound by these ` +
    `API Terms of Use ("Terms"). If you are using the API on behalf of an organization, ` +
    `you represent that you have authority to bind that organization to these Terms.`,
  );
  sections.push(``);
  sections.push(
    `These Terms supplement and are in addition to our [Terms of Service](./TERMS_OF_SERVICE.md) ` +
    `and [Privacy Policy](./PRIVACY_POLICY.md). In case of conflict, these API-specific terms prevail ` +
    `for API usage.`,
  );
  sections.push(``);

  // 2. API Access & Authentication
  sections.push(`## ${nextSection()}. API Access & Authentication`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 API Keys`);
  sections.push(``);
  sections.push(`- You must register for an API key to access the API`);
  sections.push(`- API keys are confidential and must not be shared or published`);
  sections.push(`- You are responsible for all activity under your API key`);
  sections.push(`- ${company} may revoke keys that are compromised or misused`);
  sections.push(``);

  if (authServices.length > 0) {
    sections.push(`### ${sectionNum}.2 Authentication Methods`);
    sections.push(``);
    sections.push(`The API supports the following authentication methods:`);
    sections.push(``);
    for (const svc of authServices) {
      sections.push(`- **${svc.name}** — integrated authentication provider`);
    }
    sections.push(`- **Bearer Token** — include \`Authorization: Bearer <token>\` in request headers`);
    sections.push(`- **API Key** — include \`X-API-Key: <key>\` in request headers`);
    sections.push(``);
  }

  // 3. Rate Limits
  sections.push(`## ${nextSection()}. Rate Limits`);
  sections.push(``);
  sections.push(`To ensure fair usage and system stability, the following rate limits apply:`);
  sections.push(``);
  sections.push(`| Tier | Requests/minute | Requests/hour | Requests/day | Burst |`);
  sections.push(`|------|----------------|--------------|-------------|-------|`);
  sections.push(`| Free | 60 | 1,000 | 10,000 | 10/sec |`);
  sections.push(`| Standard | 300 | 10,000 | 100,000 | 50/sec |`);
  sections.push(`| Enterprise | Custom | Custom | Custom | Custom |`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 Rate Limit Headers`);
  sections.push(``);
  sections.push(`All API responses include the following headers:`);
  sections.push(``);
  sections.push("```");
  sections.push(`X-RateLimit-Limit: <max requests per window>`);
  sections.push(`X-RateLimit-Remaining: <remaining requests in window>`);
  sections.push(`X-RateLimit-Reset: <UTC epoch timestamp when window resets>`);
  sections.push(`Retry-After: <seconds to wait (only on 429 responses)>`);
  sections.push("```");
  sections.push(``);
  sections.push(`### ${sectionNum}.2 Exceeding Limits`);
  sections.push(``);
  sections.push(
    `When you exceed rate limits, the API returns HTTP 429 (Too Many Requests). ` +
    `Implement exponential backoff in your integration. Persistent abuse may result ` +
    `in temporary or permanent API access revocation.`,
  );
  sections.push(``);

  // 4. Usage Restrictions
  sections.push(`## ${nextSection()}. Usage Restrictions`);
  sections.push(``);
  sections.push(`You agree NOT to:`);
  sections.push(``);
  sections.push(`- Use the API for any unlawful purpose or in violation of applicable laws`);
  sections.push(`- Reverse-engineer, decompile, or disassemble the API`);
  sections.push(`- Attempt to circumvent rate limits, authentication, or security measures`);
  sections.push(`- Use the API to build a competing product or service`);
  sections.push(`- Redistribute API data to third parties without authorization`);
  sections.push(`- Use automated tools to scrape or bulk-download data beyond API-provided means`);
  sections.push(`- Transmit malware, viruses, or harmful code through the API`);
  sections.push(`- Impersonate other users or misrepresent your identity`);
  sections.push(``);

  if (aiServices.length > 0) {
    sections.push(`### ${sectionNum}.1 AI-Specific Restrictions`);
    sections.push(``);
    sections.push(`The API integrates AI services (${aiServices.map((s) => s.name).join(", ")}). Additional restrictions apply:`);
    sections.push(``);
    sections.push(`- Do not use AI-generated outputs to create misleading or deceptive content`);
    sections.push(`- AI outputs must not be presented as human-generated without disclosure`);
    sections.push(`- You must comply with the AI providers' acceptable use policies`);
    sections.push(`- ${company} does not guarantee the accuracy of AI-generated content`);
    sections.push(``);
  }

  // 5. Data Handling
  sections.push(`## ${nextSection()}. Data Handling`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 Data You Send`);
  sections.push(``);
  sections.push(
    `You are responsible for ensuring you have the right to transmit any data ` +
    `sent through the API. Do not transmit personal data unless the API endpoint ` +
    `is specifically designed to process it.`,
  );
  sections.push(``);
  sections.push(`### ${sectionNum}.2 Data You Receive`);
  sections.push(``);
  sections.push(
    `API responses may contain data subject to our Privacy Policy. You must handle ` +
    `received data in accordance with applicable data protection laws, including ` +
    `GDPR, CCPA, and other relevant regulations.`,
  );
  sections.push(``);

  if (paymentServices.length > 0) {
    sections.push(`### ${sectionNum}.3 Payment Data`);
    sections.push(``);
    sections.push(
      `Payment-related API endpoints process sensitive financial data through ` +
      `${paymentServices.map((s) => s.name).join(", ")}. You must comply with PCI DSS requirements ` +
      `and never store raw card data on your servers.`,
    );
    sections.push(``);
  }

  // 6. SLA
  sections.push(`## ${nextSection()}. Service Level Agreement`);
  sections.push(``);
  sections.push(`### ${sectionNum}.1 Availability`);
  sections.push(``);
  sections.push(`| Metric | Target |`);
  sections.push(`|--------|--------|`);
  sections.push(`| Monthly Uptime | 99.9% |`);
  sections.push(`| API Response Time (p95) | < 500ms |`);
  sections.push(`| API Response Time (p99) | < 2,000ms |`);
  sections.push(`| Planned Maintenance Window | Sundays 02:00-06:00 UTC |`);
  sections.push(``);

  sections.push(`### ${sectionNum}.2 Incident Response`);
  sections.push(``);
  sections.push(`| Severity | Response Time | Resolution Target |`);
  sections.push(`|----------|--------------|-------------------|`);
  sections.push(`| P0 — Total outage | 15 minutes | 4 hours |`);
  sections.push(`| P1 — Major degradation | 30 minutes | 8 hours |`);
  sections.push(`| P2 — Minor degradation | 2 hours | 24 hours |`);
  sections.push(`| P3 — Non-critical issue | 8 hours | 72 hours |`);
  sections.push(``);

  if (monitoringServices.length > 0) {
    sections.push(`### ${sectionNum}.3 Monitoring`);
    sections.push(``);
    sections.push(
      `API health and performance are monitored via ${monitoringServices.map((s) => s.name).join(", ")}. ` +
      `Status updates are provided at our status page during incidents.`,
    );
    sections.push(``);
  }

  sections.push(`### ${sectionNum}.${monitoringServices.length > 0 ? "4" : "3"} Exclusions`);
  sections.push(``);
  sections.push(`SLA does not apply during:`);
  sections.push(``);
  sections.push(`- Scheduled maintenance windows`);
  sections.push(`- Force majeure events`);
  sections.push(`- Issues caused by your integration or network`);
  sections.push(`- Abuse or violation of these Terms`);
  sections.push(``);

  // 7. Versioning
  sections.push(`## ${nextSection()}. API Versioning & Deprecation`);
  sections.push(``);
  sections.push(`- The API is versioned (e.g., \`/v1/\`, \`/v2/\`)`);
  sections.push(`- We provide **12 months** notice before deprecating an API version`);
  sections.push(`- Breaking changes are only introduced in new major versions`);
  sections.push(`- Deprecated endpoints return a \`Sunset\` header with the retirement date`);
  sections.push(`- Migration guides are provided for major version upgrades`);
  sections.push(``);

  // 8. Intellectual Property
  sections.push(`## ${nextSection()}. Intellectual Property`);
  sections.push(``);
  sections.push(
    `The API, its documentation, and all associated intellectual property are owned ` +
    `by ${company}. These Terms grant you a limited, non-exclusive, non-transferable, ` +
    `revocable license to use the API in accordance with these Terms.`,
  );
  sections.push(``);
  sections.push(
    `You retain ownership of applications you build using the API. ${company} does not ` +
    `claim any rights to your application code.`,
  );
  sections.push(``);

  // 9. Liability
  sections.push(`## ${nextSection()}. Limitation of Liability`);
  sections.push(``);
  sections.push(
    `THE API IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. ${company.toUpperCase()} ` +
    `SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE ` +
    `DAMAGES ARISING FROM YOUR USE OF THE API.`,
  );
  sections.push(``);
  sections.push(
    `In no event shall ${company}'s total liability exceed the fees paid by you for API ` +
    `access in the twelve (12) months preceding the claim.`,
  );
  sections.push(``);

  // 10. Termination
  sections.push(`## ${nextSection()}. Termination`);
  sections.push(``);
  sections.push(
    `Either party may terminate API access at any time. ${company} may immediately ` +
    `suspend or revoke your API access if you violate these Terms. Upon termination:`
  );
  sections.push(``);
  sections.push(`- You must cease all API usage`);
  sections.push(`- You must delete any cached API data (unless retention is legally required)`);
  sections.push(`- Provisions regarding liability, IP, and dispute resolution survive termination`);
  sections.push(``);

  // 11. Changes
  sections.push(`## ${nextSection()}. Changes to These Terms`);
  sections.push(``);
  sections.push(
    `We may update these Terms from time to time. Material changes will be communicated ` +
    `with at least 30 days notice via email or API response headers. Continued use of the ` +
    `API after changes take effect constitutes acceptance.`,
  );
  sections.push(``);

  // 12. Contact
  sections.push(`## ${nextSection()}. Contact`);
  sections.push(``);
  sections.push(`For questions about these API Terms of Use:`);
  sections.push(``);
  sections.push(`- **Email:** ${contactEmail}`);
  sections.push(`- **Website:** ${website}`);
  sections.push(``);

  // Footer
  sections.push(`---`);
  sections.push(``);
  sections.push(
    `*Generated by Codepliant from project analysis. This document should be reviewed ` +
    `by legal counsel before publishing.*`,
  );
  sections.push(``);

  return sections.join("\n");
}
