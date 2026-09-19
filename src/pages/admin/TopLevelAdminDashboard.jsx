import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/Avatar';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  BookOpen, 
  Award, 
  Megaphone, 
  FileText, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Plus,
  Edit3,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const TopLevelAdminDashboard = ({ setActiveTab }) => {
  const { data, reviewTaskSubmission, addToast } = useData();
  const { currentUser, permissions } = useAuth();

  // Review submission modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('Approve');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewScore, setReviewScore] = useState(100);

  // Real Database Metrics (Section 30 - 11 Cards)
  const stats = useMemo(() => {
    const users = data.users || [];
    const tasks = data.tasks || [];
    const projects = data.projects || [];
    const publications = data.publications || [];
    const events = data.events || [];
    const applications = data.applications || [];

    const now = new Date();

    const isTaskOverdue = (t) => {
      if (t.status === 'Completed') return false;
      if (t.status === 'Overdue') return true;
      if (!t.deadline) return false;
      return new Date(t.deadline) < now;
    };

    const pendingCount = tasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length;
    const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
    const submittedCount = tasks.filter(t => t.status === 'Submitted' || t.status === 'Under Review').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const overdueCount = tasks.filter(isTaskOverdue).length;

    const pendingApps = applications.filter(a => a.status === 'Pending').length;
    const pendingReviews = submittedCount;

    return {
      totalMembers: users.length,
      activeMembers: users.filter(u => u.status === 'Active').length,
      pendingTasks: pendingCount,
      inProgressTasks: inProgressCount,
      submittedTasks: submittedCount,
      completedTasks: completedCount,
      overdueTasks: overdueCount,
      researchProjects: projects.length,
      publications: publications.length,
      upcomingEvents: events.filter(e => e.status === 'Upcoming' || !e.status).length,
      pendingApprovals: pendingApps + pendingReviews
    };
  }, [data.users, data.tasks, data.projects, data.publications, data.events, data.applications]);

  // Peer Top-Level Administrators
  const topAdmins = useMemo(() => {
    return (data.users || []).filter(u => 
      u.role === 'Faculty Coordinator' || 
      u.role === 'President' || 
      u.role === 'Vice President'
    );
  }, [data.users]);

  // Recent Submissions Awaiting Evaluation
  const pendingSubmissions = useMemo(() => {
    return (data.tasks || []).filter(t => t.status === 'Submitted' || t.status === 'Under Review').slice(0, 5);
  }, [data.tasks]);

  const openReviewModal = (task) => {
    setSelectedTask(task);
    setReviewDecision('Approve');
    setReviewComment('');
    setReviewScore(100);
    setReviewModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    reviewTaskSubmission(
      selectedTask.id,
      {
        decision: reviewDecision,
        reviewComment,
        score: parseInt(reviewScore, 10) || 100
      },
      currentUser?.id || 'admin',
      currentUser?.name || 'Administrator'
    );

    setReviewModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 text-slate-100">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER: DYNAMIC WELCOME & EQUAL AUTHORITY BADGE
          ───────────────────────────────────────────────────────────── */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/50 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider">
                Top-Level Administration
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Faculty Coordinator = President = Vice President (Equal Highest Authority)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
              Welcome, {currentUser?.name}
            </h1>
            
            <p className="text-xs text-slate-300 font-mono">
              Role: <span className="text-amber-400 font-bold">{currentUser?.role}</span> • Department of Integrated B.Tech • Sanjivani University (2026–2027)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('manage-tasks')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setActiveTab('create-members')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Member</span>
            </button>
            <button
              onClick={() => setActiveTab('manage-members')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Manage Members</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PEER LEADERSHIP DISPLAY: FACULTY, PRESIDENT & VP
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            RISE Peer Top-Level Administrators (Equal Authority)
          </h2>
          <span className="text-[11px] text-amber-400 font-semibold font-mono">
            3 Equal Executive Seats
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topAdmins.map((admin) => {
            const isCurrent = currentUser?.id === admin.id;
            return (
              <div 
                key={admin.id} 
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isCurrent 
                    ? 'bg-amber-950/30 border-amber-500/70 shadow-lg' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={admin.photo} 
                    name={admin.name} 
                    size="md" 
                    className="w-11 h-11 rounded-xl shrink-0" 
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{admin.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400 font-mono font-medium">{admin.role}</div>
                    <div className="text-[10px] text-slate-400">{admin.email}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-950 text-slate-300 border border-slate-800">
                  Equal Admin
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 11 REQUIRED DASHBOARD METRIC CARDS (SECTION 30)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-outfit">
            System Operational Metrics
          </h2>
          <span className="text-xs text-slate-400">All values live from Supabase</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* 1. Total Members */}
          <div 
            onClick={() => setActiveTab('manage-members')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Members</span>
              <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white font-outfit">{stats.totalMembers}</div>
            <p className="text-[10px] text-slate-400">Registered Accounts</p>
          </div>

          {/* 2. Active Members */}
          <div 
            onClick={() => setActiveTab('manage-members')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Members</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-outfit">{stats.activeMembers}</div>
            <p className="text-[10px] text-slate-400">Active Access</p>
          </div>

          {/* 3. Pending Tasks */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Tasks</span>
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-outfit">{stats.pendingTasks}</div>
            <p className="text-[10px] text-slate-400">Awaiting Member Start</p>
          </div>

          {/* 4. In Progress */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
              <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-outfit">{stats.inProgressTasks}</div>
            <p className="text-[10px] text-slate-400">Being Actively Worked</p>
          </div>

          {/* 5. Submitted */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Submitted</span>
              <FileText className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-purple-300 font-outfit">{stats.submittedTasks}</div>
            <p className="text-[10px] text-slate-400">Ready for Review</p>
          </div>

          {/* 6. Completed */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-outfit">{stats.completedTasks}</div>
            <p className="text-[10px] text-slate-400">Approved Deliverables</p>
          </div>

        </div>

        {/* Second Row of Metric Cards (7 to 11) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
          
          {/* 7. Overdue Tasks */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Overdue</span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-rose-400 font-outfit">{stats.overdueTasks}</div>
            <p className="text-[10px] text-slate-400">Past Deadline</p>
          </div>

          {/* 8. Research Projects */}
          <div 
            onClick={() => setActiveTab('projects')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Research Projects</span>
              <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white font-outfit">{stats.researchProjects}</div>
            <p className="text-[10px] text-slate-400">Lab Prototypes</p>
          </div>

          {/* 9. Publications */}
          <div 
            onClick={() => setActiveTab('publications')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Publications</span>
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white font-outfit">{stats.publications}</div>
            <p className="text-[10px] text-slate-400">Scopus & IEEE Track</p>
          </div>

          {/* 10. Upcoming Events */}
          <div 
            onClick={() => setActiveTab('events')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Events</span>
              <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white font-outfit">{stats.upcomingEvents}</div>
            <p className="text-[10px] text-slate-400">Symposia & Contests</p>
          </div>

          {/* 11. Pending Approvals */}
          <div 
            onClick={() => setActiveTab('manage-tasks')}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-yellow-500/50 cursor-pointer transition-all space-y-1 group sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Approvals</span>
              <AlertCircle className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-yellow-400 font-outfit">{stats.pendingApprovals}</div>
            <p className="text-[10px] text-slate-400">Submissions & Apps</p>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. SUBMISSIONS AWAITING REVIEW TABLE & ACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Submissions Awaiting Evaluation */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white font-outfit">
                Deliverable Submissions Under Review
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('manage-tasks')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingSubmissions.length > 0 ? (
            <div className="space-y-3">
              {pendingSubmissions.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{task.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{task.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Member: <strong className="text-slate-200">{task.assignedMemberName}</strong></span>
                    {task.submissionLink && (
                      <a href={task.submissionLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-mono">
                        <ExternalLink className="w-3 h-3" />
                        <span>View Work</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => openReviewModal(task)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      Evaluate Submission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-1.5 text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">All submissions have been reviewed.</p>
              <p className="text-[11px] text-slate-500">No student deliverables currently awaiting evaluation.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Administrative Actions (Section 31) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Top-Level Administrator Tools</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => setActiveTab('manage-tasks')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-amber-400">Task Management</div>
              <p className="text-[10px] text-slate-400">Assign, reassign, set deadlines</p>
            </button>

            <button
              onClick={() => setActiveTab('create-members')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-amber-400">Member Onboarding</div>
              <p className="text-[10px] text-slate-400">Single & bulk CSV creation</p>
            </button>

            <button
              onClick={() => setActiveTab('manage-members')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-400">Member Controls</div>
              <p className="text-[10px] text-slate-400">Activate, deactivate, change roles</p>
            </button>

            <button
              onClick={() => setActiveTab('manage-applications')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-emerald-400">Join Applications</div>
              <p className="text-[10px] text-slate-400">Approve & generate PRN credentials</p>
            </button>

            <button
              onClick={() => setActiveTab('manage-announcements')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-purple-400">Announcements</div>
              <p className="text-[10px] text-slate-400">Broadcast university bulletins</p>
            </button>

            <button
              onClick={() => setActiveTab('issue-certificates')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/40 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-yellow-400">Certificates</div>
              <p className="text-[10px] text-slate-400">Issue verified accolades</p>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Sanjivani University RISE ERP</span>
            <span className="text-amber-400 font-mono font-bold">2026–2027</span>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. REVIEW EVALUATION MODAL
          ───────────────────────────────────────────────────────────── */}
      {reviewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveReview} className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-outfit">Evaluate Student Submission</h3>
                <p className="text-xs text-purple-300 font-medium">Task: {selectedTask.name}</p>
              </div>
              <button type="button" onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p><strong>Student:</strong> {selectedTask.assignedMemberName}</p>
              <p><strong>Deliverable Type:</strong> {selectedTask.submissionType || 'Link'}</p>
              {selectedTask.submissionLink && (
                <p className="truncate">
                  <strong>Link:</strong> <a href={selectedTask.submissionLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{selectedTask.submissionLink}</a>
                </p>
              )}
              {selectedTask.submissionNotes && (
                <p><strong>Notes:</strong> {selectedTask.submissionNotes}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Evaluation Decision</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  reviewDecision === 'Approve' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="decision"
                    value="Approve"
                    checked={reviewDecision === 'Approve'}
                    onChange={() => setReviewDecision('Approve')}
                    className="hidden"
                  />
                  <Check className="w-4 h-4" />
                  <span>Approve & Complete</span>
                </label>

                <label className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  reviewDecision === 'Needs Revision' ? 'border-rose-500 bg-rose-950 text-rose-300' : 'border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="decision"
                    value="Needs Revision"
                    checked={reviewDecision === 'Needs Revision'}
                    onChange={() => setReviewDecision('Needs Revision')}
                    className="hidden"
                  />
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Revision</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Teacher / Administrator Feedback</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Provide constructive scientific feedback or revision requirements..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                Submit Evaluation
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default TopLevelAdminDashboard;
