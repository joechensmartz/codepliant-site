import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { createServer } from "./server.js";

function createTempProject(files: Record<string, string> = {}): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-api-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Start server on a random available port. */
function listen(server: http.Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve(addr.port);
      } else {
        reject(new Error("Failed to get server address"));
      }
    });
  });
}

/** Simple HTTP GET helper. */
function get(port: number, path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode || 0,
          body: Buffer.concat(chunks).toString("utf-8"),
        });
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

/** Simple HTTP POST helper. */
function post(port: number, reqPath: string, body: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(`http://127.0.0.1:${port}${reqPath}`);
    const req = http.request({
      hostname: reqUrl.hostname,
      port: reqUrl.port,
      path: reqUrl.pathname,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode || 0,
          body: Buffer.concat(chunks).toString("utf-8"),
        });
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

let server: http.Server | null = null;
let port = 0;

afterEach(() => {
  return new Promise<void>((resolve) => {
    if (server) {
      server.close(() => resolve());
      server = null;
    } else {
      resolve();
    }
  });
});

describe("API server", () => {
  describe("GET /api/health", () => {
    it("returns ok status and version", async () => {
      server = createServer();
      port = await listen(server);

      const res = await get(port, "/api/health");
      assert.strictEqual(res.status, 200);
      const data = JSON.parse(res.body);
      assert.strictEqual(data.status, "ok");
      assert.ok(data.version);
      assert.ok(typeof data.uptime === "number");
    });
  });

  describe("GET /api/scan", () => {
    it("returns 400 when path is missing", async () => {
      server = createServer();
      port = await listen(server);

      const res = await get(port, "/api/scan");
      assert.strictEqual(res.status, 400);
      const data = JSON.parse(res.body);
      assert.ok(data.error.includes("path"));
    });

    it("returns 400 when path does not exist", async () => {
      server = createServer();
      port = await listen(server);

      const res = await get(port, "/api/scan?path=/nonexistent/path/xyz");
      assert.strictEqual(res.status, 400);
      const data = JSON.parse(res.body);
      assert.ok(data.error.includes("does not exist"));
    });

    it("scans a valid project and returns services", async () => {
      const dir = createTempProject({
        "package.json": JSON.stringify({
          name: "test",
          dependencies: { stripe: "^12.0.0" },
        }),
      });

      try {
        server = createServer();
        port = await listen(server);

        const res = await get(port, `/api/scan?path=${encodeURIComponent(dir)}`);
        assert.strictEqual(res.status, 200);
        const data = JSON.parse(res.body);
        assert.ok(Array.isArray(data.services));
        assert.ok(data.services.length > 0);
      } finally {
        cleanup(dir);
      }
    });
  });

  describe("GET /api/status", () => {
    it("returns compliance status", async () => {
      const dir = createTempProject({
        "package.json": JSON.stringify({
          name: "test",
          dependencies: { stripe: "^12.0.0" },
        }),
      });

      try {
        server = createServer();
        port = await listen(server);

        const res = await get(port, `/api/status?path=${encodeURIComponent(dir)}`);
        assert.strictEqual(res.status, 200);
        const data = JSON.parse(res.body);
        assert.ok(typeof data.compliant === "boolean");
        assert.ok(typeof data.servicesDetected === "number");
        assert.ok(Array.isArray(data.checks));
      } finally {
        cleanup(dir);
      }
    });

    it("returns 400 when path is missing", async () => {
      server = createServer();
      port = await listen(server);

      const res = await get(port, "/api/status");
      assert.strictEqual(res.status, 400);
    });
  });

  describe("POST /api/generate", () => {
    it("generates documents for a valid project", async () => {
      const dir = createTempProject({
        "package.json": JSON.stringify({
          name: "test",
          dependencies: { stripe: "^12.0.0" },
        }),
      });

      try {
        server = createServer();
        port = await listen(server);

        const res = await post(port, "/api/generate", JSON.stringify({ path: dir }));
        assert.strictEqual(res.status, 200);
        const data = JSON.parse(res.body);
        assert.ok(Array.isArray(data.generated));
        assert.ok(data.generated.length > 0);
        assert.ok(typeof data.filesWritten === "number");
        assert.ok(data.filesWritten > 0);
      } finally {
        cleanup(dir);
      }
    });

    it("returns 400 for missing path", async () => {
      server = createServer();
      port = await listen(server);

      const res = await post(port, "/api/generate", JSON.stringify({}));
      assert.strictEqual(res.status, 400);
    });

    it("returns 400 for invalid JSON body", async () => {
      server = createServer();
      port = await listen(server);

      const res = await post(port, "/api/generate", "not json{{{");
      assert.strictEqual(res.status, 400);
      const data = JSON.parse(res.body);
      assert.ok(data.error.includes("Invalid JSON"));
    });
  });

  describe("404 handling", () => {
    it("returns 404 for unknown routes", async () => {
      server = createServer();
      port = await listen(server);

      const res = await get(port, "/api/unknown");
      assert.strictEqual(res.status, 404);
      const data = JSON.parse(res.body);
      assert.ok(data.error.includes("Not found"));
    });
  });
});
