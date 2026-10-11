import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Globe,
  ChevronDown,
  RotateCcw,
  Menu,
  X,
  Target,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile, SUPPORTED_LANGUAGES, LanguageCode } from '../types';

interface NavbarProps {
  user: UserProfile;
  activeRole: string;
  onRoleChange: (role: string) => void;
  onResetData: () => void;
  onOpenAssistant: () => void;
  onNavigate: (view: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeRole,
  onRoleChange,
  onResetData,
  onOpenAssistant,
  onNavigate,
  sidebarOpen,
  onToggleSidebar,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === user.preferredLanguages.interviewQuestion) || SUPPORTED_LANGUAGES[0];

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
      }}
    >
      {/* Left: Hamburger + Logo + Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleSidebar}
          style={{ padding: '0.45rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
          title={sidebarOpen ? 'Collapse menu' : 'Expand menu'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          onClick={() => onNavigate('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.45)',
            }}
          >
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                CareerAI<span style={{ color: 'var(--accent-purple)' }}>Coach</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                PRO
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Analyze. Practice. Get Career Ready.
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-full)',
              color: '#c7d2fe',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Target size={15} color="#818cf8" />
            <span>Prep Role:</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{activeRole}</span>
            <ChevronDown size={14} />
          </button>

          {roleDropdownOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '280px',
                padding: '0.65rem',
                zIndex: 50,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.4rem 0.5rem' }}>
                Target Career Roles ({user.targetRoles.length}/5)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {user.targetRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setRoleDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      background: role === activeRole ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: role === activeRole ? '#ffffff' : 'var(--text-light)',
                      border: role === activeRole ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span>{role}</span>
                    {role === activeRole && <Check size={16} color="#818cf8" />}
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.4rem' }}>
                <button
                  onClick={() => {
                    onNavigate('roles');
                    setRoleDropdownOpen(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  Manage / Add Target Roles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Quick Search */}
      <div style={{ flex: 1, maxWidth: '340px', margin: '0 1.5rem', position: 'relative' }}>
        <Search
          size={16}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          className="input"
          placeholder="Search skills, interview questions, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: '36px',
            fontSize: '0.85rem',
            paddingTop: '0.45rem',
            paddingBottom: '0.45rem',
            background: 'rgba(15, 23, 42, 0.45)',
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Language Indicator */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Interview Question Language"
          >
            <Globe size={15} color="#818cf8" />
            <span style={{ fontSize: '0.8rem' }}>{currentLang.nativeName}</span>
            <ChevronDown size={13} />
          </button>

          {langDropdownOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                padding: '0.5rem',
                zIndex: 50,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.35rem 0.5rem' }}>
                Multilingual Interview Language
              </div>
              <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      user.preferredLanguages.interviewQuestion = lang.code as LanguageCode;
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      background: user.preferredLanguages.interviewQuestion === lang.code ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      textAlign: 'left',
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span style={{ fontWeight: 600 }}>{lang.nativeName}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({lang.name})</span>
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.4rem', paddingTop: '0.3rem' }}>
                <button
                  onClick={() => {
                    onNavigate('languages');
                    setLangDropdownOpen(false);
                  }}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#818cf8', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'center', padding: '0.3rem' }}
                >
                  Configure All Language Preferences →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAssistant}
          className="btn btn-outline btn-sm"
          style={{ borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
          title="Open AI Career Assistant"
        >
          <Sparkles size={15} />
          <span>Ask AI Coach</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem', borderRadius: '8px', position: 'relative' }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: 'var(--accent-rose)',
                borderRadius: '50%',
              }}
            />
          </button>

          {notifOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                padding: '0.85rem',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Notifications</span>
                <span className="badge badge-indigo">3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>🔥 Streak Maintained!</div>
                  <div style={{ color: 'var(--text-muted)' }}>You completed your Day 10 SQL practice session. 5-day streak active.</div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#a5b4fc' }}>Interview Shortlist</div>
                  <div style={{ color: 'var(--text-muted)' }}>Thoughtworks technical pair-programming scheduled.</div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#6ee7b7' }}>ATS Optimization Ready</div>
                  <div style={{ color: 'var(--text-muted)' }}>New Python Developer resume version calculated at 91% ATS score.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.65rem 0.25rem 0.35rem',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              AK
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {profileDropdownOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                padding: '0.65rem',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '0.2rem' }}>{user.college}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileDropdownOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }}
                >
                  <User size={15} color="var(--text-muted)" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('privacy');
                    setProfileDropdownOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }}
                >
                  <ShieldCheck size={15} color="var(--text-muted)" />
                  <span>Privacy & Security</span>
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    setProfileDropdownOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }}
                >
                  <RotateCcw size={15} color="#fca5a5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
