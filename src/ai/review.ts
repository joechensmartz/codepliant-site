import type { GeneratedDocument } from "../generator/index.js";

/**
 * AI-powered document review — optional, requires an API key.
 *
 * Sends generated compliance documents to Claude or OpenAI for review.
 * Returns suggestions (legal accuracy, missing clauses, unclear language)
 * but never auto-edits. Gracefully skips when no key is configured.
 */

export interface ReviewSuggestion {
  document: string;
  section: string;
  issue: "legal-accuracy" | "missing-clause" | "unclear-language" | "formatting" | "other";
  severity: "high" | "medium" | "low";
  suggestion: string;
}

export interface ReviewResult {
  reviewed: boolean;
  documentName: string;
  suggestions: ReviewSuggestion[];
  error?: string;
}

export interface AIReviewConfig {
  aiReviewApiKey?: string;
  aiReviewModel?: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

const REVIEW_SYSTEM_PROMPT = `You are a compliance document reviewer. Analyze the following legal/compliance document and identify:

1. Legal accuracy issues — incorrect legal references, outdated regulations, wrong terminology
2. Missing clauses — standard clauses that should be present but are missing
3. Unclear language — ambiguous phrasing that could be misinterpreted
4. Formatting issues — structural problems that reduce readability

Return your findings as a JSON array of objects with these fields:
- section: the section name or heading where the issue appears
- issue: one of "legal-accuracy", "missing-clause", "unclear-language", "formatting", "other"
- severity: one of "high", "medium", "low"
- suggestion: a specific, actionable recommendation

Return ONLY a JSON array. No markdown fences, no explanation text.
If the document looks good, return an empty array: []`;

/**
 * Check whether AI review is available (i.e. an API key is configured).
 */
export function isReviewAvailable(config: AIReviewConfig): boolean {
  return typeof config.aiReviewApiKey === "string" && config.aiReviewApiKey.length > 0;
}

/**
 * Review a single generated document using an AI model.
 * Returns suggestions — never modifies the document.
 */
export async function reviewDocument(
  doc: GeneratedDocument,
  config: AIReviewConfig,
): Promise<ReviewResult> {
  if (!isReviewAvailable(config)) {
    return {
      reviewed: false,
      documentName: doc.name,
      suggestions: [],
      error: "No AI review API key configured. Set aiReviewApiKey in .codepliantrc.json to enable.",
    };
  }

  const model = config.aiReviewModel || DEFAULT_MODEL;
  const apiKey = config.aiReviewApiKey!;

  try {
    const responseText = await callAI(apiKey, model, doc.name, doc.content);
    const suggestions = parseSuggestions(responseText, doc.name);

    return {
      reviewed: true,
      documentName: doc.name,
      suggestions,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      reviewed: false,
      documentName: doc.name,
      suggestions: [],
      error: `AI review failed: ${message}`,
    };
  }
}

/**
 * Review all generated documents. Skips gracefully if no API key.
 */
export async function reviewDocuments(
  docs: GeneratedDocument[],
  config: AIReviewConfig,
): Promise<ReviewResult[]> {
  if (!isReviewAvailable(config)) {
    return docs.map((doc) => ({
      reviewed: false,
      documentName: doc.name,
      suggestions: [],
      error: "No AI review API key configured.",
    }));
  }

  const results: ReviewResult[] = [];
  for (const doc of docs) {
    const result = await reviewDocument(doc, config);
    results.push(result);
  }
  return results;
}

/**
 * Format review results as human-readable text.
 */
export function formatReviewResults(results: ReviewResult[]): string {
  const lines: string[] = [];

  const reviewed = results.filter((r) => r.reviewed);
  if (reviewed.length === 0) {
    if (results.length > 0 && results[0].error) {
      lines.push(results[0].error);
    }
    return lines.join("\n");
  }

  for (const result of reviewed) {
    if (result.suggestions.length === 0) {
      lines.push(`${result.documentName}: No issues found.`);
      continue;
    }

    lines.push(`${result.documentName}: ${result.suggestions.length} suggestion(s)`);

    for (const s of result.suggestions) {
      const severityLabel =
        s.severity === "high" ? "[HIGH]" :
        s.severity === "medium" ? "[MED]" :
        "[LOW]";
      lines.push(`  ${severityLabel} ${s.section} (${s.issue})`);
      lines.push(`    ${s.suggestion}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── Internal helpers ──────────────────────────────────────────────────

async function callAI(
  apiKey: string,
  model: string,
  documentName: string,
  documentContent: string,
): Promise<string> {
  // Determine provider from model name
  const isOpenAI = model.startsWith("gpt-") || model.startsWith("o1") || model.startsWith("o3") || model.startsWith("o4");
  const url = isOpenAI
    ? "https://api.openai.com/v1/chat/completions"
    : "https://api.anthropic.com/v1/messages";

  const userMessage = `Review this "${documentName}" compliance document:\n\n${documentContent}`;

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
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
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
      system: REVIEW_SYSTEM_PROMPT,
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

function parseSuggestions(raw: string, documentName: string): ReviewSuggestion[] {
  try {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];

    const validIssues = new Set(["legal-accuracy", "missing-clause", "unclear-language", "formatting", "other"]);
    const validSeverities = new Set(["high", "medium", "low"]);

    return parsed
      .filter(
        (item: Record<string, unknown>) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.section === "string" &&
          typeof item.suggestion === "string",
      )
      .map((item: Record<string, unknown>) => ({
        document: documentName,
        section: String(item.section),
        issue: validIssues.has(String(item.issue)) ? String(item.issue) as ReviewSuggestion["issue"] : "other",
        severity: validSeverities.has(String(item.severity)) ? String(item.severity) as ReviewSuggestion["severity"] : "medium",
        suggestion: String(item.suggestion),
      }));
  } catch {
    return [];
  }
}
