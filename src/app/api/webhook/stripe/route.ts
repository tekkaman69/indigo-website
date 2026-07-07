import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
// SDK admin obligatoire : les règles Firestore interdisent la mise à jour
// des intentions sans authentification admin.
import { adminUpdateOrderIntention as updateOrderIntention } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook: STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant.');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const intentionId = session.metadata?.intentionId;

        if (!intentionId) {
          console.error('checkout.session.completed sans intentionId:', session.id);
          break;
        }
        // Paiement asynchrone (ex: virement SEPA) : attendre payment_status paid
        if (session.payment_status !== 'paid') {
          console.log('Session completed mais non payée (async):', session.id);
          break;
        }

        await updateOrderIntention(intentionId, {
          status: 'paid',
          paymentRef: session.id,
        });
        console.log('OrderIntention payée:', intentionId);
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const intentionId = session.metadata?.intentionId;
        if (intentionId) {
          await updateOrderIntention(intentionId, {
            status: 'paid',
            paymentRef: session.id,
          });
          console.log('OrderIntention payée (async):', intentionId);
        }
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const intentionId = session.metadata?.intentionId;
        if (intentionId) {
          await updateOrderIntention(intentionId, { status: 'failed' });
          console.log('OrderIntention échouée (async):', intentionId);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const intentionId = charge.metadata?.intentionId;
        if (intentionId) {
          await updateOrderIntention(intentionId, { status: 'failed' });
          console.log('OrderIntention remboursée:', intentionId);
        }
        break;
      }

      default:
        // Événements non gérés — ack silencieux
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
