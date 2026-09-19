import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Lock, 
  KeyRound, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  HelpCircle,
  Mail,
  FileBadge
} from 'lucide-react';

export const LoginPage = ({ setActiveTab }) => {
  const { login, isAuthenticated, currentUser, logout } = useAuth();
  const { data } = useData();

  const [credentialInput, setCredentialInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const getDashboardForRole = (role) => {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict validation: Both fields required
    if (!credentialInput.trim() || !passwordInput.trim()) {
      setErrorMsg("Please enter your Email/PRN and Password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(credentialInput, passwordInput);
      setIsLoading(false);

      if (result.success && result.user) {
        const targetDashboard = getDashboardForRole(result.user.role);
        setActiveTab(targetDashboard);
      } else {
        setErrorMsg(result.message || "Invalid Email/PRN or Password.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("Invalid Email/PRN or Password.");
    }
  };

  const handleFillTestIdentifier = (userObj) => {
    setCredentialInput(userObj.prn);
    setErrorMsg('');
  };

  if (isAuthenticated && currentUser) {
    const targetDashboard = getDashboardForRole(currentUser.role);

    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            AUTHENTICATED SESSION ACTIVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Role: <span className="text-amber-400 font-bold">{currentUser.role}</span> | PRN: {currentUser.prn}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setActiveTab(targetDashboard)}
            className="flex-1 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open {currentUser.role} Dashboard</span>
          </button>

          <button
            onClick={logout}
            className="px-6 py-3.5 rounded-2xl font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs hover:bg-slate-800 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src="/rise-logo.png" alt="RISE Logo" className="w-16 h-16 object-contain rounded-2xl border border-amber-500/40 shadow-xl" />
          <div className="text-left">
            <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit tracking-wide">
              RISE <span className="gradient-text-sun">ERP PORTAL</span>
            </h1>
            <p className="text-[11px] text-amber-400 font-semibold tracking-widest uppercase">
              Research & Innovation Society for Emerging Intelligence
            </p>
            <p className="text-[10px] text-slate-400">Sanjivani University • SET Dept of Integrated B.Tech</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Strict Authentication Gateway for Faculty, Core Officers & Club Members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Dedicated Standalone Login Form */}
        <form onSubmit={handleLoginSubmit} className="glass-panel p-8 rounded-3xl space-y-5 border border-slate-800 shadow-2xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold font-outfit">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>ERP Member Authentication</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">2026-2027</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 flex items-center gap-2 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email / PRN *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Registered Email or Student PRN"
                value={credentialInput}
                onChange={e => setCredentialInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Accepts registered Email (e.g. ayushi.ahire@sanjivani.edu.in) or PRN (e.g. PRN2026001)</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password *</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                FORGOT PASSWORD
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Account Password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 text-center">
            <p className="text-amber-300 font-bold">🔒 Strict Authentication Enforced</p>
            <p>Access to private ERP dashboards requires registered Email/PRN and verified password.</p>
          </div>
        </form>

        {/* Approved Registered Member Reference */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered Accounts Reference</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any account to populate Email/PRN into the login form</p>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {data.users.map(u => (
              <div
                key={u.id}
                onClick={() => handleFillTestIdentifier(u)}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-amber-400/40 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{u.name}</div>
                    <div className="text-[10px] text-amber-300/90 font-mono font-semibold">{u.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-400 font-mono block font-bold">{u.prn}</span>
                  <span className="text-[9px] text-slate-500 group-hover:text-amber-300">Fill PRN →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Account Password Recovery</h3>
              <button onClick={() => setForgotModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For security and confidentiality, member account passwords can only be reset by the <strong>Faculty Coordinator</strong> or <strong>President</strong> through the Member Management administrative console.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Faculty: <span className="text-amber-400 font-mono">faculty.rise@sanjivani.edu.in</span></div>
              <div>President: <span className="text-amber-400 font-mono">ayushi.ahire@sanjivani.edu.in</span></div>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
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

export default LoginPage;
