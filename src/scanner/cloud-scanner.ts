import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export type CloudProvider =
  | "aws"
  | "gcp"
  | "azure"
  | "vercel"
  | "railway"
  | "fly-io"
  | "netlify";

export interface CloudDetection {
  provider: CloudProvider;
  displayName: string;
  evidence: CloudEvidence[];
  /** Primary region(s) detected, if any */
  regions: string[];
  /** Known data residency notes for this provider */
  dataResidencyNotes: string;
}

export interface CloudEvidence {
  type: "env_var" | "config_file" | "deployment_file" | "dependency";
  file: string;
  detail: string;
}

export interface CloudScanResult {
  providers: CloudDetection[];
  /** Whether cross-border data transfer is likely (multiple regions or non-EU providers) */
  crossBorderTransferLikely: boolean;
  /** Summary notes for data residency / transfer sections */
  transferNotes: string[];
}

// ── Provider definitions ────────────────────────────────────────────────────

interface ProviderSignature {
  provider: CloudProvider;
  displayName: string;
  envPatterns: string[];
  configFiles: string[];
  deploymentFiles: string[];
  dependencyPatterns: string[];
  regionEnvVars: string[];
  dataResidencyNotes: string;
}

const PROVIDER_SIGNATURES: ProviderSignature[] = [
  {
    provider: "aws",
    displayName: "Amazon Web Services (AWS)",
    envPatterns: [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_REGION",
      "AWS_DEFAULT_REGION",
      "AWS_S3_BUCKET",
      "AWS_LAMBDA_FUNCTION",
      "AWS_SES_REGION",
      "AWS_ACCOUNT_ID",
      "AWS_ENDPOINT_URL",
    ],
    configFiles: [".aws/config", ".aws/credentials", "samconfig.toml", "serverless.yml", "serverless.yaml"],
    deploymentFiles: ["template.yaml", "template.yml", "cdk.json", "cdk.context.json", "buildspec.yml"],
    dependencyPatterns: ["@aws-sdk/", "aws-sdk", "aws-cdk", "@aws-cdk/", "serverless"],
    regionEnvVars: ["AWS_REGION", "AWS_DEFAULT_REGION", "AWS_SES_REGION"],
    dataResidencyNotes:
      "AWS operates data centers in multiple regions worldwide. Data residency depends on selected AWS Region. AWS supports EU Data Residency through EU-based regions (eu-west-1, eu-central-1, etc.). AWS participates in the EU-US Data Privacy Framework.",
  },
  {
    provider: "gcp",
    displayName: "Google Cloud Platform (GCP)",
    envPatterns: [
      "GOOGLE_APPLICATION_CREDENTIALS",
      "GOOGLE_CLOUD_PROJECT",
      "GCLOUD_PROJECT",
      "GCP_PROJECT_ID",
      "GCS_BUCKET",
      "GOOGLE_CLOUD_REGION",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_SERVICE_ACCOUNT",
    ],
    configFiles: ["app.yaml", "app.yml", ".gcloudignore"],
    deploymentFiles: ["cloudbuild.yaml", "cloudbuild.yml"],
    dependencyPatterns: ["@google-cloud/", "firebase-admin", "firebase"],
    regionEnvVars: ["GOOGLE_CLOUD_REGION", "GCLOUD_REGION"],
    dataResidencyNotes:
      "GCP allows data location selection at the project level. EU data residency is available through europe-west regions. Google participates in the EU-US Data Privacy Framework. Firebase may store data in US by default unless configured otherwise.",
  },
  {
    provider: "azure",
    displayName: "Microsoft Azure",
    envPatterns: [
      "AZURE_SUBSCRIPTION_ID",
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_CLIENT_SECRET",
      "AZURE_STORAGE_ACCOUNT",
      "AZURE_STORAGE_CONNECTION_STRING",
      "AZURE_COSMOS_DB_CONNECTION_STRING",
      "APPLICATIONINSIGHTS_CONNECTION_STRING",
    ],
    configFiles: ["azure-pipelines.yml", "azure-pipelines.yaml", ".azure/config"],
    deploymentFiles: ["azuredeploy.json", "azuredeploy.parameters.json", "bicep.config"],
    dependencyPatterns: ["@azure/", "azure-storage-blob", "applicationinsights"],
    regionEnvVars: ["AZURE_REGION", "AZURE_LOCATION"],
    dataResidencyNotes:
      "Azure offers data residency controls via Azure Regions. EU Data Boundary commitments ensure data processing within EU. Microsoft participates in the EU-US Data Privacy Framework.",
  },
  {
    provider: "vercel",
    displayName: "Vercel",
    envPatterns: [
      "VERCEL",
      "VERCEL_URL",
      "VERCEL_ENV",
      "VERCEL_REGION",
      "VERCEL_GIT_COMMIT_SHA",
      "NEXT_PUBLIC_VERCEL_URL",
    ],
    configFiles: ["vercel.json", ".vercelignore"],
    deploymentFiles: [],
    dependencyPatterns: ["@vercel/analytics", "@vercel/speed-insights", "@vercel/og", "@vercel/blob"],
    regionEnvVars: ["VERCEL_REGION"],
    dataResidencyNotes:
      "Vercel deploys to edge locations globally using AWS infrastructure. Serverless Functions execute in a primary region (default: US East). Vercel offers regional configuration for Functions. Data may be processed in multiple regions depending on edge caching.",
  },
  {
    provider: "railway",
    displayName: "Railway",
    envPatterns: [
      "RAILWAY_ENVIRONMENT",
      "RAILWAY_PROJECT_ID",
      "RAILWAY_SERVICE_NAME",
      "RAILWAY_STATIC_URL",
      "RAILWAY_TOKEN",
    ],
    configFiles: ["railway.toml", "railway.json"],
    deploymentFiles: [],
    dependencyPatterns: [],
    regionEnvVars: [],
    dataResidencyNotes:
      "Railway operates primarily on GCP infrastructure. Default deployment region is US. Limited region selection available. Data residency commitments should be confirmed directly with Railway.",
  },
  {
    provider: "fly-io",
    displayName: "Fly.io",
    envPatterns: [
      "FLY_APP_NAME",
      "FLY_REGION",
      "FLY_ALLOC_ID",
      "FLY_PRIMARY_REGION",
    ],
    configFiles: ["fly.toml"],
    deploymentFiles: [],
    dependencyPatterns: [],
    regionEnvVars: ["FLY_REGION", "FLY_PRIMARY_REGION"],
    dataResidencyNotes:
      "Fly.io supports deployment to specific regions worldwide including EU regions. Data residency can be controlled by selecting appropriate regions. Fly Volumes store data in the selected region.",
  },
  {
    provider: "netlify",
    displayName: "Netlify",
    envPatterns: [
      "NETLIFY",
      "NETLIFY_SITE_ID",
      "NETLIFY_AUTH_TOKEN",
      "NETLIFY_BUILD_BASE",
      "DEPLOY_PRIME_URL",
    ],
    configFiles: ["netlify.toml", "netlify.yml"],
    deploymentFiles: [],
    dependencyPatterns: ["@netlify/functions", "@netlify/edge-functions", "netlify-cli"],
    regionEnvVars: [],
    dataResidencyNotes:
      "Netlify deploys static assets to a global CDN. Serverless Functions run in a single region (default: US East). Netlify does not currently offer EU-specific Function regions. Data may be cached at global edge locations.",
  },
];

// ── Scanning logic ──────────────────────────────────────────────────────────

function scanEnvForCloud(projectPath: string): Map<CloudProvider, CloudEvidence[]> {
  const results = new Map<CloudProvider, CloudEvidence[]>();
  const envFiles = [".env", ".env.example", ".env.local", ".env.development", ".env.production"];

  for (const envFile of envFiles) {
    const envPath = path.join(projectPath, envFile);
    if (!fs.existsSync(envPath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(envPath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const varName = trimmed.split("=")[0].trim();

      for (const sig of PROVIDER_SIGNATURES) {
        if (sig.envPatterns.some((p) => varName.startsWith(p) || varName === p)) {
          if (!results.has(sig.provider)) results.set(sig.provider, []);
          results.get(sig.provider)!.push({
            type: "env_var",
            file: envFile,
            detail: `Environment variable: ${varName}`,
          });
        }
      }
    }
  }

  return results;
}

function scanConfigFiles(projectPath: string): Map<CloudProvider, CloudEvidence[]> {
  const results = new Map<CloudProvider, CloudEvidence[]>();

  for (const sig of PROVIDER_SIGNATURES) {
    for (const configFile of sig.configFiles) {
      const filePath = path.join(projectPath, configFile);
      if (fs.existsSync(filePath)) {
        if (!results.has(sig.provider)) results.set(sig.provider, []);
        results.get(sig.provider)!.push({
          type: "config_file",
          file: configFile,
          detail: `Configuration file: ${configFile}`,
        });
      }
    }
    for (const deployFile of sig.deploymentFiles) {
      const filePath = path.join(projectPath, deployFile);
      if (fs.existsSync(filePath)) {
        if (!results.has(sig.provider)) results.set(sig.provider, []);
        results.get(sig.provider)!.push({
          type: "deployment_file",
          file: deployFile,
          detail: `Deployment file: ${deployFile}`,
        });
      }
    }
  }

  return results;
}

function scanDependenciesForCloud(projectPath: string): Map<CloudProvider, CloudEvidence[]> {
  const results = new Map<CloudProvider, CloudEvidence[]>();

  // Check package.json
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      for (const depName of Object.keys(allDeps || {})) {
        for (const sig of PROVIDER_SIGNATURES) {
          if (sig.dependencyPatterns.some((p) => depName.startsWith(p) || depName === p)) {
            if (!results.has(sig.provider)) results.set(sig.provider, []);
            // Avoid duplicates
            const existing = results.get(sig.provider)!;
            if (!existing.some((e) => e.detail.includes(depName))) {
              existing.push({
                type: "dependency",
                file: "package.json",
                detail: `Dependency: ${depName}`,
              });
            }
          }
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  // Check requirements.txt for Python projects
  const reqPath = path.join(projectPath, "requirements.txt");
  if (fs.existsSync(reqPath)) {
    try {
      const content = fs.readFileSync(reqPath, "utf-8");
      const lines = content.split("\n").map((l) => l.trim().split("==")[0].split(">=")[0].split("~=")[0].toLowerCase());
      for (const dep of lines) {
        if (dep.startsWith("boto3") || dep.startsWith("botocore") || dep.startsWith("awscli")) {
          if (!results.has("aws")) results.set("aws", []);
          results.get("aws")!.push({ type: "dependency", file: "requirements.txt", detail: `Dependency: ${dep}` });
        }
        if (dep.startsWith("google-cloud") || dep.startsWith("firebase-admin")) {
          if (!results.has("gcp")) results.set("gcp", []);
          results.get("gcp")!.push({ type: "dependency", file: "requirements.txt", detail: `Dependency: ${dep}` });
        }
        if (dep.startsWith("azure")) {
          if (!results.has("azure")) results.set("azure", []);
          results.get("azure")!.push({ type: "dependency", file: "requirements.txt", detail: `Dependency: ${dep}` });
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}

function extractRegions(projectPath: string, sig: ProviderSignature): string[] {
  const regions = new Set<string>();
  const envFiles = [".env", ".env.example", ".env.local", ".env.production"];

  for (const envFile of envFiles) {
    const envPath = path.join(projectPath, envFile);
    if (!fs.existsSync(envPath)) continue;

    try {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const regionVar of sig.regionEnvVars) {
        const match = content.match(new RegExp(`^${regionVar}=["']?([^"'\\s]+)["']?`, "m"));
        if (match) {
          regions.add(match[1]);
        }
      }
    } catch {
      // ignore
    }
  }

  // Check fly.toml for primary_region
  if (sig.provider === "fly-io") {
    const flyToml = path.join(projectPath, "fly.toml");
    if (fs.existsSync(flyToml)) {
      try {
        const content = fs.readFileSync(flyToml, "utf-8");
        const match = content.match(/primary_region\s*=\s*["']([^"']+)["']/);
        if (match) regions.add(match[1]);
      } catch {
        // ignore
      }
    }
  }

  // Check vercel.json for region configuration
  if (sig.provider === "vercel") {
    const vercelJson = path.join(projectPath, "vercel.json");
    if (fs.existsSync(vercelJson)) {
      try {
        const config = JSON.parse(fs.readFileSync(vercelJson, "utf-8"));
        if (config.regions) {
          for (const r of Array.isArray(config.regions) ? config.regions : [config.regions]) {
            regions.add(r);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return Array.from(regions);
}

// ── Main export ────────────────────────────────────────────────────────────

export function scanCloudProviders(projectPath: string): CloudScanResult {
  const absPath = path.resolve(projectPath);

  const envEvidence = scanEnvForCloud(absPath);
  const configEvidence = scanConfigFiles(absPath);
  const depEvidence = scanDependenciesForCloud(absPath);

  // Merge evidence per provider
  const mergedEvidence = new Map<CloudProvider, CloudEvidence[]>();

  for (const source of [envEvidence, configEvidence, depEvidence]) {
    for (const [provider, evidence] of source) {
      if (!mergedEvidence.has(provider)) mergedEvidence.set(provider, []);
      mergedEvidence.get(provider)!.push(...evidence);
    }
  }

  // Build detections
  const providers: CloudDetection[] = [];

  for (const sig of PROVIDER_SIGNATURES) {
    const evidence = mergedEvidence.get(sig.provider);
    if (!evidence || evidence.length === 0) continue;

    const regions = extractRegions(absPath, sig);

    providers.push({
      provider: sig.provider,
      displayName: sig.displayName,
      evidence,
      regions,
      dataResidencyNotes: sig.dataResidencyNotes,
    });
  }

  // Determine cross-border transfer likelihood
  const allRegions = providers.flatMap((p) => p.regions);
  const hasNonEUProvider = providers.some((p) =>
    ["vercel", "railway", "netlify"].includes(p.provider)
  );
  const hasMultipleRegions = new Set(allRegions).size > 1;
  const hasUSRegion = allRegions.some(
    (r) => r.startsWith("us-") || r === "iad1" || r === "us" || r.startsWith("us_")
  );
  const crossBorderTransferLikely =
    providers.length > 1 || hasNonEUProvider || hasMultipleRegions || hasUSRegion;

  // Build transfer notes
  const transferNotes: string[] = [];
  if (providers.length === 0) {
    transferNotes.push("No cloud providers detected. Data residency analysis not applicable.");
  } else {
    transferNotes.push(
      `Detected ${providers.length} cloud provider(s): ${providers.map((p) => p.displayName).join(", ")}.`
    );
    if (crossBorderTransferLikely) {
      transferNotes.push(
        "Cross-border data transfer is likely. Ensure appropriate transfer mechanisms are in place (Standard Contractual Clauses, EU-US Data Privacy Framework adequacy decision, or Binding Corporate Rules)."
      );
    }
    for (const p of providers) {
      if (p.regions.length > 0) {
        transferNotes.push(`${p.displayName}: detected region(s) — ${p.regions.join(", ")}.`);
      }
    }
  }

  return { providers, crossBorderTransferLikely, transferNotes };
}
