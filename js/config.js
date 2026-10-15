export const CONFIG={cityHalf:240,block:40,road:12,playerSpeed:7,runSpeed:11,gravity:20,traffic:{low:5,medium:10,high:16},pedestrians:{low:8,medium:16,high:24},prices:{compact:1200,sedan:2600,sport:6500,offroad:4200,pickup:3100,taxi:2200,police:9000,truck:5000,repair:350,recovery:250,garage:1800},quality:{low:{pixel:.62,shadows:false,traffic:5,peds:8},medium:{pixel:.82,shadows:true,traffic:10,peds:16},high:{pixel:1,shadows:true,traffic:16,peds:24}}};
export const VEHICLES=[
{id:'compact',name:'City Compact',color:0x42b7b0,max:29,accel:13,brake:22,turn:2.1,mass:950},
{id:'sedan',name:'Family Sedan',color:0xd8e0e7,max:34,accel:11,brake:24,turn:1.65,mass:1400},
{id:'sport',name:'Vortex Sport',color:0xf04f55,max:48,accel:19,brake:28,turn:2.4,mass:1250},
{id:'offroad',name:'Trailblazer 4x4',color:0xd0a45a,max:32,accel:12,brake:21,turn:1.5,mass:1850},
{id:'pickup',name:'Workhorse Pickup',color:0x4e7dd0,max:31,accel:10,brake:20,turn:1.45,mass:1700},
{id:'police',name:'Interceptor',color:0x263b50,max:39,accel:16,brake:27,turn:2,mass:1550},
{id:'taxi',name:'Metro Taxi',color:0xe9c944,max:32,accel:11,brake:22,turn:1.7,mass:1350},
{id:'truck',name:'Light Hauler',color:0x7c8a92,max:26,accel:8,brake:18,turn:1.05,mass:2600}
];
export const POINTS={garage:{x:0,z:0,name:'Central Garage'},repair:{x:80,z:-80,name:'Auto Repair'},police:{x:-120,z:80,name:'Police HQ'},hospital:{x:120,z:120,name:'Hospital'},industrial:{x:-160,z:-120,name:'Industrial Yard'},park:{x:80,z:80,name:'Riverside Park'},shop:{x:-80,z:-80,name:'Market Square'},highway:{x:200,z:0,name:'Highway Gate'}};