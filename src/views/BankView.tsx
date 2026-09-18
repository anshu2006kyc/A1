import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BankView: React.FC = () => {
  const { user, setCurrentView, updateBankAccount, showToast } = useApp();

  const [holderName, setHolderName] = useState<string>(
    user.bankAccount?.holderName || ''
  );
  const [bankName, setBankName] = useState<string>(
    user.bankAccount?.bankName || ''
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    user.bankAccount?.accountNumber || ''
  );
  const [ifscCode, setIfscCode] = useState<string>(
    user.bankAccount?.ifscCode || ''
  );
  const [upiId, setUpiId] = useState<string>(
    user.bankAccount?.upiId || ''
  );
  const [showAccount, setShowAccount] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim()) {
      showToast('Please enter Account Holder Name', 'error');
      return;
    }
    if (!accountNumber.trim() || accountNumber.length < 8) {
      showToast('Please enter a valid Account Number', 'error');
      return;
    }
    if (!ifscCode.trim() || ifscCode.length < 8) {
      showToast('Please enter a valid IFSC Code (e.g. SBIN0001234)', 'error');
      return;
    }

    updateBankAccount({
      holderName: holderName.trim(),
      bankName: bankName.trim() || 'State Bank of India',
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      upiId: upiId.trim().toLowerCase(),
      payoutMethod: upiId.trim() ? 'upi' : 'bank',
      updatedAt: new Date().toISOString()
    });

    showToast('Withdrawal account details saved successfully!', 'success');
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-fade-in">
      {/* Top Navigation */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <button
          id="bank-back-btn"
          onClick={() => setCurrentView('profile')}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Bank Account</h1>
        <div className="w-9"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Info Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Update Bank Account</div>
              <div className="text-[11px] text-emerald-700">Edit your withdrawal details anytime</div>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full shadow-xs border border-emerald-100">
            Active
          </div>
        </div>

        {/* Bank Form */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="text-xs font-bold text-gray-900 border-b pb-2">
            Bank Details
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
              <span className="text-rose-500">*</span> Account Holder Name
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter account holder name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {holderName.trim().length > 2 && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
              <span className="text-rose-500">*</span> Account Number
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type={showAccount ? 'text' : 'password'}
                placeholder="Enter bank account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowAccount(!showAccount)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showAccount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
              <span className="text-rose-500">*</span> IFSC Code
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="E.G. SBIN0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold font-mono uppercase text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {ifscCode.trim().length >= 8 && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* UPI ID (Optional for Direct UPI Payouts) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
              <span>UPI ID (For Instant UPI Withdrawal)</span>
              <span className="text-[10px] text-emerald-600 font-normal">Optional</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. mobile@okaxis or name@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="update-bank-btn"
            type="submit"
            className="w-full mt-4 py-4 rounded-2xl btn-chamkila text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:brightness-110 active:scale-98 transition-all cursor-pointer tracking-wide"
          >
            <Lock className="w-4 h-4 drop-shadow-xs" />
            <span className="drop-shadow-xs">Update Bank</span>
          </button>
        </form>
      </div>
    </div>
  );
};
