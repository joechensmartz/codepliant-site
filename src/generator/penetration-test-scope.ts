import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a PENTEST_SCOPE.md document recommending penetration testing
 * scope based on detected security-relevant services, API endpoints,
 * auth flows, and third-party integrations.
 *
 * Only generated when security-relevant services are detected (auth, payment,
 * AI, or 3+ services of any kind).
 */

const SECURITY_CATEGORIES = new Set(["auth", "payment", "ai", "monitoring"]);

export function generatePenetrationTestScope(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const hasSecurityServices = scan.services.some((s) => SECURITY_CATEGORIES.has(s.category));
  const hasEnoughServices = scan.services.filter((s) => s.isDataProcessor !== false).length >= 3;

  if (!hasSecurityServices && !hasEnoughServices) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const website = ctx?.website || "[https://yoursite.com]";
  const securityEmail = ctx?.securityEmail || ctx?.contactEmail || "[security@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  const authServices = scan.services.filter((s) => s.category === "auth");
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const storageServices = scan.services.filter((s) => s.category === "storage");
  const thirdPartyServices = scan.services.filter(
    (s) => s.isDataProcessor !== false && s.category !== "database"
  );

  const sections: string[] = [];

  // --- Header ---
  sections.push("# Penetration Test Scope");
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Application URL:** ${website}`);
  sections.push(`**Security contact:** ${securityEmail}`);
  sections.push("");
  sections.push(
    "This document defines the recommended scope for penetration testing based on the services, " +
      "API endpoints, authentication flows, and third-party integrations detected in the codebase. " +
      "It should be provided to the penetration testing team as a starting point for engagement scoping."
  );

  // --- Executive Summary ---
  sections.push("");
  sections.push("## 1. Executive Summary");
  sections.push("");
  sections.push(`The ${company} application uses ${scan.services.length} detected service(s) spanning the following categories:`);
  sections.push("");

  const categoryCounts = new Map<string, number>();
  for (const svc of scan.services) {
    categoryCounts.set(svc.category, (categoryCounts.get(svc.category) || 0) + 1);
  }
  for (const [cat, count] of categoryCounts) {
    sections.push(`- **${cat}**: ${count} service(s)`);
  }

  // Risk assessment summary
  sections.push("");
  sections.push("### Risk Level Assessment");
  sections.push("");

  const riskFactors: string[] = [];
  if (hasPayment) riskFactors.push("Payment processing (PCI DSS scope)");
  if (hasAuth) riskFactors.push("User authentication and session management");
  if (hasAI) riskFactors.push("AI/ML services processing user data");
  if (hasStorage) riskFactors.push("File upload and cloud storage");
  if (thirdPartyServices.length >= 5) riskFactors.push(`${thirdPartyServices.length} third-party integrations`);

  if (riskFactors.length > 0) {
    sections.push("Key risk factors identified:");
    sections.push("");
    for (const factor of riskFactors) {
      sections.push(`- ${factor}`);
    }
  }

  // --- Recommended Scope ---
  sections.push("");
  sections.push("## 2. Recommended Test Scope");
  sections.push("");

  // 2.1 Web Application Testing
  sections.push("### 2.1 Web Application Testing");
  sections.push("");
  sections.push("| Test Area | Priority | Description |");
  sections.push("| --- | --- | --- |");
  sections.push("| OWASP Top 10 | Critical | Full coverage of current OWASP Top 10 vulnerabilities |");
  sections.push("| Input validation | High | SQL injection, XSS, SSRF, command injection |");
  sections.push("| Business logic | High | Application-specific logic flaws and abuse scenarios |");
  sections.push("| Error handling | Medium | Information disclosure through error messages |");
  sections.push("| HTTP security headers | Medium | CSP, HSTS, X-Frame-Options, etc. |");
  sections.push("| Rate limiting | Medium | API abuse and brute-force protection |");

  // 2.2 Authentication Testing
  if (hasAuth) {
    sections.push("");
    sections.push("### 2.2 Authentication & Session Management");
    sections.push("");
    sections.push("Detected authentication services:");
    sections.push("");
    for (const svc of authServices) {
      sections.push(`- **${svc.name}** — data: ${svc.dataCollected.join(", ")}`);
    }
    sections.push("");
    sections.push("| Test Area | Priority | Description |");
    sections.push("| --- | --- | --- |");
    sections.push("| Login brute-force | Critical | Account lockout and rate limiting |");
    sections.push("| Session management | Critical | Token generation, expiration, rotation |");
    sections.push("| Password policy | High | Complexity requirements, breach database checks |");
    sections.push("| OAuth flow | High | Authorization code interception, CSRF, redirect URI validation |");
    sections.push("| Session fixation | High | Session ID regeneration after authentication |");
    sections.push("| Account enumeration | Medium | Timing attacks on login/registration |");
    sections.push("| MFA bypass | High | Multi-factor authentication bypass techniques |");
    sections.push("| Privilege escalation | Critical | Horizontal and vertical privilege escalation |");

    // Specific auth flow tests
    sections.push("");
    sections.push("**Auth flows to verify:**");
    sections.push("");
    sections.push("- [ ] User registration and email verification");
    sections.push("- [ ] Login with credentials (email/password)");
    sections.push("- [ ] OAuth/social login flows");
    sections.push("- [ ] Password reset / forgot password");
    sections.push("- [ ] Session logout and token invalidation");
    sections.push("- [ ] Account deletion and data cleanup");
    sections.push("- [ ] Role-based access control enforcement");

    if (authServices.some((s) => s.name.includes("clerk") || s.name.includes("supabase"))) {
      sections.push("- [ ] Third-party auth provider webhook validation");
      sections.push("- [ ] JWT token validation and signature verification");
    }
  }

  // 2.3 API Endpoint Testing
  sections.push("");
  sections.push(`### ${hasAuth ? "2.3" : "2.2"} API Endpoint Testing`);
  sections.push("");
  sections.push("| Test Area | Priority | Description |");
  sections.push("| --- | --- | --- |");
  sections.push("| Authentication bypass | Critical | Access to endpoints without valid credentials |");
  sections.push("| Authorization (IDOR) | Critical | Insecure direct object references |");
  sections.push("| Mass assignment | High | Unintended parameter binding |");
  sections.push("| API rate limiting | Medium | DoS prevention through rate limits |");
  sections.push("| Input validation | High | Type coercion, boundary values, malformed requests |");
  sections.push("| Response data leakage | Medium | Sensitive data in API responses |");
  sections.push("| CORS configuration | Medium | Cross-origin request policy validation |");
  sections.push("| GraphQL-specific | Medium | Introspection, batching attacks, depth limiting |");

  sections.push("");
  sections.push("**API endpoints to test:**");
  sections.push("");
  sections.push("- [ ] All user-facing REST endpoints");
  sections.push("- [ ] GraphQL endpoints (if applicable)");
  sections.push("- [ ] Webhook receiver endpoints");
  sections.push("- [ ] File upload endpoints");
  sections.push("- [ ] Search/filter endpoints (injection testing)");
  sections.push("- [ ] Admin/internal API endpoints");

  // 2.4 Payment Testing
  if (hasPayment) {
    sections.push("");
    sections.push("### Payment Security Testing");
    sections.push("");
    sections.push("Detected payment services:");
    sections.push("");
    for (const svc of paymentServices) {
      sections.push(`- **${svc.name}** — data: ${svc.dataCollected.join(", ")}`);
    }
    sections.push("");
    sections.push("| Test Area | Priority | Description |");
    sections.push("| --- | --- | --- |");
    sections.push("| Price manipulation | Critical | Client-side price/quantity tampering |");
    sections.push("| Payment flow bypass | Critical | Order completion without payment |");
    sections.push("| Webhook validation | Critical | Payment webhook signature verification |");
    sections.push("| Refund abuse | High | Unauthorized refund initiation |");
    sections.push("| PCI data exposure | Critical | Card data in logs, URLs, or responses |");
    sections.push("| Race conditions | High | Double-spending or concurrent transaction abuse |");
  }

  // 2.5 AI/ML Testing
  if (hasAI) {
    sections.push("");
    sections.push("### AI/ML Security Testing");
    sections.push("");
    sections.push("Detected AI services:");
    sections.push("");
    for (const svc of aiServices) {
      sections.push(`- **${svc.name}** — data: ${svc.dataCollected.join(", ")}`);
    }
    sections.push("");
    sections.push("| Test Area | Priority | Description |");
    sections.push("| --- | --- | --- |");
    sections.push("| Prompt injection | Critical | Direct and indirect prompt injection attacks |");
    sections.push("| Data exfiltration | High | Extracting training data or system prompts |");
    sections.push("| Output manipulation | High | Causing harmful or unintended AI outputs |");
    sections.push("| Token/cost abuse | Medium | Excessive API consumption attacks |");
    sections.push("| Content filtering bypass | High | Bypassing safety filters |");
    sections.push("| PII in prompts | High | Personal data exposure through AI interactions |");
  }

  // 2.6 File Upload & Storage
  if (hasStorage) {
    sections.push("");
    sections.push("### File Upload & Storage Testing");
    sections.push("");
    sections.push("Detected storage services:");
    sections.push("");
    for (const svc of storageServices) {
      sections.push(`- **${svc.name}** — data: ${svc.dataCollected.join(", ")}`);
    }
    sections.push("");
    sections.push("| Test Area | Priority | Description |");
    sections.push("| --- | --- | --- |");
    sections.push("| Malicious file upload | Critical | Executable files, web shells, polyglots |");
    sections.push("| File type validation | High | MIME type / magic bytes validation |");
    sections.push("| Path traversal | Critical | Directory traversal in file operations |");
    sections.push("| Access controls | High | Unauthorized access to stored files |");
    sections.push("| Storage bucket config | High | Public access, listing permissions |");
    sections.push("| File size limits | Medium | DoS through large file uploads |");
  }

  // --- Third-Party Integrations ---
  if (thirdPartyServices.length > 0) {
    sections.push("");
    sections.push("## 3. Third-Party Integration Assessment");
    sections.push("");
    sections.push(
      "The following third-party services should be assessed for secure integration:"
    );
    sections.push("");
    sections.push("| Service | Category | Security Considerations |");
    sections.push("| --- | --- | --- |");

    for (const svc of thirdPartyServices) {
      const considerations = getSecurityConsiderations(svc);
      sections.push(`| ${svc.name} | ${svc.category} | ${considerations} |`);
    }

    sections.push("");
    sections.push("**For each integration, verify:**");
    sections.push("");
    sections.push("- [ ] API keys are not exposed in client-side code or version control");
    sections.push("- [ ] Webhook signatures are validated");
    sections.push("- [ ] Minimum required permissions/scopes are used");
    sections.push("- [ ] Error responses from third-party services are handled securely");
    sections.push("- [ ] Timeout and retry logic prevents cascading failures");
    sections.push("- [ ] TLS is enforced for all third-party API communications");
  }

  // --- Infrastructure ---
  sections.push("");
  sections.push("## 4. Infrastructure Testing");
  sections.push("");
  sections.push("| Test Area | Priority | Description |");
  sections.push("| --- | --- | --- |");
  sections.push("| TLS configuration | High | Certificate validity, cipher suites, protocol versions |");
  sections.push("| DNS security | Medium | DNSSEC, SPF, DKIM, DMARC records |");
  sections.push("| Cloud configuration | High | IAM policies, security groups, public exposure |");
  if (hasDatabase) {
    sections.push("| Database security | Critical | Network access controls, encryption, default credentials |");
  }
  if (hasMonitoring) {
    sections.push("| Monitoring exposure | Medium | Sensitive data in monitoring dashboards/alerts |");
  }

  // --- Out of Scope ---
  sections.push("");
  sections.push("## 5. Out of Scope");
  sections.push("");
  sections.push("The following are excluded from the penetration test unless explicitly agreed:");
  sections.push("");
  sections.push("- Denial of Service (DoS/DDoS) attacks against production infrastructure");
  sections.push("- Social engineering attacks against employees");
  sections.push("- Physical security assessments");
  sections.push("- Third-party service infrastructure (only the integration is in scope)");
  sections.push("- Automated vulnerability scanning without coordination");

  // --- Testing Methodology ---
  sections.push("");
  sections.push("## 6. Recommended Methodology");
  sections.push("");
  sections.push("- **Standard**: OWASP Testing Guide v4, PTES, NIST SP 800-115");
  sections.push("- **Classification**: CVSS v3.1 for vulnerability scoring");
  sections.push("- **Reporting**: Executive summary + detailed technical findings + remediation guidance");
  sections.push("- **Retesting**: Include retest of critical and high findings within 30 days of remediation");

  // --- Environment ---
  sections.push("");
  sections.push("## 7. Testing Environment");
  sections.push("");
  sections.push("| Parameter | Value |");
  sections.push("| --- | --- |");
  sections.push(`| Application URL | ${website} |`);
  sections.push("| Environment | Staging (recommended) |");
  sections.push("| Test accounts | To be provided before engagement |");
  sections.push("| VPN/IP allowlisting | To be coordinated |");
  sections.push(`| Security contact | ${securityEmail} |`);
  sections.push("| Emergency contact | To be provided before engagement |");

  // --- Deliverables ---
  sections.push("");
  sections.push("## 8. Expected Deliverables");
  sections.push("");
  sections.push("- [ ] Executive summary report suitable for leadership");
  sections.push("- [ ] Detailed technical report with proof-of-concept for each finding");
  sections.push("- [ ] CVSS-scored vulnerability list");
  sections.push("- [ ] Remediation recommendations with priority ranking");
  sections.push("- [ ] Raw evidence and screenshots");
  sections.push("- [ ] Retest report (after remediation)");

  // --- Disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    "*This document was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) " +
      "based on detected services and integrations. The scope should be reviewed and adjusted by " +
      "your security team before engaging a penetration testing provider. This document does not " +
      "constitute a complete security assessment.*"
  );

  return sections.join("\n");
}

function getSecurityConsiderations(svc: DetectedService): string {
  switch (svc.category) {
    case "auth":
      return "OAuth flow security, token validation, session management";
    case "payment":
      return "Webhook signature verification, PCI compliance, price integrity";
    case "ai":
      return "Prompt injection, data exfiltration, API key exposure";
    case "analytics":
      return "Data collection scope, cookie consent, script integrity";
    case "email":
      return "SPF/DKIM/DMARC, header injection, content injection";
    case "storage":
      return "Bucket permissions, file validation, access controls";
    case "monitoring":
      return "PII in error reports, dashboard access controls";
    case "advertising":
      return "Pixel data scope, consent enforcement";
    case "database":
      return "Connection security, access controls, query injection";
    default:
      return "API key management, data flow validation";
  }
}
