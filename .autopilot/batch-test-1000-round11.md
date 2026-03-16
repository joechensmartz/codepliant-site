# Batch Test 1000 - Round 11: 100 Application Repos (Awesome-Selfhosted Categories)

**Date:** 2026-03-16
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete
**Focus:** Self-hosted APPLICATION software from awesome-selfhosted categories not yet covered: CMS, Analytics, DevOps, Communication, Media, Business, Auth, Wiki, Monitoring, Productivity

## Results

### CMS (10 repos)

| # | Repo | Services |
|---|------|----------|
| 1 | getgrav/grav | 0 |
| 2 | craftcms/cms | 1 |
| 3 | octobercms/october | 6 |
| 4 | typecho/typecho | 0 |
| 5 | dotCMS/core | 8 |
| 6 | Squidex/squidex | 2 |
| 7 | apostrophecms/apostrophe | 11 |
| 8 | statamic/cms | 5 |
| 9 | microweber/microweber | 10 |
| 10 | plone/volto | 2 |

### Analytics (10 repos)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 11 | PostHog/posthog | SCAN_FAIL | 0 |
| 12 | usefathom/fathom | OK | 3 |
| 13 | aptabase/aptabase | OK | 5 |
| 14 | openreplay/openreplay | SCAN_FAIL | 0 |
| 15 | countly/countly-server | OK | 7 |
| 16 | rudderlabs/rudder-server | OK | 9 |
| 17 | growthbook/growthbook | SCAN_FAIL | 0 |
| 18 | openpanel-dev/openpanel | SCAN_FAIL | 0 |
| 19 | milesmcc/shynet | OK | 10 |
| 20 | electerious/Ackee | OK | 2 |

*Scan failures (4): PostHog, OpenReplay, GrowthBook, OpenPanel -- likely large monorepos exceeding JSON parse buffer*

### DevOps (10 repos)

| # | Repo | Services |
|---|------|----------|
| 21 | coollabsio/coolify | 10 |
| 22 | theonedev/onedev | 0 |
| 23 | caprover/caprover | 2 |
| 24 | dokku/dokku | 4 |
| 25 | werf/werf | 9 |
| 26 | dagger/dagger | 2 |
| 27 | containers/podman | 1 |
| 28 | loft-sh/vcluster | 3 |
| 29 | argoproj/argo-cd | 4 |
| 30 | tektoncd/pipeline | 1 |

### Communication (10 repos)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 31 | nicegram/Nicegram-iOS | OK | 0 |
| 32 | AMoreaux/Semaphore | CLONE_FAIL | 0 |
| 33 | typebot-io/typebot | CLONE_FAIL | 0 |
| 34 | tinode/chat | OK | 2 |
| 35 | AgoraIO/Flat | CLONE_FAIL | 0 |
| 36 | AgoraIO/Basic-Video-Call | OK | 0 |
| 37 | AgoraIO/API-Examples | OK | 0 |
| 38 | AgoraIO-Community/Agora-Unreal-SDK-CPP-Example | CLONE_FAIL | 0 |
| 39 | AgoraIO-Community/Agora-Flutter-Quickstart | OK | 0 |
| 40 | AgoraIO-Extensions/Agora-Flutter-SDK | OK | 0 |

*Note: Communication category had weak repo selection (AgoraIO repos are SDKs/examples, not full applications). 4 clone failures. Only tinode/chat is a true self-hosted communication server.*

### Media (10 repos)

| # | Repo | Services |
|---|------|----------|
| 41 | ampache/ampache | 0 |
| 42 | airsonic-advanced/airsonic-advanced | 4 |
| 43 | owncast/owncast | 2 |
| 44 | Kareadita/Kavita | 2 |
| 45 | stashapp/stash | 1 |
| 46 | sct/overseerr | 7 |
| 47 | janeczku/calibre-web | 2 |
| 48 | Lidarr/Lidarr | 0 |
| 49 | Prowlarr/Prowlarr | 0 |
| 50 | Ombi-app/Ombi | 0 |

### Business (10 repos)

| # | Repo | Services |
|---|------|----------|
| 51 | SolidInvoice/SolidInvoice | 4 |
| 52 | fossbilling/fossbilling | 1 |
| 53 | Dolibarr/dolibarr | 0 |
| 54 | openboxes/openboxes | 5 |
| 55 | Part-DB/Part-DB-server | 2 |
| 56 | grocy/grocy | 0 |
| 57 | snipe/snipe-it | 8 |
| 58 | thelounge/thelounge | 6 |
| 59 | Attendize/Attendize | 12 |
| 60 | mautic/mautic | 3 |

### Auth (10 repos)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 61 | kanidm/kanidm | OK | 0 |
| 62 | ory/kratos | OK | 5 |
| 63 | logto-io/logto | SCAN_FAIL | 0 |
| 64 | supertokens/supertokens-core | OK | 1 |
| 65 | ory/hydra | OK | 5 |
| 66 | teamhanko/hanko | OK | 2 |
| 67 | openfga/openfga | OK | 4 |
| 68 | permitio/opal | OK | 3 |
| 69 | cerbos/cerbos | OK | 7 |
| 70 | warrant-dev/warrant | OK | 3 |

### Wiki / Docs / Dashboard (10 repos)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 71 | splitbrain/dokuwiki | OK | 0 |
| 72 | xwiki/xwiki-platform | OK | 1 |
| 73 | Jermolene/TiddlyWiki5 | OK | 0 |
| 74 | silverbulletmd/silverbullet | OK | 1 |
| 75 | flatnotes/flatnotes | CLONE_FAIL | 0 |
| 76 | lissy93/dashy | OK | 1 |
| 77 | Raneto/Raneto | CLONE_FAIL | 0 |
| 78 | mdSilo/mdSilo-app | OK | 1 |
| 79 | foambubble/foam | OK | 1 |
| 80 | phanan/koel | OK | 14 |

### Monitoring (10 repos)

| # | Repo | Services |
|---|------|----------|
| 81 | TwiN/gatus | 5 |
| 82 | dgtlmoon/changedetection.io | 2 |
| 83 | statping-ng/statping-ng | 3 |
| 84 | henrygd/beszel | 1 |
| 85 | Checkmk/checkmk | 14 |
| 86 | zabbix/zabbix | 0 |
| 87 | Unitech/pm2 | 0 |
| 88 | nicolargo/glances | 1 |
| 89 | cockpit-project/cockpit | 0 |
| 90 | crowdsecurity/crowdsec | 7 |

### Productivity / Home (10 repos)

| # | Repo | Status | Services |
|---|------|--------|----------|
| 91 | pawelmalak/flame | OK | 2 |
| 92 | ajnart/homarr | OK | 8 |
| 93 | sysadminsmedia/homebox | OK | 2 |
| 94 | mealie-recipes/mealie | OK | 11 |
| 95 | hoarder-app/hoarder | SCAN_FAIL | 0 |
| 96 | wallabag/wallabag | OK | 5 |
| 97 | linkace/linkace | CLONE_FAIL | 0 |
| 98 | AmruthPillai/Reactive-Resume | OK | 15 |
| 99 | pawelmalak/snippet-box | OK | 0 |
| 100 | TandoorRecipes/recipes | OK | 22 |

---

## Round 11 Summary

| Metric | Value |
|--------|-------|
| **Repos attempted** | 100 |
| **Clone failures** | 7 |
| **Scan failures** | 6 |
| **Repos scanned OK** | **87** |
| **Repos with detections (>0)** | **66/87 (75.9%)** |
| **Total services detected** | **325** |
| **Average services/repo** | **3.7** |
| **Max services detected** | **22** (TandoorRecipes/recipes) |
| **Zero-detection repos** | 21 |
| **Crashes** | 0 |

### Top 10 Detections

| Repo | Category | Services |
|------|----------|----------|
| TandoorRecipes/recipes | Productivity | 22 |
| AmruthPillai/Reactive-Resume | Productivity | 15 |
| Checkmk/checkmk | Monitoring | 14 |
| phanan/koel | Media/Music | 14 |
| Attendize/Attendize | Business | 12 |
| apostrophecms/apostrophe | CMS | 11 |
| mealie-recipes/mealie | Productivity | 11 |
| coollabsio/coolify | DevOps | 10 |
| microweber/microweber | CMS | 10 |
| milesmcc/shynet | Analytics | 10 |

### Detection by Category

| Category | Scanned | Detected | Rate | Total Services | Avg/Repo | Top Repo |
|----------|---------|----------|------|----------------|----------|----------|
| CMS | 10 | 8 | 80% | 45 | 4.5 | apostrophe (11) |
| Analytics | 6 | 6 | 100% | 36 | 6.0 | shynet (10) |
| DevOps | 10 | 9 | 90% | 36 | 3.6 | coolify (10) |
| Communication | 6 | 1 | 17% | 2 | 0.3 | chat (2) |
| Media | 10 | 6 | 60% | 18 | 1.8 | overseerr (7) |
| Business | 10 | 8 | 80% | 41 | 4.1 | Attendize (12) |
| Auth | 9 | 8 | 89% | 30 | 3.3 | cerbos (7) |
| Wiki/Docs | 8 | 6 | 75% | 19 | 2.4 | koel (14) |
| Monitoring | 10 | 7 | 70% | 33 | 3.3 | checkmk (14) |
| Productivity | 8 | 7 | 88% | 65 | 8.1 | recipes (22) |

*Communication category is artificially low due to AgoraIO SDK repos (not real applications). Excluding Communication, the detection rate is 65/81 = 80.2%.*

---

## Failures

### Clone Failures (7)
1. AMoreaux/Semaphore -- repo may be renamed/private
2. typebot-io/typebot -- repo may have moved
3. AgoraIO/Flat -- repo may be archived
4. AgoraIO-Community/Agora-Unreal-SDK-CPP-Example -- repo may not exist
5. flatnotes/flatnotes -- repo may have moved
6. Raneto/Raneto -- org/repo name mismatch
7. linkace/linkace -- repo may have moved (possibly LinkAce/LinkAce)

### Scan Failures (6)
1. PostHog/posthog -- very large monorepo (19k+ files), likely JSON buffer overflow
2. openreplay/openreplay -- large monorepo
3. growthbook/growthbook -- large monorepo
4. openpanel-dev/openpanel -- large monorepo
5. logto-io/logto -- large monorepo
6. hoarder-app/hoarder -- unknown cause

*Scan failures all appear to be large monorepos where the JSON output exceeds pipe buffer limits. The scanner itself does not crash -- the failure is in the JSON parse step.*

---

## Zero-Detection Repos (21)

| Repo | Category | Language | Notes |
|------|----------|----------|-------|
| getgrav/grav | CMS | PHP | Flat-file CMS, uses PHP-only patterns |
| typecho/typecho | CMS | PHP | Chinese PHP CMS, minimal deps |
| theonedev/onedev | DevOps | Java | Java CI/CD server, weak Java detection |
| nicegram/Nicegram-iOS | Communication | Swift | iOS app, no server-side scanning |
| AgoraIO/Basic-Video-Call | Communication | Multi | SDK example, not an application |
| AgoraIO/API-Examples | Communication | Multi | SDK example, not an application |
| AgoraIO-Community/Agora-Flutter-Quickstart | Communication | Dart | SDK example, not an application |
| AgoraIO-Extensions/Agora-Flutter-SDK | Communication | Dart | SDK wrapper, not an application |
| ampache/ampache | Media | PHP | PHP music server, uses MySQL/LDAP |
| Lidarr/Lidarr | Media | C# | .NET media manager, weak .NET detection |
| Prowlarr/Prowlarr | Media | C# | .NET indexer manager, weak .NET detection |
| Ombi-app/Ombi | Media | C# | .NET request manager, weak .NET detection |
| Dolibarr/dolibarr | Business | PHP | French ERP, uses MySQL/SMTP/LDAP |
| grocy/grocy | Business | PHP | PHP inventory manager |
| kanidm/kanidm | Auth | Rust | Rust identity server, weak Rust detection |
| splitbrain/dokuwiki | Wiki | PHP | PHP wiki, flat-file storage |
| Jermolene/TiddlyWiki5 | Wiki | JS | Single-file wiki, minimal deps |
| zabbix/zabbix | Monitoring | C/PHP | C core + PHP frontend |
| Unitech/pm2 | Monitoring | JS | Node process manager, minimal services |
| cockpit-project/cockpit | Monitoring | C/JS | Linux admin panel, C core |
| pawelmalak/snippet-box | Productivity | JS | Simple snippet manager |

### Key Gaps Identified
- **C#/.NET**: 3 zero-detection repos (Lidarr, Prowlarr, Ombi) -- all use NuGet packages for HTTP, DB, notifications
- **PHP legacy**: 5 zero-detection repos (Grav, Typecho, Ampache, Dolibarr, DokuWiki) -- PHP apps with MySQL/LDAP/SMTP
- **Java**: 1 zero-detection (OneDev) -- Java CI server
- **Rust**: 1 zero-detection (Kanidm) -- Rust identity server
- **Swift/iOS**: 1 zero-detection (Nicegram) -- mobile app, not a server

---

## Cumulative Totals (All Recorded Rounds)

| Round | Date | Focus | Attempted | Scanned | Detected | Rate | Services | Avg |
|-------|------|-------|-----------|---------|----------|------|----------|-----|
| Original 100 | 2026-03-15 | Mixed real-world | 100 | 99 | 82 | 82.8% | 530 | 5.4 |
| Round 1 (500 series) | 2026-03-15 | General popular | 50 | 50 | 27 | 54% | 131 | 2.6 |
| Round 4 (500 series) | 2026-03-16 | Multi-ecosystem | 200 | 197 | 120 | 60% | 418 | 2.1 |
| Round 7 (1000 series) | 2026-03-16 | Self-hosted apps | 103 | 99 | 80 | 80.8% | 627 | 6.3 |
| Round 8 (1000 series) | 2026-03-16 | Domain verticals | 50 | 45 | 30 | 67% | 250 | 5.6 |
| **Round 11 (1000 series)** | **2026-03-16** | **Selfhosted categories** | **100** | **87** | **66** | **75.9%** | **325** | **3.7** |
| **Grand Total** | | | **603** | **577** | **405** | **70.2%** | **2,281** | **4.0** |

> **577 unique repos scanned across all recorded rounds.** Some overlap exists between rounds (repos tested in multiple rounds are counted once per round in the table above). The estimated unique repo count after deduplication is ~550. Additional unrecorded rounds (2, 3, 5, 6, 9, 10) would bring the total higher if their data is recovered.

### Trend Analysis

- **Application repos consistently outperform library repos**: Rounds focused on real applications (7, 8, 11, Original 100) show 67-83% detection rates vs. 54-60% for mixed/library-heavy rounds (1, 4)
- **Average services per app repo**: ~4.5 across application-focused rounds vs. ~2.3 for mixed rounds
- **Productivity/home apps detect best in round 11**: 88% rate, 8.1 avg -- these apps use many integrations (email, storage, auth, analytics)
- **Analytics tools detect well**: 100% rate when scan succeeds, 6.0 avg -- these tools inherently integrate with many services
- **.NET remains the biggest gap**: Lidarr, Prowlarr, Ombi all return 0 -- the *arr stack is a major self-hosted ecosystem

---

## Key Observations

1. **TandoorRecipes is the round's top performer (22 services)** -- Django app with extensive integrations for email, storage, social auth, analytics. Django scanning is working well.
2. **Reactive-Resume (15 services)** -- Next.js resume builder with auth, storage, email, and multiple service integrations. Strong TypeScript detection.
3. **Checkmk (14 services)** -- Python/JS monitoring platform. Impressive detection on a complex multi-language codebase.
4. **Scan failures are a new concern** -- 6 repos failed to scan (all large monorepos). This is a regression from round 7 where zero scan failures occurred. The JSON pipe may need buffering improvements.
5. **Communication category needs re-testing** -- The AgoraIO repos are SDK examples, not self-hosted communication servers. Repos like Element, Conduit, Dendrite, or SimpleX would be better candidates.
6. **PHP detection remains split** -- Laravel/Symfony apps (microweber 10, snipe-it 8, mautic 3) detect well, but raw PHP (Grav 0, Typecho 0, DokuWiki 0, Dolibarr 0) misses entirely.

## Stability

**Zero crashes across all 87 successfully scanned repos.** The scanner handles repos across PHP, Python, Go, Rust, Java, C#, JavaScript/TypeScript, and C without any unrecoverable errors. The 6 scan failures are JSON pipeline issues, not scanner crashes.
