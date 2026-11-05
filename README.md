# PigmonPro｜豬豬小可愛*粉紅

繁體中文像素風小豬冒險遊戲，使用原生 HTML、CSS 與 JavaScript，無外部套件或圖片依賴。

## 專案結構

- `index.html`：遊戲頁面與 Canvas、控制介面
- `css/style.css`：版面、按鈕與色彩樣式
- `js/game.js`：繪圖、操作、事件與遊戲邏輯
- `js/maps/layouts.js`：固定地圖格線與室內版型
- `js/maps/README.md`：地圖資料格式與新增方式

新增或調整遊戲地圖時，先編輯 `js/maps/layouts.js`；遊戲執行邏輯則留在 `js/game.js`。頁面入口與依賴路徑集中在 `index.html`。

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
