import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  Compass,
  Briefcase,
  MapPin,
  Code2,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_SKILLS_CATALOG, POPULAR_ROLES, SKILL_CATEGORIES } from '../../data/sampleProfiles';
import { StudentSkill, WorkType } from '../../types';

export const OnboardingWizard: React.FC = () => {
  const {
    currentUser,
    isOnboardingOpen,
    updateProfile,
    completeOnboarding,
    addSkill,
    removeSkill,
    updateSkillProficiency,
    updatePreferences,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 state
  const [name, setName] = useState(currentUser?.name || '');
  const [university, setUniversity] = useState(currentUser?.university || '');
  const [degree, setDegree] = useState(currentUser?.degree || 'B.S. in Computer Science');
  const [major, setMajor] = useState(currentUser?.major || 'Computer Science');
  const [gradYear, setGradYear] = useState(currentUser?.graduationYear || 2026);
  const [location, setLocation] = useState(currentUser?.location || 'San Francisco, CA');

  // Step 2 skills custom input
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCat, setCustomSkillCat] = useState<StudentSkill['category']>('Languages');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Step 3 preferences state
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    currentUser?.preferences?.roles || ['Software Engineering', 'Frontend & Web']
  );
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<WorkType[]>(
    currentUser?.preferences?.workTypes || ['Remote', 'Hybrid']
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    currentUser?.preferences?.locations || ['San Francisco, CA', 'Remote']
  );
  const [newLocationInput, setNewLocationInput] = useState('');

  if (!isOnboardingOpen || !currentUser) return null;

  const currentSkills = currentUser.skills || [];

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleToggleWorkType = (type: WorkType) => {
    if (selectedWorkTypes.includes(type)) {
      if (selectedWorkTypes.length > 1) {
        setSelectedWorkTypes(selectedWorkTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedWorkTypes([...selectedWorkTypes, type]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    addSkill({
      name: customSkillName.trim(),
      category: customSkillCat,
      proficiency: 'intermediate',
    });
    setCustomSkillName('');
  };

  const handleSaveStep1 = () => {
    updateProfile({
      name,
      university,
      degree,
      major,
      graduationYear: gradYear,
      location,
    });
    setStep(2);
  };

  const handleSaveStep3 = () => {
    updatePreferences({
      roles: selectedRoles.length > 0 ? selectedRoles : ['Software Engineering'],
      workTypes: selectedWorkTypes,
      locations: selectedLocations,
      durations: ['12 Weeks (Summer 2025)'],
      industries: ['Technology'],
    });
    setStep(4);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/10 max-h-[90vh] overflow-y-auto">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Student Onboarding</span>
            <span>Step {step} of 4</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic & Education Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Let's set up your student profile
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We'll use this to match you with verified internship opportunities and deadlines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="input-onboarding-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / College
                </label>
                <input
                  id="input-onboarding-university"
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. UC Berkeley"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Major / Field of Study
                </label>
                <input
                  id="input-onboarding-major"
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year
                </label>
                <select
                  id="select-onboarding-grad-year"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026 (Upcoming Junior/Senior)</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Location / Base
                </label>
                <input
                  id="input-onboarding-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Berkeley, CA or Remote"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="btn-onboarding-step1-next"
                onClick={handleSaveStep1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-xs"
              >
                <span>Continue to Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Skills Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Select your skills & proficiencies
                </h2>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {currentSkills.length} added
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                SKILLORA will calculate real match percentages and skill gaps for every role.
              </p>
            </div>

            {/* Current Added Skills Pillbox */}
            {currentSkills.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Your Active Skills ({currentSkills.length})
                </span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {currentSkills.map((sk) => (
                    <div
                      key={sk.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-900 shadow-2xs"
                    >
                      <span>{sk.name}</span>
                      <select
                        value={sk.proficiency}
                        onChange={(e) =>
                          updateSkillProficiency(
                            sk.id,
                            e.target.value as StudentSkill['proficiency']
                          )
                        }
                        className="bg-transparent text-[10px] font-bold text-indigo-700 border-none outline-hidden cursor-pointer"
                      >
                        <option value="beginner">Beg</option>
                        <option value="intermediate">Mid</option>
                        <option value="advanced">Adv</option>
                      </select>
                      <button
                        onClick={() => removeSkill(sk.id)}
                        className="p-0.5 text-indigo-400 hover:text-rose-600 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catalog Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Add from popular skills:</span>
                <div className="flex gap-1 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => setActiveCategoryFilter('All')}
                    className={`px-2 py-0.5 rounded-md ${
                      activeCategoryFilter === 'All'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {SKILL_CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-md truncate max-w-[90px] ${
                        activeCategoryFilter === cat
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/40">
                {AVAILABLE_SKILLS_CATALOG.filter(
                  (s) =>
                    activeCategoryFilter === 'All' || s.category === activeCategoryFilter
                ).map((catSkill) => {
                  const isAdded = currentSkills.some(
                    (s) => s.name.toLowerCase() === catSkill.name.toLowerCase()
                  );
                  return (
                    <button
                      key={catSkill.name}
                      onClick={() => {
                        if (!isAdded) {
                          addSkill({
                            name: catSkill.name,
                            category: catSkill.category,
                            proficiency: 'intermediate',
                          });
                        }
                      }}
                      disabled={isAdded}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 opacity-80 cursor-default'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3" />}
                      <span>{catSkill.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skill Input */}
            <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
              <input
                id="input-custom-skill-name"
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="Or type custom skill (e.g. Next.js, PyTorch, Swift)"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
              <button
                id="btn-add-custom-skill"
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
              >
                Add Skill
              </button>
            </form>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="btn-onboarding-step2-next"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-xs"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Internship Preferences */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Target Roles & Internship Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us your preferred work arrangements and domains for tailored recommendations.
              </p>
            </div>

            {/* Target Roles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Roles & Domains
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => handleToggleRole(role)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Work Arrangement
              </label>
              <div className="flex gap-2">
                {(['Remote', 'Hybrid', 'On-site'] as WorkType[]).map((type) => {
                  const isSelected = selectedWorkTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggleWorkType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Locations */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Cities / Regions
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800"
                  >
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{loc}</span>
                    <button
                      onClick={() =>
                        setSelectedLocations(selectedLocations.filter((l) => l !== loc))
                      }
                      className="p-0.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="input-onboarding-add-location"
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  placeholder="Add target location (e.g. Seattle, WA or New York, NY)"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
                <button
                  id="btn-onboarding-add-location"
                  type="button"
                  onClick={() => {
                    if (newLocationInput.trim()) {
                      setSelectedLocations([...selectedLocations, newLocationInput.trim()]);
                      setNewLocationInput('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                id="btn-onboarding-step3-next"
                onClick={handleSaveStep3}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-xs"
              >
                <span>Finish & Generate Matches</span>
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success & Match Readiness */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                You're Ready, {currentUser.name.split(' ')[0]}!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                SKILLORA has calibrated your skills against verified internship listings. Check your personalized recommendation scores, official application links, and deadlines.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Configured Skills:</span>
                <span className="font-bold text-slate-900">{currentSkills.length} skills</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Target Roles:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px] text-right">
                  {selectedRoles.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Work Modes:</span>
                <span className="font-bold text-slate-900">{selectedWorkTypes.join(', ')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-onboarding-complete-launch"
                onClick={completeOnboarding}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
              >
                <span>Launch My Match Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
