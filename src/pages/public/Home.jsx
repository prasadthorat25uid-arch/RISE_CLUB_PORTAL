import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/Avatar';
import { getPublicProfile } from './PublicMemberProfile';
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
  Target,
  Compass,
  Brain,
  Shield,
  Terminal,
  Database,
  Network,
  FileText,
  Lightbulb,
  Rocket,
  Zap,
  GraduationCap,
  Building,
  Check,
  Search,
  Flame,
  Binary,
  Radio,
  Share2,
  Workflow,
  Fingerprint
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { data } = useData();
  const { isAuthenticated, currentUser } = useAuth();
  const [domainFilter, setDomainFilter] = useState('All');

  // Real Dynamic Metrics from Database
  const activeMembers = (data.users || []).filter(u => u.status === 'Active');
  const activeMembersCount = activeMembers.length;
  const activeProjectsCount = (data.projects || []).length;
  const publicationsCount = (data.publications || []).length;
  const eventsCount = (data.events || []).length;
  const achievementsCount = (data.achievements || []).length;

  // Slices for Featured Content
  const featuredProjects = (data.projects || []).slice(0, 3);
  const featuredPublications = (data.publications || []).slice(0, 3);
  const upcomingEvents = (data.events || [])
    .filter(e => e.status === 'Upcoming' || !e.status)
    .slice(0, 3);
  const featuredAchievements = (data.achievements || []).slice(0, 3);

  // Filtered Whitelisted Members for Public Community Grid (Strict Whitelist - Zero Private Leakage)
  const communityMembers = (data.users || [])
    .filter(u => u.role !== 'Faculty Coordinator')
    .slice(0, 6)
    .map(u => getPublicProfile(u));

  // Leadership hierarchy dynamically resolved from database
  const facultyLead = (data.users || []).find(u => u.role === 'Faculty Coordinator');
  const presidentLead = (data.users || []).find(u => u.role === 'President');
  const vpLead = (data.users || []).find(u => u.role === 'Vice President');
  const researchHead = (data.users || []).find(u => u.role === 'Research Head');
  const eventCoord = (data.users || []).find(u => u.role === 'Event Coordinator');
  const socialHead = (data.users || []).find(u => u.role === 'Social Media & Publicity Head');
  const secretaryLead = (data.users || []).find(u => u.role === 'Secretary');
  const memberCoord = (data.users || []).find(u => u.role === 'Member Coordinator');

  // Target Dashboard for authenticated user
  const getDashboardTarget = () => {
    if (!currentUser) return 'dashboard-member';
    if (currentUser.role === 'Faculty Coordinator' || currentUser.role === 'President' || currentUser.role === 'Vice President') {
      return 'dashboard-admin';
    }
    switch (currentUser.role) {
      case 'Research Head': return 'dashboard-research';
      case 'Event Coordinator': return 'dashboard-events';
      case 'Social Media & Publicity Head': return 'dashboard-social';
      case 'Secretary': return 'dashboard-secretary';
      case 'Member Coordinator': return 'dashboard-members';
      default: return 'dashboard-member';
    }
  };

  const navigateToMember = (memberId) => {
    if (setActiveTab) {
      setActiveTab(`member/public/${memberId}`);
    } else {
      window.location.hash = `#/member/public/${memberId}`;
    }
  };

  // 14 Core Scientific Thrust Domains
  const researchDomainsList = [
    {
      id: "ai-genai",
      name: "Artificial Intelligence & Generative AI",
      category: "Intelligence",
      icon: Brain,
      tag: "Agentic AI / LLMs",
      color: "amber",
      desc: "Agentic architectures, Retrieval-Augmented Generation (RAG), dialectal LLM fine-tuning, and multi-modal neural reasoning."
    },
    {
      id: "ml-stats",
      name: "Machine Learning & Statistical Modeling",
      category: "Analytics",
      icon: TrendingUp,
      tag: "Statistical ML",
      color: "cyan",
      desc: "Supervised and self-supervised paradigms, probabilistic modeling, high-dimensional manifolds, and predictive algorithms."
    },
    {
      id: "deep-learning",
      name: "Deep Learning & Neural Architectures",
      category: "Deep Models",
      icon: Atom,
      tag: "Transformers / CNNs",
      color: "purple",
      desc: "Vision Transformers, diffusion synthesis, convolutional feature backbones, and neural architecture search."
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity & Cryptographic Systems",
      category: "Security",
      icon: Shield,
      tag: "Zero Trust / Crypto",
      color: "rose",
      desc: "Post-quantum cryptographic primitives, zero-trust enterprise security protocols, and firmware defense pipelines."
    },
    {
      id: "ids-threat",
      name: "Intrusion Detection Systems (IDS)",
      category: "Security",
      icon: Fingerprint,
      tag: "Threat Intelligence",
      color: "red",
      desc: "Graph neural anomaly detection, real-time packet telemetry auditing, and SIEM security automation."
    },
    {
      id: "computer-vision",
      name: "Computer Vision & Visual Perception",
      category: "Perception",
      icon: Sparkles,
      tag: "YOLO / Medical Imaging",
      color: "blue",
      desc: "Medical diagnostic scan segmentation, autonomous perception, agricultural crop anomaly detectors, and edge YOLO."
    },
    {
      id: "nlp-speech",
      name: "Natural Language Processing (NLP)",
      category: "Linguistics",
      icon: FileText,
      tag: "Semantic NLP",
      color: "emerald",
      desc: "Regional dialect tokenization, multilingual semantic parsing, contextual embeddings, and named entity recognition."
    },
    {
      id: "iot-tinyml",
      name: "Internet of Things (IoT) & TinyML",
      category: "Embedded",
      icon: Radio,
      tag: "Sub-watt / LoRaWAN",
      color: "teal",
      desc: "Sub-watt microcontroller machine learning, LoRaWAN mesh telemetry, precision agriculture sensors, and battery-free IoT."
    },
    {
      id: "cloud-distributed",
      name: "Cloud Computing & Distributed Systems",
      category: "Infrastructure",
      icon: Database,
      tag: "Microservices / K8s",
      color: "indigo",
      desc: "High-throughput distributed consensus, Kubernetes cluster orchestrations, edge serverless computing, and fault tolerance."
    },
    {
      id: "data-science",
      name: "Data Science & Big Data Analytics",
      category: "Analytics",
      icon: Binary,
      tag: "Big Data / ETL",
      color: "amber",
      desc: "Petabyte-scale distributed data processing, streaming ETL pipelines, feature stores, and automated exploratory discovery."
    },
    {
      id: "robotics-autonomous",
      name: "Robotics & Autonomous Systems",
      category: "Autonomous",
      icon: Cpu,
      tag: "ROS2 / Drone Swarms",
      color: "purple",
      desc: "Multi-UAV aerial swarm synchronization, ROS2 robotics frameworks, companion flight controllers, and SLAM navigation."
    },
    {
      id: "intelligent-systems",
      name: "Intelligent Systems & Swarm Intelligence",
      category: "Systems",
      icon: Network,
      tag: "Swarm Optimization",
      color: "cyan",
      desc: "Bio-inspired multi-agent optimization, swarm consensus heuristics, automated self-healing clusters, and smart grids."
    },
    {
      id: "quantum-emerging",
      name: "Quantum Computing & Hybrid Systems",
      category: "Emerging",
      icon: Zap,
      tag: "QUBO / Quantum Qubits",
      color: "violet",
      desc: "Parameterized quantum circuits, QUBO optimization, crystalline material discovery, and hybrid classical-quantum solvers."
    },
    {
      id: "emerging-tech",
      name: "Emerging Technologies & Edge Intelligence",
      category: "Emerging",
      icon: Lightbulb,
      tag: "Edge AI / Next-Gen",
      color: "orange",
      desc: "Neuromorphic computing accelerators, decentralized verifiable ledgers, ambient computing, and synthetic biology data."
    }
  ];

  const filteredDomains = domainFilter === 'All' 
    ? researchDomainsList 
    : researchDomainsList.filter(d => d.category === domainFilter);

  return (
    <div className="space-y-20 pb-24 overflow-x-hidden text-slate-100">

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION & INSTITUTIONAL EMBLEM
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 pt-10 pb-20 border-b border-slate-800/80">
        {/* Futuristic Ambient Glow Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-7 max-w-4xl mx-auto">
            
            {/* University Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md">
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
              <span className="tracking-wide">SANJIVANI UNIVERSITY • SCHOOL OF ENGINEERING & TECHNOLOGY</span>
            </div>

            {/* Official Society Title */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3.5">
                <img 
                  src="./rise-logo.png" 
                  alt="RISE Emblem" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl border-2 border-amber-500/40 shadow-2xl p-1.5 bg-slate-950/90" 
                />
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight font-outfit">
                  RISE
                </h1>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 font-outfit tracking-tight">
                Research & Innovation Society for <span className="gradient-text-sun">Emerging Intelligence</span>
              </h2>
            </div>

            {/* Tagline & Positioning Statement */}
            <div className="space-y-2 pt-1 max-w-3xl mx-auto">
              <p className="text-lg sm:text-2xl font-bold text-amber-400 tracking-wide font-outfit">
                “Research. Innovate. Build the Future.”
              </p>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
                Empowering student researchers at Sanjivani University to engineer breakthrough patents, peer-reviewed Scopus & IEEE publications, and high-impact edge-intelligence systems under Faculty guidance.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              
              <button
                onClick={() => setActiveTab('research')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Research</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs sm:text-sm hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Meet RISE Community</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs sm:text-sm hover:border-cyan-500/50 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>View Projects</span>
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>RISE ERP Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab(getDashboardTarget())}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Open {currentUser?.role} Dashboard</span>
                </button>
              )}

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────
              2. RESEARCH IMPACT METRICS (DYNAMIC DATABASE DATA)
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mt-16">
            
            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-cyan-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-outfit group-hover:scale-105 transition-transform">
                {activeProjectsCount > 0 ? activeProjectsCount : '—'}
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Active Projects</div>
              <p className="text-[10px] text-slate-400">AI & Hardware Initiatives</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-emerald-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-outfit group-hover:scale-105 transition-transform">
                {publicationsCount > 0 ? publicationsCount : '—'}
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Published Papers</div>
              <p className="text-[10px] text-slate-400">IEEE / Scopus & Patents</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-amber-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-outfit group-hover:scale-105 transition-transform">
                {activeMembersCount > 0 ? activeMembersCount : '—'}
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">RISE Members</div>
              <p className="text-[10px] text-slate-400">Interview Selected</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-purple-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-outfit group-hover:scale-105 transition-transform">
                {eventsCount > 0 ? eventsCount : '—'}
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Events & Bootcamps</div>
              <p className="text-[10px] text-slate-400">Symposia & Workshops</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-yellow-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-outfit group-hover:scale-105 transition-transform">
                {achievementsCount > 0 ? achievementsCount : '—'}
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Honors & Awards</div>
              <p className="text-[10px] text-slate-400">Hackathons & Grants</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl text-center space-y-1.5 border border-slate-800/80 hover:border-rose-500/50 transition-all group">
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-outfit group-hover:scale-105 transition-transform">
                14
              </div>
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Research Domains</div>
              <p className="text-[10px] text-slate-400">Scientific Thrust Areas</p>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. ABOUT RISE (CONCISE INSTITUTIONAL SUMMARY & 4 PILLARS)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 bg-slate-900/60 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>About RISE Society</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit leading-tight">
                Architecting the Future of <span className="gradient-text-sun">Emerging Intelligence</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The <strong>Research & Innovation Society for Emerging Intelligence (RISE)</strong> is the premier scientific and technical research organization in the <strong>Department of Integrated B.Tech, School of Engineering & Technology at Sanjivani University</strong>.
              </p>
              
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                RISE is structured to bridge the chasm between theoretical undergraduate education and high-impact applied research. Under the direct supervision of University Faculty and Student Leadership, members formulate research hypotheses, engineer scalable software and hardware prototypes, submit patents to the Indian Patent Office, and present peer-reviewed literature at Scopus and IEEE indexed symposia.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all group"
                >
                  <span>Discover Full RISE Charter & Governance</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 4 Core Pillars Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-amber-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Atom className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Rigorous Inquiry</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Academic methodology, deep literature surveys, and structured mathematical problem formulation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Faculty Guidance</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Direct one-on-one mentorship by University Professors on publication standards and patents.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-purple-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Engineering Rigor</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Translating theoretical algorithms into reproducible code, hardware prototypes, and testbeds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Societal Impact</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Developing edge intelligence solutions for agriculture, healthcare diagnostics, and cyber defense.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          4. 14 RESEARCH & INNOVATION DOMAINS (COMPREHENSIVE GRID)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Atom className="w-4 h-4" />
              <span>Scientific Thrust Areas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
              14 Core Research & Innovation Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interdisciplinary research clusters tackling complex problems in computation, perception, autonomous robotics, and edge hardware.
            </p>
          </div>

          {/* Domain Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Intelligence', 'Security', 'Perception', 'Embedded', 'Infrastructure', 'Autonomous', 'Emerging'].map(cat => (
              <button
                key={cat}
                onClick={() => setDomainFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  domainFilter === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 14 Domain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDomains.map((card) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={card.id} 
                className="glass-panel p-5 rounded-3xl border border-slate-800/90 space-y-3 hover:border-amber-500/50 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-amber-300 border border-amber-500/30">
                      {card.tag}
                    </span>
                    <div className="p-1.5 rounded-xl bg-slate-900 text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {card.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{card.category}</span>
                  <button
                    onClick={() => setActiveTab('research')}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Inquire</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveTab('research')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Explore Full Research Repository & Datasets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. RESEARCH PIPELINE: "FROM IDEA TO IMPACT" (6-STEP ROADMAP)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5" />
            <span>Structured Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Research Pipeline: “From Idea to Impact”
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How RISE student researchers progress from initial problem identification to peer-reviewed publication and intellectual property creation.
          </p>
        </div>

        {/* 6 Step Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {[
            {
              step: "01",
              title: "Ideation & Literature Gap",
              desc: "Deep survey of existing state-of-the-art literature to identify unaddressed scientific challenges and research bottlenecks.",
              icon: Search,
              accent: "from-amber-500 to-orange-500"
            },
            {
              step: "02",
              title: "Mentorship & Hypothesis",
              desc: "Collaborate with University Faculty Coordinators to formulate a testable hypothesis, mathematics, and target venue scope.",
              icon: GraduationCap,
              accent: "from-cyan-500 to-blue-500"
            },
            {
              step: "03",
              title: "Prototyping & Engineering",
              desc: "Develop modular software repositories, algorithm pipelines, TinyML firmware, or physical autonomous robotics hardware.",
              icon: Code2,
              accent: "from-purple-500 to-pink-500"
            },
            {
              step: "04",
              title: "Empirical Benchmarking",
              desc: "Execute rigorous benchmarking against baseline models, ablation experiments, error rate analyses, and validation metrics.",
              icon: CheckCircle2,
              accent: "from-emerald-500 to-teal-500"
            },
            {
              step: "05",
              title: "Peer-Reviewed Publication",
              desc: "Draft publication manuscripts formatted to IEEE/Scopus standards and submit provisional patent disclosures to the Indian Patent Office.",
              icon: FileText,
              accent: "from-rose-500 to-red-500"
            },
            {
              step: "06",
              title: "Real-World Societal Impact",
              desc: "Deploy open-source datasets, tech-transfer prototypes, and represent Sanjivani University in national research symposia.",
              icon: Rocket,
              accent: "from-yellow-500 to-amber-500"
            }
          ].map((item, idx) => {
            const StepIcon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black font-outfit bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <StepIcon className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white font-outfit">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}

        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. FEATURED ACTIVE PROJECTS (DATABASE INTEGRATED)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Engineering & Software Prototypes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              Featured Research Projects
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>View All {activeProjectsCount} Projects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(proj => (
              <div 
                key={proj.id} 
                className="glass-panel rounded-3xl overflow-hidden border border-slate-800 space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                {proj.image && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img 
                      src={proj.image} 
                      alt={proj.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      {proj.researchDomain}
                    </span>
                  </div>
                )}
                <div className="p-5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Lead: {proj.studentLeader || 'RISE Team'}</span>
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40">
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">{proj.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{proj.description}</p>
                    
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Mentor: <strong className="text-slate-200">{proj.facultyMentor}</strong></span>
                      <span className="text-amber-400 font-mono font-bold">{proj.progress || 0}%</span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                        style={{ width: `${proj.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-white">No active research projects listed currently.</p>
            <p className="text-xs text-slate-400">New projects are created and assigned through the RISE Research Head portal.</p>
          </div>
        )}

      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. RESEARCH PUBLICATIONS & PATENTS SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Peer-Reviewed Literature & Intellectual Property</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              Latest Publications & Patents
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('publications')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
          >
            <span>View All {publicationsCount} Publications</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredPublications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredPublications.map(pub => (
              <div 
                key={pub.id} 
                className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                      {pub.domain || 'AI'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{pub.status || 'Published'}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{pub.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">Authors: <span className="text-slate-300">{pub.authors}</span></p>
                  
                  {pub.abstract && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{pub.abstract}</p>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span>{pub.journal} ({pub.year})</span>
                  {pub.doi && (
                    <a 
                      href={pub.doiLink || `https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <span>DOI Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-white">No publications recorded yet.</p>
            <p className="text-xs text-slate-400">Papers will appear here once verified by the Research Head.</p>
          </div>
        )}

      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. RISE RESEARCH COMMUNITY (STRICT PUBLIC WHITELIST FILTER)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Student Researchers & Innovators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              RISE Research Community
            </h2>
            <p className="text-xs text-slate-400">
              Interview-selected undergraduate researchers in the Department of Integrated B.Tech.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('members')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>Explore All {activeMembersCount} Members</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communityMembers.map((member, idx) => (
            <div 
              key={member?.id || idx} 
              className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={member?.photo} 
                    name={member?.name} 
                    size="lg" 
                    className="w-12 h-12 rounded-2xl shrink-0" 
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{member?.name}</h3>
                    <p className="text-[11px] text-slate-400">{member?.role || 'RISE Club Member'}</p>
                    <span className="text-[10px] text-amber-400/90 font-medium">{member?.department} ({member?.academicYear})</span>
                  </div>
                </div>

                {member?.bio && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{member.bio}</p>
                )}

                {member?.researchInterests && member.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {member.researchInterests.slice(0, 3).map((res, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-purple-300">
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member?.githubUrl && (
                    <a href={member.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="GitHub">
                      <Code2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member?.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300" title="LinkedIn">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => navigateToMember(member?.id)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          9. RISE LEADERSHIP HIERARCHY (DYNAMIC DIRECTORY MAPPING)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Organizational Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            RISE Leadership & Advisory Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            University Faculty Supervision and Student Executive Leadership coordinating academic research clusters.
          </p>
        </div>

        {/* Executive Duo: Faculty Coordinator & President */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Faculty Coordinator */}
          {facultyLead && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-purple-500/50 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
                    FACULTY COORDINATOR
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Academic Oversight</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={facultyLead.photo} 
                    name={facultyLead.name} 
                    size="2xl" 
                    className="w-18 h-18 rounded-2xl border-2 border-purple-400/60 shadow-lg shrink-0" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white font-outfit">{facultyLead.name}</h3>
                    <p className="text-xs text-purple-300 font-medium">{facultyLead.department} • {facultyLead.division || 'Integrated B.Tech'}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{facultyLead.bio}</p>
              </div>
              <button
                onClick={() => navigateToMember(facultyLead.id)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>View Faculty Profile & Publications</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Student President */}
          {presidentLead && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-amber-950/30 to-slate-900">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                    PRESIDENT
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">Student Executive Lead</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={presidentLead.photo} 
                    name={presidentLead.name} 
                    size="2xl" 
                    className="w-18 h-18 rounded-2xl border-2 border-amber-400/60 shadow-lg shrink-0" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white font-outfit">{presidentLead.name}</h3>
                    <p className="text-xs text-amber-300 font-medium">{presidentLead.department} ({presidentLead.academicYear})</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{presidentLead.bio}</p>
              </div>
              <button
                onClick={() => navigateToMember(presidentLead.id)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>View President Profile & Projects</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Functional Wings Leadership Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          
          {/* Research Head */}
          {researchHead && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded">RESEARCH HEAD</span>
                <div className="flex items-center gap-3">
                  <Avatar src={researchHead.photo} name={researchHead.name} size="md" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{researchHead.name}</h4>
                    <p className="text-[10px] text-slate-400">{researchHead.department}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Supervises paper manuscripts, patent formulation, and research gap reviews.</p>
              </div>
              <button onClick={() => navigateToMember(researchHead.id)} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>View Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Event Coordinator */}
          {eventCoord && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded">EVENT COORDINATOR</span>
                <div className="flex items-center gap-3">
                  <Avatar src={eventCoord.photo} name={eventCoord.name} size="md" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{eventCoord.name}</h4>
                    <p className="text-[10px] text-slate-400">{eventCoord.department}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Manages university symposia, national hackathons, and research bootcamps.</p>
              </div>
              <button onClick={() => navigateToMember(eventCoord.id)} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>View Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Secretary */}
          {secretaryLead && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/60 px-2 py-0.5 rounded">SECRETARY</span>
                <div className="flex items-center gap-3">
                  <Avatar src={secretaryLead.photo} name={secretaryLead.name} size="md" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{secretaryLead.name}</h4>
                    <p className="text-[10px] text-slate-400">{secretaryLead.department}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Maintains society governance records, meeting archives, and operational discipline.</p>
              </div>
              <button onClick={() => navigateToMember(secretaryLead.id)} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <span>View Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Member Coordinator */}
          {memberCoord && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded">MEMBER COORDINATOR</span>
                <div className="flex items-center gap-3">
                  <Avatar src={memberCoord.photo} name={memberCoord.name} size="md" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{memberCoord.name}</h4>
                    <p className="text-[10px] text-slate-400">{memberCoord.department}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Coordinates interview evaluations, member onboarding, and task workflows.</p>
              </div>
              <button onClick={() => navigateToMember(memberCoord.id)} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>View Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          10. UPCOMING RISE EVENTS & SYMPOSIA
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Symposia, Bootcamps & Workshops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              Upcoming RISE Events
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>View Full Event Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.map(evt => (
              <div 
                key={evt.id} 
                className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {evt.type || evt.category || 'Workshop'}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono font-semibold">{evt.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{evt.name || evt.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>📍 {evt.venue || 'Sanjivani Campus'}</span>
                    <span className="text-slate-500">{evt.time || '10:00 AM'}</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('events')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Register for Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-white">No upcoming events scheduled right now.</p>
            <p className="text-xs text-slate-400">Check back soon for new hackathons and workshop announcements.</p>
          </div>
        )}

      </section>


      {/* ─────────────────────────────────────────────────────────────
          11. RISE ACHIEVEMENTS & ACCOLADES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Verified Honors & Hackathon Accolades</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              RISE Achievements & Recognitions
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('achievements')}
            className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5"
          >
            <span>View All Accolades</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredAchievements.map(ach => (
              <div 
                key={ach.id} 
                className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-yellow-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-950 text-yellow-300 border border-yellow-800/40">
                      {ach.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ach.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{ach.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Awarded to: <strong className="text-slate-200">{ach.recipientName}</strong></span>
                  <p className="text-[10px] text-slate-500">Issued by: {ach.issuedBy}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-white">No achievements registered yet.</p>
            <p className="text-xs text-slate-400">Honors and certificates are awarded through the Faculty and President portal.</p>
          </div>
        )}

      </section>


      {/* ─────────────────────────────────────────────────────────────
          12. OPPORTUNITIES AT RISE (8 COMPREHENSIVE CARDS)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5" />
            <span>Undergraduate Pathways</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Opportunities at RISE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pathways for ambitious Integrated B.Tech students to gain elite research credentials before graduation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Active Research Projects",
              desc: "Join faculty-mentored lab initiatives addressing AI, TinyML, and autonomous systems.",
              icon: Layers,
              color: "text-amber-400"
            },
            {
              title: "Student Researcher Roles",
              desc: "Conduct literature reviews, statistical experiments, and novel algorithmic design.",
              icon: Users,
              color: "text-cyan-400"
            },
            {
              title: "Faculty Mentorship",
              desc: "Receive 1-on-1 supervisory guidance from University professors throughout your academic journey.",
              icon: GraduationCap,
              color: "text-purple-400"
            },
            {
              title: "Publications & Patents",
              desc: "Author Scopus/IEEE papers and file Indian patents with institutional support and funding.",
              icon: BookOpen,
              color: "text-emerald-400"
            },
            {
              title: "Specialized Workshops",
              desc: "Master PyTorch, TinyML microcontrollers, ROS2 robotics, and cyber telemetry in hands-on labs.",
              icon: Terminal,
              color: "text-rose-400"
            },
            {
              title: "Hackathons & Contests",
              desc: "Represent Sanjivani University in national AI, smart vehicle, and cybersecurity competitions.",
              icon: Award,
              color: "text-yellow-400"
            },
            {
              title: "Industry Collaboration",
              desc: "Solve industrial problem statements with regional technology partners and research grants.",
              icon: Building,
              color: "text-blue-400"
            },
            {
              title: "Innovation Grants",
              desc: "Access hardware testbeds, cloud compute credits, and prototyping components.",
              icon: Zap,
              color: "text-orange-400"
            }
          ].map((opp, idx) => {
            const OppIcon = opp.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <OppIcon className={`w-5 h-5 ${opp.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{opp.desc}</p>
                </div>

                <button
                  onClick={() => setActiveTab('join')}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-2 border-t border-slate-800/80"
                >
                  <span>Apply for Selection</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          13. WHY JOIN RISE? (6 BENEFIT PILLARS)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Institutional Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Why Join RISE?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A distinctive ecosystem engineered for student intellectual curiosity and career acceleration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Hands-on Research Experience",
              desc: "Go far beyond standard curriculum textbook theory by working on genuine unsolved computational inquiries.",
              icon: Lightbulb
            },
            {
              title: "Publication & Patent Credentials",
              desc: "Build a formidable academic portfolio with verified Scopus citations and published patents before graduating.",
              icon: BookOpen
            },
            {
              title: "Open Innovation & Prototyping",
              desc: "Transform conceptual equations into production-ready software repositories and deployable hardware prototypes.",
              icon: Cpu
            },
            {
              title: "Interdisciplinary Collaboration",
              desc: "Collaborate in diverse clusters uniting AI modelers, embedded engineers, and cybersecurity specialists.",
              icon: Network
            },
            {
              title: "Technical & Leadership Growth",
              desc: "Lead teams, author technical proposals, manage projects, and present research to academic audiences.",
              icon: TrendingUp
            },
            {
              title: "Elite Research Community",
              desc: "Work side-by-side with high-achieving peers and university faculty dedicated to academic excellence.",
              icon: Users
            }
          ].map((benefit, idx) => {
            const BenIcon = benefit.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    <BenIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-outfit">{benefit.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. EXECUTIVE LEADERSHIP & SOCIETY DIRECTORATE
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Executive Leadership & Directorate
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Supervised by Department Faculty and co-led by Student Executive Leadership with Equal Administrative Authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Faculty Coordinator */}
          {facultyLead && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-purple-500/40 space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    Faculty Coordinator
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Supervisory Authority</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <Avatar 
                    src={facultyLead.photo} 
                    name={facultyLead.name} 
                    size="xl" 
                    className="w-16 h-16 rounded-2xl border-2 border-purple-400/60 shadow-lg shrink-0" 
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit">{facultyLead.name}</h3>
                    <p className="text-xs text-purple-300">{facultyLead.department} | {facultyLead.division}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{facultyLead.bio}</p>
              </div>
              <button
                onClick={() => navigateToMember(facultyLead.id)}
                className="w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all group"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* President */}
          {presidentLead && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/40 space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between bg-gradient-to-br from-amber-950/20 to-slate-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    President
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">Student Executive Lead</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <Avatar 
                    src={presidentLead.photo} 
                    name={presidentLead.name} 
                    size="xl" 
                    className="w-16 h-16 rounded-2xl border-2 border-amber-400/60 shadow-lg shrink-0" 
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit">{presidentLead.name}</h3>
                    <p className="text-xs text-amber-300">{presidentLead.department} ({presidentLead.academicYear})</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{presidentLead.bio}</p>
              </div>
              <button
                onClick={() => navigateToMember(presidentLead.id)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md group"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Vice President */}
          {vpLead && (
            <div className="glass-panel p-6 rounded-3xl border-2 border-emerald-500/40 space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between bg-gradient-to-br from-emerald-950/20 to-slate-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Vice President
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Equal Executive Lead</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <Avatar 
                    src={vpLead.photo} 
                    name={vpLead.name} 
                    size="xl" 
                    className="w-16 h-16 rounded-2xl border-2 border-emerald-400/60 shadow-lg shrink-0" 
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit">{vpLead.name}</h3>
                    <p className="text-xs text-emerald-300">{vpLead.department} ({vpLead.academicYear})</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{vpLead.bio}</p>
              </div>
              <button
                onClick={() => navigateToMember(vpLead.id)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md group"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveTab('team')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700/80 text-xs font-bold transition-all shadow-sm"
          >
            <span>Explore Complete Organizational Roster & Wings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          15. BUILDING A CULTURE OF RESEARCH (INSTITUTIONAL BANNER)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-6">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
              Institutional Core Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-outfit">
              Building a Culture of Research & Innovation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              Sanjivani University fosters an environment where undergraduate curiosity is channeled into rigorous scientific inquiry and intellectual property creation.
            </p>
          </div>

          {/* Step chain banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center pt-2">
            {[
              { label: "Research", icon: Search },
              { label: "Experiment", icon: Atom },
              { label: "Collaborate", icon: Users },
              { label: "Publish", icon: FileText },
              { label: "Innovate", icon: Lightbulb },
              { label: "Impact", icon: Rocket }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-all">
                  <StepIcon className="w-4 h-4 text-amber-400 mx-auto" />
                  <div className="text-xs font-bold text-white font-outfit">{step.label}</div>
                  <div className="text-[10px] text-slate-500">Phase 0{idx + 1}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          15. CALL TO ACTION: TURN IDEAS INTO RESEARCH
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/50 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Year 2026–2027 Admissions & Intake</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
              Have a Research Idea? Turn It Into Impact.
            </h2>
            
            <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Applications for RISE Research Society membership are currently open for Integrated B.Tech students. Join specialized research clusters, secure faculty mentorship, and publish peer-reviewed papers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            
            <button
              onClick={() => setActiveTab('join')}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Apply for Interview Selection
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Explore Research Repository
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className="px-6 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Member Login Portal
            </button>

          </div>

          <div className="pt-4 text-xs text-slate-400">
            <span>Department of Integrated B.Tech • Sanjivani University, Kopargaon</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;

