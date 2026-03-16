# Privacy Policy

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** codepliant

## Review Notes

### What a lawyer should check

- Verify all data collection practices are accurately described
- Confirm legal basis selections for each processing purpose
- Check international transfer safeguards are properly documented
- Ensure CCPA/CPRA sections are complete if California residents are served
- Validate data retention periods against applicable laws
- Confirm DPO contact information is correct

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Third-party services list | Auto-detected from code | High |
| Data categories | Auto-detected from service types | Medium |
| Legal basis table | Auto-assigned defaults | Low |
| Retention periods | Template defaults | Low |
| Contact information | From config file | High |
| CCPA rights section | Auto-generated if applicable | Medium |
## Related Documents

- Cookie Policy (`COOKIE_POLICY.md`)
- Data Processing Agreement (`DATA_PROCESSING_AGREEMENT.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)
- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)

---

## 1. Introduction

This Privacy Policy ("Policy") describes how [Your Company Name] ("we", "us", or "our") collects, uses, discloses, and otherwise processes your personal data when you access or use our services. This Policy applies to all personal data processed in connection with our websites, applications, and related services (collectively, the "Service").

We are committed to protecting your personal data in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR"), the California Consumer Privacy Act as amended by the California Privacy Rights Act ("CCPA/CPRA"), and other applicable data protection legislation.

**Data Controller:** [Your Company Name]
**Contact Email:** [your-email@example.com]

## 2. Data Protection Officer

Our primary data protection contact is: **[your-email@example.com]**

> **Note:** If your organisation is required to appoint a Data Protection Officer under GDPR Article 37, update this section with the DPO's contact details.


## 3. Information We Collect

In accordance with GDPR Art. 13(1)(e) and Art. 14(1)(d), we collect the following categories of personal data:

### Financial Data

Payment card information, billing addresses, and transaction history processed through payment providers.

**Collected through:** stripe

### Usage & Behavioral Data

Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools.

**Collected through:** posthog

### AI Interaction Data

User prompts, conversation history, and AI-generated content processed through third-party AI services.

**Collected through:** openai, @anthropic-ai/sdk

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** UploadThing, Active Storage, CarrierWave

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** Memcached

### Contact Information

email addresses detected in TypeORM/Sequelize model fields: User.email. email addresses, phone numbers detected in Mongoose model fields: UnknownModel.email, UnknownModel.phone. email addresses detected in Drizzle ORM table fields: users.email.

**Collected through:** User.email, UnknownModel.email, UnknownModel.phone, users.email

### API Data Collection

3 API endpoint(s) accepting user data via POST, PUT requests. Data fields collected: email, name.

**Collected through:** src/generator/api-documentation.ts, src/scanner/api-routes.ts

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- AI-powered feature usage → user prompts, conversation history, generated content (via @anthropic-ai/sdk)
- AI-powered feature usage → user prompts, conversation history, generated content (via openai)
- Payment checkout → payment information, billing address, email, transaction history (via stripe)
- API endpoint src/generator/api-documentation.ts → email, name (via API)
- API endpoint src/scanner/api-routes.ts → email, name (via API)

**Data Storage:**

- Active Storage (File Storage): uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- CarrierWave (File Storage): uploaded files, file metadata, image versions, potential PII in uploaded content
- UploadThing (File Storage): uploaded files, file metadata, user identity, potential PII in uploaded content
- Database schema (Contact Information): User.email, UnknownModel.email, UnknownModel.phone, users.email

**Third-Party Data Sharing:**

- @anthropic-ai/sdk: user prompts, conversation history, generated content
- ActionCable: real-time user data, connection metadata, channel subscriptions, WebSocket messages
- Django Channels: real-time user data, connection metadata, channel group data, WebSocket messages
- NestJS WebSockets: real-time user data, connection metadata, IP address, WebSocket messages
- openai: user prompts, conversation history, generated content
- posthog: user behavior, session recordings, feature flag usage, device information
- stripe: payment information, billing address, email, transaction history


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| High | 5 | Encryption, tokenization, access control, audit logging |
| Medium | 7 | Encryption in transit, consent, user access rights |
| Low | 47 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **@anthropic-ai/sdk** (AI Service): Processes user prompts, conversation history, generated content
- **ActionCable** (Other): Processes real-time user data, connection metadata, channel subscriptions, WebSocket messages
- **Active Storage** (File Storage): Processes uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- **CarrierWave** (File Storage): Processes uploaded files, file metadata, image versions, potential PII in uploaded content
- **Django Channels** (Other): Processes real-time user data, connection metadata, channel group data, WebSocket messages
- **NestJS WebSockets** (Other): Processes real-time user data, connection metadata, IP address, WebSocket messages
- **openai** (AI Service): Processes user prompts, conversation history, generated content
- **posthog** (Analytics): Processes user behavior, session recordings, feature flag usage, device information
- **stripe** (Payment Processing): Processes payment information, billing address, email, transaction history
- **UploadThing** (File Storage): Processes uploaded files, file metadata, user identity, potential PII in uploaded content

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| AI Service | Consent | Art. 6(1)(a) | Only with your opt-in consent; or Contract (Art. 6(1)(b)) if integral to the service |
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Analytics | Consent | Art. 6(1)(a) | Only with your opt-in consent |
| Payment Processing | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Other:** Supporting our service operations


## 6. Artificial Intelligence

This application uses AI-powered features provided by third-party services:

- **@anthropic-ai/sdk**: user prompts, conversation history, generated content
- **openai**: user prompts, conversation history, generated content

### How We Use AI

- User inputs may be sent to AI service providers for processing
- AI-generated outputs are returned to the user
- We do not use your data to train AI models
- AI service providers may retain data according to their own policies

> **Note:** Review the AI Disclosure document for detailed information about our AI usage as required by the EU AI Act.


## 7. International Data Transfers

Pursuant to GDPR Art. 13(1)(f), we inform you that your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) that may not provide an equivalent level of data protection. The following services involve such transfers:

- **@anthropic-ai/sdk** (AI Service)
- **openai** (AI Service)
- **posthog** (Analytics)
- **stripe** (Payment Processing)

In accordance with GDPR Chapter V (Arts. 44-49), we ensure that appropriate safeguards are in place for all international transfers, including:

- Transfers to countries with an EU adequacy decision
- Standard Contractual Clauses (SCCs) approved by the European Commission
- EU-US Data Privacy Framework certification (where applicable)

You may request a copy of the applicable safeguards by contacting us at [your-email@example.com].


## 8. Data Retention

In accordance with the data minimisation principle (GDPR Art. 5(1)(e)), we retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.

| Data Type | Retention Period |
|-----------|------------------|
| AI Service | AI interaction data retained for up to 90 days |
| Other | Data retained as long as necessary for the service |
| File Storage | Uploaded files retained until you delete them or your account |
| Analytics | Analytics data retained for up to 26 months |
| Payment Processing | Transaction records retained for 7 years (tax and legal compliance) |


## 9. Your Rights

Under applicable data protection legislation, you may exercise the following rights with respect to your personal data:

- **Right of Access (Art. 15):** You have the right to obtain confirmation as to whether your personal data is being processed and, where that is the case, to request a copy of the personal data undergoing processing.
- **Right to Rectification (Art. 16):** You have the right to obtain the rectification of inaccurate personal data and, taking into account the purposes of the processing, to have incomplete personal data completed.
- **Right to Erasure (Art. 17):** You have the right to obtain the erasure of your personal data where one of the grounds set out in Art. 17(1) GDPR applies, subject to the exceptions in Art. 17(3).
- **Right to Data Portability (Art. 20):** You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.
- **Right to Object (Art. 21):** You have the right to object, on grounds relating to your particular situation, to the processing of your personal data based on Art. 6(1)(e) or (f). We shall cease processing unless we demonstrate compelling legitimate grounds.
- **Right to Restriction of Processing (Art. 18):** You have the right to obtain restriction of processing where one of the conditions set out in Art. 18(1) GDPR applies.

### For EU/EEA Residents (GDPR)

Pursuant to GDPR Art. 77, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.

### For California Residents (CCPA/CPRA)

Under the California Consumer Privacy Act and California Privacy Rights Act:

#### Categories of Personal Information Collected
- Inferences drawn from personal information (AI-generated profiles and predictions)
- Audio, electronic, visual, or similar information (uploaded files and media)
- Internet or other electronic network activity (browsing history, interactions with website)
- Financial information (payment card details, billing address, transaction history)

#### Categories of Sources

We collect personal information from the following categories of sources:

- Directly from you (inputs to AI-powered features)
- From third parties (AI service providers)
- Directly from you (file uploads)
- Automatically (cookies, web beacons, analytics tools)
- Directly from you (checkout and billing forms)
- From third parties (payment processors)

#### Business or Commercial Purpose for Collection

We collect and use personal information for the following business or commercial purposes:

- **AI Service:** Performing services: Providing AI-powered features and functionality integral to the service
- **File Storage:** Performing services: Providing file storage and media hosting as part of the service
- **Analytics:** Auditing: Counting ad impressions, verifying positioning, and auditing compliance; Short-term transient use: Contextualizing and customizing content shown to you
- **Payment Processing:** Performing services: Processing transactions, billing, and fulfilling orders

#### Your CCPA Rights
- Right to Know
- Right to Correct (CPRA Section 1798.106)
- Right to Delete
- Right to Opt-Out of Sale/Sharing
- Right to Limit Use of Sensitive Personal Information
- Right to Non-Discrimination

#### Do Not Sell or Share My Personal Information
We do not sell your personal information. We share personal information with analytics providers for cross-context behavioral advertising. You may opt out by contacting us at [your-email@example.com] or using our opt-out mechanism.

#### How to Submit a Request

You may submit a request to exercise your CCPA rights through the following methods:

- **Email:** [your-email@example.com]
- **Toll-Free Telephone Number:** [1-800-XXX-XXXX] *(update with your toll-free number)*

We will respond to verifiable consumer requests within 45 days.

#### Authorized Agent
You may designate an authorized agent to make requests on your behalf.

## 10. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent (Art. 6(1)(a) or Art. 9(2)(a)), you have the right to withdraw that consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.

You can withdraw your consent by:

- Adjusting your preferences in your account settings
- Contacting us at [your-email@example.com]

Upon withdrawal, we will cease the relevant processing activities, though some data already collected may be retained where we have another lawful basis for doing so.


## 11. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), this application uses automated processing, including AI-powered features, as described in the Artificial Intelligence section above.

### Meaningful Information About the Logic Involved

Our automated processing uses AI models provided by third-party services (@anthropic-ai/sdk, openai). These models analyse the inputs you provide and generate outputs based on statistical patterns learned during training. The processing involves:

- Receiving your input data (text, queries, or other content you submit)
- Processing it through the AI model to generate a response or result
- Returning the AI-generated output to you

### Significance and Envisaged Consequences

The use of automated processing may affect you in the following ways:

- AI-generated outputs may influence decisions or actions you take based on them
- The quality and accuracy of outputs depend on the inputs provided and the limitations of the AI model
- Automated processing is not used to make decisions that produce legal effects or similarly significantly affect you without human oversight

### Your Rights Regarding Automated Decisions

You have the right not to be subject to decisions based solely on automated processing, including profiling, that produce legal or similarly significant effects concerning you. You may:

- Request human intervention in any automated decision
- Express your point of view regarding automated decisions
- Contest any automated decision that affects you

To exercise these rights, contact us at [your-email@example.com].


## 12. Necessity of Data Provision (Art. 13(2)(e))

Pursuant to GDPR Art. 13(2)(e), we inform you whether the provision of personal data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, and the possible consequences of failure to provide such data.

- **Required data (contractual necessity):** Data necessary for account creation, authentication, and core service functionality. The provision of this data is a requirement necessary to enter into and perform our contract with you. Failure to provide this data will result in our inability to provide you with the Service.
- **Optional data (consent-based):** Data collected for analytics, personalisation, and service improvement. The provision of this data is voluntary and not a contractual requirement. You may decline to provide this data without any impact on your ability to use the core Service.

## 13. Children's Privacy

We are committed to protecting the privacy of children. Our service may be used by or directed at children under the age of 13, and we comply with the Children's Online Privacy Protection Act (COPPA).

### Parental Consent

We do not knowingly collect personal information from children under 13 without verifiable parental consent. Before collecting, using, or disclosing personal information from a child under 13, we require verifiable consent from a parent or legal guardian.

### Information We Collect from Children

With parental consent, we may collect the minimum information necessary to provide our service. We do not condition a child's participation on providing more personal information than is reasonably necessary.

### Parental Rights

Parents and legal guardians have the right to:

- Review the personal information we have collected from their child
- Request deletion of their child's personal information
- Refuse to permit further collection or use of their child's information

### How to Request Deletion

To request the review or deletion of your child's personal information, please contact us at [your-email@example.com]. We will respond to your request within a reasonable timeframe and verify your identity as the child's parent or legal guardian before processing the request.


## 14. How We Protect Your Data

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.

### Encryption

- All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher
- Sensitive data (such as payment information and credentials) is encrypted at rest using industry-standard encryption algorithms
- Encryption keys are managed through secure key management practices with regular rotation

### Security Assessments

- Regular security reviews and vulnerability assessments are conducted
- Third-party services are evaluated for security before integration
- We maintain an incident response plan for handling data breaches (see `INCIDENT_RESPONSE_PLAN.md`)


## 15. Changes to This Policy

We may revise this Policy from time to time to reflect changes in our data processing practices, applicable law, or regulatory guidance. Where we make material changes, we will notify you by reasonable means, such as a prominent notice on the Service or by email to the address associated with your account, at least thirty (30) days prior to the changes taking effect.

We will not reduce your rights under this Policy without your explicit consent. Each version of this Policy will be identified by its effective date, and we will maintain an archive of prior versions available upon request.

Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the revised terms. If you do not agree with the revised Policy, you must discontinue use of the Service.

## 16. Contact

If you have questions about this Policy or wish to exercise your data protection rights, please contact us at:

- **Email:** [your-email@example.com]

---

*This Policy was generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis. This document is provided as a template and does not constitute legal advice. You should have this Policy reviewed by qualified legal counsel before publication.*