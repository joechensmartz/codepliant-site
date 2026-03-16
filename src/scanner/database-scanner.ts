import * as fs from "fs";
import * as path from "path";
import { walkDirectory, ALL_EXTENSIONS, type WalkedFile } from "./file-walker.js";

// ── Types ──────────────────────────────────────────────────────────────────

export type DatabaseType =
  | "postgresql"
  | "mysql"
  | "mongodb"
  | "redis"
  | "sqlite"
  | "dynamodb"
  | "mariadb"
  | "cassandra"
  | "elasticsearch";

export interface DatabaseFinding {
  type: DatabaseType;
  evidence: DatabaseEvidence[];
}

export interface DatabaseEvidence {
  source: "connection-string" | "import" | "docker-compose" | "dependency" | "env-var" | "config-file";
  file: string;
  detail: string;
}

export interface DatabaseScanResult {
  databases: DatabaseFinding[];
}

// ── Detection patterns ─────────────────────────────────────────────────────

interface DatabaseSignature {
  type: DatabaseType;
  /** Patterns to match in import statements or require calls */
  importPatterns: RegExp[];
  /** Patterns to match in connection strings */
  connectionPatterns: RegExp[];
  /** Package names to look for in dependency files */
  dependencyNames: string[];
  /** Env var name patterns */
  envPatterns: RegExp[];
  /** Docker image names */
  dockerImages: string[];
}

const DATABASE_SIGNATURES: DatabaseSignature[] = [
  {
    type: "postgresql",
    importPatterns: [
      /require\s*\(\s*['"]pg['"]\s*\)/,
      /from\s+['"]pg['"]/,
      /import\s+.*['"]pg['"]/,
      /from\s+['"]postgres['"]/,
      /require\s*\(\s*['"]postgres['"]\s*\)/,
      /import\s+psycopg2/,
      /from\s+psycopg2/,
      /import\s+asyncpg/,
    ],
    connectionPatterns: [
      /postgres(?:ql)?:\/\//i,
      /postgresql:\/\//i,
    ],
    dependencyNames: ["pg", "pg-pool", "postgres", "psycopg2", "asyncpg", "pgx", "Npgsql"],
    envPatterns: [
      /POSTGRES/i,
      /PGHOST/i,
      /PGPORT/i,
      /PGDATABASE/i,
      /PGUSER/i,
    ],
    dockerImages: ["postgres", "postgis/postgis", "timescale/timescaledb"],
  },
  {
    type: "mysql",
    importPatterns: [
      /require\s*\(\s*['"]mysql2?['"]\s*\)/,
      /from\s+['"]mysql2?['"]/,
      /import\s+.*['"]mysql2?['"]/,
      /import\s+.*MySQLdb/,
      /import\s+pymysql/,
    ],
    connectionPatterns: [
      /mysql:\/\//i,
    ],
    dependencyNames: ["mysql", "mysql2", "mysqlclient", "pymysql", "go-sql-driver/mysql"],
    envPatterns: [
      /MYSQL_/i,
    ],
    dockerImages: ["mysql", "mysql/mysql-server"],
  },
  {
    type: "mongodb",
    importPatterns: [
      /require\s*\(\s*['"]mongodb['"]\s*\)/,
      /from\s+['"]mongodb['"]/,
      /require\s*\(\s*['"]mongoose['"]\s*\)/,
      /from\s+['"]mongoose['"]/,
      /import\s+pymongo/,
      /from\s+pymongo/,
      /import\s+.*mongosh/,
    ],
    connectionPatterns: [
      /mongodb(?:\+srv)?:\/\//i,
    ],
    dependencyNames: ["mongodb", "mongoose", "pymongo", "mongoid", "mongosh"],
    envPatterns: [
      /MONGO(?:DB)?_/i,
    ],
    dockerImages: ["mongo", "mongodb/mongodb-community-server"],
  },
  {
    type: "redis",
    importPatterns: [
      /require\s*\(\s*['"](?:ioredis|redis)['"]\s*\)/,
      /from\s+['"](?:ioredis|redis)['"]/,
      /from\s+['"]@upstash\/redis['"]/,
      /import\s+redis/,
      /import\s+aioredis/,
    ],
    connectionPatterns: [
      /redis(?:s)?:\/\//i,
    ],
    dependencyNames: ["redis", "ioredis", "@upstash/redis", "aioredis", "go-redis"],
    envPatterns: [
      /REDIS_/i,
      /UPSTASH_REDIS/i,
    ],
    dockerImages: ["redis", "redis/redis-stack", "bitnami/redis"],
  },
  {
    type: "sqlite",
    importPatterns: [
      /require\s*\(\s*['"](?:better-sqlite3|sqlite3)['"]\s*\)/,
      /from\s+['"](?:better-sqlite3|sqlite3)['"]/,
      /import\s+sqlite3/,
      /from\s+['"]@libsql\/client['"]/,
    ],
    connectionPatterns: [
      /sqlite(?:3)?:\/\//i,
      /file:.*\.(?:db|sqlite|sqlite3)/i,
    ],
    dependencyNames: ["better-sqlite3", "sqlite3", "sql.js", "@libsql/client", "turso"],
    envPatterns: [
      /SQLITE_/i,
      /TURSO_/i,
      /LIBSQL_/i,
    ],
    dockerImages: [],
  },
  {
    type: "dynamodb",
    importPatterns: [
      /require\s*\(\s*['"]@aws-sdk\/client-dynamodb['"]\s*\)/,
      /from\s+['"]@aws-sdk\/client-dynamodb['"]/,
      /from\s+['"]@aws-sdk\/lib-dynamodb['"]/,
      /import\s+boto3.*dynamodb/,
    ],
    connectionPatterns: [],
    dependencyNames: [
      "@aws-sdk/client-dynamodb",
      "@aws-sdk/lib-dynamodb",
      "dynamoose",
    ],
    envPatterns: [
      /DYNAMODB_/i,
      /DYNAMO_TABLE/i,
    ],
    dockerImages: ["amazon/dynamodb-local"],
  },
  {
    type: "mariadb",
    importPatterns: [
      /require\s*\(\s*['"]mariadb['"]\s*\)/,
      /from\s+['"]mariadb['"]/,
    ],
    connectionPatterns: [
      /mariadb:\/\//i,
    ],
    dependencyNames: ["mariadb"],
    envPatterns: [
      /MARIADB_/i,
    ],
    dockerImages: ["mariadb"],
  },
  {
    type: "cassandra",
    importPatterns: [
      /require\s*\(\s*['"]cassandra-driver['"]\s*\)/,
      /from\s+['"]cassandra-driver['"]/,
    ],
    connectionPatterns: [],
    dependencyNames: ["cassandra-driver"],
    envPatterns: [
      /CASSANDRA_/i,
    ],
    dockerImages: ["cassandra", "scylladb/scylla"],
  },
  {
    type: "elasticsearch",
    importPatterns: [
      /require\s*\(\s*['"]@elastic\/elasticsearch['"]\s*\)/,
      /from\s+['"]@elastic\/elasticsearch['"]/,
    ],
    connectionPatterns: [],
    dependencyNames: ["@elastic/elasticsearch", "elasticsearch-py"],
    envPatterns: [
      /ELASTIC(?:SEARCH)?_/i,
    ],
    dockerImages: ["elasticsearch", "docker.elastic.co/elasticsearch"],
  },
];

// ── Scanners ───────────────────────────────────────────────────────────────

function scanImportsForDatabases(files: WalkedFile[]): Map<DatabaseType, DatabaseEvidence[]> {
  const results = new Map<DatabaseType, DatabaseEvidence[]>();

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of DATABASE_SIGNATURES) {
      for (const pattern of sig.importPatterns) {
        if (pattern.test(content)) {
          const existing = results.get(sig.type) || [];
          existing.push({
            source: "import",
            file: file.relativePath,
            detail: `Import pattern matched: ${pattern.source}`,
          });
          results.set(sig.type, existing);
          break; // one match per signature per file
        }
      }
    }
  }

  return results;
}

function scanConnectionStrings(files: WalkedFile[]): Map<DatabaseType, DatabaseEvidence[]> {
  const results = new Map<DatabaseType, DatabaseEvidence[]>();

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of DATABASE_SIGNATURES) {
      for (const pattern of sig.connectionPatterns) {
        if (pattern.test(content)) {
          const existing = results.get(sig.type) || [];
          existing.push({
            source: "connection-string",
            file: file.relativePath,
            detail: `Connection string pattern: ${sig.type}://...`,
          });
          results.set(sig.type, existing);
          break;
        }
      }
    }
  }

  return results;
}

function scanDockerCompose(projectPath: string): Map<DatabaseType, DatabaseEvidence[]> {
  const results = new Map<DatabaseType, DatabaseEvidence[]>();
  const composeFiles = ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"];

  for (const composeName of composeFiles) {
    const composePath = path.join(projectPath, composeName);
    if (!fs.existsSync(composePath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(composePath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of DATABASE_SIGNATURES) {
      for (const image of sig.dockerImages) {
        // Match image: postgres, image: postgres:15, image: "postgres:latest"
        const imageRegex = new RegExp(`image:\\s*["']?${image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[:@]|["']|\\s|$)`, "i");
        if (imageRegex.test(content)) {
          const existing = results.get(sig.type) || [];
          existing.push({
            source: "docker-compose",
            file: composeName,
            detail: `Docker image: ${image}`,
          });
          results.set(sig.type, existing);
          break;
        }
      }
    }
  }

  return results;
}

function scanDependencyFiles(projectPath: string): Map<DatabaseType, DatabaseEvidence[]> {
  const results = new Map<DatabaseType, DatabaseEvidence[]>();

  // package.json
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      for (const sig of DATABASE_SIGNATURES) {
        for (const dep of sig.dependencyNames) {
          if (dep in allDeps) {
            const existing = results.get(sig.type) || [];
            existing.push({
              source: "dependency",
              file: "package.json",
              detail: `Dependency: ${dep}@${allDeps[dep]}`,
            });
            results.set(sig.type, existing);
          }
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  // requirements.txt
  const reqPath = path.join(projectPath, "requirements.txt");
  if (fs.existsSync(reqPath)) {
    try {
      const content = fs.readFileSync(reqPath, "utf-8");
      const lines = content.split("\n").map((l) => l.trim().split("==")[0].split(">=")[0].toLowerCase());

      for (const sig of DATABASE_SIGNATURES) {
        for (const dep of sig.dependencyNames) {
          if (lines.includes(dep.toLowerCase())) {
            const existing = results.get(sig.type) || [];
            existing.push({
              source: "dependency",
              file: "requirements.txt",
              detail: `Dependency: ${dep}`,
            });
            results.set(sig.type, existing);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // go.mod
  const goModPath = path.join(projectPath, "go.mod");
  if (fs.existsSync(goModPath)) {
    try {
      const content = fs.readFileSync(goModPath, "utf-8");
      for (const sig of DATABASE_SIGNATURES) {
        for (const dep of sig.dependencyNames) {
          if (content.includes(dep)) {
            const existing = results.get(sig.type) || [];
            existing.push({
              source: "dependency",
              file: "go.mod",
              detail: `Dependency: ${dep}`,
            });
            results.set(sig.type, existing);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Gemfile
  const gemfilePath = path.join(projectPath, "Gemfile");
  if (fs.existsSync(gemfilePath)) {
    try {
      const content = fs.readFileSync(gemfilePath, "utf-8");
      for (const sig of DATABASE_SIGNATURES) {
        for (const dep of sig.dependencyNames) {
          const gemRegex = new RegExp(`gem\\s+['"]${dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]`);
          if (gemRegex.test(content)) {
            const existing = results.get(sig.type) || [];
            existing.push({
              source: "dependency",
              file: "Gemfile",
              detail: `Dependency: ${dep}`,
            });
            results.set(sig.type, existing);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}

function scanEnvForDatabases(projectPath: string): Map<DatabaseType, DatabaseEvidence[]> {
  const results = new Map<DatabaseType, DatabaseEvidence[]>();
  const envFiles = [".env", ".env.local", ".env.example", ".env.development", ".env.production"];

  for (const envFile of envFiles) {
    const envPath = path.join(projectPath, envFile);
    if (!fs.existsSync(envPath)) continue;

    let content: string;
    try {
      content = fs.readFileSync(envPath, "utf-8");
    } catch {
      continue;
    }

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const varName = trimmed.slice(0, eqIdx).trim();

      for (const sig of DATABASE_SIGNATURES) {
        for (const pattern of sig.envPatterns) {
          if (pattern.test(varName)) {
            const existing = results.get(sig.type) || [];
            // Avoid duplicate env var matches
            if (!existing.some((e) => e.detail === `Env var: ${varName}`)) {
              existing.push({
                source: "env-var",
                file: envFile,
                detail: `Env var: ${varName}`,
              });
              results.set(sig.type, existing);
            }
            break;
          }
        }
      }
    }
  }

  return results;
}

// ── Main scan function ─────────────────────────────────────────────────────

function mergeEvidence(
  target: Map<DatabaseType, DatabaseEvidence[]>,
  source: Map<DatabaseType, DatabaseEvidence[]>
): void {
  for (const [type, evidence] of source) {
    const existing = target.get(type) || [];
    existing.push(...evidence);
    target.set(type, existing);
  }
}

export function scanDatabases(projectPath: string): DatabaseScanResult {
  const absPath = path.resolve(projectPath);
  const allFiles = walkDirectory(absPath, { extensions: ALL_EXTENSIONS, skipTests: true });

  const evidenceMap = new Map<DatabaseType, DatabaseEvidence[]>();

  mergeEvidence(evidenceMap, scanDependencyFiles(absPath));
  mergeEvidence(evidenceMap, scanImportsForDatabases(allFiles));
  mergeEvidence(evidenceMap, scanConnectionStrings(allFiles));
  mergeEvidence(evidenceMap, scanDockerCompose(absPath));
  mergeEvidence(evidenceMap, scanEnvForDatabases(absPath));

  const databases: DatabaseFinding[] = [];
  for (const [type, evidence] of evidenceMap) {
    databases.push({ type, evidence });
  }

  // Sort by type name for deterministic output
  databases.sort((a, b) => a.type.localeCompare(b.type));

  return { databases };
}

// ── Privacy policy data storage section ────────────────────────────────────

const DATABASE_DESCRIPTIONS: Record<DatabaseType, string> = {
  postgresql: "PostgreSQL relational database for structured data storage",
  mysql: "MySQL relational database for structured data storage",
  mongodb: "MongoDB document database for flexible data storage",
  redis: "Redis in-memory data store for caching and session management",
  sqlite: "SQLite embedded database for local data storage",
  dynamodb: "Amazon DynamoDB NoSQL database for scalable data storage",
  mariadb: "MariaDB relational database for structured data storage",
  cassandra: "Apache Cassandra distributed database for high-availability storage",
  elasticsearch: "Elasticsearch search engine for indexed data storage and retrieval",
};

const DATABASE_DATA_TYPES: Record<DatabaseType, string[]> = {
  postgresql: ["user records", "relational data", "application state"],
  mysql: ["user records", "relational data", "application state"],
  mongodb: ["user documents", "flexible schema data", "application state"],
  redis: ["session data", "cached user data", "temporary state"],
  sqlite: ["local user data", "application state", "embedded records"],
  dynamodb: ["user records", "key-value data", "application state"],
  mariadb: ["user records", "relational data", "application state"],
  cassandra: ["distributed user data", "time-series data", "high-volume records"],
  elasticsearch: ["indexed user data", "search history", "log data"],
};

export function generateDataStorageSection(result: DatabaseScanResult): string | null {
  if (result.databases.length === 0) return null;

  const lines: string[] = [];
  lines.push("### Data Storage Infrastructure");
  lines.push("");
  lines.push("We use the following database technologies to store and process your data:");
  lines.push("");

  lines.push("| Database | Purpose | Data Types Stored |");
  lines.push("|----------|---------|-------------------|");

  for (const db of result.databases) {
    const desc = DATABASE_DESCRIPTIONS[db.type];
    const dataTypes = DATABASE_DATA_TYPES[db.type].join(", ");
    lines.push(`| ${db.type.charAt(0).toUpperCase() + db.type.slice(1)} | ${desc} | ${dataTypes} |`);
  }
  lines.push("");

  return lines.join("\n");
}
