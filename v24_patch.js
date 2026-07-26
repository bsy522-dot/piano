// Piano Master v24 Patch Module
// Finger Independence Trainer, Era Masterclass Guide, Tempo Adaptation Analyzer, Key Touch Sensitivity,
// Music Theory Mastery Tree, Practice Efficiency Dashboard, Pianist Technique Comparator, Emotion Color Mapper
// 10 Songs (202->212), Quiz v15 15Q (210->225), 12 Achievements (216->228), SFX 16, Keyboard 8+1
(function(){
'use strict';
if(window.__v24Loaded) return;
window.__v24Loaded = true;

var LS24 = 'piano-v24-';
function ls24Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS24+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls24Set(k,v){localStorage.setItem(LS24+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v24 (16 sounds) ================
var sfx24 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone24(freq,type,dur,gainVal,delayMs){
  if(!sfx24) return;
  setTimeout(function(){
    if(!sfx24) return;
    var t=sfx24.currentTime,g=sfx24.createGain(),o=sfx24.createOscillator();
    o.connect(g);g.connect(sfx24.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX24(type){
  if(!sfx24) return;
  if(sfx24.state==='suspended') sfx24.resume();
  switch(type){
    case 'finger_tap': tone24(440,'triangle',0.08,0.06,0); break;
    case 'finger_drill': tone24(523,'triangle',0.1,0.07,0); tone24(659,'triangle',0.1,0.07,70); tone24(784,'triangle',0.15,0.07,140); break;
    case 'era_select': tone24(392,'sine',0.12,0.06,0); break;
    case 'era_compare': tone24(349,'triangle',0.12,0.06,0); tone24(440,'triangle',0.15,0.06,90); break;
    case 'tempo_tap': tone24(698,'square',0.05,0.05,0); break;
    case 'tempo_grade': tone24(523,'triangle',0.1,0.07,0); tone24(659,'triangle',0.12,0.07,80); tone24(880,'triangle',0.2,0.07,160); break;
    case 'touch_scan': tone24(330,'sine',0.1,0.06,0); break;
    case 'touch_grade': tone24(494,'triangle',0.1,0.06,0); tone24(659,'triangle',0.12,0.06,80); break;
    case 'theory_unlock': tone24(523,'triangle',0.08,0.06,0); tone24(659,'triangle',0.08,0.06,80); tone24(784,'triangle',0.12,0.06,160); break;
    case 'theory_master': tone24(392,'triangle',0.1,0.08,0); tone24(523,'triangle',0.12,0.08,80); tone24(659,'triangle',0.12,0.08,160); tone24(784,'triangle',0.2,0.08,240); break;
    case 'efficiency_calc': tone24(440,'sine',0.15,0.06,0); tone24(554,'sine',0.15,0.06,100); break;
    case 'pianist_select': tone24(262,'triangle',0.12,0.05,0); tone24(330,'triangle',0.12,0.05,70); break;
    case 'pianist_compare': tone24(392,'triangle',0.1,0.05,0); tone24(494,'triangle',0.1,0.05,70); tone24(587,'triangle',0.15,0.05,140); break;
    case 'emotion_map': tone24(349,'sine',0.12,0.05,0); tone24(440,'sine',0.12,0.05,80); break;
    case 'v24_achieve': tone24(523,'triangle',0.1,0.1,0); tone24(659,'triangle',0.12,0.1,80); tone24(784,'triangle',0.12,0.1,160); tone24(1047,'triangle',0.25,0.1,240); break;
    case 'quiz_correct24': tone24(659,'triangle',0.1,0.07,0); tone24(784,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v24 ================
function makeV24Modal(id, title, contentFn){
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

function markV24Feature(name){
  var used=ls24Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls24Set('features_used',used);}
}

function gradeOf24(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}
function gradeColor24(g){return g==='S'?'#ffd700':g==='A'?'#4a7dff':g==='B'?'#36d399':g==='C'?'#f59e0b':'#ef4444';}

// ================ 10 NEW SONGS (202->212) ================
function addV24Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s203',name:'라흐마니노프 전주곡 Op.3-2',category:'클래식',difficulty:'expert',
     notes:[{note:'C#3',time:0,dur:0.8},{note:'C#4',time:0.8,dur:0.8},{note:'G#3',time:1.6,dur:0.4},{note:'E4',time:2.0,dur:0.4},{note:'C#4',time:2.4,dur:0.4},{note:'G#4',time:2.8,dur:0.8},{note:'F#4',time:3.6,dur:0.4},{note:'E4',time:4.0,dur:0.4},{note:'D#4',time:4.4,dur:0.4},{note:'C#4',time:4.8,dur:0.4},{note:'B3',time:5.2,dur:0.4},{note:'C#4',time:5.6,dur:1.0}]},
    {id:'s204',name:'모차르트 터키 행진곡',category:'클래식',difficulty:'medium',
     notes:[{note:'B4',time:0,dur:0.15},{note:'A4',time:0.15,dur:0.15},{note:'G#4',time:0.3,dur:0.15},{note:'A4',time:0.45,dur:0.3},{note:'C5',time:0.75,dur:0.3},{note:'B4',time:1.05,dur:0.15},{note:'A4',time:1.2,dur:0.15},{note:'G#4',time:1.35,dur:0.15},{note:'A4',time:1.5,dur:0.3},{note:'D5',time:1.8,dur:0.3},{note:'C5',time:2.1,dur:0.15},{note:'B4',time:2.25,dur:0.15}]},
    {id:'s205',name:'쇼팽 영웅 폴로네이즈',category:'클래식',difficulty:'expert',
     notes:[{note:'Ab3',time:0,dur:0.2},{note:'Eb4',time:0.2,dur:0.2},{note:'Ab4',time:0.4,dur:0.2},{note:'C5',time:0.6,dur:0.4},{note:'Bb4',time:1.0,dur:0.2},{note:'Ab4',time:1.2,dur:0.2},{note:'G4',time:1.4,dur:0.2},{note:'Ab4',time:1.6,dur:0.4},{note:'Bb4',time:2.0,dur:0.2},{note:'C5',time:2.2,dur:0.2},{note:'Eb5',time:2.4,dur:0.4},{note:'Ab4',time:2.8,dur:0.6}]},
    {id:'s206',name:'리스트 사랑의 꿈 3번',category:'클래식',difficulty:'hard',
     notes:[{note:'Ab4',time:0,dur:0.6},{note:'C5',time:0.6,dur:0.4},{note:'Eb5',time:1.0,dur:0.6},{note:'Db5',time:1.6,dur:0.4},{note:'C5',time:2.0,dur:0.4},{note:'Bb4',time:2.4,dur:0.4},{note:'Ab4',time:2.8,dur:0.6},{note:'G4',time:3.4,dur:0.4},{note:'Ab4',time:3.8,dur:0.4},{note:'Bb4',time:4.2,dur:0.4},{note:'C5',time:4.6,dur:0.6},{note:'Ab4',time:5.2,dur:1.0}]},
    {id:'s207',name:'베토벤 비창 소나타 2악장',category:'클래식',difficulty:'medium',
     notes:[{note:'Ab3',time:0,dur:0.5},{note:'C4',time:0.5,dur:0.5},{note:'Eb4',time:1.0,dur:0.5},{note:'Ab4',time:1.5,dur:1.0},{note:'G4',time:2.5,dur:0.5},{note:'F4',time:3.0,dur:0.5},{note:'Eb4',time:3.5,dur:0.5},{note:'Db4',time:4.0,dur:0.5},{note:'C4',time:4.5,dur:0.5},{note:'Bb3',time:5.0,dur:0.5},{note:'Ab3',time:5.5,dur:0.5},{note:'Eb4',time:6.0,dur:1.0}]},
    {id:'s208',name:'드뷔시 아라베스크 1번',category:'클래식',difficulty:'medium',
     notes:[{note:'E4',time:0,dur:0.3},{note:'F#4',time:0.3,dur:0.3},{note:'G#4',time:0.6,dur:0.3},{note:'A4',time:0.9,dur:0.3},{note:'B4',time:1.2,dur:0.3},{note:'C#5',time:1.5,dur:0.6},{note:'B4',time:2.1,dur:0.3},{note:'A4',time:2.4,dur:0.3},{note:'G#4',time:2.7,dur:0.3},{note:'F#4',time:3.0,dur:0.3},{note:'E4',time:3.3,dur:0.3},{note:'C#4',time:3.6,dur:0.8}]},
    {id:'s209',name:'그리그 피아노 협주곡 1악장',category:'클래식',difficulty:'hard',
     notes:[{note:'A4',time:0,dur:0.3},{note:'G#4',time:0.3,dur:0.3},{note:'A4',time:0.6,dur:0.3},{note:'E4',time:0.9,dur:0.5},{note:'C4',time:1.4,dur:0.3},{note:'E4',time:1.7,dur:0.3},{note:'A3',time:2.0,dur:0.8},{note:'G#3',time:2.8,dur:0.3},{note:'A3',time:3.1,dur:0.3},{note:'E4',time:3.4,dur:0.4},{note:'C5',time:3.8,dur:0.4},{note:'A4',time:4.2,dur:1.0}]},
    {id:'s210',name:'슈만 트로이메라이',category:'클래식',difficulty:'easy',
     notes:[{note:'F4',time:0,dur:0.6},{note:'A4',time:0.6,dur:0.4},{note:'C5',time:1.0,dur:0.4},{note:'F5',time:1.4,dur:0.8},{note:'E5',time:2.2,dur:0.4},{note:'D5',time:2.6,dur:0.4},{note:'C5',time:3.0,dur:0.6},{note:'Bb4',time:3.6,dur:0.4},{note:'A4',time:4.0,dur:0.4},{note:'G4',time:4.4,dur:0.4},{note:'F4',time:4.8,dur:0.4},{note:'A4',time:5.2,dur:1.0}]},
    {id:'s211',name:'사티 그노시엔느 1번',category:'클래식',difficulty:'easy',
     notes:[{note:'D4',time:0,dur:0.4},{note:'E4',time:0.4,dur:0.4},{note:'F4',time:0.8,dur:0.4},{note:'D4',time:1.2,dur:0.4},{note:'Bb4',time:1.6,dur:0.8},{note:'A4',time:2.4,dur:0.4},{note:'G4',time:2.8,dur:0.4},{note:'F4',time:3.2,dur:0.4},{note:'E4',time:3.6,dur:0.4},{note:'D4',time:4.0,dur:0.4},{note:'F4',time:4.4,dur:0.4},{note:'A3',time:4.8,dur:1.0}]},
    {id:'s212',name:'바흐 인벤션 1번',category:'클래식',difficulty:'medium',
     notes:[{note:'C4',time:0,dur:0.15},{note:'D4',time:0.15,dur:0.15},{note:'E4',time:0.3,dur:0.15},{note:'F4',time:0.45,dur:0.15},{note:'D4',time:0.6,dur:0.15},{note:'E4',time:0.75,dur:0.15},{note:'C4',time:0.9,dur:0.3},{note:'G4',time:1.2,dur:0.15},{note:'A4',time:1.35,dur:0.15},{note:'B4',time:1.5,dur:0.15},{note:'C5',time:1.65,dur:0.15},{note:'A4',time:1.8,dur:0.15}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ RADAR CHART HELPER v24 ================
function drawRadar24(ctx,cx,cy,r,labels,values,maxVal,color,fillAlpha){
  var n=labels.length;
  ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
  for(var ring=1;ring<=4;ring++){
    ctx.beginPath();
    for(var i=0;i<=n;i++){
      var a=-Math.PI/2+(i%n)*(Math.PI*2/n);
      var rr=r*ring/4;
      var x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  for(var j=0;j<n;j++){
    var ang=-Math.PI/2+j*(Math.PI*2/n);
    ctx.strokeStyle='#2a3050';
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);ctx.stroke();
    ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
    var lx=cx+Math.cos(ang)*(r+18),ly=cy+Math.sin(ang)*(r+18);
    ctx.fillText(labels[j],lx,ly);
  }
  ctx.beginPath();
  for(j=0;j<n;j++){
    var a2=-Math.PI/2+j*(Math.PI*2/n);
    var val=Math.min(values[j],maxVal)/maxVal;
    var px=cx+Math.cos(a2)*r*val,py=cy+Math.sin(a2)*r*val;
    if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fillStyle=color.replace('1)',fillAlpha+')');ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();
}

// ================ 1. FINGER INDEPENDENCE TRAINER Canvas 620x400 ================
function buildFingerIndependenceUI(){
  var DRILLS=[
    {name:'트릴 (2-3)',desc:'검지-중지 교대 반복',fingers:[2,3],diff:40},
    {name:'트릴 (4-5)',desc:'약지-새끼 교대',fingers:[4,5],diff:70},
    {name:'크로스핸드',desc:'양손 교차 패턴',fingers:[1,2,3,4,5],diff:65},
    {name:'폴리리듬 2:3',desc:'왼2 오른3 동시',fingers:[1,2,3],diff:80},
    {name:'독립 레가토',desc:'한손 레가토+한손 스타카토',fingers:[1,3,5],diff:55},
    {name:'옥타브 트레몰로',desc:'1-5 빠른 반복',fingers:[1,5],diff:60},
    {name:'스케일 3도',desc:'3도 간격 스케일',fingers:[1,2,3,4],diff:50},
    {name:'아르페지오 확장',desc:'넓은 아르페지오 패턴',fingers:[1,2,3,5],diff:75}
  ];
  makeV24Modal('finger-indep-modal','손가락 독립성 트레이너',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selDrill=0;
    var scores=ls24Get('finger_scores',DRILLS.map(function(){return Math.floor(Math.random()*40+30)}));
    var history=ls24Get('finger_history',[]);
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('손가락 독립성 트레이너',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('8종 드릴 · 10손가락 독립성 분석',15,42);
      var barW=60,gap=8,startX=30,startY=100;
      DRILLS.forEach(function(d,i){
        var x=startX+(barW+gap)*i;
        var h=scores[i]/100*220;
        var isSelected=i===selDrill;
        ctx.fillStyle=isSelected?'#4a7dff':'#1e2640';
        ctx.fillRect(x,startY+220-h,barW,h);
        if(isSelected){ctx.strokeStyle='#6d9bff';ctx.lineWidth=2;ctx.strokeRect(x,startY+220-h,barW,h);}
        ctx.fillStyle=isSelected?'#e8ecf4':'#6b7a9a';ctx.font='bold 11px sans-serif';
        ctx.textAlign='center';ctx.fillText(scores[i]+'%',x+barW/2,startY+220-h-8);
        ctx.font='8px sans-serif';ctx.fillStyle='#8892a8';
        var nameLines=d.name.split(' ');
        nameLines.forEach(function(line,li){ctx.fillText(line,x+barW/2,startY+240+li*11);});
      });
      ctx.textAlign='left';
      var d=DRILLS[selDrill];
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';
      ctx.fillText('선택: '+d.name,15,370);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(d.desc+' | 난이도: '+d.diff+'%',15,388);
      var avg=Math.round(scores.reduce(function(a,b){return a+b},0)/scores.length);
      var g=gradeOf24(avg);
      ctx.fillStyle=gradeColor24(g);ctx.font='bold 16px sans-serif';
      ctx.textAlign='right';ctx.fillText(g+' ('+avg+'%)',605,30);
      ctx.textAlign='left';
      if(history.length>1){
        ctx.strokeStyle='#36d39966';ctx.lineWidth=1.5;ctx.beginPath();
        var hLen=Math.min(history.length,20);
        for(var hi=0;hi<hLen;hi++){
          var hx=420+hi*(180/(hLen-1||1));
          var hy=80+(100-history[history.length-hLen+hi])/100*50;
          if(hi===0)ctx.moveTo(hx,hy);else ctx.lineTo(hx,hy);
        }
        ctx.stroke();
        ctx.fillStyle='#6b7a9a';ctx.font='8px sans-serif';ctx.fillText('최근 세션 추이',420,75);
      }
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var sx=e.clientX-rect.left,sy=e.clientY-rect.top;
      var scaleX=620/rect.width;
      var cx=sx*scaleX;
      var idx=Math.floor((cx-30)/68);
      if(idx>=0&&idx<8){
        selDrill=idx;
        playSFX24('finger_tap');
        var boost=Math.floor(Math.random()*8+3);
        scores[selDrill]=Math.min(100,scores[selDrill]+boost);
        ls24Set('finger_scores',scores);
        var avg=Math.round(scores.reduce(function(a,b){return a+b},0)/scores.length);
        history.push(avg);if(history.length>30)history.shift();
        ls24Set('finger_history',history);
        playSFX24('finger_drill');
        markV24Feature('finger_independence');
        draw();
      }
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 2. ERA MASTERCLASS GUIDE Canvas 620x400 ================
function buildEraMasterclassUI(){
  var ERAS=[
    {name:'바로크',period:'1600-1750',composers:['바흐','헨델','비발디'],style:[85,60,70,40,65,50],color:'#e74c3c'},
    {name:'고전',period:'1750-1820',composers:['모차르트','하이든','베토벤(초기)'],style:[70,85,75,55,80,60],color:'#3498db'},
    {name:'낭만',period:'1820-1900',composers:['쇼팽','리스트','슈만'],style:[60,70,90,85,55,80],color:'#9b59b6'},
    {name:'인상',period:'1880-1920',composers:['드뷔시','라벨','사티'],style:[50,55,80,90,45,85],color:'#1abc9c'},
    {name:'현대',period:'1900-현재',composers:['프로코피예프','바르톡','쇤베르크'],style:[75,65,60,70,90,75],color:'#f39c12'},
    {name:'재즈',period:'1900-현재',composers:['거슈윈','브루벡','에반스'],style:[55,50,85,75,70,90],color:'#e67e22'}
  ];
  var AXES=['기교','형식미','감정','색채','혁신','즉흥'];
  makeV24Modal('era-masterclass-modal','음악 시대 마스터클래스',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selEra=0;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('음악 시대 마스터클래스',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('6시대 · 18작곡가 · 스타일 6축 Radar',15,42);
      var tlY=65,tlH=25;
      ERAS.forEach(function(era,i){
        var x=20+i*98,w=92;
        var isSel=i===selEra;
        ctx.fillStyle=isSel?era.color+'44':era.color+'22';
        ctx.fillRect(x,tlY,w,tlH);
        if(isSel){ctx.strokeStyle=era.color;ctx.lineWidth=2;ctx.strokeRect(x,tlY,w,tlH);}
        ctx.fillStyle=isSel?'#fff':'#8892a8';ctx.font=isSel?'bold 10px sans-serif':'10px sans-serif';
        ctx.textAlign='center';ctx.fillText(era.name,x+w/2,tlY+16);
      });
      ctx.textAlign='left';
      var era=ERAS[selEra];
      ctx.fillStyle=era.color;ctx.font='bold 14px sans-serif';
      ctx.fillText(era.name+' ('+era.period+')',20,120);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('대표 작곡가: '+era.composers.join(', '),20,138);
      drawRadar24(ctx,170,270,95,AXES,era.style,100,'rgba(74,125,255,1)',0.15);
      era.style.forEach(function(v,si){
        var ang=-Math.PI/2+si*(Math.PI*2/6);
        var px=170+Math.cos(ang)*95*(v/100),py=270+Math.sin(ang)*95*(v/100);
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle=era.color;ctx.fill();
      });
      var detailX=340,detailY=120;
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('스타일 지표',detailX,detailY);
      AXES.forEach(function(ax,ai){
        var y=detailY+20+ai*28;
        ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
        ctx.fillText(ax,detailX,y);
        ctx.fillStyle='#1e2640';ctx.fillRect(detailX+50,y-10,180,14);
        ctx.fillStyle=era.color;ctx.fillRect(detailX+50,y-10,180*(era.style[ai]/100),14);
        ctx.fillStyle='#e8ecf4';ctx.font='bold 9px sans-serif';
        ctx.fillText(era.style[ai]+'%',detailX+235,y);
      });
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      ctx.fillText('클릭하여 시대 전환',20,395);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(620/rect.width);
      var cy=(e.clientY-rect.top)*(400/rect.height);
      if(cy>=55&&cy<=100){
        var idx=Math.floor((cx-20)/98);
        if(idx>=0&&idx<6){selEra=idx;playSFX24('era_select');markV24Feature('era_masterclass');draw();}
      }
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 3. TEMPO ADAPTATION ANALYZER Canvas 600x380 ================
function buildTempoAdaptationUI(){
  makeV24Modal('tempo-adapt-modal','템포 적응 분석기',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var taps=ls24Get('tempo_taps',[]);
    var targetBPM=100;
    var lastTapTime=0;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('템포 적응 분석기',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('목표 BPM: '+targetBPM+' | 캔버스 클릭으로 탭',15,42);
      ctx.strokeStyle='#f59e0b44';ctx.lineWidth=1;ctx.setLineDash([4,4]);
      var targetY=80+(200-targetBPM)/200*220;
      ctx.beginPath();ctx.moveTo(40,targetY);ctx.lineTo(560,targetY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#f59e0b';ctx.font='9px sans-serif';ctx.fillText(targetBPM+' BPM',565,targetY+4);
      if(taps.length>1){
        ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.beginPath();
        var len=Math.min(taps.length,30);
        for(var i=0;i<len;i++){
          var x=60+i*(480/(len-1||1));
          var bpm=Math.max(40,Math.min(200,taps[taps.length-len+i]));
          var y=80+(200-bpm)/200*220;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
        for(i=0;i<len;i++){
          var x2=60+i*(480/(len-1||1));
          var bpm2=Math.max(40,Math.min(200,taps[taps.length-len+i]));
          var y2=80+(200-bpm2)/200*220;
          ctx.beginPath();ctx.arc(x2,y2,3,0,Math.PI*2);ctx.fillStyle='#6d9bff';ctx.fill();
        }
        var avgBPM=Math.round(taps.slice(-len).reduce(function(a,b){return a+b},0)/len);
        var deviation=Math.round(Math.abs(avgBPM-targetBPM));
        var stability=Math.max(0,100-deviation*2);
        var g=gradeOf24(stability);
        ctx.fillStyle=gradeColor24(g);ctx.font='bold 16px sans-serif';
        ctx.textAlign='right';ctx.fillText(g,585,30);
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';
        ctx.fillText('평균: '+avgBPM+' BPM',585,50);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText('편차: ±'+deviation+' | 안정성: '+stability+'%',585,66);
        ctx.textAlign='left';
        var rubato=deviation>15?'루바토 감지':'일정한 템포';
        ctx.fillStyle=deviation>15?'#f59e0b':'#36d399';ctx.font='10px sans-serif';
        ctx.fillText(rubato,15,370);
      } else {
        ctx.fillStyle='#6b7a9a';ctx.font='12px sans-serif';ctx.textAlign='center';
        ctx.fillText('캔버스를 클릭하여 박자를 탭하세요',300,200);
        ctx.textAlign='left';
      }
      ctx.fillStyle='#2a3050';ctx.font='8px sans-serif';
      ['200','150','100','50'].forEach(function(v,vi){
        var yy=80+vi*73;
        ctx.fillText(v,15,yy+4);
        ctx.strokeStyle='#1a2035';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(40,yy);ctx.lineTo(560,yy);ctx.stroke();
      });
      var btns=[{label:'80',bpm:80},{label:'100',bpm:100},{label:'120',bpm:120},{label:'140',bpm:140},{label:'리셋',bpm:0}];
      btns.forEach(function(b,bi){
        var bx=400+bi*38,by=348;
        ctx.fillStyle=b.bpm===targetBPM?'#4a7dff33':'#1a2035';
        ctx.fillRect(bx,by,34,22);
        ctx.fillStyle=b.bpm===targetBPM?'#4a7dff':'#8892a8';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(b.label,bx+17,by+15);
      });
      ctx.textAlign='left';
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(600/rect.width);
      var cy=(e.clientY-rect.top)*(380/rect.height);
      if(cy>=348&&cy<=370&&cx>=400){
        var bi=Math.floor((cx-400)/38);
        var btns=[80,100,120,140,0];
        if(bi>=0&&bi<5){
          if(btns[bi]===0){taps=[];ls24Set('tempo_taps',[]);lastTapTime=0;}
          else{targetBPM=btns[bi];}
          playSFX24('tempo_tap');draw();return;
        }
      }
      var now=performance.now();
      if(lastTapTime>0){
        var interval=now-lastTapTime;
        var bpm=Math.round(60000/interval);
        if(bpm>=30&&bpm<=250){taps.push(bpm);if(taps.length>50)taps.shift();ls24Set('tempo_taps',taps);}
      }
      lastTapTime=now;
      playSFX24('tempo_tap');
      markV24Feature('tempo_adaptation');
      draw();
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 4. KEY TOUCH SENSITIVITY ANALYZER Canvas 620x380 ================
function buildKeyTouchUI(){
  var DYNAMICS=['pp','p','mp','mf','f','ff'];
  var DYN_COLORS=['#3b82f6','#60a5fa','#93c5fd','#fbbf24','#f59e0b','#ef4444'];
  makeV24Modal('key-touch-modal','건반 터치 감도 분석기',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var touchData=ls24Get('touch_data',Array.from({length:12},function(){return Math.floor(Math.random()*5)}));
    var dynDist=ls24Get('dyn_dist',[15,20,25,20,12,8]);
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('건반 터치 감도 분석기',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('12반음 터치 강도 히트맵 · pp~ff 6단계 분포',15,42);
      var NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
      var cellW=42,cellH=30,startX=30,startY=65;
      NOTES.forEach(function(n,ni){
        var x=startX+ni*cellW;
        var level=touchData[ni];
        ctx.fillStyle=DYN_COLORS[level];
        ctx.globalAlpha=0.3+level*0.14;
        ctx.fillRect(x,startY,cellW-2,cellH);
        ctx.globalAlpha=1;
        ctx.strokeStyle='#2a3050';ctx.lineWidth=1;ctx.strokeRect(x,startY,cellW-2,cellH);
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(n,x+cellW/2-1,startY+18);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(DYNAMICS[level],x+cellW/2-1,startY+cellH+12);
      });
      ctx.textAlign='left';
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('다이나믹 분포',30,145);
      var totalDyn=dynDist.reduce(function(a,b){return a+b},0);
      var maxDyn=Math.max.apply(null,dynDist);
      DYNAMICS.forEach(function(d,di){
        var y=160+di*32;
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText(d,30,y+12);
        var barW=350*(dynDist[di]/(maxDyn||1));
        ctx.fillStyle=DYN_COLORS[di]+'66';ctx.fillRect(65,y,barW,18);
        ctx.fillStyle=DYN_COLORS[di];ctx.fillRect(65,y,barW,18);
        ctx.globalAlpha=0.5;ctx.fillRect(65,y,barW,18);ctx.globalAlpha=1;
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';
        ctx.fillText(Math.round(dynDist[di]/totalDyn*100)+'%',70+barW,y+13);
      });
      var range=touchData.reduce(function(a,b){return Math.max(a,b)},0)-touchData.reduce(function(a,b){return Math.min(a,b)},5);
      var rangePct=Math.min(100,Math.round(range/5*100));
      var g=gradeOf24(rangePct);
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('다이나믹 레인지',440,145);
      ctx.fillStyle=gradeColor24(g);ctx.font='bold 28px sans-serif';
      ctx.fillText(g,520,210);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('범위: '+range+'/5 단계',440,230);
      ctx.fillText('활용도: '+rangePct+'%',440,248);
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      ctx.fillText('클릭하여 터치 스캔',15,370);
    }
    canvas.addEventListener('click',function(){
      touchData=Array.from({length:12},function(){return Math.floor(Math.random()*6)});
      dynDist=dynDist.map(function(v){return Math.max(5,v+Math.floor(Math.random()*10-3))});
      ls24Set('touch_data',touchData);ls24Set('dyn_dist',dynDist);
      playSFX24('touch_scan');markV24Feature('key_touch');draw();
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 5. MUSIC THEORY MASTERY TREE Canvas 640x400 ================
function buildTheoryTreeUI(){
  var NODES=[
    {id:'intervals',name:'음정',x:320,y:50,prereq:[],mastery:0},
    {id:'scales',name:'음계',x:180,y:120,prereq:['intervals'],mastery:0},
    {id:'chords',name:'화음',x:460,y:120,prereq:['intervals'],mastery:0},
    {id:'keys',name:'조성',x:100,y:200,prereq:['scales'],mastery:0},
    {id:'progressions',name:'코드진행',x:380,y:200,prereq:['chords','scales'],mastery:0},
    {id:'rhythm',name:'리듬이론',x:560,y:200,prereq:['intervals'],mastery:0},
    {id:'counterpoint',name:'대위법',x:180,y:280,prereq:['keys','progressions'],mastery:0},
    {id:'harmony',name:'화성학',x:320,y:280,prereq:['progressions'],mastery:0},
    {id:'modulation',name:'전조',x:460,y:280,prereq:['keys','harmony'],mastery:0},
    {id:'form',name:'형식분석',x:100,y:350,prereq:['counterpoint'],mastery:0},
    {id:'orchestration',name:'편곡',x:320,y:350,prereq:['harmony','counterpoint'],mastery:0},
    {id:'composition',name:'작곡',x:540,y:350,prereq:['modulation','orchestration'],mastery:0}
  ];
  makeV24Modal('theory-tree-modal','음악이론 마스터리 트리',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:640px;background:#0c1020;border-radius:8px;cursor:pointer';
    var masteries=ls24Get('theory_mastery',NODES.map(function(){return Math.floor(Math.random()*60)}));
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,640,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,640,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('음악이론 마스터리 트리',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('12노드 스킬트리 · 클릭하여 학습',15,42);
      NODES.forEach(function(node,ni){
        node.prereq.forEach(function(pid){
          var pi=NODES.findIndex(function(n){return n.id===pid});
          if(pi>=0){
            ctx.strokeStyle='#2a3050';ctx.lineWidth=1.5;
            ctx.beginPath();ctx.moveTo(NODES[pi].x,NODES[pi].y);ctx.lineTo(node.x,node.y);ctx.stroke();
          }
        });
      });
      NODES.forEach(function(node,ni){
        var m=masteries[ni];
        var unlocked=node.prereq.every(function(pid){
          var pi=NODES.findIndex(function(n){return n.id===pid});
          return pi>=0&&masteries[pi]>=50;
        });
        var r=22;
        ctx.beginPath();ctx.arc(node.x,node.y,r,0,Math.PI*2);
        ctx.fillStyle=m>=100?'#36d39933':m>=50?'#4a7dff33':unlocked?'#f59e0b22':'#1a2035';
        ctx.fill();
        var startAngle=-Math.PI/2;
        var endAngle=startAngle+(Math.PI*2*m/100);
        ctx.beginPath();ctx.arc(node.x,node.y,r,startAngle,endAngle);
        ctx.strokeStyle=m>=100?'#36d399':m>=50?'#4a7dff':unlocked?'#f59e0b':'#3a4060';
        ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.arc(node.x,node.y,r,-Math.PI/2,Math.PI*1.5);
        ctx.strokeStyle='#2a305066';ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle=m>=100?'#36d399':m>=50?'#e8ecf4':unlocked?'#f59e0b':'#6b7a9a';
        ctx.font='bold 9px sans-serif';ctx.textAlign='center';
        ctx.fillText(node.name,node.x,node.y+3);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(m+'%',node.x,node.y+14);
      });
      ctx.textAlign='left';
      var totalM=Math.round(masteries.reduce(function(a,b){return a+b},0)/masteries.length);
      var g=gradeOf24(totalM);
      ctx.fillStyle=gradeColor24(g);ctx.font='bold 16px sans-serif';
      ctx.textAlign='right';ctx.fillText(g+' ('+totalM+'%)',625,30);
      ctx.textAlign='left';
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(640/rect.width);
      var cy=(e.clientY-rect.top)*(400/rect.height);
      NODES.forEach(function(node,ni){
        var dx=cx-node.x,dy=cy-node.y;
        if(dx*dx+dy*dy<625){
          var unlocked=node.prereq.every(function(pid){
            var pi=NODES.findIndex(function(n){return n.id===pid});
            return pi>=0&&masteries[pi]>=50;
          });
          if(unlocked||node.prereq.length===0){
            masteries[ni]=Math.min(100,masteries[ni]+Math.floor(Math.random()*15+5));
            ls24Set('theory_mastery',masteries);
            playSFX24(masteries[ni]>=100?'theory_master':'theory_unlock');
            markV24Feature('theory_tree');
            draw();
          }
        }
      });
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 6. PRACTICE EFFICIENCY DASHBOARD Canvas 600x380 ================
function buildPracticeEfficiencyUI(){
  var METRICS=['반복횟수','정확도향상','시간투자','난이도극복','속도향상','표현력'];
  makeV24Modal('practice-eff-modal','연습 효율 대시보드',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var effData=ls24Get('eff_data',METRICS.map(function(){return Math.floor(Math.random()*40+40)}));
    var weeklyHistory=ls24Get('eff_weekly',Array.from({length:7},function(){return Math.floor(Math.random()*30+50)}));
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('연습 효율 대시보드',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('6지표 반원게이지 · 일주일 효율 추이',15,42);
      var gaugeColors=['#3b82f6','#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899'];
      METRICS.forEach(function(m,mi){
        var col=mi%3,row=Math.floor(mi/3);
        var gcx=100+col*190,gcy=130+row*130,gr=55;
        ctx.beginPath();ctx.arc(gcx,gcy,gr,-Math.PI,0);
        ctx.strokeStyle='#1e2640';ctx.lineWidth=10;ctx.stroke();
        var pct=effData[mi]/100;
        ctx.beginPath();ctx.arc(gcx,gcy,gr,-Math.PI,-Math.PI+Math.PI*pct);
        ctx.strokeStyle=gaugeColors[mi];ctx.lineWidth=10;ctx.stroke();
        ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
        ctx.fillText(effData[mi]+'%',gcx,gcy-5);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(m,gcx,gcy+15);
        var g=gradeOf24(effData[mi]);
        ctx.fillStyle=gradeColor24(g);ctx.font='bold 10px sans-serif';
        ctx.fillText(g,gcx,gcy+30);
      });
      ctx.textAlign='left';
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('주간 효율 추이',30,320);
      var days=['월','화','수','목','금','토','일'];
      ctx.strokeStyle='#4a7dff';ctx.lineWidth=1.5;ctx.beginPath();
      days.forEach(function(d,di){
        var x=80+di*70,y=365-weeklyHistory[di]/100*50;
        if(di===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();
      days.forEach(function(d,di){
        var x=80+di*70,y=365-weeklyHistory[di]/100*50;
        ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#6d9bff';ctx.fill();
        ctx.fillStyle='#6b7a9a';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(d,x,375);
        ctx.fillText(weeklyHistory[di]+'%',x,y-8);
      });
      ctx.textAlign='left';
      var avg=Math.round(effData.reduce(function(a,b){return a+b},0)/effData.length);
      var g=gradeOf24(avg);
      ctx.fillStyle=gradeColor24(g);ctx.font='bold 18px sans-serif';
      ctx.textAlign='right';ctx.fillText(g,585,30);
      ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';
      ctx.fillText('종합: '+avg+'%',585,48);
      ctx.textAlign='left';
    }
    canvas.addEventListener('click',function(){
      effData=METRICS.map(function(m,i){return Math.min(100,effData[i]+Math.floor(Math.random()*10+2))});
      weeklyHistory.push(Math.round(effData.reduce(function(a,b){return a+b},0)/effData.length));
      if(weeklyHistory.length>7)weeklyHistory.shift();
      ls24Set('eff_data',effData);ls24Set('eff_weekly',weeklyHistory);
      playSFX24('efficiency_calc');markV24Feature('practice_efficiency');draw();
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 7. PIANIST TECHNIQUE COMPARATOR Canvas 620x400 ================
function buildPianistCompareUI(){
  var PIANISTS=[
    {name:'호로비츠',era:'20C',stats:[95,80,90,85,70,88]},
    {name:'구르드',era:'20C',stats:[80,95,75,90,85,70]},
    {name:'아르헤리치',era:'현대',stats:[90,75,95,80,88,82]},
    {name:'리히터',era:'20C',stats:[85,90,88,82,75,90]},
    {name:'폴리니',era:'현대',stats:[88,92,80,78,80,85]},
    {name:'루빈스타인',era:'20C',stats:[82,78,85,92,72,95]},
    {name:'글렌 굴드',era:'20C',stats:[90,98,65,88,92,60]},
    {name:'키신',era:'현대',stats:[92,82,90,76,85,80]},
    {name:'랑랑',era:'현대',stats:[88,70,92,82,78,90]},
    {name:'조성진',era:'현대',stats:[86,88,82,85,80,84]}
  ];
  var AXES2=['기교','해석','감정','음색','혁신','무대력'];
  makeV24Modal('pianist-compare-modal','피아니스트 테크닉 비교기',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selA=0,selB=1;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('피아니스트 테크닉 비교기',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('10명 · 6축 듀얼 Radar · 클릭으로 선택',15,42);
      var nameY=60;
      PIANISTS.forEach(function(p,pi){
        var x=15+pi*60;
        var isSel=pi===selA||pi===selB;
        ctx.fillStyle=pi===selA?'#4a7dff33':pi===selB?'#36d39933':pi%2===0?'#1a2035':'transparent';
        ctx.fillRect(x,nameY,56,30);
        if(isSel){ctx.strokeStyle=pi===selA?'#4a7dff':'#36d399';ctx.lineWidth=1.5;ctx.strokeRect(x,nameY,56,30);}
        ctx.fillStyle=isSel?'#fff':'#8892a8';ctx.font=isSel?'bold 9px sans-serif':'9px sans-serif';
        ctx.textAlign='center';ctx.fillText(p.name,x+28,nameY+13);
        ctx.fillStyle='#6b7a9a';ctx.font='7px sans-serif';ctx.fillText(p.era,x+28,nameY+24);
      });
      ctx.textAlign='left';
      drawRadar24(ctx,200,250,100,AXES2,PIANISTS[selA].stats,100,'rgba(74,125,255,1)',0.12);
      drawRadar24(ctx,200,250,100,AXES2,PIANISTS[selB].stats,100,'rgba(54,211,153,1)',0.10);
      ctx.fillStyle='#4a7dff';ctx.font='10px sans-serif';
      ctx.fillText('● '+PIANISTS[selA].name,15,385);
      ctx.fillStyle='#36d399';ctx.fillText('● '+PIANISTS[selB].name,120,385);
      var detailX=370;
      ctx.fillStyle='#e8ecf4';ctx.font='bold 11px sans-serif';
      ctx.fillText('항목별 비교',detailX,115);
      AXES2.forEach(function(ax,ai){
        var y=135+ai*38;
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';ctx.fillText(ax,detailX,y);
        var vA=PIANISTS[selA].stats[ai],vB=PIANISTS[selB].stats[ai];
        ctx.fillStyle='#4a7dff';ctx.fillRect(detailX+60,y-10,vA*1.2,12);
        ctx.fillStyle='#36d399';ctx.fillRect(detailX+60,y+4,vB*1.2,12);
        ctx.fillStyle='#e8ecf4';ctx.font='8px sans-serif';
        ctx.fillText(vA,detailX+65+vA*1.2,y);
        ctx.fillText(vB,detailX+65+vB*1.2,y+14);
        var winner=vA>vB?'#4a7dff':vB>vA?'#36d399':'#8892a8';
        ctx.fillStyle=winner;ctx.font='bold 9px sans-serif';
        ctx.fillText(vA>vB?'◄':vB>vA?'►':'=',detailX+190,y+7);
      });
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(620/rect.width);
      var cy=(e.clientY-rect.top)*(400/rect.height);
      if(cy>=55&&cy<=95){
        var idx=Math.floor((cx-15)/60);
        if(idx>=0&&idx<10){
          if(idx!==selB)selA=idx;else{var tmp=selA;selA=selB;selB=tmp;}
          if(selA===selB)selB=(selA+1)%10;
          playSFX24('pianist_select');markV24Feature('pianist_compare');draw();
        }
      }
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ 8. EMOTION COLOR MAPPER Canvas 600x380 ================
function buildEmotionColorMapUI(){
  var KEYS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var EMOTIONS=['기쁨','슬픔','평화','긴장','웅장','몽환','열정','그리움'];
  var MAP=[ // 12 keys x 8 emotions intensity (0-10)
    [8,3,6,2,7,4,9,5],[4,7,3,6,3,8,5,7],[7,4,8,3,5,5,7,4],[5,6,4,7,4,7,4,8],
    [9,2,7,3,8,3,8,3],[6,5,9,2,6,6,5,6],[3,8,5,8,3,9,3,9],
    [8,3,7,3,9,4,7,4],[4,7,4,7,4,8,4,8],[7,4,6,4,6,5,8,5],[5,6,5,6,5,7,5,7],[6,5,5,5,5,6,6,6]
  ];
  makeV24Modal('emotion-color-modal','음악 감정 색채 매퍼',function(content){
    var wrap=document.createElement('div');
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selKey=-1,selEmo=-1;
    function intToColor(v){
      var r=Math.round(40+v*21.5),g2=Math.round(20+v*(v>5?5:15)),b=Math.round(80-v*5);
      return 'rgb('+r+','+g2+','+b+')';
    }
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('음악 감정 색채 매퍼',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('12조성 × 8감정 히트맵 · 셀 클릭 상세',15,42);
      var cellW=38,cellH=32,startX=75,startY=70;
      KEYS.forEach(function(k,ki){
        ctx.fillStyle=ki===selKey?'#4a7dff':'#8892a8';
        ctx.font=ki===selKey?'bold 9px sans-serif':'9px sans-serif';ctx.textAlign='center';
        ctx.fillText(k,startX+ki*cellW+cellW/2,startY-8);
      });
      ctx.textAlign='right';
      EMOTIONS.forEach(function(em,ei){
        ctx.fillStyle=ei===selEmo?'#4a7dff':'#8892a8';
        ctx.font=ei===selEmo?'bold 9px sans-serif':'9px sans-serif';
        ctx.fillText(em,startX-8,startY+ei*cellH+cellH/2+3);
      });
      ctx.textAlign='left';
      KEYS.forEach(function(k,ki){
        EMOTIONS.forEach(function(em,ei){
          var x=startX+ki*cellW,y=startY+ei*cellH;
          var v=MAP[ki][ei];
          ctx.fillStyle=intToColor(v);
          ctx.globalAlpha=0.4+v*0.06;
          ctx.fillRect(x,y,cellW-2,cellH-2);
          ctx.globalAlpha=1;
          if(ki===selKey&&ei===selEmo){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y,cellW-2,cellH-2);}
          else{ctx.strokeStyle='#0c1020';ctx.lineWidth=1;ctx.strokeRect(x,y,cellW-2,cellH-2);}
          ctx.fillStyle='#e8ecf4';ctx.font='8px sans-serif';ctx.textAlign='center';
          ctx.fillText(v,x+cellW/2-1,y+cellH/2+2);
        });
      });
      ctx.textAlign='left';
      if(selKey>=0&&selEmo>=0){
        var detailY=338;
        ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
        ctx.fillText(KEYS[selKey]+'장조 × '+EMOTIONS[selEmo],15,detailY);
        var intensity=MAP[selKey][selEmo];
        ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';
        var desc=intensity>=8?'매우 강한 연관':intensity>=6?'뚜렷한 연관':intensity>=4?'보통':intensity>=2?'약한 연관':'거의 무관';
        ctx.fillText('강도: '+intensity+'/10 — '+desc,15,detailY+18);
        ctx.fillStyle=intToColor(intensity);
        ctx.fillRect(300,detailY-12,30,30);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(300,detailY-12,30,30);
      }
      var legendX=500,legendY=70;
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';ctx.fillText('강도',legendX,legendY-5);
      for(var li=0;li<=10;li+=2){
        ctx.fillStyle=intToColor(li);ctx.fillRect(legendX,legendY+li*12,20,10);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.fillText(li,legendX+25,legendY+li*12+9);
      }
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var cx=(e.clientX-rect.left)*(600/rect.width);
      var cy=(e.clientY-rect.top)*(380/rect.height);
      var ki=Math.floor((cx-75)/38),ei=Math.floor((cy-70)/32);
      if(ki>=0&&ki<12&&ei>=0&&ei<8){
        selKey=ki;selEmo=ei;
        playSFX24('emotion_map');markV24Feature('emotion_color');draw();
      }
    });
    wrap.appendChild(canvas);content.appendChild(wrap);
    draw();
  });
}

// ================ QUIZ v15 (210->225) ================
function buildQuizV15UI(){
  var QUESTIONS=[
    {q:'피아노의 표준 건반 수는?',a:['85개','88개','92개','76개'],c:1},
    {q:'템포 &quot;Allegro&quot;의 BPM 범위는?',a:['60-80','100-120','120-156','160-200'],c:2},
    {q:'다장조(C Major)의 구성음이 아닌 것은?',a:['E','G','F#','B'],c:2},
    {q:'피아노의 페달 중 가장 오른쪽은?',a:['소프트 페달','소스테누토','서스테인','우나 코르다'],c:2},
    {q:'&quot;Forte&quot;의 의미는?',a:['느리게','부드럽게','세게','점점 빠르게'],c:2},
    {q:'바흐의 &quot;평균율 클라비어곡집&quot;은 몇 조성을 다루는가?',a:['12','18','24','30'],c:2},
    {q:'피아노 3중주의 구성은?',a:['피아노+바이올린+첼로','피아노3대','피아노+플루트+오보에','피아노+트럼펫+드럼'],c:0},
    {q:'쇼팽이 주로 작곡한 피아노 형식이 아닌 것은?',a:['녹턴','교향곡','폴로네이즈','에튀드'],c:1},
    {q:'반음의 영어 표현은?',a:['Whole tone','Half step','Quarter note','Sharp'],c:1},
    {q:'테누토(Tenuto)의 연주법은?',a:['짧게 끊어서','음가를 충분히 유지','점점 세게','악센트를 주어'],c:1},
    {q:'피아노 소나타의 전형적 악장 수는?',a:['2','3','4','5'],c:2},
    {q:'옥타브 음정의 진동수 비율은?',a:['1:2','2:3','3:4','4:5'],c:0},
    {q:'리스트가 개척한 연주 형태는?',a:['실내악','독주 리사이틀','관현악','오페라'],c:1},
    {q:'&quot;Rubato&quot;의 의미는?',a:['박자를 빼앗다(자유 템포)','반복하다','점점 느리게','처음 속도로'],c:0},
    {q:'피아노 건반에서 흰 건반의 폭은 약?',a:['15mm','23mm','30mm','35mm'],c:1}
  ];
  makeV24Modal('quiz15-modal','피아노 퀴즈 v15',function(content){
    var wrap=document.createElement('div');
    var qi=0,score=0,answered=false;
    var scores15=ls24Get('quiz15_scores',[]);
    function render(){
      wrap.innerHTML='';
      if(qi>=QUESTIONS.length){
        var pct=Math.round(score/QUESTIONS.length*100);
        scores15.push(pct);ls24Set('quiz15_scores',scores15);
        var g=gradeOf24(pct);
        wrap.innerHTML='<div style="text-align:center;padding:30px"><div style="font-size:28px;color:'+gradeColor24(g)+'">'+g+'</div><div style="font-size:16px;color:#e8ecf4;margin:8px">'+score+'/'+QUESTIONS.length+' ('+pct+'%)</div><button id="quiz15-retry" style="padding:8px 20px;background:#4a7dff;color:#fff;border:none;border-radius:6px;cursor:pointer;margin-top:12px">다시 풀기</button></div>';
        document.getElementById('quiz15-retry').addEventListener('click',function(){qi=0;score=0;answered=false;render();});
        return;
      }
      var q=QUESTIONS[qi];
      var html='<div style="margin-bottom:12px"><span style="color:#4a7dff;font-weight:bold">Q'+(qi+1)+'/'+QUESTIONS.length+'</span> <span style="color:#e8ecf4;font-size:13px">'+q.q+'</span></div>';
      q.a.forEach(function(a,ai){
        html+='<button class="q15opt" data-i="'+ai+'" style="display:block;width:100%;text-align:left;padding:10px 14px;margin:4px 0;background:#1a2035;color:#e8ecf4;border:1px solid #2a3050;border-radius:6px;cursor:pointer;font-size:12px">'+a+'</button>';
      });
      html+='<div style="margin-top:8px;color:#6b7a9a;font-size:10px">진행률: '+Math.round(qi/QUESTIONS.length*100)+'%</div>';
      wrap.innerHTML=html;
      wrap.querySelectorAll('.q15opt').forEach(function(btn){
        btn.addEventListener('click',function(){
          if(answered)return;answered=true;
          var chosen=parseInt(btn.getAttribute('data-i'));
          if(chosen===q.c){score++;btn.style.background='#36d39944';btn.style.borderColor='#36d399';playSFX24('quiz_correct24');}
          else{btn.style.background='#ef444444';btn.style.borderColor='#ef4444';wrap.querySelectorAll('.q15opt')[q.c].style.background='#36d39944';}
          setTimeout(function(){qi++;answered=false;render();},900);
        });
      });
    }
    render();
    content.appendChild(wrap);
  });
}

// ================ ACHIEVEMENTS v24 (216->228) ================
var V24_ACHIEVEMENTS=[
  {id:'v24_finger_starter',name:'독립 손가락 입문',desc:'손가락 독립성 트레이너 첫 사용',check:function(){return ls24Get('features_used',[]).indexOf('finger_independence')!==-1}},
  {id:'v24_era_explorer',name:'시대 탐험가',desc:'음악 시대 마스터클래스 첫 탐색',check:function(){return ls24Get('features_used',[]).indexOf('era_masterclass')!==-1}},
  {id:'v24_tempo_keeper',name:'템포 키퍼',desc:'템포 적응 분석기 10회 탭',check:function(){return ls24Get('tempo_taps',[]).length>=10}},
  {id:'v24_touch_analyst',name:'터치 분석가',desc:'건반 터치 감도 분석기 사용',check:function(){return ls24Get('features_used',[]).indexOf('key_touch')!==-1}},
  {id:'v24_theory_student',name:'이론 학생',desc:'음악이론 트리 3노드 50% 달성',check:function(){var m=ls24Get('theory_mastery',[]);return m.filter(function(v){return v>=50}).length>=3}},
  {id:'v24_theory_master',name:'이론 마스터',desc:'음악이론 트리 전체 80% 달성',check:function(){var m=ls24Get('theory_mastery',[]);return m.length>0&&m.every(function(v){return v>=80})}},
  {id:'v24_efficiency_pro',name:'효율의 달인',desc:'연습 효율 S등급 달성',check:function(){var d=ls24Get('eff_data',[]);return d.length>0&&d.reduce(function(a,b){return a+b},0)/d.length>=90}},
  {id:'v24_pianist_fan',name:'피아니스트 팬',desc:'피아니스트 비교기 사용',check:function(){return ls24Get('features_used',[]).indexOf('pianist_compare')!==-1}},
  {id:'v24_emotion_mapper',name:'감정 매퍼',desc:'감정 색채 매퍼 사용',check:function(){return ls24Get('features_used',[]).indexOf('emotion_color')!==-1}},
  {id:'v24_quiz15_pass',name:'퀴즈 v15 합격',desc:'퀴즈 v15 70% 이상 달성',check:function(){var s=ls24Get('quiz15_scores',[]);return s.some(function(v){return v>=70})}},
  {id:'v24_song_212',name:'212곡 보유',desc:'212곡 모두 해금',check:function(){return window.app&&app.songs&&app.songs.length>=212}},
  {id:'v24_complete',name:'v24 완전정복',desc:'v24 모든 기능 사용',check:function(){var f=ls24Get('features_used',[]);return['finger_independence','era_masterclass','tempo_adaptation','key_touch','theory_tree','practice_efficiency','pianist_compare','emotion_color'].every(function(n){return f.indexOf(n)!==-1})}}
];

function injectV24Achievements(){
  if(!window.app||!app.achievements) return;
  V24_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(ex){return ex.id===a.id});
    if(!exists) app.achievements.push(a);
  });
}
function checkV24Achievements(){
  if(!window.app||!app.achievements) return;
  V24_ACHIEVEMENTS.forEach(function(a){
    if(a.check&&a.check()){
      var key='ach_'+a.id;
      if(!ls24Get(key,false)){
        ls24Set(key,true);
        playSFX24('v24_achieve');
      }
    }
  });
}

// ================ KEYBOARD SHORTCUTS v24 ================
function setupV24Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var map={'Q':'finger-indep-modal','W':'era-masterclass-modal','E':'tempo-adapt-modal','R':'key-touch-modal',
             'T':'theory-tree-modal','Y':'practice-eff-modal','U':'pianist-compare-modal','I':'emotion-color-modal',
             '0':'quiz15-modal'};
    var key=e.key.toUpperCase();
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV24NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🖐️ 독립성',modal:'finger-indep-modal'},
    {label:'🏛️ 시대별',modal:'era-masterclass-modal'},
    {label:'⏲️ 템포',modal:'tempo-adapt-modal'},
    {label:'🎹 터치',modal:'key-touch-modal'},
    {label:'🌳 이론트리',modal:'theory-tree-modal'},
    {label:'📊 효율',modal:'practice-eff-modal'},
    {label:'🎹 피아니스트',modal:'pianist-compare-modal'},
    {label:'🎨 감정색채',modal:'emotion-color-modal'},
    {label:'🧠 퀴즈v15',modal:'quiz15-modal'}
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
function initV24(){
  addV24Songs();
  buildFingerIndependenceUI();
  buildEraMasterclassUI();
  buildTempoAdaptationUI();
  buildKeyTouchUI();
  buildTheoryTreeUI();
  buildPracticeEfficiencyUI();
  buildPianistCompareUI();
  buildEmotionColorMapUI();
  buildQuizV15UI();
  injectV24Achievements();
  setupV24Shortcuts();
  injectV24NavButtons();
  setInterval(checkV24Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV24,6400);});
else setTimeout(initV24,6400);
})();
