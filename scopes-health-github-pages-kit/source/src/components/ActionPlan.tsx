/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { readStored, writeStored } from '../storage';
import { CheckSquare, Square, Calendar, Award, Compass, Zap, Flame, Check } from 'lucide-react';

interface Milestone {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  details: string;
  done: boolean;
}

const INITIAL_MILESTONES: Milestone[] = [
  // Week 1
  { id: 'm_w1_1', week: 1, title: 'Define Ideal Partner Profile (ICP)', details: 'Identify case managers, lien specialists, and attorneys across Southern California (Glendale, Irvine, Los Angeles).', done: true },
  { id: 'm_w1_2', week: 1, title: 'Set CRM Funnel Parameters', details: 'Define thresholds and score weights inside Settings (Email opens = 1pt, Call book = 10pts).', done: true },
  { id: 'm_w1_3', week: 1, title: 'Build Outreach Templates', details: 'Pre-load and test LinkedIn connection requests and value-first PDF guides.', done: true },
  { id: 'm_w1_4', week: 1, title: 'Prepare Content Themes', details: 'Establish clinical trust topics (patient transport, guaranteed report speed) and map to stages.', done: true },
  
  // Week 2
  { id: 'm_w2_1', week: 2, title: 'Launch LinkedIn-First Outreach', details: 'Send 10 personalized connection requests daily targeting case manager gatekeepers.', done: true },
  { id: 'm_w2_2', week: 2, title: 'Deploy Email Follow-ups', details: 'Follow up with connected attorneys by sharing physical rehabilitation case studies.', done: false },
  { id: 'm_w2_3', week: 2, title: 'Test Value-First Templates', details: 'Track reply rates of LinkedIn PDF guide offers vs direct meeting invitations.', done: false },
  { id: 'm_w2_4', week: 2, title: 'Seed Sourced Lead List', details: 'Maintain a minimum of 25 active personal injury law firm prospects.', done: true },
  
  // Week 3
  { id: 'm_w3_1', week: 3, title: 'Publish LinkedIn Authority Content', details: 'Share detailed post explaining how slow narratives drag down settlement timelines.', done: false },
  { id: 'm_w3_2', week: 3, title: 'Publish Instagram Reels', details: 'Introduce Dr. Vance and clinic facilities to build diagnostic trust.', done: false },
  { id: 'm_w3_3', week: 3, title: 'Align Content with Active Outreach', details: 'Ensure outreach messages mention the specific topics posted on our channels.', done: false },
  { id: 'm_w3_4', week: 3, title: 'Coordinate Outpatient Clinic Tours', details: 'Invite SQLs to inspect diagnostic labs and coordinate ride protocols.', done: false },

  // Week 4
  { id: 'm_w4_1', week: 4, title: 'Review Funnel Conversion Data', details: 'Analyze bottlenecks inside Reports (MQL-to-SQL drop-offs).', done: false },
  { id: 'm_w4_2', week: 4, title: 'Refine Sourcing Criteria', details: 'Filter out low-volume zip codes; focus outreach on Glendale and Pasadena.', done: false },
  { id: 'm_w4_3', week: 4, title: 'Calibrate Lead Scoring System', details: 'Adjust decay rates or interaction multipliers in Settings.', done: false },
  { id: 'm_w4_4', week: 4, title: 'Report Milestones to Leadership', details: 'Export partner referrals sheets and review first activated referral partner relationships.', done: false },
];

export default function ActionPlan() {
  const [milestones, setMilestones] = useState<Milestone[]>(() => readStored('scopes_milestones', INITIAL_MILESTONES));
  const [activeWeek, setActiveWeek] = useState<1 | 2 | 3 | 4>(2); // Default to Week 2 launch

  const toggleMilestone = (id: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, done: !m.done } : m);
    setMilestones(updated);
    writeStored('scopes_milestones', updated);
  };

  // Progress metrics
  const total = milestones.length;
  const completed = milestones.filter(m => m.done).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getWeekStatus = (weekNum: 1 | 2 | 3 | 4) => {
    const weekMiles = milestones.filter(m => m.week === weekNum);
    const doneMiles = weekMiles.filter(m => m.done);
    if (doneMiles.length === weekMiles.length) return 'Completed';
    if (doneMiles.length > 0) return 'In Progress';
    return 'Pending';
  };

  return (
    <div className="space-y-6 font-sans text-slate-700" id="action_plan_module">
      
      {/* Title with Overall Progress Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            30-Day Implementation Blueprint
          </h1>
          <p className="text-sm text-slate-500 font-sans">
            Strategic operational milestones designed to scale SCOPES Health personal injury partnerships.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="bento-card p-4 flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Blueprint Progress</span>
            <span className="text-sm font-bold text-slate-800 font-mono">{progressPercent}% Achieved</span>
          </div>
          <div className="w-24 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Week Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as const).map((weekNum) => {
          const status = getWeekStatus(weekNum);
          return (
            <button
              key={weekNum}
              onClick={() => setActiveWeek(weekNum)}
              className={`text-left p-4 rounded-xl border transition ${activeWeek === weekNum ? 'bg-blue-50/70 border-blue-400 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">Week {weekNum}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.2 rounded-full ${status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                  {status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 font-display">
                {weekNum === 1 ? 'Foundation Setup' : weekNum === 2 ? 'Launch Outreach' : weekNum === 3 ? 'Content Activation' : 'Optimization Review'}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Interactive Week Milestone List Checkbox list */}
      <div className="bento-card p-5 space-y-4">
        <div className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-xl p-4">
          <Compass className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-blue-800 font-display uppercase tracking-wider">
              Week {activeWeek} Operational Objectives
            </h3>
            <p className="text-[11px] text-blue-900 mt-1">
              {activeWeek === 1 ? 'Establish the ICP core. Pre-load standard connection scripts, and seed Settings thresholds.' : activeWeek === 2 ? 'Begin the LinkedIn-First connection campaigns. Follow connected profiles with direct messages.' : activeWeek === 3 ? 'Activate LinkedIn and Instagram schedules. Support outreach guides with corresponding educational reels.' : 'Audit conversions inside the CRM. Adjust multipliers, and export summaries.'}
            </p>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {milestones
            .filter(m => m.week === activeWeek)
            .map((mile) => (
              <div
                key={mile.id}
                onClick={() => toggleMilestone(mile.id)}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition"
              >
                <div className="shrink-0 mt-0.5">
                  {mile.done ? (
                    <div className="bg-emerald-500 text-white rounded p-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border border-slate-300 bg-white rounded transition hover:border-blue-500"></div>
                  )}
                </div>
                
                <div className="space-y-0.5">
                  <h3 className={`text-xs font-bold ${mile.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {mile.title}
                  </h3>
                  <p className={`text-[11px] ${mile.done ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                    {mile.details}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 30-Day Ecosystem Summary */}
      <div className="bento-card p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">SCOPES 30-Day Growth Statement</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Our operating system is built specifically to connect **Marketing, Outreach, Content, CRM, and Relationship coordinates** into one unified, repeatable engine. Maintain daily task checklists and weekly pipeline audits to lock in high-health SoCal law firm relationships.
        </p>
      </div>

    </div>
  );
}
