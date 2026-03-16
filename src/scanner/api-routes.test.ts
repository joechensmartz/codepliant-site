import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanApiRoutes, extractZodSchemaFields, mapFieldToCategory } from "./api-routes.js";

function createTempProject(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-api-routes-test-"));
}

function writeFile(dir: string, relativePath: string, content: string): void {
  const fullPath = path.join(dir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanApiRoutes", () => {
  it("returns empty when no API routes exist", () => {
    const dir = createTempProject();
    try {
      writeFile(dir, "src/index.ts", "console.log('hello');");
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Next.js App Router POST handler with data fields", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "app/api/users/route.ts",
        `
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const name = body.name;
  return NextResponse.json({ success: true });
}
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].category, "API Data Collection");
      assert.ok(result[0].description.includes("POST"));
      assert.ok(result[0].description.includes("email"));
      assert.ok(result[0].description.includes("name"));
      assert.ok(result[0].sources.some((s) => s.includes("route.ts")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Next.js Pages API route with req.body usage", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "pages/api/signup.ts",
        `
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    res.status(200).json({ ok: true });
  }
}
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].category, "API Data Collection");
      assert.ok(result[0].description.includes("email"));
      assert.ok(result[0].description.includes("password"));
      assert.ok(result[0].sources.some((s) => s.includes("signup.ts")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Express app.post() routes with body fields", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "src/server.ts",
        `
import express from "express";
const app = express();

app.post('/api/contact', (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;
  res.json({ ok: true });
});

app.put('/api/profile', (req, res) => {
  const name = req.body.name;
  const bio = req.body.bio;
  res.json({ ok: true });
});
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].category, "API Data Collection");
      assert.ok(result[0].description.includes("POST"));
      assert.ok(result[0].description.includes("PUT"));
      assert.ok(result[0].description.includes("email"));
      assert.ok(result[0].description.includes("phone"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects router.post() pattern (Express Router)", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "src/routes/users.ts",
        `
import { Router } from "express";
const router = Router();

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  res.json({ ok: true });
});

router.patch('/update', (req, res) => {
  const address = req.body.address;
  res.json({ ok: true });
});

export default router;
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].category, "API Data Collection");
      assert.ok(result[0].description.includes("PATCH"));
      assert.ok(result[0].description.includes("POST"));
      assert.ok(result[0].description.includes("username"));
      assert.ok(result[0].description.includes("email"));
      assert.ok(result[0].description.includes("address"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple Next.js App Router methods (PUT, PATCH) in same file", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "app/api/account/route.ts",
        `
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const name = body.name;
  return NextResponse.json({ ok: true });
}
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.ok(result[0].description.includes("PATCH"));
      assert.ok(result[0].description.includes("PUT"));
    } finally {
      cleanup(dir);
    }
  });

  it("combines sources from multiple route files without duplicates", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "app/api/users/route.ts",
        `
export async function POST(req) {
  const body = await req.json();
  const email = body.email;
}
`,
      );
      writeFile(
        dir,
        "app/api/orders/route.ts",
        `
export async function POST(req) {
  const body = await req.json();
  const address = body.address;
}
`,
      );
      const result = scanApiRoutes(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].sources.length, 2);
      assert.ok(result[0].sources.some((s) => s.includes("users")));
      assert.ok(result[0].sources.some((s) => s.includes("orders")));
    } finally {
      cleanup(dir);
    }
  });
});

describe("Zod schema extraction", () => {
  it("extracts fields from z.object() with various Zod types", () => {
    const content = `
      const schema = z.object({
        email: z.string(),
        age: z.number(),
        active: z.boolean(),
        phone: z.optional()
      });
    `;
    const fields = extractZodSchemaFields(content);
    assert.deepStrictEqual(fields.sort(), ["active", "age", "email", "phone"]);
  });

  it("extracts fields from tRPC .input(z.object()) patterns", () => {
    const content = `
      export const userRouter = createTRPCRouter({
        create: publicProcedure
          .input(z.object({ email: z.string(), password: z.string() }))
          .mutation(async ({ input }) => {
            return createUser(input);
          }),
      });
    `;
    const fields = extractZodSchemaFields(content);
    assert.deepStrictEqual(fields.sort(), ["email", "password"]);
  });

  it("handles z.email() type annotation", () => {
    const content = `
      const contactSchema = z.object({
        contactEmail: z.email(),
        nickname: z.string()
      });
    `;
    const fields = extractZodSchemaFields(content);
    assert.deepStrictEqual(fields.sort(), ["contactEmail", "nickname"]);
  });

  it("maps field names to correct data categories", () => {
    assert.strictEqual(mapFieldToCategory("email"), "Contact");
    assert.strictEqual(mapFieldToCategory("phone"), "Contact");
    assert.strictEqual(mapFieldToCategory("password"), "Auth");
    assert.strictEqual(mapFieldToCategory("firstName"), "Identity");
    assert.strictEqual(mapFieldToCategory("ssn"), "Sensitive");
    assert.strictEqual(mapFieldToCategory("creditCard"), "Financial");
    assert.strictEqual(mapFieldToCategory("company"), "Business");
    assert.strictEqual(mapFieldToCategory("location"), "Location");
    assert.strictEqual(mapFieldToCategory("someRandomField"), "Other");
  });

  it("detects Zod fields in Express routes and tRPC routers via full scan", () => {
    const dir = createTempProject();
    try {
      writeFile(
        dir,
        "src/routes/users.ts",
        `
import { z } from "zod";
const createUserSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string()
});
app.post("/api/users", (req, res) => {
  const data = createUserSchema.parse(req.body);
});
`,
      );
      writeFile(
        dir,
        "src/trpc/router.ts",
        `
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
export const profileRouter = createTRPCRouter({
  update: publicProcedure
    .input(z.object({ phone: z.string(), address: z.string() }))
    .mutation(async ({ input }) => {
      return updateProfile(input);
    }),
});
`,
      );
      const result = scanApiRoutes(dir);
      assert.ok(result.length > 0, "should detect at least one data category");
      const desc = result[0].description;
      // Express route Zod fields
      assert.ok(desc.includes("email"), "should detect email from Zod schema");
      assert.ok(desc.includes("name"), "should detect name from Zod schema");
      assert.ok(desc.includes("password"), "should detect password from Zod schema");
      // tRPC route should be a source
      const sources = result[0].sources;
      const hasTrpc = sources.some(s => s.includes("router.ts"));
      assert.ok(hasTrpc, "should detect tRPC router file as a source");
    } finally {
      cleanup(dir);
    }
  });
});
