import React, { useState } from 'react';
import {
  Bookmark,
  Compass,
  ExternalLink,
  Trash2,
  Edit3,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';
import { formatDate, getDaysRemaining } from '../../utils/dates';
import { MatchBadge } from '../common/MatchBadge';
import { OfficialSourceBadge } from '../common/OfficialSourceBadge';

export const SavedPage: React.FC = () => {
  const {
    savedInternships,
    internships,
    currentUser,
    toggleSaveInternship,
    updateSavedNotes,
    setSelectedInternship,
    createApplication,
    isInternshipApplied,
    setIsAddReminderModalOpen,
    setReminderPrefillInternshipId,
    setActiveTab,
    showToast,
  } = useApp();

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const savedList = savedInternships
    .map((saved) => {
      const internship = internships.find((i) => i.id === saved.internshipId);
      return {
        saved,
        internship,
      };
    })
    .filter((item): item is { saved: typeof item.saved; internship: NonNullable<typeof item.internship> } =>
      Boolean(item.internship)
    );

  const handleStartEdit = (savedId: string, currentNotes: string) => {
    setEditingNotesId(savedId);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (internshipId: string) => {
    updateSavedNotes(internshipId, tempNotes);
    setEditingNotesId(null);
  };

  const handleMoveToApplied = (internshipId: string) => {
    createApplication(internshipId);
    showToast('Application record created! You can now track its status.');
  };

  const handleSetReminder = (internshipId: string) => {
    setReminderPrefillInternshipId(internshipId);
    setIsAddReminderModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Internships ({savedList.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Shortlist of target positions. Add notes, set deadline reminders, and apply via official portals.
          </p>
        </div>

        <button
          id="btn-saved-explore-more"
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-colors shadow-xs self-start"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Roles</span>
        </button>
      </div>

      {savedList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            No saved internships yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse through verified opportunities in Explore or Home and click the bookmark icon to save them here.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <span>Explore Internships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedList.map(({ saved, internship }) => {
            const match = calculateSkillMatch(currentUser, internship);
            const { text: deadlineText, isUrgent } = getDaysRemaining(internship.deadline);
            const isApplied = isInternshipApplied(internship.id);

            return (
              <div
                key={saved.id}
                id={`saved-card-${internship.id}`}
                className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white font-display font-bold text-sm shadow-2xs">
                      {internship.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{internship.company}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">{internship.department}</span>
                        <OfficialSourceBadge source={internship.officialSource} compact />
                      </div>
                      <h3
                        onClick={() => setSelectedInternship(internship)}
                        className="font-display text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer mt-0.5"
                      >
                        {internship.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.matchPercentage}% Match</span>
                    </div>

                    <button
                      onClick={() => toggleSaveInternship(internship.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Badges & Deadline */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <span>
                    Location: <strong>{internship.location}</strong> ({internship.workType})
                  </span>
                  <span>•</span>
                  <span>
                    Stipend: <strong>{internship.stipend.split('+')[0]}</strong>
                  </span>
                  <span>•</span>
                  <span className={isUrgent ? 'font-bold text-rose-600' : 'text-slate-600'}>
                    Deadline: {formatDate(internship.deadline)} ({deadlineText})
                  </span>
                </div>

                {/* Personal Notes Section */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Personal Notes & Application Strategy
                    </span>
                    {editingNotesId !== saved.id && (
                      <button
                        onClick={() => handleStartEdit(saved.id, saved.notes || '')}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{saved.notes ? 'Edit Notes' : 'Add Notes'}</span>
                      </button>
                    )}
                  </div>

                  {editingNotesId === saved.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="e.g. Customize resume for distributed systems, review project on GitHub before applying..."
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 bg-white focus:border-indigo-600 focus:outline-hidden"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(internship.id)}
                          className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 italic">
                      {saved.notes || 'No notes added yet. Click "Add Notes" to write prep notes or resume checklist.'}
                    </p>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSetReminder(internship.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Set Deadline Reminder</span>
                    </button>
                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>Full Details</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMoveToApplied(internship.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        Mark as Applied
                      </button>
                    )}

                    <a
                      href={internship.officialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-2xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
