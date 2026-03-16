import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import type { ScanResult, ComplianceNeed } from "../scanner/index.js";

export interface NotificationPayload {
  projectName: string;
  newServices: string[];
  missingDocs: string[];
  complianceScore: number;
  timestamp: string;
}

export interface NotificationResult {
  sent: boolean;
  payload: NotificationPayload;
  error?: string;
}

/**
 * Compute a simple compliance score for notification purposes.
 * Mirrors the logic in cli.ts but works with an output directory.
 */
function computeScore(result: ScanResult, outputDir: string): number {
  if (result.complianceNeeds.length === 0) return 100;

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  function docExists(docName: string): boolean {
    const filenames = docFileMap[docName] || [];
    return filenames.some(f => fs.existsSync(path.join(outputDir, f)));
  }

  let score = 0;
  let total = 0;

  for (const need of result.complianceNeeds) {
    if (!docFileMap[need.document]) continue;
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;
    if (docExists(need.document)) score += weight;
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

/**
 * Determine which compliance documents are missing on disk.
 */
function findMissingDocs(result: ScanResult, outputDir: string): string[] {
  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  const missing: string[] = [];
  for (const need of result.complianceNeeds) {
    const filenames = docFileMap[need.document];
    if (!filenames) continue;
    const exists = filenames.some(f => fs.existsSync(path.join(outputDir, f)));
    if (!exists) missing.push(need.document);
  }
  return missing;
}

/**
 * Build a notification payload from scan results.
 */
export function buildPayload(result: ScanResult, outputDir: string): NotificationPayload {
  const missingDocs = findMissingDocs(result, outputDir);
  const score = computeScore(result, outputDir);

  return {
    projectName: result.projectName,
    newServices: result.services.map(s => s.name),
    missingDocs,
    complianceScore: score,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format payload as a Slack-compatible webhook message.
 */
export function formatSlackMessage(payload: NotificationPayload): { text: string } {
  const parts: string[] = [];

  parts.push(`*Codepliant: ${payload.projectName}*`);

  if (payload.newServices.length > 0) {
    parts.push(`${payload.newServices.length} service(s) detected: ${payload.newServices.join(", ")}`);
  }

  if (payload.missingDocs.length > 0) {
    parts.push(`Missing docs: ${payload.missingDocs.join(", ")}`);
  }

  parts.push(`Compliance score: ${payload.complianceScore}%`);

  return { text: parts.join("\n") };
}

/**
 * POST a JSON payload to a webhook URL using Node built-in http/https modules.
 * Returns a promise that resolves with the HTTP status code.
 */
export function postWebhook(webhookUrl: string, body: object): Promise<number> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(webhookUrl);
    const isHttps = url.protocol === "https:";
    const mod = isHttps ? https : http;

    const req = mod.request(
      {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        // Consume response body to free socket
        res.resume();
        resolve(res.statusCode ?? 0);
      },
    );

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

/**
 * Send a compliance notification to the configured webhook.
 *
 * @param webhookUrl - The URL to POST to (from .codepliantrc.json webhookUrl)
 * @param result - Scan result from codepliant scanner
 * @param outputDir - Absolute path to the output directory
 * @returns NotificationResult with send status and payload
 */
export async function sendNotification(
  webhookUrl: string | undefined,
  result: ScanResult,
  outputDir: string,
): Promise<NotificationResult> {
  const payload = buildPayload(result, outputDir);

  if (!webhookUrl) {
    return { sent: false, payload, error: "No webhookUrl configured" };
  }

  const slackBody = formatSlackMessage(payload);

  try {
    const statusCode = await postWebhook(webhookUrl, slackBody);
    if (statusCode >= 200 && statusCode < 300) {
      return { sent: true, payload };
    }
    return { sent: false, payload, error: `Webhook returned HTTP ${statusCode}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { sent: false, payload, error: message };
  }
}
