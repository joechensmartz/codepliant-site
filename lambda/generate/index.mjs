import { execSync } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream, readFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET = process.env.S3_BUCKET_NAME || "codepliant-generated-docs";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export const handler = async (event) => {
  const { repoUrl, companyName, email, packageType, stripeSessionId } =
    typeof event.body === "string" ? JSON.parse(event.body) : event;

  const tmpDir = `/tmp/gen-${Date.now()}`;
  const repoDir = `${tmpDir}/repo`;
  const outputDir = `${tmpDir}/output`;
  const zipPath = `${tmpDir}/compliance-docs.zip`;

  try {
    mkdirSync(tmpDir, { recursive: true });

    // 1. Clone repo
    console.log(`Cloning ${repoUrl}...`);
    execSync(`git clone --depth 1 ${repoUrl} ${repoDir}`, {
      timeout: 60000,
      stdio: "pipe",
    });

    // 2. Install codepliant and generate
    console.log("Generating compliance documents...");
    execSync(
      `npx -y codepliant@1.1.1 go ${repoDir} -o ${outputDir} --company-name "${companyName || ""}" --contact-email "${email || ""}" --quiet`,
      { timeout: 120000, stdio: "pipe", env: { ...process.env, HOME: "/tmp" } }
    );

    // 3. Count documents
    const countOutput = execSync(`find ${outputDir} -type f | wc -l`, { encoding: "utf-8" }).trim();
    const documentCount = parseInt(countOutput) || 0;

    // 4. Zip output
    console.log("Creating ZIP...");
    await new Promise((resolve, reject) => {
      const output = createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(outputDir, "compliance-docs");
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

    // 6. Generate presigned URL (24h)
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const downloadUrl = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
    }), { expiresIn: 86400 });

    // 7. Update Supabase order
    if (SUPABASE_URL && SUPABASE_KEY && stripeSessionId) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/orders?stripe_session_id=eq.${stripeSessionId}`, {
          method: "PATCH",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            status: "completed",
            download_url: downloadUrl,
            document_count: documentCount,
            s3_key: s3Key,
            completed_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error("Supabase update failed:", e.message);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ downloadUrl, documentCount, s3Key }),
    };
  } catch (error) {
    console.error("Generation failed:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
};
