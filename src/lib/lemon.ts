import crypto from 'crypto';

const LEMON_API = 'https://api.lemonsqueezy.com/v1';

// ============================================
// MAPPING OFFRES → LEMON SQUEEZY VARIANTS
// ============================================

export const OFFERS = {
  'branding': {
    label: 'Branding — Identité visuelle',
    totalPrice: 250,
    variantEnvKey: 'LEMON_VARIANT_BRANDING',
    category: 'branding',
  },
  'contenu-1': {
    label: 'Contenu Social — 1 publication/semaine',
    totalPrice: 190,
    variantEnvKey: 'LEMON_VARIANT_CONTENU_1',
    category: 'contenu',
  },
  'contenu-2': {
    label: 'Contenu Social — 2 publications/semaine',
    totalPrice: 320,
    variantEnvKey: 'LEMON_VARIANT_CONTENU_2',
    category: 'contenu',
  },
  'contenu-3': {
    label: 'Contenu Social — 3 publications/semaine',
    totalPrice: 450,
    variantEnvKey: 'LEMON_VARIANT_CONTENU_3',
    category: 'contenu',
  },
  'contenu-4': {
    label: 'Contenu Social — 4 publications/semaine',
    totalPrice: 590,
    variantEnvKey: 'LEMON_VARIANT_CONTENU_4',
    category: 'contenu',
  },
  'site-statique': {
    label: 'Site web — Vitrine statique',
    totalPrice: 500,
    variantEnvKey: 'LEMON_VARIANT_SITE_STATIQUE',
    category: 'site',
  },
  'site-dynamique': {
    label: 'Site web — Application dynamique',
    totalPrice: 990,
    variantEnvKey: 'LEMON_VARIANT_SITE_DYNAMIQUE',
    category: 'site',
  },
} as const;

export type OfferId = keyof typeof OFFERS;

export function isValidOfferId(id: string): id is OfferId {
  return id in OFFERS;
}

export function getOffer(offerId: OfferId) {
  return OFFERS[offerId];
}

export function getDepositAmount(totalPrice: number): number {
  return Math.round(totalPrice * 0.5);
}

// ============================================
// CRÉATION CHECKOUT ACOMPTE
// ============================================

interface DepositCheckoutData {
  intentionId: string;
  variantId: string;
  depositAmount: number;
  offerLabel: string;
  clientEmail: string;
  clientName: string;
}

export async function createDepositCheckout(data: DepositCheckoutData): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!process.env.LEMONSQUEEZY_API_KEY || !process.env.LEMONSQUEEZY_STORE_ID) {
    console.warn('LemonSqueezy not configured — mode test.');
    return `${baseUrl}/merci?intention=${data.intentionId}&test=1`;
  }

  const response = await fetch(`${LEMON_API}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: data.clientEmail,
            name: data.clientName,
            custom: {
              intentionId: data.intentionId,
            },
          },
          product_options: {
            name: `Acompte — ${data.offerLabel}`,
            description: `Acompte 50% pour : ${data.offerLabel}. Le solde sera réglé à la livraison.`,
            redirect_url: `${baseUrl}/merci?intention=${data.intentionId}`,
          },
          checkout_options: {
            button_color: '#6366f1',
          },
        },
        relationships: {
          store: {
            data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID },
          },
          variant: {
            data: { type: 'variants', id: data.variantId },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('LemonSqueezy API error:', errorData);
    throw new Error('Impossible de créer la session de paiement');
  }

  const result = await response.json();
  return result.data.attributes.url as string;
}

// ============================================
// VÉRIFICATION WEBHOOK
// ============================================

export function verifyLemonWebhookSignature(signature: string, payload: string): boolean {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.warn('LEMONSQUEEZY_WEBHOOK_SECRET non configuré.');
    return process.env.NODE_ENV === 'development';
  }
  try {
    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');
    return signature === digest;
  } catch {
    return false;
  }
}
