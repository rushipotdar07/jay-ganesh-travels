// import{
// db,
// doc,
// getDoc
// }from "./firebase.js";


// const details=document.getElementById("details");


// const params=new URLSearchParams(
// window.location.search
// );


// const id=params.get("id");



// async function loadDetails(){


// if(!id){

// details.innerHTML=
// "<p>Package not found</p>";

// return;

// }



// try{


// const snap=await getDoc(
// doc(db,"packages",id)
// );



// if(!snap.exists()){

// details.innerHTML=
// "<p>Package unavailable</p>";

// return;

// }



// const p=snap.data();



// const images=p.imageUrls || [];



// let gallery="";


// images.forEach(img=>{

// gallery+=`

// <img 
// src="${img}"
// style="
// width:100%;
// height:250px;
// object-fit:cover;
// border-radius:8px;
// ">

// `;

// });



// details.innerHTML=`

// <div class="tour-card">


// <div style="
// display:grid;
// grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
// gap:15px;
// margin-bottom:30px;
// ">

// ${gallery}

// </div>



// <div class="tour-body">


// <h1 class="section-h2">

// ${p.title}

// </h1>



// <p class="section-sub">

// ${p.description || ""}

// </p>



// <div class="tour-meta-row">


// <span class="chip">

// ${p.duration}

// </span>


// <span class="chip">

// ${p.busType}

// </span>


// <span class="chip">

// ${p.busSeats} Seats

// </span>


// </div>




// <h2>

// ₹${p.price}

// </h2>



// <br>



// <h3>
// Itinerary
// </h3>


// <p>

// ${p.itinerary || "Not added"}

// </p>



// <br>


// <a 
// class="btn-fill"
// href="booking.html?package=${id}">

// Book Now

// </a>



// </div>


// </div>

// `;



// }catch(error){

// console.log(error);

// details.innerHTML=
// "<p>Error loading package</p>";

// }


// }


// loadDetails();

import{
db,
doc,
getDoc
}from "./firebase.js";

const details=document.getElementById("details");

const params=new URLSearchParams(
window.location.search
);

const id=params.get("id");


async function loadDetails(){

if(!id){
details.innerHTML="<p>Package not found</p>";
return;
}

try{

const snap=await getDoc(
doc(db,"packages",id)
);


if(!snap.exists()){

details.innerHTML="<p>Package unavailable</p>";
return;

}


const p=snap.data();


let gallery="";


(p.imageUrls || []).forEach(img=>{

gallery+=`

<img 
class="detail-img"
src="${img}"
>

`;

});



let dates="";


(p.travelDates || []).forEach(d=>{

dates+=`

<div class="date-card">

📅 ${d.start} 
<br>
to
<br>
${d.end}

</div>

`;

});



let itinerary="";


(p.itinerary || []).forEach((day,index)=>{


if(typeof day === "object"){


// itinerary+=`

// <div class="itinerary-card">

// <h3>
// ${day.day}
// </h3>

// <p>
// ${day.details}
// </p>

// </div>

// `;

// }
// else{


// itinerary+=`

// <div class="itinerary-card">

// <h3>
// Day ${index+1}
// </h3>

// <p>
// ${day}
// </p>

// </div>

// `;

// }

itinerary+=`

<div class="timeline-item rv">

<div class="timeline-marker">
${index+1}
</div>

<div class="timeline-content">

<h3 class="timeline-day">
${day.day}
</h3>

<p class="timeline-desc">
${day.details}
</p>

</div>

</div>

`;

}
else{


itinerary+=`

<div class="timeline-item rv">

<div class="timeline-marker">
${index+1}
</div>

<div class="timeline-content">

<h3 class="timeline-day">
Day ${index+1}
</h3>

<p class="timeline-desc">
${day}
</p>

</div>

</div>

`;

}


});



details.innerHTML=`

<div class="details-wrapper">


<div class="details-gallery">

${gallery}

</div>



<div class="details-content">


<h1>
${p.title}
</h1>


<p class="description">
${p.description || ""}
</p>



<div class="detail-meta">


<div>
⏱
${p.duration}
</div>


<div>
🚌
${p.busSeats} Seats
</div>


<div>
❄
${p.busType}
</div>


</div>



<h2 class="price">

₹${p.price}

</h2>



<h2>
Travel Dates
</h2>


<div class="dates">

${dates}

</div>



<h2>
Itinerary
</h2>


<div class="timeline">

${itinerary}

</div>



<a 
class="book-btn"
href="booking.html?package=${id}">

Book Now

</a>


</div>


</div>

`;



}catch(error){

console.log(error);

details.innerHTML=
"<p>Error loading package</p>";

}


}


loadDetails();