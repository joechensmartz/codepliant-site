import * as fs from "fs";
import type { DetectedService, Evidence } from "./types.js";
import { type WalkedFile, ALL_EXTENSIONS, walkDirectory } from "./file-walker.js";

interface WebSocketSignature {
  name: string;
  patterns: (string | RegExp)[];
  dataCollected: string[];
}

const WEBSOCKET_SIGNATURES: WebSocketSignature[] = [
  {
    name: "Socket.IO",
    patterns: [
      /from\s+['"]socket\.io['"]/,
      /from\s+['"]socket\.io-client['"]/,
      /require\s*\(\s*['"]socket\.io['"]\s*\)/,
      /require\s*\(\s*['"]socket\.io-client['"]\s*\)/,
    ],
    dataCollected: [
      "real-time user data",
      "connection metadata",
      "IP address",
      "WebSocket messages",
    ],
  },
  {
    name: "ws (WebSocket)",
    patterns: [
      /from\s+['"]ws['"]/,
      /require\s*\(\s*['"]ws['"]\s*\)/,
      /new\s+WebSocketServer\b/,
      /new\s+WebSocket\.Server\b/,
    ],
    dataCollected: [
      "real-time user data",
      "connection metadata",
      "IP address",
      "WebSocket messages",
    ],
  },
  {
    name: "NestJS WebSockets",
    patterns: [
      /from\s+['"]@nestjs\/websockets['"]/,
      /from\s+['"]@nestjs\/platform-ws['"]/,
      /from\s+['"]@nestjs\/platform-socket\.io['"]/,
      /@WebSocketGateway\b/,
      /@SubscribeMessage\b/,
    ],
    dataCollected: [
      "real-time user data",
      "connection metadata",
      "IP address",
      "WebSocket messages",
    ],
  },
  {
    name: "ActionCable",
    patterns: [
      /ActionCable/,
      /action_cable/,
      /from\s+['"]@rails\/actioncable['"]/,
      /createConsumer\b/,
      /cable\.subscriptions/,
    ],
    dataCollected: [
      "real-time user data",
      "connection metadata",
      "channel subscriptions",
      "WebSocket messages",
    ],
  },
  {
    name: "Django Channels",
    patterns: [
      /from\s+channels\b/,
      /import\s+channels\b/,
      /channels\.routing/,
      /AsyncWebsocketConsumer/,
      /WebsocketConsumer/,
      /channels\.layers/,
    ],
    dataCollected: [
      "real-time user data",
      "connection metadata",
      "channel group data",
      "WebSocket messages",
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
 * Scan for WebSocket usage patterns that indicate real-time data transmission.
 * Real-time data channels are a privacy concern because user data flows
 * continuously and may not be captured by traditional request-based auditing.
 */
export function scanWebSockets(
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

    for (const sig of WEBSOCKET_SIGNATURES) {
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
              category: "other",
              evidence: [evidence],
              dataCollected: [...sig.dataCollected],
            });
          }
          break;
        }
      }
    }
  }

  return Array.from(detected.values());
}
