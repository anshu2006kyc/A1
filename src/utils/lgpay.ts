/**
 * LGPay / ZXPay (WatchGLB Gateway) Integration Utility
 * Clean, production-grade implementation with insecure/redundant code removed.
 * Connects to endpoint https://api.watchglb.com/pay/web with MD5 signature.
 */

export interface LgPayPayinParams {
  orderId: string;
  amount: number;
  customerPhone?: string;
  userId?: number | string;
  notifyUrl?: string;
  pageUrl?: string;
}

export interface LgPayPayinResponse {
  success: boolean;
  orderId: string;
  checkoutUrl?: string;
  gateway?: string;
  fallback?: boolean;
  message?: string;
  data?: any;
}

/**
 * Creates an LGPay / WatchGLB pay-in order via server proxy /api/lgpay/payin.
 * Protects Merchant Key from browser exposure and handles MD5 signing server-side.
 */
export async function createLgPayPayinOrder(
  params: LgPayPayinParams
): Promise<LgPayPayinResponse> {
  try {
    const response = await fetch('/api/lgpay/payin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: params.orderId,
        amount: Number(params.amount),
        customer_phone: params.customerPhone || '9876543210',
        user_id: params.userId || 1,
        notify_url: params.notifyUrl,
        page_url: params.pageUrl
      })
    });

    const data = await response.json();

    if (response.ok && data.success && data.checkout_url) {
      return {
        success: true,
        orderId: params.orderId,
        checkoutUrl: data.checkout_url,
        gateway: 'lgpay',
        data: data.data || data
      };
    }

    if (data.checkout_url) {
      return {
        success: true,
        orderId: params.orderId,
        checkoutUrl: data.checkout_url,
        gateway: 'lgpay',
        fallback: data.fallback,
        message: data.message,
        data
      };
    }

    return {
      success: false,
      orderId: params.orderId,
      message: data.message || data.error || 'Failed to initialize LGPay checkout.',
      data
    };
  } catch (err: any) {
    console.error('Error in createLgPayPayinOrder:', err);
    return {
      success: false,
      orderId: params.orderId,
      message: err.message || 'Network error connecting to payment gateway server.'
    };
  }
}

/**
 * Generates unique Order ID for LGPay transactions: ORD + timestamp + 4 random digits
 */
export function generateLgPayOrderId(prefix: string = 'ORD'): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${timestamp}${random}`;
}
