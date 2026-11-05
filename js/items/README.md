# 道具與素材資料

`catalog.js` 的 `window.PIGMON_ITEM_CATALOG` 集中管理地圖拾取物、首領與稀有素材掉落、合成強化配方及商店商品／價格。背包目前數量與使用流程則留在 `js/game.js`。

## 編輯道具

- `pickups.base` 與其他 `pickups` 群組：使用「地圖名稱:x:y」作為鍵，資料包含顯示名稱 `name` 及領取效果 `give`。例如 `route:8:5`。新增地圖上的拾取物時，也需在 `game.js` 將該座標地磚設為 `I`。
- `recipes`：素材名稱對應配方顯示名稱、金幣成本及強化效果。
- `shop`：商店顯示名稱、售價與效果代號；效果代號要能對應 `game.js` 的 `SHOP_ACTIONS`。
- `rareDropsByOffset`／`bossDropsByOffset`：怪物／首領素材名稱、數量與獎勵，鍵值是各自區域起始索引的相對位移。

拾取與配方效果函式在 `catalog.js` 中定義，但只會在遊戲互動時執行；新增道具請沿用現有欄位格式，避免改動已存檔會用到的素材名稱。
