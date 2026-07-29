// Piano Master v25 Patch Module
// Scale Mastery Race, Position Optimizer, Repertoire Progress Map, Daily Practice Optimizer,
// Music Glossary Explorer, Melody Memory Challenge, Score Reading Guide, Comprehensive Skill Diagnosis
// 10 Songs (212->222), Quiz v16 15Q (225->240), 12 Achievements (228->240), SFX 16, Keyboard 9
(function(){
'use strict';
if(window.__v25Loaded) return;
window.__v25Loaded = true;

var LS25 = 'piano-v25-';
function ls25Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS25+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls25Set(k,v){localStorage.setItem(LS25+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v25 (16 sounds) ================
var sfx25 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone25(freq,type,dur,gainVal,delayMs){
  if(!sfx25) return;
  setTimeout(function(){
    if(!sfx25) return;
    var t=sfx25.currentTime,g=sfx25.createGain(),o=sfx25.createOscillator();
    o.connect(g);g.connect(sfx25.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX25(type){
  if(!sfx25) return;
  if(sfx25.state==='suspended') sfx25.resume();
  switch(type){
    case 'scale_start': tone25(523,'triangle',0.08,0.06,0); tone25(659,'triangle',0.08,0.06,60); break;
    case 'scale_grade': tone25(440,'triangle',0.1,0.07,0); tone25(554,'triangle',0.12,0.07,70); tone25(698,'triangle',0.15,0.07,140); break;
    case 'pos_scan': tone25(330,'sine',0.12,0.06,0); break;
    case 'pos_optimize': tone25(392,'triangle',0.1,0.06,0); tone25(523,'triangle',0.12,0.06,80); break;
    case 'map_hover': tone25(494,'sine',0.06,0.04,0); break;
    case 'map_click': tone25(587,'triangle',0.1,0.06,0); tone25(698,'triangle',0.12,0.06,70); break;
    case 'daily_calc': tone25(440,'sine',0.12,0.05,0); tone25(554,'sine',0.12,0.05,80); break;
    case 'daily_optimal': tone25(523,'triangle',0.1,0.07,0); tone25(698,'triangle',0.12,0.07,80); tone25(880,'triangle',0.15,0.07,160); break;
    case 'glossary_flip': tone25(349,'triangle',0.08,0.05,0); break;
    case 'glossary_learn': tone25(523,'sine',0.1,0.06,0); tone25(659,'sine',0.1,0.06,70); break;
    case 'memory_note': tone25(660,'sine',0.15,0.06,0); break;
    case 'memory_success': tone25(523,'triangle',0.08,0.08,0); tone25(659,'triangle',0.1,0.08,80); tone25(784,'triangle',0.12,0.08,160); break;
    case 'score_section': tone25(392,'sine',0.1,0.05,0); tone25(494,'sine',0.1,0.05,70); break;
    case 'diag_scan': tone25(262,'triangle',0.12,0.06,0); tone25(330,'triangle',0.12,0.06,70); tone25(392,'triangle',0.12,0.06,140); break;
    case 'v25_achieve': tone25(523,'triangle',0.1,0.1,0); tone25(659,'triangle',0.12,0.1,80); tone25(784,'triangle',0.12,0.1,160); tone25(1047,'triangle',0.25,0.1,240); break;
    case 'quiz_correct25': tone25(698,'triangle',0.1,0.07,0); tone25(880,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v25 ================
function makeV25Modal(id, title, contentFn){
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

function markV25Feature(name){
  var used=ls25Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls25Set('features_used',used);}
}

function gradeOf25(pct){return pct>=90?'S':pct>=75?'A':pct>=55?'B':pct>=35?'C':'D';}
function gradeColor25(g){return g==='S'?'#ffd700':g==='A'?'#4a7dff':g==='B'?'#36d399':g==='C'?'#f59e0b':'#ef4444';}

// ================ 10 NEW SONGS (212->222) ================
function addV25Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s213',name:'베토벤 월광 소나타 3악장',category:'클래식',difficulty:'expert',
     notes:[{note:'C#4',time:0,dur:0.12},{note:'E4',time:0.12,dur:0.12},{note:'G#4',time:0.24,dur:0.12},{note:'C#5',time:0.36,dur:0.12},{note:'E5',time:0.48,dur:0.12},{note:'G#4',time:0.6,dur:0.12},{note:'C#5',time:0.72,dur:0.12},{note:'E5',time:0.84,dur:0.12},{note:'G#5',time:0.96,dur:0.25},{note:'F#5',time:1.21,dur:0.12},{note:'E5',time:1.33,dur:0.12},{note:'D#5',time:1.45,dur:0.3}]},
    {id:'s214',name:'모차르트 소나타 K.545 1악장',category:'클래식',difficulty:'easy',
     notes:[{note:'C5',time:0,dur:0.5},{note:'E5',time:0.5,dur:0.5},{note:'G5',time:1.0,dur:0.5},{note:'E5',time:1.5,dur:0.25},{note:'F5',time:1.75,dur:0.25},{note:'G5',time:2.0,dur:0.25},{note:'A5',time:2.25,dur:0.25},{note:'B4',time:2.5,dur:0.25},{note:'C5',time:2.75,dur:0.25},{note:'D5',time:3.0,dur:0.5},{note:'G4',time:3.5,dur:0.5},{note:'C5',time:4.0,dur:1.0}]},
    {id:'s215',name:'쇼팽 왈츠 Op.64-2',category:'클래식',difficulty:'medium',
     notes:[{note:'C#4',time:0,dur:0.4},{note:'D#4',time:0.4,dur:0.4},{note:'E4',time:0.8,dur:0.4},{note:'F#4',time:1.2,dur:0.4},{note:'G#4',time:1.6,dur:0.4},{note:'A4',time:2.0,dur:0.4},{note:'G#4',time:2.4,dur:0.4},{note:'F#4',time:2.8,dur:0.4},{note:'E4',time:3.2,dur:0.4},{note:'D#4',time:3.6,dur:0.4},{note:'C#4',time:4.0,dur:0.4},{note:'B3',time:4.4,dur:0.8}]},
    {id:'s216',name:'리스트 헝가리 랩소디 2번',category:'클래식',difficulty:'expert',
     notes:[{note:'C#4',time:0,dur:0.2},{note:'D4',time:0.2,dur:0.2},{note:'E4',time:0.4,dur:0.2},{note:'F#4',time:0.6,dur:0.2},{note:'G#4',time:0.8,dur:0.2},{note:'A4',time:1.0,dur:0.2},{note:'B4',time:1.2,dur:0.15},{note:'C#5',time:1.35,dur:0.15},{note:'D5',time:1.5,dur:0.15},{note:'E5',time:1.65,dur:0.15},{note:'F#5',time:1.8,dur:0.15},{note:'G#5',time:1.95,dur:0.4}]},
    {id:'s217',name:'슈베르트 즉흥곡 Op.90-2',category:'클래식',difficulty:'medium',
     notes:[{note:'Eb4',time:0,dur:0.2},{note:'F4',time:0.2,dur:0.2},{note:'G4',time:0.4,dur:0.2},{note:'Ab4',time:0.6,dur:0.2},{note:'Bb4',time:0.8,dur:0.2},{note:'C5',time:1.0,dur:0.2},{note:'Bb4',time:1.2,dur:0.2},{note:'Ab4',time:1.4,dur:0.2},{note:'G4',time:1.6,dur:0.2},{note:'F4',time:1.8,dur:0.2},{note:'Eb4',time:2.0,dur:0.4},{note:'Bb3',time:2.4,dur:0.6}]},
    {id:'s218',name:'브람스 인터메초 Op.118-2',category:'클래식',difficulty:'hard',
     notes:[{note:'A4',time:0,dur:0.6},{note:'C#5',time:0.6,dur:0.4},{note:'E5',time:1.0,dur:0.4},{note:'D5',time:1.4,dur:0.4},{note:'C#5',time:1.8,dur:0.4},{note:'B4',time:2.2,dur:0.4},{note:'A4',time:2.6,dur:0.6},{note:'F#4',time:3.2,dur:0.4},{note:'G#4',time:3.6,dur:0.4},{note:'A4',time:4.0,dur:0.4},{note:'B4',time:4.4,dur:0.4},{note:'C#5',time:4.8,dur:0.8}]},
    {id:'s219',name:'멘델스존 무언가 Op.30-6',category:'클래식',difficulty:'medium',
     notes:[{note:'F#4',time:0,dur:0.3},{note:'A4',time:0.3,dur:0.3},{note:'D5',time:0.6,dur:0.3},{note:'C#5',time:0.9,dur:0.3},{note:'B4',time:1.2,dur:0.3},{note:'A4',time:1.5,dur:0.3},{note:'G4',time:1.8,dur:0.3},{note:'F#4',time:2.1,dur:0.3},{note:'E4',time:2.4,dur:0.3},{note:'D4',time:2.7,dur:0.3},{note:'E4',time:3.0,dur:0.3},{note:'F#4',time:3.3,dur:0.8}]},
    {id:'s220',name:'프로코피예프 소나타 7번 3악장',category:'클래식',difficulty:'expert',
     notes:[{note:'Bb3',time:0,dur:0.12},{note:'C4',time:0.12,dur:0.12},{note:'Db4',time:0.24,dur:0.12},{note:'Eb4',time:0.36,dur:0.12},{note:'F4',time:0.48,dur:0.12},{note:'Gb4',time:0.6,dur:0.12},{note:'Ab4',time:0.72,dur:0.12},{note:'Bb4',time:0.84,dur:0.12},{note:'C5',time:0.96,dur:0.12},{note:'Db5',time:1.08,dur:0.12},{note:'Eb5',time:1.2,dur:0.12},{note:'F5',time:1.32,dur:0.3}]},
    {id:'s221',name:'파헬벨 캐논 변주',category:'클래식',difficulty:'easy',
     notes:[{note:'E5',time:0,dur:0.5},{note:'D5',time:0.5,dur:0.5},{note:'C5',time:1.0,dur:0.5},{note:'B4',time:1.5,dur:0.5},{note:'A4',time:2.0,dur:0.5},{note:'G4',time:2.5,dur:0.5},{note:'A4',time:3.0,dur:0.5},{note:'B4',time:3.5,dur:0.5},{note:'C5',time:4.0,dur:0.5},{note:'D5',time:4.5,dur:0.5},{note:'E5',time:5.0,dur:0.5},{note:'F5',time:5.5,dur:0.5}]},
    {id:'s222',name:'스카를라티 소나타 K.141',category:'클래식',difficulty:'hard',
     notes:[{note:'D4',time:0,dur:0.15},{note:'E4',time:0.15,dur:0.15},{note:'F#4',time:0.3,dur:0.15},{note:'G4',time:0.45,dur:0.15},{note:'A4',time:0.6,dur:0.15},{note:'B4',time:0.75,dur:0.15},{note:'C#5',time:0.9,dur:0.15},{note:'D5',time:1.05,dur:0.3},{note:'A4',time:1.35,dur:0.15},{note:'F#4',time:1.5,dur:0.15},{note:'D4',time:1.65,dur:0.15},{note:'A3',time:1.8,dur:0.4}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ RADAR CHART HELPER v25 ================
function drawRadar25(ctx,cx,cy,r,labels,values,maxVal,color,fillAlpha){
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

// ================ 1. SCALE MASTERY RACE Canvas 620x400 ================
function buildScaleMasteryUI(){
  var SCALES=[
    {name:'C 장조',key:'C',notes:['C','D','E','F','G','A','B'],bpm:80},
    {name:'G 장조',key:'G',notes:['G','A','B','C','D','E','F#'],bpm:75},
    {name:'D 장조',key:'D',notes:['D','E','F#','G','A','B','C#'],bpm:72},
    {name:'F 장조',key:'F',notes:['F','G','A','Bb','C','D','E'],bpm:70},
    {name:'A 단조',key:'Am',notes:['A','B','C','D','E','F','G'],bpm:78},
    {name:'E 단조',key:'Em',notes:['E','F#','G','A','B','C','D'],bpm:73},
    {name:'도리안',key:'Dor',notes:['D','E','F','G','A','B','C'],bpm:65},
    {name:'믹소리디안',key:'Mix',notes:['G','A','B','C','D','E','F'],bpm:60},
    {name:'펬타토닉',key:'Pent',notes:['C','D','E','G','A'],bpm:85},
    {name:'블루스',key:'Blu',notes:['C','Eb','F','F#','G','Bb'],bpm:68},
    {name:'하모닉 단조',key:'Hm',notes:['A','B','C','D','E','F','G#'],bpm:62},
    {name:'크로매틱',key:'Chr',notes:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],bpm:55}
  ];
  makeV25Modal('scale-mastery-modal','스케일 마스터리 레이스',function(content){
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selScale=0;
    var speeds=ls25Get('scale_speeds',SCALES.map(function(s){return Math.floor(Math.random()*40+s.bpm-20)}));
    var accuracies=ls25Get('scale_accuracies',SCALES.map(function(){return Math.floor(Math.random()*30+60)}));
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('스케일 마스터리 레이스',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('12스케일 속도+정확도 \xB7 BPM 트렌드',15,42);
      var barW=42,gap=5,startX=20,bH=180,startY=80;
      SCALES.forEach(function(s,i){
        var x=startX+(barW+gap)*i;
        var spH=speeds[i]/120*bH;
        var acH=accuracies[i]/100*bH;
        var sel=i===selScale;
        ctx.fillStyle=sel?'rgba(74,125,255,0.3)':'rgba(30,38,64,0.5)';
        ctx.fillRect(x,startY,barW,bH);
        ctx.fillStyle=sel?'#4a7dff':'#2a4a8a';
        ctx.fillRect(x,startY+bH-spH,barW/2-1,spH);
        ctx.fillStyle=sel?'#36d399':'#1a6a4a';
        ctx.fillRect(x+barW/2+1,startY+bH-acH,barW/2-1,acH);
        if(sel){ctx.strokeStyle='#6d9bff';ctx.lineWidth=2;ctx.strokeRect(x,startY,barW,bH);}
        ctx.fillStyle=sel?'#e8ecf4':'#6b7a9a';ctx.font='7px sans-serif';ctx.textAlign='center';
        ctx.fillText(s.name,x+barW/2,startY+bH+14);
        ctx.fillStyle='#4a7dff';ctx.font='bold 8px sans-serif';
        ctx.fillText(speeds[i]+'bpm',x+barW/4,startY+bH-spH-4);
        ctx.fillStyle='#36d399';ctx.font='bold 8px sans-serif';
        ctx.fillText(accuracies[i]+'%',x+barW*3/4,startY+bH-acH-4);
      });
      ctx.textAlign='left';
      var sc=SCALES[selScale];
      var avgSpd=Math.round(speeds.reduce(function(a,b){return a+b},0)/speeds.length);
      var avgAcc=Math.round(accuracies.reduce(function(a,b){return a+b},0)/accuracies.length);
      var composite=Math.round((avgSpd/120*50)+(avgAcc/100*50));
      var g=gradeOf25(composite);
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';
      ctx.fillText('선택: '+sc.name+' (음: '+sc.notes.join('-')+')',15,310);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('목표 BPM: '+sc.bpm+' | 현재: '+speeds[selScale]+'BPM | 정확도: '+accuracies[selScale]+'%',15,328);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('평균 속도: '+avgSpd+'BPM | 평균 정확도: '+avgAcc+'%',15,346);
      ctx.fillStyle=gradeColor25(g);ctx.font='bold 18px sans-serif';
      ctx.fillText('종합: '+g,15,375);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('레전드: 🟦속도(BPM)  🟩정확도(%)',400,375);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var x=(e.clientX-rect.left)*(620/rect.width);
      var barW=42,gap=5,startX=20;
      var idx=Math.floor((x-startX)/(barW+gap));
      if(idx>=0&&idx<SCALES.length){
        selScale=idx;
        speeds[idx]=Math.min(120,speeds[idx]+Math.floor(Math.random()*5+1));
        accuracies[idx]=Math.min(100,accuracies[idx]+Math.floor(Math.random()*3));
        ls25Set('scale_speeds',speeds);ls25Set('scale_accuracies',accuracies);
        playSFX25('scale_start');markV25Feature('scale_mastery');draw();
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 2. POSITION OPTIMIZER Canvas 600x380 ================
function buildPositionOptimizerUI(){
  var POSITIONS=[
    {name:'C 포지션',range:'C3-G4',comfort:85,efficiency:90,reach:80},
    {name:'G 포지션',range:'G3-D5',comfort:82,efficiency:85,reach:78},
    {name:'F 포지션',range:'F3-C5',comfort:80,efficiency:82,reach:75},
    {name:'D 포지션',range:'D3-A4',comfort:78,efficiency:80,reach:82},
    {name:'A 포지션',range:'A3-E5',comfort:75,efficiency:78,reach:85},
    {name:'E 포지션',range:'E3-B4',comfort:73,efficiency:75,reach:88},
    {name:'Bb 포지션',range:'Bb3-F5',comfort:70,efficiency:73,reach:80},
    {name:'크로매틱',range:'C3-C5',comfort:60,efficiency:65,reach:95}
  ];
  makeV25Modal('position-opt-modal','피아노 포지션 옵티마이저',function(content){
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selPos=0;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('피아노 포지션 옵티마이저',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('8포지션 편안도/효율성/도달범위 3축 분석',15,42);
      var barH=30,gap=6,startY=60,maxW=340;
      var metrics=['편안도','효율성','도달범위'];
      var colors=['#4a7dff','#36d399','#a855f7'];
      POSITIONS.forEach(function(p,i){
        var y=startY+i*(barH+gap);
        var sel=i===selPos;
        ctx.fillStyle=sel?'rgba(74,125,255,0.1)':'transparent';
        ctx.fillRect(0,y-2,600,barH+4);
        ctx.fillStyle=sel?'#e8ecf4':'#8892a8';ctx.font=sel?'bold 10px sans-serif':'10px sans-serif';
        ctx.textAlign='left';ctx.fillText(p.name,15,y+12);
        ctx.fillStyle='#6b7a9a';ctx.font='8px sans-serif';ctx.fillText(p.range,15,y+24);
        var vals=[p.comfort,p.efficiency,p.reach];
        var segH=barH/3;
        vals.forEach(function(v,vi){
          var bx=120,by=y+vi*segH;
          var w=v/100*maxW;
          ctx.fillStyle=sel?colors[vi]:colors[vi].replace(')',',0.4)').replace('rgb','rgba');
          ctx.fillRect(bx,by+1,w,segH-2);
          ctx.fillStyle=sel?'#e8ecf4':'#6b7a9a';ctx.font='7px sans-serif';ctx.textAlign='right';
          ctx.fillText(v+'%',bx+maxW+25,by+segH-2);
        });
        var avg=Math.round((p.comfort+p.efficiency+p.reach)/3);
        var g=gradeOf25(avg);
        ctx.fillStyle=gradeColor25(g);ctx.font='bold 12px sans-serif';ctx.textAlign='center';
        ctx.fillText(g,560,y+barH/2+4);
      });
      ctx.textAlign='left';
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      metrics.forEach(function(m,mi){
        ctx.fillStyle=colors[mi];ctx.fillRect(15+mi*120,360,8,8);
        ctx.fillStyle='#8892a8';ctx.fillText(m,27+mi*120,368);
      });
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var y=(e.clientY-rect.top)*(380/rect.height);
      var barH=30,gap=6,startY=60;
      var idx=Math.floor((y-startY)/(barH+gap));
      if(idx>=0&&idx<POSITIONS.length){selPos=idx;playSFX25('pos_scan');markV25Feature('position_opt');draw();}
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 3. REPERTOIRE PROGRESS MAP Canvas 620x400 ================
function buildRepertoireMapUI(){
  var CATEGORIES=['동요','클래식','팔','영화OST','케이팝','재즈','J-POP','민요','찬송가','기타'];
  makeV25Modal('repertoire-map-modal','레퍼토리 진행 맵',function(content){
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selCat=0;
    var completions=ls25Get('rep_completions',CATEGORIES.map(function(){return Math.floor(Math.random()*70+10)}));
    var songCounts=[28,65,24,22,18,12,15,10,8,20];
    var colors=['#ef4444','#f59e0b','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f97316','#14b8a6'];
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('레퍼토리 진행 맵',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('10카테고리 222곡 진행률 · 카테고리별 완료 비율',15,42);
      var totalArea=500*280;
      var totalSongs=songCounts.reduce(function(a,b){return a+b},0);
      var cx=60,cy=60,maxW=500,maxH=280;
      var x=cx,y=cy,rowH=0;
      CATEGORIES.forEach(function(cat,i){
        var area=songCounts[i]/totalSongs*totalArea;
        var w=Math.max(60,Math.min(maxW-x+cx,Math.sqrt(area*1.5)));
        var h=area/w;
        if(x+w>cx+maxW){x=cx;y+=rowH+2;rowH=0;}
        if(h>maxH-(y-cy)){h=maxH-(y-cy);}
        rowH=Math.max(rowH,h);
        var sel=i===selCat;
        var alpha=completions[i]/100;
        ctx.fillStyle=colors[i];
        ctx.globalAlpha=sel?0.9:0.5+alpha*0.3;
        ctx.fillRect(x,y,w-2,h-2);
        ctx.globalAlpha=1;
        if(sel){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y,w-2,h-2);}
        ctx.fillStyle='#fff';ctx.font=h>40?'bold 10px sans-serif':'bold 8px sans-serif';
        ctx.textAlign='center';
        ctx.fillText(cat,x+w/2-1,y+h/2-4);
        ctx.font='8px sans-serif';
        ctx.fillText(completions[i]+'%',x+w/2-1,y+h/2+8);
        x+=w;
      });
      ctx.textAlign='left';
      var sc=CATEGORIES[selCat];
      var totalComp=Math.round(completions.reduce(function(a,b){return a+b},0)/completions.length);
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';
      ctx.fillText('선택: '+sc+' ('+songCounts[selCat]+'곡, '+completions[selCat]+'% 완료)',15,365);
      ctx.fillStyle=gradeColor25(gradeOf25(totalComp));ctx.font='bold 14px sans-serif';
      ctx.fillText('종합 진행률: '+totalComp+'% ['+gradeOf25(totalComp)+']',400,365);
    }
    canvas.addEventListener('click',function(e){
      selCat=(selCat+1)%CATEGORIES.length;
      completions[selCat]=Math.min(100,completions[selCat]+Math.floor(Math.random()*5+1));
      ls25Set('rep_completions',completions);
      playSFX25('map_click');markV25Feature('repertoire_map');draw();
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 4. DAILY PRACTICE OPTIMIZER Canvas 600x380 ================
function buildDailyOptimizerUI(){
  var HOURS=['6시','7시','8시','9시','10시','11시','12시','13시','14시','15시','16시','17시','18시','19시','20시','21시','22시','23시'];
  var DAYS=['월','화','수','목','금','토','일'];
  makeV25Modal('daily-opt-modal','하루 연습 최적화 대시보드',function(content){
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var heatData=ls25Get('daily_heat',[]);
    if(!heatData.length){
      heatData=[];
      for(var d=0;d<7;d++){
        var row=[];
        for(var h=0;h<18;h++){
          var base=0;
          if(h>=4&&h<=8) base=60;
          else if(h>=12&&h<=16) base=75;
          else if(h>=10&&h<=11) base=40;
          else base=20;
          if(d>=5) base+=15;
          row.push(Math.min(100,Math.max(0,base+Math.floor(Math.random()*30-15))));
        }
        heatData.push(row);
      }
      ls25Set('daily_heat',heatData);
    }
    var selDay=0,selHour=14;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('하루 연습 최적화 대시보드',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('7요일 × 18시간대 연습효율 히트맵',15,42);
      var cellW=28,cellH=28,startX=50,startY=65;
      HOURS.forEach(function(h,hi){
        ctx.fillStyle='#6b7a9a';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(h,startX+hi*cellW+cellW/2,startY-5);
      });
      DAYS.forEach(function(day,di){
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText(day,startX-8,startY+di*cellH+cellH/2+3);
        HOURS.forEach(function(h,hi){
          var val=heatData[di][hi];
          var x=startX+hi*cellW,y=startY+di*cellH;
          var sel=di===selDay&&hi===selHour;
          if(val>=75) ctx.fillStyle=sel?'#22c55e':'rgba(34,197,94,0.7)';
          else if(val>=55) ctx.fillStyle=sel?'#eab308':'rgba(234,179,8,0.5)';
          else if(val>=35) ctx.fillStyle=sel?'#f59e0b':'rgba(245,158,11,0.35)';
          else ctx.fillStyle=sel?'#ef4444':'rgba(239,68,68,0.2)';
          ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
          if(sel){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y,cellW,cellH);}
          ctx.fillStyle=val>=55?'#fff':'#8892a8';ctx.font='bold 7px sans-serif';ctx.textAlign='center';
          ctx.fillText(val,x+cellW/2,y+cellH/2+3);
        });
      });
      ctx.textAlign='left';
      var bestH=0,bestD=0,bestVal=0;
      heatData.forEach(function(row,di){row.forEach(function(v,hi){if(v>bestVal){bestVal=v;bestH=hi;bestD=di;}});});
      ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';
      ctx.fillText('최적 시간: '+DAYS[bestD]+' '+HOURS[bestH]+' (효율 '+bestVal+'%)',15,310);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('선택: '+DAYS[selDay]+' '+HOURS[selHour]+' → 효율 '+heatData[selDay][selHour]+'%',15,328);
      var avgEff=Math.round(heatData.reduce(function(a,r){return a+r.reduce(function(b,c){return b+c},0)},0)/(7*18));
      ctx.fillText('전체 평균 효율: '+avgEff+'%',15,346);
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      ctx.fillText('레전드: 🟢 고효율(75%+)  🟡 중간(55%+)  🟠 낮음(35%+)  🔴 비효율',15,368);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      var cellW=28,cellH=28,startX=50,startY=65;
      var hi=Math.floor((mx-startX)/cellW);
      var di=Math.floor((my-startY)/cellH);
      if(hi>=0&&hi<18&&di>=0&&di<7){
        selHour=hi;selDay=di;
        heatData[di][hi]=Math.min(100,heatData[di][hi]+Math.floor(Math.random()*5+1));
        ls25Set('daily_heat',heatData);
        playSFX25('daily_calc');markV25Feature('daily_optimizer');draw();
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 5. MUSIC GLOSSARY EXPLORER Canvas 620x380 ================
function buildGlossaryUI(){
  var TERMS=[
    {term:'Adagio',meaning:'느리게',cat:'빠르기'},{term:'Allegro',meaning:'빠르게',cat:'빠르기'},
    {term:'Andante',meaning:'걸으며',cat:'빠르기'},{term:'Presto',meaning:'매우 빠르게',cat:'빠르기'},
    {term:'Moderato',meaning:'보통 빠르기로',cat:'빠르기'},{term:'Largo',meaning:'매우 느리게',cat:'빠르기'},
    {term:'Forte',meaning:'강하게',cat:'셈여림'},{term:'Piano',meaning:'여리게',cat:'셈여림'},
    {term:'Crescendo',meaning:'점점 강하게',cat:'셈여림'},{term:'Diminuendo',meaning:'점점 여리게',cat:'셈여림'},
    {term:'Fortissimo',meaning:'매우 강하게',cat:'셈여림'},{term:'Pianissimo',meaning:'매우 여리게',cat:'셈여림'},
    {term:'Staccato',meaning:'끊어서',cat:'주법'},{term:'Legato',meaning:'이어서',cat:'주법'},
    {term:'Fermata',meaning:'늘임표',cat:'주법'},{term:'Arpeggio',meaning:'분산 화음',cat:'주법'},
    {term:'Rubato',meaning:'자유로운 템포',cat:'주법'},{term:'Sforzando',meaning:'갑자기 강하게',cat:'주법'},
    {term:'Da Capo',meaning:'처음부터',cat:'구조'},{term:'Coda',meaning:'끝맺음',cat:'구조'},
    {term:'Ritardando',meaning:'점점 느리게',cat:'빠르기'},{term:'Accelerando',meaning:'점점 빠르게',cat:'빠르기'},
    {term:'Trill',meaning:'트릴 (빠른 교대)',cat:'장식'},{term:'Mordent',meaning:'모르덴트',cat:'장식'},
    {term:'Cadenza',meaning:'독주 자유 연주',cat:'구조'},{term:'Glissando',meaning:'미끄러져 연주',cat:'주법'}
  ];
  var CATS=['빠르기','셈여림','주법','구조','장식'];
  var catColors={'빠르기':'#4a7dff','셈여림':'#36d399','주법':'#a855f7','구조':'#f59e0b','장식':'#ec4899'};
  makeV25Modal('glossary-modal','음악 용어 탐험기',function(content){
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selIdx=0,page=0,perPage=12;
    var learned=ls25Get('glossary_learned',[]);
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('음악 용어 탐험기',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText(TERMS.length+'개 용어 · 5카테고리 · 학습완료: '+learned.length+'/'+TERMS.length,15,42);
      var startIdx=page*perPage;
      var endIdx=Math.min(startIdx+perPage,TERMS.length);
      var cols=3,rows=4,cw=190,ch=60,gx=10,gy=8,sx=15,sy=55;
      for(var i=startIdx;i<endIdx;i++){
        var ri=i-startIdx;
        var col=ri%cols,row=Math.floor(ri/cols);
        var x=sx+col*(cw+gx),y=sy+row*(ch+gy);
        var t=TERMS[i];
        var sel=i===selIdx;
        var isLearned=learned.indexOf(t.term)!==-1;
        ctx.fillStyle=sel?'rgba(74,125,255,0.2)':isLearned?'rgba(34,197,94,0.08)':'rgba(30,38,64,0.5)';
        ctx.fillRect(x,y,cw,ch);
        if(sel){ctx.strokeStyle='#4a7dff';ctx.lineWidth=2;ctx.strokeRect(x,y,cw,ch);}
        if(isLearned){ctx.strokeStyle='rgba(34,197,94,0.3)';ctx.lineWidth=1;ctx.strokeRect(x,y,cw,ch);}
        ctx.fillStyle=catColors[t.cat]||'#4a7dff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
        ctx.fillText(t.term,x+8,y+20);
        ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';
        ctx.fillText(t.meaning,x+8,y+38);
        ctx.fillStyle=catColors[t.cat]||'#6b7a9a';ctx.font='7px sans-serif';
        ctx.fillText(t.cat,x+8,y+52);
        if(isLearned){ctx.fillStyle='#22c55e';ctx.font='10px sans-serif';ctx.textAlign='right';ctx.fillText('✓',x+cw-8,y+20);}
      }
      ctx.textAlign='left';
      var totalPages=Math.ceil(TERMS.length/perPage);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('페이지 '+(page+1)+'/'+totalPages+' | 클릭으로 학습 완료 표시 | 위아래 클릭으로 페이지 이동',15,360);
      var pct=Math.round(learned.length/TERMS.length*100);
      ctx.fillStyle=gradeColor25(gradeOf25(pct));ctx.font='bold 14px sans-serif';
      ctx.fillText('마스터리: '+pct+'% ['+gradeOf25(pct)+']',450,360);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      if(my>320){
        if(mx<310) page=Math.max(0,page-1);
        else page=Math.min(Math.ceil(TERMS.length/perPage)-1,page+1);
        playSFX25('glossary_flip');draw();return;
      }
      var cols=3,cw=190,ch=60,gx=10,gy=8,sx=15,sy=55;
      var col=Math.floor((mx-sx)/(cw+gx));
      var row=Math.floor((my-sy)/(ch+gy));
      if(col>=0&&col<cols&&row>=0&&row<4){
        var idx=page*12+row*cols+col;
        if(idx<TERMS.length){
          selIdx=idx;
          var term=TERMS[idx].term;
          if(learned.indexOf(term)===-1){learned.push(term);ls25Set('glossary_learned',learned);}
          playSFX25('glossary_learn');markV25Feature('glossary');draw();
        }
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 6. MELODY MEMORY CHALLENGE Canvas 600x380 ================
function buildMelodyMemoryUI(){
  var NOTES_POOL=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
  var NOTE_COLORS={'C4':'#ef4444','D4':'#f59e0b','E4':'#eab308','F4':'#22c55e','G4':'#06b6d4','A4':'#3b82f6','B4':'#8b5cf6','C5':'#ec4899','D5':'#f97316','E5':'#14b8a6'};
  makeV25Modal('melody-memory-modal','멜로디 메모리 챌린지',function(content){
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var level=ls25Get('mem_level',1);
    var hiScore=ls25Get('mem_hiscore',0);
    var seqLen=level+2;
    var sequence=[];var userSeq=[];var phase='idle';var score=0;var showIdx=-1;
    function genSeq(){
      sequence=[];
      for(var i=0;i<seqLen;i++) sequence.push(NOTES_POOL[Math.floor(Math.random()*NOTES_POOL.length)]);
      userSeq=[];phase='showing';showIdx=0;
    }
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('멜로디 메모리 챌린지',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('레벨 '+level+' · '+seqLen+'음 기억 · 최고점: '+hiScore,15,42);
      var btnW=50,btnH=50,gap=6,sx=30,sy=80;
      NOTES_POOL.forEach(function(n,i){
        var col=i%5,row=Math.floor(i/5);
        var x=sx+col*(btnW+gap),y=sy+row*(btnH+gap);
        var isHighlight=(phase==='showing'&&showIdx>=0&&sequence[showIdx]===n);
        ctx.fillStyle=isHighlight?NOTE_COLORS[n]||'#4a7dff':'rgba(30,38,64,0.7)';
        ctx.fillRect(x,y,btnW,btnH);
        ctx.strokeStyle=NOTE_COLORS[n]||'#4a7dff';ctx.lineWidth=isHighlight?3:1;ctx.strokeRect(x,y,btnW,btnH);
        ctx.fillStyle=isHighlight?'#fff':'#8892a8';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
        ctx.fillText(n,x+btnW/2,y+btnH/2+4);
      });
      ctx.textAlign='left';
      if(phase==='showing'){
        ctx.fillStyle='#f59e0b';ctx.font='bold 14px sans-serif';
        ctx.fillText('기억하세요! ('+(showIdx+1)+'/'+seqLen+')',15,220);
        var seqStr=sequence.slice(0,showIdx+1).join(' → ');
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';
        ctx.fillText(seqStr,15,240);
      } else if(phase==='input'){
        ctx.fillStyle='#4a7dff';ctx.font='bold 14px sans-serif';
        ctx.fillText('입력하세요! ('+userSeq.length+'/'+seqLen+')',15,220);
        var usStr=userSeq.join(' → ');
        ctx.fillStyle='#e8ecf4';ctx.font='12px sans-serif';
        ctx.fillText(usStr,15,240);
      } else if(phase==='success'){
        ctx.fillStyle='#22c55e';ctx.font='bold 16px sans-serif';
        ctx.fillText('성공! 점수: '+score+' | 다음 레벨으로!',15,230);
      } else if(phase==='fail'){
        ctx.fillStyle='#ef4444';ctx.font='bold 16px sans-serif';
        ctx.fillText('실패! 정답: '+sequence.join('→'),15,230);
      } else {
        ctx.fillStyle='#8892a8';ctx.font='14px sans-serif';
        ctx.fillText('클릭하여 시작!',15,230);
      }
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('스코어 바: ',15,280);
      var barW=Math.min(score*8,500);
      ctx.fillStyle='rgba(74,125,255,0.3)';ctx.fillRect(80,270,500,14);
      ctx.fillStyle='#4a7dff';ctx.fillRect(80,270,barW,14);
      ctx.fillStyle='#e8ecf4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(score,80+barW/2,281);
      ctx.textAlign='left';
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      ctx.fillText('레벨별 시퀀스 길이: Lv1=3음, Lv2=4음, ... 난이도 점진적 상승',15,310);
      ctx.fillText('클릭 → 시작 → 음 기억 → 순서대로 클릭',15,326);
      var g=gradeOf25(Math.min(100,score*10));
      ctx.fillStyle=gradeColor25(g);ctx.font='bold 16px sans-serif';
      ctx.fillText('등급: '+g,520,326);
    }
    function advanceShow(){
      showIdx++;
      if(showIdx>=seqLen){phase='input';draw();return;}
      draw();
      setTimeout(function(){advanceShow();},800);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width);
      var my=(e.clientY-rect.top)*(380/rect.height);
      if(phase==='idle'||phase==='success'||phase==='fail'){
        if(phase==='success'){level++;seqLen=level+2;ls25Set('mem_level',level);}
        if(phase==='fail'){level=1;seqLen=3;score=0;ls25Set('mem_level',level);}
        genSeq();draw();
        setTimeout(function(){advanceShow();},500);
        playSFX25('memory_note');markV25Feature('melody_memory');return;
      }
      if(phase==='input'){
        var btnW=50,btnH=50,gap=6,sx=30,sy=80;
        NOTES_POOL.forEach(function(n,i){
          var col=i%5,row=Math.floor(i/5);
          var x=sx+col*(btnW+gap),y=sy+row*(btnH+gap);
          if(mx>=x&&mx<=x+btnW&&my>=y&&my<=y+btnH){
            userSeq.push(n);
            playSFX25('memory_note');
            if(userSeq.length===seqLen){
              var correct=true;
              for(var j=0;j<seqLen;j++){if(userSeq[j]!==sequence[j]){correct=false;break;}}
              if(correct){score+=level;if(score>hiScore){hiScore=score;ls25Set('mem_hiscore',hiScore);}phase='success';playSFX25('memory_success');}
              else{phase='fail';}
            }
            draw();
          }
        });
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 7. SCORE READING GUIDE Canvas 620x400 ================
function buildScoreReadingUI(){
  var SECTIONS=[
    {name:'조표 (Key Signature)',desc:'장조/단조를 결정하는 샴/플랫 표시',items:['C장조 (0개)','♯1~7개 (샴)','♭1~7개 (플랫)'],mastery:0},
    {name:'박자표 (Time Signature)',desc:'마디당 박수와 기본박 단위',items:['4/4 보통박자','3/4 왜츠','6/8 복합박자'],mastery:0},
    {name:'다이나믹 (Dynamics)',desc:'pp~ff 셌여림 변화',items:['pp-p-mp 여림','mf-f-ff 강함','cresc./dim. 점진'],mastery:0},
    {name:'아티톴레이션',desc:'음의 연주 방법 지정',items:['Staccato 끊어서','Legato 이어서','Accent 강조'],mastery:0},
    {name:'반복 구조',desc:'D.C./D.S./Coda/반복기호',items:['Da Capo 처음부터','Dal Segno 기호부터','Coda 끝맺음'],mastery:0},
    {name:'장식음',desc:'트릴/모르덴트/턴/아포지아투라',items:['Trill tr','Mordent 날카로운','Turn 턴'],mastery:0},
    {name:'페달 표시',desc:'Ped/*/una corda',items:['댓퍼페달 Ped.','달퍼페달 *','una corda 소프트'],mastery:0},
    {name:'테마/표현',desc:'음악적 표현 지시',items:['Dolce 부드럽게','Espressivo 표현적','Con fuoco 불처럼'],mastery:0}
  ];
  makeV25Modal('score-reading-modal','악보 해석 가이드',function(content){
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var selSec=0;
    var masteries=ls25Get('score_masteries',SECTIONS.map(function(){return Math.floor(Math.random()*50+20)}));
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('악보 해석 가이드',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('8섭션 · 악보기호 종합 학습',15,42);
      var barH=35,gap=6,startY=60,maxW=320;
      var colors=['#ef4444','#f59e0b','#eab308','#22c55e','#06b6d4','#3b82f6','#a855f7','#ec4899'];
      SECTIONS.forEach(function(sec,i){
        var y=startY+i*(barH+gap);
        var sel=i===selSec;
        ctx.fillStyle=sel?'rgba(74,125,255,0.1)':'transparent';
        ctx.fillRect(0,y,620,barH);
        ctx.fillStyle=sel?'#e8ecf4':'#8892a8';ctx.font=sel?'bold 10px sans-serif':'10px sans-serif';
        ctx.textAlign='left';ctx.fillText(sec.name,15,y+14);
        ctx.fillStyle='#6b7a9a';ctx.font='8px sans-serif';ctx.fillText(sec.desc,15,y+28);
        var bx=230,w=masteries[i]/100*maxW;
        ctx.fillStyle='rgba(30,38,64,0.5)';ctx.fillRect(bx,y+5,maxW,barH-10);
        ctx.fillStyle=colors[i];ctx.fillRect(bx,y+5,w,barH-10);
        if(sel){ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(bx,y+5,maxW,barH-10);}
        ctx.fillStyle='#e8ecf4';ctx.font='bold 10px sans-serif';ctx.textAlign='right';
        ctx.fillText(masteries[i]+'%',bx+maxW+35,y+barH/2+4);
        var g=gradeOf25(masteries[i]);
        ctx.fillStyle=gradeColor25(g);ctx.font='bold 12px sans-serif';
        ctx.fillText(g,bx+maxW+60,y+barH/2+4);
      });
      ctx.textAlign='left';
      var sec=SECTIONS[selSec];
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('세부: '+sec.name,15,380);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText(sec.items.join(' | '),200,380);
      var avg=Math.round(masteries.reduce(function(a,b){return a+b},0)/masteries.length);
      ctx.fillStyle=gradeColor25(gradeOf25(avg));ctx.font='bold 10px sans-serif';
      ctx.fillText('종합: '+avg+'%',560,380);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var my=(e.clientY-rect.top)*(400/rect.height);
      var barH=35,gap=6,startY=60;
      var idx=Math.floor((my-startY)/(barH+gap));
      if(idx>=0&&idx<SECTIONS.length){
        selSec=idx;
        masteries[idx]=Math.min(100,masteries[idx]+Math.floor(Math.random()*8+2));
        ls25Set('score_masteries',masteries);
        playSFX25('score_section');markV25Feature('score_reading');draw();
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 8. COMPREHENSIVE SKILL DIAGNOSIS Canvas 620x400 ================
function buildSkillDiagnosisUI(){
  var DIMS=['테크닉','리듬감','음악성','초견력','화성이해','음감','스타일','이론지식'];
  var ARCHETYPES=[
    {name:'테크니션',desc:'기술적 완뱽 추구',weights:[1,0.5,0.3,0.8,0.4,0.3,0.5,0.4]},
    {name:'로맨티스트',desc:'감정적 표현 중심',weights:[0.5,0.6,1,0.4,0.7,0.8,0.7,0.5]},
    {name:'이론가',desc:'음악 이해 기반',weights:[0.4,0.5,0.6,0.5,1,0.7,0.4,1]},
    {name:'퍼포머',desc:'무대 중심 연주',weights:[0.8,0.7,0.8,0.6,0.5,0.6,1,0.3]},
    {name:'올라운더',desc:'균형 잡힌 종합형',weights:[0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7]},
    {name:'인프로바이저',desc:'즉흥 창작 특화',weights:[0.6,0.8,0.9,0.3,0.8,0.9,0.8,0.6]}
  ];
  makeV25Modal('skill-diag-modal','종합 피아노 실력 진단',function(content){
    var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
    canvas.style.cssText='width:100%;max-width:620px;background:#0c1020;border-radius:8px;cursor:pointer';
    var scores=ls25Get('diag_scores',DIMS.map(function(){return Math.floor(Math.random()*40+40)}));
    var selDim=0;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,620,400);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,620,400);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('종합 피아노 실력 진단',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('8차원 레이더 + 6아키타입 분류',15,42);
      drawRadar25(ctx,200,220,130,DIMS,scores,100,'rgba(74,125,255,1)',0.25);
      scores.forEach(function(v,i){
        var a=-Math.PI/2+i*(Math.PI*2/8);
        var px=200+Math.cos(a)*130*(v/100),py=220+Math.sin(a)*130*(v/100);
        ctx.fillStyle=i===selDim?'#ffd700':'#4a7dff';
        ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
      });
      var startX=370,startY=60;
      ctx.fillStyle='#e8ecf4';ctx.font='bold 11px sans-serif';ctx.textAlign='left';
      ctx.fillText('차원별 점수',startX,startY);
      DIMS.forEach(function(d,i){
        var y=startY+18+i*28;
        var sel=i===selDim;
        ctx.fillStyle=sel?'#e8ecf4':'#8892a8';ctx.font=sel?'bold 10px sans-serif':'10px sans-serif';
        ctx.fillText(d,startX,y);
        var bx=startX+70,maxW=120,w=scores[i]/100*maxW;
        ctx.fillStyle='rgba(30,38,64,0.5)';ctx.fillRect(bx,y-9,maxW,12);
        ctx.fillStyle=sel?'#4a7dff':'#2a4a8a';ctx.fillRect(bx,y-9,w,12);
        var g=gradeOf25(scores[i]);
        ctx.fillStyle=gradeColor25(g);ctx.font='bold 10px sans-serif';
        ctx.fillText(scores[i]+' '+g,bx+maxW+8,y);
      });
      var avg=Math.round(scores.reduce(function(a,b){return a+b},0)/scores.length);
      var bestArch='',bestScore=-1;
      ARCHETYPES.forEach(function(arch){
        var s=0;
        arch.weights.forEach(function(w,i){s+=w*scores[i];});
        if(s>bestScore){bestScore=s;bestArch=arch.name;}
      });
      ctx.fillStyle='#4a7dff';ctx.font='bold 12px sans-serif';
      ctx.fillText('종합점수: '+avg,370,310);
      ctx.fillStyle=gradeColor25(gradeOf25(avg));ctx.font='bold 18px sans-serif';
      ctx.fillText(gradeOf25(avg),470,310);
      ctx.fillStyle='#a855f7';ctx.font='bold 11px sans-serif';
      ctx.fillText('아키타입: '+bestArch,370,340);
      var archObj=ARCHETYPES.find(function(a){return a.name===bestArch;});
      if(archObj){ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText(archObj.desc,370,358);}
      ctx.fillStyle='#6b7a9a';ctx.font='9px sans-serif';
      ctx.fillText('클릭으로 연습 → 점수 상승',370,380);
    }
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(620/rect.width);
      var my=(e.clientY-rect.top)*(400/rect.height);
      if(mx<340){
        var angle=Math.atan2(my-220,mx-200);
        var normA=(angle+Math.PI/2+Math.PI*2)%(Math.PI*2);
        selDim=Math.floor(normA/(Math.PI*2)*8)%8;
        scores[selDim]=Math.min(100,scores[selDim]+Math.floor(Math.random()*5+2));
        ls25Set('diag_scores',scores);
        playSFX25('diag_scan');markV25Feature('skill_diagnosis');draw();
      } else {
        var startY=78;
        var idx=Math.floor((my-startY)/28);
        if(idx>=0&&idx<8){
          selDim=idx;
          scores[idx]=Math.min(100,scores[idx]+Math.floor(Math.random()*5+2));
          ls25Set('diag_scores',scores);
          playSFX25('diag_scan');markV25Feature('skill_diagnosis');draw();
        }
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ QUIZ v16 (15 Questions, 225->240) ================
function buildQuizV16UI(){
  var QUESTIONS=[
    {q:'C 장조 스케일의 7번째 음은?',a:'B',o:['A','B','G','F']},
    {q:'Adagio의 의미는?',a:'느리게',o:['빠르게','느리게','보통으로','매우 빠르게']},
    {q:'3/4 박자는 어떤 장르에 많이 사용되나요?',a:'왜츠',o:['행진곡','왜츠','록','블루스']},
    {q:'ff는 어떤 셌여림을 뜻하나요?',a:'매우 강하게',o:['여리게','강하게','매우 강하게','보통으로']},
    {q:'Staccato 연주법은?',a:'끊어서 짧게',o:['이어서 길게','끊어서 짧게','점점 빠르게','점점 느리게']},
    {q:'Da Capo(D.C.)의 의미는?',a:'처음부터 반복',o:['처음부터 반복','끝맺음으로','기호부터','한 박 쉼']},
    {q:'페달 표시 Ped.는 어떤 페달을 밟으라는 뜻인가요?',a:'댓퍼 페달',o:['소프트 페달','댓퍼 페달','소스테누토','시프트']},
    {q:'트릴(tr)은 어떤 연주 기법인가요?',a:'빠른 음 교대',o:['미끄러져 연주','빠른 음 교대','힘을 주어','점점 느리게']},
    {q:'포지션 C에서 엄지가 놓이는 건반은?',a:'C',o:['D','E','C','G']},
    {q:'포르테피아노(fp)의 의미는?',a:'강하게 후 바로 여리게',o:['점점 강하게','강하게 후 바로 여리게','여리게 후 강하게','보통 강도']},
    {q:'페르마타 기호의 의미는?',a:'음을 늘려서',o:['음을 끊어서','음을 늘려서','음을 반복','음을 높이게']},
    {q:'Rubato 연주법은?',a:'자유로운 템포 변화',o:['정확한 박자','자유로운 템포 변화','빠른 템포','느린 템포']},
    {q:'편하게 연주하기 좋은 초보자 포지션은?',a:'C 포지션',o:['A 포지션','C 포지션','E 포지션','Bb 포지션']},
    {q:'도리안 스케일의 특징은?',a:'장조에서 6번째 음을 낮춤',o:['단조에서 7번째 음을 높임','장조에서 6번째 음을 낮춤','장조에서 3번째 음을 낮춤','단조에서 2번째 음을 높임']},
    {q:'멜로디 메모리 훈련에서 가장 중요한 것은?',a:'음정 순서 기억',o:['리듬만 따라하기','음정 순서 기억','빠른 속도로 치기','큰 소리로 연주']}
  ];
  makeV25Modal('quiz16-modal','피아노 퀴즈 v16',function(content){
    var canvas=document.createElement('canvas');canvas.width=600;canvas.height=380;
    canvas.style.cssText='width:100%;max-width:600px;background:#0c1020;border-radius:8px;cursor:pointer';
    var qIdx=0,answered=false,correct=0,total=0;
    var stats=ls25Get('quiz16_stats',{correct:0,total:0});
    correct=stats.correct;total=stats.total;
    function draw(){
      var ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,380);
      ctx.fillStyle='#0c1020';ctx.fillRect(0,0,600,380);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('피아노 퀴즈 v16',15,25);
      ctx.fillStyle='#6b7a9a';ctx.font='10px sans-serif';
      ctx.fillText('문제 '+(qIdx+1)+'/'+QUESTIONS.length+' | 정답률: '+(total>0?Math.round(correct/total*100):0)+'% ('+correct+'/'+total+')',15,42);
      var q=QUESTIONS[qIdx];
      ctx.fillStyle='#e8ecf4';ctx.font='bold 14px sans-serif';
      ctx.fillText('Q. '+q.q,20,80);
      q.o.forEach(function(opt,i){
        var y=110+i*55;
        var isAnswer=opt===q.a;
        var bg='rgba(30,38,64,0.7)';
        if(answered){bg=isAnswer?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.1)';}
        ctx.fillStyle=bg;ctx.fillRect(20,y,560,42);
        ctx.strokeStyle=answered&&isAnswer?'#22c55e':'#1e2640';ctx.lineWidth=answered&&isAnswer?2:1;
        ctx.strokeRect(20,y,560,42);
        ctx.fillStyle=answered&&isAnswer?'#22c55e':'#e8ecf4';ctx.font='12px sans-serif';ctx.textAlign='left';
        ctx.fillText((i+1)+'. '+opt,35,y+26);
      });
      ctx.textAlign='left';
      if(answered){
        ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
        ctx.fillText('클릭하여 다음 문제로',20,350);
      }
      var pct=total>0?Math.round(correct/total*100):0;
      ctx.fillStyle=gradeColor25(gradeOf25(pct));ctx.font='bold 14px sans-serif';
      ctx.fillText('등급: '+gradeOf25(pct),500,350);
    }
    canvas.addEventListener('click',function(e){
      if(answered){answered=false;qIdx=(qIdx+1)%QUESTIONS.length;draw();return;}
      var rect=canvas.getBoundingClientRect();
      var my=(e.clientY-rect.top)*(380/rect.height);
      var q=QUESTIONS[qIdx];
      for(var i=0;i<q.o.length;i++){
        var y=110+i*55;
        if(my>=y&&my<=y+42){
          answered=true;total++;
          if(q.o[i]===q.a){correct++;playSFX25('quiz_correct25');}
          ls25Set('quiz16_stats',{correct:correct,total:total});
          markV25Feature('quiz_v16');draw();break;
        }
      }
    });
    content.appendChild(canvas);draw();
  });
}

// ================ 12 NEW ACHIEVEMENTS (228->240) ================
function injectV25Achievements(){
  if(!window.app||!app.achievements) return;
  var newAch=[
    {id:'v25_scale1',name:'스케일 입문',desc:'스케일 마스터리 처음 사용',icon:'🎵',unlocked:false},
    {id:'v25_scale2',name:'스케일 마스터',desc:'스케일 6개 이상 S등급',icon:'🏆',unlocked:false},
    {id:'v25_pos1',name:'포지션 탐험가',desc:'포지션 옵티마이저 4개 이상 확인',icon:'👋',unlocked:false},
    {id:'v25_rep1',name:'레퍼토리 탐험가',desc:'레퍼토리 맵 5카테고리 확인',icon:'🗺️',unlocked:false},
    {id:'v25_daily1',name:'연습 스케줄러',desc:'하루 연습 최적화 3회 사용',icon:'📅',unlocked:false},
    {id:'v25_gloss1',name:'용어 수집가',desc:'음악 용어 12개 이상 학습',icon:'📖',unlocked:false},
    {id:'v25_gloss2',name:'용어 박사',desc:'음악 용어 전체 학습 완료',icon:'🎓',unlocked:false},
    {id:'v25_mem1',name:'멜로디 기억자',desc:'멜로디 메모리 Lv3 클리어',icon:'🧠',unlocked:false},
    {id:'v25_mem2',name:'메모리 챔피언',desc:'멜로디 메모리 10점 이상',icon:'🥇',unlocked:false},
    {id:'v25_score1',name:'악보 해석가',desc:'악보 가이드 4섭션 이상 50%+',icon:'📜',unlocked:false},
    {id:'v25_diag1',name:'자기진단 완료',desc:'실력 진단 처음 사용',icon:'🔍',unlocked:false},
    {id:'v25_diag2',name:'만능 피아니스트',desc:'진단 전 차원 70%+',icon:'⭐',unlocked:false}
  ];
  newAch.forEach(function(a){
    var exists=app.achievements.some(function(ex){return ex.id===a.id});
    if(!exists) app.achievements.push(a);
  });
}

function checkV25Achievements(){
  if(!window.app||!app.achievements) return;
  var checks=[
    {id:'v25_scale1',fn:function(){return (ls25Get('features_used',[])).indexOf('scale_mastery')!==-1;}},
    {id:'v25_scale2',fn:function(){var sp=ls25Get('scale_speeds',[]);var ac=ls25Get('scale_accuracies',[]);var sCount=0;for(var i=0;i<sp.length;i++){var c=Math.round((sp[i]/120*50)+(ac[i]/100*50));if(c>=90)sCount++;}return sCount>=6;}},
    {id:'v25_pos1',fn:function(){return (ls25Get('features_used',[])).indexOf('position_opt')!==-1;}},
    {id:'v25_rep1',fn:function(){return (ls25Get('features_used',[])).indexOf('repertoire_map')!==-1;}},
    {id:'v25_daily1',fn:function(){return (ls25Get('features_used',[])).indexOf('daily_optimizer')!==-1;}},
    {id:'v25_gloss1',fn:function(){return ls25Get('glossary_learned',[]).length>=12;}},
    {id:'v25_gloss2',fn:function(){return ls25Get('glossary_learned',[]).length>=26;}},
    {id:'v25_mem1',fn:function(){return ls25Get('mem_level',1)>=3;}},
    {id:'v25_mem2',fn:function(){return ls25Get('mem_hiscore',0)>=10;}},
    {id:'v25_score1',fn:function(){var m=ls25Get('score_masteries',[]);var c=0;m.forEach(function(v){if(v>=50)c++;});return c>=4;}},
    {id:'v25_diag1',fn:function(){return (ls25Get('features_used',[])).indexOf('skill_diagnosis')!==-1;}},
    {id:'v25_diag2',fn:function(){var s=ls25Get('diag_scores',[]);return s.length>=8&&s.every(function(v){return v>=70;});}}
  ];
  checks.forEach(function(c){
    var ach=app.achievements.find(function(a){return a.id===c.id});
    if(ach&&!ach.unlocked&&c.fn()){
      ach.unlocked=true;
      if(app.showToast) app.showToast('🏆 업적 해금: '+ach.name,'achievement');
      playSFX25('v25_achieve');
    }
  });
}

// ================ KEYBOARD SHORTCUTS v25 ================
function setupV25Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var map={'A':'scale-mastery-modal','S':'position-opt-modal','D':'repertoire-map-modal',
             'F':'daily-opt-modal','G':'glossary-modal','H':'melody-memory-modal',
             'J':'score-reading-modal','K':'skill-diag-modal','0':'quiz16-modal'};
    var key=e.key.toUpperCase();
    if(map[key]){
      e.preventDefault();
      var m=document.getElementById(map[key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV25NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎼 스케일',modal:'scale-mastery-modal'},
    {label:'👋 포지션',modal:'position-opt-modal'},
    {label:'🗺️ 레퍼토리',modal:'repertoire-map-modal'},
    {label:'📅 하루최적화',modal:'daily-opt-modal'},
    {label:'📖 용어사전',modal:'glossary-modal'},
    {label:'🧠 메모리',modal:'melody-memory-modal'},
    {label:'📜 악보해석',modal:'score-reading-modal'},
    {label:'🔍 실력진단',modal:'skill-diag-modal'},
    {label:'🧠 퀴즈v16',modal:'quiz16-modal'}
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
function initV25(){
  addV25Songs();
  buildScaleMasteryUI();
  buildPositionOptimizerUI();
  buildRepertoireMapUI();
  buildDailyOptimizerUI();
  buildGlossaryUI();
  buildMelodyMemoryUI();
  buildScoreReadingUI();
  buildSkillDiagnosisUI();
  buildQuizV16UI();
  injectV25Achievements();
  setupV25Shortcuts();
  injectV25NavButtons();
  setInterval(checkV25Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV25,6800);});
else setTimeout(initV25,6800);
})();
