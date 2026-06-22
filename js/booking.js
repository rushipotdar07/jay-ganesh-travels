import {
    db,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";

const bookingForm = document.getElementById("bookingForm");
const enquiryForm = document.getElementById("enquiryForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            packageTitle: document.getElementById("packageSelect").value,
            travelDate: document.getElementById("travelDate").value,
            status: "Pending",
            createdAt: serverTimestamp()
        };

        if (!data.customerName || !data.phone || !data.packageTitle) {
            showToast("Please fill required fields");
            return;
        }

        try {

            await addDoc(
                collection(db, "bookings"),
                data
            );

            showToast("Booking submitted successfully");

            bookingForm.reset();

        } catch (error) {

            console.log(error);

            showToast("Booking failed");

        }

    });
}


if (enquiryForm) {

    enquiryForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

            name: document.getElementById("enqName").value.trim(),

            phone: document.getElementById("enqPhone").value.trim(),

            email: document.getElementById("enqEmail").value.trim(),

            message: document.getElementById("enqMessage").value.trim(),

            createdAt: serverTimestamp()

        };


        if (!data.name || !data.phone) {

            showToast("Fill required fields");

            return;

        }


        try {

            await addDoc(
                collection(db, "enquiries"),
                data
            );

            showToast("Enquiry sent successfully");

            enquiryForm.reset();

        } catch (error) {

            console.log(error);

            showToast("Unable to send enquiry");

        }

    });

}