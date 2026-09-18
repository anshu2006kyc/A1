import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  Lock,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserPlus,
  Users,
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
    registerUser,
    showToast,
    registeredUsers,
    user: currentUser
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Login form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form states
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTradePin, setRegTradePin] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('AKM888');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password form states
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OTP cooldown timer simulation
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentHint, setOtpSentHint] = useState(false);

  // Body scroll lock
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

  // Handle OTP Trigger Simulation
  const handleSendOtp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
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
      showToast('Verification Code sent: 123456 (Test Code)', 'success');
    }, 400);
  };

  // 1-Tap Fill Test OTP
  const handleFillTestOtp = (target: 'login' | 'forgot') => {
    sfx.playTap();
    if (target === 'login') setLoginOtp('123456');
    if (target === 'forgot') setForgotOtp('123456');
    showToast('Auto-filled test code: 123456', 'info');
  };

  // Quick Demo Account Selector
  const handleQuickLogin = (phone: string, pass: string) => {
    sfx.playTap();
    const res = login(phone, pass);
    if (res.success) {
      sfx.playSuccess();
      showToast(`Logged in successfully as ${phone}!`, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playTap();

    if (!loginPhone) {
      showToast('Please enter your registered mobile number', 'error');
      return;
    }

    if (loginMethod === 'password') {
      if (!loginPassword) {
        showToast('Please enter your account password', 'error');
        return;
      }
      const res = login(loginPhone, loginPassword);
      if (res.success) {
        sfx.playSuccess();
        showToast('Login successful! Welcome back.', 'success');
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    } else {
      // OTP Login
      if (!loginOtp) {
        showToast('Please enter the 6-digit OTP code', 'error');
        return;
      }
      const res = loginWithOtp(loginPhone, loginOtp);
      if (res.success) {
        sfx.playSuccess();
        showToast('OTP verified! Logged in successfully.', 'success');
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playTap();

    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a 10-digit mobile number', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (regTradePin && (regTradePin.length !== 6 || isNaN(Number(regTradePin)))) {
      showToast('Trade PIN must be a 6-digit numeric PIN', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms of Service & Risk Disclosure', 'error');
      return;
    }

    const res = registerUser({
      phone: `+91 ${cleanPhone.slice(-10)}`,
      password: regPassword,
      tradePassword: regTradePin || '123456',
      inviteCode: regInviteCode || 'AKM888'
    });

    if (res.success) {
      sfx.playSuccess();
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast('Account Created! ₹28 Welcome Bonus added to wallet.', 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-200' };
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500 text-rose-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500 text-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500 text-emerald-500' };
  };

  const strength = getPasswordStrength(regPassword);

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
                Member Portal
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Secured Investment & Automated Asset Management
            </p>
          </div>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setMode('login');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm font-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              setMode('register');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-emerald-700 shadow-sm font-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Free</span>
            <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-black">
              +₹28
            </span>
          </button>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {/* Mode: Password vs OTP */}
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="text-gray-700 font-bold">Choose Sign In Method:</span>
              <div className="flex space-x-1 bg-gray-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    loginMethod === 'password' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    loginMethod === 'otp' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  SMS OTP
                </button>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-xs text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password or OTP field */}
            {loginMethod === 'password' ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Login Password
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
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  SMS Verification Code (OTP)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 tracking-wider placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    disabled={otpTimer > 0 || isSendingOtp}
                    onClick={() => handleSendOtp(loginPhone)}
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
                      onClick={() => handleFillTestOtp('login')}
                      className="text-emerald-700 underline font-bold cursor-pointer"
                    >
                      1-Tap Auto-Fill
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px]">Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl btn-chamkila text-white font-black text-xs shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2 tracking-wide"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In Securely</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Fast 1-Tap Demo Switcher */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500">
                  ⚡ 1-Tap Fast Test Login:
                </span>
                <span className="text-[10px] text-gray-400">Click to auto-load</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('+91 6203369638', 'password123')}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-gray-800 group-hover:text-emerald-800 truncate">
                    Anshu Kumar
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">6203369638</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('+91 9988776655', 'password123')}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-amber-700 group-hover:text-amber-800 truncate flex items-center space-x-1">
                    <span>Rajesh (VIP 3)</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">9988776655</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* Free ₹28 Joining Bonus Banner */}
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black leading-tight">Instant ₹28 Welcome Bonus</div>
                  <div className="text-[10px] text-emerald-100">Automatically credited upon verification</div>
                </div>
              </div>
              <Zap className="w-4 h-4 text-amber-300" />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-bold text-xs text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Set Password */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Login Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password strength bar */}
            {regPassword && (
              <div className="flex items-center space-x-2 text-[10.5px]">
                <span className="text-gray-400">Security:</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${strength.color.split(' ')[0]}`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
                <span className={`font-bold ${strength.color.split(' ')[1]}`}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Trade PIN & Referral Code in 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Trade PIN (6-digit)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Default: 123456"
                  value={regTradePin}
                  onChange={(e) => setRegTradePin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Invite / Refer Code
                </label>
                <input
                  type="text"
                  placeholder="AKM888"
                  value={regInviteCode}
                  onChange={(e) => setRegInviteCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-emerald-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase"
                />
              </div>
            </div>

            {/* Terms & Risk Agreement */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <span className="text-[10.5px] leading-tight">
                  I agree to AKM Platform Terms of Service, Privacy Policy & Automated Payout Charter.
                </span>
              </label>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl btn-chamkila text-white font-black text-xs shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2 tracking-wide mt-2"
            >
              <Gift className="w-4 h-4" />
              <span>Create Account & Claim ₹28</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div className="space-y-3.5">
            <div className="text-center pb-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">Security Password Reset</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Verify via registered mobile number to reset credentials.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Mobile
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                OTP Verification
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP (Test: 123456)"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleSendOtp(forgotPhone)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                >
                  Get Code
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleFillTestOtp('forgot')}
                className="text-[10px] text-emerald-600 font-bold underline mt-1 cursor-pointer"
              >
                Auto-Fill 123456
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold"
              >
                Back to Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!forgotPhone || !forgotOtp || newPassword.length < 6) {
                    showToast('Please fill all fields properly', 'error');
                    return;
                  }
                  showToast('Password reset successful! You can now log in.', 'success');
                  setMode('login');
                }}
                className="flex-1 py-2.5 rounded-xl btn-chamkila text-white text-xs font-black"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* Security & SSL Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Financial Encryption</span>
          </div>
          <span>ISO 27001 Certified Node</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
