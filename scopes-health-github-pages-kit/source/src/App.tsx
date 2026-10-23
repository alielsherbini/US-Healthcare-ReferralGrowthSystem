/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import Outreach from './components/Outreach';
import Content from './components/Content';
import Tasks from './components/Tasks';
import Meetings from './components/Meetings';
import Reports from './components/Reports';
import ActionPlan from './components/ActionPlan';
import Settings from './components/Settings';

import { 
  BarChart3, Users, Send, Calendar, CheckSquare, 
  PhoneCall, FileText, Compass, Settings as SettingsIcon, 
  UserCheck, ShieldCheck, HeartPulse, Menu, X
} from 'lucide-react';

function AppContent() {
  const [activeRoute, setActiveRoute] = useState<'dashboard' | 'crm' | 'outreach' | 'content' | 'tasks' | 'meetings' | 'reports' | 'plan' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUserRole, setCurrentUserRole } = useApp();

  const navigationItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3, roles: ['admin', 'coordinator', 'content_manager', 'outreach_specialist', 'viewer'] },
    { id: 'crm', label: 'CRM & Lead Sourcing', icon: Users, roles: ['admin', 'coordinator', 'outreach_specialist', 'viewer'] },
    { id: 'outreach', label: 'Outreach Sequence', icon: Send, roles: ['admin', 'coordinator', 'outreach_specialist'] },
    { id: 'content', label: 'Content Strategy', icon: Calendar, roles: ['admin', 'coordinator', 'content_manager'] },
    { id: 'tasks', label: 'Operational Tasks', icon: CheckSquare, roles: ['admin', 'coordinator', 'content_manager', 'outreach_specialist'] },
    { id: 'meetings', label: 'Meetings & Objections', icon: PhoneCall, roles: ['admin', 'coordinator', 'outreach_specialist'] },
    { id: 'reports', label: 'Growth Reports', icon: FileText, roles: ['admin', 'coordinator', 'viewer'] },
    { id: 'plan', label: '30-Day Blueprint', icon: Compass, roles: ['admin', 'coordinator', 'content_manager', 'outreach_specialist', 'viewer'] },
    { id: 'settings', label: 'Weights & Roles', icon: SettingsIcon, roles: ['admin', 'coordinator', 'content_manager', 'outreach_specialist', 'viewer'] },
  ];

  const renderActiveRoute = () => {
    // Check role permissions before rendering
    const currentItem = navigationItems.find(item => item.id === activeRoute);
    if (currentItem && !currentItem.roles.includes(currentUserRole)) {
      return (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-slate-700 max-w-md mx-auto mt-12 space-y-3 font-sans shadow">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-base font-bold text-rose-900">Access Denied</h2>
          <p className="text-xs text-rose-700">
            Your active simulated profile (<strong>{currentUserRole.toUpperCase()}</strong>) does not have authorization to view the {currentItem.label} panel.
          </p>
          <p className="text-[11px] text-slate-500">
            Switch to <strong>ADMIN</strong> inside the Weights & Roles settings tab to override permissions.
          </p>
        </div>
      );
    }

    switch (activeRoute) {
      case 'dashboard': return <Dashboard />;
      case 'crm': return <CRM />;
      case 'outreach': return <Outreach />;
      case 'content': return <Content />;
      case 'tasks': return <Tasks />;
      case 'meetings': return <Meetings />;
      case 'reports': return <Reports />;
      case 'plan': return <ActionPlan />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      
      {/* Left Sidebar Layout */}
      <aside className={`bg-slate-900 text-slate-300 w-64 flex flex-col justify-between shrink-0 fixed md:sticky top-0 bottom-0 z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-blue-400" />
              <div>
                <h1 className="font-bold text-sm tracking-wider text-white font-display uppercase">SCOPES Health</h1>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider block">Growth OS v1.4</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3.5 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const hasAccess = item.roles.includes(currentUserRole);
              return (
                <button
                  key={item.id}
                  disabled={!hasAccess}
                  onClick={() => {
                    setActiveRoute(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${activeRoute === item.id ? 'bg-blue-600 text-white shadow-sm' : hasAccess ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'opacity-35 cursor-not-allowed text-slate-600'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile metadata */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-800 p-2 rounded-lg text-sky-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white leading-none">Simulated User</p>
              <select
                id="role_selector_footer"
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as any)}
                className="text-[10px] text-slate-400 font-mono mt-1 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer block uppercase hover:text-white transition w-full text-left"
              >
                <option value="admin" className="bg-slate-900 text-slate-300">Role: Admin</option>
                <option value="coordinator" className="bg-slate-900 text-slate-300">Role: Coordinator</option>
                <option value="content_manager" className="bg-slate-900 text-slate-300">Role: Content Mgr</option>
                <option value="outreach_specialist" className="bg-slate-900 text-slate-300">Role: Outreach Spec</option>
                <option value="viewer" className="bg-slate-900 text-slate-300">Role: Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navbar Header */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 flex items-center justify-between md:hidden shadow-xs">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-xs text-slate-800 font-display uppercase tracking-wider">SCOPES Health OS</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-slate-600 p-1 rounded hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Inner Viewport Wrapper */}
        <main className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {renderActiveRoute()}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
