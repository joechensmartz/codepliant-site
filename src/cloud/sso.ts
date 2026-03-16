/**
 * SSO Configuration Stub
 *
 * Enterprise SSO integration point for SAML/OIDC providers.
 * Currently a stub — logs "coming soon" for `codepliant auth login`.
 * Structure is in place for future SAML/OIDC integration.
 */

// ── SSO Configuration ────────────────────────────────────────────────

export interface SSOConfig {
  /** SSO provider name (e.g., "okta", "azure-ad", "auth0", "google-workspace") */
  ssoProvider: string;
  /** OAuth2/OIDC client ID issued by the SSO provider */
  ssoClientId: string;
  /** SSO domain (e.g., "mycompany.okta.com", "login.microsoftonline.com/tenant-id") */
  ssoDomain: string;
}

/** Supported SSO protocols for future implementation. */
export type SSOProtocol = "saml" | "oidc";

/** Shape of a future SSO session token. */
export interface SSOSession {
  accessToken: string;
  expiresAt: number;
  email: string;
  provider: string;
}

// ── Defaults & Validation ────────────────────────────────────────────

const KNOWN_PROVIDERS = ["okta", "azure-ad", "auth0", "google-workspace", "onelogin", "ping-identity"] as const;
export type KnownSSOProvider = (typeof KNOWN_PROVIDERS)[number];

export function isKnownProvider(provider: string): provider is KnownSSOProvider {
  return (KNOWN_PROVIDERS as readonly string[]).includes(provider);
}

export function validateSSOConfig(config: Partial<SSOConfig>): string[] {
  const errors: string[] = [];

  if (!config.ssoProvider || config.ssoProvider.trim().length === 0) {
    errors.push("ssoProvider is required (e.g., \"okta\", \"azure-ad\", \"auth0\")");
  }

  if (!config.ssoClientId || config.ssoClientId.trim().length === 0) {
    errors.push("ssoClientId is required — obtain this from your SSO provider");
  }

  if (!config.ssoDomain || config.ssoDomain.trim().length === 0) {
    errors.push("ssoDomain is required (e.g., \"mycompany.okta.com\")");
  }

  return errors;
}

// ── CLI Command Handler ──────────────────────────────────────────────

/**
 * Handle `codepliant auth login`.
 * Currently displays "Enterprise SSO coming soon" with setup guidance.
 */
export function handleAuthLogin(_config?: Partial<SSOConfig>): void {
  console.log("");
  console.log("  Enterprise SSO coming soon");
  console.log("");
  console.log("  Codepliant will support SAML and OIDC single sign-on for");
  console.log("  enterprise teams. When available, configure SSO in your");
  console.log("  .codepliantrc.json:");
  console.log("");
  console.log("    {");
  console.log("      \"sso\": {");
  console.log("        \"ssoProvider\": \"okta\",");
  console.log("        \"ssoClientId\": \"your-client-id\",");
  console.log("        \"ssoDomain\": \"mycompany.okta.com\"");
  console.log("      }");
  console.log("    }");
  console.log("");
  console.log("  Supported providers (planned):");
  for (const p of KNOWN_PROVIDERS) {
    console.log(`    - ${p}`);
  }
  console.log("");
}
