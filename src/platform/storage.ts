import {readEnvelope,type VaultEnvelope} from './crypto';
const KEY='active';
// Explicit portable preview also permits verification where managed browsers block file://.
export const portableMode=()=>location.protocol==='file:'||new URLSearchParams(location.search).get('mode')==='portable';
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
  const req=indexedDB.open('latimus-vault-v1',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('vault');
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Encrypted browser storage is unavailable. Export a workspace file.'));
});}
export async function loadVault():Promise<VaultEnvelope|null>{
  if(portableMode())return null;
  const db=await database();try{return await new Promise((resolve,reject)=>{const r=db.transaction('vault').objectStore('vault').get(KEY);r.onsuccess=()=>resolve(r.result?readEnvelope(r.result):null);r.onerror=()=>reject(r.error);});}finally{db.close();}
}
export async function storeVault(envelope:VaultEnvelope,expected:VaultEnvelope|null=null):Promise<void>{
  if(portableMode())return;
  const db=await database();try{await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('vault','readwrite');const store=tx.objectStore('vault');let conflict=false;
    const read=store.get(KEY);
    read.onsuccess=()=>{
      const previous=read.result as VaultEnvelope|undefined;
      const matches=expected?previous?.iv===expected.iv&&previous?.ciphertext===expected.ciphertext&&previous?.salt===expected.salt:!previous;
      if(!matches){conflict=true;tx.abort();return;}
      store.put(envelope,KEY);
    };
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(new Error('Saving failed: browser storage may be full. Keep this tab open and export your encrypted workspace.'));
    tx.onabort=()=>reject(new Error(conflict?'Another tab changed the active workspace. This update was not saved. Lock and reload this page before continuing.':'Workspace was not saved. Export a backup before closing.'));
  });}finally{db.close();}
}
export function downloadFile(name:string,body:string,type='application/json'){
  const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
