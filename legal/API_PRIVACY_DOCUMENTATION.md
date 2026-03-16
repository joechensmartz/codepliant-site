# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** codepliant

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

3 API endpoint(s) accepting user data via POST, PUT requests. Data fields collected: email, name.

Total API endpoints detected: **6**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 3 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 6 |
| Read-only endpoints (GET/QUERY) | 0 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `/api/chat` | POST | — | — |
| `/api/checkout` | POST | — | — |
| `/api/chat` | POST | — | — |
| `/route` | POST | email, name | Contact, Identity |
| `/route` | POST | email, name | Contact, Identity |
| `/route` | PUT | email, name | Contact, Identity |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Contact | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Identity | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Financial Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Usage & Behavioral Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| AI Interaction Data | AI and Automated Processing | Contractual necessity / Consent | [X] days |
| User-Uploaded Content | User Content | Contractual necessity (Art. 6(1)(b)) | Until deletion requested |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Contact Information | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| API Data Collection | Information You Provide via API | Contractual necessity (Art. 6(1)(b)) | Duration of account |

## Detailed Endpoint Documentation

### `POST /api/chat`

| Property | Value |
|----------|-------|
| **File** | `examples/nextjs-saas/src/app/api/chat/route.ts` |
| **Method** | POST |
| **Route** | `/api/chat` |
| **Data fields** | None detected |

### `POST /api/checkout`

| Property | Value |
|----------|-------|
| **File** | `examples/nextjs-saas/src/app/api/checkout/route.ts` |
| **Method** | POST |
| **Route** | `/api/checkout` |
| **Data fields** | None detected |

### `POST /api/chat`

| Property | Value |
|----------|-------|
| **File** | `examples/sample-output/source-code/src/app/api/chat/route.ts` |
| **Method** | POST |
| **Route** | `/api/chat` |
| **Data fields** | None detected |

### `POST /route`

| Property | Value |
|----------|-------|
| **File** | `src/generator/api-documentation.ts` |
| **Method** | POST |
| **Route** | `/route` |
| **Data fields** | email, name |
| **Privacy categories** | Contact, Identity |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `email` | Contact | [YES/NO] | [Describe purpose] |
| `name` | Identity | [YES/NO] | [Describe purpose] |

### `POST /route`

| Property | Value |
|----------|-------|
| **File** | `src/scanner/api-routes.ts` |
| **Method** | POST |
| **Route** | `/route` |
| **Data fields** | email, name |
| **Privacy categories** | Contact, Identity |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `email` | Contact | [YES/NO] | [Describe purpose] |
| `name` | Identity | [YES/NO] | [Describe purpose] |

### `PUT /route`

| Property | Value |
|----------|-------|
| **File** | `src/scanner/api-routes.ts` |
| **Method** | PUT |
| **Route** | `/route` |
| **Data fields** | email, name |
| **Privacy categories** | Contact, Identity |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `email` | Contact | [YES/NO] | [Describe purpose] |
| `name` | Identity | [YES/NO] | [Describe purpose] |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| @anthropic-ai/sdk | ai | user prompts, conversation history, generated content | [Describe purpose] |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages | [Describe purpose] |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | [Describe purpose] |
| CarrierWave | storage | uploaded files, file metadata, image versions, potential PII in uploaded content | [Describe purpose] |
| Django Channels | other | real-time user data, connection metadata, channel group data, WebSocket messages | [Describe purpose] |
| NestJS WebSockets | other | real-time user data, connection metadata, IP address, WebSocket messages | [Describe purpose] |
| openai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | [Describe purpose] |
| stripe | payment | payment information, billing address, email, transaction history | [Describe purpose] |
| UploadThing | storage | uploaded files, file metadata, user identity, potential PII in uploaded content | [Describe purpose] |

## Recommendations

- [ ] Document the purpose and legal basis for each data field collected
- [ ] Implement input validation on all endpoints accepting user data
- [ ] Add rate limiting to prevent abuse of data-accepting endpoints
- [ ] Ensure authentication is required for all endpoints accessing personal data
- [ ] Implement field-level encryption for sensitive data (SSN, financial data)
- [ ] Add API versioning to manage privacy-impacting changes
- [ ] Log all data access for audit trail purposes
- [ ] Document data retention periods for each endpoint's data

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Data Dictionary (`DATA_DICTIONARY.md`)

---

*This API privacy documentation was generated by [Codepliant](https://github.com/codepliant/codepliant) based on an automated scan of the **codepliant** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
