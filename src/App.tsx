import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ExplorePage } from './components/explore/ExplorePage';
import { SavedPage } from './components/saved/SavedPage';
import { ApplicationsTrackerPage } from './components/applications/ApplicationsTrackerPage';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { ProfileSkillsPage } from './components/profile/ProfileSkillsPage';
import { InternshipDetailsModal } from './components/internship/InternshipDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AddReminderModal } from './components/reminders/AddReminderModal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'explore' && <ExplorePage />}
        {activeTab === 'saved' && <SavedPage />}
        {activeTab === 'applications' && <ApplicationsTrackerPage />}
        {activeTab === 'progress' && <ProgressDashboard />}
        {activeTab === 'profile' && <ProfileSkillsPage />}
      </main>

      {/* Global Modals */}
      <InternshipDetailsModal />
      <AuthModal />
      <OnboardingWizard />
      <AddReminderModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
