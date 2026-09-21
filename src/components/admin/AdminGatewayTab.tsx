import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  CreditCard,
  ExternalLink,
  Key,
  Loader2,
  Play,
  Send,
  ShieldCheck,
  Terminal,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import { createSunpaysPayinOrder, generateSunpaysOrderId } from '../../utils/sunpays';
import { createLgPayPayinOrder, generateLgPayOrderId } from '../../utils/lgpay';

export const AdminGatewayTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    transactions,
    simulateWebhook,
    showToast
  } = useApp();

  const [activeGatewayTab, setActiveGatewayTab] = useState<'lgpay' | 'sunpays' | 'simulator' | 'integration'>('lgpay');
  const [form, setForm] = useState({ ...adminSettings });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Webhook Simulator State
  const pendingDeposits = transactions.filter((t) => t.type === 'recharge' && t.status === 'pending');
  const [simOrderId, setSimOrderId] = useState(pendingDeposits[0]?.orderId || 'ORD1726000001');
  const [simStatus, setSimStatus] = useState<'success' | 'failed'>('success');

  // LGPay Live Tester State
  const [lgpayTestAmount, setLgpayTestAmount] = useState(500);
  const [lgpayTestPhone, setLgpayTestPhone] = useState('9876543210');
  const [isTestingLgpay, setIsTestingLgpay] = useState(false);
  const [lgpayTestResult, setLgpayTestResult] = useState<any>(null);

  // Sunpays Live Tester State
  const [sunpaysTestAmount, setSunpaysTestAmount] = useState(500);
  const [sunpaysTestName, setSunpaysTestName] = useState('Admin Test');
  const [sunpaysTestPhone, setSunpaysTestPhone] = useState('9876543210');
  const [isTestingSunpays, setIsTestingSunpays] = useState(false);
  const [sunpaysTestResult, setSunpaysTestResult] = useState<any>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings(form);
    showToast('Payment gateway configurations saved successfully!', 'success');
  };

  const handleTestLgPayPayin = async () => {
    setIsTestingLgpay(true);
    setLgpayTestResult(null);

    const testId = generateLgPayOrderId('ORD_TEST');
    try {
      const res = await createLgPayPayinOrder({
        orderId: testId,
        amount: lgpayTestAmount,
        customerPhone: lgpayTestPhone,
        userId: 'admin_test'
      });

      setLgpayTestResult(res);
      if (res.success) {
        showToast('LGPay Order created successfully! (URL Generated)', 'success');
      } else {
        showToast(res.message || 'LGPay returned error.', 'error');
      }
    } catch (err: any) {
      setLgpayTestResult({ success: false, message: err.message });
      showToast(err.message, 'error');
    } finally {
      setIsTestingLgpay(false);
    }
  };

  const handleTestSunpaysPayin = async () => {
    setIsTestingSunpays(true);
    setSunpaysTestResult(null);

    const testId = generateSunpaysOrderId('SUN_ADM');
    try {
      const res = await createSunpaysPayinOrder({
        orderId: testId,
        amount: sunpaysTestAmount,
        customerName: sunpaysTestName,
        customerPhone: sunpaysTestPhone,
        customerEmail: 'admin@akm-wealth.com'
      });

      setSunpaysTestResult(res);
      if (res.success) {
        showToast('Sunpays Pay-in Order created successfully! (HTTP 200/201)', 'success');
      } else {
        showToast(res.message || 'Sunpays returned an error.', 'error');
      }
    } catch (err: any) {
      setSunpaysTestResult({ success: false, message: err.message });
      showToast(err.message, 'error');
    } finally {
      setIsTestingSunpays(false);
    }
  };

  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simOrderId.trim()) {
      showToast('Please enter an Order ID', 'error');
      return;
    }
    simulateWebhook(simOrderId.trim(), simStatus);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    showToast('Code copied to clipboard!', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const watchglbPhpCode = `<?php
// WatchGLB (LGPay) Deposit Script
error_reporting(E_ALL);
ini_set('display_errors', 1);

$raw_amount = isset($_GET['amount']) ? $_GET['amount'] : 0;
$amount = floatval($raw_amount); 
$user_id = isset($_GET['uid']) ? intval($_GET['uid']) : 0;

if($amount <= 0 || $user_id <= 0){
    die("Error: URL mein amount aur uid missing hai! Example: zxpay.php?amount=100&uid=60");
}

// Merchant Details
$merchant_key = "${adminSettings.lgpayMerchantKey || '4abd8ad7b8a44bfcbeaa8ad8e30dae30'}";
$mch_id = "${adminSettings.lgpayMerchantId || '100666859'}";
$mch_order_no = "ORD" . time() . rand(1000, 9999);
$order_date = date("Y-m-d H:i:s");

// Signature Generation with Alphabetical Sorting
$data = array(
    "mch_id" => $mch_id,
    "mch_order_no" => $mch_order_no,
    "pay_type" => "101",
    "trade_amount" => $amount,
    "order_date" => $order_date,
    "goods_name" => "VIP Recharge",
    "notify_url" => "https://yourdomain.com/api/lgpay/notify",
    "page_url" => "https://yourdomain.com"
);

ksort($data);
$sign_str = "";
foreach ($data as $k => $v) {
    if ($v != "" && $k != "sign") {
        $sign_str .= $k . "=" . $v . "&";
    }
}
$sign_str .= "key=" . $merchant_key;
$sign = md5($sign_str);
$data["sign"] = $sign;

// Send to WatchGLB Gateway
$ch = curl_init("https://api.watchglb.com/pay/web");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
$response = curl_exec($ch);
curl_close($ch);

$res = json_decode($response, true);
if (isset($res['data']['payUrl'])) {
    header("Location: " . $res['data']['payUrl']);
    exit();
}
echo "Gateway Error: " . $response;`;

  const sunpaysNodeWebhookCode = `// Sunpays Gateway HMAC-SHA256 Webhook Handler (Express.js Backend)
const crypto = require('crypto');

app.post('/api/sunpays/webhook', (req, res) => {
  const secret = "${adminSettings.sunpaysPayinSecret}";
  const incomingSig = req.headers['x-signature'] || '';
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (incomingSig.toLowerCase() !== expectedSig.toLowerCase()) {
    return res.status(401).send('Invalid HMAC-SHA256 signature');
  }

  const { event, order_id, status, amount, utr } = req.body;
  if (status === 'success') {
    // 1. Credit user balance in database
    // 2. Mark order as settled
    console.log(\`Deposit success for \${order_id}, UTR: \${utr}\`);
  }

  // Acknowledge within 8 seconds as per Sunpays API spec
  res.status(200).send('ok');
});`;

  return (
    <div className="space-y-4">
      {/* Gateway Status Header */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">SUNPAY & WATCHPAY Dual Payment Engine</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE (2 GATEWAYS)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-speed deposit channels: SUNPAY (ttPay) and WATCHPAY (WatchGLB MD5)
            </p>
          </div>
        </div>

        {/* Channel Selector Toggle */}
        <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl border border-slate-700 gap-1">
          <button
            onClick={() => setActiveGatewayTab('lgpay')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeGatewayTab === 'lgpay'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>WATCHPAY (WatchGLB)</span>
            <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 py-0.2 rounded font-mono">
              VIP
            </span>
          </button>
          <button
            onClick={() => setActiveGatewayTab('sunpays')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeGatewayTab === 'sunpays'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SUNPAY (ttPay)</span>
          </button>
          <button
            onClick={() => setActiveGatewayTab('simulator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeGatewayTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Webhook Simulator</span>
          </button>
          <button
            onClick={() => setActiveGatewayTab('integration')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeGatewayTab === 'integration'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Integration Code</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MASTER DEFAULT PAYMENT GATEWAY SELECTOR                      */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-5 rounded-3xl border border-emerald-500/30 shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Default Payment Gateway Selector</h4>
              <p className="text-xs text-slate-400">Choose which gateway is preselected or enforced when users tap "Recharge / Deposit"</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-center">
            Active: {(form.defaultGateway || form.selectedDepositGateway || 'watchpay').toUpperCase()}
          </span>
        </div>

        {/* 3 Gateway Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Option 1: WatchPay */}
          <div
            onClick={() => {
              const updated = { ...form, defaultGateway: 'watchpay' as const, selectedDepositGateway: 'watchpay' as const };
              setForm(updated);
              updateAdminSettings(updated);
              showToast('Default Gateway set to WatchPay (WatchGLB Engine)!', 'success');
            }}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              (form.defaultGateway || 'watchpay') === 'watchpay'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">WatchPay (Channel 1)</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                (form.defaultGateway || 'watchpay') === 'watchpay' ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
              }`}>
                {(form.defaultGateway || 'watchpay') === 'watchpay' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Fast automated UPI desk • WatchGLB MD5 signing • Direct Cashier
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2 font-bold">
              Customer Label: "UPI Fast Pay (Channel 1)"
            </div>
          </div>

          {/* Option 2: Sunpays */}
          <div
            onClick={() => {
              const updated = { ...form, defaultGateway: 'sunpays' as const, selectedDepositGateway: 'sunpays' as const };
              setForm(updated);
              updateAdminSettings(updated);
              showToast('Default Gateway set to SunPay (TTPay Engine)!', 'success');
            }}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              form.defaultGateway === 'sunpays'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">SunPay (Channel 2)</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                form.defaultGateway === 'sunpays' ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
              }`}>
                {form.defaultGateway === 'sunpays' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Automated VIP clearing • TTPay Business REST API
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2 font-bold">
              Customer Label: "UPI Express (Channel 2)"
            </div>
          </div>

          {/* Option 3: Auto / Multi-Channel */}
          <div
            onClick={() => {
              const updated = { ...form, defaultGateway: 'auto' as const, selectedDepositGateway: 'all' as const };
              setForm(updated);
              updateAdminSettings(updated);
              showToast('Default Gateway set to Multi-Channel Auto!', 'success');
            }}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              form.defaultGateway === 'auto' || form.selectedDepositGateway === 'all'
                ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">Multi-Channel Mode</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                form.defaultGateway === 'auto' || form.selectedDepositGateway === 'all' ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
              }`}>
                {(form.defaultGateway === 'auto' || form.selectedDepositGateway === 'all') && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Users see both Channel 1 & Channel 2 • Smart load balancing
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2 font-bold">
              Both channels active
            </div>
          </div>
        </div>

        <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center justify-between">
          <span>🔒 Customer Privacy: Internal gateway names (WatchPay / SunPay) are hidden from end users. Users only see clean "UPI Channel 1" and "UPI Channel 2" branded with <strong>AKM ENTERPRISES</strong>.</span>
        </div>
      </div>

      {/* --- TAB: LGPAY (WATCHGLB) GATEWAY CONFIGURATION --- */}
      {activeGatewayTab === 'lgpay' && (
        <div className="space-y-4 animate-fade-in">
          <form
            onSubmit={handleSaveConfig}
            className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  LGPay (WatchGLB) Gateway Configuration
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MERCHANT #{form.lgpayMerchantId || '100666859'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Merchant ID (`mch_id`)</label>
                <input
                  type="text"
                  value={form.lgpayMerchantId}
                  onChange={(e) => setForm({ ...form, lgpayMerchantId: e.target.value })}
                  placeholder="100666859"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Gateway Priority Flow</label>
                <select
                  value={form.gatewayPriority}
                  onChange={(e: any) => setForm({ ...form, gatewayPriority: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="sunpays_first">SUNPAY First (ttPay VIP UPI)</option>
                  <option value="lgpay_first">WATCHPAY First (WatchGLB 1-Click)</option>
                  <option value="auto_failover">Auto Smart Failover</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold block mb-1">Merchant Key (`merchant_key`)</label>
                <input
                  type="text"
                  value={form.lgpayMerchantKey}
                  onChange={(e) => setForm({ ...form, lgpayMerchantKey: e.target.value })}
                  placeholder="4abd8ad7b8a44bfcbeaa8ad8e30dae30"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">WatchGLB Pay-in API Endpoint</label>
                <input
                  type="text"
                  value={form.lgpayPayinUrl}
                  onChange={(e) => setForm({ ...form, lgpayPayinUrl: e.target.value })}
                  placeholder="https://api.watchglb.com/pay/web"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Webhook Notification URL (`notify_url`)</label>
                <input
                  type="text"
                  value={form.lgpayNotifyUrl}
                  onChange={(e) => setForm({ ...form, lgpayNotifyUrl: e.target.value })}
                  placeholder="/api/lgpay/notify"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Sorted key MD5 signatures (ksort + merchant key) are generated server-side via /api/lgpay/payin.
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Save LGPay Config
              </button>
            </div>
          </form>

          {/* Interactive LGPay Live Tester */}
          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live WatchGLB Pay-in Tester & URL Generator
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                api.watchglb.com/pay/web
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Create an instant test order on the live WatchGLB LGPay Gateway using your Merchant ID ({form.lgpayMerchantId}).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Amount (₹)</label>
                <input
                  type="number"
                  value={lgpayTestAmount}
                  onChange={(e) => setLgpayTestAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Customer Phone</label>
                <input
                  type="text"
                  value={lgpayTestPhone}
                  onChange={(e) => setLgpayTestPhone(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                disabled={isTestingLgpay}
                onClick={handleTestLgPayPayin}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {isTestingLgpay ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calling WatchGLB...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Test LGPay Order Creation</span>
                  </>
                )}
              </button>
            </div>

            {lgpayTestResult && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono space-y-2 mt-2 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-[11px] font-bold">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lgpayTestResult.success
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {lgpayTestResult.success ? 'ORDER PREPARED' : 'ERROR'}
                  </span>
                </div>

                {lgpayTestResult.checkoutUrl && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-slate-400 text-[10px]">Payment Checkout URL:</div>
                    <a
                      href={lgpayTestResult.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 break-all text-xs font-bold underline flex items-center space-x-1"
                    >
                      <span>{lgpayTestResult.checkoutUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                )}

                <div className="text-slate-400 text-[10px] pt-1">Response Data:</div>
                <pre className="text-slate-300 overflow-x-auto text-[10.5px] p-2 bg-slate-900 rounded-lg">
                  {JSON.stringify(lgpayTestResult.data || lgpayTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 1: SUNPAYS GATEWAY CONFIGURATION --- */}
      {activeGatewayTab === 'sunpays' && (
        <div className="space-y-4 animate-fade-in">
          <form
            onSubmit={handleSaveConfig}
            className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Sunpays Gateway API Configuration
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MERCHANT #{form.sunpaysMerchantId || '353548'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Merchant ID (`mchId`)</label>
                <input
                  type="text"
                  value={form.sunpaysMerchantId}
                  onChange={(e) => setForm({ ...form, sunpaysMerchantId: e.target.value })}
                  placeholder="353548"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Active Deposit Channel</label>
                <select
                  value={form.selectedDepositGateway}
                  onChange={(e: any) => setForm({ ...form, selectedDepositGateway: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="sunpays">Sunpays Gateway (Recommended)</option>
                  <option value="all">Auto-Failover Mode (Sunpays + Direct UPI)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pay-in API Key</label>
                <input
                  type="text"
                  value={form.sunpaysPayinKey}
                  onChange={(e) => setForm({ ...form, sunpaysPayinKey: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pay-in API Secret (HMAC Key)</label>
                <input
                  type="password"
                  value={form.sunpaysPayinSecret}
                  onChange={(e) => setForm({ ...form, sunpaysPayinSecret: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Payout API Key</label>
                <input
                  type="text"
                  value={form.sunpaysPayoutKey}
                  onChange={(e) => setForm({ ...form, sunpaysPayoutKey: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Payout API Secret</label>
                <input
                  type="password"
                  value={form.sunpaysPayoutSecret}
                  onChange={(e) => setForm({ ...form, sunpaysPayoutSecret: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                HMAC-SHA256 signatures are generated server-side using `/api/sunpays/payin`. Secrets are never exposed.
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Save Sunpays Config
              </button>
            </div>
          </form>

          {/* Interactive Sunpays Live Tester */}
          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Sunpays Pay-in Tester & Checkout Generator
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ttpay.business/api/public/v1/payins
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Create an instant test order on the live Sunpays Gateway. This tests your HMAC-SHA256 signature and returns the live hosted checkout URL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Amount (INR)</label>
                <input
                  type="number"
                  value={sunpaysTestAmount}
                  onChange={(e) => setSunpaysTestAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Customer Name</label>
                <input
                  type="text"
                  value={sunpaysTestName}
                  onChange={(e) => setSunpaysTestName(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Customer Phone</label>
                <input
                  type="text"
                  value={sunpaysTestPhone}
                  onChange={(e) => setSunpaysTestPhone(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                disabled={isTestingSunpays}
                onClick={handleTestSunpaysPayin}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {isTestingSunpays ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calling Gateway...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Generate Test Pay-in Order</span>
                  </>
                )}
              </button>
            </div>

            {sunpaysTestResult && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono space-y-2 mt-2 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-[11px] font-bold">Result:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sunpaysTestResult.success
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {sunpaysTestResult.success ? 'HTTP 201 CREATED' : 'ERROR'}
                  </span>
                </div>

                {sunpaysTestResult.checkoutUrl && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-slate-400 text-[10px]">Hosted Checkout URL:</div>
                    <a
                      href={sunpaysTestResult.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 break-all text-xs font-bold underline flex items-center space-x-1"
                    >
                      <span>{sunpaysTestResult.checkoutUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                )}

                <div className="text-slate-400 text-[10px] pt-1">Raw API Payload:</div>
                <pre className="text-slate-300 overflow-x-auto text-[10.5px] p-2 bg-slate-900 rounded-lg">
                  {JSON.stringify(sunpaysTestResult.data || sunpaysTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Express.js Webhook Integration Snippet */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Sunpays HMAC-SHA256 Webhook Implementation
                </h4>
              </div>
              <button
                onClick={() => copyCode(sunpaysNodeWebhookCode, 'sunpays-express')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
              >
                {copiedCode === 'sunpays-express' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'sunpays-express' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
              {sunpaysNodeWebhookCode}
            </pre>
          </div>
        </div>
      )}

      {/* --- TAB 2: WEBHOOK SIMULATOR --- */}
      {activeGatewayTab === 'simulator' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3.5 shadow-md">
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Simulate Instant Webhook Callback
              </h4>
            </div>

            <p className="text-xs text-slate-400">
              Simulates incoming server-to-server callback from Sunpays Gateway. Updates pending deposits to 'completed' or 'rejected'.
            </p>

            <form onSubmit={handleRunSimulator} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Target Order ID</label>
                <input
                  type="text"
                  value={simOrderId}
                  onChange={(e) => setSimOrderId(e.target.value)}
                  placeholder="ORD1726000001"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Callback Status</label>
                <select
                  value={simStatus}
                  onChange={(e: any) => setSimStatus(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                >
                  <option value="success">Success (Auto-Credit Deposit)</option>
                  <option value="failed">Failed (Decline Deposit)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Webhook</span>
                </button>
              </div>
            </form>
          </div>

          {/* Pending Deposits Quick-Select */}
          <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Pending Deposits Awaiting Callback ({pendingDeposits.length})
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Click to autofill</span>
            </div>

            {pendingDeposits.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No pending deposit orders found.</p>
            ) : (
              <div className="space-y-2">
                {pendingDeposits.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      if (d.orderId) setSimOrderId(d.orderId);
                    }}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-400">{d.orderId}</div>
                      <div className="text-[10px] text-slate-400">{d.createdAt} • {d.method}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white tabular-nums font-mono">{formatINR(d.amount)}</div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                        PENDING
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: INTEGRATION CODE --- */}
      {activeGatewayTab === 'integration' && (
        <div className="space-y-4 animate-fade-in">
          {/* WatchGLB (LGPay) Implementation Snippet */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  WatchGLB (LGPay) PHP Pay-in Implementation
                </h4>
              </div>
              <button
                onClick={() => copyCode(watchglbPhpCode, 'watchglb-php')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
              >
                {copiedCode === 'watchglb-php' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'watchglb-php' ? 'Copied' : 'Copy PHP Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Exact WatchGLB (LGPay) integration script with sorted key MD5 signing (ksort + merchant key) pointing to https://api.watchglb.com/pay/web.
            </p>

            <pre className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-56">
              {watchglbPhpCode}
            </pre>
          </div>

          {/* Sunpays Express.js Implementation Snippet */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Express.js HMAC-SHA256 Webhook Implementation
                </h4>
              </div>
              <button
                onClick={() => copyCode(sunpaysNodeWebhookCode, 'express-webhook')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
              >
                {copiedCode === 'express-webhook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'express-webhook' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Mount this webhook handler in your server to handle real-time deposit confirmations. It verifies HMAC-SHA256 signature against your configured Pay-in API Secret.
            </p>

            <pre className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-56">
              {sunpaysNodeWebhookCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
