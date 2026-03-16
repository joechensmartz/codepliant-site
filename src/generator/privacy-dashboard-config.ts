import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Data category for the privacy dashboard.
 */
interface DashboardDataCategory {
  id: string;
  name: string;
  description: string;
  sources: string[];
  legal_basis: string;
  retention_period: string;
  user_can_delete: boolean;
  user_can_export: boolean;
}

/**
 * Consent option for user-facing consent management.
 */
interface ConsentOption {
  id: string;
  name: string;
  description: string;
  required: boolean;
  default_state: "opted_in" | "opted_out";
  category_ids: string[];
}

/**
 * API endpoint for data operations.
 */
interface DataEndpoint {
  action: string;
  method: string;
  path: string;
  description: string;
  requires_auth: boolean;
}

/**
 * Full privacy dashboard configuration.
 */
interface PrivacyDashboardConfig {
  version: string;
  generated_at: string;
  project: string;
  company: string;
  contact_email: string;
  dpo: {
    name: string;
    email: string;
  };
  dashboard_settings: {
    title: string;
    description: string;
    show_data_categories: boolean;
    show_consent_management: boolean;
    show_data_export: boolean;
    show_data_deletion: boolean;
    show_processing_history: boolean;
  };
  data_categories: DashboardDataCategory[];
  consent_options: ConsentOption[];
  data_endpoints: DataEndpoint[];
  rights: {
    id: string;
    name: string;
    description: string;
    regulation: string;
    endpoint: string;
  }[];
}

/**
 * Map service categories to data category info.
 */
const CATEGORY_MAP: Record<
  string,
  {
    id: string;
    name: string;
    description: string;
    legal_basis: string;
    retention_period: string;
    user_can_delete: boolean;
    user_can_export: boolean;
  }
> = {
  analytics: {
    id: "analytics",
    name: "Analytics Data",
    description: "Usage data collected to understand how you interact with our service, including page views, clicks, and session duration.",
    legal_basis: "Legitimate interest (Art. 6(1)(f) GDPR)",
    retention_period: "26 months",
    user_can_delete: true,
    user_can_export: true,
  },
  advertising: {
    id: "advertising",
    name: "Advertising Data",
    description: "Data used for targeted advertising and ad performance measurement, including ad interactions and conversion events.",
    legal_basis: "Consent (Art. 6(1)(a) GDPR)",
    retention_period: "12 months",
    user_can_delete: true,
    user_can_export: true,
  },
  auth: {
    id: "account",
    name: "Account Data",
    description: "Information you provide when creating and managing your account, including email address, name, and authentication credentials.",
    legal_basis: "Contract performance (Art. 6(1)(b) GDPR)",
    retention_period: "Duration of account + 30 days",
    user_can_delete: true,
    user_can_export: true,
  },
  payment: {
    id: "payment",
    name: "Payment Data",
    description: "Billing and transaction information processed for purchases, including payment method details (handled by our payment processor).",
    legal_basis: "Contract performance (Art. 6(1)(b) GDPR)",
    retention_period: "7 years (legal requirement)",
    user_can_delete: false,
    user_can_export: true,
  },
  email: {
    id: "communications",
    name: "Communication Data",
    description: "Email addresses and communication preferences used to send transactional and marketing messages.",
    legal_basis: "Consent / Legitimate interest",
    retention_period: "Until unsubscribe + 30 days",
    user_can_delete: true,
    user_can_export: true,
  },
  monitoring: {
    id: "technical",
    name: "Technical Data",
    description: "Error logs, performance metrics, and diagnostic data collected to maintain and improve service reliability.",
    legal_basis: "Legitimate interest (Art. 6(1)(f) GDPR)",
    retention_period: "90 days",
    user_can_delete: false,
    user_can_export: false,
  },
  ai: {
    id: "ai_interactions",
    name: "AI Interaction Data",
    description: "Inputs, outputs, and metadata from interactions with AI-powered features. May be used to improve model performance.",
    legal_basis: "Consent (Art. 6(1)(a) GDPR)",
    retention_period: "30 days (configurable)",
    user_can_delete: true,
    user_can_export: true,
  },
  storage: {
    id: "user_content",
    name: "User Content",
    description: "Files, documents, and media you upload or create within the service.",
    legal_basis: "Contract performance (Art. 6(1)(b) GDPR)",
    retention_period: "Duration of account + 30 days",
    user_can_delete: true,
    user_can_export: true,
  },
  database: {
    id: "stored_data",
    name: "Stored Data",
    description: "Structured data stored in databases as part of service operation.",
    legal_basis: "Contract performance (Art. 6(1)(b) GDPR)",
    retention_period: "Duration of account + 30 days",
    user_can_delete: true,
    user_can_export: true,
  },
};

/**
 * Generate a machine-readable PRIVACY_DASHBOARD_CONFIG.json
 * for building a user-facing "My Data" / privacy dashboard page.
 */
export function generatePrivacyDashboardConfig(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  // Only generate if there are services that process user data
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString();

  // Build data categories from detected services
  const seenCategories = new Set<string>();
  const dataCategories: DashboardDataCategory[] = [];

  for (const service of scan.services) {
    const mapped = CATEGORY_MAP[service.category];
    if (mapped && !seenCategories.has(mapped.id)) {
      seenCategories.add(mapped.id);
      const sources = scan.services
        .filter((s) => s.category === service.category)
        .map((s) => s.name);
      dataCategories.push({
        ...mapped,
        sources,
      });
    }
  }

  // Build consent options based on detected categories
  const consentOptions: ConsentOption[] = [];

  if (seenCategories.has("analytics")) {
    consentOptions.push({
      id: "analytics_consent",
      name: "Analytics",
      description: "Allow us to collect anonymous usage data to improve our service.",
      required: false,
      default_state: "opted_out",
      category_ids: ["analytics"],
    });
  }

  if (seenCategories.has("advertising")) {
    consentOptions.push({
      id: "advertising_consent",
      name: "Personalized Advertising",
      description: "Allow us to show you relevant ads based on your activity.",
      required: false,
      default_state: "opted_out",
      category_ids: ["advertising"],
    });
  }

  if (seenCategories.has("ai_interactions")) {
    consentOptions.push({
      id: "ai_training_consent",
      name: "AI Improvement",
      description: "Allow your interactions with AI features to be used for model improvement.",
      required: false,
      default_state: "opted_out",
      category_ids: ["ai_interactions"],
    });
  }

  if (seenCategories.has("communications")) {
    consentOptions.push({
      id: "marketing_consent",
      name: "Marketing Communications",
      description: "Receive product updates, tips, and promotional offers via email.",
      required: false,
      default_state: "opted_out",
      category_ids: ["communications"],
    });
  }

  // Essential consent (always present)
  consentOptions.unshift({
    id: "essential_consent",
    name: "Essential Services",
    description: "Required for the service to function. Cannot be disabled.",
    required: true,
    default_state: "opted_in",
    category_ids: ["account", "payment", "stored_data", "user_content"].filter((id) =>
      seenCategories.has(id)
    ),
  });

  // Data operation endpoints
  const dataEndpoints: DataEndpoint[] = [
    {
      action: "export",
      method: "POST",
      path: "/api/privacy/export",
      description: "Request a full export of your personal data in machine-readable format (JSON/CSV).",
      requires_auth: true,
    },
    {
      action: "delete",
      method: "POST",
      path: "/api/privacy/delete",
      description: "Request deletion of your account and all associated personal data.",
      requires_auth: true,
    },
    {
      action: "consent",
      method: "PUT",
      path: "/api/privacy/consent",
      description: "Update your consent preferences for optional data processing.",
      requires_auth: true,
    },
    {
      action: "access",
      method: "GET",
      path: "/api/privacy/data",
      description: "View a summary of all personal data we hold about you.",
      requires_auth: true,
    },
    {
      action: "rectify",
      method: "PUT",
      path: "/api/privacy/rectify",
      description: "Request correction of inaccurate personal data.",
      requires_auth: true,
    },
    {
      action: "restrict",
      method: "POST",
      path: "/api/privacy/restrict",
      description: "Request restriction of processing for specific data categories.",
      requires_auth: true,
    },
  ];

  // User rights based on regulations
  const rights = [
    {
      id: "right_access",
      name: "Right of Access",
      description: "You can request a copy of all personal data we hold about you.",
      regulation: "GDPR Art. 15 / CCPA Sec. 1798.100",
      endpoint: "/api/privacy/data",
    },
    {
      id: "right_rectification",
      name: "Right to Rectification",
      description: "You can request correction of inaccurate personal data.",
      regulation: "GDPR Art. 16",
      endpoint: "/api/privacy/rectify",
    },
    {
      id: "right_erasure",
      name: "Right to Erasure",
      description: "You can request deletion of your personal data (right to be forgotten).",
      regulation: "GDPR Art. 17 / CCPA Sec. 1798.105",
      endpoint: "/api/privacy/delete",
    },
    {
      id: "right_portability",
      name: "Right to Data Portability",
      description: "You can request your data in a structured, machine-readable format.",
      regulation: "GDPR Art. 20",
      endpoint: "/api/privacy/export",
    },
    {
      id: "right_restriction",
      name: "Right to Restrict Processing",
      description: "You can request that we limit how we process your data.",
      regulation: "GDPR Art. 18",
      endpoint: "/api/privacy/restrict",
    },
    {
      id: "right_object",
      name: "Right to Object",
      description: "You can object to processing based on legitimate interest or direct marketing.",
      regulation: "GDPR Art. 21",
      endpoint: "/api/privacy/consent",
    },
  ];

  const config: PrivacyDashboardConfig = {
    version: "1.0.0",
    generated_at: date,
    project: scan.projectName,
    company,
    contact_email: contactEmail,
    dpo: {
      name: dpoName,
      email: dpoEmail,
    },
    dashboard_settings: {
      title: `${company} — My Data`,
      description: `View, export, and manage your personal data at ${company}.`,
      show_data_categories: true,
      show_consent_management: consentOptions.length > 1,
      show_data_export: true,
      show_data_deletion: true,
      show_processing_history: true,
    },
    data_categories: dataCategories,
    consent_options: consentOptions,
    data_endpoints: dataEndpoints,
    rights,
  };

  return JSON.stringify(config, null, 2) + "\n";
}
