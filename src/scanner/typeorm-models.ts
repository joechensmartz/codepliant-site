import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Personal data field patterns — same as the Prisma scanner (camelCase convention
 * used by TypeORM/Sequelize in the JS/TS ecosystem).
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
  // snake_case variants common in Sequelize models
  { pattern: /^first_name$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^last_name$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^phone_number$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^ip_address$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^password_hash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^date_of_birth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^profile_image$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^zip_code$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postal_code$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^display_name$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^mobile_phone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^credit_card$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bank_account$/i, label: "bank account information", category: "Financial Data" },
  { pattern: /^tax_id$/i, label: "tax identification numbers", category: "Government Identifiers" },
  { pattern: /^social_security$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^device_id$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^user_agent$/i, label: "user agent strings", category: "Technical Data" },
  { pattern: /^last_login_ip$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^last_login_at$/i, label: "login timestamps", category: "Technical Data" },
];

interface DetectedField {
  modelName: string;
  fieldName: string;
  label: string;
  category: string;
}

/**
 * Scans TypeScript/JavaScript files for TypeORM entity and Sequelize model
 * definitions containing personal data fields.
 *
 * TypeORM patterns detected:
 *   @Entity() class User { @Column() email: string; }
 *
 * Sequelize patterns detected:
 *   User.init({ email: DataTypes.STRING }, { sequelize })
 *   sequelize.define('User', { email: DataTypes.STRING })
 */
export function scanTypeormModels(projectPath: string): DataCategory[] {
  const tsFiles = findTsJsFiles(projectPath);

  if (tsFiles.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of tsFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Quick-check: only parse files that look like they contain TypeORM or Sequelize models
    const hasTypeOrm = content.includes("@Entity") || content.includes("@Column");
    const hasSequelize = content.includes("DataTypes.") || content.includes(".init(") || content.includes(".define(");

    if (!hasTypeOrm && !hasSequelize) {
      continue;
    }

    if (hasTypeOrm) {
      allDetectedFields.push(...parseTypeormEntities(content));
    }
    if (hasSequelize) {
      allDetectedFields.push(...parseSequelizeModels(content));
    }
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Recursively finds all .ts and .js files in the project, skipping common
 * non-project directories.
 */
function findTsJsFiles(projectPath: string): string[] {
  const found: string[] = [];
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
        // Skip test files and declaration files
        if (!entry.name.endsWith(".test.ts") && !entry.name.endsWith(".spec.ts") &&
            !entry.name.endsWith(".test.js") && !entry.name.endsWith(".spec.js") &&
            !entry.name.endsWith(".d.ts")) {
          found.push(path.join(dir, entry.name));
        }
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses TypeORM entity definitions.
 *
 * Detects @Entity() decorated classes and @Column() decorated properties
 * within them. Handles both class-level @Entity and inline patterns.
 */
function parseTypeormEntities(content: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentEntity: string | null = null;
  let braceDepth = 0;
  let entityPending = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect @Entity() decorator — the next class declaration is an entity
    if (/^@Entity\s*\(/.test(trimmed)) {
      entityPending = true;
      continue;
    }

    // Detect class declaration after @Entity()
    if (entityPending) {
      const classMatch = trimmed.match(/^(?:export\s+)?class\s+(\w+)/);
      if (classMatch) {
        currentEntity = classMatch[1];
        entityPending = false;
        braceDepth = 0;
        // Count braces on this line
        for (const ch of trimmed) {
          if (ch === "{") braceDepth++;
          if (ch === "}") braceDepth--;
        }
        continue;
      }
      // If not a class line, could be other decorators stacked; keep waiting
      if (!trimmed.startsWith("@")) {
        entityPending = false;
      }
      continue;
    }

    // Also detect inline: @Entity() export class User {
    const inlineMatch = trimmed.match(/@Entity\s*\([^)]*\)\s*(?:export\s+)?class\s+(\w+)/);
    if (inlineMatch) {
      currentEntity = inlineMatch[1];
      braceDepth = 0;
      for (const ch of trimmed) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      continue;
    }

    // Track brace depth inside entity
    if (currentEntity) {
      for (const ch of trimmed) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      if (braceDepth <= 0) {
        currentEntity = null;
        continue;
      }

      // Detect @Column() decorated fields:
      //   @Column() email: string;
      //   @Column({ type: 'varchar' }) email: string;
      //   email: string;  (preceded by @Column on previous line)
      // We look for @Column on the same line or check for field patterns
      const columnFieldMatch = trimmed.match(
        /@Column\s*\([^)]*\)\s*(\w+)\s*[?!]?\s*:/
      );
      if (columnFieldMatch) {
        const fieldName = columnFieldMatch[1];
        matchPersonalField(fieldName, currentEntity, detected);
        continue;
      }

      // @Column() on its own line means the next non-decorator line is the field
      if (/^@Column\s*\(/.test(trimmed)) {
        // Look ahead — handled by flagging; simpler: check next meaningful line
        // For simplicity, we also match bare property declarations inside entities
        continue;
      }

      // Match bare field declaration (property in a TypeORM entity class)
      // e.g., `email: string;` or `email!: string;`
      const bareFieldMatch = trimmed.match(/^(\w+)\s*[?!]?\s*:\s*\w/);
      if (bareFieldMatch && !trimmed.startsWith("@") && !trimmed.startsWith("//") &&
          !trimmed.startsWith("/*") && !trimmed.startsWith("*") &&
          !trimmed.startsWith("constructor") && !trimmed.startsWith("static") &&
          !trimmed.startsWith("async") && !trimmed.startsWith("get ") &&
          !trimmed.startsWith("set ") && !trimmed.startsWith("private ") &&
          !trimmed.startsWith("protected ") && !trimmed.startsWith("public ") &&
          !trimmed.startsWith("readonly ")) {
        // Only match if it looks like a simple property (not a method)
        const fieldName = bareFieldMatch[1];
        matchPersonalField(fieldName, currentEntity, detected);
      }
    }
  }

  return detected;
}

/**
 * Parses Sequelize model definitions.
 *
 * Detects patterns:
 *   User.init({ email: DataTypes.STRING, ... }, { sequelize })
 *   sequelize.define('User', { email: DataTypes.STRING })
 *   User.init({ email: { type: DataTypes.STRING } }, { sequelize })
 */
function parseSequelizeModels(content: string): DetectedField[] {
  const detected: DetectedField[] = [];

  // Pattern 1: ModelName.init({ ... }, ...)
  const initRegex = /(\w+)\.init\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = initRegex.exec(content)) !== null) {
    const modelName = match[1];
    const fieldsBlock = match[2];

    // Skip if this doesn't look like a model (e.g., it's a variable named 'config')
    if (modelName[0] !== modelName[0].toUpperCase()) continue;

    extractSequelizeFields(fieldsBlock, modelName, detected);
  }

  // Pattern 2: sequelize.define('ModelName', { ... })
  const defineRegex = /\.define\s*\(\s*['"](\w+)['"]\s*,\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;

  while ((match = defineRegex.exec(content)) !== null) {
    const modelName = match[1];
    const fieldsBlock = match[2];
    extractSequelizeFields(fieldsBlock, modelName, detected);
  }

  return detected;
}

/**
 * Extracts field names from a Sequelize fields block and checks against
 * personal data patterns.
 */
function extractSequelizeFields(fieldsBlock: string, modelName: string, detected: DetectedField[]): void {
  // Match field keys:  `email: DataTypes.STRING` or `email: { type: DataTypes.STRING }`
  const fieldRegex = /(\w+)\s*:\s*(?:DataTypes\.\w+|\{)/g;
  let fieldMatch: RegExpExecArray | null;

  while ((fieldMatch = fieldRegex.exec(fieldsBlock)) !== null) {
    const fieldName = fieldMatch[1];
    // Skip Sequelize reserved option keys
    if (fieldName === "type" || fieldName === "allowNull" || fieldName === "defaultValue" ||
        fieldName === "primaryKey" || fieldName === "autoIncrement" || fieldName === "unique" ||
        fieldName === "references" || fieldName === "field" || fieldName === "validate" ||
        fieldName === "get" || fieldName === "set" || fieldName === "comment") {
      continue;
    }
    matchPersonalField(fieldName, modelName, detected);
  }
}

/**
 * Checks a field name against all personal data patterns and pushes
 * matches into the detected array.
 */
function matchPersonalField(fieldName: string, modelName: string, detected: DetectedField[]): void {
  for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(fieldName)) {
      // Avoid duplicates for the same model+field
      const exists = detected.some(
        (d) => d.modelName === modelName && d.fieldName === fieldName
      );
      if (!exists) {
        detected.push({ modelName, fieldName, label, category });
      }
      break;
    }
  }
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
      `${descriptionItems.join(", ")} detected in TypeORM/Sequelize model fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
