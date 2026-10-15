import * as THREE from 'three';
import {collidesCircle} from './world.js';
export function createPlayer(scene){const g=new THREE.Group();const skin=new THREE.MeshStandardMaterial({color:0xc58f70}),shirt=new THREE.MeshStandardMaterial({color:0x39b9aa}),pants=new THREE.MeshStandardMaterial({color:0x243b52}),shoe=new THREE.MeshStandardMaterial({color:0x18232b});
 const part=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
 part(new THREE.CylinderGeometry(.27,.32,.85,8),shirt,0,1.15,0);part(new THREE.SphereGeometry(.27,12,10),skin,0,1.82,0);part(new THREE.BoxGeometry(.48,.16,.45),shirt,0,1.95,0);
 const legs=[];for(const x of [-.13,.13])legs.push(part(new THREE.BoxGeometry(.18,.62,.22),pants,x,.55,0));for(const x of [-.14,.14])part(new THREE.BoxGeometry(.2,.12,.32),shoe,x,.19,.06);
 for(const x of [-.34,.34])part(new THREE.BoxGeometry(.15,.62,.17),shirt,x,1.22,0);
 g.position.set(0,0,8);scene.add(g);return {group:g,health:100,legs,velocity:new THREE.Vector3(),walk:0};}
export function updatePlayer(p,dt,input,cameraYaw,colliders){if(!p.group.visible)return;const ix=input.x||0,iz=input.z||0;const mag=Math.hypot(ix,iz);if(mag>.05){const speed=input.run?11:7;const a=Math.atan2(ix,iz)+cameraYaw;const dx=Math.sin(a)*speed*dt,dz=Math.cos(a)*speed*dt;const nx=p.group.position.x+dx,nz=p.group.position.z+dz;if(!collidesCircle(nx,p.group.position.z,.55,colliders))p.group.position.x=nx;if(!collidesCircle(p.group.position.x,nz,.55,colliders))p.group.position.z=nz;p.group.rotation.y=a;p.walk+=dt*speed;for(let i=0;i<p.legs.length;i++)p.legs[i].rotation.x=Math.sin(p.walk+(i*Math.PI))*0.6;}else{for(const l of p.legs)l.rotation.x*=.8;}}
