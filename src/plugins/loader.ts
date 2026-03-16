import * as fs from "fs";
import * as path from "path";
import type { CodepliantPlugin } from "./index.js";

/**
 * Resolve and load all plugins declared in the config.
 *
 * Plugin specifiers can be:
 *   - A bare package name   → resolved from node_modules
 *   - A scoped package name → resolved from node_modules
 *   - A relative/absolute path → resolved relative to `projectPath`
 *
 * Each resolved module must default-export (or named-export `plugin`) a
 * CodepliantPlugin object.
 */
export function loadPlugins(
  projectPath: string,
  pluginSpecifiers: string[]
): CodepliantPlugin[] {
  const loaded: CodepliantPlugin[] = [];

  for (const specifier of pluginSpecifiers) {
    const plugin = loadSinglePlugin(projectPath, specifier);
    if (plugin) {
      loaded.push(plugin);
    }
  }

  return loaded;
}

function loadSinglePlugin(
  projectPath: string,
  specifier: string
): CodepliantPlugin | null {
  // Determine the path to require/import
  const resolved = resolvePluginPath(projectPath, specifier);
  if (!resolved) {
    return null;
  }

  try {
    // Use require for synchronous loading (works in Node CJS + ESM interop)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(resolved);
    const plugin: CodepliantPlugin = mod.plugin ?? mod.default ?? mod;

    // Basic validation
    if (!plugin.name || !plugin.version) {
      console.error(
        `Plugin "${specifier}" is missing required "name" or "version" field — skipping.`
      );
      return null;
    }

    return plugin;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to load plugin "${specifier}": ${message}`);
    return null;
  }
}

/**
 * Resolve a specifier to an absolute file-system path.
 *
 * Resolution order:
 *   1. If specifier starts with `.` or `/`, treat as a path relative to projectPath.
 *   2. Try `codepliant-plugin-<specifier>` in the project's node_modules.
 *   3. Try the raw specifier in the project's node_modules.
 */
function resolvePluginPath(
  projectPath: string,
  specifier: string
): string | null {
  // 1. Local path
  if (specifier.startsWith(".") || specifier.startsWith("/")) {
    const abs = path.resolve(projectPath, specifier);
    if (fileOrDirExists(abs)) {
      return abs;
    }
    console.error(`Plugin path not found: ${abs}`);
    return null;
  }

  // 2. Convention-based name: codepliant-plugin-<name>
  const conventionName = specifier.startsWith("codepliant-plugin-")
    ? specifier
    : `codepliant-plugin-${specifier}`;
  const conventionPath = path.join(
    projectPath,
    "node_modules",
    conventionName
  );
  if (fileOrDirExists(conventionPath)) {
    return conventionPath;
  }

  // 3. Raw specifier in node_modules
  const rawPath = path.join(projectPath, "node_modules", specifier);
  if (fileOrDirExists(rawPath)) {
    return rawPath;
  }

  console.error(
    `Plugin "${specifier}" could not be resolved from "${projectPath}".`
  );
  return null;
}

function fileOrDirExists(p: string): boolean {
  try {
    fs.statSync(p);
    return true;
  } catch {
    return false;
  }
}
