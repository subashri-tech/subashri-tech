import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Sparkles,
  ExternalLink,
  Bookmark,
  Bell,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Share2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';
import { formatDate, getDaysRemaining } from '../../utils/dates';
import { OfficialSourceBadge } from '../common/OfficialSourceBadge';
import { MatchBadge } from '../common/MatchBadge';

export const InternshipDetailsModal: React.FC = () => {
  const {
    selectedInternship,
    setSelectedInternship,
    currentUser,
    isInternshipSaved,
    toggleSaveInternship,
    isInternshipApplied,
    createApplication,
    setIsAddReminderModalOpen,
    setReminderPrefillInternshipId,
    setActiveTab,
    showToast,
  } = useApp();

  const [hasClickedApply, setHasClickedApply] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedInternship) return null;

  const isSaved = isInternshipSaved(selectedInternship.id);
  const isApplied = isInternshipApplied(selectedInternship.id);
  const match = calculateSkillMatch(currentUser, selectedInternship);
  const { text: deadlineText, isUrgent } = getDaysRemaining(selectedInternship.deadline);

  const handleApplyNowClick = () => {
    // Open the official source portal in a new tab
    window.open(selectedInternship.officialSource.url, '_blank', 'noopener,noreferrer');
    setHasClickedApply(true);
  };

  const handleLogApplication = () => {
    createApplication(selectedInternship.id);
    setHasClickedApply(false);
    showToast(`Application logged! Track its progress in the Applications tab.`);
  };

  const handleSetReminder = () => {
    setReminderPrefillInternshipId(selectedInternship.id);
    setIsAddReminderModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast('Opportunity link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Opportunity Details</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">{selectedInternship.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-share-modal"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-details-modal"
              onClick={() => setSelectedInternship(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Company & Role Headline */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white font-display font-bold text-xl shadow-xs">
                {selectedInternship.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {selectedInternship.company}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedInternship.department}
                  </span>
                  {selectedInternship.isNew && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-700">
                      New Verified
                    </span>
                  )}
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {selectedInternship.title}
                </h1>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-modal-save"
                onClick={() => toggleSaveInternship(selectedInternship.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                id="btn-modal-set-reminder"
                onClick={handleSetReminder}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Remind Me</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="p-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Location & Mode
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {selectedInternship.location}
              </p>
              <span className="text-[11px] text-slate-500">
                {selectedInternship.workType}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Compensation
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {selectedInternship.stipend.split('+')[0]}
              </p>
              <span className="text-[11px] text-indigo-600 font-medium">
                {selectedInternship.stipend.includes('+') ? '+ Stipend/Housing' : 'Competitive'}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Duration & Term
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {selectedInternship.duration}
              </p>
              <span className="text-[11px] text-slate-500">
                Starts: {formatDate(selectedInternship.startDate)}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Application Deadline
              </span>
              <p className={`text-xs font-bold mt-0.5 truncate ${isUrgent ? 'text-rose-600' : 'text-slate-800'}`}>
                {formatDate(selectedInternship.deadline)}
              </p>
              <span className={`text-[11px] font-semibold ${isUrgent ? 'text-rose-600' : 'text-slate-500'}`}>
                {deadlineText}
              </span>
            </div>
          </div>

          {/* OFFICIAL SOURCE VERIFICATION SECTION */}
          <OfficialSourceBadge
            source={selectedInternship.officialSource}
            lastUpdated={selectedInternship.lastUpdated}
            showLink={true}
          />

          {/* Post-Apply Prompt if user clicked Apply */}
          {hasClickedApply && !isApplied && (
            <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">
                    Did you submit your application on {selectedInternship.officialSource.name}?
                  </h4>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    Track your progress through Screening, Assessments, and Interviews in SKILLORA's Application Tracker.
                  </p>
                </div>
                <button
                  id="btn-confirm-log-application"
                  onClick={handleLogApplication}
                  className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  Yes, Track Application
                </button>
              </div>
            </div>
          )}

          {/* SKILL MATCHING & FIT BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
              Smart Skill Match Analysis
            </h3>
            <MatchBadge match={match} showDetails={true} />
          </div>

          {/* About Role & Description */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              About the Opportunity
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedInternship.aboutRole}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {selectedInternship.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Requirements */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Eligibility & Academic Criteria
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-slate-500 block">Eligible Degrees:</span>
                <p className="mt-0.5">{selectedInternship.eligibility.degrees.join(', ')}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Target Graduation Classes:</span>
                <p className="mt-0.5">Classes of {selectedInternship.eligibility.batchYears.join(', ')}</p>
              </div>
              {selectedInternship.eligibility.minGpa && (
                <div>
                  <span className="font-semibold text-slate-500 block">Academic Benchmark:</span>
                  <p className="mt-0.5">{selectedInternship.eligibility.minGpa}</p>
                </div>
              )}
              {selectedInternship.eligibility.citizenship && (
                <div>
                  <span className="font-semibold text-slate-500 block">Work Authorization:</span>
                  <p className="mt-0.5">{selectedInternship.eligibility.citizenship}</p>
                </div>
              )}
            </div>
            {selectedInternship.eligibility.notes && (
              <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60">
                Note: {selectedInternship.eligibility.notes}
              </p>
            )}
          </div>

          {/* Perks & Mentorship */}
          {selectedInternship.perks && selectedInternship.perks.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Program Benefits & Perks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedInternship.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 p-2.5 text-xs text-slate-800"
                  >
                    <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Sticky Footer Actions */}
        <div className="border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">{selectedInternship.company}</span>
            <span>•</span>
            <span>Direct link to verified official application</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isApplied ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Currently Tracking in Applications</span>
              </div>
            ) : (
              <button
                id="btn-log-application-direct"
                onClick={handleLogApplication}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Mark as Applied
              </button>
            )}

            <button
              id="btn-apply-now-official"
              onClick={handleApplyNowClick}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-md"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
