import React, { useState } from 'react';
import {
  User,
  Save,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Target
} from 'lucide-react';
import { UserProfile, AVAILABLE_JOB_ROLES } from '../types';

interface ProfileEditModalProps {
  user: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onNavigate: (view: string) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  user,
  onSaveProfile,
  onNavigate,
}) => {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!profile.technicalSkills.includes(techInput.trim())) {
      setProfile({
        ...profile,
        technicalSkills: [...profile.technicalSkills, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (skill: string) => {
    setProfile({
      ...profile,
      technicalSkills: profile.technicalSkills.filter((s) => s !== skill),
    });
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Profile & Academic Credentials</h1>
          <span className="badge badge-indigo">Career Readiness Profile</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Manage your personal details, college education, verified technical proficiencies, and study habits.
        </p>
      </div>

      {saved && (
        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--accent-emerald)', color: '#ffffff', borderRadius: '8px', fontWeight: 600 }}>
          Profile updated successfully! All platform diagnostics realigned.
        </div>
      )}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        {/* Section 1: Basic Information */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Personal Information
          </h3>
          <div className="grid-2">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                className="input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Preferred Industry</label>
              <input
                type="text"
                className="input"
                value={profile.preferredIndustry}
                onChange={(e) => setProfile({ ...profile, preferredIndustry: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: College & Education */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Academic Background
          </h3>
          <div className="grid-2">
            <div>
              <label className="label">College / University</label>
              <input
                type="text"
                className="input"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Degree</label>
              <input
                type="text"
                className="input"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
              />
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: '1rem' }}>
            <div>
              <label className="label">Branch / Department</label>
              <input
                type="text"
                className="input"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Graduation Year</label>
              <input
                type="text"
                className="input"
                value={profile.graduationYear}
                onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select
                className="select"
                value={profile.experienceLevel}
                onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
              >
                <option value="Student">Student (Pre-Final / Final Year)</option>
                <option value="Entry-Level">Entry-Level (0 - 1 Years)</option>
                <option value="Intern">Intern</option>
                <option value="Mid-Level">Mid-Level (2 - 5 Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Verified Technical Skills */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Technical Competencies ({profile.technicalSkills.length})
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              className="input"
              placeholder="e.g. Python, Docker, PostgreSQL, React..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTech()}
            />
            <button onClick={handleAddTech} className="btn btn-primary btn-sm">
              Add Skill
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.technicalSkills.map((sk) => (
              <span key={sk} className="badge badge-indigo" style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}>
                <span>{sk}</span>
                <button
                  onClick={() => handleRemoveTech(sk)}
                  style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', marginLeft: '5px' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Save size={16} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
