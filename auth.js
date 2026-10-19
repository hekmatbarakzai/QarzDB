(() => {
'use strict';
const C=QarzAuthCore;
const text={
en:{brand:'DEBT ACCOUNTING',login:'Welcome back to Qarz',loginSub:'Sign in to manage your accounts, with everything in one place.',setup:'Set up your admin',setupSub:'Create the administrator account for Qarz on this device.',recover:'Recover your account',recoverSub:'Use your saved recovery code to choose a new password.',settings:'Admin account',settingsSub:'Update your username and password for this device.',username:'Username',password:'Password',current:'Current password',newPassword:'New password',confirm:'Confirm password',code:'Recovery code',signin:'Sign in as admin',create:'Create admin account',reset:'Reset password',save:'Save account changes',show:'Show',hide:'Hide',forgot:'Forgot your password?',back:'Back to sign in',cancel:'Cancel',offline:'ON THIS DEVICE',note:'Your admin account belongs to this device. No internet connection is needed to sign in.',footer:'QARZ · A little clarity for every account.',min:'At least 10 characters',userHint:'Choose a username',bad:'Username or password is incorrect.',badCode:'The recovery code is incorrect.',mismatch:'The passwords do not match.',short:'Use a password of 10–128 characters.',badUser:'Use a username of 3–60 characters.',storage:'Changes could not be saved. Check that device storage is available, then try again.',unavailable:'Sign-in needs a supported browser on HTTPS or localhost, or the Windows app.',corrupt:'The admin settings could not be read. Keep your existing data and restore a device backup; do not clear app storage.',wait:'Please wait…',saved:'Save your recovery code',savedSub:'Keep this code somewhere private. You will need it if you forget your password.',download:'Download recovery code',ack:'I have saved my recovery code in a safe place.',continue:'Continue to Qarz',replaceCode:'This new code replaces any previous recovery code.',admin:'Admin',account:'Account settings',logout:'Log out',logoutConfirm:'Log out of Qarz?',retry:'Too many attempts. Wait 30 seconds and try again.',local:'This is a local access lock. Debt records and exported backups are not encrypted.',close:'Close account settings'},
fa:{brand:'حسابداری قرض‌ها',login:'به قرض خوش آمدید',loginSub:'برای مدیریت حساب‌ها و قرض‌های خود وارد شوید.',setup:'حساب ادمین را بسازید',setupSub:'برای استفاده از قرض در این دستگاه، حساب مدیر را ایجاد کنید.',recover:'بازیابی حساب',recoverSub:'با کود بازیابی ذخیره‌شده، رمز عبور جدید بسازید.',settings:'حساب ادمین',settingsSub:'نام کاربری و رمز عبور این دستگاه را تغییر دهید.',username:'نام کاربری',password:'رمز عبور',current:'رمز عبور فعلی',newPassword:'رمز عبور جدید',confirm:'تکرار رمز عبور',code:'کود بازیابی',signin:'ورود به‌عنوان ادمین',create:'ایجاد حساب ادمین',reset:'تغییر رمز عبور',save:'ذخیره تغییرات حساب',show:'نمایش',hide:'پنهان',forgot:'رمز عبور را فراموش کرده‌اید؟',back:'بازگشت به ورود',cancel:'لغو',offline:'در همین دستگاه',note:'حساب ادمین مخصوص همین دستگاه است. برای ورود به انترنت نیاز ندارید.',footer:'قرض · حساب‌های روشن، مدیریت آسان',min:'حداقل ۱۰ حرف یا عدد',userHint:'نام کاربری انتخاب کنید',bad:'نام کاربری یا رمز عبور درست نیست.',badCode:'کود بازیابی درست نیست.',mismatch:'رمزهای عبور یکسان نیستند.',short:'رمز عبور باید بین ۱۰ تا ۱۲۸ حرف یا عدد باشد.',badUser:'نام کاربری باید بین ۳ تا ۶۰ حرف باشد.',storage:'تغییرات ذخیره نشد. فضای ذخیره‌سازی دستگاه را بررسی و دوباره کوشش کنید.',unavailable:'از برنامهٔ ویندوز یا براوزر جدید با HTTPS یا localhost استفاده کنید.',corrupt:'تنظیمات ادمین خوانده نشد. معلومات موجود را نگه دارید؛ حافظهٔ برنامه را پاک نکنید.',wait:'لطفاً صبر کنید…',saved:'کود بازیابی را نگه دارید',savedSub:'این کود را در جای امن نگه دارید؛ در صورت فراموشی رمز عبور به آن نیاز دارید.',download:'دانلود کود بازیابی',ack:'کود بازیابی را در جای امن ذخیره کردم.',continue:'ورود به برنامهٔ قرض',replaceCode:'این کود جایگزین کود بازیابی قبلی می‌شود.',admin:'ادمین',account:'تنظیمات حساب',logout:'خروج',logoutConfirm:'از برنامه خارج می‌شوید؟',retry:'تلاش‌های زیاد؛ ۳۰ ثانیه صبر کنید و دوباره کوشش کنید.',local:'این قفل محلی است. معلومات قرض‌ها و فایل‌های پشتیبان رمزگذاری نشده‌اند.',close:'بستن تنظیمات حساب'},
ps:{brand:'د پورونو محاسبه',login:'قرض ته ښه راغلاست',loginSub:'د خپلو حسابونو او پورونو د مدیریت لپاره ننوځئ.',setup:'د اډمین حساب جوړ کړئ',setupSub:'په دې وسیله د قرض لپاره د مدیر حساب جوړ کړئ.',recover:'حساب بېرته ترلاسه کړئ',recoverSub:'د نوي پټنوم لپاره خپل خوندي شوی د بیا ترلاسه کولو کوډ وکاروئ.',settings:'د اډمین حساب',settingsSub:'د دې وسیلې کارن‌نوم او پټنوم بدل کړئ.',username:'کارن‌نوم',password:'پټنوم',current:'اوسنی پټنوم',newPassword:'نوی پټنوم',confirm:'پټنوم بیا ولیکئ',code:'د بیا ترلاسه کولو کوډ',signin:'د اډمین په توګه ننوتل',create:'د اډمین حساب جوړول',reset:'پټنوم بدلول',save:'بدلونونه خوندي کړئ',show:'ښکاره',hide:'پټ',forgot:'پټنوم مو هېر شوی؟',back:'ننوتلو ته ستنېدل',cancel:'لغوه',offline:'په همدې وسیله',note:'دا حساب یوازې د دې وسیلې دی. د ننوتلو لپاره انټرنېټ ته اړتیا نشته.',footer:'قرض · روښانه حسابونه، اسانه مدیریت',min:'لږ تر لږه ۱۰ توري',userHint:'کارن‌نوم وټاکئ',bad:'کارن‌نوم یا پټنوم ناسم دی.',badCode:'کوډ ناسم دی.',mismatch:'پټنومونه یو شان نه دي.',short:'پټنوم باید له ۱۰ تر ۱۲۸ تورو وي.',badUser:'کارن‌نوم باید له ۳ تر ۶۰ تورو وي.',storage:'بدلونونه خوندي نه شول. د وسیلې حافظه وګورئ.',unavailable:'د وینډوز اپ یا نوی براوزر په HTTPS یا localhost وکاروئ.',corrupt:'د اډمین تنظیمات ونه لوستل شول. د اپ معلومات مه پاکوئ.',wait:'لطفاً صبر وکړئ…',saved:'خپل کوډ خوندي کړئ',savedSub:'دا کوډ په خوندي ځای کې وساتئ؛ د هېر شوي پټنوم لپاره ورته اړتیا لرئ.',download:'کوډ ډاونلوډ کړئ',ack:'ما خپل کوډ په خوندي ځای کې وساته.',continue:'قرض ته ننوتل',replaceCode:'دا کوډ پخوانی کوډ بدلوي.',admin:'اډمین',account:'د حساب تنظیمات',logout:'وتل',logoutConfirm:'له قرض څخه وځئ؟',retry:'ډېرې هڅې؛ ۳۰ ثانیې صبر وکړئ.',local:'دا محلي قلف دی. پورونه او بیک‌اپونه نه دي کوډ شوي.',close:'تنظیمات بند کړئ'}
};
const $=id=>document.getElementById(id);
let language='fa',record=null,mode='login',unlocked=false,started=false,pending=null,busy=false,attempts=0,blockedUntil=0,baseRecord=null;
try{language=localStorage.getItem('qarz_login_lang')||'fa'}catch{}
if(!text[language])language='fa';
const t=k=>text[language][k];
const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
$('auth-root').innerHTML=`<div class="auth-scene" aria-hidden="true"><div class="rail"></div><div class="tile"></div><div class="tile two"></div><div class="tile three"></div><div class="auth-orb"></div><div class="auth-orb sage"></div></div><header class="auth-top"><div class="auth-wordmark"><img src="icon.svg" alt="">QARZ</div><select id="auth-lang" aria-label="Language"><option value="fa">دری</option><option value="ps">پښتو</option><option value="en">English</option></select></header><section class="auth-card" id="auth-card" aria-labelledby="auth-title"></section><p class="auth-footer" id="auth-footer"></p>`;
function message(key){$('auth-error').textContent=t(key);$('auth-error').hidden=false;}
function field(id,label,type='text',auto='off'){
 const secret=type==='password';
 return `<div class="auth-field"><label for="${id}">${t(label)}</label><div class="${secret?'auth-password':''}"><input id="${id}" name="${id}" type="${type}" autocomplete="${auto}" required maxlength="${secret?128:100}" ${secret?'': 'spellcheck="false" autocapitalize="none"'}>${secret?`<button type="button" data-reveal="${id}" aria-controls="${id}" aria-pressed="false">${t('show')}</button>`:''}</div></div>`;
}
function render(){
 $('auth-root').hidden=false;$('app-shell').hidden=true;$('app-shell').inert=true;
 document.documentElement.lang=language;document.documentElement.dir=language==='en'?'ltr':'rtl';
 $('auth-lang').value=language;$('auth-lang').disabled=busy;$('auth-footer').textContent=t('footer');
 let content='';
 if(mode==='confirm'){
  content=`<p class="auth-subtitle">${t('savedSub')}</p><code class="auth-code" id="recovery-display"></code><button type="button" class="auth-secondary" id="download-code">${t('download')}</button><label class="auth-check"><input type="checkbox" id="code-saved">${t('ack')}</label><button class="auth-submit" type="button" id="finish-setup" disabled>${t('continue')}</button><p class="auth-note">${t('replaceCode')}</p>`;
 }else if(mode!=='fatal'){
  const setting=mode==='settings',login=mode==='login',recover=mode==='recover';
  content=`<p class="auth-subtitle">${t(mode+'Sub')}</p><form id="auth-form" class="auth-form">${field('auth-user','username','text','username')}${setting?field('auth-current','current','password','current-password'):''}${recover?field('auth-recovery','code'):''}${field('auth-password',login?'password':setting||recover?'newPassword':'password','password',login?'current-password':'new-password')}${!login?field('auth-confirm','confirm','password','new-password'):''}<button class="auth-submit" id="auth-submit" type="submit">${t(login?'signin':setting?'save':recover?'reset':'create')}</button></form>${login?`<p class="auth-recover"><button class="auth-text-button" id="recover-link">${t('forgot')}</button></p>`:recover?`<p class="auth-recover"><button class="auth-text-button" id="back-login">${t('back')}</button></p>`:''}<div class="auth-rule">${t('offline')}</div><p class="auth-note">${t('note')}</p>`;
 }
 $('auth-card').innerHTML=`${mode==='settings'?`<button class="auth-close" id="close-account" aria-label="${t('close')}">×</button>`:''}<div class="auth-symbol">${icon}</div><p class="auth-eyebrow">${t('brand')}</p><h1 id="auth-title">${t(mode==='confirm'?'saved':mode==='fatal'?'login':mode)}</h1><div class="auth-message" role="alert" id="auth-error" hidden></div>${content}`;
 if(mode==='confirm'){
  $('recovery-display').textContent=pending.recovery;
  $('code-saved').onchange=()=>{$('finish-setup').disabled=!$('code-saved').checked};
  $('download-code').onclick=()=>{
   const blob=new Blob([`Qarz local admin recovery code\nUsername: ${pending.record.username}\nRecovery code: ${pending.recovery}\nKeep this file private. This code belongs to this device's account.\n`],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Qarz-Recovery-Code.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('finish-setup').onclick=()=>{
   if(!$('code-saved').checked)return;
   try{
    if(localStorage.getItem(C.KEY)!==baseRecord){location.reload();return;}
    C.write(localStorage,pending.record);record=pending.record;pending=null;openApp();
   }catch{message('storage')}
  };
 }else if(mode!=='fatal'){
  if(mode==='settings')$('auth-user').value=record.username;
  if(mode!=='login')$('auth-password').placeholder=t('min');
  $('auth-form').onsubmit=submit;
  $('auth-card').querySelectorAll('[data-reveal]').forEach(b=>b.onclick=()=>{const input=$(b.dataset.reveal),show=input.type==='password';input.type=show?'text':'password';b.textContent=t(show?'hide':'show');b.setAttribute('aria-pressed',String(show))});
  if($('recover-link'))$('recover-link').onclick=()=>{mode='recover';render()};
  if($('back-login'))$('back-login').onclick=()=>{mode='login';render()};
  if($('close-account'))$('close-account').onclick=()=>{if(!busy)openApp()};
  setTimeout(()=>$('auth-user')?.focus(),0);
 }
}
async function submit(event){
 event.preventDefault();if(busy)return;
 if(Date.now()<blockedUntil){message('retry');return;}
 const username=$('auth-user').value.trim(),password=$('auth-password').value,oldMode=mode;
 if(mode!=='login'){
  if(username.length<3||username.length>60){message('badUser');return;}
  if(password.length<10||password.length>128){message('short');return;}
  if(password!==$('auth-confirm').value){message('mismatch');return;}
 }
 busy=true;$('auth-submit').disabled=true;$('auth-submit').textContent=t('wait');$('auth-lang').disabled=true;$('auth-error').hidden=true;
 try{
  baseRecord=localStorage.getItem(C.KEY);record=C.read(localStorage);
  if(mode==='setup'&&record){location.reload();return;}
  if(mode!=='setup'&&!record){location.reload();return;}
  let valid=true;
  if(mode==='login')valid=await C.verify(record,username,password);
  if(mode==='settings')valid=unlocked&&await C.verify(record,record.username,$('auth-current').value);
  if(mode==='recover')valid=username===record.username&&await C.verifyRecovery(record,$('auth-recovery').value);
  if(!valid){attempts++;if(attempts>=5){blockedUntil=Date.now()+30000;attempts=0;}message(mode==='recover'?'badCode':'bad');return;}
  attempts=0;
  if(mode==='login'){openApp();return;}
  pending=await C.create(username,password);mode='confirm';render();
 }catch(e){message(e.message==='corrupt'?'corrupt':'storage')}
 finally{busy=false;$('auth-lang').disabled=false;if($('auth-submit')){$('auth-submit').disabled=false;$('auth-submit').textContent=t(oldMode==='login'?'signin':oldMode==='settings'?'save':oldMode==='recover'?'reset':'create')}}
}
function nav(){
 $('admin-name').textContent=`${t('admin')} · ${record?.username||''}`;
 $('admin-settings').textContent=t('account');$('admin-logout').textContent=t('logout');
}
function openApp(){
 $('auth-card').replaceChildren();
 unlocked=true;$('auth-root').hidden=true;$('app-shell').hidden=false;$('app-shell').inert=false;nav();
 if(!started){started=true;window.QarzApplication.start();}
 else{window.QarzApplication.refresh();}
 $('admin-settings').focus();
}
window.QarzSession={isUnlocked:()=>unlocked,updateLanguage:lang=>{if(text[lang])language=lang;nav()}};
$('admin-settings').onclick=()=>{if(unlocked){mode='settings';render()}};
$('admin-logout').onclick=()=>{if(confirm(t('logoutConfirm'))){unlocked=false;location.reload()}};
$('auth-root').addEventListener('click',e=>{if(busy){e.preventDefault();e.stopImmediatePropagation()}},true);
$('auth-lang').onchange=e=>{language=e.target.value;try{localStorage.setItem('qarz_login_lang',language)}catch{}render()};
addEventListener('pageshow',event=>{if(event.persisted)location.reload()});
addEventListener('storage',event=>{if(event.key===C.KEY||event.key===null)location.reload()});
try{
 if(!crypto.subtle)throw Error('unavailable');
 record=C.read(localStorage);mode=record?'login':'setup';render();
}catch(e){mode='fatal';render();message(e.message==='unavailable'?'unavailable':'corrupt')}
if(location.protocol.startsWith('http')&&'serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
