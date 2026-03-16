# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** codepliant
**Company:** [Your Company Name]
**Generated:** 2026-03-16
**Classification Standard:** GDPR (General Data Protection Regulation)

## Related Documents

- Data Dictionary (`DATA_DICTIONARY.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

## Summary

| Sensitivity Level | Count | Description |
|-------------------|-------|-------------|
| Special Category (Art. 9) | 0 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 5 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 7 | Contact info (email, phone), identity (name, DOB), location |
| Low | 47 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 59

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| storage service credentials | Active Storage | High | Authentication credential | Until account deletion; rotate regularly |
| payment information | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| billing address | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| transaction history | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| Payment card information, billing addresses, and transaction history processed through payment providers. | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| email | stripe | Medium | Contact — email | Until account deletion or consent withdrawal |
| email addresses detected in TypeORM/Sequelize model fields: User.email. email addresses, phone numbers detected in Mongoose model fields: UnknownModel.email, UnknownModel.phone. email addresses detected in Drizzle ORM table fields: users.email. | User.email | Medium | Contact — email | Until account deletion or consent withdrawal |
| email addresses detected in TypeORM/Sequelize model fields: User.email. email addresses, phone numbers detected in Mongoose model fields: UnknownModel.email, UnknownModel.phone. email addresses detected in Drizzle ORM table fields: users.email. | UnknownModel.email | Medium | Contact — email | Until account deletion or consent withdrawal |
| email addresses detected in TypeORM/Sequelize model fields: User.email. email addresses, phone numbers detected in Mongoose model fields: UnknownModel.email, UnknownModel.phone. email addresses detected in Drizzle ORM table fields: users.email. | UnknownModel.phone | Medium | Contact — email | Until account deletion or consent withdrawal |
| email addresses detected in TypeORM/Sequelize model fields: User.email. email addresses, phone numbers detected in Mongoose model fields: UnknownModel.email, UnknownModel.phone. email addresses detected in Drizzle ORM table fields: users.email. | users.email | Medium | Contact — email | Until account deletion or consent withdrawal |
| 3 API endpoint(s) accepting user data via POST, PUT requests. Data fields collected: email, name. | src/generator/api-documentation.ts | Medium | Contact — email | Until account deletion or consent withdrawal |
| 3 API endpoint(s) accepting user data via POST, PUT requests. Data fields collected: email, name. | src/scanner/api-routes.ts | Medium | Contact — email | Until account deletion or consent withdrawal |
| user prompts | @anthropic-ai/sdk | Low | Unclassified data | Review and define retention policy |
| conversation history | @anthropic-ai/sdk | Low | Unclassified data | Review and define retention policy |
| generated content | @anthropic-ai/sdk | Low | Unclassified data | Review and define retention policy |
| real-time user data | ActionCable | Low | Unclassified data | Review and define retention policy |
| connection metadata | ActionCable | Low | Unclassified data | Review and define retention policy |
| channel subscriptions | ActionCable | Low | Unclassified data | Review and define retention policy |
| WebSocket messages | ActionCable | Low | Unclassified data | Review and define retention policy |
| uploaded files | Active Storage | Low | Unclassified data | Review and define retention policy |
| file metadata | Active Storage | Low | Unclassified data | Review and define retention policy |
| potential PII in uploaded content | Active Storage | Low | Unclassified data | Review and define retention policy |
| uploaded files | CarrierWave | Low | Unclassified data | Review and define retention policy |
| file metadata | CarrierWave | Low | Unclassified data | Review and define retention policy |
| image versions | CarrierWave | Low | Unclassified data | Review and define retention policy |
| potential PII in uploaded content | CarrierWave | Low | Unclassified data | Review and define retention policy |
| real-time user data | Django Channels | Low | Unclassified data | Review and define retention policy |
| connection metadata | Django Channels | Low | Unclassified data | Review and define retention policy |
| channel group data | Django Channels | Low | Unclassified data | Review and define retention policy |
| WebSocket messages | Django Channels | Low | Unclassified data | Review and define retention policy |
| real-time user data | NestJS WebSockets | Low | Unclassified data | Review and define retention policy |
| connection metadata | NestJS WebSockets | Low | Unclassified data | Review and define retention policy |
| IP address | NestJS WebSockets | Low | Technical — device/network | 90 days |
| WebSocket messages | NestJS WebSockets | Low | Unclassified data | Review and define retention policy |
| user prompts | openai | Low | Unclassified data | Review and define retention policy |
| conversation history | openai | Low | Unclassified data | Review and define retention policy |
| generated content | openai | Low | Unclassified data | Review and define retention policy |
| user behavior | posthog | Low | Behavioral — analytics | 26 months |
| session recordings | posthog | Low | Behavioral — analytics | 26 months |
| feature flag usage | posthog | Low | Unclassified data | Review and define retention policy |
| device information | posthog | Low | Technical — device/network | 90 days |
| uploaded files | UploadThing | Low | Unclassified data | Review and define retention policy |
| file metadata | UploadThing | Low | Unclassified data | Review and define retention policy |
| user identity | UploadThing | Low | Unclassified data | Review and define retention policy |
| potential PII in uploaded content | UploadThing | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | posthog | Low | Behavioral — analytics | 26 months |
| AI Interaction Data | openai | Low | Unclassified data | Review and define retention policy |
| AI Interaction Data | @anthropic-ai/sdk | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | UploadThing | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | Active Storage | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | CarrierWave | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Memcached | Low | Unclassified data | Review and define retention policy |
| Financial Data | category:Financial Data | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | category:Usage & Behavioral Data | Low | Behavioral — analytics | 26 months |
| AI Interaction Data | category:AI Interaction Data | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | category:User-Uploaded Content | Low | Unclassified data | Review and define retention policy |
| Stored User Data | category:Stored User Data | Low | Unclassified data | Review and define retention policy |
| Contact Information | category:Contact Information | Low | Unclassified data | Review and define retention policy |
| API Data Collection | category:API Data Collection | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### High Sensitivity Data — 5 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 7 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 47 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
