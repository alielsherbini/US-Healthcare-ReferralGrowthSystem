/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, ShieldAlert, RefreshCw, Save, ShieldCheck, Zap } from 'lucide-react';

export default function SettingsComponent() {
  const { 
    scoreWeights, updateScoreWeights, currentUserRole, setCurrentUserRole, resetData 
  } = useApp();

  // Internal states
  const [emailOpen, setEmailOpen] = useState(scoreWeights.email_open);
  const [videoView, setVideoView] = useState(scoreWeights.video_view);
  const [websiteVisit, setWebsiteVisit] = useState(scoreWeights.website_visit);
  const [saveShareComment, setSaveShareComment] = useState(scoreWeights.save_share_comment);
  const [formSubmission, setFormSubmission] = useState(scoreWeights.form_submission);
  const [reply, setReply] = useState(scoreWeights.reply);
  const [callBooking, setCallBooking] = useState(scoreWeights.call_booking);
  
  const [decayDays, setDecayDays] = useState(scoreWeights.decayDays);
  const [decayPercent, setDecayPercent] = useState(scoreWeights.decayPercent);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    updateScoreWeights({
      email_open: emailOpen,
      video_view: videoView,
      website_visit: websiteVisit,
      save_share_comment: saveShareComment,
      form_submission: formSubmission,
      reply,
      call_booking: callBooking,
      decayDays,
      decayPercent
    });
    alert('Lead scoring parameters updated successfully. CRM qualification scores recalculated.');
  };

  const handleReset = () => {
    if (confirm('WARNING: This will delete all custom leads, tasks, outreach logs, and reset settings back to default seed data. Proceed?')) {
      resetData();
      // Reload states
      setEmailOpen(1);
      setVideoView(2);
      setWebsiteVisit(3);
      setSaveShareComment(4);
      setFormSubmission(5);
      setReply(6);
      setCallBooking(10);
      setDecayDays(30);
      setDecayPercent(15);
      alert('Operating system database reset to default SoCal seed data.');
    }
  };

  // Roles list
  const roles = [
    { id: 'admin', title: 'Admin / Leadership', desc: 'Full access to dashboards, parameter weights, reporting benchmarks, and database resets.' },
    { id: 'coordinator', title: 'Marketing Coordinator', desc: 'Manage law firms, log engagements, coordinate tasks, schedules, and outreach guides.' },
    { id: 'content_manager', title: 'Content Manager', desc: 'Schedule assets, manage content calendar pillars, draft caption outlines, view metrics.' },
    { id: 'outreach_specialist', title: 'Outreach Specialist', desc: 'Manage LinkedIn-first connection queues, customize templates, log direct responses.' },
    { id: 'viewer', title: 'Viewer (Read-Only)', desc: 'Read-only access to CRM panels, double funnels, and executive growth reports.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-700" id="settings_module">
      
      {/* Sorter/Roles Simulator Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* User Role Simulation Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Operational Role Simulator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a simulated system profile to test how the operating system restricts or highlights view details:
            </p>
          </div>

          <div className="space-y-2.5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setCurrentUserRole(r.id as any)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3.5 ${currentUserRole === r.id ? 'bg-sky-50 border-sky-400 shadow-2xs' : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <div className="shrink-0 mt-0.5">
                  {currentUserRole === r.id ? <ShieldCheck className="w-5 h-5 text-sky-600 animate-pulse" /> : <div className="w-5 h-5 rounded-full border border-slate-300"></div>}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>{r.title}</span>
                    {currentUserRole === r.id && (
                      <span className="text-[9px] bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-mono font-bold uppercase">Active</span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Database Reset Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-rose-800">Developer Diagnostic Operations</h3>
              <p className="text-[11px] text-rose-700 mt-1">
                Wipe active localStorage parameters and restore default seed datasets.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow flex justify-center items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database to Seed Data</span>
          </button>
        </div>

      </div>

      {/* Sourcing Parameter Scorer Configurator Pane */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <form onSubmit={handleSaveWeights} className="space-y-4 text-xs font-sans">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Scoring Parameter Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize interaction weights and time-decay rules to calibrate automatic qualification thresholds.
            </p>
          </div>

          <div className="space-y-3 font-medium">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Email Open (pts)</label>
                <input
                  type="number"
                  value={emailOpen}
                  onChange={(e) => setEmailOpen(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Video View (pts)</label>
                <input
                  type="number"
                  value={videoView}
                  onChange={(e) => setVideoView(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Website Visit (pts)</label>
                <input
                  type="number"
                  value={websiteVisit}
                  onChange={(e) => setWebsiteVisit(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Share/Comment (pts)</label>
                <input
                  type="number"
                  value={saveShareComment}
                  onChange={(e) => setSaveShareComment(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Form Submit (pts)</label>
                <input
                  type="number"
                  value={formSubmission}
                  onChange={(e) => setFormSubmission(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Reply (pts)</label>
                <input
                  type="number"
                  value={reply}
                  onChange={(e) => setReply(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Call Booking (pts)</label>
              <input
                type="number"
                value={callBooking}
                onChange={(e) => setCallBooking(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              />
            </div>

            {/* Time decay rules */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Time-Decay Configurations</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Decay Interval (Days)</label>
                  <input
                    type="number"
                    value={decayDays}
                    onChange={(e) => setDecayDays(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Decay Factor (%)</label>
                  <input
                    type="number"
                    value={decayPercent}
                    onChange={(e) => setDecayPercent(parseInt(e.target.value) || 15)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug italic">
                A lead engaged {decayDays} days ago will have its interaction score weight reduced by {decayPercent}% over time.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-lg text-xs transition shadow flex justify-center items-center gap-1.5 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Update Parameters</span>
          </button>
        </form>
      </div>

    </div>
  );
}
