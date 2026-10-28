import {showcases} from './showcases.mjs';
const path=location.pathname,params=new URLSearchParams(location.search),example=params.get('example'),personal=params.get('personal')==='1',info=showcases.find(s=>s.id===example);
const current=path.startsWith('/keepsake')?(personal?'saved':'examples'):path.startsWith('/gallery')||path.startsWith('/room')&&!personal?'examples':path.startsWith('/create')?'editor':personal?'saved':'home';
for(const link of document.querySelectorAll('[data-nav]'))if(link.dataset.nav===current)link.setAttribute('aria-current','page');
const context=document.querySelector('#page-context');if(context){const label=document.createElement('p');label.className='page-location';const actions=document.createElement('nav');actions.setAttribute('aria-label','Page shortcuts');
 function action(text,href){const a=document.createElement('a');a.textContent=text;a.href=href;actions.append(a);}
 if(path.startsWith('/create')){label.textContent=info?'Editing a copy · '+info.title:'Room editor · changes need saving';if(info)action('← Back to this example','/room/?example='+encodeURIComponent(example));action('Choose a start','#start-title');action('AI arrangement','#arrange-title');action('Room & objects','#room-workspace');action('Save & backup','#save-room-actions');}
 else if(path.startsWith('/gallery')){label.textContent='Example rooms · explore without changing your saved room';action('Current preview','#gallery-room-title');action('Choose another room','#choose-room');}
 else if(path.startsWith('/room')){label.textContent=info?'Example rooms / '+info.title:personal?'My saved room · viewing saved changes':'Example rooms / Original reading-room demo';if(info){action('← All example rooms','/gallery/');action('Edit a copy','/create/?example='+encodeURIComponent(example));}else if(personal)action('Edit my room','/create/');else action('← All example rooms','/gallery/');action('Room','#room');action('Discovery journal','#journal-title');}
 else if(path.startsWith('/keepsake'))label.textContent=info?'Printable keepsake / '+info.title:'Printable keepsake';
 if(label.textContent){context.append(label,actions);}else context.hidden=true;
}

// Open an optional panel before native anchor navigation targets its contents.
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const target=document.getElementById(link.hash.slice(1));for(let panel=target?.closest('details');panel;panel=panel.parentElement?.closest('details'))panel.open=true;});
