import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";
import { walkDirectory } from "./file-walker.js";

/**
 * Personal data field patterns to detect in OpenAPI/Swagger schema properties.
 * Maps field name patterns (case-insensitive) to human-readable data category descriptions.
 */
const PERSONAL_DATA_PATTERNS: Array<{
  pattern: RegExp;
  label: string;
  category: string;
}> = [
  { pattern: /^email$/i, label: "email addresses", category: "Contact Information" },
  { pattern: /^phone$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^phoneNumber$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^phone_number$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^name$/i, label: "names", category: "Personal Identity Data" },
  { pattern: /^firstName$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^first_name$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^lastName$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^last_name$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^address$/i, label: "addresses", category: "Contact Information" },
  { pattern: /^ip$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^ipAddress$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^ip_address$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^password$/i, label: "passwords", category: "Authentication Data" },
  { pattern: /^passwordHash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^password_hash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^ssn$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^dateOfBirth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^date_of_birth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^dob$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^avatar$/i, label: "avatar images", category: "Personal Identity Data" },
  { pattern: /^profileImage$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zipCode$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^zip_code$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postalCode$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^postal_code$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^displayName$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^display_name$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^creditCard$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^credit_card$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^cardNumber$/i, label: "credit card numbers", category: "Financial Data" },
  { pattern: /^card_number$/i, label: "credit card numbers", category: "Financial Data" },
  { pattern: /^bankAccount$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^bank_account$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^taxId$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^tax_id$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^socialSecurity$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^social_security$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },
  { pattern: /^locale$/i, label: "locale/language preferences", category: "Personal Identity Data" },
  { pattern: /^timezone$/i, label: "timezone information", category: "Location Data" },
  { pattern: /^deviceId$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^device_id$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^userAgent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^user_agent$/i, label: "user agent strings", category: "Technical Data" },
];

interface DetectedField {
  /** Schema or model name (e.g. "User", "CreateUserRequest") */
  modelName: string;
  fieldName: string;
  label: string;
  category: string;
  /** Relative file path of the spec */
  source: string;
  /** API route info if the field was found in a request body on a specific path */
  route?: string;
}

/**
 * File names to look for when scanning OpenAPI/Swagger specs.
 */
const OPENAPI_FILE_NAMES = new Set([
  "swagger.json",
  "swagger.yaml",
  "swagger.yml",
  "openapi.json",
  "openapi.yaml",
  "openapi.yml",
]);

/**
 * Check if a file name matches the OpenAPI spec naming conventions:
 * - Exact names: swagger.json, swagger.yaml, openapi.json, openapi.yaml, etc.
 * - Glob pattern: *.openapi.json, *.openapi.yaml, *.swagger.json, *.swagger.yaml
 */
function isOpenapiFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  if (OPENAPI_FILE_NAMES.has(lower)) return true;
  if (lower.endsWith(".openapi.json") || lower.endsWith(".openapi.yaml") || lower.endsWith(".openapi.yml")) return true;
  if (lower.endsWith(".swagger.json") || lower.endsWith(".swagger.yaml") || lower.endsWith(".swagger.yml")) return true;
  return false;
}

/**
 * Find OpenAPI/Swagger spec files in the project directory.
 */
function findOpenapiFiles(projectPath: string): string[] {
  const extensions = new Set([".json", ".yaml", ".yml"]);
  const walked = walkDirectory(projectPath, { extensions, skipTests: true });
  const results: string[] = [];
  for (const f of walked) {
    const baseName = path.basename(f.fullPath);
    if (isOpenapiFile(baseName)) {
      results.push(f.fullPath);
    }
  }
  return results;
}

/**
 * Determine if a file is JSON or YAML based on its extension.
 */
function isJsonFile(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".json");
}

/**
 * Simple regex-based JSON value extractor.
 * Extracts property names from JSON object definitions that look like schema properties.
 *
 * Finds patterns like:
 *   "properties": { "email": ..., "name": ... }
 * and returns the property key names.
 */
function extractJsonPropertyNames(content: string): string[] {
  const names: string[] = [];
  // Match "properties" blocks and extract the keys inside them
  const propertiesRegex = /"properties"\s*:\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = propertiesRegex.exec(content)) !== null) {
    const start = match.index + match[0].length;
    const keys = extractKeysFromObjectStart(content, start);
    names.push(...keys);
  }
  return names;
}

/**
 * Starting at `start` (just after a `{`), extract top-level keys from a JSON object.
 * Uses brace-depth tracking to avoid descending into nested objects.
 */
function extractKeysFromObjectStart(content: string, start: number): string[] {
  const keys: string[] = [];
  let depth = 1;
  let i = start;

  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
    } else if (ch === '"' && depth === 1) {
      // We are at the top level of this object; extract the key
      const keyEnd = content.indexOf('"', i + 1);
      if (keyEnd === -1) break;
      const key = content.substring(i + 1, keyEnd);
      keys.push(key);
      // Skip past the value by jumping to after the closing quote
      i = keyEnd;
    }
    i++;
  }

  // Filter out JSON schema keywords that are not field names
  const schemaKeywords = new Set([
    "type", "description", "format", "required", "properties", "items",
    "enum", "default", "example", "minimum", "maximum", "minLength",
    "maxLength", "pattern", "additionalProperties", "allOf", "anyOf",
    "oneOf", "$ref", "nullable", "readOnly", "writeOnly", "title",
  ]);

  return keys.filter(k => !schemaKeywords.has(k));
}

/**
 * Simple regex-based YAML property name extractor.
 * Finds property definitions under `properties:` blocks in YAML OpenAPI specs.
 */
function extractYamlPropertyNames(content: string): string[] {
  const names: string[] = [];
  const lines = content.split("\n");

  let inProperties = false;
  let propertiesIndent = -1;

  for (const line of lines) {
    // Skip comments and empty lines
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#") || trimmed.length === 0) continue;

    const indent = line.length - line.trimStart().length;

    // Detect `properties:` key
    if (/^\s*properties\s*:/.test(line)) {
      inProperties = true;
      propertiesIndent = indent;
      continue;
    }

    if (inProperties) {
      // If we're back at same or lesser indent, we've left the properties block
      if (indent <= propertiesIndent && trimmed.length > 0) {
        inProperties = false;
        propertiesIndent = -1;
        // Check if this line itself starts a new properties block
        if (/^\s*properties\s*:/.test(line)) {
          inProperties = true;
          propertiesIndent = indent;
        }
        continue;
      }

      // Direct children of properties: are field names (one indent level deeper)
      // They look like `        email:` or `        email: ...`
      if (indent === propertiesIndent + 2 || indent === propertiesIndent + 4) {
        const fieldMatch = trimmed.match(/^(\w[\w-]*)\s*:/);
        if (fieldMatch) {
          const key = fieldMatch[1];
          // Exclude YAML/schema keywords
          const schemaKeywords = new Set([
            "type", "description", "format", "required", "properties", "items",
            "enum", "default", "example", "minimum", "maximum", "minLength",
            "maxLength", "pattern", "additionalProperties", "allOf", "anyOf",
            "oneOf", "nullable", "readOnly", "writeOnly", "title",
          ]);
          if (!schemaKeywords.has(key)) {
            names.push(key);
          }
        }
      }
    }
  }

  return names;
}

/**
 * Extract schema/model names and their fields from a JSON OpenAPI spec.
 * Looks for definitions (Swagger 2.0) and components/schemas (OpenAPI 3.x).
 */
function extractJsonModels(content: string): Map<string, string[]> {
  const models = new Map<string, string[]>();

  // Match patterns like: "ModelName": { ... "properties": { ... } }
  // within "definitions", "schemas", or "components" blocks
  const modelRegex = /"(\w+)"\s*:\s*\{[^{}]*"properties"\s*:\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    // Skip if modelName is a schema keyword itself
    if (modelName === "properties" || modelName === "type") continue;

    const propStart = content.indexOf('"properties"', match.index);
    if (propStart === -1) continue;

    const braceStart = content.indexOf("{", propStart + '"properties"'.length);
    if (braceStart === -1) continue;

    const keys = extractKeysFromObjectStart(content, braceStart + 1);
    if (keys.length > 0) {
      const existing = models.get(modelName) ?? [];
      models.set(modelName, [...existing, ...keys]);
    }
  }

  return models;
}

/**
 * Extract schema/model names and their fields from a YAML OpenAPI spec.
 */
function extractYamlModels(content: string): Map<string, string[]> {
  const models = new Map<string, string[]>();
  const lines = content.split("\n");

  let currentModel: string | null = null;
  let modelIndent = -1;
  let inProperties = false;
  let propertiesIndent = -1;

  const schemaKeywords = new Set([
    "type", "description", "format", "required", "properties", "items",
    "enum", "default", "example", "minimum", "maximum", "minLength",
    "maxLength", "pattern", "additionalProperties", "allOf", "anyOf",
    "oneOf", "nullable", "readOnly", "writeOnly", "title",
  ]);

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#") || trimmed.length === 0) continue;

    const indent = line.length - line.trimStart().length;

    // Look for model definitions under definitions/schemas/components
    // Pattern: `  ModelName:` at a certain indent level
    const modelMatch = trimmed.match(/^(\w[\w-]*)\s*:$/);
    if (modelMatch && !schemaKeywords.has(modelMatch[1])) {
      // Could be a model name; track it
      if (!inProperties || indent <= propertiesIndent) {
        inProperties = false;
        propertiesIndent = -1;
        currentModel = modelMatch[1];
        modelIndent = indent;
        continue;
      }
    }

    // Detect `properties:` under the current model
    if (currentModel && /^\s*properties\s*:/.test(line) && indent > modelIndent) {
      inProperties = true;
      propertiesIndent = indent;
      continue;
    }

    // If indent drops to model level or below, reset
    if (currentModel && indent <= modelIndent && trimmed.length > 0) {
      // Check if this is a new model
      const newModelMatch = trimmed.match(/^(\w[\w-]*)\s*:$/);
      if (newModelMatch && !schemaKeywords.has(newModelMatch[1])) {
        currentModel = newModelMatch[1];
        modelIndent = indent;
        inProperties = false;
        propertiesIndent = -1;
        continue;
      }
      currentModel = null;
      modelIndent = -1;
      inProperties = false;
      propertiesIndent = -1;
      continue;
    }

    // Extract field names from properties block
    if (inProperties && currentModel) {
      if (indent <= propertiesIndent && trimmed.length > 0) {
        inProperties = false;
        propertiesIndent = -1;
        continue;
      }

      // Direct children: field definitions
      if (indent === propertiesIndent + 2 || indent === propertiesIndent + 4) {
        const fieldMatch = trimmed.match(/^(\w[\w-]*)\s*:/);
        if (fieldMatch && !schemaKeywords.has(fieldMatch[1])) {
          const existing = models.get(currentModel) ?? [];
          existing.push(fieldMatch[1]);
          models.set(currentModel, existing);
        }
      }
    }
  }

  return models;
}

/**
 * Extract data intake endpoints (POST/PUT/PATCH paths) from a JSON OpenAPI spec.
 * Returns a map of "METHOD /path" to referenced schema field names.
 */
function extractJsonDataEndpoints(content: string): Map<string, string[]> {
  const endpoints = new Map<string, string[]>();

  // Find path + method combos: "paths" > "/route" > "post"|"put"|"patch"
  const pathRegex = /"(\/[^"]*?)"\s*:\s*\{/g;
  let pathMatch: RegExpExecArray | null;

  while ((pathMatch = pathRegex.exec(content)) !== null) {
    const routePath = pathMatch[1];
    const blockStart = pathMatch.index + pathMatch[0].length;

    // Search for methods within a reasonable range
    const searchRange = content.substring(blockStart, blockStart + 5000);
    const methodRegex = /"(post|put|patch)"\s*:\s*\{/gi;
    let methodMatch: RegExpExecArray | null;

    while ((methodMatch = methodRegex.exec(searchRange)) !== null) {
      const method = methodMatch[1].toUpperCase();
      const key = `${method} ${routePath}`;

      // Look for property names in the request body schema near this method
      const methodBlock = searchRange.substring(methodMatch.index, methodMatch.index + 3000);
      const propNames = extractJsonPropertyNames(methodBlock);
      if (propNames.length > 0) {
        endpoints.set(key, propNames);
      }
    }
  }

  return endpoints;
}

/**
 * Extract data intake endpoints from a YAML OpenAPI spec.
 */
function extractYamlDataEndpoints(content: string): Map<string, string[]> {
  const endpoints = new Map<string, string[]>();
  const lines = content.split("\n");

  let currentPath: string | null = null;
  let pathIndent = -1;
  let currentMethod: string | null = null;
  let methodIndent = -1;
  let inRequestBody = false;
  let requestBodyIndent = -1;
  let inProperties = false;
  let propertiesIndent = -1;
  let currentFields: string[] = [];

  const httpMethods = new Set(["post", "put", "patch"]);
  const schemaKeywords = new Set([
    "type", "description", "format", "required", "properties", "items",
    "enum", "default", "example", "minimum", "maximum", "minLength",
    "maxLength", "pattern", "additionalProperties", "allOf", "anyOf",
    "oneOf", "nullable", "readOnly", "writeOnly", "title", "content",
    "application/json", "schema", "requestBody", "$ref", "summary",
    "operationId", "tags", "responses", "parameters",
  ]);

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#") || trimmed.length === 0) continue;

    const indent = line.length - line.trimStart().length;

    // Detect path: `/users:` pattern
    const pathMatch = trimmed.match(/^(\/[^\s:]+)\s*:/);
    if (pathMatch) {
      // Save any pending endpoint
      if (currentPath && currentMethod && currentFields.length > 0) {
        endpoints.set(`${currentMethod.toUpperCase()} ${currentPath}`, [...currentFields]);
      }
      currentPath = pathMatch[1];
      pathIndent = indent;
      currentMethod = null;
      methodIndent = -1;
      inRequestBody = false;
      inProperties = false;
      currentFields = [];
      continue;
    }

    // Detect HTTP method under a path
    if (currentPath !== null) {
      const methodMatch = trimmed.match(/^(post|put|patch|get|delete|head|options)\s*:/i);
      if (methodMatch && indent > pathIndent) {
        // Save any pending endpoint
        if (currentMethod && currentFields.length > 0) {
          endpoints.set(`${currentMethod.toUpperCase()} ${currentPath}`, [...currentFields]);
        }
        const m = methodMatch[1].toLowerCase();
        if (httpMethods.has(m)) {
          currentMethod = m;
          methodIndent = indent;
          inRequestBody = false;
          inProperties = false;
          currentFields = [];
        } else {
          currentMethod = null;
        }
        continue;
      }

      // If we drop back to path indent level, save and reset
      if (indent <= pathIndent && trimmed.length > 0) {
        if (currentMethod && currentFields.length > 0) {
          endpoints.set(`${currentMethod.toUpperCase()} ${currentPath}`, [...currentFields]);
        }
        // Check if this is a new path
        const newPath = trimmed.match(/^(\/[^\s:]+)\s*:/);
        if (newPath) {
          currentPath = newPath[1];
          pathIndent = indent;
          currentMethod = null;
          currentFields = [];
        } else {
          currentPath = null;
          pathIndent = -1;
        }
        currentMethod = null;
        methodIndent = -1;
        inRequestBody = false;
        inProperties = false;
        continue;
      }
    }

    // Detect requestBody
    if (currentMethod && /^\s*requestBody\s*:/.test(line) && indent > methodIndent) {
      inRequestBody = true;
      requestBodyIndent = indent;
      continue;
    }

    // Detect properties within requestBody
    if (inRequestBody && /^\s*properties\s*:/.test(line)) {
      inProperties = true;
      propertiesIndent = indent;
      continue;
    }

    // Extract field names from properties
    if (inProperties && currentMethod) {
      if (indent <= propertiesIndent && trimmed.length > 0) {
        inProperties = false;
        propertiesIndent = -1;
        continue;
      }

      if (indent === propertiesIndent + 2 || indent === propertiesIndent + 4) {
        const fieldMatch = trimmed.match(/^(\w[\w-]*)\s*:/);
        if (fieldMatch && !schemaKeywords.has(fieldMatch[1])) {
          currentFields.push(fieldMatch[1]);
        }
      }
    }
  }

  // Save last pending endpoint
  if (currentPath && currentMethod && currentFields.length > 0) {
    endpoints.set(`${currentMethod.toUpperCase()} ${currentPath}`, [...currentFields]);
  }

  return endpoints;
}

/**
 * Match field names against personal data patterns.
 */
function matchFieldToPattern(fieldName: string): { label: string; category: string } | null {
  for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(fieldName)) {
      return { label, category };
    }
  }
  return null;
}

/**
 * Group detected fields into DataCategory objects, deduplicating by category.
 */
function groupFieldsIntoCategories(fields: DetectedField[]): DataCategory[] {
  const categoryMap = new Map<string, { descriptions: Set<string>; sources: Set<string> }>();

  for (const field of fields) {
    if (!categoryMap.has(field.category)) {
      categoryMap.set(field.category, {
        descriptions: new Set(),
        sources: new Set(),
      });
    }
    const entry = categoryMap.get(field.category)!;
    entry.descriptions.add(field.label);

    const sourceLabel = field.route
      ? `${field.modelName}.${field.fieldName} (${field.route})`
      : `${field.modelName}.${field.fieldName}`;
    entry.sources.add(sourceLabel);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description =
      `${descriptionItems.join(", ")} detected in OpenAPI/Swagger spec fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}

/**
 * Scan OpenAPI/Swagger spec files for data models containing personal data.
 *
 * Finds swagger.json, swagger.yaml, openapi.json, openapi.yaml, and *.openapi.json files.
 * Parses them with regex (no external libraries) to extract:
 * - paths with POST/PUT/PATCH methods (data intake endpoints)
 * - requestBody schemas and their field names
 * - definitions/components/schemas model field names
 *
 * Matches fields against personal data patterns and returns DataCategory[].
 */
export function scanOpenApiSpecs(projectPath: string): DataCategory[] {
  const absPath = path.resolve(projectPath);
  const specFiles = findOpenapiFiles(absPath);

  if (specFiles.length === 0) return [];

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of specFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const relPath = path.relative(absPath, filePath);
    const json = isJsonFile(filePath);

    // 1. Extract models and their field names
    const models = json ? extractJsonModels(content) : extractYamlModels(content);
    for (const [modelName, fields] of models) {
      for (const fieldName of fields) {
        const matched = matchFieldToPattern(fieldName);
        if (matched) {
          allDetectedFields.push({
            modelName,
            fieldName,
            label: matched.label,
            category: matched.category,
            source: relPath,
          });
        }
      }
    }

    // 2. Extract data intake endpoints and their request body fields
    const endpoints = json ? extractJsonDataEndpoints(content) : extractYamlDataEndpoints(content);
    for (const [route, fields] of endpoints) {
      for (const fieldName of fields) {
        const matched = matchFieldToPattern(fieldName);
        if (matched) {
          // Avoid duplicates: only add if not already captured from model definitions
          const alreadyDetected = allDetectedFields.some(
            f => f.fieldName === fieldName && f.source === relPath && f.route === route
          );
          if (!alreadyDetected) {
            allDetectedFields.push({
              modelName: "RequestBody",
              fieldName,
              label: matched.label,
              category: matched.category,
              source: relPath,
              route,
            });
          }
        }
      }
    }
  }

  if (allDetectedFields.length === 0) return [];

  return groupFieldsIntoCategories(allDetectedFields);
}
