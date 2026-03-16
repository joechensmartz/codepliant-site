import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanSqlalchemyModels } from "./sqlalchemy-models.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-sqla-test-"));
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

describe("scanSqlalchemyModels", () => {
  it("detects personal data fields in a SQLAlchemy Base model with Column()", () => {
    const dir = createTempProject({
      "app/models.py": `
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    password_hash = Column(String(128))
    ip_address = Column(String(45))
    created_at = Column(DateTime, default=func.now())
`,
    });
    try {
      const result = scanSqlalchemyModels(dir);
      assert.ok(result.length >= 3, `Expected at least 3 categories, got ${result.length}`);

      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.sources.includes("User.email"));
      assert.ok(contactCat.sources.includes("User.phone"));

      const authCat = result.find((c) => c.category === "Authentication Data");
      assert.ok(authCat, "Should have Authentication Data category");
      assert.ok(authCat.sources.includes("User.password_hash"));

      const techCat = result.find((c) => c.category === "Technical Data");
      assert.ok(techCat, "Should have Technical Data category");
      assert.ok(techCat.sources.includes("User.ip_address"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects fields in db.Model (Flask-SQLAlchemy) and mapped_column patterns", () => {
    const dir = createTempProject({
      "app/models.py": `
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Profile(db.Model):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    city = Column(String(100))

class Account(Base):
    __tablename__ = "accounts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(150))
    ssn: Mapped[str] = mapped_column(String(11))
`,
    });
    try {
      const result = scanSqlalchemyModels(dir);
      assert.ok(result.length >= 3, `Expected at least 3 categories, got ${result.length}`);

      const identityCat = result.find((c) => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");
      assert.ok(identityCat.sources.includes("Profile.first_name"));
      assert.ok(identityCat.sources.includes("Profile.last_name"));
      assert.ok(identityCat.sources.includes("Account.username"));

      const locationCat = result.find((c) => c.category === "Location Data");
      assert.ok(locationCat, "Should have Location Data category");
      assert.ok(locationCat.sources.includes("Profile.city"));

      const govCat = result.find((c) => c.category === "Government Identifiers");
      assert.ok(govCat, "Should have Government Identifiers category");
      assert.ok(govCat.sources.includes("Account.ssn"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no SQLAlchemy models or no personal fields exist", () => {
    const dir = createTempProject({
      "app/utils.py": `
def hello():
    return "world"
`,
      "app/models.py": `
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    price = Column(Float)
    sku = Column(String(50))
`,
    });
    try {
      const result = scanSqlalchemyModels(dir);
      assert.strictEqual(result.length, 0, "Should detect no personal data categories");
    } finally {
      cleanup(dir);
    }
  });
});
