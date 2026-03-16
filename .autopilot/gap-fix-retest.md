# Detection Gap Fix Retest -- v210

**Date:** 2026-03-16
**Version:** codepliant 210.0.0

## Summary

Retested the five repos that previously returned 0 services. Three of five now detect services. Two remain at 0.

| Repo | Previous | v210 | Delta | Verdict |
|------|----------|------|-------|---------|
| WordPress/WordPress | 0 | 0 | +0 | STILL FAILING |
| spring-projects/spring-petclinic | 0 | 8 | +8 | FIXED |
| dotnet/eShop | 0 | 0 | +0 | STILL FAILING |
| louislam/uptime-kuma | 0 | 8 | +8 | FIXED |
| netdata/netdata | 0 | 3 | +3 | FIXED |

**Pass rate: 3/5 (60%)**

---

## Detailed Results

### WordPress/WordPress -- 0 services (STILL FAILING)

- **services:** 0
- **dataCategories:** 0
- **complianceNeeds:** 3 (Terms of Service, Accessibility, Security Policy)

**What should be detected but is not:**
- MySQL -- `wp-config-sample.php` defines `DB_NAME`, `DB_USER`, `DB_HOST` via PHP `define()` calls. Scanner likely only checks package manifests, not raw PHP config patterns.
- SMTP -- `wp-includes/class-smtp.php` is a full SMTP client. No `composer.json` or `package.json` to pick it up.
- WordPress itself is a PHP project with no `composer.json` at root. The scanner has no PHP-specific config file detector.

**Root cause:** No PHP ecosystem scanner. WordPress has no `composer.json`, `package.json`, or any manifest file the current scanners look for. All service references are in raw `.php` source files.

---

### spring-projects/spring-petclinic -- 8 services (FIXED)

- **services:** 8
  - h2-database (database)
  - MySQL (database)
  - MySQL (env) (database)
  - PostgreSQL (database)
  - PostgreSQL (database)
  - PostgreSQL (env) (database)
  - spring-data-jpa (database)
  - spring-datasource (database)
- **dataCategories:** 1
- **complianceNeeds:** 6 (Privacy Policy, Terms of Service, COPPA, Accessibility, Security Policy, Data Retention)

**Notes:** Strong detection. Picked up all three database backends (H2, MySQL, PostgreSQL) plus Spring Data JPA and datasource config. Some duplicates from env vs. config detection -- minor dedup opportunity but not a bug.

---

### dotnet/eShop -- 0 services (STILL FAILING)

- **services:** 0
- **dataCategories:** 0
- **complianceNeeds:** 2 (Terms of Service, Accessibility)

**What should be detected but is not:**
- Redis/Garnet -- used for basket caching (`BasketService`, `RedisBasketRepository`)
- PostgreSQL / SQL Server -- used by Ordering and Catalog services via Entity Framework
- RabbitMQ -- used as the event bus transport
- Azure Service Bus -- alternative event bus
- Aspire / Docker Compose orchestration with multiple services defined in `AppHost`

**Root cause:** No .NET/C# ecosystem scanner. The project uses `.csproj` files and NuGet packages (`Npgsql`, `StackExchange.Redis`, `RabbitMQ.Client`, etc.) which are not inspected. No `package.json` or `docker-compose.yml` at the root to fall back on.

---

### louislam/uptime-kuma -- 8 services (FIXED)

- **services:** 8
  - Docker Hub (other)
  - nodemailer (email)
  - redis (database)
  - Redis (Cache) (database)
  - socket.io (other)
  - Socket.IO (other)
  - web-push (other)
  - ws (WebSocket) (other)
- **dataCategories:** 3
- **complianceNeeds:** 6 (Privacy Policy, Terms of Service, DPA, Accessibility, Security Policy, Data Retention)

**Notes:** Good coverage. Detected email (nodemailer), push notifications (web-push), WebSockets, Redis, Docker. Some duplication between `socket.io` / `Socket.IO` and `redis` / `Redis (Cache)` -- dedup opportunity.

---

### netdata/netdata -- 3 services (FIXED)

- **services:** 3
  - Docker Hub (other)
  - redis (database)
  - ws (WebSocket) (other)
- **dataCategories:** 6
- **complianceNeeds:** 4 (Privacy Policy, Terms of Service, Accessibility, Security Policy)

**Notes:** Detected Redis, Docker, WebSocket. This is a C/Python project so 3 services is reasonable given scanner coverage. Could potentially detect more (MQTT, cloud integrations) with broader source scanning.

---

## Remaining Gaps to Address

### P0 -- PHP ecosystem scanner
WordPress is the world's most popular CMS. Scanning `composer.json` (when present) and detecting common PHP patterns (`define('DB_*')`, `PDO`, `mysqli_connect`, `wp_mail`, PHPMailer) would cover WordPress and Laravel/Symfony projects.

### P0 -- .NET/NuGet ecosystem scanner
eShop is a Microsoft reference architecture. Scanning `.csproj` / `Directory.Packages.props` for NuGet package references (`Npgsql`, `StackExchange.Redis`, `RabbitMQ.Client`, `Azure.*`, `Microsoft.EntityFrameworkCore.*`) would cover the .NET ecosystem.

### P1 -- Service deduplication
Spring Petclinic shows `MySQL` + `MySQL (env)` and `PostgreSQL` + `PostgreSQL (env)` as separate entries. Uptime Kuma shows `redis` + `Redis (Cache)` and `socket.io` + `Socket.IO`. These should be merged into single entries with combined evidence.
