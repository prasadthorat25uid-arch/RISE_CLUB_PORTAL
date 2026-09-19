import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Calendar, 
  Users, 
  Megaphone, 
  Award, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  ShieldCheck, 
  ChevronRight,
  CheckSquare,
  ClipboardList,
  Bell
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { currentUser, isAuthenticated, logout, permissions } = useAuth();

  const handleNavClick = (tabKey) => {
    setActiveTab(tabKey);
    if (onClose) onClose();
  };

  const getRoleDashboardTab = () => {
    if (!currentUser) return 'dashboard-member';
    if (permissions?.isTopLevelAdmin) return 'dashboard-admin';
    switch (currentUser.role) {
      case 'Research Head': return 'dashboard-research';
      case 'Event Coordinator': return 'dashboard-events';
      case 'Social Media & Publicity Head': return 'dashboard-social';
      case 'Secretary': return 'dashboard-secretary';
      case 'Member Coordinator': return 'dashboard-members';
      default: return 'dashboard-member';
    }
  };

  let navItems = [];

  if (permissions?.isTopLevelAdmin) {
    navItems = [
      {
        key: 'dashboard-admin',
        label: 'Admin Directorate',
        icon: LayoutDashboard,
        requiresAuth: true
      },
      {
        key: 'manage-members',
        label: 'Manage Members',
        icon: Users,
        requiresAuth: true
      },
      {
        key: 'team',
        label: 'Leadership Roster',
        icon: ShieldCheck,
        requiresAuth: false
      },
      {
        key: 'manage-tasks',
        label: 'Task Oversight & Review',
        icon: ClipboardList,
        requiresAuth: true
      },
      {
        key: 'research',
        label: 'Research Hub',
        icon: BookOpen,
        requiresAuth: false
      },
      {
        key: 'projects',
        label: 'Project Portfolio',
        icon: Layers,
        requiresAuth: false
      },
      {
        key: 'publications',
        label: 'Publications & Papers',
        icon: BookOpen,
        requiresAuth: false
      },
      {
        key: 'events',
        label: 'Event Coordination',
        icon: Calendar,
        requiresAuth: false
      },
      {
        key: 'achievements',
        label: 'Achievements',
        icon: Award,
        requiresAuth: false
      },
      {
        key: 'issue-certificates',
        label: 'Issue Certificates',
        icon: Award,
        requiresAuth: true
      },
      {
        key: 'manage-announcements',
        label: 'Announcements',
        icon: Megaphone,
        requiresAuth: true
      },
      {
        key: 'notifications',
        label: 'Society Notifications',
        icon: Bell,
        requiresAuth: true
      },
      {
        key: 'profile',
        label: 'Executive Profile',
        icon: User,
        requiresAuth: true
      }
    ];
  } else if (currentUser?.role === 'Research Head') {
    navItems = [
      { key: 'dashboard-research', label: 'Research Portal', icon: LayoutDashboard, requiresAuth: true },
      { key: 'tasks', label: 'My Tasks', icon: CheckSquare, requiresAuth: true },
      { key: 'manage-tasks', label: 'Task Oversight', icon: ClipboardList, requiresAuth: true },
      { key: 'research', label: 'Research Projects', icon: BookOpen, requiresAuth: false },
      { key: 'publications', label: 'Publications', icon: BookOpen, requiresAuth: false },
      { key: 'projects', label: 'Projects', icon: Layers, requiresAuth: false },
      { key: 'notifications', label: 'Notifications', icon: Bell, requiresAuth: true },
      { key: 'profile', label: 'My Profile', icon: User, requiresAuth: true }
    ];
  } else if (currentUser?.role === 'Event Coordinator') {
    navItems = [
      { key: 'dashboard-events', label: 'Events Portal', icon: LayoutDashboard, requiresAuth: true },
      { key: 'tasks', label: 'My Tasks', icon: CheckSquare, requiresAuth: true },
      { key: 'manage-tasks', label: 'Task Oversight', icon: ClipboardList, requiresAuth: true },
      { key: 'events', label: 'Events Hub', icon: Calendar, requiresAuth: false },
      { key: 'projects', label: 'Projects', icon: Layers, requiresAuth: false },
      { key: 'notifications', label: 'Notifications', icon: Bell, requiresAuth: true },
      { key: 'profile', label: 'My Profile', icon: User, requiresAuth: true }
    ];
  } else if (currentUser?.role === 'Member Coordinator') {
    navItems = [
      { key: 'dashboard-members', label: 'Member Portal', icon: LayoutDashboard, requiresAuth: true },
      { key: 'manage-members', label: 'Manage Members', icon: Users, requiresAuth: true },
      { key: 'tasks', label: 'My Tasks', icon: CheckSquare, requiresAuth: true },
      { key: 'team', label: 'Roster', icon: Users, requiresAuth: false },
      { key: 'notifications', label: 'Notifications', icon: Bell, requiresAuth: true },
      { key: 'profile', label: 'My Profile', icon: User, requiresAuth: true }
    ];
  } else {
    // Default Student / RISE Club Member
    navItems = [
      { key: 'dashboard-member', label: 'My ERP Dashboard', icon: LayoutDashboard, requiresAuth: true },
      { key: 'profile', label: 'My Private Profile', icon: User, requiresAuth: true },
      { key: 'tasks', label: 'My Tasks & Submissions', icon: CheckSquare, requiresAuth: true },
      { key: 'research', label: 'Research Hub', icon: BookOpen, requiresAuth: false },
      { key: 'projects', label: 'Projects', icon: Layers, requiresAuth: false },
      { key: 'publications', label: 'Publications', icon: BookOpen, requiresAuth: false },
      { key: 'events', label: 'Events & Symposia', icon: Calendar, requiresAuth: false },
      { key: 'achievements', label: 'My Achievements & Badges', icon: Award, requiresAuth: false },
      { key: 'notifications', label: 'Society Notifications', icon: Bell, requiresAuth: true }
    ];
  }

  return (
    <aside className={`
      w-64 bg-slate-950/95 border-r border-slate-800 flex flex-col justify-between h-full z-40 transition-all duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-outfit font-black text-lg text-white tracking-wider block">RISE</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase block -mt-1">
                Sanjivani Univ
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile / Logout Section at Bottom */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {isAuthenticated && currentUser ? (
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-3 cursor-pointer group"
              title="View & Edit Profile"
            >
              <Avatar 
                src={currentUser.photo} 
                name={currentUser.name} 
                size="sm"
                className="w-8 h-8 rounded-full group-hover:scale-105 transition-transform shrink-0" 
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">{currentUser.name}</p>
                <p className="text-[10px] text-amber-400 font-mono truncate">{currentUser.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/50 text-[11px] font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick('login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Member Login</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
