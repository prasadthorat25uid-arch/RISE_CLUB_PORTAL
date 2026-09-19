import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/Avatar';
import { EditProfileModal } from '../../components/EditProfileModal';
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
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  Github, 
  Linkedin, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Eye,
  EyeOff,
  Share2
} from 'lucide-react';

export const ProfilePage = ({ setActiveTab, targetUserId }) => {
  const { data, updateMemberProfile } = useData();
  const { currentUser, isAuthenticated, permissions } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Private Member Profile</h2>
        <p className="text-xs text-slate-400">Please sign in with your student credentials to view and manage your RISE profile.</p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          Go to Member Login Portal
        </button>
      </div>
    );
  }

  // Resolve target user record
  const effectiveUserId = targetUserId || currentUser.id;
  const targetUser = data.users.find(u => u.id === effectiveUserId || u.memberId === effectiveUserId || u.prn === effectiveUserId) || currentUser;

  // If attempting to view someone else's private profile without admin rights
  if (targetUser.id !== currentUser.id && !permissions?.canManageMembers) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          Private member profiles can only be viewed by the account owner and authorized RISE leadership.
        </p>
        <button
          onClick={() => setActiveTab('profile')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 hover:text-white text-xs font-bold transition-all"
        >
          View My Own Profile
        </button>
      </div>
    );
  }

  const profileUser = targetUser;

  // Filter projects, publications, and certificates associated with this user
  const myProjects = data.projects.filter(p => 
    p.memberIds?.includes(profileUser.id) || 
    p.studentLeader?.toLowerCase().includes(profileUser.name.toLowerCase()) ||
    p.teamName === profileUser.teams?.[0]
  );

  const myPublications = data.publications.filter(pub => 
    pub.authors?.toLowerCase().includes(profileUser.name.toLowerCase())
  );

  const myCertificates = data.achievements.filter(a => 
    a.recipientName?.toLowerCase().includes(profileUser.name.toLowerCase()) ||
    a.recipientPRN === profileUser.prn
  );

  const toggleVisibility = async (field) => {
    const currentValue = profileUser[field] !== false;
    await updateMemberProfile(profileUser.id, {
      [field]: !currentValue
    }, currentUser.name);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      
      {/* 1. TOP PRIVATE PROFILE HEADER & ACTIONS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Dynamic Avatar */}
            <div className="relative group shrink-0">
              <Avatar
                src={profileUser.photo}
                name={profileUser.name}
                size="3xl"
                className="w-28 h-28 rounded-3xl border-2 border-amber-400/60 shadow-2xl"
              />
              {(currentUser.id === profileUser.id || permissions?.canManageMembers) && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-transform group-hover:scale-110"
                  title="Change Photo / Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Core Member Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {profileUser.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{profileUser.status || 'Active Member'}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  Joined: {profileUser.joiningDate || '2026-07-01'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
                {profileUser.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="font-mono text-amber-400 font-bold">PRN: {profileUser.prn}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">ID: {profileUser.memberId}</span>
                <span>•</span>
                <span>{profileUser.department} ({profileUser.academicYear})</span>
              </div>

              {profileUser.bio && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">
                  {profileUser.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs: View Public Profile & Edit Profile */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(`member/public/${profileUser.id}`)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-md transition-all"
              title="Open Public RISE Research Portfolio"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>View Public RISE Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {(currentUser.id === profileUser.id || permissions?.canManageMembers) && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

        </div>

        {/* Private Personal Credentials Grid */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>Private Account Email</span>
            </span>
            <p className="text-white font-mono font-semibold">{profileUser.email}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Private Contact Phone</span>
            </span>
            <p className="text-white font-mono font-semibold">{profileUser.phone || 'Not Provided'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>Security Classification</span>
            </span>
            <p className="text-purple-300 font-semibold">Private Information • Auth Protected</p>
          </div>
        </div>
      </div>

      {/* 2. PUBLIC PROFILE VISIBILITY CONTROLS CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-5 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>Public RISE Research Portfolio Visibility Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control which sections appear when visitors view public RISE profile at <span className="text-amber-400 font-mono">#/member/public/{profileUser.id}</span>.
            </p>
          </div>

          <button
            onClick={() => setActiveTab(`member/public/${profileUser.id}`)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-amber-300 font-semibold transition-all shrink-0"
          >
            Preview Public Profile →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div 
            onClick={() => toggleVisibility('showResearch')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showResearch !== false ? 'bg-purple-950/40 border-purple-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Research Publications</div>
              <div className="text-[10px] text-slate-400">Approved scientific papers</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showResearch !== false ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showResearch !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

          <div 
            onClick={() => toggleVisibility('showProjects')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showProjects !== false ? 'bg-cyan-950/40 border-cyan-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Projects & Demos</div>
              <div className="text-[10px] text-slate-400">Prototypes & GitHub repos</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showProjects !== false ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showProjects !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

          <div 
            onClick={() => toggleVisibility('showPublications')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showPublications !== false ? 'bg-amber-950/40 border-amber-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Publications & Patents</div>
              <div className="text-[10px] text-slate-400">Scopus papers & Indian patents</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showPublications !== false ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showPublications !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

          <div 
            onClick={() => toggleVisibility('showEvents')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showEvents !== false ? 'bg-emerald-950/40 border-emerald-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Event Roles</div>
              <div className="text-[10px] text-slate-400">Workshops & Symposia roles</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showEvents !== false ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showEvents !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

          <div 
            onClick={() => toggleVisibility('showAchievements')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showAchievements !== false ? 'bg-yellow-950/40 border-yellow-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Honors & Accolades</div>
              <div className="text-[10px] text-slate-400">Hackathon wins & awards</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showAchievements !== false ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showAchievements !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

          <div 
            onClick={() => toggleVisibility('showSkills')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              profileUser.showSkills !== false ? 'bg-blue-950/40 border-blue-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold">Technical Skills</div>
              <div className="text-[10px] text-slate-400">Languages & AI frameworks</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profileUser.showSkills !== false ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-500'
            }`}>
              {profileUser.showSkills !== false ? 'PUBLIC' : 'HIDDEN'}
            </span>
          </div>

        </div>
      </div>

      {/* 3. RESEARCH INTERESTS & TECHNICAL SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Research Interests */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Research Interests & Thrust Areas</span>
            </h3>
            {(currentUser.id === profileUser.id || permissions?.canManageMembers) && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {profileUser.researchInterests && profileUser.researchInterests.length > 0 ? (
              profileUser.researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-200 text-xs font-semibold"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No research interests listed yet.</p>
            )}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Technical Skills & Frameworks</span>
            </h3>
            {(currentUser.id === profileUser.id || permissions?.canManageMembers) && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {profileUser.technicalSkills && profileUser.technicalSkills.length > 0 ? (
              profileUser.technicalSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-200 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No technical skills added yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. PROJECTS, RESEARCH PAPERS & VERIFIED CERTIFICATES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>My Projects ({myProjects.length})</span>
            </div>
          </h4>

          <div className="space-y-3">
            {myProjects.length > 0 ? (
              myProjects.map(proj => (
                <div key={proj.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs font-bold text-white">{proj.name || proj.title}</strong>
                    <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 shrink-0">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/40 text-center text-xs text-slate-500">
                No active projects assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* Publications */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>My Publications ({myPublications.length})</span>
            </div>
          </h4>

          <div className="space-y-3">
            {myPublications.length > 0 ? (
              myPublications.map(pub => (
                <div key={pub.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <strong className="text-xs font-bold text-white block">{pub.title}</strong>
                  <div className="text-[10px] text-purple-300 font-medium">{pub.journal} ({pub.year})</div>
                  <p className="text-[10px] font-mono text-cyan-400">DOI: {pub.doi}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/40 text-center text-xs text-slate-500">
                No research publications recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Certificates & Achievements */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>My Certificates ({myCertificates.length})</span>
            </div>
          </h4>

          <div className="space-y-3">
            {myCertificates.length > 0 ? (
              myCertificates.map(ach => (
                <div key={ach.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs font-bold text-white">{ach.title}</strong>
                    <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950">
                      {ach.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Issued by: {ach.issuedBy}</p>
                  <p className="text-[10px] font-mono text-slate-500">{ach.date}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/40 text-center text-xs text-slate-500">
                No accolades recorded yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal Component */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        targetUser={profileUser}
      />

    </div>
  );
};

export default ProfilePage;
