import * as fs from "fs";
import type { DetectedService, Evidence } from "./types.js";
import { type WalkedFile, ALL_EXTENSIONS, walkDirectory } from "./file-walker.js";

interface CachingSignature {
  name: string;
  patterns: (string | RegExp)[];
  dataCollected: string[];
}

const CACHING_SIGNATURES: CachingSignature[] = [
  {
    name: "Redis (Cache)",
    patterns: [
      /from\s+['"](?:ioredis|redis)['"]/,
      /require\s*\(\s*['"](?:ioredis|redis)['"]\s*\)/,
      /from\s+['"]@upstash\/redis['"]/,
      /import\s+redis\b/,
      /import\s+aioredis\b/,
      /Redis\.new\b/,
      /redis\.createClient\b/,
      /new\s+Redis\b/,
    ],
    dataCollected: [
      "cached user data",
      "session data",
      "temporary state",
      "rate limiting data",
    ],
  },
  {
    name: "Memcached",
    patterns: [
      /from\s+['"]memcached['"]/,
      /require\s*\(\s*['"]memcached['"]\s*\)/,
      /from\s+['"]memjs['"]/,
      /require\s*\(\s*['"]memjs['"]\s*\)/,
      /import\s+memcache\b/,
      /from\s+pymemcache\b/,
      /import\s+pymemcache\b/,
      /Dalli::Client/,
    ],
    dataCollected: [
      "cached user data",
      "session data",
      "temporary state",
    ],
  },
  {
    name: "node-cache",
    patterns: [
      /from\s+['"]node-cache['"]/,
      /require\s*\(\s*['"]node-cache['"]\s*\)/,
      /new\s+NodeCache\b/,
    ],
    dataCollected: [
      "cached user data",
      "in-memory state",
      "temporary data",
    ],
  },
  {
    name: "lru-cache",
    patterns: [
      /from\s+['"]lru-cache['"]/,
      /require\s*\(\s*['"]lru-cache['"]\s*\)/,
      /new\s+LRUCache\b/,
      /new\s+LRU\b/,
    ],
    dataCollected: [
      "cached user data",
      "in-memory state",
      "eviction-based data",
    ],
  },
];

function matchesPattern(content: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") {
    return content.includes(pattern);
  }
  return pattern.test(content);
}

function extractSnippet(content: string, pattern: string | RegExp): string | null {
  if (typeof pattern === "string") {
    const idx = content.indexOf(pattern);
    if (idx === -1) return null;
    const lineStart = content.lastIndexOf("\n", idx) + 1;
    const lineEnd = content.indexOf("\n", idx);
    return content.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim().substring(0, 100);
  }
  const match = pattern.exec(content);
  if (!match) return null;
  const idx = match.index;
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", idx);
  return content.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim().substring(0, 100);
}

/**
 * Scan for caching layer usage. Cached user data is a data retention concern
 * because personal data may persist in caches beyond its intended lifecycle,
 * and cache eviction policies must be documented for compliance.
 */
export function scanCaching(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): DetectedService[] {
  const files = preWalkedFiles
    ? preWalkedFiles.filter(f => ALL_EXTENSIONS.has(f.extension))
    : walkDirectory(projectPath, { extensions: ALL_EXTENSIONS });

  const detected = new Map<string, DetectedService>();

  for (const walkedFile of files) {
    let content: string;
    try {
      content = fs.readFileSync(walkedFile.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of CACHING_SIGNATURES) {
      for (const pattern of sig.patterns) {
        if (matchesPattern(content, pattern)) {
          const snippet = extractSnippet(content, pattern);
          const evidence: Evidence = {
            type: "code_pattern",
            file: walkedFile.relativePath,
            detail: snippet ?? (typeof pattern === "string" ? pattern : pattern.source),
          };

          if (detected.has(sig.name)) {
            const existing = detected.get(sig.name)!;
            if (!existing.evidence.some(e => e.file === walkedFile.relativePath)) {
              existing.evidence.push(evidence);
            }
          } else {
            detected.set(sig.name, {
              name: sig.name,
              category: "database",
              evidence: [evidence],
              dataCollected: [...sig.dataCollected],
              isDataProcessor: false,
            });
          }
          break;
        }
      }
    }
  }

  return Array.from(detected.values());
}
