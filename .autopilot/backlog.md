# Backlog

## Priority 1 (v0.2 — next)
- [x] Python ecosystem support: scan `requirements.txt`, `pyproject.toml`, `Pipfile`
- [x] `codepliant init` command — interactive setup for company name, email, jurisdiction
- [x] Config file support (`.codepliantrc.json`) — persist settings
- [x] MCP server with 3 tools
- [ ] More service signatures: Twilio, Mailchimp, Intercom, Zendesk, Segment, LaunchDarkly, Firebase
- [ ] Python import scanning (detect `import openai` in .py files)

## Priority 2 (v0.3)
- [ ] Go ecosystem support: scan `go.mod` for known packages
- [ ] GDPR-specific document template improvements (Data Processing Agreement)
- [ ] CCPA-specific sections in Privacy Policy
- [ ] `--watch` mode — re-scan and update documents when code changes
- [ ] GitHub Action for CI/CD

## Priority 3 (v0.4+)
- [ ] GitHub App — auto-comment on PRs when new services are added
- [ ] Database schema scanning (Prisma schema → detect stored fields)
- [ ] Custom service signature definitions
- [ ] Multi-language document output
- [ ] Compliance score / dashboard
