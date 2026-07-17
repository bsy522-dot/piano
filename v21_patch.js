// Piano Master v21 Patch Module
// Chord Progression Builder, Practice Log Analyzer, Piano Memory Matching,
// Dynamics Trainer, Timbre Explorer, Score Symbol Guide, Sight-Play Challenge, Practice Diary
// 10 Songs (172->182), Quiz v12 15Q (165->180), 12 Achievements (180->192), SFX 13, Keyboard 8
(function(){
'use strict';
if(window.__v21Loaded) return;
window.__v21Loaded = true;

var LS21 = 'piano-v21-';
function ls21Get(k,d){try{var v=JSON.parse(localStorage.getItem(LS21+k));return v===null||v===undefined?d:v}catch(e){return d}}
function ls21Set(k,v){localStorage.setItem(LS21+k,JSON.stringify(v))}

// ================ WEB AUDIO SFX ENGINE v21 (13 sounds) ================
var sfx21 = (function(){
  try{return new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
})();
function tone21(freq,type,dur,gainVal,delayMs){
  if(!sfx21) return;
  setTimeout(function(){
    if(!sfx21) return;
    var t=sfx21.currentTime,g=sfx21.createGain(),o=sfx21.createOscillator();
    o.connect(g);g.connect(sfx21.destination);
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(gainVal,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur);
  },delayMs||0);
}
function playSFX21(type){
  if(!sfx21) return;
  if(sfx21.state==='suspended') sfx21.resume();
  switch(type){
    case 'chord_play': tone21(262,'triangle',0.3,0.06,0); tone21(330,'triangle',0.3,0.05,0); tone21(392,'triangle',0.3,0.05,0); break;
    case 'chord_add': tone21(523,'sine',0.1,0.07,0); break;
    case 'log_save': tone21(659,'triangle',0.12,0.06,0); tone21(784,'triangle',0.12,0.06,80); break;
    case 'match_flip': tone21(440,'sine',0.08,0.05,0); break;
    case 'match_pair': tone21(523,'triangle',0.1,0.08,0); tone21(784,'triangle',0.15,0.08,100); break;
    case 'match_fail': tone21(220,'sawtooth',0.15,0.04,0); break;
    case 'dynamics_hit': tone21(392,'sine',0.15,0.06,0); break;
    case 'timbre_switch': tone21(349,'triangle',0.2,0.05,0); tone21(440,'triangle',0.2,0.05,100); break;
    case 'score_learn': tone21(523,'sine',0.1,0.06,0); tone21(659,'sine',0.1,0.06,80); break;
    case 'sight_correct': tone21(784,'triangle',0.12,0.08,0); tone21(1047,'triangle',0.15,0.08,80); break;
    case 'sight_wrong': tone21(196,'sawtooth',0.2,0.05,0); break;
    case 'diary_save': tone21(440,'triangle',0.1,0.06,0); tone21(554,'triangle',0.1,0.06,80); tone21(659,'triangle',0.1,0.06,160); break;
    case 'v21_achieve': tone21(523,'triangle',0.1,0.1,0); tone21(659,'triangle',0.12,0.1,80); tone21(784,'triangle',0.12,0.1,160); tone21(1047,'triangle',0.25,0.1,240); break;
  }
}

// ================ COMMON MODAL BUILDER v21 ================
function makeV21Modal(id, title, contentFn){
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

function markV21Feature(name){
  var used=ls21Get('features_used',[]);
  if(used.indexOf(name)===-1){used.push(name);ls21Set('features_used',used);}
}

// ================ 10 NEW SONGS (172->182) ================
function addV21Songs(){
  if(!window.app||!app.songs) return;
  var newSongs=[
    {id:'s173',name:'베토벤 비창 소나타 2악장',category:'클래식',difficulty:'hard',
     notes:[{note:'Ab3',time:0,dur:0.8},{note:'C4',time:0.8,dur:0.4},{note:'Eb4',time:1.2,dur:0.4},{note:'Ab4',time:1.6,dur:0.6},{note:'G4',time:2.2,dur:0.3},{note:'F4',time:2.5,dur:0.3},{note:'Eb4',time:2.8,dur:0.6},{note:'Db4',time:3.4,dur:0.3},{note:'C4',time:3.7,dur:0.3},{note:'Bb3',time:4.0,dur:0.6},{note:'Ab3',time:4.6,dur:0.4},{note:'Eb4',time:5.0,dur:0.8}]},
    {id:'s174',name:'쇼팽 녹턴 Op.48 No.1',category:'클래식',difficulty:'expert',
     notes:[{note:'C4',time:0,dur:1.0},{note:'Eb4',time:1.0,dur:0.5},{note:'G4',time:1.5,dur:0.5},{note:'C5',time:2.0,dur:1.0},{note:'Bb4',time:3.0,dur:0.5},{note:'Ab4',time:3.5,dur:0.5},{note:'G4',time:4.0,dur:1.0},{note:'F4',time:5.0,dur:0.5},{note:'Eb4',time:5.5,dur:0.5},{note:'D4',time:6.0,dur:0.5},{note:'Eb4',time:6.5,dur:0.5},{note:'C4',time:7.0,dur:1.2}]},
    {id:'s175',name:'슈만 트로이메라이',category:'클래식',difficulty:'medium',
     notes:[{note:'F4',time:0,dur:0.5},{note:'A4',time:0.5,dur:0.5},{note:'C5',time:1.0,dur:0.5},{note:'F5',time:1.5,dur:1.0},{note:'E5',time:2.5,dur:0.5},{note:'D5',time:3.0,dur:0.5},{note:'C5',time:3.5,dur:0.5},{note:'Bb4',time:4.0,dur:0.5},{note:'A4',time:4.5,dur:0.5},{note:'G4',time:5.0,dur:0.5},{note:'F4',time:5.5,dur:0.5},{note:'C5',time:6.0,dur:1.0}]},
    {id:'s176',name:'멘델스존 봄의 노래',category:'클래식',difficulty:'medium',
     notes:[{note:'A4',time:0,dur:0.3},{note:'B4',time:0.3,dur:0.3},{note:'C5',time:0.6,dur:0.3},{note:'E5',time:0.9,dur:0.6},{note:'D5',time:1.5,dur:0.3},{note:'C5',time:1.8,dur:0.3},{note:'B4',time:2.1,dur:0.3},{note:'A4',time:2.4,dur:0.6},{note:'G4',time:3.0,dur:0.3},{note:'A4',time:3.3,dur:0.3},{note:'B4',time:3.6,dur:0.3},{note:'E5',time:3.9,dur:0.9}]},
    {id:'s177',name:'브람스 왈츠 Op.39 No.15',category:'클래식',difficulty:'hard',
     notes:[{note:'Ab4',time:0,dur:0.6},{note:'F4',time:0.6,dur:0.3},{note:'Ab4',time:0.9,dur:0.3},{note:'Db5',time:1.2,dur:0.6},{note:'C5',time:1.8,dur:0.3},{note:'Bb4',time:2.1,dur:0.3},{note:'Ab4',time:2.4,dur:0.6},{note:'F4',time:3.0,dur:0.3},{note:'Eb4',time:3.3,dur:0.3},{note:'F4',time:3.6,dur:0.3},{note:'Ab4',time:3.9,dur:0.3},{note:'Db5',time:4.2,dur:0.9}]},
    {id:'s178',name:'차이코프스키 백조의 호수',category:'클래식',difficulty:'hard',
     notes:[{note:'A4',time:0,dur:0.5},{note:'B4',time:0.5,dur:0.25},{note:'C5',time:0.75,dur:0.25},{note:'D5',time:1.0,dur:0.5},{note:'E5',time:1.5,dur:0.5},{note:'D5',time:2.0,dur:0.25},{note:'C5',time:2.25,dur:0.25},{note:'B4',time:2.5,dur:0.5},{note:'A4',time:3.0,dur:0.5},{note:'B4',time:3.5,dur:0.25},{note:'C5',time:3.75,dur:0.25},{note:'D5',time:4.0,dur:1.0}]},
    {id:'s179',name:'헨델 사라방드',category:'클래식',difficulty:'medium',
     notes:[{note:'D4',time:0,dur:0.8},{note:'A3',time:0.8,dur:0.4},{note:'D4',time:1.2,dur:0.4},{note:'F4',time:1.6,dur:0.8},{note:'E4',time:2.4,dur:0.4},{note:'D4',time:2.8,dur:0.4},{note:'C#4',time:3.2,dur:0.8},{note:'D4',time:4.0,dur:0.4},{note:'E4',time:4.4,dur:0.4},{note:'F4',time:4.8,dur:0.8},{note:'G4',time:5.6,dur:0.4},{note:'A4',time:6.0,dur:1.0}]},
    {id:'s180',name:'라벨 물의 장난',category:'클래식',difficulty:'expert',
     notes:[{note:'E5',time:0,dur:0.2},{note:'D#5',time:0.2,dur:0.2},{note:'E5',time:0.4,dur:0.2},{note:'B4',time:0.6,dur:0.2},{note:'D5',time:0.8,dur:0.2},{note:'C5',time:1.0,dur:0.2},{note:'A4',time:1.2,dur:0.4},{note:'C4',time:1.6,dur:0.2},{note:'E4',time:1.8,dur:0.2},{note:'A4',time:2.0,dur:0.4},{note:'B4',time:2.4,dur:0.2},{note:'C5',time:2.6,dur:0.6}]},
    {id:'s181',name:'스카를라티 소나타 K.141',category:'클래식',difficulty:'expert',
     notes:[{note:'D5',time:0,dur:0.15},{note:'C#5',time:0.15,dur:0.15},{note:'D5',time:0.3,dur:0.15},{note:'E5',time:0.45,dur:0.15},{note:'F5',time:0.6,dur:0.3},{note:'E5',time:0.9,dur:0.15},{note:'D5',time:1.05,dur:0.15},{note:'C#5',time:1.2,dur:0.15},{note:'B4',time:1.35,dur:0.15},{note:'A4',time:1.5,dur:0.3},{note:'G4',time:1.8,dur:0.15},{note:'F4',time:1.95,dur:0.6}]},
    {id:'s182',name:'포레 파반느',category:'클래식',difficulty:'medium',
     notes:[{note:'E4',time:0,dur:0.6},{note:'F#4',time:0.6,dur:0.3},{note:'G4',time:0.9,dur:0.3},{note:'A4',time:1.2,dur:0.6},{note:'B4',time:1.8,dur:0.3},{note:'A4',time:2.1,dur:0.3},{note:'G4',time:2.4,dur:0.6},{note:'F#4',time:3.0,dur:0.3},{note:'E4',time:3.3,dur:0.3},{note:'D4',time:3.6,dur:0.6},{note:'E4',time:4.2,dur:0.3},{note:'F#4',time:4.5,dur:0.9}]}
  ];
  newSongs.forEach(function(s){
    var exists=app.songs.some(function(ex){return ex.id===s.id});
    if(!exists) app.songs.push(s);
  });
}

// ================ 1. CHORD PROGRESSION BUILDER ================
function buildChordProgBuilderUI(){
  var CHORDS=[
    {name:'C',notes:['C4','E4','G4'],type:'major'},
    {name:'Dm',notes:['D4','F4','A4'],type:'minor'},
    {name:'Em',notes:['E4','G4','B4'],type:'minor'},
    {name:'F',notes:['F4','A4','C5'],type:'major'},
    {name:'G',notes:['G4','B4','D5'],type:'major'},
    {name:'Am',notes:['A3','C4','E4'],type:'minor'},
    {name:'Bdim',notes:['B3','D4','F4'],type:'dim'},
    {name:'C7',notes:['C4','E4','G4','Bb4'],type:'7th'},
    {name:'Dm7',notes:['D4','F4','A4','C5'],type:'7th'},
    {name:'G7',notes:['G3','B3','D4','F4'],type:'7th'},
    {name:'Fmaj7',notes:['F4','A4','C5','E5'],type:'7th'},
    {name:'Am7',notes:['A3','C4','E4','G4'],type:'7th'}
  ];
  var PRESETS=[
    {name:'Pop I-V-vi-IV',chords:['C','G','Am','F']},
    {name:'Jazz ii-V-I',chords:['Dm7','G7','Fmaj7']},
    {name:'Canon',chords:['C','G','Am','Em','F','C','F','G']},
    {name:'Blues I-IV-I-V',chords:['C7','F','C7','G7']},
    {name:'Ballad I-vi-IV-V',chords:['C','Am','F','G']},
    {name:'Sad i-iv-v',chords:['Am','Dm','Em']}
  ];

  makeV21Modal('chord-prog-modal','🎹 코드 진행 빌더',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">코드를 조합해 진행을 만들고 들어보세요. 프리셋 6종 제공.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
        '<select id="cp21-preset" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          '<option value="">-- 프리셋 --</option>'+PRESETS.map(function(p,i){return '<option value="'+i+'">'+p.name+'</option>'}).join('')+
        '</select>'+
        '<button id="cp21-play" style="padding:4px 10px;border-radius:4px;border:1px solid var(--green);background:rgba(34,197,94,0.2);color:var(--green);font-size:11px;cursor:pointer">&#9654; 재생</button>'+
        '<button id="cp21-clear" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">초기화</button>'+
        '<button id="cp21-save" style="padding:4px 10px;border-radius:4px;border:1px solid var(--purple);background:rgba(168,85,247,0.2);color:var(--purple);font-size:11px;cursor:pointer">저장</button>'+
      '</div>'+
      '<div id="cp21-chord-btns" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:10px"></div>'+
      '<canvas id="cp21-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var progression=ls21Get('chord_prog',[]);
    var savedProgs=ls21Get('chord_saved',[]);

    function noteToFreq21(name){
      var notes={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};
      var n=name.charAt(0),oct=parseInt(name.charAt(name.length-1));
      var sharp=name.indexOf('#')>=0?1:0;
      var flat=name.indexOf('b')>=0?-1:0;
      var semitone=(notes[n]||0)+sharp+flat+(oct+1)*12;
      return 440*Math.pow(2,(semitone-69)/12);
    }

    function playChordProg(){
      if(!sfx21||progression.length===0) return;
      if(sfx21.state==='suspended') sfx21.resume();
      var time=sfx21.currentTime+0.1;
      progression.forEach(function(chordName){
        var chord=CHORDS.find(function(c){return c.name===chordName});
        if(!chord) return;
        chord.notes.forEach(function(note){
          var g=sfx21.createGain(),o=sfx21.createOscillator();
          o.connect(g);g.connect(sfx21.destination);o.type='triangle';
          o.frequency.setValueAtTime(noteToFreq21(note),time);
          g.gain.setValueAtTime(0.04,time);g.gain.exponentialRampToValueAtTime(0.001,time+0.7);
          o.start(time);o.stop(time+0.8);
        });
        time+=0.85;
      });
    }

    function buildChordBtns(){
      var btns=document.getElementById('cp21-chord-btns');btns.innerHTML='';
      CHORDS.forEach(function(ch){
        var btn=document.createElement('button');
        var col=ch.type==='major'?'#3b82f6':ch.type==='minor'?'#a855f7':ch.type==='dim'?'#ef4444':'#eab308';
        btn.style.cssText='padding:6px 4px;border-radius:6px;border:1px solid '+col+'40;background:'+col+'15;color:'+col+';font-size:11px;font-weight:600;cursor:pointer';
        btn.textContent=ch.name;
        btn.addEventListener('click',function(){
          if(progression.length>=12) return;
          progression.push(ch.name);ls21Set('chord_prog',progression);
          drawCP21Canvas();playSFX21('chord_add');
        });
        btns.appendChild(btn);
      });
    }

    function drawCP21Canvas(){
      var c=document.getElementById('cp21-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('코드 진행 빌더',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText(progression.length+'/12 코드 | 저장: '+savedProgs.length+'개',20,42);

      if(progression.length>0){
        var barW=Math.min(50,Math.floor((W-60)/progression.length));
        var barH=60,startY=70;
        var typeColors={major:'#3b82f6',minor:'#a855f7',dim:'#ef4444','7th':'#eab308'};
        progression.forEach(function(chordName,i){
          var chord=CHORDS.find(function(c){return c.name===chordName});
          var col=chord?typeColors[chord.type]||'#4a7dff':'#4a7dff';
          var x=30+i*(barW+6);
          ctx.fillStyle=col+'30';ctx.fillRect(x,startY,barW,barH);
          ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(x,startY,barW,barH);
          ctx.fillStyle='#e8ecf4';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
          ctx.fillText(chordName,x+barW/2,startY+barH/2+5);
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText(chord?chord.type:'',x+barW/2,startY+barH+14);
          ctx.textAlign='left';
          if(i<progression.length-1){
            ctx.strokeStyle='#4a7dff60';ctx.lineWidth=1;
            ctx.beginPath();ctx.moveTo(x+barW+1,startY+barH/2);ctx.lineTo(x+barW+5,startY+barH/2);ctx.stroke();
            ctx.beginPath();ctx.moveTo(x+barW+3,startY+barH/2-3);ctx.lineTo(x+barW+5,startY+barH/2);ctx.lineTo(x+barW+3,startY+barH/2+3);ctx.fill();
          }
        });
      }

      var cx=W/2,staffY=180,lineGap=10;
      ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
      for(var l=0;l<5;l++){ctx.beginPath();ctx.moveTo(30,staffY+l*lineGap);ctx.lineTo(W-30,staffY+l*lineGap);ctx.stroke();}
      if(progression.length>0){
        var noteX=50,noteSpacing=(W-80)/Math.max(progression.length,1);
        progression.forEach(function(chordName,i){
          var chord=CHORDS.find(function(c){return c.name===chordName});
          if(!chord) return;
          var noteMap={'C4':staffY+4*lineGap+lineGap/2,'D4':staffY+4*lineGap,'E4':staffY+3*lineGap+lineGap/2,'F4':staffY+3*lineGap,'G4':staffY+2*lineGap+lineGap/2,'A4':staffY+2*lineGap,'B4':staffY+lineGap+lineGap/2,'C5':staffY+lineGap,'D5':staffY+lineGap/2,'E5':staffY,'A3':staffY+5*lineGap+lineGap,'B3':staffY+5*lineGap+lineGap/2,'G3':staffY+5*lineGap+lineGap*1.5,'Bb4':staffY+2*lineGap};
          var typeColors2={major:'#3b82f6',minor:'#a855f7',dim:'#ef4444','7th':'#eab308'};
          chord.notes.forEach(function(note){
            var ny=noteMap[note]||(staffY+2*lineGap);
            ctx.beginPath();ctx.ellipse(noteX+i*noteSpacing,ny,6,4,0,0,Math.PI*2);
            ctx.fillStyle=typeColors2[chord.type]||'#4a7dff';ctx.fill();
          });
        });
      }

      if(savedProgs.length>0){
        ctx.fillStyle='#a855f7';ctx.font='bold 11px sans-serif';
        ctx.fillText('저장된 진행',20,H-70);
        savedProgs.slice(-4).forEach(function(s,i){
          ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
          ctx.fillText((i+1)+'. '+s.name+': '+s.chords.join(' - ')+' ('+s.date+')',20,H-55+i*14);
        });
      }
      markV21Feature('chord_prog');
    }

    document.getElementById('cp21-preset').addEventListener('change',function(){
      var idx=parseInt(this.value);
      if(!isNaN(idx)&&PRESETS[idx]){
        progression=PRESETS[idx].chords.slice();
        ls21Set('chord_prog',progression);drawCP21Canvas();playSFX21('chord_add');
      }
    });
    document.getElementById('cp21-play').addEventListener('click',function(){playChordProg();playSFX21('chord_play');});
    document.getElementById('cp21-clear').addEventListener('click',function(){progression=[];ls21Set('chord_prog',progression);drawCP21Canvas();});
    document.getElementById('cp21-save').addEventListener('click',function(){
      if(progression.length===0) return;
      savedProgs.push({name:'진행 #'+(savedProgs.length+1),chords:progression.slice(),date:new Date().toISOString().slice(0,10)});
      if(savedProgs.length>10) savedProgs=savedProgs.slice(-10);
      ls21Set('chord_saved',savedProgs);drawCP21Canvas();playSFX21('log_save');
    });
    buildChordBtns();drawCP21Canvas();
  });
}

// ================ 2. PRACTICE LOG ANALYZER ================
function buildPracticeLogUI(){
  makeV21Modal('practice-log-modal','📈 연습 로그 분석기',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">연습 세션을 기록하고 주간/월간 분석을 확인하세요.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
        '<select id="pl-category" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          '<option value="scales">스케일</option><option value="etude">에튜드</option><option value="repertoire">레퍼토리</option>'+
          '<option value="sight">초견</option><option value="theory">이론</option><option value="improv">즉흥</option>'+
        '</select>'+
        '<select id="pl-minutes" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          '<option value="10">10분</option><option value="15">15분</option><option value="20">20분</option><option value="30" selected>30분</option>'+
          '<option value="45">45분</option><option value="60">60분</option><option value="90">90분</option><option value="120">120분</option>'+
        '</select>'+
        '<select id="pl-quality" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          '<option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option><option value="4">&#9733;&#9733;&#9733;&#9733;</option><option value="3" selected>&#9733;&#9733;&#9733;</option>'+
          '<option value="2">&#9733;&#9733;</option><option value="1">&#9733;</option>'+
        '</select>'+
        '<button id="pl-add" style="padding:4px 10px;border-radius:4px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">기록 추가</button>'+
      '</div>'+
      '<canvas id="pl-canvas" width="620" height="400" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var logs=ls21Get('practice_logs',[]);

    function drawPLCanvas(){
      var c=document.getElementById('pl-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('연습 분석 대시보드',20,25);

      var totalMin=0,totalSessions=logs.length;
      logs.forEach(function(l){totalMin+=l.minutes;});
      var avgQuality=logs.length>0?logs.reduce(function(a,l){return a+l.quality},0)/logs.length:0;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+totalSessions+'세션 | '+totalMin+'분 | 평균 품질 '+avgQuality.toFixed(1)+'/5',20,42);

      var catColors={scales:'#3b82f6',etude:'#22c55e',repertoire:'#eab308',sight:'#a855f7',theory:'#ef4444',improv:'#06b6d4'};
      var catNames={scales:'스케일',etude:'에튜드',repertoire:'레퍼토리',sight:'초견',theory:'이론',improv:'즉흥'};
      var catMins={};
      Object.keys(catColors).forEach(function(k){catMins[k]=0;});
      logs.forEach(function(l){catMins[l.category]=(catMins[l.category]||0)+l.minutes;});
      var maxCatMin=Math.max.apply(null,Object.values(catMins))||1;
      var barH=18,barStartY=60;
      var keys=Object.keys(catColors);
      keys.forEach(function(k,i){
        var y=barStartY+i*(barH+8);
        var bw=Math.round(catMins[k]/maxCatMin*(W/2-60));
        ctx.fillStyle='#1a2036';ctx.fillRect(80,y,W/2-60,barH);
        ctx.fillStyle=catColors[k];ctx.fillRect(80,y,bw,barH);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(80,y,W/2-60,barH);
        ctx.fillStyle=catColors[k];ctx.font='10px sans-serif';
        ctx.fillText(catNames[k],10,y+14);
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';
        ctx.fillText(catMins[k]+'분',85+bw,y+13);
      });

      var last14=[];
      var today=new Date();
      for(var d=13;d>=0;d--){
        var dt=new Date(today);dt.setDate(dt.getDate()-d);
        var dateStr=dt.toISOString().slice(0,10);
        var dayMin=0;
        logs.forEach(function(l){if(l.date===dateStr)dayMin+=l.minutes;});
        last14.push({date:dateStr,minutes:dayMin,day:dt.getDay()});
      }
      var chartX=W/2+20,chartW=W/2-50,chartH=120,chartY=60;
      ctx.fillStyle='#4a7dff';ctx.font='11px sans-serif';
      ctx.fillText('14일 연습 추이',chartX,chartY-8);
      var maxDay=Math.max.apply(null,last14.map(function(d){return d.minutes}))||1;
      var dayW=Math.floor(chartW/14)-2;
      last14.forEach(function(d,i){
        var x=chartX+i*(dayW+2);
        var h=Math.round(d.minutes/maxDay*chartH);
        ctx.fillStyle=d.minutes>0?(d.day===0||d.day===6?'#a855f7':'#3b82f6'):'#1a2036';
        ctx.fillRect(x,chartY+chartH-h,dayW,h);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(x,chartY+chartH-h,dayW,h);
        if(i%3===0){ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';ctx.fillText(d.date.slice(5),x,chartY+chartH+12);}
      });

      var cx=W/2-60,cy=H-80,r=55;
      if(totalMin>0){
        ctx.fillStyle='#eab308';ctx.font='bold 11px sans-serif';
        ctx.fillText('카테고리 비율',20,H-140);
        var startAngle=-Math.PI/2;
        keys.forEach(function(k){
          if(catMins[k]===0) return;
          var slice=catMins[k]/totalMin*Math.PI*2;
          ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,startAngle+slice);ctx.closePath();
          ctx.fillStyle=catColors[k]+'90';ctx.fill();
          ctx.strokeStyle='#0f1525';ctx.lineWidth=2;ctx.stroke();
          if(slice>0.3){
            var midA=startAngle+slice/2;
            ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';ctx.textAlign='center';
            ctx.fillText(catNames[k],cx+Math.cos(midA)*(r*0.6),cy+Math.sin(midA)*(r*0.6)+4);
            ctx.textAlign='left';
          }
          startAngle+=slice;
        });
      }

      if(logs.length>1){
        var qualX=W/2+20,qualY=H-140,qualW=W/2-50,qualH=80;
        ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';
        ctx.fillText('품질 트렌드',qualX,qualY-8);
        var recent=logs.slice(-14);
        ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.beginPath();
        recent.forEach(function(l,i){
          var x=qualX+i*((qualW)/(recent.length-1||1));
          var y=qualY+qualH-(l.quality/5)*qualH;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }

      var grade=totalMin>=600?'S':totalMin>=300?'A':totalMin>=120?'B':totalMin>=30?'C':'D';
      ctx.fillStyle='#eab308';ctx.font='bold 20px sans-serif';
      ctx.fillText(grade,W-45,35);
      markV21Feature('practice_log');
    }

    document.getElementById('pl-add').addEventListener('click',function(){
      var cat=document.getElementById('pl-category').value;
      var min=parseInt(document.getElementById('pl-minutes').value);
      var qual=parseInt(document.getElementById('pl-quality').value);
      logs.push({category:cat,minutes:min,quality:qual,date:new Date().toISOString().slice(0,10)});
      if(logs.length>200) logs=logs.slice(-200);
      ls21Set('practice_logs',logs);drawPLCanvas();playSFX21('log_save');
    });
    drawPLCanvas();
  });
}

// ================ 3. PIANO MEMORY MATCHING GAME ================
function buildMemoryMatchUI(){
  var CARDS_DATA=[
    {id:0,symbol:'&#119070;',name:'높은음자리표'},{id:1,symbol:'&#119073;',name:'낮은음자리표'},
    {id:2,symbol:'&#9833;',name:'온음표'},{id:3,symbol:'&#9834;',name:'2분음표'},
    {id:4,symbol:'&#9835;',name:'8분음표'},{id:5,symbol:'&#9837;',name:'플랫'},
    {id:6,symbol:'&#9839;',name:'샤프'},{id:7,symbol:'&#119082;',name:'쉼표'}
  ];

  makeV21Modal('memory-modal','🃏 음악 기호 매칭 게임',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">16장의 카드에서 같은 음악 기호 쌍을 찾으세요!</p>'+
      '<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">'+
        '<span id="mm-moves" style="font-size:12px;color:var(--text2)">이동: 0</span>'+
        '<span id="mm-pairs" style="font-size:12px;color:var(--green)">매칭: 0/8</span>'+
        '<span id="mm-time" style="font-size:12px;color:var(--accent)">00:00</span>'+
        '<button id="mm-new" style="padding:4px 10px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer">새 게임</button>'+
      '</div>'+
      '<div id="mm-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px"></div>'+
      '<canvas id="mm-canvas" width="580" height="200" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var cards=[],flipped=[],matched=[],moves=0,pairs=0,gameTimer=null,elapsed=0;
    var stats=ls21Get('memory_stats',{games:0,bestMoves:999,bestTime:9999});

    function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}

    function initGame(){
      cards=[];flipped=[];matched=[];moves=0;pairs=0;elapsed=0;
      if(gameTimer) clearInterval(gameTimer);
      var deck=[];
      CARDS_DATA.forEach(function(c){deck.push({id:c.id,symbol:c.symbol,name:c.name});deck.push({id:c.id,symbol:c.symbol,name:c.name});});
      cards=shuffle(deck);
      renderCards();updateDisplay();
      gameTimer=setInterval(function(){elapsed++;document.getElementById('mm-time').textContent=formatTime(elapsed);},1000);
    }

    function formatTime(s){var m=Math.floor(s/60),ss=s%60;return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss;}

    function renderCards(){
      var grid=document.getElementById('mm-grid');grid.innerHTML='';
      cards.forEach(function(card,idx){
        var div=document.createElement('div');
        var isFlipped=flipped.indexOf(idx)>=0;
        var isMatched=matched.indexOf(card.id)>=0;
        div.style.cssText='aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:'+(isMatched?'default':'pointer')+';font-size:28px;transition:0.3s;border:2px solid '+(isMatched?'var(--green)':isFlipped?'var(--accent)':'var(--border)')+';background:'+(isMatched?'rgba(34,197,94,0.15)':isFlipped?'rgba(74,125,255,0.15)':'var(--surface2)');
        div.innerHTML=isFlipped||isMatched?card.symbol:'?';
        if(!isMatched&&!isFlipped){
          div.addEventListener('click',function(){flipCard(idx);});
        }
        grid.appendChild(div);
      });
    }

    function flipCard(idx){
      if(flipped.length>=2||flipped.indexOf(idx)>=0||matched.indexOf(cards[idx].id)>=0) return;
      flipped.push(idx);playSFX21('match_flip');renderCards();
      if(flipped.length===2){
        moves++;
        var a=cards[flipped[0]],b=cards[flipped[1]];
        if(a.id===b.id){
          matched.push(a.id);pairs++;playSFX21('match_pair');
          flipped=[];renderCards();updateDisplay();
          if(pairs===8){
            clearInterval(gameTimer);
            stats.games++;
            if(moves<stats.bestMoves) stats.bestMoves=moves;
            if(elapsed<stats.bestTime) stats.bestTime=elapsed;
            ls21Set('memory_stats',stats);drawMMCanvas();
          }
        } else {
          playSFX21('match_fail');
          setTimeout(function(){flipped=[];renderCards();updateDisplay();},800);
        }
        updateDisplay();drawMMCanvas();
      }
    }

    function updateDisplay(){
      document.getElementById('mm-moves').textContent='이동: '+moves;
      document.getElementById('mm-pairs').textContent='매칭: '+pairs+'/8';
    }

    function drawMMCanvas(){
      var c=document.getElementById('mm-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('매칭 게임 기록',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('게임: '+stats.games+'회 | 최소 이동: '+(stats.bestMoves<999?stats.bestMoves:'-')+' | 최고 시간: '+(stats.bestTime<9999?formatTime(stats.bestTime):'-'),20,42);

      var pct=pairs/8;
      var barW=W-60,barH=24;
      ctx.fillStyle='#1a2036';ctx.fillRect(30,60,barW,barH);
      ctx.fillStyle='#22c55e';ctx.fillRect(30,60,barW*pct,barH);
      ctx.strokeStyle='#1e2640';ctx.strokeRect(30,60,barW,barH);
      ctx.fillStyle='#e8ecf4';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(pct*100)+'% 완료',30+barW/2,60+barH/2+4);ctx.textAlign='left';

      if(pairs===8){
        var grade=moves<=12?'S':moves<=16?'A':moves<=22?'B':moves<=30?'C':'D';
        ctx.fillStyle='#eab308';ctx.font='bold 28px sans-serif';ctx.textAlign='center';
        ctx.fillText(grade+' 등급!',W/2,130);
        ctx.fillStyle='#e8ecf4';ctx.font='13px sans-serif';
        ctx.fillText(moves+'회 이동 | '+formatTime(elapsed),W/2,155);ctx.textAlign='left';
      }

      var legendY=H-40;
      CARDS_DATA.slice(0,8).forEach(function(cd,i){
        var x=20+i*70;
        var isM=matched.indexOf(cd.id)>=0;
        ctx.fillStyle=isM?'#22c55e':'#8892a8';ctx.font='9px sans-serif';
        ctx.fillText((isM?'✓ ':'')+cd.name,x,legendY);
      });
      markV21Feature('memory_match');
    }

    document.getElementById('mm-new').addEventListener('click',function(){initGame();drawMMCanvas();});
    initGame();drawMMCanvas();
  });
}

// ================ 4. DYNAMICS TRAINER ================
function buildDynamicsTrainerUI(){
  var DYNAMICS=[
    {symbol:'ppp',name:'피아니시시모',level:1,desc:'가능한 한 여리게'},
    {symbol:'pp',name:'피아니시모',level:2,desc:'매우 여리게'},
    {symbol:'p',name:'피아노',level:3,desc:'여리게'},
    {symbol:'mp',name:'메조피아노',level:4,desc:'조금 여리게'},
    {symbol:'mf',name:'메조포르테',level:5,desc:'조금 세게'},
    {symbol:'f',name:'포르테',level:6,desc:'세게'},
    {symbol:'ff',name:'포르티시모',level:7,desc:'매우 세게'},
    {symbol:'fff',name:'포르티시시모',level:8,desc:'가능한 한 세게'}
  ];
  var EXPRESSIONS=[
    {symbol:'cresc.',name:'크레센도',desc:'점점 세게'},
    {symbol:'decresc.',name:'데크레센도',desc:'점점 여리게'},
    {symbol:'sfz',name:'스포르잔도',desc:'갑자기 세게'},
    {symbol:'fp',name:'포르테피아노',desc:'세게 후 바로 여리게'},
    {symbol:'dim.',name:'디미누엔도',desc:'점점 줄여서'},
    {symbol:'morendo',name:'모렌도',desc:'서서히 사라지듯'}
  ];

  makeV21Modal('dynamics-modal','🔊 셈여림 다이나믹 트레이너',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8단계 셈여림과 6종 표현 기호를 학습합니다. 볼륨바를 맞추세요!</p>'+
      '<div id="dyn-challenge" style="margin-bottom:10px"></div>'+
      '<canvas id="dyn-canvas" width="600" height="370" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var mastery=ls21Get('dynamics_mastery',new Array(8).fill(0));
    var exprLearned=ls21Get('dynamics_expr',{});
    var challengeTarget=-1,challengeGuess=-1;

    function startChallenge(){
      challengeTarget=Math.floor(Math.random()*8);
      challengeGuess=-1;
      var area=document.getElementById('dyn-challenge');
      area.innerHTML='<div style="text-align:center;padding:8px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">'+
        '<div style="font-size:11px;color:var(--text2);margin-bottom:6px">이 기호에 해당하는 볼륨 레벨을 선택하세요:</div>'+
        '<div style="font-size:28px;font-weight:700;color:var(--accent);margin-bottom:8px">'+DYNAMICS[challengeTarget].symbol+'</div>'+
        '<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap" id="dyn-btns"></div>'+
        '<div id="dyn-feedback" style="margin-top:8px;font-size:11px"></div></div>';
      var btns=document.getElementById('dyn-btns');
      for(var i=0;i<8;i++){
        (function(idx){
          var btn=document.createElement('button');
          btn.style.cssText='width:40px;height:30px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:10px;cursor:pointer';
          btn.textContent='Lv.'+(idx+1);
          btn.addEventListener('click',function(){
            if(challengeGuess>=0) return;
            challengeGuess=idx;
            if(idx===challengeTarget){
              btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';
              mastery[challengeTarget]=Math.min(mastery[challengeTarget]+1,10);
              ls21Set('dynamics_mastery',mastery);
              document.getElementById('dyn-feedback').innerHTML='<span style="color:var(--green)">&#10004; 정답! '+DYNAMICS[challengeTarget].name+' ('+DYNAMICS[challengeTarget].desc+')</span>';
              playSFX21('dynamics_hit');
            } else {
              btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
              Array.from(btns.children)[challengeTarget].style.background='rgba(34,197,94,0.3)';
              document.getElementById('dyn-feedback').innerHTML='<span style="color:var(--red)">&#10060; 정답은 Lv.'+(challengeTarget+1)+' '+DYNAMICS[challengeTarget].name+'</span>';
            }
            drawDynCanvas();
            setTimeout(startChallenge,2000);
          });
          btns.appendChild(btn);
        })(i);
      }
    }

    function drawDynCanvas(){
      var c=document.getElementById('dyn-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('셈여림 마스터리',20,25);

      var barW=Math.floor((W-60)/8)-4,barMaxH=140,startY=50;
      var gradientColors=['#06b6d4','#3b82f6','#22c55e','#84cc16','#eab308','#f97316','#ef4444','#dc2626'];
      DYNAMICS.forEach(function(d,i){
        var x=30+i*(barW+4);
        var h=Math.round(mastery[i]/10*barMaxH);
        ctx.fillStyle='#1a2036';ctx.fillRect(x,startY,barW,barMaxH);
        ctx.fillStyle=gradientColors[i];ctx.fillRect(x,startY+barMaxH-h,barW,h);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(x,startY,barW,barMaxH);
        ctx.fillStyle='#e8ecf4';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
        ctx.fillText(d.symbol,x+barW/2,startY+barMaxH+16);
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
        ctx.fillText(mastery[i]+'/10',x+barW/2,startY+barMaxH+28);
        ctx.textAlign='left';
      });

      var volY=startY+barMaxH+50;
      ctx.fillStyle='#a855f7';ctx.font='bold 11px sans-serif';
      ctx.fillText('볼륨 스펙트럼',20,volY);
      var specW=W-60,specH=16;
      var grad=ctx.createLinearGradient(30,0,30+specW,0);
      grad.addColorStop(0,'#06b6d4');grad.addColorStop(0.5,'#eab308');grad.addColorStop(1,'#dc2626');
      ctx.fillStyle=grad;ctx.fillRect(30,volY+8,specW,specH);
      ctx.strokeStyle='#1e2640';ctx.strokeRect(30,volY+8,specW,specH);
      DYNAMICS.forEach(function(d,i){
        var x=30+i/(DYNAMICS.length-1)*specW;
        ctx.strokeStyle='#e8ecf4';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,volY+8);ctx.lineTo(x,volY+8+specH);ctx.stroke();
        ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';ctx.textAlign='center';ctx.fillText(d.symbol,x,volY+8+specH+12);ctx.textAlign='left';
      });

      var exprY=volY+50;
      ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';
      ctx.fillText('표현 기호 사전',20,exprY);
      EXPRESSIONS.forEach(function(ex,i){
        var col=i<3?0:1;
        var row=i%3;
        var x=30+col*(W/2);
        var y=exprY+14+row*22;
        var isL=!!exprLearned[ex.symbol];
        ctx.fillStyle=isL?'#22c55e40':'#1a2036';
        ctx.fillRect(x,y,W/2-40,18);
        ctx.strokeStyle=isL?'#22c55e':'#1e2640';ctx.lineWidth=1;ctx.strokeRect(x,y,W/2-40,18);
        ctx.fillStyle=isL?'#22c55e':'#eab308';ctx.font='bold 10px sans-serif';
        ctx.fillText(ex.symbol,x+5,y+13);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(ex.name+' - '+ex.desc,x+60,y+13);
      });

      var canvas=document.getElementById('dyn-canvas');
      canvas.onclick=function(e){
        var rect=canvas.getBoundingClientRect();
        var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
        var my=(e.clientY-rect.top)*(canvas.height/rect.height);
        if(my>=exprY+14&&my<=exprY+14+3*22){
          EXPRESSIONS.forEach(function(ex,i){
            var col=i<3?0:1;var row=i%3;
            var x=30+col*(W/2);var y=exprY+14+row*22;
            if(mx>=x&&mx<=x+W/2-40&&my>=y&&my<=y+18){
              exprLearned[ex.symbol]=!exprLearned[ex.symbol];
              ls21Set('dynamics_expr',exprLearned);drawDynCanvas();playSFX21('score_learn');
            }
          });
        }
      };

      markV21Feature('dynamics');
    }

    startChallenge();drawDynCanvas();
  });
}

// ================ 5. TIMBRE EXPLORER ================
function buildTimbreExplorerUI(){
  var TIMBRES=[
    {name:'그랜드 피아노',type:'triangle',attack:0.01,decay:0.3,sustain:0.4,release:0.5,color:'#3b82f6'},
    {name:'업라이트 피아노',type:'sine',attack:0.02,decay:0.2,sustain:0.5,release:0.3,color:'#22c55e'},
    {name:'일렉트릭 피아노',type:'sine',attack:0.005,decay:0.15,sustain:0.6,release:0.4,color:'#eab308'},
    {name:'오르간',type:'square',attack:0.005,decay:0.05,sustain:0.8,release:0.1,color:'#a855f7'},
    {name:'하프시코드',type:'sawtooth',attack:0.002,decay:0.4,sustain:0.1,release:0.2,color:'#ef4444'},
    {name:'첼레스타',type:'sine',attack:0.005,decay:0.5,sustain:0.2,release:0.6,color:'#06b6d4'},
    {name:'비브라폰',type:'triangle',attack:0.01,decay:0.6,sustain:0.3,release:0.8,color:'#f97316'},
    {name:'클라비넷',type:'square',attack:0.001,decay:0.2,sustain:0.3,release:0.15,color:'#ec4899'}
  ];

  makeV21Modal('timbre-modal','🎼 음색 탐험기',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">8종 건반악기 음색을 비교 탐색합니다. ADSR 엔벨로프 시각화.</p>'+
      '<div id="tm-btns" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:10px"></div>'+
      '<canvas id="tm-canvas" width="600" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var selTimbre=0;
    var played=ls21Get('timbre_played',{});

    function buildTimbreBtns(){
      var div=document.getElementById('tm-btns');div.innerHTML='';
      TIMBRES.forEach(function(t,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:6px 4px;border-radius:6px;border:1px solid '+(i===selTimbre?t.color:'var(--border)')+';background:'+(i===selTimbre?t.color+'30':'var(--surface2)')+';color:'+(i===selTimbre?t.color:'var(--text)')+';font-size:10px;cursor:pointer';
        btn.textContent=t.name;
        btn.addEventListener('click',function(){
          selTimbre=i;buildTimbreBtns();drawTMCanvas();
          playTimbre(t);
          played[i]=true;ls21Set('timbre_played',played);
          playSFX21('timbre_switch');
        });
        div.appendChild(btn);
      });
    }

    function playTimbre(t){
      if(!sfx21) return;
      if(sfx21.state==='suspended') sfx21.resume();
      var notes=[262,330,392,523];
      var time=sfx21.currentTime+0.05;
      notes.forEach(function(freq,i){
        var g=sfx21.createGain(),o=sfx21.createOscillator();
        o.connect(g);g.connect(sfx21.destination);
        o.type=t.type;o.frequency.setValueAtTime(freq,time+i*0.4);
        g.gain.setValueAtTime(0,time+i*0.4);
        g.gain.linearRampToValueAtTime(0.06,time+i*0.4+t.attack);
        g.gain.linearRampToValueAtTime(0.06*t.sustain,time+i*0.4+t.attack+t.decay);
        g.gain.linearRampToValueAtTime(0.001,time+i*0.4+t.attack+t.decay+t.release);
        o.start(time+i*0.4);o.stop(time+i*0.4+t.attack+t.decay+t.release+0.1);
      });
    }

    function drawTMCanvas(){
      var c=document.getElementById('tm-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      var t=TIMBRES[selTimbre];
      ctx.fillStyle=t.color;ctx.font='bold 13px sans-serif';
      ctx.fillText(t.name+' - ADSR 엔벨로프',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('파형: '+t.type+' | A: '+t.attack+'s | D: '+t.decay+'s | S: '+(t.sustain*100).toFixed(0)+'% | R: '+t.release+'s',20,42);

      var envX=30,envY=60,envW=W-60,envH=150;
      ctx.strokeStyle='#1e2640';ctx.lineWidth=1;
      ctx.strokeRect(envX,envY,envW,envH);

      var totalTime=t.attack+t.decay+0.3+t.release;
      var aX=envX+(t.attack/totalTime)*envW;
      var dX=envX+((t.attack+t.decay)/totalTime)*envW;
      var sX=envX+((t.attack+t.decay+0.3)/totalTime)*envW;
      var rX=envX+envW;
      var peakY=envY;
      var sustainY=envY+envH*(1-t.sustain);
      var bottomY=envY+envH;

      ctx.beginPath();
      ctx.moveTo(envX,bottomY);
      ctx.lineTo(aX,peakY);
      ctx.lineTo(dX,sustainY);
      ctx.lineTo(sX,sustainY);
      ctx.lineTo(rX,bottomY);
      ctx.strokeStyle=t.color;ctx.lineWidth=3;ctx.stroke();

      ctx.fillStyle=t.color+'20';
      ctx.beginPath();ctx.moveTo(envX,bottomY);ctx.lineTo(aX,peakY);ctx.lineTo(dX,sustainY);ctx.lineTo(sX,sustainY);ctx.lineTo(rX,bottomY);ctx.closePath();ctx.fill();

      ctx.fillStyle='#e8ecf4';ctx.font='10px sans-serif';
      ctx.fillText('A',aX-5,bottomY+14);ctx.fillText('D',dX-5,bottomY+14);ctx.fillText('S',sX-5,bottomY+14);ctx.fillText('R',(sX+rX)/2-5,bottomY+14);

      ctx.setLineDash([4,4]);ctx.strokeStyle='#8892a860';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(envX,sustainY);ctx.lineTo(envX+envW,sustainY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';ctx.fillText('Sustain Level '+(t.sustain*100).toFixed(0)+'%',envX+envW-100,sustainY-5);

      var compY=envY+envH+40;
      ctx.fillStyle='#4a7dff';ctx.font='bold 11px sans-serif';
      ctx.fillText('음색 비교 (ADSR)',20,compY);
      var paramNames=['Attack','Decay','Sustain','Release'];
      var barH=14,barMaxW=(W-120)/2;
      TIMBRES.forEach(function(tb,ti){
        var col=ti<4?0:1;
        var row=ti%4;
        var x=30+col*(W/2);
        var y=compY+14+row*(barH+6);
        var vals=[tb.attack*20,tb.decay*2,tb.sustain,tb.release*2];
        var maxVal=Math.max.apply(null,vals);
        ctx.fillStyle=ti===selTimbre?tb.color:'#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(tb.name,x,y+11);
        var bx=x+75;
        vals.forEach(function(v,vi){
          var bw=Math.round(v/2*barMaxW/4);
          ctx.fillStyle=tb.color+(ti===selTimbre?'80':'30');
          ctx.fillRect(bx+vi*(barMaxW/4),y,Math.min(bw,barMaxW/4-2),barH);
        });
      });

      var exploredCount=Object.keys(played).length;
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('탐색: '+exploredCount+'/'+TIMBRES.length+' 음색',20,H-12);
      markV21Feature('timbre');
    }

    buildTimbreBtns();drawTMCanvas();
  });
}

// ================ 6. SCORE SYMBOL GUIDE ================
function buildScoreGuideUI(){
  var SYMBOLS=[
    {cat:'음표',items:[
      {s:'𝅝',n:'온음표',d:'4박, 빈 타원형'},
      {s:'𝅗𝅥',n:'2분음표',d:'2박, 빈 타원+기둥'},
      {s:'♩',n:'4분음표',d:'1박, 채운 타원+기둥'},
      {s:'♪',n:'8분음표',d:'1/2박, 4분음표+꼬리 1개'},
      {s:'♬',n:'16분음표',d:'1/4박, 4분음표+꼬리 2개'}
    ]},
    {cat:'쉼표',items:[
      {s:'𝄻',n:'온쉼표',d:'4박 쉼, 오선 4번째 줄 아래 매달림'},
      {s:'𝄼',n:'2분쉼표',d:'2박 쉼, 오선 3번째 줄 위에 올림'},
      {s:'𝄽',n:'4분쉼표',d:'1박 쉼, 지그재그 모양'},
      {s:'𝄾',n:'8분쉼표',d:'1/2박 쉼, 기울어진 선+점'}
    ]},
    {cat:'조표/기호',items:[
      {s:'♯',n:'샤프',d:'반음 올림'},
      {s:'♭',n:'플랫',d:'반음 내림'},
      {s:'♮',n:'내추럴',d:'원래 음으로 복귀'},
      {s:'𝄞',n:'높은음자리표',d:'트레블 클레프, G4 기준'},
      {s:'𝄢',n:'낮은음자리표',d:'베이스 클레프, F3 기준'}
    ]},
    {cat:'박자/반복',items:[
      {s:'𝄐',n:'페르마타',d:'음표를 원하는 만큼 연장'},
      {s:'𝄇',n:'반복 기호',d:'해당 구간 반복'},
      {s:'D.C.',n:'다 카포',d:'처음부터 반복'},
      {s:'D.S.',n:'달 세뇨',d:'세뇨 기호로 돌아감'},
      {s:'⊕',n:'코다',d:'종결부로 이동'}
    ]}
  ];

  makeV21Modal('score-guide-modal','📜 악보 기호 가이드',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">악보에서 자주 만나는 음악 기호를 학습합니다.</p>'+
      '<div id="sg-tabs" style="display:flex;gap:6px;margin-bottom:8px"></div>'+
      '<canvas id="sg-canvas" width="600" height="360" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>'+
      '<div id="sg-items" style="margin-top:8px"></div>';

    var selCat=0;
    var learned=ls21Get('score_learned',{});

    function buildSGTabs(){
      var tabs=document.getElementById('sg-tabs');tabs.innerHTML='';
      var catColors=['#3b82f6','#22c55e','#eab308','#a855f7'];
      SYMBOLS.forEach(function(cat,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:5px 10px;border-radius:6px;border:1px solid '+(i===selCat?catColors[i]:'var(--border)')+';background:'+(i===selCat?catColors[i]+'30':'var(--surface2)')+';color:'+(i===selCat?catColors[i]:'var(--text)')+';font-size:10px;cursor:pointer';
        btn.textContent=cat.cat;
        btn.addEventListener('click',function(){selCat=i;buildSGTabs();drawSGCanvas();showSGItems();playSFX21('score_learn');});
        tabs.appendChild(btn);
      });
    }

    function showSGItems(){
      var div=document.getElementById('sg-items');div.innerHTML='';
      var cat=SYMBOLS[selCat];
      cat.items.forEach(function(item){
        var key=selCat+'-'+item.n;
        var isL=!!learned[key];
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--surface2);border:1px solid '+(isL?'var(--green)':'var(--border)')+';border-radius:6px;margin-bottom:4px;cursor:pointer;transition:0.2s';
        row.innerHTML='<span style="font-size:22px;width:30px;text-align:center">'+item.s+'</span><div style="flex:1"><div style="font-size:12px;font-weight:600;'+(isL?'color:var(--green)':'')+'">'+item.n+'</div><div style="font-size:10px;color:var(--text2)">'+item.d+'</div></div><span style="font-size:14px">'+(isL?'✅':'⬜')+'</span>';
        row.addEventListener('click',function(){
          learned[key]=!learned[key];ls21Set('score_learned',learned);
          buildSGTabs();drawSGCanvas();showSGItems();playSFX21('score_learn');
        });
        div.appendChild(row);
      });
    }

    function drawSGCanvas(){
      var c=document.getElementById('sg-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('악보 기호 학습 진도',20,25);

      var totalItems=0,learnedCount=0;
      SYMBOLS.forEach(function(cat,ci){cat.items.forEach(function(item){totalItems++;if(learned[ci+'-'+item.n])learnedCount++;});});
      var pct=totalItems>0?Math.round(learnedCount/totalItems*100):0;

      var cx=120,cy=140,r=70;
      ctx.lineWidth=12;ctx.lineCap='round';
      ctx.strokeStyle='#1e2640';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=pct>=75?'#22c55e':pct>=50?'#eab308':'#3b82f6';
      ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct/100);ctx.stroke();
      ctx.fillStyle='#e8ecf4';ctx.font='bold 20px sans-serif';ctx.textAlign='center';
      ctx.fillText(pct+'%',cx,cy+5);
      ctx.font='10px sans-serif';ctx.fillStyle='#8892a8';
      ctx.fillText(learnedCount+'/'+totalItems+' 학습',cx,cy+22);ctx.textAlign='left';

      var catColors=['#3b82f6','#22c55e','#eab308','#a855f7'];
      SYMBOLS.forEach(function(cat,ci){
        var catTotal=cat.items.length;
        var catLearned=0;cat.items.forEach(function(it){if(learned[ci+'-'+it.n])catLearned++;});
        var y=70+ci*30;
        var barW=200,barH=18;
        ctx.fillStyle='#1a2036';ctx.fillRect(280,y,barW,barH);
        ctx.fillStyle=catColors[ci];ctx.fillRect(280,y,barW*(catLearned/catTotal),barH);
        ctx.strokeStyle='#1e2640';ctx.strokeRect(280,y,barW,barH);
        ctx.fillStyle=catColors[ci];ctx.font='10px sans-serif';
        ctx.fillText(cat.cat,240,y+13);
        ctx.fillStyle='#e8ecf4';ctx.font='9px sans-serif';
        ctx.fillText(catLearned+'/'+catTotal,285+barW*(catLearned/catTotal),y+13);
      });

      var staffY=240;
      ctx.strokeStyle='#2a3050';ctx.lineWidth=1;
      for(var l=0;l<5;l++){ctx.beginPath();ctx.moveTo(30,staffY+l*10);ctx.lineTo(W-30,staffY+l*10);ctx.stroke();}

      var cat=SYMBOLS[selCat];
      var spacing=(W-80)/Math.max(cat.items.length,1);
      cat.items.forEach(function(item,i){
        var x=50+i*spacing;
        var isL=!!learned[selCat+'-'+item.n];
        ctx.fillStyle=isL?'#22c55e':'#e8ecf4';ctx.font='24px sans-serif';ctx.textAlign='center';
        ctx.fillText(item.s,x,staffY+25);
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText(item.n,x,staffY+55);
        ctx.textAlign='left';
      });

      var grade=pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=25?'C':'D';
      ctx.fillStyle='#eab308';ctx.font='bold 18px sans-serif';
      ctx.fillText(grade,W-40,35);
      markV21Feature('score_guide');
    }

    buildSGTabs();drawSGCanvas();showSGItems();
  });
}

// ================ 7. SIGHT-PLAY CHALLENGE ================
function buildSightPlayUI(){
  var NOTES=['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];
  var NOTE_NAMES={'C4':'도','D4':'레','E4':'미','F4':'파','G4':'솔','A4':'라','B4':'시','C5':'높은도','D5':'높은레','E5':'높은미'};

  makeV21Modal('sight-play-modal','👁️ 초견 연주 챌린지',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">오선보에 표시된 음표를 보고 빠르게 맞추세요! 15라운드 타임어택.</p>'+
      '<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">'+
        '<span id="sp-round" style="font-size:12px;color:var(--text2)">R: 0/15</span>'+
        '<span id="sp-score" style="font-size:12px;color:var(--green)">정답: 0</span>'+
        '<span id="sp-timer" style="font-size:12px;color:var(--accent)">--</span>'+
        '<button id="sp-start" style="padding:4px 10px;border-radius:4px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">시작</button>'+
      '</div>'+
      '<canvas id="sp-staff-canvas" width="580" height="140" style="width:100%;border-radius:8px;background:#0a0e1a;margin-bottom:8px"></canvas>'+
      '<div id="sp-btns" style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:10px"></div>'+
      '<canvas id="sp-canvas" width="580" height="200" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var round=0,score=0,currentNote=null,answered=false,roundTimes=[];
    var stats=ls21Get('sight_stats',{total:0,correct:0,history:[],avgTime:0});
    var roundStart=0;

    function drawStaffNote(noteName){
      var c=document.getElementById('sp-staff-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);

      var staffY=30,lineGap=14;
      ctx.strokeStyle='#2a3050';ctx.lineWidth=1.5;
      for(var l=0;l<5;l++){ctx.beginPath();ctx.moveTo(30,staffY+l*lineGap);ctx.lineTo(W-30,staffY+l*lineGap);ctx.stroke();}

      ctx.fillStyle='#4a7dff';ctx.font='40px serif';ctx.fillText('\u{1D11E}',40,staffY+4*lineGap-5);

      if(noteName){
        var noteYMap={'E5':staffY-lineGap,'D5':staffY-lineGap/2,'C5':staffY,'B4':staffY+lineGap/2,'A4':staffY+lineGap,'G4':staffY+lineGap*1.5,'F4':staffY+lineGap*2,'E4':staffY+lineGap*2.5,'D4':staffY+lineGap*3,'C4':staffY+lineGap*3.5};
        var ny=noteYMap[noteName]||(staffY+lineGap*2);
        if(noteName==='C4'){
          ctx.strokeStyle='#8892a8';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(W/2-15,ny);ctx.lineTo(W/2+15,ny);ctx.stroke();
        }
        if(noteName==='D5'||noteName==='E5'){
          ctx.strokeStyle='#8892a8';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(W/2-15,staffY-lineGap);ctx.lineTo(W/2+15,staffY-lineGap);ctx.stroke();
        }
        ctx.beginPath();ctx.ellipse(W/2,ny,10,7,-0.2,0,Math.PI*2);
        ctx.fillStyle=answered?(currentNote===noteName?'#22c55e':'#ef4444'):'#e8ecf4';ctx.fill();
        ctx.fillRect(W/2+8,ny-30,2.5,30);
      }

      ctx.fillStyle='#8892a8';ctx.font='11px sans-serif';
      ctx.fillText('이 음표는 무엇일까요?',W/2-50,H-10);
    }

    function buildNoteBtns(){
      var div=document.getElementById('sp-btns');div.innerHTML='';
      NOTES.forEach(function(n){
        var btn=document.createElement('button');
        btn.style.cssText='padding:8px 4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;cursor:pointer;font-weight:600';
        btn.textContent=NOTE_NAMES[n]+' ('+n+')';
        btn.addEventListener('click',function(){
          if(answered||!currentNote) return;
          answered=true;
          var elapsed=Date.now()-roundStart;
          roundTimes.push(elapsed);
          stats.total++;
          if(n===currentNote){
            score++;stats.correct++;btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';
            playSFX21('sight_correct');
          } else {
            btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';
            playSFX21('sight_wrong');
          }
          drawStaffNote(currentNote);
          document.getElementById('sp-score').textContent='정답: '+score;
          document.getElementById('sp-timer').textContent=(elapsed/1000).toFixed(1)+'s';
          ls21Set('sight_stats',stats);drawSPCanvas();
          if(round<15){
            setTimeout(nextRound,1200);
          } else {
            var avgT=roundTimes.reduce(function(a,b){return a+b},0)/roundTimes.length;
            stats.avgTime=Math.round(avgT);
            stats.history.push({score:score,date:new Date().toISOString().slice(0,10),avgTime:Math.round(avgT)});
            if(stats.history.length>20) stats.history=stats.history.slice(-20);
            ls21Set('sight_stats',stats);drawSPCanvas();
          }
        });
        div.appendChild(btn);
      });
    }

    function nextRound(){
      round++;answered=false;
      currentNote=NOTES[Math.floor(Math.random()*NOTES.length)];
      roundStart=Date.now();
      document.getElementById('sp-round').textContent='R: '+round+'/15';
      document.getElementById('sp-timer').textContent='--';
      drawStaffNote(currentNote);
      Array.from(document.getElementById('sp-btns').children).forEach(function(b){b.style.background='var(--surface2)';b.style.borderColor='var(--border)';});
    }

    function drawSPCanvas(){
      var c=document.getElementById('sp-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('초견 연주 성적',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+stats.total+'문 | 정답 '+stats.correct+'문 | 평균 반응 '+(stats.avgTime>0?(stats.avgTime/1000).toFixed(1)+'s':'-'),20,42);

      if(roundTimes.length>0){
        var barW=Math.min(35,Math.floor((W-60)/roundTimes.length));
        var maxT=Math.max.apply(null,roundTimes);
        roundTimes.forEach(function(t,i){
          var x=30+i*(barW+2);
          var h=Math.round(t/maxT*100);
          ctx.fillStyle=t<2000?'#22c55e':t<4000?'#eab308':'#ef4444';
          ctx.fillRect(x,150-h,barW,h);
          ctx.fillStyle='#8892a8';ctx.font='7px sans-serif';
          ctx.fillText((t/1000).toFixed(1),x,150+10);
        });
        ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
        ctx.fillText('반응 시간 (초)',20,170);
      }

      if(stats.history.length>1){
        ctx.fillStyle='#a855f7';ctx.font='10px sans-serif';
        ctx.fillText('점수 추이',W/2+20,60);
        var hLen=Math.min(stats.history.length,10);
        var step=(W/2-60)/(hLen-1||1);
        ctx.strokeStyle='#a855f7';ctx.lineWidth=2;ctx.beginPath();
        for(var i=0;i<hLen;i++){
          var entry=stats.history[stats.history.length-hLen+i];
          var x=W/2+30+i*step;
          var y=180-(entry.score/15)*120;
          if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }

      markV21Feature('sight_play');
    }

    document.getElementById('sp-start').addEventListener('click',function(){
      round=0;score=0;answered=false;roundTimes=[];
      document.getElementById('sp-round').textContent='R: 0/15';
      document.getElementById('sp-score').textContent='정답: 0';
      nextRound();drawSPCanvas();
    });
    buildNoteBtns();drawStaffNote(null);drawSPCanvas();
  });
}

// ================ 8. PRACTICE DIARY ================
function buildPracticeDiaryUI(){
  makeV21Modal('diary-modal','📔 연습 일지 다이어리',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">매일의 연습을 기록하고 기분/목표/메모를 관리합니다.</p>'+
      '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'+
        '<select id="di-mood" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px">'+
          '<option value="5">&#128512; 최고</option><option value="4">&#128522; 좋음</option><option value="3" selected>&#128528; 보통</option>'+
          '<option value="2">&#128533; 아쉬움</option><option value="1">&#128542; 힘듦</option>'+
        '</select>'+
        '<input id="di-goal" type="text" placeholder="오늘의 목표..." style="flex:1;padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;min-width:100px">'+
        '<button id="di-save" style="padding:4px 10px;border-radius:4px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:11px;cursor:pointer">기록</button>'+
      '</div>'+
      '<textarea id="di-memo" placeholder="연습 메모, 배운 점, 어려운 구간..." style="width:100%;height:50px;padding:6px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:11px;resize:vertical;margin-bottom:8px"></textarea>'+
      '<canvas id="di-canvas" width="620" height="380" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var entries=ls21Get('diary_entries',[]);

    function drawDiaryCanvas(){
      var c=document.getElementById('di-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('연습 일지 캘린더',20,25);
      ctx.fillStyle='#8892a8';ctx.font='10px sans-serif';
      ctx.fillText('총 '+entries.length+'개 기록',20,42);

      var cellW=Math.floor((W-60)/7);
      var cellH=36;
      var startY=60;
      var days=['일','월','화','수','목','금','토'];
      days.forEach(function(d,i){
        ctx.fillStyle=i===0?'#ef4444':i===6?'#3b82f6':'#8892a8';
        ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText(d,30+i*cellW+cellW/2,startY);
        ctx.textAlign='left';
      });

      var today=new Date();
      var year=today.getFullYear(),month=today.getMonth();
      var firstDay=new Date(year,month,1).getDay();
      var daysInMonth=new Date(year,month+1,0).getDate();

      ctx.fillStyle='#eab308';ctx.font='bold 11px sans-serif';
      ctx.fillText(year+'.'+(month+1),W-80,25);

      var entryMap={};
      entries.forEach(function(e){entryMap[e.date]=e;});

      for(var d=1;d<=daysInMonth;d++){
        var col=(firstDay+d-1)%7;
        var row=Math.floor((firstDay+d-1)/7);
        var x=30+col*cellW;
        var y=startY+10+row*(cellH+4);
        var dateStr=year+'-'+(month<9?'0':'')+(month+1)+'-'+(d<10?'0':'')+d;
        var entry=entryMap[dateStr];
        var isToday=d===today.getDate();

        ctx.fillStyle=entry?'rgba(74,125,255,0.15)':'#1a2036';
        ctx.fillRect(x,y,cellW-4,cellH);
        ctx.strokeStyle=isToday?'#eab308':entry?'#4a7dff40':'#1e2640';
        ctx.lineWidth=isToday?2:1;ctx.strokeRect(x,y,cellW-4,cellH);

        ctx.fillStyle=isToday?'#eab308':'#e8ecf4';ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText(d+'',x+(cellW-4)/2,y+14);

        if(entry){
          var moods=['','&#128542;','&#128533;','&#128528;','&#128522;','&#128512;'];
          ctx.fillStyle='#8892a8';ctx.font='8px sans-serif';
          ctx.fillText('M'+entry.mood,x+(cellW-4)/2,y+28);
        }
        ctx.textAlign='left';
      }

      var listY=startY+10+7*(cellH+4)+10;
      if(entries.length>0){
        ctx.fillStyle='#a855f7';ctx.font='bold 11px sans-serif';
        ctx.fillText('최근 기록',20,listY);
        entries.slice(-5).reverse().forEach(function(e,i){
          var moods2=['','힘듦','아쉬움','보통','좋음','최고'];
          ctx.fillStyle='#8892a8';ctx.font='9px sans-serif';
          var text=e.date+' | '+moods2[e.mood]+' | '+(e.goal||'목표 없음');
          ctx.fillText(text,20,listY+16+i*14);
        });
      }

      if(entries.length>6){
        var moodData=entries.slice(-14);
        var chartX=W/2+30,chartW=W/2-60,chartH=80,chartY=listY-20;
        ctx.fillStyle='#22c55e';ctx.font='bold 10px sans-serif';
        ctx.fillText('기분 추이',chartX,chartY-5);
        ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.beginPath();
        moodData.forEach(function(e,i){
          var x=chartX+i*((chartW)/(moodData.length-1||1));
          var y2=chartY+chartH-(e.mood/5)*chartH;
          if(i===0) ctx.moveTo(x,y2); else ctx.lineTo(x,y2);
        });
        ctx.stroke();
      }

      markV21Feature('diary');
    }

    document.getElementById('di-save').addEventListener('click',function(){
      var mood=parseInt(document.getElementById('di-mood').value);
      var goal=document.getElementById('di-goal').value.trim();
      var memo=document.getElementById('di-memo').value.trim();
      var dateStr=new Date().toISOString().slice(0,10);
      var existing=entries.findIndex(function(e){return e.date===dateStr;});
      if(existing>=0){
        entries[existing]={date:dateStr,mood:mood,goal:goal,memo:memo};
      } else {
        entries.push({date:dateStr,mood:mood,goal:goal,memo:memo});
      }
      if(entries.length>365) entries=entries.slice(-365);
      ls21Set('diary_entries',entries);
      drawDiaryCanvas();playSFX21('diary_save');
      document.getElementById('di-goal').value='';
      document.getElementById('di-memo').value='';
    });
    drawDiaryCanvas();
  });
}

// ================ QUIZ v12 (15 NEW QUESTIONS, 165->180) ================
function buildQuizV12UI(){
  var QUESTIONS=[
    {q:'셈여림 기호 mf는 무엇의 약자인가요?',a:['메조포르테','메조피아노','포르티시모','포르테피아노'],c:0},
    {q:'소나타 형식의 3단계 구성은?',a:['제시부-발전부-재현부','서론-본론-결론','A-B-A','기승전결'],c:0},
    {q:'코드 진행 I-IV-V-I에서 G 장조의 IV는?',a:['C','D','Em','Am'],c:0},
    {q:'스타카토(staccato)의 올바른 설명은?',a:['짧고 끊어서 연주','부드럽게 이어서','점점 빠르게','처음 빠르기로'],c:0},
    {q:'피아노 건반에서 두 개의 검은 건반 그룹 왼쪽 흰건반은?',a:['C','D','E','F'],c:0},
    {q:'4/4 박자에서 온음표의 길이는 몇 박?',a:['4박','2박','1박','8박'],c:0},
    {q:'페르마타 기호의 의미는?',a:['원하는 만큼 연장','반복','곡 끝','세게'],c:0},
    {q:'앨버티 베이스(Alberti bass)란?',a:['분산 화음 반주 패턴','베이스 라인 강조','왼손 스케일','왼손 옥타브'],c:0},
    {q:'피아노에서 한 옥타브는 몇 개의 반음으로 구성?',a:['12','8','7','10'],c:0},
    {q:'아다지오(Adagio)의 빠르기는?',a:['느리게','빠르게','보통 빠르기','매우 빠르게'],c:0},
    {q:'장3화음(Major triad)의 구성 음정은?',a:['근음+장3도+완전5도','근음+단3도+완전5도','근음+장3도+증5도','근음+단3도+감5도'],c:0},
    {q:'D.C. al Fine의 의미는?',a:['처음부터 Fine까지 반복','끝까지 반복','코다로 이동','느리게 마무리'],c:0},
    {q:'피아노 조율에서 A4의 표준 진동수는?',a:['440Hz','432Hz','442Hz','438Hz'],c:0},
    {q:'3연음표(triplet)란?',a:['2박 안에 3개 음 균등 배치','3박 안에 2개 음','빠른 트릴','점음표 변형'],c:0},
    {q:'프랑스 작곡가 드뷔시의 대표적 음악 사조는?',a:['인상주의','낭만주의','고전주의','바로크'],c:0}
  ];

  makeV21Modal('quiz12-modal','🧠 피아노 퀴즈 v12',function(content){
    content.innerHTML=
      '<p style="font-size:11px;color:var(--text2);margin-bottom:10px">15문항 피아노 지식 퀴즈. 셈여림, 형식, 코드, 기호, 역사!</p>'+
      '<div id="q12-area" style="margin-bottom:10px"></div>'+
      '<canvas id="q12-canvas" width="560" height="300" style="width:100%;border-radius:8px;background:#0a0e1a"></canvas>';

    var qIdx=0,score=0,answered=false;
    var stats=ls21Get('quiz12_stats',{total:0,correct:0,history:[]});

    function showQuestion(){
      var area=document.getElementById('q12-area');
      if(qIdx>=QUESTIONS.length){
        var pct=Math.round(score/QUESTIONS.length*100);
        var grade=pct>=90?'S':pct>=70?'A':pct>=50?'B':pct>=30?'C':'D';
        stats.history.push({score:score,total:QUESTIONS.length,date:new Date().toISOString().slice(0,10)});
        if(stats.history.length>20) stats.history=stats.history.slice(-20);
        ls21Set('quiz12_stats',stats);
        area.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:700;color:var(--accent)">퀴즈 완료!</div><div style="font-size:14px;margin-top:8px;color:var(--green)">'+score+'/'+QUESTIONS.length+' ('+grade+'등급)</div><button id="q12-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:white;font-size:12px;cursor:pointer">다시 풀기</button></div>';
        document.getElementById('q12-retry').addEventListener('click',function(){qIdx=0;score=0;answered=false;showQuestion();drawQ12Canvas();});
        drawQ12Canvas();
        return;
      }
      var q=QUESTIONS[qIdx];
      area.innerHTML='<div style="font-size:12px;color:var(--accent);margin-bottom:4px">Q'+(qIdx+1)+'/'+QUESTIONS.length+'</div>'+
        '<div style="font-size:13px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'+
        '<div id="q12-opts" style="display:flex;flex-direction:column;gap:6px"></div>';
      var opts=document.getElementById('q12-opts');
      q.a.forEach(function(a,i){
        var btn=document.createElement('button');
        btn.style.cssText='padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:0.2s';
        btn.textContent=a;
        btn.addEventListener('click',function(){
          if(answered) return;answered=true;stats.total++;
          if(i===q.c){score++;stats.correct++;btn.style.background='rgba(34,197,94,0.3)';btn.style.borderColor='var(--green)';playSFX21('sight_correct');}
          else{btn.style.background='rgba(239,68,68,0.3)';btn.style.borderColor='var(--red)';playSFX21('sight_wrong');
            Array.from(opts.children)[q.c].style.background='rgba(34,197,94,0.3)';Array.from(opts.children)[q.c].style.borderColor='var(--green)';
          }
          ls21Set('quiz12_stats',stats);drawQ12Canvas();
          setTimeout(function(){qIdx++;answered=false;showQuestion();},1200);
        });
        opts.appendChild(btn);
      });
    }

    function drawQ12Canvas(){
      var c=document.getElementById('q12-canvas');if(!c) return;
      var ctx=c.getContext('2d'),W=c.width,H=c.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f1525';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a7dff';ctx.font='bold 13px sans-serif';
      ctx.fillText('퀴즈 v12 성적',20,25);
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

    showQuestion();drawQ12Canvas();
  });
}

// ================ 12 NEW ACHIEVEMENTS (180->192) ================
var V21_ACHIEVEMENTS=[
  {id:'v21_chord_builder',name:'코드 장인',desc:'코드 진행 3개 이상 저장'},
  {id:'v21_practice_logger',name:'연습 기록가',desc:'연습 로그 10세션 이상 기록'},
  {id:'v21_memory_master',name:'매칭 마스터',desc:'매칭 게임 16회 이하 이동으로 클리어'},
  {id:'v21_dynamics_pro',name:'셈여림 달인',desc:'셈여림 8단계 마스터리 모두 5+'},
  {id:'v21_timbre_explorer',name:'음색 탐험가',desc:'8종 음색 모두 탐색'},
  {id:'v21_score_reader',name:'악보 해독가',desc:'악보 기호 19개 중 14개 이상 학습'},
  {id:'v21_sight_ace',name:'초견 에이스',desc:'초견 챌린지 S등급 달성 (13/15+)'},
  {id:'v21_diary_writer',name:'일지 작성가',desc:'연습 일지 7일 이상 기록'},
  {id:'v21_quiz12_s',name:'퀴즈 v12 S등급',desc:'퀴즈 v12에서 90% 이상 달성'},
  {id:'v21_quiz12_clear',name:'퀴즈 v12 클리어',desc:'퀴즈 v12 전문 풀기 완료'},
  {id:'v21_all_features',name:'v21 올클리어',desc:'v21 8가지 기능 모두 사용'},
  {id:'v21_182songs',name:'182곡 도전자',desc:'60곡 이상 연주 기록'}
];

function injectV21Achievements(){
  if(!window.app) window.app={};
  if(!app.achievements) app.achievements=[];
  V21_ACHIEVEMENTS.forEach(function(a){
    var exists=app.achievements.some(function(e){return e.id===a.id});
    if(!exists){
      a.unlocked=ls21Get('ach_'+a.id,false);
      app.achievements.push(a);
    }
  });
}

function unlockV21Achievement(id){
  if(ls21Get('ach_'+id,false)) return;
  ls21Set('ach_'+id,true);
  if(window.app&&app.achievements){
    app.achievements.forEach(function(a){if(a.id===id)a.unlocked=true;});
  }
  playSFX21('v21_achieve');
  var ach=V21_ACHIEVEMENTS.find(function(a){return a.id===id});
  if(ach){
    var toast=document.createElement('div');
    toast.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#eab308;color:#000;padding:8px 16px;border-radius:8px;font-size:12px;z-index:9999;animation:modalIn 0.3s';
    toast.textContent='\u{1F3C6} 업적 해금: '+ach.name;
    document.body.appendChild(toast);
    setTimeout(function(){toast.remove()},3000);
  }
}

function checkV21Achievements(){
  var chordSaved=ls21Get('chord_saved',[]);
  if(chordSaved.length>=3) unlockV21Achievement('v21_chord_builder');

  var logs=ls21Get('practice_logs',[]);
  if(logs.length>=10) unlockV21Achievement('v21_practice_logger');

  var memStats=ls21Get('memory_stats',{games:0,bestMoves:999});
  if(memStats.bestMoves<=16) unlockV21Achievement('v21_memory_master');

  var dynMastery=ls21Get('dynamics_mastery',[]);
  if(dynMastery.length>=8&&dynMastery.every(function(m){return m>=5;})) unlockV21Achievement('v21_dynamics_pro');

  var timbrePlayed=ls21Get('timbre_played',{});
  if(Object.keys(timbrePlayed).length>=8) unlockV21Achievement('v21_timbre_explorer');

  var scoreLearned=ls21Get('score_learned',{});
  if(Object.keys(scoreLearned).filter(function(k){return scoreLearned[k]}).length>=14) unlockV21Achievement('v21_score_reader');

  var sightStats=ls21Get('sight_stats',{total:0,correct:0,history:[]});
  if(sightStats.history.length>0){
    var best=sightStats.history.reduce(function(max,e){return e.score>max?e.score:max},0);
    if(best>=13) unlockV21Achievement('v21_sight_ace');
  }

  var diary=ls21Get('diary_entries',[]);
  if(diary.length>=7) unlockV21Achievement('v21_diary_writer');

  var q12Stats=ls21Get('quiz12_stats',{total:0,correct:0,history:[]});
  if(q12Stats.total>=15&&q12Stats.correct/q12Stats.total>=0.9) unlockV21Achievement('v21_quiz12_s');
  if(q12Stats.total>=15) unlockV21Achievement('v21_quiz12_clear');

  var used=ls21Get('features_used',[]);
  if(used.length>=8) unlockV21Achievement('v21_all_features');

  var played=0;
  try{for(var i=0;i<localStorage.length;i++){var lk=localStorage.key(i);if(lk&&lk.indexOf('best-')===0&&parseInt(localStorage.getItem(lk))>0)played++;}}catch(e){}
  if(played>=60) unlockV21Achievement('v21_182songs');
}

// ================ KEYBOARD SHORTCUTS (Shift+key) ================
function setupV21Shortcuts(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey) return;
    if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'||document.activeElement.tagName==='SELECT')) return;
    var map={
      'A':'chord-prog-modal',
      'S':'practice-log-modal',
      'D':'memory-modal',
      'F':'dynamics-modal',
      'G':'timbre-modal',
      'H':'score-guide-modal',
      'J':'sight-play-modal',
      'K':'diary-modal'
    };
    if(map[e.key]){
      e.preventDefault();
      var m=document.getElementById(map[e.key]);
      if(m) m.style.display='flex';
    }
  });
}

// ================ APPEND BUTTONS TO EXISTING NAV BAR ================
function injectV21NavButtons(){
  var existingNav=document.querySelector('.v19-nav-bar')||document.querySelector('.v18-nav-bar')||document.querySelector('.v17-nav-bar')||document.querySelector('.v16-nav-bar')||document.querySelector('.v15-nav-bar');
  if(!existingNav){return;}
  var items=[
    {label:'\u{1F3B9} 코드진행',modal:'chord-prog-modal'},
    {label:'\u{1F4C8} 연습로그',modal:'practice-log-modal'},
    {label:'\u{1F0CF} 매칭게임',modal:'memory-modal'},
    {label:'\u{1F50A} 셀여림',modal:'dynamics-modal'},
    {label:'\u{1F3BC} 음색',modal:'timbre-modal'},
    {label:'\u{1F4DC} 악보기호',modal:'score-guide-modal'},
    {label:'\u{1F441}️ 초견',modal:'sight-play-modal'},
    {label:'\u{1F4D4} 일지',modal:'diary-modal'},
    {label:'\u{1F9E0} 퀴즈v12',modal:'quiz12-modal'}
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
function initV21(){
  addV21Songs();
  buildChordProgBuilderUI();
  buildPracticeLogUI();
  buildMemoryMatchUI();
  buildDynamicsTrainerUI();
  buildTimbreExplorerUI();
  buildScoreGuideUI();
  buildSightPlayUI();
  buildPracticeDiaryUI();
  buildQuizV12UI();
  injectV21Achievements();
  setupV21Shortcuts();
  injectV21NavButtons();
  setInterval(checkV21Achievements, 15000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(initV21,5500);});
else setTimeout(initV21,5500);
})();
