import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  Edit,
  Eye,
  Filter,
  Layers,
  Percent,
  Plus,
  Trash2,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { formatINR } from '../../utils/currency';

export const AdminPlansTab: React.FC = () => {
  const { plans, addNewPlan, updatePlan, deletePlan, showToast } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'turbo' | 'normal' | 'vip'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // New Plan form state
  const [newPlan, setNewPlan] = useState<Omit<Plan, 'id'>>({
    title: '',
    category: 'turbo',
    limit: 10,
    returnDays: 1,
    durationMinutes: 5,
    depositAmount: 500,
    dailyIncome: 650,
    totalReturn: 650,
    badge: '⚡ 5 Minutes Turbo',
    imageUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80',
    isActive: true
  });

  const filteredPlans = plans.filter((p) =>
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.title.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    addNewPlan(newPlan);
    setShowAddModal(false);
    // Reset defaults
    setNewPlan({
      title: '',
      category: 'turbo',
      limit: 10,
      returnDays: 1,
      durationMinutes: 5,
      depositAmount: 500,
      dailyIncome: 650,
      totalReturn: 650,
      badge: '⚡ 5 Minutes Turbo',
      imageUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80',
      isActive: true
    });
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    updatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
          {(['all', 'turbo', 'normal', 'vip'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat === 'turbo' ? '⚡ Turbo Flash' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPlans.map((plan) => {
          const roiPercent = Math.round(((plan.totalReturn - plan.depositAmount) / plan.depositAmount) * 100);
          return (
            <div
              key={plan.id}
              className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden flex flex-col justify-between shadow-md hover:border-slate-600 transition-all"
            >
              {/* Image & Badge Header */}
              <div className="relative h-28 w-full bg-slate-900">
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm ${
                      plan.category === 'turbo'
                        ? 'bg-amber-400 text-slate-950'
                        : plan.category === 'vip'
                        ? 'bg-purple-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {plan.badge || plan.category.toUpperCase()}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white truncate drop-shadow-md">{plan.title}</span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    +{roiPercent}% ROI
                  </span>
                </div>
              </div>

              {/* Body Parameters */}
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Purchase Price</span>
                    <span className="text-sm font-black text-white font-mono">{formatINR(plan.depositAmount)}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Daily Return</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">{formatINR(plan.dailyIncome)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Return Time:</span>
                  <span className="font-bold text-slate-200">
                    {plan.durationMinutes ? `${plan.durationMinutes} Minutes` : `${plan.returnDays} Days`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Total Return:</span>
                  <span className="font-bold text-amber-300 font-mono">{formatINR(plan.totalReturn)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Status:</span>
                  <span className={`font-bold ${plan.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {plan.isActive ? 'Active & Listed' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-900/70 border-t border-slate-700/80 flex items-center justify-between">
                <button
                  onClick={() => setEditingPlan({ ...plan })}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove "${plan.title}"?`)) {
                      deletePlan(plan.id);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1 border border-rose-800 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && createPortal(
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create New Investment Product</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Minute Flash Turbo"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="turbo">⚡ Turbo (Minute Flash)</option>
                    <option value="normal">🌱 Normal (Daily Farm)</option>
                    <option value="vip">💎 VIP Institutional</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. ⚡ 5 Minutes Turbo"
                    value={newPlan.badge}
                    onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {newPlan.category === 'turbo' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Duration (in Minutes)</label>
                  <select
                    value={newPlan.durationMinutes || 5}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value);
                      setNewPlan({
                        ...newPlan,
                        durationMinutes: mins,
                        returnDays: 1,
                        badge: mins === 60 ? '⚡ 1 Hour Turbo' : `⚡ ${mins} ${mins === 1 ? 'Minute' : 'Minutes'} Turbo`
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>1 Minute</option>
                    <option value={3}>3 Minutes</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour (60 Minutes)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Deposit Price (₹)</label>
                  <input
                    type="number"
                    value={newPlan.depositAmount}
                    onChange={(e) => {
                      const dep = parseFloat(e.target.value) || 0;
                      setNewPlan({ ...newPlan, depositAmount: dep });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Daily Return Amount (₹)</label>
                  <input
                    type="number"
                    value={newPlan.dailyIncome}
                    onChange={(e) => {
                      const inc = parseFloat(e.target.value) || 0;
                      setNewPlan({ ...newPlan, dailyIncome: inc, totalReturn: inc * (newPlan.returnDays || 1) });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={newPlan.imageUrl}
                  onChange={(e) => setNewPlan({ ...newPlan, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="newPlanActive"
                  checked={newPlan.isActive}
                  onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <label htmlFor="newPlanActive" className="text-slate-300 font-bold">
                  Visible & Available for User Investment
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Save & Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Plan Modal */}
      {editingPlan && createPortal(
        <div
          onClick={() => setEditingPlan(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <span>Edit Product: {editingPlan.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingPlan.title}
                  onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Deposit Price (₹)</label>
                  <input
                    type="number"
                    value={editingPlan.depositAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingPlan({ ...editingPlan, depositAmount: val });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Daily / Plan Return (₹)</label>
                  <input
                    type="number"
                    value={editingPlan.dailyIncome}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingPlan({
                        ...editingPlan,
                        dailyIncome: val,
                        totalReturn: val * (editingPlan.returnDays || 1)
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Return (₹)</label>
                  <input
                    type="number"
                    value={editingPlan.totalReturn}
                    onChange={(e) => setEditingPlan({ ...editingPlan, totalReturn: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingPlan.badge || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editPlanActive"
                  checked={editingPlan.isActive}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <label htmlFor="editPlanActive" className="text-slate-300 font-bold">
                  Visible & Available for User Investment
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
