import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileEdit,
  Cpu,
  Mic2,
  TrendingUp,
  CalendarCheck2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Award,
  Globe,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryInterview: () => void;
  onExplorePlan: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onTryInterview,
  onExplorePlan,
}) => {
  const features = [
    {
      icon: FileEdit,
      title: 'Live Split-Screen Resume Builder',
      desc: 'Build your resume with live split-screen preview across 7 templates. Real-time ATS scoring evaluates keyword density as you type.',
      badge: 'Live ATS Meter',
    },
    {
      icon: Cpu,
      title: 'ATS & Job Description Matcher',
      desc: 'Paste any target company job description to get instant keyword match %, missing competencies, and high-impact phrasing suggestions.',
      badge: 'Role Alignment',
    },
    {
      icon: Mic2,
      title: 'Multilingual AI Mock Interviews',
      desc: 'Practice technical, HR, and behavioral questions in Tamil, Hindi, Telugu, Kannada, English, and more with voice input and audio replay.',
      badge: '10 Regional Languages',
    },
    {
      icon: Sparkles,
      title: 'Explain Question Without Spoiling',
      desc: 'Need conceptual clarity? Ask the AI to explain the question in your native language without giving away the exact answer.',
      badge: 'Smart Concept Explainer',
    },
    {
      icon: TrendingUp,
      title: 'Deep Skill Gap Diagnostics',
      desc: 'Compare your verified skills against Software Developer, Python, or Full Stack benchmarks with clear radar maps and practice topics.',
      badge: 'Multi-Role Benchmarks',
    },
    {
      icon: CalendarCheck2,
      title: '4-Week Career Readiness Plan',
      desc: 'Follow a structured 28-day daily roadmap with streak tracking, task completions, weekly reviews, and before-vs-after career reports.',
      badge: 'Adaptive Schedule',
    },
    {
      icon: Layers,
      title: 'Interactive Portfolio Builder',
      desc: 'Automatically generate a modern, publish-ready personal portfolio website showcasing your projects, skills, and verified achievements.',
      badge: '1-Click Export',
    },
    {
      icon: Award,
      title: 'Job Application Tracker',
      desc: 'Keep track of every application status from Saved to Interview and Offer with linked tailored resume versions.',
      badge: 'Pipeline CRM',
    },
  ];

  const steps = [
    { num: '01', title: 'Profile & Target Roles', desc: 'Select up to 5 target career roles and specify your technical skills and study preferences.' },
    { num: '02', title: 'Live Resume & ATS Optimization', desc: 'Craft your resume with real-time ATS feedback and generate tailored role versions.' },
    { num: '03', title: 'Multilingual Mock Interviews', desc: 'Practice role-tailored questions in your preferred language with adaptive follow-ups.' },
    { num: '04', title: 'Detailed Feedback & Skill Gaps', desc: 'Receive STAR-method feedback, confidence indicators, and actionable technical drills.' },
    { num: '05', title: 'Execute 4-Week Career Roadmap', desc: 'Complete daily tasks, build your portfolio, track job applications, and secure offers.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Hero Banner */}
      <section
        style={{
          padding: '5rem 2rem 4rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span className="badge badge-indigo" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} color="#818cf8" />
            Empowering College Students & Early-Career Tech Professionals
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
          }}
        >
          Your Complete{' '}
          <span
            style={{
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Career Coach
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: 'var(--text-light)',
            maxWidth: '780px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Build a job-ready resume, practice multilingual AI mock interviews, diagnose your skill gaps, and follow an adaptive 4-week preparation roadmap to land your dream role.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button onClick={onGetStarted} className="btn btn-primary btn-lg" style={{ gap: '0.65rem' }}>
            <span>Build My Resume</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={onTryInterview} className="btn btn-secondary btn-lg" style={{ gap: '0.65rem' }}>
            <Mic2 size={18} color="#818cf8" />
            <span>Try AI Mock Interview</span>
          </button>
          <button onClick={onExplorePlan} className="btn btn-outline btn-lg" style={{ gap: '0.65rem' }}>
            <CalendarCheck2 size={18} color="#a855f7" />
            <span>Explore 4-Week Plan</span>
          </button>
        </div>

        {/* Visual Workflow Pipeline */}
        <div
          className="card"
          style={{
            padding: '2rem 1.5rem',
            background: 'linear-gradient(180deg, rgba(20, 30, 51, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            The Complete Career Readiness Pipeline
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {[
              { label: 'Profile & Roles', color: '#6366f1' },
              { label: 'Live Resume Builder', color: '#8b5cf6' },
              { label: 'ATS Analysis', color: '#06b6d4' },
              { label: 'Job Matching', color: '#3b82f6' },
              { label: 'Multilingual Mock Interview', color: '#a855f7' },
              { label: 'Skill Gap Diagnostics', color: '#f59e0b' },
              { label: '4-Week Roadmap', color: '#10b981' },
              { label: 'Career Ready 🚀', color: '#ec4899' },
            ].map((node, i, arr) => (
              <React.Fragment key={node.label}>
                <div
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${node.color}40`,
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.color }} />
                  {node.label}
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={16} color="var(--text-muted)" style={{ opacity: 0.7 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Engineered for Real Career Breakthroughs
          </h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '650px', margin: '0 auto' }}>
            Not another superficial resume checker. A full-stack AI career platform designed to guide you through every stage of placement.
          </p>
        </div>

        <div className="grid-4" style={{ gap: '1.5rem' }}>
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Icon size={22} color="#818cf8" />
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {feat.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.65rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works section */}
      <section
        style={{
          padding: '4.5rem 2rem',
          background: 'rgba(15, 23, 42, 0.5)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              Step-by-Step Methodology
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>How CareerAI Coach Works</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((s) => (
              <div
                key={s.num}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.75rem',
                  padding: '1.25rem 1.75rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--accent-indigo)',
                    opacity: 0.9,
                    minWidth: '50px',
                  }}
                >
                  {s.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>{s.desc}</p>
                </div>
                <CheckCircle2 size={22} color="#10b981" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '4.5rem 2rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Built for Accuracy, Speed & Inclusion</h2>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          <div className="card">
            <Globe size={26} color="#06b6d4" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Multilingual By Design</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Interview comfortably in your native tongue (Tamil, Hindi, Telugu, Kannada, Bengali, etc.) while building professional fluency.
            </p>
          </div>
          <div className="card">
            <ShieldCheck size={26} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Privacy & Transparency</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Your data stays in your browser storage. We never fabricate accomplishments or make false claims about proprietary ATS secrets.
            </p>
          </div>
          <div className="card">
            <CalendarCheck2 size={26} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Daily Habit Building</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Study streaks, 30m–2h adaptive timelines, and daily recommendations transform preparation from stressful cramming into a confident habit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{ padding: '4rem 2rem 5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.7)' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to Get Career Ready?
        </h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join Arun Kumar and hundreds of students optimizing their profiles and practicing multilingual mock interviews today.
        </p>
        <button onClick={onGetStarted} className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
          <span>Launch Dashboard & Resume Builder</span>
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2.5rem 2rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
          <a href="#about" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>About Platform</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); onExplorePlan(); }}>Features</a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Privacy & Security</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Contact Support</a>
        </div>
        <p>© 2026 CareerAI Coach. All rights reserved. Analyze. Practice. Improve. Get Career Ready.</p>
      </footer>
    </div>
  );
};
