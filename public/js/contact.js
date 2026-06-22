import{
db,
collection,
addDoc,
serverTimestamp
}from "./firebase.js";


const form=
document.getElementById("contactForm");


form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const data={

name:
document.getElementById("name").value.trim(),

phone:
document.getElementById("phone").value.trim(),

email:
document.getElementById("email").value.trim(),

message:
document.getElementById("message").value.trim(),

createdAt:
serverTimestamp()

};



if(!data.name || !data.phone || !data.message){

showToast("Fill all required fields");

return;

}



try{


await addDoc(
collection(db,"enquiries"),
data
);


showToast(
"Message sent successfully"
);


form.reset();



}catch(error){


console.log(error);


showToast(
"Unable to send message"
);


}


});