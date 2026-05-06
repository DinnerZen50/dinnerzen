import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return NextResponse.json({
        received: true,
        message: "No customer email found",
      });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ has_paid: true })
      .eq("email", customerEmail);

    if (error) {
      console.error("Supabase update error:", error);
      return new NextResponse("Supabase update failed", { status: 500 });
    }

    console.log("User marked as paid:", customerEmail);
  }

  return NextResponse.json({ received: true });
}
