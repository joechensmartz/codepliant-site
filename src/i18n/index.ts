import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_LANGUAGE: SupportedLanguage = "en";

/** Cache loaded translations so each language is read from disk at most once. */
const translationCache = new Map<string, Record<string, string>>();

/**
 * Resolve the translations JSON file for a given language.
 * Checks `__dirname/translations/` first (works with tsx in source tree),
 * then falls back to the `src/i18n/translations/` directory relative to the
 * package root (works when running from compiled `dist/`).
 */
function resolveTranslationPath(lang: string): string | null {
  const candidates = [
    path.join(__dirname, "translations", `${lang}.json`),
    path.resolve(__dirname, "..", "..", "src", "i18n", "translations", `${lang}.json`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function loadTranslation(lang: string): Record<string, string> {
  const cached = translationCache.get(lang);
  if (cached) return cached;

  const filePath = resolveTranslationPath(lang);
  if (!filePath) {
    // Fall back to English if the requested language file doesn't exist
    if (lang !== DEFAULT_LANGUAGE) {
      return loadTranslation(DEFAULT_LANGUAGE);
    }
    return {};
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, string>;
    translationCache.set(lang, data);
    return data;
  } catch {
    if (lang !== DEFAULT_LANGUAGE) {
      return loadTranslation(DEFAULT_LANGUAGE);
    }
    return {};
  }
}

/**
 * Translate a key to the specified language.
 *
 * Supports placeholder interpolation with `{name}` syntax — pass
 * replacements as the third argument.
 *
 * Falls back to English when the key is missing in the target language,
 * and returns the raw key if it is missing everywhere.
 */
export function t(
  key: string,
  lang: string,
  replacements?: Record<string, string>
): string {
  const effectiveLang = isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

  const translations = loadTranslation(effectiveLang);
  let value = translations[key];

  // Fall back to English
  if (value === undefined && effectiveLang !== DEFAULT_LANGUAGE) {
    const enTranslations = loadTranslation(DEFAULT_LANGUAGE);
    value = enTranslations[key];
  }

  // If still missing, return the key itself
  if (value === undefined) {
    return key;
  }

  // Apply placeholder replacements
  if (replacements) {
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      value = value.replaceAll(`{${placeholder}}`, replacement);
    }
  }

  return value;
}

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

/**
 * Clear the translation cache.  Useful for testing.
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}
