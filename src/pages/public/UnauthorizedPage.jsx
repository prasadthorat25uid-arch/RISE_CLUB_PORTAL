import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage = ({ setActiveTab, requestedPath = '/dashboard' }) => {
  const { currentUser } = useAuth();

  const getPermittedDashboard = (role) => {
    switch (role) {
      case 'President': return 'dashboard-president';
      case 'Research Head': return 'dashboard-research';
      case 'Event Coordinator': return 'dashboard-events';
      case 'Social Media & Publicity Head': return 'dashboard-social';
      case 'Secretary': return 'dashboard-secretary';
      case 'Member Coordinator': return 'dashboard-members';
      case 'Faculty Coordinator': return 'dashboard-faculty';
      default: return 'dashboard-member';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-2xl">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
          403 – ACCESS RESTRICTED
        </span>
        <h1 className="text-3xl font-black text-white font-outfit">Unauthorized Route Access</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Your current authenticated account ({currentUser?.role || 'Guest'}) does not have permission to access <span className="font-mono text-amber-400">{requestedPath}</span>.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 max-w-md mx-auto text-left space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Role-Based Security Policy:</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          RISE operates on strict role-based access control. Executive controls are isolated to authorized officers.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setActiveTab(getPermittedDashboard(currentUser?.role))}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-lg hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to My Permitted Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Public Home</span>
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
