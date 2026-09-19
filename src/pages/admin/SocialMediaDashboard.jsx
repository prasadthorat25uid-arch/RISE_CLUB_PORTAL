import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Megaphone, 
  Share2, 
  Image, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Instagram, 
  Linkedin, 
  Github, 
  Calendar,
  X
} from 'lucide-react';

export const SocialMediaDashboard = () => {
  const { data, createAnnouncement, addToast } = useData();
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      title: 'IEEE Emerging Intelligence Research Paper Spotlight',
      platform: 'LinkedIn & Instagram',
      link: 'https://linkedin.com/company/rise-sanjivani',
      date: '2026-09-18',
      likes: 184,
      status: 'Published'
    },
    {
      id: 'post-2',
      title: 'National Robotics Hackathon 2026 Registration Announcement',
      platform: 'All Channels',
      link: 'https://instagram.com/rise_sanjivani',
      date: '2026-09-15',
      likes: 290,
      status: 'Published'
    },
    {
      id: 'post-3',
      title: 'Welcome New Research Club Members Batch 2026',
      platform: 'Instagram Story & Carousel',
      link: 'https://instagram.com/rise_sanjivani',
      date: '2026-09-10',
      likes: 312,
      status: 'Published'
    }
  ]);

  const [newPostModal, setNewPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    platform: 'LinkedIn',
    link: 'https://linkedin.com/company/rise-sanjivani'
  });

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!postForm.title) return;

    const newEntry = {
      id: `post-${Date.now()}`,
      title: postForm.title,
      platform: postForm.platform,
      link: postForm.link,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      status: 'Published'
    };

    setPosts([newEntry, ...posts]);
    addToast('Social media campaign registered successfully!', 'success');
    setNewPostModal(false);
    setPostForm({ title: '', platform: 'LinkedIn', link: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SOCIAL MEDIA & PUBLICITY HEAD PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Publicity, Media Hub & Brand Engagement
            </h1>
            <p className="text-xs text-slate-300">
              Managing Social Media Broadcasts, Research Spotlights, Media Galleries & Outreaches
            </p>
          </div>

          <button
            onClick={() => setNewPostModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign Post</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Posts</span>
            <Share2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{posts.length}</div>
          <div className="text-[10px] text-amber-300">Live Campaigns</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Announcements</span>
            <Megaphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.announcements?.length || 4}</div>
          <div className="text-[10px] text-purple-300">Public Bulletins</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Events to Promote</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.events?.filter(e=>e.status==='Upcoming').length || 2}</div>
          <div className="text-[10px] text-rose-300">Upcoming Highlights</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Recent Media</span>
            <Image className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">24</div>
          <div className="text-[10px] text-cyan-300">Assets & Posters</div>
        </div>
      </div>

      {/* Social Media Channels Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="glass-panel p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">LinkedIn Official</h4>
              <p className="text-[10px] text-slate-400">RISE Sanjivani University</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="glass-panel p-4 rounded-2xl border border-pink-500/30 flex items-center justify-between hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Instagram Page</h4>
              <p className="text-[10px] text-slate-400">@rise_sanjivani</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href="https://github.com/prasadthorat25uid-arch/RISE_CLUB_PORTAL"
          target="_blank"
          rel="noreferrer"
          className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex items-center justify-between hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">GitHub Organization</h4>
              <p className="text-[10px] text-slate-400">RISE Open Source Repos</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* Campaigns Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-outfit">Active Publicity Campaigns & Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Campaign Title</th>
                <th className="p-4">Channel / Platform</th>
                <th className="p-4">Date</th>
                <th className="p-4">Engagement / Impressions</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-slate-900/60">
                  <td className="p-4 font-bold text-white">{p.title}</td>
                  <td className="p-4 text-amber-400">{p.platform}</td>
                  <td className="p-4 text-slate-400 font-mono">{p.date}</td>
                  <td className="p-4 text-emerald-400 font-bold">{p.likes} interactions</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {newPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAddPost} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Register Social Media Post</h3>
              <button type="button" onClick={() => setNewPostModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Post Caption / Headline *</label>
              <input
                type="text"
                required
                value={postForm.title}
                onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Platform</label>
              <select
                value={postForm.platform}
                onChange={e => setPostForm({ ...postForm, platform: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter / X">Twitter / X</option>
                <option value="GitHub">GitHub</option>
                <option value="All Channels">All Channels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Post URL</label>
              <input
                type="url"
                value={postForm.link}
                onChange={e => setPostForm({ ...postForm, link: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewPostModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Save Post
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default SocialMediaDashboard;
