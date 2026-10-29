import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Wand2 } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function AvatarCharacter({
  state = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking' | 'passed' | 'failed'
  character = 'emma', // 'emma' | 'oliver' | 'sophia'
  subtitleText = '',
  correctionInfo = null,
  isStrictGatekeeper = false,
  onProceedNext = null
}) {
  const [mouthPhase, setMouthPhase] = useState(0);

  // Lip-sync simulation when AI is speaking
  useEffect(() => {
    let interval = null;
    if (state === 'speaking') {
      interval = setInterval(() => {
        setMouthPhase(prev => (prev + 1) % 4);
      }, 140);
    } else {
      setMouthPhase(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleSpeakText = (text, e) => {
    if (e) e.stopPropagation();
    audioService.stop();
    audioService.speak(text);
  };

  // Character config
  const configs = {
    emma: {
      name: 'Emma',
      accent: 'American Coach',
      primaryColor: '#06b6d4',
      hairColor: '#f59e0b',
      skinColor: '#fed7aa',
      shirtColor: '#0284c7'
    },
    oliver: {
      name: 'Oliver',
      accent: 'British Tutor',
      primaryColor: '#6366f1',
      hairColor: '#475569',
      skinColor: '#fde047',
      shirtColor: '#4f46e5'
    },
    sophia: {
      name: 'Sophia',
      accent: 'Executive Mentor',
      primaryColor: '#ec4899',
      hairColor: '#1e293b',
      skinColor: '#fbcfe8',
      shirtColor: '#be185d'
    }
  };

  const char = configs[character] || configs.emma;

  return (
    <div className="avatar-stage-container">
      {/* Dynamic Status Beacon */}
      <div className="avatar-status-badge">
        <span className={`status-dot ${state}`} />
        <span className="status-label">
          {state === 'speaking' && `${char.name} đang nói...`}
          {state === 'listening' && `${char.name} đang lắng nghe bạn...`}
          {state === 'thinking' && `${char.name} đang phân tích & nâng cấp câu...`}
          {state === 'passed' && `Đạt Yêu Cầu! Đã chuẩn hóa & đề xuất câu hay`}
          {state === 'failed' && `Cần thêm ý - Hãy nói một câu hoàn chỉnh`}
          {state === 'idle' && `${char.name} • ${char.accent}`}
        </span>
        {isStrictGatekeeper && (
          <span className="gatekeeper-badge" title="Chế độ tự sửa từ sai & nâng cấp câu bản xứ">
            <ShieldCheck size={13} />
            <span>AI Feedback Thông Minh</span>
          </span>
        )}
      </div>

      {/* Main 2D/3D Animated Character Figure */}
      <div className={`character-wrapper ${state}`}>
        <div className={`character-aura ${state}`} />

        <svg
          viewBox="0 0 280 320"
          className="character-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`gradSkin-${character}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
            <linearGradient id={`gradHair-${character}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={char.hairColor} />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id={`gradShirt-${character}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={char.shirtColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Shoulders & Body with Breathing Animation */}
          <g className="char-body">
            <path
              d="M 50 320 Q 90 220 140 220 Q 190 220 230 320 Z"
              fill={`url(#gradShirt-${character})`}
            />
            <path
              d="M 115 220 L 140 255 L 165 220 Z"
              fill="#ffffff"
              opacity="0.9"
            />
            <path
              d="M 125 220 L 140 245 L 155 220 Z"
              fill={char.shirtColor}
            />
            <rect x="126" y="180" width="28" height="45" rx="8" fill={`url(#gradSkin-${character})`} />
          </g>

          {/* Head & Face Group */}
          <g className="char-head">
            <circle cx="85" cy="140" r="14" fill="#fed7aa" />
            <circle cx="195" cy="140" r="14" fill="#fed7aa" />
            <ellipse cx="140" cy="135" rx="55" ry="65" fill={`url(#gradSkin-${character})`} />

            {character === 'emma' && (
              <>
                <path
                  d="M 75 120 C 60 170 70 230 85 240 C 95 190 90 140 85 120 Z"
                  fill={`url(#gradHair-${character})`}
                />
                <path
                  d="M 205 120 C 220 170 210 230 195 240 C 185 190 190 140 195 120 Z"
                  fill={`url(#gradHair-${character})`}
                />
              </>
            )}

            <circle cx="108" cy="155" r="9" fill="#f43f5e" opacity={state === 'passed' ? '0.45' : '0.2'} />
            <circle cx="172" cy="155" r="9" fill="#f43f5e" opacity={state === 'passed' ? '0.45' : '0.2'} />

            {/* Eyes */}
            <g className={`char-eyes ${state}`}>
              <circle cx="114" cy="132" r="7.5" fill="#1e293b" />
              <circle cx="112" cy="130" r="2.5" fill="#ffffff" />
              <circle cx="166" cy="132" r="7.5" fill="#1e293b" />
              <circle cx="164" cy="130" r="2.5" fill="#ffffff" />

              {state === 'failed' ? (
                <>
                  <path d="M 104 122 Q 114 116 124 121" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <path d="M 156 121 Q 166 116 176 122" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  <path d="M 104 119 Q 114 113 124 119" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <path d="M 156 119 Q 166 113 176 119" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </>
              )}
            </g>

            <path d="M 140 137 L 138 148 L 143 148" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            <g className="char-mouth">
              {state === 'speaking' ? (
                mouthPhase === 0 ? (
                  <ellipse cx="140" cy="168" rx="10" ry="8" fill="#881337" />
                ) : mouthPhase === 1 ? (
                  <path d="M 132 165 Q 140 176 148 165 Z" fill="#881337" />
                ) : mouthPhase === 2 ? (
                  <ellipse cx="140" cy="168" rx="14" ry="10" fill="#9f1239" />
                ) : (
                  <path d="M 130 167 Q 140 178 150 167" stroke="#9f1239" strokeWidth="4" strokeLinecap="round" fill="none" />
                )
              ) : state === 'passed' ? (
                <path d="M 125 163 Q 140 182 155 163 Z" fill="#9f1239" stroke="#881337" strokeWidth="1.5" />
              ) : state === 'failed' ? (
                <path d="M 132 170 Q 140 167 148 170" stroke="#9f1239" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M 130 165 Q 140 174 150 165" stroke="#9f1239" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}
            </g>

            <path
              d="M 85 125 C 80 80 120 70 140 70 C 170 70 200 85 195 125 C 185 100 155 90 140 92 C 120 90 95 105 85 125 Z"
              fill={`url(#gradHair-${character})`}
            />
            {character === 'sophia' && (
              <g stroke="#f59e0b" strokeWidth="2.5" fill="none">
                <rect x="100" y="122" width="28" height="20" rx="4" />
                <rect x="152" y="122" width="28" height="20" rx="4" />
                <line x1="128" y1="130" x2="152" y2="130" />
              </g>
            )}
          </g>

          {state === 'passed' && (
            <g className="celebration-particles" fill="#fbbf24">
              <path d="M 60 70 L 63 76 L 70 78 L 65 83 L 66 90 L 60 86 L 54 90 L 55 83 L 50 78 L 57 76 Z" />
              <path d="M 220 80 L 223 86 L 230 88 L 225 93 L 226 100 L 220 96 L 214 100 L 215 93 L 210 88 L 217 86 Z" />
            </g>
          )}
        </svg>

        {state === 'listening' && (
          <div className="avatar-voice-waves">
            <span className="wave-bar wb1" />
            <span className="wave-bar wb2" />
            <span className="wave-bar wb3" />
            <span className="wave-bar wb4" />
            <span className="wave-bar wb5" />
          </div>
        )}
      </div>

      {/* Floating Subtitle Balloon (Question / AI Dialogue) */}
      {subtitleText && (
        <div className={`avatar-speech-bubble ${state}`}>
          <div className="bubble-speaker-tag">
            <Volume2 size={13} />
            <span>{char.name} ({char.accent}):</span>
          </div>
          <div className="bubble-main-text">
            {subtitleText}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE FEEDBACK & POLISHED ANSWER CARD */}
      {correctionInfo && (
        <div className={`gatekeeper-card ${correctionInfo.isPassed ? 'passed' : 'failed'}`}>
          <div className="gk-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {correctionInfo.isPassed ? (
              <span className="gk-title pass" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={18} />
                <span>ĐÃ VƯỢT ẢI (PASSED)</span>
              </span>
            ) : (
              <span className="gk-title fail" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertTriangle size={18} />
                <span>CẦN NÓI RÕ RÀNG HƠN</span>
              </span>
            )}

            {onProceedNext && correctionInfo.isPassed && (
              <button
                className="start-chat-btn"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                onClick={onProceedNext}
              >
                <span>Chuyển Sang Chặng Tiếp</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="gk-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* 1. Sửa từ sai / nói vấp in-place (e.g. "tommo tomorrow" -> "tomorrow") */}
            {correctionInfo.repairedWords && correctionInfo.repairedWords.length > 0 && (
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fcd34d', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  ✏️ Đã tự động sửa từ nói vấp / phát âm nhầm (In-place Fix):
                </div>
                {correctionInfo.repairedWords.map((rw, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ textDecoration: 'line-through', color: '#fda4af' }}>"{rw.original}"</span>
                    <span>➔</span>
                    <strong style={{ color: '#6ee7b7' }}>"{rw.corrected}"</strong>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({rw.explanation})</span>
                  </div>
                ))}
              </div>
            )}

            {/* 2. User's sentence cleaned */}
            <div className="gk-original" style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="gk-tag-orig">Câu bạn đã nói:</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                "{correctionInfo.cleanedSentence || correctionInfo.userSpoken}"
              </span>
            </div>

            {/* 3. Chỉnh sửa câu trả lời tốt hơn dựa trên câu của user (Better Polish) */}
            {correctionInfo.betterVersion && (
              <div className="gk-target" style={{ background: 'rgba(16, 185, 129, 0.12)', borderLeft: '3px solid #10b981', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span className="gk-tag-target" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Wand2 size={13} color="#10b981" />
                    <span>Phiên bản nâng cấp bản xứ (Dựa trên câu của bạn):</span>
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: '26px', height: '26px', border: 'none' }}
                    onClick={(e) => handleSpeakText(correctionInfo.betterVersion, e)}
                    title="Nghe phát âm bản xứ câu này"
                  >
                    <Volume2 size={14} color="#10b981" />
                  </button>
                </div>
                <strong className="target-sentence" style={{ color: '#6ee7b7', fontSize: '0.98rem' }}>
                  "{correctionInfo.betterVersion}"
                </strong>
                {correctionInfo.explanation && (
                  <div className="gk-tip" style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    💡 {correctionInfo.explanation}
                  </div>
                )}
              </div>
            )}

            {/* 4. Đề xuất các câu trả lời khác (Alternative Answers) */}
            {correctionInfo.alternativeAnswers && correctionInfo.alternativeAnswers.length > 0 && (
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="#06b6d4" />
                  <span>Đề xuất các cách trả lời hay khác cho câu hỏi này:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {correctionInfo.alternativeAnswers.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4' }}>
                          {alt.style}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 500 }}>
                          "{alt.text}"
                        </div>
                        {alt.translation && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {alt.translation}
                          </div>
                        )}
                      </div>
                      <button
                        className="icon-btn"
                        style={{ width: '28px', height: '28px', border: 'none' }}
                        onClick={(e) => handleSpeakText(alt.text, e)}
                        title="Nghe câu này"
                      >
                        <Volume2 size={13} color="#818cf8" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
