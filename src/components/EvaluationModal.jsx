import React, { useEffect } from 'react';
import { X, Award, CheckCircle, TrendingUp, Sparkles, BookOpen, RotateCcw, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateSession } from '../services/evaluatorService';

export default function EvaluationModal({
  sessionData,
  onClose,
  onRetryScenario
}) {
  const { scenario, conversationHistory, sessionDurationSeconds } = sessionData;
  const evaluation = evaluateSession({
    scenario,
    conversationHistory,
    sessionDurationSeconds
  });

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti skipped:', e);
    }
  }, []);

  const downloadReport = () => {
    const reportText = `
SPEAKFLOW AI - BÁO CÁO ĐÁNH GIÁ HỘI THOẠI
Kịch bản: ${scenario.title}
Trình độ ước tính: CEFR ${evaluation.cefrLevel}
Điểm tổng quan: ${evaluation.overallScore}/100

1. CHỈ SỐ LƯU LOÁT:
- Tốc độ nói: ${evaluation.wpm} WPM
- Tổng số từ: ${evaluation.totalWords} từ
- Lượt đối thoại: ${evaluation.turnsCount} lượt
- Từ ngập ngừng (uh/um): ${evaluation.fillersCount} lần

2. CÁC ĐIỂM CẦN CHÚ Ý & SỬA LỖI:
${evaluation.corrections.map((c, i) => `
#${i + 1} [${c.type}]
- Câu của bạn: "${c.original}"
- Bản xứ tự nhiên: "${c.corrected}"
- Giải thích: ${c.explanation}
`).join('')}

3. LỜI KHUYÊN PHÁT TRIỂN:
${evaluation.improvements.map(imp => `- ${imp}`).join('\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpeakFlow_Report_${scenario.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            <Award size={18} />
            <span>Đã Hoàn Thành Phiên Luyện Nói</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>
            Báo Cáo Đánh Giá Hội Thoại
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Kịch bản: <strong>{scenario.title}</strong>
          </p>
        </div>

        {/* Hero Score Banner */}
        <div className="eval-hero-banner">
          <div className="eval-score-ring">
            <div className="eval-score-number">{evaluation.overallScore}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Điểm Tổng Thể / 100
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Trình Độ Ước Tính (CEFR)
            </div>
            <div className="eval-cefr-badge">
              {evaluation.cefrLevel} Level
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem' }}>
              {evaluation.cefrLevel === 'C1' ? 'Lưu loát & Tự nhiên cao cấp' : evaluation.cefrLevel === 'B2' ? 'Giao tiếp chủ động & rõ ràng' : 'Giao tiếp cơ bản vững chắc'}
            </div>
          </div>
        </div>

        {/* Detailed 3-Grid Metrics */}
        <div className="eval-metrics-grid">
          <div className="metric-card">
            <div className="metric-card-label">Tốc Độ Nói (WPM)</div>
            <div className="metric-card-value" style={{ color: '#06b6d4' }}>
              {evaluation.wpm}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Chuẩn bản xứ: 110 - 150 WPM
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-label">Độ Lưu Loát & Phản Xạ</div>
            <div className="metric-card-value" style={{ color: '#8b5cf6' }}>
              {evaluation.fluencyScore}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {evaluation.fillersCount} lần ngập ngừng (uhm/ah)
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-label">Độ Chuẩn Ngữ Pháp</div>
            <div className="metric-card-value" style={{ color: '#10b981' }}>
              {evaluation.grammarScore}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Dựa trên cấu trúc câu sử dụng
            </div>
          </div>
        </div>

        {/* Native Rephrase & Corrections Diff */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={18} color="#06b6d4" />
            Chi Tiết Nâng Cấp Câu Nói & Sửa Lỗi
          </h3>

          {evaluation.corrections.length === 0 ? (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#6ee7b7', fontSize: '0.9rem' }}>
              Xuất sắc! Các câu trả lời của bạn đều đạt độ chính xác cao và rất tự nhiên.
            </div>
          ) : (
            evaluation.corrections.map((corr, idx) => (
              <div key={idx} className="correction-diff-card">
                <div className="diff-row">
                  <span className="diff-badge original">Câu của bạn</span>
                  <span style={{ color: '#fda4af', textDecoration: 'line-through' }}>
                    "{corr.original}"
                  </span>
                </div>
                <div className="diff-row">
                  <span className="diff-badge native">Bản xứ tự nhiên</span>
                  <span style={{ color: '#6ee7b7', fontWeight: 600 }}>
                    "{corr.corrected}"
                  </span>
                </div>
                {corr.explanation && (
                  <div className="diff-explanation">
                    💡 {corr.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Strengths & Actionable Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={15} />
              Điểm Mạnh Của Bạn:
            </div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {evaluation.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={15} />
              Mẹo Cải Thiện Tiếp Theo:
            </div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {evaluation.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="icon-btn" onClick={downloadReport} style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', display: 'flex', gap: '0.4rem' }}>
            <Download size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tải Báo Cáo (.txt)</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="icon-btn" onClick={() => onRetryScenario(scenario)} style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', display: 'flex', gap: '0.4rem' }}>
              <RotateCcw size={15} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Luyện Lại Kịch Bản</span>
            </button>
            <button className="start-chat-btn" onClick={onClose}>
              <span>Tiếp Tục Kịch Bản Khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
