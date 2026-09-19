import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  X, 
  Ticket, 
  ExternalLink,
  Award
} from 'lucide-react';

export const EventsPage = () => {
  const { data, registerForEvent } = useData();
  const [activeTab, setActiveTabState] = useState('Upcoming'); // 'Upcoming' | 'Completed' | 'All'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredMap, setRegisteredMap] = useState({});

  const events = data.events || [];

  const filteredEvents = events.filter(evt => {
    if (evt.visibility === 'Private' || evt.visibility === 'Internal') return false;

    const matchesTab = activeTab === 'All' || evt.status === activeTab;
    const matchesSearch = 
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleEventRegistration = (eventId, eventTitle) => {
    registerForEvent(eventId, { registeredAt: new Date().toISOString() });
    setRegisteredMap(prev => ({ ...prev, [eventId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Workshops, Symposia & Hackathons</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit">
          Society <span className="gradient-text-sun">Events</span>
        </h1>
        <p className="text-sm text-slate-300">
          Participate in national conferences, hands-on PyTorch workshops, competitive hackathons, and guest lectures hosted by RISE.
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by Event Title, Topic, Venue, or Organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex gap-2">
            {['Upcoming', 'Completed', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTabState(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab === 'Upcoming' ? '📅 Upcoming Events' : tab === 'Completed' ? '✓ Completed Events' : 'All Events'}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Found <strong className="text-white">{filteredEvents.length}</strong> events
          </span>
        </div>

      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-outfit">No events found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching event tabs or clear your search terms.
          </p>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredMap[evt.id];
          const isCompleted = evt.status === 'Completed';

          return (
            <div
              key={evt.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              {/* Event Banner Image */}
              {evt.image && (
                <div className="h-48 w-full overflow-hidden relative bg-slate-900">
                  <img 
                    src={evt.image} 
                    alt={evt.title || evt.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                      {evt.type || evt.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                      isCompleted 
                        ? 'bg-slate-900/90 text-slate-300 border border-slate-700' 
                        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {isCompleted ? 'Completed' : '● Registration Open'}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2">
                  <h3 
                    onClick={() => setSelectedEvent(evt)}
                    className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer leading-snug"
                  >
                    {evt.title || evt.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Logistics Badges */}
                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Date & Time:</strong> {evt.date} | {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Venue:</strong> {evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Organizer:</strong> {evt.organizer}</span>
                  </div>
                  {evt.coordinator && (
                    <div className="flex items-center gap-2.5 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span>Coordinators: {evt.coordinator}</span>
                    </div>
                  )}
                </div>

                {/* Registration & Details Actions */}
                <div className="pt-2 flex items-center gap-3">
                  {!isCompleted ? (
                    <button
                      onClick={() => handleEventRegistration(evt.id, evt.title || evt.name)}
                      disabled={isRegistered}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                        isRegistered
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>✓ Registered Successfully</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>Register for Event</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500 font-semibold">
                      Event Concluded
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs font-bold text-slate-300 hover:text-white transition-all"
                  >
                    Details
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                  {selectedEvent.type || selectedEvent.category}
                </span>
                <h3 className="text-xl font-bold text-white font-outfit pt-1">
                  {selectedEvent.title || selectedEvent.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEvent.image && (
              <div className="h-56 w-full rounded-2xl overflow-hidden">
                <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Event Overview & Agenda</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedEvent.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-500 block">Date & Time</span>
                <strong className="text-white">{selectedEvent.date} ({selectedEvent.time})</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Venue</span>
                <strong className="text-white">{selectedEvent.venue}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Organizer</span>
                <strong className="text-white">{selectedEvent.organizer}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Coordinators</span>
                <strong className="text-amber-400">{selectedEvent.coordinator}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {selectedEvent.status !== 'Completed' ? (
                <button
                  onClick={() => {
                    handleEventRegistration(selectedEvent.id, selectedEvent.title || selectedEvent.name);
                    setSelectedEvent(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-md hover:brightness-110"
                >
                  Confirm Registration
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
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

export default EventsPage;
