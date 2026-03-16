import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPythonDependencies } from "./python.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-py-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filePath), content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanPythonDependencies", () => {
  it("detects packages from requirements.txt", () => {
    const dir = createTempProject({
      "requirements.txt": "openai==1.0.0\nstripe>=5.0.0\nflask\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("openai"));
      assert.ok(names.includes("stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects AI services", () => {
    const dir = createTempProject({
      "requirements.txt": "openai\nanthropic\nlangchain\ntransformers\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.ok(result.length >= 4);
      assert.ok(result.every((r) => r.category === "ai"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores comments in requirements.txt", () => {
    const dir = createTempProject({
      "requirements.txt": "# AI packages\nopenai==1.0.0\n# stripe\nflask\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
    } finally {
      cleanup(dir);
    }
  });

  it("detects from pyproject.toml", () => {
    const dir = createTempProject({
      "pyproject.toml": `[project]
name = "my-app"
dependencies = [
    "openai>=1.0",
    "stripe>=5.0",
    "sentry-sdk>=1.0",
]`,
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("openai"));
      assert.ok(names.includes("stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects from Pipfile", () => {
    const dir = createTempProject({
      Pipfile: `[packages]
openai = "*"
stripe = ">=5.0"

[dev-packages]
pytest = "*"
`,
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("openai"));
      assert.ok(names.includes("stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project without Python files", () => {
    const dir = createTempProject({});
    try {
      const result = scanPythonDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects sentry-sdk", () => {
    const dir = createTempProject({
      "requirements.txt": "sentry-sdk[flask]==1.40.0\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "sentry-sdk");
      assert.strictEqual(result[0].category, "monitoring");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Django and celery from requirements.txt", () => {
    const dir = createTempProject({
      "requirements.txt": "django==4.2\ncelery==5.3.1\ngunicorn==21.2.0\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      const names = result.map((s) => s.name);
      assert.ok(names.includes("django"), "should detect django");
      assert.ok(names.includes("celery"), "should detect celery");
      assert.ok(names.includes("gunicorn"), "should detect gunicorn");
    } finally {
      cleanup(dir);
    }
  });

  it("detects FastAPI stack from requirements.txt", () => {
    const dir = createTempProject({
      "requirements.txt": "fastapi>=0.100.0\nuvicorn>=0.23.0\npydantic>=2.0\npython-multipart>=0.0.6\n",
    });
    try {
      const result = scanPythonDependencies(dir);
      const names = result.map((s) => s.name);
      assert.ok(names.includes("fastapi"), "should detect fastapi");
      assert.ok(names.includes("uvicorn"), "should detect uvicorn");
      assert.ok(names.includes("pydantic"), "should detect pydantic");
      assert.ok(names.includes("python-multipart"), "should detect python-multipart");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Django ecosystem packages from pyproject.toml", () => {
    const dir = createTempProject({
      "pyproject.toml": `[project]
dependencies = [
    "django>=4.2",
    "djangorestframework>=3.14",
    "django-cors-headers>=4.0",
    "django-storages>=1.13",
    "django-redis>=5.2",
]
`,
    });
    try {
      const result = scanPythonDependencies(dir);
      const names = result.map((s) => s.name);
      assert.ok(names.includes("django"), "should detect django");
      assert.ok(names.includes("djangorestframework"), "should detect djangorestframework");
      assert.ok(names.includes("django-cors-headers"), "should detect django-cors-headers");
      assert.ok(names.includes("django-storages"), "should detect django-storages");
      assert.ok(names.includes("django-redis"), "should detect django-redis");
    } finally {
      cleanup(dir);
    }
  });

  it("detects async database packages from Pipfile", () => {
    const dir = createTempProject({
      Pipfile: `[packages]
tortoise-orm = ">=0.19"
asyncpg = ">=0.28"
databases = ">=0.8"
aiohttp = ">=3.8"
`,
    });
    try {
      const result = scanPythonDependencies(dir);
      const names = result.map((s) => s.name);
      assert.ok(names.includes("tortoise-orm"), "should detect tortoise-orm");
      assert.ok(names.includes("asyncpg"), "should detect asyncpg");
      assert.ok(names.includes("databases"), "should detect databases");
      assert.ok(names.includes("aiohttp"), "should detect aiohttp");
    } finally {
      cleanup(dir);
    }
  });

  it("assigns correct categories to new signatures", () => {
    const dir = createTempProject({
      "requirements.txt": [
        "django==4.2",
        "django-storages==1.13",
        "django-redis==5.2",
        "celery==5.3",
        "tortoise-orm==0.19",
        "python-multipart==0.0.6",
        "whitenoise==6.5",
      ].join("\n"),
    });
    try {
      const result = scanPythonDependencies(dir);
      const byName = Object.fromEntries(result.map((s) => [s.name, s]));

      assert.strictEqual(byName["django"].category, "auth");
      assert.strictEqual(byName["django-storages"].category, "storage");
      assert.strictEqual(byName["django-redis"].category, "database");
      assert.strictEqual(byName["celery"].category, "other");
      assert.strictEqual(byName["tortoise-orm"].category, "database");
      assert.strictEqual(byName["python-multipart"].category, "storage");
      assert.strictEqual(byName["whitenoise"].category, "other");
    } finally {
      cleanup(dir);
    }
  });
});
