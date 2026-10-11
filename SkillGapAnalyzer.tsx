import React from 'react';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import { SkillGapItem } from '../types';

interface SkillGapAnalyzerProps {
  skillGaps: SkillGapItem[];
  activeRole: string;
  onNavigate: (view: string) => void;
  onAddGapToPlan: (gap: SkillGapItem) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  skillGaps,
  activeRole,
  onNavigate,
  onAddGapToPlan,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Role Competency & Skill Gap Analysis</h1>
          <span className="badge badge-indigo">Role: {activeRole}</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Real-time gap evaluation comparing your verified profile skills against target industry benchmarks for {activeRole}.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid-3" style={{ gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Identified Growth Areas</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
            {skillGaps.length} Skills
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Prioritized by industry demand
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Estimated Effort</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '0.25rem' }}>
            {skillGaps.reduce((acc, curr) => acc + curr.estimatedHours, 0)} Hours
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Structured over your 4-week roadmap
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Readiness Index</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            74% Ready
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.2rem' }}>
            High match for early-career hires
          </div>
        </div>
      </div>

      {/* Visual Skill Gap Comparison Bars */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Current Proficiency vs Target Benchmark</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {skillGaps.map((gap) => (
            <div key={gap.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{gap.name}</span>
                  <span className={`badge ${gap.priority === 'High' ? 'badge-rose' : 'badge-amber'}`} style={{ fontSize: '0.68rem' }}>
                    {gap.priority} Priority
                  </span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                    {gap.category}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Current: <strong>{gap.currentLevel}%</strong> → Target: <strong>{gap.targetLevel}%</strong> (Gap: {gap.gap}%)
                </div>
              </div>

              {/* Stacked comparison bar */}
              <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${gap.targetLevel}%`,
                    background: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '9999px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${gap.currentLevel}%`,
                    background: 'var(--grad-primary)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Skill Cards with Practice Actions */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Personalized Preparation Roadmaps</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {skillGaps.map((gap) => (
            <div
              key={gap.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderLeft: `4px solid ${gap.priority === 'High' ? '#f43f5e' : '#f59e0b'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{gap.name}</h4>
                    <span className="badge badge-indigo">{gap.category}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>
                    <strong>Why It Matters: </strong>{gap.whyItMatters}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <Clock size={15} />
                    <span>~{gap.estimatedHours} hrs study</span>
                  </div>
                  <button
                    onClick={() => onAddGapToPlan(gap)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Add to 4-Week Plan
                  </button>
                </div>
              </div>

              {/* What to Learn & Suggested Practice */}
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#a5b4fc', display: 'block', marginBottom: '0.35rem' }}>
                    Key Concepts to Learn:
                  </strong>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                    {gap.whatToLearn.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#6ee7b7', display: 'block', marginBottom: '0.35rem' }}>
                    Hands-On Practice Task:
                  </strong>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
                    {gap.practiceTask}
                  </p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#818cf8' }}>
                    <strong>Project Extension: </strong>{gap.projectIdea}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
