import * as THREE from 'three';
export const MISSIONS=[
{id:'m1',title:'First Steps',desc:'Walk to the Central Garage.',x:0,z:0,reward:150,kind:'reach',radius:12},
{id:'m2',title:'Borrowed Wheels',desc:'Find and enter any vehicle.',x:0,z:0,reward:200,kind:'vehicle'},
{id:'m3',title:'Home Base',desc:'Drive to the Auto Repair shop.',x:80,z:-80,reward:300,kind:'drive',radius:14},
{id:'m4',title:'Parcel Run',desc:'Deliver the parcel to Market Square.',x:-80,z:-80,reward:350,kind:'drive',radius:13},
{id:'m5',title:'Industrial Scout',desc:'Visit the Industrial Yard.',x:-160,z:-120,reward:400,kind:'reach',radius:15},
{id:'m6',title:'Park Break',desc:'Take a break in Riverside Park.',x:80,z:80,reward:250,kind:'reach',radius:14},
{id:'m7',title:'Hospital Check-in',desc:'Reach the city hospital.',x:120,z:120,reward:300,kind:'reach',radius:15},
{id:'m8',title:'Police Watch',desc:'Drive near Police HQ.',x:-120,z:80,reward:400,kind:'drive',radius:16},
{id:'m9',title:'Highway Sprint',desc:'Reach the Highway Gate in a vehicle.',x:200,z:0,reward:600,kind:'drive',radius:16,time:100},
{id:'m10',title:'Clean Getaway',desc:'Lose the police search.',x:0,z:0,reward:500,kind:'escape'},
{id:'m11',title:'City Loop',desc:'Visit the Market Square.',x:-80,z:-80,reward:450,kind:'reach',radius:14},
{id:'m12',title:'Mechanic Friend',desc:'Repair a vehicle at the shop.',x:80,z:-80,reward:350,kind:'repair'},
{id:'m13',title:'Night Courier',desc:'Deliver to the garage after dark.',x:0,z:0,reward:650,kind:'night'},
{id:'m14',title:'District Tour',desc:'Visit the hospital, then the park.',x:120,z:120,reward:700,kind:'chain',radius:15},
{id:'m15',title:'Neon District',desc:'Complete the final drive to the Industrial Yard.',x:-160,z:-120,reward:2500,kind:'drive',radius:16}
];
export function createMissions(completed=[]){return {all:MISSIONS.map(m=>({...m,status:completed.includes(m.id)?'complete':'available'})),active:null,chainStep:0,startedAt:0,remaining:0,start(id){const m=this.all.find(x=>x.id===id);if(!m||m.status==='complete')return false;this.active=m;m.status='active';this.startedAt=performance.now()/1000;this.remaining=m.time||0;return true;},next(){if(this.active)this.active.status='available';const m=this.all.find(x=>x.status==='available');if(m)this.start(m.id);else this.active=null;},check(player,vehicle,policeLevel,dayTime){const m=this.active;if(!m)return null;const p=vehicle?vehicle.group.position:player.group.position;const d=Math.hypot(p.x-m.x,p.z-m.z);let done=false;if(m.kind==='vehicle')done=!!vehicle;else if(m.kind==='escape')done=policeLevel===0;else if(m.kind==='repair')done=false;else if(m.kind==='night')done=d<12&&dayTime>19||d<12&&dayTime<5;else if(m.kind==='chain'){const target=this.chainStep===0?{x:120,z:120}:{x:80,z:80};done=Math.hypot(p.x-target.x,p.z-target.z)<(m.radius||14);if(done&&this.chainStep===0){this.chainStep=1;this.active.x=80;this.active.z=80;return {progress:true,msg:'Next stop: Riverside Park'};}}else if(m.kind==='drive')done=!!vehicle&&d<(m.radius||14);else if(m.kind==='reach')done=d<(m.radius||12);if(m.time&&this.remaining>0){this.remaining=Math.max(0,m.time-(performance.now()/1000-this.startedAt));if(!this.remaining)return {failed:true,msg:'Time expired'};}if(done){m.status='complete';this.active=null;return {complete:true,mission:m};}return {distance:d};}};}
