import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Users, 
  Calendar, 
  Megaphone, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';

export const SecretaryDashboard = ({ setActiveTab }) => {
  const { data, addToast, addActivityLog } = useData();
  const { currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('meetings');

  const [meetings, setMeetings] = useState([
    {
      id: 'meet-1',
      title: 'RISE Core Committee Bi-Weekly Research Review',
      date: '2026-09-20',
      time: '04:00 PM – 05:30 PM',
      venue: 'SET Conference Room B',
      agenda: 'Evaluation of upcoming conference submissions & member onboarding progress',
      status: 'Upcoming'
    },
    {
      id: 'meet-2',
      title: 'Department of Integrated B.Tech Research Advisory Meeting',
      date: '2026-09-08',
      time: '03:00 PM – 04:30 PM',
      venue: 'Faculty Boardroom',
      agenda: 'Semester timeline alignment and lab hardware allocations',
      status: 'Completed'
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'RISE Constitution & Operational Bylaws 2026-2027',
      category: 'Governance Policy',
      updatedAt: '2026-06-01',
      size: '2.4 MB'
    },
    {
      id: 'doc-2',
      title: 'Student Research Ethics & Patent Disclosure Guidelines',
      category: 'Research Standards',
      updatedAt: '2026-07-15',
      size: '1.8 MB'
    },
    {
      id: 'doc-3',
      title: 'Minutes of Meeting - General Body Assembly #01',
      category: 'Meeting Minutes',
      updatedAt: '2026-08-05',
      size: '940 KB'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '04:00 PM',
    venue: 'SET Conference Hall',
    agenda: ''
  });

  const handleSaveMeeting = (e) => {
    e.preventDefault();
    if (!meetingForm.title) return;

    const newMeeting = {
      id: `meet-${Date.now()}`,
      ...meetingForm,
      status: 'Upcoming'
    };

    setMeetings([newMeeting, ...meetings]);
    addToast(`Meeting notice "${meetingForm.title}" recorded!`, 'success');
    addActivityLog('Meeting Notice Created', currentUser.name, meetingForm.title, 'Created official RISE meeting schedule.');
    setModalOpen(false);
    setMeetingForm({ title: '', date: '', time: '', venue: '', agenda: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/50 relative overflow-hidden bg-gradient-to-r from-cyan-950/70 via-slate-900 to-amber-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              SECRETARY ADMINISTRATION & ARCHIVES
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Official Records, Meeting Minutes & Governance
            </h1>
            <p className="text-xs text-slate-300">
              Maintaining Institutional Documentation, Assembly Schedules, Records & Proceedings
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Meeting Notice</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Scheduled Meetings</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{meetings.length}</div>
          <div className="text-[10px] text-cyan-300">Active Records</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Official Documents</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{documents.length}</div>
          <div className="text-[10px] text-purple-300">Governance Files</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Society Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.users?.length || 11}</div>
          <div className="text-[10px] text-amber-300">Active Register</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Audit Logs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{data.activityLogs?.length || 20}</div>
          <div className="text-[10px] text-emerald-300">Verified Actions</div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('meetings')}
          className={`pb-3 transition-colors ${activeSubTab === 'meetings' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          Meeting Notices & Agendas
        </button>
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`pb-3 transition-colors ${activeSubTab === 'documents' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          Governance Documents & Bylaws
        </button>
      </div>

      {/* Meetings Section */}
      {activeSubTab === 'meetings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => (
              <div key={m.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    m.status === 'Upcoming' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {m.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{m.date}</span>
                </div>

                <h3 className="text-base font-bold text-white font-outfit">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-amber-400">Agenda:</strong> {m.agenda}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>{m.time} • {m.venue}</span>
                  <button 
                    onClick={() => addToast(`Minutes archive for "${m.title}" opened.`, 'info')}
                    className="text-amber-400 hover:text-amber-300 font-bold"
                  >
                    View Minutes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {activeSubTab === 'documents' && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4">File Size</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {documents.map(d => (
                  <tr key={d.id} className="hover:bg-slate-900/60">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{d.title}</span>
                    </td>
                    <td className="p-4 text-purple-300">{d.category}</td>
                    <td className="p-4 text-slate-400 font-mono">{d.updatedAt}</td>
                    <td className="p-4 font-mono text-slate-300">{d.size}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => addToast(`Downloading ${d.title}...`, 'success')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MEETING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveMeeting} className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">Issue Official Meeting Notice</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Meeting Title *</label>
              <input
                type="text"
                required
                value={meetingForm.title}
                onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={meetingForm.date}
                  onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                <input
                  type="text"
                  value={meetingForm.time}
                  onChange={e => setMeetingForm({ ...meetingForm, time: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Venue</label>
              <input
                type="text"
                value={meetingForm.venue}
                onChange={e => setMeetingForm({ ...meetingForm, venue: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Agenda Details</label>
              <textarea
                rows={3}
                required
                value={meetingForm.agenda}
                onChange={e => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default SecretaryDashboard;
