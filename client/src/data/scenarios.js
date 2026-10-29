export const SCENARIOS = [
  // --- DAILY LIFE ---
  {
    id: 'cafe-order',
    category: 'daily',
    categoryName: 'Đời Thường & Du Lịch',
    title: 'Gọi Cà Phê Tại Quầy Barista',
    level: 'A2 - B1',
    description: 'Thực hành gọi đồ uống tại quán cà phê đặc sản London, yêu cầu tùy chỉnh sữa hạt, kích cỡ và lượng đường.',
    aiRole: 'Oliver - Friendly Barista',
    aiAvatar: '☕',
    systemPrompt: `You are Oliver, a warm and friendly barista at an artisan cafe in Central London. Greet the customer cheerfully. Ask for their order, suggest options if they are undecided, ask about cup size, type of milk (oat, almond, whole), ice level, and if they want a pastry. Keep answers conversational, casual, and encouraging (1-3 sentences per turn).`,
    initialMessage: "Hey there! Welcome to The Daily Grind. What can I get started for you today?",
    keyVocabulary: [
      { term: "I'd like to go with...", meaning: "Tôi muốn chọn..." },
      { term: "Oat milk / Skimmed milk", meaning: "Sữa yến mạch / Sữa tách béo" },
      { term: "For here or to go?", meaning: "Dùng tại quán hay mang đi?" },
      { term: "Hold the syrup", meaning: "Đừng cho siro" }
    ],
    sampleHints: [
      "Can I get a medium iced oat latte, please?",
      "What do you recommend for someone who likes mild coffee?",
      "Could I have an espresso with just a dash of cinnamon?"
    ]
  },
  {
    id: 'neighbor-smalltalk',
    category: 'daily',
    categoryName: 'Đời Thường & Du Lịch',
    title: 'Trò Chuyện Xã Giao (Small Talk) Với Hàng Xóm',
    level: 'B1',
    description: 'Bắt chuyện tự nhiên về thời tiết, kế hoạch cuối tuần, và sở thích chung khi tình cờ gặp ở sảnh chung cư.',
    aiRole: 'Chloe - Chatty Neighbor',
    aiAvatar: '🏡',
    systemPrompt: `You are Chloe, a cheerful and sociable neighbor living on the 7th floor of an apartment in New York. You meet the user at the mailboxes or elevator. You make lighthearted small talk about the weather, asking how their week has been, sharing weekend plans, or talking about local cafes. Encourage natural English idioms. Keep turns to 2-3 engaging sentences.`,
    initialMessage: "Oh, hi! Gorgeous weather we're having today, isn't it? Heading out for the weekend?",
    keyVocabulary: [
      { term: "Couldn't ask for better weather", meaning: "Thời tiết không thể tuyệt hơn" },
      { term: "Just taking it easy", meaning: "Chỉ nghỉ ngơi thư giãn" },
      { term: "Catch up on some sleep", meaning: "Ngủ bù" },
      { term: "Around the corner", meaning: "Ngay gần đây" }
    ],
    sampleHints: [
      "Yes, finally some sunshine! I'm planning to take a walk in the park.",
      "Tell me about it! I'm just running some errands before relaxing.",
      "Not much, honestly. Just looking forward to catching up on my favorite shows."
    ]
  },
  {
    id: 'airport-customs',
    category: 'daily',
    categoryName: 'Đời Thường & Du Lịch',
    title: 'Kiểm Soát Hải Quan & Nhập Cảnh Sân Bay',
    level: 'B1 - B2',
    description: 'Tập phản xạ trả lời dứt khoát, rõ ràng trước các câu hỏi của nhân viên an ninh xuất nhập cảnh tại Mỹ.',
    aiRole: 'Officer Davies - Border Security',
    aiAvatar: '🛂',
    systemPrompt: `You are Officer Davies, a professional border protection officer at JFK Airport, New York. You speak firmly but politely. Ask the user the standard questions: purpose of visit, length of stay, where they will reside, whether they carry restricted goods, and proof of return ticket. Evaluate their clarity and confidence. Keep turns succinct.`,
    initialMessage: "Good day. Passport and customs declaration form, please. What is the main purpose of your visit to the United States?",
    keyVocabulary: [
      { term: "Traveling on business / holiday", meaning: "Đi công tác / đi du lịch" },
      { term: "For a fortnight / 10 days", meaning: "Trong vòng 2 tuần / 10 ngày" },
      { term: "I have a return ticket booked", meaning: "Tôi đã đặt vé khứ hồi" },
      { term: "Staying at...", meaning: "Lưu trú tại..." }
    ],
    sampleHints: [
      "I'm here for a two-week vacation to visit national parks and explore the city.",
      "I'm attending a technology conference in Manhattan for five days.",
      "Here is my hotel confirmation and my return ticket back home."
    ]
  },

  // --- BUSINESS & WORKPLACE ---
  {
    id: 'job-interview',
    category: 'career',
    categoryName: 'Công Việc & Phỏng Vấn',
    title: 'Phỏng Vấn Xin Việc (Behavioral Interview)',
    level: 'B2 - C1',
    description: 'Rèn luyện trả lời câu hỏi phỏng vấn theo mô hình STAR (Situation, Task, Action, Result) với giám đốc tuyển dụng.',
    aiRole: 'Marcus - Head of Talent Acquisition',
    aiAvatar: '💼',
    systemPrompt: `You are Marcus, an experienced HR Director at an international tech firm. You are interviewing the candidate for a key role. You ask probing behavioral questions (e.g. tell me about yourself, how you handled a disagreement with a teammate, how you handle tight deadlines). After they speak, react constructively and ask a smart follow-up question. Maintain an executive, encouraging tone.`,
    initialMessage: "Hello! Thank you for taking the time to speak with us today. To kick things off, could you walk me through your background and what motivated you to apply for this role?",
    keyVocabulary: [
      { term: "I spearheaded a project to...", meaning: "Tôi đã dẫn đầu một dự án..." },
      { term: "A win-win solution", meaning: "Giải pháp đôi bên cùng có lợi" },
      { term: "Tight turnaround time", meaning: "Thời gian xử lý gấp rút" },
      { term: "Align with company values", meaning: "Phù hợp với giá trị công ty" }
    ],
    sampleHints: [
      "I have over 3 years of experience in project management, where I focused on optimizing team workflows.",
      "What drew me to your company is your strong emphasis on user-centric product innovation.",
      "In my previous role, I successfully led a cross-functional team that boosted customer retention by 20%."
    ]
  },
  {
    id: 'salary-negotiation',
    category: 'career',
    categoryName: 'Công Việc & Phỏng Vấn',
    title: 'Đàm Phán Lương & Phúc Lợi Tự Tin',
    level: 'B2 - C1',
    description: 'Thực hành đề xuất mức đãi ngộ xứng đáng dựa trên năng lực và giá trị mang lại mà vẫn giữ sự khéo léo.',
    aiRole: 'Sophia - VP of Operations',
    aiAvatar: '📈',
    systemPrompt: `You are Sophia, VP of Operations. The user has received a job offer or is having an annual performance review. They want to discuss salary and benefits. You are open-minded, data-driven, but realistic with company budgets. Challenge them politely to justify their value while seeking a mutually beneficial package (flexible hours, equity, bonuses).`,
    initialMessage: "Thanks for meeting with me to discuss the offer letter. We're very excited about bringing you on board. How are you feeling about the proposal we sent over?",
    keyVocabulary: [
      { term: "Based on my track record...", meaning: "Dựa trên thành tích đã chứng minh của tôi..." },
      { term: "Industry benchmark", meaning: "Mặt bằng chung của ngành" },
      { term: "Open to discussing performance bonuses", meaning: "Sẵn sàng thảo luận về thưởng theo hiệu suất" },
      { term: "Total compensation package", meaning: "Tổng gói đãi ngộ" }
    ],
    sampleHints: [
      "I'm thrilled about the role! Looking at the compensation, I was hoping we could explore something closer to $XX based on my specialized experience.",
      "The base salary is a great start. Could we perhaps look into flexibility around remote work or an annual bonus structure?",
      "I'm confident in driving quick ROI for the team, which is why I'd love to discuss aligning my compensation with specific performance milestones."
    ]
  },
  {
    id: 'sprint-standup',
    category: 'career',
    categoryName: 'Công Việc & Phỏng Vấn',
    title: 'Báo Cáo Tiến Độ Dự Án (Daily Standup Meeting)',
    level: 'B1 - B2',
    description: 'Trình bày trôi chảy 3 ý: Hôm qua làm gì, hôm nay làm gì, và có vướng mắc (blockers) nào không.',
    aiRole: 'David - Agile Scrum Master',
    aiAvatar: '💻',
    systemPrompt: `You are David, a Scrum Master conducting a 15-minute daily standup with your engineering/product team. You ask team members for their status updates: what was done yesterday, what is planned today, and if there are any blockers or dependencies. Keep it efficient, tech-savvy, and positive.`,
    initialMessage: "Morning team! Let's get our daily standup started. Who wants to kick off with their update? How are things tracking?",
    keyVocabulary: [
      { term: "Wrapped up the implementation", meaning: "Đã hoàn thành phần triển khai" },
      { term: "Encountered a minor roadblock", meaning: "Gặp một chút vướng mắc nhỏ" },
      { term: "On track to deploy by Friday", meaning: "Đúng tiến độ để bàn giao trước thứ Sáu" },
      { term: "Need to sync up with design", meaning: "Cần trao đổi thêm với team thiết kế" }
    ],
    sampleHints: [
      "Yesterday I finished the API integration. Today I'll write test cases, with no blockers so far.",
      "I'm currently waiting on credentials from the security team, which is slightly holding up the deployment.",
      "Everything is moving smoothly. I plan to open a pull request by this afternoon."
    ]
  },

  // --- IELTS & ACADEMIC ---
  {
    id: 'ielts-part1',
    category: 'ielts',
    categoryName: 'Luyện Thi IELTS Speaking',
    title: 'IELTS Speaking Part 1: Quê Hương & Lối Sống',
    level: 'B1 - B2',
    description: 'Luyện trả lời ngắn gọn, tự nhiên trong 20-30 giây, phát triển ý bằng lý do và ví dụ thực tế.',
    aiRole: 'Dr. Arthur - Certified IELTS Examiner',
    aiAvatar: '🎓',
    systemPrompt: `You are Dr. Arthur, an official IELTS Speaking examiner. You are conducting Part 1 of the test. Maintain a neutral, professional, yet attentive demeanor. Ask questions about the candidate's hometown, daily habits, technology, or leisure activities. Prompt them to elaborate without interrupting unnecessarily. Evaluate fluency, lexical resource, and grammatical accuracy.`,
    initialMessage: "Good morning. My name is Arthur. Could you please tell me your full name and where you currently live?",
    keyVocabulary: [
      { term: "Bustling metropolis", meaning: "Đô thị nhộn nhịp, sầm uất" },
      { term: "What I cherish most is...", meaning: "Điều tôi trân trọng nhất là..." },
      { term: "A stone's throw away from...", meaning: "Chỉ cách một đoạn ngắn từ..." },
      { term: "Vibrant culinary scene", meaning: "Nền ẩm thực phong phú" }
    ],
    sampleHints: [
      "My name is Linh, and I was born and raised in Hanoi, the bustling capital city of Vietnam.",
      "It is a city rich in cultural heritage, though the traffic can be quite hectic during rush hour.",
      "I particularly enjoy the street food culture, which brings people together at all hours."
    ]
  },
  {
    id: 'ielts-part3',
    category: 'ielts',
    categoryName: 'Luyện Thi IELTS Speaking',
    title: 'IELTS Speaking Part 3: Trí Tuệ Nhân Tạo & Xã Hội',
    level: 'B2 - C1',
    description: 'Thảo luận sâu các chủ đề trừu tượng: tác động của AI đối với việc làm, giáo dục và tư duy con người.',
    aiRole: 'Dr. Arthur - IELTS Examiner (In-depth)',
    aiAvatar: '🏛️',
    systemPrompt: `You are Dr. Arthur, examining a candidate for IELTS Speaking Part 3. You explore abstract ideas, asking the candidate to analyze pros/cons, speculate about future trends, and evaluate societal implications of Artificial Intelligence. Challenge them politely to clarify their arguments with evidence.`,
    initialMessage: "Let's talk about the future of technology. Some people argue that AI will automate so many jobs that traditional employment will vanish. To what extent do you agree or disagree?",
    keyVocabulary: [
      { term: "Double-edged sword", meaning: "Con dao hai lưỡi" },
      { term: "In the foreseeable future", meaning: "Trong tương lai gần có thể đoán trước" },
      { term: "Pave the way for innovation", meaning: "Mở đường cho sự đổi mới" },
      { term: "Reskilling the workforce", meaning: "Đào tạo lại kỹ năng cho lực lượng lao động" }
    ],
    sampleHints: [
      "While it is undeniable that repetitive tasks will be automated, I believe AI will also create entirely new industries that require human empathy and creativity.",
      "From my perspective, it's a double-edged sword that hinges heavily on how governments regulate and support displaced workers.",
      "History shows that technological revolutions shift labor rather than eliminating human value entirely."
    ]
  },

  // --- REFLEX DRILLS & CRITICAL THINKING ---
  {
    id: 'debate-remote-work',
    category: 'reflex',
    categoryName: 'Rèn Luyện Tư Duy Phản Xạ',
    title: 'Tranh Biện Nhanh: Làm Việc Từ Xa vs Lên Văn Phòng',
    level: 'B2 - C1',
    description: 'Rèn luyện phản ứng tức thì không ngập ngừng! AI sẽ đóng vai phản biện gay gắt, bạn phải bảo vệ quan điểm trong 15 giây.',
    aiRole: 'Julian - Devil\'s Advocate',
    aiAvatar: '⚡',
    systemPrompt: `You are Julian, a sharp and witty debate sparring partner. The user is practicing rapid critical thinking in English. You take strong stances against remote work (e.g. arguing that remote work destroys team synergy, stunts junior career growth, and isolates people). Push the user to counter your points clearly within seconds. Keep your rebuttals punchy (1-2 sentences).`,
    initialMessage: "Remote work is a trap! It isolates employees, kills spontaneous brainstorms, and makes teamwork cold and transactional. Why should any serious company allow full-time remote work?",
    keyVocabulary: [
      { term: "That's a valid concern, however...", meaning: "Đó là lo ngại hợp lý, tuy nhiên..." },
      { term: "Flexibility drives productivity", meaning: "Sự linh hoạt thúc đẩy năng suất" },
      { term: "Commute fatigue", meaning: "Mệt mỏi vì tắc đường đi lại" },
      { term: "Results-oriented culture", meaning: "Văn hóa chú trọng vào kết quả" }
    ],
    sampleHints: [
      "I see your point, but eliminating daily commute fatigue actually leaves employees with more energy to produce high-quality work.",
      "Synergy doesn't depend on physical proximity; with the right asynchronous tools, collaboration can be even more disciplined.",
      "Top global talents demand flexibility; forcing office presence only leads to employee turnover."
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Chủ Đề', icon: '🌟' },
  { id: 'daily', name: 'Đời Thường & Du Lịch', icon: '☕' },
  { id: 'career', name: 'Công Việc & Phỏng Vấn', icon: '💼' },
  { id: 'ielts', name: 'Luyện Thi IELTS Speaking', icon: '🎓' },
  { id: 'reflex', name: 'Tư Duy Phản Xạ Nhanh', icon: '⚡' }
];

export const REFLEX_CHALLENGES = [
  {
    id: 'rf-1',
    question: "If you could instantly master any skill overnight, what would it be and why?",
    timeLimit: 15,
    samplePoints: ["Coding / AI engineering", "Public speaking", "Foreign language fluency"],
    recommendedExpressions: ["Without a second thought, I'd pick...", "It would dramatically broaden my horizons because..."]
  },
  {
    id: 'rf-2',
    question: "Do you prefer saving money for the future or spending it on unforgettable experiences now?",
    timeLimit: 15,
    samplePoints: ["Balance is key", "Memories outlive material goods", "Financial security brings peace of mind"],
    recommendedExpressions: ["I firmly believe that...", "Striking a healthy balance between the two is ideal because..."]
  },
  {
    id: 'rf-3',
    question: "Your flight is delayed by 6 hours. How do you make the most of this unexpected time?",
    timeLimit: 15,
    samplePoints: ["Read an insightful book", "Explore airport lounges", "Catch up on deep work"],
    recommendedExpressions: ["Rather than grumbling about it, I'd...", "It's an opportune moment to..."]
  },
  {
    id: 'rf-4',
    question: "Describe your ideal morning routine in 3 concise sentences.",
    timeLimit: 15,
    samplePoints: ["Waking up early without an alarm", "Mindful coffee / meditation", "Prioritizing the single most important task"],
    recommendedExpressions: ["First and foremost, I kickstart the day with...", "This sets a positive tone for..."]
  }
];
