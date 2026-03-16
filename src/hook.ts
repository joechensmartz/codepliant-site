// Hook installation/uninstallation for pre-commit integration
// Supports: husky, lefthook, and raw .git/hooks

import * as fs from "fs";
import * as path from "path";

const HOOK_MARKER = "# codepliant-hook";
const HOOK_SCRIPT = `#!/bin/sh
${HOOK_MARKER}
npx codepliant check --quiet
if [ $? -ne 0 ]; then
  echo ""
  echo "Compliance docs need updating. Run: npx codepliant go"
  echo ""
  exit 1
fi
`;

const LEFTHOOK_SNIPPET = `# Codepliant pre-commit hook
pre-commit:
  commands:
    codepliant:
      run: npx codepliant check --quiet
      fail_text: "Compliance docs need updating. Run: npx codepliant go"
`;

export interface HookInstallResult {
  installed: boolean;
  hookType: "husky" | "lefthook" | "git";
  path: string;
  message: string;
}

export interface HookUninstallResult {
  uninstalled: boolean;
  message: string;
}

function hasHusky(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, ".husky"));
}

function hasLefthook(projectPath: string): boolean {
  return (
    fs.existsSync(path.join(projectPath, "lefthook.yml")) ||
    fs.existsSync(path.join(projectPath, ".lefthook.yml"))
  );
}

function hasGitDir(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, ".git"));
}

function isCodepliantHook(content: string): boolean {
  return content.includes(HOOK_MARKER);
}

export function installHook(projectPath: string): HookInstallResult {
  // Priority: husky > lefthook > .git/hooks
  if (hasHusky(projectPath)) {
    return installHuskyHook(projectPath);
  }

  if (hasLefthook(projectPath)) {
    return installLefthookHook(projectPath);
  }

  if (hasGitDir(projectPath)) {
    return installGitHook(projectPath);
  }

  return {
    installed: false,
    hookType: "git",
    path: "",
    message: "No .git directory, .husky directory, or lefthook config found. Initialize a git repo first.",
  };
}

function installHuskyHook(projectPath: string): HookInstallResult {
  const huskyDir = path.join(projectPath, ".husky");
  const hookPath = path.join(huskyDir, "pre-commit");

  // If hook already exists, check if it's ours or append
  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, "utf-8");
    if (isCodepliantHook(existing)) {
      return {
        installed: true,
        hookType: "husky",
        path: hookPath,
        message: "Codepliant hook already installed in .husky/pre-commit.",
      };
    }
    // Append our check to the existing hook
    const appendScript = `\n${HOOK_MARKER}\nnpx codepliant check --quiet\nif [ $? -ne 0 ]; then\n  echo ""\n  echo "Compliance docs need updating. Run: npx codepliant go"\n  echo ""\n  exit 1\nfi\n`;
    fs.appendFileSync(hookPath, appendScript);
    return {
      installed: true,
      hookType: "husky",
      path: hookPath,
      message: "Codepliant hook appended to existing .husky/pre-commit.",
    };
  }

  fs.writeFileSync(hookPath, HOOK_SCRIPT, { mode: 0o755 });
  return {
    installed: true,
    hookType: "husky",
    path: hookPath,
    message: "Codepliant hook installed at .husky/pre-commit.",
  };
}

function installLefthookHook(projectPath: string): HookInstallResult {
  // Determine which config file exists
  const ymlPath = fs.existsSync(path.join(projectPath, "lefthook.yml"))
    ? path.join(projectPath, "lefthook.yml")
    : path.join(projectPath, ".lefthook.yml");

  const existing = fs.readFileSync(ymlPath, "utf-8");
  if (existing.includes("codepliant")) {
    return {
      installed: true,
      hookType: "lefthook",
      path: ymlPath,
      message: "Codepliant hook already present in lefthook config.",
    };
  }

  // Append codepliant snippet
  fs.appendFileSync(ymlPath, `\n${LEFTHOOK_SNIPPET}`);
  return {
    installed: true,
    hookType: "lefthook",
    path: ymlPath,
    message: `Codepliant pre-commit hook added to ${path.basename(ymlPath)}.`,
  };
}

function installGitHook(projectPath: string): HookInstallResult {
  const hooksDir = path.join(projectPath, ".git", "hooks");
  const hookPath = path.join(hooksDir, "pre-commit");

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, "utf-8");
    if (isCodepliantHook(existing)) {
      return {
        installed: true,
        hookType: "git",
        path: hookPath,
        message: "Codepliant hook already installed in .git/hooks/pre-commit.",
      };
    }
    // Append our check to the existing hook
    const appendScript = `\n${HOOK_MARKER}\nnpx codepliant check --quiet\nif [ $? -ne 0 ]; then\n  echo ""\n  echo "Compliance docs need updating. Run: npx codepliant go"\n  echo ""\n  exit 1\nfi\n`;
    fs.appendFileSync(hookPath, appendScript);
    fs.chmodSync(hookPath, 0o755);
    return {
      installed: true,
      hookType: "git",
      path: hookPath,
      message: "Codepliant hook appended to existing .git/hooks/pre-commit.",
    };
  }

  fs.writeFileSync(hookPath, HOOK_SCRIPT, { mode: 0o755 });
  return {
    installed: true,
    hookType: "git",
    path: hookPath,
    message: "Codepliant hook installed at .git/hooks/pre-commit.",
  };
}

export function uninstallHook(projectPath: string): HookUninstallResult {
  let removed = false;
  const messages: string[] = [];

  // Check husky
  const huskyHook = path.join(projectPath, ".husky", "pre-commit");
  if (fs.existsSync(huskyHook)) {
    const result = removeFromHookFile(huskyHook);
    if (result) {
      removed = true;
      messages.push("Removed codepliant hook from .husky/pre-commit.");
    }
  }

  // Check lefthook configs
  for (const name of ["lefthook.yml", ".lefthook.yml"]) {
    const cfgPath = path.join(projectPath, name);
    if (fs.existsSync(cfgPath)) {
      const result = removeFromLefthook(cfgPath);
      if (result) {
        removed = true;
        messages.push(`Removed codepliant hook from ${name}.`);
      }
    }
  }

  // Check .git/hooks
  const gitHook = path.join(projectPath, ".git", "hooks", "pre-commit");
  if (fs.existsSync(gitHook)) {
    const result = removeFromHookFile(gitHook);
    if (result) {
      removed = true;
      messages.push("Removed codepliant hook from .git/hooks/pre-commit.");
    }
  }

  if (!removed) {
    return { uninstalled: false, message: "No codepliant hook found to remove." };
  }

  return { uninstalled: true, message: messages.join(" ") };
}

function removeFromHookFile(hookPath: string): boolean {
  const content = fs.readFileSync(hookPath, "utf-8");
  if (!isCodepliantHook(content)) return false;

  // Remove everything from the marker to the end of the codepliant block
  const lines = content.split("\n");
  const filtered: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (line.trim() === HOOK_MARKER) {
      skipping = true;
      continue;
    }
    if (skipping) {
      // End of our block: "fi" line
      if (line.trim() === "fi") {
        skipping = false;
        continue;
      }
      continue;
    }
    filtered.push(line);
  }

  const remaining = filtered.join("\n").trim();

  if (!remaining || remaining === "#!/bin/sh") {
    // Nothing left, remove the file entirely
    fs.unlinkSync(hookPath);
  } else {
    fs.writeFileSync(hookPath, remaining + "\n", { mode: 0o755 });
  }

  return true;
}

function removeFromLefthook(cfgPath: string): boolean {
  const content = fs.readFileSync(cfgPath, "utf-8");
  if (!content.includes("codepliant")) return false;

  // Remove the codepliant snippet block
  // Remove lines from "# Codepliant pre-commit hook" or the codepliant command block
  const lines = content.split("\n");
  const filtered: string[] = [];
  let skipping = false;
  let skipIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comment line
    if (line.trim() === "# Codepliant pre-commit hook") {
      skipping = true;
      continue;
    }

    if (skipping) {
      // Detect indented block under pre-commit that contains codepliant
      const indent = line.length - line.trimStart().length;
      if (line.trim() === "" || indent > 0) {
        continue;
      }
      // Non-indented, non-empty line means new top-level block
      skipping = false;
    }

    // Also remove standalone codepliant command entries
    if (line.trim() === "codepliant:" && i + 1 < lines.length && lines[i + 1].includes("codepliant")) {
      // Skip this entry and its sub-lines
      skipIndent = line.length - line.trimStart().length;
      let j = i + 1;
      while (j < lines.length) {
        const subLine = lines[j];
        if (subLine.trim() === "") { j++; continue; }
        const subIndent = subLine.length - subLine.trimStart().length;
        if (subIndent > skipIndent) { j++; continue; }
        break;
      }
      i = j - 1;
      continue;
    }

    filtered.push(line);
  }

  const remaining = filtered.join("\n").trim();
  fs.writeFileSync(cfgPath, remaining + "\n");
  return true;
}

export function getLefthookSnippet(): string {
  return LEFTHOOK_SNIPPET;
}
