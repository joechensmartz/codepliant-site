# Data Mapping Register

> **Document Version:** 1.0
> **Document Owner:** [Your Company Name]
> **Generated:** 2026-03-16 by [Codepliant](https://github.com/codepliant/codepliant)
> **Next Review Date:** 2027-03-16

This register provides a complete inventory of personal data processing activities
in compliance with GDPR Article 30 (Records of Processing Activities).

## 1. Data Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer Name] |
| **DPO Email** | [your-email@example.com] |
| **Register Last Updated** | 2026-03-16 |

## 2. Data Inventory

| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |
|---|-------------|-------------|--------|------------------|-------------|--------------|-----------|
| 1 | user prompts | General | User-provided / Application-generated | @anthropic-ai/sdk (third-party) | @anthropic-ai/sdk, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 2 | conversation history | General | User-provided / Application-generated | @anthropic-ai/sdk (third-party) | @anthropic-ai/sdk, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 3 | generated content | General | User-provided / Application-generated | @anthropic-ai/sdk (third-party) | @anthropic-ai/sdk, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 4 | real-time user data | General | Application-collected | ActionCable (third-party) | ActionCable, Django Channels, NestJS WebSockets | To be determined | To be determined |
| 5 | connection metadata | General | Application-collected | ActionCable (third-party) | ActionCable, Django Channels, NestJS WebSockets | To be determined | To be determined |
| 6 | channel subscriptions | Indirectly Identifiable | Automatic collection (HTTP request) | ActionCable (third-party) | ActionCable, Django Channels, NestJS WebSockets | To be determined | To be determined |
| 7 | WebSocket messages | General | Application-collected | ActionCable (third-party) | ActionCable, Django Channels, NestJS WebSockets | To be determined | To be determined |
| 8 | uploaded files | General | Application-collected | Active Storage (third-party) | Active Storage, CarrierWave, UploadThing | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 9 | file metadata | General | Application-collected | Active Storage (third-party) | Active Storage, CarrierWave, UploadThing | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 10 | storage service credentials | Security Credential | Application-collected | Active Storage (third-party) | Active Storage, CarrierWave, UploadThing | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 11 | potential PII in uploaded content | General | Application-collected | Active Storage (third-party) | Active Storage, CarrierWave, UploadThing | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 12 | image versions | General | Application-collected | CarrierWave (third-party) | CarrierWave | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | channel group data | General | Application-collected | Django Channels (third-party) | Django Channels | To be determined | To be determined |
| 14 | IP address | Directly Identifiable | Automatic collection (HTTP request) | NestJS WebSockets (third-party) | NestJS WebSockets | To be determined | To be determined |
| 15 | user behavior | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 16 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 17 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 18 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 19 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 20 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 21 | email | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 22 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 23 | user identity | General | Application-collected | UploadThing (third-party) | UploadThing | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 25 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | To be determined |
| 26 | AI Interaction Data | General | openai | Application database | Internal only | To be determined | To be determined |
| 27 | User-Uploaded Content | General | UploadThing | Application database | Internal only | To be determined | To be determined |
| 28 | Stored User Data | General | Memcached | Application database | Internal only | To be determined | To be determined |
| 29 | Contact Information | General | User.email | Application database | Internal only | To be determined | To be determined |
| 30 | API Data Collection | General | src/generator/api-documentation.ts | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| user prompts | User-provided / Application-generated | @anthropic-ai/sdk, openai |
| conversation history | User-provided / Application-generated | @anthropic-ai/sdk, openai |
| generated content | User-provided / Application-generated | @anthropic-ai/sdk, openai |
| real-time user data | Application-collected | ActionCable, Django Channels, NestJS WebSockets |
| connection metadata | Application-collected | ActionCable, Django Channels, NestJS WebSockets |
| WebSocket messages | Application-collected | ActionCable, Django Channels, NestJS WebSockets |
| uploaded files | Application-collected | Active Storage, CarrierWave, UploadThing |
| file metadata | Application-collected | Active Storage, CarrierWave, UploadThing |
| potential PII in uploaded content | Application-collected | Active Storage, CarrierWave, UploadThing |
| image versions | Application-collected | CarrierWave |
| channel group data | Application-collected | Django Channels |
| user behavior | Automatic collection (analytics SDK) | posthog |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| transaction history | Application-collected | stripe |
| user identity | Application-collected | UploadThing |
| Usage & Behavioral Data | posthog | Application database |
| AI Interaction Data | openai | Application database |
| User-Uploaded Content | UploadThing | Application database |
| Stored User Data | Memcached | Application database |
| Contact Information | User.email | Application database |
| API Data Collection | src/generator/api-documentation.ts | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| channel subscriptions | Automatic collection (HTTP request) | ActionCable, Django Channels, NestJS WebSockets |
| device information | Automatic collection (HTTP request) | posthog |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| storage service credentials | Application-collected | Active Storage, CarrierWave, UploadThing |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| IP address | Automatic collection (HTTP request) | NestJS WebSockets |
| billing address | User-provided (registration/form) | stripe |
| email | User-provided (registration/form) | stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @anthropic-ai/sdk | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | other | ⬜ To be verified |
| Django Channels | real-time user data, connection metadata, channel subscriptions, WebSocket messages, channel group data | other | ⬜ To be verified |
| NestJS WebSockets | real-time user data, connection metadata, channel subscriptions, WebSocket messages, IP address | other | ⬜ To be verified |
| Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| CarrierWave | uploaded files, file metadata, storage service credentials, potential PII in uploaded content, image versions | storage | ⬜ To be verified |
| UploadThing | uploaded files, file metadata, storage service credentials, potential PII in uploaded content, user identity | storage | ⬜ To be verified |
| posthog | user behavior, session recordings, feature flag usage, device information | analytics | ⬜ To be verified |
| stripe | payment information, billing address, email, transaction history | payment | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @anthropic-ai/sdk | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionCable | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Django Channels | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| NestJS WebSockets | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Active Storage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| CarrierWave | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| UploadThing | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Per AI provider policy / 30 days | Automated purge + manual verification | Consent / Legitimate interest |
| Indirectly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Directly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
