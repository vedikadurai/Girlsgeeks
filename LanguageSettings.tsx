import React, { useState } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { UserProfile, SUPPORTED_LANGUAGES, LanguageCode } from '../types';

interface LanguageSettingsProps {
  user: UserProfile;
  onSavePreferences: (updated: UserProfile['preferredLanguages']) => void;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  user,
  onSavePreferences,
}) => {
  const [prefs, setPrefs] = useState<UserProfile['preferredLanguages']>(user.preferredLanguages);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSavePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Language & Multilingual Preferences</h1>
          <span className="badge badge-indigo">10 Indian Regional Languages</span>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Configure independent language settings for interview questions, conceptual clarifications, user speech input, and evaluations.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        <div className="grid-2">
          <div>
            <label className="label">Interview Question Language</label>
            <select
              className="select"
              value={prefs.interviewQuestion}
              onChange={(e) => setPrefs({ ...prefs, interviewQuestion: e.target.value as LanguageCode })}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Language the AI will ask questions in.
            </span>
          </div>

          <div>
            <label className="label">Question Explanation Language</label>
            <select
              className="select"
              value={prefs.questionExplanation}
              onChange={(e) => setPrefs({ ...prefs, questionExplanation: e.target.value as LanguageCode })}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Language used by the concept clarifier without revealing answers.
            </span>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label className="label">Candidate Answer Language</label>
            <select
              className="select"
              value={prefs.interviewAnswer}
              onChange={(e) => setPrefs({ ...prefs, interviewAnswer: e.target.value as LanguageCode })}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Language you prefer to articulate your responses in.
            </span>
          </div>

          <div>
            <label className="label">Evaluation & Feedback Language</label>
            <select
              className="select"
              value={prefs.interviewFeedback}
              onChange={(e) => setPrefs({ ...prefs, interviewFeedback: e.target.value as LanguageCode })}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Language for scorecards and feedback reports.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button onClick={handleSave} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Save size={16} />
            <span>{saved ? 'Preferences Saved!' : 'Save Language Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
