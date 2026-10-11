import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar,
  AlertCircle,
  Award,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningPlanData, DailyTask, WeekPlan } from '../types';

interface LearningPlanProps {
  plan: LearningPlanData;
  activeRole: string;
  onUpdatePlan: (updatedPlan: LearningPlanData) => void;
  onNavigate: (view: string) => void;
}

export const LearningPlan: React.FC<LearningPlanProps> = ({
  plan,
  activeRole,
  onUpdatePlan,
  onNavigate,
}) => {
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(2); // Default Week 2
  const [viewMode, setViewMode] = useState<'schedule' | 'calendar' | 'report'>('schedule');
  const [activeTaskModal, setActiveTaskModal] = useState<DailyTask | null>(null);
  const [weeklyReviewModal, setWeeklyReviewModal] = useState<number | null>(null);
  const [studyDuration, setStudyDuration] = useState<number>(plan.preferredDailyDurationMinutes || 60);

  const selectedWeek = plan.weeks.find((w) => w.weekNumber === selectedWeekNum) || plan.weeks[0];

  // Recalculate percentages
  const calculateTotals = (weeks: WeekPlan[]) => {
    const allTasks = weeks.flatMap((w) => w.tasks);
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const overallProgress = Math.round((completedTasks / allTasks.length) * 100);
    const completedHours = Math.round(
      allTasks
        .filter((t) => t.completed)
        .reduce((acc, t) => acc + t.estimatedMinutes, 0) / 60
    );

    // Update each week's progress
    const updatedWeeks = weeks.map((w) => {
      const wCompleted = w.tasks.filter((t) => t.completed).length;
      const wProgress = Math.round((wCompleted / w.tasks.length) * 100);
      const status: WeekPlan['status'] =
        wProgress === 100 ? 'Completed' : wProgress > 0 ? 'In Progress' : 'Upcoming';
      return { ...w, progress: wProgress, status };
    });

    return { overallProgress, completedHours, updatedWeeks, completedTasks };
  };

  const handleToggleTask = (taskId: string) => {
    const newWeeks = plan.weeks.map((w) => {
      const newTasks = w.tasks.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      return { ...w, tasks: newTasks };
    });

    const { overallProgress, completedHours, updatedWeeks } = calculateTotals(newWeeks);

    const updatedPlan: LearningPlanData = {
      ...plan,
      overallProgress,
      learningHoursCompleted: completedHours,
      weeks: updatedWeeks,
    };

    onUpdatePlan(updatedPlan);
  };

  const handleRescheduleTask = (taskId: string) => {
    const newWeeks = plan.weeks.map((w) => ({
      ...w,
      tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, rescheduled: true, missed: false } : t)),
    }));
    const { updatedWeeks } = calculateTotals(newWeeks);
    onUpdatePlan({ ...plan, weeks: updatedWeeks });
    setActiveTaskModal(null);
  };

  // Find today's goal
  const allTasks = plan.weeks.flatMap((w) => w.tasks);
  const todaysGoal =
    allTasks.find((t) => !t.completed && t.weekNumber === selectedWeekNum) ||
    allTasks.find((t) => !t.completed) ||
    allTasks[0];

  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-indigo">Role: {activeRole}</span>
            <span className="badge badge-amber">
              <Flame size={13} color="#f59e0b" />
              {plan.streakDays} Day Learning Streak
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            4-Week Career Readiness Plan
          </h1>
          <p style={{ color: 'var(--text-light)', maxWidth: '650px', fontSize: '0.95rem', margin: 0 }}>
            Structured 28-day daily roadmap dynamically aligned to your verified resume, skill gaps, and interview performance.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('schedule')}
            className={`btn btn-sm ${viewMode === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Daily Tasks
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('report')}
            className={`btn btn-sm ${viewMode === 'report' ? 'btn-primary' : 'btn-secondary'}`}
          >
            4-Week Report
          </button>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid-4" style={{ gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Current Phase</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>Week 2 of 4</div>
          <div style={{ fontSize: '0.78rem', color: '#818cf8', marginTop: '0.25rem' }}>Technical Skill Sprint</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Tasks Completed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
            {completedTasksCount} / {totalTasksCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {totalTasksCount - completedTasksCount} tasks remaining
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Learning Hours</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4' }}>
            {plan.learningHoursCompleted} hrs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Target: 40 hours total</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Daily Study Commitment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <select
              className="select"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
              value={studyDuration}
              onChange={(e) => setStudyDuration(Number(e.target.value))}
            >
              <option value={30}>30 mins / day</option>
              <option value={60}>1 hour / day</option>
              <option value={90}>1.5 hours / day</option>
              <option value={120}>2 hours / day</option>
            </select>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Adapts task workload</div>
        </div>
      </div>

      {/* Large Overall Progress Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Overall Career Readiness Roadmap Completion</span>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#10b981' }}>{plan.overallProgress}%</span>
        </div>
        <div className="progress-container" style={{ height: '12px' }}>
          <div className="progress-fill progress-fill-emerald" style={{ width: `${plan.overallProgress}%` }} />
        </div>
      </div>

      {/* Today's Goal Banner */}
      {todaysGoal && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-indigo">Today's Priority Goal</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {todaysGoal.dayName} • {todaysGoal.estimatedMinutes} mins
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              {todaysGoal.taskTitle}
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {todaysGoal.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTaskModal(todaysGoal)}
              className="btn btn-primary btn-sm"
            >
              Start Today's Task
            </button>
            <button
              onClick={() => handleToggleTask(todaysGoal.id)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <CheckCircle2 size={16} color={todaysGoal.completed ? '#10b981' : 'var(--text-muted)'} />
              <span>{todaysGoal.completed ? 'Completed' : 'Mark Done'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Interactive Weekly Progress Cards */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        {plan.weeks.map((w) => {
          const isSelected = selectedWeekNum === w.weekNumber;
          const completedCount = w.tasks.filter((t) => t.completed).length;
          return (
            <div
              key={w.weekNumber}
              className="card card-interactive"
              onClick={() => setSelectedWeekNum(w.weekNumber)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-indigo)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc' }}>
                  WEEK {w.weekNumber}
                </span>
                <span
                  className={`badge ${
                    w.status === 'Completed'
                      ? 'badge-emerald'
                      : w.status === 'In Progress'
                      ? 'badge-amber'
                      : 'badge-indigo'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {w.status}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                {w.title}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                {completedCount} of {w.tasks.length} tasks completed
              </div>

              <div className="progress-container">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.round((completedCount / w.tasks.length) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW 1: Daily Task Schedule */}
      {viewMode === 'schedule' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Week {selectedWeek.weekNumber}: {selectedWeek.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Focus: {selectedWeek.focus}
              </p>
            </div>

            <button
              onClick={() => setWeeklyReviewModal(selectedWeek.weekNumber)}
              className="btn btn-outline btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <BookOpen size={15} />
              <span>View Week {selectedWeek.weekNumber} Review</span>
            </button>
          </div>

          {/* 7 Daily Tasks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {selectedWeek.tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '1rem 1.25rem',
                  background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  border: task.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Left: Checkbox + Day Label + Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '3px',
                      cursor: 'pointer',
                      accentColor: '#10b981',
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#a5b4fc', textTransform: 'uppercase' }}>
                        {task.dayName} (Day {task.dayNumber})
                      </span>
                      <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                        {task.type}
                      </span>
                      {task.completed && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          Done
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: task.completed ? '#94a3b8' : '#ffffff',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.taskTitle}
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '0.2rem 0 0' }}>
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Right: Duration & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    <Clock size={14} color="#94a3b8" />
                    <span>{task.estimatedMinutes}m</span>
                  </div>

                  <button
                    onClick={() => setActiveTaskModal(task)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: 28-Day Interactive Calendar */}
      {viewMode === 'calendar' && (
        <div className="card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>28-Day Career Readiness Schedule Calendar</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click any calendar day to inspect scheduled practice tasks and track learning consistency.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.65rem',
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
                {day}
              </div>
            ))}

            {allTasks.map((t) => {
              const isToday = t.dayNumber === 11; // Day 11 is current mock day
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTaskModal(t)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: t.completed
                      ? 'rgba(16, 185, 129, 0.12)'
                      : isToday
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isToday
                      ? '1px solid #818cf8'
                      : t.completed
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    minHeight: '85px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isToday ? '#ffffff' : '#a5b4fc' }}>
                      D{t.dayNumber}
                    </span>
                    {t.completed ? (
                      <CheckCircle2 size={13} color="#10b981" />
                    ) : isToday ? (
                      <span className="badge badge-indigo" style={{ fontSize: '0.6rem', padding: '0 0.25rem' }}>
                        Today
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {t.taskTitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Final 4-Week Career Readiness Report */}
      {viewMode === 'report' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              Final Preparation Analysis
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Before vs After 4-Week Progression Report</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Comparative progress benchmarks illustrating skill elevation across the full program.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resume ATS Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.3rem', color: '#94a3b8', textDecoration: 'line-through' }}>68%</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>84%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>+16 points gained</div>
            </div>

            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interview Mock Performance</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.3rem', color: '#94a3b8', textDecoration: 'line-through' }}>65%</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8' }}>82%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.2rem' }}>+17 points gained</div>
            </div>

            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Technical Readiness</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '1.3rem', color: '#94a3b8', textDecoration: 'line-through' }}>5 / 10</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4' }}>8 / 10</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.2rem' }}>3 high-priority gaps resolved</div>
            </div>
          </div>

          <div style={{ padding: '1rem 1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Career Preparation Summary</h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
              <li><strong>Resume Improvement:</strong> Clean single-column ATS typography, Google XYZ quantified bullets, and tailored keywords.</li>
              <li><strong>Interview Mastery:</strong> Clear articulation of complex systems in regional dialect (Tamil) and English using STAR structure.</li>
              <li><strong>Technical Development:</strong> Mastered complex SQL JOINs, REST API architecture, and containerization fundamentals.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {activeTaskModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '550px',
              width: '100%',
              padding: '2rem',
              background: '#0f172a',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-indigo">
                Week {activeTaskModal.weekNumber} • Day {activeTaskModal.dayNumber} ({activeTaskModal.dayName})
              </span>
              <span className="badge badge-amber">{activeTaskModal.type}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {activeTaskModal.taskTitle}
            </h3>

            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              {activeTaskModal.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={16} />
                <span>Estimated: {activeTaskModal.estimatedMinutes} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Flame size={16} color="#f59e0b" />
                <span>Counts towards daily streak</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleRescheduleTask(activeTaskModal.id)}
                className="btn btn-secondary btn-sm"
              >
                Reschedule Task
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveTaskModal(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleToggleTask(activeTaskModal.id);
                    setActiveTaskModal(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  {activeTaskModal.completed ? 'Mark as Incomplete' : 'Complete Task ✓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Review Modal */}
      {weeklyReviewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              background: '#0f172a',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-emerald">WEEK {weeklyReviewModal} REVIEW</span>
              <button onClick={() => setWeeklyReviewModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem' }}>
                ×
              </button>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {weeklyReviewModal === 1 ? 'Week 1: Resume & Career Foundation' : 'Week 2: Technical Skill Development'}
            </h3>

            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks Completed</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>7 / 7 (100%)</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Learning Logged</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#818cf8' }}>8.5 hours</div>
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              <strong>AI Recommendation: </strong>
              {weeklyReviewModal === 1
                ? 'Your resume score jumped from 68% to 84%. In Week 2, prioritize algorithmic patterns and practice SQL JOINs before technical interview sessions.'
                : 'Great progress on OOP and SQL queries! Spend 30 extra minutes on REST API architecture before starting Week 3 Mock Interviews.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setWeeklyReviewModal(null)} className="btn btn-primary btn-sm">
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
