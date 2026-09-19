import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Search,
  X
} from 'lucide-react';

export const EventCoordinatorDashboard = () => {
  const { data, addToast, addActivityLog } = useData();
  const { currentUser } = useAuth();

  const [eventsList, setEventsList] = useState(() => data.events || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM – 01:00 PM',
    location: 'SET Seminar Hall A, Sanjivani University',
    organizer: currentUser?.name || 'Sairaj Tambe',
    description: '',
    registrationLink: 'https://forms.gle/sanjivani-rise-event',
    maxSeats: 120,
    registeredCount: 0,
    status: 'Upcoming'
  });

  const upcomingEvents = eventsList.filter(e => e.status === 'Upcoming').length;
  const completedEvents = eventsList.filter(e => e.status === 'Completed').length;
  const totalEvents = eventsList.length;
  const totalRegistrations = eventsList.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingItem(event);
      setFormData({
        title: event.title,
        category: event.category || 'Workshop',
        date: event.date,
        time: event.time || '10:00 AM',
        location: event.location || 'SET Seminar Hall',
        organizer: event.organizer || currentUser?.name,
        description: event.description || '',
        registrationLink: event.registrationLink || '',
        maxSeats: event.maxSeats || 100,
        registeredCount: event.registeredCount || 0,
        status: event.status || 'Upcoming'
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'Workshop',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM – 01:00 PM',
        location: 'SET Advanced Computing Lab, Sanjivani University',
        organizer: currentUser?.name || 'Sairaj Tambe',
        description: '',
        registrationLink: 'https://forms.gle/sanjivani-rise-event',
        maxSeats: 120,
        registeredCount: 0,
        status: 'Upcoming'
      });
    }
    setModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingItem) {
      const updated = eventsList.map(ev => ev.id === editingItem.id ? { ...ev, ...formData } : ev);
      setEventsList(updated);
      addToast(`Event "${formData.title}" updated successfully!`, 'success');
      addActivityLog('Event Updated', currentUser.name, formData.title, 'Updated event details and venue.');
    } else {
      const newEvt = {
        id: `evt-${Date.now()}`,
        ...formData
      };
      setEventsList([newEvt, ...eventsList]);
      addToast(`Event "${formData.title}" created & published!`, 'success');
      addActivityLog('Event Created', currentUser.name, formData.title, 'Published new society event.');
    }
    setModalOpen(false);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete event "${title}"?`)) {
      setEventsList(eventsList.filter(e => e.id !== id));
      addToast(`Event "${title}" deleted.`, 'warning');
      addActivityLog('Event Deleted', currentUser.name, title, 'Deleted event.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-rose-500/50 relative overflow-hidden bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              EVENT COORDINATOR OPERATIONS PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Hackathons, Workshops & Symposium Logistics
            </h1>
            <p className="text-xs text-slate-300">
              Managing Event Scheduling, Venue Allotment, Registration Portals & Attendance
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Upcoming Events</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{upcomingEvents}</div>
          <div className="text-[10px] text-rose-300">Scheduled Next</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Completed Events</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{completedEvents}</div>
          <div className="text-[10px] text-emerald-300">Archived Successfully</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Total Events</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalEvents}</div>
          <div className="text-[10px] text-amber-300">Annual Pipeline</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">Event Registrations</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-outfit">{totalRegistrations}</div>
          <div className="text-[10px] text-cyan-300">Attendees Count</div>
        </div>
      </div>

      {/* Events Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsList.map((evt) => (
          <div key={evt.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-rose-500/40 transition-all">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40">
                {evt.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                evt.status === 'Upcoming' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {evt.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-outfit">{evt.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{evt.date} • {evt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="truncate">{evt.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Registrations: {evt.registeredCount || 0} / {evt.maxSeats || 100}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              {evt.registrationLink && (
                <a
                  href={evt.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Form Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => handleOpenModal(evt)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Edit Event"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(evt.id, evt.title)}
                  className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleSaveEvent} className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-outfit">
                {editingItem ? 'Edit Event Details' : 'Create & Schedule New Event'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Symposium">Symposium</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Guest Lecture">Guest Lecture</option>
                  <option value="Research Talk">Research Talk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  placeholder="10:00 AM – 01:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Venue / Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Registration Link (Google Form / Portal)</label>
              <input
                type="url"
                value={formData.registrationLink}
                onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Event Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default EventCoordinatorDashboard;
