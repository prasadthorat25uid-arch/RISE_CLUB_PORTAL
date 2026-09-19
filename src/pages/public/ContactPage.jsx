import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Globe, 
  MessageSquare, 
  Sparkles, 
  Building,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';

export const ContactPage = () => {
  const { submitContactMessage } = useData();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusState, setStatusState] = useState({ submitted: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusState({ submitted: false, error: '' });

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusState({ submitted: false, error: 'Please fill in all required fields (Name, Email, and Message).' });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatusState({ submitted: false, error: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactMessage(formData);
      setIsSubmitting(false);
      if (res.success) {
        setStatusState({ submitted: true, error: '' });
        setFormData({ fullName: '', email: '', subject: '', message: '' });
      } else {
        setStatusState({ submitted: false, error: res.message || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      setIsSubmitting(false);
      setStatusState({ submitted: false, error: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connect With RISE Society</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          Get in <span className="gradient-text-sun">Touch</span>
        </h1>
        <p className="text-sm text-slate-300">
          Reach out for research collaborations, industry sponsorships, student memberships, and guest lectures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Contact Information & Location Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Organization Info Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img 
                  src="./rise-logo.png" 
                  alt="RISE Emblem" 
                  className="w-12 h-12 object-contain rounded-2xl border border-amber-500/40 p-1 bg-slate-900" 
                />
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">RISE Society</h3>
                  <p className="text-xs text-amber-400 font-semibold">Sanjivani University</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Research & Innovation Society for Emerging Intelligence — Department of Integrated B.Tech, School of Engineering & Technology.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Campus Address</strong>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    Sanjivani University, Sahajanandnagar, Post Singnapur, Tal. Kopargaon, Dist. Ahmednagar, Maharashtra — 423603
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Official Emails</strong>
                  <p className="text-slate-400 mt-0.5 font-mono">rise@sanjivani.edu.in</p>
                  <p className="text-slate-400 font-mono">faculty.rise@sanjivani.edu.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Department Office</strong>
                  <p className="text-slate-400 mt-0.5">+91 (02423) 222862 / +91 98230 11223</p>
                </div>
              </div>

            </div>

            {/* Social Links */}
            <div className="border-t border-slate-800/80 pt-4">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-3">
                Follow & Connect Online
              </span>
              <div className="flex gap-2">
                <a 
                  href="https://github.com/rise-sanjivani" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com/school/sanjivani-university" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com/sanjivani_univ" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://sanjivani.edu.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all"
                  aria-label="University Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Send Us a Message</span>
              </h2>
              <p className="text-xs text-slate-400">
                Fill out the form below and our executive leadership or faculty coordinator will respond within 24–48 hours.
              </p>
            </div>

            {statusState.submitted && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-white block text-sm">Message sent successfully.</strong>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    Thank you for reaching out to RISE. Your inquiry has been registered and assigned to the relevant department coordinator.
                  </p>
                </div>
              </div>
            )}

            {statusState.error && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3">
                <span className="text-rose-400 font-bold">✕ Error:</span>
                <span>{statusState.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Ramesh Gupta or Priya Patil"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject / Inquiry Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Research Collaboration / Keynote Speaker Request"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Message <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide detailed information regarding your project proposal, research query, or inquiry..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to RISE</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
