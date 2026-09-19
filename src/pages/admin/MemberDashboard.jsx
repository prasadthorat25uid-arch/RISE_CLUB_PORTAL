import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  User, 
  Edit3, 
  Save, 
  Calendar, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Link,
  ExternalLink,
  UploadCloud,
  X,
  Lock,
  Globe
} from 'lucide-react';

export const MemberDashboard = () => {
  const { data, updateMemberProfile, updateTaskStatus, submitWorkLink } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Link Submission Modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    linkUrl: '',
    linkType: 'GitHub Repository',
    notes: ''
  });

  // Profile Form state for inline editing
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || '',
    photo: currentUser?.photo || '',
    researchInterests: currentUser?.researchInterests?.join(', ') || '',
    technicalSkills: currentUser?.technicalSkills?.join(', ') || '',
    bio: currentUser?.bio || '',
    portfolioLink: currentUser?.portfolioLink || 'https://github.com/my-research-profile'
  });

  const myTasks = data.tasks.filter(t => t.assignedMemberId === currentUser?.id);
  const myPendingTasks = myTasks.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const myCompletedTasks = myTasks.filter(t => t.status === 'Completed');

  const myProjects = data.projects.filter(p => p.memberIds?.includes(currentUser?.id) || p.studentLeader?.includes(currentUser?.name));
  const myAchievements = data.achievements.filter(a => a.recipientName === currentUser?.name);

  const handleOpenLinkModal = (task) => {
    setSelectedTaskForSubmission(task);
    setSubmissionForm({
      linkUrl: task.submissionLink || '',
      linkType: task.submissionType || 'GitHub Repository',
      notes: task.submissionNotes || ''
    });
    setLinkModalOpen(true);
  };

  const handleExecuteLinkSubmission = (e) => {
    e.preventDefault();
    if (!submissionForm.linkUrl) {
      alert("Please enter a valid Submission Link URL.");
      return;
    }

    submitWorkLink({
      taskId: selectedTaskForSubmission.id,
      memberId: currentUser.id,
      memberName: currentUser.name,
      linkUrl: submissionForm.linkUrl,
      linkType: submissionForm.linkType,
      notes: submissionForm.notes
    });

    setLinkModalOpen(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMemberProfile(currentUser.id, {
      phone: profileForm.phone,
      photo: profileForm.photo,
      researchInterests: profileForm.researchInterests.split(',').map(s=>s.trim()).filter(Boolean),
      technicalSkills: profileForm.technicalSkills.split(',').map(s=>s.trim()).filter(Boolean),
      bio: profileForm.bio,
      portfolioLink: profileForm.portfolioLink
    }, currentUser.name);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Welcome & Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img src={currentUser?.photo} alt={currentUser?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentUser?.role}
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Status: {currentUser?.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                Student PRN: <span className="text-amber-400 font-bold">{currentUser?.prn}</span> | Member ID: {currentUser?.memberId}
              </p>
              <p className="text-xs text-slate-400">
                Department: {currentUser?.department} | Academic Year: {currentUser?.academicYear}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 max-w-xs space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Isolated Personal Profile</span>
            </p>
            <p className="text-[11px]">This profile space is private and accessible exclusively via your PRN/Email login.</p>
          </div>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">My Assigned Tasks</div>
          <div className="text-2xl font-black text-amber-400 font-outfit">{myPendingTasks.length}</div>
          <div className="text-[10px] text-slate-500">Attach Work Link</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">Completed Tasks</div>
          <div className="text-2xl font-black text-emerald-400 font-outfit">{myCompletedTasks.length}</div>
          <div className="text-[10px] text-slate-500">Verified Submissions</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">Active Projects</div>
          <div className="text-2xl font-black text-cyan-400 font-outfit">{myProjects.length}</div>
          <div className="text-[10px] text-slate-500">Research & Prototypes</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">Certificates & Awards</div>
          <div className="text-2xl font-black text-purple-400 font-outfit">{myAchievements.length}</div>
          <div className="text-[10px] text-slate-500">Official Recognition</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'profile', label: 'My Editable Profile & Settings' },
          { id: 'tasks', label: 'My Tasks & Link Submissions' },
          { id: 'projects', label: 'My Projects' },
          { id: 'certificates', label: 'My Certificates' }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tb.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Tab 1: MY EDITABLE PROFILE & SETTINGS */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-outfit">My Personal Member Profile Settings</h3>
              <p className="text-xs text-slate-400">Update your photo, phone, research interests, skills, bio, and portfolio link</p>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit My Profile</span>
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Non-Editable Protected System Information */}
            <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protected Official System Metadata</h4>
              <div className="space-y-2 text-xs">
                <p><strong className="text-slate-300">Official Role:</strong> <span className="text-amber-400 font-bold">{currentUser?.role}</span></p>
                <p><strong className="text-slate-300">Student Unique PRN:</strong> <span className="text-white font-mono">{currentUser?.prn}</span></p>
                <p><strong className="text-slate-300">Member ID:</strong> <span className="text-white font-mono">{currentUser?.memberId}</span></p>
                <p><strong className="text-slate-300">Membership Status:</strong> <span className="text-emerald-400 font-bold">{currentUser?.status}</span></p>
                <p><strong className="text-slate-300">Department:</strong> <span className="text-slate-200">{currentUser?.department}</span></p>
                <p><strong className="text-slate-300">Joining Date:</strong> <span className="text-slate-200">{currentUser?.joiningDate}</span></p>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  🔒 Password privacy protected. Passwords are securely hashed and never displayed.
                </p>
              </div>
            </div>

            {/* Editable Profile Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileForm.photo}
                  onChange={e => setProfileForm({ ...profileForm, photo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Research Interests (Comma Separated)</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileForm.researchInterests}
                  onChange={e => setProfileForm({ ...profileForm, researchInterests: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Technical & AI Skills</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={profileForm.technicalSkills}
                  onChange={e => setProfileForm({ ...profileForm, technicalSkills: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Personal Portfolio / GitHub Link</label>
                <input
                  type="url"
                  disabled={!isEditingProfile}
                  value={profileForm.portfolioLink}
                  onChange={e => setProfileForm({ ...profileForm, portfolioLink: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio & Research Summary</label>
                <textarea
                  rows={3}
                  disabled={!isEditingProfile}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Tab 2: My Tasks & Link Submissions */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-outfit">Assigned Work & Link Submissions</h3>
            <span className="text-xs text-amber-400 font-semibold">🔗 Attach deliverable URLs to your assigned tasks</span>
          </div>

          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No active tasks assigned currently.
              </div>
            ) : (
              myTasks.map(task => (
                <div key={task.id} className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{task.name}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      task.status === 'Completed' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>

                  {task.submissionLink ? (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="text-slate-300 font-bold block">{task.submissionType} Attached</span>
                          <a
                            href={task.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                          >
                            <span>{task.submissionLink}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{task.submittedAt}</span>
                    </div>
                  ) : (
                    <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-200">
                      ⚠ No link deliverable attached yet. Click below to submit work URL.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
                    <span>Deadline: <strong className="text-amber-400">{task.deadline}</strong></span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenLinkModal(task)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{task.submissionLink ? 'Update Work Link' : 'Submit Work via Link'}</span>
                      </button>

                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed', 100)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LINK SUBMISSION MODAL */}
      {linkModalOpen && selectedTaskForSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleExecuteLinkSubmission} className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Link className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-outfit">Submit Work in Link Format</h3>
              </div>
              <button type="button" onClick={() => setLinkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <p><strong>Task:</strong> {selectedTaskForSubmission.name}</p>
              <p className="text-slate-400 text-[11px]">All member deliverables are stored in link format for Faculty & Leadership evaluation.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Link Type</label>
              <select
                value={submissionForm.linkType}
                onChange={e => setSubmissionForm({ ...submissionForm, linkType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              >
                <option value="GitHub Repository">GitHub Repository</option>
                <option value="Google Drive Document">Google Drive Document / Dataset</option>
                <option value="Research Paper Link">Research Paper Link / Manuscript</option>
                <option value="Figma Prototype">Figma Prototype</option>
                <option value="Video Demo Link">Video Demo Link</option>
                <option value="Other URL">Other External Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Submission Link URL *</label>
              <input
                type="url"
                required
                placeholder="https://github.com/your-username/project-repo"
                value={submissionForm.linkUrl}
                onChange={e => setSubmissionForm({ ...submissionForm, linkUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Deliverable Notes & Summary</label>
              <textarea
                rows={3}
                placeholder="Brief summary of work completed in this link..."
                value={submissionForm.notes}
                onChange={e => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Link Submission
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
