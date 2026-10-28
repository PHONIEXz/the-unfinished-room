"""Render short, captioned presentation films from verified app captures.
Usage: python scripts/render-demo-videos.py --assets /workspace/scratch --out PATH
Requires Pillow, NumPy and FFmpeg. No browser automation or hosted inference.
"""
import argparse, json, math, subprocess, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps
p=argparse.ArgumentParser();p.add_argument('--assets',type=Path,required=True);p.add_argument('--out',type=Path,required=True);args=p.parse_args();OUT=args.out;OUT.mkdir(parents=True,exist_ok=True);TMP=OUT/'production';TMP.mkdir(exist_ok=True)
W,H,FPS=1920,1080,24
BG='#101923';CREAM='#f3eada';AMBER='#e5b77a';MUTED='#acb9bd';BURGUNDY='#754652'
SANS='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf';MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
def font(size,bold=False,serif=False):return ImageFont.truetype(SERIF if serif else BOLD if bold else SANS,size)
def wrapped(draw,text,xy,width,size=34,fill=CREAM,bold=False,serif=False,spacing=13):
 f=font(size,bold,serif);x,y=xy;line=''
 for word in text.split():
  trial=(line+' '+word).strip()
  if draw.textlength(trial,font=f)>width and line:draw.text((x,y),line,font=f,fill=fill);y+=size+spacing;line=word
  else:line=trial
 if line:draw.text((x,y),line,font=f,fill=fill);y+=size+spacing
 return y

def star(d,x,y,r=22):
 for i in range(8):
  a=i*math.pi/4;d.line((x+math.cos(a)*r*.25,y+math.sin(a)*r*.25,x+math.cos(a)*r,y+math.sin(a)*r),fill=AMBER,width=3)

def node(d,box,title,body,accent=AMBER):
 x,y,x2,y2=box;d.rounded_rectangle(box,radius=20,fill='#24343e',outline='#4b5c65',width=2);d.rectangle((x+26,y+25,x+32,y2-25),fill=accent);d.text((x+55,y+25),title,font=font(34,True),fill=CREAM);wrapped(d,body,(x+55,y+85),x2-x-90,27,MUTED,spacing=9)

def diagram(im,kind):
 d=ImageDraw.Draw(im);x=730;y=170;rw=1050
 if kind=='providers':
  node(d,(x,y,x+rw,y+220),'GOOGLE GEMMA','Structured room proposals and fictional-archive source selection.');
  d.line((x+rw//2,y+225,x+rw//2,y+300),fill=AMBER,width=4)
  node(d,(x,y+305,x+rw,y+535),'GROQ / GPT-OSS 20B','An alternative for layout generation, with provider choice and consent.');wrapped(d,'Automatic fallback succeeded in this demo.',(x+30,y+610),980,36,AMBER,True)
 elif kind=='privacy':
  node(d,(x,y,x+rw,y+215),'SENT WITH YOUR CONSENT','Your design brief + anonymous room geometry.');
  node(d,(x,y+255,x+rw,y+515),'STAYS IN YOUR BROWSER','Memory text, photos, names, dates and source notes.',BURGUNDY)
  wrapped(d,'Inspect the payload before you agree.',(x+35,y+600),980,37,AMBER,True)
 elif kind=='validation':
  rows=[('01  STRUCTURED PLAN','A model proposes supported furniture.'),('02  VALIDATE','Check bounds, types and existing object IDs.'),('03  ARRANGE + CHECK','Furniture relationships, spacing and openings.'),('04  REVIEW + APPLY','The user accepts the preview, then saves.')]
  for i,(t,b) in enumerate(rows):node(d,(x,y+i*175,x+rw,y+i*175+150),t,b)
 elif kind=='tests':
  d.text((x+65,y+10),'108',font=font(180,True),fill=AMBER);d.text((x+65,y+220),'automated tests passed',font=font(45,True),fill=CREAM)
  for i,t in enumerate(['Layout validation and recovery','Geometry, spacing and table settings','Source links and portable archives','Production build passed']):d.text((x+65,y+350+i*85),'• '+t,font=font(31),fill=MUTED)
 elif kind=='copilot':
  node(d,(x,y,x+rw,y+245),'GITHUB COPILOT CHAT','Inspected the room-purpose selector bug and suggested a guarded mapping/helper fix.');
  node(d,(x,y+290,x+rw,y+535),'GITHUB ACTIONS','Installs locked dependencies, runs the tests and builds the app.');wrapped(d,'Chat assistance, followed by implementation and checks.',(x+25,y+600),990,35,AMBER,True)
 elif kind=='deployment':
  node(d,(x,y,x+rw,y+205),'THREE.JS + VANILLA JAVASCRIPT','Procedural rooms, camera controls, editor and memories.');node(d,(x,y+245,x+rw,y+450),'VERCEL + NODE.JS','The deployed app and server-side AI request handlers.');d.text((x+50,y+520),'.tech',font=font(105,True),fill=AMBER);wrapped(d,'unfinishedroom.phoenixreborn.tech',(x+50,y+665),1000,30,CREAM)
 elif kind=='fallback':
  wrapped(d,'ACTUAL DEMO RESULT',(x+30,y+20),1000,30,AMBER,True);node(d,(x,y+115,x+rw,y+425),'GROQ PROPOSAL READY','openai/gpt-oss-20b\nAfter automatic fallback: 7 new decorations. Review before applying.');wrapped(d,'Provider availability can change. No fake success output.',(x+35,y+525),980,37,CREAM)
 elif kind=='portability':
  node(d,(x,y,x+rw,y+250),'PDF / READ + SHARE','A clean room image, inventory, memories, photos, source notes and open questions.');node(d,(x,y+295,x+rw,y+545),'JSON / RESTORE + EDIT','Portable room data you can import back into the creator.');wrapped(d,'Both exports are prepared locally.',(x+35,y+620),980,37,AMBER,True)

def asset(name):return args.assets/name
VIDEOS=[
 {'slug':'01-enter-the-room','name':'Enter the Room','placement':'DEV article: directly under Demo','scenes':[
  ('A room can hold a story.','The Unfinished Room gives meaningful objects somewhere to belong.','unfinished-video-home.jpg',None),
  ('Find your space.','Explore seven furnished rooms. Every public example is clearly fictional.','unfinished-room-article-gallery.jpg',None),
  ('An ordinary object. A whole story.','Open the sofa, the chair, or the table. Discover the words attached to it.','unfinished-room-article-memory.jpg',None),
  ('Keep the source close.','Read the saved account. Leave uncertain details uncertain.','unfinished-video-source.jpg',None),
  ('Discover. Return. Remember.','The journal fills as you explore objects.','unfinished-video-journal.jpg',None),
  ('Make a place of your own.','Copy an example or use the room editor. Your layout remains editable.','unfinished-video-editor.jpg',None),
  ('Carry the room with you.','A PDF keepsake holds the scene and its stories.','unfinished-video-keepsake.jpg',None),
  ('What would you put here?','Explore without an account. Start with the seven-room gallery.',None,'end')
 ]},
 {'slug':'02-make-it-yours','name':'Make It Yours','placement':'DEV article: after Six chairs taught me that valid JSON is not interior design','scenes':[
  ('A brief. A room. Your final say.','AI uses the furniture, finishes and lighting tools already inside the app.','unfinished-video-ai-form.jpg',None),
  ('Describe what you want.','This demo asks for one wooden table and exactly six dining chairs.','unfinished-video-ai-form.jpg',None),
  ('Choose who receives the brief.','Inspect the anonymous payload and agree before an AI request.','unfinished-video-ai-form.jpg',None),
  ('A real proposal.','Automatic mode fell back to Groq and returned a layout for review.','unfinished-video-ai-proposal.jpg',None),
  ('Preview. Review. Apply.','One table, six chairs. Local layout rules align the seats.','unfinished-video-ai-proposal.jpg',None),
  ('Keep editing beside the room.','Select an object to change its appearance, placement or memory.','unfinished-video-editor.jpg',None),
  ('Give one object a memory.','A fictional Sunday table keeps its original story and source note.','unfinished-video-source.jpg',None),
  ('Save, then take a copy.','Save in this browser. PDF is for reading; JSON is for restoring.','unfinished-video-save.jpg',None),
  ('Keep the scene and the words.','The PDF keepsake captures the room view, inventory and recorded memories.','unfinished-video-keepsake.jpg',None)
 ]},
 {'slug':'03-behind-the-room','name':'Behind the Room','placement':'DEV article: beside The tools behind the room, before test results','scenes':[
  ('AI arranges furniture. You own the memories.','Two open-weight models. One bounded, reviewable workflow.',None,'providers'),
  ('A fallback we actually observed.','The demonstration used Automatic mode and produced a Groq proposal.',None,'fallback'),
  ('Consent has a boundary.','A room design brief can leave the browser. Personal memory records stay local.',None,'privacy'),
  ('Valid JSON is only the start.','The app checks the result before a user can apply it.',None,'validation'),
  ('Evidence over promises.','Automated checks cover the foundations. Hosted AI still has availability limits.',None,'tests'),
  ('Copilot helped fix a real bug.','The public contribution record explains the assistance and what was verified.',None,'copilot'),
  ('A public home on .tech.','The scene is procedural. The deployed application runs on Vercel.',None,'deployment'),
  ('Portable by design.','Keep a readable copy and an editable backup. Explore the source on GitHub.',None,'portability')
 ]}
]

def scene_card(video,idx,scene):
 title,body,image,kind=scene;im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
 star(d,82,66);d.text((125,49),'THE UNFINISHED ROOM',font=font(25,True),fill=CREAM);d.text((W-455,50),video['name'].upper(),font=font(23),fill=MUTED)
 d.line((65,110,W-65,110),fill='#35454d',width=2)
 d.text((80,172),f'{idx+1:02d} / {len(video["scenes"]):02d}',font=font(25,True),fill=AMBER)
 y=wrapped(d,title,(80,255),510,57,CREAM,serif=True,spacing=15)
 wrapped(d,body,(84,y+42),505,31,MUTED,spacing=14)
 d.rounded_rectangle((80,843,595,919),radius=16,fill=BURGUNDY)
 d.text((105,866),'GHOST IN THE MACHINE',font=font(24,True),fill=CREAM)
 if image:
  source=Image.open(asset(image)).convert('RGB');box=(680,155,1840,945);d.rounded_rectangle(box,radius=20,fill='#1c2932',outline='#53626a',width=2)
  if 'source' in image:source=source.crop((360,160,975,765))
  if 'article-memory' in image:source=source.crop((350,275,985,655))
  preview=ImageOps.contain(source,(1128,758),Image.Resampling.LANCZOS);im.paste(preview,(696+(1128-preview.width)//2,171+(758-preview.height)//2))
 elif kind=='end':
  d.rounded_rectangle((700,170,1805,915),radius=30,fill='#efe4cf');star(d,1250,305,60)
  wrapped(d,'The Unfinished Room',(795,445),940,76,BG,serif=True);wrapped(d,'A home for the stories we keep.',(795,650),940,34,'#664651');wrapped(d,'unfinishedroom.phoenixreborn.tech',(795,780),940,30,BG)
 else:diagram(im,kind)
 d.text((80,1010),'unfinishedroom.phoenixreborn.tech',font=font(23),fill=AMBER)
 foot='Actual app screens · edited walkthrough · simplified rendering' if image else 'Architecture / evidence graphic · no private dashboards or credentials'
 d.text((700,1010),foot,font=font(21),fill=MUTED)
 path=TMP/f'{video["slug"]}-{idx:02d}.png';im.save(path);return path

def music(path,duration,variant=0):
 sr=44100;t=np.arange(int(duration*sr))/sr;a=np.zeros_like(t);chords=[(130.81,164.81,196,246.94),(110,130.81,164.81,196),(87.31,110,130.81,164.81),(98,123.47,146.83,196)]
 for i in range(math.ceil(duration/6)):
  start=i*6;mask=(t>=start)&(t<start+8);u=t[mask]-start;env=np.minimum(u/1.5,1)*np.clip((8-u)/3,0,1)
  tone=sum(np.sin(2*np.pi*f*u+0.1*i)+.16*np.sin(2*np.pi*2*f*u) for f in chords[(i+variant)%4])/4
  a[mask]+=.065*env*tone
 for start in np.arange(1,duration,3):
  m=(t>=start)&(t<start+2.6);u=t[m]-start;f=[523.25,659.25,587.33,440][int(start//3+variant)%4];a[m]+=.025*np.sin(2*np.pi*f*u)*np.exp(-u*2.4)*np.minimum(u/.02,1)
 a*=np.minimum(t/2,1)*np.minimum((duration-t)/3,1);stereo=np.column_stack([a,a*.98]);pcm=(np.clip(stereo,-1,1)*32767).astype('<i2')
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())

def render():
 manifest=[]
 cursor=Image.new('RGBA',(42,58));draw=ImageDraw.Draw(cursor);draw.polygon([(4,4),(4,44),(15,34),(25,53),(34,48),(23,30),(39,28)],fill='white',outline='#101923',width=3);cursor.save(TMP/'cursor.png')
 for vi,v in enumerate(VIDEOS):
  cards=[scene_card(v,i,scene) for i,scene in enumerate(v['scenes'])];duration=len(cards)*6;audio=TMP/f'{v["slug"]}.wav';music(audio,duration,vi);final=OUT/f'{v["slug"]}.mp4'
  cmd=['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-filter_complex_threads','1']
  for card in cards:cmd+=['-loop','1','-framerate','24','-t','6','-threads','1','-i',str(card)]
  cursor_scenes=[1,2,7] if vi==1 else []
  for i in cursor_scenes:cmd+=['-loop','1','-framerate','24','-t','6','-i',str(TMP/'cursor.png')]
  audio_index=len(cards)+len(cursor_scenes);cmd+=['-i',str(audio)];filters=[]
  for i in range(len(cards)):
   base=f"[{i}:v]zoompan=z='1.012+0.00006*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=24,trim=duration=6,setpts=PTS-STARTPTS"
   if i in cursor_scenes:
    ci=len(cards)+cursor_scenes.index(i);dest=(875,857) if i in (1,2) else (1520,610)
    filters.append(base+f'[base{i}]');base=f"[base{i}][{ci}:v]overlay=x='1740+({dest[0]}-1740)*min(t/1.7,1)':y='310+({dest[1]}-310)*min(t/1.7,1)':shortest=1"
   filters.append(base+f',fade=t=in:st=0:d=0.24,fade=t=out:st=5.76:d=0.24,format=yuv420p[v{i}]')
  filters.append(''.join(f'[v{i}]' for i in range(len(cards)))+f'concat=n={len(cards)}:v=1:a=0[video]')
  cmd+=['-filter_complex',';'.join(filters),'-map','[video]','-map',f'{audio_index}:a','-t',str(duration),'-c:v','libx264','-preset','veryfast','-crf','22','-threads','2','-c:a','aac','-b:a','160k','-movflags','+faststart',str(final)]
  subprocess.run(cmd,check=True,stdin=subprocess.DEVNULL)
  probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(final)],check=True,capture_output=True,text=True);assert abs(float(json.loads(probe.stdout)['format']['duration'])-duration)<.2
  captions=[{'start':i*6,'end':(i+1)*6,'text':scene[0]+' '+scene[1]} for i,scene in enumerate(v['scenes'])]
  def tc(x):return f'00:{x//60:02d}:{x%60:02d},000'
  (OUT/f'{v["slug"]}.srt').write_text('\n\n'.join(f'{i+1}\n{tc(c["start"])} --> {tc(c["end"])}\n{c["text"]}' for i,c in enumerate(captions))+'\n')
  manifest.append({'file':final.name,'title':v['name'],'duration_seconds':duration,'article_placement':v['placement'],'captions':captions,'format':'1920x1080 / H.264 + AAC / 24 fps','footage':'Edited motion presentation from actual current app screenshots; not continuous screen recording. Diagram cards are explanatory graphics.','music':'Original synthesized ambient bed, no third-party music.'})
  print('VIDEO COMPLETE',v['slug'],duration,flush=True)
 (OUT/'video-manifest.json').write_text(json.dumps(manifest,indent=2));print('ALL VIDEOS COMPLETE',flush=True)
if __name__=='__main__':render()
