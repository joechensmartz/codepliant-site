# Real-World Project Scan Examples

Codepliant scan results for 10 popular open-source projects. Each scan was run against
the latest `main` branch (shallow clone) on 2026-03-15.

## Results Summary

| Project | Stack | Services Detected | Data Categories | Compliance Needs | Key Findings |
|---------|-------|:-----------------:|:---------------:|:----------------:|--------------|
| [cal.com](cal-com/) | Next.js + Prisma | 23 | 7 | 8 | Rich detection: Stripe, SendGrid, Twilio, HubSpot, Sentry, PostHog, Redis, Prisma, Google APIs, next-auth, web-push, Intercom, Plausible |
| [documenso](documenso/) | Next.js + Prisma | 16 | 6 | 8 | AWS SES, Google Cloud KMS, WebAuthn, Vercel AI SDK, Resend, PostHog, Stripe, Prisma, next-auth |
| [formbricks](formbricks/) | Next.js + Prisma | 13 | 9 | 7 | S3, Sentry, Redis, PostHog, Stripe, Prisma, next-auth, Google APIs. High data category count (9) for a survey tool |
| [medusa](medusa/) | Node.js (Express) | 14 | 7 | 8 | Segment analytics, SendGrid, Algolia search, BullMQ, OpenAI, PostHog, Stripe, Redis, express-session |
| [saleor](saleor/) | Python/Django | 5 | 7 | 7 | Lower detection count -- Python/Django scanning finds boto3, django-admin, django-sessions, Redis, Stripe. Many Django-specific patterns not yet covered |
| [mastodon](mastodon/) | Ruby/Rails + JS | 14 | 4 | 7 | Good Rails detection: ActiveRecord, ActiveStorage, ActionMailer, Devise, OmniAuth, Sidekiq, Pundit, rack-attack, Puma, AWS S3, PostgreSQL |
| [twenty](twenty/) | Node.js (NestJS) | 19 | 10 | 7 | Multi-AI setup (Anthropic, Google, OpenAI via Vercel AI SDK), S3, Sentry, BullMQ, Drizzle ORM, Passport OAuth, Stripe, Redis. Highest data category count (10) |
| [chatwoot](chatwoot/) | Ruby/Rails + JS | 24 | 12 | 9 | Highest service count: Amplitude, Twilio Voice, Meta Pixel, S3, ActiveRecord, Devise, OmniAuth, OpenAI, Sentry, Sidekiq, Stripe, Google Cloud Storage. Highest compliance needs (9) |
| [maybe](maybe/) | Ruby/Rails | 16 | 6 | 7 | Financial data via Plaid, Intercom, OpenAI, Sentry, Stripe, Sidekiq, ActiveRecord, S3, rack-attack |
| [pocketbase](pocketbase/) | Go | 0 | 4 | 2 | **Not detected.** Go projects have no package.json -- codepliant currently lacks Go module scanning. This is a known gap |

## Key Observations

### What works well
- **Node.js/TypeScript monorepos**: Excellent detection across package.json dependencies, imports, and env vars (cal.com: 23 services, twenty: 19)
- **Ruby on Rails**: Strong detection of Rails conventions -- ActiveRecord, Devise, Sidekiq, ActionMailer, etc. (chatwoot: 24 services)
- **Hybrid JS + Rails repos**: Both ecosystems detected in parallel (chatwoot, mastodon)
- **Common SaaS integrations**: Stripe, Sentry, PostHog, AWS S3, Redis consistently found across projects
- **Data category inference**: Correctly identifies that survey tools (formbricks: 9 categories) and CRMs (twenty: 10 categories) handle more data types

### Known gaps
- **Go**: No service detection for Go modules (`go.mod` / `go.sum`). Pocketbase returned 0 services
- **Python/Django**: Basic detection (5 services for saleor). Many Django patterns like `django-allauth`, `celery`, `django-storages`, `django-cors-headers` not yet covered
- **Infrastructure-as-code**: Docker Compose services, Kubernetes configs, and Terraform providers not scanned
- **Implicit services**: Services configured purely via environment variables without corresponding package imports may be missed

### Detection rates by ecosystem
| Ecosystem | Avg Services Detected | Coverage Quality |
|-----------|-----------------------|------------------|
| Node.js/TypeScript | 17.2 | Strong |
| Ruby on Rails | 18.0 | Strong |
| Python/Django | 5.0 | Basic |
| Go | 0.0 | Not supported |

## File Structure

Each project directory contains:
- `scan-output.txt` -- Human-readable scan output listing every detected service with evidence
- `stats.json` -- Machine-readable summary (service count, names, data categories, compliance needs)

## Reproducing These Results

```bash
git clone --depth 1 <repo-url> /tmp/scan-target
npx codepliant scan /tmp/scan-target --json
rm -rf /tmp/scan-target
```
