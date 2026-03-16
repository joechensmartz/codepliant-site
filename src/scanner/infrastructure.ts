import * as fs from "fs";
import * as path from "path";
import type { ComplianceNeed } from "./types.js";

// ── Types ──────────────────────────────────────────────────────────────────

export interface InfraFinding {
  type: InfraFindingType;
  file: string;
  detail: string;
}

export type InfraFindingType =
  | "exposed-port"
  | "env-instruction"
  | "env-file-copy"
  | "compose-service"
  | "compose-volume"
  | "compose-env-var"
  | "k8s-secret"
  | "k8s-configmap"
  | "k8s-pvc";

export interface InfrastructureResult {
  findings: InfraFinding[];
  complianceNeeds: ComplianceNeed[];
}

// ── Dockerfile scanning ─────────────────────────────────────────────────────

const DOCKERFILE_NAMES = ["Dockerfile", "Dockerfile.dev", "Dockerfile.prod", "Dockerfile.staging"];

function scanDockerfiles(projectPath: string): InfraFinding[] {
  const findings: InfraFinding[] = [];

  for (const name of DOCKERFILE_NAMES) {
    const filePath = path.join(projectPath, name);
    if (!fs.existsSync(filePath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    for (const line of content.split("\n")) {
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith("#")) continue;

      // Detect EXPOSE instructions → network services
      const exposeMatch = trimmed.match(/^EXPOSE\s+(.+)/i);
      if (exposeMatch) {
        const ports = exposeMatch[1].trim();
        findings.push({
          type: "exposed-port",
          file: name,
          detail: `Exposed port(s): ${ports}`,
        });
      }

      // Detect ENV instructions → service configuration
      const envMatch = trimmed.match(/^ENV\s+(\S+)/i);
      if (envMatch) {
        findings.push({
          type: "env-instruction",
          file: name,
          detail: `Environment variable: ${envMatch[1]}`,
        });
      }

      // Detect COPY of .env files → secret handling risk
      const copyMatch = trimmed.match(/^COPY\s+(.+)/i);
      if (copyMatch) {
        const args = copyMatch[1];
        if (/\.env\b/.test(args)) {
          findings.push({
            type: "env-file-copy",
            file: name,
            detail: `COPY of .env file: ${args.trim()}`,
          });
        }
      }
    }
  }

  return findings;
}

// ── docker-compose.yml scanning ─────────────────────────────────────────────

const COMPOSE_NAMES = [
  "docker-compose.yml",
  "docker-compose.yaml",
  "compose.yml",
  "compose.yaml",
];

const KNOWN_SERVICES: Record<string, string> = {
  postgres: "PostgreSQL database",
  postgresql: "PostgreSQL database",
  mysql: "MySQL database",
  mariadb: "MariaDB database",
  redis: "Redis cache/store",
  elasticsearch: "Elasticsearch search engine",
  opensearch: "OpenSearch search engine",
  mongodb: "MongoDB database",
  mongo: "MongoDB database",
  rabbitmq: "RabbitMQ message broker",
  kafka: "Apache Kafka message broker",
  zookeeper: "Apache ZooKeeper",
  minio: "MinIO object storage",
  memcached: "Memcached cache",
  nginx: "Nginx reverse proxy",
  traefik: "Traefik reverse proxy",
};

function scanComposeFiles(projectPath: string): InfraFinding[] {
  const findings: InfraFinding[] = [];

  for (const name of COMPOSE_NAMES) {
    const filePath = path.join(projectPath, name);
    if (!fs.existsSync(filePath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    let inServices = false;
    let currentService: string | null = null;
    let inEnvironment = false;
    let inVolumes = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Top-level "services:" key
      if (/^services\s*:/.test(trimmed)) {
        inServices = true;
        currentService = null;
        inEnvironment = false;
        inVolumes = false;
        continue;
      }

      // Another top-level key → stop parsing services
      if (inServices && /^\S/.test(line) && !line.startsWith(" ") && !line.startsWith("\t") && trimmed !== "") {
        if (!trimmed.startsWith("#")) {
          inServices = false;
          currentService = null;
        }
        continue;
      }

      if (!inServices) continue;

      // Detect service name (indented once under services)
      const serviceMatch = line.match(/^[ \t]{2}(\w[\w-]*):\s*$/);
      if (serviceMatch) {
        currentService = serviceMatch[1];
        inEnvironment = false;
        inVolumes = false;

        // Check if service name or image matches known services
        const lowerName = currentService.toLowerCase();
        for (const [key, description] of Object.entries(KNOWN_SERVICES)) {
          if (lowerName.includes(key)) {
            findings.push({
              type: "compose-service",
              file: name,
              detail: `Service "${currentService}": ${description}`,
            });
            break;
          }
        }
        continue;
      }

      // Detect image lines that reveal known services
      if (currentService) {
        const imageMatch = trimmed.match(/^image:\s*["']?(\S+?)["']?\s*$/);
        if (imageMatch) {
          const imageName = imageMatch[1].toLowerCase();
          for (const [key, description] of Object.entries(KNOWN_SERVICES)) {
            if (imageName.includes(key)) {
              // Avoid duplicate if service name already matched
              const alreadyFound = findings.some(
                (f) => f.type === "compose-service" && f.detail.startsWith(`Service "${currentService}"`)
              );
              if (!alreadyFound) {
                findings.push({
                  type: "compose-service",
                  file: name,
                  detail: `Service "${currentService}" (image: ${imageMatch[1]}): ${description}`,
                });
              }
              break;
            }
          }
        }

        // Detect sub-keys
        if (trimmed === "environment:" || trimmed === "environment :") {
          inEnvironment = true;
          inVolumes = false;
          continue;
        }
        if (trimmed === "volumes:" || trimmed === "volumes :") {
          inVolumes = true;
          inEnvironment = false;
          continue;
        }

        // Reset sub-key context on new sibling key
        if (/^[ \t]{4}\w/.test(line) && !trimmed.startsWith("-") && !trimmed.startsWith("#")) {
          if (inEnvironment && !trimmed.includes("=") && !trimmed.startsWith("-")) {
            inEnvironment = false;
          }
          if (inVolumes && !trimmed.startsWith("-")) {
            inVolumes = false;
          }
        }

        // Detect environment variables
        if (inEnvironment && trimmed.startsWith("-")) {
          const envVar = trimmed.slice(1).trim().replace(/^["']|["']$/g, "");
          const envName = envVar.split("=")[0].trim();
          if (envName) {
            findings.push({
              type: "compose-env-var",
              file: name,
              detail: `Service "${currentService}" env: ${envName}`,
            });
          }
        } else if (inEnvironment && trimmed.includes(":") && !trimmed.startsWith("#")) {
          // key: value style environment
          const envName = trimmed.split(":")[0].trim();
          if (envName && /^[A-Z_][A-Z0-9_]*$/i.test(envName)) {
            findings.push({
              type: "compose-env-var",
              file: name,
              detail: `Service "${currentService}" env: ${envName}`,
            });
          }
        }

        // Detect volume mounts
        if (inVolumes && trimmed.startsWith("-")) {
          const volume = trimmed.slice(1).trim().replace(/^["']|["']$/g, "");
          findings.push({
            type: "compose-volume",
            file: name,
            detail: `Service "${currentService}" volume: ${volume}`,
          });
        }
      }
    }
  }

  return findings;
}

// ── Kubernetes YAML scanning ─────────────────────────────────────────────────

function scanKubernetesFiles(projectPath: string): InfraFinding[] {
  const findings: InfraFinding[] = [];

  // Look in common k8s directories
  const k8sDirs = ["kubernetes", "k8s", "deploy", "manifests", ".k8s"];
  const dirsToScan: string[] = [];

  for (const dir of k8sDirs) {
    const fullDir = path.join(projectPath, dir);
    if (fs.existsSync(fullDir) && fs.statSync(fullDir).isDirectory()) {
      dirsToScan.push(fullDir);
    }
  }

  // Also scan root for k8s YAML files
  dirsToScan.push(projectPath);

  const scannedFiles = new Set<string>();

  for (const dir of dirsToScan) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(ya?ml)$/i.test(entry.name)) continue;
      // Skip compose files
      if (COMPOSE_NAMES.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (scannedFiles.has(fullPath)) continue;
      scannedFiles.add(fullPath);

      let content: string;
      try {
        content = fs.readFileSync(fullPath, "utf-8");
      } catch {
        continue;
      }

      const relPath = path.relative(projectPath, fullPath);

      // Detect Kubernetes resource kinds
      // Split on --- for multi-document YAML
      const documents = content.split(/^---\s*$/m);

      for (const doc of documents) {
        // Detect Secret resources
        if (/kind:\s*Secret\b/m.test(doc)) {
          const nameMatch = doc.match(/metadata:\s*\n\s*name:\s*(\S+)/m);
          const secretName = nameMatch ? nameMatch[1] : "unnamed";
          findings.push({
            type: "k8s-secret",
            file: relPath,
            detail: `Kubernetes Secret: ${secretName}`,
          });
        }

        // Detect ConfigMap resources
        if (/kind:\s*ConfigMap\b/m.test(doc)) {
          const nameMatch = doc.match(/metadata:\s*\n\s*name:\s*(\S+)/m);
          const configName = nameMatch ? nameMatch[1] : "unnamed";
          findings.push({
            type: "k8s-configmap",
            file: relPath,
            detail: `Kubernetes ConfigMap: ${configName}`,
          });
        }

        // Detect PersistentVolumeClaim resources
        if (/kind:\s*PersistentVolumeClaim\b/m.test(doc)) {
          const nameMatch = doc.match(/metadata:\s*\n\s*name:\s*(\S+)/m);
          const pvcName = nameMatch ? nameMatch[1] : "unnamed";
          findings.push({
            type: "k8s-pvc",
            file: relPath,
            detail: `Kubernetes PersistentVolumeClaim: ${pvcName}`,
          });
        }
      }
    }
  }

  return findings;
}

// ── Compliance needs derivation ─────────────────────────────────────────────

function deriveInfraComplianceNeeds(findings: InfraFinding[]): ComplianceNeed[] {
  const needs: ComplianceNeed[] = [];
  const addedDocs = new Set<string>();

  const hasExposedPorts = findings.some((f) => f.type === "exposed-port");
  const hasEnvFileCopy = findings.some((f) => f.type === "env-file-copy");
  const hasK8sSecrets = findings.some((f) => f.type === "k8s-secret");
  const hasDataPersistence =
    findings.some((f) => f.type === "compose-volume") ||
    findings.some((f) => f.type === "k8s-pvc");
  const hasComposeServices = findings.some((f) => f.type === "compose-service");

  if (hasExposedPorts || hasComposeServices) {
    needs.push({
      document: "Security Policy",
      reason:
        "Infrastructure configuration exposes network services. A security policy should document network access controls, exposed ports, and service hardening measures.",
      priority: "recommended",
    });
    addedDocs.add("Security Policy");
  }

  if (hasEnvFileCopy) {
    needs.push({
      document: "Security Policy",
      reason:
        "Dockerfile copies .env files into the container image. This risks baking secrets into images. A security policy should address secret management practices.",
      priority: "required",
    });
    // Override the previous recommended with required if both present
    if (addedDocs.has("Security Policy")) {
      // Keep only the required one
      const idx = needs.findIndex((n) => n.document === "Security Policy" && n.priority === "recommended");
      if (idx !== -1) needs.splice(idx, 1);
    }
    addedDocs.add("Security Policy");
  }

  if (hasK8sSecrets) {
    if (!addedDocs.has("Security Policy")) {
      needs.push({
        document: "Security Policy",
        reason:
          "Kubernetes Secret resources detected. A security policy should document how secrets are managed, rotated, and access-controlled.",
        priority: "recommended",
      });
      addedDocs.add("Security Policy");
    }
  }

  if (hasDataPersistence) {
    needs.push({
      document: "Data Retention Policy",
      reason:
        "Infrastructure uses persistent storage (volumes or PersistentVolumeClaims). A data retention policy should document what data is persisted, retention periods, and deletion procedures.",
      priority: "recommended",
    });
  }

  return needs;
}

// ── Main export ──────────────────────────────────────────────────────────────

export function scanInfrastructure(projectPath: string): InfrastructureResult {
  const absPath = path.resolve(projectPath);

  const dockerFindings = scanDockerfiles(absPath);
  const composeFindings = scanComposeFiles(absPath);
  const k8sFindings = scanKubernetesFiles(absPath);

  const findings = [...dockerFindings, ...composeFindings, ...k8sFindings];
  const complianceNeeds = deriveInfraComplianceNeeds(findings);

  return { findings, complianceNeeds };
}
