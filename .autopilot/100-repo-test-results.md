# Codepliant 100-Repo Batch Test Results

**Date:** 2026-03-15
**Tool Version:** Codepliant v1.0.0
**Method:** Shallow clone (--depth 1) + `codepliant scan --json` for each repo
**Repos Tested:** 99 of 100 (1 clone failure: taiga-back)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total repos scanned | 99 |
| Repos with detections | 82 (82.8%) |
| Repos with 0 detections | 17 (17.2%) |
| Total services detected | 530 |
| Average services per repo | 5.4 |
| Max services detected | 21 (infisical, twenty) |
| Clone failures | 1 (taiga-back) |
| Scan failures | 0 |

---

## Full Results Table

### Next.js + Prisma (10 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 1 | cal.com | 20 | next-auth, stripe, prisma, nodemailer, @sendgrid/mail, twilio, ioredis, posthog, @hubspot/api-client, intercom, @sentry/*, google-auth-library, web-push | DB, Auth, Payments, Email, Analytics, PII | Excellent. All major services found. |
| 2 | dub | 8 | next-auth, stripe, prisma, resend, nodemailer, @upstash/redis, @vercel/ai, @ai-sdk/anthropic | DB, Auth, Payments, Email, AI | Good. Tinybird analytics not detected. |
| 3 | documenso | 15 | prisma, next-auth, stripe, nodemailer, resend, @aws-sdk/client-ses, posthog, @vercel/ai, passport-*, googleapis | DB, Auth, Payments, Email, Storage, AI | Excellent. S3 for doc storage detected. |
| 4 | formbricks | 13 | next-auth, prisma, stripe, nodemailer, posthog, @sentry/nextjs, @aws-sdk/client-s3, redis, googleapis | DB, Auth, Payments, Email, Analytics | Good coverage. |
| 5 | papermark | 16 | next-auth, prisma, stripe, resend, nodemailer, openai, @aws-sdk/client-s3, posthog, @upstash/redis, @vercel/ai | DB, Auth, Payments, Email, AI, Storage, Analytics | Excellent. |
| 6 | saas-starter-kit | 14 | next-auth, prisma, stripe, nodemailer, mixpanel, @sentry/*, googleapis, passport-* | DB, Auth, Payments, Email, Analytics | Excellent. SAML not explicitly detected. |
| 7 | nextcrm | 10 | next-auth, prisma, openai, resend, nodemailer, @aws-sdk/client-s3, @uploadthing/react | DB, Auth, AI, Email, Storage | Good. |
| 8 | next-ecommerce | 3 | prisma, nodemailer, Google Analytics | DB, Email, Analytics | Stripe not found (may not be in deps). |
| 9 | open-saas | 4 | prisma, openai, stripe, @lemonsqueezy/lemonsqueezy.js | DB, AI, Payments | Good. Lemon Squeezy detected! |
| 10 | saashq | 8 | next-auth, prisma, openai, resend, nodemailer, @aws-sdk/client-s3, @uploadthing/react, @vercel/ai | DB, Auth, AI, Email, Storage | Good. |

**Ecosystem Score: 9/10 repos with strong detection. Average 11.1 services/repo.**

---

### Express/Fastify API (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 11 | medusa | 8 | ioredis, bullmq, stripe, posthog, @sendgrid/mail, algoliasearch, @segment/analytics-next, openai | DB (missed), Auth (missed), Payments, Email, Analytics | DB (TypeORM/Postgres) not detected directly. |
| 12 | payload | 11 | mongoose, drizzle, nodemailer, ioredis, @aws-sdk/client-s3, stripe, @google-cloud/storage, @sentry/*, @uploadthing/react | DB, Email, Storage, Payments | Good. Auth not explicitly detected. |
| 13 | strapi | 7 | passport, nodemailer, @sendgrid/mail, @aws-sdk/client-s3, cloudinary, @sentry/node, @vercel/ai | Auth, Email, Storage | Good. Knex/DB not directly listed. |
| 14 | fastify-demo | 0 | (none) | DB, Auth | Missed. Small project with minimal deps. |
| 15 | nestjs | 4 | mongoose, ioredis, redis, prisma | DB | Framework code, not app. Reasonable. |

**Ecosystem Score: 4/5 with detections. DB detection via ORM (TypeORM, Knex) needs improvement.**

---

### Django (10 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 31 | saleor | 3 | boto3, stripe, redis | Payments, Storage, Cache | Django/Postgres not detected. Auth missed. |
| 32 | shuup | 0 | (none) | DB, Auth, Payments | Missed entirely. Pure Django deps not detected. |
| 33 | django-oscar | 1 | Google Analytics | Analytics | Major miss. Django ORM/DB not detected. |
| 34 | dj-stripe | 1 | stripe | Payments | Correct but incomplete. |
| 35 | netbox | 0 | (none) | DB, Auth | Missed. Django deps not detected. |
| 36 | sentry | 15 | boto3, redis, openai, @anthropic-ai/sdk, stripe, twilio, @sentry/*, @amplitude/*, launchdarkly, @google/generative-ai | Many | Good, but from JS frontend. Python Django deps missed. |
| 37 | zulip | 2 | stripe, redis | Payments, Cache | Django/Postgres/Auth/Email missed. |
| 38 | taiga | - | CLONE FAILED | - | - |
| 39 | healthchecks | 1 | PyJWT | Auth (partial) | Django DB/email not detected. |
| 40 | dj-lms | 0 | (none) | DB, Auth | Missed entirely. |

**Ecosystem Score: POOR. 6/9 with some detection but Django-specific patterns (Django ORM, django.contrib.auth, django.core.mail) largely undetected. Major gap.**

---

### FastAPI (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 41 | fastapi-template | 6 | nodemailer, @sentry/* (5 Sentry pkgs) | DB, Auth, Email | All from JS deps, not Python. SQLModel/FastAPI missed. |
| 42 | fastapi-crud | 0 | (none) | DB | Tortoise ORM not detected. |
| 43 | sqlmodel | 1 | SQLAlchemy | DB | Correct! |
| 44 | fastapi-react | 0 | (none) | DB, Auth | Missed. |
| 45 | logfire | 2 | openai, redis | AI, Cache | Partial. ClickHouse not detected. |

**Ecosystem Score: POOR. Python-specific patterns largely missed. SQLAlchemy detected in sqlmodel only.**

---

### Flask (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 46 | securedrop | 1 | redis | Cache | Flask/SQLAlchemy/Auth missed. |
| 47 | simplelogin | 3 | boto3, SQLAlchemy, redis | Storage, DB, Cache | Good for Python! |
| 48 | flaskbb | 3 | flask-login, PyJWT, SQLAlchemy | Auth, DB | Good detection. |
| 49 | flask-appbuilder | 0 | (none) | DB, Auth | Missed. |
| 50 | superset | 3 | flask-login, redis, ioredis | Auth, Cache | Partial. SQLAlchemy missed. |

**Ecosystem Score: MODERATE. flask-login and SQLAlchemy detected when present. Better than Django.**

---

### AI/ML (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 51 | langchain | 4 | openai, redis, cohere, langchain | AI, Cache | Good. Core AI libs detected. |
| 52 | dify | 5 | redis, resend, @amplitude/*, @sentry/react, Google Analytics | Cache, Email, Analytics | AI APIs (OpenAI) from Python side missed. |
| 53 | openai-python | 1 | openai | AI | Correct. |
| 54 | llama-index | 6 | langchain, openai, cohere, redis, replicate, Google Analytics | AI, Cache, Analytics | Good AI detection. |
| 55 | litellm | 10 | openai, anthropic, boto3, PyJWT, resend, redis, @anthropic-ai/sdk, replicate, cohere, prisma | AI, Auth, Cache, Email | Excellent. Multiple AI providers detected. |

**Ecosystem Score: GOOD. AI libraries well detected across languages.**

---

### Ruby/Rails (10 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 71 | maybe | 11 | pg, redis, sidekiq, sentry-ruby, aws-sdk-s3, rack-attack, stripe, intercom-ruby, plaid, ruby-openai, nodemailer | DB, Cache, Payments, Storage, AI | Excellent. |
| 72 | discourse | 8 | redis, aws-sdk-s3, omniauth, pg, sidekiq, mysql2, stripe, Google Analytics | DB, Auth, Storage, Payments, Analytics | Very good. |
| 73 | chatwoot | 20 | pg, redis, devise, omniauth, sidekiq, stripe, twilio-ruby, sentry-ruby, aws-sdk-s3, rack-attack, ruby-openai, @amplitude/*, Meta Pixel, nodemailer | DB, Auth, Payments, Email, Storage, Analytics | Excellent. |
| 74 | forem | 10 | algoliasearch, ahoy_matey, devise, omniauth, pg, rack-attack, redis, sidekiq, stripe, Google Analytics | DB, Auth, Search, Analytics, Payments | Excellent. |
| 75 | mastodon | 8 | pg, aws-sdk-s3, devise, omniauth, rack-attack, redis, sidekiq, ioredis | DB, Auth, Storage, Cache | Good. Email (ActionMailer) not detected. |
| 76 | spree | 0 | (none) | DB, Auth, Payments | Missed entirely. Gemfile deps not scanned? |
| 77 | solidus | 2 | mysql2, pg | DB | DB only. Payments/auth missed. |
| 78 | pupilfirst | 7 | devise, pg, postmark, redis, rack-attack, omniauth, aws-sdk-s3 | DB, Auth, Email, Cache, Storage | Excellent. |
| 79 | plots2 | 7 | google-cloud-storage, omniauth, sentry-ruby, sidekiq, mysql2, Google Analytics, Meta Pixel | DB, Auth, Storage, Analytics | Good. |
| 80 | lobsters | 4 | sentry-ruby, rack-attack, Google Analytics, Meta Pixel | Analytics, Security | DB (ActiveRecord) missed. |

**Ecosystem Score: GOOD. 9/10 with detections. Ruby gems well recognized. ActiveRecord/ActionMailer not explicitly detected.**

---

### PHP/Laravel (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 81 | bagisto | 6 | laravel-socialite, @aws-sdk/client-s3, ioredis, redis, @aws-sdk/client-ses, @aws-sdk/client-sns | Auth, Storage, Cache, Email | Good. Payments missed. |
| 82 | monica | 4 | laravel-socialite, sentry-laravel, ioredis, redis | Auth, Monitoring, Cache | Partial. DB not detected. |
| 83 | bookstack | 2 | laravel-socialite, oauth2-client | Auth | Partial. DB/Storage missed. |
| 84 | koel | 12 | laravel-socialite, laravel-permission, openai, @anthropic-ai/sdk, @aws-sdk/client-s3, algoliasearch, googleapis, passport-* | Auth, AI, Storage, Search | Very good. |
| 85 | openemr | 2 | stripe, twilio | Payments, Communication | DB/Auth missed. |

**Ecosystem Score: MODERATE. Laravel socialite/permissions detected. Core PHP/MySQL patterns missed.**

---

### Go (15 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 56 | gitea | 2 | aws-sdk-go, go-redis | Storage, Cache | DB (xorm), Auth (OAuth) missed. |
| 57 | minio | 1 | mongo-driver | DB | S3 storage core purpose not detected. |
| 58 | grafana | 6 | aws-sdk-go, pgx, go-redis, mongo-driver, @vercel/ai, Google Analytics | DB, Storage, Cache, Analytics | Good. Multiple DBs detected. |
| 59 | pocketbase | 0 | (none) | DB, Auth, Storage | Missed entirely. Single-binary Go. |
| 60 | gogs | 3 | gorm, sentry-go, pgx | DB, Monitoring | Good DB detection. |
| 61 | traefik | 4 | aws-sdk-go, go-redis, gin, mongo-driver | Storage, Cache | Reasonable. |
| 62 | syncthing | 0 | (none) | Storage, Analytics | Missed. Pure Go with minimal deps. |
| 63 | uptime-kuma | 3 | nodemailer, web-push, redis | Email, Notifications, Cache | Good (Node.js project). |
| 64 | vault | 7 | aws-sdk-go, pgx, mongo-driver, redis, replicate, posthog, @vercel/ai | DB, Storage, Cache | Good. Multiple backends detected. |
| 65 | woodpecker | 3 | gin, mongo-driver, @cloudflare/workers-types | Framework, DB | Partial. |
| 66 | chi | 0 | (none) | None expected | Correct negative. |
| 67 | fiber | 0 | (none) | None expected | Correct negative. |
| 68 | river | 1 | pgx | DB | Correct. |
| 69 | ory-kratos | 2 | pgx, mongo-driver | DB | Auth (its core purpose) not detected. |
| 70 | casdoor | 5 | aws-sdk-go, gopay, sendgrid-go, stripe-go, go-redis | Storage, Payments, Email, Cache | Good. Auth (core) not explicitly detected. |

**Ecosystem Score: MODERATE. Go DB drivers (pgx, gorm, mongo-driver) detected. Go auth patterns missed.**

---

### Rust (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 86 | rustdesk | 1 | reqwest | HTTP client | Minimal. SQLite/Auth missed. |
| 87 | polars | 0 | (none) | None expected | Correct negative. |
| 88 | appflowy | 0 | (none) | DB, Auth, AI | Missed. Flutter/Rust deps not scanned. |
| 89 | loco | 7 | sea-orm, lettre, argon2, jsonwebtoken, sqlx, redis, reqwest | DB, Email, Auth, Cache | Excellent! Best Rust detection. |
| 90 | plausible | 11 | bamboo, ecto, postgrex, sentry-elixir, ex_aws, oban, Plausible Analytics, Hotjar, etc. | DB, Analytics, Storage | Good Elixir detection! |

**Ecosystem Score: MIXED. Rust crate detection works for loco. Elixir (plausible) surprisingly well detected.**

---

### Java/Spring (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 91 | killbill | 0 | (none) | DB, Auth, Payments | Missed entirely. Java/Maven deps not scanned. |
| 92 | cas | 1 | Google Analytics | Analytics | SSO/Auth core purpose missed. |
| 93 | jhipster | 1 | spring-security | Auth | Good! Spring Security detected. |
| 94 | thingsboard | 2 | jjwt, firebase-admin | Auth, Notifications | Partial. DB missed. |
| 95 | metasfresh | 0 | (none) | DB, Auth, Payments | Missed entirely. |

**Ecosystem Score: POOR. Java/Maven/Gradle dependency scanning very limited.**

---

### Mixed/Monorepo (5 repos)

| # | Repo | Detected | Services Found | Expected Key Services | Accuracy Notes |
|---|------|----------|----------------|----------------------|----------------|
| 97 | nocodb | 11 | @vercel/ai, @sentry/*, ioredis, @aws-sdk/client-s3, @google-cloud/storage, nodemailer, twilio, passport-* | Auth, Storage, Email, Notifications | Good. |
| 98 | erpnext | 1 | plaid | Financial | Python/Frappe deps mostly missed. |
| 99 | metriport | 5 | @sentry/*, @aws-sdk/client-s3, posthog, langchain | Monitoring, Storage, AI | Partial. DB/FHIR missed. |
| 100 | fonoster | 6 | prisma, nodemailer, twilio, openai, @twilio/voice-sdk, Google Analytics | DB, Email, Communication, AI, Analytics | Good. |

---

### Other Results

| Repo | Detected | Services | Notes |
|------|----------|----------|-------|
| supabase | 10 | openai, stripe, drizzle, @clerk/nextjs, posthog, nodemailer, @sentry/*, @vercel/ai | Good for monorepo |
| prisma | 3 | prisma, mongoose, @cloudflare/* | Meta-detection of its own tool |
| turbo | 3 | @vercel/ai, @vercel/analytics, @upstash/redis | Telemetry detected |
| infisical | 21 | Comprehensive detection including LinkedIn Insight Tag | Most services of any repo |
| hatchet | 12 | pgx, openai, cohere, @anthropic-ai/sdk, sentry-go, posthog | Good Go+TS detection |
| friendlyeats | 1 | firebase | Correct. |
| lago | 0 | (none) | Rails API missed. Ruby deps not found. |
| react-firebase | 6 | passport, firebase-admin, passport-google-oauth20, @google-analytics/data, googleapis | Good Firebase detection |

---

## Detection Rate by Ecosystem

| Ecosystem | Repos | With Detections | Detection Rate | Avg Services | Quality |
|-----------|-------|-----------------|----------------|--------------|---------|
| Next.js/Prisma | 10 | 10 | 100% | 11.1 | EXCELLENT |
| Express/Fastify | 5 | 4 | 80% | 6.0 | GOOD |
| Ruby/Rails | 10 | 9 | 90% | 7.7 | GOOD |
| AI/ML | 5 | 5 | 100% | 5.2 | GOOD |
| PHP/Laravel | 5 | 5 | 100% | 5.2 | MODERATE |
| Flask | 5 | 4 | 80% | 2.0 | MODERATE |
| Go | 15 | 11 | 73% | 2.5 | MODERATE |
| Mixed/Monorepo | 5 | 4 | 80% | 5.8 | MODERATE |
| Rust/Elixir | 5 | 3 | 60% | 3.8 | MIXED |
| Django | 9* | 6 | 67% | 2.4 | POOR |
| FastAPI | 5 | 2 | 40% | 1.8 | POOR |
| Java/Spring | 5 | 3 | 60% | 0.8 | POOR |

*taiga-back excluded (clone failure)

---

## Negative Test Results (Expected 0 Detections)

| Repo | Expected | Detected | Result |
|------|----------|----------|--------|
| got | 0 | 0 | PASS |
| chi | 0 | 0 | PASS |
| fiber | 0 | 0 | PASS |
| polars | 0 | 0 | PASS |
| oclif | 0 | 1 (@aws-sdk/client-s3) | FALSE POSITIVE |

**False Positive Rate: 1/5 negative test cases (20%). oclif detected @aws-sdk/client-s3 likely from a dev dependency or example.**

---

## Most Commonly Detected Services

| Service | Times Detected | Category |
|---------|---------------|----------|
| redis/ioredis | 52 | Cache/Queue |
| nodemailer | 22 | Email |
| @sentry/* | 21 | Monitoring |
| stripe/stripe-go | 20 | Payments |
| @aws-sdk/client-s3 | 16 | Storage |
| prisma | 14 | Database |
| openai | 14 | AI |
| posthog | 13 | Analytics |
| next-auth/@auth/core | 12 | Auth |
| passport/passport-* | 11 | Auth |
| Google Analytics | 10 | Analytics |
| pg/pgx | 9 | Database |
| devise | 6 | Auth (Ruby) |
| omniauth | 6 | Auth (Ruby) |
| sidekiq | 6 | Queue (Ruby) |
| @vercel/ai | 12 | AI |

---

## Most Commonly MISSED Services

| Service/Pattern | Expected In | Issue |
|----------------|-------------|-------|
| Django ORM/models | ~10 Django repos | No Django-specific detection patterns |
| django.contrib.auth | ~10 Django repos | Django auth not in signatures |
| django.core.mail | ~5 Django repos | Django email not detected |
| ActiveRecord (Rails) | ~10 Rails repos | Implicit DB usage not detected |
| ActionMailer (Rails) | ~5 Rails repos | Rails email not detected |
| TypeORM | medusa, others | TypeORM not in signatures |
| Knex.js | strapi | Knex not in signatures |
| Maven/Gradle Java deps | ~5 Java repos | Java build system not scanned |
| Go standard lib (net/http, database/sql) | many Go repos | Go stdlib not detected |
| Eloquent (Laravel) | ~5 PHP repos | Laravel ORM not detected |
| Tortoise ORM | fastapi-crud | Python ORM not detected |
| ClickHouse | sentry, logfire | Not in signatures |

---

## Key Findings

### Strengths
1. **JavaScript/TypeScript detection is excellent.** npm package.json scanning works very well across Next.js, Express, NestJS, and general Node.js projects.
2. **Ruby gem detection is strong.** Gemfile scanning catches most Ruby gems (devise, omniauth, pg, sidekiq, stripe, sentry-ruby, rack-attack).
3. **AI service detection is comprehensive.** OpenAI, Anthropic, Cohere, Replicate, LangChain, and Vercel AI SDK all detected consistently.
4. **Tracking pixel detection works.** Google Analytics, Meta Pixel, LinkedIn Insight Tag, Hotjar, Plausible all detected via HTML/script scanning.
5. **Monorepo scanning works.** Cal.com (Turborepo), Sentry, Chatwoot all scanned across sub-packages.
6. **Zero scan failures.** Every repo that cloned successfully was scanned without errors.

### Weaknesses
1. **Django/Python detection is the biggest gap.** Django ORM, auth, email, and most Python-specific patterns go undetected. Only boto3, SQLAlchemy, flask-login, and PyJWT are caught.
2. **Java/Maven detection barely exists.** Only spring-security, jjwt, and firebase-admin detected. No pom.xml or build.gradle scanning.
3. **Go detection is shallow.** Go module dependencies (go.mod) partially scanned but many Go-specific libraries missed. Standard library usage invisible.
4. **Framework-implicit services missed.** When a framework provides built-in DB/auth/email (Django, Rails ActiveRecord/ActionMailer, Laravel Eloquent), these are invisible to Codepliant.
5. **FastAPI/Python async ecosystem invisible.** Tortoise ORM, databases, encode/starlette auth patterns all missed.
6. **PHP Composer scanning weak.** Laravel's composer.json dependencies beyond socialite are not well detected.

### Recommendations (Priority Order)
1. **Add Django signature patterns:** `django.db`, `django.contrib.auth`, `django.core.mail`, `celery`, `django-allauth`, `django-rest-framework`
2. **Add Python ORM patterns:** `tortoise-orm`, `databases`, `asyncpg`, `psycopg2`, `peewee`
3. **Improve Java scanning:** Parse pom.xml and build.gradle for Spring Boot, Hibernate, JDBC dependencies
4. **Add Go module patterns:** `database/sql`, `gorm.io`, `xorm`, `golang.org/x/oauth2`, `github.com/go-ldap/ldap`
5. **Add framework-implicit detection:** If Django is detected, infer DB and auth. If Rails, infer ActiveRecord and ActionMailer.
6. **Add PHP/Composer scanning:** Parse composer.json for Eloquent, Laravel Sanctum, Laravel Mail, etc.
7. **Add TypeORM and Knex detection**

---

## Overall Assessment

**Codepliant achieves strong detection (82.8% of repos) with excellent coverage in the JavaScript/TypeScript ecosystem where most modern SaaS products live.** The tool correctly identifies 0 services for pure library/framework projects (4/5 negative tests pass).

However, detection drops significantly for Python (Django/FastAPI), Java, and Go ecosystems. These gaps matter because many enterprise and data-heavy applications use these stacks. Adding Django and Java detection would cover the two largest gaps.

**Overall Grade: B+** -- Excellent in its core ecosystem (JS/TS/Ruby), but needs expansion to Python, Java, and Go to be truly comprehensive.
