// Piano Master v16 Patch Module
// Rhythm Accuracy Analyzer, Transposition Trainer, Piano Duel Battle,
// Performance Timeline, Scale Speed Challenge, Harmony Progression Analyzer,
// Practice Goal Planner, Piano Tone Lab
// 10 Songs (122→132), Quiz v7 15Q (90→105), 12 Achievements (120→132), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v16Loaded) return;
window.__v16Loaded = true;

var LS16 = 'piano-v16-';
function ls16Get(k,d){try{return JSON.parse(localStorage.getItem(LS16+k))||d}catch{return d}}
function ls16Set(k,v){localStorage.setItem(LS16+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v16 ================
var sfx16 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX16(type){
  if(!sfx16) return;
  if(sfx16.state==='suspended') sfx16.resume();
  var t=sfx16.currentTime, g=sfx16.createGain(), o=sfx16.createOscillator();
  g.connect(sfx16.destination); o.connect(g);
  switch(type){
    case 'rhythm_perfect':
      o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1320,t+0.15);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'rhythm_miss':
      o.type='sawtooth';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(120,t+0.15);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'transpose_shift':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(698,t+0.12);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'duel_hit':
      o.type='square';o.frequency.setValueAtTime(660,t);o.frequency.linearRampToValueAtTime(990,t+0.08);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'duel_win':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      setTimeout(function(){if(!sfx16)return;var gg=sfx16.createGain(),oo=sfx16.createOscillator();gg.connect(sfx16.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(659,sfx16.currentTime);gg.gain.setValueAtTime(0.1,sfx16.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx16.currentTime+0.12);oo.start(sfx16.currentTime);oo.stop(sfx16.currentTime+0.12);},100);
      setTimeout(function(){if(!sfx16)return;var gg=sfx16.createGain(),oo=sfx16.createOscillator();gg.connect(sfx16.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(784,sfx16.currentTime);gg.gain.setValueAtTime(0.1,sfx16.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx16.currentTime+0.2);oo.start(sfx16.currentTime);oo.stop(sfx16.currentTime+0.2);},200);return;
    case 'duel_lose':
      o.type='sawtooth';o.frequency.setValueAtTime(300,t);o.frequency.linearRampToValueAtTime(150,t+0.3);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);break;
    case 'timeline_open':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(587,t+0.15);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'scale_go':
      o.type='square';o.frequency.setValueAtTime(1000,t);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      o.start(t);o.stop(t+0.06);break;
    case 'scale_record':
      o.type='triangle';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1760,t+0.2);
      g.gain.setValueAtTime(0.09,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'harmony_view':
      o.type='sine';o.frequency.setValueAtTime(349,t);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      setTimeout(function(){if(!sfx16)return;var gg=sfx16.createGain(),oo=sfx16.createOscillator();gg.connect(sfx16.destination);oo.connect(gg);oo.type='sine';oo.frequency.setValueAtTime(440,sfx16.currentTime);gg.gain.setValueAtTime(0.05,sfx16.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx16.currentTime+0.15);oo.start(sfx16.currentTime);oo.stop(sfx16.currentTime+0.15);},80);return;
    case 'goal_check':
      o.type='sine';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.start(t);o.stop(t+0.08);break;
    case 'tone_switch':
      o.type='triangle';o.frequency.setValueAtTime(262,t);o.frequency.linearRampToValueAtTime(523,t+0.15);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'v16_achieve':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx16)return;var gg=sfx16.createGain(),oo=sfx16.createOscillator();gg.connect(sfx16.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(784,sfx16.currentTime);gg.gain.setValueAtTime(0.1,sfx16.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx16.currentTime+0.15);oo.start(sfx16.currentTime);oo.stop(sfx16.currentTime+0.15);},100);
      setTimeout(function(){if(!sfx16)return;var gg=sfx16.createGain(),oo=sfx16.createOscillator();gg.connect(sfx16.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(1047,sfx16.currentTime);gg.gain.setValueAtTime(0.1,sfx16.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx16.currentTime+0.25);oo.start(sfx16.currentTime);oo.stop(sfx16.currentTime+0.25);},200);return;
  }
}

// ================ COMMON MODAL BUILDER ================
function makeV16Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:160;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,560px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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
  contentFn(content);
  box.appendChild(content);modal.appendChild(box);
  modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  document.body.appendChild(modal);
  return modal;
}

// ================ 1. RHYTHM ACCURACY ANALYZER ================
function buildRhythmAnalyzerUI(){
  makeV16Modal('rhythm-modal', '🎯 리듬 정확도 분석기', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">연주 시 각 노트의 타이밍 정확도를 분석합니다. 연습 모드에서 곡을 연주한 후 확인하세요.</p>'+
      '<canvas id="rhythmCanvas" width="520" height="300" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:10px"></canvas>'+
      '<div id="rhythmStats" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
        '<button id="rhythmSimBtn" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--accent);color:white;font-size:11px;cursor:pointer">시뮬레이션 분석</button>'+
        '<button id="rhythmResetBtn" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">초기화</button>'+
      '</div>'+
      '<div id="rhythmDetail" style="margin-top:10px;font-size:10px;color:var(--text2)"></div>';

    setTimeout(function(){
      var simBtn=document.getElementById('rhythmSimBtn');
      var resetBtn=document.getElementById('rhythmResetBtn');
      if(simBtn) simBtn.addEventListener('click', runRhythmSim);
      if(resetBtn) resetBtn.addEventListener('click', function(){
        ls16Set('rhythm_data',[]);
        drawRhythmCanvas([]);
        updateRhythmStats([]);
      });
      var saved=ls16Get('rhythm_data',[]);
      drawRhythmCanvas(saved);
      updateRhythmStats(saved);
    },100);
  });
}

function runRhythmSim(){
  playSFX16('rhythm_perfect');
  var data=[];
  for(var i=0;i<32;i++){
    var dev=(Math.random()-0.5)*120;
    data.push({note:i+1,deviation:dev,ms:Math.round(dev),perfect:Math.abs(dev)<15});
  }
  ls16Set('rhythm_data',data);
  drawRhythmCanvas(data);
  updateRhythmStats(data);
  var detail=document.getElementById('rhythmDetail');
  if(detail){
    var perfCount=data.filter(function(d){return d.perfect}).length;
    detail.innerHTML='<b>분석 완료!</b> 32개 노트 중 '+perfCount+'개 퍼펙트 (±15ms 이내). '+
      (perfCount>=24?'우수한 리듬감!':'리듬 연습이 필요합니다.');
  }
}

function drawRhythmCanvas(data){
  var cv=document.getElementById('rhythmCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);

  ctx.fillStyle='#0d1117';
  ctx.fillRect(0,0,W,H);

  ctx.strokeStyle='#22c55e33';ctx.lineWidth=1;
  ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle='#eab30833';
  ctx.beginPath();ctx.moveTo(0,H/2-37.5);ctx.lineTo(W,H/2-37.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H/2+37.5);ctx.lineTo(W,H/2+37.5);ctx.stroke();

  ctx.strokeStyle='#ef444433';
  ctx.beginPath();ctx.moveTo(0,H/2-75);ctx.lineTo(W,H/2-75);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H/2+75);ctx.lineTo(W,H/2+75);ctx.stroke();

  ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='right';
  ctx.fillText('정확',35,H/2+3);
  ctx.fillText('+30ms',35,H/2-34);ctx.fillText('-30ms',35,H/2+40);
  ctx.fillText('+60ms',35,H/2-72);ctx.fillText('-60ms',35,H/2+78);

  ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='left';
  ctx.fillText('빠름',W-30,H/2-72);ctx.fillText('느림',W-30,H/2+78);

  if(!data||data.length===0){
    ctx.fillStyle='#8892a8';ctx.font='13px sans-serif';ctx.textAlign='center';
    ctx.fillText('연주 데이터가 없습니다. 시뮬레이션을 실행하세요.',W/2,H/2);
    return;
  }

  var barW=(W-80)/data.length;
  var maxDev=60;

  data.forEach(function(d,i){
    var x=45+i*barW+barW/2;
    var yOff=Math.max(-maxDev,Math.min(maxDev,d.deviation))*(H/2-30)/maxDev;
    var y=H/2-yOff;
    var r=Math.abs(d.deviation)<15?4:3;
    var color=Math.abs(d.deviation)<15?'#22c55e':Math.abs(d.deviation)<30?'#eab308':'#ef4444';

    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=color;
    ctx.fill();

    ctx.strokeStyle=color+'44';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x,H/2);ctx.lineTo(x,y);ctx.stroke();

    if(i%4===0){
      ctx.fillStyle='#8892a855';ctx.font='7px sans-serif';ctx.textAlign='center';
      ctx.fillText(d.note,x,H-5);
    }
  });

  if(data.length>1){
    ctx.beginPath();
    ctx.strokeStyle='#4a7dff66';ctx.lineWidth=1.5;
    data.forEach(function(d,i){
      var x=45+i*barW+barW/2;
      var yOff=Math.max(-maxDev,Math.min(maxDev,d.deviation))*(H/2-30)/maxDev;
      var y=H/2-yOff;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText('리듬 정확도 분석 (상=빠름, 하=느림, 중앙=정확)',W/2,15);
}

function updateRhythmStats(data){
  var el=document.getElementById('rhythmStats');
  if(!el) return;
  if(!data||data.length===0){
    el.innerHTML='<div style="grid-column:span 3;text-align:center;color:var(--text2);font-size:11px">데이터 없음</div>';
    return;
  }
  var perfect=data.filter(function(d){return Math.abs(d.deviation)<15}).length;
  var good=data.filter(function(d){return Math.abs(d.deviation)>=15&&Math.abs(d.deviation)<30}).length;
  var miss=data.filter(function(d){return Math.abs(d.deviation)>=30}).length;
  var avg=data.reduce(function(s,d){return s+Math.abs(d.deviation)},0)/data.length;
  var pct=Math.round(perfect/data.length*100);
  var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
  var gColor=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#8892a8':'#ef4444';

  el.innerHTML=[
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">퍼펙트</div><div style="font-size:16px;font-weight:700;color:#22c55e">'+perfect+'</div></div>',
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">Good</div><div style="font-size:16px;font-weight:700;color:#eab308">'+good+'</div></div>',
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">Miss</div><div style="font-size:16px;font-weight:700;color:#ef4444">'+miss+'</div></div>',
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">평균 편차</div><div style="font-size:14px;font-weight:700">'+avg.toFixed(1)+'ms</div></div>',
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">정확도</div><div style="font-size:14px;font-weight:700">'+pct+'%</div></div>',
    '<div style="background:var(--surface2);padding:8px;border-radius:6px;text-align:center"><div style="font-size:9px;color:var(--text2)">등급</div><div style="font-size:22px;font-weight:900;color:'+gColor+'">'+grade+'</div></div>'
  ].join('');
}

// ================ 2. TRANSPOSITION TRAINER ================
function buildTransposeUI(){
  var KEYS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var INTERVALS=['원조 (C)','단2도 (C#)','장2도 (D)','단3도 (D#)','장3도 (E)','완전4도 (F)','증4도 (F#)','완전5도 (G)','단6도 (G#)','장6도 (A)','단7도 (A#)','장7도 (B)'];
  var MELODIES=[
    {name:'도레미파솔',notes:[0,2,4,5,7],desc:'기본 5음'},
    {name:'비행기',notes:[4,2,0,2,4,4,4],desc:'쉬운 동요'},
    {name:'생일축하',notes:[0,0,2,0,5,4,0,0,2,0,7,5],desc:'익숙한 곡'},
    {name:'작은별',notes:[0,0,7,7,9,9,7],desc:'모차르트 변주곡'},
    {name:'나비야',notes:[4,2,0,2,4,4,4,2,2,2,4,7,7],desc:'동요'},
    {name:'반짝반짝',notes:[0,0,7,7,9,9,7,5,5,4,4,2,2,0],desc:'영어동요 Twinkle'}
  ];

  makeV16Modal('transpose-modal', '🔀 전조 연습기', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">같은 멜로디를 12가지 조(Key)로 연습합니다. 원조를 들은 후 목표 조로 연주하세요.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">'+
        MELODIES.map(function(m,i){return '<button class="tp-melody-btn" data-idx="'+i+'" style="padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text)')+';font-size:10px;cursor:pointer">'+m.name+'</button>'}).join('')+
      '</div>'+
      '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap" id="transposeKeyBtns">'+
        KEYS.map(function(k,i){return '<button class="tp-key-btn" data-semi="'+i+'" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text)')+';font-size:10px;cursor:pointer;min-width:28px">'+k+'</button>'}).join('')+
      '</div>'+
      '<canvas id="transposeCanvas" width="500" height="220" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:10px"></canvas>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="tpPlayOrig" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">원조 듣기</button>'+
        '<button id="tpPlayTarget" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">목표 조 듣기</button>'+
      '</div>'+
      '<div id="transposeInfo" style="margin-top:8px;font-size:10px;color:var(--text2)"></div>';

    setTimeout(function(){
      var curMelody=0, curKey=0;
      var melBtns=document.querySelectorAll('.tp-melody-btn');
      var keyBtns=document.querySelectorAll('.tp-key-btn');

      function refresh(){
        drawTransposeCanvas(MELODIES[curMelody],curKey,KEYS);
        var info=document.getElementById('transposeInfo');
        if(info) info.innerHTML=INTERVALS[curKey]+' 전조: 모든 음을 반음 '+curKey+'개 올려서 연주합니다.';
      }

      melBtns.forEach(function(btn){
        btn.addEventListener('click',function(){
          curMelody=parseInt(this.dataset.idx);
          melBtns.forEach(function(b){b.style.background='var(--surface2)';b.style.color='var(--text)';});
          this.style.background='var(--accent)';this.style.color='white';
          refresh();
        });
      });

      keyBtns.forEach(function(btn){
        btn.addEventListener('click',function(){
          curKey=parseInt(this.dataset.semi);
          keyBtns.forEach(function(b){b.style.background='var(--surface2)';b.style.color='var(--text)';});
          this.style.background='var(--accent)';this.style.color='white';
          playSFX16('transpose_shift');
          refresh();
        });
      });

      var playOrig=document.getElementById('tpPlayOrig');
      var playTarget=document.getElementById('tpPlayTarget');
      if(playOrig) playOrig.addEventListener('click',function(){playMelody16(MELODIES[curMelody].notes,0);});
      if(playTarget) playTarget.addEventListener('click',function(){playMelody16(MELODIES[curMelody].notes,curKey);});
      refresh();
    },100);
  });
}

function playMelody16(notes, transpose){
  if(!sfx16) return;
  if(sfx16.state==='suspended') sfx16.resume();
  var baseFreq=261.63;
  notes.forEach(function(n,i){
    setTimeout(function(){
      var freq=baseFreq*Math.pow(2,(n+transpose)/12);
      var t=sfx16.currentTime;
      var g=sfx16.createGain(),o=sfx16.createOscillator();
      g.connect(sfx16.destination);o.connect(g);
      o.type='triangle';o.frequency.setValueAtTime(freq,t);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);
    },i*350);
  });
}

function drawTransposeCanvas(melody, transpose, KEYS){
  var cv=document.getElementById('transposeCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);

  var NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var noteW=W/(melody.notes.length+1);

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText('원조 (C)',W/4,20);
  ctx.fillText('전조 ('+KEYS[transpose]+')',W*3/4,20);

  ctx.strokeStyle='#1e264066';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W/2,25);ctx.lineTo(W/2,H-10);ctx.stroke();

  var maxNote=Math.max.apply(null,melody.notes);
  var minNote=Math.min.apply(null,melody.notes);
  var range=maxNote-minNote||1;

  melody.notes.forEach(function(n,i){
    var x1=(i+0.5)*noteW/2+20;
    var y=H-30-((n-minNote)/range)*(H-60);
    ctx.beginPath();ctx.arc(x1,y,6,0,Math.PI*2);
    ctx.fillStyle='#4a7dff';ctx.fill();
    ctx.fillStyle='white';ctx.font='7px sans-serif';ctx.textAlign='center';
    ctx.fillText(NOTES[n%12],x1,y+3);

    if(i>0){
      var prevX=(i-0.5)*noteW/2+20;
      var prevY=H-30-((melody.notes[i-1]-minNote)/range)*(H-60);
      ctx.strokeStyle='#4a7dff44';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(prevX,prevY);ctx.lineTo(x1,y);ctx.stroke();
    }

    var tn=(n+transpose)%12;
    var x2=W/2+(i+0.5)*noteW/2+20;
    var ty=H-30-(((n+transpose)-minNote-transpose)/range)*(H-60);
    ctx.beginPath();ctx.arc(x2,ty,6,0,Math.PI*2);
    ctx.fillStyle='#22c55e';ctx.fill();
    ctx.fillStyle='white';ctx.font='7px sans-serif';
    ctx.fillText(NOTES[tn],x2,ty+3);

    if(i>0){
      var prevX2=W/2+(i-0.5)*noteW/2+20;
      ctx.strokeStyle='#22c55e44';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(prevX2,ty);ctx.lineTo(x2,ty);ctx.stroke();
    }
  });

  ctx.strokeStyle='#4a7dff22';ctx.lineWidth=0.5;
  melody.notes.forEach(function(n,i){
    var x1=(i+0.5)*noteW/2+20;
    var x2=W/2+(i+0.5)*noteW/2+20;
    var y=H-30-((n-minNote)/range)*(H-60);
    ctx.setLineDash([2,3]);
    ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText(melody.name+' - '+melody.desc,W/2,H-5);
}

// ================ 3. PIANO DUEL BATTLE ================
function buildDuelUI(){
  makeV16Modal('duel-modal', '🥊 피아노 듀오 배틀', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">AI 상대와 5라운드 음정 맞추기 대결! 들려주는 음을 정확하고 빠르게 맞추세요.</p>'+
      '<div id="duelArena" style="text-align:center;margin-bottom:10px">'+
        '<div style="display:flex;justify-content:space-around;margin-bottom:10px">'+
          '<div><div style="font-size:28px">🧑</div><div style="font-size:11px;font-weight:700">플레이어</div><div id="duelPlayerScore" style="font-size:24px;font-weight:900;color:var(--accent)">0</div></div>'+
          '<div style="font-size:20px;color:var(--text2);align-self:center">VS</div>'+
          '<div><div style="font-size:28px">🤖</div><div style="font-size:11px;font-weight:700">AI</div><div id="duelAIScore" style="font-size:24px;font-weight:900;color:var(--red)">0</div></div>'+
        '</div>'+
        '<div id="duelRound" style="font-size:12px;color:var(--text2);margin-bottom:8px">라운드 0/5</div>'+
        '<div id="duelQuestion" style="font-size:14px;font-weight:700;margin-bottom:10px;min-height:20px"></div>'+
        '<div id="duelAnswers" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px"></div>'+
        '<div id="duelFeedback" style="font-size:12px;min-height:20px;margin-bottom:8px"></div>'+
      '</div>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="duelStartBtn" style="flex:1;padding:10px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;font-weight:700;cursor:pointer">대결 시작!</button>'+
      '</div>'+
      '<div id="duelRecord" style="margin-top:10px;font-size:10px;color:var(--text2)"></div>';

    setTimeout(function(){
      var btn=document.getElementById('duelStartBtn');
      if(btn) btn.addEventListener('click', startDuel);
      updateDuelRecord();
    },100);
  });
}

function startDuel(){
  var state={round:0,playerScore:0,aiScore:0,totalRounds:5};
  var NOTES_ALL=['도','레','미','파','솔','라','시'];
  var FREQS=[261.63,293.66,329.63,349.23,392.00,440.00,493.88];

  function nextRound(){
    state.round++;
    if(state.round>state.totalRounds){
      endDuel(state);
      return;
    }
    document.getElementById('duelRound').textContent='라운드 '+state.round+'/'+state.totalRounds;
    document.getElementById('duelFeedback').textContent='음을 듣고 맞추세요...';

    var correctIdx=Math.floor(Math.random()*7);
    var correctNote=NOTES_ALL[correctIdx];
    var freq=FREQS[correctIdx];

    setTimeout(function(){
      if(sfx16&&sfx16.state!=='closed'){
        if(sfx16.state==='suspended')sfx16.resume();
        var t=sfx16.currentTime,g=sfx16.createGain(),o=sfx16.createOscillator();
        g.connect(sfx16.destination);o.connect(g);
        o.type='sine';o.frequency.setValueAtTime(freq,t);
        g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.8);
        o.start(t);o.stop(t+0.8);
      }

      document.getElementById('duelQuestion').textContent='이 음은 무엇일까요?';
      var answersDiv=document.getElementById('duelAnswers');
      answersDiv.innerHTML='';
      var startTime=Date.now();

      NOTES_ALL.forEach(function(note,ni){
        var btn=document.createElement('button');
        btn.style.cssText='padding:10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:700;cursor:pointer';
        btn.textContent=note;
        btn.addEventListener('click',function(){
          var elapsed=Date.now()-startTime;
          var aiTime=500+Math.random()*1500;
          var aiCorrect=Math.random()<0.6;

          if(ni===correctIdx){
            playSFX16('duel_hit');
            btn.style.background='var(--green)';btn.style.color='white';
            state.playerScore++;
            var fb='정답! ('+Math.round(elapsed)+'ms)';
            if(!aiCorrect){
              fb+=' | AI 오답! 👍';
            } else if(elapsed<aiTime){
              fb+=' | AI보다 '+(Math.round(aiTime-elapsed))+'ms 빨라요! 👏';
            } else {
              fb+=' | AI도 맞췄어요 ('+(Math.round(aiTime))+'ms)';
              state.aiScore++;
            }
            document.getElementById('duelFeedback').innerHTML='<span style="color:var(--green)">'+fb+'</span>';
          } else {
            playSFX16('rhythm_miss');
            btn.style.background='var(--red)';btn.style.color='white';
            var fb='오답! 정답은 <b>'+correctNote+'</b>';
            if(aiCorrect){
              state.aiScore++;
              fb+=' | AI 정답 🤖';
            } else {
              fb+=' | AI도 오답!';
            }
            document.getElementById('duelFeedback').innerHTML='<span style="color:var(--red)">'+fb+'</span>';
          }

          document.getElementById('duelPlayerScore').textContent=state.playerScore;
          document.getElementById('duelAIScore').textContent=state.aiScore;

          var allBtns=answersDiv.querySelectorAll('button');
          allBtns.forEach(function(b){b.disabled=true;});
          allBtns[correctIdx].style.background='var(--green)';allBtns[correctIdx].style.color='white';

          setTimeout(nextRound,1500);
        });
        answersDiv.appendChild(btn);
      });
    },500);
  }

  document.getElementById('duelPlayerScore').textContent='0';
  document.getElementById('duelAIScore').textContent='0';
  nextRound();
}

function endDuel(state){
  var win=state.playerScore>state.aiScore;
  var draw=state.playerScore===state.aiScore;
  if(win) playSFX16('duel_win'); else if(!draw) playSFX16('duel_lose');

  document.getElementById('duelQuestion').textContent='대결 종료!';
  document.getElementById('duelAnswers').innerHTML='';
  document.getElementById('duelFeedback').innerHTML=win?'<span style="color:var(--green);font-size:16px;font-weight:900">🏆 승리! '+state.playerScore+' : '+state.aiScore+'</span>':
    draw?'<span style="color:var(--yellow);font-size:16px;font-weight:900">🤝 무승부! '+state.playerScore+' : '+state.aiScore+'</span>':
    '<span style="color:var(--red);font-size:16px;font-weight:900">😢 패배... '+state.playerScore+' : '+state.aiScore+'</span>';

  var rec=ls16Get('duel_record',{wins:0,losses:0,draws:0});
  if(win) rec.wins++; else if(draw) rec.draws++; else rec.losses++;
  ls16Set('duel_record',rec);
  updateDuelRecord();
}

function updateDuelRecord(){
  var el=document.getElementById('duelRecord');
  if(!el) return;
  var rec=ls16Get('duel_record',{wins:0,losses:0,draws:0});
  var total=rec.wins+rec.losses+rec.draws;
  el.innerHTML=total>0?'전적: '+total+'전 '+rec.wins+'승 '+rec.draws+'무 '+rec.losses+'패 (승률 '+(total>0?Math.round(rec.wins/total*100):0)+'%)':'아직 대결 기록이 없습니다.';
}

// ================ 4. PERFORMANCE TIMELINE ================
function buildTimelineUI(){
  makeV16Modal('timeline-modal', '📅 연주 기록 타임라인', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">연주 세션의 기록을 타임라인으로 시각화합니다.</p>'+
      '<canvas id="timelineCanvas" width="520" height="280" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:10px"></canvas>'+
      '<div id="timelineStats" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="tlAddSession" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--accent);color:white;font-size:11px;cursor:pointer">세션 기록 추가</button>'+
        '<button id="tlClear" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">초기화</button>'+
      '</div>';

    setTimeout(function(){
      var addBtn=document.getElementById('tlAddSession');
      var clearBtn=document.getElementById('tlClear');
      if(addBtn) addBtn.addEventListener('click',function(){
        playSFX16('timeline_open');
        var sessions=ls16Get('timeline_sessions',[]);
        var dayOffset=sessions.length;
        sessions.push({
          day:dayOffset,
          score:60+Math.floor(Math.random()*40),
          songs:1+Math.floor(Math.random()*5),
          minutes:5+Math.floor(Math.random()*55),
          date:'Day '+(dayOffset+1)
        });
        if(sessions.length>30) sessions=sessions.slice(-30);
        ls16Set('timeline_sessions',sessions);
        drawTimelineCanvas(sessions);
        updateTimelineStats(sessions);
      });
      if(clearBtn) clearBtn.addEventListener('click',function(){
        ls16Set('timeline_sessions',[]);
        drawTimelineCanvas([]);
        updateTimelineStats([]);
      });
      var saved=ls16Get('timeline_sessions',[]);
      drawTimelineCanvas(saved);
      updateTimelineStats(saved);
    },100);
  });
}

function drawTimelineCanvas(sessions){
  var cv=document.getElementById('timelineCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText('연주 기록 타임라인 (최근 30일)',W/2,15);

  if(!sessions||sessions.length===0){
    ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
    ctx.fillText('아직 기록이 없습니다. 세션을 추가하세요.',W/2,H/2);
    return;
  }

  var padding={l:50,r:20,t:30,b:40};
  var chartW=W-padding.l-padding.r;
  var chartH=H-padding.t-padding.b;
  var barW=Math.min(chartW/sessions.length,18);
  var startX=padding.l+(chartW-barW*sessions.length)/2;

  ctx.strokeStyle='#1e264066';ctx.lineWidth=0.5;
  for(var g=0;g<=100;g+=25){
    var gy=padding.t+chartH-chartH*g/100;
    ctx.beginPath();ctx.moveTo(padding.l,gy);ctx.lineTo(W-padding.r,gy);ctx.stroke();
    ctx.fillStyle='#8892a855';ctx.font='8px sans-serif';ctx.textAlign='right';
    ctx.fillText(g,padding.l-4,gy+3);
  }

  sessions.forEach(function(s,i){
    var x=startX+i*barW;
    var h=chartH*s.score/100;
    var y=padding.t+chartH-h;

    var grad=ctx.createLinearGradient(0,y,0,padding.t+chartH);
    grad.addColorStop(0,s.score>=90?'#22c55e':s.score>=70?'#3b82f6':s.score>=50?'#eab308':'#ef4444');
    grad.addColorStop(1,s.score>=90?'#22c55e33':s.score>=70?'#3b82f633':s.score>=50?'#eab30833':'#ef444433');
    ctx.fillStyle=grad;
    ctx.fillRect(x+1,y,barW-2,h);

    ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';ctx.textAlign='center';
    ctx.fillText(s.score,x+barW/2,y-3);

    if(sessions.length<=15||i%2===0){
      ctx.save();
      ctx.translate(x+barW/2,padding.t+chartH+10);
      ctx.rotate(-0.4);
      ctx.fillStyle='#8892a855';ctx.font='7px sans-serif';ctx.textAlign='right';
      ctx.fillText(s.date,0,0);
      ctx.restore();
    }
  });

  if(sessions.length>1){
    ctx.beginPath();
    ctx.strokeStyle='#a855f7';ctx.lineWidth=2;
    sessions.forEach(function(s,i){
      var x=startX+i*barW+barW/2;
      var y=padding.t+chartH-chartH*s.score/100;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }

  ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText('점수',padding.l-25,padding.t+chartH/2);
}

function updateTimelineStats(sessions){
  var el=document.getElementById('timelineStats');
  if(!el) return;
  if(!sessions||sessions.length===0){
    el.innerHTML='<div style="grid-column:span 4;text-align:center;color:var(--text2);font-size:11px">데이터 없음</div>';
    return;
  }
  var avgScore=Math.round(sessions.reduce(function(s,v){return s+v.score},0)/sessions.length);
  var totalSongs=sessions.reduce(function(s,v){return s+v.songs},0);
  var totalMin=sessions.reduce(function(s,v){return s+v.minutes},0);
  var best=Math.max.apply(null,sessions.map(function(s){return s.score}));
  el.innerHTML=[
    '<div style="background:var(--surface2);padding:6px;border-radius:6px;text-align:center"><div style="font-size:8px;color:var(--text2)">평균 점수</div><div style="font-size:14px;font-weight:700;color:var(--accent)">'+avgScore+'</div></div>',
    '<div style="background:var(--surface2);padding:6px;border-radius:6px;text-align:center"><div style="font-size:8px;color:var(--text2)">총 곡</div><div style="font-size:14px;font-weight:700">'+totalSongs+'</div></div>',
    '<div style="background:var(--surface2);padding:6px;border-radius:6px;text-align:center"><div style="font-size:8px;color:var(--text2)">총 연습</div><div style="font-size:14px;font-weight:700">'+totalMin+'분</div></div>',
    '<div style="background:var(--surface2);padding:6px;border-radius:6px;text-align:center"><div style="font-size:8px;color:var(--text2)">최고점</div><div style="font-size:14px;font-weight:700;color:var(--green)">'+best+'</div></div>'
  ].join('');
}

// ================ 5. SCALE SPEED CHALLENGE ================
function buildScaleSpeedUI(){
  var SCALES=[
    {name:'C Major',notes:['C','D','E','F','G','A','B','C5'],keys:7},
    {name:'G Major',notes:['G','A','B','C','D','E','F#','G5'],keys:7},
    {name:'D Major',notes:['D','E','F#','G','A','B','C#','D5'],keys:7},
    {name:'A Minor',notes:['A','B','C','D','E','F','G','A5'],keys:7},
    {name:'E Minor',notes:['E','F#','G','A','B','C','D','E5'],keys:7},
    {name:'Chromatic',notes:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C5'],keys:12},
    {name:'F Major',notes:['F','G','A','Bb','C','D','E','F5'],keys:7},
    {name:'Bb Major',notes:['Bb','C','D','Eb','F','G','A','Bb5'],keys:7}
  ];

  makeV16Modal('scalespeed-modal', '⚡ 음계 속도 챌린지', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">선택한 스케일을 최대한 빠르게 연주하세요! 기록을 갱신해보세요.</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">'+
        SCALES.map(function(s,i){return '<button class="ss-scale-btn" data-idx="'+i+'" style="padding:5px 8px;border-radius:4px;border:1px solid var(--border);background:'+(i===0?'var(--accent)':'var(--surface2)')+';color:'+(i===0?'white':'var(--text)')+';font-size:10px;cursor:pointer">'+s.name+'</button>'}).join('')+
      '</div>'+
      '<canvas id="scaleSpeedCanvas" width="500" height="200" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:10px"></canvas>'+
      '<div id="scaleSpeedDisplay" style="text-align:center;margin-bottom:10px">'+
        '<div style="font-size:36px;font-weight:900;color:var(--accent)" id="ssTimer">0.000s</div>'+
        '<div style="font-size:11px;color:var(--text2)" id="ssStatus">스케일을 선택하고 시작하세요</div>'+
      '</div>'+
      '<div id="ssRecords" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="ssStartBtn" style="flex:1;padding:10px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;font-weight:700;cursor:pointer">시작!</button>'+
        '<button id="ssResetBtn" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">기록 초기화</button>'+
      '</div>';

    setTimeout(function(){
      var curScale=0;
      var scaleBtns=document.querySelectorAll('.ss-scale-btn');
      scaleBtns.forEach(function(btn){
        btn.addEventListener('click',function(){
          curScale=parseInt(this.dataset.idx);
          scaleBtns.forEach(function(b){b.style.background='var(--surface2)';b.style.color='var(--text)';});
          this.style.background='var(--accent)';this.style.color='white';
          drawScaleSpeedCanvas(SCALES[curScale],null);
          updateScaleRecords();
        });
      });

      var startBtn=document.getElementById('ssStartBtn');
      if(startBtn) startBtn.addEventListener('click',function(){
        runScaleChallenge(SCALES[curScale]);
      });

      var resetBtn=document.getElementById('ssResetBtn');
      if(resetBtn) resetBtn.addEventListener('click',function(){
        ls16Set('scale_records',{});
        updateScaleRecords();
      });

      drawScaleSpeedCanvas(SCALES[curScale],null);
      updateScaleRecords();
    },100);
  });
}

function runScaleChallenge(scale){
  playSFX16('scale_go');
  var startTime=Date.now();
  var noteIdx=0;
  var timer=document.getElementById('ssTimer');
  var status=document.getElementById('ssStatus');
  status.textContent='연주하세요! '+scale.notes[0]+' 부터...';

  var interval=setInterval(function(){
    var elapsed=(Date.now()-startTime)/1000;
    timer.textContent=elapsed.toFixed(3)+'s';
  },16);

  var simDelay=200+Math.random()*300;
  function simNote(){
    if(noteIdx>=scale.notes.length){
      clearInterval(interval);
      var finalTime=(Date.now()-startTime)/1000;
      timer.textContent=finalTime.toFixed(3)+'s';

      var records=ls16Get('scale_records',{});
      var key=scale.name;
      if(!records[key]||finalTime<records[key]){
        records[key]=finalTime;
        ls16Set('scale_records',records);
        playSFX16('scale_record');
        status.innerHTML='<span style="color:var(--green)">🏆 신기록! '+finalTime.toFixed(3)+'s</span>';
      } else {
        status.textContent='완료! 최고기록: '+records[key].toFixed(3)+'s';
      }
      drawScaleSpeedCanvas(scale,finalTime);
      updateScaleRecords();
      return;
    }

    status.textContent=scale.notes[noteIdx]+' ✓';
    drawScaleSpeedCanvas(scale,null,noteIdx);

    if(sfx16){
      var baseFreq=261.63;
      var semi=[0,2,4,5,7,9,11,12,1,3,6,8,10][noteIdx%13]||noteIdx;
      var t=sfx16.currentTime;
      var g=sfx16.createGain(),o=sfx16.createOscillator();
      g.connect(sfx16.destination);o.connect(g);
      o.type='triangle';o.frequency.setValueAtTime(baseFreq*Math.pow(2,semi/12),t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);
    }

    noteIdx++;
    setTimeout(simNote,simDelay);
  }
  setTimeout(simNote,300);
}

function drawScaleSpeedCanvas(scale,time,highlightIdx){
  var cv=document.getElementById('scaleSpeedCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);

  var noteW=Math.min((W-40)/scale.notes.length,50);
  var startX=(W-noteW*scale.notes.length)/2;

  scale.notes.forEach(function(n,i){
    var x=startX+i*noteW;
    var active=highlightIdx!==undefined&&highlightIdx!==null&&i<=highlightIdx;
    var current=highlightIdx!==undefined&&highlightIdx!==null&&i===highlightIdx;

    ctx.fillStyle=current?'#4a7dff':active?'#22c55e44':'#1a203644';
    ctx.fillRect(x+2,40,noteW-4,H-80);
    ctx.strokeStyle=current?'#4a7dff':'#1e264066';ctx.lineWidth=1;
    ctx.strokeRect(x+2,40,noteW-4,H-80);

    ctx.fillStyle=active?'#22c55e':'#8892a8';ctx.font=(current?'bold ':'')+('12px sans-serif');
    ctx.textAlign='center';
    ctx.fillText(n,x+noteW/2,H/2+4);

    if(active){
      ctx.fillStyle='#22c55e';ctx.font='14px sans-serif';
      ctx.fillText('✓',x+noteW/2,H/2+24);
    }
  });

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText(scale.name+' Scale Speed Challenge',W/2,20);

  if(time){
    ctx.fillStyle='#eab308';ctx.font='bold 14px sans-serif';
    ctx.fillText('완료: '+time.toFixed(3)+'s',W/2,H-12);
  }
}

function updateScaleRecords(){
  var el=document.getElementById('ssRecords');
  if(!el) return;
  var records=ls16Get('scale_records',{});
  var keys=Object.keys(records);
  if(keys.length===0){
    el.innerHTML='<div style="grid-column:span 2;text-align:center;color:var(--text2);font-size:10px">아직 기록이 없습니다</div>';
    return;
  }
  el.innerHTML=keys.map(function(k){
    return '<div style="background:var(--surface2);padding:6px;border-radius:6px"><div style="font-size:9px;color:var(--text2)">'+k+'</div><div style="font-size:13px;font-weight:700;color:var(--green)">'+records[k].toFixed(3)+'s</div></div>';
  }).join('');
}

// ================ 6. HARMONY PROGRESSION ANALYZER ================
function buildHarmonyUI(){
  var PROGRESSIONS=[
    {name:'I-V-vi-IV (팝)',chords:['C','G','Am','F'],desc:'팝 음악의 왕, 수천 곡에 사용'},
    {name:'I-IV-V-I (클래식)',chords:['C','F','G','C'],desc:'고전 화성학의 기본 진행'},
    {name:'ii-V-I (재즈)',chords:['Dm','G7','Cmaj7'],desc:'재즈의 가장 중요한 코드 진행'},
    {name:'I-vi-IV-V (50s)',chords:['C','Am','F','G'],desc:'1950년대 도왑 진행'},
    {name:'vi-IV-I-V (감성팝)',chords:['Am','F','C','G'],desc:'감성적인 발라드 진행'},
    {name:'I-V-vi-iii-IV (캐논)',chords:['C','G','Am','Em','F'],desc:'파헬벨 캐논 변주'},
    {name:'I-bVII-IV (록)',chords:['C','Bb','F'],desc:'록 음악의 클래식 진행'},
    {name:'i-bVI-bIII-bVII (에픽)',chords:['Am','F','C','G'],desc:'영화/게임 음악 에픽 진행'},
    {name:'I-ii-iii-IV (상행)',chords:['C','Dm','Em','F'],desc:'자연스러운 상행 진행'},
    {name:'I-IV-vi-V (밝은)',chords:['C','F','Am','G'],desc:'밝고 희망적인 분위기'}
  ];

  var CHORD_NOTES={
    'C':[0,4,7],'Dm':[2,5,9],'Em':[4,7,11],'F':[5,9,12],'G':[7,11,14],
    'Am':[9,12,16],'Bb':[10,14,17],'G7':[7,11,14,17],'Cmaj7':[0,4,7,11]
  };

  makeV16Modal('harmony-modal', '🎼 화성 진행 분석기', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">유명한 코드 진행을 시각화하고 들어봅니다. 실제 곡에서 어떻게 쓰이는지 학습하세요.</p>'+
      '<div style="max-height:200px;overflow-y:auto;margin-bottom:10px">'+
        PROGRESSIONS.map(function(p,i){
          return '<div class="harmony-item" data-idx="'+i+'" style="padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer;transition:0.2s;background:'+(i===0?'rgba(74,125,255,0.1)':'var(--surface2)')+'">'+
            '<div style="font-size:12px;font-weight:700;color:'+(i===0?'var(--accent)':'var(--text)')+'">'+p.name+'</div>'+
            '<div style="font-size:10px;color:var(--text2)">'+p.chords.join(' → ')+' | '+p.desc+'</div>'+
          '</div>';
        }).join('')+
      '</div>'+
      '<canvas id="harmonyCanvas" width="520" height="250" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:10px"></canvas>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="harmPlayBtn" style="flex:1;padding:8px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">진행 듣기</button>'+
        '<button id="harmLoopBtn" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">루프 재생</button>'+
      '</div>';

    setTimeout(function(){
      var curProg=0;
      var items=document.querySelectorAll('.harmony-item');
      items.forEach(function(item){
        item.addEventListener('click',function(){
          curProg=parseInt(this.dataset.idx);
          items.forEach(function(it){it.style.background='var(--surface2)';it.querySelector('div').style.color='var(--text)';});
          this.style.background='rgba(74,125,255,0.1)';
          this.querySelector('div').style.color='var(--accent)';
          playSFX16('harmony_view');
          drawHarmonyCanvas(PROGRESSIONS[curProg]);
        });
      });

      var playBtn=document.getElementById('harmPlayBtn');
      if(playBtn) playBtn.addEventListener('click',function(){
        playChordProgression(PROGRESSIONS[curProg],CHORD_NOTES);
      });

      var loopBtn=document.getElementById('harmLoopBtn');
      var looping=false;
      if(loopBtn) loopBtn.addEventListener('click',function(){
        looping=!looping;
        this.textContent=looping?'루프 정지':'루프 재생';
        this.style.background=looping?'var(--red)':'var(--surface2)';
        this.style.color=looping?'white':'var(--text)';
        if(looping){
          function loopPlay(){
            if(!looping) return;
            playChordProgression(PROGRESSIONS[curProg],CHORD_NOTES);
            setTimeout(loopPlay,PROGRESSIONS[curProg].chords.length*800+400);
          }
          loopPlay();
        }
      });

      drawHarmonyCanvas(PROGRESSIONS[curProg]);
    },100);
  });
}

function playChordProgression(prog,chordNotes){
  if(!sfx16) return;
  if(sfx16.state==='suspended') sfx16.resume();
  var baseFreq=261.63;
  prog.chords.forEach(function(ch,i){
    var notes=chordNotes[ch]||[0,4,7];
    setTimeout(function(){
      notes.forEach(function(n){
        var t=sfx16.currentTime;
        var g=sfx16.createGain(),o=sfx16.createOscillator();
        g.connect(sfx16.destination);o.connect(g);
        o.type='triangle';
        o.frequency.setValueAtTime(baseFreq*Math.pow(2,n/12),t);
        g.gain.setValueAtTime(0.06,t);
        g.gain.exponentialRampToValueAtTime(0.001,t+0.7);
        o.start(t);o.stop(t+0.7);
      });
    },i*700);
  });
}

function drawHarmonyCanvas(prog){
  var cv=document.getElementById('harmonyCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);

  var chords=prog.chords;
  var blockW=Math.min((W-60)/chords.length,100);
  var startX=(W-blockW*chords.length)/2;
  var colors=['#4a7dff','#22c55e','#a855f7','#eab308','#ef4444','#06b6d4','#f97316','#ec4899','#84cc16','#14b8a6'];

  chords.forEach(function(ch,i){
    var x=startX+i*blockW;
    var color=colors[i%colors.length];

    ctx.fillStyle=color+'22';
    ctx.fillRect(x+4,40,blockW-8,H-90);
    ctx.strokeStyle=color;ctx.lineWidth=2;
    ctx.strokeRect(x+4,40,blockW-8,H-90);

    ctx.fillStyle=color;ctx.font='bold 18px sans-serif';ctx.textAlign='center';
    ctx.fillText(ch,x+blockW/2,H/2-10);

    var roman=['I','ii','iii','IV','V','vi','vii'][i%7]||'?';
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
    ctx.fillText(roman,x+blockW/2,H/2+12);

    if(i<chords.length-1){
      var arrowX=x+blockW-2;
      ctx.fillStyle=color+'88';ctx.font='16px sans-serif';
      ctx.fillText('→',arrowX,H/2-8);
    }

    var barH=(H-100)*0.6;
    var segments=3;
    for(var s=0;s<segments;s++){
      var segH=barH/segments;
      var segY=50+s*segH;
      ctx.fillStyle=color+(s===0?'66':s===1?'44':'22');
      ctx.fillRect(x+blockW/2-8,segY,16,segH-2);
    }
  });

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText(prog.name,W/2,20);
  ctx.fillText(prog.desc,W/2,H-10);
}

// ================ 7. PRACTICE GOAL PLANNER ================
function buildGoalPlannerUI(){
  var DAYS=['월','화','수','목','금','토','일'];
  var DEFAULT_GOALS=[
    {name:'스케일 연습',target:2,unit:'회'},
    {name:'곡 연주',target:3,unit:'곡'},
    {name:'시보드리딩',target:1,unit:'세션'},
    {name:'코드 학습',target:2,unit:'종'},
    {name:'리듬 훈련',target:1,unit:'세션'},
    {name:'음감 훈련',target:1,unit:'세션'}
  ];

  makeV16Modal('goalplanner-modal', '🎯 연습 목표 플래너', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">주간 연습 목표를 설정하고 달성도를 추적합니다.</p>'+
      '<div id="goalWeekView" style="margin-bottom:10px"></div>'+
      '<div id="goalList" style="margin-bottom:10px"></div>'+
      '<div id="goalProgress" style="margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:6px">'+
        '<button id="goalCheckBtn" style="flex:1;padding:8px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">목표 달성 체크</button>'+
        '<button id="goalResetBtn" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">주간 리셋</button>'+
      '</div>';

    setTimeout(function(){
      var goals=ls16Get('weekly_goals',DEFAULT_GOALS.map(function(g){return{name:g.name,target:g.target,unit:g.unit,done:0}}));

      function renderGoals(){
        var listEl=document.getElementById('goalList');
        if(!listEl) return;
        listEl.innerHTML=goals.map(function(g,i){
          var pct=Math.min(100,Math.round(g.done/g.target*100));
          var color=pct>=100?'#22c55e':pct>=50?'#eab308':'#ef4444';
          return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--surface2);border-radius:6px;margin-bottom:4px">'+
            '<div style="flex:1;font-size:11px">'+g.name+'</div>'+
            '<div style="width:80px;height:6px;background:var(--border);border-radius:3px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:'+color+';border-radius:3px;transition:width 0.3s"></div></div>'+
            '<div style="font-size:10px;color:'+color+';min-width:40px;text-align:right">'+g.done+'/'+g.target+g.unit+'</div>'+
          '</div>';
        }).join('');

        var progressEl=document.getElementById('goalProgress');
        if(progressEl){
          var totalDone=goals.reduce(function(s,g){return s+Math.min(g.done,g.target)},0);
          var totalTarget=goals.reduce(function(s,g){return s+g.target},0);
          var overallPct=Math.round(totalDone/totalTarget*100);
          progressEl.innerHTML='<div style="text-align:center;padding:8px;background:var(--surface2);border-radius:8px">'+
            '<div style="font-size:10px;color:var(--text2)">주간 목표 달성률</div>'+
            '<div style="font-size:28px;font-weight:900;color:'+(overallPct>=100?'#22c55e':overallPct>=50?'#eab308':'var(--accent)')+'">'+overallPct+'%</div>'+
            '<div style="width:100%;height:8px;background:var(--border);border-radius:4px;margin-top:6px;overflow:hidden"><div style="width:'+overallPct+'%;height:100%;background:'+(overallPct>=100?'#22c55e':'var(--accent)')+';border-radius:4px;transition:width 0.3s"></div></div>'+
          '</div>';
        }
      }

      var weekEl=document.getElementById('goalWeekView');
      if(weekEl){
        var todayIdx=new Date().getDay();
        todayIdx=todayIdx===0?6:todayIdx-1;
        weekEl.innerHTML='<div style="display:flex;gap:4px;justify-content:center">'+
          DAYS.map(function(d,i){
            return '<div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;'+
              (i===todayIdx?'background:var(--accent);color:white;':'background:var(--surface2);color:var(--text2);border:1px solid var(--border);')+'">'+d+'</div>';
          }).join('')+
        '</div>';
      }

      var checkBtn=document.getElementById('goalCheckBtn');
      if(checkBtn) checkBtn.addEventListener('click',function(){
        playSFX16('goal_check');
        var idx=Math.floor(Math.random()*goals.length);
        if(goals[idx].done<goals[idx].target){
          goals[idx].done++;
          ls16Set('weekly_goals',goals);
          renderGoals();
        }
      });

      var resetBtn=document.getElementById('goalResetBtn');
      if(resetBtn) resetBtn.addEventListener('click',function(){
        goals=DEFAULT_GOALS.map(function(g){return{name:g.name,target:g.target,unit:g.unit,done:0}});
        ls16Set('weekly_goals',goals);
        renderGoals();
      });

      renderGoals();
    },100);
  });
}

// ================ 8. PIANO TONE LAB ================
function buildToneLabUI(){
  var TONES=[
    {name:'그랜드 피아노',wave:'triangle',attack:0.01,decay:0.3,sustain:0.4,release:0.5,desc:'따뜻하고 풍부한 클래식 음색'},
    {name:'어쿠스틱 업라이트',wave:'sine',attack:0.02,decay:0.2,sustain:0.3,release:0.4,desc:'부드럽고 친근한 가정용 피아노'},
    {name:'일렉트릭 피아노',wave:'square',attack:0.005,decay:0.15,sustain:0.5,release:0.3,desc:'Rhodes 스타일 전자 피아노'},
    {name:'하프시코드',wave:'sawtooth',attack:0.001,decay:0.1,sustain:0.1,release:0.2,desc:'바로크 시대의 뜯는 현악기'},
    {name:'오르간',wave:'square',attack:0.01,decay:0.05,sustain:0.8,release:0.1,desc:'지속음이 긴 파이프 오르간'},
    {name:'신디사이저',wave:'sawtooth',attack:0.005,decay:0.2,sustain:0.6,release:0.15,desc:'전자음악 리드 사운드'},
    {name:'뮤직 박스',wave:'sine',attack:0.001,decay:0.5,sustain:0.05,release:0.3,desc:'오르골의 맑고 작은 소리'},
    {name:'벨',wave:'triangle',attack:0.001,decay:0.8,sustain:0.1,release:0.6,desc:'종소리처럼 긴 잔향'}
  ];

  makeV16Modal('tonelab-modal', '🎛️ 피아노 음색 실험실', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8가지 피아노 음색을 실험하고 직접 연주해보세요. 건반을 클릭하면 선택한 음색으로 소리납니다.</p>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px" id="toneLabGrid">'+
        TONES.map(function(t,i){
          return '<div class="tone-card" data-idx="'+i+'" style="padding:8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:0.2s;background:'+(i===0?'rgba(74,125,255,0.15)':'var(--surface2)')+'">'+
            '<div style="font-size:11px;font-weight:700;color:'+(i===0?'var(--accent)':'var(--text)')+'">'+t.name+'</div>'+
            '<div style="font-size:9px;color:var(--text2);margin-top:2px">'+t.desc+'</div>'+
            '<div style="font-size:8px;color:var(--text2);margin-top:2px">파형: '+t.wave+' | A:'+t.attack+' D:'+t.decay+'</div>'+
          '</div>';
        }).join('')+
      '</div>'+
      '<div id="toneLabKeys" style="display:flex;gap:2px;margin-bottom:10px;justify-content:center"></div>'+
      '<canvas id="toneLabCanvas" width="500" height="150" style="width:100%;border-radius:8px;background:#0d1117;margin-bottom:8px"></canvas>'+
      '<div id="toneLabInfo" style="font-size:10px;color:var(--text2);text-align:center"></div>';

    setTimeout(function(){
      var curTone=0;
      var cards=document.querySelectorAll('.tone-card');
      cards.forEach(function(card){
        card.addEventListener('click',function(){
          curTone=parseInt(this.dataset.idx);
          cards.forEach(function(c2){c2.style.background='var(--surface2)';c2.querySelector('div').style.color='var(--text)';});
          this.style.background='rgba(74,125,255,0.15)';
          this.querySelector('div').style.color='var(--accent)';
          playSFX16('tone_switch');
          drawToneLabCanvas(TONES[curTone]);
          var info=document.getElementById('toneLabInfo');
          if(info) info.textContent='현재 음색: '+TONES[curTone].name+' — 건반을 클릭하여 테스트하세요';
        });
      });

      var keysEl=document.getElementById('toneLabKeys');
      if(keysEl){
        var noteNames=['C','D','E','F','G','A','B','C5'];
        var semitones=[0,2,4,5,7,9,11,12];
        noteNames.forEach(function(n,i){
          var btn=document.createElement('button');
          btn.style.cssText='width:40px;height:60px;border-radius:4px;border:1px solid #ccc;background:linear-gradient(180deg,#f8f8f8,#e0e0e0);cursor:pointer;font-size:10px;color:#333;font-weight:700;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px';
          btn.textContent=n;
          btn.addEventListener('click',function(){
            playToneLabNote(TONES[curTone],semitones[i]);
            btn.style.background='linear-gradient(180deg,var(--accent),#3a6de0)';
            btn.style.color='white';
            setTimeout(function(){btn.style.background='linear-gradient(180deg,#f8f8f8,#e0e0e0)';btn.style.color='#333';},200);
          });
          keysEl.appendChild(btn);
        });
      }

      drawToneLabCanvas(TONES[curTone]);
      var info=document.getElementById('toneLabInfo');
      if(info) info.textContent='현재 음색: '+TONES[curTone].name+' — 건반을 클릭하여 테스트하세요';
    },100);
  });
}

function playToneLabNote(tone,semitone){
  if(!sfx16) return;
  if(sfx16.state==='suspended') sfx16.resume();
  var freq=261.63*Math.pow(2,semitone/12);
  var t=sfx16.currentTime;
  var g=sfx16.createGain(),o=sfx16.createOscillator();
  g.connect(sfx16.destination);o.connect(g);
  o.type=tone.wave;o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(0.15,t+tone.attack);
  g.gain.linearRampToValueAtTime(0.15*tone.sustain,t+tone.attack+tone.decay);
  g.gain.linearRampToValueAtTime(0.001,t+tone.attack+tone.decay+tone.release);
  o.start(t);o.stop(t+tone.attack+tone.decay+tone.release+0.05);
}

function drawToneLabCanvas(tone){
  var cv=document.getElementById('toneLabCanvas');
  if(!cv) return;
  var ctx=cv.getContext('2d');
  var W=cv.width, H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);

  var total=tone.attack+tone.decay+tone.release;
  var scaleX=(W-60)/total;
  var x0=30;

  ctx.strokeStyle='#1e264066';ctx.lineWidth=0.5;
  for(var i=0;i<=4;i++){
    var gy=15+i*(H-35)/4;
    ctx.beginPath();ctx.moveTo(x0,gy);ctx.lineTo(W-20,gy);ctx.stroke();
  }

  ctx.beginPath();
  ctx.strokeStyle='#4a7dff';ctx.lineWidth=2.5;
  ctx.moveTo(x0,H-20);
  ctx.lineTo(x0+tone.attack*scaleX,15);
  ctx.lineTo(x0+(tone.attack+tone.decay)*scaleX,15+(H-35)*(1-tone.sustain));
  ctx.lineTo(x0+total*scaleX,H-20);
  ctx.stroke();

  ctx.fillStyle='#4a7dff22';
  ctx.beginPath();
  ctx.moveTo(x0,H-20);
  ctx.lineTo(x0+tone.attack*scaleX,15);
  ctx.lineTo(x0+(tone.attack+tone.decay)*scaleX,15+(H-35)*(1-tone.sustain));
  ctx.lineTo(x0+total*scaleX,H-20);
  ctx.closePath();
  ctx.fill();

  var labels=[
    {x:x0+tone.attack*scaleX/2,text:'A: '+tone.attack+'s'},
    {x:x0+(tone.attack+tone.decay/2)*scaleX,text:'D: '+tone.decay+'s'},
    {x:x0+(tone.attack+tone.decay+tone.release/2)*scaleX,text:'R: '+tone.release+'s'}
  ];
  labels.forEach(function(l){
    ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText(l.text,l.x,H-6);
  });

  ctx.fillStyle='#eab308';ctx.font='9px sans-serif';ctx.textAlign='left';
  ctx.fillText('S: '+Math.round(tone.sustain*100)+'%',x0+(tone.attack+tone.decay)*scaleX+4,15+(H-35)*(1-tone.sustain)+4);

  ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
  ctx.fillText(tone.name+' — ADSR Envelope ('+tone.wave+')',W/2,12);
}

// ================ NEW SONGS (122→132) ================
function addV16Songs(){
  if(!window.songs) return;
  var newSongs=[
    {id:'v16_1',name:'환상곡 D단조 K.397',composer:'모차르트',difficulty:'hard',category:'classic',bpm:72,
     notes:generatePianoNotes16([62,65,69,65,62,60,62,65,69,72,69,65,62,60,58,60,62,65,69,72,74,72,69,65,62],0.5)},
    {id:'v16_2',name:'가보트',composer:'고세크',difficulty:'medium',category:'classic',bpm:100,
     notes:generatePianoNotes16([67,71,72,71,67,64,67,71,72,74,72,71,67,64,60,64,67,71,72,74,76,74,72,71,67],0.4)},
    {id:'v16_3',name:'카바티나',composer:'마이어스',difficulty:'medium',category:'classic',bpm:66,
     notes:generatePianoNotes16([64,67,71,72,71,67,64,60,64,67,71,72,76,74,72,71,67,64,60,59,60,64,67,71,72],0.55)},
    {id:'v16_4',name:'Love Me Tender',composer:'엘비스 프레슬리',difficulty:'easy',category:'pop',bpm:76,
     notes:generatePianoNotes16([60,62,64,67,65,64,62,60,62,64,67,69,67,65,64,62,60,62,64,65,67,69,72,69,67],0.5)},
    {id:'v16_5',name:'Yesterday',composer:'비틀즈',difficulty:'medium',category:'pop',bpm:96,
     notes:generatePianoNotes16([67,65,64,62,60,62,64,65,67,69,67,65,64,62,64,65,67,69,72,69,67,65,64,62,60],0.4)},
    {id:'v16_6',name:'노래의 날개 위에',composer:'멘델스존',difficulty:'medium',category:'classic',bpm:84,
     notes:generatePianoNotes16([64,67,71,74,72,71,67,64,60,64,67,71,74,76,74,72,71,67,64,60,62,64,67,71,74],0.45)},
    {id:'v16_7',name:'유모레스크 Op.101',composer:'드보르작',difficulty:'hard',category:'classic',bpm:88,
     notes:generatePianoNotes16([72,71,69,67,69,71,72,74,72,71,69,67,65,64,62,64,65,67,69,71,72,74,76,74,72],0.38)},
    {id:'v16_8',name:'곰 세 마리',composer:'전래동요',difficulty:'easy',category:'kids',bpm:110,
     notes:generatePianoNotes16([60,60,60,64,67,67,69,67,64,60,62,64,62,60,60,60,64,67,67,69,67,64,62,60,60],0.35)},
    {id:'v16_9',name:'Fly Me to the Moon',composer:'바트 하워드',difficulty:'medium',category:'jazz',bpm:120,
     notes:generatePianoNotes16([72,71,69,67,65,64,62,60,62,64,65,67,69,71,72,74,72,71,69,67,65,64,62,60,60],0.35)},
    {id:'v16_10',name:'River Flows in You',composer:'이루마',difficulty:'hard',category:'modern',bpm:68,
     notes:generatePianoNotes16([64,67,71,72,74,72,71,67,64,60,62,64,67,71,72,74,76,74,72,71,67,64,62,60,59],0.5)},
  ];

  newSongs.forEach(function(s){
    var exists=window.songs.some(function(es){return es.id===s.id});
    if(!exists) window.songs.push(s);
  });

  if(typeof window.renderSongList==='function') window.renderSongList();
}

function generatePianoNotes16(midiNotes, beatDur){
  var notes=[];
  var t=0;
  midiNotes.forEach(function(midi){
    notes.push({note:midi,time:t,duration:beatDur*0.9,hand:'right'});
    t+=beatDur;
  });
  return notes;
}

// ================ QUIZ v7 (90→105) ================
function buildQuizV7UI(){
  var QUESTIONS=[
    {q:'리듬 정확도에서 ±15ms 이내를 무엇이라 하나요?',a:['퍼펙트','Good','미스','어택'],c:0},
    {q:'전조(Transposition)란 무엇인가요?',a:['곡의 모든 음을 일정 음정만큼 이동','곡의 속도를 바꿈','박자를 바꿈','음색을 바꿈'],c:0},
    {q:'I-V-vi-IV 진행이 가장 많이 쓰이는 장르는?',a:['팝','재즈','클래식','블루스'],c:0},
    {q:'ii-V-I 코드 진행은 어느 장르의 핵심인가요?',a:['재즈','록','클래식','힙합'],c:0},
    {q:'ADSR에서 &quot;S&quot;는 무엇을 뜻하나요?',a:['Sustain','Sound','Scale','Synth'],c:0},
    {q:'피아노의 그랜드(Grand)와 업라이트(Upright)의 가장 큰 차이는?',a:['현의 방향','건반 수','페달 수','색상'],c:0},
    {q:'하프시코드가 주로 사용된 시대는?',a:['바로크','낭만','현대','고전'],c:0},
    {q:'Rhodes 피아노는 어떤 종류인가요?',a:['일렉트릭 피아노','그랜드 피아노','디지털 피아노','토이 피아노'],c:0},
    {q:'&quot;River Flows in You&quot;의 작곡가는?',a:['이루마','쇼팽','리스트','모차르트'],c:0},
    {q:'환상곡 D단조 K.397의 작곡가는?',a:['모차르트','베토벤','바흐','쇼팽'],c:0},
    {q:'캐논 변주곡의 코드 진행은 몇 개의 코드를 사용하나요?',a:['5개 이상','2개','3개','4개'],c:0},
    {q:'스케일 연습에서 Chromatic Scale의 반음 개수는?',a:['12','7','5','8'],c:0},
    {q:'&quot;Yesterday&quot;는 누구의 곡인가요?',a:['비틀즈','엘비스','퀸','마이클잭슨'],c:0},
    {q:'파이프 오르간의 특징은?',a:['지속음이 김','소리가 작음','현을 때림','반음 없음'],c:0},
    {q:'뮤직 박스(오르골)의 Decay 특성은?',a:['빠르게 감쇠','매우 느림','무한 지속','즉시 차단'],c:0}
  ];

  makeV16Modal('quiz7-modal', '🧠 피아노 퀴즈 v7 (15문)', function(c){
    c.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:10px">피아노 v16 관련 15문항 퀴즈!</p>'+
      '<div id="quiz7Area"></div>'+
      '<div id="quiz7Result" style="display:none;text-align:center;padding:16px"></div>'+
      '<button id="quiz7StartBtn" style="width:100%;padding:10px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;font-weight:700;cursor:pointer;margin-top:8px">퀴즈 시작!</button>';

    setTimeout(function(){
      var startBtn=document.getElementById('quiz7StartBtn');
      if(startBtn) startBtn.addEventListener('click',function(){runQuizV7(QUESTIONS);});
    },100);
  });
}

function runQuizV7(questions){
  var shuffled=questions.slice().sort(function(){return Math.random()-0.5});
  var state={idx:0,correct:0,total:shuffled.length};
  var area=document.getElementById('quiz7Area');
  var resultEl=document.getElementById('quiz7Result');
  if(resultEl) resultEl.style.display='none';

  function showQuestion(){
    if(state.idx>=state.total){
      showQuizV7Result(state);
      return;
    }
    var q=shuffled[state.idx];
    var answers=q.a.map(function(a,i){return{text:a,idx:i}});
    answers.sort(function(){return Math.random()-0.5});

    area.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:6px">문제 '+(state.idx+1)+'/'+state.total+'</div>'+
      '<div style="font-size:13px;font-weight:700;margin-bottom:10px">'+q.q+'</div>'+
      '<div style="display:flex;flex-direction:column;gap:6px">'+
        answers.map(function(a,i){
          return '<button class="q7-ans" data-oidx="'+a.idx+'" style="padding:10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">'+a.text+'</button>';
        }).join('')+
      '</div>';

    var ansBtns=document.querySelectorAll('.q7-ans');
    ansBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        var chosen=parseInt(this.dataset.oidx);
        ansBtns.forEach(function(b){b.disabled=true;});
        if(chosen===q.c){
          state.correct++;
          this.style.background='var(--green)';this.style.color='white';
          playSFX16('rhythm_perfect');
        } else {
          this.style.background='var(--red)';this.style.color='white';
          playSFX16('rhythm_miss');
          ansBtns.forEach(function(b){if(parseInt(b.dataset.oidx)===q.c){b.style.background='var(--green)';b.style.color='white';}});
        }
        state.idx++;
        setTimeout(showQuestion,1000);
      });
    });
  }
  showQuestion();
}

function showQuizV7Result(state){
  var area=document.getElementById('quiz7Area');
  var resultEl=document.getElementById('quiz7Result');
  if(area) area.innerHTML='';
  var pct=Math.round(state.correct/state.total*100);
  var grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
  var gColor=grade==='S'?'#eab308':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#8892a8':'#ef4444';

  if(resultEl){
    resultEl.style.display='block';
    resultEl.innerHTML='<div style="font-size:48px;font-weight:900;color:'+gColor+'">'+grade+'</div>'+
      '<div style="font-size:14px;margin-top:4px">'+state.correct+'/'+state.total+' 정답 ('+pct+'%)</div>'+
      '<div style="font-size:11px;color:var(--text2);margin-top:4px">'+(pct>=90?'피아노 마스터!':pct>=60?'잘하셨어요!':'더 공부해보세요!')+'</div>';
  }

  var best=ls16Get('quiz7_best',0);
  if(state.correct>best){
    ls16Set('quiz7_best',state.correct);
    playSFX16('v16_achieve');
  }
}

// ================ ACHIEVEMENTS v16 (120→132) ================
var V16_ACHIEVEMENTS=[
  {id:'rhythm_first',icon:'🎯',name:'리듬 분석가',desc:'리듬 분석 첫 실행',check:function(){return ls16Get('rhythm_data',[]).length>0}},
  {id:'rhythm_perfect',icon:'💎',name:'리듬 마스터',desc:'퍼펙트 80%+ 달성',check:function(){var d=ls16Get('rhythm_data',[]);if(d.length===0)return false;var p=d.filter(function(v){return Math.abs(v.deviation)<15}).length;return p/d.length>=0.8}},
  {id:'transpose_try',icon:'🔀',name:'전조 입문',desc:'전조 연습기 사용',check:function(){return ls16Get('transpose_used',false)}},
  {id:'duel_first',icon:'🥊',name:'첫 대결',desc:'듀오 배틀 1회 완료',check:function(){var r=ls16Get('duel_record',{wins:0,losses:0,draws:0});return r.wins+r.losses+r.draws>0}},
  {id:'duel_champion',icon:'🏆',name:'배틀 챔피언',desc:'5승 달성',check:function(){return ls16Get('duel_record',{wins:0}).wins>=5}},
  {id:'timeline_10',icon:'📅',name:'꾸준한 연습생',desc:'10개 세션 기록',check:function(){return ls16Get('timeline_sessions',[]).length>=10}},
  {id:'scale_first',icon:'⚡',name:'스케일 도전자',desc:'스케일 속도 첫 기록',check:function(){return Object.keys(ls16Get('scale_records',{})).length>0}},
  {id:'scale_all',icon:'🌟',name:'스케일 정복자',desc:'4종 스케일 기록',check:function(){return Object.keys(ls16Get('scale_records',{})).length>=4}},
  {id:'harmony_listen',icon:'🎼',name:'화성 학습자',desc:'코드 진행 듣기',check:function(){return ls16Get('harmony_listened',false)}},
  {id:'goal_complete',icon:'🎯',name:'목표 달성자',desc:'주간 목표 100%',check:function(){var g=ls16Get('weekly_goals',[]);if(g.length===0)return false;return g.every(function(v){return v.done>=v.target})}},
  {id:'tone_explorer',icon:'🎛️',name:'음색 탐험가',desc:'음색 실험실 사용',check:function(){return ls16Get('tone_used',false)}},
  {id:'quiz7_perfect',icon:'💯',name:'퀴즈 v7 만점',desc:'퀴즈 v7 15/15',check:function(){return ls16Get('quiz7_best',0)>=15}}
];

function injectV16Achievements(){
  var grid=document.querySelector('.achievement-grid');
  if(!grid) return;
  V16_ACHIEVEMENTS.forEach(function(a){
    if(grid.querySelector('[data-id="'+a.id+'"]')) return;
    var el=document.createElement('div');
    el.className='achievement';
    el.dataset.id=a.id;
    el.innerHTML='<div class="achievement-icon">'+a.icon+'</div><div>'+a.name+'</div>';
    el.title=a.desc;
    grid.appendChild(el);
  });
}

function checkV16Achievements(){
  V16_ACHIEVEMENTS.forEach(function(a){
    if(ls16Get('ach_'+a.id,false)) return;
    if(a.check()){
      ls16Set('ach_'+a.id,true);
      var el=document.querySelector('[data-id="'+a.id+'"]');
      if(el) el.classList.add('unlocked');
      playSFX16('v16_achieve');
      showV16Toast(a.icon+' 업적 해금: '+a.name);
    }
  });
  V16_ACHIEVEMENTS.forEach(function(a){
    if(ls16Get('ach_'+a.id,false)){
      var el=document.querySelector('[data-id="'+a.id+'"]');
      if(el) el.classList.add('unlocked');
    }
  });
}

function showV16Toast(msg){
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
function injectV16QuickActions(){
  var rail=document.querySelector('.v-quick-rail');
  if(!rail){
    rail=document.createElement('div');
    rail.className='v-quick-rail';
    rail.style.cssText='position:fixed;left:6px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:4px;z-index:140';
    document.body.appendChild(rail);
  }
  var actions=[
    {icon:'🎯',label:'리듬분석',modal:'rhythm-modal'},
    {icon:'🔀',label:'전조',modal:'transpose-modal'},
    {icon:'🥊',label:'배틀',modal:'duel-modal'},
    {icon:'📅',label:'타임라인',modal:'timeline-modal'},
    {icon:'⚡',label:'스케일속도',modal:'scalespeed-modal'},
    {icon:'🎼',label:'화성',modal:'harmony-modal'},
    {icon:'🎯',label:'목표',modal:'goalplanner-modal'},
    {icon:'🎛️',label:'음색',modal:'tonelab-modal'}
  ];
  actions.forEach(function(a){
    if(rail.querySelector('[data-v16modal="'+a.modal+'"]')) return;
    var btn=document.createElement('button');
    btn.dataset.v16modal=a.modal;
    btn.style.cssText='width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0';
    btn.title=a.label;
    btn.textContent=a.icon;
    btn.addEventListener('click',function(){
      var m=document.getElementById(a.modal);
      if(m) m.style.display='flex';
      if(a.modal==='transpose-modal') ls16Set('transpose_used',true);
      if(a.modal==='harmony-modal') ls16Set('harmony_listened',true);
      if(a.modal==='tonelab-modal') ls16Set('tone_used',true);
    });
    rail.appendChild(btn);
  });
}

// ================ KEYBOARD SHORTCUTS ================
function setupV16Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    switch(e.key){
      case 'R':e.preventDefault();document.getElementById('rhythm-modal').style.display='flex';break;
      case 'P':e.preventDefault();document.getElementById('transpose-modal').style.display='flex';ls16Set('transpose_used',true);break;
      case 'B':e.preventDefault();document.getElementById('duel-modal').style.display='flex';break;
      case 'Y':e.preventDefault();document.getElementById('timeline-modal').style.display='flex';break;
      case 'E':e.preventDefault();document.getElementById('scalespeed-modal').style.display='flex';break;
      case 'H':e.preventDefault();document.getElementById('harmony-modal').style.display='flex';ls16Set('harmony_listened',true);break;
      case 'G':e.preventDefault();document.getElementById('goalplanner-modal').style.display='flex';break;
      case 'O':e.preventDefault();document.getElementById('tonelab-modal').style.display='flex';ls16Set('tone_used',true);break;
    }
  });
}

// ================ SCROLL NAV BAR v16 ================
function injectV16NavBar(){
  var existing=document.querySelector('.v16-nav-bar');if(existing)return;
  var nav=document.createElement('div');
  nav.className='v16-nav-bar';
  nav.style.cssText='position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);display:flex;overflow-x:auto;z-index:155;padding:4px 8px;gap:4px';
  var items=[
    {label:'🎯 리듬',modal:'rhythm-modal'},
    {label:'🔀 전조',modal:'transpose-modal'},
    {label:'🥊 배틀',modal:'duel-modal'},
    {label:'📅 기록',modal:'timeline-modal'},
    {label:'⚡ 스케일',modal:'scalespeed-modal'},
    {label:'🎼 화성',modal:'harmony-modal'},
    {label:'📋 목표',modal:'goalplanner-modal'},
    {label:'🎛️ 음색',modal:'tonelab-modal'},
    {label:'🧠 퀴즈v7',modal:'quiz7-modal'}
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
function initV16(){
  addV16Songs();
  buildRhythmAnalyzerUI();
  buildTransposeUI();
  buildDuelUI();
  buildTimelineUI();
  buildScaleSpeedUI();
  buildHarmonyUI();
  buildGoalPlannerUI();
  buildToneLabUI();
  buildQuizV7UI();
  injectV16QuickActions();
  injectV16Achievements();
  setupV16Shortcuts();
  injectV16NavBar();
  setInterval(checkV16Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV16,3500);});
else setTimeout(initV16,3500);
})();
