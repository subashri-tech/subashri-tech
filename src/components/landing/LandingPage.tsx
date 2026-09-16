import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Briefcase,
  Bookmark,
  Bell,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_STUDENT_PROFILES } from '../../data/sampleProfiles';

export const LandingPage: React.FC = () => {
  const {
    setIsAuthModalOpen,
    setAuthModalMode,
    setActiveTab,
    setCurrentUser,
    showToast,
  } = useApp();

  const journeySteps = [
    {
      step: '01',
      title: 'Discover',
      desc: 'Browse curated, genuine internships across top tech companies, startups, and open research labs.',
      icon: Compass,
      color: 'bg-indigo-600 text-white',
    },
    {
      step: '02',
      title: 'Match',
      desc: 'Smart weighted algorithm calculates exact skill alignment, matching strengths, and missing requirements.',
      icon: Sparkles,
      color: 'bg-indigo-600 text-white',
    },
    {
      step: '03',
      title: 'Explore',
      desc: 'Filter by work mode (Remote/Hybrid), stipend, eligibility, and closing dates.',
      icon: TrendingUp,
      color: 'bg-indigo-600 text-white',
    },
    {
      step: '04',
      title: 'Verify',
      desc: 'Every listing links directly to the official university or career portal with verified reference IDs.',
      icon: ShieldCheck,
      color: 'bg-emerald-600 text-white',
    },
    {
      step: '05',
      title: 'Apply',
      desc: 'Direct one-click access to official submission forms with guidance notes.',
      icon: ExternalLink,
      color: 'bg-slate-900 text-white',
    },
    {
      step: '06',
      title: 'Track',
      desc: 'Kanban pipeline managing stages: Applied, Screening, Assessment, Interview, and Offer.',
      icon: Briefcase,
      color: 'bg-slate-900 text-white',
    },
    {
      step: '07',
      title: 'Remember',
      desc: 'Integrated deadline timers and assessment alerts so you never miss a submission window.',
      icon: Bell,
      color: 'bg-amber-600 text-white',
    },
  ];

  const handleQuickDemo = (profileId: string) => {
    const target = SAMPLE_STUDENT_PROFILES.find((p) => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      setActiveTab('home');
      showToast(`Welcome! Logged in as ${target.name}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>The Smart Internship Discovery & Guidance Platform</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Where student skills meet{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
            genuine opportunities.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SKILLORA eliminates the confusion of internship search. Discover opportunities matched to your skill profile, verify official portals, and manage your entire application timeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-landing-get-started"
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-600 transition-all shadow-md"
          >
            <span>Create Student Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-landing-explore-now"
            onClick={() => setActiveTab('explore')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Explore Verified Listings</span>
          </button>
        </div>

        {/* Quick Demo Student Pills */}
        <div className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Or test instantly with a sample profile:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SAMPLE_STUDENT_PROFILES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleQuickDemo(sample.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs transition-all"
              >
                <img
                  src={sample.avatar}
                  alt={sample.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{sample.name} ({sample.major.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* THE 7-STEP PRODUCT JOURNEY */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            The Complete Student Career Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built from the ground up to solve the real hurdles students face when applying to internships.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {journeySteps.map((j) => {
            const Icon = j.icon;
            return (
              <div
                key={j.step}
                className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${j.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">{j.step}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {j.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {j.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VERIFIED SOURCES GUARANTEE SECTION */}
      <section className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-700/80 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Genuine, Verified Postings</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Say goodbye to fake job board reposts and expired listings.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every internship on SKILLORA is verified with a timestamped official portal link, reference ID, and clear qualification requirements. No ghost postings, no third-party spam aggregators.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official Company Career Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>University Job Portals (Handshake/Symplicity)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official Reference IDs for Tracking</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
