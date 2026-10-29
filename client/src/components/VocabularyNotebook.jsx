import React, { useState } from 'react';
import { BookOpen, Volume2, Plus, Trash2, CheckCircle2, RotateCw, Search } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function VocabularyNotebook({
  notebook,
  onRemoveItem,
  onAddNewItem,
  voiceSettings
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

  const filteredNotebook = notebook.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpeak = (text, e) => {
    e.stopPropagation();
    audioService.stop();
    audioService.speak(text, {
      voiceURI: voiceSettings.voiceURI,
      rate: voiceSettings.speechRate * 0.95
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTerm.trim() || !newMeaning.trim()) return;

    onAddNewItem({
      term: newTerm.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim() || 'Custom added expression'
    });

    setNewTerm('');
    setNewMeaning('');
    setNewExample('');
    setShowAddForm(false);
  };

  return (
    <div>
      {/* Top Banner & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} color="#8b5cf6" />
            Sổ Tay Từ Vựng & Cụm Từ Bản Xứ
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Lưu giữ và ôn tập các collocations, idioms thu thập được qua các phiên hội thoại.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Tìm kiếm cụm từ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                width: '200px'
              }}
            />
          </div>

          <button
            className="start-chat-btn"
            style={{ padding: '0.5rem 1.1rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} />
            <span>Thêm Cụm Từ Mới</span>
          </button>
        </div>
      </div>

      {/* Manual Add Form Modal/Panel */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-indigo)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#a5b4fc' }}>Thêm Cụm Từ / Idiom Mới Vào Sổ Tay</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Từ / Cụm từ (e.g. Strike a balance)"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              required
            />
            <input
              type="text"
              placeholder="Ý nghĩa tiếng Việt (e.g. Cân bằng giữa 2 bên)"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              required
            />
            <input
              type="text"
              placeholder="Câu ví dụ ngữ cảnh (tùy chọn)"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
            />
            <button type="submit" className="start-chat-btn" style={{ padding: '0.55rem 1.25rem' }}>
              Lưu
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      {filteredNotebook.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Chưa có cụm từ nào phù hợp. Hãy trò chuyện với AI và nhấn nút "+" để lưu những câu nói hay vào sổ tay nhé!
          </p>
        </div>
      ) : (
        <div className="notebook-container">
          {filteredNotebook.map((item, idx) => (
            <div key={idx} className="flashcard">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="flashcard-term">{item.term}</div>
                  <button
                    className="icon-btn"
                    style={{ width: '32px', height: '32px' }}
                    onClick={(e) => handleSpeak(item.term, e)}
                    title="Phát âm chuẩn"
                  >
                    <Volume2 size={16} color="#06b6d4" />
                  </button>
                </div>

                <div className="flashcard-meaning">{item.meaning}</div>

                {item.example && (
                  <div className="flashcard-example">
                    "{item.example}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {item.scenarioTitle || 'Sổ tay cá nhân'}
                </span>

                <button
                  className="icon-btn"
                  style={{ width: '28px', height: '28px', border: 'none' }}
                  onClick={() => onRemoveItem(item.term)}
                  title="Xóa khỏi sổ tay"
                >
                  <Trash2 size={14} color="#f43f5e" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
