import express from 'express';

const router = express.Router();

/**
 * POST /api/chat
 * Body: { scenario, conversationHistory, userUtterance, feedbackStyle }
 */
router.post('/', async (req, res) => {
  try {
    const { scenario = {}, conversationHistory = [], userUtterance = '', feedbackStyle = 'balanced' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!userUtterance || !userUtterance.trim()) {
      return res.status(400).json({ error: 'userUtterance is required' });
    }

    // 1. If Gemini API Key is provided, call Gemini 1.5 Flash
    if (apiKey && apiKey.trim().length > 5 && !apiKey.includes('your_gemini')) {
      try {
        const historyText = conversationHistory
          .slice(-6)
          .map(m => `${m.role === 'ai' ? (scenario.aiRole || 'Coach') : 'Student'}: "${m.text}"`)
          .join('\n');

        const prompt = `
You are an expert English Speaking Coach and roleplayer.
Current Scenario: "${scenario.title || 'Daily Conversation'}"
Role: "${scenario.aiRole || 'English Tutor'}"
Persona Instruction: "${scenario.systemPrompt || 'Encouraging native conversational partner'}"
Feedback Rigor: "${feedbackStyle}"

Recent Conversation:
${historyText}
Student just said: "${userUtterance}"

Analyze the student's utterance and reply strictly in valid JSON matching this schema:
{
  "reply": "Your in-character English response (1 to 3 natural sentences)",
  "betterWay": "How a native English speaker would polish what the student ACTUALLY said (keep their core meaning, make it idiomatic and smooth)",
  "alternativeAnswers": [
    { "style": "🌟 Tự nhiên & Đời thường", "text": "Casual natural response...", "translation": "Vietnamese meaning..." },
    { "style": "💼 Chuyên nghiệp & Điểm cao", "text": "Professional expressive response...", "translation": "Vietnamese meaning..." },
    { "style": "⚡ Ngắn gọn & Súc tích", "text": "Concise punchy response...", "translation": "Vietnamese meaning..." }
  ],
  "grammarNote": "Brief tip/correction in Vietnamese explaining any grammar or vocabulary improvement (max 1-2 short sentences)",
  "scaffoldingHints": [
    "Simple option for beginner",
    "Natural conversational option",
    "Advanced/expressive B2-C1 option"
  ],
  "detectedCEFR": "B1"
}
Output only pure JSON. Do not include markdown code fences or any other text.
`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json'
            }
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawContent) {
            const parsed = JSON.parse(rawContent);
            return res.json({
              reply: parsed.reply,
              betterWay: parsed.betterWay,
              alternativeAnswers: parsed.alternativeAnswers || [],
              grammarNote: parsed.grammarNote,
              scaffoldingHints: parsed.scaffoldingHints || scenario.sampleHints || [],
              detectedCEFR: parsed.detectedCEFR || 'B1',
              isLiveAI: true,
              poweredBy: 'Gemini 1.5 Flash'
            });
          }
        } else {
          console.warn('Gemini API returned error status:', geminiRes.status);
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using intelligent server fallback:', geminiErr.message);
      }
    }

    // 2. Intelligent Server Fallback (When no API key or API temporarily unavailable)
    const fallbackResponse = generateServerFallback({ scenario, userUtterance });
    return res.json({
      ...fallbackResponse,
      isLiveAI: false,
      poweredBy: 'AI English Teacher Smart Engine'
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

function generateServerFallback({ scenario = {}, userUtterance = '' }) {
  const textLower = userUtterance.toLowerCase();
  let betterWay = userUtterance.charAt(0).toUpperCase() + userUtterance.slice(1);
  if (!/[.!?]$/.test(betterWay)) betterWay += '.';

  // Polish
  betterWay = betterWay
    .replace(/\bhaving too many urgent (?:tasks|hearts|things) are the same time\b/gi, 'having too many urgent tasks at the same time')
    .replace(/\bhaving too many urgent tasks at the same time makes me feel quite stressed\b/gi, 'Juggling multiple urgent tasks simultaneously causes me significant stress.')
    .replace(/\bvery stressed\b/gi, 'overwhelmed')
    .replace(/\bi am agree\b/gi, 'I agree')
    .replace(/\bexplain me\b/gi, 'explain to me');

  const alternativeAnswers = [
    {
      style: "🌟 Tự nhiên & Gần gũi",
      text: `In my experience, ${userUtterance.toLowerCase().replace(/[.!?]$/, '')}, which works really well for me.`,
      translation: "Theo kinh nghiệm của tôi, điều này rất phù hợp và hiệu quả với bản thân."
    },
    {
      style: "💼 Chuyên nghiệp & B2-C1",
      text: `From my perspective, ${userUtterance.toLowerCase().replace(/[.!?]$/, '')}, particularly when balancing priorities.`,
      translation: "Từ góc nhìn của tôi, điều này đặc biệt đúng khi cần cân bằng các ưu tiên khác nhau."
    },
    {
      style: "⚡ Ngắn gọn & Trọng tâm",
      text: `Without a doubt, ${userUtterance.toLowerCase().replace(/[.!?]$/, '')}.`,
      translation: "Không nghi ngờ gì nữa, điều này hoàn toàn chuẩn xác."
    }
  ];

  return {
    reply: `That's a very thoughtful point! Could you elaborate a bit more on how that impacts your daily routine?`,
    betterWay,
    alternativeAnswers,
    grammarNote: "Cấu trúc diễn đạt rõ ràng và dễ hiểu.",
    scaffoldingHints: scenario.sampleHints || [
      "In my experience, it has helped me stay organized and proactive.",
      "On a broader scale, it significantly influences how I prioritize my goals.",
      "It definitely opens up new possibilities that I hadn't considered previously."
    ],
    detectedCEFR: userUtterance.length > 40 ? 'B2' : 'B1'
  };
}

export default router;

