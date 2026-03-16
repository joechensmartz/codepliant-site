/**
 * Shared utilities for appending "Review Notes" and "Related Documents" sections
 * to generated compliance documents.
 */

export interface ReviewSection {
  lawyerChecks: string[];
  autoVsHuman: Array<{
    section: string;
    status: string;
    confidence: "high" | "medium" | "low" | "N/A";
  }>;
}

export interface DocumentRelationship {
  name: string;
  filename: string;
}

/**
 * Build the "Review Notes" markdown section.
 */
export function buildReviewNotes(review: ReviewSection): string {
  const lines: string[] = [];
  lines.push("## Review Notes");
  lines.push("");
  lines.push("### What a lawyer should check");
  lines.push("");
  for (const check of review.lawyerChecks) {
    lines.push(`- ${check}`);
  }
  lines.push("");
  lines.push("### Auto-generated vs. needs human input");
  lines.push("");
  lines.push("| Section | Status | Confidence |");
  lines.push("|---------|--------|------------|");
  for (const item of review.autoVsHuman) {
    const conf =
      item.confidence === "N/A"
        ? "N/A"
        : item.confidence.charAt(0).toUpperCase() + item.confidence.slice(1);
    lines.push(`| ${item.section} | ${item.status} | ${conf} |`);
  }
  lines.push("");
  return lines.join("\n");
}

/**
 * Build the "Related Documents" markdown section.
 */
export function buildRelatedDocuments(docs: DocumentRelationship[]): string {
  const lines: string[] = [];
  lines.push("## Related Documents");
  lines.push("");
  for (const doc of docs) {
    lines.push(`- ${doc.name} (\`${doc.filename}\`)`);
  }
  lines.push("");
  return lines.join("\n");
}

/**
 * Document relationship map — defines which documents are related to each other.
 * Keyed by filename, value is an array of related document references.
 */
export const DOCUMENT_RELATIONSHIPS: Record<string, DocumentRelationship[]> = {
  "PRIVACY_POLICY.md": [
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md" },
    { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
    { name: "DSAR Handling Guide", filename: "DSAR_HANDLING_GUIDE.md" },
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "Data Subject Categories", filename: "DATA_SUBJECT_CATEGORIES.md" },
    { name: "Lawful Basis Assessment", filename: "LAWFUL_BASIS_ASSESSMENT.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
  ],
  "TERMS_OF_SERVICE.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Acceptable Use Policy", filename: "ACCEPTABLE_USE_POLICY.md" },
    { name: "Refund Policy", filename: "REFUND_POLICY.md" },
    { name: "Service Level Agreement", filename: "SERVICE_LEVEL_AGREEMENT.md" },
  ],
  "SECURITY.md": [
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
    { name: "Encryption Policy", filename: "ENCRYPTION_POLICY.md" },
    { name: "Penetration Test Scope", filename: "PENTEST_SCOPE.md" },
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
  ],
  "INCIDENT_RESPONSE_PLAN.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Data Breach Notification Templates", filename: "DATA_BREACH_NOTIFICATION_TEMPLATE.md" },
    { name: "Business Continuity Plan", filename: "BUSINESS_CONTINUITY_PLAN.md" },
    { name: "Disaster Recovery Plan", filename: "DISASTER_RECOVERY_PLAN.md" },
  ],
  "AI_DISCLOSURE.md": [
    { name: "AI Act Compliance Checklist", filename: "AI_ACT_CHECKLIST.md" },
    { name: "AI Model Card", filename: "AI_MODEL_CARD.md" },
    { name: "Acceptable AI Use Policy", filename: "ACCEPTABLE_AI_USE_POLICY.md" },
    { name: "AI Governance Framework", filename: "AI_GOVERNANCE_FRAMEWORK.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "COOKIE_POLICY.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Cookie Inventory", filename: "COOKIE_INVENTORY.md" },
    { name: "Consent Management Guide", filename: "CONSENT_MANAGEMENT_GUIDE.md" },
  ],
  "DATA_PROCESSING_AGREEMENT.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "Transfer Impact Assessment", filename: "TRANSFER_IMPACT_ASSESSMENT.md" },
    { name: "Supplier Code of Conduct", filename: "SUPPLIER_CODE_OF_CONDUCT.md" },
  ],
  "SUBPROCESSOR_LIST.md": [
    { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Vendor Contacts Directory", filename: "VENDOR_CONTACTS.md" },
    { name: "Third-Party Risk Assessment", filename: "THIRD_PARTY_RISK_ASSESSMENT.md" },
    { name: "Transfer Impact Assessment", filename: "TRANSFER_IMPACT_ASSESSMENT.md" },
  ],
  "DATA_RETENTION_POLICY.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
    { name: "Data Dictionary", filename: "DATA_DICTIONARY.md" },
    { name: "DSAR Handling Guide", filename: "DSAR_HANDLING_GUIDE.md" },
  ],
  "DSAR_HANDLING_GUIDE.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Vendor Contacts Directory", filename: "VENDOR_CONTACTS.md" },
    { name: "Data Dictionary", filename: "DATA_DICTIONARY.md" },
    { name: "Data Subject Categories", filename: "DATA_SUBJECT_CATEGORIES.md" },
  ],
  "CONSENT_MANAGEMENT_GUIDE.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md" },
    { name: "Lawful Basis Assessment", filename: "LAWFUL_BASIS_ASSESSMENT.md" },
  ],
  "RECORD_OF_PROCESSING_ACTIVITIES.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Data Subject Categories", filename: "DATA_SUBJECT_CATEGORIES.md" },
    { name: "Lawful Basis Assessment", filename: "LAWFUL_BASIS_ASSESSMENT.md" },
    { name: "Data Retention Policy", filename: "DATA_RETENTION_POLICY.md" },
    { name: "Transfer Impact Assessment", filename: "TRANSFER_IMPACT_ASSESSMENT.md" },
  ],
  "COMPLIANCE_NOTES.md": [
    { name: "Compliance Timeline", filename: "COMPLIANCE_TIMELINE.md" },
    { name: "Annual Review Checklist", filename: "ANNUAL_REVIEW_CHECKLIST.md" },
    { name: "Regulatory Updates", filename: "REGULATORY_UPDATES.md" },
  ],
  "COMPLIANCE_TIMELINE.md": [
    { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
    { name: "Annual Review Checklist", filename: "ANNUAL_REVIEW_CHECKLIST.md" },
    { name: "Regulatory Updates", filename: "REGULATORY_UPDATES.md" },
  ],
  "RISK_REGISTER.md": [
    { name: "Privacy Impact Assessment", filename: "PRIVACY_IMPACT_ASSESSMENT.md" },
    { name: "Third-Party Risk Assessment", filename: "THIRD_PARTY_RISK_ASSESSMENT.md" },
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
  ],
  "THIRD_PARTY_RISK_ASSESSMENT.md": [
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "Vendor Contacts Directory", filename: "VENDOR_CONTACTS.md" },
    { name: "Vendor Security Questionnaire", filename: "VENDOR_SECURITY_QUESTIONNAIRE.md" },
    { name: "Risk Register", filename: "RISK_REGISTER.md" },
  ],
  "PRIVACY_IMPACT_ASSESSMENT.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
    { name: "Risk Register", filename: "RISK_REGISTER.md" },
    { name: "Lawful Basis Assessment", filename: "LAWFUL_BASIS_ASSESSMENT.md" },
  ],
  "DATA_FLOW_MAP.md": [
    { name: "Data Flow Diagram", filename: "DATA_FLOW_DIAGRAM.md" },
    { name: "Data Dictionary", filename: "DATA_DICTIONARY.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "DATA_DICTIONARY.md": [
    { name: "Data Flow Map", filename: "DATA_FLOW_MAP.md" },
    { name: "Data Retention Policy", filename: "DATA_RETENTION_POLICY.md" },
    { name: "Data Classification Report", filename: "DATA_CLASSIFICATION.md" },
  ],
  "ACCESS_CONTROL_POLICY.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
    { name: "Audit Log Policy", filename: "AUDIT_LOG_POLICY.md" },
  ],
  "CHANGE_MANAGEMENT_POLICY.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Business Continuity Plan", filename: "BUSINESS_CONTINUITY_PLAN.md" },
    { name: "Disaster Recovery Plan", filename: "DISASTER_RECOVERY_PLAN.md" },
  ],
  "AUDIT_LOG_POLICY.md": [
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
  ],
  "ENCRYPTION_POLICY.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
    { name: "Backup Policy", filename: "BACKUP_POLICY.md" },
  ],
  "BACKUP_POLICY.md": [
    { name: "Disaster Recovery Plan", filename: "DISASTER_RECOVERY_PLAN.md" },
    { name: "Business Continuity Plan", filename: "BUSINESS_CONTINUITY_PLAN.md" },
    { name: "Encryption Policy", filename: "ENCRYPTION_POLICY.md" },
  ],
  "DISASTER_RECOVERY_PLAN.md": [
    { name: "Business Continuity Plan", filename: "BUSINESS_CONTINUITY_PLAN.md" },
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
    { name: "Backup Policy", filename: "BACKUP_POLICY.md" },
  ],
  "BUSINESS_CONTINUITY_PLAN.md": [
    { name: "Disaster Recovery Plan", filename: "DISASTER_RECOVERY_PLAN.md" },
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
    { name: "Backup Policy", filename: "BACKUP_POLICY.md" },
  ],
  "INFORMATION_SECURITY_POLICY.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
    { name: "Encryption Policy", filename: "ENCRYPTION_POLICY.md" },
    { name: "ISO 27001 Compliance Checklist", filename: "ISO_27001_CHECKLIST.md" },
  ],
  "VENDOR_CONTACTS.md": [
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "DSAR Handling Guide", filename: "DSAR_HANDLING_GUIDE.md" },
    { name: "Third-Party Risk Assessment", filename: "THIRD_PARTY_RISK_ASSESSMENT.md" },
  ],
  "TRANSFER_IMPACT_ASSESSMENT.md": [
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
  ],
  "WHISTLEBLOWER_POLICY.md": [
    { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
    { name: "Employee Privacy Notice", filename: "EMPLOYEE_PRIVACY_NOTICE.md" },
  ],
  "EMPLOYEE_PRIVACY_NOTICE.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Data Subject Categories", filename: "DATA_SUBJECT_CATEGORIES.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
  ],
  "TRANSPARENCY_REPORT.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "DSAR Handling Guide", filename: "DSAR_HANDLING_GUIDE.md" },
    { name: "Annual Review Checklist", filename: "ANNUAL_REVIEW_CHECKLIST.md" },
  ],
  "ACCEPTABLE_USE_POLICY.md": [
    { name: "Terms of Service", filename: "TERMS_OF_SERVICE.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "REFUND_POLICY.md": [
    { name: "Terms of Service", filename: "TERMS_OF_SERVICE.md" },
  ],
  "SERVICE_LEVEL_AGREEMENT.md": [
    { name: "Terms of Service", filename: "TERMS_OF_SERVICE.md" },
    { name: "Business Continuity Plan", filename: "BUSINESS_CONTINUITY_PLAN.md" },
  ],
  "DATA_FLOW_DIAGRAM.md": [
    { name: "Data Flow Map", filename: "DATA_FLOW_MAP.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "AI_ACT_CHECKLIST.md": [
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md" },
    { name: "AI Model Card", filename: "AI_MODEL_CARD.md" },
    { name: "AI Governance Framework", filename: "AI_GOVERNANCE_FRAMEWORK.md" },
  ],
  "AI_MODEL_CARD.md": [
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md" },
    { name: "AI Act Compliance Checklist", filename: "AI_ACT_CHECKLIST.md" },
    { name: "AI Governance Framework", filename: "AI_GOVERNANCE_FRAMEWORK.md" },
  ],
  "ACCEPTABLE_AI_USE_POLICY.md": [
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md" },
    { name: "AI Governance Framework", filename: "AI_GOVERNANCE_FRAMEWORK.md" },
  ],
  "AI_GOVERNANCE_FRAMEWORK.md": [
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md" },
    { name: "AI Model Card", filename: "AI_MODEL_CARD.md" },
    { name: "Acceptable AI Use Policy", filename: "ACCEPTABLE_AI_USE_POLICY.md" },
    { name: "Risk Register", filename: "RISK_REGISTER.md" },
  ],
  "COOKIE_INVENTORY.md": [
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md" },
    { name: "Consent Management Guide", filename: "CONSENT_MANAGEMENT_GUIDE.md" },
  ],
  "DATA_BREACH_NOTIFICATION_TEMPLATE.md": [
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
    { name: "Security Policy", filename: "SECURITY.md" },
  ],
  "VENDOR_SECURITY_QUESTIONNAIRE.md": [
    { name: "Third-Party Risk Assessment", filename: "THIRD_PARTY_RISK_ASSESSMENT.md" },
    { name: "Supplier Code of Conduct", filename: "SUPPLIER_CODE_OF_CONDUCT.md" },
  ],
  "API_PRIVACY_DOCUMENTATION.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Data Dictionary", filename: "DATA_DICTIONARY.md" },
  ],
  "SUPPLIER_CODE_OF_CONDUCT.md": [
    { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
    { name: "Vendor Security Questionnaire", filename: "VENDOR_SECURITY_QUESTIONNAIRE.md" },
  ],
  "PRIVACY_BY_DESIGN_CHECKLIST.md": [
    { name: "Privacy Impact Assessment", filename: "PRIVACY_IMPACT_ASSESSMENT.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "PENTEST_SCOPE.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Vulnerability Scan", filename: "VULNERABILITY_SCAN.md" },
  ],
  "SOC2_READINESS_CHECKLIST.md": [
    { name: "Security Policy", filename: "SECURITY.md" },
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
    { name: "Change Management Policy", filename: "CHANGE_MANAGEMENT_POLICY.md" },
    { name: "Audit Log Policy", filename: "AUDIT_LOG_POLICY.md" },
  ],
  "ISO_27001_CHECKLIST.md": [
    { name: "Information Security Policy", filename: "INFORMATION_SECURITY_POLICY.md" },
    { name: "Risk Register", filename: "RISK_REGISTER.md" },
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
  ],
  "DATA_SUBJECT_CATEGORIES.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
    { name: "Lawful Basis Assessment", filename: "LAWFUL_BASIS_ASSESSMENT.md" },
    { name: "DSAR Handling Guide", filename: "DSAR_HANDLING_GUIDE.md" },
  ],
  "LAWFUL_BASIS_ASSESSMENT.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Data Subject Categories", filename: "DATA_SUBJECT_CATEGORIES.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
    { name: "Consent Management Guide", filename: "CONSENT_MANAGEMENT_GUIDE.md" },
  ],
  "ANNUAL_REVIEW_CHECKLIST.md": [
    { name: "Compliance Timeline", filename: "COMPLIANCE_TIMELINE.md" },
    { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
    { name: "Record of Processing Activities", filename: "RECORD_OF_PROCESSING_ACTIVITIES.md" },
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
  ],
  "REGULATORY_UPDATES.md": [
    { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
    { name: "Compliance Timeline", filename: "COMPLIANCE_TIMELINE.md" },
    { name: "Annual Review Checklist", filename: "ANNUAL_REVIEW_CHECKLIST.md" },
  ],
  "DATA_CLASSIFICATION.md": [
    { name: "Data Dictionary", filename: "DATA_DICTIONARY.md" },
    { name: "Data Retention Policy", filename: "DATA_RETENTION_POLICY.md" },
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
  ],
  "SUBPROCESSOR_CHANGE_NOTIFICATION.md": [
    { name: "Sub-Processor List", filename: "SUBPROCESSOR_LIST.md" },
    { name: "Data Processing Agreement", filename: "DATA_PROCESSING_AGREEMENT.md" },
    { name: "Third-Party Risk Assessment", filename: "THIRD_PARTY_RISK_ASSESSMENT.md" },
  ],
  "DATA_PROTECTION_POLICY.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Access Control Policy", filename: "ACCESS_CONTROL_POLICY.md" },
    { name: "Encryption Policy", filename: "ENCRYPTION_POLICY.md" },
    { name: "Data Retention Policy", filename: "DATA_RETENTION_POLICY.md" },
    { name: "Incident Response Plan", filename: "INCIDENT_RESPONSE_PLAN.md" },
  ],
  "MEDIA_CONSENT_FORM.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Data Protection Policy", filename: "DATA_PROTECTION_POLICY.md" },
  ],
  "COMPLIANCE_CERTIFICATE.md": [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    { name: "Compliance Notes", filename: "COMPLIANCE_NOTES.md" },
    { name: "Annual Review Checklist", filename: "ANNUAL_REVIEW_CHECKLIST.md" },
  ],
};

/**
 * Get related documents for a given filename. Returns empty array if
 * no relationships are defined.
 */
export function getRelatedDocuments(filename: string): DocumentRelationship[] {
  return DOCUMENT_RELATIONSHIPS[filename] || [];
}

/**
 * Review notes definitions per document filename.
 */
export const REVIEW_NOTES: Record<string, ReviewSection> = {
  "PRIVACY_POLICY.md": {
    lawyerChecks: [
      "Verify all data collection practices are accurately described",
      "Confirm legal basis selections for each processing purpose",
      "Check international transfer safeguards are properly documented",
      "Ensure CCPA/CPRA sections are complete if California residents are served",
      "Validate data retention periods against applicable laws",
      "Confirm DPO contact information is correct",
    ],
    autoVsHuman: [
      { section: "Third-party services list", status: "Auto-detected from code", confidence: "high" },
      { section: "Data categories", status: "Auto-detected from service types", confidence: "medium" },
      { section: "Legal basis table", status: "Auto-assigned defaults", confidence: "low" },
      { section: "Retention periods", status: "Template defaults", confidence: "low" },
      { section: "Contact information", status: "From config file", confidence: "high" },
      { section: "CCPA rights section", status: "Auto-generated if applicable", confidence: "medium" },
    ],
  },
  "TERMS_OF_SERVICE.md": {
    lawyerChecks: [
      "Review limitation of liability clauses for enforceability",
      "Confirm governing law and jurisdiction are correct",
      "Check that service description matches actual offering",
      "Verify termination provisions are fair and clear",
      "Ensure dispute resolution mechanism is appropriate",
    ],
    autoVsHuman: [
      { section: "Service description", status: "Template — needs customization", confidence: "low" },
      { section: "Liability limitations", status: "Standard template language", confidence: "medium" },
      { section: "User obligations", status: "Standard template language", confidence: "medium" },
      { section: "Governing law", status: "From config if provided", confidence: "medium" },
    ],
  },
  "SECURITY.md": {
    lawyerChecks: [
      "Verify security measures described match actual implementation",
      "Confirm responsible disclosure process is operational",
      "Check that response timelines are achievable",
      "Ensure contact information is current and monitored",
    ],
    autoVsHuman: [
      { section: "Security practices", status: "Template — needs verification", confidence: "medium" },
      { section: "Reporting process", status: "Standard template", confidence: "medium" },
      { section: "Contact information", status: "From config file", confidence: "high" },
    ],
  },
  "INCIDENT_RESPONSE_PLAN.md": {
    lawyerChecks: [
      "Verify notification timelines meet GDPR 72-hour requirement",
      "Confirm escalation procedures are realistic",
      "Check that all required roles are assigned",
      "Ensure breach notification templates are jurisdiction-appropriate",
    ],
    autoVsHuman: [
      { section: "Response procedures", status: "Standard template", confidence: "medium" },
      { section: "Notification timelines", status: "Based on GDPR requirements", confidence: "high" },
      { section: "Team assignments", status: "Placeholder — needs completion", confidence: "N/A" },
    ],
  },
  "DATA_PROCESSING_AGREEMENT.md": {
    lawyerChecks: [
      "Review all clauses against GDPR Article 28 requirements",
      "Confirm sub-processor list is complete",
      "Verify data transfer mechanisms (SCCs) are current",
      "Check audit rights provisions",
      "Validate data deletion/return obligations",
    ],
    autoVsHuman: [
      { section: "Contract clauses", status: "Standard GDPR template", confidence: "medium" },
      { section: "Sub-processor list", status: "Auto-detected from code", confidence: "high" },
      { section: "Technical measures", status: "Template defaults", confidence: "low" },
    ],
  },
  "RECORD_OF_PROCESSING_ACTIVITIES.md": {
    lawyerChecks: [
      "Verify all processing activities are documented",
      "Confirm lawful basis for each activity",
      "Check data transfer mechanisms are accurate",
      "Validate retention periods",
      "Ensure all data subject categories are covered",
    ],
    autoVsHuman: [
      { section: "Processing activities", status: "Auto-detected from code", confidence: "medium" },
      { section: "Lawful basis assignments", status: "Auto-assigned defaults", confidence: "low" },
      { section: "Transfer mechanisms", status: "Template defaults (SCCs)", confidence: "low" },
      { section: "Retention periods", status: "Placeholder — needs input", confidence: "N/A" },
    ],
  },
};

/**
 * Get review notes for a given filename. Returns null if none defined.
 */
export function getReviewNotes(filename: string): ReviewSection | null {
  return REVIEW_NOTES[filename] || null;
}
