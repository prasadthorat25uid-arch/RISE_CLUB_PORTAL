import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, UserCheck, Search, Sparkles, Filter, Award } from 'lucide-react';

export const TeamPage = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const faculty = data.users.find(u => u.role === 'Faculty Coordinator');
  const president = data.users.find(u => u.role === 'President');
  const researchHead = data.users.find(u => u.role === 'Research Head');
  const memberCoordinators = data.users.filter(u => u.role === 'Member Coordinator');
  const eventCoordinators = data.users.filter(u => u.role === 'Event Coordinator');
  const secretary = data.users.find(u => u.role === 'Secretary');
  const socialHeads = data.users.filter(u => u.role === 'Social Media & Publicity Head');

  const researchClubMembers = data.users.filter(u => 
    u.role === 'RISE Club Member' || u.role === 'Research Club Member' || u.role === 'Club Member'
  );

  const filteredMembers = researchClubMembers.filter(m => {
    return m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.prn?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Core Team & Members</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Official Organizational Hierarchy (Sanjivani University Integrated B.Tech 2026–2027)
        </p>
      </div>

      {/* 1. FACULTY COORDINATOR & PRESIDENT LEADERSHIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Faculty Coordinator */}
        {faculty && (
          <div className="glass-panel p-6 rounded-3xl border-2 border-purple-500/50 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
                  FACULTY COORDINATOR
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Supervisory Authority</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={faculty.photo} alt={faculty.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-400/60 shadow-lg shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">{faculty.name}</h3>
                  <p className="text-xs text-purple-300 font-medium">{faculty.department} | {faculty.division}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{faculty.email}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{faculty.bio}</p>
            </div>
          </div>
        )}

        {/* President */}
        {president && (
          <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-amber-950/30 to-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  PRESIDENT
                </span>
                <span className="text-[10px] text-amber-300 font-mono">Student Executive Lead</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={president.photo} alt={president.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">{president.name}</h3>
                  <p className="text-xs text-amber-300 font-medium">{president.department} ({president.academicYear})</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{president.email}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{president.bio}</p>
            </div>
          </div>
        )}

      </div>

      {/* 2. CORE FUNCTIONAL WINGS */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-4 py-1 rounded-full">
            Core Leadership Officers & Wings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          
          {/* Research Head */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">RESEARCH HEAD</span>
              <span className="text-[10px] text-slate-400 font-mono">Publications & Review</span>
            </div>
            {researchHead && (
              <div className="flex items-center gap-3">
                <img src={researchHead.photo} alt={researchHead.name} className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40" />
                <div>
                  <h4 className="text-sm font-bold text-white">{researchHead.name}</h4>
                  <p className="text-[11px] text-slate-400">{researchHead.department} ({researchHead.academicYear})</p>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400">Overseeing paper publications, literature review frameworks, and research gap formulation.</p>
          </div>

          {/* Member Coordinators */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">MEMBER COORDINATORS</span>
              <span className="text-[10px] text-slate-400 font-mono">Interview & Onboarding</span>
            </div>
            <div className="space-y-2">
              {memberCoordinators.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-amber-400/40" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <p className="text-[10px] text-slate-400">{m.department} ({m.academicYear})</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">Coordinating student interview selection pipeline, member onboarding, and performance metrics.</p>
          </div>

          {/* Event Coordinators */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">EVENT COORDINATORS</span>
              <span className="text-[10px] text-slate-400 font-mono">Workshops & Symposia</span>
            </div>
            <div className="space-y-2">
              {eventCoordinators.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <p className="text-[10px] text-slate-400">{m.department} ({m.academicYear})</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">Managing national symposia, hands-on workshops, venue arrangements, and event scheduling.</p>
          </div>

          {/* Secretary */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">SECRETARY</span>
              <span className="text-[10px] text-slate-400 font-mono">Records & Governance</span>
            </div>
            {secretary && (
              <div className="flex items-center gap-3">
                <img src={secretary.photo} alt={secretary.name} className="w-12 h-12 rounded-xl object-cover border border-purple-400/40" />
                <div>
                  <h4 className="text-sm font-bold text-white">{secretary.name}</h4>
                  <p className="text-[11px] text-slate-400">{secretary.department} ({secretary.academicYear})</p>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400">Maintaining society governance records, meeting archives, and operational discipline.</p>
          </div>

          {/* Social Media & Publicity Heads */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-orange-500/40 transition-all sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">SOCIAL MEDIA & PUBLICITY HEADS</span>
              <span className="text-[10px] text-slate-400 font-mono">Branding & Media Reach</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialHeads.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-orange-400/40" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <p className="text-[10px] text-slate-400">{m.department} ({m.academicYear})</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">Heading society media reach, technical branding, and research publication spotlights.</p>
          </div>

        </div>
      </div>

      {/* 4. RESEARCH CLUB MEMBERS (INTERVIEW SELECTED) */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-outfit">Interview-Selected Research Club Members</h2>
            <p className="text-xs text-slate-400">Selected through rigorous academic & technical interview process</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Name, PRN, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(mem => (
            <div key={mem.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3">
                <img src={mem.photo} alt={mem.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-white">{mem.name}</h4>
                  <p className="text-[11px] text-slate-400">{mem.department} ({mem.academicYear})</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-amber-400">{mem.memberId}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300">
                      Interview Selected
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <p><strong>Assigned Team:</strong> {mem.teams?.[0] || 'Unassigned'}</p>
                <p><strong>Research Interests:</strong> {mem.researchInterests?.join(', ') || 'Emerging Intelligence'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
