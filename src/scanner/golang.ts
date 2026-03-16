import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Go module path -> service mapping
const GO_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  "github.com/sashabaranov/go-openai": {
    name: "go-openai",
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
  },
  "cloud.google.com/go/ai": {
    name: "google-cloud-ai",
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
  },
  "github.com/aws/aws-sdk-go-v2": {
    name: "aws-sdk-go",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Payment
  "github.com/stripe/stripe-go": {
    name: "stripe-go",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },
  "github.com/go-pay/gopay": {
    name: "gopay",
    category: "payment",
    dataCollected: ["payment information", "transaction history"],
  },

  // Monitoring
  "github.com/getsentry/sentry-go": {
    name: "sentry-go",
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
  },

  // Database
  "github.com/uptrace/bun": {
    name: "bun-db",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "gorm.io/gorm": {
    name: "gorm",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "go.mongodb.org/mongo-driver": {
    name: "mongo-driver",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "github.com/jackc/pgx": {
    name: "pgx",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "github.com/redis/go-redis": {
    name: "go-redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
  },

  // Web frameworks (categorized as "other" — they don't collect data themselves)
  "github.com/gofiber/fiber": {
    name: "fiber",
    category: "other",
    dataCollected: ["HTTP request data", "IP address"],
  },
  "github.com/labstack/echo": {
    name: "echo",
    category: "other",
    dataCollected: ["HTTP request data", "IP address"],
  },
  "github.com/gin-gonic/gin": {
    name: "gin",
    category: "other",
    dataCollected: ["HTTP request data", "IP address"],
  },

  // Email
  "github.com/sendgrid/sendgrid-go": {
    name: "sendgrid-go",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "github.com/mailgun/mailgun-go": {
    name: "mailgun-go",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // Auth
  "github.com/auth0/go-auth0": {
    name: "go-auth0",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "OAuth tokens",
      "session data",
      "user metadata",
    ],
  },

  // Validation
  "github.com/go-playground/validator": {
    name: "go-playground-validator",
    category: "other",
    dataCollected: ["validated user input", "structured form data"],
  },

  // Session Management
  "github.com/gorilla/sessions": {
    name: "gorilla-sessions",
    category: "auth",
    dataCollected: ["session data", "session tokens", "user identity"],
  },

  // JWT Auth
  "github.com/dgrijalva/jwt-go": {
    name: "jwt-go",
    category: "auth",
    dataCollected: ["JWT tokens", "user claims", "authentication data"],
  },

  // Postgres
  "github.com/lib/pq": {
    name: "lib-pq",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
};

export function scanGoDependencies(projectPath: string): DetectedService[] {
  const goModPath = path.join(projectPath, "go.mod");

  if (!fs.existsSync(goModPath)) {
    return [];
  }

  let content: string;
  try {
    content = fs.readFileSync(goModPath, "utf-8");
  } catch {
    return [];
  }

  const detected = new Map<string, DetectedService>();

  // Parse go.mod require directives
  // Handles both single-line: require github.com/foo/bar v1.0.0
  // and block: require ( ... )
  const lines = content.split("\n");
  const requireLines: string[] = [];
  let inRequireBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("require (")) {
      inRequireBlock = true;
      continue;
    }
    if (inRequireBlock && trimmed === ")") {
      inRequireBlock = false;
      continue;
    }
    if (inRequireBlock) {
      requireLines.push(trimmed);
      continue;
    }
    if (trimmed.startsWith("require ")) {
      requireLines.push(trimmed.replace(/^require\s+/, ""));
    }
  }

  for (const reqLine of requireLines) {
    if (!reqLine || reqLine.startsWith("//")) continue;

    // Extract module path (first token before version)
    const modulePath = reqLine.split(/\s+/)[0];
    if (!modulePath) continue;

    for (const [sigPath, sig] of Object.entries(GO_SIGNATURES)) {
      // Match exact path or subpackage (e.g., github.com/aws/aws-sdk-go-v2/service/s3)
      if (modulePath === sigPath || modulePath.startsWith(sigPath + "/")) {
        const evidence: Evidence = {
          type: "dependency",
          file: "go.mod",
          detail: reqLine.substring(0, 100),
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
        break;
      }
    }
  }

  return Array.from(detected.values());
}
