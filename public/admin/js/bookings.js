// // neww
// import{
// db,
// auth,
// collection,
// getDocs,
// doc,
// updateDoc,
// query,
// orderBy,
// onAuthStateChanged
// }from "../../js/firebase.js";


// const list = document.getElementById("bookingList");
// const search = document.getElementById("searchBooking");

// const screenshotOverlay = document.getElementById("screenshotOverlay");
// const screenshotImg = document.getElementById("screenshotImg");
// const closeScreenshot = document.getElementById("closeScreenshot");

// let bookings = [];
// let packagesMap = {}; // id -> { title, price }

// onAuthStateChanged(auth, user => {
//     if (!user) {
//         location.href = "login.html";
//     }
// });

// // ---------- Screenshot lightbox ----------

// function openScreenshot(url) {
//     screenshotImg.src = url;
//     screenshotOverlay.classList.add("open");
// }

// function closeScreenshotModal() {
//     screenshotOverlay.classList.remove("open");
//     screenshotImg.src = "";
// }

// closeScreenshot.onclick = closeScreenshotModal;

// screenshotOverlay.onclick = (e) => {
//     if (e.target === screenshotOverlay) {
//         closeScreenshotModal();
//     }
// };

// // ---------- Data loading ----------

// async function loadPackages() {
//     const snap = await getDocs(collection(db, "packages"));
//     packagesMap = {};
//     snap.forEach(item => {
//         const p = item.data();
//         packagesMap[item.id] = {
//             title: p.title,
//             price: Number(p.price) || 0
//         };
//     });
// }

// async function loadBookings() {

//     const q = query(
//         collection(db, "bookings"),
//         orderBy("createdAt", "desc")
//     );

//     const snap = await getDocs(q);

//     bookings = [];
//     snap.forEach(item => {
//         bookings.push({
//             id: item.id,
//             ...item.data()
//         });
//     });

//     render(bookings);
// }

// // ---------- Grouping & calculations ----------

// function groupByPackage(data) {

//     const groups = {};

//     data.forEach(b => {
//         // group by packageId if present, otherwise fall back to title
//         const key = b.packageId || b.packageTitle || "unknown";

//         if (!groups[key]) {
//             groups[key] = {
//                 title: b.packageTitle || "Unknown Package",
//                 pricePerSeat: packagesMap[b.packageId]?.price || 0,
//                 bookings: []
//             };
//         }

//         groups[key].bookings.push(b);
//     });

//     return groups;
// }

// function calcRemaining(b, pricePerSeat) {
//     const passengers = Number(b.passengers) || 0;
//     const paid = Number(b.bookingAmount) || 0;
//     const total = passengers * pricePerSeat;
//     const remaining = total - paid;
//     return { total, paid, remaining };
// }

// // ---------- Rendering ----------

// function render(data) {

//     list.innerHTML = "";

//     if (data.length === 0) {
//         list.innerHTML = "<p class='empty-text'>No bookings found</p>";
//         return;
//     }

//     const groups = groupByPackage(data);

//     Object.entries(groups).forEach(([key, group]) => {

//         const pricePerSeat = group.pricePerSeat;

//         let totalPassengers = 0;
//         let totalCollected = 0;
//         let totalExpected = 0;

//         const rowsHtml = group.bookings.map(b => {

//             const { total, paid, remaining } = calcRemaining(b, pricePerSeat);

//             totalPassengers += Number(b.passengers) || 0;
//             totalCollected += paid;
//             totalExpected += total;

//             const remainingClass = remaining <= 0 ? "cleared" : "pending";
//             const status = b.status || "Pending";

//             const screenshotHtml = b.paymentScreenshot
//                 ? `<button type="button" class="b-screenshot-mini view-screenshot" data-img="${b.paymentScreenshot}">View Payment Screenshot</button>`
//                 : `<span class="no-screenshot">No screenshot uploaded</span>`;

//             return `
//             <div class="booking-row" data-id="${b.id}">

//                 <div class="b-name" data-label="Customer">
//                     <strong>${b.customerName || ""}</strong>
//                     <span>${b.phone || ""} · ${b.travelDate || ""}</span>
//                     ${screenshotHtml}
//                 </div>

//                 <div data-label="Passengers">
//                     <input type="number" min="0" class="mini-input passengers-input" value="${b.passengers || 0}">
//                 </div>

//                 <div data-label="Amount Paid">
//                     <input type="number" min="0" class="mini-input paid-input" value="${paid}">
//                 </div>

//                 <div data-label="Total Due">
//                     <span class="total-amt">₹${total.toFixed(0)}</span>
//                 </div>

//                 <div data-label="Remaining">
//                     <span class="remaining-amt ${remainingClass}">₹${remaining.toFixed(0)}</span>
//                 </div>

//                 <div class="row-actions" data-label="Status">
//                     <select class="status-select small">
//                         <option ${status=="Pending"?"selected":""}>Pending</option>
//                         <option ${status=="Confirmed"?"selected":""}>Confirmed</option>
//                         <option ${status=="Completed"?"selected":""}>Completed</option>
//                         <option ${status=="Cancelled"?"selected":""}>Cancelled</option>
//                     </select>
//                     <button class="save-row">Save</button>
//                 </div>

//             </div>`;
//         }).join("");

//         list.innerHTML += `
//         <div class="pkg-group">

//             <div class="pkg-group-head">
//                 <h2>${group.title}</h2>
//                 <div class="pkg-group-stats">
//                     <div><b>${group.bookings.length}</b>Bookings</div>
//                     <div><b>${totalPassengers}</b>Passengers</div>
//                     <div><b>₹${totalCollected.toFixed(0)}</b>Collected</div>
//                     <div><b>₹${(totalExpected - totalCollected).toFixed(0)}</b>Remaining</div>
//                 </div>
//             </div>

//             <div class="pkg-group-body">
//                 <div class="booking-row header-row">
//                     <div>Customer</div>
//                     <div>Passengers</div>
//                     <div>Amount Paid</div>
//                     <div>Total Due</div>
//                     <div>Remaining</div>
//                     <div>Status</div>
//                 </div>
//                 ${rowsHtml}
//             </div>

//         </div>`;
//     });

//     attachRowListeners();
// }

// // ---------- Row interactivity (edit, save, screenshot view) ----------

// function attachRowListeners() {

//     document.querySelectorAll(".booking-row[data-id]").forEach(row => {

//         const id = row.dataset.id;
//         const booking = bookings.find(b => b.id === id);
//         const pricePerSeat = packagesMap[booking.packageId]?.price || 0;

//         const passengersInput = row.querySelector(".passengers-input");
//         const paidInput = row.querySelector(".paid-input");
//         const totalAmt = row.querySelector(".total-amt");
//         const remainingAmt = row.querySelector(".remaining-amt");
//         const statusSelect = row.querySelector(".status-select");
//         const saveBtn = row.querySelector(".save-row");
//         const viewBtn = row.querySelector(".view-screenshot");

//         function recalc() {
//             const passengers = Number(passengersInput.value) || 0;
//             const paid = Number(paidInput.value) || 0;
//             const total = passengers * pricePerSeat;
//             const remaining = total - paid;

//             totalAmt.textContent = `₹${total.toFixed(0)}`;
//             remainingAmt.textContent = `₹${remaining.toFixed(0)}`;
//             remainingAmt.className = `remaining-amt ${remaining <= 0 ? "cleared" : "pending"}`;
//         }

//         passengersInput.addEventListener("input", recalc);
//         paidInput.addEventListener("input", recalc);

//         saveBtn.addEventListener("click", async () => {

//             saveBtn.disabled = true;
//             saveBtn.textContent = "Saving...";

//             try {
//                 await updateDoc(doc(db, "bookings", id), {
//                     passengers: Number(passengersInput.value) || 0,
//                     bookingAmount: Number(paidInput.value) || 0,
//                     status: statusSelect.value
//                 });

//                 await loadBookings();
//             }
//             catch (err) {
//                 console.log(err);
//                 alert("Update failed");
//                 saveBtn.disabled = false;
//                 saveBtn.textContent = "Save";
//             }
//         });

//         if (viewBtn) {
//             viewBtn.addEventListener("click", () => {
//                 openScreenshot(viewBtn.dataset.img);
//             });
//         }
//     });
// }

// // ---------- Search ----------

// search.addEventListener("input", () => {

//     const value = search.value.toLowerCase();

//     const filtered = bookings.filter(b =>
//         b.customerName?.toLowerCase().includes(value) ||
//         b.phone?.includes(value) ||
//         b.packageTitle?.toLowerCase().includes(value)
//     );

//     render(filtered);
// });

// // ---------- Init ----------

// async function init() {
//     await loadPackages();
//     await loadBookings();
// }

// init();



import{
db,
auth,
collection,
getDocs,
deleteDoc,
doc,
updateDoc,
query,
orderBy,
onAuthStateChanged
}from "../../js/firebase.js";


const list = document.getElementById("bookingList");
const search = document.getElementById("searchBooking");

const screenshotOverlay = document.getElementById("screenshotOverlay");
const screenshotImg = document.getElementById("screenshotImg");
const closeScreenshot = document.getElementById("closeScreenshot");

let bookings = [];
let packagesMap = {}; // id -> { title, price }

onAuthStateChanged(auth, user => {
    if (!user) {
        location.href = "login.html";
    }
});

// ---------- Screenshot lightbox ----------

function openScreenshot(url) {
    screenshotImg.src = url;
    screenshotOverlay.classList.add("open");
}

function closeScreenshotModal() {
    screenshotOverlay.classList.remove("open");
    screenshotImg.src = "";
}

closeScreenshot.onclick = closeScreenshotModal;

screenshotOverlay.onclick = (e) => {
    if (e.target === screenshotOverlay) {
        closeScreenshotModal();
    }
};

// ---------- Data loading ----------

async function loadPackages() {
    const snap = await getDocs(collection(db, "packages"));
    packagesMap = {};
    snap.forEach(item => {
        const p = item.data();
        packagesMap[item.id] = {
            title: p.title,
            price: Number(p.price) || 0
        };
    });
}

async function loadBookings() {

    const q = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    bookings = [];
    snap.forEach(item => {
        bookings.push({
            id: item.id,
            ...item.data()
        });
    });

    render(bookings);
}

// ---------- Grouping & calculations ----------

function groupByPackage(data) {

    const groups = {};

    data.forEach(b => {
        const key = b.packageId || b.packageTitle || "unknown";

        if (!groups[key]) {
            groups[key] = {
                title: b.packageTitle || "Unknown Package",
                pricePerSeat: packagesMap[b.packageId]?.price || 0,
                bookings: []
            };
        }

        groups[key].bookings.push(b);
    });

    return groups;
}

function calcRemaining(b, pricePerSeat) {
    const passengers = Number(b.passengers) || 0;
    const paid = Number(b.bookingAmount) || 0;
    const total = passengers * pricePerSeat;
    const remaining = total - paid;
    return { total, paid, remaining };
}

// ---------- Rendering ----------

function render(data) {

    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "<p class='empty-text'>No bookings found</p>";
        return;
    }

    const groups = groupByPackage(data);

    Object.entries(groups).forEach(([key, group]) => {

        const pricePerSeat = group.pricePerSeat;

        let totalPassengers = 0;
        let totalCollected = 0;
        let totalExpected = 0;

        const rowsHtml = group.bookings.map(b => {

            const { total, paid, remaining } = calcRemaining(b, pricePerSeat);

            totalPassengers += Number(b.passengers) || 0;
            totalCollected += paid;
            totalExpected += total;

            const remainingClass = remaining <= 0 ? "cleared" : "pending";
            const status = b.status || "Pending";

            const screenshotHtml = b.paymentScreenshot
                ? `<button type="button" class="b-screenshot-mini view-screenshot" data-img="${b.paymentScreenshot}">View Payment Screenshot</button>`
                : `<span class="no-screenshot">No screenshot uploaded</span>`;

            const deleteBtnHtml = status === "Cancelled"
                ? `<button class="delete-row">Delete</button>`
                : "";

            return `
            <div class="booking-row" data-id="${b.id}">

                <div class="b-name" data-label="Customer">
                    <strong>${b.customerName || ""}</strong>
                    <span>${b.phone || ""} · ${b.travelDate || ""}</span>
                    ${screenshotHtml}
                </div>

                <div data-label="Passengers">
                    <input type="number" min="0" class="mini-input passengers-input" value="${b.passengers || 0}">
                </div>

                <div data-label="Amount Paid">
                    <input type="number" min="0" class="mini-input paid-input" value="${paid}">
                </div>

                <div data-label="Total Due">
                    <span class="total-amt">₹${total.toFixed(0)}</span>
                </div>

                <div data-label="Remaining">
                    <span class="remaining-amt ${remainingClass}">₹${remaining.toFixed(0)}</span>
                </div>

                <div class="row-actions" data-label="Status">
                    <select class="status-select small">
                        <option ${status=="Pending"?"selected":""}>Pending</option>
                        <option ${status=="Confirmed"?"selected":""}>Confirmed</option>
                        <option ${status=="Completed"?"selected":""}>Completed</option>
                        <option ${status=="Cancelled"?"selected":""}>Cancelled</option>
                    </select>
                    <button class="save-row">Save</button>
                    ${deleteBtnHtml}
                </div>

            </div>`;
        }).join("");

        list.innerHTML += `
        <div class="pkg-group">

            <div class="pkg-group-head">
                <h2>${group.title}</h2>
                <div class="pkg-group-stats">
                    <div><b>${group.bookings.length}</b>Bookings</div>
                    <div><b>${totalPassengers}</b>Passengers</div>
                    <div><b>₹${totalCollected.toFixed(0)}</b>Collected</div>
                    <div><b>₹${(totalExpected - totalCollected).toFixed(0)}</b>Remaining</div>
                </div>
            </div>

            <div class="pkg-group-body">
                <div class="booking-row header-row">
                    <div>Customer</div>
                    <div>Passengers</div>
                    <div>Amount Paid</div>
                    <div>Total Due</div>
                    <div>Remaining</div>
                    <div>Status</div>
                </div>
                ${rowsHtml}
            </div>

        </div>`;
    });

    attachRowListeners();
}

// ---------- Row interactivity (edit, save, delete, screenshot view) ----------

function attachRowListeners() {

    document.querySelectorAll(".booking-row[data-id]").forEach(row => {

        const id = row.dataset.id;
        const booking = bookings.find(b => b.id === id);
        const pricePerSeat = packagesMap[booking.packageId]?.price || 0;

        const passengersInput = row.querySelector(".passengers-input");
        const paidInput = row.querySelector(".paid-input");
        const totalAmt = row.querySelector(".total-amt");
        const remainingAmt = row.querySelector(".remaining-amt");
        const statusSelect = row.querySelector(".status-select");
        const saveBtn = row.querySelector(".save-row");
        const deleteBtn = row.querySelector(".delete-row");
        const viewBtn = row.querySelector(".view-screenshot");

        function recalc() {
            const passengers = Number(passengersInput.value) || 0;
            const paid = Number(paidInput.value) || 0;
            const total = passengers * pricePerSeat;
            const remaining = total - paid;

            totalAmt.textContent = `₹${total.toFixed(0)}`;
            remainingAmt.textContent = `₹${remaining.toFixed(0)}`;
            remainingAmt.className = `remaining-amt ${remaining <= 0 ? "cleared" : "pending"}`;
        }

        passengersInput.addEventListener("input", recalc);
        paidInput.addEventListener("input", recalc);

        saveBtn.addEventListener("click", async () => {

            saveBtn.disabled = true;
            saveBtn.textContent = "Saving...";

            try {
                await updateDoc(doc(db, "bookings", id), {
                    passengers: Number(passengersInput.value) || 0,
                    bookingAmount: Number(paidInput.value) || 0,
                    status: statusSelect.value
                });

                await loadBookings();
            }
            catch (err) {
                console.log(err);
                alert("Update failed");
                saveBtn.disabled = false;
                saveBtn.textContent = "Save";
            }
        });

        if (deleteBtn) {
            deleteBtn.addEventListener("click", async () => {

                if (!confirm(`Permanently delete this booking for ${booking.customerName}? This cannot be undone.`)) {
                    return;
                }

                deleteBtn.disabled = true;
                deleteBtn.textContent = "Deleting...";

                try {
                    await deleteDoc(doc(db, "bookings", id));
                    await loadBookings();
                }
                catch (err) {
                    console.log(err);
                    alert("Delete failed");
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = "Delete";
                }
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener("click", () => {
                openScreenshot(viewBtn.dataset.img);
            });
        }
    });
}

// ---------- Search ----------

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = bookings.filter(b =>
        b.customerName?.toLowerCase().includes(value) ||
        b.phone?.includes(value) ||
        b.packageTitle?.toLowerCase().includes(value)
    );

    render(filtered);
});

// ---------- Init ----------

async function init() {
    await loadPackages();
    await loadBookings();
}

init();