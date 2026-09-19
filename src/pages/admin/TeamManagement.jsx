import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Layers, Plus, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TeamManagement = () => {
  const { data, createTeam } = useData();
  const { currentUser } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: '',
    type: 'Research Team',
    domain: 'Artificial Intelligence',
    description: '',
    leaderId: '',
    facultyMentor: 'Dr. Abhijit Kshirsagar',
    objective: ''
  });

  const teamTypes = [
    'Research Team', 'Project Team', 'Event Team', 'Technical Team',
    'Competition Team', 'Workshop Team', 'Innovation Team', 'Publication Team',
    'Documentation Team', 'Special Task Team'
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!teamForm.name) return;

    const leaderObj = data.users.find(u => u.id === teamForm.leaderId);

    createTeam({
      ...teamForm,
      leaderName: leaderObj ? leaderObj.name : 'Unassigned',
      memberIds: teamForm.leaderId ? [teamForm.leaderId] : []
    }, currentUser.name);

    setCreateModalOpen(false);
    setTeamForm({ name: '', type: 'Research Team', domain: 'Artificial Intelligence', description: '', leaderId: '', facultyMentor: 'Dr. Abhijit Kshirsagar', objective: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">Team Management</h1>
          <p className="text-xs text-slate-400">Create specialized research, project, innovation, and documentation teams</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.teams.map(team => (
          <div key={team.id} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                  {team.type}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{team.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {team.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{team.description}</p>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <p><strong className="text-slate-400">Domain:</strong> <span className="text-amber-400">{team.domain}</span></p>
              <p><strong className="text-slate-400">Team Leader:</strong> <span className="text-white font-bold">{team.leaderName}</span></p>
              <p><strong className="text-slate-400">Faculty Mentor:</strong> {team.facultyMentor}</p>
              <p><strong className="text-slate-400">Objective:</strong> {team.objective}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Members: {team.memberIds?.length || 0} Registered</span>
              <span>Start: {team.startDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating Team */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Create New Team</h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Team Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. LLM & NLP Innovation Group"
                value={teamForm.name}
                onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Team Type</label>
                <select
                  value={teamForm.type}
                  onChange={e => setTeamForm({ ...teamForm, type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  {teamTypes.map(tt => <option key={tt} value={tt}>{tt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Team Leader</label>
                <select
                  value={teamForm.leaderId}
                  onChange={e => setTeamForm({ ...teamForm, leaderId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="">Select Student Leader...</option>
                  {data.users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description & Objective</label>
              <textarea
                rows={3}
                placeholder="Team mandate and target outputs..."
                value={teamForm.description}
                onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Confirm Team Creation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
