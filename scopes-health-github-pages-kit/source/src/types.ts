/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'admin' | 'coordinator' | 'content_manager' | 'outreach_specialist' | 'viewer';

export type FunnelStage = 'prospect' | 'visitor' | 'lead' | 'mql' | 'sql';

export type SalesStage = 'sql' | 'contacted' | 'engaged' | 'meeting_booked' | 'referral_partner' | 'active_partner';

export interface Interaction {
  id: string;
  type: 'email_open' | 'video_view' | 'website_visit' | 'save_share_comment' | 'form_submission' | 'reply' | 'call_booking';
  date: string;
}

export interface OutreachLog {
  id: string;
  date: string;
  type: 'LinkedIn Connection' | 'LinkedIn Message' | 'Email Follow-up' | 'Value-First Share' | 'Meeting Request' | 'Phone Call';
  status: 'sent' | 'replied' | 'no_response' | 'pending';
  notes: string;
}

export interface MeetingLog {
  id: string;
  date: string;
  type: 'Discovery Call' | 'Intro Meeting' | 'Follow-up';
  outcome: string;
  notes: string;
  objections: string;
  opportunities: string;
}

export interface Lead {
  id: string;
  firmName: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  linkedIn: string;
  website: string;
  city: string;
  state: string;
  practiceArea: string;
  leadSource: string;
  marketingStage: FunnelStage;
  salesStage: SalesStage;
  qualificationScore: number;
  owner: string;
  tags: string[];
  status: 'active' | 'archived';
  notes: string;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  interactions: Interaction[];
  outreachHistory: OutreachLog[];
  meetingHistory: MeetingLog[];
  referralCount: number;
  relationshipStrength: number; // 1 to 5
  responsiveness: number; // 1 to 5
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'waiting' | 'done';
  relatedLeadId?: string;
  isRecurring: boolean;
  checklist: { id: string; text: string; done: boolean }[];
}

export interface ContentItem {
  id: string;
  title: string;
  format: 'Post' | 'Carousel' | 'Reel' | 'Graphic' | 'Article';
  platform: 'LinkedIn' | 'Instagram';
  funnelStage: 'awareness' | 'trust' | 'relationship' | 'conversion';
  theme: string;
  publishDate: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  metrics: {
    impressions: number;
    engagementRate: number; // e.g., 4.2 for 4.2%
    shares: number;
    clicks: number;
  };
  assetLink: string;
  contentBody?: string;
}

export interface ScoreWeights {
  email_open: number;
  video_view: number;
  website_visit: number;
  save_share_comment: number;
  form_submission: number;
  reply: number;
  call_booking: number;
  decayDays: number; // decay window
  decayPercent: number; // decay factor
}

export interface OutreachTemplate {
  id: string;
  name: string;
  channel: 'LinkedIn' | 'Email';
  stage: string;
  subject?: string;
  body: string;
  purpose: string;
}
