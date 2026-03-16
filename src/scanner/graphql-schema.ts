import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";
import { walkDirectory } from "./file-walker.js";

/**
 * Personal data field patterns to detect in GraphQL schema types.
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
  { pattern: /^lastLoginAt$/i, label: "login timestamps", category: "Technical Data" },
  { pattern: /^twoFactorSecret$/i, label: "two-factor authentication secrets", category: "Authentication Data" },
  { pattern: /^identityProvider$/i, label: "identity provider info", category: "Authentication Data" },
];

interface DetectedField {
  typeName: string;
  fieldName: string;
  label: string;
  category: string;
  source: string;
}

/**
 * Scans GraphQL schema files (.graphql, .gql) and JS/TS files containing
 * gql template literals for type/input definitions with personal data fields.
 * Also detects mutations that accept user data.
 */
export function scanGraphqlSchema(projectPath: string): DataCategory[] {
  const allDetectedFields: DetectedField[] = [];

  // 1. Find and scan .graphql / .gql files
  const graphqlFiles = findGraphqlFiles(projectPath);
  for (const filePath of graphqlFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const relPath = path.relative(projectPath, filePath);
      const fields = parseGraphqlForPersonalData(content, relPath);
      allDetectedFields.push(...fields);
    } catch {
      // skip unreadable files
    }
  }

  // 2. Scan .ts/.js files for gql template literals
  const sourceFiles = findSourceFilesWithGql(projectPath);
  for (const filePath of sourceFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const relPath = path.relative(projectPath, filePath);
      const schemas = extractGqlTemplateLiterals(content);
      for (const schema of schemas) {
        const fields = parseGraphqlForPersonalData(schema, relPath);
        allDetectedFields.push(...fields);
      }
    } catch {
      // skip unreadable files
    }
  }

  if (allDetectedFields.length === 0) {
    return [];
  }

  return groupFieldsIntoCategories(allDetectedFields);
}

/**
 * Finds .graphql and .gql files in the project, walking the directory tree
 * while skipping common ignored directories.
 */
function findGraphqlFiles(projectPath: string): string[] {
  const extensions = new Set([".graphql", ".gql"]);
  return walkDirectory(projectPath, { extensions, skipTests: false }).map((f) => f.fullPath);
}

/**
 * Finds .ts and .js files that may contain gql template literals.
 */
function findSourceFilesWithGql(projectPath: string): string[] {
  const extensions = new Set([".ts", ".js", ".tsx", ".jsx"]);
  const allFiles = walkDirectory(projectPath, { extensions, skipTests: true });

  // Filter to only files that likely contain gql`` template literals
  const gqlFiles: string[] = [];
  for (const walked of allFiles) {
    try {
      const content = fs.readFileSync(walked.fullPath, "utf-8");
      if (hasGqlLiteral(content)) {
        gqlFiles.push(walked.fullPath);
      }
    } catch {
      // skip
    }
  }
  return gqlFiles;
}

/**
 * Quick check whether file content contains a gql template literal.
 */
function hasGqlLiteral(content: string): boolean {
  return /gql\s*`/.test(content) || /graphql\s*`/.test(content);
}

/**
 * Extracts GraphQL schema strings from gql`...` or graphql`...` template literals.
 */
export function extractGqlTemplateLiterals(content: string): string[] {
  const schemas: string[] = [];
  // Match gql`...` and graphql`...` template literals
  const regex = /(?:gql|graphql)\s*`([\s\S]*?)`/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    schemas.push(match[1]);
  }
  return schemas;
}

/**
 * Parses GraphQL schema content for type and input definitions containing
 * personal data fields. Also detects mutations that accept user-related inputs.
 */
export function parseGraphqlForPersonalData(content: string, source: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentBlock: string | null = null; // "type User" or "input CreateUserInput"
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("#")) continue;

    // Detect type/input block start: `type User {`, `input CreateUserInput {`
    const blockMatch = trimmed.match(/^(?:type|input)\s+(\w+)(?:\s+implements\s+\w+(?:\s*&\s*\w+)*)?\s*\{/);
    if (blockMatch) {
      currentBlock = blockMatch[1];
      braceDepth = 1;
      continue;
    }

    // Also handle the opening brace on the same line with extend type
    const extendMatch = trimmed.match(/^extend\s+(?:type|input)\s+(\w+)\s*\{/);
    if (extendMatch) {
      currentBlock = extendMatch[1];
      braceDepth = 1;
      continue;
    }

    if (currentBlock) {
      // Track brace depth
      for (const ch of trimmed) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      if (braceDepth <= 0) {
        currentBlock = null;
        braceDepth = 0;
        continue;
      }

      // Inside a block, look for field definitions: `fieldName: Type` or `fieldName(args): Type`
      const fieldMatch = trimmed.match(/^(\w+)\s*(?:\(.*?\))?\s*:/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];

        for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
          if (pattern.test(fieldName)) {
            detected.push({
              typeName: currentBlock,
              fieldName,
              label,
              category,
              source,
            });
            break;
          }
        }
      }
    }

    // Detect mutations that accept user-related inputs (even outside the block scan)
    // e.g., createUser(input: CreateUserInput!): User
    const mutationMatch = trimmed.match(/^(\w+)\s*\(([^)]*)\)\s*:/);
    if (mutationMatch && !currentBlock) {
      // This is typically inside a Mutation type block but we check arguments
      // for personal data field names in inline args
      const args = mutationMatch[2];
      if (args) {
        // Parse inline argument fields: `email: String!, password: String!`
        const argFields = args.split(",");
        for (const argField of argFields) {
          const argMatch = argField.trim().match(/^(\w+)\s*:/);
          if (argMatch) {
            const argName = argMatch[1];
            for (const { pattern, label, category } of PERSONAL_DATA_PATTERNS) {
              if (pattern.test(argName)) {
                detected.push({
                  typeName: "Mutation",
                  fieldName: argName,
                  label,
                  category,
                  source,
                });
                break;
              }
            }
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
    entry.sources.add(`${field.typeName}.${field.fieldName}`);
  }

  const categories: DataCategory[] = [];

  for (const [category, data] of categoryMap) {
    const descriptionItems = Array.from(data.descriptions);
    const description =
      `${descriptionItems.join(", ")} detected in GraphQL schema fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
