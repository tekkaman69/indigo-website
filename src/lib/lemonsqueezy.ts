import crypto from 'crypto';

const LEMON_API = 'https://api.lemonsqueezy.com/v1';

interface CheckoutData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: any[];
  magicToken: string;
}

/**
 * Creates a LemonSqueezy checkout session
 *
 * IMPORTANT: This function requires proper LemonSqueezy configuration.
 * Before using in production, you must:
 * 1. Create a LemonSqueezy account
 * 2. Create a product in your LemonSqueezy store
 * 3. Get your Store ID, Product ID, and Variant ID
 * 4. Set up environment variables in .env.local:
 *    - LEMONSQUEEZY_API_KEY
 *    - LEMONSQUEEZY_STORE_ID
 *    - LEMONSQUEEZY_PRODUCT_ID (optional, for single product setup)
 *    - LEMONSQUEEZY_VARIANT_ID (optional, for single variant setup)
 */
export async function createCheckout(data: CheckoutData): Promise<string> {
  // Check if LemonSqueezy is configured
  if (!process.env.LEMONSQUEEZY_API_KEY || !process.env.LEMONSQUEEZY_STORE_ID) {
    console.warn('LemonSqueezy not configured. Using test mode.');

    // Return a test URL for development
    // In production, this should throw an error
    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/success?orderId=${data.orderId}`;
    return successUrl;
  }

  try {
    const response = await fetch(`${LEMON_API}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: data.customerEmail,
              name: data.customerName,
              custom: {
                orderId: data.orderId,
                magicToken: data.magicToken,
              },
            },
            product_options: {
              name: 'Services Indigo',
              description: data.items.map((item) =>
                `${item.quantity}x ${item.serviceTitle}`
              ).join(', '),
              redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/success?orderId=${data.orderId}`,
            },
            checkout_options: {
              button_color: '#6366f1',
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: process.env.LEMONSQUEEZY_VARIANT_ID || '',
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LemonSqueezy API error:', errorData);
      throw new Error('Failed to create checkout session');
    }

    const result = await response.json();
    return result.data.attributes.url;
  } catch (error) {
    console.error('Error creating LemonSqueezy checkout:', error);
    throw error;
  }
}

/**
 * Verifies the webhook signature from LemonSqueezy
 *
 * IMPORTANT: Set LEMONSQUEEZY_WEBHOOK_SECRET in .env.local
 * You can find this in your LemonSqueezy webhook settings
 */
export function verifyWebhookSignature(signature: string, payload: string): boolean {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.warn('LEMONSQUEEZY_WEBHOOK_SECRET not configured. Skipping verification in development.');
    // In development, allow webhooks without verification
    // In production, this should return false
    return process.env.NODE_ENV === 'development';
  }

  try {
    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');
    return signature === digest;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Configuration Guide for LemonSqueezy
 *
 * 1. Create a LemonSqueezy account at https://lemonsqueezy.com
 *
 * 2. Create a Store:
 *    - Go to Settings > Stores
 *    - Note your Store ID
 *
 * 3. Create a Product:
 *    - Go to Products > New Product
 *    - Name it "Services Indigo" (or your preferred name)
 *    - Set it as a "Single Payment" product
 *    - Note the Product ID
 *
 * 4. Create a Variant:
 *    - Inside your product, create a variant
 *    - Set the price (this will be overridden by custom amounts)
 *    - Note the Variant ID
 *
 * 5. Generate API Key:
 *    - Go to Settings > API
 *    - Create a new API key
 *    - Copy the key (you won't see it again!)
 *
 * 6. Set up Webhook:
 *    - Go to Settings > Webhooks
 *    - Add new webhook endpoint: https://your-domain.com/api/webhook/lemon
 *    - Select events: order_created, order_paid, order_refunded
 *    - Copy the signing secret
 *
 * 7. Update .env.local:
 *    LEMONSQUEEZY_API_KEY=your_api_key_here
 *    LEMONSQUEEZY_STORE_ID=your_store_id_here
 *    LEMONSQUEEZY_PRODUCT_ID=your_product_id_here (optional)
 *    LEMONSQUEEZY_VARIANT_ID=your_variant_id_here
 *    LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
 *    NEXT_PUBLIC_BASE_URL=https://your-domain.com
 *
 * 8. Test the integration:
 *    - Use LemonSqueezy's test mode to verify webhooks work
 *    - Create a test order and check if the status updates correctly
 */
