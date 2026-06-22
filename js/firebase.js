// Firebase imports (CDN)

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { 

getFirestore,
collection,
doc,
getDoc,
getDocs,
addDoc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp

}
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {

apiKey: "AIzaSyDrc_BBT97_ujTt5XkdfPEZjaWElWc_uQo",

authDomain: "jay-ganesh-travels-e51e1.firebaseapp.com",

projectId: "jay-ganesh-travels-e51e1",

storageBucket: "jay-ganesh-travels-e51e1.firebasestorage.app",

messagingSenderId: "99422907668",

appId: "1:99422907668:web:8a227d8f846ced980b2601"
};
// Initialize

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Export services
export {
db,
auth,

collection,
doc,
getDoc,
getDocs,
addDoc,
updateDoc,
deleteDoc,
query,
orderBy,
serverTimestamp,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
};

// ======================================
// Authentication helper
// ======================================


export function checkAdmin(callback){
onAuthStateChanged(auth,user=>{
if(user){
callback(user);
}
else{
callback(null);
}
});
}






// ======================================
// Logout helper
// ======================================


export async function logoutAdmin(){


try{


await signOut(auth);


showToast("Logged out");


window.location.href="login.html";


}

catch(error){


console.log(error);


}



}