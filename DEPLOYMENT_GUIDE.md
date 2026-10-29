# HƯỚNG DẪN DEPLOY "AI_ENGLISH_TEACHER" LÊN CLOUD MIỄN PHÍ 100%

Dự án đã được refactor theo mô hình **Monorepo chuẩn công nghiệp**:
* **`client/`**: Giao diện React + Vite (sẽ deploy lên **Vercel**).
* **`server/`**: API Backend Node.js Express (sẽ deploy lên **Render.com**).

---

## BƯỚC 1: ĐẨY TOÀN BỘ CODE ĐÃ REFACTOR LÊN GITHUB

Mở Terminal trên máy bạn và chạy các lệnh sau:

```bash
cd /Users/mac/Desktop/AI_English_Teacher

# Kiểm tra trạng thái các file đã được chia vào client/ và server/
git status

# Thêm tất cả thay đổi
git add .

# Tạo commit
git commit -m "Refactor: Split into client (React) and server (Node.js Express)"

# Đẩy lên GitHub
git push origin main
```

---

## BƯỚC 2: DEPLOY BACKEND LÊN RENDER.COM (HOÀN TOÀN MIỄN PHÍ)

> 💡 **Mẹo:** Ta deploy Backend trước để lấy link API điền vào Frontend ở Bước 3.

1. Truy cập [https://render.com](https://render.com) và **Đăng nhập bằng GitHub**.
2. Nhấn nút **"New +"** (góc trên bên phải) $\rightarrow$ Chọn **"Web Service"**.
3. Chọn repository **`AI_English_Teacher`** của bạn $\rightarrow$ Nhấn **"Connect"**.
4. Điền các thông số cấu hình chính xác như sau:
   * **Name:** `ai-english-teacher-api` (hoặc tên tùy bạn)
   * **Region:** `Singapore` (để tốc độ về Việt Nam nhanh nhất)
   * **Branch:** `main`
   * **Root Directory:** `server` *(CỰC KỲ QUAN TRỌNG: Nhớ điền chữ `server`)*
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node index.js`
   * **Instance Type:** Chọn gói **"Free"** ($0/month)
5. Kéo xuống mục **"Environment Variables"** (Biến môi trường) $\rightarrow$ Nhấn **"Add Environment Variable"**:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** *(Dán mã Gemini API Key miễn phí của bạn lấy từ https://aistudio.google.com/app/apikey)*
6. Nhấn nút **"Create Web Service"**.
7. Đợi 1-2 phút để Render build xong. Khi thấy chữ **"Live"**, hãy copy link backend của bạn (dạng: `https://ai-english-teacher-api.onrender.com`).
   * *Kiểm tra:* Bấm vào link đó, nếu màn hình hiện `{"status":"ok","service":"AI English Teacher Backend API"}` là thành công 100%!

---

## BƯỚC 3: DEPLOY FRONTEND LÊN VERCEL (HOÀN TOÀN MIỄN PHÍ)

1. Truy cập [https://vercel.com](https://vercel.com) và **Đăng nhập bằng GitHub**.
2. Nhấn nút **"Add New..."** $\rightarrow$ Chọn **"Project"**.
3. Tìm và nhấn **"Import"** tại repository **`AI_English_Teacher`**.
4. Ở màn hình **Configure Project**:
   * **Framework Preset:** Chọn `Vite`
   * **Root Directory:** Nhấn nút **Edit** và chọn thư mục `client` *(CỰC KỲ QUAN TRỌNG)*
5. Mở rộng phần **"Environment Variables"**:
   * **Key:** `VITE_API_URL`
   * **Value:** Điền link Backend trên Render bạn vừa copy ở Bước 2 (ví dụ: `https://ai-english-teacher-api.onrender.com`).
6. Nhấn nút **"Deploy"**.
7. Đợi khoảng 30 giây, Vercel sẽ cấp cho bạn tên miền miễn phí (dạng `https://ai-english-teacher.vercel.app`).

🎉 **CHÚC MỪNG BẠN!** Ứng dụng AI English Teacher của bạn hiện đã chạy online 100% với Frontend trên Vercel kết nối an toàn với Backend trên Render!

---

## HƯỚNG DẪN CHẠY LOCAL TRÊN MÁY TÍNH (DEVELOPMENT)

Nếu bạn muốn chạy thử cả Frontend và Backend trên máy tính cùng lúc:

1. Chạy Backend:
```bash
cd /Users/mac/Desktop/AI_English_Teacher/server
npm run dev
# Server sẽ chạy ở http://localhost:5001
```

2. Mở tab Terminal thứ 2 để chạy Frontend:
```bash
cd /Users/mac/Desktop/AI_English_Teacher/client
npm run dev
# Web sẽ mở ở http://localhost:5173
```
Hoặc từ thư mục gốc:
```bash
cd /Users/mac/Desktop/AI_English_Teacher
npm run dev:all
```

