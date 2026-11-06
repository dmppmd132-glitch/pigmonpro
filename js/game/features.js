/* PigmonPro module: Exploration, buildings, puzzles, lairs, and gameplay feature hooks. Loaded in order by index.html. */
/* ---------- requested gameplay / controls update ---------- */
// Rare/special areas are entered only after an explicit confirmation.
const SPECIAL_AREAS = new Set([
 'maze','sea','volc','undersea','underseaDeep','trench','trenchEast','trenchWest',
 'forestDeep','forestGrove','forestCanopy','forestMoss',
 'mine','volcIn','iceCave','lab','ruins','ruins2','dreamSpace','dreamBranch',
 'dreamCore','labUnderground'
]);
let specialReturn = null;      // {m, dx, dy, bx, by}: outer map, door tile, tile stepped from
let specialEntryPending = false;
let bExitHint = false;
const isSpecial = m => SPECIAL_AREAS.has(m);
// Stand the player on a walkable tile next to the door (used after declining / when leaving by B).
function placeBesideDoor(dx,dy,bx,by){
 const c=[];
 if(bx!=null)c.push([bx,by]);
 [[0,1],[0,-1],[-1,0],[1,0]].forEach(d=>c.push([dx+d[0],dy+d[1]]));
 for(const [x,y] of c){if(walk(x,y)){Pl.x=x;Pl.y=y;Pl.mv=false;Pl.prog=0;return}}
 Pl.x=dx;Pl.y=dy;Pl.mv=false;Pl.prog=0;
}
// Fallback when no return point is remembered (e.g. loaded a save inside a special area).
function findSpecialDoor(m){
 for(const k of Object.keys(WARP)){
  const t=WARP[k],p=k.split(',');
  if(t[0]===m&&!isSpecial(p[0])&&MAPS[p[0]])return{m:p[0],dx:+p[1],dy:+p[2]};
 }
 return null;
}
// B now cancels; X opens the former B menu; Y opens a compact map screen.
// In a special area, B returns to the map from which it was entered.
// Draw a simple region overview for the new Y button.
// Replace repeated town-shop NPCs with exactly one shop per town, keeping one shop
// landmark/interaction in each settlement.
for(const townId of ['town','route','school','a2','a3','a4','a5','a6']){
 const shops=NPCS.filter(n=>n.m===townId && n.shop);
 if(shops.length>1){
  shops.slice(1).forEach(n=>{n.shop=null;n.id='';n.d=['居民：這裡的商店已集中管理。'];});
 }
}
function addShopLandmark(m,x,y){
 if(!MAPS[m] || !MAPS[m][y])return;
 MAPS[m][y]=MAPS[m][y].slice(0,x)+'T'+MAPS[m][y].slice(x+1);
}
addShopLandmark('town',5,1);
addShopLandmark('route',6,5);
for(const m of ['school','a2','a3','a4','a5','a6']) addShopLandmark(m,5,5);

// Make shop and service buildings visually distinct on the map.
// The four requested puzzle activities replace the old push-rock minigame.
// They are turn-based so they work with both keyboard and touch controls.
rockPuzzle = async function(key){
 const q=ROCK_PUZZLES[key];
 if(!q || FL['rock:'+key])return;
 S.mode='event';
 const games=['貪食蛇','接球／躲避下落物','彈跳穿越障礙','記憶翻牌'];
 const choice=Math.floor(Math.random()*games.length);
 await say(`機關隨機抽中了「${games[choice]}」！準備開始挑戰。`);
 let won=false;
 if(choice===0){
  let snake=[[2,2],[1,2]],dir=1,food=[rnd(0,5),rnd(0,5)],steps=0;
  await say('貪食蛇：使用方向選擇移動方向，吃到食物加長；撞牆或撞到自己就結束。');
  while(steps<18){
   const c=await choose(['上','下','左','右','結束'],2,'full',true);
   if(c<0||c===4)break;
   const d=[[0,-1],[0,1],[-1,0],[1,0]][c],h=[snake[0][0]+d[0],snake[0][1]+d[1]];
   if(h[0]<0||h[0]>5||h[1]<0||h[1]>5||snake.some(p=>p[0]===h[0]&&p[1]===h[1]))break;
   snake.unshift(h);if(h[0]===food[0]&&h[1]===food[1]){food=[rnd(0,5),rnd(0,5)];if(snake.length>=5){won=true;break}}else snake.pop();
   steps++;
  }
 }else if(choice===1){
  let score=0;
  await say('接球／躲避：每回合選擇左、中、右，接住水果得分，避開落石。');
  for(let i=0;i<8;i++){
   const item=Math.random()<.65?'水果':'落石',lane=rnd(0,2);
   const c=await choose(['左','中','右'],2,'full',true);
   if(c<0)break;
   if((item==='水果'&&c===lane)||(item==='落石'&&c!==lane))score++;
   await say(item==='水果'?(c===lane?'接住水果！':'水果掉落了。'):(c===lane?'被落石砸中！':'成功躲開落石！'));
  }
  won=score>=6;
 }else if(choice===2){
  let score=0;
  await say('彈跳挑戰：每個障礙選擇「跳」或「不跳」，連續通過 6 個障礙。');
  for(let i=0;i<6;i++){
   const obstacle=Math.random()<.5;
   const c=await choose(['跳','不跳'],2,'full',true);
   if(c<0)break;
   if((obstacle&&c===0)||(!obstacle&&c===1))score++;
   else await say('碰到障礙，失去一次機會！');
  }
  won=score>=5;
 }else{
  const deck=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];for(let z=deck.length-1;z>0;z--){const j=Math.floor(Math.random()*(z+1));[deck[z],deck[j]]=[deck[j],deck[z]]}
  const open=[],matched=new Set();let turns=0;
  await say('記憶翻牌：輸入兩張卡片編號（1～16），找出所有相同圖案。隨時按 B 可放棄離開。');
  while(matched.size<16&&turns<24){
   const a=await choose(Array.from({length:16},(_,i)=>`${i+1}${matched.has(i)?'（已配對）':''}`),4,'full',true);
   if(a<0)break;if(matched.has(a))continue;
   const b=await choose(Array.from({length:16},(_,i)=>`${i+1}${matched.has(i)||i===a?'（不可選）':''}`),4,'full',true);
   if(b<0||b===a||matched.has(b))continue;
   turns++;
   if(deck[a]===deck[b]){matched.add(a);matched.add(b);await say('配對成功！')}
   else await say(`沒有配對（目前 ${matched.size/2}/8 組）。`);
  }
  won=matched.size===16;
 }
 if(won){FL['rock:'+key]=1;q.reward();await say('挑戰成功！機關解除並獲得專屬獎勵！')}
 else await say('這次沒有完成挑戰，可以再次進入嘗試。');
 S.mode='map';
};


/* ===== 房屋、商店、星學堂與屬性傳說迷宮 ===== */
/* XYAB 十字排列：X 上、Y 右、A 左、B 下 */
document.querySelector('.ab')?.classList.add('cross-pad');
const padStyle=document.createElement('style');
padStyle.textContent=`
.ab.cross-pad{display:grid;grid-template:repeat(3,48px)/repeat(3,48px);gap:3px;max-width:none;transform:none;flex-wrap:initial;justify-content:center}
.ab.cross-pad button{width:48px;height:48px;margin:0}
.ab.cross-pad button[data-k="x"]{grid-area:1/2}
.ab.cross-pad button[data-k="y"]{grid-area:2/3}
.ab.cross-pad button[data-k="a"]{grid-area:2/1}
.ab.cross-pad button[data-k="b"]{grid-area:3/2}
`;
document.head.appendChild(padStyle);

/* Remove every outdoor merchant. Merchants exist only inside a shop building. */
for(let i=NPCS.length-1;i>=0;i--)if(NPCS[i].shop||String(NPCS[i].id||'').startsWith('shop_'))NPCS.splice(i,1);
const SETTLEMENTS=['town','route','school','a2','a3','a4','a5','a6'];
const SHOP_LAYOUT={
 town:{mark:[16,5],door:[15,7]},
 route:{mark:[9,5],door:[8,6]},
 school:{mark:[9,5],door:[8,6]},
 a2:{mark:[9,5],door:[8,6]},a3:{mark:[9,5],door:[8,6]},
 a4:{mark:[9,5],door:[8,6]},a5:{mark:[9,5],door:[8,6]},a6:{mark:[9,5],door:[8,6]}
};
const makeRoom=(w=9,h=9)=>Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>(y===0||y===h-1||x===0||x===w-1)?'#':'.').join(''));
function placeTile(mapName,x,y,ch){if(!MAPS[mapName]||!MAPS[mapName][y]||x<0||x>=MAPS[mapName][y].length)return;put(mapName,ch,[[x,y]])}
for(const m of SETTLEMENTS){
 const spec=SHOP_LAYOUT[m],roomId='shop_'+m;
 MAPS[roomId]=makeRoom();PAL[roomId]=['#fff5e9','#edc99c','#a86d42','#55351f'];
 if(m==='town'){
  [[14,5,'H'],[15,5,'H'],[16,5,'T'],[14,6,'H'],[16,6,'H']].forEach(([x,y,c])=>placeTile(m,x,y,c));
 }else{
  const [mx,my]=spec.mark;
  placeTile(m,mx-1,my,'H');placeTile(m,mx,my,'H');placeTile(m,mx+1,my,'T');
  placeTile(m,mx-1,my+1,'H');placeTile(m,mx+1,my+1,'H');
 }
 placeTile(m,spec.door[0],spec.door[1],'D');
 MAPS[roomId][8]=MAPS[roomId][8].slice(0,4)+'.'+MAPS[roomId][8].slice(5);
 WARP[`${m},${spec.door[0]},${spec.door[1]}`]=[roomId,4,7];
 WARP[`${roomId},4,8`]=[m,spec.door[0],spec.door[1]+1];
 NPCS.push(Object.assign(mk(roomId,4,3,2,'merchant_'+m,['雜貨店老闆：歡迎光臨！需要購買什麼呢？'],null,null,null,null,null,'store'),{shop:true}));
}
/* The old town shop warp is redirected to the dedicated shop room. */
WARP['town,15,7']=['shop_town',4,7];
/* House marker is drawn at the upper-right roof tile, not over the doorway. */
const HOUSE_MARKERS={};
for(const [m,v] of Object.entries(SHOP_LAYOUT))HOUSE_MARKERS[`${m}:${v.mark[0]}:${v.mark[1]}`]='SHOP';
for(const [m,rows] of Object.entries(MAPS)){
 for(let y=1;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){
  const c=rows[y][x];
  if(c==='C'||c==='h')HOUSE_MARKERS[`${m}:${x+1}:${y-1}`]='HOME';
  if(c==='G'){
   const gym=GYMS.find(g=>g.m===m);
   HOUSE_MARKERS[`${m}:${x+1}:${y-1}`]=gym?(ENEMIES[gym.s]?.t||'館'):'館';
  }
 }
}

/* A dedicated school building and an explorable classroom. */
const schoolMark=[12,2],schoolDoor=[11,3];
[[10,2,'H'],[11,2,'H'],[12,2,'H'],[10,3,'H'],[11,3,'D'],[12,3,'H']].forEach(([x,y,c])=>placeTile('school',x,y,c));
WARP['school,11,3']=['schoolInterior',6,9];
WARP['schoolInterior,6,10']=['school',11,4];
MAPS.schoolInterior=MAP_LAYOUTS.schoolInterior;
PAL.schoolInterior=['#fff8e8','#e8bd79','#9b6337','#54351f'];
WARP['school,11,3']=['schoolInterior',6,9];
WARP['schoolInterior,6,10']=['school',11,4];
NPCS.push(mk('schoolInterior',6,2,3,'school_teacher',['講師：歡迎來到星學堂！今天要學習屬性相剋與迷宮探索。','記得依照怪獸屬性選擇合適的隊伍！']));
NPCS.push(mk('schoolInterior',9,7,1,'school_student',['學員：我正在上課，老師講得好清楚！']));
/* Type-themed legendary labyrinths: every rare lair is a maze with a clear route to its guardian. */
const TYPE_PALETTES={
 '水':['#dffaff','#80d9e8','#258ba9','#103e59'],
 '火':['#fff0dc','#ff9b55','#d84b27','#5a1710'],
 '電':['#fffbd8','#ffe56c','#d4a400','#4c3900'],
 '草':['#f1ffe7','#a9df83','#4c9c42','#1d4b25'],
 '土':['#f3e5c8','#c9a36a','#88613b','#3d2a1a'],
 '冰':['#f1fcff','#c6edf5','#78b7cf','#294a60'],
 '光':['#fffbe8','#f6df8c','#c69c36','#5b4619'],
 '暗':['#eee8ff','#a99bd5','#66508f','#2b204b'],
 '毒':['#f8e8ff','#c69bd8','#87509c','#3b214c'],
 '普':['#fff0f4','#edb8ca','#b66b8b','#542c43']
};
function themedLair(seed,type){
 const w=15,h=13,rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>(x===0||y===0||x===w-1||y===h-1)?'#':'.'));
 /* Carve a winding central route and deterministic side branches. */
 let x=7,y=11;rows[y][x]='.';
 let z=seed*9301+49297;const rand=()=>{z=(z*16807)%2147483647;return z/2147483647};
 while(y>3){y--;rows[y][x]='.';if(rand()>.58){const dx=rand()>.5?1:-1;for(let n=0;n<2;n++){const nx=Math.max(1,Math.min(w-2,x+dx));x=nx;rows[y][x]='.'}}}
 for(let i=0;i<18;i++){const bx=1+Math.floor(rand()*(w-2)),by=2+Math.floor(rand()*(h-4));for(let j=0;j<3;j++){const nx=Math.max(1,Math.min(w-2,bx+j));rows[by][nx]='.'}}
 for(let yy=3;yy<=11;yy++)rows[yy][7]='.';
 rows[11][7]='.';rows[12][7]='.';
 const deco=type==='水'?'~':type==='火'?'^':['電','光'].includes(type)?'*':['草','土'].includes(type)?'+':['冰','暗','毒'].includes(type)?'o':'+';
 for(let yy=2;yy<12;yy++)for(let xx=1;xx<14;xx++)if(rows[yy][xx]==='.'&&((xx*7+yy*11+seed)%17===0))rows[yy][xx]=deco;
 rows[3][7]='.';rows[11][7]='.';
 return rows.map(r=>r.join(''));
}
const legendLairSources=[
 [7,'a4',17,1,'a4'],[61,'a2',17,1,'school'],[63,'sea',13,2,'sea'],
 [64,'volc',17,4,'volc'],[105,'a6',17,1,'a6'],[106,'a3',17,1,'a3']
];
for(let i=0;i<19;i++){
 const id=RARE[i],e=ENEMIES[id],lid='L'+i;
 if(!MAPS[lid])continue;
 MAPS[lid]=themedLair(i+1,e.t||'普');
 PAL[lid]=(TYPE_PALETTES[e.t]||TYPE_PALETTES['普']).slice();
 const n=NPCS.find(q=>q.m===lid&&String(q.id||'').startsWith('leg'));
 if(n){n.x=7;n.y=3}
 const src=legendLairSources[i];
 if(src){const [monId,m,ex,ey]=src;WARP[`${m},${ex},${ey}`]=[lid,7,11];WARP[`${lid},7,12`]=[m,ex,ey+1]}
}

/* Give every rare/legend guardian a reachable entrance, not only the first six lairs. */
const lairAccessMaps=['a2','a3','a4','a5','a6','route','school','forest','sea','volc','mine','volcIn','town'];
const lairAccessXs=[2,4,6,8,10,12,14,16,18];
for(let i=0;i<19;i++){
 const lid='L'+i,source=lairAccessMaps[i%lairAccessMaps.length],x=lairAccessXs[Math.floor(i/lairAccessMaps.length)]||2;
 const y=['sea','volc'].includes(source)?11:10;
 if(MAPS[source]&&MAPS[source][y]&&x<MAPS[source][y].length){
  placeTile(source,x,y,'D');
  WARP[`${source},${x},${y}`]=[lid,7,11];
  WARP[`${lid},7,12`]=[source,x,y+1];
 }
}
/* Outside NPCs are never vendors. Only the dedicated indoor shopkeeper can sell. */
// Keyboard mapping: X is the old menu key, B is cancel, Y is map.

