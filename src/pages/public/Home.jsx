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
  Globe
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { data } = useData();
  const { permissions } = useAuth();

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
              A complete student research ecosystem transforming innovative concepts into Scopus-indexed publications, Indian patents, hardware prototypes, and real-world intelligence applications.
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
                <span>Join RISE Society</span>
              </button>

              <button
                onClick={() => {
                  if (permissions.isFaculty) setActiveTab('dashboard-faculty');
                  else if (permissions.isEqualLeadership) setActiveTab('dashboard-pres-vp');
                  else setActiveTab('dashboard-member');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Dashboard</span>
              </button>
            </div>

          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
              <div className="text-3xl font-black text-amber-400 font-outfit">{activeMembersCount}</div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Members</div>
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
              <p className="text-[11px] text-slate-400">Research & Technical Groups</p>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHORITY STRUCTURE PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white font-outfit">Website Authority Hierarchy</h2>
            <p className="text-xs text-slate-400">
              Supervised by Faculty Coordinator with Equal Student Leadership (President ↔ Vice President)
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            
            {/* Faculty Level */}
            <div className="bg-purple-950/40 border border-purple-500/40 p-5 rounded-2xl max-w-md w-full text-center space-y-1">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">OVERALL SUPERVISORY AUTHORITY</div>
              <div className="text-base font-bold text-white">Dr. Abhijit Kshirsagar</div>
              <div className="text-xs text-purple-200">Faculty Coordinator | Head of Emerging Tech</div>
            </div>

            <div className="w-0.5 h-6 bg-amber-500/40"></div>

            {/* Equal Student Leadership Level (President ↔ VP side-by-side equal cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              
              <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 p-5 rounded-2xl text-center space-y-1 shadow-lg">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">EQUAL STUDENT LEADERSHIP</div>
                <div className="text-base font-bold text-white">Rohan Sharma</div>
                <div className="text-xs text-amber-200">President (Year 3 Integrated B.Tech)</div>
              </div>

              <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 p-5 rounded-2xl text-center space-y-1 shadow-lg">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">EQUAL STUDENT LEADERSHIP</div>
                <div className="text-base font-bold text-white">Ananya Deshmukh</div>
                <div className="text-xs text-amber-200">Vice President (Year 3 Integrated B.Tech)</div>
              </div>

            </div>

            <div className="w-0.5 h-6 bg-slate-700"></div>

            {/* Department Heads Level */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full">
              <div className="bg-slate-800/80 p-3 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-white">Siddharth Verma</div>
                <div className="text-[10px] text-cyan-400">Research Head</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-white">Priya Kulkarni</div>
                <div className="text-[10px] text-cyan-400">Secretary</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-white">Yash Patil</div>
                <div className="text-[10px] text-cyan-400">Event Coordinator</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl text-center">
                <div className="text-[11px] font-semibold text-white">Neha Joshi</div>
                <div className="text-[10px] text-cyan-400">Member Coordinator</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('team')}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <span>View Full Team Hierarchy & Members</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* RESEARCH DOMAINS & WORKFLOW PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-outfit">Research Domains & Intelligence Track</h2>
            <p className="text-xs text-slate-400">Official RISE 10-Step Innovation Pipeline</p>
          </div>
          <button
            onClick={() => setActiveTab('research')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Research Pipeline</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-amber-500/40 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Artificial Intelligence & LLMs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generative AI, Large Language Models, Reinforcement Learning, and multilingual speech-to-text fine-tuning for regional Indian languages.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Computer Vision & Edge AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YOLO model quantization, Raspberry Pi / Jetson deployment, medical retinal screening, and real-time sugarcane pest classification.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Robotics & Autonomous Systems</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ROS2-based UAV flight controllers, swarm drone SLAM navigation, and smart agricultural field robotics.
            </p>
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
                  <div className="text-[10px] text-slate-500 pt-1">By: {ann.author}</div>
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
              <button onClick={() => setActiveTab('events')} className="text-xs font-bold text-cyan-400 hover:underline">
                View All Events
              </button>
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
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>📅 {evt.date} | {evt.time}</span>
                    <span>📍 {evt.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
