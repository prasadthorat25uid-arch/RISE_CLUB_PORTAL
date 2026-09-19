import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, UserCheck, Search, Sparkles, Filter, Award } from 'lucide-react';

export const TeamPage = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const faculty = data.users.find(u => u.role === 'Faculty Coordinator');
  const president = data.users.find(u => u.role === 'President');
  const vicePresident = data.users.find(u => u.role === 'Vice President');

  const researchClubMembers = data.users.filter(u => u.role === 'Research Club Member' || u.role === 'Club Member');

  const filteredMembers = researchClubMembers.filter(m => {
    return m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.prn.toLowerCase().includes(searchTerm.toLowerCase());
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

      {/* 1. FACULTY COORDINATOR */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-950/60 border border-purple-500/40 px-4 py-1 rounded-full">
            Faculty Coordinator (Overall Supervision)
          </span>
        </div>

        {faculty && (
          <div className="max-w-xl mx-auto glass-panel p-6 rounded-3xl border-2 border-purple-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img src={faculty.photo} alt={faculty.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-400/60 shadow-lg" />
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">FACULTY COORDINATOR</span>
                <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
                <p className="text-xs text-slate-300 font-medium">{faculty.department} | {faculty.division}</p>
                <p className="text-xs text-slate-400 pt-1 leading-relaxed">{faculty.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. EQUAL STUDENT LEADERSHIP - PRESIDENT & VICE PRESIDENT (SIDE-BY-SIDE EQUAL CARDS) */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/40 px-4 py-1 rounded-full">
            Equal Student Leadership Status
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* President Card: Ayushi Didi */}
          {president && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/50 shadow-xl space-y-4 relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                EQUAL LEADERSHIP
              </div>
              <div className="flex items-center gap-4">
                <img src={president.photo} alt={president.name} className="w-20 h-20 rounded-2xl object-cover border border-amber-400/60 shadow-md" />
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">PRESIDENT</span>
                  <h3 className="text-lg font-bold text-white">{president.name}</h3>
                  <p className="text-xs text-slate-300">{president.department} | {president.academicYear}</p>
                  <p className="text-[11px] text-amber-400 font-mono">Member ID: {president.memberId}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{president.bio}</p>
            </div>
          )}

          {/* Vice President Card: Prasad */}
          {vicePresident && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/50 shadow-xl space-y-4 relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                EQUAL LEADERSHIP
              </div>
              <div className="flex items-center gap-4">
                <img src={vicePresident.photo} alt={vicePresident.name} className="w-20 h-20 rounded-2xl object-cover border border-amber-400/60 shadow-md" />
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">VICE PRESIDENT</span>
                  <h3 className="text-lg font-bold text-white">{vicePresident.name}</h3>
                  <p className="text-xs text-slate-300">{vicePresident.department} | {vicePresident.academicYear}</p>
                  <p className="text-[11px] text-amber-400 font-mono">Member ID: {vicePresident.memberId}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{vicePresident.bio}</p>
            </div>
          )}

        </div>
      </div>

      {/* 3. CORE TEAM STRUCTURE */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-4 py-1 rounded-full">
            Core Team Functional Wings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Research Head */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">RESEARCH HEAD</span>
            <h4 className="text-base font-bold text-white">Shweta Didi & Ayushi Didi</h4>
            <p className="text-xs text-slate-400">Overseeing paper publications, literature review frameworks, and research gap formulation.</p>
          </div>

          {/* Secretary + Event Coordinator */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">SECRETARY + EVENT COORDINATOR</span>
            <h4 className="text-base font-bold text-white">Sairaj Tambe, Sanskar Kulkarni & Sairaj Neware</h4>
            <p className="text-xs text-slate-400">Managing national symposia, hands-on workshops, documentation archives, and event operations.</p>
          </div>

          {/* Social Media & Publicity Head */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">SOCIAL MEDIA & PUBLICITY HEAD</span>
            <h4 className="text-base font-bold text-white">Ashutosh Hadave & Vedant Dathe</h4>
            <p className="text-xs text-slate-400">Heading society media reach, technical branding, and research publication showcases.</p>
          </div>

          {/* Member Coordinator */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">MEMBER COORDINATOR</span>
            <h4 className="text-base font-bold text-white">Vaishnavi, Ayushi Didi & Prasad</h4>
            <p className="text-xs text-slate-400">Coordinating student interview selection pipeline, member onboarding, and performance metrics.</p>
          </div>

          {/* Discipline Member */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">DISCIPLINE MEMBER</span>
            <h4 className="text-base font-bold text-white">Sanskar Kulkarni</h4>
            <p className="text-xs text-slate-400">Overseeing club discipline, code of conduct, and task compliance during society sessions.</p>
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
