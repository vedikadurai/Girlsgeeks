import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { ProjectItem } from '../types';
import { AIService } from '../services/aiService';

interface ProjectsManagerProps {
  projects: ProjectItem[];
  activeRole: string;
  onSaveProjects: (projects: ProjectItem[]) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  activeRole,
  onSaveProjects,
}) => {
  const [list, setList] = useState<ProjectItem[]>(projects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProj, setNewProj] = useState<Partial<ProjectItem>>({
    title: '',
    problem: '',
    solution: '',
    technologies: [],
    role: 'Lead Developer',
    features: [],
    outcome: '',
    githubUrl: '',
    demoUrl: '',
    bullets: [],
  });
  const [techInput, setTechInput] = useState('');
  const [rawNote, setRawNote] = useState('');

  const handleGenerateBullets = () => {
    if (!rawNote.trim()) return;
    const bullet1 = AIService.improveResumeBullet(rawNote, activeRole, 'xyz');
    const bullet2 = `Engineered core modules using ${newProj.technologies?.slice(0, 3).join(', ') || 'modern frameworks'}, ensuring robust fault tolerance and scalability.`;
    setNewProj({
      ...newProj,
      bullets: [bullet1, bullet2],
    });
  };

  const handleAddProject = () => {
    if (!newProj.title) return;
    const p: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: newProj.title,
      problem: newProj.problem || 'Identified latency bottlenecks in existing manual procedures.',
      solution: newProj.solution || 'Engineered automated software solution with clean architecture.',
      technologies: newProj.technologies?.length ? newProj.technologies : ['Python', 'SQL', 'Git'],
      role: newProj.role || 'Developer',
      features: newProj.features || ['Core API endpoints', 'Database persistence'],
      outcome: newProj.outcome || 'Improved process throughput by 30%.',
      githubUrl: newProj.githubUrl || 'https://github.com/arunkumar-dev',
      demoUrl: newProj.demoUrl || '',
      bullets: newProj.bullets?.length ? newProj.bullets : [
        'Architected end-to-end software platform using best-practice design patterns.',
        'Engineered optimized database queries achieving low-latency lookups under concurrent load.',
      ],
    };
    const updated = [p, ...list];
    setList(updated);
    onSaveProjects(updated);
    setShowAddModal(false);
    setRawNote('');
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((p) => p.id !== id);
    setList(updated);
    onSaveProjects(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Smart Technical Project Builder</h1>
            <span className="badge badge-indigo">{list.length} Verified Projects</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
            Convert rough project notes into structured, Google XYZ formula bullet points with problem-solution breakdowns.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {list.map((proj) => (
          <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {proj.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#818cf8', marginTop: '0.2rem' }}>
                  Role: {proj.role}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Code2 size={14} /> Source
                  </a>
                )}
                <button onClick={() => handleDelete(proj.id)} className="btn btn-secondary btn-sm" style={{ color: '#fca5a5' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '0.2rem' }}>Problem Solved:</strong>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>{proj.problem}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                <strong style={{ color: '#6ee7b7', display: 'block', marginBottom: '0.2rem' }}>Technical Solution:</strong>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>{proj.solution}</p>
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block', marginBottom: '0.35rem' }}>
                Resume Bullet Points (Quantified XYZ Impact):
              </strong>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
                {proj.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {proj.technologies.map((t) => (
                <span key={t} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Smart Project Wizard</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Project Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Distributed Cache Engine, IoT Sensor Hub..."
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Rough Project Notes (AI will format with XYZ formula):</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Made QR attendance system with Python to stop proxy..."
                    value={rawNote}
                    onChange={(e) => setRawNote(e.target.value)}
                  />
                  <button onClick={handleGenerateBullets} className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap', gap: '0.3rem' }}>
                    <Wand2 size={14} /> AI Format
                  </button>
                </div>
              </div>

              {newProj.bullets && newProj.bullets.length > 0 && (
                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.2rem' }}>AI Generated Bullets:</div>
                  <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#ffffff', margin: 0 }}>
                    {newProj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}

              <div className="grid-2">
                <div>
                  <label className="label">GitHub Repo URL</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="https://github.com/..."
                    value={newProj.githubUrl}
                    onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Your Role</label>
                  <input
                    type="text"
                    className="input"
                    value={newProj.role}
                    onChange={(e) => setNewProj({ ...newProj, role: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleAddProject} className="btn btn-primary">
                  Add to Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
