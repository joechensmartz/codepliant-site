import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Ruby gem name -> service mapping
const RUBY_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  // Payments
  stripe: {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Monitoring
  "sentry-ruby": {
    name: "sentry-ruby",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },
  "sentry-rails": {
    name: "sentry-ruby",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },
  "sentry-sidekiq": {
    name: "sentry-ruby",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "job data"],
  },

  // Email
  "sendgrid-ruby": {
    name: "sendgrid-ruby",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  postmark: {
    name: "postmark",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "postmark-rails": {
    name: "postmark",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // Auth
  devise: {
    name: "devise",
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "authentication tokens"],
  },
  omniauth: {
    name: "omniauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "profile data"],
  },
  "omniauth-google-oauth2": {
    name: "omniauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "Google profile data"],
  },
  "omniauth-facebook": {
    name: "omniauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "Facebook profile data"],
  },
  "omniauth-github": {
    name: "omniauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "GitHub profile data"],
  },

  // Storage
  "aws-sdk-s3": {
    name: "aws-sdk-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  "google-cloud-storage": {
    name: "google-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Marketing / Email Marketing
  mailchimp_marketing: {
    name: "mailchimp_marketing",
    category: "email",
    dataCollected: ["email addresses", "names", "audience segments", "campaign engagement"],
  },

  // Communications
  "twilio-ruby": {
    name: "twilio-ruby",
    category: "other",
    dataCollected: ["phone numbers", "SMS message content", "voice call metadata"],
  },

  // Support
  "intercom-ruby": {
    name: "intercom-ruby",
    category: "other",
    dataCollected: ["user profiles", "email", "name", "conversations", "user behavior"],
  },
  "intercom-rails": {
    name: "intercom-ruby",
    category: "other",
    dataCollected: ["user profiles", "email", "name", "conversations", "user behavior"],
  },

  // Analytics
  "analytics-ruby": {
    name: "analytics-ruby",
    category: "analytics",
    dataCollected: ["user identity", "user behavior", "page views", "custom events"],
  },
  ahoy_matey: {
    name: "ahoy_matey",
    category: "analytics",
    dataCollected: ["page views", "user behavior", "device information", "IP address"],
  },

  // Security
  "rack-attack": {
    name: "rack-attack",
    category: "other",
    dataCollected: ["IP addresses", "request metadata"],
  },

  // Database/Infrastructure
  redis: {
    name: "redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
  },
  sidekiq: {
    name: "sidekiq",
    category: "other",
    dataCollected: ["job data", "user data processed in background jobs"],
  },
  pg: {
    name: "pg",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  mysql2: {
    name: "mysql2",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },

  // AI
  "ruby-openai": {
    name: "ruby-openai",
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
  },

  // Financial
  plaid: {
    name: "plaid",
    category: "payment",
    dataCollected: ["bank account data", "transaction history", "account balances", "financial institution data"],
  },

  // Authorization
  pundit: {
    name: "pundit",
    category: "auth",
    dataCollected: ["user roles", "authorization policies", "access control data"],
  },

  // Audit Logging
  paper_trail: {
    name: "paper_trail",
    category: "other",
    dataCollected: ["record change history", "user attribution", "previous values", "timestamps"],
  },

  // Soft Delete (data retention)
  acts_as_paranoid: {
    name: "acts_as_paranoid",
    category: "other",
    dataCollected: ["soft-deleted records", "deletion timestamps", "retained user data"],
  },

  // File Uploads
  carrierwave: {
    name: "carrierwave",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  activestorage: {
    name: "active_storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata", "blob data"],
  },

  // Session Store
  "redis-rails": {
    name: "redis-rails",
    category: "database",
    dataCollected: ["session data", "cached data", "user session tokens"],
  },

  // Web Server (access logs)
  puma: {
    name: "puma",
    category: "other",
    dataCollected: ["HTTP request data", "IP address", "access logs"],
    isDataProcessor: false,
  },
};

export function scanRubyDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Search for Gemfile in project root and common subdirectories
  const searchPaths = collectGemfilePaths(projectPath);

  for (const gemfilePath of searchPaths) {
    scanGemfile(gemfilePath, path.relative(projectPath, gemfilePath) || "Gemfile", detected);
  }

  return Array.from(detected.values());
}

function collectGemfilePaths(projectPath: string): string[] {
  const paths: string[] = [];
  const rootGemfile = path.join(projectPath, "Gemfile");
  if (fs.existsSync(rootGemfile)) {
    paths.push(rootGemfile);
  }

  // Check common monorepo subdirectories
  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "vendor", "tmp", "log", "public"].includes(entry.name)
      ) {
        const subGemfile = path.join(projectPath, entry.name, "Gemfile");
        if (fs.existsSync(subGemfile)) {
          paths.push(subGemfile);
        }
      }
    }
  } catch {
    // ignore directory read errors
  }

  return paths;
}

function scanGemfile(
  filePath: string,
  relativeFile: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Match gem declarations: gem "name" or gem 'name'
    const gemMatch = trimmed.match(/^gem\s+["']([a-zA-Z0-9_-]+)["']/);
    if (!gemMatch) continue;

    const gemName = gemMatch[1];
    matchRubyGem(gemName, trimmed, relativeFile, detected);
  }
}

function matchRubyGem(
  gemName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const sig = RUBY_SIGNATURES[gemName];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: rawLine.substring(0, 100),
  };

  if (detected.has(sig.name)) {
    detected.get(sig.name)!.evidence.push(evidence);
  } else {
    detected.set(sig.name, {
      name: sig.name,
      category: sig.category,
      evidence: [evidence],
      dataCollected: [...sig.dataCollected],
      isDataProcessor: sig.isDataProcessor,
    });
  }
}
