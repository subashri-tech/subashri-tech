import React from 'react';
import { ShieldCheck, Compass, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white font-display font-bold text-sm">
                S
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                SKILLORA
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              A student-first career platform where skills meet genuine, verified internship opportunities. Transparent matching, verified official sources, and deadline reminders.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Official Application Sources Only</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Explore Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('saved')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Saved Internships
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Application Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Personal Progress
                </button>
              </li>
            </ul>
          </div>

          {/* Core Philosophy */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              The 7-Step Model
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded">1. Discover</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">2. Match</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">3. Explore</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">4. Verify</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">5. Apply</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">6. Track</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">7. Remember</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} SKILLORA. Crafted for students pursuing exceptional careers.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Zero Spam • Verified Postings • Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
