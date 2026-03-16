# Cross-Border Data Transfer Map

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Data Exporter Location:** [Your Location]
**Project:** codepliant
**Generated:** 2026-03-16

---

> This document maps all international data transfers identified through code analysis. It identifies the destination country, service provider, data types transferred, and applicable legal safeguards for each transfer. Required under GDPR Chapter V (Articles 44-49) for EU data exporters.

## Transfer Flow Diagram

```mermaid
graph LR
  A["[Your Company Name]<br/>[Your Location]"]
  C0["United States<br/>@anthropic-ai/sdk<br/>openai<br/>posthog<br/>stripe"]
  A -->|"SCCs"| C0
  C1["Unknown<br/>ActionCable<br/>Active Storage<br/>CarrierWave<br/>Django Channels<br/>NestJS WebSockets<br/>UploadThing"]
  A -->|"SCCs"| C1
```

## Transfer Summary by Country

| Country | Services | Data Types | Safeguard | Adequacy Decision |
|---------|----------|-----------|-----------|-------------------|
| United States (US) | @anthropic-ai/sdk, openai, posthog, stripe | user prompts, conversation history, generated content, user behavior | SCCs | No |
| Unknown (??) | ActionCable, Active Storage, CarrierWave, Django Channels, NestJS WebSockets, UploadThing | real-time user data, connection metadata, channel subscriptions, WebSocket messages | [Verify with provider] | No |

## Detailed Transfer Register

| # | Service | Category | Country | Data Types | Safeguard | DPF Certified | DPA in Place |
|---|---------|----------|---------|-----------|-----------|---------------|-------------|
| 1 | @anthropic-ai/sdk | ai | United States | user prompts, conversation history, generated content | SCCs | N/A | [ ] |
| 2 | ActionCable | other | Unknown | real-time user data, connection metadata, channel subscriptions | [Verify with provider] | N/A | [ ] |
| 3 | Active Storage | storage | Unknown | uploaded files, file metadata, storage service credentials | [Verify with provider] | N/A | [ ] |
| 4 | CarrierWave | storage | Unknown | uploaded files, file metadata, image versions | [Verify with provider] | N/A | [ ] |
| 5 | Django Channels | other | Unknown | real-time user data, connection metadata, channel group data | [Verify with provider] | N/A | [ ] |
| 6 | NestJS WebSockets | other | Unknown | real-time user data, connection metadata, IP address | [Verify with provider] | N/A | [ ] |
| 7 | openai | ai | United States | user prompts, conversation history, generated content | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 8 | posthog | analytics | United States | user behavior, session recordings, feature flag usage | SCCs | N/A | [ ] |
| 9 | stripe | payment | United States | payment information, billing address, email | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 10 | UploadThing | storage | Unknown | uploaded files, file metadata, user identity | [Verify with provider] | N/A | [ ] |

## Services Requiring Additional Safeguards

The following services transfer data to countries without an EU adequacy decision. Additional safeguards (SCCs + supplementary measures) are required per the Schrems II ruling.

### @anthropic-ai/sdk

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** user prompts, conversation history, generated content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### ActionCable

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** real-time user data, connection metadata, channel subscriptions, WebSocket messages
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### Active Storage

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### CarrierWave

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** uploaded files, file metadata, image versions, potential PII in uploaded content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### Django Channels

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** real-time user data, connection metadata, channel group data, WebSocket messages
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### NestJS WebSockets

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** real-time user data, connection metadata, IP address, WebSocket messages
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### posthog

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** user behavior, session recordings, feature flag usage, device information
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### UploadThing

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** uploaded files, file metadata, user identity, potential PII in uploaded content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

## Data Type × Service Matrix

| Data Type | @anthropic-ai/sdk | ActionCable | Active Storage | CarrierWave | Django Channels | NestJS WebSockets | openai | posthog | stripe | UploadThing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| user prompts | ● | — | — | — | — | — | ● | — | — | — |
| conversation history | ● | — | — | — | — | — | ● | — | — | — |
| generated content | ● | — | — | — | — | — | ● | — | — | — |
| real-time user data | — | ● | — | — | ● | ● | — | — | — | — |
| connection metadata | — | ● | — | — | ● | ● | — | — | — | — |
| channel subscriptions | — | ● | — | — | — | — | — | — | — | — |
| WebSocket messages | — | ● | — | — | ● | ● | — | — | — | — |
| uploaded files | — | — | ● | ● | — | — | — | — | — | ● |
| file metadata | — | — | ● | ● | — | — | — | — | — | ● |
| storage service credentials | — | — | ● | — | — | — | — | — | — | — |
| potential PII in uploaded content | — | — | ● | ● | — | — | — | — | — | ● |
| image versions | — | — | — | ● | — | — | — | — | — | — |
| channel group data | — | — | — | — | ● | — | — | — | — | — |
| IP address | — | — | — | — | — | ● | — | — | — | — |
| user behavior | — | — | — | — | — | — | — | ● | — | — |
| session recordings | — | — | — | — | — | — | — | ● | — | — |
| feature flag usage | — | — | — | — | — | — | — | ● | — | — |
| device information | — | — | — | — | — | — | — | ● | — | — |
| payment information | — | — | — | — | — | — | — | — | ● | — |
| billing address | — | — | — | — | — | — | — | — | ● | — |
| email | — | — | — | — | — | — | — | — | ● | — |
| transaction history | — | — | — | — | — | — | — | — | ● | — |
| user identity | — | — | — | — | — | — | — | — | — | ● |

## Transfer Compliance Checklist

- [ ] All transfers have a valid legal basis under GDPR Chapter V
- [ ] SCCs (2021 version) executed with all non-DPF-certified providers
- [ ] DPF certification verified for applicable US providers
- [ ] Transfer Impact Assessment completed for each non-adequate country
- [ ] Supplementary measures implemented where SCCs are relied upon
- [ ] Data Processing Agreements in place with all processors
- [ ] Record of Processing Activities updated with transfer details
- [ ] Privacy Policy discloses international transfers and safeguards
- [ ] DPO informed of all cross-border transfers

## Review Schedule

| Review | Frequency | Next Due |
|--------|-----------|----------|
| Full transfer map review | Annual | 2027-03-16 |
| DPF certification verification | Semi-annual | [Set date] |
| New service onboarding review | Per event | Ongoing |
| Regulatory change assessment | Quarterly | [Set date] |

**Contact:** [your-email@example.com]

---

*This Cross-Border Transfer Map was auto-generated by [Codepliant](https://github.com/codepliant/codepliant) based on code analysis. Service location and DPF certification status should be verified with each provider's current documentation. This document does not constitute legal advice.*
