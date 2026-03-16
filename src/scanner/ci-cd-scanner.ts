import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CiCdPlatform {
  name: string;
  configFile: string;
  features: string[];
  /** Additional detail extracted from config files (e.g. workflow names) */
  detail?: string[];
}

export interface CiCdScanResult {
  platforms: CiCdPlatform[];
  hasVersionControl: boolean;
  vcsProvider: string | null;
  /** High-level summary flags */
  hasAutomatedTests: boolean;
  hasDeploymentPipeline: boolean;
  hasSecurityScanning: boolean;
  hasDependencyUpdates: boolean;
}

// ── Platform signatures ────────────────────────────────────────────────────

interface CiCdSignature {
  name: string;
  /** Files or directories to check for existence */
  paths: string[];
  features: string[];
  /** If true, the path is a directory — list its contents for detail */
  isDirectory?: boolean;
}

const CI_CD_SIGNATURES: CiCdSignature[] = [
  {
    name: "GitHub Actions",
    paths: [".github/workflows"],
    features: [
      "Automated workflows",
      "PR checks",
      "Deployment pipelines",
      "Branch protection integration",
      "Secrets management",
    ],
    isDirectory: true,
  },
  {
    name: "GitLab CI",
    paths: [".gitlab-ci.yml"],
    features: [
      "Pipeline stages",
      "Merge request checks",
      "Environment deployments",
      "Auto DevOps",
      "Container registry",
    ],
  },
  {
    name: "CircleCI",
    paths: [".circleci/config.yml"],
    features: [
      "Workflow orchestration",
      "Parallel testing",
      "Docker layer caching",
      "Approval jobs",
    ],
  },
  {
    name: "Jenkins",
    paths: ["Jenkinsfile"],
    features: [
      "Pipeline stages",
      "Build agents",
      "Deployment gates",
      "Artifact management",
    ],
  },
  {
    name: "Travis CI",
    paths: [".travis.yml"],
    features: ["Build matrix", "Deployment providers", "Branch filtering"],
  },
  {
    name: "Azure Pipelines",
    paths: ["azure-pipelines.yml"],
    features: [
      "Multi-stage pipelines",
      "Approval gates",
      "Environment deployments",
    ],
  },
  {
    name: "Vercel",
    paths: ["vercel.json"],
    features: [
      "Preview deployments",
      "Production deployments",
      "Environment variables",
      "Edge functions",
    ],
  },
  {
    name: "Netlify",
    paths: ["netlify.toml"],
    features: [
      "Build plugins",
      "Deploy previews",
      "Branch deploys",
      "Split testing",
    ],
  },
  {
    name: "Docker",
    paths: ["Dockerfile", "docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"],
    features: ["Container builds", "Multi-stage builds", "Service orchestration"],
  },
  {
    name: "Kubernetes",
    paths: ["k8s", "kubernetes", "kustomization.yaml", "helm"],
    features: [
      "Rolling deployments",
      "Rollback support",
      "Health checks",
      "Horizontal scaling",
    ],
  },
  {
    name: "Terraform",
    paths: ["main.tf", "terraform"],
    features: [
      "Infrastructure as Code",
      "Plan/Apply workflow",
      "State management",
      "Drift detection",
    ],
  },
  {
    name: "Bitbucket Pipelines",
    paths: ["bitbucket-pipelines.yml"],
    features: [
      "Pipeline steps",
      "Deployment environments",
      "Parallel steps",
      "Caching",
    ],
  },
  {
    name: "AWS CodePipeline",
    paths: ["buildspec.yml", "appspec.yml"],
    features: [
      "Build and deploy pipeline",
      "CodeBuild integration",
      "CodeDeploy integration",
    ],
  },
];

// ── Scanning helpers ───────────────────────────────────────────────────────

/**
 * Reads GitHub Actions workflow files and extracts workflow names and
 * common security/test patterns.
 */
function analyzeGitHubWorkflows(
  projectPath: string
): { workflowNames: string[]; hasTests: boolean; hasSecurity: boolean; hasDependabot: boolean } {
  const workflowDir = path.join(projectPath, ".github", "workflows");
  const result = { workflowNames: [] as string[], hasTests: false, hasSecurity: false, hasDependabot: false };

  // Check for Dependabot config
  if (fs.existsSync(path.join(projectPath, ".github", "dependabot.yml")) ||
      fs.existsSync(path.join(projectPath, ".github", "dependabot.yaml"))) {
    result.hasDependabot = true;
  }

  if (!fs.existsSync(workflowDir)) return result;

  try {
    const entries = fs.readdirSync(workflowDir);
    for (const entry of entries) {
      if (!entry.endsWith(".yml") && !entry.endsWith(".yaml")) continue;

      const filePath = path.join(workflowDir, entry);
      try {
        const content = fs.readFileSync(filePath, "utf-8");

        // Extract workflow name
        const nameMatch = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
        if (nameMatch) {
          result.workflowNames.push(nameMatch[1]);
        } else {
          result.workflowNames.push(entry.replace(/\.ya?ml$/, ""));
        }

        // Detect test patterns
        if (/\b(npm\s+test|yarn\s+test|pnpm\s+test|jest|vitest|mocha|pytest|go\s+test)\b/i.test(content)) {
          result.hasTests = true;
        }

        // Detect security scanning
        if (/\b(codeql|snyk|trivy|semgrep|dependabot|security|audit|sonar)\b/i.test(content)) {
          result.hasSecurity = true;
        }
      } catch {
        // skip unreadable workflow files
      }
    }
  } catch {
    // skip unreadable directory
  }

  return result;
}

/**
 * Checks a CI config file for common test/security patterns.
 */
function analyzeConfigContent(
  projectPath: string,
  filePath: string
): { hasTests: boolean; hasSecurity: boolean } {
  const result = { hasTests: false, hasSecurity: false };
  const fullPath = path.join(projectPath, filePath);
  if (!fs.existsSync(fullPath)) return result;

  try {
    const content = fs.readFileSync(fullPath, "utf-8");
    if (/\b(test|spec|jest|vitest|mocha|pytest|go\s+test|rspec)\b/i.test(content)) {
      result.hasTests = true;
    }
    if (/\b(codeql|snyk|trivy|semgrep|audit|sonar|security|sast|dast)\b/i.test(content)) {
      result.hasSecurity = true;
    }
  } catch {
    // ignore
  }

  return result;
}

// ── Main scan function ─────────────────────────────────────────────────────

/**
 * Scans the project for CI/CD platforms, version control, and
 * common pipeline features (tests, security scanning, dependency updates).
 */
export function scanCiCd(projectPath: string): CiCdScanResult {
  const absPath = path.resolve(projectPath);

  const platforms: CiCdPlatform[] = [];
  let hasAutomatedTests = false;
  let hasSecurityScanning = false;
  let hasDependencyUpdates = false;
  let hasDeploymentPipeline = false;

  // Detect CI/CD platforms
  for (const sig of CI_CD_SIGNATURES) {
    for (const p of sig.paths) {
      const fullPath = path.join(absPath, p);
      if (!fs.existsSync(fullPath)) continue;

      const platform: CiCdPlatform = {
        name: sig.name,
        configFile: p,
        features: [...sig.features],
      };

      // Platform-specific analysis
      if (sig.name === "GitHub Actions") {
        const analysis = analyzeGitHubWorkflows(absPath);
        if (analysis.workflowNames.length > 0) {
          platform.detail = analysis.workflowNames.map((n) => `Workflow: ${n}`);
        }
        if (analysis.hasTests) hasAutomatedTests = true;
        if (analysis.hasSecurity) hasSecurityScanning = true;
        if (analysis.hasDependabot) hasDependencyUpdates = true;
        hasDeploymentPipeline = true;
      } else if (sig.name === "GitLab CI" || sig.name === "CircleCI" || sig.name === "Jenkins") {
        const analysis = analyzeConfigContent(absPath, p);
        if (analysis.hasTests) hasAutomatedTests = true;
        if (analysis.hasSecurity) hasSecurityScanning = true;
        hasDeploymentPipeline = true;
      } else if (
        sig.name === "Vercel" ||
        sig.name === "Netlify" ||
        sig.name === "Kubernetes" ||
        sig.name === "Docker"
      ) {
        hasDeploymentPipeline = true;
      }

      platforms.push(platform);
      break; // one match per platform
    }
  }

  // Check for Renovate / Dependabot outside GitHub Actions
  if (!hasDependencyUpdates) {
    const renovateFiles = ["renovate.json", "renovate.json5", ".renovaterc", ".renovaterc.json"];
    for (const f of renovateFiles) {
      if (fs.existsSync(path.join(absPath, f))) {
        hasDependencyUpdates = true;
        break;
      }
    }
  }

  // Version control detection
  const hasGit = fs.existsSync(path.join(absPath, ".git"));
  let vcsProvider: string | null = null;
  if (hasGit) {
    vcsProvider = "Git";
    if (fs.existsSync(path.join(absPath, ".github"))) {
      vcsProvider = "GitHub";
    } else if (fs.existsSync(path.join(absPath, ".gitlab-ci.yml"))) {
      vcsProvider = "GitLab";
    }
  }

  return {
    platforms,
    hasVersionControl: hasGit,
    vcsProvider,
    hasAutomatedTests,
    hasDeploymentPipeline,
    hasSecurityScanning,
    hasDependencyUpdates,
  };
}
