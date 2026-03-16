import * as vscode from "vscode";

// Codepliant library — imported as ESM, types used for reference
// In production build this resolves to the codepliant npm package
import type { ScanResult, DetectedService } from "codepliant";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let statusBarItem: vscode.StatusBarItem;
let lastScanResult: ScanResult | undefined;
let scanDebounceTimer: NodeJS.Timeout | undefined;

// Files that trigger a re-scan on save
const TRIGGER_FILES = [
  "package.json",
  "package-lock.json",
  ".env",
  ".env.local",
  ".env.production",
  "codepliant.config.json",
  ".codepliantrc.json",
];

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

export function activate(context: vscode.ExtensionContext) {
  // Status bar
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    50,
  );
  statusBarItem.command = "codepliant.check";
  statusBarItem.text = "$(shield) Codepliant";
  statusBarItem.tooltip = "Click to check compliance status";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("codepliant.scan", cmdScan),
    vscode.commands.registerCommand("codepliant.generate", cmdGenerate),
    vscode.commands.registerCommand("codepliant.check", cmdCheck),
  );

  // Auto-scan on workspace open
  const config = vscode.workspace.getConfiguration("codepliant");
  if (config.get<boolean>("scanOnOpen", true)) {
    runScan({ silent: true });
  }

  // Re-scan on relevant file saves
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (!config.get<boolean>("scanOnSave", true)) return;

      const fileName = doc.uri.path.split("/").pop() ?? "";
      if (TRIGGER_FILES.includes(fileName)) {
        debouncedScan();
      }
    }),
  );
}

export function deactivate() {
  if (scanDebounceTimer) clearTimeout(scanDebounceTimer);
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdScan() {
  await runScan({ silent: false });
}

async function cmdGenerate() {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  if (!lastScanResult) {
    await runScan({ silent: true });
  }

  const config = vscode.workspace.getConfiguration("codepliant");
  const format = config.get<string>("outputFormat", "markdown");

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Codepliant: Generating compliance documents...",
      cancellable: false,
    },
    async () => {
      try {
        // Dynamic import — codepliant is ESM
        const { generateDocuments, writeDocuments } = await import("codepliant");
        const { writeDocumentsInFormat } = await import("codepliant/output");

        const docs = generateDocuments(lastScanResult!);

        if (format === "html") {
          await writeDocumentsInFormat(docs, workspacePath, "html");
        } else {
          await writeDocuments(docs, workspacePath);
        }

        vscode.window.showInformationMessage(
          `Codepliant: Generated ${docs.length} compliance document(s) in ${workspacePath}/compliance/`,
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          `Codepliant: Generation failed — ${(err as Error).message}`,
        );
      }
    },
  );
}

async function cmdCheck() {
  if (!lastScanResult) {
    await runScan({ silent: true });
  }

  if (!lastScanResult) {
    vscode.window.showWarningMessage(
      "Codepliant: No scan results available. Open a workspace first.",
    );
    return;
  }

  const needs = lastScanResult.complianceNeeds;
  const services = lastScanResult.services;

  const items: string[] = [
    `Project: ${lastScanResult.projectName}`,
    `Services detected: ${services.length}`,
    `Compliance needs: ${needs.map((n) => n.document).join(", ") || "None"}`,
    "",
    ...services.map(
      (s: DetectedService) =>
        `$(circle-filled) ${s.name} (${s.category}) — collects: ${s.dataCollected.join(", ")}`,
    ),
  ];

  const panel = vscode.window.createOutputChannel("Codepliant");
  panel.clear();
  items.forEach((line) => panel.appendLine(line));
  panel.show();
}

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

async function runScan(opts: { silent: boolean }) {
  const workspacePath = getWorkspacePath();
  if (!workspacePath) return;

  updateStatusBar("scanning");

  try {
    // Dynamic import — codepliant is ESM
    const { scan } = await import("codepliant");
    lastScanResult = await scan(workspacePath);

    const serviceCount = lastScanResult.services.length;
    const needCount = lastScanResult.complianceNeeds.length;

    updateStatusBar(needCount === 0 ? "green" : needCount <= 2 ? "yellow" : "red");

    if (!opts.silent) {
      vscode.window.showInformationMessage(
        `Codepliant: Found ${serviceCount} service(s), ${needCount} compliance need(s).`,
      );
    }
  } catch (err) {
    updateStatusBar("error");
    if (!opts.silent) {
      vscode.window.showErrorMessage(
        `Codepliant: Scan failed — ${(err as Error).message}`,
      );
    }
  }
}

function debouncedScan() {
  if (scanDebounceTimer) clearTimeout(scanDebounceTimer);
  scanDebounceTimer = setTimeout(() => runScan({ silent: true }), 1500);
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

type StatusState = "scanning" | "green" | "yellow" | "red" | "error";

function updateStatusBar(state: StatusState) {
  switch (state) {
    case "scanning":
      statusBarItem.text = "$(sync~spin) Codepliant";
      statusBarItem.tooltip = "Scanning workspace...";
      statusBarItem.backgroundColor = undefined;
      break;
    case "green":
      statusBarItem.text = "$(check) Codepliant";
      statusBarItem.tooltip = "All compliance documents up to date";
      statusBarItem.backgroundColor = undefined;
      break;
    case "yellow":
      statusBarItem.text = "$(warning) Codepliant";
      statusBarItem.tooltip = "Some compliance documents may need updating";
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      break;
    case "red":
      statusBarItem.text = "$(error) Codepliant";
      statusBarItem.tooltip = "Compliance documents need attention";
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.errorBackground",
      );
      break;
    case "error":
      statusBarItem.text = "$(error) Codepliant";
      statusBarItem.tooltip = "Scan failed — click to retry";
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.errorBackground",
      );
      break;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWorkspacePath(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage("Codepliant: No workspace folder open.");
    return undefined;
  }
  return folders[0].uri.fsPath;
}
