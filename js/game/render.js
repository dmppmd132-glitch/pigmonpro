/* PigmonPro module: Canvas tile rendering, HUD, title screen, and game loop. Loaded in order by index.html. */
/* ---------- drawing ---------- */
function drawBaseTile(c,x,y,sx,sy){
 if(c==='B'){R(sx,sy,16,16,3);R(sx+4,sy+3,8,10,2);R(sx+2,sy+6,12,2,1);return}if(c==='R'){R(sx,sy,16,16,1);R(sx+2,sy+6,12,3,3);R(sx+7,sy+2,2,12,3);return}if(c==='S'){R(sx,sy,16,16,2);R(sx+3,sy+5,10,6,3);R(sx+7,sy+2,2,12,1);return}if(c==='M'){R(sx,sy,16,16,1);R(sx+2,sy+2,5,5,3);R(sx+9,sy+9,5,5,3);return}if(c==='Z'){R(sx,sy,16,16,3);R(sx+4,sy+4,8,8,1);return}if(c==='K'){R(sx,sy,16,16,1);R(sx+2,sy+5,12,5,3);R(sx+3,sy+3,3,3,2);R(sx+10,sy+3,3,3,2);return}if(c==='U'){R(sx,sy,16,16,2);R(sx+3,sy+2,10,12,3);R(sx+6,sy+4,4,8,1);return}if(c==='P'){R(sx,sy,16,16,2);R(sx+3,sy+3,10,10,3);R(sx+6,sy+6,4,4,1);return}if(c==='I'){R(sx,sy,16,16,1);R(sx+3,sy+4,10,8,3);R(sx+5,sy+2,6,3,2);return}if(c==='q'){R(sx,sy,16,16,0);R(sx+4,sy+7,8,2,2);return}if(c==='S'){R(sx,sy,16,16,3);R(sx+1,sy+1,14,14,2);R(sx+2,sy+9,12,7,3);T('店',sx+3,sy+1,0,11);return}
 if(c==='T'){R(sx,sy,16,16,3);R(sx+1,sy+1,14,14,1);T('商店',sx+1,sy+4,3,7);return}
 if(c==='f'){R(sx,sy,16,16,0);R(sx+6,sy+6,4,4,2);R(sx+7,sy+3,2,3,1);R(sx+7,sy+10,2,3,1);R(sx+3,sy+7,3,2,1);R(sx+10,sy+7,3,2,1);R(sx+7,sy+7,2,2,3);return}
 if(c==='r'){R(sx,sy,16,16,0);ell(sx+8,sy+9,7,6,3);ell(sx+8,sy+9,6,5,2);R(sx+4,sy+6,4,2,1);return}
 if(c==='#'){R(sx,sy,16,16,0);ell(sx+8,sy+8,7,7,3);ell(sx+8,sy+7,5,5,2);R(sx+7,sy+12,2,4,3);return}
 if(c==='g'){R(sx,sy,16,16,1);for(let i=0;i<4;i++){R(sx+2+i*4,sy+4+(i%2)*5,1,5,2);R(sx+3+i*4,sy+6+(i%2)*5,1,3,2)}return}
 if(c==='w'){R(sx,sy,16,16,2);const o=(S.t>>4&1)*3;R(sx+2+o,sy+4,6,1,1);R(sx+7-o,sy+11,6,1,1);return}
 if('HhGC'.includes(c)){
  const a=MAP[y-1]&&MAP[y-1][x],roof=!'HhGC'.includes(a);
  R(sx,sy,16,16,roof?3:2);
  if(roof){R(sx,sy+4,16,1,2);R(sx,sy+9,16,1,2)}
  else{R(sx,sy,16,1,3);if(c==='H'){R(sx+5,sy+4,6,5,0);R(sx+5,sy+4,6,1,3)}}
  if(c!=='H'){R(sx+3,sy+2,10,14,3);R(sx+4,sy+3,8,13,2);R(sx+10,sy+9,2,2,0)}
  return}
 R(sx,sy,16,16,0);if(c==='X'&&!FL.leg){ell(sx+8,sy+8,5,6,2);ell(sx+8,sy+9,3,4,1)}if(c==='V'){R(sx+2,sy+3,12,12,3);R(sx+4,sy+6,8,9,2)}if(c==='L'){R(sx,sy,16,16,2);R(sx+3,sy+4,5,2,1);R(sx+9,sy+10,5,2,1)}if((x*7+y*3)%5===0){R(sx+4,sy+5,1,1,1);R(sx+11,sy+11,1,1,1)}
}
function drawWeatherFx(){const night=WORLD.time>=19||WORLD.time<6;ctx.save();if(night){ctx.fillStyle='rgba(20,18,70,.28)';ctx.fillRect(0,0,160,144);ctx.fillStyle='rgba(230,235,255,.7)';for(let i=0;i<8;i++){const x=(i*29+S.t)%160,y=(i*17)%80;ctx.fillRect(x,y,1,1)}}else if(WORLD.time>=17&&WORLD.time<19){ctx.fillStyle='rgba(255,150,80,.16)';ctx.fillRect(0,0,160,144)}if(WORLD.weather==='小雨'){ctx.strokeStyle='rgba(100,190,255,.72)';ctx.lineWidth=1;for(let i=0;i<18;i++){const x=(i*17+S.t*2)%160,y=(i*11+S.t*3)%144;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-2,y+6);ctx.stroke()}}if(WORLD.weather==='微雪'){ctx.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<20;i++){const x=(i*23+S.t)%160,y=(i*13+S.t/2)%144;ctx.fillRect(x,y,2,2)}}if(WORLD.weather==='雷雨'){ctx.strokeStyle='rgba(80,150,255,.75)';for(let i=0;i<16;i++){const x=(i*19+S.t*2)%160,y=(i*9+S.t*3)%144;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+8);ctx.stroke()}if((S.t>>4)%20===0){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(0,0,160,144)}}if(WORLD.weather==='濃霧'){ctx.fillStyle='rgba(220,230,235,.34)';ctx.fillRect(0,0,160,144)}if(WORLD.weather==='沙塵暴'){ctx.fillStyle='rgba(210,170,90,.45)';ctx.fillRect(0,0,160,144);ctx.fillStyle='rgba(245,220,150,.7)';for(let i=0;i<16;i++)ctx.fillRect((i*17+S.t*2)%160,(i*11)%144,3,1)}if(WORLD.weather==='花粉風'){ctx.fillStyle='rgba(190,230,105,.8)';for(let i=0;i<22;i++){const x=(i*19+S.t*1.4)%160,y=(i*13+S.t*.7)%144;ctx.fillRect(x,y,2,2)}ctx.fillStyle='rgba(180,220,100,.12)';ctx.fillRect(0,0,160,144)}if(WORLD.weather==='潮汐月夜'){ctx.fillStyle='rgba(70,180,220,.16)';ctx.fillRect(0,0,160,144);ctx.strokeStyle='rgba(120,230,255,.7)';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(20+i*34,112-(S.t%12),12,Math.PI,0);ctx.stroke()}}if(WORLD.weather==='流星雨'){ctx.strokeStyle='rgba(255,240,170,.9)';for(let i=0;i<10;i++){const x=(i*31+S.t*2)%180-10,y=(i*17+S.t)%90;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6,y+7);ctx.stroke()}}if(WORLD.weather==='熱浪'){ctx.fillStyle='rgba(255,130,50,.16)';ctx.fillRect(0,0,160,144);ctx.strokeStyle='rgba(255,210,100,.45)';for(let i=0;i<7;i++){const x=i*27+(S.t%10);ctx.beginPath();ctx.moveTo(x,120);ctx.quadraticCurveTo(x+6,110,x,100);ctx.stroke()}}ctx.restore()}
function drawBaseMap(){
 const pr=Math.round(Pl.prog),px=Pl.x*16+(Pl.mv?D[Pl.dir][0]*pr:0),py=Pl.y*16+(Pl.mv?D[Pl.dir][1]*pr:0);
 const cx=Math.max(0,Math.min(MW*16-160,px-72)),cy=Math.max(0,Math.min(MH*16-132,py-58));
 ctx.save();ctx.translate(0,12);
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const sx=x*16-cx,sy=y*16-cy;if(sx>-16&&sx<160&&sy>-16&&sy<132)tile(MAP[y][x],x,y,sx,sy)}
 NPCS.forEach(n=>{if(n.m===cur&&!(n.hide&&FL[n.id]))(n.sp||npcSprite)(n.x*16-cx,n.y*16-cy,n.c)});const f=Pl.mv?(pr>>3)&1:0;if(surf)ell(px-cx+8,py-cy+14,9,3,3);pigMap(px-cx,py-cy-(Pl.mv&&f?1:0),Pl.dir,f);drawWeatherFx();ctx.restore();
 /* 單行狀態列：金錢、地圖名、時間天氣（等級與圖鑑已移除） */
 R(0,0,160,12,0);R(0,12,160,1,3);T(`$${BAG.coins}`,3,1,2,7);T(mapName(cur),36,1,2,7);T(weatherLabel(),92,1,3,7);
}
function hpbar(x,y,w,r){T('HP',x,y-2,3,7);R(x+12,y,w,5,3);R(x+13,y+1,w-2,3,0);R(x+13,y+1,Math.round((w-2)*Math.max(0,r)),3,r>.25?2:3)}
function drawBattle(){
 ctx.save();const _sk=legendShake();if(_sk)ctx.translate(_sk[0],_sk[1]);R(-6,-6,172,156,0);const E=B.e;
 drawPigExclusiveFx();
 drawPigUltimateFx();
 ell(116,56,28,5,1);ell(40,92,30,5,1);
 if(!(B.bl==='e'&&(S.t>>2&1)))E.d(116,32);if(E.shiny)T('✦',132,10,2,10);
 if(!(B.bl==='p'&&(S.t>>2&1)))monSprite(pig,40,pig.s===undefined?70:64);
 drawLegendFx();
 box(4,6,82,28);T(fitText(E.n+statusLabel(E),40,8),10,9,3,8);T('Lv'+E.lv+E.t,52,9,3,8);hpbar(12,23,52,E.dh/E.max);
 box(78,62,80,30);T(fitText(pig.n,31,8),84,65,3,8);T('Lv'+pig.lv+pig.t,118,65);hpbar(86,79,52,pig.dh/pig.max);T(`${Math.round(pig.dh)}/${pig.max}`,119,85,3,7);
 ctx.restore();
}
function drawTitle(){
 R(0,0,160,144,0);R(0,0,160,6,2);R(0,138,160,6,2);
 ctx.font='15px '+FONT;let w=ctx.measureText('豬豬小可愛*粉紅').width;T('豬豬小可愛*粉紅',80-w/2,20,3,15);
 ctx.font='12px '+FONT;w=ctx.measureText('～ 粉紅版 ～').width;T('～ 粉紅版 ～',80-w/2,44,2,12);
 pigBig(80,88);
 if(S.t>>5&1)return;ctx.font='10px '+FONT;w=ctx.measureText('按 A 開始').width;T('按 A 開始',80-w/2,122,3);
}
function drawUIBase(){
 if(S.msg){
  const m=S.msg;box(2,98,156,44);let left=m.shown|0;
  m.l.slice(0,3).forEach((s,i)=>{T(s.slice(0,left),8,104+i*13);left-=s.length});
  if(m.shown>=m.n&&(S.t>>4&1))R(148,134,5,3,3);
 }else if(S.menu){
  const m=S.menu;box(2,98,156,44);
  if(m.box==='right'){S.prompt.split('\n').forEach((s,i)=>T(s,10,106+i*14));box(84,98,74,44);{const st=m.o.length>3?Math.max(0,Math.min(m.i-1,m.o.length-3)):0;m.o.slice(st,st+3).forEach((o,j)=>T(fitText((m.i===st+j?'▶':'　')+o,66,8),90,105+j*13,3,8));if(st>0)T('▲',150,99,3,6);if(st+3<m.o.length)T('▼',150,134,3,6)}}
  else m.o.forEach((o,i)=>{const z=m.o.length>=4?8:10,x=8+(i%2)*78,y=103+(i/2|0)*(m.o.length>4?14:16),mark=m.i===i?'▶':'　';T(fitText(mark+o,74,z),x,y,3,z)});
 }
}
function drawBase(){
 ctx.setTransform(3,0,0,3,0,0);
 if(S.mode==='evoChoice'){drawEvolutionChoice();return}
 if(S.mode==='evolution'){drawEvolution();return}
 if(S.mode==='title')drawTitle();
 else if(S.mode==='puzzle')drawPuz();else if(S.mode==='view')drawView();else if(S.mode==='battle')drawBattle();
 else{drawMap();if(S.mode==='trans'){const p=(performance.now()-S.t0)/700;for(let i=0;i<9;i++){const w=Math.max(0,Math.min(160,p*220-i*12));R(i%2?160-w:0,i*16,w,16,3)}}}
 drawUI();
}
function tick(){
 const _n=performance.now(),dt=Math.min(.05,(_n-(tick.l||_n))/1000);tick.l=_n;
 S.t++;
 if(S.msg&&S.msg.shown<S.msg.n)S.msg.shown+=.8;
 pig.dh+=(pig.hp-pig.dh)*.15;if(Math.abs(pig.hp-pig.dh)<.3)pig.dh=pig.hp;
 if(B){const e=B.e;e.dh+=(e.hp-e.dh)*.15;if(Math.abs(e.hp-e.dh)<.3)e.dh=e.hp}
 if(S.mode==='map'&&!S.msg&&!S.menu){
  if(!Pl.mv){
   const d=held.up?'up':held.down?'down':held.left?'left':held.right?'right':null;
   if(d){Pl.dir=d;const nx=Pl.x+D[d][0],ny=Pl.y+D[d][1];if(walk(nx,ny)){Pl.mv=true;Pl.tx=nx;Pl.ty=ny;Pl.prog=Pl.carry||0;Pl.carry=0}else Pl.carry=0}else Pl.carry=0
  }else{Pl.prog+=120*dt;if(Pl.prog>=16){Pl.carry=Math.min(6,Pl.prog-16);Pl.x=Pl.tx;Pl.y=Pl.ty;Pl.mv=false;Pl.prog=0;arrive()}}
 }
 MU.sync();draw();requestAnimationFrame(tick);
}
const mapId=()=>cur;
