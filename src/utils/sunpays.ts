/**
 * Sunpays Gateway (ttpay.business) Integration Utility
 * Handles Pay-in (Deposit) order generation and checkout routing.
 */

export interface SunpaysPayinParams {
  orderId: string;
  amount: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  notifyUrl?: string;
}

export interface SunpaysPayinResponse {
  success: boolean;
  orderId: string;
  checkoutUrl?: string;
  paymentUrl?: string;
  id?: string;
  message?: string;
  data?: any;
}

const SUNPAYS_CLIENT_KEY = 'b6ff773b7d9d08bde80ef13ad8bd924cd3c9341aef4330f341272ee81b2ab6ad';
const SUNPAYS_CLIENT_SECRET = 'cd40986af39469dfca69eea8f3e5307f4b1293d9d9ec863f7c67d66e92a4ec2b';

async function calculateHmacSha256(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Creates a Sunpays Pay-in Order via server-side API proxy /api/sunpays/payin,
 * with direct client-side fallback for static Vercel deployments.
 */
export async function createSunpaysPayinOrder(
  params: SunpaysPayinParams
): Promise<SunpaysPayinResponse> {
  // Step 1: Try server-side proxy route first (works on standalone, Cloud Run, Vercel Serverless)
  try {
    const response = await fetch('/api/sunpays/payin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: params.orderId,
        amount: Number(params.amount),
        customer_name: params.customerName || 'AKM Investor',
        customer_phone: params.customerPhone || '9876543210',
        customer_email: params.customerEmail || 'investor@akm-portal.com',
        notify_url: params.notifyUrl
      })
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && (data.checkout_url || data.payment_url || data.redirect_url)) {
        return {
          success: true,
          orderId: params.orderId,
          id: data.id,
          checkoutUrl: data.checkout_url || data.payment_url || data.redirect_url,
          paymentUrl: data.payment_url || data.checkout_url,
          data
        };
      }
    }
  } catch (err) {
    console.warn('[Server Sunpays Payin Unreachable, trying direct upstream]', err);
  }

  // Step 2: Direct browser-to-gateway fallback for static Vercel hosting!
  try {
    const payload = {
      merchant_id: '353548',
      amount: Number(params.amount),
      currency: 'INR',
      order_id: params.orderId,
      customer_name: params.customerName || 'AKM Investor',
      customer_phone: params.customerPhone || '9876543210',
      customer_email: params.customerEmail || 'investor@akm-portal.com',
      notify_url: params.notifyUrl || `${window.location.origin}/api/sunpays/webhook`,
      redirect_url: `${window.location.origin}/pay/success?order_id=${params.orderId}`,
      method: 'upi'
    };

    const rawJson = JSON.stringify(payload);
    const signature = await calculateHmacSha256(SUNPAYS_CLIENT_SECRET, rawJson);

    const directRes = await fetch('https://ttpay.business/api/public/v1/payments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': SUNPAYS_CLIENT_KEY,
        'x-signature': signature
      },
      body: rawJson
    });

    const directData = await directRes.json();
    if (directData && (directData.checkout_url || directData.payment_url || directData.redirect_url)) {
      return {
        success: true,
        orderId: params.orderId,
        id: directData.id,
        checkoutUrl: directData.checkout_url || directData.payment_url || directData.redirect_url,
        paymentUrl: directData.payment_url || directData.checkout_url,
        data: directData
      };
    }
  } catch (directErr) {
    console.warn('[Direct Sunpays Upstream Exception]', directErr);
  }

  return {
    success: false,
    orderId: params.orderId,
    message: 'Unable to connect to SunPay gateway. Please check connection.'
  };
}

/**
 * Generates unique Order ID for Sunpays transactions
 */
export function generateSunpaysOrderId(prefix: string = 'SUN'): string {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}_${timestamp}_${random}`;
}
