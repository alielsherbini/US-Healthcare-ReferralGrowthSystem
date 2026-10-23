/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Calendar, Award, BarChart2, CheckCircle, Clock, Percent, FileText } from 'lucide-react';

export default function Reports() {
  const { leads, tasks, contentItems } = useApp();
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'executive'>('weekly');

  // Math metrics compilation
  const totalLeads = leads.length;
  const activePartners = leads.filter(l => l.salesStage === 'active_partner').length;
  const referralPartners = leads.filter(l => l.salesStage === 'referral_partner').length;
  const totalReferrals = leads.reduce((acc, lead) => acc + lead.referralCount, 0);

  // Calculate funnel conversions
  const countProspects = leads.filter(l => l.marketingStage === 'prospect').length;
  const countVisitors = leads.filter(l => l.marketingStage === 'visitor').length;
  const countLeads = leads.filter(l => l.marketingStage === 'lead').length;
  const countMQLs = leads.filter(l => l.marketingStage === 'mql').length;
  const countSQLs = leads.filter(l => l.marketingStage === 'sql').length;

  // Cumulative Marketing Funnel logic (leads that reached or exceeded each stage)
  const sqls = countSQLs;
  const mqls = countMQLs + sqls;
  const leadsCount = countLeads + mqls;
  const visitors = countVisitors + leadsCount;
  const prospects = countProspects + visitors;

  // Cumulative Sales Funnel logic
  const countSalesSQLs = leads.filter(l => l.salesStage === 'sql').length;
  const countContacted = leads.filter(l => l.salesStage === 'contacted').length;
  const countEngaged = leads.filter(l => l.salesStage === 'engaged').length;
  const countMeetings = leads.filter(l => l.salesStage === 'meeting_booked').length;
  const countPartners = leads.filter(l => l.salesStage === 'referral_partner').length;
  const countActivePartners = leads.filter(l => l.salesStage === 'active_partner').length;

  const totalActivePartners = countActivePartners;
  const totalPartners = countPartners + totalActivePartners;
  const totalMeetings = countMeetings + totalPartners;
  const totalEngaged = countEngaged + totalMeetings;
  const totalContacted = countContacted + totalEngaged;
  const totalSQLsSales = countSalesSQLs + totalContacted;

  const mqlToSqlConv = mqls > 0 ? Math.round((sqls / mqls) * 100) : 0;
  const sqlToContactedConv = totalSQLsSales > 0 ? Math.round((totalContacted / totalSQLsSales) * 100) : 0;
  const sqlToPartnerConv = totalSQLsSales > 0 ? Math.round((totalPartners / totalSQLsSales) * 100) : 0;

  // Simulate spreadsheet download
  const handleExportCSV = () => {
    alert('Generating export package for Southern California PI Relationships...\n\n- scopes_referral_partners.csv: 25 Records compiled\n- scopes_pipeline_conversion_matrix.csv: Compiled\n- scopes_outreach_metrics_w4.csv: Compiled\n\nDownload completes instantly.');
  };

  return (
    <div className="space-y-6 font-sans text-slate-700" id="reports_module">
      
      {/* Title & Sorter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-sans">
            Executive Growth Reports
          </h1>
          <p className="text-sm text-slate-500 font-sans">
            Strategic performance metrics measuring marketing, outreach, and relationship health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sorter */}
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white text-slate-700 font-semibold"
          >
            <option value="weekly">Weekly Status Review</option>
            <option value="monthly">Monthly Pipeline Audit</option>
            <option value="executive">Executive Board Summary</option>
          </select>
          
          <button 
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-black text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid containing metrics grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1 */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Marketing Reach</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-slate-800 font-mono">14,820</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded font-mono">+12.5%</span>
          </div>
          <p className="text-[11px] text-slate-500">Combined LinkedIn & Instagram impressions during this period.</p>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Stage Conversions</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-slate-800 font-mono">{mqlToSqlConv}%</span>
            <span className="text-xs bg-sky-50 text-sky-700 font-bold px-1.5 py-0.2 rounded font-mono">Benchmark: 40%</span>
          </div>
          <p className="text-[11px] text-slate-500">MQL-to-SQL transition rate (warm leads showing brand-direct intent).</p>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active partner yield</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-slate-800 font-mono">{(totalReferrals / (activePartners || 1)).toFixed(1)}</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded font-mono">High Health</span>
          </div>
          <p className="text-[11px] text-slate-500">Average cases referred per active partner per quarter.</p>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-2xs space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Partner retention</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-slate-800 font-mono">94.2%</span>
            <span className="text-xs bg-violet-50 text-violet-700 font-bold px-1.5 py-0.2 rounded font-mono">LTV: $42K</span>
          </div>
          <p className="text-[11px] text-slate-500">Proportion of referred law firms sending a second case within 60 days.</p>
        </div>

      </div>

      {/* Conversion Breakdown Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">Conversion Benchmarks and Drop-offs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">MQL → SQL Conversion</span>
              <span className="text-sky-700 font-mono">{mqlToSqlConv}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
              <div className="bg-sky-500 h-full" style={{ width: `${mqlToSqlConv}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Attorneys warming up through value-first content checklists. Promotion occurs as they reply or ask for direct information.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">SQL → Contacted Conversion</span>
              <span className="text-sky-700 font-mono">{sqlToContactedConv}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${sqlToContactedConv}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Sales-qualified leads reaching target engagement benchmarks (&gt;10 pts), resulting in outbound touchpoints.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600">SQL → Active Partner Conversion</span>
              <span className="text-sky-700 font-mono">{sqlToPartnerConv}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${sqlToPartnerConv}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Proportion of sales-qualified targets scheduling discovery calls, signing agreements, and actively referring patients.
            </p>
          </div>

        </div>
      </div>

      {/* Sourced Executive Summary report body */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-sky-600" />
          <h2 className="text-sm font-semibold">Narrative Analysis: Quarter Growth Audit</h2>
        </div>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>Southern California Sourcing Context:</strong> Our relationship outreach is concentrated in high-value, dense personal injury litigation markets (Glendale, Westside Los Angeles, Pasadena, Irvine, and San Jolla). Glendale represents our largest referral volume (sarah Barton), while Beverly Hills (Rebecca Stern) yields the highest spinal fusion case coordinates.
          </p>
          <p>
            <strong>Core Recommendation:</strong> The Marketing Funnel is warming prospects efficiently, but the SQL-to-Qualified transition indicates a minor roadblock. Attorneys engage with LinkedIn guides but hesitate to book direct introductory Zoom demos. We must enforce Template 4 (Value coffee demo) and prioritize sending clinical team summaries during Week 3 routines.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2 font-mono">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 animate-pulse" />
            <span>Audit Compiled by Alex Coordinator • Verified on June 25, 2026</span>
          </div>
        </div>
      </div>

    </div>
  );
}
