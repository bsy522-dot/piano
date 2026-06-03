// Piano Master v10 Patch Module
// Sight Reading, Rhythm Training, Favorites, Weekly Challenge, Piano Quiz 15Q,
// Share Card, Warm-up Builder, Difficulty Guide, Recording, 10 Songs, 12 Achievements, SFX 6
(function(){
'use strict';
if(window.__v10Loaded) return;
window.__v10Loaded = true;

const LS10 = 'piano-v10-';
function ls10Get(k,d){try{return JSON.parse(localStorage.getItem(LS10+k))||d}catch{return d}}
function ls10Set(k,v){localStorage.setItem(LS10+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v10 ================
const sfx10 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX10(type){
  if(!sfx10) return;
  if(sfx10.state==='suspended') sfx10.resume();
  const t=sfx10.currentTime, g=sfx10.createGain(), o=sfx10.createOscillator();
  g.connect(sfx10.destination); o.connect(g);
  switch(type){
    case 'sight_correct':
      o.type='triangle';o.frequency.setValueAtTime(659,t);o.frequency.linearRampToValueAtTime(988,t+0.12);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'rhythm_hit':
      o.type='square';o.frequency.setValueAtTime(800,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      o.start(t);o.stop(t+0.06);break;
    case 'quiz_correct':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.start(t);o.stop(t+0.08);
      const o2=sfx10.createOscillator(),g2=sfx10.createGain();
      g2.connect(sfx10.destination);o2.connect(g2);o2.type='triangle';
      o2.frequency.setValueAtTime(784,t+0.1);
      g2.gain.setValueAtTime(0.1,t+0.1);g2.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o2.start(t+0.1);o2.stop(t+0.25);break;
    case 'quiz_wrong':
      o.type='sawtooth';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(100,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'share_capture':
      o.type='sine';o.frequency.setValueAtTime(1200,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      const o3=sfx10.createOscillator(),g3=sfx10.createGain();
      g3.connect(sfx10.destination);o3.connect(g3);o3.type='sine';
      o3.frequency.setValueAtTime(1600,t+0.08);
      g3.gain.setValueAtTime(0.1,t+0.08);g3.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o3.start(t+0.08);o3.stop(t+0.2);break;
    case 'warmup_done':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.3);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o.start(t);o.stop(t+0.4);break;
  }
}

// ================ 1. SIGHT READING (Staff Notation) ================
const NOTE_NAMES_SR = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5'];
const NOTE_FREQ_MAP = {C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,B4:493.88,C5:523.25,D5:587.33,E5:659.26,F5:698.46,G5:783.99,A5:880.00};
let srScore = 0, srTotal = 0, srCurrentNote = '', srActive = false;

function buildSightReadingUI(){
  const modal = document.createElement('div');
  modal.id = 'sight-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,420px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#119070; &#49884;&#48372;&#46300; &#47532;&#46377;</h2>
      <button onclick="document.getElementById('sight-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="sr-canvas" width="380" height="180" style="background:#1a1a2e;border-radius:8px;border:1px solid var(--border);max-width:100%"></canvas>
    <div style="margin:12px 0;font-size:13px;color:var(--text2)" id="sr-status">&#51020;&#54364;&#47484; &#51069;&#44256; &#44148;&#48152;&#51012; &#45580;&#47084;&#48372;&#49464;&#50836;</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin:8px 0" id="sr-keys"></div>
    <div style="margin-top:8px;font-size:12px">
      <span style="color:var(--green)" id="sr-score-display">&#51221;&#45813;: 0</span>
      <span style="color:var(--text2)"> / </span>
      <span style="color:var(--text2)" id="sr-total-display">&#52509;: 0</span>
    </div>
    <button id="sr-start" style="margin-top:12px;padding:8px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;font-weight:600;cursor:pointer">&#49884;&#51089;</button>
  </div>`;
  document.body.appendChild(modal);

  const keysDiv = modal.querySelector('#sr-keys');
  NOTE_NAMES_SR.forEach(n=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:6px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;min-width:36px';
    btn.textContent = n.replace(/\d/,'');
    btn.dataset.note = n;
    btn.addEventListener('click',()=>checkSRAnswer(n));
    keysDiv.appendChild(btn);
  });

  modal.querySelector('#sr-start').addEventListener('click',()=>{
    srScore=0;srTotal=0;srActive=true;
    modal.querySelector('#sr-score-display').textContent = '\u{C815}\u{B2F5}: 0';
    modal.querySelector('#sr-total-display').textContent = '\u{CD1D}: 0';
    nextSRNote();
  });
}

function nextSRNote(){
  srCurrentNote = NOTE_NAMES_SR[Math.floor(Math.random()*NOTE_NAMES_SR.length)];
  drawStaffNote(srCurrentNote);
  document.getElementById('sr-status').textContent = '\u{C774} \u{C74C}\u{D45C}\u{B294} \u{BB34}\u{C2A8} \u{C74C}?';
}

function drawStaffNote(noteName){
  const canvas = document.getElementById('sr-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  ctx.strokeStyle='#555';ctx.lineWidth=1;
  const staffTop = 40, gap = 20;
  for(let i=0;i<5;i++){
    const y = staffTop + i*gap;
    ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w-30,y);ctx.stroke();
  }

  ctx.fillStyle='var(--accent)';ctx.font='48px serif';
  ctx.fillText('\u{1D11E}', 40, staffTop + 4*gap - 8);

  const notePositions = {C4:5.5,D4:5,E4:4.5,F4:4,G4:3.5,A4:3,B4:2.5,C5:2,D5:1.5,E5:1,F5:0.5,G5:0,A5:-0.5};
  const pos = notePositions[noteName];
  const ny = staffTop + pos * gap;
  const nx = w/2;

  if(pos >= 5 || pos <= -0.5){
    ctx.strokeStyle='#555';ctx.lineWidth=1;
    const ledgerY = staffTop + Math.round(pos)*gap;
    ctx.beginPath();ctx.moveTo(nx-18,ledgerY);ctx.lineTo(nx+18,ledgerY);ctx.stroke();
  }

  ctx.fillStyle='#fff';
  ctx.beginPath();
  ctx.ellipse(nx,ny,10,7.5,-.2,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle='#fff';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(nx+9.5,ny);ctx.lineTo(nx+9.5,ny-45);ctx.stroke();
}

function checkSRAnswer(ans){
  if(!srActive) return;
  srTotal++;
  const correct = ans === srCurrentNote;
  const status = document.getElementById('sr-status');
  if(correct){
    srScore++;
    status.innerHTML = `<span style="color:var(--green)">\u{2714} \u{C815}\u{B2F5}! ${srCurrentNote}</span>`;
    playSFX10('sight_correct');
    if(sfx10){
      const f = NOTE_FREQ_MAP[srCurrentNote];
      if(f){
        const t=sfx10.currentTime,o=sfx10.createOscillator(),g=sfx10.createGain();
        g.connect(sfx10.destination);o.connect(g);o.type='sine';o.frequency.setValueAtTime(f,t);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);
        o.start(t);o.stop(t+0.5);
      }
    }
  } else {
    status.innerHTML = `<span style="color:var(--red)">\u{2718} \u{D2C0}\u{B838}\u{C5B4}\u{C694}! \u{C815}\u{B2F5}: ${srCurrentNote}</span>`;
  }
  document.getElementById('sr-score-display').textContent = `\u{C815}\u{B2F5}: ${srScore}`;
  document.getElementById('sr-total-display').textContent = `\u{CD1D}: ${srTotal}`;

  ls10Set('srTotal', (ls10Get('srTotal',0))+1);
  if(correct) ls10Set('srCorrect', (ls10Get('srCorrect',0))+1);
  if(srScore >= 20) ls10Set('sr20', true);

  setTimeout(nextSRNote, 1200);
}

// ================ 2. RHYTHM TRAINING ================
const RHYTHM_PATTERNS = [
  {name:'\u{AD00}\u{BD84}\u{C74C}\u{D45C} 4\u{AC1C}', beats:[1,2,3,4], bpm:80, level:1},
  {name:'\u{AD00}\u{BD84}\u{C74C}\u{D45C} \u{C12F}\u{C784}\u{D45C}', beats:[1,1.5,2,3,3.5,4], bpm:80, level:1},
  {name:'\u{C2F1}\u{CF54}\u{D398}\u{C774}\u{C158}', beats:[1,2.5,3,4], bpm:90, level:2},
  {name:'\u{C554}\u{BC15}\u{C790} \u{AC15}\u{C870}', beats:[0.5,1,2,3,4], bpm:85, level:2},
  {name:'\u{C178}\u{C785}\u{C790} \u{D328}\u{D134}', beats:[1,1.33,1.67,2,3,4], bpm:75, level:3},
  {name:'\u{B3C4}\u{D2F0}\u{B4DC} \u{B9AC}\u{B4EC}', beats:[1,1.5,2.5,3,3.5,4.5], bpm:85, level:3},
  {name:'\u{BC29}\u{BE60} \u{B9AC}\u{B4EC}', beats:[1,1.25,1.5,1.75,2,3,4], bpm:70, level:4},
  {name:'\u{D3F4}\u{B9AC}\u{B9AC}\u{B4EC}', beats:[1,1.25,1.75,2,2.5,3,3.25,3.75,4], bpm:70, level:4}
];
let rhythmIdx = 0, rhythmPlaying = false, rhythmHits = 0, rhythmMisses = 0;
let rhythmStartTime = 0, rhythmBeatTimes = [];

function buildRhythmUI(){
  const modal = document.createElement('div');
  modal.id = 'rhythm-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127928; \u{B9AC}\u{B4EC} \u{D2B8}\u{B808}\u{C774}\u{B2DD}</h2>
      <button onclick="document.getElementById('rhythm-modal').style.display='none';rhythmPlaying=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="rhythm-pattern-name" style="font-size:14px;font-weight:600;margin-bottom:8px">${RHYTHM_PATTERNS[0].name}</div>
    <div id="rhythm-visual" style="height:60px;background:var(--surface2);border-radius:8px;position:relative;margin-bottom:12px;overflow:hidden"></div>
    <div style="display:flex;gap:6px;justify-content:center;margin-bottom:12px">
      <button id="rhythm-prev" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">&#9664; \u{C774}\u{C804}</button>
      <span id="rhythm-level" style="font-size:11px;color:var(--text2);line-height:24px">Lv.${RHYTHM_PATTERNS[0].level}</span>
      <button id="rhythm-next" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">\u{B2E4}\u{C74C} &#9654;</button>
    </div>
    <div id="rhythm-feedback" style="font-size:12px;color:var(--text2);margin-bottom:8px">\u{D0ED}\u{D558}\u{C5EC} \u{B9AC}\u{B4EC}\u{C744} \u{B9DE}\u{CD94}\u{C138}\u{C694}</div>
    <button id="rhythm-pad" style="width:160px;height:80px;border-radius:12px;border:2px solid var(--accent);background:rgba(74,125,255,0.15);color:var(--accent);font-size:18px;font-weight:700;cursor:pointer;transition:0.1s">TAP</button>
    <div style="margin-top:12px">
      <button id="rhythm-start" style="padding:8px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;font-weight:600;cursor:pointer">\u{C2DC}\u{C791}</button>
    </div>
    <div style="margin-top:8px;font-size:11px">
      <span style="color:var(--green)" id="rhythm-hits">\u{C815}\u{D655}: 0</span> |
      <span style="color:var(--red)" id="rhythm-misses">\u{C2E4}\u{C218}: 0</span>
    </div>
  </div>`;
  document.body.appendChild(modal);

  modal.querySelector('#rhythm-prev').addEventListener('click',()=>{
    rhythmIdx = (rhythmIdx - 1 + RHYTHM_PATTERNS.length) % RHYTHM_PATTERNS.length;
    updateRhythmDisplay();
  });
  modal.querySelector('#rhythm-next').addEventListener('click',()=>{
    rhythmIdx = (rhythmIdx + 1) % RHYTHM_PATTERNS.length;
    updateRhythmDisplay();
  });
  modal.querySelector('#rhythm-start').addEventListener('click', startRhythm);

  const pad = modal.querySelector('#rhythm-pad');
  pad.addEventListener('pointerdown', (e)=>{
    e.preventDefault();
    if(!rhythmPlaying) return;
    pad.style.background='rgba(74,125,255,0.4)';
    setTimeout(()=>pad.style.background='rgba(74,125,255,0.15)',100);
    checkRhythmTap();
  });
}

function updateRhythmDisplay(){
  const p = RHYTHM_PATTERNS[rhythmIdx];
  const nameEl = document.getElementById('rhythm-pattern-name');
  const levelEl = document.getElementById('rhythm-level');
  const visual = document.getElementById('rhythm-visual');
  if(nameEl) nameEl.textContent = p.name;
  if(levelEl) levelEl.textContent = 'Lv.' + p.level;
  if(visual){
    visual.innerHTML = p.beats.map(b=>{
      const left = ((b-0.25)/5)*100;
      return `<div style="position:absolute;left:${left}%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:var(--accent);opacity:0.7"></div>`;
    }).join('') + `<div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--green)" id="rhythm-cursor"></div>`;
  }
}

function startRhythm(){
  const p = RHYTHM_PATTERNS[rhythmIdx];
  rhythmPlaying = true;
  rhythmHits = 0; rhythmMisses = 0;
  document.getElementById('rhythm-hits').textContent = '\u{C815}\u{D655}: 0';
  document.getElementById('rhythm-misses').textContent = '\u{C2E4}\u{C218}: 0';
  document.getElementById('rhythm-feedback').textContent = '\u{D0ED}\u{D558}\u{C5EC} \u{B9AC}\u{B4EC}\u{C744} \u{B9DE}\u{CD94}\u{C138}\u{C694}!';

  const beatDur = 60000 / p.bpm;
  rhythmBeatTimes = p.beats.map(b => b * beatDur);
  rhythmStartTime = performance.now() + 500;

  updateRhythmDisplay();

  p.beats.forEach(b=>{
    setTimeout(()=>{
      playSFX10('rhythm_hit');
    }, 500 + b * beatDur);
  });

  const totalDur = 500 + (Math.max(...p.beats)+1) * beatDur;
  setTimeout(()=>{
    rhythmPlaying = false;
    const total = p.beats.length;
    const pct = total > 0 ? Math.round((rhythmHits/total)*100) : 0;
    let grade = pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    document.getElementById('rhythm-feedback').innerHTML = `\u{ACB0}\u{ACFC}: <span style="color:var(--accent)">${grade}\u{B4F1}\u{AE09}</span> (${pct}%)`;
    ls10Set('rhythmPlayed', (ls10Get('rhythmPlayed',0))+1);
    if(grade==='S') ls10Set('rhythmS', true);
    checkV10Achievements();
  }, totalDur);
}

function checkRhythmTap(){
  const elapsed = performance.now() - rhythmStartTime;
  const tolerance = 200;
  let hit = false;
  for(let i=0;i<rhythmBeatTimes.length;i++){
    if(Math.abs(elapsed - rhythmBeatTimes[i]) < tolerance){
      hit = true;
      rhythmBeatTimes.splice(i,1);
      break;
    }
  }
  if(hit){
    rhythmHits++;
    document.getElementById('rhythm-hits').textContent = `\u{C815}\u{D655}: ${rhythmHits}`;
  } else {
    rhythmMisses++;
    document.getElementById('rhythm-misses').textContent = `\u{C2E4}\u{C218}: ${rhythmMisses}`;
  }
}

// ================ 3. FAVORITES SYSTEM ================
function buildFavoritesSystem(){
  const observer = new MutationObserver(()=>{
    document.querySelectorAll('.song-card').forEach(card=>{
      if(card.querySelector('.fav-btn-v10')) return;
      const songId = card.dataset?.songId || card.querySelector('.song-name')?.textContent;
      if(!songId) return;
      const favs = ls10Get('favorites',[]);
      const btn = document.createElement('button');
      btn.className = 'fav-btn-v10';
      btn.style.cssText = 'background:none;border:none;font-size:16px;cursor:pointer;flex-shrink:0;padding:4px';
      btn.textContent = favs.includes(songId) ? '\u{2764}\u{FE0F}' : '\u{1F90D}';
      btn.addEventListener('click',(e)=>{
        e.stopPropagation();
        const f = ls10Get('favorites',[]);
        const idx = f.indexOf(songId);
        if(idx>=0){f.splice(idx,1);btn.textContent='\u{1F90D}';}
        else{f.push(songId);btn.textContent='\u{2764}\u{FE0F}';}
        ls10Set('favorites',f);
        if(f.length>=5) ls10Set('fav5',true);
        checkV10Achievements();
      });
      card.appendChild(btn);
    });
  });
  const songList = document.getElementById('songList');
  if(songList) observer.observe(songList, {childList:true, subtree:true});
  setTimeout(()=>{
    document.querySelectorAll('.song-card').forEach(card=>{
      if(card.querySelector('.fav-btn-v10')) return;
      const nameEl = card.querySelector('.song-name');
      if(!nameEl) return;
      const songId = nameEl.textContent;
      const favs = ls10Get('favorites',[]);
      const btn = document.createElement('button');
      btn.className = 'fav-btn-v10';
      btn.style.cssText = 'background:none;border:none;font-size:16px;cursor:pointer;flex-shrink:0;padding:4px';
      btn.textContent = favs.includes(songId) ? '\u{2764}\u{FE0F}' : '\u{1F90D}';
      btn.addEventListener('click',(e)=>{
        e.stopPropagation();
        const f = ls10Get('favorites',[]);
        const idx = f.indexOf(songId);
        if(idx>=0){f.splice(idx,1);btn.textContent='\u{1F90D}';}
        else{f.push(songId);btn.textContent='\u{2764}\u{FE0F}';}
        ls10Set('favorites',f);
        if(f.length>=5) ls10Set('fav5',true);
        checkV10Achievements();
      });
      card.appendChild(btn);
    });
  }, 600);
}

// ================ 4. WEEKLY CHALLENGE ================
function getWeekSeed(){
  const now = new Date();
  return Math.floor(now.getTime() / (7*24*60*60*1000));
}

const WEEKLY_GOALS_POOL = [
  {id:'play5',desc:'5\u{ACE1} \u{C5F0}\u{C8FC}\u{D558}\u{AE30}',target:5,key:'weekPlays'},
  {id:'notes500',desc:'500\u{B178}\u{D2B8} \u{C5F0}\u{C8FC}',target:500,key:'weekNotes'},
  {id:'perfect1',desc:'\u{D37C}\u{D399}\u{D2B8} 1\u{ACE1}',target:1,key:'weekPerfect'},
  {id:'combo50',desc:'50\u{CF64}\u{BCF4} \u{B2EC}\u{C131}',target:50,key:'weekMaxCombo'},
  {id:'streak3',desc:'3\u{C77C} \u{C5F0}\u{C18D} \u{C5F0}\u{C2B5}',target:3,key:'weekStreak'},
  {id:'time30',desc:'30\u{BD84} \u{C5F0}\u{C2B5}',target:30,key:'weekMinutes'},
  {id:'score3k',desc:'\u{B204}\u{C801} 3000\u{C810}',target:3000,key:'weekScore'},
  {id:'songs3diff',desc:'3\u{B09C}\u{C774}\u{B3C4} \u{C5F0}\u{C8FC}',target:3,key:'weekDiffs'}
];

function getWeeklyChallenges(){
  const seed = getWeekSeed();
  const shuffled = [...WEEKLY_GOALS_POOL];
  let s = seed;
  for(let i=shuffled.length-1;i>0;i--){
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i+1);
    [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];
  }
  return shuffled.slice(0,4);
}

function buildWeeklyChallengeUI(){
  const modal = document.createElement('div');
  modal.id = 'weekly-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="font-size:16px;color:var(--accent)">&#128197; \u{C8FC}\u{AC04} \u{CC4C}\u{B9B0}\u{C9C0}</h2>
      <button onclick="document.getElementById('weekly-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="weekly-content"></div>
  </div>`;
  document.body.appendChild(modal);
  renderWeeklyContent();
}

function renderWeeklyContent(){
  const container = document.getElementById('weekly-content');
  if(!container) return;
  const challenges = getWeeklyChallenges();
  const curSeed = getWeekSeed();
  const progress = ls10Get('weekProgress_'+curSeed, {});

  container.innerHTML = challenges.map(c=>{
    const cur = progress[c.key] || 0;
    const pct = Math.min(100, Math.round((cur/c.target)*100));
    const done = cur >= c.target;
    return `<div style="background:${done?'rgba(34,197,94,0.1)':'var(--surface2)'};border:1px solid ${done?'var(--green)':'var(--border)'};border-radius:8px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;font-weight:600;color:${done?'var(--green)':'var(--text)'}">${done?'\u{2705}':'\u{1F3AF}'} ${c.desc}</span>
        <span style="font-size:10px;color:var(--text2)">${cur}/${c.target}</span>
      </div>
      <div style="height:4px;background:var(--border);border-radius:2px;margin-top:6px;overflow:hidden">
        <div style="height:100%;background:${done?'var(--green)':'var(--accent)'};width:${pct}%;border-radius:2px;transition:width 0.3s"></div>
      </div>
    </div>`;
  }).join('');

  const allDone = challenges.every(c=>(progress[c.key]||0)>=c.target);
  if(allDone) ls10Set('weeklyAllClear', true);
}

function recordWeeklyProgress(key, value){
  const curSeed = getWeekSeed();
  const progress = ls10Get('weekProgress_'+curSeed, {});
  progress[key] = (progress[key]||0) + value;
  ls10Set('weekProgress_'+curSeed, progress);
}

// ================ 5. PIANO QUIZ (15 Questions) ================
const PIANO_QUIZ = [
  {q:'\u{D53C}\u{C544}\u{B178}\u{C758} \u{AE30}\u{BCF8} \u{AC74}\u{BC18} \u{C218}\u{B294}?',a:['\u{D45C}\u{C900} 88\u{AC74}','\u{D45C}\u{C900} 76\u{AC74}','\u{D45C}\u{C900} 61\u{AC74}','\u{D45C}\u{C900} 108\u{AC74}'],c:0},
  {q:'\u{C74C}\u{C790}\u{B9AC}\u{D45C} \u{C704}\u{C758} \u{C120}\u{C740}?',a:['\u{AC04}\u{C120}','\u{BCF4}\u{D45C}\u{C120}','\u{B300}\u{D45C}\u{C120}','\u{BCC0}\u{C8FC}\u{C120}'],c:0},
  {q:'\u{B2E4}\u{C7A5}\u{C870}\u{C5D0}\u{C11C} C\u{B2E4}\u{C7A5}\u{C870}\u{C758} \u{C870}\u{D45C}\u{B294}?',a:['\u{C0FE}/\u{D50C}\u{B7AB} \u{C5C6}\u{C74C}','# 1\u{AC1C}','b 1\u{AC1C}','# 2\u{AC1C}'],c:0},
  {q:'Forte(f)\u{C758} \u{C758}\u{BBF8}\u{B294}?',a:['\u{AE30}\u{C744}\u{CC28}\u{AC8C}','\u{C5EC}\u{B9AC}\u{AC8C}','\u{BCC0}\u{AC00}\u{C751}\u{C528}','\u{C810}\u{C810} \u{B290}\u{B9AC}\u{AC8C}'],c:1},
  {q:'\u{D398}\u{B2EC} 3\u{AC1C} \u{C911} \u{C624}\u{B978}\u{CABD}\u{C740}?',a:['\u{B300}\u{D37C} \u{D398}\u{B2EC}','\u{C18C}\u{D504}\u{D2B8} \u{D398}\u{B2EC}','\u{C18C}\u{C2A4}\u{D14C}\u{B204}\u{D1A0}','\u{C720}\u{B2C8}\u{CF54}\u{B4DC} \u{D398}\u{B2EC}'],c:0},
  {q:'\u{BC18}\u{C74C} \u{C62C}\u{B9BC}\u{C744} \u{B098}\u{D0C0}\u{B0B4}\u{B294} \u{AE30}\u{D638}\u{B294}?',a:['# (\u{C0FE})','\u{266D} (\u{D50C}\u{B7AB})','\u{266E} (\u{B124}\u{CD94}\u{B7F4})','\u{266F} (\u{B354}\u{BE14}\u{C0FE})'],c:0},
  {q:'\u{C628}\u{C74C}\u{D45C}\u{B294} \u{BA87} \u{BC15}\u{C790}?',a:['4\u{BC15}\u{C790}','2\u{BC15}\u{C790}','1\u{BC15}\u{C790}','8\u{BC15}\u{C790}'],c:0},
  {q:'\u{D53C}\u{C544}\u{B178}\u{B97C} \u{BC1C}\u{BA85}\u{D55C} \u{C0AC}\u{B78C}\u{C740}?',a:['\u{BC14}\u{B974}\u{D1A8}\u{B85C}\u{BA54}\u{C624} \u{D06C}\u{B9AC}\u{C2A4}\u{D1A0}\u{D3EC}\u{B9AC}','\u{C694}\u{D55C} \u{C81C}\u{BC14}\u{C2A4}\u{D2F0}\u{C548} \u{BC14}\u{D750}','\u{BCA0}\u{D1A0}\u{BCA4}','\u{BAA8}\u{CC28}\u{B974}\u{D2B8}'],c:0},
  {q:'Allegro\u{C758} \u{BE60}\u{B974}\u{AE30}\u{B294}?',a:['\u{BE60}\u{B974}\u{AC8C} (120-156 BPM)','\u{B290}\u{B9AC}\u{AC8C} (60-80 BPM)','\u{D65C}\u{BC1C}\u{D558}\u{AC8C} (100-120 BPM)','\u{B9E4}\u{C6B0} \u{BE60}\u{B974}\u{AC8C} (160+ BPM)'],c:0},
  {q:'Staccato\u{B294} \u{C5B4}\u{B5BB}\u{AC8C} \u{C5F0}\u{C8FC}?',a:['\u{C9E7}\u{AC8C} \u{B04A}\u{C5B4}\u{C11C}','\u{AE38}\u{AC8C} \u{B298}\u{C5EC}\u{C11C}','\u{C810}\u{C810} \u{AE30}\u{C744}\u{CC28}\u{AC8C}','\u{C810}\u{C810} \u{B290}\u{B9AC}\u{AC8C}'],c:0},
  {q:'\u{C625}\u{D0C0}\u{BE0C}(Octave)\u{B294} \u{BA87} \u{BC18}\u{C74C} \u{CC28}\u{C774}?',a:['12\u{BC18}\u{C74C}','8\u{BC18}\u{C74C}','7\u{BC18}\u{C74C}','10\u{BC18}\u{C74C}'],c:0},
  {q:'\u{AC74}\u{BC18}\u{C5D0}\u{C11C} \u{B3C4}(C)\u{C640} \u{B808}(D) \u{C0AC}\u{C774}\u{B294}?',a:['\u{C628}\u{C74C} (\u{C7A5}2\u{B3C4})','\u{BC18}\u{C74C} (\u{B2E8}2\u{B3C4})','\u{C628}\u{C74C}\u{BC18} (\u{C99D}2\u{B3C4})','\u{C628}\u{C74C} (\u{C644}\u{C804}5\u{B3C4})'],c:0},
  {q:'\u{D53C}\u{C544}\u{B178}\u{C5D0}\u{C11C} pp\u{B294} \u{BB34}\u{C2A8} \u{B73B}?',a:['\u{B9E4}\u{C6B0} \u{C5EC}\u{B9AC}\u{AC8C} (pianissimo)','\u{B9E4}\u{C6B0} \u{AE30}\u{C744}\u{CC28}\u{AC8C}','\u{C810}\u{C810} \u{BE60}\u{B974}\u{AC8C}','\u{C5EC}\u{B9AC}\u{AC8C} (piano)'],c:0},
  {q:'\u{BE44}\u{BC1C}\u{B514} \u{AC1C}\u{C808}\u{C740} \u{BA87} \u{AC1C}?',a:['4\u{AC1C} (\u{BD04}/\u{C5EC}\u{B984}/\u{AC00}\u{C744}/\u{ACA8}\u{C6B8})','3\u{AC1C}','5\u{AC1C}','6\u{AC1C}'],c:0},
  {q:'\u{D654}\u{C74C}\u{C5D0}\u{C11C} C Major \u{CF54}\u{B4DC}\u{C758} \u{AD6C}\u{C131}\u{C74C}\u{C740}?',a:['C-E-G','C-D-G','C-F-A','C-E-A'],c:0}
];

let quizIdx = 0, quizScore = 0, quizAnswered = false;

function buildQuizUI(){
  const modal = document.createElement('div');
  modal.id = 'quiz-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:85vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128218; \u{D53C}\u{C544}\u{B178} \u{D000}\u{C988}</h2>
      <button onclick="document.getElementById('quiz-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px">
      <span id="quiz-progress">1/${PIANO_QUIZ.length}</span> |
      <span id="quiz-score-display" style="color:var(--green)">\u{C815}\u{B2F5}: 0</span>
    </div>
    <div id="quiz-question" style="font-size:14px;font-weight:600;margin-bottom:12px;min-height:40px"></div>
    <div id="quiz-options" style="display:flex;flex-direction:column;gap:6px"></div>
    <div id="quiz-result" style="margin-top:16px;text-align:center;display:none">
      <div style="font-size:36px;font-weight:900;margin:8px 0" id="quiz-grade"></div>
      <div style="font-size:12px;color:var(--text2)" id="quiz-result-text"></div>
      <button id="quiz-retry" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">\u{B2E4}\u{C2DC} \u{D480}\u{AE30}</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#quiz-retry').addEventListener('click',()=>{
    quizIdx=0;quizScore=0;
    document.getElementById('quiz-result').style.display='none';
    renderQuizQuestion();
  });
}

function startQuiz(){
  quizIdx=0;quizScore=0;
  document.getElementById('quiz-result').style.display='none';
  document.getElementById('quiz-modal').style.display='flex';
  renderQuizQuestion();
}

function renderQuizQuestion(){
  if(quizIdx >= PIANO_QUIZ.length){
    showQuizResult();
    return;
  }
  quizAnswered = false;
  const q = PIANO_QUIZ[quizIdx];
  document.getElementById('quiz-progress').textContent = `${quizIdx+1}/${PIANO_QUIZ.length}`;
  document.getElementById('quiz-question').textContent = q.q;
  const optDiv = document.getElementById('quiz-options');
  optDiv.innerHTML = q.a.map((a,i)=>`<button class="quiz-opt" data-idx="${i}" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s">${a}</button>`).join('');
  optDiv.querySelectorAll('.quiz-opt').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(quizAnswered) return;
      quizAnswered = true;
      const idx = +btn.dataset.idx;
      const correct = idx === q.c;
      if(correct){
        quizScore++;
        btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';
        playSFX10('quiz_correct');
      } else {
        btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
        optDiv.children[q.c].style.background='rgba(34,197,94,0.3)';
        optDiv.children[q.c].style.borderColor='var(--green)';
        playSFX10('quiz_wrong');
      }
      document.getElementById('quiz-score-display').textContent = `\u{C815}\u{B2F5}: ${quizScore}`;
      quizIdx++;
      setTimeout(renderQuizQuestion, 1200);
    });
  });
}

function showQuizResult(){
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-question').textContent = '';
  const result = document.getElementById('quiz-result');
  result.style.display = 'block';
  const pct = Math.round((quizScore/PIANO_QUIZ.length)*100);
  let grade = pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
  const gColors = {S:'var(--yellow)',A:'var(--green)',B:'var(--blue)',C:'var(--text2)',D:'var(--red)'};
  document.getElementById('quiz-grade').innerHTML = `<span style="color:${gColors[grade]}">${grade}</span>`;
  document.getElementById('quiz-result-text').textContent = `${quizScore}/${PIANO_QUIZ.length}\u{AC1C} \u{C815}\u{B2F5} (${pct}%)`;
  ls10Set('quizPlayed', (ls10Get('quizPlayed',0))+1);
  if(pct === 100) ls10Set('quizPerfect', true);
  checkV10Achievements();
}

// ================ 6. SHARE CARD (Canvas) ================
function buildShareUI(){
  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,420px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128247; \u{ACF5}\u{C720} \u{CE74}\u{B4DC}</h2>
      <button onclick="document.getElementById('share-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="share-canvas" width="600" height="380" style="max-width:100%;border-radius:8px"></canvas>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
      <button id="share-download" style="padding:8px 16px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">&#128190; \u{B2E4}\u{C6B4}\u{B85C}\u{B4DC}</button>
      <button id="share-copy" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer">&#128203; \u{D074}\u{B9BD}\u{BCF4}\u{B4DC}</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  modal.querySelector('#share-download').addEventListener('click',()=>{
    const c = document.getElementById('share-canvas');
    const a = document.createElement('a');
    a.download = 'piano-master-card.png';
    a.href = c.toDataURL('image/png');
    a.click();
  });

  modal.querySelector('#share-copy').addEventListener('click',async()=>{
    try{
      const c = document.getElementById('share-canvas');
      const blob = await new Promise(r=>c.toBlob(r,'image/png'));
      await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
      if(window.app?.showToast) window.app.showToast('\u{D074}\u{B9BD}\u{BCF4}\u{B4DC}\u{C5D0} \u{BCD5}\u{C0AC}\u{B428}!');
    }catch{
      if(window.app?.showToast) window.app.showToast('\u{BCD5}\u{C0AC} \u{C2E4}\u{D328} - \u{B2E4}\u{C6B4}\u{B85C}\u{B4DC}\u{B97C} \u{C774}\u{C6A9}\u{D558}\u{C138}\u{C694}');
    }
  });
}

function renderShareCard(){
  const c = document.getElementById('share-canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  const w=600,h=380;

  const grad = ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#0a0e1a');grad.addColorStop(0.5,'#141838');grad.addColorStop(1,'#1a0e2a');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);

  ctx.strokeStyle='rgba(74,125,255,0.3)';ctx.lineWidth=1;
  for(let i=0;i<w;i+=30){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=30){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}

  ctx.fillStyle='#fff';ctx.font='bold 28px system-ui,sans-serif';
  ctx.fillText('\u{1F3B9} Piano Master v10',30,50);
  ctx.font='12px system-ui';ctx.fillStyle='#8892a8';
  ctx.fillText(new Date().toLocaleDateString('ko-KR'),30,72);

  const s = window.app ? window.app.stats : {};
  const totalSongs = typeof SONGS !== 'undefined' ? SONGS.length : 72;
  const stats = [
    {label:'\u{CD1D} \u{C5F0}\u{C8FC}',value:`${s.totalPlays||0}\u{D68C}`,color:'#4a7dff'},
    {label:'\u{C644}\u{C8FC}\u{ACE1}',value:`${(s.songsCompleted?.size||0)}/${totalSongs}`,color:'#22c55e'},
    {label:'\u{CD1D} \u{B178}\u{D2B8}',value:`${(s.totalNotes||0).toLocaleString()}`,color:'#a855f7'},
    {label:'\u{CD5C}\u{B300}\u{CF64}\u{BCF4}',value:`${s.maxCombo||0}x`,color:'#ef4444'},
    {label:'\u{C5F0}\u{C2B5}\u{C2A4}\u{D2B8}\u{B9AD}',value:`${s.streak||0}\u{C77C}`,color:'#eab308'},
    {label:'\u{C5F0}\u{C2B5}\u{C2DC}\u{AC04}',value:`${Math.round((s.totalPlayTime||0)/60)}\u{BD84}`,color:'#06b6d4'}
  ];

  stats.forEach((st,i)=>{
    const col = i%3, row = Math.floor(i/3);
    const x = 30 + col*190, y = 100 + row*120;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.beginPath();ctx.roundRect(x,y,170,100,8);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
    ctx.fillStyle=st.color;ctx.font='bold 32px system-ui';
    ctx.fillText(st.value,x+15,y+45);
    ctx.fillStyle='#8892a8';ctx.font='11px system-ui';
    ctx.fillText(st.label,x+15,y+70);
  });

  ctx.fillStyle='rgba(74,125,255,0.15)';
  ctx.beginPath();ctx.roundRect(30,340,w-60,30,6);ctx.fill();
  ctx.fillStyle='#4a7dff';ctx.font='bold 11px system-ui';
  ctx.fillText('72 Songs \u{00B7} 60 Achievements \u{00B7} MIDI \u{00B7} Synthesia \u{00B7} Quiz \u{00B7} Sight Reading',40,360);

  playSFX10('share_capture');
  ls10Set('shareUsed', true);
  checkV10Achievements();
}

// ================ 7. WARM-UP BUILDER ================
const WARMUP_EXERCISES = [
  {name:'\u{C190}\u{AC00}\u{B77D} \u{C2A4}\u{D2B8}\u{B808}\u{CE6D}',dur:30,desc:'\u{AC01} \u{C190}\u{AC00}\u{B77D}\u{C744} 5\u{CD08}\u{C529} \u{D3B4}\u{C8FC}\u{AE30}'},
  {name:'C \u{C7A5}\u{C870} \u{C2A4}\u{CF00}\u{C77C}',dur:45,desc:'C-D-E-F-G-A-B-C \u{C0C1}\u{D589}/\u{D558}\u{D589} \u{B290}\u{B9AC}\u{AC8C}'},
  {name:'\u{D55C}\u{C190} 5\u{C74C} \u{C5F0}\u{C2B5}',dur:40,desc:'C-D-E-F-G \u{C21C}\u{C11C}\u{B300}\u{B85C}, \u{C591}\u{C190} \u{BC88}\u{AC08}\u{C544}'},
  {name:'\u{C544}\u{B974}\u{D398}\u{C9C0}\u{C624}',dur:50,desc:'C-E-G \u{BD84}\u{C0B0}\u{D654}\u{C74C} \u{CC9C}\u{CC9C}\u{D788}'},
  {name:'\u{C625}\u{D0C0}\u{BE0C} \u{C810}\u{D504}',dur:35,desc:'\u{C591}\u{C190} \u{C625}\u{D0C0}\u{BE0C} \u{B3D9}\u{C2DC} \u{B204}\u{B974}\u{AE30}'},
  {name:'\u{C2A4}\u{D0C0}\u{CE74}\u{D1A0} \u{C5F0}\u{C2B5}',dur:30,desc:'\u{AC19}\u{C740} \u{C74C}\u{C744} \u{C9E7}\u{AC8C} \u{B04A}\u{C5B4}\u{C11C} \u{C5F0}\u{C8FC}'},
  {name:'\u{AC74}\u{BC18} \u{B204}\u{B974}\u{AE30} \u{D798} \u{C870}\u{C808}',dur:40,desc:'\u{C57C}\u{D558}\u{AC8C}(p) \u{2192} \u{AE30}\u{C744}\u{CC28}\u{AC8C}(f) \u{BC18}\u{BCF5}'},
  {name:'\u{D06C}\u{B85C}\u{B9E4}\u{D2F1} \u{C2A4}\u{CF00}\u{C77C}',dur:60,desc:'\u{BC18}\u{C74C}\u{C529} \u{C62C}\u{B77C}\u{AC00}\u{BA70} \u{C804} \u{AC74}\u{BC18} \u{C21C}\u{D68C}'}
];
let warmupActive = [], warmupTimer = null, warmupCurIdx = -1;

function buildWarmupUI(){
  const modal = document.createElement('div');
  modal.id = 'warmup-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:85vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127947; \u{C6CC}\u{BC0D}\u{C5C5} \u{B8E8}\u{D2F4}</h2>
      <button onclick="document.getElementById('warmup-modal').style.display='none';if(warmupTimer)clearInterval(warmupTimer)" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="warmup-list"></div>
    <div style="text-align:center;margin-top:12px">
      <button id="warmup-start" style="padding:8px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;font-weight:600;cursor:pointer">\u{C2DC}\u{C791}</button>
    </div>
    <div id="warmup-status" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text2)"></div>
  </div>`;
  document.body.appendChild(modal);

  renderWarmupList();
  modal.querySelector('#warmup-start').addEventListener('click', runWarmup);
}

function renderWarmupList(){
  const list = document.getElementById('warmup-list');
  if(!list) return;
  warmupActive = ls10Get('warmupActive', [0,1,2,3,4]);
  list.innerHTML = WARMUP_EXERCISES.map((ex,i)=>{
    const on = warmupActive.includes(i);
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;margin-bottom:4px">
      <button class="warmup-toggle" data-idx="${i}" style="width:20px;height:20px;border-radius:4px;border:1px solid ${on?'var(--accent)':'var(--border)'};background:${on?'var(--accent)':'transparent'};color:white;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center">${on?'\u{2713}':''}</button>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">${ex.name} <span style="font-size:9px;color:var(--text2)">${ex.dur}\u{CD08}</span></div>
        <div style="font-size:10px;color:var(--text2)">${ex.desc}</div>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.warmup-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx = +btn.dataset.idx;
      const pos = warmupActive.indexOf(idx);
      if(pos>=0) warmupActive.splice(pos,1); else warmupActive.push(idx);
      ls10Set('warmupActive', warmupActive);
      renderWarmupList();
    });
  });
}

function runWarmup(){
  const active = warmupActive.sort((a,b)=>a-b);
  if(active.length===0) return;
  warmupCurIdx = 0;
  runNextExercise(active);
}

function runNextExercise(active){
  if(warmupCurIdx >= active.length){
    document.getElementById('warmup-status').innerHTML = '<span style="color:var(--green)">\u{2705} \u{C6CC}\u{BC0D}\u{C5C5} \u{C644}\u{B8CC}!</span>';
    playSFX10('warmup_done');
    ls10Set('warmupDone', (ls10Get('warmupDone',0))+1);
    checkV10Achievements();
    return;
  }
  const ex = WARMUP_EXERCISES[active[warmupCurIdx]];
  let remaining = ex.dur;
  const status = document.getElementById('warmup-status');
  status.innerHTML = `<span style="color:var(--accent)">\u{25B6} ${ex.name}</span> - <span id="warmup-countdown">${remaining}</span>\u{CD08}`;

  warmupTimer = setInterval(()=>{
    remaining--;
    const cd = document.getElementById('warmup-countdown');
    if(cd) cd.textContent = remaining;
    if(remaining <= 0){
      clearInterval(warmupTimer);
      warmupCurIdx++;
      runNextExercise(active);
    }
  },1000);
}

// ================ 8. DIFFICULTY GUIDE ================
function buildDiffGuideUI(){
  const modal = document.createElement('div');
  modal.id = 'diffguide-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:85vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128218; \u{B09C}\u{C774}\u{B3C4} \u{AC00}\u{C774}\u{B4DC}</h2>
      <button onclick="document.getElementById('diffguide-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="diffguide-content"></div>
  </div>`;
  document.body.appendChild(modal);
}

function renderDiffGuide(){
  const container = document.getElementById('diffguide-content');
  if(!container || typeof SONGS === 'undefined') return;

  const levels = [
    {key:'easy',label:'\u{C785}\u{BB38} (Easy)',color:'var(--green)',tip:'\u{D55C}\u{C190} \u{BA5C}\u{B85C}\u{B514}, \u{B290}\u{B9B0} \u{D15C}\u{D3EC}\u{B85C} \u{C2DC}\u{C791}\u{D558}\u{C138}\u{C694}.'},
    {key:'medium',label:'\u{C911}\u{AE09} (Medium)',color:'var(--yellow)',tip:'\u{C591}\u{C190} \u{C5F0}\u{C8FC}\u{C640} \u{C0FE}/\u{D50C}\u{B7AB}\u{C774} \u{B4F1}\u{C7A5}\u{D569}\u{B2C8}\u{B2E4}.'},
    {key:'hard',label:'\u{C0C1}\u{AE09} (Hard)',color:'var(--red)',tip:'\u{BCC0}\u{D654}\u{AC00} \u{B9CE}\u{C740} \u{ACE1}. 0.8x \u{C18D}\u{B3C4}\u{B85C} \u{C2DC}\u{C791} \u{CD94}\u{CC9C}.'},
    {key:'expert',label:'\u{B2EC}\u{C778} (Expert)',color:'var(--purple)',tip:'\u{CD5C}\u{ACE0} \u{B09C}\u{C774}\u{B3C4}. \u{AD6C}\u{AC04}\u{BC18}\u{BCF5}(A-B)\u{C73C}\u{B85C} \u{C5F0}\u{C2B5}\u{D558}\u{C138}\u{C694}.'}
  ];

  container.innerHTML = levels.map(lv=>{
    const songs = SONGS.filter(s=>s.difficulty===lv.key);
    const completed = songs.filter(s=>{
      const stats = window.app?.stats;
      return stats?.songsCompleted?.has(s.id);
    }).length;
    return `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:700;color:${lv.color}">${lv.label}</span>
        <span style="font-size:10px;color:var(--text2)">${completed}/${songs.length}\u{ACE1}</span>
      </div>
      <div style="height:4px;background:var(--border);border-radius:2px;margin:6px 0;overflow:hidden">
        <div style="height:100%;background:${lv.color};width:${songs.length?Math.round(completed/songs.length*100):0}%;border-radius:2px"></div>
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px">\u{D301}: ${lv.tip}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${songs.slice(0,8).map(s=>`<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.05);color:var(--text2)">${s.icon||'\u{1F3B5}'} ${s.name}</span>`).join('')}
        ${songs.length>8?`<span style="font-size:9px;color:var(--text2)">+${songs.length-8}\u{ACE1}</span>`:''}
      </div>
    </div>`;
  }).join('');

  container.innerHTML += `<div style="background:linear-gradient(135deg,rgba(74,125,255,0.1),rgba(168,85,247,0.1));border:1px solid var(--accent);border-radius:8px;padding:12px;margin-top:8px">
    <div style="font-size:12px;font-weight:700;color:var(--accent)">\u{1F4A1} \u{CD94}\u{CC9C} \u{D559}\u{C2B5} \u{ACBD}\u{B85C}</div>
    <div style="font-size:10px;color:var(--text2);margin-top:6px;line-height:1.6">
      1. Easy \u{B3D9}\u{C694} \u{C644}\u{C8FC} \u{2192} \u{AC74}\u{BC18} \u{C704}\u{CE58} \u{C775}\u{D788}\u{AE30}<br>
      2. Medium \u{D074}\u{B798}\u{C2DD} \u{B3C4}\u{C804} \u{2192} \u{C591}\u{C190} \u{D611}\u{C5C5} \u{C2DC}\u{C791}<br>
      3. Hard \u{BA85}\u{ACE1} 0.8x\u{C18D}\u{B3C4} \u{2192} \u{C810}\u{CC28} \u{C62C}\u{B824}\u{C11C} 1.0x<br>
      4. Expert \u{AD6C}\u{AC04}\u{BC18}\u{BCF5} \u{2192} \u{D55C} \u{AD6C}\u{AC04}\u{C529} \u{C644}\u{C131} \u{D6C4} \u{B2E4}\u{C74C}
    </div>
  </div>`;
}

// ================ 9. NEW SONGS (10 songs, 62→72) ================
function addV10Songs(){
  if(typeof SONGS === 'undefined') return;

  const newSongs = [
    {
      id:'smetana_moldau', name:'\u{BAA8}\u{B974}\u{B2E4}\u{C6B0} (\u{C2A4}\u{BA54}\u{D0C0}\u{B098})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F30A}', bpm:92,
      notes:[
        {note:'E4',time:0,dur:0.6},{note:'F#4',time:0.7,dur:0.3},{note:'G4',time:1.1,dur:0.6},
        {note:'A4',time:1.8,dur:0.3},{note:'B4',time:2.2,dur:0.8},{note:'A4',time:3.2,dur:0.3},
        {note:'G4',time:3.6,dur:0.6},{note:'F#4',time:4.4,dur:0.3},{note:'E4',time:4.8,dur:0.8},
        {note:'D4',time:5.8,dur:0.3},{note:'E4',time:6.2,dur:0.6},{note:'F#4',time:7.0,dur:0.3},
        {note:'G4',time:7.4,dur:0.8},{note:'A4',time:8.4,dur:0.6},{note:'B4',time:9.2,dur:0.8},
        {note:'C5',time:10.2,dur:0.6},{note:'B4',time:11.0,dur:0.3},{note:'A4',time:11.4,dur:0.8}
      ]
    },
    {
      id:'vivaldi_winter', name:'\u{C0AC}\u{ACC4}\u{B2EC}\u{ACBC}\u{C6B8} (\u{BE44}\u{BC1C}\u{B514})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'hard',
      icon:'\u{2744}\u{FE0F}', bpm:140,
      notes:[
        {note:'E5',time:0,dur:0.15},{note:'E5',time:0.18,dur:0.15},{note:'E5',time:0.36,dur:0.15},
        {note:'F5',time:0.54,dur:0.15},{note:'E5',time:0.72,dur:0.15},{note:'D5',time:0.9,dur:0.15},
        {note:'C5',time:1.08,dur:0.15},{note:'D5',time:1.26,dur:0.15},{note:'E5',time:1.44,dur:0.3},
        {note:'E5',time:1.8,dur:0.15},{note:'E5',time:1.98,dur:0.15},{note:'E5',time:2.16,dur:0.15},
        {note:'F5',time:2.34,dur:0.15},{note:'E5',time:2.52,dur:0.15},{note:'D5',time:2.7,dur:0.15},
        {note:'C5',time:2.88,dur:0.3},{note:'B4',time:3.24,dur:0.3},{note:'C5',time:3.6,dur:0.3},
        {note:'D5',time:3.96,dur:0.3},{note:'E5',time:4.32,dur:0.6},{note:'D5',time:5.0,dur:0.3},
        {note:'C5',time:5.4,dur:0.3},{note:'B4',time:5.8,dur:0.6}
      ]
    },
    {
      id:'bach_air', name:'G\u{C120}\u{C0C1}\u{C758} \u{C544}\u{B9AC}\u{C544} (\u{BC14}\u{D750})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F3BB}', bpm:66,
      notes:[
        {note:'D5',time:0,dur:1.2},{note:'C#5',time:1.4,dur:0.4},{note:'D5',time:2.0,dur:0.4},
        {note:'A4',time:2.6,dur:0.8},{note:'F#4',time:3.6,dur:0.4},{note:'A4',time:4.2,dur:0.8},
        {note:'D4',time:5.2,dur:0.8},{note:'E4',time:6.2,dur:0.4},{note:'F#4',time:6.8,dur:0.4},
        {note:'G4',time:7.4,dur:0.4},{note:'A4',time:8.0,dur:0.4},{note:'B4',time:8.6,dur:0.8},
        {note:'A4',time:9.6,dur:0.4},{note:'G4',time:10.2,dur:0.4},{note:'F#4',time:10.8,dur:0.8},
        {note:'E4',time:11.8,dur:0.4},{note:'D4',time:12.4,dur:1.2}
      ]
    },
    {
      id:'dvorak_newworld', name:'\u{C2E0}\u{C138}\u{ACC4} (\u{B4DC}\u{BCF4}\u{B974}\u{C790}\u{D06C})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F30D}', bpm:80,
      notes:[
        {note:'E4',time:0,dur:0.8},{note:'G4',time:1.0,dur:0.4},{note:'G4',time:1.6,dur:1.0},
        {note:'E4',time:2.8,dur:0.4},{note:'D4',time:3.4,dur:0.8},{note:'E4',time:4.4,dur:0.4},
        {note:'G4',time:5.0,dur:0.4},{note:'A4',time:5.6,dur:0.8},{note:'G4',time:6.6,dur:1.2},
        {note:'E4',time:8.0,dur:0.8},{note:'G4',time:9.0,dur:0.4},{note:'G4',time:9.6,dur:1.0},
        {note:'D5',time:10.8,dur:0.4},{note:'B4',time:11.4,dur:0.8},{note:'A4',time:12.4,dur:0.4},
        {note:'G4',time:13.0,dur:1.2}
      ]
    },
    {
      id:'chopin_etude', name:'\u{C5D0}\u{D280}\u{B4DC} Op.10-3 (\u{C1FC}\u{D321})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'expert',
      icon:'\u{1F3B6}', bpm:100,
      notes:[
        {note:'E5',time:0,dur:0.8},{note:'D#5',time:1.0,dur:0.4},{note:'E5',time:1.6,dur:0.8},
        {note:'F#5',time:2.6,dur:0.4},{note:'G#5',time:3.2,dur:0.6},{note:'A5',time:4.0,dur:0.8},
        {note:'G#5',time:5.0,dur:0.4},{note:'F#5',time:5.6,dur:0.4},{note:'E5',time:6.2,dur:0.8},
        {note:'D#5',time:7.2,dur:0.4},{note:'E5',time:7.8,dur:0.4},{note:'F#5',time:8.4,dur:0.4},
        {note:'B4',time:9.0,dur:0.8},{note:'C#5',time:10.0,dur:0.4},{note:'D#5',time:10.6,dur:0.4},
        {note:'E5',time:11.2,dur:1.2},{note:'D#5',time:12.6,dur:0.4},{note:'C#5',time:13.2,dur:0.4},
        {note:'B4',time:13.8,dur:1.0}
      ]
    },
    {
      id:'doll_song', name:'\u{C778}\u{D615}\u{C758} \u{B178}\u{B798} (\u{CC28}\u{C774}\u{CF54}\u{D504}\u{C2A4}\u{D0A4})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'hard',
      icon:'\u{1FA86}', bpm:144,
      notes:[
        {note:'E5',time:0,dur:0.2},{note:'F5',time:0.25,dur:0.2},{note:'E5',time:0.5,dur:0.2},
        {note:'F5',time:0.75,dur:0.2},{note:'E5',time:1.0,dur:0.3},{note:'C5',time:1.4,dur:0.3},
        {note:'A4',time:1.8,dur:0.3},{note:'C5',time:2.2,dur:0.3},{note:'E5',time:2.6,dur:0.5},
        {note:'D5',time:3.2,dur:0.2},{note:'C5',time:3.5,dur:0.2},{note:'D5',time:3.8,dur:0.2},
        {note:'E5',time:4.1,dur:0.2},{note:'F5',time:4.4,dur:0.3},{note:'E5',time:4.8,dur:0.3},
        {note:'D5',time:5.2,dur:0.3},{note:'C5',time:5.6,dur:0.3},{note:'B4',time:6.0,dur:0.5},
        {note:'C5',time:6.6,dur:0.3},{note:'D5',time:7.0,dur:0.3},{note:'E5',time:7.4,dur:0.8}
      ]
    },
    {
      id:'debussy_reverie', name:'\u{AFBF} (\u{B4DC}\u{BE54}\u{C2DC})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'hard',
      icon:'\u{1F4AD}', bpm:72,
      notes:[
        {note:'F4',time:0,dur:0.8},{note:'A4',time:1.0,dur:0.4},{note:'C5',time:1.6,dur:0.8},
        {note:'D5',time:2.6,dur:0.4},{note:'C5',time:3.2,dur:0.8},{note:'A4',time:4.2,dur:0.4},
        {note:'Bb4',time:4.8,dur:0.8},{note:'A4',time:5.8,dur:0.4},{note:'G4',time:6.4,dur:0.8},
        {note:'F4',time:7.4,dur:0.4},{note:'A4',time:8.0,dur:0.8},{note:'C5',time:9.0,dur:0.4},
        {note:'Bb4',time:9.6,dur:0.4},{note:'A4',time:10.2,dur:0.4},{note:'G4',time:10.8,dur:0.4},
        {note:'F4',time:11.4,dur:1.2}
      ]
    },
    {
      id:'elgar_salut', name:'\u{C0AC}\u{B791}\u{C758} \u{C778}\u{C0AC} (\u{C5D8}\u{AC00})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F491}', bpm:108,
      notes:[
        {note:'E4',time:0,dur:0.6},{note:'E4',time:0.7,dur:0.3},{note:'F4',time:1.1,dur:0.6},
        {note:'G4',time:1.8,dur:0.3},{note:'A4',time:2.2,dur:0.8},{note:'C5',time:3.2,dur:0.6},
        {note:'B4',time:4.0,dur:0.3},{note:'A4',time:4.4,dur:0.6},{note:'G4',time:5.2,dur:0.3},
        {note:'F4',time:5.6,dur:0.8},{note:'E4',time:6.6,dur:0.6},{note:'D4',time:7.4,dur:0.3},
        {note:'E4',time:7.8,dur:0.8},{note:'F4',time:8.8,dur:0.3},{note:'G4',time:9.2,dur:0.6},
        {note:'A4',time:10.0,dur:0.3},{note:'G4',time:10.4,dur:0.8},{note:'E4',time:11.4,dur:1.0}
      ]
    },
    {
      id:'schubert_serenade', name:'\u{C138}\u{B808}\u{B098}\u{B370} (\u{C288}\u{BCA0}\u{B974}\u{D2B8})', category:'\u{D074}\u{B798}\u{C2DD}', difficulty:'medium',
      icon:'\u{1F319}', bpm:76,
      notes:[
        {note:'D4',time:0,dur:0.8},{note:'D4',time:1.0,dur:0.4},{note:'F4',time:1.6,dur:0.8},
        {note:'A4',time:2.6,dur:0.4},{note:'A4',time:3.2,dur:0.8},{note:'G4',time:4.2,dur:0.4},
        {note:'F4',time:4.8,dur:0.6},{note:'E4',time:5.6,dur:0.4},{note:'D4',time:6.2,dur:0.8},
        {note:'F4',time:7.2,dur:0.4},{note:'A4',time:7.8,dur:0.4},{note:'D5',time:8.4,dur:0.8},
        {note:'C5',time:9.4,dur:0.4},{note:'Bb4',time:10.0,dur:0.6},{note:'A4',time:10.8,dur:0.4},
        {note:'G4',time:11.4,dur:0.4},{note:'F4',time:12.0,dur:0.8},{note:'D4',time:13.0,dur:1.0}
      ]
    },
    {
      id:'arirang_jazz', name:'\u{C544}\u{B9AC}\u{B791} \u{C7AC}\u{C988}\u{D3B8}\u{ACE1}', category:'\u{D55C}\u{AD6D}\u{BA3C}\u{C694}', difficulty:'medium',
      icon:'\u{1F3B7}', bpm:96,
      notes:[
        {note:'A4',time:0,dur:0.6},{note:'C5',time:0.8,dur:0.3},{note:'D5',time:1.2,dur:0.6},
        {note:'E5',time:2.0,dur:0.8},{note:'D5',time:3.0,dur:0.3},{note:'C5',time:3.4,dur:0.6},
        {note:'A4',time:4.2,dur:0.8},{note:'G4',time:5.2,dur:0.3},{note:'A4',time:5.6,dur:0.6},
        {note:'C5',time:6.4,dur:0.3},{note:'D5',time:6.8,dur:0.8},{note:'C5',time:7.8,dur:0.3},
        {note:'A4',time:8.2,dur:0.6},{note:'G4',time:9.0,dur:0.3},{note:'E4',time:9.4,dur:0.8},
        {note:'D4',time:10.4,dur:0.3},{note:'E4',time:10.8,dur:0.6},{note:'A4',time:11.6,dur:1.0}
      ]
    }
  ];

  newSongs.forEach(song=>{
    if(!SONGS.find(s=>s.id===song.id)){
      SONGS.push(song);
    }
  });
}

// ================ 10. V10 ACHIEVEMENTS (12 new, 48→60) ================
const V10_ACHIEVEMENTS = [
  {id:'songs_72',name:'\u{C804}\u{ACE1} \u{B9C8}\u{C2A4}\u{D130}',icon:'\u{1F3B9}',desc:'72\u{ACE1} \u{C804}\u{BD80} \u{C644}\u{C8FC}',
    check:()=>{const s=window.app?window.app.stats:{songsCompleted:new Set()};return (typeof SONGS!=='undefined')&&SONGS.length>=72&&SONGS.every(x=>s.songsCompleted.has(x.id))}},
  {id:'sight_20',name:'\u{C545}\u{BCF4} \u{C77D}\u{AE30} \u{B2EC}\u{C778}',icon:'\u{1D11E}',desc:'\u{C2DC}\u{BCF4}\u{B4DC} 20\u{C815}\u{B2F5}',
    check:()=>ls10Get('sr20',false)},
  {id:'rhythm_master',name:'\u{B9AC}\u{B4EC} \u{B9C8}\u{C2A4}\u{D130}',icon:'\u{1F941}',desc:'\u{B9AC}\u{B4EC} S\u{B4F1}\u{AE09}',
    check:()=>ls10Get('rhythmS',false)},
  {id:'fav5',name:'\u{C990}\u{ACA8}\u{CC3E}\u{AE30} \u{C218}\u{C9D1}\u{AC00}',icon:'\u{2764}\u{FE0F}',desc:'5\u{ACE1} \u{C990}\u{ACA8}\u{CC3E}\u{AE30}',
    check:()=>ls10Get('fav5',false)},
  {id:'weekly_clear',name:'\u{C8FC}\u{AC04} \u{CC4C}\u{B9B0}\u{C9C0} \u{C644}\u{B8CC}',icon:'\u{1F3C6}',desc:'\u{C8FC}\u{AC04} 4\u{BAA9}\u{D45C} \u{C804}\u{BD80} \u{B2EC}\u{C131}',
    check:()=>ls10Get('weeklyAllClear',false)},
  {id:'quiz_perfect',name:'\u{D53C}\u{C544}\u{B178} \u{BC15}\u{C0AC}',icon:'\u{1F393}',desc:'\u{D000}\u{C988} \u{B9CC}\u{C810}',
    check:()=>ls10Get('quizPerfect',false)},
  {id:'share_first',name:'\u{CCA8} \u{ACF5}\u{C720}',icon:'\u{1F4F8}',desc:'\u{ACF5}\u{C720}\u{CE74}\u{B4DC} \u{C0DD}\u{C131}',
    check:()=>ls10Get('shareUsed',false)},
  {id:'warmup_5',name:'\u{C6CC}\u{BC0D}\u{C5C5} \u{C804}\u{BB38}\u{AC00}',icon:'\u{1F3CB}\u{FE0F}',desc:'\u{C6CC}\u{BC0D}\u{C5C5} 5\u{D68C} \u{C644}\u{B8CC}',
    check:()=>(ls10Get('warmupDone',0))>=5},
  {id:'perfect_700',name:'700 \u{D37C}\u{D399}\u{D2B8}',icon:'\u{1F48E}',desc:'\u{D37C}\u{D399}\u{D2B8} 700\u{D68C}',
    check:()=>{const s=window.app?window.app.stats:{};return (s.perfectHits||0)>=700}},
  {id:'notes_20000',name:'2\u{B9CC} \u{B178}\u{D2B8}',icon:'\u{1F3B5}',desc:'20,000\u{B178}\u{D2B8} \u{C5F0}\u{C8FC}',
    check:()=>{const s=window.app?window.app.stats:{};return (s.totalNotes||0)>=20000}},
  {id:'streak_30',name:'30\u{C77C} \u{C5F0}\u{C18D}',icon:'\u{1F525}',desc:'30\u{C77C} \u{C5F0}\u{C18D} \u{C5F0}\u{C2B5}',
    check:()=>{const s=window.app?window.app.stats:{};return (s.streak||0)>=30}},
  {id:'score_100k',name:'10\u{B9CC}\u{C810} \u{B3CC}\u{D30C}',icon:'\u{1F451}',desc:'\u{B204}\u{C801} 100,000\u{C810}',
    check:()=>{const s=window.app?window.app.stats:{};return (s.totalScore||0)>=100000}}
];

function checkV10Achievements(){
  const unlocked = ls10Get('v10Unlocked',[]);
  let newOnes = [];
  V10_ACHIEVEMENTS.forEach(a=>{
    if(!unlocked.includes(a.id) && a.check()){
      unlocked.push(a.id);
      newOnes.push(a);
    }
  });
  if(newOnes.length > 0){
    ls10Set('v10Unlocked', unlocked);
    newOnes.forEach(a=>{
      if(window.app?.showToast){
        window.app.showToast(`\u{1F3C6} \u{C5C5}\u{C801} \u{D574}\u{AE08}: ${a.icon} ${a.name}`, 'achievement');
      }
    });
  }
}

function injectV10Achievements(){
  const grid = document.querySelector('.achievement-grid');
  if(!grid) return;
  const unlocked = ls10Get('v10Unlocked',[]);
  V10_ACHIEVEMENTS.forEach(a=>{
    if(grid.querySelector(`[data-ach="${a.id}"]`)) return;
    const el = document.createElement('div');
    el.className = 'achievement' + (unlocked.includes(a.id) ? ' unlocked' : '');
    el.dataset.ach = a.id;
    el.innerHTML = `<div class="achievement-icon">${a.icon}</div>${a.name}<br><span style="font-size:8px">${a.desc}</span>`;
    grid.appendChild(el);
  });
}

// ================ 11. QUICK ACTION BUTTONS v10 ================
function injectV10QuickActions(){
  const container = document.querySelector('.practice-page') || document.querySelector('.settings-page');
  if(!container || document.getElementById('v10-quick-actions')) return;

  const wrap = document.createElement('div');
  wrap.id = 'v10-quick-actions';
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:8px;margin-bottom:8px';
  const buttons = [
    {label:'\u{1D11E} \u{C2DC}\u{BCF4}\u{B4DC}\u{B9AC}\u{B529}',action:'sight',color:'var(--green)'},
    {label:'\u{1F941} \u{B9AC}\u{B4EC}\u{D2B8}\u{B808}\u{C774}\u{B2DD}',action:'rhythm',color:'var(--purple)'},
    {label:'\u{1F4DA} \u{D53C}\u{C544}\u{B178}\u{D000}\u{C988}',action:'quiz',color:'var(--cyan)'},
    {label:'\u{1F4F8} \u{ACF5}\u{C720}\u{CE74}\u{B4DC}',action:'share',color:'var(--yellow)'},
    {label:'\u{1F3CB}\u{FE0F} \u{C6CC}\u{BC0D}\u{C5C5}',action:'warmup',color:'var(--red)'},
    {label:'\u{1F4C5} \u{C8FC}\u{AC04}\u{CC4C}\u{B9B0}\u{C9C0}',action:'weekly',color:'var(--accent)'},
    {label:'\u{1F4CA} \u{B09C}\u{C774}\u{B3C4}\u{AC00}\u{C774}\u{B4DC}',action:'diffguide',color:'var(--green)'}
  ];

  wrap.innerHTML = buttons.map(b=>`<button class="v10-qbtn" data-action="${b.action}" style="padding:6px 12px;border-radius:6px;border:1px solid ${b.color};background:${b.color}15;color:${b.color};font-size:10px;font-weight:600;cursor:pointer">${b.label}</button>`).join('');

  const v9Actions = document.getElementById('v9-quick-actions');
  if(v9Actions){
    v9Actions.after(wrap);
  } else {
    container.insertBefore(wrap, container.firstChild);
  }

  wrap.querySelectorAll('.v10-qbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      switch(btn.dataset.action){
        case 'sight':
          document.getElementById('sight-modal').style.display='flex';break;
        case 'rhythm':
          updateRhythmDisplay();
          document.getElementById('rhythm-modal').style.display='flex';break;
        case 'quiz':
          startQuiz();break;
        case 'share':
          renderShareCard();
          document.getElementById('share-modal').style.display='flex';break;
        case 'warmup':
          document.getElementById('warmup-modal').style.display='flex';break;
        case 'weekly':
          renderWeeklyContent();
          document.getElementById('weekly-modal').style.display='flex';break;
        case 'diffguide':
          renderDiffGuide();
          document.getElementById('diffguide-modal').style.display='flex';break;
      }
    });
  });
}

// ================ 12. KEYBOARD SHORTCUTS v10 ================
function setupV10Shortcuts(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
    if(!e.shiftKey) return;
    switch(e.key.toUpperCase()){
      case 'S':
        e.preventDefault();
        document.getElementById('sight-modal').style.display='flex';break;
      case 'R':
        e.preventDefault();
        updateRhythmDisplay();
        document.getElementById('rhythm-modal').style.display='flex';break;
      case 'Q':
        e.preventDefault();
        startQuiz();break;
      case 'C':
        e.preventDefault();
        renderShareCard();
        document.getElementById('share-modal').style.display='flex';break;
      case 'W':
        e.preventDefault();
        document.getElementById('warmup-modal').style.display='flex';break;
    }
  });
}

// ================ 13. FINISHSONG HOOK v10 ================
function hookV10FinishSong(){
  if(!window.app) return;
  const orig = window.app.finishSong;
  if(!orig) return;
  window.app.finishSong = function(){
    recordWeeklyProgress('weekPlays', 1);
    const s = window.app.stats;
    if(s){
      recordWeeklyProgress('weekNotes', s.lastNotes||0);
      recordWeeklyProgress('weekScore', s.lastScore||0);
      if(s.lastScore && s.lastScore >= 1000) recordWeeklyProgress('weekPerfect', 1);
      recordWeeklyProgress('weekMaxCombo', s.combo||0);
      recordWeeklyProgress('weekMinutes', Math.round((s.lastPlayTime||0)/60));
    }
    orig.call(window.app);
    setTimeout(()=>{
      checkV10Achievements();
      injectV10Achievements();
    }, 500);
  };
}

// ================ INIT v10 ================
function initV10(){
  addV10Songs();
  buildSightReadingUI();
  buildRhythmUI();
  buildFavoritesSystem();
  buildWeeklyChallengeUI();
  buildQuizUI();
  buildShareUI();
  buildWarmupUI();
  buildDiffGuideUI();
  injectV10QuickActions();
  injectV10Achievements();
  setupV10Shortcuts();
  hookV10FinishSong();

  if(window.app && window.app.renderSongList){
    window.app.renderSongList();
  }

  const helpEl = document.getElementById('shortcutsHelp');
  if(helpEl && !helpEl.textContent.includes('Shift+S')){
    helpEl.innerHTML += '<br>Shift+S: \u{C2DC}\u{BCF4}\u{B4DC} | Shift+R: \u{B9AC}\u{B4EC} | Shift+Q: \u{D000}\u{C988}<br>Shift+C: \u{ACF5}\u{C720}\u{CE74}\u{B4DC} | Shift+W: \u{C6CC}\u{BC0D}\u{C5C5}';
  }

  checkV10Achievements();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(initV10, 500));
} else {
  setTimeout(initV10, 500);
}

})();
