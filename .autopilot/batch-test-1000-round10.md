# Batch Test 1000 - Round 10: 100 Repos Across All Languages

**Date:** 2026-03-16
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete. Skip if clone >30s.
**Focus:** GitHub trending + popular repos: 20 Node.js/TS, 20 Python, 15 Ruby/Rails, 15 Go, 10 PHP/Laravel, 10 Rust, 10 Java/Spring

## Results

### Node.js/TypeScript (20)

| # | Repo | Services Detected |
|---|------|-------------------|
| 1 | vercel/commerce | 0 |
| 2 | calcom/cal.com | 0 |
| 3 | remotion-dev/remotion | 0 |
| 4 | highlight/highlight | 24 |
| 5 | twentyhq/twenty | 0 |
| 6 | documenso/documenso | 0 |
| 7 | formbricks/formbricks | 0 |
| 8 | triggerdotdev/trigger.dev | 0 |
| 9 | infisical/infisical | 0 |
| 10 | Budibase/budibase | 21 |
| 11 | tooljet/tooljet | 27 |
| 12 | nhost/nhost | 0 |
| 13 | amplication/amplication | 10 |
| 14 | hoppscotch/hoppscotch | 12 |
| 15 | refinedev/refine | 0 |
| 16 | novuhq/novu | 0 |
| 17 | growthbook/growthbook | 0 |
| 18 | boxyhq/jackson | 11 |
| 19 | unkeyed/unkey | 0 |
| 20 | appsmithorg/appsmith | 8 |

### Python (20)

| # | Repo | Services Detected |
|---|------|-------------------|
| 21 | PostHog/posthog | 0 |
| 22 | makeplane/plane | 19 |
| 23 | saleor/saleor | 8 |
| 24 | netbox-community/netbox | 12 |
| 25 | zulip/zulip | 8 |
| 26 | wagtail/wagtail | 5 |
| 27 | cookiecutter/cookiecutter-django | 2 |
| 28 | strawberry-graphql/strawberry | 3 |
| 29 | sanic-org/sanic | 2 |
| 30 | masoniteframework/masonite | 6 |
| 31 | prefecthq/prefect | 9 |
| 32 | dagster-io/dagster | 9 |
| 33 | zenml-io/zenml | 9 |
| 34 | mlflow/mlflow | 13 |
| 35 | bentoml/BentoML | 6 |
| 36 | ray-project/ray | 7 |
| 37 | wandb/wandb | 8 |
| 38 | great-expectations/great_expectations | 6 |
| 39 | Supervisely/supervisely | 2 |
| 40 | label-studio/label-studio | -- |

*Clone failure (1): label-studio/label-studio*

### Ruby/Rails (15)

| # | Repo | Services Detected |
|---|------|-------------------|
| 41 | forem/forem | 27 |
| 42 | gitlabhq/gitlabhq | -- |
| 43 | huginn/huginn | 16 |
| 44 | zammad/zammad | 19 |
| 45 | opf/openproject | 22 |
| 46 | fatfreecrm/fat_free_crm | 10 |
| 47 | redmine/redmine | 12 |
| 48 | Shopify/shopify-api-ruby | 0 |
| 49 | thoughtbot/paperclip | 0 |
| 50 | ankane/searchkick | 4 |
| 51 | mbleigh/acts-as-taggable-on | 2 |
| 52 | ruby-grape/grape | 0 |
| 53 | kickstarter/rack-attack | 2 |
| 54 | heartcombo/devise | 8 |
| 55 | jnunemaker/flipper | 12 |

*Clone failures (1): gitlabhq/gitlabhq (timeout >30s)*

### Go (15)

| # | Repo | Services Detected |
|---|------|-------------------|
| 56 | pocketbase/pocketbase | 0 |
| 57 | ollama/ollama | 6 |
| 58 | charmbracelet/bubbletea | 1 |
| 59 | wailsapp/wails | 1 |
| 60 | gohugoio/hugo | 4 |
| 61 | pulumi/pulumi | 6 |
| 62 | cloudflare/cloudflared | 4 |
| 63 | juanfont/headscale | 6 |
| 64 | milvus-io/milvus | 13 |
| 65 | dapr/dapr | 10 |
| 66 | argoproj/argo-cd | 4 |
| 67 | openfga/openfga | 4 |
| 68 | gravitational/teleport | 0 |
| 69 | loft-sh/vcluster | 3 |
| 70 | go-kratos/kratos | 0 |

### PHP/Laravel (10)

| # | Repo | Services Detected |
|---|------|-------------------|
| 71 | crater-invoice/crater | 7 |
| 72 | monicahq/monica | 10 |
| 73 | snipe/snipe-it | 8 |
| 74 | koel/koel | 14 |
| 75 | thedevdojo/wave | 9 |
| 76 | octobercms/october | 6 |
| 77 | statamic/cms | 5 |
| 78 | cachet/cachet | -- |
| 79 | flarum/flarum | 0 |
| 80 | flarum/framework | 1 |

*Clone failure (1): cachet/cachet*

### Rust (10)

| # | Repo | Services Detected |
|---|------|-------------------|
| 81 | pola-rs/polars | 1 |
| 82 | leptos-rs/leptos | 0 |
| 83 | qdrant/qdrant | 4 |
| 84 | lancedb/lance | 3 |
| 85 | cube-js/cube | 10 |
| 86 | rwf2/Rocket | 0 |
| 87 | surrealdb/surrealdb | 2 |
| 88 | zed-industries/zed | 0 |
| 89 | lapce/lapce | 0 |
| 90 | gitbutler/gitbutler | -- |

*Clone failure (1): gitbutler/gitbutler*

### Java/Spring (10)

| # | Repo | Services Detected |
|---|------|-------------------|
| 91 | keycloak/keycloak | 0 |
| 92 | apache/camel | 0 |
| 93 | opensearch-project/OpenSearch | 2 |
| 94 | dbeaver/dbeaver | 0 |
| 95 | apache/pulsar | 1 |
| 96 | camunda/camunda-bpm-platform | 2 |
| 97 | thingsboard/thingsboard | 6 |
| 98 | apache/skywalking | 2 |
| 99 | alibaba/spring-cloud-alibaba | 0 |
| 100 | debezium/debezium | 3 |

## Round 10 Summary

| Metric | Value |
|--------|-------|
| Repos attempted | 100 |
| Clone failures/timeouts | 4 |
| Repos scanned | **96** |
| Repos with detections (>0) | **67** |
| Detection rate | **70%** |
| Total services detected | **539** |
| Average services/repo | **5.6** |
| Max services detected | **27** (tooljet/tooljet, forem/forem) |
| Zero-detection repos | 29 |

## Per-Category Breakdown

| Category | Scanned | Detected | Rate | Total Services | Avg Services | Top Repo |
|----------|---------|----------|------|---------------|-------------|----------|
| Node.js/TypeScript | 20 | 7 | 35% | 113 | 5.7 | tooljet (27) |
| Python | 19 | 17 | 89% | 134 | 7.1 | makeplane (19) |
| Ruby/Rails | 13 | 11 | 85% | 134 | 10.3 | forem (27) |
| Go | 15 | 12 | 80% | 62 | 4.1 | milvus (13) |
| PHP/Laravel | 9 | 7 | 78% | 60 | 6.7 | koel (14) |
| Rust | 9 | 5 | 56% | 20 | 2.2 | cube (10) |
| Java/Spring | 10 | 5 | 50% | 16 | 1.6 | thingsboard (6) |

## Running Total (All Rounds)

| Round | Date | Focus | Repos Scanned | Detected | Rate | Services | Avg |
|-------|------|-------|---------------|----------|------|----------|-----|
| 1 (General OSS) | 2026-03-15 | Frameworks + tools | 50 | 27 | 54% | 131 | 2.6 |
| 3 (Large batch) | 2026-03-15 | Mixed popular repos | 204 | 132 | 65% | 824 | 4.0 |
| 4 (Ecosystem sweep) | 2026-03-15 | Go/Python/Ruby/PHP/Rust/Java/Elixir | 197 | 120 | 61% | 418 | 2.1 |
| 8 (Domain apps) | 2026-03-16 | E-commerce/Health/Edu/Finance/Social | 45 | 30 | 67% | 250 | 5.6 |
| 9 (Infra + tools) | 2026-03-16 | Auth/CMS/Collab/Media/Dev tools | 42 | 31 | 74% | 351 | 8.4 |
| 10 (All-language) | 2026-03-16 | Trending across 7 languages | 96 | 67 | 70% | 539 | 5.6 |
| **Grand Total** | | | **634** | **407** | **64%** | **2,513** | **4.0** |

## Grand Total: 634 Repos Scanned

| Metric | Value |
|--------|-------|
| **Total repos scanned** | **634** |
| **Total repos with detections** | **407** |
| **Overall detection rate** | **64%** |
| **Total services detected** | **2,513** |
| **Average services per repo** | **4.0** |
| **Zero crashes** | Yes -- scanner remained stable across all 634 repos |

## Top 10 Detections (Round 10)

| Repo | Stack | Services |
|------|-------|----------|
| tooljet/tooljet | TypeScript | 27 |
| forem/forem | Ruby | 27 |
| highlight/highlight | TypeScript | 24 |
| opf/openproject | Ruby | 22 |
| Budibase/budibase | TypeScript | 21 |
| makeplane/plane | Python | 19 |
| zammad/zammad | Ruby | 19 |
| huginn/huginn | Ruby | 16 |
| koel/koel | PHP | 14 |
| milvus-io/milvus | Go | 13 |

## Zero-Detection Repos (Needs Investigation)

### High-priority (apps that definitely use external services):

1. **PostHog/posthog** (Python) -- analytics platform with Kafka, ClickHouse, Redis, S3, many integrations; 0 detected is a major gap
2. **calcom/cal.com** (TypeScript) -- scheduling app with Stripe, Google Calendar, Zoom, etc.; confirmed gap from round 8
3. **twentyhq/twenty** (TypeScript) -- CRM using PostgreSQL, Redis, S3; monorepo structure may confuse scanner
4. **infisical/infisical** (TypeScript) -- secrets manager using Redis, PostgreSQL, SMTP, many cloud integrations
5. **novuhq/novu** (TypeScript) -- notification platform with 60+ provider integrations
6. **keycloak/keycloak** (Java) -- SSO/auth server using LDAP, SMTP, many OAuth providers
7. **gravitational/teleport** (Go) -- access platform using many cloud and auth services

### Lower-priority (libraries/frameworks, 0 expected):

8. **pocketbase/pocketbase** -- self-contained Go backend (expected 0)
9. **Shopify/shopify-api-ruby** -- Ruby API client library (expected 0)
10. **leptos-rs/leptos** -- Rust WASM framework (expected 0)
11. **rwf2/Rocket** -- Rust web framework (expected 0)
12. **go-kratos/kratos** -- Go microservice framework (expected 0)

## Key Observations

1. **Python detection jumped to 89%** -- MLOps and data tools (mlflow, prefect, dagster, zenml, wandb, great_expectations) all detected well; these use many cloud services (S3, GCS, Azure Blob, database drivers, SMTP)

2. **Ruby/Rails continues to dominate in services per repo (10.3 avg)** -- full-stack Rails apps like forem (27), openproject (22), zammad (19) have extensive integrations that codepliant picks up effectively through Gemfile + config scanning

3. **Node.js/TypeScript has the worst detection rate (35%)** despite being the primary scan target -- this is driven by monorepo structures (cal.com, twenty, novu, formbricks) where services may be in nested workspaces that the scanner doesn't traverse deeply enough

4. **Go apps improved vs round 4** (80% vs 60%) -- infrastructure tools like dapr (10), milvus (13), pulumi (6) detected well through go.mod and config files

5. **Java/Spring remains weakest (50%, 1.6 avg)** -- keycloak (0) and apache/camel (0) are significant gaps; these use Maven/Gradle dependencies that the scanner still does not parse well

6. **PHP/Laravel detection strong at 78%** -- Laravel apps (crater, monica, snipe-it, koel, wave) detected much better than raw PHP apps, confirming the Laravel-specific scanning works

7. **cube-js/cube (10 services) as a Rust standout** -- actually a TypeScript/Rust hybrid, so detection came from the TS layer; pure Rust apps still average only 2.2

8. **PostHog returning 0 is the biggest gap** -- a production analytics platform with dozens of integrations (Kafka, ClickHouse, Celery, Redis, S3, SMTP, Slack webhooks) returning zero services suggests a serious scanning issue with its Django project structure
