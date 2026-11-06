/* PigmonPro module: Input mapping, final UI polish, rendering overrides, and bootstrapping. Loaded in order by index.html. */
/* ---------- input ---------- */
const KEYS={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',z:'a',' ':'a',Enter:'a',x:'x',X:'x',b:'b',B:'b',y:'y',Y:'y',Escape:'b',Backspace:'b'};
addEventListener('keydown',e=>{const k=KEYS[e.key.length>1?e.key:e.key.toLowerCase()];if(!k)return;e.preventDefault();held[k]=true;if(!e.repeat)press(k)});
addEventListener('keyup',e=>{const k=KEYS[e.key.length>1?e.key:e.key.toLowerCase()];if(k)held[k]=false});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();held[k]=true;press(k)});
 ['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,()=>{held[k]=false}));
});

/* ===== Final polish: battle move panel, random minigames, clean building icons, dex list ===== */
/* The dex opens as a compact index. A selects a creature to open its original detail card. */
/* Replace text labels on map buildings with compact pictograms; no floating letters or words. */
function drawHouseGlyph(kind,sx,sy,type){
 R(sx+5,sy+1,10,9,0);
 if(kind==='shop'){
  R(sx+6,sy+2,8,2,3);R(sx+6,sy+4,8,2,2);R(sx+7,sy+6,6,3,1);R(sx+9,sy+7,2,2,3);
 }else if(kind==='home'){
  R(sx+6,sy+3,8,5,3);R(sx+7,sy+4,6,3,0);R(sx+9,sy+6,2,3,3);
 }else if(kind==='hospital'){
  R(sx+9,sy+2,2,7,3);R(sx+6,sy+4,8,2,3);
 }else if(kind==='school'){
  R(sx+6,sy+3,8,5,3);R(sx+7,sy+4,6,3,1);R(sx+8,sy+9,4,1,3);
 }else{
  /* Type-specific badge, drawn entirely as geometry rather than text. */
  const colors={水:2,火:3,電:3,草:2,土:3,冰:2,光:3,暗:3,毒:2,普:3};
  const c=colors[type]||3;
  ell(sx+10,sy+5,4,4,c);
  if(type==='水'){R(sx+9,sy+2,2,6,0);R(sx+7,sy+5,6,2,0)}
  else if(type==='火'){R(sx+9,sy+1,2,7,0);R(sx+7,sy+4,6,3,0)}
  else if(type==='電'){R(sx+10,sy+1,2,4,0);R(sx+8,sy+4,4,2,0);R(sx+9,sy+6,2,3,0)}
  else if(type==='草'){R(sx+9,sy+2,2,6,0);R(sx+7,sy+4,3,2,0);R(sx+10,sy+6,3,2,0)}
  else if(type==='土'){R(sx+7,sy+3,6,5,0);R(sx+8,sy+2,4,1,0)}
  else if(type==='冰'){R(sx+9,sy+1,2,8,0);R(sx+6,sy+4,8,2,0)}
  else if(type==='光'){R(sx+9,sy+1,2,8,0);R(sx+6,sy+4,8,2,0);R(sx+7,sy+2,2,2,0);R(sx+12,sy+7,2,2,0)}
  else if(type==='暗'){ell(sx+10,sy+5,3,4,0);R(sx+11,sy+1,2,3,c)}
  else if(type==='毒'){ell(sx+10,sy+5,2,3,0);R(sx+7,sy+2,2,2,0);R(sx+12,sy+2,2,2,0)}
  else {R(sx+7,sy+4,6,2,0);R(sx+9,sy+2,2,6,0)}
 }
}
/* Every settlement hospital is an actual building: approach its doorway to enter, then speak to the nurse. */
const _hospitalMaps=['town','route','school','a2','a3','a4','a5','a6'];
for(const mapName of _hospitalMaps){
 const rows=MAPS[mapName];if(!rows)continue;
 let found=null;
 for(let yy=1;yy<rows.length-1&&!found;yy++)for(let xx=1;xx<rows[yy].length-1;xx++)if(rows[yy][xx]==='C'||rows[yy][xx]==='h'){found=[xx,yy];break}
 if(!found)continue;
 const [hx,hy]=found,room='hospital_'+mapName;
 MAPS[room]=MAP_LAYOUTS.hospitalRoom.slice();
 PAL[room]=['#f5fbff','#b9dbe8','#5c9ab2','#24485c'];
 /* 沿用原本單一 C／h 房屋磚作為唯一入口，不再改寫周邊道路。 */
 WARP[`${mapName},${hx},${hy}`]=[room,4,7];
 WARP[`${room},4,8`]=[mapName,hx,Math.min(rows.length-2,hy+1)];
 NPCS.push(Object.assign(mk(room,4,3,2,'nurse_'+mapName,['護理師：歡迎來到健康中心！需要恢復隊伍體力嗎？']),{fn:async()=>{S.mode='event';await say('護理師：歡迎來到健康中心！');healAll();await say('全隊的體力與 PP 都已經全部恢復了！');for(;;){S.prompt='還需要\n什麼服務？';const c=await choose(['電腦','存檔','離開'],1,'right');if(c===0)await pc();else if(c===1)await say(save()?'冒險已經記錄下來了！':'無法存檔……');else break}S.mode='map'}}));
}
/* The old instant-heal tile is no longer a service shortcut. */
/* ===== 修正包 v1：地圖進出卡住、傳說巢穴、圖示顯示 ===== */
(function fixWorldAndIcons(){
 /* ---------- 地圖中文名稱（提示文字、清單用） ---------- */
 const MAP_NAMES={town:'豬豬鎮',forest:'月影森林',route:'藍濱水族城',school:'星學堂鎮',a2:'花語城',a3:'雷鳴城',a4:'烈焰城',a5:'礦石城',a6:'冰晶城',
  sea:'蔚藍海域',volc:'烈岩火山',maze:'迷宮',maze2:'迷宮深處',gym:'道館',mine:'地下礦坑',volcIn:'火山內部',iceCave:'冰晶洞窟',lab:'廢棄研究所',ruins:'古代遺跡',
  dreamSpace:'夢境空間',undersea:'海底洞窟',underseaDeep:'海底深處',trench:'海溝',trenchEast:'東側海溝',trenchWest:'西側海溝',forestDeep:'森林秘境',
  forestGrove:'古王聖林',forestCanopy:'樹冠秘境',forestMoss:'苔蘚秘境',ruins2:'遺跡深處',dreamBranch:'夢境支路',dreamCore:'夢境核心',labUnderground:'研究所地下層',
  schoolInterior:'星學堂教室',shop:'雜貨店'};
 window.MAP_NAMES=MAP_NAMES;
 window.mapName=id=>{
  if(MAP_NAMES[id])return MAP_NAMES[id];
  let m;
  if(m=/^g(\d)$/.exec(id))return `第${+m[1]+1}道館`;
  if(m=/^L(\d+)(F2)?$/.exec(id))return `傳說巢穴 ${+m[1]+1}・${m[2]?'2F':'1F'}`;
  if(m=/^shop_(.+)$/.exec(id))return `${MAP_NAMES[m[1]]||m[1]}雜貨店`;
  if(m=/^hospital_(.+)$/.exec(id))return `${MAP_NAMES[m[1]]||m[1]}健康中心`;
  return id};

 /* ---------- 小工具 ---------- */
 const BLOCK='#HLrTw';                         // 不能走的磚（w 水面需衝浪）
 const tileAt=(m,x,y)=>{const r=MAPS[m]&&MAPS[m][y];return r?r[x]:undefined};
 const setTile=(m,x,y,c)=>{const r=MAPS[m][y];MAPS[m][y]=r.slice(0,x)+c+r.slice(x+1)};
 const wk=(m,x,y)=>`${m},${x},${y}`;
 const npcHere=(m,x,y)=>NPCS.some(n=>n.m===m&&n.x===x&&n.y===y);
 const walkable=(m,x,y)=>{const t=tileAt(m,x,y);return t!==undefined&&!BLOCK.includes(t)};
 const isOpen=(m,x,y)=>walkable(m,x,y)&&!npcHere(m,x,y);
 const isWarp=(m,x,y)=>!!WARP[wk(m,x,y)];
 /* 找出某個門旁邊「可以安全站著」的格子：優先平地，其次草地；不選傳送格、NPC、牆 */
 const spotNear=(m,x,y)=>{
  for(const ground of ['.','g'])
   for(let r=1;r<=3;r++)
    for(const [dx,dy] of [[0,r],[-r,0],[r,0],[0,-r],[-r,r],[r,r],[-r,-r],[r,-r]]){
     const nx=x+dx,ny=y+dy;
     if(tileAt(m,nx,ny)===ground&&isOpen(m,nx,ny)&&!isWarp(m,nx,ny))return [nx,ny];
    }
  return null};
 /* 擋路 NPC 的分類：訓練家／守護者／王是「關卡」，不能亂挪；其他路人可以挪 */
 const gatedNpc=n=>n.t||n.hide||/^(wolf|leg|boss)/.test(String(n.id||''));
 const npcBlocks=(m,x,y,movableIgnored)=>{const n=NPCS.find(q=>q.m===m&&q.x===x&&q.y===y);return !!n&&!(movableIgnored&&!gatedNpc(n))};
 /* 從 start 出發，不踩傳送格、不碰機關格，回傳可走到的格子集合 */
 const floodFrom=(m,sx,sy,movableIgnored)=>{
  const seen=new Set([sx+','+sy]),q=[[sx,sy]];
  while(q.length){const [x,y]=q.shift();
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const nx=x+dx,ny=y+dy,k=nx+','+ny;
    if(seen.has(k)||!walkable(m,nx,ny)||npcBlocks(m,nx,ny,movableIgnored))continue;
    seen.add(k);
    if(isWarp(m,nx,ny)||'BPSRZMKU'.includes(tileAt(m,nx,ny)))continue;
    q.push([nx,ny]);}}
  return seen};
 const landingsOf=m=>Object.values(WARP).filter(v=>v[0]===m).map(v=>[v[1],v[2]]);

 /* ---------- 1. 傳說巢穴：19 位守護者各自一個巢穴、一個入口 ---------- */
 /* 守護者順序：前 6 位沿用原本的入口（G 門），其餘 13 位原本只有入口沒有地圖 → 會讓遊戲壞掉 */
 const GU=CREATURE_DATA.groveGuardIds;
 const OLD_DOORS=[['a4',17,1],['a2',17,1],['sea',13,2],['volc',17,4],['a6',17,1],['a3',17,1]];
 const NEW_HOSTS=['a2','a3','a4','a5','a6','route','school','forest','sea','volc','mine','volcIn','town'];
 /* 清掉所有跟巢穴有關的舊傳送點（它們的出口落在牆裡，或指向不存在的地圖） */
 for(const k of Object.keys(WARP)){
  const [sm,sx,sy]=k.split(','),tm=WARP[k][0];
  if(/^L\d+$/.test(sm)||/^L\d+$/.test(tm)){
   if(/^L\d+$/.test(tm)&&tileAt(sm,+sx,+sy)==='D')setTile(sm,+sx,+sy,'.');
   delete WARP[k];}
 }
 /* 在 host 地圖挑一個「走得到、四周都是空地」的位置當巢穴門 */
 const pickDoorSpot=host=>{
  const rows=MAPS[host];if(!rows)return null;
  const starts=landingsOf(host);if(!starts.length)starts.push([1,1]);
  const reach=new Set();starts.forEach(([x,y])=>floodFrom(host,x,y).forEach(k=>reach.add(k)));
  const cands=[];
  for(const k of reach){
   const [x,y]=k.split(',').map(Number);
   if(x<2||y<2||x>rows[0].length-3||y>rows.length-3)continue;
   if(tileAt(host,x,y)!=='.'||isWarp(host,x,y)||npcHere(host,x,y))continue;
   let ok=true;
   for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy;
    if(!walkable(host,nx,ny)||isWarp(host,nx,ny)||npcHere(host,nx,ny)){ok=false;break}}
   if(ok)cands.push([x,y]);}
  if(!cands.length)return null;
  /* 取離出生點最遠的一格，讓它像隱藏入口 */
  const [sx,sy]=starts[0];
  cands.sort((a,b)=>(Math.abs(b[0]-sx)+Math.abs(b[1]-sy))-(Math.abs(a[0]-sx)+Math.abs(a[1]-sy))||(a[1]-b[1])||(a[0]-b[0]));
  return cands[0]};
 for(let i=0;i<GU.length;i++){
  const id=GU[i],e=ENEMIES[id],lid='L'+i,type=(e&&e.t)||'普';
  MAPS[lid]=themedLair(i+1,type);
  PAL[lid]=(TYPE_PALETTES[type]||TYPE_PALETTES['普']).slice();
  /* 守護者：前 6 位原本就有，其餘補上 */
  let g=NPCS.find(n=>n.m===lid&&String(n.id||'').startsWith('leg'));
  if(!g){
   g=Object.assign(mk(lid,7,3,3,'leg'+id,['…']),{sp:legTile(id),hide:1,fn:async()=>{S.mode='event';await say(`${e.n}靜靜地注視著你……`);await say(`${e.n}發出震天的怒吼！`);await battle(0,0,id)}});
   NPCS.push(g);}
  g.x=7;g.y=3;
  /* 入口 */
  let door;
  if(i<OLD_DOORS.length){door=OLD_DOORS[i];if(tileAt(door[0],door[1],door[2])===undefined)door=null}
  else{
   const host=NEW_HOSTS[i-OLD_DOORS.length],p=pickDoorSpot(host);
   door=p?[host,p[0],p[1]]:null;
   if(door)setTile(door[0],door[1],door[2],'D');}
  if(!door)continue;
  const [hm,hx,hy]=door;
  WARP[wk(hm,hx,hy)]=[lid,7,11];
  const back=spotNear(hm,hx,hy)||[hx,hy+1];
  WARP[wk(lid,7,12)]=[hm,back[0],back[1]];
 }

 /* ---------- 2. 傳送點整體修正：落點不能在牆、NPC、傳送格上 ---------- */
 for(const k of Object.keys(WARP)){
  const [sm,sx,sy]=k.split(','),[tm,tx,ty]=WARP[k];
  if(!MAPS[sm]||!MAPS[tm]){delete WARP[k];continue}
  /* 觸發格本身如果是牆，改成平地，不然永遠踩不到 */
  if(BLOCK.includes(tileAt(sm,+sx,+sy))&&tileAt(sm,+sx,+sy)!=='w')setTile(sm,+sx,+sy,'.');
 }
 /* 路人 NPC 不能把門或走道堵死（例如礦石城醫院、遺跡的門口）：
    先算「沒有 NPC 時」哪些傳送門走得到，再把擋路的路人挪到不影響走道的位置 */
 const bigRepCache={};
 const bigRep=m=>{                                   // 該地圖最大的一塊連通空地，取一格當基準
  if(bigRepCache[m])return bigRepCache[m];
  const rows=MAPS[m],seen=new Set();let best=null,bestN=0;
  for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){
   if(!walkable(m,x,y)||isWarp(m,x,y)||seen.has(x+','+y))continue;
   const comp=floodFrom(m,x,y,true);let n=0;for(const k of comp){seen.add(k);n++}
   if(n>bestN){bestN=n;best=[x,y]}}
  return bigRepCache[m]=best||[1,1]};
 const doorsReach=(m,movableIgnored)=>{
  const out=new Set(),[sx,sy]=bigRep(m);
  for(const t of floodFrom(m,sx,sy,movableIgnored)){const [x,y]=t.split(',').map(Number);if(isWarp(m,x,y))out.add(x+','+y)}
  return out};
 for(const m of Object.keys(MAPS)){
  const mine=NPCS.filter(n=>n.m===m&&!gatedNpc(n));if(!mine.length)continue;
  const base=doorsReach(m,true);
  const okNow=()=>{const now=doorsReach(m,false);for(const k of base)if(!now.has(k))return false;return true};
  if(okNow())continue;
  for(const n of mine){
   if(okNow())break;
   const ox=n.x,oy=n.y,rows=MAPS[m];
   const cands=[];
   for(let y=1;y<rows.length-1;y++)for(let x=1;x<rows[y].length-1;x++){
    if(tileAt(m,x,y)!=='.'||npcHere(m,x,y)||isWarp(m,x,y))continue;
    if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>isWarp(m,x+dx,y+dy)))continue;
    cands.push([x,y,Math.abs(x-ox)+Math.abs(y-oy)]);}
   cands.sort((a,b)=>a[2]-b[2]);
   let fixed=false;
   for(const [x,y] of cands){n.x=x;n.y=y;if(okNow()){fixed=true;break}}
   if(!fixed){n.x=ox;n.y=oy}
  }
 }
 /* 落點修正放在 NPC 調整之後（門前面的格子空出來才能當落點） */
 for(const k of Object.keys(WARP)){
  const sm=k.split(',')[0],[tm,tx,ty]=WARP[k];
  if(isOpen(tm,tx,ty)&&!isWarp(tm,tx,ty))continue;
  /* 找出對面把我們傳過來的那扇門，在門旁邊找站位 */
  const door=Object.keys(WARP).find(kk=>kk.split(',')[0]===tm&&WARP[kk][0]===sm&&kk!==k);
  let ref=[tx,ty];
  if(door){const p=door.split(',');ref=[+p[1],+p[2]]}
  const s=spotNear(tm,ref[0],ref[1])||spotNear(tm,tx,ty);
  if(s)WARP[k]=[tm,s[0],s[1]];
 }

 /* ---------- 3. 任務/訓練家 ID 重複：路線上的牧童和第二間道館學徒共用 t1，打贏一個另一個也被當成打贏 ---------- */
 const cow=NPCS.find(n=>n.m==='route'&&n.id==='t1');if(cow)cow.id='route_t1';

 /* ---------- 4. 提示文字不要顯示內部代號 ---------- */
  /* ---------- 5. 迷宮地板也會遇到怪（原本只有草/水面會遇敵，迷宮裡一隻都沒有） ---------- */
  /* ---------- 6. 圖示 ---------- */
 const arrowTri=(dir,sx,sy)=>{
  for(let i=0;i<6;i++){
   if(dir==='left')R(sx+3+i,sy+8-i,1,1+2*i,3);
   else if(dir==='right')R(sx+12-i,sy+8-i,1,1+2*i,3);
   else if(dir==='up')R(sx+8-i,sy+3+i,1+2*i,1,3);
   else R(sx+8-i,sy+12-i,1+2*i,1,3);}};
})();

/* ===== 傳說巢穴 1～19：每個巢穴改成兩層迷宮（1F、2F）。
   2F 盡頭的守護者房間裡是守護者；擊敗（或收服）後會問要不要離開，
   同時房間角落會出現一個永久的出口光門。 ===== */
(function lairMazes(){
 const mkRng=seed=>{let z=(seed*9301+49297)%2147483647||1;return()=>{z=(z*16807)%2147483647;return z/2147483647}};
 function carve(w,h,rand){
  const g=Array.from({length:h},()=>Array(w).fill('#'));
  const st=[[1,1]];g[1][1]='.';
  while(st.length){
   const [x,y]=st[st.length-1];
   const d=[[2,0],[-2,0],[0,2],[0,-2]].filter(([a,b])=>x+a>0&&x+a<w-1&&y+b>0&&y+b<h-1&&g[y+b][x+a]==='#');
   if(!d.length){st.pop();continue}
   const [a,b]=d[Math.floor(rand()*d.length)];
   g[y+b/2][x+a/2]='.';g[y+b][x+a]='.';st.push([x+a,y+b]);
  }
  /* 少量打通牆壁，讓迷宮有幾個迴圈，不會只是一棵樹 */
  const extra=Math.floor(w*h/50);
  for(let n=0;n<extra;n++){
   const x=1+2*Math.floor(rand()*((w-3)/2)),y=1+2*Math.floor(rand()*((h-3)/2));
   if(rand()<.5){if(x+2<w-1)g[y][x+1]='.'}else{if(y+2<h-1)g[y+1][x]='.'}
  }
  return g;
 }
 const NB=[[1,0],[-1,0],[0,1],[0,-1]];
 const bfs=(g,sx,sy)=>{
  const dist=new Map([[sx+','+sy,0]]),q=[[sx,sy]];
  for(let k=0;k<q.length;k++){
   const [x,y]=q[k],d=dist.get(x+','+y);
   for(const [a,b] of NB){const nx=x+a,ny=y+b;
    if(g[ny]&&g[ny][nx]==='.'&&!dist.has(nx+','+ny)){dist.set(nx+','+ny,d+1);q.push([nx,ny])}}
  }
  return dist;
 };
 const openNb=(g,x,y)=>NB.filter(([a,b])=>g[y+b]&&g[y+b][x+a]==='.').length;
 const decoOf=t=>t==='水'?'~':t==='火'?'^':['電','光'].includes(t)?'*':['冰','暗','毒'].includes(t)?'o':'+';
 const rowsOf=g=>g.map(r=>r.join(''));
 const LAIR={};   // i -> {f1,f2,back,exit:[x,y],boss:[x,y],id}

 for(let i=0;i<19;i++){
  const f1='L'+i,f2='L'+i+'F2';
  const g0=NPCS.find(n=>n.m===f1&&String(n.id||'').startsWith('leg'));
  const oldBack=WARP[`${f1},7,12`];
  const doorKeys=Object.keys(WARP).filter(k=>WARP[k][0]===f1&&!/^L\d/.test(k.split(',')[0]));
  if(!g0||!oldBack||!doorKeys.length)continue;
  const id=+String(g0.id).slice(3),e=ENEMIES[id],type=e.t||'普';
  const rand=mkRng(i*131+17),deco=decoOf(type);

  /* ---------- 1F ---------- */
  const w=19+2*(i%3),h1=13+2*(i%2);
  const a=carve(w,h1,rand);
  const s1=[1,h1-2];
  const d1=bfs(a,s1[0],s1[1]);
  let up=null,best=-1;
  for(const [k,d] of d1){const [x,y]=k.split(',').map(Number);
   if((x!==s1[0]||y!==s1[1])&&openNb(a,x,y)===1&&d>best){best=d;up=[x,y]}}
  /* 上樓梯所在的死路，它唯一的鄰格就是從 2F 下來時的落點 */
  const upIn=NB.map(([p,q])=>[up[0]+p,up[1]+q]).find(([x,y])=>a[y][x]==='.');

  /* ---------- 2F：下方迷宮 + 上方守護者房間 ---------- */
  const hm=11+2*(i%3),oy=4,H2=hm+4;
  const m=carve(w,hm,rand);
  const b=Array.from({length:H2},()=>Array(w).fill('#'));
  for(let y=0;y<hm;y++)for(let x=0;x<w;x++)b[y+oy][x]=m[y][x];
  const s2=[1,hm+2];                     // 2F 出生點（地圖座標）
  const d2=bfs(b,s2[0],s2[1]);
  let cx=1,bd=-1;
  for(let x=1;x<=w-2;x+=2){const d=d2.get(x+','+(oy+1));if(d!==undefined&&d>bd){bd=d;cx=x}}
  const x0=Math.max(1,Math.min(w-6,cx-2));
  for(let y=1;y<=3;y++)for(let x=x0;x<=x0+4;x++)b[y][x]='.';
  b[oy][cx]='.';                         // 房間入口
  const boss=[cx,1],exit=[(cx-x0>=x0+4-cx)?x0:x0+4,1];

  /* 主題裝飾：只放在一般地板上，不蓋住特殊格 */
  const keep=new Set([s1.join(),up.join(),upIn.join(),s2.join(),boss.join(),exit.join(),[cx,2].join(),[cx,3].join()]);
  const sprinkle=(g,seed)=>{for(let y=1;y<g.length-1;y++)for(let x=1;x<g[0].length-1;x++)
   if(g[y][x]==='.'&&!keep.has(x+','+y)&&((x*7+y*11+seed)%19===0))g[y][x]=deco};
  sprinkle(a,i);sprinkle(b,i+5);

  /* 門 / 樓梯（用 D 格，顯示成門）*/
  a[h1-1][1]='D';                        // 1F 出口（回到外面）
  a[up[1]][up[0]]='D';                   // 1F → 2F
  b[H2-1][1]='D';                        // 2F → 1F

  MAPS[f1]=rowsOf(a);MAPS[f2]=rowsOf(b);
  PAL[f2]=PAL[f1]=(PAL[f1]||PAL[f2]||PAL.town).slice();

  /* 傳送點：先清掉舊的，再依新地圖重建 */
  delete WARP[`${f1},7,12`];
  doorKeys.forEach(k=>{WARP[k]=[f1,s1[0],s1[1]]});
  WARP[`${f1},1,${h1-1}`]=oldBack.slice();
  WARP[`${f1},${up[0]},${up[1]}`]=[f2,s2[0],s2[1]];
  WARP[`${f2},1,${H2-1}`]=[f1,upIn[0],upIn[1]];

  /* 守護者搬到 2F 房間最深處 */
  g0.m=f2;g0.x=boss[0];g0.y=boss[1];
  g0.fn=async()=>{
   S.mode='event';
   await say(`${e.n}靜靜地注視著你……`);await say(`${e.n}發出震天的怒吼！`);
   const n0=party.length+pcBox.length;
   const won=await battle(0,0,id);
   const done=won||FL['leg'+id]||(party.length+pcBox.length)>n0;
   if(!done){S.mode='map';return}
   FL['lair'+i]=1;if(!isLegend(id))FL['leg'+id]=1;
   openExit(i);
   S.mode='event';
   await say(`${e.n}被擊敗了！房間角落出現了一道出口光門。`);
   S.prompt='要離開巢穴嗎？';
   const c=await choose(['離開巢穴','留在這裡'],1,'right',true);
   if(c===0){
    const t=LAIR[i].back;surf=false;
    setMap(t[0]);Pl.x=t[1];Pl.y=t[2];Pl.dir='down';Pl.mv=false;Pl.prog=0;
   }
   S.mode='map';
  };
  LAIR[i]={f1,f2,back:oldBack.slice(),exit,boss,id};
 }

 function openExit(i){
  const L=LAIR[i];if(!L)return;
  const r=MAPS[L.f2][L.exit[1]];
  if(r[L.exit[0]]!=='D')MAPS[L.f2][L.exit[1]]=r.slice(0,L.exit[0])+'D'+r.slice(L.exit[0]+1);
  WARP[`${L.f2},${L.exit[0]},${L.exit[1]}`]=L.back.slice();
 }
 /* 讀檔或再次進入 2F 時，已擊敗過守護者就保留出口 */
  /* 樓梯與出口門上加上小字：上／下／出 */
 window.__LAIR=LAIR;
})();

/* ===== 小遊戲專用遊戲畫面（取代原本只有對話框的小遊戲） ===== */
let MG=null;
const MG_DEF={
 snake:{name:'貪食蛇',goal:'吃到 8 顆星果',how:['方向鍵控制前進方向','撞牆或咬到自己就失敗']},
 catch:{name:'接球躲落石',goal:'接住 12 顆水果',how:['左右鍵移動籃子','落石砸中 3 次就失敗']},
 jump:{name:'彈跳跑酷',goal:'越過 10 個障礙',how:['A 或 ▲ 跳過障礙','撞到 3 次就失敗']},
 memory:{name:'記憶翻牌',goal:'配對 8 組圖案',how:['方向鍵移動，A 翻牌','最多翻 24 次']},
 stones:{name:'雙石推推樂',goal:'兩顆石頭推到目標格',how:['方向鍵移動並推石頭','X 重新開始']}
};
const MG_ICONS=[
 ['.#.#.#.','#######','#######','.#####.','..###..','...#...','.......'],
 ['...#...','...#...','#######','.#####.','..###..','.##.##.','.#...#.'],
 ['..####.','.###...','###....','###....','###....','.###...','..####.'],
 ['...#...','.#.#.#.','..###..','###.###','..###..','.#.#.#.','...#...'],
 ['...#...','...#...','..###..','.#####.','.#####.','.#####.','..###..'],
 ['..#.#..','.#####.','#.###.#','.#####.','..#.#..','...#...','...#...'],
 ['...##..','..##...','.###...','..####.','...##..','..##...','.#.....'],
 ['...#...','..###..','.#####.','#######','.#####.','..###..','...#...']
];
const HEART5=['.#.#.','#####','#####','.###.','..#..'];
const mgBits=(rows,x,y,c,s=1)=>{rows.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='#')R(x+i*s,y+j*s,s,s,c)})};
const mgHearts=(n,max,x,y)=>{for(let i=0;i<max;i++)mgBits(HEART5,x+i*7,y,i<n?2:1)};
const mgC=(s,y,c,z)=>{ctx.font=z+'px '+FONT;const w=ctx.measureText(s).width;T(s,Math.round((160-w)/2),y,c,z)};
const mgHead=(l,r)=>{R(0,0,160,17,2);R(0,17,160,1,3);T(l,6,4,0,9);if(r){ctx.font='9px '+FONT;const w=ctx.measureText(r).width;T(r,154-w,4,0,9)}};
const mgFood=s=>{let f;do{f=[rnd(0,17),rnd(0,13)]}while(s.some(p=>p[0]===f[0]&&p[1]===f[1]));return f};
function mgInit(k,o){
 if(k==='snake'){const m={s:[[9,7],[8,7],[7,7]],dir:[1,0],q:null,eaten:0,acc:0,step:.17};m.food=mgFood(m.s);return m}
 if(k==='catch')return{bx:80,items:[],spawn:.5,score:0,lives:3,time:0,flash:0};
 if(k==='jump')return{py:0,vy:0,obs:[],spawn:.9,passed:0,lives:3,speed:78,dist:0,inv:0,time:0};
 if(k==='memory'){const deck=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];for(let z=15;z>0;z--){const j=Math.floor(Math.random()*(z+1));[deck[z],deck[j]]=[deck[j],deck[z]]}return{deck,fl:[],done:new Set(),c:0,lock:0,tries:24,pairs:0}}
 if(k==='stones')return{init:o.stones.map(a=>[...a]),rk:o.stones.map(a=>[...a]),goals:o.goals,p:[0,0],moves:0};
}
function miniPlay(kind,opt){return new Promise(res=>{MG={k:kind,st:'intro',res,t:0,last:0,cd:0,won:false,msg:'',tOver:0,...mgInit(kind,opt)};S.mode='mini'})}
function mgEnd(won,msg){if(!MG||MG.st==='over')return;MG.st='over';MG.won=won;MG.msg=msg;MG.tOver=0;MU.sfx(won?'win':'miss')}
function mgFinish(){const m=MG;MG=null;S.mode='event';m.res(m.won)}
const MG_UPD={
 snake(dt){const m=MG;m.acc+=dt;while(m.acc>=m.step&&m.st==='play'){m.acc-=m.step;
  if(m.q&&!(m.q[0]===-m.dir[0]&&m.q[1]===-m.dir[1]))m.dir=m.q;m.q=null;
  const h=[m.s[0][0]+m.dir[0],m.s[0][1]+m.dir[1]],eat=h[0]===m.food[0]&&h[1]===m.food[1],body=eat?m.s:m.s.slice(0,-1);
  if(h[0]<0||h[0]>17||h[1]<0||h[1]>13||body.some(p=>p[0]===h[0]&&p[1]===h[1])){mgEnd(false,'撞到了！');return}
  m.s.unshift(h);
  if(eat){m.eaten++;MU.sfx('catch');if(m.eaten>=8){mgEnd(true,'吃得飽飽的！');return}m.food=mgFood(m.s);m.step=Math.max(.095,.17-m.eaten*.009)}else m.s.pop()}},
 catch(dt){const m=MG;m.time+=dt;m.flash=Math.max(0,m.flash-dt);
  m.bx=Math.max(14,Math.min(146,m.bx+((held.right?1:0)-(held.left?1:0))*92*dt));
  m.spawn-=dt;if(m.spawn<=0){m.spawn=Math.max(.42,.82-m.time*.008);m.items.push({x:rnd(10,150),y:20,t:Math.random()<.68?0:1})}
  const sp=46+Math.min(50,m.time*1.6);
  for(const it of m.items){it.y+=sp*dt;
   if(it.y>=112&&it.y<=126&&Math.abs(it.x-m.bx)<=12){it.dead=1;
    if(it.t===0){m.score++;MU.sfx('catch');if(m.score>=12){mgEnd(true,'接得好棒！');return}}
    else{m.lives--;m.flash=.6;MU.sfx('hurt');if(m.lives<=0){mgEnd(false,'被落石砸暈了！');return}}}}
  m.items=m.items.filter(it=>!it.dead&&it.y<142)},
 jump(dt){const m=MG;m.time+=dt;m.inv=Math.max(0,m.inv-dt);m.speed=Math.min(125,78+m.time*1.6);m.dist+=m.speed*dt;
  if(m.py>0||m.vy>0){m.vy-=520*dt;m.py+=m.vy*dt;if(m.py<=0){m.py=0;m.vy=0}}
  m.spawn-=dt;if(m.spawn<=0){const o=pick([{w:8,h:12},{w:12,h:9},{w:6,h:18}]);m.obs.push({x:168,w:o.w,h:o.h,ok:0,hit:0});m.spawn=1.05+Math.random()*.75}
  for(const o of m.obs){o.x-=m.speed*dt;
   if(!o.hit&&m.inv<=0&&o.x<34&&o.x+o.w>22&&m.py<o.h-1){o.hit=1;m.lives--;m.inv=1.1;MU.sfx('hurt');if(m.lives<=0){mgEnd(false,'撞到障礙了！');return}}
   if(!o.ok&&o.x+o.w<22){o.ok=1;if(!o.hit){m.passed++;MU.sfx('move');if(m.passed>=10){mgEnd(true,'輕鬆跳過所有障礙！');return}}}}
  m.obs=m.obs.filter(o=>o.x>-20)},
 memory(dt){const m=MG;if(m.lock>0){m.lock-=dt;if(m.lock<=0){const[a,b]=m.fl;
   if(m.deck[a]===m.deck[b]){m.done.add(a);m.done.add(b);m.pairs++;MU.sfx('catch')}else MU.sfx('miss');
   m.fl=[];m.tries--;
   if(m.pairs>=8){mgEnd(true,'全部配對成功！');return}
   if(m.tries<=0)mgEnd(false,'翻牌次數用完了')}}},
 stones(){}
};
const MG_PRESS={
 snake(k){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[k];if(d)MG.q=d},
 catch(){},
 jump(k){const m=MG;if((k==='a'||k==='up')&&m.py===0&&m.vy===0){m.vy=195;m.py=.01;MU.sfx('move')}},
 memory(k){const m=MG;
  if(k==='left'&&m.c%4>0)m.c--;if(k==='right'&&m.c%4<3)m.c++;if(k==='up'&&m.c>3)m.c-=4;if(k==='down'&&m.c<12)m.c+=4;
  if(k==='a'&&m.lock<=0&&!m.done.has(m.c)&&!m.fl.includes(m.c)){m.fl.push(m.c);MU.sfx('move');if(m.fl.length===2)m.lock=.7}},
 stones(k){const m=MG;
  if(k==='x'){m.rk=m.init.map(a=>[...a]);m.p=[0,0];m.moves=0;return}
  const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[k];if(!d)return;
  const nx=m.p[0]+d[0],ny=m.p[1]+d[1];if(nx<0||nx>4||ny<0||ny>4)return;
  const si=m.rk.findIndex(s=>s[0]===nx&&s[1]===ny);
  if(si>=0){const tx=nx+d[0],ty=ny+d[1];if(tx<0||tx>4||ty<0||ty>4||m.rk.some(s=>s[0]===tx&&s[1]===ty))return;m.rk[si]=[tx,ty]}
  m.p=[nx,ny];m.moves++;MU.sfx('move');
  if(m.rk.every(s=>m.goals.some(g=>g[0]===s[0]&&g[1]===s[1])))mgEnd(true,'兩顆石頭就位！')}
};
const mgPig=(x,y,c1,c2)=>{ell(x,y,7,6,3);ell(x,y,6,5,c1);R(x-6,y-8,3,3,3);R(x+3,y-8,3,3,3);R(x-5,y-7,1,1,c2);R(x+4,y-7,1,1,c2);R(x-3,y-2,1,2,3);R(x+2,y-2,1,2,3);ell(x,y+2,2,1,c2)};
const MG_DRAW={
 snake(){const m=MG;mgHead('貪食蛇',`星果 ${m.eaten}/8`);const ox=8,oy=22;R(ox-2,oy-2,148,116,3);
  for(let y=0;y<14;y++)for(let x=0;x<18;x++)R(ox+x*8,oy+y*8,8,8,(x+y)&1?0:1);
  const fx=ox+m.food[0]*8,fy=oy+m.food[1]*8;ell(fx+4,fy+5,3,3,2);R(fx+4,fy+1,1,2,3);R(fx+5,fy+1,2,1,3);
  for(let i=m.s.length-1;i>=0;i--){const x=ox+m.s[i][0]*8,y=oy+m.s[i][1]*8;
   if(i){R(x+1,y+1,6,6,2);R(x+2,y+2,2,2,1)}
   else{R(x,y,8,8,3);const d=m.dir,e=d[0]>0?[[5,2],[5,5]]:d[0]<0?[[2,2],[2,5]]:d[1]<0?[[2,2],[5,2]]:[[2,5],[5,5]];e.forEach(([a,b])=>R(x+a,y+b,1,1,0));R(x+(d[0]>0?7:d[0]<0?0:3),y+(d[1]>0?7:d[1]<0?0:3),1,1,1)}}},
 catch(){const m=MG;mgHead('接球躲落石',`${m.score}/12`);R(0,18,160,110,0);ell(30,44,12,4,1);ell(112,60,14,4,1);ell(76,36,9,3,1);R(0,128,160,16,1);R(0,128,160,1,3);
  mgHearts(m.lives,3,6,21);
  for(const it of m.items){const x=Math.round(it.x),y=Math.round(it.y);
   if(it.t===0){ell(x,y,3,3,2);R(x,y-5,1,2,3);R(x+1,y-5,2,1,3)}else{ell(x,y,4,3,3);R(x-2,y-2,2,1,1)}}
  if(!(m.flash>0&&(Math.floor(m.time*14)&1))){const bx=Math.round(m.bx);mgPig(bx,113,1,2)}
  const bx=Math.round(m.bx);R(bx-11,119,22,2,3);R(bx-10,121,20,6,2);R(bx-9,127,18,1,3)},
 jump(){const m=MG;mgHead('彈跳跑酷',`越過 ${m.passed}/10`);R(0,18,160,94,0);
  const hx=-((m.dist*.3)%58);for(let i=0;i<4;i++)ell(Math.round(hx+i*58+20),112,26,12,1);
  const cx=-((m.dist*.1)%100);for(let i=0;i<3;i++)ell(Math.round(cx+i*100+40),38,10,4,1);
  R(0,112,160,32,1);R(0,112,160,2,3);const x1=-(m.dist%24);for(let i=0;i<8;i++){R(Math.round(x1+i*24),122,10,1,2);R(Math.round(x1+i*24+12),132,8,1,2)}
  mgHearts(m.lives,3,6,21);
  for(const o of m.obs){const x=Math.round(o.x),b=112;
   if(o.h===12){R(x,b-o.h,2,o.h,3);R(x+o.w-2,b-o.h,2,o.h,3);R(x,b-o.h+3,o.w,2,3);R(x,b-5,o.w,2,3)}
   else if(o.h===9)ell(x+6,b-4,6,4,3),R(x+3,b-8,3,1,1);
   else{R(x,b-o.h,o.w,o.h,3);R(x-1,b-o.h,o.w+2,3,2)}}
  if(!(m.inv>0&&(Math.floor(m.time*14)&1))){const py=Math.round(m.py),y=112-py;
   ell(28,y-6,8,6,3);ell(28,y-6,7,5,1);ell(35,y-9,5,4,3);ell(35,y-9,4,3,1);R(33,y-14,3,3,3);R(38,y-8,2,2,2);R(36,y-10,1,1,3);R(19,y-8,2,2,3);
   if(py>0){R(24,y-1,2,2,3);R(31,y-1,2,2,3)}else{const f=Math.floor(m.time*10)&1;R(f?23:25,y-1,2,2,3);R(f?32:30,y-1,2,2,3)}}},
 memory(){const m=MG;mgHead('記憶翻牌',`${m.pairs}/8 組　剩 ${m.tries} 次`);R(0,18,160,126,0);
  for(let i=0;i<16;i++){const x=11+(i%4)*35,y=22+Math.floor(i/4)*29,face=m.done.has(i)||m.fl.includes(i),cur=i===m.c;
   R(x,y,32,26,3);
   if(face){R(x+1,y+1,30,24,m.done.has(i)?1:0);mgBits(MG_ICONS[m.deck[i]],x+9,y+6,3,2)}
   else{R(x+1,y+1,30,24,cur?1:2);ell(x+16,y+13,6,5,cur?2:1);R(x+13,y+12,1,2,3);R(x+18,y+12,1,2,3)}
   if(cur){const c=(Math.floor(m.t*4)&1)?2:3;R(x-1,y-1,34,1,c);R(x-1,y+26,34,1,c);R(x-1,y-1,1,28,c);R(x+32,y-1,1,28,c)}}},
 stones(){const m=MG;mgHead('雙石推推樂',`步數 ${m.moves}`);R(0,18,160,126,0);const ox=35,oy=24;R(ox-2,oy-2,94,94,3);
  for(let y=0;y<5;y++)for(let x=0;x<5;x++)R(ox+x*18,oy+y*18,18,18,(x+y)&1?0:1);
  m.goals.forEach(g=>{const cx=ox+g[0]*18+9,cy=oy+g[1]*18+9;ell(cx,cy,6,6,2);ell(cx,cy,4,4,0);ell(cx,cy,2,2,2)});
  m.rk.forEach(s=>{const cx=ox+s[0]*18+9,cy=oy+s[1]*18+9,on=m.goals.some(g=>g[0]===s[0]&&g[1]===s[1]);ell(cx,cy,7,6,3);ell(cx-1,cy-1,5,4,on?1:2);R(cx-3,cy-3,2,1,0)});
  const px=ox+m.p[0]*18+9,py=oy+m.p[1]*18+9;mgPig(px,py+1,1,2);
  T('X 重來　B 離開',44,120,2,8)}
};
function miniUpdate(){
 const now=performance.now(),dt=Math.min(.05,(now-(MG.last||now))/1000);MG.last=now;MG.t+=dt;
 if(MG.st==='over'){MG.tOver+=dt;return}
 if(MG.st!=='play')return;
 if(MG.cd>0){MG.cd-=dt;return}
 MG_UPD[MG.k](dt);
}
function miniDraw(){
 const m=MG;if(!m)return;const def=MG_DEF[m.k];
 if(m.st==='intro'){
  R(0,0,160,144,0);box(4,4,152,136);
  mgC('小遊戲挑戰',12,1,8);mgC(def.name,24,3,14);
  mgC('目標：'+def.goal,50,2,9);
  def.how.forEach((s,i)=>mgC(s,70+i*13,3,8));
  for(let i=0;i<3;i++)mgBits(MG_ICONS[1],38+i*34,100,i===1?2:1,2);
  if(Math.floor(m.t*2.5)&1)mgC('A 開始　B 放棄',121,2,8);
 }else{
  MG_DRAW[m.k]();
  if(m.st==='play'&&m.cd>0){box(40,56,80,28);mgC('準備！',63,2,13)}
  if(m.st==='over'){box(22,48,116,50);mgC(m.won?'挑戰成功！':'挑戰失敗',55,2,13);mgC(m.msg,75,3,8);if(Math.floor(m.t*2.5)&1)mgC('A：離開',85,2,8)}
 }
 if(m.t<.5){const p=m.t/.5;for(let i=0;i<9;i++){const w=Math.max(0,Math.min(160,(1-p)*230-i*12));R(i%2?160-w:0,i*16,w,16,3)}}
}
function miniPress(k){const m=MG;if(!m)return;
 if(m.st==='intro'){if(k==='a'){m.st='play';m.cd=.9;MU.sfx('move')}else if(k==='b'){m.won=false;mgFinish()}return}
 if(m.st==='play'){if(k==='b'){mgEnd(false,'放棄了挑戰');return}if(m.cd>0)return;MG_PRESS[m.k](k);return}
 if(m.st==='over'&&k==='a'&&m.tOver>.4)mgFinish();
}
rockPuzzle=async function(key){
 const q=ROCK_PUZZLES[key];if(!q||FL['rock:'+key])return;
 S.mode='event';
 const kinds=['snake','catch','jump','memory'],kind=kinds[Math.floor(Math.random()*kinds.length)];
 await say(`機關隨機抽中了「${MG_DEF[kind].name}」！準備開始挑戰。`);
 const won=await miniPlay(kind);
 if(won){FL['rock:'+key]=1;q.reward();await say('挑戰成功！機關解除並獲得專屬獎勵！')}
 else await say('這次沒有完成挑戰，可以再次進入嘗試。');
 S.mode='map';
};
multiPuzzle=async function(key){
 const q=MULTI_PUZZLES[key];if(!q||FL['multi:'+key])return;
 S.mode='event';
 await say(`${q.title}：把兩顆石頭推進發光的目標格！`);
 const won=await miniPlay('stones',{stones:q.stones,goals:q.goals});
 if(won){FL['multi:'+key]=1;q.reward();await say('兩顆石頭同時嵌入目標格，複合機關完成！')}
 else await say('機關暫時沒有反應，可以再次嘗試。');
 S.mode='map';
};


/* ===== 任務頁面優化：選取＋解說＋提示／可交付顯示 ===== */
(function questUI(){
 const G='#2e9e48',MN=m=>(window.MAP_NAMES&&MAP_NAMES[m])||m;
 const spot=(m,x,y,what)=>`前往「${MN(m)}」，走到座標(${x},${y})的特殊格子上${what?'，找到'+what:''}。（座標從地圖左上角 0,0 算起）`;
 const QINFO={
  patrol:{how:'從豬豬鎮往外走到藍濱水族城（進城就算到訪），再於野外打贏 1 場戰鬥，然後回來交任務。',reward:'18 點經驗值'},
  bottle:{how:()=>spot('sea',6,8,'漂流瓶'),reward:'全隊最大體力 +3'},
  rare:{how:'「月光靈」是稀有怪物，要多在各地野外探索遇敵。遇到後先把牠打到低血量，再用飼料捕獲並登錄圖鑑。',reward:'全隊體力全滿'},
  legend:{how:()=>spot('volc',6,8,'熔岩裂隙'),reward:'唯一的傳說必捕飼料'},
  dream:{how:'捕獲不同種類的怪物，讓圖鑑登錄達 10 隻，再回來交任務並解開 9 顆星星謎題（A 切換周圍、B 重新洗牌）。',reward:'夢幻兔豬皇加入隊伍'},
  eforest:{how:()=>spot('forest',3,9,'月光蘑菇'),reward:'150 枚金幣'},
  eroute:{how:()=>spot('route',17,10,'珍珠貝殼'),reward:'150 枚金幣'},
  eschool:{how:()=>spot('school',16,10,'星星獎章'),reward:'150 枚金幣'},
  ea2:{how:()=>spot('a2',16,10,'發光花苞'),reward:'150 枚金幣'},
  ea3:{how:()=>spot('a3',16,10,'備用電池'),reward:'150 枚金幣'},
  ea4:{how:()=>spot('a4',16,10,'火種寶石'),reward:'150 枚金幣'},
  ea5:{how:()=>spot('a5',16,10,'彩虹礦石'),reward:'150 枚金幣'},
  ea6:{how:()=>spot('a6',16,10,'冰藍圍巾'),reward:'150 枚金幣'},
  mine:{how:()=>spot('mine',8,3,'古老銘牌'),reward:'220 枚金幣'},
  volcIn:{how:()=>spot('volcIn',12,5,'火山心焰'),reward:'300 枚金幣'},
  iceCave:{how:()=>spot('iceCave',12,5,'冰窟月輪'),reward:'260 枚金幣'},
  lab:{how:()=>spot('lab',12,5,'研究所主機'),reward:'320 枚金幣'},
  ruins:{how:()=>spot('ruins',12,5,'古代星盤'),reward:'380 枚金幣'},
  dreamSpace:{how:()=>spot('dreamSpace',12,5,'夢境核心'),reward:'420 枚金幣'},
  undersea:{how:()=>spot('undersea',12,5,'海底古鐘'),reward:'460 枚金幣'},
  forestDeep:{how:()=>'前往「'+MN('forestGrove')+'」擊敗森林秘境古王，再回來交任務。',reward:'440 枚金幣'}
 };
 const qState=id=>{const st=FL['q:'+id],q=QUESTS[id];if(st==='done')return'done';if(st==='active'){let ok=false;try{ok=!!(q&&q.done())}catch(e){}return ok?'ready':'active'}return'new'};
 const LAB={done:['已完成',2],active:['進行中',3],ready:['可交付',G],new:['未接取',2]};
 const wrap=(s,w,z)=>{ctx.font=z+'px '+FONT;const o=[];let c='';for(const ch of String(s)){if(ctx.measureText(c+ch).width>w){o.push(c);c=ch}else c+=ch}if(c)o.push(c);return o};
 const ids=()=>Object.keys(QUESTS);
 const npcOf=id=>NPCS.find(n=>n.q===id);
 const prevQuestView=questView;
 questView=function(){S.qi=0;S.qDetail=false;return prevQuestView()};
 const prevDraw=drawView;
 drawView=function(){
  if(S.vk!=='quest'){prevDraw();return}
  const L=ids(),n=L.length;S.qi=Math.min(S.qi||0,n-1);
  R(0,0,160,144,0);box(2,2,156,140);
  if(S.qDetail){
   const id=L[S.qi],q=QUESTS[id],info=QINFO[id]||{},st=qState(id),lb=LAB[st];
   T(q.title,9,7,3,9);
   if(st==='ready')TC(lb[0],118,8,lb[1],8);else T(lb[0],118,8,lb[1],8);
   let y=21;const line=(s,col)=>{for(const ln of wrap(s,142,7)){if(col)TC(ln,9,y,col,7);else T(ln,9,y,3,7);y+=9}y+=2};
   const nb=npcOf(id);
   line(`【任務人】${nb?MN(nb.m)+'（'+nb.x+','+nb.y+'）':'公告板'}`);
   let goal='';try{goal=st==='done'?'已經完成，謝謝你的幫忙！':q.progress().replace(/^進度：/,'')}catch(e){}
   line(`【目標】${goal}`);
   if(st!=='done'){let h=info.how;try{if(typeof h==='function')h=h()}catch(e){h=''}line(`【怎麼做】${h||q.offer||'依任務人的說明完成。'}`)}
   line(`【獎勵】${info.reward||'？'}`);
   if(st==='ready')line('條件已達成！回去找任務人交任務吧。',G);
   else if(st==='new')line('先去找任務人接取任務。');
   T('←→切換任務　A／B返回',9,133,2,7);
   return}
  const per=5,page=Math.floor(S.qi/per),start=page*per;
  T('支線任務',9,7,2,11);T(`${page+1}/${Math.ceil(n/per)}`,130,8,2,8);
  for(let j=0;j<per&&start+j<n;j++){
   const idx=start+j,id=L[idx],q=QUESTS[id],st=qState(id),lb=LAB[st],y=24+j*17;
   if(idx===S.qi)R(6,y-2,148,15,1);
   T((idx===S.qi?'▶ ':'　')+q.title,9,y,st==='done'?2:3,8);
   if(st==='ready')TC(lb[0],112,y+1,lb[1],7);else T(lb[0],112,y+1,lb[1],7);
  }
  const nr=L.filter(id=>qState(id)==='ready').length;
  if(nr)TC(`有 ${nr} 項任務可以交付！`,9,114,G,8);else T('在城鎮公告板接取任務',9,114,2,8);
  T('↑↓選擇　A解說　←→換頁　B關閉',9,133,2,7);
 };
})();



/* Arrival hooks registered by map-specific features. */
addArriveBefore(async ctx=>{
 const pre={m:ctx.map,x:ctx.x,y:ctx.y,bx:ctx.x-D[Pl.dir][0],by:ctx.y-D[Pl.dir][1]};
 ctx.pre=pre;ctx.oldMap=cur;
 if(S.mode==='map'&&!specialEntryPending){
  const target=WARP[`${cur},${Pl.x},${Pl.y}`];
  if(target&&isSpecial(target[0])&&!isSpecial(cur)){
   S.mode='event';
   await say(`前方是特殊地形「${(typeof NAMES!=='undefined'&&NAMES[target[0]])||target[0]}」，裡面可能有稀有怪物。是否進入？（進入後按 B 可直接回到外面）`);
   S.prompt='是否進入？';
   const answer=await choose(['進入','暫不進入'],1,'right',true);
   if(answer!==0){placeBesideDoor(pre.x,pre.y,pre.bx,pre.by);S.mode='map';return false}
   specialReturn={m:pre.m,dx:pre.x,dy:pre.y,bx:pre.bx,by:pre.by};specialEntryPending=true;FL['entered:'+target[0]]=1;S.mode='map';
  }
 }
 specialEntryPending=false;return true;
});
addArriveAfter(async ctx=>{
 if(cur!==ctx.oldMap){if(!isSpecial(cur))specialReturn=null;else if(!isSpecial(ctx.oldMap)&&!specialReturn)specialReturn={m:ctx.oldMap,dx:ctx.x,dy:ctx.y,bx:ctx.x-D[Pl.dir][0],by:ctx.y-D[Pl.dir][1]}}
 if((ctx.map==='maze'||ctx.map==='maze2')&&cur===ctx.map&&ctx.tile==='.'&&S.mode==='map'&&BAG.repel<=0&&Math.random()<.07)await battle(0,false);
});

/* Unified render/input dispatchers.  These are the only public tile(),
   drawMap(), and press() implementations in the file. */
function tile(c,x,y,sx,sy){
 if(cur==='schoolInterior'&&c==='q'){R(sx,sy,16,16,3);R(sx+1,sy+1,14,8,2);R(sx+3,sy+3,10,1,0);T('星學堂',sx+3,sy+4,0,7);return}
 if(cur==='schoolInterior'&&c==='p'){R(sx,sy,16,16,1);R(sx+2,sy+2,12,7,3);R(sx+3,sy+3,10,5,2);return}
 if(cur==='schoolInterior'&&c==='k'){R(sx,sy,16,16,1);R(sx+2,sy+3,12,8,3);R(sx+3,sy+4,10,6,2);R(sx+6,sy+11,4,3,3);return}
 const lair=/^L\d+(F2)?$/.test(cur),warp=WARP[`${cur},${x},${y}`];
 if(lair&&c==='#'){R(sx,sy,16,16,3);R(sx+1,sy+1,14,6,2);R(sx+1,sy+9,6,6,2);R(sx+9,sy+9,6,6,2);return}
 if(lair&&['~','^','*','+','o'].includes(c)){R(sx,sy,16,16,1);if(c==='~'){R(sx+2,sy+4,7,2,2);R(sx+7,sy+10,7,2,2)}else if(c==='^'){R(sx+2,sy+10,12,4,3);R(sx+5,sy+5,3,6,2);R(sx+10,sy+3,3,8,3)}else if(c==='*')T('✦',sx+4,sy+2,3,10);else if(c==='+'){R(sx+7,sy+3,2,10,3);R(sx+3,sy+7,10,2,3)}else{ell(sx+8,sy+8,5,5,3);ell(sx+8,sy+8,2,2,0)}return}
 if(c==='D'){R(sx,sy,16,16,0);R(sx+1,sy+2,14,14,3);R(sx+2,sy+3,12,13,2);R(sx+4,sy+5,8,11,3);R(sx+5,sy+6,6,10,0);R(sx+6,sy+7,4,3,1);if(warp&&/^L\d+$/.test(warp[0])){R(sx+7,sy+3,2,1,0);R(sx+6,sy+4,4,1,0)}if(lair&&warp){if(!/^L\d/.test(warp[0])){R(sx+7,sy+9,2,2,3);R(sx+7,sy+7,2,1,3);R(sx+7,sy+12,2,1,3);R(sx+5,sy+9,1,2,3);R(sx+10,sy+9,1,2,3)}else if(/F2$/.test(warp[0])){R(sx+7,sy+7,2,1,3);R(sx+6,sy+8,4,1,3);R(sx+5,sy+9,6,1,3);R(sx+7,sy+10,2,4,3)}else{R(sx+7,sy+7,2,4,3);R(sx+5,sy+11,6,1,3);R(sx+6,sy+12,4,1,3);R(sx+7,sy+13,2,1,3)}}return}
 if(c==='E'){R(sx,sy,16,16,0);R(sx+2,sy+2,12,12,3);R(sx+3,sy+3,10,10,1);R(sx+7,sy+4,2,8,3);R(sx+4,sy+7,8,2,3);R(sx+7,sy+7,2,2,0);return}
 if(c==='T'){R(sx,sy,16,16,3);R(sx+1,sy+1,14,14,2);R(sx+2,sy+2,12,5,3);R(sx+3,sy+3,10,3,2);R(sx+6,sy+8,4,7,3);return}
 if(c==='C'||c==='h'){R(sx,sy,16,16,1);R(sx+2,sy+2,12,12,0);R(sx+7,sy+3,2,10,3);R(sx+3,sy+7,10,2,3);return}
 if(c==='G'){const gym=GYMS.find(g=>g.m===cur),label=gym?ENEMIES[gym.s]?.t:(lair?'出':'門');R(sx,sy,16,16,3);R(sx+1,sy+1,14,14,1);T(label,sx+3,sy+2,3,10);return}
 drawBaseTile(c,x,y,sx,sy);
 if(warp&&(c==='.'||c==='g'||c==='f')){R(sx,sy,16,16,1);if(x===0)for(let i=0;i<6;i++)R(sx+3+i,sy+8-i,1,1+2*i,3);else if(x===MW-1)for(let i=0;i<6;i++)R(sx+12-i,sy+8-i,1,1+2*i,3);else if(y===0)for(let i=0;i<6;i++)R(sx+8-i,sy+3+i,1+2*i,1,3);else if(y===MH-1)for(let i=0;i<6;i++)R(sx+8-i,sy+12-i,1+2*i,1,3);else{R(sx+3,sy+3,10,12,3);R(sx+4,sy+4,8,11,0);R(sx+10,sy+9,2,2,3)}}
}
function drawMap(){
 drawBaseMap();
 if(cur==='schoolInterior'){R(39,17,82,13,3);R(42,19,76,8,0);T('星學堂｜屬性課程',48,20,2,7);R(72,48,16,10,3);R(74,49,12,7,2);[[48,83],[96,83]].forEach(([x,y])=>{R(x,y,18,10,3);R(x+2,y+2,14,6,2);R(x+3,y+10,3,5,3);R(x+12,y+10,3,5,3)})}
 const pr=Math.round(Pl.prog),px=Pl.x*16+(Pl.mv?D[Pl.dir][0]*pr:0),py=Pl.y*16+(Pl.mv?D[Pl.dir][1]*pr:0),cx=Math.max(0,Math.min(MW*16-160,px-72)),cy=Math.max(0,Math.min(MH*16-132,py-58));
 const badge=n=>{if(n.shop||String(n.id||'').startsWith('shop_')||n.id==='shop'||n.id==='merchant'||String(n.id||'').startsWith('merchant_'))return'$';if(String(n.id||'').startsWith('nurse_'))return'+';if(String(n.id||'').startsWith('boss'))return FL[n.id]?'':'王';if(n.t&&!FL[n.id])return'戰';if(n.q){const st=FL['q:'+n.q],qq=QUESTS[n.q];return st==='done'?'':(st==='active'&&qq&&qq.done()?'!G':'!')}if(String(n.id||'').startsWith('leg')&&!FL[n.id])return'★';if(n.fn&&n.id==='teacher')return'師';return''};
 for(const n of NPCS){if(n.m!==cur||(n.hide&&FL[n.id]))continue;const b=badge(n);if(!b)continue;const bx=n.x*16-cx+3,by=n.y*16-cy+5;if(by<13||bx<0||bx>150)continue;if(b==='!G'){ctx.fillStyle='#2e9e48';ctx.fillRect(bx,by,10,9);R(bx+1,by+1,8,7,0);TC('!',bx+1,by,'#2e9e48',8);continue}R(bx,by,10,9,3);R(bx+1,by+1,8,7,0);T(b,bx+1,by,3,8)}
}
function press(k){
 if(S.mode==='mini'){miniPress(k);return}
 if(S.mode==='view'&&S.vk==='dex'){const total=ENEMIES.length,per=8;if(S.dexDetail){if(k==='a'){S.dexDetail=false;return}if(k==='b'){S.dexDetail=false;S.mode='event';S.vr();return}if(k==='left')S.vi=(S.vi+total-1)%total;if(k==='right')S.vi=(S.vi+1)%total;return}if(k==='up')S.vi=(S.vi+total-1)%total;if(k==='down')S.vi=(S.vi+1)%total;if(k==='a'){S.dexDetail=true;return}if(k==='b'){S.mode='event';S.vr();return}if(k==='left')S.vi=Math.max(0,S.vi-per);if(k==='right')S.vi=Math.min(total-1,S.vi+per);return}
 if(S.mode==='view'&&S.vk==='quest'){const n=Object.keys(QUESTS).length,per=5,pages=Math.ceil(n/per);S.qi=S.qi||0;if(S.qDetail){if(k==='a'||k==='b')S.qDetail=false;else if(k==='left'||k==='up')S.qi=(S.qi+n-1)%n;else if(k==='right'||k==='down')S.qi=(S.qi+1)%n}else{if(k==='up')S.qi=(S.qi+n-1)%n;else if(k==='down')S.qi=(S.qi+1)%n;else if(k==='left')S.qi=((Math.floor(S.qi/per)+pages-1)%pages)*per;else if(k==='right')S.qi=((Math.floor(S.qi/per)+1)%pages)*per;else if(k==='a')S.qDetail=true;else if(k==='b'){S.qDetail=false;S.mode='event';S.vr()}}S.vi=Math.floor(S.qi/per);return}
 if(k==='b'&&S.mode==='map'&&!S.msg&&!S.menu&&isSpecial(cur)){const back=specialReturn||findSpecialDoor(cur);if(!back){say('找不到入口記錄，請走向地圖上的出口離開。');return}specialReturn=null;surf=false;bExitHint=true;setMap(back.m);placeBesideDoor(back.dx,back.dy,back.bx,back.by);say('已離開特殊地形，回到外面了。');return}
 if(k==='y'&&S.mode==='map'&&!S.msg&&!S.menu){S.mode='worldmap';return}if(k==='y'&&S.mode==='worldmap'){S.mode='map';return}if(k==='x'&&S.mode==='map'&&!S.msg&&!S.menu){field();return}if(k==='b'&&S.mode==='map'&&!S.msg&&!S.menu){if(bExitHint){bExitHint=false;say('你已經在外面了。B 只用來離開特殊地形；X 開選單，Y 看地圖。')}return}if(S.mode==='worldmap'){if(k==='b'||k==='x'||k==='a'){S.mode='map';return}if(['left','right','up','down'].includes(k))return}
 pressCore(k);
}


/* Unified render/UI/world hooks. */
function say(t){
 const text=String(t).replace(/「([A-Za-z][A-Za-z0-9_]*)」/g,(m,id)=>MAPS[id]?`「${mapName(id)}」`:m);
 return sayBase(text);
}
function setMap(n){
 setMapBase(n);
 const m=/^L(\d+)F2$/.exec(n);
 if(m&&window.__openLairExit)window.__openLairExit(+m[1]);
}
function center(h){
 if(h){S.mode='event';say('請從醫院的入口進入，與護理師互動即可恢復體力。').then(()=>{S.mode='map'});return}
 return centerBase(h);
}
function talk(N){
 if(N.shop&&!cur.startsWith('shop_')){S.mode='event';say('商店位於獨立建築內，請先進入商店再購買商品。').then(()=>{S.mode='map'});return}
 return talkBase(N);
}
function drawUI(){
 if(S.mode==='battle'&&S.menu&&B&&B.moveMenu){const m=S.menu;box(2,96,156,46);T('選擇招式',8,99,2,8);m.o.forEach((o,i)=>{const col=i%2,row=Math.floor(i/2),x=8+col*76,y=112+row*14,label=String(o).replace(/\s*PP\s*/,'　PP');T(fitText((m.i===i?'▶':'')+label,72,7),x,y,3,7)});return}
 drawUIBase();
}
function draw(){
 if(S.mode==='worldmap'){
  ctx.setTransform(3,0,0,3,0,0);R(0,0,160,144,0);box(2,2,156,140);T('世界地圖',10,8,2,12);
  [['豬豬鎮','town'],['月影森林','forest'],['藍濱水族城','route'],['星學堂','school'],['花語城','a2'],['雷鳴城','a3'],['烈焰城','a4'],['礦石城','a5'],['冰晶城','a6']].forEach((r,i)=>{const x=10+(i%2)*75,y=28+Math.floor(i/2)*19;T((cur===r[1]?'▶ ':'　')+r[0],x,y,cur===r[1]?1:3,8)});T('Y／B／X／A：返回遊戲',10,128,2,8);return;
 }
 if(S.mode==='mini'&&MG){ctx.setTransform(3,0,0,3,0,0);miniUpdate();miniDraw();return}
 drawBase();
}

MU.bind(document.getElementById('mu'));
tick();
