# Technical Decisions

## Generated: 2026-03-15
## Project: Codepliant

### Users & Scenarios
- Target users: SaaS developers / technical teams who write code but don't know legal compliance
- Core scenario: After writing code, run one command to generate all needed compliance documents
- Devices: Terminal / CLI (developers)
- Expected scale: Open source, targeting thousands of developers
- Key pain point: Existing tools (Termly, Iubenda) use questionnaires; Correctify scans actual code

### Tech Stack
| Component | Choice | Reason |
|-----------|--------|--------|
| Language | TypeScript | Developer ecosystem, npm distribution |
| Runtime | Node.js | Universal, npx support |
| Database | None | CLI tool, no persistence needed |
| Cache | None | Not needed |
| Auth | None | CLI tool, no accounts |
| Deployment | npm registry | `npx correctify go` |
| LLM | None for MVP | Deterministic scanning via AST/regex, no AI dependency |
| MCP | @modelcontextprotocol/sdk | Secondary entry point for AI tool integration |

### Performance Targets
- Scan time: < 5 seconds for typical project (< 1000 files)
- Zero network calls (fully offline, local scanning)

### Code Quality
- Language: TypeScript strict mode
- Testing: Vitest for core scanning logic
- Lint: Biome (fast, all-in-one)
- Error handling: Graceful degradation (skip unreadable files, continue scanning)

### Data Strategy
- Data source: Local filesystem (user's project)
- No data leaves the machine
- Privacy: Zero telemetry, zero network calls

### MVP Scope
Must have:
- Scan package.json dependencies → detect services (AI, payment, analytics, auth, etc.)
- Scan source code imports → detect API calls and data collection patterns
- Scan .env/.env.example → detect service keys
- Generate compliance documents: Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy
- Write documents to /legal/ directory in user's project
- CLI entry: `npx correctify go`

Not doing (later):
- MCP server (Phase 2)
- GitHub App integration
- Web dashboard
- Auto-detection of database schema
- Multi-language support (start with English docs only)
- CI/CD integration

### Decision Principles
- Keep it simple, no over-engineering
- Deterministic scanning (no AI/LLM for detection)
- Offline-first (no network calls)
- Convention over configuration (smart defaults, zero config)
