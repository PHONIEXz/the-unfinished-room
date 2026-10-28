import {shellSettings} from './shell.mjs';
export const starterNames={empty:'Empty room',living:'Living room',dining:'Dining room',bedroom:'Bedroom',reading:'Reading corner'};
const layouts={empty:[],living:[['sofa',28,24],['table',55,45],['chair',75,65],['rug',50,48],['plant',88,12]],dining:[['dining-table',50,45],['dining-chair',25,45],['dining-chair',75,45],['plant',88,12]],bedroom:[['bed',40,28],['cabinet',82,20],['rug',50,70],['plant',88,82]],reading:[['chair',45,42],['shelf',78,15],['floor-lamp',20,65],['rug',45,65]]};
export function starterRoom(type,id=()=> 'object-'+crypto.randomUUID()){
 if(!Object.hasOwn(layouts,type))throw Error('Choose an available starter room.');
 return {schemaVersion:10,title:starterNames[type],fictional:false,sources:[],openQuestions:[],decor:{...shellSettings({}),palette:'cream',wallColor:'#c7bda8',wallFinish:'plaster',floor:'wood',wallpaper:'plain',size:'medium',window:true,windows:1,windowPosition:'left',doorPosition:'left',timeOfDay:'day',lamp:true,shelf:false,furnishings:false,alcove:false,fireplace:false},objects:layouts[type].map(([kind,x,y])=>({id:id(),title:kind.replaceAll('-',' ').replace(/^./,s=>s.toUpperCase()),kind,surface:'floor',x,y,rotation:0,size:100,color:kind==='plant'?'#50736d':'#8c624c',shape:'box',finish:'auto',decoration:true,date:'',sourceNote:'',image:null,sourceIds:[]}))};
}
