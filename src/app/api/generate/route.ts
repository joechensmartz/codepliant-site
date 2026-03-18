import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
});

const LAMBDA_URL =
  process.env.LAMBDA_GENERATE_URL ||
  "https://sckh2y77zmfxs5njxuancarodu0gmiwo.lambda-url.us-east-1.on.aws/";

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    const { repoUrl, companyName, email, packageType } = session.metadata || {};

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Missing repo URL in session" },
        { status: 400 }
      );
    }

    // Call Lambda to generate documents
    const lambdaResponse = await fetch(LAMBDA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoUrl,
        companyName: companyName || "",
        email: email || "",
        packageType: packageType || "bundle",
        stripeSessionId: session_id,
      }),
    });

    if (!lambdaResponse.ok) {
      const errBody = await lambdaResponse.text();
      console.error("Lambda error:", errBody);
      return NextResponse.json(
        { error: "Document generation failed" },
        { status: 500 }
      );
    }

    const result = await lambdaResponse.json();

    return NextResponse.json({
      downloadUrl: result.downloadUrl,
      documentCount: result.documentCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
