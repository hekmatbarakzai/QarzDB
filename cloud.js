/* Qarz Cloud Sync: Supabase Auth + per-user RLS + compare-and-swap writes.
   Browser/Windows offline data remains local, with three-way sync on reconnect.
   No service-role credentials are used by this application. */
(() => {
  'use strict';
  const SESSION_KEY = 'qarz_cloud_session_v1';
  const META_KEY = 'qarz_cloud_meta_v1';
  const config = window.QARZ_CLOUD_CONFIG || {};
  const baseUrl = String(config.url || '').replace(/\/+$/, '');
  const key = String(config.publishableKey || '').trim();
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(baseUrl) &&
    (key.startsWith('sb_publishable_') || (key.startsWith('eyJ') && key.length > 100));
  const $ = id => document.getElementById(id);
  const clone = data => JSON.parse(JSON.stringify(data));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const present = v => v !== undefined;
  const txt = {
    fa: {title:'همگام‌سازی موبایل و ویندوز',setup:'ابتدا cloud-config.js را تنظیم و کُد SQL را در Supabase اجرا کنید.',help:'با همان حساب ابری در ویندوز و موبایل وارد شوید. حساب ادمین محلی از حساب ابری جدا است.',email:'ایمیل حساب ابری',pass:'رمز حساب ابری',connect:'وصل شدن به ابر',connected:'حساب متصل',sync:'همگام‌سازی اکنون',disconnect:'قطع اتصال از این دستگاه',offline:'آفلاین — تغییرات در این دستگاه محفوظ است',ready:'آمادهٔ همگام‌سازی',working:'در حال همگام‌سازی…',ok:'همگام‌سازی شد',pending:'تغییرات محلی منتظر همگام‌سازی است',failed:'خطا در همگام‌سازی',expired:'نشست ابری پایان یافت. دوباره وارد شوید.',initial:'در دستگاه و ابر هر دو معلومات موجود است. یکی را انتخاب کنید؛ پیش از جایگزینی بکاپ بگیرید.',conflict:'یک مورد در دو دستگاه تغییر کرده و قابل ادغام خودکار نیست. بکاپ بگیرید و تصمیم بگیرید کدام نسخه حفظ شود.',merge:'ادغام معلومات هر دو دستگاه',cloud:'استفاده از معلومات ابر',device:'فرستادن معلومات این دستگاه به ابر',backup:'بکاپ از معلومات فعلی',confirmCloud:'معلومات این دستگاه با نسخهٔ ابر جایگزین شود؟ ابتدا بکاپ بگیرید.',confirmDevice:'نسخهٔ این دستگاه جایگزین معلومات ابر شود؟ این کار ممکن است تغییرات دستگاه دیگر را حذف کند.',merged:'ادغام امن ممکن نبود؛ تعارض وجود دارد. یکی از نسخه‌ها را انتخاب کنید.',badLogin:'ورود ابری موفق نبود. ایمیل، رمز و تأیید ایمیل را بررسی کنید.',noInternet:'انترنت نیست؛ معلومات در همین دستگاه می‌ماند.',local:'ذخیره در دستگاه فعال است؛ برای انتقال خودکار باید وارد ابر شوید.',last:'آخرین همگام‌سازی'},
    ps: {title:'د موبایل او وینډوز همغږي',setup:'لومړی cloud-config.js او Supabase SQL ترتیب کړئ.',help:'په کمپیوټر او موبایل کې د یوه کلاوډ حساب سره ننوځئ. محلي اډمین جلا دی.',email:'د کلاوډ برېښنالیک',pass:'د کلاوډ پټنوم',connect:'کلاوډ سره وصل',connected:'وصل شوی حساب',sync:'اوس همغږي',disconnect:'له دې وسیلې جلا کول',offline:'آفلاین — بدلونونه دلته خوندي دي',ready:'همغږۍ ته تیار',working:'همغږي روانه ده…',ok:'همغږي بشپړه شوه',pending:'محلي بدلونونه همغږۍ ته انتظار باسي',failed:'د همغږۍ ستونزه',expired:'د کلاوډ ننوتل پای ته رسېدلي، بیا ننوځئ.',initial:'دواړه وسیله او کلاوډ معلومات لري. لومړی بیک اپ جوړ کړئ او یوه لاره وټاکئ.',conflict:'یوه برخه په دواړو وسیلو کې بدله شوې. بیک اپ واخلئ او یوه نسخه وټاکئ.',merge:'د دواړو معلومات یوځای کول',cloud:'د کلاوډ معلومات کارول',device:'د دې وسیلې معلومات اپلوډ',backup:'د اوسنیو معلوماتو بیک اپ',confirmCloud:'د وسیلې معلومات د کلاوډ معلوماتو سره بدل شي؟ لومړی بیک اپ واخلئ.',confirmDevice:'د کلاوډ معلومات د دې وسیلې سره بدل شي؟ د بلې وسیلې بدلونونه له منځه تلای شي.',merged:'اتومات ادغام ممکن نه دی.',badLogin:'د کلاوډ ننوتل بریالي نه شول.',noInternet:'انټرنېټ نشته؛ معلومات دلته خوندي دي.',local:'محلي ذخیره فعاله ده؛ د همغږۍ لپاره کلاوډ ته ننوځئ.',last:'وروستۍ همغږي'},
    en: {title:'Sync with phone and Windows',setup:'First fill in cloud-config.js and run the SQL in Supabase.',help:'Sign in to the SAME cloud account on your Windows PC and phone. This is separate from the local admin login.',email:'Cloud account email',pass:'Cloud account password',connect:'Connect cloud account',connected:'Connected account',sync:'Sync now',disconnect:'Disconnect on this device',offline:'Offline — changes are saved on this device',ready:'Ready to sync',working:'Syncing…',ok:'Up to date',pending:'Local changes waiting to sync',failed:'Sync failed',expired:'Cloud session expired. Sign in again.',initial:'Both this device and the cloud have records. Back up your data and choose how to combine them.',conflict:'The same record changed on two devices. Back up data, then decide which version to keep.',merge:'Merge both copies safely',cloud:'Use cloud copy',device:'Upload this device’s copy',backup:'Download current backup',confirmCloud:'Replace this device’s records with cloud records? Download a backup first.',confirmDevice:'Overwrite cloud records with this device’s records? Other device changes may be lost.',merged:'These copies conflict and could not be safely merged. Choose one copy.',badLogin:'Cloud login failed. Check email, password, and email confirmation.',noInternet:'No internet; local data is preserved.',local:'Your data is local until you connect a cloud account.',last:'Last synced'}
  };
  const lang = () => txt[document.documentElement.lang] ? document.documentElement.lang : 'fa';
  const t = k => txt[lang()][k];
  const escape = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let bridge, session, meta, syncing = false, dirty = false, timeout = null, interval = null, issue = null, lastSynced = null, status = 'local', detail = '';
  function loadJSON(k) { try {return JSON.parse(localStorage.getItem(k) || 'null');} catch {return null;} }
  session = loadJSON(SESSION_KEY);
  meta = loadJSON(META_KEY);
  function saveSession(s) { session = s; if(s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); }
  function saveMeta(m) { meta = m; if(m)localStorage.setItem(META_KEY,JSON.stringify(m)); else localStorage.removeItem(META_KEY); }
  function setStatus(s, extra = '') {status=s;detail=extra;updatePanel();}
  function isOpen() {return bridge && window.QarzSession?.isUnlocked();}
  function validPeople(data) {return data && typeof data==='object' && Array.isArray(data.people) && data.people.length<=20000 && data.people.every(p=>p && /^[a-zA-Z0-9_-]{1,80}$/.test(p.id) && typeof p.name==='string' && p.name.length<=300 && typeof p.phone==='string' && p.phone.length<=200 && Array.isArray(p.debts) && p.debts.length<=20000 && p.debts.every(d=>d && /^[a-zA-Z0-9_-]{1,80}$/.test(d.id) && typeof d.item==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && typeof d.price==='number' && Number.isFinite(d.price) && d.price>=0 && typeof d.paid==='number' && Number.isFinite(d.paid) && d.paid>=0 && d.paid<=d.price));}
  function peopleNow() {return clone(bridge.getPeople());}
  function formData() {return {people: peopleNow()};}
  function peopleEqual(a,b) {return equal(a,b);}
  function downloadBackup() {
    if(!isOpen())return;
    const file = new Blob([JSON.stringify({lang:bridge.getLanguage(), people:peopleNow()},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(file), a = document.createElement('a');
    a.href=url;a.download='qarz-backup-before-cloud-'+new Date().toISOString().slice(0,10)+'.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function api(path, {method='GET', body, token, retry=true}={}) {
    if(!navigator.onLine)throw Error('offline');
    if(!configured)throw Error('not-configured');
    if(token !== false && session && session.expiresAt < Date.now() + 60000)await refresh();
    const headers={'apikey':key, 'Content-Type':'application/json'};
    if(token !== false && session)headers.Authorization='Bearer '+session.access_token;
    const result=await fetch(baseUrl+path,{method, headers, body:body === undefined ? undefined : JSON.stringify(body), cache:'no-store'});
    if(result.status===401 && token !== false && retry && session){await refresh();return api(path,{method,body,token,retry:false});}
    const raw=await result.text();let data=null;
    try{data=raw?JSON.parse(raw):null}catch{throw Error('Invalid cloud response');}
    if(!result.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||('HTTP '+result.status));
    return data;
  }
  async function refresh() {
    if(!session?.refresh_token)throw Error('session-expired');
    const current=session;
    const response=await fetch(baseUrl+'/auth/v1/token?grant_type=refresh_token',{
      method:'POST',headers:{'apikey':key,'Content-Type':'application/json'},
      body:JSON.stringify({refresh_token:current.refresh_token}),cache:'no-store'
    });
    const data=await response.json();
    if(!response.ok || !data.access_token){saveSession(null);throw Error('session-expired');}
    saveSession({email:current.email, userId:data.user?.id||current.userId, access_token:data.access_token,
      refresh_token:data.refresh_token, expiresAt:Date.now()+data.expires_in*1000});
  }
  async function login(email,password) {
    if(!configured)throw Error('not-configured');
    const data=await api('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},token:false});
    if(!data?.access_token || !data?.user?.id)throw Error('bad-login');
    const newId = data.user.id;
    // Preserve the previous account's metadata separately rather than accidentally comparing unrelated accounts.
    if(meta?.userId!==newId)saveMeta(null);
    saveSession({email,userId:newId,access_token:data.access_token,refresh_token:data.refresh_token,
      expiresAt:Date.now()+data.expires_in*1000});
    dirty=true;issue=null;setStatus('ready');await sync();
  }
  async function getRemote() {
    const rows=await api('/rest/v1/qarz_state?select=data,revision&user_id=eq.'+encodeURIComponent(session.userId)+'&limit=1');
    return Array.isArray(rows)&&rows.length ? {people:rows[0].data.people,rev:Number(rows[0].revision)} : {people:null,rev:0};
  }
  async function commit(expected,people) {
    const data=await api('/rest/v1/rpc/qarz_commit',{method:'POST',body:{p_expected_revision:expected,p_data:{people}}});
    if(!data || typeof data.ok!=='boolean')throw Error('Unexpected commit reply');
    return data;
  }
  // Field-level three-way merge preserves changes to different borrowers/debts,
  // including deletion tombstones implied by the last-synced base snapshot.
  function mergeValue(base,local,remote,what,conflicts) {
    if(equal(local,remote))return cloneSafe(local);
    if(equal(local,base))return cloneSafe(remote);
    if(equal(remote,base))return cloneSafe(local);
    conflicts.push(what);
    return cloneSafe(local);
  }
  function cloneSafe(v){return present(v)?clone(v):undefined;}
  function mergeEntities(baseList,localList,remoteList,kind,conflicts) {
    const B=new Map((baseList||[]).map(x=>[x.id,x]));
    const L=new Map((localList||[]).map(x=>[x.id,x]));
    const R=new Map((remoteList||[]).map(x=>[x.id,x]));
    const ids=[...new Set([...R.keys(),...L.keys(),...B.keys()])];
    const out=[];
    for(const id of ids) {
      const b=B.get(id), l=L.get(id), r=R.get(id);
      const changed=id+' ('+kind+')';
      if(!b){
        if(!l || !r){out.push(clone(l||r));continue;}
        if(equal(l,r)){out.push(clone(l));continue;}
        conflicts.push(changed);out.push(clone(l));continue;
      }
      if(!l && !r)continue;
      if(!l || !r){
        const kept=l||r;
        if(!equal(kept,b)) {conflicts.push(changed);out.push(clone(kept));}
        continue;
      }
      const fields=kind==='person'?['name','phone']:['item','price','paid','date'];
      const obj={id};
      for(const f of fields)obj[f]=mergeValue(b[f],l[f],r[f],changed+':'+f,conflicts);
      if(kind==='person')obj.debts=mergeEntities(b.debts,l.debts,r.debts,'debt',conflicts);
      out.push(obj);
    }
    return out;
  }
  function mergePeople(base,local,remote) {
    const conflicts=[];
    const merged=mergeEntities(base||[],local||[],remote||[],'person',conflicts);
    return {people:merged,conflicts};
  }
  function remember(people,rev) {
    saveMeta({userId:session.userId,base:clone(people),revision:rev});
    lastSynced=Date.now();
  }
  function applyRemote(people) {
    if(!peopleEqual(peopleNow(),people))bridge.setPeople(clone(people));
  }
  function showIssue(type, remote) {issue={type, remote};setStatus(type);}
  async function sync(){
    if(!isOpen() || !configured || !session || syncing || issue)return;
    if(!navigator.onLine){setStatus('offline');return;}
    syncing=true;setStatus('working');
    try{
      for(let attempt=0;attempt<5;attempt++) {
        const snapshot=peopleNow();
        const remote=await getRemote();
        if(remote.rev>0 && !validPeople({people:remote.people}))throw Error('Invalid cloud records');
        if(!peopleEqual(peopleNow(),snapshot))continue; // user edited while fetching
        if(!meta || meta.userId!==session.userId){
          if(remote.rev===0){
            const written=await commit(0,snapshot);
            if(!written.ok)continue;
            remember(snapshot,Number(written.revision));
            if(!peopleEqual(peopleNow(),snapshot)){dirty=true;continue;}
            dirty=false;setStatus('ok');return;
          }
          if(!snapshot.length || peopleEqual(snapshot,remote.people)){
            applyRemote(remote.people);remember(remote.people,remote.rev);dirty=false;setStatus('ok');return;
          }
          showIssue('initial',remote);return;
        }
        if(remote.rev===0){showIssue('conflict',{...remote,people:[]});return;}
        const {people,conflicts}=mergePeople(meta.base||[],snapshot,remote.people);
        if(conflicts.length){showIssue('conflict',remote);return;}
        if(peopleEqual(people,remote.people)){
          if(!peopleEqual(peopleNow(),snapshot))continue;
          applyRemote(people);remember(people,remote.rev);dirty=false;setStatus('ok');return;
        }
        const written=await commit(remote.rev,people);
        if(!written.ok)continue;
        const editedWhileWriting=!peopleEqual(peopleNow(),snapshot);
        // Our latest version is now server-side; preserve edits made during the request.
        remember(people,Number(written.revision));
        if(!editedWhileWriting)applyRemote(people);
        if(editedWhileWriting){dirty=true;continue;}
        dirty=false;setStatus('ok');return;
      }
      setStatus('pending','Cloud was busy; will retry.');
    }catch(e){
      if(e.message==='session-expired')setStatus('expired');
      else setStatus(navigator.onLine?'failed':'offline',e.message);
    }finally{syncing=false;updatePanel();}
  }
  async function resolve(action) {
    if(!issue || syncing || !session)return;
    if(action==='backup'){downloadBackup();return;}
    if(action==='cloud') {
      if(!confirm(t('confirmCloud')))return;
      downloadBackup();
      const snapshot=peopleNow();
      syncing=true;setStatus('working');
      try{const remote=await getRemote();
        if(!peopleEqual(peopleNow(),snapshot))throw Error('Local data changed, try again.');
        if(!remote.people)throw Error('No cloud data found.');
        applyRemote(remote.people);remember(remote.people,remote.rev);issue=null;dirty=false;setStatus('ok');
      }catch(e){setStatus('failed',e.message)}finally{syncing=false;updatePanel()}
      return;
    }
    if(action==='device' && !confirm(t('confirmDevice')))return;
    syncing=true;setStatus('working');
    try {
      for(let n=0;n<4;n++){
        const local=peopleNow(), remote=await getRemote();
        if(!peopleEqual(peopleNow(),local))continue;
        if(action==='merge'){
          const res=mergePeople([],local,remote.people||[]);
          if(res.conflicts.length){setStatus('conflict',t('merged'));return;}
          const written=await commit(remote.rev,res.people);
          if(!written.ok)continue;
          remember(res.people,Number(written.revision));
          if(peopleEqual(peopleNow(),local))applyRemote(res.people);
          issue=null;dirty=true;setStatus('ok');schedule();return;
        }
        const written=await commit(remote.rev,local);
        if(!written.ok)continue;
        remember(local,Number(written.revision));issue=null;dirty=false;setStatus('ok');return;
      }
      setStatus('failed','Cloud changed while resolving the conflict. Try again.');
    }catch(e){setStatus('failed',e.message)}finally{syncing=false;updatePanel()}
  }
  function schedule() {
    clearTimeout(timeout);
    if(!session || issue || !isOpen())return;
    timeout=setTimeout(sync,700);
  }
  function changed() {dirty=true;if(session && !issue)setStatus(navigator.onLine?'pending':'offline');schedule();}
  function statusMessage(){return t(status) || t('ready');}
  function html(){
    const connected=!!session;
    const extra=detail?`<p class="cloud-small cloud-error">${escape(detail)}</p>`:'';
    const choices=issue?`<div class="cloud-warning"><p>${t(issue.type)}</p><div class="cloud-actions"><button class="btn g" data-cloud="backup">${t('backup')}</button>${issue.type==='initial'?`<button class="btn g" data-cloud="merge">${t('merge')}</button>`:''}<button class="btn g" data-cloud="cloud">${t('cloud')}</button><button class="btn" data-cloud="device">${t('device')}</button></div></div>`:'';
    return `<div class="card cloud-panel" id="cloud-panel"><h3>${t('title')}</h3><p class="cloud-small">${t('help')}</p>`+
      (!configured?`<p class="cloud-warning">${t('setup')}</p>`:
      !connected?`<form id="cloud-login-form" class="cloud-form"><label for="cloud-email">${t('email')}</label><input id="cloud-email" type="email" name="email" required autocomplete="email" placeholder="name@example.com"><label for="cloud-pass">${t('pass')}</label><input id="cloud-pass" type="password" name="password" required autocomplete="current-password"><button type="submit" class="btn">${t('connect')}</button></form>`:
      `<div class="cloud-small">${t('connected')}: <b dir="ltr">${escape(session.email)}</b></div><div class="cloud-actions"><button class="btn" data-cloud="sync" ${syncing?'disabled':''}>${t('sync')}</button><button class="btn g" data-cloud="disconnect">${t('disconnect')}</button></div><p class="cloud-small cloud-indicator" role="status">${escape(statusMessage())}</p>${lastSynced?`<p class="cloud-small">${t('last')}: ${escape(new Date(lastSynced).toLocaleString())}</p>`:''}${choices}${extra}`)+`</div>`;
  }
  function updatePanel() {
    if(!$('cloud-panel'))return;
    // Don't rerender the login form while typing. Only change its status on submit.
    if(!session && configured && $('cloud-login-form'))return;
    const existing=$('cloud-panel');
    const wrapper=document.createElement('div');wrapper.innerHTML=html();existing.replaceWith(wrapper.firstElementChild);
  }
  async function handleLogin(e){
    e.preventDefault();if(!isOpen())return;
    const form=e.target,button=form.querySelector('button');button.disabled=true;button.textContent='…';
    try{await login(form.elements.email.value.trim(),form.elements.password.value);
      updatePanel();}
    catch(e){button.disabled=false;button.textContent=t('connect');
      const holder=$('cloud-login-error')||document.createElement('p');holder.id='cloud-login-error';holder.className='cloud-small cloud-error';holder.textContent=t('badLogin')+' '+e.message;form.append(holder);
    }
  }
  async function disconnect() {
    if(!confirm(t('disconnect')+'?'))return;
    // Disconnect never deletes local borrower data or its last-synced snapshot.
    if(session) {
      // Clear remembered baseline so a different account cannot silently receive prior data.
      saveSession(null);saveMeta(null);
    }
    issue=null;dirty=false;lastSynced=null;setStatus('local');
  }
  function start(b){
    if(bridge)return;bridge=b;
    if(!configured)setStatus('local');else if(session){setStatus('ready');schedule();}else setStatus('local');
    if(!interval) interval=setInterval(()=>{if(session && isOpen() && !issue)sync();},15000);
    window.addEventListener('online',()=>{if(session&&!issue)schedule();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&session&&!issue)schedule();});
    document.addEventListener('submit',e=>{if(e.target.id==='cloud-login-form')handleLogin(e);});
    document.addEventListener('click',e=>{
      const btn=e.target.closest('[data-cloud]');if(!btn || !isOpen())return;
      const a=btn.dataset.cloud;
      if(a==='sync') {issue=null;sync();}
      else if(a==='disconnect')disconnect();
      else resolve(a);
    });
  }
  window.QarzCloud={start,changed,html,refresh:updatePanel,_test:{mergePeople}};
})();
