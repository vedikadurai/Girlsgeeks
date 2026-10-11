import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  category: string;
  prompt: string;
  recommendedDuration: string;
  tips: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    title: 'Introduce Yourself ("Tell Me About Yourself")',
    category: 'Elevator Pitch',
    prompt: 'Deliver a concise, impactful 90-second introduction covering your academic background, passions, core project achievement (QR Attendance), and career ambition.',
    recommendedDuration: '90 seconds',
    tips: [
      'Hook the interviewer in the first 15 seconds with your technical focus.',
      'Highlight 1 marquee project and quantify its outcome.',
      'Conclude by stating why you are enthusiastic about this specific engineering role.',
    ],
  },
  {
    id: 'ex_2',
    title: 'Explain Your Marquee Project (Technical Architecture)',
    category: 'System Walkthrough',
    prompt: 'Explain the architecture, technology stack, and biggest engineering challenge you resolved in your QR-Based Attendance System project.',
    recommendedDuration: '2 minutes',
    tips: [
      'Explain the real problem (proxy attendance) before jumping into code.',
      'Detail the technologies (Python Flask, OpenCV, SQLite) and why they were chosen.',
      'Discuss security and concurrency: rotating cryptographic tokens refreshed every 15s.',
    ],
  },
  {
    id: 'ex_3',
    title: 'Explain a Technical Concept to a Non-Technical Stakeholder',
    category: 'Communication Clarity',
    prompt: 'Explain what an API (Application Programming Interface) is using a real-world analogy (like a restaurant waiter or power outlet).',
    recommendedDuration: '60 seconds',
    tips: [
      'Avoid unclarified technical jargon (like JSON schemas or serialization).',
      'Use an intuitive everyday analogy (e.g. Menu = available endpoints, Waiter = API delivery).',
      'Bring it back to software: why companies use APIs to connect apps securely.',
    ],
  },
  {
    id: 'ex_4',
    title: 'STAR Method Behavioral Challenge',
    category: 'Behavioral Framework',
    prompt: 'Describe a time when a critical project deadline was approaching and an unexpected bug broke the main functionality. How did you handle the situation?',
    recommendedDuration: '2 minutes',
    tips: [
      'S: Set the scene in 2 sentences.',
      'T: Identify your exact individual task.',
      'A: Describe the precise debugging and collaborative actions you took.',
      'R: Conclude with the successful, measurable result.',
    ],
  },
];

export const InterviewPractice: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise>(EXERCISES[0]);
  const [recordedText, setRecordedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEvaluatePractice = () => {
    if (!recordedText.trim()) return;
    const words = recordedText.trim().split(/\s+/).length;
    if (words < 20) {
      setFeedback('Good start! Try expanding your response to at least 60-90 words to fully cover the Situation, Task, Action, and Result.');
    } else {
      setFeedback('Excellent delivery! Your explanation follows a clear logical structure. Keep this exact pacing and tone for real technical interview panels.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Interview Confidence & Speech Practice</h1>
          <span className="badge badge-indigo">Communication Drills</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Practice high-frequency interview prompts. Refine your delivery pacing, STAR structure, and technical explanations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(460px, 1.6fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Exercise List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {EXERCISES.map((ex) => {
            const isSelected = activeExercise.id === ex.id;
            return (
              <div
                key={ex.id}
                className="card card-interactive"
                onClick={() => {
                  setActiveExercise(ex);
                  setRecordedText('');
                  setFeedback(null);
                }}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{ex.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {ex.recommendedDuration}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {ex.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Right: Practice Studio */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>{activeExercise.category}</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {activeExercise.title}
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.55 }}>
              {activeExercise.prompt}
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ fontSize: '0.85rem', color: '#a5b4fc', display: 'block', marginBottom: '0.35rem' }}>
              Preparation Tips:
            </strong>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {activeExercise.tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <label className="label">Practice Your Speech (Type or dictate your answer):</label>
            <textarea
              className="textarea"
              rows={6}
              value={recordedText}
              onChange={(e) => setRecordedText(e.target.value)}
              placeholder="Start speaking or type your practice response here..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setRecordedText('');
                setFeedback(null);
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset
            </button>

            <button
              onClick={handleEvaluatePractice}
              disabled={!recordedText.trim()}
              className="btn btn-primary"
            >
              Evaluate Delivery
            </button>
          </div>

          {feedback && (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={18} color="#10b981" />
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
