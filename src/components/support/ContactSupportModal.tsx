import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  MessageCircle,
  Headphones,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportCategory, SupportPriority } from '../../types';
import { formatINR } from '../../utils/currency';
import { sfx } from '../../utils/sound';
import { RealSupportHeadsetIcon, WhatsAppIcon, TelegramIcon } from '../BrandIcons';

interface QuickPrompt {
  label: string;
  category: SupportCategory;
  subject: string;
  text: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: '⚡ Daily Return Query',
    category: 'investment',
    subject: 'Investment Daily Return Inquiry',
    text: 'Namaste Admin, mera active plan ka daily income kab credit hoga? Kripya status confirm karein.'
  },
  {
    label: '💰 Deposit Verification',
    category: 'recharge',
    subject: 'Deposit UTR Verification Request',
    text: 'Mera recharge UPI se successful ho gaya hai. Kripya mera wallet balance verify karke update karein.'
  },
  {
    label: '🏦 Withdrawal Payout Status',
    category: 'withdraw',
    subject: 'Withdrawal Payout Status Check',
    text: 'Maine withdrawal request submit kiya hai. Bank account mein payout kab tak credit hoga?'
  },
  {
    label: '👑 VIP Upgrade Help',
    category: 'vip',
    subject: 'VIP Tier Progression & Rewards',
    text: 'VIP tier upgrade aur exclusive high-return plans ke baare mein janna chahta hu. Guidance provide karein.'
  }
];

export const ContactSupportModal: React.FC = () => {
  const {
    isSupportModalOpen,
    setIsSupportModalOpen,
    user,
    plans,
    userPlans,
    adminSettings,
    sendSupportMessage,
    supportMessages
  } = useApp();

  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [category, setCategory] = useState<SupportCategory>('investment');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [priority, setPriority] = useState<SupportPriority>('normal');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll while modal is active
  useEffect(() => {
    if (!isSupportModalOpen || !mounted || typeof document === 'undefined') return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSupportModalOpen, mounted]);

  if (!mounted || !isSupportModalOpen || typeof document === 'undefined' || !document.body) return null;

  const userTickets = supportMessages.filter((m) => m.userId === user.id);
  const selectedUserPlan = userPlans.find((p) => p.id === selectedPlanId || p.planId === selectedPlanId);
  const selectedCatalogPlan = !selectedUserPlan ? plans.find((p) => p.id === selectedPlanId) : null;
  const selectedPlan = selectedUserPlan || selectedCatalogPlan;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const planTitle = selectedUserPlan?.title || selectedCatalogPlan?.title;
      const planId = selectedUserPlan?.planId || selectedUserPlan?.id || selectedCatalogPlan?.id;
      const res = await sendSupportMessage({
        category,
        subject: subject.trim() || (planTitle ? `Inquiry about ${planTitle}` : 'Investment Inquiry'),
        message: message.trim(),
        planTitle,
        planId,
        priority
      });

      if (res.success) {
        setMessage('');
        setSubject('');
        setSelectedPlanId('');
        setActiveTab('history');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPrompt = (prompt: QuickPrompt) => {
    sfx.playTap();
    setCategory(prompt.category);
    setSubject(prompt.subject);
    setMessage(prompt.text);
  };

  return createPortal(
    <div
      onClick={() => setIsSupportModalOpen(false)}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[92vh] cursor-default animate-scale-up my-auto"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 p-4 text-white border-b border-emerald-500/30">
          <button
            onClick={() => {
              sfx.playTap();
              setIsSupportModalOpen(false);
            }}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
              <RealSupportHeadsetIcon className="w-5.5 h-5.5" size={22} />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[12.5px] font-black tracking-wide text-white">
                  Contact Investment Support
                </h3>
                <span className="text-[7.5px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30">
                  24/7 Live
                </span>
              </div>
              <p className="text-[9px] text-emerald-200/80 mt-0.5">
                Official Helpdesk • Fast response to your investment questions
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-2 mt-2.5 pt-2 border-t border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setActiveTab('new');
              }}
              className={`flex-1 py-1 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <MessageCircle className="w-3 h-3" />
              <span>Send Message</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setActiveTab('history');
              }}
              className={`flex-1 py-1 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>My Tickets</span>
              {userTickets.length > 0 && (
                <span className="bg-amber-400 text-amber-950 text-[8.5px] font-black px-1.5 py-0.2 rounded-full">
                  {userTickets.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'new' ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Investor Account Snapshot */}
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/80 flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">
                    Investor Phone
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-[10px]">
                    +91 {user.phone || '9876543210'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">
                    Wallet Balance
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600 text-[10.5px]">
                    {formatINR(user.balance)}
                  </span>
                </div>
              </div>

              {/* Inquiry Category Pills */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Inquiry Topic
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'investment', label: '⚡ Investment Returns' },
                      { id: 'recharge', label: '💰 Recharge / Deposit' },
                      { id: 'withdraw', label: '🏦 Withdrawal Payout' },
                      { id: 'vip', label: '👑 VIP Tier & Bonus' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        sfx.playTap();
                        setCategory(cat.id);
                      }}
                      className={`p-1.5 rounded-xl text-[9.5px] font-bold text-left border transition-all cursor-pointer flex items-center justify-between ${
                        category === cat.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400 font-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {category === cat.id && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Investment Plan / Inquiry Subject */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 flex items-center justify-between">
                  <span>Related Investment Plan (Optional)</span>
                  {selectedPlan && (
                    <span className="text-[8.5px] font-bold text-emerald-600">
                      {selectedUserPlan ? '⚡ Active Plan' : '💼 Catalog'}
                    </span>
                  )}
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => {
                    setSelectedPlanId(e.target.value);
                    const chosen = userPlans.find((p) => p.id === e.target.value || p.planId === e.target.value) || plans.find((p) => p.id === e.target.value);
                    if (chosen && !subject) {
                      setSubject(`Inquiry regarding ${chosen.title}`);
                    }
                  }}
                  className="w-full text-[10.5px] p-2 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
                >
                  <option value="">General Support (No Specific Plan)</option>
                  {userPlans.length > 0 && (
                    <optgroup label="⚡ My Active Purchased Plans">
                      {userPlans.map((up) => (
                        <option key={`my-${up.id}`} value={up.id}>
                          {up.title} • {formatINR(up.depositAmount)} (Active)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {plans.length > 0 && (
                    <optgroup label="💼 All Available Plans (Investment Inquiry)">
                      {plans.map((p) => (
                        <option key={`catalog-${p.id}`} value={p.id}>
                          {p.title} • {formatINR(p.depositAmount)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                {/* Plan Snapshot Card when selected */}
                {selectedPlan && (
                  <div className="mt-1.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[10px] flex items-center justify-between animate-fade-in">
                    <div>
                      <span className="font-bold text-emerald-950 block truncate max-w-[220px]">
                        {selectedPlan.title}
                      </span>
                      <span className="text-[9px] text-emerald-700">
                        Deposit: <strong className="font-mono">{formatINR(selectedPlan.depositAmount)}</strong> • Daily: <strong className="font-mono">{formatINR(selectedPlan.dailyIncome)}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanId('');
                        if (subject.startsWith('Inquiry regarding')) setSubject('');
                      }}
                      className="text-[9px] text-gray-400 hover:text-gray-700 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Prompt Templates */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Quick Question Templates
                </label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={`qp-${idx}`}
                      type="button"
                      onClick={() => applyPrompt(prompt)}
                      className="text-[8.5px] py-0.5 px-2 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200/80 transition-colors cursor-pointer active:scale-95"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                    Your Message to Admin
                  </label>
                  <span className="text-[8.5px] text-gray-400 font-mono">
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question about your investment, return credit, or withdrawal..."
                  className="w-full text-[10.5px] p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-400 resize-none shadow-inner"
                />
              </div>

              {/* Priority Selector */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                  Priority
                </span>
                <div className="flex space-x-1">
                  {(['normal', 'urgent', 'high_value'] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => {
                        sfx.playTap();
                        setPriority(pr);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[8.5px] font-bold capitalize transition-all cursor-pointer ${
                        priority === pr
                          ? pr === 'urgent'
                            ? 'bg-rose-500 text-white font-black'
                            : pr === 'high_value'
                            ? 'bg-amber-500 text-white font-black'
                            : 'bg-emerald-500 text-white font-black'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pr === 'high_value' ? 'High Value' : pr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className={`w-full py-2 rounded-xl btn-chamkila text-white font-black text-[10.5px] flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                  isSubmitting || !message.trim() ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <Send className="w-3 h-3 shrink-0" />
                <span>{isSubmitting ? 'Sending to Admin...' : 'Send Message to Admin'}</span>
              </button>

              {/* Direct Instant Channels (WhatsApp / Telegram) with real brand vector icons */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 block text-center">
                  Or Connect Directly via Instant Channels
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <a
                    href={adminSettings.whatsappSupportUrl || 'https://wa.me/916203369638'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-[9.5px] font-bold flex items-center justify-center space-x-1.5 transition-colors group"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366] shrink-0" />
                    <span>WhatsApp Support</span>
                    <ExternalLink className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  </a>

                  <a
                    href={adminSettings.telegramSupportUrl || 'https://t.me/akm_official_support'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-[9.5px] font-bold flex items-center justify-center space-x-1.5 transition-colors group"
                  >
                    <TelegramIcon animated={true} className="w-3.5 h-3.5 fill-[#0088cc] shrink-0" />
                    <span>Telegram Support</span>
                    <ExternalLink className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                  </a>
                </div>
              </div>
            </form>
          ) : (
            /* Ticket History Tab */
            <div className="space-y-3">
              {userTickets.length === 0 ? (
                <div className="text-center py-6 px-3 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                  <RealSupportHeadsetIcon className="w-7 h-7 text-gray-300 mx-auto mb-1.5" size={28} />
                  <h4 className="text-[11px] font-bold text-gray-700">No Support Tickets Yet</h4>
                  <p className="text-[9.5px] text-gray-500 mt-0.5 max-w-xs mx-auto">
                    You haven't sent any messages yet. Click 'Send Message' above to reach out to the admin team.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className="mt-2.5 px-3 py-1 rounded-xl btn-chamkila text-white font-bold text-[9.5px]"
                  >
                    Send Your First Message
                  </button>
                </div>
              ) : (
                userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl p-2.5 border border-gray-200 shadow-xs space-y-1.5 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-black text-gray-900">
                            {ticket.subject}
                          </span>
                          <span className="text-[7.5px] font-mono text-gray-400">
                            #{ticket.id}
                          </span>
                        </div>
                        {ticket.planTitle && (
                          <span className="text-[8.5px] text-amber-600 font-bold block mt-0.5">
                            ⚡ {ticket.planTitle}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[8px] font-black px-1.5 py-0.2 rounded-full capitalize ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : ticket.status === 'in_progress'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        }`}
                      >
                        {ticket.status === 'resolved' ? '✓ Resolved' : '⏳ Reviewing'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-gray-50 text-[9.5px] text-gray-700 leading-relaxed border border-gray-100">
                      {ticket.message}
                    </div>

                    {/* Admin Reply Section if available */}
                    {ticket.adminReply && (
                      <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-0.5">
                        <div className="flex items-center space-x-1 text-emerald-900 font-black text-[9px]">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span>Admin Official Response</span>
                        </div>
                        <p className="text-[9.5px] text-emerald-950 font-medium">
                          {ticket.adminReply}
                        </p>
                        {ticket.repliedAt && (
                          <span className="text-[7.5px] text-emerald-600 block">
                            Replied at: {new Date(ticket.repliedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-[7.5px] text-gray-400 flex justify-between items-center pt-0.5">
                      <span>Submitted: {new Date(ticket.createdAt).toLocaleString()}</span>
                      <span className="capitalize font-mono">Priority: {ticket.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
