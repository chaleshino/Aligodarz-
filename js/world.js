import * as THREE from 'three';
import {CONFIG,POINTS} from './config.js';
export function buildWorld(scene,quality='medium'){
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(560,560),new THREE.MeshStandardMaterial({color:0x455b4e,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
 const roadMat=new THREE.MeshStandardMaterial({color:0x252e37,roughness:.95}),sideMat=new THREE.MeshStandardMaterial({color:0x8a9698}),lineMat=new THREE.MeshStandardMaterial({color:0xe4d9a4}),white=new THREE.MeshStandardMaterial({color:0xd8e0e2});
 const box=(x,y,z,w,h,d,mat,cast=true)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;scene.add(m);return m;};
 // Modular grid: continuous avenues and cross streets.
 for(let p=-240;p<=240;p+=40){
  box(p,0,0,CONFIG.road,.04,520,roadMat,false);box(0,0,p,520,.04,CONFIG.road,roadMat,false);
  box(p+CONFIG.road/2+.8,.05,0,1.6,.12,520,sideMat,false);box(p-CONFIG.road/2-.8,.05,0,1.6,.12,520,sideMat,false);
  box(0,.05,p+CONFIG.road/2+.8,520,.12,1.6,sideMat,false);box(0,.05,p-CONFIG.road/2-.8,520,.12,1.6,sideMat,false);
  for(let q=-220;q<=220;q+=8){box(p,.075,q,.16,.02,3.2,lineMat,false);box(q,.075,p,3.2,.02,.16,lineMat,false);}
 }
 const buildingMats=[0x637a8b,0x8c999a,0x6d7787,0x9c8f80,0x455d6a,0xb4b7ae].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.85}));
 const colliders=[];
 for(let x=-220;x<=220;x+=40)for(let z=-220;z<=220;z+=40){
  if(Math.abs(x)<20&&Math.abs(z)<20)continue;
  const district=(x>60&&z<-40)?'commercial':(x<-100&&z<-80)?'industrial':(x>40&&z>40)?'park':(Math.abs(x)<100&&Math.abs(z)<100)?'center':'residential';
  if(district==='park'&&Math.random()<.75){for(let i=0;i<3;i++){const tx=x+(Math.random()-.5)*20,tz=z+(Math.random()-.5)*20;const trunk=box(tx,1.5,tz,1,3,1,new THREE.MeshStandardMaterial({color:0x62452f}));const crown=new THREE.Mesh(new THREE.ConeGeometry(3.2,7,7),new THREE.MeshStandardMaterial({color:0x2f7652}));crown.position.set(tx,5,tz);scene.add(crown);colliders.push({x:tx,z:tz,w:2.5,d:2.5});}continue;}
  const bx=x+(Math.random()-.5)*7,bz=z+(Math.random()-.5)*7,w=13+Math.random()*8,d=13+Math.random()*8;
  const h=district==='center'?18+Math.random()*42:district==='commercial'?9+Math.random()*16:district==='industrial'?7+Math.random()*7:5+Math.random()*8;
  box(bx,h/2,bz,w,h,d,buildingMats[Math.floor(Math.random()*buildingMats.length)]);
  // Windows as a few simple facade strips, kept inexpensive.
  const winMat=new THREE.MeshStandardMaterial({color:0x9ed9e2,emissive:0x10252c,roughness:.4});
  if(h>13){for(let yy=3;yy<h-2;yy+=4)for(let xx=-w/2+2;xx<w/2-1;xx+=3){box(bx+xx,yy,bz+d/2+.04,1.3,1.3,.08,winMat,false);}}
  colliders.push({x:bx,z:bz,w:w+1,d:d+1});
 }
 // landmarks with readable signs and distinct footprints
 const landmark=(key,color,w=17,h=9,d=15)=>{const p=POINTS[key];box(p.x,h/2,p.z,w,h,d,new THREE.MeshStandardMaterial({color}));box(p.x,h+.8,p.z,w*.8,1,d*.8,new THREE.MeshStandardMaterial({color:0x162c37}));const sign=makeSign(p.name);sign.position.set(p.x,h+2,p.z+d/2+.2);scene.add(sign);colliders.push({x:p.x,z:p.z,w:w+2,d:d+2});};
 function makeSign(txt){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#102a35';ctx.fillRect(0,0,512,96);ctx.fillStyle='#67ead5';ctx.font='bold 36px sans-serif';ctx.textAlign='center';ctx.fillText(txt.toUpperCase(),256,60);const tex=new THREE.CanvasTexture(c);return new THREE.Mesh(new THREE.PlaneGeometry(12,2.25),new THREE.MeshBasicMaterial({map:tex,transparent:false}));}
 landmark('garage',0x3b5d66,18,7,15);landmark('repair',0xb77a3b,18,7,14);landmark('police',0x37516e,20,10,16);landmark('hospital',0xe0e7e8,20,11,17);landmark('industrial',0x786c59,22,8,18);landmark('shop',0x7d4b5c,16,8,14);
 // Street lamps and traffic lights, deliberately sparse.
 const lampMat=new THREE.MeshStandardMaterial({color:0x303e45,metalness:.6}),glow=new THREE.MeshStandardMaterial({color:0xffe3a0,emissive:0xffc45b,emissiveIntensity:.8});
 for(let x=-200;x<=200;x+=80)for(let z=-200;z<=200;z+=80){box(x+9,3,z+9,.25,6,.25,lampMat,false);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),glow);bulb.position.set(x+9,6,z+9);scene.add(bulb);}
 // Parking-lot markings near the garage.
 for(let i=0;i<6;i++)box(-12+i*4,.08,14, .12,.025,7,white,false);
 return {colliders,landmarks:POINTS,box};
}
export function collidesCircle(x,z,r,colliders){for(const c of colliders){const nx=Math.max(c.x-c.w/2,Math.min(x,c.x+c.w/2)),nz=Math.max(c.z-c.d/2,Math.min(z,c.z+c.d/2));if((x-nx)**2+(z-nz)**2<r*r)return true;}return false;}
