import {
  UserProfile,
  ResumeData,
  LearningPlanData,
  InterviewSession,
  JobApplication,
  ActivityItem,
  PortfolioData,
  SkillGapItem
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_RESUME_VERSIONS,
  INITIAL_4_WEEK_PLAN,
  INITIAL_INTERVIEW_SESSIONS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_PORTFOLIO_DATA,
  INITIAL_SKILL_GAPS
} from '../data/mockData';

const KEYS = {
  USER_PROFILE: 'career_ai_user_profile',
  RESUME_VERSIONS: 'career_ai_resume_versions',
  ACTIVE_RESUME_ID: 'career_ai_active_resume_id',
  LEARNING_PLANS: 'career_ai_learning_plans',
  INTERVIEWS: 'career_ai_interviews',
  JOB_APPLICATIONS: 'career_ai_job_applications',
  ACTIVITIES: 'career_ai_activities',
  PORTFOLIO: 'career_ai_portfolio',
  SKILL_GAPS: 'career_ai_skill_gaps',
};

export class StorageService {
  // User Profile
  static getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  }

  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Resume Versions
  static getResumeVersions(): ResumeData[] {
    try {
      const data = localStorage.getItem(KEYS.RESUME_VERSIONS);
      return data ? JSON.parse(data) : INITIAL_RESUME_VERSIONS;
    } catch {
      return INITIAL_RESUME_VERSIONS;
    }
  }

  static saveResumeVersions(versions: ResumeData[]): void {
    try {
      localStorage.setItem(KEYS.RESUME_VERSIONS, JSON.stringify(versions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  static getActiveResume(targetRole?: string): ResumeData {
    const versions = this.getResumeVersions();
    if (targetRole) {
      const matching = versions.find((v) => v.targetRole.toLowerCase() === targetRole.toLowerCase());
      if (matching) return matching;
    }
    const savedId = localStorage.getItem(KEYS.ACTIVE_RESUME_ID);
    if (savedId) {
      const found = versions.find((v) => v.id === savedId);
      if (found) return found;
    }
    return versions[0] || INITIAL_RESUME_VERSIONS[0];
  }

  static saveResume(resume: ResumeData): void {
    const versions = this.getResumeVersions();
    const idx = versions.findIndex((v) => v.id === resume.id);
    if (idx >= 0) {
      versions[idx] = resume;
    } else {
      versions.push(resume);
    }
    this.saveResumeVersions(versions);
    localStorage.setItem(KEYS.ACTIVE_RESUME_ID, resume.id);
  }

  static createRoleSpecificResume(targetRole: string): ResumeData {
    const versions = this.getResumeVersions();
    const base = versions[0] || INITIAL_RESUME_VERSIONS[0];

    const newResume: ResumeData = {
      ...JSON.parse(JSON.stringify(base)),
      id: `res_${Date.now()}_${targetRole.toLowerCase().replace(/\s+/g, '_')}`,
      versionName: `${targetRole} Tailored Resume`,
      targetRole,
      updatedAt: new Date().toISOString().split('T')[0],
      atsScoreEstimate: Math.floor(Math.random() * 8) + 84, // realistic score boost
    };

    versions.push(newResume);
    this.saveResumeVersions(versions);
    this.logActivity({
      title: 'Generated Role-Specific Resume',
      description: `Created dedicated resume version tailored for ${targetRole}`,
      type: 'resume',
      badge: targetRole,
    });
    return newResume;
  }

  // Learning Plan
  static getLearningPlan(role: string): LearningPlanData {
    try {
      const data = localStorage.getItem(KEYS.LEARNING_PLANS);
      const allPlans: Record<string, LearningPlanData> = data ? JSON.parse(data) : INITIAL_4_WEEK_PLAN;
      if (allPlans[role]) {
        return allPlans[role];
      }
      // Clone base plan adapted for this role
      const base = INITIAL_4_WEEK_PLAN['Software Developer'];
      const adapted: LearningPlanData = {
        ...JSON.parse(JSON.stringify(base)),
        role,
        overallProgress: 15,
        learningHoursCompleted: 4,
        streakDays: 3,
      };
      allPlans[role] = adapted;
      this.saveAllLearningPlans(allPlans);
      return adapted;
    } catch {
      return INITIAL_4_WEEK_PLAN['Software Developer'];
    }
  }

  static saveLearningPlan(plan: LearningPlanData): void {
    try {
      const data = localStorage.getItem(KEYS.LEARNING_PLANS);
      const allPlans: Record<string, LearningPlanData> = data ? JSON.parse(data) : INITIAL_4_WEEK_PLAN;
      allPlans[plan.role] = plan;
      this.saveAllLearningPlans(allPlans);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  private static saveAllLearningPlans(allPlans: Record<string, LearningPlanData>): void {
    try {
      localStorage.setItem(KEYS.LEARNING_PLANS, JSON.stringify(allPlans));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Interview Sessions
  static getInterviews(): InterviewSession[] {
    try {
      const data = localStorage.getItem(KEYS.INTERVIEWS);
      return data ? JSON.parse(data) : INITIAL_INTERVIEW_SESSIONS;
    } catch {
      return INITIAL_INTERVIEW_SESSIONS;
    }
  }

  static saveInterview(session: InterviewSession): void {
    const list = this.getInterviews();
    list.unshift(session);
    try {
      localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    this.logActivity({
      title: 'Mock Interview Completed',
      description: `Completed ${session.difficulty} ${session.role} interview. Scored ${session.overallScore}%.`,
      type: 'interview',
      badge: `${session.overallScore}%`,
    });
  }

  // Job Applications
  static getJobApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(KEYS.JOB_APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  }

  static saveJobApplications(apps: JobApplication[]): void {
    try {
      localStorage.setItem(KEYS.JOB_APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Skill Gaps
  static getSkillGaps(role: string): SkillGapItem[] {
    try {
      const data = localStorage.getItem(KEYS.SKILL_GAPS);
      const allGaps = data ? JSON.parse(data) : INITIAL_SKILL_GAPS;
      return allGaps[role] || INITIAL_SKILL_GAPS['Software Developer'];
    } catch {
      return INITIAL_SKILL_GAPS['Software Developer'];
    }
  }

  static saveSkillGaps(role: string, gaps: SkillGapItem[]): void {
    try {
      const data = localStorage.getItem(KEYS.SKILL_GAPS);
      const allGaps = data ? JSON.parse(data) : INITIAL_SKILL_GAPS;
      allGaps[role] = gaps;
      localStorage.setItem(KEYS.SKILL_GAPS, JSON.stringify(allGaps));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Activities
  static getActivities(): ActivityItem[] {
    try {
      const data = localStorage.getItem(KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  }

  static logActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>): void {
    const activities = this.getActivities();
    const newAct: ActivityItem = {
      ...item,
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
    };
    activities.unshift(newAct);
    if (activities.length > 25) activities.pop();
    try {
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Portfolio
  static getPortfolio(): PortfolioData {
    try {
      const data = localStorage.getItem(KEYS.PORTFOLIO);
      return data ? JSON.parse(data) : INITIAL_PORTFOLIO_DATA;
    } catch {
      return INITIAL_PORTFOLIO_DATA;
    }
  }

  static savePortfolio(data: PortfolioData): void {
    try {
      localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Reset demo
  static resetToDemoData(): void {
    try {
      localStorage.clear();
    } catch {}
  }
}
