# Codepliant Examples

Example projects that demonstrate Codepliant's code-scanning and document generation capabilities.

## Projects

### nextjs-saas/

A typical Next.js SaaS application with:
- **OpenAI** — AI chat endpoint (triggers AI Disclosure generation)
- **Stripe** — Payment processing (triggers payment data sections in Privacy Policy)
- **Supabase** — Auth and database (triggers auth/storage data collection sections)
- **PostHog** — Analytics (triggers Cookie Policy generation)
- **Sentry** — Error monitoring (triggers error tracking disclosure)
- **Resend** — Transactional email (triggers email data processing sections)
- **Prisma** — User model with PII fields (email, name, phone, passwordHash)

This project includes a full `.codepliantrc.json` with company details, DPO info, multiple jurisdictions (EU, US-CA, US-VA, UK), and AI risk classification.

### django-app/

A Django application with:
- **OpenAI** — AI integration
- **Stripe** — Payments
- **Sentry** — Error tracking
- **django-allauth** — Social authentication
- **SendGrid** — Email delivery
- User model with PII fields (email, first_name, phone, date_of_birth)

## How to Test

### Next.js SaaS Example

```bash
cd examples/nextjs-saas
npx codepliant go --format all
# Check legal/ directory for generated documents
```

Expected output in `legal/`:
- `privacy-policy.md` / `.html` — Full privacy policy with GDPR, CCPA, and UK sections
- `terms-of-service.md` / `.html` — Terms covering AI usage, payments, and data handling
- `ai-disclosure.md` / `.html` — AI Act-compliant disclosure for the OpenAI integration
- `cookie-policy.md` / `.html` — Cookie policy covering PostHog analytics cookies
- `dpa.md` / `.html` — Data Processing Agreement
- `compliance-notes.md` — Internal compliance notes and recommendations

### Django Example

```bash
cd examples/django-app
npx codepliant go
# Check legal/ directory for generated documents
```

### Scan Only (No Document Generation)

```bash
cd examples/nextjs-saas
npx codepliant scan --json
```

This outputs the raw scan results showing all detected services, data types, and PII fields without generating any documents.
