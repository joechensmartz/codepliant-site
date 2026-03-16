import * as fs from "fs";
import * as path from "path";

/**
 * Known project manifest files across ecosystems.
 * If a directory contains any of these, it's considered a project.
 */
const PROJECT_MANIFESTS = [
  "package.json",        // Node.js / JavaScript / TypeScript
  "requirements.txt",    // Python (pip)
  "setup.py",            // Python (setuptools)
  "pyproject.toml",      // Python (modern)
  "Pipfile",             // Python (pipenv)
  "go.mod",              // Go
  "Cargo.toml",          // Rust
  "Gemfile",             // Ruby
  "mix.exs",             // Elixir
  "composer.json",       // PHP
  "pom.xml",             // Java (Maven)
  "build.gradle",        // Java/Kotlin (Gradle)
  "build.gradle.kts",    // Kotlin (Gradle KTS)
  "*.csproj",            // .NET (C#)
  "*.fsproj",            // .NET (F#)
];

/** Directories to skip when discovering projects */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "__pycache__",
  "venv",
  ".venv",
  "vendor",
  "target",
  "_build",
  "deps",
  ".cache",
  ".output",
  "coverage",
  ".turbo",
]);

export interface DiscoveredProject {
  /** Absolute path to the project directory */
  path: string;
  /** Relative path from the search root */
  relativePath: string;
  /** Project name (from manifest or directory name) */
  name: string;
  /** Which manifest file(s) were found */
  manifests: string[];
}

/**
 * Check whether a directory contains a .csproj or .fsproj file.
 */
function hasDotnetProject(dir: string): string | null {
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.endsWith(".csproj") || entry.endsWith(".fsproj")) {
        return entry;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Try to extract a project name from a manifest file.
 */
function extractProjectName(dir: string, manifests: string[]): string {
  // Try package.json first
  if (manifests.includes("package.json")) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));
      if (pkg.name) return pkg.name;
    } catch {
      // ignore
    }
  }

  // Try pyproject.toml
  if (manifests.includes("pyproject.toml")) {
    try {
      const content = fs.readFileSync(path.join(dir, "pyproject.toml"), "utf-8");
      const match = content.match(/^\s*name\s*=\s*"([^"]+)"/m);
      if (match) return match[1];
    } catch {
      // ignore
    }
  }

  // Try Cargo.toml
  if (manifests.includes("Cargo.toml")) {
    try {
      const content = fs.readFileSync(path.join(dir, "Cargo.toml"), "utf-8");
      const match = content.match(/^\s*name\s*=\s*"([^"]+)"/m);
      if (match) return match[1];
    } catch {
      // ignore
    }
  }

  // Try composer.json
  if (manifests.includes("composer.json")) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, "composer.json"), "utf-8"));
      if (pkg.name) return pkg.name;
    } catch {
      // ignore
    }
  }

  // Try go.mod
  if (manifests.includes("go.mod")) {
    try {
      const content = fs.readFileSync(path.join(dir, "go.mod"), "utf-8");
      const match = content.match(/^module\s+(\S+)/m);
      if (match) return match[1];
    } catch {
      // ignore
    }
  }

  // Fall back to directory name
  return path.basename(dir);
}

/**
 * Discover all projects under a directory by looking for manifest files.
 * Searches recursively but skips common non-project directories.
 * Does NOT include the root directory itself (only subdirectories).
 *
 * @param rootDir - The directory to search for projects
 * @param maxDepth - Maximum recursion depth (default: 3)
 */
export function discoverProjects(rootDir: string, maxDepth: number = 3): DiscoveredProject[] {
  const absRoot = path.resolve(rootDir);
  const projects: DiscoveredProject[] = [];
  const seen = new Set<string>();

  // Simple file-based manifest names (no globs)
  const simpleManifests = PROJECT_MANIFESTS.filter(m => !m.includes("*"));

  function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith(".")) continue;

      const fullPath = path.join(dir, entry.name);
      if (seen.has(fullPath)) continue;

      // Check for manifest files in this directory
      const foundManifests: string[] = [];
      for (const manifest of simpleManifests) {
        if (fs.existsSync(path.join(fullPath, manifest))) {
          foundManifests.push(manifest);
        }
      }

      // Check for .csproj / .fsproj
      const dotnetFile = hasDotnetProject(fullPath);
      if (dotnetFile) {
        foundManifests.push(dotnetFile);
      }

      if (foundManifests.length > 0) {
        seen.add(fullPath);
        const relativePath = path.relative(absRoot, fullPath);
        const name = extractProjectName(fullPath, foundManifests);
        projects.push({
          path: fullPath,
          relativePath,
          name,
          manifests: foundManifests,
        });
      }

      // Continue recursing into subdirectories
      walk(fullPath, depth + 1);
    }
  }

  walk(absRoot, 0);

  // Sort by relative path for deterministic output
  projects.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  return projects;
}
