// Piano Master v13 Patch Module
// Scale Practice Lab, Chord Encyclopedia, Daily Warmup, Music Dictionary,
// Duet Mode, Practice Analytics Canvas, Favorites, Share Card Canvas,
// 10 Songs (92→102), Quiz v4 15Q, 12 Achievements, SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v13Loaded) return;
window.__v13Loaded = true;

const LS13 = 'piano-v13-';
function ls13Get(k,d){try{return JSON.parse(localStorage.getItem(LS13+k))||d}catch{return d}}
function ls13Set(k,v){localStorage.setItem(LS13+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v13 ================
const sfx13 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX13(type){
  if(!sfx13) return;
  if(sfx13.state==='suspended') sfx13.resume();
  const t=sfx13.currentTime, g=sfx13.createGain(), o=sfx13.createOscillator();
  g.connect(sfx13.destination); o.connect(g);
  switch(type){
    case 'scale_note':
      o.type='triangle';o.frequency.setValueAtTime(523+Math.random()*200,t);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
    case 'scale_done':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(()=>{if(!sfx13)return;const g2=sfx13.createGain(),o2=sfx13.createOscillator();g2.connect(sfx13.destination);o2.connect(g2);o2.type='triangle';o2.frequency.setValueAtTime(659,sfx13.currentTime);g2.gain.setValueAtTime(0.1,sfx13.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.1);o2.start(sfx13.currentTime);o2.stop(sfx13.currentTime+0.1);},100);
      setTimeout(()=>{if(!sfx13)return;const g3=sfx13.createGain(),o3=sfx13.createOscillator();g3.connect(sfx13.destination);o3.connect(g3);o3.type='triangle';o3.frequency.setValueAtTime(784,sfx13.currentTime);g3.gain.setValueAtTime(0.1,sfx13.currentTime);g3.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.15);o3.start(sfx13.currentTime);o3.stop(sfx13.currentTime+0.15);},200);
      break;
    case 'chord_play':
      o.type='sine';o.frequency.setValueAtTime(440,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'warmup_tick':
      o.type='square';o.frequency.setValueAtTime(1000,t);
      g.gain.setValueAtTime(0.03,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
      o.start(t);o.stop(t+0.04);break;
    case 'warmup_done':
      o.type='triangle';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'dict_open':
      o.type='sine';o.frequency.setValueAtTime(660,t);o.frequency.linearRampToValueAtTime(880,t+0.15);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'duet_start':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(659,sfx13.currentTime);gg.gain.setValueAtTime(0.1,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.15);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.15);},150);
      break;
    case 'analytics_open':
      o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.linearRampToValueAtTime(784,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'fav_add':
      o.type='triangle';o.frequency.setValueAtTime(784,t);o.frequency.linearRampToValueAtTime(1047,t+0.1);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'share_capture':
      for(let i=0;i<5;i++){setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),n=sfx13.createBufferSource();gg.connect(sfx13.destination);const buf=sfx13.createBuffer(1,sfx13.sampleRate*0.03,sfx13.sampleRate);const d=buf.getChannelData(0);for(let j=0;j<d.length;j++)d[j]=(Math.random()*2-1)*0.04;n.buffer=buf;n.connect(gg);gg.gain.setValueAtTime(0.06,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.04);n.start(sfx13.currentTime);},i*50);}
      return;
    case 'quiz4_correct':
      o.type='triangle';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1175,t+0.1);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'achieve_v13':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      [659,784,1047].forEach((f,i)=>{setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(f,sfx13.currentTime);gg.gain.setValueAtTime(0.1,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.12);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.12);},(i+1)*120);});
      break;
  }
}

// ================ HELPER: PLAY NOTE ================
const NOTE_FREQ={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,'Db4':277.18,D4:293.66,'Eb4':311.13,E4:329.63,F4:349.23,'F#4':369.99,'Gb4':369.99,G4:392,'Ab4':415.3,A4:440,'Bb4':466.16,B4:493.88,C5:523.25,'Db5':554.37,D5:587.33,'Eb5':622.25,E5:659.26,F5:698.46,'F#5':739.99,G5:783.99,'Ab5':830.61,A5:880,'Bb5':932.33,B5:987.77,C6:1046.5};
function playNote13(noteName, dur){
  if(!sfx13) return;
  if(sfx13.state==='suspended') sfx13.resume();
  const freq=NOTE_FREQ[noteName];if(!freq) return;
  const t=sfx13.currentTime,g=sfx13.createGain(),o=sfx13.createOscillator();
  g.connect(sfx13.destination);o.connect(g);
  o.type='triangle';o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+(dur||0.4));
  o.start(t);o.stop(t+(dur||0.4));
}

// ================ 1. SCALE PRACTICE LAB ================
const SCALES = [
  {name:'C 메이저', notes:['C4','D4','E4','F4','G4','A4','B4','C5'], key:'C'},
  {name:'G 메이저', notes:['G4','A4','B4','C5','D5','E5','F#5','G5'], key:'G'},
  {name:'D 메이저', notes:['D4','E4','F#4','G4','A4','B4','Db5','D5'], key:'D'},
  {name:'F 메이저', notes:['F4','G4','A4','Bb4','C5','D5','E5','F5'], key:'F'},
  {name:'Bb 메이저', notes:['Bb4','C5','D5','Eb5','F5','G5','A5','Bb5'], key:'Bb'},
  {name:'Eb 메이저', notes:['Eb4','F4','G4','Ab4','Bb4','C5','D5','Eb5'], key:'Eb'},
  {name:'A 마이너', notes:['A4','B4','C5','D5','E5','F5','Ab5','A5'], key:'Am'},
  {name:'D 마이너', notes:['D4','E4','F4','G4','A4','Bb4','Db5','D5'], key:'Dm'},
  {name:'E 마이너', notes:['E4','F#4','G4','A4','B4','C5','Eb5','E5'], key:'Em'},
  {name:'G 마이너', notes:['G4','A4','Bb4','C5','D5','Eb5','F#5','G5'], key:'Gm'},
  {name:'C 크로매틱', notes:['C4','Db4','D4','Eb4','E4','F4','F#4','G4','Ab4','A4','Bb4','B4','C5'], key:'Cr'},
  {name:'C 페니토닉', notes:['C4','Db4','E4','F4','G4','Ab4','B4','C5'], key:'Pent'}
];
let scaleCompleted = ls13Get('scaleCompleted',[]);

function buildScaleUI(){
  const modal = document.createElement('div');
  modal.id = 'scale-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let items = SCALES.map((s,i)=>{
    const done=scaleCompleted.includes(i);
    return `<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)">
      <span style="font-size:16px">${done?'✅':'🎹'}</span>
      <div style="flex:1;text-align:left"><div style="font-size:12px;font-weight:600">${s.name}</div>
      <div style="font-size:10px;color:var(--text2);margin-top:2px">${s.notes.join(' → ')}</div></div>
      <button onclick="playScaleDemo(${i})" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface);color:var(--accent);font-size:10px;cursor:pointer">▶ 듣기</button>
      <button onclick="completeScale(${i})" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:${done?'var(--green)':'var(--accent)'};color:white;font-size:10px;cursor:pointer">${done?'완료':'연습'}</button>
    </div>`;
  }).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎹 음계 연습실 (${scaleCompleted.length}/${SCALES.length})</h2>
      <button onclick="document.getElementById('scale-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">스케일을 순서대로 연습하고 완료하세요</p>
    <canvas id="scale-canvas" width="440" height="100" style="width:100%;max-width:440px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px;display:none"></canvas>
    <div style="display:flex;flex-direction:column;gap:6px">${items}</div>
  </div>`;
  document.body.appendChild(modal);
}
window.playScaleDemo = function(idx){
  const s=SCALES[idx];
  const canvas=document.getElementById('scale-canvas');
  if(canvas){
    canvas.style.display='block';
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#141828';ctx.fillRect(0,0,w,h);
    const gap=w/(s.notes.length+1);
    s.notes.forEach((n,i)=>{
      const x=gap*(i+1);
      ctx.fillStyle=i===0||i===s.notes.length-1?'#4a7dff':'#a855f7';
      ctx.beginPath();ctx.arc(x,h/2,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(n.replace(/\d/,''),x,h/2+4);
    });
    ctx.strokeStyle='#4a7dff44';ctx.lineWidth=2;ctx.beginPath();
    s.notes.forEach((n,i)=>{const x=gap*(i+1);if(i===0)ctx.moveTo(x,h/2);else ctx.lineTo(x,h/2);});
    ctx.stroke();ctx.textAlign='start';
  }
  s.notes.forEach((n,i)=>{setTimeout(()=>playNote13(n,0.3),i*300);});
  playSFX13('scale_note');
};
window.completeScale = function(idx){
  if(!scaleCompleted.includes(idx)){
    scaleCompleted.push(idx);ls13Set('scaleCompleted',scaleCompleted);
    playSFX13('scale_done');
    if(window.app&&window.app.showToast) window.app.showToast('✅ 스케일 완료: '+SCALES[idx].name,'success');
    document.getElementById('scale-modal').style.display='none';
    buildScaleUI();document.getElementById('scale-modal').style.display='flex';
  }
};

// ================ 2. CHORD ENCYCLOPEDIA ================
const CHORDS = [
  {name:'C', type:'메이저', notes:['C4','E4','G4'], color:'#4a7dff'},
  {name:'D', type:'메이저', notes:['D4','F#4','A4'], color:'#22c55e'},
  {name:'E', type:'메이저', notes:['E4','Ab4','B4'], color:'#eab308'},
  {name:'F', type:'메이저', notes:['F4','A4','C5'], color:'#ef4444'},
  {name:'G', type:'메이저', notes:['G4','B4','D5'], color:'#a855f7'},
  {name:'A', type:'메이저', notes:['A4','Db5','E5'], color:'#06b6d4'},
  {name:'Cm', type:'마이너', notes:['C4','Eb4','G4'], color:'#4a7dff'},
  {name:'Dm', type:'마이너', notes:['D4','F4','A4'], color:'#22c55e'},
  {name:'Em', type:'마이너', notes:['E4','G4','B4'], color:'#eab308'},
  {name:'Fm', type:'마이너', notes:['F4','Ab4','C5'], color:'#ef4444'},
  {name:'Gm', type:'마이너', notes:['G4','Bb4','D5'], color:'#a855f7'},
  {name:'Am', type:'마이너', notes:['A4','C5','E5'], color:'#06b6d4'},
  {name:'C7', type:'7th', notes:['C4','E4','G4','Bb4'], color:'#f97316'},
  {name:'D7', type:'7th', notes:['D4','F#4','A4','C5'], color:'#f97316'},
  {name:'G7', type:'7th', notes:['G4','B4','D5','F5'], color:'#f97316'},
  {name:'A7', type:'7th', notes:['A4','Db5','E5','G5'], color:'#f97316'},
  {name:'Cmaj7', type:'maj7', notes:['C4','E4','G4','B4'], color:'#ec4899'},
  {name:'Fmaj7', type:'maj7', notes:['F4','A4','C5','E5'], color:'#ec4899'},
  {name:'Cdim', type:'dim', notes:['C4','Eb4','Gb4'], color:'#6b7280'},
  {name:'Ddim', type:'dim', notes:['D4','F4','Ab4'], color:'#6b7280'},
  {name:'Caug', type:'aug', notes:['C4','E4','Ab4'], color:'#10b981'},
  {name:'Csus4', type:'sus', notes:['C4','F4','G4'], color:'#8b5cf6'},
  {name:'Dsus4', type:'sus', notes:['D4','G4','A4'], color:'#8b5cf6'},
  {name:'C6', type:'6th', notes:['C4','E4','G4','A4'], color:'#dc2626'}
];
let chordFilter = 'all';
function buildChordUI(){
  const modal = document.createElement('div');
  modal.id = 'chord-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const types=[...new Set(CHORDS.map(c=>c.type))];
  let filterHtml = `<button class="chord-filter active" data-f="all" onclick="filterChords('all')" style="padding:4px 10px;border-radius:12px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:10px;cursor:pointer">전체</button>`;
  types.forEach(t=>{filterHtml+=`<button class="chord-filter" data-f="${t}" onclick="filterChords('${t}')" style="padding:4px 10px;border-radius:12px;border:1px solid var(--border);background:none;color:var(--text2);font-size:10px;cursor:pointer">${t}</button>`;});
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,500px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎶 화음 백과사전 (${CHORDS.length}종)</h2>
      <button onclick="document.getElementById('chord-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">${filterHtml}</div>
    <div id="chord-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderChords();
}
function renderChords(){
  const el=document.getElementById('chord-list');if(!el)return;
  const filtered=chordFilter==='all'?CHORDS:CHORDS.filter(c=>c.type===chordFilter);
  el.innerHTML=filtered.map((c,i)=>`<div style="padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);text-align:center;cursor:pointer" onclick="playChord13(${CHORDS.indexOf(c)})">
    <div style="font-size:18px;font-weight:700;color:${c.color}">${c.name}</div>
    <div style="font-size:9px;color:var(--text2);margin:4px 0">${c.type}</div>
    <div style="font-size:10px;color:var(--text)">${c.notes.join(' ')}</div>
  </div>`).join('');
}
window.filterChords = function(f){
  chordFilter=f;
  document.querySelectorAll('.chord-filter').forEach(b=>{
    const isActive=b.dataset.f===f;
    b.style.background=isActive?'var(--accent)':'none';
    b.style.color=isActive?'white':'var(--text2)';
    b.style.borderColor=isActive?'var(--accent)':'var(--border)';
  });
  renderChords();
};
window.playChord13 = function(idx){
  const c=CHORDS[idx];
  c.notes.forEach((n,i)=>{setTimeout(()=>playNote13(n,0.6),i*80);});
  playSFX13('chord_play');
  ls13Set('chordsPlayed',(ls13Get('chordsPlayed',0))+1);
};

// ================ 3. DAILY WARMUP ================
const WARMUPS = [
  {name:'손가락 스트레칭', desc:'각 손가락 10초씩 펴고 풍기', time:50, icon:'✋'},
  {name:'손목 회전', desc:'양손 손목 10회 회전', time:30, icon:'🔄'},
  {name:'C 메이저 스케일', desc:'상행 + 하행 천천히', time:40, icon:'🎵'},
  {name:'하노버 연습', desc:'콜바로 놓고 건반 누르기', time:30, icon:'⬇️'},
  {name:'옥타브 점프', desc:'C4-C5 반복 점프', time:30, icon:'↕️'},
  {name:'코드 체인지', desc:'C-F-G-C 코드 체인지', time:40, icon:'🔗'},
  {name:'아르페지오 마이너', desc:'Am-Dm-Em-Am 아르페지오', time:40, icon:'🎶'},
  {name:'양손 독립 움직임', desc:'오른손 상행 + 왼손 하행 동시', time:60, icon:'🤲'}
];
let warmupDone = ls13Get('warmupDone',{});

function buildWarmupUI(){
  const modal = document.createElement('div');
  modal.id = 'warmup-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const today=new Date().toISOString().slice(0,10);
  const todayDone=warmupDone[today]||[];
  const allDone=todayDone.length>=WARMUPS.length;
  let items=WARMUPS.map((w,i)=>{
    const done=todayDone.includes(i);
    return `<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface2);border-radius:8px;border:1px solid ${done?'var(--green)':'var(--border)'}">
      <span style="font-size:18px">${w.icon}</span>
      <div style="flex:1;text-align:left"><div style="font-size:12px;font-weight:600">${w.name}</div>
      <div style="font-size:10px;color:var(--text2)">${w.desc} (${w.time}초)</div></div>
      <button onclick="doWarmup(${i})" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:${done?'var(--green)':'var(--accent)'};color:white;font-size:10px;cursor:pointer">${done?'✅':'시작'}</button>
    </div>`;
  }).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🌟 데일리 워밍업 (${todayDone.length}/${WARMUPS.length})</h2>
      <button onclick="document.getElementById('warmup-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    ${allDone?'<div style="text-align:center;padding:8px;color:var(--green);font-size:13px;font-weight:600;margin-bottom:8px">🎉 오늘 워밍업 완료!</div>':''}
    <div id="warmup-timer" style="text-align:center;font-size:24px;font-weight:700;color:var(--accent);min-height:36px;margin-bottom:8px"></div>
    <div style="display:flex;flex-direction:column;gap:6px">${items}</div>
  </div>`;
  document.body.appendChild(modal);
}
let warmupInterval=null;
window.doWarmup = function(idx){
  const today=new Date().toISOString().slice(0,10);
  const todayDone=warmupDone[today]||[];
  if(todayDone.includes(idx)) return;
  const w=WARMUPS[idx];
  let remaining=w.time;
  const timerEl=document.getElementById('warmup-timer');
  if(warmupInterval) clearInterval(warmupInterval);
  timerEl.textContent=remaining+'초';
  playSFX13('warmup_tick');
  warmupInterval=setInterval(()=>{
    remaining--;
    if(timerEl) timerEl.textContent=remaining>0?remaining+'초':'✅ 완료!';
    if(remaining<=0){
      clearInterval(warmupInterval);warmupInterval=null;
      todayDone.push(idx);warmupDone[today]=todayDone;ls13Set('warmupDone',warmupDone);
      ls13Set('warmupTotal',(ls13Get('warmupTotal',0))+1);
      playSFX13('warmup_done');
      document.getElementById('warmup-modal').style.display='none';
      buildWarmupUI();document.getElementById('warmup-modal').style.display='flex';
    }
  },1000);
};

// ================ 4. MUSIC DICTIONARY ================
const DICT_ENTRIES = [
  {term:'Adagio',def:'느리게 (BPM 66-76)',cat:'빠르기'},
  {term:'Allegro',def:'빠르게 (BPM 120-156)',cat:'빠르기'},
  {term:'Andante',def:'걷는 속도로 (BPM 76-108)',cat:'빠르기'},
  {term:'Presto',def:'매우 빠르게 (BPM 168-200)',cat:'빠르기'},
  {term:'Moderato',def:'보통 빠르기로 (BPM 108-120)',cat:'빠르기'},
  {term:'Largo',def:'매우 느리게 (BPM 40-66)',cat:'빠르기'},
  {term:'Vivace',def:'활발하고 빠르게 (BPM 156-176)',cat:'빠르기'},
  {term:'Ritardando (rit.)',def:'점점 느리게',cat:'빠르기'},
  {term:'Piano (p)',def:'여리게',cat:'셈여법'},
  {term:'Forte (f)',def:'세게',cat:'셈여법'},
  {term:'Fortissimo (ff)',def:'매우 세게',cat:'셈여법'},
  {term:'Pianissimo (pp)',def:'매우 여리게',cat:'셈여법'},
  {term:'Mezzo Forte (mf)',def:'조금 세게',cat:'셈여법'},
  {term:'Mezzo Piano (mp)',def:'조금 여리게',cat:'셈여법'},
  {term:'Crescendo',def:'점점 세게',cat:'셈여법'},
  {term:'Diminuendo',def:'점점 여리게',cat:'셈여법'},
  {term:'Legato',def:'매끄럽게 이어서',cat:'주법'},
  {term:'Staccato',def:'끊어서 짧게',cat:'주법'},
  {term:'Fermata',def:'늘임표, 적당히 늘여서',cat:'주법'},
  {term:'Sforzando (sfz)',def:'갑자기 세게',cat:'주법'},
  {term:'Tenuto',def:'음표의 길이를 충분히',cat:'주법'},
  {term:'Marcato',def:'강조하여',cat:'주법'},
  {term:'Portamento',def:'음을 미끄러져 이동',cat:'주법'},
  {term:'Arpeggio',def:'화음을 순차적으로 연주',cat:'용어'},
  {term:'Cadence',def:'종지형, 악구의 끝맺음',cat:'용어'},
  {term:'Chord',def:'화음, 3개 이상의 음 동시 연주',cat:'용어'},
  {term:'Scale',def:'음계, 음의 순차적 배열',cat:'용어'},
  {term:'Octave',def:'옥타브, 같은 음이름의 8도 간격',cat:'용어'},
  {term:'Interval',def:'음정, 두 음 사이의 거리',cat:'용어'},
  {term:'Key Signature',def:'조표, 조성을 나타내는 변화표',cat:'용어'},
  {term:'Time Signature',def:'박자표, 마디의 박자 수',cat:'용어'},
  {term:'Trill',def:'트릴, 빠른 교대 연주',cat:'기법'},
  {term:'Glissando',def:'글리산도, 건반을 미끄러져 연주',cat:'기법'},
  {term:'Pedal',def:'페달, 음을 유지/소멸시키는 장치',cat:'기법'},
  {term:'Tremolo',def:'트레몰로, 같은 음의 빠른 반복',cat:'기법'},
  {term:'Grace Note',def:'꾸미음, 주음표 앞의 짧은 장식음',cat:'기법'},
  {term:'Mordent',def:'모르덴트, 주음+인접음 빠른 교대',cat:'기법'},
  {term:'Turn',def:'턴, 주음 위아래 음 경유 장식',cat:'기법'},
  {term:'Rubato',def:'루바토, 템포를 자유롭게 신축',cat:'기법'},
  {term:'Da Capo (D.C.)',def:'처음부터 다시',cat:'구조'},
  {term:'Coda',def:'코다, 곡의 끝맺음 부분',cat:'구조'}
];
let dictSearch='';
function buildDictUI(){
  const modal = document.createElement('div');
  modal.id = 'dict-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const cats=[...new Set(DICT_ENTRIES.map(e=>e.cat))];
  let catBtns=`<button class="dict-cat active" data-c="all" onclick="filterDict('all')" style="padding:4px 8px;border-radius:12px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:10px;cursor:pointer">전체</button>`;
  cats.forEach(c=>{catBtns+=`<button class="dict-cat" data-c="${c}" onclick="filterDict('${c}')" style="padding:4px 8px;border-radius:12px;border:1px solid var(--border);background:none;color:var(--text2);font-size:10px;cursor:pointer">${c}</button>`;});
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,500px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">📖 음악 용어 사전 (${DICT_ENTRIES.length}항목)</h2>
      <button onclick="document.getElementById('dict-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <input id="dict-search" type="text" placeholder="검색..." oninput="searchDict(this.value)" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;margin-bottom:8px;box-sizing:border-box">
    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">${catBtns}</div>
    <div id="dict-list" style="display:flex;flex-direction:column;gap:4px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderDict('all','');
}
let dictCatFilter='all';
function renderDict(cat,search){
  const el=document.getElementById('dict-list');if(!el)return;
  let filtered=DICT_ENTRIES;
  if(cat!=='all') filtered=filtered.filter(e=>e.cat===cat);
  if(search) filtered=filtered.filter(e=>e.term.toLowerCase().includes(search.toLowerCase())||e.def.includes(search));
  el.innerHTML=filtered.map(e=>`<div style="padding:8px 10px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:13px;font-weight:600;color:var(--accent)">${e.term}</span>
      <span style="font-size:9px;color:var(--text2);background:var(--surface);padding:2px 6px;border-radius:4px">${e.cat}</span>
    </div>
    <div style="font-size:11px;color:var(--text);margin-top:4px">${e.def}</div>
  </div>`).join('');
  ls13Set('dictViewed',(ls13Get('dictViewed',0))+1);
}
window.filterDict = function(c){
  dictCatFilter=c;
  document.querySelectorAll('.dict-cat').forEach(b=>{
    const isActive=b.dataset.c===c;
    b.style.background=isActive?'var(--accent)':'none';
    b.style.color=isActive?'white':'var(--text2)';
    b.style.borderColor=isActive?'var(--accent)':'var(--border)';
  });
  renderDict(c,document.getElementById('dict-search')?.value||'');
};
window.searchDict = function(v){renderDict(dictCatFilter,v);};

// ================ 5. DUET MODE ================
const DUETS = [
  {name:'캐논 in D', desc:'1st: 멜로디 / 2nd: 반주',
    melody:[{n:'F#5',t:0,d:1},{n:'E5',t:1,d:1},{n:'D5',t:2,d:1},{n:'C#5',t:3,d:1},{n:'B4',t:4,d:1},{n:'A4',t:5,d:1},{n:'B4',t:6,d:1},{n:'C#5',t:7,d:1}],
    accomp:[{n:'D4',t:0,d:2},{n:'A3',t:2,d:2},{n:'B3',t:4,d:2},{n:'F#4',t:6,d:2}]},
  {name:'아리랑', desc:'멜로디 + 화성 반주',
    melody:[{n:'A4',t:0,d:0.5},{n:'A4',t:0.6,d:0.5},{n:'A4',t:1.2,d:1},{n:'B4',t:2.4,d:0.5},{n:'C5',t:3,d:1},{n:'B4',t:4.2,d:0.5},{n:'A4',t:4.8,d:1}],
    accomp:[{n:'A3',t:0,d:1.2},{n:'E3',t:1.2,d:1.2},{n:'A3',t:2.4,d:1.2},{n:'E3',t:4.2,d:1.2}]},
  {name:'미뉴에트', desc:'바흐 미뉴에트 듀엇',
    melody:[{n:'D5',t:0,d:0.8},{n:'C#5',t:0.9,d:0.4},{n:'D5',t:1.4,d:0.8},{n:'E5',t:2.3,d:0.8},{n:'D5',t:3.2,d:0.8},{n:'C#5',t:4.1,d:0.4},{n:'D5',t:4.6,d:0.8}],
    accomp:[{n:'D3',t:0,d:1.4},{n:'A3',t:1.4,d:1.4},{n:'D3',t:2.8,d:1.4},{n:'A3',t:4.1,d:1.4}]},
  {name:'봄 노래', desc:'멜디와 함께',
    melody:[{n:'E5',t:0,d:0.5},{n:'D5',t:0.6,d:0.5},{n:'C5',t:1.2,d:0.5},{n:'D5',t:1.8,d:0.5},{n:'E5',t:2.4,d:0.5},{n:'E5',t:3,d:0.5},{n:'E5',t:3.6,d:1}],
    accomp:[{n:'C3',t:0,d:1.2},{n:'G3',t:1.2,d:1.2},{n:'C3',t:2.4,d:1.2},{n:'G3',t:3.6,d:1}]},
  {name:'반짝반짝 작은별', desc:'쉽고 즐거운 듀엇',
    melody:[{n:'C4',t:0,d:0.4},{n:'C4',t:0.5,d:0.4},{n:'G4',t:1,d:0.4},{n:'G4',t:1.5,d:0.4},{n:'A4',t:2,d:0.4},{n:'A4',t:2.5,d:0.4},{n:'G4',t:3,d:0.8}],
    accomp:[{n:'C3',t:0,d:1},{n:'E3',t:1,d:1},{n:'F3',t:2,d:1},{n:'C3',t:3,d:0.8}]},
  {name:'세레나데', desc:'슈베르트 세레나데 듀엇',
    melody:[{n:'D4',t:0,d:0.8},{n:'D4',t:0.9,d:0.4},{n:'F4',t:1.4,d:0.8},{n:'A4',t:2.3,d:1.2},{n:'G4',t:3.7,d:0.4},{n:'F4',t:4.2,d:0.4},{n:'E4',t:4.7,d:0.8}],
    accomp:[{n:'D3',t:0,d:1.4},{n:'A3',t:1.4,d:1.2},{n:'F3',t:2.6,d:1.4},{n:'C3',t:4.2,d:1.4}]}
];
let duetPlaying=false;
function buildDuetUI(){
  const modal = document.createElement('div');
  modal.id = 'duet-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let items=DUETS.map((d,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" onclick="playDuet(${i})">
    <span style="font-size:20px">🎵</span>
    <div style="flex:1"><div style="font-size:12px;font-weight:600">${d.name}</div><div style="font-size:10px;color:var(--text2)">${d.desc}</div></div>
    <span style="font-size:10px;color:var(--accent)">▶ 재생</span>
  </div>`).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎹 듀엇 모드 (${DUETS.length}곡)</h2>
      <button onclick="document.getElementById('duet-modal').style.display='none';duetPlaying=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">AI가 반주를 연주합니다. 멜로디를 따라 연주하세요!</p>
    <div id="duet-status" style="text-align:center;font-size:13px;min-height:24px;margin-bottom:10px;color:var(--accent)"></div>
    <div style="display:flex;flex-direction:column;gap:6px">${items}</div>
  </div>`;
  document.body.appendChild(modal);
}
window.playDuet = function(idx){
  if(duetPlaying) return;
  duetPlaying=true;
  const d=DUETS[idx];
  document.getElementById('duet-status').innerHTML='🎶 <b>'+d.name+'</b> 연주 중...';
  playSFX13('duet_start');
  ls13Set('duetPlayed',(ls13Get('duetPlayed',0))+1);
  d.melody.forEach(n=>{setTimeout(()=>playNote13(n.n,n.d*0.8),n.t*500);});
  d.accomp.forEach(n=>{setTimeout(()=>playNote13(n.n,n.d*0.8),n.t*500);});
  const totalTime=Math.max(...d.melody.map(n=>n.t+n.d),...d.accomp.map(n=>n.t+n.d));
  setTimeout(()=>{duetPlaying=false;document.getElementById('duet-status').textContent='✅ 연주 완료!';},totalTime*500+500);
};

// ================ 6. PRACTICE ANALYTICS CANVAS ================
function buildAnalyticsUI(){
  const modal = document.createElement('div');
  modal.id = 'analytics-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,500px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">📊 연습 분석 대시보드</h2>
      <button onclick="document.getElementById('analytics-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="analytics-canvas" width="420" height="360" style="width:100%;max-width:420px;border-radius:8px;margin-bottom:12px"></canvas>
    <div id="analytics-metrics" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px"></div>
    <div id="analytics-tips" style="font-size:11px;color:var(--text2);text-align:left;padding:8px;background:var(--surface2);border-radius:8px"></div>
  </div>`;
  document.body.appendChild(modal);
}
function renderAnalytics(){
  const canvas=document.getElementById('analytics-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2-10,r=120;
  const labels=['정확도','속도','리듬감','완주율','꾸준함'];
  const stats=window.app?window.app.stats:{};
  const totalPlays=stats.totalPlays||ls13Get('totalPlays',1);
  const avgScore=totalPlays>0?Math.round((stats.totalScore||0)/totalPlays):50;
  const completed=stats.songsCompleted?stats.songsCompleted.size:ls13Get('songsCompleted',0);
  const totalSongs=typeof SONGS!=='undefined'?SONGS.length:92;
  const vals=[
    Math.min(100,avgScore),
    Math.min(100,Math.round(totalPlays*5)),
    Math.min(100,ls13Get('rhythmPlayed',0)*10+ls13Get('sightTotal',0)*2),
    Math.min(100,Math.round(completed/totalSongs*100)),
    Math.min(100,ls13Get('bestStreak',0)*10+ls13Get('warmupTotal',0)*5)
  ];
  const angles=labels.map((_,i)=>(Math.PI*2*i/labels.length)-Math.PI/2);
  for(let level=4;level>=1;level--){
    const lr=r*level/4;
    ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.beginPath();
    angles.forEach((a,i)=>{const x=cx+Math.cos(a)*lr,y=cy+Math.sin(a)*lr;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.closePath();ctx.stroke();
  }
  angles.forEach((a,i)=>{
    ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    const lx=cx+Math.cos(a)*(r+20),ly=cy+Math.sin(a)*(r+20);
    ctx.fillText(labels[i],lx,ly);
  });
  ctx.fillStyle='rgba(74,125,255,0.15)';ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
  vals.forEach((v,i)=>{
    const vr=r*v/100;const x=cx+Math.cos(angles[i])*vr,y=cy+Math.sin(angles[i])*vr;
    if(i===0) ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.closePath();ctx.fill();ctx.stroke();
  vals.forEach((v,i)=>{
    const vr=r*v/100;const x=cx+Math.cos(angles[i])*vr,y=cy+Math.sin(angles[i])*vr;
    ctx.fillStyle='#4a7dff';ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e8ecf4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(v+'%',x,y-10);
  });
  ctx.textAlign='start';
  const overall=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  const grade=overall>=90?'S':overall>=75?'A':overall>=60?'B':overall>=40?'C':'D';
  ctx.fillStyle={S:'#ffd700',A:'#22c55e',B:'#3b82f6',C:'#eab308',D:'#ef4444'}[grade];
  ctx.font='bold 28px sans-serif';ctx.textAlign='center';
  ctx.fillText(grade+' 등급',cx,h-15);ctx.textAlign='start';
  const mEl=document.getElementById('analytics-metrics');
  if(mEl) mEl.innerHTML=[
    {label:'총 연주',val:totalPlays+'회',color:'var(--accent)'},
    {label:'평균 점수',val:avgScore+'점',color:'var(--green)'},
    {label:'완주곡',val:completed+'곡',color:'var(--yellow)'}
  ].map(m=>`<div style="padding:8px;background:var(--surface2);border-radius:6px;text-align:center"><div style="font-size:18px;font-weight:700;color:${m.color}">${m.val}</div><div style="font-size:10px;color:var(--text2)">${m.label}</div></div>`).join('');
  const tEl=document.getElementById('analytics-tips');
  if(tEl){
    const weakest=vals.indexOf(Math.min(...vals));
    const tips=['정확하게 누르는 연습이 필요합니다. 느리게 시작하세요.','더 많은 곡을 연습하세요!','리듬 패턴 연습을 추천합니다.','새로운 곡에 도전해보세요!','매일 꾸준히 연습하세요. 워밍업을 활용해보세요!'];
    tEl.innerHTML='💡 <b>추천:</b> '+tips[weakest];
  }
  playSFX13('analytics_open');
}

// ================ 7. FAVORITES COLLECTION ================
let favorites = ls13Get('favorites',[]);
function buildFavoritesUI(){
  const modal = document.createElement('div');
  modal.id = 'fav-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">❤️ 즐겨찾기 (${favorites.length}곡)</h2>
      <button onclick="document.getElementById('fav-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="fav-list"></div>
  </div>`;
  document.body.appendChild(modal);
  renderFavorites();
}
function renderFavorites(){
  const el=document.getElementById('fav-list');if(!el)return;
  if(!favorites.length){el.innerHTML='<div style="text-align:center;padding:20px;color:var(--text2)">곡 목록에서 ❤ 버튼으로 추가하세요</div>';return;}
  if(typeof SONGS==='undefined') return;
  el.innerHTML=favorites.map(id=>{
    const s=SONGS.find(s=>s.id===id);
    if(!s) return '';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);margin-bottom:4px">
      <span style="font-size:18px">${s.icon||'🎵'}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:600">${s.name}</div><div style="font-size:10px;color:var(--text2)">${s.category||''} · ${s.difficulty||'medium'}</div></div>
      <button onclick="removeFav('${id}')" style="background:none;border:none;color:var(--red);font-size:14px;cursor:pointer">✖</button>
    </div>`;
  }).join('');
}
window.removeFav = function(id){
  favorites=favorites.filter(f=>f!==id);ls13Set('favorites',favorites);renderFavorites();
};
window.toggleFav13 = function(id){
  if(favorites.includes(id)){favorites=favorites.filter(f=>f!==id);}
  else{favorites.push(id);playSFX13('fav_add');}
  ls13Set('favorites',favorites);
};
function injectFavButtons(){
  if(typeof SONGS==='undefined') return;
  const observer=new MutationObserver(()=>{
    document.querySelectorAll('.song-card').forEach(card=>{
      if(card.querySelector('.fav-btn-13')) return;
      const nameEl=card.querySelector('.song-name');
      if(!nameEl) return;
      const songName=nameEl.textContent;
      const song=SONGS.find(s=>s.name===songName);
      if(!song) return;
      const btn=document.createElement('button');
      btn.className='fav-btn-13';
      btn.style.cssText='background:none;border:none;font-size:14px;cursor:pointer;padding:2px 4px;flex-shrink:0';
      btn.textContent=favorites.includes(song.id)?'❤️':'🤍';
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        toggleFav13(song.id);
        btn.textContent=favorites.includes(song.id)?'❤️':'🤍';
      });
      card.appendChild(btn);
    });
  });
  const songList=document.querySelector('.song-list');
  if(songList) observer.observe(songList,{childList:true,subtree:true});
  setTimeout(()=>document.querySelectorAll('.song-card').forEach(card=>{
    if(card.querySelector('.fav-btn-13')) return;
    const nameEl=card.querySelector('.song-name');if(!nameEl) return;
    const songName=nameEl.textContent;
    const song=SONGS.find(s=>s.name===songName);if(!song) return;
    const btn=document.createElement('button');btn.className='fav-btn-13';
    btn.style.cssText='background:none;border:none;font-size:14px;cursor:pointer;padding:2px 4px;flex-shrink:0';
    btn.textContent=favorites.includes(song.id)?'❤️':'🤍';
    btn.addEventListener('click',e=>{e.stopPropagation();toggleFav13(song.id);btn.textContent=favorites.includes(song.id)?'❤️':'🤍';});
    card.appendChild(btn);
  }),2000);
}

// ================ 8. SHARE CARD CANVAS ================
function buildShareUI(){
  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">📤 공유 카드</h2>
      <button onclick="document.getElementById('share-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="share-canvas" width="600" height="380" style="width:100%;max-width:600px;border-radius:8px;margin-bottom:12px"></canvas>
    <div style="display:flex;gap:8px;justify-content:center">
      <button onclick="downloadShareCard()" style="padding:8px 16px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">📥 PNG 다운로드</button>
      <button onclick="copyShareCard()" style="padding:8px 16px;border-radius:8px;border:none;background:var(--green);color:white;font-size:12px;cursor:pointer">📋 클립보드</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}
function renderShareCard(){
  const canvas=document.getElementById('share-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const grad=ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#0f0c29');grad.addColorStop(0.5,'#302b63');grad.addColorStop(1,'#24243e');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  for(let i=0;i<w;i+=30){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=30){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
  ctx.fillStyle='#fff';ctx.font='bold 24px sans-serif';ctx.textAlign='center';
  ctx.fillText('🎹 Piano Master v13',w/2,45);
  ctx.font='14px sans-serif';ctx.fillStyle='#a8a4ce';
  ctx.fillText(new Date().toLocaleDateString('ko-KR'),w/2,70);
  const stats=window.app?window.app.stats:{};
  const totalPlays=stats.totalPlays||0;
  const totalNotes=stats.totalNotes||0;
  const avgScore=totalPlays>0?Math.round((stats.totalScore||0)/totalPlays):0;
  const completed=stats.songsCompleted?stats.songsCompleted.size:0;
  const streak=stats.streak||0;
  const totalSongs=typeof SONGS!=='undefined'?SONGS.length:102;
  const items=[
    {label:'총 연주',val:totalPlays+'회',icon:'🎵',color:'#4a7dff'},
    {label:'총 노트',val:totalNotes+'개',icon:'🎼',color:'#22c55e'},
    {label:'평균 점수',val:avgScore+'점',icon:'🎯',color:'#eab308'},
    {label:'완주곡',val:completed+'/'+totalSongs,icon:'✅',color:'#a855f7'},
    {label:'스트릭',val:streak+'일',icon:'🔥',color:'#ef4444'},
    {label:'즐겨찾기',val:favorites.length+'곡',icon:'❤️',color:'#ec4899'}
  ];
  const cols=3,rows=2,cardW=160,cardH=80,startX=(w-cols*cardW-(cols-1)*16)/2,startY=95;
  items.forEach((item,i)=>{
    const col=i%cols,row=Math.floor(i/cols);
    const x=startX+col*(cardW+16),y=startY+row*(cardH+12);
    ctx.fillStyle='rgba(255,255,255,0.08)';
    ctx.beginPath();
    const rr=10;ctx.moveTo(x+rr,y);ctx.lineTo(x+cardW-rr,y);ctx.quadraticCurveTo(x+cardW,y,x+cardW,y+rr);ctx.lineTo(x+cardW,y+cardH-rr);ctx.quadraticCurveTo(x+cardW,y+cardH,x+cardW-rr,y+cardH);ctx.lineTo(x+rr,y+cardH);ctx.quadraticCurveTo(x,y+cardH,x,y+cardH-rr);ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);
    ctx.fill();
    ctx.font='20px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';
    ctx.fillText(item.icon,x+cardW/2,y+28);
    ctx.font='bold 18px sans-serif';ctx.fillStyle=item.color;
    ctx.fillText(item.val,x+cardW/2,y+52);
    ctx.font='11px sans-serif';ctx.fillStyle='#a8a4ce';
    ctx.fillText(item.label,x+cardW/2,y+70);
  });
  ctx.font='11px sans-serif';ctx.fillStyle='#666';ctx.textAlign='center';
  ctx.fillText('Piano Master v13',w/2,h-15);
  ctx.textAlign='start';
  playSFX13('share_capture');
}
window.downloadShareCard = function(){
  const canvas=document.getElementById('share-canvas');if(!canvas)return;
  const link=document.createElement('a');link.download='piano-master-v13.png';link.href=canvas.toDataURL('image/png');link.click();
};
window.copyShareCard = function(){
  const canvas=document.getElementById('share-canvas');if(!canvas)return;
  canvas.toBlob(blob=>{
    if(!blob) return;
    try{navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);if(window.app&&window.app.showToast) window.app.showToast('📋 클립보드에 복사되었습니다!');}
    catch(e){if(window.app&&window.app.showToast) window.app.showToast('브라우저에서 지원되지 않습니다');}
  },'image/png');
};

// ================ 9. NEW SONGS (92→102) ================
function addV13Songs(){
  if(typeof SONGS==='undefined') return;
  const ids=SONGS.map(s=>s.id);
  const newSongs=[
    {id:'nocturne_op9',name:'녹턴 Op.9-2 (쇼팡)',category:'클래식',difficulty:'hard',icon:'🌙',color:'#6366f1',bpm:54,timeSignature:'12/8',
      notes:[{note:'Bb4',time:0,dur:1.2,hand:'R'},{note:'Db5',time:1.4,dur:0.6,hand:'R'},{note:'F5',time:2.2,dur:0.8,hand:'R'},{note:'Eb5',time:3.2,dur:0.6,hand:'R'},{note:'Db5',time:4,dur:0.6,hand:'R'},{note:'C5',time:4.8,dur:0.8,hand:'R'},{note:'Bb4',time:5.8,dur:1.5,hand:'R'},{note:'Bb3',time:0,dur:2.2,hand:'L'},{note:'F3',time:2.2,dur:2,hand:'L'},{note:'Gb3',time:4.8,dur:2.5,hand:'L'}]},
    {id:'river_flows',name:'River Flows in You (이루마)',category:'현대',difficulty:'medium',icon:'🌊',color:'#3b82f6',bpm:68,timeSignature:'4/4',
      notes:[{note:'A4',time:0,dur:0.4,hand:'R'},{note:'B4',time:0.5,dur:0.4,hand:'R'},{note:'C5',time:1,dur:0.4,hand:'R'},{note:'B4',time:1.5,dur:0.4,hand:'R'},{note:'A4',time:2,dur:0.4,hand:'R'},{note:'E4',time:2.5,dur:0.8,hand:'R'},{note:'A4',time:3.5,dur:0.4,hand:'R'},{note:'B4',time:4,dur:0.4,hand:'R'},{note:'C5',time:4.5,dur:0.4,hand:'R'},{note:'D5',time:5,dur:0.8,hand:'R'},{note:'A3',time:0,dur:1.5,hand:'L'},{note:'E3',time:2,dur:1.5,hand:'L'},{note:'F3',time:3.5,dur:1.5,hand:'L'},{note:'C3',time:5,dur:1.5,hand:'L'}]},
    {id:'prelude_c',name:'전주곡 C장조 (바흐)',category:'클래식',difficulty:'medium',icon:'✨',color:'#eab308',bpm:66,timeSignature:'4/4',
      notes:[{note:'C4',time:0,dur:0.2,hand:'R'},{note:'E4',time:0.25,dur:0.2,hand:'R'},{note:'G4',time:0.5,dur:0.2,hand:'R'},{note:'C5',time:0.75,dur:0.2,hand:'R'},{note:'E5',time:1,dur:0.2,hand:'R'},{note:'G4',time:1.25,dur:0.2,hand:'R'},{note:'C5',time:1.5,dur:0.2,hand:'R'},{note:'E5',time:1.75,dur:0.2,hand:'R'},{note:'C3',time:0,dur:2,hand:'L'}]},
    {id:'comptine',name:'Comptine (아멜리 푸랑)',category:'현대',difficulty:'medium',icon:'🍂',color:'#f59e0b',bpm:100,timeSignature:'3/4',
      notes:[{note:'E5',time:0,dur:0.3,hand:'R'},{note:'B4',time:0.4,dur:0.3,hand:'R'},{note:'C5',time:0.8,dur:0.3,hand:'R'},{note:'D5',time:1.2,dur:0.3,hand:'R'},{note:'C5',time:1.6,dur:0.3,hand:'R'},{note:'B4',time:2,dur:0.3,hand:'R'},{note:'A4',time:2.4,dur:0.3,hand:'R'},{note:'B4',time:2.8,dur:0.3,hand:'R'},{note:'E3',time:0,dur:1.2,hand:'L'},{note:'A3',time:1.2,dur:1.2,hand:'L'},{note:'D3',time:2.4,dur:1.2,hand:'L'}]},
    {id:'gymnopedie',name:'짐노페디 1번 (사티)',category:'클래식',difficulty:'easy',icon:'🌸',color:'#ec4899',bpm:72,timeSignature:'3/4',
      notes:[{note:'F#5',time:0,dur:1.5,hand:'R'},{note:'E5',time:1.8,dur:0.8,hand:'R'},{note:'F#5',time:2.8,dur:1.5,hand:'R'},{note:'B4',time:4.5,dur:0.8,hand:'R'},{note:'D5',time:5.5,dur:1.5,hand:'R'},{note:'G3',time:0,dur:1.5,hand:'L'},{note:'D3',time:1.8,dur:1.5,hand:'L'},{note:'G3',time:4,dur:1.5,hand:'L'}]},
    {id:'la_campanella',name:'라 캄파네라 (리스트)',category:'클래식',difficulty:'expert',icon:'🔔',color:'#ef4444',bpm:100,timeSignature:'6/8',
      notes:[{note:'Ab5',time:0,dur:0.15,hand:'R'},{note:'G5',time:0.18,dur:0.15,hand:'R'},{note:'Ab5',time:0.36,dur:0.3,hand:'R'},{note:'E5',time:0.72,dur:0.15,hand:'R'},{note:'Db5',time:0.9,dur:0.15,hand:'R'},{note:'E5',time:1.08,dur:0.15,hand:'R'},{note:'Ab5',time:1.26,dur:0.3,hand:'R'},{note:'Ab3',time:0,dur:0.72,hand:'L'},{note:'E3',time:0.72,dur:0.72,hand:'L'}]},
    {id:'hungarian',name:'헝가리 람소디 2번',category:'클래식',difficulty:'hard',icon:'🎻',color:'#dc2626',bpm:80,timeSignature:'2/4',
      notes:[{note:'C#5',time:0,dur:0.3,hand:'R'},{note:'D5',time:0.35,dur:0.3,hand:'R'},{note:'C#5',time:0.7,dur:0.15,hand:'R'},{note:'B4',time:0.88,dur:0.15,hand:'R'},{note:'C#5',time:1.06,dur:0.5,hand:'R'},{note:'A4',time:1.6,dur:0.3,hand:'R'},{note:'B4',time:1.95,dur:0.3,hand:'R'},{note:'C#5',time:2.3,dur:0.5,hand:'R'},{note:'A3',time:0,dur:0.7,hand:'L'},{note:'E3',time:0.7,dur:0.7,hand:'L'},{note:'A3',time:1.6,dur:0.7,hand:'L'}]},
    {id:'arabesque1',name:'아라베스크 1번 (드붤시)',category:'클래식',difficulty:'hard',icon:'🌿',color:'#10b981',bpm:76,timeSignature:'4/4',
      notes:[{note:'E5',time:0,dur:0.3,hand:'R'},{note:'D5',time:0.35,dur:0.3,hand:'R'},{note:'C5',time:0.7,dur:0.3,hand:'R'},{note:'D5',time:1.05,dur:0.3,hand:'R'},{note:'E5',time:1.4,dur:0.6,hand:'R'},{note:'G5',time:2.1,dur:0.6,hand:'R'},{note:'F5',time:2.8,dur:0.6,hand:'R'},{note:'E5',time:3.5,dur:0.8,hand:'R'},{note:'C3',time:0,dur:1.4,hand:'L'},{note:'G3',time:1.4,dur:1.4,hand:'L'},{note:'A3',time:2.8,dur:1.4,hand:'L'}]},
    {id:'gondola_song',name:'베니스 뼈의 노래 (멘델스존)',category:'클래식',difficulty:'medium',icon:'⛵',color:'#8b5cf6',bpm:56,timeSignature:'6/8',
      notes:[{note:'A4',time:0,dur:0.6,hand:'R'},{note:'C5',time:0.7,dur:0.4,hand:'R'},{note:'E5',time:1.2,dur:0.8,hand:'R'},{note:'D5',time:2.2,dur:0.4,hand:'R'},{note:'C5',time:2.7,dur:0.4,hand:'R'},{note:'B4',time:3.2,dur:0.8,hand:'R'},{note:'A4',time:4.2,dur:1,hand:'R'},{note:'A3',time:0,dur:1.2,hand:'L'},{note:'E3',time:1.2,dur:1.2,hand:'L'},{note:'A3',time:2.7,dur:1.2,hand:'L'},{note:'E3',time:4.2,dur:1,hand:'L'}]},
    {id:'song_of_wind',name:'바람의 노래 (이루마)',category:'현대',difficulty:'easy',icon:'🍃',color:'#06b6d4',bpm:84,timeSignature:'4/4',
      notes:[{note:'E4',time:0,dur:0.4,hand:'R'},{note:'A4',time:0.5,dur:0.4,hand:'R'},{note:'B4',time:1,dur:0.4,hand:'R'},{note:'C5',time:1.5,dur:0.8,hand:'R'},{note:'B4',time:2.5,dur:0.4,hand:'R'},{note:'A4',time:3,dur:0.4,hand:'R'},{note:'G4',time:3.5,dur:0.4,hand:'R'},{note:'A4',time:4,dur:0.8,hand:'R'},{note:'A3',time:0,dur:1.5,hand:'L'},{note:'E3',time:1.5,dur:1.5,hand:'L'},{note:'F3',time:3,dur:1,hand:'L'},{note:'A3',time:4,dur:1,hand:'L'}]}
  ];
  newSongs.forEach(s=>{if(!ids.includes(s.id)) SONGS.push(s);});
}

// ================ 10. QUIZ v4 ================
const QUIZ_V4 = [
  {q:'음계 연습에서 C 메이저 스케일의 첫 번째 음은?', o:['C','D','E','G'], a:0},
  {q:'리스트의 &quot;라 캄파네라&quot;는 무슨 뜻?', o:['종','별','꽃','바람'], a:0},
  {q:'Adagio의 BPM 범위는?', o:['40-66','66-76','76-108','120-156'], a:1},
  {q:'Sforzando(sfz)의 의미는?', o:['점점 세게','갑자기 세게','점점 여리게','매우 여리게'], a:1},
  {q:'아르페지오와 코드의 차이는?', o:['순차/동시 연주','빠르기 차이','음량 차이','차이 없음'], a:0},
  {q:'Nocturne은 무슨 뜻?', o:['아침의 노래','밤의 노래','봄의 노래','여름의 노래'], a:1},
  {q:'Da Capo(D.C.)의 의미는?', o:['끝까지','처음부터 다시','빠르게','느리게'], a:1},
  {q:'쇼팡의 녹턴 Op.9-2의 박자는?', o:['4/4','3/4','12/8','6/8'], a:2},
  {q:'River Flows in You 작곡가는?', o:['조 히사이시','이루마','사티','드붤시'], a:1},
  {q:'페달 중 음을 유지시키는 것은?', o:['소스테누토','다너페달','우나코르다','듓페달'], a:2},
  {q:'Tremolo란?', o:['빠른 교대','같은 음 빠른 반복','미끄러져 이동','끊어서 짧게'], a:1},
  {q:'짐노페디 작곡가는?', o:['드붤시','라벨','사티','쇼팡'], a:2},
  {q:'코다(Coda)란?', o:['처음부터','곡의 끝맺음 부분','반복','점점 빠르게'], a:1},
  {q:'헝가리 람소디 2번의 박자는?', o:['3/4','4/4','2/4','6/8'], a:2},
  {q:'Portamento의 의미는?', o:['강조하여','음을 미끄러져 이동','끊어서','느리게'], a:1}
];
let quiz4Score=0,quiz4Idx=0,quiz4Active=false;
function buildQuizV4UI(){
  const modal = document.createElement('div');
  modal.id = 'quiz4-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎓 퀀즈 v4</h2>
      <button onclick="document.getElementById('quiz4-modal').style.display='none';quiz4Active=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="quiz4-area"><p style="font-size:12px;color:var(--text2);margin-bottom:16px">15문항 심화 퀀즈 v4</p>
      <button onclick="startQuiz4()" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">시작</button></div>
  </div>`;
  document.body.appendChild(modal);
}
window.startQuiz4 = function(){quiz4Score=0;quiz4Idx=0;quiz4Active=true;showQuiz4Q();};
function showQuiz4Q(){
  if(quiz4Idx>=QUIZ_V4.length){
    const pct=Math.round(quiz4Score/QUIZ_V4.length*100);
    const grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    document.getElementById('quiz4-area').innerHTML=`<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">${grade}</div><div>${quiz4Score}/${QUIZ_V4.length} (${pct}%)</div><button onclick="startQuiz4()" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">다시</button>`;
    quiz4Active=false;ls13Set('quiz4Best',Math.max(ls13Get('quiz4Best',0),quiz4Score));return;
  }
  const q=QUIZ_V4[quiz4Idx];
  document.getElementById('quiz4-area').innerHTML=`<div style="font-size:11px;color:var(--text2);margin-bottom:8px">${quiz4Idx+1}/${QUIZ_V4.length}</div>
    <div style="font-size:14px;font-weight:600;margin-bottom:16px">${q.q}</div>
    <div style="display:flex;flex-direction:column;gap:8px">${q.o.map((opt,i)=>
      `<button onclick="answerQuiz4(${i})" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">${opt}</button>`
    ).join('')}</div>`;
}
window.answerQuiz4 = function(idx){
  if(!quiz4Active) return;
  if(idx===QUIZ_V4[quiz4Idx].a){quiz4Score++;playSFX13('quiz4_correct');}else playSFX13('scale_note');
  quiz4Idx++;setTimeout(showQuiz4Q,300);
};

// ================ 11. ACHIEVEMENTS ================
const V13_ACH = [
  {id:'scale_student',name:'스케일 학생',desc:'스케일 4개 완료',icon:'🎹',check:()=>scaleCompleted.length>=4},
  {id:'scale_master13',name:'스케일 마스터',desc:'전부 완료',icon:'🏆',check:()=>scaleCompleted.length>=SCALES.length},
  {id:'chord_explorer',name:'화음 탐험가',desc:'화음 10개 연주',icon:'🎶',check:()=>ls13Get('chordsPlayed',0)>=10},
  {id:'warmup_first',name:'첫 워밍업',desc:'워밍업 1회',icon:'🌟',check:()=>ls13Get('warmupTotal',0)>=1},
  {id:'warmup_routine',name:'워밍업 루틴',desc:'워밍업 8회',icon:'💪',check:()=>ls13Get('warmupTotal',0)>=8},
  {id:'dict_reader',name:'용어 학생',desc:'사전 3회 조회',icon:'📖',check:()=>ls13Get('dictViewed',0)>=3},
  {id:'duet_player',name:'듀엇 연주가',desc:'듀엇 3회',icon:'🎵',check:()=>ls13Get('duetPlayed',0)>=3},
  {id:'fav_collector',name:'즐겨찾기 수집가',desc:'5곡 즐겨찾기',icon:'❤️',check:()=>favorites.length>=5},
  {id:'share_first',name:'첫 공유',desc:'공유카드 생성',icon:'📤',check:()=>ls13Get('shareCreated',0)>=1},
  {id:'songs_100',name:'백곡 도전',desc:'100곡+ 수록',icon:'💯',check:()=>typeof SONGS!=='undefined'&&SONGS.length>=100},
  {id:'quiz4_pass',name:'퀀즈v4 합격',desc:'60% 이상',icon:'🎓',check:()=>ls13Get('quiz4Best',0)>=9},
  {id:'v13_explorer',name:'v13 탐험가',desc:'6기능 사용',icon:'🚀',check:()=>{
    let c=0;if(scaleCompleted.length>0)c++;if(ls13Get('chordsPlayed',0)>0)c++;if(ls13Get('warmupTotal',0)>0)c++;if(ls13Get('dictViewed',0)>0)c++;if(ls13Get('duetPlayed',0)>0)c++;if(favorites.length>0)c++;if(ls13Get('quiz4Best',0)>0)c++;return c>=6;}}
];
function checkV13Achievements(){
  let u=ls13Get('unlockedAch',[]);
  V13_ACH.forEach(a=>{
    if(!u.includes(a.id)&&a.check()){u.push(a.id);ls13Set('unlockedAch',u);
      playSFX13('achieve_v13');
      if(window.app&&window.app.showToast) window.app.showToast('🏆 업적: '+a.icon+' '+a.name,'achievement');}
  });
}
function injectV13Achievements(){
  const grid=document.querySelector('.achievement-grid');if(!grid) return;
  const u=ls13Get('unlockedAch',[]);
  V13_ACH.forEach(a=>{
    const el=document.createElement('div');
    el.className='achievement'+(u.includes(a.id)?' unlocked':'');
    el.style.cssText='padding:8px;text-align:center;border-radius:8px;border:1px solid var(--border);background:var(--surface2)';
    el.innerHTML=`<div class="achievement-icon">${a.icon}</div><div>${a.name}</div><div style="font-size:8px;margin-top:2px">${a.desc}</div>`;
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTIONS & KEYBOARD SHORTCUTS ================
function injectV13QuickActions(){
  const tabSongs=document.getElementById('tab-songs');if(!tabSongs) return;
  const bar=document.createElement('div');
  bar.className='v13-quick-actions';
  bar.style.cssText='display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  [{label:'🎹 음계',fn:()=>document.getElementById('scale-modal').style.display='flex'},
   {label:'🎶 화음',fn:()=>{document.getElementById('chord-modal').style.display='flex';playSFX13('chord_play');}},
   {label:'🌟 워밍업',fn:()=>document.getElementById('warmup-modal').style.display='flex'},
   {label:'📖 용어',fn:()=>{document.getElementById('dict-modal').style.display='flex';playSFX13('dict_open');}},
   {label:'🎹 듀엇',fn:()=>document.getElementById('duet-modal').style.display='flex'},
   {label:'📊 분석',fn:()=>{document.getElementById('analytics-modal').style.display='flex';renderAnalytics();}},
   {label:'❤️ 즐겨찾기',fn:()=>{document.getElementById('fav-modal').style.display='flex';renderFavorites();}},
   {label:'📤 공유',fn:()=>{document.getElementById('share-modal').style.display='flex';renderShareCard();ls13Set('shareCreated',(ls13Get('shareCreated',0))+1);}},
   {label:'🎓 퀀즈v4',fn:()=>document.getElementById('quiz4-modal').style.display='flex'}
  ].forEach(a=>{
    const btn=document.createElement('button');
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap';
    btn.textContent=a.label;btn.addEventListener('click',a.fn);bar.appendChild(btn);
  });
  const v12bar=tabSongs.querySelector('.v12-quick-actions');
  if(v12bar) v12bar.parentNode.insertBefore(bar, v12bar.nextSibling);
  else{const fb=tabSongs.querySelector('.filter-bar');if(fb) fb.parentNode.insertBefore(bar,fb);else tabSongs.insertBefore(bar,tabSongs.firstChild);}
}
function setupV13Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key){
      case 'C':if(!e.ctrlKey){e.preventDefault();document.getElementById('scale-modal').style.display='flex';}break;
      case 'H':e.preventDefault();document.getElementById('chord-modal').style.display='flex';break;
      case 'W':e.preventDefault();document.getElementById('warmup-modal').style.display='flex';break;
      case 'O':e.preventDefault();document.getElementById('dict-modal').style.display='flex';break;
      case 'U':e.preventDefault();document.getElementById('duet-modal').style.display='flex';break;
      case 'A':e.preventDefault();document.getElementById('analytics-modal').style.display='flex';renderAnalytics();break;
      case 'V':e.preventDefault();document.getElementById('fav-modal').style.display='flex';renderFavorites();break;
      case 'E':e.preventDefault();document.getElementById('share-modal').style.display='flex';renderShareCard();ls13Set('shareCreated',(ls13Get('shareCreated',0))+1);break;
    }
  });
}

// ================ INIT ================
function initV13(){
  addV13Songs();
  buildScaleUI();
  buildChordUI();
  buildWarmupUI();
  buildDictUI();
  buildDuetUI();
  buildAnalyticsUI();
  buildFavoritesUI();
  buildShareUI();
  buildQuizV4UI();
  injectV13QuickActions();
  injectV13Achievements();
  injectFavButtons();
  setupV13Shortcuts();
  setInterval(checkV13Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(initV13,2000));
else setTimeout(initV13,2000);
})();
