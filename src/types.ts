export type WorkType = 'Remote' | 'Hybrid' | 'On-site';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Screening' 
  | 'Assessment' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected' 
  | 'Withdrawn';

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced';

export interface StudentSkill {
  id: string;
  name: string;
  category: 'Languages' | 'Frameworks' | 'Tools & Cloud' | 'Design & UX' | 'Data & AI' | 'Core CS' | 'Soft Skills';
  proficiency: SkillProficiency;
}

export interface StudentPreferences {
  roles: string[];
  workTypes: WorkType[];
  locations: string[];
  durations: string[];
  minStipend?: string;
  industries: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university: string;
  degree: string;
  major: string;
  graduationYear: number;
  location: string;
  bio?: string;
  gpa?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: StudentSkill[];
  preferences: StudentPreferences;
  onboardingCompleted: boolean;
  createdAt: string;
  lastActive: string;
}

export interface OfficialSource {
  name: string;
  url: string;
  verified: boolean;
  portalType: 'Company Careers' | 'Government Portal' | 'University Job Board' | 'Official Partner' | 'Direct Recruiter';
  sourceNotes?: string;
  referenceId?: string;
}

export interface InternshipEligibility {
  degrees: string[];
  batchYears: number[];
  minGpa?: string;
  citizenship?: string;
  notes?: string;
}

export type InternshipCategory = 
  | 'Software Engineering' 
  | 'Frontend & Web' 
  | 'Backend & Cloud' 
  | 'Data & AI' 
  | 'Product Design / UI' 
  | 'Cybersecurity' 
  | 'Product Management' 
  | 'DevOps & Systems';

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  department: string;
  location: string;
  workType: WorkType;
  stipend: string;
  duration: string;
  deadline: string; // YYYY-MM-DD
  startDate: string;
  dateAdded: string; // YYYY-MM-DD
  lastUpdated: string; // YYYY-MM-DD
  officialSource: OfficialSource;
  description: string;
  aboutRole: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  eligibility: InternshipEligibility;
  perks: string[];
  category: InternshipCategory;
  featured?: boolean;
  isNew?: boolean;
}

export interface SkillMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  preferredMatches: string[];
  roleFitScore: number;
  matchVerdict: 'High Match' | 'Good Match' | 'Moderate Match' | 'Explore';
  explanation: string;
}

export interface SavedInternship {
  id: string;
  studentId: string;
  internshipId: string;
  savedAt: string;
  notes?: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  stage: ApplicationStatus;
  date: string;
  notes?: string;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  officialReferenceId?: string;
  timeline: ApplicationTimelineEvent[];
}

export type ReminderType = 'Deadline' | 'Assessment' | 'Interview' | 'Follow-up' | 'Custom';
export type ReminderPriority = 'high' | 'medium' | 'low';

export interface Reminder {
  id: string;
  studentId: string;
  internshipId?: string;
  title: string;
  type: ReminderType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  notes?: string;
  completed: boolean;
  priority: ReminderPriority;
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  categories: string[];
  workTypes: WorkType[];
  minMatchScore: number;
  locations: string[];
  durations: string[];
  onlyVerified: boolean;
  onlyNew: boolean;
  closingSoon: boolean;
  sortBy: 'match' | 'deadline' | 'newest' | 'stipend';
}
