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
  ExternalLink,
  Code2,
  Atom,
  Target
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { data } = useData();
  const { isAuthenticated, currentUser, permissions } = useAuth();

  const activeMembersCount = (data.users || []).filter(u => u.status === 'Active').length;
  const activeProjectsCount = (data.projects || []).length;
  const publicationsCount = (data.publications || []).length;
  const eventsCount = (data.events || []).length;

  const featuredProjects = (data.projects || []).slice(0, 3);
  const recentPublications = (data.publications || []).slice(0, 3);
  const upcomingEvents = (data.events || []).filter(e => e.status === 'Upcoming').slice(0, 2);

  const getDashboardTarget = () => {
    if (!currentUser) return 'dashboard-member';
    switch (currentUser.role) {
      case 'Faculty Coordinator': return 'dashboard-faculty';
      case 'President': return 'dashboard-president';
      case 'Research Head': return 'dashboard-research';
      case 'Event Coordinator': return 'dashboard-events';
      case 'Social Media & Publicity Head': return 'dashboard-social';
      case 'Secretary': return 'dashboard-secretary';
      case 'Member Coordinator': return 'dashboard-members';
      default: return 'dashboard-member';
    }
  };

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION - RISING SUN & FUTURISTIC AI THEME */}
      <section className="relative overflow-hidden bg-rising-sun pt-12 pb-24 border-b border-slate-800/80">
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-rose-500/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* University Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md">
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>Sanjivani University • Department of Integrated B.Tech (2026–2027)</span>
            </div>

            {/* Official Hero Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <img 
                  src="./rise-logo.png" 
                  alt="RISE Emblem" 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl border border-amber-500/40 shadow-2xl p-1 bg-slate-950/80" 
                />
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-outfit">
                  RISE
                </h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 font-outfit">
                Research & Innovation Society for <span className="gradient-text-sun">Emerging Intelligence</span>
              </h2>
            </div>

            {/* Subtitle & Tagline */}
            <div className="space-y-1.5 pt-1">
              <p className="text-lg sm:text-2xl font-bold text-amber-400 tracking-wide font-outfit">
                “Research. Innovate. Build the Future.”
              </p>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Empowering student researchers to build impactful patents, Scopus/IEEE publications, and edge-intelligence systems under Faculty guidance.
              </p>
            </div>

            {/* Four Required Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              
              <button
                onClick={() => setActiveTab('research')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Research</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>View Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Upcoming Events</span>
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Member Login</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab(getDashboardTarget())}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Open {currentUser?.role} Dashboard</span>
                </button>
              )}

            </div>

          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            
            <div className="glass-panel p-6 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-amber-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-outfit">{activeMembersCount}</div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Members</div>
              <p className="text-[11px] text-slate-400">Interview Selected Researchers</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-outfit">{activeProjectsCount}</div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Projects</div>
              <p className="text-[11px] text-slate-400">AI & Hardware Initiatives</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-emerald-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-outfit">{publicationsCount}</div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Papers & Patents</div>
              <p className="text-[11px] text-slate-400">IEEE / Scopus / Indian Patent</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-purple-500/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 font-outfit">{eventsCount}</div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Events & Bootcamps</div>
              <p className="text-[11px] text-slate-400">Symposia & Hackathons</p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RESEARCH & EMERGING INTELLIGENCE DOMAINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Atom className="w-4 h-4" />
              <span>Core Scientific Thrust Areas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">Research & Innovation Domains</h2>
          </div>
          <button
            onClick={() => setActiveTab('research')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>Explore Research Repository</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              domain: "Artificial Intelligence & Generative AI",
              desc: "Regional dialect LLM fine-tuning, retrieval-augmented generation (RAG), and agentic systems.",
              tag: "AI / LLMs",
              color: "amber"
            },
            {
              domain: "Computer Vision & Deep Learning",
              desc: "Medical retinal scan diagnostics, agricultural crop disease segmentation, and YOLO edge detectors.",
              tag: "Deep Learning",
              color: "cyan"
            },
            {
              domain: "Robotics & Autonomous Systems",
              desc: "Multi-UAV swarm synchronization, companion computer flight controllers, and ROS2 navigation.",
              tag: "Robotics",
              color: "purple"
            },
            {
              domain: "Cybersecurity & Firmware Defense",
              desc: "Zero-trust IoT telemetry auditing, graph neural intrusion detection, and formal binary verification.",
              tag: "Security",
              color: "rose"
            },
            {
              domain: "Edge AI & Internet of Things (IoT)",
              desc: "Sub-watt TinyML microcontrollers, LoRaWAN precision soil monitors, and battery-free sensors.",
              tag: "IoT / TinyML",
              color: "emerald"
            },
            {
              domain: "Quantum Computing & Hybrid Systems",
              desc: "Parameterized quantum circuits for crystalline material synthesis and QUBO grid optimization.",
              tag: "Quantum",
              color: "blue"
            }
          ].map((card, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-amber-300 border border-amber-500/30">
                  {card.tag}
                </span>
                <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {card.domain}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED ACTIVE PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Code2 className="w-4 h-4" />
              <span>Hardware & Software Prototypes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">Active Engineering Projects</h2>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>View All Projects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map(proj => (
            <div key={proj.id} className="glass-panel rounded-3xl overflow-hidden border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              {proj.image && (
                <div className="h-44 w-full overflow-hidden relative">
                  <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {proj.researchDomain}
                  </span>
                </div>
              )}
              <div className="p-5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white leading-snug">{proj.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status: <strong className="text-emerald-400">{proj.status}</strong></span>
                    <span className="text-amber-400 font-mono font-bold">{proj.progress}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPCOMING EVENTS & RECENT ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upcoming Events */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-outfit">Upcoming Events & Symposia</h3>
              </div>
              <button onClick={() => setActiveTab('events')} className="text-xs text-amber-400 hover:text-amber-300 font-bold">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map(evt => (
                <div key={evt.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {evt.type}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono font-semibold">{evt.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{evt.name || evt.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{evt.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>📍 {evt.venue}</span>
                    <button 
                      onClick={() => setActiveTab('events')} 
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <span>Register</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer-Reviewed Publications Showcase */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-outfit">Latest Publications</h3>
              </div>
              <button onClick={() => setActiveTab('research')} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentPublications.map(pub => (
                <div key={pub.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                      {pub.domain}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">● {pub.status}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{pub.title}</h4>
                  <p className="text-[11px] text-slate-400">{pub.authors}</p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                    <span>{pub.journal} ({pub.year})</span>
                    <span className="text-amber-400">DOI: {pub.doi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION - JOIN & COLLABORATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-slate-900 to-orange-950/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-outfit">
              Ready to Advance Your Research Career?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Applications for Academic Year 2026–2027 are currently open for Integrated B.Tech students. Join specialized research clusters and publish under faculty supervision.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('join')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl hover:scale-105 transition-all"
            >
              Apply for Interview Selection
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs hover:scale-105 transition-all"
            >
              Contact Society Office
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
