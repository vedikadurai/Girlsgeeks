import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Languages,
  ChevronRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  InterviewConfig,
  InterviewQuestion,
  InterviewAnswerRecord,
  InterviewSession,
  LanguageCode,
  SUPPORTED_LANGUAGES,
  UserProfile,
  ResumeData
} from '../types';
import { AIService } from '../services/aiService';

interface MockInterviewProps {
  user: UserProfile;
  resume: ResumeData;
  activeRole: string;
  onFinishInterview: (session: InterviewSession) => void;
  onNavigate: (view: string) => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({
  user,
  resume,
  activeRole,
  onFinishInterview,
  onNavigate,
}) => {
  // Pre-interview config state
  const [inSession, setInSession] = useState(false);
  const [config, setConfig] = useState<InterviewConfig>({
    targetRole: activeRole,
    interviewType: 'Mixed',
    difficulty: 'Intermediate',
    questionCount: 5,
    questionLanguage: user.preferredLanguages.interviewQuestion || 'ta',
    explanationLanguage: user.preferredLanguages.questionExplanation || 'ta',
    answerLanguage: user.preferredLanguages.interviewAnswer || 'ta',
    feedbackLanguage: user.preferredLanguages.interviewFeedback || 'en',
    showTranslation: true,
    allowExplanation: true,
  });

  // Active session state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [answers, setAnswers] = useState<InterviewAnswerRecord[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewAnswerRecord['evaluation'] | null>(null);
  const [explainedText, setExplainedText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Timer loop
  useEffect(() => {
    if (inSession) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inSession]);

  // Speech Recognition Setup (Microphone STT)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = config.answerLanguage === 'ta' ? 'ta-IN' : config.answerLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [config.answerLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by this browser. You can type your answer in the box.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  // Text-To-Speech (Play Question Voice)
  const handlePlayVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.questionLanguage === 'ta' ? 'ta-IN' : config.questionLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Start interview
  const handleStartInterview = () => {
    const generated = AIService.generateInterviewQuestions(config, resume);
    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentEvaluation(null);
    setExplainedText(null);
    setSecondsElapsed(0);
    setUserAnswerText('');
    setInSession(true);
  };

  // Concept explainer (without spoiling the answer)
  const handleExplainQuestion = () => {
    if (!currentQuestion) return;
    setIsExplaining(true);
    setTimeout(() => {
      const explanation = AIService.explainQuestion(currentQuestion, config.explanationLanguage);
      setExplainedText(explanation);
      setIsExplaining(false);
    }, 400);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const evaluation = AIService.evaluateInterviewAnswer(
      currentQuestion,
      userAnswerText,
      config.answerLanguage,
      config.feedbackLanguage
    );

    const record: InterviewAnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.questionText,
      userAnswer: userAnswerText || '(Skipped or minimal response)',
      submittedAt: new Date().toISOString(),
      language: config.answerLanguage,
      evaluation,
    };

    setCurrentEvaluation(evaluation);
    setAnswers((prev) => [...prev, record]);
  };

  // Move to next question or complete interview
  const handleNextQuestion = () => {
    setCurrentEvaluation(null);
    setExplainedText(null);
    setUserAnswerText('');

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions! Trigger celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const avgScore = Math.round(
        answers.reduce((acc, a) => acc + a.evaluation.score, 0) / (answers.length || 1)
      );

      const session: InterviewSession = {
        id: `sess_${Date.now()}`,
        createdAt: new Date().toISOString(),
        role: config.targetRole,
        interviewType: config.interviewType,
        difficulty: config.difficulty,
        language: config.questionLanguage,
        durationMinutes: Math.max(1, Math.round(secondsElapsed / 60)),
        questionsCount: questions.length,
        overallScore: avgScore,
        categoryScores: {
          technicalKnowledge: Math.round(answers.reduce((a, b) => a + b.evaluation.technicalKnowledge, 0) / (answers.length || 1)),
          communication: Math.round(answers.reduce((a, b) => a + b.evaluation.communication, 0) / (answers.length || 1)),
          relevance: Math.round(answers.reduce((a, b) => a + b.evaluation.relevance, 0) / (answers.length || 1)),
          problemSolving: 80,
          structure: Math.round(answers.reduce((a, b) => a + b.evaluation.structure, 0) / (answers.length || 1)),
          confidence: Math.round(answers.reduce((a, b) => a + b.evaluation.confidenceIndicator, 0) / (answers.length || 1)),
        },
        strengths: [
          'Solid understanding of core concepts under pressure.',
          'Structured logical delivery with appropriate technical terminology.',
        ],
        improvements: [
          'Be more direct with opening 1-sentence definitions.',
          'Quantify implementation metrics whenever referencing resume projects.',
        ],
        recommendations: [
          'Review the STAR method for behavioral and scenario questions.',
          'Practice explaining algorithmic complexity trade-offs.',
        ],
        records: answers,
      };

      setInSession(false);
      onFinishInterview(session);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const questionTextInLang =
    currentQuestion?.translations[config.questionLanguage] || currentQuestion?.questionText;

  // Render Setup Screen if not in session
  if (!inSession) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Multilingual AI Mock Interview</h1>
            <span className="badge badge-indigo">10 Languages Supported</span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
            Practice realistic interviews in your preferred Indian regional language. Experience concept clarifications, voice input, and adaptive follow-up questions.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interview Session Configuration</h2>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Configure your practice simulation</div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Target Job Role</label>
              <select
                className="select"
                value={config.targetRole}
                onChange={(e) => setConfig({ ...config, targetRole: e.target.value })}
              >
                {user.targetRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Interview Type</label>
              <select
                className="select"
                value={config.interviewType}
                onChange={(e) => setConfig({ ...config, interviewType: e.target.value as any })}
              >
                <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
                <option value="Technical">Technical Competency</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
                <option value="Resume-Based">Resume & Project Cross-Examination</option>
                <option value="HR">HR & Cultural Fit</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Difficulty Level</label>
              <select
                className="select"
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: e.target.value as any })}
              >
                <option value="Beginner">Beginner (Foundations & Syntax)</option>
                <option value="Intermediate">Intermediate (Real-world scenarios & Architecture)</option>
                <option value="Advanced">Advanced (Deep internals & System trade-offs)</option>
              </select>
            </div>
            <div>
              <label className="label">Number of Questions</label>
              <select
                className="select"
                value={config.questionCount}
                onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })}
              >
                <option value={3}>3 Questions (Quick Drill ~ 8 mins)</option>
                <option value={5}>5 Questions (Standard Screen ~ 15 mins)</option>
                <option value={10}>10 Questions (Full Simulation ~ 30 mins)</option>
              </select>
            </div>
          </div>

          {/* Multilingual Matrix */}
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Languages size={18} color="#818cf8" />
              <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>Multilingual Language Matrix</strong>
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Question Language</label>
                <select
                  className="select"
                  value={config.questionLanguage}
                  onChange={(e) => setConfig({ ...config, questionLanguage: e.target.value as LanguageCode })}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Question Explanation Language</label>
                <select
                  className="select"
                  value={config.explanationLanguage}
                  onChange={(e) => setConfig({ ...config, explanationLanguage: e.target.value as LanguageCode })}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="label">Answer Language</label>
                <select
                  className="select"
                  value={config.answerLanguage}
                  onChange={(e) => setConfig({ ...config, answerLanguage: e.target.value as LanguageCode })}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Evaluation / Feedback Language</label>
                <select
                  className="select"
                  value={config.feedbackLanguage}
                  onChange={(e) => setConfig({ ...config, feedbackLanguage: e.target.value as LanguageCode })}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.showTranslation}
                  onChange={(e) => setConfig({ ...config, showTranslation: e.target.checked })}
                />
                <span>Show English Translation Below Regional Questions</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.allowExplanation}
                  onChange={(e) => setConfig({ ...config, allowExplanation: e.target.checked })}
                />
                <span>Enable "Explain Question" Conceptual Clarifier</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleStartInterview} className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              <Sparkles size={18} />
              <span>Start Multilingual Interview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Live Interview Room
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Live Timer */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MOCK INTERVIEW SESSION</span>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
            {config.targetRole} • {config.interviewType} ({config.difficulty})
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontWeight: 700, fontSize: '1.1rem' }}>
            <Clock size={18} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to end this interview session?')) {
                setInSession(false);
              }
            }}
            className="btn btn-secondary btn-sm"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Category: {currentQuestion?.category}
          </span>
        </div>
        <div className="progress-container">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(20, 30, 51, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <span className="badge badge-indigo" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            Question #{currentQuestionIndex + 1}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Audio Voice Player */}
            <button
              onClick={() => handlePlayVoice(questionTextInLang)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem', color: isSpeaking ? '#818cf8' : 'var(--text-light)' }}
              title="Play Voice"
            >
              <Volume2 size={16} />
              <span>{isSpeaking ? 'Playing...' : 'Play Audio'}</span>
            </button>

            {/* Explain Question (Without giving answer away) */}
            {config.allowExplanation && (
              <button
                onClick={handleExplainQuestion}
                disabled={isExplaining}
                className="btn btn-outline btn-sm"
                style={{ gap: '0.4rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
                title="Explain concept in your regional language"
              >
                <HelpCircle size={15} />
                <span>Explain Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Question Text in Selected Language */}
        <div>
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              lineHeight: 1.45,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            {questionTextInLang}
          </h2>

          {/* Optional English Translation */}
          {config.showTranslation && config.questionLanguage !== 'en' && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '6px',
                borderLeft: '3px solid #818cf8',
                fontSize: '0.875rem',
                color: '#cbd5e1',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>
                ENGLISH TRANSLATION:
              </span>
              {currentQuestion.translations.en || currentQuestion.questionText}
            </div>
          )}
        </div>

        {/* Concept Clarifier Explanation Box (If requested) */}
        {explainedText && (
          <div
            style={{
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontWeight: 700, fontSize: '0.85rem' }}>
              <Sparkles size={16} />
              <span>Concept Clarification ({config.explanationLanguage.toUpperCase()}):</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#f1f5f9', margin: 0, lineHeight: 1.5 }}>
              {explainedText}
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Note: This clarifies the concept without giving away the exact answer. Now articulate your answer!
            </span>
          </div>
        )}

        {/* Answer Input Area (Only if evaluation not yet submitted) */}
        {!currentEvaluation ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label" style={{ margin: 0 }}>
                Your Response (Text or Voice Input):
              </label>
              <button
                onClick={toggleRecording}
                className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                style={{ gap: '0.4rem' }}
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={15} color="#818cf8" />}
                <span>{isRecording ? 'Listening (Click to Stop)...' : 'Use Microphone'}</span>
              </button>
            </div>

            <textarea
              className="textarea"
              rows={6}
              value={userAnswerText}
              onChange={(e) => setUserAnswerText(e.target.value)}
              placeholder={`Speak or type your answer here in ${config.answerLanguage.toUpperCase()} or English. For best scores, give a direct definition and structure your thoughts using real project examples...`}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setUserAnswerText('(Candidate skipped question)');
                  handleSubmitAnswer();
                }}
                className="btn btn-secondary btn-sm"
              >
                Skip Question
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswerText.trim()}
                className="btn btn-primary"
                style={{ gap: '0.5rem' }}
              >
                <span>Submit Answer for AI Evaluation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Evaluation & Feedback Card on Submission */
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>QUESTION SCORE</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: currentEvaluation.score >= 80 ? '#10b981' : '#f59e0b' }}>
                  {currentEvaluation.score}/100
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                <span>Tech Knowledge: <strong>{currentEvaluation.technicalKnowledge}%</strong></span>
                <span>Communication: <strong>{currentEvaluation.communication}%</strong></span>
                <span>Structure: <strong>{currentEvaluation.structure}%</strong></span>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px' }}>
                <strong style={{ color: '#10b981', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                  ✓ What Went Well:
                </strong>
                <p style={{ fontSize: '0.825rem', color: '#e2e8f0', margin: 0 }}>
                  {currentEvaluation.whatWentWell}
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '6px' }}>
                <strong style={{ color: '#f59e0b', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                  ! What Can Improve:
                </strong>
                <p style={{ fontSize: '0.825rem', color: '#e2e8f0', margin: 0 }}>
                  {currentEvaluation.whatCanImprove}
                </p>
              </div>
            </div>

            <div style={{ fontSize: '0.825rem', color: '#c7d2fe' }}>
              <strong>Recommended Practice: </strong> {currentEvaluation.recommendedPractice}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={handleNextQuestion} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question →' : 'Complete & View Full Report 🏆'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
