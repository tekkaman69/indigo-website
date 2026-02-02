import { NextRequest, NextResponse } from 'next/server';
import { getOrderByToken, getOrderMessages, getOrderFiles } from '@/lib/firebase/marketplace';

interface RouteParams {
  params: { token: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      );
    }

    const order = await getOrderByToken(token);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    const [messages, files] = await Promise.all([
      getOrderMessages(order.id),
      getOrderFiles(order.id),
    ]);

    return NextResponse.json(
      {
        order,
        messages,
        files,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
