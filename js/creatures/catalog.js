/* 怪物圖鑑與生態資料：以 sprite 字串／描述符連結 game.js 內的繪圖函式。 */
window.PIGMON_CREATURE_DATA = {
  enemies: {
    base: [{n:'野狼',t:'普',m:4,hp:16,atk:4,sprite:'wolf'},{n:'蘿蔔精',t:'草',m:9,hp:14,atk:3,sprite:'radish'},{n:'兇蜂',t:'電',m:10,hp:12,atk:5,sprite:'bee'},{n:'史萊姆',t:'水',m:8,hp:20,atk:3,sprite:'slime'},{n:'火焰豬',t:'火',m:7,hp:15,atk:4,sprite:'flame'},{n:'岩石怪',t:'土',m:6,hp:22,atk:3,sprite:'rock'},{n:'水母怪',t:'水',m:8,hp:18,atk:4,sprite:'jelly'},{n:'炎皇豬',t:'火',m:11,hp:50,atk:9,sprite:'legend'},{n:'暗影蝙蝠',t:'暗',m:12,hp:17,atk:5,sprite:'wolf'},{n:'毒蘑菇',t:'毒',m:13,hp:19,atk:4,sprite:'radish'},{n:'冰晶怪',t:'冰',m:14,hp:24,atk:4,sprite:'rock'},{n:'月光靈',t:'光',m:15,hp:16,atk:6,sprite:'slime'}],
    legends: [{n:'月兔仙子',t:'光',m:16,hp:70,atk:13,sprite:'bunny'},{n:'星耀豬皇',t:'光',m:17,hp:78,atk:14,sprite:'cutePig'},{n:'雲海兔王',t:'水',m:18,hp:74,atk:13,sprite:'bunny'},{n:'赤焰豬神',t:'火',m:19,hp:82,atk:15,sprite:'cutePig'}],
    v2Legends: [{n:'雪月兔神',t:'冰',m:20,hp:88,atk:16,sprite:'moonB'},{n:'雷霆豬王',t:'電',m:20,hp:92,atk:17,sprite:'boltP'}],
    dreamLegend: [{n:'夢幻兔豬皇',t:'光',m:30,hp:130,atk:22,sprite:'dream'}],
    yuTuTu: [{n:'鈺兔兔',t:'光',m:30,hp:60,atk:11,sprite:{kind:'cuteSp',args:[true,1,true]}}],
    mine: [{n:'礦坑鼴鼠',t:'土',m:31,hp:38,atk:9,sprite:'rock'},{n:'晶簇兔',t:'冰',m:32,hp:34,atk:10,sprite:{kind:'cuteSp',args:[true,4,true]}},{n:'熔岩泥豬',t:'火',m:33,hp:42,atk:12,sprite:'flame'},{n:'火山翼蝠',t:'火',m:34,hp:36,atk:11,sprite:'wolf'}],
    iceLab: [{n:'冰晶鼴兔',t:'冰',m:35,hp:40,atk:11,sprite:{kind:'cuteSp',args:[true,2,true]}},{n:'霜花豬',t:'冰',m:36,hp:45,atk:10,sprite:'cutePig'},{n:'實驗史萊姆',t:'毒',m:37,hp:39,atk:12,sprite:'slime'},{n:'電磁兔',t:'電',m:38,hp:35,atk:13,sprite:{kind:'cuteSp',args:[true,3,false]}}],
    ruinsDream: [{n:'遺跡石像',t:'土',m:39,hp:50,atk:14,sprite:'rock'},{n:'星紋兔',t:'光',m:40,hp:43,atk:12,sprite:{kind:'cuteSp',args:[true,2,false]}},{n:'夢境棉花',t:'光',m:41,hp:46,atk:13,sprite:'slime'},{n:'幻夢豬',t:'暗',m:42,hp:48,atk:14,sprite:'cutePig'}],
    undersea: [{n:'深海史萊姆',t:'水',m:43,hp:48,atk:12,sprite:'slime'},{n:'珊瑚兔',t:'水',m:44,hp:42,atk:13,sprite:{kind:'cuteSp',args:[true,1,false]}},{n:'潮汐豬',t:'水',m:45,hp:52,atk:15,sprite:'cutePig'},{n:'鐵甲蟹',t:'土',m:46,hp:55,atk:14,sprite:'rock'}],
    biome: [{n:'深淵海藻靈',t:'水',m:75,hp:56,atk:14,sprite:'abyssKelp'},{n:'珊瑚星鰩',t:'水',m:76,hp:51,atk:15,sprite:'coralRay'},{n:'潮汐角豬',t:'水',m:77,hp:64,atk:17,sprite:'tideBoar'},{n:'苔光幽靈',t:'草',m:78,hp:53,atk:13,sprite:'mossWisp'},{n:'月紋幻蛾',t:'光',m:79,hp:48,atk:16,sprite:'moonMoth'},{n:'古樹星鹿',t:'草',m:80,hp:70,atk:18,sprite:'groveStag'}],
    finalBosses: [{n:'深淵海龍',t:'水',m:70,lv:34,hp:108,atk:20,sprite:'legend'},{n:'森林秘境古王',t:'草',m:71,lv:36,hp:104,atk:19,sprite:'rock'},{n:'遺跡第二層守護神',t:'土',m:72,lv:38,hp:118,atk:22,sprite:'legend'},{n:'夢境核心雙生體',t:'暗',m:73,lv:40,hp:122,atk:23,sprite:'legend'},{n:'地下研究所終極體',t:'毒',m:74,lv:42,hp:116,atk:21,sprite:'jelly'}]
  },
  extraSpecies: { names: ['棉花團','奶油兔','草莓兔','蜜糖球','奶酥喵','布丁獸','泡芙豬','櫻桃啾','蘋果團','葡萄泥','彩虹狐','軟綿羊','星星鼠','牛奶熊','糖霜鹿','豆豆鳥','栗子鼴','果凍狐','雲朵羊','花瓣兔','薄荷貓','可可熊','焦糖蛙','奶油鼠','桃桃鹿','小月兔','甜甜圈獸','棉花蝸','蜜桃狐','彩蛋雞','鬆餅怪','莓果熊','銀河貓','露珠兔','泡泡魚','星砂蟹','軟糖龍','彩糖蛇','雪糕狐','奶茶蛙','小花鹿','雲朵豬','糖葫蘆鳥','粉晶兔','果醬怪','月牙狐','星願羊','甜心豬','彩光蝶'], types: ['普','草','水','火','電','土','冰','毒','光','暗'], spriteKeys: ['slime','bunny','radish','flame','bee','rock','jelly','wolf','cutePig','slime'] },
  newSpeciesNames: '布丁兔 雲朵兔 草莓豬 蜜桃豬 棉花豬 奶蓋兔 糖心兔 年糕豬 湯圓兔 麻糬豬 珍珠兔 芋圓豬 奶茶兔 桂花豬 桃花兔 藍莓豬 薄荷兔 抹茶豬 櫻花兔 栗子豬 南瓜兔 檸檬豬 星星兔 月餅豬 雪球兔 彩虹豬 泡泡兔 蛋糕豬 餅乾兔 糖果豬 鈴鐺兔 花環豬 小太陽兔 小雨滴豬 雷雷兔 煙花豬 晶晶兔 夢夢豬 蝴蝶兔 星砂豬'.split(' '),
  legendIds: [7,61,62,63,64],
  rareIds: [95,96,97,98,99,100,101,102,103,104,7,61,62,63,64,105,106,107,108],
  groveGuardIds: [7,61,63,64,105,106,95,96,97,98,99,100,101,102,103,104,62,107,108],
};
