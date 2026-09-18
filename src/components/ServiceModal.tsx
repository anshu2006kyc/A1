import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, ExternalLink, Headphones, HelpCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { WhatsAppIcon, TelegramIcon } from './BrandIcons';

export const ServiceModal: React.FC<{ onClose?: () => void; supportUrl?: string; channelUrl?: string }> = ({
  onClose,
  supportUrl,
  channelUrl
}) => {
  const { adminSettings } = useApp();
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

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
      q: 'How does Instant UPI recharge work?',
      a: 'Our platform uses high-speed automated UPI pay-in channels. After entering your desired amount and clicking Pay, you will be directed to the secure UPI payment checkout. Pay with any UPI app (GPay, PhonePe, Paytm), and your wallet will be credited automatically via the instant webhook.'
    },
    {
      q: 'When will daily income credit to wallet?',
      a: 'Daily income is calculated automatically every 24 hours. You can claim it under "My Products" every day with one tap, or let it accrue.'
    },
    {
      q: 'What are withdrawal rules & timings?',
      a: `Withdrawals are open daily from ${adminSettings.withdrawStartTime} to ${adminSettings.withdrawEndTime} IST. Minimum withdrawal is ₹${adminSettings.minWithdraw}. Standard bank transfer processing time is 10 to 30 minutes.`
    },
    {
      q: 'Paid on UPI but balance not updated?',
      a: 'If your payment was completed on UPI, go to the Recharge screen, click "Already Paid? Submit 12-digit UTR", paste your 12-digit UTR / RRN number, or message our Telegram helpline with a screenshot for instant manual clearance.'
    }
  ];

  const handleClose = () => {
    sfx.playTap();
    if (onClose) onClose();
  };

  const toggleFaq = (idx: number) => {
    sfx.playTap();
    setSelectedFaq(selectedFaq === idx ? null : idx);
  };

  const activeSupportUrl = supportUrl || adminSettings.telegramSupportUrl;

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 relative cursor-default animate-scale-up my-auto max-h-[90vh] overflow-y-auto"
      >
        <button
          id="service-modal-close-x"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
            <Headphones className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-gray-900">AKM 24/7 Support Center</h3>
          <p className="text-xs text-gray-500 mt-0.5 max-w-[240px]">
            Fast assistance for UPI deposits, bank payouts, and investor queries.
          </p>

          {/* Direct Support Channels */}
          <div className="w-full space-y-2 mt-4 text-left">
            <a
              href={activeSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-sky-50 hover:bg-sky-100 rounded-2xl border border-sky-100 text-sky-800 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shrink-0">
                  <TelegramIcon className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold">Official Telegram Representative</div>
                  <div className="text-[10px] text-sky-600">@akm_official_support · Fast Reply</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href={adminSettings.whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-100 text-emerald-800 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold">WhatsApp Helpline</div>
                  <div className="text-[10px] text-emerald-600">Live Agent Desk</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Instant Self-Help FAQ Accordion */}
          <div className="w-full mt-4 pt-3 border-t border-gray-100 text-left">
            <div className="flex items-center space-x-1.5 text-xs font-extrabold text-gray-800 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Self-Help & FAQs</span>
            </div>

            <div className="space-y-1.5">
              {faqs.map((faq, idx) => (
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
