import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { EditProfileModal } from './EditProfileModal';
import { 
  Menu, 
  X, 
  Sun, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  User, 
  Plus,
  Edit3
} from 'lucide-react';

export const DashboardShell = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, isAuthenticated, permissions, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard-faculty': return 'Faculty Coordinator Supervisory Portal';
      case 'dashboard-president': return 'President Executive Leadership Portal';
      case 'dashboard-research': return 'Research Head & Publications Management';
      case 'dashboard-events': return 'Event Coordinator & Operations Portal';
      case 'dashboard-social': return 'Social Media & Publicity Hub';
      case 'dashboard-secretary': return 'Secretary Documentation & Governance';
      case 'dashboard-members': return 'Member Coordinator & Candidate Pipeline';
      case 'dashboard-member': return 'RISE Club Member Research Portal';
      case 'profile': return 'User Profile & Credentials';
      case 'notifications': return 'Society Notifications & Bulletins';
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
      case 'members': return 'Core Team & Member Roster';
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
                
                {/* Edit Profile Quick Action Button */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all shadow-sm"
                  title="Edit My Profile"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>

                {permissions?.canCreateMemberProfile && (
                  <button
                    onClick={() => setActiveTab('create-members')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Member</span>
                  </button>
                )}

                {/* Profile Pill Clickable -> Opens Profile */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity text-left"
                  title="View Private Profile"
                >
                  <Avatar
                    src={currentUser.photo}
                    name={currentUser.name}
                    size="sm"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono">{currentUser.role}</p>
                  </div>
                </button>
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

      {/* Edit Profile Modal accessible globally from Dashboard */}
      {currentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          targetUser={currentUser}
        />
      )}

    </div>
  );
};

export const Shell = DashboardShell;
export default DashboardShell;
