import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sparkles, Send, CheckCircle2, UserPlus } from 'lucide-react';

export const JoinRisePage = ({ setActiveTab }) => {
  const { submitApplication } = useData();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    prn: '',
    email: '',
    phone: '',
    department: 'Integrated B.Tech',
    academicYear: 'Year 1',
    division: 'Class A',
    researchInterests: '',
    technicalSkills: '',
    areasOfInterest: '',
    reasonToJoin: '',
    previousProjects: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.prn || !formData.email) {
      alert("Please fill in Full Name, PRN, and Email.");
      return;
    }

    submitApplication(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Application Submitted Successfully!</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-2 leading-relaxed text-left">
          <p className="font-bold text-amber-400">Next Steps in RISE Onboarding Pipeline:</p>
          <p>1. Faculty Coordinator & Authorized Student Leadership review your application.</p>
          <p>2. Upon approval, your official Member ID (e.g. RISE-2026-XXX) will be generated.</p>
          <p>3. Account activation credentials will be sent to your Sanjivani email.</p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setActiveTab('home');
          }}
          className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 text-slate-950 text-xs hover:bg-amber-400 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white font-outfit">
          Join <span className="gradient-text-sun">RISE Society</span>
        </h1>
        <p className="text-xs text-slate-400">
          Official Membership Application for Academic Year 2026–2027 (Department of Integrated B.Tech)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
        
        {/* Personal & Academic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Personal & Academic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aaditya Patil"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student ID / PRN *</label>
              <input
                type="text"
                required
                placeholder="e.g. PRN2026045"
                value={formData.prn}
                onChange={e => setFormData({ ...formData, prn: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="student@sanjivani.edu.in"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
              <select
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Year 1">Integrated B.Tech - Year 1</option>
                <option value="Year 2">Integrated B.Tech - Year 2</option>
                <option value="Year 3">Integrated B.Tech - Year 3</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Division / Class</label>
              <input
                type="text"
                placeholder="Class A"
                value={formData.division}
                onChange={e => setFormData({ ...formData, division: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Research & Technical Background */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Research & Technical Background
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Research Interests</label>
              <input
                type="text"
                placeholder="e.g. Generative AI, Computer Vision, Edge Devices"
                value={formData.researchInterests}
                onChange={e => setFormData({ ...formData, researchInterests: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills & Languages</label>
              <input
                type="text"
                placeholder="e.g. Python, PyTorch, C++, ROS2, Figma"
                value={formData.technicalSkills}
                onChange={e => setFormData({ ...formData, technicalSkills: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Why do you want to join RISE?</label>
              <textarea
                rows={3}
                placeholder="Describe your research goals and contribution interest..."
                value={formData.reasonToJoin}
                onChange={e => setFormData({ ...formData, reasonToJoin: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Membership Application</span>
        </button>

      </form>
    </div>
  );
};
