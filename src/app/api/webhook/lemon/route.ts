import { NextRequest, NextResponse } from 'next/server';
import { getOrders, updateOrderStatus, addOrderMessage } from '@/lib/firebase/marketplace';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(signature, body)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventName = event.meta?.event_name;

    console.log('LemonSqueezy webhook received:', eventName);

    // Handle different webhook events
    switch (eventName) {
      case 'order_created':
      case 'order_paid': {
        const orderData = event.data;
        const customData = orderData.attributes?.custom_data;

        if (!customData?.orderId) {
          console.error('No orderId in webhook payload');
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // Find order by orderId
        const allOrders = await getOrders();
        const order = allOrders.find((o) => o.orderId === customData.orderId);

        if (!order) {
          console.error('Order not found:', customData.orderId);
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // Update order status to paid
        await updateOrderStatus(order.id, 'paid');
        await addOrderMessage(
          order.id,
          'Paiement confirmé. Votre commande est en cours de traitement.',
          'system'
        );

        console.log('Order updated to paid:', order.orderId);
        break;
      }

      case 'order_refunded': {
        const orderData = event.data;
        const customData = orderData.attributes?.custom_data;

        if (!customData?.orderId) {
          console.error('No orderId in webhook payload');
          return NextResponse.json({ received: true }, { status: 200 });
        }

        const allOrders = await getOrders();
        const order = allOrders.find((o) => o.orderId === customData.orderId);

        if (!order) {
          console.error('Order not found:', customData.orderId);
          return NextResponse.json({ received: true }, { status: 200 });
        }

        await updateOrderStatus(order.id, 'cancelled');
        await addOrderMessage(
          order.id,
          'Commande remboursée et annulée.',
          'system'
        );

        console.log('Order refunded:', order.orderId);
        break;
      }

      default:
        console.log('Unhandled webhook event:', eventName);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
