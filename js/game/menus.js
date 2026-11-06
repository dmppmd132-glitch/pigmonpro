/* PigmonPro module: Menus, dialogue, save/load, inventory, evolution, shop, and quests. Loaded in order by index.html. */
async function centerBase(h){
 S.mode='event';await say(h?'豬媳媳：歡迎回家！':'豬豬中心：歡迎光臨！');healAll();await say('已經幫你的隊伍全部回復了體力與 PP！');
 for(;;){S.prompt='還需要\n什麼服務？';const c=await choose(['電腦','存檔','離開'],1,'right');if(c===0)await pc();else if(c===1)await say(save()?'冒險已經記錄下來了！':'無法存檔……');else break}
 S.mode='map';
}
async function pc(){
 let pg=0;
 for(;;){S.prompt=`電腦盒子\n（${pcBox.length}隻）`;const c=await choose(['存入','取出','離開'],1,'right');
  if(c===0){if(party.length<2){await say('隊伍至少要留一隻！');continue}
   const i=await choose(party.map(m=>`${m.n}Lv${m.lv}`),2,'full',true);if(i<0)continue;
   if(party[i]===pig){await say('出戰中的不能存入！');continue}
   pcBox.push(party.splice(i,1)[0]);await say('已經存入電腦。')}
  else if(c===1){if(!pcBox.length){await say('電腦裡是空的。');continue}if(party.length>5){await say('隊伍已滿！');continue}
   for(;;){if(pg*4>=pcBox.length)pg=0;const L=pcBox.slice(pg*4,pg*4+4),i=await choose([...L.map(m=>`${m.n}Lv${m.lv}`),'下一頁','返回'],2,'full',true);
   if(i<0||i===L.length+1)break;if(i===L.length){pg++;continue}party.push(pcBox.splice(pg*4+i,1)[0]);await say('已經加入隊伍。');break}}
  else return}
}
async function questView(){return openView('quest')}
async function field(){
 S.mode='event';S.prompt='要做什麼？';const c=await choose(['圖鑑','隊伍','任務','背包','飛行','取消'],2,'full',true);
 if(c===0)await dexView();else if(c===1)await teamView();else if(c===2)await questView();else if(c===3)await bagMenu();else if(c===4){if(!FL.fly)await say('還沒學會飛行。打贏第三道館就能學會！');
  else if(cur[0]==='g'||cur==='maze')await say('這裡不能飛行。');
  else{const l=FLY.filter(f=>FL['v'+f[0]]);let pg=0,done=false;while(!done){const max=Math.ceil(l.length/4),part=l.slice(pg*4,pg*4+4),opts=part.map(f=>f[1]);if(max>1&&pg>0)opts.push('上一頁');if(max>1&&pg<max-1)opts.push('下一頁');opts.push('取消');const i=await choose(opts,2,'full',true);if(i<0||i===opts.length-1)break;const prev=max>1&&pg>0,next=max>1&&pg<max-1;if(prev&&i===part.length){pg--;continue}if(next&&i===part.length+(prev?1:0)){pg++;continue}const dest=part[i];if(dest){surf=false;setMap(dest[0]);Pl.x=dest[2];Pl.y=dest[3];await say('小豬展翼高飛，轉眼就到了'+dest[1]+'！')}done=true}}}
 S.mode='map';
}
async function surfTry(){const d=D[Pl.dir],x=Pl.x+d[0],y=Pl.y+d[1];if(FL.surf&&!surf&&MAP[y]&&MAP[y][x]==='w'){S.mode='event';await say('小豬跳上浪板，開始衝浪！');surf=true;S.mode='map'}}
async function legend2(){S.mode='event';if(FL.leg62){S.mode='map';return}const q=ENEMIES[62];await say(`迷宮深處，${q.n}靜靜沉睡著……`);await say(`${q.n}睜開雙眼，發出震天的怒吼！`);battle(0,0,62)}
const openView=k=>new Promise(r=>{S.mode='view';S.vk=k;S.vi=0;S.sw=null;S.vr=r}),dexView=()=>openView('dex'),teamView=()=>openView('team');
function drawView(){
 R(0,0,160,144,0);box(2,2,156,140);const i=S.vi;
 if(S.vk==='quest'){
  T('支線任務',9,8,2,11);T(`${i+1}/${Math.ceil(Object.keys(QUESTS).length/5)}`,130,8,2,8);let y=28;Object.entries(QUESTS).slice(i*5,i*5+5).forEach(([id,q])=>{const st=FL['q:'+id];T((st==='done'?'✓ ':st==='active'?'▶ ':'○ ')+q.title,9,y,st==='done'?1:3,8);T(st==='done'?'已完成':st==='active'?'進行中':'未接取',105,y,2,7);y+=18});T('在城鎮公告板接取任務',9,118,2,8);
 }else if(S.vk==='dex'){
  const p=ENEMIES[i],c=dex.has(p.n),s=c||FL['s'+i];
  T(`圖鑑 ${i+1}/${ENEMIES.length}`,9,7,2,9);T(`已捕抓 ${ENEMIES.filter(q=>dex.has(q.n)).length}`,100,7,2,9);
  ell(80,88,30,5,1);if(s)p.d(80,62);else T('？',72,48,2,28);
  T(s?`${p.n}　[${p.t}]`:'？？？',9,96);T(c?'已捕抓':s?'已發現（還沒捕抓）':'尚未發現',9,107,2,9);
  if(s)mvL('成長招式：',movesFor(i,20),118);
 }else{
  const L=[...party,...pcBox],m=statInit(L[i]);
  T(`${i<party.length?'隊伍':'電腦盒子'} ${i+1}/${L.length}`+(S.sw===i?' ★已選取':''),9,7,2,9);
  ell(80,74,30,5,1);monSprite(m,80,48);
  T(fitText(`${m.n}${m.shiny?' ✦':''}　Lv${m.lv}　[${m.t}]`,142,8),9,81,3,8);T(`HP ${m.hp}/${m.max}　經驗 ${m.exp}/${m.lv*10}`,9,91,2,9);T(`攻${m.atk} 防${m.def} 特攻${m.spa} 特防${m.spd} 速${m.speed} 親密${m.love||0}`,9,101,2,7);
  mvL('招式：',m.mv,111);
 }
 T(S.vk==='team'?(([...party,...pcBox][i]?.evoPending)?'◀▶切換　A進化　B關閉':'◀▶切換　A調順序　B關閉'):'◀ ▶ 切換　B 關閉',9,135,2,7);
}
async function swap(forced){
 const c=await choose(party.map(m=>`${m.n}${m.hp>0?'':'×'}Lv${m.lv}`),2,'full',!forced);
 if(c<0)return 0;const m=party[c];
 if(m===pig){await say('已經在場上了！');return 0}
 if(m.hp<=0){await say('它已經沒力了！');return 0}
 pig=m;pig.dh=pig.hp;await say(`上吧，${pig.n}！`);return 1;
}
const npcAt=(x,y)=>NPCS.find(n=>n.m===cur&&n.x===x&&n.y===y&&!(n.hide&&FL[n.id]));
function npcSprite(x,y,c){R(x+4,y+8,8,7,3);R(x+5,y+9,6,5,c);ell(x+8,y+5,4,4,3);ell(x+8,y+5,3,3,0);R(x+6,y+4,1,1,3);R(x+9,y+4,1,1,3);R(x+4,y+1,8,2,3)}
const SK='pigmon1';
const has=()=>{try{return !!localStorage.getItem(SK)}catch(e){return false}};
function save(){try{localStorage.setItem(SK,JSON.stringify({party,box:pcBox,act:party.indexOf(pig),dex:[...dex],m:cur,x:Pl.x,y:Pl.y,FL,bag:BAG,world:WORLD}));return 1}catch(e){return 0}}
function load(){try{const d=JSON.parse(localStorage.getItem(SK));if(!d)return 0;party.length=0;(d.party||[Object.assign({n:'小豬',t:'普'},d.pig)]).forEach(m=>party.push(m));pig=party[d.act]||party[0];pcBox.length=0;(d.box||[]).forEach(m=>pcBox.push(m));(d.dex||[]).forEach(n=>dex.add(n));Object.assign(FL,d.FL||{});setupRandomHiddenRoads();if(FL.leg&&!FL.leg7)FL.leg7=1;Object.assign(BAG,d.bag||{});Object.assign(WORLD,d.world||{});party.forEach(m=>yuFix(statInit(m)));pcBox.forEach(m=>yuFix(statInit(m)));setMap(d.m);Pl.x=d.x;Pl.y=d.y;return 1}catch(e){return 0}}
async function bagMenu(){S.mode='event';for(;;){const rareCount=Object.values(BAG.rareDrops||{}).reduce((a,b)=>a+b,0);S.prompt=`背包　金幣 ${BAG.coins}\n避怪${BAG.repel}步　稀有素材${rareCount}　飼料∞`;const o=[],act=[];
 if(BAG.repel<=0)[100,200,400].forEach(v=>{if(BAG['rep'+v]){o.push(`避怪藥水${v}（${BAG['rep'+v]}）`);act.push(()=>{BAG['rep'+v]--;BAG.repel=v;return `使用了避怪藥水，接下來 ${v} 步不會遇到怪物！`})}});else{o.push('目前正在避怪');act.push(null)}
 if(BAG.heal){o.push(`補血藥（${BAG.heal}）`);act.push(async()=>{S.prompt='要幫誰補血？';const i=await choose(party.map(m=>`${m.n} ${m.hp}/${m.max}`),2,'full',true);if(i<0)return'';const m=party[i];if(m.hp<=0)return`${m.n}已經沒力了！`;if(m.hp>=m.max)return'體力已經是滿的了！';const h=Math.min(40,m.max-m.hp);m.hp+=h;BAG.heal--;if(m===pig)pig.dh=pig.hp;return`${m.n}恢復了${h}點體力！`})}
 if(BAG.rope){o.push(`脫逃繩（${BAG.rope}）`);act.push(()=>{if(cur!=='maze')return'脫逃繩只能在迷宮裡使用！';const w=WARP[Object.keys(WARP).find(k=>k.startsWith('maze,'))];BAG.rope--;surf=false;setMap(w[0]);Pl.x=w[1];Pl.y=w[2];Pl.mv=false;return'抓緊脫逃繩，一眨眼就回到迷宮外面了！'})}
 o.push('關閉');const c=await choose(o,1,'right',true);if(c<0||c===o.length-1)break;const f=act[c];if(f){const r=await f();if(r)await say(r)}}S.mode='map'}

BAG.drops={};
const EVO_THEMES={
 普:[['迅影','疾風領主'],['鋼甲','鐵壁戰神']],草:[['藤鎧','古木守護者'],['花冠','萬花仙子']],水:[['潮汐','深海龍王'],['霧浪','幻潮君主']],
 火:[['焰鬃','烈日炎皇'],['火冠','熾焰神獸']],電:[['雷角','雷霆霸主'],['電翼','天閃鳳皇']],土:[['岩鎧','山嶽巨靈'],['晶核','大地核心']],
 冰:[['霜冠','極光冰皇'],['雪羽','永凍月神']],毒:[['毒棘','幽瘴魔王'],['菌傘','萬毒妖后']],光:[['星冠','聖輝天使'],['月紋','星河守望者']],暗:[['影牙','夜魘君王'],['暮翼','暗夜幻皇']]
};
const EVO_ALT={普:'光',草:'光',水:'冰',火:'普',電:'光',土:'草',冰:'光',毒:'暗',光:'水',暗:'毒'};
const EVO_COLORS={
 普:['#e9f8ff','#78bfe0','#286b91','#fff0a8'],草:['#eaffd6','#83cc62','#39743d','#fff3a8'],水:['#d8faff','#5fc9df','#267caa','#fff8d6'],火:['#ffe6cf','#ff9855','#b8432b','#fff09a'],
 電:['#fff9c9','#f2d94e','#7a5c25','#fffde1'],土:['#f1dfc4','#b88a54','#68472c','#fff0b5'],冰:['#e4f8ff','#8bdcf0','#397eaa','#ffffff'],毒:['#f3e3ff','#b779ce','#65417d','#f8d6ff'],
 光:['#fff7dc','#f4cf67','#99702c','#ffffff'],暗:['#e5defb','#8776bf','#3d315f','#e7dcff']
};
const EVO_MOTIFS=['羽翼','尖角','葉冠','晶甲','星環','長尾','雙鰭','花瓣'];
const EVO_NAME_STYLES=[
 ['曦','曜冠','晨星'],['霧','潮痕','深瀾'],['棘','森印','古芽'],['焰','日輪','赤耀'],['霜','月棱','極光'],['雷','鳴紋','天閃'],['岩','晶脈','山鎧'],['影','暮痕','夜皇'],['花','星瓣','萬華'],['羽','雲徽','天穹'],['砂','琥珀','大地'],['墨','幽紋','冥界']
];
const EVO_NAME_ENDINGS=[['','靈獸'],['','領主'],['','守護者'],['','王'],['','神使'],['','皇'],['','君'],['','天尊']];
const EVO_CACHE=new Map();
function evolutionProfile(m){
 const id=m.s===undefined?'starter':m.s;if(EVO_CACHE.has(id))return EVO_CACHE.get(id);
 const base=id==='starter'?{n:'小豬',t:'普',d:pigBig}:ENEMIES[id];if(!base)return null;
 if(id!=='starter'&&(isLegend(id)||id===ULT||(base.m||0)>=70)){EVO_CACHE.set(id,null);return null}
 const seed=String(id+':'+base.n).split('').reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,5381),themes=EVO_THEMES[base.t]||EVO_THEMES.普,ns=EVO_NAME_STYLES[(seed>>>3)%EVO_NAME_STYLES.length],end=EVO_NAME_ENDINGS[(seed>>>7)%EVO_NAME_ENDINGS.length];
 const identity=`${base.n}${ns[0]}`;
 const profile={id,base,seed,identity,branches:themes.map((x,i)=>({branch:i,type:i?EVO_ALT[base.t]||base.t:base.t,mid:`${identity}${x[0]}${end[0]}`,final:`${identity}${x[1]}`,motif:EVO_MOTIFS[(seed+i*3)%EVO_MOTIFS.length],style:(seed+i*5)%8,accent:(seed+i*11)%12,body:(seed+i*17)%10}))};
 EVO_CACHE.set(id,profile);return profile
}
function evoStageOf(m,profile){
 if(!profile)return 0;let stage=Number(m.evoStage);if(!Number.isInteger(stage)||stage<0||stage>2)stage=Number(m.evolved)||0;
 if(m.evolved===true&&stage===0)stage=1;if(String(m.n||'').endsWith('·完全體'))stage=2;
 if(String(m.n||'').endsWith('·進化')||['月影狼','彩虹史萊姆','炎焰小豬'].includes(m.n))stage=Math.max(stage,1);
 stage=Math.max(0,Math.min(2,stage));m.evoStage=stage;m.evolved=stage;
 if(stage){m.evoPath=Math.max(0,Math.min(1,Number(m.evoPath)||0));const f=profile.branches[m.evoPath];m.n=stage===1?f.mid:f.final;m.t=f.type}
 return stage
}
function evoPixel(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function evoPoly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill()}
function evoRing(x,y,r,color,width=2){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}
function evoBodyPattern(cx,cy,stage,form,seed){
 const c=EVO_COLORS[form.type]||EVO_COLORS.普,body=stage===2?c[2]:c[1],light=stage===2?c[3]:c[0],kind=form.body%10;
 if(kind===0){evoPoly([[cx-18,cy+1],[cx-10,cy-7],[cx-3,cy-2],[cx-8,cy+8]],body);evoPoly([[cx+18,cy+1],[cx+10,cy-7],[cx+3,cy-2],[cx+8,cy+8]],body)}
 else if(kind===1){for(let i=-1;i<=1;i++)evoPixel(cx+i*7,cy+5+Math.abs(i)*3,4,stage===2?8:5,body)}
 else if(kind===2){evoRing(cx,cy+2,stage===2?15:11,body,2);evoPixel(cx-2,cy+stage*2,4,4,light)}
 else if(kind===3){evoPoly([[cx-15,cy+8],[cx-7,cy-1],[cx,cy+8],[cx+7,cy-1],[cx+15,cy+8],[cx+8,cy+13],[cx,cy+8],[cx-8,cy+13]],body)}
 else if(kind===4){evoPixel(cx-14,cy-1,5,5,light);evoPixel(cx+9,cy-1,5,5,light);evoPixel(cx-7,cy+10,4,3,body);evoPixel(cx+4,cy+10,4,3,body)}
 else if(kind===5){for(let i=0;i<4;i++)evoPoly([[cx-14+i*9,cy+10],[cx-10+i*9,cy+2-(i%2)*4],[cx-6+i*9,cy+10]],i%2?body:light)}
 else if(kind===6){evoPixel(cx-18,cy+7,4,4,body);evoPixel(cx+14,cy+5,4,4,body);evoPoly([[cx,cy+14],[cx-6,cy+20],[cx,cy+18],[cx+6,cy+20]],body)}
 else if(kind===7){evoRing(cx,cy+4,stage===2?9:6,light,2);evoPixel(cx-1,cy+2,3,5,body)}
 else if(kind===8){evoPoly([[cx-13,cy+3],[cx-4,cy-4],[cx+4,cy+3],[cx+13,cy-4],[cx+10,cy+10],[cx,cy+5],[cx-10,cy+10]],body)}
 else{evoPixel(cx-11,cy+7,3,7,body);evoPixel(cx+8,cy+7,3,7,body);evoPixel(cx-2,cy-3,5,3,light)}
 if(stage===2){evoPixel(cx-24-(seed%3),cy+14,4,3,light);evoPixel(cx+20+(seed%3),cy+12,4,3,light)}
}
function evoAdornment(cx,cy,stage,form,seed){
 const c=EVO_COLORS[form.type]||EVO_COLORS.普,spread=16+(seed%5),lift=stage===2?5:0;
 if(form.style%8===0||form.style%8===6){evoPoly([[cx-spread,cy-5],[cx-spread-10,cy-16-lift],[cx-13,cy-11],[cx-7,cy-2]],c[1]);evoPoly([[cx+spread,cy-5],[cx+spread+10,cy-16-lift],[cx+13,cy-11],[cx+7,cy-2]],c[1]);evoPixel(cx-spread-7,cy-13,3,3,c[3]);evoPixel(cx+spread+4,cy-13,3,3,c[3])}
 else if(form.style%8===1||form.style%8===5){evoPoly([[cx-11,cy-17],[cx-9,cy-29-lift],[cx-3,cy-19],[cx-1,cy-14]],c[2]);evoPoly([[cx+11,cy-17],[cx+9,cy-29-lift],[cx+3,cy-19],[cx+1,cy-14]],c[2]);evoPixel(cx-9,cy-24-lift,3,3,c[3]);evoPixel(cx+6,cy-24-lift,3,3,c[3])}
 else if(form.style%8===2||form.style%8===7){for(let j=0;j<3;j++){const x=cx-12+j*12;evoPoly([[x,cy-17],[x-5,cy-28-lift],[x+2,cy-23-lift],[x+5,cy-15]],j===1?c[3]:c[1])}}
 else if(form.style%8===3){evoPoly([[cx-17,cy-1],[cx-27,cy-10],[cx-22,cy+4],[cx-14,cy+10]],c[2]);evoPoly([[cx+17,cy-1],[cx+27,cy-10],[cx+22,cy+4],[cx+14,cy+10]],c[2]);evoPixel(cx-22,cy-5,4,4,c[3]);evoPixel(cx+18,cy-5,4,4,c[3])}
 else{evoRing(cx,cy-8,15,c[3],2);evoPixel(cx-2,cy-27-lift,4,4,c[1]);evoPixel(cx+14,cy-9,3,3,c[3]);evoPixel(cx-17,cy-4,3,3,c[3])}
 const gemX=cx+((seed%7)-3),gemY=cy+3;evoPoly([[gemX,gemY-5],[gemX+4,gemY],[gemX,gemY+5],[gemX-4,gemY]],c[3]);evoPixel(gemX-1,gemY-2,2,3,c[0]);
 if(stage===2){evoRing(cx,cy-5,25,c[3],2);evoPoly([[cx,cy-34],[cx+4,cy-27],[cx+11,cy-26],[cx+5,cy-21],[cx+7,cy-14],[cx,cy-19],[cx-7,cy-14],[cx-5,cy-21],[cx-11,cy-26],[cx-4,cy-27]],c[3]);evoPixel(cx-22,cy+11,3,3,c[1]);evoPixel(cx+20,cy+8,3,3,c[3])}
 else{evoPixel(cx-19-(seed%4),cy+11,3,3,c[3]);evoPixel(cx+16+(seed%5),cy+6,2,2,c[1])}
}
function monSprite(m,cx,cy,stageOverride,branchOverride){
 const profile=evolutionProfile(m);if(!profile){if(m.s===undefined)pigBig(cx,cy);else ENEMIES[m.s]?.d(cx,cy);return}
 const stage=stageOverride===undefined?evoStageOf(m,profile):stageOverride;if(stage<=0){profile.base.d(cx,cy);return}
 const branch=branchOverride===undefined?(Number(m.evoPath)||0):branchOverride,form=profile.branches[branch]||profile.branches[0],scale=stage===1?1.06:1.14;
 ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.translate(-cx,-cy);profile.base.d(cx,cy);ctx.restore();evoBodyPattern(cx,cy,stage,form,profile.seed+branch*97);evoAdornment(cx,cy,stage,form,profile.seed+branch*97)
}
function evolutionChoice(m,stage){const profile=evolutionProfile(m),prior=S.mode;return new Promise(resolve=>{S.msg=null;S.menu=null;S.mode='evoChoice';S.evoChoice={m,stage,profile,prior,selected:0,resolve}})}
function finishEvolutionChoice(value){const q=S.evoChoice;if(!q)return;S.evoChoice=null;S.mode=q.prior;q.resolve(value)}
function drawEvoCard(x,selected,label,name,type,m,stage,branch){
 box(x,31,74,70);if(selected){R(x,31,74,2,3);R(x,99,74,2,3);R(x,31,2,70,3);R(x+72,31,2,70,3)}
 const cx=x+37;ctx.save();ctx.translate(cx,55);ctx.scale(.62,.62);ctx.translate(-cx,-55);monSprite(m,cx,55,stage,branch);ctx.restore();
 T(fitText(name,68,7),x+3,77,3,7);T(`屬性 ${type}`,x+4,87,2,7);T(fitText(label,68,7),x+3,94,selected?3:2,7)
}
function drawEvolutionChoice(){
 const q=S.evoChoice;if(!q)return;const m=q.m,p=q.profile;R(0,0,160,144,0);box(2,2,156,140);T(q.stage===1?'羈絆進化':'完全進化',9,7,2,10);T(fitText(`${m.n}的力量正在蛻變`,140,8),9,20,3,8);
 if(q.stage===1){const a=p.branches[0],b=p.branches[1];drawEvoCard(5,q.selected===0,'分支 A',a.mid,a.type,m,1,0);drawEvoCard(81,q.selected===1,'分支 B',b.mid,b.type,m,1,1);box(17,108,126,18);if(q.selected===2){R(17,108,126,2,3);R(17,124,126,2,3)}T('稍後再決定',52,113,q.selected===2?3:2,8);T('◀ ▶ 選分支　↓稍後　A確認　B稍後',8,132,2,7)}
 else{const path=Number(m.evoPath)||0,f=p.branches[path];drawEvoCard(5,q.selected===1,'保留現狀',f.mid,f.type,m,1,path);drawEvoCard(81,q.selected===0,'進化結果',f.final,f.type,m,2,path);T('◀ 保留　▶ 進化　A確認　B稍後',13,121,2,7);T('完全體會大幅提升能力',26,132,2,7)}
}
function drawEvolution(){
 const a=S.evoAnim;if(!a)return;const p=Math.min(1,(performance.now()-a.start)/a.duration),colors=EVO_COLORS[a.form.type]||EVO_COLORS.普;
 R(0,0,160,144,0);R(0,0,160,144,1);R(0,0,160,20,2);R(0,124,160,20,2);
 for(let j=0;j<4;j++){ctx.save();ctx.globalAlpha=Math.max(.08,.42-p*.28);evoRing(80,68,13+j*12+p*13,colors[(j+1)%4],j===0?2:1);ctx.restore()}
 for(let i=0;i<18;i++){const ang=i*Math.PI*2/18+p*4.5,rad=12+p*44+(i%3)*3,x=80+Math.cos(ang)*rad,y=68+Math.sin(ang)*rad*.72,size=i%3===0?3:2;evoPixel(x,y,size,size,colors[i%4])}
 const changed=p>.53,stage=changed?a.toStage:a.fromStage,branch=changed?a.path:a.fromPath,scale=changed?.68+Math.min(1,(p-.53)/.38)*.48+.06*Math.sin(p*40):1+.04*Math.sin(p*28);
 ctx.save();ctx.translate(80,68);ctx.scale(scale,scale);ctx.translate(-80,-68);if(p>.43&&p<.62){ctx.globalAlpha=.35+.55*Math.sin((p-.43)/.19*Math.PI)}monSprite(a.m,80,68,stage,branch);ctx.restore();
 if(p>.43&&p<.62){ctx.save();ctx.fillStyle=`rgba(255,255,255,${.18+.42*Math.sin((p-.43)/.19*Math.PI)})`;ctx.fillRect(0,0,160,144);ctx.restore()}
 T('進化之光正在匯聚……',30,7,3,9);T(fitText(a.oldName,140,8),10,108,3,8);T('▼',76,108,2,8);T(fitText(a.newName,140,8),10,117,3,8);R(14,132,132,5,3);R(15,133,130,3,0);R(15,133,Math.max(1,130*p),3,2)
}
async function runPendingEvolution(m){
 const profile=evolutionProfile(m);if(!profile){delete m.evoPending;return false}const stage=Number(m.evoPending);if(stage!==1&&stage!==2)return false;const prior=S.mode,choice=await evolutionChoice(m,stage);
 if(choice<0){m.evoDeferred=true;S.mode=prior;return false}
 const path=stage===1?choice:(Number(m.evoPath)||0),form=profile.branches[path]||profile.branches[0],oldName=m.n,fromStage=stage-1,fromPath=stage===1?0:(Number(m.evoPath)||0),duration=2400;
 S.evoAnim={m,oldName,newName:stage===1?form.mid:form.final,form,path,fromStage,fromPath,toStage:stage,start:performance.now(),duration};S.mode='evolution';MU.sfx('evolve');await sleep(duration);
 statInit(m);m.evoPath=path;m.evoStage=stage;m.evolved=stage;m.n=stage===1?form.mid:form.final;m.t=form.type;m.max+=stage===1?12:20;m.hp=m.max;m.dh=m.hp;m.atk+=stage===1?4:7;m.def+=stage===1?3:6;m.spa+=stage===1?4:7;m.spd+=stage===1?3:6;m.speed+=stage===1?2:4;delete m.evoPending;delete m.evoDeferred;
 S.evoAnim=null;S.mode=prior;await say(`${oldName}進化成了${m.n}！能力全面提升！`);return true
}
async function checkEvolution(m){
 const profile=evolutionProfile(m);if(!profile)return;const stage=evoStageOf(m,profile),bondReady=[0,3,4].includes(m.s)&&m.love>=50;
 if(stage===0&&((m.lv||1)>=25||bondReady)&&!m.evoPending)m.evoPending=1;
 if(stage===1&&(m.lv||1)>=45&&m.evoPending!==1&&!m.evoPending)m.evoPending=2;
 if(m.evoPending&&!m.evoDeferred)await runPendingEvolution(m)
}
const ENHANCE_RECIPES=ITEM_CATALOG.recipes;
async function craftMenu(){
 S.mode='event';
 for(;;){
	  const items=[...Object.entries(BAG.bossDrops||{}).map(x=>[x[0],x[1],'boss']),...Object.entries(BAG.rareDrops||{}).map(x=>[x[0],x[1],'rare'])].filter(x=>x[1]>0);
	  if(!items.length){await say('目前沒有可製作的首領或稀有素材。');break}
 	  S.prompt='素材製作與強化\n選擇素材';
	  const i=await choose([...items.map(x=>`${x[0]}${x[2]==='rare'?' ★':''} (剩${x[1]})`),'取消'],1,'right',true);
 	  if(i<0||i===items.length)break;
	  const name=items[i][0],kind=items[i][2],recipe=ENHANCE_RECIPES[name];
  if(!recipe){await say('該素材暫時無法直接強化。');continue}
  if(BAG.coins<recipe.cost){await say(`金幣不足！需要 ${recipe.cost} 枚。`);continue}
  const mi=await choose(party.map(m=>m.n),2,'full',true);
  if(mi<0)continue;
	  if(kind==='rare')BAG.rareDrops[name]--;else BAG.bossDrops[name]--;BAG.coins-=recipe.cost;
  const msg=recipe.effect(party[mi]);
  await say(`${party[mi].n}使用了${recipe.n}！\n${msg}`);
 }
 S.mode='map';
}
const SHOP_ACTIONS={craft:craftMenu,feed:()=>BAG.feed++,superFeed:()=>BAG.superFeed++,heal:()=>BAG.heal=(BAG.heal||0)+1,rope:()=>BAG.rope=(BAG.rope||0)+1,repel100:()=>BAG.rep100++,repel200:()=>BAG.rep200++,repel400:()=>BAG.rep400++};
async function shopTalk(){S.mode='event';const I=ITEM_CATALOG.shop.map(x=>[x.name,x.cost,SHOP_ACTIONS[x.action]]);
 for(;;){S.prompt=`雜貨店\n金幣：${BAG.coins}\n補血藥回40`;const c=await choose([...I.map(x=>x[1]===null?x[0]:`${x[0]}　${x[1]}`),'離開'],1,'right',true);if(c<0||c===I.length)break;const it=I[c];if(it[1]===null){await it[2]();S.mode='event';continue}if(BAG.coins<it[1]){await say('金幣不夠！');continue}BAG.coins-=it[1];it[2]();await say('購買成功！')}S.mode='map'}
async function questTalk(N){const q=QUESTS[N.q];S.mode='event';const key='q:'+N.q;if(!q){S.mode='map';return}if(!FL[key]){await say(q.offer);if(await choose(['接受任務','先等等'],1,'right')===0){FL[key]='active';await say('任務已加入！可以按 B 開啟任務查看進度。')}}else if(FL[key]==='active'){if(q.done()){FL[key]='done';await say(q.doneText);await q.give();await say('支線任務完成！')}else await say(q.progress())}else await say('這項任務已經完成了，謝謝你的幫忙！');S.mode='map'}
async function talkBase(N){
 S.mode='event';
 if(N.fn){await N.fn();S.mode='map';return}if(N.shop){await shopTalk();return}if(N.q){await questTalk(N);return}
 if(N.t&&!FL[N.id]){
  for(const s of N.d)await say(s);
  BATK=String(N.id).startsWith('boss')?'gym':'trainer';const w=await battle(N.t);BATK='';
  if(w){FL[N.id]=1;S.mode='event';for(const s of N.w)await say(s);
   if(N.id.startsWith('boss')){FL['b'+N.id.slice(4)]=1;party.forEach(m=>{m.max+=3;m.hp=m.max});await say('獲得了徽章！全隊最大體力提升了！');if(N.id==='boss1'){FL.surf=1;await say('獲得祕傳技能「衝浪」！面對水面按 A 就能出發！')}if(N.id==='boss2'){FL.fly=1;await say('獲得祕傳技能「飛行」！在地圖上按 B 開啟選單！')}if(nb()===7)await say('集滿七枚徽章！你就是豬豬小可愛冠軍！')}}
 }else for(const s of(N.t?[N.a]:N.d))await say(s);
 S.mode='map';
}
async function learn(m){
 if(pig.mv.includes(m))return;const n=MOVES[m].n;ensureBattleMon(pig);if(pig.mv.length<4){pig.mv.push(m);pig.pp.push(MOVES[m].pp||10);pig.maxpp.push(MOVES[m].pp||10);await say(`${pig.n}學會了${n}！`);return}await say(`${pig.n}想學會「${n}」！`);await say('要忘記哪一招？\n（按 B 就不學）');
 const c=await choose(pig.mv.map(i=>MOVES[i].n),2,'full',true);
 if(c<0){await say(`${pig.n}沒有學會${n}。`);return}
 const o=MOVES[pig.mv[c]].n;pig.mv[c]=m;pig.pp[c]=MOVES[m].pp||10;pig.maxpp[c]=MOVES[m].pp||10;await say(`忘記了${o}，學會了${n}！`);
}
/* ---------- dialog / menu ---------- */
function wrap(t){ctx.font='10px '+FONT;const L=[];for(const part of t.split('\n')){let l='';for(const ch of part){if(ctx.measureText(l+ch).width>142){L.push(l);l=ch}else l+=ch}L.push(l)}return L}
function sayBase(t){const f=SFXR.find(x=>x[0].test(t));f&&MU.sfx(f[1]);return new Promise(r=>{S.msg={t,l:wrap(t),n:t.replace(/\n/g,'').length,shown:0};waitA=r})}
function choose(o,c,boxType,cancel){return new Promise(r=>{S.menu={o,c,box:boxType,i:0,cancel,r}})}
function pressCore(k){
 if(S.mode==='evoChoice'){const q=S.evoChoice;if(!q)return;if(k==='left'||k==='right'){q.selected=q.stage===1?(q.selected===2?(k==='left'?0:1):1-q.selected):1-q.selected}if((k==='down'||k==='up')&&q.stage===1)q.selected=q.selected===2?0:2;if((k==='down'||k==='up')&&q.stage===2)q.selected=1-q.selected;if(k==='a')finishEvolutionChoice(q.stage===1?(q.selected===2?-1:q.selected):(q.selected===0?0:-1));if(k==='b')finishEvolutionChoice(-1);return}
 if(S.mode==='view'&&S.vk==='team'&&k==='a'){const m=[...party,...pcBox][S.vi];if(m?.evoPending){runPendingEvolution(m);return}}
 if(S.mode==='title'){if(k==='a')start();return}
 if(S.mode==='puzzle'){const p=PZ;if(k==='left'&&p.c%3)p.c--;if(k==='right'&&p.c%3<2)p.c++;if(k==='up'&&p.c>2)p.c-=3;if(k==='down'&&p.c<6)p.c+=3;if(k==='a'){pzTog(p.g,p.c);p.n++;if(p.g.every(v=>v)){S.mode='event';p.r()}}if(k==='b'){p.g=pzNew();p.n=0}return}
 if(S.mode==='view'){if(S.vk==='quest'){const np=Math.ceil(Object.keys(QUESTS).length/5);if(k==='right')S.vi=(S.vi+1)%np;if(k==='left')S.vi=(S.vi+np-1)%np;if(k==='b'){S.mode='event';S.vr()}return}const n=S.vk==='dex'?ENEMIES.length:party.length+pcBox.length;if(k==='left')S.vi=(S.vi+n-1)%n;if(k==='a'&&S.vk==='team'){const i=S.vi;if(i<party.length){if(S.sw==null)S.sw=i;else{const j=S.sw;S.sw=null;if(j!==i){[party[j],party[i]]=[party[i],party[j]];pig=party.find(m=>m.hp>0)||party[0]}}}}else if(k==='right'||k==='a')S.vi=(S.vi+1)%n;if(k==='b'){S.mode='event';S.vr()}return}
 if(S.msg){if(k==='a'||k==='b'){const m=S.msg;if(m.shown<m.n)m.shown=m.n;else{S.msg=null;const r=waitA;waitA=null;r&&r()}}return}
 const m=S.menu;if(!m){if(k==='a'&&S.mode==='map'&&!Pl.mv){const N=npcAt(Pl.x+D[Pl.dir][0],Pl.y+D[Pl.dir][1]);if(N)talk(N);else surfTry()}if(k==='b'&&S.mode==='map'&&!Pl.mv)field();return}const n=m.o.length,c=m.c;
 if(k==='up'&&m.i>=c)m.i-=c;if(k==='down'&&m.i+c<n)m.i+=c;
 if(k==='left'&&m.i%c>0)m.i--;if(k==='right'&&m.i%c<c-1&&m.i+1<n)m.i++;
 if(k==='a'){S.menu=null;m.r(m.i)}if(k==='b'&&m.cancel){S.menu=null;m.r(-1)}
}
/* ---------- game flow ---------- */
