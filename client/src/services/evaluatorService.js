// Post-session Evaluation and Analytics Engine

export function evaluateSession({ conversationHistory, scenario, sessionDurationSeconds = 120 }) {
  const userMessages = conversationHistory.filter(m => m.role === 'user');
  const aiMessages = conversationHistory.filter(m => m.role === 'ai');

  // If no user messages
  if (userMessages.length === 0) {
    return {
      overallScore: 50,
      cefrLevel: 'A2',
      fluencyScore: 50,
      grammarScore: 60,
      vocabScore: 50,
      wpm: 0,
      totalWords: 0,
      fillersCount: 0,
      corrections: [],
      suggestedCollocations: scenario.keyVocabulary || [],
      strengths: ["Sẵn sàng bắt đầu buổi học"],
      improvements: ["Hãy mạnh dạn nói nhiều câu hơn trong các phiên tiếp theo."]
    };
  }

  // 1. Text & words metrics
  const allUserText = userMessages.map(m => m.text).join(' ');
  const words = allUserText.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Approximate WPM (words per active speaking minute, estimate 60% of session time or duration)
  const activeMinutes = Math.max(0.5, sessionDurationSeconds / 60);
  const wpm = Math.min(180, Math.round(totalWords / activeMinutes * 1.5));

  // 2. Count filler words
  const fillerRegex = /\b(um|uh|er|ah|like|you know|basically|actually)\b/gi;
  const fillers = allUserText.match(fillerRegex) || [];
  const fillersCount = fillers.length;

  // 3. Vocabulary richness (Unique words ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
  const vocabVarietyRatio = words.length > 0 ? (uniqueWords.size / words.length) : 0;

  // 4. Grammar checks & corrections
  const corrections = [];
  userMessages.forEach(msg => {
    const text = msg.text;
    const lower = text.toLowerCase();

    if (lower.includes('i am agree') || lower.includes("i'm agree")) {
      corrections.push({
        original: text,
        corrected: text.replace(/i am agree/gi, 'I agree').replace(/i'm agree/gi, 'I agree'),
        explanation: "'Agree' là một động từ thường, không cần 'am'. Dùng 'I agree with...' là chuẩn xác.",
        type: 'Grammar'
      });
    } else if (lower.includes('explain me')) {
      corrections.push({
        original: text,
        corrected: text.replace(/explain me/gi, 'explain to me'),
        explanation: "Cấu trúc chuẩn là 'explain something to someone' hoặc 'explain to me'.",
        type: 'Preposition'
      });
    } else if (lower.includes('look forward to see')) {
      corrections.push({
        original: text,
        corrected: text.replace(/look forward to see/gi, 'look forward to seeing'),
        explanation: "Cụm 'look forward to' luôn đi với danh động từ V-ing ('seeing').",
        type: 'Grammar'
      });
    } else if (msg.betterWay && msg.betterWay !== text && msg.grammarNote && !msg.grammarNote.includes('chuẩn xác')) {
      corrections.push({
        original: text,
        corrected: msg.betterWay,
        explanation: msg.grammarNote,
        type: 'Phrasing'
      });
    }
  });

  // If no errors found, add 1-2 native upgrade suggestions
  if (corrections.length === 0 && userMessages.length > 0) {
    const sampleMsg = userMessages[0];
    corrections.push({
      original: sampleMsg.text,
      corrected: sampleMsg.betterWay || `Natural native phrasing: "${sampleMsg.text}"`,
      explanation: "Câu của bạn rất tốt! Bạn có thể làm phong phú hơn bằng cách kết hợp thêm các trạng từ tự nhiên.",
      type: 'Style'
    });
  }

  // 5. Score calculations
  // Fluency score
  let fluencyScore = 75;
  if (wpm >= 90 && wpm <= 140) fluencyScore += 15;
  else if (wpm < 60) fluencyScore -= 15;
  if (fillersCount > 5) fluencyScore -= 10;
  fluencyScore = Math.min(98, Math.max(50, fluencyScore));

  // Grammar score
  let grammarScore = 85 - (corrections.length * 6);
  grammarScore = Math.min(98, Math.max(55, grammarScore));

  // Vocab score
  let vocabScore = 70 + Math.round(vocabVarietyRatio * 30);
  if (totalWords > 80) vocabScore += 8;
  vocabScore = Math.min(98, Math.max(50, vocabScore));

  // Overall Score
  const overallScore = Math.round((fluencyScore * 0.35) + (grammarScore * 0.35) + (vocabScore * 0.3));

  // CEFR Determination
  let cefrLevel = 'B1';
  if (overallScore >= 88) cefrLevel = 'C1';
  else if (overallScore >= 78) cefrLevel = 'B2';
  else if (overallScore >= 65) cefrLevel = 'B1';
  else cefrLevel = 'A2';

  // Strengths and Improvements
  const strengths = [];
  const improvements = [];

  if (fluencyScore >= 80) {
    strengths.push("Tốc độ nói đều đặn, phản xạ tự nhiên không bị gián đoạn dài.");
  } else {
    improvements.push("Tăng tốc độ phản xạ bằng cách tập nói thành cụm từ (chunks) thay vì dịch từng từ.");
  }

  if (grammarScore >= 80) {
    strengths.push("Cấu trúc ngữ pháp vững vàng, chia thì và dùng giới từ chính xác.");
  } else {
    improvements.push("Chú ý các lỗi cơ bản như chia thì động từ và cụm giới từ cố định.");
  }

  if (totalWords >= 60) {
    strengths.push("Phát triển câu trả lời dài và phong phú, biết đưa ra lý do và ví dụ minh họa.");
  } else {
    improvements.push("Mở rộng câu trả lời bằng cách áp dụng công thức P-E-E (Point - Explain - Example).");
  }

  return {
    overallScore,
    cefrLevel,
    fluencyScore,
    grammarScore,
    vocabScore,
    wpm,
    totalWords,
    fillersCount,
    turnsCount: userMessages.length,
    corrections,
    suggestedCollocations: scenario.keyVocabulary || [],
    strengths: strengths.length ? strengths : ["Tích cực tương tác với AI xuyên suốt cuộc đối thoại."],
    improvements: improvements.length ? improvements : ["Tiếp tục mở rộng vốn thành ngữ (idioms) trong ngữ cảnh thực tế."]
  };
}
