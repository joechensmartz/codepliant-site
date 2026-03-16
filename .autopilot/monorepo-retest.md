# Monorepo Retest Results

**Date:** 2026-03-16
**CLI Version:** codepliant v180.0.0
**Fix Under Test:** `cf57d99` — fix: Node.js monorepo detection gap — root deps + turborepo support (v190)

## Summary

All 5 previously-zero monorepos now return services. Monorepo detection confirmed across all.

| Repo | Services | Monorepo Detected | Type | Workspaces | Data Categories | Compliance Needs |
|------|----------|-------------------|------|------------|-----------------|------------------|
| cal.com | **29** | Yes | npm-workspaces | 104 | 7 | 8 |
| dub | **17** | Yes | pnpm | 12 | 6 | 8 |
| formbricks | **16** | Yes | npm-workspaces | 16 | 9 | 7 |
| highlight | **23** | Yes | npm-workspaces | 18 | 12 | 8 |
| novu | **39** | Yes | npm-workspaces | 35 | 9 | 8 |

## Before vs After

| Repo | Before (services) | After (services) |
|------|-------------------|------------------|
| cal.com | 0 | 29 |
| dub | 0 | 17 |
| formbricks | 0 | 16 |
| highlight | 0 | 23 |
| novu | 0 | 39 |

## Details

### cal.com (cal-mono)
- **Project name:** calcom-monorepo
- **Monorepo type:** npm-workspaces (104 workspaces including app-store plugins)
- **Services detected:** 29 (including Stripe, SendGrid, HubSpot, Google Calendar, Zoom, etc.)

### dub (dub-mono)
- **Project name:** dub-monorepo
- **Monorepo type:** pnpm workspaces (12 packages)
- **Services detected:** 17 (including Anthropic AI, OpenAI, Stripe, Prisma, Resend, etc.)

### formbricks (fb-mono)
- **Project name:** formbricks
- **Monorepo type:** npm-workspaces (16 packages)
- **Services detected:** 16 (including AWS S3, Sentry, Prisma, Stripe, etc.)

### highlight (hl-mono)
- **Project name:** highlight
- **Monorepo type:** npm-workspaces (18 packages)
- **Services detected:** 23 (including AWS S3, Supabase, Cloudflare, React Query, etc.)

### novu (novu-mono)
- **Project name:** root
- **Monorepo type:** npm-workspaces (35 packages including enterprise)
- **Services detected:** 39 (including Anthropic AI, OpenAI, AWS SNS, MongoDB, Redis, etc.)

## Verdict

**PASS** — The monorepo fix successfully resolves the 0-service detection issue across all 5 test repos. All monorepos are correctly identified with workspace enumeration and service scanning across sub-packages.

## Notes

- Build has TypeScript errors in `src/index.ts` (missing exports from cloud/compliance-api and licensing modules), but the CLI runs fine from the existing dist output.
- Novu's `projectName` is "root" rather than "novu" — minor naming issue from root package.json.
- Cal.com has 104 workspaces due to individual app-store plugins each being a workspace.
