import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Layers,
  Sparkles,
  Award,
  Search,
  X
} from 'lucide-react';

export const ResearchHeadDashboard = () => {
  const { data, addToast, addActivityLog } = useData();
  const { currentUser } = useAuth();

  const [researchList, setResearchList] = useState(() => data.research || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    leadAuthor: currentUser?.name || 'Shweta Pawar',
    journal: 'IEEE Transactions on Artificial Intelligence',
    doi: '10.1109/TAI.2026.1045234',
    status: 'Published',
    date: new Date().toISOString().split('T')[0],
    paperUrl: 'https://arxiv.org/abs/2403.12345',
    abstract: ''
  });

  const totalResearch = researchList.length;
  const publishedPapers = researchList.filter(r => r.status === 'Published').length;
  const underReview = researchList.filter(r => r.status === 'Under Review').length;
  const ongoingResearch = researchList.filter(r => r.status === 'Ongoing').length;

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        leadAuthor: item.leadAuthor,
        journal: item.journalOrConference || item.journal || '',
        doi: item.doiLink || item.doi || '',
        status: item.status,
        date: item.date || item.publishedDate || new Date().toISOString().split('T')[0],
        paperUrl: item.paperUrl || '',
        abstract: item.abstract || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        leadAuthor: currentUser?.name || 'Shweta Pawar',
        journal: 'IEEE / Springer Emerging Intelligence',
        doi: '10.1109/TAI.2026.' + Math.floor(Math.random() * 90000 + 10000),
        status: 'Ongoing',
        date: new Date().toISOString().split('T')[0],
        paperUrl: '',
        abstract: ''
      });
    }
    setModalOpen(true);
  };

  const handleSaveResearch = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingItem) {
      const updated = researchList.map(r => r.id === editingItem.id ? { ...r, ...formData } : r);
      setResearchList(updated);
      addToast(`Research paper "${formData.title}" updated successfully!`, 'success');
      addActivityLog('Research Updated', currentUser.name, formData.title, 'Updated publication info and DOI.');
    } else {
      const newItem = {
        id: `res-${Date.now()}`,
        ...formData,
        citations: 0
      };
      setResearchList([newItem, ...researchList]);
      addToast(`New research paper "${formData.title}" added to repository!`, 'success');
      addActivityLog('Research Added', currentUser.name, formData.title, 'Registered paper in RISE publication index.');
    }
    setModalOpen(false);
  };

  const handleDeleteResearch = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setResearchList(researchList.filter(r => r.id !== id));
      addToast(`Research paper "${title}" removed.`, 'warning');
      addActivityLog('Research Deleted', currentUser.name, title, 'Deleted paper from repository.');
    }
  };

  const filteredResearch = researchList.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.leadAuthor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.journal?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-purple-500/50 relative overflow-hidden bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              RESEARCH HEAD MANAGEMENT PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Scientific Publications & Literature Repository
            </h1>
            <p className="text-xs text-slate-300">
              Managing Author Tracks, Journal Submissions, Preprints & DOI Registrations
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Research Paper</span>
          </button>
        </div>
      </div>

      {/* 5 Research Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Research</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalResearch}</div>
          <div className="text-[10px] text-purple-300">Indexed Studies</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Published Papers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{publishedPapers}</div>
          <div className="text-[10px] text-emerald-300">Peer Reviewed & In Print</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{underReview}</div>
          <div className="text-[10px] text-amber-300">Journal & Conf Review</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Ongoing Research</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{ongoingResearch}</div>
          <div className="text-[10px] text-cyan-300">Active Lab Pipelines</div>
        </div>
      </div>

      {/* Research Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Title, Author, Journal, DOI..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Research Table: Title | Author | Journal | DOI | Status | Date | Actions */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Lead Author</th>
                <th className="p-4">Journal / Conference</th>
                <th className="p-4">DOI</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredResearch.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4 font-bold text-white max-w-xs">{item.title}</td>
                  <td className="p-4 text-slate-300">{item.leadAuthor}</td>
                  <td className="p-4 text-purple-300">{item.journal || item.journalOrConference || 'IEEE / Springer'}</td>
                  <td className="p-4 font-mono text-amber-400">{item.doi || item.doiLink || 'Pending'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      item.status === 'Published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' :
                      item.status === 'Under Review' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{item.date || item.publishedDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.paperUrl && (
                        <a
                          href={item.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Open Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/50"
                        title="Edit Research"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResearch(item.id, item.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
                        title="Delete Research"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT RESEARCH MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveResearch} className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">
                {editingItem ? 'Edit Research Paper' : 'Register New Research Paper'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paper Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lead Author *</label>
                <input
                  type="text"
                  required
                  value={formData.leadAuthor}
                  onChange={e => setFormData({ ...formData, leadAuthor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Published">Published</option>
                  <option value="Patent Filed">Patent Filed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Journal / Conference</label>
                <input
                  type="text"
                  value={formData.journal}
                  onChange={e => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">DOI Link / Identifier</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={e => setFormData({ ...formData, doi: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paper URL / Preprint Link</label>
              <input
                type="url"
                value={formData.paperUrl}
                onChange={e => setFormData({ ...formData, paperUrl: e.target.value })}
                placeholder="https://arxiv.org/abs/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                Save Paper
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ResearchHeadDashboard;
