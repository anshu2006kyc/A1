import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  HelpCircle,
  X,
  CreditCard,
  Banknote,
  MessageCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { WhatsAppIcon, TelegramIcon } from './BrandIcons';

interface ServiceModalProps {
  onClose?: () => void;
  supportUrl?: string;
  channelUrl?: string;
  onOpenRecharge?: () => void;
  onOpenWithdraw?: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  onClose,
  supportUrl,
  channelUrl,
  onOpenRecharge,
  onOpenWithdraw
}) => {
  const { adminSettings, setCurrentView } = useApp();
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'recharge' | 'withdraw'>('all');

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const faqs = [
    {
      category: 'recharge',
      q: 'Paid on UPI but wallet not updated?',
      a: 'Deposits are 100% automated. Once payment is completed in your UPI app, your wallet balance will be credited instantly via our automated gateway. You can also tap the Recharge Service channel below for 24/7 assistance.'
    },
    {
      category: 'recharge',
      q: 'How does Instant UPI recharge work?',
      a: 'Our platform uses high-speed WatchPay & SunPay automated UPI pay-in channels. After selecting amount, pay with any UPI app (GPay, PhonePe, Paytm). Your wallet is auto-credited via instant webhook.'
    },
    {
      category: 'withdraw',
      q: 'What are withdrawal rules & timings?',
      a: `Withdrawals are open daily from ${adminSettings.withdrawStartTime || '07:00'} to ${adminSettings.withdrawEndTime || '18:00'} IST. Minimum withdrawal is ₹${adminSettings.minWithdraw || 150}. Bank IMPS transfer usually takes 10 to 30 minutes.`
    },
    {
      category: 'withdraw',
      q: 'Withdrawal status is pending / delayed?',
      a: 'During peak banking hours, IMPS banking channels may queue batches for 15-30 minutes. If delayed beyond 1 hour, tap the Withdrawal Service channel below with your Order ID for priority clearance.'
    }
  ];

  const filteredFaqs = activeTab === 'all' ? faqs : faqs.filter((f) => f.category === activeTab);

  const handleClose = () => {
    sfx.playTap();
    if (onClose) onClose();
  };

  const toggleFaq = (idx: number) => {
    sfx.playTap();
    setSelectedFaq(selectedFaq === idx ? null : idx);
  };

  const activeSupportUrl = supportUrl || adminSettings.telegramSupportUrl || 'https://t.me/akm_official_support';
  const activeWhatsappUrl = adminSettings.whatsappSupportUrl || 'https://wa.me/919876543210';

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 relative cursor-default animate-scale-up my-auto max-h-[92vh] overflow-y-auto"
      >
        <button
          id="service-modal-close-x"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer active:scale-95 z-10"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-inner border border-emerald-100">
            <Headphones className="w-6 h-6 stroke-[2.4]" />
          </div>
          <h3 className="text-base font-black text-gray-900 tracking-tight">
            AKM 24/7 Customer Service Desk
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 max-w-[250px]">
            Dedicated instant support for Recharge, Withdrawal & Account inquiries.
          </p>

          {/* Quick Filter Tabs: All, Recharge Service, Withdrawal Service */}
          <div className="mt-3.5 grid grid-cols-3 gap-1.5 w-full bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setActiveTab('all');
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'btn-chamkila text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Service
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setActiveTab('recharge');
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                activeTab === 'recharge'
                  ? 'btn-chamkila text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Recharge</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.playTap();
                setActiveTab('withdraw');
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                activeTab === 'withdraw'
                  ? 'btn-chamkila-dark text-white shadow-xs'
                  : 'text-teal-700 hover:text-teal-900'
              }`}
            >
              <Banknote className="w-3 h-3" />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Specialized Service Cards */}
          <div className="w-full space-y-2.5 mt-3.5 text-left">
            {/* 1. RECHARGE SERVICE CARD */}
            {(activeTab === 'all' || activeTab === 'recharge') && (
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#00ba58] text-white flex items-center justify-center shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-gray-900 flex items-center space-x-1">
                        <span>Recharge Service Desk</span>
                        <span className="text-[9px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Fast</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        Missing deposit & payment verification help
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                  <a
                    href={activeSupportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-emerald-800 hover:underline"
                  >
                    <span>Contact Recharge Agent</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onOpenRecharge && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onOpenRecharge();
                      }}
                      className="px-2.5 py-1 btn-chamkila text-white font-bold text-[10.5px] rounded-lg shadow-xs cursor-pointer"
                    >
                      Open Recharge
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2. WITHDRAWAL SERVICE CARD */}
            {(activeTab === 'all' || activeTab === 'withdraw') && (
              <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-gray-900 flex items-center space-x-1">
                        <span>Withdrawal Service Desk</span>
                        <span className="text-[9px] bg-teal-200/80 text-teal-800 px-1.5 py-0.2 rounded font-bold">IMPS</span>
                      </div>
                      <div className="text-[10px] text-teal-700 font-medium">
                        Delayed payouts, bank modification & clearance
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px]">
                  <a
                    href={activeSupportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-teal-800 hover:underline"
                  >
                    <span>Contact Payout Agent</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onOpenWithdraw && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onOpenWithdraw();
                      }}
                      className="px-2.5 py-1 btn-chamkila-dark text-white font-bold text-[10.5px] rounded-lg shadow-xs cursor-pointer"
                    >
                      Open Withdraw
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. DIRECT TELEGRAM & WHATSAPP CHANNELS */}
            <div className="space-y-2 pt-1">
              <a
                href={activeSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-sky-50 hover:bg-sky-100 rounded-2xl border border-sky-100 text-sky-900 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shadow-xs shrink-0">
                    <TelegramIcon className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Official Telegram Representative</div>
                    <div className="text-[10px] text-sky-600 font-medium">@akm_official_support · Live 24/7</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>

              <a
                href={activeWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-100 text-emerald-900 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">WhatsApp Direct Helpline</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Customer Help Agent Desk</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
            </div>
          </div>

          {/* Instant Self-Help FAQ Accordion */}
          <div className="w-full mt-3.5 pt-3 border-t border-gray-100 text-left">
            <div className="flex items-center space-x-1.5 text-xs font-extrabold text-gray-800 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Self-Help & FAQs</span>
            </div>

            <div className="space-y-1.5">
              {filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 overflow-hidden text-left"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-2.5 flex items-center justify-between text-left text-xs font-bold text-gray-800 hover:bg-gray-100/80 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {selectedFaq === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {selectedFaq === idx && (
                    <div className="p-2.5 pt-0 text-[11px] text-gray-600 leading-relaxed border-t border-gray-100/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            id="service-modal-close-btn"
            onClick={handleClose}
            className="w-full mt-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer active:scale-98"
          >
            Close Support Desk
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
