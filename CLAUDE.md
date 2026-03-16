# Codepliant

## Project Overview
Open-source CLI tool that scans codebases and generates compliance documents (Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy) based on actual code analysis.

## Tech Stack
- TypeScript (strict mode)
- Node.js (ESM modules)
- No database, no external dependencies at runtime
- Build: `tsc`
- Run: `node dist/cli.js` or `tsx src/cli.ts`

## Health Check
```bash
# Build
npx tsc

# Test against a real project
node dist/cli.js go /path/to/project

# JSON output
node dist/cli.js scan /path/to/project --json
```

## Project Structure
```
src/
├── cli.ts              # CLI entry point
├── index.ts            # Public API exports
├── scanner/
│   ├── types.ts        # Service signatures & types
│   ├── dependencies.ts # package.json scanner
│   ├── imports.ts      # Source code import scanner
│   ├── env.ts          # .env file scanner
│   └── index.ts        # Main scanner (combines all)
└── generator/
    ├── index.ts         # Document generation orchestrator
    ├── privacy-policy.ts
    ├── terms-of-service.ts
    ├── ai-disclosure.ts
    └── cookie-policy.ts
```

## Quality Red Lines
- Zero network calls — everything runs locally
- No runtime dependencies — only devDependencies
- Build must pass before any push
- All service detections must be deterministic (no AI/LLM)
- Generated documents must include disclaimer about legal review

## Adding a New Service Signature
Edit `src/scanner/types.ts` → `SERVICE_SIGNATURES` object. Each entry needs:
- `category`: ServiceCategory
- `dataCollected`: string[] — what data this service typically collects
- `envPatterns`: string[] — env var names to look for
- `importPatterns`: string[] — import/require patterns to match
