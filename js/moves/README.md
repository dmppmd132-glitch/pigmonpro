# 招式與技能資料

招式清單、招式學習表、屬性招式對照、屬性相剋與稀有怪物動態招式使用的名稱模板集中在 `catalog.js` 的 `window.PIGMON_MOVE_DATA`。戰鬥計算及施放流程仍由 `js/game.js` 管理。

## 新增招式

- 在 `moves.base` 或適當的地區分組（例如 `moves.mine`、`moves.biome`）加一筆資料。
- 攻擊招式欄位：`n` 名稱、`p` 威力、`a` 命中率、`y` 屬性。治療／狀態招式使用 `t:'h'` 或 `t:'d'` 等類型。
- 若特定物種使用自訂招式，更新 `speciesMoves`；等級學習表在 `learnLevels`。`pigExclusive` 和 `pigUltimate` 是依執行時索引解析的特殊值。
- 地區招式分組在 `game.js` 的原有追加位置載入，其順序會影響存檔及學習索引；不要重排既有資料。
