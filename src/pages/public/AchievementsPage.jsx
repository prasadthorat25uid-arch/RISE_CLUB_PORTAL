import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Award, 
  Medal, 
  Sparkles, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  X, 
  Filter,
  Trophy,
  CheckCircle2,
  FileCheck,
  Zap,
  Globe
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Research publications',
  'Awards',
  'Competitions',
  'Hackathons',
  'Projects',
  'Certifications',
  'Student achievements'
];

export const AchievementsPage = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const achievements = useMemo(() => {
    return (data?.achievements || []).filter(
      a => a.visibility !== 'Private' && a.visibility !== 'Internal'
    );
  }, [data?.achievements]);

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: achievements.length,
      patentsAndResearch: achievements.filter(a => a.category === 'Research publications').length,
      hackathons: achievements.filter(a => a.category === 'Hackathons' || a.category === 'Competitions').length,
      certifications: achievements.filter(a => a.category === 'Certifications').length
    };
  }, [achievements]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        !term ||
        item.title?.toLowerCase().includes(term) ||
        item.recipientName?.toLowerCase().includes(term) ||
        item.recipientRole?.toLowerCase().includes(term) ||
        item.issuedBy?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [achievements, selectedCategory, searchTerm]);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Research publications':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'Hackathons':
      case 'Competitions':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Awards':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40';
      case 'Certifications':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Projects':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Institutional Honors & Student Accolades</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Achievements & Recognition</span>
        </h1>
        <p className="text-sm text-slate-300">
          Patents, Scopus Publications, National Hackathon Wins, DLI Certifications, and Merit Accolades from Sanjivani University.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1 bg-slate-900/50">
          <div className="text-3xl font-black text-amber-400 font-outfit">{metrics.total}</div>
          <div className="text-xs text-slate-400 font-medium">Total Society Honors</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1 bg-slate-900/50">
          <div className="text-3xl font-black text-purple-400 font-outfit">{metrics.patentsAndResearch}</div>
          <div className="text-xs text-slate-400 font-medium">Patents & Scopus Papers</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1 bg-slate-900/50">
          <div className="text-3xl font-black text-cyan-400 font-outfit">{metrics.hackathons}</div>
          <div className="text-xs text-slate-400 font-medium">National Hackathons & Podiums</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1 bg-slate-900/50">
          <div className="text-3xl font-black text-emerald-400 font-outfit">{metrics.certifications}</div>
          <div className="text-xs text-slate-400 font-medium">Verified Certifications</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 bg-slate-900/70">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search achievements by title, recipient name, role, awarding body, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const count = cat === 'All' 
                ? achievements.length 
                : achievements.filter(a => a.category.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Achievement Cards Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No achievements found</h3>
          <p className="text-xs text-slate-400">Try refining your search terms or selecting a different category filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(ach => (
            <div 
              key={ach.id} 
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950"
            >
              <div className="space-y-4">
                
                {/* Card Header: Category & Date */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getCategoryBadgeClass(ach.category)}`}>
                    {ach.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{ach.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {ach.title}
                </h3>

                {/* Recipient & Issuer Box */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Recipient</span>
                      <strong className="text-amber-300 font-bold">{ach.recipientName}</strong>
                      <span className="text-slate-400 text-[10px] block">{ach.recipientRole}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 text-[11px]">
                    <span className="text-slate-400">Issued by: </span>
                    <span className="text-slate-200 font-medium">{ach.issuedBy}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {ach.description}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                {ach.verificationUrl ? (
                  <a
                    href={ach.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Certificate</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Official Society Record</span>
                )}

                <button
                  onClick={() => setSelectedAchievement(ach)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all ml-auto"
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Full Details Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-amber-500/40 p-6 sm:p-8 space-y-6 bg-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getCategoryBadgeClass(selectedAchievement.category)}`}>
                  {selectedAchievement.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-outfit mt-2">
                  {selectedAchievement.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Award Recipient</span>
                <p className="text-amber-300 font-bold text-sm mt-0.5">{selectedAchievement.recipientName}</p>
                <p className="text-slate-400 text-xs">{selectedAchievement.recipientRole}</p>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Awarding Institution</span>
                <p className="text-white font-semibold text-sm mt-0.5">{selectedAchievement.issuedBy}</p>
                <p className="text-slate-400 text-xs font-mono">Date: {selectedAchievement.date}</p>
              </div>

              {selectedAchievement.certificateId && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Certificate / Record ID</span>
                  <p className="text-cyan-400 font-mono font-bold mt-0.5">{selectedAchievement.certificateId}</p>
                </div>
              )}

              {selectedAchievement.impactScore && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Honor Classification</span>
                  <p className="text-emerald-400 font-semibold mt-0.5">{selectedAchievement.impactScore}</p>
                </div>
              )}
            </div>

            {/* Official Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Citation & Official Abstract</h4>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedAchievement.description}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Sanjivani University Record</span>
              </div>

              <div className="flex items-center gap-3">
                {selectedAchievement.verificationUrl && (
                  <a
                    href={selectedAchievement.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>External Verification</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AchievementsPage;
