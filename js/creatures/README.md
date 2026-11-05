# 怪物與招式資料

主要圖鑑、地區追加怪物、招式、物種學習表、屬性招式與稀有／傳說索引集中在 `catalog.js` 的 `window.PIGMON_CREATURE_DATA`。此檔只保存資料，不放戰鬥規則或繪圖程式。

## 新增一般怪物

- `enemies.base` 與 `enemies.legends`：起始怪物與基本傳說怪物。每筆有 `n`（名稱）、`t`（屬性）、`m`（圖鑑編號）、`hp`、`atk` 與 `sprite`。
- `extraSpecies.names`：由遊戲依既有規則產生的通用怪物名稱；類型和繪圖樣式依索引輪替。若需要自訂數值，請在對應 `enemies` 群組新增完整紀錄。
- `newSpeciesNames`：另一批依既有產生規則建立的怪物名稱。
- `enemies` 內的 `mine`、`iceLab`、`ruinsDream`、`undersea`、`biome`、`finalBosses` 等群組對應各地區；每筆可自行設定屬性與數值。

新增到資料群組會加入圖鑑清單；若要讓怪物出現在特定地區的野外遭遇，還要在 `game.js` 更新對應的 `*_IDS`／遭遇池。`extraSpecies.names` 與 `newSpeciesNames` 會依既有公式產生屬性和數值；新增名稱前請注意後續遊戲系統仍有數字索引，必要時須同步調整索引表。

`sprite` 欄位使用已存在的繪圖代號，例如 `wolf`、`bunny`、`rock`、`cutePig`。特殊姿態使用 `{kind:'cuteSp',args:[長耳,裝飾編號,亮色]}`；特殊地區精靈使用對應群組已註冊的代號。新增全新的繪圖函式仍需在 `game.js` 實作並加入該群組的繪圖對照。

## 新增招式

在 `moves.base` 或相應的 `moves` 地區群組新增資料。攻擊招式使用 `n`（名稱）、`p`（威力）、`a`（命中率）與可選的 `y`（屬性）；`t:'h'` 為回復，`t:'d'` 為降攻等狀態招式。若新怪物需要專屬學習順序，請更新 `speciesMoves`，地區群組的動態索引與學習時機則仍在 `game.js` 管理。

不要刪改原有怪物排列次序，因存檔、圖鑑、遭遇和任務使用數字索引；新增時優先附加在相應群組尾端。完成後先本機測試，再推送到 `main`，GitHub Pages 會自動部署。
