import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  FileCheck2,
  Mic2,
  TrendingUp,
  CalendarCheck2,
  Briefcase,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  UserProfile,
  ResumeData,
  LearningPlanData,
  InterviewSession,
  JobApplication,
  ActivityItem,
  DailyTask
} from '../types';

interface DashboardProps {
  user: UserProfile;
  activeResume: ResumeData;
  activePlan: LearningPlanData;
  interviews: InterviewSession[];
  applications: JobApplication[];
  activities: ActivityItem[];
  onNavigate: (view: string) => void;
  onRoleChange: (role: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  activeResume,
  activePlan,
  interviews,
  applications,
  activities,
  onNavigate,
  onRoleChange,
  onCompleteTask,
}) => {
  // Find today's uncompleted task
  const allTasks = activePlan.weeks.flatMap((w) => w.tasks);
  const todaysTask: DailyTask =
    allTasks.find((t) => !t.completed && t.weekNumber === 2) ||
    allTasks.find((t) => !t.completed) ||
    allTasks[0];

  const recentInterview = interviews[0];
  const interviewAverage = interviews.length > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / interviews.length)
    : 80;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-indigo">
                <Sparkles size={13} />
                Student Career Readiness Dashboard
              </span>
              <span className="badge badge-amber">
                <Flame size={13} color="#f59e0b" />
                {activePlan.streakDays} Day Learning Streak
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Good morning, {user.name} 👋
            </h1>
            <p style={{ color: 'var(--text-light)', maxWidth: '650px', fontSize: '0.95rem' }}>
              Let's continue building your career readiness. You are currently preparing for{' '}
              <strong style={{ color: '#ffffff', textDecoration: 'underline decoration-indigo-500' }}>
                {user.activeRole}
              </strong>
              .
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('mock_interview')}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <Mic2 size={16} />
              <span>Start AI Interview</span>
            </button>
            <button
              onClick={() => onNavigate('resume_builder')}
              className="btn btn-secondary"
              style={{ gap: '0.5rem' }}
            >
              <FileCheck2 size={16} color="#818cf8" />
              <span>Edit Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Career Readiness Scorecards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Career Readiness Scorecard</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated automatically across modules</span>
        </div>

        <div className="grid-4" style={{ gap: '1.25rem' }}>
          {/* Card 1: Resume Status */}
          <div
            className="card card-interactive"
            onClick={() => onNavigate('resume_analysis')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Resume Status</span>
              <span className="badge badge-emerald">Needs Polish</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>{activeResume.atsScoreEstimate}%</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Score Estimate</span>
            </div>
            <div className="progress-container" style={{ marginBottom: '0.65rem' }}>
              <div className="progress-fill" style={{ width: `${activeResume.atsScoreEstimate}%` }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Version: {activeResume.versionName.slice(0, 18)}...</span>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Review →</span>
            </div>
          </div>

          {/* Card 2: ATS Compatibility */}
          <div
            className="card card-interactive"
            onClick={() => onNavigate('ats_optimizer')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ATS Readiness</span>
              <span className="badge badge-indigo">Role Aligned</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>78%</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Keyword Match</span>
            </div>
            <div className="progress-container" style={{ marginBottom: '0.65rem' }}>
              <div className="progress-fill" style={{ width: '78%' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Matched: 14 keywords</span>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Match JD →</span>
            </div>
          </div>

          {/* Card 3: Interview Score */}
          <div
            className="card card-interactive"
            onClick={() => onNavigate('mock_interview')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Interview Practice</span>
              <span className="badge badge-cyan">{interviews.length} Sessions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>{interviewAverage}%</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Avg Score</span>
            </div>
            <div className="progress-container" style={{ marginBottom: '0.65rem' }}>
              <div className="progress-fill progress-fill-emerald" style={{ width: `${interviewAverage}%` }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Last: {recentInterview?.role || 'Technical'} ({recentInterview?.overallScore || 82}%)</span>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Practice →</span>
            </div>
          </div>

          {/* Card 4: Learning Plan */}
          <div
            className="card card-interactive"
            onClick={() => onNavigate('learning_plan')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>4-Week Plan</span>
              <span className="badge badge-amber">Week 2 of 4</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>{activePlan.overallProgress}%</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>18/28 Tasks</span>
            </div>
            <div className="progress-container" style={{ marginBottom: '0.65rem' }}>
              <div className="progress-fill progress-fill-amber" style={{ width: `${activePlan.overallProgress}%` }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{activePlan.learningHoursCompleted} hrs logged</span>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>Roadmap →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Step & Today's Goal */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Card: Today's Scheduled Goal */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarCheck2 size={18} color="#818cf8" />
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Today's Goal ({todaysTask.dayName})</span>
              </div>
              <span className="badge badge-indigo">{todaysTask.type}</span>
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.45rem' }}>
              {todaysTask.taskTitle}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {todaysTask.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="#94a3b8" />
                <span>Estimated: {todaysTask.estimatedMinutes} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Target size={15} color="#94a3b8" />
                <span>Week {todaysTask.weekNumber}, Day {todaysTask.dayNumber}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => onNavigate('learning_plan')}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Start Today's Task
            </button>
            <button
              onClick={() => onCompleteTask(todaysTask.id)}
              className="btn btn-secondary"
              style={{ gap: '0.35rem' }}
            >
              <CheckCircle2 size={16} color="#10b981" />
              <span>Mark Done</span>
            </button>
          </div>
        </div>

        {/* Card: Target Role Preparation Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="#06b6d4" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Multiple Target Roles ({user.targetRoles.length}/5)</span>
            </div>
            <button
              onClick={() => onNavigate('roles')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Manage
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Switch active preparation role to dynamically realign your resume diagnostics, interview questions, and 4-week tasks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {user.targetRoles.map((role) => {
              const isCurrent = role === user.activeRole;
              const readiness = role === 'Software Developer' ? 84 : role === 'Python Developer' ? 78 : 71;
              return (
                <div
                  key={role}
                  style={{
                    padding: '0.85rem 1rem',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCurrent ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.925rem', color: '#ffffff' }}>{role}</span>
                      {isCurrent && <span className="badge badge-indigo">Active</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                      <div className="progress-container" style={{ width: '120px', height: '6px' }}>
                        <div className="progress-fill" style={{ width: `${readiness}%` }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>{readiness}% Prep</span>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => onRoleChange(role)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      Switch
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications Pipeline & Recent Activity */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Active Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="#818cf8" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Job Application Pipeline</span>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              View All ({applications.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{app.company}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.jobRole}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    className={`badge ${
                      app.status === 'Offer'
                        ? 'badge-emerald'
                        : app.status === 'Interview'
                        ? 'badge-cyan'
                        : app.status === 'Assessment'
                        ? 'badge-indigo'
                        : 'badge-amber'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Activity</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time event log</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      act.type === 'interview'
                        ? '#818cf8'
                        : act.type === 'task'
                        ? '#10b981'
                        : act.type === 'application'
                        ? '#06b6d4'
                        : '#f59e0b',
                    marginTop: '6px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#ffffff' }}>{act.title}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>{act.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launch Cards Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Want to showcase your work online?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Generate your personal developer portfolio website in 1 click, styled across 4 modern templates.
            </p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="btn btn-outline"
            style={{ gap: '0.5rem' }}
          >
            <Layers size={16} />
            <span>Generate Portfolio</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
