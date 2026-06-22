import{
auth,
signInWithEmailAndPassword,
onAuthStateChanged
}from "././js/firebase.js";
onAuthStateChanged(
auth,
(user)=>{

if(user){
window.location.href=
"dashboard.html";
}
});

const form=
document.getElementById("loginForm");
form.addEventListener(
"submit",
async(e)=>{
e.preventDefault();
const email=
document.getElementById("email")
.value;
const password=
document.getElementById("password")
.value;
try{
await signInWithEmailAndPassword(
auth,
email,
password
);
window.location.href=
"dashboard.html";
}catch(error){
console.log(error.code);
console.log(error.message);
document.getElementById("error")
.innerHTML=error.message;
}
});