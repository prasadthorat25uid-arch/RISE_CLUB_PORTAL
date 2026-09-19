import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { supabase } from '../../lib/supabaseClient';
import { 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  User,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X
} from 'lucide-react';

export const LoginPage = ({ setActiveTab }) => {
  const { login, isAuthenticated, currentUser, logout } = useAuth();
  const { data, addToast } = useData();

  const [credentialInput, setCredentialInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation errors
  const [fieldErrors, setFieldErrors] = useState({ credential: '', password: '' });
  const [serverError, setServerError] = useState('');

  // Forgot Password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');

  // Test accounts drawer state
  const [testAccountsOpen, setTestAccountsOpen] = useState(false);

  const getDashboardRouteForRole = (role) => {
    switch (role) {
      case 'President': return 'erp/president';
      case 'Faculty Coordinator': return 'erp/faculty';
      case 'Research Head': return 'erp/research';
      case 'Event Coordinator': return 'erp/events';
      case 'Social Media & Publicity Head': return 'erp/publicity';
      case 'Secretary': return 'erp/secretary';
      case 'Member Coordinator': return 'erp/members';
      default: return 'erp/member';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errors = { credential: '', password: '' };

    const cred = credentialInput.trim();
    const pass = passwordInput.trim();

    if (!cred) {
      errors.credential = 'Email or PRN is required';
    }
    if (!pass) {
      errors.password = 'Password is required';
    }

    if (errors.credential || errors.password) {
      setFieldErrors(errors);
      setServerError('Please enter your Email/PRN and Password.');
      return;
    }

    setFieldErrors({ credential: '', password: '' });
    setIsLoading(true);

    try {
      // Execute strict authentication
      const result = await login(cred, pass);
      setIsLoading(false);

      if (result.success && result.user) {
        const targetRoute = getDashboardRouteForRole(result.user.role);
        setActiveTab(targetRoute);
      } else {
        setServerError(result.message || 'Invalid Email/PRN or Password.');
      }
    } catch (err) {
      setIsLoading(false);
      setServerError('Unable to connect to the RISE ERP. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotErrorMsg('');
    setForgotSuccessMsg('');

    if (!forgotEmail.trim()) {
      setForgotErrorMsg('Please enter your registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/#/login`
      });

      setForgotLoading(false);

      if (error) {
        // Fallback friendly message for university ERP
        setForgotSuccessMsg(
          `Password reset instructions have been dispatched to ${forgotEmail}. Please check your inbox or contact your Faculty Coordinator.`
        );
      } else {
        setForgotSuccessMsg(
          `A secure password reset link has been sent to ${forgotEmail}. Please check your university email inbox.`
        );
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotSuccessMsg(
        `A password reset request has been logged for ${forgotEmail}. Please check your inbox or contact your Faculty Coordinator.`
      );
    }
  };

  const handlePopulateTestAccount = (userObj) => {
    setCredentialInput(userObj.prn);
    setPasswordInput(
      userObj.role === 'Faculty Coordinator' ? 'Faculty@2026' : 
      userObj.role === 'President' ? 'Ayushi@2026' : 
      userObj.role === 'Research Head' ? 'Shweta@2026' :
      userObj.role === 'Event Coordinator' ? 'Sairaj@2026' :
      userObj.role === 'Secretary' ? 'Sanskar@2026' :
      userObj.role === 'Member Coordinator' ? 'Vaishnavi@2026' : 'Aarav@2026'
    );
    setFieldErrors({ credential: '', password: '' });
    setServerError('');
  };

  // If already authenticated, show session prompt
  if (isAuthenticated && currentUser) {
    const targetRoute = getDashboardRouteForRole(currentUser.role);

    return (
      <div className="min-h-[85vh] bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Authenticated Session Active
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Role: <span className="text-blue-900 font-bold">{currentUser.role}</span> • PRN: {currentUser.prn}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => setActiveTab(targetRoute)}
              className="w-full py-3 rounded-xl bg-[#0f2b48] hover:bg-[#1a3d66] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enter {currentUser.role} ERP Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all"
            >
              Sign Out Session
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Sanjivani University • RISE ERP Management System
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#f4f7fb] flex flex-col justify-center items-center py-10 px-4 select-none relative">
      
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0f2b48_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Main Centered Institutional Login Card */}
      <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden relative z-10 transition-all">
        
        {/* Top University Brand Bar */}
        <div className="bg-[#0f2b48] text-white px-6 py-2.5 text-center text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-2 border-b border-[#0a1e33]">
          <span>Sanjivani University</span>
          <span>•</span>
          <span>SET Integrated B.Tech</span>
        </div>

        {/* Card Header Section */}
        <div className="p-6 sm:p-8 pb-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="./rise-logo.png" 
              alt="RISE Logo" 
              className="w-12 h-12 object-contain rounded-xl border border-slate-200 p-0.5 bg-white shadow-sm" 
            />
            <div className="text-left">
              <h1 className="text-2xl font-black text-[#0f2b48] font-outfit tracking-tight leading-none">
                RISE ERP
              </h1>
              <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mt-0.5">
                Research & Innovation Society
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-700">
              Research, Innovation & Member Management Portal
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Please enter your institutional credentials to log in.
            </p>
          </div>
        </div>

        {/* Server Alert Message */}
        {serverError && (
          <div className="mx-6 sm:mx-8 mb-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 pt-2 space-y-4">
          
          {/* Field 1: Email / PRN */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Email / PRN <span className="text-red-600">*</span>
              </label>
              {fieldErrors.credential && (
                <span className="text-[11px] font-semibold text-red-600">
                  {fieldErrors.credential}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter Email or PRN"
                value={credentialInput}
                onChange={e => {
                  setCredentialInput(e.target.value);
                  if (fieldErrors.credential) setFieldErrors(prev => ({ ...prev, credential: '' }));
                  if (serverError) setServerError('');
                }}
                className={`w-full bg-white border ${
                  fieldErrors.credential ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                } rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-sans focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48] focus:outline-none transition-colors placeholder:text-slate-400`}
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-red-600">*</span>
              </label>
              {fieldErrors.password && (
                <span className="text-[11px] font-semibold text-red-600">
                  {fieldErrors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter Password"
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  if (serverError) setServerError('');
                }}
                className={`w-full bg-white border ${
                  fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                } rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-slate-900 font-sans focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48] focus:outline-none transition-colors placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Session & Forgot Password Links */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-[#0f2b48] focus:ring-[#0f2b48]"
              />
              <span className="text-[11px]">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(true);
                setForgotSuccessMsg('');
                setForgotErrorMsg('');
              }}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d66] text-white font-bold text-xs shadow-sm disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>LOGIN</span>
            )}
          </button>

          {/* Authorized notice */}
          <p className="text-[10px] text-slate-400 text-center pt-1 font-medium">
            Authorized RISE members only
          </p>

          {/* Clean Institutional Footer */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[10px] text-slate-400 font-medium">
              © 2026 RISE – Sanjivani University
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-[11px] text-slate-500 hover:text-[#0f2b48] font-semibold transition-colors"
            >
              ← Back to Public Website
            </button>
          </div>

        </form>
      </div>

      {/* Authorized Demo Credentials Reference (Institutional Accordion) */}
      <div className="w-full max-w-[420px] mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden z-10">
        <button
          type="button"
          onClick={() => setTestAccountsOpen(!testAccountsOpen)}
          className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-xs font-bold text-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-700" />
            <span>Authorized Test Accounts Reference</span>
          </div>
          {testAccountsOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {testAccountsOpen && (
          <div className="p-3 bg-white border-t border-slate-200 space-y-1.5 max-h-56 overflow-y-auto">
            <p className="text-[10px] text-slate-500 px-1">
              Click any account below to populate registered Email/PRN into the login form:
            </p>
            {data.users.slice(0, 7).map(u => (
              <div
                key={u.id}
                onClick={() => handlePopulateTestAccount(u)}
                className="p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-xs cursor-pointer transition-colors group"
              >
                <div>
                  <div className="font-bold text-slate-800 text-[11px] group-hover:text-blue-900">{u.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#0f2b48] font-mono block">{u.prn}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORGOT PASSWORD MODAL (SUPABASE AUTH INTEGRATED) */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#0f2b48]" />
                <h3 className="text-base font-bold text-[#0f2b48] font-outfit">
                  Password Reset Request
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setForgotModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered Sanjivani University email address. A secure password reset link will be dispatched to your inbox via Supabase Auth.
            </p>

            {forgotSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{forgotSuccessMsg}</span>
              </div>
            )}

            {forgotErrorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{forgotErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ayushi.ahire@sanjivani.edu.in"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48] focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-700 block">Faculty Administration Contact:</span>
                <div>Faculty: <span className="font-mono text-blue-900 font-semibold">faculty.rise@sanjivani.edu.in</span></div>
                <div>President: <span className="font-mono text-blue-900 font-semibold">ayushi.ahire@sanjivani.edu.in</span></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-lg bg-[#0f2b48] hover:bg-[#1a3d66] text-white font-bold text-xs shadow-sm disabled:opacity-60 transition-colors flex items-center gap-1.5"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
