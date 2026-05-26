// Piano Master v9 Patch Module
// Metronome, Music Theory, Analytics Dashboard, Transpose, Duet Mode,
// Song Recommender, Interval Training, 10 Songs, 12 Achievements, SFX 6
(function(){
'use strict';
if(window.__v9Loaded) return;
window.__v9Loaded = true;

const LS9 = 'piano-v9-';
function ls9Get(k,d){try{return JSON.parse(localStorage.getItem(LS9+k))||d}catch{return d}}
function ls9Set(k,v){localStorage.setItem(LS9+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v9 ================
const sfx9 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch{return null}
})();
function playSFX9(type){
  if(!sfx9) return;
  if(sfx9.state==='suspended') sfx9.resume();
  const t=sfx9.currentTime, g=sfx9.createGain(), o=sfx9.createOscillator();
  g.connect(sfx9.destination); o.connect(g);
  switch(type){
    case 'metronome_tick':
      o.type='sine';o.frequency.setValueAtTime(1000,t);
      g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.start(t);o.stop(t+0.05);break;
    case 'metronome_accent':
      o.type='sine';o.frequency.setValueAtTime(1500,t);
      g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      o.start(t);o.stop(t+0.06);break;
    case 'theory_correct':
      o.type='triangle';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(784,t+0.15);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
      o.start(t);o.stop(t+0.25);break;
    case 'transpose':
      o.type='sine';o.frequency.setValueAtTime(660,t);o.frequency.linearRampToValueAtTime(880,t+0.12);
      g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
      o.start(t);o.stop(t+0.18);break;
    case 'interval_play':
      o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(660,t+0.2);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o.start(t);o.stop(t+0.3);break;
    case 'recommend':
      o.type='triangle';o.frequency.setValueAtTime(880,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);
      const o2=sfx9.createOscillator(),g2=sfx9.createGain();
      g2.connect(sfx9.destination);o2.connect(g2);o2.type='triangle';
      o2.frequency.setValueAtTime(1100,t+0.1);
      g2.gain.setValueAtTime(0.08,t+0.1);g2.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      o2.start(t+0.1);o2.stop(t+0.3);break;
  }
}

// ================ 1. METRONOME ================
let metroInterval = null;
let metroBPM = ls9Get('metroBPM', 120);
let metroBeats = ls9Get('metroBeats', 4);
let metroBeatCount = 0;
let metroRunning = false;

function buildMetronomeUI(){
  const modal = document.createElement('div');
  modal.id = 'metronome-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,360px);text-align:center">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="font-size:16px;color:var(--accent)">&#9000; &#47700;&#53944;&#47196;&#45464;</h2>
      <button id="metro-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="metro-visual" style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">
      ${Array.from({length:4},(_,i)=>`<div class="metro-dot" data-idx="${i}" style="width:28px;height:28px;border-radius:50%;border:2px solid var(--border);transition:0.1s"></div>`).join('')}
    </div>
    <div style="font-size:48px;font-weight:900;color:var(--accent);margin:8px 0" id="metro-bpm-display">${metroBPM}</div>
    <div style="font-size:11px;color:var(--text2);margin-bottom:12px">BPM</div>
    <input type="range" id="metro-bpm-slider" min="40" max="220" value="${metroBPM}" style="width:80%;accent-color:var(--accent)">
    <div style="display:flex;gap:6px;justify-content:center;margin:12px 0">
      <button class="metro-preset" data-bpm="60" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">Largo 60</button>
      <button class="metro-preset" data-bpm="90" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">Andante 90</button>
      <button class="metro-preset" data-bpm="120" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">Allegro 120</button>
      <button class="metro-preset" data-bpm="160" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer">Presto 160</button>
    </div>
    <div style="display:flex;gap:6px;align-items:center;justify-content:center;margin:8px 0">
      <span style="font-size:11px;color:var(--text2)">박자:</span>
      ${[2,3,4,6].map(b=>`<button class="metro-time" data-beats="${b}" style="padding:3px 8px;border-radius:4px;border:1px solid ${b===metroBeats?'var(--accent)':'var(--border)'};background:${b===metroBeats?'var(--accent)':'var(--surface2)'};color:${b===metroBeats?'white':'var(--text)'};font-size:10px;cursor:pointer">${b}/4</button>`).join('')}
    </div>
    <button id="metro-toggle" style="margin-top:12px;padding:10px 32px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;font-weight:700;cursor:pointer">&#9654; &#49884;&#51089;</button>
  </div>`;
  document.body.appendChild(modal);

  modal.querySelector('#metro-close').addEventListener('click',()=>{stopMetronome();modal.style.display='none'});
  modal.addEventListener('click',e=>{if(e.target===modal){stopMetronome();modal.style.display='none'}});

  const slider = modal.querySelector('#metro-bpm-slider');
  const display = modal.querySelector('#metro-bpm-display');
  slider.addEventListener('input',()=>{
    metroBPM = +slider.value;
    display.textContent = metroBPM;
    ls9Set('metroBPM', metroBPM);
    if(metroRunning){stopMetronome();startMetronome();}
  });

  modal.querySelectorAll('.metro-preset').forEach(btn=>{
    btn.addEventListener('click',()=>{
      metroBPM = +btn.dataset.bpm;
      slider.value = metroBPM;
      display.textContent = metroBPM;
      ls9Set('metroBPM', metroBPM);
      if(metroRunning){stopMetronome();startMetronome();}
    });
  });

  modal.querySelectorAll('.metro-time').forEach(btn=>{
    btn.addEventListener('click',()=>{
      metroBeats = +btn.dataset.beats;
      ls9Set('metroBeats', metroBeats);
      modal.querySelectorAll('.metro-time').forEach(b=>{b.style.borderColor='var(--border)';b.style.background='var(--surface2)';b.style.color='var(--text)'});
      btn.style.borderColor='var(--accent)';btn.style.background='var(--accent)';btn.style.color='white';
      updateMetroDots();
      if(metroRunning){stopMetronome();startMetronome();}
    });
  });

  modal.querySelector('#metro-toggle').addEventListener('click',()=>{
    if(metroRunning) stopMetronome(); else startMetronome();
  });
}

function updateMetroDots(){
  const container = document.getElementById('metro-visual');
  if(!container) return;
  container.innerHTML = Array.from({length:metroBeats},(_,i)=>`<div class="metro-dot" data-idx="${i}" style="width:28px;height:28px;border-radius:50%;border:2px solid var(--border);transition:0.1s"></div>`).join('');
}

function startMetronome(){
  metroRunning = true;
  metroBeatCount = 0;
  const btn = document.getElementById('metro-toggle');
  if(btn) btn.innerHTML = '&#9632; &#51221;&#51648;';
  const ms = 60000 / metroBPM;
  tick();
  metroInterval = setInterval(tick, ms);
}

function tick(){
  const dots = document.querySelectorAll('.metro-dot');
  dots.forEach(d=>{ d.style.background='transparent'; d.style.borderColor='var(--border)'; });
  const idx = metroBeatCount % metroBeats;
  const dot = dots[idx];
  if(dot){
    if(idx===0){
      dot.style.background='var(--accent)';dot.style.borderColor='var(--accent)';
      playSFX9('metronome_accent');
    } else {
      dot.style.background='var(--green)';dot.style.borderColor='var(--green)';
      playSFX9('metronome_tick');
    }
  }
  metroBeatCount++;
}

function stopMetronome(){
  metroRunning = false;
  if(metroInterval){clearInterval(metroInterval);metroInterval=null;}
  const btn = document.getElementById('metro-toggle');
  if(btn) btn.innerHTML = '&#9654; &#49884;&#51089;';
  document.querySelectorAll('.metro-dot').forEach(d=>{d.style.background='transparent';d.style.borderColor='var(--border)'});
  metroBeatCount = 0;
}

// ================ 2. MUSIC THEORY ================
const THEORY_ITEMS = [
  {cat:'음표',title:'온음표',content:'4박자 길이. 마디 전체를 채우는 가장 긴 기본 음표. 기호: &#9675;'},
  {cat:'음표',title:'2분음표',content:'2박자 길이. 온음표의 절반. 한 마디에 2개. 기호: &#119134;'},
  {cat:'음표',title:'4분음표',content:'1박자 길이. 가장 기본적인 박자 단위. 기호: &#9833;'},
  {cat:'음표',title:'8분음표/16분음표',content:'8분음표=0.5박, 16분음표=0.25박. 빠른 패시지에 사용.'},
  {cat:'음정',title:'장/단 음정',content:'장2도(온음), 단2도(반음), 장3도(온+온), 단3도(온+반). 화음의 기초.'},
  {cat:'음정',title:'완전 음정',content:'완전1도(유니즌), 완전4도, 완전5도, 완전8도(옥타브). 협화음의 핵심.'},
  {cat:'음정',title:'증/감 음정',content:'완전음정을 반음 올리면 증음정, 내리면 감음정. 증4도=트라이톤.'},
  {cat:'조성',title:'장조 (Major)',content:'온-온-반-온-온-온-반 구조. 밝고 안정적인 느낌. C장조=흰건반만.'},
  {cat:'조성',title:'단조 (Minor)',content:'자연단조: 온-반-온-온-반-온-온. 어둡고 슬픈 분위기. Am=A부터 흰건반.'},
  {cat:'조성',title:'조표 (Key Signature)',content:'샾(#)/플랫(b) 수로 조성 파악. 샾 순서: FCGDAEB, 플랫 순서: BEADGCF'},
  {cat:'박자',title:'4/4박자',content:'한 마디에 4분음표 4개. 가장 흔한 박자. Common Time이라고도 함.'},
  {cat:'박자',title:'3/4박자',content:'한 마디에 4분음표 3개. 왈츠의 기본 박자. 강-약-약 패턴.'},
  {cat:'박자',title:'6/8박자',content:'한 마디에 8분음표 6개. 2개 그룹x3. 흔들리는 리듬감.'},
  {cat:'피아노',title:'페달 사용법',content:'댐퍼 페달(오른쪽): 음 지속. 소프트 페달(왼쪽): 음량 감소. 소스테누토(가운데): 선택적 지속.'},
  {cat:'피아노',title:'손 자세',content:'손가락 번호: 엄지=1, 검지=2, 중지=3, 약지=4, 새끼=5. 달걀 쥔 듯 둥글게.'}
];

function buildTheoryUI(){
  const modal = document.createElement('div');
  modal.id = 'theory-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  const cats = [...new Set(THEORY_ITEMS.map(t=>t.cat))];
  let activeCat = cats[0];
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:85vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128218; &#51020;&#50501; &#51060;&#47200;</h2>
      <button id="theory-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="theory-tabs" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">
      ${cats.map(c=>`<button class="theory-tab" data-cat="${c}" style="padding:4px 10px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:10px;cursor:pointer">${c}</button>`).join('')}
    </div>
    <div id="theory-list"></div>
  </div>`;
  document.body.appendChild(modal);

  function renderTheory(cat){
    const list = modal.querySelector('#theory-list');
    const items = THEORY_ITEMS.filter(t=>t.cat===cat);
    const read = ls9Get('theoryRead',[]);
    list.innerHTML = items.map(item=>{
      const isRead = read.includes(item.title);
      return `<div style="background:var(--surface2);border:1px solid ${isRead?'var(--green)':'var(--border)'};border-radius:8px;padding:10px;margin-bottom:6px;cursor:pointer" class="theory-item" data-title="${item.title}">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:10px;color:${isRead?'var(--green)':'var(--text2)'}">${isRead?'&#10003;':''}</span>
          <span style="font-size:13px;font-weight:600;color:var(--text)">${item.title}</span>
        </div>
        <div style="font-size:11px;color:var(--text2);margin-top:4px;line-height:1.5">${item.content}</div>
      </div>`;
    }).join('');
    list.querySelectorAll('.theory-item').forEach(el=>{
      el.addEventListener('click',()=>{
        const title = el.dataset.title;
        const rd = ls9Get('theoryRead',[]);
        if(!rd.includes(title)){rd.push(title);ls9Set('theoryRead',rd);playSFX9('theory_correct');}
        el.style.borderColor='var(--green)';
        el.querySelector('span').textContent = '✓';
        el.querySelector('span').style.color = 'var(--green)';
        checkV9Achievements();
      });
    });
  }

  modal.querySelectorAll('.theory-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      modal.querySelectorAll('.theory-tab').forEach(t=>{t.style.borderColor='var(--border)';t.style.background='var(--surface2)';t.style.color='var(--text2)'});
      tab.style.borderColor='var(--accent)';tab.style.background='var(--accent)';tab.style.color='white';
      renderTheory(tab.dataset.cat);
    });
  });

  modal.querySelector('#theory-close').addEventListener('click',()=>{modal.style.display='none'});
  modal.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none'});

  const firstTab = modal.querySelector('.theory-tab');
  if(firstTab){firstTab.style.borderColor='var(--accent)';firstTab.style.background='var(--accent)';firstTab.style.color='white';}
  renderTheory(cats[0]);
}

// ================ 3. ANALYTICS DASHBOARD ================
function buildAnalyticsUI(){
  const modal = document.createElement('div');
  modal.id = 'analytics-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,400px);max-height:85vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128200; &#50672;&#51452; &#48516;&#49437;</h2>
      <button id="analytics-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="analytics-content"></div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#analytics-close').addEventListener('click',()=>{modal.style.display='none'});
  modal.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none'});
}

function renderAnalytics(){
  const container = document.getElementById('analytics-content');
  if(!container) return;
  const stats = window.app ? window.app.stats : {};
  const totalPlays = stats.totalPlays || 0;
  const totalNotes = stats.totalNotes || 0;
  const totalScore = stats.totalScore || 0;
  const streak = stats.streak || 0;
  const completed = stats.songsCompleted ? stats.songsCompleted.size : 0;
  const perfect = stats.perfectSongs ? stats.perfectSongs.size : 0;
  const totalTime = stats.totalPlayTime || 0;
  const hours = Math.floor(totalTime/3600);
  const mins = Math.floor((totalTime%3600)/60);
  const songCount = (typeof SONGS !== 'undefined') ? SONGS.length : 52;
  const completePct = Math.round((completed/songCount)*100);

  const weekly = ls9Get('weeklyData',[0,0,0,0,0,0,0]);
  const maxW = Math.max(...weekly,1);

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div style="background:var(--surface2);padding:10px;border-radius:8px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">&#52509; &#50672;&#51452;</div>
        <div style="font-size:20px;font-weight:700;color:var(--accent)">${totalPlays}</div>
      </div>
      <div style="background:var(--surface2);padding:10px;border-radius:8px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">&#52509; &#45432;&#53944;</div>
        <div style="font-size:20px;font-weight:700;color:var(--green)">${totalNotes.toLocaleString()}</div>
      </div>
      <div style="background:var(--surface2);padding:10px;border-radius:8px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">&#50672;&#49845;&#49884;&#44036;</div>
        <div style="font-size:20px;font-weight:700;color:var(--purple)">${hours}h ${mins}m</div>
      </div>
      <div style="background:var(--surface2);padding:10px;border-radius:8px;text-align:center">
        <div style="font-size:9px;color:var(--text2)">&#50672;&#49549; &#49828;&#53944;&#47533;</div>
        <div style="font-size:20px;font-weight:700;color:var(--yellow)">${streak}&#51068;</div>
      </div>
    </div>
    <div style="background:var(--surface2);padding:12px;border-radius:8px;margin-bottom:8px">
      <div style="font-size:11px;color:var(--accent);margin-bottom:6px">&#44257; &#50756;&#51452;&#50984;</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${completePct}%;background:linear-gradient(90deg,var(--accent),var(--purple));border-radius:3px"></div>
        </div>
        <span style="font-size:11px;font-weight:700;color:var(--accent)">${completed}/${songCount}</span>
      </div>
      <div style="font-size:10px;color:var(--text2);margin-top:4px">&#54140;&#54169;&#53944;: ${perfect}&#44257; | &#52509;&#51216;: ${totalScore.toLocaleString()}</div>
    </div>
    <div style="background:var(--surface2);padding:12px;border-radius:8px;margin-bottom:8px">
      <div style="font-size:11px;color:var(--accent);margin-bottom:8px">&#51452;&#44036;&#48324; &#50672;&#49845;&#47049; (&#44257;)</div>
      <div style="display:flex;align-items:flex-end;gap:4px;height:60px">
        ${['&#51068;','&#50900;','&#54868;','&#49688;','&#47785;','&#44552;','&#53664;'].map((day,i)=>{
          const h = weekly[i] > 0 ? Math.max(8, (weekly[i]/maxW)*52) : 4;
          return `<div style="flex:1;text-align:center">
            <div style="height:${h}px;background:${weekly[i]>0?'var(--accent)':'var(--border)'};border-radius:2px;margin-bottom:2px"></div>
            <div style="font-size:8px;color:var(--text2)">${day}</div>
            <div style="font-size:8px;color:var(--accent)">${weekly[i]}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div style="background:var(--surface2);padding:12px;border-radius:8px">
      <div style="font-size:11px;color:var(--accent);margin-bottom:8px">&#45212;&#51060;&#46020;&#48324; &#50756;&#51452;</div>
      ${['easy','medium','hard','expert'].map(diff=>{
        const total = (typeof SONGS!=='undefined'?SONGS:[]).filter(s=>s.difficulty===diff).length;
        const done = (typeof SONGS!=='undefined'?SONGS:[]).filter(s=>s.difficulty===diff && stats.songsCompleted && stats.songsCompleted.has(s.id)).length;
        const pct = total>0?Math.round(done/total*100):0;
        const colors = {easy:'var(--green)',medium:'var(--yellow)',hard:'var(--red)',expert:'var(--purple)'};
        const labels = {easy:'Easy',medium:'Medium',hard:'Hard',expert:'Expert'};
        return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="font-size:10px;color:${colors[diff]};width:48px">${labels[diff]}</span>
          <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${colors[diff]};border-radius:2px"></div>
          </div>
          <span style="font-size:9px;color:var(--text2)">${done}/${total}</span>
        </div>`;
      }).join('')}
    </div>`;
}

function trackWeekly(){
  const weekly = ls9Get('weeklyData',[0,0,0,0,0,0,0]);
  const lastWeek = ls9Get('weeklyStart','');
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const ws = weekStart.toDateString();
  if(lastWeek !== ws){
    ls9Set('weeklyData',[0,0,0,0,0,0,0]);
    ls9Set('weeklyStart', ws);
  }
}

function recordWeeklyPlay(){
  trackWeekly();
  const weekly = ls9Get('weeklyData',[0,0,0,0,0,0,0]);
  const day = new Date().getDay();
  weekly[day]++;
  ls9Set('weeklyData', weekly);
}

// ================ 4. TRANSPOSE ================
let transposeAmount = 0;

function buildTransposeUI(){
  const ctrl = document.querySelector('.top-controls');
  if(!ctrl || document.getElementById('transpose-ctrl')) return;
  const wrap = document.createElement('div');
  wrap.id = 'transpose-ctrl';
  wrap.className = 'ctrl-group';
  wrap.innerHTML = `<button class="ctrl-btn" id="tr-down" title="&#48152;&#51020; &#45236;&#47548;">-</button>
    <span id="tr-display" style="font-size:10px;color:var(--cyan);min-width:28px;text-align:center">0</span>
    <button class="ctrl-btn" id="tr-up" title="&#48152;&#51020; &#50732;&#47548;">+</button>`;
  ctrl.appendChild(wrap);

  document.getElementById('tr-down').addEventListener('click',()=>setTranspose(transposeAmount-1));
  document.getElementById('tr-up').addEventListener('click',()=>setTranspose(transposeAmount+1));
}

function setTranspose(val){
  transposeAmount = Math.max(-6, Math.min(6, val));
  const display = document.getElementById('tr-display');
  if(display){
    display.textContent = transposeAmount > 0 ? '+'+transposeAmount : transposeAmount.toString();
    display.style.color = transposeAmount === 0 ? 'var(--cyan)' : transposeAmount > 0 ? 'var(--yellow)' : 'var(--purple)';
  }
  playSFX9('transpose');
}

function transposeNote(noteName){
  if(transposeAmount === 0) return noteName;
  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
  if(!match) return noteName;
  let name = match[1], oct = parseInt(match[2]);
  const enharmonics = {'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B','B#':'C','E#':'F'};
  if(enharmonics[name]) name = enharmonics[name];
  let idx = noteNames.indexOf(name);
  if(idx === -1) return noteName;
  idx += transposeAmount;
  while(idx < 0){idx += 12; oct--;}
  while(idx >= 12){idx -= 12; oct++;}
  return noteNames[idx] + oct;
}

function hookTranspose(){
  if(!window.app) return;
  const origStart = window.app.startSong;
  if(!origStart) return;
  window.app.startSong = function(idx){
    if(transposeAmount !== 0 && typeof SONGS !== 'undefined' && SONGS[idx]){
      const song = SONGS[idx];
      song._origNotes = song._origNotes || JSON.parse(JSON.stringify(song.notes));
      song.notes = song._origNotes.map(n => ({...n, note: transposeNote(n.note)}));
    }
    origStart.call(window.app, idx);
  };
}

// ================ 5. DUET MODE ================
let duetMode = false;

function buildDuetUI(){
  const ctrl = document.querySelector('.top-controls');
  if(!ctrl || document.getElementById('duet-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'duet-btn';
  btn.className = 'ctrl-btn';
  btn.textContent = 'Duet';
  btn.title = '2&#51064; &#46272;&#50631; &#47784;&#46300;';
  btn.addEventListener('click',()=>{
    duetMode = !duetMode;
    btn.classList.toggle('active', duetMode);
    applyDuetSplit();
    if(window.app) window.app.showToast(duetMode ? '&#127929; &#46272;&#50631; &#47784;&#46300; ON - &#44148;&#48152; &#48516;&#54624;' : '&#46272;&#50631; &#47784;&#46300; OFF');
  });
  ctrl.appendChild(btn);
}

function applyDuetSplit(){
  const keys = document.querySelectorAll('.white-key, .black-key');
  keys.forEach(key=>{
    if(!duetMode){
      key.style.removeProperty('opacity');
      return;
    }
    const note = key.dataset.note || '';
    const match = note.match(/(\d+)$/);
    if(match){
      const oct = parseInt(match[1]);
      if(oct <= 3){
        key.style.borderTopColor = 'var(--purple)';
      } else {
        key.style.borderTopColor = 'var(--cyan)';
      }
    }
  });
  if(duetMode){
    let indicator = document.getElementById('duet-indicator');
    if(!indicator){
      indicator = document.createElement('div');
      indicator.id = 'duet-indicator';
      indicator.style.cssText = 'position:absolute;top:4px;left:4px;z-index:10;display:flex;gap:8px;font-size:9px';
      indicator.innerHTML = '<span style="color:var(--purple)">&#9632; Player 1 (&#50812;&#49552;)</span><span style="color:var(--cyan)">&#9632; Player 2 (&#50724;&#47480;&#49552;)</span>';
      const piano = document.querySelector('.piano-container');
      if(piano) piano.style.position = 'relative', piano.appendChild(indicator);
    }
    indicator.style.display = 'flex';
  } else {
    const indicator = document.getElementById('duet-indicator');
    if(indicator) indicator.style.display = 'none';
  }
}

// ================ 6. SONG RECOMMENDER ================
function buildRecommenderUI(){
  const modal = document.createElement('div');
  modal.id = 'recommend-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px);max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#128161; AI &#44257; &#52628;&#52380;</h2>
      <button id="rec-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div id="rec-list"></div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#rec-close').addEventListener('click',()=>{modal.style.display='none'});
  modal.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none'});
}

function renderRecommendations(){
  const list = document.getElementById('rec-list');
  if(!list || typeof SONGS === 'undefined') return;
  const stats = window.app ? window.app.stats : {songsCompleted:new Set(),bestScores:{}};
  const completed = stats.songsCompleted || new Set();
  const notPlayed = SONGS.filter(s=>!completed.has(s.id));
  const played = SONGS.filter(s=>completed.has(s.id));

  const recommendations = [];
  const diffOrder = ['easy','medium','hard','expert'];

  if(notPlayed.length > 0){
    const maxDiff = played.length > 0 ? Math.max(...played.map(s=>diffOrder.indexOf(s.difficulty))) : 0;
    const nextDiff = diffOrder[Math.min(maxDiff, diffOrder.length-1)];
    const sameDiff = notPlayed.filter(s=>s.difficulty===nextDiff);
    if(sameDiff.length > 0){
      recommendations.push({reason:'&#45212;&#51060;&#46020;&#50640; &#47582;&#45716; &#44257;',songs:sameDiff.slice(0,3)});
    }
    const catCounts = {};
    played.forEach(s=>{catCounts[s.category]=(catCounts[s.category]||0)+1});
    const favCat = Object.entries(catCounts).sort((a,b)=>b[1]-a[1])[0];
    if(favCat){
      const catSongs = notPlayed.filter(s=>s.category===favCat[0]).slice(0,3);
      if(catSongs.length > 0){
        recommendations.push({reason:`&#49440;&#54840; &#51109;&#47476;: ${favCat[0]}`,songs:catSongs});
      }
    }
    const newCats = [...new Set(notPlayed.map(s=>s.category))].filter(c=>!catCounts[c]);
    if(newCats.length > 0){
      const exploreSongs = newCats.flatMap(c=>notPlayed.filter(s=>s.category===c).slice(0,1)).slice(0,3);
      if(exploreSongs.length > 0){
        recommendations.push({reason:'&#49352;&#47196;&#50868; &#51109;&#47476; &#53456;&#54744;',songs:exploreSongs});
      }
    }
  }

  if(played.length > 0){
    const lowScores = played.filter(s=>{
      const best = stats.bestScores[s.id] || 0;
      return best < 800;
    }).slice(0,3);
    if(lowScores.length > 0){
      recommendations.push({reason:'&#51216;&#49688; &#44060;&#49440; &#44032;&#45733;',songs:lowScores});
    }
  }

  if(recommendations.length === 0){
    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2);font-size:12px">&#47784;&#46304; &#44257;&#51012; &#50756;&#51452;&#54664;&#49845;&#45768;&#45796;! &#54140;&#54169;&#53944;&#50640; &#46020;&#51204;&#54644;&#48372;&#49464;&#50836;.</div>';
    return;
  }

  list.innerHTML = recommendations.map(rec=>`
    <div style="margin-bottom:12px">
      <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:6px">${rec.reason}</div>
      ${rec.songs.map(s=>{
        const diffColors = {easy:'var(--green)',medium:'var(--yellow)',hard:'var(--red)',expert:'var(--purple)'};
        const diffLabels = {easy:'Easy',medium:'Medium',hard:'Hard',expert:'Expert'};
        return `<div class="rec-song" data-id="${s.id}" style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer">
          <span style="font-size:16px">${s.icon||'&#127925;'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
            <div style="font-size:9px;color:var(--text2)">${s.category}</div>
          </div>
          <span style="padding:2px 6px;border-radius:3px;font-size:9px;color:${diffColors[s.difficulty]};background:${diffColors[s.difficulty]}15">${diffLabels[s.difficulty]}</span>
        </div>`;
      }).join('')}
    </div>`).join('');

  list.querySelectorAll('.rec-song').forEach(el=>{
    el.addEventListener('click',()=>{
      const id = el.dataset.id;
      if(typeof SONGS!=='undefined' && window.app){
        const idx = SONGS.findIndex(s=>s.id===id);
        if(idx>=0){
          playSFX9('recommend');
          document.getElementById('recommend-modal').style.display='none';
          window.app.switchTab(1);
          window.app.selectSong(idx);
        }
      }
    });
  });
}

// ================ 7. INTERVAL TRAINING ================
const INTERVALS = [
  {name:'&#45800;2&#46020; (m2)',semitones:1},{name:'&#51109;2&#46020; (M2)',semitones:2},
  {name:'&#45800;3&#46020; (m3)',semitones:3},{name:'&#51109;3&#46020; (M3)',semitones:4},
  {name:'&#50756;&#51204;4&#46020; (P4)',semitones:5},{name:'&#51613;4&#46020;/&#44048;5&#46020; (TT)',semitones:6},
  {name:'&#50756;&#51204;5&#46020; (P5)',semitones:7},{name:'&#45800;6&#46020; (m6)',semitones:8},
  {name:'&#51109;6&#46020; (M6)',semitones:9},{name:'&#45800;7&#46020; (m7)',semitones:10},
  {name:'&#51109;7&#46020; (M7)',semitones:11},{name:'&#50756;&#51204;8&#46020; (P8)',semitones:12}
];

let intervalScore = 0;
let intervalRound = 0;
let intervalStreak = 0;
let currentInterval = null;

function buildIntervalUI(){
  const modal = document.createElement('div');
  modal.id = 'interval-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
  modal.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;width:min(92vw,380px)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="font-size:16px;color:var(--accent)">&#127911; &#51020;&#51221; &#53944;&#47112;&#51060;&#45789;</h2>
      <button id="interval-close" style="background:none;border:none;color:var(--text);font-size:18px;cursor:pointer">&times;</button>
    </div>
    <div style="text-align:center;margin-bottom:12px">
      <div style="font-size:11px;color:var(--text2)">Round <span id="int-round">0</span>/10 | Score: <span id="int-score">0</span> | Streak: <span id="int-streak">0</span></div>
    </div>
    <div style="text-align:center;margin-bottom:16px">
      <button id="int-play" style="padding:10px 24px;border-radius:8px;border:none;background:var(--accent);color:white;font-size:14px;cursor:pointer">&#127925; &#51116;&#49373;</button>
    </div>
    <div id="int-choices" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div>
    <div id="int-result" style="text-align:center;margin-top:12px;font-size:13px;display:none"></div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#interval-close').addEventListener('click',()=>{modal.style.display='none'});
  modal.addEventListener('click',e=>{if(e.target===modal) modal.style.display='none'});
  modal.querySelector('#int-play').addEventListener('click',()=>{
    if(currentInterval) playIntervalSound(currentInterval);
  });
}

function startIntervalRound(){
  intervalRound++;
  if(intervalRound > 10){
    showIntervalResult();
    return;
  }
  const idx = Math.floor(Math.random()*INTERVALS.length);
  currentInterval = INTERVALS[idx];
  document.getElementById('int-round').textContent = intervalRound;
  document.getElementById('int-result').style.display = 'none';

  const choices = [currentInterval];
  while(choices.length < 4){
    const r = INTERVALS[Math.floor(Math.random()*INTERVALS.length)];
    if(!choices.includes(r)) choices.push(r);
  }
  choices.sort(()=>Math.random()-0.5);

  const container = document.getElementById('int-choices');
  container.innerHTML = choices.map(c=>`<button class="int-choice" data-semitones="${c.semitones}" style="padding:8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">${c.name}</button>`).join('');
  container.querySelectorAll('.int-choice').forEach(btn=>{
    btn.addEventListener('click',()=>checkIntervalAnswer(+btn.dataset.semitones, btn));
  });

  playIntervalSound(currentInterval);
}

function playIntervalSound(interval){
  if(!sfx9) return;
  if(sfx9.state==='suspended') sfx9.resume();
  const baseFreq = 261.63;
  const t = sfx9.currentTime;
  const g1 = sfx9.createGain(), o1 = sfx9.createOscillator();
  g1.connect(sfx9.destination);o1.connect(g1);o1.type='sine';
  o1.frequency.setValueAtTime(baseFreq,t);
  g1.gain.setValueAtTime(0.15,t);g1.gain.exponentialRampToValueAtTime(0.001,t+0.6);
  o1.start(t);o1.stop(t+0.6);

  const freq2 = baseFreq * Math.pow(2, interval.semitones/12);
  const g2 = sfx9.createGain(), o2 = sfx9.createOscillator();
  g2.connect(sfx9.destination);o2.connect(g2);o2.type='sine';
  o2.frequency.setValueAtTime(freq2,t+0.7);
  g2.gain.setValueAtTime(0.15,t+0.7);g2.gain.exponentialRampToValueAtTime(0.001,t+1.3);
  o2.start(t+0.7);o2.stop(t+1.3);
}

function checkIntervalAnswer(semitones, btn){
  const correct = semitones === currentInterval.semitones;
  const result = document.getElementById('int-result');
  document.querySelectorAll('.int-choice').forEach(b=>{
    b.disabled = true;
    if(+b.dataset.semitones === currentInterval.semitones){
      b.style.borderColor='var(--green)';b.style.background='rgba(34,197,94,.15)';
    }
  });
  if(correct){
    intervalScore++;
    intervalStreak++;
    btn.style.borderColor='var(--green)';
    result.innerHTML = `<span style="color:var(--green)">&#10004; &#51221;&#45813;!</span>`;
    playSFX9('theory_correct');
  } else {
    intervalStreak = 0;
    btn.style.borderColor='var(--red)';btn.style.background='rgba(239,68,68,.15)';
    result.innerHTML = `<span style="color:var(--red)">&#10008; &#50724;&#45813;. &#51221;&#45813;: ${currentInterval.name}</span>`;
  }
  result.style.display = 'block';
  document.getElementById('int-score').textContent = intervalScore;
  document.getElementById('int-streak').textContent = intervalStreak;

  const best = ls9Get('intervalBestStreak',0);
  if(intervalStreak > best) ls9Set('intervalBestStreak', intervalStreak);
  ls9Set('intervalTotal', (ls9Get('intervalTotal',0))+1);
  if(correct) ls9Set('intervalCorrect', (ls9Get('intervalCorrect',0))+1);

  setTimeout(()=>startIntervalRound(), 1500);
}

function showIntervalResult(){
  const container = document.getElementById('int-choices');
  const result = document.getElementById('int-result');
  container.innerHTML = '';
  const pct = Math.round(intervalScore/10*100);
  let grade = 'F';
  if(pct>=95) grade='S'; else if(pct>=85) grade='A'; else if(pct>=70) grade='B'; else if(pct>=50) grade='C'; else if(pct>=30) grade='D';
  result.innerHTML = `<div style="font-size:36px;font-weight:900;color:var(--accent);margin:8px 0">${grade}</div>
    <div style="font-size:14px;color:var(--text)">&#51221;&#45813;&#50984;: ${pct}% (${intervalScore}/10)</div>
    <button id="int-retry" style="margin-top:12px;padding:8px 20px;border-radius:6px;border:none;background:var(--accent);color:white;font-size:12px;cursor:pointer">&#45796;&#49884; &#46020;&#51204;</button>`;
  result.style.display = 'block';
  result.querySelector('#int-retry').addEventListener('click',()=>{
    intervalScore=0;intervalRound=0;intervalStreak=0;
    startIntervalRound();
  });
  checkV9Achievements();
}

// ================ 8. TEN NEW SONGS ================
function addNewSongs(){
  if(typeof SONGS === 'undefined') return;
  const newSongs = [
    {
      id:'spring_waltz', name:'&#48388; &#50752;&#52768; (&#49660;&#54077;)', category:'&#53364;&#47000;&#49885;', difficulty:'hard',
      icon:'&#127800;', bpm:130,
      notes:[
        {note:'E5',time:0,dur:0.3},{note:'D5',time:0.4,dur:0.3},{note:'C5',time:0.8,dur:0.5},
        {note:'D5',time:1.4,dur:0.3},{note:'E5',time:1.8,dur:0.3},{note:'F5',time:2.2,dur:0.5},
        {note:'E5',time:2.8,dur:0.3},{note:'D5',time:3.2,dur:0.3},{note:'C5',time:3.6,dur:0.5},
        {note:'B4',time:4.2,dur:0.3},{note:'A4',time:4.6,dur:0.3},{note:'G4',time:5.0,dur:0.5},
        {note:'A4',time:5.6,dur:0.3},{note:'B4',time:6.0,dur:0.3},{note:'C5',time:6.4,dur:0.8},
        {note:'E5',time:7.4,dur:0.3},{note:'D5',time:7.8,dur:0.3},{note:'C5',time:8.2,dur:0.5},
        {note:'B4',time:8.8,dur:0.3},{note:'C5',time:9.2,dur:0.3},{note:'D5',time:9.6,dur:0.8},
        {note:'G4',time:10.6,dur:0.3},{note:'A4',time:11.0,dur:0.3},{note:'B4',time:11.4,dur:0.5},
        {note:'C5',time:12.0,dur:1.0}
      ]
    },
    {
      id:'la_campanella', name:'&#46972; &#52852;&#54028;&#45356;&#46972; (&#47532;&#49828;&#53944;)', category:'&#53364;&#47000;&#49885;', difficulty:'expert',
      icon:'&#128276;', bpm:150,
      notes:[
        {note:'G#5',time:0,dur:0.15},{note:'G#5',time:0.2,dur:0.15},{note:'A5',time:0.4,dur:0.15},
        {note:'G#5',time:0.6,dur:0.15},{note:'F#5',time:0.8,dur:0.15},{note:'G#5',time:1.0,dur:0.15},
        {note:'E5',time:1.2,dur:0.3},{note:'D#5',time:1.6,dur:0.15},{note:'E5',time:1.8,dur:0.15},
        {note:'F#5',time:2.0,dur:0.15},{note:'E5',time:2.2,dur:0.15},{note:'D#5',time:2.4,dur:0.3},
        {note:'C#5',time:2.8,dur:0.15},{note:'D#5',time:3.0,dur:0.15},{note:'E5',time:3.2,dur:0.15},
        {note:'D#5',time:3.4,dur:0.15},{note:'C#5',time:3.6,dur:0.15},{note:'B4',time:3.8,dur:0.3},
        {note:'G#4',time:4.2,dur:0.3},{note:'A4',time:4.6,dur:0.15},{note:'B4',time:4.8,dur:0.15},
        {note:'C#5',time:5.0,dur:0.3},{note:'D#5',time:5.4,dur:0.3},{note:'E5',time:5.8,dur:0.5},
        {note:'G#5',time:6.4,dur:0.3},{note:'F#5',time:6.8,dur:0.15},{note:'E5',time:7.0,dur:0.15},
        {note:'D#5',time:7.2,dur:0.8}
      ]
    },
    {
      id:'river_dance', name:'&#44053;&#44148;&#45320;&#54200; (&#50689;&#44397;&#48124;&#50836;)', category:'&#54045;', difficulty:'medium',
      icon:'&#127754;', bpm:100,
      notes:[
        {note:'E4',time:0,dur:0.5},{note:'G4',time:0.6,dur:0.5},{note:'A4',time:1.2,dur:0.5},
        {note:'B4',time:1.8,dur:0.5},{note:'A4',time:2.4,dur:0.5},{note:'G4',time:3.0,dur:0.5},
        {note:'E4',time:3.6,dur:0.5},{note:'D4',time:4.2,dur:0.5},{note:'E4',time:4.8,dur:1.0},
        {note:'E4',time:6.0,dur:0.5},{note:'G4',time:6.6,dur:0.5},{note:'A4',time:7.2,dur:0.5},
        {note:'B4',time:7.8,dur:0.5},{note:'D5',time:8.4,dur:0.5},{note:'B4',time:9.0,dur:0.5},
        {note:'A4',time:9.6,dur:0.5},{note:'G4',time:10.2,dur:0.5},{note:'A4',time:10.8,dur:1.0}
      ]
    },
    {
      id:'hanok_lullaby', name:'&#51088;&#51109;&#44032; (&#54620;&#44397;)', category:'&#54620;&#44397; &#48124;&#50836;', difficulty:'easy',
      icon:'&#127769;', bpm:80,
      notes:[
        {note:'G4',time:0,dur:0.8},{note:'E4',time:1.0,dur:0.4},{note:'G4',time:1.6,dur:0.8},
        {note:'A4',time:2.6,dur:0.4},{note:'G4',time:3.2,dur:0.8},{note:'E4',time:4.2,dur:0.4},
        {note:'D4',time:4.8,dur:1.0},{note:'C4',time:6.0,dur:0.4},{note:'D4',time:6.6,dur:0.4},
        {note:'E4',time:7.2,dur:0.8},{note:'G4',time:8.2,dur:0.4},{note:'A4',time:8.8,dur:0.8},
        {note:'G4',time:9.8,dur:0.4},{note:'E4',time:10.4,dur:0.8},{note:'D4',time:11.4,dur:1.0}
      ]
    },
    {
      id:'pathetique', name:'&#48708;&#52285; (&#48288;&#53664;&#48292;)', category:'&#53364;&#47000;&#49885;', difficulty:'hard',
      icon:'&#127927;', bpm:72,
      notes:[
        {note:'C4',time:0,dur:1.0},{note:'Eb4',time:1.2,dur:0.5},{note:'G4',time:1.8,dur:0.5},
        {note:'Bb4',time:2.4,dur:0.5},{note:'Ab4',time:3.0,dur:0.5},{note:'G4',time:3.6,dur:1.0},
        {note:'F4',time:4.8,dur:0.5},{note:'Eb4',time:5.4,dur:0.5},{note:'D4',time:6.0,dur:0.5},
        {note:'C4',time:6.6,dur:0.5},{note:'Eb4',time:7.2,dur:0.8},{note:'G4',time:8.2,dur:0.5},
        {note:'C5',time:8.8,dur:0.5},{note:'Bb4',time:9.4,dur:0.5},{note:'Ab4',time:10.0,dur:0.5},
        {note:'G4',time:10.6,dur:0.5},{note:'F4',time:11.2,dur:0.5},{note:'Eb4',time:11.8,dur:1.0}
      ]
    },
    {
      id:'blue_danube', name:'&#50500;&#47492;&#45796;&#50868; &#46020;&#45208;&#50864;&#44053; (&#49800;&#53944;&#46972;&#50864;&#49828;)', category:'&#53364;&#47000;&#49885;', difficulty:'medium',
      icon:'&#127754;', bpm:180,
      notes:[
        {note:'C5',time:0,dur:0.5},{note:'E5',time:0.6,dur:0.5},{note:'G5',time:1.2,dur:0.8},
        {note:'G5',time:2.2,dur:0.5},{note:'F5',time:2.8,dur:0.3},{note:'E5',time:3.2,dur:0.5},
        {note:'C5',time:3.8,dur:0.5},{note:'D5',time:4.4,dur:0.5},{note:'F5',time:5.0,dur:0.8},
        {note:'F5',time:6.0,dur:0.5},{note:'E5',time:6.6,dur:0.3},{note:'D5',time:7.0,dur:0.5},
        {note:'B4',time:7.6,dur:0.5},{note:'C5',time:8.2,dur:0.5},{note:'E5',time:8.8,dur:0.8},
        {note:'G5',time:9.8,dur:0.5},{note:'F5',time:10.4,dur:0.3},{note:'E5',time:10.8,dur:0.5},
        {note:'D5',time:11.4,dur:0.5},{note:'C5',time:12.0,dur:1.0}
      ]
    },
    {
      id:'galaxy_train', name:'&#51008;&#54616;&#52384;&#46020;999 OST', category:'&#44172;&#51076;/&#50528;&#45768;', difficulty:'medium',
      icon:'&#128643;', bpm:120,
      notes:[
        {note:'E4',time:0,dur:0.5},{note:'F#4',time:0.6,dur:0.5},{note:'G4',time:1.2,dur:0.5},
        {note:'A4',time:1.8,dur:0.5},{note:'B4',time:2.4,dur:1.0},{note:'A4',time:3.6,dur:0.5},
        {note:'G4',time:4.2,dur:0.5},{note:'F#4',time:4.8,dur:0.5},{note:'E4',time:5.4,dur:1.0},
        {note:'D4',time:6.6,dur:0.5},{note:'E4',time:7.2,dur:0.5},{note:'F#4',time:7.8,dur:0.5},
        {note:'G4',time:8.4,dur:0.5},{note:'A4',time:9.0,dur:0.5},{note:'B4',time:9.6,dur:0.5},
        {note:'A4',time:10.2,dur:0.5},{note:'G4',time:10.8,dur:0.5},{note:'E4',time:11.4,dur:1.0}
      ]
    },
    {
      id:'minuet_g', name:'&#48120;&#45684;&#50640;&#53944; G&#51109;&#51312; (&#48148;&#54764;)', category:'&#53364;&#47000;&#49885;', difficulty:'medium',
      icon:'&#127926;', bpm:112,
      notes:[
        {note:'D5',time:0,dur:0.4},{note:'G4',time:0.5,dur:0.2},{note:'A4',time:0.8,dur:0.2},
        {note:'B4',time:1.1,dur:0.2},{note:'C5',time:1.4,dur:0.2},{note:'D5',time:1.7,dur:0.4},
        {note:'G4',time:2.2,dur:0.4},{note:'G4',time:2.7,dur:0.4},
        {note:'E5',time:3.2,dur:0.4},{note:'C5',time:3.7,dur:0.2},{note:'D5',time:4.0,dur:0.2},
        {note:'E5',time:4.3,dur:0.2},{note:'F#5',time:4.6,dur:0.2},{note:'G5',time:4.9,dur:0.4},
        {note:'G4',time:5.4,dur:0.4},{note:'G4',time:5.9,dur:0.4},
        {note:'C5',time:6.4,dur:0.4},{note:'D5',time:6.9,dur:0.2},{note:'C5',time:7.2,dur:0.2},
        {note:'B4',time:7.5,dur:0.2},{note:'A4',time:7.8,dur:0.2},{note:'B4',time:8.1,dur:0.4},
        {note:'C5',time:8.6,dur:0.2},{note:'B4',time:8.9,dur:0.2},{note:'A4',time:9.2,dur:0.2},
        {note:'G4',time:9.5,dur:0.2},{note:'F#4',time:9.8,dur:0.4},
        {note:'G4',time:10.3,dur:0.2},{note:'A4',time:10.6,dur:0.2},{note:'B4',time:10.9,dur:0.2},
        {note:'G4',time:11.2,dur:0.2},{note:'A4',time:11.5,dur:0.6}
      ]
    },
    {
      id:'sailing_moon', name:'&#45804;&#48731; &#54637;&#54644; (&#46041;&#50836;)', category:'&#46041;&#50836;', difficulty:'easy',
      icon:'&#127769;', bpm:90,
      notes:[
        {note:'C4',time:0,dur:0.5},{note:'E4',time:0.6,dur:0.5},{note:'G4',time:1.2,dur:0.8},
        {note:'A4',time:2.2,dur:0.5},{note:'G4',time:2.8,dur:0.5},{note:'E4',time:3.4,dur:0.8},
        {note:'C4',time:4.4,dur:0.5},{note:'D4',time:5.0,dur:0.5},{note:'E4',time:5.6,dur:0.5},
        {note:'F4',time:6.2,dur:0.5},{note:'E4',time:6.8,dur:0.5},{note:'D4',time:7.4,dur:0.8},
        {note:'C4',time:8.4,dur:0.5},{note:'E4',time:9.0,dur:0.5},{note:'G4',time:9.6,dur:0.5},
        {note:'C5',time:10.2,dur:1.0}
      ]
    },
    {
      id:'polovtsian', name:'&#54260;&#47196;&#48288;&#52768; &#47924;&#44257; (&#48372;&#47196;&#46360;)', category:'&#53364;&#47000;&#49885;', difficulty:'medium',
      icon:'&#127925;', bpm:88,
      notes:[
        {note:'A4',time:0,dur:0.8},{note:'B4',time:1.0,dur:0.4},{note:'C#5',time:1.6,dur:0.8},
        {note:'B4',time:2.6,dur:0.4},{note:'A4',time:3.2,dur:0.8},{note:'F#4',time:4.2,dur:0.4},
        {note:'E4',time:4.8,dur:0.8},{note:'F#4',time:5.8,dur:0.4},{note:'A4',time:6.4,dur:0.8},
        {note:'B4',time:7.4,dur:0.4},{note:'A4',time:8.0,dur:0.8},{note:'F#4',time:9.0,dur:0.4},
        {note:'E4',time:9.6,dur:0.8},{note:'D4',time:10.6,dur:0.4},{note:'E4',time:11.2,dur:1.2}
      ]
    }
  ];

  newSongs.forEach(song=>{
    if(!SONGS.find(s=>s.id===song.id)){
      SONGS.push(song);
    }
  });
}

// ================ 9. V9 ACHIEVEMENTS (12 new, 36→48) ================
const V9_ACHIEVEMENTS = [
  {id:'songs_62',name:'&#45824;&#47049; &#50672;&#51452;',icon:'&#127911;',desc:'62&#44257; &#51204;&#48512; &#50756;&#51452;',
    check:()=>{const s=window.app?window.app.stats:{songsCompleted:new Set()};return (typeof SONGS!=='undefined')&&SONGS.every(x=>s.songsCompleted.has(x.id))}},
  {id:'metronome_used',name:'&#47532;&#46316; &#47560;&#49828;&#53552;',icon:'&#9000;',desc:'&#47700;&#53944;&#47196;&#45464; &#49324;&#50857;',
    check:()=>ls9Get('metroUsed',false)},
  {id:'theory_all',name:'&#51060;&#47200; &#48149;&#49324;',icon:'&#128218;',desc:'&#47784;&#46304; &#51060;&#47200; &#51069;&#44592;',
    check:()=>{const r=ls9Get('theoryRead',[]);return r.length>=THEORY_ITEMS.length}},
  {id:'transpose_used',name:'&#51312;&#50742;&#44608; &#54588;&#50500;&#45768;&#49828;&#53944;',icon:'&#127932;',desc:'&#51312;&#50742;&#44608; &#44592;&#45733; &#49324;&#50857;',
    check:()=>ls9Get('transposeUsed',false)},
  {id:'interval_10',name:'&#51020;&#44048; &#53944;&#47112;&#51060;&#45320;',icon:'&#127911;',desc:'&#51020;&#51221; &#53944;&#47112;&#51060;&#45789; 10&#46972;&#50868;&#46300;',
    check:()=>(ls9Get('intervalTotal',0))>=10},
  {id:'interval_streak5',name:'&#51020;&#51221; &#50672;&#49549;&#51221;&#45813;',icon:'&#128293;',desc:'&#51020;&#51221; 5&#50672;&#49549; &#51221;&#45813;',
    check:()=>(ls9Get('intervalBestStreak',0))>=5},
  {id:'recommend_used',name:'AI &#52628;&#52380; &#49324;&#50857;',icon:'&#128161;',desc:'&#44257; &#52628;&#52380; &#44592;&#45733; &#49324;&#50857;',
    check:()=>ls9Get('recUsed',false)},
  {id:'duet_played',name:'&#46272;&#50631; &#54540;&#47112;&#51060;&#50612;',icon:'&#127929;',desc:'&#46272;&#50637; &#47784;&#46300; &#49324;&#50857;',
    check:()=>ls9Get('duetUsed',false)},
  {id:'analytics_check',name:'&#48516;&#49437; &#51204;&#47928;&#44032;',icon:'&#128200;',desc:'&#50672;&#51452; &#48516;&#49437; &#54869;&#51064;',
    check:()=>ls9Get('analyticsViewed',false)},
  {id:'notes_10000',name:'&#47564; &#45432;&#53944; &#53364;&#47101;',icon:'&#127926;',desc:'10,000&#45432;&#53944; &#50672;&#51452;',
    check:()=>{const s=window.app?window.app.stats:{};return (s.totalNotes||0)>=10000}},
  {id:'streak_21',name:'21&#51068; &#49845;&#44288;',icon:'&#128170;',desc:'21&#51068; &#50672;&#49549; &#50672;&#49845;',
    check:()=>{const s=window.app?window.app.stats:{};return (s.streak||0)>=21}},
  {id:'score_50k',name:'5&#47564;&#51216; &#46028;&#54028;',icon:'&#128081;',desc:'&#45572;&#51201; 50,000&#51216;',
    check:()=>{const s=window.app?window.app.stats:{};return (s.totalScore||0)>=50000}}
];

function checkV9Achievements(){
  const unlocked = ls9Get('v9Unlocked',[]);
  let newOnes = [];
  V9_ACHIEVEMENTS.forEach(a=>{
    if(!unlocked.includes(a.id) && a.check()){
      unlocked.push(a.id);
      newOnes.push(a);
    }
  });
  if(newOnes.length > 0){
    ls9Set('v9Unlocked', unlocked);
    newOnes.forEach(a=>{
      if(window.app && window.app.showToast){
        window.app.showToast(`&#127942; &#50629;&#51201; &#54644;&#44552;: ${a.icon} ${a.name}`, 'achievement');
      }
    });
  }
}

function injectV9Achievements(){
  const grid = document.querySelector('.achievement-grid');
  if(!grid) return;
  const unlocked = ls9Get('v9Unlocked',[]);
  V9_ACHIEVEMENTS.forEach(a=>{
    if(grid.querySelector(`[data-ach="${a.id}"]`)) return;
    const el = document.createElement('div');
    el.className = 'achievement' + (unlocked.includes(a.id) ? ' unlocked' : '');
    el.dataset.ach = a.id;
    el.innerHTML = `<div class="achievement-icon">${a.icon}</div>${a.name}<br><span style="font-size:8px">${a.desc}</span>`;
    grid.appendChild(el);
  });
}

// ================ 10. QUICK ACTION BUTTONS ================
function injectQuickActions(){
  const container = document.querySelector('.practice-page') || document.querySelector('.settings-page');
  if(!container || document.getElementById('v9-quick-actions')) return;

  const wrap = document.createElement('div');
  wrap.id = 'v9-quick-actions';
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:8px;margin-bottom:8px';
  const buttons = [
    {label:'&#9000; &#47700;&#53944;&#47196;&#45464;',action:'metronome',color:'var(--accent)'},
    {label:'&#128218; &#51020;&#50501;&#51060;&#47200;',action:'theory',color:'var(--green)'},
    {label:'&#128200; &#50672;&#51452;&#48516;&#49437;',action:'analytics',color:'var(--purple)'},
    {label:'&#127911; &#51020;&#51221;&#53944;&#47112;&#51060;&#45789;',action:'interval',color:'var(--cyan)'},
    {label:'&#128161; AI&#52628;&#52380;',action:'recommend',color:'var(--yellow)'}
  ];

  wrap.innerHTML = buttons.map(b=>`<button class="v9-qbtn" data-action="${b.action}" style="padding:6px 12px;border-radius:6px;border:1px solid ${b.color};background:${b.color}15;color:${b.color};font-size:10px;font-weight:600;cursor:pointer">${b.label}</button>`).join('');
  const firstChild = container.firstChild;
  container.insertBefore(wrap, firstChild);

  wrap.querySelectorAll('.v9-qbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      switch(btn.dataset.action){
        case 'metronome':
          document.getElementById('metronome-modal').style.display='flex';
          ls9Set('metroUsed',true);
          checkV9Achievements();
          break;
        case 'theory':
          document.getElementById('theory-modal').style.display='flex';
          break;
        case 'analytics':
          renderAnalytics();
          document.getElementById('analytics-modal').style.display='flex';
          ls9Set('analyticsViewed',true);
          checkV9Achievements();
          break;
        case 'interval':
          intervalScore=0;intervalRound=0;intervalStreak=0;
          document.getElementById('interval-modal').style.display='flex';
          startIntervalRound();
          break;
        case 'recommend':
          renderRecommendations();
          document.getElementById('recommend-modal').style.display='flex';
          ls9Set('recUsed',true);
          playSFX9('recommend');
          checkV9Achievements();
          break;
      }
    });
  });
}

// ================ 11. KEYBOARD SHORTCUTS ================
function setupV9Shortcuts(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
    switch(e.key.toUpperCase()){
      case 'M':
        if(!e.ctrlKey && !e.altKey){
          const m = document.getElementById('metronome-modal');
          if(m){m.style.display = m.style.display==='flex'?'none':'flex';ls9Set('metroUsed',true);checkV9Achievements();}
        }
        break;
      case 'Y':
        const t = document.getElementById('theory-modal');
        if(t) t.style.display = t.style.display==='flex'?'none':'flex';
        break;
      case 'U':
        renderAnalytics();
        const a = document.getElementById('analytics-modal');
        if(a){a.style.display = a.style.display==='flex'?'none':'flex';ls9Set('analyticsViewed',true);checkV9Achievements();}
        break;
      case 'I':
        if(!e.ctrlKey){
          intervalScore=0;intervalRound=0;intervalStreak=0;
          const iv = document.getElementById('interval-modal');
          if(iv){iv.style.display = iv.style.display==='flex'?'none':'flex';if(iv.style.display==='flex') startIntervalRound();}
        }
        break;
      case 'R':
        if(!e.ctrlKey){
          renderRecommendations();
          const r = document.getElementById('recommend-modal');
          if(r){r.style.display = r.style.display==='flex'?'none':'flex';ls9Set('recUsed',true);playSFX9('recommend');checkV9Achievements();}
        }
        break;
    }
  });
}

// ================ 12. FINISHSONG HOOK ================
function hookFinishSong(){
  if(!window.app) return;
  const orig = window.app.finishSong;
  if(!orig) return;
  window.app.finishSong = function(){
    recordWeeklyPlay();
    if(transposeAmount !== 0) ls9Set('transposeUsed', true);
    if(duetMode) ls9Set('duetUsed', true);
    orig.call(window.app);
    setTimeout(()=>checkV9Achievements(), 500);
  };
}

// ================ INIT ================
function initV9(){
  addNewSongs();
  buildMetronomeUI();
  buildTheoryUI();
  buildAnalyticsUI();
  buildTransposeUI();
  buildDuetUI();
  buildRecommenderUI();
  buildIntervalUI();
  injectQuickActions();
  injectV9Achievements();
  setupV9Shortcuts();
  hookFinishSong();
  hookTranspose();
  trackWeekly();

  if(window.app && window.app.renderSongList){
    window.app.renderSongList();
  }

  checkV9Achievements();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(initV9, 300));
} else {
  setTimeout(initV9, 300);
}

})();
