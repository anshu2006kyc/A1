import React, { useState } from 'react';
import {
  Bell,
  Eye,
  Megaphone,
  Plus,
  Send,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminBroadcastTab: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    addTickerMessage,
    removeTickerMessage,
    setIsAnnouncementOpen,
    showToast
  } = useApp();

  const [newTickerText, setNewTickerText] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState(adminSettings.announcementTitle || '');
  const [announcementMessage, setAnnouncementMessage] = useState(adminSettings.announcementMessage || '');

  const customMessages = adminSettings.tickerCustomMessages || [];

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      announcementTitle,
      announcementMessage
    });
    showToast('Announcement updated successfully!', 'success');
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    addTickerMessage(newTickerText.trim());
    setNewTickerText('');
  };

  return (
    <div className="space-y-4">
      {/* Broadcast Header */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/40">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Broadcast & Public Communications</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control the user modal popup announcement & the homepage live marquee ticker
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAnnouncementOpen(true)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>Preview Popup Modal</span>
        </button>
      </div>

      {/* Main Announcement Modal Editor */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Homepage Pop-up Notice (Modal)
            </h4>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              id="enableAnnounce"
              checked={adminSettings.announcementEnabled}
              onChange={(e) => {
                updateAdminSettings({ announcementEnabled: e.target.checked });
                showToast(
                  e.target.checked ? 'Homepage modal announcement ENABLED' : 'Homepage modal announcement DISABLED',
                  'info'
                );
              }}
              className="w-4 h-4 rounded text-emerald-500"
            />
            <label htmlFor="enableAnnounce" className="text-slate-300 font-bold cursor-pointer">
              Show to all visitors on load
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Notice Headline</label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. IMPORTANT PLATFORM UPDATE"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Notice Content</label>
            <textarea
              rows={3}
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              placeholder="Detailed announcement text..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
            >
              Save Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Live Homepage Ticker Editor */}
      <div className="bg-slate-800/90 p-5 rounded-3xl border border-slate-700 space-y-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Megaphone className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Marquee Feed Messages ({customMessages.length})
          </h4>
        </div>

        <p className="text-xs text-slate-400">
          Add custom promotional alerts or system milestones to the scrolling live pill on the user's home screen.
        </p>

        {/* Add Ticker Input */}
        <form onSubmit={handleAddTicker} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Special: All 1-Minute Flash machines earn +25% bonus return today!"
            value={newTickerText}
            onChange={(e) => setNewTickerText(e.target.value)}
            className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer active:scale-95 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast</span>
          </button>
        </form>

        {/* List of Custom Tickers */}
        {customMessages.length === 0 ? (
          <div className="p-4 bg-slate-900/50 rounded-2xl text-center text-xs text-slate-500">
            No custom ticker messages active. The homepage will display standard real-time user top-up & dividend feeds.
          </div>
        ) : (
          <div className="space-y-2">
            {customMessages.map((msg, index) => (
              <div
                key={index}
                className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="text-slate-200 truncate">{msg}</span>
                </div>
                <button
                  onClick={() => removeTickerMessage(index)}
                  className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950 cursor-pointer shrink-0"
                  title="Remove message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
