import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  Send, 
  Play, 
  Layers, 
  Filter, 
  Sparkles, 
  FileText, 
  Github, 
  Globe, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';

export const TasksPage = ({ setActiveTab }) => {
  const { data, submitTaskWork, updateTaskProgress, addToast } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All');
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState('GitHub Repository');
  const [notes, setNotes] = useState('');

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Private Tasks Workspace</h2>
        <p className="text-xs text-slate-400">Please log in to your RISE member account to access your assigned tasks and deliverables.</p>
        <button
          onClick={() => setActiveTab?.('login')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-all"
        >
          Go to Member Login
        </button>
      </div>
    );
  }

  // Filter tasks strictly belonging to the logged-in member
  const myTasks = useMemo(() => {
    return (data.tasks || []).filter(t => 
      t.assignedMemberId === currentUser.id || 
      t.assignedTo === 'All Members' ||
      t.assignedMemberId === currentUser.prn
    );
  }, [data.tasks, currentUser.id, currentUser.prn]);

  // Compute deadline category for a task
  const getDeadlineInfo = (deadlineStr, status) => {
    if (status === 'Completed') return { label: 'Completed', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' };
    if (!deadlineStr) return { label: 'No Deadline', color: 'text-slate-400 bg-slate-900 border-slate-800' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-400 bg-rose-950/80 border-rose-500/50', isOverdue: true };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', color: 'text-amber-300 bg-amber-950/80 border-amber-500/50 animate-pulse' };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', color: 'text-orange-300 bg-orange-950/80 border-orange-500/40' };
    }
    return { label: `Due in ${diffDays} days`, color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30' };
  };

  // Filtered list
  const filteredTasks = useMemo(() => {
    return myTasks.filter(task => {
      const deadlineInfo = getDeadlineInfo(task.deadline, task.status);
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Overdue') return deadlineInfo.isOverdue && task.status !== 'Completed';
      if (activeFilter === 'Pending') return task.status === 'Pending' || task.status === 'Assigned';
      if (activeFilter === 'In Progress') return task.status === 'In Progress';
      if (activeFilter === 'Submitted') return task.status === 'Submitted' || task.status === 'Under Review';
      if (activeFilter === 'Needs Revision') return task.status === 'Needs Revision';
      if (activeFilter === 'Completed') return task.status === 'Completed';
      return true;
    });
  }, [myTasks, activeFilter]);

  // Summary Metrics
  const stats = useMemo(() => {
    return {
      total: myTasks.length,
      pending: myTasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length,
      inProgress: myTasks.filter(t => t.status === 'In Progress').length,
      submitted: myTasks.filter(t => t.status === 'Submitted' || t.status === 'Under Review').length,
      needsRevision: myTasks.filter(t => t.status === 'Needs Revision').length,
      completed: myTasks.filter(t => t.status === 'Completed').length,
      overdue: myTasks.filter(t => {
        const d = getDeadlineInfo(t.deadline, t.status);
        return d.isOverdue && t.status !== 'Completed';
      }).length
    };
  }, [myTasks]);

  const handleStartTask = (taskId) => {
    updateTaskProgress(taskId, 25, 'In Progress', currentUser.id, currentUser.name);
    addToast('Task marked as In Progress (25%).', 'info');
  };

  const handleOpenSubmission = (task) => {
    setSelectedTask(task);
    setLinkUrl(task.submissionLink || '');
    setLinkType(task.submissionType || 'GitHub Repository');
    setNotes(task.submissionNotes || '');
    setSubmissionModalOpen(true);
  };

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (!linkUrl) {
      addToast('Please enter your deliverable link URL.', 'error');
      return;
    }

    submitTaskWork(
      selectedTask.id,
      { linkUrl, linkType, notes },
      currentUser.id,
      currentUser.name
    );

    setSubmissionModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Member Task Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
            My Assigned <span className="gradient-text-sun">Tasks & Deliverables</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your milestones, submit deliverables via repository/document links, and review leadership feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab?.('profile')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all"
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab?.('dashboard-member')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
          >
            ERP Dashboard
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setActiveFilter('All')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'All' ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Tasks</span>
          <div className="text-xl font-black text-white font-outfit mt-1">{stats.total}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Pending')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'Pending' ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending</span>
          <div className="text-xl font-black text-amber-300 font-outfit mt-1">{stats.pending}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('In Progress')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'In Progress' ? 'border-cyan-500/60 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">In Progress</span>
          <div className="text-xl font-black text-cyan-300 font-outfit mt-1">{stats.inProgress}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Submitted')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'Submitted' ? 'border-purple-500/60 bg-purple-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Submitted</span>
          <div className="text-xl font-black text-purple-300 font-outfit mt-1">{stats.submitted}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Needs Revision')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'Needs Revision' ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Revision</span>
          <div className="text-xl font-black text-rose-300 font-outfit mt-1">{stats.needsRevision}</div>
        </div>

        <div 
          onClick={() => setActiveFilter('Completed')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            activeFilter === 'Completed' ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Completed</span>
          <div className="text-xl font-black text-emerald-300 font-outfit mt-1">{stats.completed}</div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-outfit flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Assigned Deliverables ({filteredTasks.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Filter: <strong className="text-white">{activeFilter}</strong></span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No tasks matching "{activeFilter}"</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are all caught up! When leadership assigns tasks or requests revisions, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const deadlineInfo = getDeadlineInfo(task.deadline, task.status);
              const isNeedsRevision = task.status === 'Needs Revision';
              const isCompleted = task.status === 'Completed';
              const isSubmitted = task.status === 'Submitted' || task.status === 'Under Review';

              return (
                <div 
                  key={task.id}
                  className={`glass-panel p-6 rounded-3xl border transition-all space-y-4 ${
                    isNeedsRevision ? 'border-rose-500/50 bg-rose-950/10' :
                    isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' :
                    'border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deadlineInfo.color}`}>
                          {deadlineInfo.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          task.priority === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                          task.priority === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Assigned by: <strong className="text-slate-200">{task.assignedByName || 'Leadership'}</strong>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-outfit mt-1">
                        {task.name || task.title}
                      </h3>
                    </div>

                    {/* Progress Bar & Status Pill */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                        <span className={`text-xs font-bold ${
                          isCompleted ? 'text-emerald-300' :
                          isNeedsRevision ? 'text-rose-300' :
                          isSubmitted ? 'text-purple-300' : 'text-amber-300'
                        }`}>
                          {task.status || 'Assigned'}
                        </span>
                      </div>
                      <div className="w-16 sm:w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' :
                            isNeedsRevision ? 'bg-rose-500' :
                            isSubmitted ? 'bg-purple-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300">{task.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                      {task.description}
                    </p>
                  )}

                  {/* Feedback / Review Comments from Leadership */}
                  {task.reviewComment && (
                    <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      isNeedsRevision ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' :
                      'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    }`}>
                      <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-0.5">
                        <strong>Leadership Feedback:</strong>
                        <p>{task.reviewComment}</p>
                      </div>
                    </div>
                  )}

                  {/* Submitted Deliverable Info if already submitted */}
                  {task.submissionLink && (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-400">Submitted Deliverable:</span>
                        <a 
                          href={task.submissionLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>{task.submissionType || 'Link'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {task.submittedAt && (
                        <span className="text-[10px] text-slate-500 font-mono">Submitted on {task.submittedAt}</span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons for Member */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {task.status === 'Pending' || task.status === 'Assigned' ? (
                        <button
                          onClick={() => handleStartTask(task.id)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>Start Task</span>
                        </button>
                      ) : null}

                      {task.status === 'In Progress' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold mr-1">Update Progress:</span>
                          {[50, 75, 90].map(pct => (
                            <button
                              key={pct}
                              onClick={() => updateTaskProgress(task.id, pct, 'In Progress', currentUser.id, currentUser.name)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                                task.progress === pct 
                                  ? 'bg-amber-500 text-slate-950 font-bold' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleOpenSubmission(task)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                          isNeedsRevision 
                            ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{task.submissionLink ? 'Resubmit Deliverable Link' : 'Submit Work Link'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {submissionModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-5 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-outfit">Submit Task Deliverable</h3>
                <p className="text-xs text-slate-400">{selectedTask.name || selectedTask.title}</p>
              </div>
              <button 
                onClick={() => setSubmissionModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deliverable Type
                </label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="GitHub Repository">GitHub Repository</option>
                  <option value="Google Drive Document">Google Drive Document / Folder</option>
                  <option value="Google Colab Notebook">Google Colab Notebook</option>
                  <option value="Figma Prototype">Figma Prototype</option>
                  <option value="ArXiv / Research PDF Draft">ArXiv / Research PDF Draft</option>
                  <option value="Live Project URL">Live Project URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deliverable Link URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/my-org/my-project"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Submission Notes / Summary of Work
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain what has been completed, test results, benchmarks, or instructions for the reviewer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmissionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Deliverable</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TasksPage;
