// Piano Master v20 Patch Module
// Interval Ear Training, Pedal Technique Trainer, Composition Workshop, Piano Care Guide,
// Performance Anxiety Coach, Music Theory Mindmap, Daily Skill Assessment, Piano History Timeline
// 10 Songs (162->172), Quiz v11 15Q (150->165), 12 Achievements (168->180), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v20Loaded) return;
window.__v20Loaded = true;

var LS20 = 'piano-v20-';
function ls20Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS20+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls20Set(k,v){localStorage.setItem(LS20+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v20 (12 sounds) ================
var sfx20 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone20(freq,type,dur,gainVal,delayMs){
  if(!sfx20) return;
  setTimeout(function(){
    if(!sfx20) return;
    var t=sfx20.currentTime,g=sfx20.createGain(),o=sfx20.createOscillator();
    o.connect(g);g.connect(sfx20.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX20(type){
  if(!sfx20) return;
  if(sfx20.state==='suspended') sfx20.resume();
  switch(type){
    case 'interval_play': tone20(440,'sine',0.3,0.07,0); tone20(554,'sine',0.3,0.07,350); break;
    case 'interval_correct': tone20(784,'triangle',0.12,0.08,0); tone20(1047,'triangle',0.15,0.08,80); break;
    case 'interval_wrong': tone20(185,'sawtooth',0.22,0.06,0); break;
    case 'pedal_press': tone20(330,'sine',0.4,0.05,0); tone20(440,'sine',0.4,0.04,0); tone20(554,'sine',0.4,0.04,0); break;
    case 'compose_note': tone20(523,'triangle',0.15,0.06,0); break;
    case 'compose_play': tone20(392,'sine',0.1,0.07,0); tone20(523,'sine',0.1,0.07,80); tone20(659,'sine',0.1,0.07,160); break;
    case 'care_check': tone20(600,'sine',0.08,0.05,0); break;
    case 'breathe_in': tone20(262,'sine',0.8,0.03,0); break;
    case 'breathe_out': tone20(196,'sine',1.0,0.025,0); break;
    case 'theory_open': tone20(440,'triangle',0.12,0.06,0); tone20(554,'triangle',0.12,0.06,100); break;
    case 'skill_assess': tone20(523,'triangle',0.1,0.08,0); tone20(659,'triangle',0.12,0.08,100); tone20(784,'triangle',0.12,0.08,200); break;
    case 'v20_achieve': tone20(523,'triangle',0.1,0.1,0); tone20(659,'triangle',0.12,0.1,80); tone20(784,'triangle',0.12,0.1,160); tone20(1047,'triangle',0.25,0.1,240); break;
  }
}

// ================ COMMON MODAL BUILDER v20 ================
function makeV20Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,640px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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

function markV20Feature(name){
  var used=ls20Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls20Set('features_used',used);}
}

// ================ 10 NEW SONGS (162->172) ================
function addV20Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s163',name:'쇼팡 발라드 Op.69 No.1',category:'클래식',difficulty:'hard',
     notes:[{note:'Ab4',time:0,dur:0.8},{note:'C5',time:0.8,dur:0.4},{note:'Ab4',time:1.2,dur:0.4},{note:'Bb4',time:1.6,dur:0.4},{note:'Ab4',time:2.0,dur:0.4},{note:'F4',time:2.4,dur:0.8},{note:'Ab4',time:3.2,dur:0.4},{note:'Eb4',time:3.6,dur:0.4},{note:'F4',time:4.0,dur:0.4},{note:'Db4',time:4.4,dur:0.8},{note:'Eb4',time:5.2,dur:0.4},{note:'C4',time:5.6,dur:0.8}]},
    {id:'s164',name:'리스트 사랑의 꿈 No.3',category:'클래식',difficulty:'expert',
     notes:[{note:'Ab3',time:0,dur:0.6},{note:'C4',time:0.6,dur:0.3},{note:'F4',time:0.9,dur:0.3},{note:'Ab4',time:1.2,dur:0.6},{note:'C5',time:1.8,dur:0.3},{note:'Ab4',time:2.1,dur:0.3},{note:'F4',time:2.4,dur:0.6},{note:'Db5',time:3.0,dur:0.3},{note:'Bb4',time:3.3,dur:0.3},{note:'Ab4',time:3.6,dur:0.9},{note:'F4',time:4.5,dur:0.6},{note:'Db4',time:5.1,dur:0.6}]},
    {id:'s165',name:'바흐 프렐류드 C장조 BWV 846',category:'클래식',difficulty:'medium',
     notes:[{note:'C4',time:0,dur:0.25},{note:'E4',time:0.25,dur:0.25},{note:'G4',time:0.5,dur:0.25},{note:'C5',time:0.75,dur:0.25},{note:'E5',time:1.0,dur:0.25},{note:'G4',time:1.25,dur:0.25},{note:'C5',time:1.5,dur:0.25},{note:'E5',time:1.75,dur:0.25},{note:'C4',time:2.0,dur:0.25},{note:'D4',time:2.25,dur:0.25},{note:'A4',time:2.5,dur:0.25},{note:'D5',time:2.75,dur:0.25}]},
    {id:'s166',name:'드뷔시 달빛',category:'클래식',difficulty:'expert',
     notes:[{note:'Db4',time:0,dur:0.5},{note:'F4',time:0.5,dur:0.5},{note:'Ab4',time:1.0,dur:0.5},{note:'Db4',time:1.5,dur:0.5},{note:'F4',time:2.0,dur:0.5},{note:'Ab4',time:2.5,dur:0.5},{note:'Db4',time:3.0,dur:0.5},{note:'F4',time:3.5,dur:0.5},{note:'Ab4',time:4.0,dur:0.5},{note:'Db5',time:4.5,dur:0.5},{note:'Ab4',time:5.0,dur:0.5},{note:'F4',time:5.5,dur:0.5}]},
    {id:'s167',name:'슈베르트 즈흥곡 Op.90 No.2',category:'클래식',difficulty:'hard',
     notes:[{note:'Eb4',time:0,dur:0.15},{note:'F4',time:0.15,dur:0.15},{note:'Gb4',time:0.3,dur:0.15},{note:'Ab4',time:0.45,dur:0.15},{note:'Bb4',time:0.6,dur:0.3},{note:'Ab4',time:0.9,dur:0.15},{note:'Gb4',time:1.05,dur:0.15},{note:'F4',time:1.2,dur:0.15},{note:'Eb4',time:1.35,dur:0.3},{note:'Db4',time:1.65,dur:0.3},{note:'Eb4',time:1.95,dur:0.6},{note:'Bb3',time:2.55,dur:0.6}]},
    {id:'s168',name:'라흐마니노프 전주곡 C#단조',category:'클래식',difficulty:'expert',
     notes:[{note:'C#3',time:0,dur:1.0},{note:'G#3',time:0,dur:1.0},{note:'C#4',time:0,dur:1.0},{note:'E4',time:0,dur:1.0},{note:'G#4',time:1.0,dur:0.5},{note:'E4',time:1.5,dur:0.5},{note:'C#4',time:2.0,dur:0.5},{note:'G#3',time:2.5,dur:0.5},{note:'A3',time:3.0,dur:0.5},{note:'E4',time:3.0,dur:0.5},{note:'A4',time:3.0,dur:1.0},{note:'C#4',time:4.0,dur:1.0}]},
    {id:'s169',name:'사티 그노시엔느 No.1',category:'클래식',difficulty:'medium',
     notes:[{note:'F3',time:0,dur:0.8},{note:'Bb3',time:0.8,dur:0.4},{note:'C4',time:1.2,dur:0.4},{note:'D4',time:1.6,dur:0.8},{note:'F4',time:2.4,dur:0.4},{note:'E4',time:2.8,dur:0.4},{note:'D4',time:3.2,dur:0.8},{note:'C4',time:4.0,dur:0.4},{note:'D4',time:4.4,dur:0.4},{note:'A3',time:4.8,dur:0.8},{note:'Bb3',time:5.6,dur:0.8},{note:'F3',time:6.4,dur:1.0}]},
    {id:'s170',name:'그리그 아침의 기분',category:'클래식',difficulty:'medium',
     notes:[{note:'E4',time:0,dur:0.5},{note:'G#4',time:0.5,dur:0.5},{note:'B4',time:1.0,dur:0.5},{note:'E5',time:1.5,dur:1.0},{note:'D5',time:2.5,dur:0.5},{note:'C5',time:3.0,dur:0.5},{note:'B4',time:3.5,dur:1.0},{note:'A4',time:4.5,dur:0.5},{note:'C5',time:5.0,dur:0.5},{note:'E4',time:5.5,dur:0.5},{note:'A4',time:6.0,dur:1.0},{note:'G#4',time:7.0,dur:1.0}]},
    {id:'s171',name:'모차르트 터키 행진곡 심화',category:'클래식',difficulty:'expert',
     notes:[{note:'B4',time:0,dur:0.15},{note:'A4',time:0.15,dur:0.15},{note:'G#4',time:0.3,dur:0.15},{note:'A4',time:0.45,dur:0.3},{note:'C5',time:0.75,dur:0.15},{note:'D5',time:0.9,dur:0.15},{note:'E5',time:1.05,dur:0.3},{note:'G5',time:1.35,dur:0.15},{note:'F5',time:1.5,dur:0.15},{note:'E5',time:1.65,dur:0.15},{note:'F5',time:1.8,dur:0.3},{note:'A5',time:2.1,dur:0.5}]},
    {id:'s172',name:'쿠프랑 계곡이 흐르는 곳',category:'클래식',difficulty:'hard',
     notes:[{note:'G3',time:0,dur:0.4},{note:'A3',time:0.4,dur:0.4},{note:'B3',time:0.8,dur:0.4},{note:'C4',time:1.2,dur:0.6},{note:'D4',time:1.8,dur:0.3},{note:'E4',time:2.1,dur:0.3},{note:'D4',time:2.4,dur:0.6},{note:'B3',time:3.0,dur:0.3},{note:'A3',time:3.3,dur:0.3},{note:'G3',time:3.6,dur:0.6},{note:'E4',time:4.2,dur:0.3},{note:'D4',time:4.5,dur:0.9}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. INTERVAL EAR TRAINING ================
function buildIntervalTrainerUI(){
  var INTERVALS=[
    {name:'완전 1도 (Unison)',semitones:0,ratio:'1:1'},
    {name:'단 2도 (m2)',semitones:1,ratio:'16:15'},
    {name:'장 2도 (M2)',semitones:2,ratio:'9:8'},
    {name:'단 3도 (m3)',semitones:3,ratio:'6:5'},
    {name:'장 3도 (M3)',semitones:4,ratio:'5:4'},
    {name:'완전 4도 (P4)',semitones:5,ratio:'4:3'},
    {name:'증 4도 (Tritone)',semitones:6,ratio:'45:32'},
    {name:'완전 5도 (P5)',semitones:7,ratio:'3:2'},
    {name:'단 6도 (m6)',semitones:8,ratio:'8:5'},
    {name:'장 6도 (M6)',semitones:9,ratio:'5:3'},
    {name:'단 7도 (m7)',semitones:10,ratio:'16:9'},
    {name:'장 7도 (M7)',semitones:11,ratio:'15:8'},
    {name:'완전 8도 (Octave)',semitones:12,ratio:'2:1'}
  ];

  makeV20Modal('interval-modal','🎵 인터벌 청음 트레이너',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">13종 음정 인터벌을 듣고 맞추세요. 10라운드 채점.</p>'+
      '<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">'+
        '<button id="iv-play-btn" style="padding:6px 14px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">🔊 재생</button>'+
        '<span id="iv-round" style="font-size:12px;color:var(--text2);line-height:30px">R: 0/10</span>'+
        '<span id="iv-score" style="font-size:12px;color:var(--green);line-height:30px">S: 0</span>'+
        '<button id="iv-new-btn" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">새 게임</button>'+
      '</div>'+
      '<div id="iv-choices" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px"></div>'+
      '<canvas id="iv-canvas" width="580" height="340" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="iv-result" style="margin-top:8px;font-size:12px;color:var(--text2);text-align:center"></div>';

    var stats=ls20Get('interval_stats',{total:0,correct:0,rounds:[],history:[]});
    var currentInterval=null,currentBase=0,round=0,score=0,answered=false;

    function playInterval(){
      if(!sfx20) return;
      if(sfx20.state==='suspended') sfx20.resume();
      var baseIdx=Math.floor(Math.random()*25)+24;
      var base=440*Math.pow(2,(baseIdx-49)/12);
      var idx=Math.floor(Math.random()*INTERVALS.length);
      currentInterval=INTERVALS[idx];
      currentBase=base;
      var second=base*Math.pow(2,currentInterval.semitones/12);
      var t=sfx20.currentTime;
      var g1=sfx20.createGain(),o1=sfx20.createOscillator();
      o1.connect(g1);g1.connect(sfx20.destination);o1.type='sine';o1.frequency.setValueAtTime(base,t);
      g1.gain.setValueAtTime(0.08,t);g1.gain.exponentialRampToValueAtTime(0.001,t+0.6);
      o1.start(t);o1.stop(t+0.6);
      var g2=sfx20.createGain(),o2=sfx20.createOscillator();
      o2.connect(g2);g2.connect(sfx20.destination);o2.type='sine';o2.frequency.setValueAtTime(second,t+0.7);
      g2.gain.setValueAtTime(0.08,t+0.7);g2.gain.exponentialRampToValueAtTime(0.001,t+1.3);
      o2.start(t+0.7);o2.stop(t+1.3);
    }

    function buildChoices(){
      var ch=document.getElementById('iv-choices');
      ch.innerHTML='';
      INTERVALS.forEach(function(iv,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:6px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer;transition:0.2s';
        btn.textContent=iv.name;
        btn.addEventListener('click',function(){
          if(answered||!currentInterval) return;
          answered=true;
          if(iv.semitones===currentInterval.semitones){
            score++;playSFX20('interval_correct');btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';
            stats.correct++;
          } else {
            playSFX20('interval_wrong');btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
            Array.from(ch.children).forEach(function(b,bi){if(INTERVALS[bi].semitones===currentInterval.semitones){b.style.background='rgba(34,197,94,0.3)';b.style.borderColor='var(--green)';}});
          }
          stats.total++;
          stats.rounds.push({interval:currentInterval.name,correct:iv.semitones===currentInterval.semitones});
          if(stats.rounds.length>30) stats.rounds=stats.rounds.slice(-30);
          ls20Set('interval_stats',stats);
          document.getElementById('iv-score').textContent='S: '+score;
          document.getElementById('iv-result').textContent=(iv.semitones===currentInterval.semitones?'✅ 정답! ':'&#10060; 오답. 정답: ')+currentInterval.name+' (비율 '+currentInterval.ratio+', '+currentInterval.semitones+'반음)';
          drawIVCanvas();
          if(round<10){
            setTimeout(function(){nextRound();},1500);
          } else {
            stats.history.push({score:score,date:new Date().toISOString().slice(0,10)});
            if(stats.history.length>20) stats.history=stats.history.slice(-20);
            ls20Set('interval_stats',stats);
            document.getElementById('iv-result').textContent='게임 종료! 최종 점수: '+score+'/10 ('+(score>=9?'S':score>=7?'A':score>=5?'B':score>=3?'C':'D')+'등급)';
          }
        });
        ch.appendChild(btn);
      });
    }

    function nextRound(){
      round++;answered=false;currentInterval=null;
      document.getElementById('iv-round').textContent='R: '+round+'/10';
      document.getElementById('iv-result').textContent='🔊 버튼을 눌러 음정을 들어보세요';
      Array.from(document.getElementById('iv-choices').children).forEach(function(b){b.style.background='var(--surface2)';b.style.borderColor='var(--border)';});
    }

    function drawIVCanvas(){
      var c=document.getElementById('iv-canvas');if(!c)return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('인터벌 청음 성과',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+stats.total+'문 | 정답 '+stats.correct+'문 | 정답률 '+(stats.total>0?Math.round(stats.correct/stats.total*100):0)+'%',20,42);

      var barW=Math.min(36,Math.floor((W-60)/13));
      var barMaxH=180;
      var perInterval=new Array(13).fill(0),perCorrect=new Array(13).fill(0);
      stats.rounds.forEach(function(r){
        var idx=INTERVALS.findIndex(function(iv){return iv.name===r.interval});
        if(idx>=0){perInterval[idx]++;if(r.correct)perCorrect[idx]++;}
      });
      var maxCount=Math.max.apply(null,perInterval)||1;
      for(var i=0;i<13;i++){
        var x=30+i*(barW+2);
        var h=Math.round(perInterval[i]/maxCount*barMaxH);
        var hc=perInterval[i]>0?Math.round(perCorrect[i]/perInterval[i]*h):0;
        ctx.fillStyle='rgba(239,68,68,0.3)';ctx.fillRect(x,60+barMaxH-h,barW,h);
        ctx.fillStyle='rgba(34,197,94,0.5)';ctx.fillRect(x,60+barMaxH-hc,barW,hc);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.save();ctx.translate(x+barW/2,60+barMaxH+12);ctx.rotate(-Math.PI/4);ctx.fillText(INTERVALS[i].name.split(' ')[0],0,0);ctx.restore();
      }
      ctx.fillStyle='#22c55e';ctx.fillRect(W-150,58,10,10);ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('정답',W-136,67);
      ctx.fillStyle='#ef4444';ctx.fillRect(W-80,58,10,10);ctx.fillText('오답',W-66,67);

      if(stats.history.length>1){
        ctx.strokeStyle='#a855f7';ctx.lineWidth=2;ctx.beginPath();
        var hLen=Math.min(stats.history.length,20);
        var sW=(W-80)/(hLen-1);
        for(var j=0;j<hLen;j++){
          var sx=40+j*sW,sy=H-30-(stats.history[stats.history.length-hLen+j].score/10)*(H-280);
          if(j===0) ctx.moveTo(sx,sy); else ctx.lineTo(sx,sy);
        }
        ctx.stroke();
        ctx.fillStyle='#a855f7';ctx.font='9px sans-serif';ctx.fillText('최근 게임 점수 추이',40,H-10);
      }
      markV20Feature('interval');
    }

    document.getElementById('iv-play-btn').addEventListener('click',function(){
      if(!currentInterval){nextRound();}
      playInterval();
    });
    document.getElementById('iv-new-btn').addEventListener('click',function(){
      round=0;score=0;answered=false;currentInterval=null;stats.rounds=[];ls20Set('interval_stats',stats);
      document.getElementById('iv-round').textContent='R: 0/10';
      document.getElementById('iv-score').textContent='S: 0';
      document.getElementById('iv-result').textContent='';
      drawIVCanvas();
    });
    buildChoices();
    drawIVCanvas();
  });
}

// ================ 2. PEDAL TECHNIQUE TRAINER ================
function buildPedalTrainerUI(){
  var PEDALS=[
    {name:'서스테인 페달',eng:'Sustain (Damper)',desc:'오른발. 모든 음이 지속됨. 화성을 풍부하게 만듬고 레가토 표현에 필수.',tips:['청정 페달링: 새 화성 시작에 짧게 떼였다 밟기','하프 페달: 반만 밟아 부분적 서스테인','프렐이즈 전체에서 일관적으로 사용','빠른 패시지에서는 비밟기']},
    {name:'소프트 페달',eng:'Soft (Una Corda)',desc:'왼발. 해머가 한 현만 침. 볼륨 줄이고 음색 변화.',tips:['수정처럼 부드러운 음색 얻을 때','서스테인과 함께 사용하면 풍부한 포현','점진적으로 밟고 떼며 침수 조절','pp~ppp 구간에서 효과적']},
    {name:'소스테누토 페달',eng:'Sostenuto',desc:'가운데 발. 밟는 순간 누른 음만 지속. 선택적 서스테인.',tips:['특정 음만 유지하면서 새 프레이즈 연주','바흐 등 다성부 작품에서 페달 포인트 유지','그럈드 피아노에서 주로 사용','1번 밟고 → 음 누르고 → 2번 떼고 → 계속 유지']},
  ];

  makeV20Modal('pedal-modal','🦶 페달 테크닉 트레이너',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">서스테인/소프트/소스테누토 3종 페달 기법을 학습합니다.</p>'+
      '<div id="pedal-tabs" style="display:flex;gap:6px;margin-bottom:10px"></div>'+
      '<canvas id="pedal-canvas" width="580" height="360" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="pedal-tips" style="margin-top:10px;font-size:11px"></div>';

    var selPedal=0;
    var mastery=ls20Get('pedal_mastery',[0,0,0]);

    function buildPedalTabs(){
      var tabs=document.getElementById('pedal-tabs');tabs.innerHTML='';
      PEDALS.forEach(function(p,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:6px 12px;border-radius:6px;border:1px solid '+(i===selPedal?'var(--accent)':'var(--border)')+';background:'+(i===selPedal?'var(--accent)':'var(--surface2)')+';color:'+(i===selPedal?'white':'var(--text)')+';font-size:11px;cursor:pointer';
        btn.textContent=p.name;
        btn.addEventListener('click',function(){selPedal=i;buildPedalTabs();drawPedalCanvas();showPedalTips();playSFX20('pedal_press');});
        tabs.appendChild(btn);
      });
    }

    function showPedalTips(){
      var tip=document.getElementById('pedal-tips');
      var p=PEDALS[selPedal];
      tip.innerHTML='<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:8px">'+
        '<div style="font-size:13px;color:var(--accent);font-weight:700;margin-bottom:4px">'+p.name+' ('+p.eng+')</div>'+
        '<div style="font-size:11px;color:var(--text2);margin-bottom:8px">'+p.desc+'</div>'+
        '<div style="font-size:11px;color:var(--text)"><strong>팀:</strong><ul style="margin:4px 0 0 16px;padding:0">'+p.tips.map(function(t){return '<li style="margin-bottom:3px">'+t+'</li>'}).join('')+'</ul></div>'+
        '<div style="margin-top:8px;display:flex;gap:6px"><button class="pedal-practice-btn" data-idx="'+selPedal+'" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">연습 완료 (+1)</button></div>'+
      '</div>';
      tip.querySelector('.pedal-practice-btn').addEventListener('click',function(){
        mastery[selPedal]=Math.min(mastery[selPedal]+1,20);
        ls20Set('pedal_mastery',mastery);
        drawPedalCanvas();
        playSFX20('pedal_press');
      });
    }

    function drawPedalCanvas(){
      var c=document.getElementById('pedal-canvas');if(!c)return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('페달 마스터리 현황',20,25);

      var totalMax=60;
      var totalNow=mastery[0]+mastery[1]+mastery[2];
      var grade=totalNow>=50?'S':totalNow>=40?'A':totalNow>=25?'B':totalNow>=10?'C':'D';
      ctx.fillStyle='#eab308';ctx.font='bold 24px sans-serif';
      ctx.fillText(grade,W-50,35);

      var colors=['#3b82f6','#a855f7','#22c55e'];
      var names=['서스테인','소프트','소스테누토'];
      var barW=120,barH=30,startY=60;
      for(var i=0;i<3;i++){
        var y=startY+i*50;
        ctx.fillStyle='#1a2036';ctx.fillRect(30,y,barW*2,barH);
        var fillW=Math.round(mastery[i]/20*barW*2);
        ctx.fillStyle=colors[i];ctx.fillRect(30,y,fillW,barH);
        ctx.strokeStyle=i===selPedal?'#eab308':'#1e2640';ctx.lineWidth=i===selPedal?2:1;ctx.strokeRect(30,y,barW*2,barH);
        ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';ctx.fillText(names[i]+' '+mastery[i]+'/20',35,y+20);
      }

      var cx=W/2+80,cy=H/2+30,r=100;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var ri=1;ri<=4;ri++){ctx.beginPath();ctx.arc(cx,cy,r*ri/4,0,Math.PI*2);ctx.stroke();}
      for(var ai=0;ai<3;ai++){
        var angle=ai*(Math.PI*2/3)-Math.PI/2;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        var lx=cx+Math.cos(angle)*(r+15)-20,ly=cy+Math.sin(angle)*(r+15)+4;
        ctx.fillText(names[ai],lx,ly);
      }
      ctx.beginPath();ctx.fillStyle='rgba(74,125,255,0.2)';ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;
      for(var pi=0;pi<3;pi++){
        var pa=pi*(Math.PI*2/3)-Math.PI/2;
        var pr=mastery[pi]/20*r;
        var px=cx+Math.cos(pa)*pr,py=cy+Math.sin(pa)*pr;
        if(pi===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();ctx.fill();ctx.stroke();
      markV20Feature('pedal');
    }

    buildPedalTabs();showPedalTips();drawPedalCanvas();
  });
}

// ================ 3. COMPOSITION WORKSHOP ================
function buildComposeWorkshopUI(){
  var SCALE=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'];
  var DURATIONS=[{label:'1/4',val:0.25},{label:'1/2',val:0.5},{label:'1',val:1.0},{label:'2',val:2.0}];

  makeV20Modal('compose-modal','🎶 작곡 워크솝',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8마디 멜로디를 작곡하세요. 음표를 배치하고 재생합니다.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
        '<select id="cp-note" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          SCALE.map(function(n){return '<option value="'+n+'">'+n+'</option>'}).join('')+
        '</select>'+
        '<select id="cp-dur" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          DURATIONS.map(function(d){return '<option value="'+d.val+'">'+d.label+'박</option>'}).join('')+
        '</select>'+
        '<button id="cp-add" style="padding:4px 10px;border-radius:4px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">추가</button>'+
        '<button id="cp-undo" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">취소</button>'+
        '<button id="cp-clear" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">초기화</button>'+
        '<button id="cp-play" style="padding:4px 10px;border-radius:4px;border:1px solid var(--green);background:rgba(34,197,94,0.2);color:var(--green);font-size:11px;cursor:pointer">▶ 재생</button>'+
        '<button id="cp-save" style="padding:4px 10px;border-radius:4px;border:1px solid var(--purple);background:rgba(168,85,247,0.2);color:var(--purple);font-size:11px;cursor:pointer">저장</button>'+
        '<button id="cp-random" style="padding:4px 10px;border-radius:4px;border:1px solid var(--cyan);background:rgba(6,182,212,0.2);color:var(--cyan);font-size:11px;cursor:pointer">랜덤</button>'+
      '</div>'+
      '<canvas id="cp-canvas" width="600" height="360" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="cp-saved" style="margin-top:8px;font-size:11px;color:var(--text2)"></div>';

    var melody=ls20Get('compose_melody',[]);
    var saved=ls20Get('compose_saved',[]);

    function noteToFreq(name){
      var notes={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};
      var n=name.charAt(0),oct=parseInt(name.charAt(name.length-1));
      var sharp=name.indexOf('#')>=0?1:0;
      var semitone=(notes[n]||0)+sharp+(oct+1)*12;
      return 440*Math.pow(2,(semitone-69)/12);
    }

    function playMelody(){
      if(!sfx20||melody.length===0) return;
      if(sfx20.state==='suspended') sfx20.resume();
      playSFX20('compose_play');
      var time=sfx20.currentTime+0.1;
      melody.forEach(function(m){
        var g=sfx20.createGain(),o=sfx20.createOscillator();
        o.connect(g);g.connect(sfx20.destination);o.type='triangle';
        o.frequency.setValueAtTime(noteToFreq(m.note),time);
        g.gain.setValueAtTime(0.06,time);g.gain.exponentialRampToValueAtTime(0.001,time+m.dur*0.9);
        o.start(time);o.stop(time+m.dur);
        time+=m.dur;
      });
    }

    function drawComposeCanvas(){
      var c=document.getElementById('cp-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('오선보 - '+melody.length+'음표',20,25);

      var staffY=80,lineGap=12;
      ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
      for(var l=0;l<5;l++){
        ctx.beginPath();ctx.moveTo(30,staffY+l*lineGap);ctx.lineTo(W-20,staffY+l*lineGap);ctx.stroke();
      }

      var noteYMap={'G5':staffY-lineGap,'F5':staffY-lineGap/2,'E5':staffY,'D5':staffY+lineGap/2,'C5':staffY+lineGap,'B4':staffY+lineGap*1.5,'A4':staffY+lineGap*2,'G4':staffY+lineGap*2.5,'F4':staffY+lineGap*3,'E4':staffY+lineGap*3.5,'D4':staffY+lineGap*4,'C4':staffY+lineGap*4.5};
      var totalDur=0;melody.forEach(function(m){totalDur+=m.dur;});
      var maxDur=Math.max(totalDur,8);
      var xScale=(W-80)/maxDur;
      var curX=50;
      melody.forEach(function(m,i){
        var ny=noteYMap[m.note]||(staffY+lineGap*2);
        var nw=Math.max(m.dur*xScale,10);
        var colors=['#3b82f6','#22c55e','#eab308','#ef4444','#a855f7','#06b6d4','#f97316','#ec4899'];
        ctx.fillStyle=colors[i%colors.length];
        ctx.beginPath();ctx.ellipse(curX+nw/2,ny,Math.min(nw/2,8),5,0,0,Math.PI*2);ctx.fill();
        if(m.dur>=1){ctx.fillRect(curX+nw/2+5,ny-20,2,20);}
        else{ctx.fillRect(curX+nw/2+5,ny-25,2,25);if(m.dur<=0.25){ctx.fillRect(curX+nw/2+5,ny-25,8,2);}}
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.fillText(m.note,curX,ny+18);
        curX+=nw+4;
      });

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+melody.length+'음표 | '+totalDur.toFixed(1)+'박 | 저장된 곡: '+saved.length+'개',20,H-15);

      if(saved.length>0){
        ctx.fillStyle='#a855f7';ctx.font='bold 11px sans-serif';
        ctx.fillText('저장된 작품',20,H-80);
        saved.slice(-5).forEach(function(s,i){
          ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
          ctx.fillText((i+1)+'. '+s.name+' ('+s.notes+'음, '+s.date+')',20,H-65+i*13);
        });
      }
      markV20Feature('compose');
    }

    document.getElementById('cp-add').addEventListener('click',function(){
      if(melody.length>=32) return;
      var note=document.getElementById('cp-note').value;
      var dur=parseFloat(document.getElementById('cp-dur').value);
      melody.push({note:note,dur:dur});
      ls20Set('compose_melody',melody);
      playSFX20('compose_note');drawComposeCanvas();
    });
    document.getElementById('cp-undo').addEventListener('click',function(){
      if(melody.length>0){melody.pop();ls20Set('compose_melody',melody);drawComposeCanvas();}
    });
    document.getElementById('cp-clear').addEventListener('click',function(){
      melody=[];ls20Set('compose_melody',melody);drawComposeCanvas();
    });
    document.getElementById('cp-play').addEventListener('click',function(){playMelody();});
    document.getElementById('cp-save').addEventListener('click',function(){
      if(melody.length===0) return;
      saved.push({name:'작품 #'+(saved.length+1),notes:melody.length,date:new Date().toISOString().slice(0,10),melody:melody.slice()});
      if(saved.length>10) saved=saved.slice(-10);
      ls20Set('compose_saved',saved);drawComposeCanvas();playSFX20('compose_play');
    });
    document.getElementById('cp-random').addEventListener('click',function(){
      melody=[];
      for(var i=0;i<8;i++){
        melody.push({note:SCALE[Math.floor(Math.random()*SCALE.length)],dur:DURATIONS[Math.floor(Math.random()*DURATIONS.length)].val});
      }
      ls20Set('compose_melody',melody);drawComposeCanvas();playSFX20('compose_note');
    });
    drawComposeCanvas();
  });
}

// ================ 4. PIANO CARE GUIDE ================
function buildPianoCareUI(){
  var CARE_ITEMS=[
    {cat:'조율',items:[
      {name:'정기 조율 (6개월)',desc:'전문 조율사에게 연 2회 조율',icon:'🔧'},
      {name:'신품 피아노 특별 조율',desc:'구입 후 1년간 3~4회 조율 필요',icon:'⭐'},
      {name:'음정 체크',desc:'중앙 A 기준음 440Hz 확인',icon:'🎵'}
    ]},
    {cat:'환경',items:[
      {name:'온도 관리',desc:'실내 20~22°C 유지, 급격한 변화 금지',icon:'🌡️'},
      {name:'습도 관리',desc:'45~70% 유지, 건조/과습 모두 해로움',icon:'💧'},
      {name:'직사광선 차단',desc:'외장 변색 및 내부 부품 손상 방지',icon:'☀️'}
    ]},
    {cat:'청소',items:[
      {name:'건반 닦기',desc:'부드러운 천으로 지문 제거, 세제 미사용',icon:'🧹'},
      {name:'외장 관리',desc:'전용 표면 클리너로 광택 유지',icon:'✨'},
      {name:'내부 청소',desc:'조율사 방문 시 먼지 제거 요청',icon:'🧹'}
    ]},
    {cat:'사용',items:[
      {name:'뛰껴 닫기',desc:'미사용 시 뛰껴 닫아 먼지/습기 차단',icon:'🚪'},
      {name:'손 씨고 연주',desc:'손의 유분과 땀이 건반에 전달 방지',icon:'👋'},
      {name:'무거운 물건 금지',desc:'피아노 위에 물컵/화병 올려놓지 않기',icon:'⛔'}
    ]}
  ];

  makeV20Modal('care-modal','🎹 피아노 관리 가이드',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">12항목 피아노 관리 체크리스트. 완료 항목을 체크하세요.</p>'+
      '<div id="care-list" style="margin-bottom:12px"></div>'+
      '<canvas id="care-canvas" width="560" height="340" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var checked=ls20Get('care_checked',{});

    function buildCareList(){
      var list=document.getElementById('care-list');list.innerHTML='';
      CARE_ITEMS.forEach(function(cat){
        var catDiv=document.createElement('div');
        catDiv.style.cssText='margin-bottom:8px';
        catDiv.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid var(--border)">'+cat.cat+'</div>';
        cat.items.forEach(function(item){
          var row=document.createElement('div');
          var key=cat.cat+'-'+item.name;
          var isChecked=!!checked[key];
          row.style.cssText='display:flex;align-items:center;gap:8px;padding:5px 8px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer;transition:0.2s';
          if(isChecked) row.style.borderColor='var(--green)';
          row.innerHTML='<span style="font-size:14px">'+item.icon+'</span><div style="flex:1"><div style="font-size:11px;font-weight:600;'+(isChecked?'text-decoration:line-through;color:var(--green)':'')+'">'+item.name+'</div><div style="font-size:9px;color:var(--text2)">'+item.desc+'</div></div><span style="font-size:14px">'+(isChecked?'✅':'⬜')+'</span>';
          row.addEventListener('click',function(){
            checked[key]=!checked[key];
            ls20Set('care_checked',checked);
            buildCareList();drawCareCanvas();playSFX20('care_check');
          });
          catDiv.appendChild(row);
        });
        list.appendChild(catDiv);
      });
    }

    function drawCareCanvas(){
      var c=document.getElementById('care-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('피아노 관리 현황',20,25);

      var totalItems=0,checkedCount=0;
      CARE_ITEMS.forEach(function(cat){cat.items.forEach(function(item){totalItems++;if(checked[cat.cat+'-'+item.name])checkedCount++;});});
      var pct=totalItems>0?Math.round(checkedCount/totalItems*100):0;
      var grade=pct>=90?'S':pct>=75?'A':pct>=50?'B':pct>=25?'C':'D';

      var cx=W/2,cy=130,r=70;
      ctx.lineWidth=12;ctx.lineCap='round';
      ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=pct>=75?'#22c55e':pct>=50?'#eab308':'#ef4444';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct/100);ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 22px sans-serif';ctx.textAlign='center';
      ctx.fillText(pct+'%',cx,cy+5);
      ctx.font='11px sans-serif';ctx.fillStyle='#8892a8';ctx.fillText(checkedCount+'/'+totalItems+' 완료',cx,cy+22);
      ctx.fillStyle='#eab308';ctx.font='bold 16px sans-serif';ctx.fillText(grade+' 등급',cx,cy+42);ctx.textAlign='left';

      var catColors=['#3b82f6','#22c55e','#eab308','#a855f7'];
      var barY=H-100,barH=20,barW=(W-80)/4;
      CARE_ITEMS.forEach(function(cat,i){
        var total=cat.items.length,done=0;
        cat.items.forEach(function(it){if(checked[cat.cat+'-'+it.name])done++;});
        var x=30+i*(barW+10);
        ctx.fillStyle='#1a2036';ctx.fillRect(x,barY,barW,barH);
        ctx.fillStyle=catColors[i];ctx.fillRect(x,barY,barW*done/total,barH);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(x,barY,barW,barH);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(cat.cat+' '+done+'/'+total,x,barY+barH+14);
      });
      markV20Feature('care');
    }

    buildCareList();drawCareCanvas();
  });
}

// ================ 5. PERFORMANCE ANXIETY COACH ================
function buildAnxietyCoachUI(){
  var EXERCISES=[
    {name:'복식 호흡 (4-7-8)',desc:'4초 들이마시고, 7초 참고, 8초 내쉼기',inSec:4,holdSec:7,outSec:8},
    {name:'상자 호흡 (Box)',desc:'4초 들이쉬고, 4초 참고, 4초 내쉼고, 4초 참기',inSec:4,holdSec:4,outSec:4},
    {name:'긴 날숨',desc:'3초 들이마시고, 6초 천천히 내쉼기',inSec:3,holdSec:0,outSec:6},
    {name:'에너지 호흡',desc:'2초 빠르게 들이쉬고, 2초 빠르게 내쉼기',inSec:2,holdSec:0,outSec:2}
  ];
  var TIPS=[
    '무대 전 시각화: 완벽한 연주 장면을 머릿속에 그리기',
    '점진적 노출: 가족 → 친구 → 소모임 → 공연장',
    '실수 허용: 완벽이 아닌 음악성을 목표로',
    '근육 이완: 어깨/목/손/팔 풍차 긴장한 후 풀기',
    '긍정 자기암시: &quot;나는 충분히 준비됐다&quot;',
    '무대 전 루틴: 도착→30분 전 워밍업→호흡→시작',
    '관객과 연결: 한 사람에게 연주하는 느낌으로',
    '복구 능력: 실수 후 침착하게 다음 프레이즈로',
    '연습 = 공연: 연습도 공연처럼, 공연도 연습처럼',
    '마음챙기기: 연주 후 좋았던 점 3가지 적기'
  ];

  makeV20Modal('anxiety-modal','🧘 공연 불안 극복 코치',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">호흡법 + 10가지 무대 팀. 호흡 타이머로 연습하세요.</p>'+
      '<div id="anx-ex-btns" style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap"></div>'+
      '<canvas id="anx-canvas" width="580" height="360" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="anx-tips" style="margin-top:10px"></div>';

    var selEx=0,timerRunning=false,timerPhase='idle',timerSec=0,timerId=null,sessions=ls20Get('anxiety_sessions',0);

    function buildExBtns(){
      var btns=document.getElementById('anx-ex-btns');btns.innerHTML='';
      EXERCISES.forEach(function(ex,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:5px 10px;border-radius:6px;border:1px solid '+(i===selEx?'var(--accent)':'var(--border)')+';background:'+(i===selEx?'var(--accent)':'var(--surface2)')+';color:'+(i===selEx?'white':'var(--text)')+';font-size:10px;cursor:pointer';
        btn.textContent=ex.name;
        btn.addEventListener('click',function(){selEx=i;buildExBtns();drawAnxCanvas();});
        btns.appendChild(btn);
      });
      var startBtn=document.createElement('button');
      startBtn.style.cssText='padding:5px 10px;border-radius:6px;border:1px solid var(--green);background:rgba(34,197,94,0.2);color:var(--green);font-size:10px;cursor:pointer';
      startBtn.textContent=timerRunning?'⏹ 정지':'▶ 시작';
      startBtn.addEventListener('click',function(){
        if(timerRunning){clearInterval(timerId);timerRunning=false;timerPhase='idle';timerSec=0;}
        else{timerRunning=true;timerPhase='in';timerSec=0;runBreathTimer();}
        buildExBtns();drawAnxCanvas();
      });
      btns.appendChild(startBtn);
    }

    function runBreathTimer(){
      var ex=EXERCISES[selEx];
      timerId=setInterval(function(){
        timerSec++;
        var total=ex.inSec+ex.holdSec+ex.outSec;
        var cycle=timerSec%total;
        if(cycle<ex.inSec){timerPhase='in';if(cycle===0)playSFX20('breathe_in');}
        else if(cycle<ex.inSec+ex.holdSec){timerPhase='hold';}
        else{timerPhase='out';if(cycle===ex.inSec+ex.holdSec)playSFX20('breathe_out');}
        if(timerSec>=total*5){
          clearInterval(timerId);timerRunning=false;timerPhase='idle';timerSec=0;
          sessions++;ls20Set('anxiety_sessions',sessions);
          buildExBtns();
        }
        drawAnxCanvas();
      },1000);
    }

    function drawAnxCanvas(){
      var c=document.getElementById('anx-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('호흡 트레이너 - '+EXERCISES[selEx].name,20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(EXERCISES[selEx].desc,20,42);
      ctx.fillText('완료 세션: '+sessions+'회',20,58);

      var cx=W/2,cy=180,r=80;
      var phaseColor=timerPhase==='in'?'#3b82f6':timerPhase==='hold'?'#eab308':timerPhase==='out'?'#22c55e':'#1e2640';
      var phaseText=timerPhase==='in'?'들이쉬기':timerPhase==='hold'?'참기':timerPhase==='out'?'내쉼기':'대기';

      var ex=EXERCISES[selEx];
      var total=ex.inSec+ex.holdSec+ex.outSec;
      var cycle=timerSec%total;
      var progress=0;
      if(timerPhase==='in') progress=cycle/ex.inSec;
      else if(timerPhase==='hold') progress=(cycle-ex.inSec)/ex.holdSec;
      else if(timerPhase==='out') progress=(cycle-ex.inSec-ex.holdSec)/ex.outSec;

      var breathR=r*(timerPhase==='in'?(0.5+progress*0.5):timerPhase==='hold'?1.0:timerPhase==='out'?(1.0-progress*0.5):0.5);
      ctx.beginPath();ctx.arc(cx,cy,breathR,0,Math.PI*2);ctx.fillStyle=phaseColor+'40';ctx.fill();
      ctx.strokeStyle=phaseColor;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();

      ctx.fillStyle='#e8ecf4';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(phaseText,cx,cy-5);
      ctx.font='24px sans-serif';ctx.fillText(timerRunning?Math.ceil(timerSec)+'s':'--',cx,cy+25);
      ctx.textAlign='left';

      var roundNum=timerRunning?Math.floor(timerSec/total)+1:0;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.fillText('라운드: '+roundNum+'/5',20,H-20);
      markV20Feature('anxiety');
    }

    function showTips(){
      var div=document.getElementById('anx-tips');
      div.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:6px">💡 무대 불안 극복 10가지 팀</div>';
      TIPS.forEach(function(tip,i){
        div.innerHTML+='<div style="font-size:10px;color:var(--text2);padding:3px 0;border-bottom:1px solid var(--border)">'+(i+1)+'. '+tip+'</div>';
      });
    }

    buildExBtns();drawAnxCanvas();showTips();
  });
}

// ================ 6. MUSIC THEORY MINDMAP ================
function buildTheoryMindmapUI(){
  var BRANCHES=[
    {name:'음계/조성',color:'#3b82f6',topics:[
      {t:'장음계',d:'W-W-H-W-W-W-H (C D E F G A B C)'},
      {t:'단음계',d:'자연단음계: W-H-W-W-H-W-W'},
      {t:'반음계',d:'12반음 순차적 상행'},
      {t:'오음음계',d:'장음계에서 4도/7도 제거 (5음)'}
    ]},
    {name:'화성/코드',color:'#22c55e',topics:[
      {t:'장 3화음',d:'Root + M3 + P5 (밝고 안정적)'},
      {t:'단 3화음',d:'Root + m3 + P5 (슬프고 어두운)'},
      {t:'7화음',d:'3화음 + 7도 음정 추가'},
      {t:'코드 진행',d:'I-IV-V-I, ii-V-I, I-vi-IV-V'}
    ]},
    {name:'리듬',color:'#eab308',topics:[
      {t:'박자',d:'2/4, 3/4, 4/4, 6/8 박자표'},
      {t:'음표 값',d:'온음표(4) > ♩(2) > ♪(1) > 8분(0.5)'},
      {t:'싱코페이션',d:'약박에 강세를 주는 기법'},
      {t:'폴리리듬',d:'두 가지 이상의 리듬 동시 연주'}
    ]},
    {name:'음정',color:'#a855f7',topics:[
      {t:'완전음정',d:'1도(Unison), 4도, 5도, 8도'},
      {t:'장/단음정',d:'장 2,3,6,7 / 단 2,3,6,7'},
      {t:'증/감음정',d:'완전음정±1반음'},
      {t:'트라이톤',d:'증4도 / 감5도 (불협화)'}
    ]},
    {name:'형식',color:'#ef4444',topics:[
      {t:'이부형식 (AB)',d:'A부-B부 대비 구조'},
      {t:'세부형식 (ABA)',d:'A-B-A′ 복귨 구조'},
      {t:'론도',d:'ABACA 반복 구조'},
      {t:'소나타',d:'제시부-발전부-재현부'}
    ]},
    {name:'표현',color:'#06b6d4',topics:[
      {t:'다이나믹',d:'pp-p-mp-mf-f-ff 셀기 변화'},
      {t:'템포',d:'Largo~Presto 빠르기 지시'},
      {t:'아티큐레이션',d:'Legato, Staccato, Accent, Marcato'},
      {t:'페달링',d:'Ped., *, una corda, tre corde'}
    ]}
  ];

  makeV20Modal('theory-modal','🧠 음악이론 마인드맵',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">6가지 영역의 핵심 음악이론을 탐색하세요.</p>'+
      '<div id="th-branch-btns" style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap"></div>'+
      '<canvas id="th-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="th-detail" style="margin-top:8px"></div>';

    var selBranch=0;
    var learned=ls20Get('theory_learned',{});

    function buildBranchBtns(){
      var btns=document.getElementById('th-branch-btns');btns.innerHTML='';
      BRANCHES.forEach(function(br,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:5px 10px;border-radius:6px;border:1px solid '+(i===selBranch?br.color:'var(--border)')+';background:'+(i===selBranch?br.color+'30':'var(--surface2)')+';color:'+(i===selBranch?br.color:'var(--text)')+';font-size:10px;cursor:pointer';
        btn.textContent=br.name;
        btn.addEventListener('click',function(){selBranch=i;buildBranchBtns();drawTheoryCanvas();showDetail();playSFX20('theory_open');});
        btns.appendChild(btn);
      });
    }

    function showDetail(){
      var div=document.getElementById('th-detail');
      var br=BRANCHES[selBranch];
      div.innerHTML='';
      br.topics.forEach(function(topic){
        var key=selBranch+'-'+topic.t;
        var isLearned=!!learned[key];
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--surface2);border:1px solid '+(isLearned?br.color:'var(--border)')+';border-radius:6px;margin-bottom:4px;cursor:pointer';
        row.innerHTML='<div style="flex:1"><div style="font-size:12px;font-weight:600;color:'+br.color+'">'+topic.t+'</div><div style="font-size:10px;color:var(--text2)">'+topic.d+'</div></div><span style="font-size:13px">'+(isLearned?'✅':'⬜')+'</span>';
        row.addEventListener('click',function(){
          learned[key]=!learned[key];ls20Set('theory_learned',learned);
          buildBranchBtns();drawTheoryCanvas();showDetail();playSFX20('theory_open');
        });
        div.appendChild(row);
      });
    }

    function drawTheoryCanvas(){
      var c=document.getElementById('th-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('음악이론 마인드맵',20,25);

      var cx=W/2,cy=H/2+10,outerR=140;
      ctx.fillStyle='#e8ecf4';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText('음악이론',cx,cy+4);ctx.textAlign='left';

      BRANCHES.forEach(function(br,i){
        var angle=i*(Math.PI*2/6)-Math.PI/2;
        var bx=cx+Math.cos(angle)*outerR,by=cy+Math.sin(angle)*outerR;

        ctx.strokeStyle=i===selBranch?br.color:'#1e2640';ctx.lineWidth=i===selBranch?3:1;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(bx,by);ctx.stroke();

        var brR=i===selBranch?28:22;
        ctx.beginPath();ctx.arc(bx,by,brR,0,Math.PI*2);
        ctx.fillStyle=i===selBranch?br.color+'40':'#1a2036';ctx.fill();
        ctx.strokeStyle=br.color;ctx.lineWidth=2;ctx.stroke();

        ctx.fillStyle=br.color;ctx.font=(i===selBranch?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';
        ctx.fillText(br.name,bx,by+4);ctx.textAlign='left';

        var learnedCount=0;
        br.topics.forEach(function(t){if(learned[i+'-'+t.t])learnedCount++;});
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(learnedCount+'/'+br.topics.length,bx,by+16);ctx.textAlign='left';

        if(i===selBranch){
          br.topics.forEach(function(t,ti){
            var ta=angle+(ti-1.5)*(Math.PI/12);
            var tx=bx+Math.cos(ta)*55,ty=by+Math.sin(ta)*55;
            ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(tx,ty);ctx.strokeStyle=br.color+'60';ctx.lineWidth=1;ctx.stroke();
            ctx.beginPath();ctx.arc(tx,ty,4,0,Math.PI*2);ctx.fillStyle=learned[i+'-'+t.t]?br.color:'#1a2036';ctx.fill();
            ctx.strokeStyle=br.color;ctx.lineWidth=1;ctx.stroke();
          });
        }
      });

      var totalTopics=0,totalLearned=0;
      BRANCHES.forEach(function(br,i){br.topics.forEach(function(t){totalTopics++;if(learned[i+'-'+t.t])totalLearned++;});});
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('학습 진도: '+totalLearned+'/'+totalTopics+' ('+Math.round(totalLearned/totalTopics*100)+'%)',20,H-15);
      markV20Feature('theory');
    }

    buildBranchBtns();drawTheoryCanvas();showDetail();
  });
}

// ================ 7. DAILY SKILL ASSESSMENT ================
function buildSkillAssessUI(){
  var SKILLS=['정확도','속도','표현력','시보드리딩','화성감각','리듬감'];

  makeV20Modal('skill-modal','📊 일일 스킬 어세스먼트',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">6가지 스킬을 자가 평가하고 성장 추이를 추적합니다.</p>'+
      '<div id="sk-sliders" style="margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:6px;margin-bottom:10px">'+
        '<button id="sk-save" style="padding:5px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">오늘 평가 저장</button>'+
        '<button id="sk-reset" style="padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">초기화</button>'+
      '</div>'+
      '<canvas id="sk-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var history=ls20Get('skill_history',[]);
    var current=[5,5,5,5,5,5];

    function buildSliders(){
      var div=document.getElementById('sk-sliders');div.innerHTML='';
      var colors=['#3b82f6','#22c55e','#eab308','#a855f7','#ef4444','#06b6d4'];
      SKILLS.forEach(function(skill,i){
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:4px';
        row.innerHTML='<span style="font-size:11px;color:'+colors[i]+';width:80px;flex-shrink:0">'+skill+'</span>'+
          '<input type="range" min="1" max="10" value="'+current[i]+'" data-idx="'+i+'" style="flex:1;accent-color:'+colors[i]+'">'+
          '<span class="sk-val" style="font-size:12px;font-weight:700;color:'+colors[i]+';width:20px">'+current[i]+'</span>';
        var slider=row.querySelector('input');
        slider.addEventListener('input',function(){current[parseInt(this.dataset.idx)]=parseInt(this.value);this.nextElementSibling.textContent=this.value;drawSkillCanvas();});
        div.appendChild(row);
      });
    }

    function drawSkillCanvas(){
      var c=document.getElementById('sk-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('스킬 레이더 + 성장 추이',20,25);

      var cx=180,cy=200,r=110;
      var colors=['#3b82f6','#22c55e','#eab308','#a855f7','#ef4444','#06b6d4'];
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var ri=1;ri<=5;ri++){ctx.beginPath();ctx.arc(cx,cy,r*ri/5,0,Math.PI*2);ctx.stroke();}
      for(var ai=0;ai<6;ai++){
        var angle=ai*(Math.PI*2/6)-Math.PI/2;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
        ctx.fillStyle=colors[ai];ctx.font='10px sans-serif';
        var lx=cx+Math.cos(angle)*(r+18)-20,ly=cy+Math.sin(angle)*(r+18)+4;
        ctx.fillText(SKILLS[ai],lx,ly);
      }

      if(history.length>0){
        var prev=history[history.length-1].scores;
        ctx.beginPath();ctx.fillStyle='rgba(168,85,247,0.1)';ctx.strokeStyle='#a855f780';ctx.lineWidth=1;
        for(var pi=0;pi<6;pi++){
          var pa=pi*(Math.PI*2/6)-Math.PI/2;
          var pr=prev[pi]/10*r;
          if(pi===0) ctx.moveTo(cx+Math.cos(pa)*pr,cy+Math.sin(pa)*pr);
          else ctx.lineTo(cx+Math.cos(pa)*pr,cy+Math.sin(pa)*pr);
        }
        ctx.closePath();ctx.fill();ctx.stroke();
      }

      ctx.beginPath();ctx.fillStyle='rgba(74,125,255,0.2)';ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;
      for(var si=0;si<6;si++){
        var sa=si*(Math.PI*2/6)-Math.PI/2;
        var sr=current[si]/10*r;
        if(si===0) ctx.moveTo(cx+Math.cos(sa)*sr,cy+Math.sin(sa)*sr);
        else ctx.lineTo(cx+Math.cos(sa)*sr,cy+Math.sin(sa)*sr);
      }
      ctx.closePath();ctx.fill();ctx.stroke();

      var avg=current.reduce(function(a,b){return a+b},0)/6;
      var grade=avg>=9?'S':avg>=7?'A':avg>=5?'B':avg>=3?'C':'D';
      ctx.fillStyle='#eab308';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(grade,cx,cy);ctx.font='10px sans-serif';ctx.fillStyle='#8892a8';
      ctx.fillText('평균 '+avg.toFixed(1),cx,cy+18);ctx.textAlign='left';

      if(history.length>1){
        var lineX=380,lineW=W-lineX-30,lineH=180,lineY=60;
        ctx.fillStyle='#4a7dff';ctx.font='11px sans-serif';ctx.fillText('성장 추이',lineX,lineY-10);
        ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(lineX,lineY);ctx.lineTo(lineX,lineY+lineH);ctx.lineTo(lineX+lineW,lineY+lineH);ctx.stroke();
        var hLen=Math.min(history.length,14);
        var step=lineW/(hLen-1);
        colors.forEach(function(col,ci){
          ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();
          for(var hi=0;hi<hLen;hi++){
            var entry=history[history.length-hLen+hi];
            var hx=lineX+hi*step,hy=lineY+lineH-(entry.scores[ci]/10)*lineH;
            if(hi===0) ctx.moveTo(hx,hy); else ctx.lineTo(hx,hy);
          }
          ctx.stroke();
        });
      }

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('기록: '+history.length+'일',20,H-15);
      markV20Feature('skill');
    }

    document.getElementById('sk-save').addEventListener('click',function(){
      history.push({scores:current.slice(),date:new Date().toISOString().slice(0,10)});
      if(history.length>30) history=history.slice(-30);
      ls20Set('skill_history',history);
      drawSkillCanvas();playSFX20('skill_assess');
    });
    document.getElementById('sk-reset').addEventListener('click',function(){
      current=[5,5,5,5,5,5];buildSliders();drawSkillCanvas();
    });

    buildSliders();drawSkillCanvas();
  });
}

// ================ 8. PIANO HISTORY TIMELINE ================
function buildPianoHistoryUI(){
  var MILESTONES=[
    {year:1700,title:'크리스토포리 피아노포르테',desc:'바르톨로메오 크리스토포리가 최초의 피아노 발명. 강약 조절 가능한 건반악기의 탄생.'},
    {year:1726,title:'바흐의 피아노 평가',desc:'J.S. Bach가 질버만의 피아노를 시연하고 격려. 피아노 발전의 전환점.'},
    {year:1770,title:'모차르트 시대',desc:'W.A. Mozart가 피아노 협주곡을 작곡하며 악기의 위상 높임.'},
    {year:1800,title:'베토벤 혁명',desc:'베토벤이 32곡 소나타로 피아노 문학을 확장. 강건 구조의 피아노 필요성 부각.'},
    {year:1830,title:'낭만주의 황금기',desc:'쇼팡/리스트/슈만이 피아노를 감정표현의 주역으로. 그랜드 피아노 등장.'},
    {year:1853,title:'스타인웨이 창업',desc:'Henry Steinway가 뉴욕에서 피아노 공장 설립. 현대 그랜드 피아노의 기초.'},
    {year:1880,title:'자동 피아노 등장',desc:'플레이어 피아노 발명. 천공론 방식으로 자동 연주.'},
    {year:1900,title:'드뷔시 인상주의',desc:'드뷔시가 새로운 화성과 음색으로 피아노 음악을 혁신.'},
    {year:1935,title:'전자 피아노 탄생',desc:'NEO-Bechstein(1929)부터 전기 증폭 피아노 실험. 전자 악기 시대 열림.'},
    {year:1964,title:'Rhodes/Wurlitzer',desc:'Fender Rhodes 전기 피아노가 재즈/팝에 혁명. 독특한 음색으로 인기.'},
    {year:1983,title:'MIDI 표준 채택',desc:'MIDI 1.0 표준 발표. 디지털 악기 간 통신 통일. 신디사이저 붐.'},
    {year:2020,title:'AI 피아노 학습',desc:'Simply Piano/Flowkey/Synthesia 등 AI 기반 피아노 학습 앱 번성. 피아노 마스터 등장!'}
  ];

  makeV20Modal('history-modal','🏛️ 피아노 역사 연표',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">1700년부터 현재까지 피아노 300년 역사를 탐색하세요.</p>'+
      '<canvas id="ht-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="ht-detail" style="margin-top:8px;font-size:11px;color:var(--text2)"></div>';

    var selMilestone=0;
    var visited=ls20Get('history_visited',{});

    function drawHistoryCanvas(){
      var c=document.getElementById('ht-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('피아노 300년 역사',20,25);

      var timelineY=H/2;
      ctx.strokeStyle='#2a3050';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(30,timelineY);ctx.lineTo(W-30,timelineY);ctx.stroke();

      var minYear=1700,maxYear=2030;
      var range=maxYear-minYear;
      var lineW=W-80;

      MILESTONES.forEach(function(m,i){
        var x=40+((m.year-minYear)/range)*lineW;
        var above=i%2===0;
        var dy=above?-1:1;
        var dotR=i===selMilestone?8:5;
        var dotColor=visited[i]?'#22c55e':(i===selMilestone?'#eab308':'#4a7dff');

        ctx.strokeStyle=dotColor+'80';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(x,timelineY);ctx.lineTo(x,timelineY+dy*40);ctx.stroke();

        ctx.beginPath();ctx.arc(x,timelineY,dotR,0,Math.PI*2);
        ctx.fillStyle=dotColor;ctx.fill();

        ctx.fillStyle=i===selMilestone?'#e8ecf4':'#8892a8';
        ctx.font=(i===selMilestone?'bold ':'')+'9px sans-serif';ctx.textAlign='center';
        ctx.fillText(m.year+'',x,timelineY+dy*55);

        if(i===selMilestone){
          ctx.font='10px sans-serif';ctx.fillStyle='#e8ecf4';
          var titleLines=m.title.length>12?[m.title.slice(0,12),m.title.slice(12)]:[m.title];
          titleLines.forEach(function(line,li){ctx.fillText(line,x,timelineY+dy*(68+li*13));});
        }
        ctx.textAlign='left';
      });

      var sel=MILESTONES[selMilestone];
      ctx.fillStyle='var(--surface2,#1a2036)';
      var boxY=above?30:H-90;
      ctx.fillRect(20,boxY,W-40,60);
      ctx.strokeStyle='#4a7dff40';ctx.lineWidth=1;ctx.strokeRect(20,boxY,W-40,60);
      ctx.fillStyle='#eab308';ctx.font='bold 12px sans-serif';ctx.fillText(sel.year+' - '+sel.title,30,boxY+20);
      ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';
      var descWords=sel.desc.split('');
      var line='',lineY2=boxY+38;
      for(var wi=0;wi<descWords.length;wi++){
        var testLine=line+descWords[wi];
        if(ctx.measureText(testLine).width>W-80&&line.length>0){ctx.fillText(line,30,lineY2);lineY2+=14;line=descWords[wi];}
        else line=testLine;
      }
      ctx.fillText(line,30,lineY2);

      var visitedCount=Object.keys(visited).length;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('탐색: '+visitedCount+'/'+MILESTONES.length,20,H-10);
      markV20Feature('history');
    }

    var canvas=document.getElementById('ht-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var minYear=1700,maxYear=2030,range=maxYear-minYear,lineW=canvas.width-80;
      var timelineY=canvas.height/2;

      var closest=-1,closestDist=Infinity;
      MILESTONES.forEach(function(m,i){
        var x=40+((m.year-minYear)/range)*lineW;
        var dist=Math.abs(mx-x);
        if(dist<closestDist){closestDist=dist;closest=i;}
      });
      if(closest>=0&&closestDist<30){
        selMilestone=closest;
        visited[closest]=true;ls20Set('history_visited',visited);
        drawHistoryCanvas();playSFX20('theory_open');
      }
    });

    drawHistoryCanvas();
  });
}

// ================ QUIZ v11 (15 NEW QUESTIONS, 150->165) ================
function buildQuizV11UI(){
  var QUESTIONS=[
    {q:'쇼팡의 노턴 Op.9 No.2는 어떤 조성으로 쓴어졌나요?',a:['내림마장조','올림마장조','내림단조','올림단조'],c:0},
    {q:'MIDI 표준에서 벨로시티 값의 범위는?',a:['0-127','0-255','1-100','0-1000'],c:0},
    {q:'피아노의 서스테인 페달은 어떤 발로 밟나요?',a:['오른발','왼발','양발','어떤 발이든'],c:0},
    {q:'클래식 소나타의 일반적인 구성은?',a:['제시-발전-재현','서론-본론-결론','A-B-A-B','도입-전개-절정-결말'],c:0},
    {q:'센자 로비치(♯/♭) 없이 연주할 수 있는 장음계는?',a:['C 장조','G 장조','F 장조','D 장조'],c:0},
    {q:'호모포니(homophony)란 무엇인가요?',a:['멜로디+반주','여러 멜로디 동시','단선율 멜로디','무조성 음악'],c:0},
    {q:'Rubato의 의미는?',a:['템포를 자유롭게','점점 빠르게','점점 느리게','처음 빠르기로'],c:0},
    {q:'평균율(Equal Temperament)에서 반음의 주파수 비율은?',a:['2의 12제곱근','1.5','2','12의 제곱근'],c:0},
    {q:'그랜드 피아노의 건반 수는 보통 몇 개인가요?',a:['88개','76개','61개','108개'],c:0},
    {q:'ff (포르티시모)의 의미는?',a:['매우 세게','보통 세기로','약간 세게','가능한 한 세게'],c:0},
    {q:'피아노의 조율 기준음 A4의 표준 주파수는?',a:['440Hz','432Hz','450Hz','420Hz'],c:0},
    {q:'아르페지오(arpeggio)란?',a:['코드 음을 순차적으로 연주','코드를 동시에 연주','점점 세게','점점 여리게'],c:0},
    {q:'트릴(trill)은 어떤 연주 기법인가요?',a:['두 음을 빠르게 번갈아','한 음을 길게 유지','음을 튜겨 끊어','여러 음을 동시에'],c:0},
    {q:'피아노 3중주는 어떤 편성인가요?',a:['피아노 3대+오케스트라','피아노+바이올린+첼로','피아노 3대','피아노+공+클라리넷'],c:0},
    {q:'Coda (코다) 기호의 의미는?',a:['곡의 끝부분으로 이동','처음부터 반복','점점 빠르게','점점 여리게'],c:0}
  ];

  makeV20Modal('quiz11-modal','🧠 피아노 퀸즈 v11',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">15문항 피아노 지식 퀸즈. 전문적인 음악이론/역사 문제!</p>'+
      '<div id="q11-area" style="margin-bottom:10px"></div>'+
      '<canvas id="q11-canvas" width="560" height="300" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var qIdx=0,score=0,answered=false;
    var stats=ls20Get('quiz11_stats',{total:0,correct:0,history:[]});

    function showQuestion(){
      var area=document.getElementById('q11-area');
      if(qIdx>=QUESTIONS.length){
        var pct=Math.round(score/QUESTIONS.length*100);
        var grade=pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=30?'C':'D';
        stats.history.push({score:score,total:QUESTIONS.length,date:new Date().toISOString().slice(0,10)});
        if(stats.history.length>20) stats.history=stats.history.slice(-20);
        ls20Set('quiz11_stats',stats);
        area.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:700;color:var(--accent)">퀸즈 완료!</div><div style="font-size:14px;margin-top:8px;color:var(--green)">'+score+'/'+QUESTIONS.length+' ('+grade+'등급)</div><button id="q11-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">다시 풀기</button></div>';
        document.getElementById('q11-retry').addEventListener('click',function(){qIdx=0;score=0;answered=false;showQuestion();drawQ11Canvas();});
        drawQ11Canvas();
        return;
      }
      var q=QUESTIONS[qIdx];
      area.innerHTML='<div style="font-size:12px;color:var(--accent);margin-bottom:4px">Q'+(qIdx+1)+'/'+QUESTIONS.length+'</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'+
        '<div id="q11-opts" style="display:flex;flex-direction:column;gap:6px"></div>';
      var opts=document.getElementById('q11-opts');
      q.a.forEach(function(a,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
        btn.textContent=a;
        btn.addEventListener('click',function(){
          if(answered) return;answered=true;
          stats.total++;
          if(i===q.c){score++;stats.correct++;btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';playSFX20('interval_correct');}
          else{btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';playSFX20('interval_wrong');
            Array.from(opts.children)[q.c].style.background='rgba(34,197,94,0.3)';Array.from(opts.children)[q.c].style.borderColor='var(--green)';
          }
          ls20Set('quiz11_stats',stats);drawQ11Canvas();
          setTimeout(function(){qIdx++;answered=false;showQuestion();},1200);
        });
        opts.appendChild(btn);
      });
    }

    function drawQ11Canvas(){
      var c=document.getElementById('q11-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('퀸즈 v11 성적',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+stats.total+'문 | 정답 '+stats.correct+'문 | 정답률 '+(stats.total>0?Math.round(stats.correct/stats.total*100):0)+'%',20,42);

      var cx=W/2,cy=150,r=60;
      var pct=stats.total>0?stats.correct/stats.total:0;
      ctx.lineWidth=10;ctx.lineCap='round';
      ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=pct>=0.7?'#22c55e':pct>=0.4?'#eab308':'#ef4444';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(pct*100)+'%',cx,cy+6);ctx.textAlign='left';

      if(stats.history.length>1){
        var hLen=Math.min(stats.history.length,10);
        var barW=Math.min(40,(W-80)/hLen);
        for(var i=0;i<hLen;i++){
          var entry=stats.history[stats.history.length-hLen+i];
          var x=30+i*(barW+4);
          var h=entry.score/entry.total*(H-250);
          ctx.fillStyle=entry.score/entry.total>=0.7?'rgba(34,197,94,0.5)':'rgba(239,68,68,0.3)';
          ctx.fillRect(x,H-30-h,barW,h);
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText(entry.score+'/'+entry.total,x,H-16);
        }
      }
    }

    showQuestion();drawQ11Canvas();
  });
}

// ================ 12 NEW ACHIEVEMENTS (168->180) ================
var V20_ACHIEVEMENTS=[
  {id:'v20_interval_master',name:'인터벌 마스터',desc:'청음 트레이너 30문 정답'},
  {id:'v20_pedal_pro',name:'페달 프로',desc:'페달 3종 모두 마스터리 10+'},
  {id:'v20_composer',name:'작곡가',desc:'작곡 워크솝에서 3곡 이상 저장'},
  {id:'v20_piano_care',name:'피아노 관리사',desc:'관리 가이드 12항목 전부 체크'},
  {id:'v20_calm_mind',name:'명상 마스터',desc:'호흡 연습 5세션 완료'},
  {id:'v20_theorist',name:'이론 학자',desc:'음악이론 24주제 중 12개 이상 학습'},
  {id:'v20_skill_tracker',name:'스킬 트래커',desc:'일일 스킬 평가 7일 기록'},
  {id:'v20_historian',name:'피아노 역사가',desc:'역사 연표 12개 마일스톤 모두 탐색'},
  {id:'v20_quiz11_s',name:'퀸즈 v11 S등급',desc:'퀸즈 v11에서 90% 이상 달성'},
  {id:'v20_quiz11_clear',name:'퀸즈 v11 클리어',desc:'퀸즈 v11 전문 풀기 완료'},
  {id:'v20_all_features',name:'v20 올클리어',desc:'v20 8가지 기능 모두 사용'},
  {id:'v20_172songs',name:'172곡 도전자',desc:'50곡 이상 연주 기록'}
];

function injectV20Achievements(){
  if(!window.app) window.app={};
  if(!app.achievements) app.achievements=[];
  V20_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(e){return e.id===a.id});
    if(!exists){
      a.unlocked=ls20Get('ach_'+a.id,false);
      app.achievements.push(a);
    }
  });
}

function unlockV20Achievement(id){
  if(ls20Get('ach_'+id,false)) return;
  ls20Set('ach_'+id,true);
  if(window.app&&app.achievements){
    app.achievements.forEach(function(a){if(a.id===id)a.unlocked=true;});
  }
  playSFX20('v20_achieve');
  var ach=V20_ACHIEVEMENTS.find(function(a){return a.id===id});
  if(ach){
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#eab308;color:#000;padding:8px 16px;border-radius:8px;font-size:12px;z-index:9999;animation:modalIn 0.3s';
    toast.textContent='🏆 업적 해금: '+ach.name;
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove()},3000);
  }
}

function checkV20Achievements(){
  var ivStats=ls20Get('interval_stats',{total:0,correct:0});
  if(ivStats.correct>=30) unlockV20Achievement('v20_interval_master');

  var pedMastery=ls20Get('pedal_mastery',[0,0,0]);
  if(pedMastery[0]>=10&&pedMastery[1]>=10&&pedMastery[2]>=10) unlockV20Achievement('v20_pedal_pro');

  var composeSaved=ls20Get('compose_saved',[]);
  if(composeSaved.length>=3) unlockV20Achievement('v20_composer');

  var careChecked=ls20Get('care_checked',{});
  if(Object.keys(careChecked).filter(function(k){return careChecked[k]}).length>=12) unlockV20Achievement('v20_piano_care');

  var anxSessions=ls20Get('anxiety_sessions',0);
  if(anxSessions>=5) unlockV20Achievement('v20_calm_mind');

  var theoryLearned=ls20Get('theory_learned',{});
  if(Object.keys(theoryLearned).filter(function(k){return theoryLearned[k]}).length>=12) unlockV20Achievement('v20_theorist');

  var skillHistory=ls20Get('skill_history',[]);
  if(skillHistory.length>=7) unlockV20Achievement('v20_skill_tracker');

  var historyVisited=ls20Get('history_visited',{});
  if(Object.keys(historyVisited).length>=12) unlockV20Achievement('v20_historian');

  var q11Stats=ls20Get('quiz11_stats',{total:0,correct:0,history:[]});
  if(q11Stats.total>=15&&q11Stats.correct/q11Stats.total>=0.9) unlockV20Achievement('v20_quiz11_s');
  if(q11Stats.total>=15) unlockV20Achievement('v20_quiz11_clear');

  var used=ls20Get('features_used',[]);
  if(used.length>=8) unlockV20Achievement('v20_all_features');

  var played=0;
  try{for(var i=0;i<localStorage.length;i++){var lk=localStorage.key(i);if(lk&&lk.indexOf('best-')===0&&parseInt(localStorage.getItem(lk))>0)played++;}}catch(e){}
  if(played>=50) unlockV20Achievement('v20_172songs');
}

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV20Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'Q':'interval-modal',
      'W':'pedal-modal',
      'E':'compose-modal',
      'R':'care-modal',
      'T':'anxiety-modal',
      'Y':'theory-modal',
      'Z':'skill-modal',
      'X':'history-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV20NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎵 청음',modal:'interval-modal'},
    {label:'🦶 페달',modal:'pedal-modal'},
    {label:'🎶 작곡',modal:'compose-modal'},
    {label:'🎹 관리',modal:'care-modal'},
    {label:'🧘 불안극복',modal:'anxiety-modal'},
    {label:'🧠 이론맵',modal:'theory-modal'},
    {label:'📊 스킬',modal:'skill-modal'},
    {label:'🏛️ 역사',modal:'history-modal'},
    {label:'🧠 퀸즈v11',modal:'quiz11-modal'}
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
function initV20(){
  addV20Songs();
  buildIntervalTrainerUI();
  buildPedalTrainerUI();
  buildComposeWorkshopUI();
  buildPianoCareUI();
  buildAnxietyCoachUI();
  buildTheoryMindmapUI();
  buildSkillAssessUI();
  buildPianoHistoryUI();
  buildQuizV11UI();
  injectV20Achievements();
  setupV20Shortcuts();
  injectV20NavButtons();
  setInterval(checkV20Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV20,5000);});
else setTimeout(initV20,5000);
})();
