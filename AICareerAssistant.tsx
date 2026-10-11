import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Globe,
  Maximize2,
  Minimize2,
  HelpCircle
} from 'lucide-react';
import { UserProfile, ResumeData, LearningPlanData, SkillGapItem, LanguageCode, SUPPORTED_LANGUAGES, ChatMessage } from '../types';
import { AIService } from '../services/aiService';

interface AICareerAssistantProps {
  user: UserProfile;
  resume: ResumeData;
  activeRole: string;
  skillGaps: SkillGapItem[];
  plan: LearningPlanData;
  isOpen: boolean;
  onClose: () => void;
}

export const AICareerAssistant: React.FC<AICareerAssistantProps> = ({
  user,
  resume,
  activeRole,
  skillGaps,
  plan,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${user.name}! I am your personal CareerAI Coach. 

I am actively tracking your **${activeRole}** preparation roadmap, your **${resume.atsScoreEstimate}%** ATS-rated resume, and your **${plan.streakDays}-day learning streak** 🔥.

You can ask me questions in **English**, **தமிழ் (Tamil)**, **हिन्दी (Hindi)**, or any of our 10 supported regional languages!`,
      timestamp: 'Just now',
      language: 'en',
      suggestedPrompts: [
        'How should I prepare for a Python interview?',
        'எனக்கு Python interview-க்கு எப்படி prepare ஆக வேண்டும்?',
        'How can I improve my QR project description?',
        'Give me 3 STAR behavioral interview questions',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<LanguageCode>('en');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      language: chatLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Call AI Service
    setTimeout(async () => {
      const replyText = await AIService.careerChat(
        text,
        { user, resume, role: activeRole, gaps: skillGaps, plan },
        chatLanguage
      );

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
        language: chatLanguage,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '25px',
        width: isExpanded ? '640px' : '400px',
        height: isExpanded ? '720px' : '560px',
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease, height 0.25s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
              CareerAI Coach
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Active Context: {activeRole}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Language selector in chat */}
          <select
            className="select"
            style={{ width: 'auto', fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.4)' }}
            value={chatLanguage}
            onChange={(e) => setChatLanguage(e.target.value as LanguageCode)}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.2rem' }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0.2rem' }}
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '0.35rem',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isUser ? 'var(--grad-primary)' : 'rgba(30, 41, 59, 0.75)',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>

              {/* Suggested prompt chips */}
              {m.suggestedPrompts && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                  {m.suggestedPrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(prompt)}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: '0.74rem',
                        padding: '0.25rem 0.6rem',
                        borderColor: 'rgba(99, 102, 241, 0.35)',
                        color: '#c7d2fe',
                        textAlign: 'left',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite' }} />
            <span>AI Coach is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div
        style={{
          padding: '0.85rem 1rem',
          background: 'rgba(11, 16, 28, 0.8)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          className="input"
          placeholder={chatLanguage === 'ta' ? 'கேள்வி கேட்கவும்...' : 'Ask about resume, interview, or preparation...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ fontSize: '0.875rem', padding: '0.55rem 0.85rem' }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="btn btn-primary"
          style={{ padding: '0.55rem 0.85rem' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
