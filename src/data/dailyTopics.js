// Daily Topics library with levels, 5-10 min guided conversation milestones,
// and curated native alternative answers for each stage.

export const DAILY_TOPICS = [
  // --- LEVEL: A1 - A2 (CƠ BẢN) ---
  {
    id: 'daily-morning-routine',
    level: 'beginner',
    levelName: 'Cơ Bản (A1 - A2)',
    title: 'Thói Quen Buổi Sáng & Bắt Đầu Ngày Mới',
    targetMinutes: 5,
    description: 'Thực hành kể về các hoạt động buổi sáng của bạn: thức dậy, bữa sáng, đi làm/đi học và cảm xúc đầu ngày.',
    aiCoach: {
      name: 'Emma',
      role: 'American Conversation Partner',
      gender: 'female',
      avatar: '👩‍🏫'
    },
    stages: [
      {
        id: 1,
        stageName: 'Khởi động (Warm-up)',
        question: "Good morning! What time do you usually wake up, and what is the very first thing you do?",
        keyVocab: ["Wake up at...", "Brush my teeth", "A cup of warm coffee", "Hit the snooze button"],
        correctTargetExample: "I usually wake up at 7 AM and have a glass of water.",
        hintSentence: "I usually wake up at 7 o'clock and wash my face.",
        alternativeAnswers: [
          {
            style: "🌟 Tự nhiên & Đơn giản",
            text: "I usually get up around 7 AM, wash my face, and grab a fresh glass of water.",
            translation: "Tôi thường dậy lúc 7h sáng, rửa mặt và uống một cốc nước mát."
          },
          {
            style: "☕ Thói quen cà phê",
            text: "I'm an early bird, so I wake up at 6:30 and brew a hot cup of coffee right away.",
            translation: "Tôi là người dậy sớm, khoảng 6h30 tôi dậy và pha ngay một cốc cà phê nóng."
          },
          {
            style: "😴 Thực tế & Hài hước",
            text: "Honestly, I hit the snooze button twice before finally rolling out of bed around 7:15.",
            translation: "Thành thật thì tôi bấm hoãn báo thức 2 lần trước khi lăn ra khỏi giường lúc 7h15."
          }
        ]
      },
      {
        id: 2,
        stageName: 'Bữa sáng & Năng lượng',
        question: "What do you normally enjoy having for breakfast to give you energy for the day?",
        keyVocab: ["A hearty breakfast", "Scrambled eggs", "A quick sandwich", "Noodle soup"],
        correctTargetExample: "I enjoy eating a warm bowl of pho or toast with eggs.",
        hintSentence: "I like to eat bread with eggs and drink hot tea.",
        alternativeAnswers: [
          {
            style: "🍜 Món truyền thống",
            text: "A steaming bowl of beef pho or a warm banh mi is my favorite morning fuel.",
            translation: "Một bát phở bò nóng hổi hoặc bánh mì ấm giòn là bữa sáng nạp năng lượng yêu thích của tôi."
          },
          {
            style: "🥗 Nhẹ nhàng & Healthy",
            text: "I keep it light with some oatmeal, Greek yogurt, and a handful of fresh berries.",
            translation: "Tôi ăn nhẹ nhàng với yến mạch, sữa chua Hy Lạp và một ít quả mọng tươi."
          },
          {
            style: "⚡ Nhanh gọn khi bận rộn",
            text: "When I'm in a rush, I just grab a toast with peanut butter and an iced Americano.",
            translation: "Khi vội, tôi chỉ lấy bánh mì phết bơ đậu phộng và một cốc Americano đá."
          }
        ]
      },
      {
        id: 3,
        stageName: 'Chuẩn bị & Đi lại',
        question: "How do you commute to work or school, and how long does the trip take you?",
        keyVocab: ["Commute by motorbike", "Take the bus", "Get stuck in traffic", "It takes about..."],
        correctTargetExample: "I ride my motorbike to work, and it usually takes about twenty minutes.",
        hintSentence: "I go to work by motorbike, and it takes about 15 minutes.",
        alternativeAnswers: [
          {
            style: "🛵 Đi xe máy",
            text: "I ride my motorbike through the morning rush hour, which takes roughly 20 minutes.",
            translation: "Tôi đi xe máy qua giờ cao điểm buổi sáng, mất khoảng 20 phút."
          },
          {
            style: "🚌 Phương tiện công cộng",
            text: "I catch the bus, which gives me half an hour to listen to music or read news.",
            translation: "Tôi đi xe buýt, có nửa tiếng để nghe nhạc hoặc đọc tin tức."
          },
          {
            style: "💻 Làm việc từ xa",
            text: "I actually work remotely from home, so my commute is just a quick walk to my desk!",
            translation: "Tôi làm việc từ xa tại nhà nên việc đi lại chỉ là bước vài bước đến bàn làm việc!"
          }
        ]
      }
    ]
  },
  {
    id: 'daily-favorite-food',
    level: 'beginner',
    levelName: 'Cơ Bản (A1 - A2)',
    title: 'Món Ăn Yêu Thích & Nấu Nướng',
    targetMinutes: 5,
    description: 'Luyện tập nói về ẩm thực, thói quen ăn uống tại nhà hoặc đi ăn ngoài cùng bạn bè.',
    aiCoach: {
      name: 'Emma',
      role: 'American Conversation Partner',
      gender: 'female',
      avatar: '👩‍🍳'
    },
    stages: [
      {
        id: 1,
        stageName: 'Món ăn yêu thích',
        question: "What is your absolute favorite comfort food, and why do you love it so much?",
        keyVocab: ["Comfort food", "Savory and flavorful", "Reminds me of home", "Crispy"],
        correctTargetExample: "My favorite food is grilled pork with rice because it is savory and delicious.",
        hintSentence: "My favorite dish is fried chicken because it is very crispy and tasty.",
        alternativeAnswers: [
          {
            style: "🌟 Tự nhiên & Đậm đà",
            text: "My go-to comfort food is broken rice with grilled pork because it's packed with flavor.",
            translation: "Món ruột của tôi là cơm tấm sườn nướng vì vị rất đậm đà và thơm ngon."
          },
          {
            style: "🍲 Ấm lòng gia đình",
            text: "I love homemade chicken soup because it instantly comforts me on cold rainy days.",
            translation: "Tôi thích súp gà nấu ở nhà vì nó sưởi ấm tâm hồn vào những ngày mưa lạnh."
          },
          {
            style: "🍕 Giới trẻ / Tiện lợi",
            text: "Hands down, thin-crust pizza with melted mozzarella cheese is my all-time favorite.",
            translation: "Chắc chắn là pizza đế mỏng với phô mai mozzarella béo ngậy là món khoái khẩu số một của tôi."
          }
        ]
      },
      {
        id: 2,
        stageName: 'Nấu nướng tại nhà',
        question: "Do you prefer cooking meals at home or ordering takeout from restaurants?",
        keyVocab: ["Home-cooked meal", "Save money", "Order delivery", "Nutritious and fresh"],
        correctTargetExample: "I prefer cooking at home because it is healthier and saves money.",
        hintSentence: "I like cooking at home because home-cooked food is healthier.",
        alternativeAnswers: [
          {
            style: "🍳 Thích nấu tại nhà",
            text: "I definitely prefer home-cooked meals because I can control the ingredients and eat healthily.",
            translation: "Tôi chắc chắn thích nấu ở nhà hơn vì có thể kiểm soát nguyên liệu và ăn uống lành mạnh."
          },
          {
            style: "🛵 Tiện lợi khi bận rộn",
            text: "During busy workdays, ordering food delivery saves me precious time and effort.",
            translation: "Trong những ngày bận rộn, đặt đồ ăn giao tận nơi giúp tôi tiết kiệm thời gian và công sức quý báu."
          },
          {
            style: "⚖️ Cân bằng cả hai",
            text: "I strike a balance: I cook healthy dishes on weekdays and treat myself to restaurants on weekends.",
            translation: "Tôi cân bằng cả hai: nấu ăn trong tuần và tự thưởng ăn ngoài vào cuối tuần."
          }
        ]
      }
    ]
  },

  // --- LEVEL: B1 - B2 (TRUNG CẤP) ---
  {
    id: 'daily-work-stress',
    level: 'intermediate',
    levelName: 'Trung Cấp (B1 - B2)',
    title: 'Cân Bằng Cuộc Sống & Xả Stress Công Việc',
    targetMinutes: 10,
    description: 'Bàn luận về cách đối mặt với áp lực công việc, tìm kiếm sự cân bằng (Work-life balance) và thư giãn.',
    aiCoach: {
      name: 'Oliver',
      role: 'British Professional Mentor',
      gender: 'male',
      avatar: '👨‍💼'
    },
    stages: [
      {
        id: 1,
        stageName: 'Nguồn gốc áp lực',
        question: "Work and studies can often be overwhelming. What typically causes you the most stress during a busy week?",
        keyVocab: ["Tight deadlines", "Heavy workload", "Burnout", "Endless meetings", "urgent tasks"],
        correctTargetExample: "Tight deadlines and constant notifications often cause me the most anxiety.",
        hintSentence: "Having too many urgent tasks at the same time makes me feel quite stressed.",
        alternativeAnswers: [
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
            style: "📱 Áp lực thông báo & Tin nhắn",
            text: "The barrage of non-stop Slack pings and urgent client emails makes it hard to maintain deep focus.",
            translation: "Những tiếng chuông thông báo và email khẩn liên tục khiến tôi rất khó tập trung sâu."
          }
        ]
      },
      {
        id: 2,
        stageName: 'Phương pháp xả stress',
        question: "When you feel completely exhausted after work, what activities help you recharge your mental batteries?",
        keyVocab: ["Unwind after work", "Recharge my batteries", "Hit the gym", "Mindfulness"],
        correctTargetExample: "Going for a run in the evening helps me clear my mind and unwind completely.",
        hintSentence: "Listening to acoustic music and taking a walk helps me recharge my energy.",
        alternativeAnswers: [
          {
            style: "🏃 Thể thao & Vận động",
            text: "Hitting the gym or going for a 5k run helps me sweat off all the mental fatigue.",
            translation: "Đến phòng gym hoặc chạy bộ 5km giúp tôi giải tỏa hết sự mệt mỏi về tinh thần."
          },
          {
            style: "🎧 Nhạc êm dịu & Thư giãn",
            text: "I put on noise-cancelling headphones with some acoustic lo-fi music and sip herbal tea.",
            translation: "Tôi đeo tai nghe chống ồn nghe nhạc acoustic lo-fi và nhâm nhi trà thảo mộc."
          },
          {
            style: "🌿 Thiên nhiên & Đi dạo",
            text: "Taking a leisurely walk in the nearby park without looking at my phone refreshes my mind.",
            translation: "Đi dạo thong thả ở công viên gần nhà mà không dùng điện thoại giúp tâm trí tôi tươi mới lại."
          }
        ]
      },
      {
        id: 3,
        stageName: 'Ranh giới công việc',
        question: "Do you find it easy to disconnect from work messages on the weekend, or do you still check emails?",
        keyVocab: ["Draw a clear line", "Disconnect completely", "Work-life balance", "Resist the urge"],
        correctTargetExample: "I try to draw a clear boundary and avoid checking work emails on Sundays.",
        hintSentence: "I turn off work notifications so I can spend quality time with my family.",
        alternativeAnswers: [
          {
            style: "🔕 Ranh giới rõ ràng",
            text: "I draw a firm line: all work notifications are silenced on Friday evening until Monday morning.",
            translation: "Tôi vạch ranh giới dứt khoát: tắt toàn bộ thông báo công việc từ tối thứ Sáu đến sáng thứ Hai."
          },
          {
            style: "😅 Thực tế khó dứt điểm",
            text: "I try to disconnect, but honestly I still catch myself glancing at emails when my phone buzzes.",
            translation: "Tôi cố ngắt kết nối, nhưng thú thật thỉnh thoảng vẫn liếc nhìn email mỗi khi điện thoại rung."
          },
          {
            style: "👨‍👩‍👧 Dành cho gia đình",
            text: "I prioritize quality time with my loved ones, so work strictly stays out of my weekend schedule.",
            translation: "Tôi ưu tiên thời gian bên người thân nên công việc tuyệt đối không có chỗ vào cuối tuần."
          }
        ]
      }
    ]
  },
  {
    id: 'daily-travel-memories',
    level: 'intermediate',
    levelName: 'Trung Cấp (B1 - B2)',
    title: 'Hành Trình Du Lịch Đáng Nhớ Nhất',
    targetMinutes: 10,
    description: 'Kể lại một chuyến đi đáng nhớ, những trải nghiệm văn hóa thú vị và bài học bạn rút ra.',
    aiCoach: {
      name: 'Oliver',
      role: 'British Professional Mentor',
      gender: 'male',
      avatar: '🧭'
    },
    stages: [
      {
        id: 1,
        stageName: 'Điểm đến khó quên',
        question: "Could you tell me about the most unforgettable destination you have ever visited?",
        keyVocab: ["Breathtaking scenery", "Rich cultural heritage", "Off the beaten path", "Hospitality"],
        correctTargetExample: "The trip to Da Lat was unforgettable due to its misty hills and cool weather.",
        hintSentence: "I visited Da Nang two years ago and the beach was breathtaking.",
        alternativeAnswers: [
          {
            style: "🏞️ Cảnh đẹp & Thiên nhiên",
            text: "My trip to Ha Giang was extraordinary because of the dramatic mountain passes and ethnic culture.",
            translation: "Chuyến đi Hà Giang thật phi thường nhờ những con đèo hùng vĩ và văn hóa bản địa."
          },
          {
            style: "🏖️ Biển xanh & Nắng ấm",
            text: "I visited Da Nang last summer; the pristine beaches and mouth-watering seafood blew me away.",
            translation: "Tôi đến Đà Nẵng mùa hè trước; bãi biển trong xanh và hải sản tuyệt ngon làm tôi mê mẩn."
          },
          {
            style: "🏰 Cổ kính & Di sản",
            text: "Hoi An Ancient Town at night with glowing lanterns is the most magical place I've ever experienced.",
            translation: "Phố cổ Hội An ban đêm lung linh ánh đèn lồng là nơi huyền ảo nhất tôi từng trải nghiệm."
          }
        ]
      },
      {
        id: 2,
        stageName: 'Sự cố bất ngờ',
        question: "Traveling rarely goes 100% according to plan. Did you encounter any unexpected surprises or hurdles?",
        keyVocab: ["A hiccup along the way", "Missed a connecting flight", "Lost my way", "Turned into an adventure"],
        correctTargetExample: "We got caught in a sudden tropical storm, but it turned into a hilarious memory.",
        hintSentence: "We lost our way at night, but a local resident kindly helped us find the hotel.",
        alternativeAnswers: [
          {
            style: "🌧️ Cơn mưa bất chợt",
            text: "A sudden torrential downpour soaked us completely, but sharing hot tea under a shelter became our fondest memory.",
            translation: "Cơn mưa rào bất chợt làm chúng tôi ướt sũng, nhưng cùng trú mưa uống trà nóng lại thành kỷ niệm đẹp nhất."
          },
          {
            style: "🗺️ Lạc đường hóa vui",
            text: "We took a wrong turn and ended up discovering a hidden waterfall that wasn't on any tourist map!",
            translation: "Chúng tôi rẽ nhầm đường nhưng lại tình cờ khám phá ra thác nước tuyệt đẹp không có trên bản đồ du lịch!"
          },
          {
            style: "🤝 Lòng tốt người bản xứ",
            text: "Our motorbike broke down in a remote village, but friendly locals spent an hour fixing it for free.",
            translation: "Xe máy bị hỏng ở bản làng xa xôi, nhưng những người dân thân thiện đã dành cả tiếng sửa giúp miễn phí."
          }
        ]
      }
    ]
  },

  // --- LEVEL: C1 - C2 (NÂNG CAO) ---
  {
    id: 'daily-ai-future',
    level: 'advanced',
    levelName: 'Nâng Cao (C1 - C2)',
    title: 'Trí Tuệ Nhân Tạo: Cơ Hội Hay Thách Thức Nhân Loại?',
    targetMinutes: 10,
    description: 'Thảo luận sâu về sự trỗi dậy của GenAI, tác động đạo đức, nguy cơ mất việc làm và sự chuyển dịch kỹ năng.',
    aiCoach: {
      name: 'Sophia',
      role: 'Executive Strategy Coach',
      gender: 'female',
      avatar: '👩‍💼'
    },
    stages: [
      {
        id: 1,
        stageName: 'Tác động chuyển dịch việc làm',
        question: "Generative AI is advancing at breakneck speed. In your view, will AI augment human intellect or displace white-collar professionals entirely?",
        keyVocab: ["A double-edged sword", "Augment human creativity", "Obsolescence", "Pave the way for"],
        correctTargetExample: "Rather than outright replacement, I believe AI will augment strategic decision-making while eliminating routine tasks.",
        hintSentence: "I believe AI will serve as a powerful co-pilot rather than completely replacing human professionals.",
        alternativeAnswers: [
          {
            style: "🚀 Trợ lý đồng hành (Co-pilot)",
            text: "I envision AI as an intellectual multiplier that elevates productivity rather than rendering professionals obsolete.",
            translation: "Tôi coi AI là đòn bẩy trí tuệ giúp nâng tầm năng suất hơn là khiến người lao động bị đào thải."
          },
          {
            style: "⚠️ Cân bằng & Thận trọng",
            text: "It's undoubtedly a double-edged sword; routine analytical roles will shrink, while creative orchestration will surge.",
            translation: "Đó chắc chắn là con dao hai lưỡi; các vai trò phân tích lặp đi lặp lại sẽ thu hẹp, trong khi khả năng sáng tạo điều phối sẽ lên ngôi."
          },
          {
            style: "💡 Góc nhìn tiến hóa",
            text: "Historically, technology shifts labor paradigms rather than destroying human agency entirely.",
            translation: "Lịch sử cho thấy công nghệ chuyển dịch mô hình lao động chứ không hoàn toàn triệt tiêu vai trò của con người."
          }
        ]
      },
      {
        id: 2,
        stageName: 'Kỹ năng thiết yếu tương lai',
        question: "Given this unprecedented technological disruption, what core human competencies will become paramount for the next generation?",
        keyVocab: ["Critical thinking", "Emotional intelligence", "Adaptability", "Ethical discernment"],
        correctTargetExample: "Emotional intelligence, ethical reasoning, and critical inquiry will remain uniquely irreplaceable by algorithms.",
        hintSentence: "Adaptability and empathetic leadership will be the most valuable attributes in an automated world.",
        alternativeAnswers: [
          {
            style: "🧠 Tư duy phản biện & Cảm xúc",
            text: "Critical thinking, ethical discernment, and deep empathy are capabilities algorithms cannot authentically replicate.",
            translation: "Tư duy phản biện, đánh giá đạo đức và sự thấu cảm sâu sắc là những năng lực mà thuật toán không thể sao chép chân thật."
          },
          {
            style: "🔄 Thích ứng linh hoạt",
            text: "The meta-skill of 'learning how to unlearn and relearn' will outweigh static technical knowledge.",
            translation: "Kỹ năng siêu việt về việc 'học cách bỏ thói quen cũ và tiếp thu cái mới' sẽ quan trọng hơn kiến thức kỹ thuật tĩnh."
          },
          {
            style: "👥 Lãnh đạo nhân văn",
            text: "Empathetic leadership and cross-cultural communication will become the ultimate competitive advantage.",
            translation: "Khả năng lãnh đạo thấu cảm và giao tiếp đa văn hóa sẽ trở thành lợi thế cạnh tranh tối thượng."
          }
        ]
      }
    ]
  }
];

export const TOPIC_LEVELS = [
  { id: 'all', name: 'Tất Cả Cấp Độ', icon: '🌐' },
  { id: 'beginner', name: 'Cơ Bản (A1 - A2)', time: '5 Phút', icon: '🌱', color: '#10b981' },
  { id: 'intermediate', name: 'Trung Cấp (B1 - B2)', time: '5 - 10 Phút', icon: '🔥', color: '#6366f1' },
  { id: 'advanced', name: 'Nâng Cao (C1 - C2)', time: '10 Phút', icon: '💎', color: '#8b5cf6' }
];
