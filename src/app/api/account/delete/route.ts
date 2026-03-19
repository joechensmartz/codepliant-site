import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').replace(/\s+/g, ''), {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
});

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s+/g, ''),
  (process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '')
);

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    // Verify the authenticated user matches the requested userId
    if (!userId || authUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: user ID mismatch" },
        { status: 403 }
      );
    }

    const email = authUser.email;
    if (!email) {
      return NextResponse.json(
        { error: "User has no email address" },
        { status: 400 }
      );
    }

    // 1. Cancel any active or past_due Stripe subscriptions
    const { data: subscriptions } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id, status")
      .eq("user_email", email);

    if (subscriptions) {
      for (const sub of subscriptions) {
        if (
          sub.stripe_subscription_id &&
          (sub.status === "active" || sub.status === "past_due")
        ) {
          try {
            await stripe.subscriptions.cancel(sub.stripe_subscription_id);
          } catch (stripeErr) {
            console.error(
              "Failed to cancel Stripe subscription:",
              sub.stripe_subscription_id,
              stripeErr
            );
          }
        }
      }

      // Delete subscription records
      const { error: subDeleteError } = await supabaseAdmin
        .from("subscriptions")
        .delete()
        .eq("user_email", email);

      if (subDeleteError) {
        console.error("Failed to delete subscription records:", subDeleteError);
      }
    }

    // 2. Delete user orders
    const { error: ordersDeleteError } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("email", email);

    if (ordersDeleteError) {
      console.error("Failed to delete order records:", ordersDeleteError);
    }

    // 3. Delete user leads
    const { error: leadsDeleteError } = await supabaseAdmin
      .from("leads")
      .delete()
      .eq("email", email);

    if (leadsDeleteError) {
      console.error("Failed to delete lead records:", leadsDeleteError);
    }

    // 4. Delete user from Supabase Auth (requires service role key)
    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(authUser.id);

    if (deleteError) {
      console.error("Failed to delete Supabase user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Account deletion error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
