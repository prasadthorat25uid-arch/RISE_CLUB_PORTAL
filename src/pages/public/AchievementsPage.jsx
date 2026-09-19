import React from 'react';
import { useData } from '../../context/DataContext';
import { Award, Medal, Sparkles, CheckCircle2 } from 'lucide-react';

export const AchievementsPage = () => {
  const { data } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Recognition & Achievements</span>
        </h1>
        <p className="text-xs text-slate-400">Merit-Based Awards, Best Contributor Certificates & Innovations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.achievements.map(ach => (
          <div key={ach.id} className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                {ach.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{ach.title}</h3>
            
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <p><strong>Recipient:</strong> <span className="text-amber-400 font-bold">{ach.recipientName}</span> ({ach.recipientRole})</p>
              <p><strong>Issued By:</strong> {ach.issuedBy}</p>
              <p><strong>Date:</strong> {ach.date}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
