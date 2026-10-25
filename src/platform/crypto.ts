export interface VaultEnvelope {
  format:'latimus-vault';version:1;kdf:'PBKDF2-SHA256';iterations:number;salt:string;iv:string;ciphertext:string;
}
const ITERATIONS=310_000;
const encoder=new TextEncoder();
const MAX_BYTES=96*1024*1024;
export function toBase64(bytes:Uint8Array):string {
  let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);
}
function fromBase64(value:string):Uint8Array<ArrayBuffer> {
  const raw=atob(value),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes;
}
export function readEnvelope(raw:unknown):VaultEnvelope {
  if(!raw||typeof raw!=='object')throw new Error('Invalid encrypted workspace.');
  const v=raw as Record<string,unknown>;
  if(v.format!=='latimus-vault'||v.version!==1||v.kdf!=='PBKDF2-SHA256'||v.iterations!==ITERATIONS)throw new Error('Unsupported workspace format or encryption parameters.');
  for(const key of ['salt','iv','ciphertext'])if(typeof v[key]!=='string'||(v[key] as string).length>MAX_BYTES*1.4)throw new Error('Invalid encrypted workspace field.');
  try {if(fromBase64(v.salt as string).length!==16||fromBase64(v.iv as string).length!==12||fromBase64(v.ciphertext as string).length<16)throw new Error();}catch{throw new Error('Invalid encrypted workspace encoding.');}
  return v as unknown as VaultEnvelope;
}
export async function deriveKey(password:string,salt:Uint8Array<ArrayBuffer>):Promise<CryptoKey> {
  if(!globalThis.crypto?.subtle)throw new Error('Web Crypto is unavailable. Use a supported desktop Chrome browser.');
  if(password.length<12)throw new Error('Use a passphrase of at least 12 characters.');
  if(password.length>1024)throw new Error('Passphrase is too long.');
  const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function seal(text:string,key:CryptoKey,salt:string):Promise<VaultEnvelope> {
  const plaintext=encoder.encode(text);
  if(plaintext.byteLength>64*1024*1024)throw new Error('Workspace exceeds the 64 MB plaintext capacity. Split or archive records before saving; existing data is unchanged.');
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode('latimus-vault:1')},key,plaintext);
  return {format:'latimus-vault',version:1,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt,iv:toBase64(iv),ciphertext:toBase64(new Uint8Array(ciphertext))};
}
export async function createVault(text:string,password:string) {
  const bytes=crypto.getRandomValues(new Uint8Array(16));const salt=toBase64(bytes);const key=await deriveKey(password,bytes);
  return {key,envelope:await seal(text,key,salt)};
}
export async function openVault(raw:unknown,password:string) {
  const envelope=readEnvelope(raw);const key=await deriveKey(password,fromBase64(envelope.salt));
  try {
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromBase64(envelope.iv),additionalData:encoder.encode('latimus-vault:1')},key,fromBase64(envelope.ciphertext));
    if(plain.byteLength>64*1024*1024)throw new Error('Workspace exceeds the plaintext capacity.');
    return {key,text:new TextDecoder('utf-8',{fatal:true}).decode(plain),envelope};
  }catch{throw new Error('Unable to unlock: wrong passphrase or damaged workspace.');}
}
export async function sha256(value:string):Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('');
}
/** Decrypt using an already unlocked nonextractable key; never returns or persists key bytes. */
export async function openVaultWithKey(raw:unknown,key:CryptoKey):Promise<string>{const v=readEnvelope(raw);try{const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromBase64(v.iv),additionalData:encoder.encode('latimus-vault:1')},key,fromBase64(v.ciphertext));if(bytes.byteLength>64*1024*1024)throw new Error('Workspace exceeds the plaintext capacity.');return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new Error('Workspace changed or background session is locked. Unlock again.');}}
