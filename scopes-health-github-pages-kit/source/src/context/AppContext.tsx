/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { Lead, Task, ContentItem, ScoreWeights, Role, OutreachTemplate, Interaction, OutreachLog, MeetingLog } from '../types';
import { readStored, writeStored } from '../storage';
import { INITIAL_LEADS, INITIAL_TASKS, INITIAL_CONTENT_ITEMS, INITIAL_OUTREACH_TEMPLATES, DEFAULT_SCORE_WEIGHTS } from '../data/seedData';

interface AppContextType {
  leads: Lead[];
  tasks: Task[];
  contentItems: ContentItem[];
  scoreWeights: ScoreWeights;
  templates: OutreachTemplate[];
  currentUserRole: Role;
  
  // Lead operations
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'qualificationScore' | 'interactions' | 'outreachHistory' | 'meetingHistory'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  addLeadInteraction: (leadId: string, interaction: Omit<Interaction, 'id'>) => void;
  addLeadOutreach: (leadId: string, log: Omit<OutreachLog, 'id'>) => void;
  addLeadMeeting: (leadId: string, meeting: Omit<MeetingLog, 'id'>) => void;
  recalculateScores: () => void;

  // Task operations
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  // Content operations
  addContentItem: (item: Omit<ContentItem, 'id' | 'metrics'>) => void;
  updateContentItem: (item: ContentItem) => void;
  deleteContentItem: (id: string) => void;

  // Template operations
  updateTemplate: (template: OutreachTemplate) => void;

  // Config operations
  updateScoreWeights: (weights: ScoreWeights) => void;
  setCurrentUserRole: (role: Role) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => readStored('scopes_leads', INITIAL_LEADS));
  const [tasks, setTasks] = useState<Task[]>(() => readStored('scopes_tasks', INITIAL_TASKS));
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => readStored('scopes_content', INITIAL_CONTENT_ITEMS));
  const [scoreWeights, setScoreWeights] = useState<ScoreWeights>(() => readStored('scopes_weights', DEFAULT_SCORE_WEIGHTS));
  const [templates, setTemplates] = useState<OutreachTemplate[]>(() => readStored('scopes_templates', INITIAL_OUTREACH_TEMPLATES));
  const [currentUserRole, setCurrentUserRoleState] = useState<Role>(() => {
    const role = readStored('scopes_role', 'admin');
    return ['admin', 'coordinator', 'content_manager', 'outreach_specialist', 'viewer'].includes(role) ? role as Role : 'admin';
  });

  // Sync to localStorage on state change
  const syncToStorage = (newLeads: Lead[], newTasks: Task[], newContent: ContentItem[], newWeights: ScoreWeights, newTemplates: OutreachTemplate[], newRole: Role) => {
    writeStored('scopes_leads', newLeads);
    writeStored('scopes_tasks', newTasks);
    writeStored('scopes_content', newContent);
    writeStored('scopes_weights', newWeights);
    writeStored('scopes_templates', newTemplates);
    writeStored('scopes_role', newRole);
  };

  const updateAndSyncLeads = (updatedLeads: Lead[]) => {
    const scored = updatedLeads.map(lead => calculateLeadScore(lead, scoreWeights));
    setLeads(scored);
    syncToStorage(scored, tasks, contentItems, scoreWeights, templates, currentUserRole);
  };

  const updateAndSyncTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    syncToStorage(leads, updatedTasks, contentItems, scoreWeights, templates, currentUserRole);
  };

  const updateAndSyncContent = (updatedContent: ContentItem[]) => {
    setContentItems(updatedContent);
    syncToStorage(leads, tasks, updatedContent, scoreWeights, templates, currentUserRole);
  };

  const updateScoreWeights = (updatedWeights: ScoreWeights) => {
    setScoreWeights(updatedWeights);
    // Recalculate scores with new weights
    const scoredLeads = leads.map(lead => calculateLeadScore(lead, updatedWeights));
    setLeads(scoredLeads);
    syncToStorage(scoredLeads, tasks, contentItems, updatedWeights, templates, currentUserRole);
  };

  const updateAndSyncTemplates = (updatedTemplates: OutreachTemplate[]) => {
    setTemplates(updatedTemplates);
    syncToStorage(leads, tasks, contentItems, scoreWeights, updatedTemplates, currentUserRole);
  };

  const setCurrentUserRole = (role: Role) => {
    setCurrentUserRoleState(role);
    syncToStorage(leads, tasks, contentItems, scoreWeights, templates, role);
  };

  // Score calculation engine with configurable weights & time decay
  const calculateLeadScore = (lead: Lead, weights: ScoreWeights): Lead => {
    let score = 0;
    const now = new Date('2026-06-25T19:45:00-07:00').getTime(); // Use fixed system time for consistent score evaluations

    lead.interactions.forEach(interaction => {
      let basePoints = 0;
      switch (interaction.type) {
        case 'email_open': basePoints = weights.email_open; break;
        case 'video_view': basePoints = weights.video_view; break;
        case 'website_visit': basePoints = weights.website_visit; break;
        case 'save_share_comment': basePoints = weights.save_share_comment; break;
        case 'form_submission': basePoints = weights.form_submission; break;
        case 'reply': basePoints = weights.reply; break;
        case 'call_booking': basePoints = weights.call_booking; break;
      }

      // Time-decay logic: score decays by X% for every Y days old it is
      const interactionDate = new Date(interaction.date).getTime();
      const ageInDays = Math.max(0, (now - interactionDate) / (1000 * 60 * 60 * 24));
      const decayCycles = ageInDays / weights.decayDays;
      const decayFactor = Math.pow(1 - (weights.decayPercent / 100), decayCycles);
      
      score += Math.round(basePoints * decayFactor * 10) / 10;
    });

    // Custom source/tags weights (e.g. high value tags give bonus)
    if (lead.tags.includes('High Value') || lead.tags.includes('Spine Cases')) {
      score += 5; // Strategic bonus
    }
    if (lead.city === 'Beverly Hills' || lead.city === 'La Jolla' || lead.city === 'Newport Beach') {
      score += 3; // Southern California high value zip codes bonus
    }

    // Auto stage promotion based on threshold rules
    // 0-4 = Lead, 5-9 = MQL, 10+ = SQL
    let autoMktStage = lead.marketingStage;
    if (lead.marketingStage !== 'prospect' && lead.marketingStage !== 'visitor') {
      if (score >= 10) {
        autoMktStage = 'sql';
      } else if (score >= 5) {
        autoMktStage = 'mql';
      } else {
        autoMktStage = 'lead';
      }
    }

    // Auto-promote sales stage if lead score meets qualification threshold and sales stage is untouched
    let autoSalesStage = lead.salesStage;
    if (autoMktStage === 'sql' && lead.salesStage === 'sql' && score >= 10) {
      // Keep as sql ready for sales contact
    }

    return {
      ...lead,
      qualificationScore: parseFloat(score.toFixed(1)),
      marketingStage: autoMktStage,
      salesStage: autoSalesStage,
    };
  };

  const recalculateScores = () => {
    const scored = leads.map(lead => calculateLeadScore(lead, scoreWeights));
    setLeads(scored);
    syncToStorage(scored, tasks, contentItems, scoreWeights, templates, currentUserRole);
  };

  // Lead CRUD
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'qualificationScore' | 'interactions' | 'outreachHistory' | 'meetingHistory'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'l_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      qualificationScore: 0,
      interactions: [],
      outreachHistory: [],
      meetingHistory: [],
    };
    const scoredLead = calculateLeadScore(newLead, scoreWeights);
    const updated = [scoredLead, ...leads];
    setLeads(updated);
    syncToStorage(updated, tasks, contentItems, scoreWeights, templates, currentUserRole);
  };

  const updateLead = (updatedLead: Lead) => {
    const updated = leads.map(l => (l.id === updatedLead.id ? updatedLead : l));
    updateAndSyncLeads(updated);
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    syncToStorage(updated, tasks, contentItems, scoreWeights, templates, currentUserRole);
  };

  const addLeadInteraction = (leadId: string, interaction: Omit<Interaction, 'id'>) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const newInteraction: Interaction = {
          ...interaction,
          id: 'int_' + Math.random().toString(36).substr(2, 9),
        };
        return {
          ...l,
          interactions: [newInteraction, ...l.interactions],
        };
      }
      return l;
    });
    updateAndSyncLeads(updated);
  };

  const addLeadOutreach = (leadId: string, log: Omit<OutreachLog, 'id'>) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const newLog: OutreachLog = {
          ...log,
          id: 'out_' + Math.random().toString(36).substr(2, 9),
        };
        return {
          ...l,
          lastContactDate: log.date,
          outreachHistory: [newLog, ...l.outreachHistory],
        };
      }
      return l;
    });
    updateAndSyncLeads(updated);
  };

  const addLeadMeeting = (leadId: string, meeting: Omit<MeetingLog, 'id'>) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const newMeeting: MeetingLog = {
          ...meeting,
          id: 'meet_' + Math.random().toString(36).substr(2, 9),
        };
        return {
          ...l,
          lastContactDate: meeting.date,
          meetingHistory: [newMeeting, ...l.meetingHistory],
        };
      }
      return l;
    });
    updateAndSyncLeads(updated);
  };

  // Task CRUD
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 't_' + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newTask, ...tasks];
    updateAndSyncTasks(updated);
  };

  const updateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    updateAndSyncTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    updateAndSyncTasks(updated);
  };

  // Content CRUD
  const addContentItem = (contentData: Omit<ContentItem, 'id' | 'metrics'>) => {
    const newItem: ContentItem = {
      ...contentData,
      id: 'co_' + Math.random().toString(36).substr(2, 9),
      metrics: { impressions: 0, engagementRate: 0, shares: 0, clicks: 0 },
    };
    const updated = [newItem, ...contentItems];
    updateAndSyncContent(updated);
  };

  const updateContentItem = (updatedItem: ContentItem) => {
    const updated = contentItems.map(c => (c.id === updatedItem.id ? updatedItem : c));
    updateAndSyncContent(updated);
  };

  const deleteContentItem = (id: string) => {
    const updated = contentItems.filter(c => c.id !== id);
    updateAndSyncContent(updated);
  };

  // Template CRUD
  const updateTemplate = (updatedTemplate: OutreachTemplate) => {
    const updated = templates.map(t => (t.id === updatedTemplate.id ? updatedTemplate : t));
    updateAndSyncTemplates(updated);
  };

  const resetData = () => {
    setLeads(INITIAL_LEADS);
    setTasks(INITIAL_TASKS);
    setContentItems(INITIAL_CONTENT_ITEMS);
    setScoreWeights(DEFAULT_SCORE_WEIGHTS);
    setTemplates(INITIAL_OUTREACH_TEMPLATES);
    setCurrentUserRoleState('admin');
    // Reset only this app's keys; other Pages apps may share this origin.
    writeStored('scopes_milestones', null);
    syncToStorage(INITIAL_LEADS, INITIAL_TASKS, INITIAL_CONTENT_ITEMS, DEFAULT_SCORE_WEIGHTS, INITIAL_OUTREACH_TEMPLATES, 'admin');
  };

  return (
    <AppContext.Provider
      value={{
        leads,
        tasks,
        contentItems,
        scoreWeights,
        templates,
        currentUserRole,
        addLead,
        updateLead,
        deleteLead,
        addLeadInteraction,
        addLeadOutreach,
        addLeadMeeting,
        recalculateScores,
        addTask,
        updateTask,
        deleteTask,
        addContentItem,
        updateContentItem,
        deleteContentItem,
        updateTemplate,
        updateScoreWeights,
        setCurrentUserRole,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
