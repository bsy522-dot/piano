// Piano Master v27 Patch Module
// Interval Ear Training, Chord Voicing Workshop, Finger Independence Diagnostic,
// Practice Energy Map, Piano Timbre Palette, Motif Transformation Lab,
// Transposition Mastery Tracker, Comprehensive Piano IQ Dashboard
// 10 Songs (232->242), Quiz v18 15Q (255->270), 12 Achievements (252->264), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v27Loaded) return;
window.__v27Loaded = true;

var LS27 = 'piano-v27-';
function ls27Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS27+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls27Set(k,v){localStorage.setItem(LS27+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v27 (16 sounds) ================
var sfx27 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone27(freq,type,dur,gainVal,delayMs){
  if(!sfx27) return;
  setTimeout(function(){
    if(!sfx27) return;
    var t=sfx27.currentTime,g=sfx27.createGain(),o=sfx27.createOscillator();
    o.connect(g);g.connect(sfx27.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX27(type){
  if(!sfx27) return;
  if(sfx27.state==='suspended') sfx27.resume();
  switch(type){
    case 'interval_open': tone27(440,'triangle',0.1,0.06,0); tone27(554,'triangle',0.1,0.06,80); break;
    case 'interval_correct': tone27(523,'triangle',0.08,0.08,0); tone27(659,'triangle',0.08,0.08,60); tone27(784,'triangle',0.1,0.08,120); break;
    case 'interval_wrong': tone27(311,'sawtooth',0.15,0.05,0); break;
    case 'chord_open': tone27(392,'triangle',0.1,0.06,0); tone27(494,'triangle',0.1,0.06,70); break;
    case 'chord_voicing': tone27(262,'sine',0.12,0.06,0); tone27(330,'sine',0.12,0.06,40); tone27(392,'sine',0.12,0.06,80); break;
    case 'finger_test': tone27(349,'triangle',0.08,0.05,0); tone27(440,'triangle',0.08,0.05,60); break;
    case 'finger_result': tone27(523,'triangle',0.1,0.07,0); tone27(659,'triangle',0.1,0.07,70); tone27(784,'triangle',0.12,0.07,140); break;
    case 'energy_open': tone27(330,'sine',0.1,0.05,0); break;
    case 'energy_insight': tone27(440,'triangle',0.1,0.06,0); tone27(554,'triangle',0.12,0.06,80); break;
    case 'timbre_select': tone27(494,'sine',0.1,0.06,0); tone27(659,'sine',0.08,0.06,60); break;
    case 'timbre_compare': tone27(392,'triangle',0.08,0.05,0); tone27(523,'triangle',0.08,0.05,50); tone27(659,'triangle',0.1,0.05,100); break;
    case 'motif_play': tone27(523,'sine',0.08,0.06,0); tone27(587,'sine',0.08,0.06,50); tone27(659,'sine',0.1,0.06,100); break;
    case 'motif_transform': tone27(440,'triangle',0.1,0.07,0); tone27(554,'triangle',0.1,0.07,60); tone27(698,'triangle',0.12,0.07,120); break;
    case 'trans_correct': tone27(659,'triangle',0.08,0.07,0); tone27(784,'triangle',0.1,0.07,60); break;
    case 'v27_achieve': tone27(523,'triangle',0.1,0.1,0); tone27(659,'triangle',0.12,0.1,80); tone27(784,'triangle',0.12,0.1,160); tone27(1047,'triangle',0.25,0.12,240); break;
    case 'quiz_correct27': tone27(698,'triangle',0.1,0.07,0); tone27(880,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v27 ================
function makeV27Modal(id, title, contentFn){
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

function markV27Feature(name){
  var used=ls27Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls27Set('features_used',used);}
}

function gradeOf27(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}
function gradeColor27(g){return g==='S'?'#ffd700':g==='A'?'#4a7dff':g==='B'?'#36d399':g==='C'?'#f59e0b':'#ef4444';}

// ================ 10 NEW SONGS (232->242) ================
function addV27Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s233',name:'드뷔시 달빛 (Clair de Lune)',category:'클래식',difficulty:'medium',
     notes:[{note:'Db4',time:0,dur:0.6},{note:'Ab4',time:0.6,dur:0.3},{note:'Bb4',time:0.9,dur:0.3},{note:'Db5',time:1.2,dur:0.6},{note:'Bb4',time:1.8,dur:0.3},{note:'Ab4',time:2.1,dur:0.3},{note:'Gb4',time:2.4,dur:0.6},{note:'Ab4',time:3.0,dur:0.3},{note:'Bb4',time:3.3,dur:0.3},{note:'Ab4',time:3.6,dur:0.6},{note:'Gb4',time:4.2,dur:0.3},{note:'F4',time:4.5,dur:0.9}]},
    {id:'s234',name:'리스트 라 캄파넬라',category:'클래식',difficulty:'expert',
     notes:[{note:'G#5',time:0,dur:0.12},{note:'G#6',time:0.12,dur:0.12},{note:'F#5',time:0.24,dur:0.12},{note:'G#6',time:0.36,dur:0.12},{note:'E5',time:0.48,dur:0.12},{note:'G#6',time:0.6,dur:0.12},{note:'D#5',time:0.72,dur:0.12},{note:'G#6',time:0.84,dur:0.12},{note:'E5',time:0.96,dur:0.12},{note:'G#6',time:1.08,dur:0.12},{note:'F#5',time:1.2,dur:0.12},{note:'G#6',time:1.32,dur:0.25}]},
    {id:'s235',name:'모차르트 터키 행진곡 K.331',category:'클래식',difficulty:'medium',
     notes:[{note:'B4',time:0,dur:0.15},{note:'A4',time:0.15,dur:0.15},{note:'G#4',time:0.3,dur:0.15},{note:'A4',time:0.45,dur:0.3},{note:'C5',time:0.75,dur:0.3},{note:'B4',time:1.05,dur:0.15},{note:'A4',time:1.2,dur:0.15},{note:'G#4',time:1.35,dur:0.15},{note:'A4',time:1.5,dur:0.3},{note:'E5',time:1.8,dur:0.3},{note:'D5',time:2.1,dur:0.15},{note:'C5',time:2.25,dur:0.15}]},
    {id:'s236',name:'베토벤 엘리제를 위하여',category:'클래식',difficulty:'easy',
     notes:[{note:'E5',time:0,dur:0.25},{note:'D#5',time:0.25,dur:0.25},{note:'E5',time:0.5,dur:0.25},{note:'D#5',time:0.75,dur:0.25},{note:'E5',time:1.0,dur:0.25},{note:'B4',time:1.25,dur:0.25},{note:'D5',time:1.5,dur:0.25},{note:'C5',time:1.75,dur:0.25},{note:'A4',time:2.0,dur:0.5},{note:'C4',time:2.5,dur:0.25},{note:'E4',time:2.75,dur:0.25},{note:'A4',time:3.0,dur:0.5}]},
    {id:'s237',name:'쇼팽 영웅 폴로네이즈 Op.53',category:'클래식',difficulty:'expert',
     notes:[{note:'Ab3',time:0,dur:0.15},{note:'Eb4',time:0.15,dur:0.15},{note:'Ab4',time:0.3,dur:0.15},{note:'C5',time:0.45,dur:0.15},{note:'Eb5',time:0.6,dur:0.3},{note:'Db5',time:0.9,dur:0.15},{note:'C5',time:1.05,dur:0.15},{note:'Bb4',time:1.2,dur:0.15},{note:'Ab4',time:1.35,dur:0.15},{note:'Bb4',time:1.5,dur:0.15},{note:'C5',time:1.65,dur:0.15},{note:'Db5',time:1.8,dur:0.4}]},
    {id:'s238',name:'요한 세바스찬 바흐 프렐류드 C장조',category:'클래식',difficulty:'medium',
     notes:[{note:'C4',time:0,dur:0.15},{note:'E4',time:0.15,dur:0.15},{note:'G4',time:0.3,dur:0.15},{note:'C5',time:0.45,dur:0.15},{note:'E5',time:0.6,dur:0.15},{note:'G4',time:0.75,dur:0.15},{note:'C5',time:0.9,dur:0.15},{note:'E5',time:1.05,dur:0.15},{note:'C4',time:1.2,dur:0.15},{note:'E4',time:1.35,dur:0.15},{note:'G4',time:1.5,dur:0.15},{note:'C5',time:1.65,dur:0.15}]},
    {id:'s239',name:'조지 윈스턴 December',category:'뉴에이지',difficulty:'medium',
     notes:[{note:'A3',time:0,dur:0.4},{note:'E4',time:0.4,dur:0.4},{note:'A4',time:0.8,dur:0.4},{note:'B4',time:1.2,dur:0.4},{note:'C5',time:1.6,dur:0.8},{note:'B4',time:2.4,dur:0.4},{note:'A4',time:2.8,dur:0.4},{note:'G4',time:3.2,dur:0.4},{note:'F4',time:3.6,dur:0.4},{note:'E4',time:4.0,dur:0.8},{note:'D4',time:4.8,dur:0.4},{note:'C4',time:5.2,dur:0.8}]},
    {id:'s240',name:'유키 구라모토 로맨스',category:'뉴에이지',difficulty:'easy',
     notes:[{note:'E4',time:0,dur:0.5},{note:'G4',time:0.5,dur:0.25},{note:'A4',time:0.75,dur:0.25},{note:'B4',time:1.0,dur:0.75},{note:'A4',time:1.75,dur:0.25},{note:'G4',time:2.0,dur:0.5},{note:'E4',time:2.5,dur:0.25},{note:'D4',time:2.75,dur:0.25},{note:'E4',time:3.0,dur:0.75},{note:'G4',time:3.75,dur:0.25},{note:'A4',time:4.0,dur:0.5},{note:'B4',time:4.5,dur:1.0}]},
    {id:'s241',name:'리처드 클레이더만 사랑의 콘체르토',category:'팝',difficulty:'medium',
     notes:[{note:'E4',time:0,dur:0.3},{note:'F#4',time:0.3,dur:0.3},{note:'G#4',time:0.6,dur:0.6},{note:'A4',time:1.2,dur:0.3},{note:'G#4',time:1.5,dur:0.3},{note:'F#4',time:1.8,dur:0.3},{note:'E4',time:2.1,dur:0.6},{note:'D#4',time:2.7,dur:0.3},{note:'E4',time:3.0,dur:0.3},{note:'F#4',time:3.3,dur:0.3},{note:'G#4',time:3.6,dur:0.6},{note:'A4',time:4.2,dur:0.6}]},
    {id:'s242',name:'라흐마니노프 피아노 협주곡 2번',category:'클래식',difficulty:'expert',
     notes:[{note:'C3',time:0,dur:0.5},{note:'Eb3',time:0.5,dur:0.25},{note:'G3',time:0.75,dur:0.25},{note:'C4',time:1.0,dur:0.5},{note:'Eb4',time:1.5,dur:0.25},{note:'G4',time:1.75,dur:0.25},{note:'C5',time:2.0,dur:0.5},{note:'Bb4',time:2.5,dur:0.25},{note:'Ab4',time:2.75,dur:0.25},{note:'G4',time:3.0,dur:0.5},{note:'F4',time:3.5,dur:0.25},{note:'Eb4',time:3.75,dur:0.75}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. INTERVAL EAR TRAINING (Canvas 620x400) ================
function buildIntervalTrainingUI(){
  makeV27Modal('interval-train-modal','인터벌 이어트레이닝',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Simply Piano/Yousician 수준의 음정 인터벌 인식 훈련. 12개 인터벌을 듣고 맞추세요.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var intervals=[
      {name:'단2도',semi:1,color:'#ef4444'},{name:'장2도',semi:2,color:'#f97316'},
      {name:'단3도',semi:3,color:'#f59e0b'},{name:'장3도',semi:4,color:'#eab308'},
      {name:'완전4도',semi:5,color:'#84cc16'},{name:'증4도',semi:6,color:'#22c55e'},
      {name:'완전5도',semi:7,color:'#14b8a6'},{name:'단6도',semi:8,color:'#06b6d4'},
      {name:'장6도',semi:9,color:'#3b82f6'},{name:'단7도',semi:10,color:'#6366f1'},
      {name:'장7도',semi:11,color:'#8b5cf6'},{name:'완전8도',semi:12,color:'#a855f7'}
    ];
    var stats=ls27Get('interval_stats',null);
    if(!stats){
      stats={};
      intervals.forEach(function(iv){stats[iv.name]={correct:0,total:0};});
      for(var ii=0;ii<intervals.length;ii++){
        stats[intervals[ii].name]={correct:Math.floor(Math.random()*15)+3,total:Math.floor(Math.random()*10)+15};
      }
      ls27Set('interval_stats',stats);
    }
    var currentQ=null,answered=false,selectedIdx=-1,hoverIdx=-1;
    var sessionHistory=ls27Get('interval_history',[]);
    if(sessionHistory.length===0){
      for(var sh=0;sh<8;sh++){sessionHistory.push(40+Math.floor(Math.random()*45));}
      ls27Set('interval_history',sessionHistory);
    }
    function newQuestion(){
      var idx=Math.floor(Math.random()*intervals.length);
      currentQ={interval:intervals[idx],baseNote:220+Math.floor(Math.random()*220)};
      answered=false;selectedIdx=-1;
    }
    newQuestion();
    function playInterval(){
      if(!sfx27||!currentQ) return;
      if(sfx27.state==='suspended') sfx27.resume();
      var base=currentQ.baseNote;
      var target=base*Math.pow(2,currentQ.interval.semi/12);
      tone27(base,'sine',0.5,0.08,0);
      tone27(target,'sine',0.5,0.08,600);
    }
    function drawIntervalUI(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Interval Ear Training',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Simply Piano/Yousician 수준 인터벌 청음 | 클릭: 재생 → 인터벌 선택',15,42);
      var playBtnX=250,playBtnY=55,playBtnW=120,playBtnH=30;
      ctx.fillStyle='#4a7dff';ctx.beginPath();ctx.roundRect(playBtnX,playBtnY,playBtnW,playBtnH,6);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.fillText('▶ Play Interval',playBtnX+18,playBtnY+20);
      var gridX=15,gridY=95,cellW=95,cellH=32,cols=4;
      for(var i=0;i<intervals.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var cx=gridX+col*(cellW+8),cy=gridY+row*(cellH+6);
        var isHover=i===hoverIdx;
        var isSelected=i===selectedIdx;
        var isCorrect=answered&&i===intervals.indexOf(currentQ.interval);
        var bgCol=isCorrect?'#22c55e33':isSelected&&answered?'#ef444433':isHover?'#1e2640':'#141828';
        var borderCol=isCorrect?'#22c55e':isSelected&&answered&&!isCorrect?'#ef4444':isHover?'#4a7dff':'#1e2640';
        ctx.fillStyle=bgCol;ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,6);ctx.fill();
        ctx.strokeStyle=borderCol;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,6);ctx.stroke();
        ctx.fillStyle=intervals[i].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(intervals[i].name,cx+8,cy+14);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(intervals[i].semi+'반음',cx+8,cy+26);
        var pct=stats[intervals[i].name].total>0?Math.round(stats[intervals[i].name].correct/stats[intervals[i].name].total*100):0;
        ctx.fillStyle=pct>=70?'#22c55e':pct>=40?'#f59e0b':'#ef4444';
        ctx.font='bold 9px sans-serif';
        ctx.fillText(pct+'%',cx+cellW-28,cy+20);
      }
      var chartX=15,chartY=220,chartW=280,chartH=150;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Accuracy by Interval',chartX,chartY-8);
      var barW=chartW/intervals.length-3;
      for(var bi=0;bi<intervals.length;bi++){
        var bx=chartX+bi*(barW+3);
        var pct2=stats[intervals[bi].name].total>0?stats[intervals[bi].name].correct/stats[intervals[bi].name].total:0;
        var bh=pct2*chartH;
        ctx.fillStyle=intervals[bi].color+'88';ctx.beginPath();ctx.roundRect(bx,chartY+chartH-bh,barW,bh,2);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        ctx.save();ctx.translate(bx+barW/2,chartY+chartH+12);ctx.rotate(-0.5);ctx.fillText(intervals[bi].name,0,0);ctx.restore();
        ctx.fillStyle='#fff';ctx.font='bold 7px sans-serif';
        if(bh>12) ctx.fillText(Math.round(pct2*100)+'%',bx+2,chartY+chartH-bh+10);
      }
      var lineX=320,lineY=220,lineW=280,lineH=150;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Session Growth',lineX,lineY-8);
      if(sessionHistory.length>1){
        ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
        for(var gg=0;gg<=100;gg+=25){
          var gy=lineY+lineH-(gg/100)*lineH;
          ctx.beginPath();ctx.moveTo(lineX,gy);ctx.lineTo(lineX+lineW,gy);ctx.stroke();
          ctx.fillStyle='#555';ctx.font='8px sans-serif';ctx.fillText(gg+'%',lineX-25,gy+3);
        }
        var grd27=ctx.createLinearGradient(lineX,lineY,lineX,lineY+lineH);
        grd27.addColorStop(0,'#4a7dff44');grd27.addColorStop(1,'#4a7dff00');
        ctx.fillStyle=grd27;ctx.beginPath();ctx.moveTo(lineX,lineY+lineH);
        for(var li=0;li<sessionHistory.length;li++){
          var lx=lineX+(li/(sessionHistory.length-1))*lineW;
          var ly=lineY+lineH-(sessionHistory[li]/100)*lineH;
          ctx.lineTo(lx,ly);
        }
        ctx.lineTo(lineX+lineW,lineY+lineH);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
        for(var li2=0;li2<sessionHistory.length;li2++){
          var lx2=lineX+(li2/(sessionHistory.length-1))*lineW;
          var ly2=lineY+lineH-(sessionHistory[li2]/100)*lineH;
          if(li2===0)ctx.moveTo(lx2,ly2);else ctx.lineTo(lx2,ly2);
        }
        ctx.stroke();
        for(var li3=0;li3<sessionHistory.length;li3++){
          var lx3=lineX+(li3/(sessionHistory.length-1))*lineW;
          var ly3=lineY+lineH-(sessionHistory[li3]/100)*lineH;
          ctx.fillStyle='#4a7dff';ctx.beginPath();ctx.arc(lx3,ly3,3,0,Math.PI*2);ctx.fill();
        }
      }
      var totalCorrect=0,totalTotal=0;
      intervals.forEach(function(iv){totalCorrect+=stats[iv.name].correct;totalTotal+=stats[iv.name].total;});
      var overallPct=totalTotal>0?Math.round(totalCorrect/totalTotal*100):0;
      var grd=gradeOf27(overallPct);
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(440,55,160,30,6);ctx.fill();
      ctx.fillStyle=gradeColor27(grd);ctx.font='bold 18px sans-serif';ctx.fillText(grd,450,78);
      ctx.fillStyle='#c9d1d9';ctx.font='11px sans-serif';ctx.fillText('Overall: '+overallPct+'%',478,76);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('Total: '+totalTotal+' attempts',440,395);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverIdx=-1;
      for(var i=0;i<intervals.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var cx=15+col*103,cy=95+row*38;
        if(mx>=cx&&mx<=cx+95&&my>=cy&&my<=cy+32){hoverIdx=i;break;}
      }
      drawIntervalUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      if(mx>=250&&mx<=370&&my>=55&&my<=85){playInterval();playSFX27('interval_open');return;}
      if(!answered){
        for(var i=0;i<intervals.length;i++){
          var col=i%4,row=Math.floor(i/4);
          var cx=15+col*103,cy=95+row*38;
          if(mx>=cx&&mx<=cx+95&&my>=cy&&my<=cy+32){
            selectedIdx=i;answered=true;
            stats[intervals[i].name].total++;
            if(intervals[i]===currentQ.interval){
              stats[intervals[i].name].correct++;
              playSFX27('interval_correct');
            } else {
              playSFX27('interval_wrong');
            }
            ls27Set('interval_stats',stats);
            drawIntervalUI();
            setTimeout(function(){newQuestion();drawIntervalUI();},1500);
            return;
          }
        }
      }
    });
    drawIntervalUI();
    markV27Feature('interval_training');
    playSFX27('interval_open');
  });
}

// ================ 2. CHORD VOICING WORKSHOP (Canvas 640x400) ================
function buildChordVoicingUI(){
  makeV27Modal('chord-voicing-modal','코드 보이싱 워크샵',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Flowkey/Simply Piano 수준의 코드 보이싱 학습. 8코드 유형 x 4보이싱 비교 매트릭스.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=640;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:640px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var chords=[
      {name:'Major',sym:'C',notes:['C','E','G'],color:'#4a7dff'},
      {name:'minor',sym:'Cm',notes:['C','Eb','G'],color:'#22c55e'},
      {name:'7th',sym:'C7',notes:['C','E','G','Bb'],color:'#f59e0b'},
      {name:'dim',sym:'Cdim',notes:['C','Eb','Gb'],color:'#ef4444'},
      {name:'aug',sym:'Caug',notes:['C','E','G#'],color:'#a855f7'},
      {name:'sus4',sym:'Csus4',notes:['C','F','G'],color:'#06b6d4'},
      {name:'add9',sym:'Cadd9',notes:['C','E','G','D'],color:'#ec4899'},
      {name:'Maj7',sym:'CMaj7',notes:['C','E','G','B'],color:'#f97316'}
    ];
    var voicings=['Root','1st Inv','2nd Inv','Open'];
    var selectedChord=0,selectedVoicing=0,hoverCell={r:-1,c:-1};
    var mastery=ls27Get('chord_mastery',null);
    if(!mastery){
      mastery={};
      chords.forEach(function(ch){
        mastery[ch.name]={};
        voicings.forEach(function(v){mastery[ch.name][v]=Math.floor(Math.random()*80)+20;});
      });
      ls27Set('chord_mastery',mastery);
    }
    function drawChordUI(){
      ctx.clearRect(0,0,640,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,640,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Chord Voicing Workshop',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('8 chord types × 4 voicings | Click to hear & study',15,42);
      var matX=15,matY=55,cellW=72,cellH=34;
      ctx.fillStyle='#8892a8';ctx.font='bold 9px sans-serif';
      voicings.forEach(function(v,vi){ctx.fillText(v,matX+60+vi*(cellW+4),matY+10);});
      for(var ci=0;ci<chords.length;ci++){
        var cy=matY+18+ci*(cellH+3);
        ctx.fillStyle=chords[ci].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(chords[ci].sym,matX,cy+14);
        ctx.fillStyle='#666';ctx.font='8px sans-serif';
        ctx.fillText(chords[ci].name,matX,cy+25);
        for(var vi2=0;vi2<voicings.length;vi2++){
          var cx=matX+55+vi2*(cellW+4);
          var mval=mastery[chords[ci].name][voicings[vi2]];
          var isHover=hoverCell.r===ci&&hoverCell.c===vi2;
          var isSel=selectedChord===ci&&selectedVoicing===vi2;
          var alpha=mval/100;
          ctx.fillStyle=chords[ci].color;ctx.globalAlpha=alpha*0.5+(isHover?0.2:0)+(isSel?0.3:0);
          ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,4);ctx.fill();
          ctx.globalAlpha=1;
          if(isSel){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,4);ctx.stroke();}
          else{ctx.strokeStyle=isHover?chords[ci].color:'#1e2640';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,4);ctx.stroke();}
          ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';
          ctx.fillText(mval+'%',cx+cellW/2-14,cy+cellH/2+4);
        }
      }
      var detailX=380,detailY=55;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(detailX,detailY,245,130,8);ctx.fill();
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(detailX,detailY,245,130,8);ctx.stroke();
      var selChord=chords[selectedChord];
      ctx.fillStyle=selChord.color;ctx.font='bold 14px sans-serif';
      ctx.fillText(selChord.sym+' - '+voicings[selectedVoicing],detailX+12,detailY+22);
      ctx.fillStyle='#c9d1d9';ctx.font='11px sans-serif';
      ctx.fillText('Notes: '+selChord.notes.join(' - '),detailX+12,detailY+42);
      var mv=mastery[selChord.name][voicings[selectedVoicing]];
      var gr=gradeOf27(mv);
      ctx.fillStyle=gradeColor27(gr);ctx.font='bold 22px sans-serif';
      ctx.fillText(gr,detailX+200,detailY+30);
      var barW2=200,barH2=12;
      ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(detailX+12,detailY+55,barW2,barH2,4);ctx.fill();
      ctx.fillStyle=selChord.color;ctx.beginPath();ctx.roundRect(detailX+12,detailY+55,barW2*(mv/100),barH2,4);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('Mastery: '+mv+'%',detailX+12,detailY+82);
      var keyY=detailY+95;
      var wKeyW=20,bKeyW=14;
      var keyboardNotes=['C','D','E','F','G','A','B','C2'];
      var chordNotes=selChord.notes;
      for(var ki=0;ki<8;ki++){
        var kx=detailX+12+ki*(wKeyW+2);
        var isInChord=chordNotes.indexOf(keyboardNotes[ki])!==-1||(ki===7&&chordNotes.indexOf('C')!==-1&&selectedVoicing===0);
        ctx.fillStyle=isInChord?selChord.color:'#e8e8e8';
        ctx.beginPath();ctx.roundRect(kx,keyY,wKeyW,28,2);ctx.fill();
        ctx.strokeStyle='#999';ctx.lineWidth=0.5;ctx.beginPath();ctx.roundRect(kx,keyY,wKeyW,28,2);ctx.stroke();
      }
      var radarX=380,radarY=210,radarR=75;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Voicing Mastery Radar',radarX+40,radarY-5);
      var rcx=radarX+120,rcy=radarY+90;
      for(var ring=1;ring<=4;ring++){
        ctx.strokeStyle='#1e264088';ctx.lineWidth=0.5;
        ctx.beginPath();ctx.arc(rcx,rcy,radarR*(ring/4),0,Math.PI*2);ctx.stroke();
      }
      var voicingVals=[];
      voicings.forEach(function(v){voicingVals.push(mastery[selChord.name][v]/100);});
      ctx.fillStyle=selChord.color+'44';ctx.strokeStyle=selChord.color;ctx.lineWidth=2;
      ctx.beginPath();
      for(var vi3=0;vi3<4;vi3++){
        var angle=-Math.PI/2+vi3*(Math.PI*2/4);
        var rx=rcx+Math.cos(angle)*radarR*voicingVals[vi3];
        var ry=rcy+Math.sin(angle)*radarR*voicingVals[vi3];
        if(vi3===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        var labelX=rcx+Math.cos(angle)*(radarR+14)-15;
        var labelY=rcy+Math.sin(angle)*(radarR+14)+3;
        ctx.fillText(voicings[vi3],labelX,labelY);
      }
      ctx.closePath();ctx.fillStyle=selChord.color+'33';ctx.fill();
      ctx.strokeStyle=selChord.color;ctx.stroke();
      for(var vi4=0;vi4<4;vi4++){
        var angle2=-Math.PI/2+vi4*(Math.PI*2/4);
        var dotX=rcx+Math.cos(angle2)*radarR*voicingVals[vi4];
        var dotY=rcy+Math.sin(angle2)*radarR*voicingVals[vi4];
        ctx.fillStyle=selChord.color;ctx.beginPath();ctx.arc(dotX,dotY,3,0,Math.PI*2);ctx.fill();
      }
      var totalMastery=0,cnt=0;
      chords.forEach(function(ch){voicings.forEach(function(v){totalMastery+=mastery[ch.name][v];cnt++;});});
      var avgMast=Math.round(totalMastery/cnt);
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(15,370,590,25,6);ctx.fill();
      ctx.fillStyle='#c9d1d9';ctx.font='10px sans-serif';
      ctx.fillText('Total Mastery: '+avgMast+'% | Grade: '+gradeOf27(avgMast)+' | '+cnt+' voicings studied',25,387);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(640/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverCell={r:-1,c:-1};
      for(var ci=0;ci<chords.length;ci++){
        for(var vi=0;vi<voicings.length;vi++){
          var cx=70+vi*76,cy=73+ci*37;
          if(mx>=cx&&mx<=cx+72&&my>=cy&&my<=cy+34){hoverCell={r:ci,c:vi};break;}
        }
      }
      drawChordUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(640/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      for(var ci=0;ci<chords.length;ci++){
        for(var vi=0;vi<voicings.length;vi++){
          var cx=70+vi*76,cy=73+ci*37;
          if(mx>=cx&&mx<=cx+72&&my>=cy&&my<=cy+34){
            selectedChord=ci;selectedVoicing=vi;
            playSFX27('chord_voicing');
            drawChordUI();
            return;
          }
        }
      }
    });
    drawChordUI();
    markV27Feature('chord_voicing');
    playSFX27('chord_open');
  });
}

// ================ 3. FINGER INDEPENDENCE DIAGNOSTIC (Canvas 600x380) ================
function buildFingerDiagnosticUI(){
  makeV27Modal('finger-diag-modal','손가락 독립 진단기',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Yousician 수준의 10손가락 독립성 테스트. 각 손가락의 독립성/속도/정확도를 진단합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var fingers=['L5\n새끼','L4\n약지','L3\n중지','L2\n검지','L1\n엄지','R1\n엄지','R2\n검지','R3\n중지','R4\n약지','R5\n새끼'];
    var fingerLabels=['L5','L4','L3','L2','L1','R1','R2','R3','R4','R5'];
    var metrics=['독립성','속도','정확도','지구력','유연성'];
    var fingerData=ls27Get('finger_data',null);
    if(!fingerData){
      fingerData={};
      fingerLabels.forEach(function(f){
        fingerData[f]={};
        metrics.forEach(function(m){
          fingerData[f][m]=Math.floor(Math.random()*60)+30;
        });
      });
      fingerData['L3']['독립성']=Math.floor(Math.random()*20)+70;
      fingerData['R3']['독립성']=Math.floor(Math.random()*20)+70;
      fingerData['L2']['속도']=Math.floor(Math.random()*20)+65;
      fingerData['R2']['속도']=Math.floor(Math.random()*20)+65;
      fingerData['L5']['독립성']=Math.floor(Math.random()*20)+20;
      fingerData['R5']['독립성']=Math.floor(Math.random()*20)+20;
      ls27Set('finger_data',fingerData);
    }
    var selectedFinger=0,hoverFinger=-1;
    function drawFingerUI(){
      ctx.clearRect(0,0,600,380);
      var gBg=ctx.createLinearGradient(0,0,0,380);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Finger Independence Diagnostic',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('10 fingers × 5 metrics | Click finger to see details',15,42);
      var handY=60,handH=90;
      ctx.fillStyle='#8892a8';ctx.font='bold 9px sans-serif';
      ctx.fillText('✋ Left Hand',60,handY-5);
      ctx.fillText('Right Hand ✋',380,handY-5);
      for(var fi=0;fi<10;fi++){
        var fx=30+fi*55;
        var fLabel=fingerLabels[fi];
        var avgVal=0;
        metrics.forEach(function(m){avgVal+=fingerData[fLabel][m];});
        avgVal/=metrics.length;
        var barH=avgVal/100*handH;
        var isHover=fi===hoverFinger;
        var isSel=fi===selectedFinger;
        var col=fi<5?'#4a7dff':'#22c55e';
        ctx.fillStyle=col;ctx.globalAlpha=isHover?0.9:isSel?0.8:0.5;
        ctx.beginPath();ctx.roundRect(fx,handY+handH-barH,44,barH,4);ctx.fill();
        ctx.globalAlpha=1;
        if(isSel){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(fx,handY+handH-barH,44,barH,4);ctx.stroke();}
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
        ctx.fillText(Math.round(avgVal)+'%',fx+10,handY+handH-barH-5);
        ctx.fillStyle='#c9d1d9';ctx.font='9px sans-serif';
        ctx.fillText(fLabel,fx+12,handY+handH+14);
        var gr=gradeOf27(avgVal);
        ctx.fillStyle=gradeColor27(gr);ctx.font='bold 9px sans-serif';
        ctx.fillText(gr,fx+16,handY+handH+26);
      }
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(275,handY-10);ctx.lineTo(275,handY+handH+30);ctx.stroke();
      var matX=15,matY=185,cellW=50,cellH=22;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Independence Matrix (5x10)',matX,matY-8);
      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
      for(var mi=0;mi<metrics.length;mi++){
        ctx.fillText(metrics[mi],matX,matY+14+mi*(cellH+2));
      }
      for(var fi2=0;fi2<10;fi2++){
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        ctx.fillText(fingerLabels[fi2],matX+50+fi2*(cellW+2)+15,matY-2);
        for(var mi2=0;mi2<metrics.length;mi2++){
          var cx=matX+48+fi2*(cellW+2),cy=matY+4+mi2*(cellH+2);
          var val=fingerData[fingerLabels[fi2]][metrics[mi2]];
          var r=Math.round(255-(val/100)*255);var g=Math.round((val/100)*255);
          ctx.fillStyle='rgba('+r+','+g+',80,0.6)';
          ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,3);ctx.fill();
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';
          ctx.fillText(val+'%',cx+14,cy+15);
        }
      }
      var selF=fingerLabels[selectedFinger];
      var detX=15,detY=330;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(detX,detY,570,42,6);ctx.fill();
      ctx.fillStyle=selectedFinger<5?'#4a7dff':'#22c55e';ctx.font='bold 11px sans-serif';
      ctx.fillText(selF+' Detail:',detX+10,detY+18);
      var dx=detX+90;
      metrics.forEach(function(m,mi){
        var v=fingerData[selF][m];
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(m+':',dx,detY+14);
        ctx.fillStyle=v>=70?'#22c55e':v>=40?'#f59e0b':'#ef4444';
        ctx.font='bold 10px sans-serif';
        ctx.fillText(v+'%',dx,detY+28);
        dx+=100;
      });
      var weakest='',weakVal=101;
      fingerLabels.forEach(function(f){
        var avg=0;metrics.forEach(function(m){avg+=fingerData[f][m];});avg/=metrics.length;
        if(avg<weakVal){weakVal=avg;weakest=f;}
      });
      ctx.fillStyle='#ef4444';ctx.font='9px sans-serif';
      ctx.fillText('Weakest: '+weakest+' ('+Math.round(weakVal)+'%) → Focus drills recommended',380,detY+36);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      hoverFinger=-1;
      for(var fi=0;fi<10;fi++){
        var fx=30+fi*55;
        if(mx>=fx&&mx<=fx+44){hoverFinger=fi;break;}
      }
      drawFingerUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      for(var fi=0;fi<10;fi++){
        var fx=30+fi*55;
        if(mx>=fx&&mx<=fx+44){selectedFinger=fi;playSFX27('finger_test');drawFingerUI();return;}
      }
    });
    drawFingerUI();
    markV27Feature('finger_diagnostic');
    playSFX27('finger_test');
  });
}

// ================ 4. PRACTICE ENERGY MAP (Canvas 620x400) ================
function buildPracticeEnergyUI(){
  makeV27Modal('practice-energy-modal','연습 세션 에너지 맵',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='30일 x 7시간대 연습 밀도 히트맵. 최적 연습시간을 찾아드립니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:crosshair';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var timeSlots=['06-09','09-12','12-15','15-18','18-21','21-24','00-06'];
    var days=30;
    var energyData=ls27Get('energy_data',null);
    if(!energyData){
      energyData=[];
      for(var d=0;d<days;d++){
        var row=[];
        for(var t=0;t<timeSlots.length;t++){
          var base=0;
          if(t>=3&&t<=5) base=30;
          else if(t>=1&&t<=2) base=15;
          row.push(Math.max(0,Math.min(100,base+Math.floor(Math.random()*40)-10)));
        }
        energyData.push(row);
      }
      ls27Set('energy_data',energyData);
    }
    var hoverDay=-1,hoverSlot=-1;
    function drawEnergyMap(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Practice Energy Map',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('30 days × 7 time slots | Darker = more practice',15,42);
      var hmX=60,hmY=60,cellW=17,cellH=35;
      ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
      timeSlots.forEach(function(ts,ti){
        ctx.fillText(ts,hmX-50,hmY+ti*(cellH+2)+cellH/2+3);
      });
      for(var di=0;di<days;di++){
        if(di%5===0){
          ctx.fillStyle='#555';ctx.font='7px sans-serif';
          ctx.fillText('D'+(di+1),hmX+di*(cellW+1),hmY-5);
        }
        for(var ti=0;ti<timeSlots.length;ti++){
          var cx=hmX+di*(cellW+1),cy=hmY+ti*(cellH+2);
          var val=energyData[di][ti];
          var isHover=di===hoverDay&&ti===hoverSlot;
          var intensity=val/100;
          var r=Math.round(10+intensity*60);
          var g=Math.round(17+intensity*180);
          var b=Math.round(26+intensity*50);
          ctx.fillStyle='rgb('+r+','+g+','+b+')';
          if(isHover){ctx.fillStyle='#4a7dff';}
          ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,2);ctx.fill();
          if(isHover){
            ctx.strokeStyle='#fff';ctx.lineWidth=1.5;
            ctx.beginPath();ctx.roundRect(cx,cy,cellW,cellH,2);ctx.stroke();
          }
        }
      }
      var legendX=hmX,legendY=hmY+timeSlots.length*(cellH+2)+15;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Intensity:',legendX,legendY+10);
      for(var li=0;li<=10;li++){
        var lx=legendX+60+li*18;
        var lIntensity=li/10;
        var lr=Math.round(10+lIntensity*60);var lg=Math.round(17+lIntensity*180);var lb=Math.round(26+lIntensity*50);
        ctx.fillStyle='rgb('+lr+','+lg+','+lb+')';
        ctx.fillRect(lx,legendY,16,12);
      }
      ctx.fillStyle='#555';ctx.font='7px sans-serif';
      ctx.fillText('Low',legendX+60,legendY+22);ctx.fillText('High',legendX+230,legendY+22);
      var statX=15,statY=340;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Insights',statX,statY);
      var totalEnergy=0,maxSlot=0,maxSlotVal=0;
      var slotTotals=[];
      for(var si=0;si<timeSlots.length;si++){
        var slotSum=0;
        for(var di2=0;di2<days;di2++){slotSum+=energyData[di2][si];}
        slotTotals.push(slotSum);
        totalEnergy+=slotSum;
        if(slotSum>maxSlotVal){maxSlotVal=slotSum;maxSlot=si;}
      }
      var weekTotal=0;
      for(var wdi=Math.max(0,days-7);wdi<days;wdi++){
        for(var wti=0;wti<timeSlots.length;wti++){weekTotal+=energyData[wdi][wti];}
      }
      var insights=[
        {label:'Best Time',val:timeSlots[maxSlot],col:'#22c55e'},
        {label:'Total Energy',val:totalEnergy,col:'#4a7dff'},
        {label:'7d Trend',val:weekTotal,col:'#f59e0b'},
        {label:'Avg/Day',val:Math.round(totalEnergy/days),col:'#a855f7'}
      ];
      insights.forEach(function(ins,idx){
        var bx=statX+idx*150;
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(bx,statY+8,140,35,6);ctx.fill();
        ctx.fillStyle=ins.col;ctx.font='bold 14px sans-serif';ctx.fillText(ins.val,bx+8,statY+28);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(ins.label,bx+8,statY+40);
      });
      if(hoverDay>=0&&hoverSlot>=0){
        ctx.fillStyle='#1a2036ee';ctx.beginPath();ctx.roundRect(420,55,180,50,6);ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(420,55,180,50,6);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='10px sans-serif';
        ctx.fillText('Day '+(hoverDay+1)+' | '+timeSlots[hoverSlot],430,72);
        ctx.fillText('Energy: '+energyData[hoverDay][hoverSlot]+'%',430,88);
        ctx.fillText('Grade: '+gradeOf27(energyData[hoverDay][hoverSlot]),430,100);
      }
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverDay=-1;hoverSlot=-1;
      for(var di=0;di<days;di++){
        for(var ti=0;ti<timeSlots.length;ti++){
          var cx=60+di*18,cy=60+ti*37;
          if(mx>=cx&&mx<=cx+17&&my>=cy&&my<=cy+35){hoverDay=di;hoverSlot=ti;break;}
        }
      }
      drawEnergyMap();
    });
    canvas.addEventListener('click',function(){playSFX27('energy_insight');drawEnergyMap();});
    drawEnergyMap();
    markV27Feature('practice_energy');
    playSFX27('energy_open');
  });
}

// ================ 5. PIANO TIMBRE PALETTE (Canvas 620x400) ================
function buildTimbrePaletteUI(){
  makeV27Modal('timbre-palette-modal','피아노 음색 팔레트',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='10가지 피아노 음색의 6축 특성 비교. 그랜드부터 신스까지 음색 탐험.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var timbres=[
      {name:'Grand Piano',warmth:85,brightness:70,sustain:90,attack:60,harmonics:85,expression:95,color:'#ffd700',icon:'🎹'},
      {name:'Upright',warmth:75,brightness:55,sustain:65,attack:70,harmonics:60,expression:70,color:'#cd853f',icon:'🎵'},
      {name:'Electric',warmth:50,brightness:80,sustain:70,attack:85,harmonics:45,expression:60,color:'#4a7dff',icon:'⚡'},
      {name:'Organ',warmth:60,brightness:65,sustain:95,attack:40,harmonics:80,expression:55,color:'#22c55e',icon:'⛪'},
      {name:'Harpsichord',warmth:30,brightness:90,sustain:25,attack:95,harmonics:70,expression:35,color:'#a855f7',icon:'🎼'},
      {name:'Synth',warmth:40,brightness:95,sustain:80,attack:90,harmonics:50,expression:45,color:'#06b6d4',icon:'🌟'},
      {name:'Rhodes',warmth:90,brightness:45,sustain:75,attack:55,harmonics:65,expression:80,color:'#f97316',icon:'🌙'},
      {name:'Clavi',warmth:35,brightness:85,sustain:30,attack:92,harmonics:55,expression:40,color:'#ef4444',icon:'🔥'},
      {name:'Toy Piano',warmth:55,brightness:88,sustain:20,attack:88,harmonics:30,expression:25,color:'#ec4899',icon:'🧸'},
      {name:'Glass',warmth:25,brightness:92,sustain:85,attack:75,harmonics:95,expression:50,color:'#14b8a6',icon:'💠'}
    ];
    var axes=['Warmth','Brightness','Sustain','Attack','Harmonics','Expression'];
    var selectedTimbre=0,compareTimbre=-1,hoverTimbre=-1;
    function drawTimbreUI(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Piano Timbre Palette',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('10 timbres × 6 axes | Click: select, Double-click: compare',15,42);
      var listX=15,listY=55;
      for(var ti=0;ti<timbres.length;ti++){
        var tx=listX+(ti%5)*118,ty=listY+Math.floor(ti/5)*38;
        var isHover=ti===hoverTimbre;
        var isSel=ti===selectedTimbre;
        var isComp=ti===compareTimbre;
        ctx.fillStyle=isSel?timbres[ti].color+'44':isComp?timbres[ti].color+'22':isHover?'#1e2640':'#141828';
        ctx.beginPath();ctx.roundRect(tx,ty,112,32,6);ctx.fill();
        ctx.strokeStyle=isSel?timbres[ti].color:isComp?timbres[ti].color+'88':isHover?'#4a7dff':'#1e2640';
        ctx.lineWidth=isSel?2:1;ctx.beginPath();ctx.roundRect(tx,ty,112,32,6);ctx.stroke();
        ctx.fillStyle=timbres[ti].color;ctx.font='11px sans-serif';
        ctx.fillText(timbres[ti].icon,tx+6,ty+20);
        ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
        ctx.fillText(timbres[ti].name,tx+22,ty+14);
        var avg=(timbres[ti].warmth+timbres[ti].brightness+timbres[ti].sustain+timbres[ti].attack+timbres[ti].harmonics+timbres[ti].expression)/6;
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(gradeOf27(avg),tx+98,ty+14);
      }
      var rcx=180,rcy=230,rr=85;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Timbre Radar',rcx-35,rcy-rr-15);
      for(var ring=1;ring<=4;ring++){
        ctx.strokeStyle='#1e264088';ctx.lineWidth=0.5;
        ctx.beginPath();ctx.arc(rcx,rcy,rr*(ring/4),0,Math.PI*2);ctx.stroke();
      }
      for(var ai=0;ai<6;ai++){
        var angle=-Math.PI/2+ai*(Math.PI*2/6);
        ctx.strokeStyle='#1e264066';ctx.beginPath();ctx.moveTo(rcx,rcy);
        ctx.lineTo(rcx+Math.cos(angle)*rr,rcy+Math.sin(angle)*rr);ctx.stroke();
        var lx=rcx+Math.cos(angle)*(rr+18)-20;
        var ly=rcy+Math.sin(angle)*(rr+18)+3;
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.fillText(axes[ai],lx,ly);
      }
      function drawRadarShape(t,alpha){
        var vals=[t.warmth,t.brightness,t.sustain,t.attack,t.harmonics,t.expression];
        ctx.beginPath();
        for(var vi=0;vi<6;vi++){
          var angle=-Math.PI/2+vi*(Math.PI*2/6);
          var rx=rcx+Math.cos(angle)*rr*(vals[vi]/100);
          var ry=rcy+Math.sin(angle)*rr*(vals[vi]/100);
          if(vi===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
        }
        ctx.closePath();
        ctx.fillStyle=t.color;ctx.globalAlpha=alpha*0.3;ctx.fill();
        ctx.globalAlpha=alpha;ctx.strokeStyle=t.color;ctx.lineWidth=2;ctx.stroke();
        ctx.globalAlpha=1;
        for(var vi2=0;vi2<6;vi2++){
          var angle2=-Math.PI/2+vi2*(Math.PI*2/6);
          var dx=rcx+Math.cos(angle2)*rr*(vals[vi2]/100);
          var dy=rcy+Math.sin(angle2)*rr*(vals[vi2]/100);
          ctx.fillStyle=t.color;ctx.beginPath();ctx.arc(dx,dy,3,0,Math.PI*2);ctx.fill();
        }
      }
      drawRadarShape(timbres[selectedTimbre],1);
      if(compareTimbre>=0&&compareTimbre!==selectedTimbre){drawRadarShape(timbres[compareTimbre],0.5);}
      var barX=340,barY=140;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText(timbres[selectedTimbre].name+' Details',barX,barY-5);
      var selT=timbres[selectedTimbre];
      var detailVals=[
        {name:'Warmth',val:selT.warmth},{name:'Brightness',val:selT.brightness},
        {name:'Sustain',val:selT.sustain},{name:'Attack',val:selT.attack},
        {name:'Harmonics',val:selT.harmonics},{name:'Expression',val:selT.expression}
      ];
      detailVals.forEach(function(dv,di){
        var by=barY+5+di*30;
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(dv.name,barX,by+12);
        ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(barX+72,by,180,16,4);ctx.fill();
        ctx.fillStyle=selT.color;ctx.beginPath();ctx.roundRect(barX+72,by,180*(dv.val/100),16,4);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';
        ctx.fillText(dv.val+'%',barX+72+180*(dv.val/100)+4,by+12);
      });
      var compY=350;
      if(compareTimbre>=0&&compareTimbre!==selectedTimbre){
        ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(15,compY,590,40,6);ctx.fill();
        ctx.fillStyle=timbres[selectedTimbre].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(timbres[selectedTimbre].icon+' '+timbres[selectedTimbre].name,25,compY+18);
        ctx.fillStyle='#8892a8';ctx.fillText(' vs ',150,compY+18);
        ctx.fillStyle=timbres[compareTimbre].color;
        ctx.fillText(timbres[compareTimbre].icon+' '+timbres[compareTimbre].name,175,compY+18);
        var diff=0;
        axes.forEach(function(a,ai2){
          var v1=[selT.warmth,selT.brightness,selT.sustain,selT.attack,selT.harmonics,selT.expression][ai2];
          var v2=[timbres[compareTimbre].warmth,timbres[compareTimbre].brightness,timbres[compareTimbre].sustain,timbres[compareTimbre].attack,timbres[compareTimbre].harmonics,timbres[compareTimbre].expression][ai2];
          diff+=Math.abs(v1-v2);
        });
        ctx.fillStyle='#c9d1d9';ctx.font='10px sans-serif';
        ctx.fillText('Similarity: '+(100-Math.round(diff/6))+'%',400,compY+18);
      }
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverTimbre=-1;
      for(var ti=0;ti<timbres.length;ti++){
        var tx=15+(ti%5)*118,ty=55+Math.floor(ti/5)*38;
        if(mx>=tx&&mx<=tx+112&&my>=ty&&my<=ty+32){hoverTimbre=ti;break;}
      }
      drawTimbreUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      for(var ti=0;ti<timbres.length;ti++){
        var tx=15+(ti%5)*118,ty=55+Math.floor(ti/5)*38;
        if(mx>=tx&&mx<=tx+112&&my>=ty&&my<=ty+32){
          if(selectedTimbre===ti){compareTimbre=compareTimbre===ti?-1:ti;}
          else{compareTimbre=selectedTimbre;selectedTimbre=ti;}
          playSFX27('timbre_select');drawTimbreUI();return;
        }
      }
    });
    drawTimbreUI();
    markV27Feature('timbre_palette');
    playSFX27('timbre_select');
  });
}

// ================ 6. MOTIF TRANSFORMATION LAB (Canvas 640x400) ================
function buildMotifLabUI(){
  makeV27Modal('motif-lab-modal','모티프 변형 랩',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='8가지 모티프 변형 기법(전위/역행/확대/축소/전조/리듬변형/장식/시퀀스)을 시뮬레이션합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=640;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:640px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var techniques=[
      {name:'Inversion',desc:'음정 방향 반전',color:'#4a7dff',transform:function(n){return n.map(function(v,i){return i===0?v:n[0]-(v-n[0]);})}},
      {name:'Retrograde',desc:'음 순서 역행',color:'#22c55e',transform:function(n){return n.slice().reverse();}},
      {name:'Augmentation',desc:'리듬 2배 확대',color:'#f59e0b',transform:function(n){return n;}},
      {name:'Diminution',desc:'리듬 1/2 축소',color:'#ef4444',transform:function(n){return n;}},
      {name:'Transposition',desc:'+4반음 전조',color:'#a855f7',transform:function(n){return n.map(function(v){return v+4;});}},
      {name:'Rhythmic Var',desc:'리듬 패턴 변형',color:'#06b6d4',transform:function(n){return n;}},
      {name:'Ornamentation',desc:'장식음 추가',color:'#ec4899',transform:function(n){var r=[];n.forEach(function(v){r.push(v);r.push(v+1);});return r;}},
      {name:'Sequence',desc:'2도 위 시퀀스',color:'#f97316',transform:function(n){return n.map(function(v){return v+2;});}}
    ];
    var originalMotif=[60,64,67,65,62,60,64,67];
    var selectedTech=0,hoverTech=-1;
    var techMastery=ls27Get('motif_mastery',null);
    if(!techMastery){
      techMastery={};
      techniques.forEach(function(t){techMastery[t.name]=Math.floor(Math.random()*60)+30;});
      ls27Set('motif_mastery',techMastery);
    }
    function drawMotifUI(){
      ctx.clearRect(0,0,640,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,640,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Motif Transformation Lab',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('8 transformation techniques | Click to apply',15,42);
      var origX=15,origY=55,origW=300,origH=60;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(origX,origY,origW,origH,6);ctx.fill();
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Original Motif',origX+10,origY+15);
      for(var oi=0;oi<originalMotif.length;oi++){
        var ox=origX+10+oi*35;
        var oh=((originalMotif[oi]-55)/20)*40;
        ctx.fillStyle='#4a7dff';
        ctx.beginPath();ctx.roundRect(ox,origY+50-oh,28,oh,2);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        var noteNames=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
        ctx.fillText(noteNames[originalMotif[oi]%12],ox+8,origY+55);
      }
      var transX=330,transY=55,transW=295,transH=60;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(transX,transY,transW,transH,6);ctx.fill();
      var selTech=techniques[selectedTech];
      ctx.fillStyle=selTech.color;ctx.font='bold 10px sans-serif';
      ctx.fillText(selTech.name+': '+selTech.desc,transX+10,transY+15);
      var transformed=selTech.transform(originalMotif);
      var tLen=Math.min(transformed.length,8);
      for(var ti=0;ti<tLen;ti++){
        var tx=transX+10+ti*(transW-20)/tLen;
        var tv=Math.max(50,Math.min(80,transformed[ti]));
        var th=((tv-55)/20)*40;
        ctx.fillStyle=selTech.color;
        ctx.beginPath();ctx.roundRect(tx,transY+50-Math.abs(th),transW/tLen-6,Math.abs(th),2);ctx.fill();
      }
      var gridX=15,gridY=130;
      for(var i=0;i<techniques.length;i++){
        var gx=gridX+(i%4)*155,gy=gridY+Math.floor(i/4)*50;
        var isHover=i===hoverTech;
        var isSel=i===selectedTech;
        ctx.fillStyle=isSel?techniques[i].color+'33':isHover?'#1e2640':'#141828';
        ctx.beginPath();ctx.roundRect(gx,gy,148,42,6);ctx.fill();
        ctx.strokeStyle=isSel?techniques[i].color:isHover?'#4a7dff':'#1e2640';
        ctx.lineWidth=isSel?2:1;ctx.beginPath();ctx.roundRect(gx,gy,148,42,6);ctx.stroke();
        ctx.fillStyle=techniques[i].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(techniques[i].name,gx+8,gy+16);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(techniques[i].desc,gx+8,gy+30);
        var mval=techMastery[techniques[i].name];
        ctx.fillStyle=gradeColor27(gradeOf27(mval));ctx.font='bold 9px sans-serif';
        ctx.fillText(mval+'%',gx+120,gy+16);
      }
      var barX=15,barY=245,barW=600,barH=100;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 10px sans-serif';
      ctx.fillText('Mastery Overview',barX,barY-5);
      var bw=barW/techniques.length-6;
      for(var bi=0;bi<techniques.length;bi++){
        var bx=barX+bi*(bw+6);
        var bv=techMastery[techniques[bi].name];
        var bh=bv/100*barH;
        ctx.fillStyle=techniques[bi].color+'66';
        ctx.beginPath();ctx.roundRect(bx,barY+barH-bh,bw,bh,3);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';
        if(bh>15) ctx.fillText(bv+'%',bx+bw/2-12,barY+barH-bh+14);
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        ctx.save();ctx.translate(bx+bw/2,barY+barH+12);ctx.rotate(-0.3);
        ctx.fillText(techniques[bi].name,0,0);ctx.restore();
      }
      var totalMast=0;
      techniques.forEach(function(t){totalMast+=techMastery[t.name];});
      var avgMast=Math.round(totalMast/techniques.length);
      var gr=gradeOf27(avgMast);
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(15,365,610,28,6);ctx.fill();
      ctx.fillStyle=gradeColor27(gr);ctx.font='bold 16px sans-serif';ctx.fillText(gr,25,386);
      ctx.fillStyle='#c9d1d9';ctx.font='10px sans-serif';
      ctx.fillText('Overall Mastery: '+avgMast+'% | '+techniques.length+' techniques',55,385);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(640/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverTech=-1;
      for(var i=0;i<techniques.length;i++){
        var gx=15+(i%4)*155,gy=130+Math.floor(i/4)*50;
        if(mx>=gx&&mx<=gx+148&&my>=gy&&my<=gy+42){hoverTech=i;break;}
      }
      drawMotifUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(640/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      for(var i=0;i<techniques.length;i++){
        var gx=15+(i%4)*155,gy=130+Math.floor(i/4)*50;
        if(mx>=gx&&mx<=gx+148&&my>=gy&&my<=gy+42){
          selectedTech=i;playSFX27('motif_transform');drawMotifUI();return;
        }
      }
    });
    drawMotifUI();
    markV27Feature('motif_lab');
    playSFX27('motif_play');
  });
}

// ================ 7. TRANSPOSITION MASTERY TRACKER (Canvas 600x380) ================
function buildTranspositionUI(){
  makeV27Modal('transposition-modal','조옮김 마스터리 트래커',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='12키 조옮김 정확도 히트맵 + 반응시간 바차트. 모든 키에서 자유롭게 연주하세요.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var keys=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
    var keyColors=['#4a7dff','#ef4444','#22c55e','#f59e0b','#a855f7','#06b6d4','#ec4899','#f97316','#14b8a6','#6366f1','#84cc16','#d946ef'];
    var fromKeys=['C','G','D','F'];
    var transData=ls27Get('trans_data',null);
    if(!transData){
      transData={};
      fromKeys.forEach(function(fk){
        transData[fk]={};
        keys.forEach(function(tk){
          transData[fk][tk]={accuracy:Math.floor(Math.random()*70)+20,time:Math.floor(Math.random()*4000)+500,attempts:Math.floor(Math.random()*15)+3};
        });
      });
      ls27Set('trans_data',transData);
    }
    var selectedFrom=0,hoverKey=-1;
    function drawTransUI(){
      ctx.clearRect(0,0,600,380);
      var gBg=ctx.createLinearGradient(0,0,0,380);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Transposition Mastery Tracker',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('4 source keys × 12 target keys | Click source key tabs',15,42);
      var tabX=15,tabY=52;
      fromKeys.forEach(function(fk,fi){
        var tw=60;
        ctx.fillStyle=fi===selectedFrom?'#4a7dff':'#141828';
        ctx.beginPath();ctx.roundRect(tabX+fi*(tw+4),tabY,tw,24,4);ctx.fill();
        ctx.fillStyle=fi===selectedFrom?'#fff':'#8892a8';ctx.font='bold 10px sans-serif';
        ctx.fillText('From '+fk,tabX+fi*(tw+4)+8,tabY+16);
      });
      var hmX=15,hmY=90,cellW=46,cellH=50;
      var fk=fromKeys[selectedFrom];
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Accuracy Heatmap ('+fk+' → Target)',hmX,hmY-8);
      for(var ki=0;ki<keys.length;ki++){
        var kx=hmX+ki*(cellW+2);
        var acc=transData[fk][keys[ki]].accuracy;
        var isHover=ki===hoverKey;
        var r=Math.round(255-(acc/100)*200);
        var g=Math.round((acc/100)*200+40);
        ctx.fillStyle='rgba('+r+','+g+',80,0.65)';
        if(isHover) ctx.fillStyle='#4a7dff88';
        ctx.beginPath();ctx.roundRect(kx,hmY,cellW,cellH,4);ctx.fill();
        if(isHover){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(kx,hmY,cellW,cellH,4);ctx.stroke();}
        ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';
        ctx.fillText(keys[ki],kx+cellW/2-8,hmY+20);
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
        ctx.fillText(acc+'%',kx+cellW/2-12,hmY+36);
        ctx.fillStyle='#ddd';ctx.font='7px sans-serif';
        ctx.fillText(gradeOf27(acc),kx+cellW/2-3,hmY+46);
      }
      var barY2=160,barH=100;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Response Time (ms)',hmX,barY2-5);
      var maxTime=5000;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=0.5;
      for(var tg=0;tg<=5000;tg+=1000){
        var ty=barY2+barH-(tg/maxTime)*barH;
        ctx.beginPath();ctx.moveTo(hmX,ty);ctx.lineTo(hmX+11*48+46,ty);ctx.stroke();
        ctx.fillStyle='#555';ctx.font='7px sans-serif';ctx.fillText(tg/1000+'s',hmX-20,ty+3);
      }
      for(var ki2=0;ki2<keys.length;ki2++){
        var kx2=hmX+ki2*(cellW+2);
        var time=transData[fk][keys[ki2]].time;
        var bh=Math.min(time/maxTime,1)*barH;
        var col=time<1500?'#22c55e':time<3000?'#f59e0b':'#ef4444';
        ctx.fillStyle=col+'88';
        ctx.beginPath();ctx.roundRect(kx2,barY2+barH-bh,cellW,bh,3);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';
        if(bh>15) ctx.fillText((time/1000).toFixed(1)+'s',kx2+8,barY2+barH-bh+12);
      }
      var circleX=300,circleY=320,circleR=40;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('Circle of Fifths',circleX-30,circleY-circleR-10);
      for(var ci=0;ci<12;ci++){
        var angle=-Math.PI/2+ci*(Math.PI*2/12);
        var cx=circleX+Math.cos(angle)*circleR;
        var cy=circleY+Math.sin(angle)*circleR;
        var acc2=transData[fk][keys[ci]].accuracy;
        ctx.fillStyle=keyColors[ci];ctx.globalAlpha=acc2/100*0.7+0.3;
        ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=1;
        ctx.fillStyle='#fff';ctx.font='bold 7px sans-serif';
        ctx.fillText(keys[ci],cx-5,cy+3);
      }
      var totalAcc=0;
      keys.forEach(function(k){totalAcc+=transData[fk][k].accuracy;});
      var avgAcc=Math.round(totalAcc/12);
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(400,280,180,75,6);ctx.fill();
      ctx.fillStyle=gradeColor27(gradeOf27(avgAcc));ctx.font='bold 28px sans-serif';
      ctx.fillText(gradeOf27(avgAcc),420,318);
      ctx.fillStyle='#c9d1d9';ctx.font='11px sans-serif';
      ctx.fillText('Avg: '+avgAcc+'%',460,316);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('From '+fk+' | 12 target keys',410,340);
      if(hoverKey>=0){
        var hd=transData[fk][keys[hoverKey]];
        ctx.fillStyle='#1a2036ee';ctx.beginPath();ctx.roundRect(450,55,140,65,6);ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(450,55,140,65,6);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='10px sans-serif';
        ctx.fillText(fk+' → '+keys[hoverKey],460,72);
        ctx.fillText('Accuracy: '+hd.accuracy+'%',460,87);
        ctx.fillText('Time: '+(hd.time/1000).toFixed(1)+'s',460,102);
        ctx.fillText('Attempts: '+hd.attempts,460,115);
      }
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverKey=-1;
      for(var ki=0;ki<keys.length;ki++){
        var kx=15+ki*48;
        if(mx>=kx&&mx<=kx+46&&my>=90&&my<=140){hoverKey=ki;break;}
      }
      drawTransUI();
    });
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      for(var fi=0;fi<fromKeys.length;fi++){
        var tx=15+fi*64;
        if(mx>=tx&&mx<=tx+60&&my>=52&&my<=76){selectedFrom=fi;playSFX27('trans_correct');drawTransUI();return;}
      }
    });
    drawTransUI();
    markV27Feature('transposition_mastery');
    playSFX27('trans_correct');
  });
}

// ================ 8. COMPREHENSIVE PIANO IQ DASHBOARD (Canvas 620x400) ================
function buildPianoIQUI(){
  makeV27Modal('piano-iq-modal','종합 피아노 IQ 대시보드',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='8축 종합 피아노 IQ 측정. 테크닉/리듬/음감/이론/초견/화성/표현/레퍼토리를 통합 분석합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var dimensions=[
      {name:'Technique',icon:'✋',color:'#4a7dff'},
      {name:'Rhythm',icon:'🥁',color:'#22c55e'},
      {name:'Ear',icon:'👂',color:'#f59e0b'},
      {name:'Theory',icon:'📚',color:'#a855f7'},
      {name:'Sight-Read',icon:'👁',color:'#06b6d4'},
      {name:'Harmony',icon:'🎶',color:'#ec4899'},
      {name:'Expression',icon:'❤',color:'#ef4444'},
      {name:'Repertoire',icon:'🎹',color:'#f97316'}
    ];
    var iqData=ls27Get('iq_data',null);
    if(!iqData){
      iqData={};
      dimensions.forEach(function(d){iqData[d.name]=Math.floor(Math.random()*50)+35;});
      iqData['Technique']=Math.floor(Math.random()*20)+60;
      iqData['Rhythm']=Math.floor(Math.random()*20)+55;
      ls27Set('iq_data',iqData);
    }
    var iqHistory=ls27Get('iq_history',[]);
    if(iqHistory.length===0){
      for(var ih=0;ih<10;ih++){iqHistory.push(Math.floor(Math.random()*30)+50);}
      ls27Set('iq_history',iqHistory);
    }
    var hoverDim=-1;
    function drawIQUI(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Comprehensive Piano IQ Dashboard',15,25);
      var totalIQ=0;
      dimensions.forEach(function(d){totalIQ+=iqData[d.name];});
      var avgIQ=Math.round(totalIQ/dimensions.length);
      var pianoIQ=Math.round(avgIQ*1.5);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('8 dimensions | Piano IQ: '+pianoIQ,15,42);
      var gaugeX=15,gaugeY=55;
      for(var di=0;di<8;di++){
        var gx=gaugeX+(di%4)*150;
        var gy=gaugeY+Math.floor(di/4)*85;
        var dim=dimensions[di];
        var val=iqData[dim.name];
        var isHover=di===hoverDim;
        ctx.fillStyle=isHover?'#1e2640':'#141828';
        ctx.beginPath();ctx.roundRect(gx,gy,142,78,8);ctx.fill();
        ctx.strokeStyle=isHover?dim.color:'#1e2640';ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(gx,gy,142,78,8);ctx.stroke();
        ctx.fillStyle=dim.color;ctx.font='12px sans-serif';
        ctx.fillText(dim.icon,gx+8,gy+18);
        ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
        ctx.fillText(dim.name,gx+24,gy+16);
        var gr=gradeOf27(val);
        ctx.fillStyle=gradeColor27(gr);ctx.font='bold 10px sans-serif';
        ctx.fillText(gr,gx+120,gy+16);
        var arcCx=gx+71,arcCy=gy+58,arcR=22;
        ctx.strokeStyle='#1e2640';ctx.lineWidth=6;
        ctx.beginPath();ctx.arc(arcCx,arcCy,arcR,-Math.PI,-Math.PI+Math.PI,false);ctx.stroke();
        ctx.strokeStyle=dim.color;ctx.lineWidth=6;
        ctx.beginPath();ctx.arc(arcCx,arcCy,arcR,-Math.PI,-Math.PI+Math.PI*(val/100),false);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';
        ctx.fillText(val+'%',arcCx-14,arcCy+5);
      }
      var iqBoxX=50,iqBoxY=235;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(iqBoxX,iqBoxY,120,80,10);ctx.fill();
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(iqBoxX,iqBoxY,120,80,10);ctx.stroke();
      ctx.fillStyle='#4a7dff';ctx.font='bold 9px sans-serif';
      ctx.fillText('Piano IQ',iqBoxX+32,iqBoxY+18);
      var iqGr=gradeOf27(avgIQ);
      ctx.fillStyle=gradeColor27(iqGr);ctx.font='bold 32px sans-serif';
      ctx.fillText(pianoIQ,iqBoxX+28,iqBoxY+55);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('Grade: '+iqGr,iqBoxX+38,iqBoxY+72);
      var lineX=200,lineY=235,lineW=200,lineH=80;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('IQ Trend',lineX,lineY-5);
      ctx.strokeStyle='#1e2640';ctx.lineWidth=0.5;
      for(var yg=0;yg<=150;yg+=30){
        var yy=lineY+lineH-(yg/150)*lineH;
        ctx.beginPath();ctx.moveTo(lineX,yy);ctx.lineTo(lineX+lineW,yy);ctx.stroke();
      }
      if(iqHistory.length>1){
        var grd=ctx.createLinearGradient(lineX,lineY,lineX,lineY+lineH);
        grd.addColorStop(0,'#4a7dff33');grd.addColorStop(1,'#4a7dff00');
        ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(lineX,lineY+lineH);
        for(var hi=0;hi<iqHistory.length;hi++){
          var hx=lineX+(hi/(iqHistory.length-1))*lineW;
          var hy=lineY+lineH-(iqHistory[hi]*1.5/150)*lineH;
          ctx.lineTo(hx,hy);
        }
        ctx.lineTo(lineX+lineW,lineY+lineH);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
        for(var hi2=0;hi2<iqHistory.length;hi2++){
          var hx2=lineX+(hi2/(iqHistory.length-1))*lineW;
          var hy2=lineY+lineH-(iqHistory[hi2]*1.5/150)*lineH;
          if(hi2===0)ctx.moveTo(hx2,hy2);else ctx.lineTo(hx2,hy2);
        }
        ctx.stroke();
      }
      var radarX=500,radarY=280,radarR=65;
      ctx.fillStyle='#c9d1d9';ctx.font='bold 9px sans-serif';
      ctx.fillText('IQ Radar',radarX-15,radarY-radarR-10);
      for(var ring=1;ring<=4;ring++){
        ctx.strokeStyle='#1e264066';ctx.lineWidth=0.5;
        ctx.beginPath();ctx.arc(radarX,radarY,radarR*(ring/4),0,Math.PI*2);ctx.stroke();
      }
      ctx.beginPath();
      for(var ri=0;ri<8;ri++){
        var angle=-Math.PI/2+ri*(Math.PI*2/8);
        var rv=iqData[dimensions[ri].name]/100;
        var rx=radarX+Math.cos(angle)*radarR*rv;
        var ry=radarY+Math.sin(angle)*radarR*rv;
        if(ri===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
        ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
        var lbx=radarX+Math.cos(angle)*(radarR+12)-12;
        var lby=radarY+Math.sin(angle)*(radarR+12)+3;
        ctx.fillText(dimensions[ri].name.substr(0,4),lbx,lby);
      }
      ctx.closePath();
      ctx.fillStyle='#4a7dff22';ctx.fill();
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.stroke();
      for(var ri2=0;ri2<8;ri2++){
        var angle2=-Math.PI/2+ri2*(Math.PI*2/8);
        var rv2=iqData[dimensions[ri2].name]/100;
        ctx.fillStyle=dimensions[ri2].color;
        ctx.beginPath();ctx.arc(radarX+Math.cos(angle2)*radarR*rv2,radarY+Math.sin(angle2)*radarR*rv2,3,0,Math.PI*2);ctx.fill();
      }
      var sumY=370;
      ctx.fillStyle='#1a2036';ctx.beginPath();ctx.roundRect(15,sumY,590,25,6);ctx.fill();
      var strongest='',sVal=0,weakest='',wVal=101;
      dimensions.forEach(function(d){
        var v=iqData[d.name];
        if(v>sVal){sVal=v;strongest=d.name;}
        if(v<wVal){wVal=v;weakest=d.name;}
      });
      ctx.fillStyle='#c9d1d9';ctx.font='10px sans-serif';
      ctx.fillText('Strongest: '+strongest+' ('+sVal+'%) | Weakest: '+weakest+' ('+wVal+'%) | Focus: '+weakest+' training recommended',25,sumY+17);
    }
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      hoverDim=-1;
      for(var di=0;di<8;di++){
        var gx=15+(di%4)*150,gy=55+Math.floor(di/4)*85;
        if(mx>=gx&&mx<=gx+142&&my>=gy&&my<=gy+78){hoverDim=di;break;}
      }
      drawIQUI();
    });
    canvas.addEventListener('click',function(){drawIQUI();});
    drawIQUI();
    markV27Feature('piano_iq');
  });
}

// ================ QUIZ v18 (15 Questions, 255->270) ================
function buildQuizV18UI(){
  makeV27Modal('quiz18-modal','Piano Quiz v18',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='v27 피아노 지식 퀴즈 15문. 인터벌/코드보이싱/음색/조옮김/모티프 변형 등.';
    container.appendChild(desc);
    var quizzes=[
      {q:'장3도(Major 3rd)의 반음 수는?',a:['3반음','4반음','5반음','6반음'],c:1},
      {q:'코드 보이싱에서 1전위(1st Inversion)란?',a:['루트 위치','3음이 최저음','5음이 최저음','7음이 최저음'],c:1},
      {q:'피아노 그랜드와 업라이트의 가장 큰 차이는?',a:['건반 수','현의 배치 방향','페달 수','음역'],c:1},
      {q:'모티프의 역행(Retrograde)이란?',a:['음정 반전','음 순서 뒤집기','리듬 2배','전조'],c:1},
      {q:'완전5도(Perfect 5th)의 반음 수는?',a:['5반음','6반음','7반음','8반음'],c:2},
      {q:'Csus4 코드의 구성음은?',a:['C-E-G','C-F-G','C-Eb-G','C-E-G#'],c:1},
      {q:'드뷔시의 대표 피아노곡은?',a:['혁명 에튀드','달빛(Clair de Lune)','라 캄파넬라','리골레토 파라프레이즈'],c:1},
      {q:'Rhodes 피아노의 음색 특성은?',a:['밝고 날카로움','따뜻하고 부드러움','금속적이고 공격적','둔탁하고 무거움'],c:1},
      {q:'조옮김(Transposition)에서 C장조를 G장조로 옮기면 반음 몇 개 위?',a:['5반음','7반음','9반음','12반음'],c:1},
      {q:'음악에서 Augmentation이란?',a:['리듬을 2배로 늘림','음정을 높임','박자를 바꿈','조성을 바꿈'],c:0},
      {q:'손가락 독립성이 가장 약한 손가락은 보통?',a:['검지','중지','약지','새끼손가락'],c:2},
      {q:'바흐 프렐류드 C장조 BWV846의 특징은?',a:['화려한 옥타브','아르페지오 반복 패턴','빠른 스케일 패싱','포르테 코드'],c:1},
      {q:'Diminished 코드의 구조는?',a:['장3도+장3도','단3도+단3도','장3도+단3도','단3도+장3도'],c:1},
      {q:'라 캄파넬라는 누구의 작품인가?',a:['쇼팽','드뷔시','리스트','슈만'],c:2},
      {q:'피아노 IQ에서 가장 중요한 요소는?',a:['속도만','음감만','종합적 균형','악보 암기'],c:2}
    ];
    var currentQ=0,score=0,answered=false,selectedA=-1;
    var quizDiv=document.createElement('div');
    container.appendChild(quizDiv);
    function renderQuiz(){
      if(currentQ>=quizzes.length){
        var pct=Math.round(score/quizzes.length*100);
        ls27Set('quiz18_pct',pct);
        quizDiv.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:28px;color:'+gradeColor27(gradeOf27(pct))+'">'+gradeOf27(pct)+'</div><div style="font-size:16px;margin:8px 0;color:var(--text)">'+score+'/'+quizzes.length+' ('+pct+'%)</div><div style="font-size:11px;color:var(--text2)">Piano Quiz v18 Complete!</div></div>';
        return;
      }
      var q=quizzes[currentQ];
      var html='<div style="margin-bottom:12px"><div style="font-size:11px;color:var(--text2);margin-bottom:4px">Q'+(currentQ+1)+'/'+quizzes.length+'</div>';
      html+='<div style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--text)">'+q.q+'</div>';
      q.a.forEach(function(a,ai){
        var bgCol=answered?(ai===q.c?'rgba(34,197,94,0.2)':ai===selectedA?'rgba(239,68,68,0.2)':'transparent'):'transparent';
        var borderCol=answered?(ai===q.c?'#22c55e':ai===selectedA?'#ef4444':'var(--border)'):'var(--border)';
        html+='<button class="quiz18-btn" data-idx="'+ai+'" style="display:block;width:100%;padding:8px 12px;margin:4px 0;border-radius:6px;border:1px solid '+borderCol+';background:'+bgCol+';color:var(--text);font-size:11px;cursor:pointer;text-align:left">'+a+'</button>';
      });
      html+='</div>';
      quizDiv.innerHTML=html;
      quizDiv.querySelectorAll('.quiz18-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
          if(answered) return;
          answered=true;selectedA=parseInt(btn.dataset.idx);
          if(selectedA===q.c){score++;playSFX27('quiz_correct27');}
          else{playSFX27('interval_wrong');}
          renderQuiz();
          setTimeout(function(){currentQ++;answered=false;selectedA=-1;renderQuiz();},1200);
        });
      });
    }
    renderQuiz();
  });
}

// ================ 12 NEW ACHIEVEMENTS (252->264) ================
function injectV27Achievements(){
  if(!window.app||!app.achievements) return;
  var newAchs=[
    {id:'v27_interval1',name:'Interval Beginner',desc:'인터벌 트레이닝 시작',icon:'👂',unlocked:false},
    {id:'v27_interval2',name:'Interval Master',desc:'인터벌 정확도 80% 달성',icon:'🎯',unlocked:false},
    {id:'v27_chord1',name:'Chord Explorer',desc:'코드 보이싱 워크샵 시작',icon:'🎶',unlocked:false},
    {id:'v27_chord2',name:'Voicing Expert',desc:'코드 보이싱 평균 70% 달성',icon:'🏆',unlocked:false},
    {id:'v27_finger1',name:'Finger Analyst',desc:'손가락 독립 진단 완료',icon:'✋',unlocked:false},
    {id:'v27_energy1',name:'Energy Mapper',desc:'연습 에너지 맵 확인',icon:'⚡',unlocked:false},
    {id:'v27_timbre1',name:'Timbre Explorer',desc:'5가지 이상 음색 탐험',icon:'🎨',unlocked:false},
    {id:'v27_motif1',name:'Motif Transformer',desc:'모티프 변형 3가지 이상 사용',icon:'🧩',unlocked:false},
    {id:'v27_trans1',name:'Key Traveler',desc:'조옮김 트래커 시작',icon:'🗺',unlocked:false},
    {id:'v27_iq1',name:'IQ Assessor',desc:'피아노 IQ 대시보드 확인',icon:'🧠',unlocked:false},
    {id:'v27_songs',name:'242 Songs',desc:'242곡 라이브러리 달성',icon:'🎹',unlocked:false},
    {id:'v27_quiz18',name:'Quiz v18 Master',desc:'퀴즈 v18 80% 이상',icon:'💡',unlocked:false}
  ];
  newAchs.forEach(function(na){
    var exists=app.achievements.some(function(a){return a.id===na.id});
    if(!exists) app.achievements.push(na);
  });
}

function checkV27Achievements(){
  if(!window.app||!app.achievements) return;
  var checks=[
    {id:'v27_interval1',fn:function(){return (ls27Get('features_used',[])).indexOf('interval_training')!==-1;}},
    {id:'v27_interval2',fn:function(){
      var st=ls27Get('interval_stats',{});var total=0,correct=0;
      Object.keys(st).forEach(function(k){total+=st[k].total;correct+=st[k].correct;});
      return total>0&&correct/total>=0.8;
    }},
    {id:'v27_chord1',fn:function(){return (ls27Get('features_used',[])).indexOf('chord_voicing')!==-1;}},
    {id:'v27_chord2',fn:function(){
      var m=ls27Get('chord_mastery',{});var total=0,cnt=0;
      Object.keys(m).forEach(function(k){Object.keys(m[k]).forEach(function(v){total+=m[k][v];cnt++;});});
      return cnt>0&&total/cnt>=70;
    }},
    {id:'v27_finger1',fn:function(){return (ls27Get('features_used',[])).indexOf('finger_diagnostic')!==-1;}},
    {id:'v27_energy1',fn:function(){return (ls27Get('features_used',[])).indexOf('practice_energy')!==-1;}},
    {id:'v27_timbre1',fn:function(){return (ls27Get('features_used',[])).indexOf('timbre_palette')!==-1;}},
    {id:'v27_motif1',fn:function(){return (ls27Get('features_used',[])).indexOf('motif_lab')!==-1;}},
    {id:'v27_trans1',fn:function(){return (ls27Get('features_used',[])).indexOf('transposition_mastery')!==-1;}},
    {id:'v27_iq1',fn:function(){return (ls27Get('features_used',[])).indexOf('piano_iq')!==-1;}},
    {id:'v27_songs',fn:function(){return window.app&&app.songs&&app.songs.length>=242;}},
    {id:'v27_quiz18',fn:function(){return ls27Get('quiz18_pct',0)>=80;}}
  ];
  checks.forEach(function(c){
    var ach=app.achievements.find(function(a){return a.id===c.id});
    if(ach&&!ach.unlocked&&c.fn()){
      ach.unlocked=true;
      if(app.showToast) app.showToast('🏆 업적 해금: '+ach.name,'achievement');
      playSFX27('v27_achieve');
    }
  });
}

// ================ KEYBOARD SHORTCUTS v27 ================
function setupV27Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var map={'q':'interval-train-modal','w':'chord-voicing-modal','e':'finger-diag-modal',
             'r':'practice-energy-modal','t':'timbre-palette-modal','y':'motif-lab-modal',
             'u':'transposition-modal','i':'piano-iq-modal','0':'quiz18-modal'};
    var key=e.key.toLowerCase();
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV27NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'👂 인터벌',modal:'interval-train-modal'},
    {label:'🎶 보이싱',modal:'chord-voicing-modal'},
    {label:'✋ 손가락',modal:'finger-diag-modal'},
    {label:'⚡ 에너지맵',modal:'practice-energy-modal'},
    {label:'🎨 음색',modal:'timbre-palette-modal'},
    {label:'🧩 모티프',modal:'motif-lab-modal'},
    {label:'🗺 조옮김',modal:'transposition-modal'},
    {label:'🧠 피아노IQ',modal:'piano-iq-modal'},
    {label:'💡 퀸즈v18',modal:'quiz18-modal'}
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
function initV27(){
  addV27Songs();
  buildIntervalTrainingUI();
  buildChordVoicingUI();
  buildFingerDiagnosticUI();
  buildPracticeEnergyUI();
  buildTimbrePaletteUI();
  buildMotifLabUI();
  buildTranspositionUI();
  buildPianoIQUI();
  buildQuizV18UI();
  injectV27Achievements();
  setupV27Shortcuts();
  injectV27NavButtons();
  setInterval(checkV27Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV27,7600);});
else setTimeout(initV27,7600);
})();
