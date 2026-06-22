// import {
//     db,
//     auth,
//     collection,
//     addDoc,
//     getDocs,
//     deleteDoc,
//     doc,
//     serverTimestamp,
//     onAuthStateChanged
// } from "././js/firebase.js";


// onAuthStateChanged(
//     auth,
//     (user) => {

//         if (!user) {

//             location.href = "login.html";

//         }

//     });
// const form =
//     document.getElementById("packageForm");
// const list = document.getElementById("packageList");

// const CLOUD_NAME = "dmn0yo5mo";

// const UPLOAD_PRESET = "Jay_ganesh_travels";

// async function uploadImage(file) {
//     const data = new FormData();
//     data.append(
//         "file",
//         file
//     );
//     data.append(
//         "upload_preset",
//         UPLOAD_PRESET
//     );

//     const res =
//         await fetch(
//             `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//             {
//                 method: "POST",
//                 body: data
//             }
//         );

//     const result =
//         await res.json();

//     return result.secure_url;
// }

// async function loadPackages() {

//     const snap =
//         await getDocs(
//             collection(db, "packages")
//         );


//     list.innerHTML = "";


//     snap.forEach(item => {


//         const p =
//             item.data();


//         list.innerHTML += `

// <div class="stat-card">

// <h3>
// ${p.title}
// </h3>


// <p>
// ₹${p.price}
// </p>


// <p>
// Booking: ₹${p.bookingAmount || 0}
// </p>


// <button onclick="deletePackage('${item.id}')">
// Delete
// </button>


// </div>

// `;

//     });


// }


// window.deletePackage = async (id) => {
//     await deleteDoc(
//         doc(db, "packages", id)
//     );
//     loadPackages();
// };

// document
//     .getElementById("addDate")
//     .onclick = () => {


//         const div =
//             document.createElement("div");


//         div.innerHTML = `

// <input type="date" class="startDate">

// <input type="date" class="endDate">

// `;


//         document
//             .getElementById("dateContainer")
//             .appendChild(div);

//     };

// let saving = false;

// form.addEventListener(
//     "submit",
//     async (e) => {

//         e.preventDefault();

//         if (saving) {
//             return;
//         }

//         saving = true;

//         const btn = form.querySelector("button");

//         btn.disabled = true;
//         btn.innerHTML = "Saving...";


//         try {

//             const files = document.getElementById("images").files;

//             let urls = [];


//             for (let file of files) {

//                 const url =
//                     await uploadImage(file);

//                 urls.push(url);

//             }


//             const packageData = {

//                 title:
//                     document.getElementById("title").value,


//                 description:
//                     document.getElementById("description").value,


//                 duration:
//                     document.getElementById("duration").value,


//                 price:
//                     document.getElementById("price").value,

//                 bookingAmount:
//                     document.getElementById("bookingAmount").value,


//                 itinerary:
//                     document.getElementById("itinerary")
//                         .value
//                         .split("\n")
//                         .filter(item => item.trim() != ""),

//                 travelDates:
//                     Array.from(
//                         document.querySelectorAll(".startDate")
//                     )
//                         .map((item, index) => ({

//                             start: item.value,

//                             end:
//                                 document.querySelectorAll(".endDate")[index].value

//                         })),

//                 busSeats:
//                     document.getElementById("busSeats").value,


//                 busType:
//                     document.getElementById("busType").value,


//                 imageUrls:
//                     urls,


//                 createdAt:
//                     serverTimestamp()

//             };



//             await addDoc(
//                 collection(db, "packages"),
//                 packageData
//             );


//             alert("Package Added");


//             form.reset();


//             loadPackages();


//         }
//         catch (error) {

//             console.log(error);

//             alert("Package Failed");

//         }


//         saving = false;

//         btn.disabled = false;

//         btn.innerHTML = "Save Package";

//     }
// );




// loadPackages();


import {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp,
    onAuthStateChanged
} from "././js/firebase.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "login.html";
    }
});

const form = document.getElementById("packageForm");
const list = document.getElementById("packageList");
const overlay = document.getElementById("formOverlay");
const modalTitle = document.getElementById("modalTitle");

const CLOUD_NAME = "dmn0yo5mo";
const UPLOAD_PRESET = "Jay_ganesh_travels";

let editId = null; // null = adding new, otherwise editing this package id

async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
}

function openModal(title = "Add Package") {
    modalTitle.textContent = title;
    overlay.classList.add("open");
}

function closeModal() {
    overlay.classList.remove("open");
    form.reset();
    // reset date rows back to just one
    const dateContainer = document.getElementById("dateContainer");
    dateContainer.innerHTML = `
        <div class="date-row">
            <input type="date" class="startDate">
            <span class="arrow">→</span>
            <input type="date" class="endDate">
        </div>
    `;
    editId = null;
}

document.getElementById("openAdd").onclick = () => {
    openModal("Add Package");
};

document.getElementById("closeForm").onclick = closeModal;

overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
};

async function loadPackages() {

    const snap = await getDocs(collection(db, "packages"));

    if (snap.empty) {
        list.innerHTML = `<p class="empty-text">No packages yet. Click "+ Add Package" to create one.</p>`;
        return;
    }

    list.innerHTML = "";

    snap.forEach(item => {

        const p = item.data();
        const id = item.id;
        const thumb = p.imageUrls && p.imageUrls.length
            ? `<img class="pkg-thumb" src="${p.imageUrls[0]}" alt="${p.title}">`
            : `<div class="pkg-thumb placeholder">No Image</div>`;

        list.innerHTML += `
            <div class="pkg-card">
                ${thumb}
                <div class="pkg-body">
                    <h3>${p.title}</h3>
                    <div class="pkg-meta">
                        <span>${p.duration || ""}</span>
                        <span>${p.busType || ""}</span>
                        <span>${p.busSeats ? p.busSeats + " seats" : ""}</span>
                    </div>
                    <p class="pkg-price">₹${p.price || 0}</p>
                    <p class="pkg-booking">Booking amount: ₹${p.bookingAmount || 0}</p>
                </div>
                <div class="pkg-actions">
                    <button class="btn-update" onclick="editPackage('${id}')">Update</button>
                    <button class="btn-delete" onclick="deletePackage('${id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

window.deletePackage = async (id) => {
    if (!confirm("Delete this package?")) return;
    await deleteDoc(doc(db, "packages", id));
    loadPackages();
};

window.editPackage = async (id) => {

    const snap = await getDocs(collection(db, "packages"));
    const target = snap.docs.find(d => d.id === id);
    if (!target) return;

    const p = target.data();
    editId = id;

    document.getElementById("title").value = p.title || "";
    document.getElementById("description").value = p.description || "";
    document.getElementById("duration").value = p.duration || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("bookingAmount").value = p.bookingAmount || "";
    document.getElementById("itinerary").value = (p.itinerary || []).join("\n");
    document.getElementById("busSeats").value = p.busSeats || "";
    document.getElementById("busType").value = p.busType || "AC";

    const dateContainer = document.getElementById("dateContainer");
    dateContainer.innerHTML = "";

    const dates = p.travelDates && p.travelDates.length
        ? p.travelDates
        : [{ start: "", end: "" }];

    dates.forEach(d => {
        const row = document.createElement("div");
        row.className = "date-row";
        row.innerHTML = `
            <input type="date" class="startDate" value="${d.start || ""}">
            <span class="arrow">→</span>
            <input type="date" class="endDate" value="${d.end || ""}">
        `;
        dateContainer.appendChild(row);
    });

    openModal("Update Package");
};

document.getElementById("addDate").onclick = () => {
    const row = document.createElement("div");
    row.className = "date-row";
    row.innerHTML = `
        <input type="date" class="startDate">
        <span class="arrow">→</span>
        <input type="date" class="endDate">
    `;
    document.getElementById("dateContainer").appendChild(row);
};

let saving = false;

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (saving) return;
    saving = true;

    const btn = form.querySelector(".submit-btn");
    btn.disabled = true;
    btn.innerHTML = editId ? "Updating..." : "Saving...";

    try {

        const files = document.getElementById("images").files;
        let urls = [];

        for (let file of files) {
            const url = await uploadImage(file);
            urls.push(url);
        }

        const packageData = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            duration: document.getElementById("duration").value,
            price: document.getElementById("price").value,
            bookingAmount: document.getElementById("bookingAmount").value,

            itinerary: document.getElementById("itinerary")
                .value
                .split("\n")
                .filter(item => item.trim() != ""),

            travelDates: Array.from(document.querySelectorAll(".startDate"))
                .map((item, index) => ({
                    start: item.value,
                    end: document.querySelectorAll(".endDate")[index].value
                })),

            busSeats: document.getElementById("busSeats").value,
            busType: document.getElementById("busType").value,
        };

        // only overwrite images if new ones were chosen, otherwise keep existing
        if (urls.length) {
            packageData.imageUrls = urls;
        }

        if (editId) {
            await updateDoc(doc(db, "packages", editId), packageData);
            alert("Package Updated");
        } else {
            packageData.imageUrls = urls;
            packageData.createdAt = serverTimestamp();
            await addDoc(collection(db, "packages"), packageData);
            alert("Package Added");
        }

        closeModal();
        loadPackages();

    }
    catch (error) {
        console.log(error);
        alert("Package Failed");
    }

    saving = false;
    btn.disabled = false;
    btn.innerHTML = editId ? "Update Package" : "Save Package";
});

loadPackages();