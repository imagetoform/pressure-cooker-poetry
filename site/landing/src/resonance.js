/* PCP Resonance Engine: opt-in, local-only Web Audio visualizer; no recording or upload. */
(function(){
"use strict";
if(window.PCPResonance)return;
var style=document.createElement("style");
style.textContent=`
#res-toggle{position:fixed;right:14px;bottom:calc(var(--barH,60px) + 12px);z-index:1090;background:#efba2e;color:#111;border:3px solid #111;box-shadow:4px 4px #111;padding:10px 14px;min-height:44px;font:800 13px Archivo,Arial,sans-serif;cursor:pointer}
#res-toggle[data-on="yes"]{background:#ff617f}
#res-modal[hidden]{display:none!important}
#res-modal{position:fixed;inset:0;z-index:1200;background:#08060bcc;display:grid;place-items:center;padding:16px}
#res-dialog{background:#f1e9d8;color:#111;width:min(480px,100%);border:4px solid #111;box-shadow:9px 9px #efba2e;padding:24px;font-family:Archivo,Arial,sans-serif}
#res-dialog h2{font:900 clamp(26px,5vw,39px)/1 Anton,Impact,sans-serif;margin:0 0 14px}
#res-dialog p{line-height:1.5;margin:0 0 12px}
#res-dialog button{min-height:44px;border:2px solid #111;padding:9px 12px;margin:5px 6px 5px 0;background:#efba2e;color:#111;font-weight:800;cursor:pointer}
#res-dialog button.secondary{background:transparent}
#res-dialog label{display:block;font-weight:700;margin:14px 0 4px}
#res-dialog input{width:100%}
#res-status{min-height:1.4em;font-size:.85rem;margin-top:10px}
body.res-active .cut img{transform:translate3d(var(--rx,0px),var(--ry,0px),0) rotate(var(--rr,0deg)) scale(var(--rs,1));transform-origin:center;will-change:transform}
@media(prefers-reduced-motion:reduce){body.res-active .cut img{transform:none!important;will-change:auto!important}}
`;
document.head.appendChild(style);
var toggle=document.createElement("button");toggle.id="res-toggle";toggle.type="button";toggle.textContent="◉ Sound motion";toggle.dataset.on="no";toggle.setAttribute("aria-haspopup","dialog");toggle.setAttribute("aria-controls","res-modal");
var modal=document.createElement("div");modal.id="res-modal";modal.hidden=true;
modal.innerHTML='<section id="res-dialog" role="dialog" aria-modal="true" aria-labelledby="res-title" aria-describedby="res-explain" tabindex="-1"><h2 id="res-title">MAKE SOME NOISE.</h2><p id="res-explain">Speak, clap or play music and watch the collage react. Microphone audio is analyzed only in this browser. Nothing is recorded, stored, transcribed or transmitted.</p><p>Permission is requested only when you choose Enable. You can turn it off at any time.</p><label for="res-sense">Sensitivity <output id="res-value">65%</output></label><input type="range" id="res-sense" min="10" max="100" step="5" value="65"><p id="res-status" role="status" aria-live="polite">Microphone off.</p><button type="button" id="res-enable">Enable microphone</button><button type="button" id="res-disable" class="secondary" hidden>Turn microphone off</button><button type="button" id="res-close" class="secondary">Close</button></section>';
document.body.append(toggle,modal);
var dialog=document.getElementById("res-dialog"),enable=document.getElementById("res-enable"),disable=document.getElementById("res-disable"),close=document.getElementById("res-close"),sense=document.getElementById("res-sense"),value=document.getElementById("res-value"),status=document.getElementById("res-status");
var reduced=matchMedia("(prefers-reduced-motion:reduce)");
var stream=null,ctx=null,source=null,analyser=null,wave=null,freq=null,raf=0,on=false,starting=false,items=[],refreshAt=0,smoothed=0,t=0,previousFocus=null,attempt=0;
function message(s){status.textContent=s}
function getItems(){items=Array.from(document.querySelectorAll(".cut img")).slice(0,180)}
function stop(){
 attempt++;on=false;starting=false;cancelAnimationFrame(raf);raf=0;
 if(stream){stream.getTracks().forEach(function(track){track.stop()})}stream=null;
 if(source){try{source.disconnect()}catch(e){}}source=null;
 if(analyser){try{analyser.disconnect()}catch(e){}}analyser=null;
 if(ctx){var old=ctx;ctx=null;old.close().catch(function(){})}
 items.forEach(function(img){["--rx","--ry","--rr","--rs"].forEach(function(n){img.style.removeProperty(n)})});items=[];
 document.body.classList.remove("res-active");toggle.dataset.on="no";toggle.textContent="◉ Sound motion";enable.hidden=false;disable.hidden=true;enable.disabled=false;message("Microphone off.");
}
function frame(now){
 if(!on||!analyser)return;
 raf=requestAnimationFrame(frame);
 if(reduced.matches)return;
 if(now-refreshAt>900){getItems();refreshAt=now}
 analyser.getByteTimeDomainData(wave);analyser.getByteFrequencyData(freq);
 var sum=0;for(var i=0;i<wave.length;i++){var z=(wave[i]-128)/128;sum+=z*z}
 var rms=Math.sqrt(sum/wave.length),bassEnd=Math.max(1,Math.floor(240*freq.length/(ctx.sampleRate/2))),highStart=Math.min(freq.length-1,Math.floor(1800*freq.length/(ctx.sampleRate/2))),bass=0,high=0;
 for(i=0;i<bassEnd;i++)bass+=freq[i];for(i=highStart;i<freq.length;i++)high+=freq[i];
 bass/=bassEnd*255;high/=Math.max(1,freq.length-highStart)*255;
 var gain=Number(sense.value)/65,target=Math.max(0,Math.min(1,(rms*5+bass*.8+high*.3-.09)*gain));
 smoothed+=(target-smoothed)*(target>smoothed?.32:.12);t+=.13;
 items.forEach(function(img,i){
 var pulse=(i%3===0?bass*.9+smoothed*.5:i%3===1?smoothed:high*.8+smoothed*.45)*Math.min(1.6,gain);
 var angle=t*(1+i%4)*.2+i*2.4;
 img.style.setProperty("--rx",(Math.sin(angle)*14*pulse).toFixed(2)+"px");
 img.style.setProperty("--ry",(Math.cos(angle*1.2)*19*pulse).toFixed(2)+"px");
 img.style.setProperty("--rr",(Math.sin(angle*.7)*11*pulse).toFixed(2)+"deg");
 img.style.setProperty("--rs",(1+Math.min(.15,bass*.09+pulse*.035)).toFixed(3));
 });
}
async function start(){
 if(on||starting)return;
 if(reduced.matches){message("Reduced motion is enabled on this device; sound animation is disabled.");return}
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!(window.AudioContext||window.webkitAudioContext)){message("Microphone unavailable. HTTPS and a compatible browser are required.");return}
 starting=true;enable.disabled=true;message("Requesting microphone permission…");var thisAttempt=++attempt;
 try{
  var granted=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
  if(thisAttempt!==attempt){granted.getTracks().forEach(function(track){track.stop()});return}
  stream=granted;stream.getAudioTracks().forEach(function(track){track.addEventListener("ended",stop,{once:true})});
  ctx=new (window.AudioContext||window.webkitAudioContext)();source=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.7;source.connect(analyser);
  wave=new Uint8Array(analyser.fftSize);freq=new Uint8Array(analyser.frequencyBinCount);await ctx.resume();
  if(thisAttempt!==attempt){stop();return}
  on=true;document.body.classList.add("res-active");getItems();enable.hidden=true;disable.hidden=false;toggle.dataset.on="yes";toggle.textContent="● Mic on · Settings";message("Microphone on. Audio stays on this device.");raf=requestAnimationFrame(frame);
 }catch(e){if(thisAttempt===attempt){stop();message(e&&e.name==="NotAllowedError"?"Permission denied. The site still works normally.":"Could not use the microphone: "+(e.name||"unknown error"))}}
 finally{if(thisAttempt===attempt){starting=false;enable.disabled=false}}
}
function open(){previousFocus=document.activeElement;modal.hidden=false;dialog.focus()}
function hide(){modal.hidden=true;(previousFocus&&previousFocus.focus?previousFocus:toggle).focus()}
toggle.addEventListener("click",open);close.addEventListener("click",hide);enable.addEventListener("click",start);disable.addEventListener("click",stop);
sense.addEventListener("input",function(){value.textContent=sense.value+"%"});
modal.addEventListener("click",function(e){if(e.target===modal)hide()});
modal.addEventListener("keydown",function(e){
 if(e.key==="Escape"){e.preventDefault();hide();return}
 if(e.key!=="Tab")return;
 var focusable=Array.from(dialog.querySelectorAll('button:not([hidden]):not([disabled]),input:not([disabled])'));var first=focusable[0],last=focusable[focusable.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
reduced.addEventListener("change",function(){if(reduced.matches&&on){stop();message("Stopped: reduced motion enabled.")}});
document.addEventListener("visibilitychange",function(){if(document.hidden&&(on||starting))stop()});
window.addEventListener("pagehide",stop);
window.PCPResonance={stop:stop,isActive:function(){return on}};
})();