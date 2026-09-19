import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Layers, 
  Edit3, 
  Save, 
  ShieldCheck, 
  ExternalLink,
  Lock
} from 'lucide-react';

export const ProfilePage = ({ setActiveTab }) => {
  const { data, updateMemberProfile, addToast } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || '',
    photo: currentUser?.photo || '',
    bio: currentUser?.bio || '',
    researchInterests: currentUser?.researchInterests?.join(', ') || '',
    technicalSkills: currentUser?.technicalSkills?.join(', ') || '',
    portfolioLink: currentUser?.portfolioLink || 'https://github.com/profile'
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-outfit">Please Sign In</h2>
        <p className="text-xs text-slate-400">You must be logged in to view and edit your member profile.</p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
        >
          Go to Login Portal
        </button>
      </div>
    );
  }

  const myProjects = data.projects.filter(p => p.memberIds?.includes(currentUser?.id));
  const myCertificates = data.achievements.filter(a => a.recipientName === currentUser?.name || a.recipientPRN === currentUser?.prn);

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img 
            src={currentUser.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} 
            alt={currentUser.name} 
            className="w-24 h-24 rounded-3xl object-cover border-2 border-amber-400/60 shadow-xl" 
          />
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {currentUser.role}
            </span>
            <h1 className="text-2xl font-black text-white font-outfit">{currentUser.name}</h1>
            <p className="text-xs text-slate-400 font-mono">PRN: <span className="text-amber-400">{currentUser.prn}</span> • ID: {currentUser.memberId}</p>
            <p className="text-xs text-slate-300">{currentUser.department} ({currentUser.academicYear})</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-md transition-all shrink-0"
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-outfit">Personal Profile & Research Info</h3>
          {isEditing && (
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 opacity-70"
            />
          </div>

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
          <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Research Focus</label>
          <textarea
            rows={3}
            disabled={!isEditing}
            value={profileForm.bio}
            onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
          />
        </div>
      </form>

      {/* Projects & Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>My Active Projects ({myProjects.length})</span>
          </h4>
          <div className="space-y-2">
            {myProjects.length > 0 ? myProjects.map(p => (
              <div key={p.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">{p.title}</div>
                <div className="text-[10px] text-cyan-400">{p.domain}</div>
              </div>
            )) : (
              <p className="text-xs text-slate-500">No active projects assigned yet.</p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>My Verified Certificates ({myCertificates.length})</span>
          </h4>
          <div className="space-y-2">
            {myCertificates.length > 0 ? myCertificates.map(c => (
              <div key={c.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">{c.title}</div>
                <div className="text-[10px] text-emerald-400">{c.date || '2026-09-01'}</div>
              </div>
            )) : (
              <p className="text-xs text-slate-500">No certificates issued yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
