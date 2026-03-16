import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanWebSockets } from "./websocket-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-ws-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("websocket-scanner", () => {
  it("detects Socket.IO usage", () => {
    const dir = createTempProject({
      "server.ts": `
        import { Server } from 'socket.io';
        const io = new Server(httpServer);
        io.on('connection', (socket) => {
          socket.on('chat message', (msg) => console.log(msg));
        });
      `,
    });
    try {
      const result = scanWebSockets(dir);
      const socketio = result.find(s => s.name === "Socket.IO");
      assert.ok(socketio, "Should detect Socket.IO");
      assert.strictEqual(socketio.category, "other");
      assert.ok(socketio.dataCollected.includes("real-time user data"));
      assert.ok(socketio.evidence.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Django Channels usage", () => {
    const dir = createTempProject({
      "consumers.py": `
        from channels.generic.websocket import AsyncWebsocketConsumer
        import json

        class ChatConsumer(AsyncWebsocketConsumer):
            async def connect(self):
                await self.accept()
      `,
    });
    try {
      const result = scanWebSockets(dir);
      const django = result.find(s => s.name === "Django Channels");
      assert.ok(django, "Should detect Django Channels");
      assert.ok(django.dataCollected.includes("WebSocket messages"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no WebSocket usage found", () => {
    const dir = createTempProject({
      "index.ts": `
        import express from 'express';
        const app = express();
        app.get('/', (req, res) => res.send('Hello'));
      `,
    });
    try {
      const result = scanWebSockets(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
