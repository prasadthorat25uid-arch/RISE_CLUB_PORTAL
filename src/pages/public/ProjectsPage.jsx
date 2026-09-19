import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Layers, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

export const ProjectsPage = () => {
  const { data } = useData();
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredProjects = filterStatus === 'All'
    ? data.projects
    : data.projects.filter(p => p.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-outfit">
            RISE <span className="gradient-text-sun">Projects Directory</span>
          </h1>
          <p className="text-xs text-slate-400">Student-led research & technological hardware/software projects</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['All', 'In Progress', 'Under Review', 'Completed', 'Patented'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="glass-panel p-6 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {proj.researchDomain}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{proj.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                proj.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' :
                proj.status === 'Patented' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' :
                'bg-amber-950 text-amber-300 border border-amber-800/40'
              }`}>
                {proj.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Faculty Mentor</span>
                <span className="text-slate-200 font-medium">{proj.facultyMentor}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Student Leader</span>
                <span className="text-amber-400 font-medium">{proj.studentLeader}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Completion Progress</span>
                <span className="text-amber-400">{proj.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span>Team: {proj.teamName}</span>
              <span>Target: {proj.expectedCompletion}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
