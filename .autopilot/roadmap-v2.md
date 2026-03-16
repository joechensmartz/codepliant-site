# Codepliant Roadmap v2 — Versions 6.0 through 55.0

Each version = 5 minute iteration with research + development + testing + review.
Current status: v5.0 complete (with open defects DEF-5/6/7, BUG-8).

---

## Phase 1: Core Quality (v6.0–v10.0)

### v6.0 — Document Quality & Section Customization

**Scope:**
- Add section-level customization: users can override any generated section via config (`sectionOverrides` map in `.codepliantrc.json`)
- Legal language polish pass: compare every generated section against lawyer-written equivalents (Stripe, Linear, PostHog)
- Add "last reviewed" date tracking in generated documents
- Fix DEF-5: `printScanResults` must display Prisma data categories even when no services detected
- Fix BUG-8: scoped package matching (`@prisma/client`, `posthog-js`) in dependency scanner

**Acceptance Criteria:**
- User can set `sectionOverrides: { "Data Retention": "Custom text here" }` in config and regeneration preserves it
- All generated privacy policy sections pass a checklist of 12 GDPR Art. 13 requirements (no placeholders in output when config is complete)
- `printScanResults` displays data categories from Prisma scanning regardless of service count
- Scoped packages (`@scope/pkg` and `pkg-name` formats) are matched by dependency scanner
- `tsc` passes, all tests pass, no regressions

**Dependencies:** v5.0 (Prisma scanner, data categories)

---

### v7.0 — MCP Server Production-Ready

**Scope:**
- Add all 7 document types to MCP tools (currently missing AI Checklist, Compliance Notes, DPA)
- Add incremental scan: only re-scan changed files since last scan (file mtime tracking)
- Add MCP resource endpoint for compliance status (summary of detected services, jurisdictions, document staleness)
- Error handling: timeouts, malformed requests, missing project paths
- Integration test with Claude Code and Cursor (manual verification checklist)

**Acceptance Criteria:**
- All 7 document types accessible via MCP tools
- Incremental scan skips unchanged files and produces identical results to full scan
- MCP compliance status resource returns valid JSON with service count, jurisdiction list, last scan timestamp
- Server handles missing project path, empty project, 100K+ line project without crash or hang
- Timeout after 30s with informative error message

**Dependencies:** v6.0 (bug fixes for accurate scan results)

---

### v8.0 — CI/CD & GitHub Action Polish

**Scope:**
- Production-ready GitHub Action with proper error handling, input validation, and YAML schema
- PR comment bot: auto-comment when new services detected in a PR diff (compare base vs head scan)
- Compliance badge generation (SVG badge: "Compliance Docs: Up to Date" / "Stale")
- Pre-commit hook support via `codepliant hook install`
- Action marketplace metadata (icon, color, description, branding)

**Acceptance Criteria:**
- GitHub Action runs successfully on Node 18/20/22
- PR comment correctly identifies added/removed services and suggests document regeneration
- Badge SVG renders correctly in GitHub README (both light and dark mode)
- Pre-commit hook blocks commit when compliance docs are stale (exit code 1) with clear message
- Action handles: no package.json, empty repo, monorepo with multiple package.json files

**Dependencies:** v7.0 (incremental scan for PR diff detection)

---

### v9.0 — CLI UX Overhaul

**Scope:**
- Progress indicators for scan phases (dependency scan, import scan, schema scan, generation)
- Interactive mode for first-time users: guided setup with prompts for company name, email, jurisdiction, output format
- Actionable error messages: every error includes a suggested fix or next step
- `--help` per subcommand with examples (`codepliant scan --help`, `codepliant go --help`)
- `--verbose` flag for debug output, `--quiet` flag for CI environments

**Acceptance Criteria:**
- Progress output shows scan phase names and timing (e.g., "Scanning dependencies... 12ms")
- Interactive mode produces a valid `.codepliantrc.json` and generates documents in one flow
- Every error path in CLI produces a message containing "Try:" or "Fix:" with a concrete suggestion
- `--quiet` suppresses all stdout except errors; exit code still reflects success/failure
- `--verbose` shows file-by-file scan details, service matching logic, generation timing

**Dependencies:** v6.0 (config improvements for interactive mode to write)

---

### v10.0 — Performance Optimization

**Scope:**
- Benchmark scan performance on 100K+ line projects (measure baseline, set targets)
- Parallelize independent scan phases (dependency, import, schema, env can run concurrently)
- Add file filtering: skip `node_modules`, `dist`, `.git`, vendor directories early (before reading)
- Stream-based file reading for import scanner (don't load entire file into memory)
- Cache scan results with file hash invalidation

**Acceptance Criteria:**
- Scan of 100K+ line project completes in < 3 seconds on M1 Mac
- Scan of 500K+ line monorepo completes in < 10 seconds
- Memory usage stays under 200MB for any project size
- Cached re-scan of unchanged project completes in < 500ms
- No accuracy loss: scan results identical to non-optimized version on 10 test projects

**Dependencies:** v9.0 (verbose mode useful for performance debugging)

---

## Phase 2: Output & Distribution (v11.0–v15.0)

### v11.0 — PDF Output (Lightweight)

**Scope:**
- Implement PDF generation using pdfmake (declarative JSON-to-PDF, ~3MB, no browser)
- Convert generated Markdown sections to pdfmake document definition (headings, tables, lists, bold, links)
- Add `--format pdf` CLI flag and `outputFormat: 'pdf'` config option
- Professional typography: system fonts, proper spacing, page numbers, headers/footers
- Print-ready: A4 and Letter page sizes, proper margins

**Acceptance Criteria:**
- `codepliant go --format pdf` generates one PDF per document type
- PDFs open correctly in Preview (macOS), Chrome, and Adobe Reader
- Tables render with borders and proper column widths
- Links are clickable in PDF viewers
- PDF file size < 200KB per document (no embedded fonts beyond standard)
- `pdfmake` is an optional dependency: if not installed, `--format pdf` prints install instructions

**Dependencies:** v10.0 (performance baseline before adding new output path)

---

### v12.0 — Embeddable Widget

**Scope:**
- Generate a `<script>` tag snippet that renders compliance document links in a website footer
- Widget loads a self-contained JS bundle (< 10KB gzipped) that renders links to hosted or local compliance pages
- Customizable: link text, layout (horizontal/vertical), colors via data attributes
- Generate widget code via `codepliant widget` command
- No external requests: widget is fully self-contained

**Acceptance Criteria:**
- `codepliant widget` outputs a `<script>` tag that can be pasted into any HTML page
- Widget renders links to Privacy Policy, Terms of Service, Cookie Policy (at minimum)
- Widget works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Widget respects dark mode via `prefers-color-scheme`
- Widget is < 10KB gzipped, loads in < 50ms, no layout shift

**Dependencies:** v11.0 (HTML output must exist for widget to link to)

---

### v13.0 — Hosted Compliance Page Generator

**Scope:**
- Generate a single `compliance.html` file containing all documents with tab navigation
- Table of contents sidebar with smooth scroll to sections
- Search within documents (client-side, no server)
- "Last updated" timestamp per document
- Deployable to any static host (Vercel, Netlify, GitHub Pages) with zero config

**Acceptance Criteria:**
- `codepliant page` generates a single `compliance.html` (< 500KB) with all documents
- Tab navigation switches between document types without page reload
- Search highlights matching text across all documents
- Page scores 100 on Lighthouse accessibility audit
- Page works offline (no external requests)

**Dependencies:** v5.0 (HTML output renderer), v12.0 (widget can embed into this page)

---

### v14.0 — JSON Structured Output for API Consumption

**Scope:**
- Parse generated Markdown into structured JSON with section hierarchy, metadata, and content blocks
- JSON schema definition (published as `.json` schema file) for each document type
- `--format json` CLI flag outputs structured JSON instead of Markdown
- API-friendly: each section has `id`, `title`, `content`, `subsections[]`
- Include scan metadata in JSON: detected services, jurisdictions, scan timestamp, tool version

**Acceptance Criteria:**
- `codepliant scan --json` output is valid JSON parseable by `JSON.parse()`
- JSON structure matches published schema (validate with ajv or similar)
- Section IDs are stable across regenerations (deterministic slugs from headings)
- Metadata includes: `toolVersion`, `scanTimestamp`, `projectPath`, `detectedServices[]`, `jurisdictions[]`
- Round-trip: JSON can reconstruct equivalent Markdown (no information loss)

**Dependencies:** v10.0 (scan metadata tracking)

---

### v15.0 — Document Versioning & Change Tracking

**Scope:**
- Track document versions: store hash of each generated document alongside output
- `codepliant diff` command: show what changed between current and last generation
- Changelog generation: auto-generate a `COMPLIANCE_CHANGELOG.md` with dated entries
- Detect meaningful changes vs. cosmetic changes (ignore whitespace, reordering)
- Warn when documents are stale (services changed but docs not regenerated)

**Acceptance Criteria:**
- `.codepliant-state.json` stores document hashes and generation timestamps
- `codepliant diff` shows added/removed/changed sections in human-readable format
- `COMPLIANCE_CHANGELOG.md` entries include date, version, and summary of changes
- Staleness detection correctly identifies when new services were added since last generation
- No false positives: regenerating with no changes produces "Documents up to date" message

**Dependencies:** v14.0 (JSON structure enables section-level diffing)

---

## Phase 3: Advanced Scanning (v16.0–v20.0)

### v16.0 — API Route Scanning

**Scope:**
- Detect data intake endpoints: POST/PUT/PATCH routes in Next.js (App Router + Pages Router), Express, Fastify
- Extract request body fields from route handlers (req.body destructuring, Zod schemas, TypeScript interfaces)
- Map detected fields to data categories (email → Contact, creditCard → Financial)
- Add detected API data intake to privacy policy "Information We Collect" section
- Support for middleware-based body parsing detection

**Acceptance Criteria:**
- Detects Next.js App Router `route.ts` POST handlers and Pages Router `api/*.ts` handlers
- Detects Express `app.post()` / `router.post()` handlers
- Extracts at least 80% of directly destructured body fields (`const { email, name } = req.body`)
- Zod schema fields (`.object({ email: z.string() })`) extracted correctly
- Detected fields appear in generated privacy policy under appropriate data categories

**Dependencies:** v10.0 (performance — API route scanning adds file reads)

---

### v17.0 — HTML/JSX Tracking Pixel Detection

**Scope:**
- Scan `.html`, `.jsx`, `.tsx` files for inline tracking scripts (Google Analytics, Meta Pixel, TikTok Pixel, LinkedIn Insight, Twitter/X Pixel)
- Detect `<script>` tags with known tracking domains (googletagmanager.com, connect.facebook.net, etc.)
- Detect `<img>` tracking pixels (1x1 images with tracking domains)
- Detect `<noscript>` fallback pixels
- Add detected trackers to cookie policy and privacy policy

**Acceptance Criteria:**
- Detects Google Analytics (gtag.js, analytics.js, GA4) in script tags
- Detects Meta Pixel (`fbq()` calls, `connect.facebook.net` scripts)
- Detects at least 5 major tracking pixel providers
- False positive rate < 5% (CDN scripts for UI libraries not flagged)
- Detected trackers automatically populate cookie policy "Third-Party Cookies" section

**Dependencies:** v16.0 (scanning infrastructure for JSX/TSX files)

---

### v18.0 — Data Flow Mapping

**Scope:**
- Generate a data flow summary: Collection (what fields, from where) → Storage (which database/service) → Sharing (which third parties)
- Visual representation in Markdown (table or ASCII diagram)
- Combine signals from: package.json services, import scanning, Prisma schema, API routes, tracking pixels
- Add `DATA_FLOW_MAP.md` as a new generated document
- Include data flow summary in privacy policy "How We Share Your Information" section

**Acceptance Criteria:**
- Data flow map correctly links detected input fields to storage services to third-party sharing
- At least 3 flow categories: User Input → Database, User Activity → Analytics, User Data → Third Party
- Map is generated as readable Markdown table with source, data type, destination columns
- `DATA_FLOW_MAP.md` generated alongside other compliance documents
- Map updates correctly when services are added or removed

**Dependencies:** v16.0 (API route scanning), v17.0 (tracking pixel detection), v5.0 (Prisma schema scanning)

---

### v19.0 — Django/Flask Model Scanning (Python ORM)

**Scope:**
- Scan Django `models.py` for model field definitions (CharField, EmailField, DateField, etc.)
- Scan SQLAlchemy/Flask model definitions (Column types)
- Map Django field types to data categories (EmailField → Contact, DateField → Demographics)
- Detect Django settings for AUTH_USER_MODEL customization
- Integrate with existing Python ecosystem scanning (requirements.txt, pyproject.toml)

**Acceptance Criteria:**
- Detects Django EmailField, CharField(name-like), DateTimeField, IPAddressField, FileField
- Detects SQLAlchemy Column(String) with name-based heuristics (same as Prisma scanner)
- Handles multi-file models (Django app structure with multiple models.py files)
- Detected fields appear in generated documents with "Django Model" as source
- No false positives on non-user models (e.g., Product.name should not be flagged)

**Dependencies:** v5.0 (Prisma scanner architecture to reuse), v10.0 (performance for Python file scanning)

---

### v20.0 — Go Struct Scanning

**Scope:**
- Scan Go struct definitions for personal data fields (same heuristics as Prisma/Django scanners)
- Parse `go.mod` for known service packages (aws-sdk-go, stripe-go, etc.)
- Detect GORM model tags (`gorm:"column:email"`)
- Support Go workspace files (go.work)
- Add Go service signatures to SERVICE_SIGNATURES

**Acceptance Criteria:**
- Detects Go structs with fields named Email, Phone, Name, Address, DOB, SSN, Password
- Parses `go.mod` and matches at least 10 known Go packages to service categories
- GORM column tags correctly map to data categories
- Handles Go module paths (e.g., `github.com/stripe/stripe-go/v76`)
- Go scanning integrates seamlessly with existing multi-language scan pipeline

**Dependencies:** v19.0 (Python ORM scanning pattern to follow), v10.0 (performance)

---

## Phase 4: Real-World Validation (v21.0–v25.0)

### v21.0 — 100 Repo Test Suite

**Scope:**
- Curate list of 100 popular open-source repos across languages (Node, Python, Go, Ruby, PHP)
- Build batch clone + scan script (`codepliant test-suite run`)
- Record scan results: services detected, fields found, documents generated, errors encountered
- Categorize repos by complexity: small (<10K lines), medium (10K-100K), large (100K+)
- Establish baseline metrics: average scan time, detection rate, error rate

**Acceptance Criteria:**
- 100 repos selected spanning 5+ languages and 10+ categories (e-commerce, SaaS, API, CMS, etc.)
- Batch scan completes all 100 repos without crashes (errors logged, not thrown)
- Results stored in structured JSON: `{ repo, stars, language, scanTime, servicesFound, errors }`
- Baseline metrics documented: mean scan time, median services detected, error rate
- At least 70% of repos with known third-party services have those services correctly detected

**Dependencies:** v20.0 (Go scanning), v19.0 (Python scanning) — need multi-language support

---

### v22.0 — False Positive/Negative Analysis & Fix

**Scope:**
- Analyze 100-repo results for false positives (services detected that aren't actually used)
- Analyze for false negatives (services present but not detected — manual audit of 20 repos)
- Categorize root causes: naming collisions, transitive dependencies, conditional imports, dynamic requires
- Fix top 10 false positive patterns and top 10 false negative patterns
- Add regression tests from real-world findings

**Acceptance Criteria:**
- False positive rate drops below 5% across the 100-repo suite
- False negative rate drops below 15% for the 20 manually audited repos
- At least 10 new SERVICE_SIGNATURES entries added from real-world discoveries
- Each fix includes a regression test with the actual code pattern that caused the issue
- Re-run of 100-repo suite shows measurable improvement in detection accuracy

**Dependencies:** v21.0 (100-repo test suite results as input)

---

### v23.0 — Regulation Text Compliance Matrix

**Scope:**
- Build a compliance matrix: map each generated document section to its regulatory source (GDPR Article, CCPA Section, AI Act Article)
- Verify every mandatory clause from GDPR Art. 13/14, CCPA 1798.100-1798.199, AI Act Art. 50 is addressed
- Generate a `COMPLIANCE_MATRIX.md` showing coverage gaps
- Add regulatory citations inline in generated documents (optional, enabled via config)
- Flag sections that need legal review vs. sections that are legally sufficient

**Acceptance Criteria:**
- Matrix covers 100% of GDPR Art. 13 mandatory clauses (12 items)
- Matrix covers 100% of CCPA mandatory disclosures (13 items)
- Matrix covers 100% of AI Act Art. 50 transparency requirements (5 paragraphs)
- Any gap in coverage is flagged as "ACTION REQUIRED" in the matrix
- Generated documents with `includeCitations: true` show regulation references in footnotes

**Dependencies:** v22.0 (accuracy fixes ensure generated content is reliable enough to matrix-check)

---

### v24.0 — Compare with Real Company Policies

**Scope:**
- Download and parse privacy policies from 10 companies (Stripe, Vercel, Linear, Notion, PostHog, Shopify, GitHub, Twilio, Cloudflare, Supabase)
- Generate Codepliant output for equivalent service profiles
- Section-by-section comparison: what do real policies include that we miss?
- Identify language quality gaps (vague vs. specific, passive vs. active voice)
- Incorporate findings into template improvements

**Acceptance Criteria:**
- 10 real policies parsed and sectioned
- Comparison report identifies at least 5 template improvements per document type
- Top 10 improvements implemented in generators
- Generated policies achieve >= 80% section coverage compared to real company policies
- Language quality review: no instances of "may collect" when we can say "collects" based on scan results

**Dependencies:** v23.0 (compliance matrix ensures we're checking the right things)

---

### v25.0 — User Testing & Onboarding Optimization

**Scope:**
- Define 3 user personas: solo developer, startup founder, enterprise compliance officer
- Create onboarding test script: install → first scan → review output → customize → regenerate
- Measure time-to-value (time from install to first useful document)
- Identify and fix top 5 friction points from user testing
- Add contextual help: inline explanations for generated sections

**Acceptance Criteria:**
- Time-to-value < 60 seconds for solo developer persona (npm install + codepliant go)
- Time-to-value < 5 minutes for startup founder persona (init + configure + generate)
- All 5 identified friction points have fixes implemented
- Contextual help available via `codepliant explain <section-name>`
- Zero-config scan produces useful output for any Node.js project without setup

**Dependencies:** v24.0 (template quality improvements must be done before user testing)

---

## Phase 5: Design & UX (v26.0–v30.0)

### v26.0 — Apple-Style Minimal HTML Page Design

**Scope:**
- Redesign HTML compliance page with Apple-inspired minimal aesthetics (use Impeccable design principles)
- Typography: SF Pro / system font stack, optimal line height (1.6), max-width 720px
- Color: monochromatic with single accent color, dark mode support
- Spacing: generous whitespace, clear section separation, breathing room
- Microinteractions: smooth scroll, subtle hover states, fade-in on scroll

**Acceptance Criteria:**
- HTML page passes visual review against Apple Legal page design standards
- Typography scale is consistent (h1: 2.5rem, h2: 1.75rem, h3: 1.25rem, body: 1rem)
- Dark mode auto-detects and renders correctly
- Page loads in < 1 second with no external requests
- Lighthouse scores: Performance 100, Accessibility 100, Best Practices 100

**Dependencies:** v13.0 (compliance page generator exists to redesign)

---

### v27.0 — Interactive Compliance Dashboard

**Scope:**
- Single HTML page dashboard showing: scan summary, detected services, jurisdiction coverage, document status
- Interactive elements: expandable service cards, jurisdiction toggle, document preview
- Real-time status indicators: green (up to date), yellow (stale), red (missing)
- Export dashboard as PNG for reports
- Generated via `codepliant dashboard`

**Acceptance Criteria:**
- Dashboard renders all scan data in a single page with no external dependencies
- Service cards show: name, category, data collected, which documents reference it
- Jurisdiction coverage shows which regulations are addressed and which have gaps
- Dashboard updates when `codepliant go` is re-run
- Works in all modern browsers, responsive on mobile

**Dependencies:** v26.0 (design system for consistent styling), v15.0 (versioning data for staleness)

---

### v28.0 — CLI Redesign

**Scope:**
- Beautiful, informative terminal output with colors, icons (Unicode), and alignment
- Scan progress: animated spinner per phase, timing per phase, total timing
- Results summary: table with services, categories, jurisdictions, documents generated
- Error output: red with clear formatting, suggestion in yellow
- `--no-color` flag for CI and piped output

**Acceptance Criteria:**
- CLI output uses consistent color scheme (green = success, yellow = warning, red = error, cyan = info)
- Scan progress shows real-time updates (not just final result)
- Results table aligns columns correctly for any service name length
- Colors disabled automatically when stdout is not a TTY
- Output is parseable when piped (no ANSI codes leak into files)

**Dependencies:** v9.0 (CLI UX foundation), v10.0 (timing data for progress display)

---

### v29.0 — Onboarding Wizard

**Scope:**
- `codepliant init` becomes a guided wizard with step-by-step prompts
- Steps: company info → jurisdiction selection → output format → scan → review → save config
- Preview generated documents before saving (show first 20 lines of each)
- Suggest jurisdictions based on detected services (e.g., Stripe → likely US+EU)
- Save preferences to `.codepliantrc.json` with comments explaining each field

**Acceptance Criteria:**
- Wizard completes in < 2 minutes for a typical setup
- Each step has a clear prompt with default value (press Enter to accept)
- Jurisdiction suggestions are accurate for 80%+ of common service combinations
- Generated `.codepliantrc.json` includes inline comments (JSON5 or JSONC format)
- Wizard can be re-run to update config without losing custom section overrides

**Dependencies:** v25.0 (user testing findings inform wizard flow), v6.0 (section overrides in config)

---

### v30.0 — Documentation Site

**Scope:**
- Generate documentation from code comments and README
- Pages: Getting Started, Configuration, CLI Reference, Document Types, Scanning, FAQ
- Hosted as static HTML (same design system as v26.0)
- Auto-generated CLI reference from `--help` output
- Search functionality (client-side)

**Acceptance Criteria:**
- Docs site covers all CLI commands, all config options, all document types
- Getting Started guide matches user testing flow from v25.0
- CLI reference is auto-generated (stays in sync with code)
- Search returns relevant results for common queries (privacy policy, GDPR, scanning)
- Site deploys to GitHub Pages with zero config

**Dependencies:** v26.0 (design system), v29.0 (wizard documentation needs wizard to exist)

---

## Phase 6: Ecosystem — Language Support (v31.0–v35.0)

### v31.0 — Ruby/Gemfile Scanning

**Scope:**
- Parse `Gemfile` and `Gemfile.lock` for known Ruby gems (stripe, devise, omniauth, etc.)
- Scan `.rb` files for `require` / `gem` statements
- Add Ruby service signatures (at least 15 gems: stripe, devise, omniauth, sidekiq, sendgrid, twilio, aws-sdk, etc.)
- Detect Rails model fields (`t.string :email`, `t.datetime :date_of_birth`)
- Support `config/initializers/*.rb` for API key patterns

**Acceptance Criteria:**
- Gemfile parsing detects all known service gems
- Rails model scanning detects personal data fields with same accuracy as Prisma scanner
- At least 15 Ruby-specific service signatures added
- Scanning a Rails app produces meaningful privacy policy with detected services
- No performance regression on non-Ruby projects

**Dependencies:** v22.0 (false positive analysis methodology applies to new language), v10.0 (performance)

---

### v32.0 — PHP/composer.json Scanning

**Scope:**
- Parse `composer.json` and `composer.lock` for known PHP packages
- Scan `.php` files for `use` statements and `require` calls
- Add PHP service signatures (at least 15: stripe/stripe-php, laravel/cashier, aws/aws-sdk-php, etc.)
- Detect Laravel Eloquent model fields (`$fillable`, `$casts`, migration column types)
- Support `.env` patterns common in Laravel/Symfony

**Acceptance Criteria:**
- composer.json parsing detects all known service packages
- Laravel model scanning detects personal data fields
- At least 15 PHP-specific service signatures added
- Scanning a Laravel app produces meaningful compliance documents
- PHP scanning integrates with existing multi-language pipeline

**Dependencies:** v31.0 (language scanning pattern established with Ruby)

---

### v33.0 — Rust/Cargo.toml Scanning

**Scope:**
- Parse `Cargo.toml` and `Cargo.lock` for known Rust crates
- Add Rust service signatures (at least 10: stripe-rust, rusoto, aws-sdk-rust, reqwest, etc.)
- Scan `.rs` files for `use` statements matching known crate patterns
- Detect struct fields with personal data heuristics (same field name matching as other scanners)
- Support workspace `Cargo.toml` (multi-crate projects)

**Acceptance Criteria:**
- Cargo.toml parsing detects all known service crates
- Struct field scanning detects personal data fields
- At least 10 Rust-specific service signatures added
- Workspace projects scan all member crates
- Scan results merge correctly with other language scan results in polyglot repos

**Dependencies:** v32.0 (language scanning pattern refined)

---

### v34.0 — Java/Maven Scanning

**Scope:**
- Parse `pom.xml` for known Java dependencies (groupId:artifactId matching)
- Parse `build.gradle` / `build.gradle.kts` for Gradle dependencies
- Add Java service signatures (at least 15: stripe-java, aws-sdk-java, spring-boot-starter-mail, etc.)
- Detect JPA/Hibernate entity fields (`@Entity`, `@Column` annotations)
- Support multi-module Maven/Gradle projects

**Acceptance Criteria:**
- pom.xml and build.gradle parsing detects all known service dependencies
- JPA entity scanning detects personal data fields from `@Column` annotations and field names
- At least 15 Java-specific service signatures added
- Multi-module projects scan all modules
- Spring Boot application.properties/yml API key patterns detected

**Dependencies:** v33.0 (language scanning pattern mature)

---

### v35.0 — .NET/NuGet Scanning

**Scope:**
- Parse `.csproj` and `packages.config` for known NuGet packages
- Scan `.cs` files for `using` statements matching known namespaces
- Add .NET service signatures (at least 10: Stripe.net, AWSSDK, SendGrid, etc.)
- Detect Entity Framework model fields (`[Key]`, `[Required]`, property names)
- Support .NET solution files (`.sln`) for multi-project scanning

**Acceptance Criteria:**
- .csproj parsing detects all known NuGet packages
- Entity Framework model scanning detects personal data fields
- At least 10 .NET-specific service signatures added
- Solution-level scanning covers all projects in the solution
- PackageReference and packages.config formats both supported

**Dependencies:** v34.0 (language scanning pattern stable)

---

## Phase 7: Advanced Compliance (v36.0–v40.0)

### v36.0 — SOC 2 Compliance Notes

**Scope:**
- Generate SOC 2 readiness notes based on detected infrastructure (cloud providers, auth, logging)
- Cover all 5 Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy
- Map detected services to SOC 2 controls (e.g., Supabase auth → Access Controls)
- Generate `SOC2_READINESS.md` with actionable checklist
- Detect common SOC 2 gaps (no logging service, no auth provider, no encryption library)

**Acceptance Criteria:**
- SOC 2 readiness document generated when cloud/infrastructure services detected
- All 5 Trust Service Criteria sections present with relevant controls
- Checklist items are actionable (not generic: "Consider implementing X" → "Add logging with [detected option] for audit trail")
- Gap analysis correctly identifies missing security infrastructure
- Document clearly states this is readiness guidance, not SOC 2 certification

**Dependencies:** v22.0 (accurate service detection), v18.0 (data flow mapping for processing integrity)

---

### v37.0 — HIPAA Compliance Detection

**Scope:**
- Detect health-related data fields in schemas (diagnosis, prescription, medicalRecord, healthInsurance, etc.)
- Detect healthcare service integrations (health APIs, EHR systems)
- Generate `HIPAA_NOTES.md` with covered entity / business associate analysis
- PHI (Protected Health Information) inventory from detected fields
- BAA (Business Associate Agreement) requirement checklist

**Acceptance Criteria:**
- Health data fields detected in Prisma, Django, Rails, and Go models
- HIPAA notes generated only when health-related services or data fields detected
- PHI inventory lists all detected health data fields with storage location
- BAA checklist identifies which third-party services require a BAA
- Document includes clear disclaimer about HIPAA compliance requiring legal/expert review

**Dependencies:** v19.0 (Django model scanning), v20.0 (Go struct scanning), v31.0+ (multi-language scanning)

---

### v38.0 — PCI DSS Compliance for Payment Apps

**Scope:**
- Detect payment processing: Stripe, Braintree, PayPal, Square, Adyen integrations
- Scan for cardholder data fields (cardNumber, cvv, expirationDate) in schemas
- Generate `PCI_DSS_NOTES.md` with SAQ (Self-Assessment Questionnaire) type recommendation
- Detect PCI DSS scope reduction (tokenization via Stripe.js, hosted payment pages)
- Flag dangerous patterns: raw card data storage, unencrypted transmission

**Acceptance Criteria:**
- Payment services detected trigger PCI DSS notes generation
- SAQ type recommendation based on integration method (A, A-EP, D)
- Dangerous patterns (storing raw card numbers in database fields) flagged as critical warnings
- Scope reduction correctly identified when using hosted forms / tokenization
- Document clearly states PCI DSS compliance requires QSA assessment

**Dependencies:** v22.0 (accurate detection), v18.0 (data flow mapping for card data flows)

---

### v39.0 — COPPA Detection (Children's Privacy)

**Scope:**
- Detect age-gating fields (age, dateOfBirth, parentEmail, parentalConsent) in schemas
- Detect child-oriented service integrations (education APIs, kid-safe ad networks)
- Generate COPPA section in privacy policy when child data detected
- Verifiable parental consent mechanism recommendations
- COPPA-specific data retention rules (delete after purpose fulfilled)

**Acceptance Criteria:**
- Age-related fields in schemas trigger COPPA analysis
- Privacy policy includes COPPA section with parental consent requirements when triggered
- Recommendations specific to detected integration type (website vs. app vs. connected toy)
- False positive rate < 10% (age field in a bar app should not trigger COPPA)
- Document references FTC COPPA Rule (16 CFR Part 312) with correct citations

**Dependencies:** v22.0 (false positive methodology), v19.0+ (multi-language schema scanning)

---

### v40.0 — Industry-Specific Templates

**Scope:**
- Add industry detection heuristic based on service combination (payment + products = e-commerce, health fields = healthtech, education APIs = edtech)
- Industry templates: Fintech, Healthtech, Edtech, E-commerce, SaaS
- Each template adds industry-specific sections to privacy policy, terms of service
- Template selection via config (`industry: "fintech"`) or auto-detection
- Industry-specific compliance checklist (e.g., fintech: state money transmitter licenses)

**Acceptance Criteria:**
- Auto-detection correctly identifies industry for 70%+ of projects with clear service signals
- Each industry template adds at least 3 industry-specific sections
- Manual override via config takes precedence over auto-detection
- Industry templates compose with jurisdiction templates (fintech + GDPR + CCPA = combined output)
- Templates include industry-specific regulatory references

**Dependencies:** v36.0 (SOC 2), v37.0 (HIPAA), v38.0 (PCI DSS), v39.0 (COPPA) — industry templates reference these

---

## Phase 8: Scale & Launch (v41.0–v45.0)

### v41.0 — npm Package Optimization

**Scope:**
- Tree-shake unused code paths from published package
- Minimize package size: target < 500KB unpacked (currently ~2MB estimate)
- Audit and remove any unnecessary devDependencies that leak into package
- Add `exports` field to package.json for proper ESM tree-shaking by consumers
- Benchmark install time and first-run time

**Acceptance Criteria:**
- Published package size < 500KB unpacked
- `npm install codepliant` completes in < 5 seconds on broadband
- `npx codepliant go` first-run completes in < 10 seconds (download + scan + generate)
- No runtime dependencies (devDependencies only, except optional pdfmake)
- `exports` field correctly exposes public API, hides internals

**Dependencies:** v40.0 (all features complete before optimizing package)

---

### v42.0 — GitHub Repository Setup

**Scope:**
- Professional README with badges (npm version, CI status, license, downloads)
- CONTRIBUTING.md with development setup, PR guidelines, code style
- Issue templates: bug report, feature request, new language support
- PR template with checklist
- GitHub Actions CI: lint, test, build on every PR (Node 18/20/22 matrix)

**Acceptance Criteria:**
- README includes: one-liner description, quick start (3 commands), feature list, comparison table, architecture diagram
- CONTRIBUTING.md enables a new contributor to set up and submit a PR in < 15 minutes
- Issue templates have required fields that capture necessary debugging info
- CI runs on all supported Node versions and passes
- Repository has proper LICENSE file (MIT or Apache 2.0)

**Dependencies:** v41.0 (package optimized before publishing)

---

### v43.0 — Product Hunt Launch Prep

**Scope:**
- Product Hunt listing: tagline, description, screenshots, maker comment
- Launch day checklist: timing, community engagement plan, response templates
- Demo GIF / video showing scan → generate → review flow (< 60 seconds)
- Social proof: collect testimonials from beta testers
- Comparison page: Codepliant vs. Termly vs. iubenda vs. TermsFeed (feature matrix)

**Acceptance Criteria:**
- Product Hunt listing draft complete with all required assets
- Demo video clearly shows the value prop in < 60 seconds
- Comparison matrix is factually accurate (verified against competitor sites)
- Launch day plan includes timezone-optimized posting time and 12-hour engagement schedule
- Response templates cover: thank you, feature request, bug report, pricing question

**Dependencies:** v42.0 (GitHub repo must be public and polished)

---

### v44.0 — Landing Page / Website

**Scope:**
- Single-page marketing site: hero, features, demo, comparison, testimonials, CTA
- Built with same design system as v26.0 (Apple-style minimal)
- Live demo: paste a package.json, see generated privacy policy sections
- SEO optimized: meta tags, Open Graph, structured data
- Deploy to codepliant.dev (or similar domain)

**Acceptance Criteria:**
- Landing page loads in < 2 seconds (Lighthouse Performance > 95)
- Live demo works without backend (client-side WASM or JS bundle)
- Page has clear CTA: `npm install -g codepliant` with copy button
- SEO: appears in search results for "code-based privacy policy generator" within 30 days
- Mobile responsive, dark mode support

**Dependencies:** v43.0 (assets from PH prep reused), v26.0 (design system)

---

### v45.0 — Show HN Post

**Scope:**
- Draft Show HN post: title, description, key differentiators
- Prepare for HN traffic: ensure npm package handles concurrent installs, website handles load
- FAQ document for common HN questions (Why not use a lawyer? Is this legal advice? What about liability?)
- Performance benchmarks to cite (scan time, package size, zero dependencies)
- Engage with comments for 24 hours post-launch

**Acceptance Criteria:**
- Show HN post is < 300 words, leads with the problem, shows the solution
- Post includes: GitHub link, npm link, live demo link
- FAQ covers top 10 anticipated questions with honest, specific answers
- Package and website handle concurrent usage without degradation
- Post draft reviewed by at least 2 people before submission

**Dependencies:** v44.0 (website live), v42.0 (GitHub repo public)

---

## Phase 9: Community & Stability (v46.0–v50.0)

### v46.0 — Plugin System for Custom Scanners

**Scope:**
- Define plugin API: `CodepliantPlugin` interface with `scan()` and `generate()` hooks
- Plugin discovery: load from `node_modules` (packages named `codepliant-plugin-*`) and local `./plugins/` directory
- Plugin lifecycle: init → scan → merge results → generate → cleanup
- Example plugin: custom service signature scanner (scan for internal APIs by URL pattern)
- Plugin documentation and starter template

**Acceptance Criteria:**
- Plugin interface is documented with TypeScript types
- Plugins can add new service signatures, new scan targets, and new document sections
- Plugin scan results merge correctly with core scan results (no conflicts)
- Example plugin works end-to-end: install, configure, scan, verify custom results appear
- Core scanning is not affected when no plugins are installed (zero overhead)

**Dependencies:** v41.0 (package structure finalized), v14.0 (JSON output for plugin data exchange)

---

### v47.0 — Community-Contributed Service Signatures

**Scope:**
- Create `codepliant-signatures` repository: community-maintained service signature database
- Signature format: JSON files with name, category, importPatterns, envPatterns, dataCollected
- Auto-update mechanism: `codepliant update-signatures` pulls latest from repo
- Contribution guide: how to add a new service signature with testing instructions
- Review process: PR-based with automated validation

**Acceptance Criteria:**
- Signature repository contains 100+ service signatures (up from current ~30)
- `codepliant update-signatures` downloads and installs new signatures without reinstalling CLI
- Each signature has at least one test case (import pattern that should match)
- Community contributions can be submitted via GitHub PR with automated validation CI
- Offline fallback: bundled signatures used when no internet available

**Dependencies:** v46.0 (plugin system provides signature loading infrastructure)

---

### v48.0 — i18n — Multi-Language Document Generation

**Scope:**
- Generate compliance documents in multiple languages: English, Spanish, French, German, Portuguese, Japanese
- Translation framework: template strings with locale-specific content files
- Legal term accuracy: ensure translated legal terms are jurisdictionally correct (not just literal translation)
- `--locale` CLI flag and `locale` config option
- Right-to-left (RTL) support for Arabic in HTML output

**Acceptance Criteria:**
- Documents generated in all 6 supported languages
- Legal terms verified by native speakers or reference translations (EU official translations for GDPR)
- `--locale es` generates Spanish documents with correct legal terminology
- HTML output handles RTL layout correctly
- Locale detection from system when not specified (fallback to English)

**Dependencies:** v26.0 (HTML design supports RTL), v24.0 (template quality finalized before translation)

---

### v49.0 — Enterprise Features

**Scope:**
- Team config: shared `.codepliantrc.json` with org-level defaults and project-level overrides
- Audit trail: log every generation with timestamp, user, config hash, document hashes
- Config validation: JSON schema for `.codepliantrc.json` with IDE autocomplete support
- Bulk scanning: scan multiple projects from a manifest file
- Export audit trail as CSV for compliance officers

**Acceptance Criteria:**
- Org config merges correctly with project config (project overrides org)
- Audit trail stored in `.codepliant-audit.json` with append-only semantics
- JSON schema published and works with VS Code autocomplete for `.codepliantrc.json`
- Bulk scan of 10 projects produces per-project output directories
- CSV export includes: timestamp, project path, documents generated, services detected, config hash

**Dependencies:** v46.0 (plugin system for enterprise-specific scanners), v15.0 (versioning for audit trail)

---

### v50.0 — v1.0 Stable Release

**Scope:**
- Semantic versioning: lock public API surface, document breaking changes from v0.x
- Full regression test across all 100 repos from v21.0 test suite
- Performance benchmark: publish scan times for small/medium/large projects
- Migration guide from v0.x to v1.0
- Changelog covering all 50 development versions

**Acceptance Criteria:**
- All tests pass (unit, integration, 100-repo suite)
- No P0 or P1 bugs open
- Public API types exported and documented
- npm publish succeeds with `codepliant@1.0.0`
- Changelog is complete and accurate for all versions
- Migration guide covers all breaking changes with code examples

**Dependencies:** All previous versions (v6.0–v49.0)

---

## Bonus: Post-v50 Stretch Goals (v51.0–v55.0)

### v51.0 — VS Code Extension

**Scope:**
- VS Code extension that shows compliance status in sidebar
- Inline warnings when new services are imported without document regeneration
- One-click document generation from command palette
- Hover tooltips on service imports showing data collection info
- Extension marketplace listing

**Acceptance Criteria:**
- Extension installs from VS Code marketplace
- Sidebar shows detected services and document staleness
- Inline warning appears within 2 seconds of saving a file with new service import
- Command palette `Codepliant: Generate Documents` works end-to-end
- Extension adds < 50ms to VS Code startup time

**Dependencies:** v50.0 (stable API for extension to consume)

---

### v52.0 — Monorepo Support

**Scope:**
- Detect monorepo structures (npm workspaces, pnpm workspaces, Turborepo, Lerna, Nx)
- Per-package scanning with shared config inheritance
- Consolidated compliance page showing all packages
- Deduplication: shared services across packages listed once
- Workspace-aware `codepliant go` that scans all packages

**Acceptance Criteria:**
- Detects npm, pnpm, yarn workspaces from root package.json
- Each package gets its own scan results, shared services deduplicated
- Consolidated output optionally merges all packages into single document set
- Scan time scales linearly (not quadratically) with package count
- Works with at least 3 monorepo tools (npm workspaces, pnpm, Turborepo)

**Dependencies:** v50.0 (stable scanning pipeline)

---

### v53.0 — API Server Mode

**Scope:**
- `codepliant serve` starts an HTTP API server for programmatic access
- Endpoints: POST /scan (upload project zip), GET /documents, GET /status
- OpenAPI spec for all endpoints
- Rate limiting and request size limits
- Docker image for deployment

**Acceptance Criteria:**
- API server starts on configurable port (default 3000)
- POST /scan accepts zip file up to 100MB and returns scan results as JSON
- GET /documents returns generated documents in requested format
- OpenAPI spec is valid and generates correct client SDKs
- Docker image is < 200MB and starts in < 5 seconds

**Dependencies:** v50.0 (stable API), v14.0 (JSON output)

---

### v54.0 — AI-Powered Document Review

**Scope:**
- Optional LLM integration to review generated documents for quality and completeness
- Flag vague language, missing context, potential legal issues
- Suggest improvements based on industry best practices
- Review mode: `codepliant review` sends documents to configured LLM API
- Diff output: show suggested changes inline

**Acceptance Criteria:**
- Review works with OpenAI, Anthropic, and local Ollama models
- Review completes in < 30 seconds for a full document set
- Suggestions are actionable and specific (not generic)
- LLM integration is strictly opt-in (never sends data without explicit config)
- Review results saved as `REVIEW_NOTES.md` alongside generated documents

**Dependencies:** v50.0 (documents must be high quality before AI review adds value)

---

### v55.0 — Compliance-as-Code Framework

**Scope:**
- Define compliance rules as code: TypeScript functions that validate scan results against requirements
- Rule library: GDPR rules, CCPA rules, HIPAA rules, PCI DSS rules, AI Act rules
- Custom rule authoring: users write their own compliance checks
- CI integration: `codepliant check` returns pass/fail for each rule
- Dashboard integration: rules feed into compliance dashboard status

**Acceptance Criteria:**
- At least 50 built-in rules across 5 regulatory frameworks
- Custom rules can be defined in `.codepliant/rules/*.ts` files
- `codepliant check` exits with code 0 (all pass) or 1 (failures) for CI use
- Each rule has: ID, description, regulation reference, severity, auto-fix suggestion
- Rule results integrate with v27.0 dashboard and v8.0 GitHub Action

**Dependencies:** v50.0 (stable platform), v46.0 (plugin system for custom rules)
