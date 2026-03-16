import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Cookie category for CMP integration.
 */
interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  default_state: "enabled" | "disabled";
}

/**
 * Individual cookie/provider configuration.
 */
interface CookieProvider {
  name: string;
  category_id: string;
  provider: string;
  purpose: string;
  cookies: string[];
  duration: string;
  privacy_policy_url: string;
}

/**
 * Full cookie consent configuration for CMP integration.
 */
interface CookieConsentConfig {
  version: string;
  generated_at: string;
  project: string;
  company: string;
  consent_settings: {
    require_explicit_consent: boolean;
    show_on_first_visit: boolean;
    respect_dnt: boolean;
    cookie_name: string;
    cookie_duration_days: number;
    position: string;
  };
  categories: CookieCategory[];
  providers: CookieProvider[];
  cmp_integration: {
    onetrust: { category_mapping: Record<string, string> };
    cookieyes: { category_mapping: Record<string, string> };
    cookiebot: { category_mapping: Record<string, string> };
  };
}

/**
 * Known cookie/provider details for automatic configuration.
 */
const PROVIDER_MAP: Record<
  string,
  {
    category_id: string;
    provider: string;
    purpose: string;
    cookies: string[];
    duration: string;
    privacy_policy_url: string;
  }
> = {
  "Google Analytics": {
    category_id: "analytics",
    provider: "Google LLC",
    purpose: "Website traffic analysis and user behavior tracking",
    cookies: ["_ga", "_ga_*", "_gid", "_gat"],
    duration: "Up to 2 years",
    privacy_policy_url: "https://policies.google.com/privacy",
  },
  "@google-analytics/data": {
    category_id: "analytics",
    provider: "Google LLC",
    purpose: "Server-side analytics data collection",
    cookies: ["_ga", "_ga_*", "_gid"],
    duration: "Up to 2 years",
    privacy_policy_url: "https://policies.google.com/privacy",
  },
  posthog: {
    category_id: "analytics",
    provider: "PostHog Inc",
    purpose: "Product analytics, session recording, and feature flags",
    cookies: ["ph_*", "distinct_id"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://posthog.com/privacy",
  },
  mixpanel: {
    category_id: "analytics",
    provider: "Mixpanel Inc",
    purpose: "Product analytics and event tracking",
    cookies: ["mp_*", "mp_optout"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://mixpanel.com/legal/privacy-policy",
  },
  "@amplitude/analytics-browser": {
    category_id: "analytics",
    provider: "Amplitude Inc",
    purpose: "Product analytics and user behavior analysis",
    cookies: ["amp_*", "AMP_*"],
    duration: "Up to 10 years",
    privacy_policy_url: "https://amplitude.com/privacy",
  },
  "@vercel/analytics": {
    category_id: "analytics",
    provider: "Vercel Inc",
    purpose: "Anonymous page view and web vitals collection",
    cookies: ["va_*"],
    duration: "Session",
    privacy_policy_url: "https://vercel.com/legal/privacy-policy",
  },
  hotjar: {
    category_id: "analytics",
    provider: "Hotjar Ltd",
    purpose: "Session recording, heatmaps, and user feedback",
    cookies: ["_hj*", "_hjSessionUser_*", "_hjSession_*"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://www.hotjar.com/privacy/",
  },
  "Microsoft Clarity": {
    category_id: "analytics",
    provider: "Microsoft Corporation",
    purpose: "Session replay and heatmap analytics",
    cookies: ["_clck", "_clsk", "CLID"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://privacy.microsoft.com/privacystatement",
  },
  "Meta Pixel": {
    category_id: "advertising",
    provider: "Meta Platforms Inc",
    purpose: "Ad conversion tracking and audience targeting",
    cookies: ["_fbp", "_fbc", "fr"],
    duration: "Up to 3 months",
    privacy_policy_url: "https://www.facebook.com/privacy/policy/",
  },
  "Google Ads": {
    category_id: "advertising",
    provider: "Google LLC",
    purpose: "Ad conversion tracking and remarketing",
    cookies: ["_gcl_*", "IDE", "NID"],
    duration: "Up to 2 years",
    privacy_policy_url: "https://policies.google.com/privacy",
  },
  "@sentry/browser": {
    category_id: "functional",
    provider: "Sentry (Functional Software Inc)",
    purpose: "Error tracking and performance monitoring",
    cookies: ["sentry-sc"],
    duration: "Session",
    privacy_policy_url: "https://sentry.io/privacy/",
  },
  "@sentry/node": {
    category_id: "functional",
    provider: "Sentry (Functional Software Inc)",
    purpose: "Server-side error tracking",
    cookies: [],
    duration: "N/A",
    privacy_policy_url: "https://sentry.io/privacy/",
  },
  Intercom: {
    category_id: "functional",
    provider: "Intercom Inc",
    purpose: "Customer support chat and messaging",
    cookies: ["intercom-*"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://www.intercom.com/legal/privacy",
  },
  crisp: {
    category_id: "functional",
    provider: "Crisp IM SAS",
    purpose: "Live chat and customer support",
    cookies: ["crisp-client/*"],
    duration: "Up to 6 months",
    privacy_policy_url: "https://crisp.chat/en/privacy/",
  },
  stripe: {
    category_id: "strictly_necessary",
    provider: "Stripe Inc",
    purpose: "Payment processing (required for transactions)",
    cookies: ["__stripe_mid", "__stripe_sid"],
    duration: "Up to 1 year",
    privacy_policy_url: "https://stripe.com/privacy",
  },
};

/**
 * Generate a machine-readable COOKIE_CONSENT_CONFIG.json
 * for CMP integration (OneTrust, CookieYes, Cookiebot, etc.).
 */
export function generateCookieConsentConfig(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const authServices = scan.services.filter((s) => s.category === "auth");

  // Only generate if there are services that use cookies
  if (analyticsServices.length === 0 && authServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString();

  // Build categories
  const categories: CookieCategory[] = [
    {
      id: "strictly_necessary",
      name: "Strictly Necessary",
      description:
        "Essential cookies required for the website to function. These cannot be disabled.",
      required: true,
      default_state: "enabled",
    },
    {
      id: "functional",
      name: "Functional",
      description:
        "Cookies that enable enhanced functionality like live chat, error tracking, and personalization.",
      required: false,
      default_state: "disabled",
    },
    {
      id: "analytics",
      name: "Analytics",
      description:
        "Cookies that help us understand how visitors interact with our website by collecting anonymous usage data.",
      required: false,
      default_state: "disabled",
    },
    {
      id: "advertising",
      name: "Advertising",
      description:
        "Cookies used to deliver relevant advertisements and track ad campaign performance.",
      required: false,
      default_state: "disabled",
    },
  ];

  // Build providers from detected services
  const providers: CookieProvider[] = [];
  for (const service of scan.services) {
    const mapped = PROVIDER_MAP[service.name];
    if (mapped) {
      providers.push({
        name: service.name,
        category_id: mapped.category_id,
        provider: mapped.provider,
        purpose: mapped.purpose,
        cookies: mapped.cookies,
        duration: mapped.duration,
        privacy_policy_url: mapped.privacy_policy_url,
      });
    }
  }

  // Add auth services as strictly necessary
  for (const service of authServices) {
    if (!providers.some((p) => p.name === service.name)) {
      providers.push({
        name: service.name,
        category_id: "strictly_necessary",
        provider: service.name,
        purpose: "Authentication and session management",
        cookies: [`${service.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_session`],
        duration: "Session",
        privacy_policy_url: "",
      });
    }
  }

  const config: CookieConsentConfig = {
    version: "1.0.0",
    generated_at: date,
    project: scan.projectName,
    company,
    consent_settings: {
      require_explicit_consent: true,
      show_on_first_visit: true,
      respect_dnt: true,
      cookie_name: "cookie_consent",
      cookie_duration_days: 365,
      position: "bottom",
    },
    categories,
    providers,
    cmp_integration: {
      onetrust: {
        category_mapping: {
          strictly_necessary: "C0001",
          functional: "C0003",
          analytics: "C0002",
          advertising: "C0004",
        },
      },
      cookieyes: {
        category_mapping: {
          strictly_necessary: "necessary",
          functional: "functional",
          analytics: "analytics",
          advertising: "advertisement",
        },
      },
      cookiebot: {
        category_mapping: {
          strictly_necessary: "necessary",
          functional: "preferences",
          analytics: "statistics",
          advertising: "marketing",
        },
      },
    },
  };

  return JSON.stringify(config, null, 2) + "\n";
}
