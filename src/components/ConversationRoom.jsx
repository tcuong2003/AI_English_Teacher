import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Mic, MicOff, Volume2, Sparkles, Send, Plus, Check, Award, Lightbulb, Square, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import VisualizerSphere from './VisualizerSphere';
import AvatarCharacter from './AvatarCharacter';
import { audioService } from '../services/audioService';
import { aiService } from '../services/aiService';
import confetti from 'canvas-confetti';

export default function ConversationRoom({
  scenario,
  onBack,
  onFinishSession,
  onSaveToNotebook,
  voiceSettings
}) {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'passed' | 'failed'
  const [handsFree, setHandsFree] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentHints, setCurrentHints] = useState(scenario.sampleHints || []);
  const [addedVocabIds, setAddedVocabIds] = useState(new Set());
  const [sessionStartTime] = useState(Date.now());

  // Upgraded: Avatar vs Chat view toggle + Strict Gatekeeper toggle
  const [viewMode, setViewMode] = useState('avatar'); // 'avatar' | 'chat'
  const [isGatekeeperActive, setIsGatekeeperActive] = useState(true);
  const [gatekeeperResult, setGatekeeperResult] = useState(null);
  const [expectedTarget, setExpectedTarget] = useState('');

  const recognitionRef = useRef(null);
  const chatStreamRef = useRef(null);
  const isComponentMounted = useRef(true);
  const silenceTimerRef = useRef(null);
  const accumulatedTranscriptRef = useRef('');
  const isListeningRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handsFreeRef = useRef(handsFree);
  handsFreeRef.current = handsFree;

  const voiceSettingsRef = useRef(voiceSettings);
  voiceSettingsRef.current = voiceSettings;

  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const isGatekeeperActiveRef = useRef(isGatekeeperActive);
  isGatekeeperActiveRef.current = isGatekeeperActive;

  const expectedTargetRef = useRef(expectedTarget);
  expectedTargetRef.current = expectedTarget;

  // Choose character profile based on scenario
  const getCharacterType = () => {
    if (scenario.id.includes('cafe') || scenario.id.includes('customs')) return 'oliver';
    if (scenario.id.includes('interview') || scenario.id.includes('salary') || scenario.id.includes('ielts-part3')) return 'sophia';
    return 'emma';
  };

  const currentAiSubtitle = messages.filter(m => m.role === 'ai').slice(-1)[0]?.text || scenario.initialMessage;

  // Initialize initial AI greeting
  useEffect(() => {
    isComponentMounted.current = true;
    const initialAiMessage = {
      id: 'init-1',
      role: 'ai',
      text: scenario.initialMessage,
      timestamp: Date.now()
    };
    setMessages([initialAiMessage]);

    // Speak initial message
    if (voiceSettings.autoSpeak) {
      setTimeout(() => {
        if (isComponentMounted.current) {
          playAiVoice(scenario.initialMessage);
        }
      }, 500);
    }

    return () => {
      isComponentMounted.current = false;
      audioService.stop();
      clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [scenario]);

  // Auto-scroll chat stream to bottom
  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [messages, voiceState, interimTranscript]);

  const submitSpokenUtterance = useCallback((text) => {
    const finalCleanText = text.trim();
    if (!finalCleanText) return;

    clearTimeout(silenceTimerRef.current);
    setInterimTranscript('');
    accumulatedTranscriptRef.current = '';

    if (recognitionRef.current && isListeningRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    isListeningRef.current = false;

    handleUserUtterance(finalCleanText);
  }, []);

  // Setup Web Speech Recognition ONCE on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setVoiceState('listening');
        accumulatedTranscriptRef.current = '';
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            currentFinal += text + ' ';
          } else {
            currentInterim += text;
          }
        }

        if (currentFinal) {
          accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + currentFinal).trim();
        }

        const displayLive = (accumulatedTranscriptRef.current + ' ' + currentInterim).trim();
        setInterimTranscript(displayLive);

        // Auto-submit after 1.8s of silence
        if (displayLive.length > 2) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              const toSubmit = accumulatedTranscriptRef.current || displayLive;
              if (toSubmit.trim()) {
                submitSpokenUtterance(toSubmit);
              }
            }
          }, 1800);
        }
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          setIsListening(false);
          isListeningRef.current = false;
          setVoiceState('idle');
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          const textToSubmit = accumulatedTranscriptRef.current || interimTranscript;
          if (textToSubmit.trim()) {
            submitSpokenUtterance(textToSubmit);
          } else {
            setIsListening(false);
            isListeningRef.current = false;
            setVoiceState('idle');
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [submitSpokenUtterance]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt chưa hỗ trợ Web Speech API.");
      return;
    }

    audioService.stop();
    clearTimeout(silenceTimerRef.current);
    accumulatedTranscriptRef.current = '';
    setInterimTranscript('');

    try {
      recognitionRef.current.start();
      audioService.playSound('start-listen');
    } catch (e) {
      try {
        recognitionRef.current.abort();
        setTimeout(() => {
          if (recognitionRef.current) recognitionRef.current.start();
        }, 150);
      } catch {}
    }
  };

  const stopListeningAndSubmit = () => {
    clearTimeout(silenceTimerRef.current);
    const toSubmit = accumulatedTranscriptRef.current || interimTranscript;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    setIsListening(false);
    isListeningRef.current = false;
    audioService.playSound('stop-listen');

    if (toSubmit && toSubmit.trim()) {
      submitSpokenUtterance(toSubmit);
    } else {
      setVoiceState('idle');
    }
  };

  const cancelListening = () => {
    clearTimeout(silenceTimerRef.current);
    accumulatedTranscriptRef.current = '';
    setInterimTranscript('');
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    setIsListening(false);
    isListeningRef.current = false;
    setVoiceState('idle');
    audioService.playSound('stop-listen');
  };

  const toggleMic = () => {
    if (isListening) {
      stopListeningAndSubmit();
    } else {
      startListening();
    }
  };

  const playAiVoice = (text, onFinished) => {
    setVoiceState('speaking');
    audioService.speak(text, {
      voiceURI: voiceSettingsRef.current.voiceURI,
      rate: voiceSettingsRef.current.speechRate,
      onEnd: () => {
        if (!isComponentMounted.current) return;
        setVoiceState('idle');
        if (onFinished) onFinished();

        if (handsFreeRef.current && isComponentMounted.current) {
          setTimeout(() => {
            if (isComponentMounted.current && !isListeningRef.current) {
              startListening();
            }
          }, 600);
        }
      },
      onError: () => {
        if (isComponentMounted.current) setVoiceState('idle');
      }
    });
  };

  const handleUserUtterance = async (userText) => {
    if (!userText.trim()) return;

    audioService.stop();
    setVoiceState('thinking');

    // 1. If Gatekeeper Mode is active: Check for errors, stutters, and repair in-place!
    let repairedText = userText;
    if (isGatekeeperActiveRef.current) {
      const gateCheck = aiService.evaluateGatekeeperPass(
        userText,
        {
          title: scenarioRef.current.title,
          keyVocab: scenarioRef.current.keyVocabulary?.map(v => v.term)
        },
        scenarioRef.current.keyVocabulary?.map(v => v.term)
      );

      setGatekeeperResult(gateCheck);
      repairedText = gateCheck.cleanedSentence || userText;

      if (!gateCheck.isPassed) {
        // Only fails if completely incomplete (< 2 words)
        setVoiceState('failed');
        const tempUserMsg = {
          id: `usr-${Date.now()}`,
          role: 'user',
          text: userText,
          betterWay: gateCheck.betterVersion || gateCheck.expected,
          grammarNote: gateCheck.explanation,
          isPassed: false,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tempUserMsg]);

        const promptMore = "Could you tell me a bit more in a complete sentence? Try speaking again!";
        playAiVoice(promptMore);
        return;
      } else {
        // ✅ PASSED! (Phát âm sai / nói vấp vẫn pass và tự sửa từ sai)
        setVoiceState('passed');
        audioService.playSound('success');
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        } catch {}
      }
    }

    // 2. Normal Flow: Add user message & Call AI
    const tempUserMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: repairedText,
      betterWay: null,
      grammarNote: null,
      isPassed: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setTextInput('');

    try {
      const aiResponse = await aiService.generateResponse({
        scenario: scenarioRef.current,
        conversationHistory: [...messagesRef.current, tempUserMsg],
        userUtterance: repairedText,
        feedbackStyle: voiceSettingsRef.current.feedbackStyle
      });

      // Update gatekeeperResult with alternativeAnswers if available
      if (aiResponse.alternativeAnswers && aiResponse.alternativeAnswers.length > 0) {
        setGatekeeperResult(prev => prev ? {
          ...prev,
          betterVersion: aiResponse.betterWay || prev.betterVersion,
          alternativeAnswers: aiResponse.alternativeAnswers
        } : null);
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === tempUserMsg.id
            ? {
                ...m,
                betterWay: aiResponse.betterWay,
                grammarNote: aiResponse.grammarNote,
                alternativeAnswers: aiResponse.alternativeAnswers,
                cefr: aiResponse.detectedCEFR
              }
            : m
        )
      );

      if (aiResponse.scaffoldingHints && aiResponse.scaffoldingHints.length > 0) {
        setCurrentHints(aiResponse.scaffoldingHints);
      }

      const aiReplyMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: aiResponse.reply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiReplyMsg]);

      if (voiceSettingsRef.current.autoSpeak) {
        playAiVoice(aiResponse.reply);
      } else {
        setVoiceState('idle');
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
      setVoiceState('idle');
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserUtterance(textInput.trim());
    }
  };

  const handleUseHint = (hintText) => {
    handleUserUtterance(hintText);
  };

  const handleListenHint = (hintText, e) => {
    e.stopPropagation();
    audioService.stop();
    audioService.speak(hintText, {
      voiceURI: voiceSettings.voiceURI,
      rate: voiceSettings.speechRate * 0.9
    });
  };

  const handleAddVocab = (vocab) => {
    onSaveToNotebook({
      term: vocab.term,
      meaning: vocab.meaning,
      scenarioTitle: scenario.title,
      example: scenario.initialMessage
    });
    setAddedVocabIds(prev => new Set([...prev, vocab.term]));
  };

  const handleFinish = () => {
    const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
    audioService.stop();
    clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    onFinishSession({
      scenario,
      conversationHistory: messages,
      sessionDurationSeconds: durationSeconds
    });
  };

  return (
    <div className="room-container">
      {/* MAIN CONVERSATION PANE */}
      <div className="room-main">
        {/* Header */}
        <div className="room-header">
          <div className="room-scenario-meta">
            <button className="icon-btn" onClick={onBack} title="Quay lại danh sách kịch bản">
              <ArrowLeft size={18} />
            </button>
            <div className="room-scenario-avatar">{scenario.aiAvatar}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{scenario.title}</h3>
                <span className="card-level-tag">{scenario.level}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                {scenario.aiRole}
              </span>
            </div>
          </div>

          <div className="room-actions">
            {/* View Mode Switcher (Avatar vs Chat) */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', padding: '0.2rem' }}>
              <button
                className={`nav-tab-btn ${viewMode === 'avatar' ? 'active' : ''}`}
                onClick={() => setViewMode('avatar')}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                title="Chế độ nhân vật 2D/3D sinh động"
              >
                <UserCheck size={14} />
                <span>Nhân Vật 3D</span>
              </button>
              <button
                className={`nav-tab-btn ${viewMode === 'chat' ? 'active' : ''}`}
                onClick={() => setViewMode('chat')}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                title="Chế độ lịch sử chat dạng tin nhắn"
              >
                <MessageSquare size={14} />
                <span>Đoạn Chat</span>
              </button>
            </div>

            {/* Gatekeeper Strict Mode Toggle */}
            <button
              onClick={() => {
                const nextState = !isGatekeeperActive;
                setIsGatekeeperActive(nextState);
                if (!nextState) setGatekeeperResult(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${isGatekeeperActive ? '#f59e0b' : 'var(--border-subtle)'}`,
                background: isGatekeeperActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                color: isGatekeeperActive ? '#fcd34d' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="Phát hiện lỗi sai - nói đúng mới cho pass!"
            >
              <ShieldCheck size={14} color={isGatekeeperActive ? '#f59e0b' : '#94a3b8'} />
              <span>{isGatekeeperActive ? 'Vượt Ải: Bật' : 'Vượt Ải: Tắt'}</span>
            </button>

            <button className="finish-session-btn" onClick={handleFinish}>
              <Award size={15} />
              <span>Chấm Điểm</span>
            </button>
          </div>
        </div>

        {/* ============================================================
            VIEW MODE 1: IMMERSIVE 2D/3D ANIMATED AVATAR STAGE
           ============================================================ */}
        {viewMode === 'avatar' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
            <AvatarCharacter
              state={voiceState}
              character={getCharacterType()}
              subtitleText={currentAiSubtitle}
              correctionInfo={gatekeeperResult}
              isStrictGatekeeper={isGatekeeperActive}
            />

            {/* Live speech preview while listening */}
            {isListening && (
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px dashed #818cf8', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'center', color: '#fff', fontStyle: 'italic', margin: '0.75rem auto 0', maxWidth: '680px', width: '90%' }}>
                🎤 {interimTranscript || "Đang lắng nghe... Bạn hãy nói câu tiếng Anh của mình"}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================
             VIEW MODE 2: CLASSIC CHAT STREAM LOG
             ============================================================ */
          <div className="chat-stream-box" ref={chatStreamRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble-wrapper ${msg.role}`}>
                <div className="bubble-avatar">
                  {msg.role === 'ai' ? scenario.aiAvatar : '👤'}
                </div>
                <div className="bubble-content">
                  <div className="bubble-bubble">
                    {msg.text}

                    {msg.role === 'ai' && (
                      <div>
                        <button
                          className="bubble-audio-btn"
                          onClick={() => playAiVoice(msg.text)}
                          title="Nghe lại câu này"
                        >
                          <Volume2 size={13} />
                          <span>Nghe lại</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && msg.betterWay && (
                    <div className="user-rephrase-callout">
                      <div className="rephrase-label">
                        <Sparkles size={13} />
                        <span>Cách nói bản xứ tự nhiên hơn:</span>
                      </div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>
                        "{msg.betterWay}"
                      </div>
                      {msg.grammarNote && (
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          💡 {msg.grammarNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isListening && (
              <div className="message-bubble-wrapper user" style={{ opacity: 0.85 }}>
                <div className="bubble-avatar">🎤</div>
                <div className="bubble-content">
                  <div className="bubble-bubble" style={{ background: 'rgba(99, 102, 241, 0.3)', border: '1px dashed #818cf8', fontStyle: 'italic' }}>
                    {interimTranscript ? interimTranscript : "Đang lắng nghe... Hãy nói câu tiếng Anh của bạn"}
                  </div>
                </div>
              </div>
            )}

            {voiceState === 'thinking' && (
              <div className="message-bubble-wrapper ai">
                <div className="bubble-avatar">{scenario.aiAvatar}</div>
                <div className="bubble-bubble" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                  Đang suy nghĩ phản hồi và phân tích câu nói của bạn...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Controls Bar */}
        <div className="room-voice-controls">
          <div className="voice-action-bar">
            {isListening ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  className="mic-toggle-btn recording"
                  onClick={stopListeningAndSubmit}
                  title="Gửi câu vừa nói ngay lập tức"
                  style={{ background: '#10b981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' }}
                >
                  <Send size={18} />
                  <span>Xong & Gửi Câu Này</span>
                </button>

                <button
                  className="icon-btn"
                  onClick={cancelListening}
                  title="Hủy lượt nói này"
                  style={{ width: 'auto', padding: '0.7rem 1.1rem', borderRadius: 'var(--radius-full)' }}
                >
                  <Square size={14} color="#f43f5e" />
                  <span style={{ fontSize: '0.85rem', marginLeft: '0.35rem' }}>Hủy</span>
                </button>
              </div>
            ) : (
              <button
                className="mic-toggle-btn not-recording"
                onClick={startListening}
                title="Bấm để nói tiếng Anh"
              >
                <Mic size={20} />
                <span>Bấm Để Bắt Đầu Nói (Click to Talk)</span>
              </button>
            )}

            <label className="handsfree-toggle" title="Tự động bật micro sau khi AI nói xong">
              <input
                type="checkbox"
                checked={handsFree}
                onChange={(e) => setHandsFree(e.target.checked)}
              />
              <span>Rảnh Tay (Tự Động Đối Thoại)</span>
            </label>
          </div>

          {/* Quick text input fallback */}
          <form onSubmit={handleTextSubmit} style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Hoặc gõ câu trả lời của bạn tại đây nếu không tiện bật mic..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.65rem 1.25rem',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="icon-btn"
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--gradient-brand)', color: '#fff' }}
              title="Gửi câu trả lời"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* IN-CALL CO-PILOT SIDEBAR */}
      <div className="room-sidebar">
        {/* Scaffolding Hints ("Bí ý tưởng?") */}
        <div className="sidebar-panel">
          <div className="sidebar-panel-title">
            <span>
              <Lightbulb size={16} color="#f59e0b" />
              Gợi Ý Cách Trả Lời (Co-Pilot)
            </span>
          </div>

          <div className="hint-pill-list">
            {currentHints.map((hint, idx) => {
              const levelLabels = ['Cơ Bản', 'Tự Nhiên', 'Nâng Cao'];
              return (
                <div
                  key={idx}
                  className="hint-card"
                  onClick={() => handleUseHint(hint)}
                  title="Nhấn để gửi câu này hoặc luyện nói"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="hint-level-badge">{levelLabels[idx] || 'Gợi Ý'}</span>
                    <button
                      className="icon-btn"
                      style={{ width: '24px', height: '24px', border: 'none' }}
                      onClick={(e) => handleListenHint(hint, e)}
                      title="Nghe mẫu phát âm"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                  <div className="hint-text">{hint}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Vocabulary to Practice */}
        <div className="sidebar-panel">
          <div className="sidebar-panel-title">
            <span>
              <Sparkles size={16} color="#06b6d4" />
              Cụm Từ Nên Thử Dùng
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {scenario.keyVocabulary?.map((vocab, idx) => {
              const isAdded = addedVocabIds.has(vocab.term);
              return (
                <div key={idx} className="vocab-list-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="vocab-term">{vocab.term}</span>
                    <button
                      className="icon-btn"
                      style={{ width: '26px', height: '26px', borderRadius: '4px' }}
                      onClick={() => handleAddVocab(vocab)}
                      title={isAdded ? "Đã lưu vào sổ tay" : "Lưu vào sổ từ vựng"}
                    >
                      {isAdded ? <Check size={14} color="#10b981" /> : <Plus size={14} />}
                    </button>
                  </div>
                  <span className="vocab-meaning">{vocab.meaning}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
