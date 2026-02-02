import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/firebase/marketplace';
import { createCheckout } from '@/lib/lemonsqueezy';

// Rate limiting (simple in-memory implementation)
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
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { items, customerName, customerEmail, total } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Informations client manquantes' },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Create order in Firestore
    const { orderId, magicToken } = await createOrder({
      customerName,
      customerEmail,
      items,
      total,
      status: 'pending',
    });

    // Create LemonSqueezy checkout session
    // For now, return a stub URL - will be implemented in Phase 7
    // TODO: Implement LemonSqueezy integration
    const checkoutUrl = await createCheckout({
      orderId,
      customerName,
      customerEmail,
      total,
      items,
      magicToken,
    });

    return NextResponse.json(
      {
        success: true,
        checkoutUrl,
        orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
