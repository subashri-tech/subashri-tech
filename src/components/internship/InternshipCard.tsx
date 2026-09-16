import React from 'react';
import {
  Bookmark,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Internship } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';
import { getDaysRemaining } from '../../utils/dates';
import { OfficialSourceBadge } from '../common/OfficialSourceBadge';

interface InternshipCardProps {
  internship: Internship;
  layout?: 'grid' | 'list';
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  layout = 'grid',
}) => {
  const {
    currentUser,
    setSelectedInternship,
    isInternshipSaved,
    toggleSaveInternship,
    isInternshipApplied,
  } = useApp();

  const match = calculateSkillMatch(currentUser, internship);
  const isSaved = isInternshipSaved(internship.id);
  const isApplied = isInternshipApplied(internship.id);
  const { text: deadlineText, isUrgent, isExpired } = getDaysRemaining(internship.deadline);

  // Match indicator style
  let matchBadgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  if (match.matchPercentage >= 80) {
    matchBadgeColor = 'bg-emerald-50 text-emerald-900 border-emerald-200';
  } else if (match.matchPercentage >= 60) {
    matchBadgeColor = 'bg-indigo-50 text-indigo-900 border-indigo-200';
  } else if (match.matchPercentage >= 40) {
    matchBadgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
  }

  if (layout === 'list') {
    return (
      <div
        id={`card-internship-${internship.id}`}
        className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200/80 font-display font-bold text-slate-800 text-base shadow-2xs">
            {internship.company.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold text-slate-900">{internship.company}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{internship.department}</span>
              {internship.isNew && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-700">
                  New
                </span>
              )}
              {isApplied && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Applied
                </span>
              )}
            </div>

            <h3
              onClick={() => setSelectedInternship(internship)}
              className="font-display text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
            >
              {internship.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{internship.location} ({internship.workType})</span>
              </div>
              <div className="flex items-center gap-1 font-medium text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>{internship.stipend.split('+')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className={isUrgent ? 'font-bold text-rose-600' : 'text-slate-600'}>
                  Deadline: {deadlineText}
                </span>
              </div>
            </div>

            {/* Matching skills preview */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <OfficialSourceBadge source={internship.officialSource} compact />
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Top skills:</span>
                {internship.requiredSkills.slice(0, 3).map((sk) => (
                  <span
                    key={sk}
                    className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Match score & actions */}
        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${matchBadgeColor}`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{match.matchPercentage}% Skill Match</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`btn-save-internship-${internship.id}`}
              onClick={() => toggleSaveInternship(internship.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Internship'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              id={`btn-view-details-${internship.id}`}
              onClick={() => setSelectedInternship(internship)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-2xs"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Default)
  return (
    <div
      id={`card-internship-${internship.id}`}
      className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Company + Save Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-display font-bold text-sm shadow-2xs">
              {internship.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{internship.company}</p>
              <p className="text-[11px] text-slate-500 truncate">{internship.department}</p>
            </div>
          </div>

          <button
            id={`btn-save-internship-grid-${internship.id}`}
            onClick={() => toggleSaveInternship(internship.id)}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
            }`}
            title={isSaved ? 'Saved' : 'Save for later'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => setSelectedInternship(internship)}
          className="mt-3.5 font-display text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
        >
          {internship.title}
        </h3>

        {/* Badges: Work Type, Location, Stipend */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[130px]">{internship.location.split('/')[0]}</span>
          </span>
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {internship.workType}
          </span>
          <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-900">
            {internship.stipend.split('+')[0]}
          </span>
        </div>

        {/* Skill Match Explanation Pill */}
        <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${matchBadgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{match.matchPercentage}% Match</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {match.matchingSkills.length}/{internship.requiredSkills.length} skills matched
            </span>
          </div>

          <p className="mt-1.5 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {match.explanation}
          </p>
        </div>

        {/* Required Skills Tag list */}
        <div className="mt-3 flex flex-wrap gap-1">
          {internship.requiredSkills.slice(0, 4).map((sk) => {
            const isMatched = match.matchingSkills.includes(sk);
            return (
              <span
                key={sk}
                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  isMatched
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {sk}
              </span>
            );
          })}
          {internship.requiredSkills.length > 4 && (
            <span className="text-[10px] text-slate-400 py-0.5 px-1 font-medium">
              +{internship.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Official Source + Deadline + View Details CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <OfficialSourceBadge source={internship.officialSource} compact />
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className={isUrgent ? 'font-bold text-rose-600' : 'text-slate-500'}>
              {deadlineText}
            </span>
          </div>
        </div>

        <button
          id={`btn-open-modal-${internship.id}`}
          onClick={() => setSelectedInternship(internship)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-2xs"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
