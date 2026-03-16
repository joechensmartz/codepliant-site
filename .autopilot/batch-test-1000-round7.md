# Batch Test 1000 - Round 7 (100 Application Repos)

**Date:** 2026-03-16
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete
**Focus:** Real self-hosted APPLICATION software from awesome-selfhosted (CRM, ERP, helpdesk, wiki, CMS, LMS, accounting, ecommerce, etc.)

## Results

| # | Repo | Category | Status | Services |
|---|------|----------|--------|----------|
| 1 | monicahq/monica | CRM | OK | 11 |
| 2 | SuiteCRM/SuiteCRM | CRM | OK | 1 |
| 3 | espocrm/espocrm | CRM | OK | 1 |
| 4 | twentyhq/twenty | CRM | OK | 0 |
| 5 | erxes/erxes | CRM | OK | 0 |
| 6 | odoo/odoo | ERP | OK | 4 |
| 7 | frappe/erpnext | ERP | OK | 4 |
| 8 | cortezaproject/corteza | ERP | OK | 2 |
| 9 | idurar/idurar-erp-crm | ERP | OK | 1 |
| 10 | fossology/fossology | ERP | OK | 5 |
| 11 | opf/openproject | Project Mgmt | OK | 17 |
| 12 | makeplane/plane | Project Mgmt | OK | 16 |
| 13 | wekan/wekan | Project Mgmt | OK | 4 |
| 14 | kanboard/kanboard | Project Mgmt | OK | 2 |
| 15 | leantime/leantime | Project Mgmt | OK | 9 |
| 16 | zammad/zammad | Helpdesk | OK | 13 |
| 17 | freescout-helpdesk/freescout | Helpdesk | OK | 4 |
| 18 | uvdesk/community-skeleton | Helpdesk | OK | 0 |
| 19 | osTicket/osTicket | Helpdesk | OK | 0 |
| 20 | trudesk/trudesk | Helpdesk | CLONE_FAIL | 0 |
| 21 | BookStackApp/BookStack | Wiki | OK | 7 |
| 22 | outline/outline | Wiki | OK | 0 |
| 23 | requarks/wiki | Wiki | OK | 11 |
| 24 | wikimedia/mediawiki | Wiki | OK | 0 |
| 25 | gollum/gollum | Wiki | OK | 1 |
| 26 | WordPress/WordPress | CMS | OK | 0 |
| 27 | joomla/joomla-cms | CMS | OK | 1 |
| 28 | wagtail/wagtail | CMS | OK | 5 |
| 29 | strapi/strapi | CMS | OK | 8 |
| 30 | directus/directus | CMS | OK | 16 |
| 31 | ghost/Ghost | CMS | CLONE_FAIL | 0 |
| 32 | keystonejs/keystone | CMS | OK | 6 |
| 33 | payloadcms/payload | CMS | OK | 0 |
| 34 | moodle/moodle | LMS | OK | 3 |
| 35 | ilios/ilios | LMS | OK | 5 |
| 36 | chamilo/chamilo-lms | LMS | OK | 2 |
| 37 | ILIAS-eLearning/ILIAS | LMS | OK | 2 |
| 38 | overleaf/overleaf | LMS | OK | 0 |
| 39 | invoiceninja/invoiceninja | Accounting | OK | 12 |
| 40 | akaunting/akaunting | Accounting | OK | 6 |
| 41 | crater-invoice/crater | Accounting | OK | 10 |
| 42 | killbill/killbill | Accounting | OK | 3 |
| 43 | maybe-finance/maybe | Accounting | OK | 18 |
| 44 | PrestaShop/PrestaShop | Ecommerce | OK | 3 |
| 45 | bagisto/bagisto | Ecommerce | OK | 8 |
| 46 | medusajs/medusa | Ecommerce | OK | 0 |
| 47 | spree/spree | Ecommerce | OK | 10 |
| 48 | solidusio/solidus | Ecommerce | OK | 12 |
| 49 | saleor/saleor | Ecommerce | OK | 8 |
| 50 | RocketChat/Rocket.Chat | Communication | OK | 0 |
| 51 | mattermost/mattermost | Communication | OK | 6 |
| 52 | zulip/zulip | Communication | OK | 8 |
| 53 | chatwoot/chatwoot | Communication | OK | 35 |
| 54 | papercups-io/papercups | Communication | OK | 12 |
| 55 | dani-garcia/vaultwarden | Auth/Password | OK | 4 |
| 56 | keycloak/keycloak | Auth/Password | OK | 0 |
| 57 | casdoor/casdoor | Auth/Password | OK | 10 |
| 58 | zitadel/zitadel | Auth/Password | OK | 10 |
| 59 | goauthentik/authentik | Auth/Password | OK | 8 |
| 60 | sissbruecker/linkding | Bookmarking | OK | 6 |
| 61 | linkwarden/linkwarden | Bookmarking | OK | 15 |
| 62 | go-shiori/shiori | Bookmarking | OK | 5 |
| 63 | miniflux/v2 | Feed Reader | OK | 3 |
| 64 | FreshRSS/FreshRSS | Feed Reader | OK | 1 |
| 65 | zadam/trilium | Note-taking | OK | 7 |
| 66 | logseq/logseq | Note-taking | OK | 4 |
| 67 | AppFlowy-IO/AppFlowy | Note-taking | OK | 2 |
| 68 | standardnotes/app | Note-taking | OK | 6 |
| 69 | hedgedoc/hedgedoc | Note-taking | OK | 6 |
| 70 | kimai/kimai | Time Tracking | OK | 1 |
| 71 | focalboard/focalboard | Task Mgmt | OK | 0 |
| 72 | nocodb/nocodb | Low-code DB | OK | 26 |
| 73 | baserow/baserow | Low-code DB | OK | 8 |
| 74 | apitable/apitable | Low-code DB | OK | 17 |
| 75 | nextcloud/server | File Storage | OK | 2 |
| 76 | owncloud/core | File Storage | OK | 1 |
| 77 | photoprism/photoprism | Photo Mgmt | OK | 10 |
| 78 | immich-app/immich | Photo Mgmt | OK | 8 |
| 79 | jellyfin/jellyfin | Media | OK | 0 |
| 80 | Chocobozzz/PeerTube | Media | OK | 15 |
| 81 | navidrome/navidrome | Media | OK | 3 |
| 82 | matomo-org/matomo | Analytics | OK | 2 |
| 83 | plausible/analytics | Analytics | OK | 14 |
| 84 | umami-software/umami | Analytics | OK | 8 |
| 85 | louislam/uptime-kuma | Monitoring | OK | 7 |
| 86 | netdata/netdata | Monitoring | OK | 4 |
| 87 | grafana/grafana | Monitoring | OK | 0 |
| 88 | n8n-io/n8n | Automation | OK | 0 |
| 89 | huginn/huginn | Automation | OK | 16 |
| 90 | activepieces/activepieces | Automation | OK | 0 |
| 91 | ToolJet/ToolJet | Low-code | CLONE_FAIL | 0 |
| 92 | budibase/budibase | Low-code | OK | 21 |
| 93 | appsmithorg/appsmith | Low-code | OK | 9 |
| 94 | sabre-io/Baikal | Groupware | OK | 0 |
| 95 | Kozea/Radicale | Groupware | OK | 1 |
| 96 | alextselegidis/easyappointments | Scheduling | OK | 1 |
| 97 | calendso/cal.com | Scheduling | CLONE_FAIL | 0 |
| 98 | LimeSurvey/LimeSurvey | Forms/Surveys | OK | 3 |
| 99 | formbricks/formbricks | Forms/Surveys | OK | 0 |
| 100 | writefreely/writefreely | Blogging | OK | 4 |
| 101 | mastodon/mastodon | Social | OK | 23 |
| 102 | pixelfed/pixelfed | Social | OK | 8 |
| 103 | discourse/discourse | Social | OK | 16 |

## Round 7 Summary

| Metric | Value |
|--------|-------|
| **Total repos attempted** | 103 |
| **Scanned successfully** | 99 |
| **Clone failures** | 4 (trudesk, Ghost, ToolJet, cal.com) |
| **Scan failures / Crashes** | 0 |
| **Total services detected** | 627 |
| **Average services per repo (scanned)** | 6.3 |
| **Repos with >0 services** | 80/99 (80.8%) |
| **Repos with 0 services** | 19/99 (19.2%) |
| **Max services detected** | 35 (chatwoot/chatwoot) |

### Top 10 Detections

| Repo | Category | Services |
|------|----------|----------|
| chatwoot/chatwoot | Communication | 35 |
| nocodb/nocodb | Low-code DB | 26 |
| mastodon/mastodon | Social | 23 |
| budibase/budibase | Low-code | 21 |
| maybe-finance/maybe | Accounting | 18 |
| opf/openproject | Project Mgmt | 17 |
| apitable/apitable | Low-code DB | 17 |
| makeplane/plane | Project Mgmt | 16 |
| huginn/huginn | Automation | 16 |
| discourse/discourse | Social | 16 |

### Detection by Application Category

| Category | Repos | Detected | Detection Rate | Total Services | Avg/Repo |
|----------|-------|----------|----------------|----------------|----------|
| CRM | 5 | 3 | 60% | 13 | 2.6 |
| ERP/Business | 5 | 5 | 100% | 16 | 3.2 |
| Project Management | 5 | 5 | 100% | 48 | 9.6 |
| Helpdesk/Ticketing | 4 | 2 | 50% | 17 | 4.3 |
| Wiki/Knowledge Base | 5 | 3 | 60% | 19 | 3.8 |
| CMS | 7 | 5 | 71% | 36 | 5.1 |
| LMS/Education | 5 | 4 | 80% | 12 | 2.4 |
| Accounting/Finance | 5 | 5 | 100% | 49 | 9.8 |
| Ecommerce | 6 | 5 | 83% | 41 | 6.8 |
| Communication/Chat | 5 | 4 | 80% | 61 | 12.2 |
| Auth/Password | 5 | 4 | 80% | 32 | 6.4 |
| Bookmarking | 3 | 3 | 100% | 26 | 8.7 |
| Feed Readers | 2 | 2 | 100% | 4 | 2.0 |
| Note-taking/Docs | 5 | 5 | 100% | 25 | 5.0 |
| Time/Task Tracking | 2 | 1 | 50% | 1 | 0.5 |
| Low-code/DB | 6 | 5 | 83% | 81 | 13.5 |
| File/Photo/Media | 7 | 6 | 86% | 39 | 5.6 |
| Analytics | 3 | 3 | 100% | 24 | 8.0 |
| Monitoring | 3 | 2 | 67% | 11 | 3.7 |
| Automation | 3 | 1 | 33% | 16 | 5.3 |
| Groupware/Scheduling | 3 | 2 | 67% | 2 | 0.7 |
| Forms/Surveys | 2 | 1 | 50% | 3 | 1.5 |
| Blogging/Social | 3 | 3 | 100% | 47 | 15.7 |

### Zero-Detection Repos (19 repos)

These are real applications that almost certainly use third-party services:

1. **twentyhq/twenty** -- TypeScript CRM; likely uses services via env vars/patterns not in signatures
2. **erxes/erxes** -- TypeScript; large monorepo, may use unconventional patterns
3. **uvdesk/community-skeleton** -- PHP; minimal skeleton, services likely in dependencies
4. **osTicket/osTicket** -- PHP; classic PHP app, may need deeper PHP scanning
5. **outline/outline** -- TypeScript wiki; surprising miss, uses S3, Slack, SMTP
6. **wikimedia/mediawiki** -- PHP; massive codebase, uses many services internally
7. **WordPress/WordPress** -- PHP; uses MySQL, SMTP, HTTP APIs; persistent gap
8. **payloadcms/payload** -- TypeScript; headless CMS, likely uses DB/cloud services
9. **overleaf/overleaf** -- TypeScript/JS; uses MongoDB, Redis, S3
10. **medusajs/medusa** -- TypeScript; ecommerce platform with payment/storage integrations
11. **RocketChat/Rocket.Chat** -- TypeScript/JS; uses MongoDB, push, OAuth; persistent gap
12. **keycloak/keycloak** -- Java; auth server, uses LDAP, SMTP, DB; Java gap
13. **focalboard/focalboard** -- Go; uses PostgreSQL, possibly S3
14. **jellyfin/jellyfin** -- C#; media server, uses TMDB, SMTP; .NET gap
15. **grafana/grafana** -- Go/TypeScript; uses many data sources; surprising 0 (was 9 in round 4)
16. **n8n-io/n8n** -- TypeScript; automation tool with 400+ integrations; surprising gap
17. **activepieces/activepieces** -- TypeScript; automation with many connectors
18. **sabre-io/Baikal** -- PHP; CalDAV/CardDAV server
19. **formbricks/formbricks** -- TypeScript; survey tool

---

## Cumulative Totals (All Rounds)

| Metric | Round 1 | Round 4 | Round 7 | **Grand Total** |
|--------|---------|---------|---------|-----------------|
| **Repos tested** | 50 | 200 | 103 | **353** |
| **Repos scanned OK** | 50 | 197 | 99 | **346** |
| **Clone failures** | 0 | 3 | 4 | **7** |
| **Scan failures / Crashes** | 0 | 0 | 0 | **0** |
| **Total services detected** | 131 | 418 | 627 | **1,176** |
| **Avg services/repo** | 2.62 | 2.12 | 6.33 | **3.40** |
| **Detection rate (>0)** | 27/50 (54%) | 120/200 (60%) | 80/99 (80.8%) | **227/346 (65.6%)** |

### Trend Analysis

- **Round 1** (general popular repos, many frameworks/libs): 54% detection, 2.62 avg
- **Round 4** (multi-ecosystem, mixed libs + apps): 60% detection, 2.12 avg
- **Round 7** (pure application repos, no libraries): **80.8% detection, 6.33 avg**

The dramatic improvement in Round 7 confirms that **codepliant performs significantly better on real application repos vs. libraries/frameworks**, which is exactly the target use case. When scanning actual deployable applications:

- Detection rate jumps from ~57% to **81%**
- Average services per repo triples from ~2.4 to **6.3**
- Categories like accounting (9.8 avg), low-code (13.5 avg), and communication (12.2 avg) show strong scanner coverage

### Key Gaps to Address

1. **WordPress/MediaWiki/PHP legacy apps** -- Consistently returning 0 across multiple rounds
2. **Rocket.Chat** -- Large Node.js app, 0 across all rounds, needs investigation
3. **n8n / activepieces** -- Automation tools with hundreds of integrations returning 0
4. **Java apps (Keycloak, killbill)** -- Weak Java/Maven detection
5. **C#/.NET apps (Jellyfin)** -- Weak .NET/NuGet detection
6. **Grafana regression** -- Was 9 in round 4, now 0 in round 7 (possible repo structure change)

### Stability

**Zero crashes or scan failures across all 346 successfully cloned repos.** The scanner handles repos of all sizes and languages without any errors.
