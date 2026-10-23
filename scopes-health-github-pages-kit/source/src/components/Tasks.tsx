/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { CheckSquare, Calendar, User, Plus, Check, Clock, Trash2, Zap, AlertCircle } from 'lucide-react';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, leads } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('Alex Coordinator');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('2026-06-26');
  const [relatedLeadId, setRelatedLeadId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [checklistInput, setChecklistInput] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const parsedChecklist = checklistInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map((text, i) => ({ id: `c_${Date.now()}_${i}`, text, done: false }));

    addTask({
      title,
      description,
      owner,
      priority,
      dueDate,
      status: 'todo',
      relatedLeadId: relatedLeadId || undefined,
      isRecurring,
      checklist: parsedChecklist
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setChecklistInput('');
    setIsAddOpen(false);
  };

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    updateTask({ ...task, status: newStatus });
  };

  const handleChecklistToggle = (task: Task, checkId: string) => {
    const updatedChecklist = task.checklist.map(item => 
      item.id === checkId ? { ...item, done: !item.done } : item
    );
    updateTask({ ...task, checklist: updatedChecklist });
  };

  // Operational schedule presets
  const operationalRoutines = [
    { day: 'Monday Routine', action: 'Systematic Pipeline Review', details: 'Identify bottlenecks in lead scores, update follow-up thresholds, align tasks.' },
    { day: 'Tue - Thu Routine', action: 'Focused Outreach & Meetings', details: 'Send LinkedIn connections, email follow-ups with guides, conduct coordinator demos.' },
    { day: 'Friday Routine', action: 'Strategic Reporting & Optimization', details: 'Record weekly partner referrals, analyze content engagement, optimize weights.' }
  ];

  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-300 text-slate-800 bg-slate-50' },
    { id: 'in_progress', label: 'In Progress', color: 'border-sky-300 text-sky-800 bg-sky-50/50' },
    { id: 'waiting', label: 'Waiting / Blocked', color: 'border-amber-300 text-amber-800 bg-amber-50/30' },
    { id: 'done', label: 'Done', color: 'border-emerald-300 text-emerald-800 bg-emerald-50/30' }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-700" id="tasks_module">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-sans">
            Operational Task Board
          </h1>
          <p className="text-sm text-slate-500 font-sans">
            Maintain outreach follow-ups and weekly routines. No lead should sit without a next action.
          </p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Routine schedule panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
        {operationalRoutines.map((rot, idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/30">
            <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block mb-1">{rot.day}</span>
            <h3 className="text-xs font-bold text-slate-800">{rot.action}</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rot.details}</p>
          </div>
        ))}
      </div>

      {/* Task board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">{col.label}</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">{colTasks.length}</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {colTasks.map((task) => {
                  const relatedLead = leads.find(l => l.id === task.relatedLeadId);
                  return (
                    <div key={task.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{task.title}</h4>
                          <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded shrink-0 ${task.priority === 'high' ? 'bg-rose-100 text-rose-800' : task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>}
                        
                        {relatedLead && (
                          <div className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded inline-block text-slate-600">
                            Firm: <strong>{relatedLead.firmName}</strong>
                          </div>
                        )}
                      </div>

                      {/* Interactive Checklist inside card */}
                      {task.checklist.length > 0 && (
                        <div className="space-y-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Steps Checklist</span>
                          {task.checklist.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleChecklistToggle(task, item.id)}
                              className="flex items-center gap-1.5 text-left text-[10px] text-slate-600 w-full"
                            >
                              <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 transition ${item.done ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-300'}`}>
                                {item.done && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className={item.done ? 'line-through text-slate-400' : ''}>{item.text}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Task footer & controls */}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{task.dueDate}</span>
                        </div>
                        
                        {/* Column flow triggers */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button 
                              onClick={() => handleStatusChange(task, col.id === 'in_progress' ? 'todo' : col.id === 'waiting' ? 'in_progress' : 'waiting')}
                              className="text-[9px] text-slate-500 hover:text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-bold"
                            >
                              ◀
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button 
                              onClick={() => handleStatusChange(task, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'waiting' : 'done')}
                              className="text-[9px] text-sky-600 hover:text-sky-800 bg-sky-50 px-1 py-0.5 rounded font-bold"
                            >
                              ▶
                            </button>
                          )}
                          <button 
                            onClick={() => { if(confirm('Delete task?')) deleteTask(task.id); }}
                            className="text-[9px] text-rose-500 hover:bg-rose-50 p-1 rounded ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic text-center py-6">No tasks in this stage.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Create Operational Task</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Send Value guide to Sarah"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Related Law Firm</label>
                  <select
                    value={relatedLeadId}
                    onChange={(e) => setRelatedLeadId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5"
                  >
                    <option value="">None</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.firmName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="isRecurring" className="text-[11px] font-bold text-slate-600">Recurring Routine Task</label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Checklist Items (comma separated)</label>
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  placeholder="e.g. Find 5 prospects, Send message, Log replies"
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
