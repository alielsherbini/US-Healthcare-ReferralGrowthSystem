/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, OutreachTemplate } from '../types';
import { Send, Copy, Check, Linkedin, Mail, ExternalLink, RefreshCw, Eye, MessageSquare, Award } from 'lucide-react';

export default function Outreach() {
  const { templates, leads, updateTemplate, currentUserRole } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 't1');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || 'l1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId);
  const activeLead = leads.find(l => l.id === selectedLeadId);

  // Parse variables in template body
  const getParsedBody = (template: OutreachTemplate, lead?: Lead) => {
    if (!lead) return template.body;
    let text = template.body;
    text = text.replace(/{{ContactName}}/g, lead.contactName.split(',')[0]);
    text = text.replace(/{{FirmName}}/g, lead.firmName);
    text = text.replace(/{{OwnerName}}/g, lead.owner);
    return text;
  };

  const getParsedSubject = (template: OutreachTemplate, lead?: Lead) => {
    if (!lead || !template.subject) return template.subject || '';
    let text = template.subject;
    text = text.replace(/{{ContactName}}/g, lead.contactName.split(',')[0]);
    text = text.replace(/{{FirmName}}/g, lead.firmName);
    text = text.replace(/{{OwnerName}}/g, lead.owner);
    return text;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Outreach Philosophy Highlights
  const sequences = [
    { step: 'Step 1', action: 'LinkedIn Connection Request', target: 'Attorneys / Case Managers', details: 'Template 1: Under 300 characters, completely non-salesy, focus purely on connecting SoCal PI professionals.', channel: 'LinkedIn' },
    { step: 'Step 2', action: 'Value-First Message (2-3 days later)', target: 'Connected Contacts', details: 'Template 2: Deliver immediate helpful resources, e.g. a free PDF guide on "Evaluating Complex Lien Cases" or medical causation checklists.', channel: 'LinkedIn' },
    { step: 'Step 3', action: 'Direct Email Follow-up', target: 'Unresponsive or warm leads', details: 'Template 3: Detail SCOPES’s guaranteed 48-hour orthopedic report turnarounds. Highlight our dedicated lien desks.', channel: 'Email' },
    { step: 'Step 4', action: 'Meeting Request', target: 'High Qualification Scores (&gt;15 pts)', details: 'Template 4: Direct, professional invitation to coordinate diagnostics or view a 10-minute orthopedic coordinator dashboard.', channel: 'Email' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-700" id="outreach_module">
      
      {/* Sourcing Framework: LinkedIn-First Guide */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bento-card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">SCOPES Strategic Outreach Flow</h2>
            <p className="text-xs text-slate-500 mt-1">
              For personal injury attorneys and negotiators, standard cold-calling registers as transactional pressure. We utilize a LinkedIn-First sequence built to deliver value before asking for meetings.
            </p>
          </div>

          <div className="space-y-3">
            {sequences.map((seq, i) => (
              <div key={i} className="flex gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg h-fit shrink-0 font-mono">
                  {seq.step}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-800 font-display">{seq.action}</h3>
                    {seq.channel === 'LinkedIn' ? (
                      <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                        <Linkedin className="w-2.5 h-2.5" /> LinkedIn
                      </span>
                    ) : (
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                        <Mail className="w-2.5 h-2.5" /> Email
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Target: {seq.target}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{seq.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Insight */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-[11px] text-emerald-800 leading-relaxed flex items-start gap-2.5">
            <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Why This Works for SoCal Law Firms:</strong> Personal Injury attorneys are protective of their client rosters. Providing clear checklists on lien evaluations establishes SCOPES as a helpful medical-legal expert rather than another medical vendor.
            </div>
          </div>
        </div>

        {/* Template performance dashboard */}
        <div className="bento-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">Template Engagement Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Connection Rate</span>
              <span className="text-lg font-bold text-slate-800 font-mono">62.4%</span>
            </div>
            <div className="border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Value PDF Accept</span>
              <span className="text-lg font-bold text-slate-800 font-mono">41.8%</span>
            </div>
            <div className="border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Email Open Rate</span>
              <span className="text-lg font-bold text-slate-800 font-mono">54.2%</span>
            </div>
            <div className="border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Intro Call Book</span>
              <span className="text-lg font-bold text-slate-800 font-mono">18.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing/Sizing Template Customizer Pane */}
      <div className="bento-card p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">Outreach Personalization Lab</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize, test, and copy messaging templates directly parsed for any target SoCal firm.
            </p>
          </div>

          {/* Select Lead */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase block font-display">Target Law Firm</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
            >
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.firmName} ({lead.contactName.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Select Template */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase block font-display">Outreach Template</label>
            <div className="flex flex-col gap-1.5">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`text-left p-2.5 rounded-xl text-xs font-semibold border transition ${selectedTemplateId === t.id ? 'bg-blue-50/70 border-blue-400 text-blue-800 shadow-2xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-display font-bold">{t.name}</span>
                    <span className="text-[9px] opacity-75 font-mono font-bold uppercase">{t.channel}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal truncate">{t.purpose}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parsed Output Preview */}
        {activeTemplate && activeLead && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Live Preview Output</span>
              {activeTemplate.channel === 'LinkedIn' ? (
                <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded font-mono">LinkedIn</span>
              ) : (
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded font-mono">Email</span>
              )}
            </div>

            {/* Subject if email */}
            {activeTemplate.channel === 'Email' && activeTemplate.subject && (
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Subject line</span>
                <span className="text-xs font-bold text-slate-800">{getParsedSubject(activeTemplate, activeLead)}</span>
              </div>
            )}

            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Message body</span>
              <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-white border border-slate-200 p-2.5 rounded-lg max-h-[220px] overflow-y-auto">
                {getParsedBody(activeTemplate, activeLead)}
              </pre>
            </div>

            <button
              onClick={() => handleCopy(getParsedBody(activeTemplate, activeLead), activeTemplate.id)}
              className="w-full text-center bg-slate-900 hover:bg-black text-white py-2 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1.5 shadow"
            >
              {copiedId === activeTemplate.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === activeTemplate.id ? 'Copied to Clipboard!' : 'Copy Personalized Draft'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
