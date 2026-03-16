# Compliance Matrix: Codepliant Generator Coverage vs. Actual Regulation Text

**Generated:** 2026-03-15
**Methodology:** Each clause from GDPR Art. 13, EU AI Act Art. 50, and CCPA key sections was checked against the actual generator source code in `src/generator/`.

---

## 1. GDPR Article 13 Coverage

**Primary generator:** `src/generator/privacy-policy.ts`
**Supporting generators:** `src/generator/dpa.ts`, `src/generator/compliance-notes.ts`

| Clause | Requirement | Covered? | How | Gap |
|--------|-------------|----------|-----|-----|
| 13.1(a) | Identity and contact details of controller (and representative) | YES | Privacy policy Section 1 outputs company name, contact email, and EU representative if configured via `ctx.euRepresentative` | No gap if configured. Placeholder `[Your Company Name]` used by default -- user must fill in. |
| 13.1(b) | Contact details of DPO | YES | Privacy policy Section 2 "Data Protection Officer" outputs DPO name/email if configured; otherwise shows advisory note to add DPO details | Good coverage. Note advises user to update if Art. 37 appointment required. |
| 13.1(c) | Purposes of processing AND legal basis | YES | Privacy policy Section 5 "Legal Basis for Processing" generates a table mapping each detected service category to its GDPR legal basis (Art. 6(1)(a)/(b)/(f)) with article citation | Strong coverage. Automatically maps service categories to legal bases. |
| 13.1(d) | Legitimate interests pursued (if Art. 6(1)(f)) | YES | Privacy policy Section 5 includes "Legitimate Interests Pursued" subsection when legitimate interest is detected, with details per category | Well implemented. Balancing test reference included. |
| 13.1(e) | Recipients or categories of recipients | YES | Privacy policy Section 4 "Third-Party Services and Data Recipients" lists each detected service with category and data processed | Good. Lists actual detected third-party services. |
| 13.1(f) | International transfers: adequacy decisions, safeguards, copy availability | YES | Privacy policy Section 7 "International Data Transfers" lists US-based services, mentions SCCs, adequacy decisions, EU-US DPF, and offers email contact for safeguard copies | Good. Mentions three transfer mechanisms. Includes "request a copy" language per Art. 13.1(f). |
| 13.2(a) | Retention period or criteria | YES | Privacy policy Section 8 "Data Retention" generates a table with per-category retention periods (e.g., "analytics: 26 months", "auth: until account deletion") | Good. Category-specific retention periods provided. |
| 13.2(b) | Rights: access, rectification, erasure, restriction, objection, portability | YES | Privacy policy Section 9 "Your Rights" lists all six rights by name | All six rights enumerated. |
| 13.2(c) | Right to withdraw consent | YES | Privacy policy Section 10 "Right to Withdraw Consent" with details on how to withdraw and that prior processing remains lawful | Excellent. Dedicated section with proper withdrawal mechanism and lawfulness statement. |
| 13.2(d) | Right to lodge complaint with supervisory authority | YES | Privacy policy Section 9 under "For EU/EEA Residents (GDPR)" states right to lodge complaint with local DPA | Covered, but does not name specific supervisory authority or provide contact details. |
| 13.2(e) | Whether provision is statutory/contractual; consequences of non-provision | YES | Privacy policy Section 12 "Necessity of Data Provision" distinguishes required vs. optional data and states consequences of non-provision | Good. Distinguishes mandatory from optional data. |
| 13.2(f) | Automated decision-making/profiling: logic, significance, consequences | PARTIAL | Privacy policy Section 11 "Automated Decision-Making" mentions rights regarding automated processing when AI services detected | **GAP:** Does not provide "meaningful information about the logic involved" or "the significance and envisaged consequences" as required. Only lists user rights (request human intervention, express views, contest). The AI Disclosure has more detail but Art. 13 requires it in the privacy policy itself. |
| 13.3 | Further processing notice for new purposes | NO | Not addressed in any generator | **GAP:** No template text for notifying data subjects about further processing for new purposes. This is a procedural requirement, but guidance or template language should be provided. |
| 13.4 | Exemption when data subject already has info | NO | Not mentioned | **GAP (minor):** No mention of when the exemption applies. Low priority as this is a defense rather than a disclosure requirement. |

### GDPR Article 13 Coverage Score: **11/14 requirements fully covered, 1 partial, 2 missing = ~82%**

---

## 2. EU AI Act Article 50 Coverage

**Primary generator:** `src/generator/ai-disclosure.ts`
**Supporting generators:** `src/generator/ai-checklist.ts`, `src/generator/privacy-policy.ts`

| Clause | Requirement | Covered? | How | Gap |
|--------|-------------|----------|-----|-----|
| 50.1 | Inform users they are interacting with an AI system | YES | AI Disclosure Section 4.1 "AI Interaction Disclosure" states users are communicating with an AI system. Checklist includes this item. Implementation recommendations provided (notice, badge, link). | Good. Both document text and implementation guidance provided. |
| 50.2a | AI-generated content marked in machine-readable format | PARTIAL | AI Disclosure Section 5.2 "Machine-Readable Marking" describes the requirement and lists methods (C2PA, watermarking, embedded flags). Checklist item included. | **GAP:** Codepliant generates documentation ABOUT the requirement but does not itself implement any marking. The "Action required" box is good but the tool cannot verify that marking is actually implemented. This is inherently a technical implementation gap, not a documentation gap. |
| 50.2b | Marking must be effective, interoperable, robust, reliable | PARTIAL | AI Disclosure Section 5.2 mentions interoperability and standard detection tools. Checklist mentions interoperability check. | **GAP:** Same as above -- documentation covers the requirement but cannot enforce technical implementation. No specific guidance on which standards to adopt. |
| 50.2c | Exception: assistive editing / no substantial alteration | NO | Not mentioned in any generator output | **GAP:** The assistive editing exception is not documented. Applications that use AI for spell-checking, grammar correction, or code formatting may qualify but users are not informed of this exemption. |
| 50.3a | Emotion recognition systems: inform exposed persons | YES | AI Disclosure risk classification mentions emotion recognition. RISK_OBLIGATIONS for limited risk includes "Emotion recognition systems must inform exposed individuals (Art. 50(3))". Checklist does not have a specific item but high-risk patterns include "emotion recognition". | Partially covered. Detection pattern exists but no dedicated section in disclosure output for emotion recognition disclosure language. |
| 50.3b | Biometric categorisation systems: inform exposed persons | PARTIAL | HIGH_RISK_PATTERNS includes "biometric" and "facial recognition". Would trigger high-risk classification but no specific biometric categorisation disclosure template. | **GAP:** No template text for biometric system notification. High-risk classification is triggered but specific Art. 50(3) disclosure language for biometric categorisation is missing. |
| 50.3c | Process personal data per GDPR/LED | YES | Privacy policy covers GDPR processing. AI Disclosure Section 6 covers data processing by AI with cross-border transfer safeguards. | Covered via combination of privacy policy and AI disclosure. |
| 50.4a | Deepfake disclosure: disclose AI-generated/manipulated media | YES | AI Disclosure Section 5.1 covers synthetic content disclosure. Checklist includes "Synthetic media (images, audio, video) is disclosed as AI-generated (Art. 50(4))". RISK_OBLIGATIONS includes "Synthetic media (deepfakes) must be labelled (Art. 50(4))". | Good documentation coverage. |
| 50.4b | AI-generated text for public interest: disclose as AI-generated | YES | AI Checklist includes: "AI-generated text published to inform the public is labelled as artificially generated". | Mentioned in checklist. No dedicated section in AI Disclosure document though. |
| 50.4c | Artistic exception: limited to non-hampering disclosure | NO | Not mentioned | **GAP:** The artistic/creative/satirical exception is not documented. Apps generating creative content would benefit from knowing this exemption exists. |
| 50.4d | Editorial exception: human review + editorial responsibility | NO | Not mentioned | **GAP:** The editorial control exception is not documented. Apps where AI text undergoes human editorial review may be exempt from disclosure. |
| 50.5 | Disclosure at first interaction, clear and distinguishable | YES | AI Disclosure Section 4.3 "First-Interaction Disclosure (Art. 50(5))" with implementation recommendations. AI Checklist includes this item. Explicitly references accessibility Directive 2019/882. | Excellent coverage with practical implementation guidance. |
| 50.5b | Disclosure must meet accessibility requirements (Dir. 2019/882) | YES | AI Disclosure Section 4.3 references Directive (EU) 2019/882. AI Checklist item: "Disclosure meets accessibility standards per Directive (EU) 2019/882". | Good. |
| 50.6 | Does not override Chapter III (high-risk) obligations | YES | AI Disclosure Section 3 covers high-risk classification and obligations when detected. AI Checklist has full "High-Risk System Requirements (Title III)" section with 12 checklist items. | Well covered for high-risk scenarios. |
| 50.7 | Codes of practice for marking/labelling | PARTIAL | AI Disclosure Section 5.2 mentions "EU Code of Practice on marking and labelling AI-generated content". AI Checklist references Code of Practice. | Mentioned but no direct link to the actual Code of Practice or guidance on adoption timeline. |

### EU AI Act Article 50 Coverage Score: **9/15 fully covered, 3 partial, 3 missing = ~70%**

---

## 3. CCPA/CPRA Coverage

**Primary generator:** `src/generator/privacy-policy.ts` (CCPA section)
**Supporting generators:** `src/generator/cookie-policy.ts`, `src/generator/compliance-notes.ts`

| Clause | Requirement | Covered? | How | Gap |
|--------|-------------|----------|-----|-----|
| CCPA-1: 1798.100(b)(1) | Disclose categories of PI collected | YES | Privacy policy CCPA section "Categories of Personal Information Collected" maps detected services to CCPA categories using `CCPA_CATEGORY_MAP` | Good. Auto-detected from code. |
| CCPA-2: 1798.100(b)(2) | Disclose purposes of collection/use | PARTIAL | Legal basis table covers purposes generally but not in CCPA-specific "business or commercial purpose" language | **GAP:** Purposes described in GDPR legal basis format, not mapped to CCPA's "business or commercial purpose" categories (e.g., "performing services", "auditing", "short-term transient use"). |
| CCPA-3: 1798.100(b)(3) | Disclose whether PI is sold or shared | YES | Privacy policy CCPA section includes "Do Not Sell or Share My Personal Information" section stating "We do not sell your personal information" or noting sharing with analytics providers | Good. Conditional on analytics detection. |
| CCPA-4: 1798.100(b)(4) | Disclose retention periods per category | YES | Privacy policy Section 8 "Data Retention" provides per-category retention periods | Covered via general retention section, not CCPA-specific. |
| CCPA-5: 1798.105 | Disclose right to deletion | YES | Privacy policy CCPA Rights section lists "Right to Delete" | Listed but no procedural details on how to exercise. |
| CCPA-6: 1798.106 | Disclose right to correction | NO | Not listed in CCPA rights section | **GAP:** "Right to Correct" (added by CPRA) is missing from the CCPA rights list. Only access, delete, opt-out, limit, non-discrimination are listed. |
| CCPA-7: 1798.110(a)(1) | Disclose categories of PI collected | YES | Same as CCPA-1 | Covered. |
| CCPA-8: 1798.110(a)(2) | Disclose categories of sources | NO | Not disclosed | **GAP:** The privacy policy lists what data is collected through which services but does not present "categories of sources" in CCPA-required format (e.g., "directly from consumers", "from internet service providers", "from data brokers"). |
| CCPA-9: 1798.110(a)(3) | Disclose business/commercial purpose | PARTIAL | Covered via legal basis table but not in CCPA terminology | **GAP:** Same as CCPA-2. Purposes not framed in CCPA statutory categories. |
| CCPA-10: 1798.110(a)(4) | Disclose categories of third parties | PARTIAL | Third-party services section lists specific services | **GAP:** Lists specific services (e.g., "Stripe", "Posthog") rather than "categories of third parties" as CCPA requires (e.g., "payment processors", "analytics providers", "advertising networks"). The category is shown parenthetically but not formatted as a CCPA-compliant disclosure. |
| CCPA-11: 1798.115 | Disclose categories sold/shared in preceding 12 months | PARTIAL | "Do Not Sell or Share" section mentions sharing with analytics providers for cross-context behavioral advertising | **GAP:** Does not enumerate specific categories sold/shared in preceding 12 months as required. No statement covering the 12-month lookback period. |
| CCPA-12: 1798.120 | Opt-out of sale/sharing notice | YES | "Do Not Sell or Share My Personal Information" section with opt-out instructions | Good. Contact email provided as opt-out mechanism. |
| CCPA-13: 1798.121 | Right to limit use of sensitive PI | YES | CCPA Rights section lists "Right to Limit Use of Sensitive Personal Information" | Listed as a right but no separate "Limit the Use of My Sensitive Personal Information" link or mechanism described. |
| CCPA-14: 1798.125 | Non-discrimination | YES | CCPA Rights section lists "Right to Non-Discrimination" | Listed but no explanatory text about what non-discrimination means. |
| CCPA-15: 1798.130(a) | Two or more request methods (incl. toll-free) | NO | Only email contact provided | **GAP:** CCPA requires at minimum a toll-free telephone number AND a web address for submitting requests. Only email is provided. No toll-free number. This is a clear compliance gap. |
| CCPA-16: 1798.130 | Update privacy policy at least every 12 months | NO | Not mentioned | **GAP:** No reminder or guidance to update annually. The "Last updated" date is auto-generated but no policy review schedule is set. |
| CCPA-17: 1798.135 | "Do Not Sell or Share" link on homepage | PARTIAL | Text mentions the concept but Codepliant cannot implement the actual homepage link | Documentation gap is inherent -- Codepliant generates documents, not application UI. Compliance notes checklist item covers this. |
| CCPA-18: 1798.135 | "Limit Use of Sensitive PI" link | NO | Not mentioned as a link requirement | **GAP:** No guidance on implementing the "Limit the Use of My Sensitive Personal Information" link. |
| CCPA-19: 1798.135 | Honor GPC signal | YES | Cookie policy Section 5 "Global Privacy Control (GPC)" recognizes GPC signal. Compliance notes checklist includes GPC item. | Good. Cookie policy has dedicated GPC section. |

### CCPA/CPRA Coverage Score: **9/19 fully covered, 4 partial, 6 missing = ~58%**

---

## 4. Overall Coverage Summary

| Regulation | Full Coverage | Partial | Missing | Score |
|------------|--------------|---------|---------|-------|
| GDPR Article 13 | 11/14 | 1/14 | 2/14 | **82%** |
| EU AI Act Article 50 | 9/15 | 3/15 | 3/15 | **70%** |
| CCPA/CPRA | 9/19 | 4/19 | 6/19 | **58%** |

### Weighted Overall: ~68%

---

## 5. Critical Gaps (Must Fix)

### Priority 1 - Legal Risk

| # | Regulation | Gap | Impact | Fix |
|---|-----------|-----|--------|-----|
| 1 | CCPA | No toll-free telephone number for requests (1798.130) | Direct statutory violation | Add placeholder for toll-free number in privacy policy; add validation warning if not configured |
| 2 | CCPA | Missing "Right to Correct" (1798.106) | CPRA right omitted from rights list | Add "Right to Correct" to CCPA rights enumeration in privacy-policy.ts |
| 3 | GDPR 13.2(f) | Automated decision-making section lacks "meaningful information about logic" and "significance and envisaged consequences" | Art. 13 requires this in the privacy policy, not just the AI disclosure | Add logic/significance/consequences language to privacy policy automated decision-making section |
| 4 | CCPA | Categories of sources not disclosed (1798.110(a)(2)) | Required CCPA disclosure missing | Add "Categories of Sources" subsection mapping service types to source categories |

### Priority 2 - Compliance Improvement

| # | Regulation | Gap | Fix |
|---|-----------|-----|-----|
| 5 | CCPA | Purposes not in CCPA statutory categories (1798.100(b)(2)) | Add CCPA purpose mapping alongside GDPR legal basis |
| 6 | CCPA | No 12-month lookback disclosure for sales/sharing (1798.115) | Add "In the preceding 12 months" language |
| 7 | AI Act 50.2 | Assistive editing exception not documented | Add note about when Art. 50(2) does not apply |
| 8 | AI Act 50.4 | Artistic/editorial exceptions not documented | Document the exceptions so users know when disclosure is narrower |
| 9 | CCPA | Annual update reminder not included (1798.130) | Add reminder/note about 12-month update requirement |
| 10 | CCPA | "Limit Use of Sensitive PI" link requirement not mentioned | Add guidance in compliance-notes.ts |

### Priority 3 - Nice to Have

| # | Regulation | Gap | Fix |
|---|-----------|-----|-----|
| 11 | GDPR 13.3 | No further processing notice template | Add template or guidance for purpose changes |
| 12 | AI Act 50.3 | Biometric categorisation specific disclosure language missing | Add biometric notification template when detected |
| 13 | GDPR 13.2(d) | Supervisory authority not named specifically | Consider adding country-specific DPA contact lookup |

---

## 6. Generator File Assessment

| Generator | Primary Regulation | Quality | Notes |
|-----------|--------------------|---------|-------|
| `privacy-policy.ts` | GDPR Art. 13 + CCPA | **Good** | Strong GDPR coverage. CCPA section needs work (missing rights, sources, toll-free). 512 lines, well-structured. |
| `ai-disclosure.ts` | EU AI Act Art. 50 | **Good** | Comprehensive 11-section document. Risk classification logic is sound. Missing some exceptions. 469 lines. |
| `ai-checklist.ts` | EU AI Act (all) | **Good** | Practical compliance tracking tool. Covers transparency, documentation, human oversight, content marking, data protection. 147 lines. |
| `cookie-policy.ts` | ePrivacy Directive | **Adequate** | Covers cookie consent, GPC, opt-out links. Good for what it covers. 185 lines. |
| `terms-of-service.ts` | N/A (contractual) | **Adequate** | Not regulation-specific but includes AI content terms and payment terms. 138 lines. |
| `dpa.ts` | GDPR Art. 28 | **Good** | Solid DPA template covering processor obligations, sub-processors, breach notification, international transfers. 179 lines. |
| `compliance-notes.ts` | All regulations | **Good** | Useful overview with checklists per regulation. Correctly identifies applicable regulations based on detected services. 248 lines. |

---

*This compliance matrix was created by cross-referencing actual regulation text against Codepliant generator source code. It should be reviewed by legal counsel and updated as regulations evolve.*
