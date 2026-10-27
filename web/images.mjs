export const maxImageLength=260000;
export function validateImage(value){
 if(value===null)return null;
 if(typeof value!=='string'||value.length>maxImageLength||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('A photo is invalid or too large.');
 let bytes;try{bytes=Uint8Array.from(atob(value.slice(23)),c=>c.charCodeAt(0));}catch{throw Error('A photo has invalid encoding.');}
 if(bytes[0]!==255||bytes[1]!==216)throw Error('A photo is not a JPEG.');
 let i=2;
 while(i+8<bytes.length){if(bytes[i++]!==255)break;let marker=bytes[i++];while(marker===255)marker=bytes[i++];if(marker===217||marker===218)break;const length=bytes[i]*256+bytes[i+1];if(length<2||i+length>bytes.length)break;
  if([192,193,194].includes(marker)){const height=bytes[i+3]*256+bytes[i+4],width=bytes[i+5]*256+bytes[i+6];if(!width||!height||width>1024||height>1024)throw Error('Photo dimensions exceed the room limit.');return value;}i+=length;
 }
 throw Error('A photo has no supported JPEG dimensions.');
}
export async function prepareImage(file){
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5000000)throw Error('Choose a PNG, JPEG or WebP image under 5 MB. SVG files are not supported.');
 const bitmap=await createImageBitmap(file);
 try{
  if(bitmap.width*bitmap.height>24000000)throw Error('Choose a photo under 24 megapixels.');
  const canvas=document.createElement('canvas');const ratio=Math.min(1,800/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#eee5d6';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  for(const quality of [.8,.65,.5,.35]){const data=canvas.toDataURL('image/jpeg',quality);if(data.length<=maxImageLength)return validateImage(data);}throw Error('This photo is too detailed to store. Choose a smaller image.');
 }finally{bitmap.close();}
}
