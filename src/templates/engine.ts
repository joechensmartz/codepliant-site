/**
 * Custom template engine for Codepliant.
 *
 * Users can place templates in a `templates/` directory at their project root.
 * Templates use {{variable}} syntax for substitution and support
 * {{#if condition}}...{{/if}} conditionals.
 *
 * If a template exists for a document type, it is used instead of the
 * built-in generator for that document.
 */

import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "../generator/index.js";

/** Map document filenames to their template filenames. */
const TEMPLATE_MAP: Record<string, string> = {
  "PRIVACY_POLICY.md": "privacy-policy.md",
  "TERMS_OF_SERVICE.md": "terms-of-service.md",
  "AI_DISCLOSURE.md": "ai-disclosure.md",
  "COOKIE_POLICY.md": "cookie-policy.md",
  "DATA_PROCESSING_AGREEMENT.md": "data-processing-agreement.md",
  "SECURITY.md": "security-policy.md",
  "INCIDENT_RESPONSE_PLAN.md": "incident-response-plan.md",
};

export interface TemplateVariables {
  company: string;
  email: string;
  services: string;
  dataCategories: string;
  jurisdiction: string;
  date: string;
  dpo: string;
  hasAI: boolean;
  [key: string]: string | boolean;
}

const TEMPLATES_DIR = "templates";

/**
 * Build the variables object from scan results and generator context.
 */
export function buildVariables(
  scan: ScanResult,
  ctx: GeneratorContext,
): TemplateVariables {
  const aiServices = scan.services.filter((s) => s.category === "ai");

  return {
    company: ctx.companyName || "[Your Company Name]",
    email: ctx.contactEmail || "[your-email@example.com]",
    services: scan.services.map((s) => s.name).join(", ") || "None detected",
    dataCategories:
      scan.dataCategories.map((c) => c.category).join(", ") || "None detected",
    jurisdiction: ctx.jurisdiction || ctx.jurisdictions?.join(", ") || "Not specified",
    date: new Date().toISOString().split("T")[0],
    dpo: ctx.dpoName
      ? `${ctx.dpoName}${ctx.dpoEmail ? ` (${ctx.dpoEmail})` : ""}`
      : ctx.dpoEmail || "Not designated",
    hasAI: aiServices.length > 0,
  };
}

/**
 * Render a template string by substituting {{variable}} placeholders
 * and evaluating {{#if condition}}...{{/if}} conditionals.
 */
export function renderTemplate(
  template: string,
  variables: TemplateVariables,
): string {
  let result = template;

  // Process {{#if variable}}...{{/if}} conditionals (non-greedy, supports nesting by processing innermost first)
  // We iterate until no more conditionals remain to handle nested blocks.
  let maxIterations = 50;
  while (maxIterations-- > 0) {
    const conditionalPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/;
    const match = conditionalPattern.exec(result);
    if (!match) break;

    const varName = match[1];
    const body = match[2];
    const value = variables[varName];
    const isTruthy =
      value === true ||
      (typeof value === "string" && value.length > 0 && value !== "Not specified" && value !== "Not designated" && value !== "None detected");

    result = result.slice(0, match.index) + (isTruthy ? body : "") + result.slice(match.index + match[0].length);
  }

  // Substitute {{variable}} placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, varName: string) => {
    const value = variables[varName];
    if (value === undefined) return `{{${varName}}}`;
    if (typeof value === "boolean") return String(value);
    return value;
  });

  return result;
}

/**
 * Check whether a custom template exists for a given document filename.
 */
export function hasCustomTemplate(
  projectPath: string,
  docFilename: string,
): boolean {
  const templateFilename = TEMPLATE_MAP[docFilename];
  if (!templateFilename) return false;

  const templatePath = path.join(projectPath, TEMPLATES_DIR, templateFilename);
  return fs.existsSync(templatePath);
}

/**
 * Load and render a custom template for a given document filename.
 * Returns null if no custom template exists.
 */
export function renderCustomTemplate(
  projectPath: string,
  docFilename: string,
  scan: ScanResult,
  ctx: GeneratorContext,
): string | null {
  const templateFilename = TEMPLATE_MAP[docFilename];
  if (!templateFilename) return null;

  const templatePath = path.join(projectPath, TEMPLATES_DIR, templateFilename);
  if (!fs.existsSync(templatePath)) return null;

  const template = fs.readFileSync(templatePath, "utf-8");
  const variables = buildVariables(scan, ctx);
  return renderTemplate(template, variables);
}

/**
 * Get the template directory path for a project.
 */
export function getTemplatesDir(projectPath: string): string {
  return path.join(projectPath, TEMPLATES_DIR);
}

/**
 * Return the full template map (document filename -> template filename).
 */
export function getTemplateMap(): Record<string, string> {
  return { ...TEMPLATE_MAP };
}

// ── Default template content for `codepliant template init` ──────────

const DEFAULT_TEMPLATES: Record<string, string> = {
  "privacy-policy.md": `# Privacy Policy

**Effective Date:** {{date}}

## Introduction

{{company}} ("we", "us", "our") operates this service. This Privacy Policy explains how we collect, use, and share your personal information.

**Contact:** {{email}}
{{#if dpo}}
**Data Protection Officer:** {{dpo}}
{{/if}}

## Information We Collect

We collect the following categories of data:

{{dataCategories}}

## Third-Party Services

We use the following third-party services:

{{services}}

{{#if hasAI}}
## AI Services

This application uses AI-powered features. Your data may be processed by AI service providers as described in our AI Disclosure document.
{{/if}}

## Jurisdiction

This policy is governed under: {{jurisdiction}}

## Contact Us

For questions about this policy, contact us at {{email}}.

---

*This document was generated by Codepliant and should be reviewed by legal counsel.*
`,

  "terms-of-service.md": `# Terms of Service

**Effective Date:** {{date}}

## Agreement

By using the services provided by {{company}}, you agree to these terms.

**Contact:** {{email}}

## Services

We provide the following services and integrations:

{{services}}

## Data Handling

We handle the following categories of data:

{{dataCategories}}

{{#if hasAI}}
## AI-Powered Features

Our service includes AI-powered features. By using these features, you acknowledge that your inputs may be processed by third-party AI providers.
{{/if}}

## Governing Law

These terms are governed by the laws of: {{jurisdiction}}

## Contact

For questions, contact us at {{email}}.

---

*This document was generated by Codepliant and should be reviewed by legal counsel.*
`,

  "ai-disclosure.md": `# AI Disclosure

**Effective Date:** {{date}}

{{company}} uses artificial intelligence in its products and services.

## AI Services Used

{{services}}

## Data Processing

The following data categories may be processed by AI systems:

{{dataCategories}}

## Contact

For questions about our AI practices, contact {{email}}.
{{#if dpo}}

**Data Protection Officer:** {{dpo}}
{{/if}}

---

*This document was generated by Codepliant and should be reviewed by legal counsel.*
`,

  "cookie-policy.md": `# Cookie Policy

**Effective Date:** {{date}}

{{company}} uses cookies and similar technologies.

## Services Using Cookies

{{services}}

## Data Collected

{{dataCategories}}

## Contact

For questions about our cookie practices, contact {{email}}.

---

*This document was generated by Codepliant and should be reviewed by legal counsel.*
`,
};

/**
 * Initialize the templates directory with default templates.
 * Returns the list of created file paths.
 */
export function initTemplates(projectPath: string): string[] {
  const templatesDir = getTemplatesDir(projectPath);

  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const created: string[] = [];

  for (const [filename, content] of Object.entries(DEFAULT_TEMPLATES)) {
    const filePath = path.join(templatesDir, filename);
    // Do not overwrite existing templates
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf-8");
      created.push(filePath);
    }
  }

  return created;
}
