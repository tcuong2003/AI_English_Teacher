import React from 'react';
import { Mic, Zap, BookOpen, Settings, Flame, Clock } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenSettings,
  streakDays = 3,
  speakingMinutes = 12
}) {
  return (
    <header className="header-bar">
      <div className="brand-wrapper" onClick={() => setActiveTab('scenarios')}>
        <div className="brand-icon-box">
          <Mic size={22} />
        </div>
        <div className="brand-text">
          <h1>
            SpeakFlow <span className="brand-badge">AI 2.0</span>
          </h1>
          <span className="brand-tagline">AI English Conversational Coach</span>
        </div>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-tab-btn ${activeTab === 'scenarios' || activeTab === 'room' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          <Mic size={16} />
          <span>Hội Thoại Trực Tiếp</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'dailyTopic' ? 'active' : ''}`}
          onClick={() => setActiveTab('dailyTopic')}
        >
          <Clock size={16} color="#10b981" />
          <span>Mỗi Ngày 1 Chủ Đề (5-10p)</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'reflex' ? 'active' : ''}`}
          onClick={() => setActiveTab('reflex')}
        >
          <Zap size={16} />
          <span>Tư Duy Phản Xạ 15s</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'notebook' ? 'active' : ''}`}
          onClick={() => setActiveTab('notebook')}
        >
          <BookOpen size={16} />
          <span>Sổ Từ Vựng & Cụm Từ</span>
        </button>
      </nav>

      <div className="header-actions">
        <div className="stat-chip" title="Chuỗi ngày luyện nói liên tiếp">
          <Flame size={15} color="#f59e0b" />
          <span><strong>{streakDays}</strong> ngày</span>
        </div>

        <div className="stat-chip" title="Thời lượng nói hôm nay">
          <Clock size={15} color="#06b6d4" />
          <span><strong>{speakingMinutes}</strong> phút</span>
        </div>

        <button
          className="icon-btn"
          onClick={onOpenSettings}
          title="Cài đặt giọng nói & API Key"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
