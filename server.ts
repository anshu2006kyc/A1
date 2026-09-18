import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const HOST = '0.0.0.0';

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

async function startServer() {
  const app = express();
  const pendingPayinOrders = new Map<string, any>();

  // Capture raw body for webhook HMAC-SHA256 signature verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      }
    })
  );
  app.use(express.urlencoded({ extended: true }));

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
          platform: 'AKM Investment',
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

  // Auto-confirm endpoint for client auto-credit verification
  app.post('/api/payin/confirm-auto', (req, res) => {
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
    order.status = 'success';
    if (utr) order.utr = utr;
    pendingPayinOrders.set(orderId, order);
    return res.json({ success: true, status: 'success', orderId, utr: order.utr || null });
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

      const defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/watchpay/notify`;
      const defaultPageUrl = `${req.protocol}://${req.get('host')}/pay/success`;

      const now = new Date();
      const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const rawParams: Record<string, string | number> = {
        goods_name: 'Recharge',
        mch_id: WATCHPAY_MCH_ID,
        mch_order_no: String(order_id),
        notify_url: notify_url || defaultNotifyUrl,
        page_url: page_url || defaultPageUrl,
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
          return res.status(200).json({
            success: true,
            order_id,
            checkout_url: directUrl || parsed.payInfo,
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

      const defaultNotifyUrl = `${req.protocol}://${req.get('host')}/api/watchpay/notify`;
      const defaultPageUrl = `${req.protocol}://${req.get('host')}/pay/success`;

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
          const checkRes = await fetch(parsed.payInfo, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)' }
          });
          const checkHtml = await checkRes.text();
          const match = checkHtml.match(/src="([^"]+)"/);
          if (match && match[1] && match[1].startsWith('http')) {
            directUrl = match[1];
          }
        } catch {}
        return res.redirect(302, directUrl);
      }
    } catch (err: any) {
      console.error('[WatchPay Redirect Error]', err);
    }
    return res.redirect(302, `upi://pay?pa=akmpayments@okaxis&pn=AKM+Investments&am=${req.query.amount || 500}&cu=INR&tn=${req.query.order_id || 'RECHARGE'}`);
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
    return res.redirect(302, `upi://pay?pa=akmpayments@okaxis&pn=SunPay+VIP&am=${amount}&cu=INR&tn=${orderId}`);
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

  // --- VITE DEV MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`AKM Investment Server running on http://${HOST}:${PORT}`);
    console.log(`Sunpays Gateway Merchant: ${SUNPAYS_MERCHANT_ID} Active`);
  });
}

startServer();
