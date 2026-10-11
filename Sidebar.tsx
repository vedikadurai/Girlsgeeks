import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  FileCheck2,
  Cpu,
  Mic2,
  History,
  TrendingUp,
  CalendarCheck2,
  Calendar,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  Globe,
  ShieldCheck,
  Flame,
  Volume2,
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  streakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onCloseMobile,
  streakDays,
}) => {
  const navSections = [
    {
      title: 'Core Journey',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume_builder', label: 'Live Resume Builder', icon: FileEdit, badge: 'Live ATS' },
        { id: 'resume_analysis', label: 'Resume Analysis', icon: FileCheck2 },
        { id: 'ats_optimizer', label: 'ATS & Job Matcher', icon: Cpu },
      ],
    },
    {
      title: 'Practice & Interviews',
      items: [
        { id: 'mock_interview', label: 'AI Mock Interview', icon: Mic2, badge: 'Multilingual' },
        { id: 'interview_history', label: 'Interview History', icon: History },
        { id: 'confidence_practice', label: 'Confidence Practice', icon: Volume2 },
      ],
    },
    {
      title: 'Growth & Roadmap',
      items: [
        { id: 'skill_gaps', label: 'Skill Gap Analysis', icon: TrendingUp },
        { id: 'learning_plan', label: '4-Week Career Plan', icon: CalendarCheck2, badge: `🔥 ${streakDays}d` },
        { id: 'calendar', label: 'Study Calendar', icon: Calendar },
        { id: 'readiness_report', label: 'Career Readiness Report', icon: FileText },
      ],
    },
    {
      title: 'Showcase & Applications',
      items: [
        { id: 'portfolio', label: 'Portfolio Generator', icon: Layers },
        { id: 'projects', label: 'Smart Project Builder', icon: Sparkles },
        { id: 'achievements', label: 'Verified Achievements', icon: Award },
        { id: 'applications', label: 'Job Application Tracker', icon: Briefcase },
      ],
    },
    {
      title: 'Preferences & Security',
      items: [
        { id: 'languages', label: 'Language Settings', icon: Globe },
        { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
            display: 'block',
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: isOpen ? '270px' : '0px',
          minWidth: isOpen ? '270px' : '0px',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(11, 16, 28, 0.95)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          overflow: 'hidden',
          zIndex: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            width: '270px',
          }}
        >
          {navSections.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  padding: '0 0.65rem 0.45rem',
                }}
              >
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        if (window.innerWidth < 1024) onCloseMobile();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-light)',
                        border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.865rem',
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={17} color={isActive ? '#818cf8' : '#94a3b8'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`badge ${
                            item.badge.includes('🔥')
                              ? 'badge-amber'
                              : item.badge.includes('Live')
                              ? 'badge-emerald'
                              : 'badge-indigo'
                          }`}
                          style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Learning Streak Card */}
        <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-subtle)', width: '270px' }}>
          <div
            style={{
              padding: '0.75rem 0.85rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame size={18} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{streakDays} Day Streak</div>
                <div style={{ fontSize: '0.7rem', color: '#fcd34d' }}>Keep daily momentum!</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('learning_plan')}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fcd34d' }}
            >
              Plan
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
