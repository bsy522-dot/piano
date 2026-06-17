// Piano Master v13 Patch Module
// Chord Dictionary Canvas, Scale Trainer, Metronome Pro, Duet Mode 6,
// Music Theory 12 Lessons, Daily Challenge, Progress Report Canvas,
// Practice Journal, 10 Songs (92→102), Quiz v4 15Q (45→60),
// 12 Achievements (84→96), SFX 12, Keyboard 8
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
    case 'chord_play':
      o.type='triangle';o.frequency.setValueAtTime(523,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      [659,784].forEach((f,i)=>{setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(f,sfx13.currentTime);gg.gain.setValueAtTime(0.07,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.15);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.15);},(i+1)*80);});return;
    case 'scale_note':
      o.type='sine';o.frequency.setValueAtTime(440+Math.random()*200,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'scale_done':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(1047,t+0.2);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'metro_tick':
      o.type='square';o.frequency.setValueAtTime(1500,t);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.03);
      o.start(t);o.stop(t+0.03);break;
    case 'metro_accent':
      o.type='square';o.frequency.setValueAtTime(2000,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
      o.start(t);o.stop(t+0.04);break;
    case 'duet_start':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.2);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'theory_done':
      o.type='triangle';o.frequency.setValueAtTime(659,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(988,sfx13.currentTime);gg.gain.setValueAtTime(0.08,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.15);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.15);},130);return;
    case 'challenge_done':
      [523,659,784,1047].forEach((f,i)=>{setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(f,sfx13.currentTime);gg.gain.setValueAtTime(0.1,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.15);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.15);},i*100);});return;
    case 'report_view':
      o.type='sine';o.frequency.setValueAtTime(330,t);o.frequency.linearRampToValueAtTime(440,t+0.15);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);break;
    case 'journal_save':
      o.type='triangle';o.frequency.setValueAtTime(784,t);
      g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);break;
    case 'quiz4_correct':
      o.type='triangle';o.frequency.setValueAtTime(880,t);o.frequency.linearRampToValueAtTime(1175,t+0.1);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'v13_achieve':
      o.type='triangle';o.frequency.setValueAtTime(698,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      o.start(t);o.stop(t+0.1);
      setTimeout(()=>{if(!sfx13)return;const gg=sfx13.createGain(),oo=sfx13.createOscillator();gg.connect(sfx13.destination);oo.connect(gg);oo.type='triangle';oo.frequency.setValueAtTime(1047,sfx13.currentTime);gg.gain.setValueAtTime(0.1,sfx13.currentTime);gg.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.2);oo.start(sfx13.currentTime);oo.stop(sfx13.currentTime+0.2);},120);return;
  }
}

// ================ 1. CHORD DICTIONARY Canvas ================
const CHORD_DB = [
  {name:'C Major',notes:['C','E','G'],type:'major',root:'C'},
  {name:'D Major',notes:['D','F#','A'],type:'major',root:'D'},
  {name:'E Major',notes:['E','G#','B'],type:'major',root:'E'},
  {name:'F Major',notes:['F','A','C'],type:'major',root:'F'},
  {name:'G Major',notes:['G','B','D'],type:'major',root:'G'},
  {name:'A Major',notes:['A','C#','E'],type:'major',root:'A'},
  {name:'Bb Major',notes:['Bb','D','F'],type:'major',root:'Bb'},
  {name:'Eb Major',notes:['Eb','G','Bb'],type:'major',root:'Eb'},
  {name:'C minor',notes:['C','Eb','G'],type:'minor',root:'C'},
  {name:'D minor',notes:['D','F','A'],type:'minor',root:'D'},
  {name:'E minor',notes:['E','G','B'],type:'minor',root:'E'},
  {name:'F minor',notes:['F','Ab','C'],type:'minor',root:'F'},
  {name:'G minor',notes:['G','Bb','D'],type:'minor',root:'G'},
  {name:'A minor',notes:['A','C','E'],type:'minor',root:'A'},
  {name:'B minor',notes:['B','D','F#'],type:'minor',root:'B'},
  {name:'C7',notes:['C','E','G','Bb'],type:'7th',root:'C'},
  {name:'G7',notes:['G','B','D','F'],type:'7th',root:'G'},
  {name:'D7',notes:['D','F#','A','C'],type:'7th',root:'D'},
  {name:'F7',notes:['F','A','C','Eb'],type:'7th',root:'F'},
  {name:'Cmaj7',notes:['C','E','G','B'],type:'maj7',root:'C'},
  {name:'Am7',notes:['A','C','E','G'],type:'m7',root:'A'},
  {name:'Dm7',notes:['D','F','A','C'],type:'m7',root:'D'},
  {name:'Csus4',notes:['C','F','G'],type:'sus',root:'C'},
  {name:'Gsus4',notes:['G','C','D'],type:'sus',root:'G'}
];
const ALL_KEYS_LABEL = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const IS_BLACK = [0,1,0,1,0,0,1,0,1,0,1,0];
let chordFilter = 'all';

function drawChordCanvas(canvas, chord){
  const ctx=canvas.getContext('2d');
  const w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  const startX=20, keyW=28, blackW=18, whiteH=90, blackH=58;
  const whiteKeys=[];const blackKeys=[];
  let x=startX;
  for(let i=0;i<12;i++){
    if(IS_BLACK[i]){
      blackKeys.push({x:x-blackW/2, note:ALL_KEYS_LABEL[i], idx:i});
    } else {
      whiteKeys.push({x:x, note:ALL_KEYS_LABEL[i], idx:i});
      x+=keyW;
    }
  }
  whiteKeys.forEach(k=>{
    const active=chord.notes.includes(k.note);
    ctx.fillStyle=active?'#4a7dff':'#f0f0f0';
    ctx.fillRect(k.x,10,keyW-2,whiteH);
    ctx.strokeStyle='#999';ctx.strokeRect(k.x,10,keyW-2,whiteH);
    if(active){ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(k.note,k.x+keyW/2-1,whiteH);ctx.textAlign='start';}
  });
  blackKeys.forEach(k=>{
    const active=chord.notes.includes(k.note);
    ctx.fillStyle=active?'#6d9bff':'#222';
    ctx.fillRect(k.x,10,blackW,blackH);
    if(active){ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(k.note,k.x+blackW/2,blackH+6);ctx.textAlign='start';}
  });
  ctx.fillStyle='#e8ecf4';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText(chord.name,w/2,h-12);
  ctx.textAlign='start';
  ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
  ctx.fillText(chord.notes.join(' - '),startX,h-12);
}

function playChordAudio(chord){
  if(!sfx13) return;
  if(sfx13.state==='suspended') sfx13.resume();
  const noteFreqs={'C':261.63,'C#':277.18,'Db':277.18,'D':293.66,'D#':311.13,'Eb':311.13,'E':329.63,'F':349.23,'F#':369.99,'Gb':369.99,'G':392.00,'G#':415.30,'Ab':415.30,'A':440.00,'A#':466.16,'Bb':466.16,'B':493.88};
  chord.notes.forEach((n,i)=>{
    const freq=noteFreqs[n];if(!freq) return;
    setTimeout(()=>{
      if(!sfx13) return;
      const g=sfx13.createGain(),o=sfx13.createOscillator();
      g.connect(sfx13.destination);o.connect(g);
      o.type='triangle';o.frequency.setValueAtTime(freq,sfx13.currentTime);
      g.gain.setValueAtTime(0.08,sfx13.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,sfx13.currentTime+0.8);
      o.start(sfx13.currentTime);o.stop(sfx13.currentTime+0.8);
    },i*60);
  });
}

function buildChordDictUI(){
  const modal=document.createElement('div');
  modal.id='chord-dict-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3B9} \u{CF54}\u{B4DC} \u{C0AC}\u{C804}</h2>
      <button onclick="document.getElementById('chord-dict-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="chord-filter-bar" style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap"></div>
    <canvas id="chord-canvas" width="280" height="130" style="width:100%;max-width:280px;border-radius:8px;border:1px solid var(--border);margin:0 auto 12px;display:block"></canvas>
    <div id="chord-list" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px"></div>
  </div>`;
  document.body.appendChild(modal);
  const filterBar=modal.querySelector('#chord-filter-bar');
  [{label:'\u{C804}\u{BD80}',val:'all'},{label:'Major',val:'major'},{label:'minor',val:'minor'},{label:'7th',val:'7th'},{label:'maj7',val:'maj7'},{label:'m7',val:'m7'},{label:'sus',val:'sus'}].forEach(f=>{
    const btn=document.createElement('button');
    btn.style.cssText='padding:4px 10px;border-radius:12px;border:1px solid var(--border);background:'+(chordFilter===f.val?'var(--accent)':'none')+';color:'+(chordFilter===f.val?'white':'var(--text2)')+';font-size:10px;cursor:pointer';
    btn.textContent=f.label;
    btn.addEventListener('click',()=>{chordFilter=f.val;renderChordList();filterBar.querySelectorAll('button').forEach((b,i)=>{const v=[...filterBar.children][i];b.style.background=f.val===(['all','major','minor','7th','maj7','m7','sus'][i])?'var(--accent)':'none';b.style.color=f.val===(['all','major','minor','7th','maj7','m7','sus'][i])?'white':'var(--text2)';});});
    filterBar.appendChild(btn);
  });
  renderChordList();
}
function renderChordList(){
  const list=document.getElementById('chord-list');if(!list) return;
  const filtered=chordFilter==='all'?CHORD_DB:CHORD_DB.filter(c=>c.type===chordFilter);
  list.innerHTML=filtered.map((c,i)=>`<button onclick="selectChord(${CHORD_DB.indexOf(c)})" style="padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;text-align:center"><div style="font-weight:600">${c.name}</div><div style="font-size:9px;color:var(--text2);margin-top:2px">${c.notes.join(' ')}</div></button>`).join('');
  if(filtered.length>0) selectChord(CHORD_DB.indexOf(filtered[0]));
}
window.selectChord=function(idx){
  const chord=CHORD_DB[idx];if(!chord) return;
  const canvas=document.getElementById('chord-canvas');
  if(canvas) drawChordCanvas(canvas,chord);
  playChordAudio(chord);
  ls13Set('chordsViewed',(ls13Get('chordsViewed',0))+1);
};

// ================ 2. SCALE TRAINER ================
const SCALES = [
  {name:'C \u{C7A5}\u{C870}',notes:['C4','D4','E4','F4','G4','A4','B4','C5'],key:'C',type:'major'},
  {name:'G \u{C7A5}\u{C870}',notes:['G4','A4','B4','C5','D5','E5','F#5','G5'],key:'G',type:'major'},
  {name:'D \u{C7A5}\u{C870}',notes:['D4','E4','F#4','G4','A4','B4','C#5','D5'],key:'D',type:'major'},
  {name:'F \u{C7A5}\u{C870}',notes:['F4','G4','A4','Bb4','C5','D5','E5','F5'],key:'F',type:'major'},
  {name:'Bb \u{C7A5}\u{C870}',notes:['Bb3','C4','D4','Eb4','F4','G4','A4','Bb4'],key:'Bb',type:'major'},
  {name:'Eb \u{C7A5}\u{C870}',notes:['Eb4','F4','G4','Ab4','Bb4','C5','D5','Eb5'],key:'Eb',type:'major'},
  {name:'A \u{B2E8}\u{C870}',notes:['A3','B3','C4','D4','E4','F4','G4','A4'],key:'Am',type:'minor'},
  {name:'E \u{B2E8}\u{C870}',notes:['E4','F#4','G4','A4','B4','C5','D5','E5'],key:'Em',type:'minor'},
  {name:'D \u{B2E8}\u{C870}',notes:['D4','E4','F4','G4','A4','Bb4','C5','D5'],key:'Dm',type:'minor'},
  {name:'G \u{B2E8}\u{C870}',notes:['G4','A4','Bb4','C5','D5','Eb5','F5','G5'],key:'Gm',type:'minor'},
  {name:'C \u{B2E8}\u{C870}',notes:['C4','D4','Eb4','F4','G4','Ab4','Bb4','C5'],key:'Cm',type:'minor'},
  {name:'F \u{B2E8}\u{C870}',notes:['F4','G4','Ab4','Bb4','C5','Db5','Eb5','F5'],key:'Fm',type:'minor'}
];
let scaleIdx=0,scaleStep=0,scaleDir='up',scalePracticing=false,scaleTimer=null;

function buildScaleUI(){
  const modal=document.createElement('div');
  modal.id='scale-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let listHtml=SCALES.map((s,i)=>{
    const c=s.type==='major'?'var(--green)':'var(--purple)';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" onclick="startScalePractice(${i})">
      <span style="font-size:16px">${s.type==='major'?'\u{1F3B5}':'\u{1F3B6}'}</span>
      <div style="flex:1"><div style="font-size:12px;font-weight:600">${s.name}</div><div style="font-size:9px;color:var(--text2)">${s.notes.join(' \u{2192} ')}</div></div>
      <span style="font-size:10px;color:${c};font-weight:600">${s.type==='major'?'\u{C7A5}\u{C870}':'\u{B2E8}\u{C870}'}</span>
    </div>`;
  }).join('');
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3B9} \u{C2A4}\u{CF00}\u{C77C} \u{D2B8}\u{B808}\u{C774}\u{B108}</h2>
      <button onclick="document.getElementById('scale-modal').style.display='none';stopScalePractice()" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:8px">\u{C2A4}\u{CF00}\u{C77C}\u{C744} \u{C120}\u{D0DD}\u{D558}\u{BA74} \u{C0C1}\u{D589}+\u{D558}\u{D589} \u{C74C}\u{D45C}\u{B97C} \u{C21C}\u{C11C}\u{B300}\u{B85C} \u{C7AC}\u{C0DD}\u{D569}\u{B2C8}\u{B2E4}</p>
    <div id="scale-progress" style="font-size:13px;text-align:center;margin-bottom:10px;min-height:20px;color:var(--accent)"></div>
    <div style="display:flex;flex-direction:column;gap:6px">${listHtml}</div>
  </div>`;
  document.body.appendChild(modal);
}

window.startScalePractice=function(idx){
  if(scalePracticing) stopScalePractice();
  scaleIdx=idx;scaleStep=0;scaleDir='up';scalePracticing=true;
  const scale=SCALES[idx];
  const allNotes=[...scale.notes,...[...scale.notes].reverse().slice(1)];
  const prog=document.getElementById('scale-progress');
  if(prog) prog.innerHTML=`\u{1F3B5} ${scale.name} \u{C7AC}\u{C0DD} \u{C911}... (${scaleStep+1}/${allNotes.length})`;
  ls13Set('scalesPracticed',(ls13Get('scalesPracticed',0))+1);
  playScaleSequence(allNotes, 0);
};

function playScaleSequence(notes, idx){
  if(!scalePracticing||idx>=notes.length){
    scalePracticing=false;
    const prog=document.getElementById('scale-progress');
    if(prog) prog.innerHTML='<span style="color:var(--green)">\u{2705} \u{C644}\u{B8CC}!</span>';
    playSFX13('scale_done');
    return;
  }
  const prog=document.getElementById('scale-progress');
  if(prog) prog.innerHTML=`\u{1F3B5} ${SCALES[scaleIdx].name} (${idx+1}/${notes.length}) - <span style="color:var(--yellow)">${notes[idx]}</span>`;
  playNoteAudio(notes[idx]);
  playSFX13('scale_note');
  scaleTimer=setTimeout(()=>playScaleSequence(notes,idx+1),350);
}

function playNoteAudio(noteName){
  if(!sfx13) return;
  const noteMap={'C3':130.81,'D3':146.83,'Eb3':155.56,'E3':164.81,'F3':174.61,'F#3':185.00,'G3':196.00,'Ab3':207.65,'A3':220.00,'Bb3':233.08,'B3':246.94,'C4':261.63,'C#4':277.18,'Db4':277.18,'D4':293.66,'D#4':311.13,'Eb4':311.13,'E4':329.63,'F4':349.23,'F#4':369.99,'G4':392.00,'G#4':415.30,'Ab4':415.30,'A4':440.00,'A#4':466.16,'Bb4':466.16,'B4':493.88,'C5':523.25,'C#5':554.37,'Db5':554.37,'D5':587.33,'D#5':622.25,'Eb5':622.25,'E5':659.26,'F5':698.46,'F#5':739.99,'G5':783.99,'Ab5':830.61};
  const freq=noteMap[noteName];if(!freq) return;
  const t=sfx13.currentTime;
  const g=sfx13.createGain(),o=sfx13.createOscillator();
  g.connect(sfx13.destination);o.connect(g);
  o.type='triangle';o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
  o.start(t);o.stop(t+0.3);
}

function stopScalePractice(){scalePracticing=false;if(scaleTimer){clearTimeout(scaleTimer);scaleTimer=null;}}

// ================ 3. METRONOME PRO ================
let metroBpm=100,metroRunning=false,metroInterval=null,metroBeat=0,metroSubdiv=1,metroBeatsPerMeasure=4;

function buildMetronomeUI(){
  const modal=document.createElement('div');
  modal.id='metro-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,360px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="font-size:16px;color:var(--accent)">\u{23F1}\u{FE0F} \u{BA54}\u{D2B8}\u{B85C}\u{B188} Pro</h2>
      <button onclick="stopMetro();document.getElementById('metro-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="font-size:48px;font-weight:900;color:var(--accent);margin:16px 0" id="metro-bpm-display">${metroBpm}</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:12px">BPM</div>
    <input type="range" min="40" max="240" value="${metroBpm}" id="metro-slider" style="width:80%;margin-bottom:16px" oninput="updateMetroBpm(this.value)">
    <div id="metro-beat-display" style="display:flex;justify-content:center;gap:8px;margin-bottom:16px"></div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
      <div style="font-size:11px;color:var(--text2)">\u{BC15}\u{C790}:</div>
      ${[2,3,4,6].map(b=>`<button onclick="setMetroBeats(${b})" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:${metroBeatsPerMeasure===b?'var(--accent)':'var(--surface2)'};color:${metroBeatsPerMeasure===b?'white':'var(--text)'};font-size:11px;cursor:pointer" class="metro-beat-btn">${b}/4</button>`).join('')}
    </div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
      <div style="font-size:11px;color:var(--text2)">\u{C138}\u{BD84}:</div>
      ${[1,2,3,4].map(s=>`<button onclick="setMetroSubdiv(${s})" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:${metroSubdiv===s?'var(--accent)':'var(--surface2)'};color:${metroSubdiv===s?'white':'var(--text)'};font-size:11px;cursor:pointer" class="metro-subdiv-btn">${s===1?'\u{C5C6}\u{C74C}':s+'x'}</button>`).join('')}
    </div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px">
      ${[60,80,100,120,140,160].map(b=>`<button onclick="updateMetroBpm(${b})" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:10px;cursor:pointer">${b}</button>`).join('')}
    </div>
    <button id="metro-toggle" onclick="toggleMetro()" style="padding:12px 32px;border-radius:12px;border:none;background:var(--accent);color:white;font-size:16px;font-weight:700;cursor:pointer">\u{25B6} \u{C2DC}\u{C791}</button>
  </div>`;
  document.body.appendChild(modal);
  renderMetroBeatDots();
}

window.updateMetroBpm=function(v){
  metroBpm=parseInt(v);
  const d=document.getElementById('metro-bpm-display');if(d) d.textContent=metroBpm;
  const s=document.getElementById('metro-slider');if(s) s.value=metroBpm;
  if(metroRunning){stopMetro();startMetro();}
};
window.setMetroBeats=function(b){
  metroBeatsPerMeasure=b;renderMetroBeatDots();
  document.querySelectorAll('.metro-beat-btn').forEach(btn=>{btn.style.background=btn.textContent===b+'/4'?'var(--accent)':'var(--surface2)';btn.style.color=btn.textContent===b+'/4'?'white':'var(--text)';});
  if(metroRunning){stopMetro();startMetro();}
};
window.setMetroSubdiv=function(s){
  metroSubdiv=s;
  document.querySelectorAll('.metro-subdiv-btn').forEach(btn=>{const v=btn.textContent;const match=(s===1&&v==='\u{C5C6}\u{C74C}')||(v===s+'x');btn.style.background=match?'var(--accent)':'var(--surface2)';btn.style.color=match?'white':'var(--text)';});
  if(metroRunning){stopMetro();startMetro();}
};

function renderMetroBeatDots(){
  const d=document.getElementById('metro-beat-display');if(!d) return;
  d.innerHTML='';
  for(let i=0;i<metroBeatsPerMeasure;i++){
    const dot=document.createElement('div');
    dot.style.cssText='width:16px;height:16px;border-radius:50%;border:2px solid var(--border);background:var(--surface2);transition:background 0.1s';
    dot.id='metro-dot-'+i;
    d.appendChild(dot);
  }
}

window.toggleMetro=function(){
  if(metroRunning) stopMetro(); else startMetro();
};
function startMetro(){
  metroRunning=true;metroBeat=0;
  const btn=document.getElementById('metro-toggle');
  if(btn){btn.textContent='\u{25A0} \u{C815}\u{C9C0}';btn.style.background='var(--red)';}
  const beatMs=60000/metroBpm;
  const subdivMs=beatMs/metroSubdiv;
  metroInterval=setInterval(()=>{
    const isMainBeat=(metroBeat%metroSubdiv===0);
    const mainBeatIdx=Math.floor(metroBeat/metroSubdiv)%metroBeatsPerMeasure;
    if(isMainBeat){
      playSFX13(mainBeatIdx===0?'metro_accent':'metro_tick');
      for(let i=0;i<metroBeatsPerMeasure;i++){
        const dot=document.getElementById('metro-dot-'+i);
        if(dot) dot.style.background=i===mainBeatIdx?'var(--accent)':'var(--surface2)';
      }
    } else {
      playSFX13('metro_tick');
    }
    metroBeat++;
  },subdivMs);
  ls13Set('metroUsed',(ls13Get('metroUsed',0))+1);
}
function stopMetro(){
  metroRunning=false;
  if(metroInterval){clearInterval(metroInterval);metroInterval=null;}
  metroBeat=0;
  const btn=document.getElementById('metro-toggle');
  if(btn){btn.textContent='\u{25B6} \u{C2DC}\u{C791}';btn.style.background='var(--accent)';}
  for(let i=0;i<metroBeatsPerMeasure;i++){
    const dot=document.getElementById('metro-dot-'+i);
    if(dot) dot.style.background='var(--surface2)';
  }
}

// ================ 4. DUET MODE ================
const DUETS = [
  {name:'\u{CE90}\u{B17C} in D (\u{B4C0}\u{C5B3})',icon:'\u{1F3BB}',bpm:72,
    melody:[{n:'F#5',t:0,d:1},{n:'E5',t:1,d:1},{n:'D5',t:2,d:1},{n:'C#5',t:3,d:1},{n:'B4',t:4,d:1},{n:'A4',t:5,d:1},{n:'B4',t:6,d:1},{n:'C#5',t:7,d:1}],
    accomp:[{n:'D3',t:0,d:2},{n:'A3',t:2,d:2},{n:'B3',t:4,d:2},{n:'F#3',t:6,d:2}]},
  {name:'\u{C544}\u{B9AC}\u{B791} (\u{B4C0}\u{C5B3})',icon:'\u{1F33E}',bpm:80,
    melody:[{n:'A4',t:0,d:0.5},{n:'A4',t:0.5,d:0.5},{n:'A4',t:1,d:1},{n:'B4',t:2,d:1},{n:'A4',t:3,d:1},{n:'A4',t:4,d:1},{n:'E4',t:5,d:1.5}],
    accomp:[{n:'A3',t:0,d:2},{n:'D3',t:2,d:2},{n:'A3',t:4,d:2}]},
  {name:'Chopsticks (\u{B4C0}\u{C5B3})',icon:'\u{1F962}',bpm:120,
    melody:[{n:'F4',t:0,d:0.25},{n:'G4',t:0.3,d:0.25},{n:'F4',t:0.6,d:0.25},{n:'G4',t:0.9,d:0.25},{n:'F4',t:1.2,d:0.25},{n:'G4',t:1.5,d:0.25},{n:'E4',t:1.8,d:0.25},{n:'G4',t:2.1,d:0.25},{n:'E4',t:2.4,d:0.25},{n:'G4',t:2.7,d:0.25}],
    accomp:[{n:'C3',t:0,d:1.5},{n:'C3',t:1.8,d:1.2}]},
  {name:'Happy Birthday (\u{B4C0}\u{C5B3})',icon:'\u{1F382}',bpm:100,
    melody:[{n:'G4',t:0,d:0.3},{n:'G4',t:0.35,d:0.3},{n:'A4',t:0.7,d:0.5},{n:'G4',t:1.3,d:0.5},{n:'C5',t:1.9,d:0.5},{n:'B4',t:2.5,d:0.8}],
    accomp:[{n:'C3',t:0,d:1.3},{n:'F3',t:1.3,d:1.2},{n:'G3',t:2.5,d:0.8}]},
  {name:'Jingle Bells (\u{B4C0}\u{C5B3})',icon:'\u{1F514}',bpm:120,
    melody:[{n:'E4',t:0,d:0.3},{n:'E4',t:0.35,d:0.3},{n:'E4',t:0.7,d:0.6},{n:'E4',t:1.4,d:0.3},{n:'E4',t:1.75,d:0.3},{n:'E4',t:2.1,d:0.6},{n:'E4',t:2.8,d:0.3},{n:'G4',t:3.15,d:0.3},{n:'C4',t:3.5,d:0.3},{n:'D4',t:3.85,d:0.3},{n:'E4',t:4.2,d:0.8}],
    accomp:[{n:'C3',t:0,d:1.4},{n:'C3',t:1.4,d:1.4},{n:'F3',t:2.8,d:0.7},{n:'G3',t:3.5,d:1.5}]},
  {name:'London Bridge (\u{B4C0}\u{C5B3})',icon:'\u{1F309}',bpm:110,
    melody:[{n:'G4',t:0,d:0.5},{n:'A4',t:0.55,d:0.3},{n:'G4',t:0.9,d:0.3},{n:'F4',t:1.25,d:0.5},{n:'E4',t:1.8,d:0.3},{n:'F4',t:2.15,d:0.3},{n:'G4',t:2.5,d:0.8}],
    accomp:[{n:'C3',t:0,d:1.25},{n:'F3',t:1.25,d:1.25},{n:'C3',t:2.5,d:0.8}]}
];
let duetPlaying=false,duetTimers=[];

function buildDuetUI(){
  const modal=document.createElement('div');
  modal.id='duet-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  let listHtml=DUETS.map((d,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);cursor:pointer" onclick="playDuet(${i})">
    <span style="font-size:20px">${d.icon}</span>
    <div style="flex:1"><div style="font-size:12px;font-weight:600">${d.name}</div><div style="font-size:10px;color:var(--text2)">${d.bpm} BPM</div></div>
    <span style="font-size:10px;color:var(--accent)">\u{25B6}</span>
  </div>`).join('');
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3B6} \u{B4C0}\u{C5B3} \u{BAA8}\u{B4DC}</h2>
      <button onclick="stopDuet();document.getElementById('duet-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">AI\u{AC00} \u{BC18}\u{C8FC}\u{B97C} \u{C5F0}\u{C8FC}\u{D569}\u{B2C8}\u{B2E4}. \u{BA5C}\u{B85C}\u{B514}\u{B97C} \u{B530}\u{B77C} \u{C5F0}\u{C8FC}\u{D574}\u{BCF4}\u{C138}\u{C694}!</p>
    <div id="duet-status" style="font-size:13px;text-align:center;margin-bottom:10px;min-height:20px"></div>
    <div style="display:flex;flex-direction:column;gap:6px">${listHtml}</div>
  </div>`;
  document.body.appendChild(modal);
}

window.playDuet=function(idx){
  if(duetPlaying) stopDuet();
  duetPlaying=true;
  const d=DUETS[idx];
  const status=document.getElementById('duet-status');
  if(status) status.innerHTML=`\u{1F3B6} <span style="color:var(--accent)">${d.name}</span> \u{C7AC}\u{C0DD} \u{C911}...`;
  playSFX13('duet_start');
  ls13Set('duetsPlayed',(ls13Get('duetsPlayed',0))+1);
  const beatDur=60/d.bpm;
  d.melody.forEach(note=>{
    const t=setTimeout(()=>{if(duetPlaying) playNoteAudio(note.n);}, note.t*beatDur*1000);
    duetTimers.push(t);
  });
  d.accomp.forEach(note=>{
    const t=setTimeout(()=>{
      if(!duetPlaying||!sfx13) return;
      const noteMap={'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'F#3':185.00,'G3':196.00,'A3':220.00,'Bb3':233.08,'B3':246.94};
      const freq=noteMap[note.n];if(!freq) return;
      const tt=sfx13.currentTime;
      const g=sfx13.createGain(),o=sfx13.createOscillator();
      g.connect(sfx13.destination);o.connect(g);
      o.type='sine';o.frequency.setValueAtTime(freq,tt);
      g.gain.setValueAtTime(0.06,tt);g.gain.exponentialRampToValueAtTime(0.001,tt+note.d*beatDur);
      o.start(tt);o.stop(tt+note.d*beatDur);
    }, note.t*beatDur*1000);
    duetTimers.push(t);
  });
  const totalTime=Math.max(...d.melody.map(n=>(n.t+n.d)*beatDur),...d.accomp.map(n=>(n.t+n.d)*beatDur));
  const endT=setTimeout(()=>{
    duetPlaying=false;
    if(status) status.innerHTML='<span style="color:var(--green)">\u{2705} \u{C644}\u{B8CC}!</span>';
  },totalTime*1000+500);
  duetTimers.push(endT);
};

function stopDuet(){
  duetPlaying=false;
  duetTimers.forEach(t=>clearTimeout(t));
  duetTimers=[];
}

// ================ 5. MUSIC THEORY CLASSROOM ================
const THEORY_LESSONS = [
  {title:'\u{C74C}\u{C790}\u{B9AC}\u{C640} \u{C74C}\u{C774}\u{B984}',content:'\u{D53C}\u{C544}\u{B178}\u{C758} \u{D770}\u{AC74}\u{BC18}\u{C740} C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Si) 7\u{AC1C} \u{C74C}\u{C774}\u{B984}\u{C73C}\u{B85C} \u{AD6C}\u{C131}\u{B429}\u{B2C8}\u{B2E4}. \u{AE00}\u{AC74}\u{C740} C#/Db, D#/Eb, F#/Gb, G#/Ab, A#/Bb \u{C774}\u{C5B4}\u{C11C}\u{C774}\u{B9AC}\u{BB18} \u{C774}\u{B984}\u{C744} \u{B450}\u{AE09}\u{B2E8}\u{C744} \u{AC00}\u{C9D1}\u{B2C8}\u{B2E4}.',icon:'\u{1F3B9}'},
  {title:'\u{BC15}\u{C790}\u{C640} \u{B9AC}\u{B4EC}',content:'\u{BC15}\u{C790}(Time Signature)\u{B294} \u{D55C} \u{B9C8}\u{B514}\u{C758} \u{BC15}\u{C218}\u{B97C} \u{B098}\u{D0C0}\u{B0C5}\u{B2C8}\u{B2E4}. 4/4\u{BC15}\u{C790}\u{B294} 1\u{B9C8}\u{B514}\u{C5D0} 4\u{BD84}\u{C74C}\u{D45C} 4\u{AC1C}, 3/4\u{B294} 3\u{AC1C}(\u{C654}\u{CE20}), 6/8\u{C740} \u{ACE0}\u{BCC4}\u{BC15}\u{C790}\u{C785}\u{B2C8}\u{B2E4}.',icon:'\u{1F941}'},
  {title:'\u{C74C}\u{D45C}\u{C758} \u{C885}\u{B958}',content:'\u{C628}\u{C74C}\u{D45C}(4\u{BC15}), \u{C810}\u{C774}\u{BD84}\u{C74C}\u{D45C}(3\u{BC15}), 2\u{BD84}\u{C74C}\u{D45C}(2\u{BC15}), 4\u{BD84}\u{C74C}\u{D45C}(1\u{BC15}), 8\u{BD84}\u{C74C}\u{D45C}(0.5\u{BC15}), 16\u{BD84}\u{C74C}\u{D45C}(0.25\u{BC15}). \u{C810}\u{C74C}\u{D45C}(\u{B4C7})\u{B294} \u{C6D0}\u{B798} \u{AE38}\u{C774}\u{C758} 1.5\u{BC30}\u{C785}\u{B2C8}\u{B2E4}.',icon:'\u{1F3B5}'},
  {title:'\u{C870}\u{D45C}\u{C640} \u{C870}\u{C131}',content:'\u{C870}\u{D45C}(\u{C0F5}\u{C774}\u{B098} \u{D50C}\u{B7AB})\u{B294} \u{ACE1}\u{C758} \u{C870}\u{C131}\u{C744} \u{B098}\u{D0C0}\u{B0C5}\u{B2C8}\u{B2E4}. \u{C0F5} 1\u{AC1C}=G\u{C7A5}\u{C870}/E\u{B2E8}\u{C870}, \u{D50C}\u{B7AB} 1\u{AC1C}=F\u{C7A5}\u{C870}/D\u{B2E8}\u{C870}. \u{C870}\u{D45C}\u{B97C} \u{C54C}\u{BA74} \u{C545}\u{BCF4}\u{B97C} \u{C27D}\u{AC8C} \u{C77D}\u{C744} \u{C218} \u{C788}\u{C2B5}\u{B2C8}\u{B2E4}.',icon:'\u{266D}'},
  {title:'\u{C74C}\u{C815}(Interval)',content:'\u{B450} \u{C74C} \u{C0AC}\u{C774}\u{C758} \u{AC70}\u{B9AC}\u{B97C} \u{C74C}\u{C815}\u{C774}\u{B77C} \u{D569}\u{B2C8}\u{B2E4}. \u{B2E8}2\u{B3C4}(\u{BC18}\u{C74C}), \u{C7A5}2\u{B3C4}(\u{C628}\u{C74C}), \u{B2E8}3\u{B3C4}, \u{C7A5}3\u{B3C4}, \u{C644}\u{C804}4\u{B3C4}, \u{C644}\u{C804}5\u{B3C4}, \u{B2E8}6\u{B3C4}, \u{C7A5}6\u{B3C4}, \u{B2E8}7\u{B3C4}, \u{C7A5}7\u{B3C4}, \u{C644}\u{C804}8\u{B3C4}(\u{C625}\u{D0C0}\u{BE0C}).',icon:'\u{1F4CF}'},
  {title:'\u{D654}\u{C74C}(Chord) \u{AE30}\u{CD08}',content:'\u{D654}\u{C74C}\u{C740} 3\u{AC1C} \u{C774}\u{C0C1}\u{C758} \u{C74C}\u{C744} \u{B3D9}\u{C2DC}\u{C5D0} \u{C5F0}\u{C8FC}\u{D558}\u{B294} \u{AC83}\u{C785}\u{B2C8}\u{B2E4}. \u{C7A5}3\u{D654}\u{C74C}(\u{AE30}\u{BCF8}\u{C74C}+\u{C7A5}3\u{B3C4}+\u{C644}\u{C804}5\u{B3C4}), \u{B2E8}3\u{D654}\u{C74C}(\u{AE30}\u{BCF8}\u{C74C}+\u{B2E8}3\u{B3C4}+\u{C644}\u{C804}5\u{B3C4}). C Major = C-E-G, A minor = A-C-E.',icon:'\u{1F3B6}'},
  {title:'\u{D654}\u{C74C} \u{C9C4}\u{D589}',content:'\u{D654}\u{C74C}\u{C774} \u{C21C}\u{C11C}\u{B300}\u{B85C} \u{C774}\u{C5B4}\u{C9C0}\u{B294} \u{AC83}\u{C744} \u{C9C4}\u{D589}\u{C774}\u{B77C} \u{D569}\u{B2C8}\u{B2E4}. I-IV-V-I\u{C740} \u{AC00}\u{C7A5} \u{AE30}\u{BCF8}\u{C801}\u{C778} \u{C9C4}\u{D589}\u{C785}\u{B2C8}\u{B2E4}. \u{C608}: C\u{C7A5}\u{C870}\u{C5D0}\u{C11C} C-F-G-C. \u{D31D} \u{C74C}\u{C545}\u{C5D0}\u{C11C}\u{B294} I-V-vi-IV\u{AC00} \u{B9CE}\u{C774} \u{C0AC}\u{C6A9}\u{B429}\u{B2C8}\u{B2E4}.',icon:'\u{1F4C8}'},
  {title:'\u{B2E4}\u{C774}\u{B098}\u{BBF9}(Dynamics)',content:'\u{C138}\u{AE30}: pp(\u{B9E4}\u{C6B0}\u{C5EC}\u{B9AC}\u{AC8C}) < p(\u{C5EC}\u{B9AC}\u{AC8C}) < mp(\u{C870}\u{AE08}\u{C5EC}\u{B9AC}\u{AC8C}) < mf(\u{C870}\u{AE08}\u{C138}\u{AC8C}) < f(\u{C138}\u{AC8C}) < ff(\u{B9E4}\u{C6B0}\u{C138}\u{AC8C}). \u{D06C}\u{B808}\u{C148}\u{B3C4}(\u{C810}\u{C810} \u{C138}\u{AC8C}), \u{B370}\u{D06C}\u{B808}\u{C148}\u{B3C4}(\u{C810}\u{C810} \u{C5EC}\u{B9AC}\u{AC8C}).',icon:'\u{1F50A}'},
  {title:'\u{C544}\u{D2F0}\u{D050}\u{B808}\u{C774}\u{C158}',content:'\u{C2A4}\u{D0C0}\u{CE74}\u{D1A0}(\u{B04A}\u{C5B4}\u{C11C}), \u{B808}\u{AC00}\u{D1A0}(\u{B9E4}\u{B044}\u{B7FD}\u{AC8C}), \u{D14C}\u{B204}\u{D1A0}(\u{D14C}\u{B204}\u{D1A0}=\u{C74C}\u{C744} \u{B290}\u{B9AC}\u{BA70}), \u{D398}\u{B974}\u{B9C8}\u{D0C0}(\u{C74C}\u{C744} \u{B192}\u{C774}\u{BA70}), \u{D2B8}\u{B9B4}(\u{C774}\u{C704}\u{D668} \u{C704}\u{C700}\u{BC18}). \u{D14C}\u{B204}\u{D1A0}\u{C640} \u{C2A4}\u{D0C0}\u{CE74}\u{D1A0}\u{B294} \u{D53C}\u{C544}\u{B178}\u{C5D0}\u{C11C} \u{AC00}\u{C7A5} \u{C911}\u{C694}\u{D55C} \u{D45C}\u{D604}\u{BC95}\u{C785}\u{B2C8}\u{B2E4}.',icon:'\u{270D}\u{FE0F}'},
  {title:'\u{BC18}\u{BCF5} \u{AE30}\u{D638}',content:'\u{B3C4}\u{B3CC}\u{C774}\u{D45C}(||: :||): \u{AD6C}\u{AC04}\u{C744} \u{BC18}\u{BCF5}. D.C.(Da Capo): \u{CC98}\u{C74C}\u{BD80}\u{D130}. D.S.(Dal Segno): \u{AE30}\u{D638}\u{BD80}\u{D130}. Coda: \u{B9C8}\u{BB34}\u{B9AC} \u{BD80}\u{BD84}\u{C73C}\u{B85C} \u{C774}\u{B3D9}. Fine: \u{B05D}.',icon:'\u{1F501}'},
  {title:'\u{D398}\u{B2EC} \u{D14C}\u{D06C}\u{B2C9}',content:'\u{C624}\u{B978}\u{C190} \u{D398}\u{B2EC}: \u{C5C4}\u{C9C0}=1, \u{AC80}\u{C9C0}=2, \u{C911}\u{C9C0}=3, \u{C57D}\u{C9C0}=4, \u{C0C8}\u{B07C}=5. \u{AD6C}\u{BD80}\u{B9AC}\u{AE30}: \u{C190}\u{AC00}\u{B77D}\u{C744} \u{B465}\u{AD49}\u{AC8C}. \u{C190}\u{BAA9} \u{B3C5}\u{B9BD}: \u{AC01} \u{C190}\u{AC00}\u{B77D}\u{C744} \u{B3C5}\u{B9BD}\u{C801}\u{C73C}\u{B85C} \u{C6C0}\u{C9C1}\u{C5EC} \u{C6B0}\u{C544}\u{D55C} \u{D130}\u{CE58}\u{B97C} \u{C5BB}\u{C2B5}\u{B2C8}\u{B2E4}.',icon:'\u{270B}'},
  {title:'\u{C870}\u{C625}\u{AE40}(Transposition)',content:'\u{ACE1}\u{C744} \u{B2E4}\u{B978} \u{C870}\u{C131}\u{C73C}\u{B85C} \u{C62E}\u{AE30}\u{B294} \u{AC83}\u{C785}\u{B2C8}\u{B2E4}. \u{BAA8}\u{B4E0} \u{C74C}\u{C744} \u{AC19}\u{C740} \u{C74C}\u{C815}\u{B9CC}\u{D07C} \u{C774}\u{B3D9}\u{D569}\u{B2C8}\u{B2E4}. C\u{C7A5}\u{C870} \u{2192} G\u{C7A5}\u{C870}\u{B77C}\u{BA74} \u{BAA8}\u{B4E0} \u{C74C}\u{C744} \u{C644}\u{C804}5\u{B3C4} \u{C704}\u{B85C} \u{C62E}\u{AE41}\u{B2C8}\u{B2E4}. \u{BCC0}\u{C870}\u{B294} \u{BA85}\u{ACE1}\u{C744} \u{C790}\u{C2E0}\u{C758} \u{C74C}\u{C5ED}\u{C5D0} \u{B9DE}\u{CE30}\u{B294} \u{B370} \u{D544}\u{C218}\u{C801}\u{C785}\u{B2C8}\u{B2E4}.',icon:'\u{1F504}'},
  {title:'\u{D615}\u{C2DD}\u{C640} \u{AD6C}\u{C870}',content:'\u{C545}\u{ACE1}\u{C758} \u{AD6C}\u{C870}\u{B97C} \u{D615}\u{C2DD}\u{C774}\u{B77C} \u{D569}\u{B2C8}\u{B2E4}. ABA(\u{C138}\u{B3C4}\u{B9C9} \u{D615}\u{C2DD}), \u{C18C}\u{B098}\u{D0C0} \u{D615}\u{C2DD}(\u{C81C}\u{C2DC}-\u{BC1C}\u{C804}-\u{C7AC}\u{D604}), \u{B860}\u{B3C4}(\u{AC19}\u{C740} \u{C8FC}\u{C81C}\u{AC00} \u{B2E4}\u{B978} \u{C870}\u{C131}\u{C73C}\u{B85C} \u{BC18}\u{BCF5}), \u{C8FC}\u{C81C}\u{C640} \u{BCC0}\u{C8FC}(\u{C8FC}\u{C81C}\u{AC00} \u{B2E4}\u{C591}\u{D558}\u{AC8C} \u{BCC0}\u{D615}).',icon:'\u{1F3DB}\u{FE0F}'}
];
let theoryRead=ls13Get('theoryRead',[]);

function buildTheoryUI(){
  const modal=document.createElement('div');
  modal.id='theory-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,480px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F4D6} \u{C74C}\u{C545} \u{C774}\u{B860} \u{AD50}\u{C2E4}</h2>
      <button onclick="document.getElementById('theory-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:8px">\u{C9C4}\u{B3C4}: ${theoryRead.length}/${THEORY_LESSONS.length}</p>
    <div id="theory-list" style="display:flex;flex-direction:column;gap:6px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderTheoryList();
}

function renderTheoryList(){
  const list=document.getElementById('theory-list');if(!list) return;
  list.innerHTML=THEORY_LESSONS.map((l,i)=>{
    const read=theoryRead.includes(i);
    return `<div style="padding:10px;background:var(--surface2);border-radius:8px;border:1px solid ${read?'var(--green)':'var(--border)'};cursor:pointer" onclick="toggleTheoryLesson(${i})">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">${l.icon}</span>
        <span style="font-size:12px;font-weight:600;flex:1">${i+1}. ${l.title}</span>
        <span style="font-size:10px;color:${read?'var(--green)':'var(--text2)'}">${read?'\u{2705}':'\u{1F4D6}'}</span>
      </div>
      <div id="theory-content-${i}" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--text2);line-height:1.6"></div>
    </div>`;
  }).join('');
}

window.toggleTheoryLesson=function(idx){
  const el=document.getElementById('theory-content-'+idx);if(!el) return;
  if(el.style.display==='none'){
    el.style.display='block';
    el.textContent=THEORY_LESSONS[idx].content;
    if(!theoryRead.includes(idx)){
      theoryRead.push(idx);
      ls13Set('theoryRead',theoryRead);
      playSFX13('theory_done');
      renderTheoryList();
    }
  } else {
    el.style.display='none';
  }
};

// ================ 6. DAILY CHALLENGE ================
const CHALLENGES = [
  {name:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529} 5\u{BB38}\u{C81C}',desc:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529}\u{C5D0}\u{C11C} 5\u{BB38}\u{C81C} \u{D480}\u{AE30}',check:()=>ls13Get('dailySight',0)>=5,icon:'\u{1F3BC}'},
  {name:'\u{ACE1} 2\u{ACE1} \u{C5F0}\u{C8FC}',desc:'\u{C5F0}\u{C8FC}\u{D0ED}\u{C5D0}\u{C11C} \u{ACE1} 2\u{ACE1} \u{C644}\u{C8FC}',check:()=>ls13Get('dailySongs',0)>=2,icon:'\u{1F3B5}'},
  {name:'\u{C2A4}\u{CF00}\u{C77C} 1\u{AC1C}',desc:'\u{C2A4}\u{CF00}\u{C77C} 1\u{AC1C} \u{C5F0}\u{C2B5}',check:()=>ls13Get('dailyScale',0)>=1,icon:'\u{1F3B9}'},
  {name:'\u{CF54}\u{B4DC} 3\u{AC1C} \u{D559}\u{C2B5}',desc:'\u{CF54}\u{B4DC} \u{C0AC}\u{C804}\u{C5D0}\u{C11C} 3\u{AC1C} \u{BCF4}\u{AE30}',check:()=>ls13Get('dailyChords',0)>=3,icon:'\u{1F3B6}'},
  {name:'\u{C774}\u{B860} 1\u{AC15}',desc:'\u{C74C}\u{C545}\u{C774}\u{B860} 1\u{AC15} \u{C77D}\u{AE30}',check:()=>ls13Get('dailyTheory',0)>=1,icon:'\u{1F4D6}'},
  {name:'\u{BA54}\u{D2B8}\u{B85C}\u{B188} \u{C0AC}\u{C6A9}',desc:'\u{BA54}\u{D2B8}\u{B85C}\u{B188} 1\u{D68C} \u{C0AC}\u{C6A9}',check:()=>ls13Get('dailyMetro',0)>=1,icon:'\u{23F1}\u{FE0F}'},
  {name:'\u{D000}\u{C988} \u{B3C4}\u{C804}',desc:'\u{D000}\u{C988} 1\u{D68C} \u{C644}\u{B8CC}',check:()=>ls13Get('dailyQuiz',0)>=1,icon:'\u{1F393}'},
  {name:'\u{B4C0}\u{C5B3} \u{C5F0}\u{C8FC}',desc:'\u{B4C0}\u{C5B3} \u{BAA8}\u{B4DC} 1\u{ACE1} \u{C5F0}\u{C8FC}',check:()=>ls13Get('dailyDuet',0)>=1,icon:'\u{1F3BB}'}
];

function getDailyChallenge(){
  const seed=new Date().toISOString().slice(0,10);
  let h=0;for(let i=0;i<seed.length;i++) h=((h<<5)-h)+seed.charCodeAt(i);
  h=Math.abs(h);
  const indices=[];
  while(indices.length<3){
    const idx=h%CHALLENGES.length;
    if(!indices.includes(idx)) indices.push(idx);
    h=Math.abs((h*31337+7919)%99991);
  }
  return indices.map(i=>CHALLENGES[i]);
}

function buildDailyChallengeUI(){
  const modal=document.createElement('div');
  modal.id='daily-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,400px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F4C5} \u{C624}\u{B298}\u{C758} \u{B3C4}\u{C804}</h2>
      <button onclick="document.getElementById('daily-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <p style="font-size:11px;color:var(--text2);margin-bottom:12px">\u{B9E4}\u{C77C} \u{C0C8}\u{B85C}\u{C6B4} 3\u{AC1C}\u{C758} \u{B3C4}\u{C804}\u{C774} \u{C8FC}\u{C5B4}\u{C9D1}\u{B2C8}\u{B2E4}</p>
    <div id="daily-challenges" style="display:flex;flex-direction:column;gap:8px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderDailyChallenges();
}

function renderDailyChallenges(){
  const el=document.getElementById('daily-challenges');if(!el) return;
  const today=new Date().toISOString().slice(0,10);
  const lastReset=ls13Get('dailyReset','');
  if(lastReset!==today){
    ls13Set('dailyReset',today);
    ['dailySight','dailySongs','dailyScale','dailyChords','dailyTheory','dailyMetro','dailyQuiz','dailyDuet'].forEach(k=>ls13Set(k,0));
  }
  const daily=getDailyChallenge();
  let completed=0;
  el.innerHTML=daily.map((c,i)=>{
    const done=c.check();
    if(done) completed++;
    return `<div style="padding:12px;background:${done?'rgba(34,197,94,0.1)':'var(--surface2)'};border-radius:8px;border:1px solid ${done?'var(--green)':'var(--border)'}">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">${c.icon}</span>
        <div style="flex:1"><div style="font-size:12px;font-weight:600">${c.name}</div><div style="font-size:10px;color:var(--text2)">${c.desc}</div></div>
        <span style="font-size:14px">${done?'\u{2705}':'\u{2B55}'}</span>
      </div>
    </div>`;
  }).join('');
  if(completed===3){
    const daysCleared=ls13Get('dailyCleared',0);
    if(ls13Get('dailyClearedDate','')!==today){
      ls13Set('dailyClearedDate',today);
      ls13Set('dailyCleared',daysCleared+1);
      playSFX13('challenge_done');
    }
  }
}

// ================ 7. PROGRESS REPORT Canvas ================
function buildReportUI(){
  const modal=document.createElement('div');
  modal.id='report-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F4CA} \u{C885}\u{D569} \u{B9AC}\u{D3EC}\u{D2B8}</h2>
      <button onclick="document.getElementById('report-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <canvas id="report-canvas" width="380" height="380" style="width:100%;max-width:380px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px"></canvas>
    <div id="report-stats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center"></div>
  </div>`;
  document.body.appendChild(modal);
}

function drawReportRadar(){
  const canvas=document.getElementById('report-canvas');if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0f1525';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2-10,r=130;
  const labels=['\u{C5F0}\u{C8FC}\u{B825}','\u{C774}\u{B860}','\u{C2DC}\u{BCF4}\u{B9AC}\u{B529}','\u{B9AC}\u{B4EC}','\u{CF54}\u{B4DC}','\u{C2A4}\u{CF00}\u{C77C}'];
  const songsBest=ls13Get('songsBest',0);
  const theoryCnt=theoryRead.length;
  const sightTotal=parseInt(localStorage.getItem('piano-v12-sightTotal'))||0;
  const rhythmPlayed=parseInt(localStorage.getItem('piano-v12-rhythmPlayed'))||0;
  const chordsViewed=ls13Get('chordsViewed',0);
  const scalesPracticed=ls13Get('scalesPracticed',0);
  const values=[
    Math.min(songsBest/20,1),
    Math.min(theoryCnt/12,1),
    Math.min(sightTotal/30,1),
    Math.min(rhythmPlayed/10,1),
    Math.min(chordsViewed/15,1),
    Math.min(scalesPracticed/8,1)
  ];
  const n=labels.length;
  for(let ring=1;ring<=5;ring++){
    const rr=r*ring/5;
    ctx.beginPath();
    for(let i=0;i<=n;i++){
      const angle=-Math.PI/2+i*2*Math.PI/n;
      const x=cx+Math.cos(angle)*rr;
      const y=cy+Math.sin(angle)*rr;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(74,125,255,0.15)';ctx.lineWidth=1;ctx.stroke();
  }
  for(let i=0;i<n;i++){
    const angle=-Math.PI/2+i*2*Math.PI/n;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
    ctx.strokeStyle='rgba(74,125,255,0.2)';ctx.stroke();
    const lx=cx+Math.cos(angle)*(r+20);
    const ly=cy+Math.sin(angle)*(r+20);
    ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(labels[i],lx,ly);
  }
  ctx.beginPath();
  values.forEach((v,i)=>{
    const angle=-Math.PI/2+i*2*Math.PI/n;
    const x=cx+Math.cos(angle)*r*v;
    const y=cy+Math.sin(angle)*r*v;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle='rgba(74,125,255,0.2)';ctx.fill();
  ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.stroke();
  values.forEach((v,i)=>{
    const angle=-Math.PI/2+i*2*Math.PI/n;
    const x=cx+Math.cos(angle)*r*v;
    const y=cy+Math.sin(angle)*r*v;
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle='#4a7dff';ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();
  });
  ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
  const avg=Math.round(values.reduce((a,b)=>a+b,0)/n*100);
  ctx.fillText('\u{C885}\u{D569} \u{C810}\u{C218}: '+avg+'%',cx,h-15);
  const statsEl=document.getElementById('report-stats');
  if(statsEl){
    statsEl.innerHTML=[
      {l:'\u{ACE1} \u{C5F0}\u{C8FC}',v:songsBest+'\u{ACE1}'},{l:'\u{C774}\u{B860} \u{D559}\u{C2B5}',v:theoryCnt+'/12'},
      {l:'\u{C2DC}\u{BCF4}\u{B9AC}\u{B529}',v:sightTotal+'\u{BB38}\u{C81C}'},{l:'\u{B9AC}\u{B4EC}',v:rhythmPlayed+'\u{D68C}'},
      {l:'\u{CF54}\u{B4DC}',v:chordsViewed+'\u{AC1C}'},{l:'\u{C2A4}\u{CF00}\u{C77C}',v:scalesPracticed+'\u{D68C}'}
    ].map(s=>`<div style="padding:8px;background:var(--surface2);border-radius:6px"><div style="font-size:9px;color:var(--text2)">${s.l}</div><div style="font-size:14px;font-weight:700;color:var(--accent)">${s.v}</div></div>`).join('');
  }
  playSFX13('report_view');
}

// ================ 8. PRACTICE JOURNAL ================
function buildJournalUI(){
  const modal=document.createElement('div');
  modal.id='journal-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F4DD} \u{C5F0}\u{C2B5} \u{C77C}\u{C9C0}</h2>
      <button onclick="document.getElementById('journal-modal').style.display='none'" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="margin-bottom:12px">
      <div style="display:flex;gap:6px;margin-bottom:8px">
        ${['\u{1F60A} \u{CD5C}\u{ACE0}','\u{1F642} \u{C88B}\u{C544}','\u{1F610} \u{BCF4}\u{D1B5}','\u{1F614} \u{D53C}\u{ACE4}','\u{1F622} \u{D798}\u{B4E4}\u{C5B4}'].map((m,i)=>`<button class="journal-mood-btn" onclick="selectJournalMood(${i})" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:10px;cursor:pointer;flex:1">${m}</button>`).join('')}
      </div>
      <textarea id="journal-text" placeholder="\u{C624}\u{B298}\u{C758} \u{C5F0}\u{C2B5} \u{BA54}\u{BAA8}..." style="width:100%;height:60px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px;font-size:12px;resize:none;box-sizing:border-box"></textarea>
      <button onclick="saveJournalEntry()" style="margin-top:6px;padding:6px 16px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">\u{C800}\u{C7A5}</button>
    </div>
    <div id="journal-entries" style="display:flex;flex-direction:column;gap:6px"></div>
  </div>`;
  document.body.appendChild(modal);
  renderJournalEntries();
}

let journalMood=2;
window.selectJournalMood=function(idx){
  journalMood=idx;
  document.querySelectorAll('.journal-mood-btn').forEach((btn,i)=>{
    btn.style.background=i===idx?'var(--accent)':'var(--surface2)';
    btn.style.color=i===idx?'white':'var(--text2)';
  });
};

window.saveJournalEntry=function(){
  const text=document.getElementById('journal-text');
  if(!text||!text.value.trim()) return;
  const entries=ls13Get('journalEntries',[]);
  const moods=['\u{1F60A}','\u{1F642}','\u{1F610}','\u{1F614}','\u{1F622}'];
  entries.unshift({date:new Date().toISOString().slice(0,16).replace('T',' '),mood:moods[journalMood],text:text.value.trim()});
  if(entries.length>50) entries.length=50;
  ls13Set('journalEntries',entries);
  text.value='';
  playSFX13('journal_save');
  renderJournalEntries();
};

function renderJournalEntries(){
  const el=document.getElementById('journal-entries');if(!el) return;
  const entries=ls13Get('journalEntries',[]);
  if(entries.length===0){el.innerHTML='<p style="text-align:center;font-size:12px;color:var(--text2)">\u{C544}\u{C9C1} \u{C77C}\u{C9C0}\u{AC00} \u{C5C6}\u{C2B5}\u{B2C8}\u{B2E4}</p>';return;}
  el.innerHTML=entries.slice(0,15).map((e,i)=>`<div style="padding:8px;background:var(--surface2);border-radius:6px;border:1px solid var(--border)">
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text2);margin-bottom:4px">
      <span>${e.mood} ${e.date}</span>
      <button onclick="deleteJournalEntry(${i})" style="background:none;border:none;color:var(--red);font-size:10px;cursor:pointer">\u{D734}\u{C9C0}\u{D1B5}</button>
    </div>
    <div style="font-size:11px;color:var(--text)">${e.text.replace(/</g,'&lt;')}</div>
  </div>`).join('');
}

window.deleteJournalEntry=function(idx){
  const entries=ls13Get('journalEntries',[]);
  entries.splice(idx,1);
  ls13Set('journalEntries',entries);
  renderJournalEntries();
};

// ================ 9. NEW SONGS (92→102) ================
function addV13Songs(){
  if(typeof SONGS==='undefined') return;
  const ids=SONGS.map(s=>s.id);
  const newSongs=[
    {id:'river_flows',name:'River Flows in You (\u{C774}\u{B8E8}\u{B9C8})',category:'\u{D604}\u{B300}',difficulty:'medium',icon:'\u{1F30A}',color:'#3b82f6',bpm:68,timeSignature:'4/4',
      notes:[{note:'A4',time:0,dur:0.5,hand:'R'},{note:'B4',time:0.55,dur:0.3,hand:'R'},{note:'C5',time:0.9,dur:0.5,hand:'R'},{note:'B4',time:1.5,dur:0.3,hand:'R'},{note:'C5',time:1.85,dur:0.5,hand:'R'},{note:'E5',time:2.4,dur:0.8,hand:'R'},{note:'B4',time:3.3,dur:0.8,hand:'R'},{note:'A4',time:4.2,dur:1.2,hand:'R'},{note:'A3',time:0,dur:1.5,hand:'L'},{note:'E3',time:1.5,dur:1.5,hand:'L'},{note:'F3',time:3.3,dur:1.5,hand:'L'}]},
    {id:'kiss_rain',name:'Kiss The Rain (\u{C774}\u{B8E8}\u{B9C8})',category:'\u{D604}\u{B300}',difficulty:'medium',icon:'\u{1F327}\u{FE0F}',color:'#6366f1',bpm:62,timeSignature:'4/4',
      notes:[{note:'E5',time:0,dur:0.8,hand:'R'},{note:'D5',time:0.9,dur:0.4,hand:'R'},{note:'C5',time:1.4,dur:0.4,hand:'R'},{note:'D5',time:1.9,dur:0.8,hand:'R'},{note:'E5',time:2.8,dur:0.8,hand:'R'},{note:'G5',time:3.7,dur:1.0,hand:'R'},{note:'F5',time:4.8,dur:0.8,hand:'R'},{note:'E5',time:5.7,dur:1.2,hand:'R'},{note:'C3',time:0,dur:1.8,hand:'L'},{note:'G3',time:1.9,dur:1.8,hand:'L'},{note:'F3',time:3.7,dur:1.8,hand:'L'}]},
    {id:'comptine',name:"Comptine d'un autre \u{C5EC}\u{B984} (\u{C580}\u{B9AC})",category:'\u{D604}\u{B300}',difficulty:'medium',icon:'\u{2600}\u{FE0F}',color:'#eab308',bpm:100,timeSignature:'3/4',
      notes:[{note:'E5',time:0,dur:0.3,hand:'R'},{note:'F5',time:0.35,dur:0.3,hand:'R'},{note:'E5',time:0.7,dur:0.3,hand:'R'},{note:'E5',time:1.1,dur:0.3,hand:'R'},{note:'F5',time:1.45,dur:0.3,hand:'R'},{note:'E5',time:1.8,dur:0.3,hand:'R'},{note:'E5',time:2.2,dur:0.3,hand:'R'},{note:'F5',time:2.55,dur:0.3,hand:'R'},{note:'E5',time:2.9,dur:0.3,hand:'R'},{note:'A3',time:0,dur:1.1,hand:'L'},{note:'E3',time:1.1,dur:1.1,hand:'L'},{note:'D3',time:2.2,dur:1.1,hand:'L'}]},
    {id:'una_mattina',name:'Una Mattina (\u{B8E8}\u{B3C4}\u{BE44}\u{CF54} \u{C5D0}\u{C778}\u{C544}\u{C6B0}\u{B514})',category:'\u{D604}\u{B300}',difficulty:'medium',icon:'\u{1F305}',color:'#f97316',bpm:72,timeSignature:'4/4',
      notes:[{note:'E4',time:0,dur:0.5,hand:'R'},{note:'F4',time:0.55,dur:0.5,hand:'R'},{note:'G4',time:1.1,dur:0.5,hand:'R'},{note:'A4',time:1.65,dur:0.5,hand:'R'},{note:'G4',time:2.2,dur:0.5,hand:'R'},{note:'F4',time:2.75,dur:0.5,hand:'R'},{note:'E4',time:3.3,dur:0.8,hand:'R'},{note:'C3',time:0,dur:1.6,hand:'L'},{note:'F3',time:1.65,dur:1.6,hand:'L'}]},
    {id:'nuvole_bianche',name:'Nuvole Bianche (\u{C5D0}\u{C778}\u{C544}\u{C6B0}\u{B514})',category:'\u{D604}\u{B300}',difficulty:'hard',icon:'\u{2601}\u{FE0F}',color:'#e2e8f0',bpm:60,timeSignature:'4/4',
      notes:[{note:'B4',time:0,dur:0.8,hand:'R'},{note:'E5',time:0.9,dur:0.4,hand:'R'},{note:'D5',time:1.4,dur:0.4,hand:'R'},{note:'C5',time:1.9,dur:0.4,hand:'R'},{note:'B4',time:2.4,dur:0.8,hand:'R'},{note:'A4',time:3.3,dur:0.8,hand:'R'},{note:'G4',time:4.2,dur:1.2,hand:'R'},{note:'E3',time:0,dur:1.8,hand:'L'},{note:'A3',time:1.9,dur:1.8,hand:'L'},{note:'C3',time:3.8,dur:1.6,hand:'L'}]},
    {id:'gymnopedie1',name:'Gymnopedie No.1 (\u{C0AC}\u{D2F0})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'easy',icon:'\u{1F33F}',color:'#a3e635',bpm:76,timeSignature:'3/4',
      notes:[{note:'F#5',time:0,dur:0.9,hand:'R'},{note:'E5',time:1,dur:0.9,hand:'R'},{note:'F#5',time:2,dur:0.9,hand:'R'},{note:'B4',time:3,dur:1.8,hand:'R'},{note:'D5',time:5,dur:0.9,hand:'R'},{note:'C#5',time:6,dur:0.9,hand:'R'},{note:'B4',time:7,dur:1.8,hand:'R'},{note:'G3',time:0,dur:2.7,hand:'L'},{note:'D3',time:3,dur:2.7,hand:'L'},{note:'A3',time:6,dur:2.7,hand:'L'}]},
    {id:'prelude_bach',name:'\u{D504}\u{B810}\u{B968}\u{B4DC} C\u{C7A5}\u{C870} (\u{BC14}\u{D750})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'medium',icon:'\u{26EA}',color:'#8b5cf6',bpm:72,timeSignature:'4/4',
      notes:[{note:'C4',time:0,dur:0.2,hand:'R'},{note:'E4',time:0.22,dur:0.2,hand:'R'},{note:'G4',time:0.44,dur:0.2,hand:'R'},{note:'C5',time:0.66,dur:0.2,hand:'R'},{note:'E5',time:0.88,dur:0.2,hand:'R'},{note:'G4',time:1.1,dur:0.2,hand:'R'},{note:'C5',time:1.32,dur:0.2,hand:'R'},{note:'E5',time:1.54,dur:0.2,hand:'R'},{note:'C3',time:0,dur:0.88,hand:'L'},{note:'G3',time:1.1,dur:0.88,hand:'L'}]},
    {id:'swan_lake',name:'\u{BC31}\u{C870}\u{C758} \u{D638}\u{C218} (\u{CC28}\u{C774}\u{CF54}\u{D504}\u{C2A4}\u{D0A4})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'hard',icon:'\u{1F9A2}',color:'#f0abfc',bpm:58,timeSignature:'4/4',
      notes:[{note:'A4',time:0,dur:0.5,hand:'R'},{note:'B4',time:0.55,dur:0.3,hand:'R'},{note:'C5',time:0.9,dur:0.5,hand:'R'},{note:'D5',time:1.45,dur:0.3,hand:'R'},{note:'E5',time:1.8,dur:0.8,hand:'R'},{note:'D5',time:2.7,dur:0.3,hand:'R'},{note:'C5',time:3.05,dur:0.3,hand:'R'},{note:'B4',time:3.4,dur:0.5,hand:'R'},{note:'A4',time:4,dur:1.2,hand:'R'},{note:'A3',time:0,dur:1.8,hand:'L'},{note:'E3',time:1.8,dur:1.6,hand:'L'},{note:'A3',time:3.4,dur:1.8,hand:'L'}]},
    {id:'arabesque1',name:'Arabesque No.1 (\u{B4DC}\u{BDA4}\u{C2DC})',category:'\u{D074}\u{B798}\u{C2DD}',difficulty:'hard',icon:'\u{1F3A8}',color:'#ec4899',bpm:66,timeSignature:'4/4',
      notes:[{note:'E5',time:0,dur:0.3,hand:'R'},{note:'F5',time:0.33,dur:0.3,hand:'R'},{note:'E5',time:0.66,dur:0.3,hand:'R'},{note:'C#5',time:1,dur:0.3,hand:'R'},{note:'D5',time:1.33,dur:0.5,hand:'R'},{note:'E5',time:1.9,dur:0.3,hand:'R'},{note:'F5',time:2.23,dur:0.3,hand:'R'},{note:'E5',time:2.56,dur:0.3,hand:'R'},{note:'D5',time:2.9,dur:0.5,hand:'R'},{note:'C#5',time:3.5,dur:0.8,hand:'R'},{note:'A3',time:0,dur:1.5,hand:'L'},{note:'D3',time:1.5,dur:1.5,hand:'L'},{note:'A3',time:3,dur:1.3,hand:'L'}]},
    {id:'nocturne_secret',name:'Secret (\u{B178}\u{D134}\u{C624}\u{B9AC}\u{C9C0}\u{B110})',category:'\u{D604}\u{B300}',difficulty:'medium',icon:'\u{1F3AC}',color:'#14b8a6',bpm:76,timeSignature:'4/4',
      notes:[{note:'G4',time:0,dur:0.4,hand:'R'},{note:'A4',time:0.45,dur:0.4,hand:'R'},{note:'B4',time:0.9,dur:0.4,hand:'R'},{note:'D5',time:1.35,dur:0.8,hand:'R'},{note:'C5',time:2.2,dur:0.4,hand:'R'},{note:'B4',time:2.65,dur:0.4,hand:'R'},{note:'A4',time:3.1,dur:0.4,hand:'R'},{note:'G4',time:3.55,dur:1.0,hand:'R'},{note:'G3',time:0,dur:1.35,hand:'L'},{note:'D3',time:1.35,dur:1.3,hand:'L'},{note:'C3',time:2.65,dur:1.9,hand:'L'}]}
  ];
  newSongs.forEach(s=>{if(!ids.includes(s.id)) SONGS.push(s);});
}

// ================ 10. QUIZ v4 ================
const QUIZ_V4 = [
  {q:'\u{CF54}\u{B4DC} C Major\u{C758} \u{AD6C}\u{C131}\u{C74C}\u{C740}?',o:['C-E-G','C-Eb-G','C-F-G','C-E-Ab'],a:0},
  {q:'River Flows in You \u{C791}\u{ACE1}\u{AC00}\u{B294}?',o:['\u{C774}\u{B8E8}\u{B9C8}','\u{C1FC}\u{D321}','\u{C0AC}\u{D2F0}','\u{B4DC}\u{BDA4}\u{C2DC}'],a:0},
  {q:'4/4 \u{BC15}\u{C790}\u{C5D0}\u{C11C} 1\u{B9C8}\u{B514}\u{C758} \u{CD1D} \u{BC15}\u{C218}\u{B294}?',o:['3','4','6','8'],a:1},
  {q:'pp\u{C758} \u{B73B}\u{C740}?',o:['\u{B9E4}\u{C6B0} \u{C138}\u{AC8C}','\u{B9E4}\u{C6B0} \u{C5EC}\u{B9AC}\u{AC8C}','\u{C810}\u{C810} \u{C138}\u{AC8C}','\u{C810}\u{C810} \u{C5EC}\u{B9AC}\u{AC8C}'],a:1},
  {q:'G \u{C7A5}\u{C870}\u{C758} \u{C870}\u{D45C}\u{B294}?',o:['\u{D50C}\u{B7AB} 1\u{AC1C}','\u{C0F5} 1\u{AC1C}','\u{C0F5} 2\u{AC1C}','\u{D50C}\u{B7AB} 2\u{AC1C}'],a:1},
  {q:'\u{C2A4}\u{D0C0}\u{CE74}\u{D1A0}\u{C758} \u{C758}\u{BBF8}\u{B294}?',o:['\u{B04A}\u{C5B4}\u{C11C}','\u{B9E4}\u{B044}\u{B7FD}\u{AC8C}','\u{C810}\u{C810} \u{C138}\u{AC8C}','\u{B290}\u{B9AC}\u{AC8C}'],a:0},
  {q:'A minor \u{CF54}\u{B4DC}\u{C758} \u{AD6C}\u{C131}\u{C740}?',o:['A-C-E','A-C#-E','A-D-E','A-Cb-E'],a:0},
  {q:'\u{D504}\u{B810}\u{B968}\u{B4DC} C\u{C7A5}\u{C870} \u{C791}\u{ACE1}\u{AC00}\u{B294}?',o:['\u{BAA8}\u{CC28}\u{B974}\u{D2B8}','\u{BC14}\u{D750}','\u{BCA0}\u{D1A0}\u{BCA4}','\u{B9AC}\u{C2A4}\u{D2B8}'],a:1},
  {q:'\u{C644}\u{C804}5\u{B3C4}\u{B294} \u{BC18}\u{C74C} \u{BA87} \u{AC1C}?',o:['5','6','7','8'],a:2},
  {q:'Gymnopedie No.1 \u{C791}\u{ACE1}\u{AC00}\u{B294}?',o:['\u{C0AC}\u{D2F0}','\u{B4DC}\u{BDA4}\u{C2DC}','\u{B77C}\u{BCA8}','\u{C1FC}\u{D321}'],a:0},
  {q:'D.C.\u{C758} \u{C758}\u{BBF8}\u{B294}?',o:['\u{CC98}\u{C74C}\u{BD80}\u{D130}','\u{AD6C}\u{AC04}\u{BC18}\u{BCF5}','\u{B05D}','\u{AE30}\u{D638}\u{BD80}\u{D130}'],a:0},
  {q:'\u{BC31}\u{C870}\u{C758} \u{D638}\u{C218} \u{C791}\u{ACE1}\u{AC00}\u{B294}?',o:['\u{CC28}\u{C774}\u{CF54}\u{D504}\u{C2A4}\u{D0A4}','\u{C2A4}\u{D2B8}\u{B77C}\u{BE48}\u{C2A4}\u{D0A4}','\u{B77C}\u{D750}\u{B9C8}\u{B2C8}\u{B178}\u{D504}','\u{D504}\u{B85C}\u{CF54}\u{D53C}\u{C608}\u{D504}'],a:0},
  {q:'\u{D53C}\u{C544}\u{B178}\u{C758} \u{BD84}\u{B958} \u{AC04}\u{C740}?',o:['\u{AD70}\u{BC30}\u{AD00}','\u{BD88}\u{ADE0}\u{C728}','\u{BC18}\u{C74C}\u{BD84}','\u{C7A5}2\u{B3C4}'],a:0},
  {q:'Arabesque No.1 \u{C791}\u{ACE1}\u{AC00}\u{B294}?',o:['\u{B4DC}\u{BDA4}\u{C2DC}','\u{B77C}\u{BCA8}','\u{C0AC}\u{D2F0}','\u{C1FC}\u{D321}'],a:0},
  {q:'I-IV-V-I \u{C9C4}\u{D589}\u{C5D0}\u{C11C} C\u{C7A5}\u{C870}\u{C758} V\u{B294}?',o:['G','F','Am','Dm'],a:0}
];
let quiz4Score=0,quiz4Idx=0,quiz4Active=false;

function buildQuizV4UI(){
  const modal=document.createElement('div');
  modal.id='quiz4-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(94vw,460px);max-height:90vh;overflow-y:auto;text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">\u{1F3C6} \u{D000}\u{C988} v4</h2>
      <button onclick="document.getElementById('quiz4-modal').style.display='none';quiz4Active=false" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="quiz4-area"><p style="font-size:12px;color:var(--text2);margin-bottom:16px">15\u{BB38}\u{D56D} \u{C2EC}\u{D654} \u{D000}\u{C988} v4</p>
      <button onclick="startQuiz4()" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:600;cursor:pointer">\u{C2DC}\u{C791}</button></div>
  </div>`;
  document.body.appendChild(modal);
}
window.startQuiz4=function(){quiz4Score=0;quiz4Idx=0;quiz4Active=true;showQuiz4Q();};
function showQuiz4Q(){
  if(quiz4Idx>=QUIZ_V4.length){
    const pct=Math.round(quiz4Score/QUIZ_V4.length*100);
    const grade=pct>=90?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D';
    document.getElementById('quiz4-area').innerHTML=`<div style="font-size:28px;font-weight:700;color:var(--accent);margin:16px 0">${grade}</div><div>${quiz4Score}/${QUIZ_V4.length} (${pct}%)</div><button onclick="startQuiz4()" style="margin-top:12px;padding:8px 20px;border-radius:8px;border:none;background:var(--accent);color:white;cursor:pointer">\u{B2E4}\u{C2DC}</button>`;
    quiz4Active=false;ls13Set('quiz4Best',Math.max(ls13Get('quiz4Best',0),quiz4Score));
    ls13Set('dailyQuiz',(ls13Get('dailyQuiz',0))+1);return;
  }
  const q=QUIZ_V4[quiz4Idx];
  document.getElementById('quiz4-area').innerHTML=`<div style="font-size:11px;color:var(--text2);margin-bottom:8px">${quiz4Idx+1}/${QUIZ_V4.length}</div>
    <div style="font-size:14px;font-weight:600;margin-bottom:16px">${q.q}</div>
    <div style="display:flex;flex-direction:column;gap:8px">${q.o.map((opt,i)=>
      `<button onclick="answerQuiz4(${i})" style="padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left">${opt}</button>`
    ).join('')}</div>`;
}
window.answerQuiz4=function(idx){
  if(!quiz4Active) return;
  if(idx===QUIZ_V4[quiz4Idx].a){quiz4Score++;playSFX13('quiz4_correct');}
  else{if(typeof playSFX12==='function')playSFX12('sight_wrong');else playSFX13('scale_note');}
  quiz4Idx++;setTimeout(showQuiz4Q,300);
};

// ================ 11. ACHIEVEMENTS ================
const V13_ACH = [
  {id:'chord_student',name:'\u{CF54}\u{B4DC} \u{D559}\u{C0DD}',desc:'\u{CF54}\u{B4DC} 5\u{AC1C} \u{BCF4}\u{AE30}',icon:'\u{1F3B9}',check:()=>ls13Get('chordsViewed',0)>=5},
  {id:'chord_master',name:'\u{CF54}\u{B4DC} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{CF54}\u{B4DC} 15\u{AC1C} \u{BCF4}\u{AE30}',icon:'\u{1F3B6}',check:()=>ls13Get('chordsViewed',0)>=15},
  {id:'scale_student',name:'\u{C2A4}\u{CF00}\u{C77C} \u{D559}\u{C0DD}',desc:'\u{C2A4}\u{CF00}\u{C77C} 3\u{AC1C} \u{C5F0}\u{C2B5}',icon:'\u{1F3BC}',check:()=>ls13Get('scalesPracticed',0)>=3},
  {id:'scale_master',name:'\u{C2A4}\u{CF00}\u{C77C} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{C2A4}\u{CF00}\u{C77C} \u{C804}\u{BD80} \u{C5F0}\u{C2B5}',icon:'\u{1F3AF}',check:()=>ls13Get('scalesPracticed',0)>=12},
  {id:'metro_user',name:'\u{BA54}\u{D2B8}\u{B85C}\u{B188} \u{C0AC}\u{C6A9}\u{C790}',desc:'\u{BA54}\u{D2B8}\u{B85C}\u{B188} 5\u{D68C}',icon:'\u{23F1}\u{FE0F}',check:()=>ls13Get('metroUsed',0)>=5},
  {id:'duet_player',name:'\u{B4C0}\u{C5B3} \u{C5F0}\u{C8FC}\u{C790}',desc:'\u{B4C0}\u{C5B3} 3\u{ACE1}',icon:'\u{1F3BB}',check:()=>ls13Get('duetsPlayed',0)>=3},
  {id:'theory_student',name:'\u{C774}\u{B860} \u{D559}\u{C0DD}',desc:'\u{C774}\u{B860} 6\u{AC15}',icon:'\u{1F4D6}',check:()=>theoryRead.length>=6},
  {id:'theory_master',name:'\u{C774}\u{B860} \u{B9C8}\u{C2A4}\u{D130}',desc:'\u{C774}\u{B860} \u{C804}\u{BD80}',icon:'\u{1F4DA}',check:()=>theoryRead.length>=THEORY_LESSONS.length},
  {id:'daily_clear',name:'\u{B3C4}\u{C804} \u{C644}\u{B8CC}',desc:'\u{C77C}\u{C77C}\u{B3C4}\u{C804} 1\u{D68C}',icon:'\u{1F4C5}',check:()=>ls13Get('dailyCleared',0)>=1},
  {id:'daily_7',name:'7\u{C77C} \u{B3C4}\u{C804}',desc:'\u{C77C}\u{C77C}\u{B3C4}\u{C804} 7\u{D68C}',icon:'\u{1F525}',check:()=>ls13Get('dailyCleared',0)>=7},
  {id:'quiz4_pass',name:'\u{D000}\u{C988}v4 \u{D569}\u{ACA9}',desc:'60% \u{C774}\u{C0C1}',icon:'\u{1F3C6}',check:()=>ls13Get('quiz4Best',0)>=9},
  {id:'v13_explorer',name:'v13 \u{D0D0}\u{D5D8}\u{AC00}',desc:'6\u{AE30}\u{B2A5} \u{C0AC}\u{C6A9}',icon:'\u{1F680}',check:()=>{
    let c=0;if(ls13Get('chordsViewed',0)>0)c++;if(ls13Get('scalesPracticed',0)>0)c++;if(ls13Get('metroUsed',0)>0)c++;if(ls13Get('duetsPlayed',0)>0)c++;if(theoryRead.length>0)c++;if(ls13Get('quiz4Best',0)>0)c++;if(ls13Get('journalEntries',[]).length>0)c++;return c>=6;}}
];

function checkV13Achievements(){
  let u=ls13Get('unlockedAch13',[]);
  V13_ACH.forEach(a=>{
    if(!u.includes(a.id)&&a.check()){u.push(a.id);ls13Set('unlockedAch13',u);
      if(window.app&&window.app.showToast) window.app.showToast(`\u{1F3C6} \u{C5C5}\u{C801}: ${a.icon} ${a.name}`,'achievement');
      playSFX13('v13_achieve');}
  });
}

function injectV13Achievements(){
  const grid=document.querySelector('.achievement-grid');if(!grid) return;
  const u=ls13Get('unlockedAch13',[]);
  V13_ACH.forEach(a=>{
    const el=document.createElement('div');
    el.className='achievement'+(u.includes(a.id)?' unlocked':'');
    el.style.cssText='padding:8px;text-align:center;border-radius:8px;border:1px solid var(--border);background:var(--surface2)';
    el.innerHTML=`<div class="achievement-icon">${a.icon}</div><div>${a.name}</div><div style="font-size:8px;margin-top:2px">${a.desc}</div>`;
    grid.appendChild(el);
  });
}

// ================ 12. QUICK ACTIONS & SHORTCUTS ================
function injectV13QuickActions(){
  const tabSongs=document.getElementById('tab-songs');if(!tabSongs) return;
  const bar=document.createElement('div');
  bar.className='v13-quick-actions';
  bar.style.cssText='display:flex;gap:4px;padding:6px 8px;flex-wrap:wrap;border-bottom:1px solid var(--border)';
  [{label:'\u{1F3B9} \u{CF54}\u{B4DC}\u{C0AC}\u{C804}',fn:()=>document.getElementById('chord-dict-modal').style.display='flex'},
   {label:'\u{1F3BC} \u{C2A4}\u{CF00}\u{C77C}',fn:()=>document.getElementById('scale-modal').style.display='flex'},
   {label:'\u{23F1}\u{FE0F} \u{BA54}\u{D2B8}\u{B85C}\u{B188}',fn:()=>document.getElementById('metro-modal').style.display='flex'},
   {label:'\u{1F3BB} \u{B4C0}\u{C5B3}',fn:()=>document.getElementById('duet-modal').style.display='flex'},
   {label:'\u{1F4D6} \u{C774}\u{B860}',fn:()=>{document.getElementById('theory-modal').style.display='flex';renderTheoryList();}},
   {label:'\u{1F4C5} \u{B3C4}\u{C804}',fn:()=>{document.getElementById('daily-modal').style.display='flex';renderDailyChallenges();}},
   {label:'\u{1F4CA} \u{B9AC}\u{D3EC}\u{D2B8}',fn:()=>{document.getElementById('report-modal').style.display='flex';drawReportRadar();}},
   {label:'\u{1F4DD} \u{C77C}\u{C9C0}',fn:()=>{document.getElementById('journal-modal').style.display='flex';renderJournalEntries();}},
   {label:'\u{1F3C6} \u{D000}\u{C988}v4',fn:()=>document.getElementById('quiz4-modal').style.display='flex'}
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
      case 'C':if(!e.ctrlKey){e.preventDefault();document.getElementById('chord-dict-modal').style.display='flex';}break;
      case 'X':e.preventDefault();document.getElementById('scale-modal').style.display='flex';break;
      case 'O':e.preventDefault();document.getElementById('metro-modal').style.display='flex';break;
      case 'U':e.preventDefault();document.getElementById('duet-modal').style.display='flex';break;
      case 'Y':e.preventDefault();document.getElementById('theory-modal').style.display='flex';renderTheoryList();break;
      case 'I':e.preventDefault();document.getElementById('daily-modal').style.display='flex';renderDailyChallenges();break;
      case 'R':if(!e.ctrlKey){e.preventDefault();document.getElementById('report-modal').style.display='flex';drawReportRadar();}break;
      case 'J':e.preventDefault();document.getElementById('journal-modal').style.display='flex';renderJournalEntries();break;
    }
  });
}

// ================ INIT ================
function initV13(){
  addV13Songs();
  buildChordDictUI();
  buildScaleUI();
  buildMetronomeUI();
  buildDuetUI();
  buildTheoryUI();
  buildDailyChallengeUI();
  buildReportUI();
  buildJournalUI();
  buildQuizV4UI();
  injectV13QuickActions();
  injectV13Achievements();
  setupV13Shortcuts();
  setInterval(checkV13Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(initV13,2000));
else setTimeout(initV13,2000);
})();
