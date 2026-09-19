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
  FileText
} from 'lucide-react';

export const ProfilePage = ({ setActiveTab }) => {
  const { data } = useData();
  const { currentUser, isAuthenticated } = useAuth();
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

  // Filter projects, publications, and certificates associated with this user
  const myProjects = data.projects.filter(p => 
    p.memberIds?.includes(currentUser.id) || 
    p.studentLeader?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    p.teamName === currentUser.teams?.[0]
  );

  const myPublications = data.publications.filter(pub => 
    pub.authors?.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  const myCertificates = data.achievements.filter(a => 
    a.recipientName?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    a.recipientPRN === currentUser.prn
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      
      {/* 1. TOP PROFILE HEADER & ACTIONS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Dynamic Avatar with fallback to Initials */}
            <div className="relative group shrink-0">
              <Avatar
                src={currentUser.photo}
                name={currentUser.name}
                size="3xl"
                className="w-28 h-28 rounded-3xl border-2 border-amber-400/60 shadow-2xl"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-transform group-hover:scale-110"
                title="Change Photo / Edit Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Member Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentUser.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser.status || 'Active Member'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
                {currentUser.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="font-mono text-amber-400">PRN: {currentUser.prn}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">ID: {currentUser.memberId}</span>
                <span>•</span>
                <span>{currentUser.department} ({currentUser.academicYear})</span>
              </div>

              {currentUser.bio && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>

          {/* Edit Profile CTA Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

        </div>

        {/* Social / Portfolio Links Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{currentUser.email}</span>
            </span>

            {currentUser.phone && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.phone}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentUser.githubUrl && (
              <a
                href={currentUser.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {currentUser.linkedinUrl && (
              <a
                href={currentUser.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
              >
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LinkedIn</span>
              </a>
            )}

            {currentUser.portfolioLink && (
              <a
                href={currentUser.portfolioLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. RESEARCH INTERESTS & TECHNICAL SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Research Interests */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Research Interests & Thrust Areas</span>
            </h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.researchInterests && currentUser.researchInterests.length > 0 ? (
              currentUser.researchInterests.map((interest, idx) => (
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
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.technicalSkills && currentUser.technicalSkills.length > 0 ? (
              currentUser.technicalSkills.map((skill, idx) => (
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

      {/* 3. PROJECTS, RESEARCH PAPERS & VERIFIED CERTIFICATES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-outfit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Assigned Projects</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-lg">
              {myProjects.length}
            </span>
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
              <span>Authored Publications</span>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-lg">
              {myPublications.length}
            </span>
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
              <span>Verified Accolades</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg">
              {myCertificates.length}
            </span>
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
        targetUser={currentUser}
      />

    </div>
  );
};

export default ProfilePage;
