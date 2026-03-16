import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanInfrastructure } from "./infrastructure.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-infra-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanInfrastructure", () => {
  it("detects Dockerfile exposed ports, ENV instructions, and .env COPY risk", () => {
    const dir = createTempProject({
      "Dockerfile": [
        "FROM node:20-alpine",
        "WORKDIR /app",
        "ENV NODE_ENV=production",
        "ENV DATABASE_URL=postgres://localhost/db",
        "COPY .env .env",
        "COPY package.json .",
        "EXPOSE 3000",
        "EXPOSE 8080/tcp",
        'CMD ["node", "dist/index.js"]',
      ].join("\n"),
    });
    try {
      const result = scanInfrastructure(dir);

      // Should find exposed ports
      const ports = result.findings.filter((f) => f.type === "exposed-port");
      assert.strictEqual(ports.length, 2, "Should detect 2 EXPOSE instructions");
      assert.ok(ports[0].detail.includes("3000"));
      assert.ok(ports[1].detail.includes("8080"));

      // Should find ENV instructions
      const envs = result.findings.filter((f) => f.type === "env-instruction");
      assert.strictEqual(envs.length, 2, "Should detect 2 ENV instructions");
      assert.ok(envs.some((e) => e.detail.includes("NODE_ENV")));
      assert.ok(envs.some((e) => e.detail.includes("DATABASE_URL")));

      // Should find .env COPY risk
      const envCopy = result.findings.filter((f) => f.type === "env-file-copy");
      assert.strictEqual(envCopy.length, 1, "Should detect COPY .env");
      assert.ok(envCopy[0].detail.includes(".env"));

      // COPY .env should produce a required Security Policy compliance need
      const secPolicy = result.complianceNeeds.find((n) => n.document === "Security Policy");
      assert.ok(secPolicy, "Should recommend Security Policy");
      assert.strictEqual(secPolicy.priority, "required");
    } finally {
      cleanup(dir);
    }
  });

  it("detects docker-compose services, volumes, and environment variables", () => {
    const dir = createTempProject({
      "docker-compose.yml": [
        "version: '3.8'",
        "services:",
        "  postgres:",
        "    image: postgres:16",
        "    environment:",
        "      - POSTGRES_USER=app",
        "      - POSTGRES_PASSWORD=secret",
        "    volumes:",
        "      - pgdata:/var/lib/postgresql/data",
        "  redis:",
        "    image: redis:7-alpine",
        "    volumes:",
        "      - redis-data:/data",
        "  app:",
        "    build: .",
        "    environment:",
        "      - DATABASE_URL=postgres://postgres:secret@postgres/app",
        "volumes:",
        "  pgdata:",
        "  redis-data:",
      ].join("\n"),
    });
    try {
      const result = scanInfrastructure(dir);

      // Should detect postgres and redis services
      const services = result.findings.filter((f) => f.type === "compose-service");
      assert.ok(services.length >= 2, `Should detect at least 2 known services, got ${services.length}`);
      assert.ok(services.some((s) => s.detail.toLowerCase().includes("postgres")));
      assert.ok(services.some((s) => s.detail.toLowerCase().includes("redis")));

      // Should detect volume mounts
      const volumes = result.findings.filter((f) => f.type === "compose-volume");
      assert.ok(volumes.length >= 2, `Should detect at least 2 volumes, got ${volumes.length}`);

      // Should detect environment variables
      const envVars = result.findings.filter((f) => f.type === "compose-env-var");
      assert.ok(envVars.length >= 2, `Should detect environment variables, got ${envVars.length}`);

      // Volumes should trigger Data Retention Policy need
      const retention = result.complianceNeeds.find((n) => n.document === "Data Retention Policy");
      assert.ok(retention, "Should recommend Data Retention Policy");
      assert.strictEqual(retention.priority, "recommended");

      // Services should trigger Security Policy need
      const secPolicy = result.complianceNeeds.find((n) => n.document === "Security Policy");
      assert.ok(secPolicy, "Should recommend Security Policy");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Kubernetes Secrets, ConfigMaps, and PersistentVolumeClaims", () => {
    const dir = createTempProject({
      "kubernetes/secrets.yaml": [
        "apiVersion: v1",
        "kind: Secret",
        "metadata:",
        "  name: app-secrets",
        "type: Opaque",
        "data:",
        "  DATABASE_URL: cG9zdGdyZXM6Ly8uLi4=",
        "---",
        "apiVersion: v1",
        "kind: Secret",
        "metadata:",
        "  name: tls-cert",
        "type: kubernetes.io/tls",
        "data:",
        "  tls.crt: LS0tLS1...",
        "  tls.key: LS0tLS1...",
      ].join("\n"),
      "kubernetes/config.yaml": [
        "apiVersion: v1",
        "kind: ConfigMap",
        "metadata:",
        "  name: app-config",
        "data:",
        "  APP_ENV: production",
        "  LOG_LEVEL: info",
      ].join("\n"),
      "kubernetes/storage.yaml": [
        "apiVersion: v1",
        "kind: PersistentVolumeClaim",
        "metadata:",
        "  name: data-pvc",
        "spec:",
        "  accessModes:",
        "    - ReadWriteOnce",
        "  resources:",
        "    requests:",
        "      storage: 10Gi",
      ].join("\n"),
    });
    try {
      const result = scanInfrastructure(dir);

      // Should detect Secrets
      const secrets = result.findings.filter((f) => f.type === "k8s-secret");
      assert.strictEqual(secrets.length, 2, "Should detect 2 Kubernetes Secrets");
      assert.ok(secrets.some((s) => s.detail.includes("app-secrets")));
      assert.ok(secrets.some((s) => s.detail.includes("tls-cert")));

      // Should detect ConfigMap
      const configMaps = result.findings.filter((f) => f.type === "k8s-configmap");
      assert.strictEqual(configMaps.length, 1, "Should detect 1 ConfigMap");
      assert.ok(configMaps[0].detail.includes("app-config"));

      // Should detect PVC
      const pvcs = result.findings.filter((f) => f.type === "k8s-pvc");
      assert.strictEqual(pvcs.length, 1, "Should detect 1 PersistentVolumeClaim");
      assert.ok(pvcs[0].detail.includes("data-pvc"));

      // K8s secrets should trigger Security Policy
      const secPolicy = result.complianceNeeds.find((n) => n.document === "Security Policy");
      assert.ok(secPolicy, "Should recommend Security Policy for k8s secrets");

      // PVC should trigger Data Retention Policy
      const retention = result.complianceNeeds.find((n) => n.document === "Data Retention Policy");
      assert.ok(retention, "Should recommend Data Retention Policy for PVC");
    } finally {
      cleanup(dir);
    }
  });
});
