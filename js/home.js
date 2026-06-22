// ======================================
// Home Page Dynamic Data
// ======================================


import {

    db,
    collection,
    getDocs,
    query,
    orderBy

}

    from "./firebase.js";





// ======================================
// Load Packages
// ======================================


async function loadPackages() {


    const container =
        document.getElementById("packagesContainer");



    try {


        container.innerHTML =
            `
<div class="loading">
Loading Packages...
</div>
`;



        const q =
            query(
                collection(db, "packages"),
                orderBy("createdAt", "desc")
            );



        const snapshot =
            await getDocs(q);



        container.innerHTML = "";



        if (snapshot.empty) {


            container.innerHTML =
                `
<p>
No packages available.
</p>
`;

            return;


        }





        snapshot.forEach(doc => {


            const data = doc.data();



            const image =
                data.imageUrls?.[0]
                ||
                "https://images.unsplash.com/photo-1609920658906-8223bd289001";



            container.innerHTML +=
                `

<div class="tour-card rv">

<div class="tour-thumb-wrap">

<img 
class="tour-thumb"
src="${image}"
loading="lazy">

<span class="tour-ribbon">Popular</span>

<span class="tour-type-pill">
${data.duration || "Tour"}
</span>

</div>

<div class="tour-body">

<div class="tour-eyebrow">
Curated Journey
</div>

<div class="tour-title">
${data.title || "Travel Package"}
</div>

<div class="tour-stops">
${data.description || ""}
</div>

<div class="tour-meta-row">
<span class="chip">${data.busType || "AC / Non AC"}</span>
<span class="chip">${data.busSeats || ""} Seats</span>
</div>

<div class="tour-footer">

<div class="tour-price-block">
<span class="tour-price-label">Starting from</span>
<span class="tour-price">₹${data.price || "0"}</span>
</div>

<div class="tour-actions">
<a class="tour-link" href="package-details.html?id=${doc.id}">तपशील पाहा →</a>
<a class="tour-cta" href="booking.html?id=${doc.id}">बुक करा</a>
</div>

</div>

</div>

</div>

`;



        });



        if (window.observeRevealCards) {
            window.observeRevealCards();
        }




    }

    catch (error) {


        console.log(error);


        container.innerHTML =
            `
<p>
Unable to load packages.
</p>
`;

    }
}


// ======================================
// Load Testimonials
// ======================================


async function loadTestimonials() {


    const container =
        document.getElementById("testimonialContainer");



    try {


        const q =
            query(
                collection(db, "testimonials"),
                orderBy("createdAt", "desc")
            );



        const snapshot =
            await getDocs(q);



        container.innerHTML = "";



        snapshot.forEach(doc => {


            const t =
                doc.data();



            container.innerHTML +=
                `

<div class="testi-card">


<div class="testi-stars">

${"★".repeat(t.rating || 5)}

</div>




<div class="testi-text">

"${t.review}"

</div>




<div class="testi-author">


<div class="testi-av">

${t.customerName?.charAt(0)}

</div>


<div>


<div class="testi-name">

${t.customerName}

</div>


</div>


</div>


</div>

`;

        });



        if (snapshot.empty) {

            container.innerHTML =
                `
<p>No reviews yet</p>
`;

        }

    }
    catch (e) {

        console.log(e);

    }



}

// ======================================
// Gallery
// ======================================


async function loadGallery() {


    const container =
        document.getElementById("galleryContainer");



    try {


        const snapshot =
            await getDocs(
                collection(db, "gallery")
            );



        container.innerHTML = "";



        snapshot.forEach(doc => {


            const item =
                doc.data();



            container.innerHTML +=
                `

<div class="tour-card">


<img

class="tour-thumb"

src="${item.imageUrl}"

loading="lazy"


>



</div>


`;



        });



        if (snapshot.empty) {

            container.innerHTML =
                `
<p>No images uploaded</p>
`;

        }



    }

    catch (e) {

        console.log(e);

    }

}
// ======================================
// Init
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        loadPackages();

        loadTestimonials();

        loadGallery();


    });