import * as fs from "fs";
import * as path from "path";
import type { DataCategory } from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

/**
 * Known data field patterns and their human-readable labels.
 * Maps regex fragments to descriptions used in the output.
 */
const DATA_FIELD_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(?:req\.body|body)\.email/g, label: "email" },
  { pattern: /(?:req\.body|body)\.name/g, label: "name" },
  { pattern: /(?:req\.body|body)\.password/g, label: "password" },
  { pattern: /(?:req\.body|body)\.phone/g, label: "phone" },
  { pattern: /(?:req\.body|body)\.address/g, label: "address" },
  { pattern: /(?:req\.body|body)\.username/g, label: "username" },
  { pattern: /(?:req\.body|body)\.firstName/g, label: "firstName" },
  { pattern: /(?:req\.body|body)\.lastName/g, label: "lastName" },
  { pattern: /(?:req\.body|body)\.dob|(?:req\.body|body)\.dateOfBirth|(?:req\.body|body)\.birthDate/g, label: "dateOfBirth" },
  { pattern: /(?:req\.body|body)\.ssn|(?:req\.body|body)\.socialSecurity/g, label: "ssn" },
  { pattern: /(?:req\.body|body)\.creditCard|(?:req\.body|body)\.cardNumber/g, label: "creditCard" },
  { pattern: /(?:req\.body|body)\.avatar|(?:req\.body|body)\.profileImage/g, label: "avatar" },
  { pattern: /(?:req\.body|body)\.bio/g, label: "bio" },
  { pattern: /(?:req\.body|body)\.company/g, label: "company" },
  { pattern: /(?:req\.body|body)\.website|(?:req\.body|body)\.url/g, label: "website" },
  { pattern: /(?:req\.body|body)\.location/g, label: "location" },
  { pattern: /(?:req\.body|body)\.city/g, label: "city" },
  { pattern: /(?:req\.body|body)\.state/g, label: "state" },
  { pattern: /(?:req\.body|body)\.country/g, label: "country" },
  { pattern: /(?:req\.body|body)\.zip|(?:req\.body|body)\.zipCode|(?:req\.body|body)\.postalCode/g, label: "zipCode" },
];

/**
 * Regex for destructured body fields: const { email, name } = req.body
 */
const DESTRUCTURE_REGEX = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req\.body|request\.body|body)/g;

/**
 * Regex for Zod schema definitions: z.object({ email: z.string(), ... })
 * Captures the contents inside z.object({ ... })
 */
const ZOD_OBJECT_REGEX = /z\.object\(\s*\{([^}]+)\}\s*\)/g;

/**
 * Regex for tRPC router input schemas: .input(z.object({ ... }))
 * Also matches .input(schema) where schema is a z.object
 */
const TRPC_INPUT_REGEX = /\.input\(\s*z\.object\(\s*\{([^}]+)\}\s*\)\s*\)/g;

/**
 * Regex to extract individual field names from inside a Zod object definition.
 * Matches patterns like: email: z.string(), name: z.number(), etc.
 */
const ZOD_FIELD_REGEX = /(\w+)\s*:\s*z\.(?:string|number|boolean|email|optional|array|enum|literal|date|bigint|union|intersection|nullable|coerce)/g;

/**
 * Map field names to data categories for compliance classification.
 */
const FIELD_CATEGORY_MAP: Record<string, string> = {
  email: "Contact",
  phone: "Contact",
  phoneNumber: "Contact",
  address: "Contact",
  city: "Contact",
  state: "Contact",
  country: "Contact",
  zip: "Contact",
  zipCode: "Contact",
  postalCode: "Contact",
  password: "Auth",
  passwordHash: "Auth",
  token: "Auth",
  refreshToken: "Auth",
  apiKey: "Auth",
  secret: "Auth",
  name: "Identity",
  firstName: "Identity",
  lastName: "Identity",
  username: "Identity",
  displayName: "Identity",
  avatar: "Identity",
  profileImage: "Identity",
  bio: "Identity",
  dob: "Sensitive",
  dateOfBirth: "Sensitive",
  birthDate: "Sensitive",
  ssn: "Sensitive",
  socialSecurity: "Sensitive",
  creditCard: "Financial",
  cardNumber: "Financial",
  bankAccount: "Financial",
  routingNumber: "Financial",
  company: "Business",
  website: "Business",
  url: "Business",
  location: "Location",
};

interface EndpointInfo {
  route: string;
  method: string;
  fields: string[];
}

/**
 * Scan Next.js App Router route files: app / ** / route.ts
 * Look for exported POST, PUT, PATCH handlers.
 */
function scanNextAppRoutes(projectPath: string, allFiles: WalkedFile[]): EndpointInfo[] {
  const appPrefix = "app" + path.sep;
  const routeFiles = allFiles.filter(f => {
    const base = path.basename(f.fullPath);
    return (
      f.relativePath.startsWith(appPrefix) &&
      (base === "route.ts" || base === "route.tsx" || base === "route.js" || base === "route.jsx")
    );
  });

  const results: EndpointInfo[] = [];

  for (const file of routeFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    // Detect exported HTTP method handlers
    const methodRegex = /export\s+(?:async\s+)?function\s+(POST|PUT|PATCH)\b/g;
    let match: RegExpExecArray | null;
    while ((match = methodRegex.exec(content)) !== null) {
      const method = match[1];
      const fields = detectDataFields(content);
      results.push({
        route: file.relativePath,
        method,
        fields,
      });
    }
  }

  return results;
}

/**
 * Scan Next.js Pages API routes: pages/api/**\/*.ts
 * Look for req.body usage.
 */
function scanNextPagesRoutes(projectPath: string, allFiles: WalkedFile[]): EndpointInfo[] {
  const pagesApiPrefix = path.join("pages", "api") + path.sep;
  const files = allFiles.filter(f => f.relativePath.startsWith(pagesApiPrefix));

  const results: EndpointInfo[] = [];

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    // Only include files that reference req.body or request.body
    if (!/req(?:uest)?\.body/g.test(content)) continue;

    // Detect HTTP methods from if-checks: if (req.method === 'POST')
    const methodCheckRegex = /req(?:uest)?\.method\s*===?\s*["'](POST|PUT|PATCH)["']/g;
    const methods = new Set<string>();
    let methodMatch: RegExpExecArray | null;
    while ((methodMatch = methodCheckRegex.exec(content)) !== null) {
      methods.add(methodMatch[1]);
    }

    // If no explicit method check found, assume POST (body usage implies data acceptance)
    if (methods.size === 0) {
      methods.add("POST");
    }

    const fields = detectDataFields(content);

    for (const method of methods) {
      results.push({
        route: file.relativePath,
        method,
        fields,
      });
    }
  }

  return results;
}

/**
 * Scan Express/Fastify-style route definitions:
 * app.post(), app.put(), app.patch(), router.post(), etc.
 */
function scanExpressFastifyRoutes(projectPath: string, allFiles: WalkedFile[]): EndpointInfo[] {
  const results: EndpointInfo[] = [];

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    // Match patterns like app.post('/route', ...) or router.put('/route', ...)
    const routeRegex = /(?:app|router|server|fastify)\.(post|put|patch)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
    let match: RegExpExecArray | null;
    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const fields = detectDataFields(content);
      results.push({
        route: file.relativePath,
        method,
        fields,
      });
    }
  }

  return results;
}

/**
 * Extract field names from inside a Zod z.object() body string.
 */
function extractZodFields(zodBody: string): string[] {
  const fields: string[] = [];
  ZOD_FIELD_REGEX.lastIndex = 0;
  let fieldMatch: RegExpExecArray | null;
  while ((fieldMatch = ZOD_FIELD_REGEX.exec(zodBody)) !== null) {
    fields.push(fieldMatch[1]);
  }
  return fields;
}

/**
 * Extract all field names from Zod schema definitions found in content.
 * Handles both standalone z.object() and tRPC .input(z.object()) patterns.
 */
export function extractZodSchemaFields(content: string): string[] {
  const fields = new Set<string>();

  // Match standalone z.object({ ... }) definitions
  ZOD_OBJECT_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ZOD_OBJECT_REGEX.exec(content)) !== null) {
    for (const f of extractZodFields(match[1])) {
      fields.add(f);
    }
  }

  // Match tRPC .input(z.object({ ... })) definitions
  TRPC_INPUT_REGEX.lastIndex = 0;
  while ((match = TRPC_INPUT_REGEX.exec(content)) !== null) {
    for (const f of extractZodFields(match[1])) {
      fields.add(f);
    }
  }

  return Array.from(fields);
}

/**
 * Map a field name to its data category for compliance classification.
 * Returns the category string or "Other" if no mapping exists.
 */
export function mapFieldToCategory(fieldName: string): string {
  return FIELD_CATEGORY_MAP[fieldName] ?? "Other";
}

/**
 * Detect data fields accessed from request body in a file's content.
 */
function detectDataFields(content: string): string[] {
  const fields = new Set<string>();

  // Check known patterns
  for (const { pattern, label } of DATA_FIELD_PATTERNS) {
    // Reset lastIndex since we reuse regex objects with /g flag
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      fields.add(label);
    }
  }

  // Check destructured assignments: const { email, name } = req.body
  DESTRUCTURE_REGEX.lastIndex = 0;
  let destructMatch: RegExpExecArray | null;
  while ((destructMatch = DESTRUCTURE_REGEX.exec(content)) !== null) {
    const vars = destructMatch[1].split(",").map((v) => v.trim().split(":")[0].split("=")[0].trim());
    for (const v of vars) {
      if (v && v.length > 0 && !v.startsWith("...")) {
        fields.add(v);
      }
    }
  }

  // Extract fields from Zod schema definitions
  for (const zodField of extractZodSchemaFields(content)) {
    fields.add(zodField);
  }

  return Array.from(fields);
}

/**
 * Build a human-readable description from detected endpoints.
 */
function buildDescription(endpoints: EndpointInfo[]): string {
  if (endpoints.length === 0) return "";

  const allFields = new Set<string>();
  const allMethods = new Set<string>();
  for (const ep of endpoints) {
    allMethods.add(ep.method);
    for (const f of ep.fields) {
      allFields.add(f);
    }
  }

  const routeCount = endpoints.length;
  const methodList = Array.from(allMethods).sort().join(", ");
  const fieldList = Array.from(allFields).sort();

  let desc = `${routeCount} API endpoint(s) accepting user data via ${methodList} requests.`;
  if (fieldList.length > 0) {
    desc += ` Data fields collected: ${fieldList.join(", ")}.`;
  }

  return desc;
}

/**
 * Scan tRPC router definitions with Zod input schemas.
 * Detects patterns like: router({ create: publicProcedure.input(z.object({...})).mutation(...) })
 */
function scanTrpcRoutes(_projectPath: string, allFiles: WalkedFile[]): EndpointInfo[] {
  const results: EndpointInfo[] = [];

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    // Look for tRPC router patterns: createTRPCRouter, router(, t.router(
    const hasTrpc = /(?:createTRPCRouter|(?:t\.|trpc\.)?\brouter)\s*\(/i.test(content);
    if (!hasTrpc) continue;

    // Look for .input(z.object({ ... })) patterns
    const inputRegex = /\.input\(\s*z\.object\(\s*\{([^}]+)\}\s*\)\s*\)/g;
    let match: RegExpExecArray | null;
    while ((match = inputRegex.exec(content)) !== null) {
      const zodFields = extractZodFields(match[1]);
      if (zodFields.length > 0) {
        // Detect if this is a mutation or query
        const afterInput = content.slice(match.index + match[0].length, match.index + match[0].length + 100);
        const isMutation = /\.mutation\s*\(/.test(afterInput);
        results.push({
          route: file.relativePath,
          method: isMutation ? "MUTATION" : "QUERY",
          fields: zodFields,
        });
      }
    }
  }

  return results;
}

/**
 * Scan a project for API endpoints that accept user data.
 * Returns DataCategory[] with category "API Data Collection".
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanApiRoutes(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): DataCategory[] {
  const absPath = path.resolve(projectPath);

  // Filter to JS/TS source files only
  const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts"]);
  const allFiles = preWalkedFiles
    ? preWalkedFiles.filter(f => sourceExts.has(f.extension))
    : walkDirectory(absPath, { extensions: sourceExts });

  const nextAppEndpoints = scanNextAppRoutes(absPath, allFiles);
  const nextPagesEndpoints = scanNextPagesRoutes(absPath, allFiles);
  const expressFastifyEndpoints = scanExpressFastifyRoutes(absPath, allFiles);
  const trpcEndpoints = scanTrpcRoutes(absPath, allFiles);

  // Combine all endpoints
  const allEndpoints = [
    ...nextAppEndpoints,
    ...nextPagesEndpoints,
    ...expressFastifyEndpoints,
    ...trpcEndpoints,
  ];

  if (allEndpoints.length === 0) return [];

  // Deduplicate source files
  const sources = Array.from(new Set(allEndpoints.map((ep) => ep.route)));

  return [
    {
      category: "API Data Collection",
      description: buildDescription(allEndpoints),
      sources,
    },
  ];
}
