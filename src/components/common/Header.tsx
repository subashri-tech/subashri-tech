import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  Briefcase,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  UserCheck,
  TrendingUp,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationBell } from './NotificationBell';
import { SAMPLE_STUDENT_PROFILES } from '../../data/sampleProfiles';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    activeTab,
    setActiveTab,
    savedInternships,
    applications,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
    showToast,
    setFilters,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  interface NavItem {
    id: 'home' | 'explore' | 'saved' | 'applications' | 'progress' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore', icon: Compass },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      badge: savedInternships.length > 0 ? savedInternships.length : undefined,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Briefcase,
      badge: applications.length > 0 ? applications.length : undefined,
    },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Skills', icon: User },
  ];

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleSwitchDemoProfile = (profileId: string) => {
    const target = SAMPLE_STUDENT_PROFILES.find((p) => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      setIsProfileMenuOpen(false);
      showToast(`Switched profile to ${target.name} (${target.major})`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-8">
          <button
            id="logo-skillora"
            onClick={() => setActiveTab('home')}
            className="group flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-xs group-hover:bg-indigo-600 transition-colors">
              <span className="font-display text-lg font-extrabold tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  SKILLORA
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 hidden sm:inline">
                Verified Internship Discovery
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Quick Explore + Notifications + Profile Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Shortcut */}
          <button
            id="btn-quick-explore"
            onClick={() => {
              setActiveTab('explore');
            }}
            className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-800 transition-all shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search internships...</span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-400">
              /
            </kbd>
          </button>

          {/* Reminders / Notification Bell */}
          <NotificationBell />

          {/* User Account / Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1.5 pr-2.5 hover:bg-slate-100 transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 truncate max-w-[110px]">
                    {currentUser.university}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  id="dropdown-profile-menu"
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <p className="mt-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                      {currentUser.major} • Class of {currentUser.graduationYear}
                    </p>
                  </div>

                  {/* Switch Demo Profiles for instant testing */}
                  <div className="mt-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                      Switch Student Profile
                    </span>
                    <div className="mt-1 space-y-1">
                      {SAMPLE_STUDENT_PROFILES.map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => handleSwitchDemoProfile(sample.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            currentUser.id === sample.id
                              ? 'bg-indigo-50 text-indigo-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="truncate">{sample.name} ({sample.university})</span>
                          </div>
                          {currentUser.id === sample.id && (
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Manage Skills & Preferences</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-header-login"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Log In
              </button>
              <button
                id="btn-header-signup"
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold bg-slate-950 text-white hover:bg-indigo-600 rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
