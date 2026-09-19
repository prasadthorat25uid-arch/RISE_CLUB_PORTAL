import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sun, 
  Sparkles, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { data } = useData();
  const { isAuthenticated, permissions } = useAuth();

  const activeMembersCount = data.users.filter(u => u.status === 'Active').length;
  const activeProjectsCount = data.projects.length;
  const publicationsCount = data.publications.length;
  const teamsCount = data.teams.length;

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION - RISING SUN THEME */}
      <section className="relative overflow-hidden bg-rising-sun pt-12 pb-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* University Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg">
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Sanjivani University | SET | Integrated B.Tech (2026–2027)</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-outfit leading-tight">
              RISE – Research & Innovation Society for <span className="gradient-text-sun">Emerging Intelligence</span>
            </h1>

            {/* Official Theme & Tagline */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-bold text-amber-400">
                Official Theme: “Rising Sun – From Ideas to Impact”
              </p>
              <p className="text-base sm:text-lg text-slate-300 italic font-medium">
                “RISE with Ideas. Research with Purpose. Impact the Future.”
              </p>
            </div>

            {/* Brief Description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A world-class student research ecosystem transforming innovative concepts into Scopus-indexed publications, Indian patents, hardware prototypes, and real-world intelligence applications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('research')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
              >
                <span>Explore RISE Research</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('join')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Apply for Interview Selection</span>
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Member Login Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (permissions.isFaculty) setActiveTab('dashboard-faculty');
                    else if (permissions.isEqualLeadership) setActiveTab('dashboard-pres-vp');
                    else setActiveTab('dashboard-member');
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>My Profile Dashboard</span>
                </button>
              )}
            </div>

          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
              <div className="text-3xl font-black text-amber-400 font-outfit">{activeMembersCount}</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Interview Selected Members</div>
              <p className="text-[11px] text-slate-400">Integrated B.Tech Researchers</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
              <div className="text-3xl font-black text-cyan-400 font-outfit">{activeProjectsCount}</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Projects</div>
              <p className="text-[11px] text-slate-400">AI & Hardware Initiatives</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
              <div className="text-3xl font-black text-emerald-400 font-outfit">{publicationsCount}</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Papers & Patents</div>
              <p className="text-[11px] text-slate-400">IEEE / Springer / Indian Patent</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
              <div className="text-3xl font-black text-purple-400 font-outfit">{teamsCount}</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Specialized Teams</div>
              <p className="text-[11px] text-slate-400">Research & Tech Groups</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERVIEW SELECTION PIPELINE SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white font-outfit">Interview Selection & Membership Pipeline</h2>
            <p className="text-xs text-slate-400">
              Only students selected through the interview process become Research Club Members with private profile access
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {[
              { num: 1, label: "Student Application", desc: "Submit background, skills, and research interests." },
              { num: 2, label: "Technical Interview", desc: "Evaluate problem solving & technical aptitude." },
              { num: 3, label: "Selection Approval", desc: "Approved by Faculty Coordinator / President / VP." },
              { num: 4, label: "Profile Created", desc: "Member Profile & unique Member ID (RISE-2026-XXX) generated." },
              { num: 5, label: "Private Login", desc: "Separate PRN/Email + Password account for isolated access." }
            ].map(step => (
              <div key={step.num} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2 text-center">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-center mx-auto font-mono">
                  {step.num}
                </span>
                <h3 className="text-xs font-bold text-white">{step.label}</h3>
                <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & EVENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Latest Announcements */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Latest Society Announcements</span>
              </h3>
            </div>
            <div className="space-y-3">
              {data.announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ann.title}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Upcoming Research & Workshops</span>
              </h3>
            </div>
            <div className="space-y-3">
              {data.events.slice(0, 2).map(evt => (
                <div key={evt.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{evt.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
