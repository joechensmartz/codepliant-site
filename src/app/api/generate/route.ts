import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
});

const LAMBDA_URL =
  process.env.LAMBDA_GENERATE_URL ||
  "https://sckh2y77zmfxs5njxuancarodu0gmiwo.lambda-url.us-east-1.on.aws/";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const { repoUrl, companyName, email, packageType } = session.metadata || {};

    if (!repoUrl) {
      return NextResponse.json({ error: "Missing repo URL in session" }, { status: 400 });
    }

    // Check credits
    const subRes = await supabaseFetch(
      `subscriptions?user_email=eq.${encodeURIComponent(email || "")}&status=eq.active&order=created_at.desc&limit=1`
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
        { error: `You've used all ${sub.credits_total} generations this month. Upgrade your plan or wait for renewal.` },
        { status: 403 }
      );
    }

    // Create order in Supabase with status "downloading"
    const orderRes = await supabaseFetch("orders", {
      method: "POST",
      body: JSON.stringify({
        stripe_session_id: session_id,
        email: email || "",
        company_name: companyName || "",
        repo_url: repoUrl,
        package_type: packageType || "starter",
        amount_cents: packageType === "pro" ? 3000 : 1000,
        status: "downloading",
        document_count: 0,
        s3_key: "",
        download_url: "",
      }),
    });

    const orders = await orderRes.json();
    const order = Array.isArray(orders) ? orders[0] : orders;

    if (!order?.id) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Deduct credit immediately
    await supabaseFetch(`subscriptions?id=eq.${sub.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        credits_used: sub.credits_used + 1,
        updated_at: new Date().toISOString(),
      }),
    });

    // Fire Lambda asynchronously — don't await response
    fetch(LAMBDA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        companyName: companyName || "",
        email: email || "",
        packageType: packageType || "starter",
        stripeSessionId: session_id,
        orderId: order.id,
      }),
    }).catch((err) => {
      console.error("Lambda fire-and-forget error:", err.message);
    });

    // Return immediately with order ID for polling
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
