// Piano Master v19 Patch Module
// Sight-Reading Trainer, Chord Progression Builder, Rhythm Pattern Game, Practice Streak Heatmap,
// Finger Agility Trainer, Music Era Explorer, Performance Report Card, Piano Tuning Trainer
// 10 Songs (152->162), Quiz v10 15Q (135->150), 12 Achievements (156->168), SFX 12, Keyboard 8
(function(){
'use strict';
if(window.__v19Loaded) return;
window.__v19Loaded = true;

var LS19 = 'piano-v19-';
function ls19Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS19+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls19Set(k,v){localStorage.setItem(LS19+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v19 (12 sounds) ================
var sfx19 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone19(freq,type,dur,gainVal,delayMs){
  if(!sfx19) return;
  setTimeout(function(){
    if(!sfx19) return;
    var t=sfx19.currentTime,g=sfx19.createGain(),o=sfx19.createOscillator();
    o.connect(g);g.connect(sfx19.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX19(type){
  if(!sfx19) return;
  if(sfx19.state==='suspended') sfx19.resume();
  switch(type){
    case 'sight_correct': tone19(784,'sine',0.12,0.08,0); tone19(1047,'sine',0.15,0.08,80); break;
    case 'sight_wrong': tone19(200,'sawtooth',0.2,0.06,0); break;
    case 'chord_play': tone19(440,'triangle',0.2,0.07,0); tone19(554,'triangle',0.2,0.07,0); tone19(659,'triangle',0.2,0.07,0); break;
    case 'rhythm_tap': tone19(600,'sine',0.06,0.06,0); break;
    case 'rhythm_perfect': tone19(880,'sine',0.1,0.08,0); tone19(1175,'sine',0.15,0.08,60); break;
    case 'streak_log': tone19(523,'triangle',0.1,0.06,0); tone19(659,'triangle',0.1,0.06,80); break;
    case 'finger_hit': tone19(700,'sine',0.05,0.05,0); break;
    case 'era_select': tone19(392,'sine',0.15,0.06,0); tone19(523,'sine',0.12,0.06,100); break;
    case 'report_gen': tone19(523,'triangle',0.12,0.08,0); tone19(659,'triangle',0.12,0.08,100); tone19(784,'triangle',0.12,0.08,200); tone19(1047,'triangle',0.2,0.08,300); break;
    case 'tune_match': tone19(440,'sine',0.3,0.07,0); break;
    case 'tune_perfect': tone19(880,'sine',0.1,0.1,0); tone19(1320,'sine',0.15,0.1,100); tone19(1760,'sine',0.2,0.1,200); break;
    case 'v19_achieve': tone19(523,'triangle',0.1,0.1,0); tone19(659,'triangle',0.12,0.1,80); tone19(784,'triangle',0.12,0.1,160); tone19(1047,'triangle',0.25,0.1,240); break;
  }
}

// ================ COMMON MODAL BUILDER v19 ================
function makeV19Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:190;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,620px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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

function markV19Feature(name){
  var used=ls19Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls19Set('features_used',used);}
}

// ================ 10 NEW SONGS (152->162) ================
function addV19Songs(){
  if(!window.SONGS) return;
  var existing=window.SONGS.map(function(s){return s.name});
  var newSongs=[
    {name:'Gymnopédie No.1 (사티)',composer:'에릭 사티',category:'클래식',difficulty:'easy',bpm:66,
     notes:[{note:'F#5',time:0,dur:1},{note:'E5',time:1,dur:0.5},{note:'F#5',time:1.5,dur:0.5},{note:'B4',time:2,dur:1},{note:'F#5',time:3,dur:1},{note:'E5',time:4,dur:0.5},{note:'F#5',time:4.5,dur:0.5},{note:'B4',time:5,dur:1},{note:'E5',time:6,dur:1},{note:'D5',time:7,dur:0.5},{note:'E5',time:7.5,dur:0.5},{note:'A4',time:8,dur:1},{note:'E5',time:9,dur:1},{note:'D5',time:10,dur:0.5},{note:'E5',time:10.5,dur:0.5},{note:'A4',time:11,dur:1.5},{note:'D5',time:12.5,dur:0.5},{note:'C5',time:13,dur:1},{note:'B4',time:14,dur:1.5}]},
    {name:'Arabesque No.1 (드뽔시)',composer:'드뽔시',category:'클래식',difficulty:'hard',bpm:72,
     notes:[{note:'E5',time:0,dur:0.25},{note:'F#5',time:0.25,dur:0.25},{note:'G#5',time:0.5,dur:0.25},{note:'A5',time:0.75,dur:0.5},{note:'G#5',time:1.25,dur:0.25},{note:'F#5',time:1.5,dur:0.25},{note:'E5',time:1.75,dur:0.5},{note:'C#5',time:2.25,dur:0.25},{note:'B4',time:2.5,dur:0.5},{note:'A4',time:3,dur:0.5},{note:'B4',time:3.5,dur:0.25},{note:'C#5',time:3.75,dur:0.25},{note:'E5',time:4,dur:0.5},{note:'F#5',time:4.5,dur:0.25},{note:'E5',time:4.75,dur:0.25},{note:'C#5',time:5,dur:0.5},{note:'B4',time:5.5,dur:0.25},{note:'A4',time:5.75,dur:0.25},{note:'G#4',time:6,dur:0.5},{note:'A4',time:6.5,dur:1}]},
    {name:'Fantaisie-Impromptu (쇼팡)',composer:'쇼팡',category:'클래식',difficulty:'expert',bpm:84,
     notes:[{note:'C#5',time:0,dur:0.15},{note:'D#5',time:0.15,dur:0.15},{note:'E5',time:0.3,dur:0.15},{note:'F#5',time:0.45,dur:0.15},{note:'G#5',time:0.6,dur:0.3},{note:'F#5',time:0.9,dur:0.15},{note:'E5',time:1.05,dur:0.15},{note:'D#5',time:1.2,dur:0.15},{note:'C#5',time:1.35,dur:0.15},{note:'B4',time:1.5,dur:0.3},{note:'C#5',time:1.8,dur:0.15},{note:'D#5',time:1.95,dur:0.15},{note:'E5',time:2.1,dur:0.3},{note:'D#5',time:2.4,dur:0.15},{note:'C#5',time:2.55,dur:0.15},{note:'B4',time:2.7,dur:0.15},{note:'A4',time:2.85,dur:0.15},{note:'G#4',time:3,dur:0.3},{note:'A4',time:3.3,dur:0.15},{note:'B4',time:3.45,dur:0.15},{note:'C#5',time:3.6,dur:0.6}]},
    {name:'Kiss the Rain (이루마)',composer:'이루마',category:'팝',difficulty:'medium',bpm:72,
     notes:[{note:'E5',time:0,dur:0.3},{note:'D5',time:0.3,dur:0.3},{note:'C5',time:0.6,dur:0.6},{note:'B4',time:1.2,dur:0.3},{note:'C5',time:1.5,dur:0.3},{note:'D5',time:1.8,dur:0.6},{note:'E5',time:2.4,dur:0.3},{note:'D5',time:2.7,dur:0.3},{note:'C5',time:3,dur:0.6},{note:'B4',time:3.6,dur:0.3},{note:'A4',time:3.9,dur:0.3},{note:'G4',time:4.2,dur:0.6},{note:'A4',time:4.8,dur:0.3},{note:'B4',time:5.1,dur:0.3},{note:'C5',time:5.4,dur:0.6},{note:'D5',time:6,dur:0.3},{note:'E5',time:6.3,dur:0.3},{note:'F5',time:6.6,dur:0.6},{note:'E5',time:7.2,dur:1}]},
    {name:'Comptine (Amélie OST)',composer:'얀 티에르센',category:'팝',difficulty:'medium',bpm:100,
     notes:[{note:'E5',time:0,dur:0.2},{note:'D#5',time:0.2,dur:0.2},{note:'E5',time:0.4,dur:0.2},{note:'D#5',time:0.6,dur:0.2},{note:'E5',time:0.8,dur:0.2},{note:'B4',time:1,dur:0.2},{note:'D5',time:1.2,dur:0.2},{note:'C5',time:1.4,dur:0.2},{note:'A4',time:1.6,dur:0.6},{note:'C4',time:2.2,dur:0.2},{note:'E4',time:2.4,dur:0.2},{note:'A4',time:2.6,dur:0.2},{note:'B4',time:2.8,dur:0.6},{note:'E4',time:3.4,dur:0.2},{note:'G#4',time:3.6,dur:0.2},{note:'B4',time:3.8,dur:0.2},{note:'C5',time:4,dur:0.6},{note:'E4',time:4.6,dur:0.2},{note:'E5',time:4.8,dur:0.2},{note:'D#5',time:5,dur:0.2},{note:'E5',time:5.2,dur:0.8}]},
    {name:'Maple Leaf Rag (조플린)',composer:'스콧 조플린',category:'재즈',difficulty:'hard',bpm:100,
     notes:[{note:'A4',time:0,dur:0.15},{note:'C#5',time:0.15,dur:0.15},{note:'E5',time:0.3,dur:0.3},{note:'D5',time:0.6,dur:0.15},{note:'C#5',time:0.75,dur:0.15},{note:'A4',time:0.9,dur:0.3},{note:'F#4',time:1.2,dur:0.15},{note:'A4',time:1.35,dur:0.15},{note:'C#5',time:1.5,dur:0.3},{note:'E5',time:1.8,dur:0.15},{note:'D5',time:1.95,dur:0.15},{note:'C#5',time:2.1,dur:0.3},{note:'A4',time:2.4,dur:0.15},{note:'B4',time:2.55,dur:0.15},{note:'C#5',time:2.7,dur:0.3},{note:'D5',time:3,dur:0.15},{note:'E5',time:3.15,dur:0.15},{note:'F#5',time:3.3,dur:0.3},{note:'E5',time:3.6,dur:0.15},{note:'D5',time:3.75,dur:0.15},{note:'A4',time:3.9,dur:0.5}]},
    {name:'La Campanella (리스트)',composer:'리스트',category:'클래식',difficulty:'expert',bpm:100,
     notes:[{note:'D#6',time:0,dur:0.2},{note:'D#5',time:0.2,dur:0.1},{note:'E5',time:0.3,dur:0.1},{note:'D#5',time:0.4,dur:0.1},{note:'E5',time:0.5,dur:0.1},{note:'D#5',time:0.6,dur:0.2},{note:'D#6',time:0.8,dur:0.2},{note:'E5',time:1,dur:0.1},{note:'D#5',time:1.1,dur:0.1},{note:'E5',time:1.2,dur:0.1},{note:'F#5',time:1.3,dur:0.1},{note:'G#5',time:1.4,dur:0.2},{note:'D#6',time:1.6,dur:0.2},{note:'C#5',time:1.8,dur:0.1},{note:'D#5',time:1.9,dur:0.1},{note:'E5',time:2,dur:0.1},{note:'F#5',time:2.1,dur:0.1},{note:'G#5',time:2.2,dur:0.2},{note:'A5',time:2.4,dur:0.2},{note:'G#5',time:2.6,dur:0.2},{note:'F#5',time:2.8,dur:0.2},{note:'E5',time:3,dur:0.4}]},
    {name:'Liebestraum No.3 (리스트)',composer:'리스트',category:'클래식',difficulty:'hard',bpm:60,
     notes:[{note:'C5',time:0,dur:0.5},{note:'E5',time:0.5,dur:0.5},{note:'G5',time:1,dur:0.5},{note:'A5',time:1.5,dur:1},{note:'G5',time:2.5,dur:0.5},{note:'F5',time:3,dur:0.5},{note:'E5',time:3.5,dur:0.5},{note:'D5',time:4,dur:0.5},{note:'C5',time:4.5,dur:0.5},{note:'B4',time:5,dur:0.5},{note:'C5',time:5.5,dur:1},{note:'E5',time:6.5,dur:0.5},{note:'G5',time:7,dur:0.5},{note:'C6',time:7.5,dur:1},{note:'B5',time:8.5,dur:0.5},{note:'A5',time:9,dur:0.5},{note:'G5',time:9.5,dur:0.5},{note:'E5',time:10,dur:1.5}]},
    {name:'Bohemian Rhapsody (퀸)',composer:'퀸',category:'팝',difficulty:'hard',bpm:72,
     notes:[{note:'G4',time:0,dur:0.5},{note:'A4',time:0.5,dur:0.5},{note:'B4',time:1,dur:0.5},{note:'B4',time:1.5,dur:0.5},{note:'A4',time:2,dur:0.5},{note:'G4',time:2.5,dur:0.5},{note:'F#4',time:3,dur:0.5},{note:'E4',time:3.5,dur:0.5},{note:'D4',time:4,dur:1},{note:'G4',time:5,dur:0.5},{note:'A4',time:5.5,dur:0.5},{note:'B4',time:6,dur:0.5},{note:'D5',time:6.5,dur:0.5},{note:'C5',time:7,dur:0.5},{note:'B4',time:7.5,dur:0.5},{note:'A4',time:8,dur:0.5},{note:'G4',time:8.5,dur:0.5},{note:'D5',time:9,dur:0.5},{note:'B4',time:9.5,dur:0.5},{note:'G4',time:10,dur:1.5}]},
    {name:'봄날은 간다 (IU)',composer:'IU',category:'팝',difficulty:'medium',bpm:82,
     notes:[{note:'E4',time:0,dur:0.4},{note:'G4',time:0.4,dur:0.4},{note:'A4',time:0.8,dur:0.4},{note:'B4',time:1.2,dur:0.8},{note:'A4',time:2,dur:0.4},{note:'G4',time:2.4,dur:0.4},{note:'E4',time:2.8,dur:0.8},{note:'D4',time:3.6,dur:0.4},{note:'E4',time:4,dur:0.4},{note:'G4',time:4.4,dur:0.8},{note:'A4',time:5.2,dur:0.4},{note:'B4',time:5.6,dur:0.4},{note:'D5',time:6,dur:0.8},{note:'B4',time:6.8,dur:0.4},{note:'A4',time:7.2,dur:0.4},{note:'G4',time:7.6,dur:0.8},{note:'E4',time:8.4,dur:0.4},{note:'G4',time:8.8,dur:0.8},{note:'A4',time:9.6,dur:1}]}
  ];
  newSongs.forEach(function(s){
    if(existing.indexOf(s.name)===-1){
      s.icon=s.category==='재즈'?'🎷':s.category==='팝'?'🎤':['🎹','🎵','🎶','🎼'][Math.floor(Math.random()*4)];
      window.SONGS.push(s);
    }
  });
  if(window.app&&app.initSongList) app.initSongList();
}

// ================ 1. SIGHT-READING TRAINER CANVAS ================
function buildSightReadingUI(){
  makeV19Modal('sight-modal','🎼 사이트리딩 트레이너',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">오선지 위에 표시된 음표를 보고 정확한 음이름을 누르세요. 시간 제한 내 많이 맞힐수록 S등급!</p>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">'+
      '<select id="sight-clef" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px"><option value="treble">높은음자리</option><option value="bass">낮은음자리</option></select>'+
      '<select id="sight-diff" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px"><option value="easy">쉽게 (C-G)</option><option value="medium">보통 (C-C)</option><option value="hard">어려움 (전체+#b)</option></select>'+
      '<button class="ctrl-btn" id="sight-start" style="padding:6px 14px">시작</button>'+
      '</div>'+
      '<canvas id="sight-canvas" width="580" height="340" style="width:100%;max-width:580px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="sight-btns" style="display:none;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:8px"></div>'+
      '<div id="sight-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#sight-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;
    var noteNames=['C','D','E','F','G','A','B'];
    var allNotes=['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
    var trebleRange={easy:['C4','D4','E4','F4','G4'],medium:['C4','D4','E4','F4','G4','A4','B4','C5'],hard:allNotes.slice(7)};
    var bassRange={easy:['C3','D3','E3','F3','G3'],medium:['C3','D3','E3','F3','G3','A3','B3','C4'],hard:allNotes.slice(0,11)};
    var running=false,score=0,total=0,timeLeft=30,currentNote='',timer=null;
    var stats=ls19Get('sight_stats',{total:0,correct:0,bestStreak:0});
    var streak=0;

    function noteY(note,clef){
      var n=note.replace(/\d/,''),oct=parseInt(note.slice(-1));
      var idx=noteNames.indexOf(n);
      var pos;
      if(clef==='treble'){pos=(4-oct)*7+(6-idx);var baseY=90;return baseY+pos*8;}
      else{pos=(2-oct)*7+(6-idx);var baseY2=90;return baseY2+pos*8;}
    }

    function drawStaff(clef){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('사이트리딩 트레이너',W/2,24);
      ctx.strokeStyle='#3a4568';ctx.lineWidth=1;
      for(var i=0;i<5;i++){
        var y=130+i*16;
        ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(W-30,y);ctx.stroke();
      }
      ctx.fillStyle='#e8ecf4';ctx.font='bold 36px serif';ctx.textAlign='left';
      ctx.fillText(clef==='treble'?'𝄞':'𝄢',70,175);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='right';
      ctx.fillText('점수: '+score+'/'+total,W-30,44);
      ctx.fillText('시간: '+timeLeft+'s',W-30,60);
      ctx.fillText('연속: '+streak,W-30,76);
    }

    function drawNote(note,clef,color){
      var y=noteY(note,clef);
      var x=W/2+20;
      ctx.fillStyle=color||'#e8ecf4';
      ctx.beginPath();ctx.ellipse(x,y,12,9,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=color||'#e8ecf4';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(x+12,y);ctx.lineTo(x+12,y-40);ctx.stroke();
      if(y>194||y<130){
        ctx.strokeStyle='#3a4568';ctx.lineWidth=1;
        var ly=y>194?Math.ceil((y-194)/16):Math.floor((130-y)/16);
        for(var i=1;i<=ly;i++){
          var ledgerY=y>194?194+i*16:130-i*16;
          ctx.beginPath();ctx.moveTo(x-18,ledgerY);ctx.lineTo(x+18,ledgerY);ctx.stroke();
        }
      }
    }

    function nextNote(){
      var clef=container.querySelector('#sight-clef').value;
      var diff=container.querySelector('#sight-diff').value;
      var pool=clef==='treble'?trebleRange[diff]:bassRange[diff];
      currentNote=pool[Math.floor(Math.random()*pool.length)];
      drawStaff(clef);
      drawNote(currentNote,clef);
    }

    function buildButtons(){
      var btnsDiv=container.querySelector('#sight-btns');
      btnsDiv.style.display='flex';btnsDiv.innerHTML='';
      var labels=['C','D','E','F','G','A','B'];
      labels.forEach(function(n){
        var b=document.createElement('button');
        b.style.cssText='padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:13px;cursor:pointer;min-width:36px;font-weight:bold';
        b.textContent=n;
        b.addEventListener('click',function(){
          total++;
          var clef=container.querySelector('#sight-clef').value;
          if(currentNote.startsWith(n)){
            score++;streak++;playSFX19('sight_correct');
            drawNote(currentNote,clef,'#22c55e');
            if(streak>stats.bestStreak){stats.bestStreak=streak;}
          }else{
            streak=0;playSFX19('sight_wrong');
            drawNote(currentNote,clef,'#ef4444');
            ctx.fillStyle='#ef4444';ctx.font='12px sans-serif';ctx.textAlign='center';
            ctx.fillText('정답: '+currentNote,W/2+20,noteY(currentNote,clef)+30);
          }
          stats.total++;stats.correct+=currentNote.startsWith(n)?1:0;
          ls19Set('sight_stats',stats);
          setTimeout(nextNote,600);
        });
        btnsDiv.appendChild(b);
      });
    }

    function startGame(){
      score=0;total=0;streak=0;timeLeft=30;running=true;
      buildButtons();nextNote();
      markV19Feature('sight');
      timer=setInterval(function(){
        timeLeft--;
        var clef=container.querySelector('#sight-clef').value;
        drawStaff(clef);drawNote(currentNote,clef);
        if(timeLeft<=0){
          clearInterval(timer);running=false;
          container.querySelector('#sight-btns').style.display='none';
          drawStaff(clef);
          ctx.fillStyle='#eab308';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
          var grade=total===0?'F':score/total>=0.95?'S':score/total>=0.85?'A':score/total>=0.7?'B':score/total>=0.5?'C':'F';
          ctx.fillText('결과: '+score+'/'+total+' ('+grade+'등급)',W/2,H/2+10);
          ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
          ctx.fillText('총 누적: '+stats.correct+'/'+stats.total+' | 최대 연속: '+stats.bestStreak,W/2,H/2+35);
          container.querySelector('#sight-info').textContent=grade+'등급 획득! 정확률 '+(total?Math.round(score/total*100):0)+'%';
        }
      },1000);
    }

    container.querySelector('#sight-start').addEventListener('click',function(){
      if(timer)clearInterval(timer);
      startGame();
    });

    drawStaff('treble');
    ctx.fillStyle='#8892a8';ctx.font='13px sans-serif';ctx.textAlign='center';
    ctx.fillText('시작 버튼을 눌러 사이트리딩을 연습하세요',W/2,H-30);
  });
}

// ================ 2. CHORD PROGRESSION BUILDER CANVAS ================
function buildChordProgUI(){
  makeV19Modal('chord-modal','🎶 코드 프로그레션 빌더',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">인기 코드 진행을 선택하고 들어보세요. 직접 카드를 배치해 나만의 진행을 만들 수도 있습니다.</p>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">'+
      '<select id="chord-key" style="padding:4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
      '<option value="C">C Major</option><option value="G">G Major</option><option value="D">D Major</option><option value="F">F Major</option><option value="Am">A minor</option><option value="Em">E minor</option><option value="Dm">D minor</option></select>'+
      '<button class="ctrl-btn" id="chord-play" style="padding:5px 12px">▶ 재생</button>'+
      '<button class="ctrl-btn" id="chord-clear" style="padding:5px 12px">초기화</button>'+
      '</div>'+
      '<canvas id="chord-canvas" width="600" height="360" style="width:100%;max-width:600px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto;cursor:pointer"></canvas>'+
      '<div id="chord-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#chord-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;

    var PRESETS={
      'C':  {chords:['C','Dm','Em','F','G','Am','Bdim'],freqs:[[262,330,392],[294,349,440],[330,415,494],[349,440,523],[392,494,587],[440,523,659],[494,587,740]]},
      'G':  {chords:['G','Am','Bm','C','D','Em','F#dim'],freqs:[[392,494,587],[440,523,659],[494,622,740],[523,659,784],[587,740,880],[659,784,988],[740,880,1047]]},
      'D':  {chords:['D','Em','F#m','G','A','Bm','C#dim'],freqs:[[294,370,440],[330,392,494],[370,440,554],[392,494,587],[440,554,659],[494,587,740],[554,659,784]]},
      'F':  {chords:['F','Gm','Am','Bb','C','Dm','Edim'],freqs:[[349,440,523],[392,466,587],[440,523,659],[466,587,698],[523,659,784],[587,698,880],[659,784,932]]},
      'Am': {chords:['Am','Bdim','C','Dm','Em','F','G'],freqs:[[440,523,659],[494,587,740],[523,659,784],[587,698,880],[659,784,988],[698,880,1047],[784,988,1175]]},
      'Em': {chords:['Em','F#dim','G','Am','Bm','C','D'],freqs:[[330,392,494],[370,440,554],[392,494,587],[440,523,659],[494,622,740],[523,659,784],[587,740,880]]},
      'Dm': {chords:['Dm','Edim','F','Gm','Am','Bb','C'],freqs:[[294,349,440],[330,392,494],[349,440,523],[392,466,587],[440,523,659],[466,587,698],[523,659,784]]}
    };
    var POPULAR=[
      {name:'I-V-vi-IV (팝 정석)',seq:[0,4,5,3]},
      {name:'I-IV-V-I (클래식)',seq:[0,3,4,0]},
      {name:'ii-V-I (재즈)',seq:[1,4,0]},
      {name:'I-vi-IV-V (50s)',seq:[0,5,3,4]},
      {name:'vi-IV-I-V (발라드)',seq:[5,3,0,4]},
      {name:'I-IV-vi-V (마이너 팝)',seq:[0,3,5,4]}
    ];
    var customSeq=ls19Get('chord_custom',[0,4,5,3]);
    var playing=false;

    function draw(){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('코드 프로그레션 빌더',W/2,24);
      var key=container.querySelector('#chord-key').value;
      var preset=PRESETS[key];
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('키: '+key+' | 코드를 클릭하여 진행에 추가하세요',W/2,46);

      var colors=['#4a7dff','#22c55e','#a855f7','#eab308','#ef4444','#ec4899','#06b6d4'];
      var romNums=['I','ii','iii','IV','V','vi','vii°'];

      for(var i=0;i<7;i++){
        var x=30+i*(W-60)/7;
        var w=(W-60)/7-6;
        ctx.fillStyle=colors[i];ctx.globalAlpha=0.15;
        ctx.fillRect(x,60,w,50);ctx.globalAlpha=1;
        ctx.strokeStyle=colors[i];ctx.lineWidth=1;
        ctx.strokeRect(x,60,w,50);
        ctx.fillStyle=colors[i];ctx.font='bold 12px sans-serif';ctx.textAlign='center';
        ctx.fillText(preset.chords[i],x+w/2,80);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(romNums[i],x+w/2,100);
      }

      ctx.fillStyle='#eab308';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('인기 진행:',30,135);
      for(var p=0;p<POPULAR.length;p++){
        var py=150+p*22;
        ctx.fillStyle='#1e2640';ctx.fillRect(30,py,W-60,18);
        ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';ctx.textAlign='left';
        ctx.fillText(POPULAR[p].name+': '+POPULAR[p].seq.map(function(s){return preset.chords[s]}).join(' → '),40,py+13);
      }

      ctx.fillStyle='#22c55e';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
      ctx.fillText('내 진행:',30,H-100);
      if(customSeq.length>0){
        var totalW=customSeq.length*70;
        var startX=Math.max(30,(W-totalW)/2);
        for(var c=0;c<customSeq.length;c++){
          var cx=startX+c*70;
          ctx.fillStyle=colors[customSeq[c]%7];ctx.globalAlpha=0.2;
          ctx.fillRect(cx,H-90,60,40);ctx.globalAlpha=1;
          ctx.strokeStyle=colors[customSeq[c]%7];ctx.lineWidth=1.5;
          ctx.strokeRect(cx,H-90,60,40);
          ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
          ctx.fillText(preset.chords[customSeq[c]],cx+30,H-65);
          if(c<customSeq.length-1){
            ctx.fillStyle='#8892a8';ctx.fillText('→',cx+65,H-65);
          }
        }
      }else{
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
        ctx.fillText('위 코드를 클릭하여 추가',W/2,H-65);
      }
    }

    function playChord(freqArr){
      if(!sfx19) return;if(sfx19.state==='suspended')sfx19.resume();
      var t=sfx19.currentTime;
      freqArr.forEach(function(f){
        var g=sfx19.createGain(),o=sfx19.createOscillator();
        o.connect(g);g.connect(sfx19.destination);
        o.type='triangle';o.frequency.setValueAtTime(f,t);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.8);
        o.start(t);o.stop(t+0.8);
      });
    }

    function playSequence(){
      if(playing||customSeq.length===0) return;
      playing=true;
      var key=container.querySelector('#chord-key').value;
      var preset=PRESETS[key];
      var i=0;
      function step(){
        if(i>=customSeq.length){playing=false;return;}
        playChord(preset.freqs[customSeq[i]]);
        i++;
        setTimeout(step,800);
      }
      step();
    }

    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=canvas.width/rect.width;
      var x=(e.clientX-rect.left)*sx;
      var y=(e.clientY-rect.top)*(canvas.height/rect.height);
      if(y>=60&&y<=110){
        var idx=Math.floor((x-30)/((W-60)/7));
        if(idx>=0&&idx<7){
          customSeq.push(idx);ls19Set('chord_custom',customSeq);
          var key=container.querySelector('#chord-key').value;
          playChord(PRESETS[key].freqs[idx]);
          draw();markV19Feature('chord');
        }
      }
      if(y>=150&&y<150+POPULAR.length*22){
        var pi=Math.floor((y-150)/22);
        if(pi>=0&&pi<POPULAR.length){
          customSeq=POPULAR[pi].seq.slice();ls19Set('chord_custom',customSeq);
          draw();playSFX19('chord_play');
        }
      }
    });
    container.querySelector('#chord-play').addEventListener('click',function(){playSequence();});
    container.querySelector('#chord-clear').addEventListener('click',function(){customSeq=[];ls19Set('chord_custom',customSeq);draw();});
    container.querySelector('#chord-key').addEventListener('change',draw);
    draw();
  });
}

// ================ 3. RHYTHM PATTERN GAME CANVAS ================
function buildRhythmGameUI(){
  makeV19Modal('rhythm-modal','🥁 리듬 패턴 게임',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">표시된 리듬 패턴에 맞춰 TAP 버튼을 정확하게 눌러주세요. 타이밍 정확도로 등급을 받습니다.</p>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">'+
      '<select id="rhythm-bpm" style="padding:4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
      '<option value="60">60 BPM</option><option value="80">80 BPM</option><option value="100" selected>100 BPM</option><option value="120">120 BPM</option><option value="140">140 BPM</option></select>'+
      '<select id="rhythm-meter" style="padding:4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
      '<option value="4">4/4 박자</option><option value="3">3/4 박자</option><option value="6">6/8 박자</option></select>'+
      '<button class="ctrl-btn" id="rhythm-start" style="padding:5px 12px">시작</button>'+
      '</div>'+
      '<canvas id="rhythm-canvas" width="580" height="320" style="width:100%;max-width:580px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="text-align:center;margin-top:8px"><button class="ctrl-btn" id="rhythm-tap" style="padding:12px 40px;font-size:14px;display:none">🥁 TAP</button></div>'+
      '<div id="rhythm-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#rhythm-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;
    var pattern=[], taps=[], beatIdx=0, startTime=0, running=false, animId=null;
    var rhStats=ls19Get('rhythm_stats',{played:0,perfectRate:0});

    var PATTERNS_4=[
      [1,0,1,0,1,0,1,0],[1,1,1,1,0,0,0,0],[1,0,0,1,1,0,0,1],[1,1,0,1,0,1,1,0],
      [1,0,1,1,0,1,0,1],[1,1,1,0,1,0,0,1],[1,0,0,0,1,1,1,0]
    ];
    var PATTERNS_3=[
      [1,0,1,0,1,0],[1,1,0,1,1,0],[1,0,0,1,0,1],[1,1,1,0,0,0]
    ];
    var PATTERNS_6=[
      [1,0,0,1,0,0,1,0,0,1,0,0],[1,1,0,1,0,0,1,1,0,1,0,0],[1,0,1,0,1,0,1,0,1,0,1,0]
    ];

    function genPattern(meter){
      if(meter===3) return PATTERNS_3[Math.floor(Math.random()*PATTERNS_3.length)].slice();
      if(meter===6) return PATTERNS_6[Math.floor(Math.random()*PATTERNS_6.length)].slice();
      return PATTERNS_4[Math.floor(Math.random()*PATTERNS_4.length)].slice();
    }

    function draw(now){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('리듬 패턴 게임',W/2,24);
      var bpm=parseInt(container.querySelector('#rhythm-bpm').value);
      var beatDur=60000/bpm;

      for(var i=0;i<pattern.length;i++){
        var x=40+i*(W-80)/pattern.length;
        var w=(W-80)/pattern.length-6;
        if(pattern[i]===1){
          var clr=i<taps.length?(taps[i]==='perfect'?'#22c55e':taps[i]==='good'?'#eab308':'#ef4444'):'#4a7dff';
          ctx.fillStyle=clr;ctx.globalAlpha=0.3;
          ctx.fillRect(x,80,w,60);ctx.globalAlpha=1;
          ctx.strokeStyle=clr;ctx.lineWidth=2;ctx.strokeRect(x,80,w,60);
          ctx.fillStyle=clr;ctx.font='bold 20px sans-serif';ctx.textAlign='center';
          ctx.fillText('●',x+w/2,118);
        }else{
          ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.strokeRect(x,80,w,60);
          ctx.fillStyle='#3a4568';ctx.font='14px sans-serif';ctx.textAlign='center';
          ctx.fillText('–',x+w/2,116);
        }
        if(i<taps.length&&taps[i]){
          ctx.fillStyle=taps[i]==='perfect'?'#22c55e':taps[i]==='good'?'#eab308':'#ef4444';
          ctx.font='9px sans-serif';ctx.textAlign='center';
          ctx.fillText(taps[i]==='perfect'?'Perfect':taps[i]==='good'?'Good':'Miss',x+w/2,156);
        }
      }

      if(running&&startTime){
        var elapsed=now-startTime;
        var curBeat=elapsed/beatDur;
        var lineX=40+curBeat*(W-80)/pattern.length;
        if(lineX>W-40){endGame();return;}
        ctx.strokeStyle='#eab308';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(lineX,70);ctx.lineTo(lineX,160);ctx.stroke();
      }

      var perfects=taps.filter(function(t){return t==='perfect'}).length;
      var goods=taps.filter(function(t){return t==='good'}).length;
      var misses=taps.filter(function(t){return t==='miss'}).length;
      ctx.fillStyle='#22c55e';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText('Perfect: '+perfects,W/3,190);
      ctx.fillStyle='#eab308';ctx.fillText('Good: '+goods,W/2,190);
      ctx.fillStyle='#ef4444';ctx.fillText('Miss: '+misses,2*W/3,190);

      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('누적 연주: '+rhStats.played+'회 | Perfect률: '+rhStats.perfectRate+'%',W/2,H-20);

      if(running) animId=requestAnimationFrame(draw);
    }

    function endGame(){
      running=false;
      container.querySelector('#rhythm-tap').style.display='none';
      var total=pattern.filter(function(p){return p===1}).length;
      var perfects=taps.filter(function(t){return t==='perfect'}).length;
      var goods=taps.filter(function(t){return t==='good'}).length;
      rhStats.played++;
      rhStats.perfectRate=Math.round(((rhStats.perfectRate*(rhStats.played-1))+Math.round(perfects/Math.max(total,1)*100))/rhStats.played);
      ls19Set('rhythm_stats',rhStats);
      var grade=perfects/total>=0.9?'S':perfects/total>=0.7?'A':(perfects+goods)/total>=0.7?'B':'C';
      ctx.fillStyle='#eab308';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
      ctx.fillText('결과: '+grade+'등급 (Perfect '+perfects+'/'+total+')',W/2,240);
      container.querySelector('#rhythm-info').textContent=grade+'등급! Perfect '+perfects+'/'+total;
    }

    container.querySelector('#rhythm-tap').addEventListener('click',function(){
      if(!running) return;
      var now=performance.now();
      var bpm=parseInt(container.querySelector('#rhythm-bpm').value);
      var beatDur=60000/bpm;
      var elapsed=now-startTime;
      var curBeat=Math.round(elapsed/beatDur*2)/2;
      var nearestIdx=Math.round(curBeat-0.5);
      if(nearestIdx<0)nearestIdx=0;
      if(nearestIdx>=pattern.length)nearestIdx=pattern.length-1;
      var expectedTime=(nearestIdx+0.5)*beatDur;
      var diff=Math.abs(elapsed-expectedTime);
      if(pattern[nearestIdx]===1&&!taps[nearestIdx]){
        if(diff<beatDur*0.15){taps[nearestIdx]='perfect';playSFX19('rhythm_perfect');}
        else if(diff<beatDur*0.3){taps[nearestIdx]='good';playSFX19('rhythm_tap');}
        else{taps[nearestIdx]='miss';}
      }
      markV19Feature('rhythm');
    });

    container.querySelector('#rhythm-start').addEventListener('click',function(){
      if(animId) cancelAnimationFrame(animId);
      var meter=parseInt(container.querySelector('#rhythm-meter').value);
      pattern=genPattern(meter);
      taps=[];beatIdx=0;running=true;
      startTime=performance.now();
      container.querySelector('#rhythm-tap').style.display='inline-block';
      draw(performance.now());
    });
    draw(0);
  });
}

// ================ 4. PRACTICE STREAK HEATMAP CANVAS ================
function buildStreakHeatmapUI(){
  makeV19Modal('streak-modal','🔥 연습 스트릭 히트맵',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">GitHub 스타일의 365일 연습 히트맵입니다. 매일 연습하면 스트릭이 쌌입니다!</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px">'+
      '<button class="ctrl-btn" id="streak-log" style="padding:5px 12px">오늘 연습 기록</button>'+
      '<span id="streak-count" style="font-size:12px;color:#eab308;padding:6px"></span>'+
      '</div>'+
      '<canvas id="streak-canvas" width="600" height="300" style="width:100%;max-width:600px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="streak-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#streak-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;
    var days=ls19Get('streak_days',{});
    var streak=ls19Get('streak_current',0);

    function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1<10?'0':'')+((d.getMonth()+1))+'-'+(d.getDate()<10?'0':'')+d.getDate();}

    function calcStreak(){
      var s=0,d=new Date();
      while(true){
        var k=d.getFullYear()+'-'+(d.getMonth()+1<10?'0':'')+((d.getMonth()+1))+'-'+(d.getDate()<10?'0':'')+d.getDate();
        if(days[k]){s++;d.setDate(d.getDate()-1);}
        else break;
      }
      return s;
    }

    function draw(){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('연습 스트릭 히트맵 (365일)',W/2,22);
      streak=calcStreak();
      container.querySelector('#streak-count').textContent='🔥 '+streak+'일 연속';

      var today=new Date();
      var startDate=new Date(today);
      startDate.setDate(startDate.getDate()-364);
      var dayOfWeek=startDate.getDay();
      startDate.setDate(startDate.getDate()-dayOfWeek);

      var cellSize=9,gap=2,offsetX=40,offsetY=55;
      var monthLabels=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
      var dayLabels=['일','월','화','수','목','금','토'];

      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='right';
      for(var di=0;di<7;di++){
        if(di%2===1) ctx.fillText(dayLabels[di],offsetX-4,offsetY+di*(cellSize+gap)+cellSize-1);
      }

      var lastMonth=-1;
      var curDate=new Date(startDate);
      for(var week=0;week<53;week++){
        for(var day=0;day<7;day++){
          var k=curDate.getFullYear()+'-'+(curDate.getMonth()+1<10?'0':'')+((curDate.getMonth()+1))+'-'+(curDate.getDate()<10?'0':'')+curDate.getDate();
          var x=offsetX+week*(cellSize+gap);
          var y=offsetY+day*(cellSize+gap);
          var val=days[k]||0;

          if(curDate<=today){
            if(val===0) ctx.fillStyle='#1e2640';
            else if(val===1) ctx.fillStyle='#0e4429';
            else if(val<=3) ctx.fillStyle='#006d32';
            else if(val<=5) ctx.fillStyle='#26a641';
            else ctx.fillStyle='#39d353';
            ctx.fillRect(x,y,cellSize,cellSize);
          }

          if(day===0&&curDate.getMonth()!==lastMonth){
            lastMonth=curDate.getMonth();
            ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';
            ctx.fillText(monthLabels[lastMonth],x+cellSize/2,offsetY-4);
          }
          curDate.setDate(curDate.getDate()+1);
        }
      }

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      var totalDays=Object.keys(days).length;
      var totalSessions=Object.values(days).reduce(function(a,b){return a+b},0);
      ctx.fillText('연습일: '+totalDays+'일 | 총 세션: '+totalSessions+'회 | 현재 스트릭: '+streak+'일',W/2,H-30);

      var legend=['#1e2640','#0e4429','#006d32','#26a641','#39d353'];
      var lx=W/2-60;
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText('Less',lx-4,H-12);
      legend.forEach(function(c,i){ctx.fillStyle=c;ctx.fillRect(lx+i*14,H-18,10,10);});
      ctx.fillStyle='#8892a8';ctx.textAlign='left';ctx.fillText('More',lx+legend.length*14+4,H-12);
    }

    container.querySelector('#streak-log').addEventListener('click',function(){
      var k=todayKey();
      days[k]=(days[k]||0)+1;
      ls19Set('streak_days',days);
      playSFX19('streak_log');
      draw();markV19Feature('streak');
      container.querySelector('#streak-info').textContent='오늘 '+days[k]+'회샰 연습 기록!';
    });
    draw();
  });
}

// ================ 5. FINGER AGILITY TRAINER CANVAS ================
function buildFingerTrainerUI(){
  makeV19Modal('finger-modal','✋ 손가락 민첩성 트레이너',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">5개 손가락(1~5) 버튼을 화면에 표시된 순서대로 빠르게 눌러주세요. 속도와 정확도로 등급을 받습니다.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
      '<select id="finger-mode" style="padding:4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
      '<option value="seq">순차 패턴</option><option value="rand">랜덤 패턴</option><option value="trill">트릴 패턴</option></select>'+
      '<button class="ctrl-btn" id="finger-start" style="padding:5px 12px">시작</button>'+
      '</div>'+
      '<canvas id="finger-canvas" width="560" height="340" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div id="finger-btns" style="display:none;justify-content:center;gap:8px;margin-top:10px"></div>'+
      '<div id="finger-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#finger-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;
    var fingerNames=['엄지','검지','중지','약지','새끼'];
    var sequence=[],curIdx=0,correct=0,wrong=0,startMs=0,running=false;
    var fStats=ls19Get('finger_stats',{total:0,avgSpeed:0,bestSpeed:0});

    function genSeq(mode,len){
      var s=[];
      if(mode==='seq'){for(var i=0;i<len;i++)s.push(i%5);}
      else if(mode==='trill'){
        var a=Math.floor(Math.random()*4),b=a+1;
        for(var j=0;j<len;j++)s.push(j%2===0?a:b);
      }else{
        for(var k=0;k<len;k++)s.push(Math.floor(Math.random()*5));
      }
      return s;
    }

    function draw(){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('손가락 민첩성 트레이너',W/2,24);

      var colors=['#ef4444','#eab308','#22c55e','#4a7dff','#a855f7'];
      var handY=100;
      for(var i=0;i<5;i++){
        var fx=W/2-120+i*60;
        var isTarget=running&&curIdx<sequence.length&&sequence[curIdx]===i;
        ctx.fillStyle=isTarget?colors[i]:'#1e2640';
        ctx.globalAlpha=isTarget?0.4:0.2;
        ctx.beginPath();
        ctx.roundRect(fx,handY,50,70,8);ctx.fill();
        ctx.globalAlpha=1;
        ctx.strokeStyle=isTarget?colors[i]:'#3a4568';ctx.lineWidth=isTarget?2:1;
        ctx.beginPath();ctx.roundRect(fx,handY,50,70,8);ctx.stroke();
        ctx.fillStyle=isTarget?colors[i]:'#8892a8';
        ctx.font=isTarget?'bold 22px sans-serif':'16px sans-serif';ctx.textAlign='center';
        ctx.fillText(''+(i+1),fx+25,handY+40);
        ctx.font='9px sans-serif';
        ctx.fillText(fingerNames[i],fx+25,handY+60);
      }

      if(running&&sequence.length>0){
        var visStart=Math.max(0,curIdx-3);
        var visEnd=Math.min(sequence.length,curIdx+12);
        for(var s=visStart;s<visEnd;s++){
          var sx=80+(s-visStart)*38;
          var isDone=s<curIdx;
          var isCur=s===curIdx;
          ctx.fillStyle=isDone?'#22c55e40':isCur?colors[sequence[s]]+'60':'#1e2640';
          ctx.fillRect(sx,200,32,32);
          ctx.strokeStyle=isDone?'#22c55e':isCur?colors[sequence[s]]:'#3a4568';
          ctx.lineWidth=isCur?2:1;ctx.strokeRect(sx,200,32,32);
          ctx.fillStyle=isDone?'#22c55e':isCur?'#e8ecf4':'#8892a8';
          ctx.font=isCur?'bold 14px sans-serif':'12px sans-serif';ctx.textAlign='center';
          ctx.fillText(''+(sequence[s]+1),sx+16,220);
        }
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
        ctx.fillText('진행: '+curIdx+'/'+sequence.length,W/2,260);
      }

      ctx.fillStyle='#22c55e';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText('정확: '+correct,W/3,290);
      ctx.fillStyle='#ef4444';ctx.fillText('오답: '+wrong,2*W/3,290);
      ctx.fillStyle='#8892a8';ctx.fillText('누적 '+fStats.total+'회 | 베스트 '+fStats.bestSpeed+'ms/키',W/2,H-15);
    }

    function endGame(){
      running=false;
      container.querySelector('#finger-btns').style.display='none';
      var elapsed=performance.now()-startMs;
      var speed=Math.round(elapsed/sequence.length);
      fStats.total++;
      fStats.avgSpeed=Math.round(((fStats.avgSpeed*(fStats.total-1))+speed)/fStats.total);
      if(!fStats.bestSpeed||speed<fStats.bestSpeed) fStats.bestSpeed=speed;
      ls19Set('finger_stats',fStats);
      draw();
      var grade=wrong===0&&speed<200?'S':wrong<=2&&speed<350?'A':wrong<=4?'B':'C';
      ctx.fillStyle='#eab308';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
      ctx.fillText(grade+'등급! 속도 '+speed+'ms/키',W/2,H/2+40);
    }

    function startGame(){
      var mode=container.querySelector('#finger-mode').value;
      sequence=genSeq(mode,20);curIdx=0;correct=0;wrong=0;running=true;
      startMs=performance.now();
      var btnsDiv=container.querySelector('#finger-btns');
      btnsDiv.style.display='flex';btnsDiv.innerHTML='';
      var colors=['#ef4444','#eab308','#22c55e','#4a7dff','#a855f7'];
      for(var i=0;i<5;i++){(function(idx){
        var b=document.createElement('button');
        b.style.cssText='padding:12px 18px;border-radius:10px;border:2px solid '+colors[idx]+';background:'+colors[idx]+'20;color:'+colors[idx]+';font-size:16px;font-weight:bold;cursor:pointer;min-width:48px';
        b.textContent=''+(idx+1);
        b.addEventListener('click',function(){
          if(!running||curIdx>=sequence.length) return;
          if(sequence[curIdx]===idx){correct++;playSFX19('finger_hit');}
          else{wrong++;}
          curIdx++;
          if(curIdx>=sequence.length){endGame();}
          else{draw();}
          markV19Feature('finger');
        });
        btnsDiv.appendChild(b);
      })(i);}
      draw();
    }

    container.querySelector('#finger-start').addEventListener('click',startGame);
    draw();
  });
}

// ================ 6. MUSIC ERA EXPLORER CANVAS ================
function buildEraExplorerUI(){
  makeV19Modal('era-modal','🏛️ 음악 시대 탐험기',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">바로크부터 현대까지 6개 음악 시대의 특징을 6축 Radar로 비교합니다.</p>'+
      '<canvas id="era-canvas" width="580" height="380" style="width:100%;max-width:580px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto;cursor:pointer"></canvas>'+
      '<div id="era-info" style="text-align:center;margin-top:6px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#era-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,H=canvas.height;

    var ERAS=[
      {name:'바로크',period:'1600-1750',color:'#ef4444',composers:'바흐, 헨델, 비발디',
       traits:[8,5,4,7,3,6],desc:'장식음, 대위법, 계속저음, 교회음악'},
      {name:'고전',period:'1750-1820',color:'#eab308',composers:'모차르트, 하이든, 베토벤',
       traits:[5,8,6,5,7,8],desc:'균형리, 명료한 형식, 소나타 형식'},
      {name:'낭만',period:'1820-1900',color:'#a855f7',composers:'쇼팡, 리스트, 차이코프스키',
       traits:[6,6,10,9,8,5],desc:'감정 표현, 기교, 자유로운 형식'},
      {name:'인상주의',period:'1880-1920',color:'#22c55e',composers:'드뽔시, 라벨, 사티',
       traits:[4,7,8,6,9,4],desc:'모호한 음색, 색채감, 전음계'},
      {name:'현대',period:'1900-1970',color:'#4a7dff',composers:'스트라빈스키, 프로코피에프, 바르톡',
       traits:[3,4,5,3,10,9],desc:'무조성, 12음 기법, 리듬 복잡성'},
      {name:'뉴에이지/민맘',period:'1970+',color:'#06b6d4',composers:'이루마, 조지 윈스턴, 사카모토',
       traits:[7,9,9,10,5,3],desc:'명상적, 단순 화성, 반복 패턴'}
    ];
    var axes=['장식성','구조미','감정성','접근성','혁신성','복잡도'];
    var selectedEra=0;

    function draw(){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('음악 시대 탐험기',W/2,22);

      var tabW=W/6;
      for(var e=0;e<ERAS.length;e++){
        var tx=e*tabW;
        ctx.fillStyle=e===selectedEra?ERAS[e].color+'30':'#1e2640';
        ctx.fillRect(tx+2,36,tabW-4,28);
        ctx.strokeStyle=ERAS[e].color;ctx.lineWidth=e===selectedEra?2:0.5;
        ctx.strokeRect(tx+2,36,tabW-4,28);
        ctx.fillStyle=e===selectedEra?ERAS[e].color:'#8892a8';
        ctx.font=(e===selectedEra?'bold ':'')+'9px sans-serif';ctx.textAlign='center';
        ctx.fillText(ERAS[e].name,tx+tabW/2,52);
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        ctx.fillText(ERAS[e].period,tx+tabW/2,62);
      }

      var era=ERAS[selectedEra];
      var cx=W/2-40,cy=200,r=85;
      for(var ring=5;ring>=1;ring--){
        ctx.strokeStyle='#1e2640';ctx.lineWidth=0.5;
        ctx.beginPath();
        for(var a=0;a<6;a++){
          var angle=Math.PI*2*a/6-Math.PI/2;
          var px=cx+Math.cos(angle)*(r*ring/5);
          var py=cy+Math.sin(angle)*(r*ring/5);
          if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
        }
        ctx.closePath();ctx.stroke();
      }
      for(var ax=0;ax<6;ax++){
        var angle2=Math.PI*2*ax/6-Math.PI/2;
        ctx.strokeStyle='#1e264060';ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(angle2)*r,cy+Math.sin(angle2)*r);ctx.stroke();
        var lx=cx+Math.cos(angle2)*(r+18);
        var ly=cy+Math.sin(angle2)*(r+18);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(axes[ax],lx,ly+3);
      }

      ctx.fillStyle=era.color+'30';ctx.strokeStyle=era.color;ctx.lineWidth=2;
      ctx.beginPath();
      for(var t=0;t<6;t++){
        var ta=Math.PI*2*t/6-Math.PI/2;
        var tr=r*era.traits[t]/10;
        var tpx=cx+Math.cos(ta)*tr;
        var tpy=cy+Math.sin(ta)*tr;
        if(t===0)ctx.moveTo(tpx,tpy);else ctx.lineTo(tpx,tpy);
      }
      ctx.closePath();ctx.fill();ctx.stroke();

      var infoX=W-160,infoY=90;
      ctx.fillStyle=era.color;ctx.font='bold 14px sans-serif';ctx.textAlign='left';
      ctx.fillText(era.name+' 시대',infoX,infoY);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(era.period,infoX,infoY+18);
      ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';
      ctx.fillText('대표: '+era.composers,infoX,infoY+36);
      var descLines=era.desc.split(', ');
      for(var dl=0;dl<descLines.length;dl++){
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText('• '+descLines[dl],infoX,infoY+54+dl*14);
      }

      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText('상단 탭을 클릭하여 시대별 특징을 비교하세요',W/2,H-15);
    }

    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var y=(e.clientY-rect.top)*(H/rect.height);
      var x=(e.clientX-rect.left)*(W/rect.width);
      if(y>=36&&y<=64){
        var idx=Math.floor(x/(W/6));
        if(idx>=0&&idx<6){selectedEra=idx;draw();playSFX19('era_select');markV19Feature('era');}
      }
    });
    draw();
  });
}

// ================ 7. PERFORMANCE REPORT CARD CANVAS ================
function buildReportCardUI(){
  makeV19Modal('report-modal','📊 퍼포먼스 리포트 카드',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">나의 피아노 연주 통계를 멋진 리포트 카드로 생성합니다. PNG로 다운로드할 수 있습니다.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px">'+
      '<button class="ctrl-btn" id="report-gen" style="padding:5px 12px">리포트 생성</button>'+
      '<button class="ctrl-btn" id="report-dl" style="padding:5px 12px;display:none">💾 PNG 다운로드</button>'+
      '</div>'+
      '<canvas id="report-canvas" width="600" height="400" style="width:100%;max-width:600px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>';
    var canvas=container.querySelector('#report-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,HH=canvas.height;

    function gatherStats(){
      var songCount=window.SONGS?window.SONGS.length:0;
      var played=0,totalScore=0,bestScore=0,bestSong='';
      try{
        for(var i=0;i<localStorage.length;i++){
          var k=localStorage.key(i);
          if(k&&k.indexOf('best-')===0){
            var v=parseInt(localStorage.getItem(k))||0;
            if(v>0){played++;totalScore+=v;if(v>bestScore){bestScore=v;bestSong=k.replace('best-','');}}
          }
        }
      }catch(e){}
      var streakDays=ls19Get('streak_days',{});
      var streak=Object.keys(streakDays).length;
      var sightStats=ls19Get('sight_stats',{total:0,correct:0,bestStreak:0});
      var fingerStats=ls19Get('finger_stats',{total:0,avgSpeed:0,bestSpeed:0});
      return {songCount:songCount,played:played,avgScore:played?Math.round(totalScore/played):0,bestScore:bestScore,bestSong:bestSong,
              streak:streak,sightTotal:sightStats.total,sightAcc:sightStats.total?Math.round(sightStats.correct/sightStats.total*100):0,
              fingerSpeed:fingerStats.bestSpeed||0};
    }

    function drawReport(){
      var stats=gatherStats();
      ctx.clearRect(0,0,W,HH);
      var grd=ctx.createLinearGradient(0,0,W,HH);
      grd.addColorStop(0,'#0a0e1a');grd.addColorStop(1,'#141828');
      ctx.fillStyle=grd;ctx.fillRect(0,0,W,HH);

      ctx.strokeStyle='#4a7dff40';ctx.lineWidth=3;
      ctx.strokeRect(8,8,W-16,HH-16);
      ctx.strokeStyle='#eab30840';ctx.lineWidth=1;
      ctx.strokeRect(14,14,W-28,HH-28);

      ctx.fillStyle='#eab308';ctx.font='bold 20px sans-serif';ctx.textAlign='center';
      ctx.fillText('🎹 Piano Master Report Card',W/2,50);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      var d=new Date();
      ctx.fillText(d.getFullYear()+'.'+((d.getMonth()+1)<10?'0':'')+(d.getMonth()+1)+'.'+((d.getDate())<10?'0':'')+d.getDate(),W/2,68);

      var metrics=[
        {label:'총 곡 수',value:''+stats.songCount,color:'#4a7dff'},
        {label:'연주한 곡',value:''+stats.played,color:'#22c55e'},
        {label:'평균 점수',value:''+stats.avgScore,color:'#eab308'},
        {label:'최고 점수',value:''+stats.bestScore,color:'#ef4444'},
        {label:'연습일수',value:stats.streak+'일',color:'#a855f7'},
        {label:'사이트리딩',value:stats.sightAcc+'%',color:'#06b6d4'}
      ];

      for(var i=0;i<6;i++){
        var col=i%3,row=Math.floor(i/3);
        var mx=40+col*180,my=90+row*80;
        ctx.fillStyle=metrics[i].color+'15';
        ctx.fillRect(mx,my,160,60);
        ctx.strokeStyle=metrics[i].color+'60';ctx.lineWidth=1;
        ctx.strokeRect(mx,my,160,60);
        ctx.fillStyle=metrics[i].color;ctx.font='bold 22px sans-serif';ctx.textAlign='center';
        ctx.fillText(metrics[i].value,mx+80,my+30);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText(metrics[i].label,mx+80,my+48);
      }

      if(stats.bestSong){
        ctx.fillStyle='#eab308';ctx.font='11px sans-serif';ctx.textAlign='center';
        ctx.fillText('⭐ 최고 점수 곡: '+decodeURIComponent(stats.bestSong),W/2,280);
      }

      var overall=stats.played>=50?'S':stats.played>=30?'A':stats.played>=15?'B':stats.played>=5?'C':'F';
      ctx.fillStyle=overall==='S'?'#eab308':overall==='A'?'#22c55e':overall==='B'?'#4a7dff':'#8892a8';
      ctx.font='bold 40px sans-serif';ctx.textAlign='center';
      ctx.fillText(overall,W/2,340);
      ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
      ctx.fillText('종합 등급',W/2,360);

      ctx.fillStyle='#3a4568';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText('Piano Master v19 | Generated by PRIME Holdings Auto Engine',W/2,HH-16);

      container.querySelector('#report-dl').style.display='inline-block';
      playSFX19('report_gen');markV19Feature('report');
    }

    container.querySelector('#report-gen').addEventListener('click',drawReport);
    container.querySelector('#report-dl').addEventListener('click',function(){
      var link=document.createElement('a');
      link.download='piano-report-card.png';
      link.href=canvas.toDataURL('image/png');
      link.click();
    });

    ctx.fillStyle='#8892a8';ctx.font='13px sans-serif';ctx.textAlign='center';
    ctx.fillText('리포트 생성 버튼을 눌러주세요',W/2,HH/2);
  });
}

// ================ 8. PIANO TUNING TRAINER CANVAS ================
function buildTuningTrainerUI(){
  makeV19Modal('tuning-modal','🔧 피아노 조율 트레이너',function(container){
    container.innerHTML='<p style="font-size:11px;color:var(--text2);margin-bottom:8px">목표 음을 듣고 슬라이더로 주파수를 조절해 정확하게 맞춰보세요. 편차 ±2Hz 이내면 Perfect!</p>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">'+
      '<button class="ctrl-btn" id="tune-listen" style="padding:5px 12px">🔊 목표음 듣기</button>'+
      '<button class="ctrl-btn" id="tune-next" style="padding:5px 12px">다음 문제</button>'+
      '<button class="ctrl-btn" id="tune-check" style="padding:5px 12px">✔ 확인</button>'+
      '</div>'+
      '<canvas id="tuning-canvas" width="560" height="320" style="width:100%;max-width:560px;background:#0a0e1a;border:1px solid var(--border);border-radius:8px;display:block;margin:0 auto"></canvas>'+
      '<div style="text-align:center;margin-top:8px">'+
      '<input id="tune-slider" type="range" min="220" max="880" value="440" step="1" style="width:80%;max-width:400px">'+
      '</div>'+
      '<div id="tuning-info" style="text-align:center;margin-top:4px;font-size:11px;color:var(--text2)"></div>';
    var canvas=container.querySelector('#tuning-canvas');
    var ctx=canvas.getContext('2d');
    var W=canvas.width,HH=canvas.height;
    var slider=container.querySelector('#tune-slider');

    var NOTES=[
      {name:'A4',freq:440},{name:'C4',freq:262},{name:'E4',freq:330},{name:'G4',freq:392},
      {name:'B4',freq:494},{name:'D5',freq:587},{name:'F4',freq:349},{name:'C5',freq:523},
      {name:'A3',freq:220},{name:'E5',freq:659},{name:'G3',freq:196},{name:'D4',freq:294}
    ];
    var currentIdx=0,userFreq=440,score=0,total=0;
    var tStats=ls19Get('tuning_stats',{total:0,perfects:0});

    function randomNote(){
      currentIdx=Math.floor(Math.random()*NOTES.length);
      var target=NOTES[currentIdx];
      slider.min=Math.max(100,Math.round(target.freq*0.7));
      slider.max=Math.round(target.freq*1.3);
      slider.value=Math.round(target.freq*(0.85+Math.random()*0.3));
      userFreq=parseInt(slider.value);
    }

    function draw(){
      ctx.clearRect(0,0,W,HH);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,HH);
      ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText('피아노 조율 트레이너',W/2,22);

      var target=NOTES[currentIdx];
      ctx.fillStyle='#eab308';ctx.font='bold 28px sans-serif';ctx.textAlign='center';
      ctx.fillText(target.name,W/2,65);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('목표: '+target.freq+'Hz',W/2,85);

      var diff=userFreq-target.freq;
      var absDiff=Math.abs(diff);
      var maxRange=target.freq*0.3;
      var meterW=400,meterH=30;
      var mx=(W-meterW)/2,my=110;

      ctx.fillStyle='#1e2640';ctx.fillRect(mx,my,meterW,meterH);
      var centerX=mx+meterW/2;
      ctx.strokeStyle='#22c55e';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(centerX,my-5);ctx.lineTo(centerX,my+meterH+5);ctx.stroke();

      ctx.fillStyle='#22c55e20';
      var perfectZone=meterW*(2/maxRange)/2;
      ctx.fillRect(centerX-perfectZone,my,perfectZone*2,meterH);

      var needleX=centerX+(diff/maxRange)*(meterW/2);
      needleX=Math.max(mx,Math.min(mx+meterW,needleX));
      var needleColor=absDiff<=2?'#22c55e':absDiff<=10?'#eab308':'#ef4444';
      ctx.fillStyle=needleColor;
      ctx.beginPath();ctx.moveTo(needleX-6,my+meterH);ctx.lineTo(needleX+6,my+meterH);
      ctx.lineTo(needleX,my+meterH-12);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(needleX-6,my);ctx.lineTo(needleX+6,my);
      ctx.lineTo(needleX,my+12);ctx.closePath();ctx.fill();

      ctx.fillStyle='#e8ecf4';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(userFreq+'Hz',W/2,175);
      ctx.fillStyle=needleColor;ctx.font='12px sans-serif';
      var diffStr=diff>0?'+'+diff.toFixed(1)+'Hz':diff.toFixed(1)+'Hz';
      ctx.fillText('편차: '+diffStr,W/2,195);

      var waveY=240,waveH=50;
      ctx.strokeStyle='#4a7dff40';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(0,waveY);ctx.lineTo(W,waveY);ctx.stroke();
      ctx.strokeStyle=needleColor;ctx.lineWidth=1.5;
      ctx.beginPath();
      for(var x=0;x<W;x++){
        var phase=x*0.03*(userFreq/440);
        var y=waveY+Math.sin(phase)*waveH*0.4+Math.sin(phase*2.01)*waveH*0.15;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();

      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText('점수: '+score+'/'+total+' | 누적 Perfect: '+tStats.perfects+'/'+tStats.total,W/2,HH-15);
    }

    function playTone(freq,dur){
      if(!sfx19)return;if(sfx19.state==='suspended')sfx19.resume();
      var t=sfx19.currentTime;
      var o=sfx19.createOscillator(),g=sfx19.createGain();
      o.connect(g);g.connect(sfx19.destination);
      o.type='sine';o.frequency.setValueAtTime(freq,t);
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
      o.start(t);o.stop(t+dur);
    }

    slider.addEventListener('input',function(){
      userFreq=parseInt(slider.value);
      playTone(userFreq,0.15);
      draw();
    });

    container.querySelector('#tune-listen').addEventListener('click',function(){
      playTone(NOTES[currentIdx].freq,1);playSFX19('tune_match');
    });

    container.querySelector('#tune-next').addEventListener('click',function(){
      randomNote();draw();markV19Feature('tuning');
    });

    container.querySelector('#tune-check').addEventListener('click',function(){
      var target=NOTES[currentIdx];
      var diff=Math.abs(userFreq-target.freq);
      total++;tStats.total++;
      if(diff<=2){score++;tStats.perfects++;playSFX19('tune_perfect');
        container.querySelector('#tuning-info').textContent='Perfect! 정확하게 맞첤습니다!';
      }else if(diff<=10){score++;
        container.querySelector('#tuning-info').textContent='Good! 거의 맞쳤습니다 (±'+diff.toFixed(1)+'Hz)';
      }else{
        container.querySelector('#tuning-info').textContent='Miss! 편차 '+diff.toFixed(1)+'Hz (목표: '+target.freq+'Hz)';
      }
      ls19Set('tuning_stats',tStats);
      draw();randomNote();setTimeout(draw,1500);
    });

    randomNote();draw();
  });
}

// ================ QUIZ v10 (15 Questions, 135->150) ================
function buildQuizV10UI(){
  makeV19Modal('quiz10-modal','🧠 피아노 퀴즈 v10',function(container){
    var questions=[
      {q:'피아노의 88건 중 검은 건반은 몇 개인가요?',a:['\x33\x36개','\x34\x38개','\x35\x32개','\x34\x30개'],c:0},
      {q:'4/4박자에서 점이너음표(♪.)의 박수는?',a:['\x33박','\x32박','\x31.\x35박','\x34박'],c:0},
      {q:'단조(Minor key)의 특징으로 올바른 것은?',a:['슬프고 어두운 느낌','밝고 활기찬 느낌','경쾌한 느낌','웅장한 느낌'],c:0},
      {q:'쇼팡이 태어난 나라는?',a:['폴란드','독일','오스트리아','프랑스'],c:0},
      {q:'Allegro의 의미는?',a:['빠르게','느리게','중간 빠르기로','매우 느리게'],c:0},
      {q:'피아노 페달 3개 중 오른쪽 페달의 역할은?',a:['음을 지속시킴 (Sustain)','소리를 줄임','특정 음만 지속','반음 올림'],c:0},
      {q:'C 메이저 스케일에서 5번째 음은?',a:['G','F','A','E'],c:0},
      {q:'시각적으로 악보를 읽으며 바로 연주하는 능력을 뭐라고 하나요?',a:['사이트리딩 (Sight-reading)','암보 (Memorization)','초견 (Sightseeing)','청음 (Ear training)'],c:0},
      {q:'A4 음의 표준 주파수는?',a:['\x34\x34\x30Hz','\x34\x32\x30Hz','\x34\x36\x30Hz','\x34\x30\x30Hz'],c:0},
      {q:'아르페지오(Arpeggio)란?',a:['아코드 음을 순서대로 연주','빠르게 반복 연주','음을 끊어 연주','두 손을 교차 연주'],c:0},
      {q:'보행법(Voicing)의 4성체에서 가장 높은 성부는?',a:['소프라노','알토','테너','베이스'],c:0},
      {q:'피아노 소나타의 3악장 형식은 보통 어떤 템포인가요?',a:['빠르게-느리게-빠르게','느리게-빠르게-느리게','보통-빠르게-느리게','느리게-느리게-빠르게'],c:0},
      {q:'피아노에서 pp는 무슨 뜻인가요?',a:['매우 여리게 (Pianissimo)','매우 크게','점점 크게','점점 여리게'],c:0},
      {q:'Ragtime 음악의 특징적 리듬 패턴은?',a:['싱코페이션 (Syncopation)','스윗 (Swing)','슈플 (Shuffle)','스트레이트 (Straight)'],c:0}
    ];
    var idx=0,score=0,answered=false;
    var qStats=ls19Get('quiz10_stats',{total:0,correct:0});

    function renderQ(){
      var q=questions[idx];answered=false;
      container.innerHTML='<div style="margin-bottom:12px"><span style="font-size:11px;color:var(--accent)">문제 '+(idx+1)+'/'+questions.length+'</span>'+
        '<div style="height:3px;background:var(--border);border-radius:2px;margin-top:4px"><div style="height:100%;width:'+Math.round((idx/questions.length)*100)+'%;background:var(--accent);border-radius:2px"></div></div></div>'+
        '<p style="font-size:13px;margin-bottom:12px;color:var(--text)">'+q.q+'</p>';
      q.a.forEach(function(a,i){
        var btn=document.createElement('button');
        btn.style.cssText='display:block;width:100%;text-align:left;padding:10px 14px;margin-bottom:6px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer';
        btn.textContent=(i+1)+'. '+a;
        btn.addEventListener('click',function(){
          if(answered) return;answered=true;
          qStats.total++;
          if(i===q.c){score++;qStats.correct++;btn.style.borderColor='#22c55e';btn.style.background='#22c55e20';playSFX19('sight_correct');}
          else{btn.style.borderColor='#ef4444';btn.style.background='#ef4444';
            container.querySelectorAll('button')[q.c].style.borderColor='#22c55e';container.querySelectorAll('button')[q.c].style.background='#22c55e20';
            playSFX19('sight_wrong');
          }
          ls19Set('quiz10_stats',qStats);
          setTimeout(function(){idx++;if(idx<questions.length)renderQ();else showResult();},1200);
        });
        container.appendChild(btn);
      });
    }

    function showResult(){
      var grade=score/questions.length>=0.9?'S':score/questions.length>=0.8?'A':score/questions.length>=0.6?'B':'C';
      container.innerHTML='<div style="text-align:center;padding:20px">'+
        '<div style="font-size:40px;color:'+(grade==='S'?'#eab308':'#4a7dff')+'">'+grade+'</div>'+
        '<p style="font-size:14px;color:var(--text);margin:8px 0">'+score+'/'+questions.length+' 정답</p>'+
        '<p style="font-size:11px;color:var(--text2)">누적: '+qStats.correct+'/'+qStats.total+' ('+Math.round(qStats.correct/Math.max(qStats.total,1)*100)+'%)</p>'+
        '<button class="ctrl-btn" style="margin-top:12px;padding:8px 20px" onclick="this.closest(\'[id$=modal]\').style.display=\'none\'">닫기</button></div>';
      markV19Feature('quiz10');
    }
    renderQ();
  });
}

// ================ ACHIEVEMENTS v19 (+12, 156->168) ================
var V19_ACHIEVEMENTS=[
  {id:'v19_sight_master',name:'사이트리딩 마스터',desc:'사이트리딩 50문제 이상 풀기',icon:'🎼'},
  {id:'v19_chord_builder',name:'코드 빌더',desc:'코드 프로그레션 10회 재생',icon:'🎶'},
  {id:'v19_rhythm_king',name:'리듬의 왕',desc:'리듬 게임 10회 연주',icon:'🥁'},
  {id:'v19_streak_7',name:'7일 스트릭',desc:'7일 연속 연습',icon:'🔥'},
  {id:'v19_streak_30',name:'30일 스트릭',desc:'30일 연속 연습',icon:'🏆'},
  {id:'v19_finger_speed',name:'빠른 손가락',desc:'손가락 속도 250ms/키 이하',icon:'✋'},
  {id:'v19_era_explorer',name:'시대 탐험가',desc:'6개 시대 모두 탐색',icon:'🏛️'},
  {id:'v19_report_gen',name:'리포트 생성기',desc:'퍼포먼스 리포트 카드 생성',icon:'📊'},
  {id:'v19_tuner',name:'조율 마스터',desc:'조율 Perfect 10회 달성',icon:'🔧'},
  {id:'v19_quiz10_s',name:'퀴즈 v10 S등급',desc:'퀴즈 v10에서 S등급 획득',icon:'🧠'},
  {id:'v19_all_features',name:'v19 컴플리트',desc:'v19 8개 기능 모두 사용',icon:'⭐'},
  {id:'v19_162songs',name:'162곡 마스터',desc:'162곡 중 50곡 이상 연주',icon:'🎹'}
];

function injectV19Achievements(){
  if(!window.app) return;
  if(!app.achievements) app.achievements=[];
  V19_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(e){return e.id===a.id});
    if(!exists) app.achievements.push({id:a.id,name:a.name,desc:a.desc,icon:a.icon,unlocked:ls19Get('ach_'+a.id,false)});
  });
}

function unlockV19Achievement(id){
  if(ls19Get('ach_'+id,false)) return;
  ls19Set('ach_'+id,true);
  if(window.app&&app.achievements){
    app.achievements.forEach(function(a){if(a.id===id)a.unlocked=true;});
  }
  playSFX19('v19_achieve');
  var ach=V19_ACHIEVEMENTS.find(function(a){return a.id===id});
  if(ach){
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#eab308;color:#000;padding:8px 16px;border-radius:8px;font-size:12px;z-index:9999;animation:modalIn 0.3s';
    toast.textContent='🏆 업적 해금: '+ach.name;
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove()},3000);
  }
}

function checkV19Achievements(){
  var sightStats=ls19Get('sight_stats',{total:0,correct:0});
  if(sightStats.total>=50) unlockV19Achievement('v19_sight_master');

  var chordCustom=ls19Get('chord_custom',[]);
  if(chordCustom.length>=4) unlockV19Achievement('v19_chord_builder');

  var rhStats=ls19Get('rhythm_stats',{played:0});
  if(rhStats.played>=10) unlockV19Achievement('v19_rhythm_king');

  var streakDays=ls19Get('streak_days',{});
  var streakCount=0,d=new Date();
  while(true){
    var k=d.getFullYear()+'-'+(d.getMonth()+1<10?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate();
    if(streakDays[k]){streakCount++;d.setDate(d.getDate()-1);}else break;
  }
  if(streakCount>=7) unlockV19Achievement('v19_streak_7');
  if(streakCount>=30) unlockV19Achievement('v19_streak_30');

  var fStats=ls19Get('finger_stats',{bestSpeed:0});
  if(fStats.bestSpeed>0&&fStats.bestSpeed<=250) unlockV19Achievement('v19_finger_speed');

  var used=ls19Get('features_used',[]);
  if(used.indexOf('era')!==-1) unlockV19Achievement('v19_era_explorer');
  if(used.indexOf('report')!==-1) unlockV19Achievement('v19_report_gen');

  var tStats=ls19Get('tuning_stats',{perfects:0});
  if(tStats.perfects>=10) unlockV19Achievement('v19_tuner');

  var qStats=ls19Get('quiz10_stats',{total:0,correct:0});
  if(qStats.total>=15&&qStats.correct/qStats.total>=0.9) unlockV19Achievement('v19_quiz10_s');

  if(used.length>=8) unlockV19Achievement('v19_all_features');

  var played=0;
  try{for(var i=0;i<localStorage.length;i++){var lk=localStorage.key(i);if(lk&&lk.indexOf('best-')===0&&parseInt(localStorage.getItem(lk))>0)played++;}}catch(e){}
  if(played>=50) unlockV19Achievement('v19_162songs');
}

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV19Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'H':'sight-modal',
      'I':'chord-modal',
      'J':'rhythm-modal',
      'K':'streak-modal',
      'L':'finger-modal',
      'N':'era-modal',
      'O':'report-modal',
      'U':'tuning-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV19NavButtons(){
  var existingNav=document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎼 사이트리딩',modal:'sight-modal'},
    {label:'🎶 코드진행',modal:'chord-modal'},
    {label:'🥁 리듬',modal:'rhythm-modal'},
    {label:'🔥 스트릭',modal:'streak-modal'},
    {label:'✋ 손가락',modal:'finger-modal'},
    {label:'🏛️ 시대',modal:'era-modal'},
    {label:'📊 리포트',modal:'report-modal'},
    {label:'🔧 조율',modal:'tuning-modal'},
    {label:'🧠 퀴즈v10',modal:'quiz10-modal'}
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
function initV19(){
  addV19Songs();
  buildSightReadingUI();
  buildChordProgUI();
  buildRhythmGameUI();
  buildStreakHeatmapUI();
  buildFingerTrainerUI();
  buildEraExplorerUI();
  buildReportCardUI();
  buildTuningTrainerUI();
  buildQuizV10UI();
  injectV19Achievements();
  setupV19Shortcuts();
  injectV19NavButtons();
  setInterval(checkV19Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV19,4500);});
else setTimeout(initV19,4500);
})();
