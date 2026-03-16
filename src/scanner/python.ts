import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Python package → service mapping
const PYTHON_SIGNATURES: Record<
  string,
  {
    category: DetectedService["category"];
    dataCollected: string[];
    envPatterns: string[];
    isDataProcessor?: boolean;
  }
> = {
  // AI
  openai: {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["OPENAI_API_KEY"],
  },
  anthropic: {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["ANTHROPIC_API_KEY"],
  },
  "google-generativeai": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["GOOGLE_API_KEY", "GEMINI_API_KEY"],
  },
  langchain: {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "document content"],
    envPatterns: [],
  },
  "langchain-openai": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["OPENAI_API_KEY"],
  },
  "langchain-anthropic": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["ANTHROPIC_API_KEY"],
  },
  replicate: {
    category: "ai",
    dataCollected: ["user inputs", "generated content", "model predictions"],
    envPatterns: ["REPLICATE_API_TOKEN"],
  },
  cohere: {
    category: "ai",
    dataCollected: ["user prompts", "embeddings", "generated content"],
    envPatterns: ["COHERE_API_KEY"],
  },
  transformers: {
    category: "ai",
    dataCollected: ["user inputs", "model predictions"],
    envPatterns: [],
  },
  "pinecone-client": {
    category: "ai",
    dataCollected: ["vector embeddings", "metadata"],
    envPatterns: ["PINECONE_API_KEY"],
  },
  chromadb: {
    category: "ai",
    dataCollected: ["vector embeddings", "document content", "metadata"],
    envPatterns: [],
  },

  // Payment
  stripe: {
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
    envPatterns: ["STRIPE_SECRET_KEY", "STRIPE_API_KEY"],
  },

  // Analytics
  posthog: {
    category: "analytics",
    dataCollected: ["user behavior", "feature flag usage", "device information"],
    envPatterns: ["POSTHOG_API_KEY"],
  },
  mixpanel: {
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information"],
    envPatterns: ["MIXPANEL_TOKEN"],
  },

  // Auth
  "django-allauth": {
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data"],
    envPatterns: [],
  },
  "flask-login": {
    category: "auth",
    dataCollected: ["session data", "user identity"],
    envPatterns: [],
  },
  passlib: {
    category: "auth",
    dataCollected: ["password hashes"],
    envPatterns: [],
  },
  PyJWT: {
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
    envPatterns: [],
  },
  "python-jose": {
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
    envPatterns: [],
  },

  // Email
  sendgrid: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["SENDGRID_API_KEY"],
  },
  resend: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["RESEND_API_KEY"],
  },
  postmarker: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["POSTMARK_API_TOKEN"],
  },

  // Database
  SQLAlchemy: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },
  prisma: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },
  mongoengine: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["MONGODB_URI"],
  },
  psycopg2: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },

  // Storage
  boto3: {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
  },
  "google-cloud-storage": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: ["GOOGLE_APPLICATION_CREDENTIALS"],
  },
  cloudinary: {
    category: "storage",
    dataCollected: ["uploaded files", "images", "file metadata"],
    envPatterns: ["CLOUDINARY_URL"],
  },

  // Monitoring
  "sentry-sdk": {
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
    envPatterns: ["SENTRY_DSN"],
  },

  // Frameworks
  django: {
    category: "auth",
    dataCollected: ["session cookies", "CSRF tokens", "user accounts", "admin panel access"],
    envPatterns: ["DJANGO_SECRET_KEY", "DJANGO_SETTINGS_MODULE"],
  },
  djangorestframework: {
    category: "other",
    dataCollected: ["API request data", "authentication tokens", "user input"],
    envPatterns: [],
  },
  "django-rest-framework": {
    category: "other",
    dataCollected: ["API request data", "authentication tokens", "user input"],
    envPatterns: [],
  },
  "django-cors-headers": {
    category: "other",
    dataCollected: ["cross-origin request data", "allowed origins"],
    envPatterns: [],
  },
  "django-storages": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_STORAGE_BUCKET_NAME", "GS_BUCKET_NAME"],
  },
  celery: {
    category: "other",
    dataCollected: ["job data", "user data processed in background tasks"],
    envPatterns: ["CELERY_BROKER_URL", "CELERY_RESULT_BACKEND"],
  },
  "django-redis": {
    category: "database",
    dataCollected: ["cached data", "session data"],
    envPatterns: ["REDIS_URL", "REDIS_HOST"],
  },
  whitenoise: {
    category: "other",
    dataCollected: ["static file access logs"],
    envPatterns: [],
    isDataProcessor: false,
  },
  gunicorn: {
    category: "other",
    dataCollected: ["request logs", "IP addresses"],
    envPatterns: [],
    isDataProcessor: false,
  },
  uvicorn: {
    category: "other",
    dataCollected: ["request logs", "IP addresses"],
    envPatterns: [],
    isDataProcessor: false,
  },
  fastapi: {
    category: "other",
    dataCollected: ["API request data", "user input", "request metadata"],
    envPatterns: [],
  },
  "tortoise-orm": {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },
  asyncpg: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },
  databases: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DATABASE_URL"],
  },
  pydantic: {
    category: "other",
    dataCollected: ["structured user data", "validated input"],
    envPatterns: [],
    isDataProcessor: false,
  },
  "python-multipart": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata", "form data"],
    envPatterns: [],
  },
  aiohttp: {
    category: "other",
    dataCollected: ["HTTP request data", "external API responses"],
    envPatterns: [],
  },
};

export function scanPythonDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Scan requirements.txt
  const reqFiles = ["requirements.txt", "requirements-dev.txt", "requirements-prod.txt"];
  for (const reqFile of reqFiles) {
    const reqPath = path.join(projectPath, reqFile);
    if (fs.existsSync(reqPath)) {
      scanRequirementsTxt(reqPath, reqFile, detected);
    }
  }

  // Scan pyproject.toml
  const pyprojectPath = path.join(projectPath, "pyproject.toml");
  if (fs.existsSync(pyprojectPath)) {
    scanPyprojectToml(pyprojectPath, detected);
  }

  // Scan Pipfile
  const pipfilePath = path.join(projectPath, "Pipfile");
  if (fs.existsSync(pipfilePath)) {
    scanPipfile(pipfilePath, detected);
  }

  return Array.from(detected.values());
}

function scanRequirementsTxt(
  filePath: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("-"));

  for (const line of lines) {
    // Extract package name (before ==, >=, ~=, etc.)
    const pkgName = line.split(/[=<>~![\s]/)[0].trim().toLowerCase();
    matchPythonPackage(pkgName, line, filename, detected);
  }
}

function scanPyprojectToml(
  filePath: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  // Simple TOML parsing for dependencies
  // Match lines in [project.dependencies] or [tool.poetry.dependencies] sections
  const depPatterns = [
    /dependencies\s*=\s*\[([\s\S]*?)\]/g,
    /\[tool\.poetry\.dependencies\]([\s\S]*?)(?:\[|$)/g,
  ];

  for (const pattern of depPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const section = match[1];
      // Match quoted package names or bare names
      const pkgMatches = section.matchAll(/["']?([a-zA-Z0-9_-]+)["']?\s*[=><~,\]]/g);
      for (const pkgMatch of pkgMatches) {
        matchPythonPackage(
          pkgMatch[1].toLowerCase(),
          pkgMatch[0],
          "pyproject.toml",
          detected
        );
      }
    }
  }
}

function scanPipfile(
  filePath: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  // Simple Pipfile parsing — find package names in [packages] and [dev-packages]
  const lines = content.split("\n");
  let inPackages = false;

  for (const line of lines) {
    if (line.match(/^\[(packages|dev-packages)\]/)) {
      inPackages = true;
      continue;
    }
    if (line.match(/^\[/)) {
      inPackages = false;
      continue;
    }
    if (inPackages && line.includes("=")) {
      const pkgName = line.split("=")[0].trim().toLowerCase();
      if (pkgName) {
        matchPythonPackage(pkgName, line.trim(), "Pipfile", detected);
      }
    }
  }
}

function matchPythonPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  for (const [sigName, sig] of Object.entries(PYTHON_SIGNATURES)) {
    if (pkgName === sigName.toLowerCase() || pkgName === sigName) {
      const evidence: Evidence = {
        type: "dependency",
        file: filename,
        detail: rawLine.substring(0, 100),
      };

      if (detected.has(sigName)) {
        detected.get(sigName)!.evidence.push(evidence);
      } else {
        detected.set(sigName, {
          name: sigName,
          category: sig.category,
          evidence: [evidence],
          dataCollected: [...sig.dataCollected],
          isDataProcessor: sig.isDataProcessor,
        });
      }
      break;
    }
  }
}
