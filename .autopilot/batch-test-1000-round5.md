# Batch Test 1000 - Round 5 (200 Real Application Repos)

**Date:** 2026-03-15
**Tool:** codepliant v50.0.0 (`codepliant scan --json`)
**Method:** `git clone --depth 1`, scan, record service count, delete
**Focus:** Real applications only (NOT libraries/frameworks)

## Sources

| Source | Target | Cloned | Scanned OK |
|--------|--------|--------|------------|
| awesome-selfhosted (top 100 apps) | 100 | 93 | 92 |
| awesome-oss-alternatives (top 50 SaaS) | 50 | 44 | 44 |
| awesome-sysadmin + real apps (top 50) | 50 | 42 | 43 |
| **Total** | **200** | **179** | **179** |

## Summary

| Metric | Value |
|--------|-------|
| **Total repos targeted** | 200 |
| **Clone failures** | 21 (10.5%) |
| **Scan failures** | 0 (0%) |
| **Successfully scanned** | 179 |
| **Repos with >0 services (detection rate)** | 137/179 (76.5%) |
| **Repos with 0 services** | 42/179 (23.5%) |
| **Total services detected** | 1,019 |
| **Avg services per repo (all OK)** | 5.69 |
| **Avg services per repo (detected only)** | 7.44 |
| **Max services detected** | 35 (chatwoot/chatwoot) |
| **Crashes** | 0 |

## Detection Rate by Source

| Source | Scanned | Detected >0 | Rate | Avg Services |
|--------|---------|-------------|------|-------------|
| awesome-selfhosted | 92 | 70 | 76.1% | 5.78 |
| awesome-oss-alternatives | 44 | 31 | 70.5% | 7.02 |
| awesome-sysadmin | 43 | 36 | 83.7% | 4.14 |

## Service Count Distribution

| Services | Count | % |
|----------|-------|---|
| 0 | 42 | 23.5% |
| 1-3 | 36 | 20.1% |
| 4-7 | 48 | 26.8% |
| 8-15 | 39 | 21.8% |
| 16+ | 14 | 7.8% |

## Top 20 Repos by Service Count

| # | Repo | Services | Source |
|---|------|----------|--------|
| 1 | chatwoot/chatwoot | 35 | selfhosted |
| 2 | ToolJet/ToolJet | 27 | selfhosted |
| 3 | chaskiq/chaskiq | 27 | oss-alt |
| 4 | nocodb/nocodb | 26 | selfhosted |
| 5 | laudspeaker/laudspeaker | 26 | oss-alt |
| 6 | maybe-finance/maybe | 24 | oss-alt |
| 7 | gitroomhq/postiz-app | 23 | oss-alt |
| 8 | tandoorrecipes/recipes | 22 | selfhosted |
| 9 | Budibase/budibase | 21 | selfhosted |
| 10 | directus/directus | 20 | oss-alt |
| 11 | makeplane/plane | 19 | selfhosted |
| 12 | opf/openproject | 17 | selfhosted |
| 13 | apitable/apitable | 17 | selfhosted |
| 14 | dittofeed/dittofeed | 17 | oss-alt |
| 15 | getredash/redash | 15 | selfhosted |
| 16 | mastodon/mastodon | 14 | selfhosted |
| 17 | plausible/analytics | 14 | selfhosted |
| 18 | postalserver/postal | 14 | sysadmin |
| 19 | netbox-community/netbox | 13 | selfhosted |
| 20 | apache/superset | 13 | oss-alt |

## Full Results

| # | Repo | Status | Services | Source |
|---|------|--------|----------|--------|
| 1 | mastodon/mastodon | OK | 14 | selfhosted |
| 2 | discourse/discourse | OK | 9 | selfhosted |
| 3 | nextcloud/server | OK | 1 | selfhosted |
| 4 | element-hq/synapse | OK | 0 | selfhosted |
| 5 | RocketChat/Rocket.Chat | OK | 0 | selfhosted |
| 6 | jitsi/jitsi-meet | OK | 0 | selfhosted |
| 7 | TryGhost/Ghost | OK | 8 | selfhosted |
| 8 | WordPress/wordpress-develop | OK | 0 | selfhosted |
| 9 | go-gitea/gitea | OK | 5 | selfhosted |
| 10 | grafana/grafana | OK | 9 | selfhosted |
| 11 | home-assistant/core | OK | 4 | selfhosted |
| 12 | paperless-ngx/paperless-ngx | OK | 3 | selfhosted |
| 13 | wallabag/wallabag | OK | 1 | selfhosted |
| 14 | ArchiveBox/ArchiveBox | OK | 4 | selfhosted |
| 15 | matomo-org/matomo | OK | 2 | selfhosted |
| 16 | PostHog/posthog | OK | 0 | selfhosted |
| 17 | metabase/metabase | OK | 4 | selfhosted |
| 18 | mattermost/mattermost | OK | 4 | selfhosted |
| 19 | zulip/zulip | OK | 6 | selfhosted |
| 20 | roundcube/roundcubemail | OK | 0 | selfhosted |
| 21 | wekan/wekan | OK | 4 | selfhosted |
| 22 | plane-so/plane | CLONE_FAIL | 0 | selfhosted |
| 23 | activepieces/activepieces | OK | 0 | selfhosted |
| 24 | huginn/huginn | OK | 11 | selfhosted |
| 25 | element-hq/element-web | OK | 1 | selfhosted |
| 26 | opf/openproject | OK | 17 | selfhosted |
| 27 | invoiceninja/invoiceninja | OK | 12 | selfhosted |
| 28 | snipe/snipe-it | OK | 10 | selfhosted |
| 29 | PrestaShop/PrestaShop | OK | 3 | selfhosted |
| 30 | odoo/odoo | OK | 4 | selfhosted |
| 31 | erxes/erxes | OK | 0 | selfhosted |
| 32 | saleor/saleor | OK | 7 | selfhosted |
| 33 | medusajs/medusa | OK | 0 | selfhosted |
| 34 | grocy/grocy | OK | 0 | selfhosted |
| 35 | sissbruecker/linkding | OK | 6 | selfhosted |
| 36 | FreshRSS/FreshRSS | OK | 1 | selfhosted |
| 37 | immich-app/immich | OK | 8 | selfhosted |
| 38 | photoprism/photoprism | OK | 10 | selfhosted |
| 39 | syncthing/syncthing | OK | 2 | selfhosted |
| 40 | BookStackApp/BookStack | OK | 7 | selfhosted |
| 41 | getoutline/outline | CLONE_FAIL | 0 | selfhosted |
| 42 | hedgedoc/hedgedoc | OK | 6 | selfhosted |
| 43 | laurent22/joplin | OK | 6 | selfhosted |
| 44 | standardnotes/app | OK | 6 | selfhosted |
| 45 | bitwarden/server | OK | 1 | selfhosted |
| 46 | vaultwarden/vaultwarden | CLONE_FAIL | 0 | selfhosted |
| 47 | netbox-community/netbox | OK | 13 | selfhosted |
| 48 | mailcow/mailcow-dockerized | OK | 3 | selfhosted |
| 49 | Mailu/Mailu | OK | 5 | selfhosted |
| 50 | netdata/netdata | OK | 4 | selfhosted |
| 51 | gogs/gogs | OK | 4 | selfhosted |
| 52 | forgejo/forgejo | CLONE_FAIL | 0 | selfhosted |
| 53 | calcom/cal.com | OK | 0 | selfhosted |
| 54 | plausible/analytics | OK | 14 | selfhosted |
| 55 | getredash/redash | OK | 15 | selfhosted |
| 56 | umami-software/umami | OK | 8 | selfhosted |
| 57 | goatcounter/goatcounter | CLONE_FAIL | 0 | selfhosted |
| 58 | writefreely/writefreely | OK | 4 | selfhosted |
| 59 | etherpad/etherpad-lite | CLONE_FAIL | 0 | selfhosted |
| 60 | baserow/baserow | OK | 8 | selfhosted |
| 61 | nocodb/nocodb | OK | 26 | selfhosted |
| 62 | apitable/apitable | OK | 17 | selfhosted |
| 63 | n8n-io/n8n | OK | 0 | selfhosted |
| 64 | mautic/mautic | OK | 4 | selfhosted |
| 65 | pimcore/pimcore | OK | 1 | selfhosted |
| 66 | dgtlmoon/changedetection.io | OK | 3 | selfhosted |
| 67 | alf-io/alf.io | CLONE_FAIL | 0 | selfhosted |
| 68 | alextselegidis/easyappointments | OK | 1 | selfhosted |
| 69 | lukevella/rallly | OK | 0 | selfhosted |
| 70 | go-shiori/shiori | OK | 5 | selfhosted |
| 71 | Shaarli/Shaarli | OK | 1 | selfhosted |
| 72 | onlyoffice/DocumentServer | OK | 0 | selfhosted |
| 73 | LibreOffice/online | OK | 0 | selfhosted |
| 74 | ckan/ckan | OK | 9 | selfhosted |
| 75 | modoboa/modoboa | OK | 8 | selfhosted |
| 76 | mail-in-a-box/mailinabox | OK | 0 | selfhosted |
| 77 | Prowlarr/Prowlarr | OK | 0 | selfhosted |
| 78 | Sonarr/Sonarr | OK | 2 | selfhosted |
| 79 | Radarr/Radarr | OK | 1 | selfhosted |
| 80 | Lidarr/Lidarr | OK | 0 | selfhosted |
| 81 | jellyfin/jellyfin | OK | 0 | selfhosted |
| 82 | navidrome/navidrome | OK | 3 | selfhosted |
| 83 | Kareadita/Kavita | OK | 3 | selfhosted |
| 84 | koillabs/Koillection | CLONE_FAIL | 0 | selfhosted |
| 85 | mealie-recipes/mealie | OK | 12 | selfhosted |
| 86 | tandoorrecipes/recipes | OK | 22 | selfhosted |
| 87 | hay-kot/homebox | OK | 0 | selfhosted |
| 88 | siyuan-note/siyuan | OK | 1 | selfhosted |
| 89 | logseq/logseq | OK | 4 | selfhosted |
| 90 | AppFlowy-IO/AppFlowy | OK | 2 | selfhosted |
| 91 | makeplane/plane | OK | 19 | selfhosted |
| 92 | Budibase/budibase | OK | 21 | selfhosted |
| 93 | ToolJet/ToolJet | OK | 27 | selfhosted |
| 94 | appsmithorg/appsmith | OK | 9 | selfhosted |
| 95 | twentyhq/twenty | OK | 0 | selfhosted |
| 96 | chatwoot/chatwoot | OK | 35 | selfhosted |
| 97 | fonoster/fonoster | OK | 11 | selfhosted |
| 98 | dani-garcia/vaultwarden | OK | 4 | selfhosted |
| 99 | portainer/portainer | OK | 0 | selfhosted |
| 100 | louislam/uptime-kuma | OK | 7 | selfhosted |
| 101 | hoppscotch/hoppscotch | OK | 12 | oss-alt |
| 102 | teamhanko/hanko | OK | 2 | oss-alt |
| 103 | keycloak/keycloak | OK | 0 | oss-alt |
| 104 | ory/kratos | OK | 6 | oss-alt |
| 105 | supertokens/supertokens-core | OK | 2 | oss-alt |
| 106 | zitadel/zitadel | OK | 10 | oss-alt |
| 107 | amplication/amplication | OK | 10 | oss-alt |
| 108 | appwrite/appwrite | OK | 7 | oss-alt |
| 109 | pocketbase/pocketbase | OK | 0 | oss-alt |
| 110 | supabase/supabase | OK | 0 | oss-alt |
| 111 | apache/superset | OK | 13 | oss-alt |
| 112 | directus/directus | OK | 20 | oss-alt |
| 113 | tinacms/tinacms | OK | 8 | oss-alt |
| 114 | webiny/webiny-js | OK | 0 | oss-alt |
| 115 | novuhq/novu | OK | 0 | oss-alt |
| 116 | jitsucom/jitsu | OK | 0 | oss-alt |
| 117 | rudderlabs/rudder-server | OK | 9 | oss-alt |
| 118 | chaskiq/chaskiq | OK | 27 | oss-alt |
| 119 | deepfence/ThreatMapper | OK | 1 | oss-alt |
| 120 | CrowdDotDev/crowd.dev | OK | 13 | oss-alt |
| 121 | tracardi/tracardi | OK | 4 | oss-alt |
| 122 | formbricks/formbricks | OK | 0 | oss-alt |
| 123 | typebot-io/typebot | CLONE_FAIL | 0 | oss-alt |
| 124 | openreplay/openreplay | OK | 0 | oss-alt |
| 125 | lightdash/lightdash | OK | 0 | oss-alt |
| 126 | getlago/lago | OK | 4 | oss-alt |
| 127 | killbill/killbill | OK | 3 | oss-alt |
| 128 | frappe/erpnext | OK | 4 | oss-alt |
| 129 | maybe-finance/maybe | OK | 24 | oss-alt |
| 130 | actualbudget/actual | OK | 0 | oss-alt |
| 131 | firefly-iii/firefly-iii | OK | 8 | oss-alt |
| 132 | ghostfolio/ghostfolio | OK | 8 | oss-alt |
| 133 | calendso/cal.com | CLONE_FAIL | 0 | oss-alt |
| 134 | documenso/documenso | OK | 0 | oss-alt |
| 135 | docuseal/docuseal | CLONE_FAIL | 0 | oss-alt |
| 136 | requarks/wiki | OK | 13 | oss-alt |
| 137 | Grapedrop/grapesjs | CLONE_FAIL | 0 | oss-alt |
| 138 | usememos/memos | OK | 7 | oss-alt |
| 139 | hcengineering/huly | CLONE_FAIL | 0 | oss-alt |
| 140 | gitroomhq/postiz-app | OK | 23 | oss-alt |
| 141 | dittofeed/dittofeed | OK | 17 | oss-alt |
| 142 | laudspeaker/laudspeaker | OK | 26 | oss-alt |
| 143 | triggerdotdev/trigger.dev | OK | 0 | oss-alt |
| 144 | windmill-labs/windmill | OK | 10 | oss-alt |
| 145 | temporal-sa/temporal | CLONE_FAIL | 0 | oss-alt |
| 146 | kestra-io/kestra | OK | 4 | oss-alt |
| 147 | airbytehq/airbyte | OK | 6 | oss-alt |
| 148 | meltano/meltano | OK | 3 | oss-alt |
| 149 | PeerDB-io/peerdb | OK | 5 | oss-alt |
| 150 | growthbook/growthbook | OK | 0 | oss-alt |
| 151 | jenkinsci/jenkins | OK | 1 | sysadmin |
| 152 | concourse/concourse | OK | 4 | sysadmin |
| 153 | woodpecker-ci/woodpecker | OK | 5 | sysadmin |
| 154 | drone/drone | OK | 4 | sysadmin |
| 155 | gocd/gocd | OK | 4 | sysadmin |
| 156 | cockpit-project/cockpit | OK | 1 | sysadmin |
| 157 | webmin/webmin | OK | 0 | sysadmin |
| 158 | hestiacp/hestiacp | OK | 1 | sysadmin |
| 159 | Froxlor/Froxlor | OK | 0 | sysadmin |
| 160 | ajenti/ajenti | OK | 0 | sysadmin |
| 161 | zabbix/zabbix | OK | 0 | sysadmin |
| 162 | icingaweb2/icingaweb2 | CLONE_FAIL | 0 | sysadmin |
| 163 | osTicket/osTicket | OK | 0 | sysadmin |
| 164 | freescout-helpdesk/freescout | OK | 4 | sysadmin |
| 165 | SuiteCRM/SuiteCRM | OK | 1 | sysadmin |
| 166 | YetiForceCRM/YetiForceCRM | CLONE_FAIL | 0 | sysadmin |
| 167 | espocrm/espocrm | OK | 1 | sysadmin |
| 168 | krayin/laravel-crm | OK | 8 | sysadmin |
| 169 | monicahq/monica | OK | 11 | sysadmin |
| 170 | snipeit/snipe-it | CLONE_FAIL | 0 | sysadmin |
| 171 | thelounge/thelounge | OK | 6 | sysadmin |
| 172 | kiwiirc/kiwiirc | OK | 1 | sysadmin |
| 173 | Mailtrain-org/mailtrain | OK | 9 | sysadmin |
| 174 | listmonk/listmonk | CLONE_FAIL | 0 | sysadmin |
| 175 | postalserver/postal | OK | 14 | sysadmin |
| 176 | haraka/Haraka | OK | 3 | sysadmin |
| 177 | Foundry376/Mailspring | OK | 3 | sysadmin |
| 178 | mayan-edms/Mayan-EDMS | OK | 4 | sysadmin |
| 179 | ciur/papermerge | OK | 5 | sysadmin |
| 180 | open-source-labs/Svelvet | OK | 0 | sysadmin |
| 181 | gravitl/netmaker | OK | 5 | sysadmin |
| 182 | firezone/firezone | OK | 5 | sysadmin |
| 183 | wg-easy/wg-easy | OK | 4 | sysadmin |
| 184 | ansible-semaphore/semaphore | OK | 4 | sysadmin |
| 185 | rundeck/rundeck | OK | 0 | sysadmin |
| 186 | saltstack/salt | OK | 8 | sysadmin |
| 187 | theforeman/foreman | OK | 12 | sysadmin |
| 188 | MunkiAdmin/MunkiAdmin | CLONE_FAIL | 0 | sysadmin |
| 189 | Graylog2/graylog2-server | OK | 5 | sysadmin |
| 190 | dozzle/dozzle | CLONE_FAIL | 0 | sysadmin |
| 191 | openobserve/openobserve | OK | 4 | sysadmin |
| 192 | uptimerobot/uptimerobot | CLONE_FAIL | 0 | sysadmin |
| 193 | statping-ng/statping-ng | OK | 4 | sysadmin |
| 194 | healthchecks/healthchecks | OK | 11 | sysadmin |
| 195 | TwiN/gatus | OK | 4 | sysadmin |
| 196 | gethomepage/homepage | OK | 3 | sysadmin |
| 197 | bastienwirtz/homer | OK | 1 | sysadmin |
| 198 | linuxserver/Heimdall | OK | 8 | sysadmin |
| 199 | pawelmalak/flame | OK | 2 | sysadmin |
| 200 | ajnart/homarr | OK | 8 | sysadmin |

## Clone Failures (21)

These repos failed `git clone --depth 1` (likely renamed, moved, private, or incorrect org):
plane-so/plane, getoutline/outline, vaultwarden/vaultwarden, forgejo/forgejo, goatcounter/goatcounter, etherpad/etherpad-lite, alf-io/alf.io, koillabs/Koillection, typebot-io/typebot, calendso/cal.com, docuseal/docuseal, Grapedrop/grapesjs, hcengineering/huly, temporal-sa/temporal, icingaweb2/icingaweb2, YetiForceCRM/YetiForceCRM, snipeit/snipe-it, listmonk/listmonk, MunkiAdmin/MunkiAdmin, dozzle/dozzle, uptimerobot/uptimerobot

## Analysis

### Key Findings

1. **76.5% detection rate on real applications** -- a major improvement over the 54% on round 1 (which mixed frameworks/libraries with apps). When tested against actual applications that USE services, codepliant detects services in over 3 out of 4 repos.

2. **Zero crashes, zero scan failures** -- the scanner is production-stable across 179 diverse repos spanning JS/TS, Python, Ruby, PHP, Go, Rust, Java, .NET, and Elixir.

3. **5.69 avg services per repo** -- real applications use significantly more services than libraries (round 1 avg was 2.62 when libraries were included).

4. **SaaS alternatives have highest avg (7.02)** -- makes sense since these apps replicate commercial SaaS functionality requiring many integrations.

### Top Detection Gaps (Priority Fixes)

These are real applications that almost certainly use third-party services but returned 0:

| Repo | Language | Expected Services | Gap |
|------|----------|-------------------|-----|
| PostHog/posthog | Python/TS | Postgres, Redis, Kafka, ClickHouse, S3 | Python infra services not detected |
| n8n-io/n8n | TypeScript | 400+ integration connectors | Dynamic/plugin-based integrations not scanned |
| RocketChat/Rocket.Chat | TypeScript | MongoDB, LDAP, OAuth, SMTP, push notifications | Meteor framework not recognized |
| WordPress/wordpress-develop | PHP | MySQL, SMTP, dozens of plugin APIs | WordPress core uses raw PHP, no package manager deps |
| calcom/cal.com | TypeScript | Stripe, Google Calendar, Zoom, Prisma/Postgres | Monorepo structure may hide deps |
| twentyhq/twenty | TypeScript | Postgres, Redis, S3, Stripe | CRM with many integrations |
| supabase/supabase | TypeScript | Postgres, GoTrue, Kong, S3, SMTP | Multi-service architecture, docker-compose based |
| jellyfin/jellyfin | C# | SQLite, DLNA, LDAP, hardware transcoding | .NET/C# ecosystem gap |
| keycloak/keycloak | Java | LDAP, SMTP, Postgres, OAuth providers | Java ecosystem gap |
| portainer/portainer | Go | Docker API, LDAP, OAuth | Go infrastructure services gap |

### Observations

1. **PHP apps underperform** -- WordPress (0), Grocy (0), Froxlor (0), osTicket (0). PHP apps that don't use Composer for service dependencies get missed.
2. **Go apps with 0 detections** -- portainer, pocketbase, goatcounter. Go import scanning may need improvement for infrastructure services.
3. **Java/C# gaps persist** -- keycloak (0), jellyfin (0), rundeck (0), zabbix (0). These ecosystems need deeper scanning (Maven/NuGet).
4. **Docker-compose-only services** -- apps that define services purely in docker-compose.yml (Redis, Postgres, Kafka) without corresponding code imports are missed.
5. **Plugin-based architectures** -- n8n, activepieces, WordPress define integrations as plugins/extensions loaded at runtime, not as direct imports.

### Comparison with Round 1

| Metric | Round 1 (mixed) | Round 5 (apps only) | Delta |
|--------|-----------------|---------------------|-------|
| Repos tested | 50 | 179 (OK) | +129 |
| Detection rate | 54% | 76.5% | +22.5pp |
| Avg services | 2.62 | 5.69 | +3.07 |
| Max services | 23 | 35 | +12 |
| Crashes | 0 | 0 | stable |

### Recommended Next Steps

1. **Add docker-compose.yml scanner** -- detect services defined in compose files (postgres, redis, kafka, elasticsearch, etc.)
2. **Improve PHP scanning** -- scan WordPress wp-config.php patterns, raw `mysql_connect`/`mysqli` calls
3. **Add Maven/Gradle scanning** -- detect Java dependencies for keycloak, jenkins, graylog, etc.
4. **Add NuGet/.csproj scanning** -- detect C#/.NET dependencies for jellyfin, Prowlarr, Sonarr, etc.
5. **Add Go mod scanning** -- detect Go module imports for infrastructure services
6. **Plugin manifest scanning** -- scan plugin registries/manifests for n8n, WordPress, activepieces
