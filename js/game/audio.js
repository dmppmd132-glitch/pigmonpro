/* PigmonPro module: Web Audio music and sound effects. Loaded in order by index.html. */
/* ---- chiptune BGM ---- */
const MU=(()=>{let ac,g,cur='',step=0,next=0,on=true,btn,t0=0,nb=null;try{on=localStorage.getItem('pigmon_mute')!=='1'}catch(e){}
const mf=n=>440*2**((n-69)/12),rp=(cs,pt)=>cs.flatMap(r=>pt.map(x=>x===null?0:r+x));
const TR={
 t:{bpm:132,lt:'square',lv:.045,lead:[76,0,72,76,79,0,76,72,77,0,72,77,81,0,77,72,79,0,74,79,83,0,79,74,76,74,72,0,67,0,72,0,81,0,76,81,84,0,81,76,77,0,74,77,81,77,74,0,79,77,76,74,72,74,76,0,72,0,76,0,79,0,0,0],bass:rp([48,53,55,48,45,53,55,48],[0,null,7,null,0,null,7,null])},
 b:{bpm:150,lt:'square',lv:.05,lead:[81,0,81,84,81,0,79,76,77,0,77,81,77,0,76,72,79,0,79,83,79,0,77,74,76,0,80,83,88,0,83,80],bass:rp([45,41,43,40],[0,0,12,0,0,0,12,0])},
 p:{bpm:96,lt:'triangle',lv:.07,lead:rp([48,53,55,48,48,53,55,48],[24,28,31,28,24,28,31,28]),bass:rp([48,53,55,48,48,53,55,48],[0,null,null,null,7,null,null,null])}};
const T2=(bpm,lt,lv,root,str,ch,bp)=>({bpm,lt,lv,lead:str.replace(/\|/g,' ').split(/\s+/).filter(Boolean).map(x=>x==='.'?0:root+ +x),bass:rp(ch.map(c=>root-24+c),bp)});
const SB=[0,null,null,null,7,null,null,null],AB=[0,null,7,null,0,null,7,null];
TR.forest=T2(100,'triangle',.07,69,'0 . 3 . 7 . 3 . | -4 . 0 . 3 . 0 . | -2 . 2 . 5 . 2 . | -5 . -1 . 2 . -1 .',[0,-4,-2,-5],SB);
TR.route=T2(112,'square',.035,72,'0 4 7 12 7 4 7 4 | 5 9 12 17 12 9 12 9 | 7 11 14 19 14 11 14 11 | 0 4 7 12 7 4 7 .',[0,5,7,0],AB);
TR.school=T2(126,'square',.045,67,'0 . 4 . 7 . 4 . | 5 . 9 . 12 . 9 . | 7 . 11 . 14 . 11 . | 0 4 7 4 0 . . .',[0,5,7,0],AB);
TR.a2=T2(104,'triangle',.08,65,'0 4 7 . 9 7 4 . | 5 9 12 . 14 12 9 . | 7 11 14 . 16 14 11 . | 0 4 7 12 . . . .',[0,5,7,0],AB);
TR.a3=T2(160,'square',.045,64,'0 0 12 . 7 . 12 7 | 5 5 17 . 12 . 17 12 | 7 7 19 . 14 . 19 14 | 0 12 7 12 0 . . .',[0,5,7,0],[0,0,12,0,0,0,12,0]);
TR.a4=T2(144,'square',.05,62,'0 . 3 5 7 . 5 3 | -4 . 0 3 5 . 3 0 | -2 . 2 5 7 . 5 2 | 0 3 7 10 12 . 10 7',[0,-4,-2,0],[0,0,0,null,7,null,0,null]);
TR.a5=T2(92,'square',.05,60,'0 . . 3 . . 7 . | -2 . . 2 . . 5 . | -4 . . 0 . . 3 . | -5 . . -1 . . 2 .',[0,-2,-4,-5],[0,null,null,0,null,null,7,null]);
TR.a6=T2(88,'triangle',.07,79,'0 . . 7 . . 12 . | 2 . . 9 . . 14 . | 4 . . 11 . . 16 . | 0 . 7 . 12 . . .',[0,2,4,0],SB);
TR.sea=T2(108,'triangle',.075,67,'0 4 7 4 0 4 7 4 | -3 0 4 0 -3 0 4 0 | -5 -1 2 -1 -5 -1 2 -1 | 0 4 7 4 0 . . .',[0,-3,-5,0],AB);
TR.volc=T2(132,'square',.05,57,'0 0 . 3 0 . 5 3 | 0 0 . 3 0 . 7 5 | -2 -2 . 1 -2 . 3 1 | -5 -5 . -2 -5 . 0 -2',[0,0,-2,-5],[0,0,0,0,7,0,0,0]);
TR.maze=T2(84,'triangle',.08,66,'0 . 1 . 0 . -1 . | 3 . 4 . 3 . 2 . | 0 . 1 . 6 . 5 . | -1 . 0 . -1 . . .',[0,3,0,-1],[0,null,null,null,null,null,6,null]);

/* ---- 新增場景音樂：標題 / 商店 / 深海 / 遺跡 / 夢境 / 研究所 / 進化 / 小遊戲 / 各種對戰 ---- */
const D=(t,dr)=>(t.dr=dr,t);
TR.title=T2(84,'triangle',.08,72,'0 . 4 . 7 . 12 . | 9 . 5 . 9 . 12 . | 7 . 11 . 14 . 11 . | 12 . 7 . 4 . 0 . .',[0,5,7,0],SB);
TR.shop=T2(112,'square',.035,67,'0 4 7 4 0 4 7 4 | 5 9 12 9 5 9 12 9 | 2 5 9 5 2 5 9 5 | 7 11 14 11 7 . . .',[0,5,2,7],AB);
TR.deep=T2(76,'triangle',.08,62,'0 . 7 . 3 . 7 . | -2 . 5 . 2 . 5 . | -4 . 3 . 0 . 3 . | -5 . 2 . -2 . . .',[0,-2,-4,-5],SB);
TR.ruins=T2(90,'square',.04,60,'0 . 3 . 6 . 3 . | 0 . 3 . 7 . 3 . | -2 . 1 . 5 . 1 . | -5 . -2 . 1 . . .',[0,0,-2,-5],[0,null,null,null,6,null,null,null]);
TR.dream=T2(80,'triangle',.08,79,'0 . 4 . 7 . 11 . | 9 . 5 . 2 . 5 . | 4 . 7 . 11 . 14 . | 12 . 7 . 4 . 0 .',[0,5,4,0],SB);
TR.lab=D(T2(138,'square',.04,60,'0 0 12 0 3 3 15 3 | -2 -2 10 -2 5 5 17 5',[0,3,-2,5],[0,0,0,0,0,0,12,0]),'k.h.sh..');
TR.evo=D(T2(120,'square',.05,67,'0 4 7 12 . 7 12 16 | 14 11 7 11 14 . 19 .',[0,7],AB),'k.h.s.h.');
TR.mg=D(T2(150,'square',.04,72,'0 4 7 4 0 4 7 12 | 9 5 9 12 9 5 2 .',[0,5],AB),'k.h.k.s.');
D(TR.b,'k.h.s.h.');
TR.bt=D(T2(144,'square',.05,69,'0 0 3 0 7 0 3 0 | 5 5 8 5 12 5 8 5 | -2 -2 1 -2 3 -2 1 -2 | -5 . -2 . 2 3 2 .',[0,5,-2,-5],[0,0,12,0,0,0,12,0]),'k.hsk.hs');
TR.bg=D(T2(164,'square',.05,64,'0 . 7 . 12 . 7 . 3 . 10 . 15 . 10 . | 5 . 12 . 17 . 12 . 3 . 10 . 7 . 3 .',[0,3,5,-2],[0,0,12,0,0,12,0,0]),'kshhkshk');
TR.bb=D(T2(176,'square',.055,57,'0 0 12 0 1 1 13 1 | -2 -2 10 -2 -4 -4 8 -4',[0,1,-2,-4],[0,0,0,12,0,0,7,0]),'kkshkksh');
const ALIAS={forestDeep:'forest',forestGrove:'forest',forestCanopy:'forest',forestMoss:'forest',mine:'a5',iceCave:'a6',volcIn:'volc',undersea:'deep',underseaDeep:'deep',trench:'deep',trenchEast:'deep',trenchWest:'deep',ruins:'ruins',ruins2:'ruins',dreamSpace:'dream',dreamBranch:'dream',dreamCore:'dream',lab:'lab',labUnderground:'lab',schoolInterior:'school',shop:'shop',maze2:'maze'};
const pick=k=>TR[k]&&!/^(b|p|t)$/.test(k)?k:(ALIAS[k]||(/^LL/.test(k)?'maze':'t'));
function noiseBuf(){if(nb)return nb;nb=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return nb}
function drum(t,c,d){if(c==='k'){const o=ac.createOscillator(),e=ac.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);e.gain.setValueAtTime(.2,t);e.gain.exponentialRampToValueAtTime(.0001,t+.15);o.connect(e);e.connect(g);o.start(t);o.stop(t+.17)}
 else{const s=ac.createBufferSource(),e=ac.createGain(),f=ac.createBiquadFilter();s.buffer=noiseBuf();f.type='highpass';f.frequency.value=c==='h'?7000:1800;e.gain.setValueAtTime(c==='h'?.04:.09,t);e.gain.exponentialRampToValueAtTime(.0001,t+(c==='h'?.04:.11));s.connect(f);f.connect(e);e.connect(g);s.start(t);s.stop(t+.12)}}
function note(t,n,d,ty,v){const o=ac.createOscillator(),e=ac.createGain();o.type=ty;o.frequency.value=mf(n);e.gain.setValueAtTime(v,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(e);e.connect(g);o.start(t);o.stop(t+d+.02)}
function pump(){if(!ac||ac.state!=='running')return;const T=TR[cur];if(!T)return;const d=30/T.bpm;if(next<ac.currentTime)next=ac.currentTime+.05;
 while(next<ac.currentTime+.2){const L=T.lead[step%T.lead.length],B=T.bass[step%T.bass.length],c=T.dr&&T.dr[step%T.dr.length];if(L)note(next,L,d*1.7,T.lt,T.lv);if(B)note(next,B,d*2.2,'triangle',.1);if(c&&c!=='.')drum(next,c);step++;next+=d}}
const SF={move:[[500,800,.08,'square',0]],hit:[[320,70,.14,'sawtooth',0],[900,200,.05,'square',0]],hurt:[[220,60,.2,'square',0]],super:[[600,1200,.12,'square',0],[900,1500,.14,'square',.1]],miss:[[500,200,.16,'triangle',0]],heal:[[523,784,.12,'triangle',0],[784,1047,.2,'triangle',.12]],catch:[[660,660,.08,'square',0],[880,880,.08,'square',.1],[1320,1320,.2,'square',.2]],level:[[523,523,.1,'square',0],[659,659,.1,'square',.1],[784,784,.1,'square',.2],[1047,1047,.25,'square',.3]],win:[[392,392,.12,'square',0],[523,523,.12,'square',.12],[659,659,.25,'square',.24]],evolve:[[392,784,.18,'triangle',0],[523,1047,.18,'triangle',.12],[659,1318,.2,'sine',.24],[784,1568,.32,'sine',.36]],lgLight:[[880,1760,.12,'sine',0],[1175,2349,.14,'sine',.1],[1568,3136,.18,'sine',.2]],lgFire:[[180,60,.35,'sawtooth',0],[400,120,.3,'square',.05],[900,200,.25,'sawtooth',.1]],lgWater:[[300,900,.2,'sine',0],[500,1200,.2,'triangle',.15],[250,700,.2,'sine',.3]],lgThunder:[[1200,100,.08,'sawtooth',0],[1500,80,.1,'sawtooth',.12],[200,40,.3,'square',.2]],lgIce:[[1400,2600,.1,'triangle',0],[1000,2000,.12,'sine',.1],[1800,3200,.16,'triangle',.2]],lgBoom:[[150,40,.4,'sawtooth',0],[90,30,.4,'square',.1]],lgRoll:[[200,500,.15,'square',0],[300,700,.15,'square',.12],[160,60,.25,'sawtooth',.28]],lgHit:[[500,150,.1,'square',0],[400,120,.1,'square',.1],[300,90,.12,'square',.2]]};
function sfx(k){if(!ac||ac.state!=='running'||!on)return;const t=ac.currentTime;(SF[k]||[]).forEach(([a,b,d,ty,at])=>{const o=ac.createOscillator(),e=ac.createGain(),u=t+at;o.type=ty;o.frequency.setValueAtTime(a,u);o.frequency.exponentialRampToValueAtTime(b,u+d);e.gain.setValueAtTime(.12,u);e.gain.exponentialRampToValueAtTime(.0001,u+d);o.connect(e);e.connect(g);o.start(u);o.stop(u+d+.02)})}
function lab(){if(!btn)return;const run=ac&&ac.state==='running';btn.textContent=!on?'♪ 音樂：關（點此開啟）':!run?'♪ 音樂：開（按任意鍵開始播放）':'♪ 音樂：開（點此關閉）'}
function init(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();t0=performance.now();g=ac.createGain();g.gain.value=on?.5:0;g.connect(ac.destination);setInterval(pump,40);ac.onstatechange=lab}catch(e){return}}
 if(ac.state!=='running'){try{ac.resume().then(lab).catch(()=>{})}catch(e){}try{const s=ac.createBufferSource();s.buffer=ac.createBuffer(1,1,22050);s.connect(ac.destination);s.start(0)}catch(e){}}lab()}
function toggle(){if(!ac){init();if(on)return}else if(on&&performance.now()-t0<600)return;on=!on;if(g)g.gain.value=on?.5:0;try{localStorage.setItem('pigmon_mute',on?'0':'1')}catch(e){}if(on)init();lab()}
['keydown','pointerdown','pointerup','touchend','click'].forEach(t=>addEventListener(t,init,{capture:true,passive:true}));
addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M')toggle()});
document.addEventListener('visibilitychange',()=>{if(!ac)return;document.hidden?ac.suspend():ac.resume()});
return{sfx,sync(){const m=mapId(),k=/^g\d$/.test(m)?GYMS[+m[1]].m:m,md=S.mode;let w;
 if(md==='title')w='title';else if(md==='battle')w=B&&B.k==='boss'?'bb':B&&B.k==='gym'?'bg':B&&B.k==='trainer'?'bt':'b';
 else if(md==='puzzle')w='p';else if(md==='mini')w='mg';else if(md==='evolution'||md==='evoChoice')w='evo';
 else if(md==='trans')w=cur||'t';else w=pick(k);
 if(w!==cur){cur=w;step=0;next=0}},bind(b){btn=b;lab();b.addEventListener('click',toggle)}}})();

