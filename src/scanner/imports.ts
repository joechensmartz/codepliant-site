import * as fs from "fs";
import * as path from "path";
import {
  type DetectedService,
  type Evidence,
  SERVICE_SIGNATURES,
} from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Pre-compiled regex cache: built once at module load, reused on every scan.
 * Maps signature name -> array of { jsRegex, pyRegex, goRegex } per import pattern.
 */
interface CompiledPattern {
  jsRegex: RegExp;
  pyRegex: RegExp;
  goRegex: RegExp;
}

const COMPILED_PATTERNS: Map<string, CompiledPattern[]> = new Map();

for (const [sigName, sig] of Object.entries(SERVICE_SIGNATURES)) {
  const patterns: CompiledPattern[] = [];
  for (const pattern of sig.importPatterns) {
    const escaped = escapeRegex(pattern);
    patterns.push({
      jsRegex: new RegExp(
        `^\\s*(?:import\\s+.*\\s+from\\s+|import\\s+|const\\s+\\w+\\s*=\\s*require\\s*\\()\\s*["'\`]${escaped}(?:[/"'\`])`,
        "gm"
      ),
      pyRegex: new RegExp(
        `^\\s*(?:import\\s+${escaped}\\b|from\\s+${escaped}\\s+import)`,
        "gm"
      ),
      goRegex: new RegExp(
        `^\\s*(?:import\\s+)?["'\x60]${escaped}`,
        "gm"
      ),
    });
  }
  COMPILED_PATTERNS.set(sigName, patterns);
}

/**
 * Scan source files for import statements matching known service signatures.
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanImports(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): DetectedService[] {
  const sourceFiles = preWalkedFiles
    ? preWalkedFiles.filter(f => SOURCE_EXTENSIONS.has(f.extension))
    : walkDirectory(projectPath, { extensions: SOURCE_EXTENSIONS, skipTests: true });

  const detected = new Map<string, DetectedService>();

  for (const walkedFile of sourceFiles) {
    let content: string;
    try {
      content = fs.readFileSync(walkedFile.fullPath, "utf-8");
    } catch {
      continue;
    }

    const isGo = walkedFile.extension === ".go";

    for (const [sigName, sig] of Object.entries(SERVICE_SIGNATURES)) {
      const compiledPatterns = COMPILED_PATTERNS.get(sigName)!;

      let matched = false;
      let matchDetail = "";

      for (const cp of compiledPatterns) {
        // Reset lastIndex for reused regexes
        cp.jsRegex.lastIndex = 0;
        cp.pyRegex.lastIndex = 0;

        let importMatch: RegExpExecArray | null = null;

        importMatch = cp.jsRegex.exec(content);
        if (!importMatch) {
          cp.pyRegex.lastIndex = 0;
          importMatch = cp.pyRegex.exec(content);
        }
        if (!importMatch && isGo) {
          cp.goRegex.lastIndex = 0;
          importMatch = cp.goRegex.exec(content);
        }

        if (importMatch) {
          matchDetail = importMatch[0].trim().substring(0, 100);
          matched = true;
          break;
        }
      }

      if (matched) {
        const evidence: Evidence = {
          type: "import",
          file: walkedFile.relativePath,
          detail: matchDetail,
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
      }
    }
  }

  // Framework-implicit detection: auto-flag services implied by framework usage
  applyFrameworkImplicitDetections(detected, sourceFiles);

  return Array.from(detected.values());
}

/**
 * When a framework is detected via dependencies or imports, auto-flag
 * implicit services that the framework always provides.
 */
function applyFrameworkImplicitDetections(
  detected: Map<string, DetectedService>,
  sourceFiles: { fullPath: string; relativePath: string; extension: string }[],
): void {
  // Detect Django: look for settings.py, manage.py, or django imports in source
  const hasDjango = sourceFiles.some((f) => {
    if (f.relativePath.endsWith("settings.py") || f.relativePath.endsWith("manage.py")) {
      return true;
    }
    if (f.extension === ".py") {
      try {
        const content = fs.readFileSync(f.fullPath, "utf-8");
        return /^\s*(?:import\s+django\b|from\s+django\s+import)/m.test(content);
      } catch {
        return false;
      }
    }
    return false;
  });

  if (hasDjango) {
    addImplicitService(detected, "django-sessions", {
      category: "auth",
      dataCollected: ["session cookies", "CSRF tokens"],
      reason: "Django framework includes session middleware and CSRF protection by default",
    });
    addImplicitService(detected, "django-admin", {
      category: "auth",
      dataCollected: ["admin panel access", "staff user accounts"],
      reason: "Django framework includes an admin panel (django.contrib.admin) by default",
    });
  }

  // Detect Rails: look for Gemfile with 'rails' gem or config/application.rb
  const hasRails = sourceFiles.some((f) => {
    if (f.relativePath === "Gemfile" || f.relativePath.endsWith("/Gemfile")) {
      try {
        const content = fs.readFileSync(f.fullPath, "utf-8");
        return /^\s*gem\s+["']rails["']/m.test(content);
      } catch {
        return false;
      }
    }
    if (f.relativePath.endsWith("config/application.rb")) {
      return true;
    }
    return false;
  });

  if (hasRails) {
    addImplicitService(detected, "rails-actionmailer", {
      category: "email",
      dataCollected: ["email addresses", "email content"],
      reason: "Rails framework includes ActionMailer for sending emails",
    });
    addImplicitService(detected, "rails-activerecord", {
      category: "database",
      dataCollected: ["user data as defined in schema"],
      reason: "Rails framework includes ActiveRecord ORM for database access",
    });
    addImplicitService(detected, "rails-sessions", {
      category: "auth",
      dataCollected: ["session cookies", "CSRF tokens"],
      reason: "Rails framework includes session management and CSRF protection by default",
    });
  }
}

function addImplicitService(
  detected: Map<string, DetectedService>,
  name: string,
  info: { category: DetectedService["category"]; dataCollected: string[]; reason: string },
): void {
  if (detected.has(name)) return;

  const evidence: Evidence = {
    type: "code_pattern",
    file: "(framework-implicit)",
    detail: info.reason,
  };

  detected.set(name, {
    name,
    category: info.category,
    evidence: [evidence],
    dataCollected: [...info.dataCollected],
  });
}
