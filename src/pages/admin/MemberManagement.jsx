import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/ConfirmModal';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserMinus, 
  ShieldAlert, 
  Edit3, 
  Eye, 
  UserPlus, 
  KeyRound, 
  Lock, 
  X, 
  CheckCircle2,
  Trash2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const MemberManagement = ({ setActiveTab }) => {
  const { data, updateMemberStatus, removeMemberSafely, deleteMemberProfile, resetMemberPassword } = useData();
  const { currentUser, permissions } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');

  const [selectedMember, setSelectedMember] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Reset Password Modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState('');

  const filteredMembers = data.users.filter(user => {
    const matchSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.prn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.memberId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || user.status === filterStatus;
    const matchRole = filterRole === 'All' || user.role === filterRole;
    return matchSearch && matchStatus && matchRole;
  });

  const handleOpenRemovalModal = (member) => {
    setSelectedMember(member);
    setRemovalModalOpen(true);
  };

  const handleConfirmRemoval = (reassignToMemberId) => {
    if (selectedMember) {
      removeMemberSafely(selectedMember.id, reassignToMemberId, currentUser.name);
    }
  };

  const handleOpenDeleteModal = (member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleConfirmPermanentDelete = () => {
    if (selectedMember) {
      deleteMemberProfile(selectedMember.id, currentUser.name);
      setDeleteModalOpen(false);
      setSelectedMember(null);
    }
  };

  const handleOpenResetModal = (member) => {
    setSelectedMember(member);
    setNewTempPassword(`${member.prn}@rise2026`);
    setResetModalOpen(true);
  };

  const handleExecuteResetPassword = (e) => {
    e.preventDefault();
    if (!newTempPassword || newTempPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    resetMemberPassword(selectedMember.id, newTempPassword, currentUser.name);
    setResetModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Research Club Member Management
          </h1>
          <p className="text-xs text-slate-400">
            Account lifecycle management, unique PRN verification, profile deletion, and secure credentials
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-members')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create / Bulk Onboard Members</span>
        </button>
      </div>

      {/* Authority Notice */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-white font-semibold">Strict Governance & Access Control:</strong> Member profiles, credentials, and private accounts are created and managed by the <strong>Faculty Coordinator (Dr. Abhijit Kshirsagar)</strong> and <strong>President (Ayushi Ahire)</strong> following the interview selection process.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Name, Member ID, PRN, Email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
            <option value="Removed">Removed</option>
          </select>

          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Faculty Coordinator">Faculty Coordinator</option>
            <option value="President">President</option>
            <option value="Research Head">Research Head</option>
            <option value="Event Coordinator">Event Coordinator</option>
            <option value="Social Media & Publicity Head">Social Media & Publicity Head</option>
            <option value="Secretary">Secretary</option>
            <option value="Member Coordinator">Member Coordinator</option>
            <option value="RISE Club Member">RISE Club Member</option>
          </select>
        </div>

      </div>

      {/* Member Data Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Member Info</th>
                <th className="p-4">Unique PRN (Login ID)</th>
                <th className="p-4">Official Role</th>
                <th className="p-4">Team</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredMembers.map(mem => (
                <tr key={mem.id} className="hover:bg-slate-900/60 transition-colors">
                  
                  {/* Member Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={mem.photo} alt={mem.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white text-sm">{mem.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-semibold">{mem.memberId}</div>
                      </div>
                    </div>
                  </td>

                  {/* PRN */}
                  <td className="p-4 font-mono text-slate-200">{mem.prn}</td>

                  {/* Role */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      mem.role === 'Faculty Coordinator' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' :
                      mem.role === 'President' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                      mem.role === 'Research Head' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {mem.role}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="p-4 text-cyan-300 font-medium">
                    {mem.teams?.[0] || 'Unassigned'}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      mem.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' :
                      mem.status === 'Suspended' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                      mem.status === 'Removed' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {mem.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* View Profile */}
                      <button
                        onClick={() => {
                          setSelectedMember(mem);
                          setProfileModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Reset Password Button */}
                      {permissions.canResetPasswords && (
                        <button
                          onClick={() => handleOpenResetModal(mem)}
                          className="p-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/50"
                          title="Reset Password (Old Password Kept Private)"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      )}

                      {/* Status Control */}
                      {permissions.canSuspendDeactivate && mem.role !== 'Faculty Coordinator' && (
                        <>
                          {mem.status === 'Active' ? (
                            <button
                              onClick={() => updateMemberStatus(mem.id, 'Suspended', currentUser.name)}
                              className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/50 font-bold text-[11px]"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateMemberStatus(mem.id, 'Active', currentUser.name)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 font-bold text-[11px]"
                            >
                              Activate
                            </button>
                          )}
                        </>
                      )}

                      {/* Remove Access Safeguard */}
                      {permissions.canRemoveAccess && mem.role !== 'Faculty Coordinator' && mem.status !== 'Removed' && (
                        <button
                          onClick={() => handleOpenRemovalModal(mem)}
                          className="p-1.5 rounded-lg bg-orange-950 hover:bg-orange-900 text-orange-300 border border-orange-800/50"
                          title="Deactivate / Suspend Access"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}

                      {/* Permanent Delete Member Profile */}
                      {permissions.canDeleteMemberProfile && mem.role !== 'Faculty Coordinator' && (
                        <button
                          onClick={() => handleOpenDeleteModal(mem)}
                          className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800/60 transition-colors"
                          title="Permanently Delete Member Profile & Account"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* SECURE RESET PASSWORD MODAL */}
      {resetModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleExecuteResetPassword} className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-outfit">Reset Member Password</h3>
              </div>
              <button type="button" onClick={() => setResetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 text-xs text-purple-200 leading-relaxed space-y-1">
              <p><strong>Member:</strong> {selectedMember.name} (PRN: <span className="font-mono">{selectedMember.prn}</span>)</p>
              <p className="text-[11px] text-purple-300">
                🔒 Existing passwords are encrypted & 100% private. Old password cannot be displayed or viewed. Setting a new password updates the secure credential hash.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Temporary Password *</label>
              <input
                type="text"
                required
                value={newTempPassword}
                onChange={e => setNewTempPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                Execute Password Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Detail Drawer Modal (Zero Password Displayed!) */}
      {profileModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Member Profile Details</h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img src={selectedMember.photo} alt={selectedMember.name} className="w-16 h-16 rounded-2xl object-cover border border-amber-500/40" />
              <div>
                <h4 className="text-lg font-bold text-white">{selectedMember.name}</h4>
                <p className="text-xs text-amber-400 font-mono">ID: {selectedMember.memberId} | PRN: {selectedMember.prn}</p>
                <p className="text-xs text-slate-300">{selectedMember.role} ({selectedMember.department})</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <p><strong className="text-slate-300">Department:</strong> {selectedMember.department}</p>
              <p><strong className="text-slate-300">Academic Year:</strong> {selectedMember.academicYear} ({selectedMember.division})</p>
              <p><strong className="text-slate-300">Joining Date:</strong> {selectedMember.joiningDate}</p>
              <p><strong className="text-slate-300">Status:</strong> <span className="text-emerald-400 font-bold">{selectedMember.status}</span></p>
              <p><strong className="text-slate-300">Technical Skills:</strong> {selectedMember.technicalSkills?.join(', ')}</p>
              <p><strong className="text-slate-300">Research Interests:</strong> {selectedMember.researchInterests?.join(', ')}</p>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                🔒 Authentication Credentials: PRN + Private Hashed Password. Password is never revealed in UI.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Safe Member Deactivation/Removal */}
      {selectedMember && (
        <ConfirmModal
          isOpen={removalModalOpen}
          onClose={() => setRemovalModalOpen(false)}
          member={selectedMember}
          activeTasks={data.tasks.filter(t => t.assignedMemberId === selectedMember.id && t.status !== 'Completed')}
          activeProjects={data.projects.filter(p => p.memberIds?.includes(selectedMember.id))}
          onConfirm={handleConfirmRemoval}
        />
      )}

      {/* PERMANENT MEMBER PROFILE DELETION MODAL */}
      {deleteModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white font-outfit">Delete Member Profile Permanently</h3>
              </div>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30 text-xs text-rose-200 leading-relaxed space-y-2">
              <p className="font-semibold text-rose-300">
                Are you sure you want to permanently delete this member's profile and account?
              </p>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-rose-900/50 space-y-1 text-slate-300">
                <p><strong>Name:</strong> {selectedMember.name}</p>
                <p><strong>PRN (Login ID):</strong> <span className="font-mono text-amber-400">{selectedMember.prn}</span></p>
                <p><strong>Member ID:</strong> <span className="font-mono text-slate-400">{selectedMember.memberId}</span></p>
                <p><strong>Role:</strong> {selectedMember.role}</p>
              </div>
              <p className="text-[11px] text-rose-300/80">
                ⚠️ This action is irreversible. The member's login credentials and account will be erased from the system.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-colors"
              >
                Permanently Delete Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
