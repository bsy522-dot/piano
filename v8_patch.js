// Piano Master v8 Patch Module
// Tone Selector, Chord Learning, Scale Practice, Learning Path,
// Song Search, Particle Effects, Share Card, Personal Ranking,
// Practice Planner, 10 Achievements, SFX 6, Keyboard Shortcuts +5
(function(){
'use strict';
if(window.__v8Loaded) return;
window.__v8Loaded = true;

const LS_PREFIX = 'piano-v8-';
function lsGet(k,d){try{return JSON.parse(localStorage.getItem(LS_PREFIX+k))||d}catch{return d}}
function lsSet(k,v){localStorage.setItem(LS_PREFIX+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE ================
const sfxCtx = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX(type){
  if(!sfxCtx) return;
  if(sfxCtx.state==='suspended') sfxCtx.resume();
  const t=sfxCtx.currentTime, g=sfxCtx.createGain(), o=sfxCtx.createOscillator();
  g.connect(sfxCtx.destination);
  o.connect(g);
  switch(type){
    case 'chord_play':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(784,t+0.15);
      g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'scale_step':
      o.type='sine';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);break;
    case 'search':
      o.type='sine';o.frequency.setValueAtTime(1200,t);o.frequency.linearRampToValueAtTime(1400,t+0.08);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
    case 'share':
      o.type='triangle';o.frequency.setValueAtTime(660,t);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);
      const o2=sfxCtx.createOscillator(),g2=sfxCtx.createGain();
      g2.connect(sfxCtx.destination);o2.connect(g2);o2.type='triangle';
      o2.frequency.setValueAtTime(880,t+0.15);
      g2.gain.setValueAtTime(0.12,t+0.15);g2.gain.exponentialRampToValueAtTime(0.001,t+0.45);
      o2.start(t+0.15);o2.stop(t+0.45);break;
    case 'ranking':
      o.type='square';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.2);
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'particle':
      o.type='sine';o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(600,t+0.1);
      g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);break;
  }
}

// ================ TONE SELECTOR (4 Timbres) ================
const TONES = [
  {id:'grand', name:'Grand Piano', harmonics:[1,0.3,0.08,0.03,0.01], types:['sine','sine','sine','sine','sine'], attack:0.01, decay:0.5},
  {id:'bright', name:'Bright Piano', harmonics:[1,0.5,0.2,0.1,0.05], types:['sine','triangle','sine','sine','sine'], attack:0.005, decay:0.4},
  {id:'electric', name:'Electric Piano', harmonics:[1,0.6,0.3,0.15], types:['sine','sine','triangle','square'], attack:0.002, decay:0.6},
  {id:'harpsi', name:'Harpsichord', harmonics:[0.6,0.8,0.5,0.3,0.2], types:['sawtooth','square','sawtooth','square','sawtooth'], attack:0.001, decay:0.2}
];
let currentTone = lsGet('tone', 0);

function injectToneSelector(){
  const ctrl = document.querySelector('.top-controls');
  if(!ctrl || document.getElementById('tone-selector')) return;
  const wrap = document.createElement('div');
  wrap.id = 'tone-selector';
  wrap.className = 'ctrl-group';
  wrap.innerHTML = `<select id="toneSelect" style="background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:2px 4px;font-size:10px;max-width:90px">
    ${TONES.map((t,i)=>`<option value="${i}" ${i===currentTone?'selected':''}>${t.name}</option>`).join('')}
  </select>`;
  ctrl.insertBefore(wrap, ctrl.firstChild.nextSibling);
  document.getElementById('toneSelect').addEventListener('change', function(){
    currentTone = +this.value;
    lsSet('tone', currentTone);
  });
}

function hookAudioEngine(){
  if(!window.app || !window.app.audio) return;
  const engine = window.app.audio;
  const origPlay = engine.play.bind(engine);
  engine.play = function(noteName, duration, velocity){
    if(!this.ctx || !this.samples[noteName]) return;
    const freq = this.samples[noteName];
    const now = this.ctx.currentTime;
    const tone = TONES[currentTone];
    if(!tone){origPlay(noteName,duration,velocity);return;}
    const vel = (velocity||0.7) * 0.25;
    tone.harmonics.forEach((amp,i)=>{
      const g = this.ctx.createGain();
      g.connect(this.ctx.destination);
      g.gain.setValueAtTime(0,now);
      g.gain.linearRampToValueAtTime(vel*amp,now+tone.attack);
      g.gain.exponentialRampToValueAtTime(0.001,now+duration+tone.decay);
      const osc = this.ctx.createOscillator();
      osc.type = tone.types[i]||'sine';
      osc.frequency.setValueAtTime(freq*(i+1),now);
      osc.connect(g);
      osc.start(now);
      osc.stop(now+duration+tone.decay+0.05);
    });
  };
}

// ================ CHORD LEARNING MODE ================
const CHORDS = {
  'C Major':['C4','E4','G4'],'D Major':['D4','F#4','A4'],'E Major':['E4','G#4','B4'],
  'F Major':['F4','A4','C5'],'G Major':['G4','B4','D5'],'A Major':['A4','C#5','E5'],
  'Bb Major':['Bb4','D5','F5'],'Eb Major':['Eb4','G4','Bb4'],
  'C Minor':['C4','Eb4','G4'],'D Minor':['D4','F4','A4'],'E Minor':['E4','G4','B4'],
  'F Minor':['F4','Ab4','C5'],'G Minor':['G4','Bb4','D5'],'A Minor':['A4','C5','E5'],
  'B Minor':['B4','D5','F#5'],'F# Minor':['F#4','A4','C#5'],
  'C7':['C4','E4','G4','Bb4'],'G7':['G4','B4','D5','F5'],
  'D7':['D4','F#4','A4','C5'],'A7':['A4','C#5','E5','G5'],
  'Dm7':['D4','F4','A4','C5'],'Em7':['E4','G4','B4','D5'],
  'Am7':['A4','C5','E5','G5'],'Cmaj7':['C4','E4','G4','B4']
};

function buildChordUI(){
  const page = document.createElement('div');
  page.id = 'chord-learning-modal';
  page.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const majors = Object.keys(CHORDS).filter(k=>k.includes('Major'));
  const minors = Object.keys(CHORDS).filter(k=>k.includes('Minor'));
  const sevenths = Object.keys(CHORDS).filter(k=>k.includes('7'));
  page.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎵 코드 학습</h2>
      <button id="chord-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="chord-display" style="text-align:center;padding:16px 0;font-size:14px;color:var(--text2)">코드를 선택하세요</div>
    <div style="font-size:11px;color:var(--accent);margin:8px 0 4px">Major</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${majors.map(c=>`<button class="chord-btn" data-chord="${c}" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">${c.replace(' Major','')}</button>`).join('')}</div>
    <div style="font-size:11px;color:var(--purple);margin:8px 0 4px">Minor</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${minors.map(c=>`<button class="chord-btn" data-chord="${c}" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">${c.replace(' Minor','m')}</button>`).join('')}</div>
    <div style="font-size:11px;color:var(--cyan);margin:8px 0 4px">7th</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${sevenths.map(c=>`<button class="chord-btn" data-chord="${c}" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">${c}</button>`).join('')}</div>
  </div>`;
  document.body.appendChild(page);
  page.querySelector('#chord-close').addEventListener('click',()=>{page.style.display='none';clearChordHighlight()});
  page.addEventListener('click',e=>{if(e.target===page){page.style.display='none';clearChordHighlight()}});
  page.querySelectorAll('.chord-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const name = btn.dataset.chord;
      const notes = CHORDS[name];
      if(!notes) return;
      page.querySelectorAll('.chord-btn').forEach(b=>b.style.borderColor='var(--border)');
      btn.style.borderColor='var(--accent)';
      document.getElementById('chord-display').innerHTML = `<div style="font-size:20px;font-weight:700;color:var(--accent)">${name}</div>
        <div style="font-size:13px;color:var(--text);margin-top:4px">${notes.join(' - ')}</div>
        <button id="chord-play-btn" style="margin-top:8px;padding:6px 16px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">🎹 재생</button>`;
      document.getElementById('chord-play-btn').addEventListener('click',()=>{
        playChord(notes);
        playSFX('chord_play');
      });
      highlightChordKeys(notes);
    });
  });
}

function playChord(notes){
  if(!window.app || !window.app.audio) return;
  window.app.audio.init();
  notes.forEach((n,i)=>{
    setTimeout(()=>window.app.audio.play(n,0.8,0.5),i*50);
  });
}

function highlightChordKeys(notes){
  clearChordHighlight();
  const normalize = window.app ? window.app.normalizeNote.bind(window.app) : n=>n;
  notes.forEach(n=>{
    const norm = normalize(n);
    const key = document.querySelector(`[data-note="${norm}"]`) || document.querySelector(`[data-note="${n}"]`);
    if(key){key.classList.add('hint');key.setAttribute('data-chord-hl','1');}
  });
}

function clearChordHighlight(){
  document.querySelectorAll('[data-chord-hl]').forEach(k=>{k.classList.remove('hint');k.removeAttribute('data-chord-hl')});
}

// ================ SCALE PRACTICE ================
const SCALES = {
  'C Major':['C4','D4','E4','F4','G4','A4','B4','C5'],
  'G Major':['G4','A4','B4','C5','D5','E5','F#5','G5'],
  'D Major':['D4','E4','F#4','G4','A4','B4','C#5','D5'],
  'F Major':['F4','G4','A4','Bb4','C5','D5','E5','F5'],
  'A Minor':['A4','B4','C5','D5','E5','F5','G5','A5'],
  'D Minor':['D4','E4','F4','G4','A4','Bb4','C5','D5'],
  'E Minor':['E4','F#4','G4','A4','B4','C5','D5','E5'],
  'Bb Major':['Bb4','C5','D5','Eb5','F5','G5','A5','Bb5']
};

function buildScaleUI(){
  const page = document.createElement('div');
  page.id = 'scale-practice-modal';
  page.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  page.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px);max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">🎼 스케일 연습</h2>
      <button id="scale-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="scale-display" style="text-align:center;padding:12px 0;font-size:13px;color:var(--text2)">스케일을 선택하세요</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">
      ${Object.keys(SCALES).map(s=>`<button class="scale-btn" data-scale="${s}" style="padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">${s}</button>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(page);
  page.querySelector('#scale-close').addEventListener('click',()=>{page.style.display='none';clearChordHighlight()});
  page.addEventListener('click',e=>{if(e.target===page){page.style.display='none';clearChordHighlight()}});
  page.querySelectorAll('.scale-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const name = btn.dataset.scale;
      const notes = SCALES[name];
      if(!notes) return;
      page.querySelectorAll('.scale-btn').forEach(b=>b.style.borderColor='var(--border)');
      btn.style.borderColor='var(--accent)';
      document.getElementById('scale-display').innerHTML = `<div style="font-size:18px;font-weight:700;color:var(--accent)">${name}</div>
        <div style="font-size:12px;color:var(--text);margin-top:4px">${notes.join(' → ')}</div>
        <div style="display:flex;gap:4px;justify-content:center;margin-top:8px">
          <button id="scale-play-up" style="padding:5px 12px;border-radius:5px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">▲ 상행</button>
          <button id="scale-play-down" style="padding:5px 12px;border-radius:5px;border:none;background:var(--purple);color:white;font-size:11px;cursor:pointer">▼ 하행</button>
          <button id="scale-play-both" style="padding:5px 12px;border-radius:5px;border:none;background:var(--green);color:white;font-size:11px;cursor:pointer">↕ 왕복</button>
        </div>`;
      highlightChordKeys(notes);
      document.getElementById('scale-play-up').addEventListener('click',()=>playScale(notes,'up'));
      document.getElementById('scale-play-down').addEventListener('click',()=>playScale([...notes].reverse(),'down'));
      document.getElementById('scale-play-both').addEventListener('click',()=>playScale([...notes,...[...notes].reverse().slice(1)],'both'));
    });
  });
}

function playScale(notes, dir){
  if(!window.app || !window.app.audio) return;
  window.app.audio.init();
  clearChordHighlight();
  notes.forEach((n,i)=>{
    setTimeout(()=>{
      window.app.audio.play(n,0.25,0.5);
      playSFX('scale_step');
      clearChordHighlight();
      highlightChordKeys([n]);
    }, i*250);
  });
  setTimeout(()=>clearChordHighlight(), notes.length*250+200);
}

// ================ LEARNING PATH ================
const LEARNING_PATHS = [
  {level:'입문',icon:'🌱',color:'var(--green)',songs:['twinkle','mary','happy','abc','butterfly'],desc:'기초 멜로디와 리듬 익히기'},
  {level:'초급',icon:'🌿',color:'var(--cyan)',songs:['threebears','bingo','london','oldmac','arirang','doraji','brahms_lullaby','amazing_grace','school_bell','airplane'],desc:'다양한 동요와 민요 연주'},
  {level:'중급',icon:'🌳',color:'var(--yellow)',songs:['ode','minuet','canon','river','let_it_be','yesterday','tetris','mario','scarborough','edelweiss','santlucia','waltz','gymnopedie','spirited','imagine_song'],desc:'클래식과 팝 도전'},
  {level:'상급',icon:'🏔️',color:'var(--red)',songs:['fur_elise','moonlight','turk_march','entertainer','howl','clair_de_lune','nocturne_op9','spring','cancan'],desc:'고난도 클래식 정복'}
];

function buildLearningPathUI(){
  const page = document.createElement('div');
  page.id = 'learning-path-modal';
  page.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const stats = window.app ? window.app.stats : {songsCompleted:new Set()};
  let html = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px);max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">📚 학습 경로</h2>
      <button id="path-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>`;
  LEARNING_PATHS.forEach(lp=>{
    const total = lp.songs.length;
    const done = lp.songs.filter(id=>stats.songsCompleted.has(id)).length;
    const pct = total>0?Math.round(done/total*100):0;
    html += `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:20px">${lp.icon}</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:${lp.color}">${lp.level}</div>
          <div style="font-size:10px;color:var(--text2)">${lp.desc}</div>
        </div>
        <span style="font-size:12px;font-weight:700;color:${lp.color}">${done}/${total}</span>
      </div>
      <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${lp.color};border-radius:2px;transition:width .3s"></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:6px">
        ${lp.songs.map(id=>{
          const s = (typeof SONGS!=='undefined'?SONGS:[]).find(x=>x.id===id);
          const name = s?s.name:id;
          const completed = stats.songsCompleted.has(id);
          return `<span style="padding:2px 6px;border-radius:3px;font-size:9px;background:${completed?'rgba(34,197,94,.15)':'var(--bg)'};color:${completed?'var(--green)':'var(--text2)'};border:1px solid ${completed?'var(--green)':'var(--border)'}">${completed?'✅ ':''}${name}</span>`;
        }).join('')}
      </div>
    </div>`;
  });
  html += '</div>';
  page.innerHTML = html;
  document.body.appendChild(page);
  page.querySelector('#path-close').addEventListener('click',()=>{page.style.display='none'});
  page.addEventListener('click',e=>{if(e.target===page) page.style.display='none'});
}

// ================ SONG SEARCH ================
function injectSongSearch(){
  const filterBar = document.getElementById('filterBar');
  if(!filterBar || document.getElementById('song-search')) return;
  const wrap = document.createElement('div');
  wrap.id = 'song-search';
  wrap.style.cssText = 'width:100%;padding:0 8px 4px';
  wrap.innerHTML = `<input type="text" id="song-search-input" placeholder="🔍 곡 검색..." style="width:100%;padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;outline:none">`;
  filterBar.parentNode.insertBefore(wrap, filterBar);
  document.getElementById('song-search-input').addEventListener('input', function(){
    const q = this.value.toLowerCase().trim();
    if(!q){
      document.querySelectorAll('.song-card,.category-header,.category-songs').forEach(el=>el.style.display='');
      return;
    }
    playSFX('search');
    document.querySelectorAll('.category-header').forEach(h=>h.style.display='none');
    document.querySelectorAll('.category-songs').forEach(cs=>{cs.style.display='flex';cs.classList.remove('hidden')});
    document.querySelectorAll('.song-card').forEach(card=>{
      const name = card.querySelector('.song-name')?.textContent?.toLowerCase()||'';
      const meta = card.querySelector('.song-meta')?.textContent?.toLowerCase()||'';
      card.style.display = (name.includes(q)||meta.includes(q)) ? '' : 'none';
    });
  });
}

// ================ PARTICLE EFFECTS ================
let particles = [];
function spawnParticles(x, y, color){
  for(let i=0;i<8;i++){
    particles.push({
      x, y,
      vx: (Math.random()-0.5)*6,
      vy: -Math.random()*4-2,
      life: 1,
      color: color||'#4a7dff',
      size: Math.random()*3+1
    });
  }
}

function hookParticleSystem(){
  if(!window.app) return;
  const origRender = window.app.renderSynthesia.bind(window.app);
  window.app.renderSynthesia = function(){
    origRender();
    const ctx = this.canvasCtx;
    const W = this.canvas.width / (window.devicePixelRatio || 1);
    if(!ctx) return;
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life -= 0.03;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const origHandleNote = window.app.handleNoteInput.bind(window.app);
  window.app.handleNoteInput = function(noteName, velocity){
    origHandleNote(noteName, velocity);
    if(this.isPlaying && !this.isPaused){
      const pianoContainer = document.getElementById('pianoContainer');
      const norm = this.normalizeNote(noteName);
      const keyEl = document.querySelector(`[data-note="${norm}"]`);
      if(keyEl && pianoContainer){
        const scrollLeft = pianoContainer.scrollLeft;
        const viewW = pianoContainer.clientWidth;
        const canvasW = this.canvas.width / (window.devicePixelRatio || 1);
        const x = (keyEl.offsetLeft + keyEl.offsetWidth/2 - scrollLeft) / viewW * canvasW;
        const H = this.canvas.height / (window.devicePixelRatio || 1);
        const colors = ['#4a7dff','#22c55e','#a855f7','#eab308','#06b6d4','#ef4444'];
        spawnParticles(x, H-10, colors[Math.floor(Math.random()*colors.length)]);
      }
    }
  };
}

// ================ SHARE CARD ================
function buildShareCard(){
  if(!window.app) return;
  const s = window.app.stats;
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 380;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0,0,600,380);
  grad.addColorStop(0,'#0a0e1a');grad.addColorStop(0.5,'#141838');grad.addColorStop(1,'#1a1040');
  ctx.fillStyle = grad;
  ctx.beginPath();ctx.roundRect(0,0,600,380,16);ctx.fill();

  ctx.strokeStyle = '#4a7dff44';ctx.lineWidth = 2;
  ctx.beginPath();ctx.roundRect(2,2,596,376,16);ctx.stroke();

  ctx.fillStyle = '#4a7dff';ctx.font = 'bold 28px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('🎹 Piano Master v8',300,45);

  ctx.fillStyle = '#8892a8';ctx.font = '13px sans-serif';
  ctx.fillText(new Date().toLocaleDateString('ko-KR'),300,68);

  const metrics = [
    {label:'총 연주',value:`${s.totalPlays||0}회`,icon:'🎵'},
    {label:'완주곡',value:`${s.songsCompleted.size}곡`,icon:'✅'},
    {label:'퍼펙트',value:`${s.perfectSongs.size}곡`,icon:'⭐'},
    {label:'최대콤보',value:`${s.maxCombo||0}x`,icon:'🔥'},
    {label:'총 노트',value:`${s.totalNotes||0}`,icon:'🎶'},
    {label:'연속일수',value:`${s.streak||0}일`,icon:'📅'}
  ];

  metrics.forEach((m,i)=>{
    const col = i%3, row = Math.floor(i/3);
    const x = 60+col*200, y = 100+row*120;
    ctx.fillStyle = '#1a2040';
    ctx.beginPath();ctx.roundRect(x-50,y-10,160,90,8);ctx.fill();
    ctx.fillStyle = '#e8ecf4';ctx.font = '32px sans-serif';ctx.textAlign = 'center';
    ctx.fillText(m.icon, x+30, y+25);
    ctx.fillStyle = '#e8ecf4';ctx.font = 'bold 20px sans-serif';
    ctx.fillText(m.value, x+30, y+55);
    ctx.fillStyle = '#8892a8';ctx.font = '11px sans-serif';
    ctx.fillText(m.label, x+30, y+72);
  });

  ctx.fillStyle = '#4a7dff88';ctx.font = '10px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('PRIME Holdings - Piano Master',300,365);

  return canvas;
}

function showShareModal(){
  playSFX('share');
  const existing = document.getElementById('share-modal');
  if(existing) existing.remove();
  const canvas = buildShareCard();
  if(!canvas) return;

  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;max-width:92vw">
    <h3 style="font-size:14px;color:var(--accent);margin-bottom:8px">📤 공유 카드</h3>
    <div id="share-canvas-wrap" style="border-radius:8px;overflow:hidden"></div>
    <div style="display:flex;gap:6px;justify-content:center;margin-top:10px">
      <button id="share-download" style="padding:6px 14px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:11px;cursor:pointer">💾 다운로드</button>
      <button id="share-clipboard" style="padding:6px 14px;border-radius:6px;border:none;background:var(--purple);color:white;font-size:11px;cursor:pointer">📋 복사</button>
      <button id="share-close-btn" style="padding:6px 14px;border-radius:6px;border:none;background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">닫기</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  canvas.style.cssText = 'width:100%;max-width:480px;border-radius:8px';
  modal.querySelector('#share-canvas-wrap').appendChild(canvas);
  modal.querySelector('#share-download').addEventListener('click',()=>{
    const a = document.createElement('a');a.download='piano-master-card.png';a.href=canvas.toDataURL('image/png');a.click();
  });
  modal.querySelector('#share-clipboard').addEventListener('click',()=>{
    canvas.toBlob(blob=>{
      if(navigator.clipboard && navigator.clipboard.write){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>{
          if(window.app) window.app.showToast('📋 클립보드에 복사됨');
        }).catch(()=>{if(window.app) window.app.showToast('복사 실패 - 다운로드를 이용하세요')});
      }
    },'image/png');
  });
  modal.querySelector('#share-close-btn').addEventListener('click',()=>modal.remove());
  modal.addEventListener('click',e=>{if(e.target===modal) modal.remove()});
}

// ================ PERSONAL RANKING ================
function showRankingModal(){
  playSFX('ranking');
  const existing = document.getElementById('ranking-modal');
  if(existing) existing.remove();
  const stats = window.app ? window.app.stats : {};
  const scores = stats.bestScores||{};
  const entries = Object.entries(scores).map(([id,data])=>{
    const song = (typeof SONGS!=='undefined'?SONGS:[]).find(s=>s.id===id);
    return {name:song?song.name:id, ...data};
  }).sort((a,b)=>b.score-a.score).slice(0,20);

  const modal = document.createElement('div');
  modal.id = 'ranking-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const medals = ['🥇','🥈','🥉'];
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;width:min(92vw,380px);max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <h2 style="font-size:16px;color:var(--accent)">🏆 개인 랭킹 TOP 20</h2>
      <button id="ranking-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    ${entries.length===0?'<div style="text-align:center;color:var(--text2);padding:20px;font-size:12px">아직 기록이 없습니다</div>':''}
    ${entries.map((e,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;${i%2===0?'background:var(--surface2);':''}border-radius:4px;margin-bottom:2px">
      <span style="font-size:14px;width:24px;text-align:center">${i<3?medals[i]:(i+1)}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.name}</div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${{S:'var(--yellow)',A:'var(--green)',B:'var(--blue)',C:'var(--text2)',F:'var(--red)'}[e.grade]||'var(--text)'}">${e.grade}</span>
      <span style="font-size:12px;font-weight:700;color:var(--accent);min-width:50px;text-align:right">${e.score}pt</span>
    </div>`).join('')}
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#ranking-close').addEventListener('click',()=>modal.remove());
  modal.addEventListener('click',e=>{if(e.target===modal) modal.remove()});
}

// ================ PRACTICE PLANNER ================
function injectPracticePlanner(){
  const practicePage = document.getElementById('practicePage');
  if(!practicePage || document.getElementById('practice-planner')) return;
  const planner = lsGet('planner',{dailyGoal:3,todaySongs:0,todayDate:''});
  const today = new Date().toISOString().slice(0,10);
  if(planner.todayDate !== today){planner.todaySongs=0;planner.todayDate=today;lsSet('planner',planner);}
  const pct = Math.min(100, Math.round(planner.todaySongs/planner.dailyGoal*100));

  const div = document.createElement('div');
  div.id = 'practice-planner';
  div.className = 'practice-card';
  div.innerHTML = `<h3>📋 연습 플래너</h3>
    <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
      <span style="font-size:24px">${pct>=100?'🎉':'🎯'}</span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">오늘의 목표: ${planner.todaySongs}/${planner.dailyGoal}곡</div>
        <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-top:4px">
          <div style="height:100%;width:${pct}%;background:${pct>=100?'var(--green)':'var(--accent)'};border-radius:3px;transition:width .3s"></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:2px">
        <button class="planner-adj" data-delta="-1" style="padding:1px 6px;border-radius:3px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">-</button>
        <button class="planner-adj" data-delta="1" style="padding:1px 6px;border-radius:3px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">+</button>
      </div>
    </div>
    <div style="font-size:10px;color:var(--text2);margin-top:4px">${pct>=100?'오늘 목표 달성! 🎊':'곡을 완주하면 자동으로 카운트됩니다'}</div>`;
  const first = practicePage.firstChild;
  if(first) practicePage.insertBefore(div, first.nextSibling);
  else practicePage.appendChild(div);

  div.querySelectorAll('.planner-adj').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const p = lsGet('planner',{dailyGoal:3,todaySongs:0,todayDate:today});
      p.dailyGoal = Math.max(1, Math.min(20, p.dailyGoal + (+btn.dataset.delta)));
      lsSet('planner',p);
      div.remove();
      injectPracticePlanner();
    });
  });
}

function hookPlannerOnFinish(){
  if(!window.app) return;
  const origFinish = window.app.finishSong.bind(window.app);
  window.app.finishSong = function(){
    origFinish();
    const today = new Date().toISOString().slice(0,10);
    const p = lsGet('planner',{dailyGoal:3,todaySongs:0,todayDate:''});
    if(p.todayDate !== today){p.todaySongs=0;p.todayDate=today;}
    p.todaySongs++;
    lsSet('planner',p);
    if(p.todaySongs === p.dailyGoal){
      this.showToast('📋 오늘의 연습 목표 달성! 🎊','achievement');
    }
  };
}

// ================ 10 NEW ACHIEVEMENTS ================
function injectV8Achievements(){
  if(!window.app || !window.app.achievements) return;
  const existing = window.app.achievements.map(a=>a.id);
  const newAch = [
    {id:'v8_52songs',name:'52곡 도전자',icon:'🎹',desc:'50곡 이상 완주',check:s=>s.songsCompleted.size>=50,unlocked:false},
    {id:'v8_chord_master',name:'코드 마스터',icon:'🎵',desc:'코드 학습 모드 사용',check:()=>lsGet('chord_used',false),unlocked:false},
    {id:'v8_scale_runner',name:'스케일 러너',icon:'🎼',desc:'스케일 연습 모드 사용',check:()=>lsGet('scale_used',false),unlocked:false},
    {id:'v8_share_first',name:'첫 공유',icon:'📤',desc:'공유 카드 생성',check:()=>lsGet('shared',false),unlocked:false},
    {id:'v8_planner_7',name:'계획적 연습',icon:'📋',desc:'7일 연속 목표 달성',check:()=>lsGet('planner_streak',0)>=7,unlocked:false},
    {id:'v8_notes_20k',name:'2만 노트',icon:'🎶',desc:'누적 20000 노트 연주',check:s=>(s.totalNotes||0)>=20000,unlocked:false},
    {id:'v8_tone_try',name:'음색 탐험가',icon:'🔊',desc:'4가지 음색 모두 사용',check:()=>lsGet('tones_tried',[]).length>=4,unlocked:false},
    {id:'v8_beginner_path',name:'입문 졸업',icon:'🌱',desc:'입문 경로 전곡 완주',check:s=>LEARNING_PATHS[0].songs.every(id=>s.songsCompleted.has(id)),unlocked:false},
    {id:'v8_ranking_top',name:'최고 기록',icon:'🏆',desc:'1000점 이상 달성',check:s=>{const b=s.bestScores||{};return Object.values(b).some(x=>x.score>=1000)},unlocked:false},
    {id:'v8_streak21',name:'21일 습관',icon:'🔥',desc:'21일 연속 연습',check:s=>(s.streak||0)>=21,unlocked:false}
  ];
  newAch.forEach(a=>{
    if(!existing.includes(a.id)){
      window.app.achievements.push(a);
    }
  });
}

// ================ QUICK ACTION BUTTONS ================
function injectQuickActions(){
  const header = document.querySelector('.header');
  if(!header || document.getElementById('v8-quick-actions')) return;
  const wrap = document.createElement('div');
  wrap.id = 'v8-quick-actions';
  wrap.style.cssText = 'display:flex;gap:4px;padding:4px 8px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;overflow-x:auto';
  const actions = [
    {label:'🎵 코드',action:()=>{document.getElementById('chord-learning-modal').style.display='flex';lsSet('chord_used',true);trackToneUsage();}},
    {label:'🎼 스케일',action:()=>{document.getElementById('scale-practice-modal').style.display='flex';lsSet('scale_used',true);}},
    {label:'📚 학습경로',action:()=>{document.getElementById('learning-path-modal').style.display='flex';}},
    {label:'🏆 랭킹',action:showRankingModal},
    {label:'📤 공유',action:()=>{showShareModal();lsSet('shared',true);}}
  ];
  actions.forEach(a=>{
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:3px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer;white-space:nowrap;flex-shrink:0';
    btn.textContent = a.label;
    btn.addEventListener('click',a.action);
    wrap.appendChild(btn);
  });
  header.parentNode.insertBefore(wrap, header.nextSibling);
}

function trackToneUsage(){
  const tried = lsGet('tones_tried',[]);
  if(!tried.includes(currentTone)){tried.push(currentTone);lsSet('tones_tried',tried);}
}

// ================ KEYBOARD SHORTCUTS +5 ================
function injectV8Shortcuts(){
  document.addEventListener('keydown', e=>{
    if(e.target.matches('input,select,textarea')) return;
    switch(e.key.toUpperCase()){
      case 'K':
        e.preventDefault();
        const chordModal = document.getElementById('chord-learning-modal');
        if(chordModal) chordModal.style.display = chordModal.style.display==='flex'?'none':'flex';
        break;
      case 'J':
        e.preventDefault();
        const scaleModal = document.getElementById('scale-practice-modal');
        if(scaleModal) scaleModal.style.display = scaleModal.style.display==='flex'?'none':'flex';
        break;
      case 'P':
        e.preventDefault();
        const pathModal = document.getElementById('learning-path-modal');
        if(pathModal) pathModal.style.display = pathModal.style.display==='flex'?'none':'flex';
        break;
      case 'N':
        if(!e.ctrlKey){e.preventDefault();showRankingModal();}
        break;
      case 'O':
        e.preventDefault();showShareModal();lsSet('shared',true);
        break;
    }
  });
}

// ================ UPDATE FOOTER ================
function updateFooter(){
  const footer = document.getElementById('v7-footer');
  if(footer){
    const songCount = typeof SONGS!=='undefined'?SONGS.length:52;
    footer.innerHTML = `Piano Master v8.0 &mdash; PRIME Holdings &copy; 2026 &mdash; ${songCount}곡 &middot; 36업적 &middot; 4음색 &middot; 24코드 &middot; 8스케일`;
  }
}

// ================ ENHANCED CSS ================
function injectV8CSS(){
  const style = document.createElement('style');
  style.textContent = `
    #v8-quick-actions button:hover { border-color:var(--accent); background:rgba(74,125,255,.1); }
    #song-search-input:focus { border-color:var(--accent); box-shadow:0 0 0 2px rgba(74,125,255,.2); }
    .chord-btn:hover, .scale-btn:hover { border-color:var(--accent) !important; background:rgba(74,125,255,.1) !important; }
    @media (max-width:600px) {
      #v8-quick-actions { gap:3px; padding:3px 6px; }
      #v8-quick-actions button { padding:2px 6px; font-size:9px; }
      #tone-selector select { max-width:70px; font-size:9px; }
    }
  `;
  document.head.appendChild(style);
}

// ================ TONE CHANGE HOOK ================
function hookToneChange(){
  const sel = document.getElementById('toneSelect');
  if(sel){
    sel.addEventListener('change',()=>trackToneUsage());
  }
}

// ================ INIT v8 ================
function initV8(){
  injectV8CSS();
  hookAudioEngine();
  injectToneSelector();
  hookToneChange();
  buildChordUI();
  buildScaleUI();
  buildLearningPathUI();
  injectSongSearch();
  hookParticleSystem();
  injectV8Achievements();
  injectQuickActions();
  injectV8Shortcuts();
  hookPlannerOnFinish();
  updateFooter();

  const practiceTab = document.querySelector('[data-tab="practice"]');
  if(practiceTab){
    practiceTab.addEventListener('click',()=>setTimeout(injectPracticePlanner,100));
  }

  if(window.app){
    setTimeout(()=>{
      if(typeof window.app.checkAchievements === 'function') window.app.checkAchievements();
    },600);
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded',()=>setTimeout(initV8,400));
} else {
  setTimeout(initV8,400);
}

})();
