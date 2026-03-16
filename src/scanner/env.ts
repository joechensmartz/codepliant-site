import * as fs from "fs";
import * as path from "path";
import {
  type DetectedService,
  type Evidence,
  type Ecosystem,
  SERVICE_SIGNATURES,
} from "./types.js";

const ENV_FILES = [".env", ".env.example", ".env.local", ".env.development"];

/**
 * Detect which ecosystems are present in the project based on manifest files.
 */
export function detectEcosystems(projectPath: string): Set<Ecosystem> {
  const ecosystems = new Set<Ecosystem>();

  if (fs.existsSync(path.join(projectPath, "package.json"))) ecosystems.add("js");
  if (
    fs.existsSync(path.join(projectPath, "requirements.txt")) ||
    fs.existsSync(path.join(projectPath, "pyproject.toml")) ||
    fs.existsSync(path.join(projectPath, "Pipfile"))
  ) ecosystems.add("python");
  if (fs.existsSync(path.join(projectPath, "go.mod"))) ecosystems.add("go");
  if (fs.existsSync(path.join(projectPath, "Gemfile"))) ecosystems.add("ruby");
  if (fs.existsSync(path.join(projectPath, "mix.exs"))) ecosystems.add("elixir");
  if (fs.existsSync(path.join(projectPath, "composer.json"))) ecosystems.add("php");
  if (fs.existsSync(path.join(projectPath, "Cargo.toml"))) ecosystems.add("rust");
  if (
    fs.existsSync(path.join(projectPath, "pom.xml")) ||
    fs.existsSync(path.join(projectPath, "build.gradle"))
  ) ecosystems.add("java");
  if (
    fs.existsSync(path.join(projectPath, "*.csproj")) ||
    fs.existsSync(path.join(projectPath, "*.sln"))
  ) ecosystems.add("dotnet");

  return ecosystems;
}

export function scanEnvFiles(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Detect project ecosystems to filter env patterns by ecosystem
  const ecosystems = detectEcosystems(projectPath);

  // Track which env vars have already been claimed by a service.
  // When multiple services share the same env pattern (e.g., SENTRY_DSN matches
  // @sentry/node, @sentry/nextjs, @sentry/react), only the first match wins.
  // This prevents phantom sub-package false positives.
  const claimedEnvVars = new Set<string>();

  for (const envFile of ENV_FILES) {
    const envPath = path.join(projectPath, envFile);

    if (!fs.existsSync(envPath)) {
      continue;
    }

    let content: string;
    try {
      content = fs.readFileSync(envPath, "utf-8");
    } catch {
      continue;
    }

    // Skip binary files (contain null bytes)
    if (content.includes("\0")) {
      continue;
    }

    // Extract all env var names (KEY=value or KEY=)
    const envVars = content
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.split("=")[0].trim())
      .filter(Boolean);

    for (const [sigName, sig] of Object.entries(SERVICE_SIGNATURES)) {
      // Cross-ecosystem filtering: only match env vars against services
      // whose ecosystem matches what's detected in the project.
      // Signatures tagged "any" or untagged always match.
      const sigEcosystem = sig.ecosystem ?? "js";
      if (sigEcosystem !== "any" && ecosystems.size > 0 && !ecosystems.has(sigEcosystem)) {
        continue;
      }

      for (const envPattern of sig.envPatterns) {
        const matchingVar = envVars.find(
          (v) =>
            v === envPattern ||
            v.includes(envPattern)
        );

        if (matchingVar) {
          // If this env var was already claimed by another service, skip
          // to avoid phantom sub-package false positives
          if (claimedEnvVars.has(matchingVar)) {
            break;
          }

          claimedEnvVars.add(matchingVar);

          const evidence: Evidence = {
            type: "env_var",
            file: envFile,
            detail: `${matchingVar}=***`,
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
  }

  return Array.from(detected.values());
}
