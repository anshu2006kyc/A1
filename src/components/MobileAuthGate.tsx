import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';
import { AdminAuthModal } from './AdminAuthModal';

export const MobileAuthGate: React.FC = () => {
  const { login, registerUser, showToast, setIsAdminOpen } = useApp();

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Fields
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regInviteCode, setRegInviteCode] = useState('AKM888');
  const [showInviteField, setShowInviteField] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Phone sanitizer helper
  const cleanLoginPhone = loginPhone.replace(/\D/g, '');
  const cleanRegPhone = regPhone.replace(/\D/g, '');

  const isLoginPhoneValid = cleanLoginPhone.length === 10;
  const isRegPhoneValid = cleanRegPhone.length === 10;

  // Real-time Indian telecom carrier detection
  const getCarrierInfo = (num: string) => {
    if (num.length < 2) return null;
    const firstDigit = num[0];
    if (firstDigit === '9' || firstDigit === '8') {
      return { name: 'Jio / Airtel 5G', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (firstDigit === '7') {
      return { name: 'Vi / Airtel Fast', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
    if (firstDigit === '6') {
      return { name: 'Jio Telecom', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    }
    return { name: 'GSM Verified', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  const loginCarrier = getCarrierInfo(cleanLoginPhone);
  const regCarrier = getCarrierInfo(cleanRegPhone);

  // Seamless one-page mode switcher with synced credentials
  const handleSwitchAuthMode = (target: 'login' | 'register') => {
    sfx.playTap();
    if (target === 'register') {
      if (loginPhone && !regPhone) setRegPhone(loginPhone);
      if (loginPassword && !regPassword) {
        setRegPassword(loginPassword);
        setRegConfirmPassword(loginPassword);
      }
    } else {
      if (regPhone && !loginPhone) setLoginPhone(regPhone);
      if (regPassword && !loginPassword) setLoginPassword(regPassword);
    }
    setAuthMode(target);
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginPhoneValid) {
      sfx.playWarning();
      showToast('Kripya 10-digit mobile number dalein.', 'error');
      return;
    }
    if (!loginPassword.trim()) {
      sfx.playWarning();
      showToast('Kripya apna Password enter karein.', 'error');
      return;
    }

    setIsSubmitting(true);
    sfx.playTap();

    setTimeout(() => {
      const res = login(cleanLoginPhone, loginPassword);
      setIsSubmitting(false);

      if (res.success) {
        sfx.playSuccess();
        showToast(res.message, 'success');
      } else {
        sfx.playWarning();
        showToast(res.message, 'error');
        // If mobile is not registered, suggest switching to register
        if (res.message.includes('registered nahi hai') || res.message.includes('not registered')) {
          setRegPhone(cleanLoginPhone);
          setRegPassword(loginPassword);
          setRegConfirmPassword(loginPassword);
        }
      }
    }, 400);
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegPhoneValid) {
      sfx.playWarning();
      showToast('Kripya 10-digit mobile number dalein.', 'error');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      sfx.playWarning();
      showToast('Password kam se kam 4-6 aksharon ka banayein.', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      sfx.playWarning();
      showToast('Password match nahi kar raha hai! Kripya dono same dalein.', 'error');
      return;
    }

    setIsSubmitting(true);
    sfx.playTap();

    setTimeout(() => {
      const res = registerUser({
        phone: cleanRegPhone,
        password: regPassword,
        inviteCode: regInviteCode.trim() || 'AKM888'
      });
      setIsSubmitting(false);

      if (res.success) {
        sfx.playSuccess();
        try {
          confetti({
            particleCount: 120,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {}
        showToast(`Account successfully create ho gaya! ₹28 Welcome Bonus credit!`, 'success');
      } else {
        sfx.playWarning();
        showToast(res.message, 'error');
        if (res.message.includes('pehle se registered') || res.message.includes('already exists')) {
          setAuthMode('login');
          setLoginPhone(cleanRegPhone);
        }
      }
    }, 450);
  };

  // Discreet Admin Trigger (5 rapid taps on the SSL badge)
  const handleSecretTap = () => {
    const newCount = secretTapCount + 1;
    setSecretTapCount(newCount);
    sfx.playTap();
    if (newCount >= 5) {
      setSecretTapCount(0);
      setShowAdminModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 text-slate-800 flex flex-col justify-between p-4 sm:p-5 select-none relative overflow-x-hidden">
      {/* Decorative Gradient Flares */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Top Header: Brand Identity & Security Badge */}
      <div className="relative z-10 pt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center shadow-sm border border-emerald-500/30 shrink-0">
            <span className="font-black text-sm text-emerald-400 tracking-wider font-mono">AKM</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-sm tracking-wider text-slate-900 uppercase">AKM ENTERPRISES</span>
              <span className="text-[7.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono tracking-widest">
                OFFICIAL
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-medium tracking-wide">Digital Asset & Investment Portal</p>
          </div>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="relative z-10 my-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 space-y-3.5"
        >
          {/* Top Tabs: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => handleSwitchAuthMode('login')}
              className={`py-1.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-emerald-600 to-[#00ba58] text-white shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Log In (लॉग इन)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchAuthMode('register')}
              className={`py-1.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-emerald-600 to-[#00ba58] text-white shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Register (नया खाता)</span>
            </button>
          </div>

          {/* Heading Description */}
          <div className="text-center space-y-0.5">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {authMode === 'login' ? 'AKM Enterprise Investor Login' : 'Create Enterprise Investor Account'}
            </h1>
            <p className="text-[10px] text-slate-500">
              {authMode === 'login' ? (
                <>Apne verified mobile number aur password se login karein.</>
              ) : (
                <>
                  Free registration karein aur paayein{' '}
                  <span className="text-emerald-600 font-bold">₹28 Welcome Bonus</span>!
                </>
              )}
            </p>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: LOGIN WITH MOBILE + PASSWORD                      */}
          {/* ======================================================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-2.5">
              {/* Mobile Number Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <label htmlFor="login-phone" className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>Mobile Number (मोबाइल नंबर)</span>
                  </label>
                  {loginCarrier && (
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border ${loginCarrier.color}`}>
                      {loginCarrier.name}
                    </span>
                  )}
                </div>

                <div className="relative flex items-center bg-slate-50/70 border-2 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl overflow-hidden transition-all shadow-xs">
                  <div className="flex items-center space-x-1 px-2 py-2 bg-slate-100 border-r border-slate-200 shrink-0 text-slate-700">
                    <span className="text-xs leading-none" role="img" aria-label="India Flag">🇮🇳</span>
                    <span className="text-[10px] font-bold font-mono tracking-wider">+91</span>
                  </div>

                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    autoComplete="tel-national"
                    className="w-full bg-transparent px-2.5 py-2 text-[11px] sm:text-xs font-semibold font-mono tracking-wider text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />

                  {isLoginPhoneValid && (
                    <div className="pr-2.5 text-emerald-600 animate-in fade-in zoom-in duration-200">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <label htmlFor="login-password" className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Password (पासवर्ड)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playTap();
                      showToast('Agar password bhool gaye hain to Admin se contact karein ya naya account banayein.', 'info');
                    }}
                    className="text-[9px] text-emerald-600 hover:text-emerald-700 underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative flex items-center bg-slate-50/70 border-2 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl overflow-hidden transition-all shadow-xs">
                  <div className="flex items-center justify-center pl-2.5 text-slate-400">
                    <KeyRound className="w-3 h-3" />
                  </div>

                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-transparent px-2.5 py-2 text-[11px] sm:text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="px-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={!isLoginPhoneValid || !loginPassword || isSubmitting}
                className={`w-full py-2 px-3 rounded-2xl font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-98 ${
                  isLoginPhoneValid && loginPassword && !isSubmitting
                    ? 'btn-chamkila text-white shadow-emerald-700/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Account (लॉग इन करें)</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>

              {/* Switch to Register link */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => handleSwitchAuthMode('register')}
                  className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                >
                  Naya account banana hai?{' '}
                  <span className="text-emerald-600 font-bold underline">Register Here & Get ₹28</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: REGISTER WITH MOBILE + PASSWORD + INVITE CODE     */}
          {/* ======================================================== */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-2">
              {/* Mobile Number Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <label htmlFor="reg-phone" className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>Mobile Number (मोबाइल नंबर)</span>
                  </label>
                  {regCarrier && (
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border ${regCarrier.color}`}>
                      {regCarrier.name}
                    </span>
                  )}
                </div>

                <div className="relative flex items-center bg-slate-50/70 border-2 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl overflow-hidden transition-all shadow-xs">
                  <div className="flex items-center space-x-1 px-2 py-2 bg-slate-100 border-r border-slate-200 shrink-0 text-slate-700">
                    <span className="text-xs leading-none" role="img" aria-label="India Flag">🇮🇳</span>
                    <span className="text-[10px] font-bold font-mono tracking-wider">+91</span>
                  </div>

                  <input
                    id="reg-phone"
                    type="tel"
                    inputMode="numeric"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    autoComplete="tel-national"
                    className="w-full bg-transparent px-2.5 py-2 text-[11px] sm:text-xs font-semibold font-mono tracking-wider text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />

                  {isRegPhoneValid && (
                    <div className="pr-2.5 text-emerald-600 animate-in fade-in zoom-in duration-200">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Create Password Input */}
              <div className="space-y-1">
                <label htmlFor="reg-password" className="font-bold text-slate-700 text-[10px] flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Create Password (नया पासवर्ड)</span>
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-mono">Min 4 chars</span>
                </label>

                <div className="relative flex items-center bg-slate-50/70 border-2 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl overflow-hidden transition-all shadow-xs">
                  <div className="flex items-center justify-center pl-2.5 text-slate-400">
                    <KeyRound className="w-3 h-3" />
                  </div>

                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create your login password"
                    autoComplete="new-password"
                    className="w-full bg-transparent px-2.5 py-2 text-[11px] sm:text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="px-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label htmlFor="reg-confirm-password" className="font-bold text-slate-700 text-[10px] flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Confirm Password (पासवर्ड दोबारा)</span>
                  </span>
                  {regConfirmPassword && (
                    <span className={`text-[8.5px] font-bold ${regPassword === regConfirmPassword ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {regPassword === regConfirmPassword ? '✓ Matched' : '✗ Not matching'}
                    </span>
                  )}
                </label>

                <div className={`relative flex items-center bg-slate-50/70 border-2 rounded-2xl overflow-hidden transition-all shadow-xs ${
                  regConfirmPassword && regPassword === regConfirmPassword
                    ? 'border-emerald-500 bg-white'
                    : regConfirmPassword && regPassword !== regConfirmPassword
                    ? 'border-rose-500 bg-white'
                    : 'border-slate-200 focus-within:border-emerald-500 focus-within:bg-white'
                }`}>
                  <div className="flex items-center justify-center pl-2.5 text-slate-400">
                    <KeyRound className="w-3 h-3" />
                  </div>

                  <input
                    id="reg-confirm-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className="w-full bg-transparent px-2.5 py-2 text-[11px] sm:text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />

                  {regConfirmPassword && regPassword === regConfirmPassword && (
                    <div className="pr-2.5 text-emerald-600 animate-in fade-in duration-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Invite Code Accordion */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => setShowInviteField(!showInviteField)}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <Gift className="w-3 h-3 text-amber-500" />
                    <span>Invite / Referral Code (रेफरल कोड)</span>
                  </div>
                  {showInviteField ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <AnimatePresence>
                  {showInviteField && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-1"
                    >
                      <input
                        type="text"
                        value={regInviteCode}
                        onChange={(e) => setRegInviteCode(e.target.value.toUpperCase())}
                        placeholder="e.g. AKM888"
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[10px] font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 uppercase"
                      />
                      <span className="text-[8.5px] text-emerald-700 font-semibold block mt-1 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500 inline shrink-0" />
                        <span>Instant ₹28 Free Joining Bonus wallet me credit hoga!</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Register Button */}
              <button
                id="reg-submit-btn"
                type="submit"
                disabled={
                  !isRegPhoneValid ||
                  !regPassword ||
                  regPassword.length < 4 ||
                  regPassword !== regConfirmPassword ||
                  isSubmitting
                }
                className={`w-full py-2 px-3 rounded-2xl font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-98 ${
                  isRegPhoneValid &&
                  regPassword &&
                  regPassword.length >= 4 &&
                  regPassword === regConfirmPassword &&
                  !isSubmitting
                    ? 'btn-chamkila text-white shadow-emerald-700/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register & Get ₹28 Bonus (खाता बनाएं)</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>

              {/* Switch to Login link */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => handleSwitchAuthMode('login')}
                  className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                >
                  Pehle se account bana hua hai?{' '}
                  <span className="text-emerald-600 font-bold underline">Log In Here (लॉग इन करें)</span>
                </button>
              </div>
            </form>
          )}

          {/* Enterprise Benefits */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/80 text-center">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <Building2 className="w-3 h-3 text-slate-700 mx-auto mb-0.5" />
              <div className="text-[9.5px] font-bold text-slate-800 leading-tight">Enterprise</div>
              <div className="text-[8px] text-slate-500">Tier-1 Direct</div>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <Zap className="w-3 h-3 text-emerald-600 mx-auto mb-0.5" />
              <div className="text-[9.5px] font-bold text-slate-800 leading-tight">₹28 Bonus</div>
              <div className="text-[8px] text-slate-500">Instant Credit</div>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <ShieldCheck className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
              <div className="text-[9.5px] font-bold text-slate-800 leading-tight">Zero-Risk</div>
              <div className="text-[8px] text-slate-500">ISO 27001</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer: Discreet Admin Unlock & Compliance Notice */}
      <div className="relative z-10 text-center space-y-1 pb-2">
        <p className="text-[10px] text-slate-500">
          By continuing, you agree to AKM ENTERPRISES Terms & Privacy Governance.
        </p>

        {/* Secret Admin Trigger: Clicking 5 times on the SSL stamp opens Admin Auth Modal */}
        <button
          type="button"
          onClick={handleSecretTap}
          className="text-[8.5px] text-slate-400 hover:text-slate-600 select-none cursor-default transition-colors inline-flex items-center space-x-1 font-mono"
          title="AKM Enterprise Security Hub"
        >
          <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
          <span>AKM ENTERPRISES LTD • SECURE PROTOCOL • 256-BIT SSL</span>
        </button>
      </div>

      {/* Admin Auth Modal (Strictly hidden from regular users, only triggered by secret tap or admin URL) */}
      <AdminAuthModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={() => {
          setShowAdminModal(false);
          setIsAdminOpen(true);
        }}
      />
    </div>
  );
};
