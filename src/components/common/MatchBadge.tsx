import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { SkillMatchResult } from '../../types';

interface MatchBadgeProps {
  match: SkillMatchResult;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  compact?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({
  match,
  size = 'md',
  showDetails = false,
  compact = false,
}) => {
  const { matchPercentage, matchVerdict, matchingSkills, missingSkills } = match;

  // Determine styling color scale based on threshold
  let bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-800';
  let pillClass = 'bg-emerald-600 text-white';
  let strokeColor = '#059669';

  if (matchPercentage >= 80) {
    bgClass = 'bg-emerald-50/90 border-emerald-200 text-emerald-900';
    pillClass = 'bg-emerald-600 text-white';
    strokeColor = '#059669';
  } else if (matchPercentage >= 60) {
    bgClass = 'bg-indigo-50/90 border-indigo-200 text-indigo-900';
    pillClass = 'bg-indigo-600 text-white';
    strokeColor = '#4f46e5';
  } else if (matchPercentage >= 40) {
    bgClass = 'bg-amber-50/90 border-amber-200 text-amber-900';
    pillClass = 'bg-amber-600 text-white';
    strokeColor = '#d97706';
  } else {
    bgClass = 'bg-slate-100 border-slate-200 text-slate-700';
    pillClass = 'bg-slate-600 text-white';
    strokeColor = '#64748b';
  }

  if (compact) {
    return (
      <div
        id="match-badge-compact"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass} shadow-2xs`}
        title={`${matchPercentage}% Match • ${matchingSkills.length} matching skills`}
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-80" />
        <span>{matchPercentage}% Match</span>
      </div>
    );
  }

  return (
    <div id="match-badge-container" className={`rounded-xl border p-3.5 ${bgClass} transition-all`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${pillClass}`}>
            {matchPercentage}%
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider block">
              Skill Alignment
            </span>
            <span className="text-xs font-medium opacity-90">{matchVerdict}</span>
          </div>
        </div>

        {/* Small radial visual ring */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray={`${matchPercentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke={strokeColor}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[10px] font-bold">
            {matchPercentage}%
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-700">
        {match.explanation}
      </p>

      {showDetails && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-2">
          {matchingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Matching Skills ({matchingSkills.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {matchingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-block text-[11px] font-medium bg-emerald-100/80 text-emerald-900 px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 mb-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Skills to Learn ({missingSkills.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {missingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-block text-[11px] font-medium bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
