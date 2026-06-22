import{
db,
collection,
getDocs,
query,
orderBy
}from "./firebase.js";


const reviewList=
document.getElementById("reviewList");



async function loadReviews(){


try{


const q=query(
collection(db,"testimonials"),
orderBy("createdAt","desc")
);


const snap=
await getDocs(q);



reviewList.innerHTML="";



if(snap.empty){

reviewList.innerHTML=
"<p>No reviews available</p>";

return;

}



snap.forEach(doc=>{


const data=doc.data();



reviewList.innerHTML+=`

<div class="testi-card">


<div class="testi-stars">

${"★".repeat(data.rating || 5)}

</div>



<div class="testi-text">

"${data.review}"

</div>



<div class="testi-author">


<div class="testi-av">

${data.customerName?.charAt(0)}

</div>



<div>


<div class="testi-name">

${data.customerName}

</div>


</div>


</div>


</div>

`;

});


}catch(error){

console.log(error);

reviewList.innerHTML=
"<p>Unable to load reviews</p>";

}


}



loadReviews();