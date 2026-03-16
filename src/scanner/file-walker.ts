import * as fs from "fs";
import * as path from "path";

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  ".output",
  ".nuxt",
  ".svelte-kit",
  "coverage",
  "__pycache__",
  ".autopilot",
  "venv",
  ".venv",
  "env",
  ".tox",
  "vendor",
  "legal",
  ".claude",
]);

// Skip files larger than 1MB — they are unlikely to be source code
const MAX_FILE_SIZE = 1024 * 1024;

// Common binary file extensions to skip entirely
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".svg",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".pdf", ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar",
  ".mp3", ".mp4", ".wav", ".avi", ".mov", ".webm",
  ".exe", ".dll", ".so", ".dylib", ".o", ".a",
  ".wasm", ".pyc", ".pyo", ".class",
  ".db", ".sqlite", ".sqlite3",
  ".lock",
]);

// Test file patterns to skip
const TEST_PATTERNS = [/\.test\./, /\.spec\./, /\/__tests__\//];

export interface WalkedFile {
  fullPath: string;
  relativePath: string;
  extension: string;
}

export interface WalkOptions {
  /** File extensions to include (e.g. [".ts", ".tsx"]) */
  extensions: Set<string>;
  /** Whether to skip test files */
  skipTests?: boolean;
}

/**
 * Walks a directory tree once, collecting files that match the given extensions.
 * Shared across scanners to avoid redundant directory traversals.
 * Handles circular symlinks by tracking visited real paths.
 */
export function walkDirectory(
  projectPath: string,
  options: WalkOptions,
): WalkedFile[] {
  const files: WalkedFile[] = [];
  const visitedDirs = new Set<string>();
  walkDir(projectPath, projectPath, options, files, visitedDirs);
  return files;
}

function walkDir(
  dir: string,
  rootDir: string,
  options: WalkOptions,
  files: WalkedFile[],
  visitedDirs: Set<string>,
): void {
  // Resolve real path to detect circular symlinks
  let realDir: string;
  try {
    realDir = fs.realpathSync(dir);
  } catch {
    // Cannot resolve (broken symlink, permission error) — skip
    return;
  }

  if (visitedDirs.has(realDir)) {
    return; // Circular symlink — already visited
  }
  visitedDirs.add(realDir);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  // Quick check: does this directory have any files with relevant extensions?
  // Collect subdirs for recursion at the same time.
  const subdirs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() || entry.isSymbolicLink()) {
      if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      const subdirPath = path.join(dir, entry.name);
      // For symlinks, verify the target is a directory
      if (entry.isSymbolicLink()) {
        try {
          const stat = fs.statSync(subdirPath);
          if (!stat.isDirectory()) continue;
        } catch {
          continue; // Broken symlink
        }
      }
      subdirs.push(subdirPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (BINARY_EXTENSIONS.has(ext)) continue;
      if (!options.extensions.has(ext)) continue;

      const fullPath = path.join(dir, entry.name);

      // Skip test files if requested
      if (options.skipTests) {
        const relativePath = path.relative(rootDir, fullPath);
        if (TEST_PATTERNS.some(p => p.test(relativePath))) continue;
      }

      // Check file size
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size <= MAX_FILE_SIZE) {
          files.push({
            fullPath,
            relativePath: path.relative(rootDir, fullPath),
            extension: ext,
          });
        }
      } catch {
        // Cannot stat file — skip it
      }
    }
  }

  // Recurse into subdirectories
  for (const subdir of subdirs) {
    walkDir(subdir, rootDir, options, files, visitedDirs);
  }
}

/** All source code extensions used by the import scanner */
export const SOURCE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts",
  ".py", ".go",
]);

/** Extensions used by the tracking scanner */
export const TRACKING_EXTENSIONS = new Set([
  ".html", ".tsx", ".jsx", ".vue", ".svelte",
]);

/** All extensions needed across all scanners (union) */
export const ALL_EXTENSIONS = new Set([
  ...SOURCE_EXTENSIONS,
  ...TRACKING_EXTENSIONS,
]);
