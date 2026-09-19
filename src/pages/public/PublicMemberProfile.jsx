import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/Avatar';
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Layers, 
  Calendar, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  UserCheck,
  Lock
} from 'lucide-react';

/**
 * Whitelist filter ensuring strictly public fields are returned.
 * PRN, private email, phone, password hash, internal notes are NEVER exposed.
 */
export const getPublicProfile = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    photo: user.photo,
    department: user.showDepartment !== false ? user.department : null,
    academicYear: user.showAcademicYear !== false ? user.academicYear : null,
    bio: user.bio || user.publicBio || 'RISE Research & Innovation Society Member.',
    researchInterests: user.showResearchInterests !== false ? (user.researchInterests || []) : [],
    technicalSkills: user.showSkills !== false ? (user.technicalSkills || []) : [],
    githubUrl: user.githubUrl || user.github || '',
    linkedinUrl: user.linkedinUrl || user.linkedin || '',
    portfolioLink: user.portfolioLink || user.portfolioUrl || '',
    showResearch: user.showResearch !== false,
    showProjects: user.showProjects !== false,
    showPublications: user.showPublications !== false,
    showEvents: user.showEvents !== false,
    showAchievements: user.showAchievements !== false,
    showSkills: user.showSkills !== false,
    showResearchInterests: user.showResearchInterests !== false,
    showDepartment: user.showDepartment !== false,
    showAcademicYear: user.showAcademicYear !== false
  };
};

export const PublicMemberProfile = ({ memberId, setActiveTab }) => {
  const { data } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  // Find user by ID or PRN or Name
  const rawUser = useData().data.users.find(u => 
    u.id === memberId || 
    u.memberId === memberId ||
    u.prn === memberId
  );

  const profile = useMemo(() => getPublicProfile(rawUser), [rawUser]);

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Member Profile Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested member profile ID does not exist or has been removed from the public registry.
        </p>
        <button
          onClick={() => setActiveTab('members')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </button>
      </div>
    );
  }

  // Filter public projects associated with this member
  const publicProjects = (data.projects || []).filter(p => {
    if (p.visibility === 'Private' || p.visibility === 'Internal') return false;
    return (
      p.memberIds?.includes(profile.id) ||
      p.studentLeader?.toLowerCase().includes(profile.name.toLowerCase()) ||
      p.facultyMentor?.toLowerCase().includes(profile.name.toLowerCase())
    );
  });

  // Filter public publications authored by this member
  const publicPublications = (data.publications || []).filter(pub => {
    if (pub.visibility === 'Private' || pub.visibility === 'Internal') return false;
    return pub.authors?.toLowerCase().includes(profile.name.toLowerCase());
  });

  // Filter public research items
  const publicResearch = (data.researchItems || []).filter(res => {
    if (res.visibility === 'Private' || res.visibility === 'Internal') return false;
    return (
      res.leadAuthor?.toLowerCase().includes(profile.name.toLowerCase()) ||
      res.team?.toLowerCase().includes(profile.name.toLowerCase())
    );
  });

  // Filter public events where member has an approved organizational role
  const publicEvents = (data.events || []).filter(evt => {
    if (evt.visibility === 'Private' || evt.visibility === 'Internal') return false;
    return (
      evt.coordinator?.toLowerCase().includes(profile.name.toLowerCase()) ||
      evt.organizer?.toLowerCase().includes(profile.name.toLowerCase())
    );
  });

  // Filter public achievements
  const publicAchievements = (data.achievements || []).filter(ach => {
    if (ach.visibility === 'Private' || ach.visibility === 'Internal') return false;
    return ach.recipientName?.toLowerCase().includes(profile.name.toLowerCase());
  });

  const isOwnProfile = isAuthenticated && currentUser?.id === profile.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-10">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('members')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Member Directory</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('profile')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Manage Private Profile & Settings</span>
          </button>
        )}
      </div>

      {/* 1. PUBLIC PROFILE HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Public Avatar */}
            <Avatar
              src={profile.photo}
              name={profile.name}
              size="3xl"
              className="w-28 h-28 rounded-3xl border-2 border-amber-400/60 shadow-2xl shrink-0"
            />

            {/* Public Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                  {profile.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Sanjivani University
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified RISE Member</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit">
                {profile.name}
              </h1>

              {(profile.department || profile.academicYear) && (
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {profile.department} {profile.academicYear ? `(${profile.academicYear})` : ''} • School of Engineering & Technology
                </p>
              )}

              {profile.bio && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-2">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-md"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-300 hover:text-cyan-200 text-xs font-semibold transition-all shadow-md"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}

            {profile.portfolioLink && (
              <a
                href={profile.portfolioLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>

        </div>

        {/* Quick Public Research Interests Pills */}
        {profile.showResearchInterests && profile.researchInterests.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Focus Areas:
            </span>
            {profile.researchInterests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-semibold"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. RESEARCH CONDUCTED (IF APPROVED & ENABLED) */}
      {profile.showResearch && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white font-outfit">Research & Scientific Inquiries</h2>
          </div>

          {publicResearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicResearch.map(res => (
                <div key={res.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                      {res.domain || 'Emerging Intelligence'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Status: {res.status || res.currentStep || 'Active'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{res.title}</h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p><strong>Target Journal:</strong> {res.targetJournal || 'Elsevier / IEEE'}</p>
                    {res.impactFactor && <p><strong>Impact Factor:</strong> {res.impactFactor}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No public research projects listed.</p>
          )}
        </div>
      )}

      {/* 3. ACTIVE PROJECTS & PROTOTYPES (IF APPROVED & ENABLED) */}
      {profile.showProjects && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-outfit">Projects & Technical Prototypes</h2>
          </div>

          {publicProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicProjects.map(proj => (
                <div key={proj.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {proj.researchDomain || proj.domain || 'Engineering'}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{proj.name || proj.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{proj.description}</p>

                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold">
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No public projects assigned.</p>
          )}
        </div>
      )}

      {/* 4. AUTHORED PUBLICATIONS (IF APPROVED & ENABLED) */}
      {profile.showPublications && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-outfit">Publications & Patents</h2>
          </div>

          {publicPublications.length > 0 ? (
            <div className="space-y-3">
              {publicPublications.map(pub => (
                <div key={pub.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                      {pub.type || 'Journal Paper'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{pub.journal} ({pub.year})</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{pub.title}</h3>
                  <p className="text-xs text-slate-400">Authors: <span className="text-slate-200">{pub.authors}</span></p>
                  
                  {pub.doi && (
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <a
                        href={pub.doiLink || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono font-semibold flex items-center gap-1"
                      >
                        <span>DOI: {pub.doi}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No scientific publications recorded.</p>
          )}
        </div>
      )}

      {/* 5. ORGANIZATIONAL EVENTS & WORKSHOPS (IF APPROVED & ENABLED) */}
      {profile.showEvents && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-outfit">Events & Symposia Leadership</h2>
          </div>

          {publicEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicEvents.map(evt => (
                <div key={evt.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                    {evt.category || 'Symposium'}
                  </span>
                  <h3 className="text-sm font-bold text-white">{evt.title || evt.name}</h3>
                  <p className="text-xs text-slate-400">{evt.date} • {evt.venue || 'Sanjivani SET'}</p>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{evt.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No public event leadership roles listed.</p>
          )}
        </div>
      )}

      {/* 6. AWARDS & ACHIEVEMENTS (IF APPROVED & ENABLED) */}
      {profile.showAchievements && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white font-outfit">Honors & Hackathon Accolades</h2>
          </div>

          {publicAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicAchievements.map(ach => (
                <div key={ach.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-950 text-yellow-300 border border-yellow-800/40">
                      {ach.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ach.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                  <p className="text-xs text-slate-300">{ach.description}</p>
                  <p className="text-[11px] text-slate-400">Awarded by: {ach.issuedBy}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No public achievements recorded.</p>
          )}
        </div>
      )}

      {/* 7. TECHNICAL SKILLS TAGS */}
      {profile.showSkills && profile.technicalSkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-outfit">Technical Frameworks & Competencies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.technicalSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicMemberProfile;
