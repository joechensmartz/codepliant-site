# Codepliant Test Repository List (100 Repos)

A curated list of 100 real open-source repositories for testing Codepliant's detection capabilities across ecosystems, project types, scales, and industries.

**Legend:**
- Stars: approximate as of early 2026
- Detections: what Codepliant should find (DB = database, Auth = authentication, Payments = payment processing, Analytics = analytics/tracking, Storage = file storage, Email = email sending, AI = AI/ML API usage, PII = personal data collection)

---

## JavaScript/TypeScript (30 repos)

### Next.js + Prisma Projects (10)

| # | Repository | Stars | Tech Stack | Expected Detections | Prisma? | .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|---------|-------|-----------------|-----------------|
| 1 | [cal.com/cal.com](https://github.com/calcom/cal.com) | ~33k | Next.js, Prisma, tRPC, Stripe, Tailwind | DB (Postgres), Auth (NextAuth), Payments (Stripe), Email (SendGrid), Analytics, PII (calendar/user data) | Yes | Yes | Yes | Large-scale scheduling SaaS with Turborepo monorepo; complex Prisma schema with user/booking/event models |
| 2 | [dubinc/dub](https://github.com/dubinc/dub) | ~20k | Next.js, Prisma, Tinybird, Stripe, Upstash | DB (Postgres/PlanetScale), Auth (NextAuth), Payments (Stripe), Analytics (Tinybird), PII (link click tracking) | Yes | Yes | Yes | Link management platform; heavy analytics with click tracking raises privacy questions |
| 3 | [documenso/documenso](https://github.com/documenso/documenso) | ~9k | Next.js, Prisma, tRPC, Stripe | DB (Postgres), Auth (NextAuth), Payments (Stripe), Email, Storage (S3), PII (document signatures, email) | Yes | Yes | Yes | DocuSign alternative; handles sensitive document signing data |
| 4 | [formbricks/formbricks](https://github.com/formbricks/formbricks) | ~8k | Next.js, Prisma, Tailwind | DB (Postgres), Auth (NextAuth), Analytics, PII (survey responses, user behavior tracking) | Yes | Yes | Yes | Survey/experience management; collects user feedback and behavioral data |
| 5 | [papermark/papermark](https://github.com/mfts/papermark) | ~5k | Next.js, Prisma, Stripe, Resend | DB (Postgres), Auth (NextAuth), Payments (Stripe), Analytics (document views), PII (viewer tracking) | Yes | Yes | Yes | DocSend alternative; tracks who views documents and for how long |
| 6 | [boxyhq/saas-starter-kit](https://github.com/boxyhq/saas-starter-kit) | ~3k | Next.js, Prisma, Stripe, SAML Jackson | DB (Postgres), Auth (NextAuth + SAML), Payments (Stripe), PII (enterprise SSO user data) | Yes | Yes | No | Enterprise SaaS boilerplate with SSO; good test for auth detection |
| 7 | [calcom/cal.com (docker)](https://github.com/pdovhomilja/nextcrm-app) | ~2k | Next.js, Prisma, PostgreSQL, shadcn/ui | DB (Postgres), Auth, PII (CRM customer data, contacts) | Yes | Yes | No | Open-source CRM; stores customer PII directly |
| 8 | [sesto-dev/next-prisma-tailwind-ecommerce](https://github.com/sesto-dev/next-prisma-tailwind-ecommerce) | ~1k | Next.js, Prisma, Tailwind, Stripe | DB (Postgres), Auth, Payments (Stripe), PII (customer orders, addresses) | Yes | Yes | No | E-commerce storefront with admin panel; handles payment and shipping data |
| 9 | [wasp-lang/open-saas](https://github.com/wasp-lang/open-saas) | ~8k | Wasp (React + Node), Prisma, Stripe | DB (Postgres), Auth (email/Google/GitHub), Payments (Stripe), Email, AI (OpenAI), PII | Yes | Yes | No | Full SaaS boilerplate; good baseline test with multiple integrations |
| 10 | [saashqdev/saashq](https://github.com/saashqdev/saashq) | ~1k | Next.js, Prisma, Stripe, shadcn | DB (Postgres), Auth, Payments (Stripe), Email, PII (CRM/ERP data) | Yes | Yes | No | CRM/ERP starter; complex data model with invoicing and contacts |

### Express/Fastify API Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Prisma? | .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|---------|-------|-----------------|-----------------|
| 11 | [medusajs/medusa](https://github.com/medusajs/medusa) | ~26k | Node.js, Express, TypeORM, PostgreSQL | DB (Postgres), Auth (JWT), Payments (Stripe/PayPal), PII (customer orders, addresses, payment info) | No | Yes | Yes | Headless commerce engine; handles extensive customer PII and payment data |
| 12 | [payloadcms/payload](https://github.com/payloadcms/payload) | ~29k | Node.js, Express/Next.js, MongoDB/Postgres | DB (Mongo/Postgres), Auth (built-in), Storage (S3), PII (CMS user data) | No | Yes | Yes | Headless CMS; flexible data models that could contain any PII |
| 13 | [strapi/strapi](https://github.com/strapi/strapi) | ~65k | Node.js, Koa, Knex, PostgreSQL/MySQL/SQLite | DB (multi), Auth (JWT + providers), Storage (S3/Cloudinary), PII (user management) | No | Yes | Yes | Largest open-source headless CMS; extensive plugin ecosystem |
| 14 | [fastify/demo](https://github.com/fastify/demo) | ~300 | Fastify, PostgreSQL | DB (Postgres), Auth (JWT), PII (task management user data) | No | Yes | No | Official Fastify best-practices demo; small but well-structured |
| 15 | [nestjs/nest](https://github.com/nestjs/nest) | ~69k | NestJS (Express/Fastify), TypeORM/Prisma | DB (varies), Auth (Passport), PII (framework examples) | No | Yes | Yes | Enterprise Node.js framework; test against example apps |

### React + Firebase Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Prisma? | .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|---------|-------|-----------------|-----------------|
| 16 | [supabase/supabase](https://github.com/supabase/supabase) | ~75k | Next.js, PostgreSQL, GoTrue, Kong | DB (Postgres), Auth (GoTrue), Storage (S3-compatible), PII (user auth data), Analytics | No | Yes | Yes | Firebase alternative; the backend itself handles massive PII |
| 17 | [appwrite/appwrite](https://github.com/appwrite/appwrite) | ~46k | Node.js, PHP, MariaDB, Redis | DB (MariaDB), Auth (built-in), Storage (built-in), PII (user data, OAuth tokens) | No | Yes | Yes | BaaS platform; stores auth credentials and user profiles |
| 18 | [firebase/friendlyeats-web](https://github.com/firebase/friendlyeats-web) | ~1k | React, Firebase, Firestore | DB (Firestore), Auth (Firebase Auth), PII (user reviews) | No | No | No | Official Firebase demo; good small-project test case |
| 19 | [kriasoft/react-firebase-starter](https://github.com/kriasoft/react-firebase-starter) | ~5k | React, Firebase, GraphQL, Relay | DB (Firestore), Auth (Firebase Auth), PII (user profiles) | No | Yes | No | Full-stack React+Firebase boilerplate with GraphQL |
| 20 | [ClassroomIO/classroomio](https://github.com/classroomio/classroomio) | ~5k | Svelte, Supabase (Postgres), Stripe | DB (Postgres/Supabase), Auth (Supabase Auth), Payments (Stripe), PII (student data, grades) | No | Yes | No | EdTech LMS; handles sensitive student data and academic records |

### Node.js CLI/Library Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Prisma? | .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|---------|-------|-----------------|-----------------|
| 21 | [oclif/oclif](https://github.com/oclif/oclif) | ~9k | Node.js, TypeScript | None expected (CLI framework, no data collection) | No | No | No | Should produce minimal/no compliance findings; good negative test |
| 22 | [sindresorhus/got](https://github.com/sindresorhus/got) | ~14k | Node.js, TypeScript | None expected (HTTP client library) | No | No | No | Pure library; Codepliant should detect nothing - negative test |
| 23 | [prisma/prisma](https://github.com/prisma/prisma) | ~40k | TypeScript, Rust | DB (schema definitions), PII (schema examples may reference user data) | Yes (meta) | Yes | Yes | The ORM itself; interesting to see how Codepliant handles tooling vs app |
| 24 | [vercel/turbo](https://github.com/vercel/turbo) | ~26k | TypeScript, Rust, Go | Analytics (telemetry), PII (anonymous usage data) | No | No | Yes | Build system with telemetry; tests detection of usage tracking in CLI tools |
| 25 | [infisical/infisical](https://github.com/infisical/infisical) | ~16k | Next.js, Node.js, MongoDB, Redis | DB (MongoDB), Auth (JWT/SAML/OIDC), PII (secrets management, user data), Email | No | Yes | Yes | Secrets manager; ironically handles the most sensitive data possible |

### Full-stack with Stripe/Auth (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Prisma? | .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|---------|-------|-----------------|-----------------|
| 26 | [getlago/lago](https://github.com/getlago/lago) | ~8k | Ruby/Rails API + React frontend | DB (Postgres), Auth, Payments (Stripe), PII (billing/metering data) | No | Yes | Yes | Usage-based billing; processes financial data and customer usage metrics |
| 27 | [twentyhq/twenty](https://github.com/twentyhq/twenty) | ~24k | TypeScript, NestJS, React, PostgreSQL | DB (Postgres), Auth, PII (CRM contacts, companies, deals), Email | No | Yes | Yes | Salesforce alternative; extensive customer PII in CRM records |
| 28 | [n8n-io/n8n](https://github.com/n8n-io/n8n) | ~50k | TypeScript, Vue.js, PostgreSQL/SQLite | DB (Postgres/SQLite), Auth (built-in), PII (workflow data may contain any data type) | No | Yes | Yes | Workflow automation; processes arbitrary data from 400+ integrations |
| 29 | [hatchet-dev/hatchet](https://github.com/hatchet-dev/hatchet) | ~4k | TypeScript, Go, PostgreSQL, gRPC | DB (Postgres), Auth, PII (task queue metadata) | No | Yes | No | Task queue; may process PII in job payloads |
| 30 | [ghostfolio/ghostfolio](https://github.com/ghostfolio/ghostfolio) | ~4k | Angular, NestJS, Prisma, PostgreSQL | DB (Postgres), Auth, PII (financial portfolio data, investment holdings) | Yes | Yes | Yes | Wealth management; handles sensitive financial data |

---

## Python (25 repos)

### Django Projects (10)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 31 | [saleor/saleor](https://github.com/saleor/saleor) | ~21k | Django, GraphQL, PostgreSQL, Celery | DB (Postgres), Auth (JWT), Payments (Stripe/Braintree/Adyen), PII (customer/order data) | Yes | Yes | Large-scale headless e-commerce; processes payments and customer shipping data |
| 32 | [shuup/shuup](https://github.com/shuup/shuup) | ~2k | Django, PostgreSQL | DB (Postgres), Auth, Payments (multi), PII (customer/order data) | Yes | No | Multi-vendor marketplace platform; multi-tenant customer data |
| 33 | [django-oscar/django-oscar](https://github.com/django-oscar/django-oscar) | ~6k | Django, PostgreSQL | DB (Postgres), Auth (Django), Payments (pluggable), PII (e-commerce customer data) | Yes | No | Domain-driven e-commerce framework; rich customer and order models |
| 34 | [dj-stripe/dj-stripe](https://github.com/dj-stripe/dj-stripe) | ~2k | Django, Stripe | DB (any Django DB), Payments (Stripe), PII (synced Stripe customer data) | Yes | No | Stripe data sync library; mirrors Stripe customer/payment data locally |
| 35 | [netbox-community/netbox](https://github.com/netbox-community/netbox) | ~16k | Django, PostgreSQL, Redis | DB (Postgres), Auth (LDAP/SSO), PII (infrastructure/contact data) | Yes | No | Network infrastructure management; stores contact information and access data |
| 36 | [sentry-python/sentry](https://github.com/getsentry/sentry) | ~40k | Django, PostgreSQL, Redis, Kafka, ClickHouse | DB (Postgres+ClickHouse), Auth (SSO/SAML), PII (error reports may contain user data), Analytics | Yes | Yes | Error monitoring; ingests stack traces that may contain user PII |
| 37 | [zulip/zulip](https://github.com/zulip/zulip) | ~21k | Django, PostgreSQL, Tornado | DB (Postgres), Auth (LDAP/SAML/OAuth), Email, PII (chat messages, user profiles), Storage | Yes | Yes | Team chat; stores all message content and user profile data |
| 38 | [taiga-io/taiga-back](https://github.com/taiga-io/taiga-back) | ~5k | Django, PostgreSQL, Celery, RabbitMQ | DB (Postgres), Auth (OAuth/LDAP), PII (project management user data), Email | Yes | No | Project management backend; user profiles and project assignments |
| 39 | [healthchecks/healthchecks](https://github.com/healthchecks/healthchecks) | ~8k | Django, PostgreSQL | DB (Postgres), Auth, Email (notifications), PII (user emails, webhook URLs) | Yes | No | Cron job monitoring; stores notification endpoints and user contact info |
| 40 | [adilmohak/dj-lms-starter](https://github.com/adilmohak/dj-lms-starter) | ~500 | Django, PostgreSQL, Bootstrap | DB (Postgres/SQLite), Auth (Django), PII (student records, grades) | Yes | No | EdTech LMS; handles student academic data; small project test case |

### FastAPI Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 41 | [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) | ~28k | FastAPI, SQLModel, PostgreSQL, React | DB (Postgres), Auth (JWT), PII (user management), Email | Yes | No | Official FastAPI template; canonical Python API structure |
| 42 | [testdrivenio/fastapi-crud-async](https://github.com/testdrivenio/fastapi-crud-async) | ~500 | FastAPI, Tortoise ORM, PostgreSQL | DB (Postgres), PII (depends on model) | Yes | No | Small CRUD example; tests minimal project detection |
| 43 | [tiangolo/sqlmodel](https://github.com/fastapi/sqlmodel) | ~16k | FastAPI, SQLAlchemy, Pydantic | DB (SQLite/Postgres), PII (example models) | No | No | SQL toolkit; tests detection of DB schemas in library code |
| 44 | [Buuntu/fastapi-react](https://github.com/Buuntu/fastapi-react) | ~2k | FastAPI, React, PostgreSQL, Docker | DB (Postgres), Auth, PII (user data) | Yes | No | Full-stack FastAPI+React; good medium-sized test |
| 45 | [pydantic/logfire](https://github.com/pydantic/logfire) | ~3k | FastAPI, Python, ClickHouse | DB (ClickHouse), Auth, Analytics (observability), PII (log data may contain user info) | Yes | Yes | Observability platform; logs can contain PII |

### Flask Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 46 | [freedomofpress/securedrop](https://github.com/freedomofpress/securedrop) | ~4k | Flask, SQLAlchemy, Tor | DB (SQLite), Auth (custom), PII (whistleblower submissions - extremely sensitive) | Yes | Yes | Whistleblower platform; handles the most sensitive data imaginable |
| 47 | [simple-login/app](https://github.com/simple-login/app) | ~5k | Flask, PostgreSQL, SQLAlchemy | DB (Postgres), Auth, Email (SMTP), PII (email aliases, user identity) | Yes | Yes | Email alias service; protects identity but still stores PII |
| 48 | [flaskbb/flaskbb](https://github.com/flaskbb/flaskbb) | ~3k | Flask, SQLAlchemy, PostgreSQL | DB (Postgres/SQLite), Auth (Flask-Login), PII (forum user profiles, posts) | Yes | No | Classic forum software; user profiles with email, IP logging |
| 49 | [dpgaspar/Flask-AppBuilder](https://github.com/dpgaspar/Flask-AppBuilder) | ~5k | Flask, SQLAlchemy | DB (multi), Auth (OAuth/LDAP/DB), PII (user management) | Yes | No | App framework with built-in auth; generates CRUD with user models |
| 50 | [apache/superset](https://github.com/apache/superset) | ~63k | Flask, React, SQLAlchemy, Redis | DB (multi), Auth (OAuth/LDAP/DB), Analytics, PII (dashboard users, data access) | Yes | Yes | BI platform; connects to databases that may contain customer data |

### AI/ML Projects (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 51 | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | ~100k | Python, OpenAI API, various LLM APIs | AI (OpenAI/Anthropic/etc API keys), DB (vector stores), PII (prompts may contain user data) | Yes | Yes | LLM framework; API key management and data sent to third-party AI providers |
| 52 | [langgenius/dify](https://github.com/langgenius/dify) | ~55k | Python, Flask, React, PostgreSQL, Redis | DB (Postgres), Auth, AI (OpenAI/Anthropic), Storage (S3), PII (conversation data), Email | Yes | Yes | LLM app platform; stores conversations that may contain sensitive user data |
| 53 | [openai/openai-python](https://github.com/openai/openai-python) | ~24k | Python | AI (OpenAI API), PII (API requests may contain user data) | No | Yes | Official OpenAI SDK; test detection of AI API usage patterns |
| 54 | [run-llama/llama_index](https://github.com/run-llama/llama_index) | ~38k | Python, LLM APIs, vector DBs | AI (OpenAI/etc), DB (vector stores - Pinecone/Weaviate/etc), PII (indexed documents) | Yes | Yes | Data framework for LLMs; ingests and indexes potentially sensitive documents |
| 55 | [BerriAI/litellm](https://github.com/BerriAI/litellm) | ~15k | Python, FastAPI | AI (100+ LLM APIs), Auth (API keys), DB (Postgres), PII (proxied prompts/responses) | Yes | Yes | LLM proxy; routes all AI traffic, sees all prompts and completions |

---

## Go (15 repos)

### Go Web Services (10)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 56 | [go-gitea/gitea](https://github.com/go-gitea/gitea) | ~46k | Go, SQLite/PostgreSQL/MySQL | DB (multi), Auth (OAuth/LDAP), Storage (local/S3), PII (user profiles, repo access, SSH keys) | Yes | Yes | Git hosting; stores user credentials, SSH keys, code |
| 57 | [minio/minio](https://github.com/minio/minio) | ~49k | Go, S3-compatible | Storage (S3), Auth (IAM), PII (stored objects may contain anything) | Yes | Yes | Object storage; stores arbitrary user data |
| 58 | [grafana/grafana](https://github.com/grafana/grafana) | ~65k | Go, React, PostgreSQL/MySQL/SQLite | DB (multi), Auth (OAuth/LDAP/SAML), Analytics, PII (dashboard users, data source credentials) | Yes | Yes | Observability platform; connects to data sources with sensitive info |
| 59 | [pocketbase/pocketbase](https://github.com/pocketbase/pocketbase) | ~42k | Go, SQLite, Svelte | DB (SQLite), Auth (built-in), Storage (local/S3), PII (user records) | No | Yes | BaaS in single binary; stores user auth data and app records |
| 60 | [gogs/gogs](https://github.com/gogs/gogs) | ~45k | Go, SQLite/PostgreSQL/MySQL | DB (multi), Auth (LDAP/PAM), PII (user profiles, SSH keys, code) | Yes | Yes | Lightweight Git hosting; similar to Gitea, stores user credentials |
| 61 | [traefik/traefik](https://github.com/traefik/traefik) | ~52k | Go | Auth (middleware), PII (TLS certificates, access logs with IPs) | Yes | Yes | Reverse proxy; handles TLS certs and logs client IPs |
| 62 | [syncthing/syncthing](https://github.com/syncthing/syncthing) | ~67k | Go | Storage (file sync), PII (synced files may contain anything), Analytics (usage reporting) | No | Yes | File sync; handles user files and has optional usage reporting |
| 63 | [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma) | ~61k | Node.js (not Go - see note), SQLite | DB (SQLite), Auth (built-in), Email (notifications), PII (monitored URLs, notification endpoints) | Yes | No | Monitoring tool; stores notification credentials and endpoint URLs |
| 64 | [hashicorp/vault](https://github.com/hashicorp/vault) | ~31k | Go | DB (storage backends), Auth (multi), PII (secrets - the most sensitive data), Storage | Yes | Yes | Secrets management; handles encryption keys, tokens, credentials |
| 65 | [woodpecker-ci/woodpecker](https://github.com/woodpecker-ci/woodpecker) | ~4k | Go, Vue.js, PostgreSQL/SQLite | DB (Postgres/SQLite), Auth (OAuth), PII (CI/CD secrets, repo access tokens) | Yes | No | CI/CD server; stores repository tokens and build secrets |

### Go API Servers (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 66 | [go-chi/chi](https://github.com/go-chi/chi) | ~18k | Go | None expected (router library) | No | No | HTTP router library; negative test case for Go |
| 67 | [gofiber/fiber](https://github.com/gofiber/fiber) | ~34k | Go | None expected (web framework) | No | No | Express-inspired Go framework; negative test for framework code |
| 68 | [riverqueue/river](https://github.com/riverqueue/river) | ~4k | Go, PostgreSQL | DB (Postgres), PII (job payloads may contain user data) | No | No | Job queue for Go+Postgres; processes arbitrary job data |
| 69 | [ory/kratos](https://github.com/ory/kratos) | ~11k | Go, PostgreSQL | DB (Postgres), Auth (identity management), PII (user identities, credentials, recovery tokens) | Yes | Yes | Identity server; its entire purpose is managing user PII |
| 70 | [casdoor/casdoor](https://github.com/casdoor/casdoor) | ~10k | Go, React, MySQL/PostgreSQL | DB (multi), Auth (SSO/OAuth/SAML/LDAP), PII (user identities, OAuth tokens) | Yes | Yes | IAM/SSO platform; centralized identity and access management |

---

## Other (30 repos)

### Ruby/Rails (10)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 71 | [maybe-finance/maybe](https://github.com/maybe-finance/maybe) | ~35k | Ruby on Rails, PostgreSQL, Hotwire | DB (Postgres), Auth, PII (financial data, bank accounts, investments, net worth) | Yes | Yes | Personal finance; handles extremely sensitive financial data |
| 72 | [discourse/discourse](https://github.com/discourse/discourse) | ~43k | Ruby on Rails, PostgreSQL, Redis, Ember.js | DB (Postgres), Auth (OAuth/SAML/SSO), Email, PII (user profiles, posts, messages, IPs) | Yes | Yes | Forum platform; stores user profiles, private messages, IP addresses |
| 73 | [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) | ~21k | Ruby on Rails, Vue.js, PostgreSQL | DB (Postgres), Auth, PII (customer conversations, contact info, support tickets) | Yes | Yes | Customer support; stores customer conversations and contact details |
| 74 | [forem/forem](https://github.com/forem/forem) | ~22k | Ruby on Rails, PostgreSQL, Redis | DB (Postgres), Auth (OAuth), PII (user profiles, articles, comments), Analytics | Yes | Yes | Community platform (powers DEV.to); user profiles and content |
| 75 | [mastodon/mastodon](https://github.com/mastodon/mastodon) | ~47k | Ruby on Rails, PostgreSQL, Redis, Node.js | DB (Postgres), Auth (OAuth), PII (user profiles, posts, DMs, followers), Email, Storage (S3) | Yes | Yes | Social network; handles extensive user PII and private messages |
| 76 | [spree/spree](https://github.com/spree/spree) | ~13k | Ruby on Rails, PostgreSQL | DB (Postgres), Auth, Payments (Stripe/PayPal/etc), PII (customer orders, addresses, payment data) | Yes | Yes | E-commerce platform; processes payments and stores customer data |
| 77 | [solidusio/solidus](https://github.com/solidusio/solidus) | ~5k | Ruby on Rails, PostgreSQL | DB (Postgres), Auth, Payments (multi), PII (e-commerce customer data) | Yes | No | E-commerce framework (Spree fork); payment processing and order data |
| 78 | [pupilfirst/pupilfirst](https://github.com/pupilfirst/pupilfirst) | ~1k | Ruby on Rails, PostgreSQL, GraphQL | DB (Postgres), Auth, PII (student data, grades, submissions), Email | Yes | No | EdTech LMS; stores student academic records and personal info |
| 79 | [publiclab/plots2](https://github.com/publiclab/plots2) | ~1k | Ruby on Rails, MySQL | DB (MySQL), Auth, PII (user profiles, location data), Email | Yes | No | Community science platform; location data and user contributions |
| 80 | [lobsters/lobsters](https://github.com/lobsters/lobsters) | ~4k | Ruby on Rails, MySQL/MariaDB | DB (MySQL), Auth, PII (user profiles, voting history) | Yes | No | Link aggregator (like HN); user profiles and voting records |

### PHP/Laravel (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 81 | [bagisto/bagisto](https://github.com/bagisto/bagisto) | ~16k | Laravel, Vue.js, MySQL | DB (MySQL), Auth, Payments (multi), PII (e-commerce customer data, orders) | Yes | No | E-commerce platform; full customer lifecycle data |
| 82 | [monicahq/monica](https://github.com/monicahq/monica) | ~22k | Laravel, MySQL/PostgreSQL | DB (MySQL/Postgres), Auth, PII (personal CRM - contacts, relationships, notes about people) | Yes | Yes | Personal CRM; stores intimate details about personal relationships |
| 83 | [BookStackApp/BookStack](https://github.com/BookStackApp/BookStack) | ~16k | Laravel, MySQL | DB (MySQL), Auth (LDAP/SAML/OAuth), PII (user profiles, wiki content), Storage | Yes | No | Documentation wiki; user management and content with access controls |
| 84 | [koel/koel](https://github.com/koel/koel) | ~16k | Laravel, Vue.js, MySQL/PostgreSQL | DB (MySQL/Postgres), Auth (Sanctum), Storage (S3), PII (user listening data) | Yes | No | Music streaming; stores user listening habits and preferences |
| 85 | [openemr/openemr](https://github.com/openemr/openemr) | ~3k | PHP (custom), MySQL | DB (MySQL), Auth, PII (patient health records - HIPAA data), Email | Yes | Yes | Electronic health records; handles the most regulated data (PHI/HIPAA) |

### Rust (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 86 | [rustdesk/rustdesk](https://github.com/nicedeal-io/rustdesk) | ~78k | Rust, Flutter, SQLite | DB (SQLite), Auth, PII (remote desktop sessions, connection data) | No | Yes | Remote desktop; handles screen sharing sessions and connection credentials |
| 87 | [pola-rs/polars](https://github.com/pola-rs/polars) | ~31k | Rust, Python | None expected (data processing library) | No | No | DataFrame library; negative test case for data-processing tools |
| 88 | [AppFlowy-IO/AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | ~58k | Rust, Flutter, Dart | DB (local), Auth, AI (OpenAI), PII (notes, docs, user workspace data), Storage | Yes | Yes | Notion alternative; stores user documents and workspace data |
| 89 | [loco-rs/loco](https://github.com/loco-rs/loco) | ~5k | Rust, SeaORM, PostgreSQL | DB (Postgres), Auth (JWT), Email, PII (framework user models) | Yes | No | Rails-like Rust framework; generates user auth models by default |
| 90 | [plausible/analytics](https://github.com/plausible/analytics) | ~21k | Elixir/Rust, ClickHouse, PostgreSQL | DB (Postgres+ClickHouse), Auth, Analytics (privacy-focused), PII (website visitor data - anonymized) | Yes | Yes | Privacy-focused analytics; interesting to test how Codepliant handles privacy-by-design |

### Java/Spring (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 91 | [killbill/killbill](https://github.com/killbill/killbill) | ~5k | Java, Spring, MySQL/PostgreSQL | DB (MySQL/Postgres), Auth, Payments (multi-gateway), PII (billing/subscription/payment data) | No | Yes | Billing platform; processes payments and stores customer financial data |
| 92 | [apereo/cas](https://github.com/apereo/cas) | ~11k | Java, Spring Boot | DB (multi), Auth (CAS/SAML/OAuth/OIDC), PII (authentication data, user identities) | Yes | Yes | Enterprise SSO; centralized authentication handling user credentials |
| 93 | [jhipster/jhipster-sample-app](https://github.com/jhipster/jhipster-sample-app) | ~1k | Java, Spring Boot, Angular, PostgreSQL | DB (Postgres), Auth (JWT/OAuth2), PII (generated user management) | Yes | No | Generated app scaffold; tests detection in code-generated projects |
| 94 | [thingsboard/thingsboard](https://github.com/thingsboard/thingsboard) | ~18k | Java, Spring Boot, PostgreSQL, Cassandra | DB (Postgres+Cassandra), Auth (JWT), PII (IoT device data, user profiles), Analytics | Yes | Yes | IoT platform; device telemetry data and user management |
| 95 | [metasfresh/metasfresh](https://github.com/metasfresh/metasfresh) | ~1k | Java, Spring Boot, PostgreSQL | DB (Postgres), Auth, Payments, PII (ERP data - customers, invoices, HR records) | Yes | No | ERP system; comprehensive business data including HR and customer records |

### Mixed/Monorepo (5)

| # | Repository | Stars | Tech Stack | Expected Detections | Has .env? | Privacy Policy? | Why Interesting |
|---|-----------|-------|------------|---------------------|-----------|-----------------|-----------------|
| 96 | [calcom/cal.com](https://github.com/calcom/cal.com) | ~33k | Turborepo monorepo (Next.js, Prisma, Go) | (Already listed as #1 - included here as monorepo reference) | Yes | Yes | Turborepo monorepo with multiple packages; tests monorepo scanning |
| 97 | [nocodb/nocodb](https://github.com/nocodb/nocodb) | ~50k | Vue.js, Node.js, PostgreSQL/MySQL/SQLite | DB (multi), Auth, PII (spreadsheet data may contain anything) | Yes | Yes | Airtable alternative; stores arbitrary structured data from users |
| 98 | [frappe/erpnext](https://github.com/frappe/erpnext) | ~21k | Python (Frappe), MariaDB, Node.js | DB (MariaDB), Auth, Payments, PII (HR data, customer data, accounting), Email | Yes | Yes | Full ERP; contains HR/payroll, CRM, accounting - all sensitive data |
| 99 | [metriport/metriport](https://github.com/metriport/metriport) | ~2k | TypeScript, Node.js, PostgreSQL, FHIR | DB (Postgres), Auth (API keys), PII (health records - HIPAA/PHI), Storage (S3) | Yes | Yes | Healthcare API; handles FHIR health records - heavily regulated data |
| 100 | [fonoster/fonoster](https://github.com/fonoster/fonoster) | ~6k | Node.js, Go, gRPC, PostgreSQL | DB (Postgres), Auth, PII (voice call data, phone numbers), Storage | Yes | Yes | Telecom platform; handles phone numbers, call recordings, voice data |

---

## Summary Statistics

| Category | Count | With Prisma | With .env | With Privacy Policy |
|----------|-------|-------------|-----------|---------------------|
| Next.js + Prisma | 10 | 10 | 10 | 4 |
| Express/Fastify API | 5 | 0 | 5 | 3 |
| React + Firebase | 5 | 0 | 3 | 2 |
| Node.js CLI/Library | 5 | 1 | 2 | 3 |
| Full-stack Stripe/Auth | 5 | 1 | 5 | 3 |
| Django | 10 | 0 | 10 | 3 |
| FastAPI | 5 | 0 | 3 | 1 |
| Flask | 5 | 0 | 5 | 2 |
| AI/ML | 5 | 0 | 3 | 5 |
| Go Web Services | 10 | 0 | 6 | 7 |
| Go API Servers | 5 | 0 | 1 | 2 |
| Ruby/Rails | 10 | 0 | 10 | 5 |
| PHP/Laravel | 5 | 0 | 5 | 2 |
| Rust | 5 | 0 | 1 | 3 |
| Java/Spring | 5 | 0 | 3 | 3 |
| Mixed/Monorepo | 5 | 1 | 5 | 5 |
| **Total** | **100** | **13** | **77** | **53** |

## Coverage Matrix

### By Industry
| Industry | Repos | Examples |
|----------|-------|---------|
| Dev Tools | 25 | Gitea, Strapi, n8n, Infisical, Vault, Prisma |
| E-commerce | 12 | Saleor, Medusa, Bagisto, Spree, Solidus, Oscar |
| Fintech | 8 | Maybe Finance, Lago, Kill Bill, Ghostfolio, dj-stripe |
| Healthtech | 4 | OpenEMR, Metriport, SecureDrop, Healthchecks |
| EdTech | 4 | ClassroomIO, Pupilfirst, dj-lms-starter, Learnhouse |
| Social | 8 | Mastodon, Discourse, Forem, Chatwoot, Lobsters |
| AI/ML | 8 | LangChain, Dify, LlamaIndex, LiteLLM, AppFlowy |
| SaaS/Productivity | 15 | Cal.com, Dub, Twenty, Nocodb, n8n, Papermark |
| Infrastructure | 10 | Minio, Traefik, Grafana, PocketBase, Syncthing |
| Telecom | 1 | Fonoster |
| CRM | 5 | Twenty, NextCRM, Monica, Chatwoot, SaasHQ |

### By Scale
| Scale | Repos | Examples |
|-------|-------|---------|
| Small (< 1K stars) | 8 | Fastify demo, dj-lms-starter, JHipster sample |
| Medium (1K-10K stars) | 35 | Documenso, Formbricks, Papermark, FlaskBB |
| Large (10K-50K stars) | 40 | Cal.com, Medusa, Saleor, Gitea, Maybe |
| Very Large (50K+) | 17 | Strapi, Supabase, Grafana, Mastodon, LangChain |

### By Project Type
| Type | Repos | Examples |
|------|-------|---------|
| SaaS Product | 35 | Cal.com, Dub, Twenty, Chatwoot |
| API/Backend | 20 | Saleor, Medusa, Fastify demo, Ory Kratos |
| CLI Tool | 5 | oclif, Prisma CLI, Turbo, npm CLI, Got |
| Library/Framework | 10 | chi, Fiber, LangChain, Polars, SQLModel |
| Mobile App Backend | 5 | PocketBase, Supabase, Appwrite, AppFlowy |
| Full Platform | 25 | Grafana, Mastodon, ERPNext, Discourse |

### Expected Detection Categories
| Detection | Repos Where Expected |
|-----------|---------------------|
| Database | 90+ |
| Authentication | 85+ |
| PII Collection | 85+ |
| Payment Processing | 20+ |
| Email Sending | 25+ |
| File Storage | 20+ |
| AI/ML API Usage | 10+ |
| Analytics/Tracking | 15+ |
| No Detections (negative tests) | 5 |
