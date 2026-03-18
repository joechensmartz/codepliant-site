import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { execSync } from "child_process";
import { mkdirSync, rmSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET || "codepliant-generated-docs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const tmpBase = join("/tmp", "codepliant-" + Date.now());
  const repoDir = join(tmpBase, "repo");
  const outputDir = join(tmpBase, "output");
  const zipPath = join(tmpBase, "documents.zip");

  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify payment
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const { repoUrl, companyName, email, packageType } = session.metadata || {};
    if (!repoUrl) {
      return NextResponse.json({ error: "Missing repo URL in session" }, { status: 400 });
    }

    // Check for duplicate processing
    const { data: existing } = await supabase
      .from("orders")
      .select("download_url, document_count")
      .eq("stripe_session_id", session_id)
      .eq("status", "completed")
      .single();

    if (existing?.download_url) {
      return NextResponse.json({
        downloadUrl: existing.download_url,
        documentCount: existing.document_count,
        cached: true,
      });
    }

    // Insert pending order
    await supabase.from("orders").upsert(
      {
        stripe_session_id: session_id,
        email: email || session.customer_email || "",
        company_name: companyName || null,
        repo_url: repoUrl,
        package_type: packageType || "single",
        amount_cents: session.amount_total || 0,
        status: "processing",
      },
      { onConflict: "stripe_session_id" }
    );

    // Clone repo (shallow)
    mkdirSync(tmpBase, { recursive: true });
    execSync(`git clone --depth 1 ${repoUrl} ${repoDir}`, {
      timeout: 30000,
      stdio: "pipe",
    });

    // Run codepliant
    mkdirSync(outputDir, { recursive: true });
    const cliArgs = [
      `npx codepliant@1.1.1 go ${repoDir}`,
      `-o ${outputDir}`,
      companyName ? `--company-name "${companyName}"` : "",
      email ? `--contact-email "${email}"` : "",
      "--quiet",
    ]
      .filter(Boolean)
      .join(" ");

    execSync(cliArgs, { timeout: 45000, stdio: "pipe", cwd: tmpBase });

    // Count generated documents
    let documentCount = 0;
    if (existsSync(outputDir)) {
      const files = readdirSync(outputDir, { recursive: true }) as string[];
      documentCount = files.filter(
        (f: string) => f.endsWith(".md") || f.endsWith(".txt") || f.endsWith(".html")
      ).length;
    }

    // Zip output
    execSync(`cd ${outputDir} && zip -r ${zipPath} .`, {
      timeout: 10000,
      stdio: "pipe",
    });

    // Upload to S3
    const s3Key = `orders/${session_id}/codepliant-docs.zip`;
    const zipBuffer = readFileSync(zipPath);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: zipBuffer,
        ContentType: "application/zip",
        ContentDisposition: `attachment; filename="codepliant-docs.zip"`,
      })
    );

    // Generate presigned URL (24h)
    const downloadUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }),
      { expiresIn: 86400 }
    );

    // Update order in Supabase
    await supabase
      .from("orders")
      .update({
        status: "completed",
        download_url: downloadUrl,
        document_count: documentCount,
        s3_key: s3Key,
        completed_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session_id);

    return NextResponse.json({ downloadUrl, documentCount });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Cleanup
    try {
      if (existsSync(tmpBase)) {
        rmSync(tmpBase, { recursive: true, force: true });
      }
    } catch {
      // ignore cleanup errors
    }
  }
}
