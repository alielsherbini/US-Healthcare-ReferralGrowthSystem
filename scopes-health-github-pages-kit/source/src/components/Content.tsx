/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContentItem } from '../types';
import { Calendar, Plus, MessageSquare, Eye, Share2, Award, Zap, Edit3, Trash2, ArrowRight } from 'lucide-react';

export default function Content() {
  const { contentItems, addContentItem, updateContentItem, deleteContentItem } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Content Form State
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<'Post' | 'Carousel' | 'Reel' | 'Graphic' | 'Article'>('Post');
  const [platform, setPlatform] = useState<'LinkedIn' | 'Instagram'>('LinkedIn');
  const [funnelStage, setFunnelStage] = useState<'awareness' | 'trust' | 'relationship' | 'conversion'>('trust');
  const [theme, setTheme] = useState('medical-legal collaboration');
  const [publishDate, setPublishDate] = useState('2026-06-28');
  const [contentBody, setContentBody] = useState('');

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addContentItem({
      title,
      format,
      platform,
      funnelStage,
      theme,
      publishDate,
      status: 'idea',
      assetLink: platform === 'LinkedIn' ? 'scopeshealth.com/assets/new' : 'instagram.com/scopes/new',
      contentBody
    });

    setTitle('');
    setContentBody('');
    setIsAddOpen(false);
  };

  const handleStatusChange = (item: ContentItem, newStatus: ContentItem['status']) => {
    // Simulating random analytics metrics if publishing
    const metrics = newStatus === 'published' 
      ? { impressions: Math.floor(Math.random() * 2500) + 500, engagementRate: parseFloat((Math.random() * 6 + 2).toFixed(1)), shares: Math.floor(Math.random() * 20) + 5, clicks: Math.floor(Math.random() * 80) + 10 }
      : item.metrics;

    updateContentItem({
      ...item,
      status: newStatus,
      metrics
    });
  };

  // Funnel Stage Mappings
  const mappings = [
    { stage: 'Awareness Content', target: 'Prospects & Visitors', description: 'Reels, team bios, behind-the-scenes clinic walk-throughs to build visible brand trust.', metrics: 'High Impression targets' },
    { stage: 'Trust Content', target: 'Leads & MQLs', description: 'Carousels detailing physical rehabilitation timelines, causal medical diagnoses.', metrics: 'High Comment & Save targets' },
    { stage: 'Relationship Content', target: 'SQLs', description: 'Detailed breakdowns on evaluating lien multipliers, patient coordinate logs.', metrics: 'High Click/Direct Message targets' },
    { stage: 'Conversion Content', target: 'Qualified Leads & Active Partners', description: 'Case study evidence, guaranteed report timelines (e.g. orthopedic narratives in 48 hours).', metrics: 'High Meeting Booked targets' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-700" id="content_module">
      {/* Sourcing/Sizing Content Pillars Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Content Sourcing & Strategy Guide */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">SCOPES Trust-Building Content Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">
              Social proof acts as the baseline credibility layer for SoCal attorneys. They verify our clinical expertise before agreeing to referrals. We map assets strategically based on the warming funnel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappings.map((map, idx) => (
              <div key={idx} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5 hover:border-sky-300 transition">
                <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">{map.stage}</span>
                <p className="text-xs font-bold text-slate-800">Audience: {map.target}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{map.description}</p>
                <p className="text-[10px] text-slate-400 font-mono">KPI: {map.metrics}</p>
              </div>
            ))}
          </div>

          {/* Sourcing Channel Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-500" /> Professional LinkedIn Themes
              </h3>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>Lien evaluation protocols & multipliers</li>
                <li>48-hour diagnostic report turnarounds</li>
                <li>Establishing medical causality logs</li>
                <li>Local SoCal legal-medical seminars</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-pink-500" /> Clinical Instagram Trust-Builders
              </h3>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>Concierge patient ride coordination reels</li>
                <li>Behind-the-scenes diagnostic lab walk-throughs</li>
                <li>Patient rehabilitation milestone diaries</li>
                <li>Meet our orthopedic surgeon board</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Pipeline / Calendar Sorter */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-800">Content Schedule Planner</h2>
            <button 
              onClick={() => setIsAddOpen(true)}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Asset Idea
            </button>
          </div>

          <div className="space-y-3">
            {contentItems.map((item) => (
              <div key={item.id} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/20 hover:bg-slate-50 transition flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${item.platform === 'LinkedIn' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-pink-50 text-pink-800 border border-pink-200'}`}>
                      {item.platform}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.2 rounded uppercase">
                      {item.format}
                    </span>
                    <span className="text-[10px] bg-sky-50 text-sky-800 font-bold px-1.5 py-0.2 rounded uppercase font-mono">
                      {item.funnelStage}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 italic">Theme: {item.theme}</p>
                  {item.contentBody && <p className="text-[11px] text-slate-600 leading-relaxed font-mono">{item.contentBody}</p>}
                </div>

                <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">Publish: {item.publishDate}</span>
                  
                  {/* Status Dropdowns */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : item.status === 'scheduled' ? 'bg-sky-100 text-sky-800' : item.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                      {item.status}
                    </span>
                    
                    {item.status !== 'published' && (
                      <button 
                        onClick={() => handleStatusChange(item, item.status === 'idea' ? 'draft' : item.status === 'draft' ? 'scheduled' : 'published')}
                        className="text-[10px] bg-slate-900 hover:bg-black text-white px-2 py-0.5 rounded font-bold"
                      >
                        {item.status === 'idea' ? 'Draft' : item.status === 'draft' ? 'Schedule' : 'Publish'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sourced Metrics Summary Panel (Right Side Pane) */}
      <div className="space-y-6">
        {/* Content Engagement Standouts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Published Analytics Highlights</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live engagement levels calculated from published assets.
            </p>
          </div>

          <div className="space-y-3">
            {contentItems
              .filter(c => c.status === 'published')
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{item.title}</h3>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded font-mono">
                      Eng: {item.metrics.engagementRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center font-mono">
                    <div className="bg-white p-1.5 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">Impressions</span>
                      <span className="text-xs font-bold text-slate-700">{item.metrics.impressions}</span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">Shares</span>
                      <span className="text-xs font-bold text-slate-700">{item.metrics.shares}</span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">Clicks</span>
                      <span className="text-xs font-bold text-slate-700">{item.metrics.clicks}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Content-to-Outreach Campaign Guidelines */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Alignment Guardrails</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Content strategy is not generic branding. Ensure every article or reel directly supports active outreach sequences:
          </p>
          <div className="text-[11px] text-slate-600 space-y-2 font-sans">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
              <p>When Sourcing specialists send Template 1 (SoCal orthopedic care), publish a **LinkedIn Post** on report turnarounds.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
              <p>When Outreach specialists send Template 2 (Value guide), ensure the **PDF download link** is live in settings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Sourced Content Asset</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Lien Mistakes PI Firms Make"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="Post">Post</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Reel">Reel</option>
                    <option value="Graphic">Graphic</option>
                    <option value="Article">Article</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Funnel Stage</label>
                  <select
                    value={funnelStage}
                    onChange={(e) => setFunnelStage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="awareness">Awareness</option>
                    <option value="trust">Trust</option>
                    <option value="relationship">Relationship</option>
                    <option value="conversion">Conversion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Strategic Theme</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. lien negotiation best practices"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Content Copy / Outline Draft</label>
                <textarea
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  rows={3}
                  placeholder="Write caption draft, outlines, visual guidelines..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium shadow"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
