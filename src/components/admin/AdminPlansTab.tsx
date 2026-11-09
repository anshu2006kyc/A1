import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Layers,
  Percent,
  Plus,
  Trash2,
  Zap,
  Copy,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  CheckSquare,
  Square,
  X,
  ExternalLink,
  Crown,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { formatINR } from '../../utils/currency';
import { getProductArtworkDataUri } from '../ProductArtwork';

// 22 Authentic AKM Precision Blade Artwork Presets
export const BLADE_ARTWORK_PRESETS = [
  { id: 'plan-product-1', category: 'normal', name: 'Swedish' },
  { id: 'plan-product-2', category: 'normal', name: 'Matrix' },
  { id: 'plan-product-3', category: 'normal', name: 'Titanium' },
  { id: 'plan-product-4', category: 'normal', name: 'Scalpel' },
  { id: 'plan-product-5', category: 'normal', name: 'Rotary' },
  { id: 'plan-special-1', category: 'normal', name: 'Gold' },
  { id: 'plan-turbo-1m', category: 'turbo', name: 'Ceramic' },
  { id: 'plan-turbo-3m', category: 'turbo', name: 'Obsidian' },
  { id: 'plan-turbo-5m', category: 'turbo', name: 'Comb' },
  { id: 'plan-turbo-10m', category: 'turbo', name: 'Scraper' },
  { id: 'plan-turbo-15m', category: 'turbo', name: 'Snap-Off' },
  { id: 'plan-turbo-30m', category: 'turbo', name: 'Hook' },
  { id: 'plan-turbo-45m', category: 'turbo', name: 'Straight' },
  { id: 'plan-turbo-60m', category: 'turbo', name: 'Shear' },
  { id: 'plan-vip-1', category: 'vip', name: 'Damascus' },
  { id: 'plan-vip-1b', category: 'vip', name: 'Chrome' },
  { id: 'plan-vip-2', category: 'vip', name: 'Cryo' },
  { id: 'plan-vip-2b', category: 'vip', name: 'Carbide' },
  { id: 'plan-vip-3', category: 'vip', name: 'Cobalt' },
  { id: 'plan-vip-3b', category: 'vip', name: 'Laser' },
  { id: 'plan-vip-4', category: 'vip', name: 'Rose Gold' },
  { id: 'plan-vip-5', category: 'vip', name: 'Diamond' }
];

export const AdminPlansTab: React.FC = () => {
  const {
    plans,
    addNewPlan,
    updatePlan,
    deletePlan,
    clonePlan,
    togglePlanActive,
    restoreDefaultPlans,
    showToast
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'turbo' | 'normal' | 'vip'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'roi_desc' | 'duration'>('default');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Bulk Selection
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  // New Plan form state
  const [newPlan, setNewPlan] = useState<{
    title: string;
    category: 'turbo' | 'normal' | 'vip';
    limit: number;
    returnDays: number;
    durationMinutes?: number;
    depositAmount: number;
    dailyIncome: number;
    totalReturn: number;
    badge: string;
    imageUrl: string;
    isActive: boolean;
    durationMode: 'minutes' | 'days';
  }>({
    title: '',
    category: 'turbo',
    limit: 10,
    returnDays: 1,
    durationMinutes: 5,
    depositAmount: 500,
    dailyIncome: 650,
    totalReturn: 650,
    badge: '⚡ 5 Min Turbo',
    imageUrl: getProductArtworkDataUri('plan-turbo-5m', 'turbo'),
    isActive: true,
    durationMode: 'minutes'
  });

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return plans
      .filter((p) => {
        // Category filter
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        // Status filter
        if (statusFilter === 'active' && !p.isActive) return false;
        if (statusFilter === 'hidden' && p.isActive) return false;
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (p.title || '').toLowerCase().includes(q);
          const matchId = (p.id || '').toLowerCase().includes(q);
          const matchBadge = (p.badge || '').toLowerCase().includes(q);
          if (!matchTitle && !matchId && !matchBadge) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.depositAmount - b.depositAmount;
        if (sortBy === 'price_desc') return b.depositAmount - a.depositAmount;
        if (sortBy === 'roi_desc') {
          const roiA = ((a.totalReturn - a.depositAmount) / a.depositAmount);
          const roiB = ((b.totalReturn - b.depositAmount) / b.depositAmount);
          return roiB - roiA;
        }
        if (sortBy === 'duration') {
          const timeA = a.durationMinutes || (a.returnDays * 1440);
          const timeB = b.durationMinutes || (b.returnDays * 1440);
          return timeA - timeB;
        }
        return 0;
      });
  }, [plans, categoryFilter, statusFilter, searchQuery, sortBy]);

  // Aggregate stats
  const activeCount = plans.filter((p) => p.isActive).length;
  const hiddenCount = plans.filter((p) => !p.isActive).length;
  const avgRoi = plans.length > 0
    ? Math.round(
        plans.reduce((acc, p) => acc + ((p.totalReturn - p.depositAmount) / p.depositAmount) * 100, 0) /
          plans.length
      )
    : 0;

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedPlanIds.length === filteredPlans.length) {
      setSelectedPlanIds([]);
    } else {
      setSelectedPlanIds(filteredPlans.map((p) => p.id));
    }
  };

  const handleBulkActivate = () => {
    selectedPlanIds.forEach((id) => updatePlan(id, { isActive: true }));
    setSelectedPlanIds([]);
    showToast(`Activated ${selectedPlanIds.length} plans!`, 'success');
  };

  const handleBulkDeactivate = () => {
    selectedPlanIds.forEach((id) => updatePlan(id, { isActive: false }));
    setSelectedPlanIds([]);
    showToast(`Hidden ${selectedPlanIds.length} plans!`, 'info');
  };

  const handleBulkDelete = () => {
    if (selectedPlanIds.length === 0) return;
    selectedPlanIds.forEach((id) => deletePlan(id));
    setSelectedPlanIds([]);
    showToast(`Deleted ${selectedPlanIds.length} selected plans!`, 'warning');
  };

  // Creation form submit
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.title.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (newPlan.depositAmount <= 0) {
      showToast('Deposit amount must be positive', 'error');
      return;
    }

    const payload: Omit<Plan, 'id'> = {
      title: newPlan.title.trim(),
      category: newPlan.category,
      limit: Math.max(1, newPlan.limit || 10),
      returnDays: newPlan.durationMode === 'minutes' ? 1 : Math.max(1, newPlan.returnDays || 1),
      durationMinutes: newPlan.durationMode === 'minutes' ? newPlan.durationMinutes || 5 : undefined,
      depositAmount: newPlan.depositAmount,
      dailyIncome: newPlan.dailyIncome,
      totalReturn: newPlan.totalReturn,
      badge: newPlan.badge.trim() || `${newPlan.category.toUpperCase()} Blade`,
      imageUrl: newPlan.imageUrl || getProductArtworkDataUri(`custom-${Date.now()}`, newPlan.category),
      isActive: newPlan.isActive
    };

    addNewPlan(payload);
    setShowAddModal(false);

    // Reset default form state
    setNewPlan({
      title: '',
      category: 'turbo',
      limit: 10,
      returnDays: 1,
      durationMinutes: 5,
      depositAmount: 500,
      dailyIncome: 650,
      totalReturn: 650,
      badge: '⚡ 5 Min Turbo',
      imageUrl: getProductArtworkDataUri('plan-turbo-5m', 'turbo'),
      isActive: true,
      durationMode: 'minutes'
    });
  };

  // Edit form submit
  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    if (!editingPlan.title.trim()) {
      showToast('Title cannot be empty', 'error');
      return;
    }
    updatePlan(editingPlan.id, {
      title: editingPlan.title.trim(),
      category: editingPlan.category,
      depositAmount: Number(editingPlan.depositAmount) || 0,
      dailyIncome: Number(editingPlan.dailyIncome) || 0,
      totalReturn: Number(editingPlan.totalReturn) || 0,
      returnDays: Number(editingPlan.returnDays) || 1,
      durationMinutes: editingPlan.durationMinutes ? Number(editingPlan.durationMinutes) : undefined,
      limit: Number(editingPlan.limit) || 10,
      badge: editingPlan.badge ? editingPlan.badge.trim() : '',
      imageUrl: editingPlan.imageUrl || getProductArtworkDataUri(editingPlan.id, editingPlan.category),
      isActive: Boolean(editingPlan.isActive)
    });
    setEditingPlan(null);
  };

  // Safe delete handler
  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    deletePlan(deletingPlan.id);
    setDeletingPlan(null);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Overview & Performance KPI Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-3xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>Product Plans Engine</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    LIVE CATALOG
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Full control: Add, edit parameters, toggle visibility, duplicate, and delete investment blade products.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowRestoreModal(true)}
              title="Restore Factory 22 Precision Blade Catalog"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Plan</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Total Products</span>
            <span className="text-base font-black text-white font-mono">{plans.length}</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 block font-medium">Active (In Store)</span>
            <span className="text-base font-black text-emerald-300 font-mono">{activeCount}</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Hidden / Draft</span>
            <span className="text-base font-black text-slate-300 font-mono">{hiddenCount}</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-amber-400 block font-medium">Average Plan ROI</span>
            <span className="text-base font-black text-amber-300 font-mono">+{avgRoi}%</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search, Filter & Bulk Management Bar */}
      <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 shadow-md space-y-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search plan title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
            {(['all', 'turbo', 'normal', 'vip'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'turbo' ? '⚡ Turbo' : cat === 'vip' ? '👑 VIP' : 'Normal'}
              </button>
            ))}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-900 text-slate-300 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="hidden">Hidden Only</option>
            </select>

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 text-slate-300 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="roi_desc">Highest ROI %</option>
              <option value="duration">Fastest Return</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls (Shows when plans selected) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer font-medium text-[11px]"
            >
              {selectedPlanIds.length > 0 && selectedPlanIds.length === filteredPlans.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              <span>Select All ({filteredPlans.length})</span>
            </button>

            {selectedPlanIds.length > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                {selectedPlanIds.length} Selected
              </span>
            )}
          </div>

          {selectedPlanIds.length > 0 && (
            <div className="flex items-center space-x-1.5 animate-fade-in">
              <button
                onClick={handleBulkActivate}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Activate
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Hide
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-[10px] font-bold cursor-pointer border border-rose-700/50"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Plans Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPlans.map((plan, idx) => {
          const roiPercent = Math.round(((plan.totalReturn - plan.depositAmount) / plan.depositAmount) * 100);
          const isSelected = selectedPlanIds.includes(plan.id);

          return (
            <div
              key={`admin-plan-${plan.id}-${idx}`}
              className={`bg-slate-800/90 rounded-3xl border overflow-hidden flex flex-col justify-between shadow-md transition-all group ${
                isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Card Image Banner */}
              <div className="relative h-32 w-full bg-slate-950 overflow-hidden">
                <img
                  src={
                    plan.imageUrl && !plan.imageUrl.includes('unsplash.com')
                      ? plan.imageUrl
                      : getProductArtworkDataUri(plan.id, plan.category)
                  }
                  alt={plan.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-black/20 to-transparent pointer-events-none" />

                {/* Top Corner Controls */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
                  <button
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPlanIds(selectedPlanIds.filter((id) => id !== plan.id));
                      } else {
                        setSelectedPlanIds([...selectedPlanIds, plan.id]);
                      }
                    }}
                    className="p-1 bg-black/70 backdrop-blur-md rounded-lg text-white hover:bg-black cursor-pointer border border-white/20"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </button>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider ${
                      plan.category === 'turbo'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : plan.category === 'vip'
                        ? 'bg-purple-500 text-white font-black'
                        : 'bg-emerald-500 text-white font-black'
                    }`}
                  >
                    {plan.category}
                  </span>
                </div>

                {/* Instant Active / Hidden Toggle Button (Top Right) */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    onClick={() => togglePlanActive(plan.id)}
                    title={plan.isActive ? 'Click to hide this plan from users' : 'Click to show this plan to users'}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center space-x-1 shadow-md cursor-pointer transition-all border ${
                      plan.isActive
                        ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border-emerald-400'
                        : 'bg-rose-900/90 hover:bg-rose-800 text-rose-200 border-rose-600'
                    }`}
                  >
                    {plan.isActive ? (
                      <>
                        <Eye className="w-2.5 h-2.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-2.5 h-2.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Plan Badge & Title (Bottom of image) */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs z-10">
                  <span className="font-extrabold text-white text-[11px] truncate drop-shadow-md pr-2">
                    {plan.title}
                  </span>
                  <span className="text-[9.5px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    +{roiPercent}% ROI
                  </span>
                </div>
              </div>

              {/* Parameters 4-Grid */}
              <div className="p-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Purchase Price</span>
                    <span className="text-sm font-black text-white font-mono">{formatINR(plan.depositAmount)}</span>
                  </div>

                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-right">
                    <span className="text-[9px] text-slate-400 block">Daily Profit</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">+{formatINR(plan.dailyIncome)}</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Return Period:</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {plan.durationMinutes ? `⚡ ${plan.durationMinutes} Minutes` : `📅 ${plan.returnDays} Days`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Total Return:</span>
                    <span className="font-bold text-amber-300 font-mono">{formatINR(plan.totalReturn)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>User Limit:</span>
                    <span className="font-bold text-slate-200 font-mono">{plan.limit || 10} Per User</span>
                  </div>
                </div>

                {plan.badge && (
                  <div className="text-[10px] text-slate-400 truncate font-mono bg-slate-900/40 px-2 py-0.5 rounded-lg border border-slate-800">
                    Tag: <span className="text-slate-300 font-medium">{plan.badge}</span>
                  </div>
                )}
              </div>

              {/* Card Action Buttons (Edit, Duplicate, Delete) */}
              <div className="p-2.5 bg-slate-900/80 border-t border-slate-700/80 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setEditingPlan({ ...plan })}
                  className="flex-1 py-1.5 px-2 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all active:scale-95"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-300" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => clonePlan(plan.id)}
                  title="Duplicate this plan"
                  className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all border border-slate-700 active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Clone</span>
                </button>

                <button
                  onClick={() => setDeletingPlan(plan)}
                  title="Delete this plan permanently"
                  className="py-1.5 px-2.5 bg-rose-950/70 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-rose-800/80 cursor-pointer transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <div className="bg-slate-800/60 p-10 rounded-3xl border border-slate-700 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Investment Plans Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No products match your search or filter. Try clearing filters or restore factory default blade plans.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD NEW INVESTMENT PLAN
          ========================================================================= */}
      {showAddModal && createPortal(
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Create New Precision Blade Plan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              {/* Product Title */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5-Blade Matrix Precision Cartridge"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Category & Timing Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => {
                      const cat = e.target.value as 'turbo' | 'normal' | 'vip';
                      setNewPlan({
                        ...newPlan,
                        category: cat,
                        durationMode: cat === 'turbo' ? 'minutes' : 'days',
                        badge: cat === 'turbo' ? '⚡ Turbo Flash' : cat === 'vip' ? '👑 VIP Tier' : 'Limit 10'
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="turbo">⚡ Turbo (Minutes)</option>
                    <option value="normal">Classic (Days)</option>
                    <option value="vip">👑 VIP (Days)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newPlan.durationMode === 'minutes' ? 'Duration (Minutes)' : 'Duration (Days)'}
                  </label>
                  {newPlan.durationMode === 'minutes' ? (
                    <select
                      value={newPlan.durationMinutes || 5}
                      onChange={(e) => {
                        const mins = parseInt(e.target.value, 10);
                        setNewPlan({
                          ...newPlan,
                          durationMinutes: mins,
                          badge: `⚡ ${mins === 60 ? '1 Hour' : `${mins} Min`} Turbo`
                        });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 Minute</option>
                      <option value={3}>3 Minutes</option>
                      <option value={5}>5 Minutes</option>
                      <option value={10}>10 Minutes</option>
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour)</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={newPlan.returnDays}
                      onChange={(e) => {
                        const days = parseInt(e.target.value, 10) || 1;
                        setNewPlan({
                          ...newPlan,
                          returnDays: days,
                          totalReturn: newPlan.dailyIncome * days
                        });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Price & Daily Returns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Purchase Deposit (₹)</label>
                  <input
                    type="number"
                    min={10}
                    value={newPlan.depositAmount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setNewPlan({ ...newPlan, depositAmount: val });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {newPlan.durationMode === 'minutes' ? 'Flash Profit (₹)' : 'Daily Profit (₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPlan.dailyIncome}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const tot = newPlan.durationMode === 'minutes' ? val : val * (newPlan.returnDays || 1);
                      setNewPlan({ ...newPlan, dailyIncome: val, totalReturn: tot });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Total Return & Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Return (₹)</label>
                  <input
                    type="number"
                    value={newPlan.totalReturn}
                    onChange={(e) => setNewPlan({ ...newPlan, totalReturn: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Per-User Limit</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newPlan.limit}
                    onChange={(e) => setNewPlan({ ...newPlan, limit: parseInt(e.target.value, 10) || 10 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Badge Tag */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Limit 10 • ₹480/Day"
                  value={newPlan.badge}
                  onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Blade SVG Artwork Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Precision Blade Artwork</label>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                    <img src={newPlan.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <input
                    type="text"
                    value={newPlan.imageUrl}
                    onChange={(e) => setNewPlan({ ...newPlan, imageUrl: e.target.value })}
                    placeholder="data:image/svg+xml;... or https://..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-[11px] font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 1-Click Blade Preset Buttons */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">1-Click Blade Artwork Presets:</span>
                  <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto no-scrollbar p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                    {BLADE_ARTWORK_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setNewPlan({ ...newPlan, imageUrl: getProductArtworkDataUri(preset.id, preset.category) })}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all active:scale-95"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Visibility Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="newPlanActive"
                  checked={newPlan.isActive}
                  onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <label htmlFor="newPlanActive" className="text-slate-300 font-bold cursor-pointer">
                  Visible & Available for User Investment
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
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
                  Publish New Plan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 2: EDIT EXISTING INVESTMENT PLAN
          ========================================================================= */}
      {editingPlan && createPortal(
        <div
          onClick={() => setEditingPlan(null)}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Product Plan</h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {editingPlan.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-white text-xs p-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-3.5 text-xs">
              {/* Product Title */}
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

              {/* Category & Timing Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={editingPlan.category}
                    onChange={(e) => {
                      const cat = e.target.value as 'turbo' | 'normal' | 'vip';
                      setEditingPlan({
                        ...editingPlan,
                        category: cat,
                        durationMinutes: cat === 'turbo' ? (editingPlan.durationMinutes || 5) : undefined
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="turbo">⚡ Turbo</option>
                    <option value="normal">Classic</option>
                    <option value="vip">👑 VIP</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {editingPlan.category === 'turbo' ? 'Duration (Minutes)' : 'Duration (Days)'}
                  </label>
                  {editingPlan.category === 'turbo' ? (
                    <select
                      value={editingPlan.durationMinutes || 5}
                      onChange={(e) => {
                        const mins = parseInt(e.target.value, 10);
                        setEditingPlan({ ...editingPlan, durationMinutes: mins });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 Minute</option>
                      <option value={3}>3 Minutes</option>
                      <option value={5}>5 Minutes</option>
                      <option value={10}>10 Minutes</option>
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour)</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={editingPlan.returnDays}
                      onChange={(e) => {
                        const days = parseInt(e.target.value, 10) || 1;
                        setEditingPlan({
                          ...editingPlan,
                          returnDays: days,
                          totalReturn: editingPlan.dailyIncome * days
                        });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Price & Daily Returns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    min={10}
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
                  <label className="text-slate-300 font-bold block mb-1">
                    {editingPlan.category === 'turbo' ? 'Flash Return (₹)' : 'Daily Return (₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingPlan.dailyIncome}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const tot = editingPlan.category === 'turbo' ? val : val * (editingPlan.returnDays || 1);
                      setEditingPlan({ ...editingPlan, dailyIncome: val, totalReturn: tot });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Total Return & Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Return (₹)</label>
                  <input
                    type="number"
                    value={editingPlan.totalReturn}
                    onChange={(e) => setEditingPlan({ ...editingPlan, totalReturn: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">User Limit</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editingPlan.limit || 10}
                    onChange={(e) => setEditingPlan({ ...editingPlan, limit: parseInt(e.target.value, 10) || 10 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Badge Tag */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingPlan.badge || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                  placeholder="e.g. Limit 10 • ₹480/Day"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Blade SVG Artwork Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Blade Artwork</label>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                    <img
                      src={editingPlan.imageUrl || getProductArtworkDataUri(editingPlan.id, editingPlan.category)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingPlan.imageUrl || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, imageUrl: e.target.value })}
                    placeholder="data:image/svg+xml;... or https://..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-[11px] font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 1-Click Blade Preset Buttons */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">1-Click Blade Artwork Presets:</span>
                  <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto no-scrollbar p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                    {BLADE_ARTWORK_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setEditingPlan({ ...editingPlan, imageUrl: getProductArtworkDataUri(preset.id, preset.category) })}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all active:scale-95"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Visibility Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editPlanActive"
                  checked={editingPlan.isActive}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <label htmlFor="editPlanActive" className="text-slate-300 font-bold cursor-pointer">
                  Visible & Available for User Investment
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-black shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 3: IN-APP CONFIRM PLAN DELETION (NO WINDOW.CONFIRM)
          ========================================================================= */}
      {deletingPlan && createPortal(
        <div
          onClick={() => setDeletingPlan(null)}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-rose-500/50 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Investment Plan?</h3>
                <p className="text-[11px] text-slate-400">This action will remove the product permanently from catalog.</p>
              </div>
            </div>

            {/* Target Plan Summary Card */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                <img
                  src={deletingPlan.imageUrl || getProductArtworkDataUri(deletingPlan.id, deletingPlan.category)}
                  alt={deletingPlan.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{deletingPlan.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Deposit: {formatINR(deletingPlan.depositAmount)} • Daily: +{formatINR(deletingPlan.dailyIncome)}
                </div>
                <div className="text-[10px] text-rose-400 font-mono">
                  ID: {deletingPlan.id}
                </div>
              </div>
            </div>

            <p className="text-xs text-rose-300/90 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/60 leading-relaxed">
              ⚠️ <strong>Notice:</strong> Once deleted, this product will no longer appear in the store. Existing user investments already purchased will continue until maturity.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-900/40 cursor-pointer active:scale-95 transition-all"
              >
                Yes, Delete Plan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 4: RESTORE FACTORY DEFAULT BLADE PLANS CATALOG
          ========================================================================= */}
      {showRestoreModal && createPortal(
        <div
          onClick={() => setShowRestoreModal(false)}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-amber-500/50 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl cursor-default"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <RotateCcw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Restore 22 Factory Blades?</h3>
                <p className="text-[11px] text-slate-400">Restores all original AKM precision blade products.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 leading-relaxed">
              This will restore the complete official catalog of 22 unique blade products (6 Normal, 8 Turbo, 8 VIP) with Swedish cryo steel artworks and synchronized payouts.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreDefaultPlans();
                  setShowRestoreModal(false);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-900/30 cursor-pointer active:scale-95 transition-all"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
