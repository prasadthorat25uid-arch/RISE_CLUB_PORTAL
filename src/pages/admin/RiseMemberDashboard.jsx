import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/Avatar';
import { EditProfileModal } from '../../components/EditProfileModal';
import { 
  User, 
  BookOpen, 
  Layers, 
  Calendar, 
  Award, 
  Bell, 
  Lock, 
  Edit3, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Link,
  Download,
  X
} from 'lucide-react';

export const RiseMemberDashboard = () => {
  const { data, updateMemberProfile, submitWorkLink, addToast } = useData();
  const { currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Link submission modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [linkType, setLinkType] = useState('GitHub Repository');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || '',
    photo: currentUser?.photo || '',
    bio: currentUser?.bio || '',
    researchInterests: currentUser?.researchInterests?.join(', ') || '',
    technicalSkills: currentUser?.technicalSkills?.join(', ') || '',
    portfolioLink: currentUser?.portfolioLink || 'https://github.com/my-profile'
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const myTasks = data.tasks.filter(t => t.assignedMemberId === currentUser?.id || t.assignedTo === 'All Members');
  const myProjects = data.projects.filter(p => p.memberIds?.includes(currentUser?.id));
  const myCertificates = data.achievements.filter(a => a.recipientName === currentUser?.name || a.recipientPRN === currentUser?.prn);

  const handleOpenSubmission = (task) => {
    setSelectedTask(task);
    setSubmissionUrl(task.submissionLink || '');
    setSubmissionNotes(task.submissionNotes || '');
    setLinkModalOpen(true);
  };

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (!submissionUrl) return;

    submitWorkLink({
      taskId: selectedTask.id,
      memberId: currentUser.id,
      memberName: currentUser.name,
      linkUrl: submissionUrl,
      linkType: linkType,
      notes: submissionNotes
    });

    setLinkModalOpen(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMemberProfile(currentUser.id, {
      phone: profileForm.phone,
      photo: profileForm.photo,
      bio: profileForm.bio,
      researchInterests: profileForm.researchInterests.split(',').map(s=>s.trim()).filter(Boolean),
      technicalSkills: profileForm.technicalSkills.split(',').map(s=>s.trim()).filter(Boolean),
      portfolioLink: profileForm.portfolioLink
    }, currentUser.name);
    setIsEditing(false);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    addToast("Personal account password updated successfully!", "success");
    setPasswordModalOpen(false);
    setNewPassword('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Member Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar 
              src={currentUser?.photo} 
              name={currentUser?.name} 
              size="2xl" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400/60 shadow-lg shrink-0" 
            />
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                RESEARCH CLUB MEMBER DASHBOARD
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white font-outfit">
                {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                PRN: <span className="text-amber-400">{currentUser?.prn}</span> • ID: {currentUser?.memberId} • {currentUser?.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/50 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Member Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">My Assigned Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{myTasks.length}</div>
          <div className="text-[10px] text-amber-300">Deliverables Assigned</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">My Research Projects</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{myProjects.length || 1}</div>
          <div className="text-[10px] text-cyan-300">Active Lab Groups</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">My Certificates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{myCertificates.length}</div>
          <div className="text-[10px] text-emerald-300">Verified Credentials</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Announcements</span>
            <Bell className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.announcements?.length || 4}</div>
          <div className="text-[10px] text-purple-300">Society Notices</div>
        </div>
      </div>

      {/* Member Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`pb-3 transition-colors ${activeSubTab === 'overview' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          My Tasks & Deliverables
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 transition-colors ${activeSubTab === 'profile' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          Personal Profile & Skills
        </button>
        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`pb-3 transition-colors ${activeSubTab === 'certificates' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          Verified Certificates
        </button>
      </div>

      {/* OVERVIEW TAB: MY TASKS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map((t) => (
              <div key={t.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
                <div className="flex items-start justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    t.priority === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {t.priority} Priority
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === 'Completed' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-outfit">{t.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Deadline: <span className="text-white">{t.deadline}</span>
                </div>

                {t.submissionLink && (
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block">Submitted Deliverable:</span>
                    <a href={t.submissionLink} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1 font-mono truncate">
                      <Link className="w-3.5 h-3.5" />
                      <span>{t.submissionLink}</span>
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenSubmission(t)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>{t.submissionLink ? 'Update Link Submission' : 'Submit Work in Link Format'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE TAB: EDITABLE FIELDS */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-outfit">My Member Profile Information</h3>
            {isEditing && (
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                disabled={!isEditing}
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Portfolio / GitHub Profile URL</label>
              <input
                type="url"
                disabled={!isEditing}
                value={profileForm.portfolioLink}
                onChange={e => setProfileForm({ ...profileForm, portfolioLink: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Profile Photo URL</label>
            <input
              type="url"
              disabled={!isEditing}
              value={profileForm.photo}
              onChange={e => setProfileForm({ ...profileForm, photo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Research Interests (Comma separated)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileForm.researchInterests}
                onChange={e => setProfileForm({ ...profileForm, researchInterests: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills (Comma separated)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileForm.technicalSkills}
                onChange={e => setProfileForm({ ...profileForm, technicalSkills: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Statement of Research Focus</label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={profileForm.bio}
              onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
            />
          </div>
        </form>
      )}

      {/* CERTIFICATES TAB */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCertificates.map((cert) => (
              <div key={cert.id} className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    Verified Credential
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{cert.date || '2026-09-01'}</span>
                </div>

                <h3 className="text-base font-bold text-white font-outfit">{cert.title}</h3>
                <p className="text-xs text-slate-300">{cert.description || 'Awarded for outstanding contribution to research initiatives in RISE society.'}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-amber-400 font-mono">Issued by Sanjivani University</span>
                  <button
                    onClick={() => addToast(`Certificate PDF for "${cert.title}" downloaded!`, 'success')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMISSION LINK MODAL */}
      {linkModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveSubmission} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Submit Deliverable in Link Format</h3>
              <button type="button" onClick={() => setLinkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deliverable Link URL *</label>
              <input
                type="url"
                required
                placeholder="https://github.com/my-repo or https://drive.google.com/..."
                value={submissionUrl}
                onChange={e => setSubmissionUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Link Format Type</label>
              <select
                value={linkType}
                onChange={e => setLinkType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="GitHub Repository">GitHub Repository</option>
                <option value="Google Drive Document/Folder">Google Drive Document/Folder</option>
                <option value="arXiv / SSRN Preprint">arXiv / SSRN Preprint</option>
                <option value="Figma Design">Figma Design</option>
                <option value="Video Demo">Video Demo</option>
                <option value="Other Web Link">Other Web Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Submission Notes</label>
              <textarea
                rows={3}
                value={submissionNotes}
                onChange={e => setSubmissionNotes(e.target.value)}
                placeholder="Include commit hash, branch name, or access instructions..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Submit Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleUpdatePassword} className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Update Personal Account Password</h3>
              <button type="button" onClick={() => setPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Private Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Profile Modal */}
      {currentUser && (
        <EditProfileModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          targetUser={currentUser}
        />
      )}

    </div>
  );
};

export default RiseMemberDashboard;
