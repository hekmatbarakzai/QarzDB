window.QarzApplication = {start(){
if(!window.QarzSession.isUnlocked())return;

const T={
fa:{app:"حسابداری قرض‌ها",debts:"قرض‌ها",report:"گزارش ماهانه",settings:"تنظیمات",search:"جستجو با نام یا شماره...",newP:"+ فرد جدید",name:"نام قرض‌گیرنده",phone:"شماره تلیفون",item:"نام جنس",price:"قیمت اصلی",paid:"رسید",rem:"باقی‌مانده",add:"افزودن قرض",del:"حذف",edit:"ویرایش",save:"ذخیره",cancel:"لغو",none:"هیچ فردی نیست",pick:"یک فرد را انتخاب کنید",nodebt:"قرضی ثبت نشده",date:"تاریخ",month:"ماه",tp:"مجموع قیمت اجناس",tr:"مجموع رسیدها",trem:"باقی‌مانده",all:"باقی‌مانده همه مردم (کل)",lang:"زبان",exp:"ذخیره نسخه پشتیبان",imp:"بازیابی نسخه پشتیبان",conf:"حذف شود؟",person:"فرد",nm:"در این ماه قرضی نیست",newT:"فرد جدید",editT:"ویرایش فرد"},
ps:{app:"د پورونو محاسبه",debts:"پورونه",report:"میاشتنی راپور",settings:"تنظیمات",search:"په نوم یا شمېره لټون...",newP:"+ نوی کس",name:"د پور اخیستونکي نوم",phone:"د تلیفون شمېره",item:"د جنس نوم",price:"اصلي بیه",paid:"رسید",rem:"پاتې",add:"پور اضافه کړه",del:"ړنګول",edit:"سمول",save:"ثبت",cancel:"لغوه",none:"هېڅ څوک نشته",pick:"یو کس وټاکئ",nodebt:"هېڅ پور نشته",date:"نېټه",month:"میاشت",tp:"د جنسونو ټول بیه",tr:"د ټولو رسیدونو مجموعه",trem:"پاتې",all:"د ټولو خلکو پاتې (ټول)",lang:"ژبه",exp:"بېک اپ خوندي کړه",imp:"بېک اپ بیا راوړه",conf:"ړنګ شي؟",person:"کس",nm:"په دې میاشت کې پور نشته",newT:"نوی کس",editT:"د کس سمون"},
en:{app:"Debt Accounting",debts:"Debts",report:"Monthly Report",settings:"Settings",search:"Search by name or phone...",newP:"+ New person",name:"Borrower name",phone:"Phone number",item:"Item name",price:"Original price",paid:"Receipt",rem:"Remaining",add:"Add debt",del:"Delete",edit:"Edit",save:"Save",cancel:"Cancel",none:"No people yet",pick:"Select a person",nodebt:"No debts recorded",date:"Date",month:"Month",tp:"Total item prices",tr:"Total receipts",trem:"Remaining",all:"Remaining across everyone (all time)",lang:"Language",exp:"Export backup",imp:"Import backup",conf:"Delete?",person:"Person",nm:"No debts this month",newT:"New person",editT:"Edit person"}};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>(+n||0).toLocaleString("en-US");
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function normalizePeople(people){
 if(!Array.isArray(people)||people.length>20000)throw Error("Invalid people");
 const seen=new Set();
 return people.map(p=>{
  if(!p||typeof p.id!=="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||seen.has(p.id)
    ||typeof p.name!=="string"||p.name.length>300||typeof p.phone!=="string"||p.phone.length>200
    ||!Array.isArray(p.debts)||p.debts.length>20000)throw Error("Invalid person");
  seen.add(p.id);const ids=new Set();
  return {id:p.id,name:p.name,phone:p.phone,debts:p.debts.map(d=>{
   if(!d||typeof d.id!=="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(d.id)||ids.has(d.id)
     ||typeof d.item!=="string"||d.item.length>500||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)
     ||typeof d.price!=="number"||!Number.isFinite(d.price)||d.price<0
     ||typeof d.paid!=="number"||!Number.isFinite(d.paid)||d.paid<0||d.paid>d.price)throw Error("Invalid debt");
   ids.add(d.id);return {id:d.id,item:d.item,price:d.price,paid:d.paid,date:d.date};
  })};
 });
}
let S={lang:"fa",people:[]},sel=null,tab="debts",editing=null,month=new Date().toISOString().slice(0,7);
try{const r=localStorage.getItem("qarz_v1");if(r){const d=JSON.parse(r);S={lang:["en","ps","fa"].includes(d.lang)?d.lang:"fa",people:normalizePeople(d.people)}}}catch(e){console.warn("Qarz: local data needs a valid backup",e)}
const save=(notify=true)=>{try{localStorage.setItem("qarz_v1",JSON.stringify(S))}catch(e){}if(notify)window.QarzCloud?.changed();};
const t=k=>T[S.lang][k];
const tot=p=>p.debts.reduce((a,d)=>({pr:a.pr+d.price,pd:a.pd+d.paid}),{pr:0,pd:0});

function setLang(){
 window.QarzSession.updateLanguage(S.lang);
 document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==="en"?"ltr":"rtl";document.title=t("app");
 $("t_app").textContent=t("app");["debts","report","settings"].forEach(k=>$("t_"+k).textContent=t(k));
 $("q").placeholder=t("search");$("newP").textContent=t("newP");
 $("l_name").textContent=t("name");$("l_phone").textContent=t("phone");$("ok").textContent=t("save");$("no").textContent=t("cancel");
}
function render(){
 setLang();
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
 document.querySelectorAll(".pane").forEach(p=>p.classList.toggle("on",p.id==="p_"+tab));
 renderList();renderProf();renderRep();renderSet();
}
function renderList(){
 const q=$("q").value.trim().toLowerCase();
 const L=S.people.filter(p=>!q||p.name.toLowerCase().includes(q)||p.phone.includes(q));
 $("people").innerHTML=L.length?L.map(p=>{const x=tot(p),r=x.pr-x.pd;return `<div class="row ${p.id===sel?"on":""}" data-id="${p.id}"><div>${esc(p.name)}<small dir="ltr" style="text-align:start">${esc(p.phone)}</small></div><span class="chip ${r>0?"d":""}">${fmt(r)}</span></div>`}).join(""):`<div class="empty">${t("none")}</div>`;
}
function renderProf(){
 const p=S.people.find(x=>x.id===sel),el=$("prof");
 if(!p){el.innerHTML=`<div class="empty">${t("pick")}</div>`;return}
 const x=tot(p);
 el.innerHTML=`<div class="card head"><div class="av">${esc(p.name[0]||"?")}</div><div><h2>${esc(p.name)}</h2><p dir="ltr" style="text-align:start">${esc(p.phone)}</p></div><div class="sp"></div><button class="btn g" data-a="editP">${t("edit")}</button><button class="btn r" data-a="delP">${t("del")}</button></div>
 <div class="stats"><div><span>${t("tp")}</span><b>${fmt(x.pr)}</b></div><div><span>${t("tr")}</span><b>${fmt(x.pd)}</b></div><div class="a"><span>${t("rem")}</span><b>${fmt(x.pr-x.pd)}</b></div></div>
 <div class="card"><div class="add"><input id="a_item" placeholder="${t("item")}"><input id="a_price" type="number" min="0" placeholder="${t("price")}"><input id="a_paid" type="number" min="0" placeholder="${t("paid")}"><button class="btn" data-a="addD">${t("add")}</button></div></div>
 <div class="card tw">${p.debts.length?`<table><tr><th>${t("date")}</th><th>${t("item")}</th><th>${t("price")}</th><th>${t("paid")}</th><th>${t("rem")}</th><th></th></tr>${p.debts.map(d=>`<tr><td dir="ltr">${esc(d.date)}</td><td>${esc(d.item)}</td><td>${fmt(d.price)}</td><td><input type="number" min="0" value="${d.paid}" data-paid="${d.id}"></td><td><b style="color:var(--acc)">${fmt(d.price-d.paid)}</b></td><td><button class="btn r" data-a="delD" data-d="${d.id}">×</button></td></tr>`).join("")}</table>`:`<div class="empty">${t("nodebt")}</div>`}</div>`;
}
function renderRep(){
 let P=0,R=0,all=0;
 const rows=S.people.map(p=>{const x=tot(p);all+=x.pr-x.pd;const m=p.debts.filter(d=>d.date.slice(0,7)===month);if(!m.length)return"";const a=m.reduce((s,d)=>s+d.price,0),b=m.reduce((s,d)=>s+d.paid,0);P+=a;R+=b;return `<tr><td>${esc(p.name)}</td><td>${fmt(a)}</td><td>${fmt(b)}</td><td>${fmt(a-b)}</td></tr>`}).join("");
 $("rep").innerHTML=`<div class="card"><label>${t("month")}</label><input type="month" id="mon" value="${month}" style="max-width:220px"></div>
 <div class="stats"><div><span>${t("tp")}</span><b>${fmt(P)}</b></div><div><span>${t("tr")}</span><b>${fmt(R)}</b></div><div class="a"><span>${t("trem")}</span><b>${fmt(P-R)}</b></div><div class="a"><span>${t("all")}</span><b>${fmt(all)}</b></div></div>
 <div class="card tw">${rows?`<table><tr><th>${t("person")}</th><th>${t("price")}</th><th>${t("paid")}</th><th>${t("rem")}</th></tr>${rows}</table>`:`<div class="empty">${t("nm")}</div>`}</div>`;
}
function renderSet(){
 $("set").innerHTML=`<div class="card" style="max-width:420px"><label>${t("lang")}</label><select id="lg"><option value="en">English</option><option value="ps">پښتو</option><option value="fa">دری</option></select><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn g" data-a="exp">${t("exp")}</button><button class="btn g" data-a="imp">${t("imp")}</button></div></div>` + (window.QarzCloud?.html() || "");
 $("lg").value=S.lang;
}
function openP(p){editing=p||null;$("dt").textContent=p?t("editT"):t("newT");$("f_name").value=p?p.name:"";$("f_phone").value=p?p.phone:"";$("dlg").showModal()}
$("ok").onclick=()=>{
 const n=$("f_name").value.trim();if(!n)return;const ph=$("f_phone").value.trim();
 if(editing){editing.name=n;editing.phone=ph}else{const p={id:uid(),name:n,phone:ph,debts:[]};S.people.push(p);sel=p.id}
 save();$("dlg").close();render();
};
$("no").onclick=()=>$("dlg").close();
$("newP").onclick=()=>openP();
$("q").oninput=renderList;
document.addEventListener("click",e=>{
 if(!window.QarzSession.isUnlocked())return;
 const tb=e.target.closest("[data-tab]");if(tb){tab=tb.dataset.tab;render();return}
 const r=e.target.closest(".row");if(r){sel=r.dataset.id;render();return}
 const b=e.target.closest("[data-a]");if(!b)return;
 const p=S.people.find(x=>x.id===sel),a=b.dataset.a;
 if(a==="editP")openP(p);
 else if(a==="delP"){if(confirm(t("conf"))){S.people=S.people.filter(x=>x!==p);sel=null;save();render()}}
 else if(a==="addD"){const item=$("a_item").value.trim(),pr=+$("a_price").value;if(!item||!(pr>=0)||$("a_price").value==="")return;
  p.debts.push({id:uid(),item,price:pr,paid:Math.min(pr,+$("a_paid").value||0),date:new Date().toISOString().slice(0,10)});save();render()}
 else if(a==="delD"){if(confirm(t("conf"))){p.debts=p.debts.filter(d=>d.id!==b.dataset.d);save();render()}}
 else if(a==="exp"){const l=document.createElement("a");l.href="data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(S));l.download="qarz-backup.json";l.click()}
 else if(a==="imp"){const i=document.createElement("input");i.type="file";i.accept=".json";i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(x=>{try{const d=JSON.parse(x);if(Array.isArray(d.people)){S={lang:["en","ps","fa"].includes(d.lang)?d.lang:"fa",people:normalizePeople(d.people)};save();render()}}catch(_){alert("Invalid backup JSON. Existing records were not changed.")}})};i.click()}
});
document.addEventListener("change",e=>{
 if(!window.QarzSession.isUnlocked())return;
 if(e.target.id==="lg"){S.lang=e.target.value;save();render()}
 else if(e.target.id==="mon"){month=e.target.value||month;renderRep()}
 else if(e.target.dataset.paid){const p=S.people.find(x=>x.id===sel),d=p.debts.find(x=>x.id===e.target.dataset.paid);d.paid=Math.min(d.price,Math.max(0,+e.target.value||0));save();render()}
});
render();


window.QarzApplication.refresh=render;
window.QarzCloud?.start({
  getPeople:()=>S.people,
  getLanguage:()=>S.lang,
  setPeople:people=>{S.people=normalizePeople(people);if(!S.people.some(p=>p.id===sel))sel=null;save(false);render();}
});
}};
