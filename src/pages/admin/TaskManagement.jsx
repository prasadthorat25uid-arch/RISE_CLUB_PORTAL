import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Plus, 
  Users, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Filter, 
  ExternalLink, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Search, 
  Send, 
  X, 
  ShieldCheck,
  Globe,
  FileText,
  AlertCircle
} from 'lucide-react';

export const TaskManagement = () => {
  const { 
    data, 
    createTask, 
    createBulkTasks, 
    reviewTaskSubmission, 
    editTask, 
    deleteTask, 
    getMemberName, 
    addToast 
  } = useData();
  const { currentUser, permissions } = useAuth();

  const [assignmentMode, setAssignmentMode] = useState('single');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Task creation form
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedMemberId: '',
    assignedTeamId: '',
    project: 'General Research',
    priority: 'Medium',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const [bulkMemberIds, setBulkMemberIds] = useState([]);

  // Review form
  const [reviewDecision, setReviewDecision] = useState('Approve');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewScore, setReviewScore] = useState(100);

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    assignedMemberId: ''
  });

  // Calculate deadline status
  const getDeadlineStatus = (deadlineStr, status) => {
    if (status === 'Completed') return { label: 'Completed', isOverdue: false, color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' };
    if (!deadlineStr) return { label: 'No Deadline', isOverdue: false, color: 'text-slate-400 bg-slate-900 border-slate-800' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { label: `Overdue (${Math.abs(diffDays)}d)`, isOverdue: true, color: 'text-rose-400 bg-rose-950/80 border-rose-500/50' };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', isOverdue: false, color: 'text-amber-300 bg-amber-950/80 border-amber-500/50' };
    }
    return { label: `Due in ${diffDays}d`, isOverdue: false, color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30' };
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return (data.tasks || []).filter(task => {
      const assignedName = getMemberName(task.assignedMemberId, task.assignedMemberName);
      const matchesSearch = 
        !searchQuery ||
        task.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedByName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Overdue' ? getDeadlineStatus(task.deadline, task.status).isOverdue && task.status !== 'Completed' : task.status === statusFilter);

      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data.tasks, searchQuery, statusFilter, priorityFilter, data.users]);

  // Statistics
  const stats = useMemo(() => {
    const tasks = data.tasks || [];
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      submitted: tasks.filter(t => t.status === 'Submitted' || t.status === 'Under Review').length,
      needsRevision: tasks.filter(t => t.status === 'Needs Revision').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => getDeadlineStatus(t.deadline, t.status).isOverdue && t.status !== 'Completed').length
    };
  }, [data.tasks]);

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.name || !taskForm.assignedMemberId) {
      addToast("Please fill in Task Name and select a member.", "error");
      return;
    }

    createTask(taskForm, currentUser.name, currentUser.id);
    setCreateModalOpen(false);
    setTaskForm({
      name: '',
      description: '',
      assignedMemberId: '',
      assignedTeamId: '',
      project: 'General Research',
      priority: 'Medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.name || bulkMemberIds.length === 0) {
      addToast("Please fill in Task Name and select at least one member.", "error");
      return;
    }

    createBulkTasks(taskForm, bulkMemberIds, currentUser.name, currentUser.id);
    setCreateModalOpen(false);
    setBulkMemberIds([]);
  };

  const openReviewModal = (task) => {
    setSelectedTask(task);
    setReviewDecision(task.status === 'Needs Revision' ? 'Needs Revision' : 'Approve');
    setReviewComment(task.reviewComment || '');
    setReviewScore(task.score || 100);
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
      currentUser.id,
      currentUser.name
    );

    setReviewModalOpen(false);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditForm({
      name: task.name || task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      deadline: task.deadline || '',
      assignedMemberId: task.assignedMemberId || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    editTask(
      selectedTask.id,
      editForm,
      currentUser.id,
      currentUser.name
    );

    setEditModalOpen(false);
  };

  const handleDelete = (taskId, taskName) => {
    if (window.confirm(`Are you sure you want to permanently delete task: "${taskName}"?`)) {
      deleteTask(taskId, currentUser.id, currentUser.name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Leadership Task Oversight & Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
            Task Assignment & <span className="gradient-text-sun">Deliverable Review</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign research and organizational tasks to members, set deadlines, evaluate submitted links, and provide official feedback.
          </p>
        </div>

        {permissions?.canAssignTasks && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div 
          onClick={() => setStatusFilter('All')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'All' ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
          <div className="text-xl font-black text-white font-outfit mt-1">{stats.total}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Pending' ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending</span>
          <div className="text-xl font-black text-amber-300 font-outfit mt-1">{stats.pending}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('In Progress')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'In Progress' ? 'border-cyan-500/60 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">In Progress</span>
          <div className="text-xl font-black text-cyan-300 font-outfit mt-1">{stats.inProgress}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Submitted')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Submitted' ? 'border-purple-500/60 bg-purple-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <span>Submitted</span>
            {stats.submitted > 0 && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            )}
          </span>
          <div className="text-xl font-black text-purple-300 font-outfit mt-1">{stats.submitted}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Needs Revision')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Needs Revision' ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Revision</span>
          <div className="text-xl font-black text-rose-300 font-outfit mt-1">{stats.needsRevision}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Completed')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Completed' ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Completed</span>
          <div className="text-xl font-black text-emerald-300 font-outfit mt-1">{stats.completed}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Overdue')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Overdue' ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Overdue</span>
          <div className="text-xl font-black text-rose-400 font-outfit mt-1">{stats.overdue}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted (Needs Review)</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Task & Project</th>
                <th className="p-4">Assigned Member</th>
                <th className="p-4">Submitted Deliverable</th>
                <th className="p-4">Priority & Deadline</th>
                <th className="p-4">Status & Progress</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    No tasks found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => {
                  const assignedName = getMemberName(task.assignedMemberId, task.assignedMemberName);
                  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);
                  const isSubmitted = task.status === 'Submitted' || task.status === 'Under Review';
                  const isCompleted = task.status === 'Completed';
                  const isNeedsRevision = task.status === 'Needs Revision';

                  return (
                    <tr key={task.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{task.name || task.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{task.description}</div>
                        <span className="inline-block mt-1 text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                          {task.project || 'General Research'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-amber-300 block">{assignedName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">By: {task.assignedByName || 'Leadership'}</span>
                      </td>

                      <td className="p-4">
                        {task.submissionLink ? (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-cyan-300 block">{task.submissionType || 'Link'}</span>
                            <a
                              href={task.submissionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                            >
                              <span>Review Deliverable</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {task.submittedAt && (
                              <span className="text-[9px] text-slate-500 block font-mono">{task.submittedAt}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Pending member submission</span>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                            task.priority === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800/40' :
                            task.priority === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-300">{task.deadline}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${deadlineInfo.color}`}>
                            {deadlineInfo.label}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`text-[11px] font-bold ${
                            isCompleted ? 'text-emerald-400' :
                            isNeedsRevision ? 'text-rose-400' :
                            isSubmitted ? 'text-purple-400 font-extrabold' : 'text-amber-400'
                          }`}>
                            {task.status || 'Assigned'} ({task.progress || 0}%)
                          </span>
                          <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                isCompleted ? 'bg-emerald-500' :
                                isNeedsRevision ? 'bg-rose-500' :
                                isSubmitted ? 'bg-purple-500' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${task.progress || 0}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Review submission CTA */}
                          {task.submissionLink && (
                            <button
                              onClick={() => openReviewModal(task)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-800 text-purple-200 border border-purple-500/40 font-bold text-[10px] flex items-center gap-1 transition-all"
                              title="Evaluate Submission & Provide Feedback"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Evaluate</span>
                            </button>
                          )}

                          {/* Edit task */}
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            title="Edit Task"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete task */}
                          {permissions?.canManageMembers && (
                            <button
                              onClick={() => handleDelete(task.id, task.name || task.title)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-all"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Creation Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-5 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-outfit">Assign Research / Project Task</h3>
                <p className="text-xs text-slate-400">Assign milestones and track deliverables in link format</p>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Single vs Bulk mode selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAssignmentMode('single')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  assignmentMode === 'single' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Single Member Assignment
              </button>
              <button
                type="button"
                onClick={() => setAssignmentMode('bulk')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  assignmentMode === 'bulk' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulk Assignment by Team
              </button>
            </div>

            <form onSubmit={assignmentMode === 'single' ? handleSingleSubmit : handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Literature Review on Transformer Attention"
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Description & Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide milestone details, expected repository structure, deliverables format..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {assignmentMode === 'single' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assign To Member <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={taskForm.assignedMemberId}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedMemberId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Member...</option>
                    {(data.users || []).map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role} - {u.prn})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Select Multiple Members <span className="text-rose-400">*</span>
                  </label>
                  <div className="max-h-36 overflow-y-auto bg-slate-950 border border-slate-700 rounded-xl p-2 space-y-1">
                    {(data.users || []).map(u => (
                      <label key={u.id} className="flex items-center gap-2 p-1 rounded hover:bg-slate-800 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkMemberIds.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkMemberIds(prev => [...prev, u.id]);
                            } else {
                              setBulkMemberIds(prev => prev.filter(id => id !== u.id));
                            }
                          }}
                          className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                        />
                        <span>{u.name} ({u.role})</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{bulkMemberIds.length} members selected</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deadline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {assignmentMode === 'single' ? 'Assign Task' : `Assign to ${bulkMemberIds.length} Members`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-purple-500/40 shadow-2xl space-y-5 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-outfit">Evaluate Member Deliverable</h3>
                <p className="text-xs text-slate-400">{selectedTask.name || selectedTask.title}</p>
              </div>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Submitted deliverable preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Member: <strong>{getMemberName(selectedTask.assignedMemberId, selectedTask.assignedMemberName)}</strong></span>
                <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {selectedTask.submissionType || 'Deliverable'}
                </span>
              </div>
              
              {selectedTask.submissionLink && (
                <div className="pt-1">
                  <a
                    href={selectedTask.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-cyan-400 hover:underline flex items-center gap-1.5 break-all"
                  >
                    <span>{selectedTask.submissionLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}

              {selectedTask.submissionNotes && (
                <div className="pt-2 border-t border-slate-800/80 text-slate-300">
                  <strong className="text-slate-400 block text-[10px] uppercase">Member Notes:</strong>
                  <p className="mt-0.5">{selectedTask.submissionNotes}</p>
                </div>
              )}
            </div>

            {/* Review Decision Form */}
            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Evaluation Decision
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('Approve')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      reviewDecision === 'Approve'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Approve & Complete</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('Needs Revision')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      reviewDecision === 'Needs Revision'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Request Revision</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Feedback / Review Comments
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    reviewDecision === 'Approve' 
                      ? 'e.g., Excellent work on the data processing pipeline. Approved for the paper draft.' 
                      : 'e.g., Please address the missing validation loss plot in the notebook and re-submit.'
                  }
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    reviewDecision === 'Approve'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  {reviewDecision === 'Approve' ? 'Confirm Approval' : 'Send Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Edit Task Parameters</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskManagement;
