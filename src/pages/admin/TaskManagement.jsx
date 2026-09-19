import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Plus, Users, Clock, AlertTriangle, Layers, Filter } from 'lucide-react';

export const TaskManagement = () => {
  const { data, createTask, createBulkTasks, updateTaskStatus } = useData();
  const { currentUser } = useAuth();

  const [assignmentMode, setAssignmentMode] = useState('single'); // 'single' or 'bulk'
  const [modalOpen, setModalOpen] = useState(false);

  // Single Task Form
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedMemberId: '',
    assignedTeamId: '',
    project: 'LLM for Regional Languages',
    priority: 'Medium',
    deadline: '2026-10-15',
    notes: ''
  });

  // Bulk Task State
  const [bulkMemberIds, setBulkMemberIds] = useState([]);

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.name || !taskForm.assignedMemberId) {
      alert("Please fill in Task Name and select a member.");
      return;
    }

    const memberObj = data.users.find(u => u.id === taskForm.assignedMemberId);

    createTask({
      ...taskForm,
      assignedMemberName: memberObj ? memberObj.name : 'Member'
    }, currentUser.name);

    setModalOpen(false);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.name || bulkMemberIds.length === 0) {
      alert("Please fill in Task Name and select at least one member.");
      return;
    }

    createBulkTasks(taskForm, bulkMemberIds, currentUser.name);
    setModalOpen(false);
  };

  const toggleSelectAllTeam = (teamId) => {
    const teamObj = data.teams.find(t => t.id === teamId);
    if (!teamObj || !teamObj.memberIds) return;
    setBulkMemberIds(teamObj.memberIds);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">Work & Task Assignment System</h1>
          <p className="text-xs text-slate-400">Assign individual tasks or bulk assign tasks to entire teams</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Task List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-4">Task Name</th>
                <th className="p-4">Assigned Member</th>
                <th className="p-4">Project / Domain</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Status & Progress</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {data.tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-900/60">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{task.name}</div>
                    <div className="text-[11px] text-slate-400">{task.description}</div>
                  </td>
                  <td className="p-4 font-semibold text-amber-300">
                    {task.assignedMemberName}
                  </td>
                  <td className="p-4 text-slate-300">{task.project}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                      task.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{task.deadline}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400">{task.status} ({task.progress}%)</span>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {task.status !== 'Completed' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'Completed', 100)}
                        className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-bold text-[10px]"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-outfit">Assign Work / Task</h3>
              <div className="flex gap-1 bg-slate-800 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAssignmentMode('single')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${assignmentMode === 'single' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => setAssignmentMode('bulk')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${assignmentMode === 'bulk' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Bulk / Team
                </button>
              </div>
            </div>

            <form onSubmit={assignmentMode === 'single' ? handleSingleSubmit : handleBulkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare Literature Review Presentation"
                  value={taskForm.name}
                  onChange={e => setTaskForm({ ...taskForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed instructions..."
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {assignmentMode === 'single' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign to Member *</label>
                  <select
                    value={taskForm.assignedMemberId}
                    onChange={e => setTaskForm({ ...taskForm, assignedMemberId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="">Select Member...</option>
                    {data.users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role} - {u.memberId})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">Select Team Members for Bulk Assignment:</label>
                  
                  {/* Select Entire Team Shortcut */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {data.teams.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleSelectAllTeam(t.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-amber-300 font-bold hover:bg-slate-700"
                      >
                        + Select Entire {t.name}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {data.users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-1 hover:bg-slate-900 rounded">
                        <input
                          type="checkbox"
                          checked={bulkMemberIds.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) setBulkMemberIds(prev => [...prev, u.id]);
                            else setBulkMemberIds(prev => prev.filter(id => id !== u.id));
                          }}
                        />
                        <span>{u.name} ({u.memberId})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={taskForm.deadline}
                    onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  {assignmentMode === 'single' ? 'Assign Task' : `Bulk Assign (${bulkMemberIds.length} Members)`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
