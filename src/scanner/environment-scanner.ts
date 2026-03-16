/**
 * Environment scanner — detects the deployment environment (production, staging,
 * development) from common environment variable patterns across ecosystems.
 *
 * The detected environment affects compliance recommendations:
 * - Production: strictest controls, full compliance documentation required
 * - Staging: moderate controls, pre-production validation
 * - Development: relaxed, informational only
 */

export type DeploymentEnvironment = "production" | "staging" | "development" | "unknown";

export interface EnvironmentDetection {
  /** Detected deployment environment */
  environment: DeploymentEnvironment;
  /** How the environment was detected */
  source: string;
  /** Confidence level */
  confidence: "high" | "medium" | "low";
  /** All environment signals found */
  signals: EnvironmentSignal[];
}

export interface EnvironmentSignal {
  variable: string;
  value: string;
  inferredEnvironment: DeploymentEnvironment;
}

/** Map of environment variable names to their ecosystem context. */
const ENV_VAR_NAMES = [
  // Node.js / general
  "NODE_ENV",
  // Rails
  "RAILS_ENV",
  // Django
  "DJANGO_SETTINGS_MODULE",
  // Flask
  "FLASK_ENV",
  "FLASK_DEBUG",
  // PHP / Laravel
  "APP_ENV",
  // Go
  "GIN_MODE",
  "GO_ENV",
  // Elixir / Phoenix
  "MIX_ENV",
  // Rust
  "RUST_ENV",
  // .NET
  "ASPNETCORE_ENVIRONMENT",
  "DOTNET_ENVIRONMENT",
  // Ruby
  "RACK_ENV",
  // General
  "ENVIRONMENT",
  "ENV",
  "DEPLOY_ENV",
  "APP_ENVIRONMENT",
] as const;

/** Values that indicate production. */
const PRODUCTION_VALUES = new Set([
  "production",
  "prod",
  "release",
  "live",
]);

/** Values that indicate staging. */
const STAGING_VALUES = new Set([
  "staging",
  "stage",
  "preprod",
  "pre-production",
  "uat",
  "qa",
  "test",
  "testing",
]);

/** Values that indicate development. */
const DEVELOPMENT_VALUES = new Set([
  "development",
  "dev",
  "local",
  "debug",
]);

function classifyValue(value: string): DeploymentEnvironment {
  const normalized = value.toLowerCase().trim();

  if (PRODUCTION_VALUES.has(normalized)) return "production";
  if (STAGING_VALUES.has(normalized)) return "staging";
  if (DEVELOPMENT_VALUES.has(normalized)) return "development";

  // Django settings module heuristics
  if (normalized.includes("prod")) return "production";
  if (normalized.includes("stag") || normalized.includes("test")) return "staging";
  if (normalized.includes("dev") || normalized.includes("local")) return "development";

  return "unknown";
}

/**
 * Detect the deployment environment from process.env.
 *
 * Checks common environment variables across Node.js, Rails, Django, Flask,
 * Laravel, Go, Elixir, Rust, and .NET ecosystems.
 */
export function detectEnvironment(): EnvironmentDetection {
  const signals: EnvironmentSignal[] = [];

  for (const varName of ENV_VAR_NAMES) {
    const value = process.env[varName];
    if (value) {
      const inferred = classifyValue(value);
      signals.push({
        variable: varName,
        value,
        inferredEnvironment: inferred,
      });
    }
  }

  // FLASK_DEBUG=1 means development
  if (process.env.FLASK_DEBUG === "1" || process.env.FLASK_DEBUG === "true") {
    const existing = signals.find((s) => s.variable === "FLASK_DEBUG");
    if (existing) {
      existing.inferredEnvironment = "development";
    }
  }

  if (signals.length === 0) {
    return {
      environment: "unknown",
      source: "No environment variables detected",
      confidence: "low",
      signals: [],
    };
  }

  // Priority order: NODE_ENV > RAILS_ENV > DJANGO_SETTINGS_MODULE > etc.
  // Use the first high-confidence signal
  const priorityOrder = [
    "NODE_ENV",
    "RAILS_ENV",
    "DJANGO_SETTINGS_MODULE",
    "FLASK_ENV",
    "APP_ENV",
    "ASPNETCORE_ENVIRONMENT",
    "MIX_ENV",
    "RACK_ENV",
    "GIN_MODE",
    "GO_ENV",
    "RUST_ENV",
    "DOTNET_ENVIRONMENT",
    "ENVIRONMENT",
    "ENV",
    "DEPLOY_ENV",
    "APP_ENVIRONMENT",
  ];

  for (const varName of priorityOrder) {
    const signal = signals.find((s) => s.variable === varName);
    if (signal && signal.inferredEnvironment !== "unknown") {
      return {
        environment: signal.inferredEnvironment,
        source: `${signal.variable}=${signal.value}`,
        confidence: "high",
        signals,
      };
    }
  }

  // Fall back to majority vote among known signals
  const counts: Record<DeploymentEnvironment, number> = {
    production: 0,
    staging: 0,
    development: 0,
    unknown: 0,
  };

  for (const signal of signals) {
    counts[signal.inferredEnvironment]++;
  }

  const best = (Object.entries(counts) as [DeploymentEnvironment, number][])
    .filter(([env]) => env !== "unknown")
    .sort((a, b) => b[1] - a[1])[0];

  if (best && best[1] > 0) {
    return {
      environment: best[0],
      source: `Inferred from ${best[1]} signal(s)`,
      confidence: "medium",
      signals,
    };
  }

  return {
    environment: "unknown",
    source: "Environment variables found but values not recognized",
    confidence: "low",
    signals,
  };
}

/**
 * Returns whether compliance recommendations should be stricter based on environment.
 * Production environments require the strictest controls.
 */
export function isStrictEnvironment(env: DeploymentEnvironment): boolean {
  return env === "production" || env === "unknown";
}

/**
 * Get a human-readable compliance note for the detected environment.
 */
export function getEnvironmentComplianceNote(detection: EnvironmentDetection): string {
  switch (detection.environment) {
    case "production":
      return "Production environment detected. All compliance controls should be enforced at their strictest level.";
    case "staging":
      return "Staging environment detected. Compliance controls should mirror production for validation purposes.";
    case "development":
      return "Development environment detected. Compliance controls are informational. Ensure production deployments enforce all requirements.";
    case "unknown":
      return "Could not detect deployment environment. Defaulting to production-level compliance requirements.";
  }
}
