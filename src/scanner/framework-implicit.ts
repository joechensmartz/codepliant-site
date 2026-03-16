import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

interface ImplicitService {
  name: string;
  category: DetectedService["category"];
  dataCollected: string[];
}

interface FrameworkDefinition {
  /** File that indicates this framework is present */
  manifestFile: string;
  /** String that must appear in the manifest to confirm the framework */
  markerString: string;
  /** Services that are always present when the framework is detected */
  alwaysPresent: ImplicitService[];
  /** Services that are present only when a specific dependency/pattern is also in the manifest */
  conditional: Array<{
    marker: string;
    service: ImplicitService;
  }>;
}

const FRAMEWORK_DEFINITIONS: FrameworkDefinition[] = [
  // Ruby on Rails
  {
    manifestFile: "Gemfile",
    markerString: "rails",
    alwaysPresent: [
      {
        name: "ActiveRecord",
        category: "database",
        dataCollected: ["user data as defined in schema", "timestamps", "associations"],
      },
      {
        name: "ActionMailer",
        category: "email",
        dataCollected: ["email addresses", "email content"],
      },
      {
        name: "ActionController::Cookies",
        category: "other",
        dataCollected: ["session cookies", "session data", "CSRF tokens"],
      },
      {
        name: "ActiveStorage",
        category: "storage",
        dataCollected: ["uploaded files", "file metadata", "storage references"],
      },
    ],
    conditional: [],
  },

  // Django
  {
    manifestFile: "requirements.txt",
    markerString: "django",
    alwaysPresent: [
      {
        name: "Django ORM",
        category: "database",
        dataCollected: ["user data as defined in models", "timestamps"],
      },
      {
        name: "django.core.mail",
        category: "email",
        dataCollected: ["email addresses", "email content"],
      },
      {
        name: "django.contrib.sessions",
        category: "other",
        dataCollected: ["session cookies", "session data"],
      },
      {
        name: "django.contrib.auth",
        category: "auth",
        dataCollected: ["usernames", "password hashes", "email", "login timestamps"],
      },
    ],
    conditional: [],
  },

  // Laravel
  {
    manifestFile: "composer.json",
    markerString: "laravel/framework",
    alwaysPresent: [
      {
        name: "Eloquent",
        category: "database",
        dataCollected: ["user data as defined in models", "timestamps"],
      },
      {
        name: "Laravel Mail",
        category: "email",
        dataCollected: ["email addresses", "email content"],
      },
      {
        name: "Laravel Auth",
        category: "auth",
        dataCollected: ["email", "password hashes", "session data", "authentication tokens"],
      },
      {
        name: "Laravel Sessions",
        category: "other",
        dataCollected: ["session cookies", "session data", "CSRF tokens"],
      },
    ],
    conditional: [],
  },

  // Express
  {
    manifestFile: "package.json",
    markerString: "express",
    alwaysPresent: [],
    conditional: [
      {
        marker: "express-session",
        service: {
          name: "express-session",
          category: "other",
          dataCollected: ["session cookies", "session data"],
        },
      },
      {
        marker: "cookie-parser",
        service: {
          name: "cookie-parser",
          category: "other",
          dataCollected: ["cookies", "cookie data"],
        },
      },
    ],
  },
];

/**
 * Detect implicit services provided by full-stack frameworks.
 *
 * When a framework like Rails, Django, or Laravel is detected, many services
 * (database, email, sessions, auth) are available without explicit dependencies
 * because they ship as part of the framework itself.
 */
export function scanFrameworkImplicit(projectPath: string): DetectedService[] {
  const detected: DetectedService[] = [];

  for (const fw of FRAMEWORK_DEFINITIONS) {
    const manifestPath = path.join(projectPath, fw.manifestFile);
    if (!fs.existsSync(manifestPath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(manifestPath, "utf-8");
    } catch {
      continue;
    }

    // Check if the framework marker is present in the manifest
    if (!hasFrameworkMarker(content, fw.markerString, fw.manifestFile)) continue;

    const evidence: Evidence = {
      type: "dependency",
      file: fw.manifestFile,
      detail: `Framework detected: ${fw.markerString}`,
    };

    // Add always-present implicit services
    for (const svc of fw.alwaysPresent) {
      detected.push({
        name: svc.name,
        category: svc.category,
        evidence: [{ ...evidence }],
        dataCollected: [...svc.dataCollected],
      });
    }

    // Add conditional services (only if their marker also appears)
    for (const cond of fw.conditional) {
      if (content.includes(cond.marker)) {
        detected.push({
          name: cond.service.name,
          category: cond.service.category,
          evidence: [
            {
              type: "dependency",
              file: fw.manifestFile,
              detail: `${cond.marker} (via ${fw.markerString})`,
            },
          ],
          dataCollected: [...cond.service.dataCollected],
        });
      }
    }
  }

  return detected;
}

/**
 * Check whether a framework marker is present in a manifest file.
 * Uses format-aware matching to avoid false positives.
 */
function hasFrameworkMarker(content: string, marker: string, manifestFile: string): boolean {
  if (manifestFile === "Gemfile") {
    // Match gem "rails" or gem 'rails' (with optional version constraints)
    const gemPattern = new RegExp(`^\\s*gem\\s+["']${escapeRegex(marker)}["']`, "m");
    return gemPattern.test(content);
  }

  if (manifestFile === "requirements.txt") {
    // Match django or Django (case-insensitive) at start of line, possibly with version spec
    const pipPattern = new RegExp(`^\\s*${escapeRegex(marker)}\\s*([=<>!~]|$)`, "im");
    return pipPattern.test(content);
  }

  if (manifestFile === "composer.json") {
    // JSON: look for the key in require or require-dev
    return content.includes(`"${marker}"`);
  }

  if (manifestFile === "package.json") {
    // JSON: look for the key in dependencies or devDependencies
    return content.includes(`"${marker}"`);
  }

  return content.includes(marker);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
