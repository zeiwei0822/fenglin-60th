# 風嶺百貌・六十週年紀念

國防大學理工學院創校六十週年紀念網站——六十週年網頁設計競賽參賽作品。

六十載歲月，風嶺依舊靜立；山川為證，師生情長。

## 功能

- **Hero 形象區**：「六十」書法筆畫動畫（SVG 依筆順描繪）、粒子星塵、山景視差、打字機標題、霧氣與金色光暈
- **歷史沿革**：滾動敘事時間軸——金線隨捲動生長、年代逐一點亮、2026 六十週年徽記
- **校園景色地圖**：可拖曳縮放的實景地圖（手機自動切換為靜態滿版），金色熱點開啟燈箱相簿，支援鍵盤 ← → 切換
- **六十週年祝福**：Firebase Realtime Database 即時留言牆——送出祝福即時同步所有訪客，新留言金框高亮
- **院歌播放器**：左下角音符鈕，循環播放（`preload="none"`，不影響載入速度）
- 響應式設計（桌機／手機）、`prefers-reduced-motion` 無障礙支援

## 專案結構

```
├── index.html          # 頁面結構
├── css/style.css       # 全部樣式
├── js/main.js          # 互動邏輯（分頁、地圖、燈箱、動畫、播放器）
├── js/blessing.js      # Firebase 即時留言牆（ES Module）
└── assets/
    ├── img/            # 校園照片（WebP）、地圖、院徽
    └── audio/anthem.mp3 # 院歌
```

## 本地預覽

因為使用 ES Module 與相對路徑資源，需要起一個靜態伺服器（直接雙擊 HTML 會被瀏覽器擋）：

```bash
python -m http.server 8000
# 開啟 http://localhost:8000
```

## 部署

純靜態網站，任何靜態主機皆可（GitHub Pages、Netlify、Cloudflare Pages…）。整個資料夾原樣上傳即可。

留言牆使用 Firebase RTDB（設定在 `js/blessing.js`，Web API Key 屬公開的用戶端設定）；正式公開前建議在 Firebase Console 設定資料庫安全規則（欄位字數上限、寫入頻率限制）。

## 技術

原生 HTML / CSS / JavaScript，無框架、無建置流程。字體：Noto Serif TC・Noto Sans TC・ZCOOL QingKe HuangYou（Google Fonts）。
