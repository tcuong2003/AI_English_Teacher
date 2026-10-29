import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft, Mic, MicOff, Send, Volume2, Sparkles, Award, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { DAILY_TOPICS, TOPIC_LEVELS } from '../data/dailyTopics';
import AvatarCharacter from './AvatarCharacter';
import { audioService } from '../services/audioService';
import { aiService } from '../services/aiService';
import confetti from 'canvas-confetti';

export default function DailyTopicChallenge({ voiceSettings, onFinishSession }) {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [targetDuration, setTargetDuration] = useState(5); // 5 or 10 mins
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  // Active Session State
  const [timeRemaining, setTimeRemaining] = useState(300); // seconds
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [charState, setCharState] = useState('idle'); // 'idle' | 'speaking' | 'listening' | 'thinking' | 'passed' | 'failed'
  const [subtitle, setSubtitle] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [gatekeeperResult, setGatekeeperResult] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const nextStageTimerRef = useRef(null);
  const accumulatedTextRef = useRef('');
  const isListeningRef = useRef(false);
  const activeTopicRef = useRef(activeTopic);
  activeTopicRef.current = activeTopic;

  const filteredTopics = selectedLevel === 'all'
    ? DAILY_TOPICS
    : DAILY_TOPICS.filter(t => t.level === selectedLevel);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setCharState('listening');
        accumulatedTextRef.current = '';
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) final += res[0].transcript + ' ';
          else interim += res[0].transcript;
        }
        if (final) accumulatedTextRef.current = (accumulatedTextRef.current + ' ' + final).trim();
        const live = (accumulatedTextRef.current + ' ' + interim).trim();
        setInterimTranscript(live);
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          setIsListening(false);
          isListeningRef.current = false;
          setCharState('idle');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        isListeningRef.current = false;
        if (charState === 'listening') setCharState('idle');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      audioService.stop();
      clearInterval(timerRef.current);
      clearTimeout(nextStageTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isSessionActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSessionActive, timeRemaining]);

  const handleStartTopic = (topic) => {
    setActiveTopic(topic);
    setCurrentStageIdx(0);
    setCompletedStages([]);
    setGatekeeperResult(null);
    setConversationHistory([]);
    const totalSecs = (targetDuration || topic.targetMinutes || 5) * 60;
    setTimeRemaining(totalSecs);
    setIsSessionActive(true);
    setSessionStartTime(Date.now());

    const firstStage = topic.stages[0];
    setSubtitle(firstStage.question);
    speakCoachResponse(firstStage.question, topic.aiCoach.name.toLowerCase());
  };

  const speakCoachResponse = (text, character = 'emma', onEnd) => {
    setCharState('speaking');
    audioService.speak(text, {
      voiceURI: voiceSettings.voiceURI,
      rate: voiceSettings.speechRate,
      onEnd: () => {
        setCharState('idle');
        if (onEnd) onEnd();
      }
    });
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt chưa hỗ trợ Web Speech API.");
      return;
    }
    audioService.stop();
    clearTimeout(nextStageTimerRef.current);
    accumulatedTextRef.current = '';
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      audioService.playSound('start-listen');
    } catch {}
  };

  const stopAndEvaluate = () => {
    const spoken = (accumulatedTextRef.current || interimTranscript).trim();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    isListeningRef.current = false;
    audioService.playSound('stop-listen');

    if (!spoken) {
      setCharState('idle');
      return;
    }

    processSpokenInput(spoken);
  };

  const processSpokenInput = async (spokenText) => {
    setCharState('thinking');
    const topic = activeTopicRef.current;
    const currentStage = topic.stages[currentStageIdx];

    // Evaluate answer with smart speech repair, self-correction, and native polish via Backend API
    const evalResult = await aiService.evaluateGatekeeperPass(
      spokenText,
      currentStage,
      currentStage.keyVocab
    );

    // Save to conversation history
    setConversationHistory(prev => [
      ...prev,
      { role: 'ai', text: currentStage.question, timestamp: Date.now() - 1000 },
      {
        role: 'user',
        text: evalResult.cleanedSentence || spokenText,
        betterWay: evalResult.betterVersion,
        isPassed: evalResult.isPassed,
        timestamp: Date.now()
      }
    ]);

    if (!evalResult.isPassed) {
      // Very short input or empty
      setCharState('failed');
      setGatekeeperResult(evalResult);

      const coachFeedback = `I didn't quite catch that. Could you share a bit more in a full sentence? Try speaking again!`;
      setSubtitle(coachFeedback);
      speakCoachResponse(coachFeedback, topic.aiCoach.name.toLowerCase());
    } else {
      // ✅ PASSED! (Phát âm sai / nói vấp vẫn pass và được tự sửa từ sai)
      setCharState('passed');
      setGatekeeperResult(evalResult);
      audioService.playSound('success');

      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setCompletedStages(prev => Array.from(new Set([...prev, currentStage.id])));

      const praise = `Well done! That's a great answer. Here is how you can polish your idea, along with other natural ways to say it!`;
      setSubtitle(praise);
      speakCoachResponse(praise, topic.aiCoach.name.toLowerCase());

      // Auto-schedule next stage after 8 seconds of reviewing feedback, or user can click immediately
      clearTimeout(nextStageTimerRef.current);
      nextStageTimerRef.current = setTimeout(() => {
        handleProceedNextStage();
      }, 9000);
    }
  };

  const handleProceedNextStage = () => {
    clearTimeout(nextStageTimerRef.current);
    const topic = activeTopicRef.current;
    if (!topic) return;

    if (currentStageIdx + 1 < topic.stages.length) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      const nextStage = topic.stages[nextIdx];
      setGatekeeperResult(null);
      setSubtitle(nextStage.question);
      speakCoachResponse(nextStage.question, topic.aiCoach.name.toLowerCase());
    } else {
      handleTopicCompleted();
    }
  };

  const handleTopicCompleted = () => {
    setIsSessionActive(false);
    audioService.playSound('success');
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    onFinishSession({
      scenario: {
        id: activeTopic.id,
        title: `Mỗi Ngày 1 Chủ Đề: ${activeTopic.title}`,
        level: activeTopic.levelName,
        keyVocabulary: activeTopic.stages.flatMap(s => s.keyVocab.map(v => ({ term: v, meaning: 'Từ vựng chủ đề' })))
      },
      conversationHistory,
      sessionDurationSeconds: duration
    });
  };

  const handleTimeComplete = () => {
    alert("⏰ Đã hết thời gian 5-10 phút luyện tập cho chủ đề hôm nay! Hãy cùng xem bảng đánh giá tổng kết nhé.");
    handleTopicCompleted();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStage = activeTopic?.stages[currentStageIdx];

  return (
    <div>
      {/* VIEW 1: TOPIC CATALOG & LEVEL SELECTOR */}
      {!activeTopic && (
        <div>
          {/* Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Clock size={14} />
                <span>Thói Quen Mỗi Ngày 5 - 10 Phút</span>
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem', lineHeight: 1.2 }}>
                Mỗi Ngày 1 Chủ Đề Nói Cùng Gia Sư AI
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Chọn cấp độ, luyện nói từ 5 đến 10 phút. Tự động <strong>sửa từ nói vấp (in-place)</strong>, <strong>nâng cấp câu trả lời của bạn</strong> thành tiếng Anh bản xứ và <strong>gợi ý 3 cách trả lời hay khác</strong>!
              </p>
            </div>

            {/* Target Duration Switcher */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Thời Lượng Mục Tiêu:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`category-pill ${targetDuration === 5 ? 'active' : ''}`}
                  onClick={() => setTargetDuration(5)}
                  style={{ padding: '0.4rem 1rem' }}
                >
                  ⚡ 5 Phút (Sprint)
                </button>
                <button
                  className={`category-pill ${targetDuration === 10 ? 'active' : ''}`}
                  onClick={() => setTargetDuration(10)}
                  style={{ padding: '0.4rem 1rem' }}
                >
                  🎯 10 Phút (Deep)
                </button>
              </div>
            </div>
          </div>

          {/* Level Filter Pills */}
          <div className="category-filter-bar">
            {TOPIC_LEVELS.map(lvl => (
              <button
                key={lvl.id}
                className={`category-pill ${selectedLevel === lvl.id ? 'active' : ''}`}
                onClick={() => setSelectedLevel(lvl.id)}
              >
                <span>{lvl.icon}</span>
                <span>{lvl.name}</span>
                {lvl.time && <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({lvl.time})</span>}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="scenarios-grid">
            {filteredTopics.map(topic => (
              <div
                key={topic.id}
                className="scenario-card"
                onClick={() => handleStartTopic(topic)}
              >
                <div>
                  <div className="card-top">
                    <div className="card-avatar">{topic.aiCoach.avatar}</div>
                    <span className="card-level-tag">{topic.levelName}</span>
                  </div>

                  <h3 className="card-title">{topic.title}</h3>
                  <div className="card-role">
                    Gia sư {topic.aiCoach.name} • {topic.aiCoach.role}
                  </div>
                  <p className="card-desc">{topic.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '0.78rem', color: '#10b981' }}>
                    <ShieldCheck size={14} />
                    <span>Bao gồm {topic.stages.length} chặng thảo luận & phản hồi bản xứ</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    <span>{targetDuration} phút</span>
                  </span>
                  <button className="start-chat-btn" onClick={(e) => { e.stopPropagation(); handleStartTopic(topic); }}>
                    <Play size={14} />
                    <span>Bắt Đầu Ngay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE 5-10 MIN DAILY CHALLENGE ROOM WITH 2D/3D AVATAR */}
      {activeTopic && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="icon-btn" onClick={() => setActiveTopic(null)} title="Rời khỏi chủ đề">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{activeTopic.title}</h3>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                  {activeTopic.levelName} • Chặng {currentStageIdx + 1}/{activeTopic.stages.length} ({currentStage?.stageName})
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              <Clock size={16} color="#06b6d4" />
              <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: timeRemaining < 60 ? '#f43f5e' : '#fff' }}>
                {formatTimer(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {activeTopic.stages.map((st, i) => (
              <div
                key={st.id}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  background: completedStages.includes(st.id) ? '#10b981' : i === currentStageIdx ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s'
                }}
                title={st.stageName}
              />
            ))}
          </div>

          {/* CURRENT QUESTION CARD - ALWAYS CLEARLY VISIBLE */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                ❓ Câu hỏi hiện tại (Chặng {currentStageIdx + 1}):
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                "{currentStage?.question}"
              </div>
            </div>
            <button
              className="icon-btn"
              onClick={() => speakCoachResponse(currentStage?.question, activeTopic.aiCoach.name.toLowerCase())}
              title="Nghe lại câu hỏi này"
              style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)' }}
            >
              <Volume2 size={18} color="#a5b4fc" />
            </button>
          </div>

          {/* IMMERSIVE 2D/3D ANIMATED AVATAR COACH WITH IN-PLACE REPAIR & UPGRADED SENTENCE */}
          <AvatarCharacter
            state={charState}
            character={activeTopic.aiCoach.name.toLowerCase()}
            subtitleText={subtitle}
            correctionInfo={gatekeeperResult}
            isStrictGatekeeper={true}
            onProceedNext={handleProceedNextStage}
          />

          {/* LIVE TRANSCRIPTION PREVIEW */}
          {isListening && (
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px dashed #818cf8', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', textAlign: 'center', color: '#fff', fontStyle: 'italic' }}>
              🎤 {interimTranscript || "Đang lắng nghe... Bạn cứ thoải mái nói bằng tiếng Anh, nếu vấp máy sẽ tự sửa"}
            </div>
          )}

          {/* CONTROLS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', padding: '0.5rem 0' }}>
            {isListening ? (
              <button
                className="mic-toggle-btn recording"
                onClick={stopAndEvaluate}
                style={{ background: '#10b981', boxShadow: '0 0 25px rgba(16, 185, 129, 0.7)' }}
              >
                <Send size={18} />
                <span>Xong & Phân Tích Câu Nói</span>
              </button>
            ) : (
              <button
                className="mic-toggle-btn not-recording"
                onClick={startListening}
                style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
              >
                <Mic size={22} />
                <span>Bấm Để Trả Lời Bằng Giọng Nói (Voice)</span>
              </button>
            )}

            {gatekeeperResult?.isPassed && (
              <button
                className="start-chat-btn"
                onClick={handleProceedNextStage}
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.92rem', background: 'var(--gradient-brand)' }}
                title="Chuyển sang chặng kế tiếp"
              >
                <span>Chặng Tiếp Theo</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* STAGE HINT / RECOMMENDED KEY VOCAB */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} color="#06b6d4" />
              <span>Gợi ý mẫu câu để bạn luyện nói (Hoặc bạn có thể nói theo ý mình):</span>
            </div>
            <div style={{ fontSize: '0.92rem', color: '#f1f5f9', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              "{currentStage?.hintSentence}"
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {currentStage?.keyVocab.map((v, i) => (
                <span key={i} className="vocab-tag" style={{ color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
