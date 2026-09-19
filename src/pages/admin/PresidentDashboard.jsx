import React, { useState } from 'react';
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
  ShieldCheck,
  Award,
  BookOpen,
  Activity,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Trash2
} from 'lucide-react';

export const PresidentDashboard = ({ setActiveTab }) => {
  const { data, createAnnouncement, deleteMemberProfile } = useData();
  const { currentUser } = useAuth();

  const [announcementModal, setAnnouncementModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'Normal' });

  const totalMembers = data.users.length;
  const activeMembers = data.users.filter(u => u.status === 'Active').length;
  const totalProjects = data.projects.length;
  const totalResearch = data.research.length;
  const upcomingEvents = data.events.filter(e => e.status === 'Upcoming').length;
  const pendingApps = data.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    createAnnouncement({
      title: newAnn.title,
      content: newAnn.content,
      priority: newAnn.priority,
      category: 'Presidential Notice'
    }, currentUser.name);
    setNewAnn({ title: '', content: '', priority: 'Normal' });
    setAnnouncementModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* President Executive Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/50 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md">
                PRESIDENT EXECUTIVE PORTAL
              </span>
              <span className="text-xs text-amber-300 font-semibold">Chief Society Administrator</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Overall Executive Command • Department of Integrated B.Tech, Sanjivani University (2026–2027)
            </p>
          </div>

          {/* Quick Action Button Bar */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg transition-all"
            >
              <span>Edit My Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('create-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Member</span>
            </button>
            <button
              onClick={() => setActiveTab('manage-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-md transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Manage / Delete Members</span>
            </button>
            <button
              onClick={() => setAnnouncementModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all"
            >
              <Megaphone className="w-4 h-4" />
              <span>Post Announcement</span>
            </button>
          </div>

        </div>
      </div>

      {/* 6 Executive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalMembers}</div>
          <div className="text-[10px] text-emerald-400 font-bold">{activeMembers} Active</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Active Projects</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalProjects}</div>
          <div className="text-[10px] text-cyan-300">Prototypes & Labs</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Research Papers</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalResearch}</div>
          <div className="text-[10px] text-purple-300">Publications & Preprints</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Upcoming Events</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{upcomingEvents}</div>
          <div className="text-[10px] text-rose-300">Workshops & Talks</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Pending Requests</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{pendingApps}</div>
          <div className="text-[10px] text-amber-300">Interviews Queued</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Certificates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.achievements?.length || 12}</div>
          <div className="text-[10px] text-emerald-300">Issued & Verified</div>
        </div>

      </div>

      {/* Main President Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity Logs & Audit Trail */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-outfit">Society Activity Logs & Audit Trail</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {data.activityLogs?.slice(0, 10).map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400">{log.action}</span>
                    <span className="text-slate-500 text-[10px]">• by {log.user}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.description}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{log.dateTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Navigation & Admin Hub */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Executive Controls</span>
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('manage-applications')}
              className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-all group"
            >
              <span>Interview Applications ({pendingApps})</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('manage-tasks')}
              className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-all group"
            >
              <span>Task & Deliverable Evaluation</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('issue-certificates')}
              className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-all group"
            >
              <span>Issue Verified Certificates</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('manage-teams')}
              className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-all group"
            >
              <span>Manage Research Clusters</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </button>
          </div>
        </div>

      </div>

      {/* POST ANNOUNCEMENT MODAL */}
      {announcementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleCreateAnnouncement} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white font-outfit">Post Official Presidential Announcement</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={newAnn.title}
                onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                placeholder="e.g. Call for Papers - IEEE Symposium"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Content *</label>
              <textarea
                required
                rows={4}
                value={newAnn.content}
                onChange={e => setNewAnn({ ...newAnn, content: e.target.value })}
                placeholder="Announcement details..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAnnouncementModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Broadcast Announcement
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default PresidentDashboard;
