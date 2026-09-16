import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, Application } from '../../types';
import { formatDate } from '../../utils/dates';

const APPLICATION_STAGES: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
];

export const ApplicationsTrackerPage: React.FC = () => {
  const {
    applications,
    internships,
    currentUser,
    updateApplicationStatus,
    deleteApplication,
    createApplication,
    setSelectedInternship,
    setIsAddReminderModalOpen,
    setReminderPrefillInternshipId,
    setActiveTab,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<Application | null>(null);
  const [isManualAppModalOpen, setIsManualAppModalOpen] = useState(false);

  // Manual Add App State
  const [manualInternshipId, setManualInternshipId] = useState('');
  const [manualRefId, setManualRefId] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  const stageColorMap: Record<ApplicationStatus, { bg: string; text: string; border: string; badge: string }> = {
    Applied: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-200 text-slate-800' },
    Screening: { bg: 'bg-blue-50/50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    Assessment: { bg: 'bg-amber-50/50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    Interview: { bg: 'bg-purple-50/50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
    Offer: { bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
    Rejected: { bg: 'bg-rose-50/30', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
    Withdrawn: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', badge: 'bg-slate-200 text-slate-700' },
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInternshipId) {
      showToast('Please choose an opportunity.');
      return;
    }
    createApplication(manualInternshipId, manualNotes, manualRefId);
    setIsManualAppModalOpen(false);
    setManualInternshipId('');
    setManualRefId('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white font-display font-bold text-sm shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Applications Tracker ({applications.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track stage progression, technical assessment timelines, recruiter interviews, and official reference IDs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Layout Toggle */}
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'kanban'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="btn-log-new-application"
            onClick={() => setIsManualAppModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Application</span>
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            No tracked applications yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Apply to verified internships from the Explore tab and mark them as applied to monitor your progression pipeline.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <span>Explore Internships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {APPLICATION_STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage);
            const style = stageColorMap[stage];

            return (
              <div
                key={stage}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 flex flex-col min-h-[450px]"
              >
                {/* Stage Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-800">
                    {stage}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards in this stage */}
                <div className="space-y-3 flex-1">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                      No applications
                    </div>
                  ) : (
                    stageApps.map((app) => {
                      const internship = internships.find((i) => i.id === app.internshipId);
                      if (!internship) return null;

                      return (
                        <div
                          key={app.id}
                          className="group rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 truncate block">
                                {internship.company}
                              </span>
                              <h4
                                onClick={() => setSelectedInternship(internship)}
                                className="text-xs font-medium text-slate-700 hover:text-indigo-600 cursor-pointer line-clamp-2 leading-tight"
                              >
                                {internship.title}
                              </h4>
                            </div>

                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Reference ID & Applied Date */}
                          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                            {app.officialReferenceId && (
                              <p className="font-mono text-[10px] text-slate-600 truncate">
                                Ref: {app.officialReferenceId}
                              </p>
                            )}
                            <div className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>Applied: {formatDate(app.appliedDate)}</span>
                            </div>
                          </div>

                          {/* Next Action Tag if available */}
                          {app.nextAction && (
                            <div className="rounded-lg bg-indigo-50/70 p-2 text-[11px] text-indigo-900 border border-indigo-100">
                              <span className="font-bold block text-[10px] uppercase tracking-wider text-indigo-700">
                                Next Step:
                              </span>
                              <p className="truncate font-medium">{app.nextAction}</p>
                            </div>
                          )}

                          {/* Stage Transition Selector */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(
                                  app.id,
                                  e.target.value as ApplicationStatus
                                )
                              }
                              className="text-[11px] font-bold text-slate-700 bg-slate-100 rounded-lg px-2 py-1 border-none outline-hidden cursor-pointer w-full"
                            >
                              {APPLICATION_STAGES.map((s) => (
                                <option key={s} value={s}>
                                  Move to: {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Official Reference</th>
                  <th className="py-3 px-4">Status Stage</th>
                  <th className="py-3 px-4">Next Step</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {applications.map((app) => {
                  const internship = internships.find((i) => i.id === app.internshipId);
                  if (!internship) return null;
                  const style = stageColorMap[app.status];

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {internship.company}
                          </span>
                          <button
                            onClick={() => setSelectedInternship(internship)}
                            className="text-xs text-indigo-600 hover:underline truncate max-w-xs text-left"
                          >
                            {internship.title}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(app.appliedDate)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {app.officialReferenceId || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(
                              app.id,
                              e.target.value as ApplicationStatus
                            )
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border-none outline-hidden cursor-pointer ${style.badge}`}
                        >
                          {APPLICATION_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {app.nextAction || 'Awaiting response'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={internship.officialSource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                            title="Official Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Application Log Modal */}
      {isManualAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
              Log an Application
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an opportunity to track throughout the hiring pipeline.
            </p>

            <form onSubmit={handleManualAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Opportunity *
                </label>
                <select
                  required
                  value={manualInternshipId}
                  onChange={(e) => setManualInternshipId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value="">-- Choose Internship --</option>
                  {internships.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.company} — {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmation / Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={manualRefId}
                  onChange={(e) => setManualRefId(e.target.value)}
                  placeholder="e.g. APP-92819-SWE"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Notes
                </label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Applied with resume version 2, listed GitHub distributed systems project."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualAppModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
