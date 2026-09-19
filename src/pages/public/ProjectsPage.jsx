import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Cpu, 
  Users, 
  X,
  Play
} from 'lucide-react';

export const ProjectsPage = () => {
  const { data } = useData();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const statuses = ['All', 'In Progress', 'Prototype Ready', 'Patented', 'Completed'];

  const projects = data.projects || [];

  const filteredProjects = projects.filter(proj => {
    if (proj.visibility === 'Private' || proj.visibility === 'Internal') return false;

    const matchesStatus = selectedStatus === 'All' || proj.status === selectedStatus;
    const matchesSearch = 
      proj.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.researchDomain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(proj.technologies) && proj.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Hardware & Software Innovations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          Engineering <span className="gradient-text-sun">Projects</span>
        </h1>
        <p className="text-sm text-slate-300">
          Applied engineering prototypes, open-source repositories, and hardware designs developed by student researchers.
        </p>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by Project Name, Technology (e.g. PyTorch, ROS2, TinyML), Domain, or Team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Status:</span>
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredProjects.length}</strong> active & completed engineering prototypes</span>
        {selectedStatus !== 'All' && (
          <span className="text-cyan-400 font-medium">Filtered by: {selectedStatus}</span>
        )}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-outfit">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or clear status filters.
          </p>
          <button
            onClick={() => { setSelectedStatus('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            {/* Project Image */}
            <div className="h-48 w-full overflow-hidden relative bg-slate-900">
              <img 
                src={proj.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'} 
                alt={proj.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {proj.researchDomain}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                  proj.status === 'Completed' || proj.status === 'Patented'
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {proj.status}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-2">
                <h3 
                  onClick={() => setSelectedProject(proj)}
                  className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer leading-snug"
                >
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Technologies Badges */}
              {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Team & Progress */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Team: <strong className="text-slate-200">{proj.teamName}</strong></span>
                  <span className="text-amber-400 font-mono font-bold">{proj.progress}%</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* External Action Links */}
              <div className="pt-2 flex items-center justify-between gap-2 text-xs">
                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 font-bold transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                ) : <div />}

                {proj.demoUrl ? (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 font-bold transition-all"
                  >
                    Details
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {selectedProject.researchDomain}
                </span>
                <h3 className="text-xl font-bold text-white font-outfit pt-1">{selectedProject.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProject.image && (
              <div className="h-56 w-full rounded-2xl overflow-hidden">
                <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Project Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedProject.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-500 block">Team</span>
                <strong className="text-white">{selectedProject.teamName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Faculty Mentor</span>
                <strong className="text-white">{selectedProject.facultyMentor}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Student Leader</span>
                <strong className="text-amber-400">{selectedProject.studentLeader}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target Completion</span>
                <strong className="text-cyan-400">{selectedProject.expectedCompletion || '2026'}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex gap-2">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Code</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsPage;
