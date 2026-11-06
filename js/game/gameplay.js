/* PigmonPro module: Game flow, movement, arrival pipeline, battles, and combat effects. Loaded in order by index.html. */
async function start(){if(has()){S.mode='event';S.prompt='要繼續\n冒險嗎？';if(await choose(['繼續','新遊戲'],1,'right')===0&&load()){await say('歡迎回來，小豬！');S.mode='map';return}}
 S.mode='event';
 await say('這裡是豬豬鎮。小豬要成為最厲害的怪獸訓練豬！');
 await say('用方向鍵移動。草叢裡會遇到野生怪獸。面對路人按 A 可以對話。');await say('用飼料收服怪獸，組成六隻隊伍！注意屬性相剋，打贏七個道館，還有 7 隻傳說怪物等著你挑戰！');
 S.mode='map';
}
function walk(x,y){if(!(x>=0&&y>=0&&x<MW&&y<MH))return false;const tile=MAP[y][x];if((surf?'#HLrT':'#HLrTw').includes(tile)||npcAt(x,y))return false;return true}
/* ---------- modular arrival pipeline ---------- */
const ARRIVE_BEFORE=[];
const ARRIVE_TILE_HANDLERS=[];
const ARRIVE_AFTER=[];
const addArriveBefore=fn=>ARRIVE_BEFORE.push(fn);
const addArriveTile=fn=>ARRIVE_TILE_HANDLERS.push(fn);
const addArriveAfter=fn=>ARRIVE_AFTER.push(fn);
async function runArriveHandlers(list,ctx){
 for(const handler of list){
  const result=await handler(ctx);
  if(result===false)return false;
 }
 return true;
}
async function handleArrivalTile(ctx){
 for(const handler of ARRIVE_TILE_HANDLERS){
  if(await handler(ctx))return true;
 }
 return false;
}
async function arriveCore(){
 if(S.mode!=='map')return;
 advanceWorld();
 party.forEach(m=>{statInit(m);m.love=Math.min(100,(m.love||0)+1)});
 const ctx={map:cur,x:Pl.x,y:Pl.y,tile:MAP[Pl.y][Pl.x],key:`${cur}:${Pl.x}:${Pl.y}`};
 if(await handleArrivalTile(ctx))return;
 if(await randomExploreEvent())return;
 const encounterRate=(ctx.tile==='g'||ctx.tile==='w')
  ?((ctx.tile==='.'?.07:.14)
   *(WORLD.weather==='月夜'?.85
    :WORLD.weather==='小雨'&&ctx.tile==='w'?1.45
    :WORLD.weather==='微雪'&&cur==='iceCave'?1.35
    :WORLD.weather==='花粉風'&&ctx.tile==='g'?1.55
    :WORLD.weather==='潮汐月夜'&&ctx.tile==='w'?1.7
    :WORLD.weather==='流星雨'?1.35
    :WORLD.weather==='熱浪'&&cur.startsWith('volc')?1.5:1)
   *((WORLD.time>=18||WORLD.time<6)?1.2:1))
  :0;
 if(BAG.repel<=0&&encounterRate>0&&Math.random()<encounterRate)await battle(0,ctx.tile==='w');
}

addArriveTile(async ctx=>{
 let warp=WARP[`${ctx.map},${ctx.x},${ctx.y}`];
 if(ctx.map==='underseaDeep'&&ctx.x===10&&ctx.y===1)warp=[FL.seaRoute?'trenchWest':'trenchEast',1,1];
 if(ctx.map==='forestDeep'&&ctx.x===10&&ctx.y===1)warp=[FL.forestRoute?'forestMoss':'forestCanopy',1,1];
 if(!warp)return false;
 const from=cur;setMap(warp[0]);Pl.x=warp[1];Pl.y=warp[2];
 if(from==='underseaDeep'||from==='forestDeep')await say(from==='underseaDeep'?'海流把你捲向隨機海溝支路！':'樹根裂開，露出新的森林秘境分區！');
 return true;
});

addArriveTile(async ctx=>{
 if(surf&&ctx.tile!=='w')surf=false;
 if(BAG.repel>0)BAG.repel--;
 const key=ctx.key,c=ctx.tile;
 if(c==='B'){await mapBoss();return true}
 if(c==='R'){await switchCart(key);return true}
 if(c==='S'){await switchPuzzle(key);return true}
 if(c==='Z'){await timeGate(key);return true}
 if(c==='M'){await multiPuzzle(key);return true}
 if(c==='K'){await rideCart(key);return true}
 if(c==='U'){await useLift(key);return true}
 if(c==='I'){
  const it=ITEM_DATA[key];
  if(it&&!FL['item:'+key]){FL['item:'+key]=1;it.give();await say(`找到${it.name}！`);MAP[Pl.y]=MAP[Pl.y].slice(0,Pl.x)+'.'+MAP[Pl.y].slice(Pl.x+1);return true}
 }
 if(c==='q'){
  const h=HIDDEN_ROADS[key];
  if(h&&!FL['hidden:'+ctx.map]){h.reveal();await say(`發現隱藏道路「${h.name}」！`);return true}
 }
 if(c==='P'){await rockPuzzle(key);return true}
 return false;
});

const SECRET_REWARDS={
 maxhp:async()=>{pig.max+=6;pig.hp=pig.max;await say('小豬的最大體力提升 6 點！')},
 exp:async()=>{pig.exp+=12;await say('小豬獲得了 12 點探索經驗！')},
 heal:async()=>{party.forEach(m=>m.hp=m.max);await say('隊伍全員恢復體力！')},
 rare:async()=>{FL.rare=1;await say('稀有怪物的出現率提高了！')},
 minehp:async()=>{party.forEach(m=>{m.max+=4;m.hp=m.max});await say('隊伍全員最大體力提升 4 點！')},
 volcbuff:async()=>{FL.volcBuff=1;await say('火屬性招式威力提升了！')},
 icebuff:async()=>{FL.iceBuff=1;party.forEach(m=>m.hp=m.max);await say('冰屬性招式威力提升，隊伍也恢復體力！')},
 labrare:async()=>{FL.labPower=1;FL.rare=1;await say('研究所資料解鎖，稀有怪物出現率提升了！')},
 ruinsbuff:async()=>{party.forEach(m=>{m.def=(m.def||8)+2;m.spd=(m.spd||8)+2});await say('隊伍防禦與特防提升了！')},
 dreambuff:async()=>{FL.dreamBuff=1;await say('光與暗屬性招式威力提升了！')},
 seabuff:async()=>{FL.seaBuff=1;party.forEach(m=>m.hp=m.max);await say('水屬性招式威力提升，隊伍恢復體力！')}
 };
addArriveAfter(async ctx=>{
 if(!FL.yuMemory||FL.yuNight||!yuActive()||ctx.map!=='forest'||!(WORLD.time>=18||WORLD.time<6))return;
 const y=yuActive();FL.yuNight=1;y.love=Math.min(100,(y.love||0)+15);S.mode='event';
 await say('夜色降臨，鈺兔兔忽然停下腳步。月影森林深處傳來熟悉的星鈴聲。');
 await say(FL.yuPath==='star'?'星光從樹梢落下，替鈺兔兔照出一條通往星冠的路。':'薄霧包住鈺兔兔，牠聽見森林裡每一個正在做夢的生命。');
 await say('鈺兔兔的親密度提升了！回星學堂找老師，完成最後的覺醒。');S.mode='map';
});
addArriveTile(async ctx=>{
 if(ctx.tile==='E'){
  const q=SECRETS[`secret:${ctx.map}:${ctx.x}:${ctx.y}`];
  if(q&&!FL[`secret:${ctx.map}:${ctx.x}:${ctx.y}`]){
   S.mode='event';for(const line of q.lines)await say(line);
   const flag=`secret:${ctx.map}:${ctx.x}:${ctx.y}`;FL[flag]=1;
   if(SECRET_REWARDS[q.reward])await SECRET_REWARDS[q.reward]();
   S.mode='map';return true;
  }
 }
 if(ctx.tile==='h'||ctx.tile==='C'){center(ctx.tile==='h');return true}
 if(ctx.tile==='X'&&hasLegendLeft()){legend2();return true}
 return false;
});

async function arrive(){
 if(S.mode!=='map')return;
 const ctx={map:cur,x:Pl.x,y:Pl.y,tile:MAP[Pl.y]?.[Pl.x],key:`${cur}:${Pl.x}:${Pl.y}`};
 if(await runArriveHandlers(ARRIVE_BEFORE,ctx)===false)return;
 await arriveCore();
 await runArriveHandlers(ARRIVE_AFTER,ctx);
}

const wildPool0=()=>{const base=cur==='sea'?[ENEMIES[3],ENEMIES[6],ENEMIES[8],ENEMIES[10]]:cur==='volc'?[ENEMIES[4],ENEMIES[5],ENEMIES[9],ENEMIES[8]]:cur==='maze'?[ENEMIES[0],ENEMIES[8],ENEMIES[9],ENEMIES[11]]:cur==='a3'?[ENEMIES[2],ENEMIES[6],ENEMIES[10],ENEMIES[11]]:(FL.rare?[...ENEMIES.slice(0,6),ENEMIES[9],ENEMIES[11]]:ENEMIES.slice(0,6));return ['forest','forestDeep','forestGrove','forestCanopy','forestMoss'].includes(cur)&&typeof FOREST_RELIC_IDS!=='undefined'?[...base,...FOREST_RELIC_IDS.map(i=>ENEMIES[i])]:base};
const ALLN=[...Array(49).keys()].map(i=>i+12).concat(NEWN.map((_,i)=>65+i)),AOFF={forest:0,route:8,school:0,a2:16,a3:26,a4:36,a5:46,a6:56,sea:62,volc:68,maze:71};
const wildPool=()=>{if(cur.startsWith('LL')){const n=+cur.match(/^LL(\d+)/)[1],id=STORY_LEGENDS[n%STORY_LEGENDS.length];return [...wildPool0(),ENEMIES[id],ENEMIES[(id+1)%ENEMIES.length]]}if(cur==='mine')return mineWild();if(cur==='volcIn')return volcInWild();if(cur==='iceCave')return iceWild();if(cur==='lab')return labWild();if(cur==='ruins')return ruinsWild();if(cur==='dreamSpace')return dreamWild();if(cur==='undersea'||cur==='underseaDeep'||cur==='trench')return underseaWild();if(cur==='forestDeep'||cur==='forestGrove')return wildPool0();if(cur==='ruins2')return ruinsWild();if(cur==='dreamBranch'||cur==='dreamCore')return dreamWild();if(cur==='labUnderground')return labWild();const o=AOFF[cur]??0,rare=FL.rare||o>50;return [...(cur==='route'?[ENEMIES[3],ENEMIES[6]]:wildPool0()),...ALLN.slice(o,o+18).filter(i=>i<95||rare).map(i=>ENEMIES[i])]};
const ensureBattleMon=m=>{statInit(m);m.status=m.status||'';return m};
const inflict=(m,st,ch=.16)=>{if(!m.status&&Math.random()<ch){m.status=st;return true}return false};
const statusTick=async m=>{if(!m.status)return true;if(m.status==='burn'||m.status==='poison'){const d=Math.max(1,Math.round(m.max*(m.status==='burn'?.06:.08)));m.hp=Math.max(0,m.hp-d);await say(`${m.n}因${STATUS_NAMES[m.status]}受到${d}點傷害！`)}if(m.status==='paralyze'&&Math.random()<.25){await say(`${m.n}因麻痺無法行動！`);return false}if(m.status==='freeze'&&Math.random()<.65){await say(`${m.n}仍在冰凍中！`);return false}if(m.status==='sleep'&&Math.random()<.7){await say(`${m.n}正在睡覺！`);return false}if(Math.random()<.12)m.status='';return true};
const calcDamage=(M,A,D)=>{const special=!!M.y,atk=special?(A.spa||A.atk):A.atk,def=special?(D.spd||D.def):D.def;let d=Math.max(1,Math.round((M.p||A.atk)*(A.pwr||1)*(atk/Math.max(1,def))));if(WEATHER_TYPE[WORLD.weather]===M.y)d=Math.round(d*1.2);if((M.y==='火'&&FL.volcBuff)||(M.y==='冰'&&FL.iceBuff)||(FL.dreamBuff&&(M.y==='光'||M.y==='暗'))||(FL.seaBuff&&M.y==='水'))d=Math.round(d*1.15);if(A.s===108&&FL.yuStoryDone&&FL.yuPath==='star'&&M.y==='光')d=Math.round(d*1.15);const night=WORLD.time>=18||WORLD.time<6;if((night&&M.y==='暗')||(!night&&M.y==='光'))d=Math.round(d*1.1);const bossCrit=(B&&B.e&&B.e.s>=finalBossBase)?(BOSS_BALANCE[B.e.s]?.crit||.08):.06;const crit=Math.random()<Math.min(.25,bossCrit+((A.speed||5)-(D.speed||5))*.01);return {d:Math.max(1,Math.round(d*(crit?2:1))),crit}};
async function enemyAct(){const E=B.e;if(!(await statusTick(E)))return true;if(!E.phase&&E.hp<E.max*.3&&E.s>=finalBossBase){E.phase=1;E.atk+=5;E.def+=5;E.speed+=5;await say(`${E.n}發出了震天的咆哮，進入了第二階段！能力大幅提升！`)}const ei=pick(E.mv||[0]),EM=MOVES[ei];await say(`${E.n}${statusLabel(E)}使出了${moveLabel(ei)}！`);if(EM.t==='d'){if(E.st>-3){E.st--;await say(`${pig.n}的攻擊被壓制了！`)}else await say('但是沒有更多效果了！')}else if(EM.t==='h'){await legendFx(ei,'e');const h=6+E.lv;E.hp=Math.min(E.max,E.hp+h);await say(`${E.n}恢復了${h}點體力！`)}else if(Math.random()>.1){const mx=mult(EM.y||E.t,pig.t),z=calcDamage(EM,E,pig),d=Math.max(1,Math.round(z.d*mx*(.8+Math.random()*.5)*Math.max(.4,1+.25*E.st)));if(z.crit)await say('對手使出會心一擊！');if(EM.y==='火')inflict(pig,'burn');if(EM.y==='毒')inflict(pig,'poison');if(EM.y==='電')inflict(pig,'paralyze');if(EM.y==='冰')inflict(pig,'freeze');pig.hp=Math.max(0,pig.hp-d);if(ei===PIG_ULTIMATE_MOVE){B.fx={kind:'ultimate',t:S.t,cx:40,cy:68};await sleep(1200);B.fx=null}else if(ei===PIG_EXCLUSIVE_MOVE){B.fx={t:S.t,cx:40,cy:68};await sleep(700);B.fx=null}else await legendFx(ei,'e');await blink('p');await say(`${pig.n}受到了${d}點傷害！`);if(mx!==1)await say(mx>1?'效果絕佳！':'效果不太好……')}else await say('但是沒有打中！');if(pig.hp<=0&&pig.s===108&&B&&!B.yuRev){B.yuRev=1;const ratio=FL.yuStoryDone&&FL.yuPath==='dream'?.7:.5;pig.hp=Math.ceil(pig.max*ratio);pig.dh=pig.hp;pig.status='';await say(`${pig.n}的${FL.yuStoryDone&&FL.yuPath==='dream'?'夢境擁抱':'復活'}被動發動！回復了${Math.round(ratio*100)}%體力，再度站了起來！`);return true}if(pig.hp<=0){await say(`${pig.n}倒下了……`);if(party.some(m=>m.hp>0)){while(!(await swap(1)));return true}await say('隊伍全軍覆沒，被送回了豬窩。');party.forEach(m=>{m.hp=m.max;m.status=''});pig=party[0];pig.dh=pig.hp;setMap('town');Pl.x=3;Pl.y=4;return false}return true}
const isRareMon=e=>{const i=ENEMIES.indexOf(e);return i===9||i===11||(i>=95&&i<=104)||(typeof BIOME_IDS!=='undefined'&&BIOME_IDS.includes(i))};
const pickWild=W=>{if(W)return pick([ENEMIES[3],ENEMIES[6]]);const p=wildPool(),r=p.filter(isRareMon),c=p.filter(e=>!isRareMon(e));if(!r.length||!c.length)return pick(p);return Math.random()<(FL.rare?.1:.05)?pick(r):pick(c)};
async function battle(T,W,L){
 S.mode='trans';S.t0=performance.now();await sleep(800);
 const b=L?ENEMIES[L>1?L:legendTarget()]:T?T.b:pickWild(W),mazeBonus=cur.startsWith('LLF2')?5:cur.startsWith('LL')?2:0,lv=L?(b.lv||28):T?T.lv:Math.max(1,pig.lv+rnd(-1,1)+mazeBonus),bal=L?(BOSS_BALANCE[L]||{}):{};
 const E=ensureBattleMon({n:b.n,d:b.d,lv,max:(bal.hp||b.hp)+lv*2,atk:(bal.atk||b.atk)+Math.round(lv*.7),def:(b.def||b.atk)+lv/2,spa:(b.atk||4)+lv,spd:(b.atk||4)+lv,speed:5+lv,st:0,t:b.t||'普',s:ENEMIES.indexOf(b),status:'',mv:movesFor(ENEMIES.indexOf(b),lv),hp:0});E.max+=rnd(0,5);if(!T&&!L&&typeof BIOME_IDS!=='undefined'&&BIOME_IDS.includes(E.s)){const f=Math.min(1,lv/30);E.max=Math.round(E.max*(.45+.55*f));E.atk=Math.round(E.atk*(.5+.5*f));E.spa=Math.round(E.spa*(.5+.5*f));E.def=Math.round(E.def*(.6+.4*f));E.spd=Math.round(E.spd*(.6+.4*f));E.pwr=.45+.55*f}E.hp=E.dh=E.max;E.shiny=Math.random()<.015;if(E.s>=0)FL['s'+E.s]=1;
 B={e:E,eat:3,bl:null,feedBonus:0,guaranteed:false,k:L?'boss':T?(BATK||'trainer'):'wild'};ensureBattleMon(pig);S.mode='battle';
 await say(T?`${T.n}派出了${E.n}！`:`野生的${E.n}出現了！`);
 let over=false;
 while(!over){
  if(!B.preempt){B.preempt=1;ensureBattleMon(pig);if(E.speed>pig.speed&&pig.s!==108&&!(await enemyAct())){over=true;break}}
  S.prompt='小豬要\n怎麼做？';
  const c=await choose(['戰鬥','飼料','隊伍','逃跑'],2,'full');
  if(c===0){
   B.moveMenu=1;const m=await choose(pig.mv.map((i,k)=>`${moveLabel(i)} PP${pig.pp?.[k]??10}`),2,'full',true);B.moveMenu=0;
   if(m<0)continue;
   if(!(await useMove(pig.mv[m])))continue;
   if(E.hp<=0){B.won=1;await say(`${E.n}倒下了！`);await gain(E);over=true;break}
  }else if(c===1){
   if(T){await say('不能收服別人的怪獸！');continue}if(BAG.feed<=0&&!BAG.superFeed&&!(isLegend(E.s)&&BAG.legendFeed)){await say('飼料用完了，請先到商店補貨！');continue}const feeds=[];if(BAG.feed>0)feeds.push('普通飼料');if(BAG.superFeed)feeds.push(`高級飼料（${BAG.superFeed}）`);if(isLegend(E.s)&&BAG.legendFeed)feeds.push('傳說必捕飼料（唯一）');const fi=await choose(feeds,1,'right',true);if(fi<0)continue;if(feeds[fi].startsWith('高級')){BAG.superFeed--;B.feedBonus=.22;await say('使用高級飼料，捕獲機率提升！')}else if(feeds[fi].startsWith('傳說')){BAG.legendFeed=0;B.guaranteed=true;await say('傳說必捕飼料發動！這次一定能捕獲！')}else{BAG.feed=Math.max(0,BAG.feed-1);B.feedBonus=0}await say('小豬丟出了飼料！');await sleep(400);
   if(B.guaranteed||Math.random()<(.25+.6*(1-E.hp/E.max)+B.feedBonus)*(isLegend(E.s)?.4:1)){
    if(isLegend(E.s)){FL['leg'+E.s]=1;if(!hasLegendLeft())FL.leg=1;}await say(`${E.n}被飼料收買，成為了朋友！`);const caught=mon(E.s,E.lv);caught.shiny=E.shiny;if(party.length<6){party.push(caught);await say(`${E.n}${E.shiny?'（閃光）':''}加入了隊伍！`)}else{pcBox.push(caught);await say('隊伍滿了，已傳送到電腦盒子！')}
    if(!dex.has(E.n)){dex.add(E.n);await say(`${E.n}登錄到圖鑑了！（${dex.size}/${ENEMIES.length}）`)}
    await gain(E);over=true;break}
   await say(`${E.n}不領情……`);
  }else{
   if(c===2){if(!(await swap()))continue}else{if(T){await say('對決中不能逃跑！');continue}if(Math.random()<.7){await say('成功逃跑了！');over=true;break}
   await say('逃不掉！')}
  }
  if(!(await enemyAct())){over=true;break}
 }
 const won=B.won;B=null;S.mode='map';return won;
}
async function useMove(i){
 const M=MOVES[i],E=B.e,slot=pig.mv.indexOf(i);ensureBattleMon(pig);
 if((pig.pp?.[slot]??10)<=0){await say('這招的 PP 用完了！');return false}if(pig.s!==108)pig.pp[slot]--;
 if(M.t==='h'&&B.eat<=0){await say('飼料桶空了！');return false}
 await say(`${pig.n}使出了${M.n}！`);
 if(M.t==='d'){if(E.st>-3){E.st--;await say(`${E.n}的攻擊下降了！`)}else await say('但是沒有效果……');return true}
 if(M.t==='sweet'){await legendFx(i,'p');const b0=pig.hp;pig.hp=Math.min(pig.max,pig.hp+Math.round(pig.max*.7)+20);pig.status='';await say(`${pig.n}恢復了${pig.hp-b0}點體力！`);const dn=party.filter(x=>x!==pig&&x.hp<=0);dn.forEach(x=>{x.hp=Math.ceil(x.max*.5);x.status=''});if(dn.length)await say(`${dn.map(x=>x.n).join('、')}被甜甜的夢喚醒，復活了！`);return true}
 if(M.t==='rainbow'){await legendFx(i,'p');await blink('e');E.hp=Math.min(E.hp,1);await say(`${E.n}的體力被彩虹紅蘿蔔變成 1 了！`);return true}
 if(M.t==='h'){await legendFx(i,'p');B.eat--;const h=8+pig.lv*2;pig.hp=Math.min(pig.max,pig.hp+h);pig.status='';await say(`${pig.n}大口吃飯，恢復了${h}點體力！`);return true}
 if(Math.random()>M.a){await say('但是沒有命中……');return true}
 const mx=mult(M.y||'普',E.t),z=calcDamage(M,pig,E),d=Math.max(1,Math.round(z.d*mx*(.85+Math.random()*.3)));if(z.crit)await say('會心一擊！');
 E.hp=Math.max(0,E.hp-d);if(M.y==='火')inflict(E,'burn');if(M.y==='毒')inflict(E,'poison');if(M.y==='電')inflict(E,'paralyze');if(M.y==='冰')inflict(E,'freeze');
 if(i===PIG_ULTIMATE_MOVE){B.fx={kind:'ultimate',t:S.t};await sleep(1200);B.fx=null}
 else if(i===PIG_EXCLUSIVE_MOVE){B.fx={t:S.t};await sleep(700);B.fx=null}else{await legendFx(i,'p');await blink('e')}
 await say(`${E.n}受到了${d}點傷害！`);if(mx!==1)await say(mx>1?'效果絕佳！':'效果不太好……');return true;
}
async function gain(E){
	 FL.wins=(FL.wins||0)+1;for(const m of party){statInit(m);m.love=Math.min(100,(m.love||0)+3)}
	 const coins=Math.max(8,E.lv*3);BAG.coins+=coins;
	 const rare=tryRareDrop(E);if(rare)await say(`發現稀有掉落「${rare[0]}」！已收進素材袋。`);
	 const g=E.lv*6+4;pig.exp+=g;await say(`${pig.n}獲得了${g}點經驗值！並找到 ${coins} 枚金幣！`);
 while(pig.exp>=pig.lv*10){pig.exp-=pig.lv*10;pig.lv++;pig.max+=5;pig.hp=Math.min(pig.max,pig.hp+5);await say(`${pig.n}升級了！現在是 Lv${pig.lv}！`);if(pig.s===undefined&&LEARN[pig.lv])await learn(LEARN[pig.lv]);else if(LEARN2[pig.s]&&LEARN2[pig.s][pig.lv])await learn(LEARN2[pig.s][pig.lv])}
 for(const m of party){for(let i=0;i<2;i++){const before=evoStageOf(m,evolutionProfile(m));await checkEvolution(m);if(evoStageOf(m,evolutionProfile(m))===before)break}}
}
async function blink(w){MU.sfx(w==='e'?'hit':'hurt');B.bl=w;await sleep(500);B.bl=null}
function drawPigExclusiveFx(){
 if(!B?.fx||B.fx.kind==='legend')return;
 const q=Math.min(1,(S.t-B.fx.t)/18),cx=B.fx.cx??116,cy=B.fx.cy??32;
 ctx.save();ctx.globalAlpha=1-q*.35;
 for(let i=0;i<10;i++){
  const a=i*Math.PI/5+S.t*.08,r=10+q*34;
  const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.55;
  R(x-2,y-2,4,4,(i%2)?0:3);
 }
 ctx.strokeStyle='#fff4a8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,12+q*30,0,Math.PI*2);ctx.stroke();
 ctx.restore();
}
function drawPigUltimateFx(){
 if(!B?.fx||B.fx.kind!=='ultimate')return;
 const q=Math.min(1,(S.t-B.fx.t)/26),cx=B.fx.cx??116,cy=B.fx.cy??32;
 ctx.save();ctx.globalAlpha=.18+.22*(1-q);ctx.fillStyle='#fff7b0';ctx.fillRect(0,0,160,144);
 ctx.globalAlpha=.9-q*.3;ctx.strokeStyle='#fffbe0';ctx.lineWidth=2;
 for(let i=0;i<16;i++){
  const a=i*Math.PI/8+S.t*.035,r1=5+q*8,r2=35+q*105;
  ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke();
 }
 ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(cx,cy,8+q*58,0,Math.PI*2);ctx.stroke();ctx.restore();
}
/* ---------- 傳說怪專屬招式特效 ---------- */
const FXC={火:['#ff6a2b','#ffc23d','#fff4b8'],水:['#3fb6ee','#a6e3ff','#ffffff'],草:['#58c95a','#b6f08a','#f4ffd8'],電:['#ffd92e','#fff59a','#ffffff'],冰:['#8fe3ff','#dff8ff','#ffffff'],光:['#ff9fd0','#ffe58a','#ffffff'],暗:['#7a46c8','#b99aff','#2a1650'],土:['#b98a4a','#e6c98f','#6f4d24'],毒:['#b05ad6','#e3a8ff','#ffffff'],普:['#ff9db8','#ffd9e4','#ffffff']};
const fxCol=t=>FXC[t]||FXC['普'];
const LEGEND_FX={
 '月兔星願':{k:'moonwish',d:1500,s:'lgLight'},
 '星耀豬皇擊':{k:'royalstar',d:1400,s:'lgBoom',sh:2},
 '雲海幻舞':{k:'cloudwave',d:1500,s:'lgWater'},
 '赤焰神燼':{k:'ember',d:1400,s:'lgFire'},
 '炎煌神焰':{k:'divineflame',d:1700,s:'lgFire',sh:3},
 '極光月舞':{k:'aurora',d:1600,s:'lgIce'},
 '雷鳴豬突':{k:'thunder',d:1200,s:'lgThunder',sh:2},
 '星夢閃光':{k:'dreamflash',d:1100,s:'lgLight'},
 '甜夢治癒':{k:'dreamheal',d:1400,s:'heal',self:1},
 '彩虹星爆':{k:'rainbow',d:1800,s:'lgBoom',sh:3},
 '撒嬌連環砲':{k:'cutebarrage',d:1500,s:'lgLight'},
 '蘿蔔雨啪啦':{k:'radishrain',d:1500,s:'lgHit'},
 '耍廢打滾擊':{k:'roll',d:1400,s:'lgRoll',sh:3},
 '彩虹紅蘿蔔':{k:'radishrain',d:1500,s:'lgHit'},
 '琉璃幻光・月兔晶華彈':{k:'moonwish',d:1700,s:'lgLight',sh:2}
};
const SIG_RE=/(奇蹟|祝福|狂想曲|閃擊|之歌)$/;
const legendFxDef=i=>{const m=MOVES[i];if(!m)return null;return LEGEND_FX[m.n]||(SIG_RE.test(m.n)&&m.p?{k:'sigburst',d:1100,s:'lgLight'}:null)};
const FX_POS={e:[116,32],p:[40,68]};
/* 播放特效：i=招式編號，caster='p' 主角施放／'e' 敵方施放；沒有特效的招式會立刻返回 */
async function legendFx(i,caster){
 const d=legendFxDef(i);if(!d||!B)return;
 const tg=d.self?caster:(caster==='e'?'p':'e'),m=MOVES[i];
 B.fx={kind:'legend',k:d.k,t:S.t,t0:performance.now(),d:d.d,sh:d.sh||0,cx:FX_POS[tg][0],cy:FX_POS[tg][1],sx:FX_POS[caster][0],sy:FX_POS[caster][1],y:m.y||'光',seed:rnd(1,999)};
 MU.sfx(d.s);
 await sleep(d.d);
 if(B)B.fx=null;
}
const legendShake=()=>{const f=B&&B.fx;if(!f||f.kind!=='legend'||!f.sh)return null;const p=(performance.now()-f.t0)/f.d;if(p<.3||p>.78)return null;const a=f.sh*(1-Math.abs(p-.52)*1.6);return[(Math.random()-.5)*2*a,(Math.random()-.5)*2*a]};
/* --- 小工具 --- */
const fxH=(s,n)=>{const v=Math.sin((s+n)*127.1+n*311.7)*43758.5453;return v-Math.floor(v)};
const fxE=x=>1-Math.pow(1-x,3);
const fxSeg=(p,a,b)=>Math.max(0,Math.min(1,(p-a)/(b-a)));
const fxSq=(x,y,s,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x-s/2),Math.round(y-s/2),s,s)};
const fxDisc=(x,y,r,c,a)=>{if(r<=0)return;ctx.globalAlpha=a==null?1:a;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1};
const fxSpark=(x,y,r,c)=>{ctx.fillStyle=c;const a=Math.max(1,Math.round(r)),X=Math.round(x),Y=Math.round(y);ctx.fillRect(X-a,Y,a*2+1,1);ctx.fillRect(X,Y-a,1,a*2+1);if(r>2)ctx.fillRect(X-1,Y-1,3,3)};
const fxRing=(x,y,r,c,w,a)=>{ctx.globalAlpha=Math.max(0,a==null?1:a);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1};
const fxFlash=(c,a)=>{ctx.globalAlpha=Math.max(0,Math.min(1,a));ctx.fillStyle=c;ctx.fillRect(-8,-8,176,160);ctx.globalAlpha=1};
const fxStar5=(x,y,R0,r0,rot,c)=>{ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<10;i++){const a=rot+i*Math.PI/5-Math.PI/2,rr=i%2?r0:R0;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fill()};
const fxHeart=(x,y,s,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y+s*.9);ctx.bezierCurveTo(x-s*1.5,y-s*.1,x-s*.6,y-s*1.1,x,y-s*.3);ctx.bezierCurveTo(x+s*.6,y-s*1.1,x+s*1.5,y-s*.1,x,y+s*.9);ctx.fill()};
const fxRadish=(x,y,s,rot)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle='#ffe3ee';ctx.beginPath();ctx.ellipse(0,1.5*s,2.8*s,4.2*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff9fc0';ctx.beginPath();ctx.ellipse(0,3.6*s,1.9*s,2.2*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4fc25a';for(const o of[-2,0,2]){ctx.beginPath();ctx.ellipse(o*s,-3.4*s,1*s,2.6*s,o*.25,0,Math.PI*2);ctx.fill()}ctx.restore()};
const LEGEND_DRAW={
 /* 月兔星願：月牙升起，星星拖著尾巴墜落 */
 moonwish(f,p){const[c1,c2,c3]=fxCol('光'),x=f.cx,y=f.cy,a=fxSeg(p,0,.3),b=fxSeg(p,.3,.75),mx=x-4,my=Math.max(10,y-30)-(1-fxE(a))*10,mr=14*fxE(a)*(1-fxSeg(p,.7,1)*.7);
  if(mr>1){ctx.save();ctx.globalAlpha=1-fxSeg(p,.75,1);ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.clip();ctx.fillStyle='#fff2a8';ctx.beginPath();ctx.rect(mx-mr-2,my-mr-2,mr*2+4,mr*2+4);ctx.arc(mx+mr*.42,my-mr*.12,mr*.86,0,Math.PI*2);ctx.fill('evenodd');ctx.restore();fxRing(mx,my,mr+2.5,'#ffffff',1,.45*(1-fxSeg(p,.7,1)))}
  for(let i=0;i<9;i++){const d0=fxH(f.seed,i)*.38,u=fxSeg(b,d0,d0+.6);if(u<=0||u>=1)continue;const tx=x+(fxH(f.seed,i+20)-.5)*28,ty=y+(fxH(f.seed,i+40)-.5)*24,k=fxE(u),px=mx+(tx-mx)*k,py=my+(ty-my)*k,k0=fxE(Math.max(0,u-.14)),qx=mx+(tx-mx)*k0,qy=my+(ty-my)*k0;ctx.strokeStyle=c2;ctx.globalAlpha=.7;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=1;fxStar5(px,py,3.2,1.4,u*6,'#fff8c8')}
  if(p>.62){const g=fxSeg(p,.62,1);fxFlash(c1,.32*(1-g));for(let i=0;i<12;i++){const ang=i*Math.PI/6+f.seed,r=3+g*24;fxSpark(x+Math.cos(ang)*r,y+Math.sin(ang)*r*.75,2.4-g*1.4,i%2?c2:c3)}fxRing(x,y,4+g*28,c3,2,1-g)}},
 /* 星耀豬皇擊：巨大金星從天而降，落地迸出光芒 */
 royalstar(f,p){const[c1,c2,c3]=fxCol('光'),x=f.cx,y=f.cy,fall=fxSeg(p,0,.42),hit=fxSeg(p,.42,1);
  if(fall<1){const k=fxE(fall),sy=y-72+72*k,R0=28-14*k;ctx.fillStyle=c2;ctx.globalAlpha=.35;ctx.fillRect(Math.round(x-4),Math.round(sy-34),8,34);ctx.globalAlpha=1;fxStar5(x,sy,R0,R0*.46,k*4,'#ffffff');fxStar5(x,sy,R0*.88,R0*.4,k*4,'#ffd84a')}
  else{fxFlash('#ffffff',.7*(1-hit));ctx.strokeStyle='#ffe58a';ctx.lineWidth=2;ctx.globalAlpha=1-hit;for(let i=0;i<12;i++){const ang=i*Math.PI/6+.2,r1=6+hit*8,r2=14+hit*46;ctx.beginPath();ctx.moveTo(x+Math.cos(ang)*r1,y+Math.sin(ang)*r1);ctx.lineTo(x+Math.cos(ang)*r2,y+Math.sin(ang)*r2);ctx.stroke()}ctx.globalAlpha=1;fxRing(x,y,6+hit*34,'#fff7c0',3,1-hit);fxRing(x,y,3+hit*20,c1,2,1-hit);for(let i=0;i<7;i++){const ang=i*Math.PI*2/7+f.seed,r=8+hit*34;fxStar5(x+Math.cos(ang)*r,y+Math.sin(ang)*r*.8,3,1.3,hit*6,i%2?'#fff2a8':c1)}ctx.globalAlpha=1-hit;fxStar5(x,y,15*(1-hit*.5),7*(1-hit*.5),hit*2,'#ffd84a');ctx.globalAlpha=1}},
 /* 雲海幻舞：三道浪潮湧向對手，雲團與泡泡升起 */
 cloudwave(f,p){const x=f.cx,y=f.cy,sx=f.sx,sy=f.sy,a=fxSeg(p,0,.55),b=fxSeg(p,.5,1),cols=['#7fd4ff','#cfeeff','#ffffff'];ctx.lineCap='round';
  for(let w=0;w<3;w++){ctx.strokeStyle=cols[w];ctx.lineWidth=3.2-w*.8;ctx.globalAlpha=(1-b)*.9;ctx.beginPath();const n=28;for(let i=0;i<=n*a;i++){const u=i/n,px=sx+(x-sx)*u,py=sy+(y-sy)*u+Math.sin(u*14-p*16+w*1.4)*(5-u*2)+(w-1)*5;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke()}ctx.globalAlpha=1;
  if(b>0){for(let i=0;i<7;i++){const h=fxH(f.seed,i),r=(4+h*4)*(.5+b),cx2=x+(h-.5)*36,cy2=y+8-b*18*(.5+h);fxDisc(cx2,cy2,r,'#f4fcff',.85*(1-b));fxDisc(cx2+r*.8,cy2+1.5,r*.7,'#f4fcff',.85*(1-b))}
   for(let i=0;i<8;i++){const h=fxH(f.seed,i+30),u=fxSeg(b,h*.4,h*.4+.6);if(u<=0||u>=1)continue;fxRing(x+(fxH(f.seed,i+50)-.5)*40,y+14-u*34,1.5+h*2,'#e8f9ff',1,.9*(1-u))}fxRing(x,y+4,6+b*28,'#bfeaff',2,1-b)}},
 /* 赤焰神燼：三根火柱與飄散的餘燼 */
 ember(f,p){const[c1,c2,c3]=fxCol('火'),x=f.cx,y=f.cy,g=fxSeg(p,0,.35),out=1-fxSeg(p,.78,1);fxFlash('#ff4a1a',.18*Math.sin(Math.min(1,p*1.4)*Math.PI));
  for(let c=0;c<3;c++){const ox=(c-1)*13,h=(16+(c%2)*9)*fxE(g);for(let j=0;j<5;j++){const w=(7-j*1.2)*(1+Math.sin(p*30+j+c)*.12),yy=y+16-j*(h/4.2);ctx.fillStyle=j<2?c1:j<4?c2:c3;ctx.globalAlpha=.92*out;ctx.beginPath();ctx.ellipse(x+ox+Math.sin(p*20+j*1.7+c)*1.5,yy,w,Math.max(1,h/5),0,0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=1;
  for(let i=0;i<26;i++){const h=fxH(f.seed,i),u=fxSeg(p,.1+h*.25,.55+h*.45);if(u<=0||u>=1)continue;ctx.globalAlpha=1-u*.7;fxSq(x+(fxH(f.seed,i+30)-.5)*40+Math.sin(u*6+i)*3,y+14-u*(30+h*26),u<.6?2:1,u<.35?c2:u<.6?c1:'#6a4a4a')}ctx.globalAlpha=1},
 /* 炎煌神焰：火柱貫穿天地，鳳翼展開，衝擊波擴散 */
 divineflame(f,p){const[c1,c2,c3]=fxCol('火'),x=f.cx,y=f.cy,a=fxSeg(p,0,.35),b=fxSeg(p,.3,.8),c=fxSeg(p,.75,1);fxFlash('#ff7a2b',.4*Math.sin(Math.min(1,p*1.2)*Math.PI));
  if(a<1)fxRing(x,y+12,22*fxE(a),c2,2,.9*(1-a*.3));
  const hh=(y+22)*fxE(a),w0=(9+13*fxE(b))*(1-c);for(let j=0;j<4;j++){const ww=Math.max(.5,w0*(1-j*.24)*(1+Math.sin(p*40+j*2)*.08));ctx.fillStyle=[c1,c2,c3,'#ffffff'][j];ctx.globalAlpha=.9*(1-c);ctx.fillRect(Math.round(x-ww),-8,Math.round(ww*2),Math.round(hh+8))}
  ctx.globalAlpha=1;ctx.lineCap='round';if(b>0){for(const sd of[-1,1])for(let i=0;i<3;i++){ctx.strokeStyle=i?c1:c2;ctx.lineWidth=3-i*.6;ctx.globalAlpha=(1-c)*.95;ctx.beginPath();ctx.moveTo(x,y-2+i*3);ctx.quadraticCurveTo(x+sd*12,y-20-i*6,x+sd*(16+i*11)*fxE(b),y-14-i*9*fxE(b));ctx.stroke()}ctx.globalAlpha=1;fxRing(x,y+14,6+b*44,c2,3,(1-c)*.9);fxRing(x,y+14,3+b*28,c1,2,(1-c)*.9)}
  for(let i=0;i<18;i++){const h=fxH(f.seed,i),u=fxSeg(p,.3+h*.2,.9);if(u<=0||u>=1)continue;fxSq(x+(h-.5)*70*u,y+12-u*(24+h*34),h>.5?2:1,h>.7?c3:c2)}},
 /* 極光月舞：四道極光彩帶掃過，冰晶飄落 */
 aurora(f,p){const x=f.cx,y=f.cy,a=fxSeg(p,0,.5),fade=1-fxSeg(p,.78,1),cols=['#7dffd4','#8fe3ff','#b79bff','#ff9fe0'];ctx.lineCap='round';ctx.lineJoin='round';
  for(let r=0;r<4;r++){ctx.strokeStyle=cols[r];ctx.lineWidth=4-r*.4;ctx.globalAlpha=.78*fade;ctx.beginPath();const n=26;for(let i=0;i<=n*a;i++){const u=i/n,px=x-46+92*u,py=y-18+r*8+Math.sin(u*7+p*9+r*.9)*7*(.6+u*.4)+Math.cos(u*3+r)*4;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke()}ctx.globalAlpha=1;
  for(let i=0;i<16;i++){const h=fxH(f.seed,i),u=fxSeg(p,h*.4,h*.4+.6);if(u<=0||u>=1)continue;ctx.globalAlpha=(1-u)*fade;fxSpark(x+(fxH(f.seed,i+20)-.5)*70,y-30+u*56,1.5,i%2?'#e6fbff':'#9fe8ff')}ctx.globalAlpha=1;
  if(p>.55){const g=fxSeg(p,.55,1);fxRing(x,y,5+g*26,'#dff8ff',2,1-g);for(let i=0;i<6;i++){const ang=i*Math.PI/3+.5,r=4+g*24;ctx.strokeStyle='#ffffff';ctx.globalAlpha=1-g;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+Math.cos(ang)*r*.4,y+Math.sin(ang)*r*.4);ctx.lineTo(x+Math.cos(ang)*r,y+Math.sin(ang)*r);ctx.stroke()}ctx.globalAlpha=1}},
 /* 雷鳴豬突：三道落雷接連劈下 */
 thunder(f,p){const x=f.cx,y=f.cy;let flash=0;ctx.lineCap='round';ctx.lineJoin='round';
  [.1,.32,.54].forEach((s,si)=>{const d=p-s;if(d<0||d>=.14)return;const k=1-d/.14;flash=Math.max(flash,k);const sd=f.seed+si*17+Math.floor(d*40);let px=x+(fxH(sd,1)-.5)*30;const pts=[[px,-6]];for(let j=1;j<=7;j++){px+=(fxH(sd,j)-.5)*14;pts.push([j===7?x+(fxH(sd,9)-.5)*8:px,-6+(y+14)*j/7])}
   for(const[w,c]of[[5,'#ffe94a'],[2,'#ffffff']]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.globalAlpha=k;ctx.beginPath();pts.forEach(([a,b],j)=>j?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.stroke()}ctx.globalAlpha=k*.8;ctx.strokeStyle='#fff59a';ctx.lineWidth=2;const[bx,by]=pts[4];ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+(fxH(sd,11)>.5?1:-1)*14,by+12);ctx.stroke();ctx.globalAlpha=1;
   for(let q=0;q<8;q++){const ang=q*Math.PI/4+sd,r=4+d*70;fxSpark(x+Math.cos(ang)*r,y+8+Math.sin(ang)*r*.6,2,'#fff59a')}});
  fxFlash('#fffbd0',flash*.5);if(p>.5){ctx.strokeStyle='#fff59a';ctx.lineWidth=1.5;ctx.globalAlpha=.8*(1-fxSeg(p,.7,1));for(let i=0;i<4;i++){const ang=i*1.57+p*30,r=16+fxH(f.seed,i)*8;ctx.beginPath();ctx.arc(x,y,r,ang,ang+.9);ctx.stroke()}ctx.globalAlpha=1}},
 /* 星夢閃光：夢幻光暈與十字光芒 */
 dreamflash(f,p){const[c1,c2,c3]=fxCol('光'),x=f.cx,y=f.cy,a=fxSeg(p,0,.4),b=fxSeg(p,.2,1),r=6+fxE(a)*34,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.5,'rgba(255,214,240,.6)');g.addColorStop(1,'rgba(255,214,240,0)');
  ctx.globalAlpha=1-fxSeg(p,.6,1);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=(1-b)*.95;ctx.fillStyle='#ffffff';const L=Math.round(64*fxE(a));ctx.fillRect(x-L,Math.round(y),L*2,1);ctx.fillRect(Math.round(x),y-L,1,L*2);ctx.globalAlpha=1;
  for(let i=0;i<14;i++){const h=fxH(f.seed,i),ang=i*Math.PI*2/14+h,rr=6+b*44*(.6+h*.4);ctx.globalAlpha=1-b;fxSpark(x+Math.cos(ang)*rr,y+Math.sin(ang)*rr*.8,2,[c1,c2,c3][i%3])}ctx.globalAlpha=1},
 /* 甜夢治癒：愛心與綠色星光向上飄（施放者自身） */
 dreamheal(f,p){const x=f.cx,y=f.cy,g=ctx.createRadialGradient(x,y+6,0,x,y+6,30);g.addColorStop(0,'rgba(255,230,245,.7)');g.addColorStop(1,'rgba(255,230,245,0)');ctx.globalAlpha=Math.sin(Math.min(1,p*1.1)*Math.PI);ctx.fillStyle=g;ctx.fillRect(x-32,y-26,64,64);ctx.globalAlpha=1;fxRing(x,y+4,8+fxSeg(p,0,.5)*24,'#ffd1ec',2,(1-fxSeg(p,0,.7))*.8);
  for(let i=0;i<9;i++){const h=fxH(f.seed,i),u=fxSeg(p,h*.45,h*.45+.5);if(u<=0||u>=1)continue;const hx=x+(fxH(f.seed,i+11)-.5)*34,hy=y+14-u*40;ctx.globalAlpha=1-u*.6;if(i%2)fxHeart(hx,hy,2.8+h*1.4,'#ff8fc0');else fxSpark(hx,hy,3,'#a6ffb8')}ctx.globalAlpha=1},
 /* 彩虹星爆：七色光圈、彩虹拱橋與星星迸散 */
 rainbow(f,p){const x=f.cx,y=f.cy,cols=['#ff5f6d','#ffa94d','#ffe14d','#6fe06f','#4dc3ff','#6f7bff','#c06fff'];fxFlash('#ffffff',.55*(1-fxSeg(p,0,.25)));
  for(let i=0;i<7;i++){const u=fxSeg(p,.08+i*.045,.7+i*.03);if(u<=0)continue;fxRing(x,y,3+fxE(u)*(34+i*2),cols[i],2.2,(1-u)*.95)}
  const b=fxSeg(p,.25,.7),fd=1-fxSeg(p,.8,1);ctx.lineWidth=2.2;ctx.globalAlpha=fd*.95;for(let i=0;i<7;i++){ctx.strokeStyle=cols[i];ctx.beginPath();ctx.arc(x,y+14,(34-i*2.3)*fxE(b),Math.PI,Math.PI+Math.PI*fxE(b));ctx.stroke()}ctx.globalAlpha=1;
  for(let i=0;i<14;i++){const h=fxH(f.seed,i),ang=i*Math.PI*2/14+h*.3,u=fxSeg(p,.12,.9);if(u<=0||u>=1)continue;const r=4+fxE(u)*(30+h*26);ctx.globalAlpha=1-u*.5;fxStar5(x+Math.cos(ang)*r,y+Math.sin(ang)*r*.8,3.4,1.5,u*8,cols[i%7])}ctx.globalAlpha=1},
 /* 撒嬌連環砲：愛心砲彈一發接一發 */
 cutebarrage(f,p){const x=f.cx,y=f.cy,sx=f.sx,sy=f.sy;
  for(let i=0;i<6;i++){const st=.06+i*.1,u=fxSeg(p,st,st+.34),ty=y+(fxH(f.seed,i)-.5)*22,tx=x+(fxH(f.seed,i+7)-.5)*22,pos=k=>[sx+(tx-sx)*k,sy+(ty-sy)*k-Math.sin(k*Math.PI)*14];
   if(u>0&&u<1){const k=fxE(u),[px,py]=pos(k);for(let t=1;t<=3;t++){const[qx,qy]=pos(fxE(Math.max(0,u-t*.05)));ctx.globalAlpha=.5-t*.12;fxHeart(qx,qy,2.6-t*.4,'#ffc2dd')}ctx.globalAlpha=1;fxHeart(px,py,3.8,'#ff6fae')}
   else if(u>=1){const ub=fxSeg(p,st+.34,st+.46);if(ub<1){for(let q=0;q<5;q++){const ang=q*Math.PI*2/5+i,r=2+ub*9;ctx.globalAlpha=1-ub;fxSpark(tx+Math.cos(ang)*r,ty+Math.sin(ang)*r,1.5,q%2?'#ffffff':'#ff9fd0')}fxHeart(tx,ty-ub*8,3.2*(1-ub*.5),'#ff6fae');ctx.globalAlpha=1}}}},
 /* 蘿蔔雨啪啦：蘿蔔從天而降 */
 radishrain(f,p){const x=f.cx,y=f.cy;
  for(let i=0;i<14;i++){const h=fxH(f.seed,i),st=h*.5,u=fxSeg(p,st,st+.35),tx=x+(fxH(f.seed,i+9)-.5)*40,ty=y+(fxH(f.seed,i+19)-.5)*26;
   if(u>0&&u<1)fxRadish(tx-(1-u)*10,-10+(ty+10)*u*u,1+h*.3,(1-u)*.6+h);
   else if(u>=1){const ub=fxSeg(p,st+.35,st+.52);if(ub<1){ctx.globalAlpha=1-ub;for(let q=0;q<4;q++){const ang=q*Math.PI/2+h*3,r=2+ub*8;fxSq(tx+Math.cos(ang)*r,ty+Math.sin(ang)*r*.7,2,q%2?'#7edc6a':'#d8ffc8')}fxRing(tx,ty+2,2+ub*7,'#d8ffc8',1,1-ub);ctx.globalAlpha=1}}}},
 /* 耍廢打滾擊：滾成一球衝向對手 */
 roll(f,p){const x=f.cx,y=f.cy,sx=f.sx,sy=f.sy,a=fxSeg(p,0,.55),b=fxSeg(p,.5,1);
  if(a<1){const k=fxE(a),pos=kk=>[sx+(x-sx)*kk,sy+(y-sy)*kk-Math.sin(kk*Math.PI)*10],[px,py]=pos(k);for(let t=1;t<=6;t++){const[qx,qy]=pos(fxE(Math.max(0,a-t*.045)));fxDisc(qx,qy+5,Math.max(.5,4-t*.4),'#e8dcc8',.55-t*.08)}fxDisc(px,py,9,'#ffb3c8');ctx.strokeStyle='#d9588a';ctx.lineWidth=2;const rot=a*22;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(px,py,6,rot+i*2.09,rot+i*2.09+1.2);ctx.stroke()}ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.stroke()}
  else{fxFlash('#ffffff',.5*(1-b));ctx.strokeStyle='#fff4a8';ctx.lineWidth=2;ctx.globalAlpha=1-b;for(let i=0;i<10;i++){const ang=i*Math.PI/5+.3,r1=4+b*6,r2=10+b*34;ctx.beginPath();ctx.moveTo(x+Math.cos(ang)*r1,y+Math.sin(ang)*r1);ctx.lineTo(x+Math.cos(ang)*r2,y+Math.sin(ang)*r2);ctx.stroke()}ctx.globalAlpha=1;fxRing(x,y,5+b*28,'#fff7c0',3,1-b);for(let i=0;i<8;i++){const h=fxH(f.seed,i);fxDisc(x+(h-.5)*60*b,y+10+(fxH(f.seed,i+5)-.5)*14,2+b*5,'#e8dcc8',.6*(1-b))}}},
 /* 通用：依招式屬性著色的專屬招式（守護者的奇蹟／祝福／狂想曲／閃擊／之歌） */
 sigburst(f,p){const[c1,c2,c3]=fxCol(f.y),x=f.cx,y=f.cy,a=fxSeg(p,0,.5),fd=1-fxSeg(p,.7,1);fxFlash(c2,.28*Math.sin(Math.min(1,p*1.6)*Math.PI));fxRing(x,y,6+fxE(a)*30,c1,3,fd);fxRing(x,y,3+fxE(a)*20,c2,2,fd);
  for(let i=0;i<10;i++){const ang=i*Math.PI/5+p*5,r=8+fxE(a)*28;ctx.globalAlpha=fd;fxSq(x+Math.cos(ang)*r,y+Math.sin(ang)*r*.6,i%2?3:2,i%2?c2:c3)}ctx.globalAlpha=1;
  ctx.strokeStyle=c3;ctx.lineWidth=2;ctx.globalAlpha=fd*.9;for(let i=0;i<8;i++){const ang=i*Math.PI/4+.4,r1=4+a*6,r2=10+fxE(a)*40;ctx.beginPath();ctx.moveTo(x+Math.cos(ang)*r1,y+Math.sin(ang)*r1);ctx.lineTo(x+Math.cos(ang)*r2,y+Math.sin(ang)*r2);ctx.stroke()}ctx.globalAlpha=1}
};
function drawLegendFx(){
 const f=B&&B.fx;if(!f||f.kind!=='legend')return;
 const p=Math.max(0,Math.min(1,(performance.now()-f.t0)/f.d)),fn=LEGEND_DRAW[f.k];if(!fn)return;
 ctx.save();try{fn(f,p)}catch(e){}ctx.restore();
}

