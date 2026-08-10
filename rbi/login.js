const USERNAME="TMG123";const PASSWORD_HASH="dd49477b0b970dde26d58606384cfedd0dc5740b719bffc06442e7d949849deb";
async function sha256(text){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
if(sessionStorage.getItem("rbi_authenticated")==="true")location.replace("index.html");
document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();const u=document.getElementById("username").value.trim(),p=document.getElementById("password").value,h=await sha256(p);if(u===USERNAME&&h===PASSWORD_HASH){sessionStorage.setItem("rbi_authenticated","true");location.replace("index.html")}else document.getElementById("error").style.display="block"});
