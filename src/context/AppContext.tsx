import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Internship,
  StudentProfile,
  SavedInternship,
  Application,
  Reminder,
  FilterOptions,
  ApplicationStatus,
  StudentSkill,
  StudentPreferences,
} from '../types';
import { INITIAL_INTERNSHIPS } from '../data/mockInternships';
import { SAMPLE_STUDENT_PROFILES } from '../data/sampleProfiles';
import { sendLocalNotification } from '../utils/notifications';

interface AppContextType {
  // Auth & Profile
  currentUser: StudentProfile | null;
  allUsers: StudentProfile[];
  setCurrentUser: (user: StudentProfile | null) => void;
  login: (email: string) => boolean;
  signup: (profile: Partial<StudentProfile>) => StudentProfile;
  logout: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  addSkill: (skill: Omit<StudentSkill, 'id'>) => void;
  removeSkill: (skillId: string) => void;
  updateSkillProficiency: (skillId: string, proficiency: StudentSkill['proficiency']) => void;
  updatePreferences: (preferences: StudentPreferences) => void;
  completeOnboarding: () => void;

  // Opportunities
  internships: Internship[];
  selectedInternship: Internship | null;
  setSelectedInternship: (internship: Internship | null) => void;

  // Saved Internships
  savedInternships: SavedInternship[];
  isInternshipSaved: (internshipId: string) => boolean;
  toggleSaveInternship: (internshipId: string, notes?: string) => void;
  updateSavedNotes: (internshipId: string, notes: string) => void;

  // Applications
  applications: Application[];
  isInternshipApplied: (internshipId: string) => boolean;
  getApplicationByInternshipId: (internshipId: string) => Application | undefined;
  createApplication: (internshipId: string, notes?: string, officialRef?: string) => Application;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, note?: string) => void;
  deleteApplication: (applicationId: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'studentId'>) => Reminder;
  toggleReminderComplete: (reminderId: string) => void;
  deleteReminder: (reminderId: string) => void;

  // Navigation & UI States
  activeTab: 'home' | 'explore' | 'saved' | 'applications' | 'progress' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'saved' | 'applications' | 'progress' | 'profile') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAddReminderModalOpen: boolean;
  setIsAddReminderModalOpen: (open: boolean) => void;
  reminderPrefillInternshipId: string | null;
  setReminderPrefillInternshipId: (id: string | null) => void;

  // Explore Filters
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  // Global Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  categories: [],
  workTypes: [],
  minMatchScore: 0,
  locations: [],
  durations: [],
  onlyVerified: false,
  onlyNew: false,
  closingSoon: false,
  sortBy: 'match',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization
  const [allUsers, setAllUsers] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('skillora_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users:', e);
      }
    }
    return SAMPLE_STUDENT_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(() => {
    const savedId = localStorage.getItem('skillora_current_user_id');
    if (savedId) {
      const found = allUsers.find((u) => u.id === savedId);
      if (found) return found;
    }
    // Default to the first demo student profile for instant rich experience
    return allUsers[0] || SAMPLE_STUDENT_PROFILES[0];
  });

  const [internships] = useState<Internship[]>(INITIAL_INTERNSHIPS);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Saved Internships
  const [savedInternships, setSavedInternships] = useState<SavedInternship[]>(() => {
    const saved = localStorage.getItem('skillora_saved');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial demo saved items for Alex Chen
    return [
      {
        id: 'save-1',
        studentId: 'student-alex-chen',
        internshipId: 'int-stripe-swe-2025',
        savedAt: '2026-08-25T10:00:00Z',
        notes: 'Priority application. Need to polish distributed systems project on resume before applying.',
      },
      {
        id: 'save-2',
        studentId: 'student-alex-chen',
        internshipId: 'int-cloudflare-systems-2025',
        savedAt: '2026-08-26T14:30:00Z',
        notes: 'Great match with Rust & Linux systems networking.',
      },
    ];
  });

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('skillora_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial demo applications
    return [
      {
        id: 'app-1',
        studentId: 'student-alex-chen',
        internshipId: 'int-notion-fullstack-2025',
        appliedDate: '2026-08-29',
        status: 'Screening',
        officialReferenceId: 'NOT-AI-2025-APP-8831',
        notes: 'Submitted resume and GitHub link through Notion university portal.',
        nextAction: 'Recruiter phone screen scheduled for Sept 8',
        nextActionDate: '2026-09-08',
        timeline: [
          { id: 't1', stage: 'Applied', date: '2026-08-29', notes: 'Submitted via official Notion portal' },
          { id: 't2', stage: 'Screening', date: '2026-08-31', notes: 'Recruiter reached out with screening invite' },
        ],
      },
      {
        id: 'app-2',
        studentId: 'student-alex-chen',
        internshipId: 'int-google-swe-2025',
        appliedDate: '2026-08-20',
        status: 'Assessment',
        officialReferenceId: 'GOOG-CAREERS-92410',
        notes: 'Completed Snapshot survey. Received Online Technical Assessment link.',
        nextAction: 'Complete 90-minute Coding Assessment by Sept 10',
        nextActionDate: '2026-09-10',
        timeline: [
          { id: 't3', stage: 'Applied', date: '2026-08-20', notes: 'Submitted application on Google Student portal' },
          { id: 't4', stage: 'Assessment', date: '2026-08-28', notes: 'Received HackerRank challenge link' },
        ],
      },
    ];
  });

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('skillora_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'rem-1',
        studentId: 'student-alex-chen',
        internshipId: 'int-figma-fe-2025',
        title: 'Figma Web Platform Application Deadline',
        type: 'Deadline',
        dueDate: '2026-09-30',
        dueTime: '23:59',
        notes: 'Submit portfolio link and updated React project demo.',
        completed: false,
        priority: 'high',
        createdAt: '2026-08-28T09:00:00Z',
      },
      {
        id: 'rem-2',
        studentId: 'student-alex-chen',
        internshipId: 'int-google-swe-2025',
        title: 'Google Online Assessment (HackerRank)',
        type: 'Assessment',
        dueDate: '2026-09-10',
        dueTime: '17:00',
        notes: 'Prepare graphs, dynamic programming, and system invariants.',
        completed: false,
        priority: 'high',
        createdAt: '2026-08-29T11:00:00Z',
      },
      {
        id: 'rem-3',
        studentId: 'student-alex-chen',
        internshipId: 'int-notion-fullstack-2025',
        title: 'Notion Recruiter Phone Screen',
        type: 'Interview',
        dueDate: '2026-09-08',
        dueTime: '14:00',
        notes: 'Review questions on product passion, React architecture, and previous internships.',
        completed: false,
        priority: 'medium',
        createdAt: '2026-08-31T15:00:00Z',
      },
    ];
  });

  // Navigation & UI
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'saved' | 'applications' | 'progress' | 'profile'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [reminderPrefillInternshipId, setReminderPrefillInternshipId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('skillora_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillora_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('skillora_current_user_id');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skillora_saved', JSON.stringify(savedInternships));
  }, [savedInternships]);

  useEffect(() => {
    localStorage.setItem('skillora_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('skillora_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Auth Functions
  const login = (email: string): boolean => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${found.name.split(' ')[0]}!`);
      return true;
    }
    return false;
  };

  const signup = (profileData: Partial<StudentProfile>): StudentProfile => {
    const newId = `student-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: newId,
      name: profileData.name || 'New Student',
      email: profileData.email || `student_${Date.now()}@university.edu`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      university: profileData.university || 'University of Tech',
      degree: profileData.degree || 'B.S. in Computer Science',
      major: profileData.major || 'Computer Science',
      graduationYear: profileData.graduationYear || 2026,
      location: profileData.location || 'San Francisco, CA',
      bio: profileData.bio || 'Aspiring software engineer excited to learn and build real-world software.',
      gpa: profileData.gpa || '3.80',
      skills: profileData.skills || [
        { id: `sk-1`, name: 'Python', category: 'Languages', proficiency: 'intermediate' },
        { id: `sk-2`, name: 'Git', category: 'Tools & Cloud', proficiency: 'intermediate' },
      ],
      preferences: profileData.preferences || {
        roles: ['Software Engineering'],
        workTypes: ['Hybrid', 'Remote'],
        locations: ['San Francisco, CA', 'Remote'],
        durations: ['12 Weeks (Summer 2025)'],
        industries: ['Technology'],
      },
      onboardingCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
    };

    setAllUsers((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(true);
    showToast(`Account created! Let's set up your skills and preferences.`);
    return newStudent;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated, lastActive: new Date().toISOString().split('T')[0] };
    setCurrentUser(newProfile);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? newProfile : u)));
    showToast('Profile updated successfully.');
  };

  const addSkill = (skillData: Omit<StudentSkill, 'id'>) => {
    if (!currentUser) return;
    const exists = currentUser.skills.some(
      (s) => s.name.toLowerCase() === skillData.name.toLowerCase()
    );
    if (exists) {
      showToast(`Skill "${skillData.name}" is already in your profile.`);
      return;
    }
    const newSkill: StudentSkill = {
      ...skillData,
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };
    const updatedSkills = [...currentUser.skills, newSkill];
    updateProfile({ skills: updatedSkills });
    showToast(`Added ${skillData.name} to your skills!`);
  };

  const removeSkill = (skillId: string) => {
    if (!currentUser) return;
    const updatedSkills = currentUser.skills.filter((s) => s.id !== skillId);
    updateProfile({ skills: updatedSkills });
    showToast('Skill removed.');
  };

  const updateSkillProficiency = (skillId: string, proficiency: StudentSkill['proficiency']) => {
    if (!currentUser) return;
    const updatedSkills = currentUser.skills.map((s) => (s.id === skillId ? { ...s, proficiency } : s));
    updateProfile({ skills: updatedSkills });
  };

  const updatePreferences = (preferences: StudentPreferences) => {
    if (!currentUser) return;
    updateProfile({ preferences });
    showToast('Internship preferences saved.');
  };

  const completeOnboarding = () => {
    if (!currentUser) return;
    updateProfile({ onboardingCompleted: true });
    setIsOnboardingOpen(false);
    showToast('Onboarding complete! Your personalized recommendations are ready.');
  };

  // Saved Internships functions
  const isInternshipSaved = (internshipId: string): boolean => {
    if (!currentUser) return false;
    return savedInternships.some(
      (s) => s.studentId === currentUser.id && s.internshipId === internshipId
    );
  };

  const toggleSaveInternship = (internshipId: string, notes?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const exists = savedInternships.find(
      (s) => s.studentId === currentUser.id && s.internshipId === internshipId
    );
    if (exists) {
      setSavedInternships((prev) => prev.filter((s) => s.id !== exists.id));
      showToast('Removed from Saved Internships.');
    } else {
      const newSaved: SavedInternship = {
        id: `save-${Date.now()}`,
        studentId: currentUser.id,
        internshipId,
        savedAt: new Date().toISOString(),
        notes: notes || '',
      };
      setSavedInternships((prev) => [newSaved, ...prev]);
      showToast('Saved to your opportunities!');
    }
  };

  const updateSavedNotes = (internshipId: string, notes: string) => {
    if (!currentUser) return;
    setSavedInternships((prev) =>
      prev.map((s) =>
        s.studentId === currentUser.id && s.internshipId === internshipId
          ? { ...s, notes }
          : s
      )
    );
    showToast('Notes updated.');
  };

  // Applications functions
  const isInternshipApplied = (internshipId: string): boolean => {
    if (!currentUser) return false;
    return applications.some(
      (a) => a.studentId === currentUser.id && a.internshipId === internshipId
    );
  };

  const getApplicationByInternshipId = (internshipId: string) => {
    if (!currentUser) return undefined;
    return applications.find(
      (a) => a.studentId === currentUser.id && a.internshipId === internshipId
    );
  };

  const createApplication = (
    internshipId: string,
    notes?: string,
    officialRef?: string
  ): Application => {
    if (!currentUser) throw new Error('Must be logged in');

    const targetInternship = internships.find((i) => i.id === internshipId);
    const existing = applications.find(
      (a) => a.studentId === currentUser.id && a.internshipId === internshipId
    );

    if (existing) {
      showToast('Already tracking this application!');
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentId: currentUser.id,
      internshipId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      officialReferenceId: officialRef || targetInternship?.officialSource.referenceId || '',
      notes: notes || 'Submitted application via official source portal.',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          stage: 'Applied',
          date: new Date().toISOString().split('T')[0],
          notes: 'Application logged to SKILLORA tracker.',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Added ${targetInternship?.company || 'Opportunity'} to My Applications!`);
    return newApp;
  };

  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          const newEvent = {
            id: `tl-${Date.now()}`,
            stage: newStatus,
            date: new Date().toISOString().split('T')[0],
            notes: note || `Status transitioned to ${newStatus}`,
          };
          return {
            ...app,
            status: newStatus,
            timeline: [...app.timeline, newEvent],
          };
        }
        return app;
      })
    );
    showToast(`Application updated to: ${newStatus}`);
  };

  const deleteApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    showToast('Application record removed.');
  };

  // Reminders functions
  const addReminder = (
    reminderData: Omit<Reminder, 'id' | 'createdAt' | 'studentId'>
  ): Reminder => {
    if (!currentUser) throw new Error('Must be logged in');

    const newReminder: Reminder = {
      ...reminderData,
      id: `rem-${Date.now()}`,
      studentId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setReminders((prev) => [newReminder, ...prev]);
    showToast(`Reminder created for ${reminderData.dueDate}!`);

    // Dispatch native notification if authorized
    sendLocalNotification(reminderData.title, {
      body: `Due: ${reminderData.dueDate} ${reminderData.dueTime || ''}`,
    });

    return newReminder;
  };

  const toggleReminderComplete = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, completed: !r.completed } : r))
    );
    showToast('Reminder status updated.');
  };

  const deleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    showToast('Reminder deleted.');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter current user's personal items
  const userSaved = currentUser
    ? savedInternships.filter((s) => s.studentId === currentUser.id)
    : [];
  const userApps = currentUser
    ? applications.filter((a) => a.studentId === currentUser.id)
    : [];
  const userReminders = currentUser
    ? reminders.filter((r) => r.studentId === currentUser.id)
    : [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        login,
        signup,
        logout,
        updateProfile,
        addSkill,
        removeSkill,
        updateSkillProficiency,
        updatePreferences,
        completeOnboarding,

        internships,
        selectedInternship,
        setSelectedInternship,

        savedInternships: userSaved,
        isInternshipSaved,
        toggleSaveInternship,
        updateSavedNotes,

        applications: userApps,
        isInternshipApplied,
        getApplicationByInternshipId,
        createApplication,
        updateApplicationStatus,
        deleteApplication,

        reminders: userReminders,
        addReminder,
        toggleReminderComplete,
        deleteReminder,

        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAddReminderModalOpen,
        setIsAddReminderModalOpen,
        reminderPrefillInternshipId,
        setReminderPrefillInternshipId,

        filters,
        setFilters,
        resetFilters,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
