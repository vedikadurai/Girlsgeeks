import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Building,
  MapPin
} from 'lucide-react';
import { JobApplication, ResumeData } from '../types';

interface JobApplicationTrackerProps {
  applications: JobApplication[];
  resumeVersions: ResumeData[];
  onSaveApplications: (apps: JobApplication[]) => void;
}

export const JobApplicationTracker: React.FC<JobApplicationTrackerProps> = ({
  applications,
  resumeVersions,
  onSaveApplications,
}) => {
  const [list, setList] = useState<JobApplication[]>(applications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New application form state
  const [newApp, setNewApp] = useState<Partial<JobApplication>>({
    company: '',
    jobRole: 'Software Developer',
    location: 'Bengaluru / Hybrid',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    jobUrl: '',
    resumeVersionId: resumeVersions[0]?.id || '',
    salaryExpectation: '₹8.0 - ₹10.0 LPA',
  });

  const handleAddApplication = () => {
    if (!newApp.company || !newApp.jobRole) return;
    const item: JobApplication = {
      id: `app_${Date.now()}`,
      company: newApp.company,
      jobRole: newApp.jobRole,
      location: newApp.location || 'Bengaluru',
      appliedDate: newApp.appliedDate || new Date().toISOString().split('T')[0],
      status: (newApp.status as any) || 'Applied',
      notes: newApp.notes || '',
      jobUrl: newApp.jobUrl || '',
      resumeVersionId: newApp.resumeVersionId || '',
      salaryExpectation: newApp.salaryExpectation || '',
    };
    const updated = [item, ...list];
    setList(updated);
    onSaveApplications(updated);
    setShowAddModal(false);
    setNewApp({
      company: '',
      jobRole: 'Software Developer',
      location: 'Bengaluru / Hybrid',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      jobUrl: '',
      resumeVersionId: resumeVersions[0]?.id || '',
      salaryExpectation: '',
    });
  };

  const handleUpdateStatus = (id: string, newStatus: JobApplication['status']) => {
    const updated = list.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setList(updated);
    onSaveApplications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((a) => a.id !== id);
    setList(updated);
    onSaveApplications(updated);
  };

  const filtered = list.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.jobRole.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: list.length,
    interview: list.filter((a) => a.status === 'Interview').length,
    offer: list.filter((a) => a.status === 'Offer').length,
    assessment: list.filter((a) => a.status === 'Assessment').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Job Application Tracker</h1>
            <span className="badge badge-indigo">{counts.total} Opportunities</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
            Organize campus and off-campus applications, interview schedules, and linked tailored resume versions.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ gap: '1.25rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Tracked</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
            {counts.total}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interviews Scheduled</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '0.2rem' }}>
            {counts.interview}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assessments In Progress</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
            {counts.assessment}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Offers Extended 🎉</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
            {counts.offer}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="input"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filtered.map((app) => (
          <div
            key={app.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building size={20} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>{app.company}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{app.jobRole}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>📍 {app.location}</span>
                  <span>🗓️ {app.appliedDate}</span>
                  {app.salaryExpectation && <span>💰 {app.salaryExpectation}</span>}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notes & Next Steps:</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                {app.notes || 'No notes added yet.'}
              </div>
            </div>

            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                className="select"
                style={{
                  width: 'auto',
                  fontSize: '0.825rem',
                  padding: '0.35rem 0.65rem',
                  fontWeight: 600,
                  borderColor:
                    app.status === 'Offer'
                      ? '#10b981'
                      : app.status === 'Interview'
                      ? '#06b6d4'
                      : app.status === 'Assessment'
                      ? '#818cf8'
                      : 'var(--border-subtle)',
                }}
                value={app.status}
                onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer 🎉</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => handleDelete(app.id)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem', color: '#fca5a5' }}
                title="Delete Application"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Add New Job Application
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Company Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Zoho, Thoughtworks, TCS, Amazon..."
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Job Role *</label>
                  <input
                    type="text"
                    className="input"
                    value={newApp.jobRole}
                    onChange={(e) => setNewApp({ ...newApp, jobRole: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input"
                    value={newApp.location}
                    onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Status</label>
                  <select
                    className="select"
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
                <div>
                  <label className="label">Salary / CTC Expectation</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. ₹8.5 LPA"
                    value={newApp.salaryExpectation}
                    onChange={(e) => setNewApp({ ...newApp, salaryExpectation: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Notes / Referral Details</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="e.g. Applied via employee referral. Round 1 coding round scheduled for Friday."
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleAddApplication} className="btn btn-primary">
                  Save Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
