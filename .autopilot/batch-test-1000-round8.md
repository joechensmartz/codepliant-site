# Batch Test 1000 - Round 8: Domain-Specific Applications

**Date:** 2026-03-16
**Tool:** codepliant scan --json
**Method:** Shallow clone (--depth 1), scan, record services count, delete
**Focus:** Real-world applications across 5 verticals (E-commerce, Healthcare, Education, Finance, Social)

## Results

### E-commerce (Shopify, WooCommerce, Magento, etc.)

| # | Repo | Services Detected |
|---|------|-------------------|
| 1 | Shopify/shopify-app-template-node | 0 |
| 2 | Shopify/hydrogen | 2 |
| 3 | Shopify/dawn | 0 |
| 4 | woocommerce/woocommerce | 4 |
| 5 | mage-os/mageos-magento2 | 0 |
| 6 | bagisto/bagisto | 8 |
| 7 | medusajs/medusa | 0 |

*Clone failures (3): nickincloud/shopify-app-template-remix, developer-developer-developer/woocommerce-square, developer-developer-developer/woocommerce-gateway-stripe*

### Healthcare (OpenEMR, OpenMRS, FHIR, etc.)

| # | Repo | Services Detected |
|---|------|-------------------|
| 8 | openemr/openemr | 5 |
| 9 | openmrs/openmrs-core | 4 |
| 10 | LibreHealthIO/lh-ehr | 1 |
| 11 | Bahmni/openmrs-module-bahmniapps | 1 |
| 12 | hapifhir/hapi-fhir | 3 |
| 13 | smart-on-fhir/client-js | 0 |
| 14 | cerner/terra-core | 0 |
| 15 | health-validator/Hammer | 1 |
| 16 | medplum/medplum | 17 |
| 17 | opensrp/opensrp-client-core | 0 |

### Education (Moodle, Canvas, Open edX, etc.)

| # | Repo | Services Detected |
|---|------|-------------------|
| 18 | moodle/moodle | 3 |
| 19 | instructure/canvas-lms | 0 |
| 20 | openedx/edx-platform | 6 |
| 21 | ClassroomIO/classroomio | 14 |
| 22 | overleaf/overleaf | 0 |
| 23 | jitsi/jitsi-meet | 0 |
| 24 | oppia/oppia | 10 |
| 25 | ankitects/anki | 1 |
| 26 | chamilo/chamilo-lms | 2 |
| 27 | ilios/ilios | 5 |

### Finance (ERPNext, Akaunting, InvoiceNinja, etc.)

| # | Repo | Services Detected |
|---|------|-------------------|
| 28 | frappe/erpnext | 4 |
| 29 | akaunting/akaunting | 6 |
| 30 | invoiceninja/invoiceninja | 12 |
| 31 | firefly-iii/firefly-iii | 8 |
| 32 | maybe-finance/maybe | 24 |
| 33 | actualbudget/actual | 0 |
| 34 | fossasia/open-event-server | 7 |
| 35 | killbill/killbill | 3 |

*Clone failures (2): lancermonkey/splern, frontaccounting/FA*

### Social (Mastodon, Pixelfed, Misskey, etc.)

| # | Repo | Services Detected |
|---|------|-------------------|
| 36 | mastodon/mastodon | 23 |
| 37 | pixelfed/pixelfed | 8 |
| 38 | misskey-dev/misskey | 12 |
| 39 | LemmyNet/lemmy | 0 |
| 40 | element-hq/synapse | 1 |
| 41 | diaspora/diaspora | 20 |
| 42 | friendica/friendica | 0 |
| 43 | movim/movim | 0 |
| 44 | calcom/cal.com | 0 |
| 45 | chatwoot/chatwoot | 35 |

## Round 8 Summary

| Metric | Value |
|--------|-------|
| Repos attempted | 50 |
| Clone failures | 5 |
| Repos scanned | **45** |
| Repos with detections (>0) | **30** |
| Detection rate | **67%** |
| Total services detected | **250** |
| Average services/repo | **5.6** |
| Max services detected | **35** (chatwoot/chatwoot) |
| Zero-detection repos | 15 |

## Per-Category Breakdown

| Category | Scanned | Detected | Rate | Avg Services | Top Repo |
|----------|---------|----------|------|-------------|----------|
| E-commerce | 7 | 3 | 43% | 2.0 | bagisto (8) |
| Healthcare | 10 | 6 | 60% | 3.2 | medplum (17) |
| Education | 10 | 7 | 70% | 4.1 | ClassroomIO (14) |
| Finance | 8 | 7 | 88% | 8.0 | maybe (24) |
| Social | 10 | 7 | 70% | 9.9 | chatwoot (35) |

## Running Total (All Rounds)

| Round | Date | Repos | Detected | Rate | Services | Avg |
|-------|------|-------|----------|------|----------|-----|
| 1 (General OSS) | 2026-03-15 | 50 | 27 | 54% | 131 | 2.6 |
| 2 (SaaS Apps) | 2026-03-15 | 50 | 37 | 74% | 229 | 4.6 |
| 8 (Domain Apps) | 2026-03-16 | 45 | 30 | 67% | 250 | 5.6 |
| **Cumulative** | | **145** | **94** | **65%** | **610** | **4.2** |

*Note: Rounds 3-7 were run in a separate session. The cumulative total here reflects only rounds with recorded data (1, 2, 8 = 145 repos). The full 1000-repo target includes all 20 rounds of 50.*

## Zero-Detection Repos (Needs Investigation)

1. **Shopify/shopify-app-template-node** - Node.js template; likely minimal deps in template form
2. **Shopify/dawn** - Liquid/JS theme; no backend services expected
3. **mage-os/mageos-magento2** - PHP; same Magento detection gap as round 2
4. **medusajs/medusa** - Node.js headless commerce; surprising miss, uses many integrations
5. **smart-on-fhir/client-js** - Small FHIR client library; expected
6. **cerner/terra-core** - React UI component library; expected
7. **opensrp/opensrp-client-core** - Android/Java client; mobile app gap
8. **instructure/canvas-lms** - Ruby on Rails LMS; very large repo, may have scanning issues at scale
9. **overleaf/overleaf** - Node.js LaTeX editor; uses MongoDB, Redis - should detect more
10. **jitsi/jitsi-meet** - Java/JS video platform; uses SRTP, Otel - may need WebRTC signatures
11. **actualbudget/actual** - Node.js budgeting; local-first design, fewer external services
12. **LemmyNet/lemmy** - Rust; weak Rust ecosystem detection
13. **friendica/friendica** - PHP social; same PHP gap pattern
14. **movim/movim** - PHP XMPP client; same PHP gap
15. **calcom/cal.com** - Next.js scheduling; surprising miss, uses Stripe, Google Calendar, etc.

## Key Observations

1. **Finance apps detect best (88%)** - these applications use the most third-party integrations (payment processors, banking APIs, analytics), which aligns well with codepliant's signature database
2. **Social platforms are service-heavy** - Mastodon (23), Diaspora (20), Chatwoot (35) all have extensive integrations for federation, email, storage, analytics
3. **E-commerce has the lowest rate (43%)** - many e-commerce platforms use PHP-specific patterns (Magento, WooCommerce) or template structures that don't match current signatures
4. **Medplum is a standout healthcare hit (17)** - TypeScript FHIR platform with extensive AWS, auth, and analytics integrations
5. **Cal.com returning 0 is a significant gap** - a major Next.js app with Stripe, Google APIs, Zoom, etc. should detect many services; worth priority investigation
6. **Chatwoot set a new single-repo record (35)** - Ruby on Rails customer support platform with extensive third-party integrations
7. **PHP remains inconsistent** - InvoiceNinja (12) and Akaunting (6) detect well via Laravel, but raw PHP apps (Friendica, Movim) miss entirely
