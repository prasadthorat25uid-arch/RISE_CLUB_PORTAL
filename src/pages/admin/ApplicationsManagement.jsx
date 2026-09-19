import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, UserX, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const ApplicationsManagement = () => {
  const { data, approveApplication, rejectApplication } = useData();
  const { currentUser } = useAuth();

  const pendingApps = data.applications.filter(a => a.status === 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">Research Club Interview Selection Queue</h1>
          <p className="text-xs text-slate-400">
            Student → Interview → Selection → Member Profile & Account Created (PRN + Private Password)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingApps.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No pending interview selection applications.
          </div>
        ) : (
          pendingApps.map(app => (
            <div key={app.id} className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                  <p className="text-xs text-amber-400 font-mono">PRN: {app.prn} | Submitted: {app.submittedDate}</p>
                  <p className="text-xs text-slate-300">{app.department} ({app.academicYear} - {app.division})</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Pipeline: {app.interviewStatus || 'Pending Interview'}
                </span>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <p><strong className="text-slate-400">Research Interests:</strong> {app.researchInterests}</p>
                <p><strong className="text-slate-400">Technical Skills:</strong> {app.technicalSkills}</p>
                <p><strong className="text-slate-400">Reason to Join:</strong> {app.reasonToJoin}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => rejectApplication(app.id, currentUser.name)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800/50 hover:bg-rose-900"
                >
                  Decline Selection
                </button>

                <button
                  onClick={() => approveApplication(app.id, currentUser.name)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md hover:brightness-110 flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Interview Passed: Select & Create Account</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
