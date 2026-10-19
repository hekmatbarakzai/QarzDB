/* One local admin account. This access lock does not encrypt qarz_v1 records. */
(function(root){
  'use strict';
  const KEY='qarz_admin_v1', ITERATIONS=600000;
  const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
  const random=length=>hex(crypto.getRandomValues(new Uint8Array(length)));
  async function hash(secret,salt){
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),'PBKDF2',false,['deriveBits']);
    return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:new TextEncoder().encode(salt)},material,256)));
  }
  function read(storage){
    const raw=storage.getItem(KEY);if(raw===null)return null;
    const a=JSON.parse(raw);
    if(a.version!==1||typeof a.username!=='string'||!a.username||a.iterations!==ITERATIONS||!['salt','recoverySalt'].every(k=>/^[a-f0-9]{32}$/.test(a[k]))||!['hash','recoveryHash'].every(k=>/^[a-f0-9]{64}$/.test(a[k])))throw Error('corrupt');
    return a;
  }
  async function create(username,password){
    username=username.trim();
    if(username.length<3||username.length>60)throw Error('username');
    if(password.length<10||password.length>128)throw Error('password');
    const salt=random(16),recoverySalt=random(16),recovery=random(16).toUpperCase().match(/.{4}/g).join('-');
    return {record:{version:1,iterations:ITERATIONS,username,salt,hash:await hash(password,salt),recoverySalt,recoveryHash:await hash(recovery.replace(/-/g,''),recoverySalt)},recovery};
  }
  async function verify(record,username,password){
    const candidate=await hash(password,record.salt);
    return username.trim()===record.username&&candidate===record.hash;
  }
  async function verifyRecovery(record,code){
    return await hash(code.replace(/[\s-]/g,'').toUpperCase(),record.recoverySalt)===record.recoveryHash;
  }
  function write(storage,record){storage.setItem(KEY,JSON.stringify(record));}
  root.QarzAuthCore={KEY,read,create,verify,verifyRecovery,write};
  if(typeof module!=='undefined')module.exports=root.QarzAuthCore;
})(globalThis);
