/* PigmonPro module: Core canvas helpers, maps, state, sprites, creatures, and NPC data. Loaded in order by index.html. */
const MAP_LAYOUTS=window.PIGMON_MAP_LAYOUTS;
const P4=['#fff0f6','#ffb3cf','#d9588a','#5a1233'];
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const FONT="'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif";
const R=(x,y,w,h,c)=>{ctx.fillStyle=P4[c];ctx.fillRect(x,y,w,h)};
const ell=(cx,cy,rx,ry,c)=>{for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(1-dy*dy/(ry*ry+.01)));R(cx-w,cy+dy,2*w+1,1,c)}};
const T=(s,x,y,c=3,z=10)=>{ctx.font=z+'px '+FONT;ctx.textBaseline='top';ctx.fillStyle=P4[c];ctx.fillText(s,x,y)};
const TC=(s,x,y,col,z=8)=>{ctx.font=z+'px '+FONT;ctx.textBaseline='top';ctx.fillStyle=col;ctx.fillText(s,x,y)};
const fitText=(s,max,z=10)=>{ctx.font=z+'px '+FONT;let t=String(s);while(t.length&&ctx.measureText(t).width>max)t=t.slice(0,-1);return t.length<String(s).length&&t.length>1?t.slice(0,-1)+'…':t};
const box=(x,y,w,h)=>{R(x,y,w,h,3);R(x+1,y+1,w-2,h-2,2);R(x+2,y+2,w-4,h-4,0)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[rnd(0,a.length-1)];
const TOWN=MAP_LAYOUTS.town;
const D={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
TOWN[14]=TOWN[14].slice(0,19)+'.';
TOWN[12]=TOWN[12].slice(0,16)+'E'+TOWN[12].slice(17);
const ROUTE=MAP_LAYOUTS.route;
const GYM=MAP_LAYOUTS.gym;
const MAPS={town:TOWN,route:ROUTE,gym:GYM};
const WARP={'town,19,14':['route',1,6],'route,0,6':['town',18,14],'route,15,3':['gym',4,7],'gym,4,8':['route',15,4]};
let MAP=TOWN,MW=20,MH=16,cur='town';
function setMapBase(n){cur=n;FL['v'+n]=1;MAP=MAPS[n];MW=MAP[0].length;MH=MAP.length;P4.splice(0,4,...palOf(n))}
const gen=(n,xs,last)=>{const r=[];for(let y=0;y<12;y++){let s='';for(let x=0;x<20;x++){const b=xs.find(a=>x>=a&&x<a+3)||(x>=8&&x<11?8:0);s+=(y%11===0||x%19===0)&&!(y===6&&(x===0||(x===19&&!last)))?'#':y===2&&b?'H':y===3&&b?(x===b+1?(b===8?'C':'G'):'H'):y>6&&(x*3+y*5+n*7)%9<3?'g':'.'}r.push(s)}return r};
MAPS.a2=gen(2,[13]);MAPS.a3=gen(3,[13]);MAPS.a4=gen(4,[13]);MAPS.a5=gen(5,[13]);MAPS.a6=gen(6,[13]);MAPS.school=gen(7,[]).map(r=>r.replace(/g/g,'.'));
ROUTE[2]=ROUTE[2].slice(0,6)+'HHH'+ROUTE[2].slice(9);ROUTE[3]=ROUTE[3].slice(0,6)+'HCH'+ROUTE[3].slice(9);
const SEA=[],VOL=[];
for(let y=0;y<14;y++){let s='',v='';for(let x=0;x<20;x++){let c='w';
 if(y%13===0||x===19||(x===0&&y!==6))c='#';else if(x<4||(x>=12&&x<=17&&y>=2&&y<=6)||(x>=8&&x<=12&&y>=9&&y<=12))c='.';
 if(y===3&&x>=14&&x<=16)c='H';if(y===4&&x>=14&&x<=16)c=x===15?'G':'H';if(x===10&&y===10)c='V';s+=c;
 v+=(y%13===0||x%19===0)&&!(y===6&&(x===0||x===19))?'#':y!==6&&y!==5&&(x*5+y*3)%7<2?'L':y>7&&(x+y*2)%6<2?'g':'.'}SEA.push(s);VOL.push(v)}
function mz(w,h,sd){let s=sd;const r=()=>(s=(Math.imul(s,1103515245)+12345)&0x7fffffff)/0x80000000,g=[];for(let y=0;y<h;y++)g.push(Array(w).fill('#'));g[1][1]='.';const st=[[1,1]];
 while(st.length){const[x,y]=st[st.length-1],d=[[2,0],[-2,0],[0,2],[0,-2]].filter(([a,b])=>x+a>0&&x+a<w-1&&y+b>0&&y+b<h-1&&g[y+b][x+a]==='#');
  if(!d.length){st.pop();continue}const[a,b]=d[Math.floor(r()*d.length)];g[y+b/2][x+a/2]='.';g[y+b][x+a]='.';st.push([x+a,y+b])}
 g[1][0]='.';g[h-2][w-2]='X';return g.map(q=>q.join(''))}
MAPS.sea=SEA;MAPS.volc=VOL;MAPS.maze=mz(21,15,7);
MAPS.maze2=mz(23,17,19);MAPS.maze2[15]=MAPS.maze2[15].slice(0,21)+'X'+MAPS.maze2[15].slice(22);
MAPS.maze2[1]=MAPS.maze2[1].slice(0,1)+'D'+MAPS.maze2[1].slice(2);
WARP['maze,19,13']=['maze2',1,1];WARP['maze2,1,1']=['maze',18,13];
SEA[8]=SEA[8].slice(0,6)+'E'+SEA[8].slice(7);
VOL[8]=VOL[8].slice(0,6)+'E'+VOL[8].slice(7);
const SECRETS={'secret:town:16:12':{title:'星糖石板',lines:['石板忽然亮了起來，粉紅色的星光落在小豬身上！','小豬獲得隱藏祝福：最大體力提升 6 點！'],reward:'maxhp'},'secret:route:4:5':{title:'草叢郵筒',lines:['草叢裡藏著一個古老郵筒。','裡面有一封寫給勇者的信：前方的怪物會使用新招式！'],reward:'exp'},'secret:sea:6:8':{title:'漂流瓶',lines:['小豬撿到了一個漂流瓶。','瓶中藏著冰藍色的糖果，隊伍全員恢復體力！'],reward:'heal'},'secret:volc:6:8':{title:'熔岩裂隙',lines:['裂隙深處傳來低沉的咆哮……','小豬找到稀有怪物的氣息，接下來更容易遇到牠們！'],reward:'rare'}};
WARP['a6,19,6']=['sea',1,6];WARP['sea,0,6']=['a6',18,6];WARP['sea,10,10']=['volc',2,6];WARP['volc,0,6']=['sea',10,11];WARP['volc,19,6']=['maze',1,1];WARP['maze,0,1']=['volc',18,6];
const FLY=[['town','豬豬鎮',3,4],['forest','月影森林',2,6],['route','藍濱水族城',7,4],['school','星學堂',9,4],['a2','花語城',9,4],['a3','雷鳴城',9,4],['a4','烈焰城',9,4],['a5','礦石城',9,4],['a6','冰晶城',9,4]];
ROUTE[6]=ROUTE[6].slice(0,19)+'.';
ROUTE[5]=ROUTE[5].slice(0,4)+'E'+ROUTE[5].slice(5);
const AR=['route','school','a2','a3','a4','a5','a6'];
AR.forEach((a,i)=>{if(i)WARP[a+',0,6']=[AR[i-1],18,6];if(i<AR.length-1)WARP[a+',19,6']=[AR[i+1],1,6]});
const GYMS=[{m:'route',x:15,y:3,s:3,lv:6},{m:'a2',x:14,y:3,s:1,lv:9},{m:'a3',x:14,y:3,s:2,lv:12},{m:'a4',x:14,y:3,s:4,lv:15},{m:'a5',x:14,y:3,s:5,lv:18},{m:'a6',x:14,y:3,s:10,lv:22},{m:'sea',x:15,y:4,s:6,lv:26}];
GYMS.forEach((g,i)=>{MAPS['g'+i]=GYM;WARP[`${g.m},${g.x},${g.y}`]=['g'+i,4,7];WARP[`g${i},4,8`]=[g.m,g.x,g.y+1]});
const party=[{n:'小豬',t:'普',lv:5,max:30,hp:30,exp:0,dh:30,mv:[0,1,2,3]}];let pig=party[0];const dex=new Set(),FL={vtown:1,fly:1},pcBox=[];FLY.forEach(f=>{FL['v'+f[0]]=1});let surf=false;
const BAG={coins:500,feed:3,superFeed:0,legendFeed:0,rep100:0,rep200:0,rep400:0,repel:0,heal:0,rope:0};
	const WORLD={steps:0,time:8,weather:'晴朗',weatherSeed:0};const WEATHER=['晴朗','小雨','月夜','微雪','雷雨','濃霧','沙塵暴','花粉風','潮汐月夜','流星雨','熱浪'];const WEATHER_TYPE={晴朗:null,小雨:'水',月夜:'暗',微雪:'冰',雷雨:'電',濃霧:'暗',沙塵暴:'土',花粉風:'草',潮汐月夜:'水',流星雨:'光',熱浪:'火'};
const STATUS_NAMES={burn:'灼傷',poison:'中毒',paralyze:'麻痺',freeze:'冰凍',sleep:'睡眠'};
const statInit=m=>{m.iv=m.iv||{hp:rnd(0,5),atk:rnd(0,5),def:rnd(0,5),spa:rnd(0,5),spd:rnd(0,5),speed:rnd(0,5)};m.atk=m.atk??(m.lv*2+5+(m.iv.atk||0));m.love=m.love||0;m.status=m.status||'';m.pp=m.pp||m.mv.map(i=>MOVES[i]?.pp||10);m.maxpp=m.maxpp||m.pp.map((_,i)=>MOVES[m.mv[i]]?.pp||10);m.def=m.def??(8+(m.iv.def||0));m.spa=m.spa??(m.atk+2+(m.iv.spa||0));m.spd=m.spd??(m.atk+2+(m.iv.spd||0));m.speed=m.speed??(5+(m.iv.speed||0));return m};
const weatherLabel=()=>`時間${WORLD.time}:00 ${WORLD.weather}`;
	const weatherForMap=()=>{const blk=Math.floor(WORLD.steps/100),forest=['forest','forestDeep','forestGrove','forestCanopy','forestMoss'].includes(cur),sea=['sea','undersea','underseaDeep','trench','trenchEast','trenchWest'].includes(cur);if(forest&&blk%4===0)return'花粉風';if(sea&&blk%5===0)return'潮汐月夜';if((WORLD.time>=18||WORLD.time<6)&&blk%7===0)return'流星雨';if(cur==='volc'||cur==='volcIn')return blk%4===0?'熱浪':null;return null};
	const advanceWorld=()=>{WORLD.steps++;WORLD.time=6+(Math.floor(WORLD.steps/100)%16);WORLD.weather=weatherForMap()||WEATHER[(Math.floor(WORLD.steps/60)+(WORLD.weatherSeed||0))%WEATHER.length]};
const statusLabel=m=>m.status?`【${STATUS_NAMES[m.status]||m.status}】`:'';
const QUESTS={patrol:{title:'草原巡查',offer:'水族城附近最近出現了許多野生怪物，願意去巡查一次嗎？',progress:()=>`進度：前往藍濱水族城並完成 1 場戰鬥（目前 ${FL.wins||0}/1）。`,done:()=>!!FL.vroute&&(FL.wins||0)>=1,reward:'exp',give:async()=>{pig.exp+=18;await say('獲得 18 點經驗值！')},doneText:'太好了，草原路已經安全多了！'},bottle:{title:'漂流瓶的回信',offer:'港口城有人想找回漂流瓶中的回信，能幫忙嗎？',progress:()=>`進度：找到海域漂流瓶（${FL['secret:sea:6:8']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:sea:6:8'],reward:'maxhp',give:async()=>{party.forEach(m=>{m.max+=3;m.hp=m.max});await say('全隊最大體力提升 3 點！')},doneText:'這封回信終於送到了，謝謝你！'},rare:{title:'月光靈研究',offer:'研究員想確認月光靈是否真的存在，能帶回牠的圖鑑紀錄嗎？',progress:()=>`進度：捕獲月光靈（${dex.has('月光靈')?'已完成':'尚未完成'}）。`,done:()=>dex.has('月光靈'),reward:'heal',give:async()=>{party.forEach(m=>m.hp=m.max);await say('研究員替隊伍完全恢復了體力！')},doneText:'太棒了！月光靈的資料會成為重要研究成果！'},legend:{title:'傳說試煉',offer:'完成火山裂隙的探索，便能取得唯一的傳說捕獲飼料。要接受試煉嗎？',progress:()=>`進度：找到熔岩裂隙（${FL['secret:volc:6:8']?'已完成':'尚未完成'}）。`,done:()=>!!FL['secret:volc:6:8'],give:async()=>{BAG.legendFeed=1;await say('獲得唯一的「傳說必捕飼料」！每次遊戲只能取得 1 枚。')},doneText:'你通過了傳說試煉！'}};
const Pl={x:3,y:4,px:0,py:0,dir:'down',mv:false,prog:0,tx:0,ty:0};
const S={mode:'title',t:0,msg:null,menu:null,prompt:''};let B=null,waitA=null;let BATK='';
const held={};
/* ---------- sprites ---------- */
function pigMap(x,y,d,f){
 R(x+4,y+13+f,3,2,3);R(x+9,y+14-f,3,2,3);
 ell(x+8,y+9,6,5,3);ell(x+8,y+9,5,4,1);
 R(x+3,y+2,3,4,3);R(x+10,y+2,3,4,3);
 ell(x+8,y+6,5,4,3);ell(x+8,y+6,4,3,1);
 if(d==='down'){R(x+5,y+5,2,2,3);R(x+9,y+5,2,2,3);R(x+6,y+8,4,2,2);R(x+7,y+8,1,1,3);R(x+9,y+8,1,1,3)}
 if(d==='left'){R(x+4,y+5,2,2,3);R(x+2,y+7,3,3,2);R(x+3,y+8,1,1,3)}
 if(d==='right'){R(x+10,y+5,2,2,3);R(x+11,y+7,3,3,2);R(x+12,y+8,1,1,3)}
 if(d==='up'){R(x+7,y+10,2,2,3);R(x+8,y+11,1,1,1)}
}
function pigBig(cx,cy){
 ell(cx,cy+6,22,16,3);ell(cx,cy+6,21,15,1);
 R(cx-16,cy-26,9,9,3);R(cx-15,cy-25,7,7,2);R(cx+7,cy-26,9,9,3);R(cx+8,cy-25,7,7,2);
 ell(cx,cy-14,14,12,3);ell(cx,cy-14,13,11,1);
 ell(cx,cy+6,5,5,3);ell(cx,cy+6,3,3,0);ell(cx,cy+6,1,1,3);
 R(cx-14,cy+20,8,4,3);R(cx+6,cy+20,8,4,3);
}
const wolf=(cx,cy)=>{R(cx-17,cy-20,8,9,3);R(cx-15,cy-18,4,6,1);R(cx+9,cy-20,8,9,3);R(cx+11,cy-18,4,6,1);ell(cx,cy,18,14,3);ell(cx,cy,17,13,1);R(cx-10,cy-5,5,3,3);R(cx+5,cy-5,5,3,3);ell(cx,cy+7,8,6,0);R(cx-2,cy+3,4,3,3);R(cx-4,cy+10,8,1,3);R(cx-4,cy+11,2,2,0);R(cx+2,cy+11,2,2,0)};
const radish=(cx,cy)=>{R(cx-2,cy-27,4,12,2);R(cx-9,cy-23,4,10,2);R(cx+5,cy-23,4,10,2);ell(cx,cy+4,14,17,3);ell(cx,cy+4,13,16,0);R(cx-7,cy,3,4,3);R(cx+4,cy,3,4,3);R(cx-3,cy+9,6,2,3);R(cx-1,cy+21,3,5,3)};
const bee=(cx,cy)=>{ell(cx-4,cy-17,8,6,3);ell(cx-4,cy-17,7,5,0);ell(cx+8,cy-16,7,5,3);ell(cx+8,cy-16,6,4,0);ell(cx,cy,16,11,3);ell(cx,cy,15,10,1);R(cx-4,cy-9,4,18,3);R(cx+4,cy-9,4,18,3);R(cx-12,cy-4,4,4,3);R(cx+16,cy-1,6,3,3)};
const slime=(cx,cy)=>{ell(cx,cy+8,22,15,3);ell(cx,cy+8,21,14,1);R(cx-12,cy,6,3,0);R(cx-9,cy+7,4,6,3);R(cx+5,cy+7,4,6,3);R(cx-3,cy+16,6,2,3)};
const flame=(cx,cy)=>{ell(cx,cy+8,16,14,3);ell(cx,cy+8,15,13,1);R(cx-3,cy-14,6,10,3);R(cx-2,cy-12,4,8,2);R(cx-9,cy-8,4,6,3);R(cx+6,cy-8,4,6,3);R(cx-8,cy+4,4,4,3);R(cx+4,cy+4,4,4,3);R(cx-4,cy+14,8,2,3)};
const rock=(cx,cy)=>{ell(cx,cy+6,20,16,3);ell(cx,cy+6,19,15,2);R(cx-10,cy-2,6,3,1);R(cx+4,cy-2,6,3,1);R(cx-3,cy+10,6,2,1);R(cx-14,cy-8,5,4,1)};
const jelly=(cx,cy)=>{ell(cx,cy,18,13,3);ell(cx,cy,17,12,1);R(cx-8,cy-3,4,4,3);R(cx+4,cy-3,4,4,3);for(let i=-3;i<=3;i+=2)R(cx+i*4-1,cy+12,3,10,3)};
const legend=(cx,cy)=>{ell(cx,cy+6,22,16,3);ell(cx,cy+6,21,15,2);R(cx-14,cy-24,8,14,3);R(cx+6,cy-24,8,14,3);R(cx-4,cy-28,8,10,1);R(cx-10,cy,4,4,0);R(cx+6,cy,4,4,0);ell(cx,cy+12,7,4,0)};
const bunny=(cx,cy)=>{ell(cx,cy+8,17,13,3);ell(cx,cy+8,16,12,0);ell(cx-9,cy-14,5,14,3);ell(cx-9,cy-14,3,11,1);ell(cx+9,cy-14,5,14,3);ell(cx+9,cy-14,3,11,1);R(cx-7,cy+4,3,3,3);R(cx+4,cy+4,3,3,3);ell(cx,cy+10,4,3,2)};
const cutePig=(cx,cy)=>{ell(cx,cy+7,19,14,3);ell(cx,cy+7,18,13,0);R(cx-14,cy-12,8,7,3);R(cx+6,cy-12,8,7,3);ell(cx,cy-5,13,10,3);ell(cx,cy-5,12,9,0);ell(cx,cy+1,5,4,2);R(cx-7,cy-7,3,3,3);R(cx+4,cy-7,3,3,3)};
const CREATURE_DATA=window.PIGMON_CREATURE_DATA;
const MOVE_DATA=window.PIGMON_MOVE_DATA;
const CREATURE_SPRITES={wolf,radish,bee,slime,flame,rock,jelly,legend,bunny,cutePig};
const createEnemy=(record,customSprites={})=>{
 const {sprite,...data}=record;
 const draw=typeof sprite==='string'?(customSprites[sprite]||CREATURE_SPRITES[sprite]):sprite?.kind==='cuteSp'?cuteSp(...sprite.args):null;
 if(typeof draw!=='function')throw new Error('Unknown creature sprite: '+String(sprite));
 return {...data,d:draw};
};
const ENEMIES=CREATURE_DATA.enemies.base.map(createEnemy);
const EXTRA_NAMES=CREATURE_DATA.extraSpecies.names;
const EXTRA_TYPES=CREATURE_DATA.extraSpecies.types;
const EXTRA_SPRITES=CREATURE_DATA.extraSpecies.spriteKeys.map(k=>CREATURE_SPRITES[k]);
EXTRA_NAMES.forEach((n,i)=>ENEMIES.push({n,t:EXTRA_TYPES[i%EXTRA_TYPES.length],m:4+(i%12),hp:12+(i%7)*2,atk:3+(i%5),d:EXTRA_SPRITES[i%EXTRA_SPRITES.length]}));
const LEGENDS=CREATURE_DATA.enemies.legends.map(createEnemy);LEGENDS.forEach(x=>ENEMIES.push(x));
const LEGEND_IDS=CREATURE_DATA.legendIds.slice(),isLegend=s=>LEGEND_IDS.includes(s),legendTarget=()=>LEGEND_IDS.find(i=>!FL['leg'+i])||7,hasLegendLeft=()=>LEGEND_IDS.some(i=>!FL['leg'+i]);
const MOVES=MOVE_DATA.moves.base.map(m=>({...m}));
MOVES.forEach(m=>{if(!m.pp)m.pp=m.t==='h'?10:20});
const PIG_EXCLUSIVE_MOVE=MOVES.push(...MOVE_DATA.moves.pigExclusive.map(m=>({...m})))-1;
const PIG_ULTIMATE_MOVE=MOVES.push(...MOVE_DATA.moves.pigUltimate.map(m=>({...m})))-1;
const SPECIES_MOVES={...MOVE_DATA.speciesMoves};
const TYPE_MOVE=MOVE_DATA.typeMove;
const movesFor0=(s,lv)=>{const p=ENEMIES[s],pool=SPECIES_MOVES[s]||[0,TYPE_MOVE[p?.t]||4,5];return [0,...pool.filter(i=>i!==0&&((i===pool[1]&&lv>=3)||(i===pool[2]&&lv>=8)||(i===pool[3]&&lv>=16)))].slice(0,4)};
const moveLabel=i=>{const m=MOVES[i];return m.p?`${m.n} 威力${m.p}`:`${m.n}（${m.t==='d'?'降攻':m.t==='rainbow'?'血量變1':m.t==='sweet'?'大補血+復活':'回復'}）`};
const SE=MOVE_DATA.typeEffectiveness;
const mult=(a,d)=>SE[a].includes(d)?2:SE[d].includes(a)?.5:1;
const nb=()=>GYMS.filter((g,i)=>FL['b'+i]).length;
const mon=(s,lv)=>{const p=ENEMIES[s],h=p.hp+lv*3,m=statInit({s,n:p.n,t:p.t,lv,max:h,hp:h,exp:0,dh:h,mv:movesFor(s,lv),atk:p.atk+lv});m.max+=m.iv.hp||0;m.hp=m.max;m.dh=m.hp;m.shiny=Math.random()<.015;return yuFix(m)};
const LEARN=Object.fromEntries(Object.entries(MOVE_DATA.learnLevels).map(([lv,m])=>[lv,m==='pigExclusive'?PIG_EXCLUSIVE_MOVE:m==='pigUltimate'?PIG_ULTIMATE_MOVE:m]));
/* 修正：呼叫端把「任務代號」放在第 11 個參數、「store」放第 12 個，原本參數對不上，導致所有任務 NPC 被當成商店店員而被刪除 */
const mk=(m,x,y,c,id,d,t,w,a,q,shop,store)=>({m,x,y,c,id,d,t,w,a,q:q||shop||null,shop:store||null});
const NPCS=[
 mk('town',7,5,1,0,['老豬：歡迎來到豬豬鎮！','東邊的月影森林住著拜月狼，打倒牠才能通往水族城。','等級到 5 以上再去挑戰館主吧。']),
 mk('town',13,10,2,0,['村民：草叢裡的怪獸越來越兇。','在小屋睡覺還能記錄冒險喔！']),
 mk('town',2,13,1,'s0',['小豬郵差：我每天都在鎮裡送信！','聽說東南角的石板會在月光下發亮。']),
 mk('town',5,1,2,'shop',['豬豬雜貨店：歡迎來看看旅行用品！'],null,null,null,null,null,'store'),
 mk('town',10,1,3,'qboard',['任務公告板：這裡有給訓練豬的委託。'],null,null,null,null,'patrol'),
 mk('town',12,1,1,'qbottle',['港口研究員：漂流瓶裡有一封重要的回信。'],null,null,null,null,'bottle'),
 mk('town',14,1,2,'qrare',['月光研究員：我想確認月光靈是否真的存在。'],null,null,null,null,'rare'),
 mk('town',16,1,3,'qlegend',['傳說研究員：完成最後試煉，我會給你一枚唯一的傳說捕獲飼料。'],null,null,null,null,'legend'),
 mk('route',8,5,2,'t1',['牧童阿牛：喂，來場對決吧！'],{n:'牧童阿牛',lv:3,b:ENEMIES[0]},['牧童阿牛：輸了……道館就在北邊。'],'牧童阿牛：道館就在北邊的大屋。'),
 mk('gym',6,4,2,'t2',['學徒：想見館主？先過我這關！'],{n:'學徒',lv:4,b:ENEMIES[2]},['學徒：館主就在最裡面。'],'學徒：館主就在最裡面。'),
 mk('gym',4,1,3,'boss',['館主豬大哥：我是這裡的館主！','讓我看看你的小豬有多強！'],{n:'館主豬大哥',lv:6,b:{n:'巨型史萊姆',hp:24,atk:5,d:slime}},['館主豬大哥：太精彩了！這枚徽章送給你！'],'館主豬大哥：你是豬豬鎮最強的訓練豬！')
];
GYMS.forEach((g,i)=>{const sp=ENEMIES[g.s],tp=sp.t,m='g'+i;
 NPCS.push(mk(m,6,4,2,'t'+i,['學徒：想見館主？先過我這關！'],{n:'學徒',lv:g.lv-2,b:sp},['學徒：館主就在最裡面。'],'學徒：館主就在最裡面。'),
 mk(m,4,1,3,'boss'+i,[`${tp}系館主：我是第${i+1}道館的館主！`,'讓我看看你的隊伍有多強！'],{n:`${tp}系館主`,lv:g.lv,b:{...sp,n:sp.n+'王',hp:sp.hp+10,atk:sp.atk+1}},['館主：太精彩了！徽章送給你！'],'館主：你是最強的訓練豬！'))});
/* ---- v2 expansion ---- */
