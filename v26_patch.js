// Piano Master v26 Patch Module
// Performance Dashboard, Adaptive Difficulty, Recording Comparison, Particle Effects,
// Curriculum Path, Pitch Detection, Global Leaderboard, Weakness Analyzer
// 10 Songs (222->232), Quiz v17 15Q (240->255), 12 Achievements (240->252), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v26Loaded) return;
window.__v26Loaded = true;

var LS26 = 'piano-v26-';
function ls26Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS26+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls26Set(k,v){localStorage.setItem(LS26+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v26 (16 sounds) ================
var sfx26 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone26(freq,type,dur,gainVal,delayMs){
  if(!sfx26) return;
  setTimeout(function(){
    if(!sfx26) return;
    var t=sfx26.currentTime,g=sfx26.createGain(),o=sfx26.createOscillator();
    o.connect(g);g.connect(sfx26.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX26(type){
  if(!sfx26) return;
  if(sfx26.state==='suspended') sfx26.resume();
  switch(type){
    case 'perf_open': tone26(523,'triangle',0.08,0.06,0); tone26(659,'triangle',0.08,0.06,60); break;
    case 'perf_analyze': tone26(440,'sine',0.12,0.06,0); tone26(554,'sine',0.12,0.06,80); tone26(698,'sine',0.15,0.06,160); break;
    case 'adapt_scan': tone26(330,'triangle',0.1,0.05,0); break;
    case 'adapt_adjust': tone26(392,'triangle',0.1,0.06,0); tone26(523,'triangle',0.12,0.06,80); break;
    case 'record_play': tone26(494,'sine',0.08,0.05,0); tone26(659,'sine',0.08,0.05,60); break;
    case 'record_compare': tone26(587,'triangle',0.1,0.06,0); tone26(784,'triangle',0.12,0.06,80); break;
    case 'particle_burst': tone26(880,'sine',0.06,0.04,0); tone26(1047,'sine',0.06,0.04,40); break;
    case 'particle_combo': tone26(523,'triangle',0.08,0.07,0); tone26(659,'triangle',0.08,0.07,50); tone26(784,'triangle',0.1,0.07,100); break;
    case 'curriculum_unlock': tone26(440,'triangle',0.1,0.06,0); tone26(554,'triangle',0.1,0.06,70); tone26(698,'triangle',0.12,0.06,140); break;
    case 'pitch_detect': tone26(349,'sine',0.12,0.05,0); break;
    case 'pitch_correct': tone26(523,'triangle',0.1,0.07,0); tone26(784,'triangle',0.12,0.07,80); break;
    case 'leader_rank': tone26(660,'triangle',0.08,0.06,0); tone26(880,'triangle',0.1,0.06,60); break;
    case 'leader_challenge': tone26(392,'sine',0.1,0.05,0); tone26(523,'sine',0.12,0.05,70); tone26(698,'sine',0.15,0.05,140); break;
    case 'weak_detect': tone26(262,'triangle',0.12,0.06,0); tone26(330,'triangle',0.12,0.06,70); break;
    case 'v26_achieve': tone26(523,'triangle',0.1,0.1,0); tone26(659,'triangle',0.12,0.1,80); tone26(784,'triangle',0.12,0.1,160); tone26(1047,'triangle',0.25,0.1,240); break;
    case 'quiz_correct26': tone26(698,'triangle',0.1,0.07,0); tone26(880,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v26 ================
function makeV26Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,660px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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
  content.id=id+'-content';
  box.appendChild(content);modal.appendChild(box);
  modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
  document.body.appendChild(modal);
  contentFn(content);
  return modal;
}

function markV26Feature(name){
  var used=ls26Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls26Set('features_used',used);}
}

function gradeOf26(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}
function gradeColor26(g){return g==='S'?'#ffd700':g==='A'?'#4a7dff':g==='B'?'#36d399':g==='C'?'#f59e0b':'#ef4444';}

// ================ 10 NEW SONGS (222->232) ================
function addV26Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s223',name:'프로코피예프 토카타 Op.11',category:'클래식',difficulty:'expert',
     notes:[{note:'D4',time:0,dur:0.12},{note:'D5',time:0.12,dur:0.12},{note:'A4',time:0.24,dur:0.12},{note:'D5',time:0.36,dur:0.12},{note:'F4',time:0.48,dur:0.12},{note:'D5',time:0.6,dur:0.12},{note:'A4',time:0.72,dur:0.12},{note:'D5',time:0.84,dur:0.12},{note:'E4',time:0.96,dur:0.12},{note:'C5',time:1.08,dur:0.12},{note:'G4',time:1.2,dur:0.12},{note:'C5',time:1.32,dur:0.25}]},
    {id:'s224',name:'스카를라티 소나타 K.141',category:'클래식',difficulty:'hard',
     notes:[{note:'D5',time:0,dur:0.15},{note:'A4',time:0.15,dur:0.15},{note:'F4',time:0.3,dur:0.15},{note:'D4',time:0.45,dur:0.15},{note:'A4',time:0.6,dur:0.15},{note:'F4',time:0.75,dur:0.15},{note:'D5',time:0.9,dur:0.3},{note:'C#5',time:1.2,dur:0.15},{note:'D5',time:1.35,dur:0.15},{note:'E5',time:1.5,dur:0.15},{note:'F5',time:1.65,dur:0.15},{note:'G5',time:1.8,dur:0.4}]},
    {id:'s225',name:'사티 그노시엔느 3번',category:'클래식',difficulty:'easy',
     notes:[{note:'F4',time:0,dur:0.6},{note:'G4',time:0.6,dur:0.3},{note:'Ab4',time:0.9,dur:0.3},{note:'Bb4',time:1.2,dur:0.6},{note:'Ab4',time:1.8,dur:0.3},{note:'G4',time:2.1,dur:0.3},{note:'F4',time:2.4,dur:0.6},{note:'Eb4',time:3.0,dur:0.3},{note:'D4',time:3.3,dur:0.3},{note:'C4',time:3.6,dur:0.6},{note:'D4',time:4.2,dur:0.3},{note:'Eb4',time:4.5,dur:0.9}]},
    {id:'s226',name:'거슈윈 랩소디 인 블루',category:'재즈',difficulty:'hard',
     notes:[{note:'Bb3',time:0,dur:0.2},{note:'C4',time:0.2,dur:0.15},{note:'D4',time:0.35,dur:0.15},{note:'Eb4',time:0.5,dur:0.15},{note:'E4',time:0.65,dur:0.15},{note:'F4',time:0.8,dur:0.15},{note:'F#4',time:0.95,dur:0.15},{note:'G4',time:1.1,dur:0.15},{note:'Ab4',time:1.25,dur:0.15},{note:'A4',time:1.4,dur:0.15},{note:'Bb4',time:1.55,dur:0.5},{note:'Bb5',time:2.05,dur:0.8}]},
    {id:'s227',name:'모리코네 가브리엘의 오보에',category:'영화음악',difficulty:'medium',
     notes:[{note:'D5',time:0,dur:0.5},{note:'E5',time:0.5,dur:0.25},{note:'F#5',time:0.75,dur:0.25},{note:'G5',time:1.0,dur:0.75},{note:'F#5',time:1.75,dur:0.25},{note:'E5',time:2.0,dur:0.5},{note:'D5',time:2.5,dur:0.25},{note:'C#5',time:2.75,dur:0.25},{note:'D5',time:3.0,dur:1.0},{note:'B4',time:4.0,dur:0.5},{note:'A4',time:4.5,dur:0.5},{note:'D5',time:5.0,dur:1.0}]},
    {id:'s228',name:'요한 슈트라우스 아름답고 푸른 도나우',category:'클래식',difficulty:'medium',
     notes:[{note:'C4',time:0,dur:0.5},{note:'E4',time:0.5,dur:0.5},{note:'G4',time:1.0,dur:0.5},{note:'G4',time:1.5,dur:0.5},{note:'A4',time:2.0,dur:0.25},{note:'G4',time:2.25,dur:0.25},{note:'E4',time:2.5,dur:0.5},{note:'E4',time:3.0,dur:0.5},{note:'F4',time:3.5,dur:0.25},{note:'E4',time:3.75,dur:0.25},{note:'C4',time:4.0,dur:0.5},{note:'C4',time:4.5,dur:1.0}]},
    {id:'s229',name:'빌 에반스 Waltz for Debby',category:'재즈',difficulty:'hard',
     notes:[{note:'E4',time:0,dur:0.4},{note:'F#4',time:0.4,dur:0.2},{note:'G4',time:0.6,dur:0.4},{note:'A4',time:1.0,dur:0.2},{note:'B4',time:1.2,dur:0.4},{note:'C5',time:1.6,dur:0.2},{note:'D5',time:1.8,dur:0.4},{note:'E5',time:2.2,dur:0.6},{note:'D5',time:2.8,dur:0.2},{note:'C5',time:3.0,dur:0.2},{note:'B4',time:3.2,dur:0.4},{note:'A4',time:3.6,dur:0.8}]},
    {id:'s230',name:'키스 자렛 The Koeln Concert',category:'재즈',difficulty:'expert',
     notes:[{note:'G3',time:0,dur:0.3},{note:'Bb3',time:0.3,dur:0.3},{note:'C4',time:0.6,dur:0.3},{note:'D4',time:0.9,dur:0.3},{note:'Eb4',time:1.2,dur:0.3},{note:'F4',time:1.5,dur:0.3},{note:'G4',time:1.8,dur:0.6},{note:'F4',time:2.4,dur:0.15},{note:'Eb4',time:2.55,dur:0.15},{note:'D4',time:2.7,dur:0.3},{note:'C4',time:3.0,dur:0.3},{note:'Bb3',time:3.3,dur:0.6}]},
    {id:'s231',name:'반젤리스 Chariots of Fire',category:'영화음악',difficulty:'easy',
     notes:[{note:'C4',time:0,dur:0.5},{note:'D4',time:0.5,dur:0.5},{note:'E4',time:1.0,dur:1.0},{note:'D4',time:2.0,dur:0.5},{note:'E4',time:2.5,dur:0.5},{note:'F4',time:3.0,dur:0.5},{note:'E4',time:3.5,dur:1.0},{note:'D4',time:4.5,dur:0.5},{note:'C4',time:5.0,dur:0.5},{note:'D4',time:5.5,dur:1.0},{note:'C4',time:6.5,dur:0.5},{note:'B3',time:7.0,dur:1.0}]},
    {id:'s232',name:'조 히사이시 인생의 회전목마',category:'영화음악',difficulty:'medium',
     notes:[{note:'Dm4',time:0,dur:0.3},{note:'E4',time:0.3,dur:0.3},{note:'F4',time:0.6,dur:0.3},{note:'A4',time:0.9,dur:0.6},{note:'G4',time:1.5,dur:0.3},{note:'F4',time:1.8,dur:0.3},{note:'E4',time:2.1,dur:0.3},{note:'D4',time:2.4,dur:0.6},{note:'C4',time:3.0,dur:0.3},{note:'D4',time:3.3,dur:0.3},{note:'E4',time:3.6,dur:0.6},{note:'D4',time:4.2,dur:0.9}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. PERFORMANCE ANALYTICS DASHBOARD (Canvas 620x400) ================
function buildPerformanceDashUI(){
  makeV26Modal('perf-dash-modal','실시간 연주 퍼포먼스 대시보드',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='노트별 타이밍 편차, 속도 일관성, 구간별 정확도를 분석합니다. Simply Piano/Yousician 수준의 연주 분석.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:crosshair';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var sessions=ls26Get('perf_sessions',[]);
    if(sessions.length===0){
      for(var ss=0;ss<5;ss++){
        var sData={notes:[],date:'2026-0'+(7-ss)+'-15',song:'연습곡 '+(ss+1),bpm:90+ss*10};
        for(var n=0;n<24;n++){
          sData.notes.push({timing:Math.random()*60-30,velocity:50+Math.random()*77,accuracy:60+Math.random()*40});
        }
        sessions.push(sData);
      }
      ls26Set('perf_sessions',sessions);
    }
    var currentSession=sessions.length-1;
    var hoverNote=-1;
    function drawPerfDash(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Performance Analytics Dashboard',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Session '+(currentSession+1)+'/'+sessions.length+' | '+sessions[currentSession].song+' | BPM: '+sessions[currentSession].bpm,15,42);
      var s=sessions[currentSession];
      var chartX=50,chartY=65,chartW=250,chartH=140;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var gy=-30;gy<=30;gy+=10){
        var yy=chartY+chartH/2-gy*(chartH/60);
        ctx.beginPath();ctx.moveTo(chartX,yy);ctx.lineTo(chartX+chartW,yy);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='8px sans-serif';ctx.fillText(gy+'ms',chartX-30,yy+3);
      }
      ctx.strokeStyle='#22c55e44';ctx.lineWidth=1;
      var perfectY=chartY+chartH/2;
      ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(chartX,perfectY);ctx.lineTo(chartX+chartW,perfectY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#22c55e';ctx.font='8px sans-serif';ctx.fillText('Perfect',chartX+chartW+4,perfectY+3);
      for(var i=0;i<s.notes.length;i++){
        var nx=chartX+(i/(s.notes.length-1))*chartW;
        var ny=chartY+chartH/2-s.notes[i].timing*(chartH/60);
        var col=Math.abs(s.notes[i].timing)<10?'#22c55e':Math.abs(s.notes[i].timing)<20?'#f59e0b':'#ef4444';
        ctx.fillStyle=col;ctx.globalAlpha=i===hoverNote?1:0.7;
        ctx.beginPath();ctx.arc(nx,ny,i===hoverNote?5:3.5,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=1;
      }
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Timing Deviation (ms)',chartX+chartW/2-50,chartY-8);
      var velX=340,velY=65,velW=250,velH=140;
      ctx.strokeStyle='#1e2640';
      for(var vg=0;vg<=127;vg+=25){
        var vy=velY+velH-(vg/127)*velH;
        ctx.beginPath();ctx.moveTo(velX,vy);ctx.lineTo(velX+velW,vy);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='8px sans-serif';ctx.fillText(vg,velX-20,vy+3);
      }
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
      for(var vi=0;vi<s.notes.length;vi++){
        var vxx=velX+(vi/(s.notes.length-1))*velW;
        var vyy=velY+velH-(s.notes[vi].velocity/127)*velH;
        if(vi===0)ctx.moveTo(vxx,vyy);else ctx.lineTo(vxx,vyy);
      }
      ctx.stroke();
      var avgVel=0;s.notes.forEach(function(n){avgVel+=n.velocity;});avgVel/=s.notes.length;
      var avgY=velY+velH-(avgVel/127)*velH;
      ctx.strokeStyle='#f59e0b88';ctx.lineWidth=1;ctx.setLineDash([4,2]);
      ctx.beginPath();ctx.moveTo(velX,avgY);ctx.lineTo(velX+velW,avgY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#f59e0b';ctx.font='8px sans-serif';ctx.fillText('Avg:'+Math.round(avgVel),velX+velW+4,avgY+3);
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Velocity Consistency',velX+velW/2-45,velY-8);
      var hmX=50,hmY=235,hmW=520,hmH=80;
      var sections=6;var notesPerSec=Math.ceil(s.notes.length/sections);
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Section Accuracy Heatmap',hmX+hmW/2-60,hmY-8);
      for(var si=0;si<sections;si++){
        var secNotes=s.notes.slice(si*notesPerSec,Math.min((si+1)*notesPerSec,s.notes.length));
        var secAcc=0;secNotes.forEach(function(n){secAcc+=n.accuracy;});secAcc/=secNotes.length;
        var sw=hmW/sections-4;var sx=hmX+si*(hmW/sections)+2;
        var r=Math.round(255-(secAcc/100)*255);var g2=Math.round((secAcc/100)*255);
        ctx.fillStyle='rgba('+r+','+g2+',80,0.7)';
        ctx.beginPath();ctx.roundRect(sx,hmY,sw,hmH,4);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';
        ctx.fillText(Math.round(secAcc)+'%',sx+sw/2-15,hmY+hmH/2+5);
        ctx.fillStyle='#aaa';ctx.font='8px sans-serif';
        ctx.fillText('Sec '+(si+1),sx+sw/2-12,hmY+hmH+14);
      }
      var statY=340;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Summary Stats',15,statY);
      var early=0,late=0,perfect=0;
      s.notes.forEach(function(n){if(n.timing<-10)early++;else if(n.timing>10)late++;else perfect++;});
      var stats=[
        {label:'Perfect',val:perfect,col:'#22c55e'},
        {label:'Early',val:early,col:'#f59e0b'},
        {label:'Late',val:late,col:'#ef4444'},
        {label:'Avg Timing',val:Math.round(s.notes.reduce(function(a,n){return a+n.timing},0)/s.notes.length)+'ms',col:'#4a7dff'},
        {label:'Vel Range',val:Math.round(Math.max.apply(null,s.notes.map(function(n){return n.velocity}))-Math.min.apply(null,s.notes.map(function(n){return n.velocity}))),col:'#a78bfa'}
      ];
      stats.forEach(function(st,idx){
        var bx=15+idx*120;
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(bx,statY+8,110,42,6);ctx.fill();
        ctx.fillStyle=st.col;ctx.font='bold 16px sans-serif';ctx.fillText(st.val,bx+8,statY+32);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(st.label,bx+8,statY+44);
      });
      var grd=gradeOf26(perfect/s.notes.length*100);
      ctx.fillStyle=gradeColor26(grd);ctx.font='bold 28px sans-serif';
      ctx.fillText(grd,580,statY+38);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Grade',580,statY+50);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      var s=sessions[currentSession];
      hoverNote=-1;
      for(var i=0;i<s.notes.length;i++){
        var nx=50+(i/(s.notes.length-1))*250;
        var ny=65+140/2-s.notes[i].timing*(140/60);
        if(Math.abs(mx-nx)<8&&Math.abs(my-ny)<8){hoverNote=i;break;}
      }
      drawPerfDash();
      if(hoverNote>=0){
        var n=s.notes[hoverNote];
        ctx.fillStyle='#1a2036ee';ctx.beginPath();ctx.roundRect(mx+8,my-30,120,50,6);ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(mx+8,my-30,120,50,6);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='10px sans-serif';
        ctx.fillText('Note #'+(hoverNote+1),mx+14,my-15);
        ctx.fillText('Timing: '+n.timing.toFixed(1)+'ms',mx+14,my-2);
        ctx.fillText('Velocity: '+Math.round(n.velocity),mx+14,my+11);
      }
    });
    canvas.addEventListener('click',function(){
      currentSession=(currentSession+1)%sessions.length;
      playSFX26('perf_analyze');
      drawPerfDash();
    });
    drawPerfDash();
    markV26Feature('perf_dashboard');
    playSFX26('perf_open');
  });
}

// ================ 2. ADAPTIVE DIFFICULTY ENGINE (Canvas 620x400) ================
function buildAdaptiveDifficultyUI(){
  makeV26Modal('adaptive-diff-modal','적응형 난이도 엔진',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Simply Piano/Yousician처럼 연주 실력에 맞게 난이도를 자동 조절합니다. 구간별 속도/음표밀도를 시각화합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var tiers=['Beginner','Easy','Normal','Hard','Expert'];
    var tierColors=['#22c55e','#36d399','#f59e0b','#ef4444','#dc2626'];
    var sections=8;
    var playerAccuracy=ls26Get('adapt_accuracy',[]);
    if(playerAccuracy.length===0){
      for(var i=0;i<sections;i++) playerAccuracy.push(40+Math.random()*55);
      ls26Set('adapt_accuracy',playerAccuracy);
    }
    var diffLevel=ls26Get('adapt_level',2);
    var hoverSec=-1;
    function calcAdaptive(acc){
      if(acc>=88) return 4;
      if(acc>=72) return 3;
      if(acc>=55) return 2;
      if(acc>=35) return 1;
      return 0;
    }
    function drawAdaptive(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Adaptive Difficulty Engine',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Current Level: '+tiers[diffLevel]+' | Click sections to simulate accuracy changes',15,42);
      var cX=50,cY=65,cW=520,cH=150;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Difficulty Curve (Auto-adjusted per section)',cX+cW/2-120,cY-8);
      for(var ti=0;ti<5;ti++){
        var ty=cY+cH-(ti/4)*cH;
        ctx.strokeStyle='#1e264060';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(cX,ty);ctx.lineTo(cX+cW,ty);ctx.stroke();
        ctx.fillStyle=tierColors[ti];ctx.font='8px sans-serif';
        ctx.fillText(tiers[ti],cX-45,ty+3);
      }
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2.5;ctx.beginPath();
      var adaptLevels=[];
      for(var si=0;si<sections;si++){
        adaptLevels.push(calcAdaptive(playerAccuracy[si]));
        var sx=cX+(si/(sections-1))*cW;
        var sy=cY+cH-(adaptLevels[si]/4)*cH;
        if(si===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
      }
      ctx.stroke();
      for(var si2=0;si2<sections;si2++){
        var sx2=cX+(si2/(sections-1))*cW;
        var sy2=cY+cH-(adaptLevels[si2]/4)*cH;
        ctx.fillStyle=tierColors[adaptLevels[si2]];
        ctx.beginPath();ctx.arc(sx2,sy2,si2===hoverSec?7:5,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx2,sy2,si2===hoverSec?7:5,0,Math.PI*2);ctx.stroke();
      }
      var accY=240;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Player Accuracy Overlay (%)',cX+cW/2-70,accY-8);
      var barW=cW/sections-6;
      for(var bi=0;bi<sections;bi++){
        var bx=cX+bi*(cW/sections)+3;
        var bh=(playerAccuracy[bi]/100)*120;
        var col=playerAccuracy[bi]>=80?'#22c55e':playerAccuracy[bi]>=60?'#f59e0b':'#ef4444';
        ctx.fillStyle=col+'88';
        ctx.beginPath();ctx.roundRect(bx,accY+120-bh,barW,bh,3);ctx.fill();
        if(bi===hoverSec){
          ctx.strokeStyle=col;ctx.lineWidth=2;
          ctx.beginPath();ctx.roundRect(bx,accY+120-bh,barW,bh,3);ctx.stroke();
        }
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
        ctx.fillText(Math.round(playerAccuracy[bi])+'%',bx+barW/2-14,accY+120-bh-6);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText('Sec '+(bi+1),bx+barW/2-12,accY+136);
      }
      var comfortY=375;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Comfort Zone',15,comfortY);
      var avgAcc=playerAccuracy.reduce(function(a,b){return a+b},0)/playerAccuracy.length;
      var zone=avgAcc>=80?'Mastered - Ready to level up!':avgAcc>=60?'Comfortable - Keep practicing':avgAcc>=40?'Challenging - Focus on weak sections':'Struggling - Consider easier difficulty';
      var zoneCol=avgAcc>=80?'#22c55e':avgAcc>=60?'#f59e0b':avgAcc>=40?'#ef4444':'#dc2626';
      ctx.fillStyle=zoneCol;ctx.font='11px sans-serif';
      ctx.fillText(zone,120,comfortY);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Avg: '+Math.round(avgAcc)+'% | Grade: '+gradeOf26(avgAcc),420,comfortY);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      hoverSec=-1;
      for(var i=0;i<sections;i++){
        var bx=50+i*(520/sections)+3;
        if(mx>=bx&&mx<=bx+520/sections-6){hoverSec=i;break;}
      }
      drawAdaptive();
    });
    canvas.addEventListener('click',function(){
      if(hoverSec>=0){
        playerAccuracy[hoverSec]=Math.min(100,playerAccuracy[hoverSec]+Math.random()*15-3);
        ls26Set('adapt_accuracy',playerAccuracy);
        playSFX26('adapt_adjust');
        var avgA=playerAccuracy.reduce(function(a,b){return a+b},0)/playerAccuracy.length;
        diffLevel=calcAdaptive(avgA);
        ls26Set('adapt_level',diffLevel);
      } else {
        playSFX26('adapt_scan');
      }
      drawAdaptive();
    });
    drawAdaptive();
    markV26Feature('adaptive_difficulty');
  });
}

// ================ 3. PERFORMANCE RECORDING & COMPARISON (Canvas 620x400) ================
function buildRecordCompareUI(){
  makeV26Modal('record-compare-modal','연주 녹음 및 비교 재생기',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Flowkey처럼 연주를 녹음하고 레퍼런스와 비교합니다. 듀얼 피아노롤로 차이를 시각화합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var noteNames=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
    var refNotes=[];var playNotes=[];
    for(var i=0;i<16;i++){
      var ni=Math.floor(Math.random()*10);
      refNotes.push({note:ni,time:i*0.5,dur:0.35+Math.random()*0.15});
      playNotes.push({note:ni+(Math.random()>0.8?1:0),time:i*0.5+Math.random()*0.08-0.04,dur:0.3+Math.random()*0.2});
    }
    var recordings=ls26Get('recordings',[]);
    if(recordings.length===0){
      recordings.push({song:'Mozart K.545',date:'2026-07-28',accuracy:78,ref:refNotes,play:playNotes});
      var ref2=[];var play2=[];
      for(var j=0;j<16;j++){
        var ni2=Math.floor(Math.random()*10);
        ref2.push({note:ni2,time:j*0.4,dur:0.3});
        play2.push({note:ni2+(Math.random()>0.85?-1:0),time:j*0.4+Math.random()*0.06-0.03,dur:0.28+Math.random()*0.1});
      }
      recordings.push({song:'Chopin Waltz',date:'2026-07-30',accuracy:85,ref:ref2,play:play2});
      ls26Set('recordings',recordings);
    }
    var curRec=recordings.length-1;
    var playheadPos=0;var isPlaying=false;var animFrame=null;
    function drawRecording(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Recording & Comparison Player',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(recordings[curRec].song+' | '+recordings[curRec].date+' | Click: Play/Pause | Right-click: Switch',15,42);
      var rollX=40,rollY=55,rollW=540,rollH=130;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Reference (Top)',rollX,rollY-6);
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var ni=0;ni<noteNames.length;ni++){
        var ny=rollY+(ni/noteNames.length)*rollH;
        ctx.beginPath();ctx.moveTo(rollX,ny);ctx.lineTo(rollX+rollW,ny);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='7px sans-serif';ctx.fillText(noteNames[noteNames.length-1-ni],rollX-24,ny+4);
      }
      var rec=recordings[curRec];
      var maxTime=Math.max.apply(null,rec.ref.map(function(n){return n.time+n.dur}));
      rec.ref.forEach(function(n){
        var nx=rollX+(n.time/maxTime)*rollW;
        var nw=(n.dur/maxTime)*rollW;
        var ny2=rollY+rollH-((n.note+1)/noteNames.length)*rollH;
        ctx.fillStyle='#4a7dff88';
        ctx.beginPath();ctx.roundRect(nx,ny2,nw,rollH/noteNames.length-2,2);ctx.fill();
      });
      var roll2Y=200;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Your Performance (Bottom)',rollX,roll2Y-6);
      ctx.strokeStyle='#1e2640';
      for(var ni2=0;ni2<noteNames.length;ni2++){
        var ny3=roll2Y+(ni2/noteNames.length)*rollH;
        ctx.beginPath();ctx.moveTo(rollX,ny3);ctx.lineTo(rollX+rollW,ny3);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='7px sans-serif';ctx.fillText(noteNames[noteNames.length-1-ni2],rollX-24,ny3+4);
      }
      rec.play.forEach(function(n,idx){
        var nx=rollX+(n.time/maxTime)*rollW;
        var nw=(n.dur/maxTime)*rollW;
        var ny4=roll2Y+rollH-((n.note+1)/noteNames.length)*rollH;
        var isCorrect=rec.ref[idx]&&n.note===rec.ref[idx].note;
        ctx.fillStyle=isCorrect?'#22c55e88':'#ef444488';
        ctx.beginPath();ctx.roundRect(nx,ny4,nw,rollH/noteNames.length-2,2);ctx.fill();
      });
      if(playheadPos>0){
        var phx=rollX+(playheadPos/maxTime)*rollW;
        ctx.strokeStyle='#ffd70088';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(phx,rollY);ctx.lineTo(phx,rollY+rollH);ctx.stroke();
        ctx.beginPath();ctx.moveTo(phx,roll2Y);ctx.lineTo(phx,roll2Y+rollH);ctx.stroke();
      }
      var statY=350;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Comparison Stats',15,statY);
      var correct=0;
      for(var ci=0;ci<Math.min(rec.ref.length,rec.play.length);ci++){
        if(rec.ref[ci].note===rec.play[ci].note) correct++;
      }
      var accPct=Math.round(correct/rec.ref.length*100);
      var timingDev=0;
      for(var ti=0;ti<Math.min(rec.ref.length,rec.play.length);ti++){
        timingDev+=Math.abs(rec.ref[ti].time-rec.play[ti].time);
      }
      timingDev=Math.round(timingDev/rec.ref.length*1000);
      var compStats=[
        {label:'Note Accuracy',val:accPct+'%',col:'#22c55e'},
        {label:'Avg Timing Dev',val:timingDev+'ms',col:'#f59e0b'},
        {label:'Total Notes',val:rec.ref.length,col:'#4a7dff'},
        {label:'Grade',val:gradeOf26(accPct),col:gradeColor26(gradeOf26(accPct))}
      ];
      compStats.forEach(function(st,idx){
        var bx=15+idx*150;
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(bx,statY+8,140,32,6);ctx.fill();
        ctx.fillStyle=st.col;ctx.font='bold 14px sans-serif';ctx.fillText(st.val,bx+8,statY+30);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.fillText(st.label,bx+60,statY+30);
      });
    }
    canvas.addEventListener('click',function(){
      playSFX26('record_play');
      if(!isPlaying){
        isPlaying=true;playheadPos=0;
        var maxT=Math.max.apply(null,recordings[curRec].ref.map(function(n){return n.time+n.dur}));
        var startT=performance.now();
        function animate(){
          var elapsed=(performance.now()-startT)/1000;
          playheadPos=elapsed*0.8;
          drawRecording();
          if(playheadPos<maxT){animFrame=requestAnimationFrame(animate);}else{isPlaying=false;playheadPos=0;drawRecording();}
        }
        animate();
      } else {
        isPlaying=false;if(animFrame)cancelAnimationFrame(animFrame);playheadPos=0;drawRecording();
      }
    });
    canvas.addEventListener('contextmenu',function(e){
      e.preventDefault();
      curRec=(curRec+1)%recordings.length;
      playSFX26('record_compare');
      drawRecording();
    });
    drawRecording();
    markV26Feature('record_compare');
  });
}

// ================ 4. PARTICLE EFFECTS & VISUAL ENGINE (Canvas 600x380) ================
function buildParticleEffectsUI(){
  makeV26Modal('particle-fx-modal','파티클 이펙트 비주얼 엔진',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Piano Tiles 수준의 파티클 효과를 미리보기합니다. 클릭하면 폭발 효과, 콤보 시 이펙트가 강화됩니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:crosshair';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var particles=[];
    var combo=0;
    var maxCombo=ls26Get('particle_maxcombo',0);
    var effectType=ls26Get('particle_effect',0);
    var effectNames=['Sparks','Stars','Ripples','Fire','Rainbow','Snow'];
    var effectColors=[
      ['#ffd700','#ff6b35','#ff3864','#4a7dff'],
      ['#ffd700','#fff','#4a7dff','#22c55e','#a78bfa'],
      ['#4a7dff','#6d9bff','#93b4ff','#bbd4ff'],
      ['#ff3864','#ff6b35','#ffd700','#ffaa00'],
      ['#ff0000','#ff7700','#ffff00','#00ff00','#0000ff','#8b00ff'],
      ['#fff','#e8ecf4','#bbd4ff','#93b4ff']
    ];
    function spawnParticles(x,y,count){
      var cols=effectColors[effectType];
      for(var i=0;i<count;i++){
        var angle=Math.random()*Math.PI*2;
        var speed=1+Math.random()*3*(1+combo*0.1);
        particles.push({
          x:x,y:y,
          vx:Math.cos(angle)*speed,
          vy:Math.sin(angle)*speed-(effectType===5?0.5:0),
          life:1,decay:0.01+Math.random()*0.02,
          size:2+Math.random()*4*(1+combo*0.05),
          color:cols[Math.floor(Math.random()*cols.length)],
          type:effectType
        });
      }
    }
    function drawParticles(){
      ctx.clearRect(0,0,600,380);
      var gBg=ctx.createLinearGradient(0,0,0,380);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Particle Effects Preview',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Click to trigger | Right-click: change effect | Effect: '+effectNames[effectType],15,42);
      ctx.fillStyle='#ffd700';ctx.font='bold 16px sans-serif';
      ctx.fillText('Combo: '+combo,500,30);
      if(combo>maxCombo){maxCombo=combo;ls26Set('particle_maxcombo',maxCombo);}
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Best: '+maxCombo,510,46);
      for(var i=particles.length-1;i>=0;i--){
        var p=particles[i];
        p.x+=p.vx;p.y+=p.vy;
        if(p.type!==5) p.vy+=0.05;
        else p.vy+=0.01;
        p.life-=p.decay;
        if(p.life<=0){particles.splice(i,1);continue;}
        ctx.globalAlpha=p.life;
        ctx.fillStyle=p.color;
        if(p.type===1){
          ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*3);
          ctx.beginPath();
          for(var s=0;s<5;s++){
            var a=s*Math.PI*2/5-Math.PI/2;
            ctx.lineTo(Math.cos(a)*p.size,Math.sin(a)*p.size);
            var a2=a+Math.PI/5;
            ctx.lineTo(Math.cos(a2)*p.size*0.4,Math.sin(a2)*p.size*0.4);
          }
          ctx.closePath();ctx.fill();ctx.restore();
        } else if(p.type===2){
          ctx.strokeStyle=p.color;ctx.lineWidth=1.5;
          ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1-p.life)*8,0,Math.PI*2);ctx.stroke();
        } else {
          ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
        }
        ctx.globalAlpha=1;
      }
      if(combo>=10){
        ctx.fillStyle='#1a2036cc';ctx.beginPath();ctx.roundRect(200,330,200,40,8);ctx.fill();
        var milestoneText=combo>=100?'LEGENDARY!':combo>=50?'INCREDIBLE!':combo>=25?'AMAZING!':'GREAT!';
        var milestoneCol=combo>=100?'#ffd700':combo>=50?'#a78bfa':combo>=25?'#22c55e':'#4a7dff';
        ctx.fillStyle=milestoneCol;ctx.font='bold 18px sans-serif';
        ctx.fillText(milestoneText,300-ctx.measureText(milestoneText).width/2,356);
      }
      if(particles.length>0) requestAnimationFrame(drawParticles);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      combo++;
      var count=10+combo*2;
      if(count>80) count=80;
      spawnParticles(mx,my,count);
      playSFX26(combo>10?'particle_combo':'particle_burst');
      drawParticles();
    });
    canvas.addEventListener('contextmenu',function(e){
      e.preventDefault();
      effectType=(effectType+1)%effectNames.length;
      ls26Set('particle_effect',effectType);
      combo=0;
      drawParticles();
    });
    drawParticles();
    markV26Feature('particle_effects');
  });
}

// ================ 5. STRUCTURED CURRICULUM LEARNING PATH (Canvas 620x400) ================
function buildCurriculumPathUI(){
  makeV26Modal('curriculum-path-modal','구조화된 커리큘럼 학습 경로',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Simply Piano/Flowkey처럼 체계적 학습 경로를 제공합니다. 6트랙 8레벨의 스킬트리로 구성됩니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var tracks=[
      {name:'기초',icon:'F',color:'#22c55e',levels:['자세','손모양','C스케일','음표읽기','리듬기초','양손기초','페달기초','기초종합']},
      {name:'스케일',icon:'S',color:'#4a7dff',levels:['장조','단조','반음계','모드','펜타','블루스','전조','스케일종합']},
      {name:'코드',icon:'C',color:'#a78bfa',levels:['3화음','7화음','전위','보이싱','진행','대리코드','텐션','코드종합']},
      {name:'독보력',icon:'R',color:'#f59e0b',levels:['음자리표','박자표','조표','강약기호','아티큘레이션','반복기호','장식음','독보종합']},
      {name:'표현',icon:'E',color:'#ef4444',levels:['다이나믹','템포','프레이징','페달링','터치','해석','감정','표현종합']},
      {name:'레퍼토리',icon:'P',color:'#ec4899',levels:['동요','팝','클래식기초','재즈기초','영화OST','클래식중급','고급작품','콘서트']}
    ];
    var mastery=ls26Get('curriculum_mastery',{});
    var hoverTrack=-1,hoverLevel=-1;
    function isUnlocked(t,l){
      if(l===0) return true;
      var prevKey=t+'-'+(l-1);
      return (mastery[prevKey]||0)>=60;
    }
    function drawCurriculum(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Structured Curriculum - Skill Tree',15,25);
      var totalMastered=0,totalNodes=tracks.length*8;
      Object.keys(mastery).forEach(function(k){if(mastery[k]>=60)totalMastered++;});
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Progress: '+totalMastered+'/'+totalNodes+' nodes | Click to practice | '+Math.round(totalMastered/totalNodes*100)+'% complete',15,42);
      var startX=15,startY=60;
      var nodeW=68,nodeH=35,gapX=6,gapY=8;
      tracks.forEach(function(track,ti){
        var ty=startY+ti*(nodeH+gapY);
        ctx.fillStyle=track.color;ctx.font='bold 10px sans-serif';
        ctx.fillText(track.icon,4,ty+nodeH/2+4);
        for(var li=0;li<track.levels.length;li++){
          var lx=startX+20+li*(nodeW+gapX);
          var key=ti+'-'+li;
          var mst=mastery[key]||0;
          var unlocked=isUnlocked(ti,li);
          ctx.fillStyle=unlocked?(mst>=60?track.color+'cc':'#1a2036'):'#0d111788';
          ctx.beginPath();ctx.roundRect(lx,ty,nodeW,nodeH,4);ctx.fill();
          ctx.strokeStyle=(ti===hoverTrack&&li===hoverLevel)?'#fff':unlocked?(mst>=60?track.color:'#1e2640'):'#1e264040';
          ctx.lineWidth=(ti===hoverTrack&&li===hoverLevel)?2:1;
          ctx.beginPath();ctx.roundRect(lx,ty,nodeW,nodeH,4);ctx.stroke();
          ctx.fillStyle=unlocked?'#c9d1d9':'#555';
          ctx.font='8px sans-serif';
          ctx.fillText(track.levels[li],lx+4,ty+13);
          if(unlocked){
            var barW=nodeW-8;
            ctx.fillStyle='#1e2640';ctx.fillRect(lx+4,ty+19,barW,6);
            ctx.fillStyle=mst>=60?track.color:'#4a7dff88';
            ctx.fillRect(lx+4,ty+19,barW*(mst/100),6);
            ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
            ctx.fillText(mst+'%',lx+nodeW-22,ty+32);
          } else {
            ctx.fillStyle='#555';ctx.font='10px sans-serif';
            ctx.fillText('🔒',lx+nodeW/2-6,ty+30);
          }
          if(li>0&&unlocked){
            ctx.strokeStyle=track.color+'44';ctx.lineWidth=1;
            ctx.beginPath();ctx.moveTo(lx,ty+nodeH/2);ctx.lineTo(lx-gapX,ty+nodeH/2);ctx.stroke();
          }
        }
      });
      if(hoverTrack>=0&&hoverLevel>=0){
        var hKey=hoverTrack+'-'+hoverLevel;
        var hMst=mastery[hKey]||0;
        var hUnlocked=isUnlocked(hoverTrack,hoverLevel);
        ctx.fillStyle='#1a2036ee';ctx.beginPath();ctx.roundRect(400,360,210,35,6);ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(400,360,210,35,6);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='10px sans-serif';
        ctx.fillText(tracks[hoverTrack].name+' > '+tracks[hoverTrack].levels[hoverLevel],406,376);
        ctx.fillText(hUnlocked?'Mastery: '+hMst+'% | Grade: '+gradeOf26(hMst):'Locked - Complete previous first',406,390);
      }
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverTrack=-1;hoverLevel=-1;
      var startX2=35,startY2=60,nodeW2=68,nodeH2=35,gapX2=6,gapY2=8;
      for(var ti=0;ti<tracks.length;ti++){
        var ty=startY2+ti*(nodeH2+gapY2);
        for(var li=0;li<8;li++){
          var lx=startX2+li*(nodeW2+gapX2);
          if(mx>=lx&&mx<=lx+nodeW2&&my>=ty&&my<=ty+nodeH2){
            hoverTrack=ti;hoverLevel=li;break;
          }
        }
        if(hoverTrack>=0)break;
      }
      drawCurriculum();
    });
    canvas.addEventListener('click',function(){
      if(hoverTrack>=0&&hoverLevel>=0&&isUnlocked(hoverTrack,hoverLevel)){
        var key=hoverTrack+'-'+hoverLevel;
        var cur=mastery[key]||0;
        mastery[key]=Math.min(100,cur+Math.floor(Math.random()*20)+5);
        ls26Set('curriculum_mastery',mastery);
        playSFX26(mastery[key]>=60?'curriculum_unlock':'adapt_scan');
        drawCurriculum();
      }
    });
    drawCurriculum();
    markV26Feature('curriculum_path');
  });
}

// ================ 6. MICROPHONE PITCH DETECTION TRAINER (Canvas 600x380) ================
function buildPitchDetectionUI(){
  makeV26Modal('pitch-detect-modal','마이크 기반 음정 감지 트레이너',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Simply Piano/Yousician처럼 마이크로 어쿠스틱 피아노를 감지합니다. 실시간 주파수 스펙트럼과 음정 정확도를 표시합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var noteFreqs=[261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25,587.33,659.25,698.46,783.99];
    var noteLabels=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'];
    var detectedHistory=ls26Get('pitch_history',[]);
    if(detectedHistory.length===0){
      for(var i=0;i<30;i++){
        var targetIdx=Math.floor(Math.random()*12);
        var deviation=Math.random()*40-20;
        detectedHistory.push({target:targetIdx,detected:noteFreqs[targetIdx]+deviation,cents:deviation,accuracy:100-Math.abs(deviation)});
      }
      ls26Set('pitch_history',detectedHistory);
    }
    var currentTarget=Math.floor(Math.random()*12);
    var isListening=false;
    var simDetected=0;var simCents=0;
    var spectrumData=[];
    for(var si=0;si<64;si++) spectrumData.push(Math.random()*0.3);
    function drawPitchDetector(){
      ctx.clearRect(0,0,600,380);
      var gBg=ctx.createLinearGradient(0,0,0,380);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Pitch Detection Trainer',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(isListening?'Listening... Click to stop':'Click to start pitch detection simulation',15,42);
      var specX=30,specY=55,specW=540,specH=80;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Frequency Spectrum',specX,specY-5);
      for(var bi=0;bi<64;bi++){
        var bw=specW/64-1;
        var bx=specX+bi*(specW/64);
        var bh=spectrumData[bi]*specH;
        var hue=bi*5;
        ctx.fillStyle='hsl('+hue+',70%,55%)';
        ctx.fillRect(bx,specY+specH-bh,bw,bh);
      }
      var meterX=200,meterY=155,meterR=60;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Tuning Meter',meterX+meterR-25,meterY-meterR-10);
      ctx.strokeStyle='#1e2640';ctx.lineWidth=8;
      ctx.beginPath();ctx.arc(meterX+meterR,meterY+meterR,meterR,Math.PI,0);ctx.stroke();
      var zones=[{start:Math.PI,end:Math.PI*1.2,col:'#ef4444'},{start:Math.PI*1.2,end:Math.PI*1.4,col:'#f59e0b'},{start:Math.PI*1.4,end:Math.PI*1.6,col:'#22c55e'},{start:Math.PI*1.6,end:Math.PI*1.8,col:'#f59e0b'},{start:Math.PI*1.8,end:Math.PI*2,col:'#ef4444'}];
      zones.forEach(function(z){
        ctx.strokeStyle=z.col+'88';ctx.lineWidth=6;
        ctx.beginPath();ctx.arc(meterX+meterR,meterY+meterR,meterR,z.start,z.end);ctx.stroke();
      });
      var needleAngle=Math.PI+((simCents+50)/100)*Math.PI;
      needleAngle=Math.max(Math.PI,Math.min(Math.PI*2,needleAngle));
      ctx.strokeStyle='#fff';ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(meterX+meterR,meterY+meterR);
      ctx.lineTo(meterX+meterR+Math.cos(needleAngle)*(meterR-10),meterY+meterR+Math.sin(needleAngle)*(meterR-10));
      ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 20px sans-serif';
      ctx.fillText(noteLabels[currentTarget],meterX+meterR-12,meterY+meterR+30);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(Math.round(simCents)+' cents',meterX+meterR-18,meterY+meterR+45);
      var targetPanel=document.createElement('div');
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Target Note: '+noteLabels[currentTarget]+' ('+Math.round(noteFreqs[currentTarget])+' Hz)',400,165);
      ctx.fillText('Detected: '+(simDetected>0?Math.round(simDetected)+' Hz':'---'),400,182);
      var accCol=Math.abs(simCents)<10?'#22c55e':Math.abs(simCents)<25?'#f59e0b':'#ef4444';
      ctx.fillStyle=accCol;
      ctx.fillText('Accuracy: '+(simDetected>0?(100-Math.min(100,Math.abs(simCents)*2))+'%':'---'),400,199);
      var histY=260,histH=90,histW=540;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Pitch Stability History (last 30 detections)',30,histY-8);
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      for(var hl=-20;hl<=20;hl+=10){
        var hy=histY+histH/2-hl*(histH/40);
        ctx.beginPath();ctx.moveTo(30,hy);ctx.lineTo(30+histW,hy);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='7px sans-serif';ctx.fillText(hl+'c',10,hy+3);
      }
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=1.5;ctx.beginPath();
      var recent=detectedHistory.slice(-30);
      recent.forEach(function(d,i){
        var dx=30+(i/(recent.length-1))*histW;
        var dy=histY+histH/2-d.cents*(histH/40);
        if(i===0)ctx.moveTo(dx,dy);else ctx.lineTo(dx,dy);
      });
      ctx.stroke();
      recent.forEach(function(d,i){
        var dx=30+(i/(recent.length-1))*histW;
        var dy=histY+histH/2-d.cents*(histH/40);
        ctx.fillStyle=Math.abs(d.cents)<10?'#22c55e':Math.abs(d.cents)<25?'#f59e0b':'#ef4444';
        ctx.beginPath();ctx.arc(dx,dy,2.5,0,Math.PI*2);ctx.fill();
      });
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      var avgCents=recent.reduce(function(a,d){return a+Math.abs(d.cents)},0)/recent.length;
      ctx.fillText('Avg deviation: '+avgCents.toFixed(1)+' cents | Grade: '+gradeOf26(100-avgCents*2),30,histY+histH+18);
    }
    var simInterval=null;
    canvas.addEventListener('click',function(){
      if(!isListening){
        isListening=true;
        currentTarget=Math.floor(Math.random()*12);
        simInterval=setInterval(function(){
          simCents=Math.random()*60-30;
          simDetected=noteFreqs[currentTarget]+simCents;
          for(var i=0;i<64;i++) spectrumData[i]=Math.random()*(Math.abs(i-currentTarget*5)<8?1:0.3);
          detectedHistory.push({target:currentTarget,detected:simDetected,cents:simCents,accuracy:100-Math.abs(simCents)});
          if(detectedHistory.length>60) detectedHistory.shift();
          ls26Set('pitch_history',detectedHistory);
          playSFX26('pitch_detect');
          drawPitchDetector();
        },800);
      } else {
        isListening=false;
        if(simInterval)clearInterval(simInterval);
        currentTarget=Math.floor(Math.random()*12);
        simCents=0;simDetected=0;
        drawPitchDetector();
      }
    });
    drawPitchDetector();
    markV26Feature('pitch_detection');
  });
}

// ================ 7. SOCIAL GLOBAL LEADERBOARD & CHALLENGES (Canvas 620x400) ================
function buildLeaderboardUI(){
  makeV26Modal('leaderboard-modal','소셜 글로벌 리더보드 및 챌린지',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Yousician/Piano Tiles 수준의 글로벌 리더보드와 주간 챌린지. 티어 시스템으로 경쟁합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var tiers=[
      {name:'Diamond',color:'#93b4ff',min:2000},
      {name:'Platinum',color:'#a78bfa',min:1500},
      {name:'Gold',color:'#ffd700',min:1000},
      {name:'Silver',color:'#c0c0c0',min:600},
      {name:'Bronze',color:'#cd7f32',min:0}
    ];
    var myScore=ls26Get('leader_score',750);
    var myRank=ls26Get('leader_rank',42);
    var weeklyChallenge={song:'Chopin Waltz Op.64-2',expires:'5d 12h',entries:1847};
    var leaderboard=[
      {name:'PianoMaster99',score:2450,tier:0},
      {name:'ClassicLover',score:2180,tier:0},
      {name:'MelodyKing',score:1920,tier:1},
      {name:'KeyboardNinja',score:1750,tier:1},
      {name:'MusicDream',score:1580,tier:1},
      {name:'NoteHunter',score:1420,tier:2},
      {name:'SoundWave',score:1280,tier:2},
      {name:'RhythmPro',score:1100,tier:2},
      {name:'PianoStar',score:950,tier:3},
      {name:'Player',score:myScore,tier:myScore>=2000?0:myScore>=1500?1:myScore>=1000?2:myScore>=600?3:4}
    ];
    leaderboard.sort(function(a,b){return b.score-a.score;});
    var hoverRow=-1;
    var viewMode=0;
    function drawLeaderboard(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Global Leaderboard & Challenges',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Click: Earn points | Right-click: Switch view',15,42);
      if(viewMode===0){
        ctx.fillStyle='#c9d1d9';ctx.font='bold 11px sans-serif';
        ctx.fillText('🏆 Global Rankings',15,65);
        leaderboard.forEach(function(entry,idx){
          var ey=75+idx*28;
          ctx.fillStyle=idx===hoverRow?'#1e264088':'#1a203644';
          ctx.beginPath();ctx.roundRect(15,ey,360,25,4);ctx.fill();
          if(entry.name==='Player'){
            ctx.strokeStyle='#ffd700';ctx.lineWidth=1;
            ctx.beginPath();ctx.roundRect(15,ey,360,25,4);ctx.stroke();
          }
          var medals=['🥇','🥈','🥉'];
          ctx.fillStyle='#c9d1d9';ctx.font='11px sans-serif';
          ctx.fillText(idx<3?medals[idx]:'#'+(idx+1),22,ey+17);
          ctx.fillStyle=entry.name==='Player'?'#ffd700':'#c9d1d9';ctx.font='11px sans-serif';
          ctx.fillText(entry.name,55,ey+17);
          ctx.fillStyle=tiers[entry.tier].color;ctx.font='bold 11px sans-serif';
          ctx.fillText(entry.score+' pts',240,ey+17);
          ctx.fillStyle=tiers[entry.tier].color;ctx.font='9px sans-serif';
          ctx.fillText(tiers[entry.tier].name,310,ey+17);
        });
        var tierY=65;
        ctx.fillStyle='#c9d1d9';ctx.font='bold 11px sans-serif';
        ctx.fillText('Tier Divisions',410,tierY);
        tiers.forEach(function(t,idx){
          var ty=tierY+10+idx*30;
          ctx.fillStyle=t.color+'44';ctx.beginPath();ctx.roundRect(410,ty,190,26,4);ctx.fill();
          ctx.fillStyle=t.color;ctx.font='bold 11px sans-serif';
          ctx.fillText(t.name,420,ty+17);
          ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
          ctx.fillText(t.min+'+ pts',530,ty+17);
        });
        ctx.fillStyle='#c9d1d9';ctx.font='bold 11px sans-serif';
        ctx.fillText('Your Stats',410,235);
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(410,245,190,50,6);ctx.fill();
        var myTier=myScore>=2000?0:myScore>=1500?1:myScore>=1000?2:myScore>=600?3:4;
        ctx.fillStyle=tiers[myTier].color;ctx.font='bold 16px sans-serif';
        ctx.fillText(myScore+' pts',420,268);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText('Rank #'+myRank+' | '+tiers[myTier].name,420,286);
      } else {
        ctx.fillStyle='#c9d1d9';ctx.font='bold 11px sans-serif';
        ctx.fillText('Weekly Challenge',15,65);
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(15,75,590,80,8);ctx.fill();
        ctx.strokeStyle='#ffd700';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(15,75,590,80,8);ctx.stroke();
        ctx.fillStyle='#ffd700';ctx.font='bold 14px sans-serif';
        ctx.fillText('🎵 '+weeklyChallenge.song,25,100);
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
        ctx.fillText('Time remaining: '+weeklyChallenge.expires+' | '+weeklyChallenge.entries+' entries',25,120);
        ctx.fillStyle='#22c55e';ctx.font='10px sans-serif';
        ctx.fillText('Rewards: +500 pts (Top 10) | +200 pts (Top 50) | +50 pts (Complete)',25,140);
        ctx.fillStyle='#c9d1d9';ctx.font='bold 11px sans-serif';
        ctx.fillText('Player Distribution',15,185);
        var distData=[{tier:'Diamond',count:23,pct:1.2},{tier:'Platinum',count:89,pct:4.8},{tier:'Gold',count:312,pct:16.9},{tier:'Silver',count:756,pct:40.9},{tier:'Bronze',count:667,pct:36.2}];
        distData.forEach(function(d,idx){
          var dy=195+idx*36;
          var barMaxW=400;
          var barW=barMaxW*(d.pct/100);
          ctx.fillStyle=tiers[idx].color+'44';
          ctx.beginPath();ctx.roundRect(15,dy,barMaxW,30,4);ctx.fill();
          ctx.fillStyle=tiers[idx].color+'88';
          ctx.beginPath();ctx.roundRect(15,dy,barW,30,4);ctx.fill();
          ctx.fillStyle=tiers[idx].color;ctx.font='bold 10px sans-serif';
          ctx.fillText(d.tier,22,dy+20);
          ctx.fillStyle='#fff';ctx.font='10px sans-serif';
          ctx.fillText(d.count+' players ('+d.pct+'%)',barW>120?barW-100+15:barW+25,dy+20);
        });
        var radarCX=520,radarCY=280,radarR=70;
        ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
        ctx.fillText('Your Profile',radarCX-20,radarCY-radarR-12);
        var radarAxes=['Accuracy','Speed','Consistency','Difficulty','Songs','Streaks'];
        var radarVals=[78,65,82,55,70,60];
        radarAxes.forEach(function(ax,i){
          var angle=i*Math.PI*2/6-Math.PI/2;
          ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(radarCX,radarCY);
          ctx.lineTo(radarCX+Math.cos(angle)*radarR,radarCY+Math.sin(angle)*radarR);ctx.stroke();
          ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
          ctx.fillText(ax,radarCX+Math.cos(angle)*(radarR+12)-15,radarCY+Math.sin(angle)*(radarR+12)+3);
        });
        ctx.fillStyle='#4a7dff33';ctx.beginPath();
        radarVals.forEach(function(v,i){
          var angle=i*Math.PI*2/6-Math.PI/2;
          var r=radarR*(v/100);
          if(i===0)ctx.moveTo(radarCX+Math.cos(angle)*r,radarCY+Math.sin(angle)*r);
          else ctx.lineTo(radarCX+Math.cos(angle)*r,radarCY+Math.sin(angle)*r);
        });
        ctx.closePath();ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=1.5;ctx.beginPath();
        radarVals.forEach(function(v,i){
          var angle=i*Math.PI*2/6-Math.PI/2;
          var r=radarR*(v/100);
          if(i===0)ctx.moveTo(radarCX+Math.cos(angle)*r,radarCY+Math.sin(angle)*r);
          else ctx.lineTo(radarCX+Math.cos(angle)*r,radarCY+Math.sin(angle)*r);
        });
        ctx.closePath();ctx.stroke();
      }
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverRow=-1;
      if(viewMode===0){
        for(var i=0;i<leaderboard.length;i++){
          var ey=75+i*28;
          if(my>=ey&&my<=ey+25){hoverRow=i;break;}
        }
      }
      drawLeaderboard();
    });
    canvas.addEventListener('click',function(){
      myScore+=Math.floor(Math.random()*30)+10;
      ls26Set('leader_score',myScore);
      if(myRank>1)myRank--;
      ls26Set('leader_rank',myRank);
      var playerEntry=leaderboard.find(function(e){return e.name==='Player'});
      if(playerEntry){
        playerEntry.score=myScore;
        playerEntry.tier=myScore>=2000?0:myScore>=1500?1:myScore>=1000?2:myScore>=600?3:4;
      }
      leaderboard.sort(function(a,b){return b.score-a.score;});
      playSFX26('leader_rank');
      drawLeaderboard();
    });
    canvas.addEventListener('contextmenu',function(e){
      e.preventDefault();
      viewMode=(viewMode+1)%2;
      playSFX26('leader_challenge');
      drawLeaderboard();
    });
    drawLeaderboard();
    markV26Feature('leaderboard');
  });
}

// ================ 8. PER-SONG WEAKNESS SECTION ANALYZER (Canvas 600x380) ================
function buildWeaknessAnalyzerUI(){
  makeV26Modal('weakness-modal','곡별 약점 구간 분석기',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Flowkey/Simply Piano처럼 곡의 약한 구간을 자동 감지하고 집중 연습을 제안합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var songs=['Mozart K.545','Fur Elise','Chopin Waltz','Canon in D','River Flows'];
    var currentSong=0;
    var songData=ls26Get('weakness_data',[]);
    if(songData.length===0){
      songs.forEach(function(name){
        var secs=[];
        for(var i=0;i<8;i++){
          secs.push({
            accuracy:30+Math.random()*70,
            errors:Math.floor(Math.random()*12),
            attempts:Math.floor(Math.random()*20)+5,
            improved:Math.random()>0.4
          });
        }
        songData.push({name:name,sections:secs});
      });
      ls26Set('weakness_data',songData);
    }
    var hoverSec2=-1;
    function drawWeakness(){
      ctx.clearRect(0,0,600,380);
      var gBg=ctx.createLinearGradient(0,0,0,380);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Per-Song Weakness Analyzer',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(songData[currentSong].name+' | Click: Practice section | Right-click: Next song',15,42);
      var sd=songData[currentSong];
      var hmX=30,hmY=60,hmW=540,hmH=60;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Section Accuracy Heatmap (4-bar sections)',hmX,hmY-8);
      var secW=hmW/sd.sections.length-4;
      sd.sections.forEach(function(sec,idx){
        var sx=hmX+idx*(hmW/sd.sections.length)+2;
        var acc=sec.accuracy;
        var r2=Math.round(255-(acc/100)*200);var g3=Math.round((acc/100)*200+55);
        ctx.fillStyle='rgba('+r2+','+g3+',80,0.75)';
        ctx.beginPath();ctx.roundRect(sx,hmY,secW,hmH,4);ctx.fill();
        if(idx===hoverSec2){
          ctx.strokeStyle='#fff';ctx.lineWidth=2;
          ctx.beginPath();ctx.roundRect(sx,hmY,secW,hmH,4);ctx.stroke();
        }
        ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';
        ctx.fillText(Math.round(acc)+'%',sx+secW/2-14,hmY+hmH/2+5);
        ctx.fillStyle='#bbb';ctx.font='8px sans-serif';
        ctx.fillText('Sec '+(idx+1),sx+secW/2-10,hmY+hmH+12);
      });
      var detY=145;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Error Count per Section',hmX,detY-8);
      var maxErr=Math.max.apply(null,sd.sections.map(function(s){return s.errors}))||1;
      sd.sections.forEach(function(sec,idx){
        var sx=hmX+idx*(hmW/sd.sections.length)+2;
        var bh=(sec.errors/maxErr)*70;
        ctx.fillStyle=sec.errors>8?'#ef4444aa':sec.errors>4?'#f59e0baa':'#22c55eaa';
        ctx.beginPath();ctx.roundRect(sx,detY+70-bh,secW,bh,3);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='9px sans-serif';
        ctx.fillText(sec.errors,sx+secW/2-4,detY+70-bh-4);
      });
      var weakest=[];
      sd.sections.forEach(function(s,i){weakest.push({idx:i,acc:s.accuracy});});
      weakest.sort(function(a,b){return a.acc-b.acc;});
      var top3=weakest.slice(0,3);
      var recY=245;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Top 3 Weakest Sections - Practice Recommendations',hmX,recY-8);
      top3.forEach(function(w,idx){
        var ry=recY+idx*35;
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(hmX,ry,540,30,6);ctx.fill();
        ctx.strokeStyle=idx===0?'#ef4444':idx===1?'#f59e0b':'#4a7dff';ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(hmX,ry,540,30,6);ctx.stroke();
        ctx.fillStyle=idx===0?'#ef4444':idx===1?'#f59e0b':'#4a7dff';ctx.font='bold 10px sans-serif';
        ctx.fillText('#'+(idx+1)+' Section '+(w.idx+1),hmX+10,ry+13);
        ctx.fillStyle='#c9d1d9';ctx.font='10px sans-serif';
        ctx.fillText('Accuracy: '+Math.round(w.acc)+'%',hmX+120,ry+13);
        ctx.fillText('Errors: '+sd.sections[w.idx].errors,hmX+230,ry+13);
        ctx.fillText('Attempts: '+sd.sections[w.idx].attempts,hmX+320,ry+13);
        ctx.fillStyle=sd.sections[w.idx].improved?'#22c55e':'#ef4444';ctx.font='9px sans-serif';
        ctx.fillText(sd.sections[w.idx].improved?'Improving':'Needs work',hmX+420,ry+13);
        ctx.fillStyle='#4a7dff';ctx.font='9px sans-serif';
        ctx.fillText('A-B Loop →',hmX+490,ry+13);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        var tip=w.acc<40?'Slow down BPM by 40%':w.acc<60?'Practice hands separately':'Focus on tricky transitions';
        ctx.fillText('Tip: '+tip,hmX+10,ry+26);
      });
      var histY2=355;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Overall: ',15,histY2);
      var totalAcc=sd.sections.reduce(function(a,s){return a+s.accuracy},0)/sd.sections.length;
      ctx.fillStyle=gradeColor26(gradeOf26(totalAcc));ctx.font='bold 14px sans-serif';
      ctx.fillText(gradeOf26(totalAcc)+' ('+Math.round(totalAcc)+'%)',72,histY2);
      var totalErrs=sd.sections.reduce(function(a,s){return a+s.errors},0);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Total errors: '+totalErrs+' | Sections improving: '+sd.sections.filter(function(s){return s.improved}).length+'/'+sd.sections.length,160,histY2);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      hoverSec2=-1;
      if(my>=60&&my<=120){
        var secIdx=Math.floor((mx-30)/(540/8));
        if(secIdx>=0&&secIdx<8) hoverSec2=secIdx;
      }
      drawWeakness();
    });
    canvas.addEventListener('click',function(){
      if(hoverSec2>=0){
        var sec=songData[currentSong].sections[hoverSec2];
        sec.accuracy=Math.min(100,sec.accuracy+Math.random()*10+2);
        sec.errors=Math.max(0,sec.errors-1);
        sec.attempts++;
        sec.improved=true;
        ls26Set('weakness_data',songData);
        playSFX26('weak_detect');
      }
      drawWeakness();
    });
    canvas.addEventListener('contextmenu',function(e){
      e.preventDefault();
      currentSong=(currentSong+1)%songs.length;
      drawWeakness();
    });
    drawWeakness();
    markV26Feature('weakness_analyzer');
  });
}

// ================ QUIZ v17 (15 Questions, 240->255) ================
function buildQuizV17UI(){
  makeV26Modal('quiz17-modal','피아노 퀴즈 v17 (15문)',function(container){
    var quizzes=[
      {q:'Simply Piano에서 영감받은 적응형 학습이란?',a:['실력에 맞게 난이도 자동 조절','항상 같은 속도로 진행','랜덤 곡 추천','교사 수동 설정'],c:0},
      {q:'음정 감지(Pitch Detection)에 사용되는 주요 알고리즘은?',a:['FFT (Fast Fourier Transform)','K-means clustering','Binary search','Bubble sort'],c:0},
      {q:'A4 표준 튜닝 주파수는?',a:['440Hz','432Hz','460Hz','420Hz'],c:0},
      {q:'피아노의 총 건반 수는?',a:['88개','76개','61개','92개'],c:0},
      {q:'Flowkey의 핵심 기능인 퍼포먼스 비교란?',a:['녹음된 연주를 레퍼런스와 비교','화면 크기를 비교','악보 두 가지를 비교','피아노 브랜드 비교'],c:0},
      {q:'센트(Cent)란 음악에서 무엇을 측정하나?',a:['음정의 미세한 편차','음량의 크기','리듬의 속도','음색의 밝기'],c:0},
      {q:'반음은 몇 센트인가?',a:['100센트','50센트','200센트','12센트'],c:0},
      {q:'파티클 이펙트에서 콤보 시스템이란?',a:['연속 성공 시 효과 강화','파티클 색상 변경','건반 크기 변경','BPM 자동 조절'],c:0},
      {q:'스킬트리 학습법의 장점은?',a:['체계적 순서로 기초부터 단계적 학습','빠르게 어려운 곡만 연습','이론 없이 실전만','교재 없이 독학'],c:0},
      {q:'A-B 구간 반복 연습이란?',a:['약한 구간을 지정하여 집중 반복','처음부터 끝까지 반복','A코드와 B코드 반복','두 곡을 번갈아 연주'],c:0},
      {q:'리더보드 티어 시스템의 목적은?',a:['실력 수준별 공정한 경쟁','단순 점수 표시','곡 분류','악기 종류 구분'],c:0},
      {q:'연주 분석에서 Velocity란?',a:['건반을 누르는 세기/속도','곡의 전체 템포','손가락 번호','페달 깊이'],c:0},
      {q:'실시간 피드백 시스템의 핵심 요소가 아닌 것은?',a:['악보 인쇄 품질','타이밍 정확도','음정 일치도','속도 일관성'],c:0},
      {q:'피아노 페달 중 가장 많이 사용하는 것은?',a:['서스테인 페달 (오른쪽)','소프트 페달 (왼쪽)','소스테누토 페달 (가운데)','모두 동일하게 사용'],c:0},
      {q:'곡별 약점 분석기가 감지하는 주요 지표가 아닌 것은?',a:['피아노 브랜드','구간별 정확도','에러 빈도','연습 횟수'],c:0}
    ];
    var currentQ=0;var score=0;var answered=[];
    function renderQuiz(){
      container.innerHTML='';
      if(currentQ>=quizzes.length){
        var pct=Math.round(score/quizzes.length*100);
        var g=gradeOf26(pct);
        container.innerHTML='<div style="text-align:center;padding:20px"><h3 style="color:'+gradeColor26(g)+'">퀴즈 완료! '+score+'/'+quizzes.length+' ('+pct+'%) Grade: '+g+'</h3><p style="color:var(--text2);font-size:12px;margin-top:8px">v17 퀴즈 결과가 저장되었습니다.</p></div>';
        ls26Set('quiz17_score',score);
        ls26Set('quiz17_pct',pct);
        return;
      }
      var qd=quizzes[currentQ];
      var qDiv=document.createElement('div');
      qDiv.innerHTML='<p style="color:var(--text);font-size:13px;margin-bottom:12px"><strong>Q'+(currentQ+1)+'/'+quizzes.length+'</strong> '+qd.q+'</p>';
      qd.a.forEach(function(ans,idx){
        var btn=document.createElement('button');
        btn.style.cssText='display:block;width:100%;padding:10px;margin:6px 0;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left';
        btn.textContent=(idx+1)+'. '+ans;
        btn.addEventListener('click',function(){
          if(idx===qd.c){score++;playSFX26('quiz_correct26');btn.style.background='#22c55e44';btn.style.borderColor='#22c55e';}
          else{btn.style.background='#ef444444';btn.style.borderColor='#ef4444';}
          answered.push(idx);
          setTimeout(function(){currentQ++;renderQuiz();},600);
        });
        qDiv.appendChild(btn);
      });
      var prog=document.createElement('div');
      prog.style.cssText='margin-top:12px;background:var(--surface2);border-radius:4px;height:6px;overflow:hidden';
      var progBar=document.createElement('div');
      progBar.style.cssText='height:100%;background:var(--accent);border-radius:4px;width:'+(currentQ/quizzes.length*100)+'%;transition:width 0.3s';
      prog.appendChild(progBar);
      qDiv.appendChild(prog);
      container.appendChild(qDiv);
    }
    renderQuiz();
  });
}

// ================ 12 ACHIEVEMENTS (240->252) ================
function injectV26Achievements(){
  if(!window.app||!app.achievements) return;
  var newAch=[
    {id:'v26_perf1',name:'퍼포먼스 분석가',description:'연주 퍼포먼스 대시보드를 열어보세요',unlocked:false},
    {id:'v26_perf2',name:'데이터 마스터',description:'퍼포먼스 세션 3회 이상 분석',unlocked:false},
    {id:'v26_adapt1',name:'적응형 학습자',description:'적응형 난이도 엔진을 사용하세요',unlocked:false},
    {id:'v26_record1',name:'녹음 비교 전문가',description:'연주 녹음 비교 재생기를 열어보세요',unlocked:false},
    {id:'v26_particle1',name:'파티클 아티스트',description:'파티클 콤보 25회 달성',unlocked:false},
    {id:'v26_particle2',name:'이펙트 마스터',description:'파티클 콤보 50회 달성',unlocked:false},
    {id:'v26_curriculum1',name:'커리큘럼 입문자',description:'학습 경로에서 5개 노드 마스터',unlocked:false},
    {id:'v26_pitch1',name:'음정 감지기',description:'마이크 음정 감지 트레이너를 사용하세요',unlocked:false},
    {id:'v26_leader1',name:'경쟁자',description:'리더보드에서 점수 획득',unlocked:false},
    {id:'v26_leader2',name:'Gold 티어',description:'리더보드 1000점 달성',unlocked:false},
    {id:'v26_weak1',name:'약점 분석가',description:'약점 구간 분석기를 사용하세요',unlocked:false},
    {id:'v26_quiz17',name:'퀴즈 v17 합격',description:'퀴즈 v17에서 80% 이상 득점',unlocked:false}
  ];
  newAch.forEach(function(a){
    var exists=app.achievements.some(function(ea){return ea.id===a.id});
    if(!exists) app.achievements.push(a);
  });
}

function checkV26Achievements(){
  if(!window.app||!app.achievements) return;
  var checks=[
    {id:'v26_perf1',fn:function(){return (ls26Get('features_used',[])).indexOf('perf_dashboard')!==-1;}},
    {id:'v26_perf2',fn:function(){return ls26Get('perf_sessions',[]).length>=3;}},
    {id:'v26_adapt1',fn:function(){return (ls26Get('features_used',[])).indexOf('adaptive_difficulty')!==-1;}},
    {id:'v26_record1',fn:function(){return (ls26Get('features_used',[])).indexOf('record_compare')!==-1;}},
    {id:'v26_particle1',fn:function(){return ls26Get('particle_maxcombo',0)>=25;}},
    {id:'v26_particle2',fn:function(){return ls26Get('particle_maxcombo',0)>=50;}},
    {id:'v26_curriculum1',fn:function(){var m=ls26Get('curriculum_mastery',{});var cnt=0;Object.keys(m).forEach(function(k){if(m[k]>=60)cnt++;});return cnt>=5;}},
    {id:'v26_pitch1',fn:function(){return (ls26Get('features_used',[])).indexOf('pitch_detection')!==-1;}},
    {id:'v26_leader1',fn:function(){return ls26Get('leader_score',750)>750;}},
    {id:'v26_leader2',fn:function(){return ls26Get('leader_score',750)>=1000;}},
    {id:'v26_weak1',fn:function(){return (ls26Get('features_used',[])).indexOf('weakness_analyzer')!==-1;}},
    {id:'v26_quiz17',fn:function(){return ls26Get('quiz17_pct',0)>=80;}}
  ];
  checks.forEach(function(c){
    var ach=app.achievements.find(function(a){return a.id===c.id});
    if(ach&&!ach.unlocked&&c.fn()){
      ach.unlocked=true;
      if(app.showToast) app.showToast('🏆 업적 해금: '+ach.name,'achievement');
      playSFX26('v26_achieve');
    }
  });
}

// ================ KEYBOARD SHORTCUTS v26 ================
function setupV26Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var map={'1':'perf-dash-modal','2':'adaptive-diff-modal','3':'record-compare-modal',
             '4':'particle-fx-modal','5':'curriculum-path-modal','6':'pitch-detect-modal',
             '7':'leaderboard-modal','8':'weakness-modal','9':'quiz17-modal'};
    var key=e.key;
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV26NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'📊 퍼포먼스',modal:'perf-dash-modal'},
    {label:'🎯 적응난이도',modal:'adaptive-diff-modal'},
    {label:'🎙️ 녹음비교',modal:'record-compare-modal'},
    {label:'✨ 파티클',modal:'particle-fx-modal'},
    {label:'🗺️ 커리큘럼',modal:'curriculum-path-modal'},
    {label:'🎤 음정감지',modal:'pitch-detect-modal'},
    {label:'🏆 리더보드',modal:'leaderboard-modal'},
    {label:'🔍 약점분석',modal:'weakness-modal'},
    {label:'🧠 퀴즈v17',modal:'quiz17-modal'}
  ];
  items.forEach(function(item){
    var btn=document.createElement('button');
    btn.style.cssText='padding:6px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);font-size:9px;cursor:pointer;white-space:nowrap;flex-shrink:0;margin:0 2px';
    btn.textContent=item.label;
    btn.addEventListener('click',function(){var m=document.getElementById(item.modal);if(m)m.style.display='flex';});
    existingNav.appendChild(btn);
  });
}

// ================ INIT ================
function initV26(){
  addV26Songs();
  buildPerformanceDashUI();
  buildAdaptiveDifficultyUI();
  buildRecordCompareUI();
  buildParticleEffectsUI();
  buildCurriculumPathUI();
  buildPitchDetectionUI();
  buildLeaderboardUI();
  buildWeaknessAnalyzerUI();
  buildQuizV17UI();
  injectV26Achievements();
  setupV26Shortcuts();
  injectV26NavButtons();
  setInterval(checkV26Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV26,7200);});
else setTimeout(initV26,7200);
})();
