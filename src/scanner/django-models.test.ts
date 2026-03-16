import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDjangoModels } from "./django-models.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-django-test-"));
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

describe("scanDjangoModels", () => {
  it("returns empty when no models.py files exist", () => {
    const dir = createTempProject({
      "manage.py": "# django project",
    });
    try {
      const result = scanDjangoModels(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects EmailField and CharField name hints in a User model", () => {
    const dir = createTempProject({
      "accounts/models.py": `
from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
`,
    });
    try {
      const result = scanDjangoModels(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.description.includes("email addresses"));
      assert.ok(contactCat.sources.includes("User.email"));
      assert.ok(contactCat.sources.includes("User.phone"));

      const identityCat = result.find((c) => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");
      assert.ok(identityCat.sources.includes("User.first_name"));
      assert.ok(identityCat.sources.includes("User.last_name"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects IPAddressField, DateField with dob hint, and ImageField with avatar hint", () => {
    const dir = createTempProject({
      "profiles/models.py": `
from django.db import models

class UserProfile(models.Model):
    ip_address = models.GenericIPAddressField(null=True)
    date_of_birth = models.DateField(null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    score = models.IntegerField(default=0)
`,
    });
    try {
      const result = scanDjangoModels(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const techCat = result.find((c) => c.category === "Technical Data");
      assert.ok(techCat, "Should have Technical Data category");
      assert.ok(techCat.sources.includes("UserProfile.ip_address"));

      const identityCat = result.find((c) => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");
      assert.ok(identityCat.sources.includes("UserProfile.date_of_birth"));
      assert.ok(identityCat.sources.includes("UserProfile.avatar"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects fields across multiple models in multiple files", () => {
    const dir = createTempProject({
      "users/models.py": `
from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
`,
      "orders/models.py": `
from django.db import models

class Order(models.Model):
    total = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
`,
    });
    try {
      const result = scanDjangoModels(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const allSources = result.flatMap((c) => c.sources);
      const hasUserFields = allSources.some((s) => s.startsWith("User."));
      const hasOrderFields = allSources.some((s) => s.startsWith("Order."));
      assert.ok(hasUserFields, "Should detect fields from User model");
      assert.ok(hasOrderFields, "Should detect fields from Order model");

      const locationCat = result.find((c) => c.category === "Location Data");
      assert.ok(locationCat, "Should have Location Data category");
      assert.ok(locationCat.sources.includes("Order.city"));
      assert.ok(locationCat.sources.includes("Order.zip_code"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores non-Model classes and non-personal fields", () => {
    const dir = createTempProject({
      "blog/models.py": `
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

class NotAModel:
    email = "not_a_field"
    first_name = "also_not_a_field"
`,
    });
    try {
      const result = scanDjangoModels(dir);
      // "name" on Category will match, but NotAModel fields should not
      // "content" TextField won't match because it's not in our name hints
      const allSources = result.flatMap((c) => c.sources);
      assert.ok(
        !allSources.some((s) => s.startsWith("NotAModel.")),
        "Should not detect fields from non-Model classes"
      );
      assert.ok(
        !allSources.includes("Post.content"),
        "Should not detect generic 'content' TextField"
      );
      assert.ok(
        !allSources.includes("Post.title"),
        "Should not detect 'title' CharField"
      );
    } finally {
      cleanup(dir);
    }
  });
});
