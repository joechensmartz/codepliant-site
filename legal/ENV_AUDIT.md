# Environment Variable Audit

> Generated on 2026-03-16 — 10 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[WARNING]** No .env.example file found. Create one to document required environment variables for new contributors.

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `CODEPLIANT_LICENSE_KEY` | src/licensing/index.ts | No |
| `MY_SECRET_TOKEN` | src/scanner/env-audit.test.ts | No |
| `OPENAI_API_KEY` | examples/nextjs-saas/src/app/api/chat/route.ts | No |
| `STRIPE_KEY` | src/scanner/integration.test.ts | No |
| `STRIPE_SECRET_KEY` | examples/nextjs-saas/src/app/api/checkout/route.ts, examples/sample-output/source-code/src/app/api/checkout.ts | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `REDIS_URL` | src/scanner/caching-scanner.test.ts | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `API_ENDPOINT` | src/scanner/env-audit.test.ts | No |

### Public / Client-side

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `NEXT_PUBLIC_URL` | examples/nextjs-saas/src/app/api/checkout/route.ts | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `FLASK_DEBUG` | src/scanner/environment-scanner.ts | No |
| `NO_COLOR` | src/cli.ts | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `API_ENDPOINT`
- `CODEPLIANT_LICENSE_KEY`
- `FLASK_DEBUG`
- `MY_SECRET_TOKEN`
- `NEXT_PUBLIC_URL`
- `NO_COLOR`
- `OPENAI_API_KEY`
- `REDIS_URL`
- `STRIPE_KEY`
- `STRIPE_SECRET_KEY`

## Hardcoded Secrets Detected

> **41 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 41 hardcoded secret(s) detected in source code: Hardcoded Secret. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 40 | `OPENAI_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 42 | `ANTHROPIC_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 43 | `CLAUDE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 45 | `GEMINI_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 47 | `TOGETHER_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 48 | `COHERE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 49 | `CO_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 50 | `PINECONE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 56 | `STRIPE_WEBHOOK_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 58 | `PAYPAL_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 59 | `LEMONSQUEEZY_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 62 | `PLAID_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 66 | `NEXTAUTH_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 68 | `AUTH_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 69 | `BETTER_AUTH_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 77 | `GOOGLE_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 79 | `MICROSOFT_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 97 | `UPLOADTHING_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 100 | `CLOUDINARY_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 105 | `SENDGRID_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 106 | `RESEND_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 113 | `MAILCHIMP_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 116 | `MAILCHIMP_TRANSACTIONAL_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 117 | `MANDRILL_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 124 | `POSTHOG_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 128 | `MIXPANEL_API_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 129 | `AMPLITUDE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 139 | `DD_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 141 | `DATADOG_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 144 | `FIREBASE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 156 | `INTERCOM_ACCESS_TOKEN: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 161 | `PUSHER_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 166 | `ALGOLIA_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 170 | `MEILISEARCH_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 174 | `ONESIGNAL_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 175 | `ONESIGNAL_REST_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 185 | `HUBSPOT_ACCESS_TOKEN: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 186 | `HUBSPOT_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 187 | `HUBSPOT_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/generator/env-example.ts` | 194 | `GOOGLE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `src/scanner/env-audit.ts` | 293 | `secret: "API Key / Secret",` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/codepliant/codepliant). It is not a substitute for a professional security review.*
