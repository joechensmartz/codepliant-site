import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * Personal data field patterns — same set used by the TypeORM/Sequelize scanner,
 * covering both camelCase and snake_case conventions common in JS/TS projects.
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
  // snake_case variants
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
 * Scans TypeScript/JavaScript files for Mongoose schema definitions
 * containing personal data fields.
 *
 * Patterns detected:
 *   new Schema({ email: String, phone: { type: String } })
 *   new mongoose.Schema({ ... })
 *   mongoose.model("User", userSchema)
 *   model("User", userSchema)
 */
export function scanMongooseModels(projectPath: string): DataCategory[] {
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

    // Quick-check: only parse files that look like they contain Mongoose patterns
    const hasMongoose =
      content.includes("mongoose") ||
      content.includes("Schema") ||
      content.includes("model(");

    if (!hasMongoose) {
      continue;
    }

    allDetectedFields.push(...parseMongooseSchemas(content));
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
        if (
          !entry.name.endsWith(".test.ts") &&
          !entry.name.endsWith(".spec.ts") &&
          !entry.name.endsWith(".test.js") &&
          !entry.name.endsWith(".spec.js") &&
          !entry.name.endsWith(".d.ts")
        ) {
          found.push(path.join(dir, entry.name));
        }
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses Mongoose schema definitions from file content.
 *
 * Detects:
 *   1. `new Schema({ field: Type, ... })` and `new mongoose.Schema({ ... })`
 *   2. `mongoose.model("ModelName", schema)` to resolve model names
 *
 * The parser extracts field names from the schema object literal and matches
 * them against personal data patterns.
 */
function parseMongooseSchemas(content: string): DetectedField[] {
  const detected: DetectedField[] = [];

  // --- Step 1: Find schema variable assignments ---
  // const userSchema = new Schema({ ... })
  // const userSchema = new mongoose.Schema({ ... })
  const schemaAssignments = new Map<string, string>(); // varName -> fields block

  // Match: const/let/var <name> = new (mongoose.)?Schema({ ... })
  const schemaAssignRegex =
    /(?:const|let|var)\s+(\w+)\s*=\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g;
  let assignMatch: RegExpExecArray | null;

  while ((assignMatch = schemaAssignRegex.exec(content)) !== null) {
    const varName = assignMatch[1];
    const startIdx = assignMatch.index + assignMatch[0].length - 1; // at the opening {
    const fieldsBlock = extractBalancedBraces(content, startIdx);
    if (fieldsBlock) {
      schemaAssignments.set(varName, fieldsBlock);
    }
  }

  // --- Step 2: Find inline new Schema({ ... }) not assigned to a variable ---
  // e.g., mongoose.model("User", new Schema({ ... }))
  const inlineSchemaRegex =
    /(?:mongoose\.)?model\s*\(\s*['"](\w+)['"]\s*,\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g;
  let inlineMatch: RegExpExecArray | null;

  while ((inlineMatch = inlineSchemaRegex.exec(content)) !== null) {
    const modelName = inlineMatch[1];
    const startIdx = inlineMatch.index + inlineMatch[0].length - 1;
    const fieldsBlock = extractBalancedBraces(content, startIdx);
    if (fieldsBlock) {
      const fields = extractMongooseFields(fieldsBlock);
      for (const fieldName of fields) {
        matchPersonalField(fieldName, modelName, detected);
      }
    }
  }

  // --- Step 3: Resolve model names from mongoose.model("Name", schemaVar) ---
  // mongoose.model("User", userSchema)
  // model("User", userSchema)
  const modelRegex =
    /(?:mongoose\.)?model\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)\s*\)/g;
  let modelMatch: RegExpExecArray | null;

  const modelToSchema = new Map<string, string>(); // modelName -> schemaVarName

  while ((modelMatch = modelRegex.exec(content)) !== null) {
    const modelName = modelMatch[1];
    const schemaVarName = modelMatch[2];
    modelToSchema.set(modelName, schemaVarName);
  }

  // --- Step 4: For each schema assignment, determine model name and extract fields ---
  for (const [varName, fieldsBlock] of schemaAssignments) {
    // Try to find model name from mongoose.model() calls
    let modelName: string | null = null;
    for (const [mName, sVar] of modelToSchema) {
      if (sVar === varName) {
        modelName = mName;
        break;
      }
    }

    // Fallback: derive model name from variable name (e.g., userSchema -> User)
    if (!modelName) {
      modelName = deriveModelName(varName);
    }

    const fields = extractMongooseFields(fieldsBlock);
    for (const fieldName of fields) {
      matchPersonalField(fieldName, modelName, detected);
    }
  }

  // --- Step 5: Handle standalone new Schema({ ... }) not assigned to a variable ---
  // e.g., export default new Schema({ ... })
  const standaloneSchemaRegex =
    /(?:export\s+default\s+)?new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g;
  let standaloneMatch: RegExpExecArray | null;

  while ((standaloneMatch = standaloneSchemaRegex.exec(content)) !== null) {
    const startIdx = standaloneMatch.index + standaloneMatch[0].length - 1;
    const fieldsBlock = extractBalancedBraces(content, startIdx);
    if (!fieldsBlock) continue;

    // Check if this was already captured by assignment or inline patterns
    let alreadyCaptured = false;
    for (const [, block] of schemaAssignments) {
      if (block === fieldsBlock) {
        alreadyCaptured = true;
        break;
      }
    }
    if (alreadyCaptured) continue;

    // Check if this position was already matched by the inline regex
    const matchStart = standaloneMatch.index;
    let isInline = false;
    const beforeText = content.substring(Math.max(0, matchStart - 100), matchStart);
    if (/model\s*\(\s*['"](\w+)['"]\s*,\s*$/.test(beforeText)) {
      isInline = true;
    }
    if (isInline) continue;

    const fields = extractMongooseFields(fieldsBlock);
    for (const fieldName of fields) {
      matchPersonalField(fieldName, "UnknownModel", detected);
    }
  }

  return detected;
}

/**
 * Extracts balanced braces content starting from an opening brace.
 * Returns the content between (and including) the braces, or null if unbalanced.
 */
function extractBalancedBraces(content: string, startIdx: number): string | null {
  if (content[startIdx] !== "{") return null;

  let depth = 0;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === "{") depth++;
    if (content[i] === "}") depth--;
    if (depth === 0) {
      return content.substring(startIdx + 1, i);
    }
  }
  return null;
}

/**
 * Extracts top-level field names from a Mongoose schema fields block.
 *
 * Handles:
 *   email: String
 *   email: { type: String, required: true }
 *   phone: { type: String }
 *   createdAt: { type: Date }
 */
function extractMongooseFields(fieldsBlock: string): string[] {
  const fields: string[] = [];

  // We need to extract top-level keys from the object literal.
  // Walk through, tracking brace depth to only capture top-level keys.
  let depth = 0;
  let i = 0;
  const len = fieldsBlock.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(fieldsBlock[i])) i++;
    if (i >= len) break;

    // At depth 0, we expect a field key
    if (depth === 0) {
      // Match a key: either identifier or quoted string
      let key: string | null = null;

      // Quoted key: 'key' or "key"
      const quoteMatch = fieldsBlock.substring(i).match(/^(['"])(\w+)\1\s*:/);
      if (quoteMatch) {
        key = quoteMatch[2];
        i += quoteMatch[0].length;
      } else {
        // Unquoted key
        const keyMatch = fieldsBlock.substring(i).match(/^(\w+)\s*:/);
        if (keyMatch) {
          key = keyMatch[1];
          i += keyMatch[0].length;
        } else {
          // Not a key, advance
          i++;
          continue;
        }
      }

      if (key) {
        fields.push(key);
      }

      // Now skip the value (could be nested { } or simple token)
      // Skip whitespace
      while (i < len && /\s/.test(fieldsBlock[i])) i++;

      if (i < len && fieldsBlock[i] === "{") {
        // Skip nested object
        let nestedDepth = 0;
        while (i < len) {
          if (fieldsBlock[i] === "{") nestedDepth++;
          if (fieldsBlock[i] === "}") nestedDepth--;
          i++;
          if (nestedDepth === 0) break;
        }
      } else if (i < len && fieldsBlock[i] === "[") {
        // Skip array value
        let bracketDepth = 0;
        while (i < len) {
          if (fieldsBlock[i] === "[") bracketDepth++;
          if (fieldsBlock[i] === "]") bracketDepth--;
          i++;
          if (bracketDepth === 0) break;
        }
      } else {
        // Simple value — skip until comma or end
        while (i < len && fieldsBlock[i] !== "," && fieldsBlock[i] !== "}") {
          i++;
        }
      }

      // Skip comma
      if (i < len && fieldsBlock[i] === ",") i++;
    } else {
      // Inside nested braces, just advance
      if (fieldsBlock[i] === "{") depth++;
      else if (fieldsBlock[i] === "}") depth--;
      i++;
    }
  }

  return fields;
}

/**
 * Derives a model name from a schema variable name.
 * e.g., userSchema -> User, profileSchema -> Profile, schema -> Schema
 */
function deriveModelName(varName: string): string {
  const name = varName.replace(/Schema$/i, "").replace(/schema$/i, "");
  if (name.length === 0) return "UnknownModel";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Checks a field name against all personal data patterns and pushes
 * matches into the detected array.
 */
function matchPersonalField(
  fieldName: string,
  modelName: string,
  detected: DetectedField[],
): void {
  for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(fieldName)) {
      const exists = detected.some(
        (d) => d.modelName === modelName && d.fieldName === fieldName,
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
    entry.sources.add(`${field.modelName}.${field.fieldName}`);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description = `${descriptionItems.join(", ")} detected in Mongoose model fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
