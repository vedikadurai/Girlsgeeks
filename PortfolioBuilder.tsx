import React, { useState } from 'react';
import {
  Layers,
  Download,
  Copy,
  ExternalLink,
  Code2,
  Globe,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PortfolioData, ProjectItem } from '../types';

interface PortfolioBuilderProps {
  portfolio: PortfolioData;
  onSavePortfolio: (data: PortfolioData) => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({
  portfolio,
  onSavePortfolio,
}) => {
  const [data, setData] = useState<PortfolioData>(portfolio);
  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.fullName} | Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #090d16; color: #f8fafc; margin: 0; padding: 2rem; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 2.5rem; margin-bottom: 0.2rem; color: #ffffff; }
    .subtitle { color: #818cf8; font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; }
    .bio { color: #cbd5e1; font-size: 1rem; margin-bottom: 2rem; }
    .card { background: #131b2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .pill { display: inline-block; background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; margin: 0.2rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${data.fullName}</h1>
    <div class="subtitle">${data.title}</div>
    <p class="bio">${data.bio}</p>
    <h2>Projects</h2>
    ${data.projects.map(p => `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.solution}</p>
        <div>${p.technologies.map(t => `<span class="pill">${t}</span>`).join('')}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  };

  const handleDownloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.fullName.toLowerCase().replace(/\s+/g, '_')}_portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Personal Developer Portfolio Generator</h1>
            <span className="badge badge-emerald">Ready to Publish</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
            Instantly turn your verified projects, technical skills, and achievements into a modern web showcase.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button onClick={handleCopyCode} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Copy size={15} />
            <span>{copied ? 'HTML Copied!' : 'Copy HTML'}</span>
          </button>
          <button onClick={handleDownloadHTML} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <Download size={15} />
            <span>Download Standalone HTML</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>PORTFOLIO THEME:</span>
        {(['developer', 'modern', 'minimal', 'creative'] as PortfolioData['template'][]).map((tmpl) => (
          <button
            key={tmpl}
            onClick={() => {
              const updated = { ...data, template: tmpl };
              setData(updated);
              onSavePortfolio(updated);
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              background: data.template === tmpl ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: data.template === tmpl ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            {tmpl}
          </button>
        ))}
      </div>

      {/* Live Interactive Portfolio Preview Screen */}
      <div
        className="card"
        style={{
          background: data.template === 'developer' ? '#090d16' : data.template === 'minimal' ? '#0f172a' : '#141e33',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          maxWidth: '920px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Hero Section */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.65rem' }}>
                Open to Graduate Engineering Opportunities
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
                {data.fullName}
              </h1>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#818cf8', marginBottom: '0.75rem' }}>
                {data.title}
              </div>
              <p style={{ color: 'var(--text-light)', maxWidth: '650px', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {data.bio}
              </p>
            </div>

            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              AK
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={16} color="#818cf8" /> {data.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} color="#818cf8" /> {data.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code2 size={16} color="#818cf8" /> {data.github.replace('https://', '')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Globe size={16} color="#818cf8" /> {data.linkedin.replace('https://', '')}
            </span>
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Technical Expertise
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.skills.map((skill) => (
              <span key={skill} className="badge badge-indigo" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Showcase */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Featured Projects
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {proj.title}
                  </h3>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      <Code2 size={13} />
                      <span>Source</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                  {proj.solution}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {proj.technologies.map((t) => (
                    <span key={t} className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Achievements */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Achievements & Hackathons
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{ach.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', margin: '0.15rem 0' }}>{ach.organization} • {ach.year}</div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
