import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Elixir package name -> service mapping
const ELIXIR_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Monitoring
  sentry: {
    name: "sentry-elixir",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Email
  swoosh: {
    name: "swoosh",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  bamboo: {
    name: "bamboo",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  bamboo_postmark: {
    name: "bamboo",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  bamboo_smtp: {
    name: "bamboo",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // AWS
  ex_aws: {
    name: "ex_aws",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  ex_aws_s3: {
    name: "ex_aws",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Payments
  stripity_stripe: {
    name: "stripity_stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Auth
  ueberauth: {
    name: "ueberauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "profile data"],
  },
  ueberauth_google: {
    name: "ueberauth",
    category: "auth",
    dataCollected: ["email", "name", "Google OAuth tokens", "profile data"],
  },
  ueberauth_github: {
    name: "ueberauth",
    category: "auth",
    dataCollected: ["email", "name", "GitHub OAuth tokens", "profile data"],
  },
  guardian: {
    name: "guardian",
    category: "auth",
    dataCollected: ["JWT tokens", "session data", "user identity"],
  },
  pow: {
    name: "pow",
    category: "auth",
    dataCollected: ["email", "password hash", "session data"],
  },

  // Encryption
  cloak: {
    name: "cloak",
    category: "other",
    dataCollected: ["encrypted fields"],
  },

  // Job Queue
  oban: {
    name: "oban",
    category: "other",
    dataCollected: ["job data", "user data processed in background jobs"],
  },

  // GraphQL
  absinthe: {
    name: "absinthe",
    category: "other",
    dataCollected: ["GraphQL queries", "user-submitted data"],
  },

  // Analytics / Telemetry
  opentelemetry: {
    name: "opentelemetry",
    category: "monitoring",
    dataCollected: ["telemetry data", "traces", "performance metrics"],
  },
  opentelemetry_api: {
    name: "opentelemetry",
    category: "monitoring",
    dataCollected: ["telemetry data", "traces", "performance metrics"],
  },

  // GeoIP
  locus: {
    name: "locus",
    category: "analytics",
    dataCollected: ["IP addresses", "geolocation data"],
  },
  geolix: {
    name: "geolix",
    category: "analytics",
    dataCollected: ["IP addresses", "geolocation data"],
  },

  // Database
  ecto: {
    name: "ecto",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  postgrex: {
    name: "postgrex",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  redix: {
    name: "redix",
    category: "database",
    dataCollected: ["cached data", "session data"],
  },
};

export function scanElixirDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Search for mix.exs in project root and common subdirectories
  const searchPaths = collectMixPaths(projectPath);

  for (const mixPath of searchPaths) {
    scanMixExs(mixPath, path.relative(projectPath, mixPath) || "mix.exs", detected);
  }

  return Array.from(detected.values());
}

function collectMixPaths(projectPath: string): string[] {
  const paths: string[] = [];
  const rootMix = path.join(projectPath, "mix.exs");
  if (fs.existsSync(rootMix)) {
    paths.push(rootMix);
  }

  // Check common monorepo subdirectories (umbrella apps)
  const appsDir = path.join(projectPath, "apps");
  if (fs.existsSync(appsDir)) {
    try {
      const entries = fs.readdirSync(appsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subMix = path.join(appsDir, entry.name, "mix.exs");
          if (fs.existsSync(subMix)) {
            paths.push(subMix);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return paths;
}

function scanMixExs(
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

  // Extract the deps section - match {:pkg_name, "version"} or {:pkg_name, "~> 1.0", ...}
  // Also match {:pkg_name, git: "..."} or {:pkg_name, github: "..."}
  const depRegex = /\{:(\w+)\s*,/g;
  let match;

  while ((match = depRegex.exec(content)) !== null) {
    const pkgName = match[1];
    matchElixirPackage(pkgName, match[0], relativeFile, detected);
  }
}

function matchElixirPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const sig = ELIXIR_SIGNATURES[pkgName];
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
