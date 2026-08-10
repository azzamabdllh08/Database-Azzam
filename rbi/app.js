const D = window.RBI_DATA || [];
const C = window.RBI_CONFIG || {};

const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString("en-US");
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function uniq(field){return [...new Set(D.map(x=>x[field]).filter(v=>v!==null&&v!==undefined&&v!==""))].sort((a,b)=>String(a).localeCompare(String(b)));}
function num(v){const n=Number(v);return Number.isFinite(n)?n:null;}
function count(fn){return D.filter(fn).length;}
function group(field,fn=()=>true){const r={};D.filter(fn).forEach(x=>{const k=x[field]??"Unknown";r[k]=(r[k]||0)+1});return Object.fromEntries(Object.entries(r).sort((a,b)=>b[1]-a[1]));}
function barHTML(obj){const e=Object.entries(obj);const max=Math.max(...e.map(x=>x[1]),1);return e.slice(0,12).map(([k,v])=>`<div class="bar"><span>${esc(k)}</span><div class="track"><div class="fill" style="width:${v/max*100}%"></div></div><span class="value">${fmt(v)}</span></div>`).join("")||"<p class='note'>No data</p>";}
function riskLabel(x){return x.risk1AP||"Not Assessed";} function criticality(x){return x.criticality1AP||"Not Assessed";}
function render(){
  $("title").textContent=C.title||"RBI DASHBOARD"; $("report").href=C.reportUrl||"#";
  $("total").textContent=fmt(D.length);
  $("unsat").textContent=fmt(count(x=>String(x.criticality1AP).toLowerCase().includes("unsatisfactory")));
  const today=new Date();today.setHours(0,0,0,0);
  const overdue=count(x=>x.inspectionDue&&new Date(x.inspectionDue)<today); $("overdue").textContent=fmt(overdue);
  const rlis=D.map(x=>num(x.rliMonths)).filter(x=>x!==null&&x>=0); $("minRli").textContent=rlis.length?fmt(Math.min(...rlis)):"—";
  $("criticalityChart").innerHTML=barHTML(group("criticality1AP")); $("riskChart").innerHTML=barHTML(group("risk1AP")); $("dmChart").innerHTML=barHTML(group("damageMechanismInternal"));
  const due={Overdue:overdue,"Due <= 6 months":count(x=>x.inspectionDue&&((new Date(x.inspectionDue)-today)/86400000)>=0&&((new Date(x.inspectionDue)-today)/86400000)<=183),"No Due Date":count(x=>!x.inspectionDue)}; $("dueChart").innerHTML=barHTML(due);
  renderRiskMatrix(); $("criticalityList").innerHTML=barHTML(group("criticality1AP")); $("inspectionPriority").innerHTML=barHTML(due);
  const shortest=D.filter(x=>num(x.rliMonths)!==null).sort((a,b)=>num(a.rliMonths)-num(b.rliMonths)).slice(0,10); $("shortRli").innerHTML=shortest.map(x=>`<div class="list-item"><strong>${esc(x.lineNo||x.description)}</strong><span>RLI ${esc(x.rliMonths)} mo · ${esc(riskLabel(x))}</span></div>`).join("")||"<p class='note'>No RLI data</p>";
  $("dmInternal").innerHTML=barHTML(group("damageMechanismInternal")); $("dmExternal").innerHTML=barHTML(group("damageMechanismExternal")); fillFilters();assetTable();$("lastSync").textContent=`${D.length.toLocaleString()} records loaded`;
}
function renderRiskMatrix(){const risks=uniq("risk1AP"),crits=uniq("criticality1AP");let html=`<div class="head">#</div>`;crits.slice(0,5).forEach(c=>html+=`<div class="head">${esc(c)}</div>`);risks.slice(0,12).forEach(r=>{html+=`<div class="head">${esc(r)}</div>`;crits.slice(0,5).forEach(c=>html+=`<div class="cell"><b>${fmt(count(x=>riskLabel(x)===r&&criticality(x)===c))}</b><span>${esc(c)}</span></div>`)});$("riskMatrix").innerHTML=html||"<p class='note'>No risk/criticality data</p>";}
function fillFilters(){$("systemFilter").innerHTML='<option value="">All Systems</option>'+uniq("system").map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");$("riskFilter").innerHTML='<option value="">All Risk 1AP</option>'+uniq("risk1AP").map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");$("critFilter").innerHTML='<option value="">All Criticality</option>'+uniq("criticality1AP").map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");}
function assetTable(){const s=$("systemFilter").value,r=$("riskFilter").value,c=$("critFilter").value,q=$("search").value.toLowerCase();const rows=D.filter(x=>(!s||x.system===s)&&(!r||x.risk1AP===r)&&(!c||x.criticality1AP===c)&&(!q||`${x.lineNo||""} ${x.description||""} ${x.material||""}`.toLowerCase().includes(q))).slice(0,1000);$("assetCount").textContent=`Showing ${rows.length.toLocaleString()} of ${D.length.toLocaleString()} assets`;$("assetRows").innerHTML=rows.map(x=>`<tr><td>${esc(x.lineNo)}</td><td>${esc(x.system)}</td><td>${esc(x.material)}</td><td><span class="risk-chip">${esc(riskLabel(x))}</span></td><td>${esc(criticality(x))}</td><td>${x.rliMonths??"—"}</td><td>${esc(x.inspectionDue||"—")}</td><td>${esc(x.damageMechanismInternal||"—")}</td></tr>`).join("");}
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav button").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")});
["systemFilter","riskFilter","critFilter","search"].forEach(id=>$(id).addEventListener("input",assetTable));$("refresh").onclick=()=>location.reload();render();
