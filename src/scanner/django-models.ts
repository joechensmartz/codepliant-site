import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Django field types that inherently indicate personal data collection,
 * regardless of field name.
 */
const PERSONAL_FIELD_TYPES: Array<{
  pattern: RegExp;
  label: string;
  category: string;
}> = [
  { pattern: /\bEmailField\b/, label: "email addresses", category: "Contact Information" },
  { pattern: /\bIPAddressField\b/, label: "IP addresses", category: "Technical Data" },
  { pattern: /\bGenericIPAddressField\b/, label: "IP addresses", category: "Technical Data" },
];

/**
 * Django field name patterns (snake_case) that indicate personal data,
 * matched against the field name regardless of field type.
 */
const PERSONAL_NAME_PATTERNS: Array<{
  pattern: RegExp;
  label: string;
  category: string;
  fieldTypes?: RegExp[];
}> = [
  { pattern: /^first_name$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^last_name$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^name$/i, label: "names", category: "Personal Identity Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^display_name$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^phone$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^phone_number$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^mobile_phone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^address$/i, label: "addresses", category: "Contact Information" },
  { pattern: /^street_address$/i, label: "street addresses", category: "Contact Information" },
  { pattern: /^date_of_birth$/i, label: "dates of birth", category: "Personal Identity Data", fieldTypes: [/\bDateField\b/, /\bDateTimeField\b/] },
  { pattern: /^dob$/i, label: "dates of birth", category: "Personal Identity Data", fieldTypes: [/\bDateField\b/, /\bDateTimeField\b/] },
  { pattern: /^birth_date$/i, label: "dates of birth", category: "Personal Identity Data", fieldTypes: [/\bDateField\b/, /\bDateTimeField\b/] },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data", fieldTypes: [/\bTextField\b/] },
  { pattern: /^description$/i, label: "user descriptions", category: "Personal Identity Data", fieldTypes: [/\bTextField\b/] },
  { pattern: /^avatar$/i, label: "avatar images", category: "Personal Identity Data", fieldTypes: [/\bImageField\b/, /\bFileField\b/] },
  { pattern: /^profile_image$/i, label: "profile images", category: "Personal Identity Data", fieldTypes: [/\bImageField\b/, /\bFileField\b/] },
  { pattern: /^photo$/i, label: "user photos", category: "Personal Identity Data", fieldTypes: [/\bImageField\b/, /\bFileField\b/] },
  { pattern: /^profile_picture$/i, label: "profile pictures", category: "Personal Identity Data", fieldTypes: [/\bImageField\b/, /\bFileField\b/] },
  { pattern: /^ip_address$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^password$/i, label: "passwords", category: "Authentication Data" },
  { pattern: /^password_hash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^ssn$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^social_security$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^tax_id$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zip_code$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postal_code$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },
  { pattern: /^credit_card$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bank_account$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^device_id$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^user_agent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^last_login_ip$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^resume$/i, label: "resume uploads", category: "Personal Identity Data", fieldTypes: [/\bFileField\b/] },
  { pattern: /^document$/i, label: "document uploads", category: "Personal Identity Data", fieldTypes: [/\bFileField\b/] },
];

interface DetectedField {
  modelName: string;
  fieldName: string;
  label: string;
  category: string;
}

/**
 * Scans Django models.py files for model definitions containing personal data fields.
 * Recursively searches the project for models.py files and parses Django model classes
 * to detect fields that indicate personal data collection.
 */
export function scanDjangoModels(projectPath: string): DataCategory[] {
  const modelFiles = findDjangoModelFiles(projectPath);

  if (modelFiles.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of modelFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const fields = parseModelsForPersonalData(content);
    allDetectedFields.push(...fields);
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Recursively finds all models.py files in the project, skipping common
 * non-project directories.
 */
function findDjangoModelFiles(projectPath: string): string[] {
  const found: string[] = [];
  const skipDirs = new Set([
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    ".env",
    ".tox",
    "dist",
    "build",
    ".eggs",
    "site-packages",
  ]);

  function walk(dir: string, depth: number) {
    if (depth > 10) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") || entry.name === ".") {
          if (!skipDirs.has(entry.name)) {
            walk(path.join(dir, entry.name), depth + 1);
          }
        }
      } else if (entry.name === "models.py") {
        found.push(path.join(dir, entry.name));
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses Django models.py content and identifies personal data fields within
 * model class definitions.
 */
function parseModelsForPersonalData(content: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentModel: string | null = null;
  let indentLevel = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect class definition: class User(models.Model):
    const classMatch = trimmed.match(
      /^class\s+(\w+)\s*\(.*\bmodels\.Model\b.*\)\s*:/
    );
    if (classMatch) {
      currentModel = classMatch[1];
      // Determine indent level of the class body
      const lineIndent = line.search(/\S/);
      indentLevel = lineIndent;
      continue;
    }

    // Detect any other class definition (end current model parsing)
    if (/^class\s+\w+/.test(trimmed) && currentModel) {
      currentModel = null;
      indentLevel = -1;
      continue;
    }

    // Skip empty lines, comments, and decorators
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("@")) {
      continue;
    }

    // If inside a model, check if we're still in the class body
    if (currentModel) {
      const lineIndent = line.search(/\S/);

      // If line is at same or lower indent than class definition, we've left the class
      if (lineIndent >= 0 && lineIndent <= indentLevel && trimmed.length > 0) {
        currentModel = null;
        indentLevel = -1;

        // Re-check if this is a new model class
        const newClassMatch = trimmed.match(
          /^class\s+(\w+)\s*\(.*\bmodels\.Model\b.*\)\s*:/
        );
        if (newClassMatch) {
          currentModel = newClassMatch[1];
          indentLevel = lineIndent;
        }
        continue;
      }

      // Parse field definition: field_name = models.FieldType(...)
      const fieldMatch = trimmed.match(
        /^(\w+)\s*=\s*models\.(\w+)\s*\(/
      );
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2];
        const fullFieldType = `models.${fieldType}`;

        // Check field type-based detection (e.g., EmailField always means email)
        for (const { pattern, label, category } of PERSONAL_FIELD_TYPES) {
          if (pattern.test(fullFieldType)) {
            detected.push({
              modelName: currentModel,
              fieldName,
              label,
              category,
            });
            break;
          }
        }

        // Check field name-based detection
        for (const { pattern, label, category, fieldTypes } of PERSONAL_NAME_PATTERNS) {
          if (pattern.test(fieldName)) {
            // If fieldTypes constraint exists, verify the field type matches
            if (fieldTypes) {
              const typeMatches = fieldTypes.some((ft) => ft.test(fullFieldType));
              if (!typeMatches) continue;
            }
            detected.push({
              modelName: currentModel,
              fieldName,
              label,
              category,
            });
            break;
          }
        }
      }
    }
  }

  return detected;
}

/**
 * Groups detected fields into DataCategory objects, deduplicating by category.
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
    entry.sources.add(`${field.modelName}.${field.fieldName}`);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description =
      `${descriptionItems.join(", ")} detected in Django model fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
