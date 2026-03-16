import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Personal data field patterns — shared naming convention across ORM scanners.
 * Drizzle schemas use both camelCase (JS property names) and snake_case
 * (SQL column names passed as string arguments), so both are included.
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
  { pattern: /^profile_image$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zipCode$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^zip_code$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postalCode$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^postal_code$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^displayName$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^display_name$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^mobilePhone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^mobile_phone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^locale$/i, label: "locale/language preferences", category: "Personal Identity Data" },
  { pattern: /^timezone$/i, label: "timezone information", category: "Location Data" },
  { pattern: /^creditCard$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^credit_card$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bankAccount$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^bank_account$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^taxId$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^tax_id$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^socialSecurity$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^social_security$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^deviceId$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^device_id$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^userAgent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^user_agent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^lastLoginIp$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^last_login_ip$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^lastLoginAt$/i, label: "login timestamps", category: "Technical Data" },
  { pattern: /^last_login_at$/i, label: "login timestamps", category: "Technical Data" },
  { pattern: /^twoFactorSecret$/i, label: "two-factor authentication secrets", category: "Authentication Data" },
  { pattern: /^two_factor_secret$/i, label: "two-factor authentication secrets", category: "Authentication Data" },
  { pattern: /^identityProvider$/i, label: "identity provider info", category: "Authentication Data" },
  { pattern: /^identity_provider$/i, label: "identity provider info", category: "Authentication Data" },
];

interface DetectedField {
  tableName: string;
  fieldName: string;
  label: string;
  category: string;
}

/** Paths commonly used for Drizzle schema files. */
const DRIZZLE_SCHEMA_GLOBS = [
  "src/db/schema.ts",
  "src/db/schema.js",
  "src/database/schema.ts",
  "src/database/schema.js",
  "src/schema.ts",
  "src/schema.js",
  "drizzle/schema.ts",
  "drizzle/schema.js",
  "db/schema.ts",
  "db/schema.js",
  "src/server/db/schema.ts",
  "src/server/db/schema.js",
  "src/lib/db/schema.ts",
  "src/lib/db/schema.js",
  "src/lib/schema.ts",
  "src/lib/schema.js",
  "server/db/schema.ts",
  "server/db/schema.js",
  "lib/db/schema.ts",
  "lib/db/schema.js",
];

/**
 * Scans a project for Drizzle ORM table definitions that contain personal data fields.
 *
 * Drizzle patterns detected:
 *   export const users = pgTable("users", { email: varchar("email"), ... })
 *   export const users = mysqlTable("users", { email: varchar("email"), ... })
 *   export const users = sqliteTable("users", { email: text("email"), ... })
 */
export function scanDrizzleModels(projectPath: string): DataCategory[] {
  const schemaFiles = findDrizzleSchemaFiles(projectPath);

  if (schemaFiles.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of schemaFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Quick-check: only parse files that reference Drizzle table constructors
    if (!hasDrizzleTableCall(content)) {
      continue;
    }

    allDetectedFields.push(...parseDrizzleTables(content));
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Finds Drizzle schema files by checking well-known paths and also scanning
 * for any .ts/.js file that imports from "drizzle-orm/*" table helpers.
 */
function findDrizzleSchemaFiles(projectPath: string): string[] {
  const found: string[] = [];
  const seen = new Set<string>();

  // 1. Check well-known paths
  for (const relativePath of DRIZZLE_SCHEMA_GLOBS) {
    const fullPath = path.join(projectPath, relativePath);
    if (fs.existsSync(fullPath) && !seen.has(fullPath)) {
      seen.add(fullPath);
      found.push(fullPath);
    }
  }

  // 2. Walk the project for files that contain Drizzle table definitions
  const skipDirs = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    ".nuxt",
    "coverage",
    ".cache",
    ".turbo",
    ".output",
    "__tests__",
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
      } else if (
        entry.name.endsWith(".ts") ||
        entry.name.endsWith(".js") ||
        entry.name.endsWith(".mts") ||
        entry.name.endsWith(".mjs")
      ) {
        // Skip test and declaration files
        if (
          !entry.name.endsWith(".test.ts") &&
          !entry.name.endsWith(".spec.ts") &&
          !entry.name.endsWith(".test.js") &&
          !entry.name.endsWith(".spec.js") &&
          !entry.name.endsWith(".d.ts")
        ) {
          const fullPath = path.join(dir, entry.name);
          if (!seen.has(fullPath)) {
            // Only include files that actually contain Drizzle table calls
            try {
              const content = fs.readFileSync(fullPath, "utf-8");
              if (hasDrizzleTableCall(content)) {
                seen.add(fullPath);
                found.push(fullPath);
              }
            } catch {
              // skip unreadable files
            }
          }
        }
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Quick check whether file content contains a Drizzle table constructor call.
 */
function hasDrizzleTableCall(content: string): boolean {
  return (
    content.includes("pgTable") ||
    content.includes("mysqlTable") ||
    content.includes("sqliteTable")
  );
}

/**
 * Parses Drizzle ORM table definitions from file content.
 *
 * Matches patterns like:
 *   export const users = pgTable("users", { email: varchar("email", { length: 255 }), ... })
 *   export const accounts = mysqlTable("accounts", { ... })
 *   export const posts = sqliteTable("posts", { ... })
 *
 * Extracts field names from the JS property keys (left side of the colon)
 * inside the second argument object of the table constructor.
 */
function parseDrizzleTables(content: string): DetectedField[] {
  const detected: DetectedField[] = [];

  // Match table definitions: `const tableName = pgTable("sql_name", { ... })`
  // We use a regex to find the start, then manually balance braces to extract the fields block.
  const tableStartRegex =
    /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:pgTable|mysqlTable|sqliteTable)\s*\(\s*["'](\w+)["']\s*,\s*\{/g;

  let match: RegExpExecArray | null;

  while ((match = tableStartRegex.exec(content)) !== null) {
    const _varName = match[1];
    const tableName = match[2];
    const startIndex = match.index + match[0].length;

    // Extract the fields block by balancing braces
    const fieldsBlock = extractBalancedBlock(content, startIndex);
    if (!fieldsBlock) continue;

    // Extract field names from the block
    extractDrizzleFields(fieldsBlock, tableName, detected);
  }

  return detected;
}

/**
 * Extracts text from startIndex (just after an opening `{`) until the
 * matching closing `}`, accounting for nested braces.
 */
function extractBalancedBlock(content: string, startIndex: number): string | null {
  let depth = 1;
  let i = startIndex;

  while (i < content.length && depth > 0) {
    const ch = content[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }

  if (depth !== 0) return null;
  // Return content between the opening and closing braces (exclusive)
  return content.substring(startIndex, i - 1);
}

/**
 * Extracts field names from a Drizzle table fields block.
 *
 * Drizzle fields look like:
 *   email: varchar("email", { length: 255 }),
 *   firstName: text("first_name"),
 *   age: integer("age"),
 *   createdAt: timestamp("created_at"),
 *
 * We extract the JS property name (left side of the colon), which is the
 * field name developers interact with, and also check the SQL column name
 * in the string argument for personal data patterns.
 */
function extractDrizzleFields(
  fieldsBlock: string,
  tableName: string,
  detected: DetectedField[],
): void {
  // Match field patterns: `fieldName: columnType(...)` at the top level
  // We need to be careful not to match nested object keys.
  // Split by top-level commas first, then parse each field.
  const fields = splitTopLevelFields(fieldsBlock);

  for (const field of fields) {
    const trimmed = field.trim();
    if (!trimmed) continue;

    // Match: `propertyName: someColumnType(...)` or `propertyName: someColumnType("sql_name", ...)`
    const fieldMatch = trimmed.match(/^(\w+)\s*:/);
    if (!fieldMatch) continue;

    const propertyName = fieldMatch[1];

    // Also try to extract the SQL column name from the string argument
    const sqlNameMatch = trimmed.match(/:\s*\w+\s*\(\s*["'](\w+)["']/);
    const sqlColumnName = sqlNameMatch ? sqlNameMatch[1] : null;

    // Check both the JS property name and the SQL column name
    let matched = matchPersonalField(propertyName, tableName, detected);
    if (!matched && sqlColumnName && sqlColumnName !== propertyName) {
      matchPersonalField(sqlColumnName, tableName, detected);
    }
  }
}

/**
 * Splits a fields block by top-level commas (not inside nested parens/braces).
 */
function splitTopLevelFields(block: string): string[] {
  const fields: string[] = [];
  let depth = 0;
  let current = "";

  for (const ch of block) {
    if (ch === "(" || ch === "{" || ch === "[") {
      depth++;
      current += ch;
    } else if (ch === ")" || ch === "}" || ch === "]") {
      depth--;
      current += ch;
    } else if (ch === "," && depth === 0) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current.trim()) {
    fields.push(current);
  }

  return fields;
}

/**
 * Checks a field name against all personal data patterns and pushes
 * matches into the detected array. Returns true if a match was found.
 */
function matchPersonalField(
  fieldName: string,
  tableName: string,
  detected: DetectedField[],
): boolean {
  for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(fieldName)) {
      // Avoid duplicates for the same table+field
      const exists = detected.some(
        (d) => d.tableName === tableName && d.fieldName === fieldName,
      );
      if (!exists) {
        detected.push({ tableName, fieldName, label, category });
      }
      return true;
    }
  }
  return false;
}

/**
 * Groups detected fields into DataCategory objects, deduplicating by category.
 */
function groupFieldsIntoCategories(fields: DetectedField[]): DataCategory[] {
  const categoryMap = new Map<
    string,
    { descriptions: Set<string>; sources: Set<string> }
  >();

  for (const field of fields) {
    if (!categoryMap.has(field.category)) {
      categoryMap.set(field.category, {
        descriptions: new Set(),
        sources: new Set(),
      });
    }
    const entry = categoryMap.get(field.category)!;
    entry.descriptions.add(field.label);
    entry.sources.add(`${field.tableName}.${field.fieldName}`);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description = `${descriptionItems.join(", ")} detected in Drizzle ORM table fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
