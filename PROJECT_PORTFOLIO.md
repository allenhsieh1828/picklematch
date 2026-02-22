# 🏓 PickleMatch — 匹克球運動媒合平台

## 專案簡介

**PickleMatch** 是一個現代化的匹克球社交媒合平台，讓運動愛好者能夠輕鬆發掘、參加或舉辦本地球局。整合即時資料同步、無縫使用者體驗與企業級安全機制，提供社區驅動的球類運動新體驗。

---

## 核心特性

✅ **球局發起與報名** — 球友可以發起新球局並設定程度要求，其他使用者可即時報名參加  
✅ **實時資料同步** — 使用 Supabase Realtime，球局狀態與參加者名單即時更新無延遲  
✅ **使用者認證與檔案** — 基於 Email/Password 的安全認証系統，個人檔案展示球友等級與成績  
✅ **程度篩選** — 球友可依自身程度篩選合適球局，避免程度差異過大  
✅ **安全與速率限制** — 多層次安全防護，包括 Middleware 級速率限制與 API 層防暴力破解  

---

## 技術棧

### 🎨 前端框架與渲染

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 14.2.3 | 全端 React 框架，支援 Server Components、SSR 與靜態生成 |
| **React** | ^18 | UI 元件庫，函式式元件 + Hooks |
| **TypeScript** | ^5 | 靜態型別檢查，增強程式碼可維護性 |
| **Tailwind CSS** | ^3.4.1 | Utility-first CSS 框架，快速樣式開發 |
| **Lucide React** | ^0.378.0 | 現代化 SVG 圖示庫 |

### **渲染策略**

- **Server Components**（預設）— 首頁、活動詳情頁使用 RSC 以降低 JS 包體積  
- **Client Components** — 互動元件（篩選器、報名表單）使用 `'use client'`  
- **動態路由** — `[id]` 動態路由搭配 ISR（Incremental Static Regeneration）  
- **Realtime 訂閱** — 使用 Supabase Client 進行 WebSocket 訂閱，保持資料即時性  

---

### 🛄 後端與資料管理

| 技術 | 用途 |
|------|------|
| **Supabase** (PostgreSQL) | 完整雲端資料庫、認証、RLS 政策 |
| **Supabase Auth** | Email/Password 認証、Session 管理 |
| **Supabase Realtime** | WebSocket 即時推播，球局狀態更新 |
| **Supabase RLS** (Row Level Security) | 資料庫層級存取控制 |

#### **資料模型**

```sql
-- 使用者檔案表
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  nickname TEXT UNIQUE,
  level NUMERIC(2,1),      -- 程度 (1.0 ~ 5.0)
  total_games INT DEFAULT 0,
  hosted_games INT DEFAULT 0,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP
);

-- 球局表
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  host_id UUID REFERENCES profiles(id),
  title TEXT,
  date TIMESTAMP,
  location TEXT,
  min_level NUMERIC(2,1),
  max_level NUMERIC(2,1),
  max_players INT,
  status TEXT,              -- 'open', 'full', 'completed'
  created_at TIMESTAMP
);

-- 報名紀錄表
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  activity_id UUID REFERENCES activities(id),
  player_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'confirmed',
  booked_at TIMESTAMP
);
```

---

### 🔐 安全性 & 即時性

#### **認証與授權**
- Supabase JWT Token 管理，支援 refresh 機制  
- Middleware 層 Session 刷新（自動同步 cookie）  
- Row Level Security (RLS) — 使用者只能查看/編輯自己的記錄與可見的活動  

#### **API 安全防護**
- **速率限制**（Middleware 層）— 每分鐘最多 120 個 API 請求  
- **登入防暴力破解**（應用層）— 15 分鐘內最多 10 次登入嘗試  
- **報名頻率控制**（應用層）— 1 分鐘內最多 5 個報名請求  
- **輸入驗證 & 清理** — 使用 Zod Schema 與自訂 sanitize 函式  

#### **Web 安全**
- **CSRF 保護** — Next.js 內置防護  
- **XSS 防護** — React 自動逃逸、CSP headers  
- **Bot 過濾** — Middleware 黑名單過濾已知掃描器  

#### **Realtime/WebSocket**
- Supabase Realtime 的加密連接  
- 只訂閱使用者有權限存取的 channel  
- 伺服器端驗證所有 Realtime 事件  

---

### 📦 開發工具與部署

| 工具 | 用途 |
|------|------|
| **Vercel** | 無伺服器部署，自動 CI/CD，edge 網絡 |
| **GitHub** | 版本控制，与 Vercel 自動部署整合 |
| **ESLint + TypeScript** | 程式碼品質、靜態型別檢查 |
| **Tailwind + PostCSS** | CSS 優化、自動前綴 |

---

## 專案架構

```
picklematch/
├── app/
│   ├── layout.tsx                    # Root 佈局（全域樣式、Navbar）
│   ├── page.tsx                      # 首頁（Server Component）
│   ├── /activities/[id]/page.tsx     # 活動詳情動態路由
│   ├── /profile/me/page.tsx          # 個人檔案頁
│   ├── /profile/[id]/page.tsx        # 他人檔案查看
│   └── /api/                         # API 路由（認証、報名、個人資料）
│
├── components/
│   ├── /activity/                    # 活動相關元件
│   ├── /profile/                     # 檔案相關元件
│   ├── /auth/                        # 認証相關元件
│   └── /ui/                          # 可重用 UI 元件
│
├── lib/
│   ├── authContext.tsx               # React Context (使用者認証狀態)
│   ├── supabase/
│   │   ├── client.ts                 # Browser-side Supabase Client
│   │   └── server.ts                 # Server-side Supabase Client
│   ├── security/
│   │   ├── rateLimiter.ts            # 速率限制實作
│   │   └── sanitize.ts               # 輸入清理函式
│   └── hostFormSchema.ts             # Zod 驗証 schema
│
├── types/
│   ├── activity.ts                   # Activity 型別定義
│   ├── user.ts                       # User/Profile 型別定義
│   └── database.ts                   # Database 型別定義
│
├── middleware.ts                      # Next.js Middleware（速率限制、認証刷新）
├── tailwind.config.ts                # Tailwind 設定
└── tsconfig.json                     # TypeScript 設定
```

---

## 快速開始

### 本機開發

```bash
# 複製專案
git clone https://github.com/allenhsieh1828/picklematch.git
cd picklematch

# 安裝相依套件
npm install

# 設定環境變數（複製 .env.example 改名為 .env.local）
cp .env.example .env.local
# 編輯 .env.local，填入你的 Supabase URL 和 ANON_KEY

# 啟動開發伺服器
npm run dev

# 開啟瀏覽器
# http://localhost:3000
```

### 部署到 Vercel

1. **Push 到 GitHub**（已完成）
2. **在 Vercel 連接 GitHub Repository**  
   - 進 https://vercel.com → New Project → 選 `allenhsieh1828/picklematch`  
3. **設定環境變數**  
   - Settings → Environment Variables  
   - 新增 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
4. **自動部署**  
   - 每次 push main 分支都會自動觸發部署  

---

## 標籤與技術標記

```
Next.js | React | TypeScript | Tailwind CSS | Supabase
Server Components | Realtime WebSocket | JWT Auth | RLS
Speed Rate Limiting | API Security | Vercel Deployment
```

---

## 聯絡與貢獻

- **GitHub**: [allenhsieh1828/picklematch](https://github.com/allenhsieh1828/picklematch)  
- **主要開發者**: Allen Hsieh  
- **開發狀態**: 🚀 Active Development  

---

## 授權

MIT License — 詳見 LICENSE 檔案
