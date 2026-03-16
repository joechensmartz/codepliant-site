# Overnight Progress: v261-270 (FINAL)

## Summary
AI Ethics Statement, Data Breach Response Drill, version-check command, list-docs command, version 270.0.0.

## Changes (v261-270)

### v261-265: New Generators

- **AI Ethics Statement** (`src/generator/ai-ethics-statement.ts`)
  - Generated when AI services detected
  - Aligned with UNESCO Recommendation on the Ethics of AI (2021)
  - Core principles: proportionality, fairness, transparency, accountability, privacy, human oversight, safety, sustainability
  - Human oversight commitments table with frequencies
  - UNESCO principle mapping table
  - AI Ethics Governance Structure with review process
  - Reporting concerns and redress mechanisms
  - Output: `AI_ETHICS_STATEMENT.md`

- **Data Breach Response Drill Template** (`src/generator/data-breach-response-drill.ts`)
  - Tabletop exercise template for breach response preparedness
  - Role assignments: Incident Commander, Technical Lead, DPO, Legal, Comms, Executive, IT Security, Customer Support, Observer
  - Context-aware scenarios: Credential Stuffing, Exposed Database, AI Data Leak, Supply Chain Compromise
  - Timed injects per scenario for realistic exercise flow
  - 7-phase exercise timeline with facilitator guidance
  - Discussion questions per incident response phase
  - Evaluation scoring rubric (8 criteria, 4-point scale, 32-point total)
  - After-action review template with gap tracking
  - Pre-drill preparation checklist
  - Output: `DATA_BREACH_DRILL_TEMPLATE.md`

### v266-268: New CLI Commands

- **`codepliant version-check` command**
  - Checks if a newer version is available on npm registry
  - Offline-safe: gracefully shows current version if npm unreachable
  - Supports `--json` output for CI/scripting
  - 5-second timeout to prevent blocking

- **`codepliant list-docs` command**
  - Lists ALL 86 document types codepliant can generate
  - Shows which ones apply to the current project (context-aware scan)
  - Shows which are already generated on disk
  - Color-coded status: green checkmark (generated), yellow circle (applicable), dim dot (n/a)
  - Supports `--json` output with full metadata

### v269-270: Version Bump & Final Polish
- Version bumped to 270.0.0 in package.json and CLI
- Generator index wired up with AI Ethics Statement and Data Breach Response Drill
- VERSION_HISTORY updated for migrate command
- DOC_PRIORITY updated for new document types
- Help text updated with new commands
- Build successful, all commands tested

## Files Changed
- `package.json` — version 260.0.0 -> 270.0.0
- `src/cli.ts` — version bump, version-check command, list-docs command, help text, VERSION_HISTORY, DOC_PRIORITY
- `src/generator/ai-ethics-statement.ts` — NEW: AI Ethics Statement generator
- `src/generator/data-breach-response-drill.ts` — NEW: Data Breach Response Drill generator
- `src/generator/index.ts` — wire up AI Ethics Statement and Data Breach Response Drill
- `overnight-progress.md` — updated with complete final summary

## Status: FINAL
All tasks complete. Ready for review.
