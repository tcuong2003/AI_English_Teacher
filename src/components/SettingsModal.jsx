import React, { useState, useEffect } from 'react';
import { X, Key, Sliders, Volume2, Check, AlertCircle } from 'lucide-react';
import { aiService } from '../services/aiService';
import { audioService } from '../services/audioService';

export default function SettingsModal({
  isOpen,
  onClose,
  voiceSettings,
  onSaveVoiceSettings
}) {
  const [provider, setProvider] = useState(aiService.provider || 'gemini');
  const [apiKey, setApiKey] = useState(aiService.apiKey || '');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(voiceSettings.voiceURI || '');
  const [speechRate, setSpeechRate] = useState(voiceSettings.speechRate || 0.95);
  const [autoSpeak, setAutoSpeak] = useState(voiceSettings.autoSpeak ?? true);
  const [feedbackStyle, setFeedbackStyle] = useState(voiceSettings.feedbackStyle || 'balanced');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(aiService.apiKey);
      setProvider(aiService.provider);
      const voices = audioService.getEnglishVoices();
      setAvailableVoices(voices);
      if (!selectedVoice && voices.length > 0) {
        setSelectedVoice(voices[0].voiceURI);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    audioService.stop();
    audioService.speak("Hello! This is how your conversational English coach sounds. Ready to practice speaking?", {
      voiceURI: selectedVoice,
      rate: speechRate
    });
  };

  const handleSave = () => {
    aiService.saveSettings(provider, apiKey.trim());
    onSaveVoiceSettings({
      voiceURI: selectedVoice,
      speechRate: parseFloat(speechRate),
      autoSpeak,
      feedbackStyle
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={22} color="#6366f1" />
          Cấu Hình Hệ Thống & Giọng Nói
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Tùy chỉnh mô hình AI, giọng đọc bản xứ và chế độ huấn luyện theo nhu cầu của bạn.
        </p>

        {/* AI Engine Choice */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff' }}>
            <Key size={16} color="#06b6d4" />
            Mô Hình Xử Lý Đối Thoại (LLM)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="aiProvider"
                value="offline"
                checked={provider === 'offline'}
                onChange={() => setProvider('offline')}
                style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)' }}
              />
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                  Bộ Não AI Tích Hợp Sẵn (Smart Engine) - Miễn Phí 100%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Hoạt động ngay lập tức, không cần tài khoản hay API key, tích hợp kịch bản và sửa lỗi trực quan.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="aiProvider"
                value="gemini"
                checked={provider === 'gemini'}
                onChange={() => setProvider('gemini')}
                style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                  Google Gemini 1.5 Flash (Trực Tuyến Sống Động)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Đối thoại biến hóa sâu sắc, phân tích ngữ pháp chuyên sâu không giới hạn.
                </div>

                {provider === 'gemini' && (
                  <input
                    type="password"
                    placeholder="Nhập Gemini API Key của bạn (bắt đầu bằng AIzaSy...)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.55rem 0.85rem',
                      color: '#fff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Voice & Accent */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff' }}>
            <Volume2 size={16} color="#8b5cf6" />
            Giọng Nói & Ngữ Điệu (Text-to-Speech)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Chọn Giọng Đọc Bản Xứ:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.55rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI} style={{ background: '#111625' }}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="icon-btn"
                  onClick={handleTestVoice}
                  title="Nghe thử giọng này"
                  style={{ width: 'auto', padding: '0 0.85rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <Volume2 size={15} />
                  <span style={{ fontSize: '0.78rem', marginLeft: '0.3rem' }}>Thử</span>
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Tốc Độ Nói Của AI:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-indigo)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                <span>0.75x (Chậm & Rõ)</span>
                <span>1.0x (Tự Nhiên)</span>
                <span>1.25x (Nhanh)</span>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                style={{ accentColor: 'var(--accent-indigo)' }}
              />
              <span>Tự động phát âm tiếng nói của AI khi có phản hồi</span>
            </label>
          </div>
        </div>

        {/* Feedback Rigor */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
            Phong Cách Huấn Luyện Của AI
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'gentle', title: 'Nhẹ Nhàng', desc: 'Khích lệ, chỉ sửa lỗi lớn' },
              { id: 'balanced', title: 'Cân Bằng', desc: 'Gợi ý cách nói bản xứ cho mỗi câu' },
              { id: 'strict', title: 'Nghiêm Khắc', desc: 'Soi kỹ ngữ pháp & sắc thái' }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setFeedbackStyle(item.id)}
                style={{
                  background: feedbackStyle === item.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${feedbackStyle === item.id ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: feedbackStyle === item.id ? '#a5b4fc' : '#fff' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="icon-btn" onClick={onClose} style={{ width: 'auto', padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-full)' }}>
            Hủy
          </button>
          <button className="start-chat-btn" onClick={handleSave} style={{ padding: '0.55rem 1.75rem' }}>
            {saveSuccess ? (
              <>
                <Check size={16} />
                <span>Đã Lưu!</span>
              </>
            ) : (
              <span>Lưu Cấu Hình</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
