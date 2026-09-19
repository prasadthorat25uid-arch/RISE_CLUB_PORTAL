import React from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Award, ExternalLink, ShieldCheck } from 'lucide-react';

export const PublicationsPage = () => {
  const { data } = useData();

  const publicPublications = (data.publications || []).filter(
    pub => pub.visibility !== 'Private' && pub.visibility !== 'Internal'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Publications & Patents</span>
        </h1>
        <p className="text-xs text-slate-400">Scopus Indexed Journals, IEEE Conference Proceedings, and Indian Patents</p>
      </div>

      <div className="space-y-4">
        {publicPublications.map(pub => (
          <div key={pub.id} className="glass-panel p-6 rounded-3xl space-y-3 hover:border-amber-500/40 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                pub.type === 'Patent' ? 'bg-purple-950 text-purple-300 border border-purple-800/40' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
              }`}>
                {pub.type}
              </span>
              <span className="text-xs font-mono text-slate-400">Year: {pub.year}</span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">{pub.title}</h3>
            
            <p className="text-xs text-amber-300/90 font-medium">Authors: {pub.authors}</p>
            
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 gap-2">
              <div>
                <strong>Venue / Office:</strong> <span className="text-slate-200">{pub.journal}</span>
              </div>
              <div className="font-mono text-cyan-400">
                DOI/Ref: {pub.doi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
