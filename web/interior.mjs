// Original, code-drawn artwork. No external images or user HTML are inserted.
const art = {
 photograph:`<rect x="12" y="8" width="116" height="104" rx="2" fill="#654b35" stroke="#b18b5e" stroke-width="4"/><rect x="23" y="19" width="94" height="82" fill="#c9b794"/><path d="M28 86V45L58 32 109 48V86Z" fill="#65736e"/><path d="M45 85V58H93V85M26 87H113" fill="#374c4d" stroke="#9a9d86" stroke-width="3"/><path d="M98 20H116V38Z" fill="#e2d4b6"/><path d="M18 108L125 101" stroke="#382b23"/>`,
 letter:`<path d="M8 42L112 24 135 90 28 112Z" fill="#b5a183" stroke="#e1cdae"/><path d="M8 42L80 74 112 24M28 112L61 66M135 90L94 61" fill="none" stroke="#786951"/><path d="M20 13L102 9 111 67 29 73Z" fill="#ddd0b4" stroke="#a89373"/><path d="M35 30L89 27M37 39L94 35M38 48L82 44" stroke="#797261" stroke-width="2"/><circle cx="91" cy="57" r="15" fill="none" stroke="#967754" opacity=".5"/><circle cx="78" cy="78" r="9" fill="#916045"/>`,
 radio:`<rect x="5" y="24" width="130" height="82" rx="12" fill="#624b38" stroke="#b5966c" stroke-width="3"/><rect x="15" y="36" width="62" height="58" rx="5" fill="#212b2c"/><path d="M23 40V90M31 40V90M39 40V90M47 40V90M55 40V90M63 40V90M71 40V90" stroke="#9f8b6b" stroke-width="2"/><rect x="87" y="39" width="37" height="19" fill="#d8aa64"/><path d="M92 44H119M95 47V53M102 47V53M109 47V53M116 47V53" stroke="#604b32"/><circle cx="95" cy="79" r="10" fill="#242e30" stroke="#b89b70"/><circle cx="119" cy="79" r="7" fill="#242e30" stroke="#b89b70"/>`,
 clock:`<path d="M25 105V51A45 45 0 0 1 90 11Q117 24 115 55V105Z" fill="#624d37" stroke="#b69464" stroke-width="3"/><circle cx="70" cy="52" r="34" fill="#d9cfb5" stroke="#332e27" stroke-width="4"/><path d="M70 22V27M100 52H95M70 82V77M40 52H45M70 52V29M70 52L89 63" stroke="#343d3c" stroke-width="3"/><circle cx="70" cy="52" r="3" fill="#343d3c"/><rect x="16" y="105" width="108" height="8" fill="#9c7c54"/><path d="M61 95H80" stroke="#d7be8e"/>`,
 frame:`<path d="M68 6V12L26 28M68 12L116 28" stroke="#80735d" fill="none"/><rect x="24" y="26" width="94" height="85" fill="none" stroke="#ad8c5c" stroke-width="10"/><rect x="31" y="33" width="80" height="71" fill="none" stroke="#493e31" stroke-width="3"/><path d="M19 23L33 37M109 37L122 23M19 115L33 101M109 101L122 115" stroke="#d2b075" stroke-width="5"/>`
};
export function objectIllustration(id){return `<svg viewBox="0 0 140 120" aria-hidden="true" focusable="false">${art[id]||art.frame}</svg>`;}
export function mountInterior(scene){
 scene.classList.add('interior');scene.dataset.time='dusk';scene.dataset.lamp='on';
 scene.querySelectorAll(':scope > div').forEach(el=>el.remove());
 const drawing=document.createElement('div');drawing.className='interior-drawing';drawing.setAttribute('aria-hidden','true');
 drawing.innerHTML=`<svg viewBox="0 0 1200 760" preserveAspectRatio="none" focusable="false">
 <defs>
 <linearGradient id="plaster" x2="0" y2="1"><stop stop-color="#344047"/><stop offset="1" stop-color="#26343b"/></linearGradient>
 <linearGradient id="wood" x2="0" y2="1"><stop stop-color="#65513e"/><stop offset="1" stop-color="#302c2a"/></linearGradient>
 <linearGradient id="glass" x2="0" y2="1"><stop stop-color="#536575"/><stop offset="1" stop-color="#a99978"/></linearGradient>
 <radialGradient id="pool"><stop stop-color="#efbd73" stop-opacity=".5"/><stop offset="1" stop-color="#efbd73" stop-opacity="0"/></radialGradient>
 <pattern id="grain" width="130" height="35" patternUnits="userSpaceOnUse"><path d="M0 9Q45 2 130 13M0 26Q80 16 130 29M15 17Q48 9 78 17T120 19" fill="none" stroke="#b29872" stroke-opacity=".13"/></pattern>
 </defs>
 <path d="M0 0H1200L1080 64H160Z" fill="#19252e"/><path d="M0 0L160 64V522L0 700Z" fill="#202c34"/><path d="M160 64H1080V522H160Z" fill="url(#plaster)"/><path d="M1080 64L1200 0V700L1080 522Z" fill="#18252e"/>
 <path d="M160 522H1080L1200 760H0Z" fill="url(#wood)"/><path d="M160 522H1080L1200 760H0Z" fill="url(#grain)"/>
 <g stroke="#191f22" stroke-width="2" opacity=".65">${Array.from({length:13},(_,i)=>`<path d="M${160+i*77} 522L${-160+i*125} 760"/>`).join('')}<path d="M117 585H1112M63 665H1152M200 585V610M620 665V700M950 522V547"/></g>
 <path d="M165 512H1078V526H160L0 710V695Z" fill="#71634e"/><path d="M160 116H1080M0 68L160 116" stroke="#7b7c6b" stroke-width="5" opacity=".45"/>
 <g fill="#131f28" opacity=".2"><path d="M510 65Q470 170 535 234Q564 160 550 65Z"/><path d="M935 65Q918 152 967 176L990 65Z"/></g><path d="M1030 65H1080V123Q1044 108 1030 65" fill="#aaa18a" opacity=".3"/>
 <path d="M20 222L116 177V554L20 662Z" fill="#080f17" stroke="#695c49" stroke-width="10"/><path d="M30 642L107 556" stroke="#e9bf7b" stroke-width="4" opacity=".7"/><path d="M76 211L111 195V549L76 583Z" fill="#172028"/>
 <g class="room-window"><rect x="215" y="150" width="180" height="270" fill="url(#glass)" stroke="#88765c" stroke-width="12"/><path d="M305 150V420M215 273H395" stroke="#5b5246" stroke-width="8"/><path d="M205 425H410" stroke="#ac9570" stroke-width="12"/><path d="M225 360L270 336 303 352 342 331 391 352V415H225Z" fill="#283c48" opacity=".5"/></g>
 <path class="curtain" d="M195 133H280Q252 249 272 415Q233 398 199 421Q222 260 195 133" fill="#827e70" opacity=".8"/><path d="M189 134H415" stroke="#a49170" stroke-width="5"/>
 <path class="day-shaft" d="M220 274L389 290 882 711 548 740Z" fill="#e5d6ac" opacity=".08"/>
 <rect x="900" y="192" width="110" height="165" rx="48" fill="#15232c" stroke="#56605b" stroke-width="8"/><path d="M888 357H1024" stroke="#a08b66" stroke-width="10"/>
 <path d="M788 395H1010V531H788Z" fill="#5b5143"/><path d="M818 426H982V526H818Z" fill="#101c25"/><path d="M775 391H1023" stroke="#9f8b68" stroke-width="14"/><path d="M844 505H955" stroke="#483e33" stroke-width="10"/>
 <g><rect x="1040" y="225" width="103" height="345" fill="#3f3b33" stroke="#75664f" stroke-width="6"/><path d="M1091 232V558M1049 254H1133V531H1049Z" fill="none" stroke="#615742"/><circle cx="1081" cy="405" r="3" fill="#c5a471"/><circle cx="1101" cy="405" r="3" fill="#c5a471"/></g>
 <g fill="#483f32" stroke="#857254" stroke-width="5"><rect x="431" y="191" width="115" height="211"/><path d="M433 260H545M433 328H545"/></g><g stroke-width="12"><path d="M449 206V252M478 208V252M510 210V252M449 278V320M489 275V320" stroke="#827960"/><path d="M464 211V252M529 209V252M469 280V320M512 278V320" stroke="#585e59"/></g>
 <path d="M386 598L813 572 964 704 435 737Z" fill="#514b42" stroke="#82745b" stroke-width="3" opacity=".7"/><path d="M418 611L799 590 917 692 454 719Z" fill="none" stroke="#a08a64" stroke-dasharray="4 9" opacity=".4"/>
 <ellipse cx="653" cy="630" rx="248" ry="42" fill="#080e15" opacity=".35"/>
 <path d="M443 462H803L852 505H399Z" fill="#877052"/><path d="M400 505H851V527H400Z" fill="#514334"/><path d="M422 526L411 660H430L446 526M798 526L819 646H838L821 526" fill="#4b4033"/><path d="M470 527H762V569H470Z" fill="#61513d" stroke="#302c27"/><path d="M590 545H643" stroke="#baa17a" stroke-width="4"/>
 <g stroke="#69583f" stroke-width="10" fill="#514a39"><path d="M542 638L542 555Q591 537 642 551L652 628M544 579L644 575M547 608L648 602" fill="none"/><path d="M537 638L651 627 677 655 557 671Z"/><path d="M555 670L548 723M669 657L684 709"/></g>
 <g><path d="M729 459V363" stroke="#a58a5d" stroke-width="6"/><ellipse cx="729" cy="464" rx="29" ry="7" fill="#9d8157"/><path class="lamp-shade" d="M704 324H749L772 375H681Z" fill="#d7af70"/><ellipse class="lamp-pool" cx="725" cy="481" rx="175" ry="115" fill="url(#pool)"/></g>
 <path d="M440 460H490V450H442V438H481" fill="none" stroke="#858270" stroke-width="10"/><path d="M783 464V445H802V464Q793 472 783 464M803 448Q819 445 811 459H804" fill="#b1a58a" stroke="#5b5548" stroke-width="2"/>
 <path d="M345 415L350 388H375L381 415Z" fill="#76624b"/><path d="M365 388V354M365 370L350 359M365 379L378 363" stroke="#6e735d" stroke-width="3" fill="none"/>
 <path d="M578 180V204Q592 214 599 196" fill="none" stroke="#af9873" stroke-width="4"/>
 <rect x="634" y="156" width="135" height="140" fill="#7a8071" opacity=".16"/>
 <path class="lamp-mark" d="M651 488l13 -3m-6 -3l5 8" stroke="#e9cb92" stroke-width="2"/>
 <g class="dust" fill="#efdeb7">${Array.from({length:24},(_,i)=>`<circle cx="${225+(i*67)%610}" cy="${150+(i*43)%350}" r="${i%3===0?1.8:1}" opacity="${.15+i%4*.08}"/>`).join('')}</g>
 </svg>`;
 scene.prepend(drawing);
 for(const b of scene.querySelectorAll('.object')){const label=b.querySelector('span:last-child').textContent;b.innerHTML=objectIllustration(b.dataset.id);const span=document.createElement('span');span.textContent=label;b.append(span);b.setAttribute('aria-label','Explore '+label.replace(/^\d+ · /,''));}
 const controls=document.createElement('div');controls.className='mood-controls';controls.innerHTML='<label>Window light <select aria-label="Time of day"><option value="dawn">Dawn</option><option value="day">Day</option><option value="dusk" selected>Dusk</option><option value="night">Night</option></select></label><button type="button" aria-pressed="true">Lamp on</button><button type="button" aria-pressed="false">Radio sound off</button><span>Sound is optional. The clock remains stopped at four.</span>';
 scene.parentElement.after(controls);
 controls.querySelector('select').addEventListener('change',e=>scene.dataset.time=e.target.value);
 const [lamp,sound]=controls.querySelectorAll('button');lamp.onclick=()=>{const on=scene.dataset.lamp!=='on';scene.dataset.lamp=on?'on':'off';lamp.textContent='Lamp '+(on?'on':'off');lamp.setAttribute('aria-pressed',String(on));};
 let audio=null;
 function stop(){audio?.close();audio=null;sound.textContent='Radio sound off';sound.setAttribute('aria-pressed','false');}
 sound.onclick=async()=>{if(audio){stop();return;}try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio=new Audio();await audio.resume();const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate);const samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.12;const noise=audio.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audio.createBiquadFilter();filter.type='bandpass';filter.frequency.value=650;const gain=audio.createGain();gain.gain.value=.12;noise.connect(filter).connect(gain).connect(audio.destination);noise.start();sound.textContent='Radio sound on';sound.setAttribute('aria-pressed','true');}catch{stop();sound.textContent='Sound unavailable';}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');scene.addEventListener('pointermove',e=>{if(reduced.matches||e.buttons||e.pointerType!=='mouse')return;const r=scene.getBoundingClientRect();drawing.style.transform=`translate(${(e.clientX-r.left)/r.width*3-1.5}px,${(e.clientY-r.top)/r.height*2-1}px)`;});scene.addEventListener('pointerleave',()=>drawing.style.transform='');reduced.addEventListener('change',()=>drawing.style.transform='');
}
