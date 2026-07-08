import Stripe from 'stripe';
import { getOffer, getDepositAmount, type OfferId } from '@/lib/offers';

export { OFFERS, isValidOfferId, getOffer, getDepositAmount, type OfferId } from '@/lib/offers';

// ============================================
// CLIENT STRIPE (serveur uniquement)
// ============================================

/**
 * Retourne le client Stripe, ou null si la clé n'est pas configurée.
 * IMPORTANT : jamais de "mode test" silencieux — si Stripe n'est pas
 * configuré, l'appelant DOIT renvoyer une erreur au client, pas un faux succès.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

// ============================================
// CRÉATION CHECKOUT ACOMPTE
// ============================================

interface DepositCheckoutData {
  intentionId: string;
  offerId: OfferId;
  clientEmail: string;
  clientName: string;
}

/**
 * Crée une session Stripe Checkout pour le 1er versement (plan 3× sans
 * frais) d'un pack. Le prix est défini inline (price_data) — pas besoin de
 * produits pré-créés dans le dashboard Stripe.
 */
export async function createDepositCheckout(data: DepositCheckoutData): Promise<string> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('STRIPE_NOT_CONFIGURED');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const offer = getOffer(data.offerId);
  const depositAmount = getDepositAmount(offer.totalPrice);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: data.clientEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: depositAmount * 100, // centimes
          product_data: {
            name: `1er versement (3× sans frais) — ${offer.label}`,
            description: `Premier des 3 versements pour : ${offer.label} (total ${offer.totalPrice} €).`,
          },
        },
      },
    ],
    metadata: {
      intentionId: data.intentionId,
      offerId: data.offerId,
    },
    payment_intent_data: {
      metadata: {
        intentionId: data.intentionId,
        offerId: data.offerId,
      },
    },
    success_url: `${baseUrl}/merci?intention=${data.intentionId}`,
    cancel_url: `${baseUrl}/checkout?offer=${data.offerId}&cancelled=1`,
  });

  if (!session.url) {
    throw new Error('Stripe session created without URL');
  }
  return session.url;
}
