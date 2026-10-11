import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AchievementItem } from '../types';

interface AchievementsManagerProps {
  achievements: AchievementItem[];
  onSaveAchievements: (achievements: AchievementItem[]) => void;
}

export const AchievementsManager: React.FC<AchievementsManagerProps> = ({
  achievements,
  onSaveAchievements,
}) => {
  const [list, setList] = useState<AchievementItem[]>(achievements);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAch, setNewAch] = useState<Partial<AchievementItem>>({
    title: '',
    category: 'Hackathon',
    organization: '',
    year: '2024',
    description: '',
  });

  const handleAdd = () => {
    if (!newAch.title) return;
    const item: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: newAch.title,
      category: (newAch.category as any) || 'Hackathon',
      organization: newAch.organization || 'University Council',
      year: newAch.year || '2024',
      description: newAch.description || 'Recognized for innovation and software engineering discipline.',
    };
    const updated = [item, ...list];
    setList(updated);
    onSaveAchievements(updated);
    setShowAddModal(false);
    setNewAch({
      title: '',
      category: 'Hackathon',
      organization: '',
      year: '2024',
      description: '',
    });
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((a) => a.id !== id);
    setList(updated);
    onSaveAchievements(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Verified Achievements & Hackathons</h1>
            <span className="badge badge-emerald">{list.length} Verified Records</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
            Document competitive programming badges, hackathon finalist placements, and technical leadership roles.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Add Achievement</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {list.map((ach) => (
          <div
            key={ach.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '1.25rem',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={22} color="#f59e0b" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {ach.title}
                  </h3>
                  <span className="badge badge-amber">{ach.category}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#818cf8', marginBottom: '0.35rem' }}>
                  {ach.organization} • {ach.year}
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  {ach.description}
                </p>
              </div>
            </div>

            <button onClick={() => handleDelete(ach.id)} className="btn btn-secondary btn-sm" style={{ color: '#fca5a5' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Add Verified Achievement</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Achievement Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 1st Place - Smart City Hackathon 2024"
                  value={newAch.title}
                  onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Category</label>
                  <select
                    className="select"
                    value={newAch.category}
                    onChange={(e) => setNewAch({ ...newAch, category: e.target.value as any })}
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Award">Award</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="label">Year</label>
                  <input
                    type="text"
                    className="input"
                    value={newAch.year}
                    onChange={(e) => setNewAch({ ...newAch, year: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Issuing Organization / Host</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. ACM Chapter / IEEE / LeetCode"
                  value={newAch.organization}
                  onChange={(e) => setNewAch({ ...newAch, organization: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Description & Significance</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Explain your contribution or ranking without fabricating details..."
                  value={newAch.description}
                  onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleAdd} className="btn btn-primary">
                  Save Achievement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
