import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, GraduationCap, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_STUDENT_PROFILES } from '../../data/sampleProfiles';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    setCurrentUser,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const success = login(email);
    if (!success) {
      setError('No student account found with this email. Try demo accounts below or Sign Up.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !university) {
      setError('Please fill in all required fields');
      return;
    }

    signup({
      name,
      email,
      university,
      degree,
      graduationYear: gradYear,
      major: degree.replace(/^B\.S\. in |^M\.S\. in |^B\.A\. in /, '') || 'Computer Science',
    });
  };

  const handleQuickDemoLogin = (profileId: string) => {
    const target = SAMPLE_STUDENT_PROFILES.find((p) => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      setIsAuthModalOpen(false);
      showToast(`Logged in as ${target.name}!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/10">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white font-display font-bold text-lg">
            S
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-slate-900">
            {authModalMode === 'login' ? 'Welcome back to SKILLORA' : 'Create your Student Account'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {authModalMode === 'login'
              ? 'Access your personalized match dashboard and saved opportunities'
              : 'Discover internships matched with your unique skills and ambitions'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 flex rounded-xl bg-slate-100 p-1">
          <button
            id="tab-auth-login"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
              authModalMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            id="tab-auth-signup"
            onClick={() => {
              setAuthModalMode('signup');
              setError('');
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${
              authModalMode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        {authModalMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email (.edu or personal)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@berkeley.edu"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Demo password not required</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-sm font-bold text-white hover:bg-indigo-600 transition-colors shadow-xs"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignupSubmit} className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.lee@university.edu"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="input-signup-university"
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Stanford"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year
                </label>
                <select
                  id="select-signup-grad-year"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree Program
              </label>
              <input
                id="input-signup-degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="B.S. in Computer Science"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <button
              id="btn-submit-signup"
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-sm font-bold text-white hover:bg-indigo-600 transition-colors shadow-xs"
            >
              <span>Continue to Skill Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* One-Click Demo Accounts */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Or Instant Demo Student Login
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_STUDENT_PROFILES.map((sample) => (
              <button
                key={sample.id}
                id={`btn-demo-login-${sample.id}`}
                onClick={() => handleQuickDemoLogin(sample.id)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-200 text-left transition-all"
              >
                <img
                  src={sample.avatar}
                  alt={sample.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{sample.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{sample.major.split(' ')[0]} • {sample.university}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
