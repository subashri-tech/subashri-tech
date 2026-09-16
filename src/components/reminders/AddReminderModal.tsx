import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, AlertCircle, Plus, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReminderType, ReminderPriority } from '../../types';

export const AddReminderModal: React.FC = () => {
  const {
    isAddReminderModalOpen,
    setIsAddReminderModalOpen,
    reminderPrefillInternshipId,
    setReminderPrefillInternshipId,
    internships,
    addReminder,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('Deadline');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<ReminderPriority>('high');
  const [notes, setNotes] = useState('');
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>('');

  useEffect(() => {
    if (reminderPrefillInternshipId) {
      const match = internships.find((i) => i.id === reminderPrefillInternshipId);
      if (match) {
        setSelectedInternshipId(match.id);
        setTitle(`${match.company} Application Deadline`);
        setType('Deadline');
        if (match.deadline) {
          setDueDate(match.deadline);
        }
      }
    } else {
      // Default due date: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      setTitle('');
      setSelectedInternshipId('');
    }
  }, [reminderPrefillInternshipId, isAddReminderModalOpen, internships]);

  if (!isAddReminderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      showToast('Please provide a title and due date.');
      return;
    }

    addReminder({
      title: title.trim(),
      type,
      dueDate,
      dueTime,
      priority,
      notes: notes.trim(),
      internshipId: selectedInternshipId || undefined,
      completed: false,
    });

    setIsAddReminderModalOpen(false);
    setReminderPrefillInternshipId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/10">
        <button
          id="btn-close-add-reminder"
          onClick={() => {
            setIsAddReminderModalOpen(false);
            setReminderPrefillInternshipId(null);
          }}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Create Internship Reminder
            </h2>
            <p className="text-xs text-slate-500">
              Never miss critical deadlines, online assessments, or interviews.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reminder Purpose / Title *
            </label>
            <input
              id="input-reminder-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stripe Technical Assessment, Figma Application Deadline"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Category
              </label>
              <select
                id="select-reminder-type"
                value={type}
                onChange={(e) => setType(e.target.value as ReminderType)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="Deadline">Application Deadline</option>
                <option value="Assessment">Online Assessment / HackerRank</option>
                <option value="Interview">Interview / Phone Screen</option>
                <option value="Follow-up">Recruiter Follow-up</option>
                <option value="Custom">Custom Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                id="select-reminder-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-reminder-date"
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time (Optional)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-reminder-time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link to Opportunity (Optional)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                id="select-reminder-internship"
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="">-- No specific opportunity --</option>
                {internships.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.company} — {i.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Instructions
            </label>
            <textarea
              id="textarea-reminder-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prepare system design questions, review resume points on distributed systems..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddReminderModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="btn-submit-add-reminder"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Save Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
