import React from 'react';
import {
  Sparkles,
  Compass,
  Bookmark,
  Briefcase,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Plus,
  CheckCircle2,
  AlertCircle,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';
import { formatDate, getDaysRemaining } from '../../utils/dates';
import { InternshipCard } from '../internship/InternshipCard';
import { OfficialSourceBadge } from '../common/OfficialSourceBadge';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    internships,
    savedInternships,
    applications,
    reminders,
    setActiveTab,
    setSelectedInternship,
    setIsAddReminderModalOpen,
    toggleReminderComplete,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  // Sort internships by match percentage for the current user
  const matchedInternships = [...internships]
    .map((internship) => ({
      internship,
      match: calculateSkillMatch(currentUser, internship),
    }))
    .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

  const topRecommendations = matchedInternships.slice(0, 4);
  const newOpportunities = internships.filter((i) => i.isNew).slice(0, 4);

  const activeReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // Application stage counts
  const interviewsCount = applications.filter(
    (a) => a.status === 'Interview' || a.status === 'Assessment'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Internship Discovery & Application Intelligence</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {currentUser ? (
              <>
                Welcome back, {currentUser.name.split(' ')[0]} 👋
                <span className="block text-slate-400 text-lg sm:text-xl font-normal mt-1">
                  Matched to {currentUser.major} & {currentUser.skills.length} verified profile skills
                </span>
              </>
            ) : (
              <>
                Where student skills meet genuine, verified opportunities.
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Discover internships aligned with your exact stack, verify official portals, track applications across stages, and never miss critical deadlines.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-home-explore-all"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-all shadow-xs"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Explore All Opportunities</span>
            </button>

            {currentUser ? (
              <button
                id="btn-home-view-tracker"
                onClick={() => setActiveTab('applications')}
                className="flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all"
              >
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>My Applications ({applications.length})</span>
              </button>
            ) : (
              <button
                id="btn-home-create-profile"
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all"
              >
                <span>Create Student Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtle geometric background motif */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-4 opacity-10 pointer-events-none hidden md:block">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Quick Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('explore')}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Listings
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {internships.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            100% official company portals
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saved Internships
            </span>
            <Bookmark className="w-4 h-4 text-rose-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {savedInternships.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Opportunities to apply
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In Active Pipeline
            </span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {applications.length}
          </p>
          <span className="text-[11px] text-indigo-600 font-medium">
            {interviewsCount} in assessment/interview
          </span>
        </button>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upcoming Deadlines
            </span>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">
            {activeReminders.length}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            Active time-sensitive tasks
          </span>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: Recommended Matches + Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recommended For You */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Recommended For You</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top opportunities ranked by skill overlap with your profile.
              </p>
            </div>

            <button
              id="btn-see-all-recommended"
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All ({internships.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topRecommendations.map(({ internship }) => (
              <InternshipCard key={internship.id} internship={internship} layout="grid" />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Upcoming Reminders</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deadlines, tests & interview tasks.
              </p>
            </div>

            <button
              id="btn-home-add-reminder"
              onClick={() => setIsAddReminderModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
              title="Add New Reminder"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
            {activeReminders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-600">No pending deadlines</p>
                <button
                  onClick={() => setIsAddReminderModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  + Add your first reminder
                </button>
              </div>
            ) : (
              activeReminders.map((reminder) => {
                const { text: daysText, isUrgent } = getDaysRemaining(reminder.dueDate);
                const linked = reminder.internshipId
                  ? internships.find((i) => i.id === reminder.internshipId)
                  : null;

                return (
                  <div
                    key={reminder.id}
                    className="rounded-xl border border-slate-200/80 p-3 hover:border-indigo-300 hover:bg-slate-50/50 transition-all flex items-start gap-3"
                  >
                    <button
                      onClick={() => toggleReminderComplete(reminder.id)}
                      className="mt-0.5 h-4 w-4 rounded-full border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 flex items-center justify-center text-transparent hover:text-emerald-600 transition-colors shrink-0"
                      title="Mark Complete"
                    >
                      <Check className="w-2.5 h-2.5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            reminder.type === 'Deadline'
                              ? 'bg-rose-100 text-rose-800'
                              : reminder.type === 'Interview'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
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

                      <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {reminder.title}
                      </p>

                      {linked && (
                        <button
                          onClick={() => setSelectedInternship(linked)}
                          className="text-[11px] text-indigo-600 hover:underline block truncate mt-0.5"
                        >
                          {linked.company} • {linked.title}
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(reminder.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => setIsAddReminderModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW OPPORTUNITIES SECTION */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Recently Verified Opportunities</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fresh listings directly sourced and verified from company portals.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newOpportunities.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} layout="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};
