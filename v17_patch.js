// Piano Master v17 Patch Module
// Rhythm Tile Mini-game, Chord Ear Test, Key Coverage Heatmap,
// Weekly Growth Report, Difficulty Progression Map, Piano Olympiad,
// Performance Posture Clinic, Composer Style Analyzer
// 10 Songs (132→142), Quiz v8 15Q (105→120), 12 Achievements (132→144), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v17Loaded) return;
window.__v17Loaded = true;

var LS17 = 'piano-v17-';
function ls17Get(k,d){try{return JSON.parse(localStorage.getItem(LS17+k))||d}catch{return d}}
function ls17Set(k,v){localStorage.setItem(LS17+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v17 ================
var sfx17 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX17(type){
  if(!sfx17) return;
  if(sfx17.state==='suspended') sfx17.resume();
  var t=sfx17.currentTime, g=sfx17.createGain(), o=sfx17.createOscillator();
  g.connect(sfx17.destination); o.connect(g);
  switch(type){
    case 'tile_hit':
      o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1320,t+0.08);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'tile_miss':
      o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.linearRampToValueAtTime(110,t+0.2);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'chord_correct':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(784,t+0.12);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'chord_wrong':
      o.type='square';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(150,t+0.15);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'heatmap_view':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(660,t+0.15);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'report_gen':
      o.type='triangle';o.frequency.setValueAtTime(392,t);o.frequency.linearRampToValueAtTime(523,t+0.12);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'map_unlock':
      o.type='sine';o.frequency.setValueAtTime(659,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='sine';oo.frequency.setValueAtTime(880,sfx17.currentTime);gg.gain.setValueAtTime(0.08,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.15);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.15);},100);return;
    case 'olympiad_win':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(659,sfx17.currentTime);gg.gain.setValueAtTime(0.1,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.12);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.12);},100);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(784,sfx17.currentTime);gg.gain.setValueAtTime(0.1,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.2);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.2);},200);return;
    case 'olympiad_lose':
      o.type='sawtooth';o.frequency.setValueAtTime(330,t);o.frequency.linearRampToValueAtTime(165,t+0.3);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);break;
    case 'posture_tip':
      o.type='sine';o.frequency.setValueAtTime(587,t);o.frequency.linearRampToValueAtTime(440,t+0.12);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'style_match':
      o.type='triangle';o.frequency.setValueAtTime(349,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(523,sfx17.currentTime);gg.gain.setValueAtTime(0.06,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.15);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.15);},80);return;
    case 'v17_achieve':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(784,sfx17.currentTime);gg.gain.setValueAtTime(0.1,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.15);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.15);},100);
      setTimeout(function(){if(!sfx17)return;var gg=sfx17.createGain(),oo=sfx17.createOscillator();gg.connect(sfx17.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(1047,sfx17.currentTime);gg.gain.setValueAtTime(0.1,sfx17.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx17.currentTime+0.25);oo.start(sfx17.currentTime);oo.stop(sfx17.currentTime+0.25);},200);return;
  }
}

// ================ COMMON MODAL BUILDER ================
function makeV17Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:170;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,580px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px';
  var h=document.createElement('h3');
  h.style.cssText='font-size:15px;color:var(--accent,#4a7dff);margin:0';
  h.textContent=title;
  var cls=document.createElement('button');
  cls.style.cssText='background:none;border:none;color:var(--text2,#8892a8);font-size:20px;cursor:pointer;padding:0 4px';
  cls.innerHTML='&times;';
  cls.addEventListener('click',function(){modal.style.display='none';});
  hdr.appendChild(h);hdr.appendChild(cls);box.appendChild(hdr);
  var content=document.createElement('div');
  content.id=id+'-content';
  box.appendChild(content);modal.appendChild(box);
  modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  document.body.appendChild(modal);
  contentFn(content);
  return modal;
}

// ================ 10 NEW SONGS (132→142) ================
function addV17Songs(){
  if(!window.SONGS) return;
  var existing=window.SONGS.map(function(s){return s.name});
  var newSongs=[
    {name:'평균율 프렐류드 C장조',composer:'바흐',category:'클래식',difficulty:'medium',bpm:72,
     notes:[{note:'C4',time:0,dur:0.5},{note:'E4',time:0,dur:0.5},{note:'G4',time:0.13,dur:0.5},{note:'C5',time:0.25,dur:0.5},{note:'E5',time:0.38,dur:0.5},{note:'G4',time:0.5,dur:0.5},{note:'C5',time:0.5,dur:0.5},{note:'E5',time:0.63,dur:0.5},{note:'C4',time:0.75,dur:0.5},{note:'E4',time:0.75,dur:0.5},{note:'G4',time:0.88,dur:0.5},{note:'C5',time:1,dur:0.5},{note:'E5',time:1.13,dur:0.5},{note:'G4',time:1.25,dur:0.5},{note:'C5',time:1.25,dur:0.5},{note:'E5',time:1.38,dur:0.5},{note:'C4',time:1.5,dur:0.5},{note:'D4',time:1.5,dur:0.5},{note:'A4',time:1.63,dur:0.5},{note:'D5',time:1.75,dur:0.5},{note:'F5',time:1.88,dur:0.5},{note:'A4',time:2,dur:0.5},{note:'D5',time:2,dur:0.5},{note:'F5',time:2.13,dur:0.5},{note:'C4',time:2.25,dur:0.5},{note:'D4',time:2.25,dur:0.5},{note:'A4',time:2.38,dur:0.5},{note:'D5',time:2.5,dur:0.5},{note:'F5',time:2.63,dur:0.5},{note:'A4',time:2.75,dur:0.5},{note:'D5',time:2.75,dur:0.5},{note:'F5',time:2.88,dur:0.5},{note:'B3',time:3,dur:0.5},{note:'D4',time:3,dur:0.5},{note:'G4',time:3.13,dur:0.5},{note:'D5',time:3.25,dur:0.5},{note:'F5',time:3.38,dur:0.5},{note:'G4',time:3.5,dur:0.5},{note:'D5',time:3.5,dur:0.5},{note:'F5',time:3.63,dur:0.5}]},
    {name:'그노시엔느 1번',composer:'사티',category:'클래식',difficulty:'medium',bpm:60,
     notes:[{note:'F4',time:0,dur:0.8},{note:'E4',time:0.5,dur:0.6},{note:'D4',time:1,dur:0.6},{note:'E4',time:1.5,dur:0.6},{note:'B3',time:2,dur:1},{note:'D4',time:3,dur:0.8},{note:'C4',time:3.5,dur:0.6},{note:'B3',time:4,dur:0.6},{note:'C4',time:4.5,dur:0.6},{note:'A3',time:5,dur:1.5},{note:'F4',time:6.5,dur:0.8},{note:'E4',time:7,dur:0.6},{note:'D4',time:7.5,dur:0.6},{note:'E4',time:8,dur:0.6},{note:'B3',time:8.5,dur:1},{note:'D4',time:9.5,dur:0.8},{note:'C4',time:10,dur:0.6},{note:'B3',time:10.5,dur:0.6},{note:'A3',time:11,dur:1.5}]},
    {name:'아침의 기분',composer:'그리그',category:'클래식',difficulty:'medium',bpm:80,
     notes:[{note:'E4',time:0,dur:0.3},{note:'G4',time:0.25,dur:0.3},{note:'B4',time:0.5,dur:0.3},{note:'E5',time:0.75,dur:0.6},{note:'D5',time:1.25,dur:0.3},{note:'B4',time:1.5,dur:0.3},{note:'G4',time:1.75,dur:0.6},{note:'E4',time:2.25,dur:0.3},{note:'G4',time:2.5,dur:0.3},{note:'B4',time:2.75,dur:0.3},{note:'E5',time:3,dur:0.6},{note:'D5',time:3.5,dur:0.3},{note:'B4',time:3.75,dur:0.3},{note:'E4',time:4,dur:0.6},{note:'F#4',time:4.5,dur:0.3},{note:'A4',time:4.75,dur:0.3},{note:'C#5',time:5,dur:0.3},{note:'F#5',time:5.25,dur:0.6},{note:'E5',time:5.75,dur:0.3},{note:'C#5',time:6,dur:0.3},{note:'A4',time:6.25,dur:0.6}]},
    {name:'파반느',composer:'라벨',category:'클래식',difficulty:'hard',bpm:56,
     notes:[{note:'E5',time:0,dur:1},{note:'D5',time:1,dur:0.5},{note:'C5',time:1.5,dur:0.5},{note:'B4',time:2,dur:1},{note:'A4',time:3,dur:0.5},{note:'G4',time:3.5,dur:0.5},{note:'F4',time:4,dur:1},{note:'E4',time:5,dur:0.5},{note:'D4',time:5.5,dur:0.5},{note:'C4',time:6,dur:1.5},{note:'E4',time:7.5,dur:0.5},{note:'F4',time:8,dur:0.5},{note:'G4',time:8.5,dur:1},{note:'A4',time:9.5,dur:0.5},{note:'B4',time:10,dur:1},{note:'C5',time:11,dur:0.5},{note:'D5',time:11.5,dur:0.5},{note:'E5',time:12,dur:1.5}]},
    {name:'사계 - 6월 뱃노래',composer:'차이코프스키',category:'클래식',difficulty:'hard',bpm:66,
     notes:[{note:'G4',time:0,dur:0.8},{note:'B4',time:0.75,dur:0.4},{note:'D5',time:1.25,dur:0.8},{note:'C5',time:2,dur:0.4},{note:'B4',time:2.5,dur:0.8},{note:'A4',time:3.25,dur:0.4},{note:'G4',time:3.75,dur:0.8},{note:'F#4',time:4.5,dur:0.4},{note:'E4',time:5,dur:0.8},{note:'G4',time:5.75,dur:0.4},{note:'A4',time:6.25,dur:0.8},{note:'B4',time:7,dur:0.4},{note:'C5',time:7.5,dur:0.8},{note:'D5',time:8.25,dur:0.4},{note:'E5',time:8.75,dur:1},{note:'D5',time:9.75,dur:0.4},{note:'C5',time:10.25,dur:0.4},{note:'B4',time:10.75,dur:1}]},
    {name:'꿈꾸면서',composer:'포레',category:'클래식',difficulty:'medium',bpm:58,
     notes:[{note:'C5',time:0,dur:1},{note:'B4',time:1,dur:0.5},{note:'A4',time:1.5,dur:0.5},{note:'G4',time:2,dur:1},{note:'A4',time:3,dur:0.5},{note:'B4',time:3.5,dur:0.5},{note:'C5',time:4,dur:1.5},{note:'D5',time:5.5,dur:0.5},{note:'E5',time:6,dur:1},{note:'D5',time:7,dur:0.5},{note:'C5',time:7.5,dur:0.5},{note:'B4',time:8,dur:1},{note:'A4',time:9,dur:1},{note:'G4',time:10,dur:1.5}]},
    {name:'브람스 자장가',composer:'브람스',category:'동요',difficulty:'easy',bpm:54,
     notes:[{note:'E4',time:0,dur:0.5},{note:'E4',time:0.5,dur:0.5},{note:'G4',time:1,dur:1},{note:'E4',time:2,dur:0.5},{note:'E4',time:2.5,dur:0.5},{note:'G4',time:3,dur:1},{note:'E4',time:4,dur:0.5},{note:'G4',time:4.5,dur:0.5},{note:'C5',time:5,dur:1},{note:'B4',time:6,dur:1},{note:'A4',time:7,dur:0.5},{note:'B4',time:7.5,dur:0.5},{note:'C5',time:8,dur:0.5},{note:'A4',time:8.5,dur:0.5},{note:'F4',time:9,dur:0.5},{note:'A4',time:9.5,dur:0.5},{note:'G4',time:10,dur:1.5}]},
    {name:'하이든 소나타 C장조',composer:'하이든',category:'클래식',difficulty:'medium',bpm:108,
     notes:[{note:'C4',time:0,dur:0.2},{note:'D4',time:0.2,dur:0.2},{note:'E4',time:0.4,dur:0.2},{note:'F4',time:0.6,dur:0.2},{note:'G4',time:0.8,dur:0.4},{note:'G4',time:1.2,dur:0.4},{note:'A4',time:1.6,dur:0.2},{note:'B4',time:1.8,dur:0.2},{note:'C5',time:2,dur:0.2},{note:'D5',time:2.2,dur:0.2},{note:'E5',time:2.4,dur:0.4},{note:'E5',time:2.8,dur:0.4},{note:'D5',time:3.2,dur:0.2},{note:'C5',time:3.4,dur:0.2},{note:'B4',time:3.6,dur:0.2},{note:'A4',time:3.8,dur:0.2},{note:'G4',time:4,dur:0.8}]},
    {name:'아라베스크 2번',composer:'드뷔시',category:'클래식',difficulty:'hard',bpm:84,
     notes:[{note:'G4',time:0,dur:0.2},{note:'A4',time:0.18,dur:0.2},{note:'B4',time:0.36,dur:0.2},{note:'D5',time:0.54,dur:0.3},{note:'E5',time:0.84,dur:0.3},{note:'D5',time:1.14,dur:0.2},{note:'B4',time:1.34,dur:0.3},{note:'G4',time:1.64,dur:0.5},{note:'A4',time:2.14,dur:0.2},{note:'B4',time:2.34,dur:0.2},{note:'D5',time:2.54,dur:0.2},{note:'E5',time:2.74,dur:0.3},{note:'F#5',time:3.04,dur:0.3},{note:'E5',time:3.34,dur:0.2},{note:'D5',time:3.54,dur:0.3},{note:'B4',time:3.84,dur:0.5},{note:'G4',time:4.34,dur:0.2},{note:'F#4',time:4.54,dur:0.2},{note:'E4',time:4.74,dur:0.5},{note:'D4',time:5.24,dur:0.8}]},
    {name:'Fly Me to the Moon',composer:'바트 하워드',category:'재즈',difficulty:'medium',bpm:120,
     notes:[{note:'C5',time:0,dur:0.75},{note:'B4',time:0.75,dur:0.25},{note:'A4',time:1,dur:0.5},{note:'G4',time:1.5,dur:0.5},{note:'F4',time:2,dur:0.75},{note:'G4',time:2.75,dur:0.25},{note:'A4',time:3,dur:0.5},{note:'C5',time:3.5,dur:0.5},{note:'B4',time:4,dur:0.75},{note:'A4',time:4.75,dur:0.25},{note:'G4',time:5,dur:0.5},{note:'F4',time:5.5,dur:0.5},{note:'E4',time:6,dur:1.5},{note:'A4',time:7.5,dur:0.75},{note:'G4',time:8.25,dur:0.25},{note:'F4',time:8.5,dur:0.5},{note:'E4',time:9,dur:0.5},{note:'D4',time:9.5,dur:0.75},{note:'E4',time:10.25,dur:0.25},{note:'F4',time:10.5,dur:0.5},{note:'A4',time:11,dur:0.5},{note:'G#4',time:11.5,dur:1.5}]}
  ];
  newSongs.forEach(function(s){
    if(existing.indexOf(s.name)===-1){
      s.icon=s.category==='재즈'?'🎷':s.category==='동요'?'🌙':['🎹','🎵','🎶','🎼'][Math.floor(Math.random()*4)];
      window.SONGS.push(s);
    }
  });
  if(window.app&&app.initSongList) app.initSongList();
}

// ================ 1. RHYTHM TILE MINI-GAME CANVAS ================
function buildRhythmTileUI(){
  makeV17Modal('tile-modal','🎮 리듬 타일 미니게임',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">Piano Tiles 스타일! 떨어지는 타일을 정확히 터치하세요. 놓치면 게임 오버!</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
      '<button class="ctrl-btn tile-diff-btn" data-diff="easy" style="font-size:10px">Easy (60BPM)</button>'+
      '<button class="ctrl-btn tile-diff-btn" data-diff="normal" style="font-size:10px">Normal (90BPM)</button>'+
      '<button class="ctrl-btn tile-diff-btn" data-diff="hard" style="font-size:10px">Hard (120BPM)</button>'+
      '</div>'+
      '<canvas id="tile-canvas" width="320" height="400" style="width:100%;max-width:320px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto;touch-action:none"></canvas>'+
      '<div id="tile-info" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text2)">난이도를 선택하세요</div>'+
      '<div id="tile-stats" style="margin-top:8px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#tile-canvas');
    var ctx=canvas.getContext('2d');
    var info=container.querySelector('#tile-info');
    var cols=4,tileW=canvas.width/cols,tileH=70;
    var tiles=[],score=0,combo=0,maxCombo=0,gameRunning=false,animFrame=null;
    var speeds={easy:1.5,normal:2.5,hard:4};
    var intervals={easy:1200,normal:800,hard:500};
    var speed=0,spawnInterval=0,lastSpawn=0,best=ls17Get('tile_best',0);

    function spawnTile(){
      var col=Math.floor(Math.random()*cols);
      tiles.push({x:col*tileW,y:-tileH,w:tileW-2,h:tileH-2,col:col,hit:false,missed:false});
    }
    function drawGame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      for(var c=1;c<cols;c++){ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.moveTo(c*tileW,0);ctx.lineTo(c*tileW,canvas.height);ctx.stroke();}
      ctx.strokeStyle='#4a7dff44';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,canvas.height-50);ctx.lineTo(canvas.width,canvas.height-50);ctx.stroke();ctx.lineWidth=1;
      tiles.forEach(function(t){
        if(t.hit){ctx.fillStyle='rgba(34,197,94,0.5)';ctx.fillRect(t.x+1,t.y+1,t.w,t.h);return;}
        if(t.missed){ctx.fillStyle='rgba(239,68,68,0.5)';ctx.fillRect(t.x+1,t.y+1,t.w,t.h);return;}
        var grad=ctx.createLinearGradient(t.x,t.y,t.x,t.y+t.h);
        grad.addColorStop(0,'#4a7dff');grad.addColorStop(1,'#3355aa');
        ctx.fillStyle=grad;ctx.fillRect(t.x+1,t.y+1,t.w,t.h);
        ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(t.x+1,t.y+1,t.w,t.h*0.3);
      });
      ctx.fillStyle='#e8ecf4';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
      ctx.fillText('Score: '+score,canvas.width/2,20);
      ctx.font='11px sans-serif';ctx.fillStyle='#eab308';
      ctx.fillText('Combo: '+combo+'x (Best: '+best+')',canvas.width/2,36);
    }
    function gameLoop(){
      if(!gameRunning)return;
      var now=Date.now();
      if(now-lastSpawn>spawnInterval){spawnTile();lastSpawn=now;}
      tiles.forEach(function(t){if(!t.hit&&!t.missed)t.y+=speed;});
      for(var i=tiles.length-1;i>=0;i--){
        if(!tiles[i].hit&&!tiles[i].missed&&tiles[i].y>canvas.height){
          tiles[i].missed=true;playSFX17('tile_miss');combo=0;
          gameRunning=false;
          info.textContent='Game Over! Score: '+score;
          if(score>best){best=score;ls17Set('tile_best',best);}
          ls17Set('tile_played',true);
          updateTileStats();return;
        }
      }
      tiles=tiles.filter(function(t){return t.y<canvas.height+100;});
      drawGame();
      animFrame=requestAnimationFrame(gameLoop);
    }
    function handleTap(px,py){
      if(!gameRunning)return;
      var rect=canvas.getBoundingClientRect();
      var cx=(px-rect.left)*(canvas.width/rect.width);
      var cy=(py-rect.top)*(canvas.height/rect.height);
      var hit=false;
      for(var i=tiles.length-1;i>=0;i--){
        var t=tiles[i];
        if(!t.hit&&!t.missed&&cx>=t.x&&cx<=t.x+t.w&&cy>=t.y&&cy<=t.y+t.h){
          t.hit=true;score+=10+combo*2;combo++;if(combo>maxCombo)maxCombo=combo;
          playSFX17('tile_hit');hit=true;break;
        }
      }
      if(!hit){combo=0;playSFX17('tile_miss');}
    }
    canvas.addEventListener('click',function(e){handleTap(e.clientX,e.clientY);});
    canvas.addEventListener('touchstart',function(e){e.preventDefault();var touch=e.touches[0];handleTap(touch.clientX,touch.clientY);},{passive:false});
    container.querySelectorAll('.tile-diff-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        container.querySelectorAll('.tile-diff-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        var diff=btn.dataset.diff;
        speed=speeds[diff];spawnInterval=intervals[diff];
        tiles=[];score=0;combo=0;maxCombo=0;lastSpawn=Date.now();gameRunning=true;
        info.textContent='Playing...';
        if(animFrame)cancelAnimationFrame(animFrame);
        gameLoop();
      });
    });
    function updateTileStats(){
      var stats=container.querySelector('#tile-stats');
      stats.innerHTML='<b>최고 점수:</b> '+best+' | <b>최대 콤보:</b> '+maxCombo;
    }
    updateTileStats();drawGame();
  });
}

// ================ 2. CHORD EAR TEST CANVAS ================
function buildChordEarUI(){
  makeV17Modal('chord-ear-modal','🎧 코드 청음 테스트',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">코드를 듣고 어떤 코드인지 맞추세요! 10라운드, S~D 등급 부여.</p>'+
      '<canvas id="chord-ear-canvas" width="520" height="320" style="width:100%;max-width:520px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="chord-ear-controls" style="text-align:center;margin-top:10px">'+
      '<button class="ctrl-btn" id="chord-ear-start" style="padding:8px 16px">테스트 시작</button>'+
      '<button class="ctrl-btn" id="chord-ear-replay" style="padding:8px 16px;display:none">다시 듣기</button>'+
      '</div>'+
      '<div id="chord-ear-choices" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;justify-content:center"></div>'+
      '<div id="chord-ear-result" style="text-align:center;margin-top:8px;font-size:12px"></div>';
    var canvas=container.querySelector('#chord-ear-canvas');
    var ctx=canvas.getContext('2d');
    var CHORDS=[
      {name:'C Major',notes:[261.63,329.63,392],type:'major'},
      {name:'D Minor',notes:[293.66,349.23,440],type:'minor'},
      {name:'E Minor',notes:[329.63,392,493.88],type:'minor'},
      {name:'F Major',notes:[349.23,440,523.25],type:'major'},
      {name:'G Major',notes:[392,493.88,587.33],type:'major'},
      {name:'A Minor',notes:[440,523.25,659.26],type:'minor'},
      {name:'B Dim',notes:[493.88,587.33,698.46],type:'dim'},
      {name:'C7',notes:[261.63,329.63,392,466.16],type:'7th'},
      {name:'Dm7',notes:[293.66,349.23,440,523.25],type:'7th'},
      {name:'Em7',notes:[329.63,392,493.88,587.33],type:'7th'},
      {name:'Fmaj7',notes:[349.23,440,523.25,659.26],type:'maj7'},
      {name:'Am7',notes:[440,523.25,659.26,783.99],type:'7th'}
    ];
    var round=0,totalRounds=10,correct=0,currentChord=null,answered=false;

    function playChord(chord){
      if(!sfx17)return;if(sfx17.state==='suspended')sfx17.resume();
      var t=sfx17.currentTime;
      chord.notes.forEach(function(freq){
        var o=sfx17.createOscillator(),g=sfx17.createGain();
        o.connect(g);g.connect(sfx17.destination);
        o.type='sine';o.frequency.setValueAtTime(freq,t);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+1.5);
        o.start(t);o.stop(t+1.5);
      });
    }
    function drawState(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('코드 청음 테스트',canvas.width/2,25);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('Round '+round+'/'+totalRounds,canvas.width/2,42);
      var barW=canvas.width-40,barH=8;
      ctx.fillStyle='#1e2640';ctx.fillRect(20,52,barW,barH);
      ctx.fillStyle='#4a7dff';ctx.fillRect(20,52,barW*(round/totalRounds),barH);
      ctx.fillStyle='#22c55e';ctx.font='bold 24px sans-serif';
      ctx.fillText(correct+' / '+round,canvas.width/2,100);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('정답',canvas.width/2,116);
      if(round>=totalRounds&&answered){
        var pct=Math.round(correct/totalRounds*100);
        var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=50?'C':'D';
        var colors={S:'#eab308',A:'#22c55e',B:'#3b82f6',C:'#a855f7',D:'#ef4444'};
        ctx.fillStyle=colors[grade];ctx.font='bold 48px sans-serif';
        ctx.fillText(grade,canvas.width/2,180);
        ctx.fillStyle='#e8ecf4';ctx.font='bold 16px sans-serif';
        ctx.fillText(pct+'%',canvas.width/2,210);
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
        ctx.fillText('최고: '+ls17Get('chord_best',0)+'%',canvas.width/2,230);
        if(pct>ls17Get('chord_best',0)) ls17Set('chord_best',pct);
        ls17Set('chord_tested',true);
      } else if(currentChord){
        ctx.fillStyle='#e8ecf4';ctx.font='14px sans-serif';
        ctx.fillText('코드를 듣고 맞추세요!',canvas.width/2,160);
        var icon=answered?(currentChord._userCorrect?'✅':'❌'):'🎵';
        ctx.font='40px sans-serif';
        ctx.fillText(icon,canvas.width/2,220);
        if(answered&&!currentChord._userCorrect){
          ctx.fillStyle='#ef4444';ctx.font='12px sans-serif';
          ctx.fillText('정답: '+currentChord.name,canvas.width/2,260);
        }
      }
      for(var i=0;i<totalRounds;i++){
        var dx=20+i*(canvas.width-40)/totalRounds;
        ctx.fillStyle=i<round?(i<correct?'#22c55e':'#ef4444'):'#1e2640';
        ctx.beginPath();ctx.arc(dx+((canvas.width-40)/totalRounds)/2,canvas.height-20,4,0,Math.PI*2);ctx.fill();
      }
    }
    function showChoices(){
      var choicesDiv=container.querySelector('#chord-ear-choices');
      choicesDiv.innerHTML='';
      var options=[currentChord.name];
      while(options.length<4){
        var r=CHORDS[Math.floor(Math.random()*CHORDS.length)];
        if(options.indexOf(r.name)===-1)options.push(r.name);
      }
      options.sort(function(){return Math.random()-0.5;});
      options.forEach(function(opt){
        var btn=document.createElement('button');
        btn.className='ctrl-btn';btn.style.cssText='padding:8px 14px;font-size:12px;min-width:80px';
        btn.textContent=opt;
        btn.addEventListener('click',function(){
          if(answered)return;answered=true;
          if(opt===currentChord.name){correct++;currentChord._userCorrect=true;playSFX17('chord_correct');}
          else{currentChord._userCorrect=false;playSFX17('chord_wrong');}
          drawState();
          if(round<totalRounds){
            setTimeout(nextRound,1500);
          } else {
            choicesDiv.innerHTML='<button class="ctrl-btn" style="padding:8px 16px" id="chord-restart">다시 도전</button>';
            container.querySelector('#chord-restart').addEventListener('click',function(){
              round=0;correct=0;nextRound();
            });
          }
        });
        choicesDiv.appendChild(btn);
      });
    }
    function nextRound(){
      round++;answered=false;
      currentChord=CHORDS[Math.floor(Math.random()*CHORDS.length)];
      playChord(currentChord);
      drawState();showChoices();
      container.querySelector('#chord-ear-replay').style.display='inline-block';
    }
    container.querySelector('#chord-ear-start').addEventListener('click',function(){
      this.style.display='none';round=0;correct=0;nextRound();
    });
    container.querySelector('#chord-ear-replay').addEventListener('click',function(){
      if(currentChord)playChord(currentChord);
    });
    drawState();
  });
}

// ================ 3. KEY COVERAGE HEATMAP CANVAS ================
function buildHeatmapUI(){
  makeV17Modal('heatmap-modal','🔥 건반 커버리지 히트맵',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">연주 기록을 분석하여 자주 사용하는 건반과 미사용 건반을 시각화합니다.</p>'+
      '<canvas id="heatmap-canvas" width="560" height="280" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="display:flex;gap:6px;margin-top:8px;justify-content:center">'+
      '<button class="ctrl-btn" id="heatmap-record">건반 연주 기록</button>'+
      '<button class="ctrl-btn" id="heatmap-reset">초기화</button>'+
      '</div>'+
      '<div id="heatmap-stats" style="margin-top:8px;font-size:11px;color:var(--text2);text-align:center"></div>';
    var canvas=container.querySelector('#heatmap-canvas');
    var ctx=canvas.getContext('2d');
    var NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    var keyData=ls17Get('key_heatmap',{});
    var allKeys=[];
    for(var oct=2;oct<=6;oct++){
      NOTES.forEach(function(n){allKeys.push(n+oct);});
    }

    function drawHeatmap(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('건반 커버리지 히트맵 (61건반)',canvas.width/2,20);
      var maxCount=1;
      Object.keys(keyData).forEach(function(k){if(keyData[k]>maxCount)maxCount=keyData[k];});
      var whiteKeys=allKeys.filter(function(k){return k.indexOf('#')===-1;});
      var blackKeys=allKeys.filter(function(k){return k.indexOf('#')!==-1;});
      var wKeyW=(canvas.width-20)/whiteKeys.length;
      var wKeyH=140,startY=50;
      whiteKeys.forEach(function(k,i){
        var count=keyData[k]||0;
        var intensity=count/maxCount;
        var r=Math.round(10+intensity*229),g=Math.round(14+intensity*183),b=Math.round(26+intensity*0);
        if(count===0){ctx.fillStyle='#1a2036';}
        else{ctx.fillStyle='rgb('+r+','+g+','+b+')';}
        ctx.fillRect(10+i*wKeyW,startY,wKeyW-1,wKeyH);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(10+i*wKeyW,startY,wKeyW-1,wKeyH);
        if(i%7===0){ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';ctx.fillText(k,10+i*wKeyW+wKeyW/2,startY+wKeyH+10);}
      });
      var bKeyH=85;
      var blackMap={0:0,1:1,3:2,4:3,5:4,6:5,8:6,9:7,10:8,11:9};
      blackKeys.forEach(function(k){
        var noteIdx=NOTES.indexOf(k.replace(/\d/,''));
        var oct=parseInt(k.replace(/\D/g,''));
        var whiteIdx=0;
        for(var o=2;o<oct;o++) whiteIdx+=7;
        var noteInOct=noteIdx;
        if(noteInOct===1) whiteIdx+=1;
        else if(noteInOct===3) whiteIdx+=2;
        else if(noteInOct===6) whiteIdx+=4;
        else if(noteInOct===8) whiteIdx+=5;
        else if(noteInOct===10) whiteIdx+=6;
        var count=keyData[k]||0;
        var intensity=count/maxCount;
        if(count===0){ctx.fillStyle='#0f1525';}
        else{ctx.fillStyle='rgb('+Math.round(intensity*168)+','+Math.round(85+intensity*85)+','+Math.round(247)+')';}
        ctx.fillRect(10+whiteIdx*wKeyW+wKeyW*0.65,startY,wKeyW*0.6,bKeyH);
      });
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      var totalHits=0,usedKeys=0;
      Object.keys(keyData).forEach(function(k){totalHits+=keyData[k];if(keyData[k]>0)usedKeys++;});
      ctx.fillText('총 히트: '+totalHits+' | 사용 건반: '+usedKeys+'/61',10,canvas.height-40);
      var legendW=200,legendH=10,legendX=canvas.width-legendW-10,legendY=canvas.height-40;
      for(var lx=0;lx<legendW;lx++){
        var li=lx/legendW;
        ctx.fillStyle='rgb('+Math.round(10+li*229)+','+Math.round(14+li*183)+','+Math.round(26)+')';
        ctx.fillRect(legendX+lx,legendY,1,legendH);
      }
      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='left';
      ctx.fillText('0',legendX,legendY+legendH+10);ctx.textAlign='right';ctx.fillText(maxCount+'',legendX+legendW,legendY+legendH+10);
      ctx.textAlign='center';ctx.fillText('히트 횟수',legendX+legendW/2,legendY+legendH+10);
      playSFX17('heatmap_view');
    }
    container.querySelector('#heatmap-record').addEventListener('click',function(){
      if(window.app&&app.stats){
        var songs=window.SONGS||[];
        songs.forEach(function(s){
          if(s.notes){s.notes.forEach(function(n){
            var key=n.note||n.key;
            if(key){keyData[key]=(keyData[key]||0)+1;}
          });}
        });
        ls17Set('key_heatmap',keyData);
        ls17Set('heatmap_used',true);
        drawHeatmap();
      }
    });
    container.querySelector('#heatmap-reset').addEventListener('click',function(){
      keyData={};ls17Set('key_heatmap',{});drawHeatmap();
    });
    drawHeatmap();
  });
}

// ================ 4. WEEKLY GROWTH REPORT CANVAS ================
function buildWeeklyReportUI(){
  makeV17Modal('weekly-modal','📊 주간 성장 리포트',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">이번 주 vs 지난 주 연습 데이터를 비교 분석합니다.</p>'+
      '<canvas id="weekly-canvas" width="540" height="380" style="width:100%;max-width:540px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="text-align:center;margin-top:8px">'+
      '<button class="ctrl-btn" id="weekly-record">이번 주 기록</button>'+
      '</div>';
    var canvas=container.querySelector('#weekly-canvas');
    var ctx=canvas.getContext('2d');
    var weekData=ls17Get('weekly_data',{thisWeek:{plays:0,score:0,notes:0,time:0,streak:0,songs:0,combo:0},lastWeek:{plays:3,score:240,notes:150,time:45,streak:2,songs:1,combo:15}});

    function drawReport(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('주간 성장 리포트',canvas.width/2,22);
      var metrics=[
        {label:'연주 횟수',this:weekData.thisWeek.plays,last:weekData.lastWeek.plays,unit:'회'},
        {label:'평균 점수',this:weekData.thisWeek.score,last:weekData.lastWeek.score,unit:'점'},
        {label:'총 노트',this:weekData.thisWeek.notes,last:weekData.lastWeek.notes,unit:'개'},
        {label:'연습 시간',this:weekData.thisWeek.time,last:weekData.lastWeek.time,unit:'분'},
        {label:'스트릭',this:weekData.thisWeek.streak,last:weekData.lastWeek.streak,unit:'일'},
        {label:'완주곡',this:weekData.thisWeek.songs,last:weekData.lastWeek.songs,unit:'곡'},
        {label:'최대콤보',this:weekData.thisWeek.combo,last:weekData.lastWeek.combo,unit:'x'}
      ];
      var barW=50,gap=12,startX=30,startY=60,barMaxH=180;
      var maxVal=1;
      metrics.forEach(function(m){if(m.this>maxVal)maxVal=m.this;if(m.last>maxVal)maxVal=m.last;});
      metrics.forEach(function(m,i){
        var x=startX+i*(barW*2+gap*2+10);
        var hThis=Math.max(2,(m.this/maxVal)*barMaxH);
        var hLast=Math.max(2,(m.last/maxVal)*barMaxH);
        ctx.fillStyle='#3b82f6';ctx.fillRect(x,startY+barMaxH-hLast,barW,hLast);
        ctx.fillStyle='#22c55e';ctx.fillRect(x+barW+4,startY+barMaxH-hThis,barW,hThis);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(m.label,x+barW+2,startY+barMaxH+14);
        ctx.fillStyle='#3b82f6';ctx.fillText(m.last+m.unit,x+barW/2,startY+barMaxH-hLast-4);
        ctx.fillStyle='#22c55e';ctx.fillText(m.this+m.unit,x+barW+4+barW/2,startY+barMaxH-hThis-4);
        var change=m.last>0?Math.round((m.this-m.last)/m.last*100):m.this>0?100:0;
        ctx.fillStyle=change>=0?'#22c55e':'#ef4444';ctx.font='bold 9px sans-serif';
        ctx.fillText((change>=0?'+':'')+change+'%',x+barW+2,startY+barMaxH+26);
      });
      ctx.fillStyle='#3b82f6';ctx.fillRect(canvas.width/2-80,canvas.height-30,12,12);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      ctx.fillText('지난 주',canvas.width/2-64,canvas.height-20);
      ctx.fillStyle='#22c55e';ctx.fillRect(canvas.width/2+10,canvas.height-30,12,12);
      ctx.fillStyle='#8892a8';ctx.fillText('이번 주',canvas.width/2+26,canvas.height-20);
      playSFX17('report_gen');
    }
    container.querySelector('#weekly-record').addEventListener('click',function(){
      if(window.app&&app.stats){
        weekData.lastWeek=Object.assign({},weekData.thisWeek);
        weekData.thisWeek={
          plays:app.stats.totalPlays||0,
          score:app.stats.totalPlays>0?Math.round((app.stats.totalScore||0)/(app.stats.totalPlays||1)):0,
          notes:app.stats.totalNotes||0,
          time:Math.round((app.stats.totalPlayTime||0)/60),
          streak:app.stats.streak||0,
          songs:(app.stats.songsCompleted?app.stats.songsCompleted.size:0)||0,
          combo:app.stats.maxCombo||0
        };
        ls17Set('weekly_data',weekData);
        ls17Set('weekly_recorded',true);
      }
      drawReport();
    });
    drawReport();
  });
}

// ================ 5. DIFFICULTY PROGRESSION MAP CANVAS ================
function buildDiffMapUI(){
  makeV17Modal('diffmap-modal','🗺️ 난이도 프로그레션 맵',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">Easy→Medium→Hard→Expert 순서로 곡을 완주하며 실력을 키우세요!</p>'+
      '<canvas id="diffmap-canvas" width="560" height="400" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="diffmap-info" style="text-align:center;margin-top:8px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#diffmap-canvas');
    var ctx=canvas.getContext('2d');

    function drawMap(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('난이도 프로그레션 맵',canvas.width/2,22);
      var songs=window.SONGS||[];
      var levels=[
        {name:'Easy',color:'#22c55e',songs:songs.filter(function(s){return s.difficulty==='easy'})},
        {name:'Medium',color:'#eab308',songs:songs.filter(function(s){return s.difficulty==='medium'})},
        {name:'Hard',color:'#ef4444',songs:songs.filter(function(s){return s.difficulty==='hard'})},
        {name:'Expert',color:'#a855f7',songs:songs.filter(function(s){return s.difficulty==='expert'})}
      ];
      var completed=new Set();
      if(window.app&&app.stats&&app.stats.songsCompleted){
        app.stats.songsCompleted.forEach(function(s){completed.add(s);});
      }
      var y=50,levelH=80;
      levels.forEach(function(lv,li){
        ctx.fillStyle=lv.color+'33';
        ctx.fillRect(10,y,canvas.width-20,levelH);
        ctx.strokeStyle=lv.color+'66';ctx.strokeRect(10,y,canvas.width-20,levelH);
        ctx.fillStyle=lv.color;ctx.font='bold 11px sans-serif';ctx.textAlign='left';
        ctx.fillText(lv.name+' ('+lv.songs.length+'곡)',16,y+14);
        var doneCount=0;
        var nodeR=8,maxPerRow=Math.min(lv.songs.length,16);
        var spacing=(canvas.width-60)/Math.max(maxPerRow,1);
        lv.songs.slice(0,maxPerRow).forEach(function(s,si){
          var nx=30+si*spacing,ny=y+45;
          var done=completed.has(s.name);
          if(done)doneCount++;
          ctx.beginPath();ctx.arc(nx,ny,nodeR,0,Math.PI*2);
          ctx.fillStyle=done?lv.color:'#1e2640';ctx.fill();
          ctx.strokeStyle=done?lv.color:'#2a3050';ctx.stroke();
          if(done){ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('✓',nx,ny+3);}
          if(si>0){
            ctx.strokeStyle=completed.has(lv.songs[si-1].name)?lv.color+'88':'#1e264066';
            ctx.beginPath();ctx.moveTo(nx-spacing+nodeR,ny);ctx.lineTo(nx-nodeR,ny);ctx.stroke();
          }
        });
        var pct=lv.songs.length>0?Math.round(doneCount/lv.songs.length*100):0;
        ctx.fillStyle=lv.color;ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(doneCount+'/'+lv.songs.length+' ('+pct+'%)',canvas.width-16,y+14);
        if(li<levels.length-1){
          ctx.strokeStyle='#4a7dff44';ctx.setLineDash([4,4]);
          ctx.beginPath();ctx.moveTo(canvas.width/2,y+levelH);ctx.lineTo(canvas.width/2,y+levelH+5);ctx.stroke();
          ctx.setLineDash([]);
        }
        y+=levelH+5;
      });
      var totalDone=completed.size,totalSongs=songs.length;
      var totalPct=totalSongs>0?Math.round(totalDone/totalSongs*100):0;
      ctx.fillStyle='#e8ecf4';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText('전체 진행률: '+totalDone+'/'+totalSongs+' ('+totalPct+'%)',canvas.width/2,canvas.height-15);
      ls17Set('diffmap_viewed',true);
      playSFX17('map_unlock');
    }
    drawMap();
  });
}

// ================ 6. PIANO OLYMPIAD CANVAS ================
function buildOlympiadUI(){
  makeV17Modal('olympiad-modal','🏅 피아노 올림피아드',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">8인 AI 토너먼트! 4강→결승까지 퀴즈 배틀로 우승을 노리세요!</p>'+
      '<canvas id="olympiad-canvas" width="540" height="380" style="width:100%;max-width:540px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="olympiad-controls" style="text-align:center;margin-top:8px">'+
      '<button class="ctrl-btn" id="olympiad-start" style="padding:8px 16px">토너먼트 시작</button>'+
      '</div>'+
      '<div id="olympiad-battle" style="margin-top:8px;text-align:center"></div>';
    var canvas=container.querySelector('#olympiad-canvas');
    var ctx=canvas.getContext('2d');
    var PLAYERS=['🧑 You','🤖 Mozart AI','🤖 Chopin AI','🤖 Liszt AI','🤖 Beethoven AI','🤖 Debussy AI','🤖 Rachmaninoff AI','🤖 Schumann AI'];
    var bracket=[],roundName='',currentMatch=0,wins=ls17Get('olympiad_wins',0),played=ls17Get('olympiad_played',0);

    var BATTLE_QS=[
      {q:'피아노 건반 수는?',a:'88',opts:['61','76','88','104']},
      {q:'C Major 코드 구성음은?',a:'C-E-G',opts:['C-E-G','C-D-F','C-F-A','C-E-A']},
      {q:'포르테(f)의 뜻은?',a:'세게',opts:['여리게','세게','빠르게','느리게']},
      {q:'크레셴도의 뜻은?',a:'점점 세게',opts:['점점 여리게','점점 세게','점점 빠르게','점점 느리게']},
      {q:'4/4박자에서 한 마디의 박 수는?',a:'4박',opts:['2박','3박','4박','6박']},
      {q:'피아노의 전신 악기는?',a:'하프시코드',opts:['오르간','하프시코드','클라비코드','첼레스타']},
      {q:'검은 건반의 수는?',a:'36개',opts:['32개','36개','40개','44개']},
      {q:'음자리표 종류가 아닌 것은?',a:'박자표',opts:['높은음자리표','낮은음자리표','가온음자리표','박자표']},
      {q:'피아니시모(pp)는?',a:'매우 여리게',opts:['매우 세게','매우 여리게','매우 빠르게','매우 느리게']},
      {q:'스타카토의 뜻은?',a:'짧게 끊어서',opts:['이어서','짧게 끊어서','세게','느리게']},
      {q:'리타르단도(rit.)는?',a:'점점 느리게',opts:['점점 빠르게','점점 느리게','점점 세게','점점 여리게']},
      {q:'페르마타의 뜻은?',a:'길게 늘여서',opts:['빠르게','짧게','길게 늘여서','반복']},
      {q:'A4 음의 주파수는?',a:'440Hz',opts:['220Hz','330Hz','440Hz','880Hz']},
      {q:'한 옥타브에 반음은?',a:'12개',opts:['7개','8개','10개','12개']},
      {q:'메조포르테(mf)는?',a:'조금 세게',opts:['매우 세게','조금 세게','조금 여리게','매우 여리게']},
      {q:'트릴(tr)은?',a:'빠르게 두 음 반복',opts:['한 음 길게','빠르게 두 음 반복','음을 미끄러지듯','음 생략']}
    ];

    function drawBracket(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#eab308';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('🏅 피아노 올림피아드',canvas.width/2,22);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('통산 '+wins+'승 / '+played+'전',canvas.width/2,38);
      if(bracket.length===0){
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';
        ctx.fillText('토너먼트를 시작하세요!',canvas.width/2,canvas.height/2);
        return;
      }
      var rounds=[[],[],[]];
      if(bracket.length>=4) rounds[0]=bracket.slice(0,4);
      if(bracket.length>=6) rounds[1]=bracket.slice(4,6);
      if(bracket.length>=7) rounds[2]=[bracket[6]];
      var labels=['8강','4강','결승'];
      var xPositions=[40,220,400];
      rounds.forEach(function(rd,ri){
        ctx.fillStyle='#4a7dff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(labels[ri],xPositions[ri]+60,55);
        rd.forEach(function(match,mi){
          var y=70+mi*75;
          var boxW=120,boxH=28;
          [match.p1,match.p2].forEach(function(p,pi){
            var by=y+pi*(boxH+2);
            ctx.fillStyle=match.winner===p?'rgba(34,197,94,0.2)':'var(--surface2,#1a2036)';
            ctx.fillRect(xPositions[ri],by,boxW,boxH);
            ctx.strokeStyle=match.winner===p?'#22c55e':'#1e2640';
            ctx.strokeRect(xPositions[ri],by,boxW,boxH);
            ctx.fillStyle=match.winner===p?'#22c55e':'#e8ecf4';
            ctx.font='10px sans-serif';ctx.textAlign='left';
            ctx.fillText(p||'?',xPositions[ri]+6,by+18);
          });
        });
      });
    }
    function startTournament(){
      bracket=[];
      var shuffled=PLAYERS.slice().sort(function(){return Math.random()-0.5;});
      for(var i=0;i<8;i+=2){
        bracket.push({p1:shuffled[i],p2:shuffled[i+1],winner:null});
      }
      currentMatch=0;roundName='8강';
      drawBracket();
      playMatch();
    }
    function playMatch(){
      var battleDiv=container.querySelector('#olympiad-battle');
      var match=null;
      if(currentMatch<4) match=bracket[currentMatch];
      else if(currentMatch<6&&bracket.length>currentMatch) match=bracket[currentMatch];
      else if(currentMatch===6&&bracket.length>6) match=bracket[6];
      if(!match||match.winner){
        if(currentMatch<4){currentMatch++;playMatch();return;}
        if(currentMatch===4){
          bracket.push({p1:bracket[0].winner,p2:bracket[1].winner,winner:null});
          bracket.push({p1:bracket[2].winner,p2:bracket[3].winner,winner:null});
          currentMatch=4;roundName='4강';drawBracket();playMatch();return;
        }
        if(currentMatch===5){currentMatch=5;playMatch();return;}
        if(currentMatch===6){
          bracket.push({p1:bracket[4].winner,p2:bracket[5].winner,winner:null});
          currentMatch=6;roundName='결승';drawBracket();playMatch();return;
        }
        played++;ls17Set('olympiad_played',played);
        var finalMatch=bracket[6];
        if(finalMatch&&finalMatch.winner==='🧑 You'){wins++;ls17Set('olympiad_wins',wins);playSFX17('olympiad_win');}
        else{playSFX17('olympiad_lose');}
        ls17Set('olympiad_done',true);
        drawBracket();
        battleDiv.innerHTML='<div style="font-size:14px;margin-top:8px">'+(finalMatch&&finalMatch.winner==='🧑 You'?'🏆 우승!':'💔 패배')+'</div>';
        return;
      }
      var isPlayer=match.p1==='🧑 You'||match.p2==='🧑 You';
      if(!isPlayer){
        match.winner=Math.random()>0.5?match.p1:match.p2;
        drawBracket();currentMatch++;
        setTimeout(playMatch,300);
        return;
      }
      var q=BATTLE_QS[Math.floor(Math.random()*BATTLE_QS.length)];
      var opponent=match.p1==='🧑 You'?match.p2:match.p1;
      battleDiv.innerHTML='<div style="font-size:12px;color:var(--accent);margin-bottom:6px">'+roundName+' vs '+opponent+'</div>'+
        '<div style="font-size:13px;margin-bottom:8px">'+q.q+'</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center" id="olympiad-opts"></div>';
      var optsDiv=battleDiv.querySelector('#olympiad-opts');
      q.opts.forEach(function(opt){
        var btn=document.createElement('button');
        btn.className='ctrl-btn';btn.style.cssText='padding:6px 12px;font-size:11px';
        btn.textContent=opt;
        btn.addEventListener('click',function(){
          if(opt===q.a){
            match.winner='🧑 You';playSFX17('chord_correct');
            battleDiv.innerHTML='<div style="color:#22c55e;font-size:13px">✅ 정답! 승리!</div>';
          } else {
            match.winner=opponent;playSFX17('chord_wrong');
            battleDiv.innerHTML='<div style="color:#ef4444;font-size:13px">❌ 오답! 패배... (정답: '+q.a+')</div>';
          }
          drawBracket();currentMatch++;
          setTimeout(playMatch,1200);
        });
        optsDiv.appendChild(btn);
      });
    }
    container.querySelector('#olympiad-start').addEventListener('click',startTournament);
    drawBracket();
  });
}

// ================ 7. PERFORMANCE POSTURE CLINIC ================
function buildPostureUI(){
  makeV17Modal('posture-modal','🧘 연주 자세 클리닉',function(container){
    var tips=[
      {title:'올바른 착석 자세',icon:'🪑',desc:'의자 앞쪽 1/3에 앉으세요. 등을 곧게 펴고, 발은 바닥에 평평하게 놓습니다. 건반까지 팔꿈치가 약간 구부러지는 거리를 유지하세요.'},
      {title:'손목 높이',icon:'✋',desc:'손목은 건반과 같은 높이 또는 약간 위에 위치합니다. 손목이 처지면 힘줄에 무리가 가고, 너무 높으면 컨트롤이 어렵습니다.'},
      {title:'손가락 곡률',icon:'🤲',desc:'손가락을 자연스럽게 구부려 공을 잡는 모양을 유지하세요. 손가락 끝으로 건반을 누르되, 첫째 마디를 펴지 마세요.'},
      {title:'엄지 위치',icon:'👍',desc:'엄지는 건반 위에 옆으로 놓고, 손가락 옆면으로 건반을 누릅니다. 엄지가 건반 아래로 떨어지지 않도록 주의하세요.'},
      {title:'어깨 이완',icon:'💆',desc:'어깨를 자연스럽게 내리고 긴장을 풀어주세요. 연주 중 어깨가 올라가면 팔과 손에 불필요한 힘이 들어갑니다.'},
      {title:'팔꿈치 각도',icon:'💪',desc:'팔꿈치는 90~110도 각도를 유지합니다. 몸에 너무 붙이거나 벌리면 손목에 부담이 됩니다.'},
      {title:'시선 처리',icon:'👁️',desc:'악보를 볼 때 고개를 너무 숙이지 마세요. 악보대 높이를 눈높이에 맞추고, 건반은 주변시야로 파악합니다.'},
      {title:'페달 자세',icon:'🦶',desc:'페달을 밟을 때 발뒤꿈치는 바닥에 고정합니다. 발 앞쪽으로 페달을 부드럽게 눌러 미세 조절이 가능하도록 합니다.'},
      {title:'호흡 패턴',icon:'🌬️',desc:'프레이즈에 맞춰 자연스럽게 호흡하세요. 긴장되는 패시지에서 숨을 참으면 근육이 경직됩니다. 노래하듯 숨을 쉬세요.'},
      {title:'연습 시간 관리',icon:'⏰',desc:'30분 연습 후 5분 휴식을 취하세요. 손목 스트레칭과 어깨 돌리기를 합니다. 하루 총 연습시간은 초보 1시간, 중급 2시간을 넘지 않도록.'},
      {title:'워밍업 루틴',icon:'🔥',desc:'연주 전 반드시 5분간 워밍업을 하세요. 느린 스케일, 아르페지오, 하농 연습으로 손가락을 풀어줍니다.'},
      {title:'부상 예방',icon:'🏥',desc:'통증이 느껴지면 즉시 연습을 중단하세요. 손목 터널 증후군, 건초염 등을 예방하려면 올바른 자세와 적절한 휴식이 필수입니다.'}
    ];
    var html='<div style="display:flex;flex-direction:column;gap:8px">';
    tips.forEach(function(tip,i){
      html+='<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;cursor:pointer" class="posture-tip" data-idx="'+i+'">'+
        '<div style="display:flex;align-items:center;gap:8px">'+
        '<span style="font-size:24px">'+tip.icon+'</span>'+
        '<div><div style="font-size:12px;font-weight:700;color:var(--accent)">'+tip.title+'</div>'+
        '<div style="font-size:10px;color:var(--text2);margin-top:2px;display:none" id="posture-desc-'+i+'">'+tip.desc+'</div></div></div></div>';
    });
    html+='</div>';
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">피아노 연주 자세 12가지 핵심 포인트. 클릭하여 상세 설명을 확인하세요.</p>'+html;
    container.querySelectorAll('.posture-tip').forEach(function(el){
      el.addEventListener('click',function(){
        var idx=el.dataset.idx;
        var desc=container.querySelector('#posture-desc-'+idx);
        desc.style.display=desc.style.display==='none'?'block':'none';
        playSFX17('posture_tip');
        ls17Set('posture_read_'+idx,true);
        var readCount=0;
        for(var i=0;i<12;i++){if(ls17Get('posture_read_'+i,false))readCount++;}
        if(readCount>=12) ls17Set('posture_all',true);
        if(readCount>=1) ls17Set('posture_used',true);
      });
    });
  });
}

// ================ 8. COMPOSER STYLE ANALYZER CANVAS ================
function buildStyleAnalyzerUI(){
  makeV17Modal('style-modal','🎭 작곡가 스타일 분석기',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">당신의 연주 스타일을 8명의 작곡가와 비교! 6축 레이더 차트로 시각화합니다.</p>'+
      '<canvas id="style-canvas" width="520" height="440" style="width:100%;max-width:520px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;justify-content:center" id="style-composers"></div>'+
      '<div id="style-result" style="margin-top:8px;font-size:11px;text-align:center;color:var(--text2)"></div>';
    var canvas=container.querySelector('#style-canvas');
    var ctx=canvas.getContext('2d');
    var AXES=['속도','정확도','표현력','리듬감','다이나믹','테크닉'];
    var COMPOSERS=[
      {name:'모차르트',color:'#eab308',scores:[85,95,70,80,65,75]},
      {name:'베토벤',color:'#ef4444',scores:[70,80,90,75,95,85]},
      {name:'쇼팽',color:'#a855f7',scores:[80,85,95,70,90,95]},
      {name:'리스트',color:'#22c55e',scores:[95,75,80,85,80,100]},
      {name:'드뷔시',color:'#06b6d4',scores:[60,80,100,90,85,70]},
      {name:'바흐',color:'#f97316',scores:[65,100,60,95,55,80]},
      {name:'라흐마니노프',color:'#ec4899',scores:[90,85,85,70,95,95]},
      {name:'슈만',color:'#8b5cf6',scores:[75,70,95,85,80,75]}
    ];
    var selectedComposer=0;

    function getUserScores(){
      if(!window.app||!app.stats) return [50,50,50,50,50,50];
      var s=app.stats;
      var speed=Math.min(100,Math.round((s.maxCombo||0)/2+30));
      var accuracy=Math.min(100,s.totalPlays>0?Math.round((s.totalScore||0)/(s.totalPlays||1)):40);
      var expression=Math.min(100,Math.round(((s.songsCompleted?s.songsCompleted.size:0)||0)*3+20));
      var rhythm=Math.min(100,Math.round((s.streak||0)*8+30));
      var dynamics=Math.min(100,Math.round(((s.perfectSongs?s.perfectSongs.size:0)||0)*10+25));
      var technique=Math.min(100,Math.round(((s.totalPlayTime||0)/300)*10+20));
      return [speed,accuracy,expression,rhythm,dynamics,technique];
    }
    function drawRadar(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('작곡가 스타일 분석기',canvas.width/2,22);
      var cx=canvas.width/2,cy=200,r=130;
      var n=AXES.length;
      for(var ring=1;ring<=5;ring++){
        ctx.strokeStyle='#1e264066';ctx.beginPath();
        for(var i=0;i<=n;i++){
          var angle=-Math.PI/2+i*(2*Math.PI/n);
          var px=cx+Math.cos(angle)*r*(ring/5);
          var py=cy+Math.sin(angle)*r*(ring/5);
          if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.stroke();
      }
      for(var i=0;i<n;i++){
        var angle=-Math.PI/2+i*(2*Math.PI/n);
        ctx.strokeStyle='#1e264088';ctx.beginPath();ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        var lx=cx+Math.cos(angle)*(r+16),ly=cy+Math.sin(angle)*(r+16);
        ctx.fillText(AXES[i],lx,ly+4);
      }
      var comp=COMPOSERS[selectedComposer];
      ctx.strokeStyle=comp.color;ctx.lineWidth=2;ctx.globalAlpha=0.6;ctx.beginPath();
      for(var i=0;i<=n;i++){
        var idx=i%n;
        var angle=-Math.PI/2+idx*(2*Math.PI/n);
        var val=comp.scores[idx]/100;
        var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.stroke();
      ctx.fillStyle=comp.color+'33';ctx.fill();ctx.globalAlpha=1;ctx.lineWidth=1;

      var userScores=getUserScores();
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.globalAlpha=0.8;ctx.beginPath();
      for(var i=0;i<=n;i++){
        var idx=i%n;
        var angle=-Math.PI/2+idx*(2*Math.PI/n);
        var val=userScores[idx]/100;
        var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.stroke();
      ctx.fillStyle='#4a7dff22';ctx.fill();ctx.globalAlpha=1;ctx.lineWidth=1;

      ctx.fillStyle='#4a7dff';ctx.fillRect(canvas.width/2-100,canvas.height-40,12,12);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      ctx.fillText('You',canvas.width/2-84,canvas.height-30);
      ctx.fillStyle=comp.color;ctx.fillRect(canvas.width/2+10,canvas.height-40,12,12);
      ctx.fillText(comp.name,canvas.width/2+26,canvas.height-30);

      var similarity=0;
      for(var i=0;i<n;i++){similarity+=Math.abs(userScores[i]-comp.scores[i]);}
      similarity=Math.max(0,Math.round(100-similarity/n));
      container.querySelector('#style-result').textContent='당신과 '+comp.name+'의 유사도: '+similarity+'%';

      ls17Set('style_used',true);
      playSFX17('style_match');
    }
    var composersDiv=container.querySelector('#style-composers');
    COMPOSERS.forEach(function(c,i){
      var btn=document.createElement('button');
      btn.className='ctrl-btn';btn.style.cssText='padding:4px 8px;font-size:10px;border-color:'+c.color;
      btn.textContent=c.name;
      if(i===0) btn.classList.add('active');
      btn.addEventListener('click',function(){
        composersDiv.querySelectorAll('.ctrl-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        selectedComposer=i;drawRadar();
      });
      composersDiv.appendChild(btn);
    });
    drawRadar();
  });
}

// ================ QUIZ v8 (+15 QUESTIONS, 105→120) ================
function buildQuizV8UI(){
  var QUIZ8=[
    {q:'피아노 건반 총 수는?',a:'88',opts:['61','76','88','108']},
    {q:'피아노를 발명한 사람은?',a:'바르톨로메오 크리스토포리',opts:['요한 세바스찬 바흐','바르톨로메오 크리스토포리','볼프강 모차르트','루트비히 베토벤']},
    {q:'서스테인 페달은 몇 번째?',a:'오른쪽(3번)',opts:['왼쪽(1번)','가운데(2번)','오른쪽(3번)','4번']},
    {q:'피아노의 정식 이름은?',a:'피아노포르테',opts:['포르테피아노','피아노포르테','클라비코드','하프시코드']},
    {q:'12음 중 반음 관계가 아닌 것은?',a:'C-D',opts:['E-F','B-C','C-D','G#-A']},
    {q:'코드 표기 &quot;m&quot;은 무엇을 의미?',a:'마이너(단조)',opts:['메이저(장조)','마이너(단조)','미디엄','모데라토']},
    {q:'한 옥타브의 흰 건반 수는?',a:'7개',opts:['5개','7개','8개','12개']},
    {q:'템포 &quot;Allegro&quot;는?',a:'빠르게 (120-168 BPM)',opts:['느리게','보통으로','빠르게 (120-168 BPM)','매우 빠르게']},
    {q:'MIDI 프로토콜에서 벨로시티 최대값은?',a:'127',opts:['100','127','255','999']},
    {q:'피아노의 음역은 약 몇 옥타브?',a:'약 7옥타브',opts:['약 4옥타브','약 5옥타브','약 7옥타브','약 10옥타브']},
    {q:'그랜드 피아노와 업라이트의 차이는?',a:'현의 방향(수평/수직)',opts:['건반 수','현의 방향(수평/수직)','페달 수','크기만']},
    {q:'피아노 조율에 사용하는 음높이 기준은?',a:'A4 = 440Hz',opts:['C4 = 261Hz','A4 = 440Hz','A4 = 432Hz','C5 = 523Hz']},
    {q:'싱코페이션(syncopation)이란?',a:'약박에 강세 부여',opts:['빠르게 연주','약박에 강세 부여','느리게 연주','음을 생략']},
    {q:'피아노 해머가 현을 치는 원리는?',a:'지렛대(레버) 원리',opts:['용수철 원리','지렛대(레버) 원리','공기압 원리','전자기 원리']},
    {q:'아르페지오의 뜻은?',a:'코드 음을 순차적으로',opts:['한꺼번에 연주','코드 음을 순차적으로','트레몰로','비브라토']}
  ];
  makeV17Modal('quiz8-modal','🧠 피아노 퀴즈 v8 (15문항)',function(container){
    var currentQ=0,score=0,answered=false;
    function showQ(){
      if(currentQ>=QUIZ8.length){
        var pct=Math.round(score/QUIZ8.length*100);
        var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=50?'C':'D';
        container.innerHTML='<div style="text-align:center"><div style="font-size:36px;color:'+(pct>=70?'#22c55e':'#ef4444')+'">'+grade+'</div>'+
          '<div style="font-size:16px;margin:8px 0">'+score+'/'+QUIZ8.length+' ('+pct+'%)</div>'+
          '<div style="font-size:11px;color:var(--text2)">최고: '+ls17Get('quiz8_best',0)+'%</div>'+
          '<button class="ctrl-btn" id="quiz8-restart" style="margin-top:12px;padding:8px 16px">다시 도전</button></div>';
        if(pct>ls17Get('quiz8_best',0)) ls17Set('quiz8_best',pct);
        ls17Set('quiz8_done',true);
        if(pct===100) ls17Set('quiz8_perfect',true);
        container.querySelector('#quiz8-restart').addEventListener('click',function(){currentQ=0;score=0;showQ();});
        return;
      }
      var q=QUIZ8[currentQ];
      container.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:4px">Q'+(currentQ+1)+'/'+QUIZ8.length+'</div>'+
        '<div style="font-size:13px;margin-bottom:10px">'+q.q+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:6px" id="quiz8-opts"></div>'+
        '<div id="quiz8-feedback" style="margin-top:8px;font-size:12px;text-align:center"></div>';
      answered=false;
      var optsDiv=container.querySelector('#quiz8-opts');
      q.opts.forEach(function(opt){
        var btn=document.createElement('button');
        btn.className='ctrl-btn';btn.style.cssText='padding:8px 12px;font-size:11px;text-align:left';
        btn.textContent=opt;
        btn.addEventListener('click',function(){
          if(answered)return;answered=true;
          if(opt===q.a){score++;container.querySelector('#quiz8-feedback').innerHTML='<span style="color:#22c55e">✅ 정답!</span>';playSFX17('chord_correct');}
          else{container.querySelector('#quiz8-feedback').innerHTML='<span style="color:#ef4444">❌ 오답! 정답: '+q.a+'</span>';playSFX17('chord_wrong');}
          currentQ++;setTimeout(showQ,1200);
        });
        optsDiv.appendChild(btn);
      });
    }
    showQ();
  });
}

// ================ ACHIEVEMENTS v17 (+12, 132→144) ================
var V17_ACHIEVEMENTS=[
  {id:'tile_first',name:'리듬 타일 도전',icon:'🎮',desc:'리듬 타일 미니게임 첫 플레이'},
  {id:'tile_100',name:'타일 100점',icon:'💯',desc:'리듬 타일 100점 이상 달성'},
  {id:'chord_tester',name:'코드 청음가',icon:'🎧',desc:'코드 청음 테스트 완료'},
  {id:'chord_master',name:'코드 마스터',icon:'👂',desc:'코드 청음 90% 이상'},
  {id:'heatmap_viewer',name:'히트맵 분석가',icon:'🔥',desc:'건반 커버리지 히트맵 확인'},
  {id:'weekly_reporter',name:'주간 리포터',icon:'📊',desc:'주간 성장 리포트 기록'},
  {id:'diffmap_explorer',name:'프로그레션 탐험가',icon:'🗺️',desc:'난이도 맵 확인'},
  {id:'olympiad_champion',name:'올림피아드 챔피언',icon:'🏅',desc:'피아노 올림피아드 우승'},
  {id:'posture_student',name:'자세 교정 학생',icon:'🧘',desc:'연주 자세 팁 1개 확인'},
  {id:'posture_master',name:'자세 마스터',icon:'🏋️',desc:'연주 자세 12팁 전부 확인'},
  {id:'style_explorer',name:'스타일 탐험가',icon:'🎭',desc:'작곡가 스타일 비교'},
  {id:'quiz8_perfect',name:'퀴즈 v8 만점',icon:'🌟',desc:'퀴즈 v8 15문항 전부 정답'}
];

function injectV17Achievements(){
  var grid=document.querySelector('.achievement-grid');
  if(!grid) return;
  V17_ACHIEVEMENTS.forEach(function(a){
    if(grid.querySelector('[data-id="'+a.id+'"]')) return;
    var div=document.createElement('div');
    div.className='achievement';div.dataset.id=a.id;div.title=a.desc;
    div.innerHTML='<div class="achievement-icon">🔒</div>'+a.name;
    grid.appendChild(div);
  });
  var countEl=grid.parentElement.querySelector('h3');
  if(countEl&&window.app){
    var total=document.querySelectorAll('.achievement').length;
    var unlocked=document.querySelectorAll('.achievement.unlocked').length;
    countEl.textContent='🏆 업적 ('+unlocked+'/'+total+')';
  }
}

function checkV17Achievements(){
  var checks=[
    {id:'tile_first',cond:function(){return ls17Get('tile_played',false)}},
    {id:'tile_100',cond:function(){return ls17Get('tile_best',0)>=100}},
    {id:'chord_tester',cond:function(){return ls17Get('chord_tested',false)}},
    {id:'chord_master',cond:function(){return ls17Get('chord_best',0)>=90}},
    {id:'heatmap_viewer',cond:function(){return ls17Get('heatmap_used',false)}},
    {id:'weekly_reporter',cond:function(){return ls17Get('weekly_recorded',false)}},
    {id:'diffmap_explorer',cond:function(){return ls17Get('diffmap_viewed',false)}},
    {id:'olympiad_champion',cond:function(){return ls17Get('olympiad_wins',0)>=1}},
    {id:'posture_student',cond:function(){return ls17Get('posture_used',false)}},
    {id:'posture_master',cond:function(){return ls17Get('posture_all',false)}},
    {id:'style_explorer',cond:function(){return ls17Get('style_used',false)}},
    {id:'quiz8_perfect',cond:function(){return ls17Get('quiz8_perfect',false)}}
  ];
  checks.forEach(function(c){
    if(ls17Get('ach_'+c.id,false)) return;
    if(!c.cond()) return;
    ls17Set('ach_'+c.id,true);
    var el=document.querySelector('[data-id="'+c.id+'"]');
    if(el){el.classList.add('unlocked');el.querySelector('.achievement-icon').textContent=V17_ACHIEVEMENTS.find(function(a){return a.id===c.id}).icon;}
    var a=V17_ACHIEVEMENTS.find(function(a){return a.id===c.id});
    playSFX17('v17_achieve');
    showV17Toast(a.icon+' 업적 해금: '+a.name);
  });
  V17_ACHIEVEMENTS.forEach(function(a){
    if(ls17Get('ach_'+a.id,false)){
      var el=document.querySelector('[data-id="'+a.id+'"]');
      if(el){el.classList.add('unlocked');el.querySelector('.achievement-icon').textContent=a.icon;}
    }
  });
}

function showV17Toast(msg){
  var container=document.querySelector('.toast-container');
  if(!container){
    container=document.createElement('div');container.className='toast-container';
    container.style.cssText='position:fixed;top:50px;left:50%;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:4px;align-items:center';
    document.body.appendChild(container);
  }
  var toast=document.createElement('div');
  toast.className='toast toast-achievement';
  toast.textContent=msg;
  container.appendChild(toast);
  setTimeout(function(){toast.remove()},3000);
}

// ================ QUICK ACTIONS (FAB) ================
function injectV17QuickActions(){
  var rail=document.querySelector('.v-quick-rail');
  if(!rail){
    rail=document.createElement('div');
    rail.className='v-quick-rail';
    rail.style.cssText='position:fixed;left:6px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:4px;z-index:140';
    document.body.appendChild(rail);
  }
  var actions=[
    {icon:'🎮',label:'리듬타일',modal:'tile-modal'},
    {icon:'🎧',label:'코드청음',modal:'chord-ear-modal'},
    {icon:'🔥',label:'히트맵',modal:'heatmap-modal'},
    {icon:'📊',label:'주간리포트',modal:'weekly-modal'},
    {icon:'🗺️',label:'난이도맵',modal:'diffmap-modal'},
    {icon:'🏅',label:'올림피아드',modal:'olympiad-modal'},
    {icon:'🧘',label:'자세클리닉',modal:'posture-modal'},
    {icon:'🎭',label:'스타일분석',modal:'style-modal'}
  ];
  actions.forEach(function(a){
    if(rail.querySelector('[data-v17modal="'+a.modal+'"]')) return;
    var btn=document.createElement('button');
    btn.dataset.v17modal=a.modal;
    btn.style.cssText='width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0';
    btn.title=a.label;
    btn.textContent=a.icon;
    btn.addEventListener('click',function(){
      var m=document.getElementById(a.modal);
      if(m) m.style.display='flex';
    });
    rail.appendChild(btn);
  });
}

// ================ KEYBOARD SHORTCUTS ================
function setupV17Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    switch(e.key){
      case 'T':e.preventDefault();document.getElementById('tile-modal').style.display='flex';break;
      case 'C':e.preventDefault();document.getElementById('chord-ear-modal').style.display='flex';break;
      case 'M':e.preventDefault();document.getElementById('heatmap-modal').style.display='flex';break;
      case 'W':e.preventDefault();document.getElementById('weekly-modal').style.display='flex';break;
      case 'D':e.preventDefault();document.getElementById('diffmap-modal').style.display='flex';break;
      case 'L':e.preventDefault();document.getElementById('olympiad-modal').style.display='flex';break;
      case 'K':e.preventDefault();document.getElementById('posture-modal').style.display='flex';break;
      case 'A':e.preventDefault();document.getElementById('style-modal').style.display='flex';break;
    }
  });
}

// ================ SCROLL NAV BAR v17 ================
function injectV17NavBar(){
  var existing=document.querySelector('.v17-nav-bar');if(existing)return;
  var nav=document.createElement('div');
  nav.className='v17-nav-bar';
  nav.style.cssText='position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);display:flex;overflow-x:auto;z-index:155;padding:4px 8px;gap:4px';
  var items=[
    {label:'🎮 타일',modal:'tile-modal'},
    {label:'🎧 청음',modal:'chord-ear-modal'},
    {label:'🔥 히트맵',modal:'heatmap-modal'},
    {label:'📊 주간',modal:'weekly-modal'},
    {label:'🗺️ 난이도',modal:'diffmap-modal'},
    {label:'🏅 올림피아드',modal:'olympiad-modal'},
    {label:'🧘 자세',modal:'posture-modal'},
    {label:'🎭 스타일',modal:'style-modal'},
    {label:'🧠 퀴즈v8',modal:'quiz8-modal'}
  ];
  items.forEach(function(item){
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap;flex-shrink:0';
    btn.textContent=item.label;
    btn.addEventListener('click',function(){document.getElementById(item.modal).style.display='flex';});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);
}

// ================ INIT ================
function initV17(){
  addV17Songs();
  buildRhythmTileUI();
  buildChordEarUI();
  buildHeatmapUI();
  buildWeeklyReportUI();
  buildDiffMapUI();
  buildOlympiadUI();
  buildPostureUI();
  buildStyleAnalyzerUI();
  buildQuizV8UI();
  injectV17QuickActions();
  injectV17Achievements();
  setupV17Shortcuts();
  injectV17NavBar();
  setInterval(checkV17Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV17,4000);});
else setTimeout(initV17,4000);
})();
