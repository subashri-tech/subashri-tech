import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Calendar, Check, ExternalLink, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, getDaysRemaining } from '../../utils/dates';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '../../utils/notifications';

export const NotificationBell: React.FC = () => {
  const {
    reminders,
    toggleReminderComplete,
    setIsAddReminderModalOpen,
    setSelectedInternship,
    internships,
    showToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNotificationSupported()) {
      setBrowserPerm(getNotificationPermission());
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const activeReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setBrowserPerm(perm);
    if (perm === 'granted') {
      showToast('Browser notifications enabled for internship deadlines!');
    } else {
      showToast('Notifications were not enabled.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="btn-notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Upcoming Reminders & Deadlines"
        aria-label="Upcoming Reminders & Deadlines"
      >
        <Bell className="w-5 h-5" />
        {activeReminders.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
            {activeReminders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="popover-notifications"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-slate-900">
                Upcoming Reminders
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {activeReminders.length} active
              </span>
            </div>

            <button
              id="btn-add-reminder-popover"
              onClick={() => {
                setIsOpen(false);
                setIsAddReminderModalOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reminder</span>
            </button>
          </div>

          {/* Browser notification permission banner */}
          {browserPerm !== 'granted' && isNotificationSupported() && (
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Get real desktop reminders before deadlines</span>
              </div>
              <button
                id="btn-enable-browser-notifs"
                onClick={handleEnableNotifications}
                className="shrink-0 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                Enable
              </button>
            </div>
          )}

          {/* Reminders List */}
          <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
            {activeReminders.length === 0 ? (
              <div className="py-6 text-center text-slate-500">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No upcoming reminders</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set reminders from any internship details page.
                </p>
              </div>
            ) : (
              activeReminders.map((reminder) => {
                const { text: daysText, isUrgent } = getDaysRemaining(reminder.dueDate);
                const linkedInternship = reminder.internshipId
                  ? internships.find((i) => i.id === reminder.internshipId)
                  : null;

                return (
                  <div
                    key={reminder.id}
                    className="group rounded-xl border border-slate-200/80 p-3 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-start justify-between gap-2.5"
                  >
                    <button
                      id={`btn-complete-reminder-${reminder.id}`}
                      onClick={() => toggleReminderComplete(reminder.id)}
                      className="mt-0.5 h-4 w-4 rounded-full border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center text-transparent hover:text-emerald-600 transition-colors shrink-0"
                      title="Mark complete"
                    >
                      <Check className="w-2.5 h-2.5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            reminder.type === 'Deadline'
                              ? 'bg-rose-100 text-rose-800'
                              : reminder.type === 'Interview'
                              ? 'bg-purple-100 text-purple-800'
                              : reminder.type === 'Assessment'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {reminder.type}
                        </span>
                        <span
                          className={`text-[11px] font-bold ${
                            isUrgent ? 'text-rose-600' : 'text-slate-500'
                          }`}
                        >
                          {daysText}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                        {reminder.title}
                      </p>

                      {linkedInternship && (
                        <button
                          onClick={() => {
                            setSelectedInternship(linkedInternship);
                            setIsOpen(false);
                          }}
                          className="mt-1 text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-medium truncate"
                        >
                          <span>{linkedInternship.company} • {linkedInternship.title}</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(reminder.dueDate)} {reminder.dueTime ? `at ${reminder.dueTime}` : ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
