/* PigmonPro module: World expansion data, landmarks, puzzles, regions, and services. Loaded in order by index.html. */
function yuTuTu(cx,cy){
 const px=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(cx+x,cy+y,w,h)};
 const oval=(x,y,rx,ry,color)=>{ctx.fillStyle=color;for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(1-dy*dy/(ry*ry+.01)));ctx.fillRect(cx+x-w,cy+y+dy,2*w+1,1)}};
 const star=(x,y,color)=>{px(x-1,y,3,1,color);px(x,y-2,1,5,color);px(x-2,y-1,5,3,color)};
 const ink='#493052',cream='#fff4fa',rose='#ff82b5',blush='#ffb2cf',lilac='#c49af4',aqua='#72dce4',gold='#ffda70';
 oval(0,25,17,3,'#e8c9df');
 oval(-8,-17,5,15,ink);oval(-8,-17,3,13,cream);oval(-8,-17,2,10,rose);px(-9,-29,2,4,'#fff');
 oval(8,-16,5,14,ink);oval(8,-16,3,12,cream);oval(8,-16,2,9,aqua);px(7,-27,2,4,'#fff');
 oval(-19,13,5,5,ink);oval(-19,13,3,3,cream);px(-20,12,2,2,rose);
 oval(0,13,17,12,ink);oval(0,12,15,10,lilac);oval(0,13,12,8,cream);
 oval(-8,22,5,4,ink);oval(8,22,5,4,ink);oval(-8,21,3,2,rose);oval(8,21,3,2,rose);
 oval(-13,10,4,5,ink);oval(13,10,4,5,ink);oval(-13,10,3,4,cream);oval(13,10,3,4,cream);
 px(-11,6,4,3,aqua);px(-7,6,4,3,'#9ce49a');px(-3,6,4,3,gold);px(1,6,4,3,'#ff9ab5');px(5,6,4,3,lilac);px(-2,5,4,4,'#fff');px(-1,6,2,2,aqua);
 oval(0,-2,15,12,ink);oval(0,-3,13,10,cream);oval(0,-2,11,8,'#fff9fc');
 oval(-5,-4,2,3,ink);oval(5,-4,2,3,ink);px(-6,-6,1,1,'#fff');px(4,-6,1,1,'#fff');
 oval(-9,2,3,1,blush);oval(9,2,3,1,blush);oval(0,2,4,3,rose);px(-2,1,1,1,'#fff');px(-2,2,1,1,ink);px(1,2,1,1,ink);
 px(-1,6,2,1,ink);px(-2,7,1,1,ink);px(1,7,1,1,ink);
 px(-4,-15,2,3,gold);px(-2,-17,2,4,gold);px(0,-15,2,3,gold);px(2,-17,2,4,gold);px(4,-15,2,3,gold);px(-4,-12,10,2,gold);px(-1,-13,3,2,aqua);
 px(-14,-18,3,2,gold);px(-16,-16,3,2,rose);px(-13,-15,3,2,aqua);
 star(-23,-8,'#ffdb71');star(23,-13,aqua);star(20,8,'#ff9aba');
}
const cuteSp=(rb,ac,hu)=>(cx,cy)=>{if(ac===5){yuTuTu(cx,cy);return}const h=hu?1:0;ell(cx,cy+8,17,13,3);ell(cx,cy+8,16,12,h);
 if(rb){[-8,8].forEach(o=>{ell(cx+o,cy-13,4,13,3);ell(cx+o,cy-13,2,10,1)})}else{[-14,7].forEach(o=>{R(cx+o,cy-10,7,6,3);R(cx+o+1,cy-9,5,4,1)})}
 ell(cx,cy-2,12,9,3);ell(cx,cy-2,11,8,h);R(cx-6,cy-4,2,3,3);R(cx+4,cy-4,2,3,3);R(cx-9,cy,3,2,2);R(cx+6,cy,3,2,2);
 if(rb)R(cx-1,cy,2,2,2);else{ell(cx,cy+1,3,2,2);R(cx-1,cy+1,1,1,3);R(cx+1,cy+1,1,1,3)}
 if(ac===1){R(cx+6,cy-11,3,3,2);R(cx+10,cy-11,3,3,2)}if(ac===2){R(cx-1,cy-11,2,5,2);R(cx-3,cy-9,6,1,2)}if(ac===3)ell(cx+10,cy-9,3,2,2);if(ac===4){R(cx-12,cy+18,6,3,3);R(cx+6,cy+18,6,3,3)}};
const NEWN=CREATURE_DATA.newSpeciesNames;
NEWN.forEach((n,i)=>ENEMIES.push({n,t:EXTRA_TYPES[(i*3+1)%10],m:4+i%12,hp:12+(i%7)*2,atk:3+i%5,d:cuteSp(n.endsWith('兔'),i%5,i%3===1)}));
const moonB=(cx,cy)=>{bunny(cx,cy);R(cx-3,cy-20,6,2,2);R(cx-1,cy-23,2,3,2);R(cx-24,cy-6,3,3,2);R(cx+22,cy-2,3,3,2)};
const boltP=(cx,cy)=>{cutePig(cx,cy);R(cx+1,cy-24,4,3,2);R(cx-1,cy-21,4,3,2);R(cx-3,cy-18,4,3,2);R(cx-24,cy-6,3,3,2);R(cx+22,cy-2,3,3,2)};
const dream=(cx,cy)=>{ell(cx,cy+8,22,16,3);ell(cx,cy+8,21,15,0);[-11,11].forEach(o=>{ell(cx+o,cy-18,5,16,3);ell(cx+o,cy-18,3,13,1)});ell(cx,cy-3,15,12,3);ell(cx,cy-3,14,11,0);R(cx-8,cy-6,3,4,3);R(cx+5,cy-6,3,4,3);R(cx-12,cy,4,3,2);R(cx+8,cy,4,3,2);ell(cx,cy+2,5,3,2);R(cx-2,cy+2,1,1,3);R(cx+1,cy+2,1,1,3);R(cx-7,cy-15,14,3,2);R(cx-7,cy-19,3,4,2);R(cx-1,cy-21,3,6,2);R(cx+4,cy-19,3,4,2);ell(cx-3,cy+12,3,3,2);ell(cx+3,cy+12,3,3,2);R(cx-5,cy+14,10,3,2);R(cx-28,cy-8,3,3,2);R(cx+25,cy-4,3,3,2);R(cx+22,cy-22,2,2,1);R(cx-26,cy+10,2,2,1)};
ENEMIES.push(...CREATURE_DATA.enemies.v2Legends.map(e=>createEnemy(e,{moonB:moonB,boltP:boltP})));
LEGEND_IDS.push(105,106);const ULT=107;ENEMIES.push(...CREATURE_DATA.enemies.dreamLegend.map(e=>createEnemy(e,{dream:dream})));
MOVES.push(...MOVE_DATA.moves.v2Legends.map(m=>({...m})));
SPECIES_MOVES[105]=[0,21];SPECIES_MOVES[106]=[0,22];SPECIES_MOVES[107]=[0,23,24,25];
let PZ=null;
const pzTog=(g,i)=>{const x=i%3,y=i/3|0;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const X=x+a,Y=y+b;if(X>=0&&X<3&&Y>=0&&Y<3)g[Y*3+X]^=1})};
const pzNew=()=>{const g=Array(9).fill(1);for(let i=0;i<9;i++)if(Math.random()<.5)pzTog(g,i);if(g.every(v=>v))pzTog(g,4);return g};
const puzzle=()=>new Promise(r=>{PZ={g:pzNew(),c:4,n:0,r};S.mode='puzzle'});
function drawPuz(){R(0,0,160,144,0);box(2,2,156,140);T('星夢謎題',9,7,2,10);T(`步數 ${PZ.n}`,100,8,2,9);
 PZ.g.forEach((v,i)=>{const x=40+(i%3)*28,y=24+(i/3|0)*28;R(x,y,26,26,3);R(x+1,y+1,24,24,v?1:2);if(v){ell(x+13,y+13,6,6,0);R(x+12,y+4,2,18,0);R(x+4,y+12,18,2,0)}
  if(PZ.c===i){R(x+2,y+2,4,4,3);R(x+20,y+2,4,4,3);R(x+2,y+20,4,4,3);R(x+20,y+20,4,4,3)}});
 T('A 切換　B 重新洗牌',9,122,2,8);T('點亮全部星星！',9,131,3,8)}
QUESTS.dream={title:'夢幻謎題',offer:'傳說中的「夢幻兔豬皇」只會回應有緣的訓練豬。先收集 10 隻圖鑑，再來解開星夢謎題吧！要接受嗎？',progress:()=>`進度：圖鑑登錄 10 隻（目前 ${dex.size}/10）。達成後再來找我解謎。`,done:()=>dex.size>=10,doneText:'圖鑑夠豐富了！那麼，開始星夢謎題吧！',
 give:async()=>{await say('把 9 顆星星全部點亮！\n（A 切換周圍　B 重新洗牌）');await puzzle();await say('星星全部亮了！粉紅的夢幻光芒灑落……');const m=mon(ULT,30);if(party.length<6){party.push(m);await say(`${m.n}加入了隊伍！`)}else{pcBox.push(m);await say('隊伍滿了，已傳送到電腦盒子！')}dex.add(m.n);FL['s'+ULT]=1;await say(`${m.n}登錄到圖鑑了！（${dex.size}/${ENEMIES.length}）`)}};
NPCS.push(mk('town',11,13,3,'qdream',['夢幻研究員：傳說中的兔豬皇，只有解開星夢謎題的人才能見到。'],null,null,null,null,'dream'));
/* ---- exploration expansion ---- */
const ITEM_CATALOG=window.PIGMON_ITEM_CATALOG;
const ITEM_DATA=ITEM_CATALOG.pickups.base;
const HIDDEN_ROADS={'route:10:4':{name:'風鈴小徑',reveal:()=>{put('route','.',[[11,4],[12,4]]);FL.hiddenRoute=1}}};
ROUTE[4]=ROUTE[4].slice(0,10)+'q'+ROUTE[4].slice(11);
/* ---- v3 world ---- */
const PAL={town:P4.slice(),forest:['#e8e4ff','#a9a0e8','#5a4fb0','#1c1448'],route:['#e4f6ff','#8fd3ff','#2a7fd1','#0a2a5c'],school:['#fff8dc','#ffd98a','#d98a2a','#5a3412'],a2:['#f4ffe6','#b5ec8c','#4fae3c','#1c4a14'],a3:['#fffbd6','#ffe56a','#d9a400','#4a3a00'],a4:['#fff0e4','#ffb07a','#d9482a','#5a1408'],a5:['#f3ece0','#d2b48c','#8a6238','#3a2512'],a6:['#f6fcff','#cfeaf5','#86b4c9','#2c4456'],sea:['#e0fbff','#7fe0e8','#1a98b0','#083a4a'],volc:['#fff0e0','#ff9a5a','#c23a1a','#3a0a0a'],maze:['#f0e8ff','#c8a8ff','#7a4ad0','#2a1058']};
const palOf=n=>PAL[n]||(/^g\d$/.test(n)&&PAL[GYMS[+n[1]].m])||PAL.town;
const put=(n,c,pts)=>pts.forEach(([x,y])=>{
const r=MAPS[n][y];MAPS[n][y]=r.slice(0,x)+c+r.slice(x+1)}),rect=(n,c,a,b,x,y)=>{for(let j=b;j<=y;j++)for(let i=a;i<=x;i++)put(n,c,[[i,j]])};
MAPS.forest=Array.from({length:12},(_,y)=>Array.from({length:20},(_,x)=>(y%11===0||(x%19===0&&y!==6))?'#':(x===13&&y!==6)?'#':(y!==6&&y!==5&&(x*7+y*3)%5===0)?'#':(x<13&&(x*5+y*3)%7<3)?'g':'.').join(''));
put('route','I',[[8,5]]);put('forest','I',[[10,4]]);put('a2','I',[[6,8]]);
Object.assign(WARP,{'town,19,14':['forest',1,6],'forest,0,6':['town',18,14],'forest,19,6':['route',1,6],'route,0,6':['forest',18,6]});
rect('route','w',2,10,4,10);rect('route','w',15,8,17,9);rect('a2','f',2,8,6,9);rect('a2','f',12,8,17,9);rect('a2','w',8,9,11,10);rect('school','f',2,9,4,10);rect('school','f',14,9,17,10);
put('a3','r',[[3,8],[4,9],[16,8],[15,10],[10,9]]);rect('a4','L',3,8,6,9);rect('a4','L',14,9,17,9);rect('a5','r',2,8,5,8);rect('a5','r',13,9,17,9);rect('a6','w',3,8,7,10);rect('a6','w',13,8,16,9);
const wolfTile=(x,y)=>{R(x+2,y+2,3,4,3);R(x+11,y+2,3,4,3);ell(x+8,y+9,7,6,3);ell(x+8,y+9,6,5,1);R(x+4,y+7,2,2,3);R(x+10,y+7,2,2,3);R(x+7,y+10,2,2,3);R(x+6,y,4,2,2)};
const moonWolf=(cx,cy)=>{wolf(cx,cy);ell(cx+14,cy-22,5,5,2);ell(cx+16,cy-23,4,4,0)};
const wolfD=['拜月狼：嗷嗚——月光下的森林，只有我這一隻！','想通過這裡，先打倒我！'];
NPCS.push(Object.assign(mk('forest',13,6,3,'wolf',wolfD,{n:'拜月狼',lv:5,b:{n:'拜月狼',hp:28,atk:5,d:moonWolf}},['拜月狼：嗚……月光認可你了。','森林的出口開啟了！'],wolfD[0]),{sp:wolfTile,hide:1}));
ENEMIES.push(...CREATURE_DATA.enemies.yuTuTu.map(e=>createEnemy(e)));
MOVES.push(...MOVE_DATA.moves.yuBase.map(m=>({...m})));SPECIES_MOVES[108]=[0,26,27,28];
/* ===== 鈺兔兔專屬招式庫（玩家持有時套用）===== */
const YU_SET=MOVE_DATA.moves.yuSpecial.map(m=>MOVES.push({...m})-1);
const YU_TUTU_SPEED=999;
const YU_STORY_MOVES=Object.fromEntries(MOVE_DATA.moves.yuStory.map(m=>[m.path,MOVES.push({...m})-1]));
const yuStoryMove=()=>FL.yuStoryDone&&YU_STORY_MOVES[FL.yuPath];
const yuMoveSet=()=>[...YU_SET,...(yuStoryMove()!=null?[yuStoryMove()]:[])];
const yuActive=()=>party.find(m=>m.s===108);
function yuFix(m){if(m&&m.s===108){m.speed=YU_TUTU_SPEED;const set=yuMoveSet();if(!m.mv||m.mv.join()!==set.join())m.mv=set.slice();m.maxpp=m.mv.map((i,k)=>m.maxpp?.[k]??MOVES[i]?.pp??99);m.pp=m.maxpp.slice()}return m}
async function yuStoryTalk(){
 S.mode='event';const y=yuActive();
 if(!y){await say('老師：等鈺兔兔來到隊伍裡，星學堂的星光才會再次亮起。');S.mode='map';return}
 if(!FL.yuMemory){
  await say('老師：鈺兔兔，你還記得自己為什麼會來到星學堂嗎？');await say('鈺兔兔的耳尖亮起微光，腦海裡浮現一片落滿星塵的月夜。');
  await say('老師：那道光正在等待你的選擇。你想讓鈺兔兔成為哪一種守護者？');
  const c=await choose(['星光守護者','夢境守護者'],1,'right');FL.yuPath=c===0?'star':'dream';FL.yuMemory=1;y.love=Math.min(100,(y.love||0)+10);
  await say(c===0?'鈺兔兔追著星光跳了一圈，額頭浮現小小星冠。':'鈺兔兔抱住月影打了個呵欠，夢境像柔軟的棉花一樣展開。');await say('老師：帶牠在夜晚前往月影森林吧，森林會告訴你下一步。');
 }else if(!FL.yuNight){
  await say('老師：星學堂的鐘聲還在等月影森林的回音。請在夜晚帶著鈺兔兔前往月影森林。');
 }else if(!FL.yuStoryDone){
  if((y.love||0)<50){await say(`老師：鈺兔兔還需要更多陪伴。（目前親密度 ${y.love||0}/50）`);await say('一起冒險、戰鬥或在城鎮行走，都能增加親密度。');S.mode='map';return}
  await say('老師：你們已經聽見森林的答案了。現在，請決定鈺兔兔要守護哪一種力量。');
  await say(FL.yuPath==='star'?'星光在窗邊凝成一枚耀眼的護符。':'月影在地板上鋪成一片溫柔的夢。');
  FL.yuStoryDone=1;yuFix(y);y.love=Math.min(100,(y.love||0)+10);
  await say(FL.yuPath==='star'?'鈺兔兔覺醒為星冠守護者！解鎖「星冠守護・星願落幕」，光屬性傷害提升。':'鈺兔兔覺醒為夢境守護者！解鎖「夢境擁抱・月兔安眠」，受到致命傷害時將以半血甦醒。');
 }else await say(FL.yuPath==='star'?'鈺兔兔：星星都在替我們帶路！':'鈺兔兔：噓……讓大家做個好夢吧。');
 S.mode='map';
}
const SQ=[['水系怪物最怕哪個屬性？',['火','電','暗'],1],['兔子的長耳朵有什麼用？',['散熱聽遠處','能飛行','變蘿蔔'],0],['光屬性對誰效果絕佳？',['火','冰','暗'],2]];
async function teach(){S.mode='event';if(FL.yu){await say('老師：你是班上的第一名！鈺兔兔就拜託你照顧囉。');return}
 await say('老師：我要出三題！答案都藏在三位同學的話裡，去問問他們吧。');
 for(const[q,o,a]of SQ){await say('老師：'+q);S.prompt='請選擇\n答案';if(await choose(o,1,'right')!==a){await say('老師：不對喔，再去聽聽同學怎麼說！');return}await say('老師：答對了！')}
 FL.yu=1;await say('三題全對！老師送你一位特別的同學——');const m=mon(108,16);if(party.length<6){party.push(m);await say('鈺兔兔加入了隊伍！')}else{pcBox.push(m);await say('隊伍滿了，已傳送到電腦盒子！')}
 dex.add(m.n);FL['s108']=1;await say(`獲得隱藏怪物「鈺兔兔」！圖鑑登錄！（${dex.size}/${ENEMIES.length}）`)}
[[5,8,'小米','水系怪物最怕電屬性，被電到會麻麻的！'],[9,8,'阿福','兔子的長耳朵可以散熱，也能聽見很遠的聲音。'],[13,8,'小綠','光屬性最會對付暗屬性，暗系怪物都怕它！']].forEach(([x,y,n,t],i)=>{put('school','.',[[x,y]]);NPCS.push(mk('school',x,y,i+1,'st'+i,[`學生${n}：我來分享一個知識！`,t]))});
 put('school','.',[[9,5]]);NPCS.push(Object.assign(mk('school',9,5,3,'teacher',['老師：…']),{fn:async()=>{if(!FL.yu)await teach();else await yuStoryTalk()}}));
const EGG=[['forest',15,9,3,9,'月影森林','森林守護者：月亮最亮的夜晚，蘑菇會發光。能幫我找到「月光蘑菇」嗎？','月光蘑菇'],['route',3,5,17,10,'藍濱水族城','館員：水槽裡的小魚唱歌時掉了顆「珍珠貝殼」，能幫我找嗎？','珍珠貝殼'],['school',3,5,16,10,'星學堂','校工：操場角落埋著一枚「星星獎章」，能幫我挖出來嗎？','星星獎章'],['a2',3,5,16,10,'花語城','花園婆婆：花叢深處有一朵會發光的「發光花苞」。','發光花苞'],['a3',3,5,16,10,'雷鳴城','電工：我的「備用電池」掉在城裡的角落了。','備用電池'],['a4',3,5,16,10,'烈焰城','鐵匠：我的「火種寶石」弄丟了，就在城裡某處。','火種寶石'],['a5',3,5,16,10,'礦石城','礦工：我在岩縫間藏了一顆「彩虹礦石」。','彩虹礦石'],['a6',3,5,16,10,'冰晶城','雪人：我的「冰藍圍巾」被風吹到角落去了。','冰藍圍巾']];
EGG.forEach(([m,nx,ny,ex,ey,cn,offer,item],i)=>{const k=`secret:${m}:${ex}:${ey}`;put(m,'.',[[nx,ny]]);put(m,'E',[[ex,ey]]);
 SECRETS[k]={title:item,lines:[`你在${cn}找到了「${item}」！`,'它閃閃發光，帶來好運！'],reward:['maxhp','exp','heal','exp','maxhp','heal','exp','maxhp'][i]};
 QUESTS['e'+m]={title:cn+'彩蛋',offer,progress:()=>`進度：找到「${item}」（${FL[k]?'已完成':'尚未完成'}）。`,done:()=>!!FL[k],give:async()=>{BAG.coins+=150;await say('獲得 150 枚金幣！')},doneText:'太感謝了！這是謝禮！'};
 NPCS.push(mk(m,nx,ny,2,'qe'+m,['居民：…'],null,null,null,null,'e'+m))});
/* ---- v4 ---- */
const SFXR=[[/效果絕佳/,'super'],[/恢復了/,'heal'],[/沒有命中/,'miss'],[/成為了朋友/,'catch'],[/升級了/,'level'],[/經驗值/,'win'],[/使出了/,'move']];
Object.defineProperty(BAG,'feed',{get:()=>99,set:()=>{},enumerable:true});
const mvL=(p,a,y)=>{const n=a.map(moveLabel);[0,2].forEach(j=>n.length>j&&T((j?'　　　':p)+n.slice(j,j+2).join('／'),9,y+j*4,3,7))};
rect('a2','.',8,9,9,10);
[['a2',1],['a3',1],['a4',0],['a5',1],['a6',0]].forEach(([m,t])=>{if(t){rect(m,'#',7,4,7,8);rect(m,'#',13,5,13,10);put(m,'.',[[13,4]])}else{rect(m,'#',5,5,5,10);rect(m,'#',12,4,12,9);put(m,'.',[[5,4],[12,10]])}});
rect('forest','#',6,1,6,8);rect('forest','#',9,3,9,10);put('forest','.',[[6,9],[6,10],[9,1],[9,2]]);[7,8,10,11,12].forEach(x=>{for(let y=1;y<=10;y++)if(MAPS.forest[y][x]==='#')put('forest','.',[[x,y]])});
const legTile=id=>(x,y)=>{const r=ENEMIES[id].n.includes('兔');ell(x+8,y+10,6,5,3);ell(x+8,y+10,5,4,0);if(r){R(x+4,y,3,7,3);R(x+9,y,3,7,3)}else{R(x+3,y+3,3,3,3);R(x+10,y+3,3,3,3)}R(x+5,y+9,2,2,3);R(x+9,y+9,2,2,3);R(x+7,y+12,2,1,2);R(x+1,y+1,2,2,2);R(x+13,y+1,2,2,2)};
[[7,'a4',17,1,'a4'],[61,'a2',17,1,'school'],[63,'sea',13,2,'sea'],[64,'volc',17,4,'volc'],[105,'a6',17,1,'a6'],[106,'a3',17,1,'a3']].forEach(([id,m,ex,ey,pk],k)=>{const n='L'+k,q=ENEMIES[id];
 MAPS[n]=Array.from({length:10},(_,y)=>Array.from({length:11},(_,x)=>(y===9?x!==5:(y===0||x%10===0))?'#':[[3,3],[7,3],[3,6],[7,6]].some(([a,b])=>a===x&&b===y)?'#':'.').join(''));PAL[n]=PAL[pk];
 put(m,'G',[[ex,ey]]);WARP[`${m},${ex},${ey}`]=[n,5,8];WARP[`${n},5,9`]=[m,ex,ey+1];
 NPCS.push(Object.assign(mk(n,5,3,3,'leg'+id,['…']),{sp:legTile(id),hide:1,fn:async()=>{S.mode='event';await say(`${q.n}靜靜地注視著你……`);await say(`${q.n}發出震天的怒吼！`);await battle(0,0,id)}}))});
put('town','H',[[14,6],[16,6],[14,7],[16,7]]);put('town','T',[[15,6]]);put('town','S',[[15,7]]);put('town','.',[[15,8]]);
MAPS.shop=MAP_LAYOUTS.shop;put('shop','H',[[3,3],[5,3]]);
Object.assign(WARP,{'town,15,7':['shop',4,7],'shop,4,8':['town',15,8]});Object.assign(NPCS.find(n=>n.shop),{m:'shop',x:4,y:3});
for(const m of ['route','school','a2','a3','a4','a5','a6'])NPCS.push(mk(m,m==='route'?6:5,5,2,'shop_'+m,['雜貨店老闆：歡迎光臨！'],null,null,null,null,null,'store'));

/* ---- v5 ---- */
[['route',9,11,'school',9,0],['a2',15,11,'a3',2,0],['a4',18,0,'a5',2,11]].forEach(([a,xa,ya,b,xb,yb])=>{delete WARP[`${a},19,6`];delete WARP[`${b},0,6`];put(a,'#',[[19,6]]);put(b,'#',[[0,6]]);put(a,'.',[[xa,ya]]);put(b,'.',[[xb,yb]]);WARP[`${a},${xa},${ya}`]=[b,xb,yb?yb-1:1];WARP[`${b},${xb},${yb}`]=[a,xa,ya?ya-1:1]});
const RARE=CREATURE_DATA.rareIds,TMV={},LEARN2={};
[...new Set(RARE.map(i=>ENEMIES[i].t))].forEach(t=>{TMV[t]=MOVE_DATA.rareTemplates.map(([n,p,a])=>MOVES.push({n:t+n,p,a,y:t})-1)});
RARE.forEach((i,k)=>{const e=ENEMIES[i],big=!(i>=95&&i<=104),o=[0,1,2].map(j=>TMV[e.t][(j+k)%3]),g=MOVES.push({n:e.n.slice(0,2)+MOVE_DATA.rareNameSuffixes[k%5],p:big?40+(k%3)*6:22+(k%3)*3,a:.9,y:e.t})-1,b=big?26:0;
 LEARN2[i]={[b+6+k%3]:o[0],[b+12+k%3]:o[1],[b+18+k%2]:o[2],[b+24+k%4]:g}});
const movesFor=(s,lv)=>{const b=movesFor0(s,lv),T=LEARN2[s];if(!T||SPECIES_MOVES[s])return b;const a=[...new Set([...b,...Object.keys(T).filter(l=>+l<=lv).sort((x,y)=>x-y).map(l=>T[l])])];return a.length>4?[a[0],...a.slice(-3)]:a};
/* ---- mine / volcano interior expansion ---- */
PAL.mine=['#efe8dc','#c4a77d','#76533b','#291c19'];PAL.volcIn=['#fff0df','#ff8e51','#a52b20','#3a0b0b'];
const mineMap=MAP_LAYOUTS.mine;
const volcInMap=MAP_LAYOUTS.volcIn;
MAPS.mine=mineMap;MAPS.volcIn=volcInMap;
const mineBase=ENEMIES.length;
const mineMoves=MOVES.push(...MOVE_DATA.moves.mine.map(m=>({...m})))-4;
ENEMIES.push(...CREATURE_DATA.enemies.mine.map(e=>createEnemy(e)));
const MINE_IDS=[mineBase,mineBase+1],VOLCIN_IDS=[mineBase+2,mineBase+3];
SPECIES_MOVES[mineBase]=[0,mineMoves,6];SPECIES_MOVES[mineBase+1]=[0,mineMoves+1,14];SPECIES_MOVES[mineBase+2]=[0,mineMoves+2,11];SPECIES_MOVES[mineBase+3]=[0,mineMoves+3,12];
WARP['a5,10,10']=['mine',1,1];WARP['mine,18,11']=['a5',10,11];WARP['volc,10,8']=['volcIn',1,1];WARP['volcIn,1,4']=['volc',10,9];
put('a5','D',[[10,10]]);put('volc','D',[[10,8]]);put('mine','D',[[18,11]]);put('volcIn','D',[[1,4]]);
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.mineVolcano);
put('mine','I',[[5,6]]);put('volcIn','I',[[17,11]]);
SECRETS['secret:mine:8:3']={title:'礦工的古老銘牌',lines:['礦壁上刻著一枚古老銘牌。','銘牌化作力量，隊伍全員最大體力提升 4 點！'],reward:'minehp'};
SECRETS['secret:volcIn:12:5']={title:'火山心焰',lines:['岩漿深處傳來心跳般的聲音。','小豬取得火山祝福，火屬性招式威力提升！'],reward:'volcbuff'};
put('mine','E',[[8,3]]);put('volcIn','E',[[12,5]]);
QUESTS.mine={title:'地下礦坑調查',offer:'礦工回報地下礦坑出現會發光的晶簇，能幫忙調查嗎？',progress:()=>`進度：找到古老銘牌（${FL['secret:mine:8:3']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:mine:8:3'],doneText:'礦坑的秘密終於揭開了！',give:async()=>{BAG.coins+=220;await say('獲得 220 枚金幣！')}};
QUESTS.volcIn={title:'火山內部探勘',offer:'火山內部的心焰正在衰弱，請找到火山心焰。',progress:()=>`進度：找到火山心焰（${FL['secret:volcIn:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:volcIn:12:5'],doneText:'火山重新恢復了活力！',give:async()=>{BAG.coins+=300;await say('獲得 300 枚金幣！')}};
const mineWild=()=>MINE_IDS.map(i=>ENEMIES[i]),volcInWild=()=>VOLCIN_IDS.map(i=>ENEMIES[i]);
NPCS.push(mk('a5',11,10,2,'qmine',['礦工：地下礦坑的礦脈最近一直發出奇怪的光。'],null,null,null,null,'mine'));NPCS.push(mk('volc',11,8,2,'qvolcIn',['火山觀測員：火山內部的心焰快要熄滅了。'],null,null,null,null,'volcIn'));
/* ---- ice cave / abandoned lab expansion ---- */
PAL.iceCave=['#f3fbff','#b8e9ff','#4389b5','#17324b'];PAL.lab=['#edf1f2','#aab6bd','#4c5b63','#172126'];
const iceCaveMap=MAP_LAYOUTS.iceCave;const labMap=MAP_LAYOUTS.lab;MAPS.iceCave=iceCaveMap;MAPS.lab=labMap;
const newBase=ENEMIES.length;
const newMoves=MOVES.push(...MOVE_DATA.moves.iceLab.map(m=>({...m})))-4;
ENEMIES.push(...CREATURE_DATA.enemies.iceLab.map(e=>createEnemy(e)));
const ICE_IDS=[newBase,newBase+1],LAB_IDS=[newBase+2,newBase+3];
SPECIES_MOVES[newBase]=[0,newMoves,14];SPECIES_MOVES[newBase+1]=[0,newMoves+1,14];SPECIES_MOVES[newBase+2]=[0,newMoves+3,13];SPECIES_MOVES[newBase+3]=[0,newMoves+2,10];
WARP['a6,10,10']=['iceCave',1,1];WARP['iceCave,18,11']=['a6',10,11];WARP['school,10,10']=['lab',1,1];WARP['lab,18,11']=['school',10,11];
put('a6','D',[[10,10]]);put('iceCave','D',[[18,11]]);put('school','D',[[10,10]]);put('lab','D',[[18,11]]);
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.labAndMine);
put('mine','I',[[15,10],[3,10]]);put('volcIn','I',[[3,11],[15,9]]);put('iceCave','I',[[17,11]]);put('lab','I',[[16,9]]);
const ROCK_PUZZLES={
 'mine:10:8':{title:'礦坑推石機關',stone:[1,2],goal:[3,2],reward:()=>{BAG.coins+=260}},
 'volcIn:9:6':{title:'火山熔岩閘門',stone:[1,2],goal:[3,2],reward:()=>{FL.volcGate=1}},
 'iceCave:10:8':{title:'冰晶推石滑道',stone:[1,2],goal:[3,2],reward:()=>{BAG.superFeed++}},
 'lab:9:6':{title:'研究所電源機關',stone:[1,2],goal:[3,2],reward:()=>{FL.labPower=1}}
};
Object.keys(ROCK_PUZZLES).forEach(k=>{const [m,x,y]=k.split(':');put(m,'P',[[+x,+y]])});
async function rockPuzzle(key){const q=ROCK_PUZZLES[key];if(!q||FL['rock:'+key])return;S.mode='event';let [x,y]=q.stone;await say(`${q.title}：把礦石推到發光的目標格！`);for(let i=0;i<12;i++){S.prompt=`礦石位置 ${x},${y}
選擇推動方向`;const c=await choose(['上','下','左','右','放棄'],1,'right',true);if(c<0||c===4){await say('你暫時放棄了推石機關。');S.mode='map';return}const d=[[0,-1],[0,1],[-1,0],[1,0]][c],nx=x+d[0],ny=y+d[1];if(nx<0||nx>4||ny<0||ny>4){await say('前方被岩壁擋住了！');continue}x=nx;y=ny;if(x===q.goal[0]&&y===q.goal[1]){FL['rock:'+key]=1;q.reward();await say('礦石嵌入目標格，機關啟動了！獲得專屬獎勵！');S.mode='map';return}}await say('機關暫時沒有反應，之後還可以再挑戰。');S.mode='map'}
SECRETS['secret:iceCave:12:5']={title:'冰窟月輪',lines:['冰壁中封著一輪淡藍色月輪。','隊伍全員恢復體力，冰屬性招式威力提升！'],reward:'icebuff'};
SECRETS['secret:lab:12:5']={title:'研究所主機',lines:['廢棄主機突然重新啟動。','研究資料解鎖了新的稀有遭遇！'],reward:'labrare'};
put('iceCave','E',[[12,5]]);put('lab','E',[[12,5]]);
QUESTS.iceCave={title:'冰晶洞窟探查',offer:'冰晶洞窟深處傳來奇怪的月光，請找出來源。',progress:()=>`進度：找到冰窟月輪（${FL['secret:iceCave:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:iceCave:12:5'],doneText:'冰窟的月輪恢復了光芒！',give:async()=>{BAG.coins+=260;await say('獲得 260 枚金幣！')}};
QUESTS.lab={title:'廢棄研究所調查',offer:'研究所的主機仍有微弱電力，請找出主控制室。',progress:()=>`進度：重新啟動研究所主機（${FL['secret:lab:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:lab:12:5'],doneText:'研究所的資料重新恢復了！',give:async()=>{BAG.coins+=320;await say('獲得 320 枚金幣！')}};
const iceWild=()=>ICE_IDS.map(i=>ENEMIES[i]),labWild=()=>LAB_IDS.map(i=>ENEMIES[i]);
NPCS.push(mk('a6',11,10,2,'qice',['守洞人：冰晶洞窟裡的月輪正在發光。'],null,null,null,null,'iceCave'));NPCS.push(mk('school',11,10,2,'qlab',['研究員：廢棄研究所的主機似乎還能運作。'],null,null,null,null,'lab'));
/* ---- ancient ruins / dream space expansion ---- */
PAL.ruins=['#f3ecdc','#d6bd83','#90713f','#3b2a17'];PAL.dreamSpace=['#f4eaff','#c9a5f5','#7650b5','#241344'];
const ruinsMap=MAP_LAYOUTS.ruins;const dreamSpaceMap=MAP_LAYOUTS.dreamSpace;MAPS.ruins=ruinsMap;MAPS.dreamSpace=dreamSpaceMap;
const extraBase=ENEMIES.length;
const extraMoves=MOVES.push(...MOVE_DATA.moves.ruinsDream.map(m=>({...m})))-4;
ENEMIES.push(...CREATURE_DATA.enemies.ruinsDream.map(e=>createEnemy(e)));
const RUINS_IDS=[extraBase,extraBase+1],DREAM_IDS=[extraBase+2,extraBase+3];
SPECIES_MOVES[extraBase]=[0,extraMoves,6];SPECIES_MOVES[extraBase+1]=[0,extraMoves+1,15];SPECIES_MOVES[extraBase+2]=[0,extraMoves+2,15];SPECIES_MOVES[extraBase+3]=[0,extraMoves+3,12];
WARP['a5,8,4']=['ruins',1,1];WARP['ruins,18,11']=['a5',8,5];WARP['town,10,13']=['dreamSpace',1,1];WARP['dreamSpace,18,11']=['town',10,14];
put('a5','D',[[8,4]]);put('ruins','D',[[18,11]]);put('town','D',[[10,13]]);put('dreamSpace','D',[[18,11]]);
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.ruinsDream);
put('ruins','I',[[16,9],[3,11]]);put('dreamSpace','I',[[16,9],[3,11]]);
Object.assign(ROCK_PUZZLES,{'ruins:15:6':{title:'古代石門推石機關',stone:[1,2],goal:[3,2],reward:()=>{FL.ruinsDoor=1;BAG.coins+=350}},'dreamSpace:8:6':{title:'夢境漂浮石機關',stone:[1,2],goal:[3,2],reward:()=>{FL.dreamDoor=1;BAG.superFeed++}}});
Object.keys(ROCK_PUZZLES).filter(k=>k.startsWith('ruins:')||k.startsWith('dreamSpace:')).forEach(k=>{const[m,x,y]=k.split(':');put(m,'P',[[+x,+y]])});put('ruins','.',[[10,6]]);
SECRETS['secret:ruins:12:5']={title:'古代星盤',lines:['古代星盤開始轉動，照亮了遺跡深處。','隊伍全員防禦與特防提升 2 點！'],reward:'ruinsbuff'};
SECRETS['secret:dreamSpace:12:5']={title:'夢境核心',lines:['夢境核心與小豬的心跳同步。','光與暗屬性招式威力提升！'],reward:'dreambuff'};
put('ruins','E',[[12,5]]);put('dreamSpace','E',[[12,5]]);
QUESTS.ruins={title:'古代遺跡探索',offer:'古代遺跡的星盤重新發光了，請找出它的啟動方式。',progress:()=>`進度：找到古代星盤（${FL['secret:ruins:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:ruins:12:5'],doneText:'古代星盤已經恢復運轉！',give:async()=>{BAG.coins+=380;await say('獲得 380 枚金幣！')}};
QUESTS.dreamSpace={title:'夢境核心調查',offer:'夢境空間正在崩解，請找到深處的夢境核心。',progress:()=>`進度：找到夢境核心（${FL['secret:dreamSpace:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:dreamSpace:12:5'],doneText:'夢境空間穩定下來了！',give:async()=>{BAG.coins+=420;await say('獲得 420 枚金幣！')}};
const ruinsWild=()=>RUINS_IDS.map(i=>ENEMIES[i]),dreamWild=()=>DREAM_IDS.map(i=>ENEMIES[i]);
NPCS.push(mk('a5',9,4,2,'qruins',['遺跡學者：古代遺跡的星盤又開始轉動了。'],null,null,null,null,'ruins'));NPCS.push(mk('town',10,12,2,'qdreamSpace',['夢境研究員：夢境空間正在呼喚新的訪客。'],null,null,null,null,'dreamSpace'));
/* ---- undersea cave / vehicles expansion ---- */
PAL.undersea=['#dffaff','#82dce6','#258caa','#07394a'];
const underseaMap=MAP_LAYOUTS.undersea;MAPS.undersea=underseaMap;
const seaBase=ENEMIES.length;
const seaMoves=MOVES.push(...MOVE_DATA.moves.undersea.map(m=>({...m})))-4;
ENEMIES.push(...CREATURE_DATA.enemies.undersea.map(e=>createEnemy(e)));
const UNDERSEA_IDS=[seaBase,seaBase+1,seaBase+2,seaBase+3];
SPECIES_MOVES[seaBase]=[0,seaMoves,8];SPECIES_MOVES[seaBase+1]=[0,seaMoves,14];SPECIES_MOVES[seaBase+2]=[0,seaMoves+2,16];SPECIES_MOVES[seaBase+3]=[0,seaMoves+3,12];
WARP['sea,12,10']=['undersea',1,1];WARP['undersea,18,11']=['sea',12,11];put('sea','D',[[12,10]]);put('undersea','D',[[18,11]]);
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.undersea);put('undersea','I',[[16,9],[3,11]]);
SECRETS['secret:undersea:12:5']={title:'海底古鐘',lines:['海底古鐘敲出悠遠的聲音。','水屬性招式威力提升，隊伍獲得深海祝福！'],reward:'seabuff'};put('undersea','E',[[12,5]]);
QUESTS.undersea={title:'海底洞窟探勘',offer:'海底古鐘停止了鳴響，請到洞窟深處調查。',progress:()=>`進度：找到海底古鐘（${FL['secret:undersea:12:5']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:undersea:12:5'],doneText:'海底古鐘重新響起了！',give:async()=>{BAG.coins+=460;await say('獲得 460 枚金幣！')}};
NPCS.push(mk('sea',11,10,2,'qundersea',['潛水員：海底洞窟入口附近的潮汐變得很奇怪。'],null,null,null,null,'undersea'));
const underseaWild=()=>[...UNDERSEA_IDS,...(typeof SEA_RELIC_IDS==='undefined'?[]:SEA_RELIC_IDS)].map(i=>ENEMIES[i]);
	 /* ---- v7 biome-exclusive monsters / rare loot ---- */
	 const abyssKelp=(cx,cy)=>{slime(cx,cy);for(let i=-2;i<=2;i++){evoPixel(cx+i*6,cy-19-Math.abs(i)*2,3,10,i%2?1:2)}evoPixel(cx-5,cy-2,3,3,3);evoPixel(cx+5,cy-2,3,3,3)};
	 const coralRay=(cx,cy)=>{bunny(cx,cy);evoPoly([[cx-16,cy+3],[cx-29,cy-4],[cx-20,cy+8]],'#55aec5');evoPoly([[cx+16,cy+3],[cx+29,cy-4],[cx+20,cy+8]],'#55aec5');evoPixel(cx-2,cy+8,4,3,'#fff8d6')};
	 const tideBoar=(cx,cy)=>{cutePig(cx,cy);evoRing(cx,cy+4,18,'#8bdcf0',2);evoPixel(cx-18,cy+4,4,3,'#267caa');evoPixel(cx+15,cy-2,4,3,'#267caa')};
	 const mossWisp=(cx,cy)=>{jelly(cx,cy);for(let i=0;i<4;i++){evoPixel(cx-12+i*8,cy+13+(i%2)*3,3,8,'#83cc62')}evoRing(cx,cy-5,12,'#fff3a8',2)};
	 const moonMoth=(cx,cy)=>{bee(cx,cy);evoPoly([[cx-8,cy-4],[cx-25,cy-18],[cx-19,cy+2]],'#b4d875');evoPoly([[cx+8,cy-4],[cx+25,cy-18],[cx+19,cy+2]],'#b4d875');evoRing(cx,cy-18,5,'#fff0a8',2)};
	 const groveStag=(cx,cy)=>{wolf(cx,cy);evoPoly([[cx-13,cy-20],[cx-25,cy-31],[cx-20,cy-18],[cx-31,cy-23],[cx-18,cy-12]],'#83bd72');evoPoly([[cx+13,cy-20],[cx+25,cy-31],[cx+20,cy-18],[cx+31,cy-23],[cx+18,cy-12]],'#83bd72');evoPixel(cx-3,cy-2,3,3,'#fff3a8');evoPixel(cx+5,cy-2,3,3,'#fff3a8')};
	 const biomeBase=ENEMIES.length;
	 const biomeMoves=MOVES.push(...MOVE_DATA.moves.biome.map(m=>({...m})))-6;
	 ENEMIES.push(...CREATURE_DATA.enemies.biome.map(e=>createEnemy(e,{abyssKelp:abyssKelp,coralRay:coralRay,tideBoar:tideBoar,mossWisp:mossWisp,moonMoth:moonMoth,groveStag:groveStag})));
	 const BIOME_IDS=[biomeBase,biomeBase+1,biomeBase+2,biomeBase+3,biomeBase+4,biomeBase+5],SEA_RELIC_IDS=BIOME_IDS.slice(0,3),FOREST_RELIC_IDS=BIOME_IDS.slice(3);
	 SPECIES_MOVES[biomeBase]=[0,biomeMoves,8];SPECIES_MOVES[biomeBase+1]=[0,biomeMoves+1,10];SPECIES_MOVES[biomeBase+2]=[0,biomeMoves+2,12];SPECIES_MOVES[biomeBase+3]=[0,biomeMoves+3,8];SPECIES_MOVES[biomeBase+4]=[0,biomeMoves+4,10];SPECIES_MOVES[biomeBase+5]=[0,biomeMoves+5,12];
	 const RARE_LOOT=Object.fromEntries(Object.entries(ITEM_CATALOG.rareDropsByOffset).map(([i,d])=>[biomeBase+Number(i),d]));
	 BAG.rareDrops=BAG.rareDrops||{};
	 function tryRareDrop(E){const drop=RARE_LOOT[E.s];if(!drop||Math.random()>.24)return false;BAG.rareDrops[drop[0]]=(BAG.rareDrops[drop[0]]||0)+1;return drop}
	 Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.biomeMaterials);
	 
const CARTS={'mine:4:11':[[3,1],[15,10]],'volcIn:9:8':[[2,1],[16,10]]};
const LIFTS={'mine:10:1':[[10,11]],'mine:10:11':[[10,1]],'volcIn:9:1':[[9,10]],'volcIn:9:10':[[9,1]],'lab:9:1':[[9,10]],'lab:9:10':[[9,1]]};
async function rideCart(key){const stops=CARTS[key];if(!stops)return;S.mode='event';const o=stops.map((p,i)=>`礦車站 ${i+1}（${p[0]},${p[1]}）`);o.push('不搭乘');const c=await choose(o,1,'right',true);if(c<0||c===stops.length){S.mode='map';return}Pl.x=stops[c][0];Pl.y=stops[c][1];await say('礦車沿著軌道飛馳，抵達新的礦道！');S.mode='map'}
async function useLift(key){const stops=LIFTS[key];if(!stops)return;S.mode='event';const c=await choose(['啟動升降梯','取消'],1,'right',true);if(c===0){Pl.x=stops[0][0];Pl.y=stops[0][1];await say('升降梯緩緩移動，抵達另一層！')}S.mode='map'}
put('mine','K',[[4,11]]);put('volcIn','K',[[9,8]]);put('mine','U',[[10,1],[10,11]]);put('volcIn','U',[[9,1],[9,10]]);put('lab','U',[[9,1],[9,10]]);
/* ---- multi-area map completion ---- */
PAL.underseaDeep=['#d8f7ff','#65c7dc','#1b6e91','#062c43'];PAL.trench=['#c7eff6','#4aa0ba','#17556f','#041d32'];PAL.forestDeep=['#e5f4dc','#83bd72','#38734a','#173523'];PAL.forestGrove=['#eff9d7','#b4d875','#5a9444','#203b26'];PAL.ruins2=['#efe3c5','#c59e5c','#72522f','#2d2015'];PAL.dreamBranch=['#eee4ff','#b99ae8','#67459f','#211039'];PAL.dreamCore=['#fff0ff','#ee9bdc','#9e3c8e','#381333'];PAL.labUnderground=['#e5eaeb','#87969d','#3e4b53','#121b20'];
const underseaDeepMap=MAP_LAYOUTS.underseaDeep,trenchMap=MAP_LAYOUTS.trench,forestDeepMap=MAP_LAYOUTS.forestDeep,forestGroveMap=MAP_LAYOUTS.forestGrove,ruins2Map=MAP_LAYOUTS.ruins2,dreamBranchMap=MAP_LAYOUTS.dreamBranch,dreamCoreMap=MAP_LAYOUTS.dreamCore,labUndergroundMap=MAP_LAYOUTS.labUnderground;
MAPS.underseaDeep=underseaDeepMap;MAPS.trench=trenchMap;MAPS.forestDeep=forestDeepMap;MAPS.forestGrove=forestGroveMap;MAPS.ruins2=ruins2Map;MAPS.dreamBranch=dreamBranchMap;MAPS.dreamCore=dreamCoreMap;MAPS.labUnderground=labUndergroundMap;
WARP['undersea,10,1']=['underseaDeep',1,1];WARP['underseaDeep,18,11']=['undersea',10,2];WARP['underseaDeep,10,1']=['trench',1,1];WARP['trench,18,11']=['underseaDeep',10,2];
WARP['forest,10,1']=['forestDeep',1,1];WARP['forestDeep,18,11']=['forest',10,2];WARP['forestDeep,10,1']=['forestGrove',1,1];WARP['forestGrove,18,11']=['forestDeep',10,2];
WARP['ruins,10,1']=['ruins2',1,1];WARP['ruins2,18,11']=['ruins',10,2];WARP['dreamSpace,10,1']=['dreamBranch',1,1];WARP['dreamBranch,18,11']=['dreamSpace',10,2];WARP['dreamBranch,10,1']=['dreamCore',1,1];WARP['dreamCore,18,11']=['dreamBranch',10,2];
WARP['lab,10,1']=['labUnderground',1,1];WARP['labUnderground,18,11']=['lab',10,2];
put('undersea','D',[[10,1]]);put('underseaDeep','D',[[18,11],[10,1]]);put('trench','D',[[18,11]]);put('forest','D',[[10,1]]);put('forestDeep','D',[[18,11],[10,1]]);put('forestGrove','D',[[18,11]]);put('ruins','D',[[10,1]]);put('ruins2','D',[[18,11]]);put('dreamSpace','D',[[10,1]]);put('dreamBranch','D',[[18,11],[10,1]]);put('dreamCore','D',[[18,11]]);put('lab','D',[[10,1]]);put('labUnderground','D',[[18,11]]);
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.deepRegions);
put('underseaDeep','I',[[15,10]]);put('trench','I',[[3,10]]);put('forestDeep','I',[[15,10]]);put('forestGrove','I',[[3,10]]);put('ruins2','I',[[15,10]]);put('dreamBranch','I',[[3,10]]);put('dreamCore','I',[[15,10]]);put('labUnderground','I',[[3,10]]);
/* ---- final systems completion ---- */
const finalBossBase=ENEMIES.length;
const bossMoves=MOVES.push(...MOVE_DATA.moves.finalBosses.map(m=>({...m})))-5;
ENEMIES.push(...CREATURE_DATA.enemies.finalBosses.map(e=>createEnemy(e)));
const FINAL_BOSSES={underseaDeep:finalBossBase,forestGrove:finalBossBase+1,ruins2:finalBossBase+2,dreamCore:finalBossBase+3,labUnderground:finalBossBase+4};
Object.entries(FINAL_BOSSES).forEach(([m,i])=>{SPECIES_MOVES[i]=[0,bossMoves+(i-finalBossBase),1]});
Object.keys(FINAL_BOSSES).forEach(m=>{const pos={underseaDeep:[15,5],forestGrove:[15,5],ruins2:[15,5],dreamCore:[15,5],labUnderground:[15,5]}[m];put(m,'B',[pos])});
const BOSS_BALANCE={};
BOSS_BALANCE[finalBossBase]={hp:108,atk:20,crit:.08};BOSS_BALANCE[finalBossBase+1]={hp:104,atk:19,crit:.07};BOSS_BALANCE[finalBossBase+2]={hp:118,atk:22,crit:.1};BOSS_BALANCE[finalBossBase+3]={hp:122,atk:23,crit:.12};BOSS_BALANCE[finalBossBase+4]={hp:116,atk:21,crit:.09};
BAG.bossDrops=BAG.bossDrops||{};
const BOSS_DROPS=Object.fromEntries(Object.entries(ITEM_CATALOG.bossDropsByOffset).map(([i,d])=>[finalBossBase+Number(i),d]));
async function giveBossDrops(id){const d=BOSS_DROPS[id];if(!d||FL['drop:'+id])return;FL['drop:'+id]=1;BAG.coins+=d.coins;d.items.forEach(([n,q])=>{BAG.bossDrops[n]=(BAG.bossDrops[n]||0)+q});d.effect&&d.effect();await say(`${d.name}掉落：${d.items.map(x=>x[0]+' ×'+x[1]).join('、')}；金幣 +${d.coins}！`)}
async function forestAftermath(){
 if(FL.forestAftermath>=4)return;S.mode='event';
 if(!FL.forestAftermath){FL.forestAftermath=1;await say('古王倒下後，整座森林安靜得只剩葉片的呼吸聲。');await say('守林人：牠不是被你擊敗，而是終於把沉睡千年的責任交給了下一位守護者。');await say('古王的樹冠裂開，一枚月光種子落在小豬面前。');const c=await choose(['守護月光種子','把種子帶回城鎮研究'],1,'right');if(c===0){FL.forestPact='守護';party.forEach(m=>{m.max+=8;m.hp=m.max});await say('你選擇守護森林。月光種子在掌心發芽，全隊最大體力提升 8 點！')}else{FL.forestPact='研究';BAG.coins+=650;FL.rare=1;await say('你答應帶種子回城。研究員支付 650 枚金幣，稀有遭遇率提升！')}FL.forestRoutesOpen=1;FL.forestAftermath=2;await say('守林人：但古王倒下前留下了三道裂痕，森林正在把外界的恐懼吸進來。');await say('主線第一章「月種之誓」完成。請到樹冠層、苔影森林與古王根室調查裂痕。')}
 if(FL.forestAftermath===2){await say('守林人：樹冠層的風鈴正在倒轉，那是天空裂痕的警報。');await say('月光種子低聲回應：不是敵人，而是被遺忘的森林精靈在哭泣。');const c=await choose(['前往樹冠層尋找精靈','先調查苔影森林的根脈'],1,'right');if(c===0){FL.forestChapter='canopy';BAG.coins+=120;await say('你沿著樹冠吊索前進，風鈴替你指引道路。獲得 120 枚金幣！')}else{FL.forestChapter='moss';party.forEach(m=>m.love=Math.min(100,(m.love||0)+6));await say('你先走進苔影森林，聽見根脈深處的哭聲。全隊親密度提升 6 點！')}FL.forestAftermath=3;await say('主線第二章「裂痕回聲」開啟。兩處秘境都已標記在地圖上。')}
 if(FL.forestAftermath===3){await say('在兩處秘境之間，月光種子突然長出第三片葉子。');await say('森林精靈：古王守護的不是樹木，而是所有迷路的生命。若裂痕合起，外界的道路也會一同消失。');const c=await choose(['留下成為森林盟友','請精靈與城鎮共同守護'],1,'right');if(c===0){FL.forestAlliance='wild';party.forEach(m=>{m.speed=(m.speed||8)+2;m.love=Math.min(100,(m.love||0)+8)});await say('你選擇留下盟約。森林賜予隊伍速度與親密度！')}else{FL.forestAlliance='town';BAG.superFeed+=2;FL.forestRoutesOpen=1;await say('你邀請精靈前往城鎮。獲得 2 個高級飼料，森林道路完全開放！')}FL.forestAftermath=4;await say('主線第三章「新守護者」完成。月影森林與城鎮從此共享守護印記。');S.mode='map'}
 if(FL.forestAftermath===4){await say('守林人：新的守護者，今天的風很溫柔。謝謝你讓森林有了明天。');S.mode='map'}
}
async function mapBoss(){const id=FINAL_BOSSES[cur];if(id===undefined)return;if(FL['boss:'+cur]){S.mode='event';if(await choose(['首領再戰','離開'],1,'right')===0){await say('首領再次展現了幻影！');await battle(0,0,id)}S.mode='map';return}S.mode='event';await say(`${ENEMIES[id].n}守護著這片區域！`);await battle(0,0,id);if(!B||!B.e||B.e.hp>0){S.mode='map';return}FL['boss:'+cur]=1;await giveBossDrops(id);MAP[Pl.y]=MAP[Pl.y].slice(0,Pl.x)+'.'+MAP[Pl.y].slice(Pl.x+1);if(cur==='forestGrove')await forestAftermath();if(cur==='dreamCore'){const ending=await choose(['守護夢境','喚醒現實'],1,'right');if(ending===0){FL.dreamEnding='守護';BAG.superFeed+=2;await say('結局：夢境守護者。夢境與現實和平共存！')}else{FL.dreamEnding='覺醒';BAG.coins+=800;await say('結局：黎明覺醒。小豬帶著夢境寶藏回到現實！')}}await say('區域首領已被擊敗！');S.mode='map'}
const SWITCHES={'trench:10:6':{title:'海溝水位控制盤',open:[['trench',11,6],['trench',12,6]],msg:'水位下降，海溝通道打開了！'},'volcIn:9:7':{title:'熔岩流向開關',open:[['volcIn',10,6],['volcIn',11,6]],msg:'熔岩改道，火山門降下了！'},'labUnderground:9:8':{title:'地下研究所電力開關',open:[['labUnderground',10,8],['labUnderground',11,8]],msg:'電力恢復，連動門解鎖了！'}};
async function switchPuzzle(key){const q=SWITCHES[key];if(!q||FL['switch:'+key])return;S.mode='event';const c=await choose(['啟動開關','取消'],1,'right',true);if(c===0){FL['switch:'+key]=1;q.open.forEach(([m,x,y])=>{const a=MAPS[m];a[y]=a[y].slice(0,x)+'.'+a[y].slice(x+1)});await say(`${q.title}啟動！${q.msg}`)}S.mode='map'}
Object.assign(ITEM_DATA,ITEM_CATALOG.pickups.lateRegions);
function installBiomeLandmarks(){[['trenchEast',16,9],['trenchWest',3,10],['forestCanopy',16,9],['forestMoss',3,10],['forestGrove',16,9]].forEach(([m,x,y])=>put(m,'I',[[x,y]]));[['trenchEast',10,6],['trenchWest',9,6],['forestCanopy',9,6],['forestMoss',10,6]].forEach(([m,x,y])=>put(m,'S',[[x,y]]))}
Object.assign(SWITCHES,{'trenchEast:10:6':{title:'東潮渦流閘門',open:[['trenchEast',11,6],['trenchEast',12,6]],msg:'東潮渦流停止，露出深海寶庫！'},'trenchWest:9:6':{title:'西潮沉船舵輪',open:[['trenchWest',10,6],['trenchWest',11,6]],msg:'沉船舵輪轉動，西側暗流改道！'},'forestCanopy:9:6':{title:'樹冠風鈴陣',open:[['forestCanopy',10,6],['forestCanopy',11,6]],msg:'風鈴奏出旋律，樹冠高橋降下！'},'forestMoss:10:6':{title:'苔影根脈閥',open:[['forestMoss',11,6],['forestMoss',12,6]],msg:'根脈閥門開啟，通往古王根室的道路出現！'}});

const TIME_GATES={'dreamCore:10:5':{open:[18,19,20,21],msg:'夜間夢門開啟，夢境核心顯現！'}};
async function timeGate(key){const q=TIME_GATES[key];if(!q||FL['time:'+key])return;S.mode='event';if(q.open.includes(WORLD.time)){FL['time:'+key]=1;await say(q.msg)}else await say(`夢門目前沉睡中。請在 ${q.open[0]}:00-${q.open.at(-1)}:00 再來。`);S.mode='map'}
const MULTI_PUZZLES={'ruins2:9:8':{title:'遺跡雙石神殿',stones:[[1,2],[1,3]],goals:[[3,2],[3,3]],reward:()=>{BAG.coins+=600}},'dreamCore:9:8':{title:'夢境雙核排列',stones:[[1,2],[1,3]],goals:[[3,2],[3,3]],reward:()=>{BAG.superFeed+=2}}};
async function multiPuzzle(key){const q=MULTI_PUZZLES[key];if(!q||FL['multi:'+key])return;S.mode='event';const st=q.stones.map(a=>[...a]);for(let turn=0;turn<18;turn++){const c=await choose(['推動第一顆','推動第二顆','完成檢查','放棄'],1,'right',true);if(c<0||c===3){await say('你暫時放棄了複合推石機關。');S.mode='map';return}if(c===2){if(st.every((a,i)=>a[0]===q.goals[i][0]&&a[1]===q.goals[i][1])){FL['multi:'+key]=1;q.reward();await say('兩顆石頭同時嵌入目標格，複合機關完成！');S.mode='map';return}await say('石頭位置尚未正確。');continue}const d=await choose(['上','下','左','右'],1,'right',true);if(d<0)continue;const v=[[0,-1],[0,1],[-1,0],[1,0]][d],n=[st[c][0]+v[0],st[c][1]+v[1]];if(n[0]>=0&&n[0]<=4&&n[1]>=0&&n[1]<=4)st[c]=n}await say('機關暫時沒有反應。');S.mode='map'}
const CART_BRANCHES={'mine:4:11':[[3,1],[15,10],[10,1]],'volcIn:9:8':[[2,1],[16,10],[9,1]]};
CARTS['mine:4:11']=CART_BRANCHES['mine:4:11'];CARTS['volcIn:9:8']=CART_BRANCHES['volcIn:9:8'];
async function switchCart(key){FL.cartBranch=FL.cartBranch?0:1;await say(FL.cartBranch?'礦車軌道切換到分岔線！':'礦車軌道切回主線！')}
put('mine','R',[[8,11]]);put('volcIn','R',[[8,8]]);
const oldRideCart=rideCart;rideCart=async function(key){const stops=CART_BRANCHES[key]||CARTS[key];if(!stops)return;S.mode='event';const o=stops.map((p,i)=>`礦車站 ${i+1}（${p[0]},${p[1]}）`);o.push('不搭乘');const c=await choose(o,1,'right',true);if(c<0||c===stops.length){S.mode='map';return}const p=stops[FL.cartBranch?c:Math.min(c,1)];Pl.x=p[0];Pl.y=p[1];await say('礦車依照目前軌道抵達目的地！');S.mode='map'};
LIFTS['mine:10:1']=[[10,11],[4,1],[15,10]];LIFTS['mine:10:11']=[[10,1],[4,11],[15,10]];LIFTS['volcIn:9:1']=[[9,10],[2,1],[16,10]];LIFTS['volcIn:9:10']=[[9,1],[2,8],[16,10]];
const oldUseLift=useLift;useLift=async function(key){const stops=LIFTS[key];if(!stops)return;S.mode='event';const c=await choose(stops.map((p,i)=>`第 ${i+1} 層（${p[0]},${p[1]}）`).concat('取消'),1,'right',true);if(c<0||c===stops.length){S.mode='map';return}Pl.x=stops[c][0];Pl.y=stops[c][1];await say('升降梯抵達選定樓層！');S.mode='map'};
	QUESTS.forestDeep={title:'森林秘境守護',offer:'森林深處的古王甦醒了，請協助守洞人調查森林異變。',progress:()=>`進度：擊敗森林秘境古王（${FL['boss:forestGrove']?'已完成':'尚未完成'}）。`,done:()=>!!FL['boss:forestGrove'],doneText:'森林秘境恢復平靜了！',give:async()=>{BAG.coins+=440;await say('獲得 440 枚金幣！')}};NPCS.push(mk('forest',11,4,2,'qforest',['守林人：森林深處的古王正在甦醒。'],null,null,null,null,'forestDeep'));
	put('ruins2','M',[[9,8]]);put('dreamCore','M',[[9,8]]);Object.keys(MULTI_PUZZLES).forEach(k=>{const [m,x,y]=k.split(':');put(m,'M',[[+x,+y]])});put('trench','S',[[10,6]]);put('volcIn','S',[[9,7]]);put('labUnderground','S',[[9,8]]);put('dreamCore','Z',[[10,5]]);
	/* ---- v6 exploration branches / random events ---- */
	PAL.forestCanopy=['#edf8d8','#a4d276','#4c8a43','#1d3f2a'];PAL.forestMoss=['#e2f1d3','#74aa68','#356b48','#17372c'];PAL.trenchEast=['#c9f5fb','#55aec5','#1c637b','#062b3b'];PAL.trenchWest=['#d8f2f5','#699fb4','#315c70','#102f3d'];
	const forestCanopyMap=MAP_LAYOUTS.forestCanopy;
	const forestMossMap=MAP_LAYOUTS.forestMoss;
	const trenchEastMap=MAP_LAYOUTS.trenchEast;
	const trenchWestMap=MAP_LAYOUTS.trenchWest;
	MAPS.forestCanopy=forestCanopyMap;MAPS.forestMoss=forestMossMap;MAPS.trenchEast=trenchEastMap;MAPS.trenchWest=trenchWestMap;
	 installBiomeLandmarks();
	WARP['forestDeep,10,1']=['forestCanopy',1,1];WARP['forestCanopy,18,11']=['forestDeep',10,2];WARP['forestCanopy,10,1']=['forestGrove',1,1];WARP['forestGrove,18,11']=['forestCanopy',10,2];
	WARP['forestMoss,18,11']=['forestDeep',10,2];WARP['forestMoss,10,1']=['forestGrove',1,1];WARP['trenchEast,18,11']=['underseaDeep',10,2];WARP['trenchWest,18,11']=['underseaDeep',10,2];
	put('forestCanopy','D',[[10,1],[18,11]]);put('forestMoss','D',[[10,1],[18,11]]);put('trenchEast','D',[[18,11]]);put('trenchWest','D',[[18,11]]);
	const oldDeepWarp=WARP['underseaDeep,10,1'];WARP['underseaDeep,10,1']=oldDeepWarp;FL.seaRoute=FL.seaRoute||rnd(0,1);FL.forestRoute=FL.forestRoute||rnd(0,1);
		 const HIDDEN_ROAD_SPOTS=[['route',10,4,'風鈴小徑',11,4,12,4],['forestDeep',4,4,'月影藤橋',5,4,6,4],['forestCanopy',15,3,'樹冠吊索',15,4,15,5],['trenchEast',4,3,'東潮裂縫',5,3,6,3],['trenchWest',14,9,'西潮暗門',13,9,12,9],['forestMoss',4,3,'苔光獸穴',5,3,6,3],['forestGrove',12,4,'古王根室',13,4,14,4],['underseaDeep',4,4,'深淵耳室',5,4,6,4],['trenchEast',14,9,'潮汐回廊',13,9,12,9],['trenchWest',4,4,'沉船密道',5,4,6,4],['forestCanopy',4,9,'雲端花徑',5,9,6,9],['forestMoss',15,9,'根脈滑道',14,9,13,9],['trenchEast',9,4,'藍火裂道',10,4,11,4],['trenchWest',9,4,'沉星潛道',10,4,11,4],['underseaDeep',15,3,'深海回音孔',14,3,13,3],['forestGrove',4,9,'古王葉廊',5,9,6,9]];
	const HIDDEN_ROAD_KEYS=HIDDEN_ROAD_SPOTS.map(([m,x,y])=>`${m}:${x}:${y}`);
	function setupRandomHiddenRoads(){
	 if(!FL.hiddenRoadSeed)FL.hiddenRoadSeed=rnd(1,999999);
	 HIDDEN_ROAD_SPOTS.forEach(([m,x,y])=>{if(MAPS[m])put(m,'.',[[x,y]])});
		 const count=6,chosen=[];let seed=FL.hiddenRoadSeed;if(Array.isArray(FL.hiddenRoads)&&FL.hiddenRoads.length===count){FL.hiddenRoads.forEach(k=>{const i=HIDDEN_ROAD_KEYS.indexOf(k);if(i>=0&&!chosen.includes(i))chosen.push(i)})}while(chosen.length<count){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const i=seed%HIDDEN_ROAD_SPOTS.length;if(!chosen.includes(i))chosen.push(i)}
	 FL.hiddenRoads=chosen.map(i=>HIDDEN_ROAD_KEYS[i]);chosen.forEach(i=>{const [m,x,y]=HIDDEN_ROAD_SPOTS[i];put(m,'q',[[x,y]])});
	 chosen.forEach(i=>{const [m,x,y,n,ax,ay,bx,by]=HIDDEN_ROAD_SPOTS[i];HIDDEN_ROADS[`${m}:${x}:${y}`]={name:n,reveal:()=>{put(m,'.',[[x,y]]);put(m,'.',[[ax,ay],[bx,by]]);FL['hidden:'+m]=1}}});
	}
	 function randomExploreEvent(){
	  if(!['underseaDeep','trench','trenchEast','trenchWest','forestDeep','forestGrove','forestCanopy','forestMoss'].includes(cur)||FL['event:'+cur+':'+Pl.x+':'+Pl.y])return false;
	  if(Math.random()>.07)return false;const key='event:'+cur+':'+Pl.x+':'+Pl.y;FL[key]=1;S.mode='event';
		 const seaEvents=[['深海發光水母排成圓環。','牠們留下深海珍珠，獲得 140 枚金幣！',()=>BAG.coins+=140],['海溝底部傳來三次鐘聲。','潮聲讓隊伍恢復體力，並提升水屬性親和。',()=>{party.forEach(m=>{m.hp=m.max;m.love=Math.min(100,(m.love||0)+2)})}],['一艘沉船的寶箱浮出泥沙。','你找到高級飼料與探索經驗！',()=>{BAG.superFeed++;pig.exp+=10}],['透明海龍幼體繞著小豬游過。','牠贈送一枚潮汐鱗片，隊伍特防提升 1 點！',()=>party.forEach(m=>m.spd=(m.spd||8)+1)],['海底裂隙突然吐出藍色火花。','雷光灌入招式核心，獲得 180 枚金幣！',()=>BAG.coins+=180],['古老海圖被珊瑚固定在岩壁上。','海圖揭示了隱藏道路的方向。',()=>{FL.seaChart=1}],['潮汐月夜讓海溝短暫發亮。','你看見遠方的支路入口，獲得 18 點經驗！',()=>pig.exp+=18],['沉睡的巨鯨翻身，帶起一枚深淵藻核。','素材袋獲得深淵藻核。',()=>BAG.rareDrops['深淵藻核']=(BAG.rareDrops['深淵藻核']||0)+1],['水下鐘乳石排列成密碼。','記住潮汐密碼，稀有掉落率提高！',()=>{FL.rare=1}]];
		 const forestEvents=[['月光鹿群從霧中現身。','牠們留下月露，隊伍全員恢復體力。',()=>party.forEach(m=>m.hp=m.max)],['樹洞裡傳來守林人的求救聲。','你找到森林護符，親密度提升 5 點！',()=>party.forEach(m=>m.love=Math.min(100,(m.love||0)+5))],['會唱歌的蘑菇突然亮起。','歌聲帶來 16 點探索經驗。',()=>pig.exp+=16],['古樹落下一枚金色果實。','最大體力提升 3 點！',()=>party.forEach(m=>{m.max+=3;m.hp=m.max})],['藤蔓在腳邊排成箭頭。','你跟著箭頭找到 160 枚金幣！',()=>BAG.coins+=160],['一隻迷路的小森林精靈加入隊伍旁。','稀有怪物的氣息變濃了，稀有遭遇率提升！',()=>{FL.rare=1}],['樹冠上的風鈴同時響起。','森林守護印記啟動，隊伍防禦提升 1 點！',()=>party.forEach(m=>m.def=(m.def||8)+1)],['花粉風捲起金色種子。','素材袋獲得古樹鹿角，森林祝福延長！',()=>BAG.rareDrops['古樹鹿角']=(BAG.rareDrops['古樹鹿角']||0)+1],['苔影根脈短暫開花。','全隊獲得 20 點經驗與少量回血。',()=>{pig.exp+=20;party.forEach(m=>m.hp=Math.min(m.max,m.hp+12))}],['森林精靈在樹皮上畫出六角記號。','你找到隱藏道路線索，獲得 220 枚金幣！',()=>BAG.coins+=220]];
	 const events=cur.startsWith('trench')||cur==='underseaDeep'||cur==='undersea'?seaEvents:forestEvents;
	 const e=events[rnd(0,events.length-1)];say(`${e[0]}\n${e[1]}`).then(()=>{e[2]();S.mode='map'});return true
	}
	 setupRandomHiddenRoads();
function healAll(){party.forEach(m=>{statInit(m);m.hp=m.max;m.status='';m.maxpp=m.mv.map((mi,k)=>m.maxpp?.[k]??MOVES[mi]?.pp??10);m.pp=m.maxpp.slice();yuFix(m)});if(pig)pig.dh=pig.hp}
