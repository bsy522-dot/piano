// Piano Master v22 Patch Module
// Emotion Matrix, Improv Generator, Interval Tower, Harmonic Analyzer,
// Energy Manager, Finger Gym, Moodboard, Milestone Roadmap
// 10 Songs (182->192), Quiz v13 15Q (180->195), 12 Achievements (192->204), SFX 14, Keyboard 8
(function(){
'use strict';
if(window.__v22Loaded) return;
window.__v22Loaded = true;

var LS22 = 'piano-v22-';
function ls22Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS22+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls22Set(k,v){localStorage.setItem(LS22+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v22 (14 sounds) ================
var sfx22 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone22(freq,type,dur,gainVal,delayMs){
  if(!sfx22) return;
  setTimeout(function(){
    if(!sfx22) return;
    var t=sfx22.currentTime,g=sfx22.createGain(),o=sfx22.createOscillator();
    o.connect(g);g.connect(sfx22.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX22(type){
  if(!sfx22) return;
  if(sfx22.state==='suspended') sfx22.resume();
  switch(type){
    case 'emotion_select': tone22(440,'triangle',0.15,0.06,0); tone22(554,'triangle',0.15,0.06,80); break;
    case 'emotion_clear': tone22(330,'sine',0.1,0.05,0); break;
    case 'improv_generate': tone22(523,'triangle',0.1,0.07,0); tone22(659,'triangle',0.1,0.07,60); tone22(784,'triangle',0.1,0.07,120); break;
    case 'improv_play': tone22(392,'sine',0.2,0.06,0); break;
    case 'interval_build': tone22(440,'triangle',0.12,0.06,0); tone22(554,'sine',0.12,0.06,80); break;
    case 'interval_correct': tone22(659,'triangle',0.1,0.08,0); tone22(880,'triangle',0.15,0.08,80); break;
    case 'harmony_analyze': tone22(262,'triangle',0.2,0.05,0); tone22(330,'triangle',0.2,0.05,0); tone22(392,'triangle',0.2,0.05,0); break;
    case 'energy_set': tone22(349,'sine',0.15,0.06,0); break;
    case 'finger_start': tone22(523,'triangle',0.08,0.06,0); tone22(659,'triangle',0.08,0.06,60); break;
    case 'finger_complete': tone22(784,'triangle',0.12,0.08,0); tone22(1047,'triangle',0.18,0.08,100); break;
    case 'mood_select': tone22(440,'sine',0.12,0.05,0); tone22(523,'sine',0.12,0.05,80); break;
    case 'milestone_check': tone22(523,'triangle',0.1,0.07,0); tone22(784,'triangle',0.15,0.07,100); tone22(1047,'triangle',0.2,0.07,200); break;
    case 'v22_achieve': tone22(523,'triangle',0.1,0.1,0); tone22(659,'triangle',0.12,0.1,80); tone22(784,'triangle',0.12,0.1,160); tone22(1047,'triangle',0.25,0.1,240); break;
    case 'quiz_correct': tone22(659,'triangle',0.1,0.07,0); tone22(784,'triangle',0.12,0.07,80); break;
  }
}

// ================ COMMON MODAL BUILDER v22 ================
function makeV22Modal(id, title, contentFn){
  var modal=document.createElement('div');
  modal.id=id;
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);display:none;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);overflow-y:auto;padding:12px';
  var box=document.createElement('div');
  box.style.cssText='background:var(--surface,#141828);border:1px solid var(--border,#1e2640);border-radius:12px;padding:16px;width:min(95vw,640px);max-height:90vh;overflow-y:auto;color:var(--text,#e8ecf4);animation:modalIn 0.3s';
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

function markV22Feature(name){
  var used=ls22Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls22Set('features_used',used);}
}

// ================ 10 NEW SONGS (182->192) ================
function addV22Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s183',name:'리스트 헝가리안 랩소디 2번',category:'클래식',difficulty:'expert',
     notes:[{note:'C#4',time:0,dur:0.3},{note:'D4',time:0.3,dur:0.3},{note:'E4',time:0.6,dur:0.3},{note:'F#4',time:0.9,dur:0.3},{note:'G#4',time:1.2,dur:0.2},{note:'A4',time:1.4,dur:0.2},{note:'B4',time:1.6,dur:0.2},{note:'C#5',time:1.8,dur:0.4},{note:'A4',time:2.2,dur:0.2},{note:'F#4',time:2.4,dur:0.2},{note:'D4',time:2.6,dur:0.3},{note:'C#4',time:2.9,dur:0.6}]},
    {id:'s184',name:'드뷔시 아라베스크 1번',category:'클래식',difficulty:'hard',
     notes:[{note:'E4',time:0,dur:0.4},{note:'F#4',time:0.4,dur:0.4},{note:'G#4',time:0.8,dur:0.4},{note:'A4',time:1.2,dur:0.4},{note:'B4',time:1.6,dur:0.8},{note:'A4',time:2.4,dur:0.4},{note:'G#4',time:2.8,dur:0.4},{note:'F#4',time:3.2,dur:0.4},{note:'E4',time:3.6,dur:0.8},{note:'C#4',time:4.4,dur:0.4},{note:'B3',time:4.8,dur:0.4},{note:'E4',time:5.2,dur:1.0}]},
    {id:'s185',name:'쇼팽 발라드 4번',category:'클래식',difficulty:'expert',
     notes:[{note:'F4',time:0,dur:0.8},{note:'Ab4',time:0.8,dur:0.4},{note:'C5',time:1.2,dur:0.4},{note:'Db5',time:1.6,dur:0.8},{note:'C5',time:2.4,dur:0.4},{note:'Bb4',time:2.8,dur:0.4},{note:'Ab4',time:3.2,dur:0.8},{note:'G4',time:4.0,dur:0.4},{note:'F4',time:4.4,dur:0.4},{note:'Eb4',time:4.8,dur:0.4},{note:'Db4',time:5.2,dur:0.4},{note:'C4',time:5.6,dur:1.0}]},
    {id:'s186',name:'사티 짐노페디 2번',category:'클래식',difficulty:'easy',
     notes:[{note:'D4',time:0,dur:1.0},{note:'F#4',time:1.0,dur:0.5},{note:'A4',time:1.5,dur:0.5},{note:'G4',time:2.0,dur:1.0},{note:'F#4',time:3.0,dur:0.5},{note:'E4',time:3.5,dur:0.5},{note:'D4',time:4.0,dur:1.0},{note:'C#4',time:5.0,dur:0.5},{note:'D4',time:5.5,dur:0.5},{note:'E4',time:6.0,dur:1.0},{note:'F#4',time:7.0,dur:0.5},{note:'A4',time:7.5,dur:1.0}]},
    {id:'s187',name:'바흐 인벤션 1번',category:'클래식',difficulty:'medium',
     notes:[{note:'C4',time:0,dur:0.2},{note:'D4',time:0.2,dur:0.2},{note:'E4',time:0.4,dur:0.2},{note:'F4',time:0.6,dur:0.2},{note:'D4',time:0.8,dur:0.2},{note:'E4',time:1.0,dur:0.2},{note:'C4',time:1.2,dur:0.4},{note:'G4',time:1.6,dur:0.2},{note:'A4',time:1.8,dur:0.2},{note:'B4',time:2.0,dur:0.2},{note:'C5',time:2.2,dur:0.2},{note:'D5',time:2.4,dur:0.6}]},
    {id:'s188',name:'모차르트 소나타 K.545 3악장',category:'클래식',difficulty:'medium',
     notes:[{note:'C5',time:0,dur:0.3},{note:'B4',time:0.3,dur:0.15},{note:'C5',time:0.45,dur:0.15},{note:'D5',time:0.6,dur:0.3},{note:'C5',time:0.9,dur:0.15},{note:'B4',time:1.05,dur:0.15},{note:'A4',time:1.2,dur:0.3},{note:'G4',time:1.5,dur:0.3},{note:'F4',time:1.8,dur:0.3},{note:'E4',time:2.1,dur:0.3},{note:'D4',time:2.4,dur:0.3},{note:'C4',time:2.7,dur:0.6}]},
    {id:'s189',name:'그리그 솔베이그의 노래',category:'클래식',difficulty:'medium',
     notes:[{note:'A4',time:0,dur:0.6},{note:'B4',time:0.6,dur:0.3},{note:'C5',time:0.9,dur:0.3},{note:'E5',time:1.2,dur:0.8},{note:'D5',time:2.0,dur:0.4},{note:'C5',time:2.4,dur:0.4},{note:'B4',time:2.8,dur:0.4},{note:'A4',time:3.2,dur:0.6},{note:'G4',time:3.8,dur:0.3},{note:'A4',time:4.1,dur:0.3},{note:'B4',time:4.4,dur:0.4},{note:'A4',time:4.8,dur:1.0}]},
    {id:'s190',name:'슈베르트 군대 행진곡',category:'클래식',difficulty:'hard',
     notes:[{note:'D4',time:0,dur:0.2},{note:'D4',time:0.2,dur:0.2},{note:'F#4',time:0.4,dur:0.4},{note:'A4',time:0.8,dur:0.4},{note:'D5',time:1.2,dur:0.4},{note:'C#5',time:1.6,dur:0.2},{note:'D5',time:1.8,dur:0.2},{note:'A4',time:2.0,dur:0.4},{note:'F#4',time:2.4,dur:0.4},{note:'D4',time:2.8,dur:0.2},{note:'E4',time:3.0,dur:0.2},{note:'F#4',time:3.2,dur:0.6}]},
    {id:'s191',name:'베토벤 열정 소나타 3악장',category:'클래식',difficulty:'expert',
     notes:[{note:'F3',time:0,dur:0.15},{note:'Ab3',time:0.15,dur:0.15},{note:'C4',time:0.3,dur:0.15},{note:'F4',time:0.45,dur:0.15},{note:'Ab4',time:0.6,dur:0.15},{note:'C5',time:0.75,dur:0.15},{note:'F5',time:0.9,dur:0.3},{note:'E5',time:1.2,dur:0.15},{note:'Db5',time:1.35,dur:0.15},{note:'Bb4',time:1.5,dur:0.15},{note:'Ab4',time:1.65,dur:0.15},{note:'F4',time:1.8,dur:0.5}]},
    {id:'s192',name:'쇼팽 폴로네이즈 영웅',category:'클래식',difficulty:'expert',
     notes:[{note:'Ab3',time:0,dur:0.3},{note:'Ab3',time:0.3,dur:0.15},{note:'Ab3',time:0.45,dur:0.15},{note:'Ab3',time:0.6,dur:0.3},{note:'Eb4',time:0.9,dur:0.3},{note:'C4',time:1.2,dur:0.3},{note:'Db4',time:1.5,dur:0.3},{note:'Eb4',time:1.8,dur:0.6},{note:'F4',time:2.4,dur:0.3},{note:'Gb4',time:2.7,dur:0.3},{note:'Ab4',time:3.0,dur:0.3},{note:'Eb5',time:3.3,dur:0.8}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. EMOTION EXPRESSION MATRIX ================
function buildEmotionMatrixUI(){
  var EMOTIONS=[
    {name:'기쁨',color:'#22c55e',tempo:'Allegro (120-160)',dynamics:'mf-f',artic:'Leggiero, Staccato',desc:'밝고 경쾌한 터치, 높은 음역 활용'},
    {name:'슬픔',color:'#3b82f6',tempo:'Adagio (40-66)',dynamics:'p-mp',artic:'Legato, Sostenuto',desc:'느리고 연결된 프레이징, 단조 진행'},
    {name:'분노',color:'#ef4444',tempo:'Presto (168-200)',dynamics:'ff-fff',artic:'Marcato, Sforzando',desc:'강렬한 어택, 불협화음 활용'},
    {name:'평화',color:'#a78bfa',tempo:'Andante (76-108)',dynamics:'pp-p',artic:'Dolce, Legato',desc:'부드러운 터치, 장3도/완전5도 강조'},
    {name:'열정',color:'#f97316',tempo:'Vivace (140-176)',dynamics:'f-ff',artic:'Appassionato, Tenuto',desc:'힘찬 옥타브, 넓은 다이나믹 범위'},
    {name:'우아',color:'#ec4899',tempo:'Moderato (108-120)',dynamics:'mp-mf',artic:'Grazioso, Cantabile',desc:'노래하는 선율, 아르페지오 반주'},
    {name:'신비',color:'#06b6d4',tempo:'Lento (40-60)',dynamics:'ppp-mp',artic:'Una corda, Tremolo',desc:'약음 페달, 온음계/반음계 진행'},
    {name:'장엄',color:'#eab308',tempo:'Maestoso (80-92)',dynamics:'f-fff',artic:'Pesante, Grandioso',desc:'풍성한 화음, 옥타브 배스 강조'}
  ];

  makeV22Modal('emotion-matrix-modal','🎭 감정 표현 매트릭스',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8종 감정별 연주 표현 기법. 클릭하여 상세 확인!</p>'+
      '<canvas id="emotion-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:pointer"></canvas>'+
      '<div id="emotion-detail" style="margin-top:10px;font-size:12px;color:var(--text2);min-height:40px"></div>';

    var selected=ls22Get('emotion_explored',[]);

    function drawEmotionCanvas(hoverIdx){
      var c=document.getElementById('emotion-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎭 감정 표현 매트릭스',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('탐색: '+selected.length+'/'+EMOTIONS.length,20,42);

      var cols=4,rows=2,cellW=(W-60)/cols,cellH=(H-80)/rows;
      for(var i=0;i<EMOTIONS.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=20+col*(cellW+5),y=55+row*(cellH+5);
        var emo=EMOTIONS[i];
        var isExplored=selected.indexOf(emo.name)!==-1;
        ctx.fillStyle=i===hoverIdx?emo.color:(isExplored?emo.color+'80':'#1e2640');
        ctx.strokeStyle=emo.color;ctx.lineWidth=i===hoverIdx?2:1;
        ctx.beginPath();ctx.roundRect(x,y,cellW,cellH,6);ctx.fill();ctx.stroke();
        ctx.fillStyle=i===hoverIdx?'#fff':'#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
        ctx.fillText(emo.name,x+cellW/2,y+cellH/2-8);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(emo.tempo.split(' ')[0],x+cellW/2,y+cellH/2+10);
        ctx.fillText(emo.dynamics,x+cellW/2,y+cellH/2+24);
        if(isExplored){
          ctx.fillStyle='#22c55e';ctx.font='10px sans-serif';
          ctx.fillText('✓',x+cellW-12,y+14);
        }
        ctx.textAlign='left';
      }
    }

    var canvas=document.getElementById('emotion-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var scaleX=620/rect.width;
      var mx=(e.clientX-rect.left)*scaleX,my=(e.clientY-rect.top)*(400/rect.height);
      var cols=4,cellW=(620-60)/cols,cellH=(400-80)/2;
      for(var i=0;i<EMOTIONS.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=20+col*(cellW+5),y=55+row*(cellH+5);
        if(mx>=x&&mx<=x+cellW&&my>=y&&my<=y+cellH){
          var emo=EMOTIONS[i];
          if(selected.indexOf(emo.name)===-1){selected.push(emo.name);ls22Set('emotion_explored',selected);}
          playSFX22('emotion_select');markV22Feature('emotion_matrix');
          document.getElementById('emotion-detail').innerHTML=
            '<div style="border-left:3px solid '+emo.color+';padding-left:8px">'+
            '<b style="color:'+emo.color+'">'+emo.name+'</b><br>'+
            '<span>템포: '+emo.tempo+'</span><br>'+
            '<span>다이나믹: '+emo.dynamics+'</span><br>'+
            '<span>아티큘레이션: '+emo.artic+'</span><br>'+
            '<span style="color:var(--text)">'+emo.desc+'</span></div>';
          drawEmotionCanvas(i);
          return;
        }
      }
    });

    drawEmotionCanvas(-1);
  });
}

// ================ 2. IMPROV PATTERN GENERATOR ================
function buildImprovGenUI(){
  var SCALES={
    'Major':[0,2,4,5,7,9,11],'Minor':[0,2,3,5,7,8,10],
    'Pentatonic':[0,2,4,7,9],'Blues':[0,3,5,6,7,10],
    'Dorian':[0,2,3,5,7,9,10],'Mixolydian':[0,2,4,5,7,9,10]
  };
  var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var scaleKeys=Object.keys(SCALES);

  makeV22Modal('improv-gen-modal','🎲 즉흥연주 패턴 생성기',function(content){
    content.innerHTML=
      '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap" id="improv-scale-btns"></div>'+
      '<div style="display:flex;gap:6px;margin-bottom:10px">'+
        '<button id="improv-gen-btn" style="padding:6px 12px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">🎲 생성</button>'+
        '<button id="improv-play-btn" style="padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">▶ 재생</button>'+
        '<button id="improv-save-btn" style="padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">💾 저장</button>'+
      '</div>'+
      '<canvas id="improv-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var curScale='Major',curPattern=[],saved=ls22Get('improv_saved',[]);

    var btnsDiv=document.getElementById('improv-scale-btns');
    scaleKeys.forEach(function(sk){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:'+(sk===curScale?'var(--accent)':'var(--surface2)')+';color:'+(sk===curScale?'white':'var(--text)')+';font-size:10px;cursor:pointer';
      btn.textContent=sk;
      btn.addEventListener('click',function(){
        curScale=sk;
        Array.from(btnsDiv.children).forEach(function(b,i){
          b.style.background=scaleKeys[i]===sk?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=scaleKeys[i]===sk?'white':'var(--text,#e8ecf4)';
        });
      });
      btnsDiv.appendChild(btn);
    });

    function generatePattern(){
      var intervals=SCALES[curScale];
      curPattern=[];
      var baseNote=60;
      for(var i=0;i<8;i++){
        var idx=Math.floor(Math.random()*intervals.length);
        var octShift=Math.floor(Math.random()*2);
        curPattern.push(baseNote+intervals[idx]+octShift*12);
      }
      playSFX22('improv_generate');markV22Feature('improv_gen');
      drawImprovCanvas();
    }

    function playPattern(){
      if(!curPattern.length) return;
      playSFX22('improv_play');
      curPattern.forEach(function(midi,i){
        var freq=440*Math.pow(2,(midi-69)/12);
        tone22(freq,'triangle',0.3,0.08,i*350);
      });
    }

    function midiToName(m){return NOTE_NAMES[m%12]+(Math.floor(m/12)-1)}

    function drawImprovCanvas(){
      var c=document.getElementById('improv-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎵 즉흥 패턴: '+curScale,20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('저장된 패턴: '+saved.length+'개',20,42);

      if(curPattern.length>0){
        var minN=Math.min.apply(null,curPattern)-2;
        var maxN=Math.max.apply(null,curPattern)+2;
        var range=maxN-minN||1;
        var barW=(W-80)/curPattern.length;
        for(var i=0;i<curPattern.length;i++){
          var x=40+i*barW;
          var normH=(curPattern[i]-minN)/range*(H-120);
          var y=H-40-normH;
          ctx.fillStyle='rgba(74,125,255,0.6)';
          ctx.beginPath();ctx.arc(x+barW/2,y,14,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
          ctx.fillText(midiToName(curPattern[i]),x+barW/2,y+4);
          if(i<curPattern.length-1){
            var nextY=H-40-(curPattern[i+1]-minN)/range*(H-120);
            ctx.strokeStyle='rgba(74,125,255,0.3)';ctx.lineWidth=1;
            ctx.beginPath();ctx.moveTo(x+barW/2,y);ctx.lineTo(x+barW*1.5,nextY);ctx.stroke();
          }
        }
        ctx.textAlign='left';
      }

      if(saved.length>0){
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        var showCount=Math.min(saved.length,5);
        for(var j=0;j<showCount;j++){
          var sv=saved[saved.length-showCount+j];
          ctx.fillText((j+1)+'. '+sv.scale+': '+sv.notes.map(midiToName).join('-'),20,H-60+j*14);
        }
      }
    }

    document.getElementById('improv-gen-btn').addEventListener('click',generatePattern);
    document.getElementById('improv-play-btn').addEventListener('click',playPattern);
    document.getElementById('improv-save-btn').addEventListener('click',function(){
      if(!curPattern.length) return;
      saved.push({scale:curScale,notes:curPattern.slice()});
      if(saved.length>20) saved=saved.slice(-20);
      ls22Set('improv_saved',saved);
      drawImprovCanvas();
    });

    drawImprovCanvas();
  });
}

// ================ 3. INTERVAL TOWER ================
function buildIntervalTowerUI(){
  var INTERVALS=[
    {name:'단2도',semitones:1,color:'#ef4444'},
    {name:'장2도',semitones:2,color:'#f97316'},
    {name:'단3도',semitones:3,color:'#eab308'},
    {name:'장3도',semitones:4,color:'#22c55e'},
    {name:'완전4도',semitones:5,color:'#06b6d4'},
    {name:'완전5도',semitones:7,color:'#3b82f6'},
    {name:'옥타브',semitones:12,color:'#a78bfa'}
  ];

  makeV22Modal('interval-tower-modal','🗼 인터벌 타워',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">음정을 쌓아 타워를 만들어 보세요!</p>'+
      '<div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap" id="interval-btns"></div>'+
      '<button id="interval-reset" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer;margin-bottom:8px">🔄 초기화</button>'+
      '<canvas id="interval-canvas" width="580" height="360" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var tower=[],baseMidi=60,bestHeight=ls22Get('tower_best',0);

    var btnsDiv=document.getElementById('interval-btns');
    INTERVALS.forEach(function(intv){
      var btn=document.createElement('button');
      btn.style.cssText='padding:5px 10px;border-radius:6px;border:1px solid '+intv.color+';background:'+intv.color+'20;color:'+intv.color+';font-size:10px;cursor:pointer';
      btn.textContent=intv.name;
      btn.addEventListener('click',function(){
        var lastMidi=tower.length>0?tower[tower.length-1].midi:baseMidi;
        var newMidi=lastMidi+intv.semitones;
        if(newMidi>96) return;
        tower.push({name:intv.name,semitones:intv.semitones,color:intv.color,midi:newMidi});
        if(tower.length>bestHeight){bestHeight=tower.length;ls22Set('tower_best',bestHeight);}
        playSFX22('interval_build');
        var freq=440*Math.pow(2,(newMidi-69)/12);
        tone22(freq,'triangle',0.3,0.07,0);
        markV22Feature('interval_tower');
        drawTowerCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    document.getElementById('interval-reset').addEventListener('click',function(){
      tower=[];drawTowerCanvas();
    });

    function drawTowerCanvas(){
      var c=document.getElementById('interval-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🗼 인터벌 타워',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('높이: '+tower.length+' | 최고: '+bestHeight,20,42);

      var blockH=Math.min(24,(H-70)/Math.max(tower.length,1));
      var towerW=120;
      var cx=W/2;
      ctx.fillStyle='#1e2640';
      ctx.fillRect(cx-towerW/2-5,H-25,towerW+10,8);

      for(var i=0;i<tower.length;i++){
        var y=H-30-(i+1)*blockH;
        var bw=towerW-i*2;
        if(bw<40) bw=40;
        ctx.fillStyle=tower[i].color+'80';
        ctx.strokeStyle=tower[i].color;ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(cx-bw/2,y,bw,blockH-2,3);ctx.fill();ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
        ctx.fillText(tower[i].name,cx,y+blockH/2+1);
      }
      ctx.textAlign='left';

      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('현재 음높이: '+(tower.length>0?'MIDI '+tower[tower.length-1].midi:'C4 (60)'),20,H-10);

      var legend_x=W-160;
      INTERVALS.forEach(function(intv,i){
        ctx.fillStyle=intv.color;ctx.font='9px sans-serif';
        ctx.fillRect(legend_x,60+i*18,8,8);
        ctx.fillText(intv.name+' (+'+intv.semitones+')',legend_x+14,60+i*18+8);
      });
    }

    drawTowerCanvas();
  });
}

// ================ 4. HARMONIC ANALYZER ================
function buildHarmonyAnalyzerUI(){
  var PROGRESSIONS=[
    {name:'I - IV - V - I',chords:['C','F','G','C'],functions:['T','S','D','T'],desc:'기본 화성 진행 (클래식)'},
    {name:'ii - V - I',chords:['Dm','G','C'],functions:['S','D','T'],desc:'재즈 표준 진행'},
    {name:'I - vi - IV - V',chords:['C','Am','F','G'],functions:['T','Tr','S','D'],desc:'팝 발라드 진행 (50s)'},
    {name:'I - V - vi - IV',chords:['C','G','Am','F'],functions:['T','D','Tr','S'],desc:'현대 팝 진행'},
    {name:'i - VI - III - VII',chords:['Am','F','C','G'],functions:['T','S','M','D'],desc:'에픽 시네마틱 진행'},
    {name:'I - IV - vi - V',chords:['C','F','Am','G'],functions:['T','S','Tr','D'],desc:'감성 팝 진행'},
    {name:'vi - IV - I - V',chords:['Am','F','C','G'],functions:['Tr','S','T','D'],desc:'슬픈 팝 진행'},
    {name:'I - iii - IV - V',chords:['C','Em','F','G'],functions:['T','M','S','D'],desc:'부드러운 전진형 진행'}
  ];
  var FUNC_COLORS={T:'#22c55e',S:'#eab308',D:'#ef4444',Tr:'#3b82f6',M:'#a78bfa'};

  makeV22Modal('harmony-analyzer-modal','🔬 하모닉 분석기',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:8px">코드 진행의 화성 기능을 분석합니다.</p>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px" id="harm-prog-btns"></div>'+
      '<canvas id="harmony-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var curProg=0,analyzed=ls22Get('harmony_analyzed',[]);

    var btnsDiv=document.getElementById('harm-prog-btns');
    PROGRESSIONS.forEach(function(p,i){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:'+(i===curProg?'var(--accent)':'var(--surface2)')+';color:'+(i===curProg?'white':'var(--text)')+';font-size:9px;cursor:pointer';
      btn.textContent=p.name;
      btn.addEventListener('click',function(){
        curProg=i;
        if(analyzed.indexOf(i)===-1){analyzed.push(i);ls22Set('harmony_analyzed',analyzed);}
        playSFX22('harmony_analyze');markV22Feature('harmony_analyzer');
        Array.from(btnsDiv.children).forEach(function(b,j){
          b.style.background=j===i?'var(--accent,#4a7dff)':'var(--surface2,#1a1f35)';
          b.style.color=j===i?'white':'var(--text,#e8ecf4)';
        });
        drawHarmonyCanvas();
      });
      btnsDiv.appendChild(btn);
    });

    function drawHarmonyCanvas(){
      var c=document.getElementById('harmony-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      var prog=PROGRESSIONS[curProg];
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🔬 '+prog.name,20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(prog.desc+' | 분석: '+analyzed.length+'/'+PROGRESSIONS.length,20,42);

      var cx=W/2,cy=180,radius=100;
      var chords=prog.chords,funcs=prog.functions;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();

      for(var i=0;i<chords.length;i++){
        var angle=-Math.PI/2+i*(Math.PI*2/chords.length);
        var nx=cx+Math.cos(angle)*radius,ny=cy+Math.sin(angle)*radius;
        var funcColor=FUNC_COLORS[funcs[i]]||'#8892a8';
        ctx.fillStyle=funcColor+'40';ctx.strokeStyle=funcColor;ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(nx,ny,22,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
        ctx.fillText(chords[i],nx,ny-2);
        ctx.fillStyle=funcColor;ctx.font='9px sans-serif';
        ctx.fillText(funcs[i],nx,ny+12);

        if(i<chords.length-1){
          var nextAngle=-Math.PI/2+(i+1)*(Math.PI*2/chords.length);
          var nnx=cx+Math.cos(nextAngle)*radius,nny=cy+Math.sin(nextAngle)*radius;
          ctx.strokeStyle='rgba(74,125,255,0.3)';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nnx,nny);ctx.stroke();
        }
      }
      ctx.textAlign='left';

      var legendY=320;
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
      ctx.fillText('T=Tonic S=Subdominant D=Dominant Tr=Tonic-relative M=Mediant',20,legendY);
      Object.keys(FUNC_COLORS).forEach(function(k,i){
        ctx.fillStyle=FUNC_COLORS[k];
        ctx.fillRect(20+i*80,legendY+10,8,8);
        ctx.fillText(k,32+i*80,legendY+18);
      });
    }

    drawHarmonyCanvas();
  });
}

// ================ 5. ENERGY MANAGER ================
function buildEnergyManagerUI(){
  var ZONES=[
    {name:'Rest',label:'휴식',color:'#8892a8',mins:5,desc:'심호흡, 물 마시기'},
    {name:'Warmup',label:'워밍업',color:'#22c55e',mins:10,desc:'스케일, 핑거 스트레칭'},
    {name:'Focus',label:'집중연습',color:'#3b82f6',mins:20,desc:'어려운 구간 반복 연습'},
    {name:'Intensive',label:'심화연습',color:'#ef4444',mins:15,desc:'전곡 통주, 빠른 템포'},
    {name:'Cooldown',label:'쿨다운',color:'#a78bfa',mins:10,desc:'느린 곡, 가벼운 즉흥'}
  ];

  makeV22Modal('energy-manager-modal','⚡ 에너지 매니저',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">연습 세션 에너지를 효율적으로 관리하세요.</p>'+
      '<canvas id="energy-canvas" width="580" height="360" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:pointer"></canvas>'+
      '<div id="energy-detail" style="margin-top:8px;font-size:12px;color:var(--text2)"></div>';

    var completed=ls22Get('energy_completed',[]);

    function drawEnergyCanvas(activeIdx){
      var c=document.getElementById('energy-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('⚡ 에너지 매니저',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      var totalMins=ZONES.reduce(function(s,z){return s+z.mins},0);
      ctx.fillText('총 '+totalMins+'분 세션 | 완료: '+completed.length+'/'+ZONES.length+'존',20,42);

      var barY=70,barH=40,totalW=W-60;
      var accumulated=0;
      ZONES.forEach(function(z,i){
        var zoneW=z.mins/totalMins*totalW;
        var x=30+accumulated;
        ctx.fillStyle=i===activeIdx?z.color:z.color+'60';
        ctx.strokeStyle=z.color;ctx.lineWidth=i===activeIdx?2:1;
        ctx.beginPath();ctx.roundRect(x,barY,zoneW-2,barH,4);ctx.fill();ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(z.label,x+zoneW/2,barY+16);
        ctx.fillStyle='#ddd';ctx.font='9px sans-serif';
        ctx.fillText(z.mins+'분',x+zoneW/2,barY+30);
        if(completed.indexOf(z.name)!==-1){
          ctx.fillStyle='#22c55e';ctx.font='12px sans-serif';
          ctx.fillText('✓',x+zoneW/2,barY-5);
        }
        ctx.textAlign='left';
        accumulated+=zoneW;
      });

      var detailY=140;
      ZONES.forEach(function(z,i){
        var y=detailY+i*42;
        var isDone=completed.indexOf(z.name)!==-1;
        ctx.fillStyle=i===activeIdx?z.color+'40':'#1e2640';
        ctx.strokeStyle=z.color;ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(30,y,W-60,36,6);ctx.fill();ctx.stroke();
        ctx.fillStyle=z.color;ctx.font='bold 11px sans-serif';
        ctx.fillText(z.label+' ('+z.mins+'분)',45,y+15);
        ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
        ctx.fillText(z.desc,45,y+28);
        if(isDone){
          ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';ctx.textAlign='right';
          ctx.fillText('✓ 완료',W-40,y+20);ctx.textAlign='left';
        }
      });
    }

    var canvas=document.getElementById('energy-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var my=(e.clientY-rect.top)*(360/rect.height);
      var detailY=140;
      for(var i=0;i<ZONES.length;i++){
        var y=detailY+i*42;
        if(my>=y&&my<=y+36){
          if(completed.indexOf(ZONES[i].name)===-1){
            completed.push(ZONES[i].name);ls22Set('energy_completed',completed);
          }
          playSFX22('energy_set');markV22Feature('energy_manager');
          drawEnergyCanvas(i);
          return;
        }
      }
    });

    drawEnergyCanvas(-1);
  });
}

// ================ 6. FINGER GYM ================
function buildFingerGymUI(){
  var EXERCISES=[
    {name:'트릴',desc:'인접 두 건반 빠른 교대',fingers:'2-3, 3-4, 4-5',color:'#ef4444'},
    {name:'옥타브 스트레치',desc:'1-5 손가락 옥타브 간격',fingers:'1-5',color:'#f97316'},
    {name:'스케일 런',desc:'5음 순차 상행/하행',fingers:'1-2-3-4-5',color:'#eab308'},
    {name:'아르페지오',desc:'분산 화음 패턴',fingers:'1-2-3-5',color:'#22c55e'},
    {name:'반복 타건',desc:'같은 건반 빠른 반복',fingers:'각 손가락 개별',color:'#06b6d4'},
    {name:'교차 연습',desc:'손가락 교차 통과',fingers:'1-3-1, 1-4-1',color:'#3b82f6'},
    {name:'스타카토',desc:'짧고 분명한 터치',fingers:'전체',color:'#a78bfa'},
    {name:'레가토',desc:'매끄러운 연결 터치',fingers:'전체',color:'#ec4899'}
  ];

  makeV22Modal('finger-gym-modal','💪 핑거 짐',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8종 핑거 운동으로 손가락을 단련하세요!</p>'+
      '<canvas id="finger-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:pointer"></canvas>';

    var progress=ls22Get('finger_progress',{});

    function drawFingerCanvas(activeIdx){
      var c=document.getElementById('finger-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('💪 핑거 짐',20,25);
      var doneCount=Object.keys(progress).filter(function(k){return progress[k]>=3}).length;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('완료: '+doneCount+'/'+EXERCISES.length+' 운동',20,42);

      var cols=2,cellW=(W-50)/cols,cellH=38;
      EXERCISES.forEach(function(ex,i){
        var col=i%cols,row=Math.floor(i/cols);
        var x=15+col*(cellW+10),y=55+row*(cellH+6);
        var count=progress[ex.name]||0;
        var isDone=count>=3;
        ctx.fillStyle=i===activeIdx?ex.color+'40':(isDone?ex.color+'20':'#1e2640');
        ctx.strokeStyle=ex.color;ctx.lineWidth=i===activeIdx?2:1;
        ctx.beginPath();ctx.roundRect(x,y,cellW,cellH,6);ctx.fill();ctx.stroke();

        ctx.fillStyle=ex.color;ctx.font='bold 11px sans-serif';
        ctx.fillText(ex.name,x+10,y+15);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(ex.desc,x+10,y+30);
        ctx.fillStyle=isDone?'#22c55e':'#8892a8';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText(count+'/3',x+cellW-10,y+15);
        if(isDone){ctx.fillText('✓',x+cellW-10,y+30);}
        ctx.textAlign='left';
      });

      var handY=H-90;
      ctx.fillStyle='#1e2640';
      ctx.beginPath();ctx.roundRect(W/2-100,handY,200,70,12);ctx.fill();
      var fingerX=[W/2-70,W/2-35,W/2,W/2+35,W/2+70];
      var fingerH=[30,40,44,38,28];
      var fingerLabels=['1','2','3','4','5'];
      fingerX.forEach(function(fx,fi){
        var highlighted=false;
        if(activeIdx>=0){
          var exFingers=EXERCISES[activeIdx].fingers;
          highlighted=exFingers.indexOf(fingerLabels[fi])!==-1||exFingers==='전체'||exFingers.indexOf('각')!==-1;
        }
        ctx.fillStyle=highlighted?'#4a7dff':'#2a3050';
        ctx.beginPath();ctx.roundRect(fx-10,handY+60-fingerH[fi],20,fingerH[fi],6);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
        ctx.fillText(fingerLabels[fi],fx,handY+64);
      });
      ctx.textAlign='left';
    }

    var canvas=document.getElementById('finger-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(600/rect.width),my=(e.clientY-rect.top)*(380/rect.height);
      var cols=2,cellW=(600-50)/cols,cellH=38;
      for(var i=0;i<EXERCISES.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=15+col*(cellW+10),y=55+row*(cellH+6);
        if(mx>=x&&mx<=x+cellW&&my>=y&&my<=y+cellH){
          var ex=EXERCISES[i];
          progress[ex.name]=(progress[ex.name]||0)+1;
          ls22Set('finger_progress',progress);
          playSFX22(progress[ex.name]>=3?'finger_complete':'finger_start');
          markV22Feature('finger_gym');
          drawFingerCanvas(i);
          return;
        }
      }
    });

    drawFingerCanvas(-1);
  });
}

// ================ 7. MOODBOARD ================
function buildMoodboardUI(){
  var MOODS=[
    {name:'집중',color:'#3b82f6',icon:'🎯',desc:'테크닉 연마, 어려운 구간'},
    {name:'휴식',color:'#22c55e',icon:'🌿',desc:'가벼운 연주, 익숙한 곡'},
    {name:'도전',color:'#ef4444',icon:'🔥',desc:'새로운 곡, 빠른 템포'},
    {name:'창작',color:'#a78bfa',icon:'✨',desc:'즉흥연주, 작곡'},
    {name:'복습',color:'#eab308',icon:'📖',desc:'이전 곡 복습, 이론'},
    {name:'탐험',color:'#ec4899',icon:'🧭',desc:'새 장르, 새 기능 탐색'}
  ];

  makeV22Modal('moodboard-modal','🎨 무드보드',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">오늘의 연습 무드를 선택하세요!</p>'+
      '<canvas id="mood-canvas" width="580" height="360" style="width:100%;border-radius:8px;background:#0a0e1a;cursor:pointer"></canvas>';

    var moodHistory=ls22Get('mood_history',[]);
    var today=new Date().toISOString().slice(0,10);
    var todayMood=null;
    moodHistory.forEach(function(m){if(m.date===today) todayMood=m.mood;});

    function drawMoodCanvas(hoverIdx){
      var c=document.getElementById('mood-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🎨 무드보드',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('기록: '+moodHistory.length+'일 | 오늘: '+(todayMood||'미선택'),20,42);

      var cols=3,rows=2,cellW=(W-60)/cols,cellH=80;
      MOODS.forEach(function(m,i){
        var col=i%cols,row=Math.floor(i/cols);
        var x=20+col*(cellW+5),y=60+row*(cellH+8);
        var isToday=todayMood===m.name;
        ctx.fillStyle=i===hoverIdx?m.color+'60':(isToday?m.color+'40':'#1e2640');
        ctx.strokeStyle=isToday?m.color:m.color+'80';ctx.lineWidth=isToday?2:1;
        ctx.beginPath();ctx.roundRect(x,y,cellW,cellH,8);ctx.fill();ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='20px sans-serif';ctx.textAlign='center';
        ctx.fillText(m.icon,x+cellW/2,y+30);
        ctx.font='bold 11px sans-serif';ctx.fillStyle=m.color;
        ctx.fillText(m.name,x+cellW/2,y+50);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(m.desc,x+cellW/2,y+66);
        ctx.textAlign='left';
      });

      var histY=250;
      ctx.fillStyle='#8892a8';ctx.font='bold 10px sans-serif';
      ctx.fillText('최근 무드 기록',20,histY);
      var showCount=Math.min(moodHistory.length,7);
      for(var j=0;j<showCount;j++){
        var entry=moodHistory[moodHistory.length-showCount+j];
        var moodObj=MOODS.find(function(mm){return mm.name===entry.mood});
        var bx=20+j*75;
        ctx.fillStyle=moodObj?moodObj.color+'40':'#1e2640';
        ctx.beginPath();ctx.roundRect(bx,histY+10,70,50,4);ctx.fill();
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(entry.date.slice(5),bx+35,histY+25);
        ctx.fillStyle=moodObj?moodObj.color:'#fff';ctx.font='bold 10px sans-serif';
        ctx.fillText(entry.mood,bx+35,histY+42);
        if(moodObj){ctx.font='14px sans-serif';ctx.fillText(moodObj.icon,bx+35,histY+56);}
        ctx.textAlign='left';
      }
    }

    var canvas=document.getElementById('mood-canvas');
    canvas.addEventListener('click',function(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(580/rect.width),my=(e.clientY-rect.top)*(360/rect.height);
      var cols=3,cellW=(580-60)/cols,cellH=80;
      for(var i=0;i<MOODS.length;i++){
        var col=i%cols,row=Math.floor(i/cols);
        var x=20+col*(cellW+5),y=60+row*(cellH+8);
        if(mx>=x&&mx<=x+cellW&&my>=y&&my<=y+cellH){
          todayMood=MOODS[i].name;
          var existIdx=-1;
          moodHistory.forEach(function(m,j){if(m.date===today) existIdx=j;});
          if(existIdx>=0) moodHistory[existIdx].mood=todayMood;
          else moodHistory.push({date:today,mood:todayMood});
          if(moodHistory.length>60) moodHistory=moodHistory.slice(-60);
          ls22Set('mood_history',moodHistory);
          playSFX22('mood_select');markV22Feature('moodboard');
          drawMoodCanvas(i);
          return;
        }
      }
    });

    drawMoodCanvas(-1);
  });
}

// ================ 8. MILESTONE ROADMAP ================
function buildMilestoneUI(){
  var MILESTONES=[
    {id:'ms_first',name:'첫 연주',desc:'첫 번째 곡 연주하기',check:function(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('best-')===0&&parseInt(localStorage.getItem(k))>0)return true}return false}catch(e){return false}}},
    {id:'ms_10songs',name:'10곡 달성',desc:'10곡 이상 연주하기',check:function(){var c=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('best-')===0&&parseInt(localStorage.getItem(k))>0)c++}return c>=10}catch(e){return false}}},
    {id:'ms_scale',name:'스케일 입문',desc:'스케일 트레이너 사용',check:function(){return !!localStorage.getItem('piano-v14-scale_progress')}},
    {id:'ms_chord',name:'코드 마스터',desc:'코드 사전 사용',check:function(){return !!localStorage.getItem('piano-v13-chord_explored')}},
    {id:'ms_sight',name:'시보드리딩',desc:'악보 읽기 훈련 시작',check:function(){return !!localStorage.getItem('piano-v19-sight_stats')}},
    {id:'ms_50songs',name:'50곡 달성',desc:'50곡 이상 연주하기',check:function(){var c=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('best-')===0&&parseInt(localStorage.getItem(k))>0)c++}return c>=50}catch(e){return false}}},
    {id:'ms_theory',name:'이론 기초',desc:'음악 이론 학습 시작',check:function(){return !!localStorage.getItem('piano-v12-theory_progress')}},
    {id:'ms_advanced',name:'고급 테크닉',desc:'핑거 트레이너 사용',check:function(){return !!localStorage.getItem('piano-v14-finger_stats')}},
    {id:'ms_100songs',name:'100곡 달성',desc:'100곡 이상 연주하기',check:function(){var c=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('best-')===0&&parseInt(localStorage.getItem(k))>0)c++}return c>=100}catch(e){return false}}},
    {id:'ms_perform',name:'공연 준비',desc:'공연 불안 코치 사용',check:function(){return !!localStorage.getItem('piano-v20-breathe_sessions')}},
    {id:'ms_features',name:'기능 탐험가',desc:'v22 기능 5개 이상 사용',check:function(){var u=ls22Get('features_used',[]);return u.length>=5}},
    {id:'ms_grandmaster',name:'그랜드 마스터',desc:'모든 마일스톤 달성',check:function(){return false}}
  ];

  makeV22Modal('milestone-modal','🗺️ 마일스톤 로드맵',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">피아노 학습 여정의 마일스톤을 확인하세요!</p>'+
      '<canvas id="milestone-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    function checkMilestones(){
      var results=[];
      var allDone=true;
      MILESTONES.forEach(function(ms){
        var done=ms.id==='ms_grandmaster'?false:ms.check();
        if(!done) allDone=false;
        results.push({id:ms.id,name:ms.name,desc:ms.desc,done:done});
      });
      if(allDone) results[results.length-1].done=true;
      return results;
    }

    function drawMilestoneCanvas(){
      var c=document.getElementById('milestone-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);

      var results=checkMilestones();
      var doneCount=results.filter(function(r){return r.done}).length;
      var pct=Math.round(doneCount/results.length*100);

      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('🗺️ 마일스톤 로드맵',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('달성: '+doneCount+'/'+results.length+' ('+pct+'%)',20,42);

      var cols=3,rows=4,cellW=(W-50)/cols,cellH=70;
      results.forEach(function(ms,i){
        var col=i%cols,row=Math.floor(i/cols);
        var x=15+col*(cellW+6),y=55+row*(cellH+8);
        ctx.fillStyle=ms.done?'rgba(34,197,94,0.15)':'#1e2640';
        ctx.strokeStyle=ms.done?'#22c55e':'#2a3050';ctx.lineWidth=ms.done?2:1;
        ctx.beginPath();ctx.roundRect(x,y,cellW,cellH,8);ctx.fill();ctx.stroke();

        ctx.fillStyle=ms.done?'#22c55e':'#4a7dff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
        ctx.fillText((i+1)+'. '+ms.name,x+cellW/2,y+22);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(ms.desc,x+cellW/2,y+40);
        ctx.fillStyle=ms.done?'#22c55e':'#ef4444';ctx.font='bold 10px sans-serif';
        ctx.fillText(ms.done?'✓ 달성':'✗ 미달성',x+cellW/2,y+58);
        ctx.textAlign='left';

        if(i<results.length-1&&i%cols<cols-1){
          ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(x+cellW,y+cellH/2);ctx.lineTo(x+cellW+6,y+cellH/2);ctx.stroke();
        }
      });

      markV22Feature('milestone');
    }

    drawMilestoneCanvas();
  });
}

// ================ QUIZ v13 (15 questions, 180->195) ================
function buildQuizV13UI(){
  var QUESTIONS=[
    {q:'감정 표현에서 Appassionato는 어떤 의미인가?',a:['열정적으로','느리게','조용하게','강하게'],c:0},
    {q:'즉흥연주에서 블루스 스케일의 특징적인 음은?',a:['b3, b5, b7','#4, #5','b2, b6','#1, #3'],c:0},
    {q:'장3도 음정의 반음 수는?',a:['4반음','3반음','5반음','2반음'],c:0},
    {q:'I-vi-IV-V 코드 진행의 일반적인 이름은?',a:['50s 진행','블루스 진행','재즈 턴어라운드','캐논 진행'],c:0},
    {q:'효과적인 연습 세션의 권장 순서는?',a:['워밍업-집중-심화-쿨다운','심화-집중-워밍업-쿨다운','쿨다운-심화-워밍업-집중','집중-쿨다운-워밍업-심화'],c:0},
    {q:'피아노에서 트릴(trill)이란?',a:['인접 두 음의 빠른 교대','한 음의 반복','옥타브 점프','아르페지오 패턴'],c:0},
    {q:'Dorian 선법의 특징은?',a:['자연 단음계에서 6음이 반음 올라감','장음계에서 7음이 반음 내려감','자연 단음계에서 2음이 반음 올라감','장음계에서 4음이 반음 올라감'],c:0},
    {q:'하모닉 분석에서 T는 무엇을 의미하나?',a:['Tonic (으뜸음)','Tempo','Treble','Tritone'],c:0},
    {q:'연습 에너지 관리에서 포모도로 기법의 기본 단위는?',a:['25분 집중 + 5분 휴식','45분 집중 + 15분 휴식','10분 집중 + 2분 휴식','60분 집중 + 10분 휴식'],c:0},
    {q:'Grazioso의 연주 표현 의미는?',a:['우아하게','슬프게','빠르게','강하게'],c:0},
    {q:'완전5도 음정의 반음 수는?',a:['7반음','6반음','8반음','5반음'],c:0},
    {q:'ii-V-I 진행이 가장 많이 사용되는 장르는?',a:['재즈','클래식','록','민요'],c:0},
    {q:'Maestoso의 의미는?',a:['장엄하게','부드럽게','빠르게','조용하게'],c:0},
    {q:'리스트 헝가리안 랩소디의 특징적인 요소는?',a:['집시 음계와 카덴차','바흐 대위법','인상주의 화성','미니멀리즘 반복'],c:0},
    {q:'핑거 독립성 훈련에서 가장 약한 손가락 조합은?',a:['4-5번 손가락','1-2번 손가락','2-3번 손가락','1-3번 손가락'],c:0}
  ];

  makeV22Modal('quiz13-modal','🧠 피아노 퀴즈 v13',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">15문항 피아노 지식 퀴즈. 감정표현, 화성, 테크닉!</p>'+
      '<div id="q13-area" style="margin-bottom:10px"></div>'+
      '<canvas id="q13-canvas" width="560" height="300" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var qIdx=0,score=0,answered=false;
    var stats=ls22Get('quiz13_stats',{total:0,correct:0,history:[]});

    function showQuestion(){
      var area=document.getElementById('q13-area');
      if(qIdx>=QUESTIONS.length){
        var pct=Math.round(score/QUESTIONS.length*100);
        var grade=pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=30?'C':'D';
        stats.history.push({score:score,total:QUESTIONS.length,date:new Date().toISOString().slice(0,10)});
        if(stats.history.length>20) stats.history=stats.history.slice(-20);
        ls22Set('quiz13_stats',stats);
        area.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:700;color:var(--accent)">퀴즈 완료!</div><div style="font-size:14px;margin-top:8px;color:var(--green)">'+score+'/'+QUESTIONS.length+' ('+grade+'등급)</div><button id="q13-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">다시 풀기</button></div>';
        document.getElementById('q13-retry').addEventListener('click',function(){qIdx=0;score=0;answered=false;showQuestion();drawQ13Canvas();});
        drawQ13Canvas();
        return;
      }
      var q=QUESTIONS[qIdx];
      area.innerHTML='<div style="font-size:12px;color:var(--accent);margin-bottom:4px">Q'+(qIdx+1)+'/'+QUESTIONS.length+'</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'+
        '<div id="q13-opts" style="display:flex;flex-direction:column;gap:6px"></div>';
      var opts=document.getElementById('q13-opts');
      q.a.forEach(function(a,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
        btn.textContent=a;
        btn.addEventListener('click',function(){
          if(answered) return;answered=true;stats.total++;
          if(i===q.c){score++;stats.correct++;btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';playSFX22('quiz_correct');}
          else{btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
            Array.from(opts.children)[q.c].style.background='rgba(34,197,94,0.3)';Array.from(opts.children)[q.c].style.borderColor='var(--green)';
          }
          ls22Set('quiz13_stats',stats);drawQ13Canvas();
          setTimeout(function(){qIdx++;answered=false;showQuestion();},1200);
        });
        opts.appendChild(btn);
      });
    }

    function drawQ13Canvas(){
      var c=document.getElementById('q13-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('퀴즈 v13 성적',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+stats.total+'문 | 정답 '+stats.correct+'문 | 정답률 '+(stats.total>0?Math.round(stats.correct/stats.total*100):0)+'%',20,42);

      var cx=W/2,cy=140,r=55;
      var pct=stats.total>0?stats.correct/stats.total:0;
      ctx.lineWidth=10;ctx.lineCap='round';
      ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=pct>=0.7?'#22c55e':pct>=0.4?'#eab308':'#ef4444';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(pct*100)+'%',cx,cy+6);ctx.textAlign='left';

      if(stats.history.length>0){
        var hLen=Math.min(stats.history.length,10);
        var barW=Math.min(40,(W-80)/hLen);
        for(var i=0;i<hLen;i++){
          var entry=stats.history[stats.history.length-hLen+i];
          var x=30+i*(barW+4);
          var h=entry.score/entry.total*(H-240);
          ctx.fillStyle=entry.score/entry.total>=0.7?'rgba(34,197,94,0.5)':'rgba(239,68,68,0.3)';
          ctx.fillRect(x,H-30-h,barW,h);
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText(entry.score+'/'+entry.total,x,H-16);
        }
      }
    }

    showQuestion();drawQ13Canvas();
  });
}

// ================ 12 NEW ACHIEVEMENTS (192->204) ================
var V22_ACHIEVEMENTS=[
  {id:'v22_emotion_explorer',name:'감정 탐험가',desc:'8종 감정 모두 탐색'},
  {id:'v22_improv_creator',name:'즉흥 창작가',desc:'패턴 5개 이상 생성'},
  {id:'v22_interval_tower',name:'인터벌 타워 마스터',desc:'타워 높이 10 이상 달성'},
  {id:'v22_harmony_analyst',name:'화성 분석가',desc:'8종 진행 모두 분석'},
  {id:'v22_energy_guru',name:'에너지 관리사',desc:'5존 모두 완료'},
  {id:'v22_finger_athlete',name:'핑거 운동선수',desc:'8종 운동 모두 완료(3회+)'},
  {id:'v22_moodboard_artist',name:'무드보드 아티스트',desc:'7일 이상 무드 기록'},
  {id:'v22_milestone_half',name:'마일스톤 절반',desc:'6개 이상 마일스톤 달성'},
  {id:'v22_quiz13_s',name:'퀴즈 v13 S등급',desc:'퀴즈 v13에서 90% 이상 달성'},
  {id:'v22_quiz13_clear',name:'퀴즈 v13 클리어',desc:'퀴즈 v13 전문 풀기 완료'},
  {id:'v22_all_features',name:'v22 올클리어',desc:'v22 8가지 기능 모두 사용'},
  {id:'v22_192songs',name:'192곡 도전자',desc:'65곡 이상 연주 기록'}
];

function injectV22Achievements(){
  if(!window.app) window.app={};
  if(!app.achievements) app.achievements=[];
  V22_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(e){return e.id===a.id});
    if(!exists){
      a.unlocked=ls22Get('ach_'+a.id,false);
      app.achievements.push(a);
    }
  });
}

function unlockV22Achievement(id){
  if(ls22Get('ach_'+id,false)) return;
  ls22Set('ach_'+id,true);
  if(window.app&&app.achievements){
    app.achievements.forEach(function(a){if(a.id===id)a.unlocked=true;});
  }
  playSFX22('v22_achieve');
  var ach=V22_ACHIEVEMENTS.find(function(a){return a.id===id});
  if(ach){
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#eab308;color:#000;padding:8px 16px;border-radius:8px;font-size:12px;z-index:9999;animation:modalIn 0.3s';
    toast.textContent='🏆 업적 해금: '+ach.name;
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove()},3000);
  }
}

function checkV22Achievements(){
  var emotions=ls22Get('emotion_explored',[]);
  if(emotions.length>=8) unlockV22Achievement('v22_emotion_explorer');

  var saved=ls22Get('improv_saved',[]);
  if(saved.length>=5) unlockV22Achievement('v22_improv_creator');

  var towerBest=ls22Get('tower_best',0);
  if(towerBest>=10) unlockV22Achievement('v22_interval_tower');

  var analyzed=ls22Get('harmony_analyzed',[]);
  if(analyzed.length>=8) unlockV22Achievement('v22_harmony_analyst');

  var energyDone=ls22Get('energy_completed',[]);
  if(energyDone.length>=5) unlockV22Achievement('v22_energy_guru');

  var fingerProg=ls22Get('finger_progress',{});
  var fingerDone=Object.keys(fingerProg).filter(function(k){return fingerProg[k]>=3}).length;
  if(fingerDone>=8) unlockV22Achievement('v22_finger_athlete');

  var moodHist=ls22Get('mood_history',[]);
  if(moodHist.length>=7) unlockV22Achievement('v22_moodboard_artist');

  var msCount=0;
  try{
    for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('best-')===0&&parseInt(localStorage.getItem(k))>0)msCount++;}
  }catch(e){}
  var milestonesDone=0;
  if(msCount>=1) milestonesDone++;
  if(msCount>=10) milestonesDone++;
  if(msCount>=50) milestonesDone++;
  if(msCount>=100) milestonesDone++;
  if(localStorage.getItem('piano-v14-scale_progress')) milestonesDone++;
  if(localStorage.getItem('piano-v19-sight_stats')) milestonesDone++;
  var used=ls22Get('features_used',[]);
  if(used.length>=5) milestonesDone++;
  if(milestonesDone>=6) unlockV22Achievement('v22_milestone_half');

  var q13Stats=ls22Get('quiz13_stats',{total:0,correct:0,history:[]});
  if(q13Stats.total>=15&&q13Stats.correct/q13Stats.total>=0.9) unlockV22Achievement('v22_quiz13_s');
  if(q13Stats.total>=15) unlockV22Achievement('v22_quiz13_clear');

  if(used.length>=8) unlockV22Achievement('v22_all_features');

  var played=0;
  try{for(var j=0;j<localStorage.length;j++){var lk=localStorage.key(j);if(lk&&lk.indexOf('best-')===0&&parseInt(localStorage.getItem(lk))>0)played++;}}catch(e){}
  if(played>=65) unlockV22Achievement('v22_192songs');
}

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV22Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'Q':'emotion-matrix-modal',
      'W':'improv-gen-modal',
      'E':'interval-tower-modal',
      'R':'harmony-analyzer-modal',
      'T':'energy-manager-modal',
      'Y':'finger-gym-modal',
      'U':'moodboard-modal',
      'I':'milestone-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV22NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'🎭 감정',modal:'emotion-matrix-modal'},
    {label:'🎲 즉흥',modal:'improv-gen-modal'},
    {label:'🗼 인터벌',modal:'interval-tower-modal'},
    {label:'🔬 화성',modal:'harmony-analyzer-modal'},
    {label:'⚡ 에너지',modal:'energy-manager-modal'},
    {label:'💪 핑거짐',modal:'finger-gym-modal'},
    {label:'🎨 무드',modal:'moodboard-modal'},
    {label:'🗺️ 로드맵',modal:'milestone-modal'},
    {label:'🧠 퀴즈v13',modal:'quiz13-modal'}
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
function initV22(){
  addV22Songs();
  buildEmotionMatrixUI();
  buildImprovGenUI();
  buildIntervalTowerUI();
  buildHarmonyAnalyzerUI();
  buildEnergyManagerUI();
  buildFingerGymUI();
  buildMoodboardUI();
  buildMilestoneUI();
  buildQuizV13UI();
  injectV22Achievements();
  setupV22Shortcuts();
  injectV22NavButtons();
  setInterval(checkV22Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV22,5800);});
else setTimeout(initV22,5800);
})();
