import React, { useState } from 'react';
import {
  ShieldCheck,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Lock,
  Database,
  Cpu
} from 'lucide-react';

interface PrivacySettingsProps {
  onResetAllData: () => void;
  onClearInterviews: () => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  onResetAllData,
  onClearInterviews,
}) => {
  const [clearedMsg, setClearedMsg] = useState<string | null>(null);

  const handleClearInterviews = () => {
    if (confirm('Are you sure you want to delete your past mock interview transcripts?')) {
      onClearInterviews();
      setClearedMsg('Past interview transcripts have been deleted.');
      setTimeout(() => setClearedMsg(null), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all profile data, resume versions, and tasks back to demo baseline?')) {
      onResetAllData();
      setClearedMsg('All data has been reset to default demo baseline.');
      setTimeout(() => setClearedMsg(null), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Privacy, Data Governance & Security</h1>
          <span className="badge badge-emerald">Client-Side Safe</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Review where your resume data and interview speech transcripts are stored and manage your privacy preferences.
        </p>
      </div>

      {clearedMsg && (
        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--accent-emerald)', color: '#ffffff', borderRadius: '8px', fontWeight: 600 }}>
          {clearedMsg}
        </div>
      )}

      {/* Security Principles */}
      <div className="grid-2" style={{ gap: '1.25rem' }}>
        <div className="card">
          <Database size={24} color="#818cf8" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Local Browser Storage
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Your resumes, project notes, and interview performance are stored directly in your local browser sandbox. No sensitive personal phone numbers or addresses are leaked to public search engines.
          </p>
        </div>

        <div className="card">
          <Cpu size={24} color="#10b981" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Ethical AI & Zero Fabrication
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            CareerAI Coach never fabricates false degrees, unverified companies, or fraudulent certifications. Our AI assists only by structuring and refining your actual achievements.
          </p>
        </div>
      </div>

      {/* Data Controls */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Data Retention & Removal Controls</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff' }}>Interview History Transcripts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Erase all recorded user speech responses and question scorecard evaluations.
            </div>
          </div>
          <button onClick={handleClearInterviews} className="btn btn-danger btn-sm">
            <Trash2 size={14} /> Clear Transcripts
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff' }}>Reset Application to Demo Baseline</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Reinitialize Arun Kumar's demo resume versions, 4-week learning plan, and diagnostic data.
            </div>
          </div>
          <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ color: '#fca5a5' }}>
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
