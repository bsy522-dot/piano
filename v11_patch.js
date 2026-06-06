// Piano Master v11 Patch Module
// Ear Training, Chord Progressions, Performance Analytics, Practice Room,
// Random Mode, Composition Playground, Hand Independence, Composer Gallery,
// 10 Songs, Quiz v2 15Q, 12 Achievements, SFX 8, Keyboard 8
(function(){
'use strict';
if(window.__v11Loaded) return;
window.__v11Loaded = true;

const LS11 = 'piano-v11-';
function ls11Get(k,d){try{return JSON.parse(localStorage.getItem(LS11+k))||d}catch{return d}}
function ls11Set(k,v){localStorage.setItem(LS11+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v11 ================
const sfx11 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX11(type){
  if(!sfx11) return;
  if(sfx11.state==='suspended') sfx11.resume();
  const t=sfx11.currentTime, g=sfx11.createGain(), o=sfx11.createOscillator();
  g.connect(sfx11.destination); o.connect(g);
  switch(type){
    case 'ear_correct':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(784,t+0.1);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'ear_wrong':
      o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.linearRampToValueAtTime(110,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'chord_play':
      o.type='triangle';o.frequency.setValueAtTime(440,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'analytics_open':
      o.type='sine';o.frequency.setValueAtTime(659,t);o.frequency.linearRampToValueAtTime(880,t+0.15);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'practice_complete':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      const o2=sfx11.createOscillator(),g2=sfx11.createGain();
      g2.connect(sfx11.destination);o2.connect(g2);o2.type='triangle';
      o2.frequency.setValueAtTime(659,t+0.12);
      g2.gain.setValueAtTime(0.1,t+0.12);g2.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o2.start(t+0.12);o2.stop(t+0.25);
      const o3=sfx11.createOscillator(),g3=sfx11.createGain();
      g3.connect(sfx11.destination);o3.connect(g3);o3.type='triangle';
      o3.frequency.setValueAtTime(784,t+0.25);
      g3.gain.setValueAtTime(0.1,t+0.25);g3.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o3.start(t+0.25);o3.stop(t+0.4);break;
    case 'compose_note':
      o.type='sine';o.frequency.setValueAtTime(1047,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.start(t);o.stop(t+0.08);break;
    case 'random_pick':
      o.type='square';o.frequency.setValueAtTime(600,t);o.frequency.linearRampToValueAtTime(1200,t+0.1);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'gallery_open':
      o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.linearRampToValueAtTime(523,t+0.2);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
  }
}

// Helper: play frequency
function playFreq(freq, dur){
  if(!sfx11) return;
  if(sfx11.state==='suspended') sfx11.resume();
  const t=sfx11.currentTime;
  const g=sfx11.createGain(), o=sfx11.createOscillator();
  g.connect(sfx11.destination); o.connect(g);
  o.type='triangle'; o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.15,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t); o.stop(t+dur);
}
function playFreqAt(freq, dur, delay){
  if(!sfx11) return;
  if(sfx11.state==='suspended') sfx11.resume();
  const t=sfx11.currentTime+delay;
  const g=sfx11.createGain(), o=sfx11.createOscillator();
  g.connect(sfx11.destination); o.connect(g);
  o.type='triangle'; o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.15,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t); o.stop(t+dur);
}

// ================ 1. EAR TRAINING (Interval Recognition) ================
const INTERVALS = [
  {name:'&#45800;2&#46020;', semitones:1, nameKo:'&#45800;2&#46020; (m2)'},
  {name:'&#51109;2&#46020;', semitones:2, nameKo:'&#51109;2&#46020; (M2)'},
  {name:'&#45800;3&#46020;', semitones:3, nameKo:'&#45800;3&#46020; (m3)'},
  {name:'&#51109;3&#46020;', semitones:4, nameKo:'&#51109;3&#46020; (M3)'},
  {name:'&#50756;&#51204;4&#46020;', semitones:5, nameKo:'&#50756;&#51204;4&#46020; (P4)'},
  {name:'&#51613;4&#46020;', semitones:6, nameKo:'&#51613;4&#46020; (TT)'},
  {name:'&#50756;&#51204;5&#46020;', semitones:7, nameKo:'&#50756;&#51204;5&#46020; (P5)'},
  {name:'&#45800;6&#46020;', semitones:8, nameKo:'&#45800;6&#46020; (m6)'},
  {name:'&#51109;6&#46020;', semitones:9, nameKo:'&#51109;6&#46020; (M6)'},
  {name:'&#45800;7&#46020;', semitones:10, nameKo:'&#45800;7&#46020; (m7)'},
  {name:'&#51109;7&#46020;', semitones:11, nameKo:'&#51109;7&#46020; (M7)'},
  {name:'&#50756;&#51204;8&#46020;', semitones:12, nameKo:'&#50756;&#51204;8&#46020; (P8)'}
];
let earScore=0, earTotal=0, earCurrentInterval=null, earActive=false;

function buildEarTrainingUI(){
  const modal = document.createElement('div');
  modal.id = 'ear-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,440px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127911; &#51020;&#44048; &#54984;&#47144; (Ear Training)</h2>
      <button onclick="document.getElementById('ear-modal').style.display='none';earActive=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">&#46160; &#51020;&#51012; &#46307;&#44256; &#51020;&#51221;&#51012; &#47582;&#52628;&#49464;&#50836;</p>
    <button id="ear-play-btn" style="padding:10px 24px;border-radius:8px;border:none;background:var(--purple);color:white;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:12px">&#127925; &#51116;&#49373;</button>
    <div id="ear-choices" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:12px 0"></div>
    <div id="ear-feedback" style="font-size:13px;min-height:24px;margin:8px 0"></div>
    <div style="font-size:12px;margin-top:8px">
      <span style="color:var(--green)" id="ear-score-display">&#51221;&#45813;: 0</span>
      <span style="color:var(--text2)"> / </span>
      <span style="color:var(--text2)" id="ear-total-display">&#52509;: 0</span>
      <span style="color:var(--yellow);margin-left:12px" id="ear-streak-display">&#50672;&#49549;: 0</span>
    </div>
    <button id="ear-start" style="margin-top:12px;padding:8px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;font-weight:600;cursor:pointer">&#49884;&#51089;</button>
  </div>`;
  document.body.appendChild(modal);

  const choicesDiv = modal.querySelector('#ear-choices');
  INTERVALS.forEach(iv=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:8px 4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer';
    btn.innerHTML = iv.nameKo;
    btn.dataset.semitones = iv.semitones;
    btn.addEventListener('click',()=>checkEarAnswer(iv.semitones));
    choicesDiv.appendChild(btn);
  });

  modal.querySelector('#ear-start').addEventListener('click',()=>{
    earScore=0;earTotal=0;earActive=true;
    ls11Set('earStreak',0);
    modal.querySelector('#ear-score-display').textContent = '\u{C815}\u{B2F5}: 0';
    modal.querySelector('#ear-total-display').textContent = '\u{CD1D}: 0';
    modal.querySelector('#ear-streak-display').textContent = '\u{C5F0}\u{C18D}: 0';
    modal.querySelector('#ear-feedback').textContent = '';
    nextEarInterval();
  });
  modal.querySelector('#ear-play-btn').addEventListener('click',()=>{
    if(earCurrentInterval) playEarInterval(earCurrentInterval);
  });
}

function nextEarInterval(){
  const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
  const baseFreq = baseFreqs[Math.floor(Math.random()*baseFreqs.length)];
  const iv = INTERVALS[Math.floor(Math.random()*INTERVALS.length)];
  earCurrentInterval = {base:baseFreq, semitones:iv.semitones, name:iv.nameKo};
  playEarInterval(earCurrentInterval);
}

function playEarInterval(iv){
  const secondFreq = iv.base * Math.pow(2, iv.semitones/12);
  playFreq(iv.base, 0.6);
  playFreqAt(secondFreq, 0.6, 0.7);
}

let earStreak = 0;
function checkEarAnswer(semitones){
  if(!earActive || !earCurrentInterval) return;
  earTotal++;
  const correct = semitones === earCurrentInterval.semitones;
  const fb = document.getElementById('ear-feedback');
  if(correct){
    earScore++;
    earStreak++;
    fb.innerHTML = '<span style="color:var(--green)">&#9989; &#51221;&#45813;!</span>';
    playSFX11('ear_correct');
    if(earStreak>=10) ls11Set('earStreak10',true);
  } else {
    earStreak=0;
    fb.innerHTML = `<span style="color:var(--red)">&#10060; &#50724;&#45813;! &#51221;&#45813;: ${earCurrentInterval.name}</span>`;
    playSFX11('ear_wrong');
  }
  document.getElementById('ear-score-display').textContent = `\u{C815}\u{B2F5}: ${earScore}`;
  document.getElementById('ear-total-display').textContent = `\u{CD1D}: ${earTotal}`;
  document.getElementById('ear-streak-display').textContent = `\u{C5F0}\u{C18D}: ${earStreak}`;
  ls11Set('earTotal', (ls11Get('earTotal',0))+1);
  if(correct) ls11Set('earCorrect', (ls11Get('earCorrect',0))+1);
  setTimeout(()=>{ if(earActive) nextEarInterval(); }, 1200);
}

// ================ 2. CHORD PROGRESSIONS PRACTICE ================
const CHORD_PROGRESSIONS = [
  {name:'I-IV-V-I (C Major)', chords:['C','F','G','C'], freqs:[[261.63,329.63,392.00],[349.23,440.00,523.25],[392.00,493.88,587.33],[523.25,659.26,783.99]]},
  {name:'I-V-vi-IV', chords:['C','G','Am','F'], freqs:[[261.63,329.63,392.00],[392.00,493.88,587.33],[440.00,523.25,659.26],[349.23,440.00,523.25]]},
  {name:'ii-V-I (Jazz)', chords:['Dm','G7','C'], freqs:[[293.66,349.23,440.00],[392.00,493.88,587.33],[261.63,329.63,392.00]]},
  {name:'I-vi-IV-V (50s)', chords:['C','Am','F','G'], freqs:[[261.63,329.63,392.00],[440.00,523.25,659.26],[349.23,440.00,523.25],[392.00,493.88,587.33]]},
  {name:'vi-IV-I-V', chords:['Am','F','C','G'], freqs:[[440.00,523.25,659.26],[349.23,440.00,523.25],[261.63,329.63,392.00],[392.00,493.88,587.33]]},
  {name:'I-IV-vi-V', chords:['C','F','Am','G'], freqs:[[261.63,329.63,392.00],[349.23,440.00,523.25],[440.00,523.25,659.26],[392.00,493.88,587.33]]},
  {name:'I-V-IV-V (Rock)', chords:['C','G','F','G'], freqs:[[261.63,329.63,392.00],[392.00,493.88,587.33],[349.23,440.00,523.25],[392.00,493.88,587.33]]},
  {name:'I-iii-IV-V', chords:['C','Em','F','G'], freqs:[[261.63,329.63,392.00],[329.63,392.00,493.88],[349.23,440.00,523.25],[392.00,493.88,587.33]]}
];
let chordIdx=0, chordStep=0;

function buildChordUI(){
  const modal = document.createElement('div');
  modal.id = 'chord-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,440px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127929; &#53076;&#46300; &#51652;&#54665; &#50672;&#49845;</h2>
      <button onclick="document.getElementById('chord-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="chord-list" style="display:flex;flex-direction:column;gap:8px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderChordList();
}

function renderChordList(){
  const list = document.getElementById('chord-list');
  if(!list) return;
  list.innerHTML = '';
  CHORD_PROGRESSIONS.forEach((prog,i)=>{
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:0.2s';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text)">${prog.name}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:2px">${prog.chords.join(' &#8594; ')}</div>
        </div>
        <button class="chord-play-btn" data-idx="${i}" style="padding:6px 16px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">&#9654; &#51116;&#49373;</button>
      </div>
      <div class="chord-progress-bar" data-idx="${i}" style="margin-top:8px;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:0%;background:var(--green);border-radius:2px;transition:width 0.3s"></div>
      </div>`;
    card.addEventListener('mouseenter',()=>card.style.borderColor='var(--accent)');
    card.addEventListener('mouseleave',()=>card.style.borderColor='var(--border)');
    list.appendChild(card);
  });
  list.querySelectorAll('.chord-play-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      playChordProgression(idx);
    });
  });
}

function playChordProgression(idx){
  const prog = CHORD_PROGRESSIONS[idx];
  playSFX11('chord_play');
  const bar = document.querySelector(`.chord-progress-bar[data-idx="${idx}"] div`);
  prog.freqs.forEach((chord,ci)=>{
    setTimeout(()=>{
      chord.forEach(f=>playFreqAt(f,0.5,0));
      if(bar) bar.style.width = ((ci+1)/prog.freqs.length*100)+'%';
    }, ci*800);
  });
  setTimeout(()=>{
    if(bar) bar.style.width = '0%';
    ls11Set('chordPlayed',(ls11Get('chordPlayed',0))+1);
  }, prog.freqs.length*800+500);
}

// ================ 3. PERFORMANCE ANALYTICS DASHBOARD ================
function buildAnalyticsUI(){
  const modal = document.createElement('div');
  modal.id = 'analytics-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128202; &#50672;&#51452; &#48516;&#49437; &#45824;&#49884;&#48372;&#46300;</h2>
      <button onclick="document.getElementById('analytics-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="analytics-canvas" width="420" height="280" style="background:#1a1a2e;border-radius:8px;border:1px solid var(--border);max-width:100%;margin-bottom:12px"></canvas>
    <div id="analytics-stats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div>
    <div id="analytics-detail" style="margin-top:12px"></div>
  </div>`;
  document.body.appendChild(modal);
}

function renderAnalytics(){
  playSFX11('analytics_open');
  const canvas = document.getElementById('analytics-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  let stats;
  try{ stats = JSON.parse(localStorage.getItem('pianoStats')||'{}'); }catch{ stats={}; }
  const plays = stats.totalPlays||0;
  const notes = stats.totalNotes||0;
  const score = stats.totalScore||0;
  const streak = stats.streak||0;
  const completed = (stats.songsCompleted||[]).length;
  const perfects = (stats.perfectSongs||[]).length;
  const playTime = stats.totalPlayTime||0;
  const maxCombo = stats.maxCombo||0;

  // Radar chart — 5 axes
  const metrics = [
    {label:'&#50672;&#49845;&#47049;', value:Math.min(plays/100,1)},
    {label:'&#51221;&#54869;&#46020;', value:notes>0?Math.min(score/(notes*15),1):0},
    {label:'&#44257; &#50756;&#51452;', value:typeof SONGS!=='undefined'?Math.min(completed/SONGS.length,1):0},
    {label:'&#53076;&#48372;', value:Math.min(maxCombo/100,1)},
    {label:'&#44984;&#51456;&#54632;', value:Math.min(streak/30,1)}
  ];

  const cx=w/2, cy=h/2-10, r=90;
  ctx.strokeStyle = '#1e2640';
  ctx.lineWidth = 1;
  for(let ring=1;ring<=5;ring++){
    ctx.beginPath();
    for(let i=0;i<=metrics.length;i++){
      const angle = (Math.PI*2/metrics.length)*i - Math.PI/2;
      const rr = r*ring/5;
      const x = cx + Math.cos(angle)*rr;
      const y = cy + Math.sin(angle)*rr;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  // Axis lines + labels
  ctx.fillStyle = '#8892a8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  metrics.forEach((m,i)=>{
    const angle = (Math.PI*2/metrics.length)*i - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*r, cy+Math.sin(angle)*r);
    ctx.strokeStyle = '#1e2640';
    ctx.stroke();
    const lx = cx + Math.cos(angle)*(r+18);
    const ly = cy + Math.sin(angle)*(r+18);
    const tmp = document.createElement('span');
    tmp.innerHTML = m.label;
    ctx.fillText(tmp.textContent, lx, ly+4);
  });

  // Data polygon
  ctx.beginPath();
  metrics.forEach((m,i)=>{
    const angle = (Math.PI*2/metrics.length)*i - Math.PI/2;
    const x = cx + Math.cos(angle)*r*m.value;
    const y = cy + Math.sin(angle)*r*m.value;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(74,125,255,0.25)';
  ctx.fill();
  ctx.strokeStyle = '#4a7dff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  metrics.forEach((m,i)=>{
    const angle = (Math.PI*2/metrics.length)*i - Math.PI/2;
    const x = cx + Math.cos(angle)*r*m.value;
    const y = cy + Math.sin(angle)*r*m.value;
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle = '#4a7dff';
    ctx.fill();
  });

  // Grade
  const avgScore = metrics.reduce((s,m)=>s+m.value,0)/metrics.length;
  const grade = avgScore>=0.9?'S':avgScore>=0.7?'A':avgScore>=0.5?'B':avgScore>=0.3?'C':'D';
  const gradeColors = {S:'#eab308',A:'#22c55e',B:'#3b82f6',C:'#a855f7',D:'#ef4444'};
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = gradeColors[grade]||'#fff';
  ctx.textAlign = 'right';
  ctx.fillText(grade, w-20, 35);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#8892a8';
  ctx.fillText(`${Math.round(avgScore*100)}%`, w-20, 50);

  // Stats cards
  const statsDiv = document.getElementById('analytics-stats');
  if(statsDiv){
    const mins = Math.floor(playTime/60);
    statsDiv.innerHTML = [
      {label:'&#52509; &#50672;&#51452;',value:plays+'&#54924;',color:'var(--accent)'},
      {label:'&#52509; &#45432;&#53944;',value:notes.toLocaleString(),color:'var(--green)'},
      {label:'&#52572;&#44256; &#53076;&#48372;',value:maxCombo,color:'var(--yellow)'},
      {label:'&#50672;&#49549; &#50672;&#49845;',value:streak+'&#51068;',color:'var(--red)'},
      {label:'&#50756;&#51452;&#44257;',value:completed+'&#44257;',color:'var(--purple)'},
      {label:'&#50672;&#49845;&#49884;&#44036;',value:mins+'&#48516;',color:'var(--cyan)'}
    ].map(s=>`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center">
      <div style="font-size:10px;color:var(--text2)">${s.label}</div>
      <div style="font-size:16px;font-weight:700;color:${s.color};margin-top:2px">${s.value}</div>
    </div>`).join('');
  }

  // Detail
  const detailDiv = document.getElementById('analytics-detail');
  if(detailDiv){
    const tips = [];
    if(avgScore<0.3) tips.push('&#128161; &#47588;&#51068; &#44984;&#51456;&#55176; &#50672;&#49845;&#54644;&#48372;&#49464;&#50836;! &#49828;&#53944;&#47533;&#51012; &#49939;&#51004;&#47732; &#49892;&#47141;&#51060; &#48736;&#47476;&#44172; &#45720;&#50612;&#50836;.');
    else if(avgScore<0.6) tips.push('&#128077; &#51339;&#51008; &#51652;&#54665;! &#45796;&#50577;&#54620; &#45212;&#51060;&#46020;&#51032; &#44257;&#50640; &#46020;&#51204;&#54644;&#48372;&#49464;&#50836;.');
    else tips.push('&#127775; &#45824;&#45800;&#54644;&#50836;! Expert &#44257;&#50640; &#46020;&#51204;&#54644;&#48372;&#49464;&#50836;.');
    if(maxCombo<20) tips.push('&#128293; &#53076;&#48372;&#47484; &#45908; &#45720;&#47140;&#48372;&#49464;&#50836;. &#51221;&#54869;&#54620; &#53440;&#51060;&#48141;&#51060; &#54645;&#49900;&#51077;&#45768;&#45796;.');
    detailDiv.innerHTML = tips.map(t=>`<div style="font-size:11px;color:var(--text2);padding:4px 0">${t}</div>`).join('');
  }
}

// ================ 4. PRACTICE ROOM (Scales & Arpeggios) ================
const PRACTICE_EXERCISES = [
  {name:'C &#47700;&#51060;&#51200; &#49828;&#52992;&#51068;', notes:['C4','D4','E4','F4','G4','A4','B4','C5'], desc:'&#46020;&#47112;&#48120;&#54028;&#49556;&#46972;&#49884;&#46020;'},
  {name:'G &#47700;&#51060;&#51200; &#49828;&#52992;&#51068;', notes:['G3','A3','B3','C4','D4','E4','F#4','G4'], desc:'&#49556;&#46972;&#49884;&#46020;&#47112;&#48120;&#54028;#&#49556;'},
  {name:'F &#47700;&#51060;&#51200; &#49828;&#52992;&#51068;', notes:['F3','G3','A3','Bb3','C4','D4','E4','F4'], desc:'&#54028;&#49556;&#46972;&#49884;b&#46020;&#47112;&#48120;&#54028;'},
  {name:'D &#47560;&#51060;&#45320; &#49828;&#52992;&#51068;', notes:['D4','E4','F4','G4','A4','Bb4','C5','D5'], desc:'&#47112;&#48120;&#54028;&#49556;&#46972;&#49884;b&#46020;&#47112;'},
  {name:'C &#47700;&#51060;&#51200; &#50500;&#47476;&#54168;&#51648;&#50724;', notes:['C4','E4','G4','C5','G4','E4','C4'], desc:'&#46020;&#48120;&#49556;&#46020; &#49556;&#48120;&#46020;'},
  {name:'Am &#50500;&#47476;&#54168;&#51648;&#50724;', notes:['A3','C4','E4','A4','E4','C4','A3'], desc:'&#46972;&#46020;&#48120;&#46972; &#48120;&#46020;&#46972;'},
  {name:'&#53356;&#47196;&#47588;&#54001; &#49828;&#52992;&#51068;', notes:['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5'], desc:'&#48152;&#51020; &#49692;&#52264; &#49345;&#54665;'},
  {name:'&#54616;&#45432; &#50672;&#49845;', notes:['C4','E4','C4','E4','G4','E4','G4','C5'], desc:'&#46020;&#48120;&#46020;&#48120;&#49556;&#48120;&#49556;&#46020;'}
];
let practiceExIdx=0, practiceNoteIdx=0, practiceActive=false;

function buildPracticeRoomUI(){
  const modal = document.createElement('div');
  modal.id = 'practice-room-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,440px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127932; &#50672;&#49845;&#49892;</h2>
      <button onclick="document.getElementById('practice-room-modal').style.display='none';practiceActive=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="practice-exercises" style="display:flex;flex-direction:column;gap:6px"></div>
    <div id="practice-active-area" style="display:none;margin-top:12px;text-align:center">
      <div style="font-size:14px;font-weight:600;color:var(--accent)" id="practice-title"></div>
      <div style="font-size:11px;color:var(--text2);margin:4px 0" id="practice-desc"></div>
      <div id="practice-notes-display" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:12px 0"></div>
      <div style="font-size:12px;color:var(--text2)" id="practice-progress">&#45796;&#51020; &#51020;: --</div>
      <button id="practice-listen-btn" style="margin-top:8px;padding:6px 16px;border-radius:6px;border:none;background:var(--purple);color:white;font-size:11px;cursor:pointer">&#127911; &#46307;&#44592;</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  renderPracticeExercises();
}

function renderPracticeExercises(){
  const container = document.getElementById('practice-exercises');
  if(!container) return;
  container.innerHTML = '';
  const completedExs = ls11Get('practiceCompleted',[]);
  PRACTICE_EXERCISES.forEach((ex,i)=>{
    const done = completedExs.includes(i);
    const card = document.createElement('div');
    card.style.cssText = `background:var(--surface2);border:1px solid ${done?'var(--green)':'var(--border)'};border-radius:8px;padding:10px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center`;
    const tmp = document.createElement('div');
    tmp.innerHTML = ex.name;
    const tmp2 = document.createElement('div');
    tmp2.innerHTML = ex.desc;
    card.innerHTML = `
      <div>
        <div style="font-size:13px;font-weight:600">${done?'&#9989; ':''}<span>${tmp.textContent}</span></div>
        <div style="font-size:10px;color:var(--text2)">${tmp2.textContent}</div>
      </div>
      <button style="padding:6px 12px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:10px;cursor:pointer;flex-shrink:0">&#50672;&#49845;</button>`;
    card.querySelector('button').addEventListener('click',(e)=>{
      e.stopPropagation();
      startPracticeExercise(i);
    });
    container.appendChild(card);
  });
}

function startPracticeExercise(idx){
  practiceExIdx = idx;
  practiceNoteIdx = 0;
  practiceActive = true;
  const ex = PRACTICE_EXERCISES[idx];
  document.getElementById('practice-active-area').style.display = 'block';
  const tmp1 = document.createElement('span'); tmp1.innerHTML = ex.name;
  const tmp2 = document.createElement('span'); tmp2.innerHTML = ex.desc;
  document.getElementById('practice-title').textContent = tmp1.textContent;
  document.getElementById('practice-desc').textContent = tmp2.textContent;
  renderPracticeNotes(ex);
  document.getElementById('practice-listen-btn').onclick = ()=>{
    ex.notes.forEach((n,ni)=>{
      const freq = noteToFreq(n);
      if(freq) playFreqAt(freq, 0.3, ni*0.4);
    });
  };
}

function renderPracticeNotes(ex){
  const container = document.getElementById('practice-notes-display');
  container.innerHTML = '';
  ex.notes.forEach((n,i)=>{
    const span = document.createElement('span');
    span.style.cssText = `padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid var(--border);`;
    if(i<practiceNoteIdx) span.style.cssText += 'background:var(--green);color:white;border-color:var(--green);';
    else if(i===practiceNoteIdx) span.style.cssText += 'background:var(--accent);color:white;border-color:var(--accent);';
    else span.style.cssText += 'background:var(--surface2);color:var(--text2);';
    span.textContent = n;
    container.appendChild(span);
  });
  if(practiceNoteIdx<ex.notes.length){
    document.getElementById('practice-progress').textContent = `\u{B2E4}\u{C74C} \u{C74C}: ${ex.notes[practiceNoteIdx]}`;
  } else {
    document.getElementById('practice-progress').textContent = '\u{C644}\u{B8CC}!';
  }
}

function noteToFreq(noteName){
  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const enharmonics = {'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#'};
  let name = noteName.replace(/\d/,'');
  const oct = parseInt(noteName.match(/\d+/));
  if(enharmonics[name]) name = enharmonics[name];
  const idx = noteNames.indexOf(name);
  if(idx<0||isNaN(oct)) return 0;
  return 440*Math.pow(2,(idx-9+(oct-4)*12)/12);
}

// Hook into piano key presses for practice mode
const origHandleNote = window.PianoApp && window.PianoApp.prototype && window.PianoApp.prototype.handleNoteInput;
function hookPracticeInput(noteName){
  if(!practiceActive) return;
  const ex = PRACTICE_EXERCISES[practiceExIdx];
  if(!ex || practiceNoteIdx>=ex.notes.length) return;
  const expected = ex.notes[practiceNoteIdx];
  if(normalizeNote(noteName) === normalizeNote(expected)){
    practiceNoteIdx++;
    if(practiceNoteIdx >= ex.notes.length){
      practiceActive = false;
      playSFX11('practice_complete');
      const completed = ls11Get('practiceCompleted',[]);
      if(!completed.includes(practiceExIdx)){
        completed.push(practiceExIdx);
        ls11Set('practiceCompleted',completed);
      }
      ls11Set('practiceTotal',(ls11Get('practiceTotal',0))+1);
      renderPracticeExercises();
    }
    renderPracticeNotes(ex);
  }
}
function normalizeNote(n){
  const enharmonics = {'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#'};
  let name = n.replace(/\d/,'');
  const oct = n.match(/\d+/);
  if(enharmonics[name]) name = enharmonics[name];
  return name+(oct?oct[0]:'');
}

// ================ 5. RANDOM MODE ================
function buildRandomModeUI(){
  const modal = document.createElement('div');
  modal.id = 'random-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,380px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="font-size:16px;color:var(--accent)">&#127922; &#47004;&#45924; &#50672;&#51452;</h2>
      <button onclick="document.getElementById('random-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="font-size:48px;margin:20px 0" id="random-icon">&#127922;</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:4px" id="random-song-name">--</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:16px" id="random-song-info">&#48260;&#53948;&#51012; &#45580;&#47084; &#47004;&#45924; &#44257;&#51012; &#49440;&#53469;&#54616;&#49464;&#50836;</div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px">
      <button class="random-filter-btn" data-filter="all" style="padding:6px 14px;border-radius:20px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">&#51204;&#52404;</button>
      <button class="random-filter-btn" data-filter="easy" style="padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:none;color:var(--green);font-size:11px;cursor:pointer">Easy</button>
      <button class="random-filter-btn" data-filter="medium" style="padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:none;color:var(--yellow);font-size:11px;cursor:pointer">Medium</button>
      <button class="random-filter-btn" data-filter="hard" style="padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:none;color:var(--red);font-size:11px;cursor:pointer">Hard</button>
    </div>
    <button id="random-pick-btn" style="padding:12px 32px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),var(--purple));color:white;font-size:15px;font-weight:700;cursor:pointer">&#127922; &#47004;&#45924; &#49440;&#53469;</button>
  </div>`;
  document.body.appendChild(modal);

  let randomFilter = 'all';
  modal.querySelectorAll('.random-filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      modal.querySelectorAll('.random-filter-btn').forEach(b=>{b.style.background='none';b.style.borderColor='var(--border)';});
      btn.style.background='var(--accent)';btn.style.borderColor='var(--accent)';btn.style.color='white';
      randomFilter = btn.dataset.filter;
    });
  });

  modal.querySelector('#random-pick-btn').addEventListener('click',()=>{
    if(typeof SONGS==='undefined') return;
    let pool = SONGS;
    if(randomFilter!=='all') pool = SONGS.filter(s=>s.difficulty===randomFilter);
    if(pool.length===0) pool = SONGS;
    const song = pool[Math.floor(Math.random()*pool.length)];
    playSFX11('random_pick');
    document.getElementById('random-icon').textContent = song.icon||'&#127925;';
    document.getElementById('random-song-name').textContent = song.name;
    document.getElementById('random-song-info').innerHTML = `${song.category} | ${song.difficulty} | BPM ${song.bpm}`;
    ls11Set('randomPlayed',(ls11Get('randomPlayed',0))+1);

    // Auto-navigate to song after 1.5s
    setTimeout(()=>{
      if(window.app){
        const idx = SONGS.indexOf(song);
        if(idx>=0){
          window.app.selectSong(idx);
          document.getElementById('random-modal').style.display='none';
          document.querySelector('.tab-btn[data-tab="play"]')?.click();
        }
      }
    },1500);
  });
}

// ================ 6. COMPOSITION PLAYGROUND ================
let compNotes = [], compPlaying = false;

function buildCompositionUI(){
  const modal = document.createElement('div');
  modal.id = 'compose-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127926; &#51089;&#44257; &#45440;&#51060;&#53552;</h2>
      <button onclick="document.getElementById('compose-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:11px;color:var(--text2);margin-bottom:8px">&#44148;&#48152;&#51012; &#45580;&#47084; &#47708;&#47196;&#46356;&#47484; &#47564;&#46308;&#44256; &#51116;&#49373;&#54644;&#48372;&#49464;&#50836;</p>
    <div id="compose-notes" style="display:flex;gap:3px;flex-wrap:wrap;min-height:40px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px;margin-bottom:8px"></div>
    <div style="font-size:10px;color:var(--text2);margin-bottom:8px" id="compose-count">0/32 &#45432;&#53944;</div>
    <div id="compose-piano" style="display:flex;position:relative;height:80px;margin-bottom:12px"></div>
    <div style="display:flex;gap:8px;justify-content:center">
      <button id="compose-play-btn" style="padding:8px 20px;border-radius:8px;border:none;background:var(--green);color:white;font-size:12px;cursor:pointer">&#9654; &#51116;&#49373;</button>
      <button id="compose-clear-btn" style="padding:8px 20px;border-radius:8px;border:none;background:var(--red);color:white;font-size:12px;cursor:pointer">&#128465; &#52488;&#44592;&#54868;</button>
      <button id="compose-save-btn" style="padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">&#128190; &#51200;&#51109;</button>
    </div>
    <div id="compose-saved-list" style="margin-top:12px"></div>
  </div>`;
  document.body.appendChild(modal);

  // Mini piano
  const pianoDiv = modal.querySelector('#compose-piano');
  const whiteNotes = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
  const blackNotes = {0:'C#4',1:'D#4',3:'F#4',4:'G#4',5:'A#4',7:'C#5',8:'D#5'};
  whiteNotes.forEach((n,i)=>{
    const key = document.createElement('div');
    key.style.cssText = 'flex:1;background:linear-gradient(180deg,#f8f8f8,#e8e8e8);border:1px solid #ccc;border-radius:0 0 4px 4px;cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;position:relative';
    key.innerHTML = `<span style="font-size:7px;color:#999">${n.replace(/\d/,'')}</span>`;
    key.addEventListener('click',()=>addComposeNote(n));
    key.addEventListener('pointerdown',()=>{key.style.background='linear-gradient(180deg,#4a7dff,#3a6de0)';});
    key.addEventListener('pointerup',()=>{key.style.background='linear-gradient(180deg,#f8f8f8,#e8e8e8)';});
    pianoDiv.appendChild(key);
  });
  // Black keys overlay
  Object.entries(blackNotes).forEach(([pos,note])=>{
    const bk = document.createElement('div');
    const offset = (parseInt(pos)+1)*10 - 3;
    bk.style.cssText = `position:absolute;width:8%;height:55%;background:linear-gradient(180deg,#2a2a3e,#1a1a2e);border:1px solid #000;border-radius:0 0 3px 3px;cursor:pointer;z-index:2;left:${offset}%`;
    bk.addEventListener('click',()=>addComposeNote(note));
    bk.addEventListener('pointerdown',()=>{bk.style.background='#3355aa';});
    bk.addEventListener('pointerup',()=>{bk.style.background='linear-gradient(180deg,#2a2a3e,#1a1a2e)';});
    pianoDiv.appendChild(bk);
  });

  modal.querySelector('#compose-play-btn').addEventListener('click', playComposition);
  modal.querySelector('#compose-clear-btn').addEventListener('click', ()=>{
    compNotes=[];
    renderComposeNotes();
  });
  modal.querySelector('#compose-save-btn').addEventListener('click', saveComposition);
  renderSavedCompositions();
}

function addComposeNote(noteName){
  if(compNotes.length>=32) return;
  compNotes.push(noteName);
  const freq = noteToFreq(noteName);
  if(freq) playFreq(freq, 0.3);
  playSFX11('compose_note');
  renderComposeNotes();
}

function renderComposeNotes(){
  const container = document.getElementById('compose-notes');
  if(!container) return;
  container.innerHTML = '';
  compNotes.forEach((n,i)=>{
    const span = document.createElement('span');
    span.style.cssText = 'padding:4px 8px;border-radius:4px;font-size:10px;background:var(--accent);color:white;cursor:pointer';
    span.textContent = n;
    span.title = '\u{D074}\u{B9AD}\u{D558}\u{BA74} \u{C0AD}\u{C81C}';
    span.addEventListener('click',()=>{
      compNotes.splice(i,1);
      renderComposeNotes();
    });
    container.appendChild(span);
  });
  document.getElementById('compose-count').textContent = `${compNotes.length}/32 \u{B178}\u{D2B8}`;
}

function playComposition(){
  if(compPlaying || compNotes.length===0) return;
  compPlaying = true;
  compNotes.forEach((n,i)=>{
    const freq = noteToFreq(n);
    if(freq) playFreqAt(freq, 0.3, i*0.35);
  });
  setTimeout(()=>{compPlaying=false;}, compNotes.length*350+500);
}

function saveComposition(){
  if(compNotes.length===0) return;
  const saved = ls11Get('compositions',[]);
  saved.push({notes:[...compNotes], date:new Date().toISOString().split('T')[0], id:Date.now()});
  if(saved.length>10) saved.shift();
  ls11Set('compositions',saved);
  ls11Set('compositionsSaved',(ls11Get('compositionsSaved',0))+1);
  renderSavedCompositions();
}

function renderSavedCompositions(){
  const list = document.getElementById('compose-saved-list');
  if(!list) return;
  const saved = ls11Get('compositions',[]);
  if(saved.length===0){list.innerHTML='<div style="font-size:11px;color:var(--text2);text-align:center">&#51200;&#51109;&#46108; &#44257;&#51060; &#50630;&#49845;&#45768;&#45796;</div>';return;}
  list.innerHTML = '<div style="font-size:12px;color:var(--accent);margin-bottom:6px;font-weight:600">&#128190; &#51200;&#51109;&#46108; &#44257;</div>';
  saved.forEach((comp,i)=>{
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)';
    row.innerHTML = `<div style="font-size:11px;color:var(--text2)">#${i+1} (${comp.notes.length}&#45432;&#53944;) ${comp.date}</div>
      <button style="padding:4px 10px;border-radius:4px;border:none;background:var(--purple);color:white;font-size:10px;cursor:pointer">&#9654;</button>`;
    row.querySelector('button').addEventListener('click',()=>{
      comp.notes.forEach((n,ni)=>{
        const freq = noteToFreq(n);
        if(freq) playFreqAt(freq, 0.3, ni*0.35);
      });
    });
    list.appendChild(row);
  });
}

// ================ 7. HAND INDEPENDENCE TRAINER ================
const HAND_EXERCISES = [
  {name:'&#50577;&#49552; &#50976;&#45768;&#49832; (C Major)', left:['C3','E3','G3','C3'], right:['C4','D4','E4','F4','G4','A4','B4','C5'], desc:'&#50812;&#49552; &#49828;&#52992;&#51068; + &#50724;&#47480;&#49552; &#53076;&#46300;'},
  {name:'&#50577;&#49552; &#48152;&#51452;&#54665;', left:['C3','G3','C3','G3','C3','G3'], right:['E4','G4','C5','E4','G4','C5'], desc:'&#50812;&#49552; &#44368;&#45824; &#48288;&#51060;&#49828; + &#50724;&#47480;&#49552; &#50500;&#47476;&#54168;&#51648;&#50724;'},
  {name:'&#50577;&#49552; &#48337;&#54665; 3&#46020;', left:['C3','D3','E3','F3','G3','F3','E3','D3'], right:['E4','F4','G4','A4','B4','A4','G4','F4'], desc:'&#50812;&#49552;&#44284; &#50724;&#47480;&#49552; 3&#46020; &#44036;&#44201; &#48337;&#54665;'},
  {name:'&#50577;&#49552; &#48152;&#51652;&#54665;', left:['C3','B2','A2','G2','F2','G2','A2','B2'], right:['C4','D4','E4','F4','G4','F4','E4','D4'], desc:'&#50812;&#49552; &#54616;&#54665; + &#50724;&#47480;&#49552; &#49345;&#54665;'}
];

function buildHandIndependenceUI(){
  const modal = document.createElement('div');
  modal.id = 'hand-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,440px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#9995; &#50577;&#49552; &#46021;&#47549; &#54984;&#47144;</h2>
      <button onclick="document.getElementById('hand-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:11px;color:var(--text2);margin-bottom:12px">&#50812;&#49552;&#44284; &#50724;&#47480;&#49552;&#51012; &#46021;&#47549;&#51201;&#51004;&#47196; &#50880;&#51649;&#51060;&#45716; &#50672;&#49845;</p>
    <div id="hand-exercises" style="display:flex;flex-direction:column;gap:8px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderHandExercises();
}

function renderHandExercises(){
  const container = document.getElementById('hand-exercises');
  if(!container) return;
  container.innerHTML = '';
  HAND_EXERCISES.forEach((ex,i)=>{
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px';
    const tmpN = document.createElement('span'); tmpN.innerHTML = ex.name;
    const tmpD = document.createElement('span'); tmpD.innerHTML = ex.desc;
    card.innerHTML = `
      <div style="font-size:13px;font-weight:600;color:var(--text)">${tmpN.textContent}</div>
      <div style="font-size:10px;color:var(--text2);margin:4px 0">${tmpD.textContent}</div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <div style="flex:1;padding:6px;background:rgba(59,130,246,0.1);border-radius:4px">
          <div style="font-size:9px;color:var(--blue);font-weight:600">L</div>
          <div style="font-size:10px;color:var(--text2)">${ex.left.join(' ')}</div>
        </div>
        <div style="flex:1;padding:6px;background:rgba(239,68,68,0.1);border-radius:4px">
          <div style="font-size:9px;color:var(--red);font-weight:600">R</div>
          <div style="font-size:10px;color:var(--text2)">${ex.right.join(' ')}</div>
        </div>
      </div>
      <button class="hand-play-btn" data-idx="${i}" style="margin-top:8px;padding:6px 16px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer;width:100%">&#127911; &#46307;&#44592;</button>`;
    container.appendChild(card);
  });
  container.querySelectorAll('.hand-play-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx = parseInt(btn.dataset.idx);
      const ex = HAND_EXERCISES[idx];
      const maxLen = Math.max(ex.left.length, ex.right.length);
      for(let i=0;i<maxLen;i++){
        if(i<ex.left.length){
          const f = noteToFreq(ex.left[i]);
          if(f) playFreqAt(f, 0.4, i*0.5);
        }
        if(i<ex.right.length){
          const f = noteToFreq(ex.right[i]);
          if(f) playFreqAt(f, 0.4, i*0.5);
        }
      }
      ls11Set('handExercises',(ls11Get('handExercises',0))+1);
    });
  });
}

// ================ 8. COMPOSER GALLERY ================
const COMPOSERS = [
  {name:'&#48148;&#54750; (J.S. Bach)', era:'&#48148;&#47196;&#53356; (1685-1750)', works:'&#54217;&#44512;&#50984; / &#53664;&#52852;&#53440;&#50752; &#54392;&#44032; / &#48652;&#46976;&#45940;&#48512;&#47476;&#53356; &#54801;&#51452;&#44257;', style:'&#45824;&#50948;&#48277;, &#54392;&#44032;, &#50724;&#47476;&#44036; &#51020;&#50501;', icon:'&#127932;'},
  {name:'&#47784;&#52264;&#47476;&#53944; (W.A. Mozart)', era:'&#44256;&#51204;&#54028; (1756-1791)', works:'&#51089;&#51008;&#48324;&#48320;&#51452;&#44257; / &#53552;&#53412; &#54665;&#51652;&#44257; / &#47588;&#51649;&#54540;&#47336;&#53944;', style:'&#47704;&#47196;&#46356; &#52380;&#51116;, &#50724;&#54168;&#46972;, &#54801;&#51452;&#44257;', icon:'&#127926;'},
  {name:'&#48288;&#53664;&#48292; (L.v. Beethoven)', era:'&#44256;&#51204;-&#45229;&#47564; (1770-1827)', works:'&#50648;&#47532;&#51228; / &#50900;&#44305;&#49548;&#45208;&#53440; / &#50868;&#47749;&#44368;&#54693;&#44257;', style:'&#44368;&#54693;&#44257;, &#49548;&#45208;&#53440;, &#44048;&#51221; &#54364;&#54788;', icon:'&#127929;'},
  {name:'&#49660;&#54077; (F. Chopin)', era:'&#45229;&#47564;&#54028; (1810-1849)', works:'&#50556;&#49345;&#44257; / &#50640;&#53916;&#46300; / &#48156;&#46972;&#46300;', style:'&#54588;&#50500;&#45432; &#49884;&#51064;, &#47336;&#48148;&#53664;, &#49436;&#51221;&#51201;', icon:'&#127928;'},
  {name:'&#47532;&#49828;&#53944; (F. Liszt)', era:'&#45229;&#47564;&#54028; (1811-1886)', works:'&#46972;&#52856;&#54028;&#45768;&#46972; / &#49324;&#46993;&#51032;&#44990; / &#54756;&#44032;&#47532; &#46989;&#49548;&#46356;', style:'&#52488;&#51208;&#44592;&#44368;, &#44368;&#54693;&#49884;, &#54588;&#50500;&#45432; &#44144;&#51109;', icon:'&#127927;'},
  {name:'&#52264;&#51060;&#53076;&#54532;&#49828;&#53412; (P.I. Tchaikovsky)', era:'&#45229;&#47564;&#54028; (1840-1893)', works:'&#48177;&#51312;&#51032;&#54840; / &#54588;&#50500;&#45432;&#54801;&#51452;&#44257;1 / &#54840;&#46160;&#44628;&#44592;&#51064;&#54805;', style:'&#48156;&#47112;, &#50724;&#52992;&#49828;&#53944;&#46972;, &#50724;&#54168;&#46972;', icon:'&#127935;'},
  {name:'&#46300;&#48868;&#49884; (C. Debussy)', era:'&#51064;&#49345;&#54028; (1862-1918)', works:'&#50900;&#44305; / &#50500;&#46972;&#48288;&#49828;&#53356; / &#48148;&#45796;', style:'&#51064;&#49345;&#51452;&#51032;, &#51204;&#51020;&#44228;, &#51088;&#50976;&#47196;&#50868;', icon:'&#127754;'},
  {name:'&#46972;&#54732;&#47560;&#45768;&#45432;&#54532; (S. Rachmaninoff)', era:'&#54980;&#44592;&#45229;&#47564; (1873-1943)', works:'&#54588;&#50500;&#45432;&#54801;&#51452;&#44257;2 / &#54028;&#44032;&#45768;&#45768;&#51452;&#51228;&#50640;&#51032;&#48320;&#51452; / &#51204;&#51452;&#44257;', style:'&#50885;&#51109;&#54620; &#47704;&#47196;&#46356;, &#45824;&#48276;&#54620; &#44396;&#49457;', icon:'&#127929;'},
  {name:'&#48148;&#47476;&#53665; (B. Bartok)', era:'&#44540;&#45824; (1881-1945)', works:'&#48120;&#53356;&#47196;&#53076;&#49828;&#47784;&#49828; / &#50612;&#47536;&#51060;&#47484;&#50948;&#54620;&#50896; / &#54588;&#50500;&#45432;&#49548;&#45208;&#53440;', style:'&#48124;&#49549;&#51020;&#50501;, &#48520;&#54801;&#54868;&#51020;, &#47532;&#46316;', icon:'&#127925;'},
  {name:'&#49324;&#54000; (E. Satie)', era:'&#44540;&#45824; (1866-1925)', works:'&#51664;&#45432;&#54168;&#46356; / &#44536;&#45432;&#49884;&#50644;&#45712; / &#44032;&#44396;&#51020;&#50501;', style:'&#48120;&#45768;&#47560;&#47532;&#51608;, &#50500;&#48169;&#44032;&#47476;&#46300;', icon:'&#127912;'},
  {name:'&#44396;&#45432; (C. Gounod)', era:'&#45229;&#47564;&#54028; (1818-1893)', works:'&#50500;&#48288;&#47560;&#47532;&#50500; / &#54028;&#50864;&#49828;&#53944; / &#49457;&#52404;&#52832;&#47532;&#50500;&#48120;&#49324;', style:'&#50724;&#54168;&#46972;, &#51333;&#44368;&#51020;&#50501;, &#47704;&#47196;&#46356;', icon:'&#9962;&#65039;'},
  {name:'&#49800;&#47564; (R. Schumann)', era:'&#45229;&#47564;&#54028; (1810-1856)', works:'&#53944;&#47196;&#51060;&#47700;&#46972;&#51060; / &#50612;&#47536;&#51060;&#51032;&#51221;&#44221; / &#54588;&#50500;&#45432;&#54801;&#51452;&#44257;a', style:'&#47928;&#54617;&#51201; &#54364;&#54788;, &#49457;&#44201;&#48320;&#51452;', icon:'&#128214;'}
];

function buildComposerGalleryUI(){
  const modal = document.createElement('div');
  modal.id = 'composer-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127912; &#51089;&#44257;&#44032; &#44040;&#47084;&#47532;</h2>
      <button onclick="document.getElementById('composer-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="composer-list" style="display:flex;flex-direction:column;gap:8px"></div>
  </div>`;
  document.body.appendChild(modal);

  const list = modal.querySelector('#composer-list');
  COMPOSERS.forEach(c=>{
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:0.2s';
    const tmpN = document.createElement('span'); tmpN.innerHTML = c.name;
    const tmpE = document.createElement('span'); tmpE.innerHTML = c.era;
    const tmpW = document.createElement('span'); tmpW.innerHTML = c.works;
    const tmpS = document.createElement('span'); tmpS.innerHTML = c.style;
    const tmpI = document.createElement('span'); tmpI.innerHTML = c.icon;
    card.innerHTML = `
      <div style="display:flex;gap:10px;align-items:flex-start">
        <div style="font-size:28px;flex-shrink:0">${tmpI.textContent}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text)">${tmpN.textContent}</div>
          <div style="font-size:10px;color:var(--accent);margin:2px 0">${tmpE.textContent}</div>
          <div style="font-size:10px;color:var(--text2);margin:4px 0"><strong>&#45824;&#54364;&#51089;:</strong> ${tmpW.textContent}</div>
          <div style="font-size:10px;color:var(--text2)"><strong>&#53945;&#51669;:</strong> ${tmpS.textContent}</div>
        </div>
      </div>`;
    card.addEventListener('mouseenter',()=>card.style.borderColor='var(--accent)');
    card.addEventListener('mouseleave',()=>card.style.borderColor='var(--border)');
    list.appendChild(card);
  });
}

// ================ 9. NEW SONGS (10 songs, 72→82) ================
function addV11Songs(){
  if(typeof SONGS === 'undefined') return;
  const newSongs = [
    {
      id:'brahms_lullaby', name:'\u{BE0C}\u{B78C}\u{C2A4} \u{C790}\u{C7A5}\u{AC00}', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'easy',
      icon:'\u{1F319}', color:'#6366f1', bpm:60, timeSignature:'3/4',
      notes:[
        {note:'E4',time:0,dur:0.5,hand:'R'},{note:'E4',time:0.6,dur:0.5,hand:'R'},
        {note:'G4',time:1.2,dur:0.9,hand:'R'},{note:'E4',time:2.4,dur:0.5,hand:'R'},
        {note:'E4',time:3,dur:0.5,hand:'R'},{note:'G4',time:3.6,dur:0.9,hand:'R'},
        {note:'E4',time:4.8,dur:0.5,hand:'R'},{note:'G4',time:5.4,dur:0.5,hand:'R'},
        {note:'C5',time:6,dur:0.9,hand:'R'},{note:'B4',time:7.2,dur:0.9,hand:'R'},
        {note:'A4',time:8.4,dur:0.5,hand:'R'},{note:'A4',time:9,dur:0.5,hand:'R'},
        {note:'B4',time:9.6,dur:0.9,hand:'R'},{note:'A4',time:10.8,dur:0.5,hand:'R'},
        {note:'A4',time:11.4,dur:0.5,hand:'R'},{note:'G4',time:12,dur:0.9,hand:'R'},
        {note:'E4',time:13.2,dur:0.5,hand:'R'},{note:'G4',time:13.8,dur:0.5,hand:'R'},
        {note:'A4',time:14.4,dur:0.5,hand:'R'},{note:'G4',time:15,dur:0.5,hand:'R'},
        {note:'E4',time:15.6,dur:0.5,hand:'R'},{note:'D4',time:16.2,dur:0.5,hand:'R'},
        {note:'C4',time:16.8,dur:0.9,hand:'R'}
      ]
    },
    {
      id:'pachelbel_canon', name:'\u{D30C}\u{D5EC}\u{BCA8} \u{CE90}\u{B17C}', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F3B6}', color:'#8b5cf6', bpm:72, timeSignature:'4/4',
      notes:[
        {note:'E5',time:0,dur:0.9,hand:'R'},{note:'D5',time:1,dur:0.9,hand:'R'},
        {note:'C5',time:2,dur:0.9,hand:'R'},{note:'B4',time:3,dur:0.9,hand:'R'},
        {note:'A4',time:4,dur:0.9,hand:'R'},{note:'G4',time:5,dur:0.9,hand:'R'},
        {note:'A4',time:6,dur:0.9,hand:'R'},{note:'B4',time:7,dur:0.9,hand:'R'},
        {note:'C5',time:8,dur:0.5,hand:'R'},{note:'E5',time:8.5,dur:0.5,hand:'R'},
        {note:'D5',time:9,dur:0.5,hand:'R'},{note:'B4',time:9.5,dur:0.5,hand:'R'},
        {note:'C5',time:10,dur:0.5,hand:'R'},{note:'A4',time:10.5,dur:0.5,hand:'R'},
        {note:'B4',time:11,dur:0.5,hand:'R'},{note:'G4',time:11.5,dur:0.5,hand:'R'},
        {note:'A4',time:12,dur:0.5,hand:'R'},{note:'C5',time:12.5,dur:0.5,hand:'R'},
        {note:'B4',time:13,dur:0.5,hand:'R'},{note:'D5',time:13.5,dur:0.5,hand:'R'},
        {note:'C5',time:14,dur:0.9,hand:'R'},
        {note:'C3',time:0,dur:0.9,hand:'L'},{note:'G3',time:1,dur:0.9,hand:'L'},
        {note:'A3',time:2,dur:0.9,hand:'L'},{note:'E3',time:3,dur:0.9,hand:'L'},
        {note:'F3',time:4,dur:0.9,hand:'L'},{note:'C3',time:5,dur:0.9,hand:'L'},
        {note:'F3',time:6,dur:0.9,hand:'L'},{note:'G3',time:7,dur:0.9,hand:'L'},
        {note:'C3',time:8,dur:1.8,hand:'L'},{note:'A3',time:10,dur:1.8,hand:'L'},
        {note:'F3',time:12,dur:1.8,hand:'L'}
      ]
    },
    {
      id:'gymnopedie', name:'\u{C9D0}\u{B178}\u{D398}\u{B514} 1\u{BC88} (\u{C0AC}\u{D2F0})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F30A}', color:'#06b6d4', bpm:66, timeSignature:'3/4',
      notes:[
        {note:'F#4',time:0,dur:0.5,hand:'R'},{note:'G4',time:0.8,dur:0.5,hand:'R'},
        {note:'D5',time:1.8,dur:0.9,hand:'R'},{note:'C#5',time:3,dur:0.9,hand:'R'},
        {note:'F#4',time:4.5,dur:0.5,hand:'R'},{note:'G4',time:5.3,dur:0.5,hand:'R'},
        {note:'D5',time:6.3,dur:0.9,hand:'R'},{note:'C#5',time:7.5,dur:0.9,hand:'R'},
        {note:'E4',time:9,dur:0.5,hand:'R'},{note:'F#4',time:9.8,dur:0.5,hand:'R'},
        {note:'B4',time:10.8,dur:0.9,hand:'R'},{note:'A4',time:12,dur:0.9,hand:'R'},
        {note:'G4',time:13.5,dur:0.9,hand:'R'},{note:'F#4',time:15,dur:0.9,hand:'R'},
        {note:'G3',time:0,dur:1.5,hand:'L'},{note:'D3',time:1.8,dur:1.5,hand:'L'},
        {note:'G3',time:4.5,dur:1.5,hand:'L'},{note:'D3',time:6.3,dur:1.5,hand:'L'},
        {note:'C3',time:9,dur:1.5,hand:'L'},{note:'G3',time:10.8,dur:1.5,hand:'L'},
        {note:'D3',time:13.5,dur:1.5,hand:'L'}
      ]
    },
    {
      id:'river_flows', name:'River Flows In You', category:'\u{D31D}', difficulty:'hard',
      icon:'\u{1F30A}', color:'#0ea5e9', bpm:68, timeSignature:'4/4',
      notes:[
        {note:'A4',time:0,dur:0.3,hand:'R'},{note:'B4',time:0.3,dur:0.3,hand:'R'},
        {note:'C5',time:0.6,dur:0.3,hand:'R'},{note:'B4',time:0.9,dur:0.3,hand:'R'},
        {note:'C5',time:1.2,dur:0.3,hand:'R'},{note:'E5',time:1.5,dur:0.3,hand:'R'},
        {note:'B4',time:1.8,dur:0.6,hand:'R'},
        {note:'A4',time:2.5,dur:0.3,hand:'R'},{note:'B4',time:2.8,dur:0.3,hand:'R'},
        {note:'C5',time:3.1,dur:0.3,hand:'R'},{note:'B4',time:3.4,dur:0.3,hand:'R'},
        {note:'A4',time:3.7,dur:0.3,hand:'R'},{note:'G4',time:4,dur:0.6,hand:'R'},
        {note:'A4',time:4.8,dur:0.3,hand:'R'},{note:'E4',time:5.1,dur:0.6,hand:'R'},
        {note:'A4',time:6,dur:0.3,hand:'R'},{note:'B4',time:6.3,dur:0.3,hand:'R'},
        {note:'C5',time:6.6,dur:0.3,hand:'R'},{note:'B4',time:6.9,dur:0.3,hand:'R'},
        {note:'C5',time:7.2,dur:0.3,hand:'R'},{note:'E5',time:7.5,dur:0.3,hand:'R'},
        {note:'B4',time:7.8,dur:0.6,hand:'R'},
        {note:'A4',time:8.5,dur:0.3,hand:'R'},{note:'G4',time:8.8,dur:0.3,hand:'R'},
        {note:'A4',time:9.1,dur:0.9,hand:'R'},
        {note:'A3',time:0,dur:0.9,hand:'L'},{note:'E3',time:0,dur:0.9,hand:'L'},
        {note:'A3',time:2.5,dur:0.9,hand:'L'},{note:'E3',time:2.5,dur:0.9,hand:'L'},
        {note:'F3',time:4.8,dur:0.9,hand:'L'},{note:'C3',time:4.8,dur:0.9,hand:'L'},
        {note:'G3',time:6,dur:0.9,hand:'L'},{note:'E3',time:6,dur:0.9,hand:'L'},
        {note:'A3',time:8.5,dur:0.9,hand:'L'}
      ]
    },
    {
      id:'arirang', name:'\u{C544}\u{B9AC}\u{B791}', category:'\u{C804}\u{D1B5}', difficulty:'easy',
      icon:'\u{1F1F0}\u{1F1F7}', color:'#dc2626', bpm:80, timeSignature:'3/4',
      notes:[
        {note:'G4',time:0,dur:0.5,hand:'R'},{note:'A4',time:0.6,dur:0.5,hand:'R'},
        {note:'C5',time:1.2,dur:0.9,hand:'R'},{note:'D5',time:2.4,dur:0.5,hand:'R'},
        {note:'E5',time:3,dur:0.9,hand:'R'},{note:'D5',time:4.2,dur:0.5,hand:'R'},
        {note:'C5',time:4.8,dur:0.5,hand:'R'},{note:'A4',time:5.4,dur:0.9,hand:'R'},
        {note:'G4',time:6.6,dur:0.5,hand:'R'},{note:'A4',time:7.2,dur:0.5,hand:'R'},
        {note:'C5',time:7.8,dur:0.9,hand:'R'},{note:'D5',time:9,dur:0.5,hand:'R'},
        {note:'C5',time:9.6,dur:0.5,hand:'R'},{note:'A4',time:10.2,dur:0.5,hand:'R'},
        {note:'G4',time:10.8,dur:0.9,hand:'R'},
        {note:'E5',time:12,dur:0.5,hand:'R'},{note:'E5',time:12.6,dur:0.5,hand:'R'},
        {note:'D5',time:13.2,dur:0.9,hand:'R'},{note:'C5',time:14.4,dur:0.5,hand:'R'},
        {note:'A4',time:15,dur:0.5,hand:'R'},{note:'G4',time:15.6,dur:0.9,hand:'R'}
      ]
    },
    {
      id:'la_vie_en_rose', name:'La Vie En Rose', category:'\u{D31D}', difficulty:'medium',
      icon:'\u{1F339}', color:'#ec4899', bpm:78, timeSignature:'4/4',
      notes:[
        {note:'G4',time:0,dur:0.4,hand:'R'},{note:'A4',time:0.5,dur:0.4,hand:'R'},
        {note:'C5',time:1,dur:0.4,hand:'R'},{note:'D5',time:1.5,dur:0.9,hand:'R'},
        {note:'D5',time:2.5,dur:0.4,hand:'R'},{note:'E5',time:3,dur:0.4,hand:'R'},
        {note:'C5',time:3.5,dur:0.9,hand:'R'},
        {note:'A4',time:4.5,dur:0.4,hand:'R'},{note:'C5',time:5,dur:0.4,hand:'R'},
        {note:'D5',time:5.5,dur:0.4,hand:'R'},{note:'C5',time:6,dur:0.4,hand:'R'},
        {note:'A4',time:6.5,dur:0.9,hand:'R'},
        {note:'G4',time:7.5,dur:0.4,hand:'R'},{note:'A4',time:8,dur:0.4,hand:'R'},
        {note:'C5',time:8.5,dur:0.4,hand:'R'},{note:'D5',time:9,dur:0.9,hand:'R'},
        {note:'E5',time:10,dur:0.4,hand:'R'},{note:'D5',time:10.5,dur:0.4,hand:'R'},
        {note:'C5',time:11,dur:0.9,hand:'R'},
        {note:'C3',time:0,dur:0.9,hand:'L'},{note:'G3',time:2,dur:0.9,hand:'L'},
        {note:'F3',time:4,dur:0.9,hand:'L'},{note:'C3',time:6,dur:0.9,hand:'L'},
        {note:'C3',time:7.5,dur:0.9,hand:'L'},{note:'G3',time:9,dur:0.9,hand:'L'}
      ]
    },
    {
      id:'comptine', name:'Comptine (Amelie OST)', category:'\u{D31D}', difficulty:'hard',
      icon:'\u{1F3AC}', color:'#f59e0b', bpm:100, timeSignature:'4/4',
      notes:[
        {note:'E5',time:0,dur:0.2,hand:'R'},{note:'F5',time:0.25,dur:0.2,hand:'R'},
        {note:'E5',time:0.5,dur:0.2,hand:'R'},{note:'F5',time:0.75,dur:0.2,hand:'R'},
        {note:'E5',time:1,dur:0.2,hand:'R'},{note:'B4',time:1.25,dur:0.2,hand:'R'},
        {note:'D5',time:1.5,dur:0.2,hand:'R'},{note:'C5',time:1.75,dur:0.2,hand:'R'},
        {note:'A4',time:2,dur:0.4,hand:'R'},
        {note:'C4',time:2.5,dur:0.2,hand:'R'},{note:'E4',time:2.75,dur:0.2,hand:'R'},
        {note:'A4',time:3,dur:0.4,hand:'R'},
        {note:'B4',time:3.5,dur:0.2,hand:'R'},{note:'C5',time:3.75,dur:0.2,hand:'R'},
        {note:'E5',time:4,dur:0.2,hand:'R'},{note:'F5',time:4.25,dur:0.2,hand:'R'},
        {note:'E5',time:4.5,dur:0.2,hand:'R'},{note:'F5',time:4.75,dur:0.2,hand:'R'},
        {note:'E5',time:5,dur:0.2,hand:'R'},{note:'B4',time:5.25,dur:0.2,hand:'R'},
        {note:'D5',time:5.5,dur:0.2,hand:'R'},{note:'C5',time:5.75,dur:0.2,hand:'R'},
        {note:'A4',time:6,dur:0.4,hand:'R'},
        {note:'A3',time:0,dur:0.9,hand:'L'},{note:'E3',time:0,dur:0.9,hand:'L'},
        {note:'A3',time:2,dur:0.9,hand:'L'},{note:'E3',time:2,dur:0.9,hand:'L'},
        {note:'A3',time:4,dur:0.9,hand:'L'},{note:'E3',time:4,dur:0.9,hand:'L'}
      ]
    },
    {
      id:'spring_waltz', name:'\u{BD04} \u{C655}\u{CE20} (\u{C1FC}\u{D321})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'hard',
      icon:'\u{1F338}', color:'#f472b6', bpm:130, timeSignature:'3/4',
      notes:[
        {note:'A4',time:0,dur:0.3,hand:'R'},{note:'C5',time:0.3,dur:0.3,hand:'R'},
        {note:'E5',time:0.6,dur:0.3,hand:'R'},{note:'D5',time:0.9,dur:0.3,hand:'R'},
        {note:'C5',time:1.2,dur:0.3,hand:'R'},{note:'B4',time:1.5,dur:0.3,hand:'R'},
        {note:'A4',time:1.8,dur:0.3,hand:'R'},{note:'G#4',time:2.1,dur:0.3,hand:'R'},
        {note:'A4',time:2.4,dur:0.5,hand:'R'},
        {note:'E5',time:3,dur:0.3,hand:'R'},{note:'D5',time:3.3,dur:0.3,hand:'R'},
        {note:'C5',time:3.6,dur:0.3,hand:'R'},{note:'B4',time:3.9,dur:0.3,hand:'R'},
        {note:'C5',time:4.2,dur:0.3,hand:'R'},{note:'A4',time:4.5,dur:0.3,hand:'R'},
        {note:'G#4',time:4.8,dur:0.3,hand:'R'},{note:'A4',time:5.1,dur:0.5,hand:'R'},
        {note:'A3',time:0,dur:0.9,hand:'L'},{note:'E3',time:0,dur:0.9,hand:'L'},
        {note:'A3',time:1.8,dur:0.9,hand:'L'},{note:'E3',time:1.8,dur:0.9,hand:'L'},
        {note:'A3',time:3,dur:0.9,hand:'L'},{note:'E3',time:3,dur:0.9,hand:'L'}
      ]
    },
    {
      id:'marriage_damour', name:'Marriage d\'Amour', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'expert',
      icon:'\u{1F492}', color:'#be185d', bpm:76, timeSignature:'4/4',
      notes:[
        {note:'E5',time:0,dur:0.3,hand:'R'},{note:'D#5',time:0.3,dur:0.3,hand:'R'},
        {note:'E5',time:0.6,dur:0.3,hand:'R'},{note:'D#5',time:0.9,dur:0.3,hand:'R'},
        {note:'E5',time:1.2,dur:0.3,hand:'R'},{note:'B4',time:1.5,dur:0.3,hand:'R'},
        {note:'D5',time:1.8,dur:0.3,hand:'R'},{note:'C5',time:2.1,dur:0.3,hand:'R'},
        {note:'A4',time:2.4,dur:0.6,hand:'R'},
        {note:'C4',time:3.2,dur:0.3,hand:'R'},{note:'E4',time:3.5,dur:0.3,hand:'R'},
        {note:'A4',time:3.8,dur:0.6,hand:'R'},
        {note:'B4',time:4.6,dur:0.3,hand:'R'},{note:'E4',time:4.9,dur:0.3,hand:'R'},
        {note:'G#4',time:5.2,dur:0.6,hand:'R'},
        {note:'B4',time:6,dur:0.6,hand:'R'},
        {note:'C5',time:6.8,dur:0.3,hand:'R'},{note:'E5',time:7.1,dur:0.3,hand:'R'},
        {note:'D#5',time:7.4,dur:0.3,hand:'R'},{note:'E5',time:7.7,dur:0.3,hand:'R'},
        {note:'D#5',time:8,dur:0.3,hand:'R'},{note:'E5',time:8.3,dur:0.3,hand:'R'},
        {note:'B4',time:8.6,dur:0.3,hand:'R'},{note:'D5',time:8.9,dur:0.3,hand:'R'},
        {note:'C5',time:9.2,dur:0.3,hand:'R'},{note:'A4',time:9.5,dur:0.6,hand:'R'},
        {note:'A2',time:0,dur:0.9,hand:'L'},{note:'E3',time:0,dur:0.9,hand:'L'},
        {note:'A3',time:0,dur:0.9,hand:'L'},
        {note:'A2',time:2.4,dur:0.9,hand:'L'},{note:'E3',time:2.4,dur:0.9,hand:'L'},
        {note:'E2',time:4.6,dur:0.9,hand:'L'},{note:'B2',time:4.6,dur:0.9,hand:'L'},
        {note:'A2',time:6.8,dur:0.9,hand:'L'},{note:'E3',time:6.8,dur:0.9,hand:'L'},
        {note:'A2',time:9.2,dur:0.9,hand:'L'}
      ]
    },
    {
      id:'merry_xmas', name:'We Wish You a Merry Christmas', category:'\u{B3D9}\u{C694}', difficulty:'easy',
      icon:'\u{1F384}', color:'#16a34a', bpm:120, timeSignature:'3/4',
      notes:[
        {note:'G4',time:0,dur:0.4,hand:'R'},
        {note:'C5',time:0.5,dur:0.4,hand:'R'},{note:'C5',time:1,dur:0.2,hand:'R'},
        {note:'D5',time:1.3,dur:0.2,hand:'R'},{note:'C5',time:1.6,dur:0.2,hand:'R'},
        {note:'B4',time:1.9,dur:0.4,hand:'R'},{note:'A4',time:2.4,dur:0.4,hand:'R'},
        {note:'A4',time:2.9,dur:0.4,hand:'R'},
        {note:'D5',time:3.4,dur:0.4,hand:'R'},{note:'D5',time:3.9,dur:0.2,hand:'R'},
        {note:'E5',time:4.2,dur:0.2,hand:'R'},{note:'D5',time:4.5,dur:0.2,hand:'R'},
        {note:'C5',time:4.8,dur:0.4,hand:'R'},{note:'B4',time:5.3,dur:0.4,hand:'R'},
        {note:'G4',time:5.8,dur:0.4,hand:'R'},
        {note:'E5',time:6.3,dur:0.4,hand:'R'},{note:'E5',time:6.8,dur:0.2,hand:'R'},
        {note:'F5',time:7.1,dur:0.2,hand:'R'},{note:'E5',time:7.4,dur:0.2,hand:'R'},
        {note:'D5',time:7.7,dur:0.4,hand:'R'},{note:'C5',time:8.2,dur:0.4,hand:'R'},
        {note:'G4',time:8.7,dur:0.2,hand:'R'},{note:'G4',time:9,dur:0.2,hand:'R'},
        {note:'A4',time:9.3,dur:0.4,hand:'R'},{note:'D5',time:9.8,dur:0.4,hand:'R'},
        {note:'B4',time:10.3,dur:0.4,hand:'R'},{note:'C5',time:10.8,dur:0.9,hand:'R'}
      ]
    }
  ];
  newSongs.forEach(song=>{
    if(!SONGS.find(s=>s.id===song.id)){
      SONGS.push(song);
    }
  });
}

// ================ 10. PIANO QUIZ v2 (+15 questions, 15→30) ================
const QUIZ_V2 = [
  {q:'&#54588;&#50500;&#45432; &#44148;&#48152;&#51032; &#52509; &#44060;&#49688;(&#54364;&#51456; 88&#44148;)&#50640;&#49436; &#55136;&#44148;&#48152;&#51008; &#47751;&#44060;&#51064;&#44032;?', o:['36','52','56','32'], c:1},
  {q:'&#49380;&#54532;(#)&#50752; &#54540;&#47019;(b)&#51012; &#47784;&#46160; &#52712;&#49548;&#54616;&#45716; &#44592;&#54840;&#45716;?', o:['&#45236;&#52628;&#47092;(&#9838;)','&#45908;&#48660;&#48148;(||)','&#45796;&#52852;&#54252;','&#54168;&#47476;&#47560;&#53440;'], c:0},
  {q:'&#54588;&#50500;&#45432;&#51032; &#54168;&#45804; 3&#44060;(&#49548;&#49828;&#53580;&#45572;&#53664;/&#49548;&#54532;&#53944;/&#45824;&#47532;&#54168;&#45804;) &#51473; &#50724;&#47480;&#51901; &#54168;&#45804;&#51032; &#50669;&#54624;&#51008;?', o:['&#45824;&#47532;&#54168;&#45804;','&#49548;&#49828;&#53580;&#45572;&#53664;','&#49548;&#54532;&#53944;','&#50976;&#45208;&#53076;&#47476;&#45796;'], c:0},
  {q:'4&#48516;&#51020;&#54364;&#51032; &#44256;&#47532;(&#44984;&#47532;) &#51060;&#47492;&#51008; &#50689;&#50612;&#47196;?', o:['Quarter note tail','Quarter note stem','Quarter note flag','Quarter note beam'], c:1},
  {q:'&#54588;&#50500;&#45432;&#51032; &#50501;&#44592; &#48516;&#47448;&#45716;?', o:['&#44288;&#50501;&#44592;','&#53440;&#50501;&#44592;','&#44148;&#48152;&#50501;&#44592;','&#54788;&#50501;&#44592;'], c:2},
  {q:'&#48148;&#54750;&#51032; &quot;&#54217;&#44512;&#50984; &#53364;&#46972;&#48708;&#50612;&#44257;&#51665;&quot;&#51032; &#50689;&#50612; &#50557;&#52845;&#51008;?', o:['WTC','BWV','Op.','K.'], c:0},
  {q:'&#54588;&#50500;&#45432; &#54801;&#51452;&#44257;&#50640;&#49436; &#52852;&#45940;&#52264;(Cadenza)&#46976;?', o:['&#46021;&#51452;&#51088; &#51088;&#50976;&#50672;&#51452; &#44396;&#44036;','&#50724;&#52992;&#49828;&#53944;&#46972; &#54016;&#54028;&#45768;','&#51648;&#55064;&#51088; &#51648;&#49884;','&#50501;&#51109; &#47560;&#51648;&#47561; &#54868;&#51020;'], c:0},
  {q:'&#54588;&#50500;&#45432;&#50640;&#49436; &#47112;&#44032;&#53664;(legato)&#51032; &#48152;&#45824; &#51452;&#48277;&#51008;?', o:['&#49828;&#53440;&#52852;&#53664;','&#54252;&#47476;&#53440;&#47704;&#53664;','&#54588;&#50500;&#45768;&#49884;&#47784;','&#47576;&#52852;&#53664;'], c:0},
  {q:'A4(&#44032;&#50728;&#46020; &#46972;) &#51020;&#51032; &#54364;&#51456; &#51452;&#54028;&#49688;&#45716;?', o:['432Hz','440Hz','444Hz','450Hz'], c:1},
  {q:'&#50577;&#49552; &#50672;&#51452;&#50640;&#49436; &#50812;&#49552;&#51008; &#51452;&#47196; &#50612;&#46500; &#50669;&#54624;&#51012; &#54616;&#45716;&#44032;?', o:['&#48152;&#51452;/&#54868;&#51020;','&#47704;&#47196;&#46356;','&#51109;&#49885;','&#53944;&#47540;'], c:0},
  {q:'&#53364;&#47000;&#54532;(clef)&#51032; &#51333;&#47448;&#44032; &#50500;&#45772; &#44163;&#51008;?', o:['&#45458;&#51008;&#51020;&#51088;&#47532;&#54364;','&#45230;&#51008;&#51020;&#51088;&#47532;&#54364;','&#44032;&#50728;&#51020;&#51088;&#47532;&#54364;','&#48712;&#45768;&#51020;&#51088;&#47532;&#54364;'], c:3},
  {q:'&#54588;&#50500;&#45432;&#51032; &#54788;&#51032; &#44060;&#49688;&#45716; &#48372;&#53685; &#47751;&#44060;&#51064;&#44032;?', o:['88','200','230','300'], c:2},
  {q:'&#49380;&#54532;&#51060; &#54616;&#45208;&#46020; &#50630;&#45716; &#51109;&#51312;&#45716;?', o:['C Major','G Major','F Major','D Major'], c:0},
  {q:'&#47784;&#52264;&#47476;&#53944;&#51032; &#52572;&#52488;&#51032; &#54588;&#50500;&#45432; &#49548;&#45208;&#53440;&#45716; &#47751; &#49332;&#50640; &#51089;&#44257;&#54664;&#45208;?', o:['3&#49332;','5&#49332;','7&#49332;','10&#49332;'], c:1},
  {q:'12&#54217;&#44512;&#50984; &#46608;&#45716; &#45824;&#50628;&#51312;&#50984;&#50640;&#49436; &#48152;&#51020; &#44036;&#44201;&#51032; &#52509; &#44060;&#49688;&#45716;?', o:['7','10','12','24'], c:2}
];
let quiz2Idx=0, quiz2Score=0, quiz2Questions=[];

function buildQuizV2UI(){
  const modal = document.createElement('div');
  modal.id = 'quiz2-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,420px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127891; &#54588;&#50500;&#45432; &#54028;&#51064;&#45908; &#53300;&#51592; (v2)</h2>
      <button onclick="document.getElementById('quiz2-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="quiz2-content"></div>
  </div>`;
  document.body.appendChild(modal);
}

function startQuizV2(){
  quiz2Idx=0; quiz2Score=0;
  quiz2Questions = [...QUIZ_V2].sort(()=>Math.random()-0.5).slice(0,15);
  renderQuizV2Question();
}

function renderQuizV2Question(){
  const container = document.getElementById('quiz2-content');
  if(!container) return;
  if(quiz2Idx >= quiz2Questions.length){
    showQuizV2Result();
    return;
  }
  const q = quiz2Questions[quiz2Idx];
  const tmp = document.createElement('div'); tmp.innerHTML = q.q;
  container.innerHTML = `
    <div style="font-size:11px;color:var(--text2);margin-bottom:8px">${quiz2Idx+1}/${quiz2Questions.length}</div>
    <div style="font-size:14px;font-weight:600;margin-bottom:16px;line-height:1.5">${tmp.textContent}</div>
    <div style="display:flex;flex-direction:column;gap:8px" id="quiz2-options"></div>`;
  const optDiv = container.querySelector('#quiz2-options');
  q.o.forEach((opt,idx)=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:10px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
    const tmpO = document.createElement('span'); tmpO.innerHTML = opt;
    btn.textContent = tmpO.textContent;
    btn.addEventListener('click',()=>{
      const correct = idx === q.c;
      if(correct){
        quiz2Score++;
        btn.style.background = 'var(--green)';
        btn.style.color = 'white';
        playSFX11('ear_correct');
      } else {
        btn.style.background = 'var(--red)';
        btn.style.color = 'white';
        playSFX11('ear_wrong');
        optDiv.children[q.c].style.background = 'var(--green)';
        optDiv.children[q.c].style.color = 'white';
      }
      optDiv.querySelectorAll('button').forEach(b=>b.style.pointerEvents='none');
      quiz2Idx++;
      setTimeout(renderQuizV2Question, 1200);
    });
    optDiv.appendChild(btn);
  });
}

function showQuizV2Result(){
  const container = document.getElementById('quiz2-content');
  if(!container) return;
  const pct = Math.round(quiz2Score/quiz2Questions.length*100);
  const grade = pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=30?'C':'D';
  const gradeColors = {S:'#eab308',A:'#22c55e',B:'#3b82f6',C:'#a855f7',D:'#ef4444'};
  container.innerHTML = `
    <div style="font-size:48px;font-weight:900;color:${gradeColors[grade]}">${grade}</div>
    <div style="font-size:14px;margin:8px 0">${quiz2Score}/${quiz2Questions.length} (${pct}%)</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:16px">${pct>=90?'\u{D305}\u{D0D1}!':pct>=70?'\u{C798}\u{D588}\u{C5B4}\u{C694}!':pct>=50?'\u{B354} \u{B178}\u{B825}\u{D574}\u{BCD4}\u{C694}':'\u{D53C}\u{C544}\u{B178} \u{C9C0}\u{C2DD}\u{C744} \u{B354} \u{C313}\u{C544}\u{BCD4}\u{C694}'}</div>
    <button onclick="startQuizV2()" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;cursor:pointer">&#45796;&#49884; &#54400;&#44592;</button>`;
  if(pct===100) ls11Set('quiz2Perfect',true);
  ls11Set('quiz2Played',(ls11Get('quiz2Played',0))+1);
}

// ================ 11. V11 ACHIEVEMENTS (12 new, 60→72) ================
const V11_ACHIEVEMENTS = [
  {id:'ear_trainer',name:'\u{C74C}\u{AC10} \u{D6C8}\u{B828}\u{C0DD}',icon:'\u{1F3A7}',desc:'\u{C74C}\u{AC10} \u{D6C8}\u{B828} 10\u{D68C} \u{C815}\u{B2F5}'},
  {id:'ear_streak10',name:'\u{C74C}\u{AC10} \u{B2EC}\u{C778}',icon:'\u{1F451}',desc:'\u{C74C}\u{AC10} \u{D6C8}\u{B828} 10\u{C5F0}\u{C18D} \u{C815}\u{B2F5}'},
  {id:'chord_master',name:'\u{CF54}\u{B4DC} \u{B9C8}\u{C2A4}\u{D130}',icon:'\u{1F3B9}',desc:'\u{CF54}\u{B4DC} \u{C9C4}\u{D589} 8\u{C885} \u{BAA8}\u{B450} \u{C7AC}\u{C0DD}'},
  {id:'analyst',name:'\u{BD84}\u{C11D}\u{AC00}',icon:'\u{1F4CA}',desc:'\u{C5F0}\u{C8FC} \u{BD84}\u{C11D} \u{B300}\u{C2DC}\u{BCF4}\u{B4DC} \u{D655}\u{C778}'},
  {id:'practice_5',name:'\u{C5F0}\u{C2B5}\u{BC8C}\u{B808}',icon:'\u{1F4AA}',desc:'\u{C5F0}\u{C2B5}\u{C2E4} 5\u{AC1C} \u{C644}\u{B8CC}'},
  {id:'practice_all',name:'\u{C5F0}\u{C2B5} \u{B9C8}\u{C2A4}\u{D130}',icon:'\u{1F3C6}',desc:'\u{C5F0}\u{C2B5}\u{C2E4} \u{C804}\u{BD80} \u{C644}\u{B8CC}'},
  {id:'composer_viewer',name:'\u{C74C}\u{C545}\u{C0AC}\u{D559}\u{C790}',icon:'\u{1F3A8}',desc:'\u{C791}\u{ACE1}\u{AC00} \u{AC40}\u{B7EC}\u{B9AC} \u{BC29}\u{BB38}'},
  {id:'random_10',name:'\u{B7B5}\u{B364} \u{B2EC}\u{C778}',icon:'\u{1F3B2}',desc:'\u{B7B5}\u{B364} \u{C5F0}\u{C8FC} 10\u{D68C}'},
  {id:'compose_save',name:'\u{C791}\u{ACE1}\u{AC00}',icon:'\u{1F3B5}',desc:'\u{C791}\u{ACE1} \u{B440}\u{C774}\u{D130} \u{C800}\u{C7A5}'},
  {id:'hand_trainer',name:'\u{C591}\u{C190} \u{B2EC}\u{C778}',icon:'\u{270B}',desc:'\u{C591}\u{C190} \u{B3C5}\u{B9BD} \u{D6C8}\u{B828} 5\u{D68C}'},
  {id:'quiz2_perfect',name:'\u{D53C}\u{C544}\u{B178} \u{BC15}\u{C0AC}',icon:'\u{1F393}',desc:'\u{D53C}\u{C544}\u{B178} \u{D30C}\u{C778}\u{B354} \u{D000}\u{C988} v2 \u{B9CC}\u{C810}'},
  {id:'songs_82',name:'82\u{ACE1} \u{B9C8}\u{C2A4}\u{D130}',icon:'\u{1F3B6}',desc:'82\u{ACE1} \u{C804}\u{BD80} \u{C644}\u{C8FC}'}
];

function checkV11Achievements(){
  const unlocked = JSON.parse(localStorage.getItem('pianoAchievements')||'[]');
  let newUnlocks = [];
  const checks = {
    ear_trainer: ()=>(ls11Get('earCorrect',0))>=10,
    ear_streak10: ()=>ls11Get('earStreak10',false),
    chord_master: ()=>(ls11Get('chordPlayed',0))>=8,
    analyst: ()=>ls11Get('analyticsViewed',false),
    practice_5: ()=>(ls11Get('practiceCompleted',[])).length>=5,
    practice_all: ()=>(ls11Get('practiceCompleted',[])).length>=PRACTICE_EXERCISES.length,
    composer_viewer: ()=>ls11Get('composerViewed',false),
    random_10: ()=>(ls11Get('randomPlayed',0))>=10,
    compose_save: ()=>(ls11Get('compositionsSaved',0))>=1,
    hand_trainer: ()=>(ls11Get('handExercises',0))>=5,
    quiz2_perfect: ()=>ls11Get('quiz2Perfect',false),
    songs_82: ()=>{try{const s=JSON.parse(localStorage.getItem('pianoStats')||'{}');return(s.songsCompleted||[]).length>=82}catch{return false}}
  };
  V11_ACHIEVEMENTS.forEach(a=>{
    if(!unlocked.includes(a.id) && checks[a.id] && checks[a.id]()){
      unlocked.push(a.id);
      newUnlocks.push(a);
    }
  });
  if(newUnlocks.length>0){
    localStorage.setItem('pianoAchievements',JSON.stringify(unlocked));
    newUnlocks.forEach(a=>{
      if(window.app && window.app.showToast){
        window.app.showToast(`\u{1F3C6} \u{C5C5}\u{C801} \u{D574}\u{AE08}: ${a.icon} ${a.name}`, 'achievement');
      }
    });
  }
}

function injectV11Achievements(){
  const grid = document.querySelector('.achievement-grid');
  if(!grid) return;
  const unlocked = JSON.parse(localStorage.getItem('pianoAchievements')||'[]');
  V11_ACHIEVEMENTS.forEach(a=>{
    if(grid.querySelector(`[data-id="${a.id}"]`)) return;
    const el = document.createElement('div');
    el.className = 'achievement' + (unlocked.includes(a.id)?' unlocked':'');
    el.dataset.id = a.id;
    el.innerHTML = `<div class="achievement-icon">${a.icon}</div><div>${a.name}</div><div style="font-size:8px;margin-top:2px">${a.desc}</div>`;
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTION BUTTONS v11 ================
function injectV11QuickActions(){
  const tabSongs = document.getElementById('tab-songs');
  if(!tabSongs) return;
  const existing = tabSongs.querySelector('.v11-quick-actions');
  if(existing) return;

  const bar = document.createElement('div');
  bar.className = 'v11-quick-actions';
  bar.style.cssText = 'display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  const actions = [
    {label:'\u{1F3A7} \u{C74C}\u{AC10}',fn:()=>{document.getElementById('ear-modal').style.display='flex'}},
    {label:'\u{1F3B9} \u{CF54}\u{B4DC}',fn:()=>{document.getElementById('chord-modal').style.display='flex'}},
    {label:'\u{1F4CA} \u{BD84}\u{C11D}',fn:()=>{document.getElementById('analytics-modal').style.display='flex';renderAnalytics();ls11Set('analyticsViewed',true)}},
    {label:'\u{1F3BC} \u{C5F0}\u{C2B5}\u{C2E4}',fn:()=>{document.getElementById('practice-room-modal').style.display='flex'}},
    {label:'\u{1F3B2} \u{B7B5}\u{B364}',fn:()=>{document.getElementById('random-modal').style.display='flex'}},
    {label:'\u{1F3B5} \u{C791}\u{ACE1}',fn:()=>{document.getElementById('compose-modal').style.display='flex';renderSavedCompositions()}},
    {label:'\u{270B} \u{C591}\u{C190}',fn:()=>{document.getElementById('hand-modal').style.display='flex'}},
    {label:'\u{1F3A8} \u{C791}\u{ACE1}\u{AC00}',fn:()=>{document.getElementById('composer-modal').style.display='flex';playSFX11('gallery_open');ls11Set('composerViewed',true)}},
    {label:'\u{1F393} \u{D000}\u{C988}v2',fn:()=>{document.getElementById('quiz2-modal').style.display='flex';startQuizV2()}}
  ];
  actions.forEach(a=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap';
    btn.textContent = a.label;
    btn.addEventListener('click',a.fn);
    bar.appendChild(btn);
  });
  const filterBar = tabSongs.querySelector('.filter-bar');
  if(filterBar) filterBar.parentNode.insertBefore(bar, filterBar);
  else tabSongs.insertBefore(bar, tabSongs.firstChild);
}

// ================ 13. KEYBOARD SHORTCUTS v11 ================
function setupV11Shortcuts(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
    if(!e.shiftKey) return;
    switch(e.key){
      case 'E': e.preventDefault();document.getElementById('ear-modal').style.display='flex';break;
      case 'C': e.preventDefault();document.getElementById('chord-modal').style.display='flex';break;
      case 'A': e.preventDefault();document.getElementById('analytics-modal').style.display='flex';renderAnalytics();ls11Set('analyticsViewed',true);break;
      case 'P': e.preventDefault();document.getElementById('practice-room-modal').style.display='flex';break;
      case 'R': e.preventDefault();document.getElementById('random-modal').style.display='flex';break;
      case 'O': e.preventDefault();document.getElementById('compose-modal').style.display='flex';renderSavedCompositions();break;
      case 'H': e.preventDefault();document.getElementById('hand-modal').style.display='flex';break;
      case 'G': e.preventDefault();document.getElementById('composer-modal').style.display='flex';playSFX11('gallery_open');ls11Set('composerViewed',true);break;
    }
  });
}

// ================ INIT ================
function initV11(){
  addV11Songs();
  buildEarTrainingUI();
  buildChordUI();
  buildAnalyticsUI();
  buildPracticeRoomUI();
  buildRandomModeUI();
  buildCompositionUI();
  buildHandIndependenceUI();
  buildComposerGalleryUI();
  buildQuizV2UI();
  injectV11QuickActions();
  injectV11Achievements();
  setupV11Shortcuts();

  // Hook into piano key presses
  const origSelectSong = window.app && window.app.handleNoteInput;
  if(window.app){
    const origHandleNote = window.app.handleNoteInput.bind(window.app);
    window.app.handleNoteInput = function(noteName, velocity){
      hookPracticeInput(noteName);
      origHandleNote(noteName, velocity);
    };
  }

  // Periodic achievement check
  setInterval(()=>{
    checkV11Achievements();
  }, 15000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(initV11,1200));
} else {
  setTimeout(initV11, 1200);
}

})();
