import { NextRequest, NextResponse } from 'next/server';
import { isValidOfferId, getOffer, getDepositAmount, createDepositCheckout } from '@/lib/lemon';
import { createOrderIntention } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
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

    // Récupérer le variant ID Lemon depuis les variables d'environnement
    const variantId = process.env[offer.variantEnvKey] ?? '';

    // Créer l'intention en Firestore
    const intentionId = await createOrderIntention({
      offerId,
      offerLabel: offer.label,
      totalPrice: offer.totalPrice,
      depositAmount,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientCompany: clientCompany?.trim() || undefined,
      clientDescription: clientDescription?.trim() || undefined,
      status: 'pending',
    });

    // Créer le checkout Lemon Squeezy
    const checkoutUrl = await createDepositCheckout({
      intentionId,
      variantId,
      depositAmount,
      offerLabel: offer.label,
      clientEmail: clientEmail.trim().toLowerCase(),
      clientName: clientName.trim(),
    });

    return NextResponse.json({ checkoutUrl, intentionId });
  } catch (error) {
    console.error('Error creating deposit checkout:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
