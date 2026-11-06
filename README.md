# PigmonPro｜豬豬小可愛*粉紅

繁體中文像素風小豬冒險遊戲，使用原生 HTML、CSS 與 JavaScript，無外部套件或圖片依賴。

## 專案結構

- `index.html`：遊戲頁面與 Canvas、控制介面
- `css/style.css`：版面、按鈕與色彩樣式
- `js/game/`：依責任拆分的遊戲模組，從 `core.js` 到 `ui.js` 依序載入
- `js/maps/layouts.js`：固定地圖格線與室內版型
- `js/maps/README.md`：地圖資料格式與新增方式
- `js/creatures/catalog.js`：怪物與生態資料目錄
- `js/creatures/README.md`：新增怪物的資料格式說明
- `js/moves/catalog.js`：招式、屬性克制與學習資料
- `js/moves/README.md`：新增招式與調整學習資料
- `js/items/catalog.js`：拾取道具、素材、配方與商店資料
- `js/items/README.md`：新增道具與調整配方／商店

新增或調整怪物、招式、道具與地圖，分別編輯 `js/creatures/`、`js/moves/`、`js/items/` 與 `js/maps/` 中的資料目錄；遊戲邏輯則依功能放在 `js/game/`，載入順序集中在 `index.html`。

## 遊戲程式模組

為了維持 GitHub Pages 的免建置部署，遊戲使用依序載入的瀏覽器 JavaScript 模組：

- `js/game/core.js`：Canvas 工具、地圖基礎資料、遊戲狀態、角色與 NPC
- `js/game/world.js`：世界區域、特殊地形、謎題、地標與服務功能
- `js/game/menus.js`：對話、選單、背包、商店、任務、存檔與進化
- `js/game/gameplay.js`：移動、事件流程、隨機遇敵、戰鬥與戰鬥特效
- `js/game/render.js`：地圖、戰鬥、標題畫面與主迴圈繪製
- `js/game/audio.js`：Web Audio 背景音樂與音效
- `js/game/features.js`：房屋、學堂、迷宮、探索與後期功能擴充
- `js/game/ui.js`：鍵盤／觸控輸入、UI 最終覆寫與啟動流程

各模組仍維持原本的載入順序，因此不需要 Node.js、打包工具或額外伺服器設定。

## 測試

專案提供零依賴的 Node.js 測試套件，測試程式位於 `tests/run-tests.js`。它會在模擬瀏覽器環境中依序載入八個遊戲模組，並檢查模組啟動、地圖與傳送點完整性、內容資料規模、屬性相剋、鍵盤輸入、存檔還原，以及 Service Worker 快取檔案。

執行測試：

```sh
npm test
```

新增地圖、怪物、招式、任務或模組時，建議先執行測試，再用瀏覽器進行實際操作測試。

## 本機遊玩

直接以瀏覽器開啟 `index.html`，或在專案根目錄執行：

```sh
python3 -m http.server 8000
```

再開啟 <http://localhost:8000>。

## 操作方式

- 方向鍵／WASD：移動
- Z／空白鍵／Enter：A（確認）
- X：選單；B：取消／退出特殊地形；Y：地圖；M：音樂開關
- 手機可使用畫面上的方向鍵與動作按鈕

## GitHub Pages

發布後可在 GitHub 儲存庫的 **Settings → Pages** 啟用網站。若採用 `main` 分支根目錄，網址會是：

`https://dmppmd132-glitch.github.io/pigmonpro/`

## PWA 與離線遊玩

專案已加入 `manifest.json` 與 `sw.js`。第一次在線上開啟遊戲後，Service Worker 會快取遊戲頁面、JavaScript、CSS 與圖標；之後即使沒有網路，也可以從已安裝的 PWA 啟動遊戲。

### 圖標尺寸

- `icons/icon-120.png`：較舊 iPhone 的 `apple-touch-icon`
- `icons/icon-152.png`：iPad Retina 的 `apple-touch-icon`
- `icons/icon-167.png`：iPad Pro 的 `apple-touch-icon`
- `icons/icon-180.png`：現代 iPhone 的 `apple-touch-icon`
- `icons/icon-192.png`：Android 與瀏覽器安裝提示的標準圖標
- `icons/icon-512.png`：高解析度安裝圖標，以及 maskable 圖標來源

目前圖標是可直接使用的基本豬豬圖案。若要替換正式美術，只要保留上述檔名、尺寸與 PNG 格式即可。

在 iPhone／iPad 上，請使用 Safari 開啟網站，按「分享」→「加入主畫面」。iOS 不會像 Android 一樣完全依照 Web App Manifest 顯示安裝提示，因此 `apple-touch-icon` 與 Apple 專用 meta 標籤是必要的。
