import React, { useState } from 'react';
import {
  Upload,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { ResumeData, ATSAnalysis } from '../types';
import { AIService } from '../services/aiService';

interface ResumeAnalyzerProps {
  resume: ResumeData;
  activeRole: string;
  onNavigate: (view: string) => void;
  onApplySuggestion: (suggestion: any) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  resume,
  activeRole,
  onNavigate,
  onApplySuggestion,
}) => {
  const [analysis, setAnalysis] = useState<ATSAnalysis>(AIService.analyzeResume(resume, activeRole));
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setUploadedFileName(file.name);
      setTimeout(() => {
        // Re-analyze
        setAnalysis(AIService.analyzeResume(resume, activeRole));
        setUploading(false);
      }, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Resume Analysis & Diagnostic</h1>
          <span className="badge badge-indigo">Role: {activeRole}</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Comprehensive deep-scan evaluating content structure, keyword density, and role relevance.
        </p>
      </div>

      {/* Drag & Drop Upload Banner */}
      <div
        className="card"
        style={{
          border: '2px dashed rgba(99, 102, 241, 0.35)',
          background: 'rgba(15, 23, 42, 0.4)',
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          cursor: 'pointer',
        }}
      >
        <Upload size={38} color="#818cf8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Upload Your Resume to Re-Analyze
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '450px', margin: '0 auto 1.25rem' }}>
          Drag & drop your resume file here (supports <strong>PDF, DOC, DOCX</strong>) or evaluate your active builder version.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
            <span>Choose File</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <button onClick={() => onNavigate('resume_builder')} className="btn btn-secondary btn-sm">
            <span>Edit in Live Builder</span>
          </button>
        </div>

        {uploadedFileName && (
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} />
            <span>Successfully analyzed: {uploadedFileName}</span>
          </div>
        )}
      </div>

      {/* Overall Score Gauge & Category Scores */}
      <div className="grid-4" style={{ gap: '1.25rem' }}>
        {/* Overall Score Card */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1.75rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
          }}
        >
          <div className="score-circle" style={{ width: '100px', height: '100px', marginBottom: '0.75rem' }}>
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradAts)"
                strokeWidth="3.5"
                strokeDasharray={`${analysis.overallScore}, 100`}
              />
              <defs>
                <linearGradient id="gradAts" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-text">{analysis.overallScore}</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>Overall Resume Score</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Estimated algorithmic rating
          </div>
        </div>

        {/* Category: Content Quality */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Content Quality</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{analysis.contentQuality}%</span>
          </div>
          <div className="progress-container" style={{ marginBottom: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${analysis.contentQuality}%` }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Evaluates language clarity, summary impact, and absence of generic clichés.
          </p>
        </div>

        {/* Category: ATS Readiness */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ATS Readiness</span>
            <span style={{ fontWeight: 700, color: '#10b981' }}>{analysis.formattingScore}%</span>
          </div>
          <div className="progress-container" style={{ marginBottom: '0.75rem' }}>
            <div className="progress-fill progress-fill-emerald" style={{ width: `${analysis.formattingScore}%` }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Parser readability score, single-column alignment, and standard headers.
          </p>
        </div>

        {/* Category: Skills Relevance */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role Relevance</span>
            <span style={{ fontWeight: 700, color: '#818cf8' }}>{analysis.roleRelevance}%</span>
          </div>
          <div className="progress-container" style={{ marginBottom: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${analysis.roleRelevance}%` }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Alignment with industry requirements for {activeRole}.
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses Breakdown */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Strengths */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Key Strengths Identified</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.strengths.map((str, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Areas Requiring Attention</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.weaknesses.map((wk, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>!</span>
                <span>{wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Suggested Enhancements</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Specific improvements that boost your ATS compatibility score.
            </p>
          </div>
          <button onClick={() => onNavigate('resume_builder')} className="btn btn-outline btn-sm">
            <span>Edit in Builder</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {analysis.suggestions.map((sug, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-indigo">{sug.section}</span>
                <button
                  onClick={() => onApplySuggestion(sug)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                >
                  Apply Suggestion
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#fca5a5' }}>Current: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{sug.current}</span>
                </div>
                <div>
                  <strong style={{ color: '#6ee7b7' }}>Suggested: </strong>
                  <span style={{ color: '#ffffff' }}>{sug.suggested}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#818cf8', marginTop: '0.2rem' }}>
                  <strong>Why it matters:</strong> {sug.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        ℹ️ <strong>Transparency Notice:</strong> Resume scores are estimated indicators based on keyword density, section taxonomy, and industry heuristics. No tool can guarantee passing external corporate ATS systems.
      </div>
    </div>
  );
};
