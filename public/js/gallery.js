import{
db,
collection,
getDocs,
query,
orderBy
}from "./firebase.js";


const gallery=
document.getElementById("galleryList");


async function loadGallery(){


try{


const q=query(
collection(db,"gallery"),
orderBy("createdAt","desc")
);


const snap=
await getDocs(q);


gallery.innerHTML="";


if(snap.empty){

gallery.innerHTML=
"<p>No images available</p>";

return;

}



snap.forEach(doc=>{


const item=doc.data();


gallery.innerHTML+=`

<div class="tour-card">


<div class="tour-thumb-wrap">


<img 
class="tour-thumb"
src="${item.imageUrl}"
loading="lazy">


</div>


<div class="tour-body">


<div class="tour-title">

${item.title || "Travel Memory"}

</div>


</div>


</div>

`;

});


}catch(error){

console.log(error);

gallery.innerHTML=
"<p>Unable to load gallery</p>";

}


}


loadGallery();