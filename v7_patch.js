// Piano Master v7 Patch Module
// A-B Loop, Daily Challenge, Practice History, Haptic Feedback, 8 New Achievements, Song Preview
(function(){
'use strict';
if(window.__v7Loaded) return;
window.__v7Loaded = true;

// ================ A-B LOOP (구간 반복) ================
let abLoopA = null, abLoopB = null, abLoopActive = false;

function injectABLoopUI() {
  const ctrlBar = document.querySelector('#panel-synth .ctrl-bar');
  if (!ctrlBar || document.getElementById('ab-loop-wrap')) return;

  const wrap = document.createElement('span');
  wrap.id = 'ab-loop-wrap';
  wrap.style.cssText = 'display:inline-flex;gap:3px;align-items:center;';
  wrap.innerHTML = `
    <button class="btn btn-secondary" id="btn-ab-a" title="A 지점 설정" style="padding:2px 8px;font-size:11px">A</button>
    <button class="btn btn-secondary" id="btn-ab-b" title="B 지점 설정" style="padding:2px 8px;font-size:11px" disabled>B</button>
    <button class="btn btn-secondary" id="btn-ab-clear" title="구간 초기화" style="padding:2px 8px;font-size:11px;color:var(--red)" disabled>&#10005;</button>
    <span id="ab-status" style="font-size:10px;color:var(--text2)"></span>
  `;
  ctrlBar.appendChild(wrap);

  document.getElementById('btn-ab-a').addEventListener('click', function() {
    if (typeof synthRunning !== 'undefined' && synthRunning && typeof synthStartTime !== 'undefined') {
      const ctx = window.audioCtx;
      if (!ctx) return;
      abLoopA = ctx.currentTime - synthStartTime;
      this.style.color = 'var(--green)';
      this.textContent = 'A✓';
      document.getElementById('btn-ab-b').disabled = false;
      updateABStatus();
    } else {
      showToast('🎵 재생 중에 A 지점을 설정하세요');
    }
  });

  document.getElementById('btn-ab-b').addEventListener('click', function() {
    if (abLoopA !== null && typeof synthRunning !== 'undefined' && synthRunning) {
      const ctx = window.audioCtx;
      if (!ctx) return;
      abLoopB = ctx.currentTime - synthStartTime;
      if (abLoopB <= abLoopA) { showToast('B는 A 이후여야 합니다'); return; }
      this.style.color = 'var(--green)';
      this.textContent = 'B✓';
      abLoopActive = true;
      document.getElementById('btn-ab-clear').disabled = false;
      updateABStatus();
      showToast('🔁 A-B 구간 반복 활성화');
    }
  });

  document.getElementById('btn-ab-clear').addEventListener('click', clearABLoop);
}

function clearABLoop() {
  abLoopA = null; abLoopB = null; abLoopActive = false;
  const btnA = document.getElementById('btn-ab-a');
  const btnB = document.getElementById('btn-ab-b');
  if (btnA) { btnA.style.color = ''; btnA.textContent = 'A'; }
  if (btnB) { btnB.style.color = ''; btnB.textContent = 'B'; btnB.disabled = true; }
  const btnC = document.getElementById('btn-ab-clear');
  if (btnC) btnC.disabled = true;
  updateABStatus();
}

function updateABStatus() {
  const el = document.getElementById('ab-status');
  if (!el) return;
  if (abLoopA !== null && abLoopB !== null) {
    el.textContent = `🔁 ${abLoopA.toFixed(1)}s ~ ${abLoopB.toFixed(1)}s`;
  } else if (abLoopA !== null) {
    el.textContent = `A: ${abLoopA.toFixed(1)}s`;
  } else {
    el.textContent = '';
  }
}

// Hook into synthesia loop for A-B repeat
const origStopSynthesia = window.stopSynthesia;
if (origStopSynthesia) {
  window.stopSynthesia = function() {
    clearABLoop();
    origStopSynthesia();
  };
}

// ================ DAILY CHALLENGE ================
function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
}

function getDailyChallenge() {
  const seed = getDailySeed();
  const allLessons = [...(window.LESSONS?.beyer || []), ...(window.LESSONS?.songs || [])];
  if (!allLessons.length) return null;
  const idx = seed % allLessons.length;
  const lesson = allLessons[idx];
  const targetScore = 500 + (seed % 500);
  const saved = JSON.parse(localStorage.getItem('piano-v7-daily') || '{}');
  return {
    lesson,
    targetScore,
    date: new Date().toISOString().slice(0,10),
    completed: saved.date === new Date().toISOString().slice(0,10) && saved.completed
  };
}

function completeDailyChallenge() {
  localStorage.setItem('piano-v7-daily', JSON.stringify({
    date: new Date().toISOString().slice(0,10),
    completed: true
  }));
}

function injectDailyChallengeUI() {
  const learnPanel = document.getElementById('panel-learn');
  if (!learnPanel || document.getElementById('daily-challenge')) return;
  const searchWrap = learnPanel.querySelector('.search-wrap');
  if (!searchWrap) return;

  const challenge = getDailyChallenge();
  if (!challenge || !challenge.lesson) return;

  const div = document.createElement('div');
  div.id = 'daily-challenge';
  div.style.cssText = 'padding:8px 10px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,rgba(74,125,255,.08),rgba(168,85,247,.08));';
  const statusIcon = challenge.completed ? '✅' : '🎯';
  const statusText = challenge.completed ? '완료!' : `목표: ${challenge.targetScore}pt`;
  div.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;font-size:12px">
      <span style="font-size:18px">${statusIcon}</span>
      <div style="flex:1">
        <div style="font-weight:700;color:var(--accent);font-size:11px">📅 오늘의 챌린지</div>
        <div style="color:var(--text);font-size:12px;margin-top:2px">${challenge.lesson.name} &mdash; ${statusText}</div>
      </div>
      <button class="btn btn-primary" id="btn-daily-go" style="padding:4px 12px;font-size:11px">${challenge.completed ? '다시 도전' : '도전!'}</button>
    </div>
  `;
  searchWrap.parentNode.insertBefore(div, searchWrap.nextSibling);

  document.getElementById('btn-daily-go').addEventListener('click', () => {
    if (typeof openLesson === 'function') {
      openLesson(challenge.lesson.id);
    }
  });
}

// ================ PRACTICE HISTORY ================
function recordPracticeSession(songName, score) {
  const history = JSON.parse(localStorage.getItem('piano-v7-history') || '[]');
  history.unshift({
    date: new Date().toISOString(),
    song: songName,
    score: score
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem('piano-v7-history', JSON.stringify(history));
}

function injectPracticeHistoryUI() {
  const statsGrid = document.getElementById('stats-grid');
  if (!statsGrid || document.getElementById('practice-history-section')) return;

  const history = JSON.parse(localStorage.getItem('piano-v7-history') || '[]');

  const section = document.createElement('div');
  section.id = 'practice-history-section';
  section.innerHTML = `
    <div class="stats-section-title" style="margin-top:4px">📊 연습 기록</div>
    <div id="history-chart" style="padding:8px 10px;overflow-x:auto"></div>
  `;
  statsGrid.parentNode.insertBefore(section, statsGrid.nextSibling);

  renderHistoryChart(history);
}

function renderHistoryChart(history) {
  const el = document.getElementById('history-chart');
  if (!el) return;

  if (!history.length) {
    el.innerHTML = '<div style="text-align:center;color:var(--text2);font-size:12px;padding:16px">아직 연습 기록이 없습니다</div>';
    return;
  }

  const recent = history.slice(0, 10).reverse();
  const maxScore = Math.max(...recent.map(h => h.score), 100);

  const bars = recent.map(h => {
    const pct = Math.round(h.score / maxScore * 100);
    const d = new Date(h.date);
    const label = `${d.getMonth()+1}/${d.getDate()}`;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:32px">
      <span style="font-size:9px;color:var(--text2)">${h.score}</span>
      <div style="width:20px;height:60px;background:var(--border);border-radius:3px;display:flex;align-items:flex-end;overflow:hidden">
        <div style="width:100%;height:${pct}%;background:linear-gradient(180deg,var(--accent),var(--purple));border-radius:3px;transition:height .3s"></div>
      </div>
      <span style="font-size:8px;color:var(--text2)">${label}</span>
    </div>`;
  }).join('');

  el.innerHTML = `<div style="display:flex;gap:4px;align-items:flex-end;justify-content:center">${bars}</div>`;
}

// ================ HAPTIC FEEDBACK ================
function vibrateOnKey() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function hookHaptic() {
  const piano = document.getElementById('piano');
  if (!piano || piano.__hapticHooked) return;
  piano.__hapticHooked = true;
  piano.addEventListener('pointerdown', () => vibrateOnKey(), {passive:true});
}

// ================ SONG PREVIEW ================
function injectPreviewButtons() {
  const view = document.getElementById('lesson-view');
  if (!view || document.getElementById('btn-preview')) return;
  const actions = view.querySelector('.lesson-actions');
  if (!actions) return;

  const btn = document.createElement('button');
  btn.id = 'btn-preview';
  btn.className = 'btn btn-secondary';
  btn.style.cssText = 'border:1px solid var(--cyan);color:var(--cyan)';
  btn.textContent = '🔊 미리듣기';
  btn.title = '처음 8비트 미리듣기';
  actions.appendChild(btn);

  let previewTimer = null;
  btn.addEventListener('click', () => {
    if (previewTimer) { clearTimeout(previewTimer); previewTimer = null; btn.textContent = '🔊 미리듣기'; return; }
    const titleEl = document.getElementById('lesson-title');
    if (!titleEl) return;
    const name = titleEl.textContent;
    const allLessons = [...(window.LESSONS?.beyer||[]),...(window.LESSONS?.songs||[])];
    const lesson = allLessons.find(l => l.name === name);
    if (!lesson || !lesson.notes) return;

    const previewNotes = lesson.notes.filter(n => n.time < 8);
    btn.textContent = '■ 정지';

    if (typeof startSynthesia === 'function') {
      startSynthesia(previewNotes, lesson.bpm || 120, true, null);
      const duration = Math.max(...previewNotes.map(n => n.time + n.duration)) * 60000 / (lesson.bpm || 120);
      previewTimer = setTimeout(() => {
        if (typeof stopSynthesia === 'function') stopSynthesia();
        btn.textContent = '🔊 미리듣기';
        previewTimer = null;
      }, duration + 500);
    }
  });
}

// ================ 8 NEW ACHIEVEMENTS ================
function injectNewAchievements() {
  if (!window.ACHIEVEMENTS) return;
  const existing = window.ACHIEVEMENTS.map(a => a.id);

  const newAch = [
    {id:'ach_v7_daily',icon:'📅',name:'첫 챌린지',desc:'일일 챌린지를 완료하세요',check:()=>{
      const d=JSON.parse(localStorage.getItem('piano-v7-daily')||'{}'); return d.completed===true;
    }},
    {id:'ach_v7_10k',icon:'🎹',name:'10000 음표',desc:'10000개의 노트를 연주하세요',check:()=>{
      const s=JSON.parse(localStorage.getItem('piano-v5-stats')||'{}'); return (s.totalNotes||0)>=10000;
    }},
    {id:'ach_v7_45songs',icon:'🎶',name:'45곡 마스터',desc:'모든 45곡에서 별 1개 이상',check:()=>{
      const p=JSON.parse(localStorage.getItem('piano-v3-progress')||'{}');
      for(let i=1;i<=45;i++) if(!p['s'+i]||p['s'+i]<1) return false; return true;
    }},
    {id:'ach_v7_streak14',icon:'💪',name:'14일 연속',desc:'14일 연속 연습하세요',check:()=>{
      const s=JSON.parse(localStorage.getItem('piano-v5-stats')||'{}'); return (s.streak||0)>=14;
    }},
    {id:'ach_v7_combo200',icon:'🔥',name:'200 콤보',desc:'200 콤보를 달성하세요',check:()=>{
      const s=JSON.parse(localStorage.getItem('piano-v5-stats')||'{}'); return (s.maxCombo||0)>=200;
    }},
    {id:'ach_v7_20songs',icon:'🏆',name:'20곡 클리어',desc:'20곡을 완주하세요',check:()=>{
      const s=JSON.parse(localStorage.getItem('piano-v5-stats')||'{}'); return (s.songsCompleted||0)>=20;
    }},
    {id:'ach_v7_perfect80',icon:'🌟',name:'정확도 80%',desc:'Perfect 비율 80% 이상 달성',check:()=>{
      const s=JSON.parse(localStorage.getItem('piano-v5-stats')||'{}');
      return (s.totalNotes||0)>0&&((s.totalPerfect||0)/(s.totalNotes||1))>=0.8;
    }},
    {id:'ach_v7_rec5',icon:'🎤',name:'녹음 5회',desc:'5개의 녹음을 저장하세요',check:()=>{
      const r=JSON.parse(localStorage.getItem('piano-v3-recordings')||'[]'); return r.length>=5;
    }},
  ];

  newAch.forEach(a => {
    if (!existing.includes(a.id)) {
      window.ACHIEVEMENTS.push(a);
    }
  });
}

// ================ KEYBOARD SHORTCUT HELP ================
function injectShortcutHelp() {
  document.addEventListener('keydown', e => {
    if (e.key === '?' && !e.target.matches('input,select,textarea')) {
      e.preventDefault();
      const overlay = document.getElementById('shortcut-overlay');
      if (overlay) { overlay.remove(); return; }

      const div = document.createElement('div');
      div.id = 'shortcut-overlay';
      div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:300;display:flex;align-items:center;justify-content:center;cursor:pointer';
      div.innerHTML = `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;max-width:340px;width:90%;cursor:default" onclick="event.stopPropagation()">
        <h3 style="font-size:16px;margin-bottom:12px;color:var(--accent)">⌨️ 키보드 단축키</h3>
        <div style="font-size:12px;color:var(--text);line-height:2">
          <div><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">Z</kbd>~<kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">M</kbd> 하단 옥타브</div>
          <div><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">Q</kbd>~<kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">U</kbd> 상단 옥타브</div>
          <div><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">Space</kbd> 서스테인 페달</div>
          <div><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">←</kbd><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">→</kbd> 건반 스크롤</div>
          <div><kbd style="background:var(--bg);padding:1px 5px;border-radius:3px;border:1px solid var(--border);font-size:10px">?</kbd> 이 도움말 토글</div>
        </div>
        <button class="btn btn-primary" style="margin-top:12px;width:100%" onclick="this.closest('#shortcut-overlay').remove()">닫기</button>
      </div>`;
      div.addEventListener('click', () => div.remove());
      document.body.appendChild(div);
    }
  });
}

// ================ ENHANCED CSS ================
function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
    #daily-challenge { animation: dailySlideIn .3s ease-out; }
    @keyframes dailySlideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    .key-white:active, .key-black:active { transition: none !important; }
    #ab-loop-wrap .btn:hover { opacity: .85; }
    #practice-history-section .stats-section-title { display:flex; align-items:center; gap:6px; }
    @media (max-width:600px) {
      #ab-loop-wrap { font-size:10px; }
      #ab-loop-wrap .btn { padding:2px 6px; font-size:10px; }
      #daily-challenge { padding:6px 8px; }
    }
  `;
  document.head.appendChild(style);
}

// ================ HOOK RESULT MODAL FOR HISTORY + DAILY ================
function hookResultModal() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.target.id === 'result-modal' && m.target.classList.contains('show')) {
        const bodyEl = document.getElementById('result-body');
        if (!bodyEl) return;
        const scoreMatch = bodyEl.textContent.match(/(\d+)pt/);
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1]);
          const titleEl = document.getElementById('result-title');
          const songName = titleEl ? titleEl.textContent : 'Unknown';
          recordPracticeSession(songName, score);

          const challenge = getDailyChallenge();
          if (challenge && !challenge.completed && score >= challenge.targetScore) {
            completeDailyChallenge();
            if (typeof showToast === 'function') {
              showToast('🎯 일일 챌린지 완료!');
            }
            const dailyEl = document.getElementById('daily-challenge');
            if (dailyEl) {
              dailyEl.querySelector('span').textContent = '✅';
              const statusDiv = dailyEl.querySelector('div > div:last-of-type');
              if (statusDiv) statusDiv.textContent = challenge.lesson.name + ' — 완료!';
            }
          }
        }

        if (typeof checkAchievements === 'function') checkAchievements();
      }
    });
  });
  const modal = document.getElementById('result-modal');
  if (modal) observer.observe(modal, {attributes:true, attributeFilter:['class']});
}

// ================ SKIP TO CONTENT (WCAG) ================
function injectSkipToContent() {
  if (document.getElementById('skip-to-content')) return;
  const skip = document.createElement('a');
  skip.id = 'skip-to-content';
  skip.href = '#app';
  skip.textContent = 'Skip to content';
  skip.style.cssText = 'position:absolute;top:-40px;left:0;background:var(--accent);color:#fff;padding:8px 16px;z-index:9999;font-size:14px;transition:top .2s;border-radius:0 0 8px 0;text-decoration:none';
  skip.addEventListener('focus', () => { skip.style.top = '0'; });
  skip.addEventListener('blur', () => { skip.style.top = '-40px'; });
  document.body.insertBefore(skip, document.body.firstChild);
}

// ================ FOOTER ================
function injectFooter() {
  const app = document.getElementById('app');
  if (!app || document.getElementById('v7-footer')) return;
  const pianoWrap = document.getElementById('piano-wrap');
  if (!pianoWrap) return;

  const footer = document.createElement('div');
  footer.id = 'v7-footer';
  footer.style.cssText = 'padding:4px 10px;background:var(--surface);border-top:1px solid var(--border);font-size:9px;color:var(--text2);text-align:center;flex-shrink:0';
  footer.innerHTML = 'Piano Master v7.0 &mdash; PRIME Holdings &copy; 2026 &mdash; 45곡 · 55레슨 · 26업적';
  app.insertBefore(footer, pianoWrap);
}

// ================ INIT v7 ================
function initV7() {
  injectCSS();
  injectSkipToContent();
  injectNewAchievements();
  injectABLoopUI();
  injectDailyChallengeUI();
  injectPreviewButtons();
  injectShortcutHelp();
  hookHaptic();
  hookResultModal();
  injectFooter();

  const statsTab = document.querySelector('[data-tab="stats"]');
  if (statsTab) {
    statsTab.addEventListener('click', () => {
      setTimeout(injectPracticeHistoryUI, 50);
    });
  }

  if (typeof checkAchievements === 'function') {
    setTimeout(checkAchievements, 500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initV7, 200));
} else {
  setTimeout(initV7, 200);
}

})();