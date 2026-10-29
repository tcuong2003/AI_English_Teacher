import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConversationRoom from './components/ConversationRoom';
import ReflexDrillRoom from './components/ReflexDrillRoom';
import DailyTopicChallenge from './components/DailyTopicChallenge';
import VocabularyNotebook from './components/VocabularyNotebook';
import EvaluationModal from './components/EvaluationModal';
import SettingsModal from './components/SettingsModal';
import { SCENARIOS, CATEGORIES } from './data/scenarios';
import { Sparkles, MessageSquare, ArrowRight, Play, Zap, Flame, CheckCircle, Clock } from 'lucide-react';

const INITIAL_NOTEBOOK = [
  {
    term: "A double-edged sword",
    meaning: "Con dao hai lưỡi (vừa có lợi vừa có hại)",
    scenarioTitle: "IELTS Speaking Part 3",
    example: "AI is a double-edged sword that brings both high efficiency and potential job displacement."
  },
  {
    term: "Tight turnaround time",
    meaning: "Thời gian xử lý rất gấp rút",
    scenarioTitle: "Job Interview",
    example: "We had a tight turnaround time, but delivered the project ahead of schedule."
  },
  {
    term: "Couldn't ask for better weather",
    meaning: "Thời tiết không thể tuyệt vời hơn",
    scenarioTitle: "Small Talk",
    example: "It's sunny and mild today; couldn't ask for better weather!"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'room' | 'reflex' | 'notebook'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeScenario, setActiveScenario] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User stats & notebook persisted in localStorage
  const [notebook, setNotebook] = useState(() => {
    try {
      const saved = localStorage.getItem('speakflow_notebook');
      return saved ? JSON.parse(saved) : INITIAL_NOTEBOOK;
    } catch {
      return INITIAL_NOTEBOOK;
    }
  });

  const [streakDays, setStreakDays] = useState(3);
  const [speakingMinutes, setSpeakingMinutes] = useState(14);

  const [voiceSettings, setVoiceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('speakflow_voice_settings');
      return saved ? JSON.parse(saved) : {
        voiceURI: '',
        speechRate: 0.95,
        autoSpeak: true,
        feedbackStyle: 'balanced'
      };
    } catch {
      return { voiceURI: '', speechRate: 0.95, autoSpeak: true, feedbackStyle: 'balanced' };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('speakflow_notebook', JSON.stringify(notebook));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [notebook]);

  const handleSaveVoiceSettings = (newSettings) => {
    setVoiceSettings(newSettings);
    try {
      localStorage.setItem('speakflow_voice_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Settings save error:', e);
    }
  };

  const handleStartScenario = (scenario) => {
    setActiveScenario(scenario);
    setActiveTab('room');
  };

  const handleFinishSession = (sessionData) => {
    setCompletedSession(sessionData);
    // Increment minutes
    const addedMin = Math.max(1, Math.round(sessionData.sessionDurationSeconds / 60));
    setSpeakingMinutes(prev => prev + addedMin);
  };

  const handleCloseEvaluation = () => {
    setCompletedSession(null);
    setActiveTab('scenarios');
    setActiveScenario(null);
  };

  const handleRetryScenario = (scenario) => {
    setCompletedSession(null);
    setActiveScenario(scenario);
    setActiveTab('room');
  };

  const handleSaveToNotebook = (item) => {
    setNotebook(prev => {
      if (prev.some(x => x.term.toLowerCase() === item.term.toLowerCase())) {
        return prev;
      }
      return [item, ...prev];
    });
  };

  const handleRemoveNotebookItem = (term) => {
    setNotebook(prev => prev.filter(x => x.term !== term));
  };

  const handleAddCustomNotebookItem = (newItem) => {
    setNotebook(prev => [newItem, ...prev]);
  };

  const filteredScenarios = selectedCategory === 'all'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.category === selectedCategory);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'scenarios') setActiveScenario(null);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        streakDays={streakDays}
        speakingMinutes={speakingMinutes}
      />

      <main className="main-content">
        {/* TAB 1: SCENARIOS CATALOG */}
        {activeTab === 'scenarios' && !activeScenario && (
          <div>
            {/* Hero Welcome Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{ maxWidth: '620px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  <Sparkles size={14} />
                  <span>AI Real-time Conversational Intelligence</span>
                </div>
                <h2 style={{ fontSize: '2.1rem', marginBottom: '0.6rem', lineHeight: 1.2 }}>
                  Luyện Nói Tiếng Anh Đối Thoại Trực Tiếp Cùng AI
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Đối thoại 2 chiều tự nhiên, rèn tư duy phản xạ không cần dịch nhẩm, nhận gợi ý cách nói bản xứ ngay trong lúc gọi, và bảng đánh giá độ trôi chảy sau mỗi phiên.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="start-chat-btn"
                  style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}
                  onClick={() => setActiveTab('dailyTopic')}
                >
                  <Clock size={18} />
                  <span>Mỗi Ngày 1 Chủ Đề (5-10p)</span>
                </button>

                <button
                  className="icon-btn"
                  style={{ width: 'auto', padding: '0.75rem 1.4rem', borderRadius: 'var(--radius-full)', display: 'flex', gap: '0.45rem' }}
                  onClick={() => handleStartScenario(SCENARIOS[0])}
                >
                  <Play size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hội Thoại Mẫu</span>
                </button>

                <button
                  className="icon-btn"
                  style={{ width: 'auto', padding: '0.75rem 1.4rem', borderRadius: 'var(--radius-full)', display: 'flex', gap: '0.45rem' }}
                  onClick={() => setActiveTab('reflex')}
                >
                  <Zap size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tư Duy 15s</span>
                </button>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="category-filter-bar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Scenarios Grid */}
            <div className="scenarios-grid">
              {filteredScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className="scenario-card"
                  onClick={() => handleStartScenario(scenario)}
                >
                  <div>
                    <div className="card-top">
                      <div className="card-avatar">{scenario.aiAvatar}</div>
                      <span className="card-level-tag">{scenario.level}</span>
                    </div>

                    <h3 className="card-title">{scenario.title}</h3>
                    <div className="card-role">{scenario.aiRole}</div>
                    <p className="card-desc">{scenario.description}</p>

                    <div className="card-vocab-preview">
                      {scenario.keyVocabulary?.slice(0, 3).map((v, i) => (
                        <span key={i} className="vocab-tag">
                          {v.term}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-footer">
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {scenario.categoryName}
                    </span>
                    <button className="start-chat-btn" onClick={(e) => { e.stopPropagation(); handleStartScenario(scenario); }}>
                      <span>Bắt Đầu</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE CONVERSATION ROOM */}
        {activeTab === 'room' && activeScenario && (
          <ConversationRoom
            scenario={activeScenario}
            onBack={() => {
              setActiveTab('scenarios');
              setActiveScenario(null);
            }}
            onFinishSession={handleFinishSession}
            onSaveToNotebook={handleSaveToNotebook}
            voiceSettings={voiceSettings}
          />
        )}

        {/* TAB 3: DAILY 5-10 MIN TOPIC CHALLENGE (WITH AVATAR & GATEKEEPER PASS/FAIL) */}
        {activeTab === 'dailyTopic' && (
          <DailyTopicChallenge
            voiceSettings={voiceSettings}
            onFinishSession={handleFinishSession}
          />
        )}

        {/* TAB 4: REFLEX DRILL ROOM */}
        {activeTab === 'reflex' && (
          <ReflexDrillRoom voiceSettings={voiceSettings} />
        )}

        {/* TAB 5: VOCABULARY NOTEBOOK */}
        {activeTab === 'notebook' && (
          <VocabularyNotebook
            notebook={notebook}
            onRemoveItem={handleRemoveNotebookItem}
            onAddNewItem={handleAddCustomNotebookItem}
            voiceSettings={voiceSettings}
          />
        )}
      </main>

      {/* Post-session Evaluation Modal */}
      {completedSession && (
        <EvaluationModal
          sessionData={completedSession}
          onClose={handleCloseEvaluation}
          onRetryScenario={handleRetryScenario}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceSettings={voiceSettings}
        onSaveVoiceSettings={handleSaveVoiceSettings}
      />
    </div>
  );
}
