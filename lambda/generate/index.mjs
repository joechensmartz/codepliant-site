import { execSync } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readFileSync, readdirSync, renameSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";
import * as tar from "tar";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET = process.env.S3_BUCKET_NAME || "codepliant-generated-docs";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function updateOrder(orderId, updates) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !orderId) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(updates),
    });
  } catch (e) {
    console.error("Order update failed:", e.message);
  }
}

export const handler = async (event) => {
  const { repoUrl, companyName, email, packageType, stripeSessionId, orderId } =
    typeof event.body === "string" ? JSON.parse(event.body) : event;

  const tmpDir = `/tmp/gen-${Date.now()}`;
  const repoDir = `${tmpDir}/repo`;
  const outputDir = `${tmpDir}/output`;
  const cleanDir = `${tmpDir}/clean`;
  const zipPath = `${tmpDir}/compliance-docs.zip`;

  try {
    mkdirSync(tmpDir, { recursive: true });
    mkdirSync(repoDir, { recursive: true });

    // 1. Download repo
    await updateOrder(orderId, { status: "downloading" });
    console.log(`Downloading ${repoUrl}...`);
    const repoMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!repoMatch) throw new Error("Invalid GitHub URL: " + repoUrl);
    const repoSlug = repoMatch[1].replace(/\.git$/, "");
    const tarballUrl = `https://api.github.com/repos/${repoSlug}/tarball`;
    const tarPath = `${tmpDir}/repo.tar.gz`;

    const res = await fetch(tarballUrl, {
      headers: { "User-Agent": "codepliant-lambda" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

    const arrayBuf = await res.arrayBuffer();
    writeFileSync(tarPath, Buffer.from(arrayBuf));
    await tar.x({ file: tarPath, cwd: repoDir, strip: 1 });

    // 2. Scan & generate
    await updateOrder(orderId, { status: "scanning" });
    console.log("Generating compliance documents...");
    const cliPath = join(import.meta.dirname, "node_modules", "codepliant", "dist", "cli.js");
    execSync(
      `node ${cliPath} go ${repoDir} -o ${outputDir} --format all --company-name "${(companyName || "").replace(/"/g, '\\"')}" --contact-email "${(email || "").replace(/"/g, '\\"')}" --quiet`,
      { timeout: 540000, stdio: "pipe", env: { ...process.env, HOME: "/tmp", CODEPLIANT_CLOUD: "true" } }
    );

    // 3. Restructure: category/DocName/{.md,.html,.docx,.pdf}
    await updateOrder(orderId, { status: "packaging" });
    console.log("Restructuring output...");
    mkdirSync(cleanDir, { recursive: true });
    const CATEGORIES = ["ai", "audit", "config", "governance", "guides", "hr", "legal", "privacy", "security", "vendor"];
    const FORMATS = [".md", ".html", ".docx", ".pdf"];
    let docCount = 0;

    for (const cat of CATEGORIES) {
      const catDir = join(outputDir, cat);
      let entries;
      try { entries = readdirSync(catDir, { withFileTypes: true }); } catch { continue; }
      const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith(".md"));

      for (const mdFile of mdFiles) {
        const stem = mdFile.name.replace(/\.md$/, "");
        const docName = stem.replace(/_/g, " ");
        const docFolder = join(cleanDir, cat, docName);
        mkdirSync(docFolder, { recursive: true });

        for (const ext of FORMATS) {
          const srcFile = join(catDir, stem + ext);
          try { renameSync(srcFile, join(docFolder, docName + ext)); } catch {}
        }
        docCount++;
      }
    }

    // 4. Zip
    console.log(`Creating ZIP (${docCount} documents)...`);
    await new Promise((resolve, reject) => {
      const output = createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(cleanDir, "compliance-docs");
      archive.finalize();
    });

    // 5. Upload to S3
    const s3Key = `orders/${stripeSessionId || Date.now()}/compliance-docs.zip`;
    console.log(`Uploading to S3: ${s3Key}`);
    const zipBuffer = readFileSync(zipPath);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: zipBuffer,
      ContentType: "application/zip",
    }));

    // 6. Presigned URL (24h)
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const downloadUrl = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
    }), { expiresIn: 86400 });

    // 7. Mark completed
    await updateOrder(orderId, {
      status: "completed",
      download_url: downloadUrl,
      document_count: docCount,
      s3_key: s3Key,
      completed_at: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ downloadUrl, documentCount: docCount, s3Key }),
    };
  } catch (error) {
    console.error("Generation failed:", error.message);
    await updateOrder(orderId, {
      status: "failed",
      download_url: "",
      completed_at: new Date().toISOString(),
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
};
