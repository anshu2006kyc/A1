import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  MoreHorizontal,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppIcon, TelegramIcon } from '../components/BrandIcons';

export const ShareView: React.FC = () => {
  const { user, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inviteCode = user.inviteCode || '46748';
  const shareUrl = `${window.location.origin}?ref=${inviteCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    showToast('Invite code copied!', 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join AKM ENTERPRISES & earn daily profits! Use my invite code: ${inviteCode}`;
    let targetUrl = '';
    if (platform === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + shareUrl)}`;
    } else if (platform === 'telegram') {
      targetUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'AKM ENTERPRISES',
          text: text,
          url: shareUrl
        }).catch(() => handleCopyLink());
      } else {
        handleCopyLink();
      }
      return;
    }

    if (targetUrl) {
      try {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        handleCopyLink();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top Graphic Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0a4a25] via-[#0d6e37] to-[#128a47] text-white p-5 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-200 uppercase tracking-widest">
          <span>AKM ENTERPRISES</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">GROWING TOGETHER</span>
        </div>

        <div className="text-2xl font-black mt-2 tracking-tight">
          Refer & Earn <br />
          <span className="text-emerald-300">up to 30%</span>
        </div>

        {/* Enterprise Growth Illustration */}
        <div className="relative h-20 mt-2 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-400/30 flex flex-col items-center justify-center shadow-lg -rotate-3 backdrop-blur-xs">
              <span className="text-[10px] font-black text-emerald-300">L1</span>
              <span className="text-xs font-black text-white mt-0.5">25%</span>
            </div>
            <div className="w-18 h-20 rounded-2xl bg-gradient-to-b from-emerald-500 to-[#008f4c] border-2 border-emerald-300 flex flex-col items-center justify-center shadow-2xl z-10">
              <span className="text-[9px] font-black tracking-wider text-emerald-100">AKM VIP</span>
              <span className="text-sm font-black text-white mt-0.5">30%</span>
              <span className="text-[8px] font-semibold text-emerald-100">BONUS</span>
            </div>
            <div className="w-14 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-400/30 flex flex-col items-center justify-center shadow-lg rotate-3 backdrop-blur-xs">
              <span className="text-[10px] font-black text-emerald-300">L2/L3</span>
              <span className="text-xs font-black text-white mt-0.5">5%</span>
            </div>
          </div>
        </div>

        {/* Invite Code Card */}
        <div className="bg-emerald-800/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-400/30 mt-3 text-center shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
            YOUR INVITE CODE
          </span>
          <div className="flex items-center justify-center space-x-3 mt-1">
            <div className="text-3xl font-black tracking-widest text-white">{inviteCode}</div>
            <button
              id="copy-invite-code-btn"
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Copy Link Section */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-2">Your Referral Link</span>
          <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
            <div className="px-2 text-xs text-gray-600 font-mono truncate flex-1">
              {shareUrl}
            </div>
            <button
              id="copy-invite-link-btn"
              onClick={handleCopyLink}
              className="py-2.5 px-4 rounded-xl btn-chamkila text-white font-black text-xs shadow-md whitespace-nowrap cursor-pointer transition-all active:scale-95 tracking-wide hover:brightness-110"
            >
              <span className="drop-shadow-xs">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Share Via Social Icons */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900 mb-3">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share via</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-6 h-6 fill-white" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 mt-1.5">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare('telegram')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <TelegramIcon className="w-6 h-6 fill-white" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 mt-1.5">Telegram</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl">f</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 mt-1.5">Facebook</span>
            </button>

            {/* X */}
            <button
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="font-black text-base">𝕏</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-700 mt-1.5">X</span>
            </button>

            {/* More */}
            <button
              onClick={() => handleShare('more')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <MoreHorizontal className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 mt-1.5">More</span>
            </button>
          </div>
        </div>

        {/* Referral Rules (Exact text from video) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900 border-b pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Referral Rules</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-gray-700">
            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <span className="font-bold text-emerald-800">Level 1 (Direct):</span> Earn 25% commission when a friend you invite directly recharges or buys a plan.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <span className="font-bold text-emerald-800">Level 2 (Indirect):</span> Earn 3% from members invited by your direct team.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <span className="font-bold text-emerald-800">Level 3 (Extended):</span> Earn 2% from the third tier of your network.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                Commission is credited <span className="font-bold">automatically</span> whenever your team recharges or invests.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                There is <span className="font-bold">no limit</span> on how many friends you can invite — the bigger your team, the more you earn.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                Self-referral or fake accounts are not allowed and may lead to commission being cancelled.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
