import { NextRequest, NextResponse } from 'next/server';
import { isValidOfferId, getOffer, getDepositAmount, createDepositCheckout } from '@/lib/stripe';
import { adminCreateOrderIntention, getAdminDb } from '@/lib/firebase/admin';
import { createOrderIntention } from '@/lib/firebase/firestore';

// Rate limiting simple en mémoire — protège contre le spam de création d'intentions
const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans une minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { offerId, clientName, clientEmail, clientCompany, clientDescription } = body;

    // Validation
    if (!offerId || !isValidOfferId(offerId)) {
      return NextResponse.json({ error: 'Offre invalide' }, { status: 400 });
    }
    if (!clientName?.trim() || !clientEmail?.trim()) {
      return NextResponse.json({ error: 'Nom et email requis' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const offer = getOffer(offerId);
    const depositAmount = getDepositAmount(offer.totalPrice);

    // Créer l'intention en Firestore (status pending)
    // SDK admin de préférence ; fallback SDK client si service account absent
    // (la création publique d'intentions 'pending' est autorisée par les règles)
    const intentionData = {
      offerId,
      offerLabel: offer.label,
      totalPrice: offer.totalPrice,
      depositAmount,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientCompany: clientCompany?.trim() || undefined,
      clientDescription: clientDescription?.trim() || undefined,
      status: 'pending' as const,
    };
    const intentionId = getAdminDb()
      ? await adminCreateOrderIntention(intentionData)
      : await createOrderIntention(intentionData);

    // Créer la session Stripe Checkout
    const checkoutUrl = await createDepositCheckout({
      intentionId,
      offerId,
      clientEmail: clientEmail.trim().toLowerCase(),
      clientName: clientName.trim(),
    });

    return NextResponse.json({ checkoutUrl, intentionId });
  } catch (error) {
    if (error instanceof Error && error.message === 'STRIPE_NOT_CONFIGURED') {
      console.error('Stripe non configuré — paiement en ligne indisponible.');
      return NextResponse.json(
        { error: "Le paiement en ligne est temporairement indisponible. Contactez-nous sur WhatsApp pour finaliser votre commande." },
        { status: 503 }
      );
    }
    console.error('Error creating deposit checkout:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
