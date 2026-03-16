# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** codepliant

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **codepliant** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

## 2. Scope

This dictionary covers data fields from:
- Database schemas (Prisma, Drizzle, Mongoose, TypeORM, SQLAlchemy, Django)
- API routes and request handlers
- Third-party service integrations
- Environment variable configurations

---

## 3. Data Field Catalog

| Field | Source | Type | Sensitivity | Retention | Purpose |
|-------|--------|------|-------------|-----------|---------|
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| storage service credentials | Active Storage | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| IP address | NestJS WebSockets | Location | High | Until account deletion | Billing, shipping, localization |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | @anthropic-ai/sdk | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | @anthropic-ai/sdk | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| uploaded_files | Active Storage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | CarrierWave | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | UploadThing | User Content | Medium | Until user-initiated deletion | File storage |
| user prompts | @anthropic-ai/sdk | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_prompts | @anthropic-ai/sdk | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| AI Interaction Data | openai | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @anthropic-ai/sdk | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | src/generator/api-documentation.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | src/scanner/api-routes.ts | Application Data | Low | Per data retention policy | Application functionality |
| channel group data | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| channel subscriptions | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | NestJS WebSockets | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | User.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | UnknownModel.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | UnknownModel.phone | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | users.email | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | CarrierWave | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | UploadThing | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | Active Storage | Metadata | Low | Until file deletion | File management |
| file_metadata | CarrierWave | Metadata | Low | Until file deletion | File management |
| file_metadata | UploadThing | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @anthropic-ai/sdk | Application Data | Low | Per data retention policy | Application functionality |
| generated content | openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | @anthropic-ai/sdk | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | openai | AI Output | Low | Per user deletion request | AI feature delivery |
| image versions | CarrierWave | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | CarrierWave | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | UploadThing | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | NestJS WebSockets | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Memcached | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | CarrierWave | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | UploadThing | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user identity | UploadThing | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | UploadThing | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | CarrierWave | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | NestJS WebSockets | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 2 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 6 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 15 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 49 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 72

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **API routes** — Data fields accepted via request handlers
- **Ai services** — @anthropic-ai/sdk, openai
- **Other services** — ActionCable, Django Channels, NestJS WebSockets
- **Storage services** — Active Storage, CarrierWave, UploadThing
- **Analytics services** — posthog
- **Payment services** — stripe

---

## 6. Related Documents

- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **DATA_RETENTION_POLICY.md** — Detailed retention schedules and deletion procedures
- **DATA_CLASSIFICATION.md** — GDPR sensitivity classification details
- **DATA_FLOW_MAP.md** — Visual representation of data flows between services
- **DSAR_HANDLING_GUIDE.md** — Data subject access request procedures

---

## 7. Maintenance

This data dictionary should be updated:

- When new database models or fields are added
- When new third-party services are integrated
- When data retention policies change
- At minimum **quarterly** as part of compliance review

For questions about this data dictionary, contact [your-email@example.com].

---

*This Data Dictionary was generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*