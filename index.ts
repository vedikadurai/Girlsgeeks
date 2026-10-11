export type LanguageCode =
  | 'en'
  | 'ta'
  | 'hi'
  | 'te'
  | 'ml'
  | 'kn'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export const AVAILABLE_JOB_ROLES: string[] = [
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Python Developer',
  'Java Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Mobile App Developer',
  'UI/UX Designer',
  'Database Administrator',
  'Business Analyst',
  'QA / Test Engineer',
  'Embedded Systems Engineer',
  'IoT Engineer',
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: string;
  experienceLevel: 'Entry-Level' | 'Intern' | 'Student' | 'Mid-Level' | 'Experienced';
  targetRoles: string[]; // up to 5 roles
  activeRole: string;
  preferredIndustry: string;
  technicalSkills: string[];
  softSkills: string[];
  toolsAndFrameworks: string[];
  preferredLanguages: {
    app: LanguageCode;
    interviewQuestion: LanguageCode;
    questionExplanation: LanguageCode;
    interviewAnswer: LanguageCode;
    interviewFeedback: LanguageCode;
    voice: LanguageCode;
  };
  studyPreferences: {
    dailyDurationMinutes: number; // 30, 60, 90, 120, 180
    studyTimeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  };
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  location: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
  technologies: string[];
  role: string;
  features: string[];
  outcome: string;
  githubUrl: string;
  demoUrl: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Competition' | 'Certification' | 'Award' | 'Leadership' | 'Project' | 'Volunteer';
  organization: string;
  year: string;
  description: string;
}

export interface ResumeData {
  id: string;
  versionName: string;
  targetRole: string;
  template: 'modern' | 'professional' | 'minimal' | 'ats' | 'technical' | 'student' | 'creative';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    title: string;
  };
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: string[];
  interests: string[];
  updatedAt: string;
  atsScoreEstimate: number;
}

export interface ATSAnalysis {
  overallScore: number;
  keywordMatch: number;
  formattingScore: number;
  roleRelevance: number;
  readabilityScore: number;
  contentQuality: number;
  structureScore: number;
  projectQuality: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    section: string;
    current: string;
    suggested: string;
    reason: string;
  }[];
}

export interface JobMatchResult {
  jobTitle: string;
  company: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceAlignment: string;
  keywordSuggestions: string[];
  recommendations: string[];
}

export interface InterviewConfig {
  targetRole: string;
  interviewType: 'HR' | 'Technical' | 'Behavioral' | 'Resume-Based' | 'Coding' | 'Situational' | 'Mixed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  questionLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
  answerLanguage: LanguageCode;
  feedbackLanguage: LanguageCode;
  showTranslation: boolean;
  allowExplanation: boolean;
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  role: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  translations: Record<LanguageCode, string>;
  explanations: Record<LanguageCode, string>; // Concept clarifier without giving the exact answer
  keyConceptsToCover: string[];
  followUpTrigger?: string;
}

export interface InterviewAnswerRecord {
  questionId: string;
  questionText: string;
  userAnswer: string;
  submittedAt: string;
  language: LanguageCode;
  evaluation: {
    score: number;
    technicalKnowledge: number;
    communication: number;
    relevance: number;
    structure: number;
    confidenceIndicator: number;
    whatWentWell: string;
    whatCanImprove: string;
    recommendedPractice: string;
    starFeedback?: string;
  };
  followUpQuestion?: InterviewQuestion;
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  role: string;
  interviewType: string;
  difficulty: string;
  language: LanguageCode;
  durationMinutes: number;
  questionsCount: number;
  overallScore: number;
  categoryScores: {
    technicalKnowledge: number;
    communication: number;
    relevance: number;
    problemSolving: number;
    structure: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  records: InterviewAnswerRecord[];
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: 'Technical' | 'Soft Skill' | 'Tool' | 'Framework' | 'Database';
  currentLevel: number; // 0 - 100
  targetLevel: number; // 0 - 100
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Strong' | 'Developing' | 'Gap';
  whyItMatters: string;
  whatToLearn: string[];
  practiceTask: string;
  projectIdea: string;
  estimatedHours: number;
}

export interface DailyTask {
  id: string;
  dayNumber: number; // 1 - 28
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  weekNumber: 1 | 2 | 3 | 4;
  topic: string;
  taskTitle: string;
  description: string;
  estimatedMinutes: number;
  type: 'Resume' | 'Technical' | 'Interview' | 'Review' | 'Assessment' | 'Problem Solving';
  completed: boolean;
  completedAt?: string;
  missed?: boolean;
  rescheduled?: boolean;
  linkedRole?: string;
  aiExplanation?: string;
}

export interface WeekPlan {
  id?: string;
  weekNumber: 1 | 2 | 3 | 4;
  title: string;
  focus: string;
  expectedOutcome: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  tasks: DailyTask[];
}


export interface LearningPlanData {
  role: string;
  overallProgress: number;
  learningHoursCompleted: number;
  streakDays: number;
  streakDates: string[];
  lastActiveDate: string;
  preferredDailyDurationMinutes: number;
  studyTimeOfDay: string;
  weeks: WeekPlan[];
}

export interface JobApplication {
  id: string;
  company: string;
  jobRole: string;
  location: string;
  appliedDate: string;
  status: 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  notes: string;
  jobUrl: string;
  resumeVersionId: string;
  salaryExpectation?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'resume' | 'interview' | 'task' | 'application' | 'skill';
  badge?: string;
}

export interface PortfolioData {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  template: 'modern' | 'developer' | 'minimal' | 'creative';
  skills: string[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  certifications: CertificationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: LanguageCode;
  suggestedPrompts?: string[];
}
