// Piano Master v30 Patch Module
// Rhythm Pattern Composer, Fingering Optimizer, Music Theory Concept Map,
// Practice Focus Analyzer, Touch Sensitivity Profiler, Emotion-Music Mapper,
// Duet Part Allocator, Pianist Level Diagnosis Dashboard
// 10 Songs (262->272), Quiz v21 15Q (300->315), 12 Achievements (288->300), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v30Loaded) return;
window.__v30Loaded = true;

var LS30 = 'piano-v30-';
function ls30Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS30+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls30Set(k,v){localStorage.setItem(LS30+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v30 (16 sounds) ================
var sfx30 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone30(freq,type,dur,gainVal,delayMs){
  if(!sfx30) return;
  setTimeout(function(){
    if(!sfx30) return;
    var t=sfx30.currentTime,g=sfx30.createGain(),o=sfx30.createOscillator();
    o.connect(g);g.connect(sfx30.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX30(type){
  if(!sfx30) return;
  if(sfx30.state==='suspended') sfx30.resume();
  switch(type){
    case 'rhythm_open': tone30(392,'triangle',0.08,0.06,0); tone30(494,'triangle',0.08,0.06,80); tone30(587,'triangle',0.1,0.06,160); break;
    case 'rhythm_tap': tone30(523,'sine',0.06,0.08,0); break;
    case 'finger_open': tone30(330,'triangle',0.1,0.06,0); tone30(440,'triangle',0.08,0.06,70); break;
    case 'finger_select': tone30(587,'sine',0.08,0.07,0); tone30(698,'sine',0.1,0.07,60); break;
    case 'theory_open': tone30(262,'triangle',0.12,0.06,0); tone30(392,'triangle',0.1,0.06,100); break;
    case 'theory_connect': tone30(440,'sine',0.1,0.06,0); tone30(523,'sine',0.08,0.06,80); tone30(659,'sine',0.1,0.06,160); break;
    case 'focus_open': tone30(349,'triangle',0.1,0.05,0); tone30(440,'triangle',0.08,0.05,60); break;
    case 'focus_record': tone30(523,'sine',0.06,0.07,0); tone30(659,'sine',0.08,0.07,50); break;
    case 'touch_open': tone30(294,'triangle',0.1,0.06,0); tone30(370,'triangle',0.08,0.06,60); break;
    case 'touch_test': tone30(440,'sine',0.05,0.08,0); break;
    case 'emotion_open': tone30(523,'triangle',0.12,0.05,0); tone30(659,'triangle',0.1,0.05,80); tone30(784,'triangle',0.08,0.05,160); break;
    case 'emotion_select': tone30(698,'sine',0.1,0.07,0); break;
    case 'duet_open': tone30(262,'triangle',0.1,0.06,0); tone30(330,'triangle',0.1,0.06,0); tone30(392,'triangle',0.1,0.06,100); break;
    case 'level_open': tone30(523,'triangle',0.08,0.06,0); tone30(659,'triangle',0.08,0.06,80); tone30(784,'triangle',0.1,0.06,160); break;
    case 'v30_achieve': tone30(523,'triangle',0.1,0.1,0); tone30(659,'triangle',0.12,0.1,80); tone30(784,'triangle',0.14,0.1,160); tone30(1047,'triangle',0.3,0.12,240); break;
    case 'quiz_correct30': tone30(784,'triangle',0.08,0.07,0); tone30(988,'triangle',0.1,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v30 ================
function makeV30Modal(id, title, contentFn){
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

function markV30Feature(name){
  var used=ls30Get('features_used',[]);
  if(used.indexOf(name)<0){used.push(name);ls30Set('features_used',used);}
}

// ================ 10 NEW SONGS (262->272) ================
function addV30Songs(){
  var fn = window.addSong;
  if(!fn) return;
  fn({id:'s263',name:'Prokofiev - Piano Sonata No.7 &quot;Stalingrad&quot;',category:'클래식 명곡',diff:'expert',bpm:132,notes:[
    {note:65,time:0,dur:0.12},{note:66,time:0.12,dur:0.12},{note:68,time:0.25,dur:0.12},{note:70,time:0.37,dur:0.12},
    {note:72,time:0.5,dur:0.25},{note:68,time:0.75,dur:0.12},{note:65,time:0.87,dur:0.12},{note:72,time:1,dur:0.25},
    {note:74,time:1.25,dur:0.12},{note:72,time:1.37,dur:0.12},{note:68,time:1.5,dur:0.25},{note:65,time:1.75,dur:0.25},
    {note:63,time:2,dur:0.5},{note:65,time:2.5,dur:0.12},{note:68,time:2.62,dur:0.12},{note:72,time:2.75,dur:0.25},
    {note:41,time:0,dur:0.5},{note:53,time:0,dur:0.5},{note:46,time:0.5,dur:0.5},{note:58,time:0.5,dur:0.5},
    {note:41,time:1,dur:0.5},{note:53,time:1,dur:0.5},{note:39,time:1.5,dur:0.5},{note:51,time:1.5,dur:0.5},
    {note:75,time:3,dur:0.12},{note:72,time:3.12,dur:0.12},{note:68,time:3.25,dur:0.25},{note:77,time:3.5,dur:0.5}
  ]});
  fn({id:'s264',name:'Brahms - Intermezzo Op.118-2',category:'클래식 명곡',diff:'medium',bpm:72,notes:[
    {note:69,time:0,dur:0.8},{note:73,time:0.8,dur:0.4},{note:74,time:1.2,dur:0.8},{note:73,time:2,dur:0.4},
    {note:69,time:2.4,dur:0.8},{note:66,time:3.2,dur:1.2},{note:64,time:4.4,dur:0.4},{note:66,time:4.8,dur:0.8},
    {note:69,time:5.6,dur:0.4},{note:73,time:6,dur:0.8},{note:74,time:6.8,dur:0.4},{note:73,time:7.2,dur:1.2},
    {note:45,time:0,dur:2},{note:57,time:0,dur:2},{note:42,time:2,dur:2},{note:54,time:2,dur:2},
    {note:45,time:4,dur:2},{note:57,time:4,dur:2},{note:42,time:6,dur:2},{note:54,time:6,dur:2}
  ]});
  fn({id:'s265',name:'Ravel - Jeux d&apos;eau',category:'클래식 명곡',diff:'expert',bpm:84,notes:[
    {note:76,time:0,dur:0.1},{note:80,time:0.1,dur:0.1},{note:83,time:0.2,dur:0.1},{note:88,time:0.3,dur:0.2},
    {note:83,time:0.5,dur:0.1},{note:80,time:0.6,dur:0.1},{note:76,time:0.7,dur:0.1},{note:80,time:0.8,dur:0.1},
    {note:83,time:0.9,dur:0.1},{note:88,time:1,dur:0.3},{note:85,time:1.3,dur:0.1},{note:83,time:1.4,dur:0.1},
    {note:80,time:1.5,dur:0.2},{note:76,time:1.7,dur:0.3},
    {note:52,time:0,dur:1},{note:59,time:0,dur:1},{note:64,time:0,dur:1},{note:52,time:1,dur:1},{note:59,time:1,dur:1},
    {note:88,time:2,dur:0.1},{note:85,time:2.1,dur:0.1},{note:83,time:2.2,dur:0.1},{note:80,time:2.3,dur:0.2},
    {note:76,time:2.5,dur:0.3},{note:80,time:2.8,dur:0.2},{note:83,time:3,dur:0.5}
  ]});
  fn({id:'s266',name:'Schumann - Kinderszenen Op.15-1',category:'클래식 명곡',diff:'easy',bpm:80,notes:[
    {note:67,time:0,dur:0.5},{note:72,time:0.5,dur:0.5},{note:74,time:1,dur:0.5},{note:72,time:1.5,dur:0.5},
    {note:67,time:2,dur:0.5},{note:65,time:2.5,dur:0.5},{note:64,time:3,dur:1},{note:67,time:4,dur:0.5},
    {note:72,time:4.5,dur:0.5},{note:74,time:5,dur:0.5},{note:76,time:5.5,dur:0.5},{note:79,time:6,dur:1},
    {note:43,time:0,dur:2},{note:55,time:0,dur:2},{note:40,time:2,dur:2},{note:52,time:2,dur:2},
    {note:43,time:4,dur:2},{note:55,time:4,dur:2},{note:40,time:6,dur:1},{note:52,time:6,dur:1}
  ]});
  fn({id:'s267',name:'Albeniz - Asturias (Leyenda)',category:'클래식 명곡',diff:'hard',bpm:108,notes:[
    {note:64,time:0,dur:0.12},{note:76,time:0.12,dur:0.12},{note:72,time:0.25,dur:0.12},{note:76,time:0.37,dur:0.12},
    {note:64,time:0.5,dur:0.12},{note:76,time:0.62,dur:0.12},{note:72,time:0.75,dur:0.12},{note:76,time:0.87,dur:0.12},
    {note:64,time:1,dur:0.12},{note:76,time:1.12,dur:0.12},{note:72,time:1.25,dur:0.12},{note:76,time:1.37,dur:0.12},
    {note:63,time:1.5,dur:0.12},{note:76,time:1.62,dur:0.12},{note:72,time:1.75,dur:0.12},{note:76,time:1.87,dur:0.12},
    {note:40,time:0,dur:1},{note:52,time:0,dur:1},{note:39,time:1,dur:0.5},{note:51,time:1,dur:0.5},
    {note:64,time:2,dur:0.12},{note:76,time:2.12,dur:0.12},{note:71,time:2.25,dur:0.12},{note:76,time:2.37,dur:0.12},
    {note:67,time:2.5,dur:0.12},{note:76,time:2.62,dur:0.12},{note:64,time:2.75,dur:0.5}
  ]});
  fn({id:'s268',name:'Scriabin - Etude Op.8-12',category:'클래식 명곡',diff:'expert',bpm:88,notes:[
    {note:61,time:0,dur:0.5},{note:73,time:0,dur:0.5},{note:64,time:0.5,dur:0.25},{note:76,time:0.5,dur:0.25},
    {note:66,time:0.75,dur:0.25},{note:78,time:0.75,dur:0.25},{note:68,time:1,dur:0.5},{note:80,time:1,dur:0.5},
    {note:73,time:1.5,dur:0.25},{note:85,time:1.5,dur:0.25},{note:71,time:1.75,dur:0.25},{note:83,time:1.75,dur:0.25},
    {note:68,time:2,dur:0.5},{note:80,time:2,dur:0.5},{note:66,time:2.5,dur:0.25},{note:78,time:2.5,dur:0.25},
    {note:37,time:0,dur:1},{note:49,time:0,dur:1},{note:42,time:1,dur:1},{note:54,time:1,dur:1},
    {note:44,time:2,dur:1},{note:56,time:2,dur:1},{note:64,time:3,dur:0.5},{note:61,time:3.5,dur:0.5}
  ]});
  fn({id:'s269',name:'Mussorgsky - Pictures: Great Gate',category:'클래식 명곡',diff:'hard',bpm:76,notes:[
    {note:53,time:0,dur:1},{note:65,time:0,dur:1},{note:58,time:1,dur:0.5},{note:70,time:1,dur:0.5},
    {note:60,time:1.5,dur:0.5},{note:72,time:1.5,dur:0.5},{note:58,time:2,dur:1},{note:70,time:2,dur:1},
    {note:53,time:3,dur:1},{note:65,time:3,dur:1},{note:56,time:4,dur:0.5},{note:68,time:4,dur:0.5},
    {note:58,time:4.5,dur:0.5},{note:70,time:4.5,dur:0.5},{note:60,time:5,dur:1},{note:72,time:5,dur:1},
    {note:41,time:0,dur:2},{note:29,time:0,dur:2},{note:34,time:2,dur:2},{note:41,time:3,dur:2},{note:29,time:3,dur:2},
    {note:36,time:5,dur:1},{note:48,time:5,dur:1},{note:63,time:6,dur:1},{note:65,time:6,dur:1}
  ]});
  fn({id:'s270',name:'Granados - Goyescas: Quejas',category:'클래식 명곡',diff:'hard',bpm:66,notes:[
    {note:68,time:0,dur:0.8},{note:73,time:0.8,dur:0.4},{note:75,time:1.2,dur:0.8},{note:73,time:2,dur:0.4},
    {note:72,time:2.4,dur:0.4},{note:68,time:2.8,dur:0.8},{note:66,time:3.6,dur:0.4},{note:68,time:4,dur:1.2},
    {note:73,time:5.2,dur:0.4},{note:75,time:5.6,dur:0.8},{note:77,time:6.4,dur:0.4},{note:80,time:6.8,dur:1},
    {note:44,time:0,dur:2},{note:56,time:0,dur:2},{note:44,time:2,dur:2},{note:53,time:2,dur:2},
    {note:44,time:4,dur:2},{note:56,time:4,dur:2},{note:41,time:6,dur:2},{note:53,time:6,dur:2}
  ]});
  fn({id:'s271',name:'Kapustin - Concert Etude Op.40-1',category:'클래식 명곡',diff:'expert',bpm:144,notes:[
    {note:60,time:0,dur:0.1},{note:63,time:0.1,dur:0.1},{note:67,time:0.2,dur:0.1},{note:72,time:0.3,dur:0.1},
    {note:75,time:0.4,dur:0.1},{note:72,time:0.5,dur:0.1},{note:67,time:0.6,dur:0.1},{note:70,time:0.7,dur:0.1},
    {note:75,time:0.8,dur:0.1},{note:79,time:0.9,dur:0.1},{note:75,time:1,dur:0.1},{note:70,time:1.1,dur:0.1},
    {note:72,time:1.2,dur:0.1},{note:77,time:1.3,dur:0.1},{note:79,time:1.4,dur:0.2},{note:77,time:1.6,dur:0.1},
    {note:36,time:0,dur:0.4},{note:48,time:0,dur:0.4},{note:43,time:0.4,dur:0.4},{note:55,time:0.4,dur:0.4},
    {note:36,time:0.8,dur:0.4},{note:48,time:0.8,dur:0.4},{note:41,time:1.2,dur:0.4},{note:53,time:1.2,dur:0.4},
    {note:72,time:1.7,dur:0.1},{note:75,time:1.8,dur:0.1},{note:79,time:1.9,dur:0.2},{note:84,time:2.1,dur:0.3}
  ]});
  fn({id:'s272',name:'Medtner - Fairy Tale Op.20-1',category:'클래식 명곡',diff:'hard',bpm:96,notes:[
    {note:64,time:0,dur:0.5},{note:71,time:0,dur:0.5},{note:67,time:0.5,dur:0.25},{note:74,time:0.5,dur:0.25},
    {note:69,time:0.75,dur:0.25},{note:76,time:0.75,dur:0.25},{note:71,time:1,dur:0.5},{note:78,time:1,dur:0.5},
    {note:69,time:1.5,dur:0.25},{note:76,time:1.5,dur:0.25},{note:67,time:1.75,dur:0.25},{note:74,time:1.75,dur:0.25},
    {note:64,time:2,dur:0.5},{note:71,time:2,dur:0.5},{note:62,time:2.5,dur:0.25},{note:69,time:2.5,dur:0.25},
    {note:40,time:0,dur:1},{note:52,time:0,dur:1},{note:43,time:1,dur:1},{note:55,time:1,dur:1},
    {note:40,time:2,dur:1},{note:52,time:2,dur:1},{note:64,time:2.75,dur:0.25},{note:67,time:3,dur:0.5},{note:71,time:3,dur:0.5}
  ]});
}

// ================ FEATURE 1: RHYTHM PATTERN COMPOSER Canvas 620x400 ================
function buildRhythmPatternComposerUI(){
  var patterns = [
    {name:'4/4 기본', beats:4, subdivs:4, grid:[[1,0,0,0],[0,0,1,0],[1,0,0,0],[0,0,1,0]], desc:'기본 4분의 4박자'},
    {name:'스윙', beats:4, subdivs:3, grid:[[1,0,1],[0,1,0],[1,0,1],[0,1,0]], desc:'스윙 리듬 패턴'},
    {name:'와츠', beats:3, subdivs:4, grid:[[1,0,0,0],[0,0,1,0],[0,0,0,1]], desc:'3/4 와츠 패턴'},
    {name:'이틀 리듬', beats:4, subdivs:4, grid:[[1,0,0,1],[0,0,1,0],[1,0,0,1],[0,0,1,0]], desc:'보사노바 스타일'},
    {name:'슱코페이션', beats:4, subdivs:4, grid:[[0,0,1,0],[1,0,0,0],[0,0,1,0],[1,0,0,0]], desc:'역박자 강조'},
    {name:'마치', beats:4, subdivs:4, grid:[[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,0,1,0]], desc:'행진곡 분할박'},
    {name:'라틴', beats:4, subdivs:4, grid:[[1,0,0,1],[0,1,0,0],[1,0,0,1],[0,1,0,0]], desc:'라틴 클라베'},
    {name:'폴리리듬', beats:4, subdivs:4, grid:[[1,0,1,1],[0,1,0,1],[1,1,0,1],[0,1,1,0]], desc:'복합 리듬 패턴'}
  ];
  var curP = 0;
  var userGrid = JSON.parse(JSON.stringify(patterns[0].grid));

  makeV30Modal('rhythm-composer-modal', '🎵 리듬 패턴 작곡기', function(content){
    markV30Feature('rhythm_composer');
    playSFX30('rhythm_open');
    var desc = document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='리듬 패턴을 클릭으로 편집하고 사운드를 들어보세요. 8종 프리셋 패턴 제공.';
    content.appendChild(desc);

    var selDiv = document.createElement('div');
    selDiv.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px';
    patterns.forEach(function(p,i){
      var b=document.createElement('button');
      b.style.cssText='padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text2)')+';font-size:9px;cursor:pointer';
      b.textContent=p.name;
      b.addEventListener('click',function(){
        curP=i; userGrid=JSON.parse(JSON.stringify(patterns[i].grid));
        selDiv.querySelectorAll('button').forEach(function(bb,j){bb.style.background=j===i?'var(--accent)':'var(--surface2)';bb.style.color=j===i?'white':'var(--text2)';});
        drawRhythmCanvas();
        playSFX30('rhythm_tap');
      });
      selDiv.appendChild(b);
    });
    content.appendChild(selDiv);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;cursor:pointer';
    content.appendChild(can);

    can.addEventListener('click',function(e){
      var rect=can.getBoundingClientRect();
      var sx=620/rect.width, sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      var gx=60,gy=60,gw=520,gh=280;
      var p=patterns[curP];
      var cw=gw/p.subdivs, ch=gh/p.beats;
      var ci=Math.floor((mx-gx)/cw), ri=Math.floor((my-gy)/ch);
      if(ci>=0&&ci<p.subdivs&&ri>=0&&ri<p.beats){
        userGrid[ri][ci]=userGrid[ri][ci]?0:1;
        drawRhythmCanvas();
        playSFX30('rhythm_tap');
        var saved=ls30Get('rhythm_grids',{});
        saved[curP]=userGrid;
        ls30Set('rhythm_grids',saved);
      }
    });

    var infoDiv=document.createElement('div');
    infoDiv.id='rhythm-info';
    infoDiv.style.cssText='margin-top:8px;font-size:11px;color:var(--text2);padding:8px;background:var(--surface2);border-radius:6px';
    content.appendChild(infoDiv);

    function drawRhythmCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      var p=patterns[curP];
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('리듬 패턴 작곡기: '+p.name,310,30);
      ctx.font='11px sans-serif';ctx.fillStyle='#8892a8';
      ctx.fillText(p.desc,310,48);

      var gx=60,gy=60,gw=520,gh=280;
      var cw=gw/p.subdivs, ch=gh/p.beats;
      var colors=['#22c55e','#3b82f6','#eab308','#ef4444','#a855f7','#06b6d4'];

      for(var r=0;r<p.beats;r++){
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText('Beat '+(r+1),gx-8,gy+r*ch+ch/2+4);
        for(var c=0;c<p.subdivs;c++){
          var x=gx+c*cw, y=gy+r*ch;
          ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
          ctx.strokeRect(x+2,y+2,cw-4,ch-4);
          if(userGrid[r]&&userGrid[r][c]){
            var col=colors[r%colors.length];
            ctx.fillStyle=col;
            ctx.globalAlpha=0.8;
            ctx.beginPath();
            ctx.roundRect(x+4,y+4,cw-8,ch-8,6);
            ctx.fill();
            ctx.globalAlpha=1;
            ctx.fillStyle='white';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
            ctx.fillText('♪',x+cw/2,y+ch/2+5);
          }
        }
      }

      for(var c=0;c<p.subdivs;c++){
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText((c+1)+'',gx+c*cw+cw/2,gy+gh+16);
      }

      var total=0,active=0;
      for(var r=0;r<userGrid.length;r++) for(var c=0;c<(userGrid[r]||[]).length;c++){total++;if(userGrid[r][c])active++;}
      var density=total>0?Math.round(active/total*100):0;
      var grade=density>=70?'S':density>=55?'A':density>=40?'B':density>=25?'C':'D';
      var gradeCol=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#a855f7':'#8892a8';

      ctx.fillStyle=gradeCol;ctx.font='bold 24px sans-serif';ctx.textAlign='center';
      ctx.fillText(grade,560,390);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('밀도 '+density+'%',560,375);

      infoDiv.textContent=p.name+' | '+p.beats+'박자 x '+p.subdivs+'세분 | 활성: '+active+'/'+total+' (밀도 '+density+'%) | 등급: '+grade;
    }
    drawRhythmCanvas();
  });
}

// ================ FEATURE 2: FINGERING OPTIMIZER Canvas 620x400 ================
function buildFingeringOptimizerUI(){
  var keys=['C','D','E','F','G','A','B','Db','Eb','Gb','Ab','Bb'];
  var fingerData=[
    {key:'C',rh:[1,2,3,1,2,3,4,5],lh:[5,4,3,2,1,3,2,1],notes:['C4','D4','E4','F4','G4','A4','B4','C5'],tip:'엄지 넘기기가 핵심'},
    {key:'D',rh:[1,2,3,1,2,3,4,5],lh:[5,4,3,2,1,3,2,1],notes:['D4','E4','F#4','G4','A4','B4','C#5','D5'],tip:'F#과 C# 검은 건반 주의'},
    {key:'E',rh:[1,2,3,1,2,3,4,5],lh:[5,4,3,2,1,3,2,1],notes:['E4','F#4','G#4','A4','B4','C#5','D#5','E5'],tip:'검은 건반 3개 연속'},
    {key:'F',rh:[1,2,3,4,1,2,3,4],lh:[5,4,3,2,1,3,2,1],notes:['F4','G4','A4','Bb4','C5','D5','E5','F5'],tip:'4번 손가락 후 엄지 넘기기'},
    {key:'G',rh:[1,2,3,1,2,3,4,5],lh:[5,4,3,2,1,3,2,1],notes:['G4','A4','B4','C5','D5','E5','F#5','G5'],tip:'자연스러운 운지법'},
    {key:'A',rh:[1,2,3,1,2,3,4,5],lh:[5,4,3,2,1,3,2,1],notes:['A4','B4','C#5','D5','E5','F#5','G#5','A5'],tip:'검은 건반 3개 분산'},
    {key:'B',rh:[1,2,3,1,2,3,4,5],lh:[4,3,2,1,4,3,2,1],notes:['B4','C#5','D#5','E5','F#5','G#5','A#5','B5'],tip:'검은 건반 5개 - 난이도 높음'},
    {key:'Db',rh:[2,3,1,2,3,4,1,2],lh:[3,2,1,4,3,2,1,3],notes:['Db4','Eb4','F4','Gb4','Ab4','Bb4','C5','Db5'],tip:'검은 건반 중심 운지법'},
    {key:'Eb',rh:[2,1,2,3,1,2,3,4],lh:[3,2,1,4,3,2,1,3],notes:['Eb4','F4','G4','Ab4','Bb4','C5','D5','Eb5'],tip:'2번 손가락 시작'},
    {key:'Gb',rh:[2,3,4,1,2,3,1,2],lh:[4,3,2,1,3,2,1,4],notes:['Gb4','Ab4','Bb4','Cb5','Db5','Eb5','F5','Gb5'],tip:'전체 검은 건반 스케일'},
    {key:'Ab',rh:[2,3,1,2,3,1,2,3],lh:[3,2,1,4,3,2,1,3],notes:['Ab4','Bb4','C5','Db5','Eb5','F5','G5','Ab5'],tip:'흰/검 교차 운지법'},
    {key:'Bb',rh:[2,1,2,3,1,2,3,4],lh:[3,2,1,4,3,2,1,3],notes:['Bb4','C5','D5','Eb5','F5','G5','A5','Bb5'],tip:'재즈 스케일 필수'}
  ];
  var curK=0;

  makeV30Modal('fingering-opt-modal', '✋ 손가락번호 최적화기', function(content){
    markV30Feature('fingering_optimizer');
    playSFX30('finger_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='12조 스케일의 최적 운지법을 시각적으로 확인하세요. 오른손/왼손 모두 표시.';
    content.appendChild(desc);

    var selDiv=document.createElement('div');
    selDiv.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px';
    keys.forEach(function(k,i){
      var b=document.createElement('button');
      b.style.cssText='padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text2)')+';font-size:10px;cursor:pointer';
      b.textContent=k;
      b.addEventListener('click',function(){
        curK=i;
        selDiv.querySelectorAll('button').forEach(function(bb,j){bb.style.background=j===i?'var(--accent)':'var(--surface2)';bb.style.color=j===i?'white':'var(--text2)';});
        drawFingerCanvas();
        playSFX30('finger_select');
      });
      selDiv.appendChild(b);
    });
    content.appendChild(selDiv);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117';
    content.appendChild(can);

    var infoDiv=document.createElement('div');
    infoDiv.id='finger-info';
    infoDiv.style.cssText='margin-top:8px;font-size:11px;color:var(--text2);padding:8px;background:var(--surface2);border-radius:6px';
    content.appendChild(infoDiv);

    function drawFingerCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      var fd=fingerData[curK];
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(fd.key+' 장조 스케일 운지법',310,28);

      var sx=50,kw=65,kh=100,ky_rh=70,ky_lh=230;
      ctx.fillStyle='#3b82f6';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('오른손 (R.H.)',sx,ky_rh-8);
      ctx.fillStyle='#22c55e';
      ctx.fillText('왼손 (L.H.)',sx,ky_lh-8);

      var fingerColors=['#ef4444','#eab308','#22c55e','#3b82f6','#a855f7'];
      for(var i=0;i<8;i++){
        var x=sx+i*kw;
        ctx.fillStyle='#f0f0f0';
        ctx.beginPath();ctx.roundRect(x+2,ky_rh,kw-4,kh,4);ctx.fill();
        ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.stroke();

        var fn_rh=fd.rh[i];
        ctx.fillStyle=fingerColors[fn_rh-1];
        ctx.beginPath();ctx.arc(x+kw/2,ky_rh+kh-20,14,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='white';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
        ctx.fillText(fn_rh+'',x+kw/2,ky_rh+kh-15);

        ctx.fillStyle='#333';ctx.font='9px sans-serif';
        ctx.fillText(fd.notes[i],x+kw/2,ky_rh+20);

        ctx.fillStyle='#e8e8e8';
        ctx.beginPath();ctx.roundRect(x+2,ky_lh,kw-4,kh,4);ctx.fill();
        ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.stroke();

        var fn_lh=fd.lh[i];
        ctx.fillStyle=fingerColors[fn_lh-1];
        ctx.beginPath();ctx.arc(x+kw/2,ky_lh+kh-20,14,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='white';ctx.font='bold 14px sans-serif';
        ctx.fillText(fn_lh+'',x+kw/2,ky_lh+kh-15);
      }

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      var legendY=370;
      ctx.fillText('손가락:',sx,legendY);
      var fNames=['엄지','검지','중지','약지','새끼'];
      for(var f=0;f<5;f++){
        ctx.fillStyle=fingerColors[f];
        ctx.beginPath();ctx.arc(sx+55+f*60,legendY-4,6,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#c8d0e0';ctx.font='9px sans-serif';
        ctx.fillText(fNames[f],sx+65+f*60,legendY);
      }

      ctx.fillStyle='#eab308';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText('💡 '+fd.tip,310,395);

      infoDiv.textContent=fd.key+' 장조 | R.H.: ['+fd.rh.join('-')+'] | L.H.: ['+fd.lh.join('-')+'] | '+fd.tip;
    }
    drawFingerCanvas();
  });
}

// ================ FEATURE 3: MUSIC THEORY CONCEPT MAP Canvas 640x400 ================
function buildMusicTheoryMapUI(){
  var concepts=[
    {id:0,name:'음정',x:320,y:50,r:28,col:'#ef4444',desc:'두 음 사이의 거리',links:[1,2,4]},
    {id:1,name:'스케일',x:160,y:120,r:28,col:'#22c55e',desc:'음들의 순차적 배열',links:[0,2,3]},
    {id:2,name:'코드',x:480,y:120,r:28,col:'#3b82f6',desc:'3개 이상 음의 동시 울림',links:[0,1,5]},
    {id:3,name:'조성',x:80,y:220,r:26,col:'#eab308',desc:'장조/단조의 기본 틀',links:[1,4,7]},
    {id:4,name:'리듬',x:220,y:260,r:28,col:'#a855f7',desc:'음의 시간적 배치',links:[0,3,6]},
    {id:5,name:'화성학',x:540,y:220,r:26,col:'#06b6d4',desc:'코드 진행의 규칙',links:[2,7,9]},
    {id:6,name:'박자',x:120,y:340,r:24,col:'#f97316',desc:'강박/약박 패턴',links:[4,8]},
    {id:7,name:'전조',x:360,y:320,r:26,col:'#ec4899',desc:'조성의 이동',links:[3,5,9]},
    {id:8,name:'셋여림',x:220,y:380,r:22,col:'#84cc16',desc:'음의 강약 조절',links:[4,6]},
    {id:9,name:'대위법',x:500,y:340,r:26,col:'#8b5cf6',desc:'두 선율 조합 기법',links:[5,7]}
  ];
  var hoverIdx=-1;

  makeV30Modal('theory-map-modal', '📚 음악이론 개념맵', function(content){
    markV30Feature('theory_map');
    playSFX30('theory_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='10개 핵심 음악이론 개념의 연결 관계를 네트워크로 시각화. 노드를 클릭하면 상세 정보 표시.';
    content.appendChild(desc);

    var can=document.createElement('canvas');
    can.width=640;can.height=400;
    can.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117;cursor:pointer';
    content.appendChild(can);

    var infoDiv=document.createElement('div');
    infoDiv.id='theory-info';
    infoDiv.style.cssText='margin-top:8px;font-size:11px;color:var(--text2);padding:8px;background:var(--surface2);border-radius:6px';
    infoDiv.textContent='노드를 클릭하여 상세 정보를 확인하세요';
    content.appendChild(infoDiv);

    can.addEventListener('click',function(e){
      var rect=can.getBoundingClientRect();
      var sx=640/rect.width, sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      hoverIdx=-1;
      for(var i=0;i<concepts.length;i++){
        var c=concepts[i];
        var dx=mx-c.x,dy=my-c.y;
        if(dx*dx+dy*dy<=c.r*c.r){hoverIdx=i;break;}
      }
      drawTheoryCanvas();
      if(hoverIdx>=0){
        var cc=concepts[hoverIdx];
        var linkedNames=cc.links.map(function(li){return concepts[li].name;}).join(', ');
        infoDiv.innerHTML='<b style="color:'+cc.col+'">'+cc.name+'</b>: '+cc.desc+' | 연결: '+linkedNames;
        playSFX30('theory_connect');
      }
    });

    function drawTheoryCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,640,400);
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('음악이론 개념 네트워크',320,25);

      for(var i=0;i<concepts.length;i++){
        var c=concepts[i];
        for(var j=0;j<c.links.length;j++){
          var t=concepts[c.links[j]];
          if(c.links[j]>i){
            ctx.strokeStyle=(hoverIdx===i||hoverIdx===c.links[j])?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.1)';
            ctx.lineWidth=(hoverIdx===i||hoverIdx===c.links[j])?2:1;
            ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(t.x,t.y);ctx.stroke();
          }
        }
      }

      for(var i=0;i<concepts.length;i++){
        var c=concepts[i];
        var isH=hoverIdx===i;
        ctx.globalAlpha=isH?1:0.85;
        ctx.fillStyle=c.col;
        ctx.beginPath();ctx.arc(c.x,c.y,isH?c.r+4:c.r,0,Math.PI*2);ctx.fill();
        if(isH){ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();}
        ctx.globalAlpha=1;
        ctx.fillStyle='white';ctx.font='bold '+(isH?'12':'11')+'px sans-serif';ctx.textAlign='center';
        ctx.fillText(c.name,c.x,c.y+4);
      }
    }
    drawTheoryCanvas();
  });
}

// ================ FEATURE 4: PRACTICE FOCUS ANALYZER Canvas 620x400 ================
function buildPracticeFocusUI(){
  var days=['월','화','수','목','금','토','일'];
  var hours=['06-08','08-10','10-12','12-14','14-16','16-18','18-20','20-22'];
  var data=ls30Get('practice_focus',[]);
  if(!data.length){data=[];for(var d=0;d<7;d++){var row=[];for(var h=0;h<8;h++){row.push(0);}data.push(row);}}

  makeV30Modal('practice-focus-modal', '🎯 연습 집중도 분석기', function(content){
    markV30Feature('practice_focus');
    playSFX30('focus_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='7일 x 8시간대 연습 히트맵. 셀을 클릭하여 연습 시간을 기록하세요 (최대 5단계).';
    content.appendChild(desc);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;cursor:pointer';
    content.appendChild(can);

    can.addEventListener('click',function(e){
      var rect=can.getBoundingClientRect();
      var sx=620/rect.width, sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      var gx=80,gy=50,gw=500,gh=280;
      var cw=gw/8, ch=gh/7;
      var ci=Math.floor((mx-gx)/cw), ri=Math.floor((my-gy)/ch);
      if(ci>=0&&ci<8&&ri>=0&&ri<7){
        data[ri][ci]=(data[ri][ci]+1)%6;
        ls30Set('practice_focus',data);
        drawFocusCanvas();
        playSFX30('focus_record');
      }
    });

    var infoDiv=document.createElement('div');
    infoDiv.id='focus-info';
    infoDiv.style.cssText='margin-top:8px;font-size:11px;color:var(--text2);padding:8px;background:var(--surface2);border-radius:6px';
    content.appendChild(infoDiv);

    function drawFocusCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('연습 집중도 히트맵 (7일 x 8시간대)',310,28);

      var gx=80,gy=50,gw=500,gh=280;
      var cw=gw/8, ch=gh/7;
      var heatCols=['#1a1a2e','#1e3a5f','#1d6b3f','#6b8e23','#e8a317','#e63946'];

      for(var d=0;d<7;d++){
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(days[d],gx-8,gy+d*ch+ch/2+4);
        for(var h=0;h<8;h++){
          var x=gx+h*cw, y=gy+d*ch;
          var val=data[d][h];
          ctx.fillStyle=heatCols[val];
          ctx.beginPath();ctx.roundRect(x+2,y+2,cw-4,ch-4,4);ctx.fill();
          ctx.strokeStyle='#2a3050';ctx.lineWidth=0.5;ctx.stroke();
          if(val>0){
            ctx.fillStyle='white';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
            ctx.fillText(val+'',x+cw/2,y+ch/2+4);
          }
        }
      }

      for(var h=0;h<8;h++){
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(hours[h],gx+h*cw+cw/2,gy+gh+14);
      }

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      ctx.fillText('강도:',gx,gy+gh+35);
      for(var l=0;l<6;l++){
        ctx.fillStyle=heatCols[l];
        ctx.fillRect(gx+40+l*30,gy+gh+26,24,12);
        ctx.fillStyle='#c8d0e0';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(l+'',gx+52+l*30,gy+gh+50);
      }

      var totalSessions=0,maxSlot='',maxVal=0;
      for(var d=0;d<7;d++) for(var h=0;h<8;h++){
        totalSessions+=data[d][h];
        if(data[d][h]>maxVal){maxVal=data[d][h];maxSlot=days[d]+' '+hours[h];}
      }
      var grade=totalSessions>=80?'S':totalSessions>=60?'A':totalSessions>=40?'B':totalSessions>=20?'C':'D';
      var gradeCol=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#a855f7':'#8892a8';
      ctx.fillStyle=gradeCol;ctx.font='bold 20px sans-serif';ctx.textAlign='right';
      ctx.fillText(grade,600,gy+gh+45);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('총 '+totalSessions+'세션',600,gy+gh+30);

      infoDiv.textContent='총 연습: '+totalSessions+'세션 | 최다 시간대: '+(maxSlot||'기록 없음')+' | 등급: '+grade;
    }
    drawFocusCanvas();
  });
}

// ================ FEATURE 5: TOUCH SENSITIVITY PROFILER Canvas 620x400 ================
function buildTouchSensitivityUI(){
  var velocities=['ppp','pp','p','mp','mf','f','ff','fff'];
  var regions=['낮은 영역','중저역','중앙역','중고역','높은 영역'];
  var profData=ls30Get('touch_profile',[]);
  if(!profData.length){profData=[];for(var r=0;r<5;r++){var row=[];for(var v=0;v<8;v++){row.push(0);}profData.push(row);}}

  makeV30Modal('touch-sens-modal', '🎹 터치 감도 프로파일러', function(content){
    markV30Feature('touch_sensitivity');
    playSFX30('touch_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='5영역 x 8벨로시티 터치 매트릭스. 셀을 클릭하여 당신의 터치 성향을 기록하세요.';
    content.appendChild(desc);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;cursor:pointer';
    content.appendChild(can);

    can.addEventListener('click',function(e){
      var rect=can.getBoundingClientRect();
      var sx=620/rect.width, sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      var gx=90,gy=55,gw=490,gh=260;
      var cw=gw/8, ch=gh/5;
      var ci=Math.floor((mx-gx)/cw), ri=Math.floor((my-gy)/ch);
      if(ci>=0&&ci<8&&ri>=0&&ri<5){
        profData[ri][ci]=(profData[ri][ci]+1)%6;
        ls30Set('touch_profile',profData);
        drawTouchCanvas();
        playSFX30('touch_test');
      }
    });

    var infoDiv=document.createElement('div');
    infoDiv.id='touch-info';
    infoDiv.style.cssText='margin-top:8px;font-size:11px;color:var(--text2);padding:8px;background:var(--surface2);border-radius:6px';
    content.appendChild(infoDiv);

    function drawTouchCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('터치 감도 프로파일러 (5영역 x 8벨로시티)',310,28);

      var gx=90,gy=55,gw=490,gh=260;
      var cw=gw/8, ch=gh/5;
      var hCols=['#1a1a2e','#1a3a5f','#2a6b3f','#8b8e23','#e8a317','#e63946'];

      for(var r=0;r<5;r++){
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(regions[r],gx-6,gy+r*ch+ch/2+4);
        for(var v=0;v<8;v++){
          var x=gx+v*cw, y=gy+r*ch;
          var val=profData[r][v];
          ctx.fillStyle=hCols[val];
          ctx.beginPath();ctx.roundRect(x+2,y+2,cw-4,ch-4,4);ctx.fill();
          ctx.strokeStyle='#2a3050';ctx.lineWidth=0.5;ctx.stroke();
          if(val>0){
            ctx.fillStyle='white';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
            ctx.fillText(val+'',x+cw/2,y+ch/2+4);
          }
        }
      }

      for(var v=0;v<8;v++){
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText(velocities[v],gx+v*cw+cw/2,gy+gh+16);
      }

      var total=0,filled=0;
      for(var r=0;r<5;r++) for(var v=0;v<8;v++){total++;if(profData[r][v]>0)filled++;}
      var coverage=Math.round(filled/total*100);
      var avgVal=0,cnt=0;
      for(var r=0;r<5;r++) for(var v=0;v<8;v++) if(profData[r][v]>0){avgVal+=profData[r][v];cnt++;}
      avgVal=cnt>0?(avgVal/cnt).toFixed(1):'0';
      var grade=coverage>=80?'S':coverage>=60?'A':coverage>=40?'B':coverage>=20?'C':'D';
      var gradeCol=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#a855f7':'#8892a8';

      ctx.fillStyle=gradeCol;ctx.font='bold 22px sans-serif';ctx.textAlign='center';
      ctx.fillText(grade,560,380);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('커버리지 '+coverage+'%',560,365);

      infoDiv.textContent='커버리지: '+coverage+'% | 평균 강도: '+avgVal+' | 등급: '+grade+' | 셀을 클릭하여 연습 성향을 기록하세요';
    }
    drawTouchCanvas();
  });
}

// ================ FEATURE 6: EMOTION-MUSIC MAPPER Canvas 640x400 ================
function buildEmotionMusicMapperUI(){
  var emotions=[
    {name:'기쁨',col:'#eab308',params:{tempo:80,dynamics:70,mode:90,range:60,complexity:30,resonance:50,rhythm:65,expression:85}},
    {name:'슬픔',col:'#3b82f6',params:{tempo:30,dynamics:40,mode:20,range:50,complexity:45,resonance:80,rhythm:25,expression:90}},
    {name:'분노',col:'#ef4444',params:{tempo:90,dynamics:95,mode:40,range:85,complexity:60,resonance:35,rhythm:80,expression:70}},
    {name:'평온',col:'#22c55e',params:{tempo:40,dynamics:30,mode:75,range:30,complexity:20,resonance:70,rhythm:35,expression:60}},
    {name:'열정',col:'#f97316',params:{tempo:85,dynamics:85,mode:70,range:80,complexity:55,resonance:60,rhythm:75,expression:95}},
    {name:'그리움',col:'#a855f7',params:{tempo:35,dynamics:45,mode:30,range:55,complexity:50,resonance:85,rhythm:30,expression:88}},
    {name:'공포',col:'#64748b',params:{tempo:70,dynamics:80,mode:15,range:75,complexity:70,resonance:40,rhythm:60,expression:50}},
    {name:'영웅',col:'#06b6d4',params:{tempo:55,dynamics:60,mode:85,range:70,complexity:40,resonance:55,rhythm:50,expression:75}},
    {name:'신비',col:'#8b5cf6',params:{tempo:45,dynamics:50,mode:45,range:65,complexity:75,resonance:90,rhythm:40,expression:65}},
    {name:'전원',col:'#84cc16',params:{tempo:50,dynamics:35,mode:80,range:40,complexity:15,resonance:65,rhythm:45,expression:55}},
    {name:'긴장',col:'#f43f5e',params:{tempo:75,dynamics:70,mode:35,range:70,complexity:65,resonance:45,rhythm:70,expression:60}},
    {name:'승리',col:'#fbbf24',params:{tempo:80,dynamics:90,mode:95,range:85,complexity:50,resonance:50,rhythm:85,expression:80}}
  ];
  var axes=['Tempo','Dynamics','Mode','Range','Complexity','Resonance','Rhythm','Expression'];
  var curE=0;

  makeV30Modal('emotion-mapper-modal', '🎨 감정-음악 매핑 도구', function(content){
    markV30Feature('emotion_mapper');
    playSFX30('emotion_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='12가지 감정을 8개 음악 요소로 매핑한 Radar 차트. 감정을 클릭하여 비교하세요.';
    content.appendChild(desc);

    var selDiv=document.createElement('div');
    selDiv.style.cssText='display:flex;gap:3px;flex-wrap:wrap;margin-bottom:8px';
    emotions.forEach(function(em,i){
      var b=document.createElement('button');
      b.style.cssText='padding:3px 7px;border-radius:4px;border:1px solid '+(i===0?em.col:'var(--border)')+';background:'+(i===0?em.col+'22':'var(--surface2)')+';color:'+(i===0?em.col:'var(--text2)')+';font-size:9px;cursor:pointer';
      b.textContent=em.name;
      b.addEventListener('click',function(){
        curE=i;
        selDiv.querySelectorAll('button').forEach(function(bb,j){
          var ec=emotions[j];
          bb.style.background=j===i?ec.col+'22':'var(--surface2)';
          bb.style.color=j===i?ec.col:'var(--text2)';
          bb.style.borderColor=j===i?ec.col:'var(--border)';
        });
        drawEmotionCanvas();
        playSFX30('emotion_select');
      });
      selDiv.appendChild(b);
    });
    content.appendChild(selDiv);

    var can=document.createElement('canvas');
    can.width=640;can.height=400;
    can.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117';
    content.appendChild(can);

    function drawEmotionCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,640,400);
      var em=emotions[curE];
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('감정-음악 Radar: '+em.name,320,25);

      var cx=320,cy=220,maxR=150;
      for(var ring=5;ring>=1;ring--){
        ctx.strokeStyle='rgba(255,255,255,'+(0.05+ring*0.02)+')';ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(cx,cy,maxR*ring/5,0,Math.PI*2);ctx.stroke();
      }

      var pts=[];
      for(var a=0;a<8;a++){
        var angle=Math.PI*2*a/8 - Math.PI/2;
        var ex=cx+Math.cos(angle)*maxR, ey=cy+Math.sin(angle)*maxR;
        ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
        var lx=cx+Math.cos(angle)*(maxR+18), ly=cy+Math.sin(angle)*(maxR+18);
        ctx.fillText(axes[a],lx,ly+4);
        var val=em.params[axes[a].toLowerCase()]/100;
        pts.push({x:cx+Math.cos(angle)*maxR*val, y:cy+Math.sin(angle)*maxR*val});
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x,pts[0].y);
      for(var p=1;p<pts.length;p++) ctx.lineTo(pts[p].x,pts[p].y);
      ctx.closePath();
      ctx.fillStyle=em.col+'33';ctx.fill();
      ctx.strokeStyle=em.col;ctx.lineWidth=2;ctx.stroke();

      for(var p=0;p<pts.length;p++){
        ctx.fillStyle=em.col;
        ctx.beginPath();ctx.arc(pts[p].x,pts[p].y,4,0,Math.PI*2);ctx.fill();
      }

      var vals=Object.values(em.params);
      var avg=Math.round(vals.reduce(function(a,b){return a+b},0)/vals.length);
      var grade=avg>=75?'S':avg>=60?'A':avg>=45?'B':avg>=30?'C':'D';
      var gradeCol=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#a855f7':'#8892a8';
      ctx.fillStyle=gradeCol;ctx.font='bold 22px sans-serif';
      ctx.fillText(grade,590,390);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('평균 '+avg+'%',590,375);
    }
    drawEmotionCanvas();
  });
}

// ================ FEATURE 7: DUET PART ALLOCATOR Canvas 620x400 ================
function buildDuetPartAllocatorUI(){
  var duets=[
    {name:'Primo 리드',primo:{melody:90,harmony:40,rhythm:70,dynamics:80,technique:75,expression:85},secondo:{melody:30,harmony:85,rhythm:80,dynamics:60,technique:65,expression:50}},
    {name:'Secondo 리드',primo:{melody:40,harmony:80,rhythm:75,dynamics:55,technique:60,expression:50},secondo:{melody:85,harmony:45,rhythm:70,dynamics:80,technique:75,expression:85}},
    {name:'균형 듀엇',primo:{melody:70,harmony:65,rhythm:70,dynamics:70,technique:70,expression:75},secondo:{melody:65,harmony:70,rhythm:70,dynamics:70,technique:70,expression:70}},
    {name:'대화체',primo:{melody:80,harmony:50,rhythm:60,dynamics:85,technique:70,expression:90},secondo:{melody:75,harmony:55,rhythm:65,dynamics:80,technique:65,expression:85}},
    {name:'오스티나토',primo:{melody:85,harmony:30,rhythm:65,dynamics:75,technique:80,expression:80},secondo:{melody:20,harmony:90,rhythm:85,dynamics:50,technique:55,expression:40}},
    {name:'리듬 앙상블',primo:{melody:50,harmony:60,rhythm:90,dynamics:65,technique:60,expression:55},secondo:{melody:55,harmony:65,rhythm:85,dynamics:70,technique:65,expression:60}}
  ];
  var axes=['Melody','Harmony','Rhythm','Dynamics','Technique','Expression'];
  var curD=0;

  makeV30Modal('duet-alloc-modal', '🎶 듀엇 파트 분배기', function(content){
    markV30Feature('duet_allocator');
    playSFX30('duet_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='6종 듀엇 스타일의 Primo/Secondo 역할 분석. 클릭으로 스타일 전환.';
    content.appendChild(desc);

    var selDiv=document.createElement('div');
    selDiv.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px';
    duets.forEach(function(d,i){
      var b=document.createElement('button');
      b.style.cssText='padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text2)')+';font-size:9px;cursor:pointer';
      b.textContent=d.name;
      b.addEventListener('click',function(){
        curD=i;
        selDiv.querySelectorAll('button').forEach(function(bb,j){bb.style.background=j===i?'var(--accent)':'var(--surface2)';bb.style.color=j===i?'white':'var(--text2)';});
        drawDuetCanvas();
      });
      selDiv.appendChild(b);
    });
    content.appendChild(selDiv);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117';
    content.appendChild(can);

    function drawDuetCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      var d=duets[curD];
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('듀엇 파트 분배: '+d.name,310,25);

      var cx1=180,cx2=440,cy=210,maxR=120;
      var parts=[{cx:cx1,data:d.primo,col:'#3b82f6',label:'Primo'},{cx:cx2,data:d.secondo,col:'#22c55e',label:'Secondo'}];

      parts.forEach(function(part){
        for(var ring=5;ring>=1;ring--){
          ctx.strokeStyle='rgba(255,255,255,'+(0.04+ring*0.015)+')';ctx.lineWidth=0.5;
          ctx.beginPath();ctx.arc(part.cx,cy,maxR*ring/5,0,Math.PI*2);ctx.stroke();
        }

        var pts=[];
        for(var a=0;a<6;a++){
          var angle=Math.PI*2*a/6 - Math.PI/2;
          var ex=part.cx+Math.cos(angle)*maxR, ey=cy+Math.sin(angle)*maxR;
          ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(part.cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
          ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
          var lx=part.cx+Math.cos(angle)*(maxR+14), ly=cy+Math.sin(angle)*(maxR+14);
          ctx.fillText(axes[a],lx,ly+3);
          var key=axes[a].toLowerCase();
          var val=part.data[key]/100;
          pts.push({x:part.cx+Math.cos(angle)*maxR*val, y:cy+Math.sin(angle)*maxR*val});
        }

        ctx.beginPath();
        ctx.moveTo(pts[0].x,pts[0].y);
        for(var p=1;p<pts.length;p++) ctx.lineTo(pts[p].x,pts[p].y);
        ctx.closePath();
        ctx.fillStyle=part.col+'33';ctx.fill();
        ctx.strokeStyle=part.col;ctx.lineWidth=2;ctx.stroke();

        for(var p=0;p<pts.length;p++){
          ctx.fillStyle=part.col;ctx.beginPath();ctx.arc(pts[p].x,pts[p].y,3,0,Math.PI*2);ctx.fill();
        }

        ctx.fillStyle=part.col;ctx.font='bold 13px sans-serif';ctx.textAlign='center';
        ctx.fillText(part.label,part.cx,50);
        var vals=Object.values(part.data);
        var avg=Math.round(vals.reduce(function(a,b){return a+b},0)/vals.length);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText('평균: '+avg+'%',part.cx,380);
      });
    }
    drawDuetCanvas();
  });
}

// ================ FEATURE 8: PIANIST LEVEL DIAGNOSIS Canvas 620x400 ================
function buildPianistLevelDiagnosisUI(){
  var kpis=['Technique','SightRead','Theory','Rhythm','Harmony','Expression','Repertoire','Practice'];
  var kpiLabels=['기교력','초견력','이론','리듬','화성','표현력','레파토리','연습량'];
  var kpiColors=['#ef4444','#eab308','#22c55e','#3b82f6','#a855f7','#06b6d4','#f97316','#ec4899'];

  makeV30Modal('pianist-level-modal', '🏆 종합 피아니스트 레벨 진단', function(content){
    markV30Feature('pianist_level');
    playSFX30('level_open');
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:8px';
    desc.textContent='8개 KPI 반원게이지 4x2 대시보드. 가중 종합 등급 S~D 평가.';
    content.appendChild(desc);

    var can=document.createElement('canvas');
    can.width=620;can.height=400;
    can.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117';
    content.appendChild(can);

    function getKPIValues(){
      var vals=[];
      var features=ls30Get('features_used',[]);
      var fCount=features.length;
      vals.push(Math.min(100,fCount*12));
      var quizScore=ls30Get('quiz21_score',0);
      vals.push(Math.min(100,quizScore*7));
      vals.push(Math.min(100,fCount*10));
      var rhythmGrids=ls30Get('rhythm_grids',{});
      var rCount=Object.keys(rhythmGrids).length;
      vals.push(Math.min(100,rCount*15));
      vals.push(Math.min(100,fCount*11));
      vals.push(Math.min(100,fCount*13));
      try{
        var totalSongs=0;
        for(var i=0;i<localStorage.length;i++){
          var k=localStorage.key(i);
          if(k&&k.indexOf('best-score')>=0) totalSongs++;
        }
        vals.push(Math.min(100,totalSongs*4));
      }catch(e){vals.push(0);}
      var pracData=ls30Get('practice_focus',[]);
      var pracTotal=0;
      if(pracData.length) for(var d=0;d<pracData.length;d++) for(var h=0;h<(pracData[d]||[]).length;h++) pracTotal+=(pracData[d][h]||0);
      vals.push(Math.min(100,pracTotal*2));
      return vals;
    }

    function drawLevelCanvas(){
      var ctx=can.getContext('2d');
      ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('종합 피아니스트 레벨 진단',310,24);

      var vals=getKPIValues();
      var gw=140,gh=80,cols=4,rows=2,sx=15,sy=42,gapX=8,gapY=8;

      for(var i=0;i<8;i++){
        var col=Math.floor(i%cols), row=Math.floor(i/cols);
        var x=sx+col*(gw+gapX), y=sy+row*(gh+gapY+55);
        var val=vals[i];

        ctx.fillStyle='#1a2036';
        ctx.beginPath();ctx.roundRect(x,y,gw,gh+45,6);ctx.fill();

        ctx.fillStyle=kpiColors[i];ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(kpiLabels[i],x+gw/2,y+14);

        var gcx=x+gw/2, gcy=y+50, gr=30;
        ctx.strokeStyle='#2a3050';ctx.lineWidth=6;
        ctx.beginPath();ctx.arc(gcx,gcy,gr,Math.PI,0);ctx.stroke();

        var pct=val/100;
        ctx.strokeStyle=kpiColors[i];ctx.lineWidth=6;
        ctx.beginPath();ctx.arc(gcx,gcy,gr,Math.PI,Math.PI+Math.PI*pct);ctx.stroke();

        ctx.fillStyle='#c8d0e0';ctx.font='bold 14px sans-serif';
        ctx.fillText(val+'',gcx,gcy+6);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText('/100',gcx,gcy+17);

        var g=val>=80?'S':val>=60?'A':val>=40?'B':val>=20?'C':'D';
        var gc=g==='S'?'#eab308':g==='A'?'#22c55e':g==='B'?'#3b82f6':g==='C'?'#a855f7':'#8892a8';
        ctx.fillStyle=gc;ctx.font='bold 12px sans-serif';
        ctx.fillText(g,x+gw-12,y+14);
      }

      var weights=[15,12,10,13,12,13,13,12];
      var wSum=0,wTotal=0;
      for(var i=0;i<8;i++){wSum+=vals[i]*weights[i];wTotal+=100*weights[i];}
      var overall=Math.round(wSum/wTotal*100);
      var oGrade=overall>=80?'S':overall>=60?'A':overall>=40?'B':overall>=20?'C':'D';
      var oCol=oGrade==='S'?'#eab308':oGrade==='A'?'#22c55e':oGrade==='B'?'#3b82f6':oGrade==='C'?'#a855f7':'#8892a8';

      ctx.fillStyle='#1a2036';
      ctx.beginPath();ctx.roundRect(200,320,220,70,8);ctx.fill();
      ctx.strokeStyle=oCol;ctx.lineWidth=2;ctx.stroke();

      ctx.fillStyle='#c8d0e0';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText('종합 피아니스트 레벨',310,340);
      ctx.fillStyle=oCol;ctx.font='bold 28px sans-serif';
      ctx.fillText(oGrade,310,372);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(overall+'%',310,387);
    }
    drawLevelCanvas();
  });
}

// ================ QUIZ v21 (15 questions, 300->315) ================
function buildQuizV21UI(){
  var questions=[
    {q:'리듬에서 싱코페이션이란?',a:['역박자 강조','매우 빠르게','매우 느리게','점점 빠르게'],c:0},
    {q:'C 장조 스케일에서 엄지 넘기기는 어느 음 뒤에 하나요?',a:['E 뒤','D 뒤','F 뒤','G 뒤'],c:0},
    {q:'음악에서 전조(Modulation)란?',a:['조성을 바꾸는 것','속도를 바꾸는 것','리듬을 바꾸는 것','악기를 바꾸는 것'],c:0},
    {q:'ppp는 어떤 볼륨을 의미하나요?',a:['극히 여리게','극히 크게','점점 크게','보통 크기'],c:0},
    {q:'듀엇에서 Primo는 주로 어떤 역할을 하나요?',a:['멜로디 담당','반주 담당','페달 담당','조율 담당'],c:0},
    {q:'대위법이란 어떤 작곡 기법인가요?',a:['두 선율 조합','한 선율 변형','리듬 변형','화성 변형'],c:0},
    {q:'프로코피예프 피아노 소나타 7번의 별명은?',a:['스탈린그라드','월광','열정','비창'],c:0},
    {q:'스잉 리듬의 기본 특징은?',a:['셋잿박 가벼운 3연음','강한 에씩트','빠른 16분음표','느린 온음표'],c:0},
    {q:'라벨의 Jeux d eau는 어떤 스타일의 곡인가요?',a:['인상주의','고전주의','낭만주의','현대주의'],c:0},
    {q:'연습 시 메트로놈의 주요 목적은?',a:['일정한 박자 유지','음량 조절','음색 변환','페달 타이밍'],c:0},
    {q:'건반 초견에서 가장 중요한 능력은?',a:['음표 즉시 인식','문자 읽기','마우스 조작','무선 통신'],c:0},
    {q:'브람스의 인터메츠 Op.118-2의 조성은?',a:['A 장조','C 단조','F 장조','D 단조'],c:0},
    {q:'카푸스틴의 음악 특징은?',a:['재즈와 클래식 융합','전자음악 실험','민요 편곡','가곡 중심'],c:0},
    {q:'프렉티스 히트맵의 주요 목적은?',a:['연습 패턴 시각화','점수 계산','음색 변환','코드 분석'],c:0},
    {q:'무소륵스키의 전람회의 그림 마지막 곡 이름은?',a:['키예프의 대문','프롬나드','카타콤베','바바야가'],c:0}
  ];
  var qIdx=0, score=0, answered=[];

  makeV30Modal('quiz21-modal', '❓ 피아노 퀀즈 v21 (15문)', function(content){
    markV30Feature('quiz_v21');
    var qDiv=document.createElement('div');
    qDiv.id='quiz21-area';
    content.appendChild(qDiv);

    function renderQ(){
      var qq=questions[qIdx];
      qDiv.innerHTML='<div style="margin-bottom:8px;font-size:12px;color:var(--accent)">문제 '+(qIdx+1)+'/15</div>'+
        '<div style="font-size:13px;font-weight:bold;margin-bottom:12px">'+qq.q+'</div>';
      qq.a.forEach(function(a,i){
        var ab=document.createElement('button');
        ab.style.cssText='display:block;width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer';
        ab.textContent=a;
        ab.addEventListener('click',function(){
          if(answered.indexOf(qIdx)>=0) return;
          answered.push(qIdx);
          if(i===qq.c){
            score++;
            ab.style.background='rgba(34,197,94,0.2)';ab.style.borderColor='#22c55e';
            playSFX30('quiz_correct30');
          } else {
            ab.style.background='rgba(239,68,68,0.2)';ab.style.borderColor='#ef4444';
            qDiv.querySelectorAll('button')[qq.c].style.background='rgba(34,197,94,0.2)';
            qDiv.querySelectorAll('button')[qq.c].style.borderColor='#22c55e';
          }
          ls30Set('quiz21_score',score);
          setTimeout(function(){
            qIdx++;
            if(qIdx<questions.length) renderQ();
            else{
              qDiv.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:bold;color:var(--accent)">'+score+'/15 정답!</div><div style="margin-top:8px;font-size:13px;color:var(--text2)">'+(score>=13?'피아노 마스터!':score>=10?'훌륭해요!':score>=7?'좋아요!':'더 공부해봐요!')+
              '</div><button onclick="document.getElementById(\'quiz21-modal\').style.display=\'none\'" style="margin-top:12px;padding:8px 16px;border-radius:6px;background:var(--accent);color:white;border:none;cursor:pointer">닫기</button></div>';
            }
          },800);
        });
        qDiv.appendChild(ab);
      });
    }
    renderQ();
  });
}

// ================ ACHIEVEMENTS v30 (12 new, 288->300) ================
function injectV30Achievements(){
  var achFn=window.addAchievement||function(){};
  var achs=[
    {id:'v30_rhythm_composer',name:'리듬 작곡가',desc:'리듬 패턴 작곡기 사용',check:function(){return ls30Get('features_used',[]).indexOf('rhythm_composer')>=0}},
    {id:'v30_finger_master',name:'운지법 마스터',desc:'손가락번호 최적화기 사용',check:function(){return ls30Get('features_used',[]).indexOf('fingering_optimizer')>=0}},
    {id:'v30_theory_scholar',name:'이론 학자',desc:'음악이론 개념맵 사용',check:function(){return ls30Get('features_used',[]).indexOf('theory_map')>=0}},
    {id:'v30_focus_analyst',name:'집중력 분석가',desc:'연습 집중도 분석기 사용',check:function(){return ls30Get('features_used',[]).indexOf('practice_focus')>=0}},
    {id:'v30_touch_expert',name:'터치 전문가',desc:'터치 감도 프로파일러 사용',check:function(){return ls30Get('features_used',[]).indexOf('touch_sensitivity')>=0}},
    {id:'v30_emotion_artist',name:'감정 예술가',desc:'감정-음악 매핑 도구 사용',check:function(){return ls30Get('features_used',[]).indexOf('emotion_mapper')>=0}},
    {id:'v30_duet_partner',name:'듀엇 파트너',desc:'듀엇 파트 분배기 사용',check:function(){return ls30Get('features_used',[]).indexOf('duet_allocator')>=0}},
    {id:'v30_level_assessor',name:'레벨 평가사',desc:'피아니스트 레벨 진단 사용',check:function(){return ls30Get('features_used',[]).indexOf('pianist_level')>=0}},
    {id:'v30_quiz_ace',name:'퀀즈 에이스',desc:'v21 퀀즈 10문 이상 정답',check:function(){return ls30Get('quiz21_score',0)>=10}},
    {id:'v30_rhythm_variety',name:'리듬 다양성',desc:'3종 이상 리듬 패턴 편집',check:function(){return Object.keys(ls30Get('rhythm_grids',{})).length>=3}},
    {id:'v30_focus_streak',name:'연습 스트릭',desc:'연습 집중도 20세션 이상 기록',check:function(){var d=ls30Get('practice_focus',[]);var t=0;for(var i=0;i<d.length;i++) for(var j=0;j<(d[i]||[]).length;j++) t+=(d[i][j]||0);return t>=20}},
    {id:'v30_complete',name:'v30 마스터',desc:'v30 기능 8종 전부 사용',check:function(){var f=ls30Get('features_used',[]);return f.length>=8}}
  ];
  achs.forEach(function(a){achFn(a);});
}

function checkV30Achievements(){
  var achCheck=window.checkAchievements;
  if(achCheck) achCheck();
}

// ================ KEYBOARD SHORTCUTS v30 ================
function setupV30Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    var map={
      'Q':'rhythm-composer-modal','W':'fingering-opt-modal','E':'theory-map-modal',
      'R':'practice-focus-modal','T':'touch-sens-modal','Y':'emotion-mapper-modal',
      'U':'duet-alloc-modal','I':'pianist-level-modal','Digit0':'quiz21-modal'
    };
    var key=e.key.toUpperCase();
    if(e.code==='Digit0') key='Digit0';
    var mid=map[key];
    if(mid){
      e.preventDefault();
      var m=document.getElementById(mid);
      if(m) m.style.display=m.style.display==='flex'?'none':'flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV30NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎵 리듬작곡',modal:'rhythm-composer-modal'},
    {label:'✋ 운지법',modal:'fingering-opt-modal'},
    {label:'📚 이론맵',modal:'theory-map-modal'},
    {label:'🎯 집중도',modal:'practice-focus-modal'},
    {label:'🎹 터치',modal:'touch-sens-modal'},
    {label:'🎨 감정',modal:'emotion-mapper-modal'},
    {label:'🎶 듀엇',modal:'duet-alloc-modal'},
    {label:'🏆 레벨',modal:'pianist-level-modal'},
    {label:'❓ 퀀즈v21',modal:'quiz21-modal'}
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
function initV30(){
  addV30Songs();
  buildRhythmPatternComposerUI();
  buildFingeringOptimizerUI();
  buildMusicTheoryMapUI();
  buildPracticeFocusUI();
  buildTouchSensitivityUI();
  buildEmotionMusicMapperUI();
  buildDuetPartAllocatorUI();
  buildPianistLevelDiagnosisUI();
  buildQuizV21UI();
  injectV30Achievements();
  setupV30Shortcuts();
  injectV30NavButtons();
  setInterval(checkV30Achievements, 15000);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initV30);}
else{setTimeout(initV30,200);}
})();
