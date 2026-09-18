/**
 * WATCHPAY (WatchGLB Gateway) Integration Utility
 * Production-ready TypeScript module for WatchGLB payment gateway.
 * Endpoint: https://api.watchglb.com/pay/web with MD5 signature.
 */

export interface WatchPayPayinParams {
  orderId: string;
  amount: number;
  customerPhone?: string;
  userId?: number | string;
  notifyUrl?: string;
  pageUrl?: string;
}

export interface WatchPayPayinResponse {
  success: boolean;
  orderId: string;
  checkoutUrl?: string;
  directUrl?: string;
  payInfo?: string;
  gateway?: string;
  fallback?: boolean;
  message?: string;
  data?: any;
}

/**
 * Initiates a WatchPay / WatchGLB pay-in order via server proxy.
 * Protects Merchant Key from browser exposure and computes MD5 sign server-side.
 */
export async function createWatchPayPayinOrder(
  params: WatchPayPayinParams
): Promise<WatchPayPayinResponse> {
  try {
    const response = await fetch('/api/watchpay/payin', {
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
        directUrl: data.direct_url || data.checkout_url,
        payInfo: data.pay_info,
        gateway: 'watchpay',
        data: data.data || data
      };
    }

    if (data.checkout_url) {
      return {
        success: true,
        orderId: params.orderId,
        checkoutUrl: data.checkout_url,
        directUrl: data.direct_url || data.checkout_url,
        payInfo: data.pay_info,
        gateway: 'watchpay',
        fallback: data.fallback,
        message: data.message,
        data
      };
    }

    return {
      success: false,
      orderId: params.orderId,
      message: data.message || data.error || 'Failed to initialize WatchPay checkout.',
      data
    };
  } catch (err: any) {
    console.error('Error in createWatchPayPayinOrder:', err);
    return {
      success: false,
      orderId: params.orderId,
      message: err.message || 'Network error connecting to payment gateway server.'
    };
  }
}

/**
 * Generates unique Order ID for WatchPay transactions: ORD + timestamp + 4 random digits
 */
export function generateWatchPayOrderId(prefix: string = 'ORD'): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${timestamp}${random}`;
}
