# Batch Test 1000 - Round 12

**Date:** 2026-03-16
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete
**Focus:** 50 real application repos across 5 ecosystems (Node.js SaaS, Python Django/Flask, Ruby Rails, Go infrastructure, PHP CMS/ecommerce)

## Results

### Node.js SaaS (10)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 1 | hoppscotch/hoppscotch | OK | 12 |
| 2 | documenso/documenso | OK | 0 |
| 3 | ever-co/ever-gauzy | OK | 0 |
| 4 | logto-io/logto | OK | 0 |
| 5 | amplication/amplication | OK | 10 |
| 6 | AppFlowy-IO/AppFlowy-Cloud | OK | 8 |
| 7 | toeverything/AFFiNE | OK | 0 |
| 8 | Infisical/infisical | OK | 0 |
| 9 | triggerdotdev/trigger.dev | OK | 0 |
| 10 | novuhq/novu | OK | 0 |

### Python Django/Flask (10)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 11 | wagtail/bakerydemo | OK | 4 |
| 12 | saleor/saleor | OK | 8 |
| 13 | netbox-community/netbox | OK | 12 |
| 14 | wger-project/wger | OK | 4 |
| 15 | zulip/zulip | OK | 8 |
| 16 | posthog/posthog | OK | 0 |
| 17 | sentry-demos/empower | OK | 18 |
| 18 | ArchiveBox/ArchiveBox | OK | 6 |
| 19 | awx-project/awx | CLONE_FAIL | 0 |
| 20 | Miserlou/Zappa | OK | 3 |

### Ruby Rails (10)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 21 | rubyforgood/human-essentials | OK | 15 |
| 22 | feedbin/feedbin | OK | 20 |
| 23 | lobsters/lobsters | OK | 14 |
| 24 | gitlabhq/gitlabhq | OK | 23 |
| 25 | diaspora/diaspora | OK | 19 |
| 26 | thoughtbot/administrate | OK | 8 |
| 27 | solidusio/solidus_starter_frontend | OK | 7 |
| 28 | hackclub/hcb | OK | 26 |
| 29 | codetriage/codetriage | OK | 16 |
| 30 | rubygems/rubygems.org | OK | 17 |

### Go Apps (10)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 31 | milvus-io/milvus | OK | 13 |
| 32 | grafana/loki | OK | 7 |
| 33 | argoproj/argo-cd | OK | 4 |
| 34 | go-gitea/gitea | OK | 8 |
| 35 | cloudflare/cloudflared | OK | 4 |
| 36 | goharbor/harbor | OK | 3 |
| 37 | juanfont/headscale | OK | 6 |
| 38 | k3s-io/k3s | OK | 4 |
| 39 | fluxcd/flux2 | OK | 5 |
| 40 | velero-io/velero | CLONE_FAIL | 0 |

### PHP Apps (10)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 41 | flarum/flarum | OK | 0 |
| 42 | MISP/MISP | OK | 2 |
| 43 | snipe/snipe-it | OK | 8 |
| 44 | crater-invoice/crater | OK | 7 |
| 45 | koel/koel | OK | 14 |
| 46 | thedevdojo/wave | OK | 9 |
| 47 | laravel/jetstream | OK | 0 |
| 48 | monicahq/chandler | OK | 10 |
| 49 | cecilapp/cecil | OK | 0 |
| 50 | octobercms/october | OK | 6 |

## Summary

| Metric | Value |
|--------|-------|
| Total repos tested | 50 |
| Repos scanned successfully | 48 |
| Clone failures | 2 (awx-project/awx, velero-io/velero) |
| Crashes | 0 |
| Repos with detections (>0) | 37 |
| Detection rate | **77%** |
| Average services per repo | 7.7 |
| Max services detected | 26 (hackclub/hcb) |
| Zero-detection repos | 11 |
| Total services detected | 368 |

## Top 10 by Services Detected

| Repo | Services | Category |
|------|----------|----------|
| hackclub/hcb | 26 | Ruby Rails |
| gitlabhq/gitlabhq | 23 | Ruby Rails |
| feedbin/feedbin | 20 | Ruby Rails |
| diaspora/diaspora | 19 | Ruby Rails |
| sentry-demos/empower | 18 | Python Django/Flask |
| rubygems/rubygems.org | 17 | Ruby Rails |
| codetriage/codetriage | 16 | Ruby Rails |
| rubyforgood/human-essentials | 15 | Ruby Rails |
| lobsters/lobsters | 14 | Ruby Rails |
| koel/koel | 14 | PHP Apps |

## Per-Category Breakdown

| Category | Scanned | Detected | Rate | Total Services | Avg/Repo | Top Repo |
|----------|---------|----------|------|----------------|----------|----------|
| Node.js SaaS | 10 | 3 | 30% | 30 | 3.0 | hoppscotch (12) |
| Python Django/Flask | 9 | 8 | 89% | 63 | 7.0 | sentry-demos/empower (18) |
| Ruby Rails | 10 | 10 | 100% | 165 | 16.5 | hackclub/hcb (26) |
| Go Apps | 9 | 9 | 100% | 54 | 6.0 | milvus-io/milvus (13) |
| PHP Apps | 10 | 7 | 70% | 56 | 5.6 | koel/koel (14) |

## Zero-Detection Repos (11)

| Repo | Category | Likely Reason |
|------|----------|---------------|
| documenso/documenso | Node.js SaaS | Monorepo/turborepo structure, deps in sub-packages |
| ever-co/ever-gauzy | Node.js SaaS | Large NestJS monorepo with Nx workspaces |
| logto-io/logto | Node.js SaaS | Monorepo with pnpm workspaces |
| toeverything/AFFiNE | Node.js SaaS | Monorepo with workspace packages |
| Infisical/infisical | Node.js SaaS | Multi-language monorepo (Go backend + TS frontend) |
| triggerdotdev/trigger.dev | Node.js SaaS | Monorepo with turbo workspaces |
| novuhq/novu | Node.js SaaS | Monorepo with pnpm workspaces |
| posthog/posthog | Python Django/Flask | Massive monorepo (560MB), Python + TS + Go |
| flarum/flarum | PHP Apps | Composer meta-package, actual code in extensions |
| laravel/jetstream | PHP Apps | Starter kit package, not a full application |
| cecilapp/cecil | PHP Apps | Static site generator, minimal external service deps |

## Key Observations

### Ruby Rails dominates detection (100% rate, 16.5 avg)
Ruby on Rails applications consistently produce the highest detection rates and service counts across all rounds. The Gemfile-based ecosystem, combined with Rails' convention of explicit service integrations, makes them ideal targets for codepliant's scanner. Every single Rails app in this round detected >0 services.

### Node.js SaaS monorepo gap is critical (30% rate)
7 of 10 Node.js SaaS apps returned 0 detections. All 7 are monorepos using turborepo, Nx, or pnpm workspaces. The scanner is only reading the root package.json and missing dependencies declared in `apps/*/package.json` and `packages/*/package.json`. This is the single biggest detection gap -- these are the exact target users for codepliant.

### Go apps improved significantly (100% rate, 6.0 avg)
Every Go app scanned successfully detected services. This is a major improvement from round 4 (60% rate, 2.17 avg), suggesting recent scanner improvements for Go module detection are working.

### PostHog (0 detections) is a notable gap
PostHog is a major analytics platform (560MB repo) with Django backend, React frontend, and extensive integrations (Stripe, AWS, ClickHouse, Redis, Kafka, Celery). Returning 0 suggests the scanner may struggle with very large repos or complex Python monorepos.

## Comparison with Previous Rounds

| Metric | Round 1 | Round 4 | Round 7 | Round 8 | Round 9 | Round 12 |
|--------|---------|---------|---------|---------|---------|----------|
| Detection rate | 54% | 60% | 81% | 67% | 74% | **77%** |
| Avg services/repo | 2.6 | 2.1 | 6.3 | 5.6 | 8.1 | **7.7** |
| Max detected | 23 | 16 | 35 | 35 | 35 | **26** |
| Focus | Frameworks | Multi-eco | Self-hosted | Domain | Deployed | **Eco-specific** |

## Priority Fix: Monorepo Scanning

The Node.js monorepo gap (7/10 returning 0) represents the single most impactful improvement opportunity. These repos use:
- `turbo.json` / `pnpm-workspace.yaml` / `lerna.json` to declare workspace packages
- Dependencies in `apps/web/package.json`, `apps/api/package.json`, `packages/*/package.json`
- The root `package.json` often contains only devDependencies for tooling

**Recommendation:** Detect workspace config files and recursively scan all `package.json` files in workspace directories. This would likely convert most of these 0s into 10+ detections each, significantly boosting the overall detection rate for the target user base.
