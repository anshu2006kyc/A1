import React, { useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportCategory, SupportMessage, SupportStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import { sfx } from '../../utils/sound';

export const AdminSupportTab: React.FC = () => {
  const { supportMessages, replySupportMessage, resolveSupportMessage, showToast } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [selectedTicket, setSelectedTicket] = useState<SupportMessage | null>(null);

  const filteredTickets = supportMessages.filter((ticket) => {
    if (filterCategory !== 'all' && ticket.category !== filterCategory) return false;
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (searchPhone.trim()) {
      const q = searchPhone.trim().toLowerCase();
      const phone = (ticket.userPhone || '').toLowerCase();
      const name = (ticket.userName || '').toLowerCase();
      const msg = (ticket.message || '').toLowerCase();
      const subj = (ticket.subject || '').toLowerCase();
      if (!phone.includes(q) && !name.includes(q) && !msg.includes(q) && !subj.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleSendReply = (ticketId: string) => {
    const text = (replyTextMap[ticketId] || '').trim();
    if (!text) {
      showToast('Please type a reply message first', 'error');
      return;
    }
    sfx.playSuccess();
    replySupportMessage(ticketId, text);
    setReplyTextMap((prev) => ({ ...prev, [ticketId]: '' }));
  };

  const pendingCount = supportMessages.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Header Stat Banner */}
      <div className="bg-slate-800/90 p-4 rounded-3xl border border-slate-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <span>Investor Support Helpdesk</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live 24/7
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and reply directly to investor questions about deposits, withdrawals & plans
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block">Pending Inquiries</span>
            <span className="text-sm font-black text-amber-400">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block">Total Tickets</span>
            <span className="text-sm font-black text-emerald-400">{supportMessages.length}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Search by user phone, subject, or message..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none text-xs"
          >
            <option value="all">All Topics</option>
            <option value="investment">Investment Returns</option>
            <option value="recharge">Deposits / Recharge</option>
            <option value="withdraw">Payouts / Withdraw</option>
            <option value="vip">VIP Tiers</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 p-6">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-400">No Support Inquiries Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchPhone || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search filters.'
                : 'Users have not submitted any inquiry messages yet.'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const replyValue = replyTextMap[ticket.id] || '';
            const isResolved = ticket.status === 'resolved';

            return (
              <div
                key={ticket.id}
                className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-3 text-left hover:border-slate-600 transition-colors"
              >
                {/* Top Row: User details & status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-200 text-xs">
                          +91 {ticket.userPhone}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (User ID: {ticket.userId})
                        </span>
                        {ticket.priority === 'urgent' && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-black uppercase">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Submitted: {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
                      #{ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full capitalize ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {isResolved ? '✓ Resolved' : '⏳ Pending'}
                    </span>
                  </div>
                </div>

                {/* Subject & Related Plan */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white text-[13px]">
                      {ticket.subject}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      Topic: {ticket.category}
                    </span>
                  </div>

                  {ticket.planTitle && (
                    <div className="text-xs text-amber-300 bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-800/30 flex items-center space-x-1.5">
                      <span className="font-bold">Target Investment Plan:</span>
                      <span className="font-mono">{ticket.planTitle}</span>
                    </div>
                  )}

                  {/* User Message Text */}
                  <div className="p-3 rounded-xl bg-slate-900/90 text-xs text-slate-200 border border-slate-700/80 leading-relaxed font-sans">
                    {ticket.message}
                  </div>
                </div>

                {/* Existing Admin Reply if any */}
                {ticket.adminReply && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 space-y-1">
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Admin Reply Dispatched:</span>
                    </div>
                    <p className="text-xs text-emerald-200 font-sans">
                      {ticket.adminReply}
                    </p>
                    {ticket.repliedAt && (
                      <span className="text-[9px] text-emerald-400/80 block">
                        Sent on {new Date(ticket.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                <div className="pt-2 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={replyValue}
                    onChange={(e) =>
                      setReplyTextMap((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                    }
                    placeholder={
                      ticket.adminReply
                        ? 'Update or send another reply to this investor...'
                        : 'Type reply to investor (will appear in their ticket view)...'
                    }
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleSendReply(ticket.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                      <span>{ticket.adminReply ? 'Send Update' : 'Reply & Resolve'}</span>
                    </button>

                    {!isResolved && (
                      <button
                        type="button"
                        onClick={() => resolveSupportMessage(ticket.id)}
                        className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
                        title="Mark as resolved without text reply"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
