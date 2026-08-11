// Piano Master v29 Patch Module
// Harmonic Progression Simulator, Pedaling Master Class, Musical Form Structure Analyzer,
// Articulation Guide, Transposition Workbench, Key Pressure Heatmap,
// Music History Quiz Battle, Comprehensive Growth Report
// 10 Songs (252->262), Quiz v20 15Q (285->300), 12 Achievements (276->288), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v29Loaded) return;
window.__v29Loaded = true;

var LS29 = 'piano-v29-';
function ls29Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS29+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls29Set(k,v){localStorage.setItem(LS29+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v29 (16 sounds) ================
var sfx29 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone29(freq,type,dur,gainVal,delayMs){
  if(!sfx29) return;
  setTimeout(function(){
    if(!sfx29) return;
    var t=sfx29.currentTime,g=sfx29.createGain(),o=sfx29.createOscillator();
    o.connect(g);g.connect(sfx29.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX29(type){
  if(!sfx29) return;
  if(sfx29.state==='suspended') sfx29.resume();
  switch(type){
    case 'harmony_open': tone29(262,'triangle',0.1,0.06,0); tone29(330,'triangle',0.1,0.06,60); tone29(392,'triangle',0.12,0.06,120); break;
    case 'harmony_play': tone29(262,'sine',0.15,0.08,0); tone29(330,'sine',0.15,0.08,0); tone29(392,'sine',0.15,0.08,0); tone29(523,'sine',0.2,0.08,200); break;
    case 'pedal_open': tone29(220,'triangle',0.2,0.05,0); tone29(330,'triangle',0.15,0.05,100); break;
    case 'pedal_technique': tone29(440,'sine',0.3,0.06,0); tone29(554,'sine',0.25,0.04,50); tone29(659,'sine',0.2,0.04,100); break;
    case 'form_open': tone29(349,'triangle',0.1,0.06,0); tone29(440,'triangle',0.08,0.06,60); break;
    case 'form_select': tone29(523,'triangle',0.08,0.07,0); tone29(659,'triangle',0.1,0.07,70); break;
    case 'artic_open': tone29(392,'sine',0.08,0.06,0); tone29(494,'sine',0.08,0.06,50); break;
    case 'artic_play': tone29(659,'sine',0.12,0.07,0); break;
    case 'transpose_open': tone29(262,'triangle',0.1,0.06,0); tone29(294,'triangle',0.1,0.06,80); tone29(330,'triangle',0.1,0.06,160); break;
    case 'transpose_play': tone29(440,'sine',0.1,0.07,0); tone29(494,'sine',0.1,0.07,60); tone29(554,'sine',0.1,0.07,120); break;
    case 'pressure_open': tone29(330,'triangle',0.1,0.05,0); tone29(392,'triangle',0.08,0.05,50); break;
    case 'history_correct': tone29(659,'triangle',0.08,0.08,0); tone29(784,'triangle',0.1,0.08,60); tone29(1047,'triangle',0.12,0.08,120); break;
    case 'history_wrong': tone29(233,'sawtooth',0.2,0.05,0); tone29(220,'sawtooth',0.2,0.05,100); break;
    case 'growth_open': tone29(523,'triangle',0.1,0.06,0); tone29(659,'triangle',0.08,0.06,80); tone29(784,'triangle',0.08,0.06,160); break;
    case 'v29_achieve': tone29(523,'triangle',0.1,0.1,0); tone29(659,'triangle',0.12,0.1,80); tone29(784,'triangle',0.12,0.1,160); tone29(1047,'triangle',0.25,0.12,240); break;
    case 'quiz_correct29': tone29(698,'triangle',0.1,0.07,0); tone29(880,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v29 ================
function makeV29Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,660px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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

function markV29Feature(name){
  var used=ls29Get('features_used',[]);
  if(used.indexOf(name)<0){used.push(name);ls29Set('features_used',used);}
}

// ================ 10 NEW SONGS (252->262) ================
function addV29Songs(){
  var fn = window.addSong;
  if(!fn) return;
  fn({id:'s253',name:'Debussy - Clair de Lune (Full)',category:'클래식 명곡',diff:'hard',bpm:72,notes:[
    {note:65,time:0,dur:0.8},{note:64,time:0.8,dur:0.4},{note:65,time:1.2,dur:0.8},{note:69,time:2,dur:1.2},
    {note:72,time:3.2,dur:0.8},{note:74,time:4,dur:1},{note:72,time:5,dur:0.6},{note:69,time:5.6,dur:0.6},
    {note:65,time:6.2,dur:0.8},{note:64,time:7,dur:0.4},{note:65,time:7.4,dur:1.2},{note:69,time:8.6,dur:0.8},
    {note:67,time:9.4,dur:1},{note:65,time:10.4,dur:0.6},{note:64,time:11,dur:0.8},{note:60,time:11.8,dur:1.2},
    {note:53,time:0,dur:2},{note:56,time:0,dur:2},{note:60,time:2,dur:2},{note:53,time:2,dur:2},
    {note:55,time:4,dur:2},{note:48,time:4,dur:2},{note:53,time:6,dur:2},{note:56,time:6,dur:2},
    {note:60,time:8,dur:2},{note:53,time:8,dur:2},{note:55,time:10,dur:2},{note:48,time:10,dur:2},
    {note:65,time:13,dur:0.8},{note:69,time:13.8,dur:1.2},{note:72,time:15,dur:1},{note:74,time:16,dur:0.8}
  ]});
  fn({id:'s254',name:'Chopin - Ballade No.1 Op.23',category:'클래식 명곡',diff:'expert',bpm:66,notes:[
    {note:67,time:0,dur:1.5},{note:72,time:1.5,dur:0.5},{note:74,time:2,dur:0.5},{note:75,time:2.5,dur:0.5},
    {note:74,time:3,dur:0.5},{note:72,time:3.5,dur:1},{note:70,time:4.5,dur:0.5},{note:67,time:5,dur:1},
    {note:65,time:6,dur:0.5},{note:67,time:6.5,dur:1.5},{note:70,time:8,dur:0.5},{note:72,time:8.5,dur:0.5},
    {note:74,time:9,dur:1},{note:72,time:10,dur:0.5},{note:70,time:10.5,dur:0.5},{note:67,time:11,dur:1},
    {note:55,time:0,dur:2},{note:62,time:0,dur:2},{note:55,time:2,dur:2},{note:63,time:2,dur:2},
    {note:55,time:4,dur:2},{note:58,time:4,dur:2},{note:55,time:6,dur:2},{note:62,time:6,dur:2},
    {note:65,time:12,dur:0.5},{note:67,time:12.5,dur:0.5},{note:70,time:13,dur:1},{note:72,time:14,dur:1.5},
    {note:74,time:15.5,dur:1},{note:75,time:16.5,dur:0.5},{note:77,time:17,dur:1.5}
  ]});
  fn({id:'s255',name:'Liszt - La Campanella',category:'클래식 명곡',diff:'expert',bpm:140,notes:[
    {note:80,time:0,dur:0.15},{note:85,time:0.15,dur:0.15},{note:80,time:0.3,dur:0.15},{note:85,time:0.45,dur:0.15},
    {note:80,time:0.6,dur:0.15},{note:78,time:0.75,dur:0.15},{note:80,time:0.9,dur:0.3},{note:78,time:1.2,dur:0.15},
    {note:76,time:1.35,dur:0.15},{note:78,time:1.5,dur:0.3},{note:76,time:1.8,dur:0.15},{note:73,time:1.95,dur:0.15},
    {note:76,time:2.1,dur:0.3},{note:73,time:2.4,dur:0.3},{note:71,time:2.7,dur:0.3},{note:68,time:3,dur:0.6},
    {note:56,time:0,dur:0.6},{note:61,time:0,dur:0.6},{note:68,time:0,dur:0.6},{note:56,time:0.6,dur:0.6},
    {note:59,time:0.6,dur:0.6},{note:68,time:0.6,dur:0.6},{note:56,time:1.2,dur:0.6},{note:61,time:1.2,dur:0.6},
    {note:80,time:3.6,dur:0.15},{note:85,time:3.75,dur:0.15},{note:80,time:3.9,dur:0.15},{note:85,time:4.05,dur:0.15},
    {note:87,time:4.2,dur:0.3},{note:85,time:4.5,dur:0.3},{note:80,time:4.8,dur:0.6}
  ]});
  fn({id:'s256',name:'Rachmaninoff - Prelude in C# minor',category:'클래식 명곡',diff:'hard',bpm:72,notes:[
    {note:49,time:0,dur:1.5},{note:61,time:0,dur:1.5},{note:73,time:0,dur:1.5},
    {note:49,time:2,dur:1.5},{note:61,time:2,dur:1.5},{note:73,time:2,dur:1.5},
    {note:49,time:4,dur:1.5},{note:61,time:4,dur:1.5},{note:73,time:4,dur:1.5},
    {note:56,time:6,dur:0.5},{note:58,time:6.5,dur:0.5},{note:59,time:7,dur:0.5},{note:61,time:7.5,dur:0.5},
    {note:63,time:8,dur:1},{note:61,time:9,dur:0.5},{note:59,time:9.5,dur:0.5},{note:58,time:10,dur:1},
    {note:56,time:11,dur:0.5},{note:54,time:11.5,dur:0.5},{note:52,time:12,dur:1},{note:49,time:13,dur:2},
    {note:37,time:0,dur:1.5},{note:37,time:2,dur:1.5},{note:37,time:4,dur:1.5},
    {note:44,time:6,dur:4},{note:37,time:10,dur:2},{note:37,time:13,dur:2}
  ]});
  fn({id:'s257',name:'Schubert - Impromptu Op.90-3',category:'클래식 명곡',diff:'medium',bpm:76,notes:[
    {note:68,time:0,dur:1},{note:67,time:1,dur:0.5},{note:65,time:1.5,dur:0.5},{note:63,time:2,dur:1},
    {note:61,time:3,dur:0.5},{note:63,time:3.5,dur:0.5},{note:65,time:4,dur:1},{note:63,time:5,dur:0.5},
    {note:61,time:5.5,dur:0.5},{note:60,time:6,dur:1},{note:58,time:7,dur:0.5},{note:60,time:7.5,dur:0.5},
    {note:61,time:8,dur:1},{note:63,time:9,dur:0.5},{note:65,time:9.5,dur:0.5},{note:68,time:10,dur:1.5},
    {note:44,time:0,dur:2},{note:56,time:0,dur:2},{note:44,time:2,dur:2},{note:53,time:2,dur:2},
    {note:44,time:4,dur:2},{note:56,time:4,dur:2},{note:44,time:6,dur:2},{note:53,time:6,dur:2},
    {note:44,time:8,dur:2},{note:56,time:8,dur:2},{note:65,time:11.5,dur:0.5},{note:63,time:12,dur:1.5}
  ]});
  fn({id:'s258',name:'Bach - Italian Concerto BWV971',category:'클래식 명곡',diff:'hard',bpm:112,notes:[
    {note:65,time:0,dur:0.25},{note:67,time:0.25,dur:0.25},{note:69,time:0.5,dur:0.25},{note:72,time:0.75,dur:0.5},
    {note:69,time:1.25,dur:0.25},{note:72,time:1.5,dur:0.25},{note:74,time:1.75,dur:0.25},{note:76,time:2,dur:0.5},
    {note:74,time:2.5,dur:0.25},{note:72,time:2.75,dur:0.25},{note:69,time:3,dur:0.5},{note:67,time:3.5,dur:0.25},
    {note:65,time:3.75,dur:0.25},{note:64,time:4,dur:0.5},{note:65,time:4.5,dur:0.25},{note:67,time:4.75,dur:0.25},
    {note:53,time:0,dur:1},{note:57,time:0,dur:1},{note:53,time:1,dur:1},{note:57,time:1,dur:1},
    {note:53,time:2,dur:1},{note:57,time:2,dur:1},{note:48,time:3,dur:1},{note:52,time:3,dur:1},
    {note:69,time:5,dur:0.5},{note:72,time:5.5,dur:0.5},{note:74,time:6,dur:0.5},{note:76,time:6.5,dur:0.25},
    {note:77,time:6.75,dur:0.25},{note:76,time:7,dur:0.5}
  ]});
  fn({id:'s259',name:'Beethoven - Waldstein Sonata Op.53',category:'클래식 명곡',diff:'expert',bpm:120,notes:[
    {note:48,time:0,dur:0.12},{note:52,time:0,dur:0.12},{note:55,time:0,dur:0.12},{note:48,time:0.12,dur:0.12},
    {note:52,time:0.12,dur:0.12},{note:55,time:0.12,dur:0.12},{note:48,time:0.25,dur:0.12},{note:52,time:0.25,dur:0.12},
    {note:55,time:0.25,dur:0.12},{note:48,time:0.37,dur:0.12},{note:52,time:0.37,dur:0.12},{note:55,time:0.37,dur:0.12},
    {note:50,time:0.5,dur:0.12},{note:53,time:0.5,dur:0.12},{note:57,time:0.5,dur:0.12},{note:50,time:0.62,dur:0.12},
    {note:53,time:0.62,dur:0.12},{note:57,time:0.62,dur:0.12},{note:50,time:0.75,dur:0.12},{note:53,time:0.75,dur:0.12},
    {note:57,time:0.75,dur:0.12},{note:50,time:0.87,dur:0.12},{note:53,time:0.87,dur:0.12},{note:57,time:0.87,dur:0.12},
    {note:60,time:1,dur:0.5},{note:64,time:1,dur:0.5},{note:67,time:1,dur:0.5},{note:72,time:1.5,dur:0.5},
    {note:74,time:2,dur:0.25},{note:72,time:2.25,dur:0.25},{note:67,time:2.5,dur:0.5}
  ]});
  fn({id:'s260',name:'Chopin - Fantaisie-Impromptu Op.66',category:'클래식 명곡',diff:'expert',bpm:84,notes:[
    {note:61,time:0,dur:0.12},{note:64,time:0.12,dur:0.12},{note:68,time:0.25,dur:0.12},{note:73,time:0.37,dur:0.12},
    {note:76,time:0.5,dur:0.12},{note:73,time:0.62,dur:0.12},{note:68,time:0.75,dur:0.12},{note:64,time:0.87,dur:0.12},
    {note:61,time:1,dur:0.12},{note:64,time:1.12,dur:0.12},{note:68,time:1.25,dur:0.12},{note:73,time:1.37,dur:0.12},
    {note:76,time:1.5,dur:0.12},{note:80,time:1.62,dur:0.12},{note:76,time:1.75,dur:0.12},{note:73,time:1.87,dur:0.12},
    {note:37,time:0,dur:0.33},{note:49,time:0,dur:0.33},{note:44,time:0.33,dur:0.33},{note:49,time:0.33,dur:0.33},
    {note:37,time:0.66,dur:0.34},{note:49,time:0.66,dur:0.34},{note:37,time:1,dur:0.33},{note:49,time:1,dur:0.33},
    {note:68,time:2,dur:0.12},{note:73,time:2.12,dur:0.12},{note:76,time:2.25,dur:0.12},{note:80,time:2.37,dur:0.12},
    {note:85,time:2.5,dur:0.25},{note:80,time:2.75,dur:0.12},{note:76,time:2.87,dur:0.12}
  ]});
  fn({id:'s261',name:'Mozart - Rondo Alla Turca K.331',category:'클래식 명곡',diff:'medium',bpm:130,notes:[
    {note:71,time:0,dur:0.12},{note:69,time:0.12,dur:0.12},{note:71,time:0.25,dur:0.12},{note:69,time:0.37,dur:0.12},
    {note:71,time:0.5,dur:0.12},{note:66,time:0.62,dur:0.12},{note:69,time:0.75,dur:0.12},{note:66,time:0.87,dur:0.12},
    {note:64,time:1,dur:0.5},{note:57,time:1.5,dur:0.12},{note:60,time:1.62,dur:0.12},{note:64,time:1.75,dur:0.12},
    {note:66,time:1.87,dur:0.12},{note:69,time:2,dur:0.5},{note:64,time:2.5,dur:0.12},{note:66,time:2.62,dur:0.12},
    {note:69,time:2.75,dur:0.12},{note:71,time:2.87,dur:0.12},{note:73,time:3,dur:0.5},
    {note:71,time:3.5,dur:0.12},{note:69,time:3.62,dur:0.12},{note:71,time:3.75,dur:0.12},{note:69,time:3.87,dur:0.12},
    {note:71,time:4,dur:0.12},{note:66,time:4.12,dur:0.12},{note:69,time:4.25,dur:0.12},{note:66,time:4.37,dur:0.12},
    {note:64,time:4.5,dur:0.5},{note:57,time:5,dur:0.12},{note:60,time:5.12,dur:0.12},{note:64,time:5.25,dur:0.5}
  ]});
  fn({id:'s262',name:'Grieg - Piano Concerto in A minor',category:'클래식 명곡',diff:'expert',bpm:92,notes:[
    {note:81,time:0,dur:0.15},{note:80,time:0.15,dur:0.15},{note:81,time:0.3,dur:0.15},{note:69,time:0.45,dur:0.8},
    {note:57,time:0.45,dur:0.8},{note:45,time:0.45,dur:0.8},
    {note:76,time:1.5,dur:0.15},{note:75,time:1.65,dur:0.15},{note:76,time:1.8,dur:0.15},{note:64,time:1.95,dur:0.8},
    {note:52,time:1.95,dur:0.8},{note:40,time:1.95,dur:0.8},
    {note:72,time:3,dur:0.15},{note:71,time:3.15,dur:0.15},{note:72,time:3.3,dur:0.15},{note:60,time:3.45,dur:0.8},
    {note:48,time:3.45,dur:0.8},{note:36,time:3.45,dur:0.8},
    {note:69,time:4.5,dur:1},{note:57,time:4.5,dur:1},{note:45,time:4.5,dur:1},{note:33,time:4.5,dur:1},
    {note:69,time:5.5,dur:0.25},{note:72,time:5.75,dur:0.25},{note:76,time:6,dur:0.5},{note:81,time:6.5,dur:1}
  ]});
}

// ================ FEATURE 1: HARMONIC PROGRESSION SIMULATOR ================
function buildHarmonicProgSimUI(){
  var progs = [
    {name:'I-IV-V-I', label:'정격 종지', chords:['C','F','G','C'], tension:[0.2,0.5,0.8,0.1], desc:'가장 기본적인 종지형'},
    {name:'I-vi-IV-V', label:'팝 순환', chords:['C','Am','F','G'], tension:[0.2,0.4,0.5,0.7], desc:'50년대 팝 음악의 핵심'},
    {name:'ii-V-I', label:'재즈 표준', chords:['Dm','G','C'], tension:[0.4,0.7,0.1], desc:'재즈 화성의 기초'},
    {name:'I-V-vi-IV', label:'애닔 4코드', chords:['C','G','Am','F'], tension:[0.2,0.6,0.5,0.4], desc:'현대 팝의 가장 많은 진행'},
    {name:'I-IV-vi-V', label:'감성 순환', chords:['C','F','Am','G'], tension:[0.2,0.5,0.6,0.7], desc:'감성적인 발라드에 활용'},
    {name:'vi-IV-I-V', label:'단조 드라마', chords:['Am','F','C','G'], tension:[0.6,0.5,0.2,0.7], desc:'단조 시작의 드라마틱 효과'},
    {name:'I-III-IV-iv', label:'크로마틱', chords:['C','E','F','Fm'], tension:[0.2,0.6,0.5,0.7], desc:'장조-단조 전환 효과'},
    {name:'I-bVII-IV-I', label:'록 케이던스', chords:['C','Bb','F','C'], tension:[0.2,0.5,0.4,0.1], desc:'록 음악의 파워코드'}
  ];
  makeV29Modal('harmony-sim-modal','🎵 화성진행 시뮬레이터',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d'), selIdx=0;
    var colors=['#4a7dff','#22c55e','#ef4444','#eab308','#a855f7','#06b6d4','#f97316','#ec4899'];
    function draw(){
      ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      var p=progs[selIdx];
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(p.name+' - '+p.label, 310, 25);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText(p.desc, 310, 42);
      var nc=p.chords.length, nodeW=60, spacing=620/(nc+1);
      for(var i=0;i<nc;i++){
        var x=spacing*(i+1), y=120;
        if(i<nc-1){
          ctx.beginPath();ctx.moveTo(x+nodeW/2,y);ctx.lineTo(spacing*(i+2)-nodeW/2,y);
          ctx.strokeStyle='rgba(74,125,255,0.4)';ctx.lineWidth=2;
          var headLen=10;var angle=0;
          ctx.stroke();
          ctx.beginPath();ctx.moveTo(spacing*(i+2)-nodeW/2,y);
          ctx.lineTo(spacing*(i+2)-nodeW/2-headLen*Math.cos(angle-0.4),y-headLen*Math.sin(angle-0.4));
          ctx.lineTo(spacing*(i+2)-nodeW/2-headLen*Math.cos(angle+0.4),y+headLen*Math.sin(angle+0.4));
          ctx.closePath();ctx.fillStyle='rgba(74,125,255,0.6)';ctx.fill();
        }
        var grad=ctx.createRadialGradient(x,y,0,x,y,nodeW/2);
        grad.addColorStop(0,colors[i%8]);grad.addColorStop(1,'rgba(0,0,0,0.3)');
        ctx.beginPath();ctx.arc(x,y,nodeW/2,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
        ctx.strokeStyle=colors[i%8];ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(p.chords[i],x,y);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textBaseline='top';
        ctx.fillText(i===0?'Tonic':i===nc-1?'Resolution':'Step '+(i+1), x, y+38);
      }
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('Tension / Resolution', 20, 200);
      var graphY=220, graphH=100, graphW=580;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var g=0;g<=4;g++){
        var gy=graphY+graphH-g*(graphH/4);
        ctx.beginPath();ctx.moveTo(20,gy);ctx.lineTo(600,gy);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText((g*25)+'%',18,gy+3);
      }
      ctx.beginPath();
      for(var t=0;t<p.tension.length;t++){
        var tx=20+t*(graphW/(p.tension.length-1||1)), ty=graphY+graphH-p.tension[t]*graphH;
        if(t===0)ctx.moveTo(tx,ty);else ctx.lineTo(tx,ty);
      }
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=3;ctx.stroke();
      var gradFill=ctx.createLinearGradient(0,graphY,0,graphY+graphH);
      gradFill.addColorStop(0,'rgba(74,125,255,0.3)');gradFill.addColorStop(1,'rgba(74,125,255,0)');
      ctx.lineTo(20+(p.tension.length-1)*(graphW/(p.tension.length-1||1)),graphY+graphH);
      ctx.lineTo(20,graphY+graphH);ctx.closePath();ctx.fillStyle=gradFill;ctx.fill();
      for(var t=0;t<p.tension.length;t++){
        var tx=20+t*(graphW/(p.tension.length-1||1)), ty=graphY+graphH-p.tension[t]*graphH;
        ctx.beginPath();ctx.arc(tx,ty,5,0,Math.PI*2);ctx.fillStyle=colors[t%8];ctx.fill();
        ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
        ctx.fillText(p.chords[t],tx,ty+8);
      }
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('← 클릭으로 진행 전환 | 프로그레션 '+(selIdx+1)+'/'+progs.length+' →', 310, 380);
    }
    function onClick(e){
      var rect=cvs.getBoundingClientRect(),x=(e.clientX||e.touches[0].clientX)-rect.left;
      x=x*(620/rect.width);
      if(x>310){selIdx=(selIdx+1)%progs.length;}else{selIdx=(selIdx-1+progs.length)%progs.length;}
      playSFX29('harmony_play');markV29Feature('harmony_sim');draw();
    }
    cvs.addEventListener('click',onClick);
    cvs.addEventListener('touchstart',function(e){e.preventDefault();onClick(e);},{passive:false});
    playSFX29('harmony_open');draw();
  });
}

// ================ FEATURE 2: PEDALING MASTER CLASS ================
function buildPedalingMasterUI(){
  var techniques = [
    {name:'Legato Pedal',kr:'레가토 페달',desc:'음이 끄기지 않게 연결',axes:[90,70,60,80,75,85]},
    {name:'Syncopated',kr:'싱코페이티드',desc:'음 직후 밟아 전음 연결',axes:[80,85,70,75,80,90]},
    {name:'Flutter Pedal',kr:'플러터 페달',desc:'빠르게 반복 답아 음색 조절',axes:[60,90,85,65,70,75]},
    {name:'Half Pedal',kr:'하프 페달',desc:'반만 밟아 부분 댄퍼',axes:[75,75,80,90,65,70]},
    {name:'Quarter Pedal',kr:'쿼터 페달',desc:'1/4 깊이로 섬세한 조절',axes:[65,65,85,95,60,65]},
    {name:'Delayed Pedal',kr:'딘레이 페달',desc:'음 후 지연 적용',axes:[85,80,65,70,85,80]},
    {name:'Pre-Pedal',kr:'프리 페달',desc:'음 전 미리 밟아 공명 준비',axes:[70,70,75,80,90,85]},
    {name:'Graduated',kr:'그라듀에이티드',desc:'점진적 깊이 변화',axes:[80,85,90,85,70,80]}
  ];
  var axisLabels = ['정확도','타이밍','섬세함','컨트롤','음색효과','활용도'];
  makeV29Modal('pedaling-master-modal','🦶 페달링 마스터클래스',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d'), selIdx=0;
    function drawRadar(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      var t=techniques[selIdx], cx=310, cy=190, r=120, n=6;
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(t.name+' ('+t.kr+')', cx, 25);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.fillText(t.desc, cx, 42);
      for(var ring=1;ring<=4;ring++){
        ctx.beginPath();
        for(var i=0;i<=n;i++){
          var angle=-Math.PI/2+i*(2*Math.PI/n), rx=cx+r*(ring/4)*Math.cos(angle), ry=cy+r*(ring/4)*Math.sin(angle);
          if(i===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
        }
        ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.stroke();
      }
      for(var i=0;i<n;i++){
        var angle=-Math.PI/2+i*(2*Math.PI/n);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(angle),cy+r*Math.sin(angle));
        ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.stroke();
        var lx=cx+(r+18)*Math.cos(angle), ly=cy+(r+18)*Math.sin(angle);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(axisLabels[i],lx,ly);
      }
      ctx.beginPath();
      for(var i=0;i<=n;i++){
        var idx=i%n, angle=-Math.PI/2+idx*(2*Math.PI/n);
        var val=t.axes[idx]/100;
        var px=cx+r*val*Math.cos(angle), py=cy+r*val*Math.sin(angle);
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.fillStyle='rgba(74,125,255,0.2)';ctx.fill();
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.stroke();
      for(var i=0;i<n;i++){
        var angle=-Math.PI/2+i*(2*Math.PI/n);
        var val=t.axes[i]/100;
        var px=cx+r*val*Math.cos(angle), py=cy+r*val*Math.sin(angle);
        ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#4a7dff';ctx.fill();
      }
      var barY=340;
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';ctx.textAlign='left';
      ctx.fillText('난이도:', 20, barY);
      var diff=Math.round((t.axes[2]+t.axes[3])/2);
      var grade=diff>=85?'S':diff>=70?'A':diff>=55?'B':diff>=40?'C':'D';
      var gc=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#4a7dff':grade==='C'?'#f97316':'#ef4444';
      ctx.fillStyle=gc;ctx.font='bold 18px sans-serif';ctx.fillText(grade, 80, barY+2);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('← 클릭으로 테크닉 전환 ('+(selIdx+1)+'/'+techniques.length+') →', 310, 385);
    }
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect(),x=(e.clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%techniques.length;else selIdx=(selIdx-1+techniques.length)%techniques.length;
      playSFX29('pedal_technique');markV29Feature('pedaling');drawRadar();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      var rect=cvs.getBoundingClientRect(),x=(e.touches[0].clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%techniques.length;else selIdx=(selIdx-1+techniques.length)%techniques.length;
      playSFX29('pedal_technique');markV29Feature('pedaling');drawRadar();
    },{passive:false});
    playSFX29('pedal_open');drawRadar();
  });
}

// ================ FEATURE 3: MUSICAL FORM STRUCTURE ANALYZER ================
function buildMusicalFormUI(){
  var forms = [
    {name:'Binary (AB)', sections:['A','B'], colors:['#4a7dff','#22c55e'], widths:[50,50], example:'Bach - Minuet in G'},
    {name:'Ternary (ABA)', sections:['A','B','A\''], colors:['#4a7dff','#22c55e','#4a7dff'], widths:[35,30,35], example:'Chopin - Nocturne Op.9-2'},
    {name:'Rondo (ABACA)', sections:['A','B','A','C','A'], colors:['#4a7dff','#22c55e','#4a7dff','#eab308','#4a7dff'], widths:[20,20,20,20,20], example:'Beethoven - Für Elise'},
    {name:'Sonata', sections:['Expo','Dev','Recap','Coda'], colors:['#4a7dff','#ef4444','#a855f7','#06b6d4'], widths:[30,25,30,15], example:'Mozart - Sonata K.545'},
    {name:'Theme & Variations', sections:['Theme','Var1','Var2','Var3','Var4'], colors:['#4a7dff','#22c55e','#eab308','#ef4444','#a855f7'], widths:[20,20,20,20,20], example:'Mozart - Ah vous dirai-je'},
    {name:'Fugue', sections:['Expo','Episode1','MiddleEntry','Episode2','Stretto'], colors:['#4a7dff','#06b6d4','#22c55e','#06b6d4','#eab308'], widths:[25,15,25,15,20], example:'Bach - WTC Fugue 1'},
    {name:'Minuet & Trio', sections:['Minuet','Trio','Minuet DC'], colors:['#4a7dff','#22c55e','#4a7dff'], widths:[35,30,35], example:'Mozart - Symphony No.40'},
    {name:'Scherzo', sections:['Scherzo','Trio','Scherzo DC','Coda'], colors:['#ef4444','#22c55e','#ef4444','#06b6d4'], widths:[30,25,30,15], example:'Beethoven - Symphony No.5'},
    {name:'Concerto', sections:['Orch Expo','Solo Expo','Dev','Recap','Cadenza','Coda'], colors:['#a855f7','#4a7dff','#ef4444','#a855f7','#eab308','#06b6d4'], widths:[15,25,15,20,15,10], example:'Grieg - Piano Concerto'},
    {name:'Through-composed', sections:['A','B','C','D','E'], colors:['#4a7dff','#22c55e','#eab308','#ef4444','#a855f7'], widths:[20,20,20,20,20], example:'Schubert - Erlkönig'}
  ];
  makeV29Modal('form-analyzer-modal','🎼 음악형식 구조 분석기',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d'), selIdx=0;
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      var f=forms[selIdx];
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(f.name, 310, 25);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('대표작: '+f.example, 310, 42);
      var blockY=70, blockH=80, totalW=580, startX=20;
      var cumX=startX;
      for(var i=0;i<f.sections.length;i++){
        var w=f.widths[i]*totalW/100;
        var grad=ctx.createLinearGradient(cumX,blockY,cumX,blockY+blockH);
        grad.addColorStop(0,f.colors[i]);grad.addColorStop(1,f.colors[i]+'44');
        ctx.fillStyle=grad;
        ctx.beginPath();
        ctx.roundRect(cumX+2,blockY,w-4,blockH,6);
        ctx.fill();
        ctx.strokeStyle=f.colors[i];ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(f.sections[i], cumX+w/2, blockY+blockH/2);
        ctx.fillStyle='#ccc';ctx.font='9px sans-serif';ctx.textBaseline='bottom';
        ctx.fillText(f.widths[i]+'%', cumX+w/2, blockY+blockH+14);
        cumX+=w;
      }
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('섹션 비율 분석', 20, 190);
      var barY=210, barH=20, barMaxW=400;
      for(var i=0;i<f.sections.length;i++){
        var bw=f.widths[i]*barMaxW/100;
        ctx.fillStyle=f.colors[i]+'88';
        ctx.beginPath();ctx.roundRect(120,barY+i*30,bw,barH,4);ctx.fill();
        ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';ctx.textAlign='right';
        ctx.fillText(f.sections[i], 115, barY+i*30+14);
        ctx.textAlign='left';ctx.fillText(f.widths[i]+'%', 125+bw, barY+i*30+14);
      }
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('← 클릭으로 형식 전환 ('+(selIdx+1)+'/'+forms.length+') →', 310, 385);
    }
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect(),x=(e.clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%forms.length;else selIdx=(selIdx-1+forms.length)%forms.length;
      playSFX29('form_select');markV29Feature('musical_form');draw();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      var rect=cvs.getBoundingClientRect(),x=(e.touches[0].clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%forms.length;else selIdx=(selIdx-1+forms.length)%forms.length;
      playSFX29('form_select');markV29Feature('musical_form');draw();
    },{passive:false});
    playSFX29('form_open');draw();
  });
}

// ================ FEATURE 4: ARTICULATION GUIDE ================
function buildArticulationGuideUI(){
  var artics = [
    {name:'Legato',kr:'레가토',sym:'⁀',attack:10,sustain:90,release:30,desc:'음을 부드럽게 연결'},
    {name:'Staccato',kr:'스타카토',sym:'·',attack:90,sustain:15,release:80,desc:'음을 짧게 끊어서'},
    {name:'Staccatissimo',kr:'스타카티시모',sym:'▴',attack:95,sustain:5,release:95,desc:'극도로 짧게'},
    {name:'Tenuto',kr:'테누토',sym:'–',attack:40,sustain:95,release:20,desc:'음가 길이만큼 충분히'},
    {name:'Accent',kr:'액센트',sym:'>',attack:85,sustain:60,release:50,desc:'강하게 강조'},
    {name:'Marcato',kr:'마르카토',sym:'^',attack:95,sustain:50,release:60,desc:'매우 강하게'},
    {name:'Sforzando',kr:'스포르찬도',sym:'sfz',attack:100,sustain:40,release:70,desc:'갑작스럽게 강하게'},
    {name:'Portato',kr:'포르타토',sym:'–·',attack:50,sustain:70,release:40,desc:'레가토+스타카토 중간'},
    {name:'Fermata',kr:'페르마타',sym:'🎵',attack:30,sustain:100,release:10,desc:'음을 원하는 만큼 늘임'},
    {name:'Trill',kr:'트릴',sym:'tr',attack:70,sustain:80,release:50,desc:'두 음 번갈아 빠르게'},
    {name:'Mordent',kr:'모르덴트',sym:'∼',attack:80,sustain:30,release:60,desc:'인접음 바르게 경과'},
    {name:'Turn',kr:'턴',sym:'~',attack:60,sustain:40,release:50,desc:'위아래 음 순환'}
  ];
  makeV29Modal('artic-guide-modal','🎹 아티큐레이션 가이드',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d'), selIdx=0;
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      var a=artics[selIdx];
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(a.name+' ('+a.kr+')', 310, 25);
      ctx.fillStyle='#eab308';ctx.font='bold 28px sans-serif';ctx.fillText(a.sym, 310, 60);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.fillText(a.desc, 310, 82);
      var envY=110, envH=100, envW=400, sx=110;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      ctx.strokeRect(sx,envY,envW,envH);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText('Attack',sx+envW*0.15,envY+envH+14);
      ctx.fillText('Sustain',sx+envW*0.5,envY+envH+14);
      ctx.fillText('Release',sx+envW*0.85,envY+envH+14);
      ctx.beginPath();
      ctx.moveTo(sx, envY+envH);
      var aPeak=envY+envH-(a.attack/100)*envH;
      ctx.lineTo(sx+envW*0.2, aPeak);
      var sLevel=envY+envH-(a.sustain/100)*envH;
      ctx.lineTo(sx+envW*0.3, sLevel);
      ctx.lineTo(sx+envW*0.7, sLevel);
      var rEnd=envY+envH-(100-a.release)/100*envH;
      ctx.lineTo(sx+envW, envY+envH);
      var grad2=ctx.createLinearGradient(sx,envY,sx,envY+envH);
      grad2.addColorStop(0,'rgba(74,125,255,0.4)');grad2.addColorStop(1,'rgba(74,125,255,0.05)');
      ctx.fillStyle=grad2;ctx.fill();
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2.5;ctx.stroke();
      var metrics=[{label:'Attack',val:a.attack},{label:'Sustain',val:a.sustain},{label:'Release',val:a.release}];
      var barY=260, barH=16;
      for(var i=0;i<3;i++){
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='right';
        ctx.fillText(metrics[i].label, 105, barY+i*35+12);
        ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(115,barY+i*35,380,barH,4);ctx.fill();
        var gc=metrics[i].val>=80?'#ef4444':metrics[i].val>=50?'#eab308':'#22c55e';
        ctx.fillStyle=gc;ctx.beginPath();ctx.roundRect(115,barY+i*35,380*metrics[i].val/100,barH,4);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
        ctx.fillText(metrics[i].val+'%', 120+380*metrics[i].val/100, barY+i*35+12);
      }
      var total=Math.round((a.attack+a.sustain+(100-a.release))/3);
      var grade=total>=80?'S':total>=65?'A':total>=50?'B':total>=35?'C':'D';
      ctx.fillStyle=grade==='S'?'#eab308':grade==='A'?'#22c55e':'#4a7dff';
      ctx.font='bold 24px sans-serif';ctx.textAlign='right';ctx.fillText(grade, 600, 390);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('← ('+(selIdx+1)+'/'+artics.length+') →', 310, 385);
    }
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect(),x=(e.clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%artics.length;else selIdx=(selIdx-1+artics.length)%artics.length;
      playSFX29('artic_play');markV29Feature('articulation');draw();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      var rect=cvs.getBoundingClientRect(),x=(e.touches[0].clientX-rect.left)*(620/rect.width);
      if(x>310)selIdx=(selIdx+1)%artics.length;else selIdx=(selIdx-1+artics.length)%artics.length;
      playSFX29('artic_play');markV29Feature('articulation');draw();
    },{passive:false});
    playSFX29('artic_open');draw();
  });
}

// ================ FEATURE 5: TRANSPOSITION WORKBENCH ================
function buildTranspositionUI(){
  var keys=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  var melody=[60,62,64,65,67,69,71,72];
  var noteNames=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  makeV29Modal('transpose-bench-modal','🔑 조옴김 워크벤치',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d'), selKey=0;
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('조옴김 워크벤치 - '+keys[selKey]+' Major', 310, 25);
      var gridY=50, cellW=48, cellH=26;
      for(var k=0;k<12;k++){
        var gx=14+k*cellW;
        ctx.fillStyle=k===selKey?'#4a7dff':'#1e2640';
        ctx.beginPath();ctx.roundRect(gx,gridY,cellW-4,cellH,4);ctx.fill();
        ctx.fillStyle=k===selKey?'#fff':'#8892a8';ctx.font=(k===selKey?'bold ':'')+' 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(keys[k],gx+cellW/2-2,gridY+16);
      }
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='left';
      ctx.fillText('원래 멜로디 (C Major):', 20, 105);
      var staffY=120, noteSpacing=70;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var l=0;l<5;l++){ctx.beginPath();ctx.moveTo(20,staffY+l*8);ctx.lineTo(600,staffY+l*8);ctx.stroke();}
      for(var n=0;n<melody.length;n++){
        var nx=60+n*noteSpacing, noteIdx=melody[n]%12;
        var linePos=staffY+32-(melody[n]-60)*3;
        ctx.beginPath();ctx.ellipse(nx,linePos,7,5,0,0,Math.PI*2);ctx.fillStyle='#4a7dff';ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(noteNames[noteIdx],nx,linePos+16);
      }
      ctx.fillStyle='#22c55e';ctx.font='11px sans-serif';ctx.textAlign='left';
      ctx.fillText('조옴김 결과 ('+keys[selKey]+' Major):', 20, 205);
      var staff2Y=220;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var l=0;l<5;l++){ctx.beginPath();ctx.moveTo(20,staff2Y+l*8);ctx.lineTo(600,staff2Y+l*8);ctx.stroke();}
      for(var n=0;n<melody.length;n++){
        var transposed=melody[n]+selKey;
        var nx=60+n*noteSpacing, noteIdx=transposed%12;
        var linePos=staff2Y+32-(transposed-60)*3;
        linePos=Math.max(staff2Y-10,Math.min(staff2Y+50,linePos));
        ctx.beginPath();ctx.ellipse(nx,linePos,7,5,0,0,Math.PI*2);ctx.fillStyle='#22c55e';ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(noteNames[noteIdx],nx,linePos+16);
      }
      var interval=selKey;
      var intColors=['#22c55e','#06b6d4','#3b82f6','#a855f7','#eab308','#f97316','#ef4444','#ec4899','#8b5cf6','#14b8a6','#84cc16','#f43f5e'];
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('음정 거리: +'+interval+' 반음', 20, 310);
      var distBar=selKey*480/11;
      ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(20,320,480,14,4);ctx.fill();
      ctx.fillStyle=intColors[selKey];ctx.beginPath();ctx.roundRect(20,320,Math.max(distBar,8),14,4);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('← 클릭으로 조 전환 →', 310, 385);
    }
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect(),x=(e.clientX-rect.left)*(620/rect.width);
      if(x>310)selKey=(selKey+1)%12;else selKey=(selKey+11)%12;
      playSFX29('transpose_play');markV29Feature('transposition');draw();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      var rect=cvs.getBoundingClientRect(),x=(e.touches[0].clientX-rect.left)*(620/rect.width);
      if(x>310)selKey=(selKey+1)%12;else selKey=(selKey+11)%12;
      playSFX29('transpose_play');markV29Feature('transposition');draw();
    },{passive:false});
    playSFX29('transpose_open');draw();
  });
}

// ================ FEATURE 6: KEY PRESSURE HEATMAP ================
function buildKeyPressureUI(){
  makeV29Modal('pressure-heatmap-modal','🔥 건반압력 히트맵',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d');
    var pressureData=[];
    for(var i=0;i<61;i++){
      pressureData.push(ls29Get('pressure_'+i, Math.floor(Math.random()*80)+20));
    }
    function heatColor(val){
      if(val<30)return 'rgba(59,130,246,0.6)';
      if(val<50)return 'rgba(34,197,94,0.6)';
      if(val<70)return 'rgba(234,179,8,0.7)';
      if(val<85)return 'rgba(249,115,22,0.8)';
      return 'rgba(239,68,68,0.9)';
    }
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('건반 압력 히트맵 (61건반)', 310, 25);
      var whiteKeys=[0,2,3,5,7,8,10,12,14,15,17,19,20,22,24,26,27,29,31,32,34,36,38,39,41,43,44,46,48,50,51,53,55,56,58,60];
      var blackKeys=[1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59];
      var kw=16, kh=90, startX=10, startY=50;
      var wIdx=0;
      for(var i=0;i<36;i++){
        var x=startX+i*kw;
        var keyIdx=whiteKeys[i];
        var val=pressureData[keyIdx];
        ctx.fillStyle='#e8e8e8';
        ctx.fillRect(x,startY,kw-1,kh);
        ctx.fillStyle=heatColor(val);
        ctx.fillRect(x,startY,kw-1,kh);
        ctx.strokeStyle='#aaa';ctx.lineWidth=0.5;ctx.strokeRect(x,startY,kw-1,kh);
      }
      var blackPositions=[0.7,1.7,3.7,4.7,5.7,7.7,8.7,10.7,11.7,12.7,14.7,15.7,17.7,18.7,19.7,21.7,22.7,24.7,25.7,26.7,28.7,29.7,31.7,32.7,33.7];
      for(var b=0;b<blackKeys.length&&b<blackPositions.length;b++){
        var x=startX+blackPositions[b]*kw;
        var keyIdx=blackKeys[b];
        var val=pressureData[keyIdx];
        ctx.fillStyle='#2a2a3e';ctx.fillRect(x,startY,kw*0.6,kh*0.6);
        ctx.fillStyle=heatColor(val);ctx.fillRect(x,startY,kw*0.6,kh*0.6);
        ctx.strokeStyle='#000';ctx.lineWidth=0.5;ctx.strokeRect(x,startY,kw*0.6,kh*0.6);
      }
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('손 밸런스', 20, 170);
      var leftSum=0,rightSum=0,leftCount=0,rightCount=0;
      for(var i=0;i<61;i++){
        if(i<30){leftSum+=pressureData[i];leftCount++;}
        else{rightSum+=pressureData[i];rightCount++;}
      }
      var leftAvg=Math.round(leftSum/leftCount), rightAvg=Math.round(rightSum/rightCount);
      var total=leftAvg+rightAvg;
      var leftPct=Math.round(leftAvg*100/total), rightPct=100-leftPct;
      ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(20,180,580,24,6);ctx.fill();
      ctx.fillStyle='#3b82f6';ctx.beginPath();ctx.roundRect(20,180,580*leftPct/100,24,6);ctx.fill();
      ctx.fillStyle='#22c55e';ctx.beginPath();ctx.roundRect(20+580*leftPct/100,180,580*rightPct/100,24,6);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText('왼손 '+leftPct+'%', 20+580*leftPct/200, 196);
      ctx.fillText('오른손 '+rightPct+'%', 20+580*leftPct/100+580*rightPct/200, 196);
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('압력 분포', 20, 230);
      var ranges=[{label:'약(0-30)',color:'rgba(59,130,246,0.6)'},{label:'중(30-50)',color:'rgba(34,197,94,0.6)'},{label:'강(50-70)',color:'rgba(234,179,8,0.7)'},{label:'강한(70-85)',color:'rgba(249,115,22,0.8)'},{label:'최강(85+)',color:'rgba(239,68,68,0.9)'}];
      var counts=[0,0,0,0,0];
      for(var i=0;i<61;i++){
        var v=pressureData[i];
        if(v<30)counts[0]++;else if(v<50)counts[1]++;else if(v<70)counts[2]++;else if(v<85)counts[3]++;else counts[4]++;
      }
      for(var r=0;r<5;r++){
        var bw=counts[r]*8;
        ctx.fillStyle=ranges[r].color;ctx.beginPath();ctx.roundRect(120,245+r*28,bw,18,4);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='right';ctx.fillText(ranges[r].label,115,245+r*28+13);
        ctx.textAlign='left';ctx.fillText(counts[r]+'건',125+bw,245+r*28+13);
      }
      var weakFingers=[];
      for(var i=0;i<61;i++){if(pressureData[i]<25)weakFingers.push(i);}
      if(weakFingers.length>0){
        ctx.fillStyle='#ef4444';ctx.font='11px sans-serif';ctx.textAlign='left';
        ctx.fillText('약한 건반: '+weakFingers.length+'개 발견 (추가 연습 권장)', 20, 390);
      }
    }
    cvs.addEventListener('click',function(){
      for(var i=0;i<61;i++){pressureData[i]=Math.floor(Math.random()*80)+20;ls29Set('pressure_'+i,pressureData[i]);}
      playSFX29('pressure_open');markV29Feature('pressure_map');draw();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      for(var i=0;i<61;i++){pressureData[i]=Math.floor(Math.random()*80)+20;}
      playSFX29('pressure_open');markV29Feature('pressure_map');draw();
    },{passive:false});
    playSFX29('pressure_open');draw();
  });
}

// ================ FEATURE 7: MUSIC HISTORY QUIZ BATTLE ================
function buildMusicHistoryBattleUI(){
  var questions=[
    {q:'바로크 시대의 대표 작곡가는?',a:['J.S. Bach','Mozart','Chopin','Debussy'],correct:0},
    {q:'고전주의 시대는 언제부터?',a:['1600년','1750년','1820년','1900년'],correct:1},
    {q:'난만주의 피아노 작품으로 유명한 작곡가는?',a:['Haydn','Handel','Chopin','Vivaldi'],correct:2},
    {q:'인상주의 음악의 특징은?',a:['엄격한 형식','분위기와 색\cc44','미니멀리즘','전자음향'],correct:1},
    {q:'Debussy의 대표작은?',a:['Moonlight','Clair de Lune','Für Elise','La Campanella'],correct:1},
    {q:'Sonata 형식을 확립한 시대는?',a:['바로크','고전','난만','현대'],correct:1},
    {q:'에튀드(Etude)는 주로 어떤 목적?',a:['감상','연습/학습','춤','종교의식'],correct:1},
    {q:'Liszt는 어느 나라 작곡가?',a:['독일','헝가리','프랑스','이탈리아'],correct:1},
    {q:'피아노포르테는 무슨 뜻?',a:['야하게','세게','빠르게','느리게'],correct:0},
    {q:'12음 기법을 창시한 작곡가는?',a:['Stravinsky','Schoenberg','Bartok','Cage'],correct:1},
    {q:'Rachmaninoff의 국적은?',a:['독일','폴란드','러시아','체코'],correct:2},
    {q:'프레루드는 어떤 음악 형식?',a:['전주곡','춤곡','교향곡','소나타'],correct:0},
    {q:'Beethoven의 수는 몇 번?',a:['7','9','12','5'],correct:1},
    {q:'바로크 시대 특징 악기는?',a:['피아노','하프시코드','기타','드럼'],correct:1},
    {q:'Chopin의 별명은?',a:['음악의 아버지','피아노의 시인','교향곡의 왕','오페라의 왕'],correct:1}
  ];
  makeV29Modal('history-battle-modal','⚔️ 음악사 퀴즈배틀',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d');
    var state={round:0,playerHP:100,aiHP:100,score:0,combo:0,qIdx:0,answered:false,selected:-1,gameOver:false};
    function shuffleQ(){
      for(var i=questions.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=questions[i];questions[i]=questions[j];questions[j]=t;}
    }
    shuffleQ();
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('음악사 퀴즈배틀 - Round '+(state.round+1)+'/5', 310, 25);
      ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';ctx.textAlign='left';ctx.fillText('Player', 20, 55);
      ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(80,44,200,16,4);ctx.fill();
      ctx.fillStyle='#22c55e';ctx.beginPath();ctx.roundRect(80,44,200*state.playerHP/100,16,4);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(state.playerHP+'%',180,57);
      ctx.fillStyle='#ef4444';ctx.font='bold 11px sans-serif';ctx.textAlign='right';ctx.fillText('AI',600,55);
      ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(340,44,200,16,4);ctx.fill();
      ctx.fillStyle='#ef4444';ctx.beginPath();ctx.roundRect(340,44,200*state.aiHP/100,16,4);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(state.aiHP+'%',440,57);
      if(state.gameOver){
        var won=state.playerHP>0;
        ctx.fillStyle=won?'#22c55e':'#ef4444';ctx.font='bold 28px sans-serif';ctx.textAlign='center';
        ctx.fillText(won?'승리! 🏆':'패배...',310,200);
        ctx.fillStyle='#eab308';ctx.font='bold 16px sans-serif';
        ctx.fillText('최종 점수: '+state.score, 310, 240);
        ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
        ctx.fillText('클릭하여 다시 시작', 310, 280);
        return;
      }
      var q=questions[state.qIdx%questions.length];
      ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('Q'+(state.round*3+(state.qIdx%3)+1)+': '+q.q, 310, 100);
      if(state.combo>1){
        ctx.fillStyle='#eab308';ctx.font='bold 12px sans-serif';
        ctx.fillText('🔥 '+state.combo+' Combo!', 310, 120);
      }
      for(var i=0;i<4;i++){
        var bx=60+(i%2)*260, by=140+Math.floor(i/2)*60;
        var isCorrect=i===q.correct;
        var bg='#1e2640';
        if(state.answered){
          bg=isCorrect?'rgba(34,197,94,0.3)':i===state.selected?'rgba(239,68,68,0.3)':'#1e2640';
        }
        ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(bx,by,240,44,8);ctx.fill();
        ctx.strokeStyle=state.answered&&isCorrect?'#22c55e':state.answered&&i===state.selected&&!isCorrect?'#ef4444':'#2a3654';
        ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';ctx.textAlign='center';
        ctx.fillText(q.a[i], bx+120, by+27);
      }
      ctx.fillStyle='#eab308';ctx.font='bold 14px sans-serif';ctx.textAlign='left';
      ctx.fillText('Score: '+state.score, 20, 380);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(state.answered?'클릭하여 다음 문제':'답을 클릭하세요', 310, 390);
    }
    function onClick(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX||(e.touches&&e.touches[0].clientX)||0)-rect.left;
      var my=(e.clientY||(e.touches&&e.touches[0].clientY)||0)-rect.top;
      mx=mx*(620/rect.width);my=my*(400/rect.height);
      if(state.gameOver){
        state={round:0,playerHP:100,aiHP:100,score:0,combo:0,qIdx:0,answered:false,selected:-1,gameOver:false};
        shuffleQ();draw();return;
      }
      if(state.answered){
        state.qIdx++;state.answered=false;state.selected=-1;
        if(state.qIdx%3===0){state.round++;if(state.round>=5||state.playerHP<=0||state.aiHP<=0){state.gameOver=true;}}
        draw();return;
      }
      for(var i=0;i<4;i++){
        var bx=60+(i%2)*260, by=140+Math.floor(i/2)*60;
        if(mx>=bx&&mx<=bx+240&&my>=by&&my<=by+44){
          state.selected=i;state.answered=true;
          var q=questions[state.qIdx%questions.length];
          if(i===q.correct){
            state.combo++;state.score+=10*state.combo;state.aiHP=Math.max(0,state.aiHP-15);
            playSFX29('history_correct');
          } else {
            state.combo=0;state.playerHP=Math.max(0,state.playerHP-20);
            playSFX29('history_wrong');
          }
          if(state.playerHP<=0||state.aiHP<=0)state.gameOver=true;
          markV29Feature('history_battle');
          draw();break;
        }
      }
    }
    cvs.addEventListener('click',onClick);
    cvs.addEventListener('touchstart',function(e){e.preventDefault();onClick(e);},{passive:false});
    draw();
  });
}

// ================ FEATURE 8: COMPREHENSIVE GROWTH REPORT ================
function buildGrowthReportUI(){
  var kpis=[
    {name:'테크닉',val:ls29Get('kpi_tech',65)},
    {name:'리듬',val:ls29Get('kpi_rhythm',72)},
    {name:'초견',val:ls29Get('kpi_sight',58)},
    {name:'이론',val:ls29Get('kpi_theory',70)},
    {name:'표현력',val:ls29Get('kpi_express',63)},
    {name:'레퍼토리',val:ls29Get('kpi_rep',75)},
    {name:'청음',val:ls29Get('kpi_ear',68)},
    {name:'일관성',val:ls29Get('kpi_consist',60)}
  ];
  makeV29Modal('growth-report-modal','📊 종합 연주 성장 리포트',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d');
    var colors=['#4a7dff','#22c55e','#eab308','#ef4444','#a855f7','#06b6d4','#f97316','#ec4899'];
    function drawGauge(cx,cy,r,val,label,color){
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI,0);ctx.strokeStyle='#1e2640';ctx.lineWidth=8;ctx.stroke();
      var angle=-Math.PI+Math.PI*(val/100);
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI,angle);ctx.strokeStyle=color;ctx.lineWidth=8;ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(val, cx, cy-6);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(label, cx, cy+12);
      var grade=val>=85?'S':val>=70?'A':val>=55?'B':val>=40?'C':'D';
      var gc=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#4a7dff':grade==='C'?'#f97316':'#ef4444';
      ctx.fillStyle=gc;ctx.font='bold 10px sans-serif';ctx.fillText(grade, cx, cy+24);
    }
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('종합 연주 성장 리포트', 310, 25);
      var positions=[[85,100],[235,100],[385,100],[535,100],[85,220],[235,220],[385,220],[535,220]];
      for(var i=0;i<8;i++){
        drawGauge(positions[i][0],positions[i][1],38,kpis[i].val,kpis[i].name,colors[i]);
      }
      var weights=[0.15,0.15,0.1,0.1,0.15,0.1,0.1,0.15];
      var weightedSum=0;
      for(var i=0;i<8;i++) weightedSum+=kpis[i].val*weights[i];
      var total=Math.round(weightedSum);
      var totalGrade=total>=85?'S':total>=70?'A':total>=55?'B':total>=40?'C':'D';
      var tgc=totalGrade==='S'?'#eab308':totalGrade==='A'?'#22c55e':totalGrade==='B'?'#4a7dff':totalGrade==='C'?'#f97316':'#ef4444';
      ctx.fillStyle='#1e2640';ctx.beginPath();ctx.roundRect(200,310,220,50,10);ctx.fill();
      ctx.strokeStyle=tgc;ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle=tgc;ctx.font='bold 24px sans-serif';ctx.textAlign='center';
      ctx.fillText('종합 '+totalGrade+' ('+total+'점)', 310, 342);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('클릭하여 러덤 시뮬레이션', 310, 385);
    }
    cvs.addEventListener('click',function(){
      for(var i=0;i<8;i++){kpis[i].val=Math.floor(Math.random()*40)+55;ls29Set('kpi_'+['tech','rhythm','sight','theory','express','rep','ear','consist'][i],kpis[i].val);}
      playSFX29('growth_open');markV29Feature('growth_report');draw();
    });
    cvs.addEventListener('touchstart',function(e){e.preventDefault();
      for(var i=0;i<8;i++){kpis[i].val=Math.floor(Math.random()*40)+55;}
      playSFX29('growth_open');markV29Feature('growth_report');draw();
    },{passive:false});
    playSFX29('growth_open');draw();
  });
}

// ================ QUIZ v20 (+15 questions, 285->300) ================
function buildQuizV20UI(){
  var quizQ=[
    {q:'I-IV-V-I 진행의 이름은?',a:['정격 종지','변격 종지','반종지','평행 종지'],c:0},
    {q:'레가토 페달링의 목적은?',a:['음량 증가','음 연결','빠른 리듬','음색 변화'],c:1},
    {q:'Sonata 형식의 3부분은?',a:['제시-발전-재현','서론-본론-결론','도입-전개-종결','A-B-A'],c:0},
    {q:'Staccato의 의미는?',a:['길게','짧게 끊어서','강하게','느리게'],c:1},
    {q:'조옴김(Transposition)은 무엇을 바꿨?',a:['음량','조(Key)','박자','빠르기'],c:1},
    {q:'Velocity는 건반의 어떤 속성?',a:['누르는 세기','누르는 시간','누르는 위치','누른 횟수'],c:0},
    {q:'Rondo 형식의 구조는?',a:['ABA','ABACA','AB','ABCD'],c:1},
    {q:'Sforzando(sfz)의 의미는?',a:['느리게','야하게','갑자기 강하게','점점 크게'],c:2},
    {q:'ii-V-I은 어떤 장르의 표준 진행?',a:['록','재즈','클래식','팝'],c:1},
    {q:'Fermata는 무엇을 의미?',a:['빠르게','음을 늘임','반복','끝'],c:1},
    {q:'Flutter Pedal은 어떤 테크닉?',a:['반만 밟기','빠르게 반복','느리게 밟기','안 밟기'],c:1},
    {q:'Binary Form의 구조는?',a:['ABA','AB','ABACA','A'],c:1},
    {q:'Mordent는 어떤 장식음?',a:['위아래 빠른 경과','긴 트릴','짧은 음','긴 음'],c:0},
    {q:'Concerto의 Cadenza는 어떤 부분?',a:['관현악 도입','독주자 자유연주','합주 피날레','지휘자 독주'],c:1},
    {q:'종합 성장 리포트의 S등급 기준은?',a:['50점 이상','70점 이상','85점 이상','100점'],c:2}
  ];
  makeV29Modal('quiz20-modal','❓ 퀴즈 v20 (15문)',function(container){
    var cvs=document.createElement('canvas');cvs.width=620;cvs.height=400;
    cvs.style.cssText='width:100%;max-width:620px;height:auto;display:block;margin:0 auto;border-radius:8px;cursor:pointer;background:#0a0e1a';
    container.appendChild(cvs);
    var ctx=cvs.getContext('2d');
    var qi=0, score=0, answered=false, selAns=-1;
    function draw(){
      ctx.clearRect(0,0,620,400);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,620,400);
      if(qi>=quizQ.length){
        ctx.fillStyle='#4a7dff';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
        ctx.fillText('퀴즈 완료! '+score+'/'+quizQ.length+'점', 310, 180);
        var pct=Math.round(score*100/quizQ.length);
        var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
        ctx.fillStyle=grade==='S'?'#eab308':grade==='A'?'#22c55e':'#4a7dff';ctx.font='bold 36px sans-serif';
        ctx.fillText(grade, 310, 230);
        ls29Set('quiz20_score',score);ls29Set('quiz20_grade',grade);
        ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';ctx.fillText('클릭하여 다시 시작',310,280);
        return;
      }
      var q=quizQ[qi];
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('Q'+(qi+1)+'/'+quizQ.length+'  점수: '+score, 310, 25);
      ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';
      ctx.fillText(q.q, 310, 70);
      for(var i=0;i<4;i++){
        var bx=60+(i%2)*260, by=100+Math.floor(i/2)*70;
        var bg='#1e2640';
        if(answered){bg=i===q.c?'rgba(34,197,94,0.3)':i===selAns?'rgba(239,68,68,0.3)':'#1e2640';}
        ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(bx,by,240,50,8);ctx.fill();
        ctx.strokeStyle='#2a3654';ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';ctx.textAlign='center';
        ctx.fillText(q.a[i], bx+120, by+30);
      }
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(answered?'클릭하여 다음':'답을 선택하세요', 310, 380);
    }
    function onClick(e){
      var rect=cvs.getBoundingClientRect();
      var mx=((e.clientX||(e.touches&&e.touches[0].clientX)||0)-rect.left)*(620/rect.width);
      var my=((e.clientY||(e.touches&&e.touches[0].clientY)||0)-rect.top)*(400/rect.height);
      if(qi>=quizQ.length){qi=0;score=0;answered=false;selAns=-1;draw();return;}
      if(answered){qi++;answered=false;selAns=-1;draw();return;}
      for(var i=0;i<4;i++){
        var bx=60+(i%2)*260, by=100+Math.floor(i/2)*70;
        if(mx>=bx&&mx<=bx+240&&my>=by&&my<=by+50){
          selAns=i;answered=true;
          if(i===quizQ[qi].c){score++;playSFX29('quiz_correct29');}
          markV29Feature('quiz_v20');draw();break;
        }
      }
    }
    cvs.addEventListener('click',onClick);
    cvs.addEventListener('touchstart',function(e){e.preventDefault();onClick(e);},{passive:false});
    draw();
  });
}

// ================ ACHIEVEMENTS v29 (+12, 276->288) ================
function injectV29Achievements(){
  var achv29=[
    {id:'harmony_explorer',name:'화성 탐험가',desc:'화성진행 시뮬레이터 첫 사용',check:function(){return ls29Get('features_used',[]).indexOf('harmony_sim')>=0}},
    {id:'pedal_student',name:'페달 학생',desc:'페달링 마스터클래스 첫 수강',check:function(){return ls29Get('features_used',[]).indexOf('pedaling')>=0}},
    {id:'form_analyst',name:'형식 분석가',desc:'음악형식 분석기 첫 사용',check:function(){return ls29Get('features_used',[]).indexOf('musical_form')>=0}},
    {id:'artic_master',name:'아티큐레이션 마스터',desc:'아티큐레이션 가이드 첫 사용',check:function(){return ls29Get('features_used',[]).indexOf('articulation')>=0}},
    {id:'transpose_wizard',name:'조옴김 마법사',desc:'조옴김 워크벤치 첫 사용',check:function(){return ls29Get('features_used',[]).indexOf('transposition')>=0}},
    {id:'pressure_sensor',name:'압력 센서',desc:'건반압력 히트맵 첫 확인',check:function(){return ls29Get('features_used',[]).indexOf('pressure_map')>=0}},
    {id:'history_warrior',name:'음악사 전사',desc:'음악사 퀴즈배틀 첫 승리',check:function(){return ls29Get('features_used',[]).indexOf('history_battle')>=0}},
    {id:'growth_tracker',name:'성장 추적자',desc:'종합 성장 리포트 첫 확인',check:function(){return ls29Get('features_used',[]).indexOf('growth_report')>=0}},
    {id:'quiz_v20_pass',name:'퀴즈 v20 합격',desc:'퀴즈 v20에서 10점 이상',check:function(){return ls29Get('quiz20_score',0)>=10}},
    {id:'v29_explorer',name:'v29 탐험가',desc:'v29 기능 4개 이상 사용',check:function(){return ls29Get('features_used',[]).length>=4}},
    {id:'v29_master',name:'v29 마스터',desc:'v29 모든 8개 기능 사용',check:function(){return ls29Get('features_used',[]).length>=8}},
    {id:'v29_complete',name:'v29 완전정복',desc:'v29 전체 퀴즈+업적+기능 완료',check:function(){return ls29Get('features_used',[]).length>=8&&ls29Get('quiz20_score',0)>=12}}
  ];
  window.__v29Achievements = achv29;
}

function checkV29Achievements(){
  var achvs=window.__v29Achievements;
  if(!achvs)return;
  var unlocked=ls29Get('achievements_unlocked',[]);
  for(var i=0;i<achvs.length;i++){
    if(unlocked.indexOf(achvs[i].id)<0 && achvs[i].check()){
      unlocked.push(achvs[i].id);
      ls29Set('achievements_unlocked',unlocked);
      playSFX29('v29_achieve');
      showAchievementToast29(achvs[i].name);
    }
  }
}

function showAchievementToast29(name){
  var toast=document.createElement('div');
  toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#4a7dff,#a855f7);color:white;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;z-index:9999;animation:modalIn 0.3s;box-shadow:0 4px 16px rgba(0,0,0,0.4)';
  toast.textContent='🏆 업적 해제: '+name;
  document.body.appendChild(toast);
  setTimeout(function(){toast.remove();},3000);
}

// ================ KEYBOARD SHORTCUTS v29 ================
function setupV29Shortcuts(){
  var map={
    'Q':'harmony-sim-modal','W':'pedaling-master-modal','E':'form-analyzer-modal',
    'R':'artic-guide-modal','T':'transpose-bench-modal','Y':'pressure-heatmap-modal',
    'U':'history-battle-modal','I':'growth-report-modal','0':'quiz20-modal'
  };
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var key=e.key.toUpperCase();
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display=m.style.display==='flex'?'none':'flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV29NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎵 화성진행',modal:'harmony-sim-modal'},
    {label:'🦶 페달링',modal:'pedaling-master-modal'},
    {label:'🎼 형식분석',modal:'form-analyzer-modal'},
    {label:'🎹 아티큐',modal:'artic-guide-modal'},
    {label:'🔑 조옴김',modal:'transpose-bench-modal'},
    {label:'🔥 압력맵',modal:'pressure-heatmap-modal'},
    {label:'⚔ 음악사',modal:'history-battle-modal'},
    {label:'📊 성장',modal:'growth-report-modal'},
    {label:'❓ 퀴즈v20',modal:'quiz20-modal'}
  ];
  items.forEach(function(item){
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap;flex-shrink:0;margin:0 2px';
    btn.textContent=item.label;
    btn.addEventListener('click',function(){var m=document.getElementById(item.modal);if(m)m.style.display='flex';});
    existingNav.appendChild(btn);
  });
}

// ================ INIT ================
function initV29(){
  addV29Songs();
  buildHarmonicProgSimUI();
  buildPedalingMasterUI();
  buildMusicalFormUI();
  buildArticulationGuideUI();
  buildTranspositionUI();
  buildKeyPressureUI();
  buildMusicHistoryBattleUI();
  buildGrowthReportUI();
  buildQuizV20UI();
  injectV29Achievements();
  setupV29Shortcuts();
  injectV29NavButtons();
  setInterval(checkV29Achievements, 15000);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV29);}
else{setTimeout(initV29,200);}
})();
