import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus, Send } from 'lucide-react';

export const AnnouncementsManagement = () => {
  const { data, createAnnouncement } = useData();
  const { currentUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'Normal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    createAnnouncement(form, currentUser.name);
    setModalOpen(false);
    setForm({ title: '', content: '', priority: 'Normal' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">Society Announcements</h1>
          <p className="text-xs text-slate-400">Broadcast news, research calls, and meeting notices to all members</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.announcements.map(ann => (
          <div key={ann.id} className="glass-panel p-6 rounded-3xl space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                ann.priority === 'Important' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' : 'bg-slate-800 text-slate-300'
              }`}>
                {ann.priority}
              </span>
              <span className="text-xs font-mono text-slate-400">{ann.date}</span>
            </div>

            <h3 className="text-base font-bold text-white">{ann.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
            <div className="text-[11px] text-slate-500 pt-1">By: {ann.author}</div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">New Announcement</h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Content *</label>
              <textarea
                rows={4}
                required
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Publish Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
