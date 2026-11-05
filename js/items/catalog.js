/* 道具、地圖拾取物、素材配方與商店價目。效果函式於遊戲執行時才會呼叫。 */
window.PIGMON_ITEM_CATALOG = {
  pickups: {
    base: {'route:8:5':{name:'回復藥',give:()=>BAG.heal=(BAG.heal||0)+1},'forest:10:4':{name:'高級飼料',give:()=>BAG.superFeed++},'a2:6:8':{name:'稀有糖果',give:()=>{pig.love=(pig.love||0)+5}}},
    mineVolcano: {'mine:5:6':{name:'礦石碎片',give:()=>{BAG.coins+=80}},'volcIn:17:11':{name:'熔火結晶',give:()=>{BAG.coins+=120;party.forEach(m=>m.love=Math.min(100,(m.love||0)+3))}}},
    labAndMine: {'mine:15:10':{name:'鐵礦核心',give:()=>{BAG.coins+=140}},'mine:3:10':{name:'礦工頭盔',give:()=>{party.forEach(m=>m.def=(m.def||8)+2)}},'volcIn:3:11':{name:'耐熱果',give:()=>{party.forEach(m=>m.max+=5)}},'volcIn:15:9':{name:'火山硫晶',give:()=>{BAG.coins+=180}},'iceCave:17:11':{name:'冰藍晶石',give:()=>{BAG.coins+=160}},'lab:16:9':{name:'實驗資料晶片',give:()=>{BAG.coins+=200}}},
    ruinsDream: {'ruins:16:9':{name:'古代符石',give:()=>{BAG.coins+=240}},'ruins:3:11':{name:'遺跡護符',give:()=>{party.forEach(m=>m.spd=(m.spd||8)+2)}},'dreamSpace:16:9':{name:'夢境星屑',give:()=>{party.forEach(m=>m.love=Math.min(100,(m.love||0)+8))}},'dreamSpace:3:11':{name:'幻夢糖果',give:()=>{BAG.superFeed++}}},
    undersea: {'undersea:16:9':{name:'深海珍珠',give:()=>{BAG.coins+=260}},'undersea:3:11':{name:'珊瑚護符',give:()=>{party.forEach(m=>m.spd=(m.spd||8)+3)}}},
    biomeMaterials: {'rare:深淵藻核':{name:'深淵藻核',give:()=>BAG.coins+=160},'rare:星鰩珊瑚':{name:'星鰩珊瑚',give:()=>BAG.coins+=180},'rare:潮汐獠牙':{name:'潮汐獠牙',give:()=>BAG.coins+=220},'rare:苔光露珠':{name:'苔光露珠',give:()=>BAG.coins+=170},'rare:月蛾粉晶':{name:'月蛾粉晶',give:()=>BAG.coins+=210},'rare:古樹鹿角':{name:'古樹鹿角',give:()=>BAG.coins+=260}},
    deepRegions: {'underseaDeep:15:10':{name:'深淵珍珠',give:()=>{BAG.coins+=360}},'trench:3:10':{name:'海溝藍晶',give:()=>{BAG.coins+=420}},'forestDeep:15:10':{name:'古樹果實',give:()=>{party.forEach(m=>m.hp=m.max)}},'forestGrove:3:10':{name:'森林護符',give:()=>{party.forEach(m=>m.love=Math.min(100,(m.love||0)+6))}},'ruins2:15:10':{name:'王室遺物',give:()=>{BAG.coins+=500}},'dreamBranch:3:10':{name:'夢路花瓣',give:()=>{BAG.superFeed++}},'dreamCore:15:10':{name:'夢境晶核',give:()=>{BAG.coins+=520}},'labUnderground:3:10':{name:'地下研究樣本',give:()=>{BAG.coins+=480}}},
    lateRegions: {'trenchEast:16:9':{name:'東潮羅盤',give:()=>{BAG.coins+=320;FL.eastCompass=1}},'trenchWest:3:10':{name:'沉船航海鐘',give:()=>{BAG.superFeed++;FL.westBell=1}},'forestCanopy:16:9':{name:'樹冠月繭',give:()=>{party.forEach(m=>m.love=Math.min(100,(m.love||0)+7));FL.canopyCocoon=1}},'forestMoss:3:10':{name:'苔影種莢',give:()=>{party.forEach(m=>m.hp=m.max);FL.mossPod=1}},'forestGrove:16:9':{name:'古王根晶',give:()=>{BAG.coins+=420;FL.groveRoot=1}}}
  },
  recipes: {
 '深海龍鱗':{n:'鱗片強化',cost:300,effect:m=>{m.def+=3;m.spd+=3;return '防禦與特防提升了！'}},
 '古王樹果':{n:'樹果精華',cost:250,effect:m=>{m.max+=10;m.hp+=10;return '最大體力提升了！'}},
	 '王室遺物':{n:'遺物加持',cost:400,effect:m=>{m.atk+=4;m.spa+=4;return '攻擊與特攻提升了！'}},
	 '夢境晶核':{n:'核心共鳴',cost:500,effect:m=>{m.speed+=5;return '速度提升了！'}},
	 '電力核心':{n:'電能充溢',cost:450,effect:m=>{m.mv.forEach((mi,i)=>{if(MOVES[mi].y==='電')m.pp[i]=m.maxpp[i]=Math.min(30,(m.maxpp[i]||10)+5)});return '電屬性招式PP上限提升！'}},
	 '深淵藻核':{n:'深淵呼吸器',cost:260,effect:m=>{m.equipment=(m.equipment||[]).concat('深淵呼吸器');m.max+=6;m.hp+=6;m.spd+=4;return '最大體力與特防提升！'}},
	 '星鰩珊瑚':{n:'星鰩護腕',cost:300,effect:m=>{m.equipment=(m.equipment||[]).concat('星鰩護腕');m.def+=3;m.speed+=2;return '防禦與速度提升！'}},
	 '潮汐獠牙':{n:'潮汐長牙',cost:360,effect:m=>{m.equipment=(m.equipment||[]).concat('潮汐長牙');m.atk+=5;return '攻擊提升，水屬性力量變得更集中！'}},
	 '苔光露珠':{n:'苔光披風',cost:280,effect:m=>{m.equipment=(m.equipment||[]).concat('苔光披風');m.spd+=4;m.love=Math.min(100,(m.love||0)+5);return '特防與親密度提升！'}},
	 '月蛾粉晶':{n:'月紋護符',cost:340,effect:m=>{m.equipment=(m.equipment||[]).concat('月紋護符');m.spa+=4;return '特攻提升，光屬性招式更加穩定！'}},
	 '古樹鹿角':{n:'古樹冠冕',cost:420,effect:m=>{m.equipment=(m.equipment||[]).concat('古樹冠冕');m.max+=12;m.hp+=12;m.def+=3;return '最大體力與防禦大幅提升！'}}
	},
  shop: [{name:'素材強化',cost:null,action:'craft'},
    {name:'普通飼料',cost:15,action:'feed'},
    {name:'高級飼料',cost:80,action:'superFeed'},
    {name:'補血藥',cost:40,action:'heal'},
    {name:'脫逃繩',cost:70,action:'rope'},
    {name:'避怪藥水100',cost:60,action:'repel100'},
    {name:'避怪藥水200',cost:100,action:'repel200'},
    {name:'避怪藥水400',cost:180,action:'repel400'}],
  rareDropsByOffset: {
	  0:['深淵藻核',160],1:['星鰩珊瑚',180],2:['潮汐獠牙',220],
	  3:['苔光露珠',170],4:['月蛾粉晶',210],5:['古樹鹿角',260]
	 },
  bossDropsByOffset: {
 0:{name:'深淵海龍',coins:600,items:[['深海龍鱗',1],['深海珍珠',2],['水屬性晶核',1]],effect:()=>{FL.seaBoss=1}},
 1:{name:'森林秘境古王',coins:520,items:[['古王樹果',2],['森林王冠',1],['森林護符',1]],effect:()=>{party.forEach(m=>m.love=Math.min(100,(m.love||0)+10))}},
 2:{name:'遺跡第二層守護神',coins:700,items:[['王室遺物',1],['古代星砂',2],['遺跡護符',1]],effect:()=>{FL.ruinsBoss=1}},
 3:{name:'夢境核心雙生體',coins:800,items:[['夢境晶核',1],['幻夢糖果',2],['雙生夢片',1]],effect:()=>{FL.dreamBoss=1}},
 4:{name:'地下研究所終極體',coins:900,items:[['終極研究樣本',1],['實驗資料晶片',1],['電力核心',1]],effect:()=>{FL.labBoss=1}}
},
};
