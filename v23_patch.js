// Piano Master v23 Patch Module
// Genre Mastery Analyzer, Key Balance Trainer, Emotion Curve Editor, Chord Transition Timer,
// Arpeggio Pattern Builder, Concerto Guide, Rhythm Precision Matrix, Style DNA Profiler
// 10 Songs (192->202), Quiz v14 15Q (195->210), 12 Achievements (204->216), SFX 15, Keyboard 8+1
(function(){
'use strict';
if(window.__v23Loaded) return;
window.__v23Loaded = true;

var LS23 = 'piano-v23-';
function ls23Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS23+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls23Set(k,v){localStorage.setItem(LS23+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v23 (15 sounds) ================
var sfx23 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone23(freq,type,dur,gainVal,delayMs){
  if(!sfx23) return;
  setTimeout(function(){
    if(!sfx23) return;
    var t=sfx23.currentTime,g=sfx23.createGain(),o=sfx23.createOscillator();
    o.connect(g);g.connect(sfx23.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX23(type){
  if(!sfx23) return;
  if(sfx23.state==='suspended') sfx23.resume();
  switch(type){
    case 'genre_select': tone23(440,'triangle',0.12,0.06,0); break;
    case 'genre_levelup': tone23(523,'triangle',0.1,0.07,0); tone23(659,'triangle',0.1,0.07,70); tone23(784,'triangle',0.15,0.07,140); break;
    case 'balance_tap': tone23(392,'sine',0.08,0.06,0); break;
    case 'balance_session': tone23(349,'triangle',0.12,0.06,0); tone23(440,'triangle',0.15,0.06,90); break;
    case 'curve_draw': tone23(494,'sine',0.06,0.04,0); break;
    case 'curve_grade': tone23(523,'triangle',0.1,0.07,0); tone23(659,'triangle',0.12,0.07,80); tone23(880,'triangle',0.2,0.07,160); break;
    case 'chord_start': tone23(330,'triangle',0.1,0.06,0); break;
    case 'chord_tap': tone23(659,'triangle',0.1,0.08,0); tone23(880,'triangle',0.12,0.08,60); break;
    case 'arpeggio_play': tone23(523,'triangle',0.08,0.06,0); tone23(659,'triangle',0.08,0.06,80); tone23(784,'triangle',0.08,0.06,160); break;
    case 'concerto_select': tone23(440,'sine',0.15,0.06,0); tone23(554,'sine',0.15,0.06,100); break;
    case 'concerto_compare': tone23(392,'triangle',0.1,0.05,0); tone23(494,'triangle',0.1,0.05,70); tone23(587,'triangle',0.15,0.05,140); break;
    case 'rhythm_tap': tone23(698,'square',0.05,0.05,0); break;
    case 'style_analyze': tone23(262,'triangle',0.15,0.05,0); tone23(330,'triangle',0.15,0.05,80); tone23(392,'triangle',0.2,0.05,160); break;
    case 'v23_achieve': tone23(523,'triangle',0.1,0.1,0); tone23(659,'triangle',0.12,0.1,80); tone23(784,'triangle',0.12,0.1,160); tone23(1047,'triangle',0.25,0.1,240); break;
    case 'quiz_correct': tone23(659,'triangle',0.1,0.07,0); tone23(784,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v23 ================
function makeV23Modal(id, title, contentFn){
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

function markV23Feature(name){
  var used=ls23Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls23Set('features_used',used);}
}

function gradeOf(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}

// ================ 10 NEW SONGS (192->202) ================
function addV23Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s193',name:'드뷔시 달빛 (Clair de Lune)',category:'클래식',difficulty:'hard',
     notes:[{note:'Db4',time:0,dur:0.6},{note:'F4',time:0.6,dur:0.4},{note:'Ab4',time:1.0,dur:0.4},{note:'Db5',time:1.4,dur:0.8},{note:'C5',time:2.2,dur:0.4},{note:'Bb4',time:2.6,dur:0.4},{note:'Ab4',time:3.0,dur:0.6},{note:'F4',time:3.6,dur:0.4},{note:'Eb4',time:4.0,dur:0.4},{note:'Db4',time:4.4,dur:0.8},{note:'Bb3',time:5.2,dur:0.4},{note:'Db4',time:5.6,dur:1.0}]},
    {id:'s194',name:'에이나우디 구름 위의 하양',category:'현대',difficulty:'medium',
     notes:[{note:'A3',time:0,dur:0.3},{note:'C4',time:0.3,dur:0.3},{note:'E4',time:0.6,dur:0.3},{note:'A4',time:0.9,dur:0.5},{note:'G4',time:1.4,dur:0.3},{note:'E4',time:1.7,dur:0.3},{note:'C4',time:2.0,dur:0.3},{note:'A3',time:2.3,dur:0.5},{note:'F3',time:2.8,dur:0.3},{note:'A3',time:3.1,dur:0.3},{note:'C4',time:3.4,dur:0.3},{note:'F4',time:3.7,dur:0.8}]},
    {id:'s195',name:'이루마 키스 더 레인',category:'뉴에이지',difficulty:'easy',
     notes:[{note:'E4',time:0,dur:0.4},{note:'F#4',time:0.4,dur:0.4},{note:'G4',time:0.8,dur:0.4},{note:'B4',time:1.2,dur:0.6},{note:'A4',time:1.8,dur:0.4},{note:'G4',time:2.2,dur:0.4},{note:'F#4',time:2.6,dur:0.4},{note:'E4',time:3.0,dur:0.6},{note:'D4',time:3.6,dur:0.4},{note:'E4',time:4.0,dur:0.4},{note:'F#4',time:4.4,dur:0.4},{note:'E4',time:4.8,dur:0.8}]},
    {id:'s196',name:'쇼팽 환상즉흥곡',category:'클래식',difficulty:'expert',
     notes:[{note:'Bb4',time:0,dur:0.15},{note:'C5',time:0.15,dur:0.15},{note:'Db5',time:0.3,dur:0.15},{note:'Eb5',time:0.45,dur:0.15},{note:'F5',time:0.6,dur:0.3},{note:'Eb5',time:0.9,dur:0.15},{note:'Db5',time:1.05,dur:0.15},{note:'C5',time:1.2,dur:0.15},{note:'Bb4',time:1.35,dur:0.3},{note:'Ab4',time:1.65,dur:0.15},{note:'G4',time:1.8,dur:0.15},{note:'F4',time:1.95,dur:0.5}]},
    {id:'s197',name:'베토벤 엘리제를 위하여',category:'클래식',difficulty:'easy',
     notes:[{note:'E5',time:0,dur:0.2},{note:'D#5',time:0.2,dur:0.2},{note:'E5',time:0.4,dur:0.2},{note:'D#5',time:0.6,dur:0.2},{note:'E5',time:0.8,dur:0.2},{note:'B4',time:1.0,dur:0.2},{note:'D5',time:1.2,dur:0.2},{note:'C5',time:1.4,dur:0.2},{note:'A4',time:1.6,dur:0.6},{note:'C4',time:2.2,dur:0.2},{note:'E4',time:2.4,dur:0.2},{note:'A4',time:2.6,dur:0.6}]},
    {id:'s198',name:'히사이시 조 썸머',category:'OST',difficulty:'medium',
     notes:[{note:'G4',time:0,dur:0.3},{note:'A4',time:0.3,dur:0.3},{note:'B4',time:0.6,dur:0.3},{note:'D5',time:0.9,dur:0.6},{note:'B4',time:1.5,dur:0.3},{note:'A4',time:1.8,dur:0.3},{note:'G4',time:2.1,dur:0.3},{note:'E4',time:2.4,dur:0.6},{note:'D4',time:3.0,dur:0.3},{note:'E4',time:3.3,dur:0.3},{note:'G4',time:3.6,dur:0.3},{note:'D5',time:3.9,dur:0.8}]},
    {id:'s199',name:'리스트 라 캄파넬라',category:'클래식',difficulty:'expert',
     notes:[{note:'Gb5',time:0,dur:0.1},{note:'F5',time:0.1,dur:0.1},{note:'Gb5',time:0.2,dur:0.1},{note:'Db5',time:0.3,dur:0.2},{note:'Gb5',time:0.5,dur:0.1},{note:'F5',time:0.6,dur:0.1},{note:'Eb5',time:0.7,dur:0.1},{note:'Db5',time:0.8,dur:0.2},{note:'Cb5',time:1.0,dur:0.1},{note:'Bb4',time:1.1,dur:0.1},{note:'Gb4',time:1.2,dur:0.2},{note:'Db5',time:1.4,dur:0.5}]},
    {id:'s200',name:'스콧 조플린 엔터테이너',category:'래그타임',difficulty:'medium',
     notes:[{note:'D4',time:0,dur:0.15},{note:'E4',time:0.15,dur:0.15},{note:'C4',time:0.3,dur:0.15},{note:'A3',time:0.45,dur:0.3},{note:'D4',time:0.75,dur:0.15},{note:'E4',time:0.9,dur:0.15},{note:'C4',time:1.05,dur:0.15},{note:'A3',time:1.2,dur:0.3},{note:'D4',time:1.5,dur:0.15},{note:'F4',time:1.65,dur:0.15},{note:'E4',time:1.8,dur:0.15},{note:'D4',time:1.95,dur:0.4}]},
    {id:'s201',name:'사티 짐노페디 1번',category:'클래식',difficulty:'easy',
     notes:[{note:'G3',time:0,dur:1.0},{note:'D4',time:1.0,dur:0.5},{note:'A4',time:1.5,dur:0.5},{note:'B4',time:2.0,dur:1.0},{note:'D4',time:3.0,dur:0.5},{note:'F#4',time:3.5,dur:0.5},{note:'G3',time:4.0,dur:1.0},{note:'D4',time:5.0,dur:0.5},{note:'G4',time:5.5,dur:0.5},{note:'A4',time:6.0,dur:1.0},{note:'B4',time:7.0,dur:0.5},{note:'D5',time:7.5,dur:1.0}]},
    {id:'s202',name:'쇼팽 발라드 1번',category:'클래식',difficulty:'expert',
     notes:[{note:'C4',time:0,dur:0.6},{note:'Eb4',time:0.6,dur:0.4},{note:'G4',time:1.0,dur:0.4},{note:'C5',time:1.4,dur:0.8},{note:'Bb4',time:2.2,dur:0.4},{note:'Ab4',time:2.6,dur:0.4},{note:'G4',time:3.0,dur:0.8},{note:'F4',time:3.8,dur:0.4},{note:'Eb4',time:4.2,dur:0.4},{note:'D4',time:4.6,dur:0.4},{note:'C4',time:5.0,dur:0.4},{note:'G3',time:5.4,dur:1.0}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ RADAR CHART HELPER ================
function drawRadar(ctx,cx,cy,r,labels,values,maxVal,color,fillAlpha){
  var n=labels.length;
  ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
  for(var ring=1;ring<=4;ring++){
    ctx.beginPath();
    for(var i=0;i<=n;i++){
      var a=-Math.PI/2+(i%n)*(Math.PI*2/n);
      var rr=r*ring/4;
      var x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  for(i=0;i<n;i++){
    var ang=-Math.PI/2+i*(Math.PI*2/n);
    ctx.strokeStyle='#2a3050';
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);ctx.stroke();
    ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
    var lx=cx+Math.cos(ang)*(r+18),ly=cy+Math.sin(ang)*(r+18);
    ctx.fillText(labels[i],lx,ly);
  }
  ctx.beginPath();
  for(i=0;i<n;i++){
    var a2=-Math.PI/2+i*(Math.PI*2/n);
    var v=Math.min(values[i]/maxVal,1)*r;
    var x2=cx+Math.cos(a2)*v,y2=cy+Math.sin(a2)*v;
    if(i===0)ctx.moveTo(x2,y2);else ctx.lineTo(x2,y2);
  }
  ctx.closePath();
  ctx.fillStyle=color+Math.round(fillAlpha*255).toString(16).padStart(2,'0');
  ctx.strokeStyle=color;ctx.lineWidth=2;
  ctx.fill();ctx.stroke();
  ctx.textAlign='left';
}

// ================ 1. MUSIC GENRE MASTERY ANALYZER ================
function buildGenreMasteryUI(){
  var GENRES=[
    {name:'클래식',color:'#4a7dff',stats:[7,5,7,8,6,9]},
    {name:'재즈',color:'#f97316',stats:[8,6,9,7,8,7]},
    {name:'팝',color:'#ec4899',stats:[4,6,4,5,6,5]},
    {name:'블루스',color:'#3b82f6',stats:[5,4,6,6,7,7]},
    {name:'록',color:'#ef4444',stats:[6,8,5,9,8,6]},
    {name:'보사노바',color:'#22c55e',stats:[5,5,7,4,7,6]},
    {name:'왈츠',color:'#a78bfa',stats:[5,6,5,6,8,7]},
    {name:'래그타임',color:'#eab308',stats:[7,7,6,6,9,5]},
    {name:'인상주의',color:'#06b6d4',stats:[8,3,8,7,4,9]},
    {name:'미니멀리즘',color:'#8892a8',stats:[6,4,3,5,7,6]}
  ];
  var AXES=['난이도','템포','화성복잡도','다이나믹','리듬','표현력'];

  makeV23Modal('genre-mastery-modal','🎼 음악 장르 마스터리 분석기',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">장르를 선택하고 연습해 마스터리를 쌓으세요!</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px" id="genre-btns"></div>'+
      '<button id="genre-practice-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer;margin-bottom:8px">🎹 연습하기</button>'+
      '<canvas id="genre-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var curGenre=0;
    var mastery=ls23Get('genre_mastery',{});

    var btnsDiv=document.getElementById('genre-btns');
    GENRES.forEach(function(g,i){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid '+g.color+';background:'+(i===curGenre?g.color:g.color+'20')+';color:'+(i===curGenre?'white':g.color)+';font-size:9px;cursor:pointer';
      btn.textContent=g.name;
      btn.addEventListener('click',function(){
        curGenre=i;playSFX23('genre_select');markV23Feature('genre_mastery');
        Array.from(btnsDiv.children).forEach(function(b,j){
          b.style.background=j===i?GENRES[j].color:GENRES[j].color+'20';
          b.style.color=j===i?'white':GENRES[j].color;
        });
        drawGenreCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    document.getElementById('genre-practice-btn').addEventListener('click',function(){
      var g=GENRES[curGenre];
      mastery[g.name]=(mastery[g.name]||0)+1;
      ls23Set('genre_mastery',mastery);
      playSFX23('genre_levelup');markV23Feature('genre_mastery');
      drawGenreCanvas();
    });

    function totalPct(){
      var sum=0;
      GENRES.forEach(function(g){sum+=Math.min((mastery[g.name]||0)/10,1);});
      return Math.round(sum/GENRES.length*100);
    }

    function drawGenreCanvas(){
      var c=document.getElementById('genre-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      var g=GENRES[curGenre];
      var pct=totalPct(),grade=gradeOf(pct);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎼 '+g.name+' 마스터리 레이더',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('전체 마스터리: '+pct+'% ('+grade+'등급) | 연습 횟수: '+(mastery[g.name]||0),20,42);

      drawRadar(ctx,160,175,110,AXES,g.stats,10,g.color,0.35);

      var barX=320,barY=70,barW=280,barH=16;
      GENRES.forEach(function(gg,i){
        var y=barY+i*30;
        var m=Math.min((mastery[gg.name]||0)/10,1);
        ctx.fillStyle='#1e2640';
        ctx.beginPath();ctx.roundRect(barX,y,barW,barH,4);ctx.fill();
        ctx.fillStyle=gg.color+(i===curGenre?'ff':'99');
        ctx.beginPath();ctx.roundRect(barX,y,barW*m,barH,4);ctx.fill();
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';
        ctx.fillText(gg.name+' '+Math.round(m*100)+'%',barX+4,y+12);
      });
    }

    drawGenreCanvas();
  });
}

// ================ 2. KEY BALANCE TRAINER ================
function buildKeyBalanceUI(){
  var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  makeV23Modal('key-balance-modal','⚖️ 건반 밸런스 트레이너',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">좌/우손을 선택해 미니 건반을 탭하고 균형을 확인하세요.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px" id="hand-select">'+
        '<button id="hand-left" style="padding:5px 12px;border-radius:6px;border:1px solid #4a7dff;background:#4a7dff;color:white;font-size:11px;cursor:pointer">◀ 왼손</button>'+
        '<button id="hand-right" style="padding:5px 12px;border-radius:6px;border:1px solid #ec4899;background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">오른손 ▶</button>'+
        '<button id="hand-session-end" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;margin-left:auto">💾 세션 종료</button>'+
      '</div>'+
      '<canvas id="balance-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:pointer"></canvas>';

    var curHand='left';
    var counts=ls23Get('balance_counts',{left:new Array(12).fill(0),right:new Array(12).fill(0)});
    var sessions=ls23Get('balance_sessions',[]);

    document.getElementById('hand-left').addEventListener('click',function(){
      curHand='left';
      this.style.background='#4a7dff';this.style.color='white';
      var rb=document.getElementById('hand-right');rb.style.background='var(--surface2,#1a1f35)';rb.style.color='var(--text,#e8ecf4)';
      drawBalanceCanvas(-1);
    });
    document.getElementById('hand-right').addEventListener('click',function(){
      curHand='right';
      this.style.background='#ec4899';this.style.color='white';
      var lb=document.getElementById('hand-left');lb.style.background='var(--surface2,#1a1f35)';lb.style.color='var(--text,#e8ecf4)';
      drawBalanceCanvas(-1);
    });
    document.getElementById('hand-session-end').addEventListener('click',function(){
      sessions.push({date:new Date().toISOString().slice(0,10),left:counts.left.reduce(function(a,b){return a+b},0),right:counts.right.reduce(function(a,b){return a+b},0)});
      if(sessions.length>30) sessions=sessions.slice(-30);
      ls23Set('balance_sessions',sessions);
      playSFX23('balance_session');markV23Feature('key_balance');
      drawBalanceCanvas(-1);
    });

    function weakZones(){
      var arr=curHand==='left'?counts.left:counts.right;
      var maxC=Math.max.apply(null,arr);
      if(maxC===0) return [];
      var weak=[];
      arr.forEach(function(v,i){if(v<maxC*0.3) weak.push(NOTE_NAMES[i]);});
      return weak;
    }

    function keyRectAt(i,W){
      var keyW=W/12;
      return {x:i*keyW,w:keyW-2};
    }

    function drawBalanceCanvas(hoverIdx){
      var c=document.getElementById('balance-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('⚖️ 건반 밸런스 ('+(curHand==='left'?'왼손':'오른손')+')',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('세션 기록: '+sessions.length+'/30',20,42);

      var kbY=55,kbH=60;
      for(var i=0;i<12;i++){
        var kr=keyRectAt(i,W-40);
        var x=20+kr.x;
        var isBlack=[1,3,6,8,10].indexOf(i)!==-1;
        ctx.fillStyle=i===hoverIdx?'#4a7dff':(isBlack?'#1e2640':'#2a3050');
        ctx.strokeStyle='#3a4060';ctx.lineWidth=1;
        ctx.fillRect(x,kbY,kr.w,kbH);ctx.strokeRect(x,kbY,kr.w,kbH);
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(NOTE_NAMES[i],x+kr.w/2,kbY+kbH+12);
        ctx.textAlign='left';
      }

      var barY=140,barH=14,barMaxW=W-160;
      var maxCount=Math.max.apply(null,counts.left.concat(counts.right).concat([1]));
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('왼손 분포',20,barY-4);
      for(i=0;i<12;i++){
        var y1=barY+i*20;
        var w1=counts.left[i]/maxCount*barMaxW;
        ctx.fillStyle='#1e2640';ctx.fillRect(60,y1,barMaxW,barH);
        ctx.fillStyle='#4a7dff';ctx.fillRect(60,y1,w1,barH);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(NOTE_NAMES[i],20,y1+11);
        ctx.fillStyle='#e8ecf4';ctx.fillText(''+counts.left[i],64+w1,y1+11);
      }

      var barX2=W/2+20;
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('오른손 분포',barX2,barY-4);
      for(i=0;i<12;i++){
        var y2=barY+i*20;
        var w2=counts.right[i]/maxCount*(barMaxW-140);
        ctx.fillStyle='#1e2640';ctx.fillRect(barX2+40,y2,barMaxW-140,barH);
        ctx.fillStyle='#ec4899';ctx.fillRect(barX2+40,y2,w2,barH);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(NOTE_NAMES[i],barX2,y2+11);
        ctx.fillStyle='#e8ecf4';ctx.fillText(''+counts.right[i],barX2+44+w2,y2+11);
      }

      var weak=weakZones();
      ctx.fillStyle='#eab308';ctx.font='10px sans-serif';
      ctx.fillText(weak.length>0?'⚠ 약점 구간: '+weak.join(', ')+' — 해당 음역 스케일 연습 권장':'✓ 균형이 양호합니다',20,H-15);
    }

    var canvas=document.getElementById('balance-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width),my=(e.clientY-rect.top)*(380/rect.height);
      if(my>=55&&my<=115){
        for(var i=0;i<12;i++){
          var kr=keyRectAt(i,560);
          var x=20+kr.x;
          if(mx>=x&&mx<=x+kr.w){
            counts[curHand][i]++;
            ls23Set('balance_counts',counts);
            var freq=440*Math.pow(2,(i-9)/12);
            tone23(freq,'triangle',0.15,0.06,0);
            playSFX23('balance_tap');markV23Feature('key_balance');
            drawBalanceCanvas(i);
            return;
          }
        }
      }
    });

    drawBalanceCanvas(-1);
  });
}

// ================ 3. MUSICAL EMOTION CURVE EDITOR ================
function buildEmotionCurveUI(){
  var PRESETS={
    '기쁨':[0.3,0.5,0.7,0.9,0.8,0.9,1.0,0.8],
    '슬픔':[0.6,0.4,0.3,0.2,0.15,0.2,0.3,0.2],
    '긴장':[0.2,0.3,0.5,0.7,0.85,0.95,0.9,0.6],
    '해방':[0.9,0.7,0.5,0.4,0.6,0.8,0.9,1.0],
    '클라이맥스':[0.2,0.35,0.5,0.65,0.8,0.95,1.0,0.7],
    '평온':[0.3,0.32,0.3,0.35,0.3,0.28,0.3,0.32],
    '드라마틱':[0.4,0.8,0.3,0.9,0.5,1.0,0.4,0.7],
    '몽환':[0.3,0.45,0.35,0.5,0.4,0.55,0.45,0.35]
  };
  var VEL_LABEL=['pp','p','mp','mf','f','ff'];

  makeV23Modal('emotion-curve-modal','📈 음악 감정 곡선 에디터',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">타임라인 위를 드래그해 다이나믹 곡선을 그려보세요. (pp~ff)</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px" id="curve-preset-btns"></div>'+
      '<button id="curve-grade-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer;margin-bottom:8px">📊 채점하기</button>'+
      '<canvas id="curve-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:crosshair"></canvas>'+
      '<div id="curve-result" style="margin-top:6px;font-size:12px;color:var(--text2)"></div>';

    var STEPS=16;
    var userCurve=new Array(STEPS).fill(0.5);
    var curPreset=Object.keys(PRESETS)[0];
    var drawing=false;
    var best=ls23Get('curve_best',{});

    var btnsDiv=document.getElementById('curve-preset-btns');
    Object.keys(PRESETS).forEach(function(name){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:'+(name===curPreset?'var(--accent)':'var(--surface2)')+';color:'+(name===curPreset?'white':'var(--text)')+';font-size:9px;cursor:pointer';
      btn.textContent=name;
      btn.addEventListener('click',function(){
        curPreset=name;
        Array.from(btnsDiv.children).forEach(function(b){
          b.style.background=b.textContent===name?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=b.textContent===name?'white':'var(--text,#e8ecf4)';
        });
        document.getElementById('curve-result').innerHTML='';
        drawCurveCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    function velLabel(v){
      var idx=Math.min(VEL_LABEL.length-1,Math.floor(v*VEL_LABEL.length));
      return VEL_LABEL[idx];
    }

    function stepFromX(mx,W){
      var chartX=50,chartW=W-80;
      var step=Math.round((mx-chartX)/chartW*(STEPS-1));
      return Math.max(0,Math.min(STEPS-1,step));
    }
    function valFromY(my,H){
      var chartY=60,chartH=H-140;
      var v=1-(my-chartY)/chartH;
      return Math.max(0,Math.min(1,v));
    }

    function drawCurveCanvas(){
      var c=document.getElementById('curve-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('📈 감정 곡선: '+curPreset,20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('MIDI 벨로시티 매핑 pp(20)~ff(120) | 최고점수: '+(best[curPreset]||0)+'%',20,42);

      var chartX=50,chartY=60,chartW=W-80,chartH=H-140;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var gy=0;gy<=4;gy++){
        var yy=chartY+chartH*gy/4;
        ctx.beginPath();ctx.moveTo(chartX,yy);ctx.lineTo(chartX+chartW,yy);ctx.stroke();
      }
      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
      VEL_LABEL.slice().reverse().forEach(function(l,i){
        ctx.fillText(l,10,chartY+chartH*i/(VEL_LABEL.length-1)+3);
      });

      var preset=PRESETS[curPreset];
      ctx.strokeStyle='#8892a8';ctx.lineWidth=2;ctx.setLineDash([4,3]);
      ctx.beginPath();
      preset.forEach(function(v,i){
        var x=chartX+i/(preset.length-1)*chartW;
        var y=chartY+chartH*(1-v);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();ctx.setLineDash([]);

      ctx.strokeStyle='#4a7dff';ctx.lineWidth=3;
      ctx.beginPath();
      userCurve.forEach(function(v,i){
        var x=chartX+i/(STEPS-1)*chartW;
        var y=chartY+chartH*(1-v);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();
      userCurve.forEach(function(v,i){
        var x=chartX+i/(STEPS-1)*chartW;
        var y=chartY+chartH*(1-v);
        ctx.fillStyle='#4a7dff';
        ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
      });

      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('실선=내 곡선  점선='+curPreset+' 프리셋',chartX,chartY+chartH+20);
      ctx.fillText('현재 평균 벨로시티: '+velLabel(userCurve.reduce(function(a,b){return a+b},0)/STEPS),chartX,chartY+chartH+34);
    }

    var canvas=document.getElementById('curve-canvas');
    function handleDraw(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width),my=(e.clientY-rect.top)*(400/rect.height);
      var step=stepFromX(mx,620),val=valFromY(my,400);
      userCurve[step]=val;
      playSFX23('curve_draw');
      drawCurveCanvas();
    }
    canvas.addEventListener('mousedown',function(e){drawing=true;handleDraw(e);});
    canvas.addEventListener('mousemove',function(e){if(drawing) handleDraw(e);});
    window.addEventListener('mouseup',function(){drawing=false;});
    canvas.addEventListener('touchstart',function(e){drawing=true;handleDraw(e.touches[0]);e.preventDefault();});
    canvas.addEventListener('touchmove',function(e){if(drawing){handleDraw(e.touches[0]);e.preventDefault();}});
    canvas.addEventListener('touchend',function(){drawing=false;});

    document.getElementById('curve-grade-btn').addEventListener('click',function(){
      var preset=PRESETS[curPreset];
      var diffSum=0;
      for(var i=0;i<STEPS;i++){
        var pv=preset[Math.min(preset.length-1,Math.floor(i/STEPS*preset.length))];
        diffSum+=Math.abs(userCurve[i]-pv);
      }
      var avgDiff=diffSum/STEPS;
      var pct=Math.max(0,Math.round((1-avgDiff)*100));
      var grade=gradeOf(pct);
      best[curPreset]=Math.max(best[curPreset]||0,pct);
      ls23Set('curve_best',best);
      playSFX23('curve_grade');markV23Feature('emotion_curve');
      document.getElementById('curve-result').innerHTML='<b style="color:var(--accent)">채점 결과: '+pct+'% ('+grade+'등급)</b>';
      drawCurveCanvas();
    });

    drawCurveCanvas();
  });
}

// ================ 4. CHORD TRANSITION TIMER ================
function buildChordTransitionUI(){
  var TRANSITIONS=[
    'C→G','Am→F','G→D','F→C','Dm→G','Em→Am','C→F','G→Em',
    'Am→Dm','D→A','Bm→G','F→Bb'
  ];

  makeV23Modal('chord-transition-modal','⏱️ 코드 전환 타이머',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">전환을 선택하고 시작 후, 전환했다고 느낄 때 탭하세요.</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px" id="chord-trans-btns"></div>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px">'+
        '<button id="chord-start-btn" style="padding:6px 14px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">▶ 시작</button>'+
        '<button id="chord-tap-btn" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer" disabled>👆 탭!</button>'+
      '</div>'+
      '<canvas id="chord-trans-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var curIdx=0,startTime=0,waiting=false;
    var bestTimes=ls23Get('chord_best',{});
    var trend=ls23Get('chord_trend',[]);

    var btnsDiv=document.getElementById('chord-trans-btns');
    TRANSITIONS.forEach(function(t,i){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:'+(i===curIdx?'var(--accent)':'var(--surface2)')+';color:'+(i===curIdx?'white':'var(--text)')+';font-size:9px;cursor:pointer';
      btn.textContent=t;
      btn.addEventListener('click',function(){
        curIdx=i;
        Array.from(btnsDiv.children).forEach(function(b,j){
          b.style.background=j===i?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=j===i?'white':'var(--text,#e8ecf4)';
        });
        drawChordCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    document.getElementById('chord-start-btn').addEventListener('click',function(){
      playSFX23('chord_start');
      startTime=performance.now();
      waiting=true;
      document.getElementById('chord-tap-btn').disabled=false;
      drawChordCanvas();
    });
    document.getElementById('chord-tap-btn').addEventListener('click',function(){
      if(!waiting) return;
      waiting=false;
      var elapsed=Math.round(performance.now()-startTime);
      var key=TRANSITIONS[curIdx];
      if(!bestTimes[key]||elapsed<bestTimes[key]) bestTimes[key]=elapsed;
      ls23Set('chord_best',bestTimes);
      trend.push(elapsed);
      if(trend.length>20) trend=trend.slice(-20);
      ls23Set('chord_trend',trend);
      playSFX23('chord_tap');markV23Feature('chord_transition');
      document.getElementById('chord-tap-btn').disabled=true;
      drawChordCanvas(elapsed);
    });

    function drawChordCanvas(lastElapsed){
      var c=document.getElementById('chord-trans-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('⏱️ '+TRANSITIONS[curIdx]+(waiting?' - 지금 전환하세요!':''),20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(lastElapsed?'방금 기록: '+lastElapsed+'ms':'12종 코드 전환 반응속도 측정',20,42);

      var barY=60,barH=13,barMaxW=W-220;
      var maxT=0;
      TRANSITIONS.forEach(function(t){if(bestTimes[t]&&bestTimes[t]>maxT)maxT=bestTimes[t];});
      if(maxT===0) maxT=1000;
      TRANSITIONS.forEach(function(t,i){
        var y=barY+i*20;
        var val=bestTimes[t]||0;
        var w=val/maxT*barMaxW;
        ctx.fillStyle='#1e2640';ctx.fillRect(90,y,barMaxW,barH);
        ctx.fillStyle=i===curIdx?'#4a7dff':'#3b82f680';
        ctx.fillRect(90,y,w,barH);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(t,20,y+10);
        ctx.fillStyle='#e8ecf4';
        ctx.fillText(val?val+'ms':'-',94+w,y+10);
      });

      if(trend.length>1){
        var tY=barY+TRANSITIONS.length*20+20,tH=60,tX=90,tW=barMaxW;
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText('최근 20회 반응속도 추이',20,tY);
        var maxTr=Math.max.apply(null,trend),minTr=Math.min.apply(null,trend);
        var range=maxTr-minTr||1;
        ctx.strokeStyle='#22c55e';ctx.lineWidth=2;
        ctx.beginPath();
        trend.forEach(function(v,i){
          var x=tX+i/(trend.length-1)*tW;
          var y=tY+10+tH-(v-minTr)/range*tH;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }
    }

    drawChordCanvas();
  });
}

// ================ 5. ARPEGGIO PATTERN BUILDER ================
function buildArpeggioBuilderUI(){
  var CHORD=[60,64,67,72];
  var PATTERNS={
    '상행':function(c){return c.slice()},
    '하행':function(c){return c.slice().reverse()},
    '분산':function(c){return [c[0],c[2],c[1],c[3]]},
    '알베르티 베이스':function(c){return [c[0],c[2],c[1],c[2]]},
    '트레몰로':function(c){return [c[0],c[2],c[0],c[2]]},
    '롤드 코드':function(c){return c.slice()},
    '교차손':function(c){return [c[0],c[3],c[1],c[2]]},
    '왈츠':function(c){return [c[0],c[1],c[2],c[1]]}
  };
  var patternKeys=Object.keys(PATTERNS);
  var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  function midiToName(m){return NOTE_NAMES[m%12]+(Math.floor(m/12)-1)}

  makeV23Modal('arpeggio-builder-modal','🎶 아르페지오 패턴 빌더',function(content){
    content.innerHTML=
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px" id="arp-pattern-btns"></div>'+
      '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">'+
        '<label style="font-size:10px;color:var(--text2)">BPM: <span id="arp-bpm-val">100</span></label>'+
        '<input type="range" id="arp-bpm" min="40" max="200" value="100" style="flex:1">'+
        '<button id="arp-play-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">▶ 재생</button>'+
      '</div>'+
      '<canvas id="arp-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var curPattern=patternKeys[0];
    var bpm=100;
    var usage=ls23Get('arp_usage',{});

    var btnsDiv=document.getElementById('arp-pattern-btns');
    patternKeys.forEach(function(pk){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:'+(pk===curPattern?'var(--accent)':'var(--surface2)')+';color:'+(pk===curPattern?'white':'var(--text)')+';font-size:9px;cursor:pointer';
      btn.textContent=pk;
      btn.addEventListener('click',function(){
        curPattern=pk;
        Array.from(btnsDiv.children).forEach(function(b){
          b.style.background=b.textContent===pk?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=b.textContent===pk?'white':'var(--text,#e8ecf4)';
        });
        markV23Feature('arpeggio_builder');
        drawArpCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    document.getElementById('arp-bpm').addEventListener('input',function(){
      bpm=parseInt(this.value);
      document.getElementById('arp-bpm-val').textContent=bpm;
    });

    document.getElementById('arp-play-btn').addEventListener('click',function(){
      var seq=PATTERNS[curPattern](CHORD);
      var beatMs=60000/bpm;
      usage[curPattern]=(usage[curPattern]||0)+1;
      ls23Set('arp_usage',usage);
      playSFX23('arpeggio_play');markV23Feature('arpeggio_builder');
      seq.forEach(function(m,i){
        var freq=440*Math.pow(2,(m-69)/12);
        tone23(freq,'triangle',beatMs/1000*0.9,0.07,i*beatMs);
      });
      drawArpCanvas();
    });

    function drawArpCanvas(){
      var c=document.getElementById('arp-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎶 '+curPattern+' 패턴 (C 메이저)',20,25);
      var totalUsage=Object.keys(usage).reduce(function(s,k){return s+usage[k]},0);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('BPM '+bpm+' | 총 연주 횟수: '+totalUsage,20,42);

      var seq=PATTERNS[curPattern](CHORD);
      var kbY=70,kbW=W-40,keyW=kbW/13,kbH=50;
      for(var k=0;k<13;k++){
        var midi=60+k;
        var isBlack=[1,3,6,8,10].indexOf(k%12)!==-1&&k<12;
        ctx.fillStyle=isBlack?'#1e2640':'#2a3050';
        ctx.strokeStyle='#3a4060';
        ctx.fillRect(20+k*keyW,kbY,keyW-1,kbH);ctx.strokeRect(20+k*keyW,kbY,keyW-1,kbH);
      }

      var seqY=kbY+kbH+40;
      var stepW=(W-80)/seq.length;
      seq.forEach(function(m,i){
        var x=40+i*stepW;
        var keyIdx=m-60;
        var kx=20+keyIdx*keyW+keyW/2;
        ctx.strokeStyle='rgba(74,125,255,0.4)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(kx,kbY+kbH);ctx.lineTo(x,seqY);ctx.stroke();

        ctx.fillStyle='rgba(74,125,255,0.7)';
        ctx.beginPath();ctx.arc(x,seqY,16,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(midiToName(m),x,seqY+4);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(''+(i+1),x,seqY+30);
        ctx.textAlign='left';
        if(i<seq.length-1){
          ctx.strokeStyle='rgba(139,146,168,0.4)';
          ctx.beginPath();ctx.moveTo(x+16,seqY);ctx.lineTo(x+stepW-16,seqY);ctx.stroke();
        }
      });

      var listY=seqY+60;
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      patternKeys.forEach(function(pk,i){
        ctx.fillText(pk+': '+(usage[pk]||0)+'회',20+((i%2)*300),listY+Math.floor(i/2)*16);
      });
    }

    drawArpCanvas();
  });
}

// ================ 6. PIANO CONCERTO GUIDE ================
function buildConcertoGuideUI(){
  var CONCERTOS=[
    {name:'모차르트 협주곡 K.488',composer:'Mozart',stats:[5,7,5,7,6,9],desc:'A장조, 우아하고 서정적인 2악장이 특히 유명'},
    {name:'베토벤 황제 협주곡',composer:'Beethoven',stats:[8,9,7,9,8,10],desc:'5번 협주곡, 웅장하고 영웅적인 스케일'},
    {name:'쇼팽 협주곡 1번',composer:'Chopin',stats:[8,9,5,7,7,8],desc:'e단조, 시적이고 화려한 피아니즘'},
    {name:'차이콥스키 협주곡 1번',composer:'Tchaikovsky',stats:[9,9,8,10,7,9],desc:'유명한 오프닝 화음, 강렬한 낭만주의'},
    {name:'라흐마니노프 협주곡 2번',composer:'Rachmaninoff',stats:[9,10,8,9,8,9],desc:'풍부한 선율과 깊은 러시아 정서'},
    {name:'그리그 피아노 협주곡',composer:'Grieg',stats:[6,8,6,8,6,8],desc:'a단조, 북유럽 민속색이 짙은 서정성'},
    {name:'슈만 피아노 협주곡',composer:'Schumann',stats:[7,8,6,7,6,8],desc:'a단조, 낭만적 대화형 오케스트레이션'},
    {name:'리스트 협주곡 1번',composer:'Liszt',stats:[9,7,7,7,4,8],desc:'단악장 구조, 화려한 비르투오소 기교'},
    {name:'브람스 협주곡 1번',composer:'Brahms',stats:[8,8,9,6,9,8],desc:'d단조, 교향적 무게감의 대작'},
    {name:'라벨 피아노 협주곡 G장조',composer:'Ravel',stats:[7,6,8,7,5,7],desc:'재즈 영향의 색채감 넘치는 관현악법'}
  ];
  var AXES=['기술난이도','감정深이','오케스트라복잡도','인기도','길이','역사적의의'];

  makeV23Modal('concerto-guide-modal','🎻 피아노 협주곡 가이드',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">클릭해서 상세정보를 보고, 비교 모드로 2곡을 겹쳐보세요.</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px" id="concerto-btns"></div>'+
      '<button id="concerto-compare-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;margin-bottom:8px">🔀 비교 모드</button>'+
      '<canvas id="concerto-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="concerto-detail" style="margin-top:8px;font-size:11px;color:var(--text2)"></div>';

    var curIdx=0,compareMode=false,compareIdx=-1;
    var viewed=ls23Get('concerto_viewed',[]);

    var btnsDiv=document.getElementById('concerto-btns');
    CONCERTOS.forEach(function(cc,i){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:'+(i===curIdx?'var(--accent)':'var(--surface2)')+';color:'+(i===curIdx?'white':'var(--text)')+';font-size:9px;cursor:pointer';
      btn.textContent=cc.composer;
      btn.addEventListener('click',function(){
        if(compareMode&&i!==curIdx){compareIdx=i;}
        else{curIdx=i;compareIdx=-1;}
        if(viewed.indexOf(i)===-1){viewed.push(i);ls23Set('concerto_viewed',viewed);}
        playSFX23('concerto_select');markV23Feature('concerto_guide');
        Array.from(btnsDiv.children).forEach(function(b,j){
          var active=j===curIdx||j===compareIdx;
          b.style.background=active?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=active?'white':'var(--text,#e8ecf4)';
        });
        updateDetail();
        drawConcertoCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    document.getElementById('concerto-compare-btn').addEventListener('click',function(){
      compareMode=!compareMode;
      this.style.background=compareMode?'var(--accent)':'var(--surface2)';
      this.style.color=compareMode?'white':'var(--text)';
      if(!compareMode) compareIdx=-1;
      else playSFX23('concerto_compare');
      drawConcertoCanvas();
    });

    function updateDetail(){
      var cc=CONCERTOS[curIdx];
      document.getElementById('concerto-detail').innerHTML='<b style="color:var(--accent)">'+cc.name+'</b> — '+cc.desc+' | 탐색: '+viewed.length+'/'+CONCERTOS.length;
    }

    function drawConcertoCanvas(){
      var c=document.getElementById('concerto-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      var cc=CONCERTOS[curIdx];
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎻 '+cc.name,20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(compareMode?'비교 모드: 다른 작곡가를 클릭하세요':'6축 레이더 분석',20,42);

      drawRadar(ctx,W/2,200,130,AXES,cc.stats,10,'#4a7dff',0.3);
      if(compareIdx>=0){
        drawRadar(ctx,W/2,200,130,AXES,CONCERTOS[compareIdx].stats,10,'#ec4899',0.25);
        ctx.fillStyle='#4a7dff';ctx.font='10px sans-serif';ctx.fillText('■ '+cc.composer,20,370);
        ctx.fillStyle='#ec4899';ctx.fillText('■ '+CONCERTOS[compareIdx].composer,140,370);
      }
    }

    updateDetail();
    drawConcertoCanvas();
  });
}

// ================ 7. RHYTHM PRECISION MATRIX ================
function buildRhythmMatrixUI(){
  var SIGNATURES=['4/4','3/4','6/8','2/4','5/4','7/8','12/8','2/2'];
  var TEMPO_RANGES=['60-80','81-100','101-120','121-140','141-160'];

  makeV23Modal('rhythm-matrix-modal','🥁 리듬 정밀도 매트릭스',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">박자와 템포를 선택하고 정확한 타이밍에 탭하세요.</p>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">'+
        '<select id="rhythm-sig-sel" style="padding:4px;border-radius:6px;background:var(--surface2);color:var(--text);border:1px solid var(--border);font-size:10px"></select>'+
        '<select id="rhythm-tempo-sel" style="padding:4px;border-radius:6px;background:var(--surface2);color:var(--text);border:1px solid var(--border);font-size:10px"></select>'+
        '<button id="rhythm-test-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">🥁 테스트 (8탭)</button>'+
      '</div>'+
      '<canvas id="rhythm-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var matrix=ls23Get('rhythm_matrix',{});
    var sigSel=document.getElementById('rhythm-sig-sel'),tempoSel=document.getElementById('rhythm-tempo-sel');
    SIGNATURES.forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;sigSel.appendChild(o);});
    TEMPO_RANGES.forEach(function(t){var o=document.createElement('option');o.value=t;o.textContent=t+' BPM';tempoSel.appendChild(o);});

    var testing=false,tapTimes=[],testTempo=100,testStart=0,beatTimer=null;

    document.getElementById('rhythm-test-btn').addEventListener('click',function(){
      if(testing) return;
      testing=true;tapTimes=[];
      testTempo=parseInt(tempoSel.value.split('-')[0])+10;
      var beatMs=60000/testTempo;
      testStart=performance.now();
      var btn=this;btn.disabled=true;btn.textContent='탭하세요 (스페이스/클릭)';
      var beatCount=0;
      beatTimer=setInterval(function(){
        tone23(880,'square',0.04,0.05,0);
        beatCount++;
        if(beatCount>=8){
          clearInterval(beatTimer);
          setTimeout(function(){finishTest(beatMs);btn.disabled=false;btn.textContent='🥁 테스트 (8탭)';},beatMs);
        }
      },beatMs);
      drawRhythmCanvas();
    });

    function tapNow(){
      if(!testing) return;
      tapTimes.push(performance.now());
      playSFX23('rhythm_tap');
    }
    document.addEventListener('keydown',function(e){if(e.code==='Space'&&testing&&document.getElementById('rhythm-matrix-modal').style.display==='flex'){e.preventDefault();tapNow();}});
    document.getElementById('rhythm-canvas').addEventListener('click',tapNow);

    function finishTest(beatMs){
      testing=false;
      var key=sigSel.value+'|'+tempoSel.value;
      var accuracy=50;
      if(tapTimes.length>=2){
        var diffs=[];
        for(var i=1;i<tapTimes.length;i++) diffs.push(Math.abs((tapTimes[i]-tapTimes[i-1])-beatMs));
        var avgDiff=diffs.reduce(function(a,b){return a+b},0)/diffs.length;
        accuracy=Math.max(0,Math.round(100-avgDiff/beatMs*100));
      }
      matrix[key]=accuracy;
      ls23Set('rhythm_matrix',matrix);
      playSFX23('style_analyze');markV23Feature('rhythm_matrix');
      drawRhythmCanvas();
    }

    function drawRhythmCanvas(){
      var c=document.getElementById('rhythm-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🥁 리듬 정밀도 히트맵'+(testing?' - 측정 중...':''),20,25);
      var filled=Object.keys(matrix).length;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('측정 완료: '+filled+'/'+(SIGNATURES.length*TEMPO_RANGES.length)+' 셀',20,42);

      var gridX=90,gridY=60,cellW=(W-110)/TEMPO_RANGES.length,cellH=(H-100)/SIGNATURES.length;
      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
      TEMPO_RANGES.forEach(function(t,i){
        ctx.fillText(t,gridX+i*cellW+4,gridY-4);
      });
      SIGNATURES.forEach(function(s,r){
        ctx.fillText(s,20,gridY+r*cellH+cellH/2+3);
        TEMPO_RANGES.forEach(function(t,i){
          var key=s+'|'+t;
          var acc=matrix[key];
          var x=gridX+i*cellW,y=gridY+r*cellH;
          var color=acc===undefined?'#1e2640':(acc>=80?'#22c55e':acc>=60?'#eab308':acc>=40?'#f97316':'#ef4444');
          ctx.fillStyle=color;
          ctx.fillRect(x,y,cellW-2,cellH-2);
          if(acc!==undefined){
            ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.textAlign='center';
            ctx.fillText(acc+'%',x+cellW/2,y+cellH/2+3);
            ctx.textAlign='left';
          }
        });
      });
    }

    drawRhythmCanvas();
  });
}

// ================ 8. PERFORMANCE STYLE DNA PROFILER ================
function buildStyleDnaUI(){
  var DIMENSIONS=['레가토vs스타카토','다이나믹레인지','템포일관성','페달사용','오나먼트','프레이징','아티큘레이션','루바토'];
  var ARCHETYPES=[
    {name:'낭만주의자',color:'#ec4899',ideal:[70,80,50,75,60,85,60,85]},
    {name:'고전주의자',color:'#4a7dff',ideal:[50,50,85,40,45,60,80,20]},
    {name:'재즈 연주자',color:'#f97316',ideal:[60,70,40,50,80,70,75,60]},
    {name:'현대 연주자',color:'#22c55e',ideal:[55,65,70,55,50,65,65,40]},
    {name:'비르투오소',color:'#a78bfa',ideal:[65,90,60,60,90,75,90,55]},
    {name:'미니멀리스트',color:'#8892a8',ideal:[40,30,90,30,20,50,50,15]}
  ];

  makeV23Modal('style-dna-modal','🧬 연주 스타일 DNA 프로파일러',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">8가지 스타일 지표를 슬라이더로 조정해 나의 연주 DNA를 분석하세요.</p>'+
      '<div id="style-sliders" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px"></div>'+
      '<button id="style-analyze-btn" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer;margin-bottom:8px">🧬 분석하기</button>'+
      '<canvas id="style-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var values=ls23Get('style_values',new Array(8).fill(50));
    var sliderDiv=document.getElementById('style-sliders');
    DIMENSIONS.forEach(function(d,i){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;gap:6px';
      row.innerHTML='<label style="font-size:9px;color:var(--text2);width:110px">'+d+'</label>'+
        '<input type="range" min="0" max="100" value="'+values[i]+'" id="style-slider-'+i+'" style="flex:1">'+
        '<span id="style-val-'+i+'" style="font-size:9px;color:var(--text);width:24px">'+values[i]+'</span>';
      sliderDiv.appendChild(row);
      row.querySelector('input').addEventListener('input',function(){
        values[i]=parseInt(this.value);
        document.getElementById('style-val-'+i).textContent=values[i];
        ls23Set('style_values',values);
      });
    });

    var lastResult=ls23Get('style_last_result',null);

    document.getElementById('style-analyze-btn').addEventListener('click',function(){
      var best=null,bestDist=Infinity;
      ARCHETYPES.forEach(function(arc){
        var dist=0;
        for(var i=0;i<8;i++) dist+=Math.pow(values[i]-arc.ideal[i],2);
        dist=Math.sqrt(dist);
        if(dist<bestDist){bestDist=dist;best=arc;}
      });
      var maxDist=Math.sqrt(8*100*100);
      var matchPct=Math.max(0,Math.round((1-bestDist/maxDist)*100));
      var grade=gradeOf(matchPct);
      lastResult={archetype:best.name,pct:matchPct,grade:grade};
      ls23Set('style_last_result',lastResult);
      playSFX23('style_analyze');markV23Feature('style_dna');
      drawStyleCanvas();
    });

    function drawStyleCanvas(){
      var c=document.getElementById('style-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🧬 연주 스타일 DNA',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(lastResult?('최적 매치: '+lastResult.archetype+' ('+lastResult.pct+'%, '+lastResult.grade+'등급)'):'분석 대기 중',20,42);

      var cx=140,cy=160,r=80;
      var total=values.reduce(function(a,b){return a+b},0)||1;
      var startAng=-Math.PI/2;
      var colors=['#4a7dff','#ec4899','#f97316','#22c55e','#a78bfa','#eab308','#06b6d4','#ef4444'];
      DIMENSIONS.forEach(function(d,i){
        var slice=values[i]/total*Math.PI*2;
        ctx.fillStyle=colors[i];
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAng,startAng+slice);ctx.closePath();ctx.fill();
        startAng+=slice;
      });
      ctx.fillStyle='#0f1525';
      ctx.beginPath();ctx.arc(cx,cy,r*0.55,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText('DNA',cx,cy+4);ctx.textAlign='left';

      var barX=280,barY=60,barW=300,barH=14;
      DIMENSIONS.forEach(function(d,i){
        var y=barY+i*38;
        ctx.fillStyle=colors[i];ctx.fillRect(barX,y,10,10);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(d,barX+16,y+9);
        ctx.fillStyle='#1e2640';ctx.fillRect(barX,y+14,barW,barH);
        ctx.fillStyle=colors[i];ctx.fillRect(barX,y+14,barW*values[i]/100,barH);
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';
        ctx.fillText(values[i]+'',barX+barW+4,y+14+11);
      });

      if(lastResult){
        var archY=H-40;
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText('6개 아키타입 비교: '+ARCHETYPES.map(function(a){return a.name}).join(' / '),20,archY+15);
      }
    }

    drawStyleCanvas();
  });
}

// ================ QUIZ v14 (15 questions, 195->210) ================
function buildQuizV14UI(){
  var QUESTIONS=[
    {q:'인상주의 음악의 대표 작곡가는?',a:['드뷔시','바흐','베토벤','브람스'],c:0},
    {q:'미니멀리즘 음악의 특징은?',a:['짧은 패턴의 반복','급격한 다이나믹 변화','복잡한 대위법','불규칙한 무조성'],c:0},
    {q:'알베르티 베이스란?',a:['분산화음의 반주 패턴','옥타브 트레몰로','스타카토 주법','페달링 기법'],c:0},
    {q:'다이나믹 pp의 의미는?',a:['매우 여리게','매우 세게','보통 세기','점점 여리게'],c:0},
    {q:'라흐마니노프 협주곡 2번의 정서적 특징은?',a:['풍부하고 서정적인 러시아 낭만주의','가벼운 재즈 색채','건조한 미니멀리즘','바로크 대위법'],c:0},
    {q:'7/8 박자는 어떤 종류의 박자인가?',a:['혼합박자','단순박자','복합박자','자유박자'],c:0},
    {q:'루바토(Rubato)란?',a:['템포를 미묘하게 자유롭게 조절하는 연주법','일정한 템포 유지','매우 빠른 템포','매우 느린 템포'],c:0},
    {q:'쇼팽 발라드 1번의 조성은?',a:['g단조','C장조','A장조','e단조'],c:0},
    {q:'리스트 라 캄파넬라의 원곡 모티브는?',a:['파가니니의 바이올린 협주곡','베토벤 교향곡','바흐 푸가','모차르트 소나타'],c:0},
    {q:'스콧 조플린 음악의 장르는?',a:['래그타임','블루스','스윙 재즈','비밥'],c:0},
    {q:'완전4도 음정의 반음 수는?',a:['5반음','4반음','6반음','7반음'],c:0},
    {q:'페달 사용에서 소스테누토 페달의 역할은?',a:['특정 음만 지속시킴','전체 음량을 줄임','음색을 어둡게 함','템포를 늦춤'],c:0},
    {q:'협주곡(Concerto)의 전통적 구조는?',a:['3악장 (빠름-느림-빠름)','1악장 단일 구조','5악장 교향곡 구조','2악장 대칭 구조'],c:0},
    {q:'재즈에서 ii-V-I 진행과 함께 자주 쓰이는 스케일은?',a:['비밥 스케일','펜타토닉 스케일만','온음 스케일만','옥타토닉 스케일만'],c:0},
    {q:'사티 짐노페디의 음악적 특징은?',a:['느리고 명상적인 3박자 왈츠풍','빠른 4박자 행진곡','불협화음 위주의 현대음악','강렬한 옥타브 트레몰로'],c:0}
  ];

  makeV23Modal('quiz14-modal','🧠 피아노 퀴즈 v14',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">15문항 피아노 지식 퀴즈. 장르, 협주곡, 리듬, 스타일!</p>'+
      '<div id="q14-area" style="margin-bottom:10px"></div>'+
      '<canvas id="q14-canvas" width="560" height="300" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var qIdx=0,score=0,answered=false;
    var stats=ls23Get('quiz14_stats',{total:0,correct:0,history:[]});

    function showQuestion(){
      var area=document.getElementById('q14-area');
      if(qIdx>=QUESTIONS.length){
        var pct=Math.round(score/QUESTIONS.length*100);
        var grade=gradeOf(pct);
        stats.history.push({score:score,total:QUESTIONS.length,date:new Date().toISOString().slice(0,10)});
        if(stats.history.length>20) stats.history=stats.history.slice(-20);
        ls23Set('quiz14_stats',stats);
        area.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:700;color:var(--accent)">퀴즈 완료!</div><div style="font-size:14px;margin-top:8px;color:var(--green)">'+score+'/'+QUESTIONS.length+' ('+grade+'등급)</div><button id="q14-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">다시 풀기</button></div>';
        document.getElementById('q14-retry').addEventListener('click',function(){qIdx=0;score=0;answered=false;showQuestion();drawQ14Canvas();});
        drawQ14Canvas();
        return;
      }
      var q=QUESTIONS[qIdx];
      area.innerHTML='<div style="font-size:12px;color:var(--accent);margin-bottom:4px">Q'+(qIdx+1)+'/'+QUESTIONS.length+'</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'+
        '<div id="q14-opts" style="display:flex;flex-direction:column;gap:6px"></div>';
      var opts=document.getElementById('q14-opts');
      q.a.forEach(function(a,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
        btn.textContent=a;
        btn.addEventListener('click',function(){
          if(answered) return;answered=true;stats.total++;
          if(i===q.c){score++;stats.correct++;btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';playSFX23('quiz_correct');}
          else{btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
            Array.from(opts.children)[q.c].style.background='rgba(34,197,94,0.3)';Array.from(opts.children)[q.c].style.borderColor='var(--green)';
          }
          ls23Set('quiz14_stats',stats);drawQ14Canvas();
          setTimeout(function(){qIdx++;answered=false;showQuestion();},1200);
        });
        opts.appendChild(btn);
      });
    }

    function drawQ14Canvas(){
      var c=document.getElementById('q14-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('퀴즈 v14 성적',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+stats.total+'문 | 정답 '+stats.correct+'문 | 정답률 '+(stats.total>0?Math.round(stats.correct/stats.total*100):0)+'%',20,42);

      var cx=W/2,cy=140,r=55;
      var pct=stats.total>0?stats.correct/stats.total:0;
      ctx.lineWidth=10;ctx.lineCap='round';
      ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=pct>=0.7?'#22c55e':pct>=0.4?'#eab308':'#ef4444';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(pct*100)+'%',cx,cy+6);ctx.textAlign='left';

      if(stats.history.length>0){
        var hLen=Math.min(stats.history.length,10);
        var barW=Math.min(40,(W-80)/hLen);
        for(var i=0;i<hLen;i++){
          var entry=stats.history[stats.history.length-hLen+i];
          var x=30+i*(barW+4);
          var h=entry.score/entry.total*(H-240);
          ctx.fillStyle=entry.score/entry.total>=0.7?'rgba(34,197,94,0.5)':'rgba(239,68,68,0.3)';
          ctx.fillRect(x,H-30-h,barW,h);
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText(entry.score+'/'+entry.total,x,H-16);
        }
      }
    }

    showQuestion();drawQ14Canvas();
  });
}

// ================ 12 NEW ACHIEVEMENTS (204->216) ================
var V23_ACHIEVEMENTS=[
  {id:'v23_genre_master',name:'장르 마스터',desc:'전체 장르 마스터리 80% 이상 달성'},
  {id:'v23_balance_pro',name:'밸런스 프로',desc:'건반 밸런스 세션 30회 기록'},
  {id:'v23_curve_composer',name:'곡선 작곡가',desc:'감정 곡선 8종 모두 A등급 이상 채점'},
  {id:'v23_chord_speedster',name:'코드 스피드스터',desc:'12종 코드 전환 모두 기록 달성'},
  {id:'v23_arpeggio_virtuoso',name:'아르페지오 비르투오소',desc:'8종 아르페지오 패턴 모두 연주'},
  {id:'v23_concerto_scholar',name:'협주곡 학자',desc:'10개 협주곡 모두 탐색'},
  {id:'v23_rhythm_precision',name:'리듬 정밀가',desc:'리듬 매트릭스 20셀 이상 측정'},
  {id:'v23_style_analyzed',name:'스타일 DNA 분석 완료',desc:'스타일 DNA 프로파일 분석 1회 완료'},
  {id:'v23_quiz14_s',name:'퀴즈 v14 S등급',desc:'퀴즈 v14에서 90% 이상 달성'},
  {id:'v23_quiz14_clear',name:'퀴즈 v14 클리어',desc:'퀴즈 v14 전문 풀기 완료'},
  {id:'v23_all_features',name:'v23 올클리어',desc:'v23 8가지 기능 모두 사용'},
  {id:'v23_202songs',name:'202곡 도전자',desc:'75곡 이상 연주 기록'}
];

function injectV23Achievements(){
  if(!window.app) window.app={};
  if(!app.achievements) app.achievements=[];
  V23_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(e){return e.id===a.id});
    if(!exists){
      a.unlocked=ls23Get('ach_'+a.id,false);
      app.achievements.push(a);
    }
  });
}

function unlockV23Achievement(id){
  if(ls23Get('ach_'+id,false)) return;
  ls23Set('ach_'+id,true);
  if(window.app&&app.achievements){
    app.achievements.forEach(function(a){if(a.id===id)a.unlocked=true;});
  }
  playSFX23('v23_achieve');
  var ach=V23_ACHIEVEMENTS.find(function(a){return a.id===id});
  if(ach){
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#eab308;color:#000;padding:8px 16px;border-radius:8px;font-size:12px;z-index:9999;animation:modalIn 0.3s';
    toast.textContent='🏆 업적 해금: '+ach.name;
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove()},3000);
  }
}

function checkV23Achievements(){
  var mastery=ls23Get('genre_mastery',{});
  var genreNames=['클래식','재즈','팝','블루스','록','보사노바','왈츠','래그타임','인상주의','미니멀리즘'];
  var sum=0;genreNames.forEach(function(g){sum+=Math.min((mastery[g]||0)/10,1);});
  if(Math.round(sum/genreNames.length*100)>=80) unlockV23Achievement('v23_genre_master');

  var balSessions=ls23Get('balance_sessions',[]);
  if(balSessions.length>=30) unlockV23Achievement('v23_balance_pro');

  var curveBest=ls23Get('curve_best',{});
  var curveNames=['기쁨','슬픔','긴장','해방','클라이맥스','평온','드라마틱','몽환'];
  if(curveNames.every(function(n){return (curveBest[n]||0)>=75})) unlockV23Achievement('v23_curve_composer');

  var chordBest=ls23Get('chord_best',{});
  var chordKeys=['C→G','Am→F','G→D','F→C','Dm→G','Em→Am','C→F','G→Em','Am→Dm','D→A','Bm→G','F→Bb'];
  if(chordKeys.every(function(k){return chordBest[k]!==undefined})) unlockV23Achievement('v23_chord_speedster');

  var arpUsage=ls23Get('arp_usage',{});
  if(Object.keys(arpUsage).length>=8) unlockV23Achievement('v23_arpeggio_virtuoso');

  var viewed=ls23Get('concerto_viewed',[]);
  if(viewed.length>=10) unlockV23Achievement('v23_concerto_scholar');

  var rhythmMatrix=ls23Get('rhythm_matrix',{});
  if(Object.keys(rhythmMatrix).length>=20) unlockV23Achievement('v23_rhythm_precision');

  var styleResult=ls23Get('style_last_result',null);
  if(styleResult) unlockV23Achievement('v23_style_analyzed');

  var q14Stats=ls23Get('quiz14_stats',{total:0,correct:0,history:[]});
  if(q14Stats.total>=15&&q14Stats.correct/q14Stats.total>=0.9) unlockV23Achievement('v23_quiz14_s');
  if(q14Stats.total>=15) unlockV23Achievement('v23_quiz14_clear');

  var used=ls23Get('features_used',[]);
  if(used.length>=8) unlockV23Achievement('v23_all_features');

  var played=0;
  try{for(var j=0;j<localStorage.length;j++){var lk=localStorage.key(j);if(lk&&lk.indexOf('best-')===0&&parseInt(localStorage.getItem(lk))>0)played++;}}catch(e){}
  if(played>=75) unlockV23Achievement('v23_202songs');
}

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV23Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'A':'genre-mastery-modal',
      'B':'key-balance-modal',
      'C':'emotion-curve-modal',
      'D':'chord-transition-modal',
      'E':'arpeggio-builder-modal',
      'F':'concerto-guide-modal',
      'G':'rhythm-matrix-modal',
      'H':'style-dna-modal',
      '9':'quiz14-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV23NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎼 장르',modal:'genre-mastery-modal'},
    {label:'⚖️ 밸런스',modal:'key-balance-modal'},
    {label:'📈 감정곡선',modal:'emotion-curve-modal'},
    {label:'⏱️ 코드전환',modal:'chord-transition-modal'},
    {label:'🎶 아르페지오',modal:'arpeggio-builder-modal'},
    {label:'🎻 협주곡',modal:'concerto-guide-modal'},
    {label:'🥁 리듬매트릭스',modal:'rhythm-matrix-modal'},
    {label:'🧬 스타일DNA',modal:'style-dna-modal'},
    {label:'🧠 퀴즈v14',modal:'quiz14-modal'}
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
function initV23(){
  addV23Songs();
  buildGenreMasteryUI();
  buildKeyBalanceUI();
  buildEmotionCurveUI();
  buildChordTransitionUI();
  buildArpeggioBuilderUI();
  buildConcertoGuideUI();
  buildRhythmMatrixUI();
  buildStyleDnaUI();
  buildQuizV14UI();
  injectV23Achievements();
  setupV23Shortcuts();
  injectV23NavButtons();
  setInterval(checkV23Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV23,6200);});
else setTimeout(initV23,6200);
})();
