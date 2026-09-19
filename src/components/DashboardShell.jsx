import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Sun, 
  ShieldCheck, 
  Bell, 
  Sparkles,
  User,
  Plus
} from 'lucide-react';

export const DashboardShell = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, isAuthenticated, permissions, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard-faculty': return 'Faculty Coordinator Dashboard';
      case 'dashboard-pres-vp': return 'Executive Leadership Dashboard';
      case 'dashboard-member': return 'Member Research Dashboard';
      case 'manage-members': return 'Member Lifecycle Management';
      case 'create-members': return 'Onboard & Create Member Accounts';
      case 'manage-teams': return 'Research Teams & Clusters';
      case 'manage-tasks': return 'Task & Deliverable Review';
      case 'manage-applications': return 'Interview & Selection Pipeline';
      case 'issue-certificates': return 'Certificate Issuance Portal';
      case 'manage-announcements': return 'Announcements Broadcast';
      case 'research': return 'Research & Publications Portfolio';
      case 'projects': return 'Active Projects & Prototypes';
      case 'events': return 'Society Events & Workshops';
      case 'team': return 'Core Team & Member Roster';
      case 'achievements': return 'Awards & Verified Credentials';
      case 'login': return 'Authentication Portal';
      default: return 'Research & Innovation Society for Emerging Intelligence';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:flex
        ${mobileMenuOpen ? 'block' : 'hidden md:block'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-outfit truncate">
                {getPageTitle(activeTab)}
              </h2>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase hidden sm:block">
                RISE Ecosystem • Sanjivani University
              </p>
            </div>
          </div>

          {/* Header Actions & Profile Pill */}
          <div className="flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2.5">
                {permissions?.canCreateMemberProfile && (
                  <button
                    onClick={() => setActiveTab('create-members')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Profile</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <img 
                    src={currentUser.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/50" 
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-md hover:brightness-110 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </header>

        {/* Inner Main Content */}
        <main className="flex-1 pb-16">
          {children}
        </main>

      </div>

    </div>
  );
};

export const Shell = DashboardShell;
export default DashboardShell;
