import {
    db,
    doc,
    getDoc
} from "./firebase.js";

const details = document.getElementById("details");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadDetails() {

    if (!id) {
        details.innerHTML = "<p>Package not found</p>";
        return;
    }

    try {

        const snap = await getDoc(doc(db, "packages", id));

        if (!snap.exists()) {
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
                📅 ${d.start}<br>to<br>${d.end}
            </div>`;
        });

        // Price tiers
        const tiers = p.priceTiers && p.priceTiers.length
            ? p.priceTiers
            : [{ label: "Standard", price: Number(p.price) || 0 }];

        let tiersHtml = tiers.map((t, i) => `
    <label class="tier-option ${i === 0 ? "selected" : ""}">
        <input
            type="radio"
            name="priceTier"
            value="${i}"
            data-label="${t.label}"
            data-price="${t.price}"
            ${i === 0 ? "checked" : ""}
        >
        <div class="tier-option-body">
            <div class="tier-option-left">
                <div class="tier-label">${t.label}</div>
                ${t.description ? `
                <ul class="tier-includes">
                    ${t.description.split(",").map(item =>
            `<li>✓ ${item.trim()}</li>`
        ).join("")}
                </ul>` : ""}
            </div>
            <div class="tier-price">₹${t.price}</div>
        </div>
    </label>
`).join("");

        // Itinerary
        let itinerary = "";
        (p.itinerary || []).forEach((day, index) => {

            let dayTitle = "";
            let dayDesc = "";

            if (typeof day === "object") {
                dayTitle = day.day || `Day ${index + 1}`;
                dayDesc = day.details || "";
            } else {
                const lines = day.split("\n");
                const firstLine = lines[0].trim();
                if (firstLine.toLowerCase().startsWith("day")) {
                    dayTitle = firstLine;
                    dayDesc = lines.slice(1).join("<br>").trim();
                } else {
                    dayTitle = `Day ${index + 1}`;
                    dayDesc = lines.join("<br>").trim();
                }
            }

            itinerary += `
            <div class="timeline-item rv">
                <div class="timeline-marker">${index + 1}</div>
                <div class="timeline-content">
                    <h3 class="timeline-day">${dayTitle}</h3>
                    <p class="timeline-desc">${dayDesc}</p>
                </div>
            </div>`;
        });

        details.innerHTML = `
        <div class="details-wrapper">

            <div class="details-gallery">${gallery}</div>

            <div class="details-content">

                <h1>${p.title}</h1>
                <p class="description">${p.description || ""}</p>

                <div class="detail-meta">
                    <div>⏱ ${p.duration}</div>
                    <div>🚌 ${p.busSeats} Seats</div>
                    <div>❄ ${p.busType}</div>
                </div>

                <h2>Travel Dates</h2>
                <div class="dates">${dates}</div>

                <h2>Select Package Type</h2>
                <div class="tier-list" id="tierList">
                    ${tiersHtml}
                </div>

                <h2>Itinerary</h2>
                <div class="timeline">${itinerary}</div>

                <a class="book-btn" id="bookBtn" href="booking.html?id=${id}&tier=0">
                    Book Now — ₹${tiers[0].price}
                </a>

            </div>
        </div>`;

        // update book button when tier changes
        document.querySelectorAll('input[name="priceTier"]').forEach(radio => {
            radio.addEventListener("change", () => {

                const price = radio.dataset.price;
                const tierIndex = radio.value;

                document.getElementById("bookBtn").href =
                    `booking.html?id=${id}&tier=${tierIndex}`;
                document.getElementById("bookBtn").textContent =
                    `Book Now — ₹${price}`;

                document.querySelectorAll(".tier-option").forEach(el => {
                    el.classList.remove("selected");
                });
                radio.closest(".tier-option").classList.add("selected");
            });
        });

    } catch (error) {
        console.log(error);
        details.innerHTML = "<p>Error loading package</p>";
    }
}

loadDetails();