import React, { useState } from 'react';
import { AlertTriangle, UserMinus, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ConfirmModal = ({ isOpen, onClose, member, activeTasks = [], activeProjects = [], onConfirm }) => {
  const { data } = useData();
  const [reassignToId, setReassignToId] = useState('');

  if (!isOpen || !member) return null;

  const availableMembers = data.users.filter(u => u.id !== member.id && u.status === 'Active');
  const hasActiveTasks = activeTasks.length > 0;

  const handleExecuteRemoval = () => {
    if (hasActiveTasks && !reassignToId) {
      alert("Please select a member to reassign active tasks to, or reassign them manually prior to removal.");
      return;
    }
    onConfirm(reassignToId || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Remove Active Club Access</h3>
              <p className="text-xs text-slate-400">Confirm Deactivation & Task Transfer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Profile Summary Card */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 mb-5">
          <div className="flex items-center gap-3">
            <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-amber-500/30" />
            <div>
              <h4 className="font-semibold text-white text-base">{member.name}</h4>
              <p className="text-xs text-slate-400">Member ID: <span className="font-mono text-amber-400">{member.memberId}</span> | PRN: {member.prn}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-300">{member.role}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {member.teams?.[0] || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning & Active Tasks Safeguard */}
        {hasActiveTasks ? (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 mb-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-amber-200">Active Tasks Warning</h5>
                <p className="text-xs text-amber-300/80 mt-1">
                  This member currently has <strong className="text-white font-bold">{activeTasks.length} active task(s)</strong> assigned. Please select an active member to reassign these tasks before removing active access.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20">
              <label className="block text-xs font-medium text-amber-200 mb-1.5">
                Reassign Active Tasks To:
              </label>
              <select
                value={reassignToId}
                onChange={(e) => setReassignToId(e.target.value)}
                className="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="">Select Replacement Member...</option>
                {availableMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role} - {m.memberId})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-5 text-xs text-slate-300 leading-relaxed">
            Are you sure you want to remove this member's active club access? Historical contribution records (publications, projects, certificates) will be preserved in the archive.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteRemoval}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg transition-all"
          >
            <UserMinus className="w-4 h-4" />
            <span>Confirm & Remove Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};
