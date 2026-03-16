import * as fs from "fs";
import * as path from "path";
import type { DetectedService } from "./types.js";

/**
 * Scans docker-compose.yml for service definitions that may indicate
 * data-processing infrastructure (databases, caches, message queues).
 */
export function scanDockerComposeServices(projectPath: string): DetectedService[] {
  const services: DetectedService[] = [];

  const composeFiles = ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"];

  for (const filename of composeFiles) {
    const filePath = path.join(projectPath, filename);
    if (!fs.existsSync(filePath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Simple pattern-based detection of common services in docker-compose
    const servicePatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
      { pattern: /image:\s*['"]?postgres/i, name: "PostgreSQL", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /image:\s*['"]?mysql/i, name: "MySQL", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /image:\s*['"]?mongo/i, name: "MongoDB", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /image:\s*['"]?redis/i, name: "Redis", category: "database", dataCollected: ["session data", "cache data"] },
      { pattern: /image:\s*['"]?memcached/i, name: "Memcached", category: "database", dataCollected: ["cache data"] },
      { pattern: /image:\s*['"]?elasticsearch/i, name: "Elasticsearch", category: "database", dataCollected: ["search indices", "application logs"] },
      { pattern: /image:\s*['"]?minio/i, name: "MinIO", category: "storage", dataCollected: ["file uploads", "object storage"] },
      { pattern: /image:\s*['"]?rabbitmq/i, name: "RabbitMQ", category: "other", dataCollected: ["message queue data"] },
      { pattern: /image:\s*['"]?mailhog/i, name: "MailHog", category: "email", dataCollected: ["email content"] },
    ];

    for (const sp of servicePatterns) {
      if (sp.pattern.test(content)) {
        services.push({
          name: sp.name,
          category: sp.category,
          evidence: [{ type: "code_pattern", file: filePath, detail: `Found ${sp.name} in ${filename}` }],
          dataCollected: sp.dataCollected,
        });
      }
    }
  }

  return services;
}
