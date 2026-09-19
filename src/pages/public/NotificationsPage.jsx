import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, Megaphone, Calendar, Clock, Sparkles } from 'lucide-react';

export const NotificationsPage = () => {
  const { data, addToast } = useData();
  const { currentUser } = useAuth();

  const notifications = [
    {
      id: 'notif-1',
      title: 'Call for Papers: IEEE Emerging Intelligence 2026',
      message: 'Paper draft submissions are open. Research members must submit literature reviews by October 15th.',
      time: '2 hours ago',
      type: 'research',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'National Robotics Hackathon 2026 Logistics Notice',
      message: 'Venue allocation finalized in SET Advanced Computing Lab. Core team assembly on September 22nd.',
      time: '1 day ago',
      type: 'event',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Welcome New Interview-Selected Members',
      message: 'Member ID and private authentication credentials have been generated for selected candidates.',
      time: '3 days ago',
      type: 'general',
      unread: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white font-outfit">Notifications Center</h1>
          <p className="text-xs text-slate-400">Society announcements, task alerts, and interview updates</p>
        </div>
        <button
          onClick={() => addToast('All notifications marked as read.', 'info')}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className={`glass-panel p-5 rounded-2xl border transition-all ${
              n.unread ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-outfit">{n.title}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationsPage;
