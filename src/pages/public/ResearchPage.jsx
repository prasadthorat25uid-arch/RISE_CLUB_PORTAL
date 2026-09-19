import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Cpu, CheckCircle2, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

export const ResearchPage = () => {
  const { data } = useData();

  const workflowSteps = [
    { num: 1, title: "Research Idea", desc: "Formulating novel hypotheses based on emerging intelligence trends." },
    { num: 2, title: "Literature Review", desc: "Rigorous analysis of IEEE, Springer, and ACM state-of-the-art papers." },
    { num: 3, title: "Research Gap", desc: "Identifying precise technological limits or unaddressed domain challenges." },
    { num: 4, title: "Problem Definition", desc: "Formulating mathematical objectives, loss functions, and evaluation metrics." },
    { num: 5, title: "Methodology", desc: "Architecting neural networks, pipeline algorithms, or sensor fusion setups." },
    { num: 6, title: "Experimentation", desc: "Training PyTorch/CUDA models and acquiring local datasets." },
    { num: 7, title: "Validation", desc: "Cross-validation against standard benchmarks and real-world farm/clinic trials." },
    { num: 8, title: "Publication / Patent", desc: "Drafting manuscripts for Scopus journals and filing IP applications." },
    { num: 9, title: "Funding / Prototype", desc: "Securing research grants and fabricating hardware-software prototypes." },
    { num: 10, title: "Real-World Impact", desc: "Deploying production intelligent systems for society and industry." }
  ];

  const researchDomains = [
    "Artificial Intelligence", "Machine Learning", "Deep Learning", "Reinforcement Learning",
    "Generative AI", "Explainable AI", "Responsible AI", "Computer Vision",
    "NLP & LLMs", "Speech and Multimodal AI", "Recommendation Systems", "AI Cybersecurity",
    "IoT / Edge AI", "Robotics & Autonomous Systems", "Data Science", "Healthcare AI",
    "Smart Agriculture", "Smart Cities", "FinTech / Intelligent Systems"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Research Framework</span>
        </h1>
        <p className="text-sm text-slate-300">
          Official 10-Step Scientific Methodology & Specialized Emerging Intelligence Domains
        </p>
      </div>

      {/* Official 10-Step Workflow Visualizer */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Official RISE 10-Step Research Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Systematic progression followed by all Integrated B.Tech research teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map(step => (
            <div key={step.num} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative space-y-2 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-center font-mono">
                  {step.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white">{step.title}</h3>
              <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Domains Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-outfit">Supported Research Domains</h2>
        <div className="flex flex-wrap gap-2.5">
          {researchDomains.map((domain, i) => (
            <span
              key={i}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 transition-all cursor-default"
            >
              🧠 {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Ongoing Research Projects */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-white font-outfit">Active Research Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.researchItems.map(item => (
            <div key={item.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                  Step: {item.currentStep}
                </span>
                <span className="text-xs text-slate-400 font-mono">IF: {item.impactFactor}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400">Target Journal: <strong className="text-amber-400">{item.targetJournal}</strong></p>
              <div className="text-xs text-slate-300">Lead Author: {item.leadAuthor} ({item.team})</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
