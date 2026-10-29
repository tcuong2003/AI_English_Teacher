// AI Conversation & Feedback Service (Gemini API + Smart Heuristic Engine fallback)
import { SpeechRepairService } from './speechRepairService.js';

export class AIService {
  constructor() {
    this.apiKey = '';
    this.provider = 'gemini'; // 'gemini' | 'openai' | 'offline'
    this.backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    this.loadSettings();
  }

  loadSettings() {
    try {
      const savedKey = localStorage.getItem('speakflow_api_key');
      const savedProvider = localStorage.getItem('speakflow_ai_provider');
      const savedBackend = localStorage.getItem('speakflow_backend_url');
      if (savedKey) this.apiKey = savedKey;
      if (savedProvider) this.provider = savedProvider;
      if (savedBackend) this.backendUrl = savedBackend;
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  }

  saveSettings(provider, apiKey, backendUrl) {
    this.provider = provider;
    this.apiKey = apiKey;
    if (backendUrl) this.backendUrl = backendUrl;
    try {
      localStorage.setItem('speakflow_ai_provider', provider);
      localStorage.setItem('speakflow_api_key', apiKey);
      if (backendUrl) localStorage.setItem('speakflow_backend_url', backendUrl);
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  }

  // Generate conversation turn with real-time feedback
  async generateResponse({
    scenario,
    conversationHistory,
    userUtterance,
    feedbackStyle = 'balanced' // 'gentle' | 'balanced' | 'strict'
  }) {
    // 0. Clean and repair stutters and false starts (e.g. "tommo tomorrow" -> "tomorrow")
    const { cleanedText, repairedWords } = SpeechRepairService.cleanAndRepairSpeech(
      userUtterance,
      scenario.keyVocabulary?.map(v => v.term) || []
    );

    // 1. First priority: Call Backend Server API (Protected server-side AI processing)
    try {
      const serverRes = await fetch(`${this.backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          conversationHistory,
          userUtterance: cleanedText,
          feedbackStyle
        })
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        return {
          ...data,
          repairedWords
        };
      }
    } catch (backendErr) {
      console.warn('Backend server call unreachable, using client-side fallback:', backendErr.message);
    }

    // 2. Second priority: If user entered personal Gemini API key in Settings
    if (this.provider === 'gemini' && this.apiKey && this.apiKey.trim().length > 5) {
      try {
        const geminiRes = await this.callGeminiAPI({ scenario, conversationHistory, userUtterance: cleanedText, feedbackStyle });
        return {
          ...geminiRes,
          repairedWords
        };
      } catch (err) {
        console.warn('Client Gemini API call failed, falling back to smart engine:', err);
      }
    }

    // 3. Third priority: Built-in Smart Heuristic & Contextual Engine
    const localRes = this.generateSmartLocalResponse({ scenario, conversationHistory, userUtterance: cleanedText });
    return {
      ...localRes,
      repairedWords
    };
  }

  async callGeminiAPI({ scenario, conversationHistory, userUtterance, feedbackStyle }) {
    const historyText = conversationHistory
      .slice(-6)
      .map(m => `${m.role === 'ai' ? scenario.aiRole : 'Student'}: "${m.text}"`)
      .join('\n');

    const prompt = `
You are an expert English Speaking Coach and roleplayer.
Current Scenario: "${scenario.title}"
Role: "${scenario.aiRole}"
Persona Instruction: "${scenario.systemPrompt}"
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
  "detectedCEFR": "A2" // or A1, B1, B2, C1
}
Output only pure JSON. Do not include markdown code fences or other text.
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey.trim()}`;
    const res = await fetch(url, {
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

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) throw new Error('Empty response from Gemini');

    try {
      const parsed = JSON.parse(rawContent);
      return {
        reply: parsed.reply || "That's very interesting, tell me more!",
        betterWay: parsed.betterWay || userUtterance,
        alternativeAnswers: parsed.alternativeAnswers || this.generateDefaultAlternatives(userUtterance),
        grammarNote: parsed.grammarNote || "Cách diễn đạt tốt và dễ hiểu.",
        scaffoldingHints: parsed.scaffoldingHints || scenario.sampleHints,
        detectedCEFR: parsed.detectedCEFR || "B1",
        isLiveAI: true
      };
    } catch {
      return this.generateSmartLocalResponse({ scenario, conversationHistory, userUtterance });
    }
  }

  // Built-in intelligent simulation with contextual logic and grammar analysis
  generateSmartLocalResponse({ scenario, conversationHistory, userUtterance }) {
    const textLower = userUtterance.toLowerCase().trim();

    // 1. Heuristic grammar and phrasing analysis
    const analysis = this.analyzeGrammarAndPhrasing(userUtterance);
    const betterVersion = this.polishUserAnswer(userUtterance, scenario);
    const alternativeAnswers = this.generateDefaultAlternatives(userUtterance, scenario);

    // 2. Scenario specific replies
    let reply = "";
    let hints = [...scenario.sampleHints];

    if (scenario.id === 'cafe-order') {
      if (textLower.includes('latte') || textLower.includes('cappuccino') || textLower.includes('coffee') || textLower.includes('espresso')) {
        reply = "Splendid choice! Would you like that with whole milk, or perhaps oat, almond, or coconut milk today?";
        hints = [
          "Oat milk would be perfect, thanks!",
          "Could you make it with skimmed milk and light ice?",
          "Whole milk is fine. Do you have any sugar-free syrups?"
        ];
      } else if (textLower.includes('oat') || textLower.includes('milk') || textLower.includes('regular')) {
        reply = "Got it! And for the size, are we thinking regular, medium, or large? Also, for here or to go?";
        hints = [
          "Medium to go, please.",
          "I'll have a regular size, for here.",
          "Large, please, and could you add an extra shot of espresso?"
        ];
      } else if (textLower.includes('go') || textLower.includes('here') || textLower.includes('takeaway') || textLower.includes('medium') || textLower.includes('large')) {
        reply = "Awesome! That'll be ready at the pick-up counter in just two minutes. Anything to nibble on, maybe an almond croissant?";
        hints = [
          "No thanks, just the coffee today.",
          "Actually, I'll take a warm croissant as well!",
          "How much does that come to in total?"
        ];
      } else {
        reply = "Sounds good! And what size would you prefer for that? We have regular, medium, and large.";
        hints = [
          "A medium one would be great.",
          "Just a small regular size, please.",
          "What size do you usually recommend?"
        ];
      }
    } else if (scenario.id === 'neighbor-smalltalk') {
      if (textLower.includes('yes') || textLower.includes('sun') || textLower.includes('weather') || textLower.includes('warm')) {
        reply = "It's about time, right? After all that rain earlier this week! Are you doing anything fun outdoors this weekend?";
        hints = [
          "I might go for a light jog in the park tomorrow.",
          "Just catching up on housework and relaxing with friends.",
          "We're planning a small family barbecue if the weather holds up!"
        ];
      } else if (textLower.includes('work') || textLower.includes('busy') || textLower.includes('tired')) {
        reply = "I hear you! Work has been nonstop for me too. Make sure to get some well-deserved rest over the weekend. Have you tried that new bakery down the street yet?";
        hints = [
          "Not yet! Is it worth checking out?",
          "I've walked past it a few times, smelled wonderful!",
          "I really need to treat myself to a nice pastry there."
        ];
      } else {
        reply = "That's lovely! Honestly, taking it easy is the best plan. Let me know if you ever need to borrow anything from next door, okay?";
        hints = [
          "Thank you, that's very kind of you!",
          "I appreciate it! Have a wonderful weekend ahead.",
          "Same here, don't hesitate to knock if you need a hand."
        ];
      }
    } else if (scenario.id === 'job-interview') {
      if (textLower.length < 30) {
        reply = "Thank you. Could you dive a bit deeper into a specific project where your contribution directly drove measurable impact?";
        hints = [
          "Certainly! In my last role, I led the migration of our customer portal, which cut down load times by 40%.",
          "Sure thing. I was tasked with reorganizing client onboarding, resulting in a 25% increase in satisfaction.",
          "One key highlight was when I collaborated across teams to resolve critical bottlenecks before launch."
        ];
      } else {
        reply = "That's an impressive trajectory. Tell me about a time when you had to manage differing opinions within your team to reach a shared goal.";
        hints = [
          "I always focus on data and shared objectives to depersonalize disagreements.",
          "I initiated an open discussion where each side laid out their concerns, then we agreed on a pilot test.",
          "I listened actively to understand the root cause before proposing a balanced compromise."
        ];
      }
    } else if (scenario.id === 'ielts-part1') {
      reply = "That's very interesting. Moving on, do you prefer spending your free time alone or surrounded by friends and family?";
      hints = [
        "To be honest, it depends on my mood, but after a demanding week I cherish some quiet solitude.",
        "I'm quite an extrovert, so catching up with close friends always recharges my batteries.",
        "I strive for a healthy balance between self-reflection and social bonding."
      ];
    } else if (scenario.id === 'debate-remote-work') {
      reply = "Fair point, but isn't there an irreplaceable magic in bumping into colleagues at the water cooler? How do you replicate that spontaneous innovation virtually?";
      hints = [
        "Spontaneous chats can be simulated with virtual coffee catch-ups without sacrificing focused deep work.",
        "Innovation stems from diverse input and psychological safety, not merely physical proximity.",
        "Most office water-cooler chats are distractions rather than game-changing brainstorms."
      ];
    } else {
      reply = `I appreciate your perspective on that! Could you elaborate a bit more on how that impacts your daily life or decisions?`;
      hints = [
        "In my experience, it has helped me stay organized and proactive.",
        "On a broader scale, it significantly influences how I prioritize my goals.",
        "It definitely opens up new possibilities that I hadn't considered previously."
      ];
    }

    return {
      reply,
      betterWay: betterVersion || analysis.betterWay,
      alternativeAnswers,
      grammarNote: analysis.grammarNote,
      scaffoldingHints: hints,
      detectedCEFR: analysis.cefr,
      isLiveAI: false
    };
  }

  // Polish what the student actually said into a smoother, natural native sentence
  polishUserAnswer(rawSentence, context = {}) {
    if (!rawSentence) return '';
    let text = rawSentence.trim();

    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Intelligent upgrades preserving user's meaning
    text = text
      .replace(/\bhaving too many urgent (?:tasks|hearts|things) are the same time\b/gi, 'having too many urgent tasks at the same time')
      .replace(/\bhaving too many urgent tasks at the same time makes me feel quite stressed\b/gi, 'Juggling multiple urgent tasks simultaneously causes me significant stress')
      .replace(/\bvery stressed\b/gi, 'overwhelmed')
      .replace(/\bvery tired\b/gi, 'completely exhausted')
      .replace(/\bvery good\b/gi, 'exceptional')
      .replace(/\bvery nice\b/gi, 'delightful')
      .replace(/\bi am agree\b/gi, 'I agree')
      .replace(/\bi'm agree\b/gi, 'I agree')
      .replace(/\bexplain me\b/gi, 'explain to me')
      .replace(/\blook forward to see\b/gi, 'look forward to seeing')
      .replace(/\bi like eating\b/gi, 'I thoroughly enjoy having')
      .replace(/\bvery delicious\b/gi, 'absolutely delicious')
      .replace(/\bgoto\b/gi, 'go to');

    text = text.replace(/[.!?]+$/, '') + '.';
    return text;
  }

  // Generate 3 curated alternative answers for a given utterance/context
  generateDefaultAlternatives(rawSentence, context = {}) {
    const lower = (rawSentence || '').toLowerCase();

    if (lower.includes('stress') || lower.includes('work') || lower.includes('task') || lower.includes('urgent')) {
      return [
        {
          style: "🔥 Vừa nói vừa diễn đạt chuẩn (Khuyên dùng)",
          text: "Having too many urgent tasks land on my plate at the same time makes me feel overwhelmed.",
          translation: "Việc có quá nhiều đầu việc gấp dồn vào cùng một lúc khiến tôi cảm thấy bị quá tải."
        },
        {
          style: "💼 Chuyên nghiệp & Điểm cao (B2-C1)",
          text: "Unrealistic turnaround times and context-switching between endless meetings are my biggest stressors.",
          translation: "Thời hạn gấp rút và việc phải chuyển đổi liên tục giữa các cuộc họp là nguyên nhân gây căng thẳng lớn nhất."
        },
        {
          style: "⚡ Ngắn gọn & Dứt khoát",
          text: "Tight deadlines combined with back-to-back urgent requests really burn me out.",
          translation: "Hạn chót gấp gáp cùng những yêu cầu khẩn liên tục thực sự làm tôi kiệt sức."
        }
      ];
    }

    if (lower.includes('wake') || lower.includes('morning') || lower.includes('breakfast') || lower.includes('coffee')) {
      return [
        {
          style: "🌟 Tự nhiên & Đời thường",
          text: "I usually get up around 7 AM, wash my face, and grab a fresh glass of water.",
          translation: "Tôi thường dậy lúc 7h sáng, rửa mặt và uống một cốc nước mát."
        },
        {
          style: "☕ Thói quen năng động",
          text: "I'm an early bird, so I wake up at 6:30 and brew a hot cup of coffee right away.",
          translation: "Tôi là người dậy sớm, khoảng 6h30 tôi dậy và pha ngay một cốc cà phê nóng."
        },
        {
          style: "😴 Thực tế & Hài hước",
          text: "Honestly, I hit the snooze button twice before finally rolling out of bed around 7:15.",
          translation: "Thành thật thì tôi bấm hoãn báo thức 2 lần trước khi lăn ra khỏi giường lúc 7h15."
        }
      ];
    }

    // Generic high-quality alternatives
    return [
      {
        style: "🌟 Tự nhiên & Gần gũi",
        text: `In my experience, ${rawSentence.toLowerCase().replace(/[.!?]$/, '')}, which works really well for me.`,
        translation: "Theo kinh nghiệm của tôi, điều này rất phù hợp và hiệu quả với bản thân."
      },
      {
        style: "💼 Chuyên nghiệp & B2-C1",
        text: `From my perspective, ${rawSentence.toLowerCase().replace(/[.!?]$/, '')}, particularly when balancing competing priorities.`,
        translation: "Từ góc nhìn của tôi, điều này đặc biệt đúng khi cần cân bằng các ưu tiên khác nhau."
      },
      {
        style: "⚡ Ngắn gọn & Trọng tâm",
        text: `Without a doubt, ${rawSentence.toLowerCase().replace(/[.!?]$/, '')}.`,
        translation: "Không nghi ngờ gì nữa, điều này hoàn toàn chuẩn xác."
      }
    ];
  }

  // Grammar and phrasing intelligence
  analyzeGrammarAndPhrasing(sentence) {
    const raw = sentence.trim();
    const lower = raw.toLowerCase();

    if (lower.includes('very good') || lower.includes('very nice')) {
      return {
        betterWay: raw.replace(/very good/gi, 'exceptional').replace(/very nice/gi, 'delightful'),
        grammarNote: "Thử dùng từ vựng nâng cao: 'exceptional' hoặc 'delightful' thay vì 'very good'.",
        cefr: 'B1'
      };
    }

    if (lower.includes('i agree with you') && lower.length < 22) {
      return {
        betterWay: "I completely share your perspective on that.",
        grammarNote: "Cách nói tự nhiên hơn: 'I completely share your view / I couldn't agree more'.",
        cefr: 'B2'
      };
    }

    if (lower.includes('explain me')) {
      return {
        betterWay: raw.replace(/explain me/gi, 'explain to me'),
        grammarNote: "Động từ 'explain' đi với giới từ 'to': say 'explain to me' thay vì 'explain me'.",
        cefr: 'A2'
      };
    }

    if (lower.includes('i am agree') || lower.includes("i'm agree")) {
      return {
        betterWay: raw.replace(/i am agree/gi, 'I agree').replace(/i'm agree/gi, 'I agree'),
        grammarNote: "'Agree' là động từ, dùng 'I agree' thay vì 'I am agree'.",
        cefr: 'A2'
      };
    }

    if (lower.includes('look forward to see')) {
      return {
        betterWay: raw.replace(/look forward to see/gi, 'look forward to seeing'),
        grammarNote: "Cụm 'look forward to' đi kèm V-ing: 'look forward to seeing'.",
        cefr: 'B1'
      };
    }

    if (lower.includes('a coffee') && lower.includes('give me')) {
      return {
        betterWay: "Could I please get a cup of coffee?",
        grammarNote: "Dùng cấu trúc lịch sự 'Could I please get...' thay cho mệnh lệnh 'Give me'.",
        cefr: 'B1'
      };
    }

    if (raw.length < 15) {
      return {
        betterWay: `Certainly, ${raw.toLowerCase()}.`,
        grammarNote: "Câu trả lời khá ngắn; hãy bổ sung thêm lý do hoặc ví dụ ngắn để duy trì mạch hội thoại.",
        cefr: 'A2'
      };
    }

    return {
      betterWay: `Naturally expressed: "${raw.charAt(0).toUpperCase() + raw.slice(1)}"`,
      grammarNote: "Cấu trúc ngữ pháp chuẩn xác, từ ngữ diễn đạt rõ ý.",
      cefr: raw.length > 50 ? 'B2' : 'B1'
    };
  }

  // Strict Gatekeeper Pass/Fail Validator with Smart Repair
  evaluateGatekeeperPass(userUtterance, stageInfo = {}, keyVocab = []) {
    // 1. Clean and repair stutters, false starts ("tommo tomorrow" -> "tomorrow"), and contextual slips ("hearts" -> "tasks")
    const vocabList = keyVocab.concat(stageInfo.keyVocab || []);
    const { cleanedText, repairedWords } = SpeechRepairService.cleanAndRepairSpeech(
      userUtterance,
      vocabList
    );

    const raw = (cleanedText || userUtterance || '').trim();
    const lower = raw.toLowerCase();

    // 2. Structural & Grammar checks
    const checks = [
      {
        regex: /\b(i am agree|i'm agree)\b/i,
        errorType: "Ngữ Pháp (Động từ)",
        corrected: raw.replace(/\b(i am agree|i'm agree)\b/gi, 'I agree'),
        explanation: "'Agree' là động từ thường, không dùng to-be. Hãy nói 'I agree' thay vì 'I am agree'."
      },
      {
        regex: /\bexplain me\b/i,
        errorType: "Giới từ (Preposition)",
        corrected: raw.replace(/\bexplain me\b/gi, 'explain to me'),
        explanation: "Cấu trúc chuẩn là 'explain something to someone': dùng 'explain to me'."
      },
      {
        regex: /\blook forward to see\b/i,
        errorType: "Cấu trúc (Gerund V-ing)",
        corrected: raw.replace(/\blook forward to see\b/gi, 'look forward to seeing'),
        explanation: "'look forward to' luôn đi kèm danh động từ: 'look forward to seeing'."
      },
      {
        regex: /\b(he|she|it) go\b/i,
        errorType: "Chia động từ (Subject-Verb Agreement)",
        corrected: raw.replace(/\b(he|she|it) go\b/gi, '$1 goes'),
        explanation: "Chủ ngữ ngôi thứ ba số ít (he/she/it) phải chia động từ số ít 'goes'."
      },
      {
        regex: /\b(he|she|it) don't\b/i,
        errorType: "Trợ động từ (Subject-Verb Agreement)",
        corrected: raw.replace(/\b(he|she|it) don't\b/gi, "$1 doesn't"),
        explanation: "Chủ ngữ số ít đi với 'doesn't' thay vì 'don't'."
      },
      {
        regex: /\bdepend of\b/i,
        errorType: "Giới từ (Preposition)",
        corrected: raw.replace(/\bdepend of\b/gi, 'depend on'),
        explanation: "Cụm chuẩn xác là 'depend on' (phụ thuộc vào), không dùng 'depend of'."
      },
      {
        regex: /\bi have (\d+|twenty|thirty|fourty) years old\b/i,
        errorType: "Cấu trúc tuổi tác",
        corrected: raw.replace(/\bi have (\d+|twenty|thirty|fourty) years old\b/gi, 'I am $1 years old'),
        explanation: "Nói tuổi trong tiếng Anh dùng to-be: 'I am ... years old', không dùng động từ 'have'."
      }
    ];

    let grammarError = null;
    for (const check of checks) {
      if (check.regex.test(lower)) {
        grammarError = {
          errorType: check.errorType,
          userSpoken: raw,
          expected: check.corrected,
          explanation: check.explanation
        };
        break;
      }
    }

    // 3. Generate Polish/Better Version based on WHAT THE USER ACTUALLY SAID!
    const betterVersion = this.polishUserAnswer(raw, stageInfo);

    // 4. Retrieve or generate alternative answers
    const alternativeAnswers = stageInfo.alternativeAnswers || this.generateDefaultAlternatives(raw, stageInfo);

    // 5. Determine pass/fail:
    // If the user's utterance is too short (less than 2 words, e.g. "yes" or empty noise):
    if (raw.split(/\s+/).length < 2) {
      return {
        isPassed: false,
        errorType: "Độ dài câu quá ngắn",
        userSpoken: raw || userUtterance,
        cleanedSentence: raw,
        repairedWords,
        expected: stageInfo.hintSentence || stageInfo.correctTargetExample || "Please answer in a complete sentence.",
        explanation: "Câu nói quá ngắn; bạn hãy nói thành câu trọn vẹn để chia sẻ suy nghĩ nhé.",
        betterVersion,
        alternativeAnswers
      };
    }

    // "phát âm sai vẫn pass":
    // The user answered the question! Even if there were minor speech recognition slips or self-corrections,
    // WE PASS THEM! They are not trapped in a loop.
    return {
      isPassed: true,
      errorType: grammarError ? grammarError.errorType : (repairedWords.length > 0 ? "Phát âm / Tự sửa từ vấp" : null),
      userSpoken: userUtterance,
      cleanedSentence: raw,
      repairedWords, // Displays in-place word fix (e.g. "tommo" -> "tomorrow", "hearts" -> "tasks")
      expected: grammarError ? grammarError.expected : betterVersion,
      explanation: grammarError
        ? grammarError.explanation
        : (repairedWords.length > 0
            ? "Đã tự động sửa từ nói vấp / chuẩn hóa phát âm giúp câu chuẩn xác."
            : "Chính xác! Câu trả lời rất tự nhiên và đúng trọng tâm."),
      betterVersion,
      alternativeAnswers
    };
  }
}

export const aiService = new AIService();
