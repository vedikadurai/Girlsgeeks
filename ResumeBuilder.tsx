import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Plus,
  Trash2,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  CheckCircle2,
  Save,
  Wand2
} from 'lucide-react';
import { ResumeData, ProjectItem, ExperienceItem, EducationItem, CertificationItem, AchievementItem } from '../types';
import { AIService } from '../services/aiService';

interface ResumeBuilderProps {
  initialResume: ResumeData;
  activeRole: string;
  onSaveResume: (resume: ResumeData) => void;
  onCreateRoleVersion: (role: string) => void;
  availableRoles: string[];
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialResume,
  activeRole,
  onSaveResume,
  onCreateRoleVersion,
  availableRoles,
}) => {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications' | 'achievements'>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeData['template']>(initialResume.template || 'modern');
  const [atsScore, setAtsScore] = useState<number>(initialResume.atsScoreEstimate || 84);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Sync when initialResume changes
  useEffect(() => {
    setResume(initialResume);
    setSelectedTemplate(initialResume.template || 'modern');
  }, [initialResume]);

  // Real-time ATS Score calculation as user edits
  useEffect(() => {
    const analysis = AIService.analyzeResume(resume, activeRole);
    setAtsScore(analysis.overallScore);
  }, [resume, activeRole]);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSave = () => {
    const updated = {
      ...resume,
      template: selectedTemplate,
      atsScoreEstimate: atsScore,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setResume(updated);
    onSaveResume(updated);
    showToast('Resume saved successfully! ATS indicator updated.');
  };

  // AI Assist: Improve Summary
  const handleImproveSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const improved = `Results-driven and detail-oriented Computer Science undergraduate with specialized hands-on proficiency in ${resume.technicalSkills.slice(0, 4).join(', ')}. Demonstrated success delivering high-impact projects including an automated QR-based attendance tracking platform. Adept at algorithmic problem-solving, clean OOP design, and collaborating in agile software engineering environments to build performant, maintainable solutions for ${activeRole} teams.`;
      setResume((prev) => ({ ...prev, summary: improved }));
      setAiGenerating(false);
      showToast('AI improved professional summary using action verbs & target keywords!');
    }, 500);
  };

  // AI Assist: Improve Project Bullet
  const handleImproveBullet = (projectIdx: number, bulletIdx: number) => {
    const currentBullet = resume.projects[projectIdx].bullets[bulletIdx];
    const improved = AIService.improveResumeBullet(currentBullet, activeRole, 'xyz');
    const updatedProjects = [...resume.projects];
    updatedProjects[projectIdx].bullets[bulletIdx] = improved;
    setResume((prev) => ({ ...prev, projects: updatedProjects }));
    showToast('Applied Google XYZ formula to project bullet!');
  };

  // Add bullet to project
  const handleAddBullet = (projectIdx: number) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[projectIdx].bullets.push('Architected modular service components, reducing processing latency and improving reliability.');
    setResume((prev) => ({ ...prev, projects: updatedProjects }));
  };

  // Remove bullet from project
  const handleRemoveBullet = (projectIdx: number, bulletIdx: number) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[projectIdx].bullets.splice(bulletIdx, 1);
    setResume((prev) => ({ ...prev, projects: updatedProjects }));
  };

  // Add project
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'New Technical Project',
      problem: 'Describe the real problem your project tackled.',
      solution: 'Explain your technical implementation and architecture.',
      technologies: ['Python', 'SQL', 'Git'],
      role: 'Developer',
      features: ['Core functionality', 'Database integration'],
      outcome: 'Measurable metric improvement (e.g. 25% efficiency).',
      githubUrl: 'https://github.com/arunkumar-dev',
      demoUrl: '',
      bullets: [
        'Engineered responsive backend endpoints utilizing optimized database queries.',
        'Implemented automated unit testing suite ensuring 90%+ code coverage.',
      ],
    };
    setResume((prev) => ({ ...prev, projects: [newProj, ...prev.projects] }));
    showToast('Added new project! Fill details and use AI Improve.');
  };

  // Delete project
  const handleDeleteProject = (idx: number) => {
    const updated = [...resume.projects];
    updated.splice(idx, 1);
    setResume((prev) => ({ ...prev, projects: updated }));
  };

  // Add skill
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!resume.technicalSkills.includes(newSkillInput.trim())) {
      setResume((prev) => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newSkillInput.trim()],
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setResume((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((s) => s !== skill),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast Notification */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '25px',
            background: 'var(--accent-emerald)',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Controls Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Live AI Resume Builder</h1>
            <span className="badge badge-indigo">Target: {activeRole}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Split-screen interactive editor. Real-time ATS scoring updates instantly as you type.
          </p>
        </div>

        {/* Live ATS Indicator Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 1rem',
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>LIVE ATS READINESS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: atsScore >= 85 ? '#10b981' : atsScore >= 75 ? '#818cf8' : '#f59e0b' }}>
                  {atsScore}/100
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  {atsScore >= 85 ? 'Strong Match' : 'Aligned'}
                </span>
              </div>
            </div>
            <Cpu size={22} color={atsScore >= 85 ? '#10b981' : '#818cf8'} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleSave} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Save size={15} />
              <span>Save Resume</span>
            </button>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Template & Role Version Toolbar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>TEMPLATE:</span>
          {(['modern', 'professional', 'minimal', 'ats', 'technical', 'student', 'creative'] as ResumeData['template'][]).map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => setSelectedTemplate(tmpl)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: selectedTemplate === tmpl ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: selectedTemplate === tmpl ? 'none' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {tmpl}
            </button>
          ))}
        </div>

        {/* 1-Click Role Specific Resume Version Generator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Generate Version:</span>
          <select
            className="select"
            style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onChange={(e) => {
              if (e.target.value) {
                onCreateRoleVersion(e.target.value);
                showToast(`Generated dedicated resume version for ${e.target.value}!`);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Select Target Role...</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Column Layout: Editor (Left) & Live Preview (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 1fr) minmax(500px, 1.15fr)',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Section Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'personal', label: 'Contact' },
              { id: 'summary', label: 'Summary' },
              { id: 'education', label: 'Education' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'certifications', label: 'Certs' },
              { id: 'achievements', label: 'Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                  border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal Information */}
          {activeTab === 'personal' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Contact & Header Details</h3>
              <div className="grid-2">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.fullName}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, fullName: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Professional Title / Headline</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.title}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, title: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    value={resume.personalInfo.email}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.phone}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid-3">
                <div>
                  <label className="label">Location (City, Country)</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.location}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, location: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">LinkedIn Profile</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">GitHub Profile</label>
                  <input
                    type="text"
                    className="input"
                    value={resume.personalInfo.github}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, github: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Professional Summary with AI assist */}
          {activeTab === 'summary' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Professional Summary</h3>
                <button
                  onClick={handleImproveSummary}
                  disabled={aiGenerating}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.4rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
                >
                  <Wand2 size={14} />
                  <span>{aiGenerating ? 'AI Improving...' : 'Improve with AI'}</span>
                </button>
              </div>

              <textarea
                className="textarea"
                rows={6}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                placeholder="Write your career summary or click 'Improve with AI' to draft a tailored summary based on your verified skills..."
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                💡 Tip: Professional summaries should highlight your technical focus, top project accomplishments, and alignment with {activeRole}.
              </div>
            </div>
          )}

          {/* Tab 3: Projects (with AI bullet enhancement) */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Featured Projects ({resume.projects.length})</h3>
                <button onClick={handleAddProject} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                  <Plus size={15} />
                  <span>Add Project</span>
                </button>
              </div>

              {resume.projects.map((proj, pIdx) => (
                <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="input"
                      style={{ fontWeight: 700, fontSize: '1rem', width: '70%' }}
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[pIdx].title = e.target.value;
                        setResume({ ...resume, projects: updated });
                      }}
                    />
                    <button
                      onClick={() => handleDeleteProject(pIdx)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.5rem' }}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid-2">
                    <div>
                      <label className="label">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        className="input"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[pIdx].technologies = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          setResume({ ...resume, projects: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Live Demo or GitHub URL</label>
                      <input
                        type="text"
                        className="input"
                        value={proj.githubUrl}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[pIdx].githubUrl = e.target.value;
                          setResume({ ...resume, projects: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="label" style={{ margin: 0 }}>Bullet Points (Action & Results)</label>
                      <button
                        onClick={() => handleAddBullet(pIdx)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <textarea
                            className="textarea"
                            rows={2}
                            style={{ flex: 1, fontSize: '0.85rem' }}
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resume.projects];
                              updated[pIdx].bullets[bIdx] = e.target.value;
                              setResume({ ...resume, projects: updated });
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <button
                              onClick={() => handleImproveBullet(pIdx, bIdx)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.3rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
                              title="Rewrite bullet with Google XYZ formula"
                            >
                              <Wand2 size={13} />
                            </button>
                            <button
                              onClick={() => handleRemoveBullet(pIdx, bIdx)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.3rem' }}
                              title="Remove bullet"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Technical Skills */}
          {activeTab === 'skills' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Technical Skills ({resume.technicalSkills.length})</h3>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Docker, TypeScript, Django..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button onClick={handleAddSkill} className="btn btn-primary btn-sm">
                  Add Skill
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {resume.technicalSkills.map((sk) => (
                  <span
                    key={sk}
                    className="badge badge-indigo"
                    style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}
                  >
                    <span>{sk}</span>
                    <button
                      onClick={() => handleRemoveSkill(sk)}
                      style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', marginLeft: '4px' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  RECOMMENDED FOR {activeRole.toUpperCase()}:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['REST APIs', 'Docker', 'PostgreSQL', 'Unit Testing', 'Git Flow', 'Linux'].map((rec) => (
                    <button
                      key={rec}
                      onClick={() => {
                        if (!resume.technicalSkills.includes(rec)) {
                          setResume({ ...resume, technicalSkills: [...resume.technicalSkills, rec] });
                          showToast(`Added ${rec} to resume skills!`);
                        }
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    >
                      + {rec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Education */}
          {activeTab === 'education' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Education</h3>
              {resume.education.map((edu, idx) => (
                <div key={edu.id} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div className="grid-2" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <label className="label">Institution / College</label>
                      <input
                        type="text"
                        className="input"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[idx].institution = e.target.value;
                          setResume({ ...resume, education: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Degree & Major</label>
                      <input
                        type="text"
                        className="input"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[idx].degree = e.target.value;
                          setResume({ ...resume, education: updated });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label className="label">Graduation Year / Duration</label>
                      <input
                        type="text"
                        className="input"
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[idx].endDate = e.target.value;
                          setResume({ ...resume, education: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Grade / CGPA</label>
                      <input
                        type="text"
                        className="input"
                        value={edu.grade}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[idx].grade = e.target.value;
                          setResume({ ...resume, education: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 6: Experience */}
          {activeTab === 'experience' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Internships & Experience</h3>
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div className="grid-2" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <label className="label">Company / Organization</label>
                      <input
                        type="text"
                        className="input"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].company = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Job Role</label>
                      <input
                        type="text"
                        className="input"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].role = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label className="label">Duration</label>
                      <input
                        type="text"
                        className="input"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].endDate = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Location</label>
                      <input
                        type="text"
                        className="input"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].location = e.target.value;
                          setResume({ ...resume, experience: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 7: Certifications & Achievements */}
          {(activeTab === 'certifications' || activeTab === 'achievements') && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Certifications & Achievements</h3>
              {resume.certifications.map((c) => (
                <div key={c.id} style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.issuer} • {c.issueDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Resume Document Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live Document Preview ({selectedTemplate.toUpperCase()} TEMPLATE)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Synchronized Real-Time
            </span>
          </div>

          {/* Printable White Resume Canvas */}
          <div
            className="resume-paper-target"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '2.25rem',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
              fontFamily: selectedTemplate === 'ats' ? 'Arial, sans-serif' : 'var(--font-sans)',
              fontSize: '0.84rem',
              lineHeight: 1.45,
              minHeight: '750px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: selectedTemplate === 'minimal' ? '1px solid #e2e8f0' : '2px solid #4f46e5',
                paddingBottom: '0.85rem',
                marginBottom: '1rem',
                textAlign: selectedTemplate === 'professional' ? 'center' : 'left',
              }}
            >
              <h1
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: selectedTemplate === 'technical' ? '#1e293b' : '#111827',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {resume.personalInfo.fullName}
              </h1>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4f46e5', marginTop: '0.15rem' }}>
                {resume.personalInfo.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                  fontSize: '0.775rem',
                  color: '#475569',
                  marginTop: '0.4rem',
                  justifyContent: selectedTemplate === 'professional' ? 'center' : 'flex-start',
                }}
              >
                <span>📧 {resume.personalInfo.email}</span>
                <span>📱 {resume.personalInfo.phone}</span>
                <span>📍 {resume.personalInfo.location}</span>
                {resume.personalInfo.github && <span>🔗 {resume.personalInfo.github}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#1e293b',
                    borderBottom: '1px solid #cbd5e1',
                    paddingBottom: '0.2rem',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  Professional Summary
                </div>
                <p style={{ color: '#334155', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Technical Skills */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#1e293b',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.2rem',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.05em',
                }}
              >
                Technical Competencies
              </div>
              <div style={{ fontSize: '0.825rem', color: '#334155' }}>
                <strong>Core Skills:</strong> {resume.technicalSkills.join(', ')}
              </div>
            </div>

            {/* Experience */}
            {resume.experience.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#1e293b',
                    borderBottom: '1px solid #cbd5e1',
                    paddingBottom: '0.2rem',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  Experience & Internships
                </div>
                {resume.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>{exp.role} — <span style={{ color: '#4f46e5' }}>{exp.company}</span></span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul style={{ paddingLeft: '1.1rem', margin: '0.25rem 0 0', color: '#334155' }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: '0.2rem' }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#1e293b',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.2rem',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.05em',
                }}
              >
                Key Projects
              </div>
              {resume.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {proj.title} | <span style={{ fontSize: '0.78rem', color: '#4f46e5' }}>{proj.technologies.slice(0, 4).join(', ')}</span>
                    </span>
                    {proj.githubUrl && (
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{proj.githubUrl.replace('https://', '')}</span>
                    )}
                  </div>
                  <ul style={{ paddingLeft: '1.1rem', margin: '0.25rem 0 0', color: '#334155' }}>
                    {proj.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: '0.2rem' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#1e293b',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.2rem',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.05em',
                }}
              >
                Education
              </div>
              {resume.education.map((edu) => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#334155' }}>
                  <div>
                    <strong>{edu.institution}</strong> — {edu.degree}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {edu.grade} | {edu.endDate}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements & Certifications */}
            {resume.certifications.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#1e293b',
                    borderBottom: '1px solid #cbd5e1',
                    paddingBottom: '0.2rem',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  Certifications & Honors
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                  {resume.certifications.map((c) => `${c.name} (${c.issuer})`).join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
