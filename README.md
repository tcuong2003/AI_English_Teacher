# AI English Teacher (SpeakFlow AI 2.0) 🎙️🤖

Ứng dụng luyện nói tiếng Anh giao tiếp thời gian thực cùng gia sư AI: đối thoại trực tiếp bằng giọng nói, nhân vật 2D/3D sinh động, rèn tư duy phản xạ, tự sửa từ nói vấp (in-place fix), nâng cấp câu bản xứ và các chủ đề 5-10 phút mỗi ngày.

---

## 🏗️ Cấu Trúc Dự Án (Monorepo)

```text
AI_English_Teacher/
├── client/                 # Frontend React 19 + Vite (Deploy lên Vercel)
│   ├── src/
│   │   ├── components/     # Avatar 2D/3D, ConversationRoom, DailyTopicChallenge...
│   │   ├── services/       # aiService, speechRepairService, audioService...
│   │   └── data/           # Scenarios, dailyTopics...
│   └── package.json
│
├── server/                 # Backend Node.js Express (Deploy lên Render.com)
│   ├── routes/
│   │   ├── chat.js         # Endpoint POST /api/chat gọi Google Gemini API
│   │   └── evaluate.js     # Endpoint POST /api/evaluate chấm điểm hội thoại
│   ├── index.js            # Express Server, CORS, Healthcheck
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md     # Hướng dẫn chi tiết deploy Vercel & Render miễn phí 100%
└── package.json            # Root scripts quản lý cả client & server
```

---

## ✨ Tính Năng Nổi Bật

1. **Nhân Vật 2D/3D Sinh Động (Face-to-Face Video Call):**
   * Khớp khẩu hình nói (lip-sync), nhịp thở, chớp mắt và cử chỉ biểu cảm theo từng câu đối thoại.
   * Lựa chọn đa dạng giáo viên bản xứ: Emma (Mỹ), Oliver (Anh), Sophia (Chuyên nghiệp).
2. **Mỗi Ngày 1 Chủ Đề (5 - 10 Phút):**
   * Phân cấp độ rõ ràng: Cơ bản (A1-A2), Trung cấp (B1-B2), Nâng cao (C1-C2).
   * Lộ trình từng bước (Khởi động $\rightarrow$ Phát triển ý $\rightarrow$ Đúc kết).
3. **Bộ Lọc Sửa Từ Nói Vấp In-Place (Speech Repair):**
   * Tự động nhận diện khi người dùng nói dở dang rồi nói lại (ví dụ `"tommo tomorrow"` $\rightarrow$ sửa trực tiếp thành `"tomorrow"`).
   * Chuẩn hóa lỗi phát âm sai / nhận diện nhầm từ (ví dụ `"hearts"` $\rightarrow$ `"tasks"`).
4. **Nâng Cấp Câu Bản Xứ & Đề Xuất 3 Cách Trả Lời Khác:**
   * Nâng cấp chính câu nói của học viên thành tiếng Anh bản xứ mượt mà.
   * Gợi ý 3 cách trả lời khác (Tự nhiên, Chuyên nghiệp, Ngắn gọn) kèm nút nghe phát âm.
5. **Kiến Trúc Tách Rời Bảo Mật:**
   * API Key được lưu an toàn 100% trên Backend server.
   * Không lo lộ key khi đưa lên môi trường công cộng.

---

## 🚀 Hướng Dẫn Deploy Lên Cloud Miễn Phí

Xem chi tiết từng bước có hình dung cụ thể tại: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

* **Backend:** Deploy thư mục `server/` lên **Render.com** (Web Service, Node.js).
* **Frontend:** Deploy thư mục `client/` lên **Vercel** (Vite Preset, Root: `client`).
