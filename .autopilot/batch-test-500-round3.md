# Batch Test Round 3 — 200 Repo Scan

**Date:** 2026-03-15
**CLI:** `dist/cli.js scan --json`
**Method:** Shallow clone (`--depth 1`), scan, record service count, delete, next

## Summary

| Metric | Value |
|--------|-------|
| Total repos scanned | 204 |
| Repos with services detected | 132 (64.7%) |
| Total services found | 824 |
| Avg services per detected repo | 6.2 |

## Per-Repo Results

| # | Repo | Services |
|---|------|----------|
| 1 | vercel/commerce | 0 |
| 2 | vercel/platforms | 2 |
| 3 | calcom/cal.com | 0 |
| 4 | highlight/highlight | 14 |
| 5 | triggerdotdev/trigger.dev | 0 |
| 6 | projectx-codehagen/Badget | 9 |
| 7 | dubinc/dub | 0 |
| 8 | boxyhq/jackson | 7 |
| 9 | documenso/documenso | 0 |
| 10 | formbricks/formbricks | 0 |
| 11 | infisical/infisical | 0 |
| 12 | latitude-dev/latitude-llm | 8 |
| 13 | maybe-finance/maybe | 16 |
| 14 | midday-ai/midday | 0 |
| 15 | nhost/nhost | 0 |
| 16 | novuhq/novu | 0 |
| 17 | openstatusHQ/openstatus | 0 |
| 18 | papermark-io/papermark | 0 |
| 19 | plausible/analytics | 12 |
| 20 | twentyhq/twenty | 0 |
| 21 | unkeyed/unkey | 0 |
| 22 | wasp-lang/wasp | 7 |
| 23 | web3auth/web3auth-web | 3 |
| 24 | supabase/supabase | 0 |
| 25 | appwrite/appwrite | 3 |
| 26 | directus/directus | 9 |
| 27 | strapi/strapi | 7 |
| 28 | payloadcms/payload | 0 |
| 29 | nocodb/nocodb | 18 |
| 30 | n8n-io/n8n | 0 |
| 31 | medusajs/medusa | 0 |
| 32 | saleor/saleor | 5 |
| 33 | spree/spree | 1 |
| 34 | solidusio/solidus | 7 |
| 35 | vendure-ecommerce/vendure | 0 |
| 36 | bagisto/bagisto | 7 |
| 37 | aimeos/aimeos-core | 0 |
| 38 | sylius/Sylius | 0 |
| 39 | prestashop/prestashop | 0 |
| 40 | mattermost/mattermost | 3 |
| 41 | RocketChat/Rocket.Chat | 0 |
| 42 | zulip/zulip | 5 |
| 43 | chatwoot/chatwoot | 24 |
| 44 | discourse/discourse | 9 |
| 45 | mastodon/mastodon | 16 |
| 46 | pixelfed/pixelfed | 8 |
| 47 | misskey-dev/misskey | 10 |
| 48 | bookwyrm-social/bookwyrm | 5 |
| 49 | outline/outline | 0 |
| 50 | logto-io/logto | 0 |
| 51 | zitadel/zitadel | 10 |
| 52 | casdoor/casdoor | 10 |
| 53 | ToolJet/ToolJet | 24 |
| 54 | appsmithorg/appsmith | 8 |
| 55 | budibase/budibase | 17 |
| 56 | windmill-labs/windmill | 8 |
| 57 | airbytehq/airbyte | 5 |
| 58 | dagster-io/dagster | 6 |
| 59 | prefecthq/prefect | 9 |
| 60 | apache/airflow | 0 |
| 61 | PostHog/posthog | 0 |
| 62 | umami-software/umami | 6 |
| 63 | matomo-org/matomo | 2 |
| 64 | grafana/grafana | 11 |
| 65 | prometheus/prometheus | 4 |
| 66 | elastic/elasticsearch | 0 |
| 67 | getsentry/sentry | 0 |
| 68 | louislam/uptime-kuma | 7 |
| 69 | netdata/netdata | 4 |
| 70 | coollabsio/coolify | 10 |
| 71 | dokku/dokku | 4 |
| 72 | caprover/caprover | 2 |
| 73 | portainer/portainer | 0 |
| 74 | traefik/traefik | 6 |
| 75 | nginx-proxy/nginx-proxy | 1 |
| 76 | bitwarden/server | 1 |
| 77 | vaultwarden/vaultwarden | 0 |
| 78 | keycloak/keycloak | 0 |
| 79 | authelia/authelia | 4 |
| 80 | goauthentik/authentik | 8 |
| 81 | ory/kratos | 6 |
| 82 | nextcloud/server | 2 |
| 83 | owncloud/core | 1 |
| 84 | seafile/seafile | 0 |
| 85 | syncthing/syncthing | 2 |
| 86 | immich-app/immich | 8 |
| 87 | photoprism/photoprism | 10 |
| 88 | jellyfin/jellyfin | 0 |
| 89 | Radarr/Radarr | 1 |
| 90 | Sonarr/Sonarr | 2 |
| 91 | invoiceninja/invoiceninja | 12 |
| 92 | crater-invoice/crater | 10 |
| 93 | akaunting/akaunting | 6 |
| 94 | ghostfolio/ghostfolio | 8 |
| 95 | hoppscotch/hoppscotch | 12 |
| 96 | insomnia-rest/insomnia | 0 |
| 97 | Kong/kong | 1 |
| 98 | apache/apisix | 0 |
| 99 | TykTechnologies/tyk | 13 |
| 100 | hasura/graphql-engine | 7 |
| 101 | postgraphile/crystal | 0 |
| 102 | parse-community/parse-server | 6 |
| 103 | pocketbase/pocketbase | 0 |
| 104 | appwrite/appwrite (dup) | 7 |
| 105 | supertokens/supertokens-core | 2 |
| 106 | langgenius/dify | 0 |
| 107 | lobehub/lobe-chat | 0 |
| 108 | open-webui/open-webui | 11 |
| 109 | ollama/ollama | 7 |
| 110 | oobabooga/text-generation-webui | 3 |
| 111 | lm-sys/FastChat | 4 |
| 112 | AUTOMATIC1111/stable-diffusion-webui | 5 |
| 113 | comfyanonymous/ComfyUI | 7 |
| 114 | invoke-ai/InvokeAI | 0 |
| 115 | TabbyML/tabby | 7 |
| 116 | continuedev/continue | 15 |
| 117 | sourcegraph/cody | 0 |
| 118 | langchain-ai/langchain | 8 |
| 119 | run-llama/llama_index | 11 |
| 120 | chroma-core/chroma | 9 |
| 121 | qdrant/qdrant | 5 |
| 122 | weaviate/weaviate | 12 |
| 123 | milvus-io/milvus | 13 |
| 124 | trpc/trpc | 0 |
| 125 | honojs/hono | 2 |
| 126 | elysiajs/elysia | 1 |
| 127 | drizzle-team/drizzle-orm | 6 |
| 128 | prisma/prisma | 6 |
| 129 | typeorm/typeorm | 7 |
| 130 | sequelize/sequelize | 1 |
| 131 | knex/knex | 1 |
| 132 | kysely-org/kysely | 2 |
| 133 | lucia-auth/lucia | 0 |
| 134 | nextauthjs/next-auth | 17 |
| 135 | clerk/javascript | 0 |
| 136 | supabase/auth | 5 |
| 137 | workos/authkit | 0 |
| 138 | better-auth/better-auth | 0 |
| 139 | resend/resend-node | 1 |
| 140 | nodemailer/nodemailer | 0 |
| 141 | sendgrid/sendgrid-nodejs | 3 |
| 142 | stripe/stripe-node | 1 |
| 143 | paypal/PayPal-node-SDK | 0 |
| 144 | adyen/adyen-node-api-library | 0 |
| 145 | open-telemetry/opentelemetry-js | 0 |
| 146 | getsentry/sentry-javascript | 0 |
| 147 | PostHog/posthog-js | 10 |
| 148 | aws/aws-sdk-js-v3 | 0 |
| 149 | googleapis/google-cloud-node | 5 |
| 150 | Azure/azure-sdk-for-js | 6 |
| 151 | vercel/ai | 0 |
| 152 | anthropics/anthropic-sdk-typescript | 3 |
| 153 | openai/openai-node | 4 |
| 154 | upstash/upstash-redis | 9 |
| 155 | redis/node-redis | 4 |
| 156 | ioredis/ioredis | 2 |
| 157 | socketio/socket.io | 9 |
| 158 | pusher/pusher-js | 1 |
| 159 | centrifugal/centrifugo | 8 |
| 160 | uploadthing/uploadthing | 0 |
| 161 | transloadit/uppy | 11 |
| 162 | TUS/tus-js-client | 0 |
| 163 | tailwindlabs/headlessui | 0 |
| 164 | radix-ui/primitives | 0 |
| 165 | shadcn-ui/ui | 5 |
| 166 | mantine-dev/mantine | 0 |
| 167 | chakra-ui/chakra-ui | 3 |
| 168 | ant-design/ant-design | 1 |
| 169 | django/django | 5 |
| 170 | encode/django-rest-framework | 4 |
| 171 | jazzband/django-oauth-toolkit | 4 |
| 172 | pennersr/django-allauth | 4 |
| 173 | django-oscar/django-oscar | 5 |
| 174 | wagtail/wagtail | 5 |
| 175 | tiangolo/fastapi | 1 |
| 176 | pallets/flask | 0 |
| 177 | tornadoweb/tornado | 0 |
| 178 | rails/rails | 0 |
| 179 | heartcombo/devise | 8 |
| 180 | doorkeeper-gem/doorkeeper | 8 |
| 181 | laravel/laravel | 6 |
| 182 | laravel/sanctum | 0 |
| 183 | spatie/laravel-permission | 0 |
| 184 | gin-gonic/gin | 3 |
| 185 | gofiber/fiber | 1 |
| 186 | labstack/echo | 1 |
| 187 | go-chi/chi | 0 |
| 188 | gorilla/mux | 1 |
| 189 | beego/beego | 2 |
| 190 | actix/actix-web | 1 |
| 191 | tokio-rs/axum | 0 |
| 192 | SergioBenitez/Rocket | 0 |
| 193 | nickel-org/nickel.rs | 0 |
| 194 | iron/iron | 0 |
| 195 | AltSysrq/propane | 0 |
| 196 | killbill/killbill | 2 |
| 197 | apereo/cas | 2 |
| 198 | thingsboard/thingsboard | 6 |
| 199 | dotnet/aspnetcore | 1 |
| 200 | IdentityServer/IdentityServer4 | 0 |
| 201 | openiddict/openiddict-core | 1 |
| 202 | phoenixframework/phoenix | 3 |
| 203 | elixir-lang/elixir | 1 |
| 204 | absinthe-graphql/absinthe | 0 |

## Top 15 by Service Count

| Repo | Services |
|------|----------|
| chatwoot/chatwoot | 24 |
| ToolJet/ToolJet | 24 |
| nocodb/nocodb | 18 |
| budibase/budibase | 17 |
| nextauthjs/next-auth | 17 |
| maybe-finance/maybe | 16 |
| mastodon/mastodon | 16 |
| continuedev/continue | 15 |
| highlight/highlight | 14 |
| TykTechnologies/tyk | 13 |
| milvus-io/milvus | 13 |
| plausible/analytics | 12 |
| invoiceninja/invoiceninja | 12 |
| hoppscotch/hoppscotch | 12 |
| weaviate/weaviate | 12 |

## Zero-Detection Repos (72)

commerce, cal.com, trigger.dev, dub, documenso, formbricks, infisical, midday, nhost, novu, openstatus, papermark, twenty, unkey, supabase, payload, n8n, medusa, vendure, aimeos-core, Sylius, prestashop, Rocket.Chat, outline, logto, airflow, posthog, elasticsearch, sentry, portainer, vaultwarden, keycloak, seafile, jellyfin, insomnia, apisix, crystal, pocketbase, dify, lobe-chat, InvokeAI, cody, trpc, lucia, javascript (clerk), authkit, better-auth, nodemailer, PayPal-node-SDK, adyen-node-api-library, opentelemetry-js, sentry-javascript, aws-sdk-js-v3, ai (vercel), uploadthing, tus-js-client, headlessui, primitives, mantine, flask, tornado, rails, sanctum, laravel-permission, chi, axum, Rocket, nickel.rs, iron, propane, IdentityServer4, absinthe

## Category Breakdown

| Category | Repos | Detected | Rate |
|----------|-------|----------|------|
| SaaS/Startup | 24 | 13 | 54% |
| CMS/Backend | 6 | 4 | 67% |
| E-commerce | 9 | 5 | 56% |
| Chat/Social | 9 | 8 | 89% |
| Low-code/Internal tools | 4 | 4 | 100% |
| Data/Orchestration | 4 | 3 | 75% |
| Monitoring/Observability | 6 | 4 | 67% |
| DevOps/Deployment | 6 | 5 | 83% |
| Auth/Identity | 6 | 4 | 67% |
| Storage/Media | 9 | 6 | 67% |
| Finance/Invoicing | 4 | 4 | 100% |
| API tools | 6 | 4 | 67% |
| AI/ML | 12 | 9 | 75% |
| Vector DBs | 4 | 4 | 100% |
| JS frameworks/ORMs | 12 | 9 | 75% |
| Auth libraries | 6 | 3 | 50% |
| SDK/Client libs | 18 | 12 | 67% |
| UI component libs | 6 | 3 | 50% |
| Python frameworks | 9 | 7 | 78% |
| Ruby frameworks | 3 | 2 | 67% |
| PHP frameworks | 3 | 1 | 33% |
| Go frameworks | 6 | 4 | 67% |
| Rust frameworks | 5 | 1 | 20% |
| Java/JVM | 3 | 3 | 100% |
| .NET | 3 | 2 | 67% |
| Elixir | 3 | 2 | 67% |

## Notes

- 204 repos scanned (list had 4 duplicates: appwrite appeared twice, resulting in 204 instead of 200 unique)
- **64.7% detection rate** across a highly diverse set of repos spanning 10+ languages and many architectures
- Full-stack apps and multi-service platforms detected at highest rates (low-code 100%, finance 100%, vector DBs 100%)
- Pure libraries and minimal frameworks detected at lowest rates (Rust 20%, PHP 33%, UI libs 50%)
- Largest bottleneck: google-cloud-node took ~30min to scan (1.8GB even with --depth 1)
- The scan ran under heavy contention with 3 other parallel batch tests
