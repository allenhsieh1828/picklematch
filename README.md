# 🏓 PickleMatch — 匹克球媒合平台

## 快速開始

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 開啟瀏覽器
# http://localhost:3000
```

---

## 專案結構

```
picklematch/
├── app/
│   ├── layout.tsx                    # Root Layout（字體、Navbar、全域設定）
│   ├── page.tsx                      # 首頁（Server Component）
│   ├── not-found.tsx                 # 404 頁面
│   ├── globals.css                   # Tailwind 全域樣式 + CSS 變數
│   └── activities/
│       └── [id]/
│           └── page.tsx              # 活動詳情動態路由
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx               # 頂部導覽列（sticky + blur）
│   ├── home/
│   │   ├── HeroSection.tsx          # Hero 標題區塊（Server Component）
│   │   └── FilterBar.tsx            # 程度篩選器（Client Component）
│   ├── activity/
│   │   ├── ActivityCard.tsx         # 球局卡片（含進度條 + 跳轉連結）
│   │   ├── ActivityList.tsx         # 球局列表（含篩選狀態）
│   │   ├── ActivityDetail.tsx       # 詳情頁主體
│   │   ├── BookingButton.tsx        # 一鍵報名 + 成功動畫（Client Component）
│   │   └── PlayerAvatarList.tsx     # 已報名球友頭像列表
│   └── ui/
│       ├── button.tsx               # Shadcn Button
│       └── badge.tsx                # Shadcn Badge
│
├── data/
│   ├── mockActivities.ts            # 活動 Mock 資料
│   └── mockPlayers.ts              # 球友 Mock 資料
│
├── types/
│   └── activity.ts                  # Activity TypeScript 型別定義
│
├── lib/
│   └── utils.ts                     # 工具函式（cn, 格式化, 顏色對應）
│
├── tailwind.config.ts               # Tailwind 設定（品牌色、字體、自訂動畫）
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 樣式 | Tailwind CSS |
| 元件庫 | Shadcn UI / Radix UI |
| 圖示 | Lucide React |
| 語言 | TypeScript |
| 狀態管理 | React Hooks (useState) |

---

## 開發路徑

- [x] **第一階段**：首頁 Hero + 活動列表 + 篩選器
- [x] **第二階段**：活動詳情頁 + 一鍵報名動畫 + 球友頭像列表
- [x] **第三階段**：發起球局多步驟表單（4 步驟 + 驗證 + 發布動畫）

---

## 設計規範

- **主色**：萊姆綠 `#BEF264`
- **背景**：深炭灰 `#0d1117` / `#111827`
- **圓角**：`rounded-2xl` 為主
- **Mobile First**：max-width `max-w-lg` 置中
