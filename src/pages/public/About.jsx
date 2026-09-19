import React from 'react';
import { 
  Sun, 
  Target, 
  Rocket, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Users,
  Compass,
  Cpu,
  Layers,
  Lightbulb,
  Building2,
  HelpCircle
} from 'lucide-react';

export const About = () => {
  const missionPoints = [
    "Encourage high-quality research across all engineering disciplines",
    "Promote publication in reputed Scopus, Web of Science & IEEE journals",
    "Develop innovative hardware-software prototypes and file Indian/PCT patents",
    "Encourage interdisciplinary collaboration across AI, Robotics, and IoT",
    "Connect students with leading industry research labs and incubators",
    "Build vibrant, disciplined research-oriented student communities"
  ];

  const objectives = [
    {
      title: "Scientific Rigor & Ethics",
      desc: "Implement structured literature gap analysis and reproducible experimental methodologies."
    },
    {
      title: "Intellectual Property Generation",
      desc: "Transform undergraduate projects into registered patents and high-impact conference proceedings."
    },
    {
      title: "Industry Mentorship & Grants",
      desc: "Bridge student research teams with government funding bodies (DST, SERB, AICTE) and tech partners."
    },
    {
      title: "Hands-on Technical Leadership",
      desc: "Empower students to lead specialized labs, organize national symposia, and mentor junior cohorts."
    }
  ];

  const researchAreas = [
    { title: "Artificial Intelligence & Generative AI", icon: "🧠", desc: "LLMs, Prompt Engineering, Multimodal Systems, RAG" },
    { title: "Machine Learning & Deep Learning", icon: "📊", desc: "Vision Transformers, Graph Neural Networks, TinyML" },
    { title: "Cybersecurity & Cryptography", icon: "🛡️", desc: "Zero-Trust IoT, Anomaly Detection, Firmware Defense" },
    { title: "Internet of Things (IoT) & Smart Cities", icon: "📡", desc: "Sensor Networks, LoRaWAN, Smart Grids, Edge Computing" },
    { title: "Robotics & Autonomous Systems", icon: "🤖", desc: "Drone Swarms, ROS2, SLAM Navigation, Computer Vision" },
    { title: "Emerging & Quantum Intelligence", icon: "⚛️", desc: "Quantum Algorithms, Bio-inspired Computing, Neuromorphic AI" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 py-12">
      
      {/* 1. Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sun className="w-4 h-4" />
          <span>Sanjivani University • Department of Integrated B.Tech</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          About <span className="gradient-text-sun">RISE Society</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Research & Innovation Society for Emerging Intelligence (Academic Year 2026–2027)
        </p>
      </div>

      {/* 2. Vision & Tagline Card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 p-8 sm:p-10 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-outfit">Official RISE Vision</h2>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">“Rising Sun – From Ideas to Impact”</p>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
          “To promote research, innovation, creativity, and technology-driven solutions among students.”
        </blockquote>

        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2">
          <span>Official Tagline: <strong className="text-amber-400">“RISE with Ideas. Research with Purpose. Impact the Future.”</strong></span>
          <span className="text-slate-500 font-mono">EST. 2026</span>
        </div>
      </div>

      {/* 3. Mission Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-white font-outfit">Our Strategic Mission</h2>
          <p className="text-xs text-slate-400">Core guiding principles governing all society operations and project tracks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missionPoints.map((pt, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start gap-3.5 hover:border-amber-500/30 transition-all">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                0{i+1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium pt-0.5">{pt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Strategic Objectives */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Key Objectives & Deliverables</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Measurable benchmarks pursued by each research wing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{obj.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Why RISE? Key Differentiators */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-white font-outfit">Why RISE?</h2>
          <p className="text-xs text-slate-400">Why our student research society creates extraordinary outcomes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Faculty Mentorship</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supervised directly by Dr. Abhijit Kshirsagar and departmental experts with deep research experience in AI, Robotics, and IoT.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 w-fit">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Prototype to Patent Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We provide continuous guidance from initial hypothesis formulation, experimentation, and paper writing to patent filings.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Interview-Selected Community</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only high-aptitude, dedicated student candidates are selected through interview screening, ensuring high focus and teamwork.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Research Thrust Areas */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-white font-outfit">Specialized Research Areas</h2>
          <p className="text-xs text-slate-400">Explore our focus domains across emerging technological disciplines</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchAreas.map((area, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{area.icon}</span>
                <h4 className="text-xs font-bold text-white">{area.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
