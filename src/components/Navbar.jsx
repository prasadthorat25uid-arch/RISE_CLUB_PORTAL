import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Sun, 
  Shield, 
  Users, 
  UserCheck, 
  Layers, 
  Calendar, 
  BookOpen, 
  Award, 
  UserPlus, 
  LayoutDashboard, 
  ChevronDown, 
  Bell, 
  Menu, 
  X,
  Lock,
  LogOut,
  Sparkles,
  FileText
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchUserRole, permissions, isAuthenticated, logout } = useAuth();
  const { data } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingAppsCount = data.applications.filter(a => a.status === 'Pending').length;

  const publicNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About RISE' },
    { id: 'research', label: 'Research' },
    { id: 'projects', label: 'Projects' },
    { id: 'events', label: 'Events' },
    { id: 'publications', label: 'Publications' },
    { id: 'team', label: 'Core Team & Members' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'join', label: 'Join RISE', highlight: true }
  ];

  const allRolesList = data.users.slice(0, 10);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-rose-600/20 border-b border-amber-500/20 px-4 py-1 text-center text-xs font-medium text-amber-200/90">
        <span>Sanjivani University | School of Engineering & Technology | Department of Integrated B.Tech (2026–2027)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Sun className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-outfit">RISE</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  2026-2027
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-none mt-0.5">
                Research & Innovation Society for Emerging Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : item.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 font-bold ml-1 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Login / Dashboard Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    if (permissions.isFaculty) setActiveTab('dashboard-faculty');
                    else if (permissions.isEqualLeadership) setActiveTab('dashboard-pres-vp');
                    else setActiveTab('dashboard-member');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 text-amber-400 hover:bg-slate-700 border border-slate-700/80 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>
                    {permissions.isFaculty ? 'Faculty Portal' : (permissions.isEqualLeadership ? 'Leadership Portal' : 'Member Dashboard')}
                  </span>
                </button>

                {/* Role Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all"
                  >
                    <img src={currentUser?.photo} alt={currentUser?.name} className="w-7 h-7 rounded-full object-cover border border-amber-400/40" />
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">{currentUser?.name}</div>
                      <div className="text-[10px] font-medium text-amber-400 leading-none">{currentUser?.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona / Role</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {allRolesList.map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUserRole(u.id);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                              u.id === currentUser?.id
                                ? 'bg-amber-500/15 border border-amber-500/30'
                                : 'hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={u.photo} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                              <div>
                                <div className="text-xs font-semibold text-white">{u.name}</div>
                                <div className="text-[10px] text-amber-400 font-medium">{u.role}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md hover:brightness-110"
              >
                <Lock className="w-4 h-4" />
                <span>Member Login Portal</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {publicNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left ${
                  activeTab === item.id ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-rose-950 text-rose-300 text-xs font-bold"
              >
                Logout Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Member Login Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
