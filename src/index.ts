// Codepliant - Compliance documents from your code
// Public API for programmatic usage

export { scan } from "./scanner/index.js";
export type {
  ScanResult,
  DetectedService,
  ComplianceNeed,
  DataCategory,
} from "./scanner/index.js";

export { generateDocuments, writeDocuments } from "./generator/index.js";
export type { GeneratedDocument, GeneratorContext } from "./generator/index.js";

export { loadConfig, saveConfig, configExists, validateConfig } from "./config.js";
export type { CodepliantConfig, ConfigWarning } from "./config.js";

export { writeMarkdown, writeHtml, writeDocumentsInFormat, getOutputFormat, generateComplianceReport, writeComplianceReport } from "./output/index.js";
export type { OutputFormat, ComplianceReportOptions } from "./output/index.js";

export { generateBadge, writeBadges } from "./output/badge.js";
export type { BadgeResult } from "./output/badge.js";

export { generateEnvExample, writeEnvExample } from "./generator/env-example.js";

export { installHook, uninstallHook, getLefthookSnippet } from "./hook.js";
export type { HookInstallResult, HookUninstallResult } from "./hook.js";

export { renderTemplate, buildVariables, initTemplates, hasCustomTemplate, renderCustomTemplate, getTemplatesDir } from "./templates/engine.js";
export type { TemplateVariables } from "./templates/engine.js";

export { loadPlugins } from "./plugins/loader.js";
export type {
  CodepliantPlugin,
  CustomScanner,
  CustomGenerator,
  ServiceSignature,
} from "./plugins/index.js";

export {
  computeComplianceScore,
  gradeFromScore,
  formatScoreBreakdown,
  formatScoreMarkdown,
  scoreColor,
  scoreStatus,
} from "./scoring/index.js";
export type {
  ComplianceScore,
  ScoreComponent,
  ScoreInput,
  Grade,
} from "./scoring/index.js";

export { sendNotification, buildPayload, formatSlackMessage, postWebhook } from "./notifications/index.js";
export type { NotificationPayload, NotificationResult } from "./notifications/index.js";
