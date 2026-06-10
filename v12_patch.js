// Piano Master v12 Patch Module
// Sight Reading, Rhythm Patterns, Music History Timeline, Practice Streak,
// Performance Mode, Technique Drills, Song Recommend, Practice Calendar,
// 10 Songs, Quiz v3 15Q, 12 Achievements, SFX 10, Keyboard 8
(function(){
'use strict';
if(window.__v12Loaded) return;
window.__v12Loaded = true;

const LS12 = 'piano-v12-';
function ls12Get(k,d){try{return JSON.parse(localStorage.getItem(LS12+k))||d}catch{return d}}
function ls12Set(k,v){localStorage.setItem(LS12+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v12 ================
const sfx12 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX12(type){
  if(!sfx12) return;
  if(sfx12.state==='suspended') sfx12.resume();
  const t=sfx12.currentTime, g=sfx12.createGain(), o=sfx12.createOscillator();
  g.connect(sfx12.destination); o.connect(g);
  switch(type){
    case 'sight_correct':
      o.type='triangle';o.frequency.setValueAtTime(659,t);o.frequency.linearRampToValueAtTime(988,t+0.12);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'sight_wrong':
      o.type='sawtooth';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(100,t+0.15);
      g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'rhythm_tick':
      o.type='square';o.frequency.setValueAtTime(1200,t);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.start(t);o.stop(t+0.05);break;
    case 'rhythm_done':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(()=>{
        if(!sfx12) return;
        const g2=sfx12.createGain(),o2=sfx12.createOscillator();
        g2.connect(sfx12.destination);o2.connect(g2);o2.type='triangle';
        o2.frequency.setValueAtTime(784,sfx12.currentTime);
        g2.gain.setValueAtTime(0.1,sfx12.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,sfx12.currentTime+0.15);
        o2.start(sfx12.currentTime);o2.stop(sfx12.currentTime+0.15);
      },120);break;
    case 'history_open':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(660,t+0.2);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'streak_milestone':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      [659,784,1047].forEach((f,i)=>{
        setTimeout(()=>{
          if(!sfx12) return;
          const gg=sfx12.createGain(),oo=sfx12.createOscillator();
          gg.connect(sfx12.destination);oo.connect(gg);oo.type='triangle';
          oo.frequency.setValueAtTime(f,sfx12.currentTime);
          gg.gain.setValueAtTime(0.1,sfx12.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx12.currentTime+0.15);
          oo.start(sfx12.currentTime);oo.stop(sfx12.currentTime+0.15);
        },(i+1)*130);
      });break;
    case 'perform_applause':
      for(let i=0;i<8;i++){
        setTimeout(()=>{
          if(!sfx12) return;
          const gg=sfx12.createGain(),n=sfx12.createBufferSource();
          gg.connect(sfx12.destination);
          const buf=sfx12.createBuffer(1,sfx12.sampleRate*0.05,sfx12.sampleRate);
          const d=buf.getChannelData(0);
          for(let j=0;j<d.length;j++) d[j]=(Math.random()*2-1)*0.03;
          n.buffer=buf;n.connect(gg);
          gg.gain.setValueAtTime(0.08,sfx12.currentTime);
          gg.gain.exponentialRampToValueAtTime(0.001,sfx12.currentTime+0.06);
          n.start(sfx12.currentTime);
        },i*70);
      }
      return;
    case 'drill_done':
      o.type='triangle';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
    case 'recommend_pick':
      o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(1047,t+0.15);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'calendar_check':
      o.type='triangle';o.frequency.setValueAtTime(698,t);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'quiz3_correct':
      o.type='triangle';o.frequency.setValueAtTime(784,t);o.frequency.linearRampToValueAtTime(1047,t+0.1);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
  }
}

// ================ 1. SIGHT READING TRAINER ================
const CLEF_NOTES = [
  {name:'C4',line:0},{name:'D4',line:1},{name:'E4',line:2},{name:'F4',line:3},{name:'G4',line:4},
  {name:'A4',line:5},{name:'B4',line:6},{name:'C5',line:7},{name:'D5',line:8},{name:'E5',line:9},
  {name:'F5',line:10},{name:'G5',line:11},{name:'A5',line:12}
];
let sightScore=0,sightTotal=0,sightCurrent=null,sightActive=false,sightStreak=0;

function drawStaffNote(canvas, noteObj){
  const ctx=canvas.getContext('2d');
  const w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#141828';ctx.fillRect(0,0,w,h);
  const staffTop=40, gap=14;
  ctx.strokeStyle='#444';ctx.lineWidth=1;
  for(let i=0;i<5;i++){
    const y=staffTop+i*gap;
    ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w-30,y);ctx.stroke();
  }
  ctx.fillStyle='#4a7dff';ctx.font='bold 48px serif';
  ctx.fillText('\u{1D11E}',35,staffTop+4*gap+5);
  const baseY = staffTop + 4*gap + gap;
  const noteY = baseY - noteObj.line * (gap/2);
  ctx.fillStyle='#e8ecf4';
  ctx.beginPath();ctx.ellipse(w/2, noteY, 10, 8, -0.2, 0, Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e8ecf4';ctx.lineWidth=2;
  if(noteObj.line<=6){
    ctx.beginPath();ctx.moveTo(w/2+10, noteY);ctx.lineTo(w/2+10, noteY-40);ctx.stroke();
  } else {
    ctx.beginPath();ctx.moveTo(w/2-10, noteY);ctx.lineTo(w/2-10, noteY+40);ctx.stroke();
  }
  if(noteObj.line<=0){
    ctx.strokeStyle='#666';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(w/2-16,baseY);ctx.lineTo(w/2+16,baseY);ctx.stroke();
  }
  ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';ctx.textAlign='center';
  ctx.fillText('\u{C774} \u{C74C}\u{D45C}\u{B97C} \u{C5F0}\u{C8FC}\u{D558}\u{C138}\u{C694}',w/2,h-12);
  ctx.textAlign='start';
}

function buildSightReadingUI(){
  const modal = document.createElement('div');
  modal.id = 'sight-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3BC} \u{C2DC}\u{BCF4}\u{B9AC}\u{B529} \u{D2B8}\u{B808}\u{C774}\u{B108}</h2>
      <button onclick="document.getElementById('sight-modal').style.display='none';sightActive=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:10px">\u{C624}\u{C120}\u{BCF4}\u{C5D0} \u{D45C}\u{C2DC}\u{B41C} \u{C74C}\u{D45C}\u{B97C} \u{C77D}\u{ACE0} \u{D574}\u{B2F9} \u{AC74}\u{BC18}\u{C744} \u{B204}\u{B974}\u{C138}\u{C694}</p>
    <canvas id="sight-canvas" width="360" height="160" style="width:100%;max-width:360px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px"></canvas>
    <div id="sight-btn-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px"></div>
    <div id="sight-feedback" style="font-size:13px;min-height:20px;margin:8px 0"></div>
    <div style="font-size:12px;display:flex;justify-content:center;gap:16px;margin-bottom:10px">
      <span style="color:var(--green)" id="sight-score">\u{C815}\u{B2F5}: 0</span>
      <span style="color:var(--text2)" id="sight-total">\u{CD1D}: 0</span>
      <span style="color:var(--yellow)" id="sight-streak">\u{C5F0}\u{C18D}: 0</span>
    </div>
    <button id="sight-start" style="padding:8px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:13px;font-weight:600;cursor:pointer">\u{C2DC}\u{C791}</button>
  </div>`;
  document.body.appendChild(modal);
  const btnGrid = modal.querySelector('#sight-btn-grid');
  ['C','D','E','F','G','A','B'].forEach(n=>{
    const btn=document.createElement('button');
    btn.style.cssText='padding:10px 4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;font-weight:600;cursor:pointer';
    btn.textContent=n;
    btn.addEventListener('click',()=>checkSightAnswer(n));
    btnGrid.appendChild(btn);
  });
  modal.querySelector('#sight-start').addEventListener('click',()=>{
    sightScore=0;sightTotal=0;sightStreak=0;sightActive=true;
    modal.querySelector('#sight-score').textContent='\u{C815}\u{B2F5}: 0';
    modal.querySelector('#sight-total').textContent='\u{CD1D}: 0';
    modal.querySelector('#sight-streak').textContent='\u{C5F0}\u{C18D}: 0';
    nextSightNote();
  });
}
function nextSightNote(){
  sightCurrent=CLEF_NOTES[Math.floor(Math.random()*CLEF_NOTES.length)];
  const canvas=document.getElementById('sight-canvas');
  if(canvas) drawStaffNote(canvas, sightCurrent);
  document.getElementById('sight-feedback').textContent='';
}
function checkSightAnswer(answer){
  if(!sightActive||!sightCurrent) return;
  const correctNote=sightCurrent.name.replace(/\d/,'');
  sightTotal++;
  const fb=document.getElementById('sight-feedback');
  if(answer===correctNote){
    sightScore++;sightStreak++;
    fb.innerHTML='<span style="color:var(--green)">\u{2705} \u{C815}\u{B2F5}! '+sightCurrent.name+'</span>';
    playSFX12('sight_correct');
    ls12Set('sightTotal',(ls12Get('sightTotal',0))+1);
    ls12Set('sightCorrect',(ls12Get('sightCorrect',0))+1);
    if(sightStreak>ls12Get('sightBestStreak',0)) ls12Set('sightBestStreak',sightStreak);
  } else {
    sightStreak=0;
    fb.innerHTML='<span style="color:var(--red)">\u{274C} \u{C624}\u{B2F5}! \u{C815}\u{B2F5}: '+sightCurrent.name+'</span>';
    playSFX12('sight_wrong');
  }
  document.getElementById('sight-score').textContent='\u{C815}\u{B2F5}: '+sightScore;
  document.getElementById('sight-total').textContent='\u{CD1D}: '+sightTotal;
  document.getElementById('sight-streak').textContent='\u{C5F0}\u{C18D}: '+sightStreak;
  setTimeout(nextSightNote,800);
}

// ================ 2. RHYTHM PATTERN GENERATOR ================
const RHYTHM_PATTERNS = [
  {name:'\u{AE30}\u{BCF8} 4\u{BD84}\u{C74C}\u{D45C}', pattern:[1,1,1,1], bpm:80, difficulty:'\u{CD08}\u{AE09}'},
  {name:'\u{B3D9}\u{C694} \u{B9AC}\u{B4EC}', pattern:[1,0.5,0.5,1,1], bpm:90, difficulty:'\u{CD08}\u{AE09}'},
  {name:'\u{C2F1}\u{CF54}\u{D398}\u{C774}\u{C158}', pattern:[0.5,0.5,1,0.5,0.5,1], bpm:85, difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{C810}\u{C74C}\u{D45C} \u{B9AC}\u{B4EC}', pattern:[1.5,0.5,1.5,0.5], bpm:75, difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{C154}\u{D50C} \u{BD84}\u{C74C}\u{D45C}', pattern:[0.5,0.5,0.5,0.5,1,1], bpm:80, difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{C2A4}\u{C719} \u{B9AC}\u{B4EC}', pattern:[1.5,0.5,1.5,0.5,1], bpm:100, difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{C14B}\u{C154} \u{D328}\u{D134}', pattern:[0.5,0.5,0.5,0.5,0.5,0.5,1], bpm:95, difficulty:'\u{ACE0}\u{AE09}'},
  {name:'\u{C654}\u{CE20} \u{D328}\u{D134}', pattern:[1,0.5,0.5,0.5,0.5,1], bpm:105, difficulty:'\u{ACE0}\u{AE09}'},
  {name:'\u{BCF5}\u{D569} \u{B9AC}\u{B4EC} 1', pattern:[0.25,0.25,0.5,1,0.5,0.5], bpm:70, difficulty:'\u{ACE0}\u{AE09}'},
  {name:'\u{BCF5}\u{D569} \u{B9AC}\u{B4EC} 2', pattern:[1,0.25,0.25,0.25,0.25,0.5,0.5], bpm:72, difficulty:'\u{ACE0}\u{AE09}'}
];
let rhythmPlaying=false, rhythmTimer=null;

function buildRhythmUI(){
  const modal = document.createElement('div');
  modal.id = 'rhythm-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let listHtml = RHYTHM_PATTERNS.map((p,i)=>{
    const diffColor = p.difficulty==='\u{CD08}\u{AE09}'?'var(--green)':p.difficulty==='\u{C911}\u{AE09}'?'var(--yellow)':'var(--red)';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" onclick="playRhythmPattern(${i})">
      <span style="font-size:18px">\u{1F3B5}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:600">${p.name}</div><div style="font-size:10px;color:var(--text2)">${p.bpm} BPM</div></div>
      <span style="font-size:10px;color:${diffColor};font-weight:600">${p.difficulty}</span>
    </div>`;
  }).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F941} \u{B9AC}\u{B4EC} \u{D328}\u{D134} \u{C5F0}\u{C2B5}</h2>
      <button onclick="document.getElementById('rhythm-modal').style.display='none';stopRhythm()" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">\u{D328}\u{D134}\u{C744} \u{D074}\u{B9AD}\u{D558}\u{BA74} \u{B9AC}\u{B4EC}\u{C744} \u{C7AC}\u{C0DD}\u{D569}\u{B2C8}\u{B2E4}</p>
    <canvas id="rhythm-canvas" width="400" height="80" style="width:100%;max-width:400px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px;display:none"></canvas>
    <div id="rhythm-status" style="font-size:13px;text-align:center;margin-bottom:10px;min-height:20px"></div>
    <div style="display:flex;flex-direction:column;gap:6px">${listHtml}</div>
  </div>`;
  document.body.appendChild(modal);
}
window.playRhythmPattern = function(idx){
  if(rhythmPlaying) stopRhythm();
  const p = RHYTHM_PATTERNS[idx];
  rhythmPlaying = true;
  const canvas = document.getElementById('rhythm-canvas');
  canvas.style.display='block';
  document.getElementById('rhythm-status').innerHTML = '\u{1F3B6} <span style="color:var(--accent)">' + p.name + '</span> \u{C7AC}\u{C0DD} \u{C911}...';
  ls12Set('rhythmPlayed',(ls12Get('rhythmPlayed',0))+1);
  // draw visual
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#141828';ctx.fillRect(0,0,w,h);
  const totalBeats=p.pattern.reduce((a,b)=>a+b,0);
  let x=20;const unitW=(w-40)/totalBeats;
  p.pattern.forEach((beat,i)=>{
    const bw=beat*unitW;
    ctx.fillStyle=i%2===0?'#4a7dff':'#a855f7';
    ctx.fillRect(x+2,15,bw-4,h-30);
    ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText(beat>=1?'\u{266A}':'\u{266B}',x+bw/2,h/2+5);
    x+=bw;
  });
  ctx.textAlign='start';
  // play audio
  if(sfx12){
    if(sfx12.state==='suspended') sfx12.resume();
    const beatDur=60/p.bpm;let time=0;
    p.pattern.forEach((beat,i)=>{
      const tt=sfx12.currentTime+time+0.1;
      const g=sfx12.createGain(),o=sfx12.createOscillator();
      g.connect(sfx12.destination);o.connect(g);
      o.type=i===0?'triangle':'sine';o.frequency.setValueAtTime(i===0?880:660,tt);
      g.gain.setValueAtTime(0.1,tt);g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);
      o.start(tt);o.stop(tt+0.08);
      time+=beat*beatDur;
    });
    rhythmTimer=setTimeout(()=>{
      rhythmPlaying=false;
      document.getElementById('rhythm-status').innerHTML='\u{2705} \u{C644}\u{B8CC}!';
      playSFX12('rhythm_done');
    },time*1000+200);
  }
};
function stopRhythm(){
  rhythmPlaying=false;
  if(rhythmTimer){clearTimeout(rhythmTimer);rhythmTimer=null;}
  const c=document.getElementById('rhythm-canvas');if(c) c.style.display='none';
  const s=document.getElementById('rhythm-status');if(s) s.textContent='';
}

// ================ 3. MUSIC HISTORY TIMELINE ================
const MUSIC_ERAS = [
  {era:'\u{C911}\u{C138} (500~1400)', desc:'\u{AD50}\u{D68C}\u{C74C}\u{C545} \u{C911}\u{C2EC}, \u{ADF8}\u{B808}\u{ACE0}\u{B9AC}\u{C548} \u{C131}\u{AC00}, \u{B124}\u{C6B0}\u{B9C8} \u{AD50}\u{D68C}\u{C218}\u{AC00} \u{BD80}\u{D0C0}', icon:'\u{26EA}', color:'#8b5cf6'},
  {era:'\u{B974}\u{B124}\u{C0C1}\u{C2A4} (1400~1600)', desc:'\u{B2E4}\u{C131}\u{C74C}\u{C545} \u{BC1C}\u{C804}, \u{C138}\u{C18D}\u{C74C}\u{C545} \u{B300}\u{B450}, \u{B9C8}\u{B4DC}\u{B9AC}\u{AC08}/\u{BAA8}\u{D14B}', icon:'\u{1F3F0}', color:'#6366f1'},
  {era:'\u{BC14}\u{B85C}\u{D06C} (1600~1750)', desc:'\u{C624}\u{D398}\u{B77C} \u{D0C4}\u{C0DD}, \u{D611}\u{C8FC}\u{C800}\u{C74C} \u{BC1C}\u{B2EC}, \u{BC14}\u{D750}/\u{D5E8}\u{B378}/\u{BE44}\u{BC1C}\u{B514}', icon:'\u{1F3BB}', color:'#a855f7'},
  {era:'\u{ACE0}\u{C804}\u{C8FC}\u{C758} (1750~1820)', desc:'\u{C18C}\u{B098}\u{D0C0} \u{D615}\u{C2DD} \u{D655}\u{B9BD}, \u{BAA8}\u{CC28}\u{B974}\u{D2B8}/\u{D558}\u{C774}\u{B4E0}/\u{CD08}\u{AE30} \u{BCA0}\u{D1A0}\u{BCA4}', icon:'\u{1F451}', color:'#eab308'},
  {era:'\u{B0AD}\u{B9CC}\u{C8FC}\u{C758} (1820~1900)', desc:'\u{AC10}\u{C815}\u{C801} \u{D45C}\u{D604}, \u{AD50}\u{D5A5}\u{C2DC} \u{BC1C}\u{C804}, \u{C1FC}\u{D321}/\u{B9AC}\u{C2A4}\u{D2B8}/\u{CC28}\u{C774}\u{CF54}\u{D504}\u{C2A4}\u{D0A4}', icon:'\u{1F339}', color:'#ec4899'},
  {era:'\u{C778}\u{C0C1}\u{C8FC}\u{C758} (1860~1920)', desc:'\u{BAA8}\u{D638}\u{D55C} \u{C74C}\u{C0C9}, \u{C804}\u{C74C}\u{C74C}\u{B808} \u{D655}\u{B300}, \u{B4DC}\u{BDA4}\u{C2DC}/\u{B77C}\u{BCA8}', icon:'\u{1F30A}', color:'#06b6d4'},
  {era:'20\u{C138}\u{AE30} \u{C804}\u{BC18} (1900~1950)', desc:'\u{BB34}\u{C870}\u{C131}/12\u{C74C}\u{AE30}\u{BC95}, \u{C2E0}\u{ACE0}\u{C804}\u{C8FC}\u{C758}, \u{C2A4}\u{D2B8}\u{B77C}\u{BE48}\u{C2A4}\u{D0A4}/\u{BC14}\u{B974}\u{D1A1}', icon:'\u{1F680}', color:'#f59e0b'},
  {era:'\u{C7AC}\u{C988} (1900~)', desc:'\u{C989}\u{D765}\u{ACFC} \u{C2A4}\u{C719}, \u{BE44}\u{BC14}\u{D504}/\u{BE45}\u{BC34}\u{B4DC}, \u{BE14}\u{B8E8}\u{C2A4}/\u{D37C}\u{D06C}', icon:'\u{1F3B7}', color:'#10b981'},
  {era:'\u{D604}\u{B300}\u{C74C}\u{C545} (1945~)', desc:'\u{C804}\u{C790}\u{C74C}\u{C545}/\u{BBF8}\u{B2C8}\u{BA40}\u{B9AC}\u{C998}, \u{D3EC}\u{C2A4}\u{D2B8}\u{BAA8}\u{B358}', icon:'\u{1F4BB}', color:'#ef4444'},
  {era:'\u{D55C}\u{AD6D}\u{C74C}\u{C545}\u{C0AC}', desc:'\u{AC00}\u{C57C}\u{AE08}/\u{D310}\u{C18C}\u{B9AC}/\u{C544}\u{B9AC}\u{B791}, \u{C11C}\u{C591}\u{C74C}\u{C545} \u{C218}\u{C6A9} \u{D6C4} \u{D604}\u{B300} \u{CC3D}\u{C791}\u{AD6D}', icon:'\u{1F1F0}\u{1F1F7}', color:'#dc2626'},
  {era:'\u{D53C}\u{C544}\u{B178}\u{C758} \u{C5ED}\u{C0AC}', desc:'1700\u{B144}\u{B300} \u{D074}\u{B77C}\u{BE44}\u{CF54}\u{B4DC}\u{C5D0}\u{C11C} \u{D604}\u{B300} \u{B514}\u{C9C0}\u{D138} \u{D53C}\u{C544}\u{B178}\u{AE4C}\u{C9C0} 300\u{B144} \u{C9C4}\u{D654}', icon:'\u{1F3B9}', color:'#4a7dff'},
  {era:'\u{C601}\u{D654}\u{C74C}\u{C545}/OST', desc:'\u{C874} \u{C708}\u{B9AC}\u{C5C4}\u{C988}/\u{D55C}\u{C2A4} \u{C9D0}\u{BA38}/\u{C5D4}\u{B2C8}\u{C624} \u{BAA8}\u{B9AC}\u{CF54}\u{B124}', icon:'\u{1F3AC}', color:'#f97316'}
];
let historyRead = ls12Get('historyRead',[]);

function buildHistoryUI(){
  const modal = document.createElement('div');
  modal.id = 'history-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let items = MUSIC_ERAS.map((e,i)=>`<div class="hist-item" data-idx="${i}" onclick="toggleHistoryItem(${i})" style="padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">${e.icon}</span>
        <div style="flex:1"><div style="font-size:12px;font-weight:600;color:${e.color}">${e.era}</div></div>
        <span style="font-size:10px;color:${historyRead.includes(i)?'var(--green)':'var(--text2)'}">${historyRead.includes(i)?'\u{2705}':'\u{1F4D6}'}</span>
      </div>
      <div class="hist-desc" style="display:none;margin-top:8px;font-size:11px;color:var(--text2);line-height:1.5">${e.desc}</div>
    </div>`).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3DB}\u{FE0F} \u{C74C}\u{C545}\u{C0AC} \u{D0C0}\u{C784}\u{B77C}\u{C778}</h2>
      <button onclick="document.getElementById('history-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">\u{C74C}\u{C545}\u{C758} \u{C5ED}\u{C0AC}\u{B97C} \u{C2DC}\u{B300}\u{BCC4}\u{B85C} \u{D0D0}\u{D5D8}\u{D574}\u{BCF4}\u{C138}\u{C694} (${historyRead.length}/${MUSIC_ERAS.length})</p>
    <div style="display:flex;flex-direction:column;gap:6px">${items}</div>
  </div>`;
  document.body.appendChild(modal);
}
window.toggleHistoryItem = function(idx){
  const item = document.querySelector(`.hist-item[data-idx="${idx}"]`);
  if(!item) return;
  const desc = item.querySelector('.hist-desc');
  if(desc.style.display==='none'){
    desc.style.display='block';
    if(!historyRead.includes(idx)){
      historyRead.push(idx);ls12Set('historyRead',historyRead);
      const badge = item.querySelector('span:last-child');
      if(badge){badge.textContent='\u{2705}';badge.style.color='var(--green)';}
      playSFX12('history_open');
    }
  } else desc.style.display='none';
};

// ================ 4. PRACTICE STREAK ================
function buildStreakUI(){
  const modal = document.createElement('div');
  modal.id = 'streak-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F525} \u{C2A4}\u{D2B8}\u{B9AD} &amp; \u{BAA9}\u{D45C}</h2>
      <button onclick="document.getElementById('streak-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="streak-content"></div>
  </div>`;
  document.body.appendChild(modal);
  updateStreakContent();
}
function updateStreakContent(){
  const today = new Date().toISOString().slice(0,10);
  let streakDays = ls12Get('streakDays',[]);
  if(!streakDays.includes(today)){streakDays.push(today);ls12Set('streakDays',streakDays);}
  streakDays.sort();
  let currentStreak=1;
  for(let i=streakDays.length-1;i>0;i--){
    const d1=new Date(streakDays[i]),d2=new Date(streakDays[i-1]);
    if((d1-d2)/(1000*60*60*24)===1) currentStreak++;else break;
  }
  const bestStreak=Math.max(currentStreak, ls12Get('bestStreak',0));
  ls12Set('bestStreak',bestStreak);
  const goals = [
    {name:'5\u{ACE1} \u{C644}\u{C8FC}', target:5, current:ls12Get('songsCompleted',0), icon:'\u{1F3B5}'},
    {name:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529} 20\u{BB38}\u{C81C}', target:20, current:ls12Get('sightTotal',0), icon:'\u{1F3BC}'},
    {name:'\u{B9AC}\u{B4EC} 5\u{D328}\u{D134}', target:5, current:ls12Get('rhythmPlayed',0), icon:'\u{1F941}'},
    {name:'\u{C74C}\u{C545}\u{C0AC} \u{C804}\u{BD80}', target:MUSIC_ERAS.length, current:historyRead.length, icon:'\u{1F3DB}\u{FE0F}'},
    {name:'\u{ACF5}\u{C5F0} 3\u{D68C}', target:3, current:ls12Get('performCount',0), icon:'\u{1F3AD}'},
    {name:'\u{B4DC}\u{B9B4} 4\u{AC1C}', target:4, current:ls12Get('drillCompleted',[]).length, icon:'\u{270B}'}
  ];
  let goalsHtml = goals.map(g=>{
    const pct=Math.min(100,Math.round(g.current/g.target*100));
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:6px">
      <span style="font-size:16px">${g.icon}</span>
      <div style="flex:1;text-align:left"><div style="font-size:11px;font-weight:600">${g.name}</div>
      <div style="background:var(--border);border-radius:4px;height:6px;margin-top:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${pct>=100?'var(--green)':'var(--accent)'};border-radius:4px"></div></div></div>
      <span style="font-size:10px;color:${pct>=100?'var(--green)':'var(--text2)'}">${g.current}/${g.target}</span>
    </div>`;
  }).join('');
  const last7=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);last7.push({date:ds, active:streakDays.includes(ds)});}
  let calHtml=last7.map(d=>`<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
    <div style="width:28px;height:28px;border-radius:50%;background:${d.active?'var(--green)':'var(--surface2)'};border:1px solid ${d.active?'var(--green)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:10px;color:${d.active?'white':'var(--text2)'}">${d.active?'\u{2713}':''}</div>
    <span style="font-size:9px;color:var(--text2)">${d.date.slice(5)}</span></div>`).join('');
  const el=document.getElementById('streak-content');
  if(!el) return;
  el.innerHTML = `<div style="display:flex;justify-content:center;gap:24px;margin-bottom:16px">
      <div><div style="font-size:28px;font-weight:700;color:var(--accent)">${currentStreak}</div><div style="font-size:10px;color:var(--text2)">\u{D604}\u{C7AC}</div></div>
      <div><div style="font-size:28px;font-weight:700;color:var(--yellow)">${bestStreak}</div><div style="font-size:10px;color:var(--text2)">\u{CD5C}\u{ACE0}</div></div>
      <div><div style="font-size:28px;font-weight:700;color:var(--green)">${streakDays.length}</div><div style="font-size:10px;color:var(--text2)">\u{CD1D}\u{C77C}\u{C218}</div></div>
    </div>
    <div style="display:flex;justify-content:center;gap:8px;margin-bottom:20px">${calHtml}</div>
    <h3 style="font-size:13px;color:var(--accent);margin-bottom:10px;text-align:left">\u{1F3AF} \u{BAA9}\u{D45C}</h3>
    <div style="display:flex;flex-direction:column;gap:6px">${goalsHtml}</div>`;
}

// ================ 5. PERFORMANCE MODE ================
function buildPerformanceUI(){
  const modal = document.createElement('div');
  modal.id = 'perform-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3AD} \u{ACF5}\u{C5F0} \u{BAA8}\u{B4DC}</h2>
      <button onclick="document.getElementById('perform-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="perform-canvas" width="440" height="260" style="width:100%;max-width:440px;border-radius:8px;margin-bottom:12px"></canvas>
    <div id="perform-song-select" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:12px"></div>
    <div id="perform-result" style="font-size:13px;min-height:24px"></div>
    <div id="perform-records" style="margin-top:12px;font-size:11px;color:var(--text2)"></div>
  </div>`;
  document.body.appendChild(modal);
  const canvas=document.getElementById('perform-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    const grad=ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#0a0e2a');grad.addColorStop(0.6,'#1a1040');grad.addColorStop(1,'#2a1530');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#3a2040';ctx.fillRect(0,h*0.65,w,h*0.35);
    [[w*0.2,10,'#ff6b6b33'],[w*0.5,10,'#ffd93d33'],[w*0.8,10,'#6bcb7733']].forEach(([x,y,c])=>{
      const sg=ctx.createRadialGradient(x,y,0,x,h*0.4,120);
      sg.addColorStop(0,c);sg.addColorStop(1,'transparent');
      ctx.fillStyle=sg;ctx.beginPath();ctx.arc(x,h*0.4,120,0,Math.PI*2);ctx.fill();
    });
    ctx.fillStyle='#2a2a4e';ctx.fillRect(w*0.38,h*0.55,w*0.24,h*0.25);
    for(let i=0;i<10;i++){
      const ax=30+(i%5)*(w-60)/5+Math.random()*20, ay=h*0.78+Math.floor(i/5)*25;
      ctx.fillStyle='#555';ctx.beginPath();ctx.arc(ax,ay,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#888';ctx.beginPath();ctx.arc(ax,ay-8,5,0,Math.PI,true);ctx.fill();
    }
    ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('\u{1F3B9} \u{ACF5}\u{C5F0} \u{BB34}\u{B300}',w/2,30);ctx.textAlign='start';
  }
  if(typeof SONGS !== 'undefined'){
    const container=document.getElementById('perform-song-select');
    SONGS.slice(0,20).forEach(s=>{
      const btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer;white-space:nowrap';
      btn.textContent=(s.icon||'\u{1F3B5}')+' '+s.name;
      btn.addEventListener('click',()=>{
        const result=document.getElementById('perform-result');
        result.innerHTML='\u{1F3B6} <span style="color:var(--accent)">'+s.name+'</span> \u{ACF5}\u{C5F0} \u{C911}...';
        ls12Set('performCount',(ls12Get('performCount',0))+1);
        const score=Math.floor(60+Math.random()*40);
        const grade=score>=95?'S':score>=85?'A':score>=75?'B':score>=60?'C':'D';
        const gc={S:'#ffd700',A:'#22c55e',B:'#3b82f6',C:'#eab308',D:'#ef4444'}[grade];
        setTimeout(()=>{
          result.innerHTML=`<div style="font-size:20px;font-weight:700;color:${gc}">${grade}\u{B4F1}\u{AE09}</div><div style="font-size:14px;margin:4px 0">\u{C810}\u{C218}: ${score}\u{C810}</div>`;
          playSFX12('perform_applause');
          const rec=ls12Get('performRecords',[]);
          rec.unshift({song:s.name,score,grade,date:new Date().toISOString().slice(0,10)});
          if(rec.length>20) rec.length=20;
          ls12Set('performRecords',rec);
          renderPerformRecords();
        },2000);
      });
      container.appendChild(btn);
    });
  }
  renderPerformRecords();
}
function renderPerformRecords(){
  const el=document.getElementById('perform-records');if(!el) return;
  const rec=ls12Get('performRecords',[]);
  if(!rec.length){el.textContent='\u{ACF5}\u{C5F0} \u{AE30}\u{B85D} \u{C5C6}\u{C74C}';return;}
  el.innerHTML='<div style="font-weight:600;margin-bottom:6px">\u{1F3C6} \u{CD5C}\u{ADFC} \u{ACF5}\u{C5F0}</div>'+
    rec.slice(0,5).map(r=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border)"><span>${r.song}</span><span style="color:var(--accent)">${r.grade} ${r.score}\u{C810}</span></div>`).join('');
}

// ================ 6. TECHNIQUE DRILLS ================
const DRILLS = [
  {name:'C \u{BA54}\u{C774}\u{C800} \u{C2A4}\u{CF00}\u{C77C}', desc:'C-D-E-F-G-A-B-C', difficulty:'\u{CD08}\u{AE09}'},
  {name:'G \u{BA54}\u{C774}\u{C800} \u{C2A4}\u{CF00}\u{C77C}', desc:'G-A-B-C-D-E-F#-G', difficulty:'\u{CD08}\u{AE09}'},
  {name:'C \u{C544}\u{B974}\u{D398}\u{C9C0}\u{C624}', desc:'C-E-G-C-G-E-C', difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{D06C}\u{B85C}\u{B9E4}\u{D2F1} \u{C2A4}\u{CF00}\u{C77C}', desc:'\u{BC18}\u{C74C}\u{ACC4} \u{C0C1}\u{D589}', difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{C625}\u{D0C0}\u{BE0C} \u{C810}\u{D504}', desc:'C4-C5 \u{BC18}\u{BCF5}', difficulty:'\u{C911}\u{AE09}'},
  {name:'\u{D2B8}\u{B9B4} \u{C5F0}\u{C2B5}', desc:'C-E-G / D-F-A / E-G-B', difficulty:'\u{C911}\u{AE09}'},
  {name:'A \u{B9C8}\u{C774}\u{B108} \u{C2A4}\u{CF00}\u{C77C}', desc:'A-B-C-D-E-F-G#-A', difficulty:'\u{ACE0}\u{AE09}'},
  {name:'\u{C591}\u{C190} \u{BC18}\u{C9C4}\u{D589}', desc:'R:\u{C0C1}\u{D589} L:\u{D558}\u{D589} \u{B3D9}\u{C2DC}', difficulty:'\u{ACE0}\u{AE09}'}
];
let drillCompleted = ls12Get('drillCompleted',[]);

function buildDrillUI(){
  const modal = document.createElement('div');
  modal.id = 'drill-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let items = DRILLS.map((d,i)=>{
    const done=drillCompleted.includes(i);
    const dc=d.difficulty==='\u{CD08}\u{AE09}'?'var(--green)':d.difficulty==='\u{C911}\u{AE09}'?'var(--yellow)':'var(--red)';
    return `<div style="padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:16px">${done?'\u{2705}':'\u{1F3B9}'}</span>
        <div style="flex:1;text-align:left"><div style="font-size:12px;font-weight:600">${d.name} <span style="color:${dc};font-size:10px">${d.difficulty}</span></div>
        <div style="font-size:10px;color:var(--text2);margin-top:2px">${d.desc}</div></div>
        <button onclick="completeDrill(${i})" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:${done?'var(--green)':'var(--accent)'};color:white;font-size:10px;cursor:pointer">${done?'\u{C644}\u{B8CC}':'\u{C5F0}\u{C2B5}'}</button>
      </div></div>`;
  }).join('');
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{270B} \u{D14C}\u{D06C}\u{B2C9} \u{B4DC}\u{B9B4} (${drillCompleted.length}/${DRILLS.length})</h2>
      <button onclick="document.getElementById('drill-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">${items}</div>
  </div>`;
  document.body.appendChild(modal);
}
window.completeDrill = function(idx){
  if(!drillCompleted.includes(idx)){
    drillCompleted.push(idx);ls12Set('drillCompleted',drillCompleted);
    playSFX12('drill_done');
    if(window.app&&window.app.showToast) window.app.showToast('\u{2705} \u{B4DC}\u{B9B4} \u{C644}\u{B8CC}: '+DRILLS[idx].name,'success');
    document.getElementById('drill-modal').style.display='none';
    buildDrillUI();document.getElementById('drill-modal').style.display='flex';
  }
};

// ================ 7. SONG RECOMMENDATION ================
function buildRecommendUI(){
  const modal = document.createElement('div');
  modal.id = 'recommend-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F916} \u{ACE1} \u{CD94}\u{CC9C}</h2>
      <button onclick="document.getElementById('recommend-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="recommend-list"></div>
  </div>`;
  document.body.appendChild(modal);
  generateRecommendations();
}
function generateRecommendations(){
  if(typeof SONGS==='undefined') return;
  const played=[];
  try{Object.keys(localStorage).forEach(k=>{if(k.startsWith('best_')) played.push(k.replace('best_',''));});}catch(e){}
  const unplayed=SONGS.filter(s=>!played.includes(s.id));
  const diffOrder={easy:1,medium:2,hard:3,expert:4};
  const sorted=[...unplayed].sort((a,b)=>(diffOrder[a.difficulty]||2)-(diffOrder[b.difficulty]||2));
  const el=document.getElementById('recommend-list');if(!el) return;
  if(!sorted.length){el.innerHTML='<div style="text-align:center;color:var(--green)">\u{1F389} \u{BAA8}\u{B4E0} \u{ACE1} \u{C644}\u{C8FC}!</div>';return;}
  el.innerHTML=sorted.slice(0,8).map((s,i)=>{
    const fit=Math.max(60,100-i*5);
    const dc={easy:'var(--green)',medium:'var(--yellow)',hard:'var(--red)',expert:'var(--purple)'}[s.difficulty]||'var(--text2)';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);margin-bottom:4px">
      <span style="font-size:18px">${s.icon||'\u{1F3B5}'}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:600">${s.name}</div><div style="font-size:10px;color:${dc}">${s.difficulty||'medium'}</div></div>
      <div style="font-size:12px;font-weight:700;color:var(--accent)">${fit}%</div>
    </div>`;
  }).join('');
  playSFX12('recommend_pick');
}

// ================ 8. PRACTICE CALENDAR ================
let calViewMonth=new Date().getMonth(), calViewYear=new Date().getFullYear();
function buildCalendarUI(){
  const modal = document.createElement('div');
  modal.id = 'calendar-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F4C5} \u{C5F0}\u{C2B5} \u{CE98}\u{B9B0}\u{B354}</h2>
      <button onclick="document.getElementById('calendar-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <button onclick="changeCalMonth(-1)" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);cursor:pointer">&laquo;</button>
      <span id="cal-month-label" style="font-size:14px;font-weight:600"></span>
      <button onclick="changeCalMonth(1)" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);cursor:pointer">&raquo;</button>
    </div>
    <div id="cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:12px"></div>
    <div id="cal-stats" style="display:flex;justify-content:center;gap:16px;font-size:12px"></div>
  </div>`;
  document.body.appendChild(modal);
}
window.changeCalMonth = function(d){
  calViewMonth+=d;
  if(calViewMonth>11){calViewMonth=0;calViewYear++;}
  if(calViewMonth<0){calViewMonth=11;calViewYear--;}
  renderCalendar();
};
function renderCalendar(){
  const label=document.getElementById('cal-month-label'),grid=document.getElementById('cal-grid'),stats=document.getElementById('cal-stats');
  if(!label||!grid) return;
  label.textContent=calViewYear+'\u{B144} '+(calViewMonth+1)+'\u{C6D4}';
  const streakDays=ls12Get('streakDays',[]);
  const firstDay=new Date(calViewYear,calViewMonth,1).getDay();
  const daysInMonth=new Date(calViewYear,calViewMonth+1,0).getDate();
  const today=new Date().toISOString().slice(0,10);
  let html=['\u{C77C}','\u{C6D4}','\u{D654}','\u{C218}','\u{BAA9}','\u{AE08}','\u{D1A0}'].map(d=>`<div style="text-align:center;font-size:10px;color:var(--text2);padding:4px">${d}</div>`).join('');
  for(let i=0;i<firstDay;i++) html+='<div></div>';
  let activeDays=0;
  for(let d=1;d<=daysInMonth;d++){
    const ds=`${calViewYear}-${String(calViewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const active=streakDays.includes(ds);const isToday=ds===today;
    if(active) activeDays++;
    html+=`<div style="text-align:center;padding:6px 2px;border-radius:4px;font-size:11px;background:${active?'var(--green)':isToday?'var(--surface2)':'transparent'};color:${active?'white':isToday?'var(--accent)':'var(--text2)'};border:${isToday?'1px solid var(--accent)':'1px solid transparent'}">${d}</div>`;
  }
  grid.innerHTML=html;
  if(stats) stats.innerHTML=`<span style="color:var(--green)">\u{2705} ${activeDays}\u{C77C}</span><span style="color:var(--yellow)">${daysInMonth>0?Math.round(activeDays/daysInMonth*100):0}%</span>`;
  playSFX12('calendar_check');
}

// ================ 9. NEW SONGS (82→92) ================
function addV12Songs(){
  if(typeof SONGS==='undefined') return;
  const ids=SONGS.map(s=>s.id);
  const newSongs=[
    {id:'clair_de_lune',name:'\u{B2EC}\u{BE5B} (\u{B4DC}\u{BDA4}\u{C2DC})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'hard',icon:'\u{1F319}',color:'#6366f1',bpm:54,timeSignature:'9/8',
      notes:[{note:'Db4',time:0,dur:0.8,hand:'R'},{note:'Ab4',time:0.9,dur:0.8,hand:'R'},{note:'Bb4',time:1.8,dur:1.2,hand:'R'},{note:'Ab4',time:3.2,dur:0.8,hand:'R'},{note:'Gb4',time:4.2,dur:0.8,hand:'R'},{note:'Ab4',time:5.2,dur:1.5,hand:'R'},{note:'Db5',time:7,dur:1.5,hand:'R'},{note:'Ab3',time:0,dur:1.5,hand:'L'},{note:'Db3',time:1.8,dur:1.5,hand:'L'},{note:'Ab3',time:4.2,dur:1.5,hand:'L'},{note:'Eb3',time:7,dur:1.5,hand:'L'}]},
    {id:'turkish_march',name:'\u{D130}\u{D0A4} \u{D589}\u{C9C4}\u{ACE1} (\u{BAA8}\u{CC28}\u{B974}\u{D2B8})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'hard',icon:'\u{1F3C3}',color:'#ef4444',bpm:132,timeSignature:'2/4',
      notes:[{note:'B4',time:0,dur:0.15,hand:'R'},{note:'A4',time:0.18,dur:0.15,hand:'R'},{note:'G#4',time:0.36,dur:0.15,hand:'R'},{note:'A4',time:0.54,dur:0.3,hand:'R'},{note:'C5',time:0.9,dur:0.3,hand:'R'},{note:'E5',time:1.25,dur:0.15,hand:'R'},{note:'D5',time:1.43,dur:0.15,hand:'R'},{note:'C5',time:1.61,dur:0.15,hand:'R'},{note:'D5',time:1.79,dur:0.3,hand:'R'},{note:'F5',time:2.15,dur:0.3,hand:'R'},{note:'A3',time:0,dur:0.9,hand:'L'},{note:'A3',time:1.25,dur:0.9,hand:'L'},{note:'D3',time:2.15,dur:0.9,hand:'L'}]},
    {id:'spring_waltz',name:'\u{BD04}\u{C758} \u{C654}\u{CE20} (\u{C1FC}\u{D321})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'medium',icon:'\u{1F338}',color:'#f472b6',bpm:138,timeSignature:'3/4',
      notes:[{note:'Db5',time:0,dur:0.6,hand:'R'},{note:'C5',time:0.7,dur:0.3,hand:'R'},{note:'Db5',time:1.1,dur:0.3,hand:'R'},{note:'Eb5',time:1.5,dur:0.6,hand:'R'},{note:'Db5',time:2.3,dur:0.3,hand:'R'},{note:'C5',time:2.7,dur:0.3,hand:'R'},{note:'Ab4',time:3.1,dur:0.6,hand:'R'},{note:'Bb4',time:3.8,dur:0.3,hand:'R'},{note:'C5',time:4.2,dur:0.6,hand:'R'},{note:'Db5',time:5,dur:0.9,hand:'R'},{note:'Ab3',time:0,dur:0.9,hand:'L'},{note:'Eb3',time:1.5,dur:0.9,hand:'L'},{note:'Ab3',time:3.1,dur:0.9,hand:'L'}]},
    {id:'maple_leaf',name:'Maple Leaf Rag (\u{C870}\u{D50C}\u{B9B0})',category:'\u{C7AC}\u{C988}',difficulty:'expert',icon:'\u{1F341}',color:'#f59e0b',bpm:90,timeSignature:'2/4',
      notes:[{note:'E5',time:0,dur:0.15,hand:'R'},{note:'Eb5',time:0.18,dur:0.15,hand:'R'},{note:'E5',time:0.36,dur:0.15,hand:'R'},{note:'C5',time:0.54,dur:0.3,hand:'R'},{note:'E5',time:0.9,dur:0.15,hand:'R'},{note:'C5',time:1.08,dur:0.15,hand:'R'},{note:'A4',time:1.8,dur:0.15,hand:'R'},{note:'C5',time:1.98,dur:0.15,hand:'R'},{note:'E5',time:2.16,dur:0.3,hand:'R'},{note:'Ab3',time:0,dur:0.3,hand:'L'},{note:'Eb3',time:0.36,dur:0.3,hand:'L'},{note:'F3',time:1.8,dur:0.3,hand:'L'}]},
    {id:'doremi_song',name:'\u{B3C4}\u{B808}\u{BBF8} \u{C1A1}',category:'\u{B3D9}\u{C694}',difficulty:'easy',icon:'\u{1F3B6}',color:'#22c55e',bpm:120,timeSignature:'4/4',
      notes:[{note:'C4',time:0,dur:0.4,hand:'R'},{note:'D4',time:0.5,dur:0.4,hand:'R'},{note:'E4',time:1,dur:0.4,hand:'R'},{note:'C4',time:1.5,dur:0.4,hand:'R'},{note:'E4',time:2,dur:0.4,hand:'R'},{note:'C4',time:2.5,dur:0.4,hand:'R'},{note:'E4',time:3,dur:0.8,hand:'R'},{note:'D4',time:4,dur:0.4,hand:'R'},{note:'E4',time:4.5,dur:0.4,hand:'R'},{note:'F4',time:5,dur:0.4,hand:'R'},{note:'F4',time:5.5,dur:0.4,hand:'R'},{note:'E4',time:6,dur:0.4,hand:'R'},{note:'D4',time:6.5,dur:0.4,hand:'R'},{note:'F4',time:7,dur:0.8,hand:'R'}]},
    {id:'entertainer',name:'The Entertainer (\u{C870}\u{D50C}\u{B9B0})',category:'\u{C7AC}\u{C988}',difficulty:'hard',icon:'\u{1F3AA}',color:'#f97316',bpm:80,timeSignature:'2/4',
      notes:[{note:'D5',time:0,dur:0.15,hand:'R'},{note:'E5',time:0.18,dur:0.15,hand:'R'},{note:'C5',time:0.36,dur:0.3,hand:'R'},{note:'A4',time:0.72,dur:0.15,hand:'R'},{note:'B4',time:0.9,dur:0.3,hand:'R'},{note:'G4',time:1.26,dur:0.3,hand:'R'},{note:'D5',time:1.8,dur:0.15,hand:'R'},{note:'E5',time:1.98,dur:0.15,hand:'R'},{note:'C5',time:2.16,dur:0.3,hand:'R'},{note:'C3',time:0,dur:0.3,hand:'L'},{note:'G3',time:0.36,dur:0.3,hand:'L'},{note:'E3',time:0.72,dur:0.3,hand:'L'},{note:'C3',time:1.8,dur:0.3,hand:'L'}]},
    {id:'gondolier',name:'\u{BCA0}\u{B2C8}\u{C2A4} \u{ACE4}\u{B3CC}\u{B77C} (\u{BA58}\u{B378}\u{C2A4}\u{C874})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'medium',icon:'\u{26F5}',color:'#06b6d4',bpm:62,timeSignature:'6/8',
      notes:[{note:'A4',time:0,dur:0.5,hand:'R'},{note:'C5',time:0.6,dur:0.5,hand:'R'},{note:'E5',time:1.2,dur:0.8,hand:'R'},{note:'D5',time:2.2,dur:0.5,hand:'R'},{note:'C5',time:2.8,dur:0.5,hand:'R'},{note:'B4',time:3.4,dur:0.8,hand:'R'},{note:'A4',time:4.4,dur:0.5,hand:'R'},{note:'A3',time:0,dur:1.2,hand:'L'},{note:'E3',time:1.2,dur:1.2,hand:'L'},{note:'A3',time:2.8,dur:1.2,hand:'L'}]},
    {id:'ode_full',name:'\u{D658}\u{D76C}\u{C758} \u{C1A1} (\u{C591}\u{C190})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'medium',icon:'\u{1F389}',color:'#eab308',bpm:108,timeSignature:'4/4',
      notes:[{note:'E4',time:0,dur:0.4,hand:'R'},{note:'E4',time:0.5,dur:0.4,hand:'R'},{note:'F4',time:1,dur:0.4,hand:'R'},{note:'G4',time:1.5,dur:0.4,hand:'R'},{note:'G4',time:2,dur:0.4,hand:'R'},{note:'F4',time:2.5,dur:0.4,hand:'R'},{note:'E4',time:3,dur:0.4,hand:'R'},{note:'D4',time:3.5,dur:0.4,hand:'R'},{note:'C4',time:4,dur:0.4,hand:'R'},{note:'C4',time:4.5,dur:0.4,hand:'R'},{note:'D4',time:5,dur:0.4,hand:'R'},{note:'E4',time:5.5,dur:0.4,hand:'R'},{note:'E4',time:6,dur:0.6,hand:'R'},{note:'D4',time:6.7,dur:0.3,hand:'R'},{note:'D4',time:7,dur:0.8,hand:'R'},{note:'C3',time:0,dur:0.9,hand:'L'},{note:'G3',time:1,dur:0.9,hand:'L'},{note:'C3',time:2,dur:0.9,hand:'L'},{note:'G3',time:3,dur:0.9,hand:'L'},{note:'F3',time:4,dur:0.9,hand:'L'},{note:'C3',time:5,dur:0.9,hand:'L'},{note:'G3',time:6,dur:1.8,hand:'L'}]},
    {id:'pathetique',name:'\u{BE44}\u{CC3D} \u{C18C}\u{B098}\u{D0C0} 2\u{C545}\u{C7A5}',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'hard',icon:'\u{1F3B5}',color:'#8b5cf6',bpm:54,timeSignature:'2/4',
      notes:[{note:'Eb4',time:0,dur:0.8,hand:'R'},{note:'Bb4',time:1,dur:0.4,hand:'R'},{note:'C5',time:1.5,dur:0.4,hand:'R'},{note:'Bb4',time:2,dur:0.4,hand:'R'},{note:'Ab4',time:2.5,dur:0.8,hand:'R'},{note:'G4',time:3.5,dur:0.4,hand:'R'},{note:'Ab4',time:4,dur:0.8,hand:'R'},{note:'Bb4',time:5,dur:1.2,hand:'R'},{note:'Ab3',time:0,dur:1.5,hand:'L'},{note:'Eb3',time:2,dur:1.5,hand:'L'},{note:'Ab3',time:4,dur:1.5,hand:'L'}]},
    {id:'bumble_bee',name:'\u{BC8C}\u{C758} \u{BE44}\u{D589}',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'expert',icon:'\u{1F41D}',color:'#f59e0b',bpm:160,timeSignature:'2/4',
      notes:[{note:'E5',time:0,dur:0.1,hand:'R'},{note:'Eb5',time:0.12,dur:0.1,hand:'R'},{note:'D5',time:0.24,dur:0.1,hand:'R'},{note:'Db5',time:0.36,dur:0.1,hand:'R'},{note:'C5',time:0.48,dur:0.1,hand:'R'},{note:'B4',time:0.6,dur:0.1,hand:'R'},{note:'Bb4',time:0.72,dur:0.1,hand:'R'},{note:'A4',time:0.84,dur:0.1,hand:'R'},{note:'Ab4',time:0.96,dur:0.1,hand:'R'},{note:'G4',time:1.08,dur:0.1,hand:'R'},{note:'F#4',time:1.2,dur:0.1,hand:'R'},{note:'F4',time:1.32,dur:0.1,hand:'R'},{note:'E4',time:1.44,dur:0.3,hand:'R'},{note:'A3',time:0,dur:0.9,hand:'L'},{note:'E3',time:0.96,dur:0.9,hand:'L'}]}
  ];
  newSongs.forEach(s=>{if(!ids.includes(s.id)) SONGS.push(s);});
}

// ================ 10. QUIZ v3 ================
const QUIZ_V3 = [
  {q:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529}\u{C774}\u{B780}?', o:['\u{C545}\u{BCF4}\u{B97C} \u{BCF4}\u{ACE0} \u{BC14}\u{B85C} \u{C5F0}\u{C8FC}','\u{AE00}\u{C528} \u{C77D}\u{AE30}','\u{B9AC}\u{B4EC} \u{B4E3}\u{AE30}','\u{C18C}\u{B9AC} \u{AD6C}\u{BCC4}'], a:0},
  {q:'\u{D53C}\u{C544}\u{B178} \u{D398}\u{B2EC} 3\u{AC1C}\u{C778} \u{AC83}\u{C740}?', o:['\u{C18C}\u{C2A4}\u{D14C}\u{B204}\u{D1A0}','\u{B2E4}\u{B108}\u{D398}\u{B2EC}','\u{C6B0}\u{B098}\u{CF54}\u{B974}\u{B2E4}','\u{B4D3}\u{D398}\u{B2EC}'], a:2},
  {q:'\u{B4DC}\u{BDA4}\u{C2DC} &quot;\u{B2EC}\u{BE5B}&quot; \u{BAA8}\u{C74C}\u{C9D1}\u{C740}?', o:['\u{D310}\u{D0C0}\u{C9C0}','\u{C5D0}\u{D280}\u{B4DC}','\u{BCA0}\u{B974}\u{AC00}\u{B9C8}\u{C2A4}\u{D06C}','\u{C804}\u{C8FC}\u{ACE1}'], a:3},
  {q:'\u{BD04}\u{C758} \u{C654}\u{CE20} \u{C791}\u{ACE1}\u{AC00}\u{B294}?', o:['\u{BCA0}\u{D1A0}\u{BCA4}','\u{BAA8}\u{CC28}\u{B974}\u{D2B8}','\u{C1FC}\u{D321}','\u{B9AC}\u{C2A4}\u{D2B8}'], a:2},
  {q:'BPM 60 = 1\u{BD84}\u{C5D0} \u{BA87} \u{BC15}?', o:['30','60','120','90'], a:1},
  {q:'\u{C544}\u{B974}\u{D398}\u{C9C0}\u{C624}\u{B780}?', o:['\u{D654}\u{C74C} \u{B3D9}\u{C2DC} \u{CE58}\u{AE30}','\u{D654}\u{C74C} \u{C21C}\u{CC28}\u{C801} \u{C5F0}\u{C8FC}','\u{C74C} \u{B192}\u{C774}\u{AE30}','\u{AD34}\u{BC1C} \u{B204}\u{B974}\u{AE30}'], a:1},
  {q:'\u{BC8C}\u{C758} \u{BE44}\u{D589} \u{C791}\u{ACE1}\u{AC00}\u{B294}?', o:['\u{BAA8}\u{CC28}\u{B974}\u{D2B8}','\u{B9BC}\u{C2A4}\u{D0A4}\u{CF54}\u{B974}\u{C0AC}\u{CF54}\u{D504}','\u{C1FC}\u{D321}','\u{CC28}\u{C774}\u{CF54}\u{D504}\u{C2A4}\u{D0A4}'], a:1},
  {q:'\u{C7AC}\u{C988}\u{C758} &quot;\u{C2A4}\u{C719}&quot;\u{C774}\u{B780}?', o:['\u{BC15}\u{C790}\u{C758} \u{B9AC}\u{B4EC}\u{AC10}','\u{C790}\u{C720} \u{AD6C}\u{C131}','\u{BE60}\u{B978} \u{D15C}\u{D3EC}','\u{C544}\u{CE74}\u{D3A0}\u{B77C}'], a:0},
  {q:'\u{C624}\u{C120}\u{BCF4} \u{C904} \u{C218}\u{B294}?', o:['3','4','5','6'], a:2},
  {q:'The Entertainer \u{C791}\u{ACE1}\u{AC00}\u{B294}?', o:['\u{C870}\u{D50C}\u{B9B0}','\u{AC70}\u{C288}\u{C708}','\u{C55E}\u{C2A4}\u{D2B8}\u{B871}','\u{D5E8}\u{CE21}'], a:0},
  {q:'\u{D53C}\u{C544}\u{B178} \u{AC74}\u{BC18} \u{CD1D} \u{C218}\u{B294}?', o:['76','88','92','100'], a:1},
  {q:'\u{C810}\u{C74C}\u{D45C}\u{B294} \u{C6D0}\u{B798}\u{C758} \u{BA87} \u{BC30}?', o:['1.25','1.5','2','3'], a:1},
  {q:'\u{BE44}\u{CC3D} \u{C18C}\u{B098}\u{D0C0} \u{C791}\u{ACE1}\u{AC00}\u{B294}?', o:['\u{BAA8}\u{CC28}\u{B974}\u{D2B8}','\u{BCA0}\u{D1A0}\u{BCA4}','\u{C1FC}\u{D321}','\u{D558}\u{C774}\u{B4E0}'], a:1},
  {q:'\u{D130}\u{D0A4} \u{D589}\u{C9C4}\u{ACE1} \u{BC15}\u{C790}\u{B294}?', o:['3/4','4/4','2/4','6/8'], a:2},
  {q:'\u{D53C}\u{C544}\u{B178} \u{AC80}\u{C740}\u{AC74}\u{C740} \u{D770}\u{AC74}\u{C758} \u{BA87} \u{BD84}\u{C758} \u{BA87}?', o:['2/3','3/5','1/2','5/8'], a:0}
];
let quiz3Score=0,quiz3Idx=0,quiz3Active=false;
function buildQuizV3UI(){
  const modal = document.createElement('div');
  modal.id = 'quiz3-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F393} \u{D000}\u{C988} v3</h2>
      <button onclick="document.getElementById('quiz3-modal').style.display='none';quiz3Active=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="quiz3-area"><p style="font-size:12px;color:var(--text2);margin-bottom:16px">15\u{BB38}\u{D56D} \u{C2EC}\u{D654} \u{D000}\u{C988}</p>
      <button onclick="startQuiz3()" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">\u{C2DC}\u{C791}</button></div>
  </div>`;
  document.body.appendChild(modal);
}
window.startQuiz3 = function(){quiz3Score=0;quiz3Idx=0;quiz3Active=true;showQuiz3Q();};
function showQuiz3Q(){
  if(quiz3Idx>=QUIZ_V3.length){
    const pct=Math.round(quiz3Score/QUIZ_V3.length*100);
    const grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    document.getElementById('quiz3-area').innerHTML=`<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">${grade}</div><div>${quiz3Score}/${QUIZ_V3.length} (${pct}%)</div><button onclick="startQuiz3()" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">\u{B2E4}\u{C2DC}</button>`;
    quiz3Active=false;ls12Set('quiz3Best',Math.max(ls12Get('quiz3Best',0),quiz3Score));return;
  }
  const q=QUIZ_V3[quiz3Idx];
  document.getElementById('quiz3-area').innerHTML=`<div style="font-size:11px;color:var(--text2);margin-bottom:8px">${quiz3Idx+1}/${QUIZ_V3.length}</div>
    <div style="font-size:14px;font-weight:600;margin-bottom:16px">${q.q}</div>
    <div style="display:flex;flex-direction:column;gap:8px">${q.o.map((opt,i)=>
      `<button onclick="answerQuiz3(${i})" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">${opt}</button>`
    ).join('')}</div>`;
}
window.answerQuiz3 = function(idx){
  if(!quiz3Active) return;
  if(idx===QUIZ_V3[quiz3Idx].a){quiz3Score++;playSFX12('quiz3_correct');}else playSFX12('sight_wrong');
  quiz3Idx++;setTimeout(showQuiz3Q,300);
};

// ================ 11. ACHIEVEMENTS ================
const V12_ACH = [
  {id:'sight_reader',name:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B354}',desc:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529} 10\u{BB38}\u{C81C}',icon:'\u{1F3BC}',check:()=>ls12Get('sightTotal',0)>=10},
  {id:'sight_master',name:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{C5F0}\u{C18D} 10 \u{C815}\u{B2F5}',icon:'\u{1F3AF}',check:()=>ls12Get('sightBestStreak',0)>=10},
  {id:'rhythm_student',name:'\u{B9AC}\u{B4EC} \u{D559}\u{C0DD}',desc:'3\u{D328}\u{D134} \u{C5F0}\u{C2B5}',icon:'\u{1F941}',check:()=>ls12Get('rhythmPlayed',0)>=3},
  {id:'rhythm_master',name:'\u{B9AC}\u{B4EC} \u{B9C8}\u{C2A4}\u{D130}',desc:'10\u{D328}\u{D134} \u{C5F0}\u{C2B5}',icon:'\u{1F3B6}',check:()=>ls12Get('rhythmPlayed',0)>=10},
  {id:'history_reader',name:'\u{C74C}\u{C545}\u{C0AC} \u{D559}\u{C0DD}',desc:'6\u{C2DC}\u{B300} \u{C77D}\u{AE30}',icon:'\u{1F3DB}\u{FE0F}',check:()=>historyRead.length>=6},
  {id:'history_master',name:'\u{C74C}\u{C545}\u{C0AC} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{C804}\u{BD80} \u{C77D}\u{AE30}',icon:'\u{1F4DA}',check:()=>historyRead.length>=MUSIC_ERAS.length},
  {id:'streak_7',name:'7\u{C77C} \u{C5F0}\u{C18D}',desc:'7\u{C77C} \u{C5F0}\u{C2B5}',icon:'\u{1F525}',check:()=>ls12Get('bestStreak',0)>=7},
  {id:'performer',name:'\u{D53C}\u{C544}\u{B2C8}\u{C2A4}\u{D2B8}',desc:'\u{ACF5}\u{C5F0} 3\u{D68C}',icon:'\u{1F3AD}',check:()=>ls12Get('performCount',0)>=3},
  {id:'drill_student',name:'\u{D14C}\u{D06C}\u{B2C9} \u{D559}\u{C0DD}',desc:'\u{B4DC}\u{B9B4} 4\u{AC1C}',icon:'\u{270B}',check:()=>drillCompleted.length>=4},
  {id:'drill_master',name:'\u{D14C}\u{D06C}\u{B2C9} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{B4DC}\u{B9B4} \u{C804}\u{BD80}',icon:'\u{1F3C6}',check:()=>drillCompleted.length>=DRILLS.length},
  {id:'quiz3_pass',name:'\u{D000}\u{C988}v3 \u{D569}\u{ACA9}',desc:'60% \u{C774}\u{C0C1}',icon:'\u{1F393}',check:()=>ls12Get('quiz3Best',0)>=9},
  {id:'v12_explorer',name:'v12 \u{D0D0}\u{D5D8}\u{AC00}',desc:'5\u{AE30}\u{B2A5} \u{C0AC}\u{C6A9}',icon:'\u{1F680}',check:()=>{
    let c=0;if(ls12Get('sightTotal',0)>0)c++;if(ls12Get('rhythmPlayed',0)>0)c++;if(historyRead.length>0)c++;if(ls12Get('performCount',0)>0)c++;if(drillCompleted.length>0)c++;if(ls12Get('quiz3Best',0)>0)c++;return c>=5;}}
];
function checkV12Achievements(){
  let u=ls12Get('unlockedAch',[]);
  V12_ACH.forEach(a=>{
    if(!u.includes(a.id)&&a.check()){u.push(a.id);ls12Set('unlockedAch',u);
      if(window.app&&window.app.showToast) window.app.showToast(`\u{1F3C6} \u{C5C5}\u{C801}: ${a.icon} ${a.name}`,'achievement');}
  });
}
function injectV12Achievements(){
  const grid=document.querySelector('.achievement-grid');if(!grid) return;
  const u=ls12Get('unlockedAch',[]);
  V12_ACH.forEach(a=>{
    const el=document.createElement('div');
    el.className='achievement'+(u.includes(a.id)?' unlocked':'');
    el.style.cssText='padding:8px;text-align:center;border-radius:8px;border:1px solid var(--border);background:var(--surface2)';
    el.innerHTML=`<div class="achievement-icon">${a.icon}</div><div>${a.name}</div><div style="font-size:8px;margin-top:2px">${a.desc}</div>`;
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTIONS & SHORTCUTS ================
function injectV12QuickActions(){
  const tabSongs=document.getElementById('tab-songs');if(!tabSongs) return;
  const bar=document.createElement('div');
  bar.className='v12-quick-actions';
  bar.style.cssText='display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  [{label:'\u{1F3BC} \u{C2DC}\u{BCF4}\u{B9AC}\u{B529}',fn:()=>document.getElementById('sight-modal').style.display='flex'},
   {label:'\u{1F941} \u{B9AC}\u{B4EC}',fn:()=>document.getElementById('rhythm-modal').style.display='flex'},
   {label:'\u{1F3DB}\u{FE0F} \u{C74C}\u{C545}\u{C0AC}',fn:()=>{document.getElementById('history-modal').style.display='flex';playSFX12('history_open');}},
   {label:'\u{1F525} \u{C2A4}\u{D2B8}\u{B9AD}',fn:()=>{document.getElementById('streak-modal').style.display='flex';updateStreakContent();}},
   {label:'\u{1F3AD} \u{ACF5}\u{C5F0}',fn:()=>document.getElementById('perform-modal').style.display='flex'},
   {label:'\u{270B} \u{B4DC}\u{B9B4}',fn:()=>document.getElementById('drill-modal').style.display='flex'},
   {label:'\u{1F916} \u{CD94}\u{CC9C}',fn:()=>{document.getElementById('recommend-modal').style.display='flex';generateRecommendations();}},
   {label:'\u{1F4C5} \u{CE98}\u{B9B0}\u{B354}',fn:()=>{document.getElementById('calendar-modal').style.display='flex';renderCalendar();}},
   {label:'\u{1F393} \u{D000}\u{C988}v3',fn:()=>document.getElementById('quiz3-modal').style.display='flex'}
  ].forEach(a=>{
    const btn=document.createElement('button');
    btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap';
    btn.textContent=a.label;btn.addEventListener('click',a.fn);bar.appendChild(btn);
  });
  const v11bar=tabSongs.querySelector('.v11-quick-actions');
  if(v11bar) v11bar.parentNode.insertBefore(bar, v11bar.nextSibling);
  else{const fb=tabSongs.querySelector('.filter-bar');if(fb) fb.parentNode.insertBefore(bar,fb);else tabSongs.insertBefore(bar,tabSongs.firstChild);}
}
function setupV12Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key){
      case 'S':if(!e.ctrlKey){e.preventDefault();document.getElementById('sight-modal').style.display='flex';}break;
      case 'T':e.preventDefault();document.getElementById('rhythm-modal').style.display='flex';break;
      case 'M':e.preventDefault();document.getElementById('history-modal').style.display='flex';break;
      case 'K':e.preventDefault();document.getElementById('streak-modal').style.display='flex';updateStreakContent();break;
      case 'F':e.preventDefault();document.getElementById('perform-modal').style.display='flex';break;
      case 'D':e.preventDefault();document.getElementById('drill-modal').style.display='flex';break;
      case 'N':e.preventDefault();document.getElementById('recommend-modal').style.display='flex';generateRecommendations();break;
      case 'L':e.preventDefault();document.getElementById('calendar-modal').style.display='flex';renderCalendar();break;
    }
  });
}

// ================ INIT ================
function initV12(){
  addV12Songs();
  buildSightReadingUI();
  buildRhythmUI();
  buildHistoryUI();
  buildStreakUI();
  buildPerformanceUI();
  buildDrillUI();
  buildRecommendUI();
  buildCalendarUI();
  buildQuizV3UI();
  injectV12QuickActions();
  injectV12Achievements();
  setupV12Shortcuts();
  setInterval(checkV12Achievements, 15000);
  const today=new Date().toISOString().slice(0,10);
  let sd=ls12Get('streakDays',[]);
  if(!sd.includes(today)){sd.push(today);ls12Set('streakDays',sd);}
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(initV12,1500));
else setTimeout(initV12,1500);
})();
