import React from 'react';
import { Sun, Target, Rocket, Award, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-10">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sun className="w-4 h-4" />
          <span>Official Academic Year 2026–2027</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          About <span className="gradient-text-sun">RISE Society</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Research & Innovation Society for Emerging Intelligence
        </p>
        <div className="text-xs text-slate-400 space-y-0.5">
          <p>Sanjivani University | School of Engineering and Technology (SET)</p>
          <p>Department of Integrated B.Tech</p>
        </div>
      </div>

      {/* Official Vision Card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Official RISE Vision Statement</h2>
            <p className="text-xs text-amber-400 font-semibold">“Rising Sun – From Ideas to Impact”</p>
          </div>
        </div>
        <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
          “To build a world-class student research ecosystem that transforms innovative ideas into high-quality scientific publications, patents, funded projects, prototypes and impactful technologies for society.”
        </blockquote>
      </div>

      {/* Official Tagline Highlight */}
      <div className="text-center py-6 glass-panel rounded-2xl border border-slate-800">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">Official Society Tagline</span>
        <span className="text-lg sm:text-2xl font-black gradient-text-sun font-outfit">
          “RISE with Ideas. Research with Purpose. Impact the Future.”
        </span>
      </div>

      {/* Mission & Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">High-Impact Research</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fostering rigorous scientific methodology, systematic literature gap identification, and Scopus/IEEE index publications.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 w-fit">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Patents & Prototypes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protecting intellectual property through Indian and PCT patent filings, backed by hardware-software prototype validation.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Student Leadership & Research Wings</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering students with dedicated leadership wings (President, Research Head, Coordinators) under Faculty Coordinator supervision.
          </p>
        </div>
      </div>

    </div>
  );
};
