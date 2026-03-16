import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { CodepliantConfig } from "../config.js";
import type { CodepliantPlugin } from "../plugins/index.js";
import { generatePrivacyPolicy } from "./privacy-policy.js";
import { generateTermsOfService } from "./terms-of-service.js";
import { generateAIDisclosure } from "./ai-disclosure.js";
import { generateCookiePolicy } from "./cookie-policy.js";
import { generateDPA } from "./dpa.js";
import { generateAIChecklist } from "./ai-checklist.js";
import { generateComplianceNotes } from "./compliance-notes.js";
import { generateSubprocessorList } from "./subprocessor-list.js";
import { generateDataFlowMapDocument } from "../scanner/data-flow.js";
import { generateSecurityPolicy } from "./security-policy.js";
import { generateDataRetentionPolicy } from "./data-retention.js";
import { generateIncidentResponsePlan } from "./incident-response.js";
import { generateConsentGuide } from "./consent-guide.js";
import { generateDSARGuide } from "./dsar-guide.js";
import { generatePIA } from "./pia.js";
import { generateThirdPartyRiskAssessment } from "./third-party-risk.js";
import { generateEnvAudit } from "../scanner/env-audit.js";
import { generateVulnerabilityReport } from "../scanner/vulnerability.js";
import { generateSOC2Checklist } from "./soc2-checklist.js";
import { generateComplianceTimeline } from "./compliance-timeline.js";
import { generateDataClassification } from "../scanner/data-classification.js";
import { generateEmployeePrivacyNotice } from "./employee-privacy.js";
import { generateAIModelCard } from "./ai-model-card.js";
import { generateVendorContacts } from "./vendor-contacts.js";
import { generateRegulatoryUpdates } from "./regulatory-updates.js";
import { applyOverrides } from "./customization.js";
import { hasCustomTemplate, renderCustomTemplate } from "../templates/engine.js";

export interface GeneratedDocument {
  name: string;
  filename: string;
  content: string;
}

export interface GeneratorContext {
  companyName: string;
  contactEmail: string;
  website?: string;
  jurisdiction?: string;
  dpoName?: string;
  dpoEmail?: string;
  euRepresentative?: string;
  dataRetentionDays?: number;
  aiRiskLevel?: "minimal" | "limited" | "high";
  aiUsageDescription?: string;
  jurisdictions?: string[];
  companyLocation?: string;
  tollFreeNumber?: string;
  securityEmail?: string;
  bugBountyUrl?: string;
  sectionOverrides?: Record<string, string>;
  language?: string;
}

function configToContext(config?: CodepliantConfig): GeneratorContext {
  return {
    companyName: config?.companyName || "[Your Company Name]",
    contactEmail: config?.contactEmail || "[your-email@example.com]",
    website: config?.website,
    jurisdiction: config?.jurisdiction,
    dpoName: config?.dpoName,
    dpoEmail: config?.dpoEmail,
    euRepresentative: config?.euRepresentative,
    dataRetentionDays: config?.dataRetentionDays,
    aiRiskLevel: config?.aiRiskLevel,
    aiUsageDescription: config?.aiUsageDescription,
    jurisdictions: config?.jurisdictions,
    companyLocation: config?.companyLocation,
    tollFreeNumber: config?.tollFreeNumber,
    securityEmail: config?.securityEmail,
    bugBountyUrl: config?.bugBountyUrl,
    sectionOverrides: config?.sectionOverrides,
    language: config?.language,
  };
}

export function generateDocuments(
  scan: ScanResult,
  config?: CodepliantConfig,
  plugins?: CodepliantPlugin[]
): GeneratedDocument[] {
  const ctx = configToContext(config);
  const docs: GeneratedDocument[] = [];

  // Filter out non-data-processors (utility libs like zod, @tanstack/react-query, etc.)
  // They remain in scan output for transparency, but are excluded from compliance docs.
  const filteredScan: ScanResult = {
    ...scan,
    services: scan.services.filter((s) => s.isDataProcessor !== false),
  };
  // Use filteredScan for all doc generation below
  const docScan = filteredScan;

  // Always generate Privacy Policy if services detected
  if (docScan.services.length > 0) {
    docs.push({
      name: "Privacy Policy",
      filename: "PRIVACY_POLICY.md",
      content: generatePrivacyPolicy(docScan, ctx),
    });
  }

  // Always generate Terms of Service
  docs.push({
    name: "Terms of Service",
    filename: "TERMS_OF_SERVICE.md",
    content: generateTermsOfService(docScan, ctx),
  });

  // Always generate Security Policy (every project needs SECURITY.md)
  docs.push({
    name: "Security Policy",
    filename: "SECURITY.md",
    content: generateSecurityPolicy(docScan, ctx),
  });

  // Always generate Incident Response Plan (every project needs this)
  docs.push({
    name: "Incident Response Plan",
    filename: "INCIDENT_RESPONSE_PLAN.md",
    content: generateIncidentResponsePlan(docScan, ctx),
  });

  // AI Disclosure only if AI services detected
  const aiDisclosure = generateAIDisclosure(docScan, ctx);
  if (aiDisclosure) {
    docs.push({
      name: "AI Disclosure",
      filename: "AI_DISCLOSURE.md",
      content: aiDisclosure,
    });
  }

  // AI Checklist only if AI services detected
  const aiChecklist = generateAIChecklist(docScan, ctx);
  if (aiChecklist) {
    docs.push({
      name: "AI Act Compliance Checklist",
      filename: "AI_ACT_CHECKLIST.md",
      content: aiChecklist,
    });
  }


  // AI Model Card only if AI services detected (EU AI Act Art. 53)
  const aiModelCard = generateAIModelCard(docScan, ctx);
  if (aiModelCard) {
    docs.push({
      name: "AI Model Card",
      filename: "AI_MODEL_CARD.md",
      content: aiModelCard,
    });
  }

  // Cookie Policy only if analytics/auth detected
  const cookiePolicy = generateCookiePolicy(docScan, ctx);
  if (cookiePolicy) {
    docs.push({
      name: "Cookie Policy",
      filename: "COOKIE_POLICY.md",
      content: cookiePolicy,
    });
  }

  // Consent Management Guide only if analytics/advertising detected
  const consentGuide = generateConsentGuide(docScan, ctx);
  if (consentGuide) {
    docs.push({
      name: "Consent Management Guide",
      filename: "CONSENT_MANAGEMENT_GUIDE.md",
      content: consentGuide,
    });
  }

  // Data Processing Agreement if third-party data processors detected
  const dpa = generateDPA(docScan, ctx);
  if (dpa) {
    docs.push({
      name: "Data Processing Agreement",
      filename: "DATA_PROCESSING_AGREEMENT.md",
      content: dpa,
    });
  }

  // Sub-Processor List when 3+ third-party services detected
  const subprocessorList = generateSubprocessorList(docScan, ctx);
  if (subprocessorList) {
    docs.push({
      name: "Sub-Processor List",
      filename: "SUBPROCESSOR_LIST.md",
      content: subprocessorList,
    });
  }

  // Data Retention Policy when 3+ services detected
  const dataRetentionPolicy = generateDataRetentionPolicy(docScan, ctx);
  if (dataRetentionPolicy) {
    docs.push({
      name: "Data Retention Policy",
      filename: "DATA_RETENTION_POLICY.md",
      content: dataRetentionPolicy,
    });
  }

  // DSAR Handling Guide when services detected
  const dsarGuide = generateDSARGuide(docScan, ctx);
  if (dsarGuide) {
    docs.push({
      name: "DSAR Handling Guide",
      filename: "DSAR_HANDLING_GUIDE.md",
      content: dsarGuide,
    });
  }

  // Vendor Contacts Directory — DPA contacts, privacy emails, deletion URLs for DSAR handling
  const vendorContacts = generateVendorContacts(docScan, ctx);
  if (vendorContacts) {
    docs.push({
      name: "Vendor Contacts Directory",
      filename: "VENDOR_CONTACTS.md",
      content: vendorContacts,
    });
  }

  // Data Flow Map — standalone document showing data collection, storage, and sharing
  if (docScan.services.length > 0) {
    docs.push({
      name: "Data Flow Map",
      filename: "DATA_FLOW_MAP.md",
      content: generateDataFlowMapDocument(docScan, ctx.companyName),
    });
  }

  // Compliance Notes — regulation overview based on detected services + jurisdictions
  const complianceNotes = generateComplianceNotes(docScan, ctx);
  if (complianceNotes) {
    docs.push({
      name: "Compliance Notes",
      filename: "COMPLIANCE_NOTES.md",
      content: complianceNotes,
    });
  }

  // Compliance Timeline — deadlines, per-project obligations, action items, review schedule
  const complianceTimeline = generateComplianceTimeline(docScan, ctx);
  if (complianceTimeline) {
    docs.push({
      name: "Compliance Timeline",
      filename: "COMPLIANCE_TIMELINE.md",
      content: complianceTimeline,
    });
  }

  // SOC 2 Readiness Checklist when 5+ services detected
  const soc2Checklist = generateSOC2Checklist(docScan, ctx);
  if (soc2Checklist) {
    docs.push({
      name: "SOC 2 Readiness Checklist",
      filename: "SOC2_READINESS_CHECKLIST.md",
      content: soc2Checklist,
    });
  }

  // Third-Party Risk Assessment when 3+ third-party services detected
  const thirdPartyRisk = generateThirdPartyRiskAssessment(docScan, ctx);
  if (thirdPartyRisk) {
    docs.push({
      name: "Third-Party Risk Assessment",
      filename: "THIRD_PARTY_RISK_ASSESSMENT.md",
      content: thirdPartyRisk,
    });
  }

  // Privacy Impact Assessment (DPIA) only when AI or analytics services detected
  const pia = generatePIA(docScan, ctx);
  if (pia) {
    docs.push({
      name: "Privacy Impact Assessment",
      filename: "PRIVACY_IMPACT_ASSESSMENT.md",
      content: pia,
    });
  }

  // Environment Variable Audit
  const envAudit = generateEnvAudit(docScan.projectPath);
  if (envAudit) {
    docs.push({
      name: "Environment Variable Audit",
      filename: "ENV_AUDIT.md",
      content: envAudit,
    });
  }

  // Data Classification Report — GDPR sensitivity classification of all detected data
  const dataClassification = generateDataClassification(docScan, { companyName: ctx.companyName });
  if (dataClassification) {
    docs.push({
      name: "Data Classification Report",
      filename: "DATA_CLASSIFICATION.md",
      content: dataClassification,
    });
  }

  // Dependency Vulnerability Scan
  const vulnReport = generateVulnerabilityReport(docScan.projectPath);
  if (vulnReport) {
    docs.push({
      name: "Dependency Vulnerability Scan",
      filename: "VULNERABILITY_SCAN.md",
      content: vulnReport,
    });
  }

  // Employee Privacy Notice — only when explicitly enabled via config
  if (config?.generateEmployeeNotice) {
    const employeeNotice = generateEmployeePrivacyNotice(docScan, ctx);
    if (employeeNotice) {
      docs.push({
        name: "Employee Privacy Notice",
        filename: "EMPLOYEE_PRIVACY_NOTICE.md",
        content: employeeNotice,
      });
    }
  }

  // Regulatory Updates — upcoming regulatory changes based on jurisdictions + services
  const regulatoryUpdates = generateRegulatoryUpdates(docScan, ctx);
  if (regulatoryUpdates) {
    docs.push({
      name: "Regulatory Updates",
      filename: "REGULATORY_UPDATES.md",
      content: regulatoryUpdates,
    });
  }

  // Run custom generators from plugins
  if (plugins) {
    for (const plugin of plugins) {
      if (plugin.generators) {
        for (const customGenerator of plugin.generators) {
          try {
            const doc = customGenerator.generate(docScan, ctx);
            if (doc) {
              docs.push(doc);
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              `Plugin generator "${customGenerator.name}" from "${plugin.name}" failed: ${message}`
            );
          }
        }
      }
    }
  }

  // Apply custom templates: if a user template exists for a document, use it
  // instead of the built-in generated content
  for (const doc of docs) {
    const customContent = renderCustomTemplate(docScan.projectPath, doc.filename, docScan, ctx);
    if (customContent !== null) {
      doc.content = customContent;
    }
  }

  // Apply section-level overrides if configured
  if (ctx.sectionOverrides && Object.keys(ctx.sectionOverrides).length > 0) {
    for (const doc of docs) {
      doc.content = applyOverrides(doc.content, ctx.sectionOverrides);
    }
  }

  return docs;
}

export function writeDocuments(
  docs: GeneratedDocument[],
  outputDir: string
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];

  for (const doc of docs) {
    const filePath = path.join(outputDir, doc.filename);
    fs.writeFileSync(filePath, doc.content, "utf-8");
    writtenFiles.push(filePath);
  }

  return writtenFiles;
}
