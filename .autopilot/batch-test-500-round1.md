# Batch Test 500 - Round 1 of 10

**Date:** 2026-03-15
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete

## Results

| # | Repo | Status | Services Detected |
|---|------|--------|-------------------|
| 1 | vercel/next.js | OK | 23 |
| 2 | facebook/react | OK | 2 |
| 3 | vuejs/core | OK | 0 |
| 4 | sveltejs/kit | OK | 1 |
| 5 | remix-run/remix | OK | 1 |
| 6 | trpc/trpc | OK | 0 |
| 7 | prisma/prisma | OK | 5 |
| 8 | drizzle-team/drizzle-orm | OK | 4 |
| 9 | supabase/supabase | OK | 0 |
| 10 | appwrite/appwrite | OK | 3 |
| 11 | directus/directus | OK | 9 |
| 12 | strapi/strapi | OK | 7 |
| 13 | payloadcms/payload | OK | 0 |
| 14 | nocodb/nocodb | OK | 18 |
| 15 | n8n-io/n8n | OK | 0 |
| 16 | langgenius/dify | OK | 0 |
| 17 | lobehub/lobe-chat | OK | 0 |
| 18 | open-webui/open-webui | OK | 7 |
| 19 | ollama/ollama | OK | 4 |
| 20 | oven-sh/bun | OK | 6 |
| 21 | denoland/deno | OK | 0 |
| 22 | withastro/astro | OK | 4 |
| 23 | withastro/starlight | OK | 1 |
| 24 | shadcn-ui/ui | OK | 4 |
| 25 | tailwindlabs/tailwindcss | OK | 0 |
| 26 | ionic-team/ionic-framework | OK | 0 |
| 27 | expo/expo | OK | 4 |
| 28 | react-native-community/cli | OK | 0 |
| 29 | nestjs/nest | OK | 5 |
| 30 | fastify/fastify | OK | 0 |
| 31 | expressjs/express | OK | 2 |
| 32 | koajs/koa | OK | 0 |
| 33 | honojs/hono | OK | 1 |
| 34 | django/django | OK | 3 |
| 35 | pallets/flask | OK | 0 |
| 36 | tiangolo/fastapi | OK | 1 |
| 37 | encode/starlette | OK | 0 |
| 38 | rails/rails | OK | 6 |
| 39 | laravel/laravel | OK | 6 |
| 40 | symfony/symfony | OK | 0 |
| 41 | gin-gonic/gin | OK | 2 |
| 42 | gofiber/fiber | OK | 0 |
| 43 | labstack/echo | OK | 0 |
| 44 | actix/actix-web | OK | 0 |
| 45 | tokio-rs/axum | OK | 0 |
| 46 | spring-projects/spring-boot | OK | 0 |
| 47 | quarkusio/quarkus | OK | 3 |
| 48 | dotnet/aspnetcore | OK | 0 |
| 49 | elixir-lang/elixir | OK | 0 |
| 50 | phoenixframework/phoenix | OK | 1 |

## Summary

| Metric | Value |
|--------|-------|
| **Total repos tested** | 50 |
| **Total repos scanned successfully** | 50 |
| **Crashes** | 0 |
| **Clone failures** | 1 (astro-build/astro - wrong org, retried with withastro/astro) |
| **Total services detected** | 131 |
| **Average services per repo** | 2.62 |
| **Repos with >0 services (detection rate)** | 27/50 (54%) |
| **Repos with 0 services** | 23/50 (46%) |
| **Max services detected** | 23 (next.js) |

## Analysis

### Top detections
- **next.js** (23) - largest monorepo with many integrations
- **nocodb** (18) - database tool with many service integrations
- **directus** (9) - headless CMS with multiple service connections
- **strapi** (7) - CMS with plugin ecosystem
- **open-webui** (7) - AI interface with multiple backends

### Zero-detection repos worth investigating
Several repos that likely use third-party services returned 0:
- **supabase** - uses Postgres, auth providers, storage (should detect more)
- **n8n** - workflow automation with 400+ integrations (should detect many)
- **dify** - AI platform using OpenAI, vector DBs, etc.
- **lobe-chat** - AI chat using multiple LLM providers
- **spring-boot** - Java framework with many integrations
- **aspnetcore** - .NET framework (may need C#/F# scanner support)

### Observations
1. **No crashes** - scanner is stable across all 50 repos including very large ones (appwrite 51k files, next.js 28k files, quarkus 30k files)
2. **54% detection rate** - over half of repos had at least one service detected
3. **Language gap** - repos in Go, Rust, Elixir, Java, C#, and Ruby tend to show 0 or low counts, suggesting the scanner may be JS/TS-focused
4. **Framework libraries vs apps** - many 0-detection repos are framework libraries (express, koa, flask) which don't themselves use services, just enable them. This is expected behavior.
