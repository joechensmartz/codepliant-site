import * as fs from "fs";
import * as path from "path";
import type { DetectedService } from "./types.js";

/**
 * Scans docker-compose.yml for service definitions that may indicate
 * data-processing infrastructure (databases, caches, message queues).
 */
export function scanDockerComposeServices(projectPath: string): DetectedService[] {
  const services: DetectedService[] = [];

  const composeFiles = [
    "docker-compose.yml", "docker-compose.yaml",
    "compose.yml", "compose.yaml",
    "docker-compose.override.yml", "docker-compose.override.yaml",
    "compose.override.yml", "compose.override.yaml",
  ];

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
      { pattern: /image:\s*['"]?nginx/i, name: "Nginx", category: "other", dataCollected: ["access logs", "request metadata", "IP addresses"] },
      { pattern: /image:\s*['"]?traefik/i, name: "Traefik", category: "other", dataCollected: ["access logs", "request metadata", "IP addresses"] },
      { pattern: /image:\s*['"]?caddy/i, name: "Caddy", category: "other", dataCollected: ["access logs", "request metadata", "IP addresses"] },
      { pattern: /image:\s*['"]?localstack/i, name: "LocalStack", category: "other", dataCollected: ["emulated AWS service data"] },
    ];

    // Detect environment variables defined in compose services
    const envPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
      { pattern: /environment:[\s\S]*?(?:POSTGRES_|PGHOST|PGUSER)/m, name: "PostgreSQL (env)", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /environment:[\s\S]*?MYSQL_/m, name: "MySQL (env)", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /environment:[\s\S]*?MONGO_/m, name: "MongoDB (env)", category: "database", dataCollected: ["application data", "user records"] },
      { pattern: /environment:[\s\S]*?REDIS_/m, name: "Redis (env)", category: "database", dataCollected: ["session data", "cache data"] },
      { pattern: /environment:[\s\S]*?(?:AWS_ACCESS_KEY|AWS_SECRET|AWS_REGION)/m, name: "AWS", category: "storage", dataCollected: ["cloud service data"] },
      { pattern: /environment:[\s\S]*?(?:SMTP_|MAIL_HOST|MAIL_PORT)/m, name: "Mail Service (env)", category: "email", dataCollected: ["email configuration"] },
    ];

    for (const ep of envPatterns) {
      if (ep.pattern.test(content)) {
        // Avoid duplicating if already detected via image pattern
        const alreadyDetected = services.some(s => s.name.toLowerCase().startsWith(ep.name.split(" ")[0].toLowerCase()));
        if (!alreadyDetected) {
          services.push({
            name: ep.name,
            category: ep.category,
            evidence: [{ type: "code_pattern", file: filePath, detail: `Found ${ep.name} environment vars in ${filename}` }],
            dataCollected: ep.dataCollected,
          });
        }
      }
    }

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
