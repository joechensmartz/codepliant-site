import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').replace(/\s+/g, ''), {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
});

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s+/g, '');
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '');

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...options.headers,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      (process.env.STRIPE_WEBHOOK_SECRET || '').replace(/\s+/g, '')
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Webhook event received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session:", {
          mode: session.mode,
          subscription: session.subscription,
          email: session.customer_email,
          metadata: session.metadata,
        });

        if (session.mode === "subscription" && session.subscription) {
          const now = new Date();
          const periodStart = now.toISOString();
          const periodEnd = new Date(now.getTime() + 30 * 86400000).toISOString();

          const plan = session.metadata?.packageType || "starter";
          const credits = plan === "pro" ? 30 : 5;

          const insertBody = {
            user_email: session.customer_email || session.metadata?.email || "",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan,
            credits_total: credits,
            credits_used: 0,
            status: "active",
            current_period_start: periodStart || new Date().toISOString(),
            current_period_end: periodEnd || new Date(Date.now() + 30 * 86400000).toISOString(),
          };

          console.log("Inserting subscription:", insertBody);

          const res = await supabaseFetch("subscriptions", {
            method: "POST",
            body: JSON.stringify(insertBody),
          });

          const resText = await res.text();
          console.log("Supabase insert response:", res.status, resText);
        }
        break;
      }

      case "invoice.paid": {
        // Subscription renewed — reset credits
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabaseFetch(
            `subscriptions?stripe_subscription_id=eq.${invoice.subscription}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                credits_used: 0,
                status: "active",
                updated_at: new Date().toISOString(),
              }),
            }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseFetch(
          `subscriptions?stripe_subscription_id=eq.${sub.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: "cancelled",
              updated_at: new Date().toISOString(),
            }),
          }
        );
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
