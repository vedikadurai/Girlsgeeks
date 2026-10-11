import React, { useState } from 'react';
import {
  Target,
  Plus,
  Check,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AVAILABLE_JOB_ROLES, UserProfile, ResumeData } from '../types';

interface RoleProfileManagerProps {
  user: UserProfile;
  activeRole: string;
  onUpdateRoles: (newRoles: string[], newActiveRole: string) => void;
  onNavigate: (view: string) => void;
}

export const RoleProfileManager: React.FC<RoleProfileManagerProps> = ({
  user,
  activeRole,
  onUpdateRoles,
  onNavigate,
}) => {
  const [targetRoles, setTargetRoles] = useState<string[]>(user.targetRoles);
  const [currentActive, setCurrentActive] = useState<string>(activeRole);
  const [search, setSearch] = useState('');
  const [customRoleInput, setCustomRoleInput] = useState('');

  const handleToggleRole = (role: string) => {
    if (targetRoles.includes(role)) {
      if (targetRoles.length <= 1) {
        alert('You must maintain at least 1 target career role.');
        return;
      }
      const updated = targetRoles.filter((r) => r !== role);
      setTargetRoles(updated);
      const nextActive = currentActive === role ? updated[0] : currentActive;
      setCurrentActive(nextActive);
      onUpdateRoles(updated, nextActive);
    } else {
      if (targetRoles.length >= 5) {
        alert('You can select a maximum of 5 target career roles.');
        return;
      }
      const updated = [...targetRoles, role];
      setTargetRoles(updated);
      onUpdateRoles(updated, currentActive);
    }
  };

  const handleAddCustomRole = () => {
    if (!customRoleInput.trim()) return;
    const roleName = customRoleInput.trim();
    if (targetRoles.includes(roleName)) return;
    if (targetRoles.length >= 5) {
      alert('You can select a maximum of 5 target career roles.');
      return;
    }
    const updated = [...targetRoles, roleName];
    setTargetRoles(updated);
    setCustomRoleInput('');
    onUpdateRoles(updated, currentActive);
  };

  const filteredAvailable = AVAILABLE_JOB_ROLES.filter((r) =>
    r.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Target Job Roles & Multi-Role Profiles</h1>
          <span className="badge badge-indigo">{targetRoles.length} / 5 Roles Selected</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Select up to 5 target roles. Each role maintains independent ATS scoring, interview question banks, and learning roadmaps.
        </p>
      </div>

      {/* Active Role Selector Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              PRIMARY PREPARATION FOCUS
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              {currentActive}
            </div>
          </div>
          <span className="badge badge-emerald">Active Diagnostic Mode</span>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {targetRoles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setCurrentActive(role);
                onUpdateRoles(targetRoles, role);
              }}
              className={`btn btn-sm ${role === currentActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ gap: '0.4rem' }}
            >
              <span>{role}</span>
              {role === currentActive && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Role Comparison Cards */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Multi-Role Preparation Profiles</h3>
        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {targetRoles.map((role) => {
            const isCurrent = role === currentActive;
            const matchScore = role === 'Software Developer' ? 84 : role === 'Python Developer' ? 91 : 76;
            const skillReadiness = role === 'Software Developer' ? 78 : role === 'Python Developer' ? 82 : 71;
            return (
              <div
                key={role}
                className="card card-interactive"
                style={{
                  border: isCurrent ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid var(--border-subtle)',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{role}</h4>
                  {isCurrent && <span className="badge badge-indigo">Active</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Resume ATS Match:</span>
                      <strong style={{ color: '#ffffff' }}>{matchScore}%</strong>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${matchScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Skill Readiness:</span>
                      <strong style={{ color: '#10b981' }}>{skillReadiness}%</strong>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill progress-fill-emerald" style={{ width: `${skillReadiness}%` }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {!isCurrent ? (
                    <button
                      onClick={() => {
                        setCurrentActive(role);
                        onUpdateRoles(targetRoles, role);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Make Active
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>Currently Active</span>
                  )}

                  <button
                    onClick={() => handleToggleRole(role)}
                    className="btn btn-danger btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Directory & Search */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Add or Change Target Roles</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Search from available industry roles or create a custom role title.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search roles (e.g. Developer, Data, AI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input"
              placeholder="Custom job role..."
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              style={{ width: '200px' }}
            />
            <button onClick={handleAddCustomRole} className="btn btn-primary btn-sm">
              <Plus size={15} /> Add Custom
            </button>
          </div>
        </div>

        {/* Available Roles Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filteredAvailable.map((role) => {
            const isSelected = targetRoles.includes(role);
            return (
              <button
                key={role}
                onClick={() => handleToggleRole(role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: '#ffffff',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{role}</span>
                {isSelected ? <Check size={14} /> : <Plus size={14} color="var(--text-muted)" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
