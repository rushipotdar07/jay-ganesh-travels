// import{
// db,
// auth,
// collection,
// addDoc,
// getDocs,
// deleteDoc,
// doc,
// serverTimestamp,
// query,
// orderBy,
// onAuthStateChanged
// }from "././js/firebase.js";


// const form=
// document.getElementById("testimonialForm");


// const list=
// document.getElementById("testimonialList");



// onAuthStateChanged(
// auth,
// user=>{

// if(!user){

// location.href="login.html";

// }

// });





// async function loadTestimonials(){


// const q=
// query(
// collection(db,"testimonials"),
// orderBy("createdAt","desc")
// );



// const snap=
// await getDocs(q);



// list.innerHTML="";



// snap.forEach(item=>{


// const t=item.data();


// list.innerHTML+=`

// <div class="stat-card">


// <h3>
// ${t.customerName}
// </h3>
// <p>
// ${"★".repeat(t.rating)}
// </p>
// <p>
// ${t.review}
// </p>
// <button onclick="deleteReview('${item.id}')">Delete</button>
// </div>

// `;

// });
// }
// form.addEventListener(
// "submit",
// async(e)=>{
// e.preventDefault();
// await addDoc(
// collection(db,"testimonials"),
// {
// customerName:
// document.getElementById("customerName").value,

// review:
// document.getElementById("review").value,

// rating:
// Number(
// document.getElementById("rating").value
// ),
// createdAt:
// serverTimestamp()
// });

// alert(
// "Review Added"
// );
// form.reset();
// loadTestimonials();
// });
// window.deleteReview=
// async(id)=>{
// await deleteDoc(
// doc(db,"testimonials",id)
// );
// loadTestimonials();
// };
// loadTestimonials();






//admin/testimonials.js
import{
db,
auth,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp,
query,
orderBy,
onAuthStateChanged
}from "././js/firebase.js";


const form=
document.getElementById("testimonialForm");


const list=
document.getElementById("testimonialList");



onAuthStateChanged(
auth,
user=>{

if(!user){

location.href="login.html";

}

});



async function loadTestimonials(){


const q=
query(
collection(db,"testimonials"),
orderBy("createdAt","desc")
);



const snap=
await getDocs(q);



if(snap.empty){
list.innerHTML="<p class='empty-text'>No testimonials yet</p>";
return;
}



list.innerHTML="";



snap.forEach(item=>{


const t=item.data();


list.innerHTML+=`

<div class="info-card">
<h3>${t.customerName}</h3>
<div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
<p class="msg">${t.review}</p>
<button class="card-delete" onclick="deleteReview('${item.id}')">Delete</button>
</div>

`;

});
}

form.addEventListener(
"submit",
async(e)=>{
e.preventDefault();

const btn = form.querySelector("button");
btn.disabled = true;
btn.textContent = "Adding...";

try{
await addDoc(
collection(db,"testimonials"),
{
customerName:
document.getElementById("customerName").value,

review:
document.getElementById("review").value,

rating:
Number(
document.getElementById("rating").value
),
createdAt:
serverTimestamp()
});

alert(
"Review Added"
);
form.reset();
loadTestimonials();
}
catch(err){
console.log(err);
alert("Failed to add review");
}

btn.disabled = false;
btn.textContent = "Add Review";
});

window.deleteReview=
async(id)=>{
if(!confirm("Delete this testimonial?")) return;
await deleteDoc(
doc(db,"testimonials",id)
);
loadTestimonials();
};

loadTestimonials();