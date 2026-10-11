import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText,
  Volume2,
  CalendarCheck2
} from 'lucide-react';
import { InterviewSession } from '../types';

interface InterviewEvaluationProps {
  session: InterviewSession;
  onPracticeAgain: () => void;
  onNavigate: (view: string) => void;
  onAddToLearningPlan?: () => void;
}

export const InterviewEvaluation: React.FC<InterviewEvaluationProps> = ({
  session,
  onPracticeAgain,
  onNavigate,
  onAddToLearningPlan,
}) => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Completion Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-emerald">
              <Award size={14} />
              Session Completed Successfully
            </span>
            <span className="badge badge-indigo">{session.role}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            AI Mock Interview Evaluation Report
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
            {session.interviewType} Interview • {session.questionsCount} Questions • Duration: {session.durationMinutes} mins
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>OVERALL SCORE</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: session.overallScore >= 80 ? '#10b981' : '#818cf8', lineHeight: 1 }}>
              {session.overallScore}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Scorecards */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Performance Breakdown</h2>
        <div className="grid-3" style={{ gap: '1rem' }}>
          {[
            { label: 'Technical Knowledge', val: session.categoryScores.technicalKnowledge, color: '#818cf8' },
            { label: 'Communication Clarity', val: session.categoryScores.communication, color: '#10b981' },
            { label: 'Answer Relevance', val: session.categoryScores.relevance, color: '#06b6d4' },
            { label: 'Problem Solving', val: session.categoryScores.problemSolving, color: '#a855f7' },
            { label: 'Answer Structure', val: session.categoryScores.structure, color: '#f59e0b' },
            { label: 'Confidence Indicator', val: session.categoryScores.confidence, color: '#ec4899' },
          ].map((cat) => (
            <div key={cat.label} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{cat.label}</span>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: cat.color }}>{cat.val}%</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${cat.val}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What You Did Well & What to Improve */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>What You Did Well</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {session.strengths.map((str, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#e2e8f0' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Areas for Improvement</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {session.improvements.map((imp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#e2e8f0' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>!</span>
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Practice Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={18} color="#c084fc" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Actionable Preparation Guidance</h3>
        </div>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
          {session.recommendations.map((rec, i) => (
            <li key={i} style={{ marginBottom: '0.35rem' }}>{rec}</li>
          ))}
          <li>
            <strong>STAR Method for behavioral questions:</strong> Always frame answers with Situation, Task, Action, and Result to score above 85% in communication structure.
          </li>
        </ul>
      </div>

      {/* Question-by-Question Transcript */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Interactive Session Transcript ({session.records.length} Answers)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {session.records.map((rec, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-indigo">Question #{idx + 1}</span>
                <span style={{ fontWeight: 800, color: rec.evaluation.score >= 80 ? '#10b981' : '#f59e0b' }}>
                  Score: {rec.evaluation.score}%
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                {rec.questionText}
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)',
                  marginBottom: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                <strong>Your Answer: </strong> "{rec.userAnswer}"
              </div>

              <div style={{ fontSize: '0.825rem', color: '#c7d2fe' }}>
                <strong>AI Feedback: </strong> {rec.evaluation.whatWentWell} {rec.evaluation.whatCanImprove}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onAddToLearningPlan && (
            <button onClick={onAddToLearningPlan} className="btn btn-outline" style={{ gap: '0.4rem' }}>
              <CalendarCheck2 size={16} />
              <span>Add Weaknesses to 4-Week Plan</span>
            </button>
          )}
          <button onClick={onPracticeAgain} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <RotateCcw size={16} />
            <span>Practice Another Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
