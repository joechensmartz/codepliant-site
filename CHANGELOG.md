# Changelog

All notable changes to Codepliant are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [50.0.0] - 2026-03-15

### Changed
- Final polish pass: CHANGELOG rewrite, landing page stats update, CLI help completeness
- Version bumped to v50.0 stable
- 564 tests across 100 suites, all passing

## [46.0.0 – 49.0.0] - 2026-03-15

### Added
- Wizard command for step-by-step compliance setup
- Notification system with Slack webhook support
- Multi-project `scan-all` and `generate-all` commands with project discovery
- Notion ZIP and Confluence XHTML export formats

### Changed
- Build errors fixed, notification test fixes
- 554+ tests passing

## [40.0.0] - 2026-03-15

### Added
- Slack webhook notifications (`notify` command)
- Multi-project scanning complete

## [38.0.0 – 39.0.0] - 2026-03-15

### Added
- Notion ZIP + Confluence XHTML export
- Multi-project `scan-all` / `generate-all` with project discovery
- Wizard stub

### Fixed
- Build errors, notification test fix

## [37.0.0] - 2026-03-15

### Added
- Cookie consent banner with Global Privacy Control (GPC) support
- Dark mode support for consent banner
- Apple-style design for consent UI

## [36.0.0] - 2026-03-15

### Added
- Compliance scoring engine (100-point scale, A–F letter grades)

## [30.0.0 – 35.0.0] - 2026-03-15

### Added
- AI Model Card generator
- Custom document templates (`template` command)
- Environment variable `.env.example` generation (`env` command)
- Compliance report generator (`report` command)
- Employee privacy notice
- 535+ tests all passing

### Changed
- Precision verified at 97.8% — 88/90 true positives across 7 repos

## [26.0.0 – 29.0.0] - 2026-03-15

### Added
- Employee privacy documentation
- 527 tests across all suites

### Fixed
- Test stability improvements

## [21.0.0 – 25.0.0] - 2026-03-15

### Added
- HTTP API server (`serve` command)
- Compliance scoring system
- 25+ document types total
- Compliance dashboard (`dashboard` command)
- Comprehensive compliance report generation
- 8 major features spanning API server to compliance reports

### Changed
- Massive expansion of scanning and generation capabilities

## [20.0.0] - 2026-03-15

### Added
- OpenAPI specification scanning
- Infrastructure scanning
- Data classification engine
- Vulnerability scanner
- Launch content and marketing assets

### Changed
- Precision pushed above 95%

## [18.0.0] - 2026-03-15

### Added
- 4 ORM scanners (TypeORM, Sequelize, Prisma enhanced, SQLAlchemy enhanced)
- GraphQL schema scanning
- Compliance dashboard view

### Changed
- Precision at 80%, cross-ecosystem bleed eliminated
- 10-repo retest: 83% precision, 14.4 services/repo average

## [17.0.0] - 2026-03-15

### Added
- Zod/tRPC extraction
- TypeORM and Sequelize scanning
- 21 new service signatures
- Legal language polish

### Changed
- Config schema finalized

## [16.0.0] - 2026-03-15

### Changed
- Investor-ready polish: demo bugs fixed, hardened CLI, pitch-ready output

## [15.0.0] - 2026-03-15

### Added
- SOC 2 readiness document generator
- Privacy Impact Assessment (PIA) generator
- Risk assessment document
- VS Code extension support

### Fixed
- Demo-related bugs

## [14.0.0] - 2026-03-15

### Added
- Data Retention Policy generator
- Incident Response Plan generator (GDPR 72h notification)
- DSAR Handling Guide (6 request types, templates, data location map)
- Consent Management Guide (cookie banner code, GPC, PostHog/GA examples)
- 14 document types total

### Changed
- Complete README rewrite reflecting all v1–v14 features
- Detection accuracy improved to 85% compliance score
- 354 tests across 51 suites

## [13.0.0] - 2026-03-15

### Added
- Go struct scanning for personal data fields
- SQLAlchemy model scanning (`Column`/`mapped_column`)
- Accessibility audit (WCAG/ADA tooling + ARIA detection)
- Environment variable audit with security categorization
- COPPA children's privacy detection
- Accessibility compliance recommendations

### Changed
- SECURITY.md improvements with HIPAA/PCI industry-specific notes
- 289 tests across 48 suites

## [12.0.0] - 2026-03-15

### Added
- 15 new Python signatures (Django, FastAPI, Celery, Tortoise-ORM, etc.)
- 13 new Java/Maven signatures + multi-module `pom.xml` scanning
- Framework-implicit service detection (Rails, Django, Laravel, Express)
- Kotlin DSL Gradle support
- `--version` / `-V` flag
- Per-command `--help` with examples
- Grouped CLI command categories
- Landing page

### Changed
- Detection accuracy improved: Django 50–80%, Java 30–60%, Ruby 85–95%, Laravel 60–85%
- 264 tests across 41 suites

## [11.0.0] - 2026-03-15

### Added
- Compliance Page: single HTML with tab navigation, search, Apple-style design, dark mode, print-friendly
- HIPAA detection (health packages, env vars, source patterns)
- PCI DSS detection (card fields, payment service flagging)
- SECURITY.md generator (10th document type) with auth/payment/AI-specific sections
- Plugin system (`CodepliantPlugin` interface for custom scanners/generators)
- Plugin loader (local paths, `node_modules`, convention names)

### Changed
- Industry compliance auto-added to Compliance Notes for HIPAA/PCI
- 249 tests across 40 suites

## [10.0.0] - 2026-03-15

### Added
- npm publish configuration (exports, repository, 17 keywords)
- `LICENSE` (MIT), `CONTRIBUTING.md`, `.npmignore`
- Example projects: `examples/nextjs-saas/` and `examples/django-app/`
- Launch research: Product Hunt, Show HN, npm launch checklists

### Changed
- README rewritten for launch (10 ecosystems, 9 docs, 6 formats)
- 220 tests across 35 suites
- GDPR Art. 13 all 13 clauses verified

## [9.0.0] - 2026-03-15

### Added
- Section customization via `sectionOverrides` in config
- JSON structured output (`compliance.json`)
- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Data Flow Map (`DATA_FLOW_MAP.md`)
- Interactive init wizard (4 steps, auto-scan after setup)
- `--verbose` flag with per-scanner timing
- 9 document types total, 6 output formats

### Changed
- Data flow synthesis integrated into Privacy Policy
- Shared file-walker for single directory traversal
- Pre-compiled regex cache for performance

## [8.0.0] - 2026-03-15

### Added
- GitHub Action PR bot with sticky comments and compliance score
- Dog-fooding CI workflow (build, test, self-scan)
- Compliance badge SVG generation (shields.io flat style)
- Pre-commit hook support (husky/lefthook/raw git hooks)
- Java/Maven ecosystem (`pom.xml` + `build.gradle`)
- .NET/NuGet ecosystem (`*.csproj` PackageReference)
- Django model scanning (`models.py` personal data fields)
- `codepliant diff` command (show changes since last generation)
- `DOCUMENT_CHANGELOG.md` auto-appended on every generation

### Changed
- 10 ecosystems supported, 7 document types, 5 output formats
- 180 tests across 29 suites

## [7.0.0] - 2026-03-15

### Added
- MCP Server production-ready: 7 tools, `compliance_status` resource, typed errors, 30s timeout
- Progress indicators, scan duration, document size info
- `codepliant check` command (CI pass/fail)
- PDF output (print-ready HTML with auto-print)
- Embeddable widget (footer bar + modal, self-contained JS)
- API route scanning (Next.js App/Pages, Express, Fastify POST endpoints)
- Tracking pixel detection (GA, FB Pixel, Hotjar, Clarity, TikTok, etc.)
- PHP/Composer scanning (11 signatures)
- Rust/Cargo scanning (12 signatures)

### Changed
- ToS improvements: indemnification, arbitration, force majeure, severability
- Cookie Policy: ePrivacy Art. 5(3), prior-consent language
- Auto-incrementing section numbers in all generators
- Color-coded compliance score and actionable error messages
- 145 tests, 8 ecosystems, 7 document types, 5 output formats

## [6.0.0] - 2026-03-15

### Added
- Ruby/Gemfile scanning (18 gem signatures)
- Elixir/mix.exs scanning (8 hex signatures)
- 25+ new JS/TS signatures (Google APIs, Vercel AI SDK, Redis, Plaid, Datadog, etc.)
- Apple-style HTML output (680px single column, zero JS, SF Pro, dark mode, print-friendly)
- CCPA Right to Correct (CPRA 1798.106)
- CCPA Categories of Sources, Business/Commercial Purpose
- CCPA toll-free number placeholder
- Automated decision-making logic description (GDPR Art. 13.2(f))

### Fixed
- CCPA compliance improved toward 80%+
- Detection accuracy improved from 47% toward 75%+
- Prisma schema scanning fixes
- Ruby/Elixir/Prisma scanners properly wired into index.ts

## [5.0.0] - 2026-03-15

### Added
- HTML output: self-contained page with sidebar nav, TOC, dark/light mode, responsive, print-friendly
- Built-in Markdown-to-HTML converter (zero dependencies)
- `--format` flag: `markdown`, `html`, `all`
- Prisma schema scanning: 21 personal data field patterns across 6 categories
- Regulation source texts and compliance matrix

### Changed
- 107 tests passing
- Real-world testing: 47% detection accuracy (100% precision, 0 false positives)

## [4.0.0] - 2026-03-15

### Added
- CCPA/CPRA compliance: Do Not Sell section, CA consumer rights, PI categories
- UK GDPR support: ICO as supervisory authority, IDTA for international transfers
- Auto-detect jurisdiction: CCPA added when analytics detected
- Global Privacy Control (GPC) in Cookie Policy
- `COMPLIANCE_NOTES.md` generator: jurisdiction applicability and action items
- Config fields: `jurisdictions[]`, `companyLocation`

### Fixed
- Missing `compliance-notes.ts` generator created
- All 5 jurisdiction scenarios verified
- 100 tests passing

## [3.0.0] - 2026-03-15

### Added
- Complete rewrite of AI Disclosure with 11 sections covering EU AI Act Article 50
- AI Systems Inventory (auto-generated table)
- Risk classification (minimal/limited/high auto-detection)
- Transparency Obligations (Art. 50(1)–(5))
- Synthetic Content Marking (Art. 50(2) machine-readable)
- Human Oversight documentation and review request process
- 7 specific user rights for AI systems
- AI Provider Policies with actual URLs
- `AI_ACT_CHECKLIST.md` standalone compliance checklist
- 6 document types, 100 tests passing

## [2.0.0] - 2026-03-15

### Added
- DPO contact section (Art. 13(1)(b))
- Legal basis per purpose table (Art. 13(1)(c)/(d))
- International data transfers (Art. 13(1)(f))
- Right to withdraw consent (Art. 13(2)(c))
- Automated decision-making section (Art. 13(2)(f))
- Data provision requirements (Art. 13(2)(e))
- Data retention recommendations per service type
- EU Representative support in config

### Changed
- Complete rewrite of Privacy Policy generator covering all 12 GDPR Art. 13 clauses
- Privacy policy expanded from 131 to 220 lines
- Auto-incrementing section numbers

## [1.0.0] - 2026-03-15

### Added
- 3 ecosystems: JS/TS, Python, Go
- 100+ service signatures
- 5 compliance documents: Privacy Policy, ToS, AI Disclosure, Cookie Policy, DPA
- MCP server, GitHub Action, watch mode, config system
- 100 tests passing

### Fixed
- DATABASE_URL no longer triggers multiple ORM detections
- Import scanner no longer matches string literals as imports
- CLI validates project path is a directory before scanning
- Scoped packages use exact match
- MCP server loads `.codepliantrc.json` config

## [0.1.0] - 2026-03-15

### Added
- Initial release: CLI tool that scans codebases and generates compliance documents
- 3-layer scanner: `package.json` deps, source imports, `.env` files
- 30+ service signatures (AI, payment, analytics, auth, email, etc.)
- 4 document generators: Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy
- MCP server with 3 tools for AI coding tool integration
- `codepliant init` command with interactive setup
- `.codepliantrc.json` config file support
- Python ecosystem: `requirements.txt`, `pyproject.toml`, `Pipfile` scanning
- Go ecosystem: `go.mod` scanning (17+ Go package signatures)
- DPA generator (GDPR Article 28)
- GitHub Action for CI/CD compliance checking
- Watch mode (`--watch` flag)
- 28 unit + integration tests
