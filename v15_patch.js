// Piano Master v15 Patch Module
// Improvisation Studio, Listening Room, Tuning Lab, Hand Independence Drill,
// Expression Dictionary, Daily Warmup, Melodic Dictation, Share Card Generator
// 10 Songs (112→122), Quiz v6 15Q (75→90), 12 Achievements (108→120), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v15Loaded) return;
window.__v15Loaded = true;

var LS15 = 'piano-v15-';
function ls15Get(k,d){try{return JSON.parse(localStorage.getItem(LS15+k))||d}catch{return d}}
function ls15Set(k,v){localStorage.setItem(LS15+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v15 ================
var sfx15 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX15(type){
  if(!sfx15) return;
  if(sfx15.state==='suspended') sfx15.resume();
  var t=sfx15.currentTime, g=sfx15.createGain(), o=sfx15.createOscillator();
  g.connect(sfx15.destination); o.connect(g);
  switch(type){
    case 'improv_start':
      o.type='triangle';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.3);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o.start(t);o.stop(t+0.4);break;
    case 'improv_note':
      o.type='sine';o.frequency.setValueAtTime(523+Math.random()*400,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
    case 'listen_play':
      o.type='triangle';o.frequency.setValueAtTime(330,t);o.frequency.linearRampToValueAtTime(660,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'tuning_correct':
      o.type='sine';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      setTimeout(function(){if(!sfx15)return;var gg=sfx15.createGain(),oo=sfx15.createOscillator();gg.connect(sfx15.destination);oo.connect(gg);oo.type='sine';oo.frequency.setValueAtTime(1175,sfx15.currentTime);gg.gain.setValueAtTime(0.09,sfx15.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx15.currentTime+0.15);oo.start(sfx15.currentTime);oo.stop(sfx15.currentTime+0.15);},100);return;
    case 'tuning_off':
      o.type='sawtooth';o.frequency.setValueAtTime(150,t);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'hand_drill':
      o.type='square';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(660,t+0.1);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
    case 'expr_open':
      o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.linearRampToValueAtTime(523,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'warmup_tick':
      o.type='sine';o.frequency.setValueAtTime(1000,t);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
      o.start(t);o.stop(t+0.04);break;
    case 'warmup_done':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(1047,t+0.25);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);break;
    case 'dictation_play':
      o.type='triangle';o.frequency.setValueAtTime(660,t);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'share_snap':
      o.type='square';o.frequency.setValueAtTime(1200,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      o.start(t);o.stop(t+0.06);
      setTimeout(function(){if(!sfx15)return;var gg=sfx15.createGain(),oo=sfx15.createOscillator();gg.connect(sfx15.destination);oo.connect(gg);oo.type='sine';oo.frequency.setValueAtTime(1568,sfx15.currentTime);gg.gain.setValueAtTime(0.05,sfx15.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx15.currentTime+0.08);oo.start(sfx15.currentTime);oo.stop(sfx15.currentTime+0.08);},70);return;
    case 'v15_achieve':
      o.type='triangle';o.frequency.setValueAtTime(784,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx15)return;var gg=sfx15.createGain(),oo=sfx15.createOscillator();gg.connect(sfx15.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(1175,sfx15.currentTime);gg.gain.setValueAtTime(0.1,sfx15.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx15.currentTime+0.2);oo.start(sfx15.currentTime);oo.stop(sfx15.currentTime+0.2);},120);return;
  }
}

// ================ COMMON MODAL BUILDER ================
function makeV15Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  var inner=document.createElement('div');
  inner.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,500px);max-height:90vh;overflow-y:auto';
  var header=document.createElement('div');
  header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px';
  var h2=document.createElement('h2');
  h2.style.cssText='font-size:16px;color:var(--accent)';
  h2.textContent=title;
  var closeBtn=document.createElement('button');
  closeBtn.style.cssText='background:none;border:none;color:var(--text);font-size:18px;cursor:pointer';
  closeBtn.innerHTML='&times;';
  closeBtn.addEventListener('click',function(){modal.style.display='none';});
  header.appendChild(h2);header.appendChild(closeBtn);
  inner.appendChild(header);
  contentFn(inner, modal);
  modal.appendChild(inner);
  document.body.appendChild(modal);
  return modal;
}

// ================ NOTE FREQ HELPER ================
var NF15 = {
  'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'G3':196.00,'A3':220.00,'B3':246.94,
  'C4':261.63,'C#4':277.18,'D4':293.66,'D#4':311.13,'E4':329.63,
  'F4':349.23,'F#4':369.99,'G4':392.00,'G#4':415.30,'A4':440.00,
  'A#4':466.16,'B4':493.88,'C5':523.25,'C#5':554.37,'D5':587.33,
  'D#5':622.25,'E5':659.26,'F5':698.46,'F#5':739.99,'G5':783.99,
  'G#5':830.61,'A5':880.00,'B5':987.77,'C6':1046.50
};
function playNote15(note, dur){
  if(!sfx15||!NF15[note]) return;
  if(sfx15.state==='suspended') sfx15.resume();
  var t=sfx15.currentTime;
  var g=sfx15.createGain(), o=sfx15.createOscillator();
  g.connect(sfx15.destination);o.connect(g);
  o.type='triangle';o.frequency.setValueAtTime(NF15[note],t);
  g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+(dur||0.4));
  o.start(t);o.stop(t+(dur||0.4));
}

// ================ 1. IMPROVISATION STUDIO ================
var IMPROV_SCALES = [
  {name:'C Major Pentatonic',notes:['C4','D4','E4','G4','A4','C5','D5','E5'],color:'#22c55e',desc:'밝고 따뜻한 즉흥 연주의 기본'},
  {name:'A Minor Pentatonic',notes:['A3','C4','D4','E4','G4','A4','C5','D5'],color:'#3b82f6',desc:'록/블루스의 핵심 스케일'},
  {name:'C Blues Scale',notes:['C4','D#4','F4','F#4','G4','A#4','C5'],color:'#a855f7',desc:'블루노트가 포함된 감성 스케일'},
  {name:'D Dorian',notes:['D4','E4','F4','G4','A4','B4','C5','D5'],color:'#06b6d4',desc:'재즈/펑크에서 자주 사용'},
  {name:'G Mixolydian',notes:['G4','A4','B4','C5','D5','E5','F5','G5'],color:'#eab308',desc:'도미넌트 7th 코드 위 즉흥'},
  {name:'E Phrygian',notes:['E4','F4','G4','A4','B4','C5','D5','E5'],color:'#ef4444',desc:'스페인/플라멩코 풍의 이국적 사운드'}
];
var improvScaleIdx=0, improvPlaying=false, improvBacking=null;

function buildImprovUI(){
  makeV15Modal('improv-modal','🎸 즉흥연주 스튜디오',function(inner){
    var area=document.createElement('div');area.id='improv-area';
    area.innerHTML='<canvas id="improv-canvas" width="460" height="300" style="width:100%;max-width:460px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px;cursor:pointer"></canvas>'+
      '<div id="improv-controls" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:10px"></div>'+
      '<div id="improv-scale-list" style="display:flex;flex-direction:column;gap:6px"></div>';
    inner.appendChild(area);
    setTimeout(function(){renderImprovScales();drawImprovCanvas();setupImprovCanvas();},0);
  });
}

function renderImprovScales(){
  var el=document.getElementById('improv-scale-list');if(!el)return;
  var played=ls15Get('improvPlayed',{});
  el.innerHTML=IMPROV_SCALES.map(function(s,i){
    return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid '+(i===improvScaleIdx?s.color:'var(--border)')+';cursor:pointer" data-sidx="'+i+'">'+
      '<span style="width:8px;height:8px;border-radius:50%;background:'+s.color+';flex-shrink:0"></span>'+
      '<div style="flex:1"><div style="font-size:12px;font-weight:600">'+s.name+'</div><div style="font-size:9px;color:var(--text2)">'+s.desc+'</div></div>'+
      '<span style="font-size:9px;color:var(--accent)">'+(played[i]?played[i]+'회':'')+'</span></div>';
  }).join('');
  el.querySelectorAll('[data-sidx]').forEach(function(d){
    d.addEventListener('click',function(){improvScaleIdx=parseInt(d.getAttribute('data-sidx'));renderImprovScales();drawImprovCanvas();});
  });
}

function drawImprovCanvas(){
  var cv=document.getElementById('improv-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');
  var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var sc=IMPROV_SCALES[improvScaleIdx];
  ctx.fillStyle=sc.color;ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(sc.name,w/2,24);
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
  ctx.fillText(sc.desc,w/2,42);
  var nn=sc.notes.length;
  var kw=Math.min(50, Math.floor((w-40)/nn));
  var sx=Math.floor((w-kw*nn)/2);
  for(var i=0;i<nn;i++){
    var x=sx+i*kw;
    var isSharp=sc.notes[i].indexOf('#')!==-1;
    ctx.fillStyle=isSharp?'#222':'#ddd';
    ctx.fillRect(x,60,kw-4,80);
    ctx.strokeStyle=sc.color+'88';ctx.lineWidth=2;
    ctx.strokeRect(x,60,kw-4,80);
    ctx.fillStyle=isSharp?'#ccc':'#222';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText(sc.notes[i].replace(/[0-9]/g,''),x+(kw-4)/2,108);
    ctx.fillStyle='#666';ctx.font='9px sans-serif';
    ctx.fillText(String(i+1),x+(kw-4)/2,130);
  }
  ctx.textAlign='start';
  ctx.fillStyle=sc.color;ctx.font='11px sans-serif';ctx.textAlign='center';
  ctx.fillText('건반을 클릭하거나 숫자 키(1~'+nn+')를 눌러 연주하세요',w/2,165);
  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
  ctx.fillText('이 스케일의 음만 사용하면 자연스러운 멜로디가 됩니다',w/2,182);
  var tips=['같은 음을 반복하면 리듬감이 생겨요','인접한 음으로 움직이면 부드러운 선율','건너뛴 음으로 가면 역동적인 느낌','높은 음에서 낮은 음으로 내려오면 안정감','마지막은 첫 음(루트)으로 돌아오세요'];
  ctx.fillStyle='#555';ctx.font='9px sans-serif';
  for(var ti=0;ti<tips.length;ti++){
    ctx.fillText('• '+tips[ti],w/2,200+ti*14);
  }
  ctx.textAlign='start';
}

function setupImprovCanvas(){
  var cv=document.getElementById('improv-canvas');if(!cv)return;
  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    var mx=(e.clientX-rect.left)*(cv.width/rect.width);
    var sc=IMPROV_SCALES[improvScaleIdx];
    var nn=sc.notes.length;
    var kw=Math.min(50,Math.floor((cv.width-40)/nn));
    var sx=Math.floor((cv.width-kw*nn)/2);
    for(var i=0;i<nn;i++){
      var x=sx+i*kw;
      if(mx>=x&&mx<=x+kw-4){
        playNote15(sc.notes[i],0.5);
        playSFX15('improv_note');
        var played=ls15Get('improvPlayed',{});
        played[improvScaleIdx]=(played[improvScaleIdx]||0)+1;
        ls15Set('improvPlayed',played);
        break;
      }
    }
  });
  document.addEventListener('keydown',function(e){
    var modal=document.getElementById('improv-modal');
    if(!modal||modal.style.display!=='flex')return;
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    var sc=IMPROV_SCALES[improvScaleIdx];
    var idx=parseInt(e.key)-1;
    if(idx>=0&&idx<sc.notes.length){
      e.preventDefault();
      playNote15(sc.notes[idx],0.5);
      playSFX15('improv_note');
      var played=ls15Get('improvPlayed',{});
      played[improvScaleIdx]=(played[improvScaleIdx]||0)+1;
      ls15Set('improvPlayed',played);
    }
  });
}

// ================ 2. LISTENING ROOM ================
var LISTEN_PIECES = [
  {name:'월광 소나타 1악장',composer:'베토벤',year:1801,key:'C# Minor',mood:'명상적',notes:['C#4','E4','G#4','C#4','E4','G#4','C#4','E4'],tempo:0.6,desc:'달빛 아래 호수를 연상시키는 아르페지오'},
  {name:'엘리제를 위하여',composer:'베토벤',year:1810,key:'A Minor',mood:'서정적',notes:['E5','D#5','E5','D#5','E5','B4','D5','C5'],tempo:0.3,desc:'가장 유명한 피아노 소품 중 하나'},
  {name:'녹턴 Op.9-2',composer:'쇼팽',year:1832,key:'Eb Major',mood:'몽환적',notes:['G4','A#4','D5','F5','D5','A#4','G4','F4'],tempo:0.5,desc:'쇼팽의 가장 아름다운 야상곡'},
  {name:'환상즉흥곡',composer:'쇼팽',year:1834,key:'C# Minor',mood:'열정적',notes:['G#4','A4','G#4','F#4','E4','D#4','E4','F#4'],tempo:0.2,desc:'빠르고 화려한 기교의 즉흥곡'},
  {name:'라 캄파넬라',composer:'리스트',year:1851,key:'G# Minor',mood:'화려함',notes:['G#5','E5','D#5','C#5','G#4','E4','D#4','C#4'],tempo:0.25,desc:'종소리를 모방한 초절기교 연습곡'},
  {name:'아라베스크 1번',composer:'드뷔시',year:1891,key:'E Major',mood:'우아함',notes:['E4','F#4','G#4','A4','B4','C#5','D#5','E5'],tempo:0.4,desc:'인상주의 음악의 선구적 작품'},
  {name:'체르니 30번 1번',composer:'체르니',year:1850,key:'C Major',mood:'연습용',notes:['C4','E4','G4','C5','E5','C5','G4','E4'],tempo:0.2,desc:'피아노 기초 기교 연습의 정석'},
  {name:'트로이메라이',composer:'슈만',year:1838,key:'F Major',mood:'꿈결같은',notes:['F4','A4','C5','F5','E5','D5','C5','A4'],tempo:0.55,desc:'어린 시절의 꿈을 그린 소품'},
  {name:'소나타 K.545 1악장',composer:'모차르트',year:1788,key:'C Major',mood:'밝음',notes:['C5','B4','A4','G4','F4','E4','D4','C4'],tempo:0.3,desc:'초보자를 위한 소나타로 알려진 명곡'},
  {name:'인벤션 1번',composer:'바흐',year:1723,key:'C Major',mood:'학구적',notes:['C4','D4','E4','F4','D4','E4','C4','G4'],tempo:0.3,desc:'대위법 학습의 출발점'},
  {name:'짐노페디 1번',composer:'사티',year:1888,key:'D Major',mood:'평온함',notes:['F#4','E4','D4','B3','A3','D4','E4','F#4'],tempo:0.7,desc:'느리고 고통스럽게 - 사티의 지시'},
  {name:'사계 - 봄',composer:'비발디/피아노편곡',year:1725,key:'E Major',mood:'생동감',notes:['E5','D#5','E5','F#5','E5','D#5','C#5','B4'],tempo:0.25,desc:'봄의 기쁨을 표현한 피아노 편곡'}
];
var listenIdx=0, listenPlaying=false, listenTimer=null;

function buildListenUI(){
  makeV15Modal('listen-modal','🎧 음악 감상실',function(inner){
    var area=document.createElement('div');area.id='listen-area';
    area.innerHTML='<canvas id="listen-canvas" width="460" height="240" style="width:100%;max-width:460px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px">'+
      '<button id="listen-play-btn" style="padding:6px 16px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">&#9654; 감상하기</button>'+
      '<button id="listen-stop-btn" style="padding:6px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#9632; 정지</button></div>'+
      '<div id="listen-list" style="display:flex;flex-direction:column;gap:6px"></div>';
    inner.appendChild(area);
    setTimeout(function(){renderListenList();drawListenCanvas();
      document.getElementById('listen-play-btn').addEventListener('click',startListenPlay);
      document.getElementById('listen-stop-btn').addEventListener('click',stopListenPlay);
    },0);
  });
}

function renderListenList(){
  var el=document.getElementById('listen-list');if(!el)return;
  var heard=ls15Get('listenHeard',[]);
  el.innerHTML=LISTEN_PIECES.map(function(p,i){
    var isH=heard.indexOf(i)!==-1;
    return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid '+(i===listenIdx?'var(--accent)':'var(--border)')+';cursor:pointer" data-lidx="'+i+'">'+
      '<span style="font-size:14px">'+(isH?'&#9834;':'&#128274;')+'</span>'+
      '<div style="flex:1"><div style="font-size:12px;font-weight:600">'+p.name+'</div><div style="font-size:9px;color:var(--text2)">'+p.composer+' ('+p.year+') | '+p.key+' | '+p.mood+'</div></div></div>';
  }).join('');
  el.querySelectorAll('[data-lidx]').forEach(function(d){
    d.addEventListener('click',function(){stopListenPlay();listenIdx=parseInt(d.getAttribute('data-lidx'));renderListenList();drawListenCanvas();});
  });
}

function drawListenCanvas(){
  var cv=document.getElementById('listen-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var p=LISTEN_PIECES[listenIdx];
  ctx.fillStyle='#e8ecf4';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText(p.name,w/2,28);
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
  ctx.fillText(p.composer+' ('+p.year+') | '+p.key,w/2,46);
  ctx.fillStyle='#666';ctx.font='10px sans-serif';
  ctx.fillText(p.desc,w/2,64);
  var nn=p.notes.length;
  var bw=Math.min(40,Math.floor((w-80)/nn));
  var sx=Math.floor((w-bw*nn)/2);
  for(var i=0;i<nn;i++){
    var x=sx+i*bw;
    var barH=30+Math.random()*60;
    ctx.fillStyle=listenPlaying?('hsl('+Math.floor(220+i*15)+',70%,55%)'):'#333';
    ctx.fillRect(x,h-40-barH,bw-4,barH);
    ctx.fillStyle='#aaa';ctx.font='9px sans-serif';
    ctx.fillText(p.notes[i].replace(/[0-9]/g,''),x+(bw-4)/2,h-26);
  }
  ctx.fillStyle=listenPlaying?'#22c55e':'#555';ctx.font='11px sans-serif';
  ctx.fillText(listenPlaying?'&#9654; 재생 중...':'클릭하여 감상 시작',w/2,90);
  ctx.textAlign='start';
}

function startListenPlay(){
  stopListenPlay();
  listenPlaying=true;
  playSFX15('listen_play');
  var p=LISTEN_PIECES[listenIdx];
  var i=0;
  function playNext(){
    if(!listenPlaying||i>=p.notes.length){listenPlaying=false;drawListenCanvas();
      var heard=ls15Get('listenHeard',[]);if(heard.indexOf(listenIdx)===-1){heard.push(listenIdx);ls15Set('listenHeard',heard);}
      renderListenList();return;}
    playNote15(p.notes[i],p.tempo*0.8);i++;drawListenCanvas();
    listenTimer=setTimeout(playNext,p.tempo*1000);
  }
  playNext();
}

function stopListenPlay(){listenPlaying=false;if(listenTimer){clearTimeout(listenTimer);listenTimer=null;}}

// ================ 3. TUNING LAB ================
var TUNING_NOTES = [
  {name:'C4',freq:261.63},{name:'D4',freq:293.66},{name:'E4',freq:329.63},
  {name:'F4',freq:349.23},{name:'G4',freq:392.00},{name:'A4',freq:440.00},
  {name:'B4',freq:493.88},{name:'C5',freq:523.25},{name:'D5',freq:587.33},
  {name:'E5',freq:659.26},{name:'F5',freq:698.46},{name:'G5',freq:783.99}
];
var tuneIdx=0, tuneOffset=0, tuneScore=0, tuneRound=0, tuneMaxRound=10;

function buildTuningUI(){
  makeV15Modal('tuning-modal','🔧 조율 시뮬레이터',function(inner){
    var area=document.createElement('div');area.id='tuning-area';
    area.innerHTML='<canvas id="tuning-canvas" width="420" height="320" style="width:100%;max-width:420px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px;cursor:pointer"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">'+
      '<button id="tune-lower" style="padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#9664; 낮추기</button>'+
      '<button id="tune-submit" style="padding:6px 14px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">&#10003; 확인</button>'+
      '<button id="tune-higher" style="padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">높이기 &#9654;</button>'+
      '<button id="tune-listen" style="padding:6px 14px;border-radius:8px;border:1px solid var(--yellow);background:rgba(234,179,8,0.15);color:var(--yellow);font-size:12px;cursor:pointer">&#128266; 듣기</button>'+
      '<button id="tune-restart" style="padding:6px 14px;border-radius:8px;border:1px solid var(--green);background:rgba(34,197,94,0.15);color:var(--green);font-size:12px;cursor:pointer">&#8635; 새 게임</button></div>';
    inner.appendChild(area);
    setTimeout(function(){
      startTuningGame();
      document.getElementById('tune-lower').addEventListener('click',function(){tuneOffset=Math.max(tuneOffset-5,-50);playTuneNote();drawTuningCanvas();});
      document.getElementById('tune-higher').addEventListener('click',function(){tuneOffset=Math.min(tuneOffset+5,50);playTuneNote();drawTuningCanvas();});
      document.getElementById('tune-submit').addEventListener('click',submitTune);
      document.getElementById('tune-listen').addEventListener('click',function(){playNote15(TUNING_NOTES[tuneIdx].name,0.6);});
      document.getElementById('tune-restart').addEventListener('click',startTuningGame);
    },0);
  });
}

function startTuningGame(){
  tuneRound=0;tuneScore=0;nextTuneRound();
}

function nextTuneRound(){
  if(tuneRound>=tuneMaxRound){drawTuningCanvas();return;}
  tuneIdx=Math.floor(Math.random()*TUNING_NOTES.length);
  tuneOffset=Math.floor(Math.random()*61)-30;
  if(Math.abs(tuneOffset)<5) tuneOffset=tuneOffset<0?-10:10;
  drawTuningCanvas();
}

function playTuneNote(){
  if(!sfx15)return;
  if(sfx15.state==='suspended') sfx15.resume();
  var baseFreq=TUNING_NOTES[tuneIdx].freq;
  var shifted=baseFreq*Math.pow(2,tuneOffset/1200);
  var t=sfx15.currentTime;
  var g=sfx15.createGain(),o=sfx15.createOscillator();
  g.connect(sfx15.destination);o.connect(g);
  o.type='sine';o.frequency.setValueAtTime(shifted,t);
  g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);
  o.start(t);o.stop(t+0.5);
}

function submitTune(){
  if(tuneRound>=tuneMaxRound)return;
  var diff=Math.abs(tuneOffset);
  if(diff<=5){tuneScore+=3;playSFX15('tuning_correct');}
  else if(diff<=15){tuneScore+=1;playSFX15('tuning_correct');}
  else{playSFX15('tuning_off');}
  tuneRound++;
  ls15Set('tuneTotal',(ls15Get('tuneTotal',0))+1);
  ls15Set('tuneBestScore',Math.max(ls15Get('tuneBestScore',0),tuneScore));
  nextTuneRound();
}

function drawTuningCanvas(){
  var cv=document.getElementById('tuning-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  if(tuneRound>=tuneMaxRound){
    var grade=tuneScore>=27?'S':tuneScore>=21?'A':tuneScore>=15?'B':tuneScore>=9?'C':'D';
    var gc=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#f97316':'#ef4444';
    ctx.fillText('조율 시뮬레이션 완료!',w/2,40);
    ctx.fillStyle=gc;ctx.font='bold 48px sans-serif';
    ctx.fillText(grade,w/2,110);
    ctx.fillStyle='#e8ecf4';ctx.font='14px sans-serif';
    ctx.fillText('점수: '+tuneScore+'/'+tuneMaxRound*3,w/2,145);
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
    ctx.fillText('최고 기록: '+ls15Get('tuneBestScore',0)+'점',w/2,168);
    ctx.fillText('[새 게임] 버튼으로 다시 시작',w/2,190);
    ctx.textAlign='start';return;
  }
  ctx.fillText('라운드 '+(tuneRound+1)+'/'+tuneMaxRound+' | 점수: '+tuneScore,w/2,24);
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
  ctx.fillText('목표 음: '+TUNING_NOTES[tuneIdx].name+' ('+TUNING_NOTES[tuneIdx].freq.toFixed(1)+' Hz)',w/2,44);
  ctx.fillText('현재 음을 목표 음에 맞추세요',w/2,60);
  var meterW=300,meterH=30,mx=(w-meterW)/2,my=80;
  ctx.fillStyle='#222';ctx.fillRect(mx,my,meterW,meterH);
  var centerX=mx+meterW/2;
  ctx.fillStyle='#22c55e44';ctx.fillRect(centerX-15,my,30,meterH);
  ctx.strokeStyle='#22c55e';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(centerX,my);ctx.lineTo(centerX,my+meterH);ctx.stroke();
  var needleX=centerX+(tuneOffset/50)*(meterW/2);
  needleX=Math.max(mx,Math.min(mx+meterW,needleX));
  var diff=Math.abs(tuneOffset);
  ctx.fillStyle=diff<=5?'#22c55e':diff<=15?'#eab308':'#ef4444';
  ctx.beginPath();ctx.moveTo(needleX,my-5);ctx.lineTo(needleX-6,my-15);ctx.lineTo(needleX+6,my-15);ctx.fill();
  ctx.fillRect(needleX-2,my,4,meterH);
  ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
  ctx.fillText('-50 cents',mx,my+meterH+14);ctx.textAlign='end';
  ctx.fillText('+50 cents',mx+meterW,my+meterH+14);ctx.textAlign='center';
  ctx.fillText('0',centerX,my+meterH+14);
  var shiftedFreq=TUNING_NOTES[tuneIdx].freq*Math.pow(2,tuneOffset/1200);
  ctx.fillStyle=diff<=5?'#22c55e':diff<=15?'#eab308':'#ef4444';
  ctx.font='bold 20px sans-serif';
  ctx.fillText(shiftedFreq.toFixed(1)+' Hz',w/2,160);
  ctx.font='12px sans-serif';
  ctx.fillText((tuneOffset>=0?'+':'')+tuneOffset+' cents',w/2,180);
  ctx.fillStyle='#555';ctx.font='10px sans-serif';
  ctx.fillText('&#177;5 cents 이내 = 3점 | &#177;15 cents 이내 = 1점',w/2,205);
  ctx.fillText('[듣기]로 목표 음을 확인 | 좌우 버튼으로 미세 조정',w/2,222);
  var waveY=245,waveH=50;
  ctx.strokeStyle=diff<=5?'#22c55e88':diff<=15?'#eab30888':'#ef444488';
  ctx.lineWidth=1.5;ctx.beginPath();
  for(var px=20;px<w-20;px++){
    var freq=4+diff*0.3;
    var y=waveY+Math.sin(px*0.05*freq)*waveH*0.4;
    if(px===20)ctx.moveTo(px,y);else ctx.lineTo(px,y);
  }
  ctx.stroke();
  ctx.textAlign='start';
}

// ================ 4. HAND INDEPENDENCE DRILL ================
var HAND_DRILLS = [
  {name:'유니슨 스케일',left:['C3','D3','E3','F3','G3'],right:['C4','D4','E4','F4','G4'],diff:'초급',desc:'양손 동시 동일 음 연주'},
  {name:'반진행 스케일',left:['G3','F3','E3','D3','C3'],right:['C4','D4','E4','F4','G4'],diff:'초급',desc:'양손이 반대 방향으로 이동'},
  {name:'3도 병행',left:['C3','D3','E3','F3','G3'],right:['E4','F4','G4','A4','B4'],diff:'중급',desc:'양손이 3도 간격 유지'},
  {name:'6도 병행',left:['C3','D3','E3','F3','G3'],right:['A4','B4','C5','D5','E5'],diff:'중급',desc:'양손이 6도 간격 유지'},
  {name:'왼손 반주 패턴',left:['C3','G3','C3','G3','C3','G3'],right:['E4','E4','G4','G4','C5','C5'],diff:'중급',desc:'왼손 알베르티 + 오른손 멜로디'},
  {name:'폴리리듬 2:3',left:['C3','G3'],right:['C4','E4','G4'],diff:'고급',desc:'왼손 2박 vs 오른손 3박'},
  {name:'왼손 아르페지오',left:['C3','E3','G3','C3','E3','G3'],right:['C5','B4','A4','G4','F4','E4'],diff:'고급',desc:'왼손 분산화음 + 오른손 하행'},
  {name:'독립 크로매틱',left:['C3','C#4','D3','D#4'],right:['G4','F#4','F4','E4'],diff:'전문가',desc:'양손 완전 독립 반음계 이동'}
];
var drillIdx=0, drillStep=0, drillActive=false, drillHand='both';

function buildHandDrillUI(){
  makeV15Modal('handdrill-modal','🤲 양손 독립 패턴 드릴',function(inner){
    var area=document.createElement('div');area.id='handdrill-area';
    area.innerHTML='<canvas id="handdrill-canvas" width="460" height="280" style="width:100%;max-width:460px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px;cursor:pointer"></canvas>'+
      '<div id="handdrill-list" style="display:flex;flex-direction:column;gap:6px"></div>';
    inner.appendChild(area);
    setTimeout(function(){renderHandDrillList();drawHandDrillCanvas();setupHandDrillCanvas();},0);
  });
}

function renderHandDrillList(){
  var el=document.getElementById('handdrill-list');if(!el)return;
  var completed=ls15Get('drillCompleted',{});
  el.innerHTML=HAND_DRILLS.map(function(d,i){
    var dc=d.diff==='초급'?'#22c55e':d.diff==='중급'?'#eab308':d.diff==='고급'?'#f97316':'#ef4444';
    return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" data-didx="'+i+'">'+
      '<span style="font-size:10px;color:'+dc+';font-weight:700;min-width:40px">'+d.diff+'</span>'+
      '<div style="flex:1"><div style="font-size:12px;font-weight:600">'+d.name+'</div><div style="font-size:9px;color:var(--text2)">'+d.desc+'</div></div>'+
      '<span style="font-size:9px;color:var(--green)">'+(completed[i]?completed[i]+'회':'')+'</span></div>';
  }).join('');
  el.querySelectorAll('[data-didx]').forEach(function(d){
    d.addEventListener('click',function(){drillIdx=parseInt(d.getAttribute('data-didx'));drillStep=0;drillActive=true;drillHand='both';drawHandDrillCanvas();});
  });
}

function setupHandDrillCanvas(){
  var cv=document.getElementById('handdrill-canvas');if(!cv)return;
  cv.addEventListener('click',function(){
    if(!drillActive)return;
    var dr=HAND_DRILLS[drillIdx];
    var maxSteps=Math.max(dr.left.length,dr.right.length);
    if(drillStep<dr.left.length) playNote15(dr.left[drillStep],0.3);
    if(drillStep<dr.right.length) playNote15(dr.right[drillStep],0.3);
    playSFX15('hand_drill');
    drillStep++;
    if(drillStep>=maxSteps){
      drillActive=false;
      var completed=ls15Get('drillCompleted',{});
      completed[drillIdx]=(completed[drillIdx]||0)+1;
      ls15Set('drillCompleted',completed);
      renderHandDrillList();
    }
    drawHandDrillCanvas();
  });
}

function drawHandDrillCanvas(){
  var cv=document.getElementById('handdrill-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var dr=HAND_DRILLS[drillIdx];
  ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(dr.name,w/2,22);
  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
  ctx.fillText(dr.desc,w/2,38);
  ctx.fillStyle='#3b82f6';ctx.font='bold 11px sans-serif';
  ctx.fillText('왼손 (L)',100,60);
  ctx.fillStyle='#ef4444';
  ctx.fillText('오른손 (R)',w-100,60);
  var maxN=Math.max(dr.left.length,dr.right.length);
  var rowH=Math.min(28,Math.floor((h-80)/maxN));
  for(var i=0;i<maxN;i++){
    var y=75+i*rowH;
    var isCurr=i===drillStep&&drillActive;
    var isDone=i<drillStep;
    if(i<dr.left.length){
      ctx.fillStyle=isCurr?'#3b82f6':isDone?'#22c55e55':'#222';
      ctx.fillRect(30,y,w/2-50,rowH-4);
      ctx.fillStyle=isCurr?'#fff':isDone?'#22c55e':'#888';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText(dr.left[i],30+(w/2-50)/2,y+rowH/2+1);
    }
    if(i<dr.right.length){
      ctx.fillStyle=isCurr?'#ef4444':isDone?'#22c55e55':'#222';
      ctx.fillRect(w/2+20,y,w/2-50,rowH-4);
      ctx.fillStyle=isCurr?'#fff':isDone?'#22c55e':'#888';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText(dr.right[i],w/2+20+(w/2-50)/2,y+rowH/2+1);
    }
  }
  if(!drillActive&&drillStep>=maxN){
    ctx.fillStyle='#22c55e';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('&#10003; 완료! 목록에서 다른 드릴을 선택하세요',w/2,h-16);
  }else if(drillActive){
    ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
    ctx.fillText('클릭하여 다음 단계로 진행 ('+drillStep+'/'+maxN+')',w/2,h-16);
  }
  ctx.textAlign='start';
}

// ================ 5. EXPRESSION MARKS DICTIONARY ================
var EXPR_MARKS = [
  {symbol:'pp',name:'피아니시모',cat:'강약',desc:'매우 여리게 연주. 속삭이듯 섬세하게.',example:'녹턴, 자장가에서 자주 사용'},
  {symbol:'p',name:'피아노',cat:'강약',desc:'여리게 연주. 부드럽고 조용하게.',example:'서정적인 구절에서 기본 다이나믹'},
  {symbol:'mp',name:'메조피아노',cat:'강약',desc:'조금 여리게. 중간보다 약간 작은 소리.',example:'일반적인 반주 볼륨으로 적합'},
  {symbol:'mf',name:'메조포르테',cat:'강약',desc:'조금 세게. 중간보다 약간 큰 소리.',example:'멜로디 라인의 기본 다이나믹'},
  {symbol:'f',name:'포르테',cat:'강약',desc:'세게 연주. 힘차고 확신있게.',example:'클라이맥스 직전이나 강조 부분'},
  {symbol:'ff',name:'포르티시모',cat:'강약',desc:'매우 세게 연주. 최대의 음량으로.',example:'곡의 클라이맥스에서 사용'},
  {symbol:'cresc.',name:'크레센도',cat:'변화',desc:'점점 세게. 음량을 서서히 높여간다.',example:'긴장감을 고조시킬 때'},
  {symbol:'dim.',name:'디미누엔도',cat:'변화',desc:'점점 여리게. 음량을 서서히 줄여간다.',example:'곡의 마무리나 페이드아웃'},
  {symbol:'rit.',name:'리타르단도',cat:'속도',desc:'점점 느리게. 템포를 서서히 줄인다.',example:'프레이즈 끝이나 곡의 종결부'},
  {symbol:'accel.',name:'아첼레란도',cat:'속도',desc:'점점 빠르게. 템포를 서서히 올린다.',example:'흥분이나 긴박감을 표현할 때'},
  {symbol:'legato',name:'레가토',cat:'주법',desc:'음과 음을 끊지 않고 매끄럽게 연결.',example:'서정적 멜로디의 기본 주법'},
  {symbol:'staccato',name:'스타카토',cat:'주법',desc:'음을 짧게 끊어서 연주. 점(.)으로 표시.',example:'경쾌하고 리듬감 있는 패시지'}
];

function buildExprDictUI(){
  makeV15Modal('expr-modal','📖 악상 기호 사전',function(inner){
    var area=document.createElement('div');area.id='expr-area';
    var cats=['강약','변화','속도','주법'];
    var html='';
    cats.forEach(function(cat){
      html+='<div style="margin-bottom:12px"><div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid var(--border)">'+cat+'</div>';
      EXPR_MARKS.filter(function(m){return m.cat===cat;}).forEach(function(m){
        html+='<div style="padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);margin-bottom:6px">'+
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">'+
          '<span style="font-size:18px;font-weight:700;font-style:italic;color:var(--accent);min-width:60px;text-align:center">'+m.symbol+'</span>'+
          '<div><div style="font-size:13px;font-weight:600">'+m.name+'</div></div></div>'+
          '<div style="font-size:11px;color:var(--text);margin-bottom:3px">'+m.desc+'</div>'+
          '<div style="font-size:9px;color:var(--text2)">&#128161; 예시: '+m.example+'</div></div>';
      });
      html+='</div>';
    });
    area.innerHTML=html;
    inner.appendChild(area);
    playSFX15('expr_open');
    ls15Set('exprViewed',true);
  });
}

// ================ 6. DAILY WARMUP ROUTINE ================
var WARMUP_STEPS = [
  {name:'손목 스트레칭',dur:30,desc:'양손을 번갈아 앞뒤로 부드럽게 젖히기',icon:'🤚'},
  {name:'손가락 벌리기',dur:20,desc:'각 손가락을 최대한 벌렸다 오므리기 5회',icon:'✋'},
  {name:'C Major 스케일',dur:30,desc:'천천히 정확하게 C Major 스케일 양손 연주',icon:'🎹'},
  {name:'아르페지오 워밍업',dur:30,desc:'C-E-G-C 아르페지오를 양손으로 느리게',icon:'🎶'},
  {name:'하논 1번 느리게',dur:40,desc:'하논 교본 1번을 BPM 60으로 천천히',icon:'📖'},
  {name:'코드 스트레칭',dur:25,desc:'C, G, F, Am 코드를 번갈아 누르며 손 풀기',icon:'🎵'},
  {name:'트릴 연습',dur:20,desc:'E-F 트릴을 각 손으로 20초씩',icon:'⚡'},
  {name:'심호흡 & 집중',dur:15,desc:'눈을 감고 3번 깊은 숨을 쉬며 집중력 준비',icon:'🧘'}
];
var warmupStep=0, warmupActive=false, warmupTimer=null, warmupRemain=0;

function buildWarmupUI(){
  makeV15Modal('warmup-modal','🌅 일일 워밍업 루틴',function(inner){
    var area=document.createElement('div');area.id='warmup-area';
    area.innerHTML='<canvas id="warmup-canvas" width="420" height="300" style="width:100%;max-width:420px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center">'+
      '<button id="warmup-start" style="padding:6px 16px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">&#9654; 시작</button>'+
      '<button id="warmup-skip" style="padding:6px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#9193; 건너뛰기</button>'+
      '<button id="warmup-reset" style="padding:6px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#8635; 처음부터</button></div>';
    inner.appendChild(area);
    setTimeout(function(){
      drawWarmupCanvas();
      document.getElementById('warmup-start').addEventListener('click',startWarmupStep);
      document.getElementById('warmup-skip').addEventListener('click',skipWarmupStep);
      document.getElementById('warmup-reset').addEventListener('click',function(){warmupStep=0;warmupActive=false;if(warmupTimer)clearInterval(warmupTimer);drawWarmupCanvas();});
    },0);
  });
}

function startWarmupStep(){
  if(warmupStep>=WARMUP_STEPS.length)return;
  warmupActive=true;
  warmupRemain=WARMUP_STEPS[warmupStep].dur;
  if(warmupTimer)clearInterval(warmupTimer);
  warmupTimer=setInterval(function(){
    warmupRemain--;
    playSFX15('warmup_tick');
    drawWarmupCanvas();
    if(warmupRemain<=0){
      clearInterval(warmupTimer);warmupTimer=null;
      warmupActive=false;warmupStep++;
      playSFX15('warmup_done');
      if(warmupStep>=WARMUP_STEPS.length){
        ls15Set('warmupDone',(ls15Get('warmupDone',0))+1);
      }
      drawWarmupCanvas();
    }
  },1000);
  drawWarmupCanvas();
}

function skipWarmupStep(){
  if(warmupTimer)clearInterval(warmupTimer);warmupTimer=null;
  warmupActive=false;warmupStep++;
  if(warmupStep>=WARMUP_STEPS.length){ls15Set('warmupDone',(ls15Get('warmupDone',0))+1);}
  drawWarmupCanvas();
}

function drawWarmupCanvas(){
  var cv=document.getElementById('warmup-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  if(warmupStep>=WARMUP_STEPS.length){
    ctx.fillText('&#10003; 워밍업 루틴 완료!',w/2,60);
    ctx.fillStyle='#22c55e';ctx.font='bold 36px sans-serif';
    ctx.fillText('&#128079;',w/2,120);
    ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
    ctx.fillText('총 '+ls15Get('warmupDone',0)+'회 완료',w/2,160);
    ctx.fillText('이제 연주 준비가 되었어요!',w/2,180);
    ctx.textAlign='start';return;
  }
  var step=WARMUP_STEPS[warmupStep];
  ctx.fillText('워밍업 단계 '+(warmupStep+1)+'/'+WARMUP_STEPS.length,w/2,24);
  var progW=w-60;
  ctx.fillStyle='#222';ctx.fillRect(30,34,progW,6);
  ctx.fillStyle='#4a7dff';ctx.fillRect(30,34,Math.floor(progW*(warmupStep/WARMUP_STEPS.length)),6);
  ctx.fillStyle='#e8ecf4';ctx.font='32px sans-serif';
  ctx.fillText(step.icon,w/2,80);
  ctx.font='bold 16px sans-serif';ctx.fillStyle='var(--accent)';
  ctx.fillText(step.name,w/2,110);
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
  ctx.fillText(step.desc,w/2,130);
  if(warmupActive){
    var cx=w/2,cy=190,r=40;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(1-warmupRemain/step.dur)*Math.PI*2);
    ctx.strokeStyle='#4a7dff';ctx.lineWidth=4;ctx.stroke();
    ctx.fillStyle='#e8ecf4';ctx.font='bold 24px sans-serif';
    ctx.fillText(String(warmupRemain),cx,cy+8);
    ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
    ctx.fillText('초',cx,cy+22);
  }else{
    ctx.fillStyle='#555';ctx.font='11px sans-serif';
    ctx.fillText('[시작] 버튼을 눌러 '+step.dur+'초 타이머를 시작하세요',w/2,190);
  }
  ctx.fillStyle='#333';ctx.font='9px sans-serif';
  var upcomingY=250;
  for(var i=warmupStep+1;i<Math.min(warmupStep+3,WARMUP_STEPS.length);i++){
    ctx.fillText('다음: '+WARMUP_STEPS[i].icon+' '+WARMUP_STEPS[i].name+' ('+WARMUP_STEPS[i].dur+'초)',w/2,upcomingY);
    upcomingY+=14;
  }
  ctx.textAlign='start';
}

// ================ 7. MELODIC DICTATION ================
var DICT_LEVELS = [
  {name:'초급 (4음)',noteCount:4,pool:['C4','D4','E4','F4','G4']},
  {name:'중급 (6음)',noteCount:6,pool:['C4','D4','E4','F4','G4','A4','B4']},
  {name:'고급 (8음)',noteCount:8,pool:['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5']}
];
var dictLevel=0, dictMelody=[], dictAnswer=[], dictPhase='ready', dictScore=0, dictRound=0, dictMaxRound=5;

function buildDictationUI(){
  makeV15Modal('dictation-modal','🎼 멜로디 받아쓰기',function(inner){
    var area=document.createElement('div');area.id='dictation-area';
    area.innerHTML='<div style="display:flex;gap:6px;margin-bottom:10px;justify-content:center" id="dict-level-btns"></div>'+
      '<canvas id="dict-canvas" width="460" height="280" style="width:100%;max-width:460px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap" id="dict-controls"></div>'+
      '<div id="dict-note-btns" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:8px"></div>';
    inner.appendChild(area);
    setTimeout(function(){buildDictControls();startDictation();},0);
  });
}

function buildDictControls(){
  var lb=document.getElementById('dict-level-btns');if(!lb)return;
  lb.innerHTML=DICT_LEVELS.map(function(l,i){
    return '<button data-dl="'+i+'" style="padding:4px 10px;border-radius:6px;border:1px solid '+(i===dictLevel?'var(--accent)':'var(--border)')+';background:'+(i===dictLevel?'var(--accent)':'var(--surface2)')+';color:'+(i===dictLevel?'white':'var(--text)')+';font-size:11px;cursor:pointer">'+l.name+'</button>';
  }).join('');
  lb.querySelectorAll('[data-dl]').forEach(function(b){
    b.addEventListener('click',function(){dictLevel=parseInt(b.getAttribute('data-dl'));buildDictControls();startDictation();});
  });
  var ctrl=document.getElementById('dict-controls');if(!ctrl)return;
  ctrl.innerHTML='<button id="dict-play" style="padding:6px 14px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">&#128266; 다시 듣기</button>'+
    '<button id="dict-submit" style="padding:6px 14px;border-radius:8px;border:1px solid var(--green);background:rgba(34,197,94,0.15);color:var(--green);font-size:12px;cursor:pointer">&#10003; 제출</button>'+
    '<button id="dict-clear" style="padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#10060; 지우기</button>';
  document.getElementById('dict-play').addEventListener('click',playDictMelody);
  document.getElementById('dict-submit').addEventListener('click',submitDictation);
  document.getElementById('dict-clear').addEventListener('click',function(){dictAnswer=[];drawDictCanvas();});
  var nb=document.getElementById('dict-note-btns');if(!nb)return;
  var pool=DICT_LEVELS[dictLevel].pool;
  nb.innerHTML=pool.map(function(n){
    return '<button data-dn="'+n+'" style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;min-width:36px">'+n.replace(/[0-9]/g,'')+'</button>';
  }).join('');
  nb.querySelectorAll('[data-dn]').forEach(function(b){
    b.addEventListener('click',function(){
      var note=b.getAttribute('data-dn');
      if(dictPhase==='input'&&dictAnswer.length<DICT_LEVELS[dictLevel].noteCount){
        dictAnswer.push(note);playNote15(note,0.3);drawDictCanvas();
      }
    });
  });
}

function startDictation(){
  dictRound=0;dictScore=0;generateDictMelody();
}

function generateDictMelody(){
  var lv=DICT_LEVELS[dictLevel];
  dictMelody=[];dictAnswer=[];dictPhase='listen';
  for(var i=0;i<lv.noteCount;i++){
    dictMelody.push(lv.pool[Math.floor(Math.random()*lv.pool.length)]);
  }
  drawDictCanvas();
  setTimeout(playDictMelody,500);
}

function playDictMelody(){
  playSFX15('dictation_play');
  var i=0;
  function pn(){
    if(i>=dictMelody.length){dictPhase='input';drawDictCanvas();return;}
    playNote15(dictMelody[i],0.35);i++;
    setTimeout(pn,450);
  }
  pn();
}

function submitDictation(){
  if(dictPhase!=='input')return;
  var correct=0;
  for(var i=0;i<dictMelody.length;i++){
    if(dictAnswer[i]===dictMelody[i]) correct++;
  }
  dictScore+=correct;
  dictPhase='result';
  drawDictCanvas();
  dictRound++;
  ls15Set('dictTotal',(ls15Get('dictTotal',0))+1);
  ls15Set('dictBestScore',Math.max(ls15Get('dictBestScore',0),dictScore));
  if(dictRound<dictMaxRound){
    setTimeout(function(){generateDictMelody();},2000);
  }
}

function drawDictCanvas(){
  var cv=document.getElementById('dict-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var lv=DICT_LEVELS[dictLevel];
  ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  ctx.fillText('멜로디 받아쓰기 | '+lv.name+' | 라운드 '+(Math.min(dictRound+1,dictMaxRound))+'/'+dictMaxRound+' | 점수: '+dictScore,w/2,22);
  if(dictRound>=dictMaxRound&&dictPhase==='result'){
    var maxScore=dictMaxRound*lv.noteCount;
    var pct=dictScore/maxScore;
    var grade=pct>=0.9?'S':pct>=0.75?'A':pct>=0.6?'B':pct>=0.4?'C':'D';
    var gc=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#f97316':'#ef4444';
    ctx.fillStyle=gc;ctx.font='bold 40px sans-serif';
    ctx.fillText(grade,w/2,90);
    ctx.fillStyle='#e8ecf4';ctx.font='14px sans-serif';
    ctx.fillText('최종 점수: '+dictScore+'/'+maxScore,w/2,120);
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
    ctx.fillText('최고 기록: '+ls15Get('dictBestScore',0)+'점',w/2,142);
    ctx.textAlign='start';return;
  }
  var staffY=50, staffH=80;
  ctx.strokeStyle='#333';ctx.lineWidth=1;
  for(var li=0;li<5;li++){
    var ly=staffY+li*(staffH/4);
    ctx.beginPath();ctx.moveTo(30,ly);ctx.lineTo(w-30,ly);ctx.stroke();
  }
  var nn=lv.noteCount;
  var gap=Math.floor((w-80)/nn);
  if(dictPhase==='listen'){
    ctx.fillStyle='#4a7dff';ctx.font='12px sans-serif';
    ctx.fillText('&#128266; 멜로디를 듣고 기억하세요...',w/2,staffY+staffH+30);
    for(var i=0;i<nn;i++){
      ctx.fillStyle='#33344488';ctx.beginPath();
      ctx.arc(50+i*gap+gap/2,staffY+staffH/2,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#555';ctx.font='10px sans-serif';
      ctx.fillText('?',50+i*gap+gap/2,staffY+staffH/2+4);
    }
  }else if(dictPhase==='input'){
    ctx.fillStyle='#eab308';ctx.font='12px sans-serif';
    ctx.fillText('아래 버튼으로 들은 음을 순서대로 입력하세요 ('+dictAnswer.length+'/'+nn+')',w/2,staffY+staffH+30);
    for(var i=0;i<nn;i++){
      var hasAns=i<dictAnswer.length;
      ctx.fillStyle=hasAns?'#4a7dff':'#33344488';ctx.beginPath();
      ctx.arc(50+i*gap+gap/2,staffY+staffH/2,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=hasAns?'#fff':'#555';ctx.font=hasAns?'bold 10px sans-serif':'10px sans-serif';
      ctx.fillText(hasAns?dictAnswer[i].replace(/[0-9]/g,''):'?',50+i*gap+gap/2,staffY+staffH/2+4);
    }
  }else if(dictPhase==='result'){
    for(var i=0;i<nn;i++){
      var isCorrect=dictAnswer[i]===dictMelody[i];
      ctx.fillStyle=isCorrect?'#22c55e':'#ef4444';ctx.beginPath();
      ctx.arc(50+i*gap+gap/2,staffY+staffH/2-12,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
      ctx.fillText(dictAnswer[i]?dictAnswer[i].replace(/[0-9]/g,''):'_',50+i*gap+gap/2,staffY+staffH/2-8);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText(dictMelody[i].replace(/[0-9]/g,''),50+i*gap+gap/2,staffY+staffH/2+12);
    }
    var correct=0;for(var i=0;i<nn;i++){if(dictAnswer[i]===dictMelody[i])correct++;}
    ctx.fillStyle=correct===nn?'#22c55e':'#eab308';ctx.font='13px sans-serif';
    ctx.fillText(correct+'/'+nn+' 정답!'+(dictRound<dictMaxRound-1?' 다음 라운드 준비 중...':''),w/2,staffY+staffH+30);
  }
  ctx.textAlign='start';
}

// ================ 8. SHARE CARD GENERATOR ================
function buildShareCardUI(){
  makeV15Modal('sharecard-modal','📸 연주 공유카드',function(inner){
    var area=document.createElement('div');area.id='sharecard-area';
    area.innerHTML='<canvas id="sharecard-canvas" width="600" height="380" style="width:100%;max-width:600px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center">'+
      '<button id="sharecard-gen" style="padding:6px 16px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">&#127912; 카드 생성</button>'+
      '<button id="sharecard-dl" style="padding:6px 16px;border-radius:8px;border:1px solid var(--green);background:rgba(34,197,94,0.15);color:var(--green);font-size:12px;cursor:pointer">&#128190; PNG 저장</button></div>';
    inner.appendChild(area);
    setTimeout(function(){
      generateShareCard();
      document.getElementById('sharecard-gen').addEventListener('click',generateShareCard);
      document.getElementById('sharecard-dl').addEventListener('click',downloadShareCard);
    },0);
  });
}

function generateShareCard(){
  var cv=document.getElementById('sharecard-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');var w=cv.width,h=cv.height;
  var grad=ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#0a0e2a');grad.addColorStop(0.5,'#141838');grad.addColorStop(1,'#1a1040');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#4a7dff33';ctx.lineWidth=1;
  for(var i=0;i<8;i++){
    ctx.beginPath();ctx.arc(w*0.8,h*0.3,50+i*30,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';ctx.textAlign='left';
  ctx.fillText('Piano Master',24,40);
  ctx.fillStyle='#4a7dff';ctx.font='11px sans-serif';
  ctx.fillText('v15 Performance Card',24,58);
  var s=window.app?window.app.stats:{};
  var totalPlays=s.totalPlays||0;
  var avgScore=totalPlays>0?Math.round((s.totalScore||0)/totalPlays):0;
  var completedCount=s.songsCompleted?s.songsCompleted.size:0;
  var perfectCount=s.perfectSongs?s.perfectSongs.size:0;
  var maxCombo=s.maxCombo||0;
  var streak=s.streak||0;
  var stats=[
    {label:'총 연주',value:totalPlays+'회',color:'#4a7dff'},
    {label:'평균 점수',value:avgScore+'점',color:'#22c55e'},
    {label:'완주곡',value:completedCount+'곡',color:'#eab308'},
    {label:'퍼펙트',value:perfectCount+'곡',color:'#a855f7'},
    {label:'최대 콤보',value:maxCombo+'x',color:'#ef4444'},
    {label:'연속 스트릭',value:streak+'일',color:'#06b6d4'}
  ];
  var colW=Math.floor((w-60)/3);
  stats.forEach(function(st,i){
    var col=i%3, row=Math.floor(i/3);
    var sx=24+col*colW, sy=80+row*100;
    ctx.fillStyle=st.color+'22';
    ctx.beginPath();
    var rr=8;var rw=colW-12;var rh=80;
    ctx.moveTo(sx+rr,sy);ctx.lineTo(sx+rw-rr,sy);ctx.quadraticCurveTo(sx+rw,sy,sx+rw,sy+rr);
    ctx.lineTo(sx+rw,sy+rh-rr);ctx.quadraticCurveTo(sx+rw,sy+rh,sx+rw-rr,sy+rh);
    ctx.lineTo(sx+rr,sy+rh);ctx.quadraticCurveTo(sx,sy+rh,sx,sy+rh-rr);
    ctx.lineTo(sx,sy+rr);ctx.quadraticCurveTo(sx,sy,sx+rr,sy);ctx.fill();
    ctx.strokeStyle=st.color+'44';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=st.color;ctx.font='bold 28px sans-serif';ctx.textAlign='center';
    ctx.fillText(st.value,sx+rw/2,sy+40);
    ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
    ctx.fillText(st.label,sx+rw/2,sy+60);
  });
  var grade=avgScore>=95?'S':avgScore>=85?'A':avgScore>=70?'B':avgScore>=50?'C':'D';
  var gc=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#f97316':'#ef4444';
  ctx.fillStyle=gc;ctx.font='bold 48px sans-serif';ctx.textAlign='right';
  ctx.fillText(grade,w-30,50);
  ctx.fillStyle='#333';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText('Piano Master v15 | https://bsy522-dot.github.io/piano/',w/2,h-12);
  ctx.textAlign='start';
  playSFX15('share_snap');
  ls15Set('shareGenerated',(ls15Get('shareGenerated',0))+1);
}

function downloadShareCard(){
  var cv=document.getElementById('sharecard-canvas');if(!cv)return;
  var link=document.createElement('a');
  link.download='piano-master-card.png';
  link.href=cv.toDataURL('image/png');
  link.click();
}

// ================ 9. ADD 10 SONGS (112→122) ================
function addV15Songs(){
  if(!window.SONGS) return;
  var existing=window.SONGS.map(function(s){return s.id;});
  var newSongs=[
    {id:'v15_nocturne_op48',name:'녹턴 Op.48-1',category:'클래식',difficulty:'expert',icon:'🌙',color:'#6366f1',
      notes:[{note:60,time:0,dur:800},{note:64,time:800,dur:800},{note:67,time:1600,dur:800},{note:72,time:2400,dur:1200},{note:67,time:3600,dur:600},{note:64,time:4200,dur:600},{note:60,time:4800,dur:1000},{note:65,time:5800,dur:800},{note:69,time:6600,dur:800},{note:72,time:7400,dur:1200},{note:71,time:8600,dur:600},{note:67,time:9200,dur:600},{note:64,time:9800,dur:1000}]},
    {id:'v15_fur_elise_full',name:'엘리제를 위하여 (확장)',category:'클래식',difficulty:'hard',icon:'💌',color:'#ec4899',
      notes:[{note:76,time:0,dur:300},{note:75,time:300,dur:300},{note:76,time:600,dur:300},{note:75,time:900,dur:300},{note:76,time:1200,dur:300},{note:71,time:1500,dur:300},{note:74,time:1800,dur:300},{note:72,time:2100,dur:300},{note:69,time:2400,dur:600},{note:60,time:3000,dur:300},{note:64,time:3300,dur:300},{note:69,time:3600,dur:300},{note:71,time:3900,dur:600},{note:64,time:4500,dur:300},{note:68,time:4800,dur:300},{note:71,time:5100,dur:300},{note:72,time:5400,dur:600}]},
    {id:'v15_turkish_march',name:'터키 행진곡',category:'클래식',difficulty:'hard',icon:'🎖️',color:'#f59e0b',
      notes:[{note:71,time:0,dur:200},{note:69,time:200,dur:200},{note:68,time:400,dur:200},{note:69,time:600,dur:200},{note:72,time:800,dur:400},{note:74,time:1200,dur:200},{note:72,time:1400,dur:200},{note:71,time:1600,dur:200},{note:72,time:1800,dur:200},{note:76,time:2000,dur:400},{note:77,time:2400,dur:200},{note:76,time:2600,dur:200},{note:74,time:2800,dur:200},{note:76,time:3000,dur:200},{note:81,time:3200,dur:400}]},
    {id:'v15_raindrop',name:'빗방울 전주곡',category:'클래식',difficulty:'medium',icon:'🌧️',color:'#0ea5e9',
      notes:[{note:65,time:0,dur:500},{note:68,time:500,dur:500},{note:65,time:1000,dur:500},{note:63,time:1500,dur:500},{note:61,time:2000,dur:500},{note:63,time:2500,dur:500},{note:65,time:3000,dur:500},{note:68,time:3500,dur:500},{note:73,time:4000,dur:1000},{note:72,time:5000,dur:500},{note:68,time:5500,dur:500},{note:65,time:6000,dur:1000}]},
    {id:'v15_moonriver',name:'Moon River',category:'팝/영화',difficulty:'easy',icon:'🌊',color:'#14b8a6',
      notes:[{note:60,time:0,dur:800},{note:67,time:800,dur:1200},{note:65,time:2000,dur:400},{note:64,time:2400,dur:400},{note:62,time:2800,dur:400},{note:64,time:3200,dur:1200},{note:60,time:4400,dur:800},{note:67,time:5200,dur:1200},{note:65,time:6400,dur:400},{note:64,time:6800,dur:400},{note:65,time:7200,dur:400},{note:67,time:7600,dur:1200}]},
    {id:'v15_entertainer',name:'The Entertainer',category:'클래식',difficulty:'medium',icon:'🎩',color:'#f97316',
      notes:[{note:62,time:0,dur:200},{note:64,time:200,dur:200},{note:66,time:400,dur:200},{note:69,time:600,dur:400},{note:66,time:1000,dur:200},{note:69,time:1200,dur:600},{note:74,time:1800,dur:200},{note:73,time:2000,dur:200},{note:74,time:2200,dur:200},{note:69,time:2400,dur:400},{note:62,time:2800,dur:200},{note:64,time:3000,dur:200},{note:66,time:3200,dur:200},{note:69,time:3400,dur:400},{note:66,time:3800,dur:200},{note:69,time:4000,dur:600}]},
    {id:'v15_gymnopedie2',name:'짐노페디 2번',category:'클래식',difficulty:'easy',icon:'☁️',color:'#8b5cf6',
      notes:[{note:71,time:0,dur:1000},{note:69,time:1000,dur:500},{note:67,time:1500,dur:1000},{note:64,time:2500,dur:500},{note:62,time:3000,dur:1000},{note:64,time:4000,dur:500},{note:67,time:4500,dur:1000},{note:69,time:5500,dur:500},{note:71,time:6000,dur:1500}]},
    {id:'v15_hisanabi',name:'히사이시 조 - Summer',category:'팝/영화',difficulty:'medium',icon:'🌻',color:'#84cc16',
      notes:[{note:64,time:0,dur:400},{note:67,time:400,dur:400},{note:71,time:800,dur:400},{note:72,time:1200,dur:600},{note:71,time:1800,dur:300},{note:67,time:2100,dur:300},{note:64,time:2400,dur:600},{note:67,time:3000,dur:400},{note:71,time:3400,dur:400},{note:72,time:3800,dur:600},{note:76,time:4400,dur:800},{note:74,time:5200,dur:400},{note:72,time:5600,dur:400},{note:71,time:6000,dur:800}]},
    {id:'v15_love_dream',name:'사랑의 꿈',category:'클래식',difficulty:'hard',icon:'💗',color:'#f43f5e',
      notes:[{note:65,time:0,dur:300},{note:69,time:300,dur:300},{note:72,time:600,dur:600},{note:77,time:1200,dur:600},{note:76,time:1800,dur:300},{note:74,time:2100,dur:300},{note:72,time:2400,dur:600},{note:69,time:3000,dur:300},{note:65,time:3300,dur:300},{note:72,time:3600,dur:600},{note:74,time:4200,dur:300},{note:72,time:4500,dur:300},{note:69,time:4800,dur:600},{note:65,time:5400,dur:800}]},
    {id:'v15_spring_waltz',name:'봄의 왈츠',category:'동요',difficulty:'easy',icon:'🌸',color:'#fb7185',
      notes:[{note:67,time:0,dur:400},{note:64,time:400,dur:400},{note:60,time:800,dur:400},{note:67,time:1200,dur:400},{note:64,time:1600,dur:400},{note:60,time:2000,dur:400},{note:69,time:2400,dur:600},{note:67,time:3000,dur:300},{note:65,time:3300,dur:300},{note:64,time:3600,dur:600},{note:62,time:4200,dur:400},{note:60,time:4600,dur:800}]}
  ];
  newSongs.forEach(function(s){
    if(existing.indexOf(s.id)===-1) window.SONGS.push(s);
  });
  if(window.app&&window.app.renderSongList) window.app.renderSongList();
}

// ================ 10. QUIZ v6 (+15 QUESTIONS: 75→90) ================
function buildQuizV6UI(){
  var QUIZ_V6 = [
    {q:'피아노의 이탈리아어 원래 이름은?',a:['피아노포르테','그라비쳄발로','클라비코드','하프시코드'],c:0},
    {q:'서스테인 페달(오른쪽 페달)의 역할은?',a:['음을 지속시킴','음을 부드럽게','특정 음만 지속','음량을 줄임'],c:0},
    {q:'BPM이란 무엇의 약자인가?',a:['Beats Per Minute','Bars Per Measure','Bass Per Mode','Beats Per Measure'],c:0},
    {q:'C Major와 같은 구성음을 가진 단조 스케일은?',a:['A Minor','D Minor','E Minor','G Minor'],c:0},
    {q:'피아노의 가장 낮은 음은?',a:['A0','C1','A1','C0'],c:0},
    {q:'크레센도(cresc.)의 의미는?',a:['점점 세게','점점 여리게','점점 빠르게','점점 느리게'],c:0},
    {q:'숏트 페달(우나 코르다)은 어느 쪽에 있는가?',a:['왼쪽','오른쪽','가운데','없음'],c:0},
    {q:'4분의 3박자에서 한 마디에 4분음표 몇 개?',a:['3개','4개','2개','6개'],c:0},
    {q:'피아노에서 가장 많이 사용되는 조표 없는 조는?',a:['C Major','G Major','F Major','D Major'],c:0},
    {q:'스타카토 기호는 어떤 모양인가?',a:['음표 위/아래 점','음표 위 선','음표 옆 호','음표 밑 물결'],c:0},
    {q:'피아노 협주곡에서 카덴차란?',a:['독주자의 즉흥 연주 부분','오케스트라만 연주하는 부분','끝나는 화음','빠른 패시지'],c:0},
    {q:'반음계(크로매틱 스케일)의 한 옥타브 음 수는?',a:['12개','7개','8개','5개'],c:0},
    {q:'ff(포르티시모)보다 더 센 다이나믹 기호는?',a:['fff','sf','fp','mf'],c:0},
    {q:'피아노를 발명한 사람으로 알려진 이는?',a:['바르톨로메오 크리스토포리','안토니오 스트라디바리','요한 세바스찬 바흐','테오발트 뵘'],c:0},
    {q:'소나타 형식의 3개 주요 부분은?',a:['제시부-발전부-재현부','서주-본론-결말','주제-변주-코다','A-B-A'],c:0}
  ];
  makeV15Modal('quiz6-modal','🧠 퀴즈 v6 (15문)',function(inner){
    var area=document.createElement('div');area.id='quiz6-area';
    var qIdx=0,qScore=0;
    function renderQ(){
      if(qIdx>=QUIZ_V6.length){
        var grade=qScore>=14?'S':qScore>=12?'A':qScore>=9?'B':qScore>=6?'C':'D';
        area.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:36px;font-weight:700;color:'+(grade==='S'?'#eab308':grade==='A'?'#22c55e':'#4a7dff')+'">'+grade+'</div><div style="font-size:14px;margin-top:8px">'+qScore+'/'+QUIZ_V6.length+' 정답</div><div style="font-size:11px;color:var(--text2);margin-top:4px">최고: '+Math.max(ls15Get('quiz6Best',0),qScore)+'</div></div>';
        ls15Set('quiz6Best',Math.max(ls15Get('quiz6Best',0),qScore));
        ls15Set('quiz6Done',(ls15Get('quiz6Done',0))+1);
        return;
      }
      var q=QUIZ_V6[qIdx];
      var shuffled=q.a.map(function(a,i){return {text:a,isCorrect:i===q.c};});
      for(var si=shuffled.length-1;si>0;si--){var sj=Math.floor(Math.random()*(si+1));var tmp=shuffled[si];shuffled[si]=shuffled[sj];shuffled[sj]=tmp;}
      area.innerHTML='<div style="margin-bottom:8px;font-size:10px;color:var(--text2)">'+(qIdx+1)+'/'+QUIZ_V6.length+' | 점수: '+qScore+'</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:12px">'+q.q+'</div>'+
        shuffled.map(function(o,i){return '<button class="q6opt" data-correct="'+o.isCorrect+'" style="display:block;width:100%;text-align:left;padding:10px;margin-bottom:6px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">'+o.text+'</button>';}).join('');
      area.querySelectorAll('.q6opt').forEach(function(btn){
        btn.addEventListener('click',function(){
          var correct=btn.getAttribute('data-correct')==='true';
          if(correct){qScore++;btn.style.borderColor='#22c55e';btn.style.background='rgba(34,197,94,0.15)';}
          else{btn.style.borderColor='#ef4444';btn.style.background='rgba(239,68,68,0.15)';
            area.querySelectorAll('.q6opt').forEach(function(b){if(b.getAttribute('data-correct')==='true'){b.style.borderColor='#22c55e';b.style.background='rgba(34,197,94,0.15)';}});}
          area.querySelectorAll('.q6opt').forEach(function(b){b.style.pointerEvents='none';});
          qIdx++;setTimeout(renderQ,1000);
        });
      });
    }
    inner.appendChild(area);
    setTimeout(renderQ,0);
  });
}

// ================ 11. ACHIEVEMENTS (+12: 108→120) ================
var V15_ACH = [
  {id:'improv_first',icon:'🎸',name:'첫 즉흥연주',desc:'즉흥연주 스튜디오에서 1회 연주',check:function(){var p=ls15Get('improvPlayed',{});for(var k in p){if(p[k]>0)return true;}return false;}},
  {id:'improv_all',icon:'🎷',name:'즉흥 마스터',desc:'6종 스케일 모두 연주',check:function(){var p=ls15Get('improvPlayed',{});var c=0;for(var k=0;k<6;k++){if(p[k]&&p[k]>0)c++;}return c>=6;}},
  {id:'listen_5',icon:'🎧',name:'음악 감상가',desc:'5곡 이상 감상 완료',check:function(){return (ls15Get('listenHeard',[])).length>=5;}},
  {id:'listen_all',icon:'🎶',name:'음악 박사',desc:'12곡 모두 감상',check:function(){return (ls15Get('listenHeard',[])).length>=12;}},
  {id:'tune_master',icon:'🔧',name:'조율 달인',desc:'조율 시뮬레이터에서 21점 이상',check:function(){return ls15Get('tuneBestScore',0)>=21;}},
  {id:'drill_3',icon:'🤲',name:'양손 훈련생',desc:'양손 드릴 3종 이상 완료',check:function(){var d=ls15Get('drillCompleted',{});var c=0;for(var k in d){if(d[k]>0)c++;}return c>=3;}},
  {id:'drill_all',icon:'🏋️',name:'양손 마스터',desc:'양손 드릴 8종 모두 완료',check:function(){var d=ls15Get('drillCompleted',{});var c=0;for(var k in d){if(d[k]>0)c++;}return c>=8;}},
  {id:'expr_read',icon:'📖',name:'표현 학습자',desc:'악상 기호 사전 열람',check:function(){return ls15Get('exprViewed',false);}},
  {id:'warmup_3',icon:'🌅',name:'워밍업 습관',desc:'워밍업 루틴 3회 완료',check:function(){return ls15Get('warmupDone',0)>=3;}},
  {id:'dict_10',icon:'🎼',name:'받아쓰기 훈련생',desc:'멜로디 받아쓰기 10라운드 수행',check:function(){return ls15Get('dictTotal',0)>=10;}},
  {id:'share_first',icon:'📸',name:'첫 공유카드',desc:'공유카드 1회 생성',check:function(){return ls15Get('shareGenerated',0)>=1;}},
  {id:'v15_explorer',icon:'🗺️',name:'v15 탐험가',desc:'v15의 8개 기능 모두 체험',check:function(){
    return ls15Get('exprViewed',false)&&ls15Get('warmupDone',0)>0&&ls15Get('shareGenerated',0)>0&&
      ls15Get('dictTotal',0)>0&&ls15Get('tuneBestScore',0)>0&&(ls15Get('listenHeard',[])).length>0&&
      (function(){var p=ls15Get('improvPlayed',{});for(var k in p){if(p[k]>0)return true;}return false;})()&&
      (function(){var d=ls15Get('drillCompleted',{});for(var k in d){if(d[k]>0)return true;}return false;})();
  }}
];

function checkV15Achievements(){
  var u=ls15Get('unlockedAch15',[]);
  V15_ACH.forEach(function(a){
    if(u.indexOf(a.id)===-1&&a.check()){
      u.push(a.id);ls15Set('unlockedAch15',u);
      if(window.app&&window.app.showToast) window.app.showToast('🏆 업적: '+a.icon+' '+a.name,'achievement');
      playSFX15('v15_achieve');
    }
  });
}

function injectV15Achievements(){
  var grid=document.querySelector('.achievement-grid');if(!grid)return;
  var u=ls15Get('unlockedAch15',[]);
  V15_ACH.forEach(function(a){
    var el=document.createElement('div');
    el.className='achievement'+(u.indexOf(a.id)!==-1?' unlocked':'');
    el.style.cssText='padding:8px;text-align:center;border-radius:8px;border:1px solid var(--border);background:var(--surface2)';
    el.innerHTML='<div class="achievement-icon">'+a.icon+'</div><div>'+a.name+'</div><div style="font-size:8px;margin-top:2px">'+a.desc+'</div>';
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTIONS & SHORTCUTS ================
function injectV15QuickActions(){
  var tabSongs=document.getElementById('tab-songs');if(!tabSongs)return;
  var bar=document.createElement('div');
  bar.className='v15-quick-actions';
  bar.style.cssText='display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  [
    {label:'🎸 즉흥',fn:function(){document.getElementById('improv-modal').style.display='flex';}},
    {label:'🎧 감상',fn:function(){document.getElementById('listen-modal').style.display='flex';}},
    {label:'🔧 조율',fn:function(){document.getElementById('tuning-modal').style.display='flex';}},
    {label:'🤲 양손',fn:function(){document.getElementById('handdrill-modal').style.display='flex';}},
    {label:'📖 기호',fn:function(){document.getElementById('expr-modal').style.display='flex';}},
    {label:'🌅 워밍업',fn:function(){document.getElementById('warmup-modal').style.display='flex';}},
    {label:'🎼 받아쓰기',fn:function(){document.getElementById('dictation-modal').style.display='flex';}},
    {label:'📸 카드',fn:function(){document.getElementById('sharecard-modal').style.display='flex';}},
    {label:'🧠 퀴즈v6',fn:function(){document.getElementById('quiz6-modal').style.display='flex';}}
  ].forEach(function(a){
    var btn=document.createElement('button');
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap';
    btn.textContent=a.label;btn.addEventListener('click',a.fn);bar.appendChild(btn);
  });
  var v14bar=tabSongs.querySelector('.v14-quick-actions');
  if(v14bar) v14bar.parentNode.insertBefore(bar, v14bar.nextSibling);
  else{var fb=tabSongs.querySelector('.filter-bar');if(fb) fb.parentNode.insertBefore(bar,fb);else tabSongs.insertBefore(bar,tabSongs.firstChild);}
}

function setupV15Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key){
      case 'I':e.preventDefault();document.getElementById('improv-modal').style.display='flex';break;
      case 'L':if(!e.ctrlKey){e.preventDefault();document.getElementById('listen-modal').style.display='flex';}break;
      case 'T':if(!e.ctrlKey){e.preventDefault();document.getElementById('tuning-modal').style.display='flex';}break;
      case 'D':e.preventDefault();document.getElementById('handdrill-modal').style.display='flex';break;
      case 'X':e.preventDefault();document.getElementById('expr-modal').style.display='flex';break;
      case 'W':if(!e.ctrlKey){e.preventDefault();document.getElementById('warmup-modal').style.display='flex';}break;
      case 'N':e.preventDefault();document.getElementById('dictation-modal').style.display='flex';break;
      case 'C':if(!e.ctrlKey){e.preventDefault();document.getElementById('sharecard-modal').style.display='flex';}break;
    }
  });
}

// ================ SCROLL NAV BAR ================
function injectV15NavBar(){
  var existing=document.querySelector('.v15-nav-bar');if(existing)return;
  var nav=document.createElement('div');
  nav.className='v15-nav-bar';
  nav.style.cssText='position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);display:flex;overflow-x:auto;z-index:150;padding:4px 8px;gap:4px';
  ['🎸 즉흥','🎧 감상','🔧 조율','🤲 양손','📖 기호','🌅 워밍업','🎼 받아쓰기','📸 카드','🧠 퀴즈v6'].forEach(function(label,i){
    var ids=['improv-modal','listen-modal','tuning-modal','handdrill-modal','expr-modal','warmup-modal','dictation-modal','sharecard-modal','quiz6-modal'];
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap;flex-shrink:0';
    btn.textContent=label;
    btn.addEventListener('click',function(){document.getElementById(ids[i]).style.display='flex';});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);
}

// ================ INIT ================
function initV15(){
  addV15Songs();
  buildImprovUI();
  buildListenUI();
  buildTuningUI();
  buildHandDrillUI();
  buildExprDictUI();
  buildWarmupUI();
  buildDictationUI();
  buildShareCardUI();
  buildQuizV6UI();
  injectV15QuickActions();
  injectV15Achievements();
  setupV15Shortcuts();
  injectV15NavBar();
  setInterval(checkV15Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV15,3000);});
else setTimeout(initV15,3000);
})();
