import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { ATSOptimizer } from './components/ATSOptimizer';
import { MockInterview } from './components/MockInterview';
import { InterviewEvaluation } from './components/InterviewEvaluation';
import { InterviewHistory } from './components/InterviewHistory';
import { InterviewPractice } from './components/InterviewPractice';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { LearningPlan } from './components/LearningPlan';
import { PortfolioBuilder } from './components/PortfolioBuilder';
import { JobApplicationTracker } from './components/JobApplicationTracker';
import { AICareerAssistant } from './components/AICareerAssistant';
import { RoleProfileManager } from './components/RoleProfileManager';
import { LanguageSettings } from './components/LanguageSettings';
import { PrivacySettings } from './components/PrivacySettings';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ProjectsManager } from './components/ProjectsManager';
import { AchievementsManager } from './components/AchievementsManager';
import { StorageService } from './services/storageService';
import { AIService } from './services/aiService';
import {
  UserProfile,
  ResumeData,
  LearningPlanData,
  InterviewSession,
  JobApplication,
  ActivityItem,
  PortfolioData,
  SkillGapItem
} from './types';

export const App: React.FC = () => {
  // Global State backed by StorageService
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [activeRole, setActiveRole] = useState<string>(user.activeRole || 'Software Developer');
  const [resumeVersions, setResumeVersions] = useState<ResumeData[]>(StorageService.getResumeVersions());
  const [activeResume, setActiveResume] = useState<ResumeData>(StorageService.getActiveResume(activeRole));
  const [activePlan, setActivePlan] = useState<LearningPlanData>(StorageService.getLearningPlan(activeRole));
  const [interviews, setInterviews] = useState<InterviewSession[]>(StorageService.getInterviews());
  const [applications, setApplications] = useState<JobApplication[]>(StorageService.getJobApplications());
  const [activities, setActivities] = useState<ActivityItem[]>(StorageService.getActivities());
  const [portfolio, setPortfolio] = useState<PortfolioData>(StorageService.getPortfolio());
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(StorageService.getSkillGaps(activeRole));

  // Navigation & UI State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedEvaluation, setSelectedEvaluation] = useState<InterviewSession | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync state whenever active role switches
  useEffect(() => {
    const matchingResume = StorageService.getActiveResume(activeRole);
    setActiveResume(matchingResume);
    const planForRole = StorageService.getLearningPlan(activeRole);
    setActivePlan(planForRole);
    const gaps = StorageService.getSkillGaps(activeRole);
    setSkillGaps(gaps);
  }, [activeRole]);

  // Handle active role change from dropdown or profile
  const handleRoleChange = (newRole: string) => {
    setActiveRole(newRole);
    const updatedUser = { ...user, activeRole: newRole };
    setUser(updatedUser);
    StorageService.saveUserProfile(updatedUser);
  };

  // Handle saving modified resume
  const handleSaveResume = (updated: ResumeData) => {
    setActiveResume(updated);
    StorageService.saveResume(updated);
    setResumeVersions(StorageService.getResumeVersions());
  };

  // Handle generating dedicated role version
  const handleCreateRoleVersion = (roleName: string) => {
    const created = StorageService.createRoleSpecificResume(roleName);
    setResumeVersions(StorageService.getResumeVersions());
    setActiveResume(created);
    setActiveRole(roleName);
  };

  // Handle learning task completion
  const handleCompleteTask = (taskId: string) => {
    const newWeeks = activePlan.weeks.map((w) => ({
      ...w,
      tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t)),
    }));
    const allTasks = newWeeks.flatMap((w) => w.tasks);
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const overallProgress = Math.round((completedTasks / allTasks.length) * 100);
    const completedHours = Math.round(
      allTasks.filter((t) => t.completed).reduce((acc, t) => acc + t.estimatedMinutes, 0) / 60
    );
    const updatedPlan: LearningPlanData = {
      ...activePlan,
      overallProgress,
      learningHoursCompleted: completedHours,
      streakDays: activePlan.streakDays + 1,
      weeks: newWeeks,
    };
    setActivePlan(updatedPlan);
    StorageService.saveLearningPlan(updatedPlan);
    StorageService.logActivity({
      title: 'Completed Scheduled Goal',
      description: `Accomplished daily task in 4-Week Plan. Streak increased to ${updatedPlan.streakDays} days!`,
      type: 'task',
      badge: `Streak ${updatedPlan.streakDays}d`,
    });
    setActivities(StorageService.getActivities());
  };

  // Handle interview finish
  const handleFinishInterview = (session: InterviewSession) => {
    StorageService.saveInterview(session);
    setInterviews(StorageService.getInterviews());
    setActivities(StorageService.getActivities());
    setSelectedEvaluation(session);
    setCurrentView('interview_evaluation');
  };

  // Reset to initial demo baseline
  const handleResetData = () => {
    StorageService.resetToDemoData();
    const newUser = StorageService.getUserProfile();
    setUser(newUser);
    setActiveRole(newUser.activeRole);
    setResumeVersions(StorageService.getResumeVersions());
    setActiveResume(StorageService.getActiveResume(newUser.activeRole));
    setActivePlan(StorageService.getLearningPlan(newUser.activeRole));
    setInterviews(StorageService.getInterviews());
    setApplications(StorageService.getJobApplications());
    setActivities(StorageService.getActivities());
    setPortfolio(StorageService.getPortfolio());
    setSkillGaps(StorageService.getSkillGaps(newUser.activeRole));
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar
          user={user}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          onResetData={handleResetData}
          onOpenAssistant={() => setAssistantOpen(true)}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Collapsible Sidebar */}
          {currentView !== 'landing' && (
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isOpen={sidebarOpen}
              onCloseMobile={() => setSidebarOpen(false)}
              streakDays={activePlan.streakDays}
            />
          )}

          {/* Main Workspace Body */}
          <main className="main-content">
            <div className="page-wrapper">
              {currentView === 'landing' && (
                <LandingPage
                  onGetStarted={() => setCurrentView('resume_builder')}
                  onTryInterview={() => setCurrentView('mock_interview')}
                  onExplorePlan={() => setCurrentView('learning_plan')}
                />
              )}

              {currentView === 'dashboard' && (
                <Dashboard
                  user={user}
                  activeResume={activeResume}
                  activePlan={activePlan}
                  interviews={interviews}
                  applications={applications}
                  activities={activities}
                  onNavigate={(view) => {
                    setCurrentView(view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onRoleChange={handleRoleChange}
                  onCompleteTask={handleCompleteTask}
                />
              )}

              {currentView === 'resume_builder' && (
                <ResumeBuilder
                  initialResume={activeResume}
                  activeRole={activeRole}
                  onSaveResume={handleSaveResume}
                  onCreateRoleVersion={handleCreateRoleVersion}
                  availableRoles={user.targetRoles}
                />
              )}

              {currentView === 'resume_analysis' && (
                <ResumeAnalyzer
                  resume={activeResume}
                  activeRole={activeRole}
                  onNavigate={(view) => setCurrentView(view)}
                  onApplySuggestion={(sug) => {
                    setCurrentView('resume_builder');
                  }}
                />
              )}

              {currentView === 'ats_optimizer' && (
                <ATSOptimizer
                  resume={activeResume}
                  activeRole={activeRole}
                  onAddMissingKeyword={(kw) => {
                    if (!activeResume.technicalSkills.includes(kw)) {
                      handleSaveResume({
                        ...activeResume,
                        technicalSkills: [...activeResume.technicalSkills, kw],
                      });
                    }
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'mock_interview' && (
                <MockInterview
                  user={user}
                  resume={activeResume}
                  activeRole={activeRole}
                  onFinishInterview={handleFinishInterview}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'interview_evaluation' && selectedEvaluation && (
                <InterviewEvaluation
                  session={selectedEvaluation}
                  onPracticeAgain={() => setCurrentView('mock_interview')}
                  onNavigate={(view) => setCurrentView(view)}
                  onAddToLearningPlan={() => setCurrentView('learning_plan')}
                />
              )}

              {currentView === 'interview_history' && (
                <InterviewHistory
                  sessions={interviews}
                  onSelectSession={(sess) => {
                    setSelectedEvaluation(sess);
                    setCurrentView('interview_evaluation');
                  }}
                  onStartNewInterview={() => setCurrentView('mock_interview')}
                />
              )}

              {currentView === 'confidence_practice' && (
                <InterviewPractice />
              )}

              {currentView === 'skill_gaps' && (
                <SkillGapAnalyzer
                  skillGaps={skillGaps}
                  activeRole={activeRole}
                  onNavigate={(view) => setCurrentView(view)}
                  onAddGapToPlan={(gap) => {
                    setCurrentView('learning_plan');
                  }}
                />
              )}

              {(currentView === 'learning_plan' || currentView === 'calendar' || currentView === 'readiness_report') && (
                <LearningPlan
                  plan={activePlan}
                  activeRole={activeRole}
                  onUpdatePlan={(updated) => {
                    setActivePlan(updated);
                    StorageService.saveLearningPlan(updated);
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'portfolio' && (
                <PortfolioBuilder
                  portfolio={portfolio}
                  onSavePortfolio={(p) => {
                    setPortfolio(p);
                    StorageService.savePortfolio(p);
                  }}
                />
              )}

              {currentView === 'projects' && (
                <ProjectsManager
                  projects={activeResume.projects}
                  activeRole={activeRole}
                  onSaveProjects={(projs) => {
                    handleSaveResume({ ...activeResume, projects: projs });
                  }}
                />
              )}

              {currentView === 'achievements' && (
                <AchievementsManager
                  achievements={activeResume.achievements}
                  onSaveAchievements={(achs) => {
                    handleSaveResume({ ...activeResume, achievements: achs });
                  }}
                />
              )}

              {currentView === 'applications' && (
                <JobApplicationTracker
                  applications={applications}
                  resumeVersions={resumeVersions}
                  onSaveApplications={(apps) => {
                    setApplications(apps);
                    StorageService.saveJobApplications(apps);
                  }}
                />
              )}

              {currentView === 'roles' && (
                <RoleProfileManager
                  user={user}
                  activeRole={activeRole}
                  onUpdateRoles={(newRoles, newActiveRole) => {
                    const updatedUser = { ...user, targetRoles: newRoles, activeRole: newActiveRole };
                    setUser(updatedUser);
                    setActiveRole(newActiveRole);
                    StorageService.saveUserProfile(updatedUser);
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'languages' && (
                <LanguageSettings
                  user={user}
                  onSavePreferences={(prefs) => {
                    const updatedUser = { ...user, preferredLanguages: prefs };
                    setUser(updatedUser);
                    StorageService.saveUserProfile(updatedUser);
                  }}
                />
              )}

              {currentView === 'privacy' && (
                <PrivacySettings
                  onResetAllData={handleResetData}
                  onClearInterviews={() => {
                    setInterviews([]);
                    localStorage.removeItem('career_ai_interviews');
                  }}
                />
              )}

              {currentView === 'profile' && (
                <ProfileEditModal
                  user={user}
                  onSaveProfile={(p) => {
                    setUser(p);
                    StorageService.saveUserProfile(p);
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Multilingual AI Career Assistant */}
      <AICareerAssistant
        user={user}
        resume={activeResume}
        activeRole={activeRole}
        skillGaps={skillGaps}
        plan={activePlan}
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
};
