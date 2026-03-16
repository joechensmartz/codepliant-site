import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import { scan } from "../scanner/index.js";
import { generateDocuments, writeDocuments } from "../generator/index.js";
import { loadConfig } from "../config.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

export interface ServerOptions {
  port: number;
}

const VERSION = "18.0.0";

/** Send a JSON response with the given status code. */
function jsonResponse(res: http.ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(json);
}

/** Parse request body as JSON. */
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

/** Validate that a path exists and is a directory. Returns an error string or null. */
function validatePath(projectPath: string | undefined): string | null {
  if (!projectPath) {
    return "Missing required query parameter: path";
  }
  const absPath = path.resolve(projectPath);
  if (!fs.existsSync(absPath)) {
    return `Path does not exist: ${absPath}`;
  }
  try {
    const stat = fs.statSync(absPath);
    if (!stat.isDirectory()) {
      return `Path is not a directory: ${absPath}`;
    }
  } catch {
    return `Cannot access path: ${absPath}`;
  }
  return null;
}

/** GET /api/health */
function handleHealth(_req: http.IncomingMessage, res: http.ServerResponse): void {
  jsonResponse(res, 200, {
    status: "ok",
    version: VERSION,
    uptime: process.uptime(),
  });
}

/** GET /api/scan?path= */
function handleScan(req: http.IncomingMessage, res: http.ServerResponse): void {
  const parsed = url.parse(req.url || "", true);
  const projectPath = parsed.query.path as string | undefined;

  const error = validatePath(projectPath);
  if (error) {
    jsonResponse(res, 400, { error });
    return;
  }

  const absPath = path.resolve(projectPath!);

  try {
    const result = scan(absPath);
    jsonResponse(res, 200, result);
  } catch (err) {
    jsonResponse(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

/** GET /api/status?path= */
function handleStatus(req: http.IncomingMessage, res: http.ServerResponse): void {
  const parsed = url.parse(req.url || "", true);
  const projectPath = parsed.query.path as string | undefined;

  const error = validatePath(projectPath);
  if (error) {
    jsonResponse(res, 400, { error });
    return;
  }

  const absPath = path.resolve(projectPath!);
  const config = loadConfig(absPath);
  const outputDir = path.resolve(absPath, config.outputDir || "legal");

  try {
    const result = scan(absPath);

    const docFileMap: Record<string, string[]> = {
      "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
      "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
      "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
      "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
      "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
    };

    interface StatusCheck {
      document: string;
      required: boolean;
      exists: boolean;
    }

    const checks: StatusCheck[] = [];
    let allPass = true;

    for (const need of result.complianceNeeds) {
      const filenames = docFileMap[need.document];
      if (!filenames) continue;
      const exists = filenames.some(f => fs.existsSync(path.join(outputDir, f)));
      checks.push({
        document: need.document,
        required: need.priority === "required",
        exists,
      });
      if (need.priority === "required" && !exists) {
        allPass = false;
      }
    }

    jsonResponse(res, 200, {
      compliant: allPass,
      servicesDetected: result.services.length,
      complianceNeeds: result.complianceNeeds.length,
      checks,
    });
  } catch (err) {
    jsonResponse(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

/** POST /api/generate */
async function handleGenerate(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  let body: string;
  try {
    body = await readBody(req);
  } catch {
    jsonResponse(res, 400, { error: "Failed to read request body" });
    return;
  }

  let payload: { path?: string; outputDir?: string };
  try {
    payload = body ? JSON.parse(body) : {};
  } catch {
    jsonResponse(res, 400, { error: "Invalid JSON in request body" });
    return;
  }

  const projectPath = payload.path;
  const error = validatePath(projectPath);
  if (error) {
    jsonResponse(res, 400, { error });
    return;
  }

  const absPath = path.resolve(projectPath!);
  const config = loadConfig(absPath);
  const outputDir = payload.outputDir
    ? path.resolve(payload.outputDir)
    : path.resolve(absPath, config.outputDir || "legal");

  try {
    const result = scan(absPath);
    const docs = generateDocuments(result, config);
    const writtenFiles = writeDocuments(docs, outputDir);

    jsonResponse(res, 200, {
      generated: docs.map(d => ({ name: d.name, filename: d.filename })),
      outputDir,
      filesWritten: writtenFiles.length,
    });
  } catch (err) {
    jsonResponse(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

/** Main request router. */
function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const parsed = url.parse(req.url || "", true);
  const pathname = parsed.pathname || "/";
  const method = (req.method || "GET").toUpperCase();

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (method === "GET" && pathname === "/api/health") {
    handleHealth(req, res);
    return;
  }

  if (method === "GET" && pathname === "/api/scan") {
    handleScan(req, res);
    return;
  }

  if (method === "GET" && pathname === "/api/status") {
    handleStatus(req, res);
    return;
  }

  if (method === "POST" && pathname === "/api/generate") {
    handleGenerate(req, res).catch((err) => {
      jsonResponse(res, 500, { error: err instanceof Error ? err.message : String(err) });
    });
    return;
  }

  jsonResponse(res, 404, { error: `Not found: ${method} ${pathname}` });
}

/** Create and return the HTTP server (does not start listening). */
export function createServer(): http.Server {
  return http.createServer(handleRequest);
}

/** Start the server on the given port. Returns a promise that resolves when listening. */
export function startServer(options: ServerOptions): Promise<http.Server> {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(options.port, () => {
      resolve(server);
    });
  });
}
