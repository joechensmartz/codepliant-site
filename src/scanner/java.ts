import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Java groupId/artifactId → service mapping
const JAVA_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Payment
  "com.stripe/stripe-java": {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Monitoring
  "io.sentry/sentry": {
    name: "sentry",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Storage
  "com.google.cloud/google-cloud-storage": {
    name: "google-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  "software.amazon.awssdk/s3": {
    name: "aws-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Auth
  "com.auth0/auth0": {
    name: "auth0",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data", "profile data"],
  },
  "com.okta/okta-spring-boot-starter": {
    name: "okta",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data"],
  },
  "org.springframework.security": {
    name: "spring-security",
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "authentication tokens"],
  },

  // Database / Firebase
  "com.google.firebase/firebase-admin": {
    name: "firebase-admin",
    category: "database",
    dataCollected: ["user data", "authentication records", "cloud messaging tokens", "database content"],
  },

  // Auth (JWT)
  "io.jsonwebtoken/jjwt": {
    name: "jjwt",
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
  },
  "io.jsonwebtoken/jjwt-api": {
    name: "jjwt",
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
  },

  // Database
  "org.postgresql/postgresql": {
    name: "postgresql",
    category: "database",
    dataCollected: ["user data as defined in schema", "database records"],
  },
  "mysql/mysql-connector-java": {
    name: "mysql",
    category: "database",
    dataCollected: ["user data as defined in schema", "database records"],
  },
  "com.h2database/h2": {
    name: "h2-database",
    category: "database",
    dataCollected: ["user data as defined in schema", "database records"],
  },
  "org.mongodb/mongodb-driver-sync": {
    name: "mongodb",
    category: "database",
    dataCollected: ["user data as defined in schema", "database records"],
  },
  "org.springframework.boot/spring-boot-starter-data-jpa": {
    name: "spring-data-jpa",
    category: "database",
    dataCollected: ["user data as defined in schema", "database records"],
  },

  // Email
  "com.amazonaws/aws-java-sdk-ses": {
    name: "aws-ses",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "com.sendgrid/sendgrid-java": {
    name: "sendgrid",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "org.springframework.boot/spring-boot-starter-mail": {
    name: "spring-mail",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // Storage
  "com.amazonaws/aws-java-sdk-s3": {
    name: "aws-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Communication
  "com.twilio.sdk/twilio": {
    name: "twilio",
    category: "other",
    dataCollected: ["phone numbers", "SMS message content", "voice call metadata"],
  },

  // API
  "com.google.api-client/google-api-client": {
    name: "google-api-client",
    category: "other",
    dataCollected: ["user data via Google APIs", "profile information"],
  },

  // Auth (OAuth)
  "org.springframework.boot/spring-boot-starter-oauth2-client": {
    name: "spring-oauth2",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data", "profile data"],
  },
};

export function scanJavaDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Scan root pom.xml
  const pomPath = path.join(projectPath, "pom.xml");
  if (fs.existsSync(pomPath)) {
    scanPomXml(pomPath, "pom.xml", detected);

    // For multi-module Maven projects, discover child modules and scan their pom.xml files
    const childModules = discoverMavenModules(pomPath, projectPath);
    for (const modulePath of childModules) {
      const childPomPath = path.join(projectPath, modulePath, "pom.xml");
      if (fs.existsSync(childPomPath)) {
        scanPomXml(childPomPath, path.join(modulePath, "pom.xml"), detected);
      }
    }
  }

  // Scan build.gradle
  const gradlePath = path.join(projectPath, "build.gradle");
  if (fs.existsSync(gradlePath)) {
    scanBuildGradle(gradlePath, "build.gradle", detected);
  }

  // Scan build.gradle.kts
  const gradleKtsPath = path.join(projectPath, "build.gradle.kts");
  if (fs.existsSync(gradleKtsPath)) {
    scanBuildGradle(gradleKtsPath, "build.gradle.kts", detected);
  }

  return Array.from(detected.values());
}

function discoverMavenModules(pomPath: string, projectPath: string): string[] {
  let content: string;
  try {
    content = fs.readFileSync(pomPath, "utf-8");
  } catch {
    return [];
  }

  const modules: string[] = [];
  const moduleRegex = /<module>\s*([^<]+?)\s*<\/module>/g;
  let match;
  while ((match = moduleRegex.exec(content)) !== null) {
    modules.push(match[1].trim());
  }

  return modules;
}

function scanPomXml(
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

  // Match <dependency> blocks containing <groupId> and <artifactId>
  const depRegex = /<dependency>\s*([\s\S]*?)<\/dependency>/g;
  let depMatch;
  while ((depMatch = depRegex.exec(content)) !== null) {
    const block = depMatch[1];
    const groupMatch = block.match(/<groupId>\s*([^<]+?)\s*<\/groupId>/);
    const artifactMatch = block.match(/<artifactId>\s*([^<]+?)\s*<\/artifactId>/);

    if (groupMatch && artifactMatch) {
      const groupId = groupMatch[1].trim();
      const artifactId = artifactMatch[1].trim();
      const key = `${groupId}/${artifactId}`;
      const detail = `${groupId}:${artifactId}`;

      matchJavaDependency(key, groupId, detail, relativeFile, detected);
    }
  }
}

function scanBuildGradle(
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
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Match patterns like:
    //   implementation 'com.stripe:stripe-java:20.0.0'
    //   implementation "io.sentry:sentry:6.0.0"
    //   implementation("com.stripe:stripe-java:20.0.0")
    const gradleMatch = trimmed.match(
      /(?:implementation|api|compileOnly|runtimeOnly|testImplementation|classpath)\s*\(?\s*["']([a-zA-Z0-9._-]+):([a-zA-Z0-9._-]+)(?::([^"']+))?["']\s*\)?/
    );
    if (gradleMatch) {
      const groupId = gradleMatch[1];
      const artifactId = gradleMatch[2];
      const key = `${groupId}/${artifactId}`;
      const detail = `${groupId}:${artifactId}`;

      matchJavaDependency(key, groupId, detail, relativeFile, detected);
    }
  }
}

function matchJavaDependency(
  key: string,
  groupId: string,
  detail: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  // Try exact match first (groupId/artifactId)
  let sig = JAVA_SIGNATURES[key];

  // If no exact match, try matching just the groupId (for things like org.springframework.security)
  if (!sig) {
    for (const [sigKey, sigVal] of Object.entries(JAVA_SIGNATURES)) {
      if (key.startsWith(sigKey + "/") || key.startsWith(sigKey + "-") || groupId === sigKey) {
        sig = sigVal;
        break;
      }
    }
  }

  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: detail.substring(0, 100),
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
