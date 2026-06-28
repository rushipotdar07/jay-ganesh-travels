// import{
// db,
// auth,
// collection,
// getDocs,
// deleteDoc,
// doc,
// query,
// orderBy,
// onAuthStateChanged
// }from "../../js/firebase.js";


// const list=
// document.getElementById("enquiryList");



// onAuthStateChanged(
// auth,
// user=>{

// if(!user){

// location.href="login.html";

// }

// });





// async function loadEnquiries(){


// const q=
// query(
// collection(db,"enquiries"),
// orderBy("createdAt","desc")
// );



// const snap=
// await getDocs(q);


// list.innerHTML="";



// if(snap.empty){

// list.innerHTML=
// "<p>No enquiries</p>";

// return;

// }



// snap.forEach(item=>{


// const e=item.data();



// list.innerHTML+=`

// <div class="stat-card">


// <h3>
// ${e.name}
// </h3>


// <p>
// 📞 ${e.phone}
// </p>


// <p>
// ✉ ${e.email || ""}
// </p>


// <p>
// ${e.message}
// </p>



// <button onclick="deleteEnquiry('${item.id}')">

// Delete

// </button>


// </div>

// `;

// });


// }





// window.deleteEnquiry=
// async(id)=>{


// if(!confirm("Delete enquiry?"))
// return;



// await deleteDoc(
// doc(db,"enquiries",id)
// );



// loadEnquiries();


// };




// loadEnquiries();


import {
    db,
    auth,
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    onAuthStateChanged
} from "../../js/firebase.js";


const list =
    document.getElementById("enquiryList");

const search =
    document.getElementById("searchEnquiry");

let enquiries = [];


onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            location.href = "login.html";

        }

    });



async function loadEnquiries() {


    const q =
        query(
            collection(db, "enquiries"),
            orderBy("createdAt", "desc")
        );



    const snap =
        await getDocs(q);


    enquiries = [];

    snap.forEach(item => {
        enquiries.push({
            id: item.id,
            ...item.data()
        });
    });


    render(enquiries);

}


function render(data) {

    list.innerHTML = "";

    if (data.length === 0) {

        list.innerHTML =
            "<p class='empty-text'>No enquiries found</p>";

        return;

    }

    data.forEach(e => {


        list.innerHTML += `

<div class="info-card">

<h3>${e.name}</h3>

<div class="contact-row">📞 ${e.phone}</div>

${e.email ? `<div class="contact-row">✉ ${e.email}</div>` : ""}

<p class="msg">${e.message}</p>

<button class="card-delete" onclick="deleteEnquiry('${e.id}')">Delete</button>

</div>

`;

    });

}


window.deleteEnquiry =
    async (id) => {


        if (!confirm("Delete enquiry?"))
            return;



        await deleteDoc(
            doc(db, "enquiries", id)
        );



        loadEnquiries();


    };


search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const filtered = enquiries.filter(e =>
        e.name?.toLowerCase().includes(value) ||
        e.phone?.includes(value)
    );

    render(filtered);

});


loadEnquiries();