/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, MeetingLog } from '../types';
import { Calendar, PhoneCall, Video, Award, Users, AlertCircle, CheckCircle, Plus } from 'lucide-react';

export default function Meetings() {
  const { leads, addLeadMeeting } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || 'l1');
  
  // Form State
  const [meetingType, setMeetingType] = useState<'Discovery Call' | 'Intro Meeting' | 'Follow-up'>('Discovery Call');
  const [outcome, setOutcome] = useState('Firm agreed to refer orthopedic and spine cases.');
  const [notes, setNotes] = useState('');
  const [objections, setObjections] = useState('Concerned about reporting delays.');
  const [opportunities, setOpportunities] = useState('Offered guaranteed 48-hour orthopedic narratives.');

  // Check off standard attorney objections
  const objectionsDatabase = [
    { key: 'reports', title: 'Slow Medical narratives', handling: 'Offer our guaranteed 48-hour turnaround with text-alerts upon completion.' },
    { key: 'distance', title: 'Patient travel worries', handling: 'Demonstrate our concierge patient ride program coordinating rides within 1 hour notice.' },
    { key: 'multipliers', title: 'Inconsistent billing multipliers', handling: 'Commit to standard, predictable lien billing multipliers vetted by SoCal trial experts.' },
    { key: 'coordination', title: 'Fragmented therapy/diagnostics', handling: 'Highlight that SCOPES manages diagnostics, physical therapy, and spinal/ortho surgery under one roof.' }
  ];

  const handleLogMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    addLeadMeeting(selectedLeadId, {
      date: new Date().toISOString().split('T')[0],
      type: meetingType,
      outcome,
      notes: notes || 'Discovery session logged successfully.',
      objections,
      opportunities
    });

    setNotes('');
    setOutcome('');
    alert('Meeting Logged and CRM updated.');
  };

  // Compile all past meetings
  const allMeetings = leads.reduce((acc: { leadName: string; city: string; meeting: MeetingLog }[], lead) => {
    lead.meetingHistory.forEach(meeting => {
      acc.push({
        leadName: lead.firmName,
        city: lead.city,
        meeting
      });
    });
    return acc;
  }, []).sort((a, b) => b.meeting.date.localeCompare(a.meeting.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-700" id="meetings_module">
      {/* Sourcing Objection Handling Framework */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Objection Sizing Handbook */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Attorney Objection Handling Playbook</h2>
            <p className="text-xs text-slate-500 mt-1">
              Trial attorneys are risk-averse. Use these predefined value propositions to address friction points:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectionsDatabase.map((obj, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5 hover:border-indigo-200 transition">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Objection: {obj.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  <strong>Our Answer:</strong> {obj.handling}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Logs list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Relationship History & Completed Meetings</h2>
          
          <div className="space-y-3">
            {allMeetings.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/20 hover:bg-slate-50 transition flex items-start gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-indigo-700 shrink-0">
                  {item.meeting.type === 'Discovery Call' ? <PhoneCall className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </div>
                
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {item.meeting.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.meeting.date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">{item.leadName} ({item.city}, CA)</h3>
                  <p className="text-[11px] text-emerald-800 font-bold">Outcome: {item.meeting.outcome}</p>
                  <p className="text-[11px] text-slate-600 font-sans">{item.meeting.notes}</p>
                  
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100/60 pt-1.5 mt-2 text-[10px] text-slate-500 font-sans">
                    <div>
                      <span className="font-bold text-slate-600 block">Objections Overcame:</span>
                      <p className="italic">{item.meeting.objections}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600 block">Opportunities:</span>
                      <p className="italic">{item.meeting.opportunities}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {allMeetings.length === 0 && (
              <p className="text-[11px] text-slate-400 italic py-6 text-center">No meetings logged yet. Use the log panel to register introductory calls.</p>
            )}
          </div>
        </div>

      </div>

      {/* Sourcing Interactive Meeting Logger Pane (Right Column) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <form onSubmit={handleLogMeeting} className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Register Sourced Meeting</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Log an introductory call or orthopedic clinic demo with a partner.
            </p>
          </div>

          {/* Select Lead */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Law Firm Sourced</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700 font-medium"
            >
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.firmName} ({lead.contactName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Type */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Meeting Type</label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
            >
              <option value="Discovery Call">Discovery Call (Intro)</option>
              <option value="Intro Meeting">Intro Meeting (Demo)</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* Objections Raised */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Objection Raised</label>
            <select
              value={objections}
              onChange={(e) => setObjections(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
            >
              <option value="None">None (Highly interested)</option>
              <option value="Concerned about orthopedic narrative delays.">Slow narratives (Reporting speed)</option>
              <option value="Worried patients might travel too far to clinics.">Patient travel (Clinic locations)</option>
              <option value="Demands strict Predictable lien billing multipliers.">Predictable billing multipliers</option>
              <option value="Concerned about physical rehab coordinate logs.">Fragmented diagnostics & rehab</option>
            </select>
          </div>

          {/* Opportunities Offered */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Answer / Opportunity Offered</label>
            <input
              type="text"
              value={opportunities}
              onChange={(e) => setOpportunities(e.target.value)}
              placeholder="e.g. Vented standard multipliers"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
            />
          </div>

          {/* Outcome */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Meeting Outcome *</label>
            <input
              type="text"
              required
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white text-slate-700"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Internal Discussion Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add key highlights, case counts, follow-up timelines..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition shadow flex justify-center items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save Sourced Meeting Log</span>
          </button>
        </form>
      </div>
    </div>
  );
}
