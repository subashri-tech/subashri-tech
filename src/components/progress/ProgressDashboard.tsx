import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';

export const ProgressDashboard: React.FC = () => {
  const { currentUser, applications, savedInternships, internships, setActiveTab } = useApp();

  const totalApplications = applications.length;
  const inReviewCount = applications.filter((a) => a.status === 'Screening').length;
  const assessmentsCount = applications.filter((a) => a.status === 'Assessment').length;
  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;
  const offersCount = applications.filter((a) => a.status === 'Offer').length;

  // Pipeline funnel steps
  const funnelSteps = [
    { label: 'Saved to Apply', count: savedInternships.length, color: 'bg-slate-700' },
    { label: 'Applications Sent', count: totalApplications, color: 'bg-indigo-600' },
    { label: 'Recruiter Screening', count: inReviewCount, color: 'bg-blue-500' },
    { label: 'Coding / Take-Home', count: assessmentsCount, color: 'bg-amber-500' },
    { label: 'Interviews Scheduled', count: interviewsCount, color: 'bg-purple-600' },
    { label: 'Offers Received', count: offersCount, color: 'bg-emerald-500' },
  ];

  // In-demand skills analysis across all internships
  const skillFrequencyMap = new Map<string, number>();
  internships.forEach((i) => {
    i.requiredSkills.forEach((s) => {
      skillFrequencyMap.set(s, (skillFrequencyMap.get(s) || 0) + 1);
    });
  });

  const topDemandSkills = Array.from(skillFrequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const studentSkillNames = new Set(
    (currentUser?.skills || []).map((s) => s.name.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <span>Internship Readiness & Progress Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your application pipeline momentum, high-demand skills in target roles, and skill coverage.
        </p>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
            Application Pipeline Funnel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage conversion from initial saving through interviews and offers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {funnelSteps.map((step, idx) => (
            <div
              key={step.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Stage 0{idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block leading-tight">
                  {step.label}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold text-slate-900">
                  {step.count}
                </span>
                <div className={`h-2 w-2 rounded-full ${step.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Demand vs Coverage Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Skill Demand */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>High-Demand Skills in Target Listings</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top technical requirements appearing in verified internships on SKILLORA.
            </p>
          </div>

          <div className="space-y-3">
            {topDemandSkills.map(([skill, count]) => {
              const hasSkill = studentSkillNames.has(skill.toLowerCase());
              const percent = Math.round((count / internships.length) * 100);

              return (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{skill}</span>
                      {hasSkill ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>In Your Profile</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Recommended to Learn</span>
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-semibold">{percent}% of postings</span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        hasSkill ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center block"
            >
              Update Skills in Profile
            </button>
          </div>
        </div>

        {/* Action Strategy & Recommendations */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                Actionable Next Steps
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted recommendations to boost your match scores and response rates.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Submit applications for saved roles
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have <strong className="text-slate-900">{savedInternships.length} saved internships</strong>. Review their official deadlines and apply early before review windows close.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Verify application tracking reference IDs
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure every application submitted has its official confirmation reference logged for easy tracking when recruiters email you.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Ready to discover more opportunities?
            </span>
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
