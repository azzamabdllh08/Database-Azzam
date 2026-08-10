const D=window.SITE_DATA||[], C=window.CONFIG||{};
const $=id=>document.getElementById(id), fmt=n=>Number(n||0).toLocaleString("en-US");
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function count(fn){return D.filter(fn).length}
function uniq(f){return [...new Set(D.map(x=>x[f]).filter(Boolean))].sort()}
function group(f,fn=()=>true){let m={};D.filter(fn).forEach(x=>{let k=f==="year"?String(x.Survey_Date||"").slice(0,4):x[f]||"Unknown";m[k]=(m[k]||0)+1});return Object.fromEntries(Object.entries(m).sort((a,b)=>b[1]-a[1]))}
function bars(id,obj){let e=Object.entries(obj),max=Math.max(...e.map(x=>x[1]),1);$(id).innerHTML=e.slice(0,12).map(([k,v])=>`<div class="bar"><span>${esc(k)}</span><div class="track"><div class="fill" style="width:${v/max*100}%"></div></div><span class="value">${fmt(v)}</span></div>`).join("")||"<p class='note'>No data</p>"}
function render(){
 $("brand").textContent=C.logoText||"Asset & Project";$("title").textContent=C.title||"SITE VERIFICATION";$("source").href=C.onedriveUrl||"#";
 let total=D.length,sv=count(x=>x.Surveyed==="Yes"),miss=count(x=>x.Status==="Tidak Ada"),ada=count(x=>x.Status==="Ada");
 $("total").textContent=fmt(total);$("surveyed").textContent=fmt(sv);$("coverage").textContent=(total?sv/total*100:0).toFixed(1)+"%";$("missing").textContent=fmt(miss);
 bars("siteChart",group("Site"));bars("catChart",group("Category",x=>x.Surveyed==="Yes"));bars("yearChart",group("year",x=>x.Surveyed==="Yes"));
 let p=ada/(ada+miss||1)*100;$("donut").innerHTML=`<div class="donutbox"><div class="donut" style="--p:${p}%"><div class="hole">${fmt(ada+miss)}<small>Status</small></div></div><div class="legend">🔵 Ada: <b>${fmt(ada)}</b><br>🔷 Tidak Ada: <b>${fmt(miss)}</b></div></div>`;
 $("siteTable").innerHTML=`<table class="table"><tr><th>Site</th><th>Total</th><th>Surveyed</th><th>Coverage</th></tr>${uniq("Site").map(s=>{let t=count(x=>x.Site===s),v=count(x=>x.Site===s&&x.Surveyed==="Yes");return `<tr><td>${esc(s)}</td><td>${fmt(t)}</td><td>${fmt(v)}</td><td>${(v/t*100).toFixed(1)}%</td></tr>`}).join("")}</table>`;
 fill();assetTable();$("progress").innerHTML=`<p>Survey coverage <b>${total?sv/total*100:0 .toFixed?0:0}%</b> — ${fmt(sv)} dari ${fmt(total)} asset.</p><div class="track" style="height:28px"><div class="fill" style="width:${total?sv/total*100:0}%"></div></div><p class="note">Remaining: ${fmt(total-sv)} asset.</p>`;
}
function fill(){let s=$("siteFilter"),c=$("catFilter");s.innerHTML='<option value="">All Sites</option>'+uniq("Site").map(x=>`<option>${esc(x)}</option>`).join("");c.innerHTML='<option value="">All Categories</option>'+uniq("Category").map(x=>`<option>${esc(x)}</option>`).join("")}
function assetTable(){let s=$("siteFilter").value,c=$("catFilter").value,q=$("q").value.toLowerCase();let a=D.filter(x=>(!s||x.Site===s)&&(!c||x.Category===c)&&(!q||`${x.Tag_No} ${x.Description}`.toLowerCase().includes(q))).slice(0,500);$("assetTable").innerHTML=`<div class="tablewrap"><table class="table"><tr><th>Site</th><th>Tag</th><th>Category</th><th>Description</th><th>Status</th><th>Survey Date</th></tr>${a.map(x=>`<tr><td>${esc(x.Site)}</td><td>${esc(x.Tag_No)}</td><td>${esc(x.Category)}</td><td>${esc(x.Description)}</td><td>${esc(x.Status)}</td><td>${esc(x.Survey_Date)}</td></tr>`).join("")}</table></div><p class="note">Max 500 rows.</p>`}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")});
["siteFilter","catFilter","q"].forEach(id=>$(id).addEventListener("input",assetTable));render();
