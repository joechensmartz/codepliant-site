# Codepliant for VS Code

Scan your codebase and generate compliance documents directly from your editor.

Codepliant detects third-party services, data collection patterns, and AI usage in your project, then generates the compliance documents you actually need: Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy, and more.

## Features

- **Auto-scan on open** — status bar shows compliance health as soon as you open a workspace
- **Re-scan on save** — updating `package.json`, `.env`, or config files triggers a fresh scan
- **Generate documents** — produce compliance docs in Markdown or HTML with one command
- **Status bar indicator** — green (all good), yellow (needs review), red (action required)

## Commands

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and type "Codepliant":

| Command | Description |
|---------|-------------|
| `Codepliant: Scan Workspace` | Run a full scan of the current workspace |
| `Codepliant: Generate Compliance Documents` | Generate documents based on the latest scan |
| `Codepliant: Check Compliance Status` | View detected services and compliance needs |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `codepliant.scanOnOpen` | `true` | Auto-scan when a workspace opens |
| `codepliant.scanOnSave` | `true` | Re-scan when relevant files are saved |
| `codepliant.outputFormat` | `markdown` | Output format: `markdown` or `html` |

## How it works

1. Codepliant scans your `package.json`, source imports, and `.env` files
2. It identifies third-party services (Stripe, Google Analytics, OpenAI, etc.)
3. It determines what data those services collect
4. It generates compliance documents based on your actual stack

Everything runs locally. No data leaves your machine.

## Requirements

- VS Code 1.85+
- Node.js 18+

## Links

- [Codepliant on GitHub](https://github.com/codepliant/codepliant)
- [Codepliant on npm](https://www.npmjs.com/package/codepliant)
