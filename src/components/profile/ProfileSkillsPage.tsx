import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
  MapPin,
  Briefcase,
  Sliders,
  RotateCcw,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_SKILLS_CATALOG, POPULAR_ROLES, SKILL_CATEGORIES, SAMPLE_STUDENT_PROFILES } from '../../data/sampleProfiles';
import { StudentSkill, WorkType } from '../../types';

export const ProfileSkillsPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    updateProfile,
    addSkill,
    removeSkill,
    updateSkillProficiency,
    updatePreferences,
    showToast,
  } = useApp();

  // Basic Profile State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [university, setUniversity] = useState(currentUser?.university || '');
  const [degree, setDegree] = useState(currentUser?.degree || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [gradYear, setGradYear] = useState(currentUser?.graduationYear || 2026);
  const [gpa, setGpa] = useState(currentUser?.gpa || '3.80');
  const [location, setLocation] = useState(currentUser?.location || 'San Francisco, CA');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Skills adding state
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCat, setCustomSkillCat] = useState<StudentSkill['category']>('Languages');
  const [skillFilterCategory, setSkillFilterCategory] = useState('All');

  // Preferences State
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    currentUser?.preferences?.roles || ['Software Engineering']
  );
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<WorkType[]>(
    currentUser?.preferences?.workTypes || ['Remote', 'Hybrid']
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    currentUser?.preferences?.locations || ['San Francisco, CA', 'Remote']
  );
  const [newLocationInput, setNewLocationInput] = useState('');

  if (!currentUser) return null;

  const currentSkills = currentUser.skills || [];

  const handleSaveBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      university,
      degree,
      major,
      graduationYear: gradYear,
      gpa,
      location,
      bio,
    });
    showToast('Basic profile details saved.');
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

  const handleToggleRole = (role: string) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    updatePreferences({
      roles: updated.length > 0 ? updated : ['Software Engineering'],
      workTypes: selectedWorkTypes,
      locations: selectedLocations,
    });
  };

  const handleToggleWorkType = (wt: WorkType) => {
    let updated: WorkType[];
    if (selectedWorkTypes.includes(wt)) {
      if (selectedWorkTypes.length === 1) return;
      updated = selectedWorkTypes.filter((w) => w !== wt);
    } else {
      updated = [...selectedWorkTypes, wt];
    }
    setSelectedWorkTypes(updated);
    updatePreferences({
      roles: selectedRoles,
      workTypes: updated,
      locations: selectedLocations,
    });
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    const updated = [...selectedLocations, newLocationInput.trim()];
    setSelectedLocations(updated);
    updatePreferences({
      roles: selectedRoles,
      workTypes: selectedWorkTypes,
      locations: updated,
    });
    setNewLocationInput('');
  };

  const handleRemoveLocation = (loc: string) => {
    const updated = selectedLocations.filter((l) => l !== loc);
    setSelectedLocations(updated);
    updatePreferences({
      roles: selectedRoles,
      workTypes: selectedWorkTypes,
      locations: updated,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <User className="w-6 h-6 text-indigo-600" />
          <span>Student Profile & Skill Calibration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          SKILLORA continuously calibrates real match percentages against verified internship criteria based on the skills and preferences defined here.
        </p>
      </div>

      {/* Switch Demo Profile Bar */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
              Quick Profile Switcher
            </span>
            <p className="text-xs text-indigo-700 mt-0.5">
              Switch between different student specializations to see real-time match recalibration:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_STUDENT_PROFILES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setCurrentUser(sample);
                  setName(sample.name);
                  setEmail(sample.email);
                  setUniversity(sample.university);
                  setDegree(sample.degree);
                  setMajor(sample.major);
                  setGradYear(sample.graduationYear);
                  setLocation(sample.location);
                  setBio(sample.bio || '');
                  setSelectedRoles(sample.preferences.roles);
                  setSelectedWorkTypes(sample.preferences.workTypes);
                  setSelectedLocations(sample.preferences.locations);
                  showToast(`Switched profile to ${sample.name}`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentUser.id === sample.id
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white border border-indigo-200 text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                {currentUser.id === sample.id && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{sample.name.split(' ')[0]} ({sample.major.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* THREE MAIN WORKSPACES: Basic Details, Skills Manager, Internship Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Academic Details */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="font-display text-base font-bold text-slate-900">
              Academic & Contact Information
            </h2>
          </div>

          <form onSubmit={handleSaveBasicInfo} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GPA / Academic Score
                </label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="3.85"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Base
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio / Elevator Pitch
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your technical focus and projects..."
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
            >
              Save Details
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Skills & Target Preferences */}
        <div className="lg:col-span-2 space-y-8">
          {/* SKILLS MANAGER */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Technical & Professional Skills ({currentSkills.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set proficiency levels (Beg, Mid, Adv) to fine-tune matching accuracy.
                </p>
              </div>
            </div>

            {/* Active Skills List */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Your Calibrated Skills
              </span>

              {currentSkills.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/90 px-3 py-1 text-xs font-semibold text-indigo-900 shadow-2xs"
                    >
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-indigo-400">•</span>
                      <select
                        value={skill.proficiency}
                        onChange={(e) =>
                          updateSkillProficiency(
                            skill.id,
                            e.target.value as StudentSkill['proficiency']
                          )
                        }
                        className="bg-transparent text-[10px] font-bold text-indigo-800 border-none outline-hidden cursor-pointer"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-0.5 text-indigo-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove Skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick-Add From Catalog */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Add from standard catalog:</span>
                <div className="flex gap-1 overflow-x-auto text-[10px]">
                  <button
                    onClick={() => setSkillFilterCategory('All')}
                    className={`px-2 py-0.5 rounded-md ${
                      skillFilterCategory === 'All'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  {SKILL_CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSkillFilterCategory(cat)}
                      className={`px-2 py-0.5 rounded-md truncate max-w-[80px] ${
                        skillFilterCategory === cat
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 border border-slate-100 rounded-2xl bg-slate-50/40">
                {AVAILABLE_SKILLS_CATALOG.filter(
                  (s) =>
                    skillFilterCategory === 'All' || s.category === skillFilterCategory
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
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="Or type a custom skill (e.g. Next.js, WebAssembly, Swift)"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-xs"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* INTERNSHIP PREFERENCES */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Internship Target Roles & Preferences</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These preferences influence role fit weighting in recommendations.
              </p>
            </div>

            {/* Roles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target Roles
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

            {/* Work Modes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Work Arrangement Modes
              </label>
              <div className="flex gap-2">
                {(['Remote', 'Hybrid', 'On-site'] as WorkType[]).map((wt) => {
                  const isSelected = selectedWorkTypes.includes(wt);
                  return (
                    <button
                      key={wt}
                      onClick={() => handleToggleWorkType(wt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {wt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Locations */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Locations
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
                      onClick={() => handleRemoveLocation(loc)}
                      className="p-0.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddLocation} className="flex gap-2">
                <input
                  type="text"
                  value={newLocationInput}
                  onChange={(e) => setNewLocationInput(e.target.value)}
                  placeholder="Add city or region (e.g. Austin, TX, Remote)"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
