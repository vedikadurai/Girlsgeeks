import React from 'react';
import {
  History,
  Award,
  Clock,
  RotateCcw,
  Languages,
  ChevronRight,
  FileText
} from 'lucide-react';
import { InterviewSession } from '../types';

interface InterviewHistoryProps {
  sessions: InterviewSession[];
  onSelectSession: (session: InterviewSession) => void;
  onStartNewInterview: () => void;
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({
  sessions,
  onSelectSession,
  onStartNewInterview,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Mock Interview History</h1>
            <span className="badge badge-indigo">{sessions.length} Completed Sessions</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
            Review past interview evaluations, detailed transcripts, and performance trajectory.
          </p>
        </div>

        <button onClick={onStartNewInterview} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <RotateCcw size={16} />
          <span>Start New Interview</span>
        </button>
      </div>

      {/* History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="card card-interactive"
            onClick={() => onSelectSession(sess)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: sess.overallScore >= 80 ? '#10b981' : '#818cf8',
                }}
              >
                {sess.overallScore}%
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {sess.role}
                  </h3>
                  <span className="badge badge-indigo">{sess.interviewType}</span>
                  <span className="badge badge-amber">{sess.difficulty}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>🗓️ {new Date(sess.createdAt).toLocaleDateString()}</span>
                  <span>⏱️ {sess.durationMinutes} minutes</span>
                  <span>❓ {sess.questionsCount} questions</span>
                  <span>🌐 Lang: {sess.language.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Tech: <strong>{sess.categoryScores.technicalKnowledge}%</strong> • Comm: <strong>{sess.categoryScores.communication}%</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Full transcript available</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
