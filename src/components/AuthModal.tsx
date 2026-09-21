import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserPlus,
  X,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const {
    login,
    loginWithOtp,
    quickMobileAuth,
    registerUser,
    showToast,
    registeredUsers
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'quick' | 'otp' | 'password'>('quick');

  // Input states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Advanced / Optional registration settings
  const [showAdvancedReg, setShowAdvancedReg] = useState(false);
  const [regTradePin, setRegTradePin] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('AKM888');

  // Forgot password form states
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OTP simulation states
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentHint, setOtpSentHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // OTP Countdown Interval
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Carrier badge helper based on Indian mobile prefix
  const getCarrierBadge = (p: string) => {
    const clean = p.replace(/\D/g, '');
    if (clean.length < 2) return null;
    const firstDigit = clean[0];
    if (firstDigit === '9' || firstDigit === '8') return { name: 'Jio / Airtel 5G', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (firstDigit === '7') return { name: 'Vi / Airtel Fast', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (firstDigit === '6') return { name: 'Jio Fast Telecom', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    return { name: 'GSM Verified', color: 'text-slate-700 bg-slate-50 border-slate-200' };
  };

  const carrier = getCarrierBadge(phone);

  // Handle OTP Trigger Simulation
  const handleSendOtp = (targetPhone: string) => {
    const cleanPhone = targetPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number first', 'error');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpTimer(60);
      setOtpSentHint(true);
      sfx.playSuccess();
      showToast('SMS OTP Sent: 123456 (Auto-generated code)', 'success');
    }, 400);
  };

  // 1-Tap Fill Test OTP
  const handleFillTestOtp = () => {
    sfx.playTap();
    setOtp('123456');
    showToast('Auto-filled OTP: 123456', 'info');
  };

  // Primary Action: Quick 1-Tap Mobile Auth (Instant Login or Register with JUST mobile number!)
  const handleQuickMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playTap();

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter your 10-digit mobile number', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (authMethod === 'otp') {
        if (!otp.trim()) {
          showToast('Please enter the 6-digit SMS OTP code', 'error');
          return;
        }
        const res = loginWithOtp(cleanPhone, otp.trim());
        if (res.success) {
          sfx.playSuccess();
          showToast(res.message, 'success');
          onClose();
        } else {
          showToast(res.message, 'error');
        }
        return;
      }

      if (authMethod === 'password') {
        if (!password.trim()) {
          showToast('Please enter your account password', 'error');
          return;
        }
        const res = login(cleanPhone, password.trim());
        if (res.success) {
          sfx.playSuccess();
          showToast('Login successful! Welcome back.', 'success');
          onClose();
        } else {
          showToast(res.message, 'error');
        }
        return;
      }

      // Default: Ultra-advanced 1-Tap Mobile Auth
      const res = quickMobileAuth(cleanPhone, regInviteCode || 'AKM888');
      if (res.success) {
        sfx.playSuccess();
        if (res.isNewUser) {
          confetti({
            particleCount: 80,
            spread: 75,
            origin: { y: 0.6 }
          });
        }
        showToast(res.message, 'success');
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    }, 350);
  };

  // Forgot password submit handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playTap();

    const cleanPhone = forgotPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter your 10-digit mobile number', 'error');
      return;
    }
    if (forgotOtp !== '123456') {
      showToast('Invalid OTP. Please enter 123456.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    const userToUpdate = registeredUsers.find((u) =>
      u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );

    if (!userToUpdate) {
      showToast('No registered user found with this mobile number.', 'error');
      return;
    }

    userToUpdate.password = newPassword;
    sfx.playSuccess();
    showToast('Password reset successfully! Please sign in with your mobile number.', 'success');
    setMode('login');
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 relative my-auto cursor-default max-h-[94vh] overflow-y-auto text-left"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Branding & Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#008a44] via-[#00ba58] to-[#1cdb77] text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black text-gray-900 tracking-tight">AKM CAPITAL</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                1-Step Mobile Portal
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Automated high-yield investment & instant payouts
            </p>
          </div>
        </div>

        {/* Instant ₹28 Welcome Bonus Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-sm mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="text-xs font-black leading-tight">Instant ₹28 Joining Bonus</div>
              <div className="text-[10px] text-emerald-100">
                Auto-credited on Mobile Sign Up / Login
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
            100% Free
          </span>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setAuthMethod('quick');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'quick'
                ? 'bg-white text-emerald-700 shadow-sm font-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>⚡ 1-Tap Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setAuthMethod('otp');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'otp'
                ? 'bg-white text-emerald-700 shadow-sm font-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>SMS OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setAuthMethod('password');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              authMethod === 'password'
                ? 'bg-white text-gray-900 shadow-sm font-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>
        </div>

        {/* FORGOT PASSWORD VIEW */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <div className="text-center pb-1">
              <h3 className="text-sm font-black text-gray-900">Reset Account Password</h3>
              <p className="text-xs text-gray-500">Enter your registered mobile number and OTP</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-xs text-gray-500">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Verification Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 tracking-wider font-mono placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  disabled={otpTimer > 0 || isSendingOtp}
                  onClick={() => handleSendOtp(forgotPhone)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 disabled:opacity-50 cursor-pointer transition-all shrink-0"
                >
                  {otpTimer > 0 ? `${otpTimer}s` : isSendingOtp ? 'Sending...' : 'Get OTP'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl btn-chamkila text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Password
              </button>
            </div>
          </form>
        ) : (
          /* PRIMARY FORM: 1-STEP MOBILE LOGIN & REGISTRATION */
          <form onSubmit={handleQuickMobileSubmit} className="space-y-3.5">
            {/* Mobile Number Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-800">
                  Mobile Number
                </label>
                {carrier && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${carrier.color}`}>
                    {carrier.name}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-bold text-xs text-gray-600 flex items-center space-x-1">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  autoFocus
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono tracking-wider shadow-inner"
                  required
                />
              </div>
              <div className="text-[10.5px] text-gray-500 mt-1 flex items-center justify-between">
                <span>Enter your mobile number to sign in or auto-register.</span>
                <span className="font-mono text-[10px] text-gray-400">{phone.length}/10</span>
              </div>
            </div>

            {/* OTP field if OTP method selected */}
            {authMethod === 'otp' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  SMS Verification Code (OTP)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 tracking-wider placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    disabled={otpTimer > 0 || isSendingOtp}
                    onClick={() => handleSendOtp(phone)}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shrink-0"
                  >
                    {otpTimer > 0 ? `${otpTimer}s` : isSendingOtp ? 'Sending...' : 'Get OTP'}
                  </button>
                </div>
                {otpSentHint && (
                  <div className="flex justify-between items-center mt-1.5 text-[11px] text-gray-500">
                    <span className="text-emerald-700 font-medium">Test OTP: <strong>123456</strong></span>
                    <button
                      type="button"
                      onClick={handleFillTestOtp}
                      className="text-emerald-700 underline font-bold cursor-pointer"
                    >
                      1-Tap Auto-Fill
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Password field if Password method selected */}
            {authMethod === 'password' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (default: password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Collapsible Advanced Settings (Trade PIN / Invite Code) */}
            <div className="border border-gray-100 rounded-2xl p-2.5 bg-gray-50/70">
              <button
                type="button"
                onClick={() => setShowAdvancedReg(!showAdvancedReg)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Optional: Referral / Invite Code</span>
                </div>
                {showAdvancedReg ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedReg && (
                <div className="mt-3 space-y-2.5 pt-2 border-t border-gray-200 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Invite / Referral Code
                    </label>
                    <input
                      type="text"
                      placeholder="AKM888"
                      value={regInviteCode}
                      onChange={(e) => setRegInviteCode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Custom Trade Security PIN (6 digits)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Default: 123456"
                      value={regTradePin}
                      onChange={(e) => setRegTradePin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 tracking-wider"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remember device toggle */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px]">Keep me signed in on this mobile device</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl btn-chamkila text-white font-black text-sm shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2 tracking-wide disabled:opacity-75"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {authMethod === 'quick'
                  ? '⚡ Continue with Mobile Number'
                  : authMethod === 'otp'
                  ? 'Verify OTP & Continue'
                  : 'Sign In with Password'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security & Compliance Footer (Zero "node" words, zero star icons) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Financial Encryption</span>
          </div>
          <span>ISO 27001 Certified Infrastructure</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
