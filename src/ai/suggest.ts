import type { DetectedService } from "../scanner/index.js";

/**
 * AI-powered service detection verification — optional, opt-in only.
 *
 * After scanning, asks an AI model to verify whether detected services
 * are actually data processors. For example, "reqwest" is an HTTP client
 * library, not a data processor — AI can flag it as a false positive.
 *
 * Only runs when explicitly configured with an API key.
 */

export interface ServiceVerification {
  serviceName: string;
  isDataProcessor: boolean;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

export interface SuggestResult {
  verified: boolean;
  verifications: ServiceVerification[];
  error?: string;
}

export interface AISuggestConfig {
  aiReviewApiKey?: string;
  aiReviewModel?: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

const VERIFY_SYSTEM_PROMPT = `You are a software compliance expert. Given a list of detected software dependencies, determine whether each one is a "data processor" — meaning it sends, receives, or stores user data with a third-party service.

Examples:
- "openai" → YES, data processor (sends user data to OpenAI API)
- "stripe" → YES, data processor (processes payment data)
- "reqwest" → NO, it's an HTTP client library (a tool, not a service)
- "zod" → NO, it's a validation library (local only)
- "lodash" → NO, it's a utility library (local only)
- "@tanstack/react-query" → NO, it's a state management library (local only)

For each service, return a JSON array of objects with:
- serviceName: the package/service name
- isDataProcessor: true or false
- confidence: "high", "medium", or "low"
- reasoning: brief explanation (1 sentence)

Return ONLY a JSON array. No markdown fences, no extra text.`;

/**
 * Check whether AI suggestion is available.
 */
export function isSuggestAvailable(config: AISuggestConfig): boolean {
  return typeof config.aiReviewApiKey === "string" && config.aiReviewApiKey.length > 0;
}

/**
 * Verify detected services using AI. Returns verification results
 * indicating whether each service is likely a real data processor.
 */
export async function verifyServices(
  services: DetectedService[],
  config: AISuggestConfig,
): Promise<SuggestResult> {
  if (!isSuggestAvailable(config)) {
    return {
      verified: false,
      verifications: [],
      error: "No AI API key configured. Set aiReviewApiKey in .codepliantrc.json to enable AI verification.",
    };
  }

  if (services.length === 0) {
    return {
      verified: true,
      verifications: [],
    };
  }

  const model = config.aiReviewModel || DEFAULT_MODEL;
  const apiKey = config.aiReviewApiKey!;

  try {
    const serviceList = services.map((s) => ({
      name: s.name,
      category: s.category,
      dataCollected: s.dataCollected,
    }));

    const responseText = await callAI(
      apiKey,
      model,
      `Verify these detected services:\n\n${JSON.stringify(serviceList, null, 2)}`,
    );

    const verifications = parseVerifications(responseText);

    return {
      verified: true,
      verifications,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      verified: false,
      verifications: [],
      error: `AI verification failed: ${message}`,
    };
  }
}

/**
 * Apply AI verification results to the service list.
 * Marks services as non-data-processors if AI identifies them as false positives.
 * Returns the updated services (does not mutate originals).
 */
export function applyVerifications(
  services: DetectedService[],
  verifications: ServiceVerification[],
): DetectedService[] {
  const verificationMap = new Map(verifications.map((v) => [v.serviceName, v]));

  return services.map((service) => {
    const verification = verificationMap.get(service.name);
    if (!verification) return service;

    // Only downgrade (mark as non-processor) — never upgrade
    if (!verification.isDataProcessor && verification.confidence !== "low") {
      return {
        ...service,
        isDataProcessor: false,
      };
    }

    return service;
  });
}

/**
 * Format verification results as human-readable text.
 */
export function formatVerifications(result: SuggestResult): string {
  if (!result.verified) {
    return result.error || "AI verification not available.";
  }

  if (result.verifications.length === 0) {
    return "No services to verify.";
  }

  const lines: string[] = ["AI Service Verification:"];

  const falsePositives = result.verifications.filter((v) => !v.isDataProcessor);
  const confirmed = result.verifications.filter((v) => v.isDataProcessor);

  if (confirmed.length > 0) {
    lines.push(`  Confirmed data processors (${confirmed.length}):`);
    for (const v of confirmed) {
      lines.push(`    ${v.serviceName} [${v.confidence}] — ${v.reasoning}`);
    }
  }

  if (falsePositives.length > 0) {
    lines.push(`  Likely false positives (${falsePositives.length}):`);
    for (const v of falsePositives) {
      lines.push(`    ${v.serviceName} [${v.confidence}] — ${v.reasoning}`);
    }
  }

  return lines.join("\n");
}

// ── Internal helpers ──────────────────────────────────────────────────

async function callAI(
  apiKey: string,
  model: string,
  userMessage: string,
): Promise<string> {
  const isOpenAI = model.startsWith("gpt-") || model.startsWith("o1") || model.startsWith("o3") || model.startsWith("o4");
  const url = isOpenAI
    ? "https://api.openai.com/v1/chat/completions"
    : "https://api.anthropic.com/v1/messages";

  let body: string;
  let headers: Record<string, string>;

  if (isOpenAI) {
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    body = JSON.stringify({
      model,
      messages: [
        { role: "system", content: VERIFY_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });
  } else {
    headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };
    body = JSON.stringify({
      model,
      system: VERIFY_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 4096,
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "unknown error");
    throw new Error(`API returned ${response.status}: ${text}`);
  }

  const json = (await response.json()) as Record<string, unknown>;

  if (isOpenAI) {
    const choices = json.choices as Array<{ message: { content: string } }> | undefined;
    return choices?.[0]?.message?.content || "[]";
  } else {
    const content = json.content as Array<{ text: string }> | undefined;
    return content?.[0]?.text || "[]";
  }
}

function parseVerifications(raw: string): ServiceVerification[] {
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];

    const validConfidence = new Set(["high", "medium", "low"]);

    return parsed
      .filter(
        (item: Record<string, unknown>) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.serviceName === "string" &&
          typeof item.isDataProcessor === "boolean",
      )
      .map((item: Record<string, unknown>) => ({
        serviceName: String(item.serviceName),
        isDataProcessor: Boolean(item.isDataProcessor),
        confidence: validConfidence.has(String(item.confidence))
          ? (String(item.confidence) as ServiceVerification["confidence"])
          : "medium",
        reasoning: typeof item.reasoning === "string" ? item.reasoning : "No reasoning provided.",
      }));
  } catch {
    return [];
  }
}
