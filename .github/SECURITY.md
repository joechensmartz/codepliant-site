# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | Yes                |
| < Latest | No                |

We recommend always using the latest version of Codepliant.

## Design principles

Codepliant is designed with security in mind:

- **Zero network calls.** The tool runs entirely offline. No data leaves your machine.
- **Zero runtime dependencies.** Fewer dependencies means a smaller attack surface.
- **Read-only analysis.** Codepliant only reads your codebase. It never modifies source files.
- **No secrets in output.** Scanned environment variable names are logged, but values are never read or stored.

## Reporting a vulnerability

If you discover a security vulnerability in Codepliant, please report it responsibly.

**Do not open a public issue.**

Instead, email **security@codepliant.dev** with:

1. A description of the vulnerability
2. Steps to reproduce
3. The potential impact
4. Any suggested fix (optional)

We will acknowledge your report within 48 hours and aim to provide a fix or mitigation within 7 days for confirmed issues.

## Scope

The following are in scope:

- The Codepliant CLI (`codepliant`)
- The MCP server (`codepliant-mcp`)
- The GitHub Action (`codepliant/codepliant`)
- Generated document content that could mislead users about their compliance posture

The following are out of scope:

- Vulnerabilities in projects that Codepliant scans (those are the user's responsibility)
- The accuracy of generated legal documents (these are drafts requiring legal review, as stated in every output)

## Acknowledgments

We appreciate responsible disclosure and will credit reporters in release notes (unless you prefer to remain anonymous).
