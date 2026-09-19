import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Plus, 
  Sparkles, 
  Megaphone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const PresidentVPDashboard = ({ setActiveTab }) => {
  const { data } = useData();
  const { currentUser } = useAuth();

  const totalMembers = data.users.length;
  const activeMembers = data.users.filter(u => u.status === 'Active').length;
  const totalTeams = data.teams.length;
  const pendingTasks = data.tasks.filter(t => t.status === 'Assigned' || t.status === 'In Progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header Banner - Highlight Equal Leadership */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/50 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                Equal Student Leadership Portal
              </span>
              <span className="text-xs text-amber-300 font-medium">President ↔ Vice President</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Welcome, {currentUser?.name} ({currentUser?.role})
            </h1>
            <p className="text-xs text-slate-300">
              Department of Integrated B.Tech | Sanjivani University Academic Year 2026–2027
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Multiple Members</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Equal Student Leadership Card Display */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
          Equal Leadership Status & Management Authority
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" alt="President" className="w-10 h-10 rounded-full object-cover border border-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Rohan Sharma</div>
                <div className="text-[10px] text-amber-400 font-semibold">President</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Equal Student Permissions
            </span>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" alt="Vice President" className="w-10 h-10 rounded-full object-cover border border-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Ananya Deshmukh</div>
                <div className="text-[10px] text-amber-400 font-semibold">Vice President</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Equal Student Permissions
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid for President & VP */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-outfit">Student Leadership Quick Actions</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('create-members')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left space-y-2 transition-all"
          >
            <UserPlus className="w-6 h-6 text-amber-400" />
            <div className="text-xs font-bold text-white">Create Multiple Members</div>
            <div className="text-[10px] text-slate-400">Single & Bulk CSV</div>
          </button>

          <button
            onClick={() => setActiveTab('manage-tasks')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left space-y-2 transition-all"
          >
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            <div className="text-xs font-bold text-white">Assign Tasks & Work</div>
            <div className="text-[10px] text-slate-400">Bulk Team Assignment</div>
          </button>

          <button
            onClick={() => setActiveTab('manage-teams')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left space-y-2 transition-all"
          >
            <Layers className="w-6 h-6 text-purple-400" />
            <div className="text-xs font-bold text-white">Create & Manage Teams</div>
            <div className="text-[10px] text-slate-400">Assign Team Leaders</div>
          </button>

          <button
            onClick={() => setActiveTab('manage-applications')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left space-y-2 transition-all"
          >
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <div className="text-xs font-bold text-white">Review Join Applications</div>
            <div className="text-[10px] text-slate-400">Approve & Generate ID</div>
          </button>
        </div>
      </div>

      {/* Task & Member Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Tasks Monitoring */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Assigned Tasks</h3>
            <button onClick={() => setActiveTab('manage-tasks')} className="text-xs text-amber-400 font-bold hover:underline">
              Manage Tasks
            </button>
          </div>

          <div className="space-y-3">
            {data.tasks.slice(0, 4).map(task => (
              <div key={task.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{task.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Assigned To: <strong className="text-slate-200">{task.assignedMemberName}</strong></span>
                  <span>Deadline: {task.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Account Overview */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Member Status Summary</h3>
            <button onClick={() => setActiveTab('manage-members')} className="text-xs text-amber-400 font-bold hover:underline">
              View All Members
            </button>
          </div>

          <div className="space-y-3">
            {data.users.slice(0, 4).map(mem => (
              <div key={mem.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={mem.photo} alt={mem.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{mem.name}</div>
                    <div className="text-[10px] text-slate-400">{mem.role} | <span className="text-amber-400">{mem.memberId}</span></div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  mem.status === 'Active' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                }`}>
                  {mem.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
