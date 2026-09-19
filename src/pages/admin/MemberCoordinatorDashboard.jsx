import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Eye, 
  Bell,
  Trash2,
  X
} from 'lucide-react';

export const MemberCoordinatorDashboard = ({ setActiveTab }) => {
  const { data, updateMemberStatus, updateMemberProfile, addToast, addActivityLog } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');

  const totalMembers = data.users.length;
  const activeMembers = data.users.filter(u => u.status === 'Active').length;
  const pendingRequests = data.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  const filteredMembers = data.users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.prn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'All' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notifyMessage) return;
    addToast(`Notification dispatched to ${selectedMember ? selectedMember.name : 'All Members'}!`, 'success');
    addActivityLog('Notification Sent', currentUser.name, selectedMember ? selectedMember.name : 'Broadcast', notifyMessage);
    setNotifyModalOpen(false);
    setNotifyMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              MEMBER COORDINATOR PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Member Intake, Status Tracking & Engagement
            </h1>
            <p className="text-xs text-slate-300">
              Managing Interview Pipeline, Member Roster, Role Allocations & Direct Notifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manage-applications')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold transition-all"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Review Applications ({pendingRequests})</span>
            </button>
            <button
              onClick={() => setActiveTab('create-members')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Members</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Registered Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalMembers}</div>
          <div className="text-[10px] text-emerald-400 font-bold">{activeMembers} Active in Society</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Interview Candidates</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{pendingRequests}</div>
          <div className="text-[10px] text-purple-300">Pending Evaluation</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Broadcast Notifications</span>
            <Bell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">Active</div>
          <div className="text-[10px] text-emerald-300">Direct Member Messaging</div>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Name, PRN, Email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Roles</option>
          <option value="President">President</option>
          <option value="Research Head">Research Head</option>
          <option value="Event Coordinator">Event Coordinator</option>
          <option value="Social Media & Publicity Head">Social Media & Publicity Head</option>
          <option value="Secretary">Secretary</option>
          <option value="Member Coordinator">Member Coordinator</option>
          <option value="RISE Club Member">RISE Club Member</option>
        </select>
      </div>

      {/* Member Table: Name | PRN | Department | Year | Role | Status | Actions */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">PRN</th>
                <th className="p-4">Department</th>
                <th className="p-4">Year</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredMembers.map((mem) => (
                <tr key={mem.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={mem.photo} alt={mem.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white text-xs">{mem.name}</div>
                        <div className="text-[10px] text-slate-400">{mem.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-amber-400">{mem.prn}</td>
                  <td className="p-4 text-slate-300">{mem.department}</td>
                  <td className="p-4 text-slate-400">{mem.academicYear}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {mem.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      mem.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' :
                      'bg-amber-950 text-amber-300 border border-amber-800/40'
                    }`}>
                      {mem.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedMember(mem);
                          setNotifyModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                        title="Send Notification"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      {mem.status === 'Active' ? (
                        <button
                          onClick={() => updateMemberStatus(mem.id, 'Suspended', currentUser.name)}
                          className="px-2 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-[10px] font-bold"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateMemberStatus(mem.id, 'Active', currentUser.name)}
                          className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTIFY MEMBER MODAL */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSendNotification} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">
                Send Notification to {selectedMember ? selectedMember.name : 'All Members'}
              </h3>
              <button type="button" onClick={() => setNotifyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message Content *</label>
              <textarea
                rows={4}
                required
                value={notifyMessage}
                onChange={e => setNotifyMessage(e.target.value)}
                placeholder="Type official notification..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNotifyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Dispatch Notification
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default MemberCoordinatorDashboard;
