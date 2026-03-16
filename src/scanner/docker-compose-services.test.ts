import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDockerComposeServices } from "./docker-compose-services.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanDockerComposeServices", () => {
  it("detects services in compose.override.yml", () => {
    const dir = createTempProject({
      "compose.override.yml": `services:\n  db:\n    image: postgres:15\n`,
    });
    try {
      const result = scanDockerComposeServices(dir);
      assert.ok(result.some(s => s.name === "PostgreSQL"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects nginx, traefik, caddy, and localstack services", () => {
    const dir = createTempProject({
      "docker-compose.yml": [
        "services:",
        "  proxy:",
        "    image: nginx:latest",
        "  lb:",
        "    image: traefik:v2",
        "  web:",
        "    image: caddy:2",
        "  aws:",
        "    image: localstack/localstack",
      ].join("\n"),
    });
    try {
      const result = scanDockerComposeServices(dir);
      assert.ok(result.some(s => s.name === "Nginx"));
      assert.ok(result.some(s => s.name === "Traefik"));
      assert.ok(result.some(s => s.name === "Caddy"));
      assert.ok(result.some(s => s.name === "LocalStack"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects environment variables defined in compose", () => {
    const dir = createTempProject({
      "docker-compose.yml": [
        "services:",
        "  app:",
        "    image: node:18",
        "    environment:",
        "      - SMTP_HOST=smtp.example.com",
        "      - SMTP_PORT=587",
      ].join("\n"),
    });
    try {
      const result = scanDockerComposeServices(dir);
      assert.ok(result.some(s => s.name === "Mail Service (env)"));
    } finally {
      cleanup(dir);
    }
  });
});
