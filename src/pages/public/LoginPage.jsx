import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Lock, Sun, KeyRound, ArrowRight, ShieldAlert, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage = ({ setActiveTab }) => {
  const { loginWithPRN, isAuthenticated, currentUser } = useAuth();
  const { data } = useData();

  const [credentialInput, setCredentialInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!credentialInput || !passwordInput) {
      setErrorMsg("Please enter your Student PRN or Email and Password.");
      return;
    }

    const result = loginWithPRN(credentialInput, passwordInput);
    if (result.success) {
      const userRole = result.user.role;
      if (userRole === 'Faculty Coordinator') {
        setActiveTab('dashboard-faculty');
      } else if (userRole === 'President' || userRole === 'Vice President') {
        setActiveTab('dashboard-pres-vp');
      } else {
        setActiveTab('dashboard-member');
      }
    } else {
      setErrorMsg(result.message || "Invalid PRN/Email or Password.");
    }
  };

  const handleQuickDemoLogin = (userObj) => {
    setCredentialInput(userObj.prn);
    setPasswordInput(`${userObj.prn}@rise2026`);
    const result = loginWithPRN(userObj.prn, `${userObj.prn}@rise2026`);
    if (result.success) {
      if (userObj.role === 'Faculty Coordinator') setActiveTab('dashboard-faculty');
      else if (['President', 'Vice President'].includes(userObj.role)) setActiveTab('dashboard-pres-vp');
      else setActiveTab('dashboard-member');
    }
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Already Authenticated</h2>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-1 text-slate-300">
          <p>Logged in as: <strong className="text-amber-400">{currentUser.name}</strong></p>
          <p>Role: <span className="text-white font-semibold">{currentUser.role}</span> | PRN: <span className="font-mono text-amber-300">{currentUser.prn}</span></p>
        </div>
        <button
          onClick={() => {
            if (currentUser.role === 'Faculty Coordinator') setActiveTab('dashboard-faculty');
            else if (['President', 'Vice President'].includes(currentUser.role)) setActiveTab('dashboard-pres-vp');
            else setActiveTab('dashboard-member');
          }}
          className="w-full py-3 rounded-2xl font-bold bg-amber-500 text-slate-950 text-xs shadow-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Access My Isolated Profile Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-md">
          <Lock className="w-4 h-4" />
          <span>Standalone Authenticated Member Access Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Member Login Portal</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Each Research Club Member must log in using their own unique <strong>PRN or Email</strong> and <strong>Password</strong> to access their isolated, editable profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Dedicated Standalone Login Form */}
        <form onSubmit={handleLoginSubmit} className="glass-panel p-8 rounded-3xl space-y-5 border border-slate-800 shadow-2xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>Member Credential Login</span>
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Student PRN or Email Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. PRN2026010 or student@sanjivani.edu.in"
              value={credentialInput}
              onChange={e => setCredentialInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Private Hashed Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center gap-2"
          >
            <span>Authenticate & Access My Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 text-center">
            <p className="text-amber-300 font-bold">🔒 100% Profile Isolation & Security</p>
            <p>No member can access or view another member's private profile.</p>
          </div>
        </form>

        {/* Core Team & Member Accounts Selector for Testing */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Test Individual Member Accounts</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any account to authenticate as that member</p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickDemoLogin(u)}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-amber-400/40" />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">PRN: <span className="text-amber-300">{u.prn}</span> | {u.role}</div>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
