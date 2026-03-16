import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";

/**
 * SQLAlchemy column type patterns that inherently indicate personal data,
 * regardless of field name.
 */
const PERSONAL_COLUMN_TYPES: Array<{
  pattern: RegExp;
  label: string;
  category: string;
}> = [
  { pattern: /\bEmailType\b/, label: "email addresses", category: "Contact Information" },
];

/**
 * Field name patterns (snake_case) that indicate personal data in
 * SQLAlchemy Column() definitions.
 */
const PERSONAL_NAME_PATTERNS: Array<{
  pattern: RegExp;
  label: string;
  category: string;
}> = [
  // Personal Identity
  { pattern: /^first_name$/i, label: "first names", category: "Personal Identity Data" },
  { pattern: /^last_name$/i, label: "last names", category: "Personal Identity Data" },
  { pattern: /^full_name$/i, label: "full names", category: "Personal Identity Data" },
  { pattern: /^name$/i, label: "names", category: "Personal Identity Data" },
  { pattern: /^username$/i, label: "usernames", category: "Personal Identity Data" },
  { pattern: /^display_name$/i, label: "display names", category: "Personal Identity Data" },
  { pattern: /^gender$/i, label: "gender information", category: "Personal Identity Data" },
  { pattern: /^age$/i, label: "age information", category: "Personal Identity Data" },
  { pattern: /^date_of_birth$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^dob$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^birth_date$/i, label: "dates of birth", category: "Personal Identity Data" },
  { pattern: /^bio$/i, label: "biographical information", category: "Personal Identity Data" },
  { pattern: /^avatar$/i, label: "avatar images", category: "Personal Identity Data" },
  { pattern: /^profile_image$/i, label: "profile images", category: "Personal Identity Data" },
  { pattern: /^profile_picture$/i, label: "profile pictures", category: "Personal Identity Data" },
  { pattern: /^photo$/i, label: "user photos", category: "Personal Identity Data" },
  { pattern: /^signature$/i, label: "signatures", category: "Personal Identity Data" },

  // Contact Information
  { pattern: /^email$/i, label: "email addresses", category: "Contact Information" },
  { pattern: /^email_address$/i, label: "email addresses", category: "Contact Information" },
  { pattern: /^phone$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^phone_number$/i, label: "phone numbers", category: "Contact Information" },
  { pattern: /^mobile_phone$/i, label: "mobile phone numbers", category: "Contact Information" },
  { pattern: /^address$/i, label: "addresses", category: "Contact Information" },
  { pattern: /^street_address$/i, label: "street addresses", category: "Contact Information" },

  // Authentication Data
  { pattern: /^password$/i, label: "passwords", category: "Authentication Data" },
  { pattern: /^password_hash$/i, label: "password hashes", category: "Authentication Data" },
  { pattern: /^hashed_password$/i, label: "password hashes", category: "Authentication Data" },

  // Government Identifiers
  { pattern: /^ssn$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^social_security$/i, label: "social security numbers", category: "Government Identifiers" },
  { pattern: /^tax_id$/i, label: "tax identification numbers", category: "Government Identifiers" },

  // Location Data
  { pattern: /^city$/i, label: "city information", category: "Location Data" },
  { pattern: /^country$/i, label: "country information", category: "Location Data" },
  { pattern: /^zip_code$/i, label: "zip codes", category: "Location Data" },
  { pattern: /^postal_code$/i, label: "postal codes", category: "Location Data" },
  { pattern: /^location$/i, label: "location data", category: "Location Data" },

  // Technical Data
  { pattern: /^ip_address$/i, label: "IP addresses", category: "Technical Data" },
  { pattern: /^last_login_ip$/i, label: "login IP addresses", category: "Technical Data" },
  { pattern: /^device_id$/i, label: "device identifiers", category: "Technical Data" },
  { pattern: /^user_agent$/i, label: "user agent strings", category: "Technical Data" },

  // Financial Data
  { pattern: /^credit_card$/i, label: "credit card information", category: "Financial Data" },
  { pattern: /^bank_account$/i, label: "bank account information", category: "Financial Data" },
];

interface DetectedField {
  modelName: string;
  fieldName: string;
  label: string;
  category: string;
}

/**
 * Scans Python files for SQLAlchemy model definitions (used with Flask/FastAPI/standalone)
 * containing personal data fields declared via Column().
 *
 * Detects patterns like:
 *   class User(Base):
 *       email = Column(String)
 *
 *   class User(db.Model):
 *       phone = Column(String(20))
 */
export function scanSqlalchemyModels(projectPath: string): DataCategory[] {
  const pyFiles = findPythonFiles(projectPath);

  if (pyFiles.length === 0) {
    return [];
  }

  const allDetectedFields: DetectedField[] = [];

  for (const filePath of pyFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Quick check: only parse files that look like they have SQLAlchemy models
    if (!content.includes("Column(") && !content.includes("Column (")) {
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
 * Recursively finds all .py files in the project, skipping common
 * non-project directories.
 */
function findPythonFiles(projectPath: string): string[] {
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
    ".mypy_cache",
    ".pytest_cache",
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
      } else if (entry.name.endsWith(".py")) {
        found.push(path.join(dir, entry.name));
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses Python file content for SQLAlchemy model class definitions and
 * identifies personal data fields within Column() declarations.
 *
 * Recognises base classes: Base, db.Model, DeclarativeBase subclasses.
 */
function parseModelsForPersonalData(content: string): DetectedField[] {
  const detected: DetectedField[] = [];
  const lines = content.split("\n");

  let currentModel: string | null = null;
  let classIndent = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect SQLAlchemy model class definitions:
    //   class User(Base):
    //   class User(db.Model):
    //   class User(SomeBase, SomeMixin):  — if "Base" appears in the parentheses
    const classMatch = trimmed.match(
      /^class\s+(\w+)\s*\(([^)]*)\)\s*:/
    );
    if (classMatch) {
      const className = classMatch[1];
      const bases = classMatch[2];

      if (isSqlalchemyModelBase(bases)) {
        currentModel = className;
        classIndent = line.search(/\S/);
        continue;
      } else {
        // Different class — end current model if any
        if (currentModel) {
          currentModel = null;
          classIndent = -1;
        }
        continue;
      }
    }

    // Detect any other class definition (end current model parsing)
    if (/^class\s+\w+/.test(trimmed) && currentModel) {
      currentModel = null;
      classIndent = -1;
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
      if (lineIndent >= 0 && lineIndent <= classIndent && trimmed.length > 0) {
        currentModel = null;
        classIndent = -1;

        // Re-check if this is a new SQLAlchemy model class
        const newClassMatch = trimmed.match(
          /^class\s+(\w+)\s*\(([^)]*)\)\s*:/
        );
        if (newClassMatch && isSqlalchemyModelBase(newClassMatch[2])) {
          currentModel = newClassMatch[1];
          classIndent = lineIndent;
        }
        continue;
      }

      // Parse Column() field definition:
      //   email = Column(String)
      //   email = Column(String(255), unique=True)
      //   email: Mapped[str] = mapped_column(String)
      const columnMatch = trimmed.match(
        /^(\w+)\s*(?::\s*[^=]+)?\s*=\s*(?:Column|mapped_column)\s*\(/
      );
      if (columnMatch) {
        const fieldName = columnMatch[1];
        const restOfLine = trimmed.slice(trimmed.indexOf("(") + 1);

        // Check column type-based detection
        for (const { pattern, label, category } of PERSONAL_COLUMN_TYPES) {
          if (pattern.test(restOfLine)) {
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
        for (const { pattern, label, category } of PERSONAL_NAME_PATTERNS) {
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
 * Determines whether a class's base classes string indicates a SQLAlchemy model.
 */
function isSqlalchemyModelBase(bases: string): boolean {
  // Match common SQLAlchemy declarative base patterns
  return /\bBase\b/.test(bases) ||
    /\bdb\.Model\b/.test(bases) ||
    /\bDeclarativeBase\b/.test(bases) ||
    /\bModel\b/.test(bases);
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
      `${descriptionItems.join(", ")} detected in SQLAlchemy model fields: ${Array.from(data.sources).join(", ")}.`;

    categories.push({
      category,
      description,
      sources: Array.from(data.sources),
    });
  }

  return categories;
}
