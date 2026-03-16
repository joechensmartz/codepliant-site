import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Cargo crate name -> service mapping
const RUST_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Monitoring
  sentry: {
    name: "sentry",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Payments
  "stripe-rust": {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Email
  lettre: {
    name: "lettre",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // Auth / JWT
  jsonwebtoken: {
    name: "jsonwebtoken",
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
  },

  // Auth / Password hashing
  argon2: {
    name: "argon2",
    category: "auth",
    dataCollected: ["password hashes"],
  },

  // Storage / AWS
  "aws-sdk-s3": {
    name: "aws-sdk-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  rusoto_s3: {
    name: "aws-s3-rusoto",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Database
  sqlx: {
    name: "sqlx",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  diesel: {
    name: "diesel",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "sea-orm": {
    name: "sea-orm",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  redis: {
    name: "redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
  },
};

export function scanRustDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Search for Cargo.toml in project root and workspace members
  const searchPaths = collectCargoPaths(projectPath);

  for (const cargoPath of searchPaths) {
    scanCargoToml(cargoPath, path.relative(projectPath, cargoPath) || "Cargo.toml", detected);
  }

  return Array.from(detected.values());
}

function collectCargoPaths(projectPath: string): string[] {
  const paths: string[] = [];
  const rootCargo = path.join(projectPath, "Cargo.toml");
  if (fs.existsSync(rootCargo)) {
    paths.push(rootCargo);
  }

  // Check common monorepo subdirectories
  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["target", "node_modules"].includes(entry.name)
      ) {
        const subCargo = path.join(projectPath, entry.name, "Cargo.toml");
        if (fs.existsSync(subCargo)) {
          paths.push(subCargo);
        }
      }
    }
  } catch {
    // ignore directory read errors
  }

  return paths;
}

function scanCargoToml(
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
  let inDependencies = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Track section headers
    if (trimmed.startsWith("[")) {
      // Match [dependencies], [dev-dependencies], [build-dependencies]
      inDependencies = /^\[(.*-)?dependencies\]/.test(trimmed);
      continue;
    }

    if (!inDependencies) continue;

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Match dependency declarations:
    //   crate_name = "version"
    //   crate_name = { version = "...", features = [...] }
    const depMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=/);
    if (!depMatch) continue;

    const crateName = depMatch[1];
    matchRustCrate(crateName, trimmed, relativeFile, detected);
  }
}

function matchRustCrate(
  crateName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const sig = RUST_SIGNATURES[crateName];
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
