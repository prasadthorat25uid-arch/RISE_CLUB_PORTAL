import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  UserPlus, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Award, 
  TrendingUp,
  BarChart2
} from 'lucide-react';

export const FacultyDashboard = ({ setActiveTab }) => {
  const { data } = useData();
  const { currentUser } = useAuth();

  const totalMembers = data.users.length;
  const activeMembers = data.users.filter(u => u.status === 'Active').length;
  const pendingMembers = data.users.filter(u => u.status === 'Pending').length;
  const suspendedMembers = data.users.filter(u => u.status === 'Suspended').length;

  const totalTeams = data.teams.length;
  const totalProjects = data.projects.length;
  
  const pendingTasks = data.tasks.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;
  const completedTasks = data.tasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = data.tasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Overall Supervisory Authority Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-xs text-slate-300">
              Faculty Coordinator | Sanjivani University SET Department of Integrated B.Tech (2026–2027)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg transition-all"
            >
              <span>Edit My Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('manage-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Manage Members</span>
            </button>
            <button
              onClick={() => setActiveTab('create-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Bulk Create Accounts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalMembers}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{activeMembers} Active</span> | 
            <span className="text-rose-400 font-bold">{suspendedMembers} Suspended</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Teams</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalTeams}</div>
          <div className="text-[11px] text-slate-400">Research & Tech Groups</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Task Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{completedTasks}</div>
          <div className="text-[11px] text-slate-400">
            {pendingTasks} In Progress | <span className="text-rose-400">{overdueTasks} Overdue</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Projects</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalProjects}</div>
          <div className="text-[11px] text-slate-400">IEEE & Patent Track</div>
        </div>
      </div>

      {/* Quick Administrative Operations Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-outfit">Administrative Supervisory Controls</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('create-members')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left space-y-2 transition-all group"
          >
            <UserPlus className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-white">Create / Bulk Members</div>
              <p className="text-[10px] text-slate-400">Option A Form & Option B CSV</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('manage-tasks')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left space-y-2 transition-all group"
          >
            <CheckCircle2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-white">Assign & Reassign Work</div>
              <p className="text-[10px] text-slate-400">Individual & Team Bulk Task</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('manage-teams')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left space-y-2 transition-all group"
          >
            <Layers className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-white">Create / Edit Teams</div>
              <p className="text-[10px] text-slate-400">Research & Innovation Teams</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('issue-certificates')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left space-y-2 transition-all group"
          >
            <Award className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-white">Issue Recognition</div>
              <p className="text-[10px] text-slate-400">Merit Certificates & Awards</p>
            </div>
          </button>
        </div>
      </div>

      {/* Admin Activity Log Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Real-time System Audit & Administrative Activity Logs</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Action</th>
                <th className="p-3">Executed By</th>
                <th className="p-3">Target</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {data.activityLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-amber-400">{log.action}</td>
                  <td className="p-3 font-medium text-white">{log.user}</td>
                  <td className="p-3 text-cyan-300">{log.target}</td>
                  <td className="p-3 text-slate-400 font-mono">{log.dateTime}</td>
                  <td className="p-3 text-slate-400">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
