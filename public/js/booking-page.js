// import{
// db,
// collection,
// getDocs,
// doc,
// getDoc,
// addDoc,
// serverTimestamp
// }from "./firebase.js";


// const packageSelect =
// document.getElementById("packageSelect");

// const packageIdInput =
// document.getElementById("packageId");

// const bookingAmountInput =
// document.getElementById("bookingAmount");


// // LOAD ALL PACKAGES

// async function loadPackages(){


// const snap =
// await getDocs(
// collection(db,"packages")
// );


// snap.forEach(item=>{


// const p=item.data();


// const option =
// document.createElement("option");


// option.value=item.id;

// option.textContent=p.title;


// option.dataset.amount =
// p.bookingAmount || "";


// packageSelect.appendChild(option);


// });


// }



// loadPackages();




// // WHEN PACKAGE CHANGES

// // packageSelect.addEventListener(
// // "change",
// // async()=>{


// // const id =
// // packageSelect.value;


// // if(!id)
// // return;



// // packageIdInput.value=id;



// // const snap =
// // await getDoc(
// // doc(db,"packages",id)
// // );



// // if(snap.exists()){


// // const data=snap.data();


// // bookingAmountInput.value =
// // data.bookingAmount || "";


// // }



// // });

// packageSelect.addEventListener(
// "change",
// async()=>{


// const id =
// packageSelect.value;


// const travelDate =
// document.getElementById("travelDate");



// travelDate.innerHTML =
// `
// <option value="">
// Select Travel Date
// </option>
// `;



// if(!id){
// return;
// }



// packageIdInput.value=id;



// const snap =
// await getDoc(
// doc(db,"packages",id)
// );



// if(snap.exists()){


// const data =
// snap.data();



// bookingAmountInput.value =
// data.bookingAmount || "";



// if(data.travelDates){


// data.travelDates.forEach(date=>{travelDate.innerHTML +=`<option value="${date.start} to ${date.end}">
// ${date.start} - ${date.end}
// </option>
// `;
// });
// }
// }
// });


// // BOOKING SUBMIT


// document
// .getElementById("bookingPageForm")
// .addEventListener(
// "submit",
// async(e)=>{


// e.preventDefault();



// const screenshot =
// document.getElementById("paymentScreenshot")
// .files[0];



// if(!screenshot){

// showToast(
// "Upload payment screenshot"
// );

// return;

// }





// const booking={


// customerName:
// customerName.value.trim(),


// phone:
// phone.value.trim(),


// email:
// email.value.trim(),



// packageId:
// packageIdInput.value,



// packageTitle:
// packageSelect.options[
// packageSelect.selectedIndex
// ].text,



// travelDate:
// travelDate.value,



// passengers:
// passengers.value,



// bookingAmount:
// bookingAmountInput.value,



// status:"Pending",


// createdAt:
// serverTimestamp()


// };





// if(
// !booking.customerName ||
// !booking.phone ||
// !booking.packageId
// ){

// showToast(
// "Fill all details"
// );

// return;

// }




// try{


// await addDoc(
// collection(db,"bookings"),
// booking
// );



// showToast(
// "Booking successful"
// );



// e.target.reset();



// }
// catch(error){

// console.log(error);

// showToast(
// "Booking failed"
// );


// }


// });



//this is my booking.js file for customer booking not admin/booking.js it is different
import{
db,
collection,
getDocs,
doc,
getDoc,
addDoc,
serverTimestamp
}from "./firebase.js";


const packageSelect =
document.getElementById("packageSelect");

const packageIdInput =
document.getElementById("packageId");

const bookingAmountInput =
document.getElementById("bookingAmount");

const CLOUD_NAME = "dmn0yo5mo";
const UPLOAD_PRESET = "Jay_ganesh_travels";

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


// LOAD ALL PACKAGES

async function loadPackages(){


const snap =
await getDocs(
collection(db,"packages")
);


snap.forEach(item=>{


const p=item.data();


const option =
document.createElement("option");


option.value=item.id;

option.textContent=p.title;


option.dataset.amount =
p.bookingAmount || "";


packageSelect.appendChild(option);


});


}



loadPackages();




// WHEN PACKAGE CHANGES

packageSelect.addEventListener(
"change",
async()=>{


const id =
packageSelect.value;


const travelDate =
document.getElementById("travelDate");



travelDate.innerHTML =
`
<option value="">
Select Travel Date
</option>
`;



if(!id){
return;
}



packageIdInput.value=id;



const snap =
await getDoc(
doc(db,"packages",id)
);



if(snap.exists()){


const data =
snap.data();



bookingAmountInput.value =
data.bookingAmount || "";



if(data.travelDates){


data.travelDates.forEach(date=>{travelDate.innerHTML +=`<option value="${date.start} to ${date.end}">
${date.start} - ${date.end}
</option>
`;
});
}
}
});


// BOOKING SUBMIT


document
.getElementById("bookingPageForm")
.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const screenshot =
document.getElementById("paymentScreenshot")
.files[0];



if(!screenshot){

showToast(
"Upload payment screenshot"
);

return;

}


if(!packageIdInput.value){

showToast(
"Please select a package"
);

return;

}



const submitBtn =
e.target.querySelector("button[type='submit'], button");

if(submitBtn){
submitBtn.disabled = true;
submitBtn.dataset.originalText = submitBtn.innerHTML;
submitBtn.innerHTML = "Uploading...";
}



try{


const screenshotUrl =
await uploadImage(screenshot);



const booking={


customerName:
customerName.value.trim(),


phone:
phone.value.trim(),


email:
email.value.trim(),



packageId:
packageIdInput.value,



packageTitle:
packageSelect.options[
packageSelect.selectedIndex
].text,



travelDate:
travelDate.value,



passengers:
passengers.value,



bookingAmount:
bookingAmountInput.value,



paymentScreenshot:
screenshotUrl,



status:"Pending",


createdAt:
serverTimestamp()


};



if(
!booking.customerName ||
!booking.phone ||
!booking.packageId
){

showToast(
"Fill all details"
);

if(submitBtn){
submitBtn.disabled = false;
submitBtn.innerHTML = submitBtn.dataset.originalText;
}

return;

}



await addDoc(
collection(db,"bookings"),
booking
);



showToast(
"Booking successful"
);



e.target.reset();


}
catch(error){

console.log(error);

showToast(
"Booking failed"
);

}
finally{

if(submitBtn){
submitBtn.disabled = false;
submitBtn.innerHTML = submitBtn.dataset.originalText;
}

}


});