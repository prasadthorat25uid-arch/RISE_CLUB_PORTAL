import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Award, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificatesManagement = () => {
  const { data, createAchievement } = useData();
  const { currentUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    recipientId: '',
    title: '',
    category: 'Best Student Contributor',
    description: ''
  });

  const categories = [
    'Active Member Certificate',
    'Best Student Contributor',
    'Best Project/Innovation',
    'Technical/Research Lead',
    'Student Coordinator',
    'Outstanding Club Contributor'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.recipientId || !form.title) {
      alert("Please select recipient and title.");
      return;
    }

    const memberObj = data.users.find(u => u.id === form.recipientId);

    createAchievement({
      recipientName: memberObj ? memberObj.name : 'Member',
      recipientRole: memberObj ? memberObj.role : 'Club Member',
      title: form.title,
      category: form.category,
      description: form.description
    }, currentUser.name);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch(e) {}

    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">Recognition & Certificates</h1>
          <p className="text-xs text-slate-400">Merit-based awards based on factual participation, discipline, and research output</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
        >
          <Award className="w-4 h-4" />
          <span>Issue Certificate / Award</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.achievements.map(ach => (
          <div key={ach.id} className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                {ach.category}
              </span>
              <span className="text-xs font-mono text-slate-400">{ach.date}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{ach.title}</h3>
            
            <p className="text-xs text-amber-400 font-bold">
              Awarded To: {ach.recipientName} ({ach.recipientRole})
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Issue Official Certificate</h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recipient Member *</label>
              <select
                value={form.recipientId}
                onChange={e => setForm({ ...form, recipientId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              >
                <option value="">Select Member...</option>
                {data.users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role} - {u.memberId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recognition Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Certificate Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Best Paper Presentation Award 2026"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Citation / Description</label>
              <textarea
                rows={3}
                placeholder="Recognized for exceptional contribution in..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
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
                Issue Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
