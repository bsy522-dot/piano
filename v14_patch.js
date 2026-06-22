// Piano Master v14 Patch Module
// Finger Exercise Trainer, Interval Training 12, Pedal Simulator,
// Sheet Music Generator, Practice Room Ambience, Chord Progression Workshop,
// Sight-Play Challenge, Piano History Museum, 10 Songs (102→112),
// Quiz v5 15Q (60→75), 12 Achievements (96→108), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v14Loaded) return;
window.__v14Loaded = true;

const LS14 = 'piano-v14-';
function ls14Get(k,d){try{return JSON.parse(localStorage.getItem(LS14+k))||d}catch{return d}}
function ls14Set(k,v){localStorage.setItem(LS14+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v14 ================
const sfx14 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX14(type){
  if(!sfx14) return;
  if(sfx14.state==='suspended') sfx14.resume();
  const t=sfx14.currentTime, g=sfx14.createGain(), o=sfx14.createOscillator();
  g.connect(sfx14.destination); o.connect(g);
  switch(type){
    case 'finger_tap':
      o.type='sine';o.frequency.setValueAtTime(660+Math.random()*200,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.start(t);o.stop(t+0.08);break;
    case 'finger_done':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(1047,t+0.25);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      o.start(t);o.stop(t+0.35);break;
    case 'interval_correct':
      o.type='triangle';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1175,t+0.1);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'interval_wrong':
      o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.linearRampToValueAtTime(110,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'pedal_down':
      o.type='sine';o.frequency.setValueAtTime(120,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'pedal_up':
      o.type='sine';o.frequency.setValueAtTime(180,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'sheet_gen':
      o.type='triangle';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.2);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'ambience_start':
      o.type='sine';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(400,t+0.3);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o.start(t);o.stop(t+0.4);break;
    case 'chord_prog':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      [659,784].forEach(function(f,i){setTimeout(function(){if(!sfx14)return;var gg=sfx14.createGain(),oo=sfx14.createOscillator();gg.connect(sfx14.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(f,sfx14.currentTime);gg.gain.setValueAtTime(0.07,sfx14.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx14.currentTime+0.12);oo.start(sfx14.currentTime);oo.stop(sfx14.currentTime+0.12);},(i+1)*80);});return;
    case 'sightplay_go':
      o.type='square';o.frequency.setValueAtTime(1200,t);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.start(t);o.stop(t+0.05);break;
    case 'museum_open':
      o.type='sine';o.frequency.setValueAtTime(330,t);o.frequency.linearRampToValueAtTime(440,t+0.15);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'v14_achieve':
      o.type='triangle';o.frequency.setValueAtTime(698,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(function(){if(!sfx14)return;var gg=sfx14.createGain(),oo=sfx14.createOscillator();gg.connect(sfx14.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(1047,sfx14.currentTime);gg.gain.setValueAtTime(0.1,sfx14.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx14.currentTime+0.2);oo.start(sfx14.currentTime);oo.stop(sfx14.currentTime+0.2);},120);return;
  }
}

// ================ COMMON MODAL BUILDER ================
function makeV14Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  var inner=document.createElement('div');
  inner.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto';
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
var NOTE_FREQ = {
  'C4':261.63,'C#4':277.18,'D4':293.66,'D#4':311.13,'E4':329.63,
  'F4':349.23,'F#4':369.99,'G4':392.00,'G#4':415.30,'A4':440.00,
  'A#4':466.16,'B4':493.88,'C5':523.25,'C#5':554.37,'D5':587.33,
  'D#5':622.25,'E5':659.26,'F5':698.46,'F#5':739.99,'G5':783.99
};
function playFreq(freq, dur){
  if(!sfx14) return;
  if(sfx14.state==='suspended') sfx14.resume();
  var t=sfx14.currentTime;
  var g=sfx14.createGain(), o=sfx14.createOscillator();
  g.connect(sfx14.destination);o.connect(g);
  o.type='triangle';o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t);o.stop(t+dur);
}

// ================ 1. FINGER EXERCISE TRAINER ================
var FINGER_EXERCISES = [
  {name:'C 5핑거 스케일',notes:['C4','D4','E4','F4','G4'],fingers:[1,2,3,4,5],bpm:80,diff:'초급'},
  {name:'G 5핑거 스케일',notes:['G4','A4','B4','C5','D5'],fingers:[1,2,3,4,5],bpm:80,diff:'초급'},
  {name:'Hanon 스타카토',notes:['C4','E4','F4','G4','A4','G4','F4','E4'],fingers:[1,3,4,5,4,5,4,3],bpm:100,diff:'중급'},
  {name:'반음계 상행',notes:['C4','C#4','D4','D#4','E4','F4','F#4','G4'],fingers:[1,2,3,1,2,3,4,5],bpm:90,diff:'중급'},
  {name:'아르페지오 C',notes:['C4','E4','G4','C5','G4','E4'],fingers:[1,2,3,5,3,2],bpm:88,diff:'중급'},
  {name:'옥타브 점프',notes:['C4','C5','D4','D5','E4','E5'],fingers:[1,5,1,5,1,5],bpm:72,diff:'고급'},
  {name:'트릴 연습',notes:['E4','F4','E4','F4','E4','F4','E4','F4'],fingers:[3,4,3,4,3,4,3,4],bpm:110,diff:'중급'},
  {name:'손가락 넘기',notes:['C4','D4','E4','F4','G4','A4','B4','C5'],fingers:[1,2,3,1,2,3,4,5],bpm:85,diff:'고급'},
  {name:'반진행',notes:['C4','D4','E4','F4','G4','F4','E4','D4'],fingers:[1,2,3,4,5,4,3,2],bpm:95,diff:'고급'},
  {name:'스케일 폭풍',notes:['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'],fingers:[1,2,3,1,2,3,4,1,2,3],bpm:120,diff:'전문가'}
];
var fingerExIdx=0, fingerStep=0, fingerStartTime=0, fingerActive=false;

function buildFingerUI(){
  makeV14Modal('finger-modal','✋ 손가락 운동 트레이너',function(inner){
    var area=document.createElement('div');area.id='finger-area';
    area.innerHTML='<canvas id="finger-canvas" width="380" height="280" style="width:100%;max-width:380px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px;cursor:pointer"></canvas>'+
      '<div id="finger-list" style="display:flex;flex-direction:column;gap:6px"></div>';
    inner.appendChild(area);
    setTimeout(renderFingerList,0);
  });
}

function renderFingerList(){
  var el=document.getElementById('finger-list');if(!el)return;
  var best=ls14Get('fingerBest',{});
  el.innerHTML=FINGER_EXERCISES.map(function(ex,i){
    var dc=ex.diff==='초급'?'#22c55e':ex.diff==='중급'?'#eab308':ex.diff==='고급'?'#f97316':'#ef4444';
    var bstr=best[i]?('베스트: '+(best[i]/1000).toFixed(1)+'s'):'';
    return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" data-fidx="'+i+'">'+
      '<span style="font-size:10px;color:'+dc+';font-weight:700;min-width:40px">'+ex.diff+'</span>'+
      '<div style="flex:1"><div style="font-size:12px;font-weight:600">'+ex.name+'</div><div style="font-size:9px;color:var(--text2)">BPM '+ex.bpm+' | 손가락: '+ex.fingers.join('-')+'</div></div>'+
      '<span style="font-size:9px;color:var(--accent)">'+bstr+'</span></div>';
  }).join('');
  el.querySelectorAll('[data-fidx]').forEach(function(d){
    d.addEventListener('click',function(){startFingerExercise(parseInt(d.getAttribute('data-fidx')));});
  });
}

function startFingerExercise(idx){
  fingerExIdx=idx;fingerStep=0;fingerActive=true;fingerStartTime=Date.now();
  drawFingerCanvas();
  var cv=document.getElementById('finger-canvas');
  if(cv){cv.onclick=function(){advanceFinger();};}
}

function advanceFinger(){
  if(!fingerActive)return;
  var ex=FINGER_EXERCISES[fingerExIdx];
  fingerStep++;
  playSFX14('finger_tap');
  if(fingerStep>=ex.notes.length){
    fingerActive=false;
    var elapsed=Date.now()-fingerStartTime;
    var best=ls14Get('fingerBest',{});
    if(!best[fingerExIdx]||elapsed<best[fingerExIdx]){best[fingerExIdx]=elapsed;ls14Set('fingerBest',best);}
    ls14Set('fingerCompleted',(ls14Get('fingerCompleted',0))+1);
    playSFX14('finger_done');
    drawFingerCanvas();renderFingerList();
    return;
  }
  var nf=NOTE_FREQ[ex.notes[fingerStep]];
  if(nf) playFreq(nf,0.25);
  drawFingerCanvas();
}

function drawFingerCanvas(){
  var cv=document.getElementById('finger-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');
  var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var ex=FINGER_EXERCISES[fingerExIdx];
  // Title
  ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(ex.name,w/2,22);ctx.textAlign='start';
  // Note progression
  var nx=ex.notes.length;
  var gap=Math.min(36,Math.floor((w-40)/nx));
  var startX=Math.floor((w-gap*nx)/2);
  for(var i=0;i<nx;i++){
    var x=startX+i*gap+gap/2;
    var isCurr=i===fingerStep&&fingerActive;
    var isDone=i<fingerStep;
    ctx.beginPath();ctx.arc(x,65,14,0,Math.PI*2);
    ctx.fillStyle=isCurr?'#4a7dff':isDone?'#22c55e':'#333';ctx.fill();
    ctx.fillStyle=isCurr||isDone?'#fff':'#888';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText(ex.notes[i].replace(/[0-9]/g,''),x,69);
    ctx.fillStyle='#aaa';ctx.font='9px sans-serif';
    ctx.fillText(String(ex.fingers[i]),x,85);
    ctx.textAlign='start';
  }
  // Progress bar
  var pct=fingerActive?fingerStep/nx:fingerStep>=nx?1:0;
  ctx.fillStyle='#222';ctx.fillRect(30,100,w-60,8);
  ctx.fillStyle='#4a7dff';ctx.fillRect(30,100,Math.floor((w-60)*pct),8);
  // Hand diagram
  var handY=140;
  ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';ctx.textAlign='center';
  ctx.fillText('오른손 번호',w/2,handY);
  var fingerNames=['①엄지','②검지','③중지','④약지','⑤새끼'];
  var fHeights=[50,62,68,60,44];
  for(var f=0;f<5;f++){
    var fx=w/2-60+f*30;
    var fy=handY+70-fHeights[f];
    var isAct=fingerActive&&fingerStep<nx&&ex.fingers[fingerStep]===(f+1);
    ctx.fillStyle=isAct?'#4a7dff':'#555';
    ctx.fillRect(fx,fy,18,fHeights[f]);
    ctx.strokeStyle='#888';ctx.strokeRect(fx,fy,18,fHeights[f]);
    ctx.fillStyle=isAct?'#fff':'#aaa';ctx.font='9px sans-serif';
    ctx.fillText(fingerNames[f],fx+9,handY+80);
  }
  ctx.textAlign='start';
  // Done message
  if(!fingerActive&&fingerStep>=nx){
    var elapsed=Date.now()-fingerStartTime;
    ctx.fillStyle='#22c55e';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText('✅ 완료! '+(elapsed/1000).toFixed(1)+'s',w/2,h-20);ctx.textAlign='start';
  } else if(fingerActive){
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('클릭하여 다음 음표로 진행',w/2,h-20);ctx.textAlign='start';
  }
}

// ================ 2. INTERVAL TRAINING 12 ================
var INTERVALS_12 = [
  {name:'단 2도 (m2)',semi:1},{name:'장 2도 (M2)',semi:2},
  {name:'단 3도 (m3)',semi:3},{name:'장 3도 (M3)',semi:4},
  {name:'완전 4도 (P4)',semi:5},{name:'증 4도 (A4)',semi:6},
  {name:'완전 5도 (P5)',semi:7},{name:'단 6도 (m6)',semi:8},
  {name:'장 6도 (M6)',semi:9},{name:'단 7도 (m7)',semi:10},
  {name:'장 7도 (M7)',semi:11},{name:'완전 8도 (P8)',semi:12}
];
var intervalRound=0,intervalScore=0,intervalActive=false,intervalAnswer=-1;

function buildIntervalUI(){
  makeV14Modal('interval-modal','🎵 음정 구별 트레이닝',function(inner){
    var area=document.createElement('div');area.id='interval-area';area.style.textAlign='center';
    area.innerHTML='<p style="font-size:12px;color:var(--text2);margin-bottom:12px">12가지 음정을 귀로 구별하는 10라운드 퀀즈</p>'+
      '<button id="interval-start-btn" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">시작</button>';
    inner.appendChild(area);
    setTimeout(function(){
      var btn=document.getElementById('interval-start-btn');
      if(btn) btn.addEventListener('click',startIntervalQuiz);
    },0);
  });
}

function startIntervalQuiz(){
  intervalRound=0;intervalScore=0;intervalActive=true;
  showIntervalRound();
}

function showIntervalRound(){
  var area=document.getElementById('interval-area');if(!area)return;
  if(intervalRound>=10){
    var pct=Math.round(intervalScore/10*100);
    var grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    area.innerHTML='<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">'+grade+'</div>'+
      '<div>'+intervalScore+'/10 ('+pct+'%)</div>'+
      '<button id="interval-retry-btn" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">다시</button>';
    intervalActive=false;
    ls14Set('intervalBest',Math.max(ls14Get('intervalBest',0),intervalScore));
    ls14Set('intervalPlayed',(ls14Get('intervalPlayed',0))+1);
    document.getElementById('interval-retry-btn').addEventListener('click',startIntervalQuiz);
    return;
  }
  // Pick random interval
  var intIdx=Math.floor(Math.random()*12);
  intervalAnswer=intIdx;
  var noteKeys=Object.keys(NOTE_FREQ);
  var maxBase=noteKeys.length-1-INTERVALS_12[intIdx].semi;
  if(maxBase<0) maxBase=0;
  var baseIdx=Math.floor(Math.random()*(maxBase+1));
  var baseFreq=NOTE_FREQ[noteKeys[baseIdx]];
  var topFreq=NOTE_FREQ[noteKeys[baseIdx+INTERVALS_12[intIdx].semi]];
  // Play the two notes
  if(baseFreq) playFreq(baseFreq,0.6);
  setTimeout(function(){if(topFreq) playFreq(topFreq,0.6);},700);
  // Generate 4 choices including correct
  var choices=[intIdx];
  while(choices.length<4){
    var r=Math.floor(Math.random()*12);
    if(choices.indexOf(r)===-1) choices.push(r);
  }
  choices.sort(function(){return Math.random()-0.5;});
  area.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:8px">'+(intervalRound+1)+'/10</div>'+
    '<div style="font-size:14px;font-weight:600;margin-bottom:8px">두 음의 음정은?</div>'+
    '<button id="interval-replay-btn" style="margin-bottom:12px;padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:11px;cursor:pointer">▶ 다시 듣기</button>'+
    '<div style="display:flex;flex-direction:column;gap:8px">'+choices.map(function(ci){
      return '<button data-intchoice="'+ci+'" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">'+INTERVALS_12[ci].name+'</button>';
    }).join('')+'</div>';
  document.getElementById('interval-replay-btn').addEventListener('click',function(){
    if(baseFreq) playFreq(baseFreq,0.6);
    setTimeout(function(){if(topFreq) playFreq(topFreq,0.6);},700);
  });
  area.querySelectorAll('[data-intchoice]').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!intervalActive)return;
      var chosen=parseInt(btn.getAttribute('data-intchoice'));
      if(chosen===intervalAnswer){intervalScore++;playSFX14('interval_correct');}
      else{playSFX14('interval_wrong');}
      intervalRound++;setTimeout(showIntervalRound,400);
    });
  });
}

// ================ 3. PEDAL SIMULATOR ================
var pedalSustain=false, pedalSoft=false;

function buildPedalUI(){
  makeV14Modal('pedal-modal','🦶 페달 시뮬레이터',function(inner){
    var area=document.createElement('div');area.id='pedal-area';
    area.innerHTML='<div style="display:flex;gap:16px;justify-content:center;margin-bottom:16px">'+
      '<div style="text-align:center"><div id="pedal-sustain-status" style="font-size:12px;margin-bottom:6px;color:#ef4444">OFF</div>'+
      '<button id="pedal-sustain-btn" style="width:100px;height:60px;border-radius:12px;border:2px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:600;cursor:pointer">서스테인<br>페달</button></div>'+
      '<div style="text-align:center"><div id="pedal-soft-status" style="font-size:12px;margin-bottom:6px;color:#ef4444">OFF</div>'+
      '<button id="pedal-soft-btn" style="width:100px;height:60px;border-radius:12px;border:2px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:600;cursor:pointer">소프트<br>페달</button></div>'+
    '</div>'+
    '<div style="font-size:12px;color:var(--text);margin-bottom:8px;font-weight:600">페달 테크닉 가이드</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px">'+
      '<div style="padding:8px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--accent)">하프 페달</div><div style="font-size:10px;color:var(--text2);margin-top:2px">페달을 반만 밟아 부분적인 지속음을 만들어 보세요</div></div>'+
      '<div style="padding:8px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--accent)">레가토 페달</div><div style="font-size:10px;color:var(--text2);margin-top:2px">다음 음을 치기 직전에 페달을 밟고, 친 직후 빠르게 떼었다 다시 밟으세요</div></div>'+
      '<div style="padding:8px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--accent)">플러터 페달</div><div style="font-size:10px;color:var(--text2);margin-top:2px">페달을 빠르게 반복 해서 트레몰로 효과를 내보세요</div></div>'+
      '<div style="padding:8px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--accent)">타이밍</div><div style="font-size:10px;color:var(--text2);margin-top:2px">음을 치기 직전이 아닌 동시에 페달을 밟는 것이 중요합니다</div></div>'+
    '</div>';
    inner.appendChild(area);
    setTimeout(function(){
      var sBt=document.getElementById('pedal-sustain-btn');
      var sFt=document.getElementById('pedal-soft-btn');
      if(sBt){
        function sDown(){pedalSustain=true;updatePedalDisplay();playSFX14('pedal_down');ls14Set('pedalUsed',(ls14Get('pedalUsed',0))+1);}
        function sUp(){pedalSustain=false;updatePedalDisplay();playSFX14('pedal_up');}
        sBt.addEventListener('mousedown',sDown);sBt.addEventListener('mouseup',sUp);sBt.addEventListener('mouseleave',sUp);
        sBt.addEventListener('touchstart',function(e){e.preventDefault();sDown();});sBt.addEventListener('touchend',function(e){e.preventDefault();sUp();});
      }
      if(sFt){
        function fDown(){pedalSoft=true;updatePedalDisplay();playSFX14('pedal_down');}
        function fUp(){pedalSoft=false;updatePedalDisplay();playSFX14('pedal_up');}
        sFt.addEventListener('mousedown',fDown);sFt.addEventListener('mouseup',fUp);sFt.addEventListener('mouseleave',fUp);
        sFt.addEventListener('touchstart',function(e){e.preventDefault();fDown();});sFt.addEventListener('touchend',function(e){e.preventDefault();fUp();});
      }
    },0);
  });
}

function updatePedalDisplay(){
  var ss=document.getElementById('pedal-sustain-status');
  var sf=document.getElementById('pedal-soft-status');
  var sb=document.getElementById('pedal-sustain-btn');
  var fb=document.getElementById('pedal-soft-btn');
  if(ss){ss.textContent=pedalSustain?'ON':'OFF';ss.style.color=pedalSustain?'#22c55e':'#ef4444';}
  if(sf){sf.textContent=pedalSoft?'ON':'OFF';sf.style.color=pedalSoft?'#22c55e':'#ef4444';}
  if(sb) sb.style.borderColor=pedalSustain?'#22c55e':'var(--border)';
  if(fb) fb.style.borderColor=pedalSoft?'#22c55e':'var(--border)';
}

// ================ 4. SHEET MUSIC GENERATOR ================
var SHEET_KEYS = [
  {name:'C Major',sharps:0,flats:0,notePool:['C','D','E','F','G','A','B']},
  {name:'G Major',sharps:1,flats:0,notePool:['G','A','B','C','D','E','F#']},
  {name:'D Major',sharps:2,flats:0,notePool:['D','E','F#','G','A','B','C#']},
  {name:'F Major',sharps:0,flats:1,notePool:['F','G','A','Bb','C','D','E']},
  {name:'Am 단조',sharps:0,flats:0,notePool:['A','B','C','D','E','F','G']},
  {name:'Dm 단조',sharps:0,flats:1,notePool:['D','E','F','G','A','Bb','C']}
];
var sheetKeyIdx=0, sheetBars=4;

function buildSheetUI(){
  makeV14Modal('sheet-modal','🎼 악보 생성기',function(inner){
    var area=document.createElement('div');area.id='sheet-area';
    area.innerHTML='<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center">'+
      '<label style="font-size:11px;color:var(--text2)">조성:</label>'+
      '<select id="sheet-key-sel" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
        SHEET_KEYS.map(function(k,i){return '<option value="'+i+'">'+k.name+'</option>';}).join('')+
      '</select>'+
      '<label style="font-size:11px;color:var(--text2)">마디:</label>'+
      '<select id="sheet-bars-sel" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
        '<option value="4">4마디</option><option value="8">8마디</option></select>'+
      '<button id="sheet-gen-btn" style="padding:6px 14px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">생성</button>'+
    '</div>'+
    '<canvas id="sheet-canvas" width="380" height="240" style="width:100%;max-width:380px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto"></canvas>';
    inner.appendChild(area);
    setTimeout(function(){
      var btn=document.getElementById('sheet-gen-btn');
      if(btn) btn.addEventListener('click',generateSheet);
    },0);
  });
}

function generateSheet(){
  var ksel=document.getElementById('sheet-key-sel');
  var bsel=document.getElementById('sheet-bars-sel');
  if(ksel) sheetKeyIdx=parseInt(ksel.value);
  if(bsel) sheetBars=parseInt(bsel.value);
  playSFX14('sheet_gen');
  ls14Set('sheetsGenerated',(ls14Get('sheetsGenerated',0))+1);
  drawSheetCanvas();
}

function drawSheetCanvas(){
  var cv=document.getElementById('sheet-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');
  var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#fffef5';ctx.fillRect(0,0,w,h);
  var key=SHEET_KEYS[sheetKeyIdx];
  var staffY=60, lineGap=8;
  // Treble clef symbol
  ctx.fillStyle='#222';ctx.font='bold 36px serif';
  ctx.fillText('𝄞',8,staffY+28);
  // Key signature
  var ksX=40;
  if(key.sharps>0){
    ctx.font='bold 14px serif';ctx.fillStyle='#222';
    for(var s=0;s<key.sharps;s++){ctx.fillText('#',ksX+s*10,staffY+6-s*3);}
    ksX+=key.sharps*10+8;
  }
  if(key.flats>0){
    ctx.font='bold 14px serif';ctx.fillStyle='#222';
    for(var fl=0;fl<key.flats;fl++){ctx.fillText('b',ksX+fl*10,staffY+12+fl*3);}
    ksX+=key.flats*10+8;
  }
  // Staff lines
  ctx.strokeStyle='#666';ctx.lineWidth=1;
  for(var l=0;l<5;l++){
    ctx.beginPath();ctx.moveTo(4,staffY+l*lineGap);ctx.lineTo(w-4,staffY+l*lineGap);ctx.stroke();
  }
  // Second staff for 8 bars
  var staff2Y=staffY+80;
  if(sheetBars===8){
    for(var l2=0;l2<5;l2++){
      ctx.beginPath();ctx.moveTo(4,staff2Y+l2*lineGap);ctx.lineTo(w-4,staff2Y+l2*lineGap);ctx.stroke();
    }
    ctx.fillStyle='#222';ctx.font='bold 36px serif';
    ctx.fillText('𝄞',8,staff2Y+28);
  }
  // Generate random notes
  var notePositions={'C':20,'D':16,'E':12,'F':8,'G':4,'A':0,'B':-4};
  var barsPerLine=sheetBars===8?4:4;
  var barW=Math.floor((w-ksX-10)/barsPerLine);
  var notesPerBar=4;
  for(var bar=0;bar<sheetBars;bar++){
    var lineIdx=bar<barsPerLine?0:1;
    var bInLine=bar<barsPerLine?bar:bar-barsPerLine;
    var baseY=lineIdx===0?staffY:staff2Y;
    var barX=ksX+bInLine*barW;
    // Bar line
    if(bInLine>0){
      ctx.strokeStyle='#666';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(barX,baseY);ctx.lineTo(barX,baseY+4*lineGap);ctx.stroke();
    }
    for(var n=0;n<notesPerBar;n++){
      var noteIdx=Math.floor(Math.random()*key.notePool.length);
      var noteName=key.notePool[noteIdx];
      var baseNote=noteName.replace(/[#b]/g,'');
      var yOff=notePositions[baseNote]||0;
      var nx=barX+12+n*Math.floor(barW/notesPerBar);
      var ny=baseY+20+yOff;
      // Note head
      ctx.beginPath();ctx.ellipse(nx,ny,5,4,0,0,Math.PI*2);
      ctx.fillStyle='#222';ctx.fill();
      // Stem
      ctx.strokeStyle='#222';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(nx+5,ny);ctx.lineTo(nx+5,ny-22);ctx.stroke();
      // Accidental
      if(noteName.indexOf('#')!==-1){ctx.fillStyle='#222';ctx.font='11px serif';ctx.fillText('#',nx-12,ny+3);}
      if(noteName.indexOf('b')!==-1){ctx.fillStyle='#222';ctx.font='11px serif';ctx.fillText('b',nx-10,ny+3);}
    }
  }
  // Double bar at end
  var endX=w-8;
  ctx.strokeStyle='#222';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(endX-4,staffY);ctx.lineTo(endX-4,staffY+4*lineGap);ctx.stroke();
  ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(endX,staffY);ctx.lineTo(endX,staffY+4*lineGap);ctx.stroke();
  ctx.lineWidth=1;
  // Title
  ctx.fillStyle='#222';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText(key.name+' - '+sheetBars+'마디 랜덤 멜로디',w/2,20);
  ctx.textAlign='start';
}

// ================ 5. PRACTICE ROOM AMBIENCE ================
var AMBIENCES = [
  {name:'스튜디오',icon:'🎤',freq:80,type:'sine',vol:0.02,lfoFreq:0.5,lfoAmt:5},
  {name:'카페',icon:'☕',freq:220,type:'sine',vol:0.008,lfoFreq:1.2,lfoAmt:15},
  {name:'공원',icon:'🌳',freq:350,type:'sine',vol:0.006,lfoFreq:2.5,lfoAmt:30},
  {name:'바다',icon:'🌊',freq:120,type:'sine',vol:0.015,lfoFreq:0.3,lfoAmt:40},
  {name:'아침',icon:'🌅',freq:500,type:'sine',vol:0.005,lfoFreq:3.0,lfoAmt:20},
  {name:'밤',icon:'🌙',freq:150,type:'triangle',vol:0.01,lfoFreq:0.8,lfoAmt:10},
  {name:'숲',icon:'🌿',freq:280,type:'sine',vol:0.007,lfoFreq:1.8,lfoAmt:25},
  {name:'콘서트 홀',icon:'🎻',freq:60,type:'triangle',vol:0.012,lfoFreq:0.4,lfoAmt:3}
];
var ambienceNodes={};

function buildAmbienceUI(){
  makeV14Modal('ambience-modal','🎶 연습실 분위기',function(inner){
    var area=document.createElement('div');area.id='ambience-area';
    area.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:12px">원하는 소리 환경을 토글하세요</p>'+
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">'+AMBIENCES.map(function(a,i){
        return '<button data-ambidx="'+i+'" style="padding:12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:center">'+
          '<div style="font-size:24px;margin-bottom:4px">'+a.icon+'</div><div style="font-weight:600">'+a.name+'</div>'+
          '<div id="amb-status-'+i+'" style="font-size:9px;margin-top:4px;color:#ef4444">OFF</div></button>';
      }).join('')+'</div>';
    inner.appendChild(area);
    setTimeout(function(){
      area.querySelectorAll('[data-ambidx]').forEach(function(btn){
        btn.addEventListener('click',function(){toggleAmbience(parseInt(btn.getAttribute('data-ambidx')));});
      });
    },0);
  });
}

function toggleAmbience(idx){
  if(!sfx14)return;
  if(sfx14.state==='suspended') sfx14.resume();
  if(ambienceNodes[idx]){
    ambienceNodes[idx].osc.stop();
    ambienceNodes[idx].lfo.stop();
    delete ambienceNodes[idx];
    var st=document.getElementById('amb-status-'+idx);
    if(st){st.textContent='OFF';st.style.color='#ef4444';}
    return;
  }
  var a=AMBIENCES[idx];
  var g=sfx14.createGain();g.connect(sfx14.destination);
  g.gain.setValueAtTime(a.vol,sfx14.currentTime);
  var osc=sfx14.createOscillator();osc.type=a.type;osc.frequency.setValueAtTime(a.freq,sfx14.currentTime);
  var lfo=sfx14.createOscillator();lfo.frequency.setValueAtTime(a.lfoFreq,sfx14.currentTime);
  var lfoGain=sfx14.createGain();lfoGain.gain.setValueAtTime(a.lfoAmt,sfx14.currentTime);
  lfo.connect(lfoGain);lfoGain.connect(osc.frequency);
  osc.connect(g);osc.start();lfo.start();
  ambienceNodes[idx]={osc:osc,lfo:lfo,gain:g,lfoGain:lfoGain};
  playSFX14('ambience_start');
  ls14Set('ambienceUsed',(ls14Get('ambienceUsed',[])).concat([idx]).filter(function(v,i,a){return a.indexOf(v)===i;}));
  var st2=document.getElementById('amb-status-'+idx);
  if(st2){st2.textContent='ON';st2.style.color='#22c55e';}
}

// ================ 6. CHORD PROGRESSION WORKSHOP ================
var CHORD_PROGS = [
  {name:'I-V-vi-IV (Pop)',chords:['C','G','Am','F'],style:'Pop'},
  {name:'I-IV-V-I (Classic)',chords:['C','F','G','C'],style:'Classic'},
  {name:'ii-V-I (Jazz)',chords:['Dm','G','C'],style:'Jazz'},
  {name:'I-vi-IV-V (50s)',chords:['C','Am','F','G'],style:'50s'},
  {name:'vi-IV-I-V (Modern)',chords:['Am','F','C','G'],style:'Modern'},
  {name:'I-V-vi-iii-IV (Canon)',chords:['C','G','Am','Em','F'],style:'Canon'},
  {name:'i-VI-III-VII (Minor)',chords:['Am','F','C','G'],style:'Minor'},
  {name:'I-iii-vi-IV (Ballad)',chords:['C','Em','Am','F'],style:'Ballad'},
  {name:'I-IV-vi-V (Country)',chords:['C','F','Am','G'],style:'Country'},
  {name:'12-bar Blues',chords:['C','C','C','C','F','F','C','C','G','F','C','G'],style:'Blues'}
];
var CHORD_NOTES_MAP = {
  'C':[261.63,329.63,392.00],
  'Dm':[293.66,349.23,440.00],
  'Em':[329.63,392.00,493.88],
  'F':[349.23,440.00,523.25],
  'G':[392.00,493.88,587.33],
  'Am':[440.00,523.25,659.26]
};
var progIdx=0, progPlaying=false, progTimer=null;

function buildChordProgUI(){
  makeV14Modal('chordprog-modal','🎹 코드 진행 워크숍',function(inner){
    var area=document.createElement('div');area.id='chordprog-area';
    area.innerHTML='<canvas id="chordprog-canvas" width="380" height="200" style="width:100%;max-width:380px;border-radius:8px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
      '<div id="chordprog-list" style="display:flex;flex-direction:column;gap:6px">'+CHORD_PROGS.map(function(p,i){
        return '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" data-progidx="'+i+'">'+
          '<span style="font-size:10px;color:var(--accent);font-weight:700;min-width:42px">'+p.style+'</span>'+
          '<div style="flex:1;font-size:12px;font-weight:600">'+p.name+'</div>'+
          '<span style="font-size:10px;color:var(--text2)">'+p.chords.join(' → ')+'</span></div>';
      }).join('')+'</div>';
    inner.appendChild(area);
    setTimeout(function(){
      area.querySelectorAll('[data-progidx]').forEach(function(d){
        d.addEventListener('click',function(){startProgPlay(parseInt(d.getAttribute('data-progidx')));});
      });
    },0);
  });
}

function startProgPlay(idx){
  if(progPlaying&&progTimer){clearTimeout(progTimer);progTimer=null;}
  progIdx=idx;progPlaying=true;
  ls14Set('progsPlayed',(ls14Get('progsPlayed',0))+1);
  playProgStep(0);
}

function playProgStep(step){
  var prog=CHORD_PROGS[progIdx];
  if(step>=prog.chords.length){progPlaying=false;drawChordProgCanvas(-1);return;}
  drawChordProgCanvas(step);
  var chordName=prog.chords[step];
  var freqs=CHORD_NOTES_MAP[chordName];
  if(freqs){
    freqs.forEach(function(f,i){
      setTimeout(function(){playFreq(f,0.5);},i*40);
    });
  }
  playSFX14('chord_prog');
  progTimer=setTimeout(function(){playProgStep(step+1);},800);
}

function drawChordProgCanvas(highlightIdx){
  var cv=document.getElementById('chordprog-canvas');if(!cv)return;
  var ctx=cv.getContext('2d');
  var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  var prog=CHORD_PROGS[progIdx];
  // Title
  ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(prog.name,w/2,22);ctx.textAlign='start';
  // Chord cards
  var nc=prog.chords.length;
  var maxPerRow=6;
  var rows=Math.ceil(nc/maxPerRow);
  for(var row=0;row<rows;row++){
    var startI=row*maxPerRow;
    var endI=Math.min(startI+maxPerRow,nc);
    var count=endI-startI;
    var cardW=Math.min(55,Math.floor((w-40)/count)-8);
    var totalW=count*(cardW+8)-8;
    var startX=Math.floor((w-totalW)/2);
    var rowY=40+row*75;
    for(var i=startI;i<endI;i++){
      var cx=startX+(i-startI)*(cardW+8);
      var isH=i===highlightIdx;
      ctx.fillStyle=isH?'#4a7dff':'#1e293b';
      ctx.strokeStyle=isH?'#6d9bff':'#334155';
      ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(cx,rowY,cardW,50,6);ctx.fill();ctx.stroke();
      ctx.fillStyle=isH?'#fff':'#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(prog.chords[i],cx+cardW/2,rowY+22);
      // Roman numeral approximation
      var romans=['I','ii','iii','IV','V','vi','vii'];
      var cname=prog.chords[i];
      var rn=cname;
      if(cname==='C')rn='I';else if(cname==='Dm')rn='ii';else if(cname==='Em')rn='iii';else if(cname==='F')rn='IV';else if(cname==='G')rn='V';else if(cname==='Am')rn='vi';
      ctx.fillStyle=isH?'#ddd':'#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(rn,cx+cardW/2,rowY+40);
      ctx.textAlign='start';
      // Arrow
      if(i<endI-1){
        var arrowX=cx+cardW+1;
        ctx.fillStyle='#556';ctx.font='12px sans-serif';ctx.textAlign='center';
        ctx.fillText('→',arrowX+3,rowY+24);ctx.textAlign='start';
      }
    }
  }
  // Style label
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
  ctx.fillText('Style: '+prog.style,w/2,h-10);ctx.textAlign='start';
}

// ================ 7. SIGHT-PLAY CHALLENGE ================
var sightRound=0, sightScore=0, sightActive=false, sightTimer=null, sightAnswer='';
var SIGHT_NOTES = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];

function buildSightPlayUI(){
  makeV14Modal('sightplay-modal','🎯 초견 연주 챌린지',function(inner){
    var area=document.createElement('div');area.id='sightplay-area';area.style.textAlign='center';
    area.innerHTML='<p style="font-size:12px;color:var(--text2);margin-bottom:12px">악보에 표시된 음표를 5초 안에 맞추세요 (10라운드)</p>'+
      '<button id="sightplay-start-btn" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">시작</button>';
    inner.appendChild(area);
    setTimeout(function(){
      var btn=document.getElementById('sightplay-start-btn');
      if(btn) btn.addEventListener('click',startSightPlay);
    },0);
  });
}

function startSightPlay(){
  sightRound=0;sightScore=0;sightActive=true;
  showSightRound();
}

function showSightRound(){
  var area=document.getElementById('sightplay-area');if(!area)return;
  if(sightTimer){clearTimeout(sightTimer);sightTimer=null;}
  if(sightRound>=10){
    var pct=Math.round(sightScore/10*100);
    var grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    area.innerHTML='<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">'+grade+'</div>'+
      '<div>'+sightScore+'/10 ('+pct+'%)</div>'+
      '<button id="sightplay-retry-btn" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">다시</button>';
    sightActive=false;
    ls14Set('sightBest',Math.max(ls14Get('sightBest',0),sightScore));
    ls14Set('sightPlayed',(ls14Get('sightPlayed',0))+1);
    document.getElementById('sightplay-retry-btn').addEventListener('click',startSightPlay);
    return;
  }
  var noteIdx=Math.floor(Math.random()*SIGHT_NOTES.length);
  sightAnswer=SIGHT_NOTES[noteIdx];
  var noteName=sightAnswer.replace(/[0-9]/g,'');
  // Build 4 choices
  var choices=[noteName];
  var allNames=['C','D','E','F','G','A','B'];
  while(choices.length<4){
    var r=allNames[Math.floor(Math.random()*allNames.length)];
    if(choices.indexOf(r)===-1) choices.push(r);
  }
  choices.sort(function(){return Math.random()-0.5;});
  playSFX14('sightplay_go');
  area.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:6px">'+(sightRound+1)+'/10</div>'+
    '<div id="sightplay-timer" style="font-size:20px;font-weight:700;color:var(--accent);margin-bottom:8px">5</div>'+
    '<canvas id="sightplay-mini" width="120" height="80" style="border-radius:6px;border:1px solid var(--border);display:block;margin:0 auto 12px"></canvas>'+
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">'+choices.map(function(c){
      return '<button data-sightchoice="'+c+'" style="padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">'+c+'</button>';
    }).join('')+'</div>';
  drawSightMini(noteIdx);
  // Timer countdown
  var remaining=5;
  var timerEl=document.getElementById('sightplay-timer');
  sightTimer=setInterval(function(){
    remaining--;
    if(timerEl) timerEl.textContent=String(remaining);
    if(remaining<=0){
      clearInterval(sightTimer);sightTimer=null;
      sightRound++;showSightRound();
    }
  },1000);
  area.querySelectorAll('[data-sightchoice]').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!sightActive)return;
      if(sightTimer){clearInterval(sightTimer);sightTimer=null;}
      if(btn.getAttribute('data-sightchoice')===noteName){sightScore++;playSFX14('interval_correct');}
      else{playSFX14('interval_wrong');}
      sightRound++;setTimeout(showSightRound,300);
    });
  });
}

function drawSightMini(noteIdx){
  var cv=document.getElementById('sightplay-mini');if(!cv)return;
  var ctx=cv.getContext('2d');
  var w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#fffef5';ctx.fillRect(0,0,w,h);
  // Staff lines
  var staffY=20,lineGap=8;
  ctx.strokeStyle='#888';ctx.lineWidth=1;
  for(var l=0;l<5;l++){
    ctx.beginPath();ctx.moveTo(4,staffY+l*lineGap);ctx.lineTo(w-4,staffY+l*lineGap);ctx.stroke();
  }
  // Note positions (C4=ledger below, D4=just below, etc.)
  var yPositions=[staffY+4*lineGap+8, staffY+4*lineGap+4, staffY+4*lineGap,
    staffY+3*lineGap+4, staffY+3*lineGap, staffY+2*lineGap+4, staffY+2*lineGap,
    staffY+lineGap+4, staffY+lineGap, staffY+4];
  var ny=yPositions[noteIdx]||staffY+2*lineGap;
  var nx=w/2;
  // Ledger line for C4
  if(noteIdx===0){
    ctx.beginPath();ctx.moveTo(nx-10,staffY+4*lineGap+8);ctx.lineTo(nx+10,staffY+4*lineGap+8);ctx.stroke();
  }
  // Note head
  ctx.beginPath();ctx.ellipse(nx,ny,6,4.5,0,0,Math.PI*2);
  ctx.fillStyle='#222';ctx.fill();
  // Stem
  ctx.strokeStyle='#222';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(nx+6,ny);ctx.lineTo(nx+6,ny-22);ctx.stroke();
}

// ================ 8. PIANO HISTORY MUSEUM ================
var PIANO_HISTORY = [
  {year:1700,title:'크리스토포리의 발명',desc:'바르톨로메오 크리스토포리가 피아노포르테를 발명하여 건반악기 역사에 혁명을 가져왔습니다.',color:'#8b5cf6'},
  {year:1720,title:'초기 피아노 보급',desc:'크리스토포리의 피아노가 이탈리아 궁정에서 주목받기 시작했습니다.',color:'#6366f1'},
  {year:1770,title:'모차르트 시대',desc:'모차르트가 피아노 소나타와 협주곡으로 피아노의 예술적 지위를 높였습니다.',color:'#3b82f6'},
  {year:1800,title:'베토벤 혹명기',desc:'베토벤이 피아노 소나타를 통해 음악의 감정적 표현을 확장했습니다.',color:'#22c55e'},
  {year:1830,title:'쇼팡과 리스트',desc:'낭만주의 시대, 쇼팡과 리스트가 피아노 기교의 절정을 이끄었습니다.',color:'#eab308'},
  {year:1850,title:'콘서트 그랜드 피아노',desc:'스타인웨이 등의 제조사가 현대적 그랜드 피아노를 완성했습니다.',color:'#f97316'},
  {year:1880,title:'드붤시와 인상주의',desc:'드붤시가 피아노 음악에 새로운 화성과 색채를 더했습니다.',color:'#ec4899'},
  {year:1900,title:'재즈와 래그타임',desc:'스콧 조플린 등이 피아노 래그타임을 통해 재즈의 기초를 놓았습니다.',color:'#14b8a6'},
  {year:1930,title:'전자 피아노 등장',desc:'전기 증폭과 피업 기술이 결합된 전자 피아노가 등장했습니다.',color:'#a855f7'},
  {year:1960,title:'디지털 피아노',desc:'디지털 합성 기술이 피아노에 적용되어 다양한 음색이 가능해졌습니다.',color:'#f43f5e'},
  {year:1990,title:'MIDI와 소프트웨어',desc:'MIDI 표준과 소프트웨어 신디사이저가 음악 제작을 혁신했습니다.',color:'#06b6d4'},
  {year:2020,title:'웹 피아노',desc:'Web Audio API와 브라우저 기술로 누구나 접근할 수 있는 피아노가 되었습니다.',color:'#84cc16'}
];

function buildMuseumUI(){
  makeV14Modal('museum-modal','🏛️ 피아노 역사 박물관',function(inner){
    var area=document.createElement('div');area.id='museum-area';
    var readList=ls14Get('museumRead',[]);
    area.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:12px">피아노 300년 역사를 탐험하세요</p>'+
      '<div style="display:flex;flex-direction:column;gap:8px">'+PIANO_HISTORY.map(function(h,i){
        var isRead=readList.indexOf(i)!==-1;
        return '<div data-museumidx="'+i+'" style="padding:10px;background:var(--surface2);border-radius:8px;border-left:4px solid '+h.color+';border:1px solid var(--border);border-left:4px solid '+h.color+';cursor:pointer;opacity:'+(isRead?'1':'0.7')+'">'+
          '<div style="display:flex;justify-content:space-between;align-items:center">'+
            '<span style="font-size:13px;font-weight:700;color:'+h.color+'">'+h.year+'</span>'+
            '<span style="font-size:11px;font-weight:600;color:var(--text)">'+h.title+'</span>'+
            (isRead?'<span style="font-size:10px;color:#22c55e">✓</span>':'')+
          '</div>'+
          '<div class="museum-desc" style="font-size:10px;color:var(--text2);margin-top:6px;display:none">'+h.desc+'</div></div>';
      }).join('')+'</div>';
    inner.appendChild(area);
    setTimeout(function(){
      area.querySelectorAll('[data-museumidx]').forEach(function(d){
        d.addEventListener('click',function(){
          var idx=parseInt(d.getAttribute('data-museumidx'));
          var desc=d.querySelector('.museum-desc');
          if(desc){
            desc.style.display=desc.style.display==='none'?'block':'none';
          }
          var rl=ls14Get('museumRead',[]);
          if(rl.indexOf(idx)===-1){rl.push(idx);ls14Set('museumRead',rl);}
          d.style.opacity='1';
          playSFX14('museum_open');
        });
      });
    },0);
  });
}

// ================ 9. NEW SONGS (102->112) ================
function addV14Songs(){
  if(typeof SONGS==='undefined') return;
  var ids=SONGS.map(function(s){return s.id;});
  var newSongs=[
    {id:'liebestraum',name:'Liebestraum No.3 (리스트)',category:'클래식',difficulty:'hard',icon:'💖',color:'#ec4899',bpm:54,timeSignature:'6/4',
      notes:[{note:'E5',time:0,dur:0.8,hand:'R'},{note:'D#5',time:0.9,dur:0.3,hand:'R'},{note:'E5',time:1.3,dur:0.5,hand:'R'},{note:'B4',time:1.9,dur:0.5,hand:'R'},{note:'D5',time:2.5,dur:0.5,hand:'R'},{note:'C5',time:3.1,dur:1.0,hand:'R'},{note:'A4',time:4.2,dur:0.8,hand:'R'},{note:'C4',time:5.1,dur:1.2,hand:'R'},{note:'A3',time:0,dur:2.0,hand:'L'},{note:'F3',time:2.0,dur:2.0,hand:'L'},{note:'C3',time:4.0,dur:2.5,hand:'L'}]},
    {id:'pathetique',name:'비창 2악장 (베토벤)',category:'클래식',difficulty:'medium',icon:'🌙',color:'#6366f1',bpm:52,timeSignature:'2/4',
      notes:[{note:'E4',time:0,dur:0.8,hand:'R'},{note:'C5',time:0.9,dur:1.2,hand:'R'},{note:'B4',time:2.2,dur:0.5,hand:'R'},{note:'A4',time:2.8,dur:0.5,hand:'R'},{note:'G4',time:3.4,dur:0.8,hand:'R'},{note:'A4',time:4.3,dur:0.5,hand:'R'},{note:'B4',time:4.9,dur:0.5,hand:'R'},{note:'C5',time:5.5,dur:1.2,hand:'R'},{note:'C3',time:0,dur:2.0,hand:'L'},{note:'Ab3',time:2.0,dur:2.0,hand:'L'},{note:'G3',time:4.0,dur:2.8,hand:'L'}]},
    {id:'waltz_flowers',name:'꽃의 왈츠 (차이코프스키)',category:'클래식',difficulty:'medium',icon:'🌸',color:'#f472b6',bpm:60,timeSignature:'3/4',
      notes:[{note:'D5',time:0,dur:0.5,hand:'R'},{note:'C#5',time:0.5,dur:0.3,hand:'R'},{note:'D5',time:0.9,dur:0.5,hand:'R'},{note:'A5',time:1.5,dur:0.8,hand:'R'},{note:'G5',time:2.4,dur:0.5,hand:'R'},{note:'F#5',time:3.0,dur:0.5,hand:'R'},{note:'G5',time:3.6,dur:0.8,hand:'R'},{note:'D5',time:4.5,dur:1.0,hand:'R'},{note:'D3',time:0,dur:1.5,hand:'L'},{note:'A3',time:1.5,dur:1.5,hand:'L'},{note:'G3',time:3.0,dur:2.5,hand:'L'}]},
    {id:'mapleleaf',name:'Maple Leaf Rag (조플린)',category:'재즈/팝',difficulty:'hard',icon:'🍁',color:'#f97316',bpm:100,timeSignature:'2/4',
      notes:[{note:'E5',time:0,dur:0.2,hand:'R'},{note:'D5',time:0.22,dur:0.2,hand:'R'},{note:'E5',time:0.44,dur:0.2,hand:'R'},{note:'C5',time:0.66,dur:0.3,hand:'R'},{note:'A4',time:1.0,dur:0.3,hand:'R'},{note:'G4',time:1.35,dur:0.2,hand:'R'},{note:'A4',time:1.55,dur:0.2,hand:'R'},{note:'E4',time:1.8,dur:0.5,hand:'R'},{note:'C3',time:0,dur:0.5,hand:'L'},{note:'G3',time:0.5,dur:0.5,hand:'L'},{note:'C3',time:1.0,dur:0.5,hand:'L'},{note:'G3',time:1.5,dur:0.5,hand:'L'}]},
    {id:'spring_waltz',name:'Spring Waltz (쇼팡)',category:'클래식',difficulty:'easy',icon:'🌸',color:'#a3e635',bpm:66,timeSignature:'3/4',
      notes:[{note:'E4',time:0,dur:0.8,hand:'R'},{note:'G4',time:0.9,dur:0.5,hand:'R'},{note:'A4',time:1.5,dur:0.5,hand:'R'},{note:'B4',time:2.1,dur:0.8,hand:'R'},{note:'A4',time:3.0,dur:0.5,hand:'R'},{note:'G4',time:3.6,dur:0.8,hand:'R'},{note:'E4',time:4.5,dur:1.2,hand:'R'},{note:'E3',time:0,dur:1.8,hand:'L'},{note:'A3',time:1.8,dur:1.8,hand:'L'},{note:'E3',time:3.6,dur:2.0,hand:'L'}]},
    {id:'bohemian',name:'Bohemian Rhapsody (퀘)',category:'재즈/팝',difficulty:'hard',icon:'🎤',color:'#a855f7',bpm:72,timeSignature:'4/4',
      notes:[{note:'G4',time:0,dur:0.4,hand:'R'},{note:'A4',time:0.45,dur:0.4,hand:'R'},{note:'B4',time:0.9,dur:0.4,hand:'R'},{note:'B4',time:1.4,dur:0.3,hand:'R'},{note:'A4',time:1.75,dur:0.4,hand:'R'},{note:'G4',time:2.2,dur:0.6,hand:'R'},{note:'E4',time:2.9,dur:0.6,hand:'R'},{note:'D4',time:3.6,dur:1.0,hand:'R'},{note:'G3',time:0,dur:1.4,hand:'L'},{note:'D3',time:1.4,dur:1.4,hand:'L'},{note:'C3',time:2.8,dur:1.8,hand:'L'}]},
    {id:'autumn_leaves',name:'Autumn Leaves (재즈)',category:'재즈/팝',difficulty:'medium',icon:'🍂',color:'#eab308',bpm:120,timeSignature:'4/4',
      notes:[{note:'E5',time:0,dur:0.5,hand:'R'},{note:'D5',time:0.55,dur:0.5,hand:'R'},{note:'C5',time:1.1,dur:0.8,hand:'R'},{note:'B4',time:2.0,dur:0.5,hand:'R'},{note:'A4',time:2.55,dur:0.5,hand:'R'},{note:'G4',time:3.1,dur:0.8,hand:'R'},{note:'F4',time:4.0,dur:1.2,hand:'R'},{note:'A3',time:0,dur:1.1,hand:'L'},{note:'D3',time:1.1,dur:1.4,hand:'L'},{note:'G3',time:2.55,dur:1.3,hand:'L'},{note:'C3',time:4.0,dur:1.5,hand:'L'}]},
    {id:'happy_birthday',name:'Happy Birthday 피아노',category:'동요/민요',difficulty:'easy',icon:'🎂',color:'#f43f5e',bpm:100,timeSignature:'3/4',
      notes:[{note:'G4',time:0,dur:0.3,hand:'R'},{note:'G4',time:0.35,dur:0.3,hand:'R'},{note:'A4',time:0.7,dur:0.5,hand:'R'},{note:'G4',time:1.3,dur:0.5,hand:'R'},{note:'C5',time:1.9,dur:0.5,hand:'R'},{note:'B4',time:2.5,dur:0.8,hand:'R'},{note:'G4',time:3.5,dur:0.3,hand:'R'},{note:'G4',time:3.85,dur:0.3,hand:'R'},{note:'A4',time:4.2,dur:0.5,hand:'R'},{note:'G4',time:4.8,dur:0.5,hand:'R'},{note:'D5',time:5.4,dur:0.5,hand:'R'},{note:'C5',time:6.0,dur:1.0,hand:'R'},{note:'C3',time:0,dur:1.3,hand:'L'},{note:'G3',time:1.3,dur:1.2,hand:'L'},{note:'C3',time:2.5,dur:1.5,hand:'L'},{note:'G3',time:4.0,dur:1.5,hand:'L'},{note:'F3',time:5.4,dur:1.6,hand:'L'}]},
    {id:'entertainer',name:'The Entertainer (조플린)',category:'재즈/팝',difficulty:'medium',icon:'🎩',color:'#14b8a6',bpm:100,timeSignature:'2/4',
      notes:[{note:'D5',time:0,dur:0.2,hand:'R'},{note:'E5',time:0.22,dur:0.2,hand:'R'},{note:'C5',time:0.44,dur:0.3,hand:'R'},{note:'A4',time:0.8,dur:0.3,hand:'R'},{note:'B4',time:1.15,dur:0.3,hand:'R'},{note:'G4',time:1.5,dur:0.5,hand:'R'},{note:'D5',time:2.1,dur:0.2,hand:'R'},{note:'E5',time:2.32,dur:0.2,hand:'R'},{note:'C5',time:2.54,dur:0.3,hand:'R'},{note:'A4',time:2.9,dur:0.5,hand:'R'},{note:'C3',time:0,dur:0.8,hand:'L'},{note:'G3',time:0.8,dur:0.7,hand:'L'},{note:'C3',time:1.5,dur:0.6,hand:'L'},{note:'G3',time:2.1,dur:0.8,hand:'L'}]},
    {id:'fly_me_moon',name:'Fly Me to the Moon',category:'재즈/팝',difficulty:'medium',icon:'🌙',color:'#06b6d4',bpm:120,timeSignature:'4/4',
      notes:[{note:'C5',time:0,dur:0.5,hand:'R'},{note:'B4',time:0.55,dur:0.5,hand:'R'},{note:'A4',time:1.1,dur:0.5,hand:'R'},{note:'G4',time:1.65,dur:0.5,hand:'R'},{note:'F4',time:2.2,dur:0.5,hand:'R'},{note:'G4',time:2.75,dur:0.5,hand:'R'},{note:'A4',time:3.3,dur:0.5,hand:'R'},{note:'C5',time:3.85,dur:0.8,hand:'R'},{note:'A3',time:0,dur:1.1,hand:'L'},{note:'Dm3',time:1.1,dur:1.1,hand:'L'},{note:'G3',time:2.2,dur:1.1,hand:'L'},{note:'C3',time:3.3,dur:1.4,hand:'L'}]}
  ];
  newSongs.forEach(function(s){if(ids.indexOf(s.id)===-1) SONGS.push(s);});
}

// ================ 10. QUIZ v5 ================
var QUIZ_V5 = [
  {q:'피아노를 처음 발명한 사람은?',o:['크리스토포리','베토벤','모차르트','바흐'],a:0},
  {q:'반음(m2) 음정은 몇 반음 차이?',o:['1','2','3','4'],a:0},
  {q:'I-V-vi-IV 진행은 어떤 장르?',o:['Pop','클래식','Jazz','Blues'],a:0},
  {q:'서스테인 페달의 역할은?',o:['음 지속','음 부드럽게','음 높이기','음 낮추기'],a:0},
  {q:'오른손 엄지의 손가락 번호는?',o:['1','2','3','5'],a:0},
  {q:'ii-V-I 진행은 어떤 장르에서 많이 사용?',o:['Jazz','Pop','Rock','클래식'],a:0},
  {q:'완전 5도(P5)는 몇 반음?',o:['5','6','7','8'],a:2},
  {q:'Maple Leaf Rag의 작곡가는?',o:['조플린','거슈윈','드붤시','모차르트'],a:0},
  {q:'소프트 페달의 효과는?',o:['음을 부드럽게','음을 길게','음을 높게','음을 낮게'],a:0},
  {q:'리스트의 대표작 Liebestraum의 뜻은?',o:['사랑의 꿈','밤의 노래','봄의 왈츠','가을 나뮇'],a:0},
  {q:'비창 소나타의 작곡가는?',o:['베토벤','모차르트','쇼팡','리스트'],a:0},
  {q:'12-bar Blues의 코드 수는?',o:['12','8','16','10'],a:0},
  {q:'피아노포르테가 발명된 연도는 약?',o:['1700','1750','1800','1650'],a:0},
  {q:'장 3도(M3)는 몇 반음?',o:['3','4','5','2'],a:1},
  {q:'캐논(Canon) 진행은?',o:['I-V-vi-iii-IV','I-IV-V-I','I-vi-IV-V','ii-V-I'],a:0}
];
var quiz5Score=0, quiz5Idx=0, quiz5Active=false;

function buildQuizV5UI(){
  makeV14Modal('quiz5-modal','🏆 퀀즈 v5',function(inner){
    var area=document.createElement('div');area.id='quiz5-area';area.style.textAlign='center';
    area.innerHTML='<p style="font-size:12px;color:var(--text2);margin-bottom:16px">15문항 심화 퀀즈 v5</p>'+
      '<button id="quiz5-start-btn" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">시작</button>';
    inner.appendChild(area);
    setTimeout(function(){
      document.getElementById('quiz5-start-btn').addEventListener('click',startQuiz5);
    },0);
  });
}

function startQuiz5(){quiz5Score=0;quiz5Idx=0;quiz5Active=true;showQuiz5Q();}

function showQuiz5Q(){
  var area=document.getElementById('quiz5-area');if(!area)return;
  if(quiz5Idx>=QUIZ_V5.length){
    var pct=Math.round(quiz5Score/QUIZ_V5.length*100);
    var grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    area.innerHTML='<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">'+grade+'</div>'+
      '<div>'+quiz5Score+'/'+QUIZ_V5.length+' ('+pct+'%)</div>'+
      '<button id="quiz5-retry-btn" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">다시</button>';
    quiz5Active=false;ls14Set('quiz5Best',Math.max(ls14Get('quiz5Best',0),quiz5Score));
    document.getElementById('quiz5-retry-btn').addEventListener('click',startQuiz5);
    return;
  }
  var q=QUIZ_V5[quiz5Idx];
  area.innerHTML='<div style="font-size:11px;color:var(--text2);margin-bottom:8px">'+(quiz5Idx+1)+'/'+QUIZ_V5.length+'</div>'+
    '<div style="font-size:14px;font-weight:600;margin-bottom:16px">'+q.q+'</div>'+
    '<div style="display:flex;flex-direction:column;gap:8px">'+q.o.map(function(opt,i){
      return '<button data-q5ans="'+i+'" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">'+opt+'</button>';
    }).join('')+'</div>';
  area.querySelectorAll('[data-q5ans]').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(!quiz5Active)return;
      if(parseInt(btn.getAttribute('data-q5ans'))===q.a){quiz5Score++;playSFX14('interval_correct');}
      else{playSFX14('interval_wrong');}
      quiz5Idx++;setTimeout(showQuiz5Q,300);
    });
  });
}

// ================ 11. ACHIEVEMENTS ================
var V14_ACH = [
  {id:'finger_first',name:'첫 손가락 운동',desc:'손가락 운동 1회 완료',icon:'✋',check:function(){return ls14Get('fingerCompleted',0)>=1;}},
  {id:'finger_master',name:'손가락 마스터',desc:'손가락 운동 10회 완료',icon:'💪',check:function(){return ls14Get('fingerCompleted',0)>=10;}},
  {id:'interval_ear',name:'음정 귀',desc:'음정 퀀즈 3회',icon:'👂',check:function(){return ls14Get('intervalPlayed',0)>=3;}},
  {id:'interval_perfect',name:'완벽한 귀',desc:'음정 퀀즈 9점 이상',icon:'🎯',check:function(){return ls14Get('intervalBest',0)>=9;}},
  {id:'pedal_user',name:'페달 사용자',desc:'페달 10회 사용',icon:'🦶',check:function(){return ls14Get('pedalUsed',0)>=10;}},
  {id:'sheet_creator',name:'악보 창작자',desc:'악보 5개 생성',icon:'🎼',check:function(){return ls14Get('sheetsGenerated',0)>=5;}},
  {id:'ambience_all',name:'분위기 마스터',desc:'모든 분위기 사용',icon:'🎶',check:function(){return (ls14Get('ambienceUsed',[])).length>=8;}},
  {id:'prog_student',name:'진행 학생',desc:'코드 진행 3회 재생',icon:'🎹',check:function(){return ls14Get('progsPlayed',0)>=3;}},
  {id:'prog_master',name:'진행 마스터',desc:'코드 진행 10회 재생',icon:'🎨',check:function(){return ls14Get('progsPlayed',0)>=10;}},
  {id:'sightplay_ace',name:'초견 에이스',desc:'초견 연주 8점 이상',icon:'👁️',check:function(){return ls14Get('sightBest',0)>=8;}},
  {id:'museum_explorer',name:'역사 탐험가',desc:'박물관 8개 이상 읽기',icon:'🏛️',check:function(){return (ls14Get('museumRead',[])).length>=8;}},
  {id:'v14_explorer',name:'v14 탐험가',desc:'6기능 사용',icon:'🚀',check:function(){
    var c=0;
    if(ls14Get('fingerCompleted',0)>0)c++;
    if(ls14Get('intervalPlayed',0)>0)c++;
    if(ls14Get('pedalUsed',0)>0)c++;
    if(ls14Get('sheetsGenerated',0)>0)c++;
    if((ls14Get('ambienceUsed',[])).length>0)c++;
    if(ls14Get('progsPlayed',0)>0)c++;
    if(ls14Get('sightPlayed',0)>0)c++;
    if((ls14Get('museumRead',[])).length>0)c++;
    return c>=6;
  }}
];

function checkV14Achievements(){
  var u=ls14Get('unlockedAch14',[]);
  V14_ACH.forEach(function(a){
    if(u.indexOf(a.id)===-1&&a.check()){
      u.push(a.id);ls14Set('unlockedAch14',u);
      if(window.app&&window.app.showToast) window.app.showToast('🏆 업적: '+a.icon+' '+a.name,'achievement');
      playSFX14('v14_achieve');
    }
  });
}

function injectV14Achievements(){
  var grid=document.querySelector('.achievement-grid');if(!grid)return;
  var u=ls14Get('unlockedAch14',[]);
  V14_ACH.forEach(function(a){
    var el=document.createElement('div');
    el.className='achievement'+(u.indexOf(a.id)!==-1?' unlocked':'');
    el.style.cssText='padding:8px;text-align:center;border-radius:8px;border:1px solid var(--border);background:var(--surface2)';
    el.innerHTML='<div class="achievement-icon">'+a.icon+'</div><div>'+a.name+'</div><div style="font-size:8px;margin-top:2px">'+a.desc+'</div>';
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTIONS & SHORTCUTS ================
function injectV14QuickActions(){
  var tabSongs=document.getElementById('tab-songs');if(!tabSongs)return;
  var bar=document.createElement('div');
  bar.className='v14-quick-actions';
  bar.style.cssText='display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  [
    {label:'✋ 손가락',fn:function(){document.getElementById('finger-modal').style.display='flex';}},
    {label:'🎵 음정',fn:function(){document.getElementById('interval-modal').style.display='flex';}},
    {label:'🦶 페달',fn:function(){document.getElementById('pedal-modal').style.display='flex';}},
    {label:'🎼 악보',fn:function(){document.getElementById('sheet-modal').style.display='flex';}},
    {label:'🎶 분위기',fn:function(){document.getElementById('ambience-modal').style.display='flex';}},
    {label:'🎹 진행',fn:function(){document.getElementById('chordprog-modal').style.display='flex';}},
    {label:'🎯 초견',fn:function(){document.getElementById('sightplay-modal').style.display='flex';}},
    {label:'🏛️ 역사',fn:function(){document.getElementById('museum-modal').style.display='flex';}},
    {label:'🏆 퀀즈v5',fn:function(){document.getElementById('quiz5-modal').style.display='flex';}}
  ].forEach(function(a){
    var btn=document.createElement('button');
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap';
    btn.textContent=a.label;btn.addEventListener('click',a.fn);bar.appendChild(btn);
  });
  var v13bar=tabSongs.querySelector('.v13-quick-actions');
  if(v13bar) v13bar.parentNode.insertBefore(bar, v13bar.nextSibling);
  else{var fb=tabSongs.querySelector('.filter-bar');if(fb) fb.parentNode.insertBefore(bar,fb);else tabSongs.insertBefore(bar,tabSongs.firstChild);}
}

function setupV14Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key){
      case 'F':if(!e.ctrlKey){e.preventDefault();document.getElementById('finger-modal').style.display='flex';}break;
      case 'V':e.preventDefault();document.getElementById('interval-modal').style.display='flex';break;
      case 'P':if(!e.ctrlKey){e.preventDefault();document.getElementById('pedal-modal').style.display='flex';}break;
      case 'M':e.preventDefault();document.getElementById('sheet-modal').style.display='flex';break;
      case 'A':e.preventDefault();document.getElementById('ambience-modal').style.display='flex';break;
      case 'G':e.preventDefault();document.getElementById('chordprog-modal').style.display='flex';break;
      case 'E':e.preventDefault();document.getElementById('sightplay-modal').style.display='flex';break;
      case 'H':e.preventDefault();document.getElementById('museum-modal').style.display='flex';break;
    }
  });
}

// ================ INIT ================
function initV14(){
  addV14Songs();
  buildFingerUI();
  buildIntervalUI();
  buildPedalUI();
  buildSheetUI();
  buildAmbienceUI();
  buildChordProgUI();
  buildSightPlayUI();
  buildMuseumUI();
  buildQuizV5UI();
  injectV14QuickActions();
  injectV14Achievements();
  setupV14Shortcuts();
  setInterval(checkV14Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV14,2500);});
else setTimeout(initV14,2500);
})();
