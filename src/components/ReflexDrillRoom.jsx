import React, { useState, useEffect, useRef } from 'react';
import { Zap, Volume2, Mic, MicOff, RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { REFLEX_CHALLENGES } from '../data/scenarios';
import { audioService } from '../services/audioService';

export default function ReflexDrillRoom({ voiceSettings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const challenge = REFLEX_CHALLENGES[currentIndex] || REFLEX_CHALLENGES[0];
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        audioService.playSound('start-listen');
      };

      recognition.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + ' ';
        }
        if (text.trim()) {
          setUserAnswer(text.trim());
        }
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      clearInterval(timerIntervalRef.current);
      audioService.stop();
    };
  }, []);

  const startDrill = () => {
    audioService.stop();
    setUserAnswer('');
    setEvaluation(null);
    setTimeLeft(challenge.timeLimit || 15);
    setIsTimerRunning(false);

    // AI reads question aloud
    audioService.speak(challenge.question, {
      voiceURI: voiceSettings.voiceURI,
      rate: voiceSettings.speechRate,
      onEnd: () => {
        // Start countdown and open microphone automatically
        setIsTimerRunning(true);
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch {}
        }
      }
    });
  };

  // Timer countdown hook
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch {}
            }
            if (!userAnswer) {
              handleTimeOut();
            }
            return 0;
          }
          if (prev <= 4) {
            audioService.playSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timeLeft, userAnswer]);

  const handleTimeOut = () => {
    setEvaluation({
      speedRating: 'Hết Giờ!',
      comment: 'Bạn bị ngập ngừng quá lâu. Đừng sợ sai ngữ pháp! Khi luyện phản xạ, ưu tiên nói ra ý đầu tiên nảy ra trong đầu.',
      score: 40
    });
  };

  const handleAnswerSubmitted = (transcript) => {
    setUserAnswer(transcript);
    setIsTimerRunning(false);
    clearInterval(timerIntervalRef.current);

    const secondsTaken = (challenge.timeLimit || 15) - timeLeft;
    let score = 85;
    let speedRating = 'Rất Nhanh & Tự Tin!';

    if (secondsTaken > 10) {
      speedRating = 'Tạm Ổn - Cần Tăng Tốc';
      score = 70;
    } else if (secondsTaken <= 5) {
      speedRating = 'Phản Xạ Thần Tốc!';
      score = 95;
    }

    audioService.playSound('success');

    setEvaluation({
      speedRating,
      secondsTaken,
      score,
      comment: transcript.length > 30
        ? 'Phản xạ rất tốt, bạn đã đưa ra được lập luận rõ ràng ngay lập tức!'
        : 'Tốt! Lần sau hãy thử ghép thêm một mệnh đề giải thích nguyên nhân bằng "because" hoặc "since".'
    });
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentIndex + 1) % REFLEX_CHALLENGES.length;
    setCurrentIndex(nextIdx);
    setUserAnswer('');
    setEvaluation(null);
    setTimeLeft(REFLEX_CHALLENGES[nextIdx].timeLimit || 15);
    setIsTimerRunning(false);
    audioService.stop();
  };

  return (
    <div className="reflex-container">
      <div className="reflex-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Zap size={22} color="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b' }}>
            Phòng Luyện Phản Xạ 15 Giây
          </span>
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          Tư Duy Trực Tiếp Bằng Tiếng Anh
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '580px', margin: '0 auto' }}>
          Mục tiêu: Loại bỏ thói quen dịch nhẩm trong đầu. AI sẽ đặt câu hỏi, đồng hồ đếm ngược 15s bắt đầu, hãy trả lời ngay lập tức!
        </p>

        {/* Circular Countdown Timer */}
        <div className={`reflex-timer-circle ${timeLeft <= 4 && isTimerRunning ? 'urgent' : ''}`}>
          {timeLeft}s
        </div>

        {/* Question Display */}
        <div className="reflex-question-box">
          <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Câu Hỏi Thử Thách #{currentIndex + 1}
          </div>
          <div className="reflex-question-title">
            "{challenge.question}"
          </div>

          <button
            className="icon-btn"
            style={{ margin: '0.75rem auto 0', display: 'flex', gap: '0.4rem', width: 'auto', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => audioService.speak(challenge.question, { voiceURI: voiceSettings.voiceURI })}
            title="Nghe câu hỏi"
          >
            <Volume2 size={15} />
            <span style={{ fontSize: '0.8rem' }}>Nghe lại câu hỏi</span>
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!isTimerRunning && !evaluation && (
            <button className="start-chat-btn" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }} onClick={startDrill}>
              <Zap size={18} />
              <span>Bắt Đầu Thử Thách 15s</span>
            </button>
          )}

          {isTimerRunning && (
            <button
              className={`mic-toggle-btn ${isListening ? 'recording' : 'not-recording'}`}
              onClick={() => {
                if (isListening && recognitionRef.current) recognitionRef.current.stop();
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isListening ? 'Đang Thu Âm... (Nói Đi!)' : 'Bật Micro'}</span>
            </button>
          )}

          {evaluation && (
            <button className="start-chat-btn" onClick={handleNextChallenge} style={{ padding: '0.75rem 1.8rem' }}>
              <span>Thử Thách Tiếp Theo</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Feedback Display if answered */}
        {userAnswer && (
          <div style={{ marginTop: '1.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>Câu bạn vừa nói:</span>
              </div>
              <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.9rem' }}>
                {evaluation?.speedRating} ({evaluation?.secondsTaken}s)
              </span>
            </div>
            <p style={{ color: '#fff', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              "{userAnswer}"
            </p>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', borderLeft: '3px solid var(--accent-indigo)', paddingLeft: '0.75rem' }}>
              💡 {evaluation?.comment}
            </div>
          </div>
        )}

        {/* Recommended Starter Connectors */}
        <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.5rem' }}>
            ⚡ Cụm từ khởi động phản xạ nhanh cho câu hỏi này:
          </div>
          <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {challenge.recommendedExpressions?.map((expr, i) => (
              <li key={i}>{expr}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
