import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { ServiceCategory } from "../scanner/types.js";

// ── Category display names & ordering ───────────────────────────────────────

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  ai: "AI Services",
  payment: "Payment",
  analytics: "Analytics",
  auth: "Authentication",
  email: "Email",
  database: "Database",
  storage: "Storage",
  monitoring: "Monitoring",
  advertising: "Advertising",
  social: "Social",
  other: "Other Services",
};

const CATEGORY_ORDER: ServiceCategory[] = [
  "ai",
  "payment",
  "auth",
  "database",
  "storage",
  "email",
  "analytics",
  "monitoring",
  "advertising",
  "social",
  "other",
];

// ── Placeholder values per env var name ─────────────────────────────────────

const PLACEHOLDER_MAP: Record<string, string> = {
  // AI
  OPENAI_API_KEY: "sk-your-key-here",
  OPENAI_ORG: "org-your-org-id",
  ANTHROPIC_API_KEY: "sk-ant-your-key-here",
  CLAUDE_API_KEY: "sk-ant-your-key-here",
  GOOGLE_AI_KEY: "your-google-ai-key",
  GEMINI_API_KEY: "your-gemini-api-key",
  REPLICATE_API_TOKEN: "r8_your-token-here",
  TOGETHER_API_KEY: "your-together-api-key",
  COHERE_API_KEY: "your-cohere-api-key",
  CO_API_KEY: "your-cohere-api-key",
  PINECONE_API_KEY: "your-pinecone-api-key",
  PINECONE_ENVIRONMENT: "us-east-1-aws",

  // Payment
  STRIPE_SECRET_KEY: "rk_test_REPLACE_ME",
  STRIPE_PUBLISHABLE_KEY: "pk_test_your-key",
  STRIPE_WEBHOOK_SECRET: "whsec_your-secret",
  PAYPAL_CLIENT_ID: "your-paypal-client-id",
  PAYPAL_CLIENT_SECRET: "your-paypal-client-secret",
  LEMONSQUEEZY_API_KEY: "your-lemonsqueezy-api-key",
  LEMON_SQUEEZY: "your-lemonsqueezy-key",
  PLAID_CLIENT_ID: "your-plaid-client-id",
  PLAID_SECRET: "your-plaid-secret",
  PLAID_ENV: "sandbox",

  // Auth
  NEXTAUTH_SECRET: "your-secret-here",
  NEXTAUTH_URL: "http://localhost:3000",
  AUTH_SECRET: "your-auth-secret",
  BETTER_AUTH_SECRET: "your-better-auth-secret",
  CLERK_SECRET_KEY: "rk_test_REPLACE_ME",
  CLERK_PUBLISHABLE_KEY: "pk_test_your-clerk-key",
  NEXT_PUBLIC_CLERK: "pk_test_your-clerk-key",
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-supabase-anon-key",
  SUPABASE_SERVICE_ROLE: "your-supabase-service-role-key",
  GOOGLE_CLIENT_ID: "your-google-client-id.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "your-google-client-secret",
  MICROSOFT_CLIENT_ID: "your-microsoft-client-id",
  MICROSOFT_CLIENT_SECRET: "your-microsoft-client-secret",

  // Database
  PRISMA_DATABASE_URL: "postgresql://user:password@localhost:5432/mydb",
  DRIZZLE_DATABASE_URL: "postgresql://user:password@localhost:5432/mydb",
  MONGODB_URI: "mongodb://localhost:27017/mydb",
  MONGO_URL: "mongodb://localhost:27017/mydb",
  REDIS_URL: "redis://localhost:6379",
  REDIS_HOST: "localhost",
  UPSTASH_REDIS_REST_URL: "https://your-upstash-url.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "your-upstash-token",
  ACCELERATE_URL: "prisma://your-accelerate-url",

  // Storage
  AWS_ACCESS_KEY_ID: "your-aws-access-key",
  AWS_SECRET_ACCESS_KEY: "your-aws-secret-key",
  AWS_S3_BUCKET: "your-bucket-name",
  AWS_SES_REGION: "us-east-1",
  UPLOADTHING_SECRET: "sk_live_your-uploadthing-secret",
  UPLOADTHING_APP_ID: "your-uploadthing-app-id",
  CLOUDINARY_URL: "cloudinary://api_key:api_secret@cloud_name",
  CLOUDINARY_API_KEY: "your-cloudinary-api-key",
  GOOGLE_APPLICATION_CREDENTIALS: "./service-account.json",
  GCS_BUCKET: "your-gcs-bucket",

  // Email
  SENDGRID_API_KEY: "SG.your-sendgrid-api-key",
  RESEND_API_KEY: "re_your-resend-api-key",
  SMTP_HOST: "smtp.example.com",
  SMTP_USER: "your-smtp-user",
  SMTP_PASS: "your-smtp-password",
  EMAIL_SERVER: "smtp://user:pass@smtp.example.com:587",
  POSTMARK_API_TOKEN: "your-postmark-api-token",
  POSTMARK_SERVER_TOKEN: "your-postmark-server-token",
  MAILCHIMP_API_KEY: "your-mailchimp-api-key",
  MAILCHIMP_SERVER_PREFIX: "us1",
  MAILCHIMP_LIST_ID: "your-mailchimp-list-id",
  MAILCHIMP_TRANSACTIONAL_API_KEY: "your-mandrill-api-key",
  MANDRILL_API_KEY: "your-mandrill-api-key",

  // Analytics
  GA_TRACKING_ID: "G-XXXXXXXXXX",
  GOOGLE_ANALYTICS: "G-XXXXXXXXXX",
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",
  NEXT_PUBLIC_GA: "G-XXXXXXXXXX",
  POSTHOG_API_KEY: "phc_your-posthog-key",
  NEXT_PUBLIC_POSTHOG: "phc_your-posthog-key",
  POSTHOG_HOST: "https://app.posthog.com",
  MIXPANEL_TOKEN: "your-mixpanel-token",
  MIXPANEL_API_SECRET: "your-mixpanel-api-secret",
  AMPLITUDE_API_KEY: "your-amplitude-api-key",
  HOTJAR_ID: "your-hotjar-id",
  NEXT_PUBLIC_HOTJAR: "your-hotjar-id",
  SEGMENT_WRITE_KEY: "your-segment-write-key",
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: "your-segment-write-key",

  // Monitoring
  SENTRY_DSN: "https://your-key@o0.ingest.sentry.io/0",
  NEXT_PUBLIC_SENTRY_DSN: "https://your-key@o0.ingest.sentry.io/0",
  SENTRY_AUTH_TOKEN: "your-sentry-auth-token",
  DD_API_KEY: "your-datadog-api-key",
  DD_APP_KEY: "your-datadog-app-key",
  DATADOG_API_KEY: "your-datadog-api-key",

  // Firebase
  FIREBASE_API_KEY: "your-firebase-api-key",
  FIREBASE_PROJECT_ID: "your-firebase-project-id",
  FIREBASE_APP_ID: "1:000000000000:web:abcdef",
  NEXT_PUBLIC_FIREBASE: "your-firebase-config",
  FIREBASE_SERVICE_ACCOUNT: "./firebase-service-account.json",
  FIREBASE_ADMIN_KEY: "your-firebase-admin-key",

  // Communication
  TWILIO_ACCOUNT_SID: "ACyour-twilio-account-sid",
  TWILIO_AUTH_TOKEN: "your-twilio-auth-token",
  TWILIO_PHONE_NUMBER: "+1234567890",
  INTERCOM_APP_ID: "your-intercom-app-id",
  INTERCOM_ACCESS_TOKEN: "your-intercom-access-token",
  INTERCOM_SECRET_KEY: "your-intercom-secret-key",
  CRISP_WEBSITE_ID: "your-crisp-website-id",
  PUSHER_APP_ID: "your-pusher-app-id",
  PUSHER_KEY: "your-pusher-key",
  PUSHER_SECRET: "your-pusher-secret",
  NEXT_PUBLIC_PUSHER: "your-pusher-key",

  // Search
  ALGOLIA_APP_ID: "your-algolia-app-id",
  ALGOLIA_API_KEY: "your-algolia-api-key",
  ALGOLIA_SEARCH_KEY: "your-algolia-search-key",
  NEXT_PUBLIC_ALGOLIA: "your-algolia-app-id",
  MEILISEARCH_HOST: "http://localhost:7700",
  MEILISEARCH_API_KEY: "your-meilisearch-api-key",

  // Push Notifications
  ONESIGNAL_APP_ID: "your-onesignal-app-id",
  ONESIGNAL_API_KEY: "your-onesignal-api-key",
  ONESIGNAL_REST_API_KEY: "your-onesignal-rest-api-key",
  VAPID_PUBLIC_KEY: "your-vapid-public-key",
  VAPID_PRIVATE_KEY: "your-vapid-private-key",
  WEB_PUSH_EMAIL: "mailto:your-email@example.com",

  // Feature Management
  LAUNCHDARKLY_SDK_KEY: "sdk-your-launchdarkly-key",
  LAUNCHDARKLY_CLIENT_ID: "your-launchdarkly-client-id",

  // CRM
  HUBSPOT_ACCESS_TOKEN: "your-hubspot-access-token",
  HUBSPOT_API_KEY: "your-hubspot-api-key",
  HUBSPOT_CLIENT_SECRET: "your-hubspot-client-secret",

  // Cloudflare
  CLOUDFLARE_API_TOKEN: "your-cloudflare-api-token",
  CLOUDFLARE_ACCOUNT_ID: "your-cloudflare-account-id",

  // Google APIs
  GOOGLE_API_KEY: "your-google-api-key",
};

import { SERVICE_SIGNATURES } from "../scanner/types.js";

/**
 * Given a scan result, produce a .env.example file content string.
 * Groups env vars by category with header comments.
 */
export function generateEnvExample(scan: ScanResult): string {
  // Filter to data processors only (same as doc generation)
  const services = scan.services.filter((s) => s.isDataProcessor !== false);

  if (services.length === 0) {
    return "";
  }

  // Collect env vars per category, deduplicating
  const categoryVars = new Map<ServiceCategory, Map<string, string>>();
  const seenVars = new Set<string>();

  for (const service of services) {
    // Look up the service signature by name
    const sig = SERVICE_SIGNATURES[service.name];
    if (!sig || sig.envPatterns.length === 0) continue;

    const cat = sig.category;
    if (!categoryVars.has(cat)) {
      categoryVars.set(cat, new Map());
    }
    const varMap = categoryVars.get(cat)!;

    for (const envVar of sig.envPatterns) {
      if (seenVars.has(envVar)) continue;
      seenVars.add(envVar);

      const placeholder = PLACEHOLDER_MAP[envVar] || "your-value-here";
      varMap.set(envVar, placeholder);
    }
  }

  if (seenVars.size === 0) {
    return "";
  }

  // Build the output
  const lines: string[] = [];

  lines.push("# ============================================================");
  lines.push("# .env.example — Generated by Codepliant");
  lines.push(`# ${new Date().toISOString().split("T")[0]}`);
  lines.push("#");
  lines.push("# Copy this file to .env.local and fill in your actual values.");
  lines.push("# NEVER commit .env.local to version control.");
  lines.push("# ============================================================");
  lines.push("");

  let first = true;
  for (const cat of CATEGORY_ORDER) {
    const varMap = categoryVars.get(cat);
    if (!varMap || varMap.size === 0) continue;

    if (!first) {
      lines.push("");
    }
    first = false;

    lines.push(`# === ${CATEGORY_LABELS[cat]} ===`);

    for (const [name, placeholder] of varMap) {
      lines.push(`${name}=${placeholder}`);
    }
  }

  lines.push("");

  return lines.join("\n");
}

/**
 * Write the .env.example file to disk at the given output directory.
 * Returns the written file path, or null if no env vars were detected.
 */
export function writeEnvExample(
  scan: ScanResult,
  outputDir: string
): string | null {
  const content = generateEnvExample(scan);
  if (!content) return null;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, ".env.example");
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}
