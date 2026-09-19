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
  ShieldCheck
} from 'lucide-react';

export const MemberDashboard = () => {
  const { data, updateMemberProfile, updateTaskStatus } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || '',
    photo: currentUser?.photo || '',
    researchInterests: currentUser?.researchInterests?.join(', ') || '',
    technicalSkills: currentUser?.technicalSkills?.join(', ') || '',
    bio: currentUser?.bio || ''
  });

  const myTasks = data.tasks.filter(t => t.assignedMemberId === currentUser?.id);
  const myPendingTasks = myTasks.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const myCompletedTasks = myTasks.filter(t => t.status === 'Completed');

  const myTeams = data.teams.filter(team => team.memberIds?.includes(currentUser?.id) || team.leaderId === currentUser?.id);
  const myProjects = data.projects.filter(p => p.memberIds?.includes(currentUser?.id) || p.studentLeader?.includes(currentUser?.name));
  const myAchievements = data.achievements.filter(a => a.recipientName === currentUser?.name);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMemberProfile(currentUser.id, {
      phone: profileForm.phone,
      photo: profileForm.photo,
      researchInterests: profileForm.researchInterests.split(',').map(s=>s.trim()).filter(Boolean),
      technicalSkills: profileForm.technicalSkills.split(',').map(s=>s.trim()).filter(Boolean),
      bio: profileForm.bio
    }, currentUser.name);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Welcome Banner Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
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
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-xs text-slate-300 font-mono">
              Member ID: <span className="text-amber-400 font-bold">{currentUser?.memberId}</span> | Student ID / PRN: {currentUser?.prn}
            </p>
            <p className="text-xs text-slate-400">
              Department: {currentUser?.department} | Academic Year: {currentUser?.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">My Pending Tasks</div>
          <div className="text-2xl font-black text-amber-400 font-outfit">{myPendingTasks.length}</div>
          <div className="text-[10px] text-slate-500">Requires Attention</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <div className="text-xs font-semibold text-slate-400">Completed Tasks</div>
          <div className="text-2xl font-black text-emerald-400 font-outfit">{myCompletedTasks.length}</div>
          <div className="text-[10px] text-slate-500">Factual History</div>
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

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'My Tasks' },
          { id: 'projects', label: 'My Projects' },
          { id: 'teams', label: 'My Teams' },
          { id: 'certificates', label: 'My Certificates' },
          { id: 'profile', label: 'My Profile Settings' }
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

      {/* Tab 1: My Tasks */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white font-outfit">Assigned Work & Action Items</h3>
          
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

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
                    <span>Deadline: <strong className="text-amber-400">{task.deadline}</strong></span>
                    <span>Assigned By: {task.assignedByName}</span>
                    
                    {task.status !== 'Completed' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'Completed', 100)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: My Profile Settings (Permitted Field Editing Only!) */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-outfit">Member Profile Management</h3>
              <p className="text-xs text-slate-400">Edit permitted personal fields (Photo, Phone, Research Interests, Bio, Skills)</p>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Non-editable Official Information */}
            <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official System Metadata (Non-Editable)</h4>
              <div className="space-y-2 text-xs">
                <p><strong className="text-slate-300">Official Role:</strong> <span className="text-amber-400 font-bold">{currentUser?.role}</span></p>
                <p><strong className="text-slate-300">Member ID:</strong> <span className="text-white font-mono">{currentUser?.memberId}</span></p>
                <p><strong className="text-slate-300">Student ID / PRN:</strong> <span className="text-white font-mono">{currentUser?.prn}</span></p>
                <p><strong className="text-slate-300">Membership Status:</strong> <span className="text-emerald-400 font-bold">{currentUser?.status}</span></p>
                <p><strong className="text-slate-300">Department:</strong> <span className="text-slate-200">{currentUser?.department}</span></p>
                <p><strong className="text-slate-300">Joining Date:</strong> <span className="text-slate-200">{currentUser?.joiningDate}</span></p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Research Interests (Comma separated)</label>
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio & Portfolio Summary</label>
                <textarea
                  rows={3}
                  disabled={!isEditingProfile}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white disabled:opacity-60 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
