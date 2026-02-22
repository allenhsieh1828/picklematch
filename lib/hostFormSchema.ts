// 多步驟表單的型別定義與驗證邏輯

export interface HostFormData {
  // Step 1 - 基本資訊
  title: string;
  location: string;
  locationUrl: string;   // Google Maps 或地址連結

  // Step 2 - 日期時間
  date: string;          // YYYY-MM-DD
  timeStart: string;     // HH:mm
  timeEnd: string;       // HH:mm

  // Step 3 - 球局設定
  levelMin: number;      // 2.0 ~ 5.0
  levelMax: number;
  maxPlayers: number;    // 4 ~ 24
  fee: number;           // 0 ~ 2000
  lineGroupUrl: string;  // Line 社群/群組連結
}

export const INITIAL_FORM_DATA: HostFormData = {
  title: '',
  location: '',
  locationUrl: '',
  date: '',
  timeStart: '09:00',
  timeEnd: '11:00',
  levelMin: 2.0,
  levelMax: 3.5,
  maxPlayers: 8,
  fee: 200,
  lineGroupUrl: '',
};

export const LEVEL_OPTIONS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

export const TOTAL_STEPS = 4;

// 每個步驟的驗證
export function validateStep(step: number, data: HostFormData): string | null {
  if (step === 1) {
    if (!data.title.trim()) return '請輸入活動標題';
    if (!data.location.trim()) return '請輸入場地名稱';
  }
  if (step === 2) {
    if (!data.date) return '請選擇日期';
    if (!data.timeStart || !data.timeEnd) return '請選擇時段';
    if (data.timeStart >= data.timeEnd) return '結束時間必須晚於開始時間';
  }
  if (step === 3) {
    if (data.levelMin > data.levelMax) return '最低程度不能高於最高程度';
    if (data.maxPlayers < 4) return '最少需要 4 人';
    if (data.fee < 0) return '費用不能為負數';
  }
  return null;
}

// 將表單資料轉為 Activity preview 格式
export function formToPreview(data: HostFormData) {
  return {
    title: data.title,
    location: data.location,
    locationUrl: data.locationUrl,
    date: data.date,
    time: `${data.timeStart} - ${data.timeEnd}`,
    level: [data.levelMin, data.levelMax] as [number, number],
    fee: data.fee,
    maxPlayers: data.maxPlayers,
    currentPlayers: 1,
    hostName: '我',
    status: 'open' as const,
    lineGroupUrl: data.lineGroupUrl,
  };
}
