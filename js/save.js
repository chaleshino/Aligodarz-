const KEY='city-crime-open-world-save';
export function readSave(){try{const raw=localStorage.getItem(KEY);if(!raw)return null;const d=JSON.parse(raw);if(d.version!==1||typeof d.money!=='number'||!Array.isArray(d.owned))return null;return d;}catch{return null;}}
export function writeSave(state){try{localStorage.setItem(KEY,JSON.stringify({version:1,savedAt:Date.now(),...state}));return true;}catch{return false;}}
export function hasSave(){return !!readSave();}
