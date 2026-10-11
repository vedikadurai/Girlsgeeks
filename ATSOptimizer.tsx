import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  FileSearch,
  Sparkles,
  Layers
} from 'lucide-react';
import { ResumeData, JobMatchResult } from '../types';
import { AIService } from '../services/aiService';

interface ATSOptimizerProps {
  resume: ResumeData;
  activeRole: string;
  onAddMissingKeyword: (kw: string) => void;
  onNavigate: (view: string) => void;
}

export const ATSOptimizer: React.FC<ATSOptimizerProps> = ({
  resume,
  activeRole,
  onAddMissingKeyword,
  onNavigate,
}) => {
  const [jobDescriptionInput, setJobDescriptionInput] = useState(`We are looking for a Software Developer / Python Engineer to design and implement backend services, clean REST APIs, and database queries. 
Requirements:
- Strong knowledge of Python, Java, or C++ and Object-Oriented Programming (OOP)
- Hands-on experience with SQL databases and relational indexing
- Familiarity with Docker, Git version control, and CI/CD pipelines
- Experience with Unit Testing (PyTest/JUnit) and agile software development`);

  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysis = AIService.analyzeResume(resume, activeRole);

  const handleAnalyzeJob = () => {
    if (!jobDescriptionInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = AIService.matchResumeToJob(resume, jobDescriptionInput, activeRole);
      setMatchResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>ATS Optimizer & Job Description Matcher</h1>
          <span className="badge badge-indigo">Role: {activeRole}</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Analyze keyword coverage and compare your resume directly against specific company job postings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>ATS Indicator Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{analysis.overallScore}/100</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Parsed 45+ resume tokens</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Keyword Match</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8' }}>{analysis.keywordMatch}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{analysis.matchedKeywords.length} matched</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Formatting & Hierarchy</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{analysis.formattingScore}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Single-column readable</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Role Relevance</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4' }}>{analysis.roleRelevance}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>For {activeRole}</div>
        </div>
      </div>

      {/* Keywords Breakdown (Matched vs Missing) */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Matched Keywords */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Matched Core Keywords ({analysis.matchedKeywords.length})
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            These terms are clearly detected in your resume and align with standard {activeRole} job postings.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {analysis.matchedKeywords.map((kw) => (
              <span key={kw} className="badge badge-emerald" style={{ fontSize: '0.825rem', padding: '0.3rem 0.65rem' }}>
                <span>✓ {kw}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Less Evident Keywords */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Potentially Missing / Less Evident ({analysis.missingKeywords.length})
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Adding verified experience with these technologies will noticeably improve your candidate ranking:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {analysis.missingKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onAddMissingKeyword(kw)}
                className="badge badge-amber"
                style={{ fontSize: '0.825rem', padding: '0.3rem 0.65rem', cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                title="Click to add to your resume skills"
              >
                <span>+ {kw}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Job Description Matcher */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <FileSearch size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Paste Job Description & Compare</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Compare your active resume directly against a job opening from companies like Zoho, Thoughtworks, TCS, or Google.
          </p>
        </div>

        <div>
          <textarea
            className="textarea"
            rows={5}
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
            placeholder="Paste complete Job Description here..."
          />
        </div>

        <div>
          <button
            onClick={handleAnalyzeJob}
            disabled={isAnalyzing}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Analyzing Job Requirements...' : 'Analyze Job Description Match'}</span>
          </button>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MATCH PERCENTAGE</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: matchResult.matchScore >= 80 ? '#10b981' : '#f59e0b' }}>
                  {matchResult.matchScore}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-indigo">Role: {matchResult.jobTitle}</span>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                  {matchResult.experienceAlignment}
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#6ee7b7', display: 'block', marginBottom: '0.35rem' }}>
                  Matching Skills Identified:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {matchResult.matchedSkills.map((sk) => (
                    <span key={sk} className="badge badge-emerald">{sk}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#fca5a5', display: 'block', marginBottom: '0.35rem' }}>
                  Missing / Desired Skills:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {matchResult.missingSkills.map((sk) => (
                    <span key={sk} className="badge badge-rose">{sk}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block', marginBottom: '0.35rem' }}>
                Suggested Tailoring for this Posting:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                {matchResult.keywordSuggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => onNavigate('resume_builder')} className="btn btn-outline btn-sm">
                Apply Keywords in Live Builder →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
