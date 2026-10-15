import * as THREE from 'three';
import {VEHICLES} from './config.js';
import {collidesCircle} from './world.js';
export function createVehicle(scene,spec,x,z,angle=0,traffic=false){const g=new THREE.Group();const paint=new THREE.MeshStandardMaterial({color:spec.color,metalness:.28,roughness:.45}),glass=new THREE.MeshStandardMaterial({color:0x294653,metalness:.25,roughness:.25}),rubber=new THREE.MeshStandardMaterial({color:0x14191d,roughness:.9}),lamp=new THREE.MeshStandardMaterial({color:0xfff0c5,emissive:0x8d7b43}),tail=new THREE.MeshStandardMaterial({color:0xf03f37,emissive:0x70120d});
 const body=new THREE.Mesh(new THREE.BoxGeometry(spec.id==='truck'?2.2:1.9,.7,spec.id==='truck'?4.8:3.8),paint);body.position.y=.85;body.castShadow=true;g.add(body);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(spec.id==='truck'?1.9:1.55,.8,spec.id==='truck'?2.2:1.9),glass);cabin.position.set(0,1.48,-.15);cabin.castShadow=true;g.add(cabin);
 if(spec.id==='truck'){const cargo=new THREE.Mesh(new THREE.BoxGeometry(2,1.1,1.8),paint);cargo.position.set(0,1.55,1.45);g.add(cargo);}
 const wheels=[];for(const wx of [-.96,.96])for(const wz of [-1.25,1.25]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.37,.37,.22,12),rubber);w.rotation.z=Math.PI/2;w.position.set(wx,.42,wz);g.add(w);wheels.push(w);}
 for(const x1 of [-.62,.62]){const f=new THREE.Mesh(new THREE.BoxGeometry(.34,.18,.08),lamp);f.position.set(x1,.88,-1.94);g.add(f);const t=new THREE.Mesh(new THREE.BoxGeometry(.3,.17,.08),tail);t.position.set(x1,.86,1.94);g.add(t);}
 if(spec.id==='police'){const bar=new THREE.Mesh(new THREE.BoxGeometry(.9,.15,.25),new THREE.MeshStandardMaterial({color:0x367cff,emissive:0x163bff}));bar.position.set(0,1.92,-.15);g.add(bar);}
 g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);
 return {group:g,spec,speed:0,health:100,traffic,owned:false,aiTarget:null,turnSignal:0,wheels,locked:false};
}
export function driveVehicle(v,dt,input,colliders){const throttle=input.z||0,steer=input.x||0;const spec=v.spec;const old=v.speed;v.speed+=throttle*(throttle<0?spec.brake:spec.accel)*dt;v.speed*=Math.pow(.985,dt*60);v.speed=Math.max(-spec.max*.38,Math.min(spec.max,v.speed));const steerScale=Math.min(1,Math.abs(v.speed)/4);v.group.rotation.y+=steer*spec.turn*steerScale*dt*Math.sign(v.speed||1);const a=v.group.rotation.y;const dx=-Math.sin(a)*v.speed*dt,dz=-Math.cos(a)*v.speed*dt;const nx=v.group.position.x+dx,nz=v.group.position.z+dz;
 if(collidesCircle(nx,v.group.position.z,1.35,colliders)||collidesCircle(v.group.position.x,nz,1.35,colliders)){v.speed*=-.22;v.health=Math.max(0,v.health-Math.abs(old)*.22);return {crash:true};}
 v.group.position.x=nx;v.group.position.z=nz;for(const w of v.wheels)w.rotation.x+=v.speed*dt*1.8;return {crash:false};}
export function updateTraffic(v,dt,colliders){if(!v.traffic)return;v.speed=v.spec.max*.3;const a=v.group.rotation.y;const nx=v.group.position.x-Math.sin(a)*v.speed*dt,nz=v.group.position.z-Math.cos(a)*v.speed*dt;if(Math.abs(nx)>235||Math.abs(nz)>235||collidesCircle(nx,nz,1.3,colliders)){v.group.rotation.y+=Math.PI/2*(Math.random()>.5?1:-1);v.speed=0;}else{v.group.position.x=nx;v.group.position.z=nz;}}
