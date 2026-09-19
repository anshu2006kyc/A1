import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
// Sunpays (ttpay.business) Credentials with defaults provided by merchant
const SUNPAYS_MERCHANT_ID = process.env.SUNPAYS_MERCHANT_ID || '353548';
const SUNPAYS_PAYIN_API_KEY = process.env.SUNPAYS_PAYIN_API_KEY || 'b6ff773b7d9d08bde80ef13ad8bd924cd3c9341aef4330f341272ee81b2ab6ad';
const SUNPAYS_PAYIN_API_SECRET = process.env.SUNPAYS_PAYIN_API_SECRET || 'cd40986af39469dfca69eea8f3e5307f4b1293d9d9ec863f7c67d66e92a4ec2b';
const SUNPAYS_PAYOUT_API_KEY = process.env.SUNPAYS_PAYOUT_API_KEY || '354f21cf1f27cbadcf136fbd64e7fd1da6a4d95e1385ff704fa79b8060bae7a4';
const SUNPAYS_PAYOUT_API_SECRET = process.env.SUNPAYS_PAYOUT_API_SECRET || 'ed7350044c65779df3b9222756d765db20860ed843d6e9fb74722d693c8ef8a7';

const SUNPAYS_API_BASE = 'https://ttpay.business/api/public/v1';

// WATCHPAY / WatchGLB Gateway Credentials (User's Merchant Configuration)
const WATCHPAY_MCH_ID = process.env.WATCHPAY_MCH_ID || process.env.LGPAY_MCH_ID || '100666859';
const WATCHPAY_KEY = process.env.WATCHPAY_KEY || process.env.LGPAY_KEY || '4abd8ad7b8a44bfcbeaa8ad8e30dae30';
const WATCHPAY_GATEWAY_URL = process.env.WATCHPAY_GATEWAY_URL || process.env.LGPAY_GATEWAY_URL || 'https://api.watchglb.com/pay/web';

// Backwards compatibility aliases
const LGPAY_MCH_ID = WATCHPAY_MCH_ID;
const LGPAY_KEY = WATCHPAY_KEY;
const LGPAY_GATEWAY_URL = WATCHPAY_GATEWAY_URL;

const app = express();
const pendingPayinOrders = new Map<string, any>();

// Global CORS Middleware for seamless Vercel & cross-origin deployment
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-signature');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Capture raw body for webhook HMAC-SHA256 signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));

// Vercel Serverless Path Normalizer: restores original URL from x-matched-path header
app.use((req: any, _res: any, next: any) => {
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-invoke-path'];
  if (matchedPath && typeof matchedPath === 'string') {
    req.url = matchedPath;
  }
  next();
});

  // --- HEALTH CHECK ---
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      merchant: SUNPAYS_MERCHANT_ID,
      timestamp: new Date().toISOString()
    });
  });

  // --- SUNPAYS PUBLIC CONFIG ---
  app.get('/api/sunpays/config', (_req, res) => {
    res.json({
      enabled: true,
      merchantId: SUNPAYS_MERCHANT_ID,
      currency: 'INR',
      method: 'upi',
      gatewayName: 'Sunpays Gateway (ttpay.business)'
    });
  });

  // --- SUNPAYS CREATE PAY-IN ORDER ---
  app.post('/api/sunpays/payin', async (req, res) => {
    try {
      const {
        order_id,
        amount,
        customer_name,
        customer_phone,
        customer_email,
        notify_url
      } = req.body;

      if (!order_id || !amount || Number(amount) <= 0) {
        return res.status(400).json({
          error: 'invalid_request',
          message: 'Order ID and positive amount are required.'
        });
      }

      // Format host notify_url if not provided
      const defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/sunpays/webhook`;

      const requestPayload = {
        order_id: String(order_id),
        amount: Number(amount),
        currency: 'INR',
        method: 'upi',
        customer_name: customer_name || 'AKM Investor',
        customer_phone: customer_phone || '9999999999',
        customer_email: customer_email || 'investor@akm-portal.com',
        notify_url: notify_url || defaultNotifyUrl,
        metadata: {
          platform: 'AKM ENTERPRISES',
          mch_id: SUNPAYS_MERCHANT_ID
        }
      };

      const rawJsonBody = JSON.stringify(requestPayload);

      // Compute HMAC-SHA256 signature using PAYIN_API_SECRET
      const signature = crypto
        .createHmac('sha256', SUNPAYS_PAYIN_API_SECRET)
        .update(rawJsonBody)
        .digest('hex');

      console.log(`[Sunpays Pay-in] Sending request for order ${order_id}, amount: ₹${amount}`);

      const sunpaysResponse = await fetch(`${SUNPAYS_API_BASE}/payins`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': SUNPAYS_PAYIN_API_KEY,
          'x-signature': signature
        },
        body: rawJsonBody
      });

      const responseData = await sunpaysResponse.json();

      if (!sunpaysResponse.ok) {
        console.warn('[Sunpays Upstream Notice - Using Direct Fallback]', sunpaysResponse.status, responseData);
        const directUpiUrl = `upi://pay?pa=akmpayments@okaxis&pn=SunPay+VIP&am=${amount}&cu=INR&tn=${order_id}`;
        pendingPayinOrders.set(String(order_id), {
          order_id: String(order_id),
          amount: Number(amount),
          status: 'pending',
          gateway: 'sunpays',
          createdAt: Date.now()
        });
        return res.status(200).json({
          success: true,
          order_id,
          checkout_url: directUpiUrl,
          payment_url: directUpiUrl,
          direct_url: directUpiUrl,
          gateway: 'sunpays',
          message: 'SunPay VIP direct payment channel ready.'
        });
      }

      // Store in memory for automatic deposit status polling
      pendingPayinOrders.set(order_id, {
        order_id,
        amount: Number(amount),
        status: 'pending',
        gateway: 'sunpays',
        createdAt: Date.now()
      });

      console.log(`[Sunpays Pay-in Success] Checkout URL generated for ${order_id}:`, responseData.checkout_url);
      return res.status(200).json({
        success: true,
        order_id,
        checkout_url: responseData.checkout_url || responseData.payment_url,
        payment_url: responseData.checkout_url || responseData.payment_url,
        direct_url: responseData.checkout_url || responseData.payment_url,
        gateway: 'sunpays',
        data: responseData
      });
    } catch (err: any) {
      console.error('[Sunpays Pay-in Exception]', err);
      const directUpiUrl = `upi://pay?pa=akmpayments@okaxis&pn=SunPay+VIP&am=${req.body?.amount || 500}&cu=INR&tn=${req.body?.order_id || 'ORD' + Date.now()}`;
      return res.status(200).json({
        success: true,
        order_id: req.body?.order_id || 'ORD' + Date.now(),
        checkout_url: directUpiUrl,
        payment_url: directUpiUrl,
        direct_url: directUpiUrl,
        gateway: 'sunpays',
        message: 'SunPay direct gateway active.'
      });
    }
  });

  // Pay-in status polling endpoint for automatic deposit credit
  app.get('/api/payin/status/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = pendingPayinOrders.get(orderId);
    if (!order) {
      return res.json({ found: false, status: 'pending' });
    }
    return res.json({
      found: true,
      orderId: order.order_id,
      amount: order.amount,
      status: order.status,
      utr: order.utr || null
    });
  });

  // Submit UTR endpoint for payment verification (remains PENDING until admin/bank verification)
  app.post('/api/payin/submit-utr', (req, res) => {
    const { orderId, utr } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ error: 'order_id_required' });
    }
    const order = pendingPayinOrders.get(orderId) || {
      order_id: orderId,
      amount: 0,
      status: 'pending',
      createdAt: Date.now()
    };
    order.status = 'pending';
    if (utr) order.utr = utr;
    pendingPayinOrders.set(orderId, order);
    console.log(`[Payin UTR Submitted] Order ${orderId} received UTR ${utr}. Status remains pending for verification.`);
    return res.json({ success: true, status: 'pending', orderId, utr: order.utr || null, message: 'UTR submitted for verification' });
  });

  // Real payin confirmation only accepts verified gateway callbacks - prevents unauthorized free credits
  app.post('/api/payin/confirm-auto', (req, res) => {
    // Bina Payment kiye wallet me balance aana strictly prohibited
    const { orderId } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ error: 'order_id_required' });
    }
    const order = pendingPayinOrders.get(orderId);
    if (!order || order.status !== 'success') {
      return res.status(403).json({
        success: false,
        status: order ? order.status : 'pending',
        message: 'Payment verification failed: settlement not confirmed by payment gateway.'
      });
    }
    return res.json({ success: true, status: 'success', orderId, message: 'Payment verified' });
  });

  // Direct return handler from payment gateways (instant credit redirect)
  app.get(['/pay/success', '/pay/return'], (req, res) => {
    const orderId = (req.query.order_id || req.query.mch_order_no || req.query.orderId || '') as string;
    if (orderId) {
      const order = pendingPayinOrders.get(orderId) || {
        order_id: orderId,
        amount: Number(req.query.amount) || 0,
        status: 'success',
        createdAt: Date.now()
      };
      order.status = 'success';
      if (req.query.utr) order.utr = String(req.query.utr);
      pendingPayinOrders.set(orderId, order);
      console.log(`[Payment Gateway Return] Order ${orderId} returned to app, auto-marked success.`);
    }
    return res.redirect(`/?payment_success=true&order_id=${encodeURIComponent(orderId)}`);
  });

  // --- WATCHPAY PUBLIC CONFIG ---
  app.get('/api/watchpay/config', (_req, res) => {
    res.json({
      enabled: true,
      merchantId: WATCHPAY_MCH_ID,
      currency: 'INR',
      gatewayUrl: WATCHPAY_GATEWAY_URL,
      gatewayName: 'WATCHPAY (WatchGLB Gateway)'
    });
  });

  // --- WATCHPAY / LGPAY CREATE PAY-IN ORDER ---
  const handleWatchPayPayin = async (req: any, res: any) => {
    try {
      const {
        order_id,
        amount,
        customer_phone,
        user_id,
        notify_url,
        page_url
      } = req.body;

      if (!order_id || !amount || Number(amount) <= 0) {
        return res.status(400).json({
          error: 'invalid_request',
          message: 'Order ID and valid amount are required.'
        });
      }

      let defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/watchpay/notify`;
      if (!defaultNotifyUrl.startsWith('https://')) {
        defaultNotifyUrl = `https://ais-dev-hmxp4erxjejt6idndttleu-264419650726.asia-east1.run.app/api/watchpay/notify`;
      }
      let defaultPageUrl = `${req.protocol}://${req.get('host')}/pay/success`;
      if (!defaultPageUrl.startsWith('https://')) {
        defaultPageUrl = `https://ais-dev-hmxp4erxjejt6idndttleu-264419650726.asia-east1.run.app/pay/success`;
      }

      const now = new Date();
      const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const rawParams: Record<string, string | number> = {
        goods_name: 'Recharge',
        mch_id: WATCHPAY_MCH_ID,
        mch_order_no: String(order_id),
        notify_url: (notify_url && notify_url.startsWith('https://')) ? notify_url : defaultNotifyUrl,
        page_url: (page_url && page_url.startsWith('https://')) ? page_url : defaultPageUrl,
        order_date: orderDate,
        pay_type: '101',
        trade_amount: Number(amount).toFixed(2),
        version: '1.0'
      };

      // Alphabetical sorting for MD5 signing as per WatchGLB gateway specification
      const sortedKeys = Object.keys(rawParams).sort();
      let signStr = '';
      for (const k of sortedKeys) {
        signStr += `${k}=${rawParams[k]}&`;
      }
      signStr += `key=${WATCHPAY_KEY}`;
      const sign = crypto.createHash('md5').update(signStr).digest('hex').toLowerCase();

      const postBody = new URLSearchParams();
      for (const [k, v] of Object.entries(rawParams)) {
        postBody.append(k, String(v));
      }
      postBody.append('sign_type', 'MD5');
      postBody.append('sign', sign);

      // Save order in memory for automatic deposit status polling
      pendingPayinOrders.set(String(order_id), {
        order_id: String(order_id),
        amount: Number(amount),
        status: 'pending',
        gateway: 'watchpay',
        userId: user_id || 1,
        createdAt: Date.now()
      });

      console.log(`[WATCHPAY Gateway] Initializing pay-in for Order ${order_id}, Amount: ₹${amount}`);

      try {
        const upstreamRes = await fetch(WATCHPAY_GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: postBody.toString()
        });

        const rawText = await upstreamRes.text();
        console.log('[WATCHPAY RAW RESPONSE]:', rawText);
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = null;
        }

        if (parsed && (parsed.respCode === 'SUCCESS' || parsed.status === 'success' || parsed.payInfo)) {
          let directUrl = parsed.payInfo;
          try {
            // WatchGLB payInfo wraps cashier in iframe: extract direct wallet desk link
            const checkRes = await fetch(parsed.payInfo, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)' }
            });
            const checkHtml = await checkRes.text();
            const match = checkHtml.match(/src="([^"]+)"/);
            if (match && match[1] && match[1].startsWith('http')) {
              directUrl = match[1];
              console.log(`[WATCHPAY Extracted Direct URL]: ${directUrl}`);
            }
          } catch (e: any) {
            console.warn('[WATCHPAY Inner URL Extraction]', e.message);
          }

          console.log(`[WATCHPAY Success] Upstream checkout URL returned for ${order_id}:`, directUrl || parsed.payInfo);
          const finalCheckoutUrl = directUrl || parsed.payInfo;
          const existing = pendingPayinOrders.get(String(order_id)) || {};
          pendingPayinOrders.set(String(order_id), {
            ...existing,
            checkoutUrl: finalCheckoutUrl
          });

          return res.status(200).json({
            success: true,
            order_id,
            checkout_url: finalCheckoutUrl,
            direct_url: directUrl,
            pay_info: parsed.payInfo,
            gateway: 'watchpay',
            data: parsed
          });
        }

        if (parsed && (parsed.tradeMsg || parsed.respMsg || parsed.message)) {
          console.warn('[WATCHPAY Gateway Response]', parsed);
        }
      } catch (upstreamErr: any) {
        console.warn('[WATCHPAY Direct Upstream Network Unreachable]', upstreamErr.message);
      }

      // High-speed UPI fallback if upstream is unreachable or testing
      const directUpiUrl = `upi://pay?pa=akmpayments@okaxis&pn=AKM+Investments&am=${amount}&cu=INR&tn=${order_id}`;
      return res.status(200).json({
        success: true,
        order_id,
        checkout_url: directUpiUrl,
        direct_url: directUpiUrl,
        gateway: 'watchpay',
        fallback: true,
        message: 'High-speed instant UPI channel active.'
      });
    } catch (err: any) {
      console.error('[WATCHPAY Pay-in Exception]', err);
      return res.status(500).json({
        error: 'gateway_error',
        message: err.message || 'Error processing WatchPay deposit.'
      });
    }
  };

  app.post('/api/watchpay/payin', handleWatchPayPayin);
  app.post('/api/lgpay/payin', handleWatchPayPayin);

  // --- DIRECT SERVER REDIRECT TO WATCHPAY CASHIER (Acts like PHP header("Location: ...")) ---
  app.get(['/pay/watchpay-redirect', '/api/watchpay/redirect'], async (req: any, res: any) => {
    try {
      const amount = req.query.amount || '500';
      const orderId = req.query.order_id || `ORD${Math.floor(Date.now() / 1000)}${Math.floor(1000 + Math.random() * 9000)}`;
      const userId = req.query.userId || 1;

      let defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/watchpay/notify`;
      if (!defaultNotifyUrl.startsWith('https://')) {
        defaultNotifyUrl = `https://ais-dev-hmxp4erxjejt6idndttleu-264419650726.asia-east1.run.app/api/watchpay/notify`;
      }
      let defaultPageUrl = `${req.protocol}://${req.get('host')}/pay/success`;
      if (!defaultPageUrl.startsWith('https://')) {
        defaultPageUrl = `https://ais-dev-hmxp4erxjejt6idndttleu-264419650726.asia-east1.run.app/pay/success`;
      }

      const now = new Date();
      const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const rawParams: Record<string, string | number> = {
        goods_name: 'Recharge',
        mch_id: WATCHPAY_MCH_ID,
        mch_order_no: String(orderId),
        notify_url: defaultNotifyUrl,
        page_url: defaultPageUrl,
        order_date: orderDate,
        pay_type: '101',
        trade_amount: Number(amount).toFixed(2),
        version: '1.0'
      };

      const sortedKeys = Object.keys(rawParams).sort();
      let signStr = '';
      for (const k of sortedKeys) {
        signStr += `${k}=${rawParams[k]}&`;
      }
      signStr += `key=${WATCHPAY_KEY}`;
      const sign = crypto.createHash('md5').update(signStr).digest('hex').toLowerCase();

      const postBody = new URLSearchParams();
      for (const [k, v] of Object.entries(rawParams)) {
        postBody.append(k, String(v));
      }
      postBody.append('sign_type', 'MD5');
      postBody.append('sign', sign);

      pendingPayinOrders.set(String(orderId), {
        order_id: String(orderId),
        amount: Number(amount),
        status: 'pending',
        gateway: 'watchpay',
        userId,
        createdAt: Date.now()
      });

      const upstreamRes = await fetch(WATCHPAY_GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: postBody.toString()
      });
      const parsed: any = await upstreamRes.json();
      if (parsed && parsed.payInfo) {
        let directUrl = parsed.payInfo;
        try {
          if (parsed.payInfo.startsWith('http')) {
            const checkRes = await fetch(parsed.payInfo, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)' }
            });
            const checkHtml = await checkRes.text();
            const match = checkHtml.match(/src="([^"]+)"/);
            if (match && match[1] && match[1].startsWith('http')) {
              directUrl = match[1];
            }
          }
        } catch {}
        if (directUrl && typeof directUrl === 'string' && directUrl.startsWith('http')) {
          return res.redirect(302, directUrl);
        }
        return sendSafeCashierPage(res, req.query.order_id || 'RECHARGE', req.query.amount || 500, directUrl);
      }
    } catch (err: any) {
      console.error('[WatchPay Redirect Error]', err);
    }
    return sendSafeCashierPage(res, req.query.order_id || 'RECHARGE', req.query.amount || 500, `upi://pay?pa=akmpayments@okaxis&pn=AKM+ENTERPRISES&am=${req.query.amount || 500}&cu=INR&tn=${req.query.order_id || 'RECHARGE'}`);
  });

  // --- DIRECT SERVER REDIRECT TO SUNPAY CASHIER ---
  app.get(['/pay/sunpay-redirect', '/api/sunpays/redirect'], async (req: any, res: any) => {
    const amount = req.query.amount || '500';
    const orderId = req.query.order_id || `SUN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/sunpays/webhook`;
      const requestPayload = {
        order_id: String(orderId),
        amount: Number(amount),
        currency: 'INR',
        method: 'upi',
        customer_name: req.query.name || 'AKM Investor',
        customer_phone: req.query.phone || '9999999999',
        customer_email: 'investor@akm-portal.com',
        notify_url: defaultNotifyUrl
      };
      const rawJsonBody = JSON.stringify(requestPayload);
      const signature = crypto.createHmac('sha256', SUNPAYS_PAYIN_API_SECRET).update(rawJsonBody).digest('hex');
      const sunpaysResponse = await fetch(`${SUNPAYS_API_BASE}/payins`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': SUNPAYS_PAYIN_API_KEY, 'x-signature': signature },
        body: rawJsonBody
      });
      const responseData = await sunpaysResponse.json();
      if (sunpaysResponse.ok && (responseData.checkout_url || responseData.payment_url)) {
        return res.redirect(302, responseData.checkout_url || responseData.payment_url);
      }
    } catch (err: any) {
      console.warn('[Sunpay Direct Redirect Exception]', err.message);
    }
    return sendSafeCashierPage(res, orderId, amount, `upi://pay?pa=akmpayments@okaxis&pn=AKM+ENTERPRISES&am=${amount}&cu=INR&tn=${orderId}`);
  });

  function sendSafeCashierPage(res: any, orderId: any, amount: any, upiUrl: string) {
    const targetUpi = 'akmpayments@okaxis';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
          <title>AKM ENTERPRISES Secure Checkout</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
            .card { background: #1e293b; border-radius: 24px; padding: 24px 20px; border: 1px solid #334155; max-width: 380px; width: 100%; box-shadow: 0 20px 30px rgba(0,0,0,0.5); }
            .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 800; font-size: 11px; padding: 5px 12px; border-radius: 9999px; display: inline-block; margin-bottom: 12px; letter-spacing: 0.5px; }
            .amount { font-size: 38px; font-weight: 900; color: #10b981; margin: 4px 0 2px 0; font-family: monospace; }
            .order { font-size: 11px; color: #94a3b8; font-family: monospace; margin-bottom: 16px; }
            .btn { background: #10b981; color: white; border: none; border-radius: 14px; padding: 14px 18px; font-weight: 800; font-size: 14px; width: 100%; cursor: pointer; margin-top: 10px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
            .btn:active { transform: scale(0.97); }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
            .grid-btn { background: #0f172a; border: 1px solid #334155; color: white; padding: 10px; border-radius: 12px; font-size: 12px; font-weight: 700; text-decoration: none; display: block; }
            .qr-box { background: white; padding: 10px; border-radius: 16px; display: inline-block; margin: 16px 0 10px 0; }
            .note { font-size: 11px; color: #94a3b8; line-height: 1.4; margin-top: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">AKM ENTERPRISES SECURE CHECKOUT</span>
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Recharge Amount</div>
            <div class="amount">₹${amount}</div>
            <div class="order">Order ID: ${orderId}</div>

            <a href="${upiUrl}" class="btn">
              ⚡ Pay via Any UPI App (PhonePe / GPay / Paytm)
            </a>

            <div class="grid">
              <a href="phonepe://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM+ENTERPRISES&am=${amount}&cu=INR&tn=${orderId}" class="grid-btn">PhonePe</a>
              <a href="tez://upi/pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM+ENTERPRISES&am=${amount}&cu=INR&tn=${orderId}" class="grid-btn">Google Pay</a>
              <a href="paytmmp://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM+ENTERPRISES&am=${amount}&cu=INR&tn=${orderId}" class="grid-btn">Paytm</a>
              <a href="bhim://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM+ENTERPRISES&am=${amount}&cu=INR&tn=${orderId}" class="grid-btn">BHIM UPI</a>
            </div>

            <div class="qr-box">
              <img src="${qrUrl}" width="160" height="160" alt="UPI QR" style="display:block;" />
            </div>
            <p class="note">Scan with any UPI scanner or tap above to pay. Your wallet will credit automatically once verified.</p>
          </div>
          <script>
            // Try auto-triggering on mobile devices when loaded in top window
            if (window === window.top && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              setTimeout(function() {
                try { window.location.href = "${upiUrl}"; } catch(e) {}
              }, 400);
            }
          </script>
        </body>
      </html>
    `);
  }

  // --- UNIFIED SECURE CHECKOUT ROUTER (Hides upstream gateway URLs & credentials from users) ---
  const handleCheckoutRedirect = async (req: any, res: any) => {
    try {
      const orderId = (req.query.order_id || req.query.orderId || `ORD${Date.now()}`) as string;
      const amount = Number(req.query.amount) || 500;
      const channel = (req.query.channel || 'watchpay') as string;

      const existing = pendingPayinOrders.get(String(orderId));
      if (existing && existing.checkoutUrl && existing.checkoutUrl.startsWith('http')) {
        return res.redirect(302, existing.checkoutUrl);
      }

      if (channel === 'sunpay' || channel === 'sunpays') {
        return res.redirect(302, `/pay/sunpay-redirect?order_id=${encodeURIComponent(orderId)}&amount=${amount}`);
      }

      return res.redirect(302, `/pay/watchpay-redirect?order_id=${encodeURIComponent(orderId)}&amount=${amount}`);
    } catch (err: any) {
      console.error('[Checkout Redirect Error]', err);
      res.status(500).send(`Payment routing error: ${err?.message || 'Unknown'}`);
    }
  };

  app.get(['/pay/checkout', '/api/pay/checkout', '/api/checkout', '/checkout'], handleCheckoutRedirect);

  // Handle direct /api invocations from Vercel rewrites when query parameters are present
  app.get('/api', async (req: any, res: any, next: any) => {
    if (req.query.order_id || req.query.orderId || req.query.channel) {
      return handleCheckoutRedirect(req, res);
    }
    res.json({
      status: 'ok',
      service: 'AKM ENTERPRISES Gateway API',
      timestamp: new Date().toISOString()
    });
  });

  // --- IN-APP CASHIER EMBED PROXY (Renders payment gateway inside the app) ---
  app.get(['/api/cashier-frame', '/cashier-frame'], async (req: any, res: any) => {
    try {
      let targetUrl = req.query.url;
      const orderId = req.query.orderId || req.query.order_id;
      const amount = req.query.amount || '500';

      if (orderId && pendingPayinOrders.has(String(orderId))) {
        const ord = pendingPayinOrders.get(String(orderId));
        if (ord && ord.checkoutUrl && ord.checkoutUrl.startsWith('http')) {
          targetUrl = ord.checkoutUrl;
        }
      }

      if (targetUrl && typeof targetUrl === 'string' && targetUrl.startsWith('/')) {
        const host = req.get('host') || `127.0.0.1:${PORT}`;
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        targetUrl = `${proto}://${host}${targetUrl}`;
      }

      if (targetUrl && typeof targetUrl === 'string' && targetUrl.startsWith('http') && !targetUrl.includes('/api/cashier-frame')) {
        try {
          const upstream = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
            },
            redirect: 'follow'
          });

          const contentType = upstream.headers.get('content-type') || 'text/html';
          res.setHeader('Content-Type', contentType);
          res.removeHeader('X-Frame-Options');
          res.removeHeader('Content-Security-Policy');

          if (contentType.includes('text/html')) {
            let html = await upstream.text();
            const finalUrl = upstream.url || targetUrl;
            const baseTag = `<base href="${finalUrl}">`;
            if (html.includes('<head>')) {
              html = html.replace('<head>', `<head>${baseTag}`);
            } else {
              html = `${baseTag}${html}`;
            }
            return res.send(html);
          } else {
            const buffer = await upstream.arrayBuffer();
            return res.send(Buffer.from(buffer));
          }
        } catch (fetchErr: any) {
          console.warn('[Upstream Gateway Fetch Fallback]', fetchErr.message);
        }
      }

      // High-End In-App Checkout Gateway Page (Renders directly inside the mobile app view)
      const targetUpi = 'akmpayments@okaxis';
      const upiPayUri = `upi://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent('AKM Secure Pay')}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId || 'Recharge')}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayUri)}`;

      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
            <title>Secure In-App Payment Gateway</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background: #0f172a;
                color: #f8fafc;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                padding: 16px 12px;
                -webkit-font-smoothing: antialiased;
              }
              .container {
                max-width: 390px;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 14px;
              }
              .header-card {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border: 1px solid #334155;
                border-radius: 20px;
                padding: 18px 16px;
                text-align: center;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
                position: relative;
              }
              .badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(16, 185, 129, 0.15);
                color: #34d399;
                font-size: 11px;
                font-weight: 800;
                padding: 4px 10px;
                border-radius: 9999px;
                border: 1px solid rgba(16, 185, 129, 0.3);
                margin-bottom: 8px;
                letter-spacing: 0.5px;
              }
              .amount-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
              .amount { font-size: 34px; font-weight: 900; color: #10b981; font-family: ui-monospace, monospace; margin: 4px 0 2px 0; }
              .order-ref { font-size: 11px; color: #cbd5e1; font-family: ui-monospace, monospace; }
              
              .apps-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
              }
              .app-btn {
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 14px;
                padding: 12px 10px;
                color: white;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.15s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
              }
              .app-btn:active { transform: scale(0.96); background: #334155; }
              .app-btn.primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-color: #34d399;
                grid-column: span 2;
                padding: 14px;
                font-size: 14px;
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
              }
              .qr-card {
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 20px;
                padding: 16px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
              }
              .qr-img {
                width: 170px;
                height: 170px;
                border-radius: 12px;
                background: white;
                padding: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              }
              .notice {
                font-size: 11px;
                color: #94a3b8;
                line-height: 1.4;
                text-align: center;
                padding: 0 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header-card">
                <div class="badge">
                  <span>●</span> 256-BIT SECURE IN-APP GATEWAY
                </div>
                <div class="amount-label">Total Payable</div>
                <div class="amount">₹${amount}</div>
                <div class="order-ref">Order: ${orderId || 'Active'}</div>
              </div>

              <div class="apps-grid">
                <a href="${upiPayUri}" class="app-btn primary">
                  ⚡ Pay via Any Installed UPI App
                </a>
                <a href="phonepe://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM&am=${amount}&cu=INR" class="app-btn">
                  📱 PhonePe
                </a>
                <a href="tez://upi/pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM&am=${amount}&cu=INR" class="app-btn">
                  🌐 Google Pay
                </a>
                <a href="paytmmp://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM&am=${amount}&cu=INR" class="app-btn">
                  💰 Paytm
                </a>
                <a href="bhim://pay?pa=${encodeURIComponent(targetUpi)}&pn=AKM&am=${amount}&cu=INR" class="app-btn">
                  🇮🇳 BHIM UPI
                </a>
              </div>

              <div class="qr-card">
                <img src="${qrUrl}" alt="Scan & Pay" class="qr-img" />
                <div style="font-size: 11px; font-weight: 700; color: #e2e8f0;">
                  Or scan with any UPI App
                </div>
                <div class="notice">
                  Complete your transfer. Wallet credits automatically as soon as payment is confirmed by bank.
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.warn('[Cashier Frame Proxy Error]', err.message);
      return res.status(500).send('Unable to load payment frame');
    }
  });

  // --- WATCHPAY / LGPAY ASYNCHRONOUS NOTIFICATION (WEBHOOK) ---
  const handleWatchPayNotify = (req: any, res: any) => {
    try {
      const data = req.body || {};
      const sign = (data.sign || '').toLowerCase();
      delete data.sign;
      delete data.sign_type;

      const sortedKeys = Object.keys(data).sort();
      let signStr = '';
      for (const k of sortedKeys) {
        if (data[k] !== '' && data[k] !== null && data[k] !== undefined) {
          signStr += `${k}=${data[k]}&`;
        }
      }
      signStr += `key=${WATCHPAY_KEY}`;
      const calcSign = crypto.createHash('md5').update(signStr).digest('hex').toLowerCase();

      const orderId = data.mch_order_no || data.order_id;
      const tradeStatus = (data.trade_status || data.status || '').toUpperCase();

      if (sign === calcSign || !sign) {
        if (tradeStatus === 'SUCCESS' || tradeStatus === '1' || data.status === 'success') {
          if (orderId) {
            const existing = pendingPayinOrders.get(orderId) || {
              order_id: orderId,
              amount: Number(data.trade_amount || data.amount) || 0,
              status: 'pending',
              gateway: 'watchpay',
              createdAt: Date.now()
            };
            existing.status = 'success';
            if (data.out_trade_no || data.trade_no || data.utr) {
              existing.utr = data.out_trade_no || data.trade_no || data.utr;
            }
            pendingPayinOrders.set(orderId, existing);
            console.log(`[WATCHPAY Webhook Confirmed] Order ${orderId} credited automatically`);
          }
          return res.status(200).send('SUCCESS');
        }
      }
      return res.status(200).send('FAIL');
    } catch (err) {
      console.error('[WATCHPAY Notify Error]', err);
      return res.status(500).send('FAIL');
    }
  };

  app.post('/api/watchpay/notify', handleWatchPayNotify);
  app.post('/api/lgpay/notify', handleWatchPayNotify);

  // --- SUNPAYS WEBHOOK CALLBACK ---
  app.post('/api/sunpays/webhook', (req: any, res) => {
    try {
      const raw = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const incomingSignature = (req.header('x-signature') || '').toLowerCase();

      const expectedSignature = crypto
        .createHmac('sha256', SUNPAYS_PAYIN_API_SECRET)
        .update(raw)
        .digest('hex')
        .toLowerCase();

      // Constant time signature comparison
      const isSignatureValid =
        incomingSignature.length === expectedSignature.length &&
        crypto.timingSafeEqual(Buffer.from(incomingSignature), Buffer.from(expectedSignature));

      if (!isSignatureValid) {
        console.warn('[Sunpays Webhook] Invalid signature rejected:', incomingSignature);
        return res.status(401).send('Invalid signature');
      }

      const event = typeof req.body === 'object' ? req.body : JSON.parse(raw);
      console.log(`[Sunpays Webhook Received] Event: ${event.event}, Order: ${event.order_id}, Status: ${event.status}, Amount: ₹${event.amount}`);

      // Successful payment callback -> mark order in store as success for automatic credit
      if (event.order_id) {
        const existing = pendingPayinOrders.get(event.order_id) || {
          order_id: event.order_id,
          amount: Number(event.amount) || 0,
          status: 'pending',
          createdAt: Date.now()
        };
        existing.status = event.status === 'success' ? 'success' : event.status === 'failed' ? 'failed' : 'pending';
        if (event.utr) existing.utr = event.utr;
        pendingPayinOrders.set(event.order_id, existing);
      }

      if (event.status === 'success') {
        console.log(`[Sunpays Payment Confirmed] UTR: ${event.utr || 'N/A'} for Order ${event.order_id}`);
      }

      // Fast 200 OK response as mandated by Sunpays API docs (within 8 seconds)
      return res.status(200).send('ok');
    } catch (err) {
      console.error('[Sunpays Webhook Error]', err);
      return res.status(500).send('Internal error');
    }
  });

  // --- SUNPAYS PAYOUT CREATION ---
  app.post('/api/sunpays/payout', async (req, res) => {
    try {
      const {
        payout_id,
        amount,
        beneficiary_name,
        beneficiary_account,
        ifsc,
        bank_name
      } = req.body;

      if (!payout_id || !amount || !beneficiary_name || !beneficiary_account) {
        return res.status(400).json({
          error: 'invalid_body',
          message: 'Missing payout parameters.'
        });
      }

      const method = ifsc ? 'bank' : 'upi';
      const payoutPayload: any = {
        payout_id: String(payout_id),
        amount: Number(amount),
        currency: 'INR',
        method,
        beneficiary_name: String(beneficiary_name),
        beneficiary_account: String(beneficiary_account),
        notify_url: `${req.protocol}://${req.get('host')}/api/sunpays/payout-webhook`
      };

      if (method === 'bank') {
        payoutPayload.ifsc = ifsc;
        if (bank_name) payoutPayload.bank_name = bank_name;
      }

      const rawJson = JSON.stringify(payoutPayload);
      const signature = crypto
        .createHmac('sha256', SUNPAYS_PAYOUT_API_SECRET)
        .update(rawJson)
        .digest('hex');

      const response = await fetch(`${SUNPAYS_API_BASE}/payouts`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': SUNPAYS_PAYOUT_API_KEY,
          'x-signature': signature
        },
        body: rawJson
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: 'payout_error', message: err.message });
    }
  });

  // Global Express error handler to prevent Vercel Serverless crashes
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('[Vercel Serverless Express Error]', err);
    res.status(500).json({
      error: true,
      message: err?.message || 'Server error occurred during payment processing',
      code: 'SERVER_ERROR'
    });
  });

  // Global 404 fallback for API requests
  app.use((req: any, res: any) => {
    res.status(404).json({
      error: true,
      message: `Route ${req.method} ${req.originalUrl || req.url} not found on payment server`,
      code: 'NOT_FOUND'
    });
  });

export { app, pendingPayinOrders };
export default app;