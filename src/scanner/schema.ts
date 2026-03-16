import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Personal data field patterns to detect in Prisma schema models.
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
  { pattern: /^name$/i, label: "names", category: "Personal Identity Data" },
  { pattern: /^firstName$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^lastName$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^address$/i, label: "addresses", category: "Contact Information" },
  { pattern: /^ip$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^ipAddress$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^password$/i, label: "passwords", category: "Authentication Data" },
  { pattern: /^passwordHash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^ssn$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^dateOfBirth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^dob$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^avatar$/i, label: "avatar images", category: "Personal Identity Data" },
  { pattern: /^profileImage$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zipCode$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postalCode$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },
  { pattern: /^twoFactorSecret$/i, label: "two-factor authentication secrets", category: "Authentication Data" },
  { pattern: /^twoFactorEnabled$/i, label: "two-factor status", category: "Authentication Data" },
  { pattern: /^identityProvider$/i, label: "identity provider info", category: "Authentication Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^displayName$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^phoneNumber$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^mobilePhone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^locale$/i, label: "locale/language preferences", category: "Personal Identity Data" },
  { pattern: /^timezone$/i, label: "timezone information", category: "Location Data" },
  { pattern: /^creditCard$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bankAccount$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^taxId$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^socialSecurity$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^deviceId$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^userAgent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^lastLoginIp$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^lastLoginAt$/i, label: "login timestamps", category: "Technical Data" },
];

interface DetectedField {
  modelName: string;
  fieldName: string;
  label: string;
  category: string;
}

/**
 * Scans Prisma schema files for model definitions containing personal data fields.
 * Searches multiple common locations for schema files (monorepo support).
 * Returns additional data categories derived from the schema.
 */
export function scanPrismaSchema(projectPath: string): DataCategory[] {
  const schemaPaths = findPrismaSchemas(projectPath);

  if (schemaPaths.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const schemaPath of schemaPaths) {
    let content: string;
    try {
      content = fs.readFileSync(schemaPath, "utf-8");
    } catch {
      continue;
    }

    const fields = parseSchemaForPersonalData(content);
    allDetectedFields.push(...fields);
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  // Group detected fields by category
  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Finds all Prisma schema files in the project.
 * Searches standard location, root, multi-file schema dirs,
 * monorepo packages and apps directories, and top-level subdirectories.
 */
function findPrismaSchemas(projectPath: string): string[] {
  const found: string[] = [];

  // Direct known paths
  const directPaths = [
    path.join(projectPath, "prisma", "schema.prisma"),
    path.join(projectPath, "schema.prisma"),
  ];

  for (const p of directPaths) {
    if (fs.existsSync(p)) {
      found.push(p);
    }
  }

  // Multi-file schema directory (Prisma 5.15+)
  const multiSchemaDir = path.join(projectPath, "prisma", "schema");
  if (fs.existsSync(multiSchemaDir)) {
    try {
      const entries = fs.readdirSync(multiSchemaDir);
      for (const entry of entries) {
        if (entry.endsWith(".prisma")) {
          found.push(path.join(multiSchemaDir, entry));
        }
      }
    } catch {
      // ignore
    }
  }

  // Search subdirectories for monorepo patterns
  const monorepoRoots = ["packages", "apps"];
  for (const root of monorepoRoots) {
    const rootDir = path.join(projectPath, root);
    if (!fs.existsSync(rootDir)) continue;
    try {
      const entries = fs.readdirSync(rootDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const subSchema = path.join(rootDir, entry.name, "prisma", "schema.prisma");
        if (fs.existsSync(subSchema)) {
          found.push(subSchema);
        }
        // Also check for multi-file schema dirs
        const subSchemaDir = path.join(rootDir, entry.name, "prisma", "schema");
        if (fs.existsSync(subSchemaDir)) {
          try {
            const schemaEntries = fs.readdirSync(subSchemaDir);
            for (const se of schemaEntries) {
              if (se.endsWith(".prisma")) {
                found.push(path.join(subSchemaDir, se));
              }
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Also check top-level directories (for non-standard monorepo structures)
  try {
    const topEntries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of topEntries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !entry.name.startsWith("node_modules") &&
        !monorepoRoots.includes(entry.name)
      ) {
        const subSchema = path.join(projectPath, entry.name, "prisma", "schema.prisma");
        if (fs.existsSync(subSchema) && !found.includes(subSchema)) {
          found.push(subSchema);
        }
      }
    }
  } catch {
    // ignore
  }

  return found;
}

/**
 * Parses Prisma schema content and identifies personal data fields within model blocks.
 */
function parseSchemaForPersonalData(content: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentModel: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect model block start: "model User {"
    const modelMatch = trimmed.match(/^model\s+(\w+)\s*\{/);
    if (modelMatch) {
      currentModel = modelMatch[1];
      continue;
    }

    // Detect block end
    if (trimmed === "}") {
      currentModel = null;
      continue;
    }

    // Inside a model block, look for field definitions
    if (currentModel && trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("@@")) {
      // Prisma field format: fieldName Type ...
      const fieldMatch = trimmed.match(/^(\w+)\s+/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];

        // Check against personal data patterns
        for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
          if (pattern.test(fieldName)) {
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
      `${descriptionItems.join(", ")} detected in Prisma schema fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
