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

## Website Design

### Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS with CSS custom properties for spacing/typography tokens
- Fonts: Outfit (display/headings), Source Sans 3 (body)
- Static export for most pages; dynamic routes only for OG images
- `next.config.ts` ignores TS and ESLint errors during build

### Layout
- `src/app/layout.tsx` — root layout with sticky header, skip-to-content link, footer with CTA + 4-column nav
- Mobile nav uses `<details>` hamburger (no JS framework needed)
- Max content width: 960px (`max-w-[960px]`)
- JSON-LD structured data: Organization, WebSite (layout), SoftwareApplication + BreadcrumbList (home)

### Pages (24 routes)
- **Home** (`/`) — hero, proof points, install steps, JSON-LD SoftwareApplication
- **Product**: `/pricing`, `/compare`, `/docs`, `/changelog`, `/about`
- **Generators**: `/privacy-policy-generator`, `/terms-of-service-generator`, `/cookie-policy-generator`, `/ai-disclosure-generator`
- **Compliance landing pages**: `/gdpr-compliance`, `/soc2-compliance`, `/hipaa-compliance`, `/ai-governance`, `/data-privacy`
- **Blog** (`/blog`) + 7 articles (each with dedicated OG image route)

### SEO / OG
- Per-page metadata via `export const metadata`
- Dynamic OG images generated in `src/app/og/` utilities and per-route `opengraph-image.tsx` files
- `src/app/icon.tsx`, `apple-icon.tsx`, `twitter-image.tsx` for favicons and social cards
- `robots.ts`, `sitemap.ts`, `manifest.ts` all present

### Design Tokens
- Spacing via `var(--space-N)` custom properties
- Typography via `var(--text-sm)`, `var(--text-base)`, etc.
- Color semantics: `text-ink`, `text-ink-secondary`, `text-ink-tertiary`, `bg-surface-primary`, `bg-surface-secondary`, `border-border-subtle`, `bg-code-bg`, `text-code-fg`
- Transition easing: `var(--ease-out-quart)`

### Build
```bash
# CLI build (TypeScript only)
npm run build        # tsc -p tsconfig.cli.json

# Full site build (Next.js)
npx next build
```
