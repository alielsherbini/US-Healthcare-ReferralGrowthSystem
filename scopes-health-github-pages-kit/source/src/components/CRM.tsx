/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, FunnelStage, SalesStage, Interaction, OutreachLog, MeetingLog } from '../types';
import { 
  Search, Filter, Plus, ArrowUpDown, ChevronRight, User, Globe, MapPin, Mail, Phone, 
  Linkedin, Award, Flame, Calendar, PlusCircle, Check, AlertCircle, Edit3, Trash2, 
  Archive, FileText, CheckSquare, Settings, Zap, Download, Upload, Copy, Compass
} from 'lucide-react';

export default function CRM() {
  const { 
    leads, addLead, updateLead, deleteLead, addLeadInteraction, addLeadOutreach, addLeadMeeting, scoreWeights 
  } = useApp();

  // Navigation / Views
  const [activeTab, setActiveTab] = useState<'table' | 'kanban' | 'prospecting'>('table');
  const [kanbanMode, setKanbanMode] = useState<'marketing' | 'sales'>('marketing');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'referrals' | 'newest'>('score');
  
  // Selected Lead Details Pane
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Modals / Sourcing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form States (Quick Add)
  const [newFirmName, setNewFirmName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newTitle, setNewTitle] = useState('Senior Case Manager');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newCity, setNewCity] = useState('Glendale');
  const [newPracticeArea, setNewPracticeArea] = useState('Personal Injury');
  const [newLeadSource, setNewLeadSource] = useState('LinkedIn Outreach');
  const [newMarketingStage, setNewMarketingStage] = useState<FunnelStage>('prospect');
  const [newSalesStage, setNewSalesStage] = useState<SalesStage>('sql');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('PI Cases, SoCal');

  // Interactive interaction logging states
  const [interactionType, setInteractionType] = useState<'email_open' | 'video_view' | 'website_visit' | 'save_share_comment' | 'form_submission' | 'reply' | 'call_booking'>('email_open');
  const [outreachType, setOutreachType] = useState<'LinkedIn Connection' | 'LinkedIn Message' | 'Email Follow-up' | 'Value-First Share' | 'Meeting Request' | 'Phone Call'>('LinkedIn Connection');
  const [outreachStatus, setOutreachStatus] = useState<'sent' | 'replied' | 'no_response'>('sent');
  const [outreachNotes, setOutreachNotes] = useState('');
  
  const [meetingType, setMeetingType] = useState<'Discovery Call' | 'Intro Meeting' | 'Follow-up'>('Discovery Call');
  const [meetingOutcome, setMeetingOutcome] = useState('Agreed on referral rules.');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingObjections, setMeetingObjections] = useState('None');
  const [meetingOpportunities, setMeetingOpportunities] = useState('Fast patient rehabilitation schedules.');

  // AI assistant mockup simulator
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);

  // Get Southern California Cities list
  const southernCaliforniaCities = ['Glendale', 'Irvine', 'Los Angeles', 'San Diego', 'Anaheim', 'Pasadena', 'Santa Monica', 'Torrance', 'Beverly Hills', 'Corona', 'Oceanside', 'Ventura', 'La Jolla'];

  // Process data
  const filteredLeads = leads
    .filter(lead => {
      const matchSearch = 
        lead.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCity = cityFilter === 'All' || lead.city === cityFilter;
      const matchStage = stageFilter === 'All' || 
        lead.marketingStage === stageFilter || 
        lead.salesStage === stageFilter;

      return matchSearch && matchCity && matchStage;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.qualificationScore - a.qualificationScore;
      if (sortBy === 'name') return a.firmName.localeCompare(b.firmName);
      if (sortBy === 'referrals') return b.referralCount - a.referralCount;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  // Handle Quick Add
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName || !newContactName) return;

    addLead({
      firmName: newFirmName,
      contactName: newContactName,
      title: newTitle,
      email: newEmail || `${newContactName.toLowerCase().replace(' ', '')}@${newFirmName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: newPhone || '213-555-0100',
      website: newWebsite || `www.${newFirmName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      linkedIn: newLinkedIn || `linkedin.com/in/${newContactName.toLowerCase().replace(' ', '-')}`,
      city: newCity,
      state: 'CA',
      practiceArea: newPracticeArea,
      leadSource: newLeadSource,
      marketingStage: newMarketingStage,
      salesStage: newSalesStage,
      owner: 'Alex Coordinator',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'active',
      notes: newNotes,
      lastContactDate: null,
      nextFollowUpDate: null,
      referralCount: 0,
      relationshipStrength: 1,
      responsiveness: 1
    });

    // Reset Form
    setNewFirmName('');
    setNewContactName('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Generate Personalized AI Message Simulator
  const handleAiPersonalize = () => {
    if (!selectedLead) return;
    setIsAiGenerating(true);
    setAiGeneratedMessage('');

    setTimeout(() => {
      const isCM = selectedLead.title.toLowerCase().includes('manager') || selectedLead.title.toLowerCase().includes('coordinator');
      const roleFocus = isCM ? 'streamlining patient rehabilitation documentation and coordination' : 'guaranteeing standard predictable orthopedic billing and causation narratives';
      const promptText = `Hi ${selectedLead.contactName.split(' ')[0]},\n\nI was reviewing ${selectedLead.firmName}’s incredible work in personal injury across ${selectedLead.city}. \n\nAt SCOPES Health, we focus on helping SoCal firms by ${roleFocus}.\n\nI’d love to send you our latest 1-page guide on speedier lien negotiations. Would this be helpful for your team?\n\nBest,\nAlex (SCOPES Health Liaison)`;
      
      setAiGeneratedMessage(promptText);
      setIsAiGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiGeneratedMessage);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // Stage promotions
  const handleStageChange = (lead: Lead, mktStage: FunnelStage, sStage: SalesStage) => {
    updateLead({
      ...lead,
      marketingStage: mktStage,
      salesStage: sStage
    });
  };

  // Add referrals
  const handleReferralIncrement = (lead: Lead) => {
    updateLead({
      ...lead,
      referralCount: lead.referralCount + 1,
      salesStage: 'active_partner'
    });
  };

  return (
    <div className="space-y-6" id="crm_module">
      {/* Module Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-sans">
            Lead Database & Pipeline Sourcing
          </h1>
          <p className="text-sm text-slate-500 font-sans">
            Manage Southern California personal injury law firms, track scores, and coordinate outreach.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Law Firm</span>
          </button>
        </div>
      </div>

      {/* Sourcing Tabs and Views Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${activeTab === 'table' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Table List View
        </button>
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${activeTab === 'kanban' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Pipeline Board View
        </button>
        <button
          onClick={() => setActiveTab('prospecting')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${activeTab === 'prospecting' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Strategic Lead Sourcing
        </button>
      </div>

      {/* Main CRM Workspace (Split Screen on Table/Sourcing, Full on Board) */}
      {activeTab !== 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sourcing/Filters & Sourced List Pane */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search, Filter & Sorter */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search law firm, contact name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:border-sky-500 text-slate-700"
                  />
                </div>
                {/* City dropdown */}
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
                >
                  <option value="All">All Cities (SoCal)</option>
                  {southernCaliforniaCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {/* Stage dropdown */}
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700"
                >
                  <option value="All">All Stages</option>
                  <option disabled>-- Marketing Funnel --</option>
                  <option value="prospect">Prospect</option>
                  <option value="visitor">Visitor</option>
                  <option value="lead">Lead</option>
                  <option value="mql">MQL</option>
                  <option value="sql">SQL</option>
                  <option disabled>-- Sales Funnel --</option>
                  <option value="sql">SQL (Qualified)</option>
                  <option value="contacted">Contacted</option>
                  <option value="engaged">Engaged</option>
                  <option value="meeting_booked">Meeting Booked</option>
                  <option value="referral_partner">Referral Partner</option>
                  <option value="active_partner">Active Partner</option>
                </select>
                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none text-slate-700 font-medium"
                >
                  <option value="score">Sort: Score</option>
                  <option value="name">Sort: Name</option>
                  <option value="referrals">Sort: Referrals</option>
                  <option value="newest">Sort: Newest</option>
                </select>
              </div>
            </div>

            {/* List Table View */}
            {activeTab === 'table' ? (
              <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Law Firm / Primary Contact</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4 text-center">Score</th>
                        <th className="py-3 px-4">Funnel Stages</th>
                        <th className="py-3 px-4 text-center">Referrals</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-sans">
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead.id}
                          className={`hover:bg-slate-50/50 cursor-pointer transition ${selectedLeadId === lead.id ? 'bg-sky-50/20' : ''}`}
                          onClick={() => setSelectedLeadId(lead.id)}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{lead.firmName}</div>
                            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 mt-0.5">
                              <span className="font-medium">{lead.contactName}</span>
                              <span className="text-slate-300">•</span>
                              <span>{lead.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{lead.city}, CA</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${lead.qualificationScore >= 20 ? 'bg-emerald-100 text-emerald-800' : lead.qualificationScore >= 10 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                              {lead.qualificationScore}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Mkt:</span>
                                <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.2 rounded">
                                  {lead.marketingStage.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] uppercase font-bold text-sky-400">Sales:</span>
                                <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.2 rounded">
                                  {lead.salesStage.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {lead.referralCount > 0 ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg font-mono">
                                {lead.referralCount}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleReferralIncrement(lead)}
                                title="Add Referral"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Award className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Archive ${lead.firmName}?`)) {
                                    updateLead({ ...lead, status: 'archived' });
                                  }
                                }}
                                title="Archive"
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                            No Southern California law firms match current search filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Lead Sourcing Module UI */
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl p-4">
                  <Compass className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-bold text-sky-800">Sourcing Logic: Targeting the Gatekeepers</h3>
                    <p className="text-[11px] text-sky-700 mt-1">
                      Attorney decision-makers are highly protective of their inboxes. Focus sourcing on **Case Managers, Treatment Coordinators, and Lien Negotiators** in Southern California. These roles coordinate directly with medical providers and dictate treatment referrals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Southern California High-Value Jurisdictions
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Our routing algorithms give scoring bonuses to personal injury firms situated in:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Beverly Hills', 'La Jolla', 'Newport Beach', 'Los Angeles', 'Glendale', 'Irvine'].map(city => (
                        <span key={city} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Automatic Qualification Safeguards
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      To safeguard relationships from transactional pressure, a lead is promoted to the sales funnel only when qualification thresholds are met:
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 space-y-1">
                      <div>• Score &lt; 5: Stage 1 Prospect/Lead</div>
                      <div>• Score 5 - 9: Stage 2 MQL (Warming Up)</div>
                      <div>• Score 10+: SQL (Ready for Sales Funnel Contact)</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Lead Harvester */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800">Sourcing Hub (Google Maps & Bar Associations Sourced)</h3>
                  <p className="text-[11px] text-slate-500">
                    Discovered SoCal personal injury groups pending verification. Click "Approve and Source" to instantly pre-seed them into active pipeline tracking.
                  </p>
                  <div className="space-y-2">
                    {[
                      { firm: 'Silver Lake Accident Trialists', contact: 'Gregory House', title: 'Treatment Negotiator', city: 'Los Angeles', volume: 'High' },
                      { firm: 'Riverside Spine & Lien Advocates', contact: 'Fiona Gallagher', title: 'Senior Case Manager', city: 'Riverside', volume: 'Medium' }
                    ].map((harv, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50/20">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{harv.firm}</h4>
                          <p className="text-[10px] text-slate-500">{harv.contact} ({harv.title}) • {harv.city}, CA</p>
                        </div>
                        <button 
                          onClick={() => {
                            addLead({
                              firmName: harv.firm,
                              contactName: harv.contact,
                              title: harv.title,
                              email: `${harv.contact.toLowerCase().replace(' ', '')}@${harv.firm.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                              phone: '213-555-0100',
                              website: `www.${harv.firm.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                              linkedIn: `linkedin.com/in/${harv.contact.toLowerCase().replace(' ', '-')}`,
                              city: harv.city,
                              state: 'CA',
                              practiceArea: 'Personal Injury',
                              leadSource: 'Sourced Directory',
                              marketingStage: 'prospect',
                              salesStage: 'sql',
                              owner: 'Alex Coordinator',
                              tags: [harv.volume + ' Volume', harv.city],
                              status: 'active',
                              notes: 'Sourced from local SoCal PI list.',
                              lastContactDate: null,
                              nextFollowUpDate: null,
                              referralCount: 0,
                              relationshipStrength: 1,
                              responsiveness: 1
                            });
                            alert(`${harv.firm} approved and added to CRM.`);
                          }}
                          className="text-[10px] font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded"
                        >
                          Approve and Source
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sourced/Selected Lead Detail Panel (Right Side Split Screen) */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            {selectedLead ? (
              <div className="flex flex-col h-full font-sans">
                {/* Header Profile Summary */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">Profile Details</span>
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      Score: {selectedLead.qualificationScore}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">{selectedLead.firmName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedLead.contactName} • {selectedLead.title}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedLead.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] bg-slate-200/60 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tabs inside details pane */}
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {/* Contact Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={selectedLead.email}>{selectedLead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedLead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={selectedLead.linkedIn}>{selectedLead.linkedIn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedLead.website}</span>
                    </div>
                  </div>

                  {/* Move Stages Trigger */}
                  <div className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Funnel Control Board</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-0.5">Marketing Stage</label>
                        <select
                          value={selectedLead.marketingStage}
                          onChange={(e) => handleStageChange(selectedLead, e.target.value as FunnelStage, selectedLead.salesStage)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] focus:outline-none"
                        >
                          <option value="prospect">Prospect</option>
                          <option value="visitor">Visitor</option>
                          <option value="lead">Lead</option>
                          <option value="mql">MQL</option>
                          <option value="sql">SQL</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-0.5">Sales Stage</label>
                        <select
                          value={selectedLead.salesStage}
                          onChange={(e) => handleStageChange(selectedLead, selectedLead.marketingStage, e.target.value as SalesStage)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] focus:outline-none"
                        >
                          <option value="sql">SQL</option>
                          <option value="contacted">Contacted</option>
                          <option value="engaged">Engaged</option>
                          <option value="meeting_booked">Meeting Booked</option>
                          <option value="referral_partner">Referral Partner</option>
                          <option value="active_partner">Active Partner</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Logger: Outreach / Meetings / Interaction */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Record New Activity Log</span>
                    <div className="bg-slate-50 rounded-lg p-2.5 space-y-2 border border-slate-100">
                      <div className="grid grid-cols-3 gap-1">
                        <button 
                          onClick={() => setInteractionType('reply')}
                          className="text-[9px] bg-white border border-slate-200 rounded py-1 hover:border-sky-500 transition font-bold text-center"
                        >
                          + Engagement
                        </button>
                        <button 
                          onClick={() => {
                            addLeadOutreach(selectedLead.id, {
                              date: new Date().toISOString().split('T')[0],
                              type: outreachType,
                              status: outreachStatus,
                              notes: outreachNotes || 'Logged connection Outreach.'
                            });
                            alert('Outreach Logged');
                            setOutreachNotes('');
                          }}
                          className="text-[9px] bg-sky-600 font-bold text-white rounded py-1 hover:bg-sky-700 transition text-center"
                        >
                          + Log Outreach
                        </button>
                        <button 
                          onClick={() => {
                            addLeadMeeting(selectedLead.id, {
                              date: new Date().toISOString().split('T')[0],
                              type: meetingType,
                              outcome: meetingOutcome,
                              notes: meetingNotes || 'Intro meeting completed.',
                              objections: meetingObjections,
                              opportunities: meetingOpportunities
                            });
                            alert('Meeting Logged');
                            setMeetingNotes('');
                          }}
                          className="text-[9px] bg-indigo-600 font-bold text-white rounded py-1 hover:bg-indigo-700 transition text-center"
                        >
                          + Log Meeting
                        </button>
                      </div>

                      {/* Config Fields for Logs */}
                      <div className="space-y-1.5 text-[10px]">
                        <div>
                          <label className="text-[9px] text-slate-400 block">Outreach Type Configuration</label>
                          <select
                            value={outreachType}
                            onChange={(e) => setOutreachType(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5"
                          >
                            <option value="LinkedIn Connection">LinkedIn Connection</option>
                            <option value="LinkedIn Message">LinkedIn Message</option>
                            <option value="Email Follow-up">Email Follow-up</option>
                            <option value="Value-First Share">Value-First Share</option>
                            <option value="Meeting Request">Meeting Request</option>
                            <option value="Phone Call">Phone Call</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          placeholder="Outreach Notes..."
                          value={outreachNotes}
                          onChange={(e) => setOutreachNotes(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gemini AI Message Personalizer */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-sky-700 uppercase flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      Gemini AI Outreach personalization
                    </span>
                    <button
                      onClick={handleAiPersonalize}
                      disabled={isAiGenerating}
                      className="w-full text-center bg-slate-900 hover:bg-black text-white py-1.5 rounded text-xs font-bold transition flex justify-center items-center gap-1"
                    >
                      {isAiGenerating ? 'AI analyzing...' : 'Draft Value-First message'}
                    </button>

                    {aiGeneratedMessage && (
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 relative">
                        <pre className="text-[10px] text-indigo-950 whitespace-pre-wrap font-mono leading-relaxed">
                          {aiGeneratedMessage}
                        </pre>
                        <button
                          onClick={copyToClipboard}
                          className="absolute top-2 right-2 bg-white border border-slate-200 rounded p-1 hover:border-indigo-400"
                          title="Copy message"
                        >
                          {copyStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* History List */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Log History</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {selectedLead.outreachHistory.map((log) => (
                        <div key={log.id} className="text-[10px] bg-slate-50/50 border border-slate-100 p-2 rounded">
                          <div className="flex justify-between font-semibold text-slate-700">
                            <span>{log.type}</span>
                            <span className="text-slate-400 font-mono">{log.date}</span>
                          </div>
                          <p className="text-slate-500 mt-0.5">{log.notes}</p>
                        </div>
                      ))}
                      {selectedLead.meetingHistory.map((meet) => (
                        <div key={meet.id} className="text-[10px] bg-indigo-50/30 border border-indigo-100 p-2 rounded">
                          <div className="flex justify-between font-semibold text-indigo-900">
                            <span>{meet.type}</span>
                            <span className="text-indigo-400 font-mono">{meet.date}</span>
                          </div>
                          <p className="text-indigo-800 font-bold mt-0.5">Outcome: {meet.outcome}</p>
                          <p className="text-indigo-500">{meet.notes}</p>
                        </div>
                      ))}
                      {selectedLead.outreachHistory.length === 0 && selectedLead.meetingHistory.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic">No activity logs recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 italic font-sans">
                Select a Southern California firm to display profile details.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Board / Kanban Sourcing View */
        <div className="space-y-4 font-sans">
          {/* Board View Switchers */}
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="flex gap-2">
              <button
                onClick={() => setKanbanMode('marketing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${kanbanMode === 'marketing' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
              >
                A) Marketing Funnel Board
              </button>
              <button
                onClick={() => setKanbanMode('sales')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${kanbanMode === 'sales' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
              >
                B) Sales Funnel Board
              </button>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {kanbanMode === 'marketing' ? 'Prospect → Visitor → Lead → MQL → SQL' : 'SQL → Contacted → Engaged → Meeting → Partner → Active'}
            </span>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
            {kanbanMode === 'marketing' ? (
              // Marketing Funnel Columns
              (['prospect', 'visitor', 'lead', 'mql', 'sql'] as FunnelStage[]).map((stage) => {
                const stageLeads = leads.filter(l => l.marketingStage === stage);
                return (
                  <div key={stage} className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[180px] space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">{stage.replace('_', ' ')}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">{stageLeads.length}</span>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {stageLeads.map(lead => (
                        <div 
                          key={lead.id}
                          className="bg-white border border-slate-100 hover:border-sky-300 p-2.5 rounded-lg shadow-2xs space-y-1.5 cursor-pointer"
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('table');
                          }}
                        >
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{lead.firmName}</h4>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                            <span>{lead.city}</span>
                            <span className="font-mono font-bold text-sky-700">{lead.qualificationScore} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Sales Funnel Columns
              (['sql', 'contacted', 'engaged', 'meeting_booked', 'referral_partner', 'active_partner'] as SalesStage[]).map((stage) => {
                const stageLeads = leads.filter(l => l.salesStage === stage);
                return (
                  <div key={stage} className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[180px] space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">{stage.replace('_', ' ')}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono font-bold">{stageLeads.length}</span>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {stageLeads.map(lead => (
                        <div 
                          key={lead.id}
                          className="bg-white border border-slate-100 hover:border-indigo-300 p-2.5 rounded-lg shadow-2xs space-y-1.5 cursor-pointer"
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setActiveTab('table');
                          }}
                        >
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{lead.firmName}</h4>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                            <span>{lead.city}</span>
                            <span className="font-mono font-bold text-emerald-700">R:{lead.referralCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Quick Add Law Firm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add New Southern California Law Firm</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    placeholder="e.g., Beverly Hills PI Associates"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g., Sarah Barton"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Role / Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">City (SoCal)</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    {southernCaliforniaCities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Lead Source</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="Google Search">Google Search</option>
                    <option value="LinkedIn Outreach">LinkedIn Outreach</option>
                    <option value="Instagram Ads">Instagram Ads</option>
                    <option value="Bar Association Directory">Bar Association Directory</option>
                    <option value="Referral Network">Referral Network</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Marketing Funnel Stage</label>
                  <select
                    value={newMarketingStage}
                    onChange={(e) => setNewMarketingStage(e.target.value as FunnelStage)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="visitor">Visitor</option>
                    <option value="lead">Lead</option>
                    <option value="mql">MQL</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sales Funnel Stage</label>
                  <select
                    value={newSalesStage}
                    onChange={(e) => setNewSalesStage(e.target.value as SalesStage)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="sql">SQL</option>
                    <option value="contacted">Contacted</option>
                    <option value="engaged">Engaged</option>
                    <option value="meeting_booked">Meeting Booked</option>
                    <option value="referral_partner">Referral Partner</option>
                    <option value="active_partner">Active Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. High Volume, Glendale, Spine Focus"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Internal Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  placeholder="Add first contact details, preferences, pain points..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium shadow"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
