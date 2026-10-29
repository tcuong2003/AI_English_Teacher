import express from 'express';

const router = express.Router();

/**
 * POST /api/evaluate
 * Body: { scenario, conversationHistory, sessionDurationSeconds }
 */
router.post('/', (req, res) => {
  try {
    const { scenario = {}, conversationHistory = [], sessionDurationSeconds = 120 } = req.body;
    const userMessages = conversationHistory.filter(m => m.role === 'user');

    if (userMessages.length === 0) {
      return res.json({
        overallScore: 50,
        cefrLevel: 'A2',
        fluencyScore: 50,
        grammarScore: 60,
        vocabScore: 50,
        wpm: 0,
        totalWords: 0,
        fillersCount: 0,
        corrections: [],
        strengths: ["Sẵn sàng bắt đầu buổi học"],
        improvements: ["Hãy mạnh dạn nói nhiều câu hơn trong các phiên tiếp theo."]
      });
    }

    const allUserText = userMessages.map(m => m.text).join(' ');
    const words = allUserText.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const activeMinutes = Math.max(0.5, sessionDurationSeconds / 60);
    const wpm = Math.min(180, Math.round((totalWords / activeMinutes) * 1.5));

    const fillerRegex = /\b(um|uh|er|ah|like|you know|basically|actually)\b/gi;
    const fillers = allUserText.match(fillerRegex) || [];
    const fillersCount = fillers.length;

    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
    const vocabVarietyRatio = words.length > 0 ? (uniqueWords.size / words.length) : 0;

    let fluencyScore = 75;
    if (wpm >= 90 && wpm <= 140) fluencyScore += 15;
    else if (wpm < 60) fluencyScore -= 15;
    if (fillersCount > 5) fluencyScore -= 10;
    fluencyScore = Math.min(98, Math.max(50, fluencyScore));

    const grammarScore = 85;
    const vocabScore = Math.min(98, Math.max(50, 70 + Math.round(vocabVarietyRatio * 30)));
    const overallScore = Math.round((fluencyScore * 0.35) + (grammarScore * 0.35) + (vocabScore * 0.3));

    let cefrLevel = 'B1';
    if (overallScore >= 88) cefrLevel = 'C1';
    else if (overallScore >= 78) cefrLevel = 'B2';
    else if (overallScore >= 65) cefrLevel = 'B1';
    else cefrLevel = 'A2';

    return res.json({
      overallScore,
      cefrLevel,
      fluencyScore,
      grammarScore,
      vocabScore,
      wpm,
      totalWords,
      fillersCount,
      turnsCount: userMessages.length,
      corrections: userMessages.filter(m => m.betterWay && m.betterWay !== m.text).slice(0, 3).map(m => ({
        original: m.text,
        corrected: m.betterWay,
        explanation: m.grammarNote || "Nâng cấp diễn đạt bản xứ tự nhiên.",
        type: 'Phrasing'
      })),
      strengths: ["Phát triển câu trả lời tự nhiên và phản xạ nhanh."],
      improvements: ["Tiếp tục mở rộng vốn thành ngữ (idioms) trong các ngữ cảnh đa dạng."]
    });
  } catch (err) {
    res.status(500).json({ error: 'Evaluation failed', message: err.message });
  }
});

export default router;

