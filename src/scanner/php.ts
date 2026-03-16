import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Composer package name -> service mapping
const PHP_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Payments
  "stripe/stripe-php": {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Monitoring
  "sentry/sentry-laravel": {
    name: "sentry-laravel",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Cloud / Storage
  "aws/aws-sdk-php": {
    name: "aws-sdk-php",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  "google/cloud-storage": {
    name: "google-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Communications
  "twilio/sdk": {
    name: "twilio",
    category: "other",
    dataCollected: ["phone numbers", "SMS message content", "voice call metadata"],
  },

  // Email / Marketing
  "mailchimp/marketing": {
    name: "mailchimp",
    category: "email",
    dataCollected: ["email addresses", "names", "audience segments", "campaign engagement"],
  },

  // Auth / JWT
  "firebase/php-jwt": {
    name: "firebase-jwt",
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
  },
  "league/oauth2-client": {
    name: "oauth2-client",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "profile data"],
  },
  "laravel/socialite": {
    name: "laravel-socialite",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "social profile data"],
  },

  // Permissions
  "spatie/laravel-permission": {
    name: "laravel-permission",
    category: "auth",
    dataCollected: ["user roles", "permission assignments", "user identity"],
  },

  // Analytics
  "spatie/laravel-analytics": {
    name: "laravel-analytics",
    category: "analytics",
    dataCollected: ["page views", "user behavior", "device information", "IP address"],
  },
};

export function scanPhpDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Search for composer.json in project root and common subdirectories
  const searchPaths = collectComposerPaths(projectPath);

  for (const composerPath of searchPaths) {
    scanComposerJson(composerPath, path.relative(projectPath, composerPath) || "composer.json", detected);
  }

  return Array.from(detected.values());
}

function collectComposerPaths(projectPath: string): string[] {
  const paths: string[] = [];
  const rootComposer = path.join(projectPath, "composer.json");
  if (fs.existsSync(rootComposer)) {
    paths.push(rootComposer);
  }

  // Check common monorepo subdirectories
  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "vendor", "storage", "public", "bootstrap"].includes(entry.name)
      ) {
        const subComposer = path.join(projectPath, entry.name, "composer.json");
        if (fs.existsSync(subComposer)) {
          paths.push(subComposer);
        }
      }
    }
  } catch {
    // ignore directory read errors
  }

  return paths;
}

function scanComposerJson(
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

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return;
  }

  // Scan both require and require-dev
  for (const section of ["require", "require-dev"] as const) {
    const deps = parsed[section];
    if (deps && typeof deps === "object") {
      for (const pkgName of Object.keys(deps as Record<string, string>)) {
        matchPhpPackage(
          pkgName,
          `"${pkgName}": "${(deps as Record<string, string>)[pkgName]}"`,
          relativeFile,
          detected
        );
      }
    }
  }
}

function matchPhpPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const sig = PHP_SIGNATURES[pkgName];
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
    });
  }
}
