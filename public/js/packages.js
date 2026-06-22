import {
    db,
    collection,
    getDocs,
    query,
    orderBy
} from "./firebase.js";


const list = document.getElementById("packageList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");


let packages = [];


async function loadPackages() {

    try {

        const q = query(
            collection(db, "packages"),
            orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        packages = [];

        snap.forEach(doc => {

            packages.push({
                id: doc.id,
                ...doc.data()
            });

        });


        render(packages);


    } catch (error) {

        console.log(error);

        list.innerHTML = "<p>Unable to load packages</p>";

    }

}



function render(data) {

    list.innerHTML = "";


    if (data.length === 0) {

        list.innerHTML = "<p>No packages found</p>";

        return;

    }


    data.forEach(item => {

        const image =
            item.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1609920658906-8223bd289001";


        list.innerHTML += `

<div class="package-card">

<img 
class="package-img"
src="${image}"
>


<div class="package-content">


<h2>
${item.title || ""}
</h2>


<p>
${item.description || ""}
</p>


<div class="package-info">


<span>
⏱ ${item.duration || ""}
</span>


<span>
🚌 ${item.busSeats || 0} Seats
</span>


<span>
❄ ${item.busType || ""}
</span>


</div>


<h3>
₹ ${item.price || 0}
</h3>

<div class="package-actions-row">

<a href="package-details.html?id=${item.id}" class="tour-link">
View Details →
</a>

<a href="booking.html?id=${item.id}" class="tour-cta">
Book Now
</a>

</div>

</div>

`;

    });


}



function filterData() {

    const text = search.value.toLowerCase();

    const type = filter.value;


    const result = packages.filter(p => {


        const matchText =
            p.title?.toLowerCase()
                .includes(text);


        const matchType =
            !type ||
            p.busType?.includes(type);


        return matchText && matchType;


    });


    render(result);

}



search.addEventListener(
    "input",
    filterData
);


filter.addEventListener(
    "change",
    filterData
);


loadPackages();