import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Personal data field patterns to detect in Go struct definitions.
 * Go uses PascalCase or camelCase field names; patterns are case-insensitive.
 * Aligned with the same field set used by the Prisma schema scanner.
 */
const PERSONAL_DATA_PATTERNS: Array<{
  pattern: RegExp;
  label: string;
  category: string;
}> = [
  { pattern: /^email$/i, label: "email addresses", category: "Contact Information" },
  { pattern: /^phone$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^phoneNumber$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^mobilePhone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^name$/i, label: "names", category: "Personal Identity Data" },
  { pattern: /^firstName$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^lastName$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^displayName$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^address$/i, label: "addresses", category: "Contact Information" },
  { pattern: /^streetAddress$/i, label: "street addresses", category: "Contact Information" },
  { pattern: /^ip$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^ipAddress$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^lastLoginIP$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^password$/i, label: "passwords", category: "Authentication Data" },
  { pattern: /^passwordHash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^twoFactorSecret$/i, label: "two-factor authentication secrets", category: "Authentication Data" },
  { pattern: /^twoFactorEnabled$/i, label: "two-factor status", category: "Authentication Data" },
  { pattern: /^identityProvider$/i, label: "identity provider info", category: "Authentication Data" },
  { pattern: /^ssn$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^socialSecurity$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^taxID$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^dateOfBirth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^dob$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^avatar$/i, label: "avatar images", category: "Personal Identity Data" },
  { pattern: /^profileImage$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },
  { pattern: /^locale$/i, label: "locale/language preferences", category: "Personal Identity Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zipCode$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postalCode$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^timezone$/i, label: "timezone information", category: "Location Data" },
  { pattern: /^creditCard$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bankAccount$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^deviceID$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^userAgent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^lastLoginAt$/i, label: "login timestamps", category: "Technical Data" },
];

interface DetectedField {
  structName: string;
  fieldName: string;
  label: string;
  category: string;
}

/**
 * Scans Go source files for struct definitions containing personal data fields.
 * Recursively walks the project looking for .go files, parses struct blocks,
 * and matches field names against known personal data patterns.
 */
export function scanGoStructs(projectPath: string): DataCategory[] {
  const goFiles = findGoFiles(projectPath);

  if (goFiles.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of goFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const fields = parseGoStructsForPersonalData(content);
    allDetectedFields.push(...fields);
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Recursively finds all .go files in the project, skipping common
 * non-project directories.
 */
function findGoFiles(projectPath: string): string[] {
  const found: string[] = [];
  const skipDirs = new Set([
    "node_modules",
    ".git",
    "vendor",
    "dist",
    "build",
    "testdata",
    ".cache",
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
      } else if (entry.name.endsWith(".go") && !entry.name.endsWith("_test.go")) {
        found.push(path.join(dir, entry.name));
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses Go source content and identifies personal data fields within
 * struct definitions.
 *
 * Matches patterns like:
 *   type User struct {
 *       Email    string
 *       Phone    string `json:"phone"`
 *   }
 */
function parseGoStructsForPersonalData(content: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentStruct: string | null = null;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect struct definition: type User struct {
    const structMatch = trimmed.match(/^type\s+(\w+)\s+struct\s*\{/);
    if (structMatch) {
      currentStruct = structMatch[1];
      braceDepth = 1;
      continue;
    }

    // Handle struct opening on a separate line after "type X struct"
    if (currentStruct === null) {
      const structDeclMatch = trimmed.match(/^type\s+(\w+)\s+struct\s*$/);
      if (structDeclMatch) {
        // Mark pending, wait for opening brace
        currentStruct = structDeclMatch[1];
        braceDepth = 0;
        continue;
      }
    }

    // If we have a struct name but haven't seen the opening brace yet
    if (currentStruct && braceDepth === 0) {
      if (trimmed === "{") {
        braceDepth = 1;
        continue;
      }
      // If the next non-empty line isn't an opening brace, reset
      if (trimmed !== "") {
        currentStruct = null;
        continue;
      }
      continue;
    }

    if (!currentStruct || braceDepth === 0) {
      continue;
    }

    // Track brace depth for nested structs
    for (const ch of trimmed) {
      if (ch === "{") braceDepth++;
      else if (ch === "}") braceDepth--;
    }

    // If we've closed the struct
    if (braceDepth <= 0) {
      currentStruct = null;
      braceDepth = 0;
      continue;
    }

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      continue;
    }

    // Parse struct field: FieldName Type `tags`
    // Go struct fields start with a letter (exported) or underscore
    // Embedded structs (just a type name) also match but won't hit our patterns
    const fieldMatch = trimmed.match(/^(\w+)\s+/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];

      for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
        if (pattern.test(fieldName)) {
          detected.push({
            structName: currentStruct,
            fieldName,
            label,
            category,
          });
          break;
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
    entry.sources.add(`${field.structName}.${field.fieldName}`);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description =
      `${descriptionItems.join(", ")} detected in Go struct fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
