# Sample Output — Code → Scan → Documents

This shows exactly how Codepliant works: **your code in, compliance documents out.**

## The Source Code

A typical Next.js SaaS app with 7 services:

```
source-code/
├── package.json          ← openai, stripe, supabase, posthog, sentry, resend
├── .env.example          ← API keys for all services
├── .codepliantrc.json    ← company info, jurisdictions (GDPR + CCPA + UK)
├── prisma/schema.prisma  ← User model: email, name, phone, passwordHash
└── src/
    ├── app.ts            ← import OpenAI, import Anthropic
    └── app/api/
        ├── checkout.ts   ← Stripe checkout session
        └── chat/route.ts ← POST endpoint accepting { email, message }
```

## What Codepliant Detects

From [`scan-result.json`](./scan-result.json):

| What | Where Found | How |
|------|-------------|-----|
| OpenAI | package.json + `import OpenAI` + OPENAI_API_KEY in .env | dependency + import + env |
| Anthropic | package.json + `import Anthropic` + ANTHROPIC_API_KEY | dependency + import + env |
| Stripe | package.json + `import Stripe` + STRIPE_SECRET_KEY | dependency + import + env |
| Supabase Auth | package.json + SUPABASE_URL | dependency + env |
| PostHog | POSTHOG_API_KEY in .env | env |
| Sentry | package.json + SENTRY_DSN | dependency + env |
| Resend | package.json + RESEND_API_KEY | dependency + env |
| User.email, User.phone | prisma/schema.prisma | Prisma schema scan |
| POST /api/chat (email, message) | src/app/api/chat/route.ts | API route scan |

## What Gets Generated

### Markdown (7 key documents shown)

| Document | Lines | Generated Because |
|----------|-------|-------------------|
| [PRIVACY_POLICY.md](./markdown/PRIVACY_POLICY.md) | 333 | Any services detected → GDPR Art. 13 required |
| [TERMS_OF_SERVICE.md](./markdown/TERMS_OF_SERVICE.md) | 132 | Always (every app needs ToS) |
| [AI_DISCLOSURE.md](./markdown/AI_DISCLOSURE.md) | 178 | OpenAI + Anthropic detected → EU AI Act Art. 50 |
| [COOKIE_POLICY.md](./markdown/COOKIE_POLICY.md) | 105 | PostHog (analytics) + Supabase (auth) → cookies |
| [DATA_FLOW_MAP.md](./markdown/DATA_FLOW_MAP.md) | 67 | Shows: collection → storage → sharing paths |
| [DATA_CLASSIFICATION.md](./markdown/DATA_CLASSIFICATION.md) | 107 | Prisma fields classified by GDPR sensitivity |
| [SECURITY.md](./markdown/SECURITY.md) | 102 | Always (vulnerability disclosure policy) |

25 total .md documents generated — see full list below.

### HTML — Apple-style Compliance Page

[`html/index.html`](./html/index.html) — self-contained, dark mode, no external dependencies

[`html/compliance.html`](./html/compliance.html) — tabbed page with all documents + search

### JSON — Structured for API Consumption

[`json/compliance.json`](./json/compliance.json) — machine-readable scan results + documents

```json
{
  "version": "50.0.0",
  "project": { "name": "acme-saas" },
  "scan": {
    "services": [
      { "name": "openai", "category": "ai", "dataCollected": ["user prompts", "..."] }
    ]
  },
  "compliance": { "score": 100, "status": "compliant" }
}
```

### Confluence — XHTML for Wiki Import

[`confluence/PRIVACY_POLICY.xhtml`](./confluence/PRIVACY_POLICY.xhtml) — uses `ac:structured-macro` for Confluence

### Notion — ZIP for Import

[`compliance-notion.zip`](./compliance-notion.zip) — all docs with YAML frontmatter, ready for Notion import

### Badges — SVG for README

| Badge | File |
|-------|------|
| ![Score](./badges/compliance-score.svg) | [`badges/compliance-score.svg`](./badges/compliance-score.svg) |
| ![Status](./badges/compliance-status.svg) | [`badges/compliance-status.svg`](./badges/compliance-status.svg) |

### Widgets — Embeddable JS

[`widgets/widget.js`](./widgets/widget.js) — footer links (Privacy | Terms | Cookies)
```html
<script src="/legal/widget.js"></script>
```

[`widgets/cookie-banner.js`](./widgets/cookie-banner.js) — GDPR cookie consent with GPC support
```html
<script src="/legal/cookie-banner.js"></script>
```

## Code → Document Mapping

How your code directly maps to generated content:

```
package.json: "openai": "^4.0"
    ↓
PRIVACY_POLICY.md → "AI Interaction Data" section
AI_DISCLOSURE.md  → "AI Systems Inventory" table (OpenAI GPT-4)
AI_MODEL_CARD.md  → Model card with limitations + bias info
AI_ACT_CHECKLIST  → "Limited Risk" transparency obligations
```

```
prisma/schema.prisma: email String @unique
    ↓
PRIVACY_POLICY.md   → "Contact Information" data category
DATA_CLASSIFICATION → "email: Medium Sensitivity, Contact Information"
DATA_FLOW_MAP       → "Collection: User registration → email"
DSAR_HANDLING_GUIDE → "Email stored in PostgreSQL via Prisma"
```

```
.env.example: STRIPE_SECRET_KEY=...
    ↓
PRIVACY_POLICY.md      → "Financial Data" + "Payment Processing" sections
COOKIE_POLICY.md       → Stripe session cookies listed
SUBPROCESSOR_LIST.md   → Stripe as sub-processor with DPA URL
VENDOR_CONTACTS.md     → Stripe privacy team: privacy@stripe.com
PCI_DSS note           → "Payment processor detected" in Compliance Notes
```

```
.codepliantrc.json: jurisdictions: ["gdpr", "ccpa", "uk-gdpr"]
    ↓
PRIVACY_POLICY.md → GDPR rights + CCPA "Do Not Sell" + UK ICO section
COMPLIANCE_NOTES  → Per-jurisdiction requirements + action items
REGULATORY_UPDATES → EU AI Act + CCPA + UK Data Act deadlines
```

## Full File List (61 files with `--format all`)

```
legal/
├── markdown/     (25 .md documents)
├── confluence/   (25 .xhtml documents)
├── index.html            ← Apple-style HTML page
├── compliance.html       ← Tabbed compliance dashboard
├── compliance.print.html ← Print-optimized (PDF via browser)
├── compliance.json       ← Structured JSON
├── compliance-notion.zip ← Notion import
├── cookie-banner.js      ← Cookie consent banner
├── widget.js             ← Footer link widget
├── widget-snippet.html   ← Widget integration guide
├── badges/
│   ├── compliance-score.svg
│   └── compliance-status.svg
└── .env.example          ← Auto-generated env template
```

## Reproduce This

```bash
npx codepliant go examples/sample-output/source-code --format all
```
