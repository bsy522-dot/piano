// Piano Master v18 Patch Module
// Real-time Tempo Tracker, A/B Loop Practice, Music Genre Explorer, Piano Technique Radar,
// Song Mastery Progress, Music Term Flashcard, Piano Practice Timer, Piano Master Ranking Board
// 10 Songs (142->152), Quiz v9 15Q (120->135), 12 Achievements (144->156), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v18Loaded) return;
window.__v18Loaded = true;

var LS18 = 'piano-v18-';
function ls18Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS18+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls18Set(k,v){localStorage.setItem(LS18+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v18 (12 sounds) ================
var sfx18 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone18(freq,type,dur,gainVal,delayMs){
  if(!sfx18) return;
  setTimeout(function(){
    if(!sfx18) return;
    var t=sfx18.currentTime,g=sfx18.createGain(),o=sfx18.createOscillator();
    o.connect(g);g.connect(sfx18.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX18(type){
  if(!sfx18) return;
  if(sfx18.state==='suspended') sfx18.resume();
  switch(type){
    case 'tempo_tick': tone18(880,'sine',0.08,0.06,0); break;
    case 'ab_start': tone18(523,'triangle',0.12,0.07,0); break;
    case 'ab_end': tone18(659,'triangle',0.1,0.07,0); tone18(880,'triangle',0.15,0.07,90); break;
    case 'genre_pick': tone18(392,'sine',0.15,0.06,0); tone18(587,'sine',0.15,0.06,60); break;
    case 'radar_save': tone18(440,'square',0.1,0.05,0); tone18(660,'square',0.12,0.05,80); break;
    case 'mastery_star': tone18(784,'sine',0.1,0.08,0); break;
    case 'flash_flip': tone18(300,'triangle',0.08,0.05,0); tone18(500,'triangle',0.08,0.05,60); break;
    case 'flash_learn': tone18(523,'sine',0.1,0.07,0); tone18(784,'sine',0.15,0.07,80); break;
    case 'timer_start': tone18(440,'sine',0.15,0.06,0); break;
    case 'timer_done': tone18(660,'triangle',0.15,0.09,0); tone18(880,'triangle',0.15,0.09,150); tone18(1047,'triangle',0.3,0.09,300); break;
    case 'rank_up': tone18(523,'triangle',0.15,0.09,0); tone18(659,'triangle',0.15,0.09,120); tone18(784,'triangle',0.15,0.09,240); tone18(1047,'triangle',0.35,0.09,360); break;
    case 'v18_achieve': tone18(523,'triangle',0.1,0.1,0); tone18(784,'triangle',0.15,0.1,100); tone18(1047,'triangle',0.25,0.1,200); break;
  }
}

// ================ COMMON MODAL BUILDER ================
function makeV18Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:180;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,600px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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

// ================ FEATURE USAGE TRACKER (for v18_explorer achievement) ================
function markV18Feature(name){
  var used=ls18Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls18Set('features_used',used);}
}

// ================ 10 NEW SONGS (142->152) ================
function addV18Songs(){
  if(!window.SONGS) return;
  var existing=window.SONGS.map(function(s){return s.name});
  var newSongs=[
    {name:'쇼팽 왈츠 6번 (D-flat)',composer:'쇼팽',category:'클래식',difficulty:'medium',bpm:66,
     notes:[{note:'C#5',time:0,dur:0.2},{note:'D#5',time:0.2,dur:0.2},{note:'F5',time:0.4,dur:0.4},{note:'C#4',time:0.8,dur:0.2},{note:'F4',time:1,dur:0.2},{note:'G#4',time:1.2,dur:0.2},{note:'C#5',time:1.4,dur:0.4},{note:'D#5',time:1.8,dur:0.2},{note:'F5',time:2,dur:0.2},{note:'G#5',time:2.2,dur:0.4},{note:'F5',time:2.6,dur:0.2},{note:'D#5',time:2.8,dur:0.2},{note:'C#5',time:3,dur:0.4},{note:'A#4',time:3.4,dur:0.2},{note:'C#5',time:3.6,dur:0.2},{note:'F5',time:3.8,dur:0.4},{note:'D#5',time:4.2,dur:0.2},{note:'C#5',time:4.4,dur:0.2},{note:'A#4',time:4.6,dur:0.4},{note:'G#4',time:5,dur:0.6}]},
    {name:'봄노래 (멘델스존)',composer:'멘델스존',category:'클래식',difficulty:'medium',bpm:88,
     notes:[{note:'A4',time:0,dur:0.5},{note:'C#5',time:0.5,dur:0.5},{note:'E5',time:1,dur:0.5},{note:'A5',time:1.5,dur:0.75},{note:'G#5',time:2.25,dur:0.25},{note:'F#5',time:2.5,dur:0.5},{note:'E5',time:3,dur:0.5},{note:'D5',time:3.5,dur:0.5},{note:'C#5',time:4,dur:0.5},{note:'B4',time:4.5,dur:0.5},{note:'A4',time:5,dur:1},{note:'B4',time:6,dur:0.5},{note:'C#5',time:6.5,dur:0.5},{note:'D5',time:7,dur:0.5},{note:'E5',time:7.5,dur:0.75},{note:'F#5',time:8.25,dur:0.25},{note:'E5',time:8.5,dur:0.5},{note:'D5',time:9,dur:0.5},{note:'C#5',time:9.5,dur:1}]},
    {name:'캐논 변주 확장판 (파헬벨)',composer:'파헬벨',category:'클래식',difficulty:'easy',bpm:72,
     notes:[{note:'D4',time:0,dur:0.5},{note:'A4',time:0.5,dur:0.5},{note:'B4',time:1,dur:0.5},{note:'F#4',time:1.5,dur:0.5},{note:'G4',time:2,dur:0.5},{note:'D4',time:2.5,dur:0.5},{note:'G4',time:3,dur:0.5},{note:'A4',time:3.5,dur:0.5},{note:'D5',time:4,dur:0.5},{note:'A4',time:4.5,dur:0.5},{note:'B4',time:5,dur:0.5},{note:'F#4',time:5.5,dur:0.5},{note:'G4',time:6,dur:0.5},{note:'D4',time:6.5,dur:0.5},{note:'G4',time:7,dur:0.5},{note:'A4',time:7.5,dur:0.5},{note:'F#5',time:8,dur:0.5},{note:'E5',time:8.5,dur:0.5},{note:'D5',time:9,dur:0.5},{note:'C#5',time:9.5,dur:1}]},
    {name:'My Way (시나트라)',composer:'시나트라',category:'팝',difficulty:'medium',bpm:76,
     notes:[{note:'C4',time:0,dur:0.5},{note:'D4',time:0.5,dur:0.5},{note:'E4',time:1,dur:0.5},{note:'F4',time:1.5,dur:0.5},{note:'G4',time:2,dur:1},{note:'A4',time:3,dur:0.5},{note:'G4',time:3.5,dur:0.5},{note:'F4',time:4,dur:0.5},{note:'E4',time:4.5,dur:0.5},{note:'D4',time:5,dur:1},{note:'C4',time:6,dur:0.5},{note:'E4',time:6.5,dur:0.5},{note:'G4',time:7,dur:0.5},{note:'C5',time:7.5,dur:1},{note:'B4',time:8.5,dur:0.5},{note:'A4',time:9,dur:0.5},{note:'G4',time:9.5,dur:1},{note:'F4',time:10.5,dur:1.5}]},
    {name:'Cinema Paradiso (모리꼬네)',composer:'엔니오 모리꼬네',category:'팝',difficulty:'hard',bpm:60,
     notes:[{note:'E4',time:0,dur:0.8},{note:'F#4',time:0.8,dur:0.4},{note:'G4',time:1.2,dur:0.8},{note:'A4',time:2,dur:0.8},{note:'B4',time:2.8,dur:0.4},{note:'C5',time:3.2,dur:1.2},{note:'B4',time:4.4,dur:0.4},{note:'A4',time:4.8,dur:0.8},{note:'G4',time:5.6,dur:0.8},{note:'F#4',time:6.4,dur:0.4},{note:'E4',time:6.8,dur:1.2},{note:'D4',time:8,dur:0.8},{note:'E4',time:8.8,dur:0.4},{note:'F#4',time:9.2,dur:0.8},{note:'G4',time:10,dur:1.2},{note:'A4',time:11.2,dur:0.8},{note:'G4',time:12,dur:0.8},{note:'E4',time:12.8,dur:1.6}]},
    {name:'River Flows in You',composer:'이루마',category:'팝',difficulty:'medium',bpm:68,
     notes:[{note:'F#4',time:0,dur:0.3},{note:'A4',time:0.3,dur:0.3},{note:'C#5',time:0.6,dur:0.3},{note:'D5',time:0.9,dur:0.6},{note:'C#5',time:1.5,dur:0.3},{note:'A4',time:1.8,dur:0.3},{note:'F#4',time:2.1,dur:0.6},{note:'E4',time:2.7,dur:0.3},{note:'F#4',time:3,dur:0.3},{note:'A4',time:3.3,dur:0.3},{note:'C#5',time:3.6,dur:0.6},{note:'B4',time:4.2,dur:0.3},{note:'A4',time:4.5,dur:0.3},{note:'F#4',time:4.8,dur:0.6},{note:'D5',time:5.4,dur:0.3},{note:'C#5',time:5.7,dur:0.3},{note:'A4',time:6,dur:0.3},{note:'F#4',time:6.3,dur:0.9}]},
    {name:'Prelude in E minor (쇼팽 Op.28-4)',composer:'쇼팽',category:'클래식',difficulty:'hard',bpm:66,
     notes:[{note:'B4',time:0,dur:0.6},{note:'E4',time:0.6,dur:0.3},{note:'G4',time:0.9,dur:0.3},{note:'B4',time:1.2,dur:0.6},{note:'E4',time:1.8,dur:0.3},{note:'A4',time:2.1,dur:0.3},{note:'C5',time:2.4,dur:0.6},{note:'E4',time:3,dur:0.3},{note:'G#4',time:3.3,dur:0.3},{note:'B4',time:3.6,dur:0.6},{note:'D4',time:4.2,dur:0.3},{note:'F#4',time:4.5,dur:0.3},{note:'B4',time:4.8,dur:0.9},{note:'A4',time:5.7,dur:0.3},{note:'G4',time:6,dur:0.3},{note:'F#4',time:6.3,dur:0.6},{note:'E4',time:6.9,dur:1.2}]},
    {name:'Hungarian Dance No.5 (브람스)',composer:'브람스',category:'클래식',difficulty:'expert',bpm:132,
     notes:[{note:'F#4',time:0,dur:0.2},{note:'G4',time:0.2,dur:0.2},{note:'A4',time:0.4,dur:0.2},{note:'F#4',time:0.6,dur:0.2},{note:'D5',time:0.8,dur:0.4},{note:'C#5',time:1.2,dur:0.2},{note:'B4',time:1.4,dur:0.2},{note:'A4',time:1.6,dur:0.2},{note:'F#4',time:1.8,dur:0.2},{note:'D4',time:2,dur:0.4},{note:'A4',time:2.4,dur:0.2},{note:'B4',time:2.6,dur:0.2},{note:'C#5',time:2.8,dur:0.2},{note:'D5',time:3,dur:0.2},{note:'E5',time:3.2,dur:0.4},{note:'F#5',time:3.6,dur:0.2},{note:'E5',time:3.8,dur:0.2},{note:'D5',time:4,dur:0.2},{note:'C#5',time:4.2,dur:0.2},{note:'A4',time:4.4,dur:0.6}]},
    {name:'소녀의 기도',composer:'바다르제프스카',category:'클래식',difficulty:'easy',bpm:72,
     notes:[{note:'G4',time:0,dur:0.3},{note:'C5',time:0.3,dur:0.3},{note:'E5',time:0.6,dur:0.3},{note:'G5',time:0.9,dur:0.6},{note:'F5',time:1.5,dur:0.3},{note:'E5',time:1.8,dur:0.3},{note:'D5',time:2.1,dur:0.6},{note:'C5',time:2.7,dur:0.3},{note:'E5',time:3,dur:0.3},{note:'G5',time:3.3,dur:0.6},{note:'F5',time:3.9,dur:0.3},{note:'D5',time:4.2,dur:0.3},{note:'C5',time:4.5,dur:0.6},{note:'B4',time:5.1,dur:0.3},{note:'C5',time:5.4,dur:0.3},{note:'D5',time:5.7,dur:0.3},{note:'E5',time:6,dur:0.3},{note:'G4',time:6.3,dur:1}]},
    {name:'Take Five (데이브 브루벡)',composer:'데이브 브루벡',category:'재즈',difficulty:'hard',bpm:174,
     notes:[{note:'E4',time:0,dur:0.3},{note:'G4',time:0.3,dur:0.3},{note:'A4',time:0.6,dur:0.4},{note:'B4',time:1,dur:0.3},{note:'A4',time:1.3,dur:0.3},{note:'G4',time:1.6,dur:0.4},{note:'E4',time:2,dur:0.3},{note:'D4',time:2.3,dur:0.3},{note:'E4',time:2.6,dur:0.4},{note:'G4',time:3,dur:0.3},{note:'A4',time:3.3,dur:0.3},{note:'B4',time:3.6,dur:0.4},{note:'C5',time:4,dur:0.3},{note:'B4',time:4.3,dur:0.3},{note:'A4',time:4.6,dur:0.4},{note:'G4',time:5,dur:0.3},{note:'E4',time:5.3,dur:0.3},{note:'D4',time:5.6,dur:0.4},{note:'E4',time:6,dur:0.6}]}
  ];
  newSongs.forEach(function(s){
    if(existing.indexOf(s.name)===-1){
      s.icon=s.category==='재즈'?'🎷':s.category==='팝'?'🎤':['🎹','🎵','🎶','🎼'][Math.floor(Math.random()*4)];
      window.SONGS.push(s);
    }
  });
  if(window.app&&app.initSongList) app.initSongList();
}

// ================ 1. REAL-TIME TEMPO TRACKER CANVAS ================
function buildTempoTrackerUI(){
  makeV18Modal('tempo-modal','📈 실시간 템포 트래커',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">목표 BPM을 설정하고 박자에 맞춰 TAP 버튼을 눌러 실제 템포를 기록하세요. 안정도(표준편차 분석)로 S~D 등급을 받습니다.</p>'+
      '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">'+
      '<label style="font-size:11px;color:var(--text2)">목표 BPM: <input id="tempo-target" type="number" value="90" min="40" max="220" style="width:60px"></label>'+
      '<button class="ctrl-btn" id="tempo-startstop" style="padding:6px 12px">기록 시작</button>'+
      '<button class="ctrl-btn" id="tempo-tap" style="padding:6px 16px;display:none">TAP</button>'+
      '<button class="ctrl-btn" id="tempo-clear" style="padding:6px 12px">초기화</button>'+
      '</div>'+
      '<canvas id="tempo-canvas" width="560" height="320" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="tempo-info" style="text-align:center;margin-top:8px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#tempo-canvas');
    var ctx=canvas.getContext('2d');
    var targetInput=container.querySelector('#tempo-target');
    var recording=false,lastTap=0,samples=ls18Get('tempo_samples',[]);
    var MAXPTS=60;

    function stddev(arr){
      if(arr.length<2) return 0;
      var mean=arr.reduce(function(a,b){return a+b},0)/arr.length;
      var variance=arr.reduce(function(a,b){return a+Math.pow(b-mean,2)},0)/arr.length;
      return Math.sqrt(variance);
    }
    function gradeFromStability(pct){
      return pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=50?'C':'D';
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('실시간 템포 트래커',canvas.width/2,20);
      var target=parseInt(targetInput.value,10)||90;
      var padL=40,padR=20,padT=40,padB=50;
      var plotW=canvas.width-padL-padR,plotH=canvas.height-padT-padB;
      var minBpm=Math.max(20,target-60),maxBpm=target+60;
      ctx.strokeStyle='#1e2640';
      for(var g=0;g<=4;g++){
        var gy=padT+plotH*(g/4);
        ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(padL+plotW,gy);ctx.stroke();
        var val=Math.round(maxBpm-(maxBpm-minBpm)*(g/4));
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText(val+'',padL-6,gy+3);
      }
      var targetY=padT+plotH*(1-(target-minBpm)/(maxBpm-minBpm));
      ctx.strokeStyle='#eab30888';ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(padL,targetY);ctx.lineTo(padL+plotW,targetY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#eab308';ctx.font='9px sans-serif';ctx.textAlign='left';
      ctx.fillText('목표 '+target+' BPM',padL+4,targetY-4);
      if(samples.length>1){
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
        samples.forEach(function(bpm,i){
          var x=padL+plotW*(i/Math.max(1,MAXPTS-1));
          var y=padT+plotH*(1-(Math.max(minBpm,Math.min(maxBpm,bpm))-minBpm)/(maxBpm-minBpm));
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        ctx.stroke();ctx.lineWidth=1;
        samples.forEach(function(bpm,i){
          var x=padL+plotW*(i/Math.max(1,MAXPTS-1));
          var y=padT+plotH*(1-(Math.max(minBpm,Math.min(maxBpm,bpm))-minBpm)/(maxBpm-minBpm));
          ctx.fillStyle='#22c55e';ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();
        });
      } else {
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
        ctx.fillText('TAP 버튼으로 박자를 입력하세요',canvas.width/2,padT+plotH/2);
      }
      ctx.strokeStyle='#2a3050';ctx.strokeRect(padL,padT,plotW,plotH);
      var info=container.querySelector('#tempo-info');
      if(samples.length>=3){
        var mean=samples.reduce(function(a,b){return a+b},0)/samples.length;
        var sd=stddev(samples);
        var stabilityPct=Math.max(0,Math.round(100-(sd/mean*100)*3));
        var grade=gradeFromStability(stabilityPct);
        var best=ls18Get('tempo_best_stability',0);
        if(stabilityPct>best){best=stabilityPct;ls18Set('tempo_best_stability',best);}
        info.innerHTML='평균 BPM: <b>'+Math.round(mean)+'</b> | 표준편차: <b>'+sd.toFixed(1)+'</b> | 안정도: <b>'+stabilityPct+'%</b> | 등급: <b style="color:#eab308">'+grade+'</b> | 최고 안정도: '+best+'%';
      } else {
        info.textContent='최소 3회 이상 TAP 하면 안정도가 계산됩니다.';
      }
    }
    container.querySelector('#tempo-startstop').addEventListener('click',function(){
      recording=!recording;
      this.textContent=recording?'기록 중지':'기록 시작';
      container.querySelector('#tempo-tap').style.display=recording?'inline-block':'none';
      if(recording){lastTap=0;ls18Set('tempo_used',true);markV18Feature('tempo');}
    });
    container.querySelector('#tempo-tap').addEventListener('click',function(){
      var now=Date.now();
      playSFX18('tempo_tick');
      if(lastTap>0){
        var bpm=60000/(now-lastTap);
        if(bpm>=20&&bpm<=300){
          samples.push(Math.round(bpm));
          if(samples.length>MAXPTS) samples.shift();
          ls18Set('tempo_samples',samples);
        }
      }
      lastTap=now;
      draw();
    });
    container.querySelector('#tempo-clear').addEventListener('click',function(){
      samples=[];lastTap=0;ls18Set('tempo_samples',[]);draw();
    });
    targetInput.addEventListener('change',draw);
    draw();
  });
}

// ================ 2. A/B LOOP PRACTICE CANVAS ================
function buildABLoopUI(){
  makeV18Modal('abloop-modal','🔁 A/B 구간 반복 연습기',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">곡의 특정 구간(A~B)을 반복 재생하며 연습하세요. 속도와 반복 횟수를 조절할 수 있습니다.</p>'+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px;font-size:11px;color:var(--text2)">'+
      '<label>구간 시작(A): <input id="ab-start" type="range" min="0" max="95" value="10" style="width:60%;vertical-align:middle"> <span id="ab-start-val">10</span>%</label>'+
      '<label>구간 끝(B): <input id="ab-end" type="range" min="5" max="100" value="40" style="width:60%;vertical-align:middle"> <span id="ab-end-val">40</span>%</label>'+
      '<label>반복 횟수: <input id="ab-count" type="number" min="1" max="20" value="4" style="width:50px"></label>'+
      '<label>속도: <input id="ab-speed" type="range" min="50" max="150" value="100" style="width:60%;vertical-align:middle"> <span id="ab-speed-val">100</span>%</label>'+
      '</div>'+
      '<canvas id="ab-canvas" width="520" height="280" style="width:100%;max-width:520px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="text-align:center;margin-top:8px">'+
      '<button class="ctrl-btn" id="ab-play" style="padding:6px 16px">연습 시작</button>'+
      '<button class="ctrl-btn" id="ab-stop" style="padding:6px 16px">정지</button>'+
      '</div>'+
      '<div id="ab-log" style="margin-top:8px;font-size:11px;color:var(--text2);max-height:80px;overflow-y:auto"></div>';
    var canvas=container.querySelector('#ab-canvas');
    var ctx=canvas.getContext('2d');
    var startR=container.querySelector('#ab-start'),endR=container.querySelector('#ab-end');
    var countIn=container.querySelector('#ab-count'),speedR=container.querySelector('#ab-speed');
    var running=false,pos=0,repDone=0,animId=null,lastTs=0;
    var log=ls18Get('ab_log',[]);

    function renderLog(){
      var el=container.querySelector('#ab-log');
      el.innerHTML=log.slice(-6).map(function(l){return '<div>'+l+'</div>'}).join('');
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('A/B 구간 반복 연습',canvas.width/2,20);
      var a=parseInt(startR.value,10),b=parseInt(endR.value,10);
      if(b<=a) b=a+5;
      var barX=20,barY=90,barW=canvas.width-40,barH=24;
      ctx.fillStyle='#1a2036';ctx.fillRect(barX,barY,barW,barH);
      var ax=barX+barW*(a/100),bx=barX+barW*(b/100);
      ctx.fillStyle='rgba(74,125,255,0.35)';ctx.fillRect(ax,barY,bx-ax,barH);
      ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax,barY-4);ctx.lineTo(ax,barY+barH+4);ctx.stroke();
      ctx.strokeStyle='#ef4444';ctx.beginPath();ctx.moveTo(bx,barY-4);ctx.lineTo(bx,barY+barH+4);ctx.stroke();
      ctx.lineWidth=1;
      ctx.fillStyle='#22c55e';ctx.font='10px sans-serif';ctx.fillText('A',ax,barY-8);
      ctx.fillStyle='#ef4444';ctx.fillText('B',bx,barY-8);
      var px=barX+barW*(pos/100);
      ctx.fillStyle='#eab308';ctx.beginPath();ctx.arc(px,barY+barH/2,7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      ctx.fillText('구간: '+a+'% ~ '+b+'% (전체 곡 기준)',barX,barY+barH+30);
      ctx.fillText('반복: '+repDone+' / '+(parseInt(countIn.value,10)||1)+'  속도: '+speedR.value+'%',barX,barY+barH+46);
      ctx.fillStyle=running?'#22c55e':'#8892a8';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(running?'재생 중...':'대기 중',canvas.width/2,barY+barH+70);
      var total=ls18Get('ab_loop_count',0);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('누적 반복 연습 횟수: '+total,canvas.width/2,canvas.height-20);
    }
    function loopStep(ts){
      if(!running) return;
      if(!lastTs) lastTs=ts;
      var dt=(ts-lastTs)/1000;lastTs=ts;
      var a=parseInt(startR.value,10),b=parseInt(endR.value,10);
      if(b<=a) b=a+5;
      var speedFactor=(parseInt(speedR.value,10)||100)/100;
      var pctPerSec=8*speedFactor;
      pos+=dt*pctPerSec;
      if(pos>=b){
        pos=a;repDone++;
        var total=ls18Get('ab_loop_count',0)+1;
        ls18Set('ab_loop_count',total);
        log.push('반복 '+repDone+'회 완료 ('+new Date().toLocaleTimeString()+')');
        ls18Set('ab_log',log);renderLog();
        var target=parseInt(countIn.value,10)||1;
        if(repDone>=target){
          running=false;playSFX18('ab_end');draw();return;
        }
      }
      draw();
      animId=requestAnimationFrame(loopStep);
    }
    [startR,endR,speedR].forEach(function(r){
      r.addEventListener('input',function(){
        container.querySelector('#ab-start-val').textContent=startR.value;
        container.querySelector('#ab-end-val').textContent=endR.value;
        container.querySelector('#ab-speed-val').textContent=speedR.value;
        draw();
      });
    });
    container.querySelector('#ab-play').addEventListener('click',function(){
      var a=parseInt(startR.value,10);
      pos=a;repDone=0;running=true;lastTs=0;
      ls18Set('ab_used',true);markV18Feature('abloop');
      playSFX18('ab_start');
      if(animId) cancelAnimationFrame(animId);
      animId=requestAnimationFrame(loopStep);
    });
    container.querySelector('#ab-stop').addEventListener('click',function(){
      running=false;if(animId) cancelAnimationFrame(animId);draw();
    });
    renderLog();draw();
  });
}

// ================ 3. MUSIC GENRE EXPLORER CANVAS ================
function buildGenreUI(){
  var GENRES=[
    {name:'클래식',desc:'18~19세기 유럽 전통 음악. 형식미와 화성적 균형을 중시합니다.',trait:'정교한 대위법, 소나타 형식',chord:'I-IV-V-I',tempoRange:'60-140',complexity:80,tempo:70,emotion:70},
    {name:'재즈',desc:'즉흥연주와 스윙 리듬이 특징인 20세기 미국 음악.',trait:'7th/9th 코드, 스윙 리듬, 즉흥연주',chord:'ii-V-I',tempoRange:'100-220',complexity:90,tempo:80,emotion:85},
    {name:'팝',desc:'대중적이고 반복적인 후렴구 중심의 현대 음악.',trait:'단순한 구조, 강한 후크, 반복 패턴',chord:'I-V-vi-IV',tempoRange:'80-130',complexity:40,tempo:60,emotion:75},
    {name:'블루스',desc:'12마디 블루스 진행과 블루노트가 특징인 미국 흑인음악.',trait:'12마디 형식, 블루노트, 콜앤리스폰스',chord:'I7-IV7-V7',tempoRange:'60-120',complexity:55,tempo:50,emotion:90},
    {name:'라틴',desc:'중남미 유래의 리드미컬하고 화려한 리듬 음악.',trait:'클라베 리듬, 신코페이션, 타악기적 피아노',chord:'i-iv-V7',tempoRange:'100-200',complexity:75,tempo:90,emotion:80},
    {name:'보사노바',desc:'삼바와 재즈가 결합된 브라질 음악. 부드럽고 세련된 느낌.',trait:'싱커페이티드 리듬, 재즈 화성, 부드러운 다이나믹',chord:'IIm7-V7-Imaj7',tempoRange:'70-120',complexity:70,tempo:55,emotion:65},
    {name:'뉴에이지',desc:'명상적이고 서정적인 현대 연주 음악.',trait:'단순한 화성, 반복 아르페지오, 잔잔한 다이나믹',chord:'I-V-vi-iii',tempoRange:'50-90',complexity:35,tempo:30,emotion:60},
    {name:'록',desc:'강한 비트와 파워풀한 사운드가 특징인 대중음악.',trait:'파워코드, 강한 리듬감, 드라이브감',chord:'I-bVII-IV',tempoRange:'110-180',complexity:50,tempo:85,emotion:80},
    {name:'R&B',desc:'그루브와 감정 표현이 풍부한 리듬 앤 블루스.',trait:'신코페이션, 그루브, 감성적 멜리스마',chord:'Imaj7-vi7-ii7-V7',tempoRange:'70-110',complexity:65,tempo:55,emotion:95},
    {name:'민요',desc:'전통적으로 전해 내려오는 지역 고유의 노래.',trait:'단순 선율, 5음 음계, 반복 구조',chord:'I-IV-I',tempoRange:'60-110',complexity:25,tempo:45,emotion:55}
  ];
  makeV18Modal('genre-modal','🌍 음악 장르 탐험기',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">10개 장르를 클릭해 특징, 코드 진행, 템포 범위를 확인하세요. 5개 이상 탐험하면 업적을 획득합니다.</p>'+
      '<canvas id="genre-canvas" width="580" height="360" style="width:100%;max-width:580px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto;cursor:pointer"></canvas>'+
      '<div id="genre-detail" style="margin-top:10px;font-size:11px;color:var(--text2);background:var(--surface2,#1a2036);border-radius:8px;padding:10px;min-height:70px"></div>';
    var canvas=container.querySelector('#genre-canvas');
    var ctx=canvas.getContext('2d');
    var selected=0;
    var explored=ls18Get('genre_explored',[]);

    function showDetail(idx){
      var g=GENRES[idx];
      var detail=container.querySelector('#genre-detail');
      detail.innerHTML='<b style="color:var(--accent)">'+g.name+'</b><br>'+g.desc+'<br>'+
        '<b>특징:</b> '+g.trait+'<br><b>대표 코드 진행:</b> '+g.chord+'<br><b>템포 범위:</b> '+g.tempoRange+' BPM';
      if(explored.indexOf(g.name)===-1){
        explored.push(g.name);ls18Set('genre_explored',explored);
      }
      markV18Feature('genre');
      playSFX18('genre_pick');
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('음악 장르 비교 (복잡도 / 템포 / 감정폭)',canvas.width/2,20);
      var padL=20,padT=35,barGroupW=(canvas.width-40)/GENRES.length,barW=barGroupW/4,maxH=180;
      GENRES.forEach(function(g,i){
        var gx=padL+i*barGroupW;
        var vals=[g.complexity,g.tempo,g.emotion],colors=['#4a7dff','#eab308','#a855f7'];
        vals.forEach(function(v,vi){
          var h=maxH*(v/100);
          var bx=gx+vi*barW;
          ctx.fillStyle=colors[vi];
          ctx.fillRect(bx,padT+maxH-h,barW-2,h);
        });
        ctx.save();
        ctx.translate(gx+barGroupW/2,padT+maxH+10);
        ctx.fillStyle=i===selected?'#e8ecf4':'#8892a8';
        ctx.font=i===selected?'bold 9px sans-serif':'9px sans-serif';
        ctx.textAlign='center';
        ctx.fillText(g.name,0,0);
        if(explored.indexOf(g.name)>=0){ctx.fillStyle='#22c55e';ctx.fillText('✓',0,12);}
        ctx.restore();
        if(i===selected){
          ctx.strokeStyle='#4a7dff';ctx.strokeRect(gx-2,padT-2,barGroupW*0.75,maxH+4);
        }
      });
      ctx.fillStyle='#4a7dff';ctx.fillRect(canvas.width/2-140,canvas.height-22,10,10);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='left';
      ctx.fillText('복잡도',canvas.width/2-126,canvas.height-13);
      ctx.fillStyle='#eab308';ctx.fillRect(canvas.width/2-60,canvas.height-22,10,10);
      ctx.fillText('템포',canvas.width/2-46,canvas.height-13);
      ctx.fillStyle='#a855f7';ctx.fillRect(canvas.width/2+10,canvas.height-22,10,10);
      ctx.fillText('감정폭',canvas.width/2+24,canvas.height-13);
      ctx.fillStyle='#8892a8';ctx.textAlign='right';
      ctx.fillText('탐험: '+explored.length+'/10',canvas.width-15,canvas.height-13);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var barGroupW=(canvas.width-40)/GENRES.length;
      var idx=Math.floor((cx-20)/barGroupW);
      if(idx>=0&&idx<GENRES.length){
        selected=idx;showDetail(idx);draw();
      }
    });
    showDetail(0);draw();
  });
}

// ================ 4. PIANO TECHNIQUE RADAR CANVAS ================
function buildTechRadarUI(){
  makeV18Modal('techradar-modal','🕸️ 피아노 테크닉 레이더',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">6개 항목을 0~100점으로 직접 평가하고 레이더 차트로 시각화하세요. 저장하면 이전 기록과 비교할 수 있습니다.</p>'+
      '<canvas id="techradar-canvas" width="460" height="400" style="width:100%;max-width:460px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="techradar-inputs" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;font-size:11px;color:var(--text2)"></div>'+
      '<div style="text-align:center;margin-top:8px">'+
      '<button class="ctrl-btn" id="techradar-save" style="padding:6px 14px">저장 및 비교</button>'+
      '</div>'+
      '<div id="techradar-result" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#techradar-canvas');
    var ctx=canvas.getContext('2d');
    var AXES=['정확도','속도','표현력','시보드리딩','화성','리듬'];
    var current=ls18Get('tech_scores',[60,55,50,45,50,55]);
    var history=ls18Get('tech_history',[]);
    var anim={from:current.slice(),to:current.slice(),start:0,dur:400};

    function gradeOf(v){return v>=90?'S':v>=80?'A':v>=70?'B':v>=50?'C':'D';}
    var inputsDiv=container.querySelector('#techradar-inputs');
    AXES.forEach(function(ax,i){
      var wrap=document.createElement('label');
      wrap.innerHTML=ax+': <input type="number" min="0" max="100" value="'+current[i]+'" style="width:50px" data-axis="'+i+'">';
      inputsDiv.appendChild(wrap);
    });
    function animate(ts){
      if(!anim.startTs) anim.startTs=ts;
      var p=Math.min(1,(ts-anim.startTs)/anim.dur);
      var vals=anim.from.map(function(f,i){return f+(anim.to[i]-f)*p;});
      drawRadar(vals);
      if(p<1) requestAnimationFrame(animate);
    }
    function drawRadar(vals){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('피아노 테크닉 레이더',canvas.width/2,20);
      var cx=canvas.width/2,cy=210,r=130,n=AXES.length;
      for(var ring=1;ring<=5;ring++){
        ctx.strokeStyle='#1e264066';ctx.beginPath();
        for(var i=0;i<=n;i++){
          var angle=-Math.PI/2+i*(2*Math.PI/n);
          var px=cx+Math.cos(angle)*r*(ring/5),py=cy+Math.sin(angle)*r*(ring/5);
          if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.stroke();
      }
      for(var i=0;i<n;i++){
        var angle=-Math.PI/2+i*(2*Math.PI/n);
        ctx.strokeStyle='#1e264088';ctx.beginPath();ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        var lx=cx+Math.cos(angle)*(r+22),ly=cy+Math.sin(angle)*(r+22);
        ctx.fillText(AXES[i]+' ('+gradeOf(Math.round(vals[i]))+')',lx,ly+4);
      }
      if(history.length>0){
        var prev=history[history.length-1].scores;
        ctx.strokeStyle='#8892a866';ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.beginPath();
        for(var i=0;i<=n;i++){
          var idx=i%n,angle=-Math.PI/2+idx*(2*Math.PI/n),val=prev[idx]/100;
          var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
          if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath();ctx.stroke();ctx.setLineDash([]);
      }
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
      for(var i=0;i<=n;i++){
        var idx=i%n,angle=-Math.PI/2+idx*(2*Math.PI/n),val=vals[idx]/100;
        var px=cx+Math.cos(angle)*r*val,py=cy+Math.sin(angle)*r*val;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.stroke();
      ctx.fillStyle='#4a7dff33';ctx.fill();ctx.lineWidth=1;
      var overall=Math.round(vals.reduce(function(a,b){return a+b},0)/n);
      ctx.fillStyle='#eab308';ctx.font='bold 22px sans-serif';ctx.textAlign='center';
      ctx.fillText(gradeOf(overall),cx,cy+5);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('종합 '+overall+'점',cx,cy+22);
    }
    inputsDiv.querySelectorAll('input').forEach(function(inp){
      inp.addEventListener('change',function(){
        var idx=parseInt(inp.dataset.axis,10);
        var v=Math.max(0,Math.min(100,parseInt(inp.value,10)||0));
        inp.value=v;
        anim.from=current.slice();current[idx]=v;anim.to=current.slice();
        anim.startTs=null;requestAnimationFrame(animate);
      });
    });
    container.querySelector('#techradar-save').addEventListener('click',function(){
      history.push({scores:current.slice(),date:new Date().toISOString()});
      if(history.length>10) history.shift();
      ls18Set('tech_history',history);
      ls18Set('tech_scores',current);
      ls18Set('radar_used',true);
      markV18Feature('techradar');
      playSFX18('radar_save');
      var overall=Math.round(current.reduce(function(a,b){return a+b},0)/current.length);
      container.querySelector('#techradar-result').textContent='저장 완료! 종합 점수 '+overall+'점 (기록 '+history.length+'개 보관)';
      anim.from=current.slice();anim.to=current.slice();anim.startTs=null;requestAnimationFrame(animate);
    });
    anim.startTs=null;requestAnimationFrame(animate);
  });
}

// ================ 5. SONG MASTERY PROGRESS CANVAS ================
function buildMasteryUI(){
  makeV18Modal('mastery-modal','🏆 곡 마스터리 프로그레스',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">전체 완주율, 카테고리별 진행도, 곡별 별점을 확인하세요.</p>'+
      '<canvas id="mastery-canvas" width="560" height="340" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="mastery-stars" style="margin-top:10px;font-size:11px;color:var(--text2);max-height:140px;overflow-y:auto"></div>';
    var canvas=container.querySelector('#mastery-canvas');
    var ctx=canvas.getContext('2d');
    var stars=ls18Get('song_stars',{});

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('곡 마스터리 프로그레스',canvas.width/2,20);
      var songs=window.SONGS||[];
      var stats=(window.app&&app.stats)||{songsCompleted:new Set(),perfectSongs:new Set(),totalPlays:0,totalScore:0};
      var completedSet=stats.songsCompleted||new Set();
      var perfectSet=stats.perfectSongs||new Set();
      var total=songs.length,done=0;
      songs.forEach(function(s){if(completedSet.has(s.id)||completedSet.has(s.name)) done++;});
      var pct=total>0?done/total:0;
      var cx=100,cy=110,r=70;
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+pct*2*Math.PI);
      ctx.closePath();ctx.fillStyle='#22c55e';ctx.fill();
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,-Math.PI/2+pct*2*Math.PI,-Math.PI/2+2*Math.PI);
      ctx.closePath();ctx.fillStyle='#1e2640';ctx.fill();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(pct*100)+'%',cx,cy+5);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('전체 완주율',cx,cy+r+20);
      ctx.fillText(done+' / '+total+' 곡',cx,cy+r+34);

      var categories=[];
      songs.forEach(function(s){if(categories.indexOf(s.category)===-1) categories.push(s.category);});
      var barX=210,barY=45,barW=330,rowH=(240)/Math.max(categories.length,1);
      categories.forEach(function(cat,i){
        var catSongs=songs.filter(function(s){return s.category===cat});
        var catDone=catSongs.filter(function(s){return completedSet.has(s.id)||completedSet.has(s.name)}).length;
        var cpct=catSongs.length>0?catDone/catSongs.length:0;
        var y=barY+i*rowH;
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
        ctx.fillText(cat+' ('+catDone+'/'+catSongs.length+')',barX,y+rowH*0.4);
        ctx.fillStyle='#1a2036';ctx.fillRect(barX,y+rowH*0.5,barW,rowH*0.35);
        ctx.fillStyle='#4a7dff';ctx.fillRect(barX,y+rowH*0.5,barW*cpct,rowH*0.35);
      });

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='left';
      var avgScore=stats.totalPlays>0?Math.round((stats.totalScore||0)/stats.totalPlays):0;
      ctx.fillText('연주 횟수: '+(stats.totalPlays||0)+'  평균 점수: '+avgScore+'  퍼펙트: '+(perfectSet.size||0)+'곡',20,canvas.height-15);
      ls18Set('mastery_viewed',true);
      markV18Feature('mastery');
    }
    function renderStars(){
      var songs=window.SONGS||[];
      var el=container.querySelector('#mastery-stars');
      el.innerHTML=songs.slice(0,30).map(function(s){
        var key=s.id||s.name;
        var st=stars[key]||0;
        var starsHtml='';
        for(var i=0;i<3;i++) starsHtml+='<span class="mastery-star" data-song="'+key+'" data-val="'+(i+1)+'" style="cursor:pointer;font-size:13px;color:'+(i<st?'#eab308':'#2a3050')+'">★</span>';
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid var(--border,#1e2640)"><span>'+s.name+'</span><span>'+starsHtml+'</span></div>';
      }).join('');
      el.querySelectorAll('.mastery-star').forEach(function(star){
        star.addEventListener('click',function(){
          var key=star.dataset.song,val=parseInt(star.dataset.val,10);
          stars[key]=stars[key]===val?val-1:val;
          ls18Set('song_stars',stars);
          playSFX18('mastery_star');
          renderStars();
        });
      });
    }
    draw();renderStars();
  });
}

// ================ 6. MUSIC TERM FLASHCARD CANVAS ================
function buildFlashcardUI(){
  var TERMS=[
    {term:'Forte (f)',def:'세게 연주하라는 셈여림 기호'},
    {term:'Piano (p)',def:'여리게(여리고 부드럽게) 연주하라는 셈여림 기호'},
    {term:'Allegro',def:'빠르게, 경쾌하게 연주하라는 빠르기말 (약 120-168 BPM)'},
    {term:'Adagio',def:'느리고 여유롭게 연주하라는 빠르기말 (약 66-76 BPM)'},
    {term:'Crescendo',def:'점점 세게 연주하라는 지시'},
    {term:'Diminuendo',def:'점점 여리게 연주하라는 지시'},
    {term:'Staccato',def:'음을 짧게 끊어서 연주하는 주법'},
    {term:'Legato',def:'음과 음을 끊김 없이 부드럽게 이어서 연주하는 주법'},
    {term:'Fermata',def:'음표나 쉼표를 자유롭게 늘여서 연주하라는 기호'},
    {term:'Arpeggio',def:'화음의 구성음을 동시에 치지 않고 순차적으로 연주하는 주법'},
    {term:'Ritardando (rit.)',def:'점점 느리게 연주하라는 지시'},
    {term:'Accelerando',def:'점점 빠르게 연주하라는 지시'},
    {term:'Sforzando (sfz)',def:'그 음을 갑자기 강하게 연주하라는 지시'},
    {term:'Pianissimo (pp)',def:'매우 여리게 연주하라는 셈여림 기호'},
    {term:'Fortissimo (ff)',def:'매우 세게 연주하라는 셈여림 기호'},
    {term:'Glissando',def:'건반 위를 손가락으로 미끄러뜨리며 연속으로 연주하는 주법'},
    {term:'Trill',def:'인접한 두 음을 빠르게 번갈아 연주하는 장식음'},
    {term:'Da Capo (D.C.)',def:'처음으로 돌아가서 다시 연주하라는 지시'},
    {term:'Rubato',def:'박자를 엄격히 지키지 않고 자유롭게 늘였다 줄였다 하며 연주하는 것'},
    {term:'Sostenuto',def:'음을 충분히 눌러 지속시키며 연주하라는 지시'}
  ];
  makeV18Modal('flashcard-modal','🗂️ 음악 용어 플래시카드',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">카드를 클릭하면 뒤집혀 뜻이 표시됩니다. 학습 완료 버튼으로 외운 용어를 기록하세요.</p>'+
      '<canvas id="flash-canvas" width="500" height="300" style="width:100%;max-width:500px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto;cursor:pointer"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap">'+
      '<button class="ctrl-btn" id="flash-prev">이전</button>'+
      '<button class="ctrl-btn" id="flash-shuffle">셔플</button>'+
      '<button class="ctrl-btn" id="flash-learn">학습 완료</button>'+
      '<button class="ctrl-btn" id="flash-next">다음</button>'+
      '</div>'+
      '<div id="flash-stats" style="text-align:center;margin-top:8px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#flash-canvas');
    var ctx=canvas.getContext('2d');
    var order=TERMS.map(function(_,i){return i});
    var idx=0,flipped=false,flipProgress=0,animId=null;
    var learned=ls18Get('flash_learned',[]);

    function updateStats(){
      container.querySelector('#flash-stats').textContent='학습 완료: '+learned.length+' / '+TERMS.length+'  (카드 '+(idx+1)+'/'+TERMS.length+')';
    }
    function drawCard(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      var t=TERMS[order[idx]];
      var scaleX=Math.abs(Math.cos(flipProgress*Math.PI));
      var showBack=flipProgress>0.5;
      ctx.save();
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.scale(Math.max(0.05,scaleX),1);
      ctx.translate(-canvas.width/2,-canvas.height/2);
      var cardW=380,cardH=200,cx=(canvas.width-cardW)/2,cy=(canvas.height-cardH)/2;
      var isLearned=learned.indexOf(order[idx])>=0;
      ctx.fillStyle=showBack?'#1a2036':(isLearned?'#16321f':'#141828');
      ctx.strokeStyle=isLearned?'#22c55e':'#4a7dff';
      ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect?ctx.roundRect(cx,cy,cardW,cardH,12):ctx.rect(cx,cy,cardW,cardH);
      ctx.fill();ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle='#e8ecf4';ctx.textAlign='center';
      if(!showBack){
        ctx.font='bold 22px sans-serif';
        ctx.fillText(t.term,canvas.width/2,canvas.height/2+8);
        ctx.font='10px sans-serif';ctx.fillStyle='#8892a8';
        ctx.fillText('클릭하여 뜻 보기',canvas.width/2,canvas.height/2+40);
      } else {
        ctx.font='13px sans-serif';
        wrapText(ctx,t.def,canvas.width/2,canvas.height/2,cardW-40,20);
      }
      ctx.restore();
      if(isLearned){
        ctx.fillStyle='#22c55e';ctx.font='16px sans-serif';ctx.textAlign='left';
        ctx.fillText('✓ 학습완료',cx+8,cy+22);
      }
    }
    function wrapText(ctx,text,x,y,maxWidth,lineHeight){
      var words=text.split(' '),line='',lines=[];
      words.forEach(function(w){
        var test=line+w+' ';
        if(ctx.measureText(test).width>maxWidth&&line!==''){lines.push(line);line=w+' ';}
        else line=test;
      });
      lines.push(line);
      var startY=y-((lines.length-1)*lineHeight)/2;
      lines.forEach(function(l,i){ctx.fillText(l.trim(),x,startY+i*lineHeight);});
    }
    function flipAnim(){
      var dir=flipped?1:-1;
      var startTs=null;
      function step(ts){
        if(!startTs) startTs=ts;
        var p=Math.min(1,(ts-startTs)/300);
        flipProgress=flipped?p:1-p;
        drawCard();
        if(p<1) animId=requestAnimationFrame(step);
      }
      animId=requestAnimationFrame(step);
    }
    canvas.addEventListener('click',function(){
      flipped=!flipped;
      playSFX18('flash_flip');
      markV18Feature('flashcard');
      flipAnim();
    });
    container.querySelector('#flash-next').addEventListener('click',function(){
      idx=(idx+1)%TERMS.length;flipped=false;flipProgress=0;drawCard();updateStats();
    });
    container.querySelector('#flash-prev').addEventListener('click',function(){
      idx=(idx-1+TERMS.length)%TERMS.length;flipped=false;flipProgress=0;drawCard();updateStats();
    });
    container.querySelector('#flash-shuffle').addEventListener('click',function(){
      order=order.sort(function(){return Math.random()-0.5});
      idx=0;flipped=false;flipProgress=0;drawCard();updateStats();
    });
    container.querySelector('#flash-learn').addEventListener('click',function(){
      var termIdx=order[idx];
      if(learned.indexOf(termIdx)===-1){
        learned.push(termIdx);ls18Set('flash_learned',learned);
        playSFX18('flash_learn');
      }
      drawCard();updateStats();
    });
    drawCard();updateStats();
  });
}

// ================ 7. PIANO PRACTICE TIMER CANVAS ================
function buildTimerUI(){
  makeV18Modal('timer-modal','⏲️ 피아노 연습 타이머',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">뽀모도로 스타일: 25분 연습 / 5분 휴식. 하루 목표 시간을 설정하고 꾸준히 연습하세요.</p>'+
      '<canvas id="timer-canvas" width="520" height="340" style="width:100%;max-width:520px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap">'+
      '<button class="ctrl-btn" id="timer-start">시작</button>'+
      '<button class="ctrl-btn" id="timer-pause">일시정지</button>'+
      '<button class="ctrl-btn" id="timer-reset">리셋</button>'+
      '<label style="font-size:11px;color:var(--text2)">일일 목표(분): <input id="timer-goal" type="number" min="10" max="300" value="'+ls18Get('timer_goal',60)+'" style="width:60px"></label>'+
      '</div>';
    var canvas=container.querySelector('#timer-canvas');
    var ctx=canvas.getContext('2d');
    var PRACTICE=25*60,REST=5*60;
    var mode='practice',remaining=ls18Get('timer_remaining',PRACTICE);
    var running=false,intervalId=null;
    var sessions=ls18Get('timer_sessions',0);
    var totalToday=ls18Get('timer_total_today',0);
    var goalInput=container.querySelector('#timer-goal');

    function fmt(sec){var m=Math.floor(sec/60),s=sec%60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('피아노 연습 타이머',canvas.width/2,22);
      var cx=canvas.width/2,cy=160,r=100;
      var total=mode==='practice'?PRACTICE:REST;
      var frac=1-(remaining/total);
      ctx.strokeStyle='#1e2640';ctx.lineWidth=14;
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=mode==='practice'?'#4a7dff':'#22c55e';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+frac*2*Math.PI);ctx.stroke();
      ctx.lineWidth=1;
      ctx.fillStyle='#e8ecf4';ctx.font='bold 32px sans-serif';
      ctx.fillText(fmt(remaining),cx,cy+10);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText(mode==='practice'?'연습 시간':'휴식 시간',cx,cy+34);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('세션 완료: '+sessions+'회  |  오늘 연습: '+Math.round(totalToday/60)+'분  |  목표: '+goalInput.value+'분',cx,cy+r+35);
      var goalPct=Math.min(100,Math.round(totalToday/60/(parseInt(goalInput.value,10)||60)*100));
      var barW=360,barX=cx-barW/2,barY=cy+r+50;
      ctx.fillStyle='#1a2036';ctx.fillRect(barX,barY,barW,10);
      ctx.fillStyle='#eab308';ctx.fillRect(barX,barY,barW*(goalPct/100),10);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('일일 목표 달성률 '+goalPct+'%',cx,barY+24);
    }
    function tick(){
      remaining--;
      totalToday+=(mode==='practice'?1:0);
      ls18Set('timer_remaining',remaining);ls18Set('timer_total_today',totalToday);
      if(remaining<=0){
        playSFX18('timer_done');
        if(mode==='practice'){
          sessions++;ls18Set('timer_sessions',sessions);ls18Set('timer_session_done',true);
          markV18Feature('timer');
          mode='rest';remaining=REST;
        } else {
          mode='practice';remaining=PRACTICE;
        }
        ls18Set('timer_mode',mode);ls18Set('timer_remaining',remaining);
      }
      draw();
    }
    container.querySelector('#timer-start').addEventListener('click',function(){
      if(running) return;
      running=true;playSFX18('timer_start');markV18Feature('timer');
      intervalId=setInterval(tick,1000);
    });
    container.querySelector('#timer-pause').addEventListener('click',function(){
      running=false;clearInterval(intervalId);
    });
    container.querySelector('#timer-reset').addEventListener('click',function(){
      running=false;clearInterval(intervalId);mode='practice';remaining=PRACTICE;
      ls18Set('timer_mode',mode);ls18Set('timer_remaining',remaining);draw();
    });
    goalInput.addEventListener('change',function(){ls18Set('timer_goal',parseInt(goalInput.value,10)||60);draw();});
    mode=ls18Get('timer_mode','practice');
    draw();
  });
}

// ================ 8. PIANO MASTER RANKING BOARD CANVAS ================
function buildRankingUI(){
  var RANKS=[
    {name:'입문자',min:0,color:'#8892a8'},
    {name:'초보',min:100,color:'#4a7dff'},
    {name:'중급',min:300,color:'#22c55e'},
    {name:'숙련',min:700,color:'#06b6d4'},
    {name:'전문가',min:1300,color:'#eab308'},
    {name:'명인',min:2200,color:'#f97316'},
    {name:'거장',min:3500,color:'#a855f7'},
    {name:'그랜드마스터',min:5000,color:'#ef4444'}
  ];
  makeV18Modal('ranking-modal','🥇 피아노 마스터 랭킹보드',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">연주 횟수, 퀴즈 점수, 기능 사용, 업적 달성도로 XP를 계산해 8단계 랭크를 부여합니다.</p>'+
      '<canvas id="ranking-canvas" width="580" height="360" style="width:100%;max-width:580px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>';
    var canvas=container.querySelector('#ranking-canvas');
    var ctx=canvas.getContext('2d');

    function computeXP(){
      var stats=(window.app&&app.stats)||{totalPlays:0,totalScore:0};
      var plays=stats.totalPlays||0;
      var quizAvg=(ls18Get('quiz8_best',0)+ls18Get('chord_best',0)+ls18Get('tempo_best_stability',0))/3;
      var featuresUsed=ls18Get('features_used',[]).length;
      var achEls=document.querySelectorAll('.achievement.unlocked').length;
      var xp=Math.round(plays*10+quizAvg*3+featuresUsed*25+achEls*15);
      return {xp:xp,plays:plays,quizAvg:Math.round(quizAvg),featuresUsed:featuresUsed,ach:achEls};
    }
    function rankFor(xp){
      var rank=RANKS[0],idx=0;
      for(var i=0;i<RANKS.length;i++){if(xp>=RANKS[i].min){rank=RANKS[i];idx=i;}}
      return {rank:rank,idx:idx};
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
      ctx.fillText('피아노 마스터 랭킹보드',canvas.width/2,22);
      var data=computeXP();
      var ri=rankFor(data.xp);
      var prevMin=ri.rank.min;
      var nextMin=RANKS[ri.idx+1]?RANKS[ri.idx+1].min:prevMin+1500;
      var progress=Math.min(1,(data.xp-prevMin)/(nextMin-prevMin));

      var cx=canvas.width/2,badgeY=95,badgeR=55;
      ctx.beginPath();ctx.arc(cx,badgeY,badgeR,0,Math.PI*2);
      ctx.fillStyle=ri.rank.color+'33';ctx.fill();
      ctx.strokeStyle=ri.rank.color;ctx.lineWidth=4;ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle=ri.rank.color;ctx.font='bold 18px sans-serif';
      ctx.fillText(ri.rank.name,cx,badgeY+6);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('XP '+data.xp,cx,badgeY+30);

      var barW=440,barX=cx-barW/2,barY=badgeY+badgeR+30;
      ctx.fillStyle='#1a2036';ctx.fillRect(barX,barY,barW,16);
      ctx.fillStyle=ri.rank.color;ctx.fillRect(barX,barY,barW*progress,16);
      ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(data.xp+' / '+nextMin+' XP (다음 랭크까지)',cx,barY+30);

      var listY=barY+55,rowH=20;
      RANKS.forEach(function(r,i){
        var y=listY+i*rowH;
        var active=i===ri.idx;
        ctx.fillStyle=active?r.color:'#8892a8';
        ctx.font=active?'bold 11px sans-serif':'10px sans-serif';
        ctx.textAlign='left';
        ctx.fillText((active?'▶ ':'   ')+r.name+' (XP '+r.min+'+)',40,y);
        if(active){ctx.fillStyle=r.color;ctx.textAlign='right';ctx.fillText('현재 랭크',canvas.width-40,y);}
      });

      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText('총 연주: '+data.plays+'회  퀴즈평균: '+data.quizAvg+'%  기능사용: '+data.featuresUsed+'개  업적: '+data.ach+'개',cx,canvas.height-10);

      var lastRankIdx=ls18Get('last_rank_idx',-1);
      if(ri.idx>lastRankIdx){
        ls18Set('last_rank_idx',ri.idx);
        if(lastRankIdx>=0) playSFX18('rank_up');
      }
      ls18Set('ranking_viewed',true);
      markV18Feature('ranking');
    }
    draw();
  });
}

// ================ QUIZ v9 (+15 QUESTIONS, 120->135) ================
function buildQuizV9UI(){
  var QUIZ9=[
    {q:'서스테인 페달(우측)의 기능은?',a:'모든 음의 댐퍼를 올려 울림을 유지',opts:['소리를 작게 만든다','모든 음의 댐퍼를 올려 울림을 유지','음을 한 옥타브 낮춘다','타건을 무겁게 만든다']},
    {q:'소스테누토 페달(가운데)의 기능은?',a:'누르는 순간 눌린 건반만 지속',opts:['모든 음을 지속','누르는 순간 눌린 건반만 지속','음을 크게 만든다','템포를 늦춘다']},
    {q:'우나 코르다(왼쪽 페달)의 원래 기능은?',a:'건반 전체를 옆으로 이동시켜 음색을 부드럽게',opts:['음을 크게 만든다','건반 전체를 옆으로 이동시켜 음색을 부드럽게','서스테인과 동일','템포를 빠르게'] },
    {q:'&quot;쇼팽의 녹턴&quot;에서 자주 쓰이는 왼손 반주 패턴은?',a:'넓은 음역의 아르페지오',opts:['단순한 옥타브 반복','넓은 음역의 아르페지오','타악기적 코드 찍기','스타카토 스케일']},
    {q:'베토벤이 작곡 후반기에 겪었던 신체적 어려움은?',a:'청력 상실',opts:['시력 상실','청력 상실','손가락 부상','기억 상실']},
    {q:'평균율(Well-Tempered)의 의미는?',a:'모든 조성을 균등하게 사용할 수 있는 조율법',opts:['한 옥타브를 7등분','모든 조성을 균등하게 사용할 수 있는 조율법','피아노 전용 조율법','빠르기를 균등하게 하는 것']},
    {q:'&quot;리스트&quot;가 개척한 초절기교 연주 형식은?',a:'초절기교 연습곡(Transcendental Etudes)',opts:['평균율 클라비어곡집','초절기교 연습곡(Transcendental Etudes)','골드베르크 변주곡','전주곡과 푸가']},
    {q:'모차르트가 활동한 음악 시대는?',a:'고전주의',opts:['바로크','고전주의','낭만주의','인상주의'] },
    {q:'드뷔시 음악의 대표적 화성적 특징은?',a:'온음음계와 병행 화음',opts:['12음 기법','온음음계와 병행 화음','단순 3화음 위주','불협화음 배제']},
    {q:'2도 음정의 다른 이름은?',a:'장2도/단2도(초성)',opts:['완전음정','장2도/단2도(초성)','증음정만 존재','옥타브']},
    {q:'도미넌트(V) 코드가 으뜸음(I)으로 해결되는 진행을 무엇이라 하는가?',a:'정격종지(authentic cadence)',opts:['변격종지','정격종지(authentic cadence)','회피종지','반종지'] },
    {q:'라흐마니노프의 신체적 특징으로 유명한 것은?',a:'매우 큰 손(넓은 음역 화음 연주에 유리)',opts:['매우 작은 손','매우 큰 손(넓은 음역 화음 연주에 유리)','왼손잡이','시각장애'] },
    {q:'&quot;하농(Hanon)&quot; 교본의 주 목적은?',a:'손가락 독립성과 기초 테크닉 훈련',opts:['화성학 학습','손가락 독립성과 기초 테크닉 훈련','작곡 연습','청음 훈련'] },
    {q:'피아니시시모(ppp)보다 한 단계 더 여린 셈여림은 일반적으로 무엇으로 표기하는가?',a:'ppp가 최소 표기, 추가시 pppp',opts:['mp','ppp가 최소 표기, 추가시 pppp','f','mf'] },
    {q:'3화음에 7음을 더한 화음을 무엇이라 하는가?',a:'7화음(seventh chord)',opts:['9화음','7화음(seventh chord)','단3화음','증3화음'] }
  ];
  makeV18Modal('quiz9-modal','🧠 피아노 퀴즈 v9 (15문항)',function(container){
    var currentQ=0,score=0;
    function showQ(){
      if(currentQ>=QUIZ9.length){
        var pct=Math.round(score/QUIZ9.length*100);
        var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=50?'C':'D';
        container.innerHTML='<div style="text-align:center"><div style="font-size:36px;color:'+(pct>=70?'#22c55e':'#ef4444')+'">'+grade+'</div>'+
          '<div style="font-size:16px;margin:8px 0">'+score+'/'+QUIZ9.length+' ('+pct+'%)</div>'+
          '<div style="font-size:11px;color:var(--text2)">최고: '+ls18Get('quiz9_best',0)+'%</div>'+
          '<button class="ctrl-btn" id="quiz9-restart" style="margin-top:12px;padding:8px 16px">다시 도전</button></div>';
        if(pct>ls18Get('quiz9_best',0)) ls18Set('quiz9_best',pct);
        ls18Set('quiz9_done',true);
        markV18Feature('quiz9');
        container.querySelector('#quiz9-restart').addEventListener('click',function(){currentQ=0;score=0;showQ();});
        return;
      }
      var q=QUIZ9[currentQ];
      container.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:4px">Q'+(currentQ+1)+'/'+QUIZ9.length+'</div>'+
        '<div style="font-size:13px;margin-bottom:10px">'+q.q+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:6px" id="quiz9-opts"></div>'+
        '<div id="quiz9-feedback" style="margin-top:8px;font-size:12px;text-align:center"></div>';
      var answered=false;
      var optsDiv=container.querySelector('#quiz9-opts');
      q.opts.forEach(function(opt){
        var btn=document.createElement('button');
        btn.className='ctrl-btn';btn.style.cssText='padding:8px 12px;font-size:11px;text-align:left';
        btn.textContent=opt;
        btn.addEventListener('click',function(){
          if(answered)return;answered=true;
          if(opt===q.a){score++;container.querySelector('#quiz9-feedback').innerHTML='<span style="color:#22c55e">✅ 정답!</span>';playSFX18('mastery_star');}
          else{container.querySelector('#quiz9-feedback').innerHTML='<span style="color:#ef4444">❌ 오답! 정답: '+q.a+'</span>';}
          currentQ++;setTimeout(showQ,1200);
        });
        optsDiv.appendChild(btn);
      });
    }
    showQ();
  });
}

// ================ ACHIEVEMENTS v18 (+12, 144->156) ================
var V18_ACHIEVEMENTS=[
  {id:'tempo_tracker',name:'템포 트래커',icon:'📈',desc:'실시간 템포 트래커 첫 사용'},
  {id:'tempo_stable',name:'메트로놈의 정확함',icon:'🎯',desc:'템포 안정도 90% 이상 달성'},
  {id:'ab_loop',name:'구간 반복러',icon:'🔁',desc:'A/B 구간 반복 연습기 첫 사용'},
  {id:'ab_master',name:'반복 연습 마스터',icon:'🔂',desc:'A/B 구간 10회 이상 반복 연습'},
  {id:'genre_explorer',name:'장르 탐험가',icon:'🌍',desc:'5개 이상 장르 탐험'},
  {id:'tech_radar',name:'테크닉 분석가',icon:'🕸️',desc:'피아노 테크닉 레이더 사용'},
  {id:'mastery_view',name:'마스터리 확인자',icon:'🏆',desc:'곡 마스터리 대시보드 확인'},
  {id:'flashcard_10',name:'용어 마스터',icon:'🗂️',desc:'플래시카드 10개 이상 학습'},
  {id:'timer_session',name:'포모도로 완주',icon:'⏲️',desc:'연습 타이머 세션 완료'},
  {id:'ranking_view',name:'랭킹 확인자',icon:'🥇',desc:'피아노 마스터 랭킹보드 확인'},
  {id:'quiz9_done',name:'퀴즈 v9 완료',icon:'🧠',desc:'퀴즈 v9 15문항 완료'},
  {id:'v18_explorer',name:'v18 탐험가',icon:'🚀',desc:'v18 신규 기능 5개 이상 사용'}
];

function injectV18Achievements(){
  var grid=document.querySelector('.achievement-grid');
  if(!grid) return;
  V18_ACHIEVEMENTS.forEach(function(a){
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

function checkV18Achievements(){
  var checks=[
    {id:'tempo_tracker',cond:function(){return ls18Get('tempo_used',false)}},
    {id:'tempo_stable',cond:function(){return ls18Get('tempo_best_stability',0)>=90}},
    {id:'ab_loop',cond:function(){return ls18Get('ab_used',false)}},
    {id:'ab_master',cond:function(){return ls18Get('ab_loop_count',0)>=10}},
    {id:'genre_explorer',cond:function(){return ls18Get('genre_explored',[]).length>=5}},
    {id:'tech_radar',cond:function(){return ls18Get('radar_used',false)}},
    {id:'mastery_view',cond:function(){return ls18Get('mastery_viewed',false)}},
    {id:'flashcard_10',cond:function(){return ls18Get('flash_learned',[]).length>=10}},
    {id:'timer_session',cond:function(){return ls18Get('timer_session_done',false)}},
    {id:'ranking_view',cond:function(){return ls18Get('ranking_viewed',false)}},
    {id:'quiz9_done',cond:function(){return ls18Get('quiz9_done',false)}},
    {id:'v18_explorer',cond:function(){return ls18Get('features_used',[]).length>=5}}
  ];
  checks.forEach(function(c){
    if(ls18Get('ach_'+c.id,false)) return;
    if(!c.cond()) return;
    ls18Set('ach_'+c.id,true);
    var el=document.querySelector('[data-id="'+c.id+'"]');
    var a=V18_ACHIEVEMENTS.find(function(x){return x.id===c.id});
    if(el){el.classList.add('unlocked');el.querySelector('.achievement-icon').textContent=a.icon;}
    playSFX18('v18_achieve');
    showV18Toast(a.icon+' 업적 해금: '+a.name);
  });
  V18_ACHIEVEMENTS.forEach(function(a){
    if(ls18Get('ach_'+a.id,false)){
      var el=document.querySelector('[data-id="'+a.id+'"]');
      if(el){el.classList.add('unlocked');el.querySelector('.achievement-icon').textContent=a.icon;}
    }
  });
}

function showV18Toast(msg){
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

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV18Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'T':'tempo-modal',
      'A':'abloop-modal',
      'G':'genre-modal',
      'R':'techradar-modal',
      'M':'mastery-modal',
      'F':'flashcard-modal',
      'P':'timer-modal',
      'B':'ranking-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ SCROLL NAV BAR v18 (z-index 6100) ================
function injectV18NavBar(){
  var existingNav=document.querySelector('.v18-nav-bar');if(existingNav)return;
  var nav = document.createElement('div');
  nav.className='v18-nav-bar';
  nav.style.cssText = 'position:fixed;bottom:0;left:0;right:0;display:flex;overflow-x:auto;gap:0;background:var(--surface,#141828);border-top:1px solid var(--border,#1e2640);z-index:6100;padding:4px 2px;-webkit-overflow-scrolling:touch';
  var items=[
    {label:'📈 템포',modal:'tempo-modal'},
    {label:'🔁 A/B반복',modal:'abloop-modal'},
    {label:'🌍 장르',modal:'genre-modal'},
    {label:'🕸️ 테크닉',modal:'techradar-modal'},
    {label:'🏆 마스터리',modal:'mastery-modal'},
    {label:'🗂️ 플래시카드',modal:'flashcard-modal'},
    {label:'⏲️ 타이머',modal:'timer-modal'},
    {label:'🥇 랭킹',modal:'ranking-modal'},
    {label:'🧠 퀴즈v9',modal:'quiz9-modal'}
  ];
  items.forEach(function(item){
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap;flex-shrink:0;margin:0 2px';
    btn.textContent=item.label;
    btn.addEventListener('click',function(){var m=document.getElementById(item.modal);if(m)m.style.display='flex';});
    nav.appendChild(btn);
  });
  document.body.appendChild(nav);
}

// ================ INIT ================
function initV18(){
  addV18Songs();
  buildTempoTrackerUI();
  buildABLoopUI();
  buildGenreUI();
  buildTechRadarUI();
  buildMasteryUI();
  buildFlashcardUI();
  buildTimerUI();
  buildRankingUI();
  buildQuizV9UI();
  injectV18Achievements();
  setupV18Shortcuts();
  injectV18NavBar();
  setInterval(checkV18Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV18,4000);});
else setTimeout(initV18,4000);
})();
