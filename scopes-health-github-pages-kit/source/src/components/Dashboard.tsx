/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, FunnelStage, SalesStage } from '../types';
import { TrendingUp, Users, Send, Calendar, AlertTriangle, ArrowRight, Award, Flame, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { leads, tasks, contentItems } = useApp();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Calculate metrics
  // 1) Marketing Funnel Stages (discrete current counts)
  const countProspects = leads.filter(l => l.marketingStage === 'prospect').length;
  const countVisitors = leads.filter(l => l.marketingStage === 'visitor').length;
  const countLeads = leads.filter(l => l.marketingStage === 'lead').length;
  const countMQLs = leads.filter(l => l.marketingStage === 'mql').length;
  const countSQLs = leads.filter(l => l.marketingStage === 'sql').length;

  // Cumulative Marketing Funnel logic (leads that reached or exceeded each stage)
  const totalSQLs = countSQLs;
  const totalMQLs = countMQLs + totalSQLs;
  const totalLeads = countLeads + totalMQLs;
  const totalVisitors = countVisitors + totalLeads;
  const totalProspects = countProspects + totalVisitors;

  // 2) Sales Funnel Stages (discrete current counts)
  const countSalesSQLs = leads.filter(l => l.salesStage === 'sql').length;
  const countContacted = leads.filter(l => l.salesStage === 'contacted').length;
  const countEngaged = leads.filter(l => l.salesStage === 'engaged').length;
  const countMeetings = leads.filter(l => l.salesStage === 'meeting_booked').length;
  const countPartners = leads.filter(l => l.salesStage === 'referral_partner').length;
  const countActivePartners = leads.filter(l => l.salesStage === 'active_partner').length;

  // Cumulative Sales Funnel logic
  const totalActivePartners = countActivePartners;
  const totalPartners = countPartners + totalActivePartners;
  const totalMeetings = countMeetings + totalPartners;
  const totalEngaged = countEngaged + totalMeetings;
  const totalContacted = countContacted + totalEngaged;
  const totalSQLsSales = countSalesSQLs + totalContacted;

  // Outreach Metrics
  const totalOutreachLogs = leads.reduce((acc, lead) => acc + lead.outreachHistory.length, 0);
  const totalReplies = leads.reduce((acc, lead) => acc + lead.outreachHistory.filter(o => o.status === 'replied').length, 0);
  const replyRate = totalOutreachLogs > 0 ? Math.round((totalReplies / totalOutreachLogs) * 100) : 0;

  // Content Metrics
  const totalPublished = contentItems.filter(c => c.status === 'published').length;
  const avgEngagement = contentItems.filter(c => c.status === 'published').length > 0
    ? (contentItems.filter(c => c.status === 'published').reduce((acc, c) => acc + c.metrics.engagementRate, 0) / totalPublished).toFixed(1)
    : '0';

  // Task Completion
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Referrals Count
  const totalReferrals = leads.reduce((acc, l) => acc + l.referralCount, 0);

  // Strategic Insights
  // Identify Pipeline Bottlenecks
  const getBottleneck = () => {
    // Check conversion drop-offs
    const mktCount = totalProspects + totalVisitors + totalLeads + totalMQLs + totalSQLs;
    const salesCount = totalSQLs + totalContacted + totalEngaged + totalMeetings + totalPartners + totalActivePartners;
    
    if (totalMQLs > 0 && totalSQLs < totalMQLs / 2) {
      return {
        stage: 'MQL → SQL Drop-off',
        description: 'Attorneys are engaging with general content but aren’t yet responding to brand-direct outreach. Increase value-first content sharing.',
        impact: 'High'
      };
    }
    if (totalMeetings < totalEngaged / 3) {
      return {
        stage: 'Engagement → Meeting Deficit',
        description: 'Law firms are replying to messages but scheduling is stalling. Offer a dedicated 10-minute orthopedic coordinator demo.',
        impact: 'Critical'
      };
    }
    if (totalActivePartners < totalPartners / 2) {
      return {
        stage: 'Partner Activation Lag',
        description: 'Law firms have signed up as partners but are not sending consistent referrals. Needs case liaison touchpoints.',
        impact: 'Medium'
      };
    }
    return {
      stage: 'Top Funnel Pipeline Stagnation',
      description: 'Prospect pool is high, but conversion to visitors is slow. Increase LinkedIn connection volume.',
      impact: 'Low'
    };
  };

  const bottleneck = getBottleneck();

  // Top Performing Channels
  const getBestChannel = () => {
    const sources: Record<string, { count: number; activePartners: number }> = {};
    leads.forEach(l => {
      if (!sources[l.leadSource]) sources[l.leadSource] = { count: 0, activePartners: 0 };
      sources[l.leadSource].count++;
      if (l.salesStage === 'active_partner' || l.salesStage === 'referral_partner') {
        sources[l.leadSource].activePartners++;
      }
    });

    let bestSource = 'LinkedIn Outreach';
    let maxPartners = 0;
    Object.entries(sources).forEach(([src, stats]) => {
      if (stats.activePartners > maxPartners) {
        maxPartners = stats.activePartners;
        bestSource = src;
      }
    });

    return {
      channel: bestSource,
      stats: `${maxPartners} Active Referral Partners`
    };
  };

  const bestChannel = getBestChannel();

  // Next 7 Days Priorities
  const upcomingPriorities = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Overdue tasks
  const overdueTasksCount = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date('2026-06-25')).length;

  return (
    <div className="space-y-6" id="dashboard_module">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Referral Growth Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-sans">
            Real-time operating metrics for SCOPES Health law firm relationships.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-100 rounded-xl px-3.5 py-1.5 text-xs text-blue-700 font-mono">
          <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>System Time: June 25, 2026</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Prospects</span>
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{leads.length}</div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14% this month</span>
            </p>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">SQL Leads</span>
            <div className="bg-blue-50 border border-blue-100 p-1.5 rounded-lg text-blue-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{totalSQLs}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Ready for Sales Funnel</p>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">Outreach Sent</span>
            <div className="bg-amber-50 border border-amber-100 p-1.5 rounded-lg text-amber-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{totalOutreachLogs}</div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <span>{replyRate}% Reply Rate</span>
            </p>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Partners</span>
            <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{totalActivePartners}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">{totalPartners - totalActivePartners} in onboarding</p>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">Referrals Captured</span>
            <div className="bg-violet-50 border border-violet-100 p-1.5 rounded-lg text-violet-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{totalReferrals}</div>
            <p className="text-[10px] text-violet-600 font-bold mt-1">Avg 2.8 per partner</p>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">Task Completion</span>
            <div className="bg-rose-50 border border-rose-100 p-1.5 rounded-lg text-rose-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">{taskCompletionRate}%</div>
            <p className="text-[10px] text-rose-600 font-bold mt-1">
              {overdueTasksCount > 0 ? `${overdueTasksCount} overdue tasks` : 'All tasks on track'}
            </p>
          </div>
        </div>
      </div>

      {/* Double Funnel Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bento-card lg:col-span-2 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4 font-display uppercase tracking-wider">
            SCOPES Two-System Pipeline Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marketing Funnel */}
            <div className="space-y-3 bg-slate-50/50 rounded-xl p-4 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">A) Marketing Funnel</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded font-mono font-bold">
                  Total: {totalProspects}
                </span>
              </div>
              <div className="space-y-2 font-sans">
                {[
                  { label: 'Prospects', value: totalProspects, color: 'bg-slate-300' },
                  { label: 'Visitors', value: totalVisitors, color: 'bg-indigo-300' },
                  { label: 'Leads', value: totalLeads, color: 'bg-indigo-400' },
                  { label: 'MQLs', value: totalMQLs, color: 'bg-sky-400' },
                  { label: 'SQLs', value: totalSQLs, color: 'bg-sky-500 font-bold' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center text-xs">
                    <span className="w-28 text-slate-600 font-semibold truncate">{item.label}</span>
                    <div className="flex-1 bg-slate-200/60 h-6 rounded overflow-hidden relative flex items-center px-2">
                      <div
                        className={`${item.color} h-full absolute left-0 top-0 transition-all duration-500`}
                        style={{ width: `${totalProspects > 0 ? (item.value / totalProspects) * 100 : 0}%` }}
                      ></div>
                      <span className="relative z-10 text-[10px] font-bold text-slate-800 ml-1">
                        {item.value} ({totalProspects > 0 ? Math.round((item.value / totalProspects) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="space-y-3 bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-display">B) Sales Funnel</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-mono font-bold">
                  Total: {totalSQLsSales}
                </span>
              </div>
              <div className="space-y-2 font-sans">
                {[
                  { label: 'SQLs', value: totalSQLsSales, color: 'bg-sky-500' },
                  { label: 'Contacted', value: totalContacted, color: 'bg-amber-400' },
                  { label: 'Engaged', value: totalEngaged, color: 'bg-amber-500' },
                  { label: 'Meeting Booked', value: totalMeetings, color: 'bg-indigo-500 text-white' },
                  { label: 'Referral Partner', value: totalPartners, color: 'bg-emerald-500 text-white' },
                  { label: 'Active Partner', value: totalActivePartners, color: 'bg-emerald-600 text-white font-bold' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center text-xs">
                    <span className="w-28 text-slate-600 font-semibold truncate">{item.label}</span>
                    <div className="flex-1 bg-slate-100 h-6 rounded overflow-hidden relative flex items-center px-2">
                      <div
                        className={`${item.color} h-full absolute left-0 top-0 transition-all duration-500`}
                        style={{ width: `${totalSQLsSales > 0 ? (item.value / totalSQLsSales) * 100 : 0}%` }}
                      ></div>
                      <span className="relative z-10 text-[10px] font-bold text-slate-800 ml-1">
                        {item.value} ({totalSQLsSales > 0 ? Math.round((item.value / totalSQLsSales) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Funnel Flow Narrative */}
          <p className="mt-4 text-[11px] text-slate-500 italic text-center">
            Separating the Funnels allows us to build legal-medical trust without immediate sales pressure.
          </p>
        </div>

        {/* Executive Insights Panel */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 font-display uppercase tracking-wider">
              Strategic Health Check
            </h2>
            
            <div className="space-y-4">
              {/* Bottleneck Alert */}
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-rose-800">Bottleneck: {bottleneck.stage}</h3>
                    <span className="text-[9px] bg-rose-200 text-rose-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                      {bottleneck.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 mt-1">{bottleneck.description}</p>
                </div>
              </div>

              {/* Best Performing Channel */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-800 font-display">Best Referral Source</h3>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">{bestChannel.channel}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{bestChannel.stats}</p>
                </div>
              </div>

              {/* Top Content Type */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-indigo-800 font-display">Top Content Format</h3>
                  <p className="text-[11px] text-indigo-700 font-medium mt-0.5">LinkedIn Educational Carousels</p>
                  <p className="text-[10px] text-indigo-600 font-semibold">Average Engagement Rate: 6.8%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4">
            <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide text-[10px]">Immediate System Priorities</h3>
            <div className="space-y-2">
              {upcomingPriorities.map((task) => (
                <div key={task.id} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-semibold truncate max-w-[150px]">{task.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 font-semibold">{task.dueDate}</span>
                </div>
              ))}
              {upcomingPriorities.length === 0 && (
                <p className="text-[11px] text-slate-400 italic">No pending tasks for the next 7 days.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Multi-Charts and Relationship Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG Outreach Activity Chart */}
        <div className="bento-card p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-2 font-display uppercase tracking-wider">
            Weekly Business Development Outreach
          </h2>
          <p className="text-xs text-slate-500 mb-4 font-sans">
            Compare sent outreach efforts against firm reply rates to monitor engagement efficiency.
          </p>
          
          {/* Custom SVG Bar Chart */}
          <div className="w-full h-56 flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="40" y1="170" x2="380" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Y Axis labels */}
              <text x="15" y="24" className="text-[9px] font-mono fill-slate-400 font-semibold">40</text>
              <text x="15" y="64" className="text-[9px] font-mono fill-slate-400 font-semibold">25</text>
              <text x="15" y="104" className="text-[9px] font-mono fill-slate-400 font-semibold">15</text>
              <text x="15" y="144" className="text-[9px] font-mono fill-slate-400 font-semibold">5</text>
              <text x="15" y="174" className="text-[9px] font-mono fill-slate-400 font-semibold">0</text>

              {/* Data Bars */}
              {/* Week 1: 12 sent, 3 replied */}
              <rect x="70" y="120" width="16" height="50" rx="3" fill="#cbd5e1" />
              <rect x="88" y="155" width="16" height="15" rx="3" fill="#2563eb" />
              {/* Week 2: 24 sent, 8 replied */}
              <rect x="130" y="80" width="16" height="90" rx="3" fill="#cbd5e1" />
              <rect x="148" y="130" width="16" height="40" rx="3" fill="#2563eb" />
              {/* Week 3: 35 sent, 15 replied */}
              <rect x="190" y="45" width="16" height="125" rx="3" fill="#cbd5e1" />
              <rect x="208" y="100" width="16" height="70" rx="3" fill="#2563eb" />
              {/* Week 4 (Current): 28 sent, 16 replied */}
              <rect x="250" y="60" width="16" height="110" rx="3" fill="#cbd5e1" />
              <rect x="268" y="90" width="16" height="80" rx="3" fill="#2563eb" />
              {/* Projection Week: 40 sent, 25 replied */}
              <rect x="310" y="30" width="16" height="140" rx="3" fill="#94a3b8" strokeDasharray="2,2" />
              <rect x="328" y="70" width="16" height="100" rx="3" fill="#60a5fa" />

              {/* X Axis labels */}
              <text x="85" y="188" className="text-[9px] font-bold text-center fill-slate-600 font-sans" textAnchor="middle">W1 (Found)</text>
              <text x="145" y="188" className="text-[9px] font-bold text-center fill-slate-600 font-sans" textAnchor="middle">W2 (Launch)</text>
              <text x="205" y="188" className="text-[9px] font-bold text-center fill-slate-600 font-sans" textAnchor="middle">W3 (Active)</text>
              <text x="265" y="188" className="text-[9px] font-bold text-center fill-slate-600 font-sans" textAnchor="middle">W4 (Optim)</text>
              <text x="325" y="188" className="text-[9px] font-bold text-center fill-slate-500 font-sans" textAnchor="middle">W5 (Proj)</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex justify-center items-center gap-6 mt-2 text-xs font-sans">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 rounded"></div>
              <span className="text-slate-600 font-medium">Messages/Outreach Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-slate-600 font-medium">Active Law Firm Replies</span>
            </div>
          </div>
        </div>

        {/* Partner Relationship Health Matrix */}
        <div className="bento-card p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">
              Referral Partner Relationship Matrix
            </h2>
            <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Health Indicator
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-sans">
            Displays registered referral partners mapped by relationship strength, responsiveness, and actual referral output.
          </p>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {leads
              .filter(l => l.salesStage === 'active_partner' || l.salesStage === 'referral_partner')
              .sort((a, b) => b.referralCount - a.referralCount)
              .map((partner) => {
                const getHealthColor = (strength: number, resp: number) => {
                  const avg = (strength + resp) / 2;
                  if (avg >= 4.5) return 'bg-emerald-500';
                  if (avg >= 3.5) return 'bg-blue-500';
                  return 'bg-amber-500';
                };

                return (
                  <div
                    key={partner.id}
                    className="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${getHealthColor(partner.relationshipStrength, partner.responsiveness)}`}></div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 font-sans">{partner.firmName}</h3>
                        <p className="text-[10px] text-slate-500 font-sans">Contact: {partner.contactName} ({partner.title})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                      <div className="text-xs font-sans">
                        <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Strength/Resp</span>
                        <span className="font-bold text-slate-700 font-mono">
                          {partner.relationshipStrength}★ / {partner.responsiveness}★
                        </span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                        <span className="text-[9px] text-emerald-700 block text-center font-bold uppercase">Referrals</span>
                        <span className="font-bold text-emerald-800 font-mono text-xs text-center block">
                          {partner.referralCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
