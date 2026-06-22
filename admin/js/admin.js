import{
db,
auth,
collection,
getDocs,
signOut,
onAuthStateChanged
}from "../../js/firebase.js";
onAuthStateChanged(
auth,
(user)=>{

if(!user){
window.location.href="login.html";
}
});
async function countData(name,id){
const snap=
await getDocs(
collection(db,name)
);
document.getElementById(id)
.innerHTML=snap.size;
}
countData(
"packages",
"totalPackages"
);
countData(
"bookings",
"totalBookings"
);
countData(
"enquiries",
"totalEnquiries"
);
countData(
"testimonials",
"totalTestimonials"
);
document
.getElementById("logout")
.onclick=async()=>{
await signOut(auth);
window.location.href="login.html";
};