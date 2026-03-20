import { NextRequest, NextResponse } from "next/server";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s+/g, '');
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '');

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, companyName, email } = await req.json();

    if (!repoUrl || !email) {
      return NextResponse.json({ error: "Missing repo URL or email" }, { status: 400 });
    }

    // Check active subscription
    const subRes = await supabaseFetch(
      `subscriptions?user_email=eq.${encodeURIComponent(email)}&status=eq.active&order=created_at.desc&limit=1`
    );
    const subs = await subRes.json();

    if (!Array.isArray(subs) || subs.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found. Please subscribe first." },
        { status: 403 }
      );
    }

    const sub = subs[0];
    if (sub.credits_used >= sub.credits_total) {
      return NextResponse.json(
        { error: `You've used all ${sub.credits_total} generations this month. Upgrade or wait for renewal.` },
        { status: 403 }
      );
    }

    // Create order
    const orderRes = await supabaseFetch("orders", {
      method: "POST",
      body: JSON.stringify({
        email,
        company_name: companyName || "",
        repo_url: repoUrl,
        package_type: sub.plan,
        amount_cents: sub.plan === "pro" ? 3000 : 1000,
        status: "downloading",
        document_count: 0,
        s3_key: "",
        download_url: "",
        stripe_session_id: `gen-${Date.now()}`,
      }),
    });

    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : orders;

    if (!order?.id) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Deduct credit
    await supabaseFetch(`subscriptions?id=eq.${sub.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        credits_used: sub.credits_used + 1,
        updated_at: new Date().toISOString(),
      }),
    });

    // Fire Lambda async (Event = fire-and-forget, returns immediately)
    const lambda = new LambdaClient({
      region: (process.env.AWS_REGION || "us-east-1").replace(/\s+/g, ""),
      credentials: {
        accessKeyId: (process.env.AWS_ACCESS_KEY_ID || "").replace(/\s+/g, ""),
        secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || "").replace(/\s+/g, ""),
      },
    });
    lambda.send(new InvokeCommand({
      FunctionName: "codepliant-generate",
      InvocationType: "Event",
      Payload: new TextEncoder().encode(JSON.stringify({
        repoUrl,
        companyName: companyName || "",
        email,
        packageType: sub.plan,
        orderId: order.id,
      })),
    })).catch((err) => {
      console.error("Lambda invoke error:", err.message);
    });

    return NextResponse.json({
      orderId: order.id,
      status: "downloading",
      creditsRemaining: sub.credits_total - sub.credits_used - 1,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
