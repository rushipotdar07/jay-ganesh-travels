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
// details.innerHTML="<p>Package not found</p>";
// return;
// }

// try{

// const snap=await getDoc(
// doc(db,"packages",id)
// );


// if(!snap.exists()){

// details.innerHTML="<p>Package unavailable</p>";
// return;

// }


// const p=snap.data();


// let gallery="";


// (p.imageUrls || []).forEach(img=>{

// gallery+=`

// <img 
// class="detail-img"
// src="${img}"
// >

// `;

// });



// let dates="";


// (p.travelDates || []).forEach(d=>{

// dates+=`

// <div class="date-card">

// 📅 ${d.start} 
// <br>
// to
// <br>
// ${d.end}

// </div>

// `;

// });



// let itinerary="";


// (p.itinerary || []).forEach((day,index)=>{


// if(typeof day === "object"){


// // itinerary+=`

// // <div class="itinerary-card">

// // <h3>
// // ${day.day}
// // </h3>

// // <p>
// // ${day.details}
// // </p>

// // </div>

// // `;

// // }
// // else{


// // itinerary+=`

// // <div class="itinerary-card">

// // <h3>
// // Day ${index+1}
// // </h3>

// // <p>
// // ${day}
// // </p>

// // </div>

// // `;

// // }

// itinerary+=`

// <div class="timeline-item rv">

// <div class="timeline-marker">
// ${index+1}
// </div>

// <div class="timeline-content">

// <h3 class="timeline-day">
// ${day.day}
// </h3>

// <p class="timeline-desc">
// ${day.details}
// </p>

// </div>

// </div>

// `;

// }
// else{


// itinerary+=`

// <div class="timeline-item rv">

// <div class="timeline-marker">
// ${index+1}
// </div>

// <div class="timeline-content">

// <h3 class="timeline-day">
// Day ${index+1}
// </h3>

// <p class="timeline-desc">
// ${day}
// </p>

// </div>

// </div>

// `;

// }


// });



// details.innerHTML=`

// <div class="details-wrapper">


// <div class="details-gallery">

// ${gallery}

// </div>



// <div class="details-content">


// <h1>
// ${p.title}
// </h1>


// <p class="description">
// ${p.description || ""}
// </p>



// <div class="detail-meta">


// <div>
// ⏱
// ${p.duration}
// </div>


// <div>
// 🚌
// ${p.busSeats} Seats
// </div>


// <div>
// ❄
// ${p.busType}
// </div>


// </div>



// <h2 class="price">

// ₹${p.price}

// </h2>



// <h2>
// Travel Dates
// </h2>


// <div class="dates">

// ${dates}

// </div>



// <h2>
// Itinerary
// </h2>


// <div class="timeline">

// ${itinerary}

// </div>



// <a 
// class="book-btn"
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

const details = document.getElementById("details");

const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");


async function loadDetails(){

    if(!id){
        details.innerHTML = "<p>Package not found</p>";
        return;
    }

    try{

        const snap = await getDoc(
            doc(db, "packages", id)
        );

        if(!snap.exists()){
            details.innerHTML = "<p>Package unavailable</p>";
            return;
        }

        const p = snap.data();

        // Gallery
        let gallery = "";
        (p.imageUrls || []).forEach(img => {
            gallery += `<img class="detail-img" src="${img}">`;
        });

        // Travel dates
        let dates = "";
        (p.travelDates || []).forEach(d => {
            dates += `
            <div class="date-card">
                📅 ${d.start} <br>to<br> ${d.end}
            </div>`;
        });

        // Itinerary
        // Each array item is one full day's text.
        // Single newlines within a day are rendered as <br> so multi-line
        // days display correctly inside their timeline bubble.
        let itinerary = "";

        (p.itinerary || []).forEach((day, index) => {

            let dayTitle = "";
            let dayDesc  = "";

            if(typeof day === "object"){
                // Old format: { day: "Day 1", details: "..." }
                dayTitle = day.day || `Day ${index + 1}`;
                dayDesc  = day.details || "";
            } else {
                // New format: plain string, possibly multi-line
                // First line becomes the bold title if it starts with "Day"
                // otherwise we just label it Day N automatically
                const lines = day.split("\n");
                const firstLine = lines[0].trim();

                if(firstLine.toLowerCase().startsWith("day")){
                    dayTitle = firstLine;
                    dayDesc  = lines.slice(1).join("<br>").trim();
                } else {
                    dayTitle = `Day ${index + 1}`;
                    dayDesc  = lines.join("<br>").trim();
                }
            }

            itinerary += `
            <div class="timeline-item rv">

                <div class="timeline-marker">
                    ${index + 1}
                </div>

                <div class="timeline-content">

                    <h3 class="timeline-day">
                        ${dayTitle}
                    </h3>

                    <p class="timeline-desc">
                        ${dayDesc}
                    </p>

                </div>

            </div>`;
        });

        details.innerHTML = `

        <div class="details-wrapper">

            <div class="details-gallery">
                ${gallery}
            </div>

            <div class="details-content">

                <h1>${p.title}</h1>

                <p class="description">${p.description || ""}</p>

                <div class="detail-meta">
                    <div>⏱ ${p.duration}</div>
                    <div>🚌 ${p.busSeats} Seats</div>
                    <div>❄ ${p.busType}</div>
                </div>

                <h2 class="price">₹${p.price}</h2>

                <h2>Travel Dates</h2>
                <div class="dates">
                    ${dates}
                </div>

                <h2>Itinerary</h2>
                <div class="timeline">
                    ${itinerary}
                </div>

                <a class="book-btn" href="booking.html?id=${id}">
                    Book Now
                </a>

            </div>

        </div>`;

    } catch(error){

        console.log(error);
        details.innerHTML = "<p>Error loading package</p>";

    }

}

loadDetails();