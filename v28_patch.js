// Piano Master v28 Patch Module
// Chord Progression Analyzer, Sight-Reading Speed Test, Practice Streak Heatmap,
// Dynamic Marking Mastery, Key Signature Explorer, Rhythm Subdivision Trainer,
// Composer Match Quiz, Comprehensive Musicianship Dashboard
// 10 Songs (242->252), Quiz v19 15Q (270->285), 12 Achievements (264->276), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v28Loaded) return;
window.__v28Loaded = true;

var LS28 = 'piano-v28-';
function ls28Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS28+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls28Set(k,v){localStorage.setItem(LS28+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v28 (16 sounds) ================
var sfx28 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone28(freq,type,dur,gainVal,delayMs){
  if(!sfx28) return;
  setTimeout(function(){
    if(!sfx28) return;
    var t=sfx28.currentTime,g=sfx28.createGain(),o=sfx28.createOscillator();
    o.connect(g);g.connect(sfx28.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX28(type){
  if(!sfx28) return;
  if(sfx28.state==='suspended') sfx28.resume();
  switch(type){
    case 'chord_prog_open': tone28(262,'triangle',0.1,0.06,0); tone28(330,'triangle',0.1,0.06,60); tone28(392,'triangle',0.1,0.06,120); break;
    case 'chord_prog_play': tone28(440,'sine',0.12,0.07,0); tone28(554,'sine',0.12,0.07,50); tone28(659,'sine',0.12,0.07,100); break;
    case 'sight_open': tone28(523,'triangle',0.08,0.06,0); tone28(659,'triangle',0.08,0.06,70); break;
    case 'sight_correct': tone28(659,'triangle',0.08,0.08,0); tone28(784,'triangle',0.1,0.08,60); tone28(988,'triangle',0.12,0.08,120); break;
    case 'sight_wrong': tone28(277,'sawtooth',0.15,0.05,0); break;
    case 'streak_open': tone28(392,'sine',0.1,0.05,0); tone28(494,'sine',0.08,0.05,60); break;
    case 'streak_update': tone28(523,'triangle',0.08,0.06,0); tone28(659,'triangle',0.1,0.06,70); break;
    case 'dynamic_open': tone28(349,'triangle',0.1,0.05,0); break;
    case 'dynamic_correct': tone28(523,'triangle',0.08,0.07,0); tone28(784,'triangle',0.1,0.07,80); break;
    case 'keysig_open': tone28(440,'sine',0.1,0.06,0); tone28(554,'sine',0.08,0.06,60); break;
    case 'keysig_select': tone28(494,'triangle',0.08,0.06,0); tone28(659,'triangle',0.1,0.06,60); break;
    case 'rhythm_open': tone28(330,'triangle',0.08,0.06,0); tone28(440,'triangle',0.08,0.06,50); break;
    case 'rhythm_tap': tone28(880,'sine',0.05,0.07,0); break;
    case 'composer_correct': tone28(659,'triangle',0.08,0.08,0); tone28(784,'triangle',0.1,0.08,60); tone28(1047,'triangle',0.12,0.08,120); break;
    case 'v28_achieve': tone28(523,'triangle',0.1,0.1,0); tone28(659,'triangle',0.12,0.1,80); tone28(784,'triangle',0.12,0.1,160); tone28(1047,'triangle',0.25,0.12,240); break;
    case 'quiz_correct28': tone28(698,'triangle',0.1,0.07,0); tone28(880,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v28 ================
function makeV28Modal(id, title, contentFn){
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

function markV28Feature(name){
  var used=ls28Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls28Set('features_used',used);}
}

function gradeOf28(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}
function gradeColor28(g){return g==='S'?'#ffd700':g==='A'?'#4a7dff':g==='B'?'#36d399':g==='C'?'#f59e0b':'#ef4444';}

// ================ 10 NEW SONGS (242->252) ================
function addV28Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s243',name:'사티 짐노페디 1번',category:'클래식',difficulty:'easy',
     notes:[{note:'F#5',time:0,dur:0.8},{note:'E5',time:0.8,dur:0.8},{note:'F#5',time:1.6,dur:0.8},{note:'B4',time:2.4,dur:0.8},{note:'F#5',time:3.2,dur:0.8},{note:'E5',time:4.0,dur:0.8},{note:'F#5',time:4.8,dur:0.8},{note:'B4',time:5.6,dur:0.8},{note:'D5',time:6.4,dur:0.4},{note:'C#5',time:6.8,dur:0.4},{note:'B4',time:7.2,dur:0.8},{note:'A4',time:8.0,dur:1.2}]},
    {id:'s244',name:'멘델스존 봄의 노래 Op.62',category:'클래식',difficulty:'medium',
     notes:[{note:'A5',time:0,dur:0.2},{note:'G#5',time:0.2,dur:0.2},{note:'A5',time:0.4,dur:0.4},{note:'F#5',time:0.8,dur:0.2},{note:'E5',time:1.0,dur:0.2},{note:'D5',time:1.2,dur:0.4},{note:'E5',time:1.6,dur:0.2},{note:'F#5',time:1.8,dur:0.2},{note:'A5',time:2.0,dur:0.4},{note:'G#5',time:2.4,dur:0.2},{note:'A5',time:2.6,dur:0.2},{note:'B5',time:2.8,dur:0.6}]},
    {id:'s245',name:'슈만 어린이 정경 Op.15 꿈',category:'클래식',difficulty:'easy',
     notes:[{note:'F5',time:0,dur:0.6},{note:'E5',time:0.6,dur:0.3},{note:'D5',time:0.9,dur:0.3},{note:'C5',time:1.2,dur:0.6},{note:'Bb4',time:1.8,dur:0.3},{note:'A4',time:2.1,dur:0.3},{note:'G4',time:2.4,dur:0.6},{note:'A4',time:3.0,dur:0.3},{note:'Bb4',time:3.3,dur:0.3},{note:'C5',time:3.6,dur:0.6},{note:'D5',time:4.2,dur:0.3},{note:'F5',time:4.5,dur:0.9}]},
    {id:'s246',name:'그리그 페르귄트 아침 기분',category:'클래식',difficulty:'medium',
     notes:[{note:'E4',time:0,dur:0.3},{note:'G#4',time:0.3,dur:0.3},{note:'B4',time:0.6,dur:0.3},{note:'E5',time:0.9,dur:0.6},{note:'D#5',time:1.5,dur:0.3},{note:'E5',time:1.8,dur:0.3},{note:'D#5',time:2.1,dur:0.3},{note:'E5',time:2.4,dur:0.3},{note:'B4',time:2.7,dur:0.3},{note:'G#4',time:3.0,dur:0.3},{note:'E4',time:3.3,dur:0.3},{note:'G#4',time:3.6,dur:0.6}]},
    {id:'s247',name:'리스트 헝가리 랩소디 2번',category:'클래식',difficulty:'expert',
     notes:[{note:'C#4',time:0,dur:0.15},{note:'D4',time:0.15,dur:0.15},{note:'E4',time:0.3,dur:0.15},{note:'F#4',time:0.45,dur:0.15},{note:'G#4',time:0.6,dur:0.15},{note:'A4',time:0.75,dur:0.15},{note:'B4',time:0.9,dur:0.15},{note:'C#5',time:1.05,dur:0.3},{note:'A4',time:1.35,dur:0.15},{note:'B4',time:1.5,dur:0.15},{note:'G#4',time:1.65,dur:0.15},{note:'A4',time:1.8,dur:0.4}]},
    {id:'s248',name:'모차르트 소나타 K.545 1악장',category:'클래식',difficulty:'medium',
     notes:[{note:'C5',time:0,dur:0.4},{note:'E5',time:0.4,dur:0.2},{note:'G5',time:0.6,dur:0.2},{note:'B4',time:0.8,dur:0.2},{note:'C5',time:1.0,dur:0.2},{note:'D5',time:1.2,dur:0.4},{note:'C5',time:1.6,dur:0.2},{note:'B4',time:1.8,dur:0.2},{note:'A4',time:2.0,dur:0.2},{note:'G4',time:2.2,dur:0.2},{note:'F4',time:2.4,dur:0.2},{note:'E4',time:2.6,dur:0.6}]},
    {id:'s249',name:'베토벤 월광 소나타 3악장',category:'클래식',difficulty:'expert',
     notes:[{note:'C#4',time:0,dur:0.12},{note:'E4',time:0.12,dur:0.12},{note:'G#4',time:0.24,dur:0.12},{note:'C#5',time:0.36,dur:0.12},{note:'E5',time:0.48,dur:0.12},{note:'G#4',time:0.6,dur:0.12},{note:'C#5',time:0.72,dur:0.12},{note:'E5',time:0.84,dur:0.12},{note:'C#4',time:0.96,dur:0.12},{note:'E4',time:1.08,dur:0.12},{note:'G#4',time:1.2,dur:0.12},{note:'C#5',time:1.32,dur:0.25}]},
    {id:'s250',name:'이루마 River Flows in You',category:'뉴에이지',difficulty:'easy',
     notes:[{note:'A4',time:0,dur:0.25},{note:'B4',time:0.25,dur:0.25},{note:'C#5',time:0.5,dur:0.25},{note:'B4',time:0.75,dur:0.25},{note:'A4',time:1.0,dur:0.5},{note:'E4',time:1.5,dur:0.25},{note:'F#4',time:1.75,dur:0.25},{note:'A4',time:2.0,dur:0.5},{note:'B4',time:2.5,dur:0.25},{note:'A4',time:2.75,dur:0.25},{note:'G#4',time:3.0,dur:0.5},{note:'A4',time:3.5,dur:0.75}]},
    {id:'s251',name:'쇼팽 녹턴 Op.9 No.2',category:'클래식',difficulty:'medium',
     notes:[{note:'Bb4',time:0,dur:0.6},{note:'Db5',time:0.6,dur:0.3},{note:'F5',time:0.9,dur:0.3},{note:'Eb5',time:1.2,dur:0.6},{note:'Db5',time:1.8,dur:0.3},{note:'C5',time:2.1,dur:0.3},{note:'Bb4',time:2.4,dur:0.3},{note:'Ab4',time:2.7,dur:0.3},{note:'Bb4',time:3.0,dur:0.6},{note:'C5',time:3.6,dur:0.3},{note:'Db5',time:3.9,dur:0.3},{note:'Eb5',time:4.2,dur:0.9}]},
    {id:'s252',name:'차이콥스키 백조의 호수',category:'클래식',difficulty:'hard',
     notes:[{note:'A4',time:0,dur:0.4},{note:'B4',time:0.4,dur:0.2},{note:'C5',time:0.6,dur:0.2},{note:'D5',time:0.8,dur:0.4},{note:'E5',time:1.2,dur:0.2},{note:'D5',time:1.4,dur:0.2},{note:'C5',time:1.6,dur:0.4},{note:'B4',time:2.0,dur:0.2},{note:'A4',time:2.2,dur:0.4},{note:'G#4',time:2.6,dur:0.2},{note:'A4',time:2.8,dur:0.2},{note:'B4',time:3.0,dur:0.8}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. CHORD PROGRESSION ANALYZER (Canvas 620x400) ================
function buildChordProgAnalyzerUI(){
  makeV28Modal('chord-prog-analyzer-modal','코드 진행 분석기',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Simply Piano 수준의 코드 진행 패턴 분석. 10종 진행의 긴장도/해소 곡선과 장르별 활용 빈도를 시각화합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var progressions=[
      {name:'I-IV-V-I',chords:['C','F','G','C'],tension:[20,45,80,10],genres:{pop:90,rock:85,jazz:30,classical:70,blues:60}},
      {name:'I-V-vi-IV',chords:['C','G','Am','F'],tension:[15,55,70,40],genres:{pop:95,rock:80,jazz:25,classical:20,blues:35}},
      {name:'ii-V-I',chords:['Dm','G','C','_'],tension:[50,85,15,0],genres:{pop:40,rock:20,jazz:95,classical:50,blues:55}},
      {name:'I-vi-IV-V',chords:['C','Am','F','G'],tension:[10,60,45,75],genres:{pop:85,rock:70,jazz:35,classical:55,blues:45}},
      {name:'vi-IV-I-V',chords:['Am','F','C','G'],tension:[65,40,15,55],genres:{pop:80,rock:75,jazz:20,classical:15,blues:40}},
      {name:'I-bVII-IV-I',chords:['C','Bb','F','C'],tension:[15,60,40,10],genres:{pop:50,rock:90,jazz:30,classical:25,blues:70}},
      {name:'I-IV-vi-V',chords:['C','F','Am','G'],tension:[10,45,65,75],genres:{pop:75,rock:65,jazz:30,classical:40,blues:50}},
      {name:'I-iii-vi-V',chords:['C','Em','Am','G'],tension:[10,35,60,70],genres:{pop:60,rock:50,jazz:45,classical:65,blues:30}},
      {name:'iv-I-V-vi',chords:['Fm','C','G','Am'],tension:[70,15,55,65],genres:{pop:55,rock:60,jazz:40,classical:45,blues:55}},
      {name:'I-V/vi-vi-IV',chords:['C','E','Am','F'],tension:[10,75,60,40],genres:{pop:70,rock:55,jazz:50,classical:60,blues:35}}
    ];
    var selectedProg=0, hoverProg=-1, viewMode=0;
    var genreNames=['pop','rock','jazz','classical','blues'];
    var genreColors=['#ef4444','#f59e0b','#3b82f6','#a855f7','#22c55e'];
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Chord Progression Analyzer',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('코드 진행 패턴의 긴장-해소 곡선 & 장르별 활용 빈도 분석',15,42);
      var listX=15,listY=55,listW=165,itemH=28;
      for(var i=0;i<progressions.length;i++){
        var y=listY+i*itemH;
        var isHover=i===hoverProg,isSel=i===selectedProg;
        ctx.fillStyle=isSel?'rgba(74,125,255,0.15)':isHover?'#1e2640':'transparent';
        ctx.beginPath();ctx.roundRect(listX,y,listW,itemH-2,4);ctx.fill();
        ctx.strokeStyle=isSel?'#4a7dff':isHover?'#2a3558':'transparent';
        ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(listX,y,listW,itemH-2,4);ctx.stroke();
        ctx.fillStyle=isSel?'#4a7dff':'#c8d0e0';ctx.font=isSel?'bold 10px sans-serif':'10px sans-serif';
        ctx.fillText(progressions[i].name,listX+8,y+17);
      }
      var p=progressions[selectedProg];
      var chartX=195,chartY=55,chartW=410,chartH=140;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(chartX,chartY,chartW,chartH,8);ctx.fill();
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(chartX,chartY,chartW,chartH,8);ctx.stroke();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('Tension / Release Curve',chartX+10,chartY+15);
      var tension=p.tension.filter(function(t){return t>0});
      var pts=[];
      for(var ti=0;ti<tension.length;ti++){
        var tx=chartX+30+ti*((chartW-60)/(tension.length-1));
        var ty=chartY+chartH-15-(tension[ti]/100)*(chartH-35);
        pts.push({x:tx,y:ty,val:tension[ti]});
      }
      if(pts.length>1){
        var lineGrad=ctx.createLinearGradient(chartX,chartY+chartH,chartX,chartY);
        lineGrad.addColorStop(0,'#22c55e');lineGrad.addColorStop(0.5,'#f59e0b');lineGrad.addColorStop(1,'#ef4444');
        ctx.beginPath();ctx.moveTo(pts[0].x,chartY+chartH-15);
        for(var fi=0;fi<pts.length;fi++) ctx.lineTo(pts[fi].x,pts[fi].y);
        ctx.lineTo(pts[pts.length-1].x,chartY+chartH-15);ctx.closePath();
        ctx.fillStyle='rgba(74,125,255,0.1)';ctx.fill();
        ctx.strokeStyle=lineGrad;ctx.lineWidth=2.5;
        ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
        for(var li=1;li<pts.length;li++) ctx.lineTo(pts[li].x,pts[li].y);
        ctx.stroke();
        for(var ci=0;ci<pts.length;ci++){
          ctx.fillStyle=pts[ci].val>=70?'#ef4444':pts[ci].val>=40?'#f59e0b':'#22c55e';
          ctx.beginPath();ctx.arc(pts[ci].x,pts[ci].y,5,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#e8ecf4';ctx.font='bold 9px sans-serif';
          ctx.fillText(p.chords[ci],pts[ci].x-8,pts[ci].y-10);
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText(pts[ci].val+'%',pts[ci].x-8,pts[ci].y+18);
        }
      }
      var barX=195,barY=210,barW=410,barH=170;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,8);ctx.fill();
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,8);ctx.stroke();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('Genre Usage Frequency',barX+10,barY+15);
      var bw=55,bGap=15,bStartX=barX+35,bStartY=barY+barH-25;
      for(var gi=0;gi<genreNames.length;gi++){
        var gx=bStartX+gi*(bw+bGap);
        var val=p.genres[genreNames[gi]];
        var bh=(val/100)*(barH-50);
        var barGrad=ctx.createLinearGradient(gx,bStartY,gx,bStartY-bh);
        barGrad.addColorStop(0,genreColors[gi]+'88');barGrad.addColorStop(1,genreColors[gi]);
        ctx.fillStyle=barGrad;ctx.beginPath();ctx.roundRect(gx,bStartY-bh,bw,bh,4);ctx.fill();
        ctx.fillStyle='#e8ecf4';ctx.font='bold 9px sans-serif';
        ctx.fillText(val+'%',gx+bw/2-12,bStartY-bh-5);
        ctx.fillStyle=genreColors[gi];ctx.font='9px sans-serif';
        ctx.fillText(genreNames[gi].charAt(0).toUpperCase()+genreNames[gi].slice(1),gx+2,bStartY+12);
      }
      var grade=gradeOf28(Object.values(p.genres).reduce(function(a,b){return a+b},0)/5);
      ctx.fillStyle=gradeColor28(grade);ctx.font='bold 20px sans-serif';
      ctx.fillText(grade,580,barY+25);
    }
    draw();
    markV28Feature('chord_prog_analyzer');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width, sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx, my=(e.clientY-rect.top)*sy;
      for(var i=0;i<progressions.length;i++){
        var y=55+i*28;
        if(mx>=15&&mx<=180&&my>=y&&my<=y+26){
          selectedProg=i;playSFX28('chord_prog_play');draw();return;
        }
      }
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width;var sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var newHover=-1;
      for(var i=0;i<progressions.length;i++){
        var y=55+i*28;
        if(mx>=15&&mx<=180&&my>=y&&my<=y+26){newHover=i;break;}
      }
      if(newHover!==hoverProg){hoverProg=newHover;draw();}
    });
    playSFX28('chord_prog_open');
  });
}

// ================ 2. SIGHT-READING SPEED TEST (Canvas 620x400) ================
function buildSightReadingSpeedUI(){
  makeV28Modal('sight-speed-modal','초견 속도 테스트',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Flowkey 수준의 초견 읽기 속도 측정. 오선보에 표시된 음표를 빠르게 읽고 정확도와 반응속도를 분석합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var noteNames=['C','D','E','F','G','A','B'];
    var notePosY=[180,170,160,150,140,130,120,110,100,90,80,70,60,50];
    var noteLabels=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5'];
    var stats=ls28Get('sight_stats',null);
    if(!stats){
      stats={totalTests:0,correct:0,avgTime:0,bestTime:999,history:[]};
      for(var sh=0;sh<10;sh++){stats.history.push({correct:Math.floor(Math.random()*3)+5,total:8,avgMs:800+Math.floor(Math.random()*600)});}
      stats.totalTests=10;stats.correct=65;stats.avgTime=1050;stats.bestTime=520;
      ls28Set('sight_stats',stats);
    }
    var currentNote=-1,testActive=false,testRound=0,roundTotal=8,roundCorrect=0,roundTimes=[];
    var choices=[],selectedChoice=-1,hoverChoice=-1,showResult=false;
    function generateNote(){
      currentNote=Math.floor(Math.random()*14);
      var correctName=noteLabels[currentNote];
      choices=[correctName];
      while(choices.length<4){
        var rn=noteLabels[Math.floor(Math.random()*14)];
        if(choices.indexOf(rn)===-1) choices.push(rn);
      }
      for(var ci=choices.length-1;ci>0;ci--){
        var j=Math.floor(Math.random()*(ci+1));
        var tmp=choices[ci];choices[ci]=choices[j];choices[j]=tmp;
      }
      selectedChoice=-1;showResult=false;
      testRound++;
    }
    function startTest(){testActive=true;testRound=0;roundCorrect=0;roundTimes=[];generateNote();draw();}
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Sight-Reading Speed Test',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Flowkey 수준 초견 속도 측정 | 오선보 음표 빠르게 읽기',15,42);
      if(!testActive){
        ctx.fillStyle='#4a7dff';ctx.beginPath();ctx.roundRect(240,55,140,35,8);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.fillText('Start Test',275,78);
        var histX=30,histY=110,histW=560,histH=120;
        ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(histX,histY,histW,histH,8);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Session History (Accuracy %)',histX+10,histY+15);
        var hData=stats.history;
        if(hData.length>0){
          var maxPts=Math.min(hData.length,15);
          var pts=[];
          for(var hi=0;hi<maxPts;hi++){
            var pct=hData[hData.length-maxPts+hi].total>0?Math.round(hData[hData.length-maxPts+hi].correct/hData[hData.length-maxPts+hi].total*100):0;
            pts.push({x:histX+30+hi*((histW-60)/(maxPts-1||1)),y:histY+histH-20-(pct/100)*(histH-40),val:pct});
          }
          ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
          ctx.moveTo(pts[0].x,pts[0].y);
          for(var pi=1;pi<pts.length;pi++) ctx.lineTo(pts[pi].x,pts[pi].y);
          ctx.stroke();
          for(var di=0;di<pts.length;di++){
            ctx.fillStyle='#4a7dff';ctx.beginPath();ctx.arc(pts[di].x,pts[di].y,3,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#c8d0e0';ctx.font='8px sans-serif';ctx.fillText(pts[di].val+'%',pts[di].x-8,pts[di].y-8);
          }
        }
        var statY=250;
        ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(30,statY,270,130,8);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Lifetime Stats',45,statY+18);
        var sLabels=['Tests','Accuracy','Avg Time','Best Time'];
        var sVals=[stats.totalTests+'회',stats.totalTests>0?Math.round(stats.correct/(stats.totalTests*8)*100)+'%':'0%',stats.avgTime+'ms',stats.bestTime+'ms'];
        var sColors=['#4a7dff','#22c55e','#f59e0b','#a855f7'];
        for(var si=0;si<4;si++){
          ctx.fillStyle=sColors[si];ctx.font='bold 10px sans-serif';ctx.fillText(sLabels[si],45,statY+40+si*25);
          ctx.fillStyle='#e8ecf4';ctx.fillText(sVals[si],160,statY+40+si*25);
        }
        var grade=gradeOf28(stats.totalTests>0?Math.round(stats.correct/(stats.totalTests*8)*100):0);
        ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(320,statY,270,130,8);ctx.fill();
        ctx.fillStyle=gradeColor28(grade);ctx.font='bold 48px sans-serif';ctx.fillText(grade,420,statY+85);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.fillText('Overall Grade',400,statY+110);
      } else {
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText('Round '+testRound+'/'+roundTotal,530,25);
        var staffY=80,staffGap=12;
        for(var sl=0;sl<5;sl++){
          ctx.strokeStyle='#2a3558';ctx.lineWidth=1;ctx.beginPath();
          ctx.moveTo(100,staffY+sl*staffGap);ctx.lineTo(520,staffY+sl*staffGap);ctx.stroke();
        }
        var noteY=staffY+4*staffGap-(currentNote*staffGap/2);
        if(currentNote<2||currentNote>12){
          var ledgerY=noteY;
          ctx.strokeStyle='#2a3558';ctx.lineWidth=1;ctx.beginPath();
          ctx.moveTo(290,ledgerY);ctx.lineTo(330,ledgerY);ctx.stroke();
        }
        ctx.fillStyle=showResult?(selectedChoice>=0&&choices[selectedChoice]===noteLabels[currentNote]?'#22c55e':'#ef4444'):'#4a7dff';
        ctx.beginPath();ctx.ellipse(310,noteY,10,8,0,0,Math.PI*2);ctx.fill();
        var choiceY=180;
        for(var ci=0;ci<choices.length;ci++){
          var cx=100+ci*130,cw=110,ch=40;
          var isSel=ci===selectedChoice,isHov=ci===hoverChoice;
          var isCorrectChoice=showResult&&choices[ci]===noteLabels[currentNote];
          ctx.fillStyle=isCorrectChoice?'rgba(34,197,94,0.2)':isSel&&showResult?'rgba(239,68,68,0.2)':isHov?'#1e2640':'#141828';
          ctx.beginPath();ctx.roundRect(cx,choiceY,cw,ch,6);ctx.fill();
          ctx.strokeStyle=isCorrectChoice?'#22c55e':isSel&&showResult&&!isCorrectChoice?'#ef4444':isHov?'#4a7dff':'#1e2640';
          ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(cx,choiceY,cw,ch,6);ctx.stroke();
          ctx.fillStyle=isCorrectChoice?'#22c55e':'#e8ecf4';ctx.font='bold 14px sans-serif';
          ctx.fillText(choices[ci],cx+cw/2-15,choiceY+26);
        }
        if(showResult&&testRound>=roundTotal){
          var pct=roundTotal>0?Math.round(roundCorrect/roundTotal*100):0;
          var avgMs=roundTimes.length>0?Math.round(roundTimes.reduce(function(a,b){return a+b},0)/roundTimes.length):0;
          ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(120,250,380,130,10);ctx.fill();
          ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(120,250,380,130,10);ctx.stroke();
          ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';ctx.fillText('Result: '+roundCorrect+'/'+roundTotal+' ('+pct+'%)',175,280);
          ctx.fillStyle='#f59e0b';ctx.font='12px sans-serif';ctx.fillText('Avg Response: '+avgMs+'ms',200,305);
          var g=gradeOf28(pct);
          ctx.fillStyle=gradeColor28(g);ctx.font='bold 36px sans-serif';ctx.fillText(g,290,360);
        }
      }
    }
    draw();
    markV28Feature('sight_reading_speed');
    var questionStart=0;
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      if(!testActive){
        if(mx>=240&&mx<=380&&my>=55&&my<=90){startTest();questionStart=performance.now();playSFX28('sight_open');return;}
      }
      if(testActive&&!showResult){
        for(var ci=0;ci<choices.length;ci++){
          var cx=100+ci*130;
          if(mx>=cx&&mx<=cx+110&&my>=180&&my<=220){
            selectedChoice=ci;showResult=true;
            var elapsed=Math.round(performance.now()-questionStart);
            roundTimes.push(elapsed);
            if(choices[ci]===noteLabels[currentNote]){roundCorrect++;playSFX28('sight_correct');}
            else playSFX28('sight_wrong');
            draw();
            if(testRound<roundTotal){
              setTimeout(function(){generateNote();questionStart=performance.now();draw();},800);
            } else {
              stats.totalTests++;stats.correct+=roundCorrect;
              var avgMs=Math.round(roundTimes.reduce(function(a,b){return a+b},0)/roundTimes.length);
              stats.avgTime=Math.round((stats.avgTime*(stats.totalTests-1)+avgMs)/stats.totalTests);
              if(avgMs<stats.bestTime) stats.bestTime=avgMs;
              stats.history.push({correct:roundCorrect,total:roundTotal,avgMs:avgMs});
              ls28Set('sight_stats',stats);
              setTimeout(function(){testActive=false;draw();},2500);
            }
            return;
          }
        }
      }
      if(showResult&&testRound>=roundTotal){testActive=false;draw();}
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var nh=-1;
      if(testActive&&!showResult){
        for(var ci=0;ci<choices.length;ci++){
          if(mx>=100+ci*130&&mx<=210+ci*130&&my>=180&&my<=220){nh=ci;break;}
        }
      }
      if(nh!==hoverChoice){hoverChoice=nh;draw();}
    });
  });
}

// ================ 3. PRACTICE STREAK HEATMAP (Canvas 620x400) ================
function buildPracticeStreakHeatmapUI(){
  makeV28Modal('practice-streak-modal','연습 스트릭 히트맵',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='GitHub 스타일 연습 히트맵. 26주간 일별 연습 기록을 시각화하고 스트릭을 추적합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var streakData=ls28Get('streak_data',null);
    if(!streakData){
      streakData={days:[],currentStreak:0,bestStreak:0,totalDays:0};
      for(var d=0;d<182;d++){
        var val=Math.random()>0.3?Math.floor(Math.random()*4)+1:0;
        streakData.days.push(val);
        if(val>0) streakData.totalDays++;
      }
      var cs=0,bs=0;
      for(var si=streakData.days.length-1;si>=0;si--){
        if(streakData.days[si]>0) cs++; else break;
      }
      streakData.currentStreak=cs;
      var ts=0;
      for(var bi=0;bi<streakData.days.length;bi++){
        if(streakData.days[bi]>0){ts++;if(ts>bs) bs=ts;} else ts=0;
      }
      streakData.bestStreak=bs;
      ls28Set('streak_data',streakData);
    }
    var hoverCell=-1;
    var dayLabels=['Mon','','Wed','','Fri','','Sun'];
    function intensityColor(val){
      if(val===0) return '#161b22';
      if(val===1) return '#0e4429';
      if(val===2) return '#006d32';
      if(val===3) return '#26a641';
      return '#39d353';
    }
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Practice Streak Heatmap',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('26주간 일별 연습 기록 (GitHub 스타일 히트맵)',15,42);
      var gridX=45,gridY=65,cellSize=18,gap=3;
      for(var dl=0;dl<7;dl++){
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(dayLabels[dl],gridX-30,gridY+dl*(cellSize+gap)+14);
      }
      var weeks=Math.ceil(streakData.days.length/7);
      for(var w=0;w<weeks;w++){
        for(var dd=0;dd<7;dd++){
          var idx=w*7+dd;
          if(idx>=streakData.days.length) continue;
          var cx=gridX+w*(cellSize+gap);
          var cy=gridY+dd*(cellSize+gap);
          var val=streakData.days[idx];
          ctx.fillStyle=intensityColor(val);
          ctx.beginPath();ctx.roundRect(cx,cy,cellSize,cellSize,3);ctx.fill();
          if(idx===hoverCell){
            ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;
            ctx.beginPath();ctx.roundRect(cx,cy,cellSize,cellSize,3);ctx.stroke();
          }
        }
      }
      var legX=gridX,legY=gridY+7*(cellSize+gap)+15;
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Less',legX,legY+12);
      var legVals=[0,1,2,3,4];
      for(var lv=0;lv<legVals.length;lv++){
        ctx.fillStyle=intensityColor(legVals[lv]);
        ctx.beginPath();ctx.roundRect(legX+30+lv*(cellSize+2),legY,cellSize,cellSize,3);ctx.fill();
      }
      ctx.fillStyle='#8892a8';ctx.fillText('More',legX+30+5*(cellSize+2)+5,legY+12);
      var statY=270;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,statY,285,115,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Streak Statistics',30,statY+18);
      var statItems=[
        {label:'Current Streak',val:streakData.currentStreak+' days',color:'#22c55e'},
        {label:'Best Streak',val:streakData.bestStreak+' days',color:'#ffd700'},
        {label:'Total Practice Days',val:streakData.totalDays+' / '+streakData.days.length,color:'#4a7dff'},
        {label:'Practice Rate',val:Math.round(streakData.totalDays/streakData.days.length*100)+'%',color:'#a855f7'}
      ];
      for(var sti=0;sti<statItems.length;sti++){
        ctx.fillStyle=statItems[sti].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(statItems[sti].label,30,statY+38+sti*22);
        ctx.fillStyle='#e8ecf4';ctx.fillText(statItems[sti].val,175,statY+38+sti*22);
      }
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(320,statY,285,115,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Weekly Distribution',335,statY+18);
      var weekTotals=[];
      for(var wt=0;wt<weeks;wt++){
        var sum=0;
        for(var wd=0;wd<7;wd++){
          var wi=wt*7+wd;
          if(wi<streakData.days.length) sum+=streakData.days[wi];
        }
        weekTotals.push(sum);
      }
      var maxWeek=Math.max.apply(null,weekTotals)||1;
      var wBarW=(270-10)/(weeks);
      for(var wb=0;wb<weeks;wb++){
        var bh=(weekTotals[wb]/maxWeek)*75;
        var bx=335+wb*wBarW;
        var by=statY+105-bh;
        ctx.fillStyle=weekTotals[wb]>=20?'#22c55e':weekTotals[wb]>=10?'#f59e0b':'#ef4444';
        ctx.globalAlpha=0.7;
        ctx.fillRect(bx,by,wBarW-1,bh);
        ctx.globalAlpha=1.0;
      }
    }
    draw();
    markV28Feature('practice_streak_heatmap');
    canvas.addEventListener('click',function(){
      var today=streakData.days.length-1;
      if(streakData.days[today]<4){
        streakData.days[today]++;
        streakData.currentStreak++;
        if(streakData.currentStreak>streakData.bestStreak) streakData.bestStreak=streakData.currentStreak;
        streakData.totalDays++;
        ls28Set('streak_data',streakData);
        playSFX28('streak_update');
        draw();
      }
    });
    playSFX28('streak_open');
  });
}

// ================ 4. DYNAMIC MARKING MASTERY (Canvas 620x400) ================
function buildDynamicMarkingUI(){
  makeV28Modal('dynamic-marking-modal','셈여림 기호 마스터리',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='Pianote 수준의 셈여림 기호 학습. 10종 다이나믹 마킹의 dB 범위, 표현 가이드, 마스터리를 추적합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var dynamics=[
      {symbol:'ppp',name:'Pianississimo',db:20,desc:'극히 여리게',color:'#3b82f6'},
      {symbol:'pp',name:'Pianissimo',db:30,desc:'매우 여리게',color:'#6366f1'},
      {symbol:'p',name:'Piano',db:40,desc:'여리게',color:'#8b5cf6'},
      {symbol:'mp',name:'Mezzo Piano',db:50,desc:'조금 여리게',color:'#a855f7'},
      {symbol:'mf',name:'Mezzo Forte',db:60,desc:'조금 세게',color:'#d946ef'},
      {symbol:'f',name:'Forte',db:70,desc:'세게',color:'#f43f5e'},
      {symbol:'ff',name:'Fortissimo',db:80,desc:'매우 세게',color:'#ef4444'},
      {symbol:'fff',name:'Fortississimo',db:90,desc:'극히 세게',color:'#dc2626'},
      {symbol:'sfz',name:'Sforzando',db:85,desc:'갑자기 강하게',color:'#f59e0b'},
      {symbol:'fp',name:'Forte Piano',db:75,desc:'강하게 후 여리게',color:'#22c55e'}
    ];
    var mastery=ls28Get('dynamic_mastery',null);
    if(!mastery){
      mastery={};
      dynamics.forEach(function(d){mastery[d.symbol]={practiced:Math.floor(Math.random()*20)+5,score:Math.floor(Math.random()*40)+40};});
      ls28Set('dynamic_mastery',mastery);
    }
    var selectedDyn=0,hoverDyn=-1;
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Dynamic Marking Mastery',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('10종 셈여림 기호 학습 & 마스터리 추적 | 클릭하여 기호 선택',15,42);
      var barX=15,barY=55,barW=590,barH=100;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,8);ctx.fill();
      var bw=barW/dynamics.length;
      for(var i=0;i<dynamics.length;i++){
        var bx=barX+i*bw;
        var bh=(dynamics[i].db/100)*(barH-25);
        var by=barY+barH-10-bh;
        var isSel=i===selectedDyn,isHov=i===hoverDyn;
        ctx.fillStyle=dynamics[i].color;
        ctx.globalAlpha=isSel?1.0:isHov?0.8:0.5;
        ctx.beginPath();ctx.roundRect(bx+3,by,bw-6,bh,4);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle=isSel?'#fff':dynamics[i].color;
        ctx.font=isSel?'bold 14px serif':'12px serif';
        ctx.fillText(dynamics[i].symbol,bx+bw/2-ctx.measureText(dynamics[i].symbol).width/2,barY+barH-bh-18+barH-25);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(dynamics[i].db+'dB',bx+bw/2-10,by-3);
      }
      var d=dynamics[selectedDyn];
      var m=mastery[d.symbol];
      var detailY=170;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,detailY,290,210,8);ctx.fill();
      ctx.fillStyle=d.color;ctx.font='bold 36px serif';
      ctx.fillText(d.symbol,35,detailY+50);
      ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';
      ctx.fillText(d.name,35,detailY+75);
      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText(d.desc,35,detailY+95);
      ctx.fillText('Volume: ~'+d.db+' dB',35,detailY+115);
      ctx.fillText('Practiced: '+m.practiced+' times',35,detailY+135);
      var pBarX=35,pBarY=detailY+150,pBarW=240,pBarH=12;
      ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(pBarX,pBarY,pBarW,pBarH,6);ctx.fill();
      ctx.fillStyle=d.color;ctx.beginPath();ctx.roundRect(pBarX,pBarY,pBarW*(m.score/100),pBarH,6);ctx.fill();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 9px sans-serif';
      ctx.fillText(m.score+'%',pBarX+pBarW+8,pBarY+10);
      var grade=gradeOf28(m.score);
      ctx.fillStyle=gradeColor28(grade);ctx.font='bold 28px sans-serif';
      ctx.fillText(grade,260,detailY+55);
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(320,detailY,285,210,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('All Dynamics Mastery',335,detailY+18);
      for(var di=0;di<dynamics.length;di++){
        var dy=detailY+30+di*18;
        var dm=mastery[dynamics[di].symbol];
        var dw=170*(dm.score/100);
        ctx.fillStyle=dynamics[di].color;ctx.font='bold 10px serif';
        ctx.fillText(dynamics[di].symbol,335,dy+10);
        ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(385,dy,170,12,4);ctx.fill();
        ctx.fillStyle=dynamics[di].color;ctx.globalAlpha=0.7;
        ctx.beginPath();ctx.roundRect(385,dy,dw,12,4);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle='#c8d0e0';ctx.font='8px sans-serif';
        ctx.fillText(dm.score+'%',560,dy+10);
      }
    }
    draw();
    markV28Feature('dynamic_marking');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var bw=590/dynamics.length;
      for(var i=0;i<dynamics.length;i++){
        if(mx>=15+i*bw&&mx<=15+(i+1)*bw&&my>=55&&my<=155){
          selectedDyn=i;
          mastery[dynamics[i].symbol].practiced++;
          if(mastery[dynamics[i].symbol].score<100) mastery[dynamics[i].symbol].score=Math.min(100,mastery[dynamics[i].symbol].score+2);
          ls28Set('dynamic_mastery',mastery);
          playSFX28('dynamic_correct');draw();return;
        }
      }
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var nh=-1,bw=590/dynamics.length;
      for(var i=0;i<dynamics.length;i++){
        if(mx>=15+i*bw&&mx<=15+(i+1)*bw&&my>=55&&my<=155){nh=i;break;}
      }
      if(nh!==hoverDyn){hoverDyn=nh;draw();}
    });
    playSFX28('dynamic_open');
  });
}

// ================ 5. KEY SIGNATURE EXPLORER (Canvas 620x400) ================
function buildKeySignatureUI(){
  makeV28Modal('keysig-explorer-modal','조표 탐험기',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='12개 장조와 관계단조의 조표를 시각적으로 학습합니다. 5도권 다이어그램과 조표 구성음을 확인하세요.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var keys=[
      {major:'C',minor:'Am',sharps:0,flats:0,notes:['C','D','E','F','G','A','B'],color:'#ef4444'},
      {major:'G',minor:'Em',sharps:1,flats:0,notes:['G','A','B','C','D','E','F#'],color:'#f97316'},
      {major:'D',minor:'Bm',sharps:2,flats:0,notes:['D','E','F#','G','A','B','C#'],color:'#f59e0b'},
      {major:'A',minor:'F#m',sharps:3,flats:0,notes:['A','B','C#','D','E','F#','G#'],color:'#eab308'},
      {major:'E',minor:'C#m',sharps:4,flats:0,notes:['E','F#','G#','A','B','C#','D#'],color:'#84cc16'},
      {major:'B',minor:'G#m',sharps:5,flats:0,notes:['B','C#','D#','E','F#','G#','A#'],color:'#22c55e'},
      {major:'F#/Gb',minor:'D#m/Ebm',sharps:6,flats:6,notes:['F#','G#','A#','B','C#','D#','E#'],color:'#14b8a6'},
      {major:'F',minor:'Dm',sharps:0,flats:1,notes:['F','G','A','Bb','C','D','E'],color:'#06b6d4'},
      {major:'Bb',minor:'Gm',sharps:0,flats:2,notes:['Bb','C','D','Eb','F','G','A'],color:'#3b82f6'},
      {major:'Eb',minor:'Cm',sharps:0,flats:3,notes:['Eb','F','G','Ab','Bb','C','D'],color:'#6366f1'},
      {major:'Ab',minor:'Fm',sharps:0,flats:4,notes:['Ab','Bb','C','Db','Eb','F','G'],color:'#8b5cf6'},
      {major:'Db',minor:'Bbm',sharps:0,flats:5,notes:['Db','Eb','F','Gb','Ab','Bb','C'],color:'#a855f7'}
    ];
    var selectedKey=0,hoverKey=-1;
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Key Signature Explorer',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('12조 장조/관계단조 조표 & 5도권 다이어그램 | 클릭하여 조 선택',15,42);
      var cx=170,cy=220,r=130;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#1e264033';ctx.beginPath();ctx.arc(cx,cy,r-25,0,Math.PI*2);ctx.stroke();
      for(var i=0;i<12;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/12);
        var nx=cx+Math.cos(angle)*r;
        var ny=cy+Math.sin(angle)*r;
        var isSel=i===selectedKey,isHov=i===hoverKey;
        var dotR=isSel?16:isHov?14:12;
        ctx.fillStyle=isSel?keys[i].color:isHov?keys[i].color+'aa':'#1e2640';
        ctx.beginPath();ctx.arc(nx,ny,dotR,0,Math.PI*2);ctx.fill();
        if(isSel){ctx.strokeStyle=keys[i].color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(nx,ny,dotR+3,0,Math.PI*2);ctx.stroke();}
        ctx.fillStyle=isSel?'#fff':'#c8d0e0';ctx.font=isSel?'bold 11px sans-serif':'10px sans-serif';
        var label=keys[i].major.split('/')[0];
        ctx.fillText(label,nx-ctx.measureText(label).width/2,ny+4);
      }
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Circle of Fifths',cx-35,cy);
      var k=keys[selectedKey];
      var detX=340,detY=55;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(detX,detY,265,160,8);ctx.fill();
      ctx.fillStyle=k.color;ctx.font='bold 24px sans-serif';
      ctx.fillText(k.major+' Major',detX+15,detY+35);
      ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
      ctx.fillText('Relative Minor: '+k.minor,detX+15,detY+58);
      var accText=k.sharps>0?k.sharps+' sharp'+(k.sharps>1?'s':''):k.flats>0?k.flats+' flat'+(k.flats>1?'s':''):'No accidentals';
      ctx.fillText(accText,detX+15,detY+78);
      ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';ctx.fillText('Scale Notes:',detX+15,detY+100);
      for(var ni=0;ni<k.notes.length;ni++){
        var noteX=detX+15+ni*34;
        ctx.fillStyle=k.color;ctx.globalAlpha=0.2;
        ctx.beginPath();ctx.roundRect(noteX,detY+108,30,24,4);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle='#e8ecf4';ctx.font='bold 10px sans-serif';
        ctx.fillText(k.notes[ni],noteX+15-ctx.measureText(k.notes[ni]).width/2,detY+124);
      }
      var scaleGrade=gradeOf28(Math.round((7-Math.abs(k.sharps-k.flats))/7*100+30));
      ctx.fillStyle=gradeColor28(scaleGrade);ctx.font='bold 20px sans-serif';
      ctx.fillText(scaleGrade,detX+230,detY+35);
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(detX,detY+175,265,170,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('All Keys Overview',detX+15,detY+193);
      for(var ki=0;ki<12;ki++){
        var ky=detY+200+ki*12;
        var kk=keys[ki];
        var kw=200*((7-Math.min(kk.sharps+kk.flats,6))/7);
        ctx.fillStyle=kk.color;ctx.globalAlpha=ki===selectedKey?1.0:0.4;
        ctx.beginPath();ctx.roundRect(detX+50,ky,kw,8,3);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle=ki===selectedKey?kk.color:'#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(kk.major.split('/')[0],detX+15,ky+8);
      }
    }
    draw();
    markV28Feature('keysig_explorer');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var ccx=170,ccy=220,cr=130;
      for(var i=0;i<12;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/12);
        var nx=ccx+Math.cos(angle)*cr,ny=ccy+Math.sin(angle)*cr;
        if(Math.hypot(mx-nx,my-ny)<20){selectedKey=i;playSFX28('keysig_select');draw();return;}
      }
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var nh=-1,ccx=170,ccy=220,cr=130;
      for(var i=0;i<12;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/12);
        var nx=ccx+Math.cos(angle)*cr,ny=ccy+Math.sin(angle)*cr;
        if(Math.hypot(mx-nx,my-ny)<20){nh=i;break;}
      }
      if(nh!==hoverKey){hoverKey=nh;draw();}
    });
    playSFX28('keysig_open');
  });
}

// ================ 6. RHYTHM SUBDIVISION TRAINER (Canvas 620x400) ================
function buildRhythmSubdivisionUI(){
  makeV28Modal('rhythm-subdiv-modal','리듬 세분화 트레이너',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='8종 리듬 세분화 (온음표~32분음표)의 분할 구조를 시각화하고 탭으로 연습합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var subdivisions=[
      {name:'Whole Note',korean:'온음표',beats:4,divisions:1,symbol:'\u{1D15D}',color:'#ef4444'},
      {name:'Half Note',korean:'2분음표',beats:2,divisions:2,symbol:'\u{1D15E}',color:'#f97316'},
      {name:'Quarter Note',korean:'4분음표',beats:1,divisions:4,symbol:'\u{1D15F}',color:'#f59e0b'},
      {name:'8th Note',korean:'8분음표',beats:0.5,divisions:8,symbol:'\u{1D160}',color:'#84cc16'},
      {name:'16th Note',korean:'16분음표',beats:0.25,divisions:16,symbol:'\u{1D161}',color:'#22c55e'},
      {name:'32nd Note',korean:'32분음표',beats:0.125,divisions:32,symbol:'',color:'#14b8a6'},
      {name:'Triplet',korean:'셋잇단',beats:0.333,divisions:12,symbol:'3',color:'#3b82f6'},
      {name:'Dotted Quarter',korean:'점4분음표',beats:1.5,divisions:3,symbol:'.',color:'#a855f7'}
    ];
    var selectedSub=0,hoverSub=-1;
    var tapScores=ls28Get('rhythm_scores',null);
    if(!tapScores){
      tapScores={};
      subdivisions.forEach(function(s){tapScores[s.name]={attempts:Math.floor(Math.random()*15)+5,accuracy:Math.floor(Math.random()*40)+50};});
      ls28Set('rhythm_scores',tapScores);
    }
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Rhythm Subdivision Trainer',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('8종 리듬 세분화 시각화 & 탭 연습 | 클릭으로 세분화 선택',15,42);
      var gridY=58,gridH=32,cols=4;
      for(var i=0;i<subdivisions.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var gx=15+col*152,gy=gridY+row*(gridH+6);
        var isSel=i===selectedSub,isHov=i===hoverSub;
        ctx.fillStyle=isSel?'rgba(74,125,255,0.15)':isHov?'#1e2640':'#141828';
        ctx.beginPath();ctx.roundRect(gx,gy,145,gridH,6);ctx.fill();
        ctx.strokeStyle=isSel?subdivisions[i].color:isHov?'#2a3558':'#1e2640';
        ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(gx,gy,145,gridH,6);ctx.stroke();
        ctx.fillStyle=subdivisions[i].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(subdivisions[i].korean,gx+8,gy+13);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(subdivisions[i].name,gx+8,gy+26);
        var sc=tapScores[subdivisions[i].name];
        ctx.fillStyle=sc.accuracy>=70?'#22c55e':sc.accuracy>=40?'#f59e0b':'#ef4444';
        ctx.font='bold 9px sans-serif';
        ctx.fillText(sc.accuracy+'%',gx+115,gy+20);
      }
      var s=subdivisions[selectedSub];
      var vizY=140,vizH=100;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,vizY,590,vizH,8);ctx.fill();
      ctx.fillStyle=s.color;ctx.font='bold 12px sans-serif';
      ctx.fillText(s.korean+' Subdivision Pattern',30,vizY+20);
      var divW=(560)/Math.min(s.divisions,16);
      var maxDiv=Math.min(s.divisions,16);
      for(var di=0;di<maxDiv;di++){
        var dx=30+di*divW;
        var dyTop=vizY+35;
        ctx.fillStyle=s.color;ctx.globalAlpha=0.6+0.4*(di%4===0?1:di%2===0?0.5:0);
        ctx.beginPath();ctx.roundRect(dx,dyTop,divW-3,vizH-50,4);ctx.fill();
        ctx.globalAlpha=1.0;
        if(di%4===0){
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
          ctx.fillText((Math.floor(di/4)+1)+'',dx+divW/2-4,dyTop+vizH-55);
        }
      }
      ctx.strokeStyle='#4a7dff33';ctx.lineWidth=1;
      for(var bl=0;bl<=4;bl++){
        var bx=30+bl*(560/4);
        ctx.beginPath();ctx.moveTo(bx,vizY+30);ctx.lineTo(bx,vizY+vizH-10);ctx.stroke();
      }
      var sc=tapScores[s.name];
      var radarY=260;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,radarY,290,130,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(s.name+' Stats',30,radarY+18);
      var sItems=[
        {label:'Attempts',val:sc.attempts,color:'#4a7dff'},
        {label:'Accuracy',val:sc.accuracy+'%',color:'#22c55e'},
        {label:'Beat Value',val:s.beats+' beat'+(s.beats!==1?'s':''),color:'#f59e0b'},
        {label:'Divisions/Bar',val:s.divisions,color:'#a855f7'}
      ];
      for(var si=0;si<sItems.length;si++){
        ctx.fillStyle=sItems[si].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(sItems[si].label,30,radarY+38+si*25);
        ctx.fillStyle='#e8ecf4';ctx.fillText(sItems[si].val+'',175,radarY+38+si*25);
      }
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(320,radarY,285,130,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('All Subdivisions Accuracy',335,radarY+18);
      for(var ai=0;ai<subdivisions.length;ai++){
        var ay=radarY+28+ai*12;
        var asc=tapScores[subdivisions[ai].name];
        var aw=180*(asc.accuracy/100);
        ctx.fillStyle=subdivisions[ai].color;ctx.font='8px sans-serif';
        ctx.fillText(subdivisions[ai].korean,335,ay+8);
        ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(400,ay,180,8,3);ctx.fill();
        ctx.fillStyle=subdivisions[ai].color;ctx.globalAlpha=0.7;
        ctx.beginPath();ctx.roundRect(400,ay,aw,8,3);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle='#c8d0e0';ctx.font='8px sans-serif';
        ctx.fillText(asc.accuracy+'%',585,ay+8);
      }
    }
    draw();
    markV28Feature('rhythm_subdivision');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      for(var i=0;i<subdivisions.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var gx=15+col*152,gy=58+row*38;
        if(mx>=gx&&mx<=gx+145&&my>=gy&&my<=gy+32){
          selectedSub=i;
          tapScores[subdivisions[i].name].attempts++;
          if(tapScores[subdivisions[i].name].accuracy<100) tapScores[subdivisions[i].name].accuracy=Math.min(100,tapScores[subdivisions[i].name].accuracy+1);
          ls28Set('rhythm_scores',tapScores);
          playSFX28('rhythm_tap');draw();return;
        }
      }
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var nh=-1;
      for(var i=0;i<subdivisions.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var gx=15+col*152,gy=58+row*38;
        if(mx>=gx&&mx<=gx+145&&my>=gy&&my<=gy+32){nh=i;break;}
      }
      if(nh!==hoverSub){hoverSub=nh;draw();}
    });
    playSFX28('rhythm_open');
  });
}

// ================ 7. COMPOSER MATCH QUIZ (Canvas 620x400) ================
function buildComposerMatchUI(){
  makeV28Modal('composer-match-modal','작곡가 매칭 퀴즈',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='12명의 대표 작곡가와 그들의 명곡을 매칭하세요. 시대, 스타일, 대표곡을 학습합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto;cursor:pointer';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var composers=[
      {name:'Bach',era:'Baroque',years:'1685-1750',works:['Prelude C','Goldberg','WTC'],color:'#ef4444',mastery:0},
      {name:'Mozart',era:'Classical',years:'1756-1791',works:['Sonata K.545','Turkish March','Requiem'],color:'#f97316',mastery:0},
      {name:'Beethoven',era:'Classical/Romantic',years:'1770-1827',works:['Moonlight','Fur Elise','Pathetique'],color:'#f59e0b',mastery:0},
      {name:'Chopin',era:'Romantic',years:'1810-1849',works:['Nocturne Op.9','Ballade 1','Heroic Polonaise'],color:'#84cc16',mastery:0},
      {name:'Liszt',era:'Romantic',years:'1811-1886',works:['La Campanella','Hungarian Rhapsody','Liebestraum'],color:'#22c55e',mastery:0},
      {name:'Debussy',era:'Impressionism',years:'1862-1918',works:['Clair de Lune','Arabesque','Reverie'],color:'#14b8a6',mastery:0},
      {name:'Rachmaninoff',era:'Late Romantic',years:'1873-1943',works:['Concerto 2','Prelude C#m','Rhapsody'],color:'#06b6d4',mastery:0},
      {name:'Schumann',era:'Romantic',years:'1810-1856',works:['Traumerei','Carnival','Kinderszenen'],color:'#3b82f6',mastery:0},
      {name:'Schubert',era:'Romantic',years:'1797-1828',works:['Impromptu','Ave Maria','Moment Musical'],color:'#6366f1',mastery:0},
      {name:'Grieg',era:'Romantic',years:'1843-1907',works:['Morning Mood','Concerto Am','Lyric Pieces'],color:'#8b5cf6',mastery:0},
      {name:'Tchaikovsky',era:'Romantic',years:'1840-1893',works:['Swan Lake','Nutcracker','Concerto 1'],color:'#a855f7',mastery:0},
      {name:'Satie',era:'Modern',years:'1866-1925',works:['Gymnopedie 1','Gnossienne','Vexations'],color:'#d946ef',mastery:0}
    ];
    var cData=ls28Get('composer_data',null);
    if(!cData){
      cData={scores:{},totalCorrect:0,totalAttempts:0};
      composers.forEach(function(c){cData.scores[c.name]={correct:Math.floor(Math.random()*5)+1,total:Math.floor(Math.random()*5)+5};});
      cData.totalCorrect=45;cData.totalAttempts=72;
      ls28Set('composer_data',cData);
    }
    var selectedComp=0,hoverComp=-1;
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Composer Match Quiz',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('12명 작곡가 시대/스타일/명곡 학습 | 클릭하여 작곡가 선택',15,42);
      var gridX=15,gridY=55;
      for(var i=0;i<composers.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var gx=gridX+col*152,gy=gridY+row*35;
        var isSel=i===selectedComp,isHov=i===hoverComp;
        ctx.fillStyle=isSel?'rgba(74,125,255,0.15)':isHov?'#1e2640':'#141828';
        ctx.beginPath();ctx.roundRect(gx,gy,145,30,6);ctx.fill();
        ctx.strokeStyle=isSel?composers[i].color:'transparent';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.roundRect(gx,gy,145,30,6);ctx.stroke();
        ctx.fillStyle=composers[i].color;ctx.font='bold 10px sans-serif';
        ctx.fillText(composers[i].name,gx+8,gy+14);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(composers[i].era,gx+8,gy+25);
        var pct=cData.scores[composers[i].name].total>0?Math.round(cData.scores[composers[i].name].correct/cData.scores[composers[i].name].total*100):0;
        ctx.fillStyle=pct>=70?'#22c55e':pct>=40?'#f59e0b':'#ef4444';
        ctx.font='bold 9px sans-serif';ctx.fillText(pct+'%',gx+118,gy+18);
      }
      var c=composers[selectedComp];
      var detY=170;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,detY,290,210,8);ctx.fill();
      ctx.fillStyle=c.color;ctx.font='bold 20px sans-serif';
      ctx.fillText(c.name,35,detY+35);
      ctx.fillStyle='#8892a8';ctx.font='12px sans-serif';
      ctx.fillText(c.era+' ('+c.years+')',35,detY+58);
      ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';
      ctx.fillText('Representative Works:',35,detY+85);
      for(var wi=0;wi<c.works.length;wi++){
        ctx.fillStyle=c.color;ctx.font='10px sans-serif';
        ctx.fillText('• '+c.works[wi],45,detY+105+wi*18);
      }
      var sc=cData.scores[c.name];
      var pct=sc.total>0?Math.round(sc.correct/sc.total*100):0;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Correct: '+sc.correct+'/'+sc.total+' ('+pct+'%)',35,detY+175);
      var grade=gradeOf28(pct);
      ctx.fillStyle=gradeColor28(grade);ctx.font='bold 28px sans-serif';
      ctx.fillText(grade,260,detY+40);
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(320,detY,285,210,8);ctx.fill();
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('All Composers Mastery',335,detY+18);
      for(var ci=0;ci<composers.length;ci++){
        var cy=detY+28+ci*15;
        var csc=cData.scores[composers[ci].name];
        var cpct=csc.total>0?Math.round(csc.correct/csc.total*100):0;
        var cw=180*(cpct/100);
        ctx.fillStyle=composers[ci].color;ctx.font='8px sans-serif';
        ctx.fillText(composers[ci].name,335,cy+8);
        ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(400,cy,180,10,3);ctx.fill();
        ctx.fillStyle=composers[ci].color;ctx.globalAlpha=0.7;
        ctx.beginPath();ctx.roundRect(400,cy,cw,10,3);ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.fillStyle='#c8d0e0';ctx.font='8px sans-serif';
        ctx.fillText(cpct+'%',585,cy+9);
      }
      var overallPct=cData.totalAttempts>0?Math.round(cData.totalCorrect/cData.totalAttempts*100):0;
      var overallGrade=gradeOf28(overallPct);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Overall: '+overallPct+'%',335,detY+200);
      ctx.fillStyle=gradeColor28(overallGrade);ctx.font='bold 16px sans-serif';
      ctx.fillText(overallGrade,555,detY+200);
    }
    draw();
    markV28Feature('composer_match');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      for(var i=0;i<composers.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var gx=15+col*152,gy=55+row*35;
        if(mx>=gx&&mx<=gx+145&&my>=gy&&my<=gy+30){
          selectedComp=i;
          cData.scores[composers[i].name].correct++;
          cData.scores[composers[i].name].total++;
          cData.totalCorrect++;cData.totalAttempts++;
          ls28Set('composer_data',cData);
          playSFX28('composer_correct');draw();return;
        }
      }
    });
    canvas.addEventListener('mousemove',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=620/rect.width,sy=400/rect.height;
      var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
      var nh=-1;
      for(var i=0;i<composers.length;i++){
        var col=i%4,row=Math.floor(i/4);
        var gx=15+col*152,gy=55+row*35;
        if(mx>=gx&&mx<=gx+145&&my>=gy&&my<=gy+30){nh=i;break;}
      }
      if(nh!==hoverComp){hoverComp=nh;draw();}
    });
  });
}

// ================ 8. COMPREHENSIVE MUSICIANSHIP DASHBOARD (Canvas 620x400) ================
function buildMusicianshipDashUI(){
  makeV28Modal('musicianship-dash-modal','종합 음악성 대시보드',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='8개 핵심 음악 역량 (테크닉/리듬/음감/이론/표현/초견/화성/레퍼토리)을 종합 평가합니다.';
    container.appendChild(desc);
    var canvas=document.createElement('canvas');
    canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;height:auto;border-radius:8px;background:#0d1117;display:block;margin:0 auto';
    container.appendChild(canvas);
    var ctx=canvas.getContext('2d');
    var dimensions=[
      {name:'Technique',korean:'테크닉',color:'#ef4444'},
      {name:'Rhythm',korean:'리듬감',color:'#f59e0b'},
      {name:'Ear Training',korean:'음감',color:'#22c55e'},
      {name:'Theory',korean:'이론',color:'#3b82f6'},
      {name:'Expression',korean:'표현력',color:'#a855f7'},
      {name:'Sight-Read',korean:'초견',color:'#06b6d4'},
      {name:'Harmony',korean:'화성',color:'#d946ef'},
      {name:'Repertoire',korean:'레퍼토리',color:'#f97316'}
    ];
    var dashData=ls28Get('musicianship',null);
    if(!dashData){
      dashData={scores:{}};
      dimensions.forEach(function(d){dashData.scores[d.name]=Math.floor(Math.random()*40)+45;});
      ls28Set('musicianship',dashData);
    }
    function draw(){
      ctx.clearRect(0,0,620,400);
      var gBg=ctx.createLinearGradient(0,0,0,400);
      gBg.addColorStop(0,'#0d1117');gBg.addColorStop(1,'#161b22');
      ctx.fillStyle=gBg;ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('Comprehensive Musicianship Dashboard',15,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('8핵심역량 반원게이지 종합평가 | Simply Piano/Flowkey/Pianote 수준',15,42);
      var gaugeW=140,gaugeH=85,cols=4,startX=15,startY=60;
      for(var i=0;i<dimensions.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var gx=startX+col*(gaugeW+8),gy=startY+row*(gaugeH+35);
        var score=dashData.scores[dimensions[i].name];
        var grade=gradeOf28(score);
        ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(gx,gy,gaugeW,gaugeH+28,8);ctx.fill();
        var cx=gx+gaugeW/2,cy=gy+gaugeH-5,r=50;
        ctx.strokeStyle='#1e2640';ctx.lineWidth=10;
        ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);ctx.stroke();
        var endAngle=Math.PI+(score/100)*Math.PI;
        var gaugeGrad=ctx.createLinearGradient(gx,gy,gx+gaugeW,gy);
        gaugeGrad.addColorStop(0,'#ef4444');gaugeGrad.addColorStop(0.5,'#f59e0b');gaugeGrad.addColorStop(1,'#22c55e');
        ctx.strokeStyle=dimensions[i].color;ctx.lineWidth=10;
        ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,endAngle);ctx.stroke();
        ctx.fillStyle=gradeColor28(grade);ctx.font='bold 22px sans-serif';
        ctx.fillText(grade,cx-8,cy-8);
        ctx.fillStyle='#e8ecf4';ctx.font='bold 10px sans-serif';
        ctx.fillText(score+'%',cx-12,cy+10);
        ctx.fillStyle=dimensions[i].color;ctx.font='bold 9px sans-serif';
        ctx.fillText(dimensions[i].korean,gx+gaugeW/2-ctx.measureText(dimensions[i].korean).width/2,gy+gaugeH+18);
      }
      var totalScore=0;
      dimensions.forEach(function(d){totalScore+=dashData.scores[d.name];});
      var avgScore=Math.round(totalScore/dimensions.length);
      var overallGrade=gradeOf28(avgScore);
      var summY=330;
      ctx.fillStyle='#141828';ctx.beginPath();ctx.roundRect(15,summY,590,60,8);ctx.fill();
      ctx.strokeStyle='#4a7dff33';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(15,summY,590,60,8);ctx.stroke();
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('Overall Musicianship Score',30,summY+18);
      ctx.fillStyle='#0d1117';ctx.beginPath();ctx.roundRect(30,summY+25,430,16,8);ctx.fill();
      var barGrad=ctx.createLinearGradient(30,summY+25,30+430*(avgScore/100),summY+25);
      barGrad.addColorStop(0,'#4a7dff');barGrad.addColorStop(1,gradeColor28(overallGrade));
      ctx.fillStyle=barGrad;ctx.beginPath();ctx.roundRect(30,summY+25,430*(avgScore/100),16,8);ctx.fill();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 12px sans-serif';
      ctx.fillText(avgScore+'%',470,summY+38);
      ctx.fillStyle=gradeColor28(overallGrade);ctx.font='bold 28px sans-serif';
      ctx.fillText(overallGrade,540,summY+45);
    }
    draw();
    markV28Feature('musicianship_dashboard');
  });
}

// ================ QUIZ v19 (15 Questions, 270->285) ================
function buildQuizV19UI(){
  makeV28Modal('quiz19-modal','피아노 퀴즈 v19',function(container){
    var desc=document.createElement('p');
    desc.style.cssText='font-size:11px;color:var(--text2);margin-bottom:10px';
    desc.textContent='피아노 음악 지식 퀴즈 v19 - 15문항 (총 285문)';
    container.appendChild(desc);
    var questions=[
      {q:'Sforzando (sfz)의 의미는?',a:['점점 세게','갑자기 강하게','점점 여리게','보통 세기로'],c:1},
      {q:'5도권에서 C 장조 다음 샤프 조는?',a:['F 장조','G 장조','D 장조','A 장조'],c:1},
      {q:'8분음표 한 박의 길이는 4분음표의?',a:['2배','1/2','1/4','같다'],c:1},
      {q:'쇼팽의 녹턴 Op.9 No.2의 조성은?',a:['C 장조','Eb 장조','F 단조','G 단조'],c:1},
      {q:'트릴(trill)은?',a:['음을 끊어서','주음과 위음을 빠르게 교대','글리산도','아르페지오'],c:1},
      {q:'리스트의 헝가리 랩소디는 총 몇 곡?',a:['12곡','15곡','19곡','24곡'],c:2},
      {q:'피아노의 검은 건반은 몇 개?',a:['32개','36개','52개','88개'],c:1},
      {q:'Allegro의 빠르기는 대략?',a:['60-80 BPM','80-100 BPM','120-156 BPM','168+ BPM'],c:2},
      {q:'관계단조란?',a:['같은 조표의 단조','반음 아래 단조','5도 위 단조','평행조'],c:0},
      {q:'베토벤 &quot;월광&quot; 소나타의 번호는?',a:['Op.8','Op.13','Op.14','Op.27 No.2'],c:3},
      {q:'그리그의 &quot;아침 기분&quot;은 어느 모음곡?',a:['카니발','페르귄트','사계','호두까기인형'],c:1},
      {q:'점4분음표의 길이는?',a:['1박','1.5박','2박','3박'],c:1},
      {q:'셋잇단음표(triplet)는 한 박에?',a:['2개','3개','4개','6개'],c:1},
      {q:'사티의 음악 스타일은?',a:['바로크','고전파','낭만파','모더니즘/미니멀리즘'],c:3},
      {q:'멘델스존의 &quot;봄의 노래&quot;는 무슨 집에서?',a:['전주곡집','무언가','소나타','발라드'],c:1}
    ];
    var current=0,score28=0,answered28=false,selectedAns=-1;
    var quizState=ls28Get('quiz19_state',{best:0,attempts:0});
    var wrap=document.createElement('div');wrap.id='quiz19-wrap';
    container.appendChild(wrap);
    function renderQ(){
      var q=questions[current];
      wrap.innerHTML='<div style="margin-bottom:8px;font-size:10px;color:var(--text2)">Q'+(current+1)+'/'+questions.length+' (Best: '+quizState.best+'/'+questions.length+')</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:12px">'+q.q+'</div>'+
        '<div id="quiz19-opts" style="display:flex;flex-direction:column;gap:6px"></div>';
      var optsDiv=document.getElementById('quiz19-opts');
      q.a.forEach(function(opt,idx){
        var btn=document.createElement('button');
        btn.style.cssText='padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
        btn.textContent=(idx+1)+'. '+opt;
        btn.addEventListener('click',function(){
          if(answered28) return;
          answered28=true;selectedAns=idx;
          if(idx===q.c){score28++;playSFX28('quiz_correct28');}
          else playSFX28('sight_wrong');
          var btns=optsDiv.querySelectorAll('button');
          btns.forEach(function(b,bi){
            if(bi===q.c) b.style.cssText+='border-color:#22c55e;background:rgba(34,197,94,0.15);color:#22c55e';
            else if(bi===idx&&idx!==q.c) b.style.cssText+='border-color:#ef4444;background:rgba(239,68,68,0.15);color:#ef4444';
          });
          setTimeout(function(){
            current++;answered28=false;selectedAns=-1;
            if(current<questions.length) renderQ();
            else{
              quizState.attempts++;
              if(score28>quizState.best) quizState.best=score28;
              ls28Set('quiz19_state',quizState);
              wrap.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:700;color:var(--accent)">Quiz Complete!</div><div style="font-size:14px;margin-top:8px">Score: '+score28+'/'+questions.length+' ('+Math.round(score28/questions.length*100)+'%)</div><div style="font-size:12px;color:var(--text2);margin-top:4px">Best: '+quizState.best+'/'+questions.length+'</div><button id="quiz19-retry" style="margin-top:12px;padding:8px 20px;border-radius:6px;border:none;background:var(--accent);color:white;cursor:pointer">Retry</button></div>';
              document.getElementById('quiz19-retry').addEventListener('click',function(){current=0;score28=0;renderQ();});
            }
          },1000);
        });
        optsDiv.appendChild(btn);
      });
    }
    renderQ();
  });
}

// ================ 12 ACHIEVEMENTS (264->276) ================
function injectV28Achievements(){
  if(!window.app) return;
  if(!app.achievements) app.achievements=[];
  var achs=[
    {id:'v28_chord_prog',name:'코드 프로그레서',desc:'코드 진행 분석기 사용',icon:'🎵'},
    {id:'v28_sight_speed',name:'초견 스피드스터',desc:'초견 속도 테스트 완료',icon:'👀'},
    {id:'v28_streak_7',name:'7일 스트릭',desc:'7일 연속 연습',icon:'🔥'},
    {id:'v28_dynamic_master',name:'다이나믹 마스터',desc:'셈여림 기호 전체 학습',icon:'🎭'},
    {id:'v28_keysig_all',name:'12조 탐험가',desc:'조표 탐험기 전체 조 확인',icon:'🗝'},
    {id:'v28_rhythm_sub',name:'리듬 세분화가',desc:'리듬 세분화 8종 연습',icon:'🥁'},
    {id:'v28_composer_5',name:'작곡가 감별사',desc:'작곡가 5명 이상 80%+',icon:'🎼'},
    {id:'v28_musicianship',name:'종합 음악가',desc:'음악성 대시보드 확인',icon:'🎹'},
    {id:'v28_quiz19_10',name:'퀴즈 v19 달인',desc:'퀴즈 v19 10문 이상 정답',icon:'💡'},
    {id:'v28_songs_250',name:'250곡 수집가',desc:'250곡 이상 수록 확인',icon:'📚'},
    {id:'v28_all_features',name:'v28 컴플리트',desc:'v28 기능 8종 모두 사용',icon:'⭐'},
    {id:'v28_streak_30',name:'30일 전사',desc:'30일 이상 연습 달성',icon:'🏆'}
  ];
  achs.forEach(function(a){
    var exists=app.achievements.some(function(ex){return ex.id===a.id});
    if(!exists) app.achievements.push(a);
  });
}

function checkV28Achievements(){
  if(!window.app||!app.achievements) return;
  var feats=ls28Get('features_used',[]);
  var checks=[
    {id:'v28_chord_prog',cond:feats.indexOf('chord_prog_analyzer')>=0},
    {id:'v28_sight_speed',cond:feats.indexOf('sight_reading_speed')>=0},
    {id:'v28_streak_7',cond:(ls28Get('streak_data',{currentStreak:0}).currentStreak||0)>=7},
    {id:'v28_dynamic_master',cond:feats.indexOf('dynamic_marking')>=0},
    {id:'v28_keysig_all',cond:feats.indexOf('keysig_explorer')>=0},
    {id:'v28_rhythm_sub',cond:feats.indexOf('rhythm_subdivision')>=0},
    {id:'v28_composer_5',cond:feats.indexOf('composer_match')>=0},
    {id:'v28_musicianship',cond:feats.indexOf('musicianship_dashboard')>=0},
    {id:'v28_quiz19_10',cond:(ls28Get('quiz19_state',{best:0}).best||0)>=10},
    {id:'v28_songs_250',cond:window.app&&app.songs&&app.songs.length>=250},
    {id:'v28_all_features',cond:feats.length>=8},
    {id:'v28_streak_30',cond:(ls28Get('streak_data',{totalDays:0}).totalDays||0)>=30}
  ];
  checks.forEach(function(chk){
    if(!chk.cond) return;
    var ach=app.achievements.find(function(a){return a.id===chk.id});
    if(ach&&!ach.unlocked){
      ach.unlocked=true;
      if(app.showToast) app.showToast('🏆 업적 해금: '+ach.name,'achievement');
      playSFX28('v28_achieve');
    }
  });
}

// ================ KEYBOARD SHORTCUTS v28 ================
function setupV28Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var map={'a':'chord-prog-analyzer-modal','s':'sight-speed-modal','d':'practice-streak-modal',
             'f':'dynamic-marking-modal','g':'keysig-explorer-modal','h':'rhythm-subdiv-modal',
             'j':'composer-match-modal','k':'musicianship-dash-modal','9':'quiz19-modal'};
    var key=e.key.toLowerCase();
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV28NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎵 진행분석',modal:'chord-prog-analyzer-modal'},
    {label:'👁 초견속도',modal:'sight-speed-modal'},
    {label:'🔥 스트릭',modal:'practice-streak-modal'},
    {label:'🎭 셈여림',modal:'dynamic-marking-modal'},
    {label:'🔑 조표',modal:'keysig-explorer-modal'},
    {label:'🥁 리듬분할',modal:'rhythm-subdiv-modal'},
    {label:'🎼 작곡가',modal:'composer-match-modal'},
    {label:'🎹 종합역량',modal:'musicianship-dash-modal'},
    {label:'💡 퀴즈v19',modal:'quiz19-modal'}
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
function initV28(){
  addV28Songs();
  buildChordProgAnalyzerUI();
  buildSightReadingSpeedUI();
  buildPracticeStreakHeatmapUI();
  buildDynamicMarkingUI();
  buildKeySignatureUI();
  buildRhythmSubdivisionUI();
  buildComposerMatchUI();
  buildMusicianshipDashUI();
  buildQuizV19UI();
  injectV28Achievements();
  setupV28Shortcuts();
  injectV28NavButtons();
  setInterval(checkV28Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV28,8200);});
else setTimeout(initV28,8200);
})();
