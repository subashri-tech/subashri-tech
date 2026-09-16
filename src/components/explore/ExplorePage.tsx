import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  Clock,
  X,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSkillMatch } from '../../utils/matching';
import { getDaysRemaining } from '../../utils/dates';
import { InternshipCard } from '../internship/InternshipCard';
import { InternshipCategory, WorkType } from '../../types';

export const ExplorePage: React.FC = () => {
  const { internships, currentUser, filters, setFilters, resetFilters } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories: InternshipCategory[] = [
    'Software Engineering',
    'Frontend & Web',
    'Backend & Cloud',
    'Data & AI',
    'Product Design / UI',
    'Cybersecurity',
    'Product Management',
    'DevOps & Systems',
  ];

  const workTypes: WorkType[] = ['Remote', 'Hybrid', 'On-site'];

  // Process and filter internships
  const filteredInternships = useMemo(() => {
    return internships
      .map((internship) => {
        const match = calculateSkillMatch(currentUser, internship);
        const { isUrgent, isExpired, days } = getDaysRemaining(internship.deadline);
        return {
          internship,
          match,
          isUrgent,
          isExpired,
          days,
        };
      })
      .filter(({ internship, match, days }) => {
        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchesText =
            internship.title.toLowerCase().includes(q) ||
            internship.company.toLowerCase().includes(q) ||
            internship.department.toLowerCase().includes(q) ||
            internship.location.toLowerCase().includes(q) ||
            internship.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
            internship.preferredSkills.some((s) => s.toLowerCase().includes(q));

          if (!matchesText) return false;
        }

        // Category filter
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(internship.category)
        ) {
          return false;
        }

        // Work Type filter
        if (
          filters.workTypes.length > 0 &&
          !filters.workTypes.includes(internship.workType)
        ) {
          return false;
        }

        // Min Match Score filter
        if (filters.minMatchScore > 0 && match.matchPercentage < filters.minMatchScore) {
          return false;
        }

        // Only Verified Sources
        if (filters.onlyVerified && !internship.officialSource.isVerified) {
          return false;
        }

        // Only New Postings
        if (filters.onlyNew && !internship.isNew) {
          return false;
        }

        // Closing Soon (< 14 days)
        if (filters.closingSoon && (days < 0 || days > 14)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match') {
          return b.match.matchPercentage - a.match.matchPercentage;
        }
        if (filters.sortBy === 'deadline') {
          return new Date(a.internship.deadline).getTime() - new Date(b.internship.deadline).getTime();
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.internship.postedDate).getTime() - new Date(a.internship.postedDate).getTime();
        }
        if (filters.sortBy === 'company') {
          return a.internship.company.localeCompare(b.internship.company);
        }
        return 0;
      });
  }, [internships, currentUser, filters]);

  const handleToggleCategory = (cat: InternshipCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleToggleWorkType = (wt: WorkType) => {
    setFilters((prev) => {
      const exists = prev.workTypes.includes(wt);
      return {
        ...prev,
        workTypes: exists
          ? prev.workTypes.filter((w) => w !== wt)
          : [...prev.workTypes, wt],
      };
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.workTypes.length +
    (filters.minMatchScore > 0 ? 1 : 0) +
    (filters.onlyVerified ? 1 : 0) +
    (filters.onlyNew ? 1 : 0) +
    (filters.closingSoon ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Search & Control Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Explore Verified Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search verified company opportunities calibrated against your skills and target preferences.
          </p>
        </div>

        {/* Search and Quick Options Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="input-explore-search"
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search by role, company, skill (e.g. React, Python, Distributed Systems), or city..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="select-sort-by"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as typeof prev.sortBy,
                  }))
                }
                className="bg-transparent border-none outline-hidden text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="match">Sort: Highest Match %</option>
                <option value="deadline">Sort: Closing Soonest</option>
                <option value="newest">Sort: Recently Added</option>
                <option value="company">Sort: Company Name</option>
              </select>
            </div>

            {/* Layout Switcher */}
            <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-list"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fast Filter Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, categories: [] }))}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              filters.categories.length === 0
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Roles
          </button>
          {categories.map((cat) => {
            const isSelected = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleToggleCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Tags Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Work types */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
              {workTypes.map((wt) => {
                const isSelected = filters.workTypes.includes(wt);
                return (
                  <button
                    key={wt}
                    onClick={() => handleToggleWorkType(wt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {wt}
                  </button>
                );
              })}
            </div>

            {/* Min match dropdown */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <select
                id="select-min-match"
                value={filters.minMatchScore}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minMatchScore: Number(e.target.value),
                  }))
                }
                className="bg-transparent border-none outline-hidden text-xs font-semibold cursor-pointer text-slate-800"
              >
                <option value={0}>All Match Scores</option>
                <option value={80}>≥ 80% Strong Match</option>
                <option value={60}>≥ 60% Moderate Match</option>
                <option value={40}>≥ 40% Entry Match</option>
              </select>
            </div>

            {/* Verified toggle button */}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, onlyVerified: !prev.onlyVerified }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filters.onlyVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Only</span>
            </button>

            {/* Closing soon toggle */}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, closingSoon: !prev.closingSoon }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filters.closingSoon
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Closing Soon (&lt;14d)</span>
            </button>
          </div>

          {/* Active Filter Clear */}
          {activeFiltersCount > 0 && (
            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900">{filteredInternships.length}</strong> of{' '}
          {internships.length} verified opportunities
        </span>
        {currentUser && (
          <span className="hidden sm:inline">
            Matches calibrated to: <strong className="text-indigo-600">{currentUser.major}</strong>
          </span>
        )}
      </div>

      {/* Internship Cards Grid / List */}
      {filteredInternships.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            No matching internships found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, lowering the minimum match threshold, or resetting your filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map(({ internship }) => (
            <InternshipCard key={internship.id} internship={internship} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInternships.map(({ internship }) => (
            <InternshipCard key={internship.id} internship={internship} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};
