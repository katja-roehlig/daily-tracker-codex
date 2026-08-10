import type { Category, Mood } from '../types';
export const moods: Mood[] = [
  { id:'mood-great',label:'Großartig',icon:'🤩',color:'#f5aa2d' }, { id:'mood-good',label:'Gut',icon:'😊',color:'#72b45a' },
  { id:'mood-ok',label:'Ausgeglichen',icon:'😌',color:'#5796d2' }, { id:'mood-low',label:'Erschöpft',icon:'😮‍💨',color:'#9276c8' }, { id:'mood-sad',label:'Traurig',icon:'😔',color:'#7181b5' },
];
export const demoCategories: Category[] = [
  { id:'health',name:'Wohlbefinden',color:'#78a95e',items:[
    { id:'water',name:'Wasser getrunken',icon:'💧',gamification:{enabled:true,target:3,period:'day'} },
    { id:'outside',name:'Draußen gewesen',icon:'🌿',gamification:{enabled:true,target:1,period:'day'} },
    { id:'fitness',name:'Fitnessübungen',icon:'🏃',gamification:{enabled:true,target:5,period:'week'} },
  ]},
  { id:'cat',name:'Katze 1',color:'#d78862',items:[
    { id:'eats',name:'Frisst gut',icon:'🥣',gamification:{enabled:false,target:1,period:'day'} },
    { id:'hairball',name:'Kotzt Fell',icon:'🐈',gamification:{enabled:false,target:1,period:'day'} },
    { id:'food-vomit',name:'Kotzt Futter',icon:'🤢',gamification:{enabled:false,target:1,period:'day'} },
  ]},
];
export const quotes = [
  ['„Auch aus Steinen, die dir in den Weg gelegt werden, kannst du etwas Schönes bauen.“','Erich Kästner'], ['„Es gibt nur zwei Tage im Jahr, an denen man nichts tun kann: der eine heißt gestern, der andere morgen.“','Dalai Lama'], ['„Der Weg ist das Ziel.“','Konfuzius'], ['„Was du heute kannst besorgen, das verschiebe nicht auf morgen.“','Benjamin Franklin'],
] as const;
