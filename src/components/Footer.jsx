import React from 'react';
import { Sun, Sparkles, Shield, Heart } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Branding & Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit">RISE</h3>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-lg">
              Research & Innovation Society for Emerging Intelligence
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><strong className="text-white">Institution:</strong> Sanjivani University</p>
              <p><strong className="text-white">School:</strong> School of Engineering and Technology (SET)</p>
              <p><strong className="text-white">Department:</strong> Department of Integrated B.Tech</p>
              <p><strong className="text-white">Academic Year:</strong> 2026–2027</p>
            </div>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                “Rising Sun – From Ideas to Impact”
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About RISE' },
                { id: 'research', label: 'Research' },
                { id: 'projects', label: 'Projects' },
                { id: 'events', label: 'Events' },
                { id: 'publications', label: 'Publications' },
                { id: 'members', label: 'Core Team & Members' },
                { id: 'achievements', label: 'Achievements' },
                { id: 'contact', label: 'Contact Us' }
              ].map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Research & Admin Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Management Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('dashboard-faculty')} className="hover:text-amber-400 transition-colors">
                  Faculty Oversight Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard-pres-vp')} className="hover:text-amber-400 transition-colors">
                  Student Leadership Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('manage-members')} className="hover:text-amber-400 transition-colors">
                  Member Management & Bulk Create
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('manage-tasks')} className="hover:text-amber-400 transition-colors">
                  Task & Team Assignment
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('manage-applications')} className="hover:text-amber-400 transition-colors">
                  Join Applications Review
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 RISE – Sanjivani University. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>RISE with Ideas. Research with Purpose. Impact the Future.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
