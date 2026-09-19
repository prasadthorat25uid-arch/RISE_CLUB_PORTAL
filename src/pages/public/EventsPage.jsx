import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

export const EventsPage = () => {
  const { data, addToast } = useData();
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleRegister = (evtName) => {
    if (registeredEvents.includes(evtName)) {
      addToast(`Already registered for ${evtName}`, 'info');
      return;
    }
    setRegisteredEvents(prev => [...prev, evtName]);
    addToast(`Successfully registered for ${evtName}! Details sent to university email.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-white font-outfit">
          RISE <span className="gradient-text-sun">Events & Workshops</span>
        </h1>
        <p className="text-xs text-slate-400">National Symposia, Hands-on Technical Bootcamps, and Hackathons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.events.map(evt => (
          <div key={evt.id} className="glass-panel p-6 rounded-3xl space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {evt.type}
              </span>
              <span className="text-xs font-semibold text-emerald-400">● Registration Open</span>
            </div>

            <h3 className="text-lg font-bold text-white">{evt.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

            <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span><strong>Date & Time:</strong> {evt.date} | {evt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span><strong>Venue:</strong> {evt.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span><strong>Coordinator:</strong> {evt.coordinator}</span>
              </div>
            </div>

            <button
              onClick={() => handleRegister(evt.name)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                registeredEvents.includes(evt.name)
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md'
              }`}
            >
              {registeredEvents.includes(evt.name) ? '✓ Registered' : 'Register Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
