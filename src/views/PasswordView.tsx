import React, { useState } from 'react';
import { ArrowLeft, Lock, KeyRound, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sfx } from '../utils/sound';

export const PasswordView: React.FC = () => {
  const { user, goBack, showToast, adminUpdateUser } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'trade'>('login');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playTap();

    if (!currentPassword.trim()) {
      showToast('Please enter your current security credential', 'error');
      return;
    }

    if (activeTab === 'login') {
      if (currentPassword !== (user.password || 'password123')) {
        showToast('Current login password does not match', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }

      adminUpdateUser(user.id, { password: newPassword });
      sfx.playSuccess();
      setIsSuccess(true);
      showToast('Login password updated successfully!', 'success');
      setTimeout(() => {
        setIsSuccess(false);
        goBack();
      }, 1200);
    } else {
      if (currentPassword !== (user.tradePassword || '123456')) {
        showToast('Current withdrawal PIN does not match', 'error');
        return;
      }
      if (!/^\d{6}$/.test(newPassword)) {
        showToast('Withdrawal PIN must be exactly 6 digits', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('New PINs do not match', 'error');
        return;
      }

      adminUpdateUser(user.id, { tradePassword: newPassword });
      sfx.playSuccess();
      setIsSuccess(true);
      showToast('Withdrawal security PIN updated successfully!', 'success');
      setTimeout(() => {
        setIsSuccess(false);
        goBack();
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in font-sans">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <button
          id="password-back-btn"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Security & Password</h1>
        <div className="w-9"></div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-5 rounded-3xl shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">Account Protection</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Manage your account login credentials & withdrawal PIN
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-200/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'btn-chamkila text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login Password
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('trade');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trade'
                ? 'btn-chamkila text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Withdrawal PIN
          </button>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              {activeTab === 'login' ? 'Current Login Password' : 'Current 6-Digit PIN'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                maxLength={activeTab === 'trade' ? 6 : 32}
                placeholder={activeTab === 'login' ? 'Enter current password' : 'Enter current 6-digit PIN'}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              {activeTab === 'login' ? 'New Login Password' : 'New 6-Digit PIN'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                maxLength={activeTab === 'trade' ? 6 : 32}
                placeholder={activeTab === 'login' ? 'Min. 6 characters' : 'Enter 6 numbers'}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              {activeTab === 'login' ? 'Confirm New Password' : 'Confirm New 6-Digit PIN'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={activeTab === 'trade' ? 6 : 32}
                placeholder="Re-enter to confirm"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full py-3.5 btn-chamkila active:scale-98 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Updated Successfully!</span>
              </>
            ) : (
              <span>Save & Update</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
