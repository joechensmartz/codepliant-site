import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence, ServiceCategory } from "./types.js";
import { type WalkedFile, TRACKING_EXTENSIONS, walkDirectory } from "./file-walker.js";

interface TrackingSignature {
  name: string;
  category: ServiceCategory;
  patterns: (string | RegExp)[];
  dataCollected: string[];
}

const TRACKING_SIGNATURES: TrackingSignature[] = [
  {
    name: "Google Analytics",
    category: "analytics",
    patterns: [
      "gtag(",
      "gtag (",
      "google-analytics.com",
      "GA_MEASUREMENT_ID",
      "googletagmanager",
    ],
    dataCollected: [
      "page views",
      "user behavior",
      "device information",
      "IP address",
      "location data",
    ],
  },
  {
    name: "Meta Pixel",
    category: "advertising",
    patterns: ["fbq(", "fbq (", "connect.facebook.net", "facebook-pixel"],
    dataCollected: [
      "page views",
      "conversion events",
      "user behavior",
      "device information",
    ],
  },
  {
    name: "Hotjar",
    category: "analytics",
    patterns: ["hotjar.com", /\bhj\s*\(/],
    dataCollected: [
      "session recordings",
      "heatmaps",
      "user behavior",
      "form interactions",
    ],
  },
  {
    name: "Microsoft Clarity",
    category: "analytics",
    patterns: ["clarity.ms"],
    dataCollected: [
      "session recordings",
      "heatmaps",
      "user behavior",
      "device information",
    ],
  },
  {
    name: "TikTok Pixel",
    category: "advertising",
    patterns: ["analytics.tiktok.com"],
    dataCollected: [
      "page views",
      "conversion events",
      "user behavior",
      "device information",
    ],
  },
  {
    name: "LinkedIn Insight Tag",
    category: "advertising",
    patterns: ["snap.licdn.com"],
    dataCollected: [
      "page views",
      "conversion events",
      "professional profile data",
      "device information",
    ],
  },
  {
    name: "Twitter/X Pixel",
    category: "advertising",
    patterns: ["static.ads-twitter.com"],
    dataCollected: [
      "page views",
      "conversion events",
      "user behavior",
      "device information",
    ],
  },
  {
    name: "Plausible Analytics",
    category: "analytics",
    patterns: ["plausible.io"],
    dataCollected: ["page views", "referrer data", "device information"],
  },
  {
    name: "Fathom Analytics",
    category: "analytics",
    patterns: ["usefathom.com"],
    dataCollected: ["page views", "referrer data", "device information"],
  },
];

function matchesPattern(content: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") {
    return content.includes(pattern);
  }
  return pattern.test(content);
}

function extractSnippet(
  content: string,
  pattern: string | RegExp
): string | null {
  if (typeof pattern === "string") {
    const idx = content.indexOf(pattern);
    if (idx === -1) return null;
    // Find surrounding line
    const lineStart = content.lastIndexOf("\n", idx) + 1;
    const lineEnd = content.indexOf("\n", idx);
    const line = content
      .substring(lineStart, lineEnd === -1 ? undefined : lineEnd)
      .trim();
    return line.substring(0, 100);
  }
  const match = pattern.exec(content);
  if (!match) return null;
  const idx = match.index;
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", idx);
  const line = content
    .substring(lineStart, lineEnd === -1 ? undefined : lineEnd)
    .trim();
  return line.substring(0, 100);
}

/**
 * Scan files for tracking/analytics code patterns (scripts, pixels, etc).
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanTracking(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): DetectedService[] {
  const files = preWalkedFiles
    ? preWalkedFiles.filter(f => TRACKING_EXTENSIONS.has(f.extension))
    : walkDirectory(projectPath, { extensions: TRACKING_EXTENSIONS });

  const detected = new Map<string, DetectedService>();

  for (const walkedFile of files) {
    let content: string;
    try {
      content = fs.readFileSync(walkedFile.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of TRACKING_SIGNATURES) {
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
            // Avoid duplicate evidence from same file
            if (!existing.evidence.some((e) => e.file === walkedFile.relativePath)) {
              existing.evidence.push(evidence);
            }
          } else {
            detected.set(sig.name, {
              name: sig.name,
              category: sig.category,
              evidence: [evidence],
              dataCollected: [...sig.dataCollected],
            });
          }
          break; // One match per signature per file is enough
        }
      }
    }
  }

  return Array.from(detected.values());
}
