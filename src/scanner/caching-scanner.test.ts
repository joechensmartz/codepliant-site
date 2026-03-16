import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanCaching } from "./caching-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-cache-"));
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

describe("caching-scanner", () => {
  it("detects Redis caching usage", () => {
    const dir = createTempProject({
      "lib/cache.ts": `
        import Redis from 'ioredis';
        const redis = new Redis(process.env.REDIS_URL);
        export async function getUser(id: string) {
          const cached = await redis.get(\`user:\${id}\`);
          return cached ? JSON.parse(cached) : null;
        }
      `,
    });
    try {
      const result = scanCaching(dir);
      const redis = result.find(s => s.name === "Redis (Cache)");
      assert.ok(redis, "Should detect Redis caching");
      assert.strictEqual(redis.category, "database");
      assert.ok(redis.dataCollected.includes("cached user data"));
      assert.ok(redis.evidence.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects lru-cache usage", () => {
    const dir = createTempProject({
      "utils/cache.ts": `
        import { LRUCache } from 'lru-cache';
        const cache = new LRUCache({ max: 500 });
        export function getCachedResult(key: string) {
          return cache.get(key);
        }
      `,
    });
    try {
      const result = scanCaching(dir);
      const lru = result.find(s => s.name === "lru-cache");
      assert.ok(lru, "Should detect lru-cache");
      assert.ok(lru.dataCollected.includes("in-memory state"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no caching found", () => {
    const dir = createTempProject({
      "index.ts": `
        import express from 'express';
        const app = express();
        app.get('/', (req, res) => res.send('Hello'));
      `,
    });
    try {
      const result = scanCaching(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
