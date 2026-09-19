import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award,
  X,
  Share2,
  Download
} from 'lucide-react';

export const ResearchPage = () => {
  const { data } = useData();
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  const filterDomains = [
    'All',
    'AI',
    'Machine Learning',
    'Deep Learning',
    'Cybersecurity',
    'IoT',
    'Robotics',
    'Emerging Technology'
  ];

  const publications = data.publications || [];

  const filteredPublications = publications.filter(pub => {
    const matchesDomain = selectedDomain === 'All' || 
      pub.domain?.toLowerCase().includes(selectedDomain.toLowerCase()) ||
      pub.researchArea?.toLowerCase().includes(selectedDomain.toLowerCase());

    const matchesSearch = 
      pub.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof pub.authors === 'string' && pub.authors.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.doi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Peer-Reviewed Science & Patents</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          Research <span className="gradient-text-sun">& Publications</span>
        </h1>
        <p className="text-sm text-slate-300">
          Official scientific repository of IEEE, Scopus, Springer indexed papers, and Indian patent filings produced by RISE student researchers.
        </p>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by Title, Author, Journal, DOI, Keyword, or Abstract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Domain:</span>
          </span>
          {filterDomains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === dom
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredPublications.length}</strong> scientific publications & preprints</span>
        {selectedDomain !== 'All' && (
          <span className="text-amber-400 font-medium">Filtered by: {selectedDomain}</span>
        )}
      </div>

      {/* Empty State */}
      {filteredPublications.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-outfit">No research papers found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or select another research domain filter above.
          </p>
          <button
            onClick={() => { setSelectedDomain('All'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Research Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPublications.map((pub) => (
          <div 
            key={pub.id}
            className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                  {pub.domain || pub.researchArea}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  pub.status === 'Published' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                }`}>
                  ● {pub.status}
                </span>
              </div>

              {/* Title */}
              <h3 
                onClick={() => setSelectedPaper(pub)}
                className="text-base font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer leading-snug"
              >
                {pub.title}
              </h3>

              {/* Authors */}
              <p className="text-xs text-slate-300">
                <span className="text-slate-500 font-medium">Authors:</span> {pub.authors}
              </p>

              {/* Journal / DOI details */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span><strong>Journal / Venue:</strong> {pub.journal}</span>
                  <span className="text-slate-400 font-mono font-semibold">{pub.year || '2026'}</span>
                </div>
                <div className="text-amber-400 font-mono truncate">
                  DOI: {pub.doi || 'Pending Assignment'}
                </div>
              </div>

              {/* Abstract Snippet */}
              {pub.abstract && (
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {pub.abstract}
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPaper(pub)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Read Full Abstract</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              {pub.paperUrl && (
                <a
                  href={pub.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>PDF Document</span>
                </a>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* PAPER DETAILS MODAL */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                  {selectedPaper.domain || selectedPaper.researchArea}
                </span>
                <h3 className="text-lg font-bold text-white font-outfit pt-1">{selectedPaper.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedPaper(null)} 
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p><strong>Authors:</strong> {selectedPaper.authors}</p>
              <p><strong>Published In:</strong> {selectedPaper.journal} ({selectedPaper.year})</p>
              <p><strong>DOI:</strong> <span className="font-mono text-amber-400">{selectedPaper.doi}</span></p>
              <p><strong>Status:</strong> <span className="text-emerald-400 font-bold">{selectedPaper.status}</span></p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Complete Abstract</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedPaper.abstract || 'Abstract details currently being compiled for conference proceedings.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {selectedPaper.paperUrl ? (
                <a
                  href={selectedPaper.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Official Paper / Preprint</span>
                </a>
              ) : <div />}

              <button
                onClick={() => setSelectedPaper(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
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

export default ResearchPage;
