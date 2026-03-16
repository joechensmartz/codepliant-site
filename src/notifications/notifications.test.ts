import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as http from "http";
import { buildPayload, formatSlackMessage, postWebhook, sendNotification } from "./index.js";
import type { NotificationPayload } from "./index.js";
import type { ScanResult } from "../scanner/index.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-notify-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function makeScanResult(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: new Date().toISOString(),
    services: [
      { name: "Stripe", category: "payment" as const, evidence: [], dataCollected: ["payment info"] },
      { name: "Google Analytics", category: "analytics" as const, evidence: [], dataCollected: ["usage data"] },
    ],
    dataCategories: [],
    complianceNeeds: [
      { document: "Privacy Policy", reason: "Collects user data", priority: "required" as const },
      { document: "Cookie Policy", reason: "Uses cookies", priority: "recommended" as const },
    ],
    ...overrides,
  };
}

// ============================================================
// buildPayload
// ============================================================

describe("buildPayload", () => {
  it("builds payload with project name, services, missing docs, and score", () => {
    const dir = createTempDir();
    try {
      const result = makeScanResult();
      const payload = buildPayload(result, dir);

      assert.strictEqual(payload.projectName, "test-project");
      assert.deepStrictEqual(payload.newServices, ["Stripe", "Google Analytics"]);
      assert.ok(payload.missingDocs.includes("Privacy Policy"));
      assert.ok(payload.missingDocs.includes("Cookie Policy"));
      assert.strictEqual(typeof payload.complianceScore, "number");
      assert.ok(payload.complianceScore >= 0 && payload.complianceScore <= 100);
      assert.ok(payload.timestamp);
    } finally {
      cleanup(dir);
    }
  });

  it("returns 100 score when no compliance needs", () => {
    const dir = createTempDir();
    try {
      const result = makeScanResult({ complianceNeeds: [] });
      const payload = buildPayload(result, dir);
      assert.strictEqual(payload.complianceScore, 100);
      assert.deepStrictEqual(payload.missingDocs, []);
    } finally {
      cleanup(dir);
    }
  });

  it("reports higher score when docs exist on disk", () => {
    const dir = createTempDir();
    try {
      // Write a Privacy Policy file
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), "# Privacy Policy\n");

      const result = makeScanResult();
      const payload = buildPayload(result, dir);

      // Privacy Policy exists, so score should be higher than 0
      assert.ok(payload.complianceScore > 0);
      // Cookie Policy is still missing
      assert.ok(payload.missingDocs.includes("Cookie Policy"));
      assert.ok(!payload.missingDocs.includes("Privacy Policy"));
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// formatSlackMessage
// ============================================================

describe("formatSlackMessage", () => {
  it("formats a Slack-compatible message with text field", () => {
    const payload: NotificationPayload = {
      projectName: "my-app",
      newServices: ["Stripe", "SendGrid"],
      missingDocs: ["Privacy Policy"],
      complianceScore: 75,
      timestamp: "2026-01-01T00:00:00.000Z",
    };

    const msg = formatSlackMessage(payload);

    assert.ok(typeof msg.text === "string");
    assert.ok(msg.text.includes("my-app"));
    assert.ok(msg.text.includes("2 service(s) detected"));
    assert.ok(msg.text.includes("Stripe"));
    assert.ok(msg.text.includes("Missing docs: Privacy Policy"));
    assert.ok(msg.text.includes("75%"));
  });

  it("omits missing docs line when none are missing", () => {
    const payload: NotificationPayload = {
      projectName: "my-app",
      newServices: [],
      missingDocs: [],
      complianceScore: 100,
      timestamp: "2026-01-01T00:00:00.000Z",
    };

    const msg = formatSlackMessage(payload);
    assert.ok(!msg.text.includes("Missing docs"));
    assert.ok(msg.text.includes("100%"));
  });
});

// ============================================================
// postWebhook
// ============================================================

describe("postWebhook", () => {
  it("POSTs JSON to a local HTTP server and returns status code", async () => {
    let receivedBody = "";

    const server = http.createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => { body += chunk; });
      req.on("end", () => {
        receivedBody = body;
        res.writeHead(200);
        res.end("ok");
      });
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Bad server address");
    const port = addr.port;

    try {
      const status = await postWebhook(`http://127.0.0.1:${port}/webhook`, { text: "hello" });
      assert.strictEqual(status, 200);
      assert.deepStrictEqual(JSON.parse(receivedBody), { text: "hello" });
    } finally {
      server.close();
    }
  });
});

// ============================================================
// sendNotification
// ============================================================

describe("sendNotification", () => {
  it("returns sent:false with error when no webhookUrl", async () => {
    const dir = createTempDir();
    try {
      const result = makeScanResult();
      const notif = await sendNotification(undefined, result, dir);
      assert.strictEqual(notif.sent, false);
      assert.ok(notif.error?.includes("No webhookUrl"));
      assert.ok(notif.payload.projectName === "test-project");
    } finally {
      cleanup(dir);
    }
  });

  it("sends to a real HTTP endpoint and returns sent:true", async () => {
    const dir = createTempDir();

    const server = http.createServer((_req, res) => {
      res.writeHead(200);
      res.end("ok");
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Bad server address");
    const port = addr.port;

    try {
      const result = makeScanResult();
      const notif = await sendNotification(`http://127.0.0.1:${port}/hook`, result, dir);
      assert.strictEqual(notif.sent, true);
      assert.strictEqual(notif.error, undefined);
    } finally {
      server.close();
      cleanup(dir);
    }
  });

  it("returns sent:false on non-2xx status", async () => {
    const dir = createTempDir();

    const server = http.createServer((_req, res) => {
      res.writeHead(500);
      res.end("error");
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Bad server address");
    const port = addr.port;

    try {
      const result = makeScanResult();
      const notif = await sendNotification(`http://127.0.0.1:${port}/hook`, result, dir);
      assert.strictEqual(notif.sent, false);
      assert.ok(notif.error?.includes("500"));
    } finally {
      server.close();
      cleanup(dir);
    }
  });
});
